/* ===== EDIT HERE ===== */
// Paste your Google Form link between the quotes to switch on registration.
const REGISTER_URL = "";
const EVENT_START = new Date("2026-10-13T09:30:00+05:30");

const SESSIONS = [
  {n:1, phase:"Pre-Event", mod:"Module 1", title:"Pre-Event Strategy (Part I)", sub:"Need & Conceptualization",
   focus:["Identifying the core need / problem statement","Setting SMART goals & KPIs","Designing target-audience centric concepts","Venue, date & logistics mapping"]},
  {n:2, phase:"Pre-Event", mod:"Module 2", title:"Pre-Event Strategy (Part II)", sub:"Finance, Sponsorship & Invites",
   focus:["Zero-based budgeting & contingency planning","Crafting winning sponsorship pitches & decks","Chief Guest / dignitary protocols & invites timeline","Marketing & design timelines"]},
  {brk:"Tea & Networking Break", note:"15 mins"},
  {n:3, phase:"D-Day", mod:"Module 3", title:"Event Execution (D-Day)", sub:"Run-of-Show & Crisis Management",
   focus:["Minute-by-Minute Execution Plan (MEP)","Role delegation & team command structure","Guest handling, stage management & tech checks","Real-time crisis & backup protocols (Plan B)"]},
  {brk:"Lunch Break"},
  {n:4, phase:"Post-Event", mod:"Module 4", title:"Post-Event Mechanics", sub:"Gratitude, Docs & Impact",
   focus:["Post-event reporting & Rotaract documentation","Settling accounts & financial transparency","Sponsor gratitude & relationship retention","Feedback loops & impact assessment"]},
  {n:5, phase:"Live Workshop", mod:"Module 5", title:"The War Room", sub:"Interactive Hackathon", war:true,
   focus:["Division into 3–4 teams","A surprise event brief: plan the full PEP in 25 mins","5-minute pitches","Trainer feedback"]},
  {brk:"Wrap-up & Close", note:"Certificate distribution & closing remarks", time:"16:00"}
];
// Info Hub cards. Edit the text, or replace "To be announced" when details are final.
// icon: pin | clock | shirt | parking | award | phone
const INFO = [
  {icon:"pin", title:"Venue Map", text:"<b>Sri Ramakrishna College of Arts &amp; Science</b><br>Avinashi Road, between Fun Mall &amp; Lakshmi Mills Bus Stop, Nava India Rd, Peelamedu, Coimbatore, Tamil Nadu 641006",
   link:{label:"Get directions", url:"https://maps.app.goo.gl/21EFQdrp6HhQzMbj7"}},
  {icon:"clock", title:"Reporting Time", text:"Check-in opens before the seminar starts at <b>09:30</b> on Tue, 13 October. Sessions close at 16:00."},
  {icon:"shirt", title:"Dress Code", text:"<b>Formal</b> attire for all attendees."},
  {icon:"parking", title:"Parking", text:"Park at the <b>Sri Ramakrishna College of Arts &amp; Science boys parking</b>."},
  {icon:"award", title:"Certificate", text:"Every attendee receives a <b>certificate of participation</b> at the closing session."},
  {icon:"phone", title:"Help & Contact", text:"Questions about the event or registration? Call Event Chair <b>Rtr. Athulya</b> (<a href=\"tel:+919345788685\">93457 88685</a>) or Event Secretary <b>Rtr. Gugan</b> (<a href=\"tel:+919342618643\">93426 18643</a>).",
   link:{label:"Contact the team", url:"contact.html", internal:true}}
];

// Home page announcements (newest first). Add, edit or remove entries here.
const ANNOUNCEMENTS = [
  {tag:"Registration", date:"2026-09-30", title:"Registrations opening soon", text:"The registration form for COLS Skyward goes live shortly. Keep your board's details ready."},
  {tag:"Venue", date:"2026-09-30", title:"Venue confirmed: SRCAS, Peelamedu", text:"COLS Skyward will be held at Sri Ramakrishna College of Arts & Science, Avinashi Road, Coimbatore."},
  {tag:"Trainers", date:"2026-09-30", title:"Trainers to be announced", text:"Each masterclass will be led by an experienced Rotaractor. Names will be revealed here."},
  {tag:"Info", date:"2026-09-30", title:"Dress code & parking details coming", text:"Check the Info Hub for the latest on dress code, parking and what to bring."}
];
/* ===================== */

const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const tl = document.getElementById("timeline");
if (tl) {

let html = `<div class="marker"><time>09:30</time>Seminar begins</div>`;
for (const s of SESSIONS) {
  if (s.brk) {
    html += `<div class="marker">${s.time ? `<time>${s.time}</time>` : ""}${esc(s.brk)}${s.note ? ` <span style="text-transform:none;letter-spacing:0;font-weight:500">· ${esc(s.note)}</span>` : ""}</div>`;
    continue;
  }
  html += `<article class="stop"><div class="session${s.war ? " war" : ""}">
    <div class="num" aria-hidden="true">0${s.n}</div>
    <div class="s-meta"><span class="s-mod">Session ${s.n} · ${esc(s.mod)}</span><span class="chip${s.war ? " gold" : ""}">${esc(s.phase)}</span></div>
    <h3>${esc(s.title)}<em>${esc(s.sub)}</em></h3>
    <div class="focus"><span class="eyebrow" style="font-size:10px">Core focus &amp; key deliverables</span>
      <ul>${s.focus.map(f => `<li>${esc(f)}</li>`).join("")}</ul></div>
    <div class="trainer"><span class="av">${s.photo ? `<img src="${esc(s.photo)}" alt="${esc(s.trainer || "Trainer")}" loading="lazy">` : `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`}</span><span>Trainer: <b>${esc(s.trainer || "To be announced")}</b></span></div>
  </div></article>`;
}
tl.innerHTML = html;
}

