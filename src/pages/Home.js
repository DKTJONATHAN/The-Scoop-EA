import React from 'react';
import GossipCard from '../components/GossipCard';
import { readPosts } from '../utils/postUtils';

const Home = () => {
  const posts = readPosts();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Latest Gossip</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <GossipCard
            key={post.slug}
            title={post.frontmatter.title}
            date={post.frontmatter.date}
            slug={post.slug}
          />
        ))
      ) : (
        <p className="text-gray-600">No gossip posts available yet.</p>
      )}
    </div>
  );
};

export default Home;