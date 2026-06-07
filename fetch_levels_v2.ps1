#requires -Version 5.1
Add-Type -AssemblyName System.Net.Http
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$ErrorActionPreference = 'Continue'

$ProjectRoot = "D:\Proyectos personales\Proyecto Backrooms Levels\Backrooms Levels"
$ImagesDir   = Join-Path $ProjectRoot "images\Niveles"
$OutputJson  = Join-Path $ProjectRoot "levels_data.json"
$LogFile     = Join-Path $ProjectRoot "fetch_log_v2.txt"

if (-not (Test-Path -LiteralPath $ImagesDir)) {
    New-Item -ItemType Directory -Path $ImagesDir -Force | Out-Null
}

# --- HTTP client ---
$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AutomaticDecompression = [System.Net.DecompressionMethods]::GZip -bor [System.Net.DecompressionMethods]::Deflate
$handler.AllowAutoRedirect = $true
$client = New-Object System.Net.Http.HttpClient($handler)
$client.DefaultRequestHeaders.Add("User-Agent", "BackroomsProject/2.0 (research)")
$client.Timeout = [TimeSpan]::FromSeconds(60)

# --- Levels: include forced pageid where known ---
$Levels = @(
    [pscustomobject]@{ Id=0;   Name="Nivel 0";                Slug="0";                 WikiPath="Nivel_0";                ForcePageId=$null }
    [pscustomobject]@{ Id=1;   Name="Nivel 1";                Slug="1";                 WikiPath="Nivel_1";                ForcePageId=$null }
    [pscustomobject]@{ Id=2;   Name="Nivel 2";                Slug="2";                 WikiPath="Nivel_2";                ForcePageId=$null }
    [pscustomobject]@{ Id=3;   Name="Nivel 3";                Slug="3";                 WikiPath="Nivel_3";                ForcePageId=$null }
    [pscustomobject]@{ Id=4;   Name="Nivel 4";                Slug="4";                 WikiPath="Nivel_4";                ForcePageId=$null }
    [pscustomobject]@{ Id=5;   Name="Nivel 5";                Slug="5";                 WikiPath="Nivel_5";                ForcePageId=$null }
    [pscustomobject]@{ Id=6;   Name="Nivel 6";                Slug="6";                 WikiPath="Nivel_6";                ForcePageId=$null }
    [pscustomobject]@{ Id=7;   Name="Nivel 7";                Slug="7";                 WikiPath="Nivel_7";                ForcePageId=$null }
    [pscustomobject]@{ Id=8;   Name="Nivel 8";                Slug="8";                 WikiPath="Nivel_8";                ForcePageId=$null }
    [pscustomobject]@{ Id=90;  Name="Nivel -0";               Slug="neg0";              WikiPath="Nivel_-0";               ForcePageId=$null }
    [pscustomobject]@{ Id=91;  Name="Nivel -1";               Slug="neg1";              WikiPath="Nivel_-1";               ForcePageId=$null }
    [pscustomobject]@{ Id=92;  Name="Nivel -2";               Slug="neg2";              WikiPath="Nivel_-2";               ForcePageId=$null }
    [pscustomobject]@{ Id=93;  Name="Nivel -3";               Slug="neg3";              WikiPath="Nivel_-3";               ForcePageId=$null }
    [pscustomobject]@{ Id=100; Name="The End";                Slug="the_end";           WikiPath="The_End";                ForcePageId=$null }
    [pscustomobject]@{ Id=101; Name="L4 S0MBR4 GR1S";         Slug="l4_s0mbr4_gr1s";    WikiPath="L4_S0MBR4_GR1S";         ForcePageId=$null }
    [pscustomobject]@{ Id=102; Name="¡Corre por tu vida!";    Slug="corre_por_tu_vida"; WikiPath="%C2%A1Corre_por_tu_vida!"; ForcePageId=411 }
    [pscustomobject]@{ Id=103; Name="La Tierra Prometida";    Slug="la_tierra_prometida"; WikiPath="La_Tierra_Prometida";    ForcePageId=$null }
    [pscustomobject]@{ Id=104; Name="The Hub";                Slug="the_hub";           WikiPath="The_Hub";                ForcePageId=$null }
    [pscustomobject]@{ Id=11;  Name="Nivel 11";               Slug="11";                WikiPath="Nivel_11";               ForcePageId=$null }
    [pscustomobject]@{ Id=37;  Name="Nivel 37";               Slug="37";                WikiPath="Nivel_37";               ForcePageId=$null }
    [pscustomobject]@{ Id=39;  Name="Nivel 39";               Slug="39";                WikiPath="Nivel_39";               ForcePageId=$null }
    [pscustomobject]@{ Id=920; Name="Nivel 92";               Slug="92";                WikiPath="Nivel_92";               ForcePageId=28941 }
    [pscustomobject]@{ Id=118; Name="Nivel 118";              Slug="118";               WikiPath="Nivel_118";              ForcePageId=$null }
    [pscustomobject]@{ Id=125; Name="Nivel 125";              Slug="125";               WikiPath="Nivel_125";              ForcePageId=$null }
    [pscustomobject]@{ Id=188; Name="Nivel 188";              Slug="188";               WikiPath="Nivel_188";              ForcePageId=$null }
    [pscustomobject]@{ Id=201; Name="Nivel 201";              Slug="201";               WikiPath="Nivel_201";              ForcePageId=$null }
    [pscustomobject]@{ Id=220; Name="Nivel 220";              Slug="220";               WikiPath="Nivel_220";              ForcePageId=$null }
    [pscustomobject]@{ Id=308; Name="Nivel 308";              Slug="308";               WikiPath="Nivel_308";              ForcePageId=$null }
    [pscustomobject]@{ Id=444; Name="Nivel 444";              Slug="444";               WikiPath="Nivel_444";              ForcePageId=$null }
    [pscustomobject]@{ Id=499; Name="Nivel 499";              Slug="499";               WikiPath="Nivel_499";              ForcePageId=$null }
)

