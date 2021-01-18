import React from 'react';
import Feed from '../components/layout/Feed/Feed';
import Header from '../components/layout/Header/Header';
import { S } from '../App';
import Overlay from '../components/layout/Overlay/Overlay';
import { useParams } from 'react-router-dom';

function Home() {
  const { postId } = useParams();

  return (
    <>
      <Header />
      <S.AppBody>
        <Feed />
        {postId && <Overlay />}
      </S.AppBody>
    </>
  );
}

export default Home;
