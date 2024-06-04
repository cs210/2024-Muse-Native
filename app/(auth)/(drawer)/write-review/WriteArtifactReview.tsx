import colors from "@/styles/colors";
import { ArtifactBasic } from "@/utils/interfaces";
import { supabase } from "@/utils/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import StarRating from "react-native-star-rating-widget";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const screenHeight = Dimensions.get("window").height;

const WriteArtifactReviewPage = () => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [artifact, setArtifact] = useState<ArtifactBasic>();
  const [userId, setUserId] = useState("");
  const { artifactId } = useLocalSearchParams();

  const getUserId = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      console.log("User ID:", session.user.id);
      const userId = session.user.id;
      setUserId(userId);
    }
  };

  useEffect(() => {
    const getArtifactData = async () => {
      getUserId();
      const artifactDataQuery = supabase
        .from("artifacts")
        .select(
          `
        title,
        artist,
        cover_photo_url,
        exhibition: exhibition_id (title)
      `
        ) // Adjust the selection to include fields from the museum table
        .eq("id", artifactId)
        .returns<ArtifactBasic[]>()
        .single();

      const { data, error } = await artifactDataQuery;
      if (error) {
        console.log("Error retrieving exhibition data.");
        throw error;
      }
      const artifactData = data;
      setArtifact(artifactData);
    };

    if (artifactId) {
      getArtifactData();
    } else {
      console.log("Invalid or missing exhibition ID");
    }
  }, [artifactId]);

  // console.log("Exhibition ID: ", id);

  const onSubmitPress = async () => {
    const { data: artifactReview, error: artifactReviewError } = await supabase
      .from("artifact_reviews")
      .insert([
        {
          user_id: userId,
          artifact_id: artifactId,
          text: review,
          rating: rating,
        },
      ])
      .select();

    if (artifactReviewError) {
      console.log("Error submitting review.");
      throw artifactReviewError;
    }

    console.log("Review Data:", artifactReview);

    // Now, update the average review
    const { data: artifactTable, error: artifactError } = await supabase
      .from("artifacts")
      .select("average_rating, review_count")
      .eq("id", artifactId)
      .single();

    if (artifactError) throw artifactError;

    const newReviewCount = artifactTable.review_count + 1;
    const newAverageRating =
      (artifactTable.average_rating * artifactTable.review_count + rating) /
      newReviewCount;

    const { error: updateError } = await supabase
      .from("artifacts")
      .update({
        average_rating: newAverageRating,
        review_count: newReviewCount,
      })
      .eq("id", artifactId);

    if (updateError) throw updateError;

    router.back();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.outerContainer}
      extraHeight={screenHeight}
      keyboardShouldPersistTaps={"handled"}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps={"handled"}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: artifact?.cover_photo_url }}
            style={styles.coverImage}
          />
        </View>
        <View style={styles.reviewHeader}>
          <Text style={styles.artifactTitle}>{artifact?.title}</Text>
          <Text style={styles.exhibitionTitle}>{artifact?.exhibition.title}</Text>
        </View>
        <View style={styles.starsContainer}>
          <StarRating
            rating={rating}
            onChange={setRating}
            color={colors.plum_light}
            animationConfig={{ scale: 1.1 }}
          />
        </View>
        <TextInput
          style={styles.inputField}
          multiline={true}
          placeholder="Write a review..."
          placeholderTextColor={colors.text_pink}
          onChangeText={setReview}
          value={review}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.submitButton} onPress={onSubmitPress}>
          <Text style={styles.submitText}>Submit review</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  reviewHeader: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  inputField: {
    height: 200,
    borderRadius: 4,
    padding: 10,
    paddingTop: 10,
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    backgroundColor: colors.plum,
  },
  artifactTitle: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 22,
  },
  exhibitionTitle: {
    color: colors.plum_light,
    fontFamily: "Inter_400Regular",
    fontSize: 18,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.dark_blue,
    padding: 12,
    borderRadius: 4,
    marginVertical: 20,
  },
  submitText: {
    color: colors.white,
    fontFamily: "Inter_700Bold",
    fontSize: 15,
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
    borderRadius: 10,
  },
  starsContainer: {
    borderWidth: 2,
    alignItems: "center",
    marginBottom: 12,
  },
});

export default WriteArtifactReviewPage;
