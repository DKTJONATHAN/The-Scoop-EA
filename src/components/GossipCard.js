import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const GossipCard = ({ frontmatter, slug }) => {
  const { title, description, date, image, category, tags, author, readTime, featured } = frontmatter;

  // Format the date to a readable string
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className={`relative bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 mb-6 border-l-4 ${
        featured ? 'border-orange-500' : 'border-gray-200'
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
          Featured
        </span>
      )}

      {/* Image */}
      {image && (
        <Link to={`/post/${slug}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-md mb-4"
            loading="lazy"
          />
        </Link>
      )}

      {/* Category and Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-sm font-medium text-orange-600">{category}</span>
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        <Link
          to={`/post/${slug}`}
          className="hover:text-orange-600 transition-colors duration-200"
        >
          {title}
        </Link>
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
      )}

      {/* Meta Information */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        <p>
          By {author} | {formattedDate}
        </p>
        <p>{readTime}</p>
      </div>
    </div>
  );
};

// PropTypes for type checking
GossipCard.propTypes = {
  slug: PropTypes.string.isRequired,
  frontmatter: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.string.isRequired,
    image: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.string,
    readTime: PropTypes.string,
    featured: PropTypes.bool,
  }).isRequired,
};

// Default props for optional fields
GossipCard.defaultProps = {
  frontmatter: {
    description: '',
    image: '',
    category: 'Uncategorized',
    tags: [],
    author: 'Unknown Author',
    readTime: 'Unknown',
    featured: false,
  },
};

export default GossipCard;