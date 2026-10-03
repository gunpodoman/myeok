param([string]$OutputPath = 'release/myeok-browser-tts-recording.zip')
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$zipPath = [IO.Path]::GetFullPath((Join-Path $projectRoot $OutputPath))
if (-not $zipPath.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar)) { throw 'Output must be inside project' }
[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($zipPath)) | Out-Null
Add-Type -AssemblyName System.IO.Compression
$stream = [IO.File]::Open($zipPath, [IO.FileMode]::Create)
$zip = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
try {
  $files = @(Get-ChildItem -LiteralPath $projectRoot -File -Force)
  foreach ($folder in @('assets','core_md','docs','public','src','tests','scripts')) {
    $files += Get-ChildItem -LiteralPath (Join-Path $projectRoot $folder) -File -Recurse -Force
  }
  $files += Get-Item -LiteralPath (Join-Path $projectRoot '.agent/STATE.md')
  foreach ($file in $files) {
    $relative = $file.FullName.Substring($projectRoot.Length + 1).Replace('\','/')
    if ($relative -match '(^|/)(__pycache__|\.pytest_cache|\.git)(/|$)' -or $file.Extension -in @('.pyc','.wav','.webm','.whl','.log')) { continue }
    $entry = $zip.CreateEntry('myeok/' + $relative, [IO.Compression.CompressionLevel]::Optimal)
    $entry.LastWriteTime = $file.LastWriteTime
    $inputStream = $file.OpenRead()
    $entryStream = $entry.Open()
    try { $inputStream.CopyTo($entryStream) } finally { $inputStream.Dispose(); $entryStream.Dispose() }
  }
} finally { $zip.Dispose(); $stream.Dispose() }
Get-FileHash -LiteralPath $zipPath -Algorithm SHA256
