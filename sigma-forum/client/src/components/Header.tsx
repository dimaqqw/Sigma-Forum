import { FC, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAdmin, useAuth } from '../hooks/useAuth';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/user/userSlice';
import { removeTokenFromLocalStorage } from '../helpers/localstorage.helper';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import img from '../assets/logo.svg';

interface HeaderProps {
  onSearch: (query: string) => void;
  isDisplay: boolean;
}

const Header: FC<HeaderProps> = ({ onSearch, isDisplay }) => {
  const isAuth = useAuth();
  const isAdmin = useAdmin();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const logoutHandler = () => {
    dispatch(logout());
    removeTokenFromLocalStorage('token');
    toast.success('You logged out');
    navigate('/');
  };

  return (
    <header className="flex items-center bg-zinc-700 px-4 py-2 shadow-sm backdrop-blur-sm">
      <Link to="/">
        <img className=" w-[120px]" src={img} alt="" />
      </Link>

      {/* Search */}
      {isDisplay && (
        <div className="ml-auto mr-10 flex">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input h-10 rounded border p-2 placeholder:text-white"
          />
          <Button onClick={handleSearch} variant="outlined" color="primary">
            Search
          </Button>
        </div>
      )}

      {/* Menu */}
      {isAuth && (
        <nav className="ml-auto mr-10">
          <ul className="flex items-center gap-5">
            <li>
              <NavLink
                to={'/new-post'}
                className={({ isActive }) =>
                  isActive ? 'text-white' : 'text-white/50'
                }
              >
                <Button variant="outlined" color="primary">
                  Create Post
                </Button>
              </NavLink>
            </li>
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

            {isAdmin && (
              <li>
                <NavLink
                  to={'/admin-dashboard'}
                  className={({ isActive }) =>
                    isActive ? 'text-white' : 'text-white/50'
                  }
                >
                  <Button variant="outlined" color="primary">
                    Admin Action
                  </Button>
                </NavLink>
              </li>
            )}
            {/* <li>
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
            </li> */}
          </ul>
        </nav>
      )}

      {/* Actions */}
      {isAuth ? (
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
