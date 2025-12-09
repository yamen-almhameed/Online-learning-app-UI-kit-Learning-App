# Script to run Android build with JAVA_TOOL_OPTIONS set
# This fixes the "restricted method in java.lang.System" error with Java 17+
# The --enable-native-access flag is required for native library loading

# Set JAVA_TOOL_OPTIONS environment variable
$env:JAVA_TOOL_OPTIONS = "--add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED --add-opens=java.base/java.io=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.util.concurrent=ALL-UNNAMED --add-opens=java.base/java.nio=ALL-UNNAMED --add-opens=java.base/sun.nio.ch=ALL-UNNAMED --add-opens=java.base/java.net=ALL-UNNAMED --add-opens=java.base/java.text=ALL-UNNAMED --enable-native-access=ALL-UNNAMED -Dfile.encoding=UTF-8"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "JAVA_TOOL_OPTIONS set successfully!" -ForegroundColor Green
Write-Host "Value: $env:JAVA_TOOL_OPTIONS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Running Android build..." -ForegroundColor Green
Write-Host ""

# Check if device is connected
Write-Host "Checking for connected devices..." -ForegroundColor Cyan
$devices = adb devices | Select-String "device$" | Measure-Object
if ($devices.Count -eq 0) {
    Write-Host "⚠️  No devices found! Please connect a device or start an emulator." -ForegroundColor Yellow
    Write-Host ""
}

# Run the build
npx react-native run-android

