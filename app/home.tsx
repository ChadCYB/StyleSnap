import IconButton from '@/components/IconButton';
import MainRowActions from '@/components/MainRowActions';
import PictureView from '@/components/PictureView';
import { CameraView, CameraType, useCameraPermissions, Camera, CameraMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function home() {
  const [facing, setFacing] = useState(Camera.front);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");
  // image in here vv
  const [picture, setPicture] = useState<string>(""); 
  const [status, requestPermission2] = ImagePicker.useMediaLibraryPermissions();
  const cameraRef = useRef<CameraView>(null);
  
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!status) {
    // Media permissions are still loading.
    return <View />;
  }

  // handles the photo from camera
  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({});
    console.log(response)
    const uri_img = response!.uri
    console.log(uri_img);

    //testing
    const test = await fetch(uri_img);
    const blob = await test.blob()
    console.log('blb here',blob || 'hi')
    //testing

    setPicture(uri_img);

  }

  // For camera use only
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // For media library
  if (!status.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use photos</Text>
        <Button onPress={requestPermission2} title="grant permission" />
      </View>
    );
  }


  // Handles getting image from media library
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.1
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri)
    }
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (picture) return <PictureView picture={picture} setPicture={setPicture} />;

  return (
    <View style={styles.container}>
      <CameraView 
        // This ref connects the view with the actual camera
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}>
        <MainRowActions 
          cameraMode={cameraMode}
          handleTakePicture={handleTakePicture}
          isRecording={false}
        />

        <View style={styles.buttonContainer}>
          
          <Link href={"/media-library"} asChild></Link>
          <IconButton 
            androidName="library" 
            iosName='photo.stack' 
            onPress={pickImageAsync}
          />
          
          
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 6,
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
