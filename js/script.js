/*=================================================================
  ASHWIN UPADHYAY - ELITE MLOPS & GENAI PORTFOLIO
  JavaScript: Particle System, Animations, & Interactive Features
  =================================================================*/

// ========== UTILITY FUNCTIONS ==========
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ========== PARTICLE CANVAS (THREE.JS) ==========
class ParticleSystem {
    constructor() {
        this.canvas = $('#particleCanvas');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: true,
            antialias: true 
        });
        
        this.init();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        // Create material with neon glow
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.015,
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particleMesh);
        
        // Position camera
        this.camera.position.z = 3;
        
        // Handle resize
        window.addEventListener('resize', () => this.onResize());
        
        // Start animation
        this.animate();
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate particles slowly
        if (this.particleMesh) {
            this.particleMesh.rotation.y += 0.0005;
            this.particleMesh.rotation.x += 0.0002;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ========== HEADER & NAVIGATION ==========
class Navigation {
    constructor() {
        this.header = $('.header');
        this.navbar = $('.navbar');
        this.menuIcon = $('#menu-icon');
        this.navLinks = $$('.navbar a');
        
        this.init();
    }
    
    init() {
        // Sticky header on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.header.classList.add('sticky');
            } else {
                this.header.classList.remove('sticky');
            }
        });
        
        // Mobile menu toggle
        if (this.menuIcon) {
            this.menuIcon.addEventListener('click', () => {
                this.navbar.classList.toggle('active');
                this.menuIcon.classList.toggle('active');
            });
        }
        
        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navbar.classList.remove('active');
                if (this.menuIcon) this.menuIcon.classList.remove('active');
            });
        });
    }
    
    updateActiveLink() {
        const sections = $$('section');
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ========== SYSTEM LOGS & VISITOR COUNTER ==========
class SystemLogs {
    constructor() {
        this.visitorCountElem = $('#visitorCount');
        this.init();
    }
    
    init() {
        // Generate random visitor count (or integrate with real analytics)
        const baseCount = 1247;
        const randomAdd = Math.floor(Math.random() * 50);
        const totalVisitors = baseCount + randomAdd;
        
        if (this.visitorCountElem) {
            this.animateCount(this.visitorCountElem, 0, totalVisitors, 2000);
        }
        
        // Store in localStorage for persistence
        localStorage.setItem('visitorCount', totalVisitors);
    }
    
    animateCount(elem, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                elem.textContent = Math.floor(end);
                clearInterval(timer);
            } else {
                elem.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ========== COUNTER ANIMATIONS ==========
class CounterAnimator {
    constructor() {
        this.counters = $$('[data-count]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(elem) {
        const target = parseInt(elem.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                elem.textContent = target;
                clearInterval(timer);
            } else {
                elem.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ========== SKILL CUBE CONTROLLER ==========
class SkillCubeController {
    constructor() {
        this.controlBtns = $$('.control-btn');
        this.cubeFaces = $$('.cube-face');
        this.currentFace = 0;
        
        this.init();
    }
    
    init() {
        // Show first face by default
        if (this.cubeFaces.length > 0) {
            this.cubeFaces[0].classList.add('active');
            this.controlBtns[0].classList.add('active');
        }
        
        // Control button click handlers
        this.controlBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.switchFace(index);
            });
        });
        
        // Auto-rotate every 5 seconds
        setInterval(() => {
            this.currentFace = (this.currentFace + 1) % this.cubeFaces.length;
            this.switchFace(this.currentFace);
        }, 5000);
    }
    
    switchFace(index) {
        // Remove active from all
        this.cubeFaces.forEach(face => face.classList.remove('active'));
        this.controlBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active to selected
        if (this.cubeFaces[index]) {
            this.cubeFaces[index].classList.add('active');
        }
        if (this.controlBtns[index]) {
            this.controlBtns[index].classList.add('active');
        }
        
        this.currentFace = index;
    }
}

// ========== SCROLL REVEAL ANIMATIONS ==========
class ScrollReveal {
    constructor() {
        this.revealElements = $$('[data-reveal]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        this.revealElements.forEach(elem => observer.observe(elem));
    }
}

// ========== CERTIFICATIONS SWIPER ==========
class CertificationsCarousel {
    constructor() {
        this.initSwiper();
    }
    
    initSwiper() {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.certifications-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                },
            });
        }
    }
}

