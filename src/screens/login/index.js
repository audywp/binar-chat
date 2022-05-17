import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
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
import {navigate} from '../../helpers/navigation';
import LoadingIndicator from '../../components/Loading';

import authProvider from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {setDataUser} from './redux/action';
import {myDb} from '../../helpers/db';
import messagingProvider from '@react-native-firebase/messaging';

const auth = authProvider();
const messaging = messagingProvider();

export default function Login() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(true);
  const [Loading, setLoading] = useState(false);

  const [userState, setUserState] = useState({
    email: '',
    password: '',
  });

  const LoginWithEmail = async () => {
    try {
      setLoading(true);
      const res = await auth.signInWithEmailAndPassword(
        userState.email,
        userState.password,
      );

      const token = await messaging.getToken();

      if (token) {
        let isUpdate = false;
        await myDb.ref(`users/${res.user.uid}`).update({
          notifToken: token,
        });
        isUpdate = true;

        if (isUpdate) {
          const results = await myDb.ref(`users/${res.user.uid}`).once('value');
          if (results.val()) {
            dispatch(setDataUser(results.val()));
            navigate('Home');
          }
        }
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Email or Password is wrong, please try again');
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert('Email is not valid');
      }
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
            source={ImageList.Login}
            style={style.image}
            resizeMode="contain"
          />
        </View>
        <View style={style.textInputContainer}>
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
        </View>
        <View>
          <Button
            title="Login"
            buttonStyle={{backgroundColor: Main.turquoise}}
            containerStyle={style.button}
            onPress={LoginWithEmail}
          />
          <View style={style.promptContainer}>
            <Text style={{color: Main.darkIndigo}}>
              Doesn't have account ?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigate('Register')}>
              <Text style={style.registerText}>Create Account</Text>
            </TouchableOpacity>
          </View>
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
  promptContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: Main.turquoise,
  },
});
