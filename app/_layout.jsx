import { StyleSheet, Text, View } from 'react-native'
import { Slot, Stack } from 'expo-router'

const RootLayout = () => {
  // return (
  //   <>
  //     <Text>Header!!!!!</Text>
  //     <Slot/>
  //     <Text>Footer!!!!!</Text>
  //   </>
  // )
  return (
    <Stack>
      <Stack.Screen name = "index" options={{ headerShown: false}}/>
      <Stack.Screen name = "signup" options={{ headerShown: false}}/>
      <Stack.Screen 
        name = "media-library" 
        options={{ presentation: "modal", headerShown: false  }}
      />
      <Stack.Screen name = "home" options={{ headerShown: false}}/>
    </Stack>
  )
}

export default RootLayout

// const styles = StyleSheet.create({
//   container: {
//     display: 'flex',
//     flex: 1,
//     alignItems: 'center',
//     justifyContent:'center'
//   }
// })