document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
        }
    });

    // Mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        menuIcon.classList.toggle('active');
    });

    // Button forwarding
    document.getElementById('startTestBtn').onclick = function() {
        window.location.href = 'Test.html';
    };

    // Testimonials carousel
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showNextTestimonial() {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }

    // Initialize first testimonial
    testimonials[0].classList.add('active');

    // Rotate testimonials every 5 seconds
    setInterval(showNextTestimonial, 5000);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simulate user name (replace with actual user data fetching)
    document.getElementById('userName').textContent = 'John';

    // Loading animation
    window.addEventListener('load', () => {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<img src="img/favicon.ico" alt="Loading..." width="50" height="50">';
        document.body.appendChild(loader);

        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
});