import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import postsData from '../content/posts.json';

const Post = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = postsData.find(p => p.slug === slug);

  // Function to convert markdown to HTML
  const renderMarkdown = (content) => {
    let html = content
      // Headers
      .replace(/^##### (.*$)/gim, '<h5 class="text-xl font-bold mt-8 mb-3 text-gray-800">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-2xl font-bold mt-8 mb-4 text-gray-800">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-3xl font-bold mt-10 mb-4 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-4xl font-bold mt-10 mb-5 text-gray-800">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-5xl font-bold mt-12 mb-6 text-gray-800">$1</h1>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-800">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      // Links
      .replace(/\[([^\[]+)\]\(([^\)]+)\)/gim, '<a href="$2" class="text-orange-500 hover:text-orange-600 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-orange-500 pl-6 italic text-gray-600 bg-orange-50 py-4 pr-4 my-6 rounded-r">$1</blockquote>')
      // Horizontal rules
      .replace(/^\-{3,}$/gim, '<hr class="my-8 border-gray-300" />');

    // Process tables
    html = html.replace(/(\|.*\|)\n(\|.*\|)\n((?:\|.*\|\n)*)/g, (match, header, separator, rows) => {
      const headerCells = header.split('|').filter(cell => cell.trim()).map(cell => 
        `<th class="px-4 py-3 bg-gray-100 text-left font-semibold text-gray-700 border-b">${cell.trim()}</th>`
      ).join('');
      
      const rowsArray = rows.split('\n').filter(row => row.trim());
      const rowsHtml = rowsArray.map(row => {
        const cells = row.split('|').filter(cell => cell.trim()).map(cell => 
          `<td class="px-4 py-3 border-b">${cell.trim()}</td>`
        ).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      
      return `
        <div class="overflow-x-auto my-8 rounded-lg shadow-sm border">
          <table class="min-w-full bg-white">
            <thead>
              <tr>${headerCells}</tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `;
    });

    // Process images with lazy loading
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      return `
        <div class="my-8">
          <img src="${src.trim()}" alt="${alt.trim() || 'Post image'}" class="w-full h-auto rounded-lg shadow-md" loading="lazy" />
          ${alt.trim() ? `<p class="text-center text-gray-500 text-sm mt-2">${alt.trim()}</p>` : ''}
        </div>
      `;
    });

    // Process code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
      return `
        <div class="my-6 rounded-lg overflow-hidden">
          <div class="bg-gray-800 text-gray-100 px-4 py-2 text-sm font-mono flex justify-between items-center">
            <span>${language || 'code'}</span>
            <button class="text-orange-300 hover:text-orange-100 text-xs" onclick="navigator.clipboard.writeText(this.parentNode.nextElementSibling.textContent)">
              Copy
            </button>
          </div>
          <pre class="bg-gray-900 text-gray-100 p-4 overflow-x-auto"><code>${code.trim()}</code></pre>
        </div>
      `;
    });

    // Process lists
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
    html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>(\n)?)+/g, (match) => {
      return `<ul class="list-disc my-6 pl-6">${match}</ul>`;
    });

    html = html.replace(/^\+ (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
    html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>(\n)?)+/g, (match) => {
      return `<ul class="list-plus my-6 pl-6">${match}</ul>`;
    });

    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
    html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>(\n)?)+/g, (match) => {
      return `<ol class="list-decimal my-6 pl-6">${match}</ol>`;
    });

    // Process paragraphs and line breaks
    html = html
      .split('\n\n')
      .map(paragraph => {
        paragraph = paragraph.trim();
        if (!paragraph) return '';
        
        // Skip if it's already processed HTML
        if (paragraph.startsWith('<')) {
          return paragraph;
        }
        
        // Don't wrap list items in paragraphs
        if (paragraph.includes('<li>')) {
          return paragraph;
        }
        
        // Convert single line breaks to <br> within paragraphs
        paragraph = paragraph.replace(/\n/g, '<br />');
        
        return `<p class="mb-6 leading-8 text-gray-700">${paragraph}</p>`;
      })
      .join('');

    return html;
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Helmet>
          <title>Post Not Found | Your Site Name</title>
          <meta name="description" content="The post you are looking for does not exist. Explore more trending news and entertainment on our site." />
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // SEO and Social Media Metadata
  const pageTitle = `${post.frontmatter.title} | Your Site Name`;
  const pageDescription = post.frontmatter.description || 'Read the latest news and entertainment updates on our site.';
  const pageKeywords = post.frontmatter.tags ? post.frontmatter.tags.join(', ') : 'news, entertainment, Kenya, trending';
  const pageUrl = `${window.location.origin}/post/${slug}`;
  const ogImage = post.frontmatter.image || '/default-og-image.jpg'; // Fallback image

  // Structured Data (JSON-LD) for Article
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.frontmatter.title,
    description: pageDescription,
    author: {
      '@type': 'Person',
      name: post.frontmatter.author || 'Anonymous',
    },
    datePublished: post.frontmatter.date,
    image: ogImage,
    publisher: {
      '@type': 'Organization',
      name: 'Your Site Name',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png', // Replace with your site's logo
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        {/* SEO Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Your Site Name" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:site" content="@YourTwitterHandle" />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate('/')}
            className="text-orange-500 font-medium hover:text-orange-600 flex items-center gap-2"
          >
            ← Back to Home
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
              {new Date(post.frontmatter.date).toLocaleDateString()}
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
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={post.frontmatter.image} 
              alt={`${post.frontmatter.title} - Featured Image`} 
              className="w-full h-auto max-h-96 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="text-lg"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Social Sharing Buttons */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share This Story</h3>
          <div className="flex gap-4">
            <FacebookShareButton url={pageUrl} quote={post.frontmatter.title}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Share on Facebook</button>
            </FacebookShareButton>
            <TwitterShareButton url={pageUrl} title={post.frontmatter.title}>
              <button className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500">Share on Twitter/X</button>
            </TwitterShareButton>
            <WhatsappShareButton url={pageUrl} title={post.frontmatter.title}>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Share on WhatsApp</button>
            </WhatsappShareButton>
          </div>
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
                  onClick={() => navigate(`/?category=${tag}`)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want More Hot Scoops? 🔥</h3>
          <p className="text-orange-100 mb-6">
            Get the latest celebrity gossip delivered straight to your inbox!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-8 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transition-all">
              Subscribe Now
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Post;