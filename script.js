/* =========================================
   script.js — MERGED (your original + new CTA)
   ========================================= */

/* ---------- Helpers ---------- */
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* ---------- Global state ---------- */
let selectedAddons = [];
let liffReady = false;
let inLiff = false;

/* ---------- LIFF (safe init) ---------- */
function initLIFF(){
  const LIFF_ID = "2007908663-lMDAab9y";
  try{
    if (window.liff && typeof liff.init === "function"){
      liff.init({ liffId: LIFF_ID }).then(() => {
        liffReady = true;
        inLiff = !!liff.isInClient();
        // สำคัญ: ผูกขึ้น window ให้ hero-patch ตอนท้ายมองเห็น
        window.liffReady = liffReady;
        window.inLiff = inLiff;
      }).catch(() => {
        liffReady = false;
        inLiff = false;
        window.liffReady = false;
        window.inLiff = false;
      });
    }else{
      liffReady = false;
      inLiff = false;
      window.liffReady = false;
      window.inLiff = false;
    }
  }catch(e){
    liffReady = false; inLiff = false;
    window.liffReady = false; window.inLiff = false;
    console.warn("LIFF init skipped:", e);
  }
}

/* ---------- Add-ons selection ---------- */
function initAddonSelection(){
  $$(".select-addon").forEach(btn => {
    if (btn.__bind) return; btn.__bind = true;
    btn.addEventListener("click", () => {
      const addon = btn.getAttribute("data-addon");
      if (!addon) return;
      if (!selectedAddons.includes(addon)){
        selectedAddons.push(addon);
        btn.textContent = "เลือกแล้ว ✓";
        btn.classList.add("selected");
        btn.disabled = true;
      }
    });
  });
}

/* ---------- Tabs (Pricing) ---------- */
function initTabs(){
  $$(".tab").forEach(tab => {
    if (tab.__bind) return; tab.__bind = true;
    tab.addEventListener("click", () => {
      $$(".tab").forEach(t => t.classList.remove("active"));
      $$(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      const pane = $("#" + tab.dataset.tab);
      if (pane) pane.classList.add("active");
    });
  });
}

/* ---------- FAQ toggle ---------- */
function initFAQ(){
  $$(".faq-question").forEach(btn => {
    if (btn.__bind) return; btn.__bind = true;
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (item) item.classList.toggle("active");
    });
  });
}

/* ---------- Exclusive toggle (ดูสิทธิ์พิเศษ) ---------- */
function initExclusive(){
  const toggle = $("#toggleExclusive");
  const box = $("#exclusiveBox");
  if (!toggle || !box) return;
  if (toggle.__bind) return; toggle.__bind = true;

  toggle.addEventListener("click", () => {
    box.classList.toggle("show");
    toggle.textContent = box.classList.contains("show") ? "ซ่อนสิทธิ์พิเศษ" : "ดูสิทธิ์พิเศษ";
  });
}

/* ---------- Reveal (Intro → Content) ---------- */
function initReveal(){
  const btn = $("#revealContent");
  if (!btn || btn.__bind) return; btn.__bind = true;

  btn.addEventListener("click", () => {
    document.body.classList.remove("intro-hide");

    const ids = [
      "system-gap","memory-gap","engine-gap","stage-progress",
      "solution","agency-killer","proof-cases","pricing",
      "closing","note","faq"
    ];
    ids.forEach((id,i) => {
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.classList.add("visible"), i*120);
    });

    if (window.AOS && typeof AOS.refreshHard === "function"){
      setTimeout(() => AOS.refreshHard(), 60);
    }

    const target = document.getElementById("system-gap") || document.getElementById("solution");
    if (target) target.scrollIntoView({ behavior:"smooth", block:"start" });

    btn.style.display = "none";
  });
}

