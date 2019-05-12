import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, BackHandler } from 'react-native';
import BaseDrawerUi from './BaseDrawerUi';

export default class EditVehicle extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render () {

        const {navigate} = this.props.navigation;

        return (
            <BaseDrawerUi 
                topBarTitle="Dashboard" 
                navigation={this.props.navigation}>
            </BaseDrawerUi>
        );
    }
}

const styles = {
} 