function Get-String {
    param([string]$Url)
    try {
        $r = $client.GetAsync($Url).Result
        if ($r.IsSuccessStatusCode) { return $r.Content.ReadAsStringAsync().Result }
        return $null
    } catch { return $null }
}

function Get-PageIdByTitle {
    param([string]$Title)
    $enc = [System.Uri]::EscapeDataString($Title)
    $url = "https://backrooms.fandom.com/es/api.php?action=query&titles=$enc&format=json&prop=info"
    $json = Get-String -Url $url
    if (-not $json) { return $null }
    try {
        $obj = $json | ConvertFrom-Json
        foreach ($p in $obj.query.pages.PSObject.Properties) {
            $pg = $p.Value
            if ($pg.title -eq $Title -and -not $pg.missing) { return [int]$pg.pageid }
        }
    } catch {}
    return $null
}

function Get-PageIdBySearch {
    param([string]$Title)
    $enc = [System.Uri]::EscapeDataString($Title)
    $url = "https://backrooms.fandom.com/es/api.php?action=query&list=search&srsearch=$enc&format=json&srlimit=10"
    $json = Get-String -Url $url
    if (-not $json) { return $null }
    try {
        $obj = $json | ConvertFrom-Json
        foreach ($hit in $obj.query.search) {
            if ($hit.title -eq $Title) { return [int]$hit.pageid }
        }
        if ($obj.query.search.Count -gt 0) { return [int]$obj.query.search[0].pageid }
    } catch {}
    return $null
}

function Get-PageData {
    param([int]$PageId)
    $url = "https://backrooms.fandom.com/es/api.php?action=query&format=json&prop=pageimages|revisions&pageids=$PageId&piprop=original&rvprop=content&formatversion=2"
    $json = Get-String -Url $url
    if (-not $json) { return $null }
    try { return ($json | ConvertFrom-Json).query.pages[0] } catch { return $null }
}

