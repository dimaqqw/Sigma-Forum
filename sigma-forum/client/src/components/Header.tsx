import { FC } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/user/userSlice';
import { removeTokenFromLocalStorage } from '../helpers/localstorage.helpet';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';

const Header: FC = () => {
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    removeTokenFromLocalStorage('token');
    toast.success('You logged out');
    navigate('/');
  };

  return (
    <header className="flex items-center bg-slate-800 px-4 py-2 shadow-sm backdrop-blur-sm">
      <Link to="/">
        <div className=" text-stone-200">LOGO</div>
      </Link>

      {/* Menu */}
      {isAuth && (
        <nav className="ml-auto mr-10">
          <ul className="flex items-center gap-5">
            <li>
              <NavLink
                to={'/'}
                className={({ isActive }) =>
                  isActive ? 'text-white' : 'text-white/50'
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={'/posts'}
                className={({ isActive }) =>
                  isActive ? 'text-white' : 'text-white/50'
                }
              >
                Posts
              </NavLink>
            </li>
            <li>
              <NavLink
                to={'/topics'}
                className={({ isActive }) =>
                  isActive ? 'text-white' : 'text-white/50'
                }
              >
                Topics
              </NavLink>
            </li>
            <li>
              <NavLink
                to={'/comments'}
                className={({ isActive }) =>
                  isActive ? 'text-white' : 'text-white/50'
                }
              >
                Comments
              </NavLink>
            </li>
          </ul>
        </nav>
      )}

      {/* Actions */}
      {isAuth ? (
        // <button onClick={logoutHandler} className="btn btn-red">
        //   <span>log out</span>
        // </button>
        <Button onClick={logoutHandler} variant="outlined" color="error">
          Log out
        </Button>
      ) : (
        <Link
          className="ml-auto py-2 text-white/50 hover:text-white"
          to={'auth'}
        >
          <Button variant="outlined">Log In</Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
