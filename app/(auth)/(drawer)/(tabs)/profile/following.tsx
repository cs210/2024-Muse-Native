import { useLocalSearchParams } from "expo-router";
import FollowButton from "@/components/FollowButton";
import colors from "@/styles/colors";
import { Profile } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  Image,
  View,
} from "react-native";
const followers = () => {
  const { following, userId } = useLocalSearchParams();

  // const renderRow: ListRenderItem<Profile> = ({ item }) => {
  //   return (
  //     <View style={styles.profileContainer}>
  //       <Image
  //         source={{ uri: item.avatar_url }}
  //         style={{ height: 50, width: 50, borderRadius: 25 }}
  //       />
  //       <View style={styles.nameUserContainer}>
  //         <View style={styles.nameContainer}>
  //           <Text style={styles.nameText}>{item.first_name}</Text>
  //           <Text style={styles.nameText}>{item.last_name}</Text>
  //         </View>
  //         <Text style={styles.usernameText}>{item.username}</Text>
  //       </View>
  //       <View style={styles.followButtonContainer}>
  //         <FollowButton currentUserId={userId} profileUserId={item.id} />
  //       </View>
  //     </View>
  //   );
  // };
  return (
    <View style={styles.container}>
      {/* <FlatList data={following} renderItem={renderRow} /> */}
      <Text>{following}</Text>
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

export default followers;
