/* ==============================================================
   COLS Skyward registration form (register.html)
   ---- SETTINGS: edit these ------------------------------------ */
const FEE = 99;                                  // ₹ per attendee
const UPI_ID = "9942038045@ptyes";              // QR code (with amount) is built from this
const PAYEE_NAME = "Mr Mohan Prabhu R K";        // shown under the UPI ID (matches the name UPI apps display)
const SUBMIT_URL = "https://script.google.com/macros/s/AKfycbwbR5LOvWOKdhG0GDhwK17nciDChORpeOu2ht0LeXDp_zTnjmXEG8_dzaMnoivNqs73TA/exec";                           // Google Apps Script web app URL (see register-apps-script.gs)
const MAX_ATTENDEES = 15;
/* ------------------------------------------------------------- */

(() => {
  const form = document.getElementById("rg-form");
  if (!form) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const inr = n => "₹" + n.toLocaleString("en-IN");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const list = $("#rg-attendees");
  const tpl = $("#rg-att-tpl");
  let step = 1;
  let shot = null;           // { name, type, data } – compressed screenshot
  let sending = false;

  /* ---------- attendees ---------- */
  const count = () => list.children.length;
  function addAttendee(focus) {
    if (count() >= MAX_ATTENDEES) return;
    const node = tpl.content.firstElementChild.cloneNode(true);
    list.appendChild(node);
    renumber();
    if (focus) node.querySelector("input").focus();
  }
  function renumber() {
    const items = $$(".rg-att", list);
    items.forEach((el, i) => {
      el.querySelector(".rg-att-num").textContent = i + 1;
      el.querySelector(".rg-att-label").textContent = "Attendee " + (i + 1);
      const rm = el.querySelector(".rg-remove");
      rm.hidden = items.length === 1;
      rm.setAttribute("aria-label", "Remove attendee " + (i + 1));
      el.querySelectorAll("[data-f]").forEach(inp => {
        inp.id = `rg-a${i}-${inp.dataset.f}`;
        const lab = inp.closest(".rg-field").querySelector("label");
        if (lab) lab.htmlFor = inp.id;
      });
    });
    const n = items.length, word = n === 1 ? " attendee" : " attendees";
    ["#rg-count", "#rg-count-2", "#rg-count-3"].forEach(s => $(s).textContent = n + word);
    $("#rg-total").textContent = inr(n * FEE);
    $("#rg-calc").textContent = `(${n} × ${inr(FEE)})`;
    $("#rg-add").hidden = n >= MAX_ATTENDEES;
  }
  list.addEventListener("click", e => {
    const b = e.target.closest(".rg-remove");
    if (b) { b.closest(".rg-att").remove(); renumber(); }
  });
  $("#rg-add").addEventListener("click", () => addAttendee(true));
  addAttendee(false);

  /* ---------- errors ---------- */
  function setErr(input, msg) {
    const f = input.closest(".rg-field");
    if (!f) return;
    f.classList.toggle("has-err", !!msg);
    const p = f.querySelector(".rg-err");
    if (p) p.textContent = msg || "";
  }
  form.addEventListener("input", e => {
    const t = e.target;
    if (t.dataset.f === "mobile") t.value = t.value.replace(/\D/g, "").slice(0, 10);
    const f = t.closest(".rg-field");
    if (f && f.classList.contains("has-err")) setErr(t, "");
    if (t.id === "rg-agree") $("#rg-agree-err").textContent = "";
  });
  $("#rg-agree").addEventListener("change", () => $("#rg-agree-err").textContent = "");

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validate1() {
    let first = null;
    const fail = (el, msg) => { setErr(el, msg); first = first || el; };
    const seen = new Set();
    $$(".rg-att", list).forEach(el => {
      const g = f => el.querySelector(`[data-f="${f}"]`);
      const name = g("name"), email = g("email"), mob = g("mobile"), grp = g("group"), club = g("club"), des = g("designation");
      if (name.value.trim().length < 2) fail(name, "Enter the full name.");
      const em = email.value.trim().toLowerCase();
      if (!EMAIL.test(em)) fail(email, "Please enter a valid mail id.");
      else if (seen.has(em)) fail(email, "Each attendee needs their own email.");
      seen.add(em);
      if (!/^[6-9]\d{9}$/.test(mob.value)) fail(mob, "Enter a valid 10-digit mobile number.");
      if (!grp.value.trim()) fail(grp, "Enter the group.");
      if (club.value.trim().length < 3) fail(club, "Enter the club name.");
      if (!des.value.trim()) fail(des, "Enter your prospective portfolio.");
    });
    if (first) first.focus();
    return !first;
  }
  function validate3() {
    let first = null;
    if (!shot) { $("#rg-file-err").textContent = "Upload the payment screenshot."; $("#rg-drop").closest(".rg-field").classList.add("has-err"); first = $("#rg-file"); }
    const utr = $("#rg-utr");
    utr.value = utr.value.replace(/\s+/g, "");
    if (!/^[A-Za-z0-9]{10,35}$/.test(utr.value)) { setErr(utr, "Enter the UPI transaction ID (usually 12 digits)."); first = first || utr; }
    if (!$("#rg-agree").checked) { $("#rg-agree-err").textContent = "Please confirm to submit."; first = first || $("#rg-agree"); }
    if (first) first.focus();
    return !first;
  }

  /* ---------- collect ---------- */
  function collect() {
    const attendees = $$(".rg-att", list).map(el => {
      const v = f => el.querySelector(`[data-f="${f}"]`).value.trim();
      return { name: v("name"), email: v("email").toLowerCase(), mobile: "+91" + v("mobile"), gender: v("gender"), group: v("group"), club: v("club"), designation: v("designation") };
    });
    return {
      attendees, count: attendees.length, fee: FEE, amount: attendees.length * FEE
    };
  }

  /* ---------- navigation ---------- */
  function goTo(n) {
    if (n > step) {
      if (step === 1 && !validate1()) return;
    }
    step = n;
    $$(".rg-step").forEach(s => s.hidden = +s.dataset.step !== n);
    $$("#rg-progress li").forEach((li, i) => {
      li.classList.toggle("is-active", i + 1 === n);
      li.classList.toggle("is-done", i + 1 < n);
      if (i + 1 === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    $("#rg-bar").style.width = (n / 3 * 100) + "%";
    if (n === 2) renderPay();
    if (n === 3) renderSummary();
    scrollToCard();
    const title = $(`.rg-step[data-step="${n}"] .rg-title`);
    if (title) title.focus({ preventScroll: true });
  }
  function scrollToCard() {
    const top = $("#rg-progress").getBoundingClientRect().top + scrollY - 110;
    if (Math.abs(scrollY - top) < 40) return;
    if (window.__lenis) window.__lenis.scrollTo(top); else scrollTo({ top, behavior: "smooth" });
  }
  form.addEventListener("click", e => {
    const b = e.target.closest("[data-go]");
    if (b) goTo(+b.dataset.go);
  });

  /* ---------- step 2: pay ---------- */
  function renderPay() {
    const d = collect(), n = d.count;
    $("#rg-amount").textContent = inr(d.amount);
    $("#rg-pay-calc").textContent = `${n} attendee${n > 1 ? "s" : ""} × ${inr(FEE)}`;
    const qr = $("#rg-qr");
    if (!UPI_ID) {
      qr.className = "rg-qr is-empty";
      qr.textContent = "Payment QR coming soon. Call Event Secretary Rtr. Gugan (93426 18643) for payment details.";
      $("#rg-upi-row").hidden = true;
      $("#rg-applink").hidden = true;
      return;
    }
    const note = `COLS Skyward ${n} pass${n > 1 ? "es" : ""}`;
    const upi = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${d.amount}.00&cu=INR&tn=${encodeURIComponent(note)}`;
    $("#rg-upi-id").textContent = UPI_ID;
    $("#rg-payee").textContent = PAYEE_NAME;
    $("#rg-applink").href = upi;
    $("#rg-applink").hidden = !/Android|iPhone|iPad/i.test(navigator.userAgent);
    if (window.qrcode) {
      const q = qrcode(0, "M");
      q.addData(upi); q.make();
      qr.className = "rg-qr";
      qr.innerHTML = q.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
      const svg = qr.querySelector("svg");
      if (svg) { svg.setAttribute("role", "img"); svg.setAttribute("aria-label", `UPI QR code to pay ${inr(d.amount)}`); }
    } else {
      // fallback: static QR image (no amount pre-filled)
      qr.className = "rg-qr";
      qr.innerHTML = '<img src="images/upi-qr.png" alt="UPI QR code" style="width:100%;height:auto;display:block">';
      $("#rg-pay-calc").textContent += ". Enter this amount in your UPI app.";
    }
  }
  $("#rg-copy").addEventListener("click", async e => {
    try { await navigator.clipboard.writeText(UPI_ID); e.target.textContent = "Copied"; }
    catch { e.target.textContent = "Copy failed"; }
    setTimeout(() => e.target.textContent = "Copy", 1600);
  });

  /* ---------- step 3: upload ---------- */
  const drop = $("#rg-drop"), file = $("#rg-file");
  function clearFileErr() { $("#rg-file-err").textContent = ""; drop.closest(".rg-field").classList.remove("has-err"); }
  async function takeFile(f) {
    clearFileErr();
    if (!f) return;
    if (!/^image\//.test(f.type)) { $("#rg-file-err").textContent = "Please upload an image (PNG or JPG)."; return; }
    if (f.size > 8 * 1024 * 1024) { $("#rg-file-err").textContent = "That image is over 8 MB. Try a smaller screenshot."; return; }
    try {
      const url = await compress(f);
      shot = { name: f.name, type: "image/jpeg", data: url.split(",")[1] };
      $("#rg-preview").src = url;
      $("#rg-file-name").textContent = f.name;
      drop.classList.add("has-file");
    } catch {
      $("#rg-file-err").textContent = "Couldn't read that image. Try another screenshot.";
    }
  }
  function compress(f) {
    return new Promise((res, rej) => {
      const img = new Image(), u = URL.createObjectURL(f);
      img.onload = () => {
        const max = 1600, k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const x = c.getContext("2d");
        x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
        x.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u);
        res(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(u); rej(); };
      img.src = u;
    });
  }
  file.addEventListener("change", () => takeFile(file.files[0]));
  ["dragenter", "dragover"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach(t => drop.addEventListener(t, () => drop.classList.remove("is-over")));
  drop.addEventListener("drop", e => { e.preventDefault(); takeFile(e.dataTransfer.files[0]); });

  function renderSummary() {
    const d = collect();
    $("#rg-sum-list").innerHTML =
      d.attendees.map((a, i) => `<li><span>${i + 1}. ${esc(a.name)} · ${esc(a.club)} (${esc(a.group)})${a.designation ? " · " + esc(a.designation) : ""}</span><b>${inr(FEE)}</b></li>`).join("");
    $("#rg-sum-total").textContent = inr(d.amount);
    $("#rg-agree-amt").textContent = inr(d.amount);
  }

  /* ---------- submit ---------- */
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (step < 3) { goTo(step + 1); return; }   // Enter key on earlier steps = Continue
    if (sending || !validate3()) return;
    sending = true;
    const btn = $("#rg-submit"), err = $("#rg-submit-err");
    err.textContent = "";
    btn.disabled = true; btn.textContent = "Submitting…";
    const d = collect();
    const ref = "COLS-" + Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();
    const payload = { ...d, ref, utr: $("#rg-utr").value, submittedAt: new Date().toISOString(), screenshot: shot };
    try {
      if (SUBMIT_URL) {
        const r = await fetch(SUBMIT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
        const out = await r.json().catch(() => ({ ok: r.ok }));
        if (!r.ok || out.ok === false) throw new Error(out.error || r.status);
      } else {
        await new Promise(r => setTimeout(r, 700));
      }
      showDone(d, ref);
    } catch (ex) {
      err.textContent = "Couldn't submit right now. Check your connection and try again. Your payment is safe; don't pay again.";
      btn.disabled = false; btn.textContent = "Submit registration";
      sending = false;
    }
  });
  function showDone(d, ref) {
    form.hidden = true;
    $$("#rg-progress li").forEach(li => { li.classList.remove("is-active"); li.classList.add("is-done"); li.removeAttribute("aria-current"); });
    $("#rg-bar").style.width = "100%";
    $("#rg-ref").textContent = ref;
    $("#rg-done-list").innerHTML = d.attendees.map(a => `<li><b>${esc(a.name)}</b><span>${esc(a.email)}</span></li>`).join("");
    $("#rg-demo").hidden = !!SUBMIT_URL;
    $("#rg-done").hidden = false;
    scrollToCard();
    $("#rg-done .rg-title").focus({ preventScroll: true });
  }
})();
