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
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFollowStatus();
  }, [user_id, museum_id]);

  const checkFollowStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("user_follows_museums")
        .select("*")
        .eq("user_id", user_id)
        .eq("museum_id", museum_id)
        .single();

      if (error) throw error;
      setIsFollowing(!!data);
    } catch (error) {
      console.error("Error fetching follow status:", error.message);
    } finally {
      setLoading(false);
    }
  };

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
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleFollow} style={styles.button}>
        <Text>{isFollowing ? "Unfollow" : "Follow"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.plum_light,
  },
});

export default FollowMuseumButton;
