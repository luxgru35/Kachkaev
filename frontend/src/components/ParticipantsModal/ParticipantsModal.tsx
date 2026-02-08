import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { closeModal } from '@features/ui  /uiSlice';
import { eventService } from '@api/eventService';
import styles from './ParticipantsModal.module.scss';

interface Participant {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const ParticipantsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isModalOpen, modalType, selectedEventId } = useAppSelector((state) => state.ui);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen && modalType === 'participants' && selectedEventId) {
      setLoading(true);
      eventService
        .getParticipants(selectedEventId as any)
        .then((data) => {
          setParticipants(data);
        })
        .catch((error) => {
          console.error('Error loading participants:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isModalOpen, modalType, selectedEventId]);

  if (!isModalOpen || modalType !== 'participants') {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={() => dispatch(closeModal())}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Участники ({participants.length})</h2>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch(closeModal())}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <p className={styles.loading}>Загрузка...</p>
          ) : participants.length === 0 ? (
            <p className={styles.empty}>Нет участников</p>
          ) : (
            <div className={styles.list}>
              {participants.map((participant) => (
                <div key={participant.id} className={styles.participant}>
                  <div className={styles.info}>
                    <h3>{participant.user.name}</h3>
                    <p>{participant.user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
