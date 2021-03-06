import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const S = {
  SearchResult: styled.div`
    top: 25px;
    max-height: 200px;
    overflow-y: scroll;
    position: absolute;
    width: 224px;
    background-color: white;
    border: 1px solid lightgray;
  `,

  UserImageAndName: styled.div`
    padding: 8px 14px;
    height: 50px;
    display: flex;
    justify-content: ${({ center }) => center && 'center'};
    align-items: center;
    border-bottom: 1px solid lightgray;
    box-sizing: border-box;
    cursor: pointer;

    :hover {
      background-color: #fafafa;
    }

    :focus {
      outline: 1px solid red;
    }
  `,

  Image: styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid lightgray;
    box-sizing: border-box;
    margin-right: 10px;
  `,

  Name: styled.span`
    color: #262626;
    font-size: 14px;
    font-weight: 500;
  `,
};

function SearchResult({ userList, clearInput }) {
  const history = useHistory();

  useEffect(() => {
    window.addEventListener('click', handleClick);
  }, []);

  function handleClick(e) {}

  return (
    <S.SearchResult>
      {userList.length !== 0 ? (
        userList.map((user) => (
          <S.UserImageAndName
            tabindex="0"
            onClick={() => {
              history.push(`/${user.displayName}/`, {
                userName: user.displayName,
              });
              clearInput();
            }}
          >
            <S.Image
              src={
                user.photoURL
                  ? user.photoURL
                  : 'https://www.voakorea.com/themes/custom/voa/images/Author__Placeholder.png'
              }
              alt={user.displayName}
            />
            <S.Name>{user.displayName}</S.Name>
          </S.UserImageAndName>
        ))
      ) : (
        <S.UserImageAndName center>
          <S.Name>No results</S.Name>
        </S.UserImageAndName>
      )}
    </S.SearchResult>
  );
}

export default SearchResult;
