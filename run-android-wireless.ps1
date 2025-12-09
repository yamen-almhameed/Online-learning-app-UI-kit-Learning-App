# Script to run Android build on wireless device
# This script sets JAVA_TOOL_OPTIONS and connects to wireless device

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android Build - Wireless Device" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set JAVA_TOOL_OPTIONS environment variable (REQUIRED for Java 17+)
$env:JAVA_TOOL_OPTIONS = "--add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED --add-opens=java.base/java.io=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.util.concurrent=ALL-UNNAMED --add-opens=java.base/java.nio=ALL-UNNAMED --add-opens=java.base/sun.nio.ch=ALL-UNNAMED --add-opens=java.base/java.net=ALL-UNNAMED --add-opens=java.base/java.text=ALL-UNNAMED --enable-native-access=ALL-UNNAMED -Dfile.encoding=UTF-8"

Write-Host "JAVA_TOOL_OPTIONS configured" -ForegroundColor Green
Write-Host ""

# Check for connected devices
Write-Host "Checking connected devices..." -ForegroundColor Cyan
$deviceOutput = adb devices
$allDevices = $deviceOutput | Select-String -Pattern "^\S+\s+(device|offline|unauthorized)" | Where-Object { $_.Line -notmatch "List of devices" }
$onlineDevices = $deviceOutput | Select-String "device$"

Write-Host ""
if ($allDevices.Count -gt 0) {
    Write-Host "Found $($allDevices.Count) device(s):" -ForegroundColor Cyan
    foreach ($device in $allDevices) {
        $status = if ($device.Line -match "device$") { "ONLINE" } elseif ($device.Line -match "offline") { "OFFLINE" } else { "UNAUTHORIZED" }
        $color = if ($status -eq "ONLINE") { "Green" } else { "Yellow" }
        Write-Host "  - $($device.Line.Trim()) [$status]" -ForegroundColor $color
    }
    Write-Host ""
    
    if ($onlineDevices.Count -eq 0) {
        Write-Host "WARNING: No online devices found!" -ForegroundColor Yellow
        Write-Host ""
        
        # Check if there's a wireless device that needs reconnection
        $wirelessDevice = $allDevices | Where-Object { $_.Line -match "\d+\.\d+\.\d+\.\d+:" }
        if ($wirelessDevice) {
            Write-Host "Found wireless device, attempting to reconnect..." -ForegroundColor Cyan
            $deviceId = ($wirelessDevice.Line -split '\s+')[0]
            adb disconnect $deviceId 2>$null
            Start-Sleep -Seconds 1
            adb connect $deviceId
            Start-Sleep -Seconds 2
            
            # Check again
            $deviceOutput = adb devices
            $onlineDevices = $deviceOutput | Select-String "device$"
            if ($onlineDevices.Count -gt 0) {
                Write-Host "Successfully reconnected to device!" -ForegroundColor Green
                Write-Host ""
            } else {
                Write-Host "Failed to reconnect. Please check your device connection." -ForegroundColor Red
                Write-Host ""
            }
        }
        
        # Ask if user wants to connect wirelessly
        if ($onlineDevices.Count -eq 0) {
            Write-Host "To connect wirelessly:" -ForegroundColor Cyan
            Write-Host "  1. Connect device via USB first" -ForegroundColor White
            Write-Host "  2. Run: adb tcpip 5555" -ForegroundColor White
            Write-Host "  3. Find device IP: adb shell ip addr show wlan0" -ForegroundColor White
            Write-Host "  4. Connect: adb connect [DEVICE_IP]:5555" -ForegroundColor White
            Write-Host ""
            $wirelessIP = Read-Host "Enter wireless device IP (or press Enter to skip)"
            if ($wirelessIP -and $wirelessIP -match "^\d+\.\d+\.\d+\.\d+$") {
                Write-Host "Connecting to $wirelessIP:5555..." -ForegroundColor Cyan
                adb connect "$wirelessIP:5555"
                Start-Sleep -Seconds 2
                $deviceOutput = adb devices
                $onlineDevices = $deviceOutput | Select-String "device$"
                if ($onlineDevices.Count -gt 0) {
                    Write-Host "Successfully connected!" -ForegroundColor Green
                    Write-Host ""
                } else {
                    Write-Host "Failed to connect. Please check the IP and try again." -ForegroundColor Red
                    Write-Host ""
                }
            }
        }
        
        if ($onlineDevices.Count -eq 0) {
            $continue = Read-Host "Continue anyway? (y/n)"
            if ($continue -ne "y") {
                exit
            }
        }
    } else {
        Write-Host "Found $($onlineDevices.Count) online device(s) - Ready to build!" -ForegroundColor Green
        Write-Host ""
    }
} else {
    Write-Host "WARNING: No devices found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To connect wirelessly:" -ForegroundColor Cyan
    Write-Host "  1. Connect device via USB first" -ForegroundColor White
    Write-Host "  2. Run: adb tcpip 5555" -ForegroundColor White
    Write-Host "  3. Find device IP: adb shell ip addr show wlan0" -ForegroundColor White
    Write-Host "  4. Connect: adb connect [DEVICE_IP]:5555" -ForegroundColor White
    Write-Host ""
    $wirelessIP = Read-Host "Enter wireless device IP (or press Enter to continue anyway)"
    if ($wirelessIP -and $wirelessIP -match "^\d+\.\d+\.\d+\.\d+$") {
        Write-Host "Connecting to $wirelessIP:5555..." -ForegroundColor Cyan
        adb connect "$wirelessIP:5555"
        Start-Sleep -Seconds 2
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Android build..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run the build
npx react-native run-android
