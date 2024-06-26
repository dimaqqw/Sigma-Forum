import { FC, useState } from 'react';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-toastify';
import { setTokenToLocalStorage } from '../helpers/localstorage.helper';
import { useAppDispatch } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/user/userSlice';
import Header from '../components/Header';

const AuthPage: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const dispath = useAppDispatch();
  const navigate = useNavigate();

  const registrationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = await AuthService.registration({
        username,
        email,
        password,
      });
      if (data) {
        toast.success('Account has been created.');
        setIsLogin(!isLogin);
      }
    } catch (error: any) {
      const err = error.response?.data.message;
      toast.error(err.toString());
    }
  };

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!email || !password) {
        toast.error('Email and password are required.');
        return;
      }
      const data = await AuthService.login({
        email,
        password,
      });
      if (data) {
        setTokenToLocalStorage('token', data.token);
        dispath(login(data));
        toast.success('You logged in.');
        navigate('/');
      }
    } catch (error: any) {
      const err = error.response?.data.message;
      toast.error(err.toString());
    }
  };

  return (
    <>
      <Header onSearch={() => {}} isDisplay={false}></Header>
      <div className=" m-auto mt-32 flex w-2/4 flex-col items-center justify-center rounded-3xl bg-zinc-600 pb-8 pt-8 text-white">
        <h1 className="mb-10 text-center text-xl ">
          {!isLogin ? 'Login' : 'Registration'}
        </h1>

        <form
          onSubmit={!isLogin ? loginHandler : registrationHandler}
          className="mx-auto flex w-1/3 flex-col gap-5"
        >
          {isLogin ? (
            <input
              type="text"
              className="input placeholder:text-white "
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          ) : (
            <></>
          )}

          <input
            type="email"
            className="input placeholder:text-white "
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="input placeholder:text-white "
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-green mx-auto">Submit</button>
        </form>

        <div className="mt-5 flex justify-center">
          {!isLogin ? (
            <button
              onClick={() => setIsLogin(!isLogin)}
              className=" text-neutral-300 hover:text-white"
            >
              You don`t have a account?
            </button>
          ) : (
            <button
              onClick={() => setIsLogin(!isLogin)}
              className=" text-neutral-300 hover:text-white"
            >
              Already have an account?
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPage;
