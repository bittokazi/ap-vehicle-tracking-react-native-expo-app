import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import {AsyncStorage} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';

export default class MenuView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItem: [],
            username: '',
            email: ''
        }
    }

    navigateToIntent(intent) {
        this.props.closeDrawer();
        this.props.navigation.navigate(intent);
    }

    componentDidMount() {
        let _retrieveData = async () => {
            try {
              const value = await AsyncStorage.getItem('user');
              if(JSON.parse(value).roleEntity.id==1) {
                this.setState({
                    menuItem: [
                        {key: 'Dashboard', image: require('./assets/dash.png'), intent: 'Dashboard'},
                        {key: 'Show Vehicles', image: require('./assets/truck.png'), intent: 'ShowVehicles'},
                        {key: 'Show Counters', image: require('./assets/showCounter.png'), intent: 'ShowCounters'},
                        {key: 'Show Users', image: require('./assets/users.png'), intent: 'ShowUsers'},
                        {key: 'Show Tasks', image: require('./assets/showTask.png'), intent: 'ShowTasks'},
                        {key: 'Show Drivers', image: require('./assets/users.png'), intent: 'ShowDrivers'},
                        {key: 'Add Vehicle', image: require('./assets/addTruck.png'), intent: 'AddVehicle'},
                        {key: 'Add Counter', image: require('./assets/counter.png'), intent: 'AddCounter'},
                        {key: 'Add User', image: require('./assets/addUser.png'), intent: "AddUser"},
                        {key: 'Add Task', image: require('./assets/addTask.png'), intent: 'AddTask'},
                        {key: 'Add Driver', image: require('./assets/addUser.png'), intent: 'AddDriver'},
                    ]
                });
              } else if(JSON.parse(value).roleEntity.id==2) {
                this.setState({
                    menuItem: [
                        {key: 'Dashboard', image: require('./assets/dash.png'), intent: 'Dashboard'},
                        {key: 'Show Tasks', image: require('./assets/showTask.png'), intent: 'ShowTasks'},
                        {key: 'Add Task', image: require('./assets/addTask.png'), intent: 'AddTask'},
                    ]
                });
              }
              this.state.username = JSON.parse(value).username;
              this.state.email = JSON.parse(value).email;
            } catch (error) {
            }
        };
        _retrieveData();
    }

    logOut() {
        console.log("Logout")
        removeKey = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('username');
            await AsyncStorage.removeItem('password');
        } catch (error) {
            // Error saving data
        }
        };
        removeKey();
        const resetAction = StackActions.reset({
               index: 0,
               actions: [
                 NavigationActions.navigate({ routeName: 'Login'})
               ]
             });
        this.props.navigation.dispatch(resetAction);
    }

    render () {
        return (
            
            <ScrollView style={{ backgroundColor: '#e5e5e5' }}>
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#e5e5e5' }}>
                <View style={{ height: 32, backgroundColor: 'skyblue' }} />
                <View style={ styles.drawerHeaderWrapper }>
                    <View style={ styles.drawerHeaderstyle }>
                        <Image
                            style={{
                                width: 60,
                                height: 60,
                                resizeMode: 'contain',
                            }}
                            source={require('./assets/userDefault.png')} />
                    </View>
                    <View style={ styles.drawerHeaderNameWrapper }>
                        <Text style={ styles.drawerHeaderName }>{this.state.username}</Text>
                        <Text style={ styles.drawerHeaderEmail }>{this.state.email}</Text>
                    </View>
                    
                </View>
                <View style={styles.menuItemContainer}>
                    <FlatList
                        data={this.state.menuItem}
                        renderItem={
                            ({item}) =>
                                <TouchableOpacity
                                    style={{}}
                                    onPress={() => this.navigateToIntent(item.intent)}>
                                    <View style={{
                                        flexDirection: 'row',
                                        borderColor: '#c1c1c1',
                                        borderBottomWidth: 1,
                                    }}>
                                        <View style={{
                                            backgroundColor: '#f9f9f9',
                                            paddingTop: 11,
                                            paddingLeft: 15,
                                        }}>
                                            <Image
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    resizeMode: 'contain',
                                                    backgroundColor: '#f9f9f9'
                                                }}
                                                source={item.image} />
                                        </View>
                                        <Text
                                        style={styles.menuItemStyle}>
                                            {item.key}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            
                        }
                    />
                    <TouchableOpacity
                                        style={{}}
                                        onPress={() => this.logOut()}>
                                <View style={{
                                    flexDirection: 'row',
                                    borderColor: '#c1c1c1',
                                    borderBottomWidth: 1,
                                    }}>
                                    <View style={{
                                        backgroundColor: '#f9f9f9',
                                        paddingTop: 11,
                                        paddingLeft: 15,
                                    }}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode: 'contain',
                                                backgroundColor: '#f9f9f9'
                                            }}
                                            source={require('./assets/logout.png')} />
                                    </View>
                                    
                                        <Text style={styles.menuItemStyle}>
                                            Logout
                                        </Text>
                                    
                                </View>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>
            
        );
    }
}

const styles = StyleSheet.create({
    drawerHeaderstyle: {
        flex: 1, 
        flexDirection: 'row',
        height: 120, 
        backgroundColor: 'skyblue', 
        textAlign: 'center', 
        textAlignVertical: 'center', 
        fontSize: 30, 
        color: 'white', 
        paddingTop: 30,
        paddingLeft: 30,
    },
    drawerHeaderName: {
        textAlign: 'left', 
        fontSize: 15,
        color: 'white', 
    },
    drawerHeaderEmail: {
        textAlign: 'left', 
        fontSize: 15,
        paddingTop: 5,
        color: 'white', 
    },
    drawerHeaderNameWrapper: { 
        flex: 3, 
        flexDirection: 'column',
        height: 120,
        paddingTop: 35,
        backgroundColor: 'skyblue', 
    },
    drawerHeaderWrapper: {
        flex: 1, 
        flexDirection: 'row',
    },
    menuItemStyle: {
        flex: 1,
        fontSize: 20,
        color: '#828282',
        paddingLeft: 8,
        paddingTop: 13,
        paddingBottom: 13,
        backgroundColor: '#f9f9f9'
    },
    menuItemContainer: {

    }
})