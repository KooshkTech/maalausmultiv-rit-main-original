<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$allowedOrigins = [
    'https://maalausmultivari.fi',
    'https://www.maalausmultivari.fi',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Origin not allowed']);
    exit;
}

$configPath = __DIR__ . '/ai-image.config.php';
if (is_file($configPath)) {
    require_once $configPath;
}

$apiKey = getenv('OPENAI_API_KEY') ?: (defined('OPENAI_API_KEY') ? OPENAI_API_KEY : '');
if (!$apiKey || str_contains($apiKey, 'REPLACE_')) {
    http_response_code(503);
    echo json_encode([
        'error' => 'AI image service is not configured',
        'code' => 'AI_NOT_CONFIGURED',
    ]);
    exit;
}

// Small per-IP cost guard. This is intentionally conservative because each
// request invokes a paid image-edit model.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$windowSeconds = 1800;
$maxRequests = 8;
$rateFile = sys_get_temp_dir() . '/mvv-ai-' . hash('sha256', $ip) . '.json';
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $decoded = json_decode((string) @file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $hits = array_values(array_filter($decoded, static fn($timestamp) => is_int($timestamp) && $timestamp > $now - $windowSeconds));
    }
}
if (count($hits) >= $maxRequests) {
    http_response_code(429);
    echo json_encode(['error' => 'Liian monta AI-kuvapyyntöä. Yritä hetken kuluttua uudelleen.', 'code' => 'RATE_LIMIT']);
    exit;
}
$hits[] = $now;
@file_put_contents($rateFile, json_encode($hits), LOCK_EX);

if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
    http_response_code(422);
    echo json_encode(['error' => 'Kuva puuttuu.']);
    exit;
}

$upload = $_FILES['image'];
if (($upload['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    http_response_code(422);
    echo json_encode(['error' => 'Kuvan lataus epäonnistui.']);
    exit;
}

$tmpName = (string) ($upload['tmp_name'] ?? '');
$fileSize = (int) ($upload['size'] ?? 0);
if ($fileSize <= 0 || $fileSize > 12 * 1024 * 1024 || !is_uploaded_file($tmpName)) {
    http_response_code(422);
    echo json_encode(['error' => 'Kuvan koko ei kelpaa. Enimmäiskoko on 12 Mt.']);
    exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = (string) $finfo->file($tmpName);
$allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
if (!in_array($mime, $allowedMime, true)) {
    http_response_code(422);
    echo json_encode(['error' => 'Käytä JPG-, PNG- tai WebP-kuvaa.']);
    exit;
}

$mode = $_POST['mode'] ?? '';
if (!in_array($mode, ['paint', 'clean'], true)) {
    http_response_code(422);
    echo json_encode(['error' => 'Tuntematon muokkaustila.']);
    exit;
}

if ($mode === 'paint') {
    $surfaceMap = [
        'walls' => 'walls',
        'ceiling' => 'ceiling',
        'doors' => 'doors',
        'trim' => 'baseboards, mouldings and trim',
    ];
    $surface = $surfaceMap[$_POST['surface'] ?? 'walls'] ?? 'walls';
    $color = strtoupper(trim((string) ($_POST['color'] ?? '#D8C9B5')));
    if (!preg_match('/^#[0-9A-F]{6}$/', $color)) {
        $color = '#D8C9B5';
    }
    $prompt = "Photorealistically repaint only the {$surface} in the provided property photo using paint color {$color}. "
        . "Preserve the exact room/building geometry, perspective, furniture, windows, fixtures, flooring, artwork and all non-target surfaces. "
        . "Keep the original lighting direction, natural shadows, highlights, surface texture and material detail so the result looks physically painted, not like a flat color overlay or filter. "
        . "Do not redesign, replace, add or remove objects. Do not change exposure, white balance or contrast unless required to make the new paint physically believable. "
        . "Return a realistic customer preview of the same scene with only the requested paint change.";
} else {
    $room = trim((string) ($_POST['room'] ?? 'room'));
    $intensity = trim((string) ($_POST['intensity'] ?? 'standard'));
    $tasks = trim((string) ($_POST['tasks'] ?? 'general surface cleaning'));
    $prompt = "Create a photorealistic AFTER-cleaning version of this exact {$room}. Cleaning level: {$intensity}. Requested cleaning focus: {$tasks}. "
        . "Preserve the exact camera angle, architecture, furniture, appliances, fixtures, decorations and personal belongings. "
        . "Remove realistic visible dirt, dust, grime, fingerprints, soap residue, limescale and ordinary cleanable stains from appropriate surfaces. "
        . "Make surfaces look professionally cleaned and naturally dry, while preserving material texture, reflections, shadows and lighting. "
        . "Do not renovate, repaint, replace furniture, remove major objects, invent new decor, change the room layout, or merely brighten/darken the whole image. "
        . "The result must look like the same room immediately after professional cleaning.";
}

$postFields = [
    'model' => 'gpt-image-2',
    'prompt' => $prompt,
    'image' => new CURLFile($tmpName, $mime, 'input.jpg'),
    'quality' => 'medium',
    'size' => 'auto',
    'input_fidelity' => 'high',
    'output_format' => 'jpeg',
    'n' => '1',
];

$ch = curl_init('https://api.openai.com/v1/images/edits');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postFields,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $apiKey],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 15,
    CURLOPT_TIMEOUT => 150,
]);
$responseBody = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($responseBody === false || $curlError !== '') {
    error_log('AI image cURL error: ' . $curlError);
    http_response_code(502);
    echo json_encode(['error' => 'AI-kuvapalveluun ei saatu yhteyttä.']);
    exit;
}

$payload = json_decode((string) $responseBody, true);
if ($status < 200 || $status >= 300 || !is_array($payload)) {
    error_log('AI image API error HTTP ' . $status . ': ' . substr((string) $responseBody, 0, 1000));
    http_response_code(502);
    $apiMessage = is_array($payload) ? ($payload['error']['message'] ?? null) : null;
    echo json_encode(['error' => $apiMessage ?: 'AI-kuvan luonti epäonnistui.']);
    exit;
}

$b64 = $payload['data'][0]['b64_json'] ?? null;
$url = $payload['data'][0]['url'] ?? null;
if (is_string($b64) && $b64 !== '') {
    echo json_encode(['image' => 'data:image/jpeg;base64,' . $b64]);
    exit;
}
if (is_string($url) && $url !== '') {
    echo json_encode(['imageUrl' => $url]);
    exit;
}

error_log('AI image response missing image payload: ' . substr((string) $responseBody, 0, 1000));
http_response_code(502);
echo json_encode(['error' => 'AI-kuvapalvelu ei palauttanut kuvaa.']);
