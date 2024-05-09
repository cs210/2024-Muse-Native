import colors from "@/styles/colors";
import { ExhibitionBasic } from "@/utils/interfaces";
import { supabase } from "@/utils/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const screenHeight = Dimensions.get("window").height;

const WriteReviewPage = () => {
  const [review, setReview] = useState("");
  const [exhibition, setExhibition] = useState<ExhibitionBasic>({
    title: "Exhibition Title",
    cover_photo_url: "cover_photo_url",
    museum: { name: "Museum Name" },
  });
  const [userId, setUserId] = useState("");
  const { id } = useLocalSearchParams();

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
    const getExhibitionData = async () => {
      getUserId();
      const exhibitionDataQuery = supabase
        .from("exhibitions")
        .select(
          `
        title,
        cover_photo_url,
        museum: museum_id (name)
      `
        ) // Adjust the selection to include fields from the museum table
        .eq("id", id)
        .returns<ExhibitionBasic[]>()
        .single();

      const { data, error } = await exhibitionDataQuery;
      if (error) {
        console.log("Error retrieving exhibition data.");
        throw error;
      }
      const exhibitionData = data;

      console.log("Data: ", exhibitionData);
      console.log("data.museum_id", exhibitionData.museum.name);

      setExhibition(exhibitionData);
    };

    if (id) {
      getExhibitionData();
    } else {
      console.log("Invalid or missing exhibition ID");
    }
  }, [id]);

  // console.log("Exhibition ID: ", id);

  const onSubmitPress = async () => {
    
    const { data, error } = await supabase
      .from("reviews")
      .insert([{ user_id: userId, exhibition_id: id, text: review }])
      .select();

    if (error) {
      console.log("Error submitting review.");
      throw error;
    }

    console.log("Review Data:", data);

    router.back();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.outerContainer}
      extraHeight={screenHeight}
      keyboardShouldPersistTaps={"handled"}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps={"handled"}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: exhibition.cover_photo_url }}
            style={styles.coverImage}
          />
        </View>
        <View style={styles.reviewHeader}>
          <Text style={styles.exhibitionTitle}>{exhibition.title}</Text>
          <Text style={styles.museumName}>{exhibition.museum.name}</Text>
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
  exhibitionTitle: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 22,
  },
  museumName: {
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
});

export default WriteReviewPage;
