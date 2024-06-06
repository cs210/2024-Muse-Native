import { supabase } from "@/utils/supabase";

interface FollowingUser {
  following_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface FollowerUser {
  follower_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export const fetchFollowingUsers = async (
  userId: string
): Promise<FollowingUser[]> => {
  try {
    const { data, error } = await supabase
      .from("user_follows_users")
      .select(
        `
        following_id,
        profiles:following_id (
          username,
          avatar_url
        )
      `
      )
      .eq("follower_id", userId);

    if (error) {
      console.error("Error fetching following users:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
};

export const fetchFollowerUsers = async (
  userId: string
): Promise<FollowerUser[]> => {
  try {
    const { data, error } = await supabase
      .from("user_follows_users")
      .select(
        `
          follower_id,
          profiles:follower_id (
            username,
            avatar_url
          )
        `
      )
      .eq("following_id", userId);

    if (error) {
      console.error("Error fetching following users:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
};
