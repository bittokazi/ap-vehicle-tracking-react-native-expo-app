import React from 'react';
import { View, Text, TouchableOpacity, Picker, ActivityIndicator, Image, ScrollView } from 'react-native';
import BaseDrawerUi from './../BaseDrawerUi';
import { TextField } from 'react-native-material-textfield';
import { NetworkUtil } from './../network/NetworkUtil';

export default class AddTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            counters: [],
            vehicles: [],
            message: false,
            success: false,
            tripEntity: [],
            body: {
                title: '',
                start_counter: '',
                end_counter: '',
                description: '',
                vehicle_id: '',
                description: '',
                tripEntity: [],
            }
        }
    }

    tripEntityGenerator(vehicle, to, order) {
        return {
            description : "n/a",
            order_number: order,
            tripVehicleEntity : [{
                id: vehicle
            }],
            tripToCounterEntity : [{
                id: to,
            }]
        }
    }

    componentDidMount() {
        this.loadVehicle();
    }

    loadVehicle() {
        this.setState({
            isLoading: true
        });
        NetworkUtil.authorizedRequest((header)=>{
            fetch(NetworkUtil.allVehicles, {
                method: 'GET',
                headers: header
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                vehicles: responseJson,
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

    addTask() {
        if(this.state.body.vehicle_id=='' || this.state.body.start_counter=='' || this.state.body.end_counter=='') {
            this.setState({
                            dataSource: {error:['Missing Start/end Counter or vehicle']},
                            message: true,
                            success: false
                        });
            return ;
        }
        for(let i =0; i<this.state.counters.length; i++) {
            if(this.state.counters[i].id==this.state.body.start_counter) {
                this.state.body.tripEntity.splice(0,0,
                    this.tripEntityGenerator(
                        this.state.body.vehicle_id, 
                        this.state.counters[i].id,
                        0)
                    );
            }
        }
        for(let i =0; i<this.state.counters.length; i++) {
            if(this.state.counters[i].id==this.state.body.end_counter) {
                this.state.body.tripEntity.push(
                    this.tripEntityGenerator(
                        this.state.body.vehicle_id, 
                        this.state.counters[i].id,
                        0)
                    );
            }
        }
        for( let i = 0; i < this.state.body.tripEntity.length; i++){
            this.state.body.tripEntity[i].order_number = i;
        }
        console.log(this.state.body);
        this.setState({
            isLoading: true
        });
        NetworkUtil.authorizedRequest((header)=>{
            fetch(NetworkUtil.task, {
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

    addHops(item) {
        if(this.state.body.vehicle_id=='' || this.state.body.start_counter=='' || this.state.body.end_counter=='') {
            this.setState({
                            dataSource: {error:['Missing Start/end Counter or vehicle']},
                            message: true,
                            success: false
                        });
            return ;
        }
        if(this.state.body.start_counter==this.state.counters[item].id || this.state.body.end_counter==this.state.counters[item].id) {
            this.setState({
                dataSource: {error:['Already Selected as Start or end counter']},
                message: true,
                success: false,
            });
            return ;
        }
        found =false;
        this.state.tripEntity.forEach(trip => {
            if(trip.id==this.state.counters[item].id){
                found = true;
            }
        })
        if(!found) {
            this.state.counters[item].show = false;
            this.state.body.tripEntity.push(this.tripEntityGenerator(
                    this.state.body.vehicle_id, 
                    this.state.counters[item].id,
                    0)
                );
            this.state.tripEntity.push(this.state.counters[item]);
            this.setState({tripEntity: this.state.tripEntity});
        }
    }

    removeTrip(id) {
        console.log(id);
        for( let i = 0; i < this.state.tripEntity.length; i++){
            console.log(this.state.body.tripEntity[i].id+" - "+id);
           if(this.state.tripEntity[i].id==id) {
            this.state.body.tripEntity.splice(i, 1); 
            this.state.tripEntity.splice(i, 1);
           }
        } 
        for( let i = 0; i < this.state.body.tripEntity.length; i++){
            this.state.body.tripEntity[i].order_number = i;
        }
        this.setState({tripEntity: this.state.tripEntity});
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
            topBarTitle="Add Task" 
            navigation={this.props.navigation}>

                <ScrollView style={{ }}>
            
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Title'
                            value={this.state.body.title}
                            onChangeText={ (title) => {
                                let prop = this.state.body
                                prop.title = title;
                                this.setState({prop})} }
                        />
                    </View>
                    <View style={styles.textfieldWrapper}>
                        <Picker
                            selectedValue={this.state.body.start_counter}
                            style={{}}
                            onValueChange={ (itemValue, itemIndexnter) => {
                                this.state.tripEntity = [];
                                this.state.body.tripEntity = [];
                                let prop = this.state.body
                                prop.start_counter = itemValue;
                                this.setState({prop})} }>
                                <Picker.Item label="Start Counter" value="" />
                                {
                                    this.state.counters.map( (v)=>{
                                        return <Picker.Item label={v.title} value={v.id} />
                                    })
                                }
                        </Picker>
                    </View>

                    <View style={styles.textfieldWrapper}>
                        <Picker
                            selectedValue={this.state.body.end_counter}
                            style={{}}
                            onValueChange={ (itemValue, itemIndexnter) => {
                                this.state.tripEntity = [];
                                this.state.body.tripEntity = [];
                                let prop = this.state.body
                                prop.end_counter = itemValue;
                                this.setState({prop})} }>
                                <Picker.Item label="End Counter" value="" />
                                {
                                    this.state.counters.map( (v)=>{
                                        return <Picker.Item label={v.title} value={v.id} />
                                    })
                                }
                        </Picker>
                    </View>

                    <View style={styles.textfieldWrapper}>
                        <Picker
                            selectedValue={this.state.body.vehicle_id}
                            style={{}}
                            onValueChange={ (itemValue, itemIndexnter) => {
                                this.state.tripEntity = [];
                                this.state.body.tripEntity = [];
                                let prop = this.state.body;
                                prop.vehicle_id = itemValue;
                                this.setState({prop})} }>
                                <Picker.Item label="Select Vehicle" value="" />
                                {
                                    this.state.vehicles.map( (v)=>{
                                        return <Picker.Item label={v.title} value={v.id} />
                                    })
                                }
                        </Picker>
                    </View>

                    <View style={styles.textfieldWrapper}>
                        <TextField
                            label='Description'
                            value={this.state.body.description}
                            onChangeText={ (description) => {
                                let prop = this.state.body
                                prop.end_counter = description;
                                this.setState({prop})} }
                        />
                    </View>

                    <View style={styles.textfieldWrapperWithHop}>
                        <Text style={styles.hopTitle}>Hops</Text>
                        {
                            this.state.tripEntity.map(trip=>{
                                return (
                                    <View style={styles.hopsHolder}>
                                        <Text style={styles.hopItem}>{trip.title}</Text>
                                        <TouchableOpacity style={{}}
                                            onPress={()=>this.removeTrip(trip.id)}>
                                            <Image
                                                style={styles.hopRemoveButton}
                                                source={require('./../assets/close.png')}
                                                onPress={()=>this.removeTrip(trip.id)}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                        <View style={styles.hopPicker}>
                            <Picker style={styles.pickerItem}
                                style={{}}
                                onValueChange={(itemValue, itemIndex) =>
                                this.addHops(itemIndex)
                                }>
                                {
                                    this.state.counters.map( (v)=>{
                                        return <Picker.Item style={styles.pickerItem} label={v.title} value={v.id} />
                                    })
                                }
                            </Picker>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.textfieldWrapper}
                        onPress={() => this.addTask()}>
                        <Text style={styles.button}>Submit</Text>
                    </TouchableOpacity>

                    {this.state.message && this.state.success &&
                        <View style={styles.textfieldWrapper}>
                            <Text style={{
                                textAlign: 'center', 
                                fontSize:25, 
                                color:'green', 
                                marginTop: 20}}>Added Task</Text>
                        </View>
                    }

                    {this.state.message && !this.state.success &&
                        <View style={styles.textfieldWrapper}>
                            <Text style={{
                                textAlign: 'center', 
                                fontSize:25, 
                                color:'red', 
                                marginTop: 20}}>{this.state.dataSource.error[0]}</Text>
                        </View>
                    }

                </View>
                
                </ScrollView>
            </BaseDrawerUi>
        );
    }
}

const styles = {
    textfieldWrapper: {
        marginLeft: 30,
        marginRight: 30,
    },
    textfieldWrapperWithHop: {
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#d3e3ff',
    },
    hopsHolder: {
        flexDirection: 'row',
        marginLeft: 30,
        marginRight: 30,
    },
    hopRemoveButton: {
        height:25,
        width: 25,
        marginTop: 20,
        marginLeft: 10
    },
    hopPicker: {
        marginTop: 15,
        marginBottom: 15,
    },
    hopItem: {
        backgroundColor: '#4984ed',
        textAlign: 'center',
        padding: 5,
        fontSize: 20,
        marginTop: 15,
        flex: 1,
        color: 'white',
    },
    hopTitle: {
        textAlign: 'center',
        padding: 5,
        fontSize: 20,
        color: 'white',
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
    pickerItem: {
        textAlign: 'center',
        padding: 5,
        fontSize: 20,
    }
} 