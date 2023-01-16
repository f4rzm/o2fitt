import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';

const CommonText = ({ text, styleText, numberOfLines = 20 }) => {
  const lang = useSelector(state => state.lang);

  return (
    <Text
      style={[{ fontFamily: lang.font }, styleText]}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      allowFontScaling={false}
      >
      {text}
    </Text>
  );
};

export default CommonText;
