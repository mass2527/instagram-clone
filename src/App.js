import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Switch, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import { auth } from './firebase/firebase';
import { signIn, signOut } from './features/userSlice';
import { useDispatch } from 'react-redux';
import Profile from './pages/Profile';
import Home from './pages/Home';
import DM from './pages/DM';

export const S = {
  App: styled.div`
    background-color: rgb(250, 250, 250);
    min-height: 100vh;
  `,

  AppBody: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
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
      } else {
        dispatch(signOut());
      }
    });
    // eslint-disable-next-line
  }, []);

  return (
    <S.App>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/p/:postId/" component={location.state?.userName ? Profile : Home} />
        <Route exact path="/direct/:state/" component={DM} />
        <Route exact path="/:userName/" component={Profile} />
        <Route exact path="/:userName/:option/" component={Profile} />
        <Route path="/" component={Home} />
      </Switch>
    </S.App>
  );
}

export default App;
