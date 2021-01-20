import React, { useEffect } from 'react';
import Header from '../components/layout/Header/Header';
import { S } from '../App';
import ProfileContainer from '../components/layout/ProfileContainer/ProfileContainer';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Overlay from '../components/layout/Overlay/Overlay';

function Profile() {
  const { postId, userName } = useParams();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.userName) {
      history.replace(`/${userName}/`, {
        userName,
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {location?.state?.userName && (
        <>
          <Header />
          <S.AppBody>
            <ProfileContainer />
            {postId && <Overlay />}
          </S.AppBody>
        </>
      )}
    </>
  );
}

export default Profile;
