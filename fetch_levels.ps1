#requires -Version 5.1
Add-Type -AssemblyName System.Net.Http
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'Continue'

# --- Config ---
$ProjectRoot = "D:\Proyectos personales\Proyecto Backrooms Levels\Backrooms Levels"
$ImagesDir   = Join-Path $ProjectRoot "images\Niveles"
$OutputJson  = Join-Path $ProjectRoot "levels_data.json"
$LogFile     = Join-Path $ProjectRoot "fetch_log.txt"

# Make sure images dir exists
if (-not (Test-Path -LiteralPath $ImagesDir)) {
    New-Item -ItemType Directory -Path $ImagesDir -Force | Out-Null
}

# --- HTTP client with auto decompression ---
$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AutomaticDecompression = [System.Net.DecompressionMethods]::GZip -bor [System.Net.DecompressionMethods]::Deflate
$handler.AllowAutoRedirect = $true
$client = New-Object System.Net.Http.HttpClient($handler)
$client.DefaultRequestHeaders.Add("User-Agent", "BackroomsProject/1.0 (research; contact: anon@example.com)")
$client.DefaultRequestHeaders.Add("Accept", "application/json,text/html")
$client.DefaultRequestHeaders.Add("Api-User-Agent", "BackroomsProject/1.0")
$client.Timeout = [TimeSpan]::FromSeconds(60)

# --- Level definitions (id, name, slug, wikiUrlPart) ---
$Levels = @(
    [pscustomobject]@{ Id = 0;  Name = "Nivel 0";             Slug = "0";                   WikiPath = "Nivel_0" }
    [pscustomobject]@{ Id = 1;  Name = "Nivel 1";             Slug = "1";                   WikiPath = "Nivel_1" }
    [pscustomobject]@{ Id = 2;  Name = "Nivel 2";             Slug = "2";                   WikiPath = "Nivel_2" }
    [pscustomobject]@{ Id = 3;  Name = "Nivel 3";             Slug = "3";                   WikiPath = "Nivel_3" }
    [pscustomobject]@{ Id = 4;  Name = "Nivel 4";             Slug = "4";                   WikiPath = "Nivel_4" }
    [pscustomobject]@{ Id = 5;  Name = "Nivel 5";             Slug = "5";                   WikiPath = "Nivel_5" }
    [pscustomobject]@{ Id = 6;  Name = "Nivel 6";             Slug = "6";                   WikiPath = "Nivel_6" }
    [pscustomobject]@{ Id = 7;  Name = "Nivel 7";             Slug = "7";                   WikiPath = "Nivel_7" }
    [pscustomobject]@{ Id = 8;  Name = "Nivel 8";             Slug = "8";                   WikiPath = "Nivel_8" }
    [pscustomobject]@{ Id = 90; Name = "Nivel -0";            Slug = "neg0";                WikiPath = "Nivel_-0" }
    [pscustomobject]@{ Id = 91; Name = "Nivel -1";            Slug = "neg1";                WikiPath = "Nivel_-1" }
    [pscustomobject]@{ Id = 92; Name = "Nivel -2";            Slug = "neg2";                WikiPath = "Nivel_-2" }
    [pscustomobject]@{ Id = 93; Name = "Nivel -3";            Slug = "neg3";                WikiPath = "Nivel_-3" }
    [pscustomobject]@{ Id = 100; Name = "The End";            Slug = "the_end";             WikiPath = "The_End" }
    [pscustomobject]@{ Id = 101; Name = "L4 S0MBR4 GR1S";     Slug = "l4_s0mbr4_gr1s";      WikiPath = "L4_S0MBR4_GR1S" }
    [pscustomobject]@{ Id = 102; Name = "¡Corre por tu vida!"; Slug = "corre_por_tu_vida";   WikiPath = "%C2%A1Corre_por_tu_vida!" }
    [pscustomobject]@{ Id = 103; Name = "La Tierra Prometida"; Slug = "la_tierra_prometida"; WikiPath = "La_Tierra_Prometida" }
    [pscustomobject]@{ Id = 104; Name = "The Hub";            Slug = "the_hub";             WikiPath = "The_Hub" }
    [pscustomobject]@{ Id = 11; Name = "Nivel 11";             Slug = "11";                  WikiPath = "Nivel_11" }
    [pscustomobject]@{ Id = 37; Name = "Nivel 37";             Slug = "37";                  WikiPath = "Nivel_37" }
    [pscustomobject]@{ Id = 39; Name = "Nivel 39";             Slug = "39";                  WikiPath = "Nivel_39" }
    [pscustomobject]@{ Id = 92; Name = "Nivel 92";             Slug = "92";                  WikiPath = "Nivel_92" }
    [pscustomobject]@{ Id = 118; Name = "Nivel 118";           Slug = "118";                 WikiPath = "Nivel_118" }
    [pscustomobject]@{ Id = 125; Name = "Nivel 125";           Slug = "125";                 WikiPath = "Nivel_125" }
    [pscustomobject]@{ Id = 188; Name = "Nivel 188";           Slug = "188";                 WikiPath = "Nivel_188" }
    [pscustomobject]@{ Id = 201; Name = "Nivel 201";           Slug = "201";                 WikiPath = "Nivel_201" }
    [pscustomobject]@{ Id = 220; Name = "Nivel 220";           Slug = "220";                 WikiPath = "Nivel_220" }
    [pscustomobject]@{ Id = 308; Name = "Nivel 308";           Slug = "308";                 WikiPath = "Nivel_308" }
    [pscustomobject]@{ Id = 444; Name = "Nivel 444";           Slug = "444";                 WikiPath = "Nivel_444" }
    [pscustomobject]@{ Id = 499; Name = "Nivel 499";           Slug = "499";                 WikiPath = "Nivel_499" }
)

