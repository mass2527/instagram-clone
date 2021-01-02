import React, { useEffect } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Feed from './components/Feed';
import { Switch, Route, useLocation } from 'react-router-dom';
import Login from './Route/Login';
import { auth } from './firebase/firebase';
import { signIn, signOut } from './features/userSlice';
import { useDispatch } from 'react-redux';
import Overlay from './components/Overlay';
import Profile from './components/Profile';

const S = {
  App: styled.div`
    background-color: rgb(250, 250, 250);
    min-height: 100vh;
  `,

  AppBody: styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;
    /* padding-top: 30px; */
  `,
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        dispatch(
          signIn({
            displayName: currentUser.displayName,
            email: currentUser.email,
            userId: currentUser.uid,
            userImageURL: currentUser.photoURL,
          })
        );
        console.log(currentUser);
      } else {
        dispatch(signOut());
      }
    });
  }, []);

  return (
    <S.App>
      {console.log(location.state?.userName)}

      <Switch>
        <Route exact path="/login">
          <S.AppBody>
            <Login />
          </S.AppBody>
        </Route>

        <Route exact path="/p/:postId/">
          <Header />
          <S.AppBody>
            {location.state?.userName ? <Profile /> : <Feed />}
            <Overlay />
          </S.AppBody>
        </Route>

        <Route exact path="/:userName/">
          <Header />
          <S.AppBody>
            <Profile />
          </S.AppBody>
        </Route>

        <Route exact path="/:userName/:option/">
          <Header />
          <S.AppBody>
            <Profile />
          </S.AppBody>
        </Route>

        <Route exact path="/">
          <Header />
          <S.AppBody>
            <Feed />
          </S.AppBody>
        </Route>
      </Switch>
    </S.App>
  );
}

export default App;
