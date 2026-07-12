/* BeforeUgone · terminal, Konami easter egg, GitHub activity and shared public API.
   Vanilla, dependency-free and quiet on network failure. Shared by index/blog/posts. */
(function () {
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GH_USER = 'beforeugone520';
  var EMAIL = 'u@beforeugone.com';
  var WECHAT = 'BeforeUgone';
  var API_TIMEOUT = 2800;
  var sourceScript = document.currentScript || document.querySelector('script[src*="site-extras.js"]');
  var SITE_ROOT = sourceScript && sourceScript.src ? new URL('../', sourceScript.src) : new URL('/', location.href);

  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function textNode(tag, cls, value) { var e = document.createElement(tag); if (cls) e.className = cls; if (value != null) e.textContent = String(value); return e; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function siteURL(path) { return new URL(path, SITE_ROOT).href; }
  function safeExternalURL(value) {
    try { var url = new URL(String(value)); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''; }
    catch (e) { return ''; }
  }
  function metaContent(name) { var n = document.querySelector('meta[name="' + name + '"]'); return n ? n.getAttribute('content').trim() : ''; }
  function resolveApiBase() {
    var override = metaContent('beforeu-api-base');
    if (override) return override.replace(/\/$/, '');
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return location.origin;
    return 'https://api.beforeugone.com';
  }

  function copy(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(value);
    return new Promise(function (resolve, reject) {
      var field = textNode('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      var copied = false;
      try { copied = document.execCommand('copy'); } catch (e) {}
      field.remove();
      if (copied) resolve(); else reject(new Error('copy failed'));
    });
  }

  function apiRequest(path, options) {
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, API_TIMEOUT) : null;
    var config = Object.assign({}, options || {});
    config.headers = Object.assign({ Accept: 'application/json' }, config.headers || {});
    config.credentials = 'omit';
    if (controller) config.signal = controller.signal;
    return fetch(resolveApiBase() + path, config).then(function (response) {
      return response.text().then(function (raw) {
        var payload = null;
        if (raw) { try { payload = JSON.parse(raw); } catch (e) {} }
        if (!response.ok) {
          var detail = payload && payload.error ? payload.error : payload;
          var error = new Error(detail && detail.message ? detail.message : 'request failed');
          error.status = response.status;
          error.code = detail && detail.code ? detail.code : '';
          error.requestId = payload && payload.request_id ? payload.request_id : '';
          throw error;
        }
        return payload || {};
      });
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  function apiWrite(path, body, key) {
    return apiRequest(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify(body)
    });
  }

  var API = {
    get base() { return resolveApiBase(); },
    getNow: function () { return apiRequest('/v1/public/now'); },
    getShip: function (limit, cursor) { return apiRequest('/v1/public/ship?limit=' + (limit || 5) + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); },
    getGuestbook: function (limit, cursor) { return apiRequest('/v1/public/guestbook?limit=' + (limit || 10) + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); },
    postGuestbook: function (body, key) { return apiWrite('/v1/public/guestbook', body, key); },
    getReactions: function (pageKey) { return apiRequest('/v1/public/reactions?page_key=' + encodeURIComponent(pageKey)); },
    postReaction: function (body, key) { return apiWrite('/v1/public/reactions', body, key); },
    health: function () { return apiRequest('/healthz'); }
  };
  window.BeforeUApi = API;

  function greeting() { var hr = new Date().getHours(); if (hr < 5) return '夜深了'; if (hr < 9) return '早上好'; if (hr < 12) return '上午好'; if (hr < 14) return '午安'; if (hr < 18) return '下午好'; if (hr < 23) return '晚上好'; return '夜深了'; }
  function setTheme(t) {
    try { if (t === 'system') { localStorage.removeItem('bug-theme'); t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } else { localStorage.setItem('bug-theme', t); } } catch (e) {}
    document.documentElement.setAttribute('data-theme', t);
    if (window.__heroField && window.__heroField.retheme) { try { window.__heroField.retheme(); } catch (e) {} }
  }

  /* ───────── Terminal ───────── */
  var term, body, input, lastFocus, hist = [], hi = -1, booted = false;
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
    term.addEventListener('keydown', trapTermFocus);
    input.addEventListener('keydown', onKey);
    term.querySelector('.term-row').addEventListener('click', function () { input.focus(); });
  }
  function print(html, cls) { var line = h('div', 'term-line' + (cls ? ' ' + cls : ''), html); body.appendChild(line); body.scrollTop = body.scrollHeight; return line; }
  function printText(value, cls) { var line = textNode('div', 'term-line' + (cls ? ' ' + cls : ''), value); body.appendChild(line); body.scrollTop = body.scrollHeight; return line; }
  function boot() {
    if (booted) return; booted = true;
    print('<span class="t-accent">BeforeUgone</span> terminal · v1.1 — ' + greeting());
    print('输入 <span class="t-cmd">help</span> 看看能做什么，<span class="t-cmd">exit</span> 或 Esc 关闭。', 't-dim');
  }
  function openTerm() {
    if (!term) buildTerm();
    lastFocus = document.activeElement;
    boot(); term.hidden = false; document.documentElement.classList.add('term-open');
    setTimeout(function () { input.focus(); }, 30);
  }
  function closeTerm() {
    if (!term || term.hidden) return;
    term.hidden = true; document.documentElement.classList.remove('term-open');
    if (lastFocus && typeof lastFocus.focus === 'function') setTimeout(function () { lastFocus.focus(); }, 0);
  }
  function trapTermFocus(event) {
    if (event.key === 'Escape') { event.preventDefault(); closeTerm(); return; }
    if (event.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(term.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  function onKey(e) {
    if (e.key === 'Enter') {
      var v = input.value.trim(); if (v) { hist.push(v); hi = hist.length; }
      print('<span class="term-prompt">❯</span> ' + esc(input.value)); input.value = ''; if (v) run(v);
    } else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = hist[hi] || ''; } }
    else if (e.key === 'ArrowDown') { if (hi < hist.length - 1) { hi++; input.value = hist[hi] || ''; } else { hi = hist.length; input.value = ''; } e.preventDefault(); }
    else if ((e.key === 'l' || e.key === 'L') && e.ctrlKey) { body.textContent = ''; e.preventDefault(); }
  }
  function goSection(id, label) {
    var target = document.getElementById(id);
    if (target && !target.hidden) {
      print('↳ 跳转到 <span class="t-cmd">' + esc(label) + '</span>…'); closeTerm();
      setTimeout(function () { target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }, 120);
    } else { print('↳ 前往 ' + esc(label) + '…'); location.href = siteURL('index.html#' + id); }
  }
  function gotoGT() { print('↳ 打开黄海浒苔绿潮交互演示…'); location.href = siteURL('green-tide.html'); }
  function asyncLine(label, promise, format) {
    var line = printText(label, 't-dim');
    promise.then(function (payload) {
      line.classList.remove('t-dim');
      line.textContent = format(payload);
      body.scrollTop = body.scrollHeight;
    }).catch(function () { line.textContent = 'API 暂时没有回应。'; });
  }
  function duration(seconds) {
    var value = Number(seconds);
    if (!Number.isFinite(value) || value < 0) return '';
    var days = Math.floor(value / 86400), hours = Math.floor((value % 86400) / 3600), minutes = Math.floor((value % 3600) / 60);
    return (days ? days + ' 天 ' : '') + (hours ? hours + ' 小时 ' : '') + minutes + ' 分钟';
  }

  var CMDS = {
    help: function () {
      print('<div class="t-grid">' + [
        ['help', '这份帮助'], ['work', '作品一览'], ['blog / writing', '写作'], ['stack', '技术栈'], ['contact', '联系方式'],
        ['now', '此刻近况'], ['ship', '最近完成'], ['guestbook', '最近留言'], ['status', 'API 状态'], ['uptime', '服务运行状态'],
        ['gt / 绿潮', '黄海浒苔绿潮交互演示'], ['repos', 'GitHub 实时仓库'], ['github', '打开 GitHub 主页'],
        ['email', '复制邮箱'], ['wechat', '复制微信号'], ['theme [light|dark|system]', '切换主题'],
        ['egg', '???'], ['clear', '清屏'], ['exit', '关闭终端']
      ].map(function (c) { return '<span class="t-cmd">' + c[0] + '</span><span class="t-dim">' + c[1] + '</span>'; }).join('') + '</div>');
    },
    whoami: function () { printText('BeforeUgone · 用 AI 把想法做出来，再回头把原理啃下来。' + greeting() + '。'); },
    work: function () { goSection('work', '作品'); }, projects: function () { goSection('work', '作品'); },
    blog: function () { print('↳ 前往写作…'); location.href = siteURL('blog.html'); }, writing: function () { CMDS.blog(); },
    stack: function () { goSection('stack', '工具栈'); },
    contact: function () { goSection('contact', '联系'); },
    now: function () {
      asyncLine('正在读取近况…', API.getNow(), function (payload) {
        var data = payload && payload.data;
        if (!data) return 'Now · 暂无公开状态';
        return 'Now · ' + (data.status || '近况') + '\n' + (data.summary || data.text || '') + (data.detail ? '\n' + data.detail : '');
      });
    },
    ship: function () {
      var line = printText('正在读取 Ship Log…', 't-dim');
      API.getShip(5).then(function (payload) {
        line.remove();
        var items = Array.isArray(payload && payload.items) ? payload.items : [];
        if (!items.length) { printText('Ship Log · 暂无公开记录', 't-dim'); return; }
        items.forEach(function (item) {
          var date = item.occurred_at || item.shipped_at || item.created_at;
          var day = date ? String(date).slice(0, 10) : '----------';
          printText(day + '  ' + (item.title || '未命名记录'));
        });
      }).catch(function () { line.textContent = 'API 暂时没有回应。'; });
    },
    guestbook: function () {
      var line = printText('正在读取留言…', 't-dim');
      API.getGuestbook(5).then(function (payload) {
        line.remove();
        var items = Array.isArray(payload && payload.items) ? payload.items : [];
        if (!items.length) { printText('留言簿还很安静。', 't-dim'); return; }
        items.forEach(function (item) {
          var name = item.nickname || '匿名访客';
          var message = String(item.message || item.body || '').replace(/\s+/g, ' ').slice(0, 70);
          printText(name + ' · ' + message);
        });
      }).catch(function () { line.textContent = 'API 暂时没有回应。'; });
    },
    status: function () {
      asyncLine('正在检查 API…', API.health(), function (payload) { return payload && payload.status === 'ok' ? 'API · online' : 'API · reachable'; });
    },
    uptime: function () {
      asyncLine('正在检查运行状态…', API.health(), function (payload) {
        var value = duration(payload && (payload.uptime_seconds != null ? payload.uptime_seconds : payload.uptime));
        return value ? 'API 已运行 ' + value : 'API 可达 · 未公开运行时长';
      });
    },
    gt: gotoGT, 'green-tide': gotoGT, greentide: gotoGT, '绿潮': gotoGT,
    github: function () { printText('↳ 打开 github.com/' + GH_USER); window.open('https://github.com/' + GH_USER, '_blank', 'noopener'); },
    gh: function () { CMDS.github(); },
    email: function () { copy(EMAIL).then(function () { printText('已复制 ' + EMAIL); }).catch(function () { printText('复制失败，请手动使用 ' + EMAIL, 't-warn'); }); },
    mail: function () { CMDS.email(); },
    wechat: function () { copy(WECHAT).then(function () { printText('已复制微信号 ' + WECHAT); }).catch(function () { printText('复制失败，微信号是 ' + WECHAT, 't-warn'); }); },
    wx: function () { CMDS.wechat(); },
    theme: function (arg) {
      var t = (arg || '').trim() || 'toggle';
      if (t === 'toggle') t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (['light', 'dark', 'system'].indexOf(t) < 0) { print('用法：theme light | dark | system', 't-dim'); return; }
      setTheme(t); print('主题 → <span class="t-accent">' + t + '</span>');
    },
    repos: function () { listReposInTerm(); },
    date: function () { printText(new Date().toLocaleString('zh-CN')); },
    echo: function (a) { printText(a || ''); },
    ls: function () { printText('work  writing  stack  now  ship  guestbook  contact  green-tide'); },
    egg: function () { konami(); printText('彩蛋！'); },
    sudo: function () { printText('Nice try。在这里你早就是 root 了。', 't-dim'); },
    clear: function () { body.textContent = ''; },
    exit: function () { closeTerm(); }, close: function () { closeTerm(); }, q: function () { closeTerm(); }
  };
  function run(line) {
    var parts = line.split(/\s+/); var cmd = parts.shift().toLowerCase(); var arg = parts.join(' ');
    if (cmd === 'rm' && /-rf/.test(arg)) { printText('别 rm -rf 我，我还想继续 ship。', 't-dim'); return; }
    var fn = CMDS[cmd] || CMDS[line.toLowerCase()];
    if (fn) { try { fn(arg); } catch (e) { printText('出错了：' + e.message, 't-dim'); } }
    else print('command not found: <span class="t-warn">' + esc(cmd) + '</span> — 试试 <span class="t-cmd">help</span>');
  }

  /* ───────── GitHub activity ───────── */
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
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (list) {
        REPOS = (list || []).filter(function (x) { return !x.fork; }).sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); });
        renderRepos(REPOS.slice(0, 6)); host.hidden = false; requestAnimationFrame(function () { host.classList.add('in'); });
      })
      .catch(function () { var g = document.getElementById('ghRepos'); if (g) g.style.display = 'none'; });
    fetch('https://github-contributions-api.jogruber.de/v4/' + GH_USER + '?y=last')
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (d) { renderHeat(d); host.hidden = false; requestAnimationFrame(function () { host.classList.add('in'); }); })
      .catch(function () { var hm = document.getElementById('ghHeat'); if (hm) hm.style.display = 'none'; });
  }
  function renderRepos(list) {
    var grid = document.getElementById('ghRepos'); if (!grid) return; grid.textContent = '';
    list.forEach(function (repo) {
      var href = safeExternalURL(repo.html_url);
      var card = textNode(href ? 'a' : 'div', 'gh-repo');
      if (href) { card.href = href; card.target = '_blank'; card.rel = 'noopener'; }
      var top = textNode('div', 'gh-r-top');
      top.appendChild(textNode('span', 'gh-r-name', repo.name));
      if (repo.stargazers_count) top.appendChild(textNode('span', 'gh-r-star', '★ ' + repo.stargazers_count));
      card.appendChild(top);
      card.appendChild(textNode('p', 'gh-r-desc', repo.description || '—'));
      var meta = textNode('div', 'gh-r-meta');
      if (repo.language) {
        var language = textNode('span', 'gh-r-lang');
        var dot = textNode('i'); dot.style.background = LANGC[repo.language] || '#8b8b8b';
        language.appendChild(dot); language.appendChild(document.createTextNode(repo.language)); meta.appendChild(language);
      }
      meta.appendChild(textNode('span', 'gh-r-upd', '更新于 ' + rel(repo.pushed_at)));
      card.appendChild(meta); grid.appendChild(card);
    });
  }
  function renderHeat(data) {
    var host = document.getElementById('ghHeat'); if (!host || !data || !data.contributions || !data.contributions.length) return;
    var days = data.contributions;
    var total = data.total && (data.total.lastYear != null ? data.total.lastYear : (typeof data.total === 'number' ? data.total : null));
    if (total == null) total = days.reduce(function (sum, item) { return sum + (item.count || 0); }, 0);
    var totalNode = document.getElementById('ghTotal'); if (totalNode) totalNode.textContent = '过去一年 ' + total + ' 次贡献';
    var grid = textNode('div', 'heat-grid');
    var pad = new Date(days[0].date + 'T00:00:00').getDay();
    for (var i = 0; i < pad; i++) grid.appendChild(textNode('span', 'heat-cell pad'));
    days.forEach(function (item) { var cell = textNode('span', 'heat-cell lv' + (item.level || 0)); cell.title = item.date + ' · ' + (item.count || 0) + ' 次'; grid.appendChild(cell); });
    host.textContent = ''; var scroll = textNode('div', 'heat-scroll'); scroll.appendChild(grid); host.appendChild(scroll);
  }
  function listReposInTerm() {
    if (!REPOS) { print('正在抓取 GitHub… 稍后再试 <span class="t-cmd">repos</span>', 't-dim'); return; }
    if (!REPOS.length) { printText('没抓到公开仓库。', 't-dim'); return; }
    REPOS.slice(0, 8).forEach(function (repo) { printText(repo.name + '  ' + String(repo.description || '').slice(0, 44)); });
  }

  /* ───────── Konami easter egg ───────── */
  var KSEQ = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], kpos = 0;
  function konami() {
    var host = textNode('div', 'egg'); document.body.appendChild(host);
    var pool = ['ship', 'dev', '</>', '{}', 'pnpm', 'git push', '0x1F', '✦', '先做出来', 'AI', 'run', 'build'];
    var n = RM ? 0 : 40;
    for (var i = 0; i < n; i++) {
      var bit = textNode('span', 'egg-bit', pool[(Math.random() * pool.length) | 0]);
      bit.style.left = (Math.random() * 100) + '%'; bit.style.animationDelay = (Math.random() * .6).toFixed(2) + 's'; bit.style.animationDuration = (2 + Math.random() * 2.2).toFixed(2) + 's'; host.appendChild(bit);
    }
    var toast = textNode('div', 'egg-toast', '先做出来，再啃原理'); document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('out'); }, RM ? 1200 : 2200);
    setTimeout(function () { if (host.parentNode) host.remove(); if (toast.parentNode) toast.remove(); }, RM ? 1800 : 4200);
  }

  /* ───────── Launcher and global keys ───────── */
  function launcher() {
    var button = h('button', 'term-launch', '<span aria-hidden="true">❯_</span>'); button.type = 'button';
    button.setAttribute('aria-label', '打开终端（也可按 ~ 键）'); button.title = '打开终端 · 按 ~ 键';
    button.addEventListener('click', openTerm); document.body.appendChild(button);
  }
  function globalKeys() {
    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      var typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable);
      if (!typing && (e.key === '`' || e.key === '~')) { e.preventDefault(); if (term && !term.hidden) closeTerm(); else openTerm(); return; }
      if (typing) return;
      if (e.keyCode === KSEQ[kpos]) { kpos++; if (kpos === KSEQ.length) { kpos = 0; konami(); } }
      else { kpos = e.keyCode === KSEQ[0] ? 1 : 0; }
    });
  }

  function init() {
    try { launcher(); } catch (e) {}
    try { globalKeys(); } catch (e) {}
    try { initGitHub(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
