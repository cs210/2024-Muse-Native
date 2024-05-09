import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { supabase } from "@/utils/supabase";
import MuseumPost from "@/components/MuseumPost";
import colors from "@/styles/colors";
import { ExhibitionAndMuseum } from "@/utils/interfaces";

const MuseumsScreen: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<ExhibitionAndMuseum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;

      // Fetch museum IDs the user follows
      const { data: museums, error: museumsError } = await supabase
        .from("user_follows_museums")
        .select("museum_id")
        .eq("user_id", userId);

      if (museumsError) throw new Error(museumsError.message);

      // Fetch exhibitions from these museums, including museum details
      const museumIds = museums.map((museum) => museum.museum_id);
      const { data: exhibitions, error: exhibitionsError } = await supabase
        .from("exhibitions")
        .select(
          `
          id, 
          title, 
          cover_photo_url, 
          museum: museum_id (
            id,
            username,
            profilePhotoUrl
          )
        `
        )
        .in("museum_id", museumIds);

      if (exhibitionsError) throw new Error(exhibitionsError.message);

      // const processedExhibitions = exhibitions.map((exhibition) => ({
      //   ...exhibition,
      //   museum: exhibition.museum, // directly use the museum object
      // }));

      setExhibitions(exhibitions);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, backgroundColor: colors.background }}
        color={colors.text_darker_pink}
      />
    );
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {exhibitions.map((exhibition) => (
          <View key={exhibition.id} style={{ height: 350 }}>
            <MuseumPost
              id={exhibition.id}
              title={exhibition.title}
              coverPhotoUrl={exhibition.cover_photo_url}
              museumUsername={exhibition?.museum?.username}
              museumId={exhibition?.museum?.id}
              museumPfp={exhibition?.museum?.profilePhotoUrl}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
});

export default MuseumsScreen;
