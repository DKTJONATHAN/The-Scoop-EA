const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, '../content/posts');
const outputFile = path.join(__dirname, '../content/posts.json');

const postFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));

const posts = postFiles.map(file => {
  const filePath = path.join(postsDirectory, file);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);
  const slug = file.replace('.md', '');

  return {
    slug,
    frontmatter,
    content,
  };
});

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log('Posts JSON generated successfully.');