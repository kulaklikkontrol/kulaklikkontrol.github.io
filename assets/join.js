// Device-aware TestFlight join flow (T160).
// Headphone Control is a Mac-only app. Most visitors arrive from phones (Reddit, Bluesky),
// accept on iPhone and never install on the Mac. This script intercepts TestFlight join links:
//  - Mac: opens TestFlight in a new tab and shows the "click Install" next step.
//  - iPhone/iPad: offers AirDrop/share to the Mac, copy, email, or accept now + reminder.
//  - Android/Windows/Linux: explains it's a Mac app and offers to send the link to a Mac.
// No tracking, no network calls.
(function () {
  var ua = navigator.userAgent || "";
  var touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  var isIOS = /iPhone|iPod|iPad/.test(ua) || touchMac;
  var isMac = /Macintosh/.test(ua) && !touchMac;
  var TF_MAC = "https://apps.apple.com/app/testflight/id899247664";

  var T = {
    tr: {
      macTitle: "Son adım: TestFlight’ta <b>Yükle</b>",
      mac1: "Açılan TestFlight sayfasında <b>View in TestFlight</b> → <b>Kabul Et</b>.",
      mac2: "Mac’teki TestFlight’ta Kulaklık Kontrol’ün yanındaki <b>Yükle</b>’ye bas. Sadece kabul etmek uygulamayı kurmaz.",
      mac3: "TestFlight açılmadıysa önce <a href=\"" + TF_MAC + "\" target=\"_blank\" rel=\"noopener\">Mac App Store’dan TestFlight’ı kur</a>, sonra butona tekrar bas. macOS 14+ gerekir.",
      openTF: "TestFlight’ı aç",
      again: "Bağlantıyı tekrar aç",
      phoneTitle: "Bu bir Mac uygulaması",
      phoneLede: "iPhone’a kurulmaz. En kolayı bağlantıyı şimdi Mac’ine göndermek:",
      share: "Mac’ime gönder (AirDrop)",
      shareOther: "Bağlantıyı paylaş",
      copy: "Bağlantıyı kopyala",
      copied: "Kopyalandı ✓",
      mail: "Kendime mail at",
      acceptNow: "Yine de iPhone’da kabul et",
      acceptNote: "Kabul edersen: Mac’te aynı Apple kimliğiyle TestFlight’ı aç ve <b>Yükle</b>’ye bas. Kabul etmek tek başına kurmaz.",
      otherTitle: "Bu bir Mac uygulaması (macOS 14+)",
      otherLede: "Bu cihaza kurulmaz. Bağlantıyı Mac’ine gönder, orada aç:",
      openAnyway: "Yine de TestFlight sayfasını aç",
      close: "Kapat",
      mailSubj: "Headphone Control beta: Mac'imde aç",
      mailBody: "Mac'inde bu bağlantıyı aç (önce Mac App Store'dan TestFlight kur):\n"
    },
    en: {
      macTitle: "Last step: click <b>Install</b> in TestFlight",
      mac1: "On the TestFlight page that opened: <b>View in TestFlight</b> → <b>Accept</b>.",
      mac2: "In TestFlight on your Mac, click <b>Install</b> next to Headphone Control. Accepting alone doesn’t install the app.",
      mac3: "TestFlight didn’t open? <a href=\"" + TF_MAC + "\" target=\"_blank\" rel=\"noopener\">Get TestFlight from the Mac App Store</a> first, then click the button again. Requires macOS 14+.",
      openTF: "Open TestFlight",
      again: "Open the link again",
      phoneTitle: "This is a Mac app",
      phoneLede: "It won’t install on a phone. Easiest: send the link to your Mac now:",
      share: "Send to my Mac (AirDrop)",
      shareOther: "Share the link",
      copy: "Copy link",
      copied: "Copied ✓",
      mail: "Email it to myself",
      acceptNow: "Accept on this iPhone anyway",
      acceptNote: "If you accept here: open TestFlight on your Mac with the same Apple ID and click <b>Install</b>. Accepting alone doesn’t install it.",
      otherTitle: "This is a Mac app (macOS 14+)",
      otherLede: "It won’t install on this device. Send the link to your Mac and open it there:",
      openAnyway: "Open the TestFlight page anyway",
      close: "Close",
      mailSubj: "Headphone Control beta: open on my Mac",
      mailBody: "Open this on your Mac (install TestFlight from the Mac App Store first):\n"
    }
  };
  function t() { return T[document.documentElement.lang === "tr" ? "tr" : "en"]; }

  var css =
    ".kkj-back{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:12px}" +
    "@media(min-width:700px){.kkj-back{align-items:center}}" +
    ".kkj{background:#fff;color:#1d1d1f;max-width:440px;width:100%;border-radius:20px;padding:22px 22px 16px;font:15px/1.45 -apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.3)}" +
    "@media(prefers-color-scheme:dark){.kkj{background:#1a1a1f;color:#f5f5f7}.kkj .kkj-sec{background:#2a2a31;color:#f5f5f7}}" +
    ".kkj h3{margin:0 0 6px;font-size:19px}.kkj p{margin:6px 0}.kkj ol{margin:8px 0 10px;padding-left:20px}.kkj li{margin:6px 0}" +
    ".kkj a{color:#0a66ff}.kkj button,.kkj .kkj-b{display:block;width:100%;box-sizing:border-box;margin:8px 0 0;padding:12px 14px;border:0;border-radius:12px;font:600 15px system-ui,sans-serif;cursor:pointer;text-align:center;text-decoration:none}" +
    ".kkj .kkj-pri{background:#0a66ff;color:#fff}.kkj .kkj-sec{background:#f0f0f3;color:#1d1d1f}" +
    ".kkj .kkj-x{background:none;color:inherit;opacity:.6;font-weight:400}.kkj .kkj-note{font-size:13px;opacity:.75}";

  function sheet(html) {
    if (!document.getElementById("kkj-css")) {
      var s = document.createElement("style"); s.id = "kkj-css"; s.textContent = css; document.head.appendChild(s);
    }
    var back = document.createElement("div");
    back.className = "kkj-back";
    back.innerHTML = '<div class="kkj" role="dialog" aria-modal="true">' + html +
      '<button class="kkj-x" data-k="close">' + t().close + "</button></div>";
    back.addEventListener("click", function (e) { if (e.target === back || e.target.dataset.k === "close") back.remove(); });
    document.body.appendChild(back);
    return back;
  }

  function macNext(href) {
    var L = t();
    sheet("<h3>" + L.macTitle + "</h3><ol><li>" + L.mac1 + "</li><li>" + L.mac2 + "</li></ol>" +
      '<p class="kkj-note">' + L.mac3 + "</p>" +
      '<a class="kkj-b kkj-pri" href="itms-beta://">' + L.openTF + "</a>" +
      '<a class="kkj-b kkj-sec" href="' + href + '" target="_blank" rel="noopener">' + L.again + "</a>");
  }

  function sendToMac(href, phone) {
    var L = t();
    var mail = "mailto:?subject=" + encodeURIComponent(L.mailSubj) + "&body=" + encodeURIComponent(L.mailBody + href);
    var html = "<h3>" + (phone ? L.phoneTitle : L.otherTitle) + "</h3><p>" + (phone ? L.phoneLede : L.otherLede) + "</p>";
    if (navigator.share) html += '<button class="kkj-pri" data-k="share">' + (phone ? L.share : L.shareOther) + "</button>";
    html += '<button class="' + (navigator.share ? "kkj-sec" : "kkj-pri") + '" data-k="copy">' + L.copy + "</button>" +
      '<a class="kkj-b kkj-sec" href="' + mail + '">' + L.mail + "</a>";
    if (phone) html += '<a class="kkj-b kkj-sec" href="' + href + '">' + L.acceptNow + '</a><p class="kkj-note">' + L.acceptNote + "</p>";
    else html += '<p class="kkj-note"><a href="' + href + '">' + L.openAnyway + "</a></p>";
    var back = sheet(html);
    back.addEventListener("click", function (e) {
      var k = e.target.dataset && e.target.dataset.k;
      if (k === "share") navigator.share({ title: "Headphone Control beta", url: href }).catch(function () {});
      if (k === "copy") {
        var done = function () { e.target.textContent = L.copied; };
        if (navigator.clipboard) navigator.clipboard.writeText(href).then(done, function () { prompt("", href); });
        else prompt("", href);
      }
    });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="testflight.apple.com/join/"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.closest(".kkj")) return;
    var href = a.href;
    e.preventDefault();
    if (isMac) {
      // "noopener" in the features string makes window.open return null, so detach manually.
      var w = window.open(href, "_blank");
      if (!w) { location.href = href; return; }
      try { w.opener = null; } catch (err) {}
      macNext(href);
    } else {
      sendToMac(href, isIOS);
    }
  });
})();
