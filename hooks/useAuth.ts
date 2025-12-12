import { useState, useCallback, useEffect } from 'react';
import { User, UserRole, Permission } from '../types';
import { hasPermission } from '../types/roles';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('sharia_platform_user');
        if (storedUser) {
          const user = JSON.parse(storedUser) as User;
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with actual API call
      // Simulated login for development
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'product-owner',
        permissions: ['create-product', 'review-product'],
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      localStorage.setItem('sharia_platform_user', JSON.stringify(mockUser));

      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please check your credentials.',
      }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sharia_platform_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      if (!state.user) return false;
      return hasPermission(state.user.role, permission);
    },
    [state.user]
  );

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return state.user?.role === role;
    },
    [state.user]
  );

  return {
    ...state,
    login,
    logout,
    checkPermission,
    hasRole,
  };
};

export default useAuth;
