import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@api/authService';
import { tokenUtils } from '@utils/tokenUtils';
import { ErrorDisplay } from '@components/ErrorDisplay';
import styles from './Login.module.scss';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
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
      const response = await authService.login(email, password);
      tokenUtils.setToken(response.token);
      tokenUtils.setUser(response.user);
      navigate('/events');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Ошибка при входе в систему';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
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
            {loading ? 'Загрузка...' : 'Вход'}
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
