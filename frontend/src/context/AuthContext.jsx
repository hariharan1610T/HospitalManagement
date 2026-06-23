import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { apiFetch } from '../lib/api';
import { AuthContext } from './AuthContextStore';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const fetchUserProfile = useCallback(async (accessToken) => {
    setProfileError(null);

    try {
      const profile = await apiFetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const roleName = profile.roles?.name || null;
      setUser(profile);
      setRole(roleName);

      if (!roleName) {
        setProfileError('Your account exists but has no role assigned.');
      }
    } catch (err) {
      setUser(null);
      setRole(null);
      setProfileError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        fetchUserProfile(session.access_token);
      } else {
        setSession(null);
        setProfileError(null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session);
        setLoading(true);
        fetchUserProfile(session.access_token);
      } else {
        setSession(null);
        setUser(null);
        setRole(null);
        setProfileError(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  return (
    <AuthContext.Provider value={{ user, role, session, loading, profileError }}>
      {children}
    </AuthContext.Provider>
  );
};
