import React from 'react';
import { View, Text, TouchableOpacity, Picker, ActivityIndicator } from 'react-native';
import BaseDrawerUi from './../BaseDrawerUi';
import { TextField } from 'react-native-material-textfield';
import { NetworkUtil } from './../network/NetworkUtil';

export default class AddCounter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            body: {
                title: '',
                district: '',
            },
            isLoading: false,
            dataSource: {},
            message: false,
            success: false
        }
    }

    addCounter() {
        this.setState({
            isLoading: true
        });
        NetworkUtil.authorizedRequest((header)=>{
            fetch(NetworkUtil.addCounter, {
                method: 'POST',
                headers: header,
                body: JSON.stringify(this.state.body)
           })
          .then((response) => response.json())
          .then((responseJson) => {
              console.log(responseJson);
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                    message: true,
                    success: responseJson.success
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
            topBarTitle="Add Counter" 
            navigation={this.props.navigation}>
            
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Title'
                            value={this.state.title}
                            onChangeText={ (title) => {this.state.body.title = title} }
                        />
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='District'
                            value={this.state.district}
                            onChangeText={ (district) => {this.state.body.district = district} }
                        />
                    </View>
                    <TouchableOpacity style={styles.textfieldWrapper}
                        onPress={() => this.addCounter()}>
                        <Text style={styles.button}>Sublmit</Text>
                    </TouchableOpacity>
                    {this.state.message && this.state.success &&
                        <View style={styles.textfieldWrapper}>
                            <Text style={{
                                textAlign: 'center', 
                                fontSize:15, 
                                color:'green', 
                                marginTop: 20}}>Added Counter</Text>
                        </View>
                    }
                    {this.state.message && !this.state.success &&
                        <View style={styles.textfieldWrapper}>
                            <Text style={{
                                textAlign: 'center', 
                                fontSize:15, 
                                color:'red', 
                                marginTop: 20}}>{this.state.dataSource.error[0]}</Text>
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