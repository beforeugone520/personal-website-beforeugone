/* BeforeUgone Phase 1 public surfaces: Now, Ship Log, guestbook and reactions.
   Static-first: every region stays hidden until its read request succeeds. */
(function () {
  'use strict';

  var REQUEST_TIMEOUT = 2800;
  var REACTION_TYPES = ['resonated', 'learned', 'want_more', 'confused'];
  var api = window.BeforeUApi || createApiClient();
  var visitorToken = getVisitorToken();

  function metaContent(name) {
    var node = document.querySelector('meta[name="' + name + '"]');
    return node ? node.getAttribute('content').trim() : '';
  }

  function resolveApiBase() {
    var override = metaContent('beforeu-api-base');
    if (override) return override.replace(/\/$/, '');
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return location.origin;
    return 'https://api.beforeugone.com';
  }

  function createApiClient() {
    var base = resolveApiBase();
    function request(path, options) {
      var controller = typeof AbortController === 'function' ? new AbortController() : null;
      var timer = controller ? setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT) : null;
      var config = options || {};
      config.headers = Object.assign({ Accept: 'application/json' }, config.headers || {});
      config.credentials = 'omit';
      if (controller) config.signal = controller.signal;
      return fetch(base + path, config).then(function (response) {
        return response.text().then(function (raw) {
          var payload = null;
          if (raw) {
            try { payload = JSON.parse(raw); } catch (e) { payload = null; }
          }
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
    function json(path, method, body, key) {
      return request(path, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
        body: JSON.stringify(body)
      });
    }
    return {
      base: base,
      getNow: function () { return request('/v1/public/now'); },
      getShip: function (limit, cursor) { return request('/v1/public/ship?limit=' + (limit || 5) + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); },
      getGuestbook: function (limit, cursor) { return request('/v1/public/guestbook?limit=' + (limit || 10) + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); },
      postGuestbook: function (body, key) { return json('/v1/public/guestbook', 'POST', body, key); },
      getReactions: function (pageKey) { return request('/v1/public/reactions?page_key=' + encodeURIComponent(pageKey)); },
      postReaction: function (body, key) { return json('/v1/public/reactions', 'POST', body, key); }
    };
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function makeKey() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    var bytes = new Uint8Array(16);
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') window.crypto.getRandomValues(bytes);
    else for (var i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return Array.prototype.map.call(bytes, function (n) { return n.toString(16).padStart(2, '0'); }).join('');
  }

  function getVisitorToken() {
    var key = 'beforeu-visitor-token-v1';
    var token = '';
    try { token = localStorage.getItem(key) || ''; } catch (e) {}
    if (token) return token;
    token = makeKey();
    try { localStorage.setItem(key, token); } catch (e) {}
    return token;
  }

  function safeUrl(value) {
    if (!value) return null;
    try {
      var url = new URL(String(value), location.href);
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
    } catch (e) { return null; }
  }

  function asDate(value) {
    if (!value) return null;
    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatDay(value) {
    var date = asDate(value);
    if (!date) return '';
    return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date).replace(/\//g, '.');
  }

  function formatMoment(value) {
    var date = asDate(value);
    if (!date) return '';
    return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  }

  function setStatus(node, message, kind) {
    node.textContent = message || '';
    node.classList.toggle('is-error', kind === 'error');
    node.classList.toggle('is-success', kind === 'success');
  }

  function friendlyError(error) {
    if (error && error.name === 'AbortError') return '请求超时了，内容还在，可以再试一次。';
    if (error && error.status === 429) return '刚刚有点拥挤，稍后再试。';
    if (error && error.code === 'turnstile_failed') return '人机验证已失效，请重新完成后再试。';
    if (error && error.code === 'idempotency_conflict') return '这次提交内容变了，请重新操作一次。';
    if (error && error.status >= 400 && error.status < 500) return '提交内容没有通过校验，请检查后重试。';
    return '暂时没送到，内容已经替你留在输入框里。';
  }

  var turnstileLoadPromise = null;
  function loadTurnstileScript() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (turnstileLoadPromise) return turnstileLoadPromise;
    turnstileLoadPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = function () { resolve(window.turnstile); };
      script.onerror = function () { reject(new Error('turnstile unavailable')); };
      document.head.appendChild(script);
    }).catch(function (error) {
      turnstileLoadPromise = null;
      throw error;
    });
    return turnstileLoadPromise;
  }

  function createTurnstileController(host, statusNode) {
    var siteKey = metaContent('beforeu-turnstile-site-key');
    var token = '';
    var widget = null;
    function render() {
      if (!siteKey || !host || !window.turnstile || widget != null) return;
      host.dataset.loading = 'false';
      widget = window.turnstile.render(host, {
        sitekey: siteKey,
        size: 'flexible',
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
        callback: function (value) { token = value; if (statusNode) setStatus(statusNode, ''); },
        'expired-callback': function () { token = ''; if (window.turnstile && widget != null) window.turnstile.reset(widget); },
        'error-callback': function () {
          token = '';
          if (statusNode) setStatus(statusNode, '人机验证暂时不可用，请稍后再试。', 'error');
        }
      });
    }
    return {
      enabled: Boolean(siteKey && host),
      ensure: function () {
        if (!siteKey || !host) return Promise.resolve();
        if (widget != null) { host.dataset.loading = 'false'; return Promise.resolve(); }
        host.dataset.loading = 'true';
        return loadTurnstileScript().then(function () { render(); }).catch(function (error) {
          host.dataset.loading = 'false';
          throw error;
        });
      },
      getToken: function () { return token; },
      reset: function () {
        token = '';
        if (window.turnstile && widget != null) window.turnstile.reset(widget);
      }
    };
  }

  function primeTurnstile(controller, target) {
    if (!controller.enabled) return;
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          controller.ensure().catch(function () {});
        }
      }, { rootMargin: '240px' });
      observer.observe(target);
    } else {
      target.addEventListener('focusin', function () { controller.ensure().catch(function () {}); }, { once: true });
    }
  }

  /* ───────── Now ───────── */
  function initNow() {
    var section = document.getElementById('now');
    if (!section) return;
    api.getNow().then(function (payload) {
      var data = payload && payload.data;
      if (!data || data.visible === false || !(data.summary || data.text)) return;
      var state = String(data.status || '').toLowerCase();
      var labels = {
        working: '在做', building: '在做', active: '在做',
        learning: '学习', resting: '休息', paused: '暂停'
      };
      var stateNode = document.getElementById('nowState');
      stateNode.textContent = labels[state] || data.status || '近况';
      stateNode.dataset.state = labels[state] ? state : 'other';
      document.getElementById('nowText').textContent = data.summary || data.text;

      var detail = document.getElementById('nowDetail');
      if (data.detail) { detail.textContent = data.detail; detail.hidden = false; }

      var link = document.getElementById('nowLink');
      var href = safeUrl(data.link_url);
      if (href) { link.href = href; link.hidden = false; }

      var updated = document.getElementById('nowUpdated');
      var moment = formatMoment(data.updated_at);
      if (moment) {
        updated.dateTime = data.updated_at;
        updated.textContent = '更新于 ' + moment;
      }
      section.hidden = false;
    }).catch(function () {});
  }

  /* ───────── Ship Log ───────── */
  function renderShipItem(item) {
    var row = el('li', 'ship-item');
    var time = el('time', 'ship-date', formatDay(item.occurred_at || item.shipped_at || item.created_at));
    if (item.occurred_at || item.shipped_at || item.created_at) time.dateTime = item.occurred_at || item.shipped_at || item.created_at;
    row.appendChild(time);
    row.appendChild(el('span', 'ship-rail'));

    var main = el('div', 'ship-main');
    var href = safeUrl(item.url);
    var title = el(href ? 'a' : 'span', 'ship-title', item.title || '未命名记录');
    if (href) { title.href = href; title.target = '_blank'; title.rel = 'noopener'; }
    main.appendChild(title);
    if (item.summary) main.appendChild(el('p', 'ship-summary', item.summary));

    var facts = el('div', 'ship-facts');
    var kinds = { release: '发布', project: '项目', article: '文章', milestone: '里程碑', push: '提交' };
    if (item.kind) facts.appendChild(el('span', 'ship-kind', kinds[item.kind] || item.kind));
    if (item.repository) facts.appendChild(el('span', '', item.repository));
    if (item.source) facts.appendChild(el('span', '', item.source === 'github' ? 'GitHub' : item.source));
    if (facts.childNodes.length) main.appendChild(facts);
    row.appendChild(main);
    return row;
  }

  function initShip() {
    var section = document.getElementById('ship');
    if (!section) return;
    api.getShip(5).then(function (payload) {
      var list = document.getElementById('shipList');
      var items = Array.isArray(payload && payload.items) ? payload.items : [];
      items.forEach(function (item) { list.appendChild(renderShipItem(item)); });
      document.getElementById('shipEmpty').hidden = items.length !== 0;
      section.hidden = false;
    }).catch(function () {});
  }

  /* ───────── Guestbook ───────── */
  function renderGuest(item) {
    var row = el('li', 'guest-entry');
    var head = el('div', 'guest-entry-head');
    head.appendChild(el('span', 'guest-name', item.nickname || '匿名访客'));
    var time = el('time', 'guest-date', formatDay(item.created_at));
    if (item.created_at) time.dateTime = item.created_at;
    head.appendChild(time);
    row.appendChild(head);
    row.appendChild(el('p', 'guest-message', item.message || item.body || ''));

    var replyText = item.reply || item.owner_reply;
    if (replyText) {
      var reply = el('div', 'guest-reply');
      reply.appendChild(el('strong', '', 'BeforeUgone 回复'));
      reply.appendChild(el('span', '', replyText));
      row.appendChild(reply);
    }
    return row;
  }

  function initGuestbook() {
    var section = document.getElementById('guestbook');
    if (!section) return;
    var list = document.getElementById('guestbookList');
    var empty = document.getElementById('guestbookEmpty');
    var more = document.getElementById('guestbookMore');
    var form = document.getElementById('guestbookForm');
    var messageInput = document.getElementById('guestbookBody');
    var nicknameInput = document.getElementById('guestbookNickname');
    var websiteInput = document.getElementById('guestbookWebsite');
    var count = document.getElementById('guestbookCount');
    var status = document.getElementById('guestbookStatus');
    var submit = document.getElementById('guestbookSubmit');
    var cursor = null;
    var requestKey = null;
    var turnstile = createTurnstileController(document.getElementById('guestbookTurnstile'), status);

    function appendItems(items) {
      var fragment = document.createDocumentFragment();
      items.forEach(function (item) { fragment.appendChild(renderGuest(item)); });
      list.appendChild(fragment);
      empty.hidden = list.childElementCount !== 0;
    }

    function updateCursor(next) {
      cursor = next || null;
      more.hidden = !cursor;
      more.disabled = false;
      more.textContent = '再看几条';
    }

    api.getGuestbook(10).then(function (payload) {
      var items = Array.isArray(payload && payload.items) ? payload.items : [];
      appendItems(items);
      updateCursor(payload && payload.next_cursor);
      section.hidden = false;
      primeTurnstile(turnstile, form);
    }).catch(function () {});

    more.addEventListener('click', function () {
      if (!cursor || more.disabled) return;
      more.disabled = true;
      more.textContent = '读取中…';
      api.getGuestbook(10, cursor).then(function (payload) {
        appendItems(Array.isArray(payload && payload.items) ? payload.items : []);
        updateCursor(payload && payload.next_cursor);
      }).catch(function () {
        more.disabled = false;
        more.textContent = '暂时没拉到，再试一次';
      });
    });

    function inputChanged() {
      count.textContent = String(messageInput.value.length);
      if (requestKey) { requestKey = null; turnstile.reset(); }
      if (status.classList.contains('is-error')) setStatus(status, '');
    }
    messageInput.addEventListener('input', inputChanged);
    nicknameInput.addEventListener('input', function () { if (requestKey) { requestKey = null; turnstile.reset(); } });
    websiteInput.addEventListener('input', function () { if (requestKey) { requestKey = null; turnstile.reset(); } });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (submit.disabled) return;
      var message = messageInput.value.trim();
      var nickname = nicknameInput.value.trim();
      if (message.length < 10 || message.length > 280) {
        setStatus(status, '留言需要 10—280 个字。', 'error');
        messageInput.focus();
        return;
      }
      if (nickname.length > 40) {
        setStatus(status, '称呼请控制在 40 个字以内。', 'error');
        nicknameInput.focus();
        return;
      }
      if (turnstile.enabled && !turnstile.getToken()) {
        turnstile.ensure().catch(function () {});
        setStatus(status, '请先完成人机验证。', 'error');
        return;
      }

      if (!requestKey) requestKey = makeKey();
      var body = {
        nickname: nickname,
        message: message,
        visitor_token: visitorToken,
        website: websiteInput.value
      };
      if (turnstile.getToken()) body.turnstile_token = turnstile.getToken();
      submit.disabled = true;
      submit.textContent = '提交中…';
      setStatus(status, '正在送达…');

      api.postGuestbook(body, requestKey).then(function (payload) {
        messageInput.value = '';
        websiteInput.value = '';
        count.textContent = '0';
        requestKey = null;
        setStatus(status, '收到了，审核通过后会出现在这里。', 'success');
        turnstile.reset();
      }).catch(function (error) {
        setStatus(status, friendlyError(error), 'error');
        if (error && error.status >= 400 && error.status < 500 && error.status !== 429) {
          requestKey = null;
          turnstile.reset();
        }
      }).finally(function () {
        submit.disabled = false;
        submit.textContent = '提交留言';
      });
    });
  }

  /* ───────── Article reactions ───────── */
  function getStoredReactions(pageKey) {
    try {
      var value = JSON.parse(localStorage.getItem('beforeu-reactions:' + pageKey) || '[]');
      return Array.isArray(value) ? value.filter(function (type) { return REACTION_TYPES.indexOf(type) >= 0; }) : [];
    } catch (e) { return []; }
  }

  function storeReaction(pageKey, type) {
    var selected = getStoredReactions(pageKey);
    if (selected.indexOf(type) < 0) selected.push(type);
    try { localStorage.setItem('beforeu-reactions:' + pageKey, JSON.stringify(selected)); } catch (e) {}
  }

  function renderCounts(counts) {
    REACTION_TYPES.forEach(function (type) {
      var output = document.querySelector('[data-reaction-count="' + type + '"]');
      if (output) output.textContent = String(Math.max(0, Number(counts && counts[type]) || 0));
    });
  }

  function initReactions() {
    var section = document.getElementById('articleReactions');
    if (!section) return;
    var pageKey = section.dataset.pageKey;
    var status = document.getElementById('reactionStatus');
    var selected = getStoredReactions(pageKey);
    var requestKeys = {};
    var pending = false;
    var retryType = null;
    var turnstile = createTurnstileController(document.getElementById('reactionTurnstile'), status);

    api.getReactions(pageKey).then(function (payload) {
      renderCounts(payload && payload.counts);
      section.querySelectorAll('[data-reaction-type]').forEach(function (button) {
        if (selected.indexOf(button.dataset.reactionType) >= 0) button.setAttribute('aria-pressed', 'true');
      });
      section.hidden = false;
      primeTurnstile(turnstile, section);
    }).catch(function () {});

    section.addEventListener('click', function (event) {
      var button = event.target.closest('[data-reaction-type]');
      if (!button || button.disabled || pending) return;
      var type = button.dataset.reactionType;
      if (button.getAttribute('aria-pressed') === 'true') {
        setStatus(status, '这一项已经记下了。');
        return;
      }
      if (retryType && retryType !== type) {
        setStatus(status, '请先重试刚才那一项，避免重复提交。', 'error');
        return;
      }
      if (turnstile.enabled && !turnstile.getToken()) {
        turnstile.ensure().catch(function () {});
        setStatus(status, '请先完成人机验证。', 'error');
        return;
      }
      if (!requestKeys[type]) requestKeys[type] = makeKey();
      pending = true;
      section.querySelectorAll('[data-reaction-type]').forEach(function (item) { item.disabled = true; });
      setStatus(status, '正在记下…');
      var body = { page_key: pageKey, reaction_type: type, visitor_token: visitorToken };
      if (turnstile.getToken()) body.turnstile_token = turnstile.getToken();
      api.postReaction(body, requestKeys[type]).then(function (payload) {
        renderCounts(payload && payload.counts);
        button.setAttribute('aria-pressed', 'true');
        storeReaction(pageKey, type);
        requestKeys[type] = null;
        retryType = null;
        setStatus(status, payload && payload.accepted === false ? '这一项已经记下了。' : '收到，谢谢你读到这里。');
        turnstile.reset();
      }).catch(function (error) {
        setStatus(status, friendlyError(error), 'error');
        if (error && error.status >= 400 && error.status < 500 && error.status !== 429) {
          requestKeys[type] = null;
          retryType = null;
          turnstile.reset();
        } else {
          retryType = type;
        }
      }).finally(function () {
        pending = false;
        section.querySelectorAll('[data-reaction-type]').forEach(function (item) { item.disabled = false; });
      });
    });
  }

  function init() {
    initNow();
    initShip();
    initGuestbook();
    initReactions();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
