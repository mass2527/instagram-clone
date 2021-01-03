import React from 'react';
import styled from 'styled-components';
import SquarePost from './SquarePost';

const S = {
  ProfilePosts: styled.div`
    display: flex;
    flex-wrap: wrap;
  `,
};

function ProfilePosts({ posts }) {
  return (
    <S.ProfilePosts>
      {posts.map(({ id, imageURL, title, displayName }) => (
        <SquarePost
          key={id}
          postId={id}
          imageURL={imageURL}
          title={title}
          displayName={displayName}
        />
      ))}
    </S.ProfilePosts>
  );
}

export default ProfilePosts;
