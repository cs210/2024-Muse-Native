import colors from "@/styles/colors";
import { Stack, useRouter, Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: In the future, we ask people what kind of art they like here.
const setup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  //   const onLogInPress = () => {
  //     navigation.navigate("home");
  //   };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={{ fontSize: 20, color: "white" }}>
          THIS SCREEN WILL ONLY SHOW THE FIRST TIME YOU CREATE AN ACCOUNT{" "}
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

        <Link style={styles.logInButton} href="/(auth)/(drawer)/(tabs)/home">
          <Text style={styles.logInText}>Create Account</Text>
        </Link>
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
