/**
 * 
 * IN HERE
 * 
 * Add API to upload image to AWS server,
 * and string of the style the user requests
 *  
 */
import { Image } from "expo-image";
import { Alert, View } from "react-native";
import IconButton from "./IconButton";
//import { shareAsync } from "expo-sharing";
import { saveToLibraryAsync } from "expo-media-library";
import { Dropdown } from 'react-native-element-dropdown';
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
          androidName="close"
        />
        <IconButton
        // example buttons
          onPress={() => setPicture("")}
          iosName={"square.dashed"}
          androidName="close"
        />
        <IconButton
          onPress={() => setPicture("")}
          iosName={"circle.dashed"}
          androidName="close"
        />
        <IconButton
          onPress={() => setPicture("")}
          iosName={"triangle"}
          androidName="close"
        />
        <IconButton
          onPress={async () => setPicture("")/*await shareAsync(picture)'*/}
          iosName={"square.and.arrow.up"}
          androidName="close"
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
              console.log('user wants style: ',value)
              console.log('user image: ', picture)
            }
          }
          iosName={"square.and.arrow.up"}
          androidName="close"
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