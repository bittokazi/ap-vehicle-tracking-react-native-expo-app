import React from 'react';
import { View, Text, TouchableOpacity, Picker, ActivityIndicator } from 'react-native';
import BaseDrawerUi from './../BaseDrawerUi';
import { TextField } from 'react-native-material-textfield';
import { NetworkUtil } from './../network/NetworkUtil';

export default class AddDriver extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
                        body: {
                            name: '',
                            mobile_number: '',
                            driving_license: '',
                        },
                        isLoading: false,
                        message: false,
                        success: false,
                        errors: [],
                    };
    }

    componentDidMount(){

    }

    addUser() {
        this.setState({
            isLoading: true,
        });
        console.info(this.state.body);
        NetworkUtil.authorizedRequest((header)=>{
            fetch(NetworkUtil.driver, {
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
                topBarTitle="Add Driver" 
                navigation={this.props.navigation}>
                
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Name'
                            value={this.state.body.name}
                            onChangeText={ (name) => {
                                let body = this.state.body;
                                body.name = name;
                                this.setState({ body })
                            }}
                        />
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Mobile Number'
                            value={this.state.body.mobile_number}
                            onChangeText={ (mobile_number) => {
                                let body = this.state.body;
                                body.mobile_number = mobile_number;
                                this.setState({ body })
                            }}
                        />
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Driving License'
                            value={this.state.body.driving_license}
                            onChangeText={ (driving_license) => {
                                let body = this.state.body;
                                body.driving_license = driving_license;
                                this.setState({ body })
                            }}
                        />
                    </View>

                    <View style={styles.textfieldWrapper}>
                        <TouchableOpacity onPress={() => this.addUser()}>
                            <Text style={styles.button}>Add Driver</Text>
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