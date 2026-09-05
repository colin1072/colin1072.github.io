/**
 * ============================================================
 *  主脚本 — 依赖 config.js 中的 CONFIG 全局对象
 * ============================================================
 */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer  = matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ============================================================
   本地背景图加载
   优先读取 photos/photos.json 清单，失败则尝试目录索引
   ============================================================ */
let BG = [];

async function loadPhotos() {
  const { folder, manifest, images } = CONFIG.photos;

  // 方式一：读取 photos/photos.json 清单
  try {
    const res = await fetch(manifest);
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        const result = list
          .filter(name => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(name))
          .map(name => `${folder}/${name}`)
          .sort();
        if (result.length > 0) {
          console.log(`[photos] 从清单加载了 ${result.length} 张背景图`);
          return result;
        }
      }
    }
  } catch (_) { /* file:// 协议或清单不存在 */ }

  // 方式二：使用配置中直接列出的图片
  if (images && images.length > 0) {
    const result = images
      .filter(name => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(name))
      .map(name => `${folder}/${name}`)
      .sort();
    if (result.length > 0) {
      console.log(`[photos] 从配置加载了 ${result.length} 张背景图`);
      return result;
    }
  }

  // 方式三：使用备用背景
  console.warn('[photos] 本地图片读取失败，使用备用背景');
  return CONFIG.fallbackBg;
}

/* ============================================================
   背景轮播
   ============================================================ */
const layers = [document.getElementById('bgA'), document.getElementById('bgB')];
let cur = 0, bgIdx = 0, rotateTimer = null;

function showBg(url) {
  const next = layers[1 - cur], img = new Image();
  img.onload = () => {
    next.style.backgroundImage = `url("${url}")`;
    next.classList.add('show');
    layers[cur].classList.remove('show');
    cur = 1 - cur;
    // 预加载下一张
    const nextIdx = (bgIdx + 1) % BG.length;
    new Image().src = BG[nextIdx];
  };
  img.src = url;
}

function startRotation() {
  if (rotateTimer) clearInterval(rotateTimer);
  if (BG.length <= 1) return;
  rotateTimer = setInterval(() => {
    bgIdx = (bgIdx + 1) % BG.length;
    showBg(BG[bgIdx]);
  }, CONFIG.bgRotateInterval);
}

/* ============================================================
   全屏转场动画
   ============================================================ */
const transition = document.getElementById('pageTransition');
const ptLabel    = document.getElementById('ptLabel');
let isTransitioning = false;

function navigateWithTransition(href, label, target) {
  if (isTransitioning) return;
  isTransitioning = true;

  ptLabel.textContent = label;
  transition.classList.add('active');

  setTimeout(() => {
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener');
      setTimeout(() => {
        transition.classList.remove('active');
        isTransitioning = false;
      }, 400);
    } else {
      window.location.href = href;
    }
  }, 750);
}

// 拦截导航链接点击
document.querySelectorAll('nav .link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const href   = this.href;
    const label  = this.querySelector('.zh').textContent;
    const target = this.getAttribute('target') || '_self';
    navigateWithTransition(href, label, target);
  });
});

/* ============================================================
   开场加载
   ============================================================ */
const pre = document.getElementById('preloader');
let preHidden = false;
const startTime = Date.now();

function hidePre() {
  if (preHidden) return; preHidden = true;
  const wait = Math.max(0, CONFIG.preloaderMinShow - (Date.now() - startTime));
  setTimeout(() => {
    pre.classList.add('hide');
    document.body.classList.add('loaded');
  }, wait);
}

/* ============================================================
   初始化
   ============================================================ */
(async function init() {
  BG = await loadPhotos();
  bgIdx = Math.floor(Math.random() * BG.length);

  showBg(BG[bgIdx]);
  startRotation();

  const firstImg = new Image();
  firstImg.onload  = hidePre;
  firstImg.onerror = hidePre;
  firstImg.src = BG[bgIdx];
  setTimeout(hidePre, CONFIG.preloaderTimeout);
})();

/* ============================================================
   时钟
   ============================================================ */
const pad = n => String(n).padStart(2, '0');
function tick() {
  const d = new Date();
  document.getElementById('clock').textContent =
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
tick();
setInterval(tick, 1000);

/* ============================================================
   问候语
   ============================================================ */
document.getElementById('greeting').textContent = CONFIG.getGreeting();

/* ============================================================
   引言轮换
   ============================================================ */
const quoteEl = document.getElementById('quote');
let qIdx = Math.floor(Math.random() * CONFIG.quotes.length);
quoteEl.textContent = CONFIG.quotes[qIdx];
setInterval(() => {
  quoteEl.style.opacity = 0;
  setTimeout(() => {
    qIdx = (qIdx + 1) % CONFIG.quotes.length;
    quoteEl.textContent = CONFIG.quotes[qIdx];
    quoteEl.style.opacity = 1;
  }, 1000);
}, CONFIG.quoteInterval);

/* ============================================================
   鼠标视差 + 自定义光标
   ============================================================ */
if (!reduceMotion) {
  const wrap  = document.getElementById('parallaxBg');
  const inner = document.getElementById('mainInner');
  const ring  = document.getElementById('cursorRing');
  const dot   = document.getElementById('cursorDot');

  let tx = 0, ty = 0, cx = 0, cy = 0;
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  addEventListener('mousemove', e => {
    tx = (e.clientX / innerWidth  - .5) * 2;
    ty = (e.clientY / innerHeight - .5) * 2;
    mx = e.clientX; my = e.clientY;
    if (finePointer) {
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    }
  });

  document.addEventListener('mouseover', e => {
    if (finePointer) ring.classList.toggle('hover', !!e.target.closest('a'));
  });

  (function loop() {
    cx += (tx - cx) * .06; cy += (ty - cy) * .06;
    wrap.style.transform  = `translate(${cx * 18}px,${cy * 18}px)`;
    inner.style.transform = `translate(${cx * -8}px,${cy * -8}px)`;
    if (finePointer) {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    }
    requestAnimationFrame(loop);
  })();
}
