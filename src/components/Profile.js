import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AppsIcon from '@material-ui/icons/Apps';
import db, { storage } from '../firebase/firebase';
import RefreshLoader from './RefreshLoader';
import ProfilePosts from './ProfilePosts';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

const Spin = keyframes`
    from{
        transform:rotate(0deg)
    }
    to{
        transform:rotate(360deg)
    }
    `;

const S = {
  Profile: styled.div`
    max-width: 975px;
    padding: 30px 20px 0px 20px;
    box-sizing: border-box;
    width: 100%;

    @media (max-width: 735px) {
      padding: 0px;
    }
  `,

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

  ProfileMiddle: styled.div`
    border-top: 2px solid #dbdbdb;
  `,

  ProfileMiddleOptionContainer: styled.div`
    display: flex;
    justify-content: center;
    height: 44px;

    @media (max-width: 735px) {
      border-bottom: 1px solid #dbdbdb;
    }
  `,

  ProfileMiddleOption: styled.span`
    cursor: pointer;
    margin: 0px 30px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
    width: 40px;
    color: #262626;

    box-sizing: border-box;

    @media (min-width: 735px) {
      border-top: 1px solid
        ${(props) => (props.borderTop ? '#262626' : 'transparent')};

      > .MuiSvgIcon-root {
        display: none;
      }
    }
  `,

  SmallProfileInfoContainer: styled.div`
    border-top: 1px solid #dbdbdb;
    height: 36px;
    padding: 12px 0px;
    display: none;
    justify-content: space-between;

    @media (max-width: 735px) {
      display: flex;
    }
  `,

  SmallProfileInfoOption: styled.div`
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #8e8e8e;
    display: flex;
    flex-direction: column;
  `,

  OptionNumber: styled.span`
    color: #262626;
    font-weight: bold;
  `,

  OptionName: styled.span`
    @media (max-width: 735px) {
      display: none;
    }
  `,
};

function Profile() {
  const location = useLocation();
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const inputRef = useRef(null);
  const user = useSelector(selectUser);
  const [currentProfileUserInfo, setCurrentProfileUserInfo] = useState({});
  const [profileImageLoading, setProfileImageLoading] = useState(false);

  useEffect(() => {
    db.collection('users')
      .doc(location.state.userName)
      .get()
      .then((res) => {
        setCurrentProfileUserInfo(res.data());
      });
  }, [profileImageLoading, location.state.userName]);

  useEffect(() => {
    setLoading(true);
    const userName = location.state.userName;

    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.filter(
          (doc) => doc.data().displayName === userName
        );
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

    const uploadTask = storage
      .ref(`/profileImages/${currentFile.name}`)
      .put(currentFile);

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

            setProfileImageLoading(false);
          });
      }
    );
  }

  return (
    <>
      {loading && <RefreshLoader />}

      <S.Profile>
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
                  currentProfileUserInfo.photoURL === 'null'
                    ? 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'
                    : currentProfileUserInfo.photoURL
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
            />
          </S.ProfileHeaderLeft>
          <S.ProfileHeaderRight>
            <S.ProfileDisplayName>
              {location.state.userName}
            </S.ProfileDisplayName>
            <S.ProfileInfoContainer>
              <S.ProfileInfoOption>POST {posts.length}</S.ProfileInfoOption>
              <S.ProfileInfoOption>FOLLOWER 0</S.ProfileInfoOption>
              <S.ProfileInfoOption>FOLLOW 0</S.ProfileInfoOption>
            </S.ProfileInfoContainer>
          </S.ProfileHeaderRight>
        </S.ProfileHeader>
        <S.SmallProfileInfoContainer>
          <S.SmallProfileInfoOption>
            POST<S.OptionNumber>{posts.length}</S.OptionNumber>
          </S.SmallProfileInfoOption>
          <S.SmallProfileInfoOption>
            FOLLOWER<S.OptionNumber>0</S.OptionNumber>
          </S.SmallProfileInfoOption>
          <S.SmallProfileInfoOption>
            FOLLOW<S.OptionNumber>0</S.OptionNumber>
          </S.SmallProfileInfoOption>
        </S.SmallProfileInfoContainer>
        <S.ProfileMiddle>
          <S.ProfileMiddleOptionContainer>
            <S.ProfileMiddleOption
              borderTop={location.pathname.split('/')[2] === ''}
              onClick={() => {
                history.push(`/${location.state.userName}/`, {
                  userName: location.state.userName,
                });
              }}
            >
              <S.OptionName>POST</S.OptionName>
              <AppsIcon
                color={
                  location.pathname.split('/')[2] === '' ? 'primary' : 'action'
                }
              />
            </S.ProfileMiddleOption>
            <S.ProfileMiddleOption
              borderTop={location.pathname.split('/')[2] === 'liked'}
              onClick={() => {
                history.push(`/${location.state.userName}/liked/`, {
                  userName: location.state.userName,
                  option: 'liked',
                });
              }}
            >
              <S.OptionName>LIKED</S.OptionName>
              <FavoriteBorderIcon
                color={
                  location.pathname.split('/')[2] === 'liked'
                    ? 'primary'
                    : 'action'
                }
              />
            </S.ProfileMiddleOption>
          </S.ProfileMiddleOptionContainer>
        </S.ProfileMiddle>

        {location.state.option === 'liked' ? (
          <ProfilePosts posts={likedPosts} />
        ) : (
          <ProfilePosts posts={posts} />
        )}
      </S.Profile>
    </>
  );
}

export default Profile;
