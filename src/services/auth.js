import { authClient } from '../lib/authClient.js'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default {
  async signUpEmail({ email, password, name }) {
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });
      
      if (error) {
        throw new Error(error.message || "Registration failed");
      }
      
      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  async signInEmail({ email, password }) {
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      
      if (error) {
        throw new Error(error.message || "Login failed");
      }
      
      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  async signOut() {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Sign-out failed');
      }

      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  async getSession() {
    try {
      const res = await fetch(`${API_URL}/api/auth/get-session`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (res.status === 200) {
        return res.json();
      }

      return null;
    } catch (err) {
      return null;
    }
  }
}

