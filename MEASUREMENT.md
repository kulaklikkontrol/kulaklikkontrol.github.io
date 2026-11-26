# Ölçüm: marka sayfaları ve TestFlight tıklamaları

Son güncelleme: 26.11.2026 (T396). Amaç, hangi markanın siteden TestFlight katılımı getirdiğini ayırmak.

## Özet: ne sayılıyor, ne sayılamıyor

| Olay | Durum | Kaynak |
|---|---|---|
| Siteden TestFlight'a tıklama, marka başına | **Sayılıyor** (26.11.2026 14:25 TRT'den beri) | ASC grup "public link" metriği `viewCount` |
| TestFlight katılımı, marka başına | **Sayılıyor** | Aynı metrikteki `acceptedCount` ve grubun tester listesi |
| Marka sayfası ziyareti | **Sayılamıyor** (teknik engel, aşağıda) | — |

## 1. Siteden TestFlight'a tıklama ve katılım (uygulandı)

Her marka sayfasının (TR ve EN) bütün TestFlight düğmeleri artık o markaya ait ayrı bir ASC herkese açık grubuna gider. Hub sayfaları ve doğrulama panosu da kendi gruplarına gider.
Bu bağlantılar başka hiçbir yerde kullanılmaz. Bu yüzden grubun bağlantı metriği, o sayfadan TestFlight'a yapılan tıklamayı ve katılımı verir.
Ana sayfalar, rehberler ve blog ana bağlantıyı (`e7S1TqA1`, grup Public Beta) kullanmaya devam eder. JSON-LD `downloadUrl` da ana bağlantıda kalır.

| Sayfa (`data-kk-brand`) | ASC grubu | Bağlantı | Grup id |
|---|---|---|---|
| sony | PB-Site-Sony | `join/ndxJWSYJ` | 24e69485-339c-4300-a4eb-5fadffc48054 |
| bose | PB-Site-Bose | `join/7NjvtTKR` | 9daaa5b4-1ec9-48c0-b9f8-c8c41ead0f9e |
| nothing-cmf | PB-Site-Nothing | `join/8ZpwjRPH` | db49a381-e80c-4991-8a81-2ca75aacf9f5 |
| huawei-freebuds | PB-Site-Huawei | `join/xHFjKfWq` | e6eadd4d-3e48-4ade-8ee4-5be1c61644d4 |
| technics | PB-Site-Technics | `join/nNXhT7cP` | 44d77445-bd70-4b4c-962c-f671ed179dd6 |
| jbl | PB-Site-JBL | `join/UNxpCFjf` | be85569e-bae1-46a2-bffc-0d265c8b5107 |
| samsung-galaxy-buds | PB-Site-Samsung | `join/cC7u67Vu` | ecfe1ae8-3093-4289-b1f0-9cc3e899f719 |
| sennheiser | PB-Site-Sennheiser | `join/EezYTQz6` | 35bbebcf-e515-4254-9efe-83a954282681 |
| google-fast-pair | PB-Site-Google | `join/Grm6Zebg` | 247e5529-136f-4cc1-88b7-5fa31762d0de |
| hub (`/en/brands/`, `/tr/markalar/`) | PB-Site-Hub | `join/KGhGqN6x` | 6defab1b-e5e7-4850-83b9-c518fd753bd8 |
| verify (`/en/verify/`, `/tr/dogrulama/`) | PB-Site-Verify | `join/b1sjXpUv` | b4cff429-1d1b-4d19-96f1-e940ef373a7b |

Grupların hepsinde build 14 (1.5) ve 15 (1.6) var, limit yok, geri bildirim açık. Yeni build çıkınca bu 11 gruba da eklenmeli; sürüm skill'ine yazıldı.

### Okuma adımları

1. ASC'ye `browser_sign_in(app_store_connect)` ile gir. Bir TestFlight grup sayfası açık olsun.
2. `reddit-launch/campaign-2026-11-16/brand-site-measure.js` dosyasını olduğu gibi `browser_eval` ile çalıştır.
   Çıktıda her sayfa için bir satır olur: `<slug>|tf_link_opens=N|joins=N|did_not_accept=N|window=<başlangıç>..<bitiş>|testers=N|installed=N`.
3. Elle bakmak istersen: ASC → TestFlight → grup (ör. PB-Site-Bose) → Public Link bölümündeki görüntülenme ve kabul sayıları.
4. Sonucu `metrics.csv`'ye yaz: `<zaman>,App Store Connect,site_<slug>_tf_opens,<N>,T396_measured,PB-Site-<Marka> viewCount 30g pencere`. Aynı şekilde `site_<slug>_tf_joins` ve `site_<slug>_testers` satırlarını ekle.

### Anlamlar ve sınırlar

