/* Crème et Crema — page logic: language, rendering, quote form */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG || {};
  var C = window.SITE_CONTENT || {};
  var I18N = window.I18N || {};
  var LANGS = ["fr", "en"];
  var lang = pickLang();

  /* French lives at /, English at /en/. The page's <html lang> says which one this is.
     ?build=xx is only used by tools/build.mjs when it pre-renders each language. */
  function pickLang() {
    var b = new URLSearchParams(location.search).get("build");
    if (LANGS.indexOf(b) > -1) return b;
    var l = (document.documentElement.getAttribute("lang") || "fr").slice(0, 2);
    return LANGS.indexOf(l) > -1 ? l : "fr";
  }
  function otherLangUrl() { return lang === "en" ? "../" : "en/"; }
  (function redirectOldLangParam() { // old links like ?lang=en go to the right page
    var q = new URLSearchParams(location.search).get("lang");
    if (LANGS.indexOf(q) > -1 && q !== lang) location.replace(otherLangUrl() + location.hash);
  })();

  function t(key) {
    var s = (I18N[lang] && I18N[lang][key]) || (I18N.fr && I18N.fr[key]) || "";
    return fill(s);
  }
  function fill(s) {
    return String(s).replace(/\{(\w+)\}/g, function (_, k) { return CFG[k] != null ? CFG[k] : ""; });
  }
  function L(v) { // pick language from {fr,en} or plain string
    if (v == null) return "";
    if (typeof v === "string") return fill(v);
    var x = v[lang] != null ? v[lang] : v.fr;
    return Array.isArray(x) ? x.map(fill) : fill(x);
  }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function money(n) {
    return new Intl.NumberFormat(lang === "fr" ? "fr-CA" : "en-CA", { style: "currency", currency: (CFG.pricing && CFG.pricing.currency) || "CAD", maximumFractionDigits: 0 }).format(n);
  }
  function hasPrices() {
    var p = CFG.pricing && CFG.pricing.packages;
    return !!p && Object.keys(p).some(function (k) { return typeof p[k] === "number"; });
  }

  /* ---------- static text ---------- */
  function applyText() {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    var md = document.querySelector('meta[name="description"]'); if (md) md.content = t("meta.desc");
    document.querySelectorAll("[data-i18n]").forEach(function (n) { var v = t(n.getAttribute("data-i18n")); if (v) n.textContent = v; });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (n) { n.placeholder = t(n.getAttribute("data-i18n-ph")); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (n) { n.setAttribute("aria-label", t(n.getAttribute("data-i18n-aria"))); });
  }

  /* ---------- sections ---------- */
  var menuTab = null;
  function renderMenu() {
    var grid = document.getElementById("menuGrid"); if (!grid) return;
    var tabs = document.getElementById("menuTabs");
    var cats = C.menu || [];
    if (!menuTab || !cats.some(function (c) { return c.id === menuTab; })) menuTab = cats.length ? cats[0].id : null;
    if (tabs) {
      tabs.innerHTML = ""; tabs.setAttribute("aria-label", t("menu.tabs"));
      cats.forEach(function (cat, i) {
        var on = cat.id === menuTab;
        var b = el("button", { type: "button", class: "tab" + (on ? " active" : ""), role: "tab", id: "tab-" + cat.id,
          "aria-selected": on ? "true" : "false", "aria-controls": "panel-" + cat.id, tabindex: on ? "0" : "-1", text: L(cat.title) });
        b.addEventListener("click", function () { menuTab = cat.id; renderMenu(); document.getElementById("tab-" + cat.id).focus(); });
        b.addEventListener("keydown", function (e) {
          var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
          e.preventDefault(); var n = cats[(i + d + cats.length) % cats.length];
          menuTab = n.id; renderMenu(); document.getElementById("tab-" + n.id).focus();
        });
        tabs.appendChild(b);
      });
    }
    grid.innerHTML = "";
    cats.forEach(function (cat) {
      var ul = el("ul");
      cat.items.forEach(function (it) {
        var tags = el("span", { class: "tags" });
        (it.tags || []).forEach(function (tg) { tags.appendChild(el("span", { class: "tag tag-" + tg, text: t("tag." + tg) })); });
        ul.appendChild(el("li", null, [
          el("div", { class: "item-top" }, [el("span", { class: "item-name", text: L(it.name) }), tags]),
          it.desc ? el("p", { class: "item-desc", text: L(it.desc) }) : null
        ]));
      });
      var attrs = { class: "menu-card" + (cat.id === "signature" ? " signature" : "") + (tabs ? " panel" : "") };
      if (tabs) { attrs.id = "panel-" + cat.id; attrs.role = "tabpanel"; attrs["aria-labelledby"] = "tab-" + cat.id; if (cat.id !== menuTab) attrs.hidden = ""; }
      grid.appendChild(el(tabs ? "div" : "article", attrs, tabs ? [ul] : [el("h3", { text: L(cat.title) }), ul]));
    });
    var note = document.getElementById("menuNote"); if (note) note.textContent = L(C.menuNote);
  }

  function renderPackages() {
    var box = document.getElementById("packages"); if (!box) return;
    document.getElementById("packagesLead").textContent = t(CFG.showMinimums ? "packages.lead" : "packages.lead.flex");
    box.innerHTML = "";
    var prices = (CFG.pricing && CFG.pricing.packages) || {};
    var custom = document.getElementById("pkgCustom"); if (custom) custom.innerHTML = "";
    var cardIndex = 0;
    (C.packages || []).forEach(function (p) {
      var ul = el("ul"); (L(p.includes) || []).forEach(function (i) { ul.appendChild(el("li", { text: i })); });
      var price = typeof prices[p.id] === "number"
        ? el("p", { class: "price" }, [el("small", { text: t("packages.from") }), document.createTextNode(money(prices[p.id]))])
        : el("p", { class: "price price-quote", text: t("packages.onquote") });
      var btn = el("a", { class: "btn", href: "#soumission", "data-package": p.id, text: p.cta ? L(p.cta) : t("packages.choose") });
      btn.addEventListener("click", function () { var s = document.getElementById("packageSelect"); if (s) { s.value = p.id; s.dispatchEvent(new Event("change")); } if (form) goStep(1, false); });
      if (p.id === "custom" && custom) {
        custom.appendChild(el("article", { class: "package-custom" }, [
          el("div", { class: "pc-text" }, [el("p", { class: "tagline", text: L(p.tagline) }), el("h3", { text: L(p.name) }), p.desc ? el("p", { class: "pkg-desc", text: L(p.desc) }) : null]),
          el("div", { class: "pc-side" }, [ul, btn])
        ]));
        return;
      }
      box.appendChild(el("article", { class: "package" + (cardIndex++ % 2 ? " featured" : "") }, [ // cards alternate green / cream
        el("p", { class: "tagline", text: L(p.tagline) }), el("h3", { text: L(p.name) }), price, ul, btn
      ]));
    });
    renderDots();
    var ex = document.getElementById("extras"); ex.innerHTML = "";
    (L(C.extras) || []).forEach(function (e) { ex.appendChild(el("li", { text: e })); });

    var sel = document.getElementById("packageSelect");
    if (sel) {
      var cur = sel.value; sel.innerHTML = "";
      (C.packages || []).forEach(function (p) { sel.appendChild(el("option", { value: p.id, text: L(p.name) })); });
      sel.appendChild(el("option", { value: "unsure", text: t("f.package.unsure") }));
      sel.value = sel.getAttribute("data-touched") && cur ? cur : "unsure";
      if (!sel._touchBound) { sel._touchBound = true; sel.addEventListener("change", function () { sel.setAttribute("data-touched", "1"); }); }
    }
  }

  function renderDots() {
    var box = document.getElementById("packages"), dots = document.getElementById("pkgDots"); if (!box || !dots) return;
    dots.innerHTML = "";
    var cards = box.querySelectorAll(".package");
    Array.prototype.forEach.call(cards, function (c, i) {
      var d = el("button", { type: "button", class: "dot-btn" + (i === 0 ? " active" : ""), "aria-label": t("packages.dot") + " " + (i + 1) });
      d.addEventListener("click", function () { box.scrollTo({ left: c.offsetLeft - box.offsetLeft - (box.clientWidth - c.offsetWidth) / 2, behavior: "smooth" }); });
      dots.appendChild(d);
    });
    if (!box._dotsBound) {
      box._dotsBound = true;
      box.addEventListener("scroll", function () {
        var mid = box.scrollLeft + box.clientWidth / 2, best = 0, bd = 1e9;
        Array.prototype.forEach.call(box.querySelectorAll(".package"), function (c, i) {
          var cm = c.offsetLeft - box.offsetLeft + c.offsetWidth / 2, dd = Math.abs(cm - mid); if (dd < bd) { bd = dd; best = i; }
        });
        Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle("active", i === best); });
      }, { passive: true });
    }
  }

  function renderSteps() {
    var ol = document.getElementById("steps"); if (!ol) return; ol.innerHTML = "";
    (C.steps || []).forEach(function (s) { ol.appendChild(el("li", null, [el("h3", { text: L(s.title) }), el("p", { text: L(s.text) })])); });
  }

  function renderAreas() {
    var ul = document.getElementById("areas"); if (!ul) return; ul.innerHTML = "";
    (C.areas || []).forEach(function (a) { ul.appendChild(el("li", null, [el("span", { class: "dot", "aria-hidden": "true" }), el("span", { text: L(a.name) })])); });
  }

  function renderFaq() {
    var box = document.getElementById("faqList"); if (!box) return; box.innerHTML = "";
    (C.faq || []).filter(function (f) { return (!f.onlyIf || CFG[f.onlyIf]) && (!f.unless || !CFG[f.unless]); }).forEach(function (f) { box.appendChild(el("details", null, [el("summary", { text: L(f.q) }), el("p", { text: L(f.a) })])); });
  }

  function renderGallery() {
    var sec = document.getElementById("galerie"); var g = document.getElementById("gallery");
    if (!sec || !g) return;
    var items = CFG.gallery || []; sec.hidden = items.length === 0; g.innerHTML = "";
    var head = document.getElementById("galleryHead"); // heading only exists once there are photos
    if (head) { head.innerHTML = ""; if (items.length) head.appendChild(el("h2", { text: t("gallery.title") })); }
    items.forEach(function (it) { g.appendChild(el("img", { src: it.src, alt: L(it.alt), loading: "lazy" })); });
  }

  function renderContact() {
    var ul = document.getElementById("contactList"); if (!ul) return; ul.innerHTML = "";
    if (CFG.email) ul.appendChild(el("li", null, [el("a", { href: "mailto:" + CFG.email, text: CFG.email })]));
    if (CFG.phone) ul.appendChild(el("li", null, [el("a", { href: "tel:" + CFG.phone.replace(/[^\d+]/g, ""), text: CFG.phone })]));
    if (CFG.instagram) ul.appendChild(el("li", null, [el("a", { href: "https://instagram.com/" + CFG.instagram, target: "_blank", rel: "noopener", text: "@" + CFG.instagram })]));
    ul.appendChild(el("li", null, [el("a", { href: "#soumission", text: t("quote.title") })]));
  }

  /* ---------- quote form ---------- */
  var form = document.getElementById("quoteForm");

  function zoneOf() {
    var o = form.area.selectedOptions[0];
    return o ? Number(o.getAttribute("data-zone")) || 0 : 0;
  }

  function estimate() {
    var box = document.getElementById("estimate");
    if (!box || !hasPrices()) { if (box) box.hidden = true; return null; }
    var P = CFG.pricing, pk = form.package.value;
    var base = P.packages[pk];
    var guests = Number(form.guests.value) || 0, hours = Number(form.hours.value) || 0;
    if (typeof base !== "number" || !guests || !hours) { box.hidden = true; return null; }
    var total = base;
    if (P.perExtraGuest && guests > CFG.minGuests) total += (guests - CFG.minGuests) * P.perExtraGuest;
    if (P.perExtraHour && hours > CFG.minHours) total += (hours - CFG.minHours) * P.perExtraHour;
    if (P.secondBarista && guests >= (P.secondBaristaFrom || Infinity)) total += P.secondBarista;
    var z = zoneOf(), travelKnown = true;
    if (z === 1 && P.travel.zone1) total += P.travel.zone1;
    else if (z === 2 && P.travel.zone2) total += P.travel.zone2;
    else if (z === 3 || (z && !P.travel["zone" + z])) travelKnown = false;
    document.getElementById("estimateValue").textContent = money(total) + (travelKnown ? "" : " + " + t("f.travel.tbd"));
    box.hidden = false;
    return { total: total, travelKnown: travelKnown };
  }

  function hints() {
    var g = Number(form.guests.value), h = Number(form.hours.value);
    document.getElementById("guestsHint").textContent = CFG.showMinimums && g && g < CFG.minGuests ? t("f.below.min") : "";
    document.getElementById("hoursHint").textContent = CFG.showMinimums && h && h < CFG.minHours ? t("f.hours.min") : "";
  }

  var STEP1 = ["date", "time", "hours", "guests", "area"], STEP2 = ["name", "email"];
  /* Phone: Canadian/US numbers, 10 digits, optional leading 1 */
  function phoneDigits(v) { var d = String(v || "").replace(/\D/g, ""); if (d.length === 11 && d[0] === "1") d = d.slice(1); return d; }
  function phoneOk(v) { return /^[2-9]\d{2}[2-9]\d{6}$/.test(phoneDigits(v)); }
  function formatPhone(v) {
    var d = phoneDigits(v).slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return "(" + d.slice(0, 3) + ") " + d.slice(3);
    return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
  }
  function checkPhone() {
    var f = form.phone, bad = !!f.value.trim() && !phoneOk(f.value);
    f.classList.toggle("invalid", bad);
    document.getElementById("phoneHint").textContent = bad ? t("f.phone.bad") : "";
    return !bad;
  }

  function validate(keys, needConsent) {
    var ok = true;
    (keys || STEP1.concat(STEP2)).forEach(function (k) {
      if ((k === "date" || k === "time") && form.noDate.checked) { (k === "date" ? document.getElementById("cal") : form.time).classList.remove("invalid"); return; }
      var f = form[k]; var bad = !f.value || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
      if (k === "date" && f.value) { var d = new Date(f.value + "T23:59"); if (d < new Date()) bad = true; }
      var target = k === "date" ? document.getElementById("cal") : f;
      if (target) target.classList.toggle("invalid", bad); if (bad) ok = false;
    });
    if ((keys || STEP2).indexOf("email") > -1 && !checkPhone()) ok = false;
    if (needConsent !== false && !form.consent.checked) ok = false;
    return ok;
  }

  function collect() {
    var drinks = Array.prototype.slice.call(form.querySelectorAll('input[name="drinks"]:checked')).map(function (i) { return i.value; });
    var est = estimate();
    return {
      name: form.name.value.trim(), email: form.email.value.trim(), phone: form.phone.value.trim() ? formatPhone(form.phone.value) : "",
      eventType: form.eventType.value, date: form.noDate.checked ? "no date yet" : form.date.value, startTime: form.noDate.checked ? "" : form.time.value,
      hours: form.hours.value, guests: form.guests.value, area: form.area.value, venue: form.venue.value.trim(),
      package: form.package.value, drinks: drinks.join(", "), setting: form.setting.value,
      message: form.message.value.trim(), language: lang,
      estimate: est ? Math.round(est.total) + (est.travelKnown ? "" : " + travel") : "",
      _subject: "Soumission — " + form.name.value.trim() + " — " + form.date.value
    };
  }

  function status(kind, html) {
    var s = document.getElementById("formStatus"); s.className = "form-status " + (kind || ""); s.innerHTML = html || "";
  }

  var curStep = 1;
  function goStep(n, focus) {
    curStep = n;
    form.querySelectorAll(".form-step").forEach(function (s) { s.hidden = +s.getAttribute("data-step") !== n; });
    form.querySelectorAll(".fs-dot").forEach(function (d) { d.classList.toggle("active", +d.getAttribute("data-for") <= n); });
    document.getElementById("stepLabel").textContent = t("f.step" + n);
    if (focus) {
      document.getElementById("soumission").scrollIntoView({ behavior: "smooth", block: "start" });
      var f = form.querySelector('.form-step[data-step="' + n + '"] input:not([type=hidden]), .form-step[data-step="' + n + '"] select');
      if (f && n === 2) setTimeout(function () { f.focus({ preventScroll: true }); }, 350);
    }
  }
  function showFirstInvalid() {
    var first = form.querySelector(".form-step:not([hidden]) .invalid");
    if (first) { first.scrollIntoView({ behavior: "smooth", block: "center" }); if (first.focus) first.focus({ preventScroll: true }); }
  }
  function onNext() {
    if (!validate(STEP1, false)) {
      var dateBad = form.date.value && new Date(form.date.value + "T23:59") < new Date();
      status("err", dateBad ? t("f.date.past") : t("f.step1.required"));
      showFirstInvalid(); return;
    }
    status(); goStep(2, true);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (form._gotcha.value) return; // bot
    var dateBad = form.date.value && new Date(form.date.value + "T23:59") < new Date();
    if (!validate(STEP1, false)) { goStep(1, false); status("err", dateBad ? t("f.date.past") : t("f.step1.required")); showFirstInvalid(); return; }
    if (!validate(STEP2)) { status("err", form.phone.classList.contains("invalid") && form.name.value && form.email.value && form.consent.checked ? t("f.phone.bad") : t("f.required")); showFirstInvalid(); return; }
    var data = collect();
    var btn = document.getElementById("submitBtn");

    if (CFG.formEndpoint) {
      btn.disabled = true; btn.textContent = t("f.sending");
      // Google Apps Script only accepts "simple" requests from a browser, so send JSON as text/plain there.
      var gas = /script\.google\.com/.test(CFG.formEndpoint);
      fetch(CFG.formEndpoint, { method: "POST", headers: gas ? { "Content-Type": "text/plain;charset=utf-8" } : { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) {
          if (!j || j.ok !== true) { var e = new Error((j && j.error) || "not_saved"); e.code = j && j.error; throw e; } // only a confirmed save counts as success
          form.reset(); cal.sel = null; setDefaults(); renderPickers(); goStep(1, false);
          status("ok", "<strong>" + t("f.ok.title") + "</strong>" + t("f.ok.text") + (j.id && j.id !== "ignored" ? " " + t("f.ok.ref") + " " + j.id + "." : ""));
        })
        .catch(function (e) { status("err", (e && e.code === "rate_limited" ? t("f.err.rate") : t("f.err")) + (CFG.email ? " " + t("f.err.mail") + ' <a href="mailto:' + CFG.email + '">' + CFG.email + "</a>" : "")); })
        .finally(function () { btn.disabled = false; btn.textContent = t("f.submit"); });
      return;
    }
    if (CFG.email) {
      var body = Object.keys(data).filter(function (k) { return k[0] !== "_" && data[k]; }).map(function (k) { return k + ": " + data[k]; }).join("\n");
      location.href = "mailto:" + CFG.email + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(body);
      status("ok", "<strong>" + t("f.ok.title") + "</strong>" + t("f.mailto.text"));
      return;
    }
    status("err", t("f.notconfigured"));
  }

  function setDefaults() {
    form.hours.value = CFG.minHours || 3;
    form.guests.value = CFG.showMinimums && CFG.minGuests ? CFG.minGuests : "";
    form.date.value = "";
    form.time.disabled = false; var c = document.getElementById("cal"); if (c) c.classList.remove("off");
  }

  /* ---------- pickers: calendar, time, duration, guests ---------- */
  var cal = { view: null, sel: null };
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function loc() { return lang === "fr" ? "fr-CA" : "en-CA"; }
  function firstBookable() { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + (CFG.minNoticeDays || 1)); return d; }
  function lastBookable() { var d = firstBookable(); d.setMonth(d.getMonth() + (CFG.maxMonthsAhead || 18)); return d; }
  function isFull(key) { return (CFG.unavailableDates || []).indexOf(key) > -1; }

  function renderCal() {
    var box = document.getElementById("cal"); if (!box) return;
    var min = firstBookable(), max = lastBookable(), today = ymd(new Date());
    if (!cal.view) cal.view = new Date(min.getFullYear(), min.getMonth(), 1);
    var y = cal.view.getFullYear(), m = cal.view.getMonth();
    box.innerHTML = "";

    var prev = el("button", { type: "button", class: "cal-nav", "aria-label": t("f.cal.prev"), text: "‹" });
    var next = el("button", { type: "button", class: "cal-nav", "aria-label": t("f.cal.next"), text: "›" });
    prev.disabled = y < min.getFullYear() || (y === min.getFullYear() && m <= min.getMonth());
    next.disabled = y > max.getFullYear() || (y === max.getFullYear() && m >= max.getMonth());
    prev.onclick = function () { cal.view = new Date(y, m - 1, 1); renderCal(); box.querySelector(".cal-nav").focus(); };
    next.onclick = function () { cal.view = new Date(y, m + 1, 1); renderCal(); box.querySelectorAll(".cal-nav")[1].focus(); };
    var title = new Intl.DateTimeFormat(loc(), { month: "long", year: "numeric" }).format(cal.view);
    box.appendChild(el("div", { class: "cal-head" }, [prev, el("span", { class: "cal-title", "aria-live": "polite", text: title }), next]));

    var grid = el("div", { class: "cal-grid" });
    var sunday = new Date(2026, 10, 1); // a Sunday
    for (var i = 0; i < 7; i++) {
      var wd = new Date(sunday); wd.setDate(1 + i);
      grid.appendChild(el("span", { class: "cal-dow", "aria-hidden": "true", text: new Intl.DateTimeFormat(loc(), { weekday: "narrow" }).format(wd) }));
    }
    var startPad = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    for (var p = 0; p < startPad; p++) grid.appendChild(el("span"));
    var longFmt = new Intl.DateTimeFormat(loc(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    for (var dnum = 1; dnum <= days; dnum++) {
      var d = new Date(y, m, dnum), key = ymd(d), full = isFull(key);
      var b = el("button", { type: "button", class: "cal-day", text: String(dnum), "data-date": key,
        "aria-label": longFmt.format(d) + (full ? " — " + t("f.cal.full") : "") });
      if (d < min || d > max || full) b.disabled = true;
      if (full) b.classList.add("full");
      if (key === today) b.classList.add("today");
      if (key === cal.sel) { b.classList.add("sel"); b.setAttribute("aria-pressed", "true"); }
      b.onclick = function () { pickDate(this.getAttribute("data-date")); };
      grid.appendChild(b);
    }
    box.appendChild(grid);
    var picked = document.getElementById("datePicked");
    if (picked) picked.textContent = cal.sel ? longFmt.format(new Date(cal.sel + "T12:00")) : "";
  }

  function pickDate(key) {
    cal.sel = key; form.date.value = key;
    if (form.noDate.checked) { form.noDate.checked = false; syncNoDate(); }
    document.getElementById("cal").classList.remove("invalid");
    renderCal();
    var btn = document.querySelector('.cal-day[data-date="' + key + '"]'); if (btn) btn.focus();
    hints(); estimate();
  }

  function syncNoDate() {
    var off = form.noDate.checked;
    document.getElementById("cal").classList.toggle("off", off);
    form.time.disabled = off;
    if (off) { cal.sel = null; form.date.value = ""; renderCal(); document.getElementById("cal").classList.remove("invalid"); form.time.classList.remove("invalid"); }
  }

  function renderTimes() {
    var sel = document.getElementById("timeSelect"); if (!sel) return;
    var cur = sel.value, ts = CFG.timeSlots || { start: "07:00", end: "21:00", stepMinutes: 30 };
    var toMin = function (s) { var a = s.split(":"); return +a[0] * 60 + +a[1]; };
    var fmt = new Intl.DateTimeFormat(loc(), { hour: "numeric", minute: "2-digit" });
    sel.innerHTML = ""; sel.appendChild(el("option", { value: "", text: t("f.time.choose") }));
    for (var mm = toMin(ts.start); mm <= toMin(ts.end); mm += ts.stepMinutes || 30) {
      var v = pad(Math.floor(mm / 60)) + ":" + pad(mm % 60);
      sel.appendChild(el("option", { value: v, text: fmt.format(new Date(2026, 0, 1, Math.floor(mm / 60), mm % 60)) }));
    }
    sel.value = cur;
  }

  function renderHours() {
    var box = document.getElementById("hoursChips"); if (!box) return;
    box.innerHTML = "";
    (CFG.durationOptions || [3, 4, 5, 6]).forEach(function (h) {
      var on = String(h) === String(form.hours.value);
      var b = el("button", { type: "button", role: "radio", "aria-checked": on ? "true" : "false", text: h + " h" });
      b.onclick = function () { form.hours.value = h; renderHours(); hints(); estimate(); };
      box.appendChild(b);
    });
  }

  function setupStepper() {
    form.querySelectorAll(".step").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = (Number(form.guests.value) || 0) + Number(b.getAttribute("data-step"));
        form.guests.classList.remove("invalid");
        form.guests.value = Math.max(1, Math.min(2000, n));
        hints(); estimate();
      });
    });
  }

  function renderPickers() { renderCal(); renderTimes(); renderHours(); }

  /* ---------- nav + language ---------- */
  function setupNav() {
    var toggle = document.getElementById("navToggle"), nav = document.getElementById("nav");
    toggle.addEventListener("click", function () { var o = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } });
  }

  function renderAll() {
    applyText(); renderMenu(); renderPackages(); renderSteps(); renderAreas(); renderFaq(); renderGallery(); renderContact();
    if (form) { renderPickers(); hints(); estimate(); document.getElementById("stepLabel").textContent = t("f.step" + curStep); }
  }

  (function setupLangLink() {
    var a = document.getElementById("langBtn"); if (!a) return;
    var other = lang === "fr" ? "en" : "fr";
    a.setAttribute("href", otherLangUrl()); a.setAttribute("hreflang", other); a.setAttribute("lang", other);
    a.addEventListener("click", function (e) { e.preventDefault(); location.href = otherLangUrl() + location.hash; });
  })();

  document.getElementById("year").textContent = new Date().getFullYear();
  setupNav();
  if (form) {
    setDefaults();
    setupStepper();
    form.addEventListener("submit", onSubmit);
    form.phone.addEventListener("input", function (e) {
      var f = form.phone, atEnd = f.selectionStart === f.value.length;
      if (atEnd && e.inputType !== "deleteContentBackward") f.value = formatPhone(f.value);
      if (f.classList.contains("invalid") && phoneOk(f.value)) checkPhone();
    });
    form.phone.addEventListener("blur", function () { if (form.phone.value.trim()) { if (phoneOk(form.phone.value)) form.phone.value = formatPhone(form.phone.value); checkPhone(); } else checkPhone(); });
    form.noDate.addEventListener("change", syncNoDate);
    document.getElementById("nextBtn").addEventListener("click", onNext);
    document.getElementById("backBtn").addEventListener("click", function () { status(); goStep(1, true); });
    form.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && curStep === 1 && e.target.tagName === "INPUT") { e.preventDefault(); onNext(); }
    });
    var clear = function (e) { if (e.target.value && e.target !== form.phone) e.target.classList.remove("invalid"); hints(); estimate(); };
    form.addEventListener("input", clear);
    form.addEventListener("change", clear);
  }
  renderAll();
})();
