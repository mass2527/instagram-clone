import React from 'react';
import { S } from '../App';
import Header from '../components/layout/Header/Header';
import Message from '../components/layout/Message/Message';

function DM() {
  return (
    <>
      <Header />
      <S.AppBody>
        <Message />
      </S.AppBody>
    </>
  );
}

export default DM;
