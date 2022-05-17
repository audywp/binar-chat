import {View, StatusBar, StyleSheet, Text} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Main} from '../../helpers/color';
import {Avatar, FAB} from '@rneui/base';

import {GlobalStyle} from '../../helpers/globalStyle';
import {HeaderComponent} from '../../components/Header';
import {EmptyComponent} from '../../components/EmptyComponent';
import {myDb} from '../../helpers/db';
import LoadingIndicator from '../../components/Loading';
import {moderateScale} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP} from 'react-native-responsive-screen';

export default function Search() {
  const [Loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getAllData = useCallback(async () => {
    try {
      const res = await myDb.ref('/users').once('value');
      console.log(Object.values(res.val()));
      setData(Object.values(res.val()));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  const CardComponent = ({name, email, photo}) => {
    return (
      <TouchableOpacity activeOpacity={0.7} style={style.container}>
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
            <Text>{name}</Text>
            <Text>{email}</Text>
          </View>
        </View>
        <View>
          <Ionicons
            name="add-circle-outline"
            size={moderateScale(32)}
            color={Main.turquoise}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const RenderItem = ({item, index}) => {
    const {displayName, email, photoURL} = item;
    return <CardComponent name={displayName} email={email} photo={photoURL} />;
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
});
