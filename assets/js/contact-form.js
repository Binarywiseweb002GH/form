/**
 * Contact Form Handler with EmailJS
 * Fully client-side for static hosting
 */

(function($) {
    'use strict';

    var contactForm = {
        form: '.ajax-contact',
        invalidCls: 'is-invalid',
        validation: '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]',
        emailField: '[name="email"]',
        messages: $('.form-messages'),

        // EmailJS Configuration
        emailjsConfig: {
            serviceId: 'service_ldbswhm',      // Replace with your Service ID
            templateId: 'template_eyqddl9',    // Replace with your Template ID
            publicKey: 'rf8opFDE0m8LOp-lE'     // Replace with your Public Key
        },

        init: function() {
            var self = this;

            // Initialize EmailJS
            if (window.emailjs && this.emailjsConfig.publicKey) {
                emailjs.init(this.emailjsConfig.publicKey);
            }

            // Bind form submit
            $(this.form).on('submit', function(e) {
                e.preventDefault(); // Prevent default POST
                self.handleSubmit();
            });
        },

        handleSubmit: function() {
            var self = this;

            if (this.validateForm()) {
                this.showLoading();

                var formData = {
                    name: $(this.form + ' [name="name"]').val(),
                    email: $(this.form + ' [name="email"]').val(),
                    subject: $(this.form + ' [name="subject"]').val(),
                    number: $(this.form + ' [name="number"]').val(),
                    message: $(this.form + ' [name="message"]').val()
                };

                // Send with EmailJS
                this.sendWithEmailJS(formData);
            }
        },

        validateForm: function() {
            var isValid = true;
            var self = this;

            // Remove previous validation states
            $(this.form + ' input, ' + this.form + ' textarea').removeClass(this.invalidCls);

            // Check required fields
            var fields = this.validation.split(',');
            fields.forEach(function(field) {
                var $field = $(self.form + ' ' + field.trim());
                if (!$field.val().trim()) {
                    $field.addClass(self.invalidCls);
                    isValid = false;
                }
            });

            // Email format validation
            var emailValue = $(this.form + ' ' + this.emailField).val();
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailValue || !emailRegex.test(emailValue)) {
                $(this.form + ' ' + this.emailField).addClass(this.invalidCls);
                isValid = false;
            }

            if (!isValid) {
                this.showError('Please fill in all required fields with valid information.');
            }

            return isValid;
        },

        showLoading: function() {
            this.messages.removeClass('error success demo').addClass('loading');
            this.messages.html('<i class="fas fa-spinner fa-spin"></i> Sending your message...');
            $(this.form + ' button[type="submit"]').prop('disabled', true);
        },

        showSuccess: function() {
            this.messages.removeClass('error loading demo').addClass('success');
            this.messages.html('<i class="fas fa-check-circle"></i> Your message has been sent successfully!');
            $(this.form + ' button[type="submit"]').prop('disabled', false);
            this.clearForm();
        },

        showError: function(message) {
            this.messages.removeClass('success loading demo').addClass('error');
            this.messages.html('<i class="fas fa-exclamation-circle"></i> ' + message);
            $(this.form + ' button[type="submit"]').prop('disabled', false);
        },

        clearForm: function() {
            $(this.form + ' input:not([type="submit"]), ' + this.form + ' textarea').val('');
            $(this.form + ' input, ' + this.form + ' textarea').removeClass(this.invalidCls);
        },

        sendWithEmailJS: function(formData) {
            var self = this;

            emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                {
                    to_name: 'Binarywise Team',
                    to_email: 'info@binarywise.io', // Your receiving email
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    phone_number: formData.number,
                    message: formData.message,
                    reply_to: formData.email
                }
            ).then(function(response) {
                console.log('EmailJS Success:', response);
                self.showSuccess();
            }, function(error) {
                console.error('EmailJS Error:', error);
                self.showError('Failed to send message. Please try again or contact us directly.');
            });
        }
    };

    // Initialize when document is ready
    $(document).ready(function() {
        contactForm.init();
    });

})(jQuery);
