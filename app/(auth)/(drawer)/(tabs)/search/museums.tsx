import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import colors from "@/styles/colors";
import FollowMuseumButton from "@/components/FollowMuseumButton";

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
      <ScrollView style={styles.container}>
        <ActivityIndicator size="large" color={colors.text_pink} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* {museums.length > 0 ? (
        <Text style={styles.titleText}>{museums[0].name}</Text>
      ) : (
        <Text style={styles.titleText}>No museums found.</Text>
      )} */}
      {museums.map((museum) => (
        <View key={museum.id}>
          <Text>{museum.name}</Text>
          <FollowMuseumButton museum_id={museum.id} user_id={userId} />
        </View>
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

export default MuseumsScreen;
