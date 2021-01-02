import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Post from './Post';
import db from '../firebase/firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import RefreshLoader from './RefreshLoader';

const S = {
  Feed: styled.div`
    max-width: 975px;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;

    display: flex;

    @media (max-width: 1000px) {
      justify-content: center;
      padding: 0px;
    }
  `,

  FeedLeft: styled.div`
    max-width: 614px;
    width: 100%;
    margin-right: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 1000px) {
      width: 100%;
      margin: 0px;
      max-width: 602px;
    }
  `,

  FeedRight: styled.div`
    border: 1px solid green;
    flex: 1;

    @media (max-width: 1000px) {
      display: none;
    }
  `,

  LoadingContainer: styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;

    display: grid;
    place-items: center;
  `,
};

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ postId: doc.id, ...doc.data() }))
        );

        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading && <RefreshLoader />}
      <S.Feed>
        <S.FeedLeft>
          {posts.map(
            ({
              caption,
              displayName,
              imageURL,
              postId,
              timestamp,
              title,
              userId,
              userImageURL,
            }) => (
              <Post
                key={postId}
                caption={caption}
                displayName={displayName}
                imageURL={imageURL}
                postId={postId}
                title={title}
                userId={userId}
                userImageURL={userImageURL}
                timestamp={new Date(timestamp?.toDate()).toUTCString()}
              />
            )
          )}
        </S.FeedLeft>
        <S.FeedRight></S.FeedRight>
      </S.Feed>
    </>
  );
}

export default Feed;
