import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React from 'react'
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import { useState } from "react";
import FormField from "../components/FormField";

const SignUpPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confPassword: ''
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
          Signup to{' '} 
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

        <FormField 
          title = "Confirm Password"
          value = {form.confPassword} 
          placeholder='************'
          handleChangeText = {(e) => setForm({...form, password: e})}
        />

        <TouchableOpacity onPress={() => {
          // handle on press api calls here
        }}>

          <View style={styles.btn}>
            <Text> Sign Up </Text>
          </View>
          
        </TouchableOpacity>





        <StatusBar style="auto"/>

          <View style={styles.footer}>
            <Text style = { styles.subtitles }>
              Back to{' '} 
              <Link href="/" style= {{color: 'blue'}}>Login page</Link>.
            </Text>

            {/* <Text style = { styles.subtitles}>
              Don't want to sign up? Feel free to use
              <Link href="/home" style= {{color: 'blue'}}> Guest Mode</Link>!
            </Text> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SignUpPage


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
    backgroundColor: 'lightblue'
  }
});