// Info Hub
const ICONS = {
  pin:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shirt:'<path d="M8 3 3 6l2 5 3-1v11h8V10l3 1 2-5-5-3a4 4 0 0 1-8 0z"/>',
  parking:'<circle cx="12" cy="12" r="9"/><path d="M10 17V7h3a3 3 0 0 1 0 6h-3"/>',
  award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
  phone:'<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2z"/>'
};
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ig = document.getElementById("info-grid");
if (ig) ig.innerHTML = INFO.map(c => `<article class="icard">
  <div class="icon">${svg(ICONS[c.icon] || ICONS.pin)}</div>
  <h3>${esc(c.title)}</h3>
  <p>${c.text}</p>${c.tba ? `<span class="tba">To be announced</span>` : ""}
  ${c.link ? (c.link.internal
    ? `<a class="ilink" href="${esc(c.link.url)}">${esc(c.link.label)} ${svg('<path d="M5 12h14M13 6l6 6-6 6"/>')}</a>`
    : `<a class="ilink" href="${esc(c.link.url)}" target="_blank" rel="noopener">${esc(c.link.label)} ${svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>')}</a>`) : ""}
</article>`).join("");

// Home: announcements
const ng = document.getElementById("news-grid");
if (ng) ng.innerHTML = ANNOUNCEMENTS.map(a => `<article class="news"><div class="news-top"><span>${esc(a.tag)}</span><time datetime="${esc(a.date)}">${esc(a.date)}</time></div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`).join("");

// Registration links
document.querySelectorAll(".js-register").forEach(a => {
  if (REGISTER_URL) { a.href = REGISTER_URL; a.target = "_blank"; a.rel = "noopener"; }
});
if (!REGISTER_URL) {
  const main = document.getElementById("reg-main");
  if (main) {
    main.textContent = "Registration opening soon";
    main.setAttribute("aria-disabled", "true");
    main.addEventListener("click", e => e.preventDefault());
    document.getElementById("reg-note").hidden = false;
  }
}

// Countdown
const pad = n => String(n).padStart(2, "0");
function tick(){
  let ms = EVENT_START - Date.now();
  if (ms <= 0) {
    document.getElementById("countdown").innerHTML = `<div class="cd" style="padding-inline:18px"><b style="font-size:20px">${Date.now() < EVENT_START.getTime() + 6.5*3600e3 ? "Happening now" : "Thank you for joining"}</b></div>`;
    return;
  }
  const d = Math.floor(ms/864e5); ms -= d*864e5;
  const h = Math.floor(ms/36e5); ms -= h*36e5;
  const m = Math.floor(ms/6e4); ms -= m*6e4;
  const s = Math.floor(ms/1e3);
  document.getElementById("cd-d").textContent = pad(d);
  document.getElementById("cd-h").textContent = pad(h);
  document.getElementById("cd-m").textContent = pad(m);
  document.getElementById("cd-s").textContent = pad(s);
  setTimeout(tick, 1000);
}
if (document.getElementById("countdown")) tick();
// Navbar: shadow on scroll + mobile menu
(() => {
  const header = document.getElementById("site-header");
  const btn = document.getElementById("menu-btn");
  const setMenu = open => { header.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); btn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };
  btn.addEventListener("click", () => setMenu(!header.classList.contains("open")));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, {passive:true}); onScroll();
})();

// Page transitions
// Modern browsers: native cross-page View Transition (see style.css), so links are left alone.
// Older browsers: quick fade of the content, then open the next page.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const native = !!window.CSSViewTransitionRule;
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = a.getAttribute("href");
    if (a.target === "_blank" || !/\.html(#.*)?$/.test(href) || href.includes("://")) return;
    if (a.getAttribute("aria-current") === "page") { e.preventDefault(); return; }
    if (native || reduce) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => { location.href = a.href; }, 220);
  });
  // Coming back with the browser Back button: show the page again
  addEventListener("pageshow", e => { if (e.persisted) document.body.classList.remove("leaving"); });
})();


// Apple-style scroll reveal: elements rise and fade in as they enter the screen
(() => {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const sel = "main section h2, main section .lead, .sec-head, .h-stats > div, .icard, .hstep, .h-feature, .news, .stop, .phase, .for, .people, .club, .reg, .step";
  const els = [...document.querySelectorAll(sel)].filter(el => !el.closest(".h-hero") && !el.parentElement.closest(".reveal"));
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, {threshold: .12, rootMargin: "0px 0px -40px 0px"});
  els.forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.matches(sel));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i, 5) * 80 + "ms";
    el.classList.add("reveal"); io.observe(el);
  });
  // content generated after load (schedule, info cards, news) gets observed too
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
    if (n.nodeType === 1 && n.matches(sel) && !n.classList.contains("reveal")) { n.classList.add("reveal"); io.observe(n); }
  }))).observe(document.querySelector("main") || document.body, {childList: true, subtree: true});
})();
