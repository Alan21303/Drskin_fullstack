document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Tabs functionality
    const tabsTriggers = document.querySelectorAll('.tabs-trigger');
    const tabsContents = document.querySelectorAll('.tabs-content');

    tabsTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const tabId = trigger.getAttribute('data-tab');
            
            // Remove active class from all triggers and contents
            tabsTriggers.forEach(t => t.classList.remove('active'));
            tabsContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked trigger and corresponding content
            trigger.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Testimonial modal functionality
    const writeTestimonialBtn = document.getElementById('writeTestimonialBtn');
    const testimonialModal = document.getElementById('testimonialModal');
    const testimonialForm = document.getElementById('testimonialForm');

    writeTestimonialBtn.addEventListener('click', () => {
        testimonialModal.style.display = 'block';
    });

    window.addEventListener('click', (event) => {
        if (event.target === testimonialModal) {
            testimonialModal.style.display = 'none';
        }
    });

    testimonialForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Get form values
        const title = document.getElementById('testimonialTitle').value;
        const rating = document.getElementById('testimonialRating').value;
        const content = document.getElementById('testimonialContent').value;

        // Here you would typically send this data to your server
        console.log('New testimonial:', { title, rating, content });

        // Clear form and close modal
        testimonialForm.reset();
        testimonialModal.style.display = 'none';

        // Optionally, you could add the new testimonial to the page here
        addTestimonialToPage(title, rating, content);
    });

    function addTestimonialToPage(title, rating, content) {
        const testimonialContainer = document.querySelector('.card-content .space-y-4');
        const newTestimonial = document.createElement('div');
        newTestimonial.classList.add('border-b', 'border-border', 'pb-4');
        newTestimonial.innerHTML = `
            <div class="flex items-center justify-between">
                <h3 class="font-semibold">${title}</h3>
                <div class="flex items-center">
                    ${generateStarRating(rating)}
                </div>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">${content}</p>
        `;
        testimonialContainer.insertBefore(newTestimonial, testimonialContainer.firstChild);
    }

    function generateStarRating(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-yellow-400 fill-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
            } else {
                stars += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-300"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
            }
        }
        return stars;
    }

    // Form submission handling (you would typically send this data to your server)
    const personalInfoForm = document.querySelector('#personal form');
    const securityForm = document.querySelector('#security form');

    personalInfoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(personalInfoForm);
        console.log('Personal info update:', Object.fromEntries(formData));
        // Here you would send the data to your server
    });

    securityForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(securityForm);
        console.log('Security update:', Object.fromEntries(formData));
        // Here you would send the data to your server
    });
});

console.log('Profile page JavaScript loaded successfully!');