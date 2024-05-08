import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "@/styles/colors";
import { FollowedUser, FollowedUsers } from "@/utils/interfaces";

const FollowButton = ({
  currentUserId,
  profileUserId,
}: {
  currentUserId: string;
  profileUserId: string;
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    checkFollowing();
  }, [currentUserId, profileUserId]);

  const checkFollowing = async () => {
    const checkFollowingQuery = supabase
      .from("user_follows_users")
      .select("following_id")
      .eq("follower_id", currentUserId)
      .eq("following_id", profileUserId)
      .returns<FollowedUser[]>()
      .maybeSingle();

    const { data: user, error } = await checkFollowingQuery;
    if (error) {
      console.log("Error with checkFollowingQuery.");
      throw error;
    }
    console.log("~ user ~ following_id", user?.following_id);
    setIsFollowing(user != null);
  };

  const toggleFollow = async () => {
    if (isFollowing) {
      const removeFollowQuery = supabase
        .from("user_follows_users")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profileUserId);

      const { error } = await removeFollowQuery;
      if (error) {
        console.log("Error with removeFollowQuery.");
        throw error;
      }
    } else {
      const followQuery = supabase
        .from("user_follows_users")
        .insert([{ follower_id: currentUserId, following_id: profileUserId }])
        .select();

      const { error } = await followQuery;
      if (error) {
        console.log("Error with followQuery.");
        throw error;
      }
    }
    setIsFollowing(!isFollowing);

    // const method = isFollowing ? "delete" : "array_append";
    // // EVENT: FOLLOW HAPPENED
    // const { error } = await supabase.rpc("update_following_array", {
    //   user_id: currentUserId,
    //   follow_user_id: profileUserId,
    //   method: method,
    //   column_name: "following_ids",
    // });

    // console.log("method:", method);
    // if (error) {
    //   console.log("Error updating follow status", error);
    // }

    // setIsFollowing(!isFollowing);
  };

  return (
    <TouchableOpacity
      style={isFollowing ? styles.followingButton : styles.followButton}
      onPress={toggleFollow}
    >
      <Text style={styles.followButtonText}>
        {isFollowing ? "Following" : "Follow"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  followButton: {
    height: 30,
    width: 100,
    backgroundColor: colors.dark_green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  followButtonText: {
    color: colors.white,
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  followingButton: {
    height: 30,
    width: 100,
    backgroundColor: colors.light_background,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});

export default FollowButton;
