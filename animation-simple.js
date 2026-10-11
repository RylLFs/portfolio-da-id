/* ============================================
   SIMPLE ANIMATIONS
   ============================================ */

// Intersection Observer untuk fade-in-up animation saat scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Delay staggered animation
            const cards = entry.target.querySelectorAll('.fade-in-up');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = `fadeInUp 0.8s ease-out forwards`;
                }, index * 100);
            });
            observer.unobserve(entry.target);
        }
    });
});

// Observe sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.projects, .skill, .certifications');
    sections.forEach((section) => {
        observer.observe(section);
    });

    initializeCarousels();

    // Smooth scroll untuk navigation links
    smoothScroll();

    // Set video playback speed 1.5x
    setVideoSpeed();
});

function initializeCarousels() {
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
        const viewport = carousel.querySelector('[data-carousel-viewport]');
        const track = viewport.querySelector('.carousel-track');
        const previousButton = carousel.querySelector('[data-carousel-direction="-1"]');
        const nextButton = carousel.querySelector('[data-carousel-direction="1"]');

        const updateControls = () => {
            const maxScroll = viewport.scrollWidth - viewport.clientWidth;
            previousButton.disabled = viewport.scrollLeft <= 1;
            nextButton.disabled = viewport.scrollLeft >= maxScroll - 1;
        };

        const scrollByCard = (direction) => {
            const firstCard = track.firstElementChild;
            if (!firstCard) return;

            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            viewport.scrollBy({
                left: direction * (firstCard.getBoundingClientRect().width + gap),
                behavior: 'smooth'
            });
        };

        previousButton.addEventListener('click', () => scrollByCard(-1));
        nextButton.addEventListener('click', () => scrollByCard(1));
        viewport.addEventListener('scroll', updateControls, { passive: true });
        viewport.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

            event.preventDefault();
            scrollByCard(event.key === 'ArrowLeft' ? -1 : 1);
        });
        window.addEventListener('resize', updateControls);
        updateControls();
    });
}

