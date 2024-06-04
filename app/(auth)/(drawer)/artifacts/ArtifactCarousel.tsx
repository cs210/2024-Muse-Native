import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import colors from "@/styles/colors";
import { Artifact } from "@/utils/interfaces";
import { router } from "expo-router";

interface ArtifactCarouselProps {
  artifacts: Artifact[];
}

const artifactPressed = (artifact: Artifact) => {
  if (artifact) {
    router.push({
      pathname: "/(auth)/(drawer)/artifacts/[id]",
      params: { id: artifact.id },
    });
  }
};

const ArtifactCarousel: React.FC<ArtifactCarouselProps> = ({ artifacts }) => {

  const renderItem = ({ item }: { item: Artifact }) => (
    <TouchableOpacity
      style={styles.artifactItem}
      key={item.id}
      onPress={() => artifactPressed(item)}
    >
      <Image
        source={{ uri: item.cover_photo_url }}
        style={styles.artifactImage}
      />
      <Text style={styles.artifactTitle} numberOfLines={3} ellipsizeMode="tail">
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop={false}
        width={125}
        height={160}
        autoPlay={false}
        data={artifacts}
        scrollAnimationDuration={750}
        renderItem={renderItem}
        style={styles.carousel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  carousel: {
    width: 350,
  },
  artifactItem: {
    width: 100,
  },
  artifactImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  artifactTitle: {
    fontSize: 15,
    color: colors.white,
    width: "100%",
    fontFamily: "Inter_700Bold",
  },
});

export default ArtifactCarousel;
