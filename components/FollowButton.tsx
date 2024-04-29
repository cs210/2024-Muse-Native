import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { TouchableOpacity, Text } from "react-native";

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
    <TouchableOpacity onPress={toggleFollow}>
      <Text>{isFollowing ? "Following" : "Follow"}</Text>
    </TouchableOpacity>
  );
};

export default FollowButton;
