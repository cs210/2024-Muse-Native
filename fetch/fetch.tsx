import { supabase } from "../utils/supabase";

export const checkLikedStatus = async (
  userId: string,
  reviewId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("like_reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("review_id", reviewId);

  if (error) {
    console.error("Error checking liked status:", error);
    return false;
  }

  return data.length > 0;
};

export const fetchLikeCount = async (reviewId: string) => {
  const { data, error, count } = await supabase
    .from("like_reviews")
    .select("*", { count: "exact" })
    .eq("review_id", reviewId);

  if (error) {
    console.error("Error fetching like count:", error);
    return 0;
  }

  return count || 0;
};

export const toggleLike = async (
  liked: boolean,
  userId: string,
  reviewId: string
) => {
  if (liked) {
    const { error } = await supabase
      .from("like_reviews")
      .delete()
      .eq("user_id", userId)
      .eq("review_id", reviewId);

    if (error) {
      console.error("Error unliking review:", error);
      return false;
    }
    return true;
  } else {
    const { error } = await supabase
      .from("like_reviews")
      .insert([{ user_id: userId, review_id: reviewId }]);

    if (error) {
      console.error("Error liking review:", error);
      return false;
    }
    return true;
  }
};
