import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Comment from './Comment';
import moment from 'moment';
import FaceIcon from '@material-ui/icons/Face';
import db from '../firebase/firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import FavoriteIcon from '@material-ui/icons/Favorite';
import history, { useHistory } from 'react-router-dom';
import CommentSender from './CommentSender';
import PostImageLoader from './PostImageLoader';

const S = {
  Post: styled.div`
    width: 100%;
    border: 1px solid lightgrey;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    background-color: white;
    @media (max-width: 600px) {
      border: none;
    }
  `,

  PostHeader: styled.div`
    height: 60px;
    padding: 16px;
    box-sizing: border-box;

    display: flex;
    align-items: center;

    > .MuiSvgIcon-root {
      border: 1px solid red;
      border-radius: 100%;
      padding: 2px;
      cursor: pointer;
    }
  `,

  PostUserImage: styled.img`
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 100%;
    padding: 2px;
    border: 1px solid orangered;
    cursor: pointer;
  `,

  PostHeaderInfo: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  `,

  PostUserName: styled.span`
    font-size: 14px;
    color: #262626;
    font-weight: 500;
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  `,

  PostTitle: styled.span`
    font-size: 12px;
    color: #262626;
  `,

  PostImage: styled.img`
    width: 614px;
    object-fit: contain;
    display: block;

    @media (max-width: 1000px) {
      width: 100%;
    }
  `,

  PostBottom: styled.div`
    flex: 1;
  `,

  PostIcons: styled.div`
    padding: 0px 16px;
    height: 40px;
    margin-top: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    > .MuiSvgIcon-root {
      margin-right: 10px;
    }
  `,

  PostHeart: styled.div`
    padding: 0px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #262626;
  `,

  PostTimestamp: styled.div`
    padding: 0px 16px;
    font-size: 10px;
    color: #8e8e8e;
    margin-bottom: 3px;
  `,

  CommentLength: styled.span`
    padding: 3px 16px;
    font-size: 14px;
    color: #8e8e8e;
    cursor: pointer;
  `,
};

function Post({
  caption,
  displayName,
  imageURL,
  postId,
  timestamp,
  title,
  userId,
  userImageURL,
}) {
  const user = useSelector(selectUser);
  const [comments, setComments] = useState([]);
  const [hearts, setHearts] = useState([]);
  const history = useHistory();
  const imageRef = useRef(null);
  const [postImageLoading, setPostImageLoading] = useState(true);

  function handleLoad() {
    setPostImageLoading(false);
  }

  useEffect(() => {
    db.collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            commentId: doc.id,
            ...doc.data(),
          }))
        );
      });

    db.collection('posts')
      .doc(postId)
      .collection('hearts')
      .onSnapshot((snapshot) => {
        setHearts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

    imageRef?.current?.addEventListener('load', handleLoad);
    return () => imageRef?.current?.addEventListener('load', handleLoad);
  }, []);

  function clickHeart() {
    const liked = hearts.find((heart) => heart?.userId === user?.userId);

    if (liked) {
      db.collection('posts')
        .doc(postId)
        .collection('hearts')
        .doc(liked.id)
        .delete();
    } else {
      db.collection('posts').doc(postId).collection('hearts').add({
        userImageURL: user.userImageURL,
        displayName: user.displayName,
        userId: user?.userId,
      });
    }
  }

  function clickViewAll() {
    history.push(`/p/${postId}/`);
  }

  return (
    <S.Post>
      <S.PostHeader>
        {userImageURL ? (
          <S.PostUserImage src={userImageURL}></S.PostUserImage>
        ) : (
          <FaceIcon />
        )}

        <S.PostHeaderInfo>
          <S.PostUserName>{displayName}</S.PostUserName>
          <S.PostTitle>{title}</S.PostTitle>
        </S.PostHeaderInfo>
      </S.PostHeader>

      {postImageLoading && <PostImageLoader />}
      <S.PostImage ref={imageRef} src={imageURL} alt={title} />

      <S.PostBottom>
        <S.PostIcons>
          {hearts.find((heart) => heart?.userId === user?.userId) ? (
            <FavoriteIcon color="secondary" onClick={clickHeart} />
          ) : (
            <FavoriteBorderIcon onClick={clickHeart} />
          )}

          <ChatBubbleOutlineIcon onClick={clickViewAll} />
        </S.PostIcons>

        <S.PostHeart>liked {hearts.length}</S.PostHeart>
        <Comment name={displayName} content={caption} />
        {comments.length >= 3 && (
          <S.CommentLength onClick={clickViewAll}>
            View all {comments.length} comments
          </S.CommentLength>
        )}
        {comments?.slice(-2).map((comment) => (
          <Comment
            key={comment.commentId}
            name={comment.displayName}
            content={comment.comment}
          />
        ))}

        <S.PostTimestamp>{moment(timestamp).fromNow()}</S.PostTimestamp>
      </S.PostBottom>
      <CommentSender postId={postId} user={user} />
    </S.Post>
  );
}

export default Post;
