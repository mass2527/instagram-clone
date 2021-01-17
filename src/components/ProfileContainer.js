import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import db from '../firebase/firebase';
import RefreshLoader from './RefreshLoader';
import ProfilePosts from './ProfilePosts';
import ProfileHeader from './ProfileHeader';
import SmallProfileInfoContainer from './SmallProfileInfoContainer';
import ProfileMiddle from './ProfileMiddle';

const S = {
  ProfileContainer: styled.div`
    max-width: 975px;
    padding: 30px 20px 0px 20px;
    box-sizing: border-box;
    width: 100%;

    @media (max-width: 735px) {
      padding: 0px;
    }
  `,

  ProfileInfoContainer: styled.div`
    display: flex;

    @media (max-width: 735px) {
      display: none;
    }
  `,

  ProfileInfoOption: styled.span`
    font-size: 16px;
    margin-right: 15px;
    font-weight: 500;
  `,
};

function ProfileContainer() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    const userName = location.state.userName;

    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.filter((doc) => doc.data().displayName === userName);
        setPosts(
          posts.map((post) => ({
            id: post.id,
            ...post.data(),
          }))
        );

        setLoading(false);
      });

    db.collection('users')
      .doc(userName)
      .collection('liked')
      .orderBy('timestampWhenClickLiked', 'desc')
      .onSnapshot((snapshot) => {
        setLikedPosts(
          snapshot.docs?.map((doc) => ({
            ...doc.data(),
          }))
        );
      });
  }, [location.state.userName]);

  return (
    <>
      {loading && <RefreshLoader />}

      <S.ProfileContainer>
        <ProfileHeader numberOfPosts={posts.length} />
        <SmallProfileInfoContainer numberOfPosts={posts.length} />
        <ProfileMiddle />

        {location.state.option === 'liked' ? <ProfilePosts posts={likedPosts} /> : <ProfilePosts posts={posts} />}
      </S.ProfileContainer>
    </>
  );
}

export default ProfileContainer;
