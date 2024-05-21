import colors from "@/styles/colors";
import { ArtifactBasic } from "@/utils/interfaces";
import { supabase } from "@/utils/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ArtifactsListPage = () => {
  const { exhibitionId } = useLocalSearchParams();
  const [artifacts, setArtifacts] = useState<ArtifactBasic[]>();
  const [loading, setLoading] = useState(true);

  const handleArtifactPress = (artifact: ArtifactBasic) => {
    if (artifact) {
      router.push({
        pathname: "/(auth)/(drawer)/artifacts/[id]",
        params: { id: artifact.id },
      });
    }
  };

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const { data, error } = await supabase
          .from("artifacts")
          .select("*")
          .eq("exhibition_id", exhibitionId);

        if (error) throw error;

        setArtifacts(data);
      } catch (error) {
        console.error("Error fetching artifacts:", error);
      }
      setLoading(false);
    };

    if (exhibitionId) fetchArtifacts();
  }, [exhibitionId]);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        {artifacts?.map((artifact) => (
          <View style={styles.artifactsContainer} key={artifact.id}>
            <TouchableOpacity
              onPress={() => handleArtifactPress(artifact)}
              key={artifact.id}
            >
              <Image
                source={{ uri: artifact.cover_photo_url }}
                style={{ height: 200, width: "100%", borderRadius: 20 }}
              />
            </TouchableOpacity>
            <Text style={styles.artifactTitle}>{artifact.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
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
  artifactsContainer: {
    width: "100%",
    paddingHorizontal: 12,
    gap: 12,
    marginBottom: 20,
  },
  artifactTitle: {
    width: "100%",
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
});

export default ArtifactsListPage;
