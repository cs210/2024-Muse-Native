import colors from "@/styles/colors";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { supabase } from "@/utils/supabase";

interface FollowMuseumButtonProps {
  user_id: string;
  museum_id: string;
}

const FollowMuseumButton: React.FC<FollowMuseumButtonProps> = ({
  user_id,
  museum_id,
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("user_follows_museums")
          .select("*")
          .eq("user_id", user_id)
          .eq("museum_id", museum_id);
  
        if (error) throw error;
        setIsFollowing(data.length > 0); // Check if the array is not empty
      } catch (error) {
        console.error("Error fetching follow status:", error.message);
      } finally {
        setLoading(false);
      }
    };
    checkFollowStatus();
  }, [user_id, museum_id]);

  

  const toggleFollow = async () => {
    setLoading(true);
    if (isFollowing) {
      // Unfollow logic
      const { error } = await supabase
        .from("user_follows_museums")
        .delete()
        .match({ user_id, museum_id });

      if (error) {
        console.error("Error unfollowing:", error.message);
      } else {
        setIsFollowing(false);
      }
    } else {
      // Follow logic
      const { error } = await supabase
        .from("user_follows_museums")
        .insert([{ user_id, museum_id }]);

      if (error) {
        console.error("Error following:", error.message);
      } else {
        setIsFollowing(true);
      }
    }
    setLoading(false);
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={isFollowing ? styles.followingButton : styles.followButton}>
      <TouchableOpacity onPress={toggleFollow}>
        <Text style={styles.followButtonText}>
          {isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
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

export default FollowMuseumButton;
