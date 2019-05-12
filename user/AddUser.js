import React from 'react';
import { View, Text, TouchableOpacity, Picker, ActivityIndicator } from 'react-native';
import BaseDrawerUi from './../BaseDrawerUi';
import { TextField } from 'react-native-material-textfield';
import { NetworkUtil } from './../network/NetworkUtil';

export default class AddUser extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
                        body: {
                            firstname: '',
                            lastname: '',
                            password: '',
                            email: '',
                            role: 1,
                            status: 1,
                            username: '',
                            counter_id: null,
                        },
                        isLoading: true,
                        dataSource: [],
                        counters: [],
                        message: false,
                        success: false,
                        errors: [],
                    };
    }

    componentDidMount(){
        NetworkUtil.authorizedRequest((header)=>{
            fetch(NetworkUtil.roles,{
                method: 'GET',
                headers: header
                 })
              .then((response) => response.json())
              .then((responseJson) => {
                this.setState({
                  dataSource: responseJson,
                }, function(){
                });
                this.loadCounters();
              })
              .catch((error) =>{
                console.error(error);
            });
        });
    }

    loadCounters() {
        NetworkUtil.authorizedRequest((header)=>{
            fetch(NetworkUtil.allCounters, {
                method: 'GET',
                headers: header
                 })
              .then((response) => response.json())
              .then((responseJson) => {
                responseJson.forEach(item => {
                    item.show = true;
                });
                this.setState({
                    isLoading:false,
                    counters: responseJson,
                }, function(){
                });
              })
              .catch((error) =>{
                console.error(error);
            });
        });
    }

    addUser() {
        this.setState({
            isLoading: true,
        });
        console.info(this.state.body);
        NetworkUtil.authorizedRequest((header)=>{
            fetch(NetworkUtil.users, {
                method: 'POST',
                headers: header,
                body: JSON.stringify(this.state.body)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                    this.setState({
                        isLoading: false,
                        message: true,
                        success: responseJson.success,
                        errors: responseJson.error,
                    });
            })
            .catch((error) =>{
                console.error(error);
            });
        });
    }

    render () {

        const {navigate} = this.props.navigation;

        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator style={{marginTop:50}}/>
                </View>
            )
        }

        return (
            <BaseDrawerUi 
                topBarTitle="Add User" 
                navigation={this.props.navigation}>
                
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='First Name'
                            value={this.state.body.firstname}
                            onChangeText={ (firstname) => {
                                let body = this.state.body;
                                body.firstname = firstname;
                                this.setState({ body })
                            }}
                        />
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Last Name'
                            value={this.state.body.lastname}
                            onChangeText={ (lastname) => {
                                let body = this.state.body;
                                body.lastname = lastname;
                                this.setState({ body })
                            }}
                        />
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Email'
                            value={this.state.body.email}
                            onChangeText={ (email) => {
                                let body = this.state.body;
                                body.email = email;
                                this.setState({ body })
                            }}
                        />
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Username'
                            value={this.state.body.username}
                            onChangeText={ (username) => {
                                let body = this.state.body;
                                body.username = username;
                                this.setState({ body })
                            }}
                        />
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Password'
                            value={this.state.body.password}
                            onChangeText={ (password) => {
                                let body = this.state.body;
                                body.password = password;
                                this.setState({ body })
                            }}
                        />
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <Picker
                            selectedValue={this.state.body.role}
                            style={{}}
                            onValueChange={(itemValue, itemIndex) =>{
                                let body = this.state.body;
                                body.role = itemValue;
                                this.setState({ body })
                            }}>
                            {
                                this.state.dataSource.map( (v)=>{
                                    return <Picker.Item label={v.title} value={v.id} />
                                })
                            }
                        </Picker>
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <Picker
                            selectedValue={this.state.body.status}
                            style={{}}
                            onValueChange={(itemValue, itemIndex) =>{
                                let body = this.state.body;
                                body.status = itemValue;
                                this.setState({ body })
                            }}>
                            <Picker.Item label="Active" value={1} />
                            <Picker.Item label="Inactive" value={0} />
                        </Picker>
                    </View>

                    <View style={styles.textfieldWrapper}>
                        <Picker
                            selectedValue={this.state.body.counter_id}
                            style={{}}
                            onValueChange={(itemValue, itemIndex) =>{
                                let body = this.state.body;
                                body.counter_id = itemValue;
                                this.setState({ body })
                            }}>
                            <Picker.Item label="Select Counter" value={null} />
                            {
                                this.state.counters.map( (v)=>{
                                    return <Picker.Item label={v.title} value={v.id} />
                                })
                            }
                        </Picker>
                    </View>

                    <View style={styles.textfieldWrapper}>
                        <TouchableOpacity onPress={() => this.addUser()}>
                            <Text style={styles.button}>Add User</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.message && this.state.success &&
                        <View style={styles.textfieldWrapper}>
                            <Text style={{
                                textAlign: 'center', 
                                fontSize:25, 
                                color:'green', 
                                marginTop: 20}}>Added User</Text>
                        </View>
                    }

                    {this.state.message && !this.state.success &&
                        <View style={styles.textfieldWrapper}>
                            <Text style={{
                                textAlign: 'center', 
                                fontSize:25, 
                                color:'red', 
                                marginTop: 20}}>{this.state.errors[0]}</Text>
                        </View>
                    }
                </View>

            </BaseDrawerUi>
        );
    }
}

const styles = {
    textfieldWrapper: {
        marginLeft: 30,
        marginRight: 30,
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
} 