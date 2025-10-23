# Customization Guide - Ashwin Upadhyay Portfolio

## Quick Start Customization

### 1. Update Personal Information

#### In `index.html`:

**Hero Section (Lines 40-100)**
- Update headline text
- Modify statistics values
- Change social media links

**Projects Section (Lines 260-360)**
- Replace project details
- Update GitHub/demo links
- Modify metrics and tech stacks

**Contact Section (Lines 380-430)**
- Update email address
- Add/remove social links

### 2. Color Theme Customization

#### In `css/style.css` (Lines 10-15):

```css
:root {
    --color-neon-blue: #00ffff;      /* Primary accent */
    --color-electric-green: #39ff14;  /* Secondary accent */
    --color-cyber-purple: #bb00ff;    /* Tertiary accent */
}
```

**Popular Alternative Themes:**

**Warm Tech:**
```css
--color-neon-blue: #ff6b35;    /* Orange */
--color-electric-green: #f7c59f; /* Peach */
--color-cyber-purple: #004e89;  /* Navy */
```

**Cool Minimal:**
```css
--color-neon-blue: #5eead4;    /* Teal */
--color-electric-green: #bef264; /* Lime */
--color-cyber-purple: #818cf8;  /* Indigo */
```

**Matrix Green:**
```css
--color-neon-blue: #00ff41;    /* Matrix Green */
--color-electric-green: #00ff41;
--color-cyber-purple: #003b00;  /* Dark Green */
```

### 3. Typography Changes

#### In `css/style.css` (Lines 16-17):

```css
:root {
    --font-primary: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}
```

**Alternative Font Combinations:**

**Modern Sans:**
```css
--font-primary: 'Poppins', sans-serif;
--font-mono: 'Fira Code', monospace;
```

**Elegant Serif:**
```css
--font-primary: 'Playfair Display', serif;
--font-mono: 'IBM Plex Mono', monospace;
```

**Tech Focused:**
```css
--font-primary: 'Space Grotesk', sans-serif;
--font-mono: 'Source Code Pro', monospace;
```

### 4. Particle System Adjustments

#### In `js/script.js` (Lines 20-25):

```javascript
const particlesCount = 1500;  // Reduce for performance (500-2000)
```

**Performance Presets:**

**High Performance:**
```javascript
const particlesCount = 500;   // Fewer particles
particlesMaterial.size = 0.02; // Larger particles
```

**Balanced:**
```javascript
const particlesCount = 1500;  // Default
particlesMaterial.size = 0.015;
```

**Ultra Visual:**
```javascript
const particlesCount = 3000;  // More particles
particlesMaterial.size = 0.01; // Smaller particles
```

### 5. Animation Speed

#### In `css/style.css` (Lines 28-30):

```css
:root {
    --transition-fast: 0.2s;   /* Quick interactions */
    --transition-medium: 0.4s; /* UI transitions */
    --transition-slow: 0.6s;   /* Section animations */
}
```

**Slower, More Dramatic:**
```css
--transition-fast: 0.3s;
--transition-medium: 0.6s;
--transition-slow: 0.9s;
```

**Faster, Snappier:**
```css
--transition-fast: 0.15s;
--transition-medium: 0.3s;
--transition-slow: 0.45s;
```

### 6. Add New Project Cards

#### In `index.html` (after line 350):

```html
<div class="project-card" data-reveal="tilt" data-delay="400">
    <div class="project-image">
        <div class="project-badge">YOUR CATEGORY</div>
        <div class="project-overlay"></div>
    </div>
    <div class="project-content">
        <h3>Your Project Name</h3>
        <div class="project-metrics">
            <span class="metric">
                <i data-lucide="zap"></i> Metric 1
            </span>
            <span class="metric">
                <i data-lucide="shield"></i> Metric 2
            </span>
        </div>
        <p>Your project description here.</p>
        <div class="project-tech">
            <span class="tech-tag">Tech 1</span>
            <span class="tech-tag">Tech 2</span>
        </div>
        <button class="project-btn" data-project="yourproject">
            <i data-lucide="external-link"></i>
            View Details
        </button>
    </div>
</div>
```

#### Then add project data in `js/script.js` (Lines 430-450):

