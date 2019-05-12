import {AsyncStorage} from 'react-native';

const baseUrl = "https://ap-vehicle-tracking.herokuapp.com";

export const NetworkUtil = {
    users: baseUrl+"/user",
    roles: baseUrl+"/role",
    addCounter: baseUrl+"/counter",
    allCounters: baseUrl+"/counter",
    addVehicle: baseUrl+"/vehicle",
    allVehicles: baseUrl+"/vehicle",
    task: baseUrl+"/task",
    taskPage: baseUrl+"/task/page/",
    singleTask: baseUrl+"/task/",
    confirmTrip: baseUrl+"/task/confirm/trip/",
    confirmTripLeft: baseUrl+"/task/confirm/left/trip/",
    addTrip: baseUrl+"/task/add/trip/",
    taskWithCounterId: baseUrl+"/task/counter/",
    login: baseUrl+"/login",
    authorizedRequest: (callback)=> {
        let _retrieveData = async () => {
            try {
              const value = await AsyncStorage.getItem('token');
              callback(new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'auth-token': value,
                }));
            } catch (error) {
                console.log(error);
            }
        };
        _retrieveData();
    }
}