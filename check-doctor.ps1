# سكريبت للتحقق من react-native doctor

Write-Host "جارٍ تشغيل react-native doctor..." -ForegroundColor Cyan
Write-Host ""

# تشغيل الأمر
$process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npx react-native doctor" -NoNewWindow -Wait -PassThru -RedirectStandardOutput "stdout.txt" -RedirectStandardError "stderr.txt"

# قراءة النتائج
if (Test-Path "stdout.txt") {
    Write-Host "=== النتائج ===" -ForegroundColor Green
    Get-Content "stdout.txt"
    Remove-Item "stdout.txt" -ErrorAction SilentlyContinue
}

if (Test-Path "stderr.txt") {
    $errorContent = Get-Content "stderr.txt"
    if ($errorContent) {
        Write-Host "=== الأخطاء ===" -ForegroundColor Red
        $errorContent
    }
    Remove-Item "stderr.txt" -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "انتهى التحقق" -ForegroundColor Cyan


