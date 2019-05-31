import React from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Picker,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import BaseDrawerUi from "./../BaseDrawerUi";
import { NetworkUtil } from "./../network/NetworkUtil";
import { NavigationEvents } from "react-navigation";
import { AsyncStorage } from "react-native";
import { MapView, Polyline } from "expo";

export default class ShowTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      counters: [],
      hopId: -1,
      order_number: -1,
      message: false,
      success: "",
      userRole: null,
      taskCheck: false,
      dataSourceForManager: null,
      mapRegion: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922 * 5,
        longitudeDelta: 0.0421 * 5
      }
    };
    this.userRole = 0;
    this.counterId = 0;
  }

  componentDidMount() {
    let _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem("user");
        this.userRole = JSON.parse(value).roleEntity.id;
        if (JSON.parse(value).roleEntity.id == 1) {
          NetworkUtil.authorizedRequest(header => {
            fetch(
              NetworkUtil.singleTask + this.props.navigation.state.params.id,
              {
                method: "GET",
                headers: header
              }
            )
              .then(response => response.json())
              .then(responseJson => {
                this.setState(
                  {
                    isLoading: false,
                    dataSource: responseJson
                  },
                  function() {}
                );
                this.setState({
                  mapRegion: {
                    latitude: this.state.dataSource.tripEntity[0]
                      .tripToCounterEntity[0].location.lat,
                    longitude: this.state.dataSource.tripEntity[0]
                      .tripToCounterEntity[0].location.lng,
                    latitudeDelta: 0.0922 * 5,
                    longitudeDelta: 0.0421 * 5
                  }
                });
                this.loadCounters();
              })
              .catch(error => {
                console.error(error);
              });
          });
        } else if (JSON.parse(value).userCounterEntity != null) {
          this.counterId = JSON.parse(value).userCounterEntity.id;
          NetworkUtil.authorizedRequest(header => {
            fetch(
              NetworkUtil.task +
                "/" +
                this.props.navigation.state.params.id +
                "/counter/" +
                JSON.parse(value).userCounterEntity.id,
              {
                method: "GET",
                headers: header
              }
            )
              .then(response => response.json())
              .then(responseJson => {
                console.log(responseJson);
                if (responseJson == null) {
                  NetworkUtil.authorizedRequest(header => {
                    fetch(
                      NetworkUtil.singleTask +
                        this.props.navigation.state.params.id,
                      {
                        method: "GET",
                        headers: header
                      }
                    )
                      .then(response => response.json())
                      .then(responseJson => {
                        console.log(responseJson);
                        this.setState(
                          {
                            isLoading: false,
                            taskCheck: true,
                            dataSource: responseJson
                          },
                          function() {}
                        );
                        this.loadCounters();
                      })
                      .catch(error => {
                        console.error(error);
                      });
                  });
                }
                this.setState(
                  {
                    isLoading: false,
                    dataSourceForManager: responseJson
                  },
                  function() {}
                );
              })
              .catch(error => {
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

  loadCounters() {
    NetworkUtil.authorizedRequest(header => {
      fetch(NetworkUtil.allCounters, {
        method: "GET",
        headers: header
      })
        .then(response => response.json())
        .then(responseJson => {
          responseJson.forEach(item => {
            item.show = true;
          });
          this.setState(
            {
              isLoading: false,
              counters: responseJson
            },
            function() {}
          );
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  confirmTrip(id) {
    NetworkUtil.authorizedRequest(header => {
      fetch(NetworkUtil.confirmTrip + id, {
        method: "GET",
        headers: header
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.completed) {
            let id = responseJson.id;
            console.log(responseJson.completed, "fff", responseJson.id);
            let _storeLogin = async () => {
              try {
                await AsyncStorage.setItem("updatetaskid", "" + id + "");
                console.log(
                  responseJson.completed,
                  "fff",
                  await AsyncStorage.getItem("updatetaskid")
                );
              } catch (error) {
                console.log(error);
              }
            };
            _storeLogin();
          }
          if (this.userRole == 2) {
            this.componentDidMount();
          } else {
            this.setState(
              {
                isLoading: false,
                dataSource: responseJson
              },
              function() {}
            );
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  confirmLeft(id) {
    NetworkUtil.authorizedRequest(header => {
      fetch(NetworkUtil.confirmTripLeft + id, {
        method: "GET",
        headers: header
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (this.userRole == 2) {
            this.componentDidMount();
          } else {
            this.setState(
              {
                isLoading: false,
                dataSource: responseJson
              },
              function() {}
            );
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  addTask(order) {
    let hopIdTemp = this.state.hopId;
    if (this.userRole == 2) this.state.hopId = this.counterId;
    let found = false;
    if (
      this.state.order_number != -1 &&
      this.state.hopId != -1 &&
      this.state.order_number == order
    ) {
      console.log(this.state.dataSource.tripEntity.length);
      if (
        this.userRole == 2 &&
        this.state.dataSource.tripEntity[
          this.state.dataSource.tripEntity.length - 1
        ].order_number == this.state.order_number
      ) {
        found = true;
      }
      for (let i = 0; i < this.state.dataSource.tripEntity.length; i++) {
        console.log(
          this.state.dataSource.tripEntity[i].tripToCounterEntity[0].id,
          " - ",
          this.state.hopId
        );
        if (
          this.state.dataSource.tripEntity[i].tripToCounterEntity[0].id ==
          this.state.hopId
        ) {
          found = true;
        }
      }
    } else {
      return;
    }
    if (!found) {
      let trip = {
        description: "n/a",
        task_id: this.props.navigation.state.params.id,
        order_number: this.state.order_number,
        tripVehicleEntity: [
          {
            id: this.state.dataSource.taskVehicleEntity.id
          }
        ],
        tripToCounterEntity: [
          {
            id: this.state.hopId
          }
        ]
      };
      console.log(trip);
      this.addCheckIn(trip);
    }
    if (this.userRole == 2) this.state.hopId = hopIdTemp;
  }

  addCheckIn(trip) {
    NetworkUtil.authorizedRequest(header => {
      fetch(NetworkUtil.addTrip, {
        method: "POST",
        headers: header,
        body: JSON.stringify(trip)
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (this.userRole == 2) {
            this.componentDidMount();
          } else {
            this.setState({
              isLoading: false,
              dataSource: responseJson.task,
              message: true,
              success: responseJson.success
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    const renderSites = () => {
      const renderedSites = this.state.dataSource.tripEntity.map(trip => {
        return (
          <MapView.Marker
            key={trip.id}
            title={trip.tripToCounterEntity[0].title}
            coordinate={{
              latitude: trip.tripToCounterEntity[0].location.lat,
              longitude: trip.tripToCounterEntity[0].location.lng
            }}
          />
        );
      });
      return renderedSites;
    };

    const polyLine = () => {
      let poly = [];
      this.state.dataSource.tripEntity.map(trip => {
        poly.push({
          latitude: trip.tripToCounterEntity[0].location.lat,
          longitude: trip.tripToCounterEntity[0].location.lng
        });
      });
      return (
        <MapView.Polyline
          coordinates={poly}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={6}
        />
      );
    };

    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator style={{ marginTop: 50 }} />
        </View>
      );
    }

    return (
      <BaseDrawerUi topBarTitle="Show Task" navigation={this.props.navigation}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />

        <ScrollView
          style={{
            backgroundColor: "#e6ebf7"
          }}
        >
          {!this.isLoading && this.userRole == 1 && (
            <View style={styles.cardWrapper}>
              <View style={styles.contentWrapper}>
                <MapView
                  style={{
                    flex: 1,
                    height: 300
                  }}
                  initialRegion={this.state.mapRegion}
                >
                  {renderSites()}
                  {polyLine()}
                </MapView>
              </View>
            </View>
          )}

          {this.userRole == 1 &&
            !this.isLoading && (
              <View style={styles.cardWrapper}>
                <View style={styles.contentWrapper}>
                  <View style={styles.contentSectionLeft}>
                    <Image
                      style={styles.truckImage}
                      source={require("./../assets/location.png")}
                    />
                    <View style={styles.contentColumn}>
                      <Text style={styles.contentTextLeft}>
                        {this.state.dataSource.counterStartEntity.title}
                      </Text>
                      <Text style={styles.contentTextLeftLower}>
                        {this.state.dataSource.counterStartEntity.district}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.contentSectionMiddle}>
                    <Image
                      style={styles.imageMiddle}
                      source={require("./../assets/arrowRight.png")}
                    />
                  </View>
                  <View style={styles.contentSectionRight}>
                    <View style={styles.contentColumn}>
                      <Text style={styles.contentText}>
                        {this.state.dataSource.counterEndEntity.title}
                      </Text>
                      <Text style={styles.contentTextLower}>
                        {this.state.dataSource.counterEndEntity.district}
                      </Text>
                    </View>
                    <Image
                      style={styles.truckImageRight}
                      source={require("./../assets/location.png")}
                    />
                  </View>
                </View>
                <View style={styles.contentWrapper}>
                  <View style={styles.contentSectionLeft}>
                    <Image
                      style={styles.truckImage}
                      source={require("./../assets/truckImg.png")}
                    />
                    <View style={styles.contentColumnRight}>
                      <Text style={styles.contentText}>
                        {this.state.dataSource.taskVehicleEntity.title}
                      </Text>
                      <Text style={styles.contentTextLower}>
                        {
                          this.state.dataSource.taskVehicleEntity
                            .registration_number
                        }
                      </Text>
                    </View>
                    <View style={styles.contentColumnRight}>
                      <Text style={styles.contentText}>
                        Distance
                      </Text>
                      <Text style={styles.contentTextLower}>
                        {
                          this.state.dataSource.distance
                        } KM
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

          {this.userRole == 1 &&
            !this.isLoading && (
              <FlatList
                data={this.state.dataSource.tripEntity}
                style={{
                  backgroundColor: "#e6ebf7"
                }}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.cardWrapper}>
                      <View style={styles.topBarWrapper}>
                        <View style={styles.topBarInfo}>
                          <View style={styles.topBarInfoRow}>
                            {item.created_at != null && (
                              <Text style={styles.styleCompleted}>Reached</Text>
                            )}
                            {item.created_at == null && (
                              <Text style={styles.styleOngoing}>
                                Not Reached
                              </Text>
                            )}
                          </View>
                        </View>
                        <View style={styles.topBarInfo}>
                          <View style={styles.topBarInfoRow}>
                            <Text style={styles.time}>{item.created_at}</Text>
                            <Image
                              style={styles.clockImage}
                              source={require("./../assets/clock.png")}
                            />
                            {item.created_at == null && (
                              <TouchableOpacity
                                onPress={() => this.confirmTrip(item.id)}
                              >
                                <Image
                                  style={styles.confirmImage}
                                  source={require("./../assets/confirm.png")}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          borderBottomColor: "black",
                          borderBottomWidth: 1
                        }}
                      />
                      <View style={styles.contentWrapper}>
                        <View style={styles.contentSectionLeft}>
                          <Image
                            style={styles.truckImage}
                            source={require("./../assets/truckImg.png")}
                          />
                          <View style={styles.contentColumn}>
                            <Text style={styles.contentTextLeft}>
                              {item.tripVehicleEntity[0].title}
                            </Text>
                            <Text style={styles.contentTextLeftLower}>
                              {item.tripVehicleEntity[0].registration_number}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.contentSectionMiddle}>
                          <Image
                            style={styles.imageMiddle}
                            source={require("./../assets/arrowRight.png")}
                            onPress={() => this.removeTrip(trip.id)}
                          />
                        </View>
                        <View style={styles.contentSectionRight}>
                          <View style={styles.contentColumn}>
                            <Text style={styles.contentText}>
                              {item.tripToCounterEntity[0].title}
                            </Text>
                            <Text style={styles.contentTextLower}>
                              {item.tripToCounterEntity[0].district}
                            </Text>
                          </View>
                          <Image
                            style={styles.truckImageRight}
                            source={require("./../assets/location.png")}
                          />
                        </View>
                      </View>

                      <View
                        style={{
                          borderBottomColor: "black",
                          borderBottomWidth: 1,
                          marginTop: 10,
                          marginBottom: 10
                        }}
                      />

                      <View style={styles.topBarWrapper}>
                        <View style={styles.topBarInfo}>
                          <View style={styles.topBarInfoRow}>
                            {item.left_at != null && (
                              <Text style={styles.styleCompleted}>
                                Left Confirmed
                              </Text>
                            )}
                            {item.left_at == null && (
                              <Text style={styles.styleOngoing}>Not Left</Text>
                            )}
                          </View>
                        </View>
                        <View style={styles.topBarInfo}>
                          <View style={styles.topBarInfoRow}>
                            <Text style={styles.time}>{item.left_at}</Text>
                            <Image
                              style={styles.clockImage}
                              source={require("./../assets/clock.png")}
                            />
                            {item.left_at == null && (
                              <TouchableOpacity
                                onPress={() => this.confirmLeft(item.id)}
                              >
                                <Image
                                  style={styles.confirmImage}
                                  source={require("./../assets/confirm.png")}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                    {item.tripToCounterEntity[0].id !=
                      this.state.dataSource.counterEndEntity.id &&
                      this.state.dataSource.completed != 1 && (
                        <View style={styles.cardWrapper}>
                          <View style={styles.topBarWrapper}>
                            <View style={styles.topBarInfo}>
                              <Picker
                                style={styles.pickerItem}
                                selectedValue={this.state.hopId}
                                onValueChange={(itemValue, itemIndex) => {
                                  this.state.hopId = itemValue;
                                  this.state.order_number = item.order_number;
                                  this.setState({
                                    hopId: itemValue,
                                    order_number: item.order_number
                                  });
                                  console.log(
                                    this.state.hopId,
                                    this.state.order_number
                                  );
                                }}
                              >
                                <Picker.Item label="N/A" value="" />
                                {this.state.counters.map(v => {
                                  return (
                                    <Picker.Item
                                      style={styles.pickerItem}
                                      label={v.title}
                                      value={v.id}
                                    />
                                  );
                                })}
                              </Picker>
                            </View>
                          </View>
                          <View style={styles.topBarWrapper}>
                            <View style={styles.topBarInfo}>
                              <TouchableOpacity
                                style={{}}
                                onPress={() => this.addTask(item.order_number)}
                              >
                                <Text style={styles.button}>Check In</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                  </View>
                )}
              />
            )}

          {this.userRole == 2 &&
            !this.isLoading &&
            this.state.dataSourceForManager != null && (
              <View>
                <View style={styles.cardWrapper}>
                  <View style={styles.topBarWrapper}>
                    <View style={styles.topBarInfo}>
                      <View style={styles.topBarInfoRow}>
                        {this.state.dataSourceForManager.created_at != null && (
                          <Text style={styles.styleCompleted}>Reached</Text>
                        )}
                        {this.state.dataSourceForManager.created_at == null && (
                          <Text style={styles.styleOngoing}>Not Reached</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.topBarInfo}>
                      <View style={styles.topBarInfoRow}>
                        <Text style={styles.time}>
                          {this.state.dataSourceForManager.created_at}
                        </Text>
                        <Image
                          style={styles.clockImage}
                          source={require("./../assets/clock.png")}
                        />
                        {this.state.dataSourceForManager.created_at == null && (
                          <TouchableOpacity
                            onPress={() =>
                              this.confirmTrip(
                                this.state.dataSourceForManager.trip_id
                              )
                            }
                          >
                            <Image
                              style={styles.confirmImage}
                              source={require("./../assets/confirm.png")}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: 1
                    }}
                  />
                  <View style={styles.contentWrapper}>
                    <View style={styles.contentSectionLeft}>
                      <Image
                        style={styles.truckImage}
                        source={require("./../assets/truckImg.png")}
                      />
                      <View style={styles.contentColumn}>
                        <Text style={styles.contentTextLeft}>
                          {
                            this.state.dataSourceForManager.tripVehicleEntity[0]
                              .title
                          }
                        </Text>
                        <Text style={styles.contentTextLeftLower}>
                          {
                            this.state.dataSourceForManager.tripVehicleEntity[0]
                              .registration_number
                          }
                        </Text>
                      </View>
                    </View>
                    <View style={styles.contentSectionMiddle}>
                      <Image
                        style={styles.imageMiddle}
                        source={require("./../assets/arrowRight.png")}
                        onPress={() =>
                          this.removeTrip(
                            this.state.dataSourceForManager.trip_id
                          )
                        }
                      />
                    </View>
                    <View style={styles.contentSectionRight}>
                      <View style={styles.contentColumn}>
                        <Text style={styles.contentText}>
                          {this.state.dataSourceForManager.title}
                        </Text>
                        <Text style={styles.contentTextLower}>
                          {this.state.dataSourceForManager.district}
                        </Text>
                      </View>
                      <Image
                        style={styles.truckImageRight}
                        source={require("./../assets/location.png")}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: 1,
                      marginTop: 10,
                      marginBottom: 10
                    }}
                  />

                  <View style={styles.topBarWrapper}>
                    <View style={styles.topBarInfo}>
                      <View style={styles.topBarInfoRow}>
                        {this.state.dataSourceForManager.left_at != null && (
                          <Text style={styles.styleCompleted}>
                            Left Confirmed
                          </Text>
                        )}
                        {this.state.dataSourceForManager.left_at == null && (
                          <Text style={styles.styleOngoing}>Not Left</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.topBarInfo}>
                      <View style={styles.topBarInfoRow}>
                        <Text style={styles.time}>
                          {this.state.dataSourceForManager.left_at}
                        </Text>
                        <Image
                          style={styles.clockImage}
                          source={require("./../assets/clock.png")}
                        />
                        {this.state.dataSourceForManager.left_at == null && (
                          <TouchableOpacity
                            onPress={() =>
                              this.confirmLeft(
                                this.state.dataSourceForManager.trip_id
                              )
                            }
                          >
                            <Image
                              style={styles.confirmImage}
                              source={require("./../assets/confirm.png")}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

          {this.userRole == 2 &&
            !this.isLoading &&
            this.state.dataSourceForManager == null &&
            this.state.taskCheck && (
              <View>
                <View style={styles.cardWrapper}>
                  <View style={styles.topBarWrapper}>
                    <View style={styles.topBarInfo}>
                      <Picker
                        style={styles.pickerItem}
                        selectedValue={this.state.hopId}
                        onValueChange={(itemValue, itemIndex) => {
                          this.state.hopId = itemValue;
                          this.state.order_number = this.state.dataSource.tripEntity[
                            itemIndex - 1
                          ].order_number;
                          this.setState({
                            hopId: itemValue,
                            order_number: this.state.dataSource.tripEntity[
                              itemIndex - 1
                            ].order_number
                          });
                          console.log(
                            this.state.hopId,
                            this.state.order_number
                          );
                        }}
                      >
                        <Picker.Item label="Select After Counter" value="" />
                        {this.state.dataSource.tripEntity.map(v => {
                          return (
                            <Picker.Item
                              style={styles.pickerItem}
                              label={v.tripToCounterEntity[0].title}
                              value={v.tripToCounterEntity[0].id}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                  </View>
                  <View style={styles.topBarWrapper}>
                    <View style={styles.topBarInfo}>
                      <TouchableOpacity
                        style={{}}
                        onPress={() => this.addTask(this.state.order_number)}
                      >
                        <Text style={styles.button}>Check In</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
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
    backgroundColor: "white"
  },
  topBarWrapper: {
    flexDirection: "row"
  },
  topBarInfo: {
    flex: 1,
    flexDirection: "column"
  },
  topBarInfoRow: {
    flexDirection: "row"
  },
  contentWrapper: {
    flexDirection: "row"
  },
  contentSectionLeft: {
    flex: 2,
    flexDirection: "row"
  },
  contentSectionMiddle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  contentSectionRight: {
    flex: 2,
    flexDirection: "row"
  },
  imageMiddle: {
    height: 45,
    width: 45,
    marginTop: 8
  },
  truckImage: {
    height: 45,
    width: 45,
    marginTop: 10,
    marginLeft: 10
  },
  truckImageRight: {
    height: 45,
    width: 45,
    alignSelf: "baseline",
    marginRight: 10,
    marginTop: 10
  },
  contentText: {
    marginTop: 5,
    textAlign: "left"
  },
  contentTextLower: {
    marginTop: 5,
    textAlign: "left"
  },
  contentTextLeft: {
    marginTop: 5,
    textAlign: "right"
  },
  contentTextLeftLower: {
    marginTop: 5,
    textAlign: "right"
  },
  contentColumn: {
    flex: 1,
    flexDirection: "column",
    marginTop: 5
  },
  styleCompleted: {
    backgroundColor: "green",
    padding: 4,
    color: "white",
    fontSize: 12,
    borderRadius: 4,
    marginBottom: 10
  },
  styleOngoing: {
    backgroundColor: "orange",
    padding: 4,
    color: "white",
    fontSize: 12,
    borderRadius: 4,
    marginBottom: 10
  },
  clockImage: {
    height: 20,
    width: 20,
    marginTop: 3,
    marginRight: 10
  },
  confirmImage: {
    height: 20,
    width: 20,
    marginTop: 3
  },
  time: {
    flex: 1,
    fontSize: 12,
    textAlign: "right",
    paddingRight: 7,
    marginTop: 4
  },
  contentColumnRight: {
    marginLeft: 35,
    flex: 1,
    flexDirection: "column",
    marginTop: 5
  },
  button: {
    marginTop: 30,
    backgroundColor: "steelblue",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 12,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    overflow: "hidden",
    padding: 12,
    textAlign: "center"
  }
};