/* ---------- Comparison toggle (ทำงานได้แม้ถูกซ่อน) ---------- */
function initComparisonGuard(){
  const btn = $("#toggleComparison");
  const table = $("#comparisonTable");
  if (!btn || !table) return;
  if (btn.__bind) return; btn.__bind = true;

  btn.addEventListener("click", () => {
    const show = table.style.display === "none" || getComputedStyle(table).display === "none";
    table.style.display = show ? "block" : "none";
    btn.textContent = show ? "ซ่อนตารางเปรียบเทียบ" : "ดูตารางเปรียบเทียบ";
  });
}

/* =======================================================
   CTA (Delegated) — เวอร์ชั่นรวม
   ครอบคลุม:
   - hero:           #top .cta-buy
   - สมัครแพ็กเกจ:  .subscribeBase, .plan-cta.subscribeBase
   - ปุ่มใน card ใหม่: #requestQuoteInline
   - ปุ่ม add-ons:   #requestQuote
   - ปุ่มสิทธิ์พิเศษ: #exclusiveBtn
   ======================================================= */
function initCTADelegated(){
  const OA = "@717xokfa";
  const ADD_FRIEND = "https://line.me/R/ti/p/" + encodeURIComponent(OA);
  const DEFAULT_PLAN = "InginiaOS Starter (8,800฿ / เดือน)";

  document.addEventListener("click", function(ev){
    const heroBtn     = ev.target.closest("#top .cta-buy");
    const subBtn      = ev.target.closest(".subscribeBase, .plan-cta.subscribeBase, .cta-line.subscribeBase");
    const quoteBtn    = ev.target.closest("#requestQuote");
    const quoteInline = ev.target.closest("#requestQuoteInline");
    const f10Btn      = ev.target.closest("#exclusiveBtn");

    if (!heroBtn && !subBtn && !quoteBtn && !quoteInline && !f10Btn) return;
    ev.preventDefault();

    const sendOrGo = (text) => {
      if (liffReady && inLiff && window.liff){
        liff.sendMessages([{ type:"text", text }])
          .then(() => alert("ส่งข้อความสำเร็จ ✅ ทีมงานจะติดต่อกลับ"))
          .catch(err => { console.error(err); window.location.href = ADD_FRIEND; });
      }else{
        window.location.href = ADD_FRIEND;
      }
    };

    // 1) ปุ่มขอใบเสนอราคาในแท็บ Add-ons
    if (quoteBtn){
      const basePlan = DEFAULT_PLAN;
      const text = "ฉันสนใจ:\n" + basePlan + "\n\nAdd-ons:\n" +
        (selectedAddons.length ? selectedAddons.join("\n") : "ไม่มี");
      sendOrGo(text);
      return;
    }

    // 2) ปุ่มคุยก่อนใน card หลัก
    if (quoteInline){
      const text = "ขอปรึกษาแพ็กเกจ inginiaOS ก่อนตัดสินใจ\n" +
        "แพ็กเกจหลัก: " + DEFAULT_PLAN +
        (selectedAddons.length ? ("\nAdd-ons ที่เลือกไว้:\n" + selectedAddons.join("\n")) : "");
      sendOrGo(text);
      return;
    }

    // 3) ปุ่มสิทธิ์พิเศษ (ถ้ามีในหน้า)
    if (f10Btn){
      sendOrGo("รับสิทธิ์ Founding 10");
      return;
    }

    // 4) heroBtn / ปุ่มสมัครทั้งหมด
    if (heroBtn || subBtn){
      const btn  = heroBtn || subBtn;
      const plan = btn.dataset.plan || DEFAULT_PLAN;
      const text = "ฉันสนใจแพ็กเกจหลัก:\n" + plan;
      sendOrGo(text);
      return;
    }
  }, false);
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // เดิมคุณซ่อนช่วงยาวไว้ก่อน
  document.body.classList.add("intro-hide");

  initLIFF();
  initAddonSelection();
  initTabs();
  initFAQ();
  initExclusive();
  initReveal();
  initCTADelegated();
  initComparisonGuard();
});

/* =========================================================
   HERO CTA — GUARANTEED CLICK PATCH (non-breaking)
   (อันนี้เก็บของเดิมคุณไว้ แต่ตอนต้นเรา set window.liffReady แล้ว)
   ========================================================= */
