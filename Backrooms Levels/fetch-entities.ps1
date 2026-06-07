# fetch-entities.ps1 - Descarga imagenes de entidades desde la Wiki Hispana de los Backrooms
# Usa la API MediaWiki para obtener imagenes de paginas de entidades.
# Las imagenes se guardan como JPG en images/Entidades/

$ErrorActionPreference = "Continue"
$OutDir = Join-Path $PSScriptRoot "images\Entidades"
if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

$ApiBase = "https://backrooms.fandom.com/es/api.php"

function Build-Url {
    param([string]$Base, [hashtable]$Params)
    $parts = @()
    foreach ($key in $Params.Keys) {
        $parts += "$key=$([System.Net.WebUtility]::UrlEncode($Params[$key]))"
    }
    $query = $parts -join ([char]38)
    return ($Base + "?" + $query)
}

$entities = @(
    @{ slug = "Entidad_2";        name = "Ventanas";              file = "entidad_2_ventanas.jpg" },
    @{ slug = "Entidad_3";        name = "Smilers";               file = "entidad_3_smilers.jpg" },
    @{ slug = "Entidad_4";        name = "Polilla_de_la_Muerte";  file = "entidad_4_polilla_de_la_muerte.jpg" },
    @{ slug = "Entidad_5";        name = "Clumps";                file = "entidad_5_clumps.jpg" },
    @{ slug = "Entidad_6";        name = "Dullers";               file = "entidad_6_dullers.jpg" },
    @{ slug = "Entidad_8";        name = "Sabuesos";              file = "entidad_8_sabuesos.jpg" },
    @{ slug = "Entidad_9";        name = "Facelings";             file = "entidad_9_facelings.jpg" },
    @{ slug = "Entidad_10";       name = "Ladrones_de_Piel";      file = "entidad_10_ladrones_de_piel.jpg" },
    @{ slug = "Entidad_12";       name = "Howlers";               file = "entidad_12_howlers.jpg" },
    @{ slug = "Entidad_15";       name = "Insanos";               file = "entidad_15_insanos.jpg" },
    @{ slug = "Entidad_17";       name = "Crawlers";              file = "entidad_17_crawlers.jpg" },
    @{ slug = "Entidad_36";       name = "Lighters";              file = "entidad_36_lighters.jpg" },
    @{ slug = "Entidad_50";       name = "Las_Sombras";           file = "entidad_50_las_sombras.jpg" },
    @{ slug = "Entidad_65";       name = "Maniquies";             file = "entidad_65_maniquies.jpg" },
    @{ slug = "Entidad_66";       name = "Fantasmas";             file = "entidad_66_fantasmas.jpg" },
    @{ slug = "Entidad_67";       name = "Partygoers";            file = "entidad_67_partygoers.jpg" },
    @{ slug = "Entidad_68";       name = "Partypoopers";          file = "entidad_68_partypoopers.jpg" },
    @{ slug = "Entidad_94";       name = "Clickers";              file = "entidad_94_clickers.jpg" },
    @{ slug = "Entidad_111";      name = "Aetinerrabu";           file = "entidad_111_aetinerrabu.jpg" },
    @{ slug = "Entidad_3-A";      name = "Frowners";              file = "entidad_3a_frowners.jpg" }
)

foreach ($ent in $entities) {
    $targetPath = Join-Path $OutDir $ent.file
    if (Test-Path $targetPath) {
        Write-Host "[SKIP] $($ent.name) - imagen ya existe"
        continue
    }

    Write-Host "[INFO] Buscando imagen para $($ent.name) ($($ent.slug))..."

    $thumbUrl = $null

    # Paso 1: Obtener la imagen principal de la pagina
    try {
        $url = Build-Url -Base $ApiBase -Params @{ action="query"; titles=$ent.slug; prop="pageimages"; pithumbsize="800"; format="json"; redirects="1" }
        Write-Host "  -> URL: $url"
        $resp = Invoke-RestMethod -Uri $url -UseBasicParsing
        $pages = $resp.query.pages
        $pageId = $pages.PSObject.Properties.Name | Select-Object -First 1
        if ($pageId -and $pages.$pageId.thumbnail) {
            $thumbUrl = $pages.$pageId.thumbnail.source
        }
    } catch {
        Write-Host "  -> ERROR en paso 1: $($_.Exception.Message)"
    }

    if ($thumbUrl) {
        Write-Host "  -> Thumb URL: $thumbUrl"
        try {
            Invoke-WebRequest -Uri $thumbUrl -OutFile $targetPath -UseBasicParsing
            Write-Host "  -> Guardado: $targetPath"
        } catch {
            Write-Host "  -> ERROR descargando: $($_.Exception.Message)"
        }
    } else {
        # Paso 2: Intentar con imagenes de la pagina
        Write-Host "  -> Sin imagen principal, buscando imagenes en la pagina..."
        try {
            $url2 = Build-Url -Base $ApiBase -Params @{ action="query"; titles=$ent.slug; prop="images"; imlimit="5"; format="json"; redirects="1" }
            Write-Host "  -> URL2: $url2"
            $resp2 = Invoke-RestMethod -Uri $url2 -UseBasicParsing
            $pages2 = $resp2.query.pages
            $pageId2 = $pages2.PSObject.Properties.Name | Select-Object -First 1
            $images = @()
            if ($pageId2 -and $pages2.$pageId2.images) {
                $images = $pages2.$pageId2.images
            }

            $imgTitle = $null
            foreach ($img in $images) {
                $t = $img.title
                if ($t -match "\.(jpg|jpeg|png|gif)" -and $t -notmatch "Icon|Logo|Symbol|Button|Banner|Screenshot|Wiki|Spanish") {
                    $imgTitle = $t
                    break
                }
            }

            if ($imgTitle) {
                Write-Host "  -> Imagen encontrada en pagina: $imgTitle"
                $url3 = Build-Url -Base $ApiBase -Params @{ action="query"; titles=$imgTitle; prop="imageinfo"; iiprop="url"; iiurlwidth="800"; format="json" }
                Write-Host "  -> URL3: $url3"
                $resp3 = Invoke-RestMethod -Uri $url3 -UseBasicParsing
                $pages3 = $resp3.query.pages
                $pageId3 = $pages3.PSObject.Properties.Name | Select-Object -First 1
                if ($pageId3 -and $pages3.$pageId3.imageinfo) {
                    $thumbUrl = $pages3.$pageId3.imageinfo[0].thumburl
                    Write-Host "  -> Thumb URL: $thumbUrl"
                    Invoke-WebRequest -Uri $thumbUrl -OutFile $targetPath -UseBasicParsing
                    Write-Host "  -> Guardado: $targetPath"
                } else {
                    Write-Host "  -> WARN: No se pudo obtener URL de imagen"
                }
            } else {
                Write-Host "  -> WARN: No se encontro imagen para $($ent.name)"
            }
        } catch {
            Write-Host "  -> ERROR en paso 2: $($_.Exception.Message)"
        }
    }

    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "[DONE] Proceso completado."
Write-Host "Imagenes en $OutDir :"
Get-ChildItem -Path $OutDir -Filter "*.jpg" | ForEach-Object { Write-Host "  - $($_.Name)" }
