import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { selectUser } from '../../../../features/userSlice';
import db, { auth, storage } from '../../../../firebase/firebase';

const Spin = keyframes`
    from{
        transform:rotate(0deg)
    }
    to{
        transform:rotate(360deg)
    }
    `;

const S = {
  ProfileHeader: styled.div`
    display: flex;
    margin-bottom: 44px;

    @media (max-width: 735px) {
      margin: 16px 16px 24px 16px;
    }
  `,

  ProfileHeaderLeft: styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    margin-right: 30px;
  `,

  ProfileHeaderRight: styled.div`
    width: 613px;
    color: #262626;

    @media (max-width: 735px) {
      display: flex;
      align-items: center;
    }
  `,

  ProfileImageContainer: styled.div`
    width: 150px;
    height: 150px;
    position: relative;
    display: grid;
    place-items: center;

    @media (max-width: 735px) {
      width: 77px;
      height: 77px;
    }
  `,

  ProfileImage: styled.img`
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 100%;
    object-fit: contain;
    opacity: ${(props) => props.isLoading && 0.5};
  `,

  ProfileImageLoader: styled.img`
    position: absolute;
    width: 25px;
    height: 25px;
    animation: ${Spin} 2s infinite linear;
  `,

  FileInput: styled.input`
    display: none;
  `,

  ProfileDisplayName: styled.div`
    font-size: 28px;
    font-weight: 300;
    margin-bottom: 20px;
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

function ProfileHeader({ numberOfPosts }) {
  const user = useSelector(selectUser);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const inputRef = useRef(null);
  const location = useLocation();
  const [currentProfileUserInfo, setCurrentProfileUserInfo] = useState({});

  useEffect(() => {
    db.collection('users')
      .doc(location.state.userName)
      .get()
      .then((res) => {
        setCurrentProfileUserInfo(res.data());
      });
  }, [profileImageLoading, location.state.userName]);

  function handleFileChange(e) {
    const currentFile = e.target.files[0];
    if (!currentFile) return;
    setProfileImageLoading(true);

    if (
      e.target.files[0].type !== 'image/jpeg' &&
      e.target.files[0].type !== 'image/jpg' &&
      e.target.files[0].type !== 'image/png'
    ) {
      return setProfileImageLoading(false);
    }

    const uploadTask = storage.ref(`/profileImages/${currentFile.name}`).put(currentFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref('profileImages')
          .child(currentFile.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('users').doc(user.displayName).update({
              photoURL: url,
            });

            auth.currentUser.updateProfile({
              photoURL: url,
            });

            setProfileImageLoading(false);
          });
      }
    );
  }

  return (
    <S.ProfileHeader>
      <S.ProfileHeaderLeft>
        <S.ProfileImageContainer>
          <S.ProfileImage
            isLoading={profileImageLoading}
            onClick={() => {
              if (user.displayName !== location.state.userName) return;
              inputRef.current.click();
            }}
            src={
              currentProfileUserInfo.photoURL
                ? currentProfileUserInfo.photoURL
                : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'
            }
            alt="user-profile"
          />
          {profileImageLoading && (
            <S.ProfileImageLoader
              src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgetdrawings.com%2Ffree-icon-bw%2Fwaiting-icon-gif-13.png&f=1&nofb=1"
              alt="loader"
            />
          )}
        </S.ProfileImageContainer>

        <S.FileInput
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
          accept="image/jpeg,
              image/jpg,
              image/png"
        />
      </S.ProfileHeaderLeft>
      <S.ProfileHeaderRight>
        <S.ProfileDisplayName>{location.state.userName}</S.ProfileDisplayName>
        <S.ProfileInfoContainer>
          <S.ProfileInfoOption>POST {numberOfPosts}</S.ProfileInfoOption>
          <S.ProfileInfoOption>FOLLOWER 0</S.ProfileInfoOption>
          <S.ProfileInfoOption>FOLLOW 0</S.ProfileInfoOption>
        </S.ProfileInfoContainer>
      </S.ProfileHeaderRight>
    </S.ProfileHeader>
  );
}

export default ProfileHeader;
