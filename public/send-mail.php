<?php
/**
 * send-mail.php — Contact/quote form handler for HostGator Shared Hosting.
 *
 * Stack: PHP + PHPMailer + SMTP (cPanel email).
 *
 * Flow:
 *   React ContactForm  -->  POST /send-mail.php (JSON)
 *   PHPMailer + SMTP   -->  info@maalausmultivari.fi  (lead notification)
 *   PHPMailer + SMTP   -->  customer email             (auto-reply)
 *
 * Returns JSON with HTTP 200 / 400 / 500.
 *
 * Two installation modes are supported (see HOSTGATOR-DEPLOY.md):
 *   1. Composer      — `composer require phpmailer/phpmailer` (preferred)
 *   2. Manual        — drop the PHPMailer folder next to this file
 *
 * The manual path auto-detects the library so the same script works either way.
 */

declare(strict_types=1);

// ---------------------------------------------------------------------------
// 0. Bootstrap: config + PHPMailer autoloader (composer or manual)
// ---------------------------------------------------------------------------

$configPath = __DIR__ . '/send-mail.config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Server is not configured.']);
    exit;
}
require_once $configPath;

// Load PHPMailer. Try Composer first, then manual installation.
$composerAutoload = __DIR__ . '/vendor/autoload.php';
$manualPath       = __DIR__ . '/PHPMailer/src/PHPMailer.php';

if (file_exists($composerAutoload)) {
    require_once $composerAutoload;
} elseif (file_exists($manualPath)) {
    require_once __DIR__ . '/PHPMailer/src/Exception.php';
    require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
    require_once __DIR__ . '/PHPMailer/src/SMTP.php';
} else {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'PHPMailer is not installed. See HOSTGATOR-DEPLOY.md.',
    ]);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---------------------------------------------------------------------------
// 1. Helpers: JSON response, sanitization, validation
// ---------------------------------------------------------------------------

function jsonResponse(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Strip control characters, trim, and normalize to valid UTF-8.
 * Defends against header injection (NUL, CR, LF) and malformed UTF-8.
 */
function clean(string $value): string
{
    // Remove NUL bytes and CRLF sequences (header-injection vectors).
    $value = str_replace(["\0", "\r", "\n"], '', $value);
    // Normalize to valid UTF-8, dropping invalid sequences.
    if (function_exists('mb_convert_encoding')) {
        $value = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
    }
    return trim($value);
}

/** HTML-escape for safe output inside the email body. */
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function clientIp(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = trim(explode(',', (string) $_SERVER[$key])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return 'unknown';
}

/**
 * File-based rate limiting. Uses a temp directory (writable on shared hosting)
 * to track submission counts per IP within a sliding window.
 */
function rateLimitOk(string $ip): bool
{
    $dir = sys_get_temp_dir() . '/mm_ratelimit';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        return true; // Fail open if storage is unavailable.
    }
    $file = $dir . '/' . md5($ip) . '.json';
    $now  = time();
    $data = ['hits' => []];

    if (is_file($file)) {
        $raw = @file_get_contents($file);
        if ($raw !== false) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded) && isset($decoded['hits'])) {
                $data = $decoded;
            }
        }
    }

    // Drop timestamps outside the window.
    $data['hits'] = array_values(
        array_filter($data['hits'], fn($t) => $t > $now - RATE_LIMIT_WINDOW_SECONDS)
    );

    if (count($data['hits']) >= RATE_LIMIT_MAX) {
        return false;
    }
    $data['hits'][] = $now;
    @file_put_contents($file, json_encode($data), LOCK_EX);
    return true;
}

/** Render a label/value row for the HTML email body. */
function row(string $label, string $value): string
{
    return '<div style="margin:4px 0">'
        . '<span style="color:#64748b;font-weight:600">' . $label . ':</span> '
        . $value . '</div>';
}

// ---------------------------------------------------------------------------
// 2. Origin validation + CORS
// ---------------------------------------------------------------------------

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonResponse(405, ['success' => false, 'message' => 'Method not allowed.']);
}

// On production, require the request to come from an allowed origin.
$referer  = $_SERVER['HTTP_REFERER'] ?? '';
$originOk = false;
foreach (ALLOWED_ORIGINS as $allowed) {
    if (str_starts_with($referer, $allowed)) {
        $originOk = true;
        break;
    }
}
// Block cross-origin requests from unlisted hosts; allow empty referer
// (some browsers strip it on same-origin POSTs).
if (!$originOk && $referer !== '') {
    jsonResponse(403, ['success' => false, 'message' => 'Request origin not allowed.']);
}

