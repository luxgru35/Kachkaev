import React, { useState, useEffect } from 'react';
import styles from './ErrorDisplay.module.scss';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onDismiss]);

  if (!error || !isVisible) return null;

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h3>Ошибка</h3>
        <p>{error}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
