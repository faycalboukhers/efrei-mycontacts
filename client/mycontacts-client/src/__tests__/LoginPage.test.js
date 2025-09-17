import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthContext } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import api from '../api/axios';

// Mock de l'API
jest.mock('../api/axios');

// Wrapper avec tous les providers nécessaires
const TestWrapper = ({ children, authValue }) => (
  <BrowserRouter>
    <AuthContext.Provider value={authValue}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthContext.Provider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const authContextValue = {
    token: null,
    login: mockLogin,
    logout: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render login form', () => {
    render(
      <TestWrapper authValue={authContextValue}>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/adresse email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  test('should handle successful login', async () => {
    const mockResponse = {
      data: { token: 'fake-token', message: 'Connexion réussie' }
    };
    api.post.mockResolvedValue(mockResponse);

    render(
      <TestWrapper authValue={authContextValue}>
        <LoginPage />
      </TestWrapper>
    );

    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText(/adresse email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
      target: { value: 'password123' }
    });

    // Soumettre
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockLogin).toHaveBeenCalledWith('fake-token');
    });
  });

  test('should handle login error', async () => {
    const mockError = {
      response: { data: { error: 'Mot de passe incorrect' } }
    };
    api.post.mockRejectedValue(mockError);

    render(
      <TestWrapper authValue={authContextValue}>
        <LoginPage />
      </TestWrapper>
    );

    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText(/adresse email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
      target: { value: 'wrongpassword' }
    });

    // Soumettre
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  test('should show loading state during login', async () => {
    api.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <TestWrapper authValue={authContextValue}>
        <LoginPage />
      </TestWrapper>
    );

    fireEvent.change(screen.getByPlaceholderText(/adresse email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(screen.getByText(/connexion.../i)).toBeInTheDocument();
  });
});