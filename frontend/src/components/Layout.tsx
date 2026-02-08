import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokenUtils } from '@utils/tokenUtils';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = tokenUtils.getUser();

  const handleLogout = () => {
    tokenUtils.logout();
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
            {!isAuthPage && user && (
              <>
                <button
                  onClick={() => navigate('/events')}
                  className={location.pathname === '/events' ? styles.active : ''}
                >
                  Мероприятия
                </button>
                <span className={styles.userInfo}>{user.name}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Выход
                </button>
              </>
            )}
            {!isAuthPage && !user && (
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
