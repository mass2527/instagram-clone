import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Comment from './Comment';
import moment from 'moment';
import FaceIcon from '@material-ui/icons/Face';
import db from '../firebase/firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { useHistory } from 'react-router-dom';
import CommentSender from './CommentSender';
import PostImageLoader from './PostImageLoader';
import PostIcons from './PostIcons';

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
    box-sizing: border-box;
    object-fit: contain;
    border-radius: 100%;

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
  const history = useHistory();
  const imageRef = useRef(null);
  const [postImageLoading, setPostImageLoading] = useState(true);
  const [postUserInfo, setPostUserInfo] = useState({});

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

    db.collection('users')
      .doc(displayName)
      .get()
      .then((res) => {
        setPostUserInfo(res.data());
      });

    imageRef?.current?.addEventListener('load', handleLoad);
    return () => imageRef?.current?.addEventListener('load', handleLoad);
  }, []);

  function handleLoad() {
    setPostImageLoading(false);
  }

  function clickViewAll() {
    if (!user) return history.push('/login');
    history.push(`/p/${postId}/`, {
      displayName,
      photoURL: postUserInfo?.photoURL,
    });
  }

  function viewProfile() {
    if (!user) return history.push('/login');
    history.push(`/${displayName}/`, {
      userName: displayName,
    });

    document.querySelector('body').style.overflowY = 'scroll';
  }

  return (
    <S.Post>
      <S.PostHeader>
        <S.PostUserImage
          onClick={viewProfile}
          src={
            postUserInfo?.photoURL
              ? postUserInfo?.photoURL
              : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'
          }
          alt="post-owner-profile-image"
        />

        <S.PostHeaderInfo>
          <S.PostUserName onClick={viewProfile}>{displayName}</S.PostUserName>
          <S.PostTitle>{title}</S.PostTitle>
        </S.PostHeaderInfo>
      </S.PostHeader>

      {postImageLoading && <PostImageLoader />}
      <S.PostImage ref={imageRef} src={imageURL} alt={title} />

      <S.PostBottom>
        <PostIcons
          postId={postId}
          caption={caption}
          displayName={displayName}
          imageURL={imageURL}
          timestamp={timestamp}
          title={title}
          userId={userId}
          userImageURL={userImageURL}
        />

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

        <S.PostTimestamp>
          {moment(timestamp).fromNow().toUpperCase()}
        </S.PostTimestamp>
      </S.PostBottom>
      <CommentSender postId={postId} user={user} />
    </S.Post>
  );
}

export default Post;
