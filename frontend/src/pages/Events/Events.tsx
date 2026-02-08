import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { fetchEvents, clearError, setSoftDeleteFilter } from '@features/events/eventsSlice';
import { openModal } from '@features/ui/uiSlice';
import { EventCard } from '@components/EventCard/EventCard';
import { ErrorDisplay } from '@components/ErrorDisplay';
import styles from './Events.module.scss';

export const EventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, isLoading, isError, error, includeSoftDeleted } = useAppSelector(
    (state) => state.events
  );

  useEffect(() => {
    dispatch(fetchEvents({ page: 1, includeSoftDeleted }));
  }, [dispatch, includeSoftDeleted]);

  const handleCreateEvent = () => {
    dispatch(openModal({ type: 'create' }));
  };

  const handleToggleSoftDeleted = () => {
    dispatch(setSoftDeleteFilter(!includeSoftDeleted));
  };

  return (
    <div className={styles.container}>
      {isError && (
        <ErrorDisplay
          error={error || 'Что-то пошло не так'}
          onDismiss={() => dispatch(clearError())}
        />
      )}

      <div className={styles.header}>
        <h1>Мероприятия</h1>
        <button className={styles.createBtn} onClick={handleCreateEvent} disabled={isLoading}>
          + Создать мероприятие
        </button>
      </div>

      <div className={styles.filters}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={includeSoftDeleted}
            onChange={handleToggleSoftDeleted}
            disabled={isLoading}
          />
          <span>Показать удаленные мероприятия</span>
        </label>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <p>Загрузка мероприятий...</p>
        </div>
      ) : events.length === 0 ? (
        <div className={styles.empty}>
          <p>Нет мероприятий</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} isLoading={isLoading} />
          ))}
        </div>
      )}
    </div>
  );
};
