import React from 'react';
import Feed from '../components/Feed';
import Header from '../components/Header';
import styled from 'styled-components';

const S = {
  AppBody: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
};

function Home() {
  return (
    <>
      <Header />
      <S.AppBody>
        <Feed />
      </S.AppBody>
    </>
  );
}

export default Home;
