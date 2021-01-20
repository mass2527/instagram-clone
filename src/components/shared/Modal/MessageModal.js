import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';

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
    color: #cdeafd;
    border: none;
    font-weight: bold;
    background-color: transparent;
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
    padding: 4px 16px;
    box-sizing: border-box;
    margin-left: 16px;
    border: none;

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
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const history = useHistory();

  useEffect(() => {
    setOpen(true);

    // eslint-disable-next-line
  }, []);

  const handleClose = () => {
    history.goBack();
  };

  const handleChange = () => {};

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
              <S.Button>Next</S.Button>
            </S.Header>
            <S.To>
              <S.Title>To:</S.Title>
              <S.Input value={name} onChange={handleChange} placeholder="Search..." />
            </S.To>
            <S.UserList>No account found.</S.UserList>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
