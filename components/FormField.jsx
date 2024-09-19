import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native';
import { useState } from 'react';


const FormField = ({title, value, placeholder, handleChangeText, ...props}) => {

  const [showPassword, setshowPassword] = useState(false)

  return (
    <View>
      <Text style={{paddingBottom:5}}>{title}</Text>
    

        <View style={styles.container}>
          <TextInput 
            value={value}
            placeholder={placeholder}
            placeholderTextColor={'grey'}
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
          />
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightgray',
      borderRadius:10,
      height: 40,
      width: 300,
      marginBottom: 20
    },
    header: {
      marginVertical: 36,
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
    }
  });



export default FormField