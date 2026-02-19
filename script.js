gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ==========================================
// 1. HERO IMAGE MOUSE MOVEMENT (PARALLAX)
// ==========================================
const heroSection = document.getElementById('home');
const heroImg = document.querySelector('.hero-tech-img');

if (heroSection && heroImg && window.innerWidth > 1024) {
    heroSection.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40; // Max movement 40px
        const y = (e.clientY / window.innerHeight - 0.5) * 40;

        gsap.to(heroImg, {
            x: -x, // Invert direction
            y: -y,
            duration: 1,
            ease: "power2.out"
        });
    });
}

// ==========================================
// 2. GLOBAL SCROLL ANIMATIONS
// ==========================================
const revealElements = document.querySelectorAll(".reveal-text, .reveal-card");

revealElements.forEach(element => {
    gsap.fromTo(element, 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%", // Animation starts when element is 85% down the viewport
                toggleActions: "play none none reverse"
            }
        }
    );
});

// ==========================================
// 3. MODAL LOGIC
// ==========================================
const modal = document.getElementById('project-modal');
const closeModalBtn = document.querySelector('.close-modal');
const projectCards = document.querySelectorAll('.project-card');

// Modal Elements
const mTitle = document.getElementById('m-title');
const mDesc = document.getElementById('m-desc');
const mTags = document.getElementById('m-tags');
const mImg = document.getElementById('m-img');
const mLive = document.getElementById('m-live');
const mGithub = document.getElementById('m-github');

// Open Modal
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        // Populate Data
        mTitle.innerText = card.getAttribute('data-title');
        mDesc.innerText = card.getAttribute('data-desc');
        mImg.src = card.getAttribute('data-img');
        mLive.href = card.getAttribute('data-live');
        mGithub.href = card.getAttribute('data-github');

        // Populate Tags
        const tags = card.getAttribute('data-tags').split(',');
        mTags.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.innerText = tag.trim();
            mTags.appendChild(span);
        });

        // Show
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
});

// Close Modal functions
const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

closeModalBtn.addEventListener('click', closeModal);

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});


// ==========================================
// 4. MOBILE MENU & THEME
// ==========================================
const menuBtn = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.mobile-overlay');
const navLinks = document.querySelectorAll('.nav-pill');
const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
const themeIcon = themeBtn.querySelector('i');

// Menu
const toggleMenu = () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    const icon = menuBtn.querySelector('i');
    icon.className = sidebar.classList.contains('active') ? 'ri-close-line' : 'ri-menu-4-line';
};

menuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(window.innerWidth <= 1024) toggleMenu();
    });
});

// Theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'ri-moon-line' : 'ri-sun-line';
}

// ==========================================
// 5. THREE.JS (Desktop Only)
// ==========================================
const initThree = () => {
    const container = document.getElementById('canvas-container');
    if(!container || window.innerWidth <= 1024) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geo = new THREE.IcosahedronGeometry(2, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xCCFF00, wireframe: true, transparent: true, opacity: 0.2 });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    camera.position.z = 5;

    window.addEventListener('resize', () => {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    });

    const animate = () => {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.002;
        const currentTheme = html.getAttribute('data-theme');
        mat.color.setHex(currentTheme === 'light' ? 0xE6C200 : 0xCCFF00);
        renderer.render(scene, camera);
    };
    animate();
};
initThree();

// ==========================================
// 6. UTILS (Cursor & Nav)
// ==========================================
if(window.innerWidth > 1024) {
    // Nav Highlight
    const navLinks = document.querySelectorAll('.nav-pill');
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if(pageYOffset >= section.offsetTop - 150) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href').includes(current)) link.classList.add('active');
        });
    });

    // Cursor
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        gsap.to(outline, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15, ease: "power2.out" });
    });
}