# --- Helper: HTTP GET returning string ---
function Get-String {
    param([string]$Url)
    try {
        $r = $client.GetAsync($Url).Result
        if ($r.IsSuccessStatusCode) {
            return $r.Content.ReadAsStringAsync().Result
        } else {
            Write-Warning "GET $Url -> $($r.StatusCode)"
            return $null
        }
    } catch {
        Write-Warning "GET $Url failed: $($_.Exception.Message)"
        return $null
    }
}

# --- Helper: Get the page id for a given page title via opensearch (or search) ---
function Get-PageId {
    param([string]$Title)
    $enc = [System.Uri]::EscapeDataString($Title)
    $url = "https://backrooms.fandom.com/es/api.php?action=query&list=search&srsearch=$enc&format=json&srlimit=5"
    $json = Get-String -Url $url
    if (-not $json) { return $null }
    try {
        $obj = $json | ConvertFrom-Json
    } catch { return $null }
    foreach ($hit in $obj.query.search) {
        if ($hit.title -eq $Title) {
            return [int]$hit.pageid
        }
    }
    # Fallback: just take the top result
    if ($obj.query.search.Count -gt 0) {
        $top = $obj.query.search[0]
        Write-Host "  (Title mismatch: searched '$Title' got '$($top.title)')" -ForegroundColor Yellow
        return [int]$top.pageid
    }
    return $null
}

# --- Helper: Get full page data (image + wikitext) ---
function Get-PageData {
    param([int]$PageId)
    $url = "https://backrooms.fandom.com/es/api.php?action=query&format=json&prop=pageimages|revisions&pageids=$PageId&piprop=original&rvprop=content&formatversion=2"
    $json = Get-String -Url $url
    if (-not $json) { return $null }
    try {
        $obj = $json | ConvertFrom-Json
        return $obj.query.pages[0]
    } catch {
        Write-Warning "Failed parsing pageid $PageId`: $($_.Exception.Message)"
        return $null
    }
}

