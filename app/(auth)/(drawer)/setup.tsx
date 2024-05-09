import colors from "@/styles/colors";
import { Stack, useRouter, Link, router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";

// TODO: In the future, we ask people what kind of art they like here.
const setup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const navigation = useNavigation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setMessage("Failed to fetch user: " + error.message);
      } else {
        // console.log(user);
        // Optionally set user details to state here
      }
    };

    fetchUser();
  }, []);

  const handlePress = async () => {
    // href="/(auth)/(drawer)/(tabs)/home"
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("profiles")
      .update({ first_name: name, username: username })
      .eq("id", user?.id);

    if (error) {
      setMessage("Failed to update: " + error.message);
    } else {
      setMessage("Profile updated successfully!");
      router.push("/(auth)/(drawer)/(tabs)/home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={{ fontSize: 20, color: "white", marginBottom: 20 }}>
          Please fill in your name and username to finish creating an account!
        </Text>
        {/* Email field */}
        <TextInput
          style={styles.inputField}
          placeholder="Your Name"
          placeholderTextColor={colors.text_pink}
          onChangeText={setName}
          value={name}
          autoCapitalize="none"
        />

        {/* Email field */}
        <TextInput
          style={styles.inputField}
          placeholder="Username"
          placeholderTextColor={colors.text_pink}
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />

        <TouchableOpacity onPress={handlePress} style={styles.logInButton}>
          <Text style={styles.logInText}>Create Account</Text>
        </TouchableOpacity>
        {message ? <Text>{message}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 47,
    borderRadius: 4,
    padding: 10,
    color: "#ffeffa",
    fontFamily: "Inter_400Regular",
    backgroundColor: colors.plum,
  },
  logInButton: {
    marginTop: 25,
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: colors.light_green,
    padding: 12,
    borderRadius: 4,
  },
  logInText: {
    color: colors.white,
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
});
export default setup;
