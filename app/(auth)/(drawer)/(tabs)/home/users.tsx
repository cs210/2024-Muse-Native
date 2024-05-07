import colors from "@/styles/colors";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import review from "../../review/[id]";

interface FollowedUser {
  followed_id: string; // Assumed data type, adjust according to your database schema
}

interface Review {
  id: string;
  exhibition_id: string;
  user_id: string;
  text: string;
  created_at: Date;
  user: {
    avatar_url: string;
    username: string;
  };
}

async function fetchReviewsFromFollowedUsers() {
  const { data: user, error: authError } = await supabase.auth.getUser();
  // First, get the list of user IDs that the current user follows
  const { data: followedUsers, error: followError } = await supabase
    .from("user_follows_users")
    .select("following_id")
    .eq("follower_id", user.user?.id);

  if (followError) {
    console.error("Error fetching followed users:", followError);
    return [];
  }

  // Extract the user IDs from the followed users
  console.log(followedUsers);
  const followedUserIds = followedUsers.map((user) => user.following_id);

  // Now, fetch reviews where the user_id is in the list of followed user IDs
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .in("user_id", followedUserIds);

  if (reviewsError) {
    console.error("Error fetching reviews:", reviewsError);
    return [];
  }

  return reviews;
}

const UsersScreen = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviewsFromFollowedUsers().then(setReviews).catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      {reviews.map((review) => (
        <Text key={review.id} style={{ color: "white" }}>
          {review.id}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
  titleText: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  profileContainer: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    height: 75,
    gap: 11,
    backgroundColor: colors.plum,
  },
  profilePicContainer: {
    width: 200,
    height: 200,
    alignSelf: "center",
    borderRadius: 100,
  },
  nameUserContainer: {
    // backgroundColor: colors.plum_light,
    flexDirection: "column",
    justifyContent: "center",
    gap: 2,
  },
  nameContainer: {
    // backgroundColor: colors.plum_light,
    flexDirection: "row",
    gap: 3,
  },
  usernameText: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  nameText: {
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  followButtonContainer: {
    justifyContent: "center",
    marginRight: 10,
    marginLeft: "auto",
  },
  noButton: {
    display: "none",
  },
});

export default UsersScreen;
