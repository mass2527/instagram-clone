import React from 'react';
import Header from '../components/layout/Header/Header';
import { S } from '../App';
import ProfileContainer from '../components/layout/ProfileContainer/ProfileContainer';
import { useParams } from 'react-router-dom';
import Overlay from '../components/layout/Overlay/Overlay';

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
