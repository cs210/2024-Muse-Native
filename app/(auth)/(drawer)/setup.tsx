import colors from "@/styles/colors";
import { router } from "expo-router";
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
import React from "react";

// TODO: In the future, we ask people what kind of art they like here.
const Setup = () => {
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
      setMessage("This Username already exists, please pick another one!");
    } else {
      setMessage("Profile updated successfully!");
      router.replace("/(auth)/(drawer)/(tabs)/home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Muse</Text>
        <Text style={styles.messageText}>
          Please fill in your name and username to finish creating an account!
        </Text>
        {/* Email field */}
        <TextInput
          style={styles.inputField}
          placeholder="Your Name"
          placeholderTextColor={"#D5AFC9"}
          onChangeText={setName}
          value={name}
          autoCapitalize="none"
        />

        {/* Email field */}
        <TextInput
          style={styles.inputField}
          placeholder="Username"
          placeholderTextColor={"#D5AFC9"}
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />

        <TouchableOpacity onPress={handlePress} style={styles.logInButton}>
          <Text style={styles.logInText}>Create Account</Text>
        </TouchableOpacity>
        {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 50,
    color: colors.text_pink,
    textAlign: "center",
    fontFamily: "NotoSerif_400Regular",
    margin: 45,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  text: {
    color: colors.text_pink,
    fontFamily: "Poppins_400Regular",
    fontSize: 20,
  },
  inputField: {
    marginVertical: 8,
    height: 47,
    borderRadius: 4,
    padding: 10,
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    backgroundColor: colors.plum,
  },
  messageText: {
    fontSize: 20,
    color: "white",
    marginBottom: 20,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },
  logInButton: {
    marginTop: 20,
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: colors.dark_blue,
    padding: 12,
    borderRadius: 10,
  },
  logInText: {
    color: colors.white,
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
  },
  errorMessage: {
    color: colors.white,
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
  },
});
export default Setup;
