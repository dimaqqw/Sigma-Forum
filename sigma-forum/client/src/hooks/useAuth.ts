import { useAppSelector } from '../store/hooks';

export const useAuth = () => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  return isAuth;
};

export const useAdmin = () => {
  const isAdminStored = localStorage.getItem('isAdmin');
  const isAdminRedux = useAppSelector((state) => state.user.isAdmin);

  // Проверяем, есть ли сохраненное значение в localStorage.
  // Если есть, возвращаем его, иначе возвращаем значение из Redux-состояния.
  const isAdmin = isAdminStored ? JSON.parse(isAdminStored) : isAdminRedux;

  return isAdmin;
};
