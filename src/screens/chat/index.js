import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import {Main} from '../../helpers/color';
import {myDb} from '../../helpers/db';
import axios from 'axios';
import {fcmUrl, FIREBASE_API_KEY} from '../../helpers/apiUrl';

function ChatRoom() {
  const {_user, selectedUser} = useSelector(state => state.user);
  const [user, setUser] = useState({});

  const createIntialData = useCallback(() => {
    try {
      myDb.ref(`users/${selectedUser._id}`).on('value', res => {
        const userData = res.val();
        if (userData.chatRoom) {
          setUser(userData);
        } else {
          setUser(prevState => {
            return {...prevState, ...userData, chatRoom: []};
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [selectedUser._id]);

  useEffect(() => {
    createIntialData();
  }, [createIntialData]);

  const onSend = useCallback(
    async (sendedMessage = []) => {
      let isUpdating = true;
      await myDb.ref(`users/${_user._id}`).update({
        chatRoom: [
          ...user.chatRoom,
          {
            ...sendedMessage[0],
            idx: user.chatRoom?.length + 1,
          },
        ],
      });

      await myDb.ref(`users/${selectedUser._id}`).update({
        chatRoom: [
          ...user.chatRoom,
          {
            ...sendedMessage[0],
            idx: user.chatRoom.length + 1,
          },
        ],
      });

      isUpdating = false;
      if (!isUpdating) {
        const body = {
          to: selectedUser.notifToken,
          notification: {
            body: sendedMessage[0].text,
            title: `New Messages from ${_user.displayName}`,
          },
          data: {
            body: sendedMessage[0].text,
            title: `New Messages from ${_user.displayName}`,
          },
        };
        await axios.post(fcmUrl, body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'key=' + FIREBASE_API_KEY,
          },
        });
      }
    },
    [
      user.chatRoom,
      _user._id,
      selectedUser._id,
      _user.displayName,
      selectedUser.notifToken,
    ],
  );

  return (
    <GiftedChat
      messages={user?.chatRoom?.reverse()}
      onSend={sendedMessage => {
        onSend(sendedMessage);
      }}
      optionTintColor="red"
      user={{
        _id: _user._id,
        name: _user.displayName,
        avatar:
          user.photoUrl ?? 'https://randomuser.me/api/portraits/men/36.jpg',
      }}
      messagesContainerStyle={{backgroundColor: Main.darkIndigo}}
    />
  );
}

export default ChatRoom;
