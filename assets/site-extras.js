/* BeforeUgone · 站点堆料：终端模式 + Konami 彩蛋 + GitHub 活体动态
   纯 vanilla / 零依赖 / 失败静默。被 index、blog、posts 引用。
   终端样式与 GitHub 卡片样式在 css/site.css（沿用全站设计令牌）。 */
(function () {
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GH_USER = 'beforeugone520';
  var EMAIL = 'u@beforeugone.com';
  var WECHAT = 'BeforeUgone';

  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(function () {});
    try { var t = h('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); } catch (e) {}
    return Promise.resolve();
  }
  function greeting() { var hr = new Date().getHours(); if (hr < 5) return '夜深了'; if (hr < 9) return '早上好'; if (hr < 12) return '上午好'; if (hr < 14) return '午安'; if (hr < 18) return '下午好'; if (hr < 23) return '晚上好'; return '夜深了'; }
  function setTheme(t) {
    try { if (t === 'system') { localStorage.removeItem('bug-theme'); t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } else { localStorage.setItem('bug-theme', t); } } catch (e) {}
    document.documentElement.setAttribute('data-theme', t);
    if (window.__heroField && window.__heroField.retheme) { try { window.__heroField.retheme(); } catch (e) {} }
  }

  /* ───────── 终端 ───────── */
  var term, body, input, hist = [], hi = -1, booted = false;
  function buildTerm() {
    term = h('div', 'term'); term.id = 'term'; term.hidden = true;
    term.setAttribute('role', 'dialog'); term.setAttribute('aria-modal', 'true'); term.setAttribute('aria-label', '终端');
    term.innerHTML =
      '<div class="term-win" role="document">' +
        '<div class="term-bar"><span class="term-dots"><i></i><i></i><i></i></span>' +
        '<span class="term-ttl">~ /beforeugone — zsh</span>' +
        '<button class="term-x" type="button" aria-label="关闭终端">✕</button></div>' +
        '<div class="term-body" id="termBody" tabindex="0"></div>' +
        '<div class="term-row"><span class="term-prompt">❯</span><input id="termInput" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="终端输入" /></div>' +
      '</div>';
    document.body.appendChild(term);
    body = term.querySelector('#termBody'); input = term.querySelector('#termInput');
    term.querySelector('.term-x').addEventListener('click', closeTerm);
    term.addEventListener('mousedown', function (e) { if (e.target === term) closeTerm(); });
    input.addEventListener('keydown', onKey);
    term.querySelector('.term-row').addEventListener('click', function () { input.focus(); });
  }
  function print(html, cls) { var line = h('div', 'term-line' + (cls ? ' ' + cls : ''), html); body.appendChild(line); body.scrollTop = body.scrollHeight; return line; }
  function boot() {
    if (booted) return; booted = true;
    print('<span class="t-accent">BeforeUgone</span> terminal · v1.0 — ' + greeting() + ' 👋');
    print('输入 <span class="t-cmd">help</span> 看看能做什么，<span class="t-cmd">exit</span> 或 Esc 关闭。', 't-dim');
  }
  function openTerm() { if (!term) buildTerm(); boot(); term.hidden = false; document.documentElement.classList.add('term-open'); setTimeout(function () { input.focus(); }, 30); }
  function closeTerm() { if (term) term.hidden = true; document.documentElement.classList.remove('term-open'); }
  function onKey(e) {
    if (e.key === 'Enter') {
      var v = input.value.trim(); if (v) { hist.push(v); hi = hist.length; }
      print('<span class="term-prompt">❯</span> ' + esc(input.value)); input.value = ''; if (v) run(v);
    } else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = hist[hi] || ''; } }
    else if (e.key === 'ArrowDown') { if (hi < hist.length - 1) { hi++; input.value = hist[hi] || ''; } else { hi = hist.length; input.value = ''; } e.preventDefault(); }
    else if (e.key === 'Escape') { closeTerm(); }
    else if ((e.key === 'l' || e.key === 'L') && e.ctrlKey) { body.innerHTML = ''; e.preventDefault(); }
  }
  function goSection(id, label) {
    var t = document.getElementById(id);
    if (t) { print('↳ 跳转到 <span class="t-cmd">' + label + '</span>…'); closeTerm(); setTimeout(function () { t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }, 120); }
    else { print('↳ 前往 ' + label + '…'); location.href = 'index.html#' + id; }
  }
  function gotoGT() { print('↳ 打开黄海浒苔绿潮交互演示…'); location.href = 'green-tide.html'; }
  var CMDS = {
    help: function () {
      print('<div class="t-grid">' + [
        ['help', '这份帮助'], ['work', '作品一览'], ['blog / writing', '写作'], ['stack', '技术栈'], ['contact', '联系方式'],
        ['gt / 绿潮', '黄海浒苔绿潮交互演示'], ['repos', 'GitHub 实时仓库'], ['github', '打开 GitHub 主页'],
        ['email', '复制邮箱'], ['wechat', '复制微信号'], ['theme [light|dark|system]', '切换主题'],
        ['egg', '???'], ['clear', '清屏'], ['exit', '关闭终端']
      ].map(function (c) { return '<span class="t-cmd">' + c[0] + '</span><span class="t-dim">' + c[1] + '</span>'; }).join('') + '</div>');
    },
    whoami: function () { print('Bruce · 跨专业写代码。用 AI 把想法做出来，再回头把原理啃下来。' + greeting() + '。'); },
    work: function () { goSection('work', '作品'); }, projects: function () { goSection('work', '作品'); },
    blog: function () { print('↳ 前往写作…'); location.href = 'blog.html'; }, writing: function () { CMDS.blog(); },
    stack: function () { goSection('stack', '工具栈'); },
    contact: function () { goSection('contact', '联系'); },
    gt: gotoGT, 'green-tide': gotoGT, greentide: gotoGT, '绿潮': gotoGT,
    github: function () { print('↳ 打开 github.com/' + GH_USER); window.open('https://github.com/' + GH_USER, '_blank', 'noopener'); },
    gh: function () { CMDS.github(); },
    email: function () { copy(EMAIL); print('📋 已复制 <span class="t-accent">' + EMAIL + '</span>'); },
    mail: function () { CMDS.email(); },
    wechat: function () { copy(WECHAT); print('📋 已复制微信号 <span class="t-accent">' + WECHAT + '</span>'); },
    wx: function () { CMDS.wechat(); },
    theme: function (arg) {
      var t = (arg || '').trim() || 'toggle';
      if (t === 'toggle') t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (['light', 'dark', 'system'].indexOf(t) < 0) { print('用法：theme light | dark | system', 't-dim'); return; }
      setTheme(t); print('🎨 主题 → <span class="t-accent">' + t + '</span>');
    },
    repos: function () { listReposInTerm(); },
    date: function () { print(new Date().toLocaleString('zh-CN')); },
    echo: function (a) { print(esc(a || '')); },
    ls: function () { print('work  writing  stack  contact  green-tide'); },
    egg: function () { konami(); print('✨ 彩蛋！'); },
    sudo: function () { print('Nice try 😏 在这儿你早就是 root 了。', 't-dim'); },
    clear: function () { body.innerHTML = ''; },
    exit: function () { closeTerm(); }, close: function () { closeTerm(); }, q: function () { closeTerm(); }
  };
  function run(line) {
    var parts = line.split(/\s+/); var cmd = parts.shift().toLowerCase(); var arg = parts.join(' ');
    if (cmd === 'rm' && /-rf/.test(arg)) { print('🙅 别 rm -rf 我，我还想活着 ship。', 't-dim'); return; }
    var fn = CMDS[cmd] || CMDS[line.toLowerCase()];
    if (fn) { try { fn(arg); } catch (e) { print('出错了：' + esc(e.message), 't-dim'); } }
    else print('command not found: <span class="t-warn">' + esc(cmd) + '</span> — 试试 <span class="t-cmd">help</span>');
  }

  /* ───────── GitHub 活体动态 ───────── */
  var REPOS = null;
  var LANGC = { JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c', Vue: '#41b883', Shell: '#89e051', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600', Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', 'Jupyter Notebook': '#DA5B0B', Svelte: '#ff3e00', Kotlin: '#A97BFF', Swift: '#F05138', Dart: '#00B4AB', Ruby: '#701516', PHP: '#4F5D95', Astro: '#ff5a03' };
  function rel(d) {
    var s = (Date.now() - new Date(d).getTime()) / 1000;
    if (s < 3600) return Math.max(1, Math.floor(s / 60)) + ' 分钟前';
    if (s < 86400) return Math.floor(s / 3600) + ' 小时前';
    var dd = Math.floor(s / 86400);
    if (dd < 30) return dd + ' 天前'; if (dd < 365) return Math.floor(dd / 30) + ' 个月前'; return Math.floor(dd / 365) + ' 年前';
  }
  function initGitHub() {
    var host = document.getElementById('ghLive'); if (!host) return;
    fetch('https://api.github.com/users/' + GH_USER + '/repos?per_page=100&sort=pushed&type=owner')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (list) {
        REPOS = (list || []).filter(function (x) { return !x.fork; }).sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); });
        renderRepos(REPOS.slice(0, 6)); host.hidden = false; requestAnimationFrame(function () { host.classList.add('in'); });
      })
      .catch(function () { var g = document.getElementById('ghRepos'); if (g) g.style.display = 'none'; });
    fetch('https://github-contributions-api.jogruber.de/v4/' + GH_USER + '?y=last')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { renderHeat(d); host.hidden = false; requestAnimationFrame(function () { host.classList.add('in'); }); })
      .catch(function () { var hm = document.getElementById('ghHeat'); if (hm) hm.style.display = 'none'; });
  }
  function renderRepos(list) {
    var g = document.getElementById('ghRepos'); if (!g) return; g.innerHTML = '';
    list.forEach(function (r) {
      var lc = LANGC[r.language] || '#8b8b8b';
      var card = h('a', 'gh-repo'); card.href = r.html_url; card.target = '_blank'; card.rel = 'noopener';
      card.innerHTML =
        '<div class="gh-r-top"><span class="gh-r-name">' + esc(r.name) + '</span>' + (r.stargazers_count ? '<span class="gh-r-star">★ ' + r.stargazers_count + '</span>' : '') + '</div>' +
        '<p class="gh-r-desc">' + esc(r.description || '—') + '</p>' +
        '<div class="gh-r-meta">' + (r.language ? '<span class="gh-r-lang"><i style="background:' + lc + '"></i>' + esc(r.language) + '</span>' : '') + '<span class="gh-r-upd">更新于 ' + rel(r.pushed_at) + '</span></div>';
      g.appendChild(card);
    });
  }
  function renderHeat(d) {
    var hm = document.getElementById('ghHeat'); if (!hm || !d || !d.contributions || !d.contributions.length) return;
    var days = d.contributions;
    var total = (d.total && (d.total.lastYear != null ? d.total.lastYear : (typeof d.total === 'number' ? d.total : null)));
    if (total == null) total = days.reduce(function (s, x) { return s + (x.count || 0); }, 0);
    var tt = document.getElementById('ghTotal'); if (tt) tt.textContent = '过去一年 ' + total + ' 次贡献';
    var grid = h('div', 'heat-grid');
    var pad = new Date(days[0].date + 'T00:00:00').getDay();
    for (var i = 0; i < pad; i++) grid.appendChild(h('span', 'heat-cell pad'));
    days.forEach(function (x) { var c = h('span', 'heat-cell lv' + (x.level || 0)); c.title = x.date + ' · ' + (x.count || 0) + ' 次'; grid.appendChild(c); });
    hm.innerHTML = ''; var sc = h('div', 'heat-scroll'); sc.appendChild(grid); hm.appendChild(sc);
  }
  function listReposInTerm() {
    if (!REPOS) { print('正在抓取 GitHub… 稍后再试 <span class="t-cmd">repos</span>', 't-dim'); return; }
    if (!REPOS.length) { print('没抓到公开仓库。', 't-dim'); return; }
    REPOS.slice(0, 8).forEach(function (r) { print('<span class="t-cmd">' + esc(r.name) + '</span> <span class="t-dim">' + esc((r.description || '').slice(0, 44)) + '</span>'); });
  }

  /* ───────── Konami 彩蛋 ───────── */
  var KSEQ = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], kpos = 0;
  function konami() {
    var host = h('div', 'egg'); document.body.appendChild(host);
    var pool = ['ship', 'dev', '</>', '{}', 'npm', 'git push', '0x1F', '✦', '先做出来', 'AI', 'run', 'build'];
    var n = RM ? 0 : 40;
    for (var i = 0; i < n; i++) {
      var s = h('span', 'egg-bit', pool[(Math.random() * pool.length) | 0]);
      s.style.left = (Math.random() * 100) + '%';
      s.style.animationDelay = (Math.random() * 0.6).toFixed(2) + 's';
      s.style.animationDuration = (2 + Math.random() * 2.2).toFixed(2) + 's';
      host.appendChild(s);
    }
    var toast = h('div', 'egg-toast', '🎉 先做出来，再啃原理'); document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('out'); }, RM ? 1200 : 2200);
    setTimeout(function () { if (host.parentNode) host.remove(); if (toast.parentNode) toast.remove(); }, RM ? 1800 : 4200);
  }

  /* ───────── 启动器 + 全局键 ───────── */
  function launcher() {
    var b = h('button', 'term-launch', '<span aria-hidden="true">❯_</span>'); b.type = 'button';
    b.setAttribute('aria-label', '打开终端（也可按 ~ 键）'); b.title = '打开终端 · 按 ~ 键';
    b.addEventListener('click', openTerm); document.body.appendChild(b);
  }
  function globalKeys() {
    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      var typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable);
      if (!typing && (e.key === '`' || e.key === '~')) { e.preventDefault(); if (term && !term.hidden) closeTerm(); else openTerm(); return; }
      if (typing) return;
      if (e.keyCode === KSEQ[kpos]) { kpos++; if (kpos === KSEQ.length) { kpos = 0; konami(); } }
      else { kpos = (e.keyCode === KSEQ[0]) ? 1 : 0; }
    });
  }

  function init() {
    try { launcher(); } catch (e) {}
    try { globalKeys(); } catch (e) {}
    try { initGitHub(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
