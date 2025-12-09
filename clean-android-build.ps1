# Script to clean Android build cache and rebuild
# This fixes issues with missing packages like react-native-screens

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleaning Android build cache..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set JAVA_TOOL_OPTIONS for the build
$env:JAVA_TOOL_OPTIONS = "--add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED --add-opens=java.base/java.io=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.util.concurrent=ALL-UNNAMED --add-opens=java.base/java.nio=ALL-UNNAMED --add-opens=java.base/sun.nio.ch=ALL-UNNAMED --add-opens=java.base/java.net=ALL-UNNAMED --add-opens=java.base/java.text=ALL-UNNAMED --enable-native-access=ALL-UNNAMED -Dfile.encoding=UTF-8"

# Clean Gradle cache
Write-Host "Cleaning Gradle build..." -ForegroundColor Green
cd android
.\gradlew.bat clean
cd ..

# Remove build directories
Write-Host "Removing build directories..." -ForegroundColor Green
if (Test-Path "android\app\build") {
    Remove-Item -Recurse -Force "android\app\build"
    Write-Host "  ✓ Removed android\app\build" -ForegroundColor Gray
}

if (Test-Path "android\build") {
    Remove-Item -Recurse -Force "android\build"
    Write-Host "  ✓ Removed android\build" -ForegroundColor Gray
}

# Remove generated autolinking files (check before removing build directory)
if (Test-Path "android\app\build\generated\autolinking") {
    Remove-Item -Recurse -Force "android\app\build\generated\autolinking"
    Write-Host "  ✓ Removed autolinking files" -ForegroundColor Gray
}

# Clean Gradle cache
Write-Host "Cleaning Gradle cache..." -ForegroundColor Green
if (Test-Path "$env:USERPROFILE\.gradle\caches") {
    Write-Host "  ℹ️  Gradle cache location: $env:USERPROFILE\.gradle\caches" -ForegroundColor Gray
    Write-Host "  ⚠️  To fully clean Gradle cache, run: Remove-Item -Recurse -Force `"$env:USERPROFILE\.gradle\caches`"" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Clean completed! Now rebuilding..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Rebuild
npx react-native run-android

