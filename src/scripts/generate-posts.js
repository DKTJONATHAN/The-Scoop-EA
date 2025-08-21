const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, '../content/posts');
const outputFile = path.join(__dirname, '../content/posts.json');

// Ensure the posts directory exists
if (!fs.existsSync(postsDirectory)) {
  console.error('Error: Posts directory does not exist at', postsDirectory);
  process.exit(1);
}

try {
  // Read all markdown files in the posts directory
  const postFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));

  const posts = postFiles.map(file => {
    try {
      const filePath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContents);
      const slug = file.replace('.md', '');

      // Ensure frontmatter contains expected fields, provide defaults if missing
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
  }).filter(post => post !== null); // Remove any failed posts

  // Write the posts to a JSON file
  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
  console.log(`Posts JSON generated successfully with ${posts.length} posts.`);
} catch (err) {
  console.error('Error generating posts JSON:', err.message);
  process.exit(1);
}