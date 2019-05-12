import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, BackHandler } from 'react-native';
import Drawer from 'react-native-drawer'
import MenuView from './MenuView';
import {StackActions} from 'react-navigation';

export default class BaseDrawerUi extends React.Component {

    constructor(props) {
        super(props);
        this.closeControlPanel = () => {
            this._drawer.close()
        }
        this.openControlPanel = () => {
            this._drawer.open()
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      }
    
      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      }
    
      handleBackPress = () => {
        if (this.props.navigation.state.routeName == 'Dashboard') {
            BackHandler.exitApp();
            return false;
        }
        const popAction = StackActions.pop({
            n: 1,
        });
        this.props.navigation.dispatch(popAction)
        return true;
      }

    

    // componentDidMount() {
    //     // this._drawer.open()
    // }

    render () {
        const {navigate} = this.props.navigation;
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="displace"
                content={<MenuView navigation={this.props.navigation} closeDrawer={this.closeControlPanel} />}
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                captureGestures={true}
                panOpenMask={0.1}
                negotiatePan = {true}
                closedDrawerOffset={-3}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 },
                    mainOverlay: { opacity: ratio/1.5, backgroundColor: 'black' }
                })}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ height: 32, backgroundColor: 'steelblue' }} />
                    <View style={ styles.topBar }>
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                resizeMode: 'contain',
                                paddingTop: 10,
                                paddingLeft: 15,
                                backgroundColor: 'steelblue',
                        }}>
                        <TouchableOpacity
                            onPress={() => {this._drawer.open()}} >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                resizeMode: 'contain',
                            }}
                            source={require('./assets/menu.png')} />
                        </TouchableOpacity>
                        </View>
                        <Text style={styles.menuTitle}>{this.props.topBarTitle}</Text>
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                marginLeft: 15,
                                marginTop: 10,
                                backgroundColor: 'steelblue',
                            }} />
                    </View>
                    {this.props.children}
                </View>
            </Drawer>
        );
    }
}

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {},
}

const styles = {
    menuTitle: {
        flex: 1, 
        height: 50,
        backgroundColor: 'steelblue',
        textAlign: 'center', 
        textAlignVertical: 'center', 
        fontSize: 25, 
        color: 'white',
        fontWeight: 'normal', 
    },
    topBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'steelblue',
    }
} 