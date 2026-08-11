import { supabase } from '../lib/supabaseClient';

/**
 * 즐겨찾기 고유 ID 생성
 * @param {string} date - 날짜 (YYYY-MM-DD)
 * @param {string} language - 언어 이름 (예: 일본어)
 * @param {string} level - 난이도 (초급/중급/고급)
 */
export const buildFavoriteId = (date, language, level) =>
  `${date}_${language}_${level}`;

/**
 * 전체 즐겨찾기 목록 조회 (현재 로그인 사용자 기준, 최신 저장순)
 */
export const getFavorites = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch favorites:', error);
    throw new Error('즐겨찾기 목록을 불러오는 데 실패했습니다.');
  }

  return data || [];
};

/**
 * 즐겨찾기 추가
 * @param {{ date, language, languageCode, level, base_meaning, sentence, words }} item
 */
export const addFavorite = async ({ date, language, languageCode, level, base_meaning, sentence, words }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('즐겨찾기를 저장하려면 로그인이 필요합니다.');

  const id = buildFavoriteId(date, language, level);

  const { error } = await supabase
    .from('favorites')
    .upsert(
      {
        id,
        user_id: user.id,
        date,
        language,
        language_code: languageCode,
        level,
        base_meaning,
        sentence,
        words,
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.error('Failed to add favorite:', error);
    throw new Error('즐겨찾기 추가에 실패했습니다.');
  }
};

/**
 * 즐겨찾기 삭제
 * @param {string} id - buildFavoriteId()로 생성한 ID
 */
export const removeFavorite = async (id) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to remove favorite:', error);
    throw new Error('즐겨찾기 삭제에 실패했습니다.');
  }
};

/**
 * 특정 항목의 즐겨찾기 여부 확인
 * @param {string} id - buildFavoriteId()로 생성한 ID
 * @returns {boolean}
 */
export const checkIsFavorite = async (id) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to check favorite status:', error);
    return false;
  }

  return !!data;
};