# Remove HTML tags (including style spans)
function Remove-HtmlTags {
    param([string]$S)
    $s = [regex]::Replace($S, '<[^>]+?>', '')
    return $s.Trim()
}

# Decode common HTML entities
function Decode-Entities {
    param([string]$S)
    $s = $S
    $s = [regex]::Replace($s, '&#(\d+);', { param($m) [char][int]$m.Groups[1].Value })
    $pairs = @(
        @('&iexcl;',[string][char]161), @('&iquest;',[string][char]191),
        @('&aacute;',[string][char]225), @('&eacute;',[string][char]233), @('&iacute;',[string][char]237), @('&oacute;',[string][char]243), @('&uacute;',[string][char]250),
        @('&Aacute;',[string][char]193), @('&Eacute;',[string][char]201), @('&Iacute;',[string][char]205), @('&Oacute;',[string][char]211), @('&Uacute;',[string][char]218),
        @('&ntilde;',[string][char]241), @('&Ntilde;',[string][char]209), @('&uuml;',[string][char]252), @('&Uuml;',[string][char]220),
        @('&nbsp;',' '), @('&amp;','[AMP]'), @('&lt;','<'), @('&gt;','>'), @('&quot;','"'),
        @('&#39;',"'"), @('&apos;',"'")
    )
    foreach ($p in $pairs) { $s = $s.Replace($p[0], $p[1]) }
    $s = $s.Replace('[AMP]', '&')
    return $s
}

# Convert wikitext to plain text - more thorough
function Convert-WikiToText {
    param([string]$Wiki)
    $text = $Wiki
    # Normalize escaped newlines to real newlines
    $text = $text.Replace("\r\n", "`n").Replace("\r", "`n").Replace("\n", "`n")
    # Strip <nowik>...</nowik> and <pre>...</pre> blocks first
    $text = [regex]::Replace($text, '<nowik>[\s\S]*?</nowik>', ' ', 'Singleline')
    $text = [regex]::Replace($text, '<pre>[\s\S]*?</pre>', ' ', 'Singleline')
    # Strip templates with balanced braces
    $text = Strip-Templates -Text $text
    # Tables
    $text = [regex]::Replace($text, '\{\|[\s\S]*?\|\}', ' ', 'Singleline')
    # File/Image links: [[File:X|param1|param2]] -> drop entirely
    $text = [regex]::Replace($text, '\[\[(File|Image|Archivo|Imagen):[^\]]+\]\]', ' ', 'Singleline')
    # Wiki links with display: [[Page|Display]]
    $text = [regex]::Replace($text, '\[\[[^\]|#]+\|([^\]]+)\]\]', '$1')
    # Wiki links: [[Page]] or [[Page#section]]
    $text = [regex]::Replace($text, '\[\[([^\]|#]+)(?:#[^\]|]+)?\]\]', '$1')
    # External links
    $text = [regex]::Replace($text, '\[https?://[^\s\]]+ ([^\]]+)\]', '$1')
    $text = [regex]::Replace($text, '\[https?://[^\s\]]+\]', '')
    # Refs
    $text = [regex]::Replace($text, '<ref[^>]*?>[\s\S]*?</ref>', ' ', 'Singleline')
    $text = [regex]::Replace($text, '<ref[^>]*?/>', ' ', 'Singleline')
    # HTML tags
    $text = [regex]::Replace($text, '<[^>]+?>', ' ', 'Singleline')
    # Bold/italic
    $text = $text -replace "'''", ''
    $text = $text -replace "''", ''
    # Headings - remove the == markers but keep the title
    $text = [regex]::Replace($text, '^=+\s*([^=]+?)\s*=+\s*$', "`n$1`n", 'Multiline')
    # Entities
    $text = Decode-Entities -S $text
    # Collapse whitespace
    $text = [regex]::Replace($text, '[ \t]+', ' ')
    $text = [regex]::Replace($text, '\s*\n\s*', "`n")
    return $text.Trim()
}

