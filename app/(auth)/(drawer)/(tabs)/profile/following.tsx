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

  return (
    <View style={styles.container}>
      {/* <FlatList data={following} renderItem={renderRow} /> */}
      <Text
        style={{
          color: "white",
          fontSize: 30,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Looks like you got us... This screen is still under construction. Sorry
        about that.
      </Text>
      <Text style={{ color: "white" }}>
        {" "}
        It will eventually show who the user follows.
      </Text>
      {/* <Text >{following}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
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
