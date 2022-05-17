import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import Screens from '../../screens';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

export default function MainStack() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  const onAuthStateChanged = useCallback(
    userData => {
      setUser(userData);
      if (initializing) {
        setInitializing(false);
      }
    },
    [initializing],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  if (initializing) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={user ? 'Home' : 'Login'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Screens.Login} />
      <Stack.Screen name="Register" component={Screens.Register} />
      <Stack.Screen name="Profile" component={Screens.Profile} />
      <Stack.Screen name="Home" component={Screens.Home} />
      <Stack.Screen name="Search" component={Screens.Search} />
      <Stack.Screen name="ChatRoom" component={Screens.ChatRoom} />
    </Stack.Navigator>
  );
}
