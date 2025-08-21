const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function generatePosts() {
  try {
    const postsDirectory = path.join(process.cwd(), 'src/content/posts');
    
    if (!fs.existsSync(postsDirectory)) {
      console.error('Posts directory not found:', postsDirectory);
      return;
    }

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
            description: frontmatter.description || frontmatter.excerpt || '',
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

    const sortedPosts = posts.sort((a, b) => 
      new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );

    // Write to posts.json
    const outputPath = path.join(process.cwd(), 'src/content/posts.json');
    fs.writeFileSync(outputPath, JSON.stringify(sortedPosts, null, 2));
    
    console.log(`Generated posts.json with ${sortedPosts.length} posts`);
  } catch (error) {
    console.error('Error generating posts:', error);
  }
}

generatePosts();