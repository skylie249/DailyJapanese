import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-tag"></div>
        <div className="skeleton-icon"></div>
      </div>
      <div className="skeleton-line skeleton-main"></div>
      <div className="skeleton-line skeleton-sub"></div>
      <div className="skeleton-line skeleton-sub2"></div>
    </div>
  );
};

export default SkeletonCard;
