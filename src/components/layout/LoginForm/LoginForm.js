import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import db, { auth } from '../../../firebase/firebase';
import { useHistory } from 'react-router-dom';
import { Spin } from '../../../utils/util';

const S = {
  LoginForm: styled.div`
    display: grid;
    place-items: center;
    width: 100%;
    flex: 1;
    height: 100vh;
  `,

  LoginBox: styled.div`
    width: 350px;
    height: 380px;
    border: 1px solid lightgrey;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  Form: styled.form`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  `,

  Logo: styled.img`
    margin-top: 30px;
  `,

  LoginInput: styled.input`
    margin-top: 15px;
    width: 250px;
    height: 36px;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid lightgrey;
    background-color: #fafafa;

    :focus {
      outline: none;
    }
  `,

  LoginButton: styled.button`
    background-color: ${(props) => (props.disabled ? '#b2dffc' : '#0095f6')};
    cursor: ${(props) => (props.disabled ? '' : 'pointer')};
    border: none;
    border-radius: 3px;
    margin-top: 10px;
    padding: 5px;
    color: #ffffff;

    :focus {
      outline: none;
    }
  `,

  Loader: styled.img`
    width: 12px;
    height: 12px;
    animation: ${Spin} 3s infinite linear;
  `,

  ErrorMessage: styled.strong`
    width: 80%;
    text-align: center;
  `,
};

function LoginForm() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState('');
  const history = useHistory();
  const usersCollection = db.collection('users');

  useEffect(() => {
    usersCollection.onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
  }, []);

  function startProcess(processName) {
    setClicked(`${processName}`);
    setLoading(true);
  }

  function handleError(error) {
    setError(error.message);
    setLoading(false);
  }

  async function signUp(e) {
    e.preventDefault();
    startProcess('signUp');

    try {
      if (users?.some((user) => user.displayName === name)) {
        setName('');
        setLoading(false);
        setClicked('');
        throw new Error('name already exist');
      }

      const {
        user: { email: userEmail, uid, photoURL },
      } = await auth.createUserWithEmailAndPassword(email, password);

      await auth.currentUser.updateProfile({
        displayName: name,
        photoURL: '',
      });

      await usersCollection.doc(name).set({
        displayName: name,
        email: userEmail,
        uid,
        photoURL,
      });

      history.replace('/');
    } catch (error) {
      handleError(error);
    }
  }

  async function login(e) {
    e.preventDefault();
    startProcess('login');

    try {
      await auth.signInWithEmailAndPassword(email, password);
      history.replace('/');
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <S.LoginForm>
      {/* {setInterval(() => {
        console.log(users);
      }, 1000)} */}
      <S.LoginBox>
        <S.Logo
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.pngs"
          alt="instagram"
        />

        <S.Form>
          <S.LoginInput
            onChange={(e) => {
              setName(e.target.value);
              if (name.includes(' ')) {
                setError('name can not include space');
              } else {
                setError('');
              }
            }}
            maxLength={12}
            value={name}
            type="text"
            placeholder="name"
          />
          <S.LoginInput
            onChange={(e) => setEmail(e.target.value)}
            maxLength={25}
            value={email}
            type="email"
            placeholder="email"
          />
          <S.LoginInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            minLength={6}
            maxLength={15}
            type="password"
            placeholder="password"
          />
          <S.LoginButton disabled={password.length < 6 || !email || name.length !== 0} onClick={login}>
            {loading && clicked === 'login' ? (
              <S.Loader
                src="https://img2.pngio.com/loader-png-transparent-loaderpng-images-pluspng-loader-png-504_504.png"
                alt=""
              />
            ) : (
              <>Login</>
            )}
          </S.LoginButton>
          <S.LoginButton
            disabled={password.length < 6 || name.length < 5 || !email || name.includes(' ')}
            onClick={signUp}
          >
            {loading && clicked === 'signUp' ? (
              <S.Loader
                src="https://img2.pngio.com/loader-png-transparent-loaderpng-images-pluspng-loader-png-504_504.png"
                alt=""
              />
            ) : (
              <>Sign Up</>
            )}
          </S.LoginButton>
        </S.Form>
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
      </S.LoginBox>
    </S.LoginForm>
  );
}

export default LoginForm;
