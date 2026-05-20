'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'success' | 'error';
}

interface UIState {
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  toasts: ToastMessage[];
}

type UIAction =
  | { type: 'TOGGLE_MOBILE_MENU'; payload?: boolean }
  | { type: 'TOGGLE_SEARCH'; payload?: boolean }
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string };

const initialState: UIState = {
  mobileMenuOpen: false,
  searchOpen: false,
  toasts: [],
};

function reducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        mobileMenuOpen:
          action.payload !== undefined ? action.payload : !state.mobileMenuOpen,
      };
    case 'TOGGLE_SEARCH':
      return {
        ...state,
        searchOpen:
          action.payload !== undefined ? action.payload : !state.searchOpen,
      };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

interface UIContextValue extends UIState {
  toggleMobileMenu: (open?: boolean) => void;
  toggleSearch: (open?: boolean) => void;
  toast: (msg: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleMobileMenu = useCallback(
    (open?: boolean) => dispatch({ type: 'TOGGLE_MOBILE_MENU', payload: open }),
    [],
  );

  const toggleSearch = useCallback(
    (open?: boolean) => dispatch({ type: 'TOGGLE_SEARCH', payload: open }),
    [],
  );

  const dismissToast = useCallback(
    (id: string) => dispatch({ type: 'REMOVE_TOAST', payload: id }),
    [],
  );

  const toast = useCallback(
    (msg: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 9);
      dispatch({ type: 'ADD_TOAST', payload: { ...msg, id } });
      setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast],
  );

  return (
    <UIContext.Provider
      value={{
        ...state,
        toggleMobileMenu,
        toggleSearch,
        toast,
        dismissToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
