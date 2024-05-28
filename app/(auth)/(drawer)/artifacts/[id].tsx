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
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Artifact, Exhibition } from "@/utils/interfaces";
// Get the full height of the screen
const screenHeight = Dimensions.get("window").height;

const artifact = () => {
  const { id } = useLocalSearchParams();
  const [exhibition, setExhibition] = useState<Exhibition>();
  const [artifact, setArtifact] = useState<Artifact>();
  const [loading, setLoading] = useState(true);

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

  const exhibitionPressed = () => {
    if (artifact) {
      router.push({
        pathname: "/(auth)/(drawer)/exhibition/[id]",
        params: { id: artifact.exhibition.id },
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
          <Text style={styles.artifactTitle}>{artifact?.title} </Text>
          <Text style={styles.artifactDescription}>
            {artifact?.description}
          </Text>
        </View>
        
        {/* <View style={styles.reviewsContainer}>
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
        </View> */}
      </ScrollView>
      {/* <TouchableOpacity style={styles.fab} onPress={writeReviewPressed}>
        <Ionicons name="create-outline" size={32} color={colors.white} />
      </TouchableOpacity> */}
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
    gap: 12,
  },
  artifactTitle: {
    fontSize: 24,
    color: colors.text_pink,
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
  artifactsHeader: {
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  artifactsOuterContainer: {
    gap: 10,
  },
  artifactsContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.light_background,
    backgroundColor: colors.light_background,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  viewAllButton: {},
});

export default artifact;
