import React from 'react';
import styled from 'styled-components';
import InstagramIcon from '@material-ui/icons/Instagram';

const S = {
  Loader: styled.div`
    background-color: white;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: 999;
  `,
};

function RefreshLoader() {
  return (
    <S.Loader>
      <InstagramIcon fontSize="large" color="secondary" />
    </S.Loader>
  );
}

export default RefreshLoader;