// Rate limit per IP.
$ip = clientIp();
if (!rateLimitOk($ip)) {
    jsonResponse(429, ['success' => false, 'message' => 'Too many requests. Please try again later.']);
}

// ---------------------------------------------------------------------------
// 3. Parse + validate input
// ---------------------------------------------------------------------------

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    jsonResponse(400, ['success' => false, 'message' => 'No data received.']);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    jsonResponse(400, ['success' => false, 'message' => 'Malformed JSON.']);
}

// Honeypot: if the hidden field is filled, a bot submitted. Pretend success.
$honeypot = clean((string) ($data['website'] ?? ''));
if ($honeypot !== '') {
    jsonResponse(200, ['success' => true]);
}

$name     = clean((string) ($data['name'] ?? ''));
$email    = clean((string) ($data['email'] ?? ''));
$phone    = clean((string) ($data['phone'] ?? ''));
$service  = clean((string) ($data['service'] ?? ''));
$message  = clean((string) ($data['message'] ?? ''));
$formType = ($data['formType'] ?? 'contact') === 'quote' ? 'quote' : 'contact';

// Quote-form-only optional fields.
$address      = clean((string) ($data['address'] ?? ''));
$city         = clean((string) ($data['city'] ?? ''));
$propertyType = clean((string) ($data['propertyType'] ?? ''));
$surfaceArea  = clean((string) ($data['surfaceArea'] ?? ''));
$timeline     = clean((string) ($data['timeline'] ?? ''));
$budget       = clean((string) ($data['budget'] ?? ''));

$errors = [];

if ($name === '') {
    $errors['name'] = 'Name is required.';
}
if ($email === '') {
    $errors['email'] = 'Email is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email address.';
}
if ($phone === '') {
    $errors['phone'] = 'Phone is required.';
} elseif (!preg_match('/^[+\d\s()\-]{6,}$/', $phone)) {
    $errors['phone'] = 'Invalid phone number.';
}
if ($service === '') {
    $errors['service'] = 'Service is required.';
}
if ($message === '' || mb_strlen($message) < 10) {
    $errors['message'] = 'Message must be at least 10 characters.';
}

if ($errors) {
    jsonResponse(400, [
        'success' => false,
        'message' => 'Validation failed.',
        'errors'  => $errors,
    ]);
}

// ---------------------------------------------------------------------------
// 4. Build email bodies
// ---------------------------------------------------------------------------

$submittedAt = date('Y-m-d H:i:s T');
$userAgent   = clean($_SERVER['HTTP_USER_AGENT'] ?? 'unknown');

// --- Lead notification (plain text + HTML) ---

$quoteLines = '';
if ($formType === 'quote') {
    $quoteLines = "\n"
        . "Address: {$address}\n"
        . "City: {$city}\n"
        . "Property type: {$propertyType}\n"
        . "Surface area: {$surfaceArea}\n"
        . "Timeline: {$timeline}\n"
        . "Budget: {$budget}\n";
}

$notificationText = "New {$formType} request - Maalaus Multiväri\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Selected Service: {$service}\n"
    . "{$quoteLines}"
    . "Message: {$message}\n\n"
    . "Date & Time: {$submittedAt}\n"
    . "Client IP: {$ip}\n"
    . "Browser User Agent: {$userAgent}\n";

$quoteRowsHtml = '';
if ($formType === 'quote') {
    $quoteRowsHtml = row('Address', e($address))
        . row('City', e($city))
        . row('Property type', e($propertyType))
        . row('Surface area', e($surfaceArea))
        . row('Timeline', e($timeline))
        . row('Budget', e($budget));
}

$notificationHtml = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
    . '<style>body{font-family:Arial,sans-serif;color:#1a2238;background:#f4f5f7;padding:24px;}'
    . 'table{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;'
    . 'box-shadow:0 1px 3px rgba(0,0,0,.08);}'
    . 'td{padding:6px 28px;font-size:14px;}.h{background:#f97316;color:#fff;padding:16px 28px;'
    . 'font-size:18px;font-weight:700;}hr{border:none;border-top:1px solid #e2e8f0;margin:16px 28px;}'
    . '</style></head><body>'
    . '<table><tr><td class="h">Maalaus Multiväri — New ' . $formType . ' request</td></tr>'
    . '<tr><td style="padding:16px 28px">'
    . row('Name', e($name))
    . row('Email', e($email))
    . row('Phone', e($phone))
    . row('Selected Service', e($service))
    . $quoteRowsHtml
    . row('Message', nl2br(e($message)))
    . '<hr>'
    . row('Date & Time', e($submittedAt))
    . row('Client IP', e($ip))
    . row('User Agent', e($userAgent))
    . '</td></tr></table></body></html>';

