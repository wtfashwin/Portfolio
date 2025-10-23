const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

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
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        
        this.init();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create particles with more visual impact and depth
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = window.innerWidth < 768 ? 1000 : 2500;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);
        const sizeArray = new Float32Array(particlesCount);
        
        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Position - create more depth by spreading particles
            posArray[i] = (Math.random() - 0.5) * 30;      // X: wider spread
            posArray[i + 1] = (Math.random() - 0.5) * 30;  // Y: taller spread
            posArray[i + 2] = (Math.random() - 0.5) * 25;  // Z: more depth
            
            // Varying sizes for depth perception
            sizeArray[i / 3] = Math.random() * 0.5 + 0.5;
            
            // Colors - mix of cyan, green, and purple
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                // Cyan
                colorArray[i] = 0;
                colorArray[i + 1] = 1;
                colorArray[i + 2] = 1;
            } else if (colorChoice < 0.66) {
                // Electric Green
                colorArray[i] = 0.22;
                colorArray[i + 1] = 1;
                colorArray[i + 2] = 0.08;
            } else {
                // Cyber Purple
                colorArray[i] = 0.73;
                colorArray[i + 1] = 0;
                colorArray[i + 2] = 1;
            }
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
        
        // Create material with vertex colors and size attenuation
        const particlesMaterial = new THREE.PointsMaterial({
            size: window.innerWidth < 768 ? 0.03 : 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false
        });
        
        this.particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particleMesh);
        
        // Add connecting lines for network effect
        this.createConnections();
        
        // Position camera for full page view
        this.camera.position.z = 8;
        
        // Mouse interaction
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Scroll interaction for depth effect
        window.addEventListener('scroll', () => this.onScroll());
        
        // Handle resize
        window.addEventListener('resize', () => this.onResize());
        
        // Start animation
        this.animate();
    }
    
    createConnections() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        const particlePositions = this.particleMesh.geometry.attributes.position.array;
        const maxDistance = 3; // Increased for more connections
        
        for (let i = 0; i < particlePositions.length; i += 3) {
            for (let j = i + 3; j < particlePositions.length; j += 3) {
                const dx = particlePositions[i] - particlePositions[j];
                const dy = particlePositions[i + 1] - particlePositions[j + 1];
                const dz = particlePositions[i + 2] - particlePositions[j + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < maxDistance && Math.random() > 0.97) {
                    positions.push(particlePositions[i], particlePositions[i + 1], particlePositions[i + 2]);
                    positions.push(particlePositions[j], particlePositions[j + 1], particlePositions[j + 2]);
                    
                    // Vary colors for lines - cyan, green, purple
                    const lineColor = Math.random();
                    if (lineColor < 0.5) {
                        colors.push(0, 1, 1, 0, 1, 1); // Cyan
                    } else if (lineColor < 0.75) {
                        colors.push(0.22, 1, 0.08, 0.22, 1, 0.08); // Green
                    } else {
                        colors.push(0.73, 0, 1, 0.73, 0, 1); // Purple
                    }
                }
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });
        
        this.linesMesh = new THREE.LineSegments(geometry, material);
        this.scene.add(this.linesMesh);
    }
    
    onMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    onScroll() {
        // Create parallax depth effect based on scroll position
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        if (this.particleMesh) {
            // Move particles slightly with scroll for depth effect
            this.particleMesh.position.y = scrollPercent * 2;
        }
        
        if (this.linesMesh) {
            this.linesMesh.position.y = scrollPercent * 2;
        }
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Smooth mouse follow
        this.targetX = this.mouseX * 0.5;
        this.targetY = this.mouseY * 0.5;
        
        // Current time for wave effect
        const time = Date.now() * 0.0001;
        
        // Rotate particles with mouse interaction and continuous motion
        if (this.particleMesh) {
            this.particleMesh.rotation.y += 0.0008;
            this.particleMesh.rotation.x += 0.0003;
            
            // Mouse influence
            this.particleMesh.rotation.y += (this.targetX - this.particleMesh.rotation.y) * 0.05;
            this.particleMesh.rotation.x += (this.targetY - this.particleMesh.rotation.x) * 0.05;
            
            // Add subtle wave motion to particles
            const positions = this.particleMesh.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const z = positions[i + 2];
                positions[i + 1] += Math.sin(time + x * 0.5 + z * 0.5) * 0.002;
            }
            this.particleMesh.geometry.attributes.position.needsUpdate = true;
        }
        
        // Rotate lines mesh
        if (this.linesMesh) {
            this.linesMesh.rotation.y = this.particleMesh.rotation.y;
            this.linesMesh.rotation.x = this.particleMesh.rotation.x;
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
        this.isRotating = false;
        
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
            
            // Add ripple effect
            btn.addEventListener('mousedown', (e) => this.createRipple(e, btn));
        });
        
        // Auto-rotate every 5 seconds
        this.startAutoRotate();
        
        // Pause on hover
        const cubeContainer = $('.skill-cube');
        if (cubeContainer) {
            cubeContainer.addEventListener('mouseenter', () => this.stopAutoRotate());
            cubeContainer.addEventListener('mouseleave', () => this.startAutoRotate());
        }
    }
    
    switchFace(index) {
        if (this.isRotating || index === this.currentFace) return;
        
        this.isRotating = true;
        
        // Remove active from all
        this.cubeFaces.forEach(face => face.classList.remove('active'));
        this.controlBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active to selected with animation
        setTimeout(() => {
            if (this.cubeFaces[index]) {
                this.cubeFaces[index].classList.add('active');
            }
            if (this.controlBtns[index]) {
                this.controlBtns[index].classList.add('active');
            }
            
            this.currentFace = index;
            this.isRotating = false;
        }, 300);
    }
    
    createRipple(e, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-expand 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    startAutoRotate() {
        this.autoRotateInterval = setInterval(() => {
            const nextIndex = (this.currentFace + 1) % this.cubeFaces.length;
            this.switchFace(nextIndex);
        }, 5000);
    }
    
    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
        }
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

