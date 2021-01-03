import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase/firebase';
import firebase from 'firebase';

const S = {
  PostIcons: styled.div`
    padding: 0px 16px;
    height: 40px;
    margin-top: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-top: 1px solid
      ${(props) => (props.borderTopOption ? 'lightgrey' : 'transparent')};

    .MuiSvgIcon-root {
      margin-right: 10px;
    }
  `,

  PostHeart: styled.div`
    padding: 0px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #262626;
  `,
};

function PostIcons({
  postId,
  caption,
  displayName,
  imageURL,
  timestamp,
  title,
  userId,
  userImageURL,
  commentIconDisableOption,
  borderTopOption,
}) {
  const user = useSelector(selectUser);
  const history = useHistory();
  const [hearts, setHearts] = useState([]);
  const [postUserInfo, setPostUserInfo] = useState({});

  useEffect(() => {
    db.collection('users')
      .doc(displayName)
      .get()
      .then((res) => {
        setPostUserInfo(res.data());
      });

    db.collection('posts')
      .doc(postId)
      .collection('hearts')
      .onSnapshot((snapshot) => {
        setHearts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
  }, []);

  const heartsCollection = db
    .collection('posts')
    .doc(postId)
    .collection('hearts');

  const DocInLikedCollection = db
    .collection('users')
    .doc(user?.displayName)
    .collection('liked')
    .doc(postId);

  function clickHeart() {
    const liked = hearts.find((heart) => heart?.userId === user?.userId);

    if (liked) {
      heartsCollection.doc(liked.id).delete();
      DocInLikedCollection.delete();
    } else {
      heartsCollection.add({
        userImageURL: user.userImageURL,
        displayName: user.displayName,
        userId: user?.userId,
      });

      DocInLikedCollection.set({
        caption,
        displayName,
        imageURL,
        id: postId,
        timestamp,
        title,
        userId,
        userImageURL,
        timestampWhenClickLiked: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  function clickViewAll() {
    if (!user) return history.push('/login');

    history.push(`/p/${postId}/`, {
      displayName,
      photoURL: postUserInfo.photoURL,
    });
  }

  return (
    <div>
      <S.PostIcons borderTopOption={borderTopOption}>
        {hearts.find((heart) => heart?.userId === user?.userId) ? (
          <FavoriteIcon
            color="secondary"
            onClick={() => {
              if (!user) return history.push('/login');
              clickHeart();
            }}
          />
        ) : (
          <FavoriteBorderIcon onClick={clickHeart} />
        )}

        <ChatBubbleOutlineIcon
          onClick={!commentIconDisableOption && clickViewAll}
        />
      </S.PostIcons>

      <S.PostHeart>liked {hearts.length}</S.PostHeart>
    </div>
  );
}

export default PostIcons;
