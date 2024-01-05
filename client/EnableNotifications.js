import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Pressable } from 'react-native';
import { Constants } from 'expo-camera';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Ionicons from '@expo/vector-icons/Ionicons'
import {IP_ADRESS, PORT} from '@env'


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function EnableNotifications(props) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState()
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    getNotificationStatus()

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });


    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
    
  }, []);

  const getNotificationStatus = async () => {
    try{
      await fetch(`http://${IP_ADRESS}:${PORT}/NotificationStatus/?username=${props.username}`)
              .then((response) => response.json())
              .then(data2 => setNotificationStatus(data2))
              
    }
    catch(err) {
      console.log(err)
    }
  }

  const changeNotificationStatus = async () => {
    if(notificationStatus == 'off') {
      await fetch(`http://${IP_ADRESS}:${PORT}/NotificationStatus`, {method: 'PUT',   headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({username: props.username, status: "on"} )})
              .then(response => response.json())
              .then(data => console.log(data))
      setNotificationStatus("on")
      //await schedulePushNotification()
      console.log('enable')
    }
    else {
      await fetch(`http://${IP_ADRESS}:${PORT}/NotificationStatus`, {method: 'PUT',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({username: props.username, status: "off"})})
              .then(response => response.json())
              .then(data => console.log(data))
      await Notifications.cancelAllScheduledNotificationsAsync()
      setNotificationStatus("off")
      console.log("disabled")
    }
  }

  return (
    <View>
      {notificationStatus == 'on'? <Pressable onPress={() => changeNotificationStatus()}><Ionicons name="notifications-outline" size={32} color="black" /></Pressable>
      : <Pressable onPress={() => changeNotificationStatus()}><Ionicons name="notifications-off-outline" size={32} color="black"/></Pressable> } 
    </View>

  )
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "First cup", 
      body: "Drink Water"
    },
    trigger: {hour: 8,
              minute: 0,
              repeat: true, 
              type: 'calendar'}
              
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Second cup", 
      body: "Drink Water"
    },
    trigger: {hour: 9,
              minute: 45,
              repeat: true,
              type: 'calendar'}
              
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "First cup", 
      body: "Drink Water"
    },
    trigger: {hour: 11,
              minute: 30,
              repeat: true,
              type: 'calendar'}
              
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Fourth cup", 
      body: "Drink Water"
    },
    trigger: {hour: 13,
              minute: 15,
              repeat: true, 
              type: 'calendar'}
              
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Fifth cup", 
      body: "Drink Water"
    },
    trigger: {hour: 15,
              minute: 0,
              repeat: true, 
              type: 'calendar'}
              
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Sixth cup", 
      body: "Drink Water"
    },
    trigger: {hour: 16,
              minute: 45,
              repeat: true, 
              type: 'calendar'}
              
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Seventh cup", 
      body: "Drink Water"
    },
    trigger: {hour: 18,
              minute: 30,
              repeat: true, 
              type: 'calendar'}
              
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Final cup", 
      body: "Drink Water"
    },
    trigger: {hour: 20,
              minute: 15,
              repeat: true, 
              type: 'calendar'}
              
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync({ projectId: "36de4298-1318-4ed6-acba-4ed2a4852a7f"  })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}