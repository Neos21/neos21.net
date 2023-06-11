document.addEventListener('DOMContentLoaded', () => {
  try {
    const text = document.getElementById('content').textContent;
    const lines = text.trim().split('\n');
    
    let html = `<dt class="columns-title">Scripts</dt><dd class="columns-title">Trivia</dd>`;
    
    let sideLines = null;
    const insertSideHtml = () => {
      const sideMarkdown = sideLines.map(sideLine => `${sideLine.replace((/^  /u), '')}`).join('\n');
      const sideHtml = marked.parse(sideMarkdown, { mangle: false, headerIds: false });
      html += `<dd>${sideHtml}</dd>`;
      sideLines = null;
    };
    
    lines.forEach(line => {
      if(line.startsWith('  ')) {
        if(sideLines == null) {
          sideLines = [line];
        }
        else {
          sideLines.push(line);
        }
      }
      else {
        if(sideLines != null) insertSideHtml();
        html += `<dt>${line}</dt>`;
      }
    });
    if(sideLines != null) insertSideHtml();
    
    document.getElementById('wrapper').innerHTML = html;
  }
  catch(error) {
    console.error('Error :', error);
    document.getElementById('wrapper').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }
});
