import fs from 'fs';

function ensureCss() {
  const f = 'app/globals.css';
  if (!fs.existsSync(f)) return;
  let css = fs.readFileSync(f, 'utf8');
  const marker = '/* --- UI Polish bundle --- */';
  if (css.includes(marker)) return;

  const block = `
${marker}
.page-fade{opacity:0;transform:translateY(6px);transition:opacity .35s ease,transform .35s ease}
.page-fade--in{opacity:1;transform:none}
.skeleton{position:relative;overflow:hidden;background:linear-gradient(to right, rgba(0,0,0,.06) 0%, rgba(0,0,0,.08) 20%, rgba(0,0,0,.06) 40%);background-size:200% 100%;animation:skeleton-move 1.2s linear infinite}
@keyframes skeleton-move{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes toast-in{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}
.animate-toast-in{animation:toast-in .25s ease forwards}
`;
  if (css.includes('@tailwind utilities;')) {
    css = css.replace('@tailwind utilities;', `@tailwind utilities;\n${block}`);
  } else {
    css = css + '\n' + block;
  }
  fs.writeFileSync(f, css, 'utf8');
}

function insertImportsAndWrap() {
  const f = 'app/layout.tsx';
  if (!fs.existsSync(f)) return;
  let s = fs.readFileSync(f, 'utf8');

  const imps = [
    'import PageFade from "@/components/PageFade";',
    'import Toast from "@/components/Toast";',
    'import BackToTop from "@/components/BackToTop";',
    'import CartCountBubble from "@/components/CartCountBubble";',
  ];
  imps.forEach(imp => { if (!s.includes(imp)) s = imp + '\n' + s; });

  if (!s.includes('<CartCountBubble') && s.includes('{children}')) {
    s = s.replace('{children}', `<PageFade>{children}</PageFade>
        <CartCountBubble />
        <BackToTop />
        <Toast />`);
  }
  fs.writeFileSync(f, s, 'utf8');
}

ensureCss();
insertImportsAndWrap();
