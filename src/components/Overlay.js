import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import db from '../firebase/firebase';
import FaceIcon from '@material-ui/icons/Face';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import moment from 'moment';
import CommentSender from './CommentSender';
import Comment from './Comment';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import PostImageLoader from './PostImageLoader';
import PostIcons from './PostIcons';

const S = {
  Overlay: styled.div`
    position: absolute;
    top: ${(props) => props.height}px;
    overflow-y: hidden;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: grid;
    place-items: center;
    z-index: 2;

    @media (max-width: 500px) {
      place-items: end stretch;
    }
  `,

  ClostButton: styled.div`
    position: absolute;
    right: 0;
    top: 0px;
    padding: 16px;
    z-index: 1;

    > .MuiSvgIcon-root {
      cursor: pointer;
      color: white;
    }
  `,

  PostBox: styled.div`
    max-width: 935px;
    height: 600px;
    display: flex;
  `,

  PostLeft: styled.div`
    width: 600px;

    background-color: black;
    display: flex;
    justify-content: center;

    @media (max-width: 1000px) {
      display: none;
    }
  `,

  PostRight: styled.div`
    width: 335px;
    background-color: white;

    display: flex;
    flex-direction: column;

    @media (max-width: 500px) {
      width: 100%;
    }
  `,

  PostImage: styled.img`
    height: 100%;
    max-width: 100%;
    object-fit: contain;
    display: block;
  `,

  PostTop: styled.div`
    height: 72px;
    padding: 16px;
    box-sizing: border-box;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;

    > .MuiSvgIcon-root {
      width: 32px;
      height: 32px;
      padding: 2px;
      border: 2px solid #d32c83;
      border-radius: 100%;
      cursor: pointer;
    }
  `,

  UserImage: styled.img`
    width: 32px;
    height: 32px;
    padding: 2px;
    border: 2px solid #d32c83;
    border-radius: 100%;
    cursor: pointer;
  `,

  PostInfo: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 15px;
  `,

  PostDisplayName: styled.span`
    font-size: 14px;
    color: #262626;
    font-weight: 500;
    cursor: pointer;

    :hover {
      text-decoration: underline;
    }
  `,

  PostTitle: styled.span`
    font-size: 12px;
    color: #262626;
  `,

  PostMiddle: styled.div`
    padding-top: 20px;
    overflow-y: scroll;
    flex: 1;
    ::-webkit-scrollbar {
      display: none;
    }
  `,

  Timestamp: styled.div`
    height: 20px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #8e8e8e;
    padding: 16px;
    box-sizing: border-box;
  `,

  Circle: styled.div`
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background-color: #efefef;
  `,

  Bar: styled.div`
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    margin-top: ${(props) => props.marginTop}px;
    margin-bottom: ${(props) => props.marginBottom}px;
    background-color: #efefef;
  `,

  PostLoadingBottom: styled.div`
    height: 130px;
    border-top: 1px solid #efefef;
    padding-left: 16px;
  `,

  CommentLoadMoreContainer: styled.div`
    text-align: center;
    padding: 20px 0px;
    display: ${(props) => props.hide && 'none'};
    > .MuiSvgIcon-root {
      border: 1px solid black;
      border-radius: 100%;
      cursor: pointer;
    }
  `,
};

function Overlay() {
  const user = useSelector(selectUser);
  const { postId } = useParams();
  const [postInfo, setPostInfo] = useState({});
  const [comments, setComments] = useState([]);
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const history = useHistory();
  const [imageLoading, setImageLoading] = useState(true);
  const [commentsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollY, setScrollY] = useState(window.scrollY);

  function loadMoreComments() {
    setCurrentPage((crr) => crr + 1);
  }

  function goBackToFormerLocation() {
    document.querySelector('body').style.overflowY = 'scroll';
    history.goBack();
  }

  function pressESC(e) {
    if (e.keyCode !== 27) return;
    goBackToFormerLocation();
  }

  function clickOverlay(e) {
    if (e.target !== overlayRef.current) return;
    goBackToFormerLocation();
  }

  function clickCloseButton(e) {
    goBackToFormerLocation();
  }

  function handleResize() {
    setScrollY(window.scrollY);
  }

  function handlePopState() {
    document.querySelector('body').style.overflowY = 'scroll';
  }

  useEffect(() => {
    document.querySelector('body').style.overflowY = 'hidden';

    async function fetchData() {
      const res = await db.collection('posts').doc(postId).get();
      setPostInfo(res.data());
    }
    fetchData();

    db.collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setComments(
          snapshot?.docs.map((doc) => ({
            commentId: doc.id,
            ...doc.data(),
          }))
        );
      });

    imageRef.current.addEventListener('load', () => {
      setImageLoading(false);
    });
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('click', clickOverlay);
    window.addEventListener('keydown', pressESC);
    window.addEventListener('resize', handleResize);

    return () => {
      imageRef?.current?.addEventListener('load', () => {
        setImageLoading(true);
      });
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('click', clickOverlay);
      window.removeEventListener('keydown', pressESC);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function viewProfile() {
    history.push(`/${postInfo.displayName}/`, {
      userName: postInfo.displayName,
    });

    document.querySelector('body').style.overflowY = 'scroll';
  }

  return (
    <>
      {console.log(postInfo)}
      <S.Overlay ref={overlayRef} height={window.scrollY}>
        <S.ClostButton>
          <CloseIcon
            ref={buttonRef}
            height={window.scrollY}
            onClick={clickCloseButton}
            fontSize="large"
          />
        </S.ClostButton>
        <S.PostBox>
          <S.PostLeft>
            {imageLoading && <PostImageLoader />}
            <S.PostImage
              ref={imageRef}
              src={postInfo.imageURL}
              alt={postInfo.title}
            />
          </S.PostLeft>

          <S.PostRight>
            {imageLoading ? (
              <>
                <S.PostTop>
                  <S.Circle></S.Circle>
                  <S.PostInfo>
                    <S.Bar width={140} height={10} marginBottom={4} />
                    <S.Bar width={100} height={10} marginBottom={0} />
                  </S.PostInfo>
                </S.PostTop>
                <S.PostMiddle></S.PostMiddle>
                <S.PostLoadingBottom>
                  <S.Bar width={140} height={15} marginTop={20} />
                  <S.Bar width={230} height={15} marginTop={10} />
                  <S.Bar width={90} height={15} marginTop={10} />
                </S.PostLoadingBottom>
              </>
            ) : (
              <>
                <S.PostTop>
                  {postInfo.userImageURL ? (
                    <S.UserImage
                      onClick={viewProfile}
                      src={postInfo.userImageURL}
                    />
                  ) : (
                    <FaceIcon onClick={viewProfile} />
                  )}
                  <S.PostInfo>
                    <S.PostDisplayName onClick={viewProfile}>
                      {postInfo.displayName}
                    </S.PostDisplayName>
                    <S.PostTitle>{postInfo.title}</S.PostTitle>
                  </S.PostInfo>
                </S.PostTop>
                <S.PostMiddle>
                  <Comment
                    userImageURL={postInfo.userImageURL}
                    name={postInfo.displayName}
                    content={postInfo.caption}
                    userImageOption
                    timestamp={postInfo.timestamp}
                    timestampOption
                  />

                  {comments
                    .slice(0, commentsPerPage * currentPage)
                    .map(
                      ({
                        commentId,
                        userImageURL,
                        displayName,
                        comment,
                        timestamp,
                      }) => (
                        <Comment
                          key={commentId}
                          userImageURL={userImageURL}
                          name={displayName}
                          content={comment}
                          userImageOption
                          timestamp={timestamp}
                          timestampOption
                        />
                      )
                    )}
                  {}
                  <S.CommentLoadMoreContainer
                    hide={
                      currentPage ===
                        Math.ceil(comments.length / commentsPerPage) ||
                      Math.ceil(comments.length / commentsPerPage) === 0
                    }
                  >
                    <AddIcon onClick={loadMoreComments} fontSize="middle" />
                  </S.CommentLoadMoreContainer>
                </S.PostMiddle>

                <PostIcons
                  postId={postId}
                  caption={postInfo.caption}
                  displayName={postInfo.displayName}
                  imageURL={postInfo.imageURL}
                  timestamp={postInfo.timestamp}
                  title={postInfo.title}
                  userId={postInfo.userId}
                  userImageURL={postInfo.userImageURL}
                  commentIconDisableOption
                  borderTopOption
                />
                <S.Timestamp>
                  {moment(
                    new Date(postInfo?.timestamp?.toDate()).toUTCString()
                  ).fromNow()}
                </S.Timestamp>
                <CommentSender postId={postId} user={user} />
              </>
            )}
          </S.PostRight>
        </S.PostBox>
      </S.Overlay>
    </>
  );
}

export default Overlay;
