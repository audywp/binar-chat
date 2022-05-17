import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Avatar} from '@rneui/base';
import Feather from 'react-native-vector-icons/Feather';
import {moderateScale} from 'react-native-size-matters';
import {Main} from '../../helpers/color';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {logOut} from '../../screens/login/redux/action';
import {navigate} from '../../helpers/navigation';

export const HeaderComponent = ({callback = () => {}}) => {
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      await auth().signOut();
      navigate('Login');
      dispatch(logOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={headerStyle.headerContainer}>
      <View style={headerStyle.headerContent}>
        <Feather name="search" color={Main.text} size={moderateScale(24)} />
        <Text style={headerStyle.headerTitle}>Binar Messages</Text>
        <TouchableOpacity onPress={logout}>
          <Avatar
            size={48}
            rounded
            source={{uri: 'https://randomuser.me/api/portraits/men/36.jpg'}}
          />
        </TouchableOpacity>
      </View>
      <View style={headerStyle.body} />
    </View>
  );
};

const headerStyle = StyleSheet.create({
  headerContainer: {
    height: moderateScale(120),
    backgroundColor: Main.darkIndigo,
    marginBottom: moderateScale(16),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: moderateScale(16),
    paddingHorizontal: widthPercentageToDP(4),
  },
  headerTitle: {
    color: Main.text,
    fontSize: moderateScale(20),
  },
  body: {
    backgroundColor: 'white',
    height: moderateScale(120),
    marginTop: moderateScale(32),
    borderTopRightRadius: moderateScale(24),
    borderTopLeftRadius: moderateScale(24),
  },
});
