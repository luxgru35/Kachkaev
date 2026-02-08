import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@api/authService';
import { tokenUtils } from '@utils/tokenUtils';
import { ErrorDisplay } from '@components/ErrorDisplay';
import styles from './Register.module.scss';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Редирект если уже авторизован
  useEffect(() => {
    if (tokenUtils.isAuthenticated()) {
      navigate('/events');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.register(name, email, password);
      navigate('/login');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Ошибка при регистрации';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Загрузка...' : 'Регистрация'}
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
