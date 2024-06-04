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
import { format } from "date-fns";
import { Artifact } from "@/utils/interfaces";
import ArtifactCarousel from "../artifacts/ArtifactCarousel";
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
  const [exhibition, setExhibition] = useState<Exhibition>();
  const [artifacts, setArtifacts] = useState<Artifact[]>();
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
          .returns<Exhibition>()
          .single();

        if (error) {
          throw error;
        }

        setExhibition(data);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  useEffect(() => {
    const getArtifactsData = async () => {
      try {
        const { data, error } = await supabase
          .from("artifacts")
          .select("*")
          .eq("exhibition_id", id)
          .limit(10);

        if (error) throw error;
        console.log("Artifacts data: ", data);

        setArtifacts(data);
      } catch (error) {
        console.error("Error fetching artifacts:", error);
      }
    };

    if (id) {
      getArtifactsData();
    }
  }, [id]);
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
          exhibitionId: exhibition.id,
        },
      });
    }
  };

  const viewAllArtifactsPressed = () => {
    if (exhibition) {
      router.push({
        pathname: "/(auth)/(drawer)/artifacts/ArtifactsList",
        params: { exhibitionId: exhibition.id },
      });
    }
  };

  const artifactPressed = (artifact: Artifact) => {
    if (artifact) {
      router.push({
        pathname: "/(auth)/(drawer)/artifacts/[id]",
        params: { id: artifact.id },
      });
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  // if (exhibition?.end_date === null) {
  //   exhibition.end_date = "Ongoing";
  // }

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
        <View style={styles.exhibitionContainer}>
          <Text style={styles.exhibitionTitle}>{exhibition?.title} </Text>
          <Text style={styles.exhibitionDates}>
            {format(exhibition?.start_date, "MMM d, yyyy")} -{" "}
            {/* {format(exhibition?.end_date, "MMM, d yyyy")} */}
            {exhibition?.end_date === null
              ? "Ongoing"
              : format(exhibition?.end_date, "MMM d, yyyy")}
          </Text>
          <View style={styles.artifactsOuterContainer}>
            <View style={styles.artifactsAndViewAllContainer}>
              <Text style={styles.artifactsHeader}>Artifacts</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={viewAllArtifactsPressed}>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={32}
                  color={colors.text_pink}
                />
              </TouchableOpacity>
            </View>

            {/* {artifacts?.map((artifact) => (
                <TouchableOpacity
                  style={styles.artifactItem}
                  key={artifact.id}
                  onPress={() => {
                    artifactPressed(artifact);
                  }}
                >
                  <Image
                    source={{ uri: artifact.cover_photo_url }}
                    style={styles.artifactImage}
                  />
                  <Text
                    style={styles.artifactTitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {artifact.title}
                  </Text>
                </TouchableOpacity>
              ))} */}
            <ArtifactCarousel artifacts={artifacts ?? []} />
          </View>
          <Text style={styles.exhibitionDescription}>
            {exhibition?.description}
          </Text>
        </View>
        {/* Posts */}
        <View style={styles.reviewsContainer}>
          {reviews && reviews.length > 0 ? (
            reviews
              .toReversed()
              .map((review) => (
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
            <Text style={styles.noReviewsStyle}>
              No reviews available. Be the first to review this!
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
    marginBottom: 60,
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
  exhibitionContainer: {
    paddingHorizontal: 12,
  },
  exhibitionTitle: {
    fontSize: 24,
    color: colors.text_pink,
    marginBottom: 5,
  },
  exhibitionDates: {
    fontSize: 15,
    color: colors.plum_light,
    marginBottom: 12,
  },
  exhibitionDescription: {
    fontSize: 15,
    color: colors.text_pink,
    lineHeight: 25,
  },
  noReviewsStyle: {
    textAlign: "center",
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    // marginBottom: 75,
  },
  artifactsHeader: {
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  artifactsOuterContainer: {
    gap: 5,
    marginBottom: 15,
  },
  artifactsAndViewAllContainer: {
    // borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  artifactsContainer: {
    // borderWidth: 1,
    borderRadius: 10,
    // borderColor: colors.light_background,
    // backgroundColor: colors.light_background,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    gap: 10,
  },
  artifactItem: {
    flex: 1,
  },
  artifactImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  artifactTitle: {
    fontSize: 15,
    color: colors.white,
    width: "100%",
  },
});

export default exhibition;
