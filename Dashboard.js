import React from 'react';
import { RefreshControl, ScrollView, Text, FlatList, View, TextInput, TouchableOpacity, Image } from 'react-native';
import BaseDrawerUi from './BaseDrawerUi';
import { NetworkUtil } from './network/NetworkUtil';
import {NavigationEvents} from 'react-navigation';
import {AsyncStorage} from 'react-native';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
            refreshing:false,
            userRole: 0
        }
        this.page = 0;
    }

    _onRefresh() {
        if(this.state.userRole==1) {
            this.setState({refreshing: false});
        } else {
            this.setState({refreshing: true,dataSource:[]});
            this.page = 0;
            this.loadData();
        }
      }

    componentDidMount(){
        let removeKey = async () => {
            try {
                const value = await AsyncStorage.getItem('updatetaskid');
                const user = await AsyncStorage.getItem('user');
                this.setState({userRole: JSON.parse(user).roleEntity.id});
                if(value!=null) {
                    if(JSON.parse(user).roleEntity.id==2) {
                        console.log(value, "fff");
                        for(let i=0; i<this.state.dataSource.length; i++) {
                            if(""+this.state.dataSource[i].taskEntity.id+""==value) {
                              this.state.dataSource[i].taskEntity.completed = 1;
                            }
                        }
                    }
                  this.setState({
                    dataSource: this.state.dataSource,
                  });
                  await AsyncStorage.removeItem('updatetaskid');
                }
                this.loadData();
              } catch (error) {
                  console.log(error);
              }
            };
            removeKey();
    }

    loadData() {
        let _retrieveData = async () => {
            try {
              const value = await AsyncStorage.getItem('user');
              if(JSON.parse(value).roleEntity.id==1) {}
              else if(JSON.parse(value).userCounterEntity!=null) {
                NetworkUtil.authorizedRequest((header)=>{
                    fetch(NetworkUtil.taskWithCounterId+JSON.parse(value).userCounterEntity.id+"/page/"+this.page,{
                        method: 'GET',
                        headers: header
                    })
                      .then((response) => response.json())
                      .then((responseJson) => {
                        this.page++;
                        this.setState({
                          isLoading: false,
                          refreshing: false,
                          dataSource: [...this.state.dataSource, ...responseJson],
                        }, function(){
                        });
                      })
                      .catch((error) =>{
                        console.error(error);
                    });
                });
              }
            } catch (error) {
                console.log(error);
            }
          };
          _retrieveData();
    }

    render () {

        const {navigate} = this.props.navigation;

        return (
            <BaseDrawerUi 
                topBarTitle="Dashboard" 
                navigation={this.props.navigation}>

                <NavigationEvents onDidFocus={() => this.componentDidMount()} />

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={()=>this._onRefresh()}
                        />
                        } 
                    style={{ backgroundColor: '#e6ebf7' }}>

                    <FlatList
                        data={this.state.dataSource}
                        style={
                            {
                                backgroundColor: '#e6ebf7',
                            }
                        }
                        renderItem={
                            ({item}) =>{
                                item = item.taskEntity;
                                return (
                                <TouchableOpacity
                                    onPress={() => navigate('ShowTask', { id: item.id })}>
                                    <View style={styles.cardWrapper}>
                                    <View style={styles.topBarWrapper}>
                                        <View style={styles.topBarInfo}>
                                            <View style={styles.topBarInfoRow}>
                                                { 
                                                    item.completed==1 && 
                                                    <Text style={styles.styleCompleted}>Completed</Text>
                                                }
                                                { 
                                                    item.completed!=1 && 
                                                    <Text style={styles.styleOngoing}>Ongoing</Text>
                                                }
                                            </View>
                                        </View>
                                        <View style={styles.topBarInfo}>
                                            <View style={styles.topBarInfoRow}>
                                                <Text style={styles.time}>{item.created_at}</Text>
                                                <Image
                                                    style={styles.clockImage}
                                                    source={require('./assets/clock.png')}
                                                />
                                            </View>
                                        </View>
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
                                                    source={require('./assets/truckImg.png')}
                                                    onPress={()=>this.removeTrip(trip.id)}
                                                />
                                            <View style={styles.contentColumn}>
                                                <Text style={styles.contentTextLeft}>{item.counterStartEntity.title}</Text>
                                                <Text style={styles.contentTextLeftLower}>{item.taskVehicleEntity.title}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.contentSectionMiddle}>
                                            <Image
                                                    style={styles.imageMiddle}
                                                    source={require('./assets/biDirection.png')}
                                                    onPress={()=>this.removeTrip(trip.id)}
                                                />
                                        </View>
                                        <View style={styles.contentSectionRight}>
                                            <View style={styles.contentColumn}>
                                                <Text style={styles.contentText}>{item.counterEndEntity.title}</Text>
                                                <Text style={styles.contentTextLower}>{item.taskVehicleEntity.registration_number}</Text>
                                            </View>
                                            <Image
                                                    style={styles.truckImageRight}
                                                    source={require('./assets/truckImg.png')}
                                                />
                                        </View>
                                    </View>
                                </View>
                                </TouchableOpacity>
                                )
                            }
                        }
                    />

                    {
                        this.state.userRole==2 && 
                        <View style = { styles.footerStyle }>
                    
                            <TouchableOpacity 
                                activeOpacity = { 0.7 } 
                                style = { styles.TouchableOpacity_style }
                                onPress = { () => this.loadData() } 
                                >

                                <Text style = { styles.TouchableOpacity_Inside_Text }>Load More Data From Server</Text>
                                {
                                    ( this.state.fetching_Status )
                                    ?
                                        <ActivityIndicator color = "#fff" style = {{ marginLeft: 6 }} />
                                    :
                                        null
                                }

                            </TouchableOpacity> 

                        </View>
                    }


                </ScrollView>

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
        flex: 2,
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
        textAlign: 'right',
    },
    contentTextLeftLower: {
        marginTop: 5,
        textAlign: 'right',
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
        backgroundColor: 'orange',
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
    MainContainer:
  {
    flex: 1,
    justifyContent: 'center',
    margin: 5,
  },
 
  footerStyle:
  {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  TouchableOpacity_style:
  {
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: 5,
  },
 
  TouchableOpacity_Inside_Text:
  {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18
  },
 
  flatList_items:
  {
    fontSize: 20,
    color: '#000',
    padding: 10
  },
} 