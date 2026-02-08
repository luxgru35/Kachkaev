import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { fetchUserEvents } from '@features/events/eventsSlice';
import { EventCard } from '@components/EventCard/EventCard';
import styles from './Profile.module.scss';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userEvents, isUserEventsLoading } = useAppSelector((state) => state.events);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserEvents(user.id));
    }
  }, [dispatch, user?.id]);

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
        {isUserEventsLoading ? (
          <p>Загрузка...</p>
        ) : userEvents.length === 0 ? (
          <p>Нет созданных мероприятий</p>
        ) : (
          <div className={styles.eventsGrid}>
            {userEvents.map((event) => (
              <EventCard key={event.id} event={event} isLoading={isUserEventsLoading} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