- `viewCount`, bağlantının açılma sayısıdır, yani siteden TestFlight'a tıklama. Kişi değil açılış sayar: aynı kişi iki kez açarsa 2 olur.
- Metrik son 30 günlük kayan penceredir (`window`). Uzun dönem için her ölçümde anlık değeri kaydet ve farkını al.
- ASC metriği günlük olarak güncelleyebilir. Tıklama hemen görünmeyebilir.
- Sayfayı tarayan botlar bağlantıyı açarsa `viewCount` büyüyebilir. `joins` ve `testers` bundan etkilenmez; kesin değer onlardır.
- Başlangıç değeri 26.11.2026 14:28 TRT'de 11 grubun hepsinde 0'dır. Kurulum sırasında her bağlantı bir kez `curl` ile açıldı; bu açılışlar sayıldıysa her grupta en fazla 1 tıklama buna aittir.
- Doğrulama panosundaki model satırları `data-kk-brand` etiketini koruyor, ama hepsi PB-Site-Verify grubuna gider. Pano marka bazında ayrılmaz, sayfa olarak sayılır.

## 2. Marka sayfası ziyareti (engel)

Bugünkü altyapıda ziyaret sayılamıyor. Nedenleri:

- Site GitHub Pages'te duruyor. Pages sahibine erişim günlüğü vermez. `gh api repos/<repo>/traffic/views` yalnız github.com'daki repo sayfasını sayar, Pages sitesini saymaz.
- Sitede analitik betiği yok. Hesapsız ve yetkili bir sayaç da yok. GoatCounter, Plausible ve Cloudflare gibi seçeneklerin hepsi yeni hesap ister; kurallar yeni hesabı yasaklıyor.
- `t143/scripts/site_hook.py` sayaç değildir. Ana sayfa metnini düzenleyen statik bir yamacıdır; Founding 100 sayısını da ASC'den elle alır. Olay toplamaz.
- UTM etiketleri yalnız bağlantıda durur. Onları okuyacak bir analitik olmadığı için sayılmaz.

Kaynakların gerçekte ne verdiği:

| Kaynak | Verdiği | Marka sayfası ziyareti? |
|---|---|---|
| ASC PB-Site-* grupları | Sayfa başına TestFlight bağlantı açılışı, kabul, tester, kurulum | Hayır. Ziyaretin alt sınırını verir (tıklayan kişi ziyaret etmiştir) |
| ASC Public Beta ve PB-* kanal grupları | Kanal başına açılış, kabul ve tester | Hayır |
| ASC App Analytics | App Store ürün sayfası görüntülenmesi ve kaynak türü (web referrer, App Store araması) | Hayır. App Store sayfası sayılır, site sayılmaz |
| Reddit gönderi insights | Kendi gönderimizin görüntülenmesi ve paylaşımı | Hayır. Gönderi görülür, siteye tıklama sayılmaz |
| GitHub repo traffic | github.com repo görüntülenmesi ve referrer | Hayır |
| `data-kk-*` etiketleri, UTM | Etiket. Sayım yok | Analitik eklenirse evet |

Ziyareti açmanın tek yolu kullanıcının onayıyla bir analitik hesabı açmaktır. Örneğin GoatCounter ücretsizdir ve çerez kullanmaz. O zaman şu tek dinleyici yeter:

```js
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-kk-brand]');
  if (a) track('tf_click', { brand: a.dataset.kkBrand, cta: a.dataset.kkCta, lang: document.documentElement.lang });
});
```

## 3. Sayfa içi etiketler

Her TestFlight bağlantısı iki öznitelik taşır:

| Öznitelik | Değerler |
|---|---|
| `data-kk-brand` | `sony`, `bose`, `nothing-cmf`, `huawei-freebuds`, `technics`, `jbl`, `samsung-galaxy-buds`, `sennheiser`, `google-fast-pair`, `hub`, `verify`, `universal` |
| `data-kk-cta` | `hero`, `bf` (Black Friday şeridi), `join-box`, `cta-bottom`, `body`, `verify` |

Düğme konumu (`data-kk-cta`) ASC'de ayrılmaz; aynı sayfanın düğmeleri aynı gruba gider.

## 4. Gelen bağlantılar (UTM kuralı)

Biçim: `?utm_source=<kanal>&utm_medium=<post|comment|profile>&utm_campaign=brand-<slug>`.
Bugün sayılmıyor (bkz. 2). Analitik eklenince geçmiş paylaşımlar da okunur. Kanal başına tek ve değişmeyen bir değer kullan.

Görseller: OG `assets/seo/brand-<slug>-<en|tr>.png` (1200x630). Reddit kartı `reddit-launch/campaign-2026-11-16/brand-cards/<slug>[-tr]-1200x900.png`.

## Yasaklar

Sahte tıklama, oy veya katılım yok. Ölçüm için bağlantıları kendin açma. Sayaç "Deneysel" etiketinin yerine geçmez.
Yalnız WH-1000XM5 gerçek donanımda test edildi.