```javascript
yourproject: {
    title: 'Your Project Title',
    metrics: ['Metric 1', 'Metric 2'],
    description: 'Detailed description...',
    tech: ['Tech1', 'Tech2', 'Tech3'],
    achievements: [
        'Achievement 1',
        'Achievement 2',
    ]
}
```

### 7. Modify Achievement Cards

#### In `index.html` (around line 230):

```html
<div class="achievement-card" data-reveal="fade-up" data-delay="400">
    <div class="achievement-icon YOUR_STYLE">
        <i data-lucide="YOUR_ICON"></i>
    </div>
    <div class="achievement-content">
        <h3>Your Achievement Title</h3>
        <div class="achievement-stat">
            <span class="stat-number" data-count="YOUR_NUMBER">0</span>
            <span class="stat-suffix">YOUR_UNIT</span>
        </div>
        <p>Achievement description</p>
        <div class="achievement-badge">
            <span class="badge-icon">🎯</span>
            Badge text
        </div>
    </div>
</div>
```

### 8. Update Skill Cube Domains

#### In `index.html` (Lines 120-200):

Replace content in `.cube-face` elements:

```html
<div class="cube-face face-YOURNAME" data-domain="yourname">
    <div class="face-header">
        <i data-lucide="YOUR_ICON"></i>
        <h3>Your Domain</h3>
    </div>
    <div class="face-content">
        <div class="skill-tag">
            <i data-lucide="check"></i> Skill 1
        </div>
        <!-- Add more skills -->
    </div>
</div>
```

### 9. Social Links

#### In `index.html` (Contact Section):

```html
<a href="YOUR_URL" target="_blank" class="social-btn" data-platform="YOUR_PLATFORM">
    <i data-lucide="YOUR_ICON"></i>
    <span>Platform Name</span>
    <div class="particle-burst"></div>
</a>
```

**Available Lucide Icons:**
- `github`, `linkedin`, `twitter`, `youtube`
- `instagram`, `facebook`, `gitlab`, `codepen`
- `mail`, `globe`, `book-open`, `code-2`

### 10. Disable Particle System (Performance)

#### In `js/script.js` (Line 655):

Comment out:
```javascript
// if (typeof THREE !== 'undefined') {
//     new ParticleSystem();
// }
```

### 11. Change Scroll Animation Style

#### In `css/style.css` (Lines 1170-1185):

Modify reveal animations:
```css
[data-reveal="fade-up"] { 
    transform: translateY(100px);  /* More dramatic */
}

[data-reveal="fade-up"].revealed { 
    transform: translateY(0);
}
```

### 12. Add Google Analytics

#### In `index.html` (after line 15):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR_GA_ID');
</script>
```

## Common Issues & Solutions

### Issue 1: Particles not showing
**Solution:** Ensure Three.js CDN is loaded before script.js

### Issue 2: Icons not appearing
**Solution:** Call `lucide.createIcons()` after DOM loaded

### Issue 3: Mobile menu not working
**Solution:** Check menu-icon click handler in script.js

### Issue 4: Slow animations
**Solution:** Reduce particle count or disable Three.js

### Issue 5: Counter not animating
**Solution:** Ensure IntersectionObserver is supported

## Performance Tips

1. **Optimize Images:**
   - Use WebP format
   - Compress to <200KB
   - Add lazy loading

2. **Minify Code:**
   ```bash
   # CSS
   npx csso css/style.css -o css/style.min.css
   
   # JS
   npx terser js/script.js -o js/script.min.js
   ```

3. **CDN Optimization:**
   - Use specific versions
   - Enable SRI hashes
   - Consider self-hosting

4. **Lighthouse Audit:**
   - Target 90+ performance score
   - Ensure accessibility compliance
   - Optimize SEO metadata

## Deployment

### GitHub Pages
```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

### Netlify
- Drag & drop folder
- Or connect Git repository
- Auto-deploy on push

### Vercel
```bash
vercel --prod
```

## Support

For questions or customization help:
- **Email**: ashwinupadhyay09@gmail.com
- **GitHub Issues**: [Create issue](https://github.com/wtfashwin/portfolio/issues)

---

**Happy Customizing!** 🚀
