<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function failJson(int $status, string $message, string $code = ''): never {
    http_response_code($status);
    $payload = ['error' => $message];
    if ($code !== '') $payload['code'] = $code;
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') failJson(405, 'Method not allowed');

$allowedOrigins = ['https://maalausmultivari.fi', 'https://www.maalausmultivari.fi'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) failJson(403, 'Origin not allowed');

$configPath = __DIR__ . '/ai-image.config.php';
if (is_file($configPath)) require_once $configPath;

$token = getenv('HF_TOKEN') ?: (defined('HF_TOKEN') ? HF_TOKEN : '');
if (!$token || str_contains($token, 'REPLACE_')) {
    failJson(503, 'AI-kuvapalvelu ei ole vielä käytössä. Ylläpitäjän tulee lisätä Hugging Face -tunnus.', 'AI_NOT_CONFIGURED');
}
$model = getenv('HF_IMAGE_MODEL') ?: (defined('HF_IMAGE_MODEL') ? HF_IMAGE_MODEL : 'black-forest-labs/FLUX.1-Kontext-dev');
$providerModel = getenv('HF_IMAGE_PROVIDER_MODEL') ?: (defined('HF_IMAGE_PROVIDER_MODEL') ? HF_IMAGE_PROVIDER_MODEL : 'fal-ai/flux-kontext/dev');
$endpoint = getenv('HF_IMAGE_ENDPOINT') ?: (defined('HF_IMAGE_ENDPOINT') ? HF_IMAGE_ENDPOINT : 'https://router.huggingface.co/fal-ai/' . $providerModel . '?_subdomain=queue');
// Existing deployments preserve ai-image.config.php. Transparently migrate the
// former unsupported Kontext + hf-inference combination without touching token.
if (str_contains(strtolower($model), 'kontext') && str_contains($endpoint, '/hf-inference/')) {
    $endpoint = 'https://router.huggingface.co/fal-ai/' . $providerModel . '?_subdomain=queue';
}

// Protect the free monthly inference allowance from accidental abuse.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$windowSeconds = 3600;
$maxRequests = 3;
$rateFile = sys_get_temp_dir() . '/mvv-ai-' . hash('sha256', $ip) . '.json';
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $decoded = json_decode((string) @file_get_contents($rateFile), true);
    if (is_array($decoded)) $hits = array_values(array_filter($decoded, static fn($t) => is_int($t) && $t > $now - $windowSeconds));
}
if (count($hits) >= $maxRequests) failJson(429, 'AI-kuvien tuntiraja täyttyi. Yritä myöhemmin uudelleen.', 'RATE_LIMIT');