# --- Helper: Clean wiki markup to plain text (basic) ---
function Convert-WikiToText {
    param([string]$Wiki)
    $text = $Wiki
    # Templates like {{DISPLAYTITLE:...}} -> drop
    $text = [regex]::Replace($text, '\{\{[^{}]*?\}\}', ' ', 'Singleline')
    # Keep iterating to remove nested templates
    $prev = ""
    while ($prev -ne $text) {
        $prev = $text
        $text = [regex]::Replace($text, '\{\{[^{}]*?\}\}', ' ', 'Singleline')
    }
    # Wiki links [[Page|Display]] -> Display
    $text = [regex]::Replace($text, '\[\[[^\]|]+\|([^\]]+)\]\]', '$1')
    # Wiki links [[Page]] -> Page
    $text = [regex]::Replace($text, '\[\[([^\]]+)\]\]', '$1')
    # External links [http... label]
    $text = [regex]::Replace($text, '\[https?://[^\s\]]+ ([^\]]+)\]', '$1')
    $text = [regex]::Replace($text, '\[https?://[^\s\]]+\]', '')
    # Bold/italic ''' ''' '' -> ''
    $text = $text -replace "'''", ''
    $text = $text -replace "''", ''
    # Headings == ... == -> ... \n
    $text = [regex]::Replace($text, '^=+\s*([^=]+?)\s*=+\s*$', '$1', 'Multiline')
    # Tables {| ... |}
    $text = [regex]::Replace($text, '\{\|[\s\S]*?\|\}', ' ', 'Singleline')
    # Refs <ref>...</ref>
    $text = [regex]::Replace($text, '<ref[^>]*?>[\s\S]*?</ref>', ' ', 'Singleline')
    $text = [regex]::Replace($text, '<ref[^>]*?/>', ' ', 'Singleline')
    # HTML tags
    $text = [regex]::Replace($text, '<[^>]+?>', ' ', 'Singleline')
    # Decode HTML entities
    $text = $text.Replace('&nbsp;', ' ').Replace('&amp;', '&').Replace('&lt;', '<').Replace('&gt;', '>').Replace('&quot;', '"').Replace('&#39;', "'").Replace('&iexcl;', '¡').Replace('&aacute;', 'á').Replace('&eacute;', 'é').Replace('&iacute;', 'í').Replace('&oacute;', 'ó').Replace('&uacute;', 'ú').Replace('&ntilde;', 'ñ')
    $text = [regex]::Replace($text, '&#(\d+);', { param($m) [char][int]$m.Groups[1].Value })
    # Collapse whitespace
    $text = [regex]::Replace($text, '\s+', ' ')
    return $text.Trim()
}

# --- Helper: Extract DISPLAYTITLE ---
function Get-DisplayTitle {
    param([string]$Wiki)
    $m = [regex]::Match($Wiki, '\{\{DISPLAYTITLE:([^}]+)\}\}')
    if ($m.Success) {
        return $m.Groups[1].Value.Trim()
    }
    return $null
}

# --- Helper: Extract alias from "también conocido como 'X'" ---
function Get-Alias {
    param([string]$WikiText)
    $m = [regex]::Match($WikiText, '(?:tambi[eé]n conocido(?:a)? como|conocido(?:a)? como|alias(?: "([^"]+)")?)\s*[: ]*[\["'']?([^"''\]\.\,]{2,80})[\]"\''.]?', 'IgnoreCase')
    if ($m.Success) {
        $a = $m.Groups[2].Value
        if ($a -notmatch '^el\b' -or $m.Groups[1].Value) { return $a.Trim() }
    }
    # Fallback: also try quoted forms: "El Lobby"
    $m2 = [regex]::Match($WikiText, '"([^"]{2,80})"')
    if ($m2.Success) {
        return $m2.Groups[1].Value.Trim()
    }
    return $null
}

# --- Helper: Extract class from categories ---
function Get-Class {
    param([string]$Wiki)
    $m = [regex]::Match($Wiki, '\[\[[Cc]ategor[íi]a:Clase\s+(\d+)\]\]')
    if ($m.Success) { return [int]$m.Groups[1].Value }
    # Try ClaseNivel template
    $m2 = [regex]::Match($Wiki, '\{\{ClaseNivel(\d+)\}\}')
    if ($m2.Success) { return [int]$m2.Groups[1].Value }
    return $null
}

# --- Helper: Extract difficulty (Dificultad de supervivencia) ---
function Get-Difficulty {
    param([string]$Wiki)
    $m = [regex]::Match($Wiki, '\[\[[Cc]ategor[íi]a:Dificultad de supervivencia\s+(\d+)\]\]')
    if ($m.Success) { return [int]$m.Groups[1].Value }
    return $null
}

