import { supabase } from '../lib/supabaseClient';

// 마스터 데이터 조회/생성/저장은 서버(api/daily-content.js)에서 service role 키로 처리합니다.
// (daily_content는 공유 캐시 테이블이라 anon 키로는 RLS에 의해 쓰기가 차단되어 있습니다.)
export const fetchMasterDailyContent = async (date) => {
  const res = await fetch(`/api/daily-content?date=${encodeURIComponent(date)}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch daily content');
  }

  return res.json();
};

export const fetchDailyContent = async (language, date, level) => {
  // 1. 마스터 데이터를 가져옵니다 (오늘자 데이터가 로컬에 있다면 API 호출 생략됨)
  const masterData = await fetchMasterDailyContent(date);

  // 2. 요청한 언어와 난이도에 맞는 데이터를 추출
  const targetContent = masterData.content[language]?.[level];

  if (!targetContent) {
    throw new Error(`해당 언어(${language}) 및 난이도(${level})의 데이터를 찾을 수 없습니다.`);
  }

  // 3. 기존 애플리케이션 구조와 호환되도록 포맷팅하여 반환
  return {
    date: masterData.date,
    level: level,
    language: language,
    base_meaning: masterData.base_meaning, // 공통 기준 문장(한국어)
    sentence: targetContent.sentence,
    words: targetContent.words
  };
};

export const fetchAllHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('daily_content')
      .select('date, base_meaning')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching history:', error);
    throw new Error('과거 기록을 불러오는 데 실패했습니다.');
  }
};

