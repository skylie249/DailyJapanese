import { supabase } from '../lib/supabaseClient';

/**
 * Magic Link 이메일 발송으로 로그인 시도
 * @param {string} email - 사용자 이메일
 */
export const signInWithMagicLink = async (email) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // 이메일 링크 클릭 후 돌아올 URL
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error('Magic Link 발송 실패:', error);
    throw new Error(error.message || '로그인 이메일 발송에 실패했습니다.');
  }
};

/**
 * 로그아웃
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('로그아웃 실패:', error);
    throw new Error('로그아웃에 실패했습니다.');
  }
};

/**
 * 현재 로그인된 사용자 반환
 * @returns {import('@supabase/supabase-js').User | null}
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * 인증 상태 변경 구독 (컴포넌트 마운트 시 사용)
 * @param {(user: import('@supabase/supabase-js').User | null) => void} callback
 * @returns {() => void} 구독 해제 함수
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
};
