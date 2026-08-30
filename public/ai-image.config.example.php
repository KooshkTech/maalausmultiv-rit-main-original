<?php

// Copy this file on the production server as ai-image.config.php.
// Never commit the real token to GitHub.
// Create a Hugging Face User Access Token with Inference Providers permission.
define('HF_TOKEN', getenv('HF_TOKEN') ?: 'REPLACE_WITH_HUGGINGFACE_TOKEN');

// The backend uses Hugging Face's image-to-image API. Keep these server-side.
define('HF_IMAGE_MODEL', getenv('HF_IMAGE_MODEL') ?: 'black-forest-labs/FLUX.1-Kontext-dev');
define('HF_IMAGE_ENDPOINT', getenv('HF_IMAGE_ENDPOINT') ?: 'https://router.huggingface.co/hf-inference/models/' . HF_IMAGE_MODEL);
