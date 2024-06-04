import colors from "@/styles/colors";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface LikeButtonProps {
  initialLiked: boolean;
  likeCount: number;
  reviewId: string;
  userId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  initialLiked,
  likeCount,
  reviewId,
  userId,
}) => {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [count, setCount] = useState<number>(likeCount);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setCount(likeCount);
  }, [likeCount]);

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (newLiked) {
      const { error } = await supabase
        .from("user_likes_artifact_reviews")
        .insert([{ user_id: userId, review_id: reviewId }])
        .select();
      if (error) throw error;
      setCount(count + 1);
    } else {
      const { error } = await supabase
        .from("user_likes_artifact_reviews")
        .delete()
        .eq("user_id", userId)
        .eq("review_id", reviewId);
      if (error) throw error;
      setCount(count - 1);
    }
  };

  return (
    <TouchableOpacity onPress={toggleLike} style={styles.button}>
      <Ionicons
        name={liked ? "heart" : "heart-outline"}
        size={25}
        color={colors.text_darker_pink}
      />
      <Text style={styles.likeCount}>{count}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // borderWidth: 1,
    paddingHorizontal: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  likeCount: {
    fontSize: 17,
    color: colors.text_pink,
    marginBottom: 2,
    fontFamily: "Inter_400Regular",
  },
});

export default LikeButton;
