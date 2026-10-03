//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = [
	"subject_detail",
	"career_activity",
	"autonomous_activity",
	"club_activity",
	"volunteer_activity",
	"reading",
	"behavior",
	"award",
	"attendance",
	"grade",
	"coursework",
	"other"
], u = [
	"topic",
	"motivation",
	"concept",
	"method",
	"tool",
	"data",
	"number",
	"direct_action",
	"decision",
	"result",
	"interpretation",
	"limitation",
	"revision",
	"failure",
	"role",
	"collaboration",
	"communication",
	"reading",
	"growth",
	"career",
	"teacher_observation",
	"ownership",
	"evidence_boundary"
], d = [
	"CALM",
	"RESERVED",
	"CURIOUS",
	"ANALYTICAL",
	"SKEPTICAL",
	"FAST_PACED",
	"PATIENT",
	"MINIMAL_RESPONSE"
], f = [
	"SPECIFICITY",
	"EVIDENCE",
	"OWNERSHIP",
	"CONCEPT",
	"LIMITATION",
	"GROWTH",
	"CAREER",
	"COMMUNITY",
	"BREADTH",
	"DEPTH"
], p = [
	"RESP_MINIMAL",
	"RESP_CURIOUS",
	"RESP_FAST",
	"RESP_CONFIRMING",
	"RESP_MIXED"
], m = [
	"BIAS_BALANCED",
	"BIAS_PROCESS",
	"BIAS_CONCEPT",
	"BIAS_EVIDENCE",
	"BIAS_LIMIT",
	"BIAS_CAREER",
	"BIAS_BREADTH",
	"BIAS_DEPTH"
], h = [
	"START_DIRECT",
	"START_SELF",
	"START_MOTIVE",
	"START_ICE",
	"START_SURPRISE"
], g = [
	"END_DIRECT",
	"END_LAST_WORD",
	"END_FINAL_QUESTION",
	"END_TIME_CUT",
	"END_LIGHT"
], _ = [
	"ACTIVITY_VERIFY",
	"CONCEPT",
	"METHOD",
	"RESULT_EVIDENCE",
	"LIMITATION",
	"CAREER",
	"ACADEMIC",
	"READING",
	"COMMUNITY",
	"GROWTH",
	"CROSS_RECORD",
	"SURPRISE",
	"SELF_INTRO",
	"MOTIVATION",
	"DAILY"
], v = [
	"VERIFY",
	"CLARIFY",
	"CONCEPT_CHECK",
	"METHOD_CHECK",
	"EVIDENCE_CHECK",
	"BOUNDARY",
	"COUNTERFACTUAL",
	"ALTERNATIVE",
	"TRANSFER",
	"SELF_CORRECTION",
	"RECOVERY"
], y = [..._, ...v], b = [
	"D1",
	"D2",
	"D3",
	"D4",
	"D5",
	"D6"
], x = ["ROOT", "FOLLOWUP"], ee = [
	"activity",
	"concept",
	"method",
	"evidence",
	"boundary",
	"ownership",
	"career",
	"academic",
	"reading",
	"community",
	"growth",
	"surprise",
	"cross_record",
	"year_1",
	"year_2",
	"year_3",
	"direct_action",
	"teamwork",
	"result",
	"limitation"
], te = [
	"ALWAYS_ELIGIBLE",
	"RANDOM",
	"KEYWORD_ANY",
	"ANSWER_TOO_SHORT",
	"ANSWER_TOO_LONG",
	"NO_ANSWER",
	"DONT_KNOW_PATTERN",
	"AFTER_PARENT",
	"SESSION_TIME_REMAINING"
];
//#endregion
//#region src/phase1/hash.ts
async function ne(e) {
	let t = new Uint8Array(e.byteLength);
	t.set(e);
	let n = await crypto.subtle.digest("SHA-256", t);
	return Array.from(new Uint8Array(n), (e) => e.toString(16).padStart(2, "0")).join("");
}
function re(e) {
	return new TextEncoder().encode(e);
}
//#endregion
//#region node_modules/zod/v4/core/util.js
function ie(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function ae(e, t = "|") {
	return e.map((e) => Ee(e)).join(t);
}
function oe(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
var se = class {
	constructor(e) {
		this._getter = e, this._value = void 0;
	}
	get value() {
		let e = this._getter;
		return e !== void 0 && (this._value = e(), this._getter = void 0), this._value;
	}
};
function ce(e) {
	return new se(e);
}
function le(e) {
	return e == null;
}
function ue(e) {
	let t = +!!e.startsWith("^"), n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function de(e, t) {
	let n = e / t, r = Math.round(n), i = 4 * 2 ** -52 * Math.max(Math.abs(n), 1);
	return Math.abs(n - r) < i ? 0 : n - r;
}
function S(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function fe(e) {
	let t = Object.getOwnPropertyDescriptor(e, "shape");
	return t?.get ? t.get.raw : t?.value;
}
function pe(e) {
	return fe(e._zod.def) ?? e._zod.def.shape;
}
function me(e, t, n) {
	Object.defineProperty(e, t, {
		get() {
			let e = n();
			return S(this, t, e), e;
		},
		enumerable: !0,
		configurable: !0
	});
}
function he(e, t, n) {
	t in e ? S(e, t, n) : e[t] = n;
}
function ge(e, t, n, r) {
	let i = pe(t);
	for (let a of n) {
		let n = Object.getOwnPropertyDescriptor(i, a);
		n.enumerable && (n.get ? me(e, a, () => {
			let e = t._zod.def.shape[a];
			return r ? r(e, a) : e;
		}) : he(e, a, r ? r(n.value, a) : n.value));
	}
}
function _e(e, t) {
	for (let n of Reflect.ownKeys(t)) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.enumerable && (r.get ? me(e, n, () => t[n]) : he(e, n, r.value));
	}
}
function C(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function ve(e) {
	return JSON.stringify(e);
}
function ye(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var be = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function w(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var xe = /* @__PURE__*/ ce(() => {
	if (P.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function T(e) {
	if (w(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return w(n) !== !1 && Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") !== !1;
}
function Se(e) {
	return T(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var Ce = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function we(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Te(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function E(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == "string") return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == "string" ? {
		...t,
		error: () => t.error
	} : t;
}
function Ee(e) {
	return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function De(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional");
}
var Oe = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, ke = {
	int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
	uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")]
};
function Ae(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	let i = {};
	return ge(i, e, je(e, t)), Te(e, C(n, {
		shape: i,
		checks: []
	}));
}
function je(e, t) {
	let n = pe(e), r = [];
	for (let e of Reflect.ownKeys(t)) {
		if (!Object.getOwnPropertyDescriptor(n, e)?.enumerable) throw Error(`Unrecognized key: "${String(e)}"`);
		t[e] && r.push(e);
	}
	return r;
}
function Me(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	let i = new Set(je(e, t)), a = {};
	return ge(a, e, Reflect.ownKeys(pe(e)).filter((e) => !i.has(e))), Te(e, C(n, {
		shape: a,
		checks: []
	}));
}
function Ne(e, t) {
	if (!T(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = pe(e);
		for (let e of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return Te(e, C(e._zod.def, { shape: Pe(e, t) }));
}
function Pe(e, t) {
	let n = {};
	return ge(n, e, Reflect.ownKeys(pe(e))), _e(n, t), n;
}
function Fe(e, t) {
	if (!T(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return Te(e, C(e._zod.def, { shape: Pe(e, t) }));
}
function Ie(e, t) {
	if (!t?._zod?.def) throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (e._zod.def.checks?.length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	let n = {};
	return ge(n, e, Reflect.ownKeys(pe(e))), ge(n, t, Reflect.ownKeys(pe(t))), Te(e, C(e._zod.def, {
		shape: n,
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function Le(e, t, n, r = "partial") {
	let i = t._zod.def.checks;
	if (i && i.length > 0) throw Error(`.${r}() cannot be used on object schemas containing refinements`);
	let a = n ? new Set(je(t, n)) : void 0, o = {};
	return ge(o, t, Reflect.ownKeys(pe(t)), e && ((t, n) => a && !a.has(n) ? t : new e({
		type: "optional",
		innerType: t
	}))), Te(t, C(t._zod.def, {
		shape: o,
		checks: []
	}));
}
function Re(e, t, n) {
	let r = n ? new Set(je(t, n)) : void 0, i = {};
	return ge(i, t, Reflect.ownKeys(pe(t)), (t, n) => r && !r.has(n) ? t : new e({
		type: "nonoptional",
		innerType: t
	})), Te(t, C(t._zod.def, { shape: i }));
}
function D(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function ze(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function Be(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function Ve(e) {
	return typeof e == "string" ? e : e?.message;
}
function He(e, t, n) {
	var r;
	for (let i = t; i < e.length; i++) (r = e[i]).schema ?? (r.schema = n);
}
function O(e, t, n) {
	var r;
	let i = e.inst?._zod?.traits;
	i?.has("$ZodType") && (i.has("$ZodCheck") ? (r = e).schema ?? (r.schema = e.inst) : e.schema = e.inst);
	let a = e.schema === e.inst ? void 0 : e.schema?._zod.def?.error, o = e.message ? e.message : Ve(e.inst?._zod.def?.error?.(e)) ?? Ve(a?.(e)) ?? Ve(t?.error?.(e)) ?? Ve(n.customError?.(e)) ?? Ve(n.localeError?.(e)) ?? "Invalid input", s = {};
	for (let t of Object.keys(e)) t !== "inst" && t !== "schema" && t !== "continue" && t !== "input" && t !== "__proto__" && (s[t] = e[t]);
	return s.path ??= [], s.message = o, t?.reportInput && (s.input = e.input), s;
}
var Ue = /[\uD800-\uDBFF]/;
function We(e) {
	let t = e.length;
	if (!Ue.test(e)) return t;
	let n = t;
	for (let r = 0; r < t - 1; r++) (e.charCodeAt(r) & 64512) == 55296 && (e.charCodeAt(r + 1) & 64512) == 56320 && (n--, r++);
	return n;
}
function Ge(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function k(e) {
	let t = typeof e;
	switch (t) {
		case "number": return Number.isNaN(e) ? "nan" : "number";
		case "object": {
			if (e === null) return "null";
			if (Array.isArray(e)) return "array";
			let t = e;
			if (t && Object.getPrototypeOf(t) !== Object.prototype && "constructor" in t && t.constructor) return t.constructor.name;
		}
	}
	return t;
}
function Ke(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
function qe(e, t) {
	for (let n in t) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.get ? Object.defineProperty(e, n, {
			...r,
			enumerable: !1
		}) : Ze(e, n, r.value);
	}
}
function Je(e, t, n, r = !0) {
	return Object.defineProperty(e, t, {
		configurable: !0,
		writable: !0,
		enumerable: r,
		value: n
	}), n;
}
function Ye(e, t, n) {
	return Je(e, t, n, !1);
}
function Xe(e, t) {
	for (let n in e) {
		let r = e[n];
		Object.defineProperty(t, n, {
			configurable: !0,
			enumerable: !0,
			get() {
				return Je(this, n, r(this));
			},
			set(e) {
				Je(this, n, e);
			}
		});
	}
	return t;
}
function Ze(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		get() {
			return this == null ? n : Je(this, t, n.bind(this));
		},
		set(e) {
			Je(this, t, e);
		}
	});
}
function Qe(e, t) {
	let n = Object.getPrototypeOf(e);
	return t in n ? void 0 : n;
}
var $e, et = !1, tt = {
	configurable: !0,
	get() {
		et = !0;
	}
};
function A(e, t, n) {
	let r = Object.getPrototypeOf(e._zod);
	if (t in r && $e !== e._zod) {
		$e = void 0;
		return;
	}
	$e = e._zod, Object.defineProperty(r, t, {
		configurable: !0,
		get() {
			Object.defineProperty(this, t, tt);
			let e = et;
			et = !1;
			try {
				let r = n(this);
				return et ? delete this[t] : Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: r
				}), et ||= e, r;
			} catch (n) {
				throw delete this[t], et ||= e, n;
			}
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				value: e
			});
		}
	});
}
function j(e, t, n, r) {
	let i = Qe(e, t);
	i && Object.defineProperty(i, t, {
		configurable: !0,
		get() {
			let e = {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: void 0
			};
			return Object.defineProperty(this, t, e), e.value = n(this), Object.defineProperty(this, t, e), e.value;
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: e
			});
		}
	});
}
var M = "~constantCatch";
function nt(e) {
	let t = () => e;
	return t[M] = !0, t;
}
//#endregion
//#region node_modules/zod/v4/core/core.js
var rt, it = {
	value: void 0,
	enumerable: !1
}, at = "captureStackTrace" in Error ? Error : null;
function ot(e) {
	let t = at;
	if (t) {
		let n = t.stackTraceLimit;
		if (typeof n == "number") {
			try {
				t.stackTraceLimit = 0;
			} catch {
				return at = null, new e();
			}
			try {
				return new e();
			} finally {
				t.stackTraceLimit = n;
			}
		}
	}
	return new e();
}
function N(e, t, n, r) {
	let i = {};
	function a(e) {
		this.def = e, this.constr = d, this.traits = /* @__PURE__ */ new Set();
	}
	a.prototype = i;
	let o = n, s = o && /* @__PURE__ */ new WeakSet();
	function c(n, r) {
		if (!n._zod) {
			it.value = new a(r);
			try {
				Object.defineProperty(n, "_zod", it);
			} finally {
				it.value = void 0;
			}
		} else if (n._zod.traits.has(e)) return;
		if (n._zod.traits.add(e), t(n, r), s) {
			let e = Object.getPrototypeOf(n), t = n._zod.constr.prototype, r = e;
			for (; r && r !== t;) r = Object.getPrototypeOf(r);
			let i = r ?? e;
			s.has(i) || (s.add(i), qe(i, o));
		}
		let i = d.prototype;
		for (let e in i) Object.prototype.hasOwnProperty.call(i, e) && (e in n || (n[e] = i[e].bind(n)));
	}
	let l = r?.Parent ?? Object;
	class u extends l {}
	Object.defineProperty(u, "name", { value: e });
	function d(e) {
		let t = r?.Parent ? ot(u) : this;
		c(t, e);
		let n = t._zod.deferred;
		if (n) {
			for (let e of n) e();
			t._zod.deferred = void 0;
		}
		let i = globalThis.__zod_globalConfig?.postProcessor;
		return i && i(t), t;
	}
	return Object.defineProperty(d, "init", { value: c }), Object.defineProperty(d, Symbol.hasInstance, { value: (t) => r?.Parent && t instanceof r.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(d, "name", { value: e }), d;
}
var st = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, ct = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
};
(rt = globalThis).__zod_globalConfig ?? (rt.__zod_globalConfig = {});
var P = globalThis.__zod_globalConfig;
function lt(e) {
	return e && Object.assign(P, e), P;
}
//#endregion
//#region node_modules/zod/v4/core/errors.js
function ut() {
	let e = this._zod;
	return e.message ??= JSON.stringify(e.def, oe, 2), e.message;
}
function dt(e) {
	this._zod.message = e;
}
var ft = {
	get: ut,
	set: dt,
	enumerable: !0,
	configurable: !0
}, pt = {
	value: void 0,
	enumerable: !1
}, mt = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), F = (e, t) => {
	e.name = "$ZodError", pt.value = t, Object.defineProperty(e, "issues", pt), pt.value = void 0, Object.defineProperty(e, "message", ft);
	let n = Object.getPrototypeOf(e);
	mt.has(n) || (mt.add(n), Object.defineProperty(n, "toString", {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = () => this.message;
			return Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	}));
}, ht = N("$ZodError", F);
N("$ZodError", F, void 0, { Parent: Error });
function gt(e, t, n) {
	return Object.prototype.hasOwnProperty.call(e, t) || (t === "__proto__" ? Object.defineProperty(e, t, {
		value: n(),
		writable: !0,
		enumerable: !0,
		configurable: !0
	}) : e[t] = n()), e[t];
}
function _t(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? gt(n, i.path[0], () => []).push(t(i)) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function vt(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e, i = []) => {
		for (let a of e.issues) if (a.code === "invalid_union" && a.errors.length) a.errors.map((e) => r({ issues: e }, [...i, ...a.path]));
		else if (a.code === "invalid_key") r({ issues: a.issues }, [...i, ...a.path]);
		else if (a.code === "invalid_element") r({ issues: a.issues }, [...i, ...a.path]);
		else {
			let e = [...i, ...a.path];
			if (e.length === 0) n._errors.push(t(a));
			else {
				let r = n, i = 0;
				for (; i < e.length;) {
					let n = e[i], o = i === e.length - 1;
					if (n === "_errors") {
						o && r._errors.push(t(a)), i++;
						continue;
					}
					Object.prototype.hasOwnProperty.call(r, n) || Object.defineProperty(r, n, {
						value: { _errors: [] },
						enumerable: !0,
						writable: !0,
						configurable: !0
					});
					let s = r[n];
					o && s._errors.push(t(a)), r = s, i++;
				}
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/zod/v4/core/parse.js
function yt(e, t) {
	return {
		callee: t?.callee ?? e,
		Err: t?.Err
	};
}
var bt = (e) => {
	let t = (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !1
		} : { async: !1 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise) throw new st();
		if (s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => O(e, o, lt())));
			throw be(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, xt = (e) => {
	let t = async (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !0
		} : { async: !0 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise && (s = await s), s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => O(e, o, lt())));
			throw be(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, St = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new st();
	return a.issues.length ? Ct(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
};
function Ct(e, t, n) {
	let r;
	return {
		success: !1,
		get error() {
			return r || (r = new e(t.map((e) => O(e, n, lt()))), t = void 0, n = void 0), r;
		},
		set error(e) {
			r = e, t = void 0, n = void 0;
		}
	};
}
var wt = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		async: !0
	} : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? Ct(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
}, I = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), Tt = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), Et = ((e, t, n) => {
	let r = e._zod.bag.validator;
	if (r !== void 0) {
		if (r(t) !== I) return !0;
		if (r.definite === !0 && n === void 0) return !1;
	}
	return Dt(e, t, n);
});
function Dt(e, t, n) {
	let r = n ? {
		...n,
		async: !1,
		abortEarly: !0
	} : {
		async: !1,
		abortEarly: !0
	}, i = e._zod.bag.fallbackRun, a;
	if (i ? (r[Tt] = !0, a = i({
		value: t,
		issues: []
	}, r)) : a = e._zod.run({
		value: t,
		issues: []
	}, r), a instanceof Promise) throw new st();
	return a.issues.length === 0;
}
var Ot = async (e, t, n) => {
	let r = n ? {
		...n,
		async: !0,
		abortEarly: !0
	} : {
		async: !0,
		abortEarly: !0
	}, i = e._zod.run({
		value: t,
		issues: []
	}, r);
	return i instanceof Promise && (i = await i), i.issues.length === 0;
}, kt = (e) => {
	let t = bt(e), n = (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return t(e, r, o, yt(n, a));
	};
	return n;
}, At = (e) => {
	let t = bt(e), n = (e, r, i, a) => t(e, r, i, yt(n, a));
	return n;
}, jt = (e) => {
	let t = xt(e), n = async (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return await t(e, r, o, yt(n, a));
	};
	return n;
}, L = (e) => {
	let t = xt(e), n = async (e, r, i, a) => await t(e, r, i, yt(n, a));
	return n;
}, Mt = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return St(e)(t, n, i);
}, Nt = (e) => (t, n, r) => St(e)(t, n, r), Pt = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return wt(e)(t, n, i);
}, Ft = (e) => async (t, n, r) => wt(e)(t, n, r), It = /^[cC][0-9a-z]{6,}$/, Lt = /^[0-9a-z]+$/, Rt = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, zt = /^[0-9a-vA-V]{20}$/, Bt = /^[A-Za-z0-9]{27}$/, Vt = /^[a-zA-Z0-9_-]{21}$/;
function R(e) {
	return RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
var Ht = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Ut = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Wt = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Gt = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Kt = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function qt() {
	return new RegExp(Kt, "u");
}
var Jt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Yt = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, Xt = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, z = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Zt = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Qt = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/, $t = /^https?$/, en = /^\+[1-9]\d{6,14}$/, tn = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function nn(e) {
	return RegExp(`^${e}$`);
}
var rn = /*@__PURE__*/ nn(tn);
function an(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function on(e) {
	return RegExp(`^${an(e)}$`);
}
function sn(e) {
	let t = ["Z"];
	e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let n = `${an({
		precision: e.precision,
		seconds: !0
	})}(?:${t.join("|")})`, r = e.local ? `${n}|${an({ precision: e.precision })}` : n;
	return RegExp(`^${tn}T(?:${r})$`);
}
var cn = /^[\s\S]{0,}$/, ln = /^-?\d+(?:\.\d+)?$/, un = /^(?:true|false)$/i, dn = /^[^A-Z]*$/, fn = /^[^a-z]*$/, B = /*@__PURE__*/ N("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), pn = (e) => {
	let t = e.value;
	return !le(t) && t.length !== void 0;
}, mn = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, hn = /*@__PURE__*/ N("$ZodCheckLessThan", (e, t) => {
	B.init(e, t);
	let n = mn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: mn[typeof r.value] ?? n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), gn = /*@__PURE__*/ N("$ZodCheckGreaterThan", (e, t) => {
	B.init(e, t);
	let n = mn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: mn[typeof r.value] ?? n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), _n = /*@__PURE__*/ N("$ZodCheckMultipleOf", (e, t) => {
	B.init(e, t), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? t.value !== BigInt(0) && n.value % t.value === BigInt(0) : de(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), vn = /*@__PURE__*/ N("$ZodCheckNumberFormat", (e, t) => {
	B.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = Oe[t.format];
	e._zod.check = (o) => {
		let s = o.value;
		if (n) {
			if (!Number.isInteger(s)) {
				o.issues.push({
					expected: r,
					format: t.format,
					code: "invalid_type",
					continue: !1,
					input: s,
					inst: e
				});
				return;
			}
			if (!Number.isSafeInteger(s)) {
				s > 0 ? o.issues.push({
					input: s,
					code: "too_big",
					maximum: 2 ** 53 - 1,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}) : o.issues.push({
					input: s,
					code: "too_small",
					minimum: -(2 ** 53 - 1),
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				});
				return;
			}
		}
		s < i && o.issues.push({
			origin: "number",
			input: s,
			code: "too_small",
			minimum: i,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		}), s > a && o.issues.push({
			origin: "number",
			input: s,
			code: "too_big",
			maximum: a,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		});
	};
}), yn = /*@__PURE__*/ N("$ZodCheckMaxLength", (e, t) => {
	var n;
	B.init(e, t), (n = e._zod.def).when ?? (n.when = pn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i > t.maximum ? We(r) : i) <= t.maximum) return;
		let a = Ge(r);
		n.issues.push({
			origin: a,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), bn = /*@__PURE__*/ N("$ZodCheckMinLength", (e, t) => {
	var n;
	B.init(e, t), (n = e._zod.def).when ?? (n.when = pn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i >= t.minimum && i < t.minimum * 2 ? We(r) : i) >= t.minimum) return;
		let a = Ge(r);
		n.issues.push({
			origin: a,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), xn = /*@__PURE__*/ N("$ZodCheckLengthEquals", (e, t) => {
	var n;
	B.init(e, t), (n = e._zod.def).when ?? (n.when = pn), e._zod.check = (n) => {
		let r = n.value, i = r.length, a = typeof r == "string" && i >= t.length && i <= t.length * 2 ? We(r) : i;
		if (a === t.length) return;
		let o = Ge(r), s = a > t.length;
		n.issues.push({
			origin: o,
			...s ? {
				code: "too_big",
				maximum: t.length
			} : {
				code: "too_small",
				minimum: t.length
			},
			inclusive: !0,
			exact: !0,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Sn = /*@__PURE__*/ N("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	B.init(e, t), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: t.format,
			input: n.value,
			...t.pattern ? { pattern: t.pattern.toString() } : {},
			inst: e,
			continue: !t.abort
		});
	}) : (r = e._zod).check ?? (r.check = () => {});
}), Cn = /*@__PURE__*/ N("$ZodCheckRegex", (e, t) => {
	Sn.init(e, t), e._zod.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: n.value,
			pattern: t.pattern.toString(),
			inst: e,
			continue: !t.abort
		});
	};
}), wn = /*@__PURE__*/ N("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= dn, Sn.init(e, t);
}), Tn = /*@__PURE__*/ N("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= fn, Sn.init(e, t);
}), En = /*@__PURE__*/ N("$ZodCheckIncludes", (e, t) => {
	B.init(e, t);
	let n = we(t.includes);
	t.pattern = new RegExp(typeof t.position == "number" ? `^.{${t.position},}${n}` : n), e._zod.check = (n) => {
		n.value.includes(t.includes, t.position) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: t.includes,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Dn = /*@__PURE__*/ N("$ZodCheckStartsWith", (e, t) => {
	B.init(e, t);
	let n = RegExp(`^${we(t.prefix)}.*`);
	t.pattern ??= n, e._zod.check = (n) => {
		n.value.startsWith(t.prefix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: t.prefix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), On = /*@__PURE__*/ N("$ZodCheckEndsWith", (e, t) => {
	B.init(e, t);
	let n = RegExp(`.*${we(t.suffix)}$`);
	t.pattern ??= n, e._zod.check = (n) => {
		n.value.endsWith(t.suffix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: t.suffix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), kn = /*@__PURE__*/ N("$ZodCheckOverwrite", (e, t) => {
	B.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), An = class {
	constructor(e = [], t = {}) {
		this.content = [], this.indent = 0, this.args = e, this.closed = t;
	}
	indented(e) {
		this.indent += 1;
		try {
			e(this);
		} finally {
			--this.indent;
		}
	}
	write(e) {
		if (typeof e == "function") {
			e(this, { execution: "sync" }), e(this, { execution: "async" });
			return;
		}
		let t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(this.indent * 2) + e);
		for (let e of r) this.content.push(e);
	}
	compile() {
		let e = Function, t = this?.content ?? [""];
		return new e(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${t.join("\n")}\n};`)(...Object.values(this.closed));
	}
}, jn = {
	major: 4,
	minor: 6,
	patch: 5
}, V = /*@__PURE__*/ N("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = jn;
	let r = e._zod.def.checks, i = e._zod.traits.has("$ZodCheck") ? [e, ...r ?? []] : r?.length ? [...r] : [];
	for (let t of i) for (let n of t._zod.onattach) n(e);
	if (i.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (t, n, r) => {
			if (t.memo) return t;
			let i = D(t), a;
			for (let o of n) {
				if (o._zod.def.when) {
					if (ze(t) || !o._zod.def.when(t)) continue;
				} else if (i) continue;
				let n = t.issues.length, s = o._zod.check(t);
				if (s instanceof Promise && r?.async === !1) throw new st();
				if (a || s instanceof Promise) a = (a ?? Promise.resolve()).then(async () => {
					await s, t.issues.length !== n && (He(t.issues, n, e), i ||= D(t, n));
				});
				else {
					if (t.issues.length === n) continue;
					He(t.issues, n, e), i ||= D(t, n);
				}
			}
			return a ? a.then(() => t) : t;
		}, n = (n, r, a) => {
			if (D(n)) return n.aborted = !0, n;
			let o = t(r, i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new st();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (r, a) => {
			if (a.skipChecks) return e._zod.parse(r, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: r.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, r, a)) : n(t, r, a);
			}
			let o = e._zod.parse(r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new st();
				return o.then((e) => t(e, i, a));
			}
			return t(o, i, a);
		};
	}
}, {
	get "~standard"() {
		return Ye(this, "~standard", Nn(this));
	},
	set "~standard"(e) {
		Je(this, "~standard", e);
	}
}), Mn = (e, t) => e.issues.length ? { issues: e.issues.map((e) => O(e, t, lt())) } : { value: e.value };
async function H(e, t) {
	let n = { async: !0 };
	return Mn(await e._zod.run({
		value: t,
		issues: []
	}, n), n);
}
function Nn(e) {
	return {
		validate: (t) => {
			let n = { async: !1 };
			try {
				let r = e._zod.run({
					value: t,
					issues: []
				}, n);
				if (!(r instanceof Promise)) return Mn(r, n);
			} catch {}
			return H(e, t);
		},
		vendor: "zod",
		version: 1
	};
}
var Pn = /*@__PURE__*/ N("$ZodString", (e, t) => {
	V.init(e, t), e._zod.pattern = t.pattern ?? cn, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = String(n.value);
		} catch {}
		return typeof n.value == "string" || n.issues.push({
			expected: "string",
			code: "invalid_type",
			input: n.value,
			inst: e
		}), n;
	};
}), U = /*@__PURE__*/ N("$ZodStringFormat", (e, t) => {
	Sn.init(e, t), Pn.init(e, t);
}), Fn = /*@__PURE__*/ N("$ZodGUID", (e, t) => {
	t.pattern ??= Ut, U.init(e, t);
}), In = /*@__PURE__*/ N("$ZodUUID", (e, t) => {
	if (t.version) {
		let e = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[t.version];
		if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
		t.pattern ??= Wt(e);
	} else t.pattern ??= Wt();
	U.init(e, t);
}), Ln = /*@__PURE__*/ N("$ZodEmail", (e, t) => {
	t.pattern ??= Gt, U.init(e, t);
});
function Rn(e) {
	try {
		return typeof URL < "u" && typeof URL.canParse == "function" ? URL.canParse(e) : (new URL(e), !0);
	} catch {
		return !1;
	}
}
function zn(e, t) {
	return !("normalize" in t) && !("hostname" in t) && !("protocol" in t) ? Rn(e) || 2 : Bn(e, t);
}
function Bn(e, t) {
	if (!t.normalize && t.protocol?.source === $t.source && !/^https?:\/\//i.test(e)) return 1;
	try {
		if (typeof URL < "u") {
			let t = URL;
			if (typeof t.parse == "function") return t.parse(e) ?? 2;
		}
		return new URL(e);
	} catch {
		return 2;
	}
}
var Vn = /[\t\n\r]/g;
function Hn(e) {
	return e.replace(Vn, "");
}
function Un(e, t) {
	return t.lastIndex = 0, t.test(e.hostname);
}
function Wn(e, t) {
	return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
}
var Gn = /*@__PURE__*/ N("$ZodURL", (e, t) => {
	U.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim(), i = zn(r, t);
			if (i === 1) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			if (i === 2) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			if (i === !0) {
				n.value = Hn(r);
				return;
			}
			t.hostname && !Un(i, t.hostname) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), t.protocol && !Wn(i, t.protocol) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), n.value = t.normalize ? i.href : Hn(r);
			return;
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), Kn = /*@__PURE__*/ N("$ZodEmoji", (e, t) => {
	t.pattern ??= qt(), U.init(e, t);
}), qn = /*@__PURE__*/ N("$ZodNanoID", (e, t) => {
	if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw Error(`Invalid nanoid length: ${t.length}`);
	t.pattern ??= t.length === void 0 ? Vt : R(t.length), U.init(e, t);
}), Jn = /*@__PURE__*/ N("$ZodCUID", (e, t) => {
	t.pattern ??= It, U.init(e, t);
}), Yn = /*@__PURE__*/ N("$ZodCUID2", (e, t) => {
	t.pattern ??= Lt, U.init(e, t);
}), Xn = /*@__PURE__*/ N("$ZodULID", (e, t) => {
	t.pattern ??= Rt, U.init(e, t);
}), Zn = /*@__PURE__*/ N("$ZodXID", (e, t) => {
	t.pattern ??= zt, U.init(e, t);
}), Qn = /*@__PURE__*/ N("$ZodKSUID", (e, t) => {
	t.pattern ??= Bt, U.init(e, t);
}), $n = /*@__PURE__*/ N("$ZodISODateTime", (e, t) => {
	t.pattern ??= sn(t), U.init(e, t);
}), er = /*@__PURE__*/ N("$ZodISODate", (e, t) => {
	t.pattern ??= rn, U.init(e, t);
}), tr = /*@__PURE__*/ N("$ZodISOTime", (e, t) => {
	t.pattern ??= on(t), U.init(e, t);
}), nr = /*@__PURE__*/ N("$ZodISODuration", (e, t) => {
	t.pattern ??= Ht, U.init(e, t);
}), rr = /*@__PURE__*/ N("$ZodIPv4", (e, t) => {
	t.pattern ??= Jt, U.init(e, t);
}), ir = /^[0-9a-fA-F:.]+$/;
function ar(e) {
	return ir.test(e) ? Rn(`http://[${e}]`) : !1;
}
var or = /*@__PURE__*/ N("$ZodIPv6", (e, t) => {
	t.pattern ??= Yt, U.init(e, t), e._zod.check = (n) => {
		ar(n.value) || n.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), sr = /*@__PURE__*/ N("$ZodCIDRv4", (e, t) => {
	t.pattern ??= Xt, U.init(e, t);
});
function cr(e) {
	let t = e.split("/");
	if (t.length !== 2) return !1;
	let [n, r] = t;
	if (!r) return !1;
	let i = Number(r);
	return `${i}` !== r || i < 0 || i > 128 ? !1 : ar(n);
}
var lr = /*@__PURE__*/ N("$ZodCIDRv6", (e, t) => {
	t.pattern ??= z, U.init(e, t), e._zod.check = (n) => {
		cr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function ur(e) {
	if (e === "") return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var dr = /^[0-9a-zA-Z+/]*={0,2}$/, fr = /*@__PURE__*/ N("$ZodBase64", (e, t) => {
	t.pattern ??= dr, U.init(e, t), e._zod.check = (n) => {
		ur(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), W = /^[A-Za-z0-9_-]*$/;
function pr(e) {
	if (!W.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return ur(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var mr = /*@__PURE__*/ N("$ZodBase64URL", (e, t) => {
	t.pattern ??= W, U.init(e, t), e._zod.check = (n) => {
		pr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), hr = /*@__PURE__*/ N("$ZodE164", (e, t) => {
	t.pattern ??= en, U.init(e, t);
});
function gr(e, t = null) {
	try {
		let n = e.split(".");
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
var _r = /*@__PURE__*/ N("$ZodJWT", (e, t) => {
	U.init(e, t), e._zod.check = (n) => {
		gr(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), vr = /*@__PURE__*/ N("$ZodNumber", (e, t) => {
	V.init(e, t), e._zod.pattern = ln, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : String(i) : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), yr = /*@__PURE__*/ N("$ZodNumberFormat", (e, t) => {
	vn.init(e, t), vr.init(e, t);
}), br = /*@__PURE__*/ N("$ZodBoolean", (e, t) => {
	V.init(e, t), e._zod.pattern = un, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = !!n.value;
		} catch {}
		let i = n.value;
		return typeof i == "boolean" || n.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
	};
}), xr = /*@__PURE__*/ N("$ZodUnknown", (e, t) => {
	V.init(e, t), e._zod.parse = (e) => e;
}), Sr = /*@__PURE__*/ N("$ZodNever", (e, t) => {
	V.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function Cr(e, t, n) {
	e.issues.length && t.issues.push(...Be(n, e.issues)), t.value[n] = e.value;
}
var wr = /*@__PURE__*/ N("$ZodArray", (e, t) => {
	V.init(e, t);
	let n = P.memoizer;
	n?.attach(e), e._zod.parse = (r, i) => {
		let a = r.value;
		if (!Array.isArray(a)) return r.issues.push({
			expected: "array",
			code: "invalid_type",
			input: a,
			inst: e
		}), r;
		r.value = n ? n.alloc(e, r, Array(a.length), i) : Array(a.length);
		let o = [], s = i?.abortEarly;
		for (let e = 0; e < a.length; e++) {
			let n = a[e], c = t.element._zod.run({
				value: n,
				issues: []
			}, i);
			if (c instanceof Promise) o.push(c.then((t) => Cr(t, r, e)));
			else if (Cr(c, r, e), s && c.issues.length !== 0 && D(c)) break;
		}
		return o.length ? Promise.all(o).then(() => r) : r;
	};
});
function Tr(e, t, n, r, i, a) {
	let o = n in r, s = a === "optional";
	if (o || !s || i !== "optional") {
		if (e.issues.length) {
			if (i !== void 0 && s && !o) return;
			t.issues.push(...Be(n, e.issues));
		}
		if (!o && i === void 0) {
			e.issues.length || t.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: void 0,
				path: [n]
			});
			return;
		}
		e.value === void 0 ? (o || i === "defaulted" && !s) && (t.value[n] = void 0) : t.value[n] = e.value;
	}
}
var Er = [];
function Dr(e) {
	let t = Object.keys(e.shape), n = Object.getOwnPropertySymbols(e.shape), r = n.length ? n : Er, i = r.length ? [...t, ...r] : t;
	for (let t of i) if (!e.shape?.[t]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);
	let a = De(e.shape);
	return {
		...e,
		allKeys: i,
		symbolKeys: r,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(a)
	};
}
function Or(e, t, n, r, i, a, o) {
	let s = [], c = i.keySet, l = i.catchall._zod, u = l.def.type, d = l.optin, f = l.optout, p = 0;
	for (let i in t) {
		if (o && n.issues.length !== p) {
			if (D(n, p)) break;
			p = n.issues.length;
		}
		if (c.has(i)) continue;
		if (i === "__proto__") {
			u === "never" && s.push(i);
			continue;
		}
		if (u === "never") {
			s.push(i);
			continue;
		}
		let a = l.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => Tr(e, n, i, t, d, f))) : Tr(a, n, i, t, d, f);
	}
	return s.length && n.issues.push({
		code: "unrecognized_keys",
		keys: s,
		input: t,
		inst: a,
		continue: !0
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var kr = /*@__PURE__*/ N("$ZodObject", (e, t) => {
	V.init(e, t);
	let n = Object.getOwnPropertyDescriptor(t, "shape"), r = n?.get ? n.get.raw : t.shape ?? {};
	if (r) {
		let e = () => {
			let n = { ...r };
			return Object.defineProperty(t, "shape", { value: n }), e.raw = n, n;
		};
		e.raw = r, Object.defineProperty(t, "shape", { get: e });
	}
	let i = ce(() => Dr(t));
	A(e, "propValues", (e) => {
		let t = e.def.shape, n = {};
		for (let e in t) {
			let r = t[e]._zod;
			if (r.values) {
				Object.prototype.hasOwnProperty.call(n, e) || S(n, e, /* @__PURE__ */ new Set());
				for (let t of r.values) n[e].add(t);
				r.optin !== void 0 && n[e].add(void 0);
			}
		}
		return n;
	});
	let a = w, o = t.catchall, s, c = P.memoizer;
	c?.attach(e), e._zod.parse = (t, n) => {
		s ??= i.value;
		let r = t.value;
		if (!a(r)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: r,
			inst: e
		}), t;
		t.value = c ? c.alloc(e, t, {}, n) : {};
		let l = [], u = s.shape, d = n?.abortEarly, f = t.issues.length;
		for (let e of s.allKeys) {
			if (d && t.issues.length !== f) {
				if (D(t, f)) break;
				f = t.issues.length;
			}
			if (e === "__proto__") continue;
			let i = u[e], a = i._zod.optin, o = i._zod.optout, s = i._zod.run({
				value: r[e],
				issues: []
			}, n);
			s instanceof Promise ? l.push(s.then((n) => Tr(n, t, e, r, a, o))) : Tr(s, t, e, r, a, o);
		}
		return o ? Or(l, r, t, n, i.value, e, d === !0) : l.length ? Promise.all(l).then(() => t) : t;
	};
}), Ar = /*@__PURE__*/ N("$ZodObjectJIT", (e, t) => {
	kr.init(e, t);
	let n = e._zod.parse, r = ce(() => Dr(t)), i = P.memoizer, a = (t) => {
		let n = r.value, a = n.symbolKeys, o = new An(["payload", "ctx"], {
			shape: t,
			inst: e,
			memo: i,
			syms: a
		}), s = (e) => `shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`, c = (e, t) => `
          let ${e}_ab = false;
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${e}_ab = true;
          }
          if (${e}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
		o.write("const input = payload.value;");
		let l = Object.create(null), u = 0;
		for (let e of n.allKeys) l[e] = `key_${u++}`;
		o.write(i ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
		for (let e of n.allKeys) {
			if (e === "__proto__") continue;
			let n = l[e], r = typeof e == "symbol" ? `syms[${a.indexOf(e)}]` : ve(e), i = `${r} in input`, u = t[e], d = u?._zod?.optin, f = d !== void 0, p = u?._zod?.optout === "optional";
			if (o.write(`const ${n} = ${s(r)};`), f && p) {
				let e = d === "optional" ? `${n}_present` : `${n}.value !== undefined || ${n}_present`;
				o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${c(n, r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `);
			} else f ? (o.write(`
        if (${n}.issues.length) {${c(n, r)}
        }
      `), d === "defaulted" ? o.write(`newResult[${r}] = ${n}.value;`) : o.write(`
        if (${n}.value !== undefined || ${i}) {
          newResult[${r}] = ${n}.value;
        }
      `)) : o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${c(n, r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `);
		}
		return o.write("payload.value = newResult;"), o.write("return payload;"), o.compile();
	}, o, s = w, c = !P.jitless, l = c && xe.value, u = t.catchall, d;
	e._zod.parse = (i, f) => {
		d ??= r.value;
		let p = i.value;
		return s(p) ? c && l && f?.async === !1 && f.jitless !== !0 ? (o ||= a(t.shape), i = o(i, f), u ? Or([], p, i, f, d, e, f?.abortEarly === !0) : i) : n(i, f) : (i.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), i);
	};
});
function jr(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !D(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => O(e, r, lt())))
	}), t);
}
var Mr = /*@__PURE__*/ N("$ZodUnion", (e, t) => {
	V.init(e, t), A(e, "optin", (e) => e.def.options.some((e) => e._zod.optin === "defaulted") ? "defaulted" : e.def.options.some((e) => e._zod.optin !== void 0) ? "optional" : void 0), A(e, "optout", (e) => e.def.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), A(e, "values", (e) => {
		if (e.def.options.every((e) => e._zod.values)) return new Set(e.def.options.flatMap((e) => Array.from(e._zod.values)));
	}), A(e, "pattern", (e) => {
		if (e.def.options.every((e) => e._zod.pattern)) {
			let t = e.def.options.map((e) => e._zod.pattern);
			return RegExp(`^(${t.map((e) => ue(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1 ? t.options[0]._zod.run : null;
	e._zod.parse = (r, i) => {
		if (n) return n(r, i);
		let a = !1, o = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: r.value,
				issues: []
			}, i);
			if (t instanceof Promise) o.push(t), a = !0;
			else {
				if (t.issues.length === 0) return t;
				o.push(t);
			}
		}
		return a ? Promise.all(o).then((t) => jr(t, r, e, i)) : jr(o, r, e, i);
	};
});
function Nr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.options) {
		let r = n._zod.propValues?.[e.discriminator];
		if (!r || r.size === 0) throw Error(`Invalid discriminated union option at index "${e.options.indexOf(n)}"`);
		for (let e of r) if (t.has(e)) {
			if (e !== void 0) throw Error(`Duplicate discriminator value "${String(e)}"`);
			t.set(e, null);
		} else t.set(e, n);
	}
	return t;
}
var Pr = /*@__PURE__*/ N("$ZodDiscriminatedUnion", (e, t) => {
	t.inclusive = !1, Mr.init(e, t);
	let n = e._zod.parse;
	A(e, "propValues", (e) => {
		let t = {}, n = 0;
		for (let r of e.def.options) {
			let i = r._zod.propValues;
			if (!i || Object.keys(i).length === 0) throw Error(`Invalid discriminated union option at index "${e.def.options.indexOf(r)}"`);
			i[e.def.discriminator]?.has(void 0) && n++;
			for (let [e, n] of Object.entries(i)) {
				Object.prototype.hasOwnProperty.call(t, e) || S(t, e, /* @__PURE__ */ new Set());
				for (let r of n) t[e].add(r);
			}
		}
		return !e.def.unionFallback && n > 1 && t[e.def.discriminator]?.delete(void 0), t;
	}), t.options.forEach((e, n) => {
		let r = fe(e._zod.def);
		if (r && !Object.prototype.hasOwnProperty.call(r, t.discriminator)) throw Error(`Invalid discriminated union option at index "${n}"`);
	});
	let r = ce(() => Nr(t));
	e._zod.parse = (i, a) => {
		let o = i.value;
		if (!w(o)) return i.issues.push({
			code: "invalid_type",
			expected: "object",
			input: o,
			inst: e
		}), i;
		let s = o?.[t.discriminator], c = r.value.get(s);
		return c && (s !== void 0 || a.direction !== "backward") ? c._zod.run(i, a) : t.unionFallback || a.direction === "backward" ? n(i, a) : (i.issues.push({
			code: "invalid_union",
			errors: [],
			note: "No matching discriminator",
			discriminator: t.discriminator,
			options: Array.from(r.value.keys()).filter((e) => r.value.get(e) !== null),
			input: o,
			path: [t.discriminator],
			inst: e
		}), i);
	};
}), Fr = /*@__PURE__*/ N("$ZodIntersection", (e, t) => {
	V.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => Lr(e, t, n)) : Lr(e, i, a);
	};
});
function Ir(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (T(e) && T(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		Object.prototype.hasOwnProperty.call(i, "__proto__") && delete i.__proto__;
		for (let n of r) {
			if (n === "__proto__") continue;
			let r = Ir(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = Ir(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function Lr(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i, a = /* @__PURE__ */ new Map(), o = (e, t) => {
		let n;
		if (e.code === "unrecognized_keys" && !e.path?.length) i ??= e, n = e.keys;
		else if (e.code === "invalid_key" && e.origin === "record" && e.path?.length === 1) {
			let t = String(e.path[0]);
			a.has(t) || a.set(t, e), n = [t];
		} else return !1;
		for (let e of n) r.has(e) || r.set(e, {}), r.get(e)[t] = !0;
		return !0;
	};
	for (let n of t.issues) o(n, "l") || e.issues.push(n);
	for (let t of n.issues) o(t, "r") || e.issues.push(t);
	let s = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (s.length) {
		let t = i ? s.filter((e) => i.keys.includes(e)) : [];
		t.length && e.issues.push({
			...i,
			keys: t
		});
		for (let n of s) !t.includes(n) && a.has(n) && e.issues.push(a.get(n));
	}
	let c = Ir(t.value, n.value);
	if (!c.valid) {
		if (D(e)) return e;
		throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`);
	}
	return e.value = c.data, e;
}
var Rr = /*@__PURE__*/ N("$ZodTuple", (e, t) => {
	V.init(e, t);
	let n = t.items, r = P.memoizer;
	r?.attach(e), e._zod.parse = (i, a) => {
		let o = i.value;
		if (!Array.isArray(o)) return i.issues.push({
			input: o,
			inst: e,
			expected: "tuple",
			code: "invalid_type"
		}), i;
		i.value = r ? r.alloc(e, i, [], a) : [];
		let s = [], c = zr(n, "optin"), l = zr(n, "optout");
		if (!t.rest) {
			if (o.length < c) return i.issues.push({
				code: "too_small",
				minimum: c,
				inclusive: !0,
				input: o,
				inst: e,
				origin: "array"
			}), i;
			o.length > n.length && i.issues.push({
				code: "too_big",
				maximum: n.length,
				inclusive: !0,
				input: o,
				inst: e,
				origin: "array"
			});
		}
		let u = Array(n.length), d = t.rest ? a?.abortEarly : void 0, f = !1;
		for (let e = 0; e < n.length; e++) {
			let t = n[e]._zod.run({
				value: o[e],
				issues: []
			}, a);
			t instanceof Promise ? s.push(t.then((t) => {
				u[e] = t;
			})) : (u[e] = t, d && !f && t.issues.length && (f = D(t)));
		}
		if (t.rest && !f) {
			let e = n.length - 1, r = o.slice(n.length), c = i.issues.length;
			for (let n of r) {
				if (d && i.issues.length !== c) {
					if (D(i, c)) break;
					c = i.issues.length;
				}
				e++;
				let r = t.rest._zod.run({
					value: n,
					issues: []
				}, a);
				r instanceof Promise ? s.push(r.then((t) => Br(t, i, e))) : Br(r, i, e);
			}
		}
		return s.length ? Promise.all(s).then(() => Vr(u, i, n, o, l)) : Vr(u, i, n, o, l);
	};
});
function zr(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (!(t === "optin" ? e[n]._zod.optin !== void 0 : e[n]._zod.optout === "optional")) return n + 1;
	return 0;
}
function Br(e, t, n) {
	e.issues.length && t.issues.push(...Be(n, e.issues)), t.value[n] = e.value;
}
function Vr(e, t, n, r, i) {
	for (let a = 0; a < n.length; a++) {
		let o = e[a], s = a < r.length;
		if (!s && a >= i && n[a]._zod.optin === "optional") {
			t.value.length = a;
			break;
		}
		if (o.issues.length) {
			if (!s && a >= i) {
				t.value.length = a;
				break;
			}
			t.issues.push(...Be(a, o.issues));
		}
		t.value[a] = o.value;
	}
	for (let e = t.value.length - 1; e >= r.length && n[e]._zod.optout === "optional" && t.value[e] === void 0; e--) t.value.length = e;
	return t;
}
var Hr = /*@__PURE__*/ N("$ZodEnum", (e, t) => {
	V.init(e, t);
	let n = ie(t.entries), r = new Set(n);
	e._zod.values = r, A(e, "pattern", (e) => {
		let t = ie(e.def.entries).filter((e) => Ce.has(typeof e));
		return RegExp(t.length ? `^(${t.map((e) => we(e.toString())).join("|")})$` : "^[^\\s\\S]$");
	}), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), Ur = /*@__PURE__*/ N("$ZodLiteral", (e, t) => {
	V.init(e, t);
	let n = new Set(t.values);
	e._zod.values = n, A(e, "pattern", (e) => {
		let t = e.def.values;
		return RegExp(t.length ? `^(${t.map((e) => typeof e == "string" ? we(e) : e ? we(e.toString()) : String(e)).join("|")})$` : "^[^\\s\\S]$");
	}), e._zod.parse = (r, i) => {
		let a = r.value;
		return n.has(a) || r.issues.push({
			code: "invalid_value",
			values: t.values,
			input: a,
			inst: e
		}), r;
	};
}), Wr = /*@__PURE__*/ N("$ZodTransform", (e, t) => {
	V.init(e, t), e._zod.optin = "optional", P.memoizer?.guard(e), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new ct(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
		if (i instanceof Promise) throw new st();
		return n.value = i, n;
	};
});
function Gr(e, t) {
	return e.value = t.issues.length ? void 0 : t.value, e;
}
var Kr = /*@__PURE__*/ N("$ZodOptional", (e, t) => {
	V.init(e, t), A(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), e._zod.optout = "optional", A(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? /* @__PURE__ */ new Set([...t, void 0]) : void 0;
	}), A(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${ue(t.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (e.value === void 0) {
			if (t.innerType._zod.optin !== "defaulted") return e;
			let r = t.innerType._zod.run({
				value: e.value,
				issues: []
			}, n);
			return r instanceof Promise ? r.then((t) => Gr(e, t)) : Gr(e, r);
		}
		return t.innerType._zod.run(e, n);
	};
}), qr = /*@__PURE__*/ N("$ZodExactOptional", (e, t) => {
	Kr.init(e, t), A(e, "values", (e) => e.def.innerType._zod.values), A(e, "pattern", (e) => e.def.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), Jr = /*@__PURE__*/ N("$ZodNullable", (e, t) => {
	V.init(e, t), A(e, "optin", (e) => e.def.innerType._zod.optin), A(e, "optout", (e) => e.def.innerType._zod.optout), A(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${ue(t.source)}|null)$`) : void 0;
	}), A(e, "values", (e) => e.def.innerType._zod.values ? /* @__PURE__ */ new Set([...e.def.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), Yr = /*@__PURE__*/ N("$ZodDefault", (e, t) => {
	V.init(e, t), e._zod.optin = "defaulted", A(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => Xr(e, t)) : Xr(r, t);
	};
});
function Xr(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var Zr = /*@__PURE__*/ N("$ZodPrefault", (e, t) => {
	V.init(e, t), e._zod.optin = "defaulted", A(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), Qr = /*@__PURE__*/ N("$ZodNonOptional", (e, t) => {
	V.init(e, t), A(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? new Set([...t].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => $r(t, e)) : $r(i, e);
	};
});
function $r(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
function ei(e, t, n, r) {
	return t.issues.length ? (e.value = n.catchValue({
		...t,
		value: e.value,
		error: { issues: t.issues.map((e) => O(e, r, lt())) },
		input: e.value
	}), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
var ti = /*@__PURE__*/ N("$ZodCatch", (e, t) => {
	V.init(e, t), A(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), A(e, "optout", (e) => e.def.innerType._zod.optout), A(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run({
			value: e.value,
			issues: []
		}, n);
		return r instanceof Promise ? r.then((r) => ei(e, r, t, n)) : ei(e, r, t, n);
	};
}), ni = /*@__PURE__*/ N("$ZodPipe", (e, t) => {
	V.init(e, t), A(e, "values", (e) => e.def.in._zod.values), A(e, "optin", (e) => e.def.in._zod.optin), A(e, "optout", (e) => e.def.out._zod.optout), A(e, "propValues", (e) => e.def.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => ri(e, t.in, n)) : ri(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => ri(e, t.out, n)) : ri(r, t.out, n);
	};
});
function ri(e, t, n) {
	return e.issues.some((e) => e.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
var ii = /*@__PURE__*/ N("$ZodReadonly", (e, t) => {
	V.init(e, t), A(e, "propValues", (e) => e.def.innerType._zod.propValues), A(e, "values", (e) => e.def.innerType._zod.values), A(e, "optin", (e) => e.def.innerType?._zod?.optin), A(e, "optout", (e) => e.def.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(ai) : ai(r);
	};
});
function ai(e) {
	return e.memo || (e.value = Object.freeze(e.value)), e;
}
var oi = /*@__PURE__*/ N("$ZodCustom", (e, t) => {
	B.init(e, t), V.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => si(t, n, r, e));
		si(i, n, r, e);
	};
});
function si(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(Ke(e));
	}
}
//#endregion
//#region node_modules/zod/v4/core/memoizer.js
var ci = class extends Error {
	constructor() {
		super("Cannot parse a reference cycle that closes through a transform"), this.name = "ZodCyclicError";
	}
}, li = "~memo", ui = [];
function di(e) {
	return typeof e == "object" && !!e;
}
function fi(e) {
	return e.map((e) => e.path ? {
		...e,
		path: e.path.slice()
	} : { ...e });
}
var pi = /*@__PURE__*/ new WeakMap(), mi = 0, hi = 1, gi = 2;
function _i(e, t, n) {
	let r = pi.get(e);
	if (r !== void 0) return r ? gi : mi;
	if (t.has(e)) return gi;
	t.add(e);
	let i = mi, a = (e) => {
		if (i !== gi && e?._zod) {
			let r = _i(e, t, n);
			r > i && (i = r);
		}
	}, o = (e, r) => {
		let i = mi;
		for (let a of Reflect.ownKeys(e)) {
			let o = Object.getOwnPropertyDescriptor(e, a);
			if (r && !o.enumerable) continue;
			let s = o.get ? hi : o.value?._zod ? _i(o.value, t, n) : mi;
			s > i && (i = s);
		}
		return i;
	}, s = (e) => {
		e > i && (i = e);
	}, c = e._zod.def;
	switch (c.type) {
		case "object": {
			let e = fe(c);
			s(e ? o(e, !0) : hi), a(c.catchall);
			break;
		}
		case "array":
			a(c.element);
			break;
		case "tuple":
			for (let e of c.items) a(e);
			a(c.rest);
			break;
		case "record":
		case "map":
			a(c.keyType), a(c.valueType);
			break;
		case "set":
			a(c.valueType);
			break;
		case "union":
			for (let e of c.options) a(e);
			break;
		case "intersection":
			a(c.left), a(c.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			a(c.innerType);
			break;
		case "pipe":
			a(c.in), a(c.out);
			break;
		case "function":
			a(c.input), a(c.output);
			break;
		case "lazy": {
			let r = c._cachedInner ?? (n ? e._zod.innerType : void 0);
			s(r ? _i(r, t, !1) : hi);
			break;
		}
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (let e in c) {
			let t = Object.getOwnPropertyDescriptor(c, e);
			if (!t || t.get) continue;
			let n = t.value;
			if (n && typeof n == "object") {
				if (n._zod) a(n);
				else if (Array.isArray(n)) for (let e of n) a(e);
			}
		}
	}
	return t.delete(e), vi(e, i);
}
function vi(e, t) {
	return t !== hi && pi.set(e, t === gi), t;
}
function yi(e, t) {
	let n = e.buckets.get(t);
	return n || (n = /* @__PURE__ */ new WeakMap(), e.buckets.set(t, n)), n;
}
var bi, xi = [], Si = {
	alloc(e, t, n) {
		let r = bi;
		if (!r) return n;
		bi = void 0;
		let i = {
			value: n,
			issues: null
		};
		return r.set(t.value, i), xi.push(i), n;
	},
	guard(e) {
		var t;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, n = (e, n) => {
				if (n.direction !== "backward" && wi(n, e.value)) throw new ci();
				return t(e, n);
			};
			e._zod.parse = n, e._zod.run === t && (e._zod.run = n);
		});
	},
	attach(e) {
		var t;
		let n, r = !1, i, a;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, o = (s, c) => {
				if (n === void 0) {
					let i = _i(e, /* @__PURE__ */ new Set(), !1);
					if (i === mi) return e._zod.parse = t, e._zod.run === o && (e._zod.run = t), t(s, c);
					i === gi || r ? n = !0 : r = !0;
				}
				let l = s.value;
				if (!di(l)) return t(s, c);
				let u = c[li];
				u || (u = {
					buckets: /* @__PURE__ */ new WeakMap(),
					backEdges: void 0
				}, c[li] = u);
				let d;
				i === c ? d = a : (d = yi(u, e), i = c, a = d);
				let f = d.get(l);
				if (f) return s.value = f.value, f.issues ? f.issues.length && s.issues.push(...fi(f.issues)) : (s.memo = !0, u.backEdges ?? (u.backEdges = /* @__PURE__ */ new WeakSet()), u.backEdges.add(f.value)), s;
				bi = d;
				let p = xi.length, m = t(s, c);
				bi = void 0;
				let h = xi.length > p ? xi.pop() : void 0;
				return m instanceof Promise ? m.then((e) => (h && (h.issues = e.issues.length ? fi(e.issues) : ui), e)) : (h && (h.issues = m.issues.length ? fi(m.issues) : ui), m);
			};
			e._zod.parse = o, e._zod.run === t && (e._zod.run = o);
		});
	}
};
function Ci() {
	return Si;
}
function wi(e, t) {
	let n = e[li]?.backEdges;
	return n !== void 0 && di(t) && n.has(t);
}
//#endregion
//#region node_modules/zod/v4/locales/en.js
var Ti = () => {
	let e = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function t(t) {
		return e[t] ?? null;
	}
	let n = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		currency_code: "currency code",
		credit_card: "credit card number",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	}, r = { nan: "NaN" };
	function i(e, t) {
		return e === "number" && typeof t == "number" && !Number.isFinite(t) ? String(t) : r[e] ?? e;
	}
	return (e) => {
		switch (e.code) {
			case "invalid_type": return `Invalid input: expected ${i(e.expected)}, received ${i(k(e.input), e.input)}`;
			case "invalid_value": return e.values.length === 1 ? `Invalid input: expected ${Ee(e.values[0])}` : `Invalid option: expected one of ${ae(e.values, "|")}`;
			case "too_big": {
				let n = e.exact ? "exactly " : e.inclusive ? "<=" : "<", r = t(e.origin);
				return r ? `Too big: expected ${e.origin ?? "value"} to have ${n}${e.maximum.toString()} ${r.unit ?? "elements"}` : `Too big: expected ${e.origin ?? "value"} to be ${n}${e.maximum.toString()}`;
			}
			case "too_small": {
				let n = e.exact ? "exactly " : e.inclusive ? ">=" : ">", r = t(e.origin);
				return r ? `Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}` : `Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`;
			}
			case "invalid_format": {
				let t = e;
				return t.format === "starts_with" ? `Invalid string: must start with "${t.prefix}"` : t.format === "ends_with" ? `Invalid string: must end with "${t.suffix}"` : t.format === "includes" ? `Invalid string: must include "${t.includes}"` : t.format === "regex" ? `Invalid string: must match pattern ${t.pattern}` : `Invalid ${n[t.format] ?? e.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${e.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${e.keys.length > 1 ? "s" : ""}: ${ae(e.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${e.origin}`;
			case "invalid_union": return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Invalid discriminator value. Expected ${e.options.map((e) => `'${e}'`).join(" | ")}` : e.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
			case "invalid_element": return `Invalid value in ${e.origin}`;
			default: return "Invalid input";
		}
	};
};
function Ei() {
	return { localeError: Ti() };
}
//#endregion
//#region node_modules/zod/v4/core/registries.js
var Di, Oi = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
	}
	add(e, ...t) {
		let n = t[0];
		return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
	}
	clear() {
		return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
	}
	remove(e) {
		let t = this._map.get(e);
		return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
	}
	get(e) {
		let t = e._zod.parent;
		if (t) {
			let n = { ...this.get(t) ?? {} };
			delete n.id;
			let r = {
				...n,
				...this._map.get(e)
			};
			return Object.keys(r).length ? r : void 0;
		}
		return this._map.get(e);
	}
	has(e) {
		return this._map.has(e);
	}
};
function ki() {
	return new Oi();
}
(Di = globalThis).__zod_globalRegistry ?? (Di.__zod_globalRegistry = ki());
var Ai = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/zod/v4/core/api.js
function ji(e) {
	return e.checks &&= [...e.checks], e;
}
// @__NO_SIDE_EFFECTS__
function Mi(e, t) {
	return new e(ji({
		type: "string",
		...E(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function Ni(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Pi(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Fi(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ii(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Li(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ri(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function zi(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Bi(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Vi(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Hi(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ui(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Wi(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Gi(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ki(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function qi(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ji(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Yi(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Xi(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Zi(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Qi(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function $i(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ea(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ta(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function na(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ra(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ia(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function aa(e, t) {
	return new e(ji({
		type: "number",
		checks: [],
		...E(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function oa(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function sa(e, t) {
	return new e({
		type: "boolean",
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ca(e) {
	return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function la(e, t) {
	return new e({
		type: "never",
		...E(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ua(e, t) {
	return new hn({
		check: "less_than",
		...E(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function da(e, t) {
	return new hn({
		check: "less_than",
		...E(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function fa(e, t) {
	return new gn({
		check: "greater_than",
		...E(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function pa(e, t) {
	return new gn({
		check: "greater_than",
		...E(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function ma(e, t) {
	return new _n({
		check: "multiple_of",
		...E(t),
		value: e
	});
}
// @__NO_SIDE_EFFECTS__
function ha(e, t) {
	return new yn({
		check: "max_length",
		...E(t),
		maximum: e
	});
}
// @__NO_SIDE_EFFECTS__
function ga(e, t) {
	return new bn({
		check: "min_length",
		...E(t),
		minimum: e
	});
}
// @__NO_SIDE_EFFECTS__
function _a(e, t) {
	return new xn({
		check: "length_equals",
		...E(t),
		length: e
	});
}
// @__NO_SIDE_EFFECTS__
function va(e, t) {
	return new Cn({
		check: "string_format",
		format: "regex",
		...E(t),
		pattern: e
	});
}
// @__NO_SIDE_EFFECTS__
function ya(e) {
	return new wn({
		check: "string_format",
		format: "lowercase",
		...E(e)
	});
}
// @__NO_SIDE_EFFECTS__
function ba(e) {
	return new Tn({
		check: "string_format",
		format: "uppercase",
		...E(e)
	});
}
// @__NO_SIDE_EFFECTS__
function xa(e, t) {
	return new En({
		check: "string_format",
		format: "includes",
		...E(t),
		includes: e
	});
}
// @__NO_SIDE_EFFECTS__
function Sa(e, t) {
	return new Dn({
		check: "string_format",
		format: "starts_with",
		...E(t),
		prefix: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ca(e, t) {
	return new On({
		check: "string_format",
		format: "ends_with",
		...E(t),
		suffix: e
	});
}
// @__NO_SIDE_EFFECTS__
function wa(e) {
	return new kn({
		check: "overwrite",
		tx: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ta(e) {
	return /* @__PURE__ */ wa((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Ea() {
	return /* @__PURE__ */ wa((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Da() {
	return /* @__PURE__ */ wa((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function Oa() {
	return /* @__PURE__ */ wa((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function ka() {
	return /* @__PURE__ */ wa((e) => ye(e));
}
// @__NO_SIDE_EFFECTS__
function Aa(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...E(n)
	});
}
// @__NO_SIDE_EFFECTS__
function ja(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...E(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Ma(e, t) {
	let n = /* @__PURE__ */ Na((t) => (t.addIssue = (e) => {
		if (typeof e == "string") t.issues.push(Ke(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", "input" in r || (r.input = t.value), r.inst ??= n, r.continue ??= !n._zod.def.abort, t.issues.push(Ke(r));
		}
	}, e(t.value, t)), t);
	return n;
}
// @__NO_SIDE_EFFECTS__
function Na(e, t) {
	let n = new B({
		check: "custom",
		...E(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/zod/v4/core/to-json-schema.js
function Pa(e, ...t) {
	for (let n of t) for (let t of Reflect.ownKeys(n)) Object.prototype.propertyIsEnumerable.call(n, t) && S(e, t, n[t]);
	return e;
}
function Fa(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? Ai,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: e?.external ?? void 0
	};
}
function Ia(e, t, n, r, i) {
	let a = typeof t.unrepresentable == "function" ? t.unrepresentable({
		zodSchema: e,
		path: r.path,
		message: i
	}) : t.unrepresentable;
	if (a === "any") return !1;
	if (a === void 0 || a === "throw") throw Error(i);
	return Object.assign(n, a), !0;
}
function G(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def, a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o), t.sharedDefsExtractedFor = void 0, t.sharedEmitDoneFor = void 0;
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema, a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref ||= a, G(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Pa(o.schema, c), t.io === "input" && K(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && "_prefault" in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function La(e) {
	return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Ra(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	if (e.external && e.sharedDefsExtractedFor === e.external) return;
	let r = /* @__PURE__ */ new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === "draft-2020-12" ? "$defs" : "definitions";
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id, i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i("__shared")}#/${r}/${La(a)}`
			};
		}
		let i = `#/${r}/`;
		if (t[1] === n && !t[1].schema.id) return { ref: "#" };
		let a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + La(a)
		};
	}, a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1], { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === "throw") for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) {
			a(n);
			continue;
		}
		if (e.external) {
			let r = e.external.registry.get(n[0])?.id;
			if (t !== n[0] && r) {
				a(n);
				continue;
			}
		}
		if (e.metadataRegistry.get(n[0])?.id) {
			a(n);
			continue;
		}
		if (r.cycle) {
			a(n);
			continue;
		}
		r.count > 1 && e.reused === "ref" && a(n);
	}
	e.external && (e.sharedDefsExtractedFor = e.external);
}
function za(e) {
	let t = e.anyOf;
	if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
	let n = [];
	for (let e of t) {
		if (!e || typeof e != "object") return;
		za(e);
		let t = Object.keys(e);
		if (t.length !== 1 || t[0] !== "type") return;
		let r = e.type;
		for (let e of Array.isArray(r) ? r : [r]) {
			if (typeof e != "string") return;
			n.includes(e) || n.push(e);
		}
	}
	delete e.anyOf, e.type = n.length === 1 ? n[0] : n;
}
var Ba = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]), Va = ["oneOf", "anyOf"];
function Ha(e) {
	let t = e.additionalProperties;
	return t === void 0 || t === !1 || typeof t != "object" || !t ? null : Object.keys(t).length ? t : null;
}
function Ua(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "object" || n.type !== "object") return null;
		for (let e in n) if (!Ba.has(e)) return null;
		t.push(n);
	}
	let n = {}, r = /* @__PURE__ */ new Set();
	for (let e of t) {
		for (let r in e.properties) {
			if (Object.prototype.hasOwnProperty.call(n, r)) continue;
			let e = [];
			for (let n of t) {
				let t = n.properties?.[r] ?? Ha(n);
				t != null && (e.some((e) => JSON.stringify(e) === JSON.stringify(t)) || e.push(t));
			}
			S(n, r, e.length === 1 ? e[0] : Ua(e) ?? { allOf: e });
		}
		for (let t of e.required ?? []) r.add(t);
	}
	let i = {
		type: "object",
		properties: n
	};
	if (r.size && (i.required = [...r]), t.every((e) => e.additionalProperties === !1)) i.additionalProperties = !1;
	else {
		let e = [];
		for (let n of t) {
			let t = Ha(n);
			t && !e.some((e) => JSON.stringify(e) === JSON.stringify(t)) && e.push(t);
		}
		e.length === 1 ? i.additionalProperties = e[0] : e.length > 1 && (i.additionalProperties = { allOf: e });
	}
	return i;
}
function Wa(e) {
	let t = e.allOf;
	if (!Array.isArray(t) || t.length < 2) return;
	for (let t of Ba) if (t in e) return;
	let n = t.filter((e) => Va.some((t) => Array.isArray(e[t]))), r = null;
	if (!n.length) r = Ua(t);
	else {
		let e = n[0], i = Va.find((t) => Array.isArray(e[t]));
		if (Object.keys(e).length !== 1) return;
		let a = t.filter((t) => t !== e), o = e[i].map((e) => Ua([...a, e]));
		if (o.some((e) => !e)) return;
		r = { [i]: o };
	}
	r && (delete e.allOf, Pa(e, r));
}
function Ga(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Pa(i, s), Pa(i, a), t._zod.parent === o) for (let e in i) e !== "$ref" && e !== "allOf" && (e in a || delete i[e]);
			if (s.$ref && n.def) for (let e in i) e !== "$ref" && e !== "allOf" && e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e !== "$ref" && e !== "allOf" && e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	if (!e.external || e.sharedEmitDoneFor !== e.external) {
		for (let t of [...e.seen.entries()].reverse()) r(t[0]);
		if (e.target !== "openapi-3.0") for (let t of e.seen.entries()) za(t[1].def ?? t[1].schema);
		for (let t of e.deferred) t();
		if (e.intersections.length) {
			let t = /* @__PURE__ */ new Map();
			for (let n of e.seen.values()) for (let e of [n.schema, n.def]) {
				let n = e?.allOf;
				if (!Array.isArray(n)) continue;
				let r = t.get(n);
				r ? r.push(e) : t.set(n, [e]);
			}
			for (let n of e.intersections) for (let e of t.get(n) ?? []) Wa(e);
		}
	}
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	Pa(i, n.defId ? n.schema : n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	if (!e.external || e.sharedEmitDoneFor !== e.external) for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, S(o, e.defId, e.def));
	}
	e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(o).length > 0 && (e.target === "draft-2020-12" ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: qa(t, "input", e.processors),
					output: qa(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function K(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return K(r.element, n);
	if (r.type === "set") return K(r.valueType, n);
	if (r.type === "lazy") return K(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault" || r.type === "catch") return K(r.innerType, n);
	if (r.type === "intersection") return K(r.left, n) || K(r.right, n);
	if (r.type === "record" || r.type === "map") return K(r.keyType, n) || K(r.valueType, n);
	if (r.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : K(r.in, n) || K(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (K(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (K(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (K(e, n)) return !0;
		return !!(r.rest && K(r.rest, n));
	}
	return !1;
}
var Ka = (e, t = {}) => (n) => {
	let r = Fa({
		...n,
		processors: t
	});
	return G(e, r), Ra(r, e), Ga(r, e);
}, qa = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = Fa({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return G(e, o), Ra(o, e), Ga(o, e);
}, Ja = (e, t, n) => {
	(e[t] === void 0 || n > e[t]) && (e[t] = n);
}, Ya = (e, t, n) => {
	(e[t] === void 0 || n < e[t]) && (e[t] = n);
}, Xa = (e, t) => {
	Ja(e, "minimum", t), Ya(e, "maximum", t);
}, Za = (e, t) => {
	e.multipleOf ??= [], e.multipleOf.includes(t) || e.multipleOf.push(t);
}, Qa = (e, t) => {
	e.patterns ??= /* @__PURE__ */ new Set(), e.patterns.add(t);
}, $a = (e, t) => {
	e.mime = e.mime ? e.mime.filter((e) => t.includes(e)) : [...t];
}, eo = (e, t) => {
	e.format = t, t.includes("int") && (e.isInt = !0);
}, to = (e, t) => Ja(e, "minimum", t.minimum), no = (e, t) => Ya(e, "maximum", t.maximum), ro = (e) => (t, n) => {
	eo(t, n.format);
	let [r, i] = e[n.format];
	Ja(t, "minimum", r), Ya(t, "maximum", i);
}, io = {
	greater_than: (e, t) => Ja(e, t.inclusive ? "minimum" : "exclusiveMinimum", t.value),
	less_than: (e, t) => Ya(e, t.inclusive ? "maximum" : "exclusiveMaximum", t.value),
	multiple_of: (e, t) => Za(e, t.value),
	number_format: ro(Oe),
	bigint_format: ro(ke),
	min_length: to,
	max_length: no,
	length_equals: (e, t) => Xa(e, t.length),
	min_size: to,
	max_size: no,
	size_equals: (e, t) => Xa(e, t.size),
	string_format: (e, t) => {
		eo(e, t.format), t.pattern && Qa(e, t.pattern), (t.format === "base64" || t.format === "base64url") && (e.contentEncoding = t.format), (t.local || t.precision === -1) && (e.laxFormat = !0);
	},
	mime_type: (e, t) => $a(e, t.mime)
};
function ao(e) {
	let t = {}, n = e._zod.def, r = e._zod.traits.has("$ZodCheck") ? [e, ...n.checks ?? []] : n.checks ?? [];
	for (let e of r) io[e._zod.def.check]?.(t, e._zod.def);
	let i = e._zod.bag;
	i.minimum !== void 0 && Ja(t, "minimum", i.minimum), i.exclusiveMinimum !== void 0 && Ja(t, "exclusiveMinimum", i.exclusiveMinimum), i.maximum !== void 0 && Ya(t, "maximum", i.maximum), i.exclusiveMaximum !== void 0 && Ya(t, "exclusiveMaximum", i.exclusiveMaximum), i.multipleOf !== void 0 && Za(t, i.multipleOf), i.format !== void 0 && (t.format ??= i.format, i.format.includes("int") && (t.isInt = !0)), i.mime && $a(t, i.mime);
	for (let e of i.patterns ?? []) Qa(t, e);
	return t;
}
var oo = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, so = /* @__PURE__ */ new Map([[dr, Zt], [W, Qt]]), co = (e) => so.get(e) ?? e, lo = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l, laxFormat: u } = ao(e);
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = oo[s] ?? s, i.format === "" && delete i.format, (s === "time" || u) && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c].map(co);
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, uo = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, multipleOf: s, exclusiveMaximum: c, exclusiveMinimum: l, isInt: u } = ao(e);
	i.type = u ? "integer" : "number";
	let d = typeof l == "number" && l >= (a ?? -Infinity), f = typeof c == "number" && c <= (o ?? Infinity), p = t.target === "draft-04" || t.target === "openapi-3.0";
	if (d ? p ? (i.minimum = l, i.exclusiveMinimum = !0) : i.exclusiveMinimum = l : typeof a == "number" && (i.minimum = a), f ? p ? (i.maximum = c, i.exclusiveMaximum = !0) : i.exclusiveMaximum = c : typeof o == "number" && (i.maximum = o), s) {
		let n = /* @__PURE__ */ new Set();
		for (let a of s) Number.isFinite(a) && a !== 0 ? n.add(Math.abs(a)) : Ia(e, t, i, r, `A multipleOf divisor of ${a} cannot be represented in JSON Schema`);
		let [a, ...o] = n;
		a !== void 0 && (i.multipleOf = a), o.length && (i.allOf = [...i.allOf ?? [], ...o.map((e) => ({ multipleOf: e }))]);
	}
}, fo = (e, t, n, r) => {
	n.type = "boolean";
}, po = (e, t, n, r) => {
	n.not = {};
}, mo = (e, t, n, r) => {
	let i = e._zod.def, a = ie(i.entries);
	if (a.length === 0) {
		n.not = {};
		return;
	}
	a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a;
}, ho = (e, t, n, r) => {
	let i = e._zod.def;
	if (i.values.length === 0) {
		n.not = {};
		return;
	}
	let a = [];
	for (let o of i.values) if (o === void 0) {
		if (Ia(e, t, n, r, "Literal `undefined` cannot be represented in JSON Schema")) return;
	} else if (typeof o == "bigint") {
		if (Ia(e, t, n, r, "BigInt literals cannot be represented in JSON Schema")) return;
		a.push(Number(o));
	} else a.push(o);
	if (a.length !== 0) {
		if (a.length === 1) {
			let e = a[0];
			n.type = e === null ? "null" : typeof e, t.target === "draft-04" || t.target === "openapi-3.0" ? n.enum = [e] : n.const = e;
		} else a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), a.every((e) => typeof e == "boolean") && (n.type = "boolean"), a.every((e) => e === null) && (n.type = "null"), n.enum = a;
	}
}, go = (e, t, n, r) => {
	Ia(e, t, n, r, "Custom types cannot be represented in JSON Schema");
}, _o = (e, t, n, r) => {
	Ia(e, t, n, r, "Transforms cannot be represented in JSON Schema");
}, vo = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = ao(e);
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = G(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
};
function yo(e) {
	let t = e._zod.def;
	return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? yo(t.out) : t.type === "catch" ? yo(t.innerType) : e._zod.optin;
}
var bo = (e, t, n, r) => {
	let i = n, a = e._zod.def, o = a.shape;
	if (Object.getOwnPropertySymbols(o).length && Ia(e, t, i, r, "Symbol keys cannot be represented in JSON Schema")) return;
	i.type = "object", i.properties = {};
	for (let e in o) S(i.properties, e, G(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	}));
	let s = [];
	for (let e of Object.keys(o)) {
		let n = a.shape[e];
		(t.io === "input" ? yo(n) === void 0 : n._zod.optout === void 0) && s.push(e);
	}
	s.length > 0 && (i.required = s), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = G(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, xo = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => G(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, So = (e, t, n, r) => {
	let i = e._zod.def, a = G(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = G(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1, c = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
	n.allOf = c, t.intersections.push(c);
}, Co = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "array";
	let o = t.target === "draft-2020-12" ? "prefixItems" : "items", s = t.target === "draft-2020-12" || t.target === "openapi-3.0" ? "items" : "additionalItems", c = a.items.map((e, n) => G(e, t, {
		...r,
		path: [
			...r.path,
			o,
			n
		]
	})), l = a.rest ? G(a.rest, t, {
		...r,
		path: [
			...r.path,
			s,
			...t.target === "openapi-3.0" ? [a.items.length] : []
		]
	}) : null, u = a.items.length;
	for (; u > 0;) {
		let e = a.items[u - 1];
		if (!(t.io === "input" ? yo(e) !== void 0 : e._zod.optout === "optional")) break;
		u--;
	}
	let d = a.items.length, f = !a.rest;
	t.target === "draft-2020-12" ? (i.prefixItems = c, f ? i.items = !1 : l && (i.items = l), u > 0 && (i.minItems = u), f && (i.maxItems = d)) : t.target === "openapi-3.0" ? (i.items = { anyOf: c }, l && i.items.anyOf.push(l), u > 0 && (i.minItems = u), f && (i.maxItems = d)) : (i.items = c, f ? i.additionalItems = !1 : l && (i.additionalItems = l), u > 0 && (i.minItems = u), f && (i.maxItems = d));
	let { minimum: p, maximum: m } = ao(e);
	typeof p == "number" && (i.minItems = p), typeof m == "number" && (i.maxItems = m);
}, wo = (e, t, n, r) => {
	let i = e._zod.def, a = G(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, To = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Eo = Symbol();
function Do(e, t, n, r, i) {
	let a = !1, o = JSON.stringify(e, (e, t) => typeof t == "bigint" ? (a = !0, null) : t);
	return a ? (Ia(t, n, r, i, "BigInt defaults cannot be represented in JSON Schema"), Eo) : JSON.parse(o);
}
var Oo = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o = Do(i.defaultValue, e, t, n, r);
	o !== Eo && (n.default = o);
}, ko = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	if (a.ref = i.innerType, t.io !== "input") return;
	let o = Do(i.defaultValue, e, t, n, r);
	o !== Eo && (n._prefault = o);
}, Ao = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		Ia(e, t, n, r, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	n.default = o;
}, jo = (e, t, n, r) => {
	let i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), o = t.io === "input" ? a ? i.out : i.in : i.out;
	G(o, t, r);
	let s = t.seen.get(e);
	s.ref = o;
}, Mo = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, No = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Po = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function Fo(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = n(this);
			return Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	});
}
var Io = /*@__PURE__*/ N("ZodError", (e, t) => {
	ht.init(e, t), e.name = "ZodError";
	let n = Object.getPrototypeOf(e);
	Po.has(n) || (Po.add(n), Fo(n, "format", (e) => (t) => vt(e, t)), Fo(n, "flatten", (e) => (t) => _t(e, t)), Fo(n, "addIssue", (e) => (t) => {
		e.issues.push(t), e.message = JSON.stringify(e.issues, oe, 2);
	}), Fo(n, "addIssues", (e) => (t) => {
		e.issues.push(...t), e.message = JSON.stringify(e.issues, oe, 2);
	}), Object.defineProperty(n, "isEmpty", {
		configurable: !0,
		enumerable: !1,
		get() {
			return this.issues.length === 0;
		}
	}));
}, void 0, { Parent: Error }), Lo = /* @__PURE__ */ bt(Io), Ro = /* @__PURE__ */ xt(Io), zo = /* @__PURE__ */ St(Io), Bo = /* @__PURE__ */ wt(Io), Vo = /* @__PURE__ */ kt(Io), Ho = /* @__PURE__ */ At(Io), Uo = /* @__PURE__ */ jt(Io), Wo = /* @__PURE__ */ L(Io), Go = /* @__PURE__ */ Mt(Io), Ko = /* @__PURE__ */ Nt(Io), qo = /* @__PURE__ */ Pt(Io), Jo = /* @__PURE__ */ Ft(Io);
//#endregion
//#region node_modules/zod/v4/classic/schemas.js
function Yo() {
	P.localeError || lt(Ei());
}
function Xo() {
	P.memoizer || lt({ memoizer: Ci() });
}
var q = /*@__PURE__*/ N("ZodType", (e, t) => (Yo(), V.init(e, t), e.def = t, e.type = t.type, e), {
	check(...e) {
		let t = this.def;
		return this.clone(C(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == "function" ? { _zod: {
			check: e,
			def: { check: "custom" },
			onattach: []
		} } : e)] }), { parent: !0 });
	},
	with(...e) {
		return this.check(...e);
	},
	clone(e, t) {
		return Te(this, e, t);
	},
	brand() {
		return this;
	},
	register(e, t) {
		return e.add(this, t), this;
	},
	refine(e, t) {
		return this.check(fc(e, t));
	},
	superRefine(e, t) {
		return this.check(pc(e, t));
	},
	overwrite(e) {
		return this.check(/* @__PURE__ */ wa(e));
	},
	optional() {
		return Js(this);
	},
	exactOptional() {
		return Xs(this);
	},
	nullable() {
		return Qs(this);
	},
	nullish() {
		return Js(Qs(this));
	},
	nonoptional(e) {
		return ic(this, e);
	},
	array() {
		return Y(this);
	},
	or(e) {
		return Is([this, e]);
	},
	and(e) {
		return Bs(this, e);
	},
	transform(e) {
		return cc(this, Ks(e));
	},
	default(e) {
		return ec(this, e);
	},
	prefault(e) {
		return nc(this, e);
	},
	catch(e) {
		return oc(this, e);
	},
	pipe(e) {
		return cc(this, e);
	},
	readonly() {
		return uc(this);
	},
	describe(e) {
		let t = this.clone();
		return Ai.add(t, { description: e }), t;
	},
	meta(...e) {
		if (e.length === 0) return Ai.get(this);
		let t = this.clone();
		return Ai.add(t, e[0]), t;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(e, ...t) {
		return t.length === 0 ? e(this) : e(this, ...t);
	},
	get "~standard"() {
		return Ye(this, "~standard", {
			...Nn(this),
			jsonSchema: {
				input: qa(this, "input"),
				output: qa(this, "output")
			}
		});
	},
	set "~standard"(e) {
		Je(this, "~standard", e);
	},
	parse: function e(t, n) {
		return Lo(this, t, n, { callee: e });
	},
	parseAsync: async function e(t, n) {
		return await Ro(this, t, n, { callee: e });
	},
	safeParse(e, t) {
		return zo(this, e, t);
	},
	async safeParseAsync(e, t) {
		return Bo(this, e, t);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(e) {
		Je(this, "spa", e);
	},
	validate(e, t) {
		return Et(this, e, t);
	},
	validateAsync(e, t) {
		return Ot(this, e, t);
	},
	encode: function e(t, n) {
		return Vo(this, t, n, { callee: e });
	},
	decode: function e(t, n) {
		return Ho(this, t, n, { callee: e });
	},
	encodeAsync: async function e(t, n) {
		return await Uo(this, t, n, { callee: e });
	},
	decodeAsync: async function e(t, n) {
		return await Wo(this, t, n, { callee: e });
	},
	safeEncode(e, t) {
		return Go(this, e, t);
	},
	safeDecode(e, t) {
		return Ko(this, e, t);
	},
	async safeEncodeAsync(e, t) {
		return qo(this, e, t);
	},
	async safeDecodeAsync(e, t) {
		return Jo(this, e, t);
	},
	toJSONSchema(e) {
		return Ka(this, {})(e);
	},
	get description() {
		return Ai.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
}), Zo = /*@__PURE__*/ N("_ZodString", (e, t) => {
	Pn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => lo(e, t, n, r);
}, /*@__PURE__*/ Xe({
	format: (e) => ao(e).format ?? null,
	minLength: (e) => ao(e).minimum ?? null,
	maxLength: (e) => ao(e).maximum ?? null
}, {
	regex(...e) {
		return this.check(/* @__PURE__ */ va(...e));
	},
	includes(...e) {
		return this.check(/* @__PURE__ */ xa(...e));
	},
	startsWith(...e) {
		return this.check(/* @__PURE__ */ Sa(...e));
	},
	endsWith(...e) {
		return this.check(/* @__PURE__ */ Ca(...e));
	},
	min(...e) {
		return this.check(/* @__PURE__ */ ga(...e));
	},
	max(...e) {
		return this.check(/* @__PURE__ */ ha(...e));
	},
	length(...e) {
		return this.check(/* @__PURE__ */ _a(...e));
	},
	nonempty(...e) {
		return this.check(/* @__PURE__ */ ga(1, ...e));
	},
	lowercase(e) {
		return this.check(/* @__PURE__ */ ya(e));
	},
	uppercase(e) {
		return this.check(/* @__PURE__ */ ba(e));
	},
	trim() {
		return this.check(/* @__PURE__ */ Ea());
	},
	normalize(...e) {
		return this.check(/* @__PURE__ */ Ta(...e));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ Da());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ Oa());
	},
	slugify() {
		return this.check(/* @__PURE__ */ ka());
	}
})), Qo = /*@__PURE__*/ N("ZodString", (e, t) => {
	Pn.init(e, t), Zo.init(e, t);
}, {
	email(e) {
		return this.check(/* @__PURE__ */ Ni(is, e));
	},
	url(e) {
		return this.check(/* @__PURE__ */ zi(ss, e));
	},
	jwt(e) {
		return this.check(/* @__PURE__ */ ea(Ss, e));
	},
	emoji(e) {
		return this.check(/* @__PURE__ */ Bi(cs, e));
	},
	guid(e) {
		return this.check(/* @__PURE__ */ Pi(as, e));
	},
	uuid(e) {
		return this.check(/* @__PURE__ */ Fi(os, e));
	},
	uuidv4(e) {
		return this.check(/* @__PURE__ */ Ii(os, e));
	},
	uuidv6(e) {
		return this.check(/* @__PURE__ */ Li(os, e));
	},
	uuidv7(e) {
		return this.check(/* @__PURE__ */ Ri(os, e));
	},
	nanoid(e) {
		return this.check(/* @__PURE__ */ Vi(ls, e));
	},
	cuid(e) {
		return this.check(/* @__PURE__ */ Hi(us, e));
	},
	cuid2(e) {
		return this.check(/* @__PURE__ */ Ui(ds, e));
	},
	ulid(e) {
		return this.check(/* @__PURE__ */ Wi(fs, e));
	},
	base64(e) {
		return this.check(/* @__PURE__ */ Zi(ys, e));
	},
	base64url(e) {
		return this.check(/* @__PURE__ */ Qi(bs, e));
	},
	xid(e) {
		return this.check(/* @__PURE__ */ Gi(ps, e));
	},
	ksuid(e) {
		return this.check(/* @__PURE__ */ Ki(ms, e));
	},
	ipv4(e) {
		return this.check(/* @__PURE__ */ qi(hs, e));
	},
	ipv6(e) {
		return this.check(/* @__PURE__ */ Ji(gs, e));
	},
	cidrv4(e) {
		return this.check(/* @__PURE__ */ Yi(_s, e));
	},
	cidrv6(e) {
		return this.check(/* @__PURE__ */ Xi(vs, e));
	},
	e164(e) {
		return this.check(/* @__PURE__ */ $i(xs, e));
	},
	datetime(e) {
		return this.check(/* @__PURE__ */ ta(es, e));
	},
	date(e) {
		return this.check(/* @__PURE__ */ na(ts, e));
	},
	time(e) {
		return this.check(/* @__PURE__ */ ra(ns, e));
	},
	duration(e) {
		return this.check(/* @__PURE__ */ ia(rs, e));
	}
});
function $o(e) {
	return /* @__PURE__ */ Mi(Qo, e);
}
var J = /*@__PURE__*/ N("ZodStringFormat", (e, t) => {
	U.init(e, t), Zo.init(e, t);
}), es = /*@__PURE__*/ N("ZodISODateTime", (e, t) => {
	$n.init(e, t), J.init(e, t);
}), ts = /*@__PURE__*/ N("ZodISODate", (e, t) => {
	er.init(e, t), J.init(e, t);
}), ns = /*@__PURE__*/ N("ZodISOTime", (e, t) => {
	tr.init(e, t), J.init(e, t);
}), rs = /*@__PURE__*/ N("ZodISODuration", (e, t) => {
	nr.init(e, t), J.init(e, t);
}), is = /*@__PURE__*/ N("ZodEmail", (e, t) => {
	Ln.init(e, t), J.init(e, t);
}), as = /*@__PURE__*/ N("ZodGUID", (e, t) => {
	Fn.init(e, t), J.init(e, t);
}), os = /*@__PURE__*/ N("ZodUUID", (e, t) => {
	In.init(e, t), J.init(e, t);
}), ss = /*@__PURE__*/ N("ZodURL", (e, t) => {
	Gn.init(e, t), J.init(e, t);
}), cs = /*@__PURE__*/ N("ZodEmoji", (e, t) => {
	Kn.init(e, t), J.init(e, t);
}), ls = /*@__PURE__*/ N("ZodNanoID", (e, t) => {
	qn.init(e, t), J.init(e, t);
}), us = /*@__PURE__*/ N("ZodCUID", (e, t) => {
	Jn.init(e, t), J.init(e, t);
}), ds = /*@__PURE__*/ N("ZodCUID2", (e, t) => {
	Yn.init(e, t), J.init(e, t);
}), fs = /*@__PURE__*/ N("ZodULID", (e, t) => {
	Xn.init(e, t), J.init(e, t);
}), ps = /*@__PURE__*/ N("ZodXID", (e, t) => {
	Zn.init(e, t), J.init(e, t);
}), ms = /*@__PURE__*/ N("ZodKSUID", (e, t) => {
	Qn.init(e, t), J.init(e, t);
}), hs = /*@__PURE__*/ N("ZodIPv4", (e, t) => {
	rr.init(e, t), J.init(e, t);
}), gs = /*@__PURE__*/ N("ZodIPv6", (e, t) => {
	or.init(e, t), J.init(e, t);
}), _s = /*@__PURE__*/ N("ZodCIDRv4", (e, t) => {
	sr.init(e, t), J.init(e, t);
}), vs = /*@__PURE__*/ N("ZodCIDRv6", (e, t) => {
	lr.init(e, t), J.init(e, t);
}), ys = /*@__PURE__*/ N("ZodBase64", (e, t) => {
	fr.init(e, t), J.init(e, t);
}), bs = /*@__PURE__*/ N("ZodBase64URL", (e, t) => {
	mr.init(e, t), J.init(e, t);
}), xs = /*@__PURE__*/ N("ZodE164", (e, t) => {
	hr.init(e, t), J.init(e, t);
}), Ss = /*@__PURE__*/ N("ZodJWT", (e, t) => {
	_r.init(e, t), J.init(e, t);
}), Cs = /*@__PURE__*/ N("ZodNumber", (e, t) => {
	vr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => uo(e, t, n, r), e.isFinite = !0;
}, /*@__PURE__*/ Xe({
	minValue: (e) => {
		let { minimum: t, exclusiveMinimum: n } = ao(e);
		return Math.max(t ?? -Infinity, n ?? -Infinity);
	},
	maxValue: (e) => {
		let { maximum: t, exclusiveMaximum: n } = ao(e);
		return Math.min(t ?? Infinity, n ?? Infinity);
	},
	isInt: (e) => {
		let { isInt: t, multipleOf: n } = ao(e);
		return !!t || !!n?.some(Number.isSafeInteger);
	},
	format: (e) => ao(e).format ?? null
}, {
	gt(e, t) {
		return this.check(/* @__PURE__ */ fa(e, t));
	},
	gte(e, t) {
		return this.check(/* @__PURE__ */ pa(e, t));
	},
	min(e, t) {
		return this.check(/* @__PURE__ */ pa(e, t));
	},
	lt(e, t) {
		return this.check(/* @__PURE__ */ ua(e, t));
	},
	lte(e, t) {
		return this.check(/* @__PURE__ */ da(e, t));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ da(e, t));
	},
	int(e) {
		return this.check(Es(e));
	},
	safe(e) {
		return this.check(Es(e));
	},
	positive(e) {
		return this.check(/* @__PURE__ */ fa(0, e));
	},
	nonnegative(e) {
		return this.check(/* @__PURE__ */ pa(0, e));
	},
	negative(e) {
		return this.check(/* @__PURE__ */ ua(0, e));
	},
	nonpositive(e) {
		return this.check(/* @__PURE__ */ da(0, e));
	},
	multipleOf(e, t) {
		return this.check(/* @__PURE__ */ ma(e, t));
	},
	step(e, t) {
		return this.check(/* @__PURE__ */ ma(e, t));
	},
	finite() {
		return this;
	}
}));
function ws(e) {
	return /* @__PURE__ */ aa(Cs, e);
}
var Ts = /*@__PURE__*/ N("ZodNumberFormat", (e, t) => {
	yr.init(e, t), Cs.init(e, t);
});
function Es(e) {
	return /* @__PURE__ */ oa(Ts, e);
}
var Ds = /*@__PURE__*/ N("ZodBoolean", (e, t) => {
	br.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => fo(e, t, n, r);
});
function Os(e) {
	return /* @__PURE__ */ sa(Ds, e);
}
var ks = /*@__PURE__*/ N("ZodUnknown", (e, t) => {
	xr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function As() {
	return /* @__PURE__ */ ca(ks);
}
var js = /*@__PURE__*/ N("ZodNever", (e, t) => {
	Sr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => po(e, t, n, r);
});
function Ms(e) {
	return /* @__PURE__ */ la(js, e);
}
var Ns = /*@__PURE__*/ N("ZodArray", (e, t) => {
	Xo(), wr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => vo(e, t, n, r), e.element = t.element;
}, {
	min(e, t) {
		return this.check(/* @__PURE__ */ ga(e, t));
	},
	nonempty(e) {
		return this.check(/* @__PURE__ */ ga(1, e));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ ha(e, t));
	},
	length(e, t) {
		return this.check(/* @__PURE__ */ _a(e, t));
	},
	unwrap() {
		return this.element;
	}
});
function Y(e, t) {
	return /* @__PURE__ */ Aa(Ns, e, t);
}
var Ps = /*@__PURE__*/ N("ZodObject", (e, t) => {
	Xo(), Ar.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => bo(e, t, n, r), j(e, "shape", (e) => e._zod.def.shape, !1);
}, {
	keyof() {
		return Z(Object.keys(this._zod.def.shape));
	},
	catchall(e) {
		return this.clone(C(this._zod.def, { catchall: e }));
	},
	passthrough() {
		return this.clone(C(this._zod.def, { catchall: As() }));
	},
	loose() {
		return this.clone(C(this._zod.def, { catchall: As() }));
	},
	strict() {
		return this.clone(C(this._zod.def, { catchall: Ms() }));
	},
	strip() {
		return this.clone(C(this._zod.def, { catchall: void 0 }));
	},
	extend(e) {
		return Ne(this, e);
	},
	safeExtend(e) {
		return Fe(this, e);
	},
	merge(e) {
		return Ie(this, e);
	},
	pick(e) {
		return Ae(this, e);
	},
	omit(e) {
		return Me(this, e);
	},
	partial(...e) {
		return Le(qs, this, e[0]);
	},
	exactPartial(...e) {
		return Le(Ys, this, e[0], "exactPartial");
	},
	required(...e) {
		return Re(rc, this, e[0]);
	}
});
function X(e, t) {
	return new Ps({
		type: "object",
		shape: e ?? {},
		...E(t)
	});
}
var Fs = /*@__PURE__*/ N("ZodUnion", (e, t) => {
	Mr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => xo(e, t, n, r), e.options = t.options;
});
function Is(e, t) {
	return new Fs({
		type: "union",
		options: e,
		...E(t)
	});
}
var Ls = /*@__PURE__*/ N("ZodDiscriminatedUnion", (e, t) => {
	Fs.init(e, t), Pr.init(e, t);
});
function Rs(e, t, n) {
	return new Ls({
		type: "union",
		options: t,
		discriminator: e,
		...E(n)
	});
}
var zs = /*@__PURE__*/ N("ZodIntersection", (e, t) => {
	Fr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => So(e, t, n, r);
});
function Bs(e, t) {
	return new zs({
		type: "intersection",
		left: e,
		right: t
	});
}
var Vs = /*@__PURE__*/ N("ZodTuple", (e, t) => {
	Xo(), Rr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Co(e, t, n, r);
}, {
	rest(e) {
		return this.clone({
			...this._zod.def,
			rest: e
		});
	},
	partial() {
		let e = this._zod.def;
		if (e.checks?.length) throw Error(".partial() cannot be used on tuple schemas containing refinements");
		return this.clone({
			...e,
			items: e.items.map((e) => new qs({
				type: "optional",
				innerType: e
			}))
		});
	}
});
function Hs(e, t, n) {
	let r = t instanceof V;
	return new Vs({
		type: "tuple",
		items: e,
		rest: r ? t : null,
		...E(r ? n : t)
	});
}
var Us = /*@__PURE__*/ N("ZodEnum", (e, t) => {
	Hr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => mo(e, t, n, r), e.enum = t.entries, e.options = [...e._zod.values];
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new Us({
			...t,
			checks: [],
			...E(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new Us({
			...t,
			checks: [],
			...E(r),
			entries: i
		});
	};
});
function Z(e, t) {
	return new Us({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...E(t)
	});
}
var Ws = /*@__PURE__*/ N("ZodLiteral", (e, t) => {
	Ur.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => ho(e, t, n, r), e.values = new Set(t.values), Object.defineProperty(e, "value", { get() {
		if (t.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return t.values[0];
	} });
});
function Q(e, t) {
	return new Ws({
		type: "literal",
		values: Array.isArray(e) ? e : [e],
		...E(t)
	});
}
var Gs = /*@__PURE__*/ N("ZodTransform", (e, t) => {
	Xo(), Wr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => _o(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new ct(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(Ke(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", "input" in t || (t.input = n.value), t.inst ??= e, n.issues.push(Ke(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
	};
});
function Ks(e) {
	return new Gs({
		type: "transform",
		transform: e
	});
}
var qs = /*@__PURE__*/ N("ZodOptional", (e, t) => {
	Kr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => No(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Js(e) {
	return new qs({
		type: "optional",
		innerType: e
	});
}
var Ys = /*@__PURE__*/ N("ZodExactOptional", (e, t) => {
	qr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => No(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Xs(e) {
	return new Ys({
		type: "optional",
		innerType: e
	});
}
var Zs = /*@__PURE__*/ N("ZodNullable", (e, t) => {
	Jr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => wo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Qs(e) {
	return new Zs({
		type: "nullable",
		innerType: e
	});
}
var $s = /*@__PURE__*/ N("ZodDefault", (e, t) => {
	Yr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Oo(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function ec(e, t) {
	return new $s({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : Se(t);
		}
	});
}
var tc = /*@__PURE__*/ N("ZodPrefault", (e, t) => {
	Zr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => ko(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function nc(e, t) {
	return new tc({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : Se(t);
		}
	});
}
var rc = /*@__PURE__*/ N("ZodNonOptional", (e, t) => {
	Qr.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => To(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function ic(e, t) {
	return new rc({
		type: "nonoptional",
		innerType: e,
		...E(t)
	});
}
var ac = /*@__PURE__*/ N("ZodCatch", (e, t) => {
	ti.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ao(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function oc(e, t) {
	return new ac({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : nt(t)
	});
}
var sc = /*@__PURE__*/ N("ZodPipe", (e, t) => {
	ni.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => jo(e, t, n, r), e.in = t.in, e.out = t.out;
});
function cc(e, t) {
	return new sc({
		type: "pipe",
		in: e,
		out: t
	});
}
var lc = /*@__PURE__*/ N("ZodReadonly", (e, t) => {
	ii.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Mo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function uc(e) {
	return new lc({
		type: "readonly",
		innerType: e
	});
}
var dc = /*@__PURE__*/ N("ZodCustom", (e, t) => {
	oi.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => go(e, t, n, r);
});
function fc(e, t = {}) {
	return /* @__PURE__ */ ja(dc, e, t);
}
function pc(e, t) {
	return /* @__PURE__ */ Ma(e, t);
}
//#endregion
//#region src/phase1/schema.ts
var mc = $o().trim().min(1), hc = (e = 0, t) => {
	let n = Y(mc).min(e);
	return t !== void 0 && (n = n.max(t)), n.superRefine((e, t) => {
		new Set(e).size !== e.length && t.addIssue({
			code: "custom",
			message: "배열에 중복 값이 있습니다."
		});
	});
}, gc = $o().refine((e) => !Number.isNaN(Date.parse(e)), { message: "유효한 ISO-8601 날짜/시간이어야 합니다." }), _c = X({
	engine_name: Q("학생부기반_공통_실전면접_질문엔진"),
	engine_version: Q("1.0"),
	created_at: gc,
	language: Q("ko-KR")
}).strict(), vc = X({
	university: mc.nullable(),
	department: mc.nullable(),
	interview_type: Q("student_record_based"),
	default_session_minutes: ws().int().min(1)
}).strict(), yc = X({
	available: Os(),
	embedded_full_text: Q(!1),
	student_name_included: Os()
}).strict(), bc = X({
	evidence_id: $o().regex(/^E\d{3,}$/),
	anchor: mc,
	year: ws().int().min(1).max(3),
	category: Z(l),
	topic: mc,
	excerpt: mc,
	normalized_summary: mc,
	tags: Y(Z(u)).superRefine((e, t) => {
		new Set(e).size !== e.length && t.addIssue({
			code: "custom",
			message: "tags에 중복 값이 있습니다."
		});
	})
}).strict(), xc = X({
	interviewer_id: $o().regex(/^I\d{2,}$/),
	presentation_gender: Z(["male", "female"]),
	personality_traits: Y(Z(d)).min(1).max(4).superRefine((e, t) => {
		new Set(e).size !== e.length && t.addIssue({
			code: "custom",
			message: "personality_traits에 중복 값이 있습니다."
		});
	}),
	values: Y(Z(f)).min(1).max(4).superRefine((e, t) => {
		new Set(e).size !== e.length && t.addIssue({
			code: "custom",
			message: "values에 중복 값이 있습니다."
		});
	}),
	response_style: Z(p),
	interest_bias: Z(m),
	pressure_tendency: ws().int().min(1).max(5),
	voice_preference: Z([
		"male",
		"female",
		"system_default"
	])
}).strict(), Sc = X({
	supported_interviewer_count: Hs([Q(1), Q(2)]),
	default_interviewer_count: Is([Q(1), Q(2)]),
	start_modes: Y(Z(h)),
	ending_modes: Y(Z(g)),
	default_max_followup_depth: ws().int().min(0),
	absolute_max_followup_depth: ws().int().min(0),
	surprise_per_session_min: ws().int().min(0),
	surprise_per_session_max: ws().int().min(0),
	allow_cross_record: Os(),
	allow_weakness_question: Os(),
	allow_rare_human_events: Os()
}).strict().superRefine((e, t) => {
	e.default_max_followup_depth > e.absolute_max_followup_depth && t.addIssue({
		code: "custom",
		path: ["default_max_followup_depth"],
		message: "기본 꼬리질문 깊이가 절대 최대 깊이를 초과합니다."
	}), e.surprise_per_session_min > e.surprise_per_session_max && t.addIssue({
		code: "custom",
		path: ["surprise_per_session_min"],
		message: "Surprise 최소값이 최대값을 초과합니다."
	});
}), Cc = Rs("type", [
	X({ type: Q("ALWAYS_ELIGIBLE") }).strict(),
	X({
		type: Q("RANDOM"),
		probability: ws().min(0).max(1)
	}).strict(),
	X({
		type: Q("KEYWORD_ANY"),
		keywords: hc(1)
	}).strict(),
	X({
		type: Q("ANSWER_TOO_SHORT"),
		threshold_ms: ws().int().positive()
	}).strict(),
	X({
		type: Q("ANSWER_TOO_LONG"),
		threshold_ms: ws().int().positive()
	}).strict(),
	X({ type: Q("NO_ANSWER") }).strict(),
	X({
		type: Q("DONT_KNOW_PATTERN"),
		phrases: hc(1)
	}).strict(),
	X({ type: Q("AFTER_PARENT") }).strict(),
	X({
		type: Q("SESSION_TIME_REMAINING"),
		operator: Z([
			"LT",
			"LTE",
			"GT",
			"GTE"
		]),
		threshold_ms: ws().int().min(0)
	}).strict()
]), wc = X({
	question_id: $o().regex(/^Q\d{3,}$/),
	relation: Z(x),
	root_question_id: $o().regex(/^Q\d{3,}$/),
	parent_question_id: $o().regex(/^Q\d{3,}$/).nullable(),
	question_type: Z(y),
	question_intent: mc,
	primary_text: mc,
	text_variants: hc(),
	evidence_ids: hc(),
	cognitive_difficulty: Z(b),
	priority: ws().int().min(1).max(5),
	coverage_tags: Y(Z(ee)).superRefine((e, t) => {
		new Set(e).size !== e.length && t.addIssue({
			code: "custom",
			message: "coverage_tags에 중복 값이 있습니다."
		});
	}),
	recommended_answer_seconds: X({
		min: ws().int().min(0),
		max: ws().int().min(0)
	}).strict().superRefine((e, t) => {
		e.min > e.max && t.addIssue({
			code: "custom",
			path: ["min"],
			message: "min은 max보다 클 수 없습니다."
		});
	}).nullable(),
	eligible_interviewer_values: Y(Z(f)).superRefine((e, t) => {
		new Set(e).size !== e.length && t.addIssue({
			code: "custom",
			message: "eligible_interviewer_values에 중복 값이 있습니다."
		});
	}),
	runtime_trigger: Cc,
	followup_ids: hc()
}).strict(), Tc = X({
	warnings: Y($o()),
	insufficient_record_areas: Y($o()),
	questions_without_record_evidence: Y($o()),
	duplicate_intent_check_passed: Os(),
	graph_validation_passed: Os(),
	enum_validation_passed: Os(),
	reference_validation_passed: Os(),
	runtime_trigger_validation_passed: Os()
}).strict(), Ec = X({
	schema: Q("INTERVIEW_PACK/1.0"),
	pack_id: $o().regex(/^PACK_.+/),
	generator: _c,
	target: vc,
	source_record: yc,
	record_evidence: Y(bc),
	interviewer_pool: Y(xc).min(2),
	session_policy: Sc,
	question_bank: Y(wc).min(1),
	integrity: Tc
}).strict(), Dc = {
	rootQuestionTypes: new Set(_),
	followupQuestionTypes: new Set(v)
}, Oc = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	((n, r) => {
		typeof e == "object" && t !== void 0 ? t.exports = r() : typeof define == "function" && define.amd ? define(r) : (n = typeof globalThis < "u" ? globalThis : n || self).Dexie = r();
	})(e, function() {
		var e = function(t, n) {
			return (e = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? function(e, t) {
				e.__proto__ = t;
			} : function(e, t) {
				for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
			}))(t, n);
		}, t = function() {
			return (t = Object.assign || function(e) {
				for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
				return e;
			}).apply(this, arguments);
		};
		function n(e, t, n) {
			if (n || arguments.length === 2) for (var r, i = 0, a = t.length; i < a; i++) !r && i in t || ((r ||= Array.prototype.slice.call(t, 0, i))[i] = t[i]);
			return e.concat(r || Array.prototype.slice.call(t));
		}
		var r = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, i = Object.keys, a = Array.isArray;
		function o(e, t) {
			return typeof t == "object" && i(t).forEach(function(n) {
				e[n] = t[n];
			}), e;
		}
		typeof Promise > "u" || r.Promise || (r.Promise = Promise);
		var s = Object.getPrototypeOf, c = {}.hasOwnProperty;
		function l(e, t) {
			return c.call(e, t);
		}
		function u(e, t) {
			typeof t == "function" && (t = t(s(e))), (typeof Reflect > "u" ? i : Reflect.ownKeys)(t).forEach(function(n) {
				f(e, n, t[n]);
			});
		}
		var d = Object.defineProperty;
		function f(e, t, n, r) {
			d(e, t, o(n && l(n, "get") && typeof n.get == "function" ? {
				get: n.get,
				set: n.set,
				configurable: !0
			} : {
				value: n,
				configurable: !0,
				writable: !0
			}, r));
		}
		function p(e) {
			return { from: function(t) {
				return e.prototype = Object.create(t.prototype), f(e.prototype, "constructor", e), { extend: u.bind(null, e.prototype) };
			} };
		}
		var m = Object.getOwnPropertyDescriptor, h = [].slice;
		function g(e, t, n) {
			return h.call(e, t, n);
		}
		function _(e, t) {
			return t(e);
		}
		function v(e) {
			if (!e) throw Error("Assertion Failed");
		}
		function y(e) {
			r.setImmediate ? setImmediate(e) : setTimeout(e, 0);
		}
		function b(e, t) {
			if (typeof t == "string" && l(e, t)) return e[t];
			if (!t) return e;
			if (typeof t != "string") {
				for (var n = [], r = 0, i = t.length; r < i; ++r) {
					var a = b(e, t[r]);
					n.push(a);
				}
				return n;
			}
			var o, s = t.indexOf(".");
			return s === -1 || (o = e[t.substr(0, s)]) == null ? void 0 : b(o, t.substr(s + 1));
		}
		function x(e, t, n) {
			if (e && t !== void 0 && !("isFrozen" in Object && Object.isFrozen(e))) {
				if (typeof t != "string" && "length" in t) {
					v(typeof n != "string" && "length" in n);
					for (var r = 0, i = t.length; r < i; ++r) x(e, t[r], n[r]);
				} else {
					var o = t.indexOf(".");
					if (o !== -1) {
						var s = t.substr(0, o), o = t.substr(o + 1);
						if (o === "") n === void 0 ? a(e) && !isNaN(parseInt(s)) ? e.splice(s, 1) : delete e[s] : e[s] = n;
						else {
							var c = e[s];
							if (!c || !l(e, s)) {
								if (n === void 0) return;
								c = e[s] = {};
							}
							x(c, o, n);
						}
					} else n === void 0 ? a(e) && !isNaN(parseInt(t)) ? e.splice(t, 1) : delete e[t] : e[t] = n;
				}
			}
		}
		function ee(e) {
			var t, n = {};
			for (t in e) l(e, t) && (n[t] = e[t]);
			return n;
		}
		var te = [].concat;
		function ne(e) {
			return te.apply([], e);
		}
		var re = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(ne([
			8,
			16,
			32,
			64
		].map(function(e) {
			return [
				"Int",
				"Uint",
				"Float"
			].map(function(t) {
				return t + e + "Array";
			});
		}))).filter(function(e) {
			return r[e];
		}), ie = new Set(re.map(function(e) {
			return r[e];
		})), ae = null;
		function oe(e) {
			return ae = /* @__PURE__ */ new WeakMap(), e = function e(t) {
				if (!t || typeof t != "object") return t;
				var n = ae.get(t);
				if (n) return n;
				if (a(t)) {
					n = [], ae.set(t, n);
					for (var r = 0, i = t.length; r < i; ++r) n.push(e(t[r]));
				} else if (ie.has(t.constructor)) n = t;
				else {
					var o, c = s(t);
					for (o in n = c === Object.prototype ? {} : Object.create(c), ae.set(t, n), t) l(t, o) && (n[o] = e(t[o]));
				}
				return n;
			}(e), ae = null, e;
		}
		var se = {}.toString;
		function ce(e) {
			return se.call(e).slice(8, -1);
		}
		var le = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", ue = typeof le == "symbol" ? function(e) {
			var t;
			return e != null && (t = e[le]) && t.apply(e);
		} : function() {
			return null;
		};
		function de(e, t) {
			t = e.indexOf(t), 0 <= t && e.splice(t, 1);
		}
		var S = {};
		function fe(e) {
			var t, n, r, i;
			if (arguments.length === 1) {
				if (a(e)) return e.slice();
				if (this === S && typeof e == "string") return [e];
				if (i = ue(e)) for (n = []; !(r = i.next()).done;) n.push(r.value);
				else {
					if (e == null || typeof (t = e.length) != "number") return [e];
					for (n = Array(t); t--;) n[t] = e[t];
				}
			} else for (t = arguments.length, n = Array(t); t--;) n[t] = arguments[t];
			return n;
		}
		var pe = typeof Symbol < "u" ? function(e) {
			return e[Symbol.toStringTag] === "AsyncFunction";
		} : function() {
			return !1;
		}, re = [
			"Unknown",
			"Constraint",
			"Data",
			"TransactionInactive",
			"ReadOnly",
			"Version",
			"NotFound",
			"InvalidState",
			"InvalidAccess",
			"Abort",
			"Timeout",
			"QuotaExceeded",
			"Syntax",
			"DataClone"
		], me = [
			"Modify",
			"Bulk",
			"OpenFailed",
			"VersionChange",
			"Schema",
			"Upgrade",
			"InvalidTable",
			"MissingAPI",
			"NoSuchDatabase",
			"InvalidArgument",
			"SubTransaction",
			"Unsupported",
			"Internal",
			"DatabaseClosed",
			"PrematureCommit",
			"ForeignAwait"
		].concat(re), he = {
			VersionChanged: "Database version changed by other database connection",
			DatabaseClosed: "Database has been closed",
			Abort: "Transaction aborted",
			TransactionInactive: "Transaction has already completed or failed",
			MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
		};
		function ge(e, t) {
			this.name = e, this.message = t;
		}
		function _e(e, t) {
			return e + ". Errors: " + Object.keys(t).map(function(e) {
				return t[e].toString();
			}).filter(function(e, t, n) {
				return n.indexOf(e) === t;
			}).join("\n");
		}
		function C(e, t, n, r) {
			this.failures = t, this.failedKeys = r, this.successCount = n, this.message = _e(e, t);
		}
		function ve(e, t) {
			this.name = "BulkError", this.failures = Object.keys(t).map(function(e) {
				return t[e];
			}), this.failuresByPos = t, this.message = _e(e, this.failures);
		}
		p(ge).from(Error).extend({ toString: function() {
			return this.name + ": " + this.message;
		} }), p(C).from(ge), p(ve).from(ge);
		var ye = me.reduce(function(e, t) {
			return e[t] = t + "Error", e;
		}, {}), be = ge, w = me.reduce(function(e, t) {
			var n = t + "Error";
			function r(e, r) {
				this.name = n, e ? typeof e == "string" ? (this.message = `${e}${r ? "\n " + r : ""}`, this.inner = r || null) : typeof e == "object" && (this.message = `${e.name} ${e.message}`, this.inner = e) : (this.message = he[t] || n, this.inner = null);
			}
			return p(r).from(be), e[t] = r, e;
		}, {}), xe = (w.Syntax = SyntaxError, w.Type = TypeError, w.Range = RangeError, re.reduce(function(e, t) {
			return e[t + "Error"] = w[t], e;
		}, {}));
		re = me.reduce(function(e, t) {
			return [
				"Syntax",
				"Type",
				"Range"
			].indexOf(t) === -1 && (e[t + "Error"] = w[t]), e;
		}, {});
		function T() {}
		function Se(e) {
			return e;
		}
		function Ce(e, t) {
			return e == null || e === Se ? t : function(n) {
				return t(e(n));
			};
		}
		function we(e, t) {
			return function() {
				e.apply(this, arguments), t.apply(this, arguments);
			};
		}
		function Te(e, t) {
			return e === T ? t : function() {
				var n = e.apply(this, arguments), r = (n !== void 0 && (arguments[0] = n), this.onsuccess), i = this.onerror, a = (this.onsuccess = null, this.onerror = null, t.apply(this, arguments));
				return r && (this.onsuccess = this.onsuccess ? we(r, this.onsuccess) : r), i && (this.onerror = this.onerror ? we(i, this.onerror) : i), a === void 0 ? n : a;
			};
		}
		function E(e, t) {
			return e === T ? t : function() {
				e.apply(this, arguments);
				var n = this.onsuccess, r = this.onerror;
				this.onsuccess = this.onerror = null, t.apply(this, arguments), n && (this.onsuccess = this.onsuccess ? we(n, this.onsuccess) : n), r && (this.onerror = this.onerror ? we(r, this.onerror) : r);
			};
		}
		function Ee(e, t) {
			return e === T ? t : function() {
				var n = e.apply(this, arguments), r = (o(arguments[0], n), this.onsuccess), i = this.onerror, a = (this.onsuccess = null, this.onerror = null, t.apply(this, arguments));
				return r && (this.onsuccess = this.onsuccess ? we(r, this.onsuccess) : r), i && (this.onerror = this.onerror ? we(i, this.onerror) : i), n === void 0 ? a === void 0 ? void 0 : a : o(n, a);
			};
		}
		function De(e, t) {
			return e === T ? t : function() {
				return !1 !== t.apply(this, arguments) && e.apply(this, arguments);
			};
		}
		function Oe(e, t) {
			return e === T ? t : function() {
				var n = e.apply(this, arguments);
				if (n && typeof n.then == "function") {
					for (var r = this, i = arguments.length, a = Array(i); i--;) a[i] = arguments[i];
					return n.then(function() {
						return t.apply(r, a);
					});
				}
				return t.apply(this, arguments);
			};
		}
		re.ModifyError = C, re.DexieError = ge, re.BulkError = ve;
		var ke = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
		function Ae(e) {
			ke = e;
		}
		var je = {}, Me = 100, Ne = typeof Promise > "u" ? [] : (me = Promise.resolve(), typeof crypto < "u" && crypto.subtle ? [
			Ne = crypto.subtle.digest("SHA-512", new Uint8Array([0])),
			s(Ne),
			me
		] : [
			me,
			s(me),
			me
		]), me = Ne[0], Pe = Ne[1], Pe = Pe && Pe.then, Fe = me && me.constructor, Ie = !!Ne[2], Le = function(e, t) {
			Ue.push([e, t]), D &&= (queueMicrotask(Qe), !1);
		}, Re = !0, D = !0, ze = [], Be = [], Ve = Se, He = {
			id: "global",
			global: !0,
			ref: 0,
			unhandleds: [],
			onunhandled: T,
			pgp: !1,
			env: {},
			finalize: T
		}, O = He, Ue = [], We = 0, Ge = [];
		function k(e) {
			if (typeof this != "object") throw TypeError("Promises must be constructed via new");
			this._listeners = [], this._lib = !1;
			var t = this._PSD = O;
			if (typeof e != "function") {
				if (e !== je) throw TypeError("Not a function");
				this._state = arguments[1], this._value = arguments[2], !1 === this._state && Je(this, this._value);
			} else this._state = null, this._value = null, ++t.ref, function e(t, n) {
				try {
					n(function(n) {
						if (t._state === null) {
							if (n === t) throw TypeError("A promise cannot be resolved with itself.");
							var r = t._lib && $e();
							n && typeof n.then == "function" ? e(t, function(e, t) {
								n instanceof k ? n._then(e, t) : n.then(e, t);
							}) : (t._state = !0, t._value = n, Ye(t)), r && et();
						}
					}, Je.bind(null, t));
				} catch (e) {
					Je(t, e);
				}
			}(this, e);
		}
		var Ke = {
			get: function() {
				var e = O, t = at;
				function n(n, r) {
					var i = this, a = !e.global && (e !== O || t !== at), o = a && !ct(), s = new k(function(t, s) {
						Xe(i, new qe(pt(n, e, a, o), pt(r, e, a, o), t, s, e));
					});
					return this._consoleTask && (s._consoleTask = this._consoleTask), s;
				}
				return n.prototype = je, n;
			},
			set: function(e) {
				f(this, "then", e && e.prototype === je ? Ke : {
					get: function() {
						return e;
					},
					set: Ke.set
				});
			}
		};
		function qe(e, t, n, r, i) {
			this.onFulfilled = typeof e == "function" ? e : null, this.onRejected = typeof t == "function" ? t : null, this.resolve = n, this.reject = r, this.psd = i;
		}
		function Je(e, t) {
			var n, r;
			Be.push(t), e._state === null && (n = e._lib && $e(), t = Ve(t), e._state = !1, e._value = t, r = e, ze.some(function(e) {
				return e._value === r._value;
			}) || ze.push(r), Ye(e), n) && et();
		}
		function Ye(e) {
			var t = e._listeners;
			e._listeners = [];
			for (var n = 0, r = t.length; n < r; ++n) Xe(e, t[n]);
			var i = e._PSD;
			--i.ref || i.finalize(), We === 0 && (++We, Le(function() {
				--We == 0 && tt();
			}, []));
		}
		function Xe(e, t) {
			if (e._state === null) e._listeners.push(t);
			else {
				var n = e._state ? t.onFulfilled : t.onRejected;
				if (n === null) return (e._state ? t.resolve : t.reject)(e._value);
				++t.psd.ref, ++We, Le(Ze, [
					n,
					e,
					t
				]);
			}
		}
		function Ze(e, t, n) {
			try {
				var r, i = t._value;
				!t._state && Be.length && (Be = []), r = ke && t._consoleTask ? t._consoleTask.run(function() {
					return e(i);
				}) : e(i), t._state || Be.indexOf(i) !== -1 || ((e) => {
					for (var t = ze.length; t;) if (ze[--t]._value === e._value) return ze.splice(t, 1);
				})(t), n.resolve(r);
			} catch (e) {
				n.reject(e);
			} finally {
				--We == 0 && tt(), --n.psd.ref || n.psd.finalize();
			}
		}
		function Qe() {
			ft(He, function() {
				$e() && et();
			});
		}
		function $e() {
			var e = Re;
			return D = Re = !1, e;
		}
		function et() {
			var e, t, n;
			do
				for (; 0 < Ue.length;) for (e = Ue, Ue = [], n = e.length, t = 0; t < n; ++t) {
					var r = e[t];
					r[0].apply(null, r[1]);
				}
			while (0 < Ue.length);
			D = Re = !0;
		}
		function tt() {
			for (var e = ze, t = (ze = [], e.forEach(function(e) {
				e._PSD.onunhandled.call(null, e._value, e);
			}), Ge.slice(0)), n = t.length; n;) t[--n]();
		}
		function A(e) {
			return new k(je, !1, e);
		}
		function j(e, t) {
			var n = O;
			return function() {
				var r = $e(), i = O;
				try {
					return ut(n, !0), e.apply(this, arguments);
				} catch (e) {
					t && t(e);
				} finally {
					ut(i, !1), r && et();
				}
			};
		}
		u(k.prototype, {
			then: Ke,
			_then: function(e, t) {
				Xe(this, new qe(null, null, e, t, O));
			},
			catch: function(e) {
				var t, n;
				return arguments.length === 1 ? this.then(null, e) : (t = e, n = arguments[1], typeof t == "function" ? this.then(null, function(e) {
					return (e instanceof t ? n : A)(e);
				}) : this.then(null, function(e) {
					return (e && e.name === t ? n : A)(e);
				}));
			},
			finally: function(e) {
				return this.then(function(t) {
					return k.resolve(e()).then(function() {
						return t;
					});
				}, function(t) {
					return k.resolve(e()).then(function() {
						return A(t);
					});
				});
			},
			timeout: function(e, t) {
				var n = this;
				return e < 1 / 0 ? new k(function(r, i) {
					var a = setTimeout(function() {
						return i(new w.Timeout(t));
					}, e);
					n.then(r, i).finally(clearTimeout.bind(null, a));
				}) : this;
			}
		}), typeof Symbol < "u" && Symbol.toStringTag && f(k.prototype, Symbol.toStringTag, "Dexie.Promise"), He.env = dt(), u(k, {
			all: function() {
				var e = fe.apply(null, arguments).map(P);
				return new k(function(t, n) {
					e.length === 0 && t([]);
					var r = e.length;
					e.forEach(function(i, a) {
						return k.resolve(i).then(function(n) {
							e[a] = n, --r || t(e);
						}, n);
					});
				});
			},
			resolve: function(e) {
				return e instanceof k ? e : e && typeof e.then == "function" ? new k(function(t, n) {
					e.then(t, n);
				}) : new k(je, !0, e);
			},
			reject: A,
			race: function() {
				var e = fe.apply(null, arguments).map(P);
				return new k(function(t, n) {
					e.map(function(e) {
						return k.resolve(e).then(t, n);
					});
				});
			},
			PSD: {
				get: function() {
					return O;
				},
				set: function(e) {
					return O = e;
				}
			},
			totalEchoes: { get: function() {
				return at;
			} },
			newPSD: N,
			usePSD: ft,
			scheduler: {
				get: function() {
					return Le;
				},
				set: function(e) {
					Le = e;
				}
			},
			rejectionMapper: {
				get: function() {
					return Ve;
				},
				set: function(e) {
					Ve = e;
				}
			},
			follow: function(e, t) {
				return new k(function(n, r) {
					return N(function(t, n) {
						var r = O;
						r.unhandleds = [], r.onunhandled = n, r.finalize = we(function() {
							var e, r = this;
							e = function() {
								r.unhandleds.length === 0 ? t() : n(r.unhandleds[0]);
							}, Ge.push(function t() {
								e(), Ge.splice(Ge.indexOf(t), 1);
							}), ++We, Le(function() {
								--We == 0 && tt();
							}, []);
						}, r.finalize), e();
					}, t, n, r);
				});
			}
		}), Fe && (Fe.allSettled && f(k, "allSettled", function() {
			var e = fe.apply(null, arguments).map(P);
			return new k(function(t) {
				e.length === 0 && t([]);
				var n = e.length, r = Array(n);
				e.forEach(function(e, i) {
					return k.resolve(e).then(function(e) {
						return r[i] = {
							status: "fulfilled",
							value: e
						};
					}, function(e) {
						return r[i] = {
							status: "rejected",
							reason: e
						};
					}).then(function() {
						return --n || t(r);
					});
				});
			});
		}), Fe.any && typeof AggregateError < "u" && f(k, "any", function() {
			var e = fe.apply(null, arguments).map(P);
			return new k(function(t, n) {
				e.length === 0 && n(/* @__PURE__ */ AggregateError([]));
				var r = e.length, i = Array(r);
				e.forEach(function(e, a) {
					return k.resolve(e).then(function(e) {
						return t(e);
					}, function(e) {
						i[a] = e, --r || n(AggregateError(i));
					});
				});
			});
		}), Fe.withResolvers) && (k.withResolvers = Fe.withResolvers);
		var M = {
			awaits: 0,
			echoes: 0,
			id: 0
		}, nt = 0, rt = [], it = 0, at = 0, ot = 0;
		function N(e, t, n, r) {
			var i = O, a = Object.create(i), t = (a.parent = i, a.ref = 0, a.global = !1, a.id = ++ot, He.env, a.env = Ie ? {
				Promise: k,
				PromiseProp: {
					value: k,
					configurable: !0,
					writable: !0
				},
				all: k.all,
				race: k.race,
				allSettled: k.allSettled,
				any: k.any,
				resolve: k.resolve,
				reject: k.reject
			} : {}, t && o(a, t), ++i.ref, a.finalize = function() {
				--this.parent.ref || this.parent.finalize();
			}, ft(a, e, n, r));
			return a.ref === 0 && a.finalize(), t;
		}
		function st() {
			return M.id ||= ++nt, ++M.awaits, M.echoes += Me, M.id;
		}
		function ct() {
			return !!M.awaits && (--M.awaits == 0 && (M.id = 0), M.echoes = M.awaits * Me, !0);
		}
		function P(e) {
			return M.echoes && e && e.constructor === Fe ? (st(), e.then(function(e) {
				return ct(), e;
			}, function(e) {
				return ct(), F(e);
			})) : e;
		}
		function lt() {
			var e = rt[rt.length - 1];
			rt.pop(), ut(e, !1);
		}
		function ut(e, t) {
			var n, i, a = O;
			(t ? !M.echoes || it++ && e === O : !it || --it && e === O) || queueMicrotask(t ? function(e) {
				++at, M.echoes && --M.echoes != 0 || (M.echoes = M.awaits = M.id = 0), rt.push(O), ut(e, !0);
			}.bind(null, e) : lt), e !== O && (O = e, a === He && (He.env = dt()), Ie) && (n = He.env.Promise, i = e.env, a.global || e.global) && (Object.defineProperty(r, "Promise", i.PromiseProp), n.all = i.all, n.race = i.race, n.resolve = i.resolve, n.reject = i.reject, i.allSettled && (n.allSettled = i.allSettled), i.any) && (n.any = i.any);
		}
		function dt() {
			var e = r.Promise;
			return Ie ? {
				Promise: e,
				PromiseProp: Object.getOwnPropertyDescriptor(r, "Promise"),
				all: e.all,
				race: e.race,
				allSettled: e.allSettled,
				any: e.any,
				resolve: e.resolve,
				reject: e.reject
			} : {};
		}
		function ft(e, t, n, r, i) {
			var a = O;
			try {
				return ut(e, !0), t(n, r, i);
			} finally {
				ut(a, !1);
			}
		}
		function pt(e, t, n, r) {
			return typeof e == "function" ? function() {
				var i = O;
				n && st(), ut(t, !0);
				try {
					return e.apply(this, arguments);
				} finally {
					ut(i, !1), r && queueMicrotask(ct);
				}
			} : e;
		}
		function mt(e) {
			Promise === Fe && M.echoes === 0 ? it === 0 ? e() : enqueueNativeMicroTask(e) : setTimeout(e, 0);
		}
		("" + Pe).indexOf("[native code]") === -1 && (st = ct = T);
		var F = k.reject, ht = "￿", gt = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", _t = "String expected.", vt = "__dbnames", yt = "readonly", bt = "readwrite";
		function xt(e, t) {
			return e ? t ? function() {
				return e.apply(this, arguments) && t.apply(this, arguments);
			} : e : t;
		}
		var St = {
			type: 3,
			lower: -1 / 0,
			lowerOpen: !1,
			upper: [[]],
			upperOpen: !1
		};
		function Ct(e) {
			return typeof e != "string" || /\./.test(e) ? function(e) {
				return e;
			} : function(t) {
				return t[e] === void 0 && e in t && delete (t = oe(t))[e], t;
			};
		}
		function wt() {
			throw w.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
		}
		function I(e, t) {
			try {
				var n = Tt(e), r = Tt(t);
				if (n !== r) return n === "Array" ? 1 : r === "Array" ? -1 : n === "binary" ? 1 : r === "binary" ? -1 : n === "string" ? 1 : r === "string" ? -1 : n === "Date" ? 1 : r === "Date" ? -1 : NaN;
				switch (n) {
					case "number":
					case "Date":
					case "string": return t < e ? 1 : e < t ? -1 : 0;
					case "binary":
						for (var i = Et(e), a = Et(t), o = i.length, s = a.length, c = o < s ? o : s, l = 0; l < c; ++l) if (i[l] !== a[l]) return i[l] < a[l] ? -1 : 1;
						return o === s ? 0 : o < s ? -1 : 1;
					case "Array":
						for (var u = e, d = t, f = u.length, p = d.length, m = f < p ? f : p, h = 0; h < m; ++h) {
							var g = I(u[h], d[h]);
							if (g !== 0) return g;
						}
						return f === p ? 0 : f < p ? -1 : 1;
				}
			} catch {}
			return NaN;
		}
		function Tt(e) {
			var t = typeof e;
			return t == "object" && (ArrayBuffer.isView(e) || (t = ce(e)) === "ArrayBuffer") ? "binary" : t;
		}
		function Et(e) {
			return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : new Uint8Array(e);
		}
		function Dt(e, t, n) {
			var r = e.schema.yProps;
			return r ? (t && 0 < n.numFailures && (t = t.filter(function(e, t) {
				return !n.failures[t];
			})), Promise.all(r.map(function(n) {
				return n = n.updatesTable, t ? e.db.table(n).where("k").anyOf(t).delete() : e.db.table(n).clear();
			})).then(function() {
				return n;
			})) : n;
		}
		kt.prototype.execute = function(e) {
			var t = this["@@propmod"];
			if (t.add !== void 0) {
				var r = t.add;
				if (a(r)) return n(n([], a(e) ? e : [], !0), r, !0).sort();
				if (typeof r == "number") return (Number(e) || 0) + r;
				if (typeof r == "bigint") try {
					return BigInt(e) + r;
				} catch {
					return BigInt(0) + r;
				}
				throw TypeError(`Invalid term ${r}`);
			}
			if (t.remove !== void 0) {
				var i = t.remove;
				if (a(i)) return a(e) ? e.filter(function(e) {
					return !i.includes(e);
				}).sort() : [];
				if (typeof i == "number") return Number(e) - i;
				if (typeof i == "bigint") try {
					return BigInt(e) - i;
				} catch {
					return BigInt(0) - i;
				}
				throw TypeError(`Invalid subtrahend ${i}`);
			}
			return r = (r = t.replacePrefix)?.[0], r && typeof e == "string" && e.startsWith(r) ? t.replacePrefix[1] + e.substring(r.length) : e;
		};
		var Ot = kt;
		function kt(e) {
			this["@@propmod"] = e;
		}
		function At(e, t) {
			for (var n = i(t), r = n.length, a = !1, o = 0; o < r; ++o) {
				var s = n[o], c = t[s], l = b(e, s);
				c instanceof Ot ? (x(e, s, c.execute(l)), a = !0) : l !== c && (x(e, s, c), a = !0);
			}
			return a;
		}
		L.prototype._trans = function(e, t, n) {
			var r = this._tx || O.trans, i = this.name, a = ke && typeof console < "u" && console.createTask && console.createTask(`Dexie: ${e === "readonly" ? "read" : "write"} ${this.name}`);
			function o(e, n, r) {
				if (r.schema[i]) return t(r.idbtrans, r);
				throw new w.NotFound("Table " + i + " not part of transaction");
			}
			var s = $e();
			try {
				var c = r && r.db._novip === this.db._novip ? r === O.trans ? r._promise(e, o, n) : N(function() {
					return r._promise(e, o, n);
				}, {
					trans: r,
					transless: O.transless || O
				}) : function e(t, n, r, i) {
					if (t.idbdb && (t._state.openComplete || O.letThrough || t._vip)) {
						var a = t._createTransaction(n, r, t._dbSchema);
						try {
							a.create(), t._state.PR1398_maxLoop = 3;
						} catch (a) {
							return a.name === ye.InvalidState && t.isOpen() && 0 < --t._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), t.close({ disableAutoOpen: !1 }), t.open().then(function() {
								return e(t, n, r, i);
							})) : F(a);
						}
						return a._promise(n, function(e, t) {
							return N(function() {
								return O.trans = a, i(e, t, a);
							});
						}).then(function(e) {
							if (n === "readwrite") try {
								a.idbtrans.commit();
							} catch {}
							return n === "readonly" ? e : a._completion.then(function() {
								return e;
							});
						});
					}
					if (t._state.openComplete) return F(new w.DatabaseClosed(t._state.dbOpenError));
					if (!t._state.isBeingOpened) {
						if (!t._state.autoOpen) return F(new w.DatabaseClosed());
						t.open().catch(T);
					}
					return t._state.dbReadyPromise.then(function() {
						return e(t, n, r, i);
					});
				}(this.db, e, [this.name], o);
				return a && (c._consoleTask = a, c = c.catch(function(e) {
					return console.trace(e), F(e);
				})), c;
			} finally {
				s && et();
			}
		}, L.prototype.get = function(e, t) {
			var n = this;
			return e && e.constructor === Object ? this.where(e).first(t) : e == null ? F(new w.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(t) {
				return n.core.get({
					trans: t,
					key: e
				}).then(function(e) {
					return n.hook.reading.fire(e);
				});
			}).then(t);
		}, L.prototype.where = function(e) {
			if (typeof e == "string") return new this.db.WhereClause(this, e);
			if (a(e)) return new this.db.WhereClause(this, `[${e.join("+")}]`);
			var t = i(e);
			if (t.length === 1) return this.where(t[0]).equals(e[t[0]]);
			var n = this.schema.indexes.concat(this.schema.primKey).filter(function(e) {
				if (e.compound && t.every(function(t) {
					return 0 <= e.keyPath.indexOf(t);
				})) {
					for (var n = 0; n < t.length; ++n) if (t.indexOf(e.keyPath[n]) === -1) return !1;
					return !0;
				}
				return !1;
			}).sort(function(e, t) {
				return e.keyPath.length - t.keyPath.length;
			})[0];
			if (n && this.db._maxKey !== ht) return s = n.keyPath.slice(0, t.length), this.where(s).equals(s.map(function(t) {
				return e[t];
			}));
			!n && ke && console.warn(`The query ${JSON.stringify(e)} on ${this.name} would benefit from a compound index [${t.join("+")}]`);
			var r = this.schema.idxByName;
			function o(e, t) {
				return I(e, t) === 0;
			}
			var s = t.reduce(function(t, n) {
				var i = t[0], t = t[1], s = r[n], c = e[n];
				return [i || s, i || !s ? xt(t, s && s.multi ? function(e) {
					return e = b(e, n), a(e) && e.some(function(e) {
						return o(c, e);
					});
				} : function(e) {
					return o(c, b(e, n));
				}) : t];
			}, [null, null]), c = s[0], s = s[1];
			return c ? this.where(c.name).equals(e[c.keyPath]).filter(s) : n ? this.filter(s) : this.where(t).equals("");
		}, L.prototype.filter = function(e) {
			return this.toCollection().and(e);
		}, L.prototype.count = function(e) {
			return this.toCollection().count(e);
		}, L.prototype.offset = function(e) {
			return this.toCollection().offset(e);
		}, L.prototype.limit = function(e) {
			return this.toCollection().limit(e);
		}, L.prototype.each = function(e) {
			return this.toCollection().each(e);
		}, L.prototype.toArray = function(e) {
			return this.toCollection().toArray(e);
		}, L.prototype.toCollection = function() {
			return new this.db.Collection(new this.db.WhereClause(this));
		}, L.prototype.orderBy = function(e) {
			return new this.db.Collection(new this.db.WhereClause(this, a(e) ? `[${e.join("+")}]` : e));
		}, L.prototype.reverse = function() {
			return this.toCollection().reverse();
		}, L.prototype.mapToClass = function(t) {
			for (var n = this.db, r = this.name, i = ((this.schema.mappedClass = t).prototype instanceof wt && (t = ((t) => {
				var i = s, a = t;
				if (typeof a != "function" && a !== null) throw TypeError("Class extends value " + String(a) + " is not a constructor or null");
				function o() {
					this.constructor = i;
				}
				function s() {
					return t !== null && t.apply(this, arguments) || this;
				}
				return e(i, a), i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o()), Object.defineProperty(s.prototype, "db", {
					get: function() {
						return n;
					},
					enumerable: !1,
					configurable: !0
				}), s.prototype.table = function() {
					return r;
				}, s;
			})(t)), /* @__PURE__ */ new Set()), a = t.prototype; a; a = s(a)) Object.getOwnPropertyNames(a).forEach(function(e) {
				return i.add(e);
			});
			function o(e) {
				if (!e) return e;
				var n, r = Object.create(t.prototype);
				for (n in e) if (!i.has(n)) try {
					r[n] = e[n];
				} catch {}
				return r;
			}
			return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = o, this.hook("reading", o), t;
		}, L.prototype.defineClass = function() {
			return this.mapToClass(function(e) {
				o(this, e);
			});
		}, L.prototype.add = function(e, t) {
			var n = this, r = this.schema.primKey, i = r.auto, a = r.keyPath, o = e;
			return a && i && (o = Ct(a)(e)), this._trans("readwrite", function(e) {
				return n.core.mutate({
					trans: e,
					type: "add",
					keys: t == null ? null : [t],
					values: [o]
				});
			}).then(function(e) {
				return e.numFailures ? k.reject(e.failures[0]) : e.lastResult;
			}).then(function(t) {
				if (a) try {
					x(e, a, t);
				} catch {}
				return t;
			});
		}, L.prototype.upsert = function(e, t) {
			var n = this, r = this.schema.primKey.keyPath;
			return this._trans("readwrite", function(i) {
				return n.core.get({
					trans: i,
					key: e
				}).then(function(a) {
					var o = a ?? {};
					return At(o, t), r && x(o, r, e), n.core.mutate({
						trans: i,
						type: "put",
						values: [o],
						keys: [e],
						upsert: !0,
						updates: {
							keys: [e],
							changeSpecs: [t]
						}
					}).then(function(e) {
						return e.numFailures ? k.reject(e.failures[0]) : !!a;
					});
				});
			});
		}, L.prototype.update = function(e, t) {
			return typeof e != "object" || a(e) ? this.where(":id").equals(e).modify(t) : (e = b(e, this.schema.primKey.keyPath)) === void 0 ? F(new w.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(e).modify(t);
		}, L.prototype.put = function(e, t) {
			var n = this, r = this.schema.primKey, i = r.auto, a = r.keyPath, o = e;
			return a && i && (o = Ct(a)(e)), this._trans("readwrite", function(e) {
				return n.core.mutate({
					trans: e,
					type: "put",
					values: [o],
					keys: t == null ? null : [t]
				});
			}).then(function(e) {
				return e.numFailures ? k.reject(e.failures[0]) : e.lastResult;
			}).then(function(t) {
				if (a) try {
					x(e, a, t);
				} catch {}
				return t;
			});
		}, L.prototype.delete = function(e) {
			var t = this;
			return this._trans("readwrite", function(n) {
				return t.core.mutate({
					trans: n,
					type: "delete",
					keys: [e]
				}).then(function(n) {
					return Dt(t, [e], n);
				}).then(function(e) {
					return e.numFailures ? k.reject(e.failures[0]) : void 0;
				});
			});
		}, L.prototype.clear = function() {
			var e = this;
			return this._trans("readwrite", function(t) {
				return e.core.mutate({
					trans: t,
					type: "deleteRange",
					range: St
				}).then(function(t) {
					return Dt(e, null, t);
				});
			}).then(function(e) {
				return e.numFailures ? k.reject(e.failures[0]) : void 0;
			});
		}, L.prototype.bulkGet = function(e) {
			var t = this;
			return this._trans("readonly", function(n) {
				return t.core.getMany({
					keys: e,
					trans: n
				}).then(function(e) {
					return e.map(function(e) {
						return t.hook.reading.fire(e);
					});
				});
			});
		}, L.prototype.bulkAdd = function(e, t, n) {
			var r = this, i = Array.isArray(t) ? t : void 0, a = (n ||= i ? void 0 : t) ? n.allKeys : void 0;
			return this._trans("readwrite", function(t) {
				var n = r.schema.primKey, o = n.auto, n = n.keyPath;
				if (n && i) throw new w.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
				if (i && i.length !== e.length) throw new w.InvalidArgument("Arguments objects and keys must have the same length");
				var s = e.length, o = n && o ? e.map(Ct(n)) : e;
				return r.core.mutate({
					trans: t,
					type: "add",
					keys: i,
					values: o,
					wantResults: a
				}).then(function(e) {
					var t = e.numFailures, n = e.failures;
					if (t === 0) return a ? e.results : e.lastResult;
					throw new ve(`${r.name}.bulkAdd(): ${t} of ${s} operations failed`, n);
				});
			});
		}, L.prototype.bulkPut = function(e, t, n) {
			var r = this, i = Array.isArray(t) ? t : void 0, a = (n ||= i ? void 0 : t) ? n.allKeys : void 0;
			return this._trans("readwrite", function(t) {
				var n = r.schema.primKey, o = n.auto, n = n.keyPath;
				if (n && i) throw new w.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
				if (i && i.length !== e.length) throw new w.InvalidArgument("Arguments objects and keys must have the same length");
				var s = e.length, o = n && o ? e.map(Ct(n)) : e;
				return r.core.mutate({
					trans: t,
					type: "put",
					keys: i,
					values: o,
					wantResults: a
				}).then(function(e) {
					var t = e.numFailures, n = e.failures;
					if (t === 0) return a ? e.results : e.lastResult;
					throw new ve(`${r.name}.bulkPut(): ${t} of ${s} operations failed`, n);
				});
			});
		}, L.prototype.bulkUpdate = function(e) {
			var t = this, n = this.core, r = e.map(function(e) {
				return e.key;
			}), i = e.map(function(e) {
				return e.changes;
			}), a = [];
			return this._trans("readwrite", function(o) {
				return n.getMany({
					trans: o,
					keys: r,
					cache: "clone"
				}).then(function(s) {
					var c = [], l = [], u = (e.forEach(function(e, n) {
						var r = e.key, i = e.changes, o = s[n];
						if (o) {
							for (var u = 0, d = Object.keys(i); u < d.length; u++) {
								var f = d[u], p = i[f];
								if (f === t.schema.primKey.keyPath) {
									if (I(p, r) !== 0) throw new w.Constraint("Cannot update primary key in bulkUpdate()");
								} else x(o, f, p);
							}
							a.push(n), c.push(r), l.push(o);
						}
					}), c.length);
					return n.mutate({
						trans: o,
						type: "put",
						keys: c,
						values: l,
						updates: {
							keys: r,
							changeSpecs: i
						}
					}).then(function(e) {
						var n = e.numFailures, r = e.failures;
						if (n === 0) return u;
						for (var i = 0, o = Object.keys(r); i < o.length; i++) {
							var s, c = o[i], l = a[Number(c)];
							l != null && (s = r[c], delete r[c], r[l] = s);
						}
						throw new ve(`${t.name}.bulkUpdate(): ${n} of ${u} operations failed`, r);
					});
				});
			});
		}, L.prototype.bulkDelete = function(e) {
			var t = this, n = e.length;
			return this._trans("readwrite", function(n) {
				return t.core.mutate({
					trans: n,
					type: "delete",
					keys: e
				}).then(function(n) {
					return Dt(t, e, n);
				});
			}).then(function(e) {
				var r = e.numFailures, i = e.failures;
				if (r === 0) return e.lastResult;
				throw new ve(`${t.name}.bulkDelete(): ${r} of ${n} operations failed`, i);
			});
		};
		var jt = L;
		function L() {}
		function Mt(e) {
			function t(t, r) {
				if (r) {
					for (var i = arguments.length, a = Array(i - 1); --i;) a[i - 1] = arguments[i];
					return n[t].subscribe.apply(null, a), e;
				}
				if (typeof t == "string") return n[t];
			}
			var n = {};
			t.addEventType = s;
			for (var r = 1, o = arguments.length; r < o; ++r) s(arguments[r]);
			return t;
			function s(e, r, o) {
				var c, l;
				if (typeof e != "object") return r ||= De, l = {
					subscribers: [],
					fire: o ||= T,
					subscribe: function(e) {
						l.subscribers.indexOf(e) === -1 && (l.subscribers.push(e), l.fire = r(l.fire, e));
					},
					unsubscribe: function(e) {
						l.subscribers = l.subscribers.filter(function(t) {
							return t !== e;
						}), l.fire = l.subscribers.reduce(r, o);
					}
				}, n[e] = t[e] = l;
				i(c = e).forEach(function(e) {
					var t = c[e];
					if (a(t)) s(e, c[e][0], c[e][1]);
					else {
						if (t !== "asap") throw new w.InvalidArgument("Invalid event config");
						var n = s(e, Se, function() {
							for (var e = arguments.length, t = Array(e); e--;) t[e] = arguments[e];
							n.subscribers.forEach(function(e) {
								y(function() {
									e.apply(null, t);
								});
							});
						});
					}
				});
			}
		}
		function Nt(e, t) {
			return p(t).from({ prototype: e }), t;
		}
		function Pt(e, t) {
			return !(e.filter || e.algorithm || e.or) && (t ? e.justLimit : !e.replayFilter);
		}
		function Ft(e, t) {
			e.filter = xt(e.filter, t);
		}
		function It(e, t, n) {
			var r = e.replayFilter;
			e.replayFilter = r ? function() {
				return xt(r(), t());
			} : t, e.justLimit = n && !r;
		}
		function Lt(e, t) {
			if (e.isPrimKey) return t.primaryKey;
			var n = t.getIndexByKeyPath(e.index);
			if (n) return n;
			throw new w.Schema("KeyPath " + e.index + " on object store " + t.name + " is not indexed");
		}
		function Rt(e, t, n) {
			var r = Lt(e, t.schema);
			return t.openCursor({
				trans: n,
				values: !e.keysOnly,
				reverse: e.dir === "prev",
				unique: !!e.unique,
				query: {
					index: r,
					range: e.range
				}
			});
		}
		function zt(e, t, n, r) {
			var i, a, o = e.replayFilter ? xt(e.filter, e.replayFilter()) : e.filter;
			return e.or ? (i = {}, a = function(e, n, r) {
				var a, s;
				o && !o(n, r, function(e) {
					return n.stop(e);
				}, function(e) {
					return n.fail(e);
				}) || ((s = "" + (a = n.primaryKey)) == "[object ArrayBuffer]" && (s = "" + new Uint8Array(a)), l(i, s)) || (i[s] = !0, t(e, n, r));
			}, Promise.all([e.or._iterate(a, n), Bt(Rt(e, r, n), e.algorithm, a, !e.keysOnly && e.valueMapper)])) : Bt(Rt(e, r, n), xt(e.algorithm, o), t, !e.keysOnly && e.valueMapper);
		}
		function Bt(e, t, n, r) {
			var i = j(r ? function(e, t, i) {
				return n(r(e), t, i);
			} : n);
			return e.then(function(e) {
				if (e) return e.start(function() {
					var n = function() {
						return e.continue();
					};
					t && !t(e, function(e) {
						return n = e;
					}, function(t) {
						e.stop(t), n = T;
					}, function(t) {
						e.fail(t), n = T;
					}) || i(e.value, e, function(e) {
						return n = e;
					}), n();
				});
			});
		}
		R.prototype._read = function(e, t) {
			var n = this._ctx;
			return n.error ? n.table._trans(null, F.bind(null, n.error)) : n.table._trans("readonly", e).then(t);
		}, R.prototype._write = function(e) {
			var t = this._ctx;
			return t.error ? t.table._trans(null, F.bind(null, t.error)) : t.table._trans("readwrite", e, "locked");
		}, R.prototype._addAlgorithm = function(e) {
			var t = this._ctx;
			t.algorithm = xt(t.algorithm, e);
		}, R.prototype._iterate = function(e, t) {
			return zt(this._ctx, e, t, this._ctx.table.core);
		}, R.prototype.clone = function(e) {
			var t = Object.create(this.constructor.prototype), n = Object.create(this._ctx);
			return e && o(n, e), t._ctx = n, t;
		}, R.prototype.raw = function() {
			return this._ctx.valueMapper = null, this;
		}, R.prototype.each = function(e) {
			var t = this._ctx;
			return this._read(function(n) {
				return zt(t, e, n, t.table.core);
			});
		}, R.prototype.count = function(e) {
			var t = this;
			return this._read(function(e) {
				var n, r = t._ctx, i = r.table.core;
				return Pt(r, !0) ? i.count({
					trans: e,
					query: {
						index: Lt(r, i.schema),
						range: r.range
					}
				}).then(function(e) {
					return Math.min(e, r.limit);
				}) : (n = 0, zt(r, function() {
					return ++n, !1;
				}, e, i).then(function() {
					return n;
				}));
			}).then(e);
		}, R.prototype.sortBy = function(e, t) {
			var n = e.split(".").reverse(), r = n[0], i = n.length - 1;
			function a(e, t) {
				return t ? a(e[n[t]], t - 1) : e[r];
			}
			var o = this._ctx.dir === "next" ? 1 : -1;
			function s(e, t) {
				return I(a(e, i), a(t, i)) * o;
			}
			return this.toArray(function(e) {
				return e.slice().sort(s);
			}).then(t);
		}, R.prototype.toArray = function(e) {
			var t = this;
			return this._read(function(e) {
				var n, r, i, a = t._ctx;
				return Pt(a, !0) && 0 < a.limit ? (n = a.valueMapper, r = Lt(a, a.table.core.schema), a.table.core.query({
					trans: e,
					limit: a.limit,
					values: !0,
					direction: a.dir === "prev" ? "prev" : void 0,
					query: {
						index: r,
						range: a.range
					}
				}).then(function(e) {
					return e = e.result, n ? e.map(n) : e;
				})) : (i = [], zt(a, function(e) {
					return i.push(e);
				}, e, a.table.core).then(function() {
					return i;
				}));
			}, e);
		}, R.prototype.offset = function(e) {
			var t = this._ctx;
			return e <= 0 || (t.offset += e, Pt(t) ? It(t, function() {
				var t = e;
				return function(e, n) {
					return t === 0 || (t === 1 ? --t : n(function() {
						e.advance(t), t = 0;
					}), !1);
				};
			}) : It(t, function() {
				var t = e;
				return function() {
					return --t < 0;
				};
			})), this;
		}, R.prototype.limit = function(e) {
			return this._ctx.limit = Math.min(this._ctx.limit, e), It(this._ctx, function() {
				var t = e;
				return function(e, n, r) {
					return --t <= 0 && n(r), 0 <= t;
				};
			}, !0), this;
		}, R.prototype.until = function(e, t) {
			return Ft(this._ctx, function(n, r, i) {
				return !e(n.value) || (r(i), t);
			}), this;
		}, R.prototype.first = function(e) {
			return this.limit(1).toArray(function(e) {
				return e[0];
			}).then(e);
		}, R.prototype.last = function(e) {
			return this.reverse().first(e);
		}, R.prototype.filter = function(e) {
			var t;
			return Ft(this._ctx, function(t) {
				return e(t.value);
			}), (t = this._ctx).isMatch = xt(t.isMatch, e), this;
		}, R.prototype.and = function(e) {
			return this.filter(e);
		}, R.prototype.or = function(e) {
			return new this.db.WhereClause(this._ctx.table, e, this);
		}, R.prototype.reverse = function() {
			return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
		}, R.prototype.desc = function() {
			return this.reverse();
		}, R.prototype.eachKey = function(e) {
			var t = this._ctx;
			return t.keysOnly = !t.isMatch, this.each(function(t, n) {
				e(n.key, n);
			});
		}, R.prototype.eachUniqueKey = function(e) {
			return this._ctx.unique = "unique", this.eachKey(e);
		}, R.prototype.eachPrimaryKey = function(e) {
			var t = this._ctx;
			return t.keysOnly = !t.isMatch, this.each(function(t, n) {
				e(n.primaryKey, n);
			});
		}, R.prototype.keys = function(e) {
			var t = this._ctx, n = (t.keysOnly = !t.isMatch, []);
			return this.each(function(e, t) {
				n.push(t.key);
			}).then(function() {
				return n;
			}).then(e);
		}, R.prototype.primaryKeys = function(e) {
			var t = this._ctx;
			if (Pt(t, !0) && 0 < t.limit) return this._read(function(e) {
				var n = Lt(t, t.table.core.schema);
				return t.table.core.query({
					trans: e,
					values: !1,
					limit: t.limit,
					direction: t.dir === "prev" ? "prev" : void 0,
					query: {
						index: n,
						range: t.range
					}
				});
			}).then(function(e) {
				return e.result;
			}).then(e);
			t.keysOnly = !t.isMatch;
			var n = [];
			return this.each(function(e, t) {
				n.push(t.primaryKey);
			}).then(function() {
				return n;
			}).then(e);
		}, R.prototype.uniqueKeys = function(e) {
			return this._ctx.unique = "unique", this.keys(e);
		}, R.prototype.firstKey = function(e) {
			return this.limit(1).keys(function(e) {
				return e[0];
			}).then(e);
		}, R.prototype.lastKey = function(e) {
			return this.reverse().firstKey(e);
		}, R.prototype.distinct = function() {
			var e, t = this._ctx, t = t.index && t.table.schema.idxByName[t.index];
			return t && t.multi && (e = {}, Ft(this._ctx, function(t) {
				var t = t.primaryKey.toString(), n = l(e, t);
				return e[t] = !0, !n;
			})), this;
		}, R.prototype.modify = function(e) {
			var t = this, n = this._ctx;
			return this._write(function(r) {
				function a(e, t) {
					var n = t.failures;
					p += e - t.numFailures;
					for (var r = 0, a = i(n); r < a.length; r++) {
						var o = a[r];
						f.push(n[o]);
					}
				}
				var o = typeof e == "function" ? e : function(t) {
					return At(t, e);
				}, s = n.table.core, c = s.schema.primaryKey, l = c.outbound, u = c.extractKey, d = 200, c = t.db._options.modifyChunkSize, f = (c && (d = typeof c == "object" ? c[s.name] || c["*"] || 200 : c), []), p = 0, m = [], h = e === Ht;
				return t.clone().primaryKeys().then(function(t) {
					function i(f) {
						var p = Math.min(d, t.length - f), m = t.slice(f, f + p);
						return (h ? Promise.resolve([]) : s.getMany({
							trans: r,
							keys: m,
							cache: "immutable"
						})).then(function(g) {
							var _ = [], v = [], y = l ? [] : null, b = h ? m : [];
							if (!h) for (var x = 0; x < p; ++x) {
								var ee = g[x], te = {
									value: oe(ee),
									primKey: t[f + x]
								};
								!1 !== o.call(te, te.value, te) && (te.value == null ? b.push(t[f + x]) : l || I(u(ee), u(te.value)) === 0 ? (v.push(te.value), l && y.push(t[f + x])) : (b.push(t[f + x]), _.push(te.value)));
							}
							return Promise.resolve(0 < _.length && s.mutate({
								trans: r,
								type: "add",
								values: _
							}).then(function(e) {
								for (var t in e.failures) b.splice(parseInt(t), 1);
								a(_.length, e);
							})).then(function() {
								return (0 < v.length || c && typeof e == "object") && s.mutate({
									trans: r,
									type: "put",
									keys: y,
									values: v,
									criteria: c,
									changeSpec: typeof e != "function" && e,
									isAdditionalChunk: 0 < f
								}).then(function(e) {
									return a(v.length, e);
								});
							}).then(function() {
								return (0 < b.length || c && h) && s.mutate({
									trans: r,
									type: "delete",
									keys: b,
									criteria: c,
									isAdditionalChunk: 0 < f
								}).then(function(e) {
									return Dt(n.table, b, e);
								}).then(function(e) {
									return a(b.length, e);
								});
							}).then(function() {
								return t.length > f + p && i(f + d);
							});
						});
					}
					var c = Pt(n) && n.limit === 1 / 0 && (typeof e != "function" || h) && {
						index: n.index,
						range: n.range
					};
					return i(0).then(function() {
						if (0 < f.length) throw new C("Error modifying one or more objects", f, p, m);
						return t.length;
					});
				});
			});
		}, R.prototype.delete = function() {
			var e = this._ctx, t = e.range;
			return !Pt(e) || e.table.schema.yProps || !e.isPrimKey && t.type !== 3 ? this.modify(Ht) : this._write(function(n) {
				var r = e.table.core.schema.primaryKey, i = t;
				return e.table.core.count({
					trans: n,
					query: {
						index: r,
						range: i
					}
				}).then(function(t) {
					return e.table.core.mutate({
						trans: n,
						type: "deleteRange",
						range: i
					}).then(function(e) {
						var n = e.failures, e = e.numFailures;
						if (e) throw new C("Could not delete some values", Object.keys(n).map(function(e) {
							return n[e];
						}), t - e);
						return t - e;
					});
				});
			});
		};
		var Vt = R;
		function R() {}
		var Ht = function(e, t) {
			return t.value = null;
		};
		function Ut(e, t) {
			return e < t ? -1 : e === t ? 0 : 1;
		}
		function Wt(e, t) {
			return t < e ? -1 : e === t ? 0 : 1;
		}
		function Gt(e, t, n) {
			return e = e instanceof Xt ? new e.Collection(e) : e, e._ctx.error = new (n || TypeError)(t), e;
		}
		function Kt(e) {
			return new e.Collection(e, function() {
				return Yt("");
			}).limit(0);
		}
		function qt(e, t, n, r) {
			var i, a, o, s, c, l, u, d = n.length;
			if (!n.every(function(e) {
				return typeof e == "string";
			})) return Gt(e, _t);
			function f(e) {
				i = e === "next" ? function(e) {
					return e.toUpperCase();
				} : function(e) {
					return e.toLowerCase();
				}, a = e === "next" ? function(e) {
					return e.toLowerCase();
				} : function(e) {
					return e.toUpperCase();
				}, o = e === "next" ? Ut : Wt;
				var t = n.map(function(e) {
					return {
						lower: a(e),
						upper: i(e)
					};
				}).sort(function(e, t) {
					return o(e.lower, t.lower);
				});
				s = t.map(function(e) {
					return e.upper;
				}), c = t.map(function(e) {
					return e.lower;
				}), u = (l = e) === "next" ? "" : r;
			}
			f("next");
			var e = new e.Collection(e, function() {
				return Jt(s[0], c[d - 1] + r);
			}), p = (e._ondirectionchange = function(e) {
				f(e);
			}, 0);
			return e._addAlgorithm(function(e, n, r) {
				var i = e.key;
				if (typeof i == "string") {
					var f = a(i);
					if (t(f, c, p)) return !0;
					for (var m = null, h = p; h < d; ++h) {
						var g = ((e, t, n, r, i, a) => {
							for (var o = Math.min(e.length, r.length), s = -1, c = 0; c < o; ++c) {
								var l = t[c];
								if (l !== r[c]) return i(e[c], n[c]) < 0 ? e.substr(0, c) + n[c] + n.substr(c + 1) : i(e[c], r[c]) < 0 ? e.substr(0, c) + r[c] + n.substr(c + 1) : 0 <= s ? e.substr(0, s) + t[s] + n.substr(s + 1) : null;
								i(e[c], l) < 0 && (s = c);
							}
							return o < r.length && a === "next" ? e + n.substr(e.length) : o < e.length && a === "prev" ? e.substr(0, n.length) : s < 0 ? null : e.substr(0, s) + r[s] + n.substr(s + 1);
						})(i, f, s[h], c[h], o, l);
						g === null && m === null ? p = h + 1 : (m === null || 0 < o(m, g)) && (m = g);
					}
					n(m === null ? r : function() {
						e.continue(m + u);
					});
				}
				return !1;
			}), e;
		}
		function Jt(e, t, n, r) {
			return {
				type: 2,
				lower: e,
				upper: t,
				lowerOpen: n,
				upperOpen: r
			};
		}
		function Yt(e) {
			return {
				type: 1,
				lower: e,
				upper: e
			};
		}
		Object.defineProperty(z.prototype, "Collection", {
			get: function() {
				return this._ctx.table.db.Collection;
			},
			enumerable: !1,
			configurable: !0
		}), z.prototype.between = function(e, t, n, r) {
			n = !1 !== n, r = !0 === r;
			try {
				return 0 < this._cmp(e, t) || this._cmp(e, t) === 0 && (n || r) && (!n || !r) ? Kt(this) : new this.Collection(this, function() {
					return Jt(e, t, !n, !r);
				});
			} catch {
				return Gt(this, gt);
			}
		}, z.prototype.equals = function(e) {
			return e == null ? Gt(this, gt) : new this.Collection(this, function() {
				return Yt(e);
			});
		}, z.prototype.above = function(e) {
			return e == null ? Gt(this, gt) : new this.Collection(this, function() {
				return Jt(e, void 0, !0);
			});
		}, z.prototype.aboveOrEqual = function(e) {
			return e == null ? Gt(this, gt) : new this.Collection(this, function() {
				return Jt(e, void 0, !1);
			});
		}, z.prototype.below = function(e) {
			return e == null ? Gt(this, gt) : new this.Collection(this, function() {
				return Jt(void 0, e, !1, !0);
			});
		}, z.prototype.belowOrEqual = function(e) {
			return e == null ? Gt(this, gt) : new this.Collection(this, function() {
				return Jt(void 0, e);
			});
		}, z.prototype.startsWith = function(e) {
			return typeof e == "string" ? this.between(e, e + ht, !0, !0) : Gt(this, _t);
		}, z.prototype.startsWithIgnoreCase = function(e) {
			return e === "" ? this.startsWith(e) : qt(this, function(e, t) {
				return e.indexOf(t[0]) === 0;
			}, [e], ht);
		}, z.prototype.equalsIgnoreCase = function(e) {
			return qt(this, function(e, t) {
				return e === t[0];
			}, [e], "");
		}, z.prototype.anyOfIgnoreCase = function() {
			var e = fe.apply(S, arguments);
			return e.length === 0 ? Kt(this) : qt(this, function(e, t) {
				return t.indexOf(e) !== -1;
			}, e, "");
		}, z.prototype.startsWithAnyOfIgnoreCase = function() {
			var e = fe.apply(S, arguments);
			return e.length === 0 ? Kt(this) : qt(this, function(e, t) {
				return t.some(function(t) {
					return e.indexOf(t) === 0;
				});
			}, e, ht);
		}, z.prototype.anyOf = function() {
			var e, t, n = this, r = fe.apply(S, arguments), i = this._cmp;
			try {
				r.sort(i);
			} catch {
				return Gt(this, gt);
			}
			return r.length === 0 ? Kt(this) : ((e = new this.Collection(this, function() {
				return Jt(r[0], r[r.length - 1]);
			}))._ondirectionchange = function(e) {
				i = e === "next" ? n._ascending : n._descending, r.sort(i);
			}, t = 0, e._addAlgorithm(function(e, n, a) {
				for (var o = e.key; 0 < i(o, r[t]);) if (++t === r.length) return n(a), !1;
				return i(o, r[t]) === 0 || (n(function() {
					e.continue(r[t]);
				}), !1);
			}), e);
		}, z.prototype.notEqual = function(e) {
			return this.inAnyRange([[-1 / 0, e], [e, this.db._maxKey]], {
				includeLowers: !1,
				includeUppers: !1
			});
		}, z.prototype.noneOf = function() {
			var e = fe.apply(S, arguments);
			if (e.length === 0) return new this.Collection(this);
			try {
				e.sort(this._ascending);
			} catch {
				return Gt(this, gt);
			}
			var t = e.reduce(function(e, t) {
				return e ? e.concat([[e[e.length - 1][1], t]]) : [[-1 / 0, t]];
			}, null);
			return t.push([e[e.length - 1], this.db._maxKey]), this.inAnyRange(t, {
				includeLowers: !1,
				includeUppers: !1
			});
		}, z.prototype.inAnyRange = function(e, t) {
			var n = this, r = this._cmp, i = this._ascending, a = this._descending, o = this._min, s = this._max;
			if (e.length === 0) return Kt(this);
			if (!e.every(function(e) {
				return e[0] !== void 0 && e[1] !== void 0 && i(e[0], e[1]) <= 0;
			})) return Gt(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", w.InvalidArgument);
			var c = !t || !1 !== t.includeLowers, l = t && !0 === t.includeUppers, u, d = i;
			function f(e, t) {
				return d(e[0], t[0]);
			}
			try {
				(u = e.reduce(function(e, t) {
					for (var n = 0, i = e.length; n < i; ++n) {
						var a = e[n];
						if (r(t[0], a[1]) < 0 && 0 < r(t[1], a[0])) {
							a[0] = o(a[0], t[0]), a[1] = s(a[1], t[1]);
							break;
						}
					}
					return n === i && e.push(t), e;
				}, [])).sort(f);
			} catch {
				return Gt(this, gt);
			}
			var p = 0, m = l ? function(e) {
				return 0 < i(e, u[p][1]);
			} : function(e) {
				return 0 <= i(e, u[p][1]);
			}, h = c ? function(e) {
				return 0 < a(e, u[p][0]);
			} : function(e) {
				return 0 <= a(e, u[p][0]);
			}, g = m, t = new this.Collection(this, function() {
				return Jt(u[0][0], u[u.length - 1][1], !c, !l);
			});
			return t._ondirectionchange = function(e) {
				d = e === "next" ? (g = m, i) : (g = h, a), u.sort(f);
			}, t._addAlgorithm(function(e, t, r) {
				for (var a, o = e.key; g(o);) if (++p === u.length) return t(r), !1;
				return !m(a = o) && !h(a) || (n._cmp(o, u[p][1]) === 0 || n._cmp(o, u[p][0]) === 0 || t(function() {
					d === i ? e.continue(u[p][0]) : e.continue(u[p][1]);
				}), !1);
			}), t;
		}, z.prototype.startsWithAnyOf = function() {
			var e = fe.apply(S, arguments);
			return e.every(function(e) {
				return typeof e == "string";
			}) ? e.length === 0 ? Kt(this) : this.inAnyRange(e.map(function(e) {
				return [e, e + ht];
			})) : Gt(this, "startsWithAnyOf() only works with strings");
		};
		var Xt = z;
		function z() {}
		function Zt(e) {
			return j(function(t) {
				return Qt(t), e(t.target.error), !1;
			});
		}
		function Qt(e) {
			e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault();
		}
		var $t = "storagemutated", en = "x-storagemutated-1", tn = Mt(null, $t), nn = (rn.prototype._lock = function() {
			return v(!O.global), ++this._reculock, this._reculock !== 1 || O.global || (O.lockOwnerFor = this), this;
		}, rn.prototype._unlock = function() {
			if (v(!O.global), --this._reculock == 0) for (O.global || (O.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked();) {
				var e = this._blockedFuncs.shift();
				try {
					ft(e[1], e[0]);
				} catch {}
			}
			return this;
		}, rn.prototype._locked = function() {
			return this._reculock && O.lockOwnerFor !== this;
		}, rn.prototype.create = function(e) {
			var t = this;
			if (this.mode) {
				var n = this.db.idbdb, r = this.db._state.dbOpenError;
				if (v(!this.idbtrans), !e && !n) switch (r && r.name) {
					case "DatabaseClosedError": throw new w.DatabaseClosed(r);
					case "MissingAPIError": throw new w.MissingAPI(r.message, r);
					default: throw new w.OpenFailed(r);
				}
				if (!this.active) throw new w.TransactionInactive();
				v(this._completion._state === null), (e = this.idbtrans = e || (this.db.core || n).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = j(function(n) {
					Qt(n), t._reject(e.error);
				}), e.onabort = j(function(n) {
					Qt(n), t.active && t._reject(new w.Abort(e.error)), t.active = !1, t.on("abort").fire(n);
				}), e.oncomplete = j(function() {
					t.active = !1, t._resolve(), "mutatedParts" in e && tn.storagemutated.fire(e.mutatedParts);
				});
			}
			return this;
		}, rn.prototype._promise = function(e, t, n) {
			var r, i = this;
			return e === "readwrite" && this.mode !== "readwrite" ? F(new w.ReadOnly("Transaction is readonly")) : this.active ? this._locked() ? new k(function(r, a) {
				i._blockedFuncs.push([function() {
					i._promise(e, t, n).then(r, a);
				}, O]);
			}) : n ? N(function() {
				var e = new k(function(e, n) {
					i._lock();
					var r = t(e, n, i);
					r && r.then && r.then(e, n);
				});
				return e.finally(function() {
					return i._unlock();
				}), e._lib = !0, e;
			}) : ((r = new k(function(e, n) {
				var r = t(e, n, i);
				r && r.then && r.then(e, n);
			}))._lib = !0, r) : F(new w.TransactionInactive());
		}, rn.prototype._root = function() {
			return this.parent ? this.parent._root() : this;
		}, rn.prototype.waitFor = function(e) {
			var t, n = this._root(), r = k.resolve(e), i = (n._waitingFor ? n._waitingFor = n._waitingFor.then(function() {
				return r;
			}) : (n._waitingFor = r, n._waitingQueue = [], t = n.idbtrans.objectStore(n.storeNames[0]), function e() {
				for (++n._spinCount; n._waitingQueue.length;) n._waitingQueue.shift()();
				n._waitingFor && (t.get(-1 / 0).onsuccess = e);
			}()), n._waitingFor);
			return new k(function(e, t) {
				r.then(function(t) {
					return n._waitingQueue.push(j(e.bind(null, t)));
				}, function(e) {
					return n._waitingQueue.push(j(t.bind(null, e)));
				}).finally(function() {
					n._waitingFor === i && (n._waitingFor = null);
				});
			});
		}, rn.prototype.abort = function() {
			this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new w.Abort()));
		}, rn.prototype.table = function(e) {
			var t = this._memoizedTables ||= {};
			if (l(t, e)) return t[e];
			var n = this.schema[e];
			if (n) return (n = new this.db.Table(e, n, this)).core = this.db.core.table(e), t[e] = n;
			throw new w.NotFound("Table " + e + " not part of transaction");
		}, rn);
		function rn() {}
		function an(e, t, n, r, i, a, o, s) {
			return {
				name: e,
				keyPath: t,
				unique: n,
				multi: r,
				auto: i,
				compound: a,
				src: (n && !o ? "&" : "") + (r ? "*" : "") + (i ? "++" : "") + on(t),
				type: s
			};
		}
		function on(e) {
			return typeof e == "string" ? e : e ? "[" + [].join.call(e, "+") + "]" : "";
		}
		function sn(e, t, n) {
			return {
				name: e,
				primKey: t,
				indexes: n,
				mappedClass: null,
				idxByName: (r = function(e) {
					return [e.name, e];
				}, n.reduce(function(e, t, n) {
					return t = r(t, n), t && (e[t[0]] = t[1]), e;
				}, {}))
			};
			var r;
		}
		var cn = function(e) {
			try {
				return e.only([[]]), cn = function() {
					return [[]];
				}, [[]];
			} catch {
				return cn = function() {
					return ht;
				}, ht;
			}
		};
		function ln(e) {
			return e == null ? function() {} : typeof e == "string" ? (t = e).split(".").length === 1 ? function(e) {
				return e[t];
			} : function(e) {
				return b(e, t);
			} : function(t) {
				return b(t, e);
			};
			var t;
		}
		function un(e) {
			return [].slice.call(e);
		}
		var dn = 0;
		function fn(e) {
			return e == null ? ":id" : typeof e == "string" ? e : `[${e.join("+")}]`;
		}
		function B(e, t, n) {
			function r(e) {
				if (e.type === 3) return null;
				if (e.type === 4) throw Error("Cannot convert never type to IDBKeyRange");
				var n = e.lower, r = e.upper, i = e.lowerOpen, e = e.upperOpen;
				return n === void 0 ? r === void 0 ? null : t.upperBound(r, !!e) : r === void 0 ? t.lowerBound(n, !!i) : t.bound(n, r, !!i, !!e);
			}
			function i(e) {
				var t, n, i = e.name;
				return {
					name: i,
					schema: e,
					mutate: function(e) {
						var t = e.trans, n = e.type, a = e.keys, o = e.values, s = e.range;
						return new Promise(function(e, c) {
							e = j(e);
							var l = t.objectStore(i), u = l.keyPath == null, d = n === "put" || n === "add";
							if (!d && n !== "delete" && n !== "deleteRange") throw Error("Invalid operation type: " + n);
							var f, p = (a || o || { length: 1 }).length;
							if (a && o && a.length !== o.length) throw Error("Given keys array must have same length as given values array.");
							if (p === 0) return e({
								numFailures: 0,
								failures: {},
								results: [],
								lastResult: void 0
							});
							function m(e) {
								++_, Qt(e);
							}
							var h = [], g = [], _ = 0;
							if (n === "deleteRange") {
								if (s.type === 4) return e({
									numFailures: _,
									failures: g,
									results: [],
									lastResult: void 0
								});
								s.type === 3 ? h.push(f = l.clear()) : h.push(f = l.delete(r(s)));
							} else {
								var u = d ? u ? [o, a] : [o, null] : [a, null], v = u[0], y = u[1];
								if (d) for (var b = 0; b < p; ++b) h.push(f = y && y[b] !== void 0 ? l[n](v[b], y[b]) : l[n](v[b])), f.onerror = m;
								else for (b = 0; b < p; ++b) h.push(f = l[n](v[b])), f.onerror = m;
							}
							function x(t) {
								t = t.target.result, h.forEach(function(e, t) {
									return e.error != null && (g[t] = e.error);
								}), e({
									numFailures: _,
									failures: g,
									results: n === "delete" ? a : h.map(function(e) {
										return e.result;
									}),
									lastResult: t
								});
							}
							f.onerror = function(e) {
								m(e), x(e);
							}, f.onsuccess = x;
						});
					},
					getMany: function(e) {
						var t = e.trans, n = e.keys;
						return new Promise(function(e, r) {
							e = j(e);
							for (var a, o = t.objectStore(i), s = n.length, c = Array(s), l = 0, u = 0, d = function(t) {
								t = t.target, c[t._pos] = t.result, ++u === l && e(c);
							}, f = Zt(r), p = 0; p < s; ++p) n[p] != null && ((a = o.get(n[p]))._pos = p, a.onsuccess = d, a.onerror = f, ++l);
							l === 0 && e(c);
						});
					},
					get: function(e) {
						var t = e.trans, n = e.key;
						return new Promise(function(e, r) {
							e = j(e);
							var a = t.objectStore(i).get(n);
							a.onsuccess = function(t) {
								return e(t.target.result);
							}, a.onerror = Zt(r);
						});
					},
					query: (t = c, n = l, function(e) {
						return new Promise(function(a, o) {
							a = j(a);
							var s, c, l, u, d = e.trans, f = e.values, p = e.limit, m = e.query, h = (h = e.direction) ?? "next", g = p === 1 / 0 ? void 0 : p, _ = m.index, m = m.range, d = d.objectStore(i), d = _.isPrimaryKey ? d : d.index(_.name), _ = r(m);
							if (p === 0) return a({ result: [] });
							n ? (m = {
								query: _,
								count: g,
								direction: h
							}, (s = f ? d.getAll(m) : d.getAllKeys(m)).onsuccess = function(e) {
								return a({ result: e.target.result });
							}, s.onerror = Zt(o)) : t && h === "next" ? ((s = f ? d.getAll(_, g) : d.getAllKeys(_, g)).onsuccess = function(e) {
								return a({ result: e.target.result });
							}, s.onerror = Zt(o)) : (c = 0, l = !f && "openKeyCursor" in d ? d.openKeyCursor(_, h) : d.openCursor(_, h), u = [], l.onsuccess = function() {
								var e = l.result;
								return !e || (u.push(f ? e.value : e.primaryKey), ++c === p) ? a({ result: u }) : void e.continue();
							}, l.onerror = Zt(o));
						});
					}),
					openCursor: function(e) {
						var t = e.trans, n = e.values, a = e.query, o = e.reverse, s = e.unique;
						return new Promise(function(e, c) {
							e = j(e);
							var l = a.index, u = a.range, d = t.objectStore(i), d = l.isPrimaryKey ? d : d.index(l.name), l = o ? s ? "prevunique" : "prev" : s ? "nextunique" : "next", f = !n && "openKeyCursor" in d ? d.openKeyCursor(r(u), l) : d.openCursor(r(u), l);
							f.onerror = Zt(c), f.onsuccess = j(function(n) {
								var r, i, a, o, s = f.result;
								s ? (s.___id = ++dn, s.done = !1, r = s.continue.bind(s), i = (i = s.continuePrimaryKey) && i.bind(s), a = s.advance.bind(s), o = function() {
									throw Error("Cursor not stopped");
								}, s.trans = t, s.stop = s.continue = s.continuePrimaryKey = s.advance = function() {
									throw Error("Cursor not started");
								}, s.fail = j(c), s.next = function() {
									var e = this, t = 1;
									return this.start(function() {
										return t-- ? e.continue() : e.stop();
									}).then(function() {
										return e;
									});
								}, s.start = function(e) {
									function t() {
										if (f.result) try {
											e();
										} catch (e) {
											s.fail(e);
										}
										else s.done = !0, s.start = function() {
											throw Error("Cursor behind last entry");
										}, s.stop();
									}
									var n = new Promise(function(e, t) {
										e = j(e), f.onerror = Zt(t), s.fail = t, s.stop = function(t) {
											s.stop = s.continue = s.continuePrimaryKey = s.advance = o, e(t);
										};
									});
									return f.onsuccess = j(function(e) {
										f.onsuccess = t, t();
									}), s.continue = r, s.continuePrimaryKey = i, s.advance = a, t(), n;
								}, e(s)) : e(null);
							}, c);
						});
					},
					count: function(e) {
						var t = e.query, n = e.trans, a = t.index, o = t.range;
						return new Promise(function(e, t) {
							var s = n.objectStore(i), s = a.isPrimaryKey ? s : s.index(a.name), c = r(o), c = c ? s.count(c) : s.count();
							c.onsuccess = j(function(t) {
								return e(t.target.result);
							}), c.onerror = Zt(t);
						});
					}
				};
			}
			o = n, s = un((n = e).objectStoreNames), u = 0 < s.length ? o.objectStore(s[0]) : {};
			var o, n = {
				schema: {
					name: n.name,
					tables: s.map(function(e) {
						return o.objectStore(e);
					}).map(function(e) {
						var t = e.keyPath, n = e.autoIncrement, r = a(t), i = {}, r = {
							name: e.name,
							primaryKey: {
								name: null,
								isPrimaryKey: !0,
								outbound: t == null,
								compound: r,
								keyPath: t,
								autoIncrement: n,
								unique: !0,
								extractKey: ln(t)
							},
							indexes: un(e.indexNames).map(function(t) {
								return e.index(t);
							}).map(function(e) {
								var t = e.name, n = e.unique, r = e.multiEntry, e = e.keyPath, t = {
									name: t,
									compound: a(e),
									keyPath: e,
									unique: n,
									multiEntry: r,
									extractKey: ln(e)
								};
								return i[fn(e)] = t;
							}),
							getIndexByKeyPath: function(e) {
								return i[fn(e)];
							}
						};
						return i[":id"] = r.primaryKey, t != null && (i[fn(t)] = r.primaryKey), r;
					})
				},
				hasGetAll: 0 < s.length && "getAll" in u && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604),
				hasIdb3Features: "getAllRecords" in u
			}, s = n.schema, c = n.hasGetAll, l = n.hasIdb3Features, u = s.tables.map(i), d = {};
			return u.forEach(function(e) {
				return d[e.name] = e;
			}), {
				stack: "dbcore",
				transaction: e.transaction.bind(e),
				table: function(e) {
					if (d[e]) return d[e];
					throw Error(`Table '${e}' not found`);
				},
				MIN_KEY: -1 / 0,
				MAX_KEY: cn(t),
				schema: s
			};
		}
		function pn(e, n, r, i) {
			return r = r.IDBKeyRange, n = B(n, r, i), { dbcore: e.dbcore.reduce(function(e, n) {
				return n = n.create, t(t({}, e), n(e));
			}, n) };
		}
		function mn(e, t) {
			var n = t.db, n = pn(e._middlewares, n, e._deps, t);
			e.core = n.dbcore, e.tables.forEach(function(t) {
				var n = t.name;
				e.core.schema.tables.some(function(e) {
					return e.name === n;
				}) && (t.core = e.core.table(n), e[n] instanceof e.Table) && (e[n].core = t.core);
			});
		}
		function hn(e, t, n, r) {
			n.forEach(function(n) {
				var i = r[n];
				t.forEach(function(t) {
					var r = function e(t, n) {
						return m(t, n) || (t = s(t)) && e(t, n);
					}(t, n);
					(!r || "value" in r && r.value === void 0) && (t === e.Transaction.prototype || t instanceof e.Transaction ? f(t, n, {
						get: function() {
							return this.table(n);
						},
						set: function(e) {
							d(this, n, {
								value: e,
								writable: !0,
								configurable: !0,
								enumerable: !0
							});
						}
					}) : t[n] = new e.Table(n, i));
				});
			});
		}
		function gn(e, t) {
			t.forEach(function(t) {
				for (var n in t) t[n] instanceof e.Table && delete t[n];
			});
		}
		function _n(e, t) {
			return e._cfg.version - t._cfg.version;
		}
		function vn(e, t, n, r) {
			var a = e._dbSchema, o = (n.objectStoreNames.contains("$meta") && !a.$meta && (a.$meta = sn("$meta", En("")[0], []), e._storeNames.push("$meta")), e._createTransaction("readwrite", e._storeNames, a)), s = (o.create(n), o._completion.catch(r), o._reject.bind(o)), c = O.transless || O;
			N(function() {
				if (O.trans = o, O.transless = c, t !== 0) return mn(e, n), l = t, ((r = o).storeNames.includes("$meta") ? r.table("$meta").get("version").then(function(e) {
					return e ?? l;
				}) : k.resolve(l)).then(function(t) {
					var r = e, a = t, s = o, c = n, l = [], t = r._versions, u = r._dbSchema = wn(0, r.idbdb, c);
					return (t = t.filter(function(e) {
						return e._cfg.version >= a;
					})).length === 0 ? k.resolve() : (t.forEach(function(e) {
						l.push(function() {
							var t, n, o, l = u, d = e._cfg.dbschema, f = (Tn(r, l, c), Tn(r, d, c), u = r._dbSchema = d, bn(l, d)), p = (f.add.forEach(function(e) {
								xn(c, e[0], e[1].primKey, e[1].indexes);
							}), f.change.forEach(function(e) {
								if (e.recreate) throw new w.Upgrade("Not yet support for changing primary key");
								var t = c.objectStore(e.name);
								e.add.forEach(function(e) {
									return Cn(t, e);
								}), e.change.forEach(function(e) {
									t.deleteIndex(e.name), Cn(t, e);
								}), e.del.forEach(function(e) {
									return t.deleteIndex(e);
								});
							}), e._cfg.contentUpgrade);
							if (p && e._cfg.version > a) return mn(r, c), s._memoizedTables = {}, t = ee(d), f.del.forEach(function(e) {
								t[e] = l[e];
							}), gn(r, [r.Transaction.prototype]), hn(r, [r.Transaction.prototype], i(t), t), s.schema = t, (n = pe(p)) && st(), d = k.follow(function() {
								var e;
								(o = p(s)) && n && (e = ct.bind(null, null), o.then(e, e));
							}), o && typeof o.then == "function" ? k.resolve(o) : d.then(function() {
								return o;
							});
						}), l.push(function(t) {
							var n = e._cfg.dbschema, i = t;
							[].slice.call(i.db.objectStoreNames).forEach(function(e) {
								return n[e] == null && i.db.deleteObjectStore(e);
							}), gn(r, [r.Transaction.prototype]), hn(r, [r.Transaction.prototype], r._storeNames, r._dbSchema), s.schema = r._dbSchema;
						}), l.push(function(t) {
							r.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(r.idbdb.version / 10) === e._cfg.version ? (r.idbdb.deleteObjectStore("$meta"), delete r._dbSchema.$meta, r._storeNames = r._storeNames.filter(function(e) {
								return e !== "$meta";
							})) : t.objectStore("$meta").put(e._cfg.version, "version"));
						});
					}), function e() {
						return l.length ? k.resolve(l.shift()(s.idbtrans)).then(e) : k.resolve();
					}().then(function() {
						Sn(u, c);
					}));
				}).catch(s);
				var r, l;
				i(a).forEach(function(e) {
					xn(n, e, a[e].primKey, a[e].indexes);
				}), mn(e, n), k.follow(function() {
					return e.on.populate.fire(o);
				}).catch(s);
			});
		}
		function yn(e, t) {
			Sn(e._dbSchema, t), t.db.version % 10 != 0 || t.objectStoreNames.contains("$meta") || t.db.createObjectStore("$meta").add(Math.ceil(t.db.version / 10 - 1), "version");
			var n = wn(0, e.idbdb, t);
			Tn(e, e._dbSchema, t);
			for (var r = 0, i = bn(n, e._dbSchema).change; r < i.length; r++) {
				var a = ((e) => {
					if (e.change.length || e.recreate) return console.warn(`Unable to patch indexes of table ${e.name} because it has changes on the type of index or primary key.`), { value: void 0 };
					var n = t.objectStore(e.name);
					e.add.forEach(function(t) {
						ke && console.debug(`Dexie upgrade patch: Creating missing index ${e.name}.${t.src}`), Cn(n, t);
					});
				})(i[r]);
				if (typeof a == "object") return a.value;
			}
		}
		function bn(e, t) {
			var n, r = {
				del: [],
				add: [],
				change: []
			};
			for (n in e) t[n] || r.del.push(n);
			for (n in t) {
				var i = e[n], a = t[n];
				if (i) {
					var o = {
						name: n,
						def: a,
						recreate: !1,
						del: [],
						add: [],
						change: []
					};
					if ("" + (i.primKey.keyPath || "") != "" + (a.primKey.keyPath || "") || i.primKey.auto !== a.primKey.auto) o.recreate = !0, r.change.push(o);
					else {
						var s = i.idxByName, c = a.idxByName, l = void 0;
						for (l in s) c[l] || o.del.push(l);
						for (l in c) {
							var u = s[l], d = c[l];
							u ? u.src !== d.src && o.change.push(d) : o.add.push(d);
						}
						(0 < o.del.length || 0 < o.add.length || 0 < o.change.length) && r.change.push(o);
					}
				} else r.add.push([n, a]);
			}
			return r;
		}
		function xn(e, t, n, r) {
			var i = e.db.createObjectStore(t, n.keyPath ? {
				keyPath: n.keyPath,
				autoIncrement: n.auto
			} : { autoIncrement: n.auto });
			r.forEach(function(e) {
				return Cn(i, e);
			});
		}
		function Sn(e, t) {
			i(e).forEach(function(n) {
				t.db.objectStoreNames.contains(n) || (ke && console.debug("Dexie: Creating missing table", n), xn(t, n, e[n].primKey, e[n].indexes));
			});
		}
		function Cn(e, t) {
			e.createIndex(t.name, t.keyPath, {
				unique: t.unique,
				multiEntry: t.multi
			});
		}
		function wn(e, t, n) {
			var r = {};
			return g(t.objectStoreNames, 0).forEach(function(e) {
				for (var t = n.objectStore(e), i = an(on(c = t.keyPath), c || "", !0, !1, !!t.autoIncrement, c && typeof c != "string", !0), a = [], o = 0; o < t.indexNames.length; ++o) {
					var s = t.index(t.indexNames[o]), c = s.keyPath, s = an(s.name, c, !!s.unique, !!s.multiEntry, !1, c && typeof c != "string", !1);
					a.push(s);
				}
				r[e] = sn(e, i, a);
			}), r;
		}
		function Tn(e, t, n) {
			for (var i = n.db.objectStoreNames, a = 0; a < i.length; ++a) {
				var o = i[a], s = n.objectStore(o);
				e._hasGetAll = "getAll" in s;
				for (var c = 0; c < s.indexNames.length; ++c) {
					var l, u = s.indexNames[c], d = s.index(u).keyPath, d = typeof d == "string" ? d : "[" + g(d).join("+") + "]";
					t[o] && (l = t[o].idxByName[d]) && (l.name = u, delete t[o].idxByName[d], t[o].idxByName[u] = l);
				}
			}
			typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && r.WorkerGlobalScope && r instanceof r.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e._hasGetAll = !1);
		}
		function En(e) {
			return e.split(",").map(function(e, t) {
				var n = e.split(":"), r = (r = n[1])?.trim(), n = (e = n[0].trim()).replace(/([&*]|\+\+)/g, ""), i = /^\[/.test(n) ? n.match(/^\[(.*)\]$/)[1].split("+") : n;
				return an(n, i || null, /\&/.test(e), /\*/.test(e), /\+\+/.test(e), a(i), t === 0, r);
			});
		}
		On.prototype._createTableSchema = sn, On.prototype._parseIndexSyntax = En, On.prototype._parseStoresSpec = function(e, t) {
			var n = this;
			i(e).forEach(function(r) {
				if (e[r] !== null) {
					var i = n._parseIndexSyntax(e[r]), a = i.shift();
					if (!a) throw new w.Schema("Invalid schema for table " + r + ": " + e[r]);
					if (a.unique = !0, a.multi) throw new w.Schema("Primary key cannot be multiEntry*");
					i.forEach(function(e) {
						if (e.auto) throw new w.Schema("Only primary key can be marked as autoIncrement (++)");
						if (!e.keyPath) throw new w.Schema("Index must have a name and cannot be an empty string");
					}), a = n._createTableSchema(r, a, i), t[r] = a;
				}
			});
		}, On.prototype.stores = function(e) {
			var t = this.db, e = (this._cfg.storesSource = this._cfg.storesSource ? o(this._cfg.storesSource, e) : e, t._versions), n = {}, r = {};
			return e.forEach(function(e) {
				o(n, e._cfg.storesSource), r = e._cfg.dbschema = {}, e._parseStoresSpec(n, r);
			}), t._dbSchema = r, gn(t, [
				t._allTables,
				t,
				t.Transaction.prototype
			]), hn(t, [
				t._allTables,
				t,
				t.Transaction.prototype,
				this._cfg.tables
			], i(r), r), t._storeNames = i(r), this;
		}, On.prototype.upgrade = function(e) {
			return this._cfg.contentUpgrade = Oe(this._cfg.contentUpgrade || T, e), this;
		};
		var Dn = On;
		function On() {}
		var kn = (() => {
			var e, t, n;
			return typeof FinalizationRegistry < "u" && typeof WeakRef < "u" ? (e = /* @__PURE__ */ new Set(), t = new FinalizationRegistry(function(t) {
				e.delete(t);
			}), {
				toArray: function() {
					return Array.from(e).map(function(e) {
						return e.deref();
					}).filter(function(e) {
						return e !== void 0;
					});
				},
				add: function(n) {
					var r = new WeakRef(n._novip);
					e.add(r), t.register(n._novip, r, r), e.size > n._options.maxConnections && (r = e.values().next().value, e.delete(r), t.unregister(r));
				},
				remove: function(n) {
					if (n) for (var r = e.values(), i = r.next(); !i.done;) {
						var a = i.value;
						if (a.deref() === n._novip) return e.delete(a), void t.unregister(a);
						i = r.next();
					}
				}
			}) : (n = [], {
				toArray: function() {
					return n;
				},
				add: function(e) {
					n.push(e._novip);
				},
				remove: function(e) {
					e && (e = n.indexOf(e._novip)) !== -1 && n.splice(e, 1);
				}
			});
		})();
		function An(e, t) {
			var n = e._dbNamesDB;
			return n || (n = e._dbNamesDB = new fr(vt, {
				addons: [],
				indexedDB: e,
				IDBKeyRange: t
			})).version(1).stores({ dbnames: "name" }), n.table("dbnames");
		}
		function jn(e) {
			return e && typeof e.databases == "function";
		}
		function V(e) {
			return N(function() {
				return O.letThrough = !0, e();
			});
		}
		function Mn(e) {
			return !("from" in e);
		}
		var H = function(e, t) {
			var n;
			if (!this) return n = new H(), e && "d" in e && o(n, e), n;
			o(this, arguments.length ? {
				d: 1,
				from: e,
				to: 1 < arguments.length ? t : e
			} : { d: 0 });
		};
		function Nn(e, t, n) {
			var r = I(t, n);
			if (!isNaN(r)) {
				if (0 < r) throw RangeError();
				if (Mn(e)) return o(e, {
					from: t,
					to: n,
					d: 1
				});
				var r = e.l, i = e.r;
				if (I(n, e.from) < 0) return r ? Nn(r, t, n) : e.l = {
					from: t,
					to: n,
					d: 1,
					l: null,
					r: null
				}, In(e);
				if (0 < I(t, e.to)) return i ? Nn(i, t, n) : e.r = {
					from: t,
					to: n,
					d: 1,
					l: null,
					r: null
				}, In(e);
				I(t, e.from) < 0 && (e.from = t, e.l = null, e.d = i ? i.d + 1 : 1), 0 < I(n, e.to) && (e.to = n, e.r = null, e.d = e.l ? e.l.d + 1 : 1), t = !e.r, r && !e.l && Pn(e, r), i && t && Pn(e, i);
			}
		}
		function Pn(e, t) {
			Mn(t) || function e(t, n) {
				var r = n.from, i = n.l, a = n.r;
				Nn(t, r, n.to), i && e(t, i), a && e(t, a);
			}(e, t);
		}
		function U(e, t) {
			var n = Fn(t), r = n.next();
			if (!r.done) for (var i = r.value, a = Fn(e), o = a.next(i.from), s = o.value; !r.done && !o.done;) {
				if (I(s.from, i.to) <= 0 && 0 <= I(s.to, i.from)) return !0;
				I(i.from, s.from) < 0 ? i = (r = n.next(s.from)).value : s = (o = a.next(i.from)).value;
			}
			return !1;
		}
		function Fn(e) {
			var t = Mn(e) ? null : {
				s: 0,
				n: e
			};
			return { next: function(e) {
				for (var n = 0 < arguments.length; t;) switch (t.s) {
					case 0: if (t.s = 1, n) for (; t.n.l && I(e, t.n.from) < 0;) t = {
						up: t,
						n: t.n.l,
						s: 1
					};
					else for (; t.n.l;) t = {
						up: t,
						n: t.n.l,
						s: 1
					};
					case 1: if (t.s = 2, !n || I(e, t.n.to) <= 0) return {
						value: t.n,
						done: !1
					};
					case 2: if (t.n.r) {
						t.s = 3, t = {
							up: t,
							n: t.n.r,
							s: 0
						};
						continue;
					}
					case 3: t = t.up;
				}
				return { done: !0 };
			} };
		}
		function In(e) {
			var n, r, i, a = ((a = e.r)?.d || 0) - ((a = e.l)?.d || 0), a = 1 < a ? "r" : a < -1 ? "l" : "";
			a && (n = a == "r" ? "l" : "r", r = t({}, e), i = e[a], e.from = i.from, e.to = i.to, e[a] = i[a], r[a] = i[n], (e[n] = r).d = Ln(r)), e.d = Ln(e);
		}
		function Ln(e) {
			var t = e.r, e = e.l;
			return (t ? e ? Math.max(t.d, e.d) : t.d : e ? e.d : 0) + 1;
		}
		function Rn(e, t) {
			return i(t).forEach(function(n) {
				e[n] ? Pn(e[n], t[n]) : e[n] = function e(t) {
					var n, r, i = {};
					for (n in t) l(t, n) && (r = t[n], i[n] = !r || typeof r != "object" || ie.has(r.constructor) ? r : e(r));
					return i;
				}(t[n]);
			}), e;
		}
		function zn(e, t) {
			return e.all || t.all || Object.keys(e).some(function(n) {
				return t[n] && U(t[n], e[n]);
			});
		}
		u(H.prototype, ((me = {
			add: function(e) {
				return Pn(this, e), this;
			},
			addKey: function(e) {
				return Nn(this, e, e), this;
			},
			addKeys: function(e) {
				var t = this;
				return e.forEach(function(e) {
					return Nn(t, e, e);
				}), this;
			},
			hasKey: function(e) {
				var t = Fn(this).next(e).value;
				return t && I(t.from, e) <= 0 && 0 <= I(t.to, e);
			}
		})[le] = function() {
			return Fn(this);
		}, me));
		var Bn = {}, Vn = {}, Hn = !1;
		function Un(e) {
			Rn(Vn, e), Hn || (Hn = !0, setTimeout(function() {
				Hn = !1, Wn(Vn, !(Vn = {}));
			}, 0));
		}
		function Wn(e, t) {
			t === void 0 && (t = !1);
			var n = /* @__PURE__ */ new Set();
			if (e.all) for (var r = 0, i = Object.values(Bn); r < i.length; r++) Gn(s = i[r], e, n, t);
			else for (var a in e) {
				var o, s, a = /^idb\:\/\/(.*)\/(.*)\//.exec(a);
				a && (o = a[1], a = a[2], s = Bn[`idb://${o}/${a}`]) && Gn(s, e, n, t);
			}
			n.forEach(function(e) {
				return e();
			});
		}
		function Gn(e, t, n, r) {
			for (var i = [], a = 0, o = Object.entries(e.queries.query); a < o.length; a++) {
				for (var s = o[a], c = s[0], l = [], u = 0, d = s[1]; u < d.length; u++) {
					var f = d[u];
					zn(t, f.obsSet) ? f.subscribers.forEach(function(e) {
						return n.add(e);
					}) : r && l.push(f);
				}
				r && i.push([c, l]);
			}
			if (r) for (var p = 0, m = i; p < m.length; p++) {
				var h = m[p], c = h[0], l = h[1];
				e.queries.query[c] = l;
			}
		}
		function Kn(e) {
			var t = e._state, n = e._deps.indexedDB;
			if (t.isBeingOpened || e.idbdb) return t.dbReadyPromise.then(function() {
				return t.dbOpenError ? F(t.dbOpenError) : e;
			});
			t.isBeingOpened = !0, t.dbOpenError = null, t.openComplete = !1;
			var r = t.openCanceller, a = Math.round(10 * e.verno), o = !1;
			function s() {
				if (t.openCanceller !== r) throw new w.DatabaseClosed("db.open() was cancelled");
			}
			function c() {
				return new k(function(r, l) {
					if (s(), !n) throw new w.MissingAPI();
					var u = e.name, p = t.autoSchema || !a ? n.open(u) : n.open(u, a);
					if (!p) throw new w.MissingAPI();
					p.onerror = Zt(l), p.onblocked = j(e._fireOnBlocked), p.onupgradeneeded = j(function(r) {
						var i;
						d = p.transaction, t.autoSchema && !e._options.allowEmptyDB ? (p.onerror = Qt, d.abort(), p.result.close(), (i = n.deleteDatabase(u)).onsuccess = i.onerror = j(function() {
							l(new w.NoSuchDatabase(`Database ${u} doesnt exist`));
						})) : (d.onerror = Zt(l), i = r.oldVersion > 2 ** 62 ? 0 : r.oldVersion, f = i < 1, e.idbdb = p.result, o && yn(e, d), vn(e, i / 10, d, l));
					}, l), p.onsuccess = j(function() {
						d = null;
						var n, s, l, m, h, _, v = e.idbdb = p.result, y = g(v.objectStoreNames);
						if (0 < y.length) try {
							var b = v.transaction((h = y).length === 1 ? h[0] : h, "readonly");
							if (t.autoSchema) _ = v, m = b, (l = e).verno = _.version / 10, m = l._dbSchema = wn(0, _, m), l._storeNames = g(_.objectStoreNames, 0), hn(l, [l._allTables], i(m), m);
							else if (Tn(e, e._dbSchema, b), s = b, ((s = bn(wn(0, (n = e).idbdb, s), n._dbSchema)).add.length || s.change.some(function(e) {
								return e.add.length || e.change.length;
							})) && !o) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), v.close(), a = v.version + 1, o = !0, r(c());
							mn(e, b);
						} catch {}
						kn.add(e), v.onversionchange = j(function(n) {
							t.vcFired = !0, e.on("versionchange").fire(n);
						}), v.onclose = j(function() {
							e.close({ disableAutoOpen: !1 });
						}), f && (y = e._deps, h = u, jn(_ = y.indexedDB) || h === vt || An(_, y.IDBKeyRange).put({ name: h }).catch(T)), r();
					}, l);
				}).catch(function(e) {
					switch (e?.name) {
						case "UnknownError":
							if (0 < t.PR1398_maxLoop) return t.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), c();
							break;
						case "VersionError": if (0 < a) return a = 0, c();
					}
					return k.reject(e);
				});
			}
			var l, u = t.dbReadyResolve, d = null, f = !1;
			return k.race([r, (typeof navigator > "u" ? k.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(e) {
				function t() {
					return indexedDB.databases().finally(e);
				}
				l = setInterval(t, 100), t();
			}).finally(function() {
				return clearInterval(l);
			}) : Promise.resolve()).then(c)]).then(function() {
				return s(), t.onReadyBeingFired = [], k.resolve(V(function() {
					return e.on.ready.fire(e.vip);
				})).then(function n() {
					var r;
					if (0 < t.onReadyBeingFired.length) return r = t.onReadyBeingFired.reduce(Oe, T), t.onReadyBeingFired = [], k.resolve(V(function() {
						return r(e.vip);
					})).then(n);
				});
			}).finally(function() {
				t.openCanceller === r && (t.onReadyBeingFired = null, t.isBeingOpened = !1);
			}).catch(function(n) {
				t.dbOpenError = n;
				try {
					d && d.abort();
				} catch {}
				return r === t.openCanceller && e._close(), F(n);
			}).finally(function() {
				t.openComplete = !0, u();
			}).then(function() {
				var t;
				return f && (t = {}, e.tables.forEach(function(n) {
					n.schema.indexes.forEach(function(r) {
						r.name && (t[`idb://${e.name}/${n.name}/${r.name}`] = new H(-1 / 0, [[[]]]));
					}), t[`idb://${e.name}/${n.name}/`] = t[`idb://${e.name}/${n.name}/:dels`] = new H(-1 / 0, [[[]]]);
				}), tn($t).fire(t), Wn(t, !0)), e;
			});
		}
		function qn(e) {
			function t(t) {
				return e.next(t);
			}
			var n = i(t), r = i(function(t) {
				return e.throw(t);
			});
			function i(e) {
				return function(t) {
					var t = e(t), i = t.value;
					return t.done ? i : i && typeof i.then == "function" ? i.then(n, r) : a(i) ? Promise.all(i).then(n, r) : n(i);
				};
			}
			return i(t)();
		}
		function Jn(e, t, n) {
			for (var r = a(e) ? e.slice() : [e], i = 0; i < n; ++i) r.push(t);
			return r;
		}
		var Yn = {
			stack: "dbcore",
			name: "VirtualIndexMiddleware",
			level: 1,
			create: function(e) {
				return t(t({}, e), { table: function(n) {
					var r = e.table(n), n = r.schema, i = Object.create(null), a = [];
					function o(e, n, r) {
						var s = fn(e), c = i[s] = i[s] || [], l = e == null ? 0 : typeof e == "string" ? 1 : e.length, u = 0 < n, s = t(t({}, r), {
							name: u ? `${s}(virtual-from:${r.name})` : r.name,
							lowLevelIndex: r,
							isVirtual: u,
							keyTail: n,
							keyLength: l,
							extractKey: ln(e),
							unique: !u && r.unique
						});
						return c.push(s), s.isPrimaryKey || a.push(s), 1 < l && o(l === 2 ? e[0] : e.slice(0, l - 1), n + 1, r), c.sort(function(e, t) {
							return e.keyTail - t.keyTail;
						}), s;
					}
					var s = o(n.primaryKey.keyPath, 0, n.primaryKey);
					i[":id"] = [s];
					for (var c = 0, l = n.indexes; c < l.length; c++) {
						var u = l[c];
						o(u.keyPath, 0, u);
					}
					function d(n) {
						var r, i = n.query.index;
						return i.isVirtual ? t(t({}, n), { query: {
							index: i.lowLevelIndex,
							range: (r = n.query.range, i = i.keyTail, {
								type: r.type === 1 ? 2 : r.type,
								lower: Jn(r.lower, r.lowerOpen ? e.MAX_KEY : e.MIN_KEY, i),
								lowerOpen: !0,
								upper: Jn(r.upper, r.upperOpen ? e.MIN_KEY : e.MAX_KEY, i),
								upperOpen: !0
							})
						} }) : n;
					}
					return t(t({}, r), {
						schema: t(t({}, n), {
							primaryKey: s,
							indexes: a,
							getIndexByKeyPath: function(e) {
								return (e = i[fn(e)]) && e[0];
							}
						}),
						count: function(e) {
							return r.count(d(e));
						},
						query: function(e) {
							return r.query(d(e));
						},
						openCursor: function(t) {
							var n = t.query.index, i = n.keyTail, a = n.keyLength;
							return n.isVirtual ? r.openCursor(d(t)).then(function(e) {
								return e && o(e);
							}) : r.openCursor(t);
							function o(n) {
								return Object.create(n, {
									continue: { value: function(r) {
										r == null ? t.unique ? n.continue(n.key.slice(0, a).concat(t.reverse ? e.MIN_KEY : e.MAX_KEY, i)) : n.continue() : n.continue(Jn(r, t.reverse ? e.MAX_KEY : e.MIN_KEY, i));
									} },
									continuePrimaryKey: { value: function(t, r) {
										n.continuePrimaryKey(Jn(t, e.MAX_KEY, i), r);
									} },
									primaryKey: { get: function() {
										return n.primaryKey;
									} },
									key: { get: function() {
										var e = n.key;
										return a === 1 ? e[0] : e.slice(0, a);
									} },
									value: { get: function() {
										return n.value;
									} }
								});
							}
						}
					});
				} });
			}
		};
		function Xn(e, t, n, r) {
			return n ||= {}, r ||= "", i(e).forEach(function(i) {
				var a, o, s;
				l(t, i) ? (a = e[i], o = t[i], typeof a == "object" && typeof o == "object" && a && o ? (s = ce(a)) === ce(o) ? s === "Object" ? Xn(a, o, n, r + i + ".") : a !== o && (n[r + i] = t[i]) : n[r + i] = t[i] : a !== o && (n[r + i] = t[i])) : n[r + i] = void 0;
			}), i(t).forEach(function(i) {
				l(e, i) || (n[r + i] = t[i]);
			}), n;
		}
		function Zn(e, t) {
			return t.type === "delete" ? t.keys : t.keys || t.values.map(e.extractKey);
		}
		var Qn = {
			stack: "dbcore",
			name: "HooksMiddleware",
			level: 2,
			create: function(e) {
				return t(t({}, e), { table: function(r) {
					var i = e.table(r), a = i.schema.primaryKey;
					return t(t({}, i), { mutate: function(e) {
						var o = O.trans, s = o.table(r).hook, c = s.deleting, u = s.creating, d = s.updating;
						switch (e.type) {
							case "add":
								if (u.fire === T) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "put":
								if (u.fire === T && d.fire === T) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "delete":
								if (c.fire === T) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "deleteRange":
								if (c.fire === T) break;
								return o._promise("readwrite", function() {
									return function e(n, r, o) {
										return i.query({
											trans: n,
											values: !1,
											query: {
												index: a,
												range: r
											},
											limit: o
										}).then(function(i) {
											var a = i.result;
											return f({
												type: "delete",
												keys: a,
												trans: n
											}).then(function(i) {
												return 0 < i.numFailures ? Promise.reject(i.failures[0]) : a.length < o ? {
													failures: [],
													numFailures: 0,
													lastResult: void 0
												} : e(n, t(t({}, r), {
													lower: a[a.length - 1],
													lowerOpen: !0
												}), o);
											});
										});
									}(e.trans, e.range, 1e4);
								}, !0);
						}
						return i.mutate(e);
						function f(e) {
							var r, o, s, f = O.trans, p = e.keys || Zn(a, e);
							if (p) return (e = e.type === "add" || e.type === "put" ? t(t({}, e), { keys: p }) : t({}, e)).type !== "delete" && (e.values = n([], e.values, !0)), e.keys && (e.keys = n([], e.keys, !0)), r = i, s = p, ((o = e).type === "add" ? Promise.resolve([]) : r.getMany({
								trans: o.trans,
								keys: s,
								cache: "immutable"
							})).then(function(t) {
								var n = p.map(function(n, r) {
									var i, o, s, p = t[r], m = {
										onerror: null,
										onsuccess: null
									};
									return e.type === "delete" ? c.fire.call(m, n, p, f) : e.type === "add" || p === void 0 ? (i = u.fire.call(m, n, e.values[r], f), n == null && i != null && (e.keys[r] = n = i, a.outbound || x(e.values[r], a.keyPath, n))) : (i = Xn(p, e.values[r]), (o = d.fire.call(m, i, n, p, f)) && (s = e.values[r], Object.keys(o).forEach(function(e) {
										l(s, e) ? s[e] = o[e] : x(s, e, o[e]);
									}))), m;
								});
								return i.mutate(e).then(function(r) {
									for (var i = r.failures, a = r.results, o = r.numFailures, r = r.lastResult, s = 0; s < p.length; ++s) {
										var c = (a || p)[s], l = n[s];
										c == null ? l.onerror && l.onerror(i[s]) : l.onsuccess && l.onsuccess(e.type === "put" && t[s] ? e.values[s] : c);
									}
									return {
										failures: i,
										results: a,
										numFailures: o,
										lastResult: r
									};
								}).catch(function(e) {
									return n.forEach(function(t) {
										return t.onerror && t.onerror(e);
									}), Promise.reject(e);
								});
							});
							throw Error("Keys missing");
						}
					} });
				} });
			}
		};
		function $n(e, t, n) {
			try {
				if (!t || t.keys.length < e.length) return null;
				for (var r = [], i = 0, a = 0; i < t.keys.length && a < e.length; ++i) I(t.keys[i], e[a]) === 0 && (r.push(n ? oe(t.values[i]) : t.values[i]), ++a);
				return r.length === e.length ? r : null;
			} catch {
				return null;
			}
		}
		var er = {
			stack: "dbcore",
			level: -1,
			create: function(e) {
				return { table: function(n) {
					var r = e.table(n);
					return t(t({}, r), {
						getMany: function(e) {
							var t;
							return e.cache ? (t = $n(e.keys, e.trans._cache, e.cache === "clone")) ? k.resolve(t) : r.getMany(e).then(function(t) {
								return e.trans._cache = {
									keys: e.keys,
									values: e.cache === "clone" ? oe(t) : t
								}, t;
							}) : r.getMany(e);
						},
						mutate: function(e) {
							return e.type !== "add" && (e.trans._cache = null), r.mutate(e);
						}
					});
				} };
			}
		};
		function tr(e, t) {
			return e.trans.mode === "readonly" && !!e.subscr && !e.trans.explicit && e.trans.db._options.cache !== "disabled" && !t.schema.primaryKey.outbound;
		}
		function nr(e, t) {
			switch (e) {
				case "query": return t.values && !t.unique;
				case "get":
				case "getMany":
				case "count":
				case "openCursor": return !1;
			}
		}
		var rr = {
			stack: "dbcore",
			level: 0,
			name: "Observability",
			create: function(e) {
				var n = e.schema.name, r = new H(e.MIN_KEY, e.MAX_KEY);
				return t(t({}, e), {
					transaction: function(t, n, r) {
						if (O.subscr && n !== "readonly") throw new w.ReadOnly(`Readwrite transaction in liveQuery context. Querier source: ${O.querier}`);
						return e.transaction(t, n, r);
					},
					table: function(o) {
						function s(t) {
							var t = t.query;
							return [t.index, new H((t = t.range).lower ?? e.MIN_KEY, t.upper ?? e.MAX_KEY)];
						}
						var c = e.table(o), l = c.schema, u = l.primaryKey, d = l.indexes, f = u.extractKey, p = u.outbound, m = u.autoIncrement && d.filter(function(e) {
							return e.compound && e.keyPath.includes(u.keyPath);
						}), h = t(t({}, c), { mutate: function(t) {
							function i(e) {
								return e = `idb://${n}/${o}/${e}`, h[e] || (h[e] = new H());
							}
							var s, d, f, p = t.trans, h = t.mutatedParts ||= {}, g = i(""), _ = i(":dels"), v = t.type, y = t.type === "deleteRange" ? [t.range] : t.type === "delete" ? [t.keys] : t.values.length < 50 ? [Zn(u, t).filter(function(e) {
								return e;
							}), t.values] : [], b = y[0], y = y[1], x = t.trans._cache;
							return a(b) ? (g.addKeys(b), (v = v === "delete" || b.length === y.length ? $n(b, x) : null) || _.addKeys(b), (v || y) && (s = i, d = v, f = y, l.indexes.forEach(function(e) {
								var t = s(e.name || "");
								function n(t) {
									return t == null ? null : e.extractKey(t);
								}
								function r(n) {
									e.multiEntry && a(n) ? n.forEach(function(e) {
										return t.addKey(e);
									}) : t.addKey(n);
								}
								(d || f).forEach(function(e, t) {
									var i = d && n(d[t]), t = f && n(f[t]);
									I(i, t) !== 0 && (i != null && r(i), t != null) && r(t);
								});
							}))) : b ? (y = {
								from: (x = b.lower) ?? e.MIN_KEY,
								to: (v = b.upper) ?? e.MAX_KEY
							}, _.add(y), g.add(y)) : (g.add(r), _.add(r), l.indexes.forEach(function(e) {
								return i(e.name).add(r);
							})), c.mutate(t).then(function(e) {
								return !b || t.type !== "add" && t.type !== "put" || (g.addKeys(e.results), m && m.forEach(function(n) {
									for (var r = t.values.map(function(e) {
										return n.extractKey(e);
									}), a = n.keyPath.findIndex(function(e) {
										return e === u.keyPath;
									}), o = 0, s = e.results.length; o < s; ++o) r[o][a] = e.results[o];
									i(n.name).addKeys(r);
								})), p.mutatedParts = Rn(p.mutatedParts || {}, h), e;
							});
						} }), g = {
							get: function(e) {
								return [u, new H(e.key)];
							},
							getMany: function(e) {
								return [u, new H().addKeys(e.keys)];
							},
							count: s,
							query: s,
							openCursor: s
						};
						return i(g).forEach(function(e) {
							h[e] = function(i) {
								var a = O.subscr, s = !!a, l = tr(O, c) && nr(e, i) ? i.obsSet = {} : a;
								if (s) {
									var u, a = function(e) {
										return e = `idb://${n}/${o}/${e}`, l[e] || (l[e] = new H());
									}, d = a(""), m = a(":dels"), s = g[e](i), h = s[0], s = s[1];
									if ((e === "query" && h.isPrimaryKey && !i.values ? m : a(h.name || "")).add(s), !h.isPrimaryKey) {
										if (e !== "count") return u = e === "query" && p && i.values && c.query(t(t({}, i), { values: !1 })), c[e].apply(this, arguments).then(function(t) {
											if (e === "query") {
												if (p && i.values) return u.then(function(e) {
													return e = e.result, d.addKeys(e), t;
												});
												var n = i.values ? t.result.map(f) : t.result;
												(i.values ? d : m).addKeys(n);
											} else {
												var r, a;
												if (e === "openCursor") return a = i.values, (r = t) && Object.create(r, {
													key: { get: function() {
														return m.addKey(r.primaryKey), r.key;
													} },
													primaryKey: { get: function() {
														var e = r.primaryKey;
														return m.addKey(e), e;
													} },
													value: { get: function() {
														return a && d.addKey(r.primaryKey), r.value;
													} }
												});
											}
											return t;
										});
										m.add(r);
									}
								}
								return c[e].apply(this, arguments);
							};
						}), h;
					}
				});
			}
		};
		function ir(e, n, r) {
			var i;
			return r.numFailures === 0 ? n : n.type === "deleteRange" || (i = n.keys ? n.keys.length : "values" in n && n.values ? n.values.length : 1, r.numFailures === i) ? null : (i = t({}, n), a(i.keys) && (i.keys = i.keys.filter(function(e, t) {
				return !(t in r.failures);
			})), "values" in i && a(i.values) && (i.values = i.values.filter(function(e, t) {
				return !(t in r.failures);
			})), i);
		}
		function ar(e, t) {
			return n = e, ((r = t).lower === void 0 || (r.lowerOpen ? 0 < I(n, r.lower) : 0 <= I(n, r.lower))) && (n = e, (r = t).upper === void 0 || (r.upperOpen ? I(n, r.upper) < 0 : I(n, r.upper) <= 0));
			var n, r;
		}
		function or(e, t, n, r, i, o) {
			var s, c, l, u, d, f, p;
			return !n || n.length === 0 || (s = t.query.index, c = s.multiEntry, l = t.query.range, u = r.schema.primaryKey.extractKey, d = s.extractKey, f = (s.lowLevelIndex || s).extractKey, (r = n.reduce(function(e, n) {
				var r = e, i = [];
				if (n.type === "add" || n.type === "put") for (var o = new H(), s = n.values.length - 1; 0 <= s; --s) {
					var f, p = n.values[s], m = u(p);
					!o.hasKey(m) && (f = d(p), c && a(f) ? f.some(function(e) {
						return ar(e, l);
					}) : ar(f, l)) && (o.addKey(m), i.push(p));
				}
				switch (n.type) {
					case "add":
						var h = new H().addKeys(t.values ? e.map(function(e) {
							return u(e);
						}) : e), r = e.concat(t.values ? i.filter(function(e) {
							return e = u(e), !h.hasKey(e) && (h.addKey(e), !0);
						}) : i.map(function(e) {
							return u(e);
						}).filter(function(e) {
							return !h.hasKey(e) && (h.addKey(e), !0);
						}));
						break;
					case "put":
						var g = new H().addKeys(n.values.map(function(e) {
							return u(e);
						}));
						r = e.filter(function(e) {
							return !g.hasKey(t.values ? u(e) : e);
						}).concat(t.values ? i : i.map(function(e) {
							return u(e);
						}));
						break;
					case "delete":
						var _ = new H().addKeys(n.keys);
						r = e.filter(function(e) {
							return !_.hasKey(t.values ? u(e) : e);
						});
						break;
					case "deleteRange":
						var v = n.range;
						r = e.filter(function(e) {
							return !ar(u(e), v);
						});
				}
				return r;
			}, e)) === e) ? e : (p = function(e, t) {
				return I(f(e), f(t)) || I(u(e), u(t));
			}, r.sort(t.direction === "prev" || t.direction === "prevunique" ? function(e, t) {
				return p(t, e);
			} : p), t.limit && t.limit < 1 / 0 && (r.length > t.limit ? r.length = t.limit : e.length === t.limit && r.length < t.limit && (i.dirty = !0)), o ? Object.freeze(r) : r);
		}
		function sr(e, t) {
			return I(e.lower, t.lower) === 0 && I(e.upper, t.upper) === 0 && !!e.lowerOpen == !!t.lowerOpen && !!e.upperOpen == !!t.upperOpen;
		}
		function cr(e, t) {
			return ((e, t, n, r) => {
				if (e === void 0) return t === void 0 ? 0 : -1;
				if (t === void 0) return 1;
				if ((e = I(e, t)) === 0) {
					if (n && r) return 0;
					if (n) return 1;
					if (r) return -1;
				}
				return e;
			})(e.lower, t.lower, e.lowerOpen, t.lowerOpen) <= 0 && 0 <= ((e, t, n, r) => {
				if (e === void 0) return t === void 0 ? 0 : 1;
				if (t === void 0) return -1;
				if ((e = I(e, t)) === 0) {
					if (n && r) return 0;
					if (n) return -1;
					if (r) return 1;
				}
				return e;
			})(e.upper, t.upper, e.upperOpen, t.upperOpen);
		}
		function lr(e, t, n, r) {
			e.subscribers.add(n), r.addEventListener("abort", function() {
				var r, i;
				e.subscribers.delete(n), e.subscribers.size === 0 && (r = e, i = t, setTimeout(function() {
					r.subscribers.size === 0 && de(i, r);
				}, 3e3));
			});
		}
		var ur = {
			stack: "dbcore",
			level: 0,
			name: "Cache",
			create: function(e) {
				var n = e.schema.name;
				return t(t({}, e), {
					transaction: function(t, r, i) {
						var a, o, s = e.transaction(t, r, i);
						return r === "readwrite" && (i = (a = new AbortController()).signal, s.addEventListener("abort", (o = function(i) {
							return function() {
								if (a.abort(), r === "readwrite") {
									for (var o = /* @__PURE__ */ new Set(), c = 0, l = t; c < l.length; c++) {
										var u = l[c], d = Bn[`idb://${n}/${u}`];
										if (d) {
											var f = e.table(u), p = d.optimisticOps.filter(function(e) {
												return e.trans === s;
											});
											if (s._explicit && i && s.mutatedParts) for (var m = 0, h = Object.values(d.queries.query); m < h.length; m++) for (var g = 0, _ = (b = h[m]).slice(); g < _.length; g++) zn((x = _[g]).obsSet, s.mutatedParts) && (de(b, x), x.subscribers.forEach(function(e) {
												return o.add(e);
											}));
											else if (0 < p.length) {
												d.optimisticOps = d.optimisticOps.filter(function(e) {
													return e.trans !== s;
												});
												for (var v = 0, y = Object.values(d.queries.query); v < y.length; v++) for (var b, x, ee, te = 0, ne = (b = y[v]).slice(); te < ne.length; te++) (x = ne[te]).res != null && s.mutatedParts && (i && !x.dirty ? (ee = Object.isFrozen(x.res), ee = or(x.res, x.req, p, f, x, ee), x.dirty ? (de(b, x), x.subscribers.forEach(function(e) {
													return o.add(e);
												})) : ee !== x.res && (x.res = ee, x.promise = k.resolve({ result: ee }))) : (x.dirty && de(b, x), x.subscribers.forEach(function(e) {
													return o.add(e);
												})));
											}
										}
									}
									o.forEach(function(e) {
										return e();
									});
								}
							};
						})(!1), { signal: i }), s.addEventListener("error", o(!1), { signal: i }), s.addEventListener("complete", o(!0), { signal: i })), s;
					},
					table: function(r) {
						var i = e.table(r), a = i.schema.primaryKey;
						return t(t({}, i), {
							mutate: function(e) {
								var o, s = O.trans;
								return !a.outbound && s.db._options.cache !== "disabled" && !s.explicit && s.idbtrans.mode === "readwrite" && (o = Bn[`idb://${n}/${r}`]) ? (s = i.mutate(e), e.type !== "add" && e.type !== "put" || !(50 <= e.values.length || Zn(a, e).some(function(e) {
									return e == null;
								})) ? (o.optimisticOps.push(e), e.mutatedParts && Un(e.mutatedParts), s.then(function(t) {
									0 < t.numFailures && (de(o.optimisticOps, e), (t = ir(0, e, t)) && o.optimisticOps.push(t), e.mutatedParts) && Un(e.mutatedParts);
								}), s.catch(function() {
									de(o.optimisticOps, e), e.mutatedParts && Un(e.mutatedParts);
								})) : s.then(function(n) {
									var r = ir(0, t(t({}, e), { values: e.values.map(function(e, r) {
										var i;
										return n.failures[r] ? e : (x(i = (i = a.keyPath) != null && i.includes(".") ? oe(e) : t({}, e), a.keyPath, n.results[r]), i);
									}) }), n);
									o.optimisticOps.push(r), queueMicrotask(function() {
										return e.mutatedParts && Un(e.mutatedParts);
									});
								}), s) : i.mutate(e);
							},
							query: function(e) {
								var t, a, o, s, c, l, u;
								return tr(O, i) && nr("query", e) ? (t = (o = O.trans)?.db._options.cache === "immutable", a = (o = O).requery, o = o.signal, l = ((e, t, n, r) => {
									var i = Bn[`idb://${e}/${t}`];
									if (!i) return [];
									if (!(e = i.queries[n])) return [
										null,
										!1,
										i,
										null
									];
									var a = e[(r.query ? r.query.index.name : null) || ""];
									if (!a) return [
										null,
										!1,
										i,
										null
									];
									switch (n) {
										case "query":
											var o = (s = r.direction) ?? "next", s = a.find(function(e) {
												return e.req.limit === r.limit && e.req.values === r.values && (e.req.direction ?? "next") === o && sr(e.req.query.range, r.query.range);
											});
											return s ? [
												s,
												!0,
												i,
												a
											] : [
												a.find(function(e) {
													return ("limit" in e.req ? e.req.limit : 1 / 0) >= r.limit && (e.req.direction ?? "next") === o && (!r.values || e.req.values) && cr(e.req.query.range, r.query.range);
												}),
												!1,
												i,
												a
											];
										case "count": return s = a.find(function(e) {
											return sr(e.req.query.range, r.query.range);
										}), [
											s,
											!!s,
											i,
											a
										];
									}
								})(n, r, "query", e), u = l[0], s = l[2], c = l[3], u && l[1] ? u.obsSet = e.obsSet : (l = i.query(e).then(function(e) {
									var n = e.result;
									if (u && (u.res = n), t) {
										for (var r = 0, i = n.length; r < i; ++r) Object.freeze(n[r]);
										Object.freeze(n);
									}
									return e;
								}).catch(function(e) {
									return c && u && de(c, u), Promise.reject(e);
								}), u = {
									obsSet: e.obsSet,
									promise: l,
									subscribers: /* @__PURE__ */ new Set(),
									type: "query",
									req: e,
									dirty: !1
								}, c ? c.push(u) : (c = [u], (s ||= Bn[`idb://${n}/${r}`] = {
									queries: {
										query: {},
										count: {}
									},
									objs: /* @__PURE__ */ new Map(),
									optimisticOps: [],
									unsignaledParts: {}
								}).queries.query[e.query.index.name || ""] = c)), lr(u, c, a, o), u.promise.then(function(n) {
									return n = or(n.result, e, s?.optimisticOps, i, u, t), { result: t ? n : oe(n) };
								})) : i.query(e);
							}
						});
					}
				});
			}
		};
		function dr(e, t) {
			return new Proxy(e, { get: function(e, n, r) {
				return n === "db" ? t : Reflect.get(e, n, r);
			} });
		}
		W.prototype.version = function(e) {
			if (isNaN(e) || e < .1) throw new w.Type("Given version is not a positive number");
			if (e = Math.round(10 * e) / 10, this.idbdb || this._state.isBeingOpened) throw new w.Schema("Cannot add version when database is open");
			this.verno = Math.max(this.verno, e);
			var t = this._versions, n = t.filter(function(t) {
				return t._cfg.version === e;
			})[0];
			return n || (n = new this.Version(e), t.push(n), t.sort(_n), n.stores({}), this._state.autoSchema = !1), n;
		}, W.prototype._whenReady = function(e) {
			var t = this;
			return this.idbdb && (this._state.openComplete || O.letThrough || this._vip) ? e() : new k(function(e, n) {
				if (t._state.openComplete) return n(new w.DatabaseClosed(t._state.dbOpenError));
				if (!t._state.isBeingOpened) {
					if (!t._state.autoOpen) return void n(new w.DatabaseClosed());
					t.open().catch(T);
				}
				t._state.dbReadyPromise.then(e, n);
			}).then(e);
		}, W.prototype.use = function(e) {
			var t = e.stack, n = e.create, r = e.level, e = e.name, i = (e && this.unuse({
				stack: t,
				name: e
			}), this._middlewares[t] || (this._middlewares[t] = []));
			return i.push({
				stack: t,
				create: n,
				level: r ?? 10,
				name: e
			}), i.sort(function(e, t) {
				return e.level - t.level;
			}), this;
		}, W.prototype.unuse = function(e) {
			var t = e.stack, n = e.name, r = e.create;
			return t && this._middlewares[t] && (this._middlewares[t] = this._middlewares[t].filter(function(e) {
				return r ? e.create !== r : !!n && e.name !== n;
			})), this;
		}, W.prototype.open = function() {
			var e = this;
			return ft(He, function() {
				return Kn(e);
			});
		}, W.prototype._close = function() {
			this.on.close.fire(new CustomEvent("close"));
			var e = this._state;
			if (kn.remove(this), this.idbdb) {
				try {
					this.idbdb.close();
				} catch {}
				this.idbdb = null;
			}
			e.isBeingOpened || (e.dbReadyPromise = new k(function(t) {
				e.dbReadyResolve = t;
			}), e.openCanceller = new k(function(t, n) {
				e.cancelOpen = n;
			}));
		}, W.prototype.close = function(e) {
			var e = (e === void 0 ? { disableAutoOpen: !0 } : e).disableAutoOpen, t = this._state;
			e ? (t.isBeingOpened && t.cancelOpen(new w.DatabaseClosed()), this._close(), t.autoOpen = !1, t.dbOpenError = new w.DatabaseClosed()) : (this._close(), t.autoOpen = this._options.autoOpen || t.isBeingOpened, t.openComplete = !1, t.dbOpenError = null);
		}, W.prototype.delete = function(e) {
			var t = this, n = (e === void 0 && (e = { disableAutoOpen: !0 }), 0 < arguments.length && typeof arguments[0] != "object"), r = this._state;
			return new k(function(i, a) {
				function o() {
					t.close(e);
					var n = t._deps.indexedDB.deleteDatabase(t.name);
					n.onsuccess = j(function() {
						var e = t._deps, n = t.name, r;
						jn(r = e.indexedDB) || n === vt || An(r, e.IDBKeyRange).delete(n).catch(T), i();
					}), n.onerror = Zt(a), n.onblocked = t._fireOnBlocked;
				}
				if (n) throw new w.InvalidArgument("Invalid closeOptions argument to db.delete()");
				r.isBeingOpened ? r.dbReadyPromise.then(o) : o();
			});
		}, W.prototype.backendDB = function() {
			return this.idbdb;
		}, W.prototype.isOpen = function() {
			return this.idbdb !== null;
		}, W.prototype.hasBeenClosed = function() {
			var e = this._state.dbOpenError;
			return e && e.name === "DatabaseClosed";
		}, W.prototype.hasFailed = function() {
			return this._state.dbOpenError !== null;
		}, W.prototype.dynamicallyOpened = function() {
			return this._state.autoSchema;
		}, Object.defineProperty(W.prototype, "tables", {
			get: function() {
				var e = this;
				return i(this._allTables).map(function(t) {
					return e._allTables[t];
				});
			},
			enumerable: !1,
			configurable: !0
		}), W.prototype.transaction = function() {
			var e = function(e, t, n) {
				var r = arguments.length;
				if (r < 2) throw new w.InvalidArgument("Too few arguments");
				for (var i = Array(r - 1); --r;) i[r - 1] = arguments[r];
				return n = i.pop(), [
					e,
					ne(i),
					n
				];
			}.apply(this, arguments);
			return this._transaction.apply(this, e);
		}, W.prototype._transaction = function(e, t, n) {
			var r, i, a = this, o = O.trans, s = (o && o.db === this && e.indexOf("!") === -1 || (o = null), e.indexOf("?") !== -1);
			e = e.replace("!", "").replace("?", "");
			try {
				if (i = t.map(function(e) {
					if (e = e instanceof a.Table ? e.name : e, typeof e != "string") throw TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
					return e;
				}), e == "r" || e === yt) r = yt;
				else {
					if (e != "rw" && e != bt) throw new w.InvalidArgument("Invalid transaction mode: " + e);
					r = bt;
				}
				if (o) {
					if (o.mode === yt && r === bt) {
						if (!s) throw new w.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
						o = null;
					}
					o && i.forEach(function(e) {
						if (o && o.storeNames.indexOf(e) === -1) {
							if (!s) throw new w.SubTransaction("Table " + e + " not included in parent transaction.");
							o = null;
						}
					}), s && o && !o.active && (o = null);
				}
			} catch (e) {
				return o ? o._promise(null, function(t, n) {
					n(e);
				}) : F(e);
			}
			var c = function e(t, n, r, i, a) {
				return k.resolve().then(function() {
					var o = O.transless || O, s = t._createTransaction(n, r, t._dbSchema, i), o = (s.explicit = !0, {
						trans: s,
						transless: o
					});
					if (i) s.idbtrans = i.idbtrans;
					else try {
						s.create(), s.idbtrans._explicit = !0, t._state.PR1398_maxLoop = 3;
					} catch (i) {
						return i.name === ye.InvalidState && t.isOpen() && 0 < --t._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), t.close({ disableAutoOpen: !1 }), t.open().then(function() {
							return e(t, n, r, null, a);
						})) : F(i);
					}
					var c, l = pe(a), o = (l && st(), k.follow(function() {
						var e;
						(c = a.call(s, s)) && (l ? (e = ct.bind(null, null), c.then(e, e)) : typeof c.next == "function" && typeof c.throw == "function" && (c = qn(c)));
					}, o));
					return (c && typeof c.then == "function" ? k.resolve(c).then(function(e) {
						return s.active ? e : F(new w.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
					}) : o.then(function() {
						return c;
					})).then(function(e) {
						return i && s._resolve(), s._completion.then(function() {
							return e;
						});
					}).catch(function(e) {
						return s._reject(e), F(e);
					});
				});
			}.bind(null, this, r, i, o, n);
			return o ? o._promise(r, c, "lock") : O.trans ? ft(O.transless, function() {
				return a._whenReady(c);
			}) : this._whenReady(c);
		}, W.prototype.table = function(e) {
			if (l(this._allTables, e)) return this._allTables[e];
			throw new w.InvalidTable(`Table ${e} does not exist`);
		};
		var fr = W;
		function W(e, n) {
			var r, i, a, o, s, c = this, l = (this._middlewares = {}, this.verno = 0, W.dependencies), l = (this._options = n = t({
				addons: W.addons,
				autoOpen: !0,
				indexedDB: l.indexedDB,
				IDBKeyRange: l.IDBKeyRange,
				cache: "cloned",
				maxConnections: 1e3
			}, n), this._deps = {
				indexedDB: n.indexedDB,
				IDBKeyRange: n.IDBKeyRange
			}, n.addons), u = (this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this, {
				dbOpenError: null,
				isBeingOpened: !1,
				onReadyBeingFired: null,
				openComplete: !1,
				dbReadyResolve: T,
				dbReadyPromise: null,
				cancelOpen: T,
				openCanceller: null,
				autoSchema: !0,
				PR1398_maxLoop: 3,
				autoOpen: n.autoOpen
			}), d = (u.dbReadyPromise = new k(function(e) {
				u.dbReadyResolve = e;
			}), u.openCanceller = new k(function(e, t) {
				u.cancelOpen = t;
			}), this._state = u, this.name = e, this.on = Mt(this, "populate", "blocked", "versionchange", "close", { ready: [Oe, T] }), this.once = function(e, t) {
				var n = function() {
					var r = [...arguments];
					c.on(e).unsubscribe(n), t.apply(c, r);
				};
				return c.on(e, n);
			}, this.on.ready.subscribe = _(this.on.ready.subscribe, function(e) {
				return function(t, n) {
					W.vip(function() {
						var r, i = c._state;
						i.openComplete ? (i.dbOpenError || k.resolve().then(t), n && e(t)) : i.onReadyBeingFired ? (i.onReadyBeingFired.push(t), n && e(t)) : (e(t), r = c, n || e(function e() {
							r.on.ready.unsubscribe(t), r.on.ready.unsubscribe(e);
						}));
					});
				};
			}), this.Collection = (r = this, Nt(Vt.prototype, function(e, t) {
				this.db = r;
				var n = St, i = null;
				if (t) try {
					n = t();
				} catch (e) {
					i = e;
				}
				var t = e._ctx, e = t.table, a = e.hook.reading.fire;
				this._ctx = {
					table: e,
					index: t.index,
					isPrimKey: !t.index || e.schema.primKey.keyPath && t.index === e.schema.primKey.name,
					range: n,
					keysOnly: !1,
					dir: "next",
					unique: "",
					algorithm: null,
					filter: null,
					replayFilter: null,
					justLimit: !0,
					isMatch: null,
					offset: 0,
					limit: 1 / 0,
					error: i,
					or: t.or,
					valueMapper: a === Se ? null : a
				};
			})), this.Table = (i = this, Nt(jt.prototype, function(e, t, n) {
				this.db = i, this._tx = n, this.name = e, this.schema = t, this.hook = i._allTables[e] ? i._allTables[e].hook : Mt(null, {
					creating: [Te, T],
					reading: [Ce, Se],
					updating: [Ee, T],
					deleting: [E, T]
				});
			})), this.Transaction = (a = this, Nt(nn.prototype, function(e, t, n, r, i) {
				var o = this;
				e !== "readonly" && t.forEach(function(e) {
					e = (e = n[e])?.yProps, e && (t = t.concat(e.map(function(e) {
						return e.updatesTable;
					})));
				}), this.db = a, this.mode = e, this.storeNames = t, this.schema = n, this.chromeTransactionDurability = r, this.idbtrans = null, this.on = Mt(this, "complete", "error", "abort"), this.parent = i || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new k(function(e, t) {
					o._resolve = e, o._reject = t;
				}), this._completion.then(function() {
					o.active = !1, o.on.complete.fire();
				}, function(e) {
					var t = o.active;
					return o.active = !1, o.on.error.fire(e), o.parent ? o.parent._reject(e) : t && o.idbtrans && o.idbtrans.abort(), F(e);
				});
			})), this.Version = (o = this, Nt(Dn.prototype, function(e) {
				this.db = o, this._cfg = {
					version: e,
					storesSource: null,
					dbschema: {},
					tables: {},
					contentUpgrade: null
				};
			})), this.WhereClause = (s = this, Nt(Xt.prototype, function(e, t, n) {
				if (this.db = s, this._ctx = {
					table: e,
					index: t === ":id" ? null : t,
					or: n
				}, this._cmp = this._ascending = I, this._descending = function(e, t) {
					return I(t, e);
				}, this._max = function(e, t) {
					return 0 < I(e, t) ? e : t;
				}, this._min = function(e, t) {
					return I(e, t) < 0 ? e : t;
				}, this._IDBKeyRange = s._deps.IDBKeyRange, !this._IDBKeyRange) throw new w.MissingAPI();
			})), this.on("versionchange", function(e) {
				0 < e.newVersion ? console.warn(`Another connection wants to upgrade database '${c.name}'. Closing db now to resume the upgrade.`) : console.warn(`Another connection wants to delete database '${c.name}'. Closing db now to resume the delete request.`), c.close({ disableAutoOpen: !1 });
			}), this.on("blocked", function(e) {
				!e.newVersion || e.newVersion < e.oldVersion ? console.warn(`Dexie.delete('${c.name}') was blocked`) : console.warn(`Upgrade '${c.name}' blocked by other connection holding version ${e.oldVersion / 10}`);
			}), this._maxKey = cn(n.IDBKeyRange), this._createTransaction = function(e, t, n, r) {
				return new c.Transaction(e, t, n, c._options.chromeTransactionDurability, r);
			}, this._fireOnBlocked = function(e) {
				c.on("blocked").fire(e), kn.toArray().filter(function(e) {
					return e.name === c.name && e !== c && !e._state.vcFired;
				}).map(function(t) {
					return t.on("versionchange").fire(e);
				});
			}, this.use(er), this.use(ur), this.use(rr), this.use(Yn), this.use(Qn), new Proxy(this, { get: function(e, t, n) {
				var r;
				return t === "_vip" || (t === "table" ? function(e) {
					return dr(c.table(e), d);
				} : (r = Reflect.get(e, t, n)) instanceof jt ? dr(r, d) : t === "tables" ? r.map(function(e) {
					return dr(e, d);
				}) : t === "_createTransaction" ? function() {
					return dr(r.apply(this, arguments), d);
				} : r);
			} }));
			this.vip = d, l.forEach(function(e) {
				return e(c);
			});
		}
		var pr, Pe = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", mr = (hr.prototype.subscribe = function(e, t, n) {
			return this._subscribe(e && typeof e != "function" ? e : {
				next: e,
				error: t,
				complete: n
			});
		}, hr.prototype[Pe] = function() {
			return this;
		}, hr);
		function hr(e) {
			this._subscribe = e;
		}
		try {
			pr = {
				indexedDB: r.indexedDB || r.mozIndexedDB || r.webkitIndexedDB || r.msIndexedDB,
				IDBKeyRange: r.IDBKeyRange || r.webkitIDBKeyRange
			};
		} catch {
			pr = {
				indexedDB: null,
				IDBKeyRange: null
			};
		}
		function gr(e) {
			var t, n = !1, r = new mr(function(r) {
				var i = pe(e), a, o = !1, s = {}, c = {}, l = {
					get closed() {
						return o;
					},
					unsubscribe: function() {
						o || (o = !0, a && a.abort(), u && tn.storagemutated.unsubscribe(p));
					}
				}, u = (r.start && r.start(l), !1), d = function() {
					return mt(m);
				};
				function f() {
					return zn(c, s);
				}
				var p = function(e) {
					Rn(s, e), f() && d();
				}, m = function() {
					var l, m, h;
					!o && pr.indexedDB && (s = {}, l = {}, a && a.abort(), a = new AbortController(), h = ((t) => {
						var n = $e();
						try {
							i && st();
							var r = N(e, t);
							return r = i ? r.finally(ct) : r;
						} finally {
							n && et();
						}
					})(m = {
						subscr: l,
						signal: a.signal,
						requery: d,
						querier: e,
						trans: null
					}), u ||= (tn.storagemutated.subscribe(p), !0), Promise.resolve(h).then(function(e) {
						n = !0, t = e, o || m.signal.aborted || (f() || (c = l, f()) ? d() : (s = {}, mt(function() {
							return !o && r.next && r.next(e);
						})));
					}, function(e) {
						n = !1, ["DatabaseClosedError", "AbortError"].includes(e?.name) || o || mt(function() {
							o || r.error && r.error(e);
						});
					}));
				};
				return setTimeout(d, 0), l;
			});
			return r.hasValue = function() {
				return n;
			}, r.getValue = function() {
				return t;
			}, r;
		}
		var _r = fr;
		function vr(e) {
			var t = br;
			try {
				br = !0, tn.storagemutated.fire(e), Wn(e, !0);
			} finally {
				br = t;
			}
		}
		u(_r, t(t({}, re), {
			delete: function(e) {
				return new _r(e, { addons: [] }).delete();
			},
			exists: function(e) {
				return new _r(e, { addons: [] }).open().then(function(e) {
					return e.close(), !0;
				}).catch("NoSuchDatabaseError", function() {
					return !1;
				});
			},
			getDatabaseNames: function(e) {
				try {
					return t = _r.dependencies, n = t.indexedDB, t = t.IDBKeyRange, (jn(n) ? Promise.resolve(n.databases()).then(function(e) {
						return e.map(function(e) {
							return e.name;
						}).filter(function(e) {
							return e !== vt;
						});
					}) : An(n, t).toCollection().primaryKeys()).then(e);
				} catch {
					return F(new w.MissingAPI());
				}
				var t, n;
			},
			defineClass: function() {
				return function(e) {
					o(this, e);
				};
			},
			ignoreTransaction: function(e) {
				return O.trans ? ft(O.transless || He, e) : e();
			},
			vip: V,
			async: function(e) {
				return function() {
					try {
						var t = qn(e.apply(this, arguments));
						return t && typeof t.then == "function" ? t : k.resolve(t);
					} catch (e) {
						return F(e);
					}
				};
			},
			spawn: function(e, t, n) {
				try {
					var r = qn(e.apply(n, t || []));
					return r && typeof r.then == "function" ? r : k.resolve(r);
				} catch (e) {
					return F(e);
				}
			},
			currentTransaction: { get: function() {
				return O.trans || null;
			} },
			waitFor: function(e, t) {
				return e = k.resolve(typeof e == "function" ? _r.ignoreTransaction(e) : e).timeout(t || 6e4), O.trans ? O.trans.waitFor(e) : e;
			},
			Promise: k,
			debug: {
				get: function() {
					return ke;
				},
				set: function(e) {
					Ae(e);
				}
			},
			derive: p,
			extend: o,
			props: u,
			override: _,
			Events: Mt,
			on: tn,
			liveQuery: gr,
			extendObservabilitySet: Rn,
			getByKeyPath: b,
			setByKeyPath: x,
			delByKeyPath: function(e, t) {
				typeof t == "string" ? x(e, t, void 0) : "length" in t && [].map.call(t, function(t) {
					x(e, t, void 0);
				});
			},
			shallowClone: ee,
			deepClone: oe,
			getObjectDiff: Xn,
			cmp: I,
			asap: y,
			minKey: -1 / 0,
			addons: [],
			connections: { get: kn.toArray },
			errnames: ye,
			dependencies: pr,
			cache: Bn,
			semVer: "4.4.6",
			version: "4.4.6".split(".").map(function(e) {
				return parseInt(e);
			}).reduce(function(e, t, n) {
				return e + t / 10 ** (2 * n);
			})
		})), _r.maxKey = cn(_r.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (tn($t, function(e) {
			br ||= (e = new CustomEvent(en, { detail: e }), br = !0, dispatchEvent(e), !1);
		}), addEventListener(en, function(e) {
			e = e.detail, br || vr(e);
		}));
		var yr, br = !1, xr = function() {};
		return typeof BroadcastChannel < "u" && ((xr = function() {
			(yr = new BroadcastChannel(en)).onmessage = function(e) {
				return e.data && vr(e.data);
			};
		})(), typeof yr.unref == "function" && yr.unref(), tn($t, function(e) {
			br || yr.postMessage(e);
		})), typeof addEventListener < "u" && (addEventListener("pagehide", function(e) {
			if (!fr.disableBfCache && e.persisted) {
				ke && console.debug("Dexie: handling persisted pagehide"), yr?.close();
				for (var t = 0, n = kn.toArray(); t < n.length; t++) n[t].close({ disableAutoOpen: !1 });
			}
		}), addEventListener("pageshow", function(e) {
			!fr.disableBfCache && e.persisted && (ke && console.debug("Dexie: handling persisted pageshow"), xr(), vr({ all: new H(-1 / 0, [[]]) }));
		})), k.rejectionMapper = function(e, t) {
			return !e || e instanceof ge || e instanceof TypeError || e instanceof SyntaxError || !e.name || !xe[e.name] ? e : (t = new xe[e.name](t || e.message, e), "stack" in e && f(t, "stack", { get: function() {
				return this.inner.stack;
			} }), t);
		}, Ae(ke), t(fr, Object.freeze({
			__proto__: null,
			DEFAULT_MAX_CONNECTIONS: 1e3,
			Dexie: fr,
			Entity: wt,
			PropModification: Ot,
			RangeSet: H,
			add: function(e) {
				return new Ot({ add: e });
			},
			cmp: I,
			default: fr,
			liveQuery: gr,
			mergeRanges: Pn,
			rangesOverlap: U,
			remove: function(e) {
				return new Ot({ remove: e });
			},
			replacePrefix: function(e, t) {
				return new Ot({ replacePrefix: [e, t] });
			}
		}), { default: fr }), fr;
	});
})))(), 1), kc = Symbol.for("Dexie"), Ac = globalThis[kc] || (globalThis[kc] = Oc.default);
if (Oc.default.semVer !== Ac.semVer) throw Error(`Two different versions of Dexie loaded in the same app: ${Oc.default.semVer} and ${Ac.semVer}`);
var { liveQuery: jc, mergeRanges: Mc, rangesOverlap: Nc, RangeSet: Pc, cmp: Fc, Entity: Ic, PropModification: Lc, replacePrefix: Rc, add: zc, remove: Bc, DexieYProvider: Vc } = Ac, Hc = /* @__PURE__ */ new Set([
	"DAILY",
	"SELF_INTRO",
	"MOTIVATION"
]);
function Uc(e) {
	return e.length ? e.map(String).join(".") : "$";
}
function Wc(e) {
	return e === "unrecognized_keys" ? "정의되지 않은 핵심 필드가 있습니다." : e === "invalid_type" ? "필드 형식이 올바르지 않습니다." : e === "too_small" || e === "too_big" ? "허용 범위를 벗어난 값이 있습니다." : "허용되지 않은 값이거나 규격에 맞지 않습니다.";
}
function $(e, t, n, r, i = "error") {
	return {
		severity: i,
		code: e,
		path: t,
		message: n,
		developerDetail: r
	};
}
function Gc(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) t.has(r) && n.add(r), t.add(r);
	return [...n];
}
function Kc(e, t) {
	return e.length === t.length && e.every((e) => t.includes(e));
}
function qc(e, t, n, r, i) {
	for (let a of Gc(e)) i.push($(t, n, `${r}가 중복되었습니다.`, `Duplicate ${r}: ${a}`));
}
function Jc(e, t) {
	let n = e, r = /* @__PURE__ */ new Set();
	for (; n;) {
		if (r.has(n.question_id)) return null;
		if (r.add(n.question_id), n.relation === "ROOT") return n.question_id;
		if (!n.parent_question_id) return null;
		n = t.get(n.parent_question_id);
	}
	return null;
}
function Yc(e) {
	let t = [], n = e.question_bank.map((e) => e.question_id), r = e.record_evidence.map((e) => e.evidence_id), i = e.interviewer_pool.map((e) => e.interviewer_id);
	qc(n, "DUPLICATE_QUESTION_ID", "question_bank", "질문 ID", t), qc(r, "DUPLICATE_EVIDENCE_ID", "record_evidence", "근거 ID", t), qc(i, "DUPLICATE_INTERVIEWER_ID", "interviewer_pool", "면접관 ID", t);
	let a = new Map(e.question_bank.map((e) => [e.question_id, e])), o = new Set(r), s = /* @__PURE__ */ new Set([
		"INVALID_ROOT_RULE",
		"INVALID_FOLLOWUP_RULE",
		"MISSING_PARENT",
		"MISSING_ROOT",
		"INVALID_ROOT_REFERENCE",
		"DIRECT_CHILD_MISMATCH",
		"SELF_REFERENCE",
		"GRAPH_CYCLE"
	]), c = /* @__PURE__ */ new Set([
		"MISSING_EVIDENCE_REFERENCE",
		"MISSING_PARENT",
		"MISSING_ROOT"
	]);
	for (let [n, r] of e.question_bank.entries()) {
		let e = `question_bank.${n}`;
		for (let n of r.evidence_ids) o.has(n) || t.push($("MISSING_EVIDENCE_REFERENCE", `${e}.evidence_ids`, "질문이 존재하지 않는 학생부 근거를 참조합니다.", `${r.question_id} references missing evidence ${n}`));
		if (r.relation === "ROOT") (r.root_question_id !== r.question_id || r.parent_question_id !== null) && t.push($("INVALID_ROOT_RULE", e, "ROOT 질문의 root/parent 관계가 올바르지 않습니다.", `${r.question_id} must reference itself as root and have null parent`)), Dc.rootQuestionTypes.has(r.question_type) || t.push($("ROOT_QUESTION_TYPE_MISMATCH", `${e}.question_type`, "ROOT 질문에 Follow-up 전용 질문 유형을 사용할 수 없습니다.", `${r.question_id} uses ${r.question_type} as ROOT`));
		else {
			Dc.rootQuestionTypes.has(r.question_type) && t.push($("FOLLOWUP_QUESTION_TYPE_MISMATCH", `${e}.question_type`, "FOLLOWUP 질문에 Root 전용 질문 유형을 사용할 수 없습니다.", `${r.question_id} uses ${r.question_type} as FOLLOWUP`)), (r.parent_question_id === r.question_id || r.root_question_id === r.question_id) && t.push($("SELF_REFERENCE", e, "질문이 자기 자신을 부모 또는 Root로 참조합니다.", `${r.question_id} has a self reference`));
			let n = r.parent_question_id ? a.get(r.parent_question_id) : void 0;
			n ? n.followup_ids.includes(r.question_id) || t.push($("DIRECT_CHILD_MISMATCH", `${e}.parent_question_id`, "부모 질문의 followup_ids와 직접 자식 관계가 일치하지 않습니다.", `${n.question_id}.followup_ids does not include ${r.question_id}`)) : t.push($("MISSING_PARENT", `${e}.parent_question_id`, "FOLLOWUP 질문의 직접 부모를 찾을 수 없습니다.", `${r.question_id} parent ${String(r.parent_question_id)} does not exist`));
			let i = a.get(r.root_question_id);
			i ? i.relation !== "ROOT" && t.push($("INVALID_ROOT_REFERENCE", `${e}.root_question_id`, "root_question_id는 ROOT 질문을 가리켜야 합니다.", `${r.question_id} root ${r.root_question_id} is not ROOT`)) : t.push($("MISSING_ROOT", `${e}.root_question_id`, "FOLLOWUP 질문의 최상위 ROOT를 찾을 수 없습니다.", `${r.question_id} root ${r.root_question_id} does not exist`));
			let o = Jc(r, a);
			o !== null && o !== r.root_question_id && t.push($("INVALID_ROOT_REFERENCE", `${e}.root_question_id`, "root_question_id가 실제 부모 경로의 최상위 ROOT와 일치하지 않습니다.", `${r.question_id} declares ${r.root_question_id}, traced ${o}`));
		}
		for (let n of r.followup_ids) {
			if (n === r.question_id) {
				t.push($("SELF_REFERENCE", `${e}.followup_ids`, "질문이 자기 자신을 follow-up으로 참조합니다.", `${r.question_id} includes itself in followup_ids`));
				continue;
			}
			let i = a.get(n);
			i ? (i.relation !== "FOLLOWUP" || i.parent_question_id !== r.question_id) && t.push($("DIRECT_CHILD_MISMATCH", `${e}.followup_ids`, "followup_ids는 직접 자식 FOLLOWUP 질문만 가리켜야 합니다.", `${r.question_id} -> ${n} is not a direct child relationship`)) : t.push($("MISSING_PARENT", `${e}.followup_ids`, "followup_ids가 존재하지 않는 질문을 참조합니다.", `${r.question_id} references missing child ${n}`));
		}
	}
	let l = /* @__PURE__ */ new Map(), u = (e) => {
		if (l.get(e) === 1) return !1;
		if (l.get(e) === 2) return !0;
		l.set(e, 1);
		let t = a.get(e);
		for (let e of t?.followup_ids ?? []) if (a.has(e) && !u(e)) return !1;
		return l.set(e, 2), !0;
	};
	for (let e of n) if (!u(e)) {
		t.push($("GRAPH_CYCLE", "question_bank", "질문 그래프에 순환 참조가 있습니다.", `Cycle detected from ${e}`));
		break;
	}
	let d = Gc(e.question_bank.map((e) => e.question_intent.trim())), f = e.question_bank.filter((e) => e.evidence_ids.length === 0 && !Hc.has(e.question_type)).map((e) => e.question_id), p = !t.some((e) => s.has(e.code)), m = !t.some((e) => c.has(e.code)), h = [
		["graph_validation_passed", p],
		["enum_validation_passed", !t.some((e) => e.code.endsWith("_QUESTION_TYPE_MISMATCH"))],
		["reference_validation_passed", m],
		["runtime_trigger_validation_passed", !0],
		["duplicate_intent_check_passed", d.length === 0]
	];
	for (let [n, r] of h) e.integrity[n] !== r && t.push($("INTEGRITY_FLAG_MISMATCH", `integrity.${n}`, "질문팩 무결성 플래그가 실제 검증 결과와 일치하지 않습니다.", `${n}=${String(e.integrity[n])}, actual=${String(r)}`));
	Kc(e.integrity.questions_without_record_evidence, f) || t.push($("INTEGRITY_EVIDENCE_LIST_MISMATCH", "integrity.questions_without_record_evidence", "근거 없는 질문 목록이 실제 질문 데이터와 일치하지 않습니다.", `declared=${JSON.stringify(e.integrity.questions_without_record_evidence)}, actual=${JSON.stringify(f)}`));
	for (let n of e.integrity.warnings) t.push($("PACK_DECLARED_WARNING", "integrity.warnings", n, `Pack declared warning: ${n}`, "warning"));
	return t;
}
function Xc(e) {
	let t = Ec.safeParse(e);
	if (!t.success) {
		let e = t.error.issues.map((e) => $("SCHEMA_INVALID", Uc(e.path), Wc(e.code), `${e.code}: ${e.message}`));
		return {
			ok: !1,
			pack: null,
			issues: e,
			checks: [
				{
					key: "schema",
					label: "구조 검증",
					ok: !1,
					detail: `오류 ${e.length}개`
				},
				{
					key: "enum",
					label: "Enum 검증",
					ok: !1,
					detail: "구조 오류를 먼저 수정해야 합니다."
				},
				{
					key: "reference",
					label: "참조 검증",
					ok: !1,
					detail: "구조 오류를 먼저 수정해야 합니다."
				},
				{
					key: "graph",
					label: "질문 그래프",
					ok: !1,
					detail: "구조 오류를 먼저 수정해야 합니다."
				},
				{
					key: "runtimeTrigger",
					label: "Trigger 검증",
					ok: !1,
					detail: "구조 오류를 먼저 수정해야 합니다."
				},
				{
					key: "integrity",
					label: "무결성 선언",
					ok: !1,
					detail: "구조 오류를 먼저 수정해야 합니다."
				}
			]
		};
	}
	let n = t.data, r = Yc(n), i = new Set(r.filter((e) => e.severity === "error").map((e) => e.code)), a = [...i].some((e) => [
		"INVALID_ROOT_RULE",
		"INVALID_FOLLOWUP_RULE",
		"MISSING_PARENT",
		"MISSING_ROOT",
		"INVALID_ROOT_REFERENCE",
		"DIRECT_CHILD_MISMATCH",
		"SELF_REFERENCE",
		"GRAPH_CYCLE"
	].includes(e)), o = [...i].some((e) => [
		"MISSING_EVIDENCE_REFERENCE",
		"MISSING_PARENT",
		"MISSING_ROOT",
		"DUPLICATE_QUESTION_ID",
		"DUPLICATE_EVIDENCE_ID",
		"DUPLICATE_INTERVIEWER_ID"
	].includes(e)), s = [...i].some((e) => e.endsWith("_QUESTION_TYPE_MISMATCH")), c = [...i].some((e) => e.startsWith("INTEGRITY_"));
	return {
		ok: r.every((e) => e.severity !== "error"),
		pack: n,
		issues: r,
		checks: [
			{
				key: "schema",
				label: "구조 검증",
				ok: !0,
				detail: "INTERVIEW_PACK/1.0 폐쇄형 구조"
			},
			{
				key: "enum",
				label: "Enum 검증",
				ok: !s,
				detail: s ? "질문 유형 관계 오류" : "공식 V1 값만 사용"
			},
			{
				key: "reference",
				label: "참조 검증",
				ok: !o,
				detail: o ? "ID 또는 참조 오류" : "근거·질문·면접관 참조 정상"
			},
			{
				key: "graph",
				label: "질문 그래프",
				ok: !a,
				detail: a ? "ROOT/FOLLOWUP 그래프 오류" : "비순환 직접 자식 관계 정상"
			},
			{
				key: "runtimeTrigger",
				label: "Trigger 검증",
				ok: !0,
				detail: "공식 trigger 구조"
			},
			{
				key: "integrity",
				label: "무결성 선언",
				ok: !c,
				detail: c ? "선언과 실제 결과 불일치" : "선언과 실제 결과 일치"
			}
		]
	};
}
//#endregion
//#region src/phase1/storage.ts
var Zc = "myeonyeokryeok_v1", Qc = "activePackSha256", $c = "interviewConfig", el = "myeonyeokryeok_pack", tl = "myeonyeokryeok_active_pack_sha256", nl = "myeonyeokryeok_interview_config", rl = class extends Error {
	validation;
	constructor(e) {
		super("질문팩 검증에 실패했습니다."), this.validation = e, this.name = "PackImportValidationError";
	}
}, il = class extends Ac {
	packs;
	sessions;
	settings;
	constructor(e = Zc) {
		super(e), this.version(1).stores({
			packs: "&sha256",
			sessions: "&session_id,created_at,pack_sha256",
			settings: "&key"
		});
	}
};
function al() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function ol(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function sl(e, t = "") {
	return typeof e == "string" && e ? e : t;
}
function cl(e) {
	return typeof e == "string" && e.trim() ? e : null;
}
function ll(e, t) {
	return e instanceof Uint8Array ? e : e instanceof ArrayBuffer ? new Uint8Array(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : re(t);
}
function ul(e, t) {
	return [e.target.university, e.target.department].filter(Boolean).join(" ") || t || e.pack_id;
}
function dl(e, t, n, r, i, a, o, s = al(), c = null) {
	return {
		sha256: t,
		pack: e,
		rawJson: n,
		rawBytes: r,
		packId: e.pack_id,
		displayName: ul(e, a),
		importedAt: s,
		lastUsedAt: c,
		university: e.target.university,
		department: e.target.department,
		questionCount: e.question_bank.length,
		interviewerCount: e.interviewer_pool.length,
		validationStatus: i.ok ? "VALID" : "INVALID",
		validationIssues: i.issues,
		sourceName: a,
		sourceKind: o
	};
}
function fl(e) {
	if (!ol(e) || !ol(e.pack) || typeof e.sha256 != "string") return null;
	let t = Xc(e.pack), n = e.pack, r = sl(e.rawJson, JSON.stringify(e.pack)), i = sl(e.sourceName, sl(e.source_name, "legacy-indexeddb.json")), a = sl(e.importedAt, sl(e.imported_at, al())), o = cl(e.lastUsedAt ?? e.last_used_at);
	return dl(n, e.sha256, r, ll(e.rawBytes, r), t, i, sl(e.sourceKind) || "legacy-indexedDB", a, o);
}
function pl(e) {
	if (!e) return null;
	try {
		let t = JSON.parse(e);
		return ol(t) ? t : null;
	} catch {
		return null;
	}
}
var ml = class {
	compatibilityStorage;
	db;
	constructor(e = Zc, t = typeof localStorage > "u" ? null : localStorage) {
		this.compatibilityStorage = t, this.db = new il(e);
	}
	async initialize() {
		await this.db.open(), await this.normalizeIndexedDbPacks(), await this.migrateLegacyLocalStorage();
		let e = await this.listPacks(), t = await this.db.settings.get(Qc), n = this.compatibilityStorage?.getItem("myeonyeokryeok_active_pack_sha256") ?? null, r = new Set(e.filter((e) => e.validationStatus === "VALID").map((e) => e.sha256)), i = typeof t?.value == "string" && r.has(t.value) ? t.value : n && r.has(n) ? n : e.find((e) => e.validationStatus === "VALID")?.sha256 ?? null;
		i ? await this.writeSetting(Qc, i) : await this.db.settings.delete(Qc);
		let a = await this.getInterviewConfig();
		return a || (a = pl(this.compatibilityStorage?.getItem("myeonyeokryeok_interview_config") ?? null), a && await this.writeSetting($c, a)), await this.mirrorCompatibility(i, a), this.snapshot();
	}
	async importPack(e) {
		let t = Xc(e.parsed);
		if (!t.ok || !t.pack) throw new rl(t);
		let n = await ne(e.bytes), r = await this.db.packs.get(n), i = e.activate === !1 ? null : al(), a = r ? {
			...r,
			lastUsedAt: i ?? r.lastUsedAt
		} : dl(t.pack, n, e.rawJson, e.bytes, t, e.sourceName, e.sourceKind ?? "file", al(), i);
		await this.db.transaction("rw", this.db.packs, this.db.settings, async () => {
			await this.db.packs.put(a), e.activate !== !1 && await this.writeSetting(Qc, n);
		});
		let o = await this.getInterviewConfig(), s = e.activate === !1 ? await this.getActivePackSha256() : n;
		return await this.mirrorCompatibility(s, o), {
			status: r ? "duplicate" : "created",
			record: a,
			validation: t
		};
	}
	async listPacks() {
		return (await this.db.packs.toArray()).sort((e, t) => {
			let n = e.lastUsedAt ?? e.importedAt;
			return (t.lastUsedAt ?? t.importedAt).localeCompare(n);
		});
	}
	async getPack(e) {
		return await this.db.packs.get(e) ?? null;
	}
	async getActivePackSha256() {
		let e = await this.db.settings.get(Qc);
		return typeof e?.value == "string" ? e.value : null;
	}
	async getActivePack() {
		let e = await this.getActivePackSha256();
		return e ? await this.getPack(e) : null;
	}
	async activatePack(e) {
		let t = await this.db.packs.get(e);
		if (!t) throw Error("활성화할 질문팩을 찾을 수 없습니다.");
		if (t.validationStatus !== "VALID") throw Error("검증에 실패한 질문팩은 활성화할 수 없습니다.");
		let n = {
			...t,
			lastUsedAt: al()
		};
		return await this.db.transaction("rw", this.db.packs, this.db.settings, async () => {
			await this.db.packs.put(n), await this.writeSetting(Qc, e);
		}), await this.mirrorCompatibility(e, await this.getInterviewConfig()), n;
	}
	async deletePack(e) {
		await this.db.transaction("rw", this.db.packs, this.db.settings, async () => {
			let t = await this.getActivePackSha256();
			if (await this.db.packs.delete(e), t === e) {
				let e = (await this.db.packs.toArray()).filter((e) => e.validationStatus === "VALID").sort((e, t) => (t.lastUsedAt ?? t.importedAt).localeCompare(e.lastUsedAt ?? e.importedAt));
				e[0] ? await this.writeSetting(Qc, e[0].sha256) : await this.db.settings.delete(Qc);
			}
		});
		let t = await this.snapshot();
		return await this.mirrorCompatibility(t.activePackSha256, t.interviewConfig), t;
	}
	async getInterviewConfig() {
		let e = await this.db.settings.get($c);
		return ol(e?.value) ? e.value : null;
	}
	async saveInterviewConfig(e) {
		await this.writeSetting($c, e), await this.mirrorCompatibility(await this.getActivePackSha256(), e);
	}
	async putSession(e) {
		return await this.db.sessions.put(e), e;
	}
	async getSession(e) {
		return await this.db.sessions.get(e) ?? null;
	}
	async listSessions() {
		return (await this.db.sessions.toArray()).sort((e, t) => String(t.created_at ?? "").localeCompare(String(e.created_at ?? "")));
	}
	async deleteSession(e) {
		await this.db.sessions.delete(e);
	}
	async snapshot() {
		let e = await this.listPacks(), t = await this.getActivePackSha256();
		return {
			packs: e,
			activePackSha256: t,
			activePack: t ? e.find((e) => e.sha256 === t) ?? null : null,
			interviewConfig: await this.getInterviewConfig()
		};
	}
	async close() {
		this.db.close();
	}
	async writeSetting(e, t) {
		await this.db.settings.put({
			key: e,
			value: t,
			updatedAt: al()
		});
	}
	async normalizeIndexedDbPacks() {
		let e = (await this.db.table("packs").toArray()).map(fl).filter((e) => e !== null);
		e.length && await this.db.packs.bulkPut(e);
	}
	async migrateLegacyLocalStorage() {
		let e = this.compatibilityStorage?.getItem(el);
		if (!e) return;
		let t = this.compatibilityStorage?.getItem(tl);
		if (!(t && await this.db.packs.get(t))) try {
			let t = JSON.parse(e), n = re(e), r = await ne(n);
			if (await this.db.packs.get(r)) return;
			let i = Xc(t);
			if (!i.pack) return;
			let a = dl(i.pack, r, e, n, i, "legacy-localStorage", "legacy-localStorage");
			await this.db.packs.put(a);
		} catch {}
	}
	async mirrorCompatibility(e, t) {
		if (this.compatibilityStorage) {
			if (e) {
				let t = await this.db.packs.get(e);
				t && (this.compatibilityStorage.setItem(tl, e), this.compatibilityStorage.setItem(el, JSON.stringify(t.pack)));
			} else this.compatibilityStorage.removeItem(tl), this.compatibilityStorage.removeItem(el);
			t ? this.compatibilityStorage.setItem(nl, JSON.stringify(t)) : this.compatibilityStorage.removeItem(nl);
		}
	}
}, hl = [
	"adaptive",
	"balanced",
	"calm",
	"warm",
	"firm"
], gl = (e, t, n) => {
	let r = Number(e);
	return Number.isFinite(r) && e !== null ? Math.min(n, Math.max(t, r)) : 1;
};
function _l(e = {}) {
	return {
		voiceURI: typeof e.voiceURI == "string" ? e.voiceURI : "",
		gender: e.gender === "female" || e.gender === "male" ? e.gender : "auto",
		style: hl.includes(e.style) ? e.style : "adaptive",
		rate: gl(e.rate ?? 1, .7, 1.3),
		pitch: gl(e.pitch ?? 1, .7, 1.3)
	};
}
function vl(e) {
	return e.filter((e) => /^ko(?:[-_]|$)/i.test(e.lang)).sort((e, t) => Number(t.localService) - Number(e.localService) || Number(t.default) - Number(e.default) || e.name.localeCompare(t.name));
}
function yl(e) {
	return /Microsoft/i.test(e.name) ? /\b(Heami|SunHi|JiMin|SeoHyeon|SoonBok|YuJin|Haena)\b/i.test(e.name.replace(/Neural.*$/i, "")) ? "female" : /\b(InJoon|Hyunsu|BongJin|GookMin|Junho)\b/i.test(e.name.replace(/Neural.*$/i, "").replace(/Multilingual$/i, "")) ? "male" : null : null;
}
function bl(e, t, n = {}) {
	let r = _l(t), i = vl(e), a = i.find((e) => e.voiceURI === r.voiceURI), o = r.gender === "auto" ? n.voice_preference : r.gender, s = i.find((e) => yl(e) === o), c = a ?? s ?? i[0] ?? null, l = "";
	return r.voiceURI && !a ? l = "선택한 목소리를 현재 브라우저에서 찾지 못해 사용 가능한 한국어 목소리로 읽습니다." : !a && r.gender !== "auto" && !s && (l = "선호 성별의 한국어 목소리가 없어 사용 가능한 목소리로 읽습니다. 높낮이로 성별을 대체하지 않습니다."), c || (l = "한국어 목소리가 없습니다. 질문을 화면으로 표시합니다. 기기의 한국어 음성을 확인해 주세요."), {
		voice: c,
		warning: l
	};
}
function xl(e, t = {}) {
	let n = _l(e), r = n.style;
	if (r === "adaptive") {
		let e = (t.personality_traits ?? []).join(" ");
		r = (t.pressure_tendency ?? 0) >= .65 || /SKEPTICAL|FAST_PACED/i.test(e) ? "firm" : /CURIOUS/i.test(e) ? "warm" : /ANALYTICAL/i.test(e) ? "balanced" : "calm";
	}
	let i = {
		balanced: [1, 1],
		calm: [.92, .98],
		warm: [.97, 1.06],
		firm: [1.04, .94]
	}[r];
	return {
		rate: Math.min(1.5, Math.max(.6, n.rate * i[0])),
		pitch: Math.min(1.5, Math.max(.6, n.pitch * i[1])),
		style: r
	};
}
function Sl(e) {
	let t = [], n = e.trim();
	for (; n.length > 110;) {
		let e = n.slice(0, 110), r = Array.from(e.matchAll(/[.!?。？！]\s*|[,，]\s+|\s+/g)).filter((e) => (e.index ?? 0) > 35).at(-1), i = r ? (r.index ?? 0) + r[0].length : 110;
		t.push(n.slice(0, i)), n = n.slice(i);
	}
	return n && t.push(n), t;
}
//#endregion
//#region src/phase1/recording.ts
function Cl(e) {
	return /mp4|m4a/i.test(e) ? "m4a" : /ogg/i.test(e) ? "ogg" : /wav/i.test(e) ? "wav" : "webm";
}
function wl(e, t) {
	return `audio/${e.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120) || "answer"}.${Cl(t)}`;
}
function Tl(e, t = MediaRecorder) {
	let n = [
		"audio/webm;codecs=opus",
		"audio/webm",
		"audio/mp4",
		"audio/ogg;codecs=opus"
	].find((e) => t.isTypeSupported(e)), r = n ? new t(e, { mimeType: n }) : new t(e), i = [], a, o = !1, s = !1, c, l = new Promise((e) => {
		a = e;
	}), u = () => {
		if (o) return;
		o = !0, clearTimeout(c), r.removeEventListener("dataavailable", d), r.removeEventListener("stop", u), r.removeEventListener("error", f);
		let e = i.length ? new Blob(i, { type: r.mimeType || i[0].type || n || "audio/webm" }) : null;
		a(e?.size ? e : null);
	}, d = (e) => {
		e.data?.size && i.push(e.data);
	}, f = (e) => {
		p.error = e.error?.message || "녹음 장치에 오류가 발생했습니다.";
	}, p = {
		recorder: r,
		result: l,
		error: null,
		stop() {
			if (!o && !s && (s = !0, c = setTimeout(() => {
				p.error ||= "녹음 종료 응답을 기다리다 시간이 초과되었습니다.", u();
			}, 5e3), r.state !== "inactive")) try {
				r.stop();
			} catch (e) {
				p.error = String(e), u();
			}
			return l;
		}
	};
	return r.addEventListener("dataavailable", d), r.addEventListener("stop", u), r.addEventListener("error", f), r.start(250), p;
}
//#endregion
//#region src/phase1/browserBridge.ts
function El() {
	return new ml();
}
//#endregion
export { Qc as ACTIVE_PACK_SETTING_KEY, Zc as DATABASE_NAME, $c as INTERVIEW_CONFIG_SETTING_KEY, tl as LEGACY_ACTIVE_PACK_KEY, nl as LEGACY_CONFIG_KEY, el as LEGACY_PACK_KEY, il as MyeokDatabase, rl as PackImportValidationError, ml as Phase1StorageService, b as cognitiveDifficulties, ee as coverageTags, Tl as createAnswerCapture, El as createPhase1StorageService, g as endingModes, v as followupQuestionTypes, _c as generatorSchema, m as interestBiases, Ec as interviewPackSchema, xc as interviewerSchema, f as interviewerValues, yl as knownVoiceGender, vl as koreanVoices, _l as normalizeVoiceProfile, Tc as packIntegritySchema, d as personalityTraits, x as questionRelations, wc as questionSchema, y as questionTypes, l as recordEvidenceCategories, bc as recordEvidenceSchema, u as recordEvidenceTags, Cl as recordingExtension, wl as recordingFile, bl as resolveKoreanVoice, p as responseStyles, _ as rootQuestionTypes, te as runtimeTriggerTypes, Dc as schemaEnumSets, Sc as sessionPolicySchema, ne as sha256Bytes, yc as sourceRecordSchema, Sl as splitSpeechText, h as startModes, vc as targetSchema, re as utf8Bytes, Xc as validateInterviewPack, Yc as validatePackSemantics, xl as voiceDelivery };

//# sourceMappingURL=index.js.map