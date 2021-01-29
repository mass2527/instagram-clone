import React, { useState, useEffect, useRef, memo } from 'react';
import styled from 'styled-components';
import Comment from '../../../shared/Comment/Comment';
import moment from 'moment';
import db from '../../../../firebase/firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/userSlice';
import { useHistory } from 'react-router-dom';
import CommentSender from '../../../shared/Comment/CommentSender';
import PostImageLoader from '../../../shared/Loader/PostImageLoader';
import PostIcons from '../../../shared/PostIcons/PostIcons';

const S = {
  Post: styled.div`
    width: 100%;
    border: 1px solid lightgrey;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    background-color: white;

    :first-child {
      border-top: none;
    }

    @media (max-width: 600px) {
      border: none;
      margin-bottom: 0px;

      :last-child {
        margin-bottom: 60px;
      }
    }
  `,

  Header: styled.div`
    height: 60px;
    padding: 16px;
    box-sizing: border-box;
    justify-content: space-between;
    display: flex;
    align-items: center;

    > .MuiSvgIcon-root {
      cursor: pointer;
    }
  `,

  UserImageAndInfo: styled.div`
    display: flex;
    align-items: center;
  `,

  UserImage: styled.img`
    width: 32px;
    height: 32px;
    border: 1px solid lightgray;
    box-sizing: border-box;
    object-fit: cover;
    border-radius: 100%;

    cursor: pointer;
  `,

  Info: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  `,

  UserName: styled.span`
    font-size: 14px;
    color: #262626;
    font-weight: 500;
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  `,

  Title: styled.span`
    font-size: 12px;
    color: #262626;
  `,

  ImageContainer: styled.div``,

  Image: styled.img`
    width: 600px;
    object-fit: contain;
    display: block;

    @media (max-width: 1000px) {
      width: 100%;
    }
  `,

  Bottom: styled.div`
    flex: 1;
  `,

  Timestamp: styled.div`
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

function Post({ caption, displayName, imageURL, postId, timestamp, title, userId, userImageURL }) {
  const user = useSelector(selectUser);
  const [comments, setComments] = useState([]);
  const [postImageLoading, setPostImageLoading] = useState(true);
  const [postUserInfo, setPostUserInfo] = useState({});
  const imageRef = useRef(null);
  const history = useHistory();
  const [width, setWidth] = useState(window.innerWidth);

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

    const image = imageRef.current;

    window.addEventListener('resize', handleResize);
    image.addEventListener('load', handleLoad);
    return () => {
      image.addEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, []);

  function handleLoad() {
    setPostImageLoading(false);
  }

  function handleResize() {
    setWidth(window.innerWidth);
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
      <S.Header>
        <S.UserImageAndInfo>
          <S.UserImage
            onClick={viewProfile}
            src={
              postUserInfo?.photoURL
                ? postUserInfo?.photoURL
                : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'
            }
            alt="post-owner-profile-image"
          />

          <S.Info>
            <S.UserName onClick={viewProfile}>{displayName}</S.UserName>
            <S.Title>{title}</S.Title>
          </S.Info>
        </S.UserImageAndInfo>
      </S.Header>

      {postImageLoading && <PostImageLoader />}
      <S.ImageContainer>
        <S.Image ref={imageRef} src={imageURL} alt={title} />
      </S.ImageContainer>

      <S.Bottom>
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
          <S.CommentLength onClick={clickViewAll}>View all {comments.length} comments</S.CommentLength>
        )}
        {comments?.slice(-2).map((comment) => (
          <Comment key={comment.commentId} name={comment.displayName} content={comment.comment} />
        ))}

        <S.Timestamp>{moment(timestamp).fromNow().toUpperCase()}</S.Timestamp>
      </S.Bottom>
      {width >= 600 && <CommentSender postId={postId} user={user} />}
    </S.Post>
  );
}

export default memo(Post);
