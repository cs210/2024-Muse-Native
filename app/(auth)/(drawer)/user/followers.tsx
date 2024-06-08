import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import { fetchFollowerUsers } from "@/fetch/followFetch";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/styles/colors";
import FollowButton from "@/components/FollowButton";
import CustomHeader from "@/components/CustomHeader";
import { supabase } from "@/utils/supabase";

interface FollowerUser {
  follower_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface FollowingListProps {
  userId: string;
}

const Followers: React.FC<FollowingListProps> = () => {
  const [followingUsers, setFollowingUsers] = useState<FollowerUser[]>([]);
  const { userId } = useLocalSearchParams();
  const userPressed = useCallback(async (user_id: string) => {
    if (user_id) {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (user_id === user.user?.id) {
        console.log("IM IN PROFILE");
        router.push({
          pathname: "/(auth)/(drawer)/(tabs)/profile",
          params: { id: user_id },
        });
      } else {
        router.push({
          pathname: "/(auth)/(drawer)/user/[id]",
          params: { id: user_id },
        });
      }
    }
  }, []);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const data = await fetchFollowerUsers(userId);
        setFollowingUsers(data);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <View style={styles.outerContainer}>
      <CustomHeader title={"Following"} scrollY={scrollY} />
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {followingUsers.map((user) => (
          <TouchableOpacity
            key={user.follower_id}
            onPress={() => userPressed(user.follower_id)}
          >
            <View style={styles.profileContainer}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Image
                  source={{ uri: user.profiles.avatar_url }}
                  style={{ height: 50, width: 50, borderRadius: 25 }}
                />
                <View style={styles.nameUserContainer}>
                  <Text style={styles.nameText}>{user.profiles.username}</Text>
                </View>
              </View>
              <FollowButton
                currentUserId={userId}
                profileUserId={user.follower_id}
              />
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingBottom: 300,
  },
  profileContainer: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 75,
    backgroundColor: colors.plum,
  },
  nameUserContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  nameText: {
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
});

export default Followers;