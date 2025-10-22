// Get CSRF token from meta tag
function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}

// Check if user is already logged in and redirect
async function checkIfAlreadyLoggedIn() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            
            // Verify token is still valid
            const response = await fetch('/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },
                credentials: 'same-origin'
            });
            
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.user) {
                        // Redirect based on user role
                        if (data.user.is_admin) {
                            window.location.href = '/admin';
                        } else {
                            window.location.href = '/index';
                        }
                        return true; // Prevent further execution
                    }
                } else {
                // Token is invalid, clear storage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            // Clear invalid data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    }
    return false;
}

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is already logged in
    const isLoggedIn = await checkIfAlreadyLoggedIn();
    if (isLoggedIn) return; // Stop execution if redirecting

    // Elements
    const loginForm = document.getElementById('loginForm');
    const studentIdInput = document.getElementById('studentId');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginBtn = document.querySelector('.login-btn');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const eyeIcon = this.querySelector('.eye-icon');
        const eyeOffIcon = this.querySelector('.eye-off-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
        } else {
            passwordInput.type = 'password';
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
        }
    });

    // Load saved credentials if "Remember Me" was checked
    loadSavedCredentials();

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const studentId = studentIdInput.value.trim();
        const password = passwordInput.value.trim();
        const rememberMe = rememberMeCheckbox.checked;

        // Validate inputs
        if (!studentId) {
            showError('Please enter your Student ID or Email');
            studentIdInput.focus();
            return;
        }

        if (!password) {
            showError('Please enter your password');
            passwordInput.focus();
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            passwordInput.focus();
            return;
        }

        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        // First get CSRF cookie, then make login request
        fetch('/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(() => {
            // Now make the actual login call
            return fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    studentId: studentId,
                    password: password,
                    rememberMe: rememberMe
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;

            if (data.success) {
                // Save token
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Save credentials if Remember Me is checked
                if (rememberMe) {
                    saveCredentials(studentId);
                } else {
                    clearSavedCredentials();
                }

                // Show success message
                showSuccess('Login successful! Redirecting...');
                
                // Redirect to dashboard after 1.5 seconds
                setTimeout(() => {
                    // Check if user is admin and redirect accordingly
                    if (data.user && data.user.is_admin) {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/index';
                    }
                }, 1500);
            } else {
                showError(data.message || 'Login failed. Please try again.');
            }
        })
        .catch(error => {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            showError('Connection error. Please check your internet connection.');
            console.error('Login error:', error);
        });
    });

    // Input validation on blur
    studentIdInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#252d3f';
        }
    });

    passwordInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = '#ef4444';
        } else if (this.value.length < 6) {
            this.style.borderColor = '#f59e0b';
        } else {
            this.style.borderColor = '#252d3f';
        }
    });

    // Clear error styling on input
    studentIdInput.addEventListener('input', function() {
        this.style.borderColor = '#252d3f';
        removeMessage();
    });

    passwordInput.addEventListener('input', function() {
        this.style.borderColor = '#252d3f';
        removeMessage();
    });

    // Social login buttons
    const googleBtn = document.querySelector('.google-btn');
    const microsoftBtn = document.querySelector('.microsoft-btn');

    googleBtn.addEventListener('click', function() {
        showInfo('Google login would be implemented here');
    });

    microsoftBtn.addEventListener('click', function() {
        showInfo('Microsoft login would be implemented here');
    });

    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showInfo('Password reset functionality would be implemented here');
    });

    // Sign up link
    const signupLink = document.querySelector('.signup-link a');
    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        showInfo('Sign up page would be implemented here');
    });

    // Functions
    function showError(message) {
        removeMessage();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>${message}</span>
        `;
        
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }

    function showSuccess(message) {
        removeMessage();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            <span>${message}</span>
        `;
        
        loginForm.insertBefore(successDiv, loginForm.firstChild);
    }

    function showInfo(message) {
        removeMessage();
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'error-message show';
        infoDiv.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
        infoDiv.style.borderColor = 'rgba(102, 126, 234, 0.3)';
        infoDiv.style.color = '#667eea';
        infoDiv.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <span>${message}</span>
        `;
        
        loginForm.insertBefore(infoDiv, loginForm.firstChild);
        
        setTimeout(() => {
            infoDiv.classList.remove('show');
            setTimeout(() => infoDiv.remove(), 300);
        }, 4000);
    }

    function removeMessage() {
        const messages = loginForm.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.remove());
    }

    function saveCredentials(studentId) {
        localStorage.setItem('rememberedStudentId', studentId);
        localStorage.setItem('rememberMe', 'true');
    }

    function clearSavedCredentials() {
        localStorage.removeItem('rememberedStudentId');
        localStorage.removeItem('rememberMe');
    }

    function loadSavedCredentials() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const savedStudentId = localStorage.getItem('rememberedStudentId');

        if (rememberMe && savedStudentId) {
            studentIdInput.value = savedStudentId;
            rememberMeCheckbox.checked = true;
        }
    }

    // Add enter key support for better UX
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    // Add floating label effect
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple-animation 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        const existingRipple = button.querySelector('.ripple-effect');
        if (existingRipple) {
            existingRipple.remove();
        }

        ripple.classList.add('ripple-effect');
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add CSS animation for ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('Login page initialized successfully');
});
