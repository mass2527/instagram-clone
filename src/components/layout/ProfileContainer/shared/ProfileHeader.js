import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { selectUser } from '../../../../features/userSlice';
import db, { auth, storage } from '../../../../firebase/firebase';
import FormDialog from '../../../shared/FormDialog/FormDialog';

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

  HeaderLeft: styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    margin-right: 30px;
  `,

  HeaderRight: styled.div`
    width: 613px;
    color: #262626;

    @media (max-width: 735px) {
      display: flex;
      align-items: center;
    }
  `,

  ImageContainer: styled.div`
    width: 150px;
    height: 150px;
    position: relative;
    display: grid;
    place-items: center;
    border: 1px solid lightgray;
    border-radius: 50%;

    @media (max-width: 735px) {
      width: 77px;
      height: 77px;
    }
  `,

  Image: styled.img`
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 100%;
    object-fit: contain;
    opacity: ${(props) => props.isLoading && 0.5};
  `,

  ImageLoader: styled.img`
    position: absolute;
    width: 25px;
    height: 25px;
    animation: ${Spin} 2s infinite linear;
  `,

  Input: styled.input`
    display: none;
  `,

  NameAndEdit: styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  `,

  Name: styled.span`
    font-size: 28px;
    font-weight: 300;
    margin-right: 20px;
  `,

  InfoContainer: styled.div`
    display: flex;

    @media (max-width: 735px) {
      display: none;
    }
  `,

  InfoOption: styled.span`
    font-size: 16px;
    margin-right: 15px;
    font-weight: 500;
  `,

  Bio: styled.p`
    margin-top: 10px;
  `,
};

function ProfileHeader({ numberOfPosts }) {
  const user = useSelector(selectUser);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [currentProfileUserInfo, setCurrentProfileUserInfo] = useState({});
  const inputRef = useRef(null);
  const location = useLocation();

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
      <S.HeaderLeft>
        <S.ImageContainer>
          <S.Image
            isLoading={profileImageLoading}
            onClick={() => {
              if (user.displayName !== location.state.userName) return;
              inputRef.current.click();
            }}
            src={
              !currentProfileUserInfo.photoURL
                ? 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'
                : currentProfileUserInfo.photoURL
            }
            alt="user-profile"
          />
          {profileImageLoading && (
            <S.ImageLoader
              src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgetdrawings.com%2Ffree-icon-bw%2Fwaiting-icon-gif-13.png&f=1&nofb=1"
              alt="loader"
            />
          )}
        </S.ImageContainer>

        <S.Input
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
          accept="image/jpeg,
              image/jpg,
              image/png"
        />
      </S.HeaderLeft>
      <S.HeaderRight>
        <S.NameAndEdit>
          <S.Name>{location.state.userName}</S.Name>
          {user?.displayName === location.state.userName && <FormDialog />}
        </S.NameAndEdit>
        <S.InfoContainer>
          <S.InfoOption>POST {numberOfPosts}</S.InfoOption>
          <S.InfoOption>FOLLOWER 0</S.InfoOption>
          <S.InfoOption>FOLLOW 0</S.InfoOption>
        </S.InfoContainer>
        {currentProfileUserInfo?.bio && <S.Bio>{currentProfileUserInfo.bio}</S.Bio>}
      </S.HeaderRight>
    </S.ProfileHeader>
  );
}

export default ProfileHeader;
