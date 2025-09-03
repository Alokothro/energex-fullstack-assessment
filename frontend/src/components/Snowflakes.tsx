import React from 'react';
import './Snowflakes.css';

const Snowflakes: React.FC = () => {
  return (
    <div className="snowflakes" aria-hidden="true">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="snowflake">
          •
        </div>
      ))}
    </div>
  );
};

export default Snowflakes;