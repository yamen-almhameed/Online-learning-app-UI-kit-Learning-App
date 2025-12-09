# سكريبت لتثبيت Android SDK Platform 36.0.0

Write-Host "جارٍ البحث عن Android SDK Manager..." -ForegroundColor Cyan

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
        Write-Host "✓ تم العثور على SDK Manager: $path" -ForegroundColor Green
        break
    }
}

if (-not $sdkManager) {
    Write-Host "✗ لم يتم العثور على SDK Manager" -ForegroundColor Red
    Write-Host "`nالحل البديل:" -ForegroundColor Yellow
    Write-Host "1. افتح Android Studio" -ForegroundColor White
    Write-Host "2. اذهب إلى: File → Settings → Appearance & Behavior → System Settings → Android SDK" -ForegroundColor White
    Write-Host "3. في تبويب SDK Platforms، ثبّت Android 14.0 (API 34) أو Android 15.0 (API 35)" -ForegroundColor White
    Write-Host "4. أو ثبّت Android SDK Platform 36.0.0" -ForegroundColor White
    exit 1
}

Write-Host "`nجارٍ تثبيت Android SDK Platform 36.0.0..." -ForegroundColor Cyan
& $sdkManager "platforms;android-36" --sdk_root=$sdkPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ تم تثبيت Android SDK Platform 36.0.0 بنجاح!" -ForegroundColor Green
} else {
    Write-Host "✗ فشل التثبيت. حاول من Android Studio" -ForegroundColor Red
}

