import React, { useState, useEffect, Component } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import {RNS3} from 'react-native-aws3';
import { hide } from 'expo/build/launch/SplashScreen';
import creds from './creds';

export default function App(){

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true, };
      const data = await this.camera.takePictureAsync(options)
        .then(data => {
          imgUrl = data.uri;
          alert('data uri:' + data.uri);
          console.log(imgUrl);
          let str = imgUrl.replace(/\//g, "");
          const file = {
            uri: imgUrl,
            name: str + ".jpg",
            type: "image/jpeg"
          };
          // const options = {
          //   keyPrefix: "images/",
          //   bucket: "reacting-cruzhacks",
          //   region: "us-east-1",
          //   accessKey: "AKIAI7A4EU2LU3DYTC7A",
          //   secretKey: "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",
          //   successActionStatus: 201
          // };
          RNS3.put(file,creds).then(response => {
            if (response.status !== 201){
              throw new Error("Failed to upload image to S3");
            }
            alert("Picture uploaded!");
            console.log(response.body);
          });
          //MediaLibrary.saveToLibraryAsync(imgUrl);
        });
    }
    else alert("CAMERA NOT AVAILABLE!");
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{flex: 1}} type={type} ref={ (ref) => {this.camera = ref}} >
        <View style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              takePicture();
            }}>
            <Image style = {{marginBottom: 20, width: 100, height: 100}}source={{uri: "https://dezov.s3.amazonaws.com/media/white-circle-png194-4049-8e22-a9fe231d010c.png"}}></Image>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}