# Strip all {{...}} templates by tracking brace balance
function Strip-Templates {
    param([string]$Text)
    $sb = New-Object System.Text.StringBuilder
    $i = 0
    $len = $Text.Length
    while ($i -lt $len) {
        if ($i -lt $len - 1 -and $Text[$i] -eq '{' -and $Text[$i+1] -eq '{') {
            # Found start of template
            $depth = 1
            $j = $i + 2
            while ($j -lt $len -and $depth -gt 0) {
                if ($j -lt $len - 1 -and $Text[$j] -eq '{' -and $Text[$j+1] -eq '{') {
                    $depth++
                    $j += 2
                } elseif ($j -lt $len - 1 -and $Text[$j] -eq '}' -and $Text[$j+1] -eq '}') {
                    $depth--
                    $j += 2
                } else {
                    $j++
                }
            }
            # Skip the template (replace with space)
            [void]$sb.Append(' ')
            $i = $j
        } else {
            [void]$sb.Append($Text[$i])
            $i++
        }
    }
    return $sb.ToString()
}

# Extract clean title (from DISPLAYTITLE)
function Get-DisplayTitle {
    param([string]$Wiki)
    $m = [regex]::Match($Wiki, '\{\{DISPLAYTITLE:([^}]+)\}\}')
    if (-not $m.Success) { return $null }
    $raw = $m.Groups[1].Value.Trim()
    $clean = Remove-HtmlTags -S $raw
    $clean = Decode-Entities -S $clean
    # Strip bold/italic markers
    $clean = $clean -replace "'''", ''
    $clean = $clean -replace "''", ''
    return $clean.Trim()
}

# Get class - look at category, templates (ClaseNivelX, Clase X, Clase X Mental)
function Get-Class {
    param([string]$Wiki)
    # í = U+00ED
    $c = '[Cc]ategor[\u00EDi]a'
    $m = [regex]::Match($Wiki, '\[\[' + $c + ':Clase\s+(\d+)(?:\s*Mental)?\]\]')
    if ($m.Success) { return [int]$m.Groups[1].Value }
    $m = [regex]::Match($Wiki, '\[\[' + $c + ':Clase\s+de\s+\w+\s*-\s*Clase\s+(\d+)\]\]')
    if ($m.Success) { return [int]$m.Groups[1].Value }
    $m = [regex]::Match($Wiki, '\{\{ClaseNivel(\d+)')
    if ($m.Success) { return [int]$m.Groups[1].Value }
    $m = [regex]::Match($Wiki, '\{\{Clase\s+(\d+)(\s*Mental)?')
    if ($m.Success) { return [int]$m.Groups[1].Value }
    return $null
}

function Get-Difficulty {
    param([string]$Wiki)
    $c = '[Cc]ategor[\u00EDi]a'
    $m = [regex]::Match($Wiki, '\[\[' + $c + ':Dificultad de supervivencia\s+(\d+)\]\]')
    if ($m.Success) { return [int]$m.Groups[1].Value }
    return $null
}

# Get alias from a known position
function Get-Alias {
    param([string]$Wiki, [string]$DisplayTitle)
    # 1) Try to extract from DISPLAYTITLE: usually "Nivel X, "Alias""
    if ($DisplayTitle) {
        $m = [regex]::Match($DisplayTitle, '[,\s]+["\u201c]([^"\u201d]{2,80})["\u201d]')
        if ($m.Success) { return $m.Groups[1].Value.Trim() }
    }
    # 2) Look in the first paragraph for "también conocido como" / "mejor conocido como" / "conocido como"
    $text = Convert-WikiToText -Wiki $Wiki
    $m = [regex]::Match($text, '(?:tambi[\u00E9e]n conocido(?:a)? como|mejor conocido(?:a)? como|conocido(?:a)? como)\s*[:\s]*["\u201c]?([^"\u201d\.\,\;\(\)]{2,80})["\u201d\.\)]?', 'IgnoreCase')
    if ($m.Success) {
        $alias = $m.Groups[1].Value.Trim()
        if ($alias -notmatch '\b(es el|se caracteriza|es un|son los|es una|se encuentra)\b' -and $alias.Length -lt 60) {
            return $alias
        }
    }
    # 3) Look for "vulgarmente también como 'X'"
    $m = [regex]::Match($text, 'vulgarmente\s+(?:tambi[\u00E9e]n\s+)?como\s+["\u201c]([^"\u201d]{2,60})["\u201d]')
    if ($m.Success) { return $m.Groups[1].Value.Trim() }
    return $null
}

