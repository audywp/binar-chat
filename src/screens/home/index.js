import {View, StatusBar, StyleSheet, Text} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Main} from '../../helpers/color';
import {Avatar} from '@rneui/base';

import {GlobalStyle} from '../../helpers/globalStyle';
import {HeaderComponent} from '../../components/Header';
import {EmptyComponent} from '../../components/EmptyComponent';
import {myDb} from '../../helpers/db';
import LoadingIndicator from '../../components/Loading';
import {moderateScale} from 'react-native-size-matters';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {setChoosenUser} from './redux/action';
import {navigate} from '../../helpers/navigation';

export default function Search() {
  const dispatch = useDispatch();
  const {_user = {email: ''}} = useSelector(state => state.user);
  const [Loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const saveSelectedPerson = payload => {
    dispatch(setChoosenUser(payload));
    navigate('ChatRoom');
  };

  const getAllData = useCallback(async () => {
    try {
      const res = await myDb.ref('/users').once('value');
      const userList = Object.values(res.val()).filter(
        val => val.email !== _user.email,
      );
      setData(userList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [_user.email]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  const CardComponent = props => {
    const {name, email, photo} = props;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={style.container}
        onPress={() => saveSelectedPerson(props)}>
        <View style={style.avatarContainer}>
          <View>
            <Avatar
              size={56}
              rounded
              source={{
                uri: photo ?? 'https://randomuser.me/api/portraits/men/36.jpg',
              }}
            />
          </View>
          <View style={style.desc}>
            <Text style={style.text}>{name}</Text>
            <Text style={style.text}>{email}</Text>
          </View>
        </View>
        <View>
          <EvilIcons
            name="envelope"
            size={moderateScale(32)}
            color={Main.turquoise}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const RenderItem = ({item = {displayName: '', email: '', photoURL: ''}}) => {
    const {displayName, email, photoURL} = item;
    return (
      <CardComponent
        name={displayName}
        email={email}
        photo={photoURL}
        {...item}
      />
    );
  };

  if (Loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={GlobalStyle.scrollview}>
      <StatusBar hidden />
      <FlatList
        data={data}
        keyExtractor={item => item._id}
        renderItem={RenderItem}
        ListEmptyComponent={() => {
          return <EmptyComponent search />;
        }}
        ListHeaderComponent={() => {
          return <HeaderComponent />;
        }}
        contentContainerStyle={[GlobalStyle.scrollview]}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    paddingHorizontal: widthPercentageToDP(4),
    marginBottom: moderateScale(32),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  desc: {
    marginLeft: moderateScale(20),
  },
  text: {
    color: Main.darkIndigo,
  },
});
