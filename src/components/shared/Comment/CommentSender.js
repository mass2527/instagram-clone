import React, { useState } from 'react';
import styled from 'styled-components';
import db from '../../../firebase/firebase';
import firebase from 'firebase';

const S = {
  CommentSender: styled.div`
    margin-top: 4px;
    border-top: 1px solid lightgrey;
    height: 55px;
  `,

  CommentForm: styled.form`
    height: 100%;
    display: flex;
    align-items: center;
  `,

  CommentInput: styled.input`
    flex: 1;
    border: none;
    padding-left: 16px;
    :focus {
      outline: none;
    }

    ::placeholder {
      color: #bfbfbf;
    }
  `,

  CommentButton: styled.button`
    color: ${(props) => (props.disabled ? '#cdeafd' : '#0396f6')};
    cursor: ${(props) => !props.disabled && 'pointer'};
    border: none;
    font-weight: bold;
    background-color: transparent;
    padding-right: 16px;
    :focus {
      outline: none;
    }
  `,
};

function CommentSender({ postId, user }) {
  const [comment, setComment] = useState('');

  function sendComment(e) {
    e.preventDefault();

    db.collection('posts').doc(postId).collection('comments').add({
      userImageURL: user.userImageURL,
      displayName: user.displayName,
      comment: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userId: user.userId,
    });

    setComment('');
  }

  return (
    <S.CommentSender>
      <S.CommentForm>
        <S.CommentInput
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          maxLength={500}
          placeholder="Add a comment..."
          type="text"
        />
        <S.CommentButton onClick={sendComment} disabled={comment.length === 0 || !user}>
          Post
        </S.CommentButton>
      </S.CommentForm>
    </S.CommentSender>
  );
}

export default CommentSender;