# Get clean description - first 400 chars of meaningful text
function Get-Description {
    param([string]$Wiki, [int]$MaxLen = 400)
    $text = Convert-WikiToText -Wiki $Wiki
    # Skip magic words / CSS / categories that come at top
    $lines = $text -split "`n"
    $buf = @()
    $started = $false
    foreach ($line in $lines) {
        $trim = $line.Trim()
        if (-not $started) {
            # Skip noise: CSS, magic words, empty, single chars
            if ($trim -eq "") { continue }
            if ($trim -match '^(__NOTOC__|__NOEDITSECTION__|__FORCETOC__|\*\/|\/\*|\.|@import|\{|\})') { continue }
            if ($trim -match '^(theme-|--theme-|\.\w+\s*\{|font-family|background-color|color:|--\w)') { continue }
            # Skip lines that look like image/file parameter fragments
            if ($trim -match '^\d+px(\s*\|[^|]*){1,5}') { continue }
            if ($trim -match '^(link=|class=|width=|height=)') { continue }
            if ($trim -match '^[a-z]+=[\w/:#.\-]+(\s+[a-z]+=[\w/:#.\-]+)*$') { continue }
            if ($trim.Length -lt 15) { continue }
            $started = $true
        }
        # Stop at next section marker (the == are gone, so we check section name text)
        if ($started -and $trim -match '^(Descripci[\u00F3o]n|Salidas?|Entradas|Entidades|Informaci[\u00F3o]n Adicional|Mapa|Notas?|Galer[\u00EDi]a|Cr[\u00E9e]ditos|Referencias|Historia|Trivial|Objetos|Anexo|Teor[\u00EDi]as?|Anomal[\u00EDi]as|Colapsar)') { break }
        if ($started -and $trim -match '^==?$') { break }
        if ($started -and $trim -eq "") {
            if ($buf.Count -gt 0) { break }
            else { continue }
        }
        # Skip lines that are only image parameter noise (e.g. "2000px")
        if ($trim -match '^\d+px$') { continue }
        if ($trim -match '^[a-z]{2,10}=') { continue }
        if ($started) { $buf += $trim }
    }
    $plain = ($buf -join ' ').Trim()
    if ($plain.Length -gt $MaxLen) {
        $plain = $plain.Substring(0, $MaxLen).TrimEnd() + "..."
    }
    return $plain
}

# Check if a wiki link target should be excluded (categories, interlang, files, etc.)
function Test-IsMetaLink {
    param([string]$Value)
    $v = $Value.Trim()
    # Use Unicode escapes for special chars (í = \u00ED)
    $cat = 'Categor[\u00EDi]a'
    if ($v -match '^(' + $cat + '|Category|Usuario|User|File|Archivo|Image|Imagen|Plantilla|Template|Help|Ayuda|Special|Especial)\s*:') { return $true }
    # Interlanguage prefixes (with or without leading colon)
    if ($v -match '^:?(en|es|fr|it|de|pt|pt-br|ja|zh|zh-cn|zh-tw|ko|ru|pl|nl|sv|fi|cs|hu|tr|th|ar|uk|el|he|id|ms|vi|ro|bg|hr|sr|sk|sl|et|lv|lt|da|no|fa|hi|bn|ta|te|kn|ml|gu|pa|ur|sw|af|sq|az|be|bs|ca|cy|ga|gl|is|ka|kk|km|ky|lo|mk|mn|ne|ps|si|tg|tk|uz|yi|jv)\s*:') { return $true }
    return $false
}

