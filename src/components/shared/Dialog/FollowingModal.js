import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import db from '../../../firebase/firebase';
import { useLocation } from 'react-router-dom';
import FeedRightRow from '../../layout/Feed/shared/FeedRightRow';

export default function FollowingModal({ reset }) {
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setOpen(true);

    db.collection('users')
      .doc(location.state.userName)
      .collection('follow')
      .onSnapshot((snapshot) => {
        setFollowing(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Following </DialogTitle>

      <List>
        {following.map((user) => (
          <ListItem style={{ cursor: 'default' }} divider={true} button key={user.id}>
            <FeedRightRow closeModal={handleClose} photoURL={user.imageURL} displayName={user.displayName} />
          </ListItem>
        ))}

        {following.length === 0 && (
          <ListItem>
            <ListItemText primary="No followings" />
          </ListItem>
        )}
      </List>
    </Dialog>
  );
}
