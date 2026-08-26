import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  customerAppConfigured,
  getStoredSession,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
  type CustomerSession,
} from '@/lib/customerAppApi';

type CustomerAuthValue = {
  session: CustomerSession | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => void;
};

const CustomerAuthContext = createContext<CustomerAuthValue | null>(null);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomerSession | null>(() => getStoredSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sync = () => setSession(getStoredSession());
    window.addEventListener('storage', sync);
    window.addEventListener('mvv-auth-change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('mvv-auth-change', sync);
    };
  }, []);

  const value = useMemo<CustomerAuthValue>(() => ({
    session,
    loading,
    configured: customerAppConfigured,
    signIn: async (email, password) => {
      setLoading(true);
      try {
        const next = await apiSignIn(email, password);
        setSession(next);
      } finally {
        setLoading(false);
      }
    },
    signUp: async (email, password, name, phone) => {
      setLoading(true);
      try {
        const payload = await apiSignUp(email, password, name, phone);
        const next = getStoredSession();
        setSession(next);
        return { needsEmailConfirmation: !payload.access_token };
      } finally {
        setLoading(false);
      }
    },
    signOut: () => {
      apiSignOut();
      setSession(null);
    },
  }), [session, loading]);

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

// The provider and its consumer hook intentionally live together so the app has one auth source of truth.
// eslint-disable-next-line react-refresh/only-export-components
export function useCustomerAuth() {
  const value = useContext(CustomerAuthContext);
  if (!value) throw new Error('useCustomerAuth must be used inside CustomerAuthProvider');
  return value;
}
