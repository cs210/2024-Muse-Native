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
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Artifact, ArtifactReviewBasic } from "@/utils/interfaces";
import ArtifactReviewCard from "@/components/profile/ArtifactReviewCard";
import { Ionicons } from "@expo/vector-icons";
// Get the full height of the screen
const screenHeight = Dimensions.get("window").height;

const artifact = () => {
  const { id } = useLocalSearchParams();
  const [artifact, setArtifact] = useState<Artifact>();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ArtifactReviewBasic[]>([]);
  const [reviewsUpdate, setReviewsUpdate] = useState<boolean>(false);
  const [userId, setUserId] = useState("");

  const channels = supabase
    .channel("artifact-reviews-update-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "artifact_reviews",
        filter: "user_id=eq.".concat(userId),
      },
      (payload) => {
        console.log("Change received!", payload);
        setReviewsUpdate(!reviewsUpdate);
      }
    )
    .subscribe();

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const userId = session.user.id;
        setUserId(userId);
      }
    };

    if (id) {
      getUserId();
    }
  }, [id]);

  // Retrieve Artifact and Exhibition data
  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        const { data, error } = await supabase
          .from("artifacts")
          .select(
            `
            id, 
            exhibition: exhibition_id (id, cover_photo_url),
            title,
            artist,
            year,
            description,
            cover_photo_url
            `
          )
          .eq("id", id)
          .returns<Artifact>()
          .single();

        if (error) throw error;

        setArtifact(data);
      } catch (error) {
        console.error("Error fetching artifacts:", error);
      }
      setLoading(false);
    };

    if (id) {
      fetchArtifact();
    }
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("artifact_reviews")
          .select(
            `
            id,
            text,
            rating,
            created_at,
            user: user_id (avatar_url, username),
            artifact: artifact_id (title, cover_photo_url)
          `
          )
          .eq("artifact_id", id)
          .returns<ArtifactReviewBasic[]>();

        if (error) throw error;

        setReviews(data);
        console.log("ARTIFACT REVIEWS: ", data); // Improved logging to display the actual data
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [reviewsUpdate]); // Include `reviewsUpdate` in the dependency array to re-run this effect when `id` changes

  const exhibitionPressed = () => {
    if (artifact) {
      router.push({
        pathname: "/(auth)/(drawer)/exhibition/[id]",
        params: { id: artifact.exhibition.id },
      });
    }
  };

  const writeReviewPressed = () => {
    if (artifact?.exhibition) {
      router.push({
        pathname: "/(auth)/(drawer)/write-review/WriteArtifactReview",
        params: {
          artifactId: artifact.id,
        },
      });
    }
  };

  if (loading) return <Text>Loading...</Text>;

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
              source={{ uri: artifact?.cover_photo_url }}
              style={styles.coverImage}
            />
            <View style={styles.gradientOverlay} />
          </View>

          <TouchableOpacity
            style={styles.logoContainer}
            onPress={exhibitionPressed}
          >
            <Image
              source={{ uri: artifact?.exhibition.cover_photo_url }}
              style={styles.exhibitionLogo}
            />
          </TouchableOpacity>
        </View>

        {/* TEXT */}
        <View style={styles.artifactContainer}>
          <Text style={styles.artifactTitle}>{artifact?.title}</Text>
          <Text style={styles.artifactArtist}>{artifact?.artist}</Text>
          <Text style={styles.artifactYear}>{artifact?.year}</Text>
          <Text style={styles.artifactDescription}>
            {artifact?.description}
          </Text>
        </View>

        <View style={styles.reviewsContainer}>
          {reviews && reviews.length > 0 ? (
            reviews
              .toReversed()
              .map((review) => (
                <ArtifactReviewCard
                  key={review.id}
                  reviewId={review.id}
                  pfp={review.user.avatar_url}
                  username={review.user.username}
                  text={review.text}
                  rating={review.rating}
                  artifactName={review.artifact.title}
                  coverPhoto={review.artifact.cover_photo_url}
                  userId={userId}
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
  exhibitionLogo: {
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
  artifactContainer: {
    paddingHorizontal: 12,
  },
  artifactTitle: {
    fontSize: 20,
    color: colors.white,
    marginBottom: 5,
    fontFamily: "Inter_700Bold",
  },
  artifactDescription: {
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
  artifactArtist: {
    fontSize: 17,
    color: colors.text_pink,
    marginBottom: 2,
    fontFamily: "Inter_400Regular",
  },
  artifactYear: {
    fontSize: 17,
    color: colors.plum_light,
    marginBottom: 10,
  },
  viewAllButton: {},
});

export default artifact;