# Get entities mentioned in "==Entidades==" section
function Get-Entities {
    param([string]$Wiki)
    # Find Entidades section
    $m = [regex]::Match($Wiki, '==\s*Entidades?\s*==([\s\S]*?)(?=^==[^=]|\Z)', 'Multiline')
    if (-not $m.Success) { return @() }
    $section = $m.Groups[1].Value
    $text = Convert-WikiToText -Wiki $section
    $results = @()
    # If "desprovisto" / "no hay" / "ninguna" / "sin entidades" etc
    if ($text -match '(?i)(desprovisto|sin entidades|inexistente|no hay|no contiene|sin presencia|no se ha(?:n)?\s+(?:encontrado|reportado|visto|a[\u00F3o]lado)|niveles?(?:\s+y\s+\w+){0,3}\s+carec[ae]?\s+de\s+entidades|deshabitado|despoblado)') {
        return @("(ninguna)")
    }
    # Look for wiki links to entity pages in the section
    $named = [regex]::Matches($section, '\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]', 'Multiline')
    foreach ($nm in $named) {
        $val = $nm.Groups[1].Value.Trim()
        if (Test-IsMetaLink -Value $val) { continue }
        if ($val -match '^(Nivel|Frontrooms|Backrooms|Realidad|Vagabundos|Geometr[\u00EDi]a|Fen[\u00F3o]menos|Entidad|Los\s|Las\s|La\s|El\s)') {
            $results += $val
        }
    }
    return ($results | Select-Object -Unique)
}

# Get exits/entries
function Get-Exits {
    param([string]$Wiki)
    $m = [regex]::Match($Wiki, '==\s*Entradas\s+y\s+Salidas?\s*==([\s\S]*?)(?=^==[^=]|\Z)', 'Multiline')
    if (-not $m.Success) {
        $m = [regex]::Match($Wiki, '==\s*Salidas?\s*==([\s\S]*?)(?=^==[^=]|\Z)', 'Multiline')
    }
    if (-not $m.Success) { return @() }
    $section = $m.Groups[1].Value
    $named = [regex]::Matches($section, '\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]', 'Multiline')
    $results = @()
    foreach ($nm in $named) {
        $val = $nm.Groups[1].Value.Trim()
        if (Test-IsMetaLink -Value $val) { continue }
        $results += $val
    }
    return ($results | Select-Object -Unique)
}

# --- Main ---
$results = @()
$errors  = @()
$downloaded = 0
$skipped_existing = 0
$log = New-Object System.Text.StringBuilder
[void]$log.AppendLine("=== v2 fetch started: $(Get-Date -Format 'o') ===")

