import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import db, { auth } from '../../../../firebase/firebase';
import FeedRightRow from './FeedRightRow';

const S = {
  FeedRight: styled.div`
    flex: 1;
    height: 578px;
    position: sticky;
    top: 54px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
      display: none;
    }

    @media (max-width: 1000px) {
      display: none;
    }
  `,

  Title: styled.div`
    font-size: 14px;
    color: #8e8e8e;
    padding: 8px 16px;
  `,
};

function FeedRight() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    db.collection('users').onSnapshot((snapshot) => {
      const otherUsers = snapshot.docs.filter((doc) => doc.data().displayName !== auth.currentUser?.displayName);
      setUsers(otherUsers.map((doc) => doc.data()));
    });
  }, []);

  return (
    <S.FeedRight>
      <S.Title>Suggestions For You</S.Title>
      {users.map(({ photoURL, displayName }) => (
        <FeedRightRow key={displayName} photoURL={photoURL} displayName={displayName} />
      ))}
    </S.FeedRight>
  );
}

export default FeedRight;
