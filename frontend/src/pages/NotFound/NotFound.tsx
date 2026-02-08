import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.scss';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>404</h1>
        <h2>Страница не найдена</h2>
        <p>К сожалению, запрашиваемая страница не существует</p>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    </div>
  );
};
