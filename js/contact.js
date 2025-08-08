// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoading = submitButton.querySelector('.button-loading');

    // Form validation
    function validateForm() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        // Phone validation
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showFieldError(this, 'This field is required');
            } else {
                clearFieldError(this);
            }
        });

        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });

    // Phone number formatting
    const phoneField = document.getElementById('phone');
    phoneField.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
        }
        this.value = value;
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline';

        // Collect form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Reset loading state
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';

            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
            
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'contact',
                    'event_label': 'contact_form'
                });
            }
        }, 2000);
    });

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <h3>Thank You!</h3>
                <p>Your request has been submitted successfully. We'll contact you within 24 hours with your free estimate.</p>
                <p>For immediate assistance, call us at <a href="tel:917-624-8550">917-624-8550</a></p>
            </div>
        `;

        // Insert success message before the form
        contactForm.parentNode.insertBefore(successDiv, contactForm);

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove success message after 10 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 10000);
    }

    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // Initially hide answers
        answer.style.display = 'none';
        question.style.cursor = 'pointer';
        question.style.position = 'relative';
        
        // Add toggle indicator
        const indicator = document.createElement('span');
        indicator.textContent = '+';
        indicator.style.position = 'absolute';
        indicator.style.right = '0';
        indicator.style.fontSize = '1.2em';
        indicator.style.fontWeight = 'bold';
        question.appendChild(indicator);

        question.addEventListener('click', function() {
            const isVisible = answer.style.display === 'block';
            
            if (isVisible) {
                answer.style.display = 'none';
                indicator.textContent = '+';
                item.classList.remove('active');
            } else {
                answer.style.display = 'block';
                indicator.textContent = '−';
                item.classList.add('active');
            }
        });
    });

    // Auto-fill form based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('service')) {
        const serviceSelect = document.getElementById('serviceType');
        const serviceValue = urlParams.get('service');
        if (serviceSelect) {
            serviceSelect.value = serviceValue;
        }
    }

    if (urlParams.get('borough')) {
        const boroughSelect = document.getElementById('borough');
        const boroughValue = urlParams.get('borough');
        if (boroughSelect) {
            boroughSelect.value = boroughValue;
        }
    }

    // Emergency notice enhancement
    const emergencyNotice = document.querySelector('.emergency-notice');
    if (emergencyNotice) {
        emergencyNotice.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'emergency_click', {
                    'event_category': 'contact',
                    'event_label': 'emergency_notice'
                });
            }
        });
    }

    // Service area quick links tracking
    const areaLinks = document.querySelectorAll('.area-quick-link');
    areaLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'area_link_click', {
                    'event_category': 'navigation',
                    'event_label': this.querySelector('.area-name').textContent
                });
            }
        });
    });
});

// Utility function to get form data as object
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

// Function to pre-fill form for specific services
function prefillServiceForm(service, borough = '') {
    const serviceSelect = document.getElementById('serviceType');
    const boroughSelect = document.getElementById('borough');
    
    if (serviceSelect && service) {
        serviceSelect.value = service;
    }
    
    if (boroughSelect && borough) {
        boroughSelect.value = borough;
    }
    
    // Scroll to form
    const formSection = document.querySelector('.contact-form-section');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

