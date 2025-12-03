/**
 * Custom Contact Form Handler for Binarywise
 * Replaces PHP mail functionality for static hosting
 * 
 * CURRENT STATUS: Development mode - shows success message locally
 * 
 * TO ENABLE REAL EMAIL SENDING:
 * 1. For EmailJS: Uncomment the EmailJS section and add your service credentials
 * 2. For Formspree: Uncomment the Formspree section and add your form endpoint
 * 3. For backend server: Deploy mail.php to a PHP server and update form action
 */

(function($) {
    'use strict';

    // Contact Form Configuration
    var contactForm = {
        form: '.ajax-contact',
        invalidCls: 'is-invalid',
        validation: '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]',
        emailField: '[name="email"]',
        messages: $('.form-messages'),
        
        // EmailJS Configuration - UPDATE THESE VALUES
        emailjsConfig: {
            serviceId: 'service_ldbswhm',      // Replace with your Service ID from EmailJS
            templateId: 'template_eyqddl9',    // Replace with your Template ID from EmailJS  
            publicKey: 'rf8opFDE0m8LOp-lE'  // Replace with your Public Key from EmailJS
        },
        
        // Initialize the contact form
        init: function() {
            this.bindEvents();
        },
        
        // Bind form events
        bindEvents: function() {
            var self = this;
            $(this.form).on('submit', function(e) {
                e.preventDefault();
                self.handleSubmit();
            });
        },
        
        // Handle form submission
        handleSubmit: function() {
            var self = this;
            
            if (this.validateForm()) {
                this.showLoading();
                
                // Get form data
                var formData = {
                    name: $(this.form + ' [name="name"]').val(),
                    email: $(this.form + ' [name="email"]').val(),
                    subject: $(this.form + ' [name="subject"]').val(),
                    number: $(this.form + ' [name="number"]').val(),
                    message: $(this.form + ' [name="message"]').val()
                };
                
                // Check if EmailJS is configured
                if (window.emailjs && this.emailjsConfig.publicKey && this.emailjsConfig.publicKey !== 'YOUR_PUBLIC_KEY_HERE') {
                    this.sendWithEmailJS(formData);
                } else {
                    // Demo mode - remove this once EmailJS is configured
                    console.log('EmailJS not configured. Form data:', formData);
                    setTimeout(function() {
                        self.showDemoMessage();
                        self.clearForm();
                    }, 1500);
                }
            }
        },
        
        // Validate the form
        validateForm: function() {
            var isValid = true;
            var self = this;
            
            // Clear previous validation states
            $(this.form + ' input, ' + this.form + ' textarea').removeClass(this.invalidCls);
            
            // Validate required fields
            var fields = this.validation.split(',');
            fields.forEach(function(field) {
                var $field = $(self.form + ' ' + field.trim());
                if (!$field.val().trim()) {
                    $field.addClass(self.invalidCls);
                    isValid = false;
                }
            });
            
            // Validate email format
            var emailValue = $(this.emailField).val();
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailValue || !emailRegex.test(emailValue)) {
                $(this.emailField).addClass(this.invalidCls);
                isValid = false;
            }
            
            // Show validation message if form is invalid
            if (!isValid) {
                this.showError('Please fill in all required fields with valid information.');
            }
            
            return isValid;
        },
        
        // Show loading state
        showLoading: function() {
            this.messages.removeClass('error success');
            this.messages.addClass('loading');
            this.messages.html('<i class="fas fa-spinner fa-spin"></i> Sending your message...');
            
            // Disable submit button
            $(this.form + ' button[type="submit"]').prop('disabled', true);
        },
        
        // Show success message
        showSuccess: function() {
            this.messages.removeClass('error loading');
            this.messages.addClass('success');
            this.messages.html('<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
            
            // Re-enable submit button
            $(this.form + ' button[type="submit"]').prop('disabled', false);
        },
        
        // Show demo message
        showDemoMessage: function() {
            this.messages.removeClass('error loading');
            this.messages.addClass('success demo');
            this.messages.html('<i class="fas fa-info-circle"></i> <strong>Demo Mode:</strong> Form validation works! To enable email sending, follow the setup guide in EMAILJS_STATIC_HOSTING_SETUP.md');
            
            // Re-enable submit button
            $(this.form + ' button[type="submit"]').prop('disabled', false);
        },
        
        // Show error message
        showError: function(message) {
            this.messages.removeClass('success loading');
            this.messages.addClass('error');
            this.messages.html('<i class="fas fa-exclamation-circle"></i> ' + message);
            
            // Re-enable submit button
            $(this.form + ' button[type="submit"]').prop('disabled', false);
        },
        
        // Clear form fields
        clearForm: function() {
            $(this.form + ' input:not([type="submit"]), ' + this.form + ' textarea').val('');
            $(this.form + ' input, ' + this.form + ' textarea').removeClass(this.invalidCls);
        },
        
        // Send email using EmailJS
        sendWithEmailJS: function(formData) {
            var self = this;
            
            emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                {
                    to_name: 'Binarywise Team',
                    to_email: 'info@binarywise.io', // Your Gmail address where you want to receive messages
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    phone_number: formData.number,
                    message: formData.message,
                    reply_to: formData.email
                },
                this.emailjsConfig.publicKey
            ).then(function(response) {
                console.log('EmailJS Success:', response);
                self.showSuccess();
                self.clearForm();
            }, function(error) {
                console.error('EmailJS Error:', error);
                self.showError('Failed to send message. Please try again or contact us directly.');
            });
        }
    };
    
    // Initialize when document is ready
    $(document).ready(function() {
        // Initialize EmailJS if configured
        if (contactForm.emailjsConfig.publicKey) {
            emailjs.init(contactForm.emailjsConfig.publicKey);
        }
        
        contactForm.init();
    });
    
})(jQuery);
