# سكريبت لتحديث JAVA_HOME إلى JDK 17

Write-Host "جارٍ البحث عن JDK 17..." -ForegroundColor Cyan

$jdk17Paths = @(
    "C:\Program Files\Eclipse Adoptium\jdk-17*",
    "C:\Program Files\Java\jdk-17*",
    "C:\Program Files\Microsoft\jdk-17*"
)

$jdk17Path = $null
foreach ($pattern in $jdk17Paths) {
    $found = Get-ChildItem -Path (Split-Path $pattern) -Filter (Split-Path -Leaf $pattern) -ErrorAction SilentlyContinue | 
             Where-Object { $_.PSIsContainer } | 
             Sort-Object Name -Descending | 
             Select-Object -First 1
    
    if ($found) {
        $jdk17Path = $found.FullName
        Write-Host "✓ تم العثور على JDK 17: $jdk17Path" -ForegroundColor Green
        break
    }
}

if (-not $jdk17Path) {
    Write-Host "✗ لم يتم العثور على JDK 17" -ForegroundColor Red
    Write-Host "يرجى تثبيت JDK 17 أولاً من: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Yellow
    exit 1
}

# تحديث JAVA_HOME
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $jdk17Path, 'User')
$env:JAVA_HOME = $jdk17Path

Write-Host "✓ تم تحديث JAVA_HOME إلى: $jdk17Path" -ForegroundColor Green
Write-Host "`nيرجى إعادة تشغيل Terminal لتطبيق التغييرات" -ForegroundColor Yellow

# التحقق
Write-Host "`nالتحقق من Java:" -ForegroundColor Cyan
& "$jdk17Path\bin\java.exe" -version

