import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { registerUser, clearError } from '@features/auth/authSlice';
import { ErrorDisplay } from '@components/ErrorDisplay';
import styles from './Register.module.scss';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, isError, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [name, setName] = useState('');
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

    if (!name || !email || !password) {
      return;
    }

    dispatch(registerUser({ email, password, name }));
  };

  return (
    <div className={styles.container}>
      {isError && <ErrorDisplay error={error} onDismiss={() => dispatch(clearError())} />}
      <div className={styles.card}>
        <h1>Регистрация</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Имя</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
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
            {isLoading ? 'Загрузка...' : 'Регистрация'}
          </button>
        </form>
        <p className={styles.footer}>
          Уже есть аккаунт?{' '}
          <a onClick={() => navigate('/login')} className={styles.link}>
            Войти в систему
          </a>
        </p>
      </div>
    </div>
  );
};
