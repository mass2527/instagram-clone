import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import FaceIcon from '@material-ui/icons/Face';
import PublishIcon from '@material-ui/icons/Publish';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import db, { auth, storage } from '../firebase/firebase';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const S = {
  DropdownMenu: styled.div`
    width: 200px;
    top: 42px;
    position: absolute;
    right: -18px;
    background: white;
    border: 1px solid lightgray;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    border-radius: 3px;
    box-shadow: 1px 2px 5px lightgray;
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    transition: opacity 0.3s ease-in-out;
    pointer-events: ${(props) => !props.isOpen && 'none'};
  `,

  MenuItem: styled.strong`
    height: 21px;
    padding: 8px 16px;
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    color: #7f7f7f;

    > .MuiSvgIcon-root {
      margin: 0px 5px;
    }

    :hover {
      background-color: rgb(250, 250, 250);
      color: black;
    }
  `,

  UploadContainer: styled.div`
    height: 100%;
    display: grid;
    place-items: center;
    background-color: rgb(250, 250, 250);
  `,

  UploadForm: styled.form`
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 380px;
    justify-content: space-between;
  `,

  UploadInput: styled.input`
    height: 40px;
    border: 1px solid lightgray;
    padding-left: 16px;
    display: ${(props) => props.hide && 'none'};

    :focus {
      outline: none;
    }
  `,

  UploadTextarea: styled.textarea`
    flex: 1;
    border: 1px solid lightgray;
    padding: 16px;

    :focus {
      outline: none;
    }
  `,

  UploadLabel: styled.label`
    height: 40px;
    border: 1px solid lightgray;
    padding-left: 16px;
    background-color: white;
    display: grid;
    place-items: center;
  `,

  Loader: styled.img`
    height: 30px;
  `,
};

function DropdownMenu({ isOpen }) {
  const history = useHistory();
  const menuRef = useRef(null);
  const user = useSelector(selectUser);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function initializeInput() {
    setTitle('');
    setCaption('');
    setFile(null);
    setError('');
    setLoading(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
    initializeInput();
  };

  const handleClose = () => {
    setOpen(false);
  };

  function clickProfile() {
    history.push(`/${user.displayName}/`, {
      userName: user.displayName,
    });
  }

  function clickSignOut() {
    auth.signOut();
    history.replace('/login');
  }

  function fileChange(e) {
    if (!e.target.files[0]) return;
    setFile(e.target.files[0]);

    if (
      e.target.files[0].type !== 'image/jpeg' &&
      e.target.files[0].type !== 'image/jpg' &&
      e.target.files[0].type !== 'image/gif' &&
      e.target.files[0].type !== 'image/png'
    ) {
      setFile(null);
      return setError('jpeg(jpg), png and gif extensions only 😥');
    } else {
      setError('');
    }
  }

  function handleUpload(e) {
    e.preventDefault();
    setLoading(true);

    const uploadTask = storage.ref(`/images/${file.name}`).put(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        setError(error.message);
      },
      () => {
        storage
          .ref('images')
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('posts').add({
              userImageURL: user.userImageURL,
              displayName: user.displayName,
              title,
              imageURL: url,
              caption,
              userId: user.userId,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            initializeInput();
            handleClose();
          });
      }
    );
  }

  return (
    <S.DropdownMenu ref={menuRef} isOpen={isOpen}>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Upload Post
            </Typography>
            <Button
              onClick={handleUpload}
              disabled={!title.length || !caption.length || !file || loading}
              autoFocus
              color="inherit"
            >
              Upload
            </Button>
          </Toolbar>
        </AppBar>

        <S.UploadContainer>
          <S.UploadForm>
            <S.UploadInput
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              maxLength={30}
              placeholder="Title"
              type="text"
              accept="image/jpeg,
              image/jpg,
              image/png,
              image/gif"
            />

            <S.UploadTextarea
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
              maxLength={1000}
              placeholder="Caption"
              type="text"
            ></S.UploadTextarea>

            <S.UploadLabel htmlFor="file">
              {loading ? (
                <S.Loader
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.wpfaster.org%2Fwp-content%2Fuploads%2F2013%2F06%2Floading-gif.gif&f=1&nofb=1"
                  alt=""
                />
              ) : (
                <>Image Select</>
              )}
            </S.UploadLabel>
            <S.UploadInput id="file" hide onChange={fileChange} type="file" />
          </S.UploadForm>
          <div>{file?.name && <strong>{file?.name}</strong>}</div>
          <div>{error && <strong>{error}</strong>}</div>
        </S.UploadContainer>
      </Dialog>

      {user ? (
        <>
          <S.MenuItem onClick={clickProfile}>
            <FaceIcon />
            Profile
          </S.MenuItem>
          <S.MenuItem onClick={handleClickOpen}>
            <PublishIcon />
            Upload
          </S.MenuItem>
          <S.MenuItem onClick={clickSignOut}>
            <ExitToAppIcon />
            Log out
          </S.MenuItem>
        </>
      ) : (
        <S.MenuItem onClick={() => history.push('/login')}>
          <LockOpenIcon />
          Log in
        </S.MenuItem>
      )}
    </S.DropdownMenu>
  );
}

export default DropdownMenu;
