import React, { useEffect, useRef, useState } from 'react';
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
    max-height: 90vh;
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
    padding: 20px 20px 0px 20px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
      width: 5px;
      background-color: transparent;
    }

    ::-webkit-scrollbar-track {
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: rgb(240, 240, 240);
    }
  `,

  MessageRow: styled.div`
    display: flex;
    justify-content: ${({ isMyMessage }) => (isMyMessage ? 'flex-end' : 'flex-start')};
    margin-bottom: 10px;
  `,

  ImageDiv: styled.div`
    width: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-right: 10px;
    padding-bottom: 7px;
  `,

  Image: styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid lightgray;
  `,

  MessageDiv: styled.div`
    background-color: ${({ isMyMessage }) => isMyMessage && '#efefef'};
    padding: 16px;
    border-radius: 30px;
    display: flex;
    border: ${({ isMyMessage }) => !isMyMessage && '1px solid lightgray'};
    max-width: 50%;
  `,

  MessageSpan: styled.span`
    color: #262626;
    font-size: 14px;
    line-height: 18px;
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
  const messagesRef = useRef(null);

  useEffect(() => {
    setChatUser(chatUsers.find((user) => user.userName === currentChatUserName));

    if (!chatUser) history.replace('/direct/inbox');
    console.log('useeffect 동작');

    db.collection('users')
      .doc(user?.displayName)
      .collection('DM')
      .doc(currentChatUserName)
      .collection('messages')
      .orderBy('timestamp', 'desc')

      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.reverse().map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

    // eslint-disable-next-line
  }, [chatUser, currentChatUserName]);

  useEffect(() => {
    messagesRef.current.lastElementChild?.scrollIntoView();
  }, [messagesRef.current?.lastElementChild]);

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
      {/* {console.log(messages)} */}
      {/* {console.log('messages>>>', messages)} */}
      {/* {console.log('chatUser>>>', chatUser)} */}
      <S.Header>
        <UserImageAndName
          photoURL={chatUser?.photoURL}
          displayName={chatUser?.userName}
          small={true}
          bold={true}
          noHoverOption={true}
        />
      </S.Header>

      {/* {console.log('user>>>', user)} */}
      {/* {console.log('chatUser>>>', chatUser)} */}
      {/* {console.log('messages>>>', messages)} */}
      <S.Messages ref={messagesRef}>
        {messages.map(({ id, message, userName, photoURL }, index) => (
          <S.MessageRow key={id} isMyMessage={userName === user.displayName}>
            {userName !== user.displayName && messages[index].userName !== messages[index + 1]?.userName ? (
              <S.ImageDiv>
                <S.Image
                  src={
                    photoURL ? photoURL : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'
                  }
                  alt={userName}
                />
              </S.ImageDiv>
            ) : (
              <S.ImageDiv></S.ImageDiv>
            )}

            <S.MessageDiv isMyMessage={userName === user.displayName}>
              <S.MessageSpan>{message}</S.MessageSpan>
            </S.MessageDiv>
          </S.MessageRow>
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
