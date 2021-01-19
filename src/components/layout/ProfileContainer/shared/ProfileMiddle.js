import React from 'react';
import styled from 'styled-components';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AppsIcon from '@material-ui/icons/Apps';
import { useHistory, useLocation } from 'react-router-dom';

const S = {
  ProfileMiddle: styled.div`
    border-top: 2px solid #dbdbdb;
  `,

  ProfileMiddleOptionContainer: styled.div`
    display: flex;
    justify-content: center;
    height: 44px;

    @media (max-width: 735px) {
      border-bottom: 1px solid #dbdbdb;
    }
  `,

  ProfileMiddleOption: styled.span`
    cursor: pointer;
    margin: 0px 30px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
    width: 40px;
    color: #262626;
    box-sizing: border-box;

    @media (min-width: 735px) {
      border-top: 1px solid ${(props) => (props.borderTop ? '#262626' : 'transparent')};

      > .MuiSvgIcon-root {
        display: none;
      }
    }
  `,

  OptionName: styled.span`
    @media (max-width: 735px) {
      display: none;
    }
  `,
};

function ProfileMiddle() {
  const history = useHistory();
  const location = useLocation();

  return (
    <S.ProfileMiddle>
      <S.ProfileMiddleOptionContainer>
        <S.ProfileMiddleOption
          borderTop={location.pathname.split('/')[2] === ''}
          onClick={() => {
            history.push(`/${location.state.userName}/`, {
              userName: location.state.userName,
            });
          }}
        >
          <S.OptionName>POST</S.OptionName>
          <AppsIcon color={location.pathname.split('/')[2] === '' ? 'primary' : 'action'} />
        </S.ProfileMiddleOption>
        <S.ProfileMiddleOption
          borderTop={location.pathname.split('/')[2] === 'liked'}
          onClick={() => {
            history.push(`/${location.state.userName}/liked/`, {
              userName: location.state.userName,
              option: 'liked',
            });
          }}
        >
          <S.OptionName>LIKED</S.OptionName>
          <FavoriteBorderIcon color={location.pathname.split('/')[2] === 'liked' ? 'primary' : 'action'} />
        </S.ProfileMiddleOption>
      </S.ProfileMiddleOptionContainer>
    </S.ProfileMiddle>
  );
}

export default ProfileMiddle;
