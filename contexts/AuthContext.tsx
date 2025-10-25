'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabaseAuth } from '@/lib/supabase/authClient';

type Profile = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
} | null;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  profile: Profile;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: {
    display_name?: string;
    avatar_url?: string;
  }) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabaseAuth.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabaseAuth.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      // Reset profile on logout
      if (!newSession?.user) setProfile(null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseAuth.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabaseAuth
      .from('profiles')
      .select('user_id, display_name, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle<{ user_id: string; display_name: string | null; avatar_url: string | null }>();
    if (!error) setProfile(data ?? null);
  };

  useEffect(() => {
    if (!user) return;
    refreshProfile();
  }, [user?.id]);

  const updateProfile: AuthContextType['updateProfile'] = async ({ display_name, avatar_url }) => {
    if (!user) return { error: 'No hay usuario' };
    type UpdateProfileRow = { user_id: string; display_name?: string; avatar_url?: string };
    const payload: UpdateProfileRow = { user_id: user.id };
    if (typeof display_name !== 'undefined') payload.display_name = display_name;
    if (typeof avatar_url !== 'undefined') payload.avatar_url = avatar_url;
    const { error } = await supabaseAuth
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' });
    if (error) return { error: error.message };
    await refreshProfile();
    return {};
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signOut, profile, refreshProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