// ========== INSIGHTS PANEL MANAGER ==========
class InsightsPanelManager {
    constructor() {
        this.insightsToggle = $('#insightsToggle');
        this.insightsPanel = $('#insightsPanel');
        this.insightsClose = $('#insightsClose');
        
        this.init();
    }
    
    init() {
        if (!this.insightsToggle || !this.insightsPanel) return;
        
        // Toggle panel
        this.insightsToggle.addEventListener('click', () => {
            this.insightsPanel.classList.add('active');
            this.createOpenAnimation();
        });
        
        // Close panel
        if (this.insightsClose) {
            this.insightsClose.addEventListener('click', () => {
                this.insightsPanel.classList.remove('active');
            });
        }
        
        // Close on overlay click
        document.addEventListener('click', (e) => {
            if (this.insightsPanel.classList.contains('active') && 
                !this.insightsPanel.contains(e.target) && 
                !this.insightsToggle.contains(e.target)) {
                this.insightsPanel.classList.remove('active');
            }
        });
        
        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.insightsPanel.classList.contains('active')) {
                this.insightsPanel.classList.remove('active');
            }
        });
    }
    
    createOpenAnimation() {
        const insights = $$('.insight-item');
        insights.forEach((insight, index) => {
            insight.style.opacity = '0';
            insight.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                insight.style.transition = 'all 0.4s ease-out';
                insight.style.opacity = '1';
                insight.style.transform = 'translateX(0)';
            }, 100 + (index * 100));
        });
    }
}

// ========== UPDATES BAR MANAGER ==========
class UpdatesBarManager {
    constructor() {
        this.updatesBar = $('#updatesBar');
        this.updatesClose = $('#updatesClose');
        this.updateText = $('#updateText');
        
        this.updates = [
            'New: Oracle GenAI Professional Certification Added!',
            'Achievement Unlocked: LeetCode Top 9.82% Ranking!',
            'Recent: Astronomer Apache Airflow 3 Certification',
            'Updated: 17 Professional Certifications Showcased'
        ];
        
        this.init();
    }
    
    init() {
        if (!this.updatesBar) return;
        
        // Rotate updates
        this.currentIndex = 0;
        this.rotateUpdates();
        
        // Close button
        if (this.updatesClose) {
            this.updatesClose.addEventListener('click', () => {
                this.updatesBar.classList.add('hidden');
                localStorage.setItem('updatesBarClosed', 'true');
            });
        }
        
        // Check if previously closed
        if (localStorage.getItem('updatesBarClosed') === 'true') {
            this.updatesBar.style.display = 'none';
        }
    }
    
    rotateUpdates() {
        setInterval(() => {
            if (this.updateText) {
                this.updateText.style.opacity = '0';
                
                setTimeout(() => {
                    this.currentIndex = (this.currentIndex + 1) % this.updates.length;
                    this.updateText.textContent = this.updates[this.currentIndex];
                    this.updateText.style.opacity = '1';
                }, 300);
            }
        }, 8000);
    }
}

// ========== VISITOR TRACKING ==========
class VisitorTracker {
    constructor() {
        this.init();
    }
    
    init() {
        // Track visits
        let visits = parseInt(localStorage.getItem('visitCount') || '0');
        visits++;
        localStorage.setItem('visitCount', visits.toString());
        
        // Store last visit
        const lastVisit = localStorage.getItem('lastVisit');
        const now = new Date().toISOString();
        localStorage.setItem('lastVisit', now);
        
        // Display personalized message
        if (visits > 1 && lastVisit) {
            this.showReturningVisitorMessage(visits, lastVisit);
        }
    }
    
