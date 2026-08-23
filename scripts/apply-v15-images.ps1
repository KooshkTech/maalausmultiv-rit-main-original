param(
  [Parameter(Mandatory = $true)]
  [string]$ZipPath
)

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$publicDir = Join-Path $repoRoot 'public'
$imagesDir = Join-Path $publicDir 'images'
$tempDir = Join-Path $repoRoot '.tmp-v15-images'

if (-not (Test-Path $ZipPath)) {
  throw "Image ZIP not found: $ZipPath"
}

if (Test-Path $tempDir) {
  Remove-Item $tempDir -Recurse -Force
}

New-Item -ItemType Directory -Path $tempDir | Out-Null
Expand-Archive -Path $ZipPath -DestinationPath $tempDir -Force

$sourceImages = Join-Path $tempDir 'images'
if (-not (Test-Path $sourceImages)) {
  $nested = Get-ChildItem $tempDir -Directory -Recurse | Where-Object { $_.Name -eq 'images' } | Select-Object -First 1
  if ($nested) {
    $sourceImages = $nested.FullName
  }
}

if (-not (Test-Path $sourceImages)) {
  throw 'The ZIP must contain an images/ folder.'
}

$backupDir = Join-Path $repoRoot ('.backup-images-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
if (Test-Path $imagesDir) {
  Copy-Item $imagesDir $backupDir -Recurse -Force
}

if (Test-Path $imagesDir) {
  Remove-Item $imagesDir -Recurse -Force
}
Copy-Item $sourceImages $imagesDir -Recurse -Force

Remove-Item $tempDir -Recurse -Force

Write-Host "Applied V15 images to: $imagesDir"
Write-Host "Backup created at: $backupDir"
Write-Host ''
Write-Host 'Now run:'
Write-Host '  npm run verify:images'
Write-Host '  npm run typecheck'
Write-Host '  npm run lint'
Write-Host '  npm run build'
Write-Host '  git add public/images'
Write-Host '  git commit -m "V15: apply real image refresh"'
Write-Host '  git push origin main'
