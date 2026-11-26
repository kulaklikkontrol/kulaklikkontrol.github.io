# Ölçüm: marka sayfaları ve TestFlight tıklamaları

Son güncelleme: 26.11.2026 (T396). Amaç: hangi markanın ziyaret ve TestFlight katılımı getirdiğini ayırabilmek.

## Durum (dürüst sınır)

Site GitHub Pages'te, analitik yok. Yeni hesap açılmadığı için üçüncü taraf sayaç da yok. GitHub Pages sahibine trafik günlüğü vermez.
Bu yüzden sitede "tıklama sayısı" **toplanmıyor**. Ayırma işi üç katmanla yapılıyor:

1. Sayfadaki her TestFlight bağlantısı marka ve konum etiketi taşıyor (`data-kk-*`). İleride analitik eklenirse tek satırla sayılır.
2. Siteye giden her paylaşım bağlantısı markaya özel UTM taşıyor. Kaynak tarafında (Reddit insights, GitHub referrer) markaya göre okunur.
3. Katılımın kendisi markaya özel sinyallerle ölçülüyor (aşağıda).

## 1. Sayfa içi etiketler

Her `https://testflight.apple.com/join/e7S1TqA1` bağlantısı iki öznitelik taşır:

| Öznitelik | Değerler |
|---|---|
| `data-kk-brand` | `sony`, `bose`, `nothing-cmf`, `huawei-freebuds`, `technics`, `jbl`, `samsung-galaxy-buds`, `sennheiser`, `google-fast-pair`, `hub` (marka listesi), `verify` (doğrulama panosu), `universal` |
| `data-kk-cta` | `hero` (üst buton), `bf` (Black Friday şeridi), `join-box` (3 adım kutusu), `cta-bottom` (alt çağrı), `body` (metin içi), `verify` (pano satırı) |

Kontrol: `grep -oh 'data-kk-brand="[a-z-]*"' -r en tr | sort | uniq -c`

Analitik eklenirse (hesap gerektirmeyen bir yöntem bulunursa) tek dinleyici yeter:

```js
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-kk-brand]');
  if (a) track('tf_click', { brand: a.dataset.kkBrand, cta: a.dataset.kkCta, lang: document.documentElement.lang });
});
```

## 2. Gelen bağlantılar (UTM kuralı)

Biçim: `?utm_source=<kanal>&utm_medium=<post|comment|profile>&utm_campaign=brand-<slug>`.
`<kanal>` örnekleri: `reddit-r_bose`, `reddit-r_galaxybuds`, `hn`, `github`, `forum-<ad>`. Kanal başına tek, değişmeyen bir değer kullan.

| Marka | EN sayfa | TR sayfa | Sayfa etiketi |
|---|---|---|---|
| Sony | `/en/brands/sony/?utm_source=<kanal>&utm_campaign=brand-sony` | `/tr/markalar/sony/?utm_source=<kanal>&utm_campaign=brand-sony` | `data-kk-brand="sony"` |
| Bose | `/en/brands/bose/?utm_source=<kanal>&utm_campaign=brand-bose` | `/tr/markalar/bose/?utm_source=<kanal>&utm_campaign=brand-bose` | `data-kk-brand="bose"` |
| Nothing / CMF | `/en/brands/nothing-cmf/?utm_source=<kanal>&utm_campaign=brand-nothing-cmf` | `/tr/markalar/nothing-cmf/?utm_source=<kanal>&utm_campaign=brand-nothing-cmf` | `data-kk-brand="nothing-cmf"` |
| HUAWEI FreeBuds | `/en/brands/huawei-freebuds/?utm_source=<kanal>&utm_campaign=brand-huawei-freebuds` | `/tr/markalar/huawei-freebuds/?utm_source=<kanal>&utm_campaign=brand-huawei-freebuds` | `data-kk-brand="huawei-freebuds"` |
| Technics | `/en/brands/technics/?utm_source=<kanal>&utm_campaign=brand-technics` | `/tr/markalar/technics/?utm_source=<kanal>&utm_campaign=brand-technics` | `data-kk-brand="technics"` |
| JBL | `/en/brands/jbl/?utm_source=<kanal>&utm_campaign=brand-jbl` | `/tr/markalar/jbl/?utm_source=<kanal>&utm_campaign=brand-jbl` | `data-kk-brand="jbl"` |
| Samsung Galaxy Buds | `/en/brands/samsung-galaxy-buds/?utm_source=<kanal>&utm_campaign=brand-samsung-galaxy-buds` | `/tr/markalar/samsung-galaxy-buds/?utm_source=<kanal>&utm_campaign=brand-samsung-galaxy-buds` | `data-kk-brand="samsung-galaxy-buds"` |
| Sennheiser | `/en/brands/sennheiser/?utm_source=<kanal>&utm_campaign=brand-sennheiser` | `/tr/markalar/sennheiser/?utm_source=<kanal>&utm_campaign=brand-sennheiser` | `data-kk-brand="sennheiser"` |
| Google Fast Pair (Pixel Buds) | `/en/brands/google-fast-pair/?utm_source=<kanal>&utm_campaign=brand-google-fast-pair` | `/tr/markalar/google-fast-pair/?utm_source=<kanal>&utm_campaign=brand-google-fast-pair` | `data-kk-brand="google-fast-pair"` |

Görseller: OG `assets/seo/brand-<slug>-<en|tr>.png` (1200x630). Reddit kartı `reddit-launch/campaign-2026-11-16/brand-cards/<slug>[-tr]-1200x900.png`.

## 3. Markaya göre katılım sinyalleri

| Sinyal | Nereden | Marka ayrımı |
|---|---|---|
| Gönderi görüntülenme/paylaşım | Reddit gönderi insights (her topluluk = tek marka) | Gönderi başına, `brand-testers.md` takvim satırına yaz |
| Dışarı tıklama | Reddit insights "link clicks" (varsa) | UTM'li bağlantı, gönderi başına |
| Yeni tester | ASC → TestFlight → Testers (toplam, tarihli) | Gönderi saatine göre ±24 saat farkı; kesin değil, yön gösterir |
| Cihaz raporu | TestFlight geri bildirimi ve GitHub issue "marka/model" alanı | Kesin: rapordaki model |
| Doğrulama panosu sayacı | `/en/verify/`, `/tr/dogrulama/` | Model başına rapor sayısı. Etiketi değiştirmez, eşik yok |

Kaydetme: ölçüm günü `metrics.csv`'ye `tarih, marka, kanal, görüntülenme, tıklama, tester_toplam, rapor` satırı.

## 4. Daha kesin ayrım için seçenek (uygulanmadı)

ASC'de markaya özel ayrı TestFlight grupları ve her birine ayrı herkese açık bağlantı. Böylece tester sayısı ASC'de marka başına görünür.
Bedeli: her grup için derleme ataması ve bağlantı yönetimi; sitedeki tek bağlantı kuralı bozulur. Gerekirse ayrı görev olarak ele alınmalı.

## Yasaklar

Sahte tıklama/oy yok. Sayaç ve rapor sayısı "Deneysel" etiketinin yerine geçmez.
Yalnız WH-1000XM5 gerçek donanımda test edildi.
