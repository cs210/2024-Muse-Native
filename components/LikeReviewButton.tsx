import colors from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface LikeButtonProps {
    initialLiked?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ initialLiked = false }) => {
    const [liked, setLiked] = useState(initialLiked);
  
    useEffect(() => {
      setLiked(initialLiked);
    }, [initialLiked]);
  
    const toggleLike = () => {
      setLiked(!liked);
    };
  
    return (
      <TouchableOpacity onPress={toggleLike} style={styles.button}>
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={25}
          color={colors.text_darker_pink}
        />
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    button: {
        // borderWidth: 1,
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },
  });
  
  export default LikeButton;