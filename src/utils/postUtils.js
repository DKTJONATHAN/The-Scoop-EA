import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const postsDirectory = path.join(__dirname, '../content/posts');

export function readPosts() {
  const postFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));

  const posts = postFiles.map(file => {
    const filePath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContents);
    const slug = file.replace('.md', '');

    return {
      frontmatter,
      content,
      slug,
    };
  });

  return posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
}