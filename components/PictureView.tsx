/**
 * 
 * IN HERE
 * 
 * Add API to upload image to AWS server,
 * and string of the style the user requests
 *  
 */

const API = "https://nap.art/" 
//const IMAGE_API = "https://nap.art/upload/"
const IMAGE_API = "https://2ee.app/upload/"
// Send image will return base64
import axios from "axios";

import { Image } from "expo-image";
import { Alert, View } from "react-native";
import IconButton from "./IconButton";
//import { shareAsync } from "expo-sharing";
import { saveToLibraryAsync } from "expo-media-library";
import { Dropdown } from 'react-native-element-dropdown';
import * as FileSystem from 'expo-file-system';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useState } from "react";

const snapStyles = [
  {label: 'one', value: 'one'},
  {label: 'two', value: 'two'},
  {label: 'three', value: 'three'},
  {label: 'four', value: 'four'},
];


const uploadImage = async (uri: string, b64: boolean) => {
  const formData = new FormData();
  // Creating a Blob from the image URI
  //const response = await fetch(uri);
  //console.log('res',response)
  //const blob = await response.blob();
  //console.log('blobl', blob)

  //let file = FileSystem.

  //formData.append('file', blob, 'image.jpg');

  formData.append('file', {uri, name: 'image.jpg', type: 'image/jpeg'})

  try {
    if (b64 === true) {
      console.log('b64')
      // Read the image as Base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare the payload
      const payload = {
        image: `data:image/jpeg;base64,${base64}`, // Prefix with the appropriate MIME type
      };
      console.log(payload)

      // Send the Base64 string to the server
      const response = await axios.post(IMAGE_API, payload, {
        headers: {
          'Content-Type': 'application/json', // Set the correct content type
        },
      });


    } else {
      console.log('file sent')
      const response = await axios.post(IMAGE_API, formData, {
        headers: {
          'userStyle': '1',
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    

    

    console.log('Upload success'/*, response.data*/);
  } catch (error) {
    console.error('Upload failed', error);
  }
};


interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}
export default function PictureView({ picture, setPicture }: PictureViewProps) {
  const [value, setValue] = useState<string>("");
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <View
        style={{
          position: "absolute",
          right: 6,
          zIndex: 1,
          paddingTop: 50,
          gap: 16,
        }}
      >
        <IconButton
          onPress={async () => {
            saveToLibraryAsync(picture);
            Alert.alert("✅ Picture saved!");
          }}
          iosName={"arrow.down"}
          androidName="download-outline"
        />
        
        <IconButton
        // example button
          onPress={() => setPicture("")}
          iosName={"square.dashed"}
          androidName="close"
        />
        <IconButton
          onPress={async () => setPicture("")/*await shareAsync(picture)'*/}
          iosName={"square.and.arrow.up"}
          androidName="share-social-outline"
        />
        <Dropdown 
        style= {{width:100,backgroundColor:'white',borderRadius:2}}
        placeholder="Select Style"
        data={snapStyles} 
        labelField="label" 
        valueField="value" 
        onChange={item => {
          setValue(item.value);
          //delayed if printed here
          //console.log('user wants style: ',value);
        }}      
        />
      </View>

      <View
        style={{
          position: "absolute",
          zIndex: 1,
          paddingTop: 50,
          left: 6,
        }}
      >
        <IconButton
          onPress={() => setPicture("")}
          iosName={"xmark"}
          androidName="close"
        />

      </View>

      <View
      // View for upload to server button
        style={{
          position: "absolute",
          zIndex: 1,
          paddingTop: 50,
          left: 200,
          bottom: 20
        }}
      >
        <IconButton
        // Upload to server button here
        // Should upload image to API
        // Have a seperate page for looking at server images
        // Alert for "Please wait a minute for image to finish"?
          onPress={() => {

            uploadImage(picture, false);

            console.log('user wants style: ',value)
            console.log('user image: ', picture)
            /*
            axios.post(API,{
              image: picture
            })
            .then(function (response){
              console.log(response);
            });8*/




            }
          }
          iosName={"square.and.arrow.up"}
          androidName="send-outline"
        />

      </View>
      
      <Image
        source={picture}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 5,
        }}
      />
    </Animated.View>
  );
}