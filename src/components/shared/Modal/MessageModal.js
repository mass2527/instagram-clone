import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import db from '../../../firebase/firebase';
import UserImageAndName from '../UserImageAndName/UserImageAndName';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userSlice';

const S = {
  Header: styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    padding: 0px 16px;
    border-bottom: 1px solid lightgray;
    box-sizing: border-box;

    > .MuiSvgIcon-root {
      cursor: pointer;
    }
  `,
  Title: styled.h4`
    color: #262626;
    font-weight: 500;
  `,

  Button: styled.button`
    border: none;
    font-weight: bold;
    background-color: transparent;
    color: ${({ disabled }) => (disabled ? '#cdeafd' : '#52c1fb')};
    cursor: ${({ disabled }) => !disabled && 'pointer'};

    :focus {
      outline: none;
    }
  `,

  To: styled.div`
    display: flex;
    align-items: center;
    height: 55px;
    padding: 0px 16px;
    box-sizing: border-box;
    border-bottom: 1px solid lightgray;
  `,

  Input: styled.input`
    height: 38px;
    width: 100%;
    padding: 4px 0px;
    box-sizing: border-box;
    margin-left: 16px;
    border: none;

    :disabled {
      background-color: transparent;
    }

    ::placeholder {
      color: #c7c7c7;
    }

    :focus {
      outline: none;
    }
  `,

  UserList: styled.div`
    min-height: 200px;
    max-height: 380px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
  `,

  NoUser: styled.span`
    color: #8e8e8e;
    font-size: 14px;
    padding: 16px;
  `,

  SelectedUserContainer: styled.div`
    color: #0095f6;
    background-color: #e0f1ff;
    padding: 6px 12px;
    border-radius: 5px;
    margin-left: 10px;
    display: flex;

    > .MuiSvgIcon-root {
      margin-left: 3px;

      cursor: pointer;
    }
  `,

  SelectedUser: styled.span`
    font-size: 14px;
  `,
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '400px',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: '10px',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
}));

export default function MessageModal() {
  const user = useSelector(selectUser);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [userList, setUserList] = useState([]);
  const history = useHistory();
  const inputRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserPhotoURL, setSelectedUserPhotoURL] = useState('');

  useEffect(() => {
    setOpen(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    // eslint-disable-next-line
  }, []);

  const handleClose = () => {
    history.goBack();
    setOpen(false);
  };

  const handleChange = (e) => {
    setName(e.target.value);

    setTimeout(() => {
      if (e.target.value === '') return setUserList([]);

      db.collection('users').onSnapshot((snapshot) => {
        const users = snapshot.docs.filter(
          (doc) => doc.data().displayName.toLowerCase().includes(e.target.value) === true
        );
        const usersExceptMe = users.filter(
          (eachUser) => eachUser.data().displayName.toLowerCase() !== user.displayName.toLowerCase()
        );
        setUserList(usersExceptMe.map((user) => user.data()));
      });
    }, 100);
  };

  function selectClickedUser(displayName, photoURL) {
    setSelectedUser(displayName);
    setSelectedUserPhotoURL(photoURL);
    setName('');
    setUserList([]);
  }

  function clickCloseButton() {
    setSelectedUser('');
    setSelectedUserPhotoURL('');
  }

  function clickNextButton() {
    db.collection('users').doc(user.displayName).collection('DM').doc(selectedUser).set({
      userName: selectedUser,
      photoURL: selectedUserPhotoURL,
    });

    db.collection('users').doc(selectedUser).collection('DM').doc(user.displayName).set({
      userName: user.displayName,
      photoURL: user.userImageURL,
    });

    history.push(`/direct/t/${selectedUser}`);
  }

  return (
    <div>
      <Modal
        disableEnforceFocus={true}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <S.Header>
              <CloseIcon onClick={handleClose} />
              <S.Title id="transition-modal-title">New Message</S.Title>
              <S.Button onClick={clickNextButton} disabled={!selectedUser}>
                Next
              </S.Button>
            </S.Header>
            <S.To>
              <S.Title>To:</S.Title>
              {selectedUser && (
                <S.SelectedUserContainer>
                  <S.SelectedUser>{selectedUser}</S.SelectedUser>
                  <CloseIcon onClick={clickCloseButton} fontSize="small" />
                </S.SelectedUserContainer>
              )}
              <S.Input
                disabled={selectedUser}
                ref={inputRef}
                value={name}
                onChange={handleChange}
                placeholder="Search..."
              />
            </S.To>
            <S.UserList>
              {userList.length === 0 && <S.NoUser>No account found.</S.NoUser>}
              {userList.map(({ uid, photoURL, displayName }) => (
                <UserImageAndName
                  photoURL={photoURL}
                  displayName={displayName}
                  onClick={() => selectClickedUser(displayName, photoURL)}
                  key={uid}
                />
              ))}
            </S.UserList>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
