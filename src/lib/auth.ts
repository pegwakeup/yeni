import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from './config/supabase';

export type User = {
  id: string;
  email: string;
  role: string;
};

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  if (!email || !password) {
    throw new Error('E-posta ve şifre gereklidir.');
  }

  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (response.error) {
      throw response.error;
    }

    if (!response.data.session) {
      throw new Error('Oturum oluşturulamadı.');
    }
    
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      // Handle specific Supabase auth errors
      switch (error.message) {
        case 'Invalid login credentials':
          throw new Error('E-posta veya şifre hatalı.');
        case 'Email not confirmed':
          throw new Error('E-posta adresiniz henüz doğrulanmamış.');
        case 'Too many requests':
          throw new Error('Çok fazla deneme yaptınız. Lütfen bir süre bekleyin.');
        default:
          throw new Error('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Çıkış yapılırken bir hata oluştu.');
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get current user error:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}