// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, updatePassword } from 'firebase/auth';
import { getDatabase, ref, push, set, get, child, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBbkpIB_t0wCdGaBMJUsQIsalqjSl_t9kE",
    authDomain: "drskin-23bd5.firebaseapp.com",
    databaseURL: "https://drskin-23bd5-default-rtdb.firebaseio.com",
    projectId: "drskin-23bd5",
    storageBucket: "drskin-23bd5.firebasestorage.app",
    messagingSenderId: "539102519458",
    appId: "1:539102519458:web:2ea233bd5ac5d66806f7fb",
    measurementId: "G-7H0KJ4KHRX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserProfile(user.uid);
            loadUserTestimonials(user.uid);
        } else {
            window.location.href = '/login';
        }
    });

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
        handleTestimonialSubmission(event);
    });

    // Profile photo upload handling
    const photoButton = document.querySelector('.button-outline.button-sm');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    photoButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleProfilePhotoUpload);

    // Form submissions
    const personalInfoForm = document.querySelector('#personal form');
    const securityForm = document.querySelector('#security form');

    personalInfoForm.addEventListener('submit', handlePersonalInfoUpdate);
    securityForm.addEventListener('submit', handleSecurityUpdate);
});

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function loadUserProfile(userId) {
    try {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            // Populate form fields
            document.getElementById('firstName').value = userData.firstName || '';
            document.getElementById('lastName').value = userData.lastName || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('phone').value = userData.phone || '';
            document.getElementById('address').value = userData.address || '';

            // Update profile photo if exists
            if (userData.photoURL) {
                document.querySelector('.avatar-image').src = userData.photoURL;
                document.querySelector('.avatar-fallback').style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        showNotification('Error loading profile data', 'error');
    }
}

async function handleProfilePhotoUpload(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        const user = auth.currentUser;
        const photoRef = storageRef(storage, `profile-photos/${user.uid}`);
        
        await uploadBytes(photoRef, file);
        const photoURL = await getDownloadURL(photoRef);
        
        // Update profile photo URL in database
        await update(ref(db, `users/${user.uid}`), {
            photoURL: photoURL
        });

        // Update UI
        document.querySelector('.avatar-image').src = photoURL;
        document.querySelector('.avatar-fallback').style.display = 'none';
        showNotification('Profile photo updated successfully');
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        showNotification('Error uploading profile photo', 'error');
    }
}

async function handlePersonalInfoUpdate(event) {
    event.preventDefault();
    
    try {
        const user = auth.currentUser;
        const userData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            updatedAt: new Date().toISOString()
        };

        await update(ref(db, `users/${user.uid}`), userData);
        showNotification('Profile updated successfully');
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Error updating profile', 'error');
    }
}

async function handleSecurityUpdate(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }

    try {
        const user = auth.currentUser;
        await updatePassword(user, newPassword);
        
        // Clear form
        event.target.reset();
        showNotification('Password updated successfully');
    } catch (error) {
        console.error('Error updating password:', error);
        showNotification('Error updating password', 'error');
    }
}

async function loadUserTestimonials(userId) {
    try {
        const testimonialsRef = ref(db, `testimonials/${userId}`);
        const snapshot = await get(testimonialsRef);
        
        if (snapshot.exists()) {
            const testimonialContainer = document.querySelector('.card-content .space-y-4');
            testimonialContainer.innerHTML = ''; // Clear existing testimonials
            
            const testimonials = snapshot.val();
            Object.values(testimonials).forEach(testimonial => {
                addTestimonialToPage(testimonial.title, testimonial.rating, testimonial.content);
            });
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        showNotification('Error loading testimonials', 'error');
    }
}

async function handleTestimonialSubmission(event) {
    event.preventDefault();
    
    try {
        const user = auth.currentUser;
        const testimonialData = {
            title: document.getElementById('testimonialTitle').value,
            rating: parseInt(document.getElementById('testimonialRating').value),
            content: document.getElementById('testimonialContent').value,
            createdAt: new Date().toISOString(),
            userId: user.uid
        };

        // Add to Firebase
        const newTestimonialRef = push(ref(db, `testimonials/${user.uid}`));
        await set(newTestimonialRef, testimonialData);

        // Update UI
        addTestimonialToPage(testimonialData.title, testimonialData.rating, testimonialData.content);
        
        // Clear form and close modal
        event.target.reset();
        document.getElementById('testimonialModal').style.display = 'none';
        showNotification('Testimonial added successfully');
    } catch (error) {
        console.error('Error submitting testimonial:', error);
        showNotification('Error submitting testimonial', 'error');
    }
}

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