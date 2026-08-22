<?php
/**
 * SMTP configuration for the contact-form mail handler.
 *
 * Copy this file to `send-mail.config.php` and fill in the real values, OR
 * set the corresponding environment variables in your HostGator cPanel.
 * Never commit the filled-in `send-mail.config.php` to a public repository.
 *
 * The frontend (React) never loads this file — it lives only on the server.
 */

// Prefer environment variables when available (cPanel > Software > Set Env Vars).
// Fallbacks let you hard-code values for shared hosting without env-var support.
define('SMTP_HOST', getenv('SMTP_HOST') ?: 'maalausmultivari.fi');
define('SMTP_PORT', (int)(getenv('SMTP_PORT') ?: 465));
define('SMTP_SECURE', getenv('SMTP_SECURE') ?: 'ssl'); // ssl | tls | ''
define('SMTP_USER', getenv('SMTP_USER') ?: 'info@maalausmultivari.fi');
define('SMTP_PASS', getenv('SMTP_PASS') ?: 'REPLACE_WITH_REAL_PASSWORD');

// Destination inbox for lead notifications.
define('CONTACT_TO_EMAIL', getenv('CONTACT_TO_EMAIL') ?: 'info@maalausmultivari.fi');
define('CONTACT_TO_NAME', getenv('CONTACT_TO_NAME') ?: 'Maalaus Multiväri');

// From address — must be a mailbox on the same domain as SMTP_USER to avoid
// HostGator spoofing rejections. The customer's reply goes to their own email
// via the Reply-To header instead.
define('CONTACT_FROM_EMAIL', SMTP_USER);
define('CONTACT_FROM_NAME', 'Maalaus Multiväri Website');

// Public business details used in the auto-reply body.
define('BUSINESS_PHONE', '040 242 9650');
define('BUSINESS_WEBSITE', 'https://maalausmultivari.fi');

// Allowed request origins for CORS / origin validation.
define('ALLOWED_ORIGINS', [
    'https://maalausmultivari.fi',
    'https://www.maalausmultivari.fi',
]);

// Rate limiting: max submissions per IP per window.
define('RATE_LIMIT_MAX', 5);
define('RATE_LIMIT_WINDOW_SECONDS', 600); // 5 per 10 minutes
