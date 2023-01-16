import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions,UIManager } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { defaultTheme } from '../../constants/theme';

const { width } = Dimensions.get('screen')

const ChartPieAnimation = props => {


  //=====================VARIABLES============================
  const duration = 1000;

  // console.log({routeChart: route.params, s: nutrient[31]});

  const [chartCarbo, setChartCarbo] = useState(true);
  const [chartPro, setChartPro] = useState(true);
  const [chartFat, setChartFat] = useState(true);

  const percentageCarbohydrate = props.nutrient[31];
  const radiusCarbohydrate = 60;
  const strokeWidthCarbohydrate = 10;
  const colorCarbohydrate = defaultTheme.error;
  // maxCarbohydrate =
  //   parseFloat(profile.targetNutrient[31]) == 0
  //     ? 0
  //     : parseFloat(profile.targetNutrient[31]);
  const maxCarbohydrate = props.route.targetCarbo >= props.nutrient[31] ? props.route.targetCarbo : props.nutrient[31];

  const percentageProtein = props.nutrient[9];
  const radiusProtein = 40;
  const strokeWidthProtein = 10;
  const colorProtein = defaultTheme.green;
  // maxProtein =
  //   parseFloat(profile.targetNutrient[9]) == 0
  //     ? 0
  //     : parseFloat(profile.targetNutrient[9]);

  const maxProtein = props.route.targetProtein >= props.nutrient[9] ? props.route.targetProtein : props.nutrient[9];

  const percentageFat = props.nutrient[0];
  const radiusFat = 20;
  const strokeWidthFat = 10;
  const colorFat = defaultTheme.blue;
  // maxFat =
  //   parseFloat(profile.targetNutrient[0]) == 0
  //     ? 0
  //     : parseFloat(profile.targetNutrient[0]);

  const maxFat = props.route.targetFat >= props.nutrient[0] ? props.route.targetFat : props.nutrient[0];

  // console.log({maxCarbohydrate, maxProtein, maxFat});

  const animatedValueCarbohydrate = useRef(new Animated.Value(0)).current;
  const animatedValueProtein = useRef(new Animated.Value(0)).current;
  const animatedValueFat = useRef(new Animated.Value(0)).current;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const circleRefCarbohydrate = useRef();
  const circleRefProtein = useRef();
  const circleRefFat = useRef();

  const halfCircle = radiusCarbohydrate + strokeWidthCarbohydrate + 5;

  const circleCircumferenceCarbohydrate = 2 * Math.PI * radiusCarbohydrate;
  const circleCircumferenceProtein = 2 * Math.PI * radiusProtein;
  const circleCircumferenceFat = 2 * Math.PI * radiusFat;

  //=======================USE_EFFECT===================
  useEffect(() => {
    animationCarbohydrate(percentageCarbohydrate);
    animationProtein(percentageProtein);
    animationFat(percentageFat);

    // console.log({percentageCarbohydrate});

    animatedValueCarbohydrate.addListener(v => {
      if (circleRefCarbohydrate?.current && maxCarbohydrate) {
        setChartCarbo(true);
        const maxPercentage = (100 * v.value) / maxCarbohydrate;
        const strokeDashoffset =
          circleCircumferenceCarbohydrate -
          (maxPercentage * circleCircumferenceCarbohydrate) / 100;

        circleRefCarbohydrate.current.setNativeProps({
          strokeDashoffset,
        });
      } else {
        setChartCarbo(false);
      }
    });

    animatedValueProtein.addListener(v => {
      if (circleRefProtein?.current && maxProtein) {
        setChartPro(true);
        const maxPercentage = (100 * v.value) / maxProtein;
        const strokeDashoffset =
          circleCircumferenceProtein -
          (maxPercentage * circleCircumferenceProtein) / 100;

        circleRefProtein.current.setNativeProps({
          strokeDashoffset,
        });
      } else {
        setChartPro(false);
      }
    });

    animatedValueFat.addListener(v => {
      if (circleRefFat?.current && maxFat) {
        setChartFat(true);
        const maxPercentage = (100 * v.value) / maxFat;
        const strokeDashoffset =
          circleCircumferenceFat -
          (maxPercentage * circleCircumferenceFat) / 100;

        circleRefFat.current.setNativeProps({
          strokeDashoffset,
        });
      } else {
        setChartFat(false);
      }
    });
  });

  //===================FUNCTION======================
  const animationCarbohydrate = toValue => {
    return Animated.timing(animatedValueCarbohydrate, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const animationProtein = toValue => {
    return Animated.timing(animatedValueProtein, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const animationFat = toValue => {
    return Animated.timing(animatedValueFat, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  //===================RENDER========================
  return (
    <View style={styles.container}>
      <Svg
        width={'100%'}
        height={'100%'}
        viewBox={'0 0 150 150'}
        style={{ position: 'absolute' }}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={colorCarbohydrate}
            strokeWidth={10}
            r={radiusCarbohydrate}
            strokeOpacity={0.2}
            fill="transparent"
          />
          {chartCarbo && (
            <AnimatedCircle
              ref={circleRefCarbohydrate}
              cx="50%"
              cy="50%"
              stroke={colorCarbohydrate}
              strokeWidth={10}
              r={radiusCarbohydrate}
              fill="transparent"
              strokeDasharray={circleCircumferenceCarbohydrate}
              strokeDashoffset={circleCircumferenceCarbohydrate}
              strokeLinecap="round"
            />
          )}
        </G>
      </Svg>

      <Svg
        width={'100%'}
        height={'100%'}
        viewBox={'0 0 150 150'}
        style={{ position: 'absolute', zIndex: 2 }}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={colorProtein}
            strokeWidth={10}
            r={radiusProtein}
            strokeOpacity={0.2}
            fill="transparent"
          />
          {chartPro && (
            <AnimatedCircle
              ref={circleRefProtein}
              cx="50%"
              cy="50%"
              stroke={colorProtein}
              strokeWidth={10}
              r={radiusProtein}
              fill="transparent"
              strokeDasharray={circleCircumferenceProtein}
              strokeDashoffset={circleCircumferenceProtein}
              strokeLinecap="round"
            />
          )}
        </G>
      </Svg>

      <Svg
        width={'100%'}
        height={'100%'}
        viewBox={'0 0 150 150'}
        style={{ position: 'absolute', zIndex: 2 }}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={colorFat}
            strokeWidth={10}
            r={radiusFat}
            strokeOpacity={0.2}
            fill="transparent"
          />
          {chartFat && (
            <AnimatedCircle
              ref={circleRefFat}
              cx="50%"
              cy="50%"
              stroke={colorFat}
              strokeWidth={10}
              r={radiusFat}
              fill="transparent"
              strokeDasharray={circleCircumferenceFat}
              strokeDashoffset={circleCircumferenceFat}
              strokeLinecap="round"
            />
          )}
        </G>
      </Svg>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: width * .4,
    height: width * .4,
    marginHorizontal: 20,
    marginVertical: 20,
  }
})

export default ChartPieAnimation;