// Smooth scroll function
// Smooth scroll function dengan offset biar animasi ke-trigger
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Reset animasi dulu
                target.style.opacity = '0';
                target.classList.remove('slide-in-left', 'slide-in-right', 'fade-up');
                
                // Scroll
                const targetPosition = target.offsetTop - 150;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Trigger ulang animasi setelah scroll selesai
                setTimeout(() => {
                    slideObserver.observe(target);
                }, 800);
            }
        });
    });
}

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let current = atPageBottom ? 'contact' : '';

    if (!atPageBottom) {
        const activationLine = window.scrollY + 250;
        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (activationLine >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styling to CSS dynamically if needed
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: #23272A !important;
        border-bottom: 2px solid #D4AF37;
        padding-bottom: 0.5rem;
    }
    .navbar.scrolled .nav-links a.active {
        color: #D4AF37 !important;
    }
`;
document.head.appendChild(style);

// Show the existing project detail pages inside an accessible dialog.
document.addEventListener('DOMContentLoaded', () => {
    const projectModal = document.getElementById('projectModal');
    if (!projectModal) return;

    const projectFrame = projectModal.querySelector('.project-modal-frame');
    const projectTitle = document.getElementById('projectModalTitle');
    const closeButton = projectModal.querySelector('.project-modal-close');
    const closeProjectOnEscape = (event) => {
        if (event.key === 'Escape' && projectModal.open) {
            event.preventDefault();
            projectModal.close();
        }
    };

    document.addEventListener('keydown', closeProjectOnEscape);

    document.querySelectorAll('[data-project-modal]').forEach((link) => {
        link.addEventListener('click', (event) => {
            if (typeof projectModal.showModal !== 'function') return;

            event.preventDefault();
            const cardTitle = link.closest('.project-card')?.querySelector('h3')?.textContent.trim();
            projectTitle.textContent = cardTitle || 'Detail Proyek';
            projectFrame.title = `Detail proyek: ${projectTitle.textContent}`;
            projectFrame.src = link.href;
            projectModal.showModal();
            closeButton.focus();
        });
    });

    projectFrame.addEventListener('load', () => {
        const projectDocument = projectFrame.contentDocument;
        if (!projectDocument || projectFrame.src === 'about:blank') return;

        projectDocument.querySelector('.navbar')?.remove();
        projectDocument.querySelector('.related-projects')?.remove();
        projectDocument.querySelector('.footer')?.remove();
        projectDocument.querySelector('.back-link')?.remove();
        projectDocument.addEventListener('keydown', closeProjectOnEscape);
        projectDocument.querySelectorAll('video').forEach((video) => {
            video.playbackRate = 1.5;
        });
    });

    closeButton.addEventListener('click', () => projectModal.close());
    projectModal.addEventListener('click', (event) => {
        if (event.target === projectModal) projectModal.close();
    });
    projectModal.addEventListener('close', () => {
        projectFrame.src = 'about:blank';
    });
});

// Set video playback speed to 1.5x
function setVideoSpeed() {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
        video.playbackRate = 1.5; // 1.5x lebih cepat
    });
}

// Typing effect untuk hero title
function typingEffect() {
    const titles = [
    "Eril",
    "a Data Analyst",
    "a System Analyst"
];
    const typingElement = document.querySelector('.hero h1');
    
    if (!typingElement) return;
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150; // kecepatan ngetik (ms)
    const deletingSpeed = 100; // kecepatan hapus (ms)
    const pauseEnd = 2000; // jeda setelah selesai ngetik (ms)

    function type() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
        
        typingElement.textContent = `Hi, I'm ${currentTitle.substring(0, charIndex)}`;
        
        let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;
        
        if (!isDeleting && charIndex === currentTitle.length) {
            // Selesai ngetik, tunggu terus mulai hapus
            typeSpeed = pauseEnd;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Selesai hapus, ganti ke title berikutnya
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// Jalankan typing effect pas page load
document.addEventListener('DOMContentLoaded', () => {
    typingEffect();
});

// Slide in bergantian kiri-kanan, contact fade up
// Slide in bergantian kiri-kanan, contact fade up
const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const sections = document.querySelectorAll('.hero, .skill, .projects, .certifications, .contact');
            const currentIndex = Array.from(sections).indexOf(entry.target);
            
            // Hero pakai fade-up
            if (entry.target.classList.contains('hero')) {
                entry.target.classList.add('fade-up');
            }
            // Contact pakai fade-up
            else if (entry.target.classList.contains('contact')) {
                entry.target.classList.add('fade-up');
            } 
            // About & Projects bergantian kiri-kanan
            else if (currentIndex % 2 === 0) {
                entry.target.classList.add('slide-in-left');
            } else {
                entry.target.classList.add('slide-in-right');
            }
            
            slideObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px'
});
// Staggered animation untuk cards
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.skill-card, .project-card, .cert-card');
            
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('card-fade-up');
                }, index * 150); // Delay 150ms per card
            });
            
            cardObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.hero, .skill, .projects, .certifications, .contact');
    sections.forEach((section) => {
        section.style.opacity = '0'; // Hide dulu
        slideObserver.observe(section);
    });
});

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu saat link diklik
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});

// Certificate modal functions
function openCertModal(certId) {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('certModalImg');
    
    // Map certificate IDs to image paths
    const certImages = {
        'cert1': 'assets/images/digitalentdts.jpg',
        'cert2': 'assets/images/oracledatabasedesign.jpg',
        'cert3': 'assets/images/oracledatabaseprogrammingsql.jpg',
        // Tambah mapping lainnya di sini
    };
    
    modal.style.display = 'block';
    modalImg.src = certImages[certId];
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    modal.style.display = 'none';
}

// Close modal saat klik di luar gambar
window.onclick = function(event) {
    const modal = document.getElementById('certModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Close modal dengan ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCertModal();
    }
});