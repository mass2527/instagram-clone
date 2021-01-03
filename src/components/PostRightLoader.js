import React from 'react';
import styled from 'styled-components';

const S = {
  LoadingPostRight: styled.div`
    position: absolute;
    width: 335px;
    background-color: white;
    height: 600px;
    display: flex;
    flex-direction: column;

    @media (max-width: 500px) {
      width: 100%;
    }
  `,

  PostTop: styled.div`
    height: 72px;
    padding: 16px;
    box-sizing: border-box;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;

    > .MuiSvgIcon-root {
      width: 32px;
      height: 32px;
      padding: 2px;
      border: 2px solid #d32c83;
      border-radius: 100%;
      cursor: pointer;
    }
  `,

  Circle: styled.div`
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background-color: #efefef;
  `,

  PostInfo: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 15px;
  `,

  Bar: styled.div`
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    margin-top: ${(props) => props.marginTop}px;
    margin-bottom: ${(props) => props.marginBottom}px;
    background-color: #efefef;
  `,

  PostMiddle: styled.div`
    padding-top: 20px;
    overflow-y: scroll;
    flex: 1;
    ::-webkit-scrollbar {
      display: none;
    }
  `,

  PostLoadingBottom: styled.div`
    height: 130px;
    border-top: 1px solid #efefef;
    padding-left: 16px;
  `,
};

function PostRightLoader() {
  return (
    <S.LoadingPostRight>
      <S.PostTop>
        <S.Circle></S.Circle>
        <S.PostInfo>
          <S.Bar width={140} height={10} marginBottom={4} />
          <S.Bar width={100} height={10} marginBottom={0} />
        </S.PostInfo>
      </S.PostTop>
      <S.PostMiddle></S.PostMiddle>
      <S.PostLoadingBottom>
        <S.Bar width={140} height={15} marginTop={20} />
        <S.Bar width={230} height={15} marginTop={10} />
        <S.Bar width={90} height={15} marginTop={10} />
      </S.PostLoadingBottom>
    </S.LoadingPostRight>
  );
}

export default PostRightLoader;
