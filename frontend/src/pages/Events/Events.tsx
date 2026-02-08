import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '@api/eventService';
import { tokenUtils } from '@utils/tokenUtils';
import { ErrorDisplay } from '@components/ErrorDisplay';
import type { Event } from '../../types';
import styles from './Events.module.scss';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeSoftDeleted, setIncludeSoftDeleted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);

  // Проверка авторизации при загрузке
  useEffect(() => {
    if (!tokenUtils.isAuthenticated()) {
      setIsAuthorized(false);
      navigate('/login');
    }
  }, []);

  // Загрузка мероприятий
  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAllEvents({
          includeSoftDeleted,
        });
        setEvents(data);
        setError(null);
      } catch (err: any) {
        // Handle 401 - token expired or invalid
        if (err.response?.status === 401) {
          tokenUtils.logout();
          setTokenExpired(true);
          return;
        }

        const message =
          err.response?.data?.message ||
          err.message ||
          'Ошибка при загрузке мероприятий';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [includeSoftDeleted, isAuthorized]);

  const handleToggleSoftDeleted = () => {
    setIncludeSoftDeleted(!includeSoftDeleted);
  };

  const getEventStatus = (event: Event) => {
    if (event.deletedAt) {
      return 'УДАЛЕНО';
    }
    return 'АКТИВНО';
  };

  return (
    <div className={styles.container}>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />

      {tokenExpired && (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          textAlign: 'center' as const,
        }}>
          <p>Сессия истекла. Пожалуйста, авторизуйтесь заново.</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Вернуться на логин
          </button>
        </div>
      )}

      <div className={styles.header}>
        <h1>Мероприятия</h1>
        <div className={styles.controls}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={includeSoftDeleted}
              onChange={handleToggleSoftDeleted}
            />
            <span>Показать удаленные мероприятия</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : events.length === 0 ? (
        <div className={styles.empty}>
          <p>
            {includeSoftDeleted
              ? 'Нет мероприятий'
              : 'Активных мероприятий не найдено'}
          </p>
        </div>
      ) : (
        <div className={styles.eventsList}>
          {events.map((event) => (
            <div
              key={event.id}
              className={`${styles.eventCard} ${
                event.deletedAt ? styles.deleted : ''
              }`}
            >
              <div className={styles.cardHeader}>
                <h3>{event.title}</h3>
                <span className={styles.status}>{getEventStatus(event)}</span>
              </div>

              <div className={styles.cardContent}>
                <p className={styles.description}>{event.description}</p>

                <div className={styles.details}>
                  <div className={styles.detail}>
                    <span className={styles.label}>📅 Дата:</span>
                    <span>{new Date(event.date).toLocaleDateString('ru-RU')}</span>
                  </div>

                  <div className={styles.detail}>
                    <span className={styles.label}>👤 Организатор ID:</span>
                    <span>{event.createdBy}</span>
                  </div>

                  {event.deletedAt && (
                    <div className={styles.detail}>
                      <span className={styles.label}>🗑️ Удалено:</span>
                      <span>
                        {new Date(event.deletedAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
