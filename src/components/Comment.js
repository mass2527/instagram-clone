import React, { useState } from 'react';
import styled from 'styled-components';
import FaceIcon from '@material-ui/icons/Face';
import moment from 'moment';

const S = {
  Comment: styled.div`
    padding: 0px 16px;
    font-size: 14px;
    color: #262626;
    display: flex;
    margin-bottom: ${(props) => props.marginOption && 15}px;
  `,

  CommentLeft: styled.div`
    width: 40px;
    margin-right: 15px;
    > .MuiSvgIcon-root {
      width: 32px;
      height: 32px;
      padding: 2px;
      border: 2px solid #d32c83;
      border-radius: 100%;
      cursor: pointer;
    }
  `,

  UserImage: styled.img`
    width: 32px;
    height: 32px;
    padding: 2px;
    border: 2px solid #d32c83;
    border-radius: 100%;
    cursor: pointer;
  `,

  CommentRight: styled.div`
    flex: 1;
  `,

  Name: styled.span`
    font-weight: 500;
    color: #444444;

    cursor: pointer;

    :hover {
      text-decoration: underline;
    }
  `,

  Content: styled.span`
    margin-left: 5px;
  `,

  Caption: styled.div`
    margin-bottom: 30px;
  `,

  ViewAll: styled.button`
    border: none;
    background-color: transparent;
    font-weight: 500;
    cursor: pointer;
    color: #8e8e8e;
    :focus {
      outline: none;
    }
  `,

  Timestamp: styled.span`
    font-size: 12px;
    color: #8e8e8e;
  `,
};

function Comment({
  userImageOption,
  userImageURL,
  caption,
  name,
  content,
  timestamp,
  timestampOption,
}) {
  const [viewAll, setViewAll] = useState(false);

  return (
    <S.Comment marginOption={userImageOption}>
      {userImageOption && (
        <S.CommentLeft>
          {userImageURL ? (
            <S.UserImage src={userImageURL} alt="" />
          ) : (
            <FaceIcon />
          )}
        </S.CommentLeft>
      )}

      <S.CommentRight>
        <S.Name>{name}</S.Name>
        <S.Content>
          {content?.length > 100 && !viewAll ? (
            <>
              {content.slice(0, 100).trim() + '...'}
              <S.ViewAll onClick={() => setViewAll(true)}>more</S.ViewAll>
            </>
          ) : (
            content
          )}
        </S.Content>
        {caption && <S.Caption></S.Caption>}
        <br />
        {timestampOption && (
          <S.Timestamp>
            {timestamp
              ? moment(new Date(timestamp?.toDate()).toUTCString())
                  .fromNow()
                  .replace(' ago', '')
              : 'a few seconds'}
          </S.Timestamp>
        )}
      </S.CommentRight>
    </S.Comment>
  );
}

export default Comment;
