import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AppsIcon from '@material-ui/icons/Apps';
import db from '../firebase/firebase';
import RefreshLoader from './RefreshLoader';
import ProfilePosts from './ProfilePosts';

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
  `,

  ProfileImage: styled.img`
    width: 150px;
    height: 150px;

    @media (max-width: 735px) {
      width: 77px;
      height: 77px;
    }
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
      border-top: 2px solid
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
  const [userName] = useState(location.state.userName);
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    setLoading(true);

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

    // db.collection('posts').onSnapshot(snapshot=>{
    //   snapshot.docs.filter(doc=>doc.)
    // })
  }, []);

  return (
    <>
      {loading && <RefreshLoader />}

      <S.Profile>
        <S.ProfileHeader>
          <S.ProfileHeaderLeft>
            <S.ProfileImage
              src="https://scontent-sin6-3.cdninstagram.com/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=scontent-sin6-3.cdninstagram.com&_nc_cat=1&_nc_ohc=cE8yhZvtWRIAX-UHwFN&oh=f2d5dbea946dc5108a8e295e604fd580&oe=6018B58F&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2"
              alt=""
            />
            {console.log(posts)}
          </S.ProfileHeaderLeft>
          <S.ProfileHeaderRight>
            <S.ProfileDisplayName>{userName}</S.ProfileDisplayName>
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
                history.push(`/${userName}/`, {
                  userName,
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
                history.push(`/${userName}/liked/`, {
                  userName,
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

        {console.log(location.state.option)}
        {location.state.option === 'liked' ? (
          <h1>Liked</h1>
        ) : (
          <ProfilePosts posts={posts} />
        )}
      </S.Profile>
    </>
  );
}

export default Profile;
