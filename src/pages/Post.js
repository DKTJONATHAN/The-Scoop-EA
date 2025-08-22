// Function to convert markdown to HTML - FIXED IMAGE ORDER
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
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-orange-500 pl-6 italic text-gray-600 bg-orange-50 py-4 pr-4 my-6 rounded-r">$1</blockquote>')
    // Horizontal rules
    .replace(/^\-{3,}$/gim, '<hr class="my-8 border-gray-300" />');

  // Process images FIRST (before links!)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    return `
      <div class="my-8">
        <img src="${src.trim()}" alt="${alt.trim() || 'Post image'}" class="w-full h-auto rounded-lg shadow-md" loading="lazy" />
        ${alt.trim() ? `<p class="text-center text-gray-500 text-sm mt-2">${alt.trim()}</p>` : ''}
      </div>
    `;
  });

  // Process links AFTER images
  html = html.replace(/\[([^\[]+)\]\(([^\)]+)\)/gim, '<a href="$2" class="text-orange-500 hover:text-orange-600 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');

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