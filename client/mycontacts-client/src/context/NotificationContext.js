import { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success', duration = 4000) => {
    setNotification({ message, type, show: true });
    
    setTimeout(() => {
      setNotification(prev => prev ? { ...prev, show: false } : null);
    }, duration);
    
    setTimeout(() => {
      setNotification(null);
    }, duration + 300);
  };

  const showSuccess = (message) => showNotification(message, 'success');
  const showError = (message) => showNotification(message, 'error');

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
      {notification && (
        <div className={`notification ${notification.type} ${notification.show ? 'show' : ''}`}>
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};