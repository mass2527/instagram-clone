import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userSlice';
import CreateIcon from '@material-ui/icons/Create';
import RefreshLoader from '../../shared/Loader/RefreshLoader';
import MessageRow from './MessageRow';
import { useHistory } from 'react-router-dom';

const S = {
  Message: styled.div`
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
    }
  `,

  Box: styled.div`
    border: 1px solid lightgray;
    background-color: white;
    width: 100%;
    display: flex;
  `,

  BoxLeft: styled.div`
    display: flex;
    flex-direction: column;
    width: 349px;
    border-right: 1px solid lightgray;

    @media (max-width: 935px) {
      width: 299px;
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
    border: 1px solid lightgray;
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

  YourMessage: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  Logo: styled.img`
    width: 96px;
    height: 96px;
  `,

  Title: styled.h3`
    color: #262626;
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 10px;
  `,

  Description: styled.p`
    color: #8e8e8e;
    font-size: 14px;
  `,
};

function Message() {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (!user) return;

    setLoading(false);
  }, [user]);

  return (
    <>
      {loading && <RefreshLoader />}
      <S.Message>
        <S.Box>
          <S.BoxLeft>
            <S.NameAndCreateNewMessageIcon>
              <S.Name>{user?.displayName}</S.Name>
              <S.CreateNewMessageIcon>
                <CreateIcon onClick={() => history.push('/direct/new/')} />
              </S.CreateNewMessageIcon>
            </S.NameAndCreateNewMessageIcon>

            <MessageRow />
            <MessageRow />
            <MessageRow />
          </S.BoxLeft>
          <S.BoxRight>
            <S.YourMessage>
              <S.Logo src="https://static.thenounproject.com/png/2796195-200.png" alt="DM-logo" />
              <S.Title>Your messages</S.Title>
              <S.Description>Send private photos and messages to a friend or group.</S.Description>
            </S.YourMessage>
          </S.BoxRight>
        </S.Box>
      </S.Message>
    </>
  );
}

export default Message;
