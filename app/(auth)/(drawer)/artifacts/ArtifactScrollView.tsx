import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
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

const ArtifactScrollView: React.FC<ArtifactCarouselProps> = ({ artifacts }) => {
  console.log(artifacts);
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {artifacts.map((artifact, index) => (
          <View key={index} style={styles.artifactContainer}>
            <Image
              style={styles.artifactImage}
              source={{
                uri: artifact.cover_photo_url,
              }}
            />
            <Text style={styles.artifactTitle} numberOfLines={3}>
              {artifact.title}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  artifactContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  artifactImage: {
    marginTop: 8,
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  artifactTitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    width: 120,
  },
});

export default ArtifactScrollView;
//   const renderItem = ({ item }: { item: Artifact }) => (
//     <TouchableOpacity
//       style={styles.artifactItem}
//       key={item.id}
//       onPress={() => artifactPressed(item)}
//     >
//       <Image
//         source={{ uri: item.cover_photo_url }}
//         style={styles.artifactImage}
//       />
//       <Text style={styles.artifactTitle} numberOfLines={3} ellipsizeMode="tail">
//         {item.title}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.carouselContainer}>
//       <Carousel
//         loop={false}
//         width={125}
//         height={160}
//         autoPlay={false}
//         data={artifacts}
//         scrollAnimationDuration={750}
//         renderItem={renderItem}
//         style={styles.carousel}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   carouselContainer: {
//     flex: 1,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   carousel: {
//     width: 350,
//   },
//   artifactItem: {
//     width: 100,
//   },
//   artifactImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//   },
//   artifactTitle: {
//     fontSize: 15,
//     color: colors.white,
//     width: "100%",
//     fontFamily: "Inter_700Bold",
//   },
// });

// export default ArtifactScrollView;
