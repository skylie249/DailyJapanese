import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { fetchAllHistory } from '../services/geminiService';
import { t } from '../utils/i18n';

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
        {t('card.history')}
      </h2>
      
      {isLoading ? (
        <div className="history-loading">{t('lang.loading')}</div>
      ) : error ? (
        <div className="error-message">{t('common.error')}</div>
      ) : historyList.length === 0 ? (
        <div className="history-empty">{t('history.empty')}</div>
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
