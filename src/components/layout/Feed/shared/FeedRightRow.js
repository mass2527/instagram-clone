import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import db, { auth } from '../../../../firebase/firebase';

const S = {
  FeedRightRow: styled.div`
    height: 32px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
  `,

  ProfileContainer: styled.div`
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
  `,

  ProfileImage: styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 5px;
  `,

  ProfileName: styled.span`
    width: 170px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  `,

  Button: styled.button`
    width: 20px;
    color: #3aacf7;
    background-color: transparent;
    border: none;
    cursor: pointer;

    :focus {
      outline: none;
    }
  `,
};

function FeedRightRow({ photoURL, displayName }) {
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
      {console.log(auth.currentUser)}
      <S.ProfileContainer onClick={viewUserProfile}>
        <S.ProfileImage
          src={photoURL ? photoURL : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'}
          alt="profile-image"
        />
      </S.ProfileContainer>
      <S.ProfileName onClick={viewUserProfile}>{displayName}</S.ProfileName>
      {/* <S.Button onClick={clickVisitButton}>Visit</S.Button> */}
      <S.Button onClick={clickFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</S.Button>
    </S.FeedRightRow>
  );
}

export default FeedRightRow;
