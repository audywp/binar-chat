import {View, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {GlobalStyle} from '../../helpers/globalStyle';
import FastImage from 'react-native-fast-image';
import {ImageList} from '../../helpers/images';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {moderateScale} from 'react-native-size-matters';
import {Button, Input} from '@rneui/base';
import Feather from 'react-native-vector-icons/Feather';
import {Main} from '../../helpers/color';

// firebase
import authProvider from '@react-native-firebase/auth';
import LoadingIndicator from '../../components/Loading';
import messagingProvider from '@react-native-firebase/messaging';

import {myDb} from '../../helpers/db';
import {navigate} from '../../helpers/navigation';
import {useDispatch} from 'react-redux';
import {setDataUser} from '../login/redux/action';

const auth = authProvider();
const messaging = messagingProvider();

export default function Register() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [Disable, setDisable] = useState(false);

  // userState
  const [userState, setUserState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateButoon = useCallback(() => {
    const {password, confirmPassword} = userState;
    if (password === confirmPassword && password && confirmPassword) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [userState]);

  const createUserByEmail = async () => {
    try {
      setLoading(true);
      const res = await auth.createUserWithEmailAndPassword(
        userState.email,
        userState.password,
      );
      console.log(res);
      if ('email' in res.user && res.user.email) {
        await auth.currentUser.updateProfile({
          displayName: userState.name,
        });
        const token = await messaging.getToken();

        if (token) {
          const payload = {
            displayName: userState.name,
            email: res.user.email,
            phoneNumber: res.user.phoneNumber,
            photoURL: res.user.photoURL,
            contact: [],
            roomChat: [],
            _id: res.user.uid,
            notifToken: token,
          };
          await myDb.ref(`users/${res.user.uid}`).set(payload);
          dispatch(setDataUser(payload));
          navigate('Home');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserState = (field, value) => {
    setUserState(prevState => {
      prevState[field] = value;
      return {
        ...prevState,
      };
    });
  };

  useEffect(() => {
    validateButoon();
  }, [validateButoon]);

  if (Loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView flex={1}>
      <ScrollView
        contentContainerStyle={[
          GlobalStyle.scrollview,
          {
            paddingHorizontal: widthPercentageToDP(4),
            marginBottom: heightPercentageToDP(2),
          },
        ]}>
        <View style={style.imageContainer}>
          <FastImage
            source={ImageList.Register}
            style={style.image}
            resizeMode="contain"
          />
        </View>
        <View style={style.textInputContainer}>
          <Input
            placeholder="Name"
            onChangeText={text => handleUserState('name', text)}
            rightIcon={{type: 'feather', name: 'user'}}
          />
          <Input
            placeholder="Email"
            onChangeText={text => handleUserState('email', text)}
            rightIcon={{type: 'feather', name: 'mail'}}
          />

          <Input
            placeholder="Password"
            secureTextEntry={showPassword}
            onChangeText={text => handleUserState('password', text)}
            rightIcon={() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(val => !val);
                  }}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={moderateScale(24)}
                  />
                </TouchableOpacity>
              );
            }}
          />
          <Input
            placeholder="Confirm Password"
            secureTextEntry={showConfirmPassword}
            onChangeText={text => handleUserState('confirmPassword', text)}
            rightIcon={() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmPassword(val => !val);
                  }}>
                  <Feather
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={moderateScale(24)}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View>
          <Button
            disabled={Disable}
            title="Register"
            buttonStyle={{backgroundColor: Main.turquoise}}
            containerStyle={style.button}
            onPress={createUserByEmail}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  imageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: widthPercentageToDP(100),
    height: moderateScale(350),
  },
  textInputContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    marginHorizontal: 50,
    marginVertical: 10,
  },
});
