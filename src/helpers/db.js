import {firebase} from '@react-native-firebase/database';

export const myDb = firebase
  .app()
  .database(
    'https://binar-chat-f9f5d-default-rtdb.asia-southeast1.firebasedatabase.app',
  );
