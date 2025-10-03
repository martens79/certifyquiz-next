param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Urls)

function Get-Field($html, $regex) {
  $m = [regex]::Matches($html, $regex, 'IgnoreCase')
  if ($m.Count -gt 0) { return $m[0].Groups[1].Value } else { return $null }
}

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
[System.Net.ServicePointManager]::CheckCertificateRevocationList = $false

if (-not $Urls -or $Urls.Count -eq 0) {
  Write-Host "Uso: .\seo-check.ps1 <url1> <url2> ..." -ForegroundColor Yellow
  exit 1
}

foreach ($u in $Urls) {
  try {
    $resp = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 20 -ErrorAction Stop
    $html = $resp.Content
  } catch {
    Write-Host "`n=== $u ===" -ForegroundColor Cyan
    Write-Host "Errore: $($_.Exception.Message)" -ForegroundColor Red
    continue
  }

  $canonical = Get-Field $html 'rel="canonical"[^>]*href="([^"]+)"'
  $ogurl    = Get-Field $html 'property="og:url"[^>]*content="([^"]+)"'
  $hre      = [regex]::Matches($html, 'rel="alternate"[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"', 'IgnoreCase')

  Write-Host "`n=== $u ===" -ForegroundColor Cyan
  if ($canonical) { Write-Host "canonical: $canonical" -ForegroundColor Green } else { Write-Host "canonical MANCANTE" -ForegroundColor Red }
  if ($ogurl)     { Write-Host "og:url:   $ogurl" -ForegroundColor Yellow } else { Write-Host "og:url MANCANTE" -ForegroundColor Red }

  $needed = @("it-IT","en-US","fr-FR","es-ES","x-default")
  $map = @{}
  foreach ($m in $hre) { $map[$m.Groups[1].Value] = $m.Groups[2].Value }

  $missing = $needed | Where-Object { -not $map.ContainsKey($_) }
  if ($missing.Count -gt 0) {
    Write-Host "hreflang mancanti: $($missing -join ', ')" -ForegroundColor Red
  } else {
    Write-Host "tutti gli hreflang presenti" -ForegroundColor Green
  }

  foreach ($k in $map.Keys) {
    Write-Host ("hreflang {0}: {1}" -f $k, $map[$k])
  }

  $pass = $true
  if (-not $canonical) { $pass = $false }
  if ($ogurl -and $canonical -and ($ogurl -ne $canonical)) {
    Write-Host "ATTENZIONE: og:url diverso da canonical" -ForegroundColor Yellow
    $pass = $false
  }
  if ($pass) { Write-Host "✅ PASS" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
}
