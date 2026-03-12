'use client';
import { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return <AuthModalContext.Provider value={{ isOpen, openModal, closeModal }}>{children}</AuthModalContext.Provider>;
}

export const useAuthModal = () => useContext(AuthModalContext);
