import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import * as Location from 'expo-location';

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    location: null,
    temp: null
  }

  async componentDidMount() {

    const { status } = await Location.requestPermissionsAsync()
    if(status !== 'granted') {
      console.log("Denied")
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync()

    console.log(coords)
    this.setState({
      location: coords
    })

    const request = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&lang=es&appid=d61e34d09f83f6fa0291858d4a648d45`)
    const response = await request.json()

    this.setState({
      temp: response
    })

    console.log(response)
  }

  render() {

    return (
      <View style={styles.container}>
        <ImageBackground source={require('./assets/bg.png')} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }}>
          
          {this.state.temp && (
            <View style={{ flex: 1, paddingTop: 100, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, color: 'white' }}>Temperatura en {this.state.temp.name}</Text>
              <Text style={styles.temp}>{this.state.temp.main.temp}°c</Text>
              <Text style={{ fontSize: 15, color: 'white' }}>Humedad {this.state.temp.main.humidity}</Text>
              <Text style={{ fontSize: 15, color: 'white' }}>Viento {this.state.temp.wind.deg}° {this.state.temp.wind.speed}km/hr</Text>
              <Text style={{ fontSize: 18, color: 'white', marginTop: 20 }}>{this.state.temp.weather[0].description}</Text>
            </View>
          )}
        </ImageBackground>
        <StatusBar style="light" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  temp: {
    fontSize: 60,
    color: 'white',
    textAlign: 'center',
    marginTop: 20
  }
});
