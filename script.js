/* =========================================
   script.js — สำหรับ landing หน้านี้
   อ้างอิงกับ HTML/CSS ด้านบน
   ========================================= */

/* ---------- Helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Global (เผื่อสคริปต์อื่นใช้ต่อ) ---------- */
let liffReady = false;
let inLiff    = false;

/* ---------- LIFF (safe init) ---------- */
function initLIFF() {
  const LIFF_ID = "2007908663-NawZjDxL"; // ของเดิมคุณ
  try {
    if (window.liff && typeof liff.init === "function") {
      liff.init({ liffId: LIFF_ID })
        .then(() => {
          liffReady = true;
          inLiff = !!liff.isInClient();
          // เก็บไว้บน window เผื่อสคริปต์อื่นจะใช้
          window.liffReady = liffReady;
          window.inLiff = inLiff;
        })
        .catch(() => {
          liffReady = false;
          inLiff = false;
        });
    }
  } catch (err) {
    console.warn("LIFF init skipped:", err);
  }
}

/* ---------- Smooth scroll สำหรับลิงก์ภายในหน้า ---------- */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    const href = a.getAttribute("href");
    // ถ้าเป็น "#" อย่างเดียวให้ปล่อยไป เดี๋ยวเราเอาไปใช้เป็น CTA อย่างอื่น
    if (!href || href === "#") return;

    a.addEventListener("click", ev => {
      const target = document.querySelector(href);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ---------- CTA → LINE / LIFF (ปุ่ม footer) ---------- */
function initFooterCTA() {
  const footerBtn = document.querySelector(".footer .btn-primary");
  if (!footerBtn) return;

  const OA = "@717xokfa"; // ของเดิม
  const ADD_FRIEND = "https://line.me/R/ti/p/" + encodeURIComponent(OA);

  footerBtn.addEventListener("click", ev => {
    // ปุ่มนี้ใน HTML เป็น href="#" อยู่แล้ว
    ev.preventDefault();

    const text = "ขอดูตัวอย่างระบบ InginiaOS ให้เหมาะกับธุรกิจของฉัน";

    // ถ้าเปิดใน LIFF และส่งได้ ให้ส่งเลย
    if (liffReady && inLiff && window.liff && typeof liff.sendMessages === "function") {
      liff.sendMessages([{ type: "text", text }])
        .then(() => {
          alert("ส่งคำขอเรียบร้อย ✅ ทีมงานจะติดต่อกลับใน LINE");
        })
        .catch(err => {
          console.error("LIFF send failed:", err);
          // ถ้าสendไม่สำเร็จให้เด้งไปหน้าแอดเพื่อนแทน
          window.location.href = ADD_FRIEND;
        });
    } else {
      // ไม่ได้อยู่ใน LIFF → ให้ไปหน้าเพิ่มเพื่อน
      window.location.href = ADD_FRIEND;
    }
  });
}

/* ---------- ปรับเนวิเกชันให้สวยเวลาย่อ (ถ้าคุณจะเติมภายหลัง) ---------- */
/* ตอนนี้ HTML ยังไม่มีเมนูมือถือแบบ burger เลยยังไม่ต้องทำอะไรตรงนี้ */

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initLIFF();
  initSmoothScroll();
  initFooterCTA();
});
document.addEventListener("DOMContentLoaded", () => {
  const dbSection = document.querySelector(".inginia-db");
  const btn = dbSection?.querySelector(".btn-readmore");
  if (!dbSection || !btn) return;

  btn.addEventListener("click", () => {
    dbSection.classList.add("expanded");
    window.scrollTo({
      top: dbSection.offsetTop - 40,
      behavior: "smooth"
    });
  });
});
