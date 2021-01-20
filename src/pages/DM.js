import React from 'react';
import { useParams } from 'react-router-dom';
import { S } from '../App';
import Header from '../components/layout/Header/Header';
import MessageHome from '../components/layout/Message/MessageHome';
import MessageModal from '../components/shared/Modal/MessageModal';

function DM() {
  const { state } = useParams();

  return (
    <>
      <Header />

      <S.AppBody>
        <MessageHome />
      </S.AppBody>
      {state === 'new' && <MessageModal />}
    </>
  );
}

export default DM;
