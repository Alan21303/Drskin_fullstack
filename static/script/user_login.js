// Save this as user_login.js
// Firebase configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
let loginForm, registerForm, loadingScreen, loginToggle, registerToggle;

// Form toggle functionality
function setupFormToggle() {
    loginToggle = document.getElementById('login-toggle');
    registerToggle = document.getElementById('register-toggle');
    loginForm = document.getElementById('login-form');
    registerForm = document.getElementById('register-form');

    document.getElementById('switch-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        loginToggle.classList.remove('active');
        registerToggle.classList.add('active');
    });

    document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        registerToggle.classList.remove('active');
        loginToggle.classList.add('active');
    });
}

// Loading screen animation
function setupLoadingScreen() {
    loadingScreen = document.getElementById('loading-screen');
    gsap.to(loadingScreen, { opacity: 1, duration: 0.5 });

    setTimeout(() => {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
            }
        });
    }, 2000);
}

// Form submission handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        showLoadingState(true);
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        // Update last login time in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            lastLogin: new Date().toISOString()
        }, { merge: true });

        showMessage('success', 'Login successful!');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);

    } catch (error) {
        handleAuthError(error);
    } finally {
        showLoadingState(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validation
    if (!validateRegistration(password, confirmPassword)) {
        return;
    }

    try {
        showLoadingState(true);
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update profile and create user document
        await Promise.all([
            user.updateProfile({ displayName: name }),
            db.collection('users').doc(user.uid).set({
                name,
                email,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            })
        ]);

        showMessage('success', 'Registration successful!');
        
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);

    } catch (error) {
        handleAuthError(error);
    } finally {
        showLoadingState(false);
    }
}

// Utility functions
function validateRegistration(password, confirmPassword) {
    if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match!');
        return false;
    }
    if (password.length < 6) {
        showMessage('error', 'Password should be at least 6 characters long!');
        return false;
    }
    return true;
}

function showLoadingState(isLoading) {
    const buttons = document.querySelectorAll('.submit-btn');
    buttons.forEach(button => {
        button.disabled = isLoading;
        if (!button.hasAttribute('data-original-text')) {
            button.setAttribute('data-original-text', button.textContent);
        }
        button.textContent = isLoading ? 'Please wait...' : button.getAttribute('data-original-text');
    });
}

function showMessage(type, message) {
    let messageElement = document.querySelector('.message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'message';
        document.querySelector('.container').appendChild(messageElement);
    }

    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    
    gsap.fromTo(messageElement, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3 }
    );

    setTimeout(() => {
        gsap.to(messageElement, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            onComplete: () => messageElement.remove()
        });
    }, 3000);
}

function handleAuthError(error) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
        'auth/weak-password': 'Please choose a stronger password.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'Invalid email or password.',
        'auth/wrong-password': 'Invalid email or password.'
    };

    showMessage('error', errorMessages[error.code] || 'An error occurred. Please try again.');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupFormToggle();
    setupLoadingScreen();
    
    loginForm = document.getElementById('login-form');
    registerForm = document.getElementById('register-form');
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
});
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const loadingScreen = document.getElementById('loading-screen');

    // Show loading screen
    gsap.to(loadingScreen, { opacity: 1, duration: 0.5 });

    // Hide loading screen after 2 seconds
    setTimeout(() => {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
            }
        });
    }, 2000);

    function showForm(form) {
        gsap.fromTo(form, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out', display: 'block' }
        );
    }

    function hideForm(form) {
        gsap.to(form, { opacity: 0, y: 20, duration: 0.1, ease: 'power2.in', display: 'none' });
    }

    function switchForms(showFormElement, hideFormElement) {
        hideForm(hideFormElement);
        showForm(showFormElement);
    }

    loginToggle.addEventListener('click', () => {
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
        switchForms(loginForm, registerForm);
    });

    registerToggle.addEventListener('click', () => {
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
        switchForms(registerForm, loginForm);
    });

    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        registerToggle.click();
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginToggle.click();
    });

    // Form submission (you can add your own logic here)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log('Login form submitted');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your registration logic here
        console.log('Register form submitted');
    });
});