# --- Helper: Extract first 400 chars of description ---
function Get-Description {
    param([string]$Wiki, [int]$MaxLen = 400)
    # Find the first real description paragraph (skip templates and DISPLAYTITLE)
    $lines = $Wiki -split "(`r`n|`n)"
    $started = $false
    $buf = New-Object System.Text.StringBuilder
    foreach ($line in $lines) {
        $trim = $line.Trim()
        if (-not $started) {
            if ($trim -match "^\{\{" -or $trim -match "^\[\[" -or $trim -match "^==" -or $trim -match "^$" -or $trim -match "^----") {
                continue
            }
            # Skip Div lines
            if ($trim -match '^<div') { continue }
            $started = $true
        }
        # Stop at next section
        if ($started -and $trim -match "^==") { break }
        if ($started -and $trim -match "^$") {
            if ($buf.Length -gt 0) { break }
        }
        if ($started) {
            [void]$buf.AppendLine($line)
        }
    }
    $plain = Convert-WikiToText -Wiki $buf.ToString()
    if ($plain.Length -gt $MaxLen) {
        $plain = $plain.Substring(0, $MaxLen).TrimEnd() + "..."
    }
    return $plain
}

# --- Helper: Get list of entity mentions from "==Entidades==" section ---
function Get-Entities {
    param([string]$Wiki)
    $m = [regex]::Match($Wiki, '==\s*Entidades?\s*==([\s\S]*?)(?:^==|\Z)', 'Multiline')
    if (-not $m.Success) { return @() }
    $section = $m.Groups[1].Value
    $text = Convert-WikiToText -Wiki $section
    # Look for named entities (capitalized phrases that are wiki links)
    $named = [regex]::Matches($Wiki, '\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]', 'Multiline')
    $results = @()
    foreach ($nm in $named) {
        $val = $nm.Groups[1].Value
        if ($val -match '^(Categoría|Category|Usuario|User|File|Archivo|Image):') { continue }
        if ($val -match '^[A-Z]') {
            $results += $val
        }
    }
    # If "desprovisto de vida" / "ninguna" / "no hay entidades" then empty
    if ($text -match '(?i)(desprovisto|sin entidades|ninguna|no hay|deshabitado|sin presencia|inexistentes|no contiene entidades|no se han)') {
        return @("(ninguna)")
    }
    return ($results | Select-Object -Unique)
}

# --- Helper: Get exits/entries from "Entradas y Salidas" or similar ---
function Get-Exits {
    param([string]$Wiki)
    $m = [regex]::Match($Wiki, '==\s*Entradas\s+y\s+Salidas?\s*==([\s\S]*?)(?:^==\s*(?!=[^=])|\Z)', 'Multiline')
    if (-not $m.Success) {
        # Try Salidas
        $m = [regex]::Match($Wiki, '==\s*Salidas?\s*==([\s\S]*?)(?:^==\s*(?!=[^=])|\Z)', 'Multiline')
    }
    if (-not $m.Success) { return @() }
    $section = $m.Groups[1].Value
    # Look for [[Nivel X]] / [[Some other level]] links
    $named = [regex]::Matches($section, '\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]', 'Multiline')
    $results = @()
    foreach ($nm in $named) {
        $val = $nm.Groups[1].Value
        if ($val -match '^(Categoría|Category|Usuario|User|File|Archivo|Image):') { continue }
        $results += $val
    }
    return ($results | Select-Object -Unique)
}

# --- Main processing ---
$results = @()
$errors  = @()
$downloaded = 0
$log = New-Object System.Text.StringBuilder

[void]$log.AppendLine("=== Backrooms fetch started: $(Get-Date -Format 'o') ===")

