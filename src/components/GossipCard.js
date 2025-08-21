import React from 'react';
import { Link } from 'react-router-dom';

const GossipCard = ({ title, date, slug }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800">
        <Link to={`/post/${slug}`} className="hover:text-orange-600">{title}</Link>
      </h3>
      <p className="text-sm text-gray-400 mt-2">{date}</p>
    </div>
  );
};

export default GossipCard;