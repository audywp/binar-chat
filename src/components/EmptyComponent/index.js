import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {ImageList} from '../../helpers/images';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {moderateScale} from 'react-native-size-matters';
import {Main} from '../../helpers/color';

export const EmptyComponent = ({search}) => {
  return (
    <View style={EmptyStyle.container}>
      <FastImage
        source={ImageList.Empty}
        resizeMode="contain"
        style={{width: widthPercentageToDP(100), height: moderateScale(160)}}
      />
      <Text style={EmptyStyle.text}>
        {search
          ? 'So quite here, invite your friends'
          : 'Opps, are you introvert ?'}
      </Text>
    </View>
  );
};

const EmptyStyle = StyleSheet.create({
  text: {
    color: Main.darkIndigo,
    fontSize: moderateScale(16),
  },
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
