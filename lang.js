// Picks Turkish or English: ?lang=… → saved choice → browser language. Turkish is the default.
(function () {
  var q = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  var nav = (navigator.language || "tr").toLowerCase();
  var lang = q || saved || (nav.indexOf("tr") === 0 ? "tr" : "en");
  if (lang !== "tr" && lang !== "en") lang = "tr";
  document.documentElement.lang = lang;

  function set(l) {
    document.documentElement.lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
    mark();
  }
  function mark() {
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.set === document.documentElement.lang);
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { set(b.dataset.set); });
    });
    mark();
  });
})();
