import React from 'react';
import styled from 'styled-components';

const S = {
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

function YourMessage() {
  return (
    <S.YourMessage>
      <S.Logo src="https://static.thenounproject.com/png/2796195-200.png" alt="DM-logo" />
      <S.Title>Your messages</S.Title>
      <S.Description>Send private photos and messages to a friend or group.</S.Description>
    </S.YourMessage>
  );
}

export default YourMessage;
