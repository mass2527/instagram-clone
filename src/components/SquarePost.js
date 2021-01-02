import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import db from '../firebase/firebase';
import { useHistory, useLocation, useParams } from 'react-router-dom';

const S = {
  SquarePost: styled.div`
    width: calc(33.3333333333333333333333% - 18.6666666666666666666666666px);
    max-width: 293px;
    margin-bottom: 28px;
    height: ${(props) => props.height}px;
    position: relative;
    cursor: pointer;

    :not(:nth-child(3n)) {
      margin-right: 28px;
    }

    @media (max-width: 735px) {
      width: calc(33.3333333333333333333333% - 2px);
      margin-bottom: 3px;

      :not(:nth-child(3n)) {
        margin-right: 3px;
      }
    }
  `,

  Post: styled.img`
    width: 100%;
    height: 100%;
    display: block;

    :hover {
    }
  `,

  Loader: styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #efefef;
  `,

  Overlay: styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  IconContainer: styled.div`
    color: white;
    margin: 0px 10px;
    display: flex;
    align-items: center;
    height: 40px;

    > .MuiSvgIcon-root {
      margin-right: 5px;
    }
  `,

  Number: styled.div`
    margin-bottom: 5px;
    font-weight: bold;
  `,
};

function SquarePost({ postId, imageURL, title }) {
  const divRef = useRef(null);
  const imageRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(500);
  const [loading, setLoading] = useState(false);
  const [overlayOption, setOverlayOption] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [numberOfHearts, setNumberOfHearts] = useState(0);
  const currentPost = db.collection('posts').doc(postId);
  const history = useHistory();
  const { userName } = useParams();
  const location = useLocation();

  function clickPost() {
    history.push(`/p/${postId}/`, {
      userName,
      option: location.state.option,
    });
  }

  function handleResize() {
    setImageWidth(divRef?.current?.clientWidth);
  }

  function handleLoad() {
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    setImageWidth(divRef.current.clientWidth);

    currentPost.collection('comments').onSnapshot((snapshot) => {
      setNumberOfComments(snapshot.docs?.length);
    });

    currentPost.collection('hearts').onSnapshot((snapshot) => {
      setNumberOfHearts(snapshot.docs?.length);
    });

    imageRef.current.addEventListener('load', handleLoad);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <S.SquarePost
      onClick={clickPost}
      onMouseEnter={() => setOverlayOption(true)}
      onMouseLeave={() => setOverlayOption(false)}
      height={imageWidth}
      ref={divRef}
    >
      <S.Post ref={imageRef} src={imageURL} alt={title} />
      {loading && <S.Loader></S.Loader>}
      {overlayOption && (
        <S.Overlay>
          <S.IconContainer>
            <FavoriteIcon />
            <S.Number>{numberOfHearts}</S.Number>
          </S.IconContainer>
          <S.IconContainer>
            <ChatBubbleIcon />
            <S.Number>{numberOfComments}</S.Number>
          </S.IconContainer>
        </S.Overlay>
      )}
    </S.SquarePost>
  );
}

export default SquarePost;
