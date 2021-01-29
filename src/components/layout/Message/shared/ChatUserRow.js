import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectUser } from '../../../../features/userSlice';
import db from '../../../../firebase/firebase';
import moment from 'moment';

const S = {
  MessageRow: styled.div`
    height: 72px;
    padding: 8px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    :hover {
      background-color: ${({ hasUser }) => hasUser && 'rgba(0, 0, 0, 0.03)'};
      cursor: ${({ hasUser }) => hasUser && 'pointer'};
    }

    @media (max-width: 400px) {
      height: 55px;
    }
  `,

  RowLeft: styled.div`
    width: 56px;
  `,

  Circle: styled.div`
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background-color: #efefef;
    border: 1px solid lightgray;

    @media (max-width: 400px) {
      width: 40px;
      height: 40px;
    }
  `,

  Image: styled.img`
    width: 54px;
    height: 54px;
    border-radius: 50%;

    @media (max-width: 400px) {
      width: 40px;
      height: 40px;
    }
  `,

  RowRight: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 12px;
    padding: 8px 0px;
  `,

  RowBar: styled.div`
    height: 14px;
    background-color: ${({ hasUser }) => !hasUser && '#efefef'};
    border-radius: 3px;
    width: ${({ width }) => width}px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #8e8e8e;
  `,

  UserName: styled.span`
    color: #262626;
  `,

  LastMessage: styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  Timestamp: styled.span`
    white-space: nowrap;
  `,
};

function ChatUserRow({ userName, changeChatUser }) {
  const user = useSelector(selectUser);
  const [lastMessage, setLastMessage] = useState({});
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    db.collection('users')
      .doc(userName)
      .get()
      .then((res) => setPhotoURL(res.data()?.photoURL));

    db.collection('users')
      .doc(user?.displayName)
      .collection('DM')
      .doc(userName)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .onSnapshot((snapshot) => {
        setLastMessage(...snapshot.docs.map((doc) => ({ ...doc.data() })));
      });
    // eslint-disable-next-line
  }, [user]);

  return (
    <S.MessageRow
      hasUser={userName}
      onClick={() => {
        if (!changeChatUser) return;

        changeChatUser();
      }}
    >
      {/* {console.log(userName)}
      {console.log('lastMessage>>>', lastMessage)} */}
      {/* {console.log('user>>>', user)} */}
      <S.RowLeft>
        <S.Circle>
          {userName && (
            <S.Image
              src={photoURL ? photoURL : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'}
            />
          )}
        </S.Circle>
      </S.RowLeft>
      <S.RowRight>
        <S.RowBar hasUser={userName} width={116}>
          {userName && <S.UserName>{userName}</S.UserName>}
        </S.RowBar>
        <S.RowBar hasUser={userName} width={250}>
          {lastMessage && <S.LastMessage>{lastMessage.message}&nbsp;</S.LastMessage>}
          {lastMessage && Object.keys(lastMessage).length !== 0 && (
            <S.Timestamp>· {moment(new Date(lastMessage.timestamp?.toDate()).toUTCString()).fromNow()}</S.Timestamp>
          )}
        </S.RowBar>
      </S.RowRight>
    </S.MessageRow>
  );
}

export default ChatUserRow;
