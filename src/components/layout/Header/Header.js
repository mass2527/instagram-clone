import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import DropdownMenu from './shared/DropdownMenu';
import db from '../../../firebase/firebase';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import SearchResult from './shared/SearchResult';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userSlice';
import HomeIcon from '@material-ui/icons/Home';
import SendIcon from '@material-ui/icons/Send';
import { auth } from '../../../firebase/firebase';

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

  Center: styled.div`
    height: 54px;
    max-width: 975px;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  Logo: styled.img`
    margin-top: 6px;
    cursor: pointer;
  `,

  Icons: styled.div`
    display: flex;
    align-items: center;
    position: relative;
  `,

  HomeIconContainer: styled.div`
    > .MuiSvgIcon-root {
      cursor: pointer;
      font-size: 22px;
      margin-right: 10px;
      color: ${({ isHome }) => (isHome ? 'black' : 'lightgray')};
    }
  `,

  SendIconContainer: styled.div`
    > .MuiSvgIcon-root {
      cursor: pointer;
      font-size: 22px;
      margin-right: 10px;
      color: ${({ isDM }) => (isDM ? 'black' : 'lightgray')};
    }
  `,

  ProfileImage: styled.img`
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid lightgray;
    box-sizing: border-box;
    cursor: pointer;
  `,

  Form: styled.form`
    display: flex;
    width: 211px;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    position: relative;
    border: 1px solid lightgray;
    border-radius: 3px;

    > .MuiSvgIcon-root {
      color: lightgray;
      position: absolute;
      left: 60px;
      left: ${({ isTyped }) => (isTyped ? '190' : '60')}px;
    }

    @media (max-width: 500px) {
      width: 150px;

      > .MuiSvgIcon-root {
        display: none;
      }
    }

    @media (max-width: 450px) {
      width: 125px;
    }

    @media (max-width: 400px) {
      width: 100px;
    }
  `,

  Input: styled.input`
    padding: 5px 10px;
    width: 100%;
    border: none;
    color: #111111;
    background-color: transparent;
    text-align: center;

    :focus {
      outline: none;
    }
  `,
};

function Header() {
  const user = useSelector(selectUser);
  const [clickProfile, setClickProfile] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [userList, setUserList] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const history = useHistory();
  const menuRef = useRef(null);
  const iconRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!clickProfile) return;

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [clickProfile]);

  function handleClick(e) {
    if (
      menuRef?.current?.contains(e.target) ||
      e.target === iconRef.current ||
      e.target === document.querySelector('path')
    )
      return;
    setClickProfile(false);
  }

  function handleChange(e) {
    setSearchName(e.target.value);
    setShowResults(true);

    db.collection('users').onSnapshot((snapshot) => {
      const users = snapshot.docs.filter(
        (doc) => doc.data().displayName.toLowerCase().includes(e.target.value) === true
      );
      setUserList(users.map((user) => user.data()));
    });
  }

  function clickSearchIcon() {
    inputRef.current.focus();
  }

  function clickCloseIcon() {
    setSearchName('');
  }

  function clickForm() {
    if (searchName === '' || showResults) return;
    setShowResults(true);
  }

  return (
    <S.Header>
      <S.Center>
        <S.Logo
          onClick={() => history.push('/')}
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram"
        />

        <S.Form onClick={clickForm} isTyped={searchName !== ''}>
          {searchName === '' && <SearchIcon onClick={clickSearchIcon} fontSize="small" />}
          <S.Input ref={inputRef} value={searchName} onChange={handleChange} type="text" placeholder="Search" />
          {searchName !== '' && showResults && (
            <SearchResult clearInput={() => setSearchName('')} userList={userList} />
          )}
          {searchName !== '' && <CloseIcon onClick={clickCloseIcon} fontSize="small" />}
        </S.Form>

        <S.Icons>
          <S.HomeIconContainer isHome={location.pathname === '/'}>
            <HomeIcon onClick={() => history.push('/')} />
          </S.HomeIconContainer>
          <S.SendIconContainer isDM={location.pathname.includes('direct')}>
            <SendIcon
              onClick={() => {
                if (!auth.currentUser) {
                  return history.push('/login');
                }
                history.push('/direct/inbox/');
              }}
            />
          </S.SendIconContainer>

          <S.ProfileImage
            src={
              user?.userImageURL
                ? user.userImageURL
                : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'
            }
            alt="login-user-profile-image"
            ref={iconRef}
            onClick={() => {
              setClickProfile((crr) => !crr);
            }}
          />

          <DropdownMenu ref={menuRef} isOpen={clickProfile} />
        </S.Icons>
      </S.Center>
    </S.Header>
  );
}

export default Header;
