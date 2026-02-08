import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logoutUser } from '@features/auth/authSlice';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo} onClick={() => navigate('/')}>
            📅 EventApp
          </div>
          <nav className={styles.nav}>
            {!isAuthPage && isAuthenticated && user && (
              <>
                <button
                  onClick={() => navigate('/events')}
                  className={location.pathname === '/events' ? styles.active : ''}
                >
                  Мероприятия
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className={location.pathname === '/profile' ? styles.active : ''}
                >
                  Профиль
                </button>
                <span className={styles.userInfo}>{user.name}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Выход
                </button>
              </>
            )}
            {!isAuthPage && !isAuthenticated && (
              <>
                <button onClick={() => navigate('/login')}>Вход</button>
                <button
                  onClick={() => navigate('/register')}
                  className={styles.primaryBtn}
                >
                  Регистрация
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2026 EventApp. Все права защищены.</p>
      </footer>
    </div>
  );
};
