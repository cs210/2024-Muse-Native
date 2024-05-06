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

interface Exhibition {
  id: string;
  title: string;
  cover_photo_url: string;
  museum: {
    username: string; // Assuming the museum table has a 'username' column
  }[];
}

const MuseumsScreen: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      // Assuming the current user's ID is somehow fetched or stored
      const { data: user, error: authError } = await supabase.auth.getUser();
      const userId = user.user?.id;

      // Step 1: Fetch museum IDs the user follows
      const { data: museums, error: museumsError } = await supabase
        .from("user_follows_museums")
        .select("museum_id")
        .eq("user_id", userId);

      if (museumsError) throw new Error(museumsError.message);

      // Step 2: Fetch exhibitions from these museums
      const museumIds = museums.map((museum) => museum.museum_id);
      const { data: exhibitions, error: exhibitionsError } = await supabase
        .from("exhibitions")
        .select("id, title, cover_photo_url, museum: museum_id (username)")
        .in("museum_id", museumIds);

      if (exhibitionsError) throw new Error(exhibitionsError.message);

      setExhibitions(exhibitions);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
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
              museumUsername={exhibition.museum.username}
            />
          </View>
        ))}
      </ScrollView>
      {/* {exhibitions.map((exhibition) => (
        <View key={exhibition.id}>
          <Text>
            {exhibition.title} - Presented by {exhibition.museum.username}
          </Text>
        </View>
      ))} */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
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
  scrollContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
});

export default MuseumsScreen;

// import colors from "@/styles/colors";
// import { StyleSheet, Text, View, ScrollView } from "react-native";
// import MuseumPost from "@/components/MuseumPost";

// const MuseumsScreen = () => {
//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollContainer}>
//         <View style={{ height: 350 }}>
//           <MuseumPost />
//         </View>

//         <View style={{ height: 350 }}>
//           <MuseumPost />
//         </View>

//         <View style={{ height: 350 }}>
//           <MuseumPost />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default MuseumsScreen;

// // import MuseumPost from "@/components/MuseumPost";
// // import colors from "@/styles/colors";
// // import { View, ScrollView, StyleSheet } from "react-native";

// // const HomePage = () => {
// //   return (
// //     <ScrollView style={styles.container}>
// //       <View style={{ height: 350 }}>
// //         <MuseumPost />
// //       </View>
// //       <View style={{ height: 350 }}>
// //         <MuseumPost />
// //       </View>
// //       <View style={{ height: 350 }}>
// //         <MuseumPost />
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 12,
// //     backgroundColor: colors.background,
// //   },
// // });
// // export default HomePage;
