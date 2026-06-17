//#region node_modules/.pnpm/@vue+shared@3.5.38/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), te = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ne = /-\w/g, T = te((e) => e.replace(ne, (e) => e.slice(1).toUpperCase())), re = /\B([A-Z])/g, E = te((e) => e.replace(re, "-$1").toLowerCase()), ie = te((e) => e.charAt(0).toUpperCase() + e.slice(1)), ae = te((e) => e ? `on${ie(e)}` : ""), D = (e, t) => !Object.is(e, t), oe = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, O = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, se = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ce, le = () => ce ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function k(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? pe(r) : k(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var ue = /;(?![^(]*\))/g, de = /:([^]+)/, fe = /\/\*[^]*?\*\//g;
function pe(e) {
	let t = {};
	return e.replace(fe, "").split(ue).forEach((e) => {
		if (e) {
			let n = e.split(de);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function A(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = A(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var me = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", he = /* @__PURE__ */ e(me);
me + "";
function ge(e) {
	return !!e || e === "";
}
function _e(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = ve(e[r], t[r]);
	return n;
}
function ve(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? _e(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !ve(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
//#endregion
//#region node_modules/.pnpm/@vue+reactivity@3.5.38/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var j, ye = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && j && (j.active ? (this.parent = j, this.index = (j.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].pause();
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].resume();
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = j;
			try {
				return j = this, e();
			} finally {
				j = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = j, j = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (j === this) j = this.prevScope;
			else {
				let e = j;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function be() {
	return j;
}
var M, xe = /* @__PURE__ */ new WeakSet(), Se = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, j && (j.active ? j.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, xe.has(this) && (xe.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ee(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Le(this), ke(this);
		let e = M, t = N;
		M = this, N = !0;
		try {
			return this.fn();
		} finally {
			Ae(this), M = e, N = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ne(e);
			this.deps = this.depsTail = void 0, Le(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? xe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		je(this) && this.run();
	}
	get dirty() {
		return je(this);
	}
}, Ce = 0, we, Te;
function Ee(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Te, Te = e;
		return;
	}
	e.next = we, we = e;
}
function De() {
	Ce++;
}
function Oe() {
	if (--Ce > 0) return;
	if (Te) {
		let e = Te;
		for (Te = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; we;) {
		let t = we;
		for (we = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function ke(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ae(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ne(r), Pe(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function je(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Me(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Me(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Re) || (e.globalVersion = Re, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !je(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = M, r = N;
	M = e, N = !0;
	try {
		ke(e);
		let n = e.fn(e._value);
		(t.version === 0 || D(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		M = n, N = r, Ae(e), e.flags &= -3;
	}
}
function Ne(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ne(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Pe(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var N = !0, Fe = [];
function Ie() {
	Fe.push(N), N = !1;
}
function P() {
	let e = Fe.pop();
	N = e === void 0 ? !0 : e;
}
function Le(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = M;
		M = void 0;
		try {
			t();
		} finally {
			M = e;
		}
	}
}
var Re = 0, ze = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Be = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!M || !N || M === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== M) t = this.activeLink = new ze(M, this), M.deps ? (t.prevDep = M.depsTail, M.depsTail.nextDep = t, M.depsTail = t) : M.deps = M.depsTail = t, Ve(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = M.depsTail, t.nextDep = void 0, M.depsTail.nextDep = t, M.depsTail = t, M.deps === t && (M.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Re++, this.notify(e);
	}
	notify(e) {
		De();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Oe();
		}
	}
};
function Ve(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ve(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var He = /* @__PURE__ */ new WeakMap(), Ue = /* @__PURE__ */ Symbol(""), We = /* @__PURE__ */ Symbol(""), Ge = /* @__PURE__ */ Symbol("");
function F(e, t, n) {
	if (N && M) {
		let t = He.get(e);
		t || He.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Be()), r.map = t, r.key = n), r.track();
	}
}
function Ke(e, t, n, r, i, a) {
	let o = He.get(e);
	if (!o) {
		Re++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (De(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ge || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ge)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ue)), f(e) && s(o.get(We)));
				break;
			case "delete":
				i || (s(o.get(Ue)), f(e) && s(o.get(We)));
				break;
			case "set":
				f(e) && s(o.get(Ue));
				break;
		}
	}
	Oe();
}
function qe(e) {
	let t = /* @__PURE__ */ z(e);
	return t === e ? t : (F(t, "iterate", Ge), /* @__PURE__ */ R(e) ? t : t.map(B));
}
function Je(e) {
	return F(e = /* @__PURE__ */ z(e), "iterate", Ge), e;
}
function I(e, t) {
	return /* @__PURE__ */ kt(e) ? Mt(/* @__PURE__ */ Ot(e) ? B(t) : t) : B(t);
}
var Ye = {
	__proto__: null,
	[Symbol.iterator]() {
		return Xe(this, Symbol.iterator, (e) => I(this, e));
	},
	concat(...e) {
		return qe(this).concat(...e.map((e) => d(e) ? qe(e) : e));
	},
	entries() {
		return Xe(this, "entries", (e) => (e[1] = I(this, e[1]), e));
	},
	every(e, t) {
		return L(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return L(this, "filter", e, t, (e) => e.map((e) => I(this, e)), arguments);
	},
	find(e, t) {
		return L(this, "find", e, t, (e) => I(this, e), arguments);
	},
	findIndex(e, t) {
		return L(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return L(this, "findLast", e, t, (e) => I(this, e), arguments);
	},
	findLastIndex(e, t) {
		return L(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return L(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return $e(this, "includes", e);
	},
	indexOf(...e) {
		return $e(this, "indexOf", e);
	},
	join(e) {
		return qe(this).join(e);
	},
	lastIndexOf(...e) {
		return $e(this, "lastIndexOf", e);
	},
	map(e, t) {
		return L(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return et(this, "pop");
	},
	push(...e) {
		return et(this, "push", e);
	},
	reduce(e, ...t) {
		return Qe(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Qe(this, "reduceRight", e, t);
	},
	shift() {
		return et(this, "shift");
	},
	some(e, t) {
		return L(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return et(this, "splice", e);
	},
	toReversed() {
		return qe(this).toReversed();
	},
	toSorted(e) {
		return qe(this).toSorted(e);
	},
	toSpliced(...e) {
		return qe(this).toSpliced(...e);
	},
	unshift(...e) {
		return et(this, "unshift", e);
	},
	values() {
		return Xe(this, "values", (e) => I(this, e));
	}
};
function Xe(e, t, n) {
	let r = Je(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ R(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var Ze = Array.prototype;
function L(e, t, n, r, i, a) {
	let o = Je(e), s = o !== e && !/* @__PURE__ */ R(e), c = o[t];
	if (c !== Ze[t]) {
		let t = c.apply(e, a);
		return s ? B(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, I(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Qe(e, t, n, r) {
	let i = Je(e), a = i !== e && !/* @__PURE__ */ R(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = I(e, t)), n.call(this, t, I(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? I(e, c) : c;
}
function $e(e, t, n) {
	let r = /* @__PURE__ */ z(e);
	F(r, "iterate", Ge);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ At(n[0]) ? (n[0] = /* @__PURE__ */ z(n[0]), r[t](...n)) : i;
}
function et(e, t, n = []) {
	Ie(), De();
	let r = (/* @__PURE__ */ z(e))[t].apply(e, n);
	return Oe(), P(), r;
}
var tt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), nt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function rt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ z(this);
	return F(t, "has", e), t.hasOwnProperty(e);
}
var it = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? St : xt : i ? bt : yt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = Ye[t])) return e;
			if (t === "hasOwnProperty") return rt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ V(e) ? e : n);
		if ((_(t) ? nt.has(t) : tt(t)) || (r || F(e, "get", t), i)) return o;
		if (/* @__PURE__ */ V(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Et(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Et(o) : /* @__PURE__ */ wt(o) : o;
	}
}, at = class extends it {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ kt(i);
			if (!/* @__PURE__ */ R(n) && !/* @__PURE__ */ kt(n) && (i = /* @__PURE__ */ z(i), n = /* @__PURE__ */ z(n)), !a && /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ V(e) ? e : r);
		return e === /* @__PURE__ */ z(r) && (o ? D(n, i) && Ke(e, "set", t, n, i) : Ke(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ke(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !nt.has(t)) && F(e, "has", t), n;
	}
	ownKeys(e) {
		return F(e, "iterate", d(e) ? "length" : Ue), Reflect.ownKeys(e);
	}
}, ot = class extends it {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, st = /* @__PURE__ */ new at(), ct = /* @__PURE__ */ new ot(), lt = /* @__PURE__ */ new at(!0), ut = (e) => e, dt = (e) => Reflect.getPrototypeOf(e);
function ft(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ z(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? ut : t ? Mt : B;
		return !t && F(a, "iterate", l ? We : Ue), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function pt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function mt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ z(r), a = /* @__PURE__ */ z(n);
			e || (D(n, a) && F(i, "get", n), F(i, "get", a));
			let { has: o } = dt(i), s = t ? ut : e ? Mt : B;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && F(/* @__PURE__ */ z(t), "iterate", Ue), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ z(n), i = /* @__PURE__ */ z(t);
			return e || (D(t, i) && F(r, "has", t), F(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ z(a), s = t ? ut : e ? Mt : B;
			return !e && F(o, "iterate", Ue), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: pt("add"),
		set: pt("set"),
		delete: pt("delete"),
		clear: pt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ z(this), r = dt(n), i = /* @__PURE__ */ z(e), a = !t && !/* @__PURE__ */ R(e) && !/* @__PURE__ */ kt(e) ? i : e;
			return r.has.call(n, a) || D(e, a) && r.has.call(n, e) || D(i, a) && r.has.call(n, i) || (n.add(a), Ke(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ R(n) && !/* @__PURE__ */ kt(n) && (n = /* @__PURE__ */ z(n));
			let r = /* @__PURE__ */ z(this), { has: i, get: a } = dt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ z(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? D(n, s) && Ke(r, "set", e, n, s) : Ke(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ z(this), { has: n, get: r } = dt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ z(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ke(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ z(this), t = e.size !== 0, n = e.clear();
			return t && Ke(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = ft(r, e, t);
	}), n;
}
function ht(e, t) {
	let n = mt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var gt = { get: /* @__PURE__ */ ht(!1, !1) }, _t = { get: /* @__PURE__ */ ht(!1, !0) }, vt = { get: /* @__PURE__ */ ht(!0, !1) }, yt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), xt = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap();
function Ct(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function wt(e) {
	return /* @__PURE__ */ kt(e) ? e : Dt(e, !1, st, gt, yt);
}
// @__NO_SIDE_EFFECTS__
function Tt(e) {
	return Dt(e, !1, lt, _t, bt);
}
// @__NO_SIDE_EFFECTS__
function Et(e) {
	return Dt(e, !0, ct, vt, xt);
}
function Dt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Ct(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Ot(e) {
	return /* @__PURE__ */ kt(e) ? /* @__PURE__ */ Ot(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function At(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ z(t) : e;
}
function jt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && O(e, "__v_skip", !0), e;
}
var B = (e) => v(e) ? /* @__PURE__ */ wt(e) : e, Mt = (e) => v(e) ? /* @__PURE__ */ Et(e) : e;
// @__NO_SIDE_EFFECTS__
function V(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Nt(e) {
	return Pt(e, !1);
}
function Pt(e, t) {
	return /* @__PURE__ */ V(e) ? e : new Ft(e, t);
}
var Ft = class {
	constructor(e, t) {
		this.dep = new Be(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ z(e), this._value = t ? e : B(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ R(e) || /* @__PURE__ */ kt(e);
		e = n ? e : /* @__PURE__ */ z(e), D(e, t) && (this._rawValue = e, this._value = n ? e : B(e), this.dep.trigger());
	}
};
function It(e) {
	return /* @__PURE__ */ V(e) ? e.value : e;
}
var Lt = {
	get: (e, t, n) => t === "__v_raw" ? e : It(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Rt(e) {
	return /* @__PURE__ */ Ot(e) ? e : new Proxy(e, Lt);
}
var zt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Be(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Re - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && M !== this) return Ee(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Me(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Bt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new zt(r, i, n);
}
var Vt = {}, Ht = /* @__PURE__ */ new WeakMap(), Ut = void 0;
function Wt(e, t = !1, n = Ut) {
	if (n) {
		let t = Ht.get(n);
		t || Ht.set(n, t = []), t.push(e);
	}
}
function Gt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ R(e) || o === !1 || o === 0 ? Kt(e, 1) : Kt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ V(e) ? (g = () => e.value, y = /* @__PURE__ */ R(e)) : /* @__PURE__ */ Ot(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Ot(e) || /* @__PURE__ */ R(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ V(e)) return e.value;
		if (/* @__PURE__ */ Ot(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Ie();
			try {
				_();
			} finally {
				P();
			}
		}
		let t = Ut;
		Ut = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Ut = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => Kt(e(), t);
	}
	let x = be(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(Vt) : Vt, w = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) if (n) {
			let t = m.run();
			if (e || o || y || (b ? t.some((e, t) => D(e, C[t])) : D(t, C))) {
				_ && _();
				let e = Ut;
				Ut = m;
				try {
					let e = [
						t,
						C === Vt ? void 0 : b && C[0] === Vt ? [] : C,
						v
					];
					C = t, f ? f(n, 3, e) : n(...e);
				} finally {
					Ut = e;
				}
			}
		} else m.run();
	};
	return u && u(w), m = new Se(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Wt(e, !1, m), _ = m.onStop = () => {
		let e = Ht.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Ht.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function Kt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ V(e)) Kt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Kt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Kt(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) Kt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Kt(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.38/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function qt(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Jt(e, t, n);
	}
}
function H(e, t, n, r) {
	if (h(e)) {
		let i = qt(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Jt(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(H(e[a], t, n, r));
		return i;
	}
}
function Jt(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			Ie(), qt(o, null, 10, [
				e,
				i,
				a
			]), P();
			return;
		}
	}
	Yt(e, r, a, i, s);
}
function Yt(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var U = [], W = -1, Xt = [], Zt = null, Qt = 0, $t = /* @__PURE__ */ Promise.resolve(), en = null;
function tn(e) {
	let t = en || $t;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function nn(e) {
	let t = W + 1, n = U.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = U[r], a = ln(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function rn(e) {
	if (!(e.flags & 1)) {
		let t = ln(e), n = U[U.length - 1];
		!n || !(e.flags & 2) && t >= ln(n) ? U.push(e) : U.splice(nn(t), 0, e), e.flags |= 1, an();
	}
}
function an() {
	en ||= $t.then(un);
}
function on(e) {
	d(e) ? Xt.push(...e) : Zt && e.id === -1 ? Zt.splice(Qt + 1, 0, e) : e.flags & 1 || (Xt.push(e), e.flags |= 1), an();
}
function sn(e, t, n = W + 1) {
	for (; n < U.length; n++) {
		let t = U[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			U.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function cn(e) {
	if (Xt.length) {
		let e = [...new Set(Xt)].sort((e, t) => ln(e) - ln(t));
		if (Xt.length = 0, Zt) {
			Zt.push(...e);
			return;
		}
		for (Zt = e, Qt = 0; Qt < Zt.length; Qt++) {
			let e = Zt[Qt];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Zt = null, Qt = 0;
	}
}
var ln = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function un(e) {
	try {
		for (W = 0; W < U.length; W++) {
			let e = U[W];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), qt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; W < U.length; W++) {
			let e = U[W];
			e && (e.flags &= -2);
		}
		W = -1, U.length = 0, cn(e), en = null, (U.length || Xt.length) && un(e);
	}
}
var G = null, dn = null;
function fn(e) {
	let t = G;
	return G = e, dn = e && e.type.__scopeId || null, t;
}
function pn(e, t = G, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && gi(-1);
		let i = fn(t), a;
		try {
			a = e(...n);
		} finally {
			fn(i), r._d && gi(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function mn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ie(), H(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), P());
	}
}
function hn(e, t) {
	if ($) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function gn(e, t, n = !1) {
	let r = Pi();
	if (r || br) {
		let i = br ? br._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var _n = /* @__PURE__ */ Symbol.for("v-scx"), vn = () => gn(_n);
function yn(e, t, n) {
	return bn(e, t, n);
}
function bn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Bi) {
		if (c === "sync") {
			let e = vn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = $;
	u.call = (e, t, n) => H(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		q(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : rn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Gt(e, n, u);
	return Bi && (f ? f.push(h) : d && h()), h;
}
function xn(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Sn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = Li(this), s = bn(i, a.bind(r), n);
	return o(), s;
}
function Sn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Cn = /* @__PURE__ */ Symbol("_vte"), wn = (e) => e.__isTeleport, Tn = /* @__PURE__ */ Symbol("_leaveCb");
function En(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, En(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Dn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function On(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var kn = /* @__PURE__ */ new WeakMap();
function An(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => An(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Mn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && An(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Yi(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ z(v), b = v === t ? i : (e) => On(_, e) ? !1 : u(y, e), x = (e, t) => !(t && On(_, t));
	if (m != null && m !== p) {
		if (jn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ V(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) qt(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ V(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), kn.delete(e);
				};
				t.id = -1, kn.set(e, t), q(t, r);
			} else jn(e), i();
		}
	}
}
function jn(e) {
	let t = kn.get(e);
	t && (t.flags |= 8, kn.delete(e));
}
le().requestIdleCallback, le().cancelIdleCallback;
var Mn = (e) => !!e.type.__asyncLoader, Nn = (e) => e.type.__isKeepAlive;
function Pn(e, t) {
	In(e, "a", t);
}
function Fn(e, t) {
	In(e, "da", t);
}
function In(e, t, n = $) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Rn(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Nn(e.parent.vnode) && Ln(r, t, n, e), e = e.parent;
	}
}
function Ln(e, t, n, r) {
	let i = Rn(t, e, r, !0);
	Gn(() => {
		c(r[t], i);
	}, n);
}
function Rn(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ie();
			let i = Li(n), a = H(t, n, e, r);
			return i(), P(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var zn = (e) => (t, n = $) => {
	(!Bi || e === "sp") && Rn(e, (...e) => t(...e), n);
}, Bn = zn("bm"), Vn = zn("m"), Hn = zn("bu"), Un = zn("u"), Wn = zn("bum"), Gn = zn("um"), Kn = zn("sp"), qn = zn("rtg"), Jn = zn("rtc");
function Yn(e, t = $) {
	Rn("ec", e, t);
}
var Xn = /* @__PURE__ */ Symbol.for("v-ndc");
function Zn(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Ot(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ R(e), s = /* @__PURE__ */ kt(e), e = Je(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Mt(B(e[n])) : B(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (v(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
	else {
		let n = Object.keys(e);
		i = Array(n.length);
		for (let r = 0, o = n.length; r < o; r++) {
			let o = n[r];
			i[r] = t(e[o], o, r, a && a[r]);
		}
	}
	else i = [];
	return n && (n[r] = i), i;
}
var Qn = (e) => e ? zi(e) ? Yi(e) : Qn(e.parent) : null, $n = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Qn(e.parent),
	$root: (e) => Qn(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => cr(e),
	$forceUpdate: (e) => e.f ||= () => {
		rn(e.update);
	},
	$nextTick: (e) => e.n ||= tn.bind(e.proxy),
	$watch: (e) => xn.bind(e)
}), er = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), tr = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (er(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else rr && (s[n] = 0);
		}
		let d = $n[n], f, p;
		if (d) return n === "$attrs" && F(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return er(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || er(n, c) || u(o, c) || u(i, c) || u($n, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function nr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var rr = !0;
function ir(e) {
	let t = cr(e), n = e.proxy, i = e.ctx;
	rr = !1, t.beforeCreate && or(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: ee, renderTracked: te, renderTriggered: ne, errorCaptured: T, serverPrefetch: re, expose: E, inheritAttrs: ie, components: ae, directives: D, filters: oe } = t;
	if (u && ar(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ wt(t));
	}
	if (rr = !0, o) for (let e in o) {
		let t = o[e], a = Zi({
			get: h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r,
			set: !h(t) && h(t.set) ? t.set.bind(n) : r
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		});
	}
	if (c) for (let e in c) sr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			hn(t, e[t]);
		});
	}
	f && or(f, e, "c");
	function O(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O(Bn, p), O(Vn, m), O(Hn, g), O(Un, _), O(Pn, y), O(Fn, b), O(Yn, T), O(Jn, te), O(qn, ne), O(Wn, S), O(Gn, w), O(Kn, re), d(E)) if (E.length) {
		let t = e.exposed ||= {};
		E.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	ee && e.render === r && (e.render = ee), ie != null && (e.inheritAttrs = ie), ae && (e.components = ae), D && (e.directives = D), re && Dn(e);
}
function ar(e, t, n = r) {
	d(e) && (e = pr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? gn(r.from || n, r.default, !0) : gn(r.from || n) : gn(r), /* @__PURE__ */ V(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function or(e, t, n) {
	H(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function sr(e, t, n, r) {
	let i = r.includes(".") ? Sn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && yn(i, n);
	} else if (h(e)) yn(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => sr(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) && yn(i, r, e);
	}
}
function cr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => lr(c, e, o, !0)), lr(c, t, o)), v(t) && a.set(t, c), c;
}
function lr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && lr(e, a, n, !0), i && i.forEach((t) => lr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = ur[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var ur = {
	data: dr,
	props: hr,
	emits: hr,
	methods: mr,
	computed: mr,
	beforeCreate: K,
	created: K,
	beforeMount: K,
	mounted: K,
	beforeUpdate: K,
	updated: K,
	beforeDestroy: K,
	beforeUnmount: K,
	destroyed: K,
	unmounted: K,
	activated: K,
	deactivated: K,
	errorCaptured: K,
	serverPrefetch: K,
	components: mr,
	directives: mr,
	watch: gr,
	provide: dr,
	inject: fr
};
function dr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function fr(e, t) {
	return mr(pr(e), pr(t));
}
function pr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function K(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function mr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function hr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), nr(e), nr(t ?? {})) : t;
}
function gr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = K(e[r], t[r]);
	return n;
}
function _r() {
	return {
		app: null,
		config: {
			isNativeTag: i,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var vr = 0;
function yr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = _r(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: vr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Qi,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || Ci(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Yi(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (H(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = br;
				br = l;
				try {
					return e();
				} finally {
					br = t;
				}
			}
		};
		return l;
	};
}
var br = null, xr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${T(t)}Modifiers`] || e[`${E(t)}Modifiers`];
function Sr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && xr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(se)));
	let c, l = i[c = ae(n)] || i[c = ae(T(n))];
	!l && o && (l = i[c = ae(E(n))]), l && H(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, H(u, e, 6, a);
	}
}
var Cr = /* @__PURE__ */ new WeakMap();
function wr(e, t, n = !1) {
	let r = n ? Cr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = wr(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Tr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, E(t)) || u(e, t));
}
function Er(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = fn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Z(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Z(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : Dr(c);
		}
	} catch (t) {
		fi.length = 0, Jt(t, e, 1), v = Ci(ui);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Or(y, a)), b = Ei(b, y, !1, !0));
	}
	return n.dirs && (b = Ei(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && En(b, n.transition), v = b, fn(_), v;
}
var Dr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Or = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function kr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Ar(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (jr(o, r, n) && !Tr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? o ? Ar(r, o, l) : !0 : !!o;
	return !1;
}
function Ar(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (jr(t, e, a) && !Tr(n, a)) return !0;
	}
	return !1;
}
function jr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !ve(r, i) : r !== i;
}
function Mr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Nr = {}, Pr = () => Object.create(Nr), Fr = (e) => Object.getPrototypeOf(e) === Nr;
function Ir(e, t, n, r = !1) {
	let i = {}, a = Pr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Rr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Tt(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Lr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ z(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Tr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = T(o);
					i[t] = zr(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Rr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = E(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = zr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && Ke(e.attrs, "set", "");
}
function Rr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (ee(t)) continue;
		let l = n[t], d;
		a && u(a, d = T(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Tr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ z(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = zr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function zr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Li(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === E(n)) && (r = !0));
	}
	return r;
}
var Br = /* @__PURE__ */ new WeakMap();
function Vr(e, r, i = !1) {
	let a = i ? Br : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = Vr(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = T(c[e]);
		Hr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = T(e);
		if (Hr(t)) {
			let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
			if (d(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = h(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				} else n === "String" && (o = !1);
			}
			else a = h(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
		}
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function Hr(e) {
	return e[0] !== "$" && !ee(e);
}
var Ur = (e) => e === "_" || e === "_ctx" || e === "$stable", Wr = (e) => d(e) ? e.map(Z) : [Z(e)], Gr = (e, t, n) => {
	if (t._n) return t;
	let r = pn((...e) => Wr(t(...e)), n);
	return r._c = !1, r;
}, Kr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ur(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Gr(n, i, r);
		else if (i != null) {
			let e = Wr(i);
			t[n] = () => e;
		}
	}
}, qr = (e, t) => {
	let n = Wr(t);
	e.slots.default = () => n;
}, Jr = (e, t, n) => {
	for (let r in t) (n || !Ur(r)) && (e[r] = t[r]);
}, Yr = (e, t, n) => {
	let r = e.slots = Pr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Jr(r, t, n), n && O(r, "_", e, !0)) : Kr(t, r);
	} else t && qr(e, t);
}, Xr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : Jr(a, n, r) : (o = !n.$stable, Kr(n, a)), s = n;
	} else n && (qr(e, n), s = { default: 1 });
	if (o) for (let e in a) !Ur(e) && s[e] == null && delete a[e];
}, q = ci;
function Zr(e) {
	return Qr(e);
}
function Qr(e, i) {
	let a = le();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !bi(e, t) && (r = ve(e), A(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case li:
				y(e, t, n, r);
				break;
			case ui:
				b(e, t, n, r);
				break;
			case di:
				e ?? x(t, n, r, o);
				break;
			case J:
				ae(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? D(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, be);
		}
		u != null && i ? An(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && An(e.ref, null, a, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) te(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), re(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, te = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && T(e.children, d, null, r, i, $r(e, a), s, u), _ && mn(e, null, r, "created"), ne(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Q(f, r, e);
		}
		_ && mn(e, null, r, "beforeMount");
		let v = ti(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && q(() => {
			try {
				f && Q(f, r, e), v && g.enter(d), _ && mn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ne = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || si(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ne(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, T = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) v(null, e[l] = s ? Oi(e[l]) : Z(e[l]), t, n, r, i, a, o, s);
	}, re = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && ei(r, !1), (g = h.onVnodeBeforeUpdate) && Q(g, r, n, e), f && mn(n, e, r, "beforeUpdate"), r && ei(r, !0), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? E(e.dynamicChildren, d, l, r, i, $r(n, a), o) : s || ue(e, n, l, null, r, i, $r(n, a), o, !1), u > 0) {
			if (u & 16) ie(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && ie(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && q(() => {
			g && Q(g, r, n, e), f && mn(n, e, r, "updated");
		}, i);
	}, E = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s];
			v(c, l, c.el && (c.type === J || !bi(c, l) || c.shapeFlag & 198) ? m(c.el) : n, null, r, i, a, o, !0);
		}
	}, ie = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !ee(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (ee(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ae = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), T(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (E(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && ni(e, t, !0)) : ue(e, t, n, f, i, a, s, c, l);
	}, D = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : O(t, n, r, i, a, o, c) : se(e, t, c);
	}, O = (e, t, n, r, i, a, o) => {
		let s = e.component = Ni(e, r, i);
		if (Nn(e) && (s.ctx.renderer = be), Vi(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o), !e.el) {
				let r = s.subTree = Ci(ui);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (kr(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			k(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ii(e);
					if (n) {
						t && (t.el = c.el, k(e, t, o)), n.asyncDep.then(() => {
							q(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				ei(e, !1), t ? (t.el = c.el, k(e, t, o)) : t = c, n && oe(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Q(d, s, t, c), ei(e, !0);
				let f = Er(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ve(p), e, i, a), t.el = f.el, u === null && Mr(e, f.el), r && q(r, i), (d = t.props && t.props.onVnodeUpdated) && q(() => Q(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Mn(t);
				if (ei(e, !1), l && oe(l), !m && (o = c && c.onVnodeBeforeMount) && Q(o, d, t), ei(e, !0), s && xe) {
					let t = () => {
						e.subTree = Er(e), xe(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Er(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && q(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					q(() => Q(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Mn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && q(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Se(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => rn(u), ei(e, !0), l();
	}, k = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Lr(e, t.props, r, n), Xr(e, t.children, n), Ie(), sn(e), P();
	}, ue = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				de(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && _e(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? fe(l, d, n, r, i, a, o, s, c) : _e(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && T(d, n, r, i, a, o, s, c));
	}, de = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Oi(t[p]) : Z(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? _e(e, a, o, !0, !1, f) : T(t, r, i, a, o, s, c, l, f);
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Oi(t[u]) : Z(t[u]);
			if (bi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Oi(t[p]) : Z(t[p]);
			if (bi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Oi(t[u]) : Z(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) A(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Oi(t[u]) : Z(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					A(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && bi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? A(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? ri(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || oi(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? pe(n, r, p, 2) : _--);
			}
		}
	}, pe = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			pe(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, be);
			return;
		}
		if (c === J) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) pe(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === di) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[Tn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), q(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[Tn];
				a._isLeaving && a[Tn](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, A = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Ie(), An(s, null, n, e, !0), P()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Mn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Q(_, t, e), u & 6) ge(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && mn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== J || d > 0 && d & 64) ? _e(l, t, n, !1, !0) : (a === J && d & 384 || !i && u & 16) && _e(c, t, n), r && me(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && q(() => {
			_ && Q(_, t, e), h && mn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, me = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === J) {
			he(n, r);
			return;
		}
		if (t === di) {
			C(e);
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, he = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ge = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		ai(c), ai(l), r && oe(r), i.stop(), a && (a.flags |= 8, A(o, e, t, n)), s && q(s, t), q(() => {
			e.isUnmounted = !0;
		}, t);
	}, _e = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) A(e[o], t, n, r, i);
	}, ve = (e) => {
		if (e.shapeFlag & 6) return ve(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Cn];
		return n ? h(n) : t;
	}, j = !1, ye = (e, t, n) => {
		let r;
		e == null ? t._vnode && (A(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, j ||= (j = !0, sn(r), cn(), !1);
	}, be = {
		p: v,
		um: A,
		m: pe,
		r: me,
		mt: O,
		mc: T,
		pc: ue,
		pbc: E,
		n: ve,
		o: e
	}, M, xe;
	return i && ([M, xe] = i(be)), {
		render: ye,
		hydrate: M,
		createApp: yr(ye, M)
	};
}
function $r({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ei({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ti(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ni(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Oi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && ni(t, a)), a.type === li && (a.patchFlag === -1 && (a = i[e] = Oi(a)), a.el = t.el), a.type === ui && !a.el && (a.el = t.el);
	}
}
function ri(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function ii(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ii(t);
}
function ai(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function oi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? oi(t.subTree) : null;
}
var si = (e) => e.__isSuspense;
function ci(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : on(e);
}
var J = /* @__PURE__ */ Symbol.for("v-fgt"), li = /* @__PURE__ */ Symbol.for("v-txt"), ui = /* @__PURE__ */ Symbol.for("v-cmt"), di = /* @__PURE__ */ Symbol.for("v-stc"), fi = [], Y = null;
function pi(e = !1) {
	fi.push(Y = e ? null : []);
}
function mi() {
	fi.pop(), Y = fi[fi.length - 1] || null;
}
var hi = 1;
function gi(e, t = !1) {
	hi += e, e < 0 && Y && t && (Y.hasOnce = !0);
}
function _i(e) {
	return e.dynamicChildren = hi > 0 ? Y || n : null, mi(), hi > 0 && Y && Y.push(e), e;
}
function vi(e, t, n, r, i, a) {
	return _i(X(e, t, n, r, i, a, !0));
}
function yi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function bi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var xi = ({ key: e }) => e ?? null, Si = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ V(e) || h(e) ? {
	i: G,
	r: e,
	k: t,
	f: !!n
} : e);
function X(e, t = null, n = null, r = 0, i = null, a = e === J ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && xi(t),
		ref: t && Si(t),
		scopeId: dn,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: G
	};
	return s ? (ki(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), hi > 0 && !o && Y && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Y.push(c), c;
}
var Ci = wi;
function wi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Xn) && (e = ui), yi(e)) {
		let r = Ei(e, t, !0);
		return n && ki(r, n), hi > 0 && !a && Y && (r.shapeFlag & 6 ? Y[Y.indexOf(e)] = r : Y.push(r)), r.patchFlag = -2, r;
	}
	if (Xi(e) && (e = e.__vccOpts), t) {
		t = Ti(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = A(e)), v(n) && (/* @__PURE__ */ At(n) && !d(n) && (n = s({}, n)), t.style = k(n));
	}
	let o = g(e) ? 1 : si(e) ? 128 : wn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return X(e, t, n, r, i, o, a, !0);
}
function Ti(e) {
	return e ? /* @__PURE__ */ At(e) || Fr(e) ? s({}, e) : e : null;
}
function Ei(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Ai(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && xi(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Si(t)) : [a, Si(t)] : Si(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== J ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Ei(e.ssContent),
		ssFallback: e.ssFallback && Ei(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && En(u, c.clone(u)), u;
}
function Di(e = " ", t = 0) {
	return Ci(li, null, e, t);
}
function Z(e) {
	return e == null || typeof e == "boolean" ? Ci(ui) : d(e) ? Ci(J, null, e.slice()) : yi(e) ? Oi(e) : Ci(li, null, String(e));
}
function Oi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Ei(e);
}
function ki(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), ki(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !Fr(t) ? t._ctx = G : r === 3 && G && (G.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else h(t) ? (t = {
		default: t,
		_ctx: G
	}, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [Di(t)]) : n = 8);
	e.children = t, e.shapeFlag |= n;
}
function Ai(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = A([t.class, r.class]));
		else if (e === "style") t.style = k([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Q(e, t, n, r = null) {
	H(e, t, 7, [n, r]);
}
var ji = _r(), Mi = 0;
function Ni(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || ji, o = {
		uid: Mi++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new ye(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Vr(i, a),
		emitsOptions: wr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Sr.bind(null, o), e.ce && e.ce(o), o;
}
var $ = null, Pi = () => $ || G, Fi, Ii;
{
	let e = le(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Fi = t("__VUE_INSTANCE_SETTERS__", (e) => $ = e), Ii = t("__VUE_SSR_SETTERS__", (e) => Bi = e);
}
var Li = (e) => {
	let t = $;
	return Fi(e), e.scope.on(), () => {
		e.scope.off(), Fi(t);
	};
}, Ri = () => {
	$ && $.scope.off(), Fi(null);
};
function zi(e) {
	return e.vnode.shapeFlag & 4;
}
var Bi = !1;
function Vi(e, t = !1, n = !1) {
	t && Ii(t);
	let { props: r, children: i } = e.vnode, a = zi(e);
	Ir(e, r, a, t), Yr(e, i, n || t);
	let o = a ? Hi(e, t) : void 0;
	return t && Ii(!1), o;
}
function Hi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, tr);
	let { setup: r } = n;
	if (r) {
		Ie();
		let n = e.setupContext = r.length > 1 ? Ji(e) : null, i = Li(e), a = qt(r, e, 0, [e.props, n]), o = y(a);
		if (P(), i(), (o || e.sp) && !Mn(e) && Dn(e), o) {
			if (a.then(Ri, Ri), t) return a.then((n) => {
				Ui(e, n, t);
			}).catch((t) => {
				Jt(t, e, 0);
			});
			e.asyncDep = a;
		} else Ui(e, a, t);
	} else Ki(e, t);
}
function Ui(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Rt(t)), Ki(e, n);
}
var Wi, Gi;
function Ki(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && Wi && !i.render) {
			let t = i.template || cr(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: r } = e.appContext.config, { delimiters: a, compilerOptions: o } = i;
				i.render = Wi(t, s(s({
					isCustomElement: n,
					delimiters: a
				}, r), o));
			}
		}
		e.render = i.render || r, Gi && Gi(e);
	}
	{
		let t = Li(e);
		Ie();
		try {
			ir(e);
		} finally {
			P(), t();
		}
	}
}
var qi = { get(e, t) {
	return F(e, "get", ""), e[t];
} };
function Ji(e) {
	return {
		attrs: new Proxy(e.attrs, qi),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Yi(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Rt(jt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in $n) return $n[n](e);
		},
		has(e, t) {
			return t in e || t in $n;
		}
	}) : e.proxy;
}
function Xi(e) {
	return h(e) && "__vccOpts" in e;
}
var Zi = (e, t) => /* @__PURE__ */ Bt(e, t, Bi), Qi = "3.5.38", $i = void 0, ea = typeof window < "u" && window.trustedTypes;
if (ea) try {
	$i = /* @__PURE__ */ ea.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var ta = $i ? (e) => $i.createHTML(e) : (e) => e, na = "http://www.w3.org/2000/svg", ra = "http://www.w3.org/1998/Math/MathML", ia = typeof document < "u" ? document : null, aa = ia && /* @__PURE__ */ ia.createElement("template"), oa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? ia.createElementNS(na, e) : t === "mathml" ? ia.createElementNS(ra, e) : n ? ia.createElement(e, { is: n }) : ia.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => ia.createTextNode(e),
	createComment: (e) => ia.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => ia.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			aa.innerHTML = ta(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = aa.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, sa = /* @__PURE__ */ Symbol("_vtc");
function ca(e, t, n) {
	let r = e[sa];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var la = /* @__PURE__ */ Symbol("_vod"), ua = /* @__PURE__ */ Symbol("_vsh"), da = /* @__PURE__ */ Symbol(""), fa = /(?:^|;)\s*display\s*:/;
function pa(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) if (g(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? ha(r, t, "");
		}
		else for (let e in t) n[e] ?? ha(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ha(r, i, "") : ya(e, i, !g(t) && t ? t[i] : void 0, o) || ha(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[da];
			e && (n += ";" + e), r.cssText = n, a = fa.test(n);
		}
	} else t && e.removeAttribute("style");
	la in e && (e[la] = a ? r.display : "", e[ua] && (r.display = "none"));
}
var ma = /\s*!important$/;
function ha(e, t, n) {
	if (d(n)) n.forEach((n) => ha(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = va(e, t);
		ma.test(n) ? e.setProperty(E(r), n.replace(ma, ""), "important") : e[r] = n;
	}
}
var ga = [
	"Webkit",
	"Moz",
	"ms"
], _a = {};
function va(e, t) {
	let n = _a[t];
	if (n) return n;
	let r = T(t);
	if (r !== "filter" && r in e) return _a[t] = r;
	r = ie(r);
	for (let n = 0; n < ga.length; n++) {
		let i = ga[n] + r;
		if (i in e) return _a[t] = i;
	}
	return t;
}
function ya(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var ba = "http://www.w3.org/1999/xlink";
function xa(e, t, n, r, i, a = he(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ba, t.slice(6, t.length)) : e.setAttributeNS(ba, t, n) : n == null || a && !ge(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Sa(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? ta(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = ge(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Ca(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function wa(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Ta = /* @__PURE__ */ Symbol("_vei");
function Ea(e, t, n, r, i = null) {
	let a = e[Ta] || (e[Ta] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Oa(t);
		r ? Ca(e, n, a[t] = Ma(r, i), s) : o && (wa(e, n, o, s), a[t] = void 0);
	}
}
var Da = /(?:Once|Passive|Capture)$/;
function Oa(e) {
	let t;
	if (Da.test(e)) {
		t = {};
		let n;
		for (; n = e.match(Da);) e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0;
	}
	return [e[2] === ":" ? e.slice(3) : E(e.slice(2)), t];
}
var ka = 0, Aa = /* @__PURE__ */ Promise.resolve(), ja = () => ka ||= (Aa.then(() => ka = 0), Date.now());
function Ma(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && H(e, t, 5, a);
			}
		} else H(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ja(), n;
}
var Na = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Pa = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? ca(e, r, c) : t === "style" ? pa(e, n, r) : a(t) ? o(t) || Ea(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Fa(e, t, r, c)) ? (Sa(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && xa(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ia(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Sa(e, T(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), xa(e, t, r, c));
};
function Fa(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Na(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Na(t) && g(n) ? !1 : t in e;
}
function Ia(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = T(t);
	return Array.isArray(n) ? n.some((e) => T(e) === r) : Object.keys(n).some((e) => T(e) === r);
}
var La = /* @__PURE__ */ s({ patchProp: Pa }, oa), Ra;
function za() {
	return Ra ||= Zr(La);
}
var Ba = ((...e) => {
	let t = za().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Ha(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Va(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Va(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ha(e) {
	return g(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/theme.js
var Ua = {
	LIGHT: "light",
	DARK: "dark"
}, Wa = "bug-theme";
function Ga(e) {
	return e >= 50 ? Ua.DARK : Ua.LIGHT;
}
function Ka(e) {
	return e === Ua.DARK ? 100 : 0;
}
function qa() {
	let e = document.documentElement.getAttribute("data-theme");
	return e === Ua.LIGHT || e === Ua.DARK ? e : window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? Ua.DARK : Ua.LIGHT;
}
function Ja(e) {
	document.documentElement.setAttribute("data-theme", e);
	try {
		localStorage.setItem(Wa, e);
	} catch {}
	return window.__heroField && typeof window.__heroField.retheme == "function" && window.__heroField.retheme(), e;
}
//#endregion
//#region src/components/composables/useSliderState.js
function Ya() {
	let e = /* @__PURE__ */ Nt(Ka(qa())), t = /* @__PURE__ */ Nt(!1), n = null, r = Zi(() => Ga(e.value)), i = Zi(() => r.value === Ua.DARK), a = i, o = Zi(() => e.value === 100), s = Zi(() => i.value ? "深色" : "浅色");
	function c() {
		n != null && (clearTimeout(n), n = null), t.value = !1;
	}
	function l() {
		c(), t.value = !0, n = setTimeout(() => {
			t.value = !1, n = null;
		}, 460);
	}
	yn(r, (e, t) => {
		e !== t && (Ja(e), l());
	});
	function u(t) {
		e.value = parseInt(t.target.value, 10);
	}
	return Wn(c), {
		sliderValue: e,
		isActive: a,
		isFull: o,
		isAnimating: t,
		statusLabel: s,
		theme: r,
		onInput: u
	};
}
//#endregion
//#region src/components/shaders/index.js
var Xa = "#version 300 es\n  layout(location=0) in vec2 a_pos;\n  out vec2 v_uv;\n  void main(){ v_uv=a_pos*0.5+0.5; gl_Position=vec4(a_pos,0.0,1.0); }\n", Za = "#version 300 es\n  precision highp float;\n  in vec2 v_uv; out vec4 fc;\n  uniform float u_time, u_slider, u_elapsed;\n  uniform sampler2D u_back;\n  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }\n  void main(){\n    vec2 uv=v_uv;\n    vec2 g=uv*vec2(72.0,6.0);\n    vec2 id=floor(g);\n    vec2 cf=fract(g);\n    float h=hash(id);\n    vec2 ap=abs(cf-0.5);\n    float cell=smoothstep(0.34,0.22,max(ap.x*0.9,ap.y));\n    vec3 prev=texture(u_back,uv).rgb;\n    float fade_mask = smoothstep(0.0, 0.45, uv.x);\n    vec3 decay = prev * 0.90 * fade_mask;\n    float act=smoothstep(0.95,1.0,u_slider);\n    if(act<0.01||u_elapsed<0.0){ fc=vec4(decay,1.0); return; }\n    float t=u_time;\n    float cellDelay = h * 1.2;\n    float cellAge   = max(u_elapsed - cellDelay, 0.0);\n    float ignited   = step(0.001, cellAge);\n    float cellSpd   = 0.85 + h * 0.30;\n    float eased = 1.0 - pow(1.0 - clamp(cellAge / 2.5, 0.0, 1.0), 3.0);\n    float dist  = eased * u_slider * cellSpd * ignited;\n    float cellOff = (h - 0.5) * 0.05;\n    float front   = max(u_slider - dist - cellOff, 0.02);\n    float tail    = max(u_slider - front, 0.001);\n    float inZ   = step(front - 0.003, uv.x) * step(uv.x, u_slider + 0.003);\n    float dn    = clamp(max(u_slider - uv.x, 0.0) / tail, 0.0, 1.0);\n    float bright = pow(1.0 - dn, 0.65);\n    bright = max(bright, 0.04 * ignited) * inZ;\n    bright *= 1.0 - smoothstep(0.94, 1.05, dn);\n    float es = mix(0.15, 0.5, min(u_elapsed / 1.0, 1.0));\n    float vy = abs(uv.y - 0.5) * 2.0;\n    float vf = pow(max(1.0 - vy * vy * 0.45, 0.0), 0.75);\n    float ts = mix(0.85, 1.0, min(u_elapsed / 1.5, 1.0));\n    float f1 = sin(uv.x * 30.0 + t * 15.0 * ts + h * 6.28);\n    float f2 = sin(uv.x * 17.0 + t * 8.0 * ts + h * 3.14);\n    float f3 = sin(uv.x * 52.0 + t * 25.0 * ts + h * 10.0);\n    float flame = smoothstep(0.08, 0.92, (f1 + f2 * 0.5 + f3 * 0.25) * 0.35 + 0.5);\n    float r1 = sin(dn * 16.0 - t * 5.0 * ts + h * 3.0);\n    float r2 = sin(dn * 8.0 - t * 2.5 * ts + h * 5.0);\n    float rhythm = smoothstep(-0.15, 0.55, r1) * (r2 * 0.5 + 0.5);\n    rhythm = pow(max(rhythm, 0.0), 1.2);\n    float avgSpd = dist / max(cellAge, 0.001);\n    float age    = max(cellAge - max(u_slider - uv.x, 0.0) / max(avgSpd, 0.001), 0.0);\n    float flash  = step(0.0, age) * exp(-age * 3.2);\n    float sp  = fract(t * (0.38 + h * 0.15) + h * 7.0);\n    float sX  = u_slider - sp * tail;\n    float sY  = 0.5 + sin(sp * 11.0 + h * 6.28) * 0.28;\n    float spark = smoothstep(0.014, 0.0, abs(uv.x - sX))\n                * smoothstep(0.18, 0.0, abs(uv.y - sY))\n                * (1.0 - sp) * (1.0 - sp) * es;\n    float energy = bright * vf * (flame * 0.42 + rhythm * 0.38)\n                 + flash * bright * vf * 0.55\n                 + spark * 0.7 * inZ;\n    energy *= es;\n    float edgeBase = exp(-pow((uv.x - front) * 18.0, 2.0));\n    float ef1 = sin(uv.x * 45.0 + t * 20.0 * ts + h * 6.28) * 0.5 + 0.5;\n    float ef2 = sin(uv.x * 28.0 + t * 11.0 * ts + h * 3.14) * 0.5 + 0.5;\n    float edge = edgeBase * (0.25 + ef1 * ef2 * 1.5) * 1.6 * act * es;\n    float leadD    = front - uv.x;\n    float leadZone = smoothstep(0.07, 0.0, leadD) * step(0.0, leadD) * vf;\n    float h2       = hash(id + vec2(99.0, 33.0));\n    float leadF    = sin(leadD * 100.0 + t * 20.0 * ts + h2 * 6.28) * 0.5 + 0.5;\n    float leadSpark = leadZone * step(0.6, h2) * leadF * act * es * 0.5;\n    float total = energy + edge + leadSpark;\n    vec3 ember = vec3(0.28, 0.10, 0.58);\n    vec3 wpur  = vec3(0.62, 0.32, 1.0);\n    vec3 wht   = vec3(1.0, 0.94, 0.98);\n    float temp = 1.0 - dn;\n    vec3 col   = mix(ember, wpur, temp);\n    col        = mix(col, wht, pow(temp, 4.5));\n    col       *= total;\n    float pulse = sin(t * 2.8) * 0.15 + 1.0;\n    float core  = exp(-pow((uv.x - u_slider) * 16.0, 2.0));\n    col += wht * core * 2.2 * pulse * act * es;\n    col += wpur * exp(-pow((uv.x - u_slider) * 3.5, 2.0)) * 0.12 * act * es;\n    col *= cell;\n    col *= fade_mask;\n    fc = vec4(min(decay + col, vec3(1.5)), 1.0);\n  }\n", Qa = "#version 300 es\n  precision highp float;\n  in vec2 v_uv; out vec4 fc;\n  uniform sampler2D u_tex;\n  uniform vec2 u_dir, u_res;\n  uniform float u_ext;\n  vec3 s(vec2 uv){\n    vec3 c=texture(u_tex,uv).rgb;\n    return u_ext>0.5 && dot(c,vec3(0.2126,0.7152,0.0722))<0.3 ? vec3(0.0) : c;\n  }\n  void main(){\n    vec2 o=u_dir*1.8/u_res;\n    vec3 r=s(v_uv)*0.227027;\n    r+=s(v_uv+o)*0.194595;    r+=s(v_uv-o)*0.194595;\n    r+=s(v_uv+o*2.0)*0.121622;r+=s(v_uv-o*2.0)*0.121622;\n    r+=s(v_uv+o*3.0)*0.054054;r+=s(v_uv-o*3.0)*0.054054;\n    fc=vec4(r,1.0);\n  }\n", $a = "#version 300 es\n  precision highp float;\n  in vec2 v_uv; out vec4 fc;\n  uniform sampler2D u_scene, u_glow;\n  void main(){\n    vec3 s=texture(u_scene,v_uv).rgb;\n    vec3 g=texture(u_glow,v_uv).rgb;\n    fc=vec4(1.0-exp(-(s+g*1.2+s*g*0.35)*1.15),1.0);\n  }\n";
//#endregion
//#region src/components/composables/useWebglFire.js
function eo(e, t, n) {
	let r = null, i = null, a = null, o = null, s = null, c = !1, l = 0, u = !1, d = null, f = null, p = null, m = null, h = null, g = null, _ = !1, v = null, y = null, b = null, x = null, S = {
		simTime: null,
		simSlider: null,
		simElapsed: null,
		simBack: null,
		blurDir: null,
		blurExt: null,
		blurTex: null,
		blurRes: null,
		compScene: null,
		compGlow: null
	}, C = !1, w = .7;
	yn(n, (e) => {
		C = e;
	}, { immediate: !0 }), yn(t, (e) => {
		w = e / 100;
	}, { immediate: !0 }), yn(n, (e) => {
		e && d == null ? d = performance.now() : e || (d = null), e && le();
	}, { flush: "post" }), Vn(() => tn(ne)), Wn(() => {
		a &&= (cancelAnimationFrame(a), null), o &&= (o.disconnect(), null), s &&= (clearTimeout(s), null), c = !1, se(), ce(), i && (i.removeEventListener("webglcontextlost", ee), i.removeEventListener("webglcontextrestored", te)), r = null, i = null;
	});
	function ee(e) {
		e.preventDefault();
	}
	function te() {
		_ = !1, ae(), _ && (T(), C && le());
	}
	function ne() {
		let t = e.value;
		if (!t) return;
		let n = t.getContext("webgl2", {
			preserveDrawingBuffer: !1,
			antialias: !1
		});
		if (!n) {
			console.warn("WebGL2 not supported");
			return;
		}
		r = n, i = t, t.addEventListener("webglcontextlost", ee), t.addEventListener("webglcontextrestored", te), ae(), _ && (o = new ResizeObserver(() => {
			clearTimeout(s), s = setTimeout(T, 80);
		}), o.observe(t), T(), re());
	}
	function T() {
		if (!r || !i) return;
		let e = i.getBoundingClientRect();
		if (!e.width || !e.height) return;
		let t = window.devicePixelRatio;
		i.width = Math.round(e.width * t), i.height = Math.round(e.height * t), se(), oe(), re();
	}
	function re() {
		C && (d ??= performance.now(), le());
	}
	function E(e, t) {
		let n = r.createShader(e);
		return r.shaderSource(n, t), r.compileShader(n), r.getShaderParameter(n, r.COMPILE_STATUS) ? n : (console.error(r.getShaderInfoLog(n)), r.deleteShader(n), null);
	}
	function ie(e, t) {
		let n = E(r.VERTEX_SHADER, e), i = E(r.FRAGMENT_SHADER, t);
		if (!n || !i) return null;
		let a = r.createProgram();
		return r.attachShader(a, n), r.attachShader(a, i), r.bindAttribLocation(a, 0, "a_pos"), r.linkProgram(a), r.deleteShader(n), r.deleteShader(i), r.getProgramParameter(a, r.LINK_STATUS) ? a : (console.error(r.getProgramInfoLog(a)), null);
	}
	function ae() {
		r && (f = ie(Xa, Za), p = ie(Xa, Qa), m = ie(Xa, $a), !(!f || !p || !m) && (h = r.createVertexArray(), r.bindVertexArray(h), g = r.createBuffer(), r.bindBuffer(r.ARRAY_BUFFER, g), r.bufferData(r.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			1,
			-1,
			-1,
			1,
			-1,
			1,
			1,
			-1,
			1,
			1
		]), r.STATIC_DRAW), r.enableVertexAttribArray(0), r.vertexAttribPointer(0, 2, r.FLOAT, !1, 0, 0), S.simTime = r.getUniformLocation(f, "u_time"), S.simSlider = r.getUniformLocation(f, "u_slider"), S.simElapsed = r.getUniformLocation(f, "u_elapsed"), S.simBack = r.getUniformLocation(f, "u_back"), S.blurDir = r.getUniformLocation(p, "u_dir"), S.blurExt = r.getUniformLocation(p, "u_ext"), S.blurTex = r.getUniformLocation(p, "u_tex"), S.blurRes = r.getUniformLocation(p, "u_res"), S.compScene = r.getUniformLocation(m, "u_scene"), S.compGlow = r.getUniformLocation(m, "u_glow"), _ = !0));
	}
	function D() {
		let e = r.createFramebuffer(), t = r.createTexture();
		return r.bindFramebuffer(r.FRAMEBUFFER, e), r.bindTexture(r.TEXTURE_2D, t), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, i.width, i.height, 0, r.RGBA, r.UNSIGNED_BYTE, null), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, t, 0), r.clearColor(0, 0, 0, 1), r.clear(r.COLOR_BUFFER_BIT), {
			fbo: e,
			tex: t
		};
	}
	function oe() {
		!r || !i || (v = D(), y = D(), b = D(), x = D());
	}
	function O(e) {
		!r || !e || (r.deleteFramebuffer(e.fbo), r.deleteTexture(e.tex));
	}
	function se() {
		O(v), v = null, O(y), y = null, O(b), b = null, O(x), x = null;
	}
	function ce() {
		r && (f &&= (r.deleteProgram(f), null), p &&= (r.deleteProgram(p), null), m &&= (r.deleteProgram(m), null), h &&= (r.deleteVertexArray(h), null), g &&= (r.deleteBuffer(g), null), _ = !1);
	}
	function le() {
		if (!((!v || !y) && (T(), !v || !y))) {
			if (c) {
				l = 0;
				return;
			}
			c = !0, l = 0, u = !1, r.bindFramebuffer(r.FRAMEBUFFER, v.fbo), r.clear(r.COLOR_BUFFER_BIT), r.bindFramebuffer(r.FRAMEBUFFER, y.fbo), r.clear(r.COLOR_BUFFER_BIT), a = requestAnimationFrame(k);
		}
	}
	function k(e) {
		let t = C;
		if (!t && !u) {
			if (++l > 180) {
				c = !1, a = null;
				return;
			}
			a = requestAnimationFrame(k);
			return;
		}
		l = 0, t && !u && (r.bindFramebuffer(r.FRAMEBUFFER, v.fbo), r.clear(r.COLOR_BUFFER_BIT), r.bindFramebuffer(r.FRAMEBUFFER, y.fbo), r.clear(r.COLOR_BUFFER_BIT)), u = t;
		let n = t ? (performance.now() - (d || 0)) / 1e3 : -1, o = w;
		r.viewport(0, 0, i.width, i.height), r.bindFramebuffer(r.FRAMEBUFFER, y.fbo), r.useProgram(f), r.uniform1f(S.simTime, e * .001), r.uniform1f(S.simSlider, o), r.uniform1f(S.simElapsed, n), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, v.tex), r.uniform1i(S.simBack, 0), r.drawArrays(r.TRIANGLES, 0, 6), r.useProgram(p), r.uniform2f(S.blurRes, i.width, i.height), r.bindFramebuffer(r.FRAMEBUFFER, b.fbo), r.uniform2f(S.blurDir, 1, 0), r.uniform1f(S.blurExt, 1), r.bindTexture(r.TEXTURE_2D, y.tex), r.uniform1i(S.blurTex, 0), r.drawArrays(r.TRIANGLES, 0, 6), r.bindFramebuffer(r.FRAMEBUFFER, x.fbo), r.uniform2f(S.blurDir, 0, 1), r.uniform1f(S.blurExt, 0), r.bindTexture(r.TEXTURE_2D, b.tex), r.drawArrays(r.TRIANGLES, 0, 6), r.bindFramebuffer(r.FRAMEBUFFER, null), r.useProgram(m), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, y.tex), r.uniform1i(S.compScene, 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, x.tex), r.uniform1i(S.compGlow, 1), r.drawArrays(r.TRIANGLES, 0, 6);
		let s = v;
		v = y, y = s, a = requestAnimationFrame(k);
	}
}
//#endregion
//#region \0plugin-vue:export-helper
var to = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, no = { class: "card-shadow" }, ro = { class: "dots-layer" }, io = ["value"], ao = /*#__PURE__*/ to({
	__name: "EffortCard",
	setup(e) {
		let { sliderValue: t, isActive: n, isFull: r, onInput: i } = Ya(), a = Math.random().toString(36).slice(2, 8), o = `squircle-${a}`, s = `squircle-track-${a}`, c = Zi(() => ({ clipPath: `url(#${o})` })), l = Zi(() => ({ clipPath: `url(#${s})` })), u = Zi(() => {
			let e = Math.min(t.value + 2, 100);
			return {
				maskImage: `linear-gradient(to right, black 0%, black ${e}%, transparent ${e}%)`,
				WebkitMaskImage: `linear-gradient(to right, black 0%, black ${e}%, transparent ${e}%)`
			};
		}), d = /* @__PURE__ */ Nt(null);
		return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches || eo(d, t, n), (e, a) => (pi(), vi(J, null, [X("svg", {
			class: "squircle-clip",
			xmlns: "http://www.w3.org/2000/svg",
			"aria-hidden": "true"
		}, [X("defs", null, [X("clipPath", {
			id: o,
			clipPathUnits: "objectBoundingBox"
		}, [...a[1] ||= [X("path", { d: "M 0.053,0\n             C 0.029,0 0.012,0.008 0.005,0.02\n             C 0.002,0.028 0,0.038 0,0.053\n             L 0,0.947\n             C 0,0.962 0.002,0.972 0.005,0.98\n             C 0.012,0.992 0.029,1 0.053,1\n             L 0.947,1\n             C 0.971,1 0.988,0.992 0.995,0.98\n             C 0.998,0.972 1,0.962 1,0.947\n             L 1,0.053\n             C 1,0.038 0.998,0.028 0.995,0.02\n             C 0.988,0.008 0.971,0 0.947,0\n             Z" }, null, -1)]]), X("clipPath", {
			id: s,
			clipPathUnits: "objectBoundingBox"
		}, [...a[2] ||= [X("path", { d: "M 0.033,0\n             C 0.018,0 0.007,0.012 0.003,0.035\n             C 0.001,0.055 0,0.1 0,0.15\n             L 0,0.85\n             C 0,0.9 0.001,0.945 0.003,0.965\n             C 0.007,0.988 0.018,1 0.033,1\n             L 0.967,1\n             C 0.982,1 0.993,0.988 0.997,0.965\n             C 0.999,0.945 1,0.9 1,0.85\n             L 1,0.15\n             C 1,0.1 0.999,0.055 0.997,0.035\n             C 0.993,0.012 0.982,0 0.967,0\n             Z" }, null, -1)]])])]), X("div", no, [X("div", {
			class: "card",
			style: k(c.value)
		}, [a[4] ||= X("div", { class: "scale-labels" }, [X("span", null, "浅色"), X("span", null, "深色")], -1), X("div", {
			class: A(["track-wrapper", {
				active: It(n),
				full: It(r)
			}]),
			style: k(l.value)
		}, [
			a[3] ||= X("div", { class: "track-bg" }, null, -1),
			X("div", ro, [(pi(), vi(J, null, Zn(5, (e) => X("span", {
				class: "dot",
				key: e
			})), 64))]),
			X("canvas", {
				ref_key: "canvasRef",
				ref: d,
				style: k(u.value)
			}, null, 4),
			X("input", {
				type: "range",
				min: "0",
				max: "100",
				value: It(t),
				class: A({ glowing: It(n) }),
				onInput: a[0] ||= (...e) => It(i) && It(i)(...e)
			}, null, 42, io)
		], 6)], 4)])], 64));
	}
}, [["__scopeId", "data-v-b9fc240d"]]), oo = document.getElementById("theme-slider");
if (oo) {
	Ba(ao).mount(oo);
	let e = document.getElementById("themeBtn");
	e && (e.hidden = !0);
}
//#endregion
