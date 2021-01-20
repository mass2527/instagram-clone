import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { selectUser } from '../../../../features/userSlice';
import db from '../../../../firebase/firebase';
import UserImageAndName from '../../../shared/UserImageAndName/UserImageAndName';
import firebase from 'firebase';

const S = {
  ChatConatiner: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,

  Header: styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0px 20px;
    border-bottom: 1px solid lightgray;
    box-sizing: border-box;
  `,

  Messages: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,

  Message: styled.div`
    padding: 16px;
    background-color: #efefef;
  `,

  Footer: styled.footer`
    height: 44px;
    padding: 20px;
  `,

  Form: styled.form`
    height: 100%;
    display: flex;
    box-sizing: border-box;
    border: 2px solid lightgray;
    border-radius: 20px;
    padding: 0px 9px;
  `,

  Input: styled.input`
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    border-radius: 20px;
    border-color: transparent;

    :focus {
      outline: none;
    }
  `,

  Button: styled.button`
    background-color: transparent;
    color: #0095f6;
    border: none;
    cursor: pointer;

    :focus {
      outline: none;
    }
  `,
};

function ChatContainer({ chatUsers }) {
  const user = useSelector(selectUser);
  const [chatUser, setChatUser] = useState({});
  const { currentChatUserName } = useParams();
  const history = useHistory();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setChatUser(chatUsers.find((user) => user.userName === currentChatUserName));

    if (!chatUser) history.replace('/direct/inbox');

    db.collection('users')
      .doc(user?.displayName)
      .collection('DM')
      .doc(chatUser?.userName)
      .collection('messages')
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
    // eslint-disable-next-line
  }, [chatUser]);

  function sendMessage(e) {
    e.preventDefault();

    db.collection('users').doc(user.displayName).collection('DM').doc(chatUser.userName).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userName: user.displayName,
      photoURL: user.userImageURL,
      message: text,
    });

    db.collection('users').doc(chatUser.userName).collection('DM').doc(user.displayName).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userName: user.displayName,
      photoURL: user.userImageURL,
      message: text,
    });

    setText('');
  }

  return (
    <S.ChatConatiner>
      {console.log('messages>>>', messages)}
      {console.log('chatUser>>>', chatUser)}
      <S.Header>
        <UserImageAndName
          photoURL={chatUser?.photoURL}
          displayName={chatUser?.userName}
          small={true}
          bold={true}
          noHoverOption={true}
        />
      </S.Header>
      {console.log('user>>>', user)}
      <S.Messages>
        {messages.map((message) => (
          <S.Message>{message.message}</S.Message>
        ))}
      </S.Messages>
      <S.Footer>
        <S.Form>
          <S.Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message..." />
          {text !== '' && <S.Button onClick={sendMessage}>Send</S.Button>}
        </S.Form>
      </S.Footer>
    </S.ChatConatiner>
  );
}

export default ChatContainer;