foreach ($lvl in $Levels) {
    Write-Host ""
    Write-Host "[$($lvl.Id)] $($lvl.Name)" -ForegroundColor Cyan
    [void]$log.AppendLine("--- $($lvl.Name) ---")

    $entry = [ordered]@{
        id = $lvl.Id
        slug = "level_$($lvl.Slug)"
        title = $lvl.Name
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

    # Find pageid
    $pageId = $null
    if ($lvl.ForcePageId) {
        $pageId = [int]$lvl.ForcePageId
    } else {
        $pageId = Get-PageIdByTitle -Title $lvl.Name
        if (-not $pageId) {
            # Only fall back to search if title is unambiguous (no "Nivel X" pattern where X exists with different sign)
            # Be conservative: only use search for non-numeric titles
            if ($lvl.Name -notmatch '^Nivel\s+[-\d]') {
                $pageId = Get-PageIdBySearch -Title $lvl.Name
            }
        }
    }
    if (-not $pageId) {
        $entry["error"] = "not_found"
        $errors += $lvl.Name
        Write-Host "  NOT FOUND" -ForegroundColor Red
        $results += [pscustomobject]$entry
        continue
    }
    Write-Host "  pageid=$pageId"

    # Get full data
    $pageData = Get-PageData -PageId $pageId
    if (-not $pageData -or $pageData.missing) {
        $entry["error"] = "not_found"
        $errors += $lvl.Name
        Write-Host "  PAGE MISSING" -ForegroundColor Red
        $results += [pscustomobject]$entry
        continue
    }

    # Image
    $imgUrl = $null
    if ($pageData.original -and $pageData.original.source) {
        $imgUrl = $pageData.original.source
    }
    [void]$log.AppendLine("  image: $imgUrl")

    # Wikitext
    $wiki = $null
    if ($pageData.revisions -and $pageData.revisions.Count -gt 0) {
        $wiki = $pageData.revisions[0].content
    }
    if ($wiki) {
        $dt = Get-DisplayTitle -Wiki $wiki
        if ($dt) { $entry["title"] = $dt }
        $entry["alias"] = Get-Alias -Wiki $wiki -DisplayTitle $entry["title"]
        $entry["class"] = Get-Class -Wiki $wiki
        $entry["difficulty"] = Get-Difficulty -Wiki $wiki
        $entry["description"] = Get-Description -Wiki $wiki -MaxLen 400
        $ent = Get-Entities -Wiki $wiki
        if ($ent.Count -gt 0) { $entry["entities"] = @($ent) }
        $ex = Get-Exits -Wiki $wiki
        if ($ex.Count -gt 0) { $entry["exits"] = @($ex) }
    }

    # Download image
    $imgPath = Join-Path $ImagesDir $entry["image"]
    $skip = $false
    if (Test-Path -LiteralPath $imgPath) {
        $size = (Get-Item -LiteralPath $imgPath).Length
        if ($size -gt 1024) {
            $entry["image_downloaded"] = $true
            $downloaded++
            $skipped_existing++
            $skip = $true
            Write-Host "  image exists ($size bytes)" -ForegroundColor DarkGray
        } else {
            Remove-Item -LiteralPath $imgPath -Force
        }
    }
    if (-not $skip -and $imgUrl) {
        try {
            $r = $client.GetAsync($imgUrl).Result
            if ($r.IsSuccessStatusCode) {
                $bytes = $r.Content.ReadAsByteArrayAsync().Result
                if ($bytes.Length -gt 1024) {
                    [System.IO.File]::WriteAllBytes($imgPath, $bytes)
                    $entry["image_downloaded"] = $true
                    $downloaded++
                    Write-Host "  downloaded $($bytes.Length) bytes" -ForegroundColor Green
                } else {
                    Write-Host "  too small: $($bytes.Length) bytes" -ForegroundColor Yellow
                }
            } else {
                Write-Host "  http $($r.StatusCode)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  error: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    if (-not $entry["image_downloaded"] -and -not $imgUrl) {
        Write-Host "  no image URL" -ForegroundColor Yellow
    }

    $results += [pscustomobject]$entry
    Start-Sleep -Milliseconds 300
}

$summary = [ordered]@{
    total = $results.Count
    images_downloaded = $downloaded
    images_already_existing = $skipped_existing
    errors = $errors
}
$output = [ordered]@{
    levels = $results
    summary = $summary
}
$json = $output | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($OutputJson, $json, [System.Text.UTF8Encoding]::new($false))
[void]$log.AppendLine("=== Done: total=$($results.Count) dl=$downloaded err=$($errors.Count) ===")
[System.IO.File]::WriteAllText($LogFile, $log.ToString(), [System.Text.UTF8Encoding]::new($false))

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "Total: $($results.Count) | Downloaded: $downloaded | Errors: $($errors.Count)"
Write-Host "Output: $OutputJson"
