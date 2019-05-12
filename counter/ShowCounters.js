import React from 'react';
import { StyleSheet, Text, FlatList, View, ActivityIndicator, TextInput, TouchableOpacity, Image } from 'react-native';
import BaseDrawerUi from './../BaseDrawerUi';
import { NetworkUtil } from './../network/NetworkUtil';
import {NavigationEvents} from 'react-navigation';

export default class ShowCounters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
        }
    }

    componentDidMount(){
        NetworkUtil.authorizedRequest((header)=>{
            fetch(NetworkUtil.allCounters,{
                method: 'GET',
                headers: header
            })
              .then((response) => response.json())
              .then((responseJson) => {
                this.setState({
                  isLoading: false,
                  dataSource: responseJson,
                }, function(){
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
                topBarTitle="Show Counters" 
                navigation={this.props.navigation}>

                <NavigationEvents onDidFocus={() => this.componentDidMount()} />

                    <FlatList
                        data={this.state.dataSource}
                        style={
                            {
                                backgroundColor: '#e6ebf7',
                            }
                        }
                        renderItem={
                            ({item}) =>
                                <TouchableOpacity>
                                    <View style={styles.cardWrapper}>
                                    <View style={styles.topBarWrapper}>
                                        <View style={styles.topBarInfo}>
                                            <View style={styles.topBarInfoRow}>
                                                <Text style={styles.styleOngoing}>{item.district}</Text>
                                            </View>
                                        </View>
                                        {/* <View style={styles.topBarInfo}>
                                            <View style={styles.topBarInfoRow}>
                                                <Text style={styles.time}>{item.created_at}</Text>
                                                <Image
                                                    style={styles.clockImage}
                                                    source={require('./../assets/clock.png')}
                                                />
                                            </View>
                                        </View> */}
                                    </View>
                                    <View
                                        style={{
                                            borderBottomColor: 'black',
                                            borderBottomWidth: 1,
                                        }}
                                        />
                                    <View style={styles.contentWrapper}>
                                        <View style={styles.contentSectionLeft}>
                                            <Image
                                                    style={styles.truckImage}
                                                    source={require('./../assets/location.png')}
                                                />
                                            <View style={styles.contentColumnRight}>
                                                <Text style={styles.contentTextLeft}>{item.title}</Text>
                                                <Text style={styles.contentTextLeftLower}>{item.district}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                </TouchableOpacity>
                        }
                    />

            </BaseDrawerUi>
        );
    }
}

const styles = {
    cardWrapper: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        padding: 10,
        backgroundColor: 'white'
    },
    topBarWrapper: {
        flexDirection: 'row',
    },
    topBarInfo: {
        flex:1,
        flexDirection: 'column',
    },
    topBarInfoRow: {
        flexDirection: 'row',
    },
    contentWrapper: {
        flexDirection: 'row',
    },
    contentSectionLeft: {
        flexDirection: 'row',
    },
    contentSectionMiddle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentSectionRight: {
        flex: 2,
        flexDirection: 'row',
    },
    imageMiddle: {
        height:45,
        width: 45,
        marginTop: 8,
    },
    truckImage: {
        height:45,
        width: 45,
        marginTop: 10,
        marginLeft:10
    }, 
    truckImageRight: {
        height:45,
        width: 45,
        alignSelf: 'baseline',
        marginRight: 10,
        marginTop: 10
    }, 
    contentText: {
        marginTop: 5,
        textAlign: 'left',
    },
    contentTextLower: {
        marginTop: 5,
        textAlign: 'left',
    },
    contentTextLeft: {
        marginTop: 5,
        textAlign: 'left',
    },
    contentTextLeftLower: {
        marginTop: 5,
        textAlign: 'left',
    },
    contentColumn: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 5,
    },
    styleCompleted: {
        backgroundColor: 'green',
        padding: 4,
        color: 'white',
        fontSize: 12,
        borderRadius: 4,
        marginBottom: 10,
    },
    styleOngoing: {
        backgroundColor: 'green',
        padding: 4,
        color: 'white',
        fontSize: 12,
        borderRadius: 4,
        marginBottom: 10,
    },
    clockImage: {
        height: 20,
        width: 20,
        marginTop: 3,
    }, 
    time: {
        flex: 1,
        fontSize: 12,
        textAlign: 'right',
        paddingRight: 7,
        marginTop: 4,
    },
    contentColumnRight: {
        marginLeft: 15,
        flexDirection: 'column',
        marginTop: 5,
    },
} 