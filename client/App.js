import React, {useState, useEffect, useRef} from 'react';
import { Button, View, Image, TouchableOpacity, Pressable, Text, Touchable, TextInput, TouchableHighlight, StyleSheet, SafeAreaView, Platform} from 'react-native';
import PhotoPage from './PhotoPage'
import EnableNotifications from './EnableNotifications'
import {
  LineChart,
} from "react-native-chart-kit"; 
import { data } from '@tensorflow/tfjs';
import Ionicons from '@expo/vector-icons/Ionicons'
import {IP_ADRESS, PORT} from '@env'


export default function App() {
  const [username, setUsername] =  useState(undefined)
  const [PhotoPagee, setPhotoPage] =  useState(false)

    return (
      <View>
        {
          username==undefined? <Login setUsername={setUsername}/>
          : PhotoPagee? <PhotoPage setPhotoPage={setPhotoPage} username={username}/> 
          : <HomePage setPhotoPage={setPhotoPage} username={username} setUsername={setUsername}/>
        }
      </View>
    
    )
  }


  function Login(props) {
    const [inputUN, setInputUN] =  useState("")
    const [password, setPassword] =  useState("")
    const [bttnOP, setbttnOP] =  useState(0)
    const [errText, setErrorText] =  useState("Invalid Login")
    const [setup, setSetup] = useState(false)

    const createAccount = async () => {
      if(inputUN =="" || password=="") {
        setErrorText("One or more feilds left blank", setbttnOP(10))
        console.log("error")
        return
      }
      try {
        await fetch(`http://${IP_ADRESS}:${PORT}/`, {method: 'POST',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({username: inputUN, password: password})})
                .then(response => response.json())
                .then(data => {data.msg=='success'? props.setUsername(inputUN) : loginerror("username already exists")})
      }
      catch(err) {
        console.log(err)
      }
    }
    const loginerror = (text) => {
      setbttnOP(2)
      setErrorText(text)
    }
    const auth = async () => {
      console.log("working", inputUN, password)
      if(inputUN == "" || password== "")
      {
        loginerror("one or more feilds left blank")
      }
      else {
        try{
          await fetch(`http://${IP_ADRESS}:${PORT}/?username=${inputUN}&password=${password}`)
                          .then((response)=> response.json())
                          .then(data=> {data == "fail"? loginerror("Invalid Login"): props.setUsername(inputUN)})
        }
         catch(err) {
          console.log(err)
         }
      }

    }
    
    
    if(setup) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
  
          <View style={{flex: 2,}}>
              <Image  style={{width: 400, objectFit: 'fill'}} source={require('../client/assets/firstthirdpng.png')}/>
          </View>
  
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: 300}}>
            <Image style={{width: 100, height: 100}} source={require('../client/assets/logo.png')}/>
            <Text style={{fontSize: 30, fontWeight: '600'}}>CREATE {"\n"}ACCOUNT</Text> 
          </View>
  
          <View style={{flex:3, alignItems: 'center'}}>
            <TextInput
              placeholder='username'
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(newtext) => setInputUN(newtext)}
            />
            <TextInput
              placeholder='password'

              style={styles.input}
              onChangeText={(newtext) => setPassword(newtext)}
            />
            <Pressable
              style={styles.loginbttn}
              onPress={() => createAccount()}
              >
              <Text>Create</Text>
              
            </Pressable>
          <View style={{opacity: bttnOP,  backgroundColor: 'red', color: 'white', borderRadius: 10}}>
            <Text style={{padding: 10, color: 'white'}}>{errText}</Text>
          </View>
          
          </View>
        </View>
      )
    }

    return (
      <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>

        <View style={{flex: 2,}}>
            <Image  style={{width: 400, objectFit: 'fill'}} source={require('../client/assets/firstthirdpng.png')}/>
        </View>

        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: 300}}>
          <Image style={{width: 100, height: 100}} source={require('../client/assets/logo.png')}/>
          <Text style={{fontSize: 30, fontWeight: '600'}}>WELCOME {"\n"}BACK</Text> 
        </View>


        <View style={{flex:3, alignItems: 'center'}}>
          <TextInput
            placeholder='username'
            style={styles.input}
            onChangeText={(newtext) => setInputUN(newtext)}
          />
          <TextInput
            placeholder='password'
            secureTextEntry={true}
            style={styles.input}
            onChangeText={(newtext) => setPassword(newtext)}
            
          />
          <Pressable
            style={styles.loginbttn}
            onPress={() => auth()}
            >
            <Text>Login</Text>
            
          </Pressable>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 12, padding: 0}}>New to 8 cups? </Text>
            <Pressable onPress={()=> setSetup(true)}><Text style={{fontWeight: 600}}>Get Started</Text></Pressable>
          </View>
          <View style={{opacity: bttnOP,  backgroundColor: 'red', color: 'white', borderRadius: 10}}>
            <Text style={{padding: 10, color: 'white'}}>{errText}</Text>
          </View>
         
        </View>
      </View>
    )
  }

  function HomePage(props) {
    const [labels, setLabels] =  useState([])
    const [arrayy, setArray] =  useState([])
    const [streak, setStreaks] =  useState([])
    const [progress, setProgress] =  useState([])
    

    
    const getpast7days = async () => {
      currentDate = new Date()
      let array = []
      let array2 = []
      for(i=1; i< 8; i++) {
        currentDate.setDate(currentDate.getDate() - 1);
        const formattedDate =  `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        const count = await getWeeksData(props.username, formattedDate)
        array.unshift(formattedDate)
        array2.unshift(count)
        if(i == 7)
        {
          setLabels(array)
          setArray(array2)
          
        }
      }
    }

    const getStreaks = async () => {

      try {
        await fetch(`http://${IP_ADRESS}:${PORT}/getStreaks?username=${props.username}`)
                .then(data => data.json())
                .then(data => setStreaks(data))
        
      }
      catch(err) {
        console.log("streaks " + err)
      }
    }

    const getProgress = async () => {
      try {
        let currentDate = new Date()
        const formattedDate =  `${currentDate.getUTCFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        let res = await getWeeksData(props.username, formattedDate)
        setProgress(res)
      }
      catch(err) {
        console.log("progress " + err)
      }
    }
    const updateStreak = async() => {
      await fetch(`http://${IP_ADRESS}:${PORT}/updateStreak`, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: props.username })})
                .then(getStreaks())
    }
     useEffect( () => {
       getpast7days()
       updateStreak()
       getProgress()
       
       
    }, []);
    

    const getWeeksData = async (username, date) => {
      let res
      try {
        await fetch(`http://${IP_ADRESS}:${PORT}/getGraphData?username=${username}&date=${date}`)
                .then((response) => response.json())
                .then(data => res = data)

           return res  
      }
      catch(err){
        console.log("hello", err)
      }
      
    }

    return (
      <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
       <View style={{flex: 2, justifyContent: 'space-between'}}>
          <View style={{ padding: 5, flex: 3, justifyContent: 'center', alignItems: 'flex-end'}}>
            <Pressable style={{borderRadius: 5, backgroundColor: '#D9D9D9'}} onPress={() => props.setUsername(undefined)}><Text style={{padding: 7,}}>LOGOUT</Text></Pressable>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', width: 290, flex: 1}}>
            <Text style={{width: 120, fontSize: 30, fontWeight: 600}}>H O M E</Text>
            <EnableNotifications username={props.username}/>
            {//}<Button title="Take Picture" onPress={() => props.setPhotoPage(true)}/>
            }
          </View>
       </View>
       

        <Graph style={{flex: 5}}labels={labels} data={arrayy}></Graph>

        <View style={{flex: 2, flexDirection: 'row', padding: 15, justifyContent: 'space-between', width: 330}}>
          <View style={{backgroundColor: "#D9D9D9", width: 135, height: 120, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
          <Ionicons name='water-outline' size={70} color='black'/>
            <Text style={{}}>S T R E A K : {streak}</Text>
          </View>
          <Pressable onPress={() => props.setPhotoPage(true)}>
            <View style={{backgroundColor: "#D9D9D9", width: 135, height: 120, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
              <Ionicons name='camera-outline' size={70} color='black'/>
              <Text>D R I N K   L O G</Text>
            </View>
          </Pressable>
          
        </View>
        
        <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <Progressbar style={{backgroundColor: 'grey'}} count={progress}/>
          <Text style={{fontWeight: 600, padding: 7}}>T O D A Y S    P R O G R E S S </Text>
        </View>
        
        <Image style={{objectFit: 'fill', flex: 3}}source={require('../client/assets/bottom.png')}></Image>
      </View>
    )

  }
  function Progressbar(props) {
    const [one, setOne] =  useState("#D9D9D9")
    const [two, setTwo] =  useState("#D9D9D9")
    const [three, setThree] =  useState("#D9D9D9")
    const [four, setFour] =  useState("#D9D9D9")
    const [five, setFive] =  useState("#D9D9D9")
    const [six, setSix] =  useState("#D9D9D9")
    const [seven, setSeven] =  useState("#D9D9D9")
    const [eight, setEight] =  useState("#D9D9D9")
    const setBarColors = () => {
      if(props.count == 1) {setOne("#82B4D1")}
      if(props.count == 2) {setOne("#82B4D1"), setTwo("#82B4D1")}
      if(props.count == 3) {setOne("#82B4D1"), setTwo("#82B4D1"), setThree("#82B4D1")}
      if(props.count == 4) {setOne("#82B4D1"), setTwo("#82B4D1"), setThree("#82B4D1"), setFour("#82B4D1")}
      if(props.count == 5) {setOne("#82B4D1"), setTwo("#82B4D1"), setThree("#82B4D1"), setFour("#82B4D1"), setFive("#82B4D1")}
      if(props.count == 6) {setOne("#82B4D1"), setTwo("#82B4D1"), setThree("#82B4D1"), setFour("#82B4D1"), setFive("#82B4D1"), setSix("#82B4D1")}
      if(props.count == 7) {setOne("#82B4D1"), setTwo("#82B4D1"), setThree("#82B4D1"), setFour("#82B4D1"), setFive("#82B4D1"), setSix("#82B4D1"), setSeven("#82B4D1")}
      if(props.count >= 8) {setOne("#82B4D1"), setTwo("#82B4D1"), setThree("#82B4D1"), setFour("#82B4D1"), setFive("#82B4D1"), setSix("#82B4D1"), setSeven("#82B4D1"), setEight("#82B4D1")}
    }
     useEffect(() => {
      setBarColors()
    })
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{backgroundColor: one, height: 10, width: '10%', borderBottomLeftRadius: '5', borderTopLeftRadius: '5'}}><Text style={{fontSize: 1, color: one}}>o</Text></View>
        <View style={{backgroundColor: two, height: 10, width: '10%'}}><Text style={{color: two}}>o</Text></View>
        <View style={{backgroundColor: three, height: 10, width: '10%'}}><Text style={{color: three}}>o</Text></View>
        <View style={{backgroundColor: four, height: 10, width: '10%'}}><Text style={{color: four}}>o</Text></View>
        <View style={{backgroundColor: five, height: 10, width: '10%'}}><Text style={{color: five}}>o</Text></View>
        <View style={{backgroundColor: six, height: 10, width: '10%'}}><Text style={{color: six}}>o</Text></View>
        <View style={{backgroundColor: seven, height: 10, width: '10%'}}><Text style={{color: seven}}>o</Text></View>
        <View style={{backgroundColor: eight, height: 10, width: '10%', borderBottomRightRadius: '5', borderTopRightRadius:'5' }}><Text style={{color: eight}}>o</Text></View>
      </View>
    )
  }

  function Graph(props) {
    if(props.labels.length == 0 || props.data.length == 0)
    {
      return (
        <View>
          <Text>No data avalible</Text>
        </View>
      )
    }
    else {
      return (
        <View>
          <LineChart
            data={{
              labels: props.labels.map(data => String(data).charAt(data.length - 2) + String(data).charAt(data.length - 1)),
              datasets: [
                {
                  data: props.data,
                }
              ]
            }}
            width={300} // from react-native
            height={220}
            yAxisSuffix=" cups"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#4D898D",
              backgroundGradientFrom: "#4D898D",
              backgroundGradientTo: "#4D898D",
              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#27869B"
              }
            }}
            bezier
            style={{
              marginVertical: 10,
              borderRadius: 16,
              
            }}
          />
        </View>
      )
    }

  }



  const styles = StyleSheet.create({
    input: {
      height: 50, 
      width: 300,
      borderRadius: 10,
      backgroundColor: '#eeeee4', 
      padding: 10,
      margin: 10,
    },
    loginbttn: {
      height: 40, 
      width: 80, 
      borderRadius: 10,
      margin: 10,  
      backgroundColor: '#eeeee4', 
      color: 'black',
      alignItems: 'center', 
      justifyContent: 'center'
    }
  })