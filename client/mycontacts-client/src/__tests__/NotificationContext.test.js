import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationProvider, useNotification } from '../context/NotificationContext';

// Composant de test pour utiliser les notifications
const TestComponent = () => {
  const { showSuccess, showError } = useNotification();
  
  return (
    <div>
      <button onClick={() => showSuccess('Success message')}>
        Show Success
      </button>
      <button onClick={() => showError('Error message')}>
        Show Error
      </button>
    </div>
  );
};

describe('NotificationContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should show success notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Success message').closest('.notification'))
      .toHaveClass('success');
  });

  test('should show error notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Error message').closest('.notification'))
      .toHaveClass('error');
  });

  test('should auto-hide notification after timeout', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    
    expect(screen.getByText('Success message')).toBeInTheDocument();

    // Avancer les timers
    jest.advanceTimersByTime(4000); // Duration du timeout
    
    await waitFor(() => {
      expect(screen.getByText('Success message').closest('.notification'))
        .not.toHaveClass('show');
    });

    // Avancer encore pour la suppression complète
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  test('should throw error when useNotification is used outside provider', () => {
    // Supprimer les logs d'erreur de React pour ce test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const TestComponentOutside = () => {
      useNotification();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponentOutside />);
    }).toThrow('useNotification must be used within NotificationProvider');

    consoleSpy.mockRestore();
  });
});