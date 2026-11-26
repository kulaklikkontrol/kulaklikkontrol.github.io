# Ölçüm: marka sayfaları, site tıklamaları ve TestFlight davetleri

Son güncelleme: 26.11.2026 (T396, düzeltme). Üç olay ayrı tutulur; biri diğerinin yerine raporlanmaz.

## Özet: üç ayrı metrik

| # | Metrik | Durum | Kaynak |
|---|---|---|---|
| A | Marka sayfası ziyareti (site) | **Ölçülmüyor**. Yetkili uç nokta yok | — |
| B | Sitedeki TestFlight düğmesine tıklama (site) | **Ölçülmüyor**. Yetkili uç nokta yok | — |
| C | TestFlight davet görüntülemesi ve kabulü, sayfa grubu başına | **Ölçülüyor** (26.11.2026 14:25 TRT'den beri) | ASC grup public link metrikleri (Views, Accepted) ve tester listesi |

C, A ve B'nin yerine geçmez. Apple'ın tanımı: **Views**, public link davetini TestFlight uygulamasında görüntüleyen testçilerin sayısıdır; **Accepted**, daveti kabul edenlerin sayısıdır ([App Store Connect Help](https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers)).
Siteden düğmeye tıklayıp `testflight.apple.com/join/...` sayfasını açan ama TestFlight uygulamasına geçmeyen kişi C'de görünmez. Bu yüzden C, tıklamanın sayısı değildir. Raporlarda "site tıklaması" diye yazılmaz.

## C. TestFlight davet görüntülemesi ve kabulü (uygulandı)

Her marka sayfasının (TR ve EN) bütün TestFlight düğmeleri o markaya ait ayrı bir ASC herkese açık grubuna gider. Hub sayfaları ve doğrulama panosu da kendi gruplarına gider.
Bu bağlantılar başka hiçbir yerde kullanılmaz. Bu yüzden bir grubun Views/Accepted sayıları, o sayfadan gelen ve daveti TestFlight uygulamasında açan ya da kabul eden testçileri gösterir.
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
   Çıktıda her sayfa grubu için bir satır olur: `<slug>|tf_invite_views=N|tf_invite_accepts=N|tf_invite_not_accepted=N|window=<başlangıç>..<bitiş>|testers=N|installed=N`.
3. Elle bakmak istersen: ASC → TestFlight → grup (ör. PB-Site-Bose) → Public Link bölümündeki Views ve Accepted sayıları.
4. Sonucu `metrics.csv`'ye yaz: `<zaman>,App Store Connect,asc_pbsite_<slug>_invite_views,<N>,T396_measured,PB-Site-<Marka> Views 30g pencere`. Aynı şekilde `asc_pbsite_<slug>_invite_accepts` ve `asc_pbsite_<slug>_testers` satırlarını ekle. `site_` önekini yalnız A ve B için kullan.

### Anlamlar ve sınırlar

- `tf_invite_views` = API alanı `viewCount` = ASC'deki Views: daveti TestFlight uygulamasında görüntüleyen testçiler. Site tıklaması değildir.
- `tf_invite_accepts` = `acceptedCount` = Accepted. `testers` ve `installed` grubun tester listesinden gelir; kesin katılım değeri bunlardır.
- `tf_invite_not_accepted` = `didNotAcceptCount`; Apple bu alanı link kriteri tanımlıysa "kriteri karşılamadı" olarak gösterir. Bu gruplarda kriter yok, 0 beklenir.
- Metrik son 30 günlük kayan penceredir (`window`). Uzun dönem için her ölçümde anlık değeri kaydet ve farkını al.
- ASC metrikleri 24 saate kadar gecikebilir.
- Başlangıç değeri 26.11.2026 14:28 TRT'de 11 grubun hepsinde 0'dır. Kurulumda her bağlantı bir kez `curl` ile açıldı; bu, TestFlight uygulaması açılmadığı için Views'a girmez.
- Doğrulama panosundaki model satırları `data-kk-brand` etiketini koruyor, ama hepsi PB-Site-Verify grubuna gider. Pano marka bazında ayrılmaz, sayfa olarak sayılır.

## A ve B. Site ziyareti ve sitedeki TestFlight tıklaması (ölçülmüyor: yetkili uç nokta yok)

İki olay da tarayıcıda olur ve yalnız sitenin kendisi ya da bir analitik uç noktası kaydedebilir. 26.11.2026'da yetkili bir uç nokta yok:

- Site GitHub Pages'te duruyor. Pages sahibine erişim günlüğü vermez. `gh api repos/<repo>/traffic/views` yalnız github.com'daki repo sayfasını sayar, Pages sitesini saymaz.
- Sitede analitik betiği yok. Hesabı açılmış bir sayaç da yok. GoatCounter, Plausible ve Cloudflare Web Analytics yeni hesap ister; görev kuralları yeni hesabı yasaklıyor (hafıza #12075: GoatCounter önerildi, hesap açılmadı).
- time'ın dışarıdan erişilebilen bir webhook/olay uç noktası yok (`time help` içinde yok).
- `t143/scripts/site_hook.py` sayaç değildir. Ana sayfa metnini düzenleyen statik bir yamacıdır; Founding 100 sayısını da ASC'den elle alır. Olay toplamaz.
- UTM etiketleri yalnız bağlantıda durur. Onları okuyacak bir analitik olmadığı için sayılmaz.

Bu yüzden `metrics.csv`'de `site_page_visits_by_brand` ve `site_tf_button_clicks_by_brand` satırları "veri yok" olarak durur. ASC sayıları bu satırlara yazılmaz.

Kaynakların gerçekte ne verdiği:

| Kaynak | Verdiği | A (ziyaret) | B (site tıklaması) |
|---|---|---|---|
| ASC PB-Site-* grupları | Davet görüntüleme (TestFlight uygulamasında), kabul, tester, kurulum | Hayır | Hayır. Tıklamaların yalnız TestFlight uygulamasına kadar gidenleri görünür |
| ASC Public Beta ve PB-* kanal grupları | Kanal başına davet görüntüleme, kabul ve tester | Hayır | Hayır |
| ASC App Analytics | App Store ürün sayfası görüntülenmesi ve kaynak türü | Hayır. App Store sayfası sayılır | Hayır |
| Reddit gönderi insights | Kendi gönderimizin görüntülenmesi ve paylaşımı | Hayır | Hayır |
| GitHub repo traffic | github.com repo görüntülenmesi ve referrer | Hayır | Hayır |
| `data-kk-*` etiketleri, UTM | Etiket. Sayım yok | Analitik eklenirse evet | Analitik eklenirse evet |

### Açmak için gereken

Kullanıcı bir analitik hesabı açar ya da mevcut bir hesabın site kodunu verirse (ör. GoatCounter, ücretsiz ve çerezsiz) şu iki parça yeter. Hesap açılana kadar bu kod siteye eklenmez.

```html
<!-- her sayfanın <head> bölümüne: A, sayfa ziyareti (yol = marka) -->
<script data-goatcounter="https://<kod>.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
```

```js
// B, marka başına TestFlight düğmesi tıklaması
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-kk-brand]');
  if (a && window.goatcounter) goatcounter.count({ path: 'tf-click/' + a.dataset.kkBrand + '/' + a.dataset.kkCta + '/' + document.documentElement.lang, event: true });
});
```

Okuma: GoatCounter panosunda A için `/en/brands/<slug>/` ve `/tr/markalar/<slug>/` yolları, B için `tf-click/<slug>/…` olayları.

## Sayfa içi etiketler

Her TestFlight bağlantısı iki öznitelik taşır:

| Öznitelik | Değerler |
|---|---|
| `data-kk-brand` | `sony`, `bose`, `nothing-cmf`, `huawei-freebuds`, `technics`, `jbl`, `samsung-galaxy-buds`, `sennheiser`, `google-fast-pair`, `hub`, `verify`, `universal` |
| `data-kk-cta` | `hero`, `bf` (Black Friday şeridi), `join-box`, `cta-bottom`, `body`, `verify` |

Düğme konumu (`data-kk-cta`) ASC'de ayrılmaz; aynı sayfanın düğmeleri aynı gruba gider. Etiketler bugün yalnız B için hazırlıktır.

## Gelen bağlantılar (UTM kuralı)

Biçim: `?utm_source=<kanal>&utm_medium=<post|comment|profile>&utm_campaign=brand-<slug>`.
Bugün sayılmıyor (bkz. A ve B). Analitik eklenince geçmiş paylaşımlar da okunur. Kanal başına tek ve değişmeyen bir değer kullan.

Görseller: OG `assets/seo/brand-<slug>-<en|tr>.png` (1200x630). Reddit kartı `reddit-launch/campaign-2026-11-16/brand-cards/<slug>[-tr]-1200x900.png`.

## Yasaklar

Sahte tıklama, oy veya katılım yok. Ölçüm için bağlantıları kendin açma. Sayaç "Deneysel" etiketinin yerine geçmez. ASC davet sayıları site tıklaması ya da ziyaret diye raporlanmaz.
Yalnız WH-1000XM5 gerçek donanımda test edildi.