// ========== PROJECT MODAL ==========
class ProjectModal {
    constructor() {
        this.modal = $('#projectModal');
        this.modalBody = $('#modalBody');
        this.modalClose = $('#modalClose');
        this.modalOverlay = $('#modalOverlay');
        this.projectBtns = $$('.project-btn');
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        // Project button click handlers
        this.projectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectType = btn.getAttribute('data-project');
                this.openModal(projectType);
            });
        });
        
        // Close modal handlers
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }
    
    openModal(projectType) {
        const projectData = this.getProjectData(projectType);
        
        this.modalBody.innerHTML = `
            <h2 style="font-size: 3rem; margin-bottom: 2rem;">${projectData.title}</h2>
            <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
                ${projectData.metrics.map(m => `
                    <span style="padding: 0.8rem 1.5rem; background: rgba(0,255,255,0.1); 
                                 border: 1px solid var(--color-neon-blue); border-radius: 6px; 
                                 font-size: 1.3rem; color: var(--color-neon-blue);">
                        ${m}
                    </span>
                `).join('')}
            </div>
            <p style="font-size: 1.6rem; line-height: 1.8; margin-bottom: 2rem; 
                      color: var(--color-text-secondary);">
                ${projectData.description}
            </p>
            <h3 style="font-size: 2rem; margin-bottom: 1rem;">Technical Stack</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
                ${projectData.tech.map(t => `
                    <span style="padding: 0.8rem 1.5rem; background: rgba(255,255,255,0.05); 
                                 border: 1px solid var(--color-border); border-radius: 6px; 
                                 font-size: 1.3rem; color: var(--color-text-tertiary);">
                        ${t}
                    </span>
                `).join('')}
            </div>
            <h3 style="font-size: 2rem; margin-bottom: 1rem;">Key Achievements</h3>
            <ul style="list-style: none; padding: 0; font-size: 1.5rem; 
                       color: var(--color-text-secondary); line-height: 2;">
                ${projectData.achievements.map(a => `
                    <li style="margin-bottom: 1rem; display: flex; align-items: start; gap: 1rem;">
                        <span style="color: var(--color-electric-green); font-size: 1.8rem;">✓</span>
                        ${a}
                    </li>
                `).join('')}
            </ul>
        `;
        
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    getProjectData(type) {
        const projects = {
            etl: {
                title: 'ETL Pipeline Automation',
                metrics: ['94.9% Data Freshness', 'Multi-Cloud Orchestration', 'Real-Time Processing'],
                description: 'Engineered a production-grade ETL pipeline using Apache Airflow (DAG Authoring Certified) for workflow orchestration, integrated with Apache Kafka for real-time data streaming and Snowflake as the cloud data warehouse. Deployed across AWS Glue and Azure Data Factory to achieve multi-cloud resilience and fault tolerance. The pipeline handles 2TB+ daily data volume with sub-second latency SLAs.',
                tech: ['Apache Airflow', 'Apache Kafka', 'Snowflake', 'AWS Glue', 'Azure Data Factory', 'Python', 'Docker', 'Kubernetes'],
                achievements: [
                    'Achieved 94.9% data freshness with automated quality validation',
                    'Reduced deployment time by 60% through containerization and CI/CD automation',
                    'Implemented fault-tolerant architecture with automatic failover across cloud providers',
                    'Built comprehensive monitoring with Prometheus + Grafana for real-time observability',
                    'Optimized cost by 35% through intelligent data partitioning and compression'
                ]
            },
            shar: {
                title: 'SHAR: Suspicious Human Activity Recognition',
                metrics: ['Real-Time Inference', 'ViT-LSTM Architecture', 'Edge Deployment'],
                description: 'Developed a cutting-edge computer vision system for suspicious activity detection using Vision Transformer (ViT) combined with LSTM for temporal sequence modeling. Built in PyTorch with custom data augmentation pipelines and optimized for edge deployment with TensorRT quantization. Achieved 89% accuracy on custom surveillance dataset with <100ms inference latency on NVIDIA Jetson hardware.',
                tech: ['PyTorch', 'Vision Transformer (ViT)', 'LSTM', 'TensorRT', 'OpenCV', 'CUDA', 'Docker', 'MLflow'],
                achievements: [
                    'Architected hybrid ViT-LSTM model achieving 89% accuracy on complex activity patterns',
                    'Optimized inference pipeline to <100ms latency using TensorRT INT8 quantization',
                    'Deployed on edge devices (NVIDIA Jetson) with 4x throughput improvement',
                    'Implemented robust data augmentation reducing overfitting by 23%',
                    'Built MLOps pipeline with MLflow for experiment tracking and model versioning'
                ]
            },
            fraud: {
                title: 'Fraud Detection with Explainable AI (XAI)',
                metrics: ['0.98 AUC Score', '0.90 Transparency Index', 'Production Deployed'],
                description: 'Built an enterprise-grade fraud detection system using XGBoost with integrated SHAP (SHapley Additive exPlanations) for model interpretability. The system processes 500K+ transactions daily with real-time scoring via containerized Flask API. Includes Power BI dashboard for stakeholder transparency and regulatory compliance. Deployed on Kubernetes with horizontal auto-scaling and comprehensive monitoring.',
                tech: ['XGBoost', 'SHAP', 'Flask', 'Docker', 'Kubernetes', 'Power BI', 'PostgreSQL', 'Redis', 'Prometheus'],
                achievements: [
                    'Achieved 0.98 AUC with 0.90 transparency score using SHAP explanations',
                    'Reduced false positives by 42% through ensemble feature engineering',
                    'Deployed containerized API handling 500K+ daily predictions with 99.9% uptime',
                    'Built interactive Power BI dashboards for regulatory compliance reporting',
                    'Implemented A/B testing framework for continuous model improvement'
                ]
            }
        };
        
        return projects[type] || projects.etl;
    }
}

