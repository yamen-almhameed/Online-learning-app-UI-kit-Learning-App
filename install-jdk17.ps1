# سكريبت لتثبيت JDK 17

Write-Host "جارٍ تنزيل JDK 17..." -ForegroundColor Cyan

$jdk17Url = "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse"
$downloadPath = "$env:TEMP\jdk17.msi"

Write-Host "الرابط المباشر للتحميل:" -ForegroundColor Yellow
Write-Host "https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Cyan
Write-Host "`nيرجى:" -ForegroundColor Yellow
Write-Host "1. افتح الرابط أعلاه في المتصفح" -ForegroundColor White
Write-Host "2. حمّل JDK 17 LTS (Windows x64 .msi)" -ForegroundColor White
Write-Host "3. ثبّت JDK 17" -ForegroundColor White
Write-Host "4. بعد التثبيت، شغّل: .\update-java-home.ps1" -ForegroundColor White

# محاولة التحميل التلقائي
try {
    Write-Host "`nمحاولة التحميل التلقائي..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $jdk17Url -OutFile $downloadPath -UseBasicParsing
    Write-Host "✓ تم التحميل بنجاح!" -ForegroundColor Green
    Write-Host "شغّل الملف: $downloadPath" -ForegroundColor Yellow
} catch {
    Write-Host "✗ فشل التحميل التلقائي. يرجى التحميل يدوياً من الرابط أعلاه" -ForegroundColor Red
}

