import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "@/styles/colors";
import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { supabase } from "@/utils/supabase";

interface FavoriteCardProps {
  exhibitionId: string; // This prop will hold the review ID passed from the parent
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ exhibitionId }) => {
  const [favoriteImage, setFavoriteImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goToExhibition = () => {
    router.push({
      pathname: "/(auth)/(drawer)/exhibition/[id]",
      params: { id: exhibitionId },
    });
  };

  useEffect(() => {
    const fetchCoverPhoto = async () => {
      try {
        const { data, error } = await supabase
          .from("exhibitions")
          .select("cover_photo_url")
          .eq("id", exhibitionId)
          .single(); // Use 'single' to ensure only one record is returned

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        setFavoriteImage(data.cover_photo_url);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCoverPhoto();
  }, [exhibitionId]);

  if (loading)
    return <Text style={{ color: "white", fontSize: 50 }}>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      <TouchableOpacity onPress={() => goToExhibition(exhibitionId)}>
        <Image
          source={{ uri: favoriteImage }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
});
export default FavoriteCard;
