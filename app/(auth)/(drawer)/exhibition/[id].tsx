import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/styles/colors";
import ReviewCard from "@/components/profile/ReviewCard";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";

// Get the full height of the screen
const screenHeight = Dimensions.get("window").height;

interface Museum {
  id: string;
  name: string; // Add other necessary fields as needed
  profilePhotoUrl: string;
}

interface Exhibition {
  id: string;
  museum_id: string;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  cover_photo_url: string;
  ticket_link: string;
  museum: Museum;
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

// Museum Name
// User Photo
// pass museum id
// pass title: string;

const exhibition = () => {
  const { id } = useLocalSearchParams();
  //  console.log("Exhibition ID:", id);
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsUpdate, setReviewsUpdate] = useState<boolean>(false);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  const channels = supabase
    .channel("custom-update-channel-1")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "reviews",
        filter: "user_id=eq.".concat(userId),
      },
      (payload) => {
        console.log("Change received!", payload);
        setReviewsUpdate(!reviewsUpdate);
      }
    )
    .subscribe();
  // Get the user Exhibition
  useEffect(() => {
    console.log("ID  " + id);
    const getExhibitionData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("exhibitions")
          .select(
            `
            id,
            museum_id,
            title,
            start_date,
            end_date,
            description,
            cover_photo_url,
            ticket_link,
            museum: museum_id (id, name, profilePhotoUrl)
          `
          ) // Adjust the selection to include fields from the museum table
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setExhibition(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
      setLoading(false);
    };

    if (id) {
      getExhibitionData();
    } else {
      setError("Invalid or missing exhibition ID");
      setLoading(false);
    }
  }, [id]); // Include id as a dependency to re-run the effect if id changes
  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const { data: reviewsData, error } = await supabase
          .from("reviews")
          .select(
            `
            id,
            exhibition_id,
            user_id,
            text,
            created_at,
            user: user_id (avatar_url, username)  // Join with profiles table and get avatar_url
          `
          )
          .eq("exhibition_id", id);

        if (error) throw error;

        setReviews(reviewsData);
        console.log("REVIEWS: ", reviewsData); // Improved logging to display the actual data
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviewsError(error.message);
      }
      setReviewsLoading(false);
    };

    if (id) {
      fetchReviews();
    }
  }, [reviewsUpdate]); // Include `reviewsUpdate` in the dependency array to re-run this effect when `id` changes

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // console.log("User ID:", session.user.id);
        const userId = session.user.id;
        setUserId(userId);
      }
    };

    if (id) {
      getUserId();
    } else {
      console.log("Invalid or missing exhibition ID");
    }
  }, [id]);

  const museumPressed = () => {
    if (exhibition) {
      router.push({
        pathname: "/(auth)/(drawer)/museum/[id]",
        params: { id: exhibition.museum_id },
      });
    }
  };

  const writeReviewPressed = () => {
    if (exhibition) {
      console.log(exhibition.title);
      router.push({
        pathname: "/(auth)/(drawer)/write-review/WriteReview",
        params: {
          id: exhibition.id,
        },
      });
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Container */}
        <View style={styles.container2}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: exhibition?.cover_photo_url }}
              style={styles.coverImage}
            />
            <View style={styles.gradientOverlay} />
          </View>

          <TouchableOpacity
            style={styles.logoContainer}
            onPress={museumPressed}
          >
            <Image
              source={{ uri: exhibition?.museum.profilePhotoUrl }}
              style={styles.museumLogo}
            />
          </TouchableOpacity>
        </View>

        {/* TEXT */}
        <View style={{ padding: 12, gap: 12 }}>
          <Text style={styles.exhibitionTitle}>{exhibition?.title} </Text>
          <Text style={styles.exhibitionDates}>
            {exhibition?.start_date} - {exhibition?.end_date}
          </Text>
          <Text style={styles.exhibitionDescription}>
            {exhibition?.description}
          </Text>
        </View>
        {/* Posts */}
        <View style={styles.reviewsContainer}>
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review.id}
                reviewId={review.id}
                pfp={review.user.avatar_url}
                username={review.user.username}
                text={review.text}
                museumId={exhibition?.museum_id}
                exhibitionId={exhibition?.id}
                museumName={exhibition?.museum.name}
                exhibitionName={exhibition?.title}
                coverPhoto={exhibition?.cover_photo_url}
                user_id={review.user_id}
                showImage={false}
              />
            ))
          ) : (
            <Text style={{ color: "white" }}>
              No reviews available be the first person to review this
            </Text>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={writeReviewPressed}>
        <Ionicons name="create-outline" size={32} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    backgroundColor: colors.background,
    gap: 10,
    paddingBottom: 20,
  },
  profileContainer: {
    borderColor: "white",
    // borderWidth: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  followersContainer: {
    borderColor: "white",
    // borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
  },
  favoritesContainer: {
    borderColor: "white",
    // borderWidth: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  follow: {
    padding: 4,
    display: "flex",
    justifyContent: "center",
    gap: 4,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
  },
  text: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  signUpButton: {
    alignItems: "center",
    padding: 5,
    borderRadius: 4,
  },
  userNameText: {
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  favoriteScroll: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
  },
  reviewsContainer: {
    gap: 12,
    padding: 12,
  },
  container2: {
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: screenHeight * 0.3,
    overflow: "hidden",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    zIndex: 2,
    // React Native doesn't directly support CSS gradients,
    // you might need to use an image or external library to simulate gradients
  },
  logoContainer: {
    height: 75,
    width: 75,
    position: "absolute",
    bottom: 10,
    right: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  museumLogo: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  fab: {
    position: "absolute",
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: colors.dark_blue,
    borderRadius: 32,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: "white",
  },
  exhibitionTitle: {
    fontSize: 24,
    color: colors.text_pink,
  },
  exhibitionDates: {
    fontSize: 15,
    color: colors.plum_light,
  },
  exhibitionDescription: {
    fontSize: 15,
    color: colors.text_pink,
    lineHeight: 25,
  },
});

export default exhibition;
