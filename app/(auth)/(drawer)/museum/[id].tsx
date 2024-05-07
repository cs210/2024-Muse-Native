import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import colors from "@/styles/colors";
import { supabase } from "@/utils/supabase";
import { useState, useEffect } from "react";
// Get the full height of the screen
const screenHeight = Dimensions.get("window").height;

interface Museum {
  id: string;
  name: string;
  username: string;
  coverPhotoUrl: string;
  profilePhotoUrl: string;
  bio: string;
}

interface Exhibition {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  museum_id: string;
  description?: string;
  cover_photo_url?: string;
}

const museum: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [museum, setMuseum] = useState<Museum | null>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  async function fetchMuseumById(museumId: string | string[]) {
    const { data, error } = await supabase
      .from("museums")
      .select("*")
      .eq("id", museumId)
      .single();

    if (error) {
      console.error("Error fetching museum:", error);
      return;
    }

    setMuseum(data);
  }

  async function fetchExhibitionsForMuseum(museumId: string | string[]) {
    const { data, error } = await supabase
      .from("exhibitions")
      .select("*")
      .eq("museum_id", museumId);

    if (error) {
      console.error("Error fetching exhibitions:", error);
      return;
    }

    setExhibitions(data);
  }

  useEffect(() => {
    if (id) {
      fetchMuseumById(id);
      fetchExhibitionsForMuseum(id);
    }
  }, [id]); // Dependency on 'id' ensures fetch is re-run if 'id' changes

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Container */}
      <View style={styles.container2}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../../images/cantor.jpg")}
            style={styles.coverImage}
          />
          <View style={styles.gradientOverlay} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.museumInfo}>
            <TouchableOpacity style={styles.logoContainer}>
              <Image
                source={require("../../../../images/cantor.jpg")}
                style={styles.museumLogo}
              />
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 20 }}>
              {" "}
              {museum?.username}{" "}
            </Text>
          </View>
          <Text> Follow </Text>
        </View>
      </View>
      {/* TEXT */}
      <Text style={{ color: "white" }}> {museum?.bio} </Text>
      <Text style={{ color: "white" }}> What's On </Text>

      {exhibitions.map((exhibition) => (
        <Image
          key={exhibition.id}
          source={{ uri: exhibition.cover_photo_url }}
          style={{ height: 100, width: 200 }}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  whatsOnScroll: {
    display: "flex",
    flexDirection: "row",
    borderColor: "white",
    gap: 100,
    borderWidth: 2,
  },
  container: {
    backgroundColor: colors.background,
    gap: 10,
  },
  museumInfo: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-start",
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
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    height: 75,
    width: 75,
    overflow: "hidden",
    borderRadius: 75,
    borderWidth: 2,
  },
  museumLogo: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
});

export default museum;