    showReturningVisitorMessage(visits, lastVisit) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1.5rem 3rem;
            background: var(--gradient-surface);
            border: 2px solid var(--color-electric-green);
            border-radius: 12px;
            color: var(--color-text-primary);
            font-size: 1.4rem;
            font-weight: 600;
            z-index: 10000;
            animation: slideDown 0.5s ease-out, slideUp 0.5s ease-out 4.5s;
            box-shadow: 0 10px 40px rgba(57, 255, 20, 0.3);
            text-align: center;
        `;
        
        const daysSince = Math.floor((new Date() - new Date(lastVisit)) / (1000 * 60 * 60 * 24));
        const message = daysSince === 0 
            ? `Welcome back! Visit #${visits}` 
            : `Welcome back! ${daysSince} day${daysSince > 1 ? 's' : ''} since your last visit.`;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i data-lucide="user-check" style="color: var(--color-electric-green);"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        setTimeout(() => toast.remove(), 5000);
    }
}

// ========== THEME TOGGLE ==========
class ThemeToggle {
    constructor() {
        this.themeToggle = $('#themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }
    
    init() {
        if (!this.themeToggle) return;
        
        // Apply saved theme
        this.applyTheme(this.currentTheme);
        
        // Toggle button click
        this.themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
        });
    }
    
    applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.style.setProperty('--color-dark', '#f5f5f5');
            document.documentElement.style.setProperty('--color-darker', '#ffffff');
            document.documentElement.style.setProperty('--color-surface', '#ffffff');
            document.documentElement.style.setProperty('--color-surface-elevated', '#f0f0f0');
            document.documentElement.style.setProperty('--color-text-primary', '#1a1a1a');
            document.documentElement.style.setProperty('--color-text-secondary', '#4a4a4a');
            document.documentElement.style.setProperty('--color-text-tertiary', '#7a7a7a');
            document.documentElement.style.setProperty('--color-border', 'rgba(0, 0, 0, 0.1)');
            document.body.classList.add('light-theme');
        } else {
            document.documentElement.style.setProperty('--color-dark', '#0a0a0f');
            document.documentElement.style.setProperty('--color-darker', '#050508');
            document.documentElement.style.setProperty('--color-surface', '#121218');
            document.documentElement.style.setProperty('--color-surface-elevated', '#1a1a24');
            document.documentElement.style.setProperty('--color-text-primary', '#e8e8e8');
            document.documentElement.style.setProperty('--color-text-secondary', '#a0a0a8');
            document.documentElement.style.setProperty('--color-text-tertiary', '#606068');
            document.documentElement.style.setProperty('--color-border', 'rgba(255, 255, 255, 0.08)');
            document.body.classList.remove('light-theme');
        }
    }
}

// ========== MULTI-LANGUAGE SUPPORT ==========
class LanguageSelector {
    constructor() {
        this.languageBtn = $('#languageBtn');
        this.languageDropdown = $('#languageDropdown');
        this.langOptions = $$('.lang-option');
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                blog_title: 'Technical <span class="highlight">Articles</span>',
                blog_subtitle: 'In-depth explorations of MLOps, GenAI, and Cloud-Native architectures',
                timeline_title: 'Career <span class="highlight">Timeline</span>',
                timeline_subtitle: 'Journey through expertise milestones and achievements',
                github_title: 'GitHub <span class="highlight">Activity</span>',
                github_subtitle: 'Continuous contributions and open-source engagement',
                analytics_title: 'Portfolio <span class="highlight">Analytics</span>',
                analytics_subtitle: 'Real-time insights and visitor metrics'
            },
            es: {
                blog_title: 'Artículos <span class="highlight">Técnicos</span>',
                blog_subtitle: 'Exploraciones profundas de MLOps, GenAI y arquitecturas Cloud-Native',
                timeline_title: 'Línea <span class="highlight">Temporal</span>',
                timeline_subtitle: 'Viaje a través de hitos de experiencia y logros',
                github_title: 'Actividad en <span class="highlight">GitHub</span>',
                github_subtitle: 'Contribuciones continuas y participación en código abierto',
                analytics_title: 'Análisis del <span class="highlight">Portafolio</span>',
                analytics_subtitle: 'Información en tiempo real y métricas de visitantes'
            },
            hi: {
                blog_title: 'तकनीकी <span class="highlight">लेख</span>',
                blog_subtitle: 'MLOps, GenAI और Cloud-Native आर्किटेक्चर का गहन अन्वेषण',
                timeline_title: 'कैरियर <span class="highlight">टाइमलाइन</span>',
                timeline_subtitle: 'विशेषज्ञता मील के पत्थर और उपलब्धियों की यात्रा',
                github_title: 'GitHub <span class="highlight">गतिविधि</span>',
                github_subtitle: 'निरंतर योगदान और ओपन-सोर्स सहभागिता',
                analytics_title: 'पोर्टफोलियो <span class="highlight">विश्लेषण</span>',
                analytics_subtitle: 'वास्तविक समय अंतर्दृष्टि और आगंतुक मीट्रिक'
            }
        };
        this.init();
    }
    
    init() {
        if (!this.languageBtn) return;
        
        // Apply saved language
        this.applyLanguage(this.currentLang);
        this.updateCurrentLangDisplay();
        
        // Toggle dropdown
        this.languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.languageDropdown.classList.toggle('active');
        });
        
        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) {
                this.languageDropdown.classList.remove('active');
            }
        });
        
        // Language option click
        this.langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                this.currentLang = lang;
                this.applyLanguage(lang);
                this.updateCurrentLangDisplay();
                localStorage.setItem('language', lang);
                this.languageDropdown.classList.remove('active');
            });
        });
    }
    
    applyLanguage(lang) {
        const translations = this.translations[lang] || this.translations.en;
        
        // Update all translatable elements
        $$('[data-translate]').forEach(elem => {
            const key = elem.getAttribute('data-translate');
            if (translations[key]) {
                elem.innerHTML = translations[key];
            }
        });
    }
    
    updateCurrentLangDisplay() {
        const currentLangSpan = $('.current-lang');
        if (currentLangSpan) {
            const langMap = { en: 'EN', es: 'ES', hi: 'हि' };
            currentLangSpan.textContent = langMap[this.currentLang] || 'EN';
        }
    }
}

