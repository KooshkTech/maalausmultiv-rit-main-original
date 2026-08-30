<?php

// Copy this file on the production server as ai-image.config.php.
// Never commit the real API key to GitHub.
define('OPENAI_API_KEY', getenv('OPENAI_API_KEY') ?: 'REPLACE_WITH_OPENAI_API_KEY');
