import React from 'react';
import {Text, StyleSheet} from 'react-native';

// CustomText component
const CustomText = ({style, weight = 'regular', children, ...props}) => {
  let textStyle;

  // Set font style based on `weight` prop
  switch (weight) {
    case 'bold':
      textStyle = styles.textBold;
      break;
    case 'italic':
      textStyle = styles.textItalic;
      break;
    case 'bold-italic':
      textStyle = styles.textBoldItalic;
      break;
    default:
      textStyle = styles.textRegular;
  }

  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textRegular: {
    fontFamily: 'Roboto-Regular', // Adjust to match the actual font family name
  },
  textBold: {
    fontFamily: 'Roboto-Bold',
  },
  textItalic: {
    fontFamily: 'Roboto-Italic',
  },
  textBoldItalic: {
    fontFamily: 'Roboto-BoldItalic',
  },
});

export default CustomText;
