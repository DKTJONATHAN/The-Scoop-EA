import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req, res) {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  
  if (!fs.existsSync(postsDirectory)) {
    return res.status(404).json({ error: 'Posts directory not found' });
  }

  try {
    const postFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
    const posts = postFiles.map(file => {
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
    });

    const sortedPosts = posts.sort((a, b) => 
      new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );

    res.status(200).json(sortedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}