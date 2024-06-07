import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { fetchFollowerUsers } from "@/fetch/followFetch";
import { useLocalSearchParams } from "expo-router";
import colors from "@/styles/colors";
import FollowButton from "@/components/FollowButton";

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
  console.log(userId);

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
      <ScrollView contentContainerStyle={styles.container}>
        {followingUsers.map((user) => (
          <TouchableOpacity
            key={user.follower_id}
            onPress={() => console.log("Pressed")}
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

export default Followers;
