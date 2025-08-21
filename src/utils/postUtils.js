import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const postsDirectory = path.join(__dirname, '../content/posts');

export function readPosts() {
  // Ensure the posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.error('Error: Posts directory does not exist at', postsDirectory);
    return [];
  }

  try {
    // Read all markdown files in the posts directory
    const postFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));

    const posts = postFiles
      .map(file => {
        try {
          const filePath = path.join(postsDirectory, file);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data: frontmatter, content } = matter(fileContents);
          const slug = file.replace('.md', '');

          // Standardize frontmatter to match post1.md structure
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
      })
      .filter(post => post !== null); // Remove any failed posts

    // Sort posts by date (newest first)
    return posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
  } catch (err) {
    console.error('Error reading posts:', err.message);
    return [];
  }
}