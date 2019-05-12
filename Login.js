import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import FadeInView from './FadeInView';
import { TextField } from 'react-native-material-textfield';
import { NetworkUtil } from './network/NetworkUtil';
import {AsyncStorage} from 'react-native';
import { Permissions, Notifications } from 'expo';
import {NavigationEvents} from 'react-navigation';

export default class Login extends React.Component {

  state = {
    isFocused: false,
  };

  handleFocus = event => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = event => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  constructor(props) {
    super(props);
    this.state = { username: '',
                    password: '',
                    token: '',
                    isLoading: false,
                    dataSource: {},
                    message: false,
                    isLoading: true,
                    success: '' };
    this.token='';
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    // removeKey = async () => {
    //   try {
    //     await AsyncStorage.removeItem('token');
    //     await AsyncStorage.removeItem('user');
    //   } catch (error) {
    //     // Error saving data
    //   }
    // };
    // removeKey();
    registerForPushNotificationsAsync((token)=>{
      this.token=token;
      console.log(this.token);
      let _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('token');
          if(value!=null) {
            this.state.username = await AsyncStorage.getItem('username');
            this.state.password = await AsyncStorage.getItem('password');
            this.userLogin();
          } else {
            this.setState({
              isLoading: false,
            });
          }
        } catch (error) {
            console.log(error);
        }
      };
      _retrieveData();
    }, 
    () => {
      
    });
  }

  userLogin() {
    this.setState({
      isLoading: true,
    });
    return fetch(NetworkUtil.login, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({username:this.state.username, password: this.state.password, deviceId: this.token})
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false
        });
        if(responseJson.success) {
          this.setState({
              isLoading: false,
              dataSource: responseJson,
              message: true,
              success: responseJson.success
          });
          let _storeLogin = async () => {
            try {
              await AsyncStorage.setItem('token', responseJson.token);
              await AsyncStorage.setItem('user', JSON.stringify(responseJson.user));
              await AsyncStorage.setItem('username', this.state.username);
              await AsyncStorage.setItem('password', this.state.password);
              this.props.navigation.navigate('Dashboard')
            } catch (error) {}
          };
          _storeLogin();
        } else {

        }
    })
    .catch((error) =>{
      console.error(error);
    });
  }


  render() {
    const { isFocused } = this.state;
    const { onFocus, onBlur } = this.props;
    const {navigate} = this.props.navigation;

    if(this.state.isLoading){
        return(
            <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator style={{marginTop:50}}/>
            </View>
        )
    }
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        <View style={{ height: 32, backgroundColor: 'skyblue' }} />
        <Text style={{ height: 120, backgroundColor: 'skyblue', textAlign: 'center', textAlignVertical: 'center', fontSize: 30, color: 'white', fontWeight: 'bold' }}>Sign In</Text>
        <View style={{ flex: 1.4, flexDirection: 'column' }}></View>
        <FadeInView style={{ flex: 4.6, padding: 40 }}>
          <View>
            <TextField
                  label='Username'
                  value={this.state.username}
                  onChangeText={ (username) => {this.state.username = username} }
              />

              <TextField
                    label='Password'
                    secureTextEntry = {true}
                    value={this.state.password}
                    onChangeText={ (password) => {this.state.password = password} }
                />

            <TouchableOpacity onPress={()=>this.userLogin()}>
              <Text style={styles.button}>Login</Text>
            </TouchableOpacity>
          </View>
          </FadeInView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 50,
    paddingLeft: 6,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: 'steelblue',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 12,
    textAlign:'center',
  },
});

const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";

async function registerForPushNotificationsAsync(callback, error) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    error();
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  callback(token);
}
