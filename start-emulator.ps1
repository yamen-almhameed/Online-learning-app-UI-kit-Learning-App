# ============================================
# تشغيل Android Emulator
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 تشغيل Android Emulator" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# التحقق من ANDROID_HOME
if (-not $env:ANDROID_HOME) {
    Write-Host "❌ ANDROID_HOME غير محدد!" -ForegroundColor Red
    Write-Host "يرجى إعداد ANDROID_HOME في متغيرات البيئة" -ForegroundColor Yellow
    exit 1
}

$emulatorPath = Join-Path $env:ANDROID_HOME "emulator\emulator.exe"

if (-not (Test-Path $emulatorPath)) {
    Write-Host "❌ لم يتم العثور على emulator.exe في: $emulatorPath" -ForegroundColor Red
    exit 1
}

# عرض قائمة AVDs المتاحة
Write-Host "📱 قائمة AVDs المتاحة:" -ForegroundColor Cyan
$avds = & $emulatorPath -list-avds

if (-not $avds) {
    Write-Host "❌ لا يوجد AVDs متاحة!" -ForegroundColor Red
    Write-Host "يرجى إنشاء AVD من Android Studio" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
foreach ($avd in $avds) {
    Write-Host "  - $avd" -ForegroundColor Yellow
}
Write-Host ""

# استخدام أول AVD متاح
$avdName = $avds[0]
Write-Host "✅ سيتم تشغيل: $avdName" -ForegroundColor Green
Write-Host ""

# التحقق من الأجهزة المتصلة
Write-Host "🔍 التحقق من الأجهزة المتصلة..." -ForegroundColor Cyan
$devices = adb devices | Select-String "device$"
if ($devices) {
    Write-Host "⚠️  يوجد أجهزة متصلة بالفعل:" -ForegroundColor Yellow
    adb devices
    Write-Host ""
    Write-Host "💡 سيتم تشغيل Emulator بجانب الأجهزة المتصلة" -ForegroundColor Yellow
    Write-Host ""
}

# تشغيل Emulator
Write-Host "🚀 تشغيل Emulator..." -ForegroundColor Green
Write-Host ""

# تشغيل Emulator في الخلفية
Start-Process -FilePath $emulatorPath -ArgumentList "-avd", $avdName -WindowStyle Minimized

Write-Host "✅ تم بدء تشغيل Emulator في الخلفية" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ انتظر حتى يفتح Emulator (قد يستغرق 30-60 ثانية)..." -ForegroundColor Yellow
Write-Host ""

# انتظار حتى يتصل Emulator
$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $devices = adb devices | Select-String "emulator"
    if ($devices) {
        Write-Host "✅ Emulator متصل!" -ForegroundColor Green
        adb devices
        Write-Host ""
        Write-Host "🎉 يمكنك الآن تشغيل التطبيق بـ: npm run android" -ForegroundColor Green
        exit 0
    }
    $attempt++
    Write-Host "⏳ انتظار... ($attempt/$maxAttempts)" -ForegroundColor Yellow
}

Write-Host "⚠️  Emulator لم يتصل بعد. قد يكون لا يزال يعمل." -ForegroundColor Yellow
Write-Host "يمكنك التحقق بـ: adb devices" -ForegroundColor Yellow
