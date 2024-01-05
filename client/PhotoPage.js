import React from 'react'
import TakingPhoto from './TakingPhoto'
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';

export default function PhotoPage(props) {
    const [takingPhoto, setTakingPhoto] = React.useState(false)
    if (!takingPhoto) {
        return (
            <View style={{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Button  onPress={() => setTakingPhoto(true)} title="Take a photo with your drink"/>
                    <Button  onPress={() => props.setPhotoPage(false)} title="Go Back"/>
            </View>
        )}
    else {
        return (
            <TakingPhoto username={props.username} setTakingPhoto={setTakingPhoto} setPhotoPage={props.setPhotoPage}/>
        ) 
    }
    
}