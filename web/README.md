# Web Interface for Code Generation System

A beautiful, interactive web-based user interface for the Code Generation System.

## Features

✨ **Modern Design**
- Responsive layout that works on all devices
- Smooth animations and transitions
- Beautiful gradient backgrounds
- Professional color scheme

🎨 **Interactive Components**
- Tab-based editor interface
- Real-time specification editor
- Live output preview
- Syntax-highlighted code examples

📱 **User-Friendly Interface**
- Intuitive navigation bar
- Quick-start buttons
- Multiple specification examples
- One-click template loading

🚀 **Getting Started**
- Hero section with quick start options
- Feature showcase
- How-it-works step guide
- Technology stack display

## File Structure

```
web/
├── index.html          # Main HTML file
├── styles.css          # Complete styling
├── script.js           # Interactive JavaScript
└── README.md           # This file
```

## How to Use

### 1. Open in Browser

Simply open `index.html` in your web browser:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Direct open
open index.html  # macOS
start index.html # Windows
```

Then navigate to:
- Python: `http://localhost:8000`
- Node.js: `http://localhost:8080`
- Direct: Open file directly in browser

### 2. Generate Applications

1. **Write Specification** - Describe your app in the editor
   - Use one of the example templates
   - Customize specification with your requirements
   - Choose frameworks and database

2. **Configure Options**
   - Select frontend framework
   - Choose backend framework
   - Pick database type
   - Set deployment target

3. **Generate Project**
   - Click "Generate Application" button
   - Result modal shows generated structure
   - Download project as ZIP

### 3. Using Examples

Click the "Examples" tab to load pre-built examples:

**Task Management**
- Complete task management system
- Team collaboration features
- Rich data models and API

**E-Commerce Platform**
- Full product catalog
- Shopping cart and orders
- Payment integration ready

**Analytics Dashboard**
- Real-time metrics
- Data visualization
- Report generation

## Sections

### Navigation Bar
- Logo and branding
- Quick navigation links
- Sticky header

### Hero Section
- Eye-catching headline
- Call-to-action buttons
- Code window visualization

### Features Section
- 6 key feature cards
- Hover animations
- Icon indicators

### How It Works
- 4-step process visualization
- Clear workflow diagram

### Generator Section (Main)
- **Left Panel**: Specification editor
  - Project name input
  - Specification textarea
  - Framework selection dropdowns
  - Configuration checkboxes
  
- **Right Panel**: Output preview
  - Visual file tree
  - Project structure
  - Generated files list

### Tech Stack Section
- Frontend technologies
- Backend technologies
- Infrastructure tools

### Docs Section
- Links to documentation
- Resource cards
- Getting started guides

### Footer
- Quick links
- Resource links
- Copyright information

## Customization

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary: #3b82f6;           /* Blue */
    --secondary: #10b981;         /* Green */
    --dark: #1f2937;              /* Dark gray */
    --light: #f9fafb;             /* Light gray */
    /* ... more colors */
}
```

### Modify Content

Edit the HTML sections:
- `<section id="features">` - Feature cards
- `<section id="how-it-works">` - Process steps
- `<section id="tech-stack">` - Technology lists

### Add New Examples

In `script.js`, add to the `examples` object:

```javascript
const examples = {
    task: '...',      // Existing
    ecommerce: '...', // Existing
    yourapp: `# Your App\n...`  // Add new
};
```

Then add button in HTML:

```html
<button class="btn btn-secondary btn-small" data-example="yourapp">
    Load Example
</button>
```

## Features Breakdown

### Responsive Design
- Desktop: Full layout with two-column generator
- Tablet: Adjusted spacing and sizing
- Mobile: Single column, stacked layout

### Accessibility
- Semantic HTML structure
- Proper color contrast
- Keyboard navigation support
- Screen reader friendly

### Performance
- Lightweight CSS (no external frameworks)
- Optimized JavaScript
- Smooth animations with GPU acceleration
- Min/max-width for container constraints

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Customization Examples

### Change Primary Color to Purple

```css
:root {
    --primary: #a855f7;           /* Purple instead of blue */
    --primary-dark: #9333ea;
    --primary-light: #c084fc;
}
```

### Add New Section

```html
<section class="my-section">
    <div class="container">
        <h2 class="section-title">My Section</h2>
        <!-- Content here -->
    </div>
</section>
```

Add CSS:
```css
.my-section {
    background: white;
    padding: 80px 20px;
}
```

### Modify Tab Content

Edit the form groups in the Editor tab:

```html
<div class="form-group">
    <label for="myField">My Field</label>
    <input type="text" id="myField" placeholder="...">
</div>
```

## Integration with Backend

To connect to the actual backend API:

1. Update the form submission in `script.js`:

```javascript
function handleGenerate(e) {
    e.preventDefault();
    const formData = {/* ... */};
    
    // Replace setTimeout with actual API call
    fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => showResults(data));
}
```

2. Configure API endpoint:

```javascript
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
```

## Styling Reference

### Button Classes
- `.btn` - Base button styles
- `.btn-primary` - Primary action (blue)
- `.btn-secondary` - Secondary action (outlined)
- `.btn-large` - Larger button size
- `.btn-small` - Smaller button size

### Text Classes
- `.section-title` - Large section headings
- `.hero-title` - Extra large hero titles
- `.text-center` - Center text alignment

### Layout Classes
- `.container` - Max-width container
- `.form-row` - Two-column form layout
- `grid-template-columns: repeat(auto-fit, ...)` - Responsive grid

## Keyboard Shortcuts

- `Tab` - Navigate through form elements
- `Enter` - Submit form or activate button
- `Space` - Toggle checkbox

## Tips for Best Experience

1. **Write Clear Specifications**
   - Use proper formatting
   - Describe requirements clearly
   - Include data models

2. **Choose Right Technologies**
   - Select based on project needs
   - Consider team expertise
   - Think about scalability

3. **Enable Options**
   - Include tests for quality
   - Add documentation for clarity
   - Enable CI/CD for automation

4. **Review Generated Code**
   - Check the file structure
   - Review generated endpoints
   - Customize as needed

## Support

For issues or questions:
1. Check the documentation in the repo
2. Review the main README.md
3. Look at architecture documentation
4. Check usage examples

## License

MIT License - Feel free to use and modify!

---

**Enjoy generating applications! 🚀**
