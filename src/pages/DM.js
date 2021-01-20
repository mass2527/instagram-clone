import React from 'react';
import { useParams } from 'react-router-dom';
import { S } from '../App';
import Header from '../components/layout/Header/Header';
import Message from '../components/layout/Message/Message';
import MessageModal from '../components/shared/Modal/MessageModal';

function DM() {
  const { state } = useParams();

  return (
    <>
      <Header />
      <S.AppBody>
        <Message />
      </S.AppBody>
      {state === 'new' && <MessageModal />}
    </>
  );
}

export default DM;
