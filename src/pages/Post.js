import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postsData from '../content/posts.json';

const Post = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = postsData.find(p => p.slug === slug);

  // SEO and Social Media Meta Tags
  useEffect(() => {
    if (!post) return;

    // Get current URL
    const currentUrl = window.location.href;
    const siteUrl = window.location.origin;
    
    // Clear existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-dynamic="true"]');
    existingMetas.forEach(meta => meta.remove());
    
    const existingLinks = document.querySelectorAll('link[data-dynamic="true"]');
    existingLinks.forEach(link => link.remove());

    // Helper function to create meta tags
    const createMeta = (property, content, name = null) => {
      const meta = document.createElement('meta');
      if (name) {
        meta.setAttribute('name', property);
      } else {
        meta.setAttribute('property', property);
      }
      meta.setAttribute('content', content);
      meta.setAttribute('data-dynamic', 'true');
      document.head.appendChild(meta);
    };

    // Helper function to create link tags
    const createLink = (rel, href, type = null) => {
      const link = document.createElement('link');
      link.setAttribute('rel', rel);
      link.setAttribute('href', href);
      if (type) link.setAttribute('type', type);
      link.setAttribute('data-dynamic', 'true');
      document.head.appendChild(link);
    };

    // Update document title
    const originalTitle = document.title;
    document.title = `${post.frontmatter.title} | East Africa's Hottest Entertainment News`;

    // Basic SEO Meta Tags
    createMeta('description', post.frontmatter.description, 'description');
    createMeta('keywords', `${post.frontmatter.tags?.join(', ')}, East Africa entertainment, celebrity gossip, entertainment news, African celebrities, Kenyan celebrities, Ugandan celebrities, Tanzanian celebrities, gossip news`, 'keywords');
    createMeta('author', post.frontmatter.author || 'Entertainment Reporter', 'author');
    createMeta('robots', 'index, follow', 'robots');
    createMeta('viewport', 'width=device-width, initial-scale=1.0', 'viewport');

    // Open Graph Tags for Facebook
    createMeta('og:title', post.frontmatter.title);
    createMeta('og:description', post.frontmatter.description);
    createMeta('og:type', 'article');
    createMeta('og:url', currentUrl);
    createMeta('og:site_name', 'East Africa Entertainment Hub');
    createMeta('og:locale', 'en_KE');
    createMeta('og:locale:alternate', 'sw_KE');
    
    if (post.frontmatter.image) {
      createMeta('og:image', post.frontmatter.image.startsWith('http') ? post.frontmatter.image : `${siteUrl}${post.frontmatter.image}`);
      createMeta('og:image:width', '1200');
      createMeta('og:image:height', '630');
      createMeta('og:image:alt', post.frontmatter.title);
    }

    // Article specific Open Graph tags
    createMeta('article:published_time', post.frontmatter.date);
    createMeta('article:author', post.frontmatter.author || 'Entertainment Reporter');
    createMeta('article:section', 'Entertainment');
    createMeta('article:tag', post.frontmatter.category);
    
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach(tag => {
        createMeta('article:tag', tag);
      });
    }

    // Twitter Card Tags
    createMeta('twitter:card', 'summary_large_image', 'twitter:card');
    createMeta('twitter:site', '@TheScoopEA', 'twitter:site');
    createMeta('twitter:creator', '@TheScoopEA', 'twitter:creator');
    createMeta('twitter:title', post.frontmatter.title, 'twitter:title');
    createMeta('twitter:description', post.frontmatter.description, 'twitter:description');
    
    if (post.frontmatter.image) {
      createMeta('twitter:image', post.frontmatter.image.startsWith('http') ? post.frontmatter.image : `${siteUrl}${post.frontmatter.image}`, 'twitter:image');
      createMeta('twitter:image:alt', post.frontmatter.title, 'twitter:image:alt');
    }

    // Additional social media tags
    createMeta('telegram:channel', '@eastafricaentertainment', 'telegram:channel');
    createMeta('whatsapp:title', post.frontmatter.title, 'whatsapp:title');
    createMeta('whatsapp:description', post.frontmatter.description, 'whatsapp:description');

    // Structured Data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.frontmatter.title,
      "description": post.frontmatter.description,
      "image": post.frontmatter.image ? (post.frontmatter.image.startsWith('http') ? post.frontmatter.image : `${siteUrl}${post.frontmatter.image}`) : null,
      "datePublished": post.frontmatter.date,
      "dateModified": post.frontmatter.date,
      "author": {
        "@type": "Person",
        "name": post.frontmatter.author || "Entertainment Reporter",
        "jobTitle": "Entertainment Journalist"
      },
      "publisher": {
        "@type": "Organization",
        "name": "The Scoop EA",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      },
      "articleSection": "Entertainment",
      "keywords": post.frontmatter.tags?.join(', '),
      "about": {
        "@type": "Thing",
        "name": "The Scoop EA"
      },
      "inLanguage": "en-KE",
      "isAccessibleForFree": true,
      "genre": ["Entertainment", "Celebrity News", "Gossip"]
    };

    // Add structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Canonical URL
    createLink('canonical', currentUrl);

    // RSS Feed
    createLink('alternate', `${siteUrl}/rss.xml`, 'application/rss+xml');

    // Cleanup function
    return () => {
      document.title = originalTitle;
      const dynamicElements = document.querySelectorAll('[data-dynamic="true"]');
      dynamicElements.forEach(element => element.remove());
    };
  }, [post]);

  // Function to convert markdown to HTML - FIXED IMAGE RENDERING
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
      // Images first, then links - THIS IS THE KEY FIX
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        return `<div class="my-8"><img src="${src.trim()}" alt="${alt.trim() || 'Post image'}" class="w-full h-auto rounded-lg shadow-md" loading="lazy" />${alt.trim() ? `<p class="text-center text-gray-500 text-sm mt-2">${alt.trim()}</p>` : ''}</div>`;
      })
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
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The juicy story you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Entertainment Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation with breadcrumbs for SEO */}
      <nav className="bg-white shadow-sm py-4" role="navigation" aria-label="Breadcrumb">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate('/')}
            className="text-orange-500 font-medium hover:text-orange-600 flex items-center gap-2"
          >
            ← Back to Entertainment Hub
          </button>
          <div className="text-sm text-gray-500 mt-2">
            <span>Home</span> / <span>{post.frontmatter.category}</span> / <span className="text-gray-700">{post.frontmatter.title}</span>
          </div>
        </div>
      </nav>

      {/* Post Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl" itemScope itemType="https://schema.org/Article">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.frontmatter.category}
            </span>
            <time 
              className="text-gray-600 text-sm"
              dateTime={post.frontmatter.date}
              itemProp="datePublished"
            >
              {new Date(post.frontmatter.date).toLocaleDateString('en-KE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span className="text-gray-600 text-sm">•</span>
            <span className="text-gray-600 text-sm">{post.frontmatter.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6" itemProp="headline">
            {post.frontmatter.title}
          </h1>

          <div className="text-xl text-gray-600 mb-6 leading-relaxed" itemProp="description">
            {post.frontmatter.description}
          </div>

          <div className="flex items-center gap-3" itemProp="author" itemScope itemType="https://schema.org/Person">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              {post.frontmatter.author?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-medium text-gray-800" itemProp="name">
                {post.frontmatter.author || 'Entertainment Reporter'}
              </p>
              <p className="text-sm text-gray-500" itemProp="jobTitle">Entertainment Journalist</p>
            </div>
          </div>

          {/* Social sharing buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(`Check out this hot story: ${post.frontmatter.title}`);
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
            >
              🐦 Share on Twitter
            </button>
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
            >
              📘 Share on Facebook
            </button>
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(`🔥 ${post.frontmatter.title} - ${post.frontmatter.description}`);
                window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
            >
              💬 Share on WhatsApp
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {post.frontmatter.image && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={post.frontmatter.image} 
              alt={post.frontmatter.title}
              className="w-full h-auto max-h-96 object-cover"
              itemProp="image"
              loading="eager"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="text-lg"
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Tags */}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors cursor-pointer"
                  onClick={() => navigate(`/?category=${tag}`)}
                  itemProp="keywords"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Get The Hottest East African Entertainment News! 🔥</h3>
          <p className="text-orange-100 mb-6">
            Don't miss out on the latest celebrity gossip, entertainment news, and exclusive scoops from Kenya, Uganda, Tanzania, and beyond!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email for hot updates"
              className="px-6 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Email address for newsletter signup"
            />
            <button className="px-8 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transition-all">
              Get The Scoop! 📰
            </button>
          </div>
          <p className="text-xs text-orange-200 mt-3">
            Join 50,000+ entertainment lovers across East Africa
          </p>
        </div>
      </article>
    </div>
  );
};

export default Post;