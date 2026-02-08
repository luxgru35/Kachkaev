import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { closeModal } from '@features/ui/uiSlice';
import { createEvent, updateEvent } from '@features/events/eventsSlice';
import type { Event } from '@features/events/eventsSlice';
import styles from './EventFormModal.module.scss';

interface EventFormData {
  title: string;
  description: string;
  date: string;
}

export const EventFormModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isModalOpen, modalType, selectedEventId } = useAppSelector((state) => state.ui);
  const { isLoading } = useAppSelector((state) => state.events);
  const events = useAppSelector((state) => state.events.events);
  
  const selectedEvent = selectedEventId 
    ? events.find((e) => e.id === selectedEventId)
    : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<EventFormData>({
    defaultValues: modalType === 'edit' && selectedEvent
      ? {
          title: selectedEvent.title,
          description: selectedEvent.description,
          date: selectedEvent.date.split('T')[0],
        }
      : {
          title: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        },
  });

  const date = watch('date');
  const minDate = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: EventFormData) => {
    if (modalType === 'create') {
      dispatch(
        createEvent({
          title: data.title,
          description: data.description,
          date: new Date(data.date).toISOString(),
        })
      );
    } else if (modalType === 'edit' && selectedEvent) {
      dispatch(
        updateEvent({
          id: selectedEvent.id,
          eventData: {
            title: data.title,
            description: data.description,
            date: new Date(data.date).toISOString(),
          },
        })
      );
    }

    reset();
    dispatch(closeModal());
  };

  useEffect(() => {
    if (modalType === 'edit' && selectedEvent) {
      reset({
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: selectedEvent.date.split('T')[0],
      });
    } else if (modalType === 'create') {
      reset({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [modalType, selectedEvent, reset]);

  if (!isModalOpen || !modalType || (modalType !== 'create' && modalType !== 'edit')) {
    return null;
  }

  const titleText = modalType === 'create' ? 'Создать мероприятие' : 'Редактировать мероприятие';

  return (
    <div className={styles.overlay} onClick={() => dispatch(closeModal())}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{titleText}</h2>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch(closeModal())}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Название *</label>
            <input
              id="title"
              type="text"
              placeholder="Введите название мероприятия"
              {...register('title', {
                required: 'Название обязательно',
                minLength: { value: 3, message: 'Минимум 3 символа' },
                maxLength: { value: 100, message: 'Максимум 100 символов' },
              })}
              disabled={isLoading}
            />
            {errors.title && <span className={styles.error}>{errors.title.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Описание *</label>
            <textarea
              id="description"
              placeholder="Введите описание мероприятия"
              rows={4}
              {...register('description', {
                required: 'Описание обязательно',
                minLength: { value: 10, message: 'Минимум 10 символов' },
                maxLength: { value: 500, message: 'Максимум 500 символов' },
              })}
              disabled={isLoading}
            />
            {errors.description && <span className={styles.error}>{errors.description.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Дата *</label>
            <input
              id="date"
              type="date"
              min={minDate}
              {...register('date', {
                required: 'Дата обязательна',
                validate: (value) => {
                  const selected = new Date(value).getTime();
                  const today = new Date(minDate).getTime();
                  return selected >= today || 'Дата не может быть раньше сегодня';
                },
              })}
              disabled={isLoading}
            />
            {errors.date && <span className={styles.error}>{errors.date.message}</span>}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              disabled={isLoading}
              className={styles.cancelBtn}
            >
              Отменить
            </button>
            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? 'Загрузка...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
