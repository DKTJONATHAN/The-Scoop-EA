import React from 'react';
import { useParams } from 'react-router-dom';
import postsData from '../content/posts.json';

const Post = () => {
  const { slug } = useParams();
  const post = postsData.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-orange-500 font-medium hover:text-orange-600 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </nav>

      {/* Post Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.frontmatter.category}
            </span>
            <span className="text-gray-600 text-sm">
              {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="text-gray-600 text-sm">•</span>
            <span className="text-gray-600 text-sm">{post.frontmatter.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {post.frontmatter.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.frontmatter.description}
          </p>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              {post.frontmatter.author?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-medium text-gray-800">{post.frontmatter.author}</p>
              <p className="text-sm text-gray-500">Entertainment Reporter</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.frontmatter.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img 
              src={post.frontmatter.image} 
              alt={post.frontmatter.title}
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-8"
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(/\n/g, '<br/>').replace(/\#\#\#\# (.*)/g, '<h4>$1</h4>').replace(/\#\#\# (.*)/g, '<h3>$1</h3>').replace(/\#\# (.*)/g, '<h2>$1</h2>').replace(/\# (.*)/g, '<h1>$1</h1>')
            }}
          />
        </div>

        {/* Tags */}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/?category=${tag}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts or Newsletter */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want More Scoops? 🍵</h3>
          <p className="text-gray-300 mb-6">
            Get the latest celebrity gossip and entertainment news delivered straight to your inbox!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all">
              Subscribe Now
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Post;