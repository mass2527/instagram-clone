import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import db from '../../../firebase/firebase';

export default function PostOptionDialog({ reset, postId }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const deletePost = () => {
    db.collection('posts')
      .doc(postId)
      .delete()
      .then(() => handleClose());
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Do you want to delete this post?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can not recover data, once you delete them.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deletePost} color="primary">
            Delete
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
