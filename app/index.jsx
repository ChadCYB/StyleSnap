import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import { useState } from "react";
import FormField from "../components/FormField";
import { useCameraPermissions} from "expo-camera";
import { usePermissions } from "expo-media-library";



export default function App() {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [mediaPermissions, requestMediaPermissions] = usePermissions();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });



  return (
    <SafeAreaView style = {{flex:1, /*justifyContent:'center',*/ backgroundColor:'eBef4e'}}>
      <View style={styles.container}>
        <View style = {styles.header}>

        <Image 
          style = {styles.logo}
          source = {require("../assets/images/stylesnap-icon.png")}
        />

        <Text style = {styles.title}>
          Welcome to{' '} 
          <Text style = {{color: '#00bfff'}}>StyleSnap</Text>
          !
        </Text>
        <Text style = { styles.subtitles}>Join the community of art lovers around the world and more!</Text>



        <FormField 
          title = "Email"
          value = {form.email} 
          placeholder='EddyEagle@csula.net'
          handleChangeText = {(e) => setForm({...form, email: e})}
          keyboardType ="email-address"
        />

        <FormField 
          title = "Password"
          value = {form.password} 
          placeholder='************'
          handleChangeText = {(e) => setForm({...form, password: e})}
        />

        <TouchableOpacity onPress={() => {
          // handle on press api calls here
        }}>

          <View style={styles.btn}>
            <Text> Login </Text>
          </View>
          
        </TouchableOpacity>





        <StatusBar style="auto"/>

          <View style={styles.footer}>
            <Text style = { styles.subtitles }>
              Don't have an account yet?{' '} 
              <Link href="/signup" style= {{color: 'blue'}}>Sign Up </Link>Here!
            </Text>

            <Text style = { styles.subtitles}>
              Don't want to sign up? Feel free to use
              <Link href="/home" style= {{color: 'blue'}}> Guest Mode</Link>!
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  header: {
    marginVertical: 36,
    alignItems: 'center'
  },
  logo: {
    //flex: 1,
    borderRadius: 22,
    marginBottom: 40,
    width: 120,
    height: 120,
    alignSelf: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitles: {
    fontSize: 18,
    textAlign: 'center',
    color: '#a9a9a9',
    marginBottom: 10
  }, 
  footer: {
    flex:1,
    flexDirection:'column',
    justifyContent:'flex-end'
  }, 
  btn: {
    backgroundColor: '#00bfff',
    borderRadius:8,
    borderWidth:1,
    borderColor:'#00bfff',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingVertical: 10,
    paddingHorizontal: 130,
  }
});
