import { MOCK_USERS_DB } from '../constants';
import type { User } from '../types';

const USERS_DB_KEY = 'camp_trades_users';
const SESSION_KEY = 'camp_trades_session';

// Initialize user database in localStorage if it doesn't exist
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_DB_KEY);
  if (users) {
    return JSON.parse(users);
  } else {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(MOCK_USERS_DB));
    return MOCK_USERS_DB;
  }
};

export const authService = {
  register: (name: string, email: string, password: string, collegeId: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        if (users.find(user => user.email === email)) {
          reject(new Error('User with this email already exists.'));
          return;
        }

        const newUser: User = {
          id: `user${Date.now()}`,
          name,
          email,
          password, // In a real app, this should be hashed
          collegeId,
          avatar: `https://picsum.photos/seed/${name}/100/100`,
          walletBalance: 500, // Sign-up bonus
        };

        users.push(newUser);
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
        localStorage.setItem(SESSION_KEY, newUser.id);

        resolve(newUser);
      }, 500);
    });
  },

  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (user && user.password === password) {
          localStorage.setItem(SESSION_KEY, user.id);
          resolve(user);
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 500);
    });
  },

  logout: (): Promise<void> => {
    return new Promise(resolve => {
      localStorage.removeItem(SESSION_KEY);
      resolve();
    });
  },

  getCurrentUser: (): Promise<User | null> => {
    return new Promise(resolve => {
      const userId = localStorage.getItem(SESSION_KEY);
      if (userId) {
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        resolve(user || null);
      } else {
        resolve(null);
      }
    });
  },
};
