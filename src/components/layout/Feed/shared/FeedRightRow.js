import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import db, { auth } from '../../../../firebase/firebase';

const S = {
  FeedRightRow: styled.div`
    width: 100%;
    height: 48px;
    padding: 8px 16px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  ImageAndName: styled.div`
    display: flex;
    align-items: center;
  `,

  ImageContainer: styled.div`
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
  `,

  Image: styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
  `,

  Name: styled.span`
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  `,

  Button: styled.button`
    color: #3aacf7;
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-left: 15px;

    :focus {
      outline: none;
    }
  `,
};

function FeedRightRow({ photoURL, displayName, closeModal }) {
  const history = useHistory();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    db.collection('users')
      .doc(auth.currentUser.displayName)
      .collection('follow')
      .onSnapshot((snapshot) => {
        setIsFollowing(snapshot.docs.some((doc) => doc.data().displayName === displayName));
      });
  }, []);

  function viewUserProfile() {
    history.push(`/${displayName}/`, {
      userName: displayName,
      photoURL,
    });

    if (closeModal) {
      closeModal();
    }
  }

  function clickFollow() {
    if (!isFollowing) {
      db.collection('users').doc(auth.currentUser.displayName).collection('follow').doc(displayName).set({
        displayName,
        imageURL: photoURL,
      });
      db.collection('users').doc(displayName).collection('follower').doc(auth.currentUser.displayName).set({
        displayName: auth.currentUser.displayName,
        imageURL: auth.currentUser.photoURL,
      });
    } else {
      db.collection('users').doc(auth.currentUser.displayName).collection('follow').doc(displayName).delete();

      db.collection('users').doc(displayName).collection('follower').doc(auth.currentUser.displayName).delete();
    }
  }

  return (
    <S.FeedRightRow>
      <S.ImageAndName>
        <S.ImageContainer onClick={viewUserProfile}>
          <S.Image
            src={photoURL ? photoURL : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'}
            alt="profile-image"
          />
        </S.ImageContainer>
        <S.Name onClick={viewUserProfile}>{displayName}</S.Name>
      </S.ImageAndName>

      {auth.currentUser.displayName !== displayName && (
        <S.Button onClick={clickFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</S.Button>
      )}
    </S.FeedRightRow>
  );
}

export default memo(FeedRightRow);