(function(){
  const OA = "@717xokfa";
  const ADD_FRIEND = "https://line.me/R/ti/p/" + encodeURIComponent(OA);

  function sendOrRedirect(text){
    try{
      if (window.liff &&
          typeof liff.sendMessages === "function" &&
          window.liffReady &&
          window.inLiff){
        liff.sendMessages([{ type:"text", text }])
          .then(()=>alert("ส่งข้อความสำเร็จ ✅ ทีมงานจะติดต่อกลับ"))
          .catch(()=>{ window.location.href = ADD_FRIEND; });
      }else{
        window.location.href = ADD_FRIEND;
      }
    }catch(e){
      window.location.href = ADD_FRIEND;
    }
  }

  function bindHeroCTA(){
    const heroBtn = document.querySelector("#top .cta-buy");
    if (!heroBtn || heroBtn.__heroBound) return;
    heroBtn.__heroBound = true;

    const handler = (ev)=>{
      ev.preventDefault();
      ev.stopPropagation();
      const text = "ฉันสนใจแพ็กเกจหลัก:\nInginiaOS Starter (8,800฿ / เดือน)";
      sendOrRedirect(text);
      return false;
    };

    heroBtn.addEventListener("click", handler, {capture:true});
    heroBtn.addEventListener("pointerup", handler, {capture:true});
    heroBtn.addEventListener("touchend", handler, {capture:true});
  }

  function guardOverlays(){
    const heroBtn = document.querySelector("#top .cta-buy");
    if (!heroBtn) return;

    const btnRect = heroBtn.getBoundingClientRect();
    const samplePoints = [
      [btnRect.left + btnRect.width*0.5, btnRect.top + btnRect.height*0.5],
      [btnRect.left + btnRect.width*0.2, btnRect.top + btnRect.height*0.5],
      [btnRect.right - btnRect.width*0.2, btnRect.top + btnRect.height*0.5]
    ];

    const suspects = [
      document.getElementById("revealContent"),
      document.querySelector(".sticky-attention"),
    ].filter(Boolean);

    samplePoints.forEach(([x,y])=>{
      const el = document.elementFromPoint(x, y);
      if (el && el !== heroBtn && !heroBtn.contains(el)) {
        const blocker = suspects.find(s => s && (s === el || s.contains(el)));
        if (blocker) blocker.classList.add("pe-none");
      }
    });
  }

  function globalRescue(ev){
    const heroBtn = document.querySelector("#top .cta-buy");
    if (!heroBtn) return;
    const r = heroBtn.getBoundingClientRect();
    const x = ev.clientX, y = ev.clientY;
    const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    if (!inside) return;

    if (ev.target !== heroBtn && !heroBtn.contains(ev.target)) {
      ev.preventDefault();
      ev.stopPropagation();
      const text = "ฉันสนใจแพ็กเกจหลัก:\nInginiaOS Starter (8,800฿ / เดือน)";
      sendOrRedirect(text);
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    bindHeroCTA();
    guardOverlays();
  });

  window.addEventListener("scroll", guardOverlays, {passive:true});
  window.addEventListener("resize", guardOverlays);
  document.addEventListener("click", globalRescue, true);
  document.addEventListener("pointerup", globalRescue, true);

  setTimeout(()=>{ bindHeroCTA(); guardOverlays(); }, 0);
})();
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#process.timeline-section');
  const btn = section?.querySelector('.timeline-toggle');

  if (!section || !btn) return;

  const updateLabel = () => {
    if (section.classList.contains('is-collapsed')) {
      btn.textContent = 'ดูว่าเราทำอะไรใน 48 ชั่วโมง ?';
    } else {
      btn.textContent = 'ซ่อนรายละเอียด 48 ชั่วโมงแรก';
    }
  };

  updateLabel();

  btn.addEventListener('click', () => {
    section.classList.toggle('is-collapsed');
    updateLabel();
  });
});