if (!isset($_FILES['image']) || !is_array($_FILES['image'])) failJson(422, 'Kuva puuttuu.');
$upload = $_FILES['image'];
if (($upload['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) failJson(422, 'Kuvan lataus epäonnistui.');
$tmpName = (string) ($upload['tmp_name'] ?? '');
$fileSize = (int) ($upload['size'] ?? 0);
if ($fileSize <= 0 || $fileSize > 12 * 1024 * 1024 || !is_uploaded_file($tmpName)) failJson(422, 'Kuvan koko ei kelpaa. Enimmäiskoko on 12 Mt.');
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = (string) $finfo->file($tmpName);
if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true)) failJson(422, 'Käytä JPG-, PNG- tai WebP-kuvaa.');

$mode = (string) ($_POST['mode'] ?? '');
if (!in_array($mode, ['paint', 'clean'], true)) failJson(422, 'Tuntematon muokkaustila.');

if ($mode === 'paint') {
    $surfaceMap = ['walls' => 'walls', 'ceiling' => 'ceiling', 'doors' => 'doors', 'trim' => 'baseboards, mouldings and trim'];
    $surface = $surfaceMap[$_POST['surface'] ?? 'walls'] ?? 'walls';
    $color = strtoupper(trim((string) ($_POST['color'] ?? '#D8C9B5')));
    if (!preg_match('/^#[0-9A-F]{6}$/', $color)) $color = '#D8C9B5';
    $prompt = "Photorealistically repaint only the {$surface} in this exact property photo using paint color {$color}. Preserve the exact geometry, camera angle, furniture, windows, fixtures, floor, artwork and every non-target surface. Preserve natural lighting, shadows, highlights and material texture. The paint must look physically applied to the target surface, never like a tint, brightness change, contrast filter or flat overlay. Do not add, remove, redesign or replace objects. Return the same scene with only the requested realistic paint change.";
} else {
    $room = trim((string) ($_POST['room'] ?? 'room'));
    $intensity = trim((string) ($_POST['intensity'] ?? 'standard'));
    $tasks = trim((string) ($_POST['tasks'] ?? 'general surface cleaning'));
    $prompt = "Create a photorealistic AFTER-cleaning version of this exact {$room}. Cleaning level: {$intensity}. Focus: {$tasks}. Preserve the exact camera angle, architecture, furniture, appliances, fixtures, decorations and belongings. Remove only realistic cleanable dirt, dust, grime, fingerprints, soap residue, limescale and ordinary stains. Keep material texture, reflections, shadows and lighting natural. Do not renovate, repaint, replace furniture, remove major objects, invent decor, change layout, or simulate cleaning by changing brightness, contrast or saturation. Return the same room immediately after professional cleaning.";
}

$imageBytes = @file_get_contents($tmpName);
if ($imageBytes === false) failJson(422, 'Kuvaa ei voitu lukea.');

// FLUX Kontext is served through Hugging Face's Fal AI provider, not hf-inference.
$imageDataUrl = 'data:' . $mime . ';base64,' . base64_encode($imageBytes);
$request = json_encode([
    'prompt' => $prompt,
    'image_url' => $imageDataUrl,
    'image_urls' => [$imageDataUrl],
    'num_images' => 1,
    'output_format' => 'jpeg',
], JSON_UNESCAPED_SLASHES);
if ($request === false) failJson(500, 'AI-pyynnön muodostaminen epäonnistui.');

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $request,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: image/*, application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_CONNECTTIMEOUT => 20,
    CURLOPT_TIMEOUT => 180,
]);
$response = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$contentType = (string) curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $curlError !== '') {
    error_log('HF image cURL error: ' . $curlError);
    failJson(502, 'AI-kuvapalveluun ei saatu yhteyttä. Yritä uudelleen hetken kuluttua.');
}
$body = substr((string) $response, $headerSize);

if ($status < 200 || $status >= 300) {
    $decoded = json_decode($body, true);
    $providerMessage = is_array($decoded) ? (string) ($decoded['error'] ?? $decoded['message'] ?? '') : '';
    error_log('HF image API HTTP ' . $status . ': ' . substr($body, 0, 1200));
    if ($status === 401 || $status === 403) failJson(503, 'Hugging Face -tunnus ei kelpaa tai sillä ei ole Inference Providers -oikeutta.', 'HF_AUTH');
    if ($status === 402 || str_contains(strtolower($providerMessage), 'credit')) failJson(429, 'Kuukauden ilmainen AI-kuvakiintiö on käytetty. Kiintiö palautuu Hugging Face -tilin ehtojen mukaisesti.', 'HF_CREDITS');
    if ($status === 429) failJson(429, 'AI-palvelu on tilapäisesti ruuhkainen tai käyttöraja täyttyi. Yritä myöhemmin.', 'HF_RATE_LIMIT');
    if ($status === 503) failJson(503, 'AI-kuvamalli ei ole juuri nyt käytettävissä. Yritä hetken kuluttua uudelleen.', 'HF_UNAVAILABLE');
    failJson(502, $providerMessage !== '' ? 'AI-kuvan luonti epäonnistui: ' . mb_substr($providerMessage, 0, 240) : 'AI-kuvan luonti epäonnistui.');
}

// Fal AI uses a queue. The first successful response contains a request ID and
// provider URLs; poll the corresponding routed status URL and then fetch result.
$queuePayload = json_decode($body, true);
if (is_array($queuePayload) && isset($queuePayload['request_id'], $queuePayload['response_url'])) {
    $responsePath = (string) parse_url((string) $queuePayload['response_url'], PHP_URL_PATH);
    if ($responsePath === '' || !str_starts_with($responsePath, '/')) {
        error_log('Fal AI queue response contained an invalid response_url');
        failJson(502, 'AI-kuvapalvelu palautti virheellisen jonovastauksen.', 'HF_PROVIDER_RESPONSE');
    }
    $query = (string) parse_url($endpoint, PHP_URL_QUERY);
    $querySuffix = $query !== '' ? '?' . $query : '';
    $routerBase = 'https://router.huggingface.co/fal-ai';
    $statusUrl = $routerBase . $responsePath . '/status' . $querySuffix;
    $resultUrl = $routerBase . $responsePath . $querySuffix;
    $deadline = time() + 170;
    $queueStatus = strtoupper((string) ($queuePayload['status'] ?? 'IN_QUEUE'));

    while ($queueStatus !== 'COMPLETED' && time() < $deadline) {
        usleep(500000);
        $poll = curl_init($statusUrl);
        curl_setopt_array($poll, [
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Accept: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 20,
            CURLOPT_TIMEOUT => 30,
        ]);
        $pollBody = curl_exec($poll);
        $pollStatus = (int) curl_getinfo($poll, CURLINFO_RESPONSE_CODE);
        $pollError = curl_error($poll);
        curl_close($poll);
        if ($pollBody === false || $pollError !== '' || $pollStatus < 200 || $pollStatus >= 300) {
            error_log('Fal AI status polling failed HTTP ' . $pollStatus . ': ' . $pollError);
            failJson(502, 'AI-kuvan käsittelyn tilaa ei voitu tarkistaa. Yritä uudelleen.', 'HF_QUEUE_STATUS');
        }
        $statusPayload = json_decode((string) $pollBody, true);
        $queueStatus = strtoupper((string) ($statusPayload['status'] ?? ''));
        if (in_array($queueStatus, ['FAILED', 'CANCELLED'], true)) {
            error_log('Fal AI queue ended with status ' . $queueStatus . ': ' . substr((string) $pollBody, 0, 1000));
            failJson(502, 'AI-kuvan käsittely epäonnistui palveluntarjoajalla.', 'HF_QUEUE_FAILED');
        }
    }
    if ($queueStatus !== 'COMPLETED') failJson(504, 'AI-kuvan käsittely kesti liian kauan. Yritä uudelleen.', 'HF_QUEUE_TIMEOUT');

    $result = curl_init($resultUrl);
    curl_setopt_array($result, [
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Accept: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 20,
        CURLOPT_TIMEOUT => 60,
    ]);
    $resultBody = curl_exec($result);
    $resultStatus = (int) curl_getinfo($result, CURLINFO_RESPONSE_CODE);
    $resultError = curl_error($result);
    curl_close($result);
    if ($resultBody === false || $resultError !== '' || $resultStatus < 200 || $resultStatus >= 300) {
        error_log('Fal AI result fetch failed HTTP ' . $resultStatus . ': ' . $resultError);
        failJson(502, 'Valmista AI-kuvaa ei voitu hakea. Yritä uudelleen.', 'HF_QUEUE_RESULT');
    }
    $body = (string) $resultBody;
    $contentType = 'application/json';
}

if (str_starts_with(strtolower($contentType), 'image/')) {
    $hits[] = $now;
    @file_put_contents($rateFile, json_encode($hits), LOCK_EX);
    $outputMime = str_contains(strtolower($contentType), 'png') ? 'image/png' : (str_contains(strtolower($contentType), 'webp') ? 'image/webp' : 'image/jpeg');
    echo json_encode(['image' => 'data:' . $outputMime . ';base64,' . base64_encode($body), 'provider' => 'huggingface', 'model' => $model], JSON_UNESCAPED_SLASHES);
    exit;
}

$payload = json_decode($body, true);
if (is_array($payload)) {
    $b64 = $payload['image'] ?? $payload['data'][0]['b64_json'] ?? null;
    $url = $payload['images'][0]['url'] ?? $payload['image_url'] ?? $payload['url'] ?? $payload['data'][0]['url'] ?? null;
    if (is_string($b64) && $b64 !== '') {
        $hits[] = $now; @file_put_contents($rateFile, json_encode($hits), LOCK_EX);
        echo json_encode(['image' => str_starts_with($b64, 'data:') ? $b64 : 'data:image/jpeg;base64,' . $b64, 'provider' => 'huggingface', 'model' => $model], JSON_UNESCAPED_SLASHES); exit;
    }
    if (is_string($url) && $url !== '') {
        $hits[] = $now; @file_put_contents($rateFile, json_encode($hits), LOCK_EX);
        echo json_encode(['imageUrl' => $url, 'provider' => 'fal-ai-via-huggingface', 'model' => $model], JSON_UNESCAPED_SLASHES); exit;
    }
}

error_log('HF image response missing image payload: ' . substr($body, 0, 1000));
failJson(502, 'AI-kuvapalvelu ei palauttanut kuvaa.');
