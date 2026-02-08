import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { loginUser, clearError } from '@features/auth/authSlice';
import { ErrorDisplay } from '@components/ErrorDisplay';
import styles from './Login.module.scss';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, isError, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/events');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    if (!email || !password) {
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className={styles.container}>
      {isError && <ErrorDisplay error={error} onDismiss={() => dispatch(clearError())} />}
      <div className={styles.card}>
        <h1>Вход в систему</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Загрузка...' : 'Вход'}
          </button>
        </form>
        <p className={styles.footer}>
          Нет аккаунта?{' '}
          <a onClick={() => navigate('/register')} className={styles.link}>
            Зарегистрируйся
          </a>
        </p>
      </div>
    </div>
  );
};
