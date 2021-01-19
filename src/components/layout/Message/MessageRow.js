import React from 'react';
import styled from 'styled-components';

const S = {
  MessageRow: styled.div`
    height: 72px;
    padding: 8px 16px;
    box-sizing: border-box;
    display: flex;
  `,

  RowLeft: styled.div`
    width: 56px;
  `,

  Circle: styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #efefef;
  `,

  RowRight: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 12px;
    padding: 8px 0px;
  `,

  RowBar: styled.div`
    height: 14px;
    background-color: #efefef;
    border-radius: 3px;
    width: ${({ width }) => width}px;
  `,
};

function MessageRow() {
  return (
    <S.MessageRow>
      <S.RowLeft>
        <S.Circle />
      </S.RowLeft>
      <S.RowRight>
        <S.RowBar width={116} />
        <S.RowBar width={84} />
      </S.RowRight>
    </S.MessageRow>
  );
}

export default MessageRow;
