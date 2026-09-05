/**
 * ============================================================
 *  站点配置文件
 *  修改这里即可自定义站点内容，无需改动 HTML / CSS / JS
 * ============================================================
 */

const CONFIG = {

  /* ---------- 站点信息 ---------- */
  site: {
    name:       'Colin',                                        // 昵称（页面多处使用）
    title:      'Colin · 个人空间',                              // 浏览器标签标题
    description:'Colin的个人空间 — 博客 · 摄影 · 代码',           // meta description
    role:       '开发者 ／ 摄影爱好者 ／ 记录者',                  // 角色描述
    copyright:  '© 2026 Colin',                                 // 页脚版权
    motto:      '步履不停 · 初心不忘',                            // 页脚标语
    preloaderTip: '正在进入',                                    // 加载动画提示文字
    transitionTip:'正在前往',                                    // 转场动画提示文字
  },

  /* ---------- 导航链接 ---------- */
  // type: 'link'  → 跳转外链（默认）
  // type: 'modal' → 点击弹窗展示 content（支持多行，用 \n 分隔）
  nav: [
    { zh: '博客', en: 'Blog',       href: 'https://blog.colin8.cn/' },
    { zh: '摄影', en: 'Photo',      href: 'https://94iphotograph.lofter.com/' },
    { zh: '代码', en: 'GitHub',     href: 'https://github.com/lin819747263' },
    { zh: '简历', en: 'Resume',     href: './resume.pdf' },
    { zh: '公众号', en: 'Official', type: 'modal', content: '帅果', qrcode: 'photos/qrcode.jpg' },
  ],

  /* ---------- 背景图片源 ---------- */
  photos: {
    folder:   'photos',               // 本地图片文件夹路径
    manifest: 'photos/photos.json',   // 图片清单（fetch 方式读取）

    // 直接列出图片文件名（file:// 协议或 fetch 失败时的兜底）
    // 改动图片后请同步修改此处
    images: [
      '1.png',
      '2.png',
    ],
  },

  /* ---------- 备用背景图（本地读取失败时使用） ---------- */
  fallbackBg: [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80',
  ],

  /* ---------- 轮播引言 ---------- */
  quotes: [
    '代码之外，生活亦有诗意。',
    '用镜头捕捉光影，用文字记录热爱。',
    '愿你走出半生，归来仍是少年。',
    '热爱可抵岁月漫长。',
    '保持专注，保持好奇，保持谦逊。',
    '山海自有归期，风雨自有相逢。',
  ],

  /* ---------- 时间与行为 ---------- */
  bgRotateInterval: 30000,   // 背景轮播间隔（毫秒）
  quoteInterval:    12000,   // 引言轮换间隔（毫秒）
  preloaderMinShow: 1500,    // 加载动画最短显示时间（毫秒）
  preloaderTimeout: 3800,    // 加载动画兜底超时（毫秒）

  /* ---------- 问候语 ---------- */
  greetingSuffix: '· WELCOME TO MY WORLD',
  getGreeting() {
    const h = new Date().getHours();
    const g = h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 13 ? '中午好'
            : h < 18 ? '下午好' : '晚上好';
    return `${g} ${this.greetingSuffix}`;
  },
};
