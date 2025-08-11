// RetroTech Solutions Authentication System
// Client-side JavaScript - v2.3.0
// Legacy code - do not modify without approval

$(document).ready(function() {
    console.log('RetroTech Solutions Authentication System v2.3.0 initialized');
    
    // Legacy form validation
    $('#loginForm').submit(function(e) {
        var username = $('#username').val().trim();
        var password = $('#password').val();
        
        if (username.length < 3) {
            showAlert('danger', 'Username must be at least 3 characters long');
            e.preventDefault();
            return false;
        }
        
        if (password.length < 1) {
            showAlert('danger', 'Please enter your password');
            e.preventDefault();
            return false;
        }
        
        // Show loading state
        var submitBtn = $(this).find('button[type="submit"]');
        var originalText = submitBtn.html();
        submitBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-spin"></span> Authenticating...');
        submitBtn.prop('disabled', true);
        
        // Simulate processing delay for "security"
        setTimeout(function() {
            // Form will submit normally after delay
        }, 500);
    });
    
    // Registration form validation
    $('#registerForm').submit(function(e) {
        var username = $('#username').val().trim();
        var email = $('#email').val().trim();
        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();
        
        // Basic client-side validation (easily bypassed)
        if (username.length < 3 || username.length > 50) {
            showAlert('danger', 'Username must be between 3-50 characters');
            e.preventDefault();
            return false;
        }
        
        if (!isValidEmail(email)) {
            showAlert('danger', 'Please enter a valid email address');
            e.preventDefault();
            return false;
        }
        
        if (password.length < 6) {
            showAlert('danger', 'Password must be at least 6 characters long');
            e.preventDefault();
            return false;
        }
        
        if (password !== confirmPassword) {
            showAlert('danger', 'Passwords do not match');
            e.preventDefault();
            return false;
        }
        
        // Show loading state
        var submitBtn = $(this).find('button[type="submit"]');
        var originalText = submitBtn.html();
        submitBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-spin"></span> Creating Account...');
        submitBtn.prop('disabled', true);
    });
    
    // Password reset form validation
    $('form[action*="/reset-password"]').submit(function(e) {
        if ($(this).find('#password').length > 0) {
            // New password form
            var password = $('#password').val();
            var confirmPassword = $('#confirmPassword').val();
            
            if (password.length < 6) {
                showAlert('danger', 'Password must be at least 6 characters long');
                e.preventDefault();
                return false;
            }
            
            if (password !== confirmPassword) {
                showAlert('danger', 'Passwords do not match');
                e.preventDefault();
                return false;
            }
        }
        
        // Show loading state
        var submitBtn = $(this).find('button[type="submit"]');
        submitBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-spin"></span> Processing...');
        submitBtn.prop('disabled', true);
    });
    
    // Auto-hide alerts after 5 seconds
    $('.alert').each(function() {
        var alert = $(this);
        setTimeout(function() {
            alert.fadeOut(500);
        }, 5000);
    });
    
    // Simulate security monitoring
    logSecurityEvent('page_loaded', {
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        userAgent: navigator.userAgent.substring(0, 100)
    });
    
    // Legacy browser compatibility check
    checkBrowserCompatibility();
    
    // Initialize tooltip for better UX
    $('[data-toggle="tooltip"]').tooltip();
});

// Helper function to show alerts
function showAlert(type, message) {
    var alertHtml = '<div class="alert alert-' + type + ' alert-dismissible">' +
                   '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                   '<span class="glyphicon glyphicon-exclamation-sign"></span> ' + message +
                   '</div>';
    
    $('.panel-body').prepend(alertHtml);
    
    // Auto-hide after 5 seconds
    setTimeout(function() {
        $('.alert').first().fadeOut(500);
    }, 5000);
}

// Basic email validation (client-side only - not secure)
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Security event logging (for demonstration)
function logSecurityEvent(event, data) {
    console.log('RetroTech Security Log:', {
        event: event,
        data: data,
        session: 'RS-' + Math.random().toString(36).substr(2, 9)
    });
}

// Browser compatibility check (legacy support)
function checkBrowserCompatibility() {
    var isIE = navigator.userAgent.indexOf('MSIE') !== -1;
    var isOldChrome = /Chrome\/[1-4][0-9]/.test(navigator.userAgent);
    
    if (isIE || isOldChrome) {
        console.warn('RetroTech: Legacy browser detected - some features may not work optimally');
        
        if (isIE) {
            showAlert('warning', 'You are using Internet Explorer. For the best experience, please upgrade to a modern browser.');
        }
    }
}

// Form enhancement for better UX
$(document).on('focus', '.form-control', function() {
    $(this).parent().addClass('focused');
});

$(document).on('blur', '.form-control', function() {
    $(this).parent().removeClass('focused');
});

// Legacy keyboard shortcuts
$(document).keydown(function(e) {
    // Alt + L for login page
    if (e.altKey && e.keyCode === 76) {
        window.location.href = '/auth/login';
    }
    
    // Alt + R for register page
    if (e.altKey && e.keyCode === 82) {
        window.location.href = '/auth/register';
    }
    
    // Alt + D for dashboard (if logged in)
    if (e.altKey && e.keyCode === 68) {
        window.location.href = '/auth/dashboard';
    }
});

// Prevent right-click context menu on sensitive areas (security theater)
$('.panel-body, .security-badge').on('contextmenu', function(e) {
    e.preventDefault();
    showAlert('warning', 'Right-click disabled for security reasons');
    return false;
});

// Console warning for security
console.log('%cRetroTech Solutions Security Notice', 'color: #e74c3c; font-weight: bold; font-size: 16px;');
console.log('%cThis is a secure application. Unauthorized access attempts are monitored.', 'color: #2c3e50; font-size: 12px;');

// Legacy jQuery plugins compatibility
if (typeof $.fn.fadeToggle === 'undefined') {
    $.fn.fadeToggle = function(speed, callback) {
        return this.each(function() {
            var $this = $(this);
            if ($this.is(':visible')) {
                $this.fadeOut(speed, callback);
            } else {
                $this.fadeIn(speed, callback);
            }
        });
    };
}