// ========== CONTACT FORM HANDLER ==========
class ContactFormHandler {
    constructor() {
        this.form = $('#contactForm');
        this.formSuccess = $('#formSuccess');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    handleSubmit() {
        // Simulate form submission
        this.form.style.display = 'none';
        this.formSuccess.classList.add('show');
        
        // Add particle burst animation
        this.createParticleBurst();
        
        // Reset after 5 seconds
        setTimeout(() => {
            this.form.style.display = 'flex';
            this.formSuccess.classList.remove('show');
            this.form.reset();
        }, 5000);
    }
    
    createParticleBurst() {
        // Visual feedback with CSS animation
        const burst = document.createElement('div');
        burst.className = 'particle-burst-animation';
        burst.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, var(--color-neon-blue) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: burst 0.8s ease-out;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(burst);
        
        setTimeout(() => burst.remove(), 800);
    }
}

// ========== SOCIAL LINK PARTICLE EFFECTS ==========
class SocialLinkEffects {
    constructor() {
        this.socialBtns = $$('.social-btn');
        this.init();
    }
    
    init() {
        this.socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createClickEffect(e);
            });
        });
    }
    
    createClickEffect(e) {
        const ripple = document.createElement('div');
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            background: var(--color-neon-blue);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        e.currentTarget.style.position = 'relative';
        e.currentTarget.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// ========== BACK TO TOP BUTTON ==========
class BackToTop {
    constructor() {
        this.btn = $('#backToTop');
        this.init();
    }
    
    init() {
        if (!this.btn) return;
        
        this.btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========== HERO STAT COUNTERS ==========
class HeroStatCounters {
    constructor() {
        this.statElements = $$('.hero-stats .stat-value[data-target]');
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            this.statElements.forEach(elem => {
                const target = parseInt(elem.getAttribute('data-target'));
                this.animateValue(elem, 0, target, 2500);
            });
        });
    }
    
    animateValue(elem, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                elem.childNodes[0].textContent = end;
                clearInterval(timer);
            } else {
                elem.childNodes[0].textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ========== CERTIFICATION INTERACTIONS ==========
class CertificationManager {
    constructor() {
        this.certActions = $$('.cert-action');
        this.certCards = $$('.cert-card-elite');
        this.init();
    }
    
    init() {
        // Add hover effects
        this.certCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.activateCard(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.deactivateCard(card);
            });
        });
        
        // Credential link handlers
        this.certActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const credentialId = btn.getAttribute('data-credential');
                this.showCredentialModal(credentialId);
            });
        });
    }
    
    activateCard(card) {
        // Add dynamic glow effect
        const glow = card.querySelector('.cert-glow');
        if (glow) {
            glow.style.opacity = '0.6';
        }
    }
    
    deactivateCard(card) {
        const glow = card.querySelector('.cert-glow');
        if (glow) {
            glow.style.opacity = '';
        }
    }
    
    showCredentialModal(credentialId) {
        // Create notification toast
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            padding: 2rem 3rem;
            background: var(--gradient-surface);
            border: 2px solid var(--color-neon-blue);
            border-radius: 12px;
            color: var(--color-text-primary);
            font-size: 1.5rem;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.4s ease-out, slideOutRight 0.4s ease-out 2.6s;
            box-shadow: 0 10px 40px rgba(0, 255, 255, 0.3);
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i data-lucide="check-circle" style="color: var(--color-electric-green);"></i>
                <span>Credential verification requested!</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Initialize Lucide icons for toast
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        setTimeout(() => toast.remove(), 3000);
        
        // Log for demonstration
        console.log(`%cCredential Requested: ${credentialId}`, 'color: #00ffff; font-size: 14px; font-weight: bold;');
    }
}

