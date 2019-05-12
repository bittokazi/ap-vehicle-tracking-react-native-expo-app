import React from 'react';
import { Animated, Text, View } from 'react-native';

export default class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(1),  // Initial value for opacity: 0
    visible: true,
    x: new Animated.Value(0),
    bounceValue: new Animated.Value(100),
  }

  slide = () => {
    // Animated.spring(this.state.x, {
    //   toValue: 0,
    //   friction: 2,
    //   tension: 1,
    // }).start();
    // this.setState({
    //   visible: true,
    // });
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: 0,
        velocity: 0.1,
        tension: 1,
        friction: 2,
      }
    ).start();
  };

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 1000,              // Make it take a while
      }
    ).start();                        // Starts the animation
    this.slide();
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
          transform: [{translateY: this.state.bounceValue}],
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}