import colors from "@/styles/colors";
import { Artifact } from "@/utils/interfaces";
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
import CircularProgress from "react-native-circular-progress-indicator";

const ArtifactsListPage = () => {
  const { exhibitionId } = useLocalSearchParams();
  const [artifacts, setArtifacts] = useState<Artifact[]>();
  const [loading, setLoading] = useState(true);

  const handleArtifactPress = (artifact: Artifact) => {
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
          <TouchableOpacity
            style={styles.artifactsContainer}
            onPress={() => handleArtifactPress(artifact)}
            key={artifact.id}
          >
            <Image
              source={{ uri: artifact.cover_photo_url }}
              style={{ height: 100, width: 100, borderRadius: 10 }}
            />
            <View style={styles.artifactInfo}>
              <Text
                style={styles.artifactTitle}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {artifact.title}
              </Text>
              <Text
                style={styles.artifactArtist}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {artifact.artist}
              </Text>
              <Text
                style={styles.artifactYear}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {artifact.year}
              </Text>
            </View>
            <View style={styles.circularProgress}>
              {artifact.average_rating ? (
                <CircularProgress
                  value={artifact.average_rating}
                  radius={25}
                  maxValue={5}
                  activeStrokeWidth={8}
                  titleColor={"#FFF"}
                  inActiveStrokeWidth={8}
                  clockwise={false}
                  duration={100}
                  activeStrokeColor={colors.plum_light}
                  progressValueColor={colors.white}
                  progressFormatter={(value: number) => {
                    "worklet";
                    return value.toFixed(1); // 2 decimal places
                  }}
                  circleBackgroundColor={"rgba(0,0,0,0.4)"}
                />
              ) : null}
            </View>
          </TouchableOpacity>
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
    // borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  artifactsContainer: {
    // borderWidth: 1,
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  artifactInfo: {
    marginLeft: 12,
    // borderWidth: 1,
    width: 200,
    flexDirection: "column",
    gap: 2,
  },
  artifactTitle: {
    color: colors.white,
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  artifactArtist: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  artifactYear: {
    color: colors.plum_light,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  circularProgress: {
    flex: 1,
    alignItems: "center",
    // borderWidth: 1,
  },
});

export default ArtifactsListPage;
