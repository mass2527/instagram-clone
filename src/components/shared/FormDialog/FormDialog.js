import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userSlice';
import db from '../../../firebase/firebase';

export default function FormDialog() {
  const user = useSelector(selectUser);
  const [open, setOpen] = React.useState(false);

  const [text, setText] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setText('');
  };

  const clickEdit = () => {
    console.log(text);

    // update firebase bio

    db.collection('users')
      .doc(user.displayName)
      .update({
        bio: text,
      })
      .then(() => {
        handleClose();
        window.location.reload();
      });
  };

  return (
    <div>
      <Button variant="outlined" size="small" color="inherit" onClick={handleClickOpen}>
        Edit Profile
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hello {user.displayName}, Write about yourself so that everyone can know who you are{' '}
          </DialogContentText>
          <TextField
            value={text}
            onChange={(e) => {
              if (text.length <= 100) {
                setText(e.target.value);
              }
            }}
            autoFocus
            margin="dense"
            id="name"
            label="Bio"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button disabled={text.length === 0} onClick={clickEdit} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
