import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';

const S = {
  Header: styled.div`
    height: 54px;
    border-bottom: 1px solid #dbdbdb;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    background-color: white;
    position: sticky;
    top: 0;
    z-index: 1;
  `,

  HeaderMiddle: styled.div`
    height: 54px;
    max-width: 975px;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  HeaderLogo: styled.img`
    margin-top: 6px;
    cursor: pointer;
  `,

  ProfileIconContainer: styled.div`
    position: relative;
    > .MuiSvgIcon-root {
      color: lightgray;
      cursor: pointer;
    }
  `,
};

function Header() {
  const history = useHistory();
  const [clickProfile, setClickProfile] = useState(false);
  const menuRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (!clickProfile) return;

    function handleClick(e) {
      if (
        menuRef?.current?.contains(e.target) ||
        e.target === iconRef.current ||
        e.target === document.querySelector('path')
      )
        return;
      setClickProfile(false);
    }

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [clickProfile]);

  return (
    <S.Header>
      <S.HeaderMiddle>
        <S.HeaderLogo
          onClick={() => history.push('/')}
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        <S.ProfileIconContainer>
          <AccountCircleIcon
            ref={iconRef}
            onClick={() => {
              setClickProfile((crr) => !crr);
            }}
            fontSize="large"
          />
          <DropdownMenu ref={menuRef} isOpen={clickProfile} />
        </S.ProfileIconContainer>
      </S.HeaderMiddle>
    </S.Header>
  );
}

export default Header;
