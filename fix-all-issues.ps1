# سكريبت شامل لحل جميع مشاكل React Native

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  حل مشاكل React Native CLI" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. إصلاح JAVA_HOME
Write-Host "[1/4] إصلاح JAVA_HOME..." -ForegroundColor Yellow
$currentJavaHome = [System.Environment]::GetEnvironmentVariable('JAVA_HOME', 'User')
if ($currentJavaHome -and $currentJavaHome.EndsWith('\bin')) {
    $fixedJavaHome = $currentJavaHome.TrimEnd('\bin')
    [System.Environment]::SetEnvironmentVariable('JAVA_HOME', $fixedJavaHome, 'User')
    $env:JAVA_HOME = $fixedJavaHome
    Write-Host "✓ تم إصلاح JAVA_HOME: $fixedJavaHome" -ForegroundColor Green
} else {
    Write-Host "✓ JAVA_HOME صحيح" -ForegroundColor Green
}

# 2. التحقق من JDK
Write-Host "`n[2/4] التحقق من JDK..." -ForegroundColor Yellow
try {
    $javaVersion = & java -version 2>&1 | Select-String "version"
    if ($javaVersion -match "25\.0\.1") {
        Write-Host "⚠ JDK 25.0.1 غير متوافق مع React Native" -ForegroundColor Red
        Write-Host "  المطلوب: JDK 17 أو 20" -ForegroundColor Yellow
        Write-Host "  الحل: شغّل .\install-jdk17.ps1 ثم .\update-java-home.ps1" -ForegroundColor Cyan
    } elseif ($javaVersion -match "(17|20)") {
        Write-Host "✓ JDK متوافق: $javaVersion" -ForegroundColor Green
    } else {
        Write-Host "⚠ JDK غير معروف: $javaVersion" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Java غير مثبت" -ForegroundColor Red
}

# 3. التحقق من Android SDK Platform
Write-Host "`n[3/4] التحقق من Android SDK Platform 36..." -ForegroundColor Yellow
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$platform36Path = "$sdkPath\platforms\android-36"
if (Test-Path $platform36Path) {
    Write-Host "✓ Android SDK Platform 36 مثبت" -ForegroundColor Green
} else {
    Write-Host "✗ Android SDK Platform 36 غير مثبت" -ForegroundColor Red
    Write-Host "  الحل:" -ForegroundColor Yellow
    Write-Host "  1. افتح Android Studio" -ForegroundColor White
    Write-Host "  2. File → Settings → Android SDK" -ForegroundColor White
    Write-Host "  3. ثبّت Android SDK Platform 36.0.0" -ForegroundColor White
    Write-Host "  أو شغّل: .\install-android-sdk.ps1" -ForegroundColor Cyan
}

# 4. التحقق من Adb
Write-Host "`n[4/4] التحقق من Adb..." -ForegroundColor Yellow
try {
    $adbDevices = & adb devices 2>&1
    $deviceCount = ($adbDevices | Select-String "device$" | Measure-Object).Count
    if ($deviceCount -gt 0) {
        Write-Host "✓ يوجد $deviceCount جهاز/محاكي متصل" -ForegroundColor Green
    } else {
        Write-Host "⚠ لا توجد أجهزة متصلة" -ForegroundColor Yellow
        Write-Host "  الحل: شغّل محاكي Android من Android Studio أو وصّل جهاز" -ForegroundColor Cyan
    }
} catch {
    Write-Host "✗ Adb غير متاح" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  انتهى التحقق" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "للتحقق من الإصلاحات، شغّل:" -ForegroundColor Yellow
Write-Host "  cmd /c `"npx react-native doctor`"" -ForegroundColor Cyan


