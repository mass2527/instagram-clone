import React, { memo, useState } from 'react';
import styled from 'styled-components';
import FollowingModal from '../../../shared/Dialog/FollowingModal';
import FollowerModal from '../../../shared/Dialog/FollowerModal';

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
    cursor: ${({ pointer }) => pointer && 'pointer'};
  `,

  OptionNumber: styled.span`
    color: #262626;
    font-weight: bold;
  `,
};

function SmallProfileInfoContainer({ numberOfPosts, numberOfFollower, numberOfFollow }) {
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [openFollowerModal, setOpenFollowerModal] = useState(false);

  return (
    <S.SmallProfileInfoContainer>
      <S.SmallProfileInfoOption>
        POST<S.OptionNumber>{numberOfPosts}</S.OptionNumber>
      </S.SmallProfileInfoOption>

      <S.SmallProfileInfoOption onClick={() => setOpenFollowerModal(true)} pointer={true}>
        FOLLOWER<S.OptionNumber>{numberOfFollower}</S.OptionNumber>
      </S.SmallProfileInfoOption>

      <S.SmallProfileInfoOption onClick={() => setOpenFollowingModal(true)} pointer={true}>
        FOLLOW<S.OptionNumber>{numberOfFollow}</S.OptionNumber>
      </S.SmallProfileInfoOption>

      {openFollowingModal && <FollowingModal reset={() => setOpenFollowingModal(false)} />}
      {openFollowerModal && <FollowerModal reset={() => setOpenFollowerModal(false)} />}
    </S.SmallProfileInfoContainer>
  );
}

export default memo(SmallProfileInfoContainer);
