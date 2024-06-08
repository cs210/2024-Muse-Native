import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { fetchFollowingUsers } from "@/fetch/followFetch";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/styles/colors";
import FollowButton from "@/components/FollowButton";
import { supabase } from "@/utils/supabase";

interface FollowingUser {
  following_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface FollowingListProps {
  userId: string;
}

const FollowingList: React.FC<FollowingListProps> = () => {
  const [followingUsers, setFollowingUsers] = useState<FollowingUser[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const data = await fetchFollowingUsers(userId);
        setFollowingUsers(data);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {followingUsers.map((user) => (
          <TouchableOpacity
            key={user.following_id}
            onPress={() => userPressed(user.following_id)}
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
                profileUserId={user.following_id}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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

export default FollowingList;
