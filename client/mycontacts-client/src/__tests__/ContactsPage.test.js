import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactsPage from '../pages/ContactsPage';
import { AuthContext } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import api from '../api/axios';

jest.mock('../api/axios');

const TestWrapper = ({ children, authValue }) => (
  <AuthContext.Provider value={authValue}>
    <NotificationProvider>
      {children}
    </NotificationProvider>
  </AuthContext.Provider>
);

// Mock window.confirm
global.confirm = jest.fn();

describe('ContactsPage', () => {
  const mockLogout = jest.fn();
  const authContextValue = {
    token: 'fake-token',
    login: jest.fn(),
    logout: mockLogout
  };

  const mockContacts = [
    { _id: '1', firstName: 'John', lastName: 'Doe', phone: '0123456789' },
    { _id: '2', firstName: 'Jane', lastName: 'Smith', phone: '0987654321' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render contacts page with loading state', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <TestWrapper authValue={authContextValue}>
        <ContactsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/chargement des contacts/i)).toBeInTheDocument();
    expect(screen.getByText(/mes contacts/i)).toBeInTheDocument();
    expect(screen.getByText(/déconnexion/i)).toBeInTheDocument();
  });

  test('should display contacts after loading', async () => {
    api.get.mockResolvedValue({ data: mockContacts });

    render(
      <TestWrapper authValue={authContextValue}>
        <ContactsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('0123456789')).toBeInTheDocument();
      expect(screen.getByText('0987654321')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('/contacts', {
      headers: { Authorization: 'Bearer fake-token' }
    });
  });

  test('should show empty state when no contacts', async () => {
    api.get.mockResolvedValue({ data: [] });

    render(
      <TestWrapper authValue={authContextValue}>
        <ContactsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/aucun contact pour le moment/i)).toBeInTheDocument();
    });
  });

  test('should add new contact', async () => {
    api.get.mockResolvedValue({ data: [] });
    api.post.mockResolvedValue({ 
      data: { _id: '3', firstName: 'New', lastName: 'Contact', phone: '0111111111' }
    });
    
    // Mock second API call after adding contact
    api.get.mockResolvedValueOnce({ data: [] })
           .mockResolvedValueOnce({ data: [{ _id: '3', firstName: 'New', lastName: 'Contact', phone: '0111111111' }] });

    render(
      <TestWrapper authValue={authContextValue}>
        <ContactsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/aucun contact pour le moment/i)).toBeInTheDocument();
    });

    // Remplir le formulaire avec des sélecteurs plus spécifiques
    fireEvent.change(screen.getByPlaceholderText('Prénom'), {
      target: { value: 'New' }
    });
    fireEvent.change(screen.getByPlaceholderText('Nom'), {
      target: { value: 'Contact' }
    });
    fireEvent.change(screen.getByPlaceholderText(/numéro de téléphone/i), {
      target: { value: '0111111111' }
    });

    // Soumettre - cibler spécifiquement le bouton
    fireEvent.click(screen.getByRole('button', { name: /ajouter/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/contacts', {
        firstName: 'New',
        lastName: 'Contact',
        phone: '0111111111'
      }, {
        headers: { Authorization: 'Bearer fake-token' }
      });
    });
  });

  test('should handle contact deletion with confirmation', async () => {
    api.get.mockResolvedValue({ data: mockContacts });
    api.delete.mockResolvedValue({});
    global.confirm.mockReturnValue(true);

    render(
      <TestWrapper authValue={authContextValue}>
        <ContactsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Cliquer sur supprimer
    const deleteButtons = screen.getAllByText(/supprimer/i);
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith(
      "Êtes-vous sûr de vouloir supprimer ce contact ?"
    );

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/contacts/1', {
        headers: { Authorization: 'Bearer fake-token' }
      });
    });
  });

  test('should not delete contact if user cancels confirmation', async () => {
    api.get.mockResolvedValue({ data: mockContacts });
    global.confirm.mockReturnValue(false);

    render(
      <TestWrapper authValue={authContextValue}>
        <ContactsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/supprimer/i);
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(api.delete).not.toHaveBeenCalled();
  });

  test('should handle edit contact', async () => {
    api.get.mockResolvedValue({ data: mockContacts });

    render(
      <TestWrapper authValue={authContextValue}>
        <ContactsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Cliquer sur modifier
    const editButtons = screen.getAllByText(/modifier/i);
    fireEvent.click(editButtons[0]);

    // Vérifier que le formulaire est pré-rempli
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0123456789')).toBeInTheDocument();
    
    // Vérifier que le titre du formulaire a changé
    expect(screen.getByText(/modifier le contact/i)).toBeInTheDocument();
  });

  test('should logout when clicking logout button', () => {
    api.get.mockResolvedValue({ data: [] });

    render(
      <TestWrapper authValue={authContextValue}>
        <ContactsPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText(/déconnexion/i));

    expect(mockLogout).toHaveBeenCalled();
  });
});