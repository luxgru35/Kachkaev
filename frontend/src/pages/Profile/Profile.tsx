import React from 'react';
import { useAppSelector } from '@app/hooks';
import styles from './Profile.module.scss';

export const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <div className={styles.container}>Пользователь не найден</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h1>Мой профиль</h1>
        <div className={styles.profileInfo}>
          <div className={styles.infoItem}>
            <label>Имя:</label>
            <span>{user.name}</span>
          </div>
          <div className={styles.infoItem}>
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h2>Мои мероприятия</h2>
        <p>Список мероприятий, созданных вами, будет отображаться здесь</p>
      </div>
    </div>
  );
};
