/**
 * Content Previewer - A lightweight tool for previewing Markdown, LaTeX, and HTML
 * Supports syntax highlighting, math equations, and diagrams
 */
class ContentPreviewer {
    constructor() {
        this.currentFormat = 'markdown';
        this.inputArea = document.querySelector('.input-area');
        this.previewContent = document.getElementById('preview');
        this.formatButtons = document.querySelectorAll('.format-btn');
        
        this.initializeEventListeners();
        this.initializeLibraries();
        this.initializeAds();
        this.updatePlaceholder();
    }
    
    initializeAds() {
        // Initialize Google AdSense
        if (typeof adsbygoogle !== 'undefined') {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.log('AdSense initialization failed:', e);
            }
        }
    }
    
    initializeEventListeners() {
        // Format button clicks
        this.formatButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFormat(e.target.dataset.format);
            });
        });
        
        // Input changes with debouncing
        let debounceTimer;
        let hasTrackedInput = false;
        this.inputArea.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.updatePreview();
            }, 300);
            
            // Track first content input for analytics
            if (!hasTrackedInput && this.inputArea.value.trim()) {
                hasTrackedInput = true;
                if (typeof trackContentInput === 'function') {
                    trackContentInput();
                }
            }
        });
        
        // Initial preview update
        this.updatePreview();
    }
    
    initializeLibraries() {
        // Configure Marked for Markdown
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (err) {}
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });
        
        // Initialize Mermaid
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose'
        });
        
        // Configure MathJax for LaTeX
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true,
                processEnvironments: true,
                packages: {'[+]': ['ams', 'newcommand', 'configmacros']},
                macros: {
                    RR: "\\mathbb{R}",
                    CC: "\\mathbb{C}",
                    NN: "\\mathbb{N}",
                    ZZ: "\\mathbb{Z}",
                    QQ: "\\mathbb{Q}",
                    FF: "\\mathbb{F}"
                },
                tags: 'ams',
                tagSide: 'right',
                tagIndent: '0.8em',
                useLabelIds: true,
                multlineWidth: '85%'
            },
            options: {
                ignoreHtmlClass: 'tex2jax_ignore',
                processHtmlClass: 'tex2jax_process',
                renderActions: {
                    addMenu: [0, '', '']
                }
            },
            startup: {
                ready: () => {
                    MathJax.startup.defaultReady();
                    if (MathJax.config.tex.tags !== 'none') {
                        MathJax.config.tex.tagFormat = {
                            number: (n) => n.toString(),
                            tag: (tag) => '(' + tag + ')',
                            id: (id) => 'mjx-eqn-' + id.replace(/\s/g, '_'),
                            url: (id, base) => base + '#' + encodeURIComponent(id)
                        };
                    }
                }
            }
        };
    }
    
    setFormat(format) {
        this.currentFormat = format;
        
        // Track format changes for analytics
        if (typeof trackFormatChange === 'function') {
            trackFormatChange(format);
        }
        
        // Update button states
        this.formatButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.format === format);
        });
        
        // Clear any existing math rendering when switching formats
        this.clearMathRendering();
        
        this.updatePlaceholder();
        this.updatePreview();
    }
    
    clearMathRendering() {
        // Clear MathJax rendering
        if (window.MathJax && window.MathJax.typesetClear) {
            try {
                window.MathJax.typesetClear([this.previewContent]);
            } catch (e) {
                // Ignore errors during clearing
            }
        }
        
        // Clear any KaTeX elements
        const katexElements = this.previewContent.querySelectorAll('.katex, .katex-display');
        katexElements.forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.innerHTML = parent.innerHTML.replace(/<span class="katex[^>]*>.*?<\/span>/g, '');
            }
        });
    }
    
    updatePlaceholder() {
        const placeholders = {
            markdown: `# Sample Markdown

## Features
- **Bold text** and *italic text*
- Code blocks with syntax highlighting
- Tables and lists
- Math equations: $E = mc^2$
- Mermaid diagrams

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |

\`\`\`mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\``,
            
            latex: `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

\\title{Sample LaTeX Document}
\\author{Content Previewer}

\\section{Mathematics}

Inline math: $E = mc^2$

Display math:
\\begin{equation}
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\\end{equation}

Matrix:
$$\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}$$

\\section{Text}
This is a sample LaTeX document with mathematical expressions.

\\end{document}`,
            
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Sample HTML</title>
    <style>
        .highlight { background: yellow; }
        .math { color: blue; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Sample HTML Content</h1>
    
    <h2>Features</h2>
    <ul>
        <li>HTML rendering</li>
        <li><span class="highlight">Styled content</span></li>
        <li>Interactive elements</li>
    </ul>
    
    <h2>Math (using KaTeX)</h2>
    <p>Inline: <span class="math">$E = mc^2$</span></p>
    <p>Display: $$\\int_0^1 x^2 dx = \\frac{1}{3}$$</p>
    
    <h2>Table</h2>
    <table border="1" style="border-collapse: collapse;">
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Cell 1</td><td>Cell 2</td></tr>
    </table>
</body>
</html>`
        };
        
        this.inputArea.placeholder = placeholders[this.currentFormat];
    }
    
    async updatePreview() {
        const content = this.inputArea.value.trim();
        
        if (!content) {
            this.previewContent.innerHTML = '<p style="color: #656d76; font-style: italic;">Preview will appear here...</p>';
            return;
        }
        
        try {
            let html = '';
            
            switch (this.currentFormat) {
                case 'markdown':
                    html = await this.renderMarkdown(content);
                    break;
                case 'latex':
                    html = await this.renderLatex(content);
                    break;
                case 'html':
                    html = this.renderHtml(content);
                    break;
            }
            
            this.previewContent.innerHTML = html;
            
            // Render math equations
            if (this.currentFormat === 'latex') {
                this.renderMathJax();
            } else if (this.currentFormat === 'markdown' || this.currentFormat === 'html') {
                this.renderMath();
            }
            
            // Render Mermaid diagrams for markdown
            if (this.currentFormat === 'markdown') {
                this.renderMermaid();
            }
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    async renderMarkdown(content) {
        return marked.parse(content);
    }
    
    async renderLatex(content) {
        let html = '<div class="latex-document tex2jax_process">';
        const cleanContent = this.extractLatexContent(content);
        html += await this.processLatexContent(cleanContent);
        html += '</div>';
        return html;
    }
    
    extractLatexContent(content) {
        let cleanContent = content;
        
        // Remove everything before \begin{document}
        const docStart = cleanContent.indexOf('\\begin{document}');
        if (docStart !== -1) {
            cleanContent = cleanContent.substring(docStart + '\\begin{document}'.length);
        }
        
        // Remove \end{document}
        const docEnd = cleanContent.lastIndexOf('\\end{document}');
        if (docEnd !== -1) {
            cleanContent = cleanContent.substring(0, docEnd);
        }
        
        // Remove comments
        cleanContent = cleanContent.replace(/%.*$/gm, '');
        
        return cleanContent.trim();
    }
    
    async processLatexContent(content) {
        let html = '';
        let i = 0;
        
        while (i < content.length) {
            // Skip whitespace
            while (i < content.length && /\s/.test(content[i])) {
                i++;
            }
            
            if (i >= content.length) break;
            
            // Check for environments
            if (content.substr(i).startsWith('\\begin{')) {
                const envResult = this.extractEnvironment(content, i);
                if (envResult) {
                    html += this.renderEnvironment(envResult.name, envResult.content);
                    i = envResult.endIndex;
                    continue;
                }
            }
            
            // Check for display math $$
            if (content.substr(i, 2) === '$$') {
                const mathResult = this.extractDisplayMath(content, i);
                if (mathResult) {
                    html += `<div class="math-display">$$${mathResult.content}$$</div>`;
                    i = mathResult.endIndex;
                    continue;
                }
            }
            
            // Extract text until next special element
            let text = '';
            while (i < content.length && 
                   !content.substr(i).startsWith('\\begin{') &&
                   content.substr(i, 2) !== '$$') {
                text += content[i];
                i++;
            }
            
            if (text.trim()) {
                const processedText = this.processTextWithMath(text.trim());
                html += `<p>${processedText}</p>`;
            }
        }
        
        return html;
    }
    
    extractEnvironment(content, startIndex) {
        const beginMatch = content.substr(startIndex).match(/\\begin\{([^}]+)\}/);
        if (!beginMatch) return null;
        
        const envName = beginMatch[1];
        const beginLength = beginMatch[0].length;
        const endPattern = `\\end{${envName}}`;
        const endIndex = content.indexOf(endPattern, startIndex + beginLength);
        
        if (endIndex === -1) return null;
        
        const envContent = content.substring(startIndex + beginLength, endIndex);
        return {
            name: envName,
            content: envContent,
            endIndex: endIndex + endPattern.length
        };
    }
    
    extractDisplayMath(content, startIndex) {
        const endIndex = content.indexOf('$$', startIndex + 2);
        if (endIndex === -1) return null;
        
        const mathContent = content.substring(startIndex + 2, endIndex);
        return {
            content: mathContent,
            endIndex: endIndex + 2
        };
    }
    
    renderEnvironment(envName, envContent) {
        switch (envName) {
            case 'equation':
                const labelMatch = envContent.match(/\\label\{([^}]+)\}/);
                const label = labelMatch ? labelMatch[1] : '';
                const cleanContent = envContent.replace(/\\label\{[^}]+\}/g, '').trim();
                
                return `<div class="math-display">
                    \\begin{equation}
                    ${label ? `\\label{${label}}` : ''}
                    ${cleanContent}
                    \\end{equation}
                </div>`;
            
            case 'align':
            case 'align*':
            case 'eqnarray':
            case 'eqnarray*':
            case 'gather':
            case 'gather*':
            case 'multline':
            case 'multline*':
                return `<div class="math-display">
                    \\begin{${envName}}
                    ${envContent}
                    \\end{${envName}}
                </div>`;
            
            case 'itemize':
                const items = envContent.split('\\item').filter(item => item.trim());
                let html = '<ul class="latex-itemize">';
                items.forEach(item => {
                    html += `<li>${this.processTextWithMath(item.trim())}</li>`;
                });
                html += '</ul>';
                return html;
            
            case 'enumerate':
                const enumItems = envContent.split('\\item').filter(item => item.trim());
                let enumHtml = '<ol class="latex-enumerate">';
                enumItems.forEach(item => {
                    enumHtml += `<li>${this.processTextWithMath(item.trim())}</li>`;
                });
                enumHtml += '</ol>';
                return enumHtml;
            
            default:
                return `<div class="latex-environment">
                    <div class="env-label">\\begin{${envName}}</div>
                    <div class="env-content">${this.processTextWithMath(envContent)}</div>
                    <div class="env-label">\\end{${envName}}</div>
                </div>`;
        }
    }
    
    processTextWithMath(text) {
        let processed = text;
        
        // Handle common LaTeX commands
        processed = processed.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
        processed = processed.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        processed = processed.replace(/\\text\{([^}]+)\}/g, '$1');
        processed = processed.replace(/\\label\{([^}]+)\}/g, '<span class="latex-label">[label: $1]</span>');
        processed = processed.replace(/\\ref\{([^}]+)\}/g, '<span class="latex-ref">[ref: $1]</span>');
        
        return processed;
    }
    
    renderHtml(content) {
        return content;
    }
    
    renderMathJax() {
        if (!window.MathJax) return;
        
        window.MathJax.startup.promise.then(() => {
            if (window.MathJax.texReset) {
                window.MathJax.texReset();
            }
            
            window.MathJax.typesetClear([this.previewContent]);
            
            setTimeout(() => {
                window.MathJax.typesetPromise([this.previewContent]).catch((err) => {
                    console.error('MathJax rendering error:', err);
                });
            }, 50);
        }).catch((err) => {
            console.error('MathJax startup error:', err);
        });
    }
    
    renderMath() {
        renderMathInElement(this.previewContent, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\[', right: '\\]', display: true},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false,
            errorColor: '#cc0000',
            macros: {
                "\\RR": "\\mathbb{R}",
                "\\CC": "\\mathbb{C}",
                "\\NN": "\\mathbb{N}",
                "\\ZZ": "\\mathbb{Z}",
                "\\QQ": "\\mathbb{Q}",
                "\\FF": "\\mathbb{F}"
            },
            trust: (context) => ['\\url', '\\href', '\\includegraphics'].includes(context.command),
            strict: false
        });
    }
    
    async renderMermaid() {
        const mermaidElements = this.previewContent.querySelectorAll('code.language-mermaid');
        
        for (let i = 0; i < mermaidElements.length; i++) {
            const element = mermaidElements[i];
            const code = element.textContent.trim();
            const id = `mermaid-${Date.now()}-${i}`;
            
            // Skip rendering if code is too short or obviously incomplete
            if (code.length < 10 || this.isMermaidIncomplete(code)) {
                // Show a gentle placeholder instead of error
                const wrapper = document.createElement('div');
                wrapper.className = 'mermaid-placeholder';
                wrapper.innerHTML = `<div style="
                    padding: 1rem; 
                    background: #f6f8fa; 
                    border: 2px dashed #d1d9e0; 
                    border-radius: 6px; 
                    text-align: center; 
                    color: #656d76;
                    font-style: italic;
                ">✏️ Continue typing your Mermaid diagram...</div>`;
                element.parentNode.replaceWith(wrapper);
                continue;
            }
            
            try {
                const { svg } = await mermaid.render(id, code);
                const wrapper = document.createElement('div');
                wrapper.className = 'mermaid';
                wrapper.innerHTML = svg;
                element.parentNode.replaceWith(wrapper);
            } catch (error) {
                console.error('Mermaid rendering error:', error);
                
                // Show a more user-friendly error message
                const wrapper = document.createElement('div');
                wrapper.className = 'mermaid-error';
                wrapper.innerHTML = `<div style="
                    padding: 1rem; 
                    background: #fff8f8; 
                    border: 1px solid #f8d7da; 
                    border-radius: 6px; 
                    color: #721c24;
                ">
                    <strong>Mermaid Syntax Issue</strong><br>
                    <small>Check your diagram syntax or continue editing...</small>
                </div>`;
                element.parentNode.replaceWith(wrapper);
            }
        }
    }
    
    isMermaidIncomplete(code) {
        // Check for common patterns that indicate incomplete Mermaid code
        const lines = code.split('\n').map(line => line.trim()).filter(line => line);
        
        // Too few lines for a complete diagram
        if (lines.length < 2) return true;
        
        // Check for incomplete graph declarations
        if (code.match(/^(graph|flowchart|sequenceDiagram|classDiagram|gitgraph|pie|journey|gantt)\s*$/m)) {
            return true;
        }
        
        // Check for incomplete arrows or connections
        if (code.includes('-->') && code.split('-->').length < 2) return true;
        if (code.includes('->') && code.split('->').length < 2) return true;
        
        // Check for unmatched brackets or quotes
        const openBrackets = (code.match(/\[/g) || []).length;
        const closeBrackets = (code.match(/\]/g) || []).length;
        if (openBrackets !== closeBrackets) return true;
        
        const openParens = (code.match(/\(/g) || []).length;
        const closeParens = (code.match(/\)/g) || []).length;
        if (openParens !== closeParens) return true;
        
        return false;
    }
    
    showError(message) {
        this.previewContent.innerHTML = `<div class="error">Error: ${message}</div>`;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContentPreviewer();
});