foreach ($lvl in $Levels) {
    Write-Host ""
    Write-Host "Processing: $($lvl.Name) (slug: $($lvl.Slug))" -ForegroundColor Cyan
    [void]$log.AppendLine("--- $($lvl.Name) ---")

    $entry = [ordered]@{
        id = $lvl.Id
        slug = "level_$($lvl.Slug)"
        title = $null
        alias = $null
        class = $null
        difficulty = $null
        image = "level_$($lvl.Slug).jpg"
        wiki_url = "https://backrooms.fandom.com/es/wiki/$($lvl.WikiPath)"
        description = $null
        entities = @()
        exits = @()
        image_downloaded = $false
    }

    # 1. Get page id
    $pageId = Get-PageId -Title $lvl.Name
    if (-not $pageId) {
        $entry["error"] = "not_found"
        $errors += $lvl.Name
        $results += [pscustomobject]$entry
        continue
    }
    Write-Host "  pageid=$pageId"

    # 2. Get full page data
    $pageData = Get-PageData -PageId $pageId
    if (-not $pageData) {
        $entry["error"] = "fetch_failed"
        $errors += $lvl.Name
        $results += [pscustomobject]$entry
        continue
    }
    if ($pageData.missing) {
        $entry["error"] = "not_found"
        $errors += $lvl.Name
        $results += [pscustomobject]$entry
        continue
    }

    # 3. Image
    $imgUrl = $null
    if ($pageData.original -and $pageData.original.source) {
        $imgUrl = $pageData.original.source
    }
    [void]$log.AppendLine("  image: $imgUrl")

    # 4. Wikitext
    $wiki = $null
    if ($pageData.revisions -and $pageData.revisions.Count -gt 0) {
        $wiki = $pageData.revisions[0].content
    }
    if ($wiki) {
        # Title
        $dt = Get-DisplayTitle -Wiki $wiki
        if ($dt) { $entry["title"] = $dt } else { $entry["title"] = $lvl.Name }
        # Alias
        $a = Get-Alias -WikiText (Convert-WikiToText -Wiki $wiki)
        $entry["alias"] = $a
        # Class & difficulty
        $entry["class"] = Get-Class -Wiki $wiki
        $entry["difficulty"] = Get-Difficulty -Wiki $wiki
        # Description
        $entry["description"] = Get-Description -Wiki $wiki -MaxLen 400
        # Entities
        $ent = Get-Entities -Wiki $wiki
        if ($ent.Count -gt 0) { $entry["entities"] = @($ent) }
        # Exits
        $ex = Get-Exits -Wiki $wiki
        if ($ex.Count -gt 0) { $entry["exits"] = @($ex) }
    } else {
        $entry["title"] = $lvl.Name
    }

    # 5. Download image
    $imgPath = Join-Path $ImagesDir $entry["image"]
    $skipDownload = $false
    if (Test-Path -LiteralPath $imgPath) {
        $size = (Get-Item -LiteralPath $imgPath).Length
        if ($size -gt 1024) {
            $skipDownload = $true
            $entry["image_downloaded"] = $true
            $downloaded++
            Write-Host "  image already exists ($size bytes)" -ForegroundColor DarkGray
        }
    }
    if (-not $skipDownload -and $imgUrl) {
        try {
            $imgResponse = $client.GetAsync($imgUrl).Result
            if ($imgResponse.IsSuccessStatusCode) {
                $bytes = $imgResponse.Content.ReadAsByteArrayAsync().Result
                if ($bytes.Length -gt 1024) {
                    [System.IO.File]::WriteAllBytes($imgPath, $bytes)
                    $entry["image_downloaded"] = $true
                    $downloaded++
                    Write-Host "  image downloaded: $($bytes.Length) bytes" -ForegroundColor Green
                } else {
                    Write-Host "  image too small ($($bytes.Length) bytes), skipping" -ForegroundColor Yellow
                }
            } else {
                Write-Host "  image fetch failed: $($imgResponse.StatusCode)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  image download error: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    if (-not $entry["image_downloaded"]) {
        if (-not $imgUrl) { Write-Host "  no image URL" -ForegroundColor Yellow }
    }

    $results += [pscustomobject]$entry
    Start-Sleep -Milliseconds 400
}

# --- Build summary & output JSON ---
$summary = [ordered]@{
    total = $results.Count
    images_downloaded = $downloaded
    errors = $errors
}

$output = [ordered]@{
    levels = $results
    summary = $summary
}

$json = $output | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($OutputJson, $json, [System.Text.UTF8Encoding]::new($false))

[void]$log.AppendLine("=== Summary: total=$($results.Count) downloaded=$downloaded errors=$($errors.Count) ===")
[System.IO.File]::WriteAllText($LogFile, $log.ToString(), [System.Text.UTF8Encoding]::new($false))

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "Total: $($results.Count)"
Write-Host "Downloaded: $downloaded"
Write-Host "Errors: $($errors.Count) ($($errors -join ', '))"
Write-Host "Output: $OutputJson"
