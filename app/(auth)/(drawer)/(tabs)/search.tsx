import colors from "@/styles/colors";
import { Profile } from "@/utils/interfaces";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  Image,
  View,
} from "react-native";

const SearchPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

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
    return (
      <View style={styles.profileContainer}>
        <Image source={{ uri: item.avatar_url }} style={{ height: 50, width: 50, borderRadius: 25, }}/>
        <View style={styles.nameUserContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{item.first_name}</Text>
            <Text style={styles.nameText}>{item.last_name}</Text>
          </View>
          <Text style={styles.usernameText}>{item.username}</Text>
        </View>
      </View>
      
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
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    height: 75,
    backgroundColor: colors.plum,
  },
  profilePicContainer: {
    width: 200,
    height: 200,
    alignSelf: "center",
    borderRadius: 100,
  },
  nameUserContainer: {
    flexDirection: "column",
  },
  nameContainer: {
    backgroundColor: colors.plum_light,
    flexDirection: "row",
    gap: 4,
  },
  usernameText: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  nameText: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
});
export default SearchPage;
