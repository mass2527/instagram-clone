import React, { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { selectUser } from '../../../../features/userSlice';
import db, { auth, storage } from '../../../../firebase/firebase';
import FormDialog from '../../../shared/Dialog/FormDialog';
import FollowingModal from '../../../shared/Dialog/FollowingModal';
import FollowerModal from '../../../shared/Dialog/FollowerModal';

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
    flex-direction: column;
  `,

  HeaderContainer: styled.div`
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
      padding-top: 18px;
      box-sizing: border-box;
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
    padding-bottom: 7px;
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
    cursor: ${({ pointer }) => pointer && 'pointer'};
  `,

  Bio: styled.p`
    margin-top: 10px;

    @media (max-width: 735px) {
      margin: 0px;
    }
  `,

  HeaderBottom: styled.div`
    padding: 0px 16px 16px 16px;
  `,
};

function ProfileHeader({ numberOfPosts, numberOfFollower, numberOfFollow }) {
  const user = useSelector(selectUser);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [currentProfileUserInfo, setCurrentProfileUserInfo] = useState({});
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [openFollowerModal, setOpenFollowerModal] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const inputRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth));

    return () => window.removeEventListener('resize', () => setWidth(window.innerWidth));
  }, []);

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
      <S.HeaderContainer>
        <S.HeaderLeft>
          <S.ImageContainer>
            <S.Image
              isLoading={profileImageLoading}
              onClick={() => {
                if (!auth.currentUser || user.displayName !== location.state.userName) return;
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
            <S.InfoOption pointer={true} onClick={() => setOpenFollowerModal(true)}>
              FOLLOWER {numberOfFollower}
            </S.InfoOption>
            <S.InfoOption pointer={true} onClick={() => setOpenFollowingModal(true)}>
              FOLLOW {numberOfFollow}
            </S.InfoOption>

            {openFollowingModal && <FollowingModal reset={() => setOpenFollowingModal(false)} />}
            {openFollowerModal && <FollowerModal reset={() => setOpenFollowerModal(false)} />}
          </S.InfoContainer>
          {currentProfileUserInfo?.bio && width > 735 && <S.Bio>{currentProfileUserInfo.bio}</S.Bio>}
        </S.HeaderRight>
      </S.HeaderContainer>
      <S.HeaderBottom>
        {currentProfileUserInfo?.bio && width <= 735 && <S.Bio>{currentProfileUserInfo.bio}</S.Bio>}
      </S.HeaderBottom>
    </S.ProfileHeader>
  );
}

export default memo(ProfileHeader);
