import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { fetchAllHistory } from '../services/geminiService';

const HistoryPage = ({ onSelectDate }) => {
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchAllHistory();
        setHistoryList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistory();
  }, []);

  return (
    <div className="history-page">
      <h2 className="history-title">
        <Calendar size={20} className="history-icon" />
        과거 기록
      </h2>
      
      {isLoading ? (
        <div className="history-loading">기록을 불러오는 중입니다...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : historyList.length === 0 ? (
        <div className="history-empty">저장된 기록이 없습니다.</div>
      ) : (
        <ul className="history-list">
          {historyList.map((item) => (
            <li 
              key={item.date} 
              className="history-item"
              onClick={() => onSelectDate(item.date)}
            >
              <div className="history-item-content">
                <span className="history-date">{item.date}</span>
                <span className="history-meaning">{item.base_meaning}</span>
              </div>
              <ChevronRight size={20} className="history-arrow" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPage;
