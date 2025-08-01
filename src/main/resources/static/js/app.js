// SecureBank App JavaScript

// API Base URL
const API_BASE_URL = '/api/auth';

// DOM Elements
const registrationForm = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm');
const registerFormElement = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const alertContainer = document.getElementById('alertContainer');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showRegistrationForm(); // Show registration form by default
});

// Initialize Event Listeners
function initializeEventListeners() {
    // Register Form Submit
    registerFormElement.addEventListener('submit', handleRegistration);
    
    // Login Form Submit
    loginFormElement.addEventListener('submit', handleLogin);
    
    // Real-time validation
    setupFormValidation();
}

// Form Switching Functions
function showRegistrationForm() {
    registrationForm.style.display = 'block';
    loginForm.style.display = 'none';
    
    // Trigger animation
    registrationForm.style.animation = 'none';
    setTimeout(() => {
        registrationForm.style.animation = 'slideInRight 0.6s ease forwards';
    }, 10);
}

function showLoginForm() {
    registrationForm.style.display = 'none';
    loginForm.style.display = 'block';
    
    // Trigger animation
    loginForm.style.animation = 'none';
    setTimeout(() => {
        loginForm.style.animation = 'slideInRight 0.6s ease forwards';
    }, 10);
}

// Registration Handler
async function handleRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const registerData = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateRegistrationForm(registerData)) {
        return;
    }
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        // Show loading state
        submitButton.innerHTML = '<span class="loading-spinner"></span> Creating Account...';
        submitButton.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('Registration successful! Welcome to SecureBank!', 'success');
            event.target.reset();
            
            // Switch to login form after successful registration
            setTimeout(() => {
                showLoginForm();
            }, 2000);
        } else {
            if (result.message) {
                showAlert(result.message, 'danger');
            } else if (typeof result === 'object') {
                // Handle validation errors
                displayValidationErrors(result);
            } else {
                showAlert('Registration failed. Please try again.', 'danger');
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please check your connection and try again.', 'danger');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Login Handler
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = Object.fromEntries(formData.entries());
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        // Show loading state
        submitButton.innerHTML = '<span class="loading-spinner"></span> Signing In...';
        submitButton.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Store JWT token
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify({
                id: result.id,
                email: result.email,
                firstName: result.firstName,
                lastName: result.lastName,
                role: result.role
            }));
            
            showAlert(`Welcome back, ${result.firstName}!`, 'success');
            
            // Redirect to dashboard (you can implement this)
            setTimeout(() => {
                showDashboard();
            }, 1500);
            
        } else {
            showAlert(result.message || 'Login failed. Please check your credentials.', 'danger');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Network error. Please check your connection and try again.', 'danger');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Form Validation
function validateRegistrationForm(data) {
    const errors = [];
    
    // Name validation
    if (!data.firstName || data.firstName.length < 2) {
        errors.push('First name must be at least 2 characters long');
    }
    
    if (!data.lastName || data.lastName.length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(data.mobile)) {
        errors.push('Mobile number must be 10 digits starting with 6-9');
    }
    
    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(data.pan.toUpperCase())) {
        errors.push('PAN must be in format ABCDE1234F');
    }
    
    // Password validation
    if (data.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    
    // Pincode validation (if provided)
    if (data.pincode && !/^[1-9][0-9]{5}$/.test(data.pincode)) {
        errors.push('Pincode must be 6 digits');
    }
    
    if (errors.length > 0) {
        showAlert(errors.join('<br>'), 'danger');
        return false;
    }
    
    return true;
}

// Setup Real-time Form Validation
function setupFormValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
    });
    
    // Mobile validation
    const mobileInput = document.querySelector('input[name="mobile"]');
    if (mobileInput) {
        mobileInput.addEventListener('input', validateMobile);
    }
    
    // PAN validation
    const panInput = document.querySelector('input[name="pan"]');
    if (panInput) {
        panInput.addEventListener('input', validatePAN);
    }
    
    // Password validation
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', validatePassword);
    });
}

// Individual Field Validators
function validateEmail(event) {
    const input = event.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (input.value && !emailRegex.test(input.value)) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else if (input.value) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
    } else {
        input.classList.remove('is-valid', 'is-invalid');
    }
}

function validateMobile(event) {
    const input = event.target;
    const mobileRegex = /^[6-9]\d{9}$/;
    
    // Remove non-digit characters
    input.value = input.value.replace(/\D/g, '').slice(0, 10);
    
    if (input.value && !mobileRegex.test(input.value)) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else if (input.value) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
    } else {
        input.classList.remove('is-valid', 'is-invalid');
    }
}

function validatePAN(event) {
    const input = event.target;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    // Convert to uppercase
    input.value = input.value.toUpperCase();
    
    if (input.value && !panRegex.test(input.value)) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else if (input.value) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
    } else {
        input.classList.remove('is-valid', 'is-invalid');
    }
}

function validatePassword(event) {
    const input = event.target;
    
    if (input.value && input.value.length < 8) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else if (input.value) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
    } else {
        input.classList.remove('is-valid', 'is-invalid');
    }
}

// Display Validation Errors
function displayValidationErrors(errors) {
    let errorMessage = 'Please fix the following errors:<br>';
    for (const [field, message] of Object.entries(errors)) {
        errorMessage += `• ${message}<br>`;
        
        // Highlight the field with error
        const input = document.querySelector(`input[name="${field}"], select[name="${field}"]`);
        if (input) {
            input.classList.add('is-invalid');
        }
    }
    showAlert(errorMessage, 'danger');
}

// Alert System
function showAlert(message, type = 'info', duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Auto remove after duration
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, duration);
}

// Dashboard (placeholder for after login)
function showDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    document.body.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-lg">
                        <div class="card-header bg-primary text-white text-center">
                            <h3><i class="fas fa-tachometer-alt me-2"></i>Dashboard</h3>
                        </div>
                        <div class="card-body text-center">
                            <h4>Welcome, ${user.firstName} ${user.lastName}!</h4>
                            <p class="text-muted">Email: ${user.email}</p>
                            <p class="text-muted">Role: ${user.role}</p>
                            <hr>
                            <div class="alert alert-success">
                                <h5><i class="fas fa-check-circle me-2"></i>Login Successful!</h5>
                                <p>You have successfully logged into SecureBank. Your session is now active.</p>
                                <p><strong>JWT Token:</strong> ${localStorage.getItem('token').substring(0, 50)}...</p>
                            </div>
                            <button class="btn btn-danger" onclick="logout()">
                                <i class="fas fa-sign-out-alt me-2"></i>Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Logout Function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload();
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN').format(new Date(date));
}

// Check if user is already logged in
if (localStorage.getItem('token')) {
    showDashboard();
}