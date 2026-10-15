# PowerShell script to run tests and log output
$ErrorActionPreference = "Continue"

$rootDir = Split-Path -Parent $PSScriptRoot
$apiDir = Join-Path $rootDir "apps\api"
$testsDir = $PSScriptRoot
$historyDir = Join-Path $testsDir "history"

if (!(Test-Path $historyDir)) {
    New-Item -ItemType Directory -Path $historyDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$latestLog = Join-Path $testsDir "latest-test-run.log"
$historyLog = Join-Path $historyDir "test-run-$timestamp.log"

Write-Host "`n🚀 [TEST RUNNER] Đang chạy tests cho apps/api..." -ForegroundColor Cyan
Write-Host "📁 Thư mục API: $apiDir" -ForegroundColor Gray
Write-Host "📝 Log sẽ được ghi vào: tests\latest-test-run.log`n" -ForegroundColor Gray

Push-Location $apiDir
$output = go test -v ./... 2>&1
$exitCode = $LASTEXITCODE
Pop-Location

$header = @"
================================================================================
CHI-NEX TEST RUN REPORT
Thời gian: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Trạng thái: $(if ($exitCode -eq 0) { "PASSED" } else { "FAILED (Exit code: $exitCode)" })
================================================================================

"@

$fullContent = $header + ($output -join "`r`n")
$fullContent | Set-Content -Path $latestLog -Encoding UTF8
$fullContent | Set-Content -Path $historyLog -Encoding UTF8

$output | ForEach-Object { Write-Host $_ }

Write-Host "`n================================================================================" -ForegroundColor Green
Write-Host "🎉 [TEST RUNNER] Kết quả đã được lưu vào:" -ForegroundColor Green
Write-Host "   - tests\latest-test-run.log" -ForegroundColor Green
Write-Host "   - tests\history\test-run-$timestamp.log" -ForegroundColor Green
Write-Host "================================================================================`n" -ForegroundColor Green

exit $exitCode
