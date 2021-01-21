import React from 'react';
import styled from 'styled-components';

const S = {
  UserImageAndName: styled.div`
    padding: 8px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    cursor: pointer;

    :hover {
      background-color: ${({ noHoverOption }) => (noHoverOption ? 'transparent' : 'rgba(0, 0, 0, 0.03)')};
    }
  `,

  UserImage: styled.img`
    width: ${({ small }) => (small ? '24' : '44')}px;
    height: ${({ small }) => (small ? '24' : '44')}px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid lightgray;
  `,

  Name: styled.span`
    font-size: 14px;
    color: #262626;
    margin-left: 10px;
    font-weight: ${({ bold }) => (bold ? '700' : '500')};
  `,
};

function UserImageAndName({ photoURL, displayName, onClick, changeChatUser, small, bold, noHoverOption }) {
  return (
    <S.UserImageAndName
      noHoverOption={noHoverOption}
      onClick={() => {
        if (onClick) {
          onClick();
        }
        if (changeChatUser) {
          changeChatUser();
        }
      }}
    >
      <S.UserImage
        small={small}
        src={photoURL ? photoURL : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'}
        alt={displayName}
      />
      <S.Name bold={bold}>{displayName}</S.Name>
    </S.UserImageAndName>
  );
}

export default UserImageAndName;
