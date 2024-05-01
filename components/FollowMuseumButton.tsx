import React, { useState, useEffect } from "react";
import { Button } from "react-native";
import { supabase } from "@/utils/supabase";

interface FollowButtonProps {
  userId: string; // Assuming user_id is a string. Adjust the type if needed.
  museumId: string; // Assuming museum_id is a number. Adjust the type if needed.
}

const FollowMuseumButton: React.FC<FollowButtonProps> = ({
  userId,
  museumId,
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkFollowingStatus();
  }, []);

  const checkFollowingStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("user_follows_museums")
        .select("*")
        .eq("user_id", userId)
        .eq("museum_id", museumId)
        .single();

      if (error && error.message !== "No rows found") {
        throw error;
      }

      setIsFollowing(!!data);
    } catch (error) {
      alert("Error checking follow status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    setLoading(true);
    if (isFollowing) {
      // Unfollow the museum
      await supabase
        .from("users_follow_museums")
        .delete()
        .match({ user_id: userId, museum_id: museumId });
    } else {
      // Follow the museum
      await supabase
        .from("users_follow_museums")
        .insert([{ user_id: userId, museum_id: museumId }]);
    }
    setIsFollowing(!isFollowing);
    setLoading(false);
  };

  return (
    <Button
      title={isFollowing ? "Following" : "Follow"}
      onPress={handleFollow}
      disabled={loading}
    />
  );
};

export default FollowMuseumButton;
