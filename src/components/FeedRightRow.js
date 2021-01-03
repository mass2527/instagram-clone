import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const S = {
  FeedRightRow: styled.div`
    height: 32px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
  `,

  ProfileContainer: styled.div`
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
  `,

  ProfileImage: styled.img`
    width: 32px;
    height: 32px;
    border-radius: 100%;
    margin-right: 5px;
  `,

  ProfileName: styled.span`
    width: 170px;
    font-size: 14px;
    font-weight: 500;
  `,

  VisitButton: styled.button`
    width: 20px;
    color: #3aacf7;
    background-color: transparent;
    border: none;
    cursor: pointer;

    :focus {
      outline: none;
    }
  `,
};

function FeedRightRow({ photoURL, displayName }) {
  const history = useHistory();

  function clickVisitButton() {
    history.push(`/${displayName}/`, {
      userName: displayName,
      photoURL,
    });
  }

  return (
    <S.FeedRightRow>
      <S.ProfileContainer>
        <S.ProfileImage src={photoURL} alt="profile-image" />
      </S.ProfileContainer>
      <S.ProfileName>{displayName}</S.ProfileName>
      <S.VisitButton onClick={clickVisitButton}>Visit</S.VisitButton>
    </S.FeedRightRow>
  );
}

export default FeedRightRow;