// ========== GITHUB CONTRIBUTIONS GRAPH ==========
class GitHubContributionsGraph {
    constructor() {
        this.grid = $('#contributionGrid');
        this.init();
    }
    
    init() {
        if (!this.grid) return;
        
        // Generate contribution graph for past year
        const weeks = 52;
        const daysPerWeek = 7;
        
        for (let week = 0; week < weeks; week++) {
            const weekColumn = document.createElement('div');
            weekColumn.className = 'contribution-week';
            
            for (let day = 0; day < daysPerWeek; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'contribution-day';
                
                // Generate random contribution level (0-4)
                const level = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0;
                dayCell.setAttribute('data-level', level);
                dayCell.setAttribute('data-count', level * Math.floor(Math.random() * 10 + 1));
                
                // Tooltip
                dayCell.title = `${level * Math.floor(Math.random() * 10 + 1)} contributions`;
                
                weekColumn.appendChild(dayCell);
            }
            
            this.grid.appendChild(weekColumn);
        }
        
        // Animate in sequence
        const days = $$('.contribution-day');
        days.forEach((day, index) => {
            setTimeout(() => {
                day.style.opacity = '1';
                day.style.transform = 'scale(1)';
            }, index * 2);
        });
        
        // Animate GitHub stats
        this.animateGitHubStats();
    }
    
    animateGitHubStats() {
        const statNumbers = $$('.github-stat-card .stat-number[data-target]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateValue(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    animateValue(elem) {
        const target = parseInt(elem.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                elem.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                elem.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
}

// ========== ANALYTICS DASHBOARD ==========
class AnalyticsDashboard {
    constructor() {
        this.visitorChart = $('#visitorChart');
        this.init();
    }
    
    init() {
        if (!this.visitorChart || typeof Chart === 'undefined') return;
        
        // Create visitor trend chart
        const ctx = this.visitorChart.getContext('2d');
        
        // Generate sample data for past 7 days
        const labels = [];
        const data = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            data.push(Math.floor(Math.random() * 200 + 50));
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Visitors',
                    data: data,
                    borderColor: '#00ffff',
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#00ffff',
                    pointBorderColor: '#0a0a0f',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(18, 18, 24, 0.95)',
                        titleColor: '#00ffff',
                        bodyColor: '#e8e8e8',
                        borderColor: '#00ffff',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Visitors: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#a0a0a8'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a0a0a8'
                        }
                    }
                }
            }
        });
        
        // Animate performance metrics
        this.animatePerformanceMetrics();
    }
    
    animatePerformanceMetrics() {
        const performanceFills = $$('.performance-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 100);
                }
            });
        }, { threshold: 0.5 });
        
        performanceFills.forEach(fill => observer.observe(fill));
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
        
        @keyframes ripple-expand {
            to {
                transform: scale(4);
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
        
        @keyframes slideDown {
            from {
                transform: translate(-50%, -100px);
                opacity: 0;
            }
            to {
                transform: translate(-50%, 0);
                opacity: 1;
            }
        }
        
        @keyframes slideUp {
            from {
                transform: translate(-50%, 0);
                opacity: 1;
            }
            to {
                transform: translate(-50%, -100px);
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
    new InsightsPanelManager();
    new UpdatesBarManager();
    new VisitorTracker();
    
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
