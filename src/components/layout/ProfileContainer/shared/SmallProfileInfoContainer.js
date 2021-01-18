import React from 'react';
import styled from 'styled-components';

const S = {
  SmallProfileInfoContainer: styled.div`
    border-top: 1px solid #dbdbdb;
    height: 36px;
    padding: 12px 0px;
    display: none;
    justify-content: space-between;

    @media (max-width: 735px) {
      display: flex;
    }
  `,

  SmallProfileInfoOption: styled.div`
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #8e8e8e;
    display: flex;
    flex-direction: column;
  `,

  OptionNumber: styled.span`
    color: #262626;
    font-weight: bold;
  `,
};

function SmallProfileInfoContainer({ numberOfPosts }) {
  return (
    <S.SmallProfileInfoContainer>
      <S.SmallProfileInfoOption>
        POST<S.OptionNumber>{numberOfPosts}</S.OptionNumber>
      </S.SmallProfileInfoOption>
      <S.SmallProfileInfoOption>
        FOLLOWER<S.OptionNumber>0</S.OptionNumber>
      </S.SmallProfileInfoOption>
      <S.SmallProfileInfoOption>
        FOLLOW<S.OptionNumber>0</S.OptionNumber>
      </S.SmallProfileInfoOption>
    </S.SmallProfileInfoContainer>
  );
}

export default SmallProfileInfoContainer;
