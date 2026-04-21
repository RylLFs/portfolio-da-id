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
    const sections = document.querySelectorAll('.projects, .skill');
    sections.forEach((section) => {
        observer.observe(section);
    });

    // Smooth scroll untuk navigation links
    smoothScroll();

    // Set video playback speed 1.5x
    setVideoSpeed();
});

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
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

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
        color: #60BAF7 !important;
        border-bottom: 2px solid #60BAF7;
        padding-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);

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
            const sections = document.querySelectorAll('.hero, .skill, .projects, .contact');
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
            const cards = entry.target.querySelectorAll('.skill-card, .project-card');
            
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
    const sections = document.querySelectorAll('.hero, .skill, .projects, .contact');
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
        'cert1': 'assets/images/cert-digitalent-full.png',
        'cert2': 'assets/images/cert-google-full.png',
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