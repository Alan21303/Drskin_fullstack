document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simulating login process
        if (username && password) {
            errorMessage.textContent = '';
            // Add loading animation to logo
            document.querySelector('.logo').style.animation = 'pulse 1s infinite, rotate 2s linear infinite';
            
            // Simulate API call
            setTimeout(() => {
                // Reset logo animation
                document.querySelector('.logo').style.animation = '';
                
                // Redirect to admin dashboard (replace with actual logic)
                window.location.href = 'admin-dashboard.html';
            }, 2000);
        } else {
            errorMessage.textContent = 'Please enter both username and password.';
        }
    });

    // Add subtle animations to input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-focus');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('input-focus');
        });
    });
});