// --- Auto-reply to customer (plain text + HTML) ---

$replyText = "Thank you for contacting Maalaus Multiväri.\n\n"
    . "We have successfully received your quotation request.\n"
    . "Our team will contact you within 24 hours.\n"
    . "If your request is urgent, please call us directly.\n\n"
    . "Phone: " . BUSINESS_PHONE . "\n"
    . "Website: " . BUSINESS_WEBSITE . "\n\n"
    . "Regards,\nMaalaus Multiväri\n";

$replyHtml = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
    . '<style>body{font-family:Arial,sans-serif;color:#1a2238;background:#f4f5f7;padding:24px;}'
    . 'table{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;'
    . 'box-shadow:0 1px 3px rgba(0,0,0,.08);}p{font-size:15px;line-height:1.6;color:#475569;'
    . 'margin:0 0 12px;}.h{background:#f97316;color:#fff;padding:16px 28px;font-size:18px;'
    . 'font-weight:700;}strong{color:#1a2238;}</style></head><body>'
    . '<table><tr><td class="h">Maalaus Multiväri</td></tr>'
    . '<tr><td style="padding:24px 28px">'
    . '<p>Thank you for contacting Maalaus Multiväri.</p>'
    . '<p>We have successfully received your quotation request.</p>'
    . '<p>Our team will contact you within 24 hours.</p>'
    . '<p>If your request is urgent, please call us directly.</p>'
    . '<p style="margin-top:24px">Phone: ' . e(BUSINESS_PHONE) . '<br>'
    . 'Website: <a href="' . e(BUSINESS_WEBSITE) . '">' . e(BUSINESS_WEBSITE) . '</a></p>'
    . '<p>Regards,<br><strong>Maalaus Multiväri</strong></p>'
    . '</td></tr></table></body></html>';

// ---------------------------------------------------------------------------
// 5. Send both emails via PHPMailer + SMTP
// ---------------------------------------------------------------------------

$subject = $formType === 'quote'
    ? 'New Quote Request - Maalaus Multiväri'
    : 'New Contact Request - Maalaus Multiväri';

try {
    // 5a. Lead notification to the company.
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->Port       = SMTP_PORT;
    $mail->SMTPSecure = SMTP_SECURE;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64';

    $mail->setFrom(CONTACT_FROM_EMAIL, CONTACT_FROM_NAME);
    $mail->addAddress(CONTACT_TO_EMAIL, CONTACT_TO_NAME);
    $mail->addReplyTo($email, $name);

    $mail->Subject = $subject;
    $mail->Body    = $notificationHtml;
    $mail->AltBody = $notificationText;
    $mail->isHTML(true);
    $mail->send();

    // 5b. Auto-reply to the customer.
    $reply = new PHPMailer(true);
    $reply->isSMTP();
    $reply->Host       = SMTP_HOST;
    $reply->Port       = SMTP_PORT;
    $reply->SMTPSecure = SMTP_SECURE;
    $reply->SMTPAuth   = true;
    $reply->Username   = SMTP_USER;
    $reply->Password   = SMTP_PASS;
    $reply->CharSet    = 'UTF-8';
    $reply->Encoding   = 'base64';

    $reply->setFrom(CONTACT_FROM_EMAIL, CONTACT_FROM_NAME);
    $reply->addAddress($email, $name);
    $reply->addReplyTo(CONTACT_TO_EMAIL, CONTACT_TO_NAME);

    $reply->Subject = 'Thank you for contacting Maalaus Multiväri';
    $reply->Body    = $replyHtml;
    $reply->AltBody = $replyText;
    $reply->isHTML(true);
    $reply->send();

    jsonResponse(200, ['success' => true]);
} catch (Exception $ex) {
    error_log('send-mail.php PHPMailer error: ' . $ex->getMessage());
    jsonResponse(500, ['success' => false, 'message' => 'Email could not be sent.']);
} catch (Throwable $ex) {
    error_log('send-mail.php error: ' . $ex->getMessage());
    jsonResponse(500, ['success' => false, 'message' => 'Email could not be sent.']);
}
