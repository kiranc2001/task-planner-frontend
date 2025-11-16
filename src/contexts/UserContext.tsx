import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && 'id' in parsed) {
        return parsed as User;
      } else {
        // Invalid JSON/object—clear it
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        return null;
      }
    } catch (err) {
      // Parse failed (e.g., "undefined")—clear and return null
      console.warn('Invalid user in localStorage, cleared:', err);
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('userId', user.id.toString());
    } else {
      localStorage.removeItem('userId');
    }
    localStorage.setItem('user', JSON.stringify(user || null));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