// ========== CERT STAT COUNTERS ==========
class CertStatCounters {
    constructor() {
        this.statNumbers = $$('.cert-stat-number[data-count]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        this.statNumbers.forEach(stat => observer.observe(stat));
    }
    
    animateCounter(elem) {
        const target = parseInt(elem.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                elem.textContent = target;
                clearInterval(timer);
            } else {
                elem.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ========== ENHANCED SCROLL ANIMATIONS ==========
class EnhancedScrollEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Parallax effect for certification cards
        window.addEventListener('scroll', () => {
            const certCards = $$('.cert-card-elite');
            certCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const scrollPercent = (windowHeight - rect.top) / windowHeight;
                    const translateY = (scrollPercent - 0.5) * 20;
                    
                    // Subtle parallax
                    card.style.transform = `translateY(${translateY}px)`;
                }
            });
        });
    }
}

// ========== ADD DYNAMIC CSS ANIMATIONS ==========
const addDynamicStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(20);
                opacity: 0;
            }
        }
        
        @keyframes burst {
            to {
                transform: translate(-50%, -50%) scale(5);
                opacity: 0;
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .menu-icon.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .menu-icon.active span:nth-child(2) {
            opacity: 0;
        }
        
        .menu-icon.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
    `;
    document.head.appendChild(style);
};

// ========== INITIALIZE ALL MODULES ==========
document.addEventListener('DOMContentLoaded', () => {
    // Add dynamic styles
    addDynamicStyles();
    
    // Initialize particle system
    if (typeof THREE !== 'undefined') {
        new ParticleSystem();
    }
    
    // Initialize all components
    new Navigation();
    new SystemLogs();
    new CounterAnimator();
    new SkillCubeController();
    new ScrollReveal();
    new CertificationsCarousel();
    new ProjectModal();
    new ContactFormHandler();
    new SocialLinkEffects();
    new BackToTop();
    new HeroStatCounters();
    new CertificationManager();
    new CertStatCounters();
    new EnhancedScrollEffects();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('%c🚀 Portfolio Initialized Successfully', 
        'color: #00ffff; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with precision for Ashwin Upadhyay', 
        'color: #39ff14; font-size: 12px;');
});

// ========== PERFORMANCE OPTIMIZATION ==========
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = $$('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScroll = (target) => {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        
        requestAnimationFrame(animation);
    };
    
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target) smoothScroll(target);
        });
    });
}
