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
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteCard from "@/components/profile/FavoriteCard";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

// Get the full height of the screen
const screenHeight = Dimensions.get("window").height;

interface Museum {
  id: string;
  name: string; // Add other necessary fields as needed
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
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Get the user Exhibition
  useEffect(() => {
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
            museum: museum_id (id, name)
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
            user: user_id (avatar_url)  // Join with profiles table and get avatar_url
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
  }, [id]); // Include `id` in the dependency array to re-run this effect when `id` changes
  const museumPressed = () => {
    router.push({
      pathname: "/(auth)/(drawer)/museum/[id]",
      params: { id: 123 },
    });
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Container */}
      <View style={styles.container2}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: exhibition.cover_photo_url }}
            style={styles.coverImage}
          />
          <View style={styles.gradientOverlay} />
        </View>

        <TouchableOpacity style={styles.logoContainer} onPress={museumPressed}>
          <Image
            source={require("../../../../images/cantor.jpg")}
            style={styles.museumLogo}
          />
        </TouchableOpacity>
      </View>
      {/* TEXT */}
      <View style={{ padding: 12, gap: 12 }}>
        <Text style={{ color: "white" }}>{exhibition?.title} </Text>
        <Text style={{ color: "white" }}>
          {exhibition?.start_date} - {exhibition?.end_date}
        </Text>
        <Text style={{ color: "white" }}>{exhibition?.description}</Text>
      </View>
      {/* Posts */}
      <View style={styles.reviewsContainer}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} pfp={review.user.avatar_url} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    backgroundColor: colors.background,
    gap: 10,
  },
  profileContainer: {
    borderColor: "white",
    borderWidth: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  followersContainer: {
    borderColor: "white",
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
  },
  favoritesContainer: {
    borderColor: "white",
    borderWidth: 2,
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
    resizeMode: "cover",
    position: "absolute",
    zIndex: 10,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -37.5 }, { translateY: -37.5 }], // Adjusting translate based on half of the width and height
  },
});

export default exhibition;
