//#region node_modules/.pnpm/@vue+shared@3.5.38/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = process.env.NODE_ENV === "production" ? {} : Object.freeze({}), n = process.env.NODE_ENV === "production" ? [] : Object.freeze([]), r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ee = /* @__PURE__ */ e("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"), te = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ne = /-\w/g, E = te((e) => e.replace(ne, (e) => e.slice(1).toUpperCase())), re = /\B([A-Z])/g, D = te((e) => e.replace(re, "-$1").toLowerCase()), O = te((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = te((e) => e ? `on${O(e)}` : ""), k = (e, t) => !Object.is(e, t), ae = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, oe = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, A = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, se, ce = () => se ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function le(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? pe(r) : le(r);
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
function me(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = me(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var he = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", ge = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", _e = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics", ve = /* @__PURE__ */ e(he), ye = /* @__PURE__ */ e(ge), be = /* @__PURE__ */ e(_e), xe = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Se = /* @__PURE__ */ e(xe);
xe + "";
function Ce(e) {
	return !!e || e === "";
}
function we(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = Te(e[r], t[r]);
	return n;
}
function Te(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? we(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !Te(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
var Ee = (e) => !!(e && e.__v_isRef === !0), De = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Ee(e) ? De(e.value) : JSON.stringify(e, Oe, 2) : String(e), Oe = (e, t) => Ee(t) ? Oe(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ke(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ke(e)) } : _(t) ? ke(t) : v(t) && !d(t) && !C(t) ? String(t) : t, ke = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e;
//#endregion
//#region node_modules/.pnpm/@vue+reactivity@3.5.38/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
function j(e, ...t) {
	console.warn(`[Vue warn] ${e}`, ...t);
}
var M, Ae = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && M && (M.active ? (this.parent = M, this.index = (M.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = M;
			try {
				return M = this, e();
			} finally {
				M = t;
			}
		} else process.env.NODE_ENV !== "production" && this._warnOnRun && j("cannot run an inactive effect scope.");
	}
	on() {
		++this._on === 1 && (this.prevScope = M, M = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (M === this) M = this.prevScope;
			else {
				let e = M;
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
function je() {
	return M;
}
var N, Me = /* @__PURE__ */ new WeakSet(), Ne = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, M && (M.active ? M.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Me.has(this) && (Me.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Le(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Je(this), Be(this);
		let e = N, t = P;
		N = this, P = !0;
		try {
			return this.fn();
		} finally {
			process.env.NODE_ENV !== "production" && N !== this && j("Active effect was not restored correctly - this is likely a Vue internal bug."), Ve(this), N = e, P = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) We(e);
			this.deps = this.depsTail = void 0, Je(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Me.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		He(this) && this.run();
	}
	get dirty() {
		return He(this);
	}
}, Pe = 0, Fe, Ie;
function Le(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Ie, Ie = e;
		return;
	}
	e.next = Fe, Fe = e;
}
function Re() {
	Pe++;
}
function ze() {
	if (--Pe > 0) return;
	if (Ie) {
		let e = Ie;
		for (Ie = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Fe;) {
		let t = Fe;
		for (Fe = void 0; t;) {
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
function Be(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ve(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), We(r), Ge(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function He(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ue(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ue(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ye) || (e.globalVersion = Ye, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !He(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = N, r = P;
	N = e, P = !0;
	try {
		Be(e);
		let n = e.fn(e._value);
		(t.version === 0 || k(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		N = n, P = r, Ve(e), e.flags &= -3;
	}
}
function We(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), process.env.NODE_ENV !== "production" && n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) We(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ge(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var P = !0, Ke = [];
function F() {
	Ke.push(P), P = !1;
}
function qe() {
	let e = Ke.pop();
	P = e === void 0 ? !0 : e;
}
function Je(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = N;
		N = void 0;
		try {
			t();
		} finally {
			N = e;
		}
	}
}
var Ye = 0, Xe = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ze = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
	}
	track(e) {
		if (!N || !P || N === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== N) t = this.activeLink = new Xe(N, this), N.deps ? (t.prevDep = N.depsTail, N.depsTail.nextDep = t, N.depsTail = t) : N.deps = N.depsTail = t, Qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = N.depsTail, t.nextDep = void 0, N.depsTail.nextDep = t, N.depsTail = t, N.deps === t && (N.deps = e);
		}
		return process.env.NODE_ENV !== "production" && N.onTrack && N.onTrack(s({ effect: N }, e)), t;
	}
	trigger(e) {
		this.version++, Ye++, this.notify(e);
	}
	notify(e) {
		Re();
		try {
			if (process.env.NODE_ENV !== "production") for (let t = this.subsHead; t; t = t.nextSub) t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(s({ effect: t.sub }, e));
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			ze();
		}
	}
};
function Qe(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Qe(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
	}
}
var $e = /* @__PURE__ */ new WeakMap(), et = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "Object iterate"), tt = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "Map keys iterate"), nt = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "Array iterate");
function I(e, t, n) {
	if (P && N) {
		let r = $e.get(e);
		r || $e.set(e, r = /* @__PURE__ */ new Map());
		let i = r.get(n);
		i || (r.set(n, i = new Ze()), i.map = r, i.key = n), process.env.NODE_ENV === "production" ? i.track() : i.track({
			target: e,
			type: t,
			key: n
		});
	}
}
function rt(e, t, n, r, i, a) {
	let o = $e.get(e);
	if (!o) {
		Ye++;
		return;
	}
	let s = (o) => {
		o && (process.env.NODE_ENV === "production" ? o.trigger() : o.trigger({
			target: e,
			type: t,
			key: n,
			newValue: r,
			oldValue: i,
			oldTarget: a
		}));
	};
	if (Re(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === nt || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(nt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(et)), f(e) && s(o.get(tt)));
				break;
			case "delete":
				i || (s(o.get(et)), f(e) && s(o.get(tt)));
				break;
			case "set":
				f(e) && s(o.get(et));
				break;
		}
	}
	ze();
}
function it(e) {
	let t = /* @__PURE__ */ z(e);
	return t === e ? t : (I(t, "iterate", nt), /* @__PURE__ */ R(e) ? t : t.map(B));
}
function at(e) {
	return I(e = /* @__PURE__ */ z(e), "iterate", nt), e;
}
function ot(e, t) {
	return /* @__PURE__ */ L(e) ? Jt(/* @__PURE__ */ Gt(e) ? B(t) : t) : B(t);
}
var st = {
	__proto__: null,
	[Symbol.iterator]() {
		return ct(this, Symbol.iterator, (e) => ot(this, e));
	},
	concat(...e) {
		return it(this).concat(...e.map((e) => d(e) ? it(e) : e));
	},
	entries() {
		return ct(this, "entries", (e) => (e[1] = ot(this, e[1]), e));
	},
	every(e, t) {
		return ut(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ut(this, "filter", e, t, (e) => e.map((e) => ot(this, e)), arguments);
	},
	find(e, t) {
		return ut(this, "find", e, t, (e) => ot(this, e), arguments);
	},
	findIndex(e, t) {
		return ut(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ut(this, "findLast", e, t, (e) => ot(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ut(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ut(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ft(this, "includes", e);
	},
	indexOf(...e) {
		return ft(this, "indexOf", e);
	},
	join(e) {
		return it(this).join(e);
	},
	lastIndexOf(...e) {
		return ft(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ut(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return pt(this, "pop");
	},
	push(...e) {
		return pt(this, "push", e);
	},
	reduce(e, ...t) {
		return dt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return dt(this, "reduceRight", e, t);
	},
	shift() {
		return pt(this, "shift");
	},
	some(e, t) {
		return ut(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return pt(this, "splice", e);
	},
	toReversed() {
		return it(this).toReversed();
	},
	toSorted(e) {
		return it(this).toSorted(e);
	},
	toSpliced(...e) {
		return it(this).toSpliced(...e);
	},
	unshift(...e) {
		return pt(this, "unshift", e);
	},
	values() {
		return ct(this, "values", (e) => ot(this, e));
	}
};
function ct(e, t, n) {
	let r = at(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ R(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var lt = Array.prototype;
function ut(e, t, n, r, i, a) {
	let o = at(e), s = o !== e && !/* @__PURE__ */ R(e), c = o[t];
	if (c !== lt[t]) {
		let t = c.apply(e, a);
		return s ? B(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, ot(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function dt(e, t, n, r) {
	let i = at(e), a = i !== e && !/* @__PURE__ */ R(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = ot(e, t)), n.call(this, t, ot(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? ot(e, c) : c;
}
function ft(e, t, n) {
	let r = /* @__PURE__ */ z(e);
	I(r, "iterate", nt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Kt(n[0]) ? (n[0] = /* @__PURE__ */ z(n[0]), r[t](...n)) : i;
}
function pt(e, t, n = []) {
	F(), Re();
	let r = (/* @__PURE__ */ z(e))[t].apply(e, n);
	return ze(), qe(), r;
}
var mt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), ht = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function gt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ z(this);
	return I(t, "has", e), t.hasOwnProperty(e);
}
var _t = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Rt : Lt : i ? It : Ft).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = st[t])) return e;
			if (t === "hasOwnProperty") return gt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ V(e) ? e : n);
		if ((_(t) ? ht.has(t) : mt(t)) || (r || I(e, "get", t), i)) return o;
		if (/* @__PURE__ */ V(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Ht(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Ht(o) : /* @__PURE__ */ Bt(o) : o;
	}
}, vt = class extends _t {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let r = /* @__PURE__ */ L(i);
			if (!/* @__PURE__ */ R(n) && !/* @__PURE__ */ L(n) && (i = /* @__PURE__ */ z(i), n = /* @__PURE__ */ z(n)), !a && /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n)) return r ? (process.env.NODE_ENV !== "production" && j(`Set operation on key "${String(t)}" failed: target is readonly.`, e[t]), !0) : (i.value = n, !0);
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ V(e) ? e : r);
		return e === /* @__PURE__ */ z(r) && (o ? k(n, i) && rt(e, "set", t, n, i) : rt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && rt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !ht.has(t)) && I(e, "has", t), n;
	}
	ownKeys(e) {
		return I(e, "iterate", d(e) ? "length" : et), Reflect.ownKeys(e);
	}
}, yt = class extends _t {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return process.env.NODE_ENV !== "production" && j(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
	}
	deleteProperty(e, t) {
		return process.env.NODE_ENV !== "production" && j(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
	}
}, bt = /* @__PURE__ */ new vt(), xt = /* @__PURE__ */ new yt(), St = /* @__PURE__ */ new vt(!0), Ct = /* @__PURE__ */ new yt(!0), wt = (e) => e, Tt = (e) => Reflect.getPrototypeOf(e);
function Et(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ z(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? wt : t ? Jt : B;
		return !t && I(a, "iterate", l ? tt : et), s(Object.create(u), { next() {
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
function Dt(e) {
	return function(...t) {
		if (process.env.NODE_ENV !== "production") {
			let n = t[0] ? `on key "${t[0]}" ` : "";
			j(`${O(e)} operation ${n}failed: target is readonly.`, /* @__PURE__ */ z(this));
		}
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Ot(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ z(r), a = /* @__PURE__ */ z(n);
			e || (k(n, a) && I(i, "get", n), I(i, "get", a));
			let { has: o } = Tt(i), s = t ? wt : e ? Jt : B;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && I(/* @__PURE__ */ z(t), "iterate", et), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ z(n), i = /* @__PURE__ */ z(t);
			return e || (k(t, i) && I(r, "has", t), I(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ z(a), s = t ? wt : e ? Jt : B;
			return !e && I(o, "iterate", et), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: Dt("add"),
		set: Dt("set"),
		delete: Dt("delete"),
		clear: Dt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ z(this), r = Tt(n), i = /* @__PURE__ */ z(e), a = !t && !/* @__PURE__ */ R(e) && !/* @__PURE__ */ L(e) ? i : e;
			return r.has.call(n, a) || k(e, a) && r.has.call(n, e) || k(i, a) && r.has.call(n, i) || (n.add(a), rt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ R(n) && !/* @__PURE__ */ L(n) && (n = /* @__PURE__ */ z(n));
			let r = /* @__PURE__ */ z(this), { has: i, get: a } = Tt(r), o = i.call(r, e);
			o ? process.env.NODE_ENV !== "production" && Pt(r, i, e) : (e = /* @__PURE__ */ z(e), o = i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? k(n, s) && rt(r, "set", e, n, s) : rt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ z(this), { has: n, get: r } = Tt(t), i = n.call(t, e);
			i ? process.env.NODE_ENV !== "production" && Pt(t, n, e) : (e = /* @__PURE__ */ z(e), i = n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && rt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ z(this), t = e.size !== 0, n = process.env.NODE_ENV === "production" ? void 0 : f(e) ? new Map(e) : new Set(e), r = e.clear();
			return t && rt(e, "clear", void 0, void 0, n), r;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Et(r, e, t);
	}), n;
}
function kt(e, t) {
	let n = Ot(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var At = { get: /* @__PURE__ */ kt(!1, !1) }, jt = { get: /* @__PURE__ */ kt(!1, !0) }, Mt = { get: /* @__PURE__ */ kt(!0, !1) }, Nt = { get: /* @__PURE__ */ kt(!0, !0) };
function Pt(e, t, n) {
	let r = /* @__PURE__ */ z(n);
	if (r !== n && t.call(e, r)) {
		let t = S(e);
		j(`Reactive ${t} contains both the raw and reactive versions of the same object${t === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
	}
}
var Ft = /* @__PURE__ */ new WeakMap(), It = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ new WeakMap(), Rt = /* @__PURE__ */ new WeakMap();
function zt(e) {
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
function Bt(e) {
	return /* @__PURE__ */ L(e) ? e : Wt(e, !1, bt, At, Ft);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return Wt(e, !1, St, jt, It);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return Wt(e, !0, xt, Mt, Lt);
}
// @__NO_SIDE_EFFECTS__
function Ut(e) {
	return Wt(e, !0, Ct, Nt, Rt);
}
function Wt(e, t, n, r, i) {
	if (!v(e)) return process.env.NODE_ENV !== "production" && j(`value cannot be made ${t ? "readonly" : "reactive"}: ${String(e)}`), e;
	if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = zt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return /* @__PURE__ */ L(e) ? /* @__PURE__ */ Gt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function L(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ z(t) : e;
}
function qt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && oe(e, "__v_skip", !0), e;
}
var B = (e) => v(e) ? /* @__PURE__ */ Bt(e) : e, Jt = (e) => v(e) ? /* @__PURE__ */ Ht(e) : e;
// @__NO_SIDE_EFFECTS__
function V(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
	return Xt(e, !1);
}
function Xt(e, t) {
	return /* @__PURE__ */ V(e) ? e : new Zt(e, t);
}
var Zt = class {
	constructor(e, t) {
		this.dep = new Ze(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ z(e), this._value = t ? e : B(e), this.__v_isShallow = t;
	}
	get value() {
		return process.env.NODE_ENV === "production" ? this.dep.track() : this.dep.track({
			target: this,
			type: "get",
			key: "value"
		}), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ R(e) || /* @__PURE__ */ L(e);
		e = n ? e : /* @__PURE__ */ z(e), k(e, t) && (this._rawValue = e, this._value = n ? e : B(e), process.env.NODE_ENV === "production" ? this.dep.trigger() : this.dep.trigger({
			target: this,
			type: "set",
			key: "value",
			newValue: e,
			oldValue: t
		}));
	}
};
function Qt(e) {
	return /* @__PURE__ */ V(e) ? e.value : e;
}
var $t = {
	get: (e, t, n) => t === "__v_raw" ? e : Qt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function en(e) {
	return /* @__PURE__ */ Gt(e) ? e : new Proxy(e, $t);
}
var tn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ze(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ye - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && N !== this) return Le(this, !0), !0;
		process.env.NODE_ENV;
	}
	get value() {
		let e = process.env.NODE_ENV === "production" ? this.dep.track() : this.dep.track({
			target: this,
			type: "get",
			key: "value"
		});
		return Ue(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter ? this.setter(e) : process.env.NODE_ENV !== "production" && j("Write operation failed: computed value is readonly");
	}
};
// @__NO_SIDE_EFFECTS__
function nn(e, t, n = !1) {
	let r, i;
	h(e) ? r = e : (r = e.get, i = e.set);
	let a = new tn(r, i, n);
	return process.env.NODE_ENV !== "production" && t && !n && (a.onTrack = t.onTrack, a.onTrigger = t.onTrigger), a;
}
var rn = {}, an = /* @__PURE__ */ new WeakMap(), on = void 0;
function sn(e, t = !1, n = on) {
	if (n) {
		let t = an.get(n);
		t || an.set(n, t = []), t.push(e);
	} else process.env.NODE_ENV !== "production" && !t && j("onWatcherCleanup() was called when there was no active watcher to associate with.");
}
function cn(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => {
		(i.onWarn || j)("Invalid watch source: ", e, "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.");
	}, m = (e) => o ? e : /* @__PURE__ */ R(e) || o === !1 || o === 0 ? ln(e, 1) : ln(e), g, _, v, y, b = !1, x = !1;
	if (/* @__PURE__ */ V(e) ? (_ = () => e.value, b = /* @__PURE__ */ R(e)) : /* @__PURE__ */ Gt(e) ? (_ = () => m(e), b = !0) : d(e) ? (x = !0, b = e.some((e) => /* @__PURE__ */ Gt(e) || /* @__PURE__ */ R(e)), _ = () => e.map((e) => {
		if (/* @__PURE__ */ V(e)) return e.value;
		if (/* @__PURE__ */ Gt(e)) return m(e);
		if (h(e)) return f ? f(e, 2) : e();
		process.env.NODE_ENV !== "production" && p(e);
	})) : h(e) ? _ = n ? f ? () => f(e, 2) : e : () => {
		if (v) {
			F();
			try {
				v();
			} finally {
				qe();
			}
		}
		let t = on;
		on = g;
		try {
			return f ? f(e, 3, [y]) : e(y);
		} finally {
			on = t;
		}
	} : (_ = r, process.env.NODE_ENV !== "production" && p(e)), n && o) {
		let e = _, t = o === !0 ? Infinity : o;
		_ = () => ln(e(), t);
	}
	let S = je(), C = () => {
		g.stop(), S && S.active && c(S.effects, g);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return C(), n;
		};
	}
	let w = x ? Array(e.length).fill(rn) : rn, T = (e) => {
		if (!(!(g.flags & 1) || !g.dirty && !e)) if (n) {
			let t = g.run();
			if (e || o || b || (x ? t.some((e, t) => k(e, w[t])) : k(t, w))) {
				v && v();
				let e = on;
				on = g;
				try {
					let e = [
						t,
						w === rn ? void 0 : x && w[0] === rn ? [] : w,
						y
					];
					w = t, f ? f(n, 3, e) : n(...e);
				} finally {
					on = e;
				}
			}
		} else g.run();
	};
	return u && u(T), g = new Ne(_), g.scheduler = l ? () => l(T, !1) : T, y = (e) => sn(e, !1, g), v = g.onStop = () => {
		let e = an.get(g);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			an.delete(g);
		}
	}, process.env.NODE_ENV !== "production" && (g.onTrack = i.onTrack, g.onTrigger = i.onTrigger), n ? a ? T(!0) : w = g.run() : l ? l(T.bind(null, !0), !0) : g.run(), C.pause = g.pause.bind(g), C.resume = g.resume.bind(g), C.stop = C, C;
}
function ln(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ V(e)) ln(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) ln(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		ln(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) ln(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && ln(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.38/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var un = [];
function dn(e) {
	un.push(e);
}
function fn() {
	un.pop();
}
var pn = !1;
function H(e, ...t) {
	if (pn) return;
	pn = !0, F();
	let n = un.length ? un[un.length - 1].component : null, r = n && n.appContext.config.warnHandler, i = mn();
	if (r) bn(r, n, 11, [
		e + t.map((e) => e.toString?.call(e) ?? JSON.stringify(e)).join(""),
		n && n.proxy,
		i.map(({ vnode: e }) => `at <${Ro(n, e.type)}>`).join("\n"),
		i
	]);
	else {
		let n = [`[Vue warn]: ${e}`, ...t];
		i.length && n.push("\n", ...hn(i)), console.warn(...n);
	}
	qe(), pn = !1;
}
function mn() {
	let e = un[un.length - 1];
	if (!e) return [];
	let t = [];
	for (; e;) {
		let n = t[0];
		n && n.vnode === e ? n.recurseCount++ : t.push({
			vnode: e,
			recurseCount: 0
		});
		let r = e.component && e.component.parent;
		e = r && r.vnode;
	}
	return t;
}
function hn(e) {
	let t = [];
	return e.forEach((e, n) => {
		t.push(...n === 0 ? [] : ["\n"], ...gn(e));
	}), t;
}
function gn({ vnode: e, recurseCount: t }) {
	let n = t > 0 ? `... (${t} recursive calls)` : "", r = e.component ? e.component.parent == null : !1, i = ` at <${Ro(e.component, e.type, r)}`, a = ">" + n;
	return e.props ? [
		i,
		..._n(e.props),
		a
	] : [i + a];
}
function _n(e) {
	let t = [], n = Object.keys(e);
	return n.slice(0, 3).forEach((n) => {
		t.push(...vn(n, e[n]));
	}), n.length > 3 && t.push(" ..."), t;
}
function vn(e, t, n) {
	return g(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : /* @__PURE__ */ V(t) ? (t = vn(e, /* @__PURE__ */ z(t.value), !0), n ? t : [
		`${e}=Ref<`,
		t,
		">"
	]) : h(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = /* @__PURE__ */ z(t), n ? t : [`${e}=`, t]);
}
var yn = {
	sp: "serverPrefetch hook",
	bc: "beforeCreate hook",
	c: "created hook",
	bm: "beforeMount hook",
	m: "mounted hook",
	bu: "beforeUpdate hook",
	u: "updated",
	bum: "beforeUnmount hook",
	um: "unmounted hook",
	a: "activated hook",
	da: "deactivated hook",
	ec: "errorCaptured hook",
	rtc: "renderTracked hook",
	rtg: "renderTriggered hook",
	0: "setup function",
	1: "render function",
	2: "watcher getter",
	3: "watcher callback",
	4: "watcher cleanup function",
	5: "native event handler",
	6: "component event handler",
	7: "vnode hook",
	8: "directive hook",
	9: "transition hook",
	10: "app errorHandler",
	11: "app warnHandler",
	12: "ref function",
	13: "async component loader",
	14: "scheduler flush",
	15: "component update",
	16: "app unmount cleanup function"
};
function bn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		xn(e, t, n);
	}
}
function U(e, t, n, r) {
	if (h(e)) {
		let i = bn(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			xn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(U(e[a], t, n, r));
		return i;
	} else process.env.NODE_ENV !== "production" && H(`Invalid value type passed to callWithAsyncErrorHandling(): ${typeof e}`);
}
function xn(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = process.env.NODE_ENV === "production" ? `https://vuejs.org/error-reference/#runtime-${r}` : yn[r];
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			F(), bn(o, null, 10, [
				e,
				i,
				a
			]), qe();
			return;
		}
	}
	Sn(e, r, a, i, s);
}
function Sn(e, t, n, r = !0, i = !1) {
	if (process.env.NODE_ENV !== "production") {
		let i = yn[t];
		if (n && dn(n), H(`Unhandled error${i ? ` during execution of ${i}` : ""}`), n && fn(), r) throw e;
		console.error(e);
	} else if (i) throw e;
	else console.error(e);
}
var W = [], Cn = -1, wn = [], Tn = null, En = 0, Dn = /* @__PURE__ */ Promise.resolve(), On = null, kn = 100;
function An(e) {
	let t = On || Dn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function jn(e) {
	let t = Cn + 1, n = W.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = W[r], a = Ln(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Mn(e) {
	if (!(e.flags & 1)) {
		let t = Ln(e), n = W[W.length - 1];
		!n || !(e.flags & 2) && t >= Ln(n) ? W.push(e) : W.splice(jn(t), 0, e), e.flags |= 1, Nn();
	}
}
function Nn() {
	On ||= Dn.then(Rn);
}
function Pn(e) {
	d(e) ? wn.push(...e) : Tn && e.id === -1 ? Tn.splice(En + 1, 0, e) : e.flags & 1 || (wn.push(e), e.flags |= 1), Nn();
}
function Fn(e, t, n = Cn + 1) {
	for (process.env.NODE_ENV !== "production" && (t ||= /* @__PURE__ */ new Map()); n < W.length; n++) {
		let r = W[n];
		if (r && r.flags & 2) {
			if (e && r.id !== e.uid || process.env.NODE_ENV !== "production" && zn(t, r)) continue;
			W.splice(n, 1), n--, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
		}
	}
}
function In(e) {
	if (wn.length) {
		let t = [...new Set(wn)].sort((e, t) => Ln(e) - Ln(t));
		if (wn.length = 0, Tn) {
			Tn.push(...t);
			return;
		}
		for (Tn = t, process.env.NODE_ENV !== "production" && (e ||= /* @__PURE__ */ new Map()), En = 0; En < Tn.length; En++) {
			let t = Tn[En];
			process.env.NODE_ENV !== "production" && zn(e, t) || (t.flags & 4 && (t.flags &= -2), t.flags & 8 || t(), t.flags &= -2);
		}
		Tn = null, En = 0;
	}
}
var Ln = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Rn(e) {
	process.env.NODE_ENV !== "production" && (e ||= /* @__PURE__ */ new Map());
	let t = process.env.NODE_ENV === "production" ? r : (t) => zn(e, t);
	try {
		for (Cn = 0; Cn < W.length; Cn++) {
			let e = W[Cn];
			if (e && !(e.flags & 8)) {
				if (process.env.NODE_ENV !== "production" && t(e)) continue;
				e.flags & 4 && (e.flags &= -2), bn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2);
			}
		}
	} finally {
		for (; Cn < W.length; Cn++) {
			let e = W[Cn];
			e && (e.flags &= -2);
		}
		Cn = -1, W.length = 0, In(e), On = null, (W.length || wn.length) && Rn(e);
	}
}
function zn(e, t) {
	let n = e.get(t) || 0;
	if (n > kn) {
		let e = t.i, n = e && Lo(e.type);
		return xn(`Maximum recursive updates exceeded${n ? ` in component <${n}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`, null, 10), !0;
	}
	return e.set(t, n + 1), !1;
}
var G = !1, Bn = (e) => {
	try {
		return G;
	} finally {
		G = e;
	}
}, Vn = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== "production" && (ce().__VUE_HMR_RUNTIME__ = {
	createRecord: Xn(Gn),
	rerender: Xn(qn),
	reload: Xn(Jn)
});
var Hn = /* @__PURE__ */ new Map();
function Un(e) {
	let t = e.type.__hmrId, n = Hn.get(t);
	n ||= (Gn(t, e.type), Hn.get(t)), n.instances.add(e);
}
function Wn(e) {
	Hn.get(e.type.__hmrId).instances.delete(e);
}
function Gn(e, t) {
	return Hn.has(e) ? !1 : (Hn.set(e, {
		initialDef: Kn(t),
		instances: /* @__PURE__ */ new Set()
	}), !0);
}
function Kn(e) {
	return zo(e) ? e.__vccOpts : e;
}
function qn(e, t) {
	let n = Hn.get(e);
	n && (n.initialDef.render = t, [...n.instances].forEach((e) => {
		t && (e.render = t, Kn(e.type).render = t), e.renderCache = [], G = !0, e.job.flags & 8 || e.update(), G = !1;
	}));
}
function Jn(e, t) {
	let n = Hn.get(e);
	if (!n) return;
	t = Kn(t), Yn(n.initialDef, t);
	let r = [...n.instances];
	for (let e = 0; e < r.length; e++) {
		let i = r[e], a = Kn(i.type), o = Vn.get(a);
		o || (a !== n.initialDef && Yn(a, t), Vn.set(a, o = /* @__PURE__ */ new Set())), o.add(i), i.appContext.propsCache.delete(i.type), i.appContext.emitsCache.delete(i.type), i.appContext.optionsCache.delete(i.type), i.ceReload ? (o.add(i), i.ceReload(t.styles), o.delete(i)) : i.parent ? Mn(() => {
			i.job.flags & 8 || (G = !0, i.parent.update(), G = !1, o.delete(i));
		}) : i.appContext.reload ? i.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn("[HMR] Root or manually mounted instance modified. Full reload required."), i.root.ce && i !== i.root && i.root.ce._removeChildStyle(a);
	}
	Pn(() => {
		Vn.clear();
	});
}
function Yn(e, t) {
	s(e, t);
	for (let n in e) n !== "__file" && !(n in t) && delete e[n];
}
function Xn(e) {
	return (t, n) => {
		try {
			return e(t, n);
		} catch (e) {
			console.error(e), console.warn("[HMR] Something went wrong during Vue component hot-reload. Full reload required.");
		}
	};
}
var Zn, Qn = [], $n = !1;
function er(e, ...t) {
	Zn ? Zn.emit(e, ...t) : $n || Qn.push({
		event: e,
		args: t
	});
}
function tr(e, t) {
	Zn = e, Zn ? (Zn.enabled = !0, Qn.forEach(({ event: e, args: t }) => Zn.emit(e, ...t)), Qn = []) : typeof window < "u" && window.HTMLElement && !(window.navigator?.userAgent)?.includes("jsdom") ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((e) => {
		tr(e, t);
	}), setTimeout(() => {
		Zn || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, $n = !0, Qn = []);
	}, 3e3)) : ($n = !0, Qn = []);
}
function nr(e, t) {
	er("app:init", e, t, {
		Fragment: Y,
		Text: za,
		Comment: Ba,
		Static: Va
	});
}
function rr(e) {
	er("app:unmount", e);
}
var ir = /* @__PURE__ */ cr("component:added"), ar = /* @__PURE__ */ cr("component:updated"), or = /* @__PURE__ */ cr("component:removed"), sr = (e) => {
	Zn && typeof Zn.cleanupBuffer == "function" && !Zn.cleanupBuffer(e) && or(e);
};
// @__NO_SIDE_EFFECTS__
function cr(e) {
	return (t) => {
		er(e, t.appContext.app, t.uid, t.parent ? t.parent.uid : void 0, t);
	};
}
var lr = /* @__PURE__ */ dr("perf:start"), ur = /* @__PURE__ */ dr("perf:end");
function dr(e) {
	return (t, n, r) => {
		er(e, t.appContext.app, t.uid, t, n, r);
	};
}
function fr(e, t, n) {
	er("component:emit", e.appContext.app, e, t, n);
}
var K = null, pr = null;
function mr(e) {
	let t = K;
	return K = e, pr = e && e.type.__scopeId || null, t;
}
function hr(e, t = K, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Ka(-1);
		let i = mr(t), a;
		try {
			a = e(...n);
		} finally {
			mr(i), r._d && Ka(1);
		}
		return process.env.NODE_ENV !== "production" && ar(t), a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function gr(e) {
	ee(e) && H("Do not use built-in directive ids as custom directive id: " + e);
}
function _r(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (F(), U(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), qe());
	}
}
function vr(e, t) {
	if (process.env.NODE_ENV !== "production" && (!$ || $.isMounted) && H("provide() can only be used inside setup()."), $) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function yr(e, t, n = !1) {
	let r = ho();
	if (r || ki) {
		let i = ki ? ki._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
		process.env.NODE_ENV !== "production" && H(`injection "${String(e)}" not found.`);
	} else process.env.NODE_ENV !== "production" && H("inject() can only be used inside setup() or functional components.");
}
var br = /* @__PURE__ */ Symbol.for("v-scx"), xr = () => {
	{
		let e = yr(br);
		return e || process.env.NODE_ENV !== "production" && H("Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build."), e;
	}
};
function Sr(e, t, n) {
	return process.env.NODE_ENV !== "production" && !h(t) && H("`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."), Cr(e, t, n);
}
function Cr(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i;
	process.env.NODE_ENV !== "production" && !n && (a !== void 0 && H("watch() \"immediate\" option is only respected when using the watch(source, callback, options?) signature."), o !== void 0 && H("watch() \"deep\" option is only respected when using the watch(source, callback, options?) signature."), l !== void 0 && H("watch() \"once\" option is only respected when using the watch(source, callback, options?) signature."));
	let u = s({}, i);
	process.env.NODE_ENV !== "production" && (u.onWarn = H);
	let d = n && a || !n && c !== "post", f;
	if (Co) {
		if (c === "sync") {
			let e = xr();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = $;
	u.call = (e, t, n) => U(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		J(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : Mn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = cn(e, n, u);
	return Co && (f ? f.push(h) : d && h()), h;
}
function wr(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Tr(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = vo(this), s = Cr(i, a.bind(r), n);
	return o(), s;
}
function Tr(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Er = /* @__PURE__ */ Symbol("_vte"), Dr = (e) => e.__isTeleport, Or = /* @__PURE__ */ Symbol("_leaveCb");
function kr(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, kr(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Ar(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
var jr = /* @__PURE__ */ new WeakSet();
function Mr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Nr = /* @__PURE__ */ new WeakMap();
function Pr(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Pr(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Ir(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Pr(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Po(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e;
	if (process.env.NODE_ENV !== "production" && !f) {
		H("Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.");
		return;
	}
	let m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ z(v), b = v === t ? i : (e) => process.env.NODE_ENV !== "production" && (u(y, e) && !/* @__PURE__ */ V(y[e]) && H(`Template ref "${e}" used on a non-ref value. It will not work in the production build.`), jr.has(y[e])) || Mr(_, e) ? !1 : u(y, e), x = (e, t) => !(process.env.NODE_ENV !== "production" && jr.has(e) || t && Mr(_, t));
	if (m != null && m !== p) {
		if (Fr(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ V(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) bn(p, f, 12, [l, _]);
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
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n ? (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l)) : process.env.NODE_ENV !== "production" && H("Invalid template ref type:", p, `(${typeof p})`);
			};
			if (l) {
				let t = () => {
					i(), Nr.delete(e);
				};
				t.id = -1, Nr.set(e, t), J(t, r);
			} else Fr(e), i();
		} else process.env.NODE_ENV !== "production" && H("Invalid template ref type:", p, `(${typeof p})`);
	}
}
function Fr(e) {
	let t = Nr.get(e);
	t && (t.flags |= 8, Nr.delete(e));
}
ce().requestIdleCallback, ce().cancelIdleCallback;
var Ir = (e) => !!e.type.__asyncLoader, Lr = (e) => e.type.__isKeepAlive;
function Rr(e, t) {
	Br(e, "a", t);
}
function zr(e, t) {
	Br(e, "da", t);
}
function Br(e, t, n = $) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Hr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Lr(e.parent.vnode) && Vr(r, t, n, e), e = e.parent;
	}
}
function Vr(e, t, n, r) {
	let i = Hr(t, e, r, !0);
	Yr(() => {
		c(r[t], i);
	}, n);
}
function Hr(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			F();
			let i = vo(n), a = U(t, n, e, r);
			return i(), qe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	} else process.env.NODE_ENV !== "production" && H(`${ie(yn[e].replace(/ hook$/, ""))} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`);
}
var Ur = (e) => (t, n = $) => {
	(!Co || e === "sp") && Hr(e, (...e) => t(...e), n);
}, Wr = Ur("bm"), Gr = Ur("m"), Kr = Ur("bu"), qr = Ur("u"), Jr = Ur("bum"), Yr = Ur("um"), Xr = Ur("sp"), Zr = Ur("rtg"), Qr = Ur("rtc");
function $r(e, t = $) {
	Hr("ec", e, t);
}
var ei = /* @__PURE__ */ Symbol.for("v-ndc");
function ti(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Gt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ R(e), s = /* @__PURE__ */ L(e), e = at(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Jt(B(e[n])) : B(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") if (process.env.NODE_ENV !== "production" && (!Number.isInteger(e) || e < 0)) H(`The v-for range expects a positive integer value but got ${e}.`), i = [];
	else {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	}
	else if (v(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
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
var ni = (e) => e ? So(e) ? Po(e) : ni(e.parent) : null, ri = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => process.env.NODE_ENV === "production" ? e.props : /* @__PURE__ */ Ut(e.props),
	$attrs: (e) => process.env.NODE_ENV === "production" ? e.attrs : /* @__PURE__ */ Ut(e.attrs),
	$slots: (e) => process.env.NODE_ENV === "production" ? e.slots : /* @__PURE__ */ Ut(e.slots),
	$refs: (e) => process.env.NODE_ENV === "production" ? e.refs : /* @__PURE__ */ Ut(e.refs),
	$parent: (e) => ni(e.parent),
	$root: (e) => ni(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => _i(e),
	$forceUpdate: (e) => e.f ||= () => {
		Mn(e.update);
	},
	$nextTick: (e) => e.n ||= An.bind(e.proxy),
	$watch: (e) => wr.bind(e)
}), ii = (e) => e === "_" || e === "$", ai = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), oi = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (process.env.NODE_ENV !== "production" && n === "__isVue") return !0;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (ai(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else fi && (s[n] = 0);
		}
		let d = ri[n], f, p;
		if (d) return n === "$attrs" ? (I(e.attrs, "get", ""), process.env.NODE_ENV !== "production" && Ii()) : process.env.NODE_ENV !== "production" && n === "$slots" && I(e, "get", n), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
		process.env.NODE_ENV !== "production" && K && (!g(n) || n.indexOf("__v") !== 0) && (a !== t && ii(n[0]) && u(a, n) ? H(`Property ${JSON.stringify(n)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`) : e === K && H(`Property ${JSON.stringify(n)} was accessed during render but is not defined on instance.`));
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return ai(a, n) ? (a[n] = r, !0) : process.env.NODE_ENV !== "production" && a.__isScriptSetup && u(a, n) ? (H(`Cannot mutate <script setup> binding "${n}" from Options API.`), !1) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) ? (process.env.NODE_ENV !== "production" && H(`Attempting to mutate prop "${n}". Props are readonly.`), !1) : n[0] === "$" && n.slice(1) in e ? (process.env.NODE_ENV !== "production" && H(`Attempting to mutate public property "${n}". Properties starting with $ are reserved and readonly.`), !1) : (process.env.NODE_ENV !== "production" && n in e.appContext.config.globalProperties ? Object.defineProperty(o, n, {
			enumerable: !0,
			configurable: !0,
			value: r
		}) : o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || ai(n, c) || u(o, c) || u(i, c) || u(ri, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
process.env.NODE_ENV !== "production" && (oi.ownKeys = (e) => (H("Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."), Reflect.ownKeys(e)));
function si(e) {
	let t = {};
	return Object.defineProperty(t, "_", {
		configurable: !0,
		enumerable: !1,
		get: () => e
	}), Object.keys(ri).forEach((n) => {
		Object.defineProperty(t, n, {
			configurable: !0,
			enumerable: !1,
			get: () => ri[n](e),
			set: r
		});
	}), t;
}
function ci(e) {
	let { ctx: t, propsOptions: [n] } = e;
	n && Object.keys(n).forEach((n) => {
		Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => e.props[n],
			set: r
		});
	});
}
function li(e) {
	let { ctx: t, setupState: n } = e;
	Object.keys(/* @__PURE__ */ z(n)).forEach((e) => {
		if (!n.__isScriptSetup) {
			if (ii(e[0])) {
				H(`setup() return property ${JSON.stringify(e)} should not start with "$" or "_" which are reserved prefixes for Vue internals.`);
				return;
			}
			Object.defineProperty(t, e, {
				enumerable: !0,
				configurable: !0,
				get: () => n[e],
				set: r
			});
		}
	});
}
function ui(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function di() {
	let e = /* @__PURE__ */ Object.create(null);
	return (t, n) => {
		e[n] ? H(`${t} property "${n}" is already defined in ${e[n]}.`) : e[n] = t;
	};
}
var fi = !0;
function pi(e) {
	let t = _i(e), n = e.proxy, i = e.ctx;
	fi = !1, t.beforeCreate && hi(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: b, deactivated: x, beforeDestroy: S, beforeUnmount: C, destroyed: w, unmounted: T, render: ee, renderTracked: te, renderTriggered: ne, errorCaptured: E, serverPrefetch: re, expose: D, inheritAttrs: O, components: ie, directives: k, filters: ae } = t, oe = process.env.NODE_ENV === "production" ? null : di();
	if (process.env.NODE_ENV !== "production") {
		let [t] = e.propsOptions;
		if (t) for (let e in t) oe("Props", e);
	}
	if (u && mi(u, i, oe), s) for (let e in s) {
		let t = s[e];
		h(t) ? (process.env.NODE_ENV === "production" ? i[e] = t.bind(n) : Object.defineProperty(i, e, {
			value: t.bind(n),
			configurable: !0,
			enumerable: !0,
			writable: !0
		}), process.env.NODE_ENV !== "production" && oe("Methods", e)) : process.env.NODE_ENV !== "production" && H(`Method "${e}" has type "${typeof t}" in the component definition. Did you reference the function correctly?`);
	}
	if (a) {
		process.env.NODE_ENV !== "production" && !h(a) && H("The data option must be a function. Plain object usage is no longer supported.");
		let t = a.call(n, n);
		if (process.env.NODE_ENV !== "production" && y(t) && H("data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>."), !v(t)) process.env.NODE_ENV !== "production" && H("data() should return an object.");
		else if (e.data = /* @__PURE__ */ Bt(t), process.env.NODE_ENV !== "production") for (let e in t) oe("Data", e), ii(e[0]) || Object.defineProperty(i, e, {
			configurable: !0,
			enumerable: !0,
			get: () => t[e],
			set: r
		});
	}
	if (fi = !0, o) for (let e in o) {
		let t = o[e], a = h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r;
		process.env.NODE_ENV !== "production" && a === r && H(`Computed property "${e}" has no getter.`);
		let s = Bo({
			get: a,
			set: !h(t) && h(t.set) ? t.set.bind(n) : process.env.NODE_ENV === "production" ? r : () => {
				H(`Write operation failed: computed property "${e}" is readonly.`);
			}
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => s.value,
			set: (e) => s.value = e
		}), process.env.NODE_ENV !== "production" && oe("Computed", e);
	}
	if (c) for (let e in c) gi(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			vr(t, e[t]);
		});
	}
	f && hi(f, e, "c");
	function A(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (A(Wr, p), A(Gr, m), A(Kr, g), A(qr, _), A(Rr, b), A(zr, x), A($r, E), A(Qr, te), A(Zr, ne), A(Jr, C), A(Yr, T), A(Xr, re), d(D)) if (D.length) {
		let t = e.exposed ||= {};
		D.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	ee && e.render === r && (e.render = ee), O != null && (e.inheritAttrs = O), ie && (e.components = ie), k && (e.directives = k), re && Ar(e);
}
function mi(e, t, n = r) {
	d(e) && (e = Si(e));
	for (let r in e) {
		let i = e[r], a;
		a = v(i) ? "default" in i ? yr(i.from || r, i.default, !0) : yr(i.from || r) : yr(i), /* @__PURE__ */ V(a) ? Object.defineProperty(t, r, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		}) : t[r] = a, process.env.NODE_ENV !== "production" && n("Inject", r);
	}
}
function hi(e, t, n) {
	U(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function gi(e, t, n, r) {
	let i = r.includes(".") ? Tr(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) ? Sr(i, n) : process.env.NODE_ENV !== "production" && H(`Invalid watch handler specified by key "${e}"`, n);
	} else if (h(e)) Sr(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => gi(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) ? Sr(i, r, e) : process.env.NODE_ENV !== "production" && H(`Invalid watch handler specified by key "${e.handler}"`, r);
	}
	else process.env.NODE_ENV !== "production" && H(`Invalid watch option: "${r}"`, e);
}
function _i(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => vi(c, e, o, !0)), vi(c, t, o)), v(t) && a.set(t, c), c;
}
function vi(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && vi(e, a, n, !0), i && i.forEach((t) => vi(e, t, n, !0));
	for (let i in t) if (r && i === "expose") process.env.NODE_ENV !== "production" && H("\"expose\" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.");
	else {
		let r = yi[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var yi = {
	data: bi,
	props: wi,
	emits: wi,
	methods: Ci,
	computed: Ci,
	beforeCreate: q,
	created: q,
	beforeMount: q,
	mounted: q,
	beforeUpdate: q,
	updated: q,
	beforeDestroy: q,
	beforeUnmount: q,
	destroyed: q,
	unmounted: q,
	activated: q,
	deactivated: q,
	errorCaptured: q,
	serverPrefetch: q,
	components: Ci,
	directives: Ci,
	watch: Ti,
	provide: bi,
	inject: xi
};
function bi(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function xi(e, t) {
	return Ci(Si(e), Si(t));
}
function Si(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function q(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Ci(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function wi(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), ui(e), ui(t ?? {})) : t;
}
function Ti(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = q(e[r], t[r]);
	return n;
}
function Ei() {
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
var Di = 0;
function Oi(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (process.env.NODE_ENV !== "production" && H("root props passed to app.mount() must be an object."), r = null);
		let i = Ei(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Di++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ho,
			get config() {
				return i.config;
			},
			set config(e) {
				process.env.NODE_ENV !== "production" && H("app.config cannot be replaced. Modify individual options instead.");
			},
			use(e, ...t) {
				return a.has(e) ? process.env.NODE_ENV !== "production" && H("Plugin has already been applied to target app.") : e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) ? (a.add(e), e(l, ...t)) : process.env.NODE_ENV !== "production" && H("A plugin must either be a function or an object with an \"install\" function."), l;
			},
			mixin(e) {
				return i.mixins.includes(e) ? process.env.NODE_ENV !== "production" && H("Mixin has already been applied to target app" + (e.name ? `: ${e.name}` : "")) : i.mixins.push(e), l;
			},
			component(e, t) {
				return process.env.NODE_ENV !== "production" && xo(e, i.config), t ? (process.env.NODE_ENV !== "production" && i.components[e] && H(`Component "${e}" has already been registered in target app.`), i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return process.env.NODE_ENV !== "production" && gr(e), t ? (process.env.NODE_ENV !== "production" && i.directives[e] && H(`Directive "${e}" has already been registered in target app.`), i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (c) process.env.NODE_ENV !== "production" && H("App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`");
				else {
					process.env.NODE_ENV !== "production" && a.__vue_app__ && H("There is already an app instance mounted on the host container.\n If you want to mount another app on the same host container, you need to unmount the previous app by calling `app.unmount()` first.");
					let u = l._ceVNode || to(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), process.env.NODE_ENV !== "production" && (i.reload = () => {
						let t = io(u);
						t.el = null, e(t, a, s);
					}), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, process.env.NODE_ENV !== "production" && (l._instance = u.component, nr(l, Ho)), Po(u.component);
				}
			},
			onUnmount(e) {
				process.env.NODE_ENV !== "production" && typeof e != "function" && H(`Expected function as first argument to app.onUnmount(), but got ${typeof e}`), o.push(e);
			},
			unmount() {
				c ? (U(o, l._instance, 16), e(null, l._container), process.env.NODE_ENV !== "production" && (l._instance = null, rr(l)), delete l._container.__vue_app__) : process.env.NODE_ENV !== "production" && H("Cannot unmount an app that is not mounted.");
			},
			provide(e, t) {
				return process.env.NODE_ENV !== "production" && e in i.provides && (u(i.provides, e) ? H(`App already provides property with key "${String(e)}". It will be overwritten with the new value.`) : H(`App already provides property with key "${String(e)}" inherited from its parent element. It will be overwritten with the new value.`)), i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = ki;
				ki = l;
				try {
					return e();
				} finally {
					ki = t;
				}
			}
		};
		return l;
	};
}
var ki = null, Ai = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${D(t)}Modifiers`];
function ji(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t;
	if (process.env.NODE_ENV !== "production") {
		let { emitsOptions: t, propsOptions: [i] } = e;
		if (t) if (!(n in t)) (!i || !(ie(E(n)) in i)) && H(`Component emitted event "${n}" but it is neither declared in the emits option nor as an "${ie(E(n))}" prop.`);
		else {
			let e = t[n];
			h(e) && (e(...r) || H(`Invalid event arguments: event validation failed for event "${n}".`));
		}
	}
	let a = r, o = n.startsWith("update:"), s = o && Ai(i, n.slice(7));
	if (s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(A))), process.env.NODE_ENV !== "production" && fr(e, n, a), process.env.NODE_ENV !== "production") {
		let t = n.toLowerCase();
		t !== n && i[ie(t)] && H(`Event "${t}" is emitted in component ${Ro(e, e.type)} but the handler is registered for "${n}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${D(n)}" instead of "${n}".`);
	}
	let c, l = i[c = ie(n)] || i[c = ie(E(n))];
	!l && o && (l = i[c = ie(D(n))]), l && U(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, U(u, e, 6, a);
	}
}
var Mi = /* @__PURE__ */ new WeakMap();
function Ni(e, t, n = !1) {
	let r = n ? Mi : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Ni(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Pi(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, D(t)) || u(e, t));
}
var Fi = !1;
function Ii() {
	Fi = !0;
}
function Li(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [s], slots: c, attrs: l, emit: u, render: d, renderCache: f, props: p, data: m, setupState: h, ctx: g, inheritAttrs: _ } = e, v = mr(e), y, b;
	process.env.NODE_ENV !== "production" && (Fi = !1);
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = process.env.NODE_ENV !== "production" && h.__isScriptSetup ? new Proxy(e, { get(e, t, n) {
				return H(`Property '${String(t)}' was accessed via 'this'. Avoid using 'this' in templates.`), Reflect.get(e, t, n);
			} }) : e;
			y = Q(d.call(t, e, f, process.env.NODE_ENV === "production" ? p : /* @__PURE__ */ Ut(p), h, m, g)), b = l;
		} else {
			let e = t;
			process.env.NODE_ENV !== "production" && l === p && Ii(), y = Q(e.length > 1 ? e(process.env.NODE_ENV === "production" ? p : /* @__PURE__ */ Ut(p), process.env.NODE_ENV === "production" ? {
				attrs: l,
				slots: c,
				emit: u
			} : {
				get attrs() {
					return Ii(), /* @__PURE__ */ Ut(l);
				},
				slots: c,
				emit: u
			}) : e(process.env.NODE_ENV === "production" ? p : /* @__PURE__ */ Ut(p), null)), b = t.props ? l : Bi(l);
		}
	} catch (t) {
		Ha.length = 0, xn(t, e, 1), y = to(Ba);
	}
	let x = y, S;
	if (process.env.NODE_ENV !== "production" && y.patchFlag > 0 && y.patchFlag & 2048 && ([x, S] = Ri(y)), b && _ !== !1) {
		let e = Object.keys(b), { shapeFlag: t } = x;
		if (e.length) {
			if (t & 7) s && e.some(o) && (b = Vi(b, s)), x = io(x, b, !1, !0);
			else if (process.env.NODE_ENV !== "production" && !Fi && x.type !== Ba) {
				let e = Object.keys(l), t = [], n = [];
				for (let r = 0, i = e.length; r < i; r++) {
					let i = e[r];
					a(i) ? o(i) || t.push(i[2].toLowerCase() + i.slice(3)) : n.push(i);
				}
				n.length && H(`Extraneous non-props attributes (${n.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`), t.length && H(`Extraneous non-emits event listeners (${t.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`);
			}
		}
	}
	return n.dirs && (process.env.NODE_ENV !== "production" && !Hi(x) && H("Runtime directive used on component with non-element root node. The directives will not function as intended."), x = io(x, null, !1, !0), x.dirs = x.dirs ? x.dirs.concat(n.dirs) : n.dirs), n.transition && (process.env.NODE_ENV !== "production" && !Hi(x) && H("Component inside <Transition> renders non-element root node that cannot be animated."), kr(x, n.transition)), process.env.NODE_ENV !== "production" && S ? S(x) : y = x, mr(v), y;
}
var Ri = (e) => {
	let t = e.children, n = e.dynamicChildren, r = zi(t, !1);
	if (!r) return [e, void 0];
	if (process.env.NODE_ENV !== "production" && r.patchFlag > 0 && r.patchFlag & 2048) return Ri(r);
	let i = t.indexOf(r), a = n ? n.indexOf(r) : -1;
	return [Q(r), (r) => {
		t[i] = r, n && (a > -1 ? n[a] = r : r.patchFlag > 0 && (e.dynamicChildren = [...n, r]));
	}];
};
function zi(e, t = !0) {
	let n;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (Ya(i)) {
			if (i.type !== Ba || i.children === "v-if") {
				if (n) return;
				if (n = i, process.env.NODE_ENV !== "production" && t && n.patchFlag > 0 && n.patchFlag & 2048) return zi(n.children);
			}
		} else return;
	}
	return n;
}
var Bi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Vi = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
}, Hi = (e) => e.shapeFlag & 7 || e.type === Ba;
function Ui(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (process.env.NODE_ENV !== "production" && (i || s) && G || t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Wi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Gi(o, r, n) && !Pi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? o ? Wi(r, o, l) : !0 : !!o;
	return !1;
}
function Wi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Gi(t, e, a) && !Pi(n, a)) return !0;
	}
	return !1;
}
function Gi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !Te(r, i) : r !== i;
}
function Ki({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var qi = {}, Ji = () => Object.create(qi), Yi = (e) => Object.getPrototypeOf(e) === qi;
function Xi(e, t, n, r = !1) {
	let i = {}, a = Ji();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), $i(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	process.env.NODE_ENV !== "production" && aa(t || {}, i, e), n ? e.props = r ? i : /* @__PURE__ */ Vt(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Zi(e) {
	for (; e;) {
		if (e.type.__hmrId) return !0;
		e = e.parent;
	}
}
function Qi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ z(i), [c] = e.propsOptions, l = !1;
	if (!(process.env.NODE_ENV !== "production" && Zi(e)) && (r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Pi(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = E(o);
					i[t] = ea(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		$i(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = D(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ea(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && rt(e.attrs, "set", ""), process.env.NODE_ENV !== "production" && aa(t || {}, i, e);
}
function $i(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Pi(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ z(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = ea(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function ea(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = vo(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === D(n)) && (r = !0));
	}
	return r;
}
var ta = /* @__PURE__ */ new WeakMap();
function na(e, r, i = !1) {
	let a = i ? ta : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = na(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		process.env.NODE_ENV !== "production" && !g(c[e]) && H("props must be strings when using array syntax.", c[e]);
		let n = E(c[e]);
		ra(n) && (l[n] = t);
	}
	else if (c) {
		process.env.NODE_ENV !== "production" && !v(c) && H("invalid props options", c);
		for (let e in c) {
			let t = E(e);
			if (ra(t)) {
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
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function ra(e) {
	return e[0] !== "$" && !T(e) ? !0 : (process.env.NODE_ENV !== "production" && H(`Invalid prop name: "${e}" is a reserved property.`), !1);
}
function ia(e) {
	return e === null ? "null" : typeof e == "function" ? e.name || "" : typeof e == "object" && e.constructor && e.constructor.name || "";
}
function aa(e, t, n) {
	let r = /* @__PURE__ */ z(t), i = n.propsOptions[0], a = Object.keys(e).map((e) => E(e));
	for (let e in i) {
		let t = i[e];
		t != null && oa(e, r[e], t, process.env.NODE_ENV === "production" ? r : /* @__PURE__ */ Ut(r), !a.includes(e));
	}
}
function oa(e, t, n, r, i) {
	let { type: a, required: o, validator: s, skipCheck: c } = n;
	if (o && i) {
		H("Missing required prop: \"" + e + "\"");
		return;
	}
	if (!(t == null && !o)) {
		if (a != null && a !== !0 && !c) {
			let n = !1, r = d(a) ? a : [a], i = [];
			for (let e = 0; e < r.length && !n; e++) {
				let { valid: a, expectedType: o } = ca(t, r[e]);
				i.push(o || ""), n = a;
			}
			if (!n) {
				H(la(e, t, i));
				return;
			}
		}
		s && !s(t, r) && H("Invalid prop: custom validator check failed for prop \"" + e + "\".");
	}
}
var sa = /* @__PURE__ */ e("String,Number,Boolean,Function,Symbol,BigInt");
function ca(e, t) {
	let n, r = ia(t);
	if (r === "null") n = e === null;
	else if (sa(r)) {
		let i = typeof e;
		n = i === r.toLowerCase(), !n && i === "object" && (n = e instanceof t);
	} else n = r === "Object" ? v(e) : r === "Array" ? d(e) : e instanceof t;
	return {
		valid: n,
		expectedType: r
	};
}
function la(e, t, n) {
	if (n.length === 0) return `Prop type [] for prop "${e}" won't match anything. Did you mean to use type Array instead?`;
	let r = `Invalid prop: type check failed for prop "${e}". Expected ${n.map(O).join(" | ")}`, i = n[0], a = S(t), o = ua(t, i), s = ua(t, a);
	return n.length === 1 && da(i) && fa(i, a) && (r += ` with value ${o}`), r += `, got ${a} `, da(a) && (r += `with value ${s}.`), r;
}
function ua(e, t) {
	return _(e) ? e.toString() : t === "String" ? `"${e}"` : t === "Number" ? `${Number(e)}` : `${e}`;
}
function da(e) {
	return [
		"string",
		"number",
		"boolean"
	].some((t) => e.toLowerCase() === t);
}
function fa(...e) {
	return e.every((e) => {
		let t = e.toLowerCase();
		return t !== "boolean" && t !== "symbol";
	});
}
var pa = (e) => e === "_" || e === "_ctx" || e === "$stable", ma = (e) => d(e) ? e.map(Q) : [Q(e)], ha = (e, t, n) => {
	if (t._n) return t;
	let r = hr((...r) => (process.env.NODE_ENV !== "production" && $ && !(n === null && K) && !(n && n.root !== $.root) && H(`Slot "${e}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`), ma(t(...r))), n);
	return r._c = !1, r;
}, ga = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (pa(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = ha(n, i, r);
		else if (i != null) {
			process.env.NODE_ENV !== "production" && H(`Non-function value encountered for slot "${n}". Prefer function slots for better performance.`);
			let e = ma(i);
			t[n] = () => e;
		}
	}
}, _a = (e, t) => {
	process.env.NODE_ENV !== "production" && !Lr(e.vnode) && H("Non-function value encountered for default slot. Prefer function slots for better performance.");
	let n = ma(t);
	e.slots.default = () => n;
}, va = (e, t, n) => {
	for (let r in t) (n || !pa(r)) && (e[r] = t[r]);
}, ya = (e, t, n) => {
	let r = e.slots = Ji();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (va(r, t, n), n && oe(r, "_", e, !0)) : ga(t, r);
	} else t && _a(e, t);
}, ba = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let t = n._;
		t ? process.env.NODE_ENV !== "production" && G ? (va(a, n, r), rt(e, "set", "$slots")) : r && t === 1 ? o = !1 : va(a, n, r) : (o = !n.$stable, ga(n, a)), s = n;
	} else n && (_a(e, n), s = { default: 1 });
	if (o) for (let e in a) !pa(e) && s[e] == null && delete a[e];
}, xa, Sa;
function Ca(e, t) {
	e.appContext.config.performance && Ta() && Sa.mark(`vue-${t}-${e.uid}`), process.env.NODE_ENV !== "production" && lr(e, t, Ta() ? Sa.now() : Date.now());
}
function wa(e, t) {
	if (e.appContext.config.performance && Ta()) {
		let n = `vue-${t}-${e.uid}`, r = n + ":end", i = `<${Ro(e, e.type)}> ${t}`;
		Sa.mark(r), Sa.measure(i, n, r), Sa.clearMeasures(i), Sa.clearMarks(n), Sa.clearMarks(r);
	}
	process.env.NODE_ENV !== "production" && ur(e, t, Ta() ? Sa.now() : Date.now());
}
function Ta() {
	return xa === void 0 && (typeof window < "u" && window.performance ? (xa = !0, Sa = window.performance) : xa = !1), xa;
}
function Ea() {
	let e = [];
	if (process.env.NODE_ENV !== "production" && e.length) {
		let t = e.length > 1;
		console.warn(`Feature flag${t ? "s" : ""} ${e.join(", ")} ${t ? "are" : "is"} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`);
	}
}
var J = Ra;
function Da(e) {
	return Oa(e);
}
function Oa(e, i) {
	Ea();
	let a = ce();
	a.__VUE__ = !0, process.env.NODE_ENV !== "production" && tr(a.__VUE_DEVTOOLS_GLOBAL_HOOK__, a);
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = process.env.NODE_ENV !== "production" && G ? !1 : !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Xa(e, t) && (r = be(e), he(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case za:
				y(e, t, n, r);
				break;
			case Ba:
				b(e, t, n, r);
				break;
			case Va:
				e == null ? x(t, n, r, o) : process.env.NODE_ENV !== "production" && S(e, t, n, o);
				break;
			case Y:
				ie(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? ee(e, t, n, r, i, a, o, s, c) : d & 6 ? k(e, t, n, r, i, a, o, s, c) : d & 64 || d & 128 ? l.process(e, t, n, r, i, a, o, s, c, Ce) : process.env.NODE_ENV !== "production" && H("Invalid VNode type:", l, `(${typeof l})`);
		}
		u != null && i ? Pr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Pr(e.ref, null, a, e, !0);
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
	}, S = (e, t, n, r) => {
		if (t.children !== e.children) {
			let i = h(e.anchor);
			w(e), [t.el, t.anchor] = _(t.children, n, i, r);
		} else t.el = e.el, t.anchor = e.anchor;
	}, C = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, w = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ee = (e, t, n, r, i, a, o, s, c) => {
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
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, ka(e, a), s, u), _ && _r(e, null, r, "created"), ne(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && uo(f, r, e);
		}
		process.env.NODE_ENV !== "production" && (oe(d, "__vnode", e, !0), oe(d, "__vueParentComponent", r, !0)), _ && _r(e, null, r, "beforeMount");
		let v = ja(i, g);
		if (v && g.beforeEnter(d), o(d, t, n), (f = m && m.onVnodeMounted) || v || _) {
			let t = process.env.NODE_ENV !== "production" && G;
			J(() => {
				let n;
				process.env.NODE_ENV !== "production" && (n = Bn(t));
				try {
					f && uo(f, r, e), v && g.enter(d), _ && _r(e, null, r, "mounted");
				} finally {
					process.env.NODE_ENV !== "production" && Bn(n);
				}
			}, i);
		}
	}, ne = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (process.env.NODE_ENV !== "production" && n.patchFlag > 0 && n.patchFlag & 2048 && (n = zi(n.children) || n), t === n || La(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ne(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) v(null, e[l] = s ? so(e[l]) : Q(e[l]), t, n, r, i, a, o, s);
	}, re = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el;
		process.env.NODE_ENV !== "production" && (l.__vnode = n);
		let { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Aa(r, !1), (g = h.onVnodeBeforeUpdate) && uo(g, r, n, e), f && _r(n, e, r, "beforeUpdate"), r && Aa(r, !0), process.env.NODE_ENV !== "production" && G && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? (D(e.dynamicChildren, d, l, r, i, ka(n, a), o), process.env.NODE_ENV !== "production" && Ma(e, n)) : s || de(e, n, l, null, r, i, ka(n, a), o, !1), u > 0) {
			if (u & 16) O(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && O(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && J(() => {
			g && uo(g, r, n, e), f && _r(n, e, r, "updated");
		}, i);
	}, D = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s];
			v(c, l, c.el && (c.type === Y || !Xa(c, l) || c.shapeFlag & 198) ? m(c.el) : n, null, r, i, a, o, !0);
		}
	}, O = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ie = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		process.env.NODE_ENV !== "production" && (G || p & 2048) && (p = 0, l = !1, m = null), h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (D(e.dynamicChildren, m, n, i, a, s, c), process.env.NODE_ENV === "production" ? (t.key != null || i && t === i.subTree) && Ma(e, t, !0) : Ma(e, t)) : de(e, t, n, f, i, a, s, c, l);
	}, k = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : A(t, n, r, i, a, o, c) : se(e, t, c);
	}, A = (e, t, n, r, i, a, o) => {
		let s = e.component = mo(e, r, i);
		if (process.env.NODE_ENV !== "production" && s.type.__hmrId && Un(s), process.env.NODE_ENV !== "production" && (dn(e), Ca(s, "mount")), Lr(e) && (s.ctx.renderer = Ce), process.env.NODE_ENV !== "production" && Ca(s, "init"), wo(s, !1, o), process.env.NODE_ENV !== "production" && wa(s, "init"), process.env.NODE_ENV !== "production" && G && (e.el = null), s.asyncDep) {
			if (i && i.registerDep(s, le, o), !e.el) {
				let r = s.subTree = to(Ba);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else le(s, e, t, n, i, a, o);
		process.env.NODE_ENV !== "production" && (fn(), wa(s, "mount"));
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (Ui(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			process.env.NODE_ENV !== "production" && dn(t), ue(r, t, n), process.env.NODE_ENV !== "production" && fn();
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, le = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Pa(e);
					if (n) {
						t && (t.el = c.el, ue(e, t, o)), n.asyncDep.then(() => {
							J(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				process.env.NODE_ENV !== "production" && dn(t || e.vnode), Aa(e, !1), t ? (t.el = c.el, ue(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && uo(d, s, t, c), Aa(e, !0), process.env.NODE_ENV !== "production" && Ca(e, "render");
				let f = Li(e);
				process.env.NODE_ENV !== "production" && wa(e, "render");
				let p = e.subTree;
				e.subTree = f, process.env.NODE_ENV !== "production" && Ca(e, "patch"), v(p, f, m(p.el), be(p), e, i, a), process.env.NODE_ENV !== "production" && wa(e, "patch"), t.el = f.el, u === null && Ki(e, f.el), r && J(r, i), (d = t.props && t.props.onVnodeUpdated) && J(() => uo(d, s, t, c), i), process.env.NODE_ENV !== "production" && ar(e), process.env.NODE_ENV !== "production" && fn();
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Ir(t);
				if (Aa(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && uo(o, d, t), Aa(e, !0), s && Te) {
					let t = () => {
						process.env.NODE_ENV !== "production" && Ca(e, "render"), e.subTree = Li(e), process.env.NODE_ENV !== "production" && wa(e, "render"), process.env.NODE_ENV !== "production" && Ca(e, "hydrate"), Te(s, e.subTree, e, i, null), process.env.NODE_ENV !== "production" && wa(e, "hydrate");
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0), process.env.NODE_ENV !== "production" && Ca(e, "render");
					let o = e.subTree = Li(e);
					process.env.NODE_ENV !== "production" && wa(e, "render"), process.env.NODE_ENV !== "production" && Ca(e, "patch"), v(null, o, n, r, e, i, a), process.env.NODE_ENV !== "production" && wa(e, "patch"), t.el = o.el;
				}
				if (u && J(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					J(() => uo(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Ir(d.vnode) && d.vnode.shapeFlag & 256) && e.a && J(e.a, i), e.isMounted = !0, process.env.NODE_ENV !== "production" && ir(e), t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ne(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Mn(u), Aa(e, !0), process.env.NODE_ENV !== "production" && (c.onTrack = e.rtc ? (t) => ae(e.rtc, t) : void 0, c.onTrigger = e.rtg ? (t) => ae(e.rtg, t) : void 0), l();
	}, ue = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Qi(e, t.props, r, n), ba(e, t.children, n), F(), Fn(e), qe();
	}, de = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				pe(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ye(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? pe(l, d, n, r, i, a, o, s, c) : ye(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? so(t[p]) : Q(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ye(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, pe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? so(t[u]) : Q(t[u]);
			if (Xa(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? so(t[p]) : Q(t[p]);
			if (Xa(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? so(t[u]) : Q(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) he(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? so(t[u]) : Q(t[u]);
				e.key != null && (process.env.NODE_ENV !== "production" && g.has(e.key) && H("Duplicate keys found during update:", JSON.stringify(e.key), "Make sure keys are unique."), g.set(e.key, u));
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					he(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Xa(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? he(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Na(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ia(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? me(n, r, p, 2) : _--);
			}
		}
	}, me = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			me(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, Ce);
			return;
		}
		if (c === Y) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) me(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Va) {
			C(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[Or] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), J(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[Or];
				a._isLeaving && a[Or](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, he = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (F(), Pr(s, null, n, e, !0), qe()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Ir(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && uo(_, t, e), u & 6) ve(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && _r(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Ce, r) : l && !l.hasOnce && (a !== Y || d > 0 && d & 64) ? ye(l, t, n, !1, !0) : (a === Y && d & 384 || !i && u & 16) && ye(c, t, n), r && ge(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && J(() => {
			_ && uo(_, t, e), h && _r(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ge = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === Y) {
			process.env.NODE_ENV !== "production" && e.patchFlag > 0 && e.patchFlag & 2048 && i && !i.persisted ? e.children.forEach((e) => {
				e.type === Ba ? s(e.el) : ge(e);
			}) : _e(n, r);
			return;
		}
		if (t === Va) {
			w(e);
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, _e = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ve = (e, t, n) => {
		process.env.NODE_ENV !== "production" && e.type.__hmrId && Wn(e);
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Fa(c), Fa(l), r && ae(r), i.stop(), a && (a.flags |= 8, he(o, e, t, n)), s && J(s, t), J(() => {
			e.isUnmounted = !0;
		}, t), process.env.NODE_ENV !== "production" && sr(e);
	}, ye = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) he(e[o], t, n, r, i);
	}, be = (e) => {
		if (e.shapeFlag & 6) return be(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Er];
		return n ? h(n) : t;
	}, xe = !1, Se = (e, t, n) => {
		let r;
		e == null ? t._vnode && (he(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, xe ||= (xe = !0, Fn(r), In(), !1);
	}, Ce = {
		p: v,
		um: he,
		m: me,
		r: ge,
		mt: A,
		mc: E,
		pc: de,
		pbc: D,
		n: be,
		o: e
	}, we, Te;
	return i && ([we, Te] = i(Ce)), {
		render: Se,
		hydrate: we,
		createApp: Oi(Se, we)
	};
}
function ka({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Aa({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ja(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ma(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = so(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ma(t, a)), a.type === za && (a.patchFlag === -1 && (a = i[e] = so(a)), a.el = t.el), a.type === Ba && !a.el && (a.el = t.el), process.env.NODE_ENV !== "production" && a.el && (a.el.__vnode = a);
	}
}
function Na(e) {
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
function Pa(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Pa(t);
}
function Fa(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ia(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ia(t.subTree) : null;
}
var La = (e) => e.__isSuspense;
function Ra(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : Pn(e);
}
var Y = /* @__PURE__ */ Symbol.for("v-fgt"), za = /* @__PURE__ */ Symbol.for("v-txt"), Ba = /* @__PURE__ */ Symbol.for("v-cmt"), Va = /* @__PURE__ */ Symbol.for("v-stc"), Ha = [], X = null;
function Ua(e = !1) {
	Ha.push(X = e ? null : []);
}
function Wa() {
	Ha.pop(), X = Ha[Ha.length - 1] || null;
}
var Ga = 1;
function Ka(e, t = !1) {
	Ga += e, e < 0 && X && t && (X.hasOnce = !0);
}
function qa(e) {
	return e.dynamicChildren = Ga > 0 ? X || n : null, Wa(), Ga > 0 && X && X.push(e), e;
}
function Ja(e, t, n, r, i, a) {
	return qa(Z(e, t, n, r, i, a, !0));
}
function Ya(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Xa(e, t) {
	if (process.env.NODE_ENV !== "production" && t.shapeFlag & 6 && e.component) {
		let n = Vn.get(t.type);
		if (n && n.has(e.component)) return e.shapeFlag &= -257, t.shapeFlag &= -513, !1;
	}
	return e.type === t.type && e.key === t.key;
}
var Za, Qa = (...e) => no(...Za ? Za(e, K) : e), $a = ({ key: e }) => e ?? null, eo = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ V(e) || h(e) ? {
	i: K,
	r: e,
	k: t,
	f: !!n
} : e);
function Z(e, t = null, n = null, r = 0, i = null, a = e === Y ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && $a(t),
		ref: t && eo(t),
		scopeId: pr,
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
		ctx: K
	};
	return s ? (co(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), process.env.NODE_ENV !== "production" && c.key !== c.key && H("VNode created with invalid key (NaN). VNode type:", c.type), Ga > 0 && !o && X && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && X.push(c), c;
}
var to = process.env.NODE_ENV === "production" ? no : Qa;
function no(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === ei) && (process.env.NODE_ENV !== "production" && !e && H(`Invalid vnode type when creating vnode: ${e}.`), e = Ba), Ya(e)) {
		let r = io(e, t, !0);
		return n && co(r, n), Ga > 0 && !a && X && (r.shapeFlag & 6 ? X[X.indexOf(e)] = r : X.push(r)), r.patchFlag = -2, r;
	}
	if (zo(e) && (e = e.__vccOpts), t) {
		t = ro(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = me(e)), v(n) && (/* @__PURE__ */ Kt(n) && !d(n) && (n = s({}, n)), t.style = le(n));
	}
	let o = g(e) ? 1 : La(e) ? 128 : Dr(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return process.env.NODE_ENV !== "production" && o & 4 && /* @__PURE__ */ Kt(e) && (e = /* @__PURE__ */ z(e), H("Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.", "\nComponent that was made reactive: ", e)), Z(e, t, n, r, i, o, a, !0);
}
function ro(e) {
	return e ? /* @__PURE__ */ Kt(e) || Yi(e) ? s({}, e) : e : null;
}
function io(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? lo(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && $a(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(eo(t)) : [a, eo(t)] : eo(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: process.env.NODE_ENV !== "production" && o === -1 && d(s) ? s.map(ao) : s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== Y ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && io(e.ssContent),
		ssFallback: e.ssFallback && io(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && kr(u, c.clone(u)), u;
}
function ao(e) {
	let t = io(e);
	return d(e.children) && (t.children = e.children.map(ao)), t;
}
function oo(e = " ", t = 0) {
	return to(za, null, e, t);
}
function Q(e) {
	return e == null || typeof e == "boolean" ? to(Ba) : d(e) ? to(Y, null, e.slice()) : Ya(e) ? so(e) : to(za, null, String(e));
}
function so(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : io(e);
}
function co(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), co(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !Yi(t) ? t._ctx = K : r === 3 && K && (K.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else h(t) ? (t = {
		default: t,
		_ctx: K
	}, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [oo(t)]) : n = 8);
	e.children = t, e.shapeFlag |= n;
}
function lo(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = me([t.class, r.class]));
		else if (e === "style") t.style = le([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function uo(e, t, n, r = null) {
	U(e, t, 7, [n, r]);
}
var fo = Ei(), po = 0;
function mo(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || fo, o = {
		uid: po++,
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
		scope: new Ae(!0),
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
		propsOptions: na(i, a),
		emitsOptions: Ni(i, a),
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
	return process.env.NODE_ENV === "production" ? o.ctx = { _: o } : o.ctx = si(o), o.root = n ? n.root : o, o.emit = ji.bind(null, o), e.ce && e.ce(o), o;
}
var $ = null, ho = () => $ || K, go, _o;
{
	let e = ce(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	go = t("__VUE_INSTANCE_SETTERS__", (e) => $ = e), _o = t("__VUE_SSR_SETTERS__", (e) => Co = e);
}
var vo = (e) => {
	let t = $;
	return go(e), e.scope.on(), () => {
		e.scope.off(), go(t);
	};
}, yo = () => {
	$ && $.scope.off(), go(null);
}, bo = /* @__PURE__ */ e("slot,component");
function xo(e, { isNativeTag: t }) {
	(bo(e) || t(e)) && H("Do not use built-in or reserved HTML elements as component id: " + e);
}
function So(e) {
	return e.vnode.shapeFlag & 4;
}
var Co = !1;
function wo(e, t = !1, n = !1) {
	t && _o(t);
	let { props: r, children: i } = e.vnode, a = So(e);
	Xi(e, r, a, t), ya(e, i, n || t);
	let o = a ? To(e, t) : void 0;
	return t && _o(!1), o;
}
function To(e, t) {
	let n = e.type;
	if (process.env.NODE_ENV !== "production") {
		if (n.name && xo(n.name, e.appContext.config), n.components) {
			let t = Object.keys(n.components);
			for (let n = 0; n < t.length; n++) xo(t[n], e.appContext.config);
		}
		if (n.directives) {
			let e = Object.keys(n.directives);
			for (let t = 0; t < e.length; t++) gr(e[t]);
		}
		n.compilerOptions && ko() && H("\"compilerOptions\" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.");
	}
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, oi), process.env.NODE_ENV !== "production" && ci(e);
	let { setup: r } = n;
	if (r) {
		F();
		let i = e.setupContext = r.length > 1 ? No(e) : null, a = vo(e), o = bn(r, e, 0, [process.env.NODE_ENV === "production" ? e.props : /* @__PURE__ */ Ut(e.props), i]), s = y(o);
		if (qe(), a(), (s || e.sp) && !Ir(e) && Ar(e), s) {
			if (o.then(yo, yo), t) return o.then((n) => {
				Eo(e, n, t);
			}).catch((t) => {
				xn(t, e, 0);
			});
			e.asyncDep = o, process.env.NODE_ENV !== "production" && !e.suspense && H(`Component <${Ro(e, n)}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`);
		} else Eo(e, o, t);
	} else Ao(e, t);
}
function Eo(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) ? (process.env.NODE_ENV !== "production" && Ya(t) && H("setup() should not return VNodes directly - return a render function instead."), process.env.NODE_ENV !== "production" && (e.devtoolsRawSetupState = t), e.setupState = en(t), process.env.NODE_ENV !== "production" && li(e)) : process.env.NODE_ENV !== "production" && t !== void 0 && H(`setup() should return an object. Received: ${t === null ? "null" : typeof t}`), Ao(e, n);
}
var Do, Oo, ko = () => !Do;
function Ao(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && Do && !i.render) {
			let t = i.template || _i(e).template;
			if (t) {
				process.env.NODE_ENV !== "production" && Ca(e, "compile");
				let { isCustomElement: n, compilerOptions: r } = e.appContext.config, { delimiters: a, compilerOptions: o } = i;
				i.render = Do(t, s(s({
					isCustomElement: n,
					delimiters: a
				}, r), o)), process.env.NODE_ENV !== "production" && wa(e, "compile");
			}
		}
		e.render = i.render || r, Oo && Oo(e);
	}
	{
		let t = vo(e);
		F();
		try {
			pi(e);
		} finally {
			qe(), t();
		}
	}
	process.env.NODE_ENV !== "production" && !i.render && e.render === r && !t && (!Do && i.template ? H("Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias \"vue\" to \"vue/dist/vue.esm-bundler.js\".") : H("Component is missing template or render function: ", i));
}
var jo = process.env.NODE_ENV === "production" ? { get(e, t) {
	return I(e, "get", ""), e[t];
} } : {
	get(e, t) {
		return Ii(), I(e, "get", ""), e[t];
	},
	set() {
		return H("setupContext.attrs is readonly."), !1;
	},
	deleteProperty() {
		return H("setupContext.attrs is readonly."), !1;
	}
};
function Mo(e) {
	return new Proxy(e.slots, { get(t, n) {
		return I(e, "get", "$slots"), t[n];
	} });
}
function No(e) {
	let t = (t) => {
		if (process.env.NODE_ENV !== "production" && (e.exposed && H("expose() should be called only once per setup()."), t != null)) {
			let e = typeof t;
			e === "object" && (d(t) ? e = "array" : /* @__PURE__ */ V(t) && (e = "ref")), e !== "object" && H(`expose() should be passed a plain object, received ${e}.`);
		}
		e.exposed = t || {};
	};
	if (process.env.NODE_ENV !== "production") {
		let n, r;
		return Object.freeze({
			get attrs() {
				return n ||= new Proxy(e.attrs, jo);
			},
			get slots() {
				return r ||= Mo(e);
			},
			get emit() {
				return (t, ...n) => e.emit(t, ...n);
			},
			expose: t
		});
	} else return {
		attrs: new Proxy(e.attrs, jo),
		slots: e.slots,
		emit: e.emit,
		expose: t
	};
}
function Po(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(en(qt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ri) return ri[n](e);
		},
		has(e, t) {
			return t in e || t in ri;
		}
	}) : e.proxy;
}
var Fo = /(?:^|[-_])\w/g, Io = (e) => e.replace(Fo, (e) => e.toUpperCase()).replace(/[-_]/g, "");
function Lo(e, t = !0) {
	return h(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ro(e, t, n = !1) {
	let r = Lo(t);
	if (!r && t.__file) {
		let e = t.__file.match(/([^/\\]+)\.\w+$/);
		e && (r = e[1]);
	}
	if (!r && e) {
		let n = (e) => {
			for (let n in e) if (e[n] === t) return n;
		};
		r = n(e.components) || e.parent && n(e.parent.type.components) || n(e.appContext.components);
	}
	return r ? Io(r) : n ? "App" : "Anonymous";
}
function zo(e) {
	return h(e) && "__vccOpts" in e;
}
var Bo = (e, t) => {
	let n = /* @__PURE__ */ nn(e, t, Co);
	if (process.env.NODE_ENV !== "production") {
		let e = ho();
		e && e.appContext.config.warnRecursiveComputed && (n._warnRecursive = !0);
	}
	return n;
};
function Vo() {
	if (process.env.NODE_ENV === "production" || typeof window > "u") return;
	let e = { style: "color:#3ba776" }, n = { style: "color:#1677ff" }, r = { style: "color:#f5222d" }, i = { style: "color:#eb2f96" }, a = {
		__vue_custom_formatter: !0,
		header(t) {
			if (!v(t)) return null;
			if (t.__isVue) return [
				"div",
				e,
				"VueInstance"
			];
			if (/* @__PURE__ */ V(t)) {
				F();
				let n = t.value;
				return qe(), [
					"div",
					{},
					[
						"span",
						e,
						p(t)
					],
					"<",
					l(n),
					">"
				];
			} else if (/* @__PURE__ */ Gt(t)) return [
				"div",
				{},
				[
					"span",
					e,
					/* @__PURE__ */ R(t) ? "ShallowReactive" : "Reactive"
				],
				"<",
				l(t),
				`>${/* @__PURE__ */ L(t) ? " (readonly)" : ""}`
			];
			else if (/* @__PURE__ */ L(t)) return [
				"div",
				{},
				[
					"span",
					e,
					/* @__PURE__ */ R(t) ? "ShallowReadonly" : "Readonly"
				],
				"<",
				l(t),
				">"
			];
			return null;
		},
		hasBody(e) {
			return e && e.__isVue;
		},
		body(e) {
			if (e && e.__isVue) return [
				"div",
				{},
				...o(e.$)
			];
		}
	};
	function o(e) {
		let n = [];
		e.type.props && e.props && n.push(c("props", /* @__PURE__ */ z(e.props))), e.setupState !== t && n.push(c("setup", e.setupState)), e.data !== t && n.push(c("data", /* @__PURE__ */ z(e.data)));
		let r = u(e, "computed");
		r && n.push(c("computed", r));
		let a = u(e, "inject");
		return a && n.push(c("injected", a)), n.push([
			"div",
			{},
			[
				"span",
				{ style: i.style + ";opacity:0.66" },
				"$ (internal): "
			],
			["object", { object: e }]
		]), n;
	}
	function c(e, t) {
		return t = s({}, t), Object.keys(t).length ? [
			"div",
			{ style: "line-height:1.25em;margin-bottom:0.6em" },
			[
				"div",
				{ style: "color:#476582" },
				e
			],
			[
				"div",
				{ style: "padding-left:1.25em" },
				...Object.keys(t).map((e) => [
					"div",
					{},
					[
						"span",
						i,
						e + ": "
					],
					l(t[e], !1)
				])
			]
		] : ["span", {}];
	}
	function l(e, t = !0) {
		return typeof e == "number" ? [
			"span",
			n,
			e
		] : typeof e == "string" ? [
			"span",
			r,
			JSON.stringify(e)
		] : typeof e == "boolean" ? [
			"span",
			i,
			e
		] : v(e) ? ["object", { object: t ? /* @__PURE__ */ z(e) : e }] : [
			"span",
			r,
			String(e)
		];
	}
	function u(e, t) {
		let n = e.type;
		if (h(n)) return;
		let r = {};
		for (let i in e.ctx) f(n, i, t) && (r[i] = e.ctx[i]);
		return r;
	}
	function f(e, t, n) {
		let r = e[n];
		if (d(r) && r.includes(t) || v(r) && t in r || e.extends && f(e.extends, t, n) || e.mixins && e.mixins.some((e) => f(e, t, n))) return !0;
	}
	function p(e) {
		return /* @__PURE__ */ R(e) ? "ShallowRef" : e.effect ? "ComputedRef" : "Ref";
	}
	window.devtoolsFormatters ? window.devtoolsFormatters.push(a) : window.devtoolsFormatters = [a];
}
var Ho = "3.5.38", Uo = process.env.NODE_ENV === "production" ? r : H;
process.env.NODE_ENV, process.env.NODE_ENV;
//#endregion
//#region node_modules/.pnpm/@vue+runtime-dom@3.5.38/node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var Wo = void 0, Go = typeof window < "u" && window.trustedTypes;
if (Go) try {
	Wo = /* @__PURE__ */ Go.createPolicy("vue", { createHTML: (e) => e });
} catch (e) {
	process.env.NODE_ENV !== "production" && Uo(`Error creating trusted types policy: ${e}`);
}
var Ko = Wo ? (e) => Wo.createHTML(e) : (e) => e, qo = "http://www.w3.org/2000/svg", Jo = "http://www.w3.org/1998/Math/MathML", Yo = typeof document < "u" ? document : null, Xo = Yo && /* @__PURE__ */ Yo.createElement("template"), Zo = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Yo.createElementNS(qo, e) : t === "mathml" ? Yo.createElementNS(Jo, e) : n ? Yo.createElement(e, { is: n }) : Yo.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Yo.createTextNode(e),
	createComment: (e) => Yo.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Yo.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			Xo.innerHTML = Ko(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Xo.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Qo = /* @__PURE__ */ Symbol("_vtc");
function $o(e, t, n) {
	let r = e[Qo];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var es = /* @__PURE__ */ Symbol("_vod"), ts = /* @__PURE__ */ Symbol("_vsh"), ns = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "CSS_VAR_TEXT"), rs = /(?:^|;)\s*display\s*:/;
function is(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) if (g(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? ss(r, t, "");
		}
		else for (let e in t) n[e] ?? ss(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ss(r, i, "") : ds(e, i, !g(t) && t ? t[i] : void 0, o) || ss(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ns];
			e && (n += ";" + e), r.cssText = n, a = rs.test(n);
		}
	} else t && e.removeAttribute("style");
	es in e && (e[es] = a ? r.display : "", e[ts] && (r.display = "none"));
}
var as = /[^\\];\s*$/, os = /\s*!important$/;
function ss(e, t, n) {
	if (d(n)) n.forEach((n) => ss(e, t, n));
	else if (n ??= "", process.env.NODE_ENV !== "production" && as.test(n) && Uo(`Unexpected semicolon at the end of '${t}' style value: '${n}'`), t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = us(e, t);
		os.test(n) ? e.setProperty(D(r), n.replace(os, ""), "important") : e[r] = n;
	}
}
var cs = [
	"Webkit",
	"Moz",
	"ms"
], ls = {};
function us(e, t) {
	let n = ls[t];
	if (n) return n;
	let r = E(t);
	if (r !== "filter" && r in e) return ls[t] = r;
	r = O(r);
	for (let n = 0; n < cs.length; n++) {
		let i = cs[n] + r;
		if (i in e) return ls[t] = i;
	}
	return t;
}
function ds(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var fs = "http://www.w3.org/1999/xlink";
function ps(e, t, n, r, i, a = Se(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(fs, t.slice(6, t.length)) : e.setAttributeNS(fs, t, n) : n == null || a && !Ce(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function ms(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ko(n) : n);
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
		r === "boolean" ? n = Ce(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch (e) {
		process.env.NODE_ENV !== "production" && !o && Uo(`Failed setting prop "${t}" on <${a.toLowerCase()}>: value ${n} is invalid.`, e);
	}
	o && e.removeAttribute(i || t);
}
function hs(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function gs(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var _s = /* @__PURE__ */ Symbol("_vei");
function vs(e, t, n, r, i = null) {
	let a = e[_s] || (e[_s] = {}), o = a[t];
	if (r && o) o.value = process.env.NODE_ENV === "production" ? r : Ts(r, t);
	else {
		let [n, s] = bs(t);
		r ? hs(e, n, a[t] = ws(process.env.NODE_ENV === "production" ? r : Ts(r, t), i), s) : o && (gs(e, n, o, s), a[t] = void 0);
	}
}
var ys = /(?:Once|Passive|Capture)$/;
function bs(e) {
	let t;
	if (ys.test(e)) {
		t = {};
		let n;
		for (; n = e.match(ys);) e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0;
	}
	return [e[2] === ":" ? e.slice(3) : D(e.slice(2)), t];
}
var xs = 0, Ss = /* @__PURE__ */ Promise.resolve(), Cs = () => xs ||= (Ss.then(() => xs = 0), Date.now());
function ws(e, t) {
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
				e && U(e, t, 5, a);
			}
		} else U(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Cs(), n;
}
function Ts(e, t) {
	return h(e) || d(e) ? e : (Uo(`Wrong type passed as event handler to ${t} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof e}.`), r);
}
var Es = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ds = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? $o(e, r, c) : t === "style" ? is(e, n, r) : a(t) ? o(t) || vs(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Os(e, t, r, c)) ? (ms(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && ps(e, t, r, c, s, t !== "value")) : e._isVueCE && (ks(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? ms(e, E(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), ps(e, t, r, c));
};
function Os(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Es(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Es(t) && g(n) ? !1 : t in e;
}
function ks(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var As = /* @__PURE__ */ s({ patchProp: Ds }, Zo), js;
function Ms() {
	return js ||= Da(As);
}
var Ns = ((...e) => {
	let t = Ms().createApp(...e);
	process.env.NODE_ENV !== "production" && (Fs(t), Is(t));
	let { mount: n } = t;
	return t.mount = (e) => {
		let r = Ls(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ps(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ps(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Fs(e) {
	Object.defineProperty(e.config, "isNativeTag", {
		value: (e) => ve(e) || ye(e) || be(e),
		writable: !1
	});
}
function Is(e) {
	if (ko()) {
		let t = e.config.isCustomElement;
		Object.defineProperty(e.config, "isCustomElement", {
			get() {
				return t;
			},
			set() {
				Uo("The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead.");
			}
		});
		let n = e.config.compilerOptions, r = "The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka \"full build\"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader's `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc";
		Object.defineProperty(e.config, "compilerOptions", {
			get() {
				return Uo(r), n;
			},
			set() {
				Uo(r);
			}
		});
	}
}
function Ls(e) {
	if (g(e)) {
		let t = document.querySelector(e);
		return process.env.NODE_ENV !== "production" && !t && Uo(`Failed to mount app: mount target selector "${e}" returned null.`), t;
	}
	return process.env.NODE_ENV !== "production" && window.ShadowRoot && e instanceof window.ShadowRoot && e.mode === "closed" && Uo("mounting on a ShadowRoot with `{mode: \"closed\"}` may lead to unpredictable bugs"), e;
}
//#endregion
//#region node_modules/.pnpm/vue@3.5.38/node_modules/vue/dist/vue.runtime.esm-bundler.js
function Rs() {
	Vo();
}
process.env.NODE_ENV !== "production" && Rs();
//#endregion
//#region src/theme.js
var zs = {
	LIGHT: "light",
	DARK: "dark"
}, Bs = "bug-theme";
function Vs(e) {
	return e >= 50 ? zs.DARK : zs.LIGHT;
}
function Hs(e) {
	return e === zs.DARK ? 85 : 15;
}
function Us() {
	let e = document.documentElement.getAttribute("data-theme");
	return e === zs.LIGHT || e === zs.DARK ? e : window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? zs.DARK : zs.LIGHT;
}
function Ws(e) {
	document.documentElement.setAttribute("data-theme", e);
	try {
		localStorage.setItem(Bs, e);
	} catch {}
	return window.__heroField && typeof window.__heroField.retheme == "function" && window.__heroField.retheme(), e;
}
//#endregion
//#region src/components/composables/useSliderState.js
function Gs() {
	let e = /* @__PURE__ */ Yt(Hs(Us())), t = /* @__PURE__ */ Yt(!1), n = null, r = Bo(() => Vs(e.value)), i = Bo(() => r.value === zs.DARK), a = i, o = Bo(() => e.value === 100), s = Bo(() => i.value ? "深色" : "浅色");
	function c() {
		n != null && (clearTimeout(n), n = null), t.value = !1;
	}
	function l() {
		c(), t.value = !0, n = setTimeout(() => {
			t.value = !1, n = null;
		}, 460);
	}
	Sr(r, (e, t) => {
		e !== t && (Ws(e), l());
	});
	function u(t) {
		e.value = parseInt(t.target.value, 10);
	}
	return Jr(c), {
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
var Ks = "#version 300 es\n  layout(location=0) in vec2 a_pos;\n  out vec2 v_uv;\n  void main(){ v_uv=a_pos*0.5+0.5; gl_Position=vec4(a_pos,0.0,1.0); }\n", qs = "#version 300 es\n  precision highp float;\n  in vec2 v_uv; out vec4 fc;\n  uniform float u_time, u_slider, u_elapsed;\n  uniform sampler2D u_back;\n  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }\n  void main(){\n    vec2 uv=v_uv;\n    vec2 g=uv*vec2(72.0,6.0);\n    vec2 id=floor(g);\n    vec2 cf=fract(g);\n    float h=hash(id);\n    vec2 ap=abs(cf-0.5);\n    float cell=smoothstep(0.34,0.22,max(ap.x*0.9,ap.y));\n    vec3 prev=texture(u_back,uv).rgb;\n    float fade_mask = smoothstep(0.0, 0.45, uv.x);\n    vec3 decay = prev * 0.90 * fade_mask;\n    float act=smoothstep(0.95,1.0,u_slider);\n    if(act<0.01||u_elapsed<0.0){ fc=vec4(decay,1.0); return; }\n    float t=u_time;\n    float cellDelay = h * 1.2;\n    float cellAge   = max(u_elapsed - cellDelay, 0.0);\n    float ignited   = step(0.001, cellAge);\n    float cellSpd   = 0.85 + h * 0.30;\n    float eased = 1.0 - pow(1.0 - clamp(cellAge / 2.5, 0.0, 1.0), 3.0);\n    float dist  = eased * u_slider * cellSpd * ignited;\n    float cellOff = (h - 0.5) * 0.05;\n    float front   = max(u_slider - dist - cellOff, 0.02);\n    float tail    = max(u_slider - front, 0.001);\n    float inZ   = step(front - 0.003, uv.x) * step(uv.x, u_slider + 0.003);\n    float dn    = clamp(max(u_slider - uv.x, 0.0) / tail, 0.0, 1.0);\n    float bright = pow(1.0 - dn, 0.65);\n    bright = max(bright, 0.04 * ignited) * inZ;\n    bright *= 1.0 - smoothstep(0.94, 1.05, dn);\n    float es = mix(0.15, 0.5, min(u_elapsed / 1.0, 1.0));\n    float vy = abs(uv.y - 0.5) * 2.0;\n    float vf = pow(max(1.0 - vy * vy * 0.45, 0.0), 0.75);\n    float ts = mix(0.85, 1.0, min(u_elapsed / 1.5, 1.0));\n    float f1 = sin(uv.x * 30.0 + t * 15.0 * ts + h * 6.28);\n    float f2 = sin(uv.x * 17.0 + t * 8.0 * ts + h * 3.14);\n    float f3 = sin(uv.x * 52.0 + t * 25.0 * ts + h * 10.0);\n    float flame = smoothstep(0.08, 0.92, (f1 + f2 * 0.5 + f3 * 0.25) * 0.35 + 0.5);\n    float r1 = sin(dn * 16.0 - t * 5.0 * ts + h * 3.0);\n    float r2 = sin(dn * 8.0 - t * 2.5 * ts + h * 5.0);\n    float rhythm = smoothstep(-0.15, 0.55, r1) * (r2 * 0.5 + 0.5);\n    rhythm = pow(max(rhythm, 0.0), 1.2);\n    float avgSpd = dist / max(cellAge, 0.001);\n    float age    = max(cellAge - max(u_slider - uv.x, 0.0) / max(avgSpd, 0.001), 0.0);\n    float flash  = step(0.0, age) * exp(-age * 3.2);\n    float sp  = fract(t * (0.38 + h * 0.15) + h * 7.0);\n    float sX  = u_slider - sp * tail;\n    float sY  = 0.5 + sin(sp * 11.0 + h * 6.28) * 0.28;\n    float spark = smoothstep(0.014, 0.0, abs(uv.x - sX))\n                * smoothstep(0.18, 0.0, abs(uv.y - sY))\n                * (1.0 - sp) * (1.0 - sp) * es;\n    float energy = bright * vf * (flame * 0.42 + rhythm * 0.38)\n                 + flash * bright * vf * 0.55\n                 + spark * 0.7 * inZ;\n    energy *= es;\n    float edgeBase = exp(-pow((uv.x - front) * 18.0, 2.0));\n    float ef1 = sin(uv.x * 45.0 + t * 20.0 * ts + h * 6.28) * 0.5 + 0.5;\n    float ef2 = sin(uv.x * 28.0 + t * 11.0 * ts + h * 3.14) * 0.5 + 0.5;\n    float edge = edgeBase * (0.25 + ef1 * ef2 * 1.5) * 1.6 * act * es;\n    float leadD    = front - uv.x;\n    float leadZone = smoothstep(0.07, 0.0, leadD) * step(0.0, leadD) * vf;\n    float h2       = hash(id + vec2(99.0, 33.0));\n    float leadF    = sin(leadD * 100.0 + t * 20.0 * ts + h2 * 6.28) * 0.5 + 0.5;\n    float leadSpark = leadZone * step(0.6, h2) * leadF * act * es * 0.5;\n    float total = energy + edge + leadSpark;\n    vec3 ember = vec3(0.28, 0.10, 0.58);\n    vec3 wpur  = vec3(0.62, 0.32, 1.0);\n    vec3 wht   = vec3(1.0, 0.94, 0.98);\n    float temp = 1.0 - dn;\n    vec3 col   = mix(ember, wpur, temp);\n    col        = mix(col, wht, pow(temp, 4.5));\n    col       *= total;\n    float pulse = sin(t * 2.8) * 0.15 + 1.0;\n    float core  = exp(-pow((uv.x - u_slider) * 16.0, 2.0));\n    col += wht * core * 2.2 * pulse * act * es;\n    col += wpur * exp(-pow((uv.x - u_slider) * 3.5, 2.0)) * 0.12 * act * es;\n    col *= cell;\n    col *= fade_mask;\n    fc = vec4(min(decay + col, vec3(1.5)), 1.0);\n  }\n", Js = "#version 300 es\n  precision highp float;\n  in vec2 v_uv; out vec4 fc;\n  uniform sampler2D u_tex;\n  uniform vec2 u_dir, u_res;\n  uniform float u_ext;\n  vec3 s(vec2 uv){\n    vec3 c=texture(u_tex,uv).rgb;\n    return u_ext>0.5 && dot(c,vec3(0.2126,0.7152,0.0722))<0.3 ? vec3(0.0) : c;\n  }\n  void main(){\n    vec2 o=u_dir*1.8/u_res;\n    vec3 r=s(v_uv)*0.227027;\n    r+=s(v_uv+o)*0.194595;    r+=s(v_uv-o)*0.194595;\n    r+=s(v_uv+o*2.0)*0.121622;r+=s(v_uv-o*2.0)*0.121622;\n    r+=s(v_uv+o*3.0)*0.054054;r+=s(v_uv-o*3.0)*0.054054;\n    fc=vec4(r,1.0);\n  }\n", Ys = "#version 300 es\n  precision highp float;\n  in vec2 v_uv; out vec4 fc;\n  uniform sampler2D u_scene, u_glow;\n  void main(){\n    vec3 s=texture(u_scene,v_uv).rgb;\n    vec3 g=texture(u_glow,v_uv).rgb;\n    fc=vec4(1.0-exp(-(s+g*1.2+s*g*0.35)*1.15),1.0);\n  }\n";
//#endregion
//#region src/components/composables/useWebglFire.js
function Xs(e, t, n) {
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
	Sr(n, (e) => {
		C = e;
	}, { immediate: !0 }), Sr(t, (e) => {
		w = e / 100;
	}, { immediate: !0 }), Sr(n, (e) => {
		e && d == null ? d = performance.now() : e || (d = null), e && A();
	}, { flush: "post" }), Gr(() => An(te)), Jr(() => {
		a &&= (cancelAnimationFrame(a), null), o &&= (o.disconnect(), null), s &&= (clearTimeout(s), null), c = !1, ae(), oe(), i && (i.removeEventListener("webglcontextlost", T), i.removeEventListener("webglcontextrestored", ee)), r = null, i = null;
	});
	function T(e) {
		e.preventDefault();
	}
	function ee() {
		_ = !1, D(), _ && (ne(), C && A());
	}
	function te() {
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
		r = n, i = t, t.addEventListener("webglcontextlost", T), t.addEventListener("webglcontextrestored", ee), D(), _ && (o = new ResizeObserver(() => {
			clearTimeout(s), s = setTimeout(ne, 80);
		}), o.observe(t), ne());
	}
	function ne() {
		if (!r || !i) return;
		let e = i.getBoundingClientRect();
		if (!e.width || !e.height) return;
		let t = window.devicePixelRatio;
		i.width = Math.round(e.width * t), i.height = Math.round(e.height * t), ae(), ie();
	}
	function E(e, t) {
		let n = r.createShader(e);
		return r.shaderSource(n, t), r.compileShader(n), r.getShaderParameter(n, r.COMPILE_STATUS) ? n : (console.error(r.getShaderInfoLog(n)), r.deleteShader(n), null);
	}
	function re(e, t) {
		let n = E(r.VERTEX_SHADER, e), i = E(r.FRAGMENT_SHADER, t);
		if (!n || !i) return null;
		let a = r.createProgram();
		return r.attachShader(a, n), r.attachShader(a, i), r.bindAttribLocation(a, 0, "a_pos"), r.linkProgram(a), r.deleteShader(n), r.deleteShader(i), r.getProgramParameter(a, r.LINK_STATUS) ? a : (console.error(r.getProgramInfoLog(a)), null);
	}
	function D() {
		r && (f = re(Ks, qs), p = re(Ks, Js), m = re(Ks, Ys), !(!f || !p || !m) && (h = r.createVertexArray(), r.bindVertexArray(h), g = r.createBuffer(), r.bindBuffer(r.ARRAY_BUFFER, g), r.bufferData(r.ARRAY_BUFFER, new Float32Array([
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
	function O() {
		let e = r.createFramebuffer(), t = r.createTexture();
		return r.bindFramebuffer(r.FRAMEBUFFER, e), r.bindTexture(r.TEXTURE_2D, t), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, i.width, i.height, 0, r.RGBA, r.UNSIGNED_BYTE, null), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, t, 0), r.clearColor(0, 0, 0, 1), r.clear(r.COLOR_BUFFER_BIT), {
			fbo: e,
			tex: t
		};
	}
	function ie() {
		!r || !i || (v = O(), y = O(), b = O(), x = O());
	}
	function k(e) {
		!r || !e || (r.deleteFramebuffer(e.fbo), r.deleteTexture(e.tex));
	}
	function ae() {
		k(v), v = null, k(y), y = null, k(b), b = null, k(x), x = null;
	}
	function oe() {
		r && (f &&= (r.deleteProgram(f), null), p &&= (r.deleteProgram(p), null), m &&= (r.deleteProgram(m), null), h &&= (r.deleteVertexArray(h), null), g &&= (r.deleteBuffer(g), null), _ = !1);
	}
	function A() {
		if (!((!v || !y) && (ne(), !v || !y))) {
			if (c) {
				l = 0;
				return;
			}
			c = !0, l = 0, u = !1, r.bindFramebuffer(r.FRAMEBUFFER, v.fbo), r.clear(r.COLOR_BUFFER_BIT), r.bindFramebuffer(r.FRAMEBUFFER, y.fbo), r.clear(r.COLOR_BUFFER_BIT), a = requestAnimationFrame(se);
		}
	}
	function se(e) {
		let t = C;
		if (!t && !u) {
			if (++l > 180) {
				c = !1, a = null;
				return;
			}
			a = requestAnimationFrame(se);
			return;
		}
		l = 0, t && !u && (r.bindFramebuffer(r.FRAMEBUFFER, v.fbo), r.clear(r.COLOR_BUFFER_BIT), r.bindFramebuffer(r.FRAMEBUFFER, y.fbo), r.clear(r.COLOR_BUFFER_BIT)), u = t;
		let n = t ? (performance.now() - (d || 0)) / 1e3 : -1, o = w;
		r.viewport(0, 0, i.width, i.height), r.bindFramebuffer(r.FRAMEBUFFER, y.fbo), r.useProgram(f), r.uniform1f(S.simTime, e * .001), r.uniform1f(S.simSlider, o), r.uniform1f(S.simElapsed, n), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, v.tex), r.uniform1i(S.simBack, 0), r.drawArrays(r.TRIANGLES, 0, 6), r.useProgram(p), r.uniform2f(S.blurRes, i.width, i.height), r.bindFramebuffer(r.FRAMEBUFFER, b.fbo), r.uniform2f(S.blurDir, 1, 0), r.uniform1f(S.blurExt, 1), r.bindTexture(r.TEXTURE_2D, y.tex), r.uniform1i(S.blurTex, 0), r.drawArrays(r.TRIANGLES, 0, 6), r.bindFramebuffer(r.FRAMEBUFFER, x.fbo), r.uniform2f(S.blurDir, 0, 1), r.uniform1f(S.blurExt, 0), r.bindTexture(r.TEXTURE_2D, b.tex), r.drawArrays(r.TRIANGLES, 0, 6), r.bindFramebuffer(r.FRAMEBUFFER, null), r.useProgram(m), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, y.tex), r.uniform1i(S.compScene, 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, x.tex), r.uniform1i(S.compGlow, 1), r.drawArrays(r.TRIANGLES, 0, 6);
		let s = v;
		v = y, y = s, a = requestAnimationFrame(se);
	}
}
//#endregion
//#region \0plugin-vue:export-helper
var Zs = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, Qs = { class: "card-shadow" }, $s = { class: "header" }, ec = { class: "header-left" }, tc = { class: "dots-layer" }, nc = ["value"], rc = /*#__PURE__*/ Zs({
	__name: "EffortCard",
	setup(e) {
		let { sliderValue: t, isActive: n, isFull: r, isAnimating: i, statusLabel: a, onInput: o } = Gs(), s = Math.random().toString(36).slice(2, 8), c = `squircle-${s}`, l = `squircle-track-${s}`, u = Bo(() => ({ clipPath: `url(#${c})` })), d = Bo(() => ({ clipPath: `url(#${l})` })), f = Bo(() => {
			let e = Math.min(t.value + 2, 100);
			return {
				maskImage: `linear-gradient(to right, black 0%, black ${e}%, transparent ${e}%)`,
				WebkitMaskImage: `linear-gradient(to right, black 0%, black ${e}%, transparent ${e}%)`
			};
		}), p = /* @__PURE__ */ Yt(null);
		return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches || Xs(p, t, n), (e, s) => (Ua(), Ja(Y, null, [Z("svg", {
			class: "squircle-clip",
			xmlns: "http://www.w3.org/2000/svg",
			"aria-hidden": "true"
		}, [Z("defs", null, [Z("clipPath", {
			id: c,
			clipPathUnits: "objectBoundingBox"
		}, [...s[1] ||= [Z("path", { d: "M 0.053,0\n             C 0.029,0 0.012,0.008 0.005,0.02\n             C 0.002,0.028 0,0.038 0,0.053\n             L 0,0.947\n             C 0,0.962 0.002,0.972 0.005,0.98\n             C 0.012,0.992 0.029,1 0.053,1\n             L 0.947,1\n             C 0.971,1 0.988,0.992 0.995,0.98\n             C 0.998,0.972 1,0.962 1,0.947\n             L 1,0.053\n             C 1,0.038 0.998,0.028 0.995,0.02\n             C 0.988,0.008 0.971,0 0.947,0\n             Z" }, null, -1)]]), Z("clipPath", {
			id: l,
			clipPathUnits: "objectBoundingBox"
		}, [...s[2] ||= [Z("path", { d: "M 0.033,0\n             C 0.018,0 0.007,0.012 0.003,0.035\n             C 0.001,0.055 0,0.1 0,0.15\n             L 0,0.85\n             C 0,0.9 0.001,0.945 0.003,0.965\n             C 0.007,0.988 0.018,1 0.033,1\n             L 0.967,1\n             C 0.982,1 0.993,0.988 0.997,0.965\n             C 0.999,0.945 1,0.9 1,0.85\n             L 1,0.15\n             C 1,0.1 0.999,0.055 0.997,0.035\n             C 0.993,0.012 0.982,0 0.967,0\n             Z" }, null, -1)]])])]), Z("div", Qs, [Z("div", {
			class: "card",
			style: le(u.value)
		}, [
			Z("div", $s, [Z("div", ec, [s[3] ||= Z("span", { class: "label-text" }, "主题", -1), Z("span", { class: me(["status-text", {
				glowing: Qt(n),
				"animate-up": Qt(i)
			}]) }, De(Qt(a)), 3)]), s[4] ||= Z("div", { class: "help-btn" }, [Z("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "1.5",
				stroke: "currentColor"
			}, [Z("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
			})])], -1)]),
			s[6] ||= Z("div", { class: "scale-labels" }, [Z("span", null, "浅色"), Z("span", null, "深色")], -1),
			Z("div", {
				class: me(["track-wrapper", {
					active: Qt(n),
					full: Qt(r)
				}]),
				style: le(d.value)
			}, [
				s[5] ||= Z("div", { class: "track-bg" }, null, -1),
				Z("div", tc, [(Ua(), Ja(Y, null, ti(5, (e) => Z("span", {
					class: "dot",
					key: e
				})), 64))]),
				Z("canvas", {
					ref_key: "canvasRef",
					ref: p,
					style: le(f.value)
				}, null, 4),
				Z("input", {
					type: "range",
					min: "0",
					max: "100",
					value: Qt(t),
					class: me({ glowing: Qt(n) }),
					onInput: s[0] ||= (...e) => Qt(o) && Qt(o)(...e)
				}, null, 42, nc)
			], 6)
		], 4)])], 64));
	}
}, [["__scopeId", "data-v-ed095a10"]]), ic = document.getElementById("theme-slider");
if (ic) {
	Ns(rc).mount(ic);
	let e = document.getElementById("themeBtn");
	e && (e.hidden = !0);
}
//#endregion
