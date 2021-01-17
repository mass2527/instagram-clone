import React from 'react';
import Feed from '../components/Feed';
import Header from '../components/Header';
import { S } from '../App';
import Overlay from '../components/Overlay';
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
