# Script to install Android SDK Build Tools 36.0.0

Write-Host "Searching for Android SDK Manager..." -ForegroundColor Cyan

$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$sdkManagerPaths = @(
    "$sdkPath\cmdline-tools\latest\bin\sdkmanager.bat",
    "$sdkPath\tools\bin\sdkmanager.bat",
    "$sdkPath\cmdline-tools\bin\sdkmanager.bat"
)

$sdkManager = $null
foreach ($path in $sdkManagerPaths) {
    if (Test-Path $path) {
        $sdkManager = $path
        Write-Host "Found SDK Manager: $path" -ForegroundColor Green
        break
    }
}

if (-not $sdkManager) {
    Write-Host "SDK Manager not found" -ForegroundColor Red
    Write-Host "Alternative solution:" -ForegroundColor Yellow
    Write-Host "1. Open Android Studio" -ForegroundColor White
    Write-Host "2. Go to: File -> Settings -> Android SDK" -ForegroundColor White
    Write-Host "3. In SDK Tools tab, install Android SDK Build-Tools 36.0.0" -ForegroundColor White
    exit 1
}

Write-Host "Installing Android SDK Build Tools 36.0.0..." -ForegroundColor Cyan
& $sdkManager "build-tools;36.0.0" --sdk_root=$sdkPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully installed Android SDK Build Tools 36.0.0!" -ForegroundColor Green
} else {
    Write-Host "Installation failed. Try from Android Studio" -ForegroundColor Red
}
