import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import colors from "@/styles/colors";
import FollowMuseumButton from "@/components/FollowMuseumButton";
import { router } from "expo-router";

interface Museum {
  id: string;
  name: string;
  username: string;
  profilePhotoUrl: string;
}

const MuseumsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [userId, setUserId] = useState("");

  const handleMuseumPressed = (museumid: string) => {
    router.push({
      pathname: "/(auth)/(drawer)/museum/[id]",
      params: { id: museumid },
    });
  };

  useEffect(() => {
    const getMuseums = async () => {
      setLoading(true);

      const { data: user, error: authError } = await supabase.auth.getUser();
      if (user.user) {
        setUserId(user.user.id);
        // Continue with fetching museums or other logic that depends on userId
      }
      try {
        const { data, error } = await supabase.from("museums").select(`*`);
        if (error) {
          throw error;
        }
        setMuseums(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getMuseums();
  }, []);

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ActivityIndicator size="large" color={colors.text_pink} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* {museums.length > 0 ? (
        <Text style={styles.titleText}>{museums[0].name}</Text>
      ) : (
        <Text style={styles.titleText}>No museums found.</Text>
      )} */}
      {museums.map((museum) => (
        <TouchableOpacity
          key={museum.id}
          onPress={() => handleMuseumPressed(museum.id)}
        >
          <View style={styles.profileContainer}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Image
                source={{ uri: museum.profilePhotoUrl }}
                style={{ height: 50, width: 50, borderRadius: 25 }}
              />
              <View style={styles.nameUserContainer}>
                <Text style={styles.nameText}>{museum.username}</Text>
              </View>
            </View>
            <FollowMuseumButton user_id={userId} museum_id={museum.id} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
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

export default MuseumsScreen;
