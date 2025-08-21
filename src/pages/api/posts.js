import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req, res) {
  try {
    // Use process.cwd() to get the root directory of the project
    const postsDirectory = path.join(process.cwd(), 'src/content/posts');
    
    console.log('Looking for posts in:', postsDirectory);
    
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.error('Posts directory not found at:', postsDirectory);
      return res.status(404).json({ 
        error: 'Posts directory not found',
        path: postsDirectory 
      });
    }

    // Read all markdown files
    const postFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
    console.log('Found files:', postFiles);

    const posts = postFiles.map(file => {
      try {
        const filePath = path.join(postsDirectory, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter, content } = matter(fileContents);
        const slug = file.replace('.md', '');

        return {
          slug,
          frontmatter: {
            title: frontmatter.title || 'Untitled',
            description: frontmatter.description || '',
            author: frontmatter.author || 'Unknown Author',
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            image: frontmatter.image || '',
            category: frontmatter.category || 'Uncategorized',
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            slug: frontmatter.slug || slug,
            featured: frontmatter.featured || false,
            readTime: frontmatter.readTime || 'Unknown'
          },
          content
        };
      } catch (err) {
        console.error(`Error processing file ${file}:`, err.message);
        return null;
      }
    }).filter(post => post !== null);

    // Sort by date (newest first)
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );

    console.log('Successfully processed', sortedPosts.length, 'posts');
    res.status(200).json(sortedPosts);

  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}