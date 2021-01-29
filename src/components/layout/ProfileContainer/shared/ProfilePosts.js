import React, { memo } from 'react';
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
      {posts.map(({ id, imageURL, title, displayName }) => {
        return <SquarePost key={id} postId={id} imageURL={imageURL} title={title} displayName={displayName} />;
      })}
    </S.ProfilePosts>
  );
}

export default memo(ProfilePosts);
