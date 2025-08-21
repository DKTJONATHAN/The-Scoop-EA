import React, { useState } from 'react';
import postsData from '../content/posts.json';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Get all unique categories from your posts
  const categories = ['All', ...new Set(postsData.map(post => post.frontmatter.category).filter(Boolean))];
  
  const filteredPosts = selectedCategory === 'All' 
    ? postsData 
    : postsData.filter(post => post.frontmatter.category === selectedCategory);
  
  const featuredPost = postsData.find(post => post.frontmatter.featured);
  const regularPosts = filteredPosts.filter(post => !post.frontmatter.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            The Hottest <span className="text-black">Scoops</span>
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
            Your ultimate destination for entertainment news, celebrity gossip, and the stories everyone's talking about
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-100 shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              🔥 Featured Story
            </h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              {/* Featured Post Image */}
              {featuredPost.frontmatter.image && (
                <div className="w-full h-64 md:h-96 overflow-hidden">
                  <img 
                    src={featuredPost.frontmatter.image} 
                    alt={featuredPost.frontmatter.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {featuredPost.frontmatter.category}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {new Date(featuredPost.frontmatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {featuredPost.frontmatter.readTime}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {featuredPost.frontmatter.title}
                </h3>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {featuredPost.frontmatter.description || featuredPost.frontmatter.excerpt}
                </p>
                <p className="text-gray-500 mb-4">
                  By <span className="font-semibold">{featuredPost.frontmatter.author}</span>
                </p>
                <button 
                  onClick={() => window.location.href = `/post/${featuredPost.slug}`}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Read Full Story →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Latest Gossip & Entertainment News
          </h2>
          
          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <div
                  key={post.slug}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Post Image */}
                  {post.frontmatter.image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img 
                        src={post.frontmatter.image} 
                        alt={post.frontmatter.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                        {post.frontmatter.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(post.frontmatter.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {post.frontmatter.title}
                    </h3>
                    
                    {(post.frontmatter.description || post.frontmatter.excerpt) && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.frontmatter.description || post.frontmatter.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        By {post.frontmatter.author}
                      </span>
                      <button 
                        onClick={() => window.location.href = `/post/${post.slug}`}
                        className="text-orange-500 font-medium hover:text-orange-600 transition-colors duration-300 flex items-center gap-2"
                      >
                        Read More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Stories Yet</h3>
              <p className="text-gray-500 text-lg">
                {selectedCategory === 'All' 
                  ? "No gossip posts available yet. Check back soon for the latest entertainment news!"
                  : `No stories in "${selectedCategory}" category yet. Try another category or check back later!`
                }
              </p>
            </div>
          )}
        </div>

        {/* Newsletter Signup Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Never Miss the Tea ☕</h3>
            <p className="text-gray-300 mb-6 text-lg">
              Be the first to know about celebrity drama, entertainment news, and exclusive scoops!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-6 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 whitespace-nowrap">
                Get The Scoop! 🔥
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;