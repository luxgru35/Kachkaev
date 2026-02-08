import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenUtils } from '@utils/tokenUtils';
import styles from './Home.module.scss';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = tokenUtils.getUser();
  const isAuthenticated = tokenUtils.isAuthenticated();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>📅 Добро пожаловать в EventApp</h1>
        <p>Платформа для управления и организации мероприятий</p>

        {isAuthenticated && user ? (
          <div className={styles.authenticatedContent}>
            <p className={styles.greeting}>Привет, {user.name}! 👋</p>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate('/events')}
            >
              Перейти к мероприятиям
            </button>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate('/login')}
            >
              Вход
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => navigate('/register')}
            >
              Регистрация
            </button>
          </div>
        )}
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.icon}>🎯</div>
          <h3>Организуй мероприятия</h3>
          <p>Создавай и управляй своими событиями с удобным интерфейсом</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.icon}>👥</div>
          <h3>Свободный доступ</h3>
          <p>Просматривай и участвуй в мероприятиях других пользователей</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.icon}>📝</div>
          <h3>Полная информация</h3>
          <p>Получай все необходимые детали о каждом событии</p>
        </div>
      </div>
    </div>
  );
};
