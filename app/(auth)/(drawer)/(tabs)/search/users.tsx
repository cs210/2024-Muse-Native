import FollowButton from "@/components/FollowButton";
import colors from "@/styles/colors";
import { Profile } from "@/utils/interfaces";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from "react-native";

const UsersScreen = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userId, setUserId] = useState("");

  const userPressed = useCallback(async (user_id: string) => {
    if (user_id) {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (user_id === user.user?.id) {
        console.log("IM IN PROFILE");
        router.push({
          pathname: "/(auth)/(drawer)/(tabs)/profile",
          params: { id: user_id },
        });
      } else {
        router.push({
          pathname: "/(auth)/(drawer)/user/[id]",
          params: { id: user_id },
        });
      }
    }
  }, []); // Dependency array includes `review`

  useEffect(() => {
    getCurrentUserId();
  }, []);

  const getCurrentUserId = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user) {
      console.log("~ getCurrentUserId ~ user", user);
      console.log("~ getCurrentUserId ~ userId", user.id);
      setUserId(user.id);
    } else {
      console.log("~ getCurrentUserId ~ error", error);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("username", { ascending: true });

    if (error) {
      console.log("~ loadProfiles ~ error", error);
    } else {
      console.log("~ loadProfiles ~ profiles", profiles);
      setProfiles(profiles);
    }
  };

  const renderRow: ListRenderItem<Profile> = ({ item }) => {
    const isSelf = userId === item.id;
    return (
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => userPressed(item.id)}
      >
        <Image
          source={{ uri: item.avatar_url }}
          style={{ height: 50, width: 50, borderRadius: 25 }}
        />
        <View style={styles.nameUserContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{item.first_name}</Text>
            <Text style={styles.nameText}>{item.last_name}</Text>
          </View>
          <Text style={styles.usernameText}>{item.username}</Text>
        </View>
        <View style={isSelf ? styles.noButton : styles.followButtonContainer}>
          <FollowButton currentUserId={userId} profileUserId={item.id} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList data={profiles} renderItem={renderRow} />
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

export default UsersScreen;
