import React from 'react';
import { useAppDispatch } from '@app/hooks';
import { joinEvent } from '@features/events/eventsSlice';
import { openModal } from '@features/ui/uiSlice';
import type { Event } from '@features/events/eventsSlice';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: Event;
  isLoading: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isLoading }) => {
  const dispatch = useAppDispatch();
  const date = new Date(event.date);
  const isDeleted = !!event.deletedAt;

  const handleJoin = () => {
    dispatch(joinEvent(event.id));
  };

  const handleShowParticipants = () => {
    dispatch(openModal({ type: 'participants', eventId: event.id }));
  };

  const handleEdit = () => {
    dispatch(openModal({ type: 'edit', eventId: event.id }));
  };

  return (
    <div className={`${styles.card} ${isDeleted ? styles.deleted : ''}`}>
      {isDeleted && <div className={styles.deletedBadge}>УДАЛЕНО</div>}
      
      <div className={styles.header}>
        <h3>{event.title}</h3>
        <div className={styles.date}>
          {date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      <p className={styles.description}>{event.description}</p>

      <div className={styles.meta}>
        {isDeleted && event.deletedAt && (
          <span className={styles.deletedDate}>
            Удалено: {new Date(event.deletedAt).toLocaleDateString('ru-RU')}
          </span>
        )}
      </div>

      <div className={styles.creator}>
        <span>Организатор: {event.createdByName}</span>
      </div>

      <div className={styles.participants}>
        <button
          className={styles.participantCount}
          onClick={handleShowParticipants}
          disabled={isLoading}
          title="Показать участников"
        >
          👥 {event.participantsCount || 0}
        </button>
      </div>

      <div className={styles.actions}>
        {event.isCreatedByUser ? (
          <button
            className={styles.editBtn}
            onClick={handleEdit}
            disabled={isLoading || isDeleted}
            title="Редактировать мероприятие"
          >
            ✏️ Редактировать
          </button>
        ) : (
          !isDeleted && (
            <button
              className={`${styles.joinBtn} ${event.isUserParticipant ? styles.joined : ''}`}
              onClick={handleJoin}
              disabled={isLoading || event.isUserParticipant}
              title={
                event.isUserParticipant
                  ? 'Вы уже зарегистрированы'
                  : 'Зарегистрироваться на мероприятие'
              }
            >
              {event.isUserParticipant ? '✓ Зарегистрирован' : 'Участвовать'}
            </button>
          )
        )}
      </div>
    </div>
  );
};
