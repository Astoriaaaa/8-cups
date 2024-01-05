import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, Button, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as tf from '@tensorflow/tfjs'
import { fetch } from '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as jpeg from 'jpeg-js'
import {IP_ADRESS, PORT} from '@env'

export default function TakingPhoto(props) {
  let cameraRef = React.useRef();
  const [hasCameraPermission, setHasCameraPermission] = React.useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = React.useState();
  const [photo, setPhoto] = React.useState();
  const [isModeling, setIsModeling] = React.useState()
  const [verificationSucess, setVerificationSucess] = React.useState()
  const [model, setModel] = React.useState()

  React.useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      await tf.ready()
      const modell = await mobilenet.load()
      setModel(modell)
      setVerificationSucess()
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }
  else if (isModeling) {
    return (
      <View style={{alignItems: 'center', height: '100%', justifyContent: 'center'}}>
        <Text>Is Verifying. . .</Text>
      </View>
    )
  }
  else if(verificationSucess) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}>
        <Text>Picture Verified!</Text>
        <Button title="Go Back" onPress={() => props.setPhotoPage(false)}/>
      </View>
    )
  }
  else if(verificationSucess == false) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}>
        <Text>Verification Denied!</Text>
        <Button title="Go Back" onPress={() => props.setPhotoPage(false)}/>
      </View>
    )
  }
  else if (photo) {
    const classifyImage = async () => {
      setIsModeling(true)
      try {
        const imageAssetPath = Image.resolveAssetSource(photo)
        const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
        const rawImageData = await response.arrayBuffer()
        const imageTensor = imageToTensor(rawImageData)
        await tf.ready()
        const modell = await mobilenet.load()
        setModel(modell)
        const predictions = await model.classify(imageTensor)
        console.log(predictions)
        const result =  String(predictions[0].className) + String(predictions[1].className) + String(predictions[2].className)
        if(result.includes("water") || result.includes("bottle")) {
          updateData()
          console.log("updated Data")
          setVerificationSucess(true)
          setIsModeling(false)
        }
        else {
          console.log("NOT VALID")
          setVerificationSucess(false)
          setIsModeling(false)
        }
          
      } catch (error) {
        console.log("error", error)
      }
    }

    const updateData = async () => {
      console.log(props.username)
      await fetch(`http://${IP_ADRESS}:${PORT}/updateData`, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: props.username }) })
      props.setTakingPhoto(false)
    }

    return (
      <SafeAreaView style={{alignItems: 'center', JustifyContent: 'center', height: '100%'}}>
        <Text>hello</Text>
        <Image style={{alignSelf: 'stretch', flex: 1}} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <Button title="Done" onPress={() => classifyImage()} />
        <Button title="Discard" onPress={() => props.setTakingPhoto(false)} />
      </SafeAreaView>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };
  function imageToTensor(rawImageData) {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])
  }

  return (
    <Camera style={{height: '100%', padding: 20}} ref={cameraRef}>
      <View style={{JustifyContent: 'center', alignSelf: 'center', backgroundColor: '#fff'}}>
        <Button title="Take Pic" onPress={takePic} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}