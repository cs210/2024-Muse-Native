import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "@/styles/colors";

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
    const { data, error } = await supabase
      .from("profiles")
      .select("following_ids")
      .eq("id", currentUserId)
      .single();

    if (error) {
      console.log("Error fetching following data", error);
    }
    console.log("~ checkFollowing ~ data", data);
    if (!data?.following_ids) {
      setIsFollowing(false);
    } else {
      setIsFollowing(data?.following_ids.includes(profileUserId));
    }
  };

  const toggleFollow = async () => {
    const method = isFollowing ? "array_remove" : "array_append";

    const { error } = await supabase.rpc("update_following_array", {
      user_id: currentUserId,
      follow_user_id: profileUserId,
      method: method,
      column_name: "following_ids",
    });

    console.log("method:", method);
    if (error) {
      console.log("Error updating follow status", error);
    }

    setIsFollowing(!isFollowing);
  };

  return (
    <TouchableOpacity style={isFollowing ? styles.followingButton : styles.followButton} onPress={toggleFollow}>
      <Text style={styles.followButtonText}>{isFollowing ? "Following" : "Follow"}</Text>
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
  }
});

export default FollowButton;
