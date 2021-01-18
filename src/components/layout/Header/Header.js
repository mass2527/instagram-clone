import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import DropdownMenu from './shared/DropdownMenu';
import db, { auth } from '../../../firebase/firebase';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchResult from './shared/SearchResult';

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
  `,

  ProfileImage: styled.img`
    width: 22px;
    height: 22px;
    border-radius: 100%;
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
  const [clickProfile, setClickProfile] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [userList, setUserList] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const history = useHistory();
  const menuRef = useRef(null);
  const iconRef = useRef(null);
  const inputRef = useRef(null);

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
      const users = snapshot.docs.filter((doc) => doc.data().displayName.includes(e.target.value) === true);
      setUserList(users.map((user) => user.data()));
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
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
      <S.HeaderMiddle>
        <S.HeaderLogo
          onClick={() => history.push('/')}
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram"
        />

        <S.Form onClick={clickForm} isTyped={searchName !== ''} onSubmit={handleSubmit}>
          {searchName === '' && <SearchIcon onClick={clickSearchIcon} fontSize="small" />}
          <S.Input ref={inputRef} value={searchName} onChange={handleChange} type="text" placeholder="Search" />
          {searchName !== '' && showResults && <SearchResult userList={userList} />}
          {searchName !== '' && <CancelIcon onClick={clickCloseIcon} fontSize="small" />}
        </S.Form>

        <S.ProfileIconContainer>
          <S.ProfileImage
            src={
              auth.currentUser?.photoURL
                ? auth.currentUser.photoURL
                : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'
            }
            alt="login-user-profile-image"
            ref={iconRef}
            onClick={() => {
              setClickProfile((crr) => !crr);
            }}
          />

          <DropdownMenu ref={menuRef} isOpen={clickProfile} />
        </S.ProfileIconContainer>
      </S.HeaderMiddle>
    </S.Header>
  );
}

export default Header;
