import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../context/AuthContext';

// Composant de test pour utiliser le contexte
const TestComponent = () => {
  const { token, login, logout } = React.useContext(AuthContext);
  
  return (
    <div>
      <div data-testid="token">{token || 'no-token'}</div>
      <button onClick={() => login('test-token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    window.localStorage.clear.mockClear();
    window.localStorage.getItem.mockClear();
    window.localStorage.setItem.mockClear();
    window.localStorage.removeItem.mockClear();
  });

  test('should provide initial token from localStorage', () => {
    window.localStorage.getItem.mockReturnValue('stored-token');
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    expect(window.localStorage.getItem).toHaveBeenCalledWith('token');
  });

  test('should provide null token when localStorage is empty', () => {
    window.localStorage.getItem.mockReturnValue(null);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('no-token');
  });

  test('should login and store token', () => {
    window.localStorage.getItem.mockReturnValue(null);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('no-token');

    fireEvent.click(screen.getByText('Login'));

    expect(screen.getByTestId('token')).toHaveTextContent('test-token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
  });

  test('should logout and remove token', () => {
    window.localStorage.getItem.mockReturnValue('stored-token');
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');

    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('token')).toHaveTextContent('no-token');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});