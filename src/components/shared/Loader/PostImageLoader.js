import React from 'react';
import styled, { keyframes } from 'styled-components';

const slide = keyframes`
from {
  transform:translateX(-100%);
}

to{
  transform:translateX(100%);
}
`;

const S = {
  Loader: styled.div`
    width: 100%;
    height: 600px;
    background-color: #efefef;
    z-index: 0;
    position: relative;
    overflow: hidden;

    :after {
      content: '';
      top: 0;
      transform: translateX(100%);

      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
      animation: ${slide} 1s infinite;

      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.8) 50%,
        rgba(128, 186, 232, 0) 99%,
        rgba(125, 185, 232, 0) 100%
      );
    }
  `,
};

function PostImageLoader() {
  return <S.Loader></S.Loader>;
}

export default PostImageLoader;
