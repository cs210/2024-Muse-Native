const dummyMuseum = {
  coverPhotoUrl: "./static/cantor-front-no-yo.jpg",
  profilePhotoUrl: "./static/cantor-pfp.png",
  name: "Cantor Arts Center",
  username: "cantorarts",
};

const dummyExhibition = {
  museum_id: null,
  name: "The Harlem Renaissance and Transatlantic Modernism",
  reviews: [1, 5], // TODO: Check how to do this
  description:
    "Through some 160 works of painting, sculpture, photography, film, and ephemera, it will explore the comprehensive and far-reaching ways in which Black artists portrayed everyday modern life in the new Black cities that took shape in the 1920s–40s in New York City’s Harlem and nationwide in the early decades of the Great Migration when millions of African Americans began to move away from the segregated rural South.",
  start_date: "2024-03-06",
  end_date: "2024-07-26",
  cover_photo_url: "./static/harlem-renaissance.png",
  museum_pfp: "./static/the-met-pfp.jpeg",
  museum_user: "@themet",
  ticket_link:
    "https://engage.metmuseum.org/admission/?promocode=52356&_gl=1*1bknboy*_ga*Nzg1NTU2OTE0LjE3MTAxMjcwODY.*_ga_Y0W8DGNBTB*MTcxMDM5NTE0MS4zLjEuMTcxMDM5NTE2My4wLjAuMA..",
};

// ! TO Add Data
// const ProfilePage = () => {
//     const exhibitionData = {
//       coverPhotoUrl: "./static/cantor-front-no-yo.jpg",
//       profilePhotoUrl: "./static/cantor-pfp.png",
//       name: "Cantor Arts Center",
//       username: "cantorarts",
//     };

//     async function addExhibition(exhibitionData: any) {
//       const { data, error } = await supabase
//         .from("museums")
//         .insert([exhibitionData]);

//       if (error) {
//         console.error("Error inserting exhibition:", error);
//         return null;
//       }

//       return data;
//     }

//     const onSignUpPress = async () => {
//       addExhibition(exhibitionData)
//         .then((data) => {
//           console.log("Exhibition added:", data);
//         })
//         .catch((error) => {
//           console.error("Failed to add exhibition:", error);
//         });
//     };

//     return (
//       <ScrollView style={styles.container}>
//         <Text style={styles.text}>Profile</Text>
//         <TouchableOpacity style={styles.signUpButton} onPress={onSignUpPress}>
//           <Text style={styles.signUpText}>Sign up</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     );
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 12,
//       backgroundColor: colors.background,
//     },
//     text: {
//       color: colors.text_pink,
//       fontFamily: "Inter_400Regular",
//       fontSize: 20,
//     },
//     signUpButton: {
//       alignItems: "center",
//       padding: 5,
//       borderRadius: 4,
//     },
//     signUpText: {
//       color: colors.text_pink,
//       fontFamily: "Inter_700Bold",
//       fontSize: 15,
//     },
//   });
//   export default ProfilePage;
