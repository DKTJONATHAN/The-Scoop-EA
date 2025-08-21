import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req, res) {
  try {
    // Find the posts directory
    const postsDirectory = path.join(process.cwd(), 'src/content/posts');
    
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return res.status(200).json([]);
    }

    // Read all markdown files
    const postFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
    
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
            author: frontmatter.author || 'Unknown',
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            image: frontmatter.image || '',
            category: frontmatter.category || 'General',
            tags: frontmatter.tags || [],
            featured: frontmatter.featured || false,
            readTime: frontmatter.readTime || '2 min read'
          },
          content
        };
      } catch (err) {
        console.error('Error processing file:', err);
        return null;
      }
    }).filter(post => post !== null);

    // Sort by date (newest first)
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );

    res.status(200).json(sortedPosts);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to load posts' });
  }
}