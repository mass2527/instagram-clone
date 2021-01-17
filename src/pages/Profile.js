import React from 'react';
import Header from '../components/Header';
import { S } from '../App';
import ProfileContainer from '../components/ProfileContainer';
import { useParams } from 'react-router-dom';
import Overlay from '../components/Overlay';

function Profile() {
  const { postId } = useParams();

  return (
    <>
      <Header />
      <S.AppBody>
        <ProfileContainer />
        {postId && <Overlay />}
      </S.AppBody>
    </>
  );
}

export default Profile;
