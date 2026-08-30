<?php
/**
 * send-mail.php — Contact/quote form handler for HostGator Shared Hosting.
 *
 * Supports both JSON contact requests and multipart quote requests with images.
 */

declare(strict_types=1);

$configPath = __DIR__ . '/send-mail.config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Server is not configured.']);
    exit;
}
require_once $configPath;

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

const MAX_UPLOAD_FILES = 5;
const MAX_UPLOAD_FILE_BYTES = 5 * 1024 * 1024;
const MAX_UPLOAD_TOTAL_BYTES = 12 * 1024 * 1024;

function jsonResponse(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean(string $value): string
{
    $value = str_replace(["\0", "\r", "\n"], '', $value);
    if (function_exists('mb_convert_encoding')) {
        $value = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
    }
    return trim($value);
}

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

function rateLimitOk(string $ip): bool
{
    $dir = sys_get_temp_dir() . '/mm_ratelimit';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        return true;
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

function row(string $label, string $value): string
{
    return '<div style="margin:4px 0">'
        . '<span style="color:#64748b;font-weight:600">' . $label . ':</span> '
        . $value . '</div>';
}

function normalizeUploads(array $files): array
{
    if (!isset($files['name'])) {
        return [];
    }

    if (!is_array($files['name'])) {
        return [[
            'name' => $files['name'] ?? '',
            'type' => $files['type'] ?? '',
            'tmp_name' => $files['tmp_name'] ?? '',
            'error' => $files['error'] ?? UPLOAD_ERR_NO_FILE,
            'size' => $files['size'] ?? 0,
        ]];
    }

    $normalized = [];
    foreach ($files['name'] as $i => $name) {
        $normalized[] = [
            'name' => $name,
            'type' => $files['type'][$i] ?? '',
            'tmp_name' => $files['tmp_name'][$i] ?? '',
            'error' => $files['error'][$i] ?? UPLOAD_ERR_NO_FILE,
            'size' => $files['size'][$i] ?? 0,
        ];
    }
    return $normalized;
}

function validateUploads(array $uploads): array
{
    if (count($uploads) > MAX_UPLOAD_FILES) {
        jsonResponse(413, ['success' => false, 'message' => 'Voit lähettää enintään 5 kuvaa.']);
    }

    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/heic' => 'heic',
        'image/heif' => 'heif',
    ];

    $validated = [];
    $total = 0;
    $finfo = function_exists('finfo_open') ? finfo_open(FILEINFO_MIME_TYPE) : null;

    foreach ($uploads as $index => $upload) {
        $error = (int) ($upload['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($error === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($error !== UPLOAD_ERR_OK) {
            jsonResponse(400, ['success' => false, 'message' => 'Kuvan lähetys epäonnistui. Yritä uudelleen.']);
        }

        $tmp = (string) ($upload['tmp_name'] ?? '');
        $size = (int) ($upload['size'] ?? 0);
        if ($size <= 0 || $size > MAX_UPLOAD_FILE_BYTES) {
            jsonResponse(413, ['success' => false, 'message' => 'Yksi kuva saa olla enintään 5 Mt.']);
        }

        $total += $size;
        if ($total > MAX_UPLOAD_TOTAL_BYTES) {
            jsonResponse(413, ['success' => false, 'message' => 'Kuvien yhteiskoko saa olla enintään 12 Mt.']);
        }

        if ($tmp === '' || !is_uploaded_file($tmp)) {
            jsonResponse(400, ['success' => false, 'message' => 'Virheellinen kuvatiedosto.']);
        }

        $detected = $finfo ? finfo_file($finfo, $tmp) : (string) ($upload['type'] ?? '');
        if (!is_string($detected) || !isset($allowed[$detected])) {
            jsonResponse(400, ['success' => false, 'message' => 'Sallittu kuvatyyppi on JPG, PNG, WebP, HEIC tai HEIF.']);
        }

        $validated[] = [
            'tmp_name' => $tmp,
            'mime' => $detected,
            'safe_name' => 'kohdekuva-' . ($index + 1) . '.' . $allowed[$detected],
        ];
    }

    if ($finfo) {
        finfo_close($finfo);
    }

    return $validated;
}

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

$referer  = $_SERVER['HTTP_REFERER'] ?? '';
$originOk = false;
foreach (ALLOWED_ORIGINS as $allowed) {
    if (str_starts_with($referer, $allowed)) {
        $originOk = true;
        break;
    }
}
if (!$originOk && $referer !== '') {
    jsonResponse(403, ['success' => false, 'message' => 'Request origin not allowed.']);
}

$ip = clientIp();
if (!rateLimitOk($ip)) {
    jsonResponse(429, ['success' => false, 'message' => 'Liikaa pyyntöjä. Yritä myöhemmin uudelleen.']);
}

$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
$isMultipart = str_starts_with($contentType, 'multipart/form-data');

if ($isMultipart) {
    $data = $_POST;
    $uploads = isset($_FILES['files']) ? normalizeUploads($_FILES['files']) : [];
} else {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        jsonResponse(400, ['success' => false, 'message' => 'No data received.']);
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        jsonResponse(400, ['success' => false, 'message' => 'Malformed JSON.']);
    }
    $uploads = [];
}

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

$attachments = validateUploads($uploads);
$submittedAt = date('Y-m-d H:i:s T');
$userAgent   = clean($_SERVER['HTTP_USER_AGENT'] ?? 'unknown');

$quoteLines = '';
if ($formType === 'quote') {
    $quoteLines = "\n"
        . "Address: {$address}\n"
        . "City: {$city}\n"
        . "Property type: {$propertyType}\n"
        . "Surface area: {$surfaceArea}\n"
        . "Timeline: {$timeline}\n"
        . "Budget: {$budget}\n"
        . "Attachments: " . count($attachments) . "\n";
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
        . row('Budget', e($budget))
        . row('Attachments', (string) count($attachments));
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

$replyText = "Kiitos yhteydenotostasi Maalaus Multiväriin.\n\n"
    . "Olemme vastaanottaneet tarjouspyyntösi ja palaamme asiaan 24 tunnin sisällä.\n"
    . (count($attachments) > 0 ? "Vastaanotimme myös lähettämäsi kuvat.\n" : '')
    . "Kiireellisessä asiassa voit soittaa meille suoraan.\n\n"
    . "Puhelin: " . BUSINESS_PHONE . "\n"
    . "Verkkosivu: " . BUSINESS_WEBSITE . "\n\n"
    . "Ystävällisin terveisin,\nMaalaus Multiväri\n";

$replyHtml = '<!DOCTYPE html><html lang="fi"><head><meta charset="utf-8">'
    . '<style>body{font-family:Arial,sans-serif;color:#1a2238;background:#f4f5f7;padding:24px;}'
    . 'table{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;'
    . 'box-shadow:0 1px 3px rgba(0,0,0,.08);}p{font-size:15px;line-height:1.6;color:#475569;'
    . 'margin:0 0 12px;}.h{background:#f97316;color:#fff;padding:16px 28px;font-size:18px;'
    . 'font-weight:700;}strong{color:#1a2238;}</style></head><body>'
    . '<table><tr><td class="h">Maalaus Multiväri</td></tr>'
    . '<tr><td style="padding:24px 28px">'
    . '<p>Kiitos yhteydenotostasi Maalaus Multiväriin.</p>'
    . '<p>Olemme vastaanottaneet tarjouspyyntösi ja palaamme asiaan 24 tunnin sisällä.</p>'
    . (count($attachments) > 0 ? '<p>Vastaanotimme myös lähettämäsi kuvat.</p>' : '')
    . '<p>Kiireellisessä asiassa voit soittaa meille suoraan.</p>'
    . '<p style="margin-top:24px">Puhelin: ' . e(BUSINESS_PHONE) . '<br>'
    . 'Verkkosivu: <a href="' . e(BUSINESS_WEBSITE) . '">' . e(BUSINESS_WEBSITE) . '</a></p>'
    . '<p>Ystävällisin terveisin,<br><strong>Maalaus Multiväri</strong></p>'
    . '</td></tr></table></body></html>';

$subject = $formType === 'quote'
    ? 'New Quote Request - Maalaus Multiväri'
    : 'New Contact Request - Maalaus Multiväri';

try {
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

    foreach ($attachments as $attachment) {
        $mail->addAttachment(
            $attachment['tmp_name'],
            $attachment['safe_name'],
            'base64',
            $attachment['mime']
        );
    }

    $mail->Subject = $subject;
    $mail->Body    = $notificationHtml;
    $mail->AltBody = $notificationText;
    $mail->isHTML(true);
    $mail->send();

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

    $reply->Subject = 'Kiitos tarjouspyynnöstäsi – Maalaus Multiväri';
    $reply->Body    = $replyHtml;
    $reply->AltBody = $replyText;
    $reply->isHTML(true);
    $reply->send();

    jsonResponse(200, [
        'success' => true,
        'attachmentsReceived' => count($attachments),
    ]);
} catch (Exception $ex) {
    error_log('send-mail.php PHPMailer error: ' . $ex->getMessage());
    jsonResponse(500, ['success' => false, 'message' => 'Email could not be sent.']);
} catch (Throwable $ex) {
    error_log('send-mail.php error: ' . $ex->getMessage());
    jsonResponse(500, ['success' => false, 'message' => 'Email could not be sent.']);
}
