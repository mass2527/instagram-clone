import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userSlice';
import CreateIcon from '@material-ui/icons/Create';
import RefreshLoader from '../../shared/Loader/RefreshLoader';
import ChatUserRow from './shared/ChatUserRow';
import { useHistory, useParams } from 'react-router-dom';
import YourMessage from './shared/YourMessage';
import db from '../../../firebase/firebase';
import ChatContainer from './shared/ChatContainer';

const S = {
  MessageHome: styled.div`
    flex: 1;
    max-width: 975px;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    height: calc(100vh - 54px);

    @media (max-width: 935px) {
      justify-content: center;
      padding: 0px;
      min-height: calc(100vh - 54px);
      height: auto;
    }
  `,

  Box: styled.div`
    border: 1px solid lightgray;
    background-color: white;
    width: 100%;
    display: flex;

    @media (max-width: 935px) {
      flex-direction: column;
    }
  `,

  BoxLeft: styled.div`
    display: flex;
    flex-direction: column;
    width: 349px;
    border-right: 1px solid lightgray;

    @media (max-width: 935px) {
      width: 100%;
      border-bottom: 1px solid lightgray;
    }
  `,

  NameAndCreateNewMessageIcon: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0px 20px;
    border-bottom: 1px solid lightgray;
    box-sizing: border-box;
  `,

  Name: styled.span`
    color: #262626;
    font-size: 16px;
    font-weight: 500;
  `,

  CreateNewMessageIcon: styled.div`
    border-radius: 3px;
    display: flex;
    cursor: pointer;
    padding: 2px;

    > .MuiSvgIcon-root {
      color: #262626;
    }
  `,

  BoxRight: styled.div`
    flex: 1;
    display: grid;
    place-items: center;
  `,
};

function MessageHome() {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [chatUsers, setChatUsers] = useState([]);
  const { currentChatUserName } = useParams();

  useEffect(() => {
    if (!user) return;

    setLoading(false);

    db.collection('users')
      .doc(user.displayName)
      .collection('DM')
      .onSnapshot((snapshot) => {
        setChatUsers(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
          }))
        );
      });
  }, [user, currentChatUserName]);

  return (
    <>
      {loading && <RefreshLoader />}
      {console.log('chatUsers>>>', chatUsers)}
      <S.MessageHome>
        {/* {console.log('chatUsers>>>', chatUsers)}
        {console.log('user>>>', user)} */}

        <S.Box>
          <S.BoxLeft>
            <S.NameAndCreateNewMessageIcon>
              <S.Name>{user?.displayName}</S.Name>
              <S.CreateNewMessageIcon>
                <CreateIcon onClick={() => history.push('/direct/new/')} />
              </S.CreateNewMessageIcon>
            </S.NameAndCreateNewMessageIcon>

            {chatUsers.length === 0 ? (
              <>
                <ChatUserRow />
                <ChatUserRow />
                <ChatUserRow />
              </>
            ) : (
              chatUsers.map(({ userName }) => (
                <ChatUserRow
                  key={userName}
                  userName={userName}
                  changeChatUser={() => history.push(`/direct/t/${userName}`)}
                />
              ))
            )}
          </S.BoxLeft>

          <S.BoxRight>{currentChatUserName ? <ChatContainer chatUsers={chatUsers} /> : <YourMessage />}</S.BoxRight>
        </S.Box>
      </S.MessageHome>
    </>
  );
}

export default MessageHome;
