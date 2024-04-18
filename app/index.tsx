import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { supabase } from "@/utils/supabase";

const Page = () => { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogInPress = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ 
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    }

    setLoading(false);
  };

  const onSignUpPress = async () => {
    setLoading(true);

    const { 
      data: { session },
      error,
    } = await supabase.auth.signUp({ 
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    } else if (!session) {
      Alert.alert("Check your email for the verification link.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffeffa"/>
          <Text style={{ color: "#ffeffa" }}>Loading...</Text>
        </View>
      )}
      <Text style={styles.header}>Muse</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Email"
        placeholderTextColor={"#ffeffa"}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputField}
        placeholder="Password"
        placeholderTextColor={"#ffeffa"}
        onChangeText={setPassword}
        value={password}
        autoCapitalize="none"
        secureTextEntry
      />
      <TouchableOpacity style={styles.logInButton} onPress={onLogInPress}>
        <Text style={styles.logInText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={onSignUpPress}>
        <Text style={styles.signUpText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 170,
    padding: 20,
    backgroundColor: "#392132",
  },
  header: {
    fontSize: 50,
    color: "#ffeffa",
    textAlign: "center",
    fontFamily: "NotoSerif_400Regular",
    margin: 45,
    marginBottom: 35,
  },
  inputField: {
    marginVertical: 4,
    height: 47,
    borderRadius: 4,
    padding: 10,
    color: "#ffeffa",
    fontFamily: "Inter_400Regular",
    backgroundColor: "#5a324e",
  },
  logInButton: {
    marginTop: 25,
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: "#2a8535",
    padding: 12,
    borderRadius: 4,
  },
  logInText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  signUpButton: {
    alignItems: "center",
    padding: 5,
    borderRadius: 4,
  },
  signUpText: {
    color: "#ffeffa", 
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    elevation: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    gap: 10,
  }
});

/* Do both Apple and Google */

export default Page;
