var sc = Object.defineProperty;
var ac = (r, e, t) => e in r ? sc(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var Me = (r, e, t) => ac(r, typeof e != "symbol" ? e + "" : e, t);
var hs, hr, ve, ua;
(function(r) {
  r.POST_MESSAGE = "postMessage";
})(hs || (hs = {})), (function(r) {
  r.SDK_ANGIE_READY_PING = "sdk-angie-ready-ping", r.SDK_REQUEST_CLIENT_CREATION = "sdk-request-client-creation", r.SDK_REQUEST_INIT_SERVER = "sdk-request-init-server";
})(hr || (hr = {}));
class ic {
  constructor() {
    Me(this, "isAngieReady", !1);
    Me(this, "readyPromise");
    Me(this, "readyResolve");
    if (this.readyPromise = new Promise(((n) => {
      this.readyResolve = n;
    })), typeof window > "u") return;
    let e = 0;
    const t = () => {
      if (this.isAngieReady || e >= 500) return void (!this.isAngieReady && e >= 500 && this.handleDetectionTimeout());
      const n = new MessageChannel();
      n.port1.onmessage = (a) => {
        this.handleAngieReady(a.data), n.port1.close(), n.port2.close();
      };
      const s = { type: hr.SDK_ANGIE_READY_PING, timestamp: Date.now() };
      window.postMessage(s, window.location.origin, [n.port2]), e++, setTimeout(t, 500);
    };
    t();
  }
  handleAngieReady(e) {
    this.isAngieReady = !0;
    const t = { isReady: !0, version: e.version, capabilities: e.capabilities };
    this.readyResolve && this.readyResolve(t);
  }
  handleDetectionTimeout() {
    this.readyResolve && this.readyResolve({ isReady: !1 }), console.warn("AngieMcpSdk: AngieDetector: Detection timeout - Angie may not be available");
  }
  isReady() {
    return this.isAngieReady;
  }
  async waitForReady() {
    return this.readyPromise;
  }
}
class oc {
  constructor() {
    Me(this, "queue", []);
    Me(this, "isProcessing", !1);
  }
  add(e) {
    const t = { id: this.generateId(e), config: e, timestamp: Date.now(), status: "pending" };
    return this.queue.push(t), console.log(`RegistrationQueue: Added server "${e.name}" to queue`), t;
  }
  getAll() {
    return [...this.queue];
  }
  getPending() {
    return this.queue.filter(((e) => e.status === "pending"));
  }
  updateStatus(e, t, n) {
    const s = this.queue.find(((a) => a.id === e));
    s && (s.status = t, n && (s.error = n), console.log(`RegistrationQueue: Updated server ${e} status to ${t}`));
  }
  async processQueue(e) {
    if (this.isProcessing) return void console.log("RegistrationQueue: Already processing queue");
    this.isProcessing = !0;
    const t = this.getPending();
    console.log(`RegistrationQueue: Processing ${t.length} pending registrations`);
    try {
      for (const n of t) try {
        await e(n), this.updateStatus(n.id, "registered");
      } catch (s) {
        const a = s instanceof Error ? s.message : String(s);
        this.updateStatus(n.id, "failed", a), console.error(`RegistrationQueue: Failed to process registration ${n.id}:`, a);
      }
    } finally {
      this.isProcessing = !1;
    }
  }
  clear() {
    this.queue = [], console.log("RegistrationQueue: Cleared all registrations");
  }
  remove(e) {
    const t = this.queue.findIndex(((n) => n.id === e));
    return t !== -1 && (this.queue.splice(t, 1), console.log(`RegistrationQueue: Removed registration ${e}`), !0);
  }
  generateId(e) {
    return `reg_${e.name}_${e.version}_${Date.now()}`;
  }
}
class cc {
  async requestClientCreation(e) {
    const { config: t } = e, n = { serverId: e.id, serverName: t.name, serverVersion: t.version, description: t.description, transport: hs.POST_MESSAGE, capabilities: t.capabilities };
    return new Promise(((s, a) => {
      const i = new MessageChannel(), o = setTimeout((() => {
        a(new Error("Client creation request timed out after 10000ms"));
      }), 1e4);
      i.port1.onmessage = (u) => {
        clearTimeout(o), s(u.data);
      };
      const c = { type: hr.SDK_REQUEST_CLIENT_CREATION, payload: n, timestamp: Date.now() };
      window.postMessage(c, window.location.origin, [i.port2]);
    }));
  }
}
(function(r) {
  r.assertEqual = (e) => {
  }, r.assertIs = function(e) {
  }, r.assertNever = function(e) {
    throw new Error();
  }, r.arrayToEnum = (e) => {
    const t = {};
    for (const n of e) t[n] = n;
    return t;
  }, r.getValidEnumValues = (e) => {
    const t = r.objectKeys(e).filter(((s) => typeof e[e[s]] != "number")), n = {};
    for (const s of t) n[s] = e[s];
    return r.objectValues(n);
  }, r.objectValues = (e) => r.objectKeys(e).map((function(t) {
    return e[t];
  })), r.objectKeys = typeof Object.keys == "function" ? (e) => Object.keys(e) : (e) => {
    const t = [];
    for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
    return t;
  }, r.find = (e, t) => {
    for (const n of e) if (t(n)) return n;
  }, r.isInteger = typeof Number.isInteger == "function" ? (e) => Number.isInteger(e) : (e) => typeof e == "number" && Number.isFinite(e) && Math.floor(e) === e, r.joinValues = function(e, t = " | ") {
    return e.map(((n) => typeof n == "string" ? `'${n}'` : n)).join(t);
  }, r.jsonStringifyReplacer = (e, t) => typeof t == "bigint" ? t.toString() : t;
})(ve || (ve = {})), (function(r) {
  r.mergeShapes = (e, t) => ({ ...e, ...t });
})(ua || (ua = {}));
const Q = ve.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]), Mt = (r) => {
  switch (typeof r) {
    case "undefined":
      return Q.undefined;
    case "string":
      return Q.string;
    case "number":
      return Number.isNaN(r) ? Q.nan : Q.number;
    case "boolean":
      return Q.boolean;
    case "function":
      return Q.function;
    case "bigint":
      return Q.bigint;
    case "symbol":
      return Q.symbol;
    case "object":
      return Array.isArray(r) ? Q.array : r === null ? Q.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? Q.promise : typeof Map < "u" && r instanceof Map ? Q.map : typeof Set < "u" && r instanceof Set ? Q.set : typeof Date < "u" && r instanceof Date ? Q.date : Q.object;
    default:
      return Q.unknown;
  }
}, q = ve.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
class Ot extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, n = { _errors: [] }, s = (a) => {
      for (const i of a.issues) if (i.code === "invalid_union") i.unionErrors.map(s);
      else if (i.code === "invalid_return_type") s(i.returnTypeError);
      else if (i.code === "invalid_arguments") s(i.argumentsError);
      else if (i.path.length === 0) n._errors.push(t(i));
      else {
        let o = n, c = 0;
        for (; c < i.path.length; ) {
          const u = i.path[c];
          c === i.path.length - 1 ? (o[u] = o[u] || { _errors: [] }, o[u]._errors.push(t(i))) : o[u] = o[u] || { _errors: [] }, o = o[u], c++;
        }
      }
    };
    return s(this), n;
  }
  static assert(e) {
    if (!(e instanceof Ot)) throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, ve.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const s of this.issues) s.path.length > 0 ? (t[s.path[0]] = t[s.path[0]] || [], t[s.path[0]].push(e(s))) : n.push(e(s));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
Ot.create = (r) => new Ot(r);
const ms = (r, e) => {
  let t;
  switch (r.code) {
    case q.invalid_type:
      t = r.received === Q.undefined ? "Required" : `Expected ${r.expected}, received ${r.received}`;
      break;
    case q.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, ve.jsonStringifyReplacer)}`;
      break;
    case q.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${ve.joinValues(r.keys, ", ")}`;
      break;
    case q.invalid_union:
      t = "Invalid input";
      break;
    case q.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${ve.joinValues(r.options)}`;
      break;
    case q.invalid_enum_value:
      t = `Invalid enum value. Expected ${ve.joinValues(r.options)}, received '${r.received}'`;
      break;
    case q.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case q.invalid_return_type:
      t = "Invalid function return type";
      break;
    case q.invalid_date:
      t = "Invalid date";
      break;
    case q.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : ve.assertNever(r.validation) : t = r.validation !== "regex" ? `Invalid ${r.validation}` : "Invalid";
      break;
    case q.too_small:
      t = r.type === "array" ? `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : "Invalid input";
      break;
    case q.too_big:
      t = r.type === "array" ? `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : "Invalid input";
      break;
    case q.custom:
      t = "Invalid input";
      break;
    case q.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case q.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case q.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, ve.assertNever(r);
  }
  return { message: t };
};
let uc = ms;
function K(r, e) {
  const t = uc, n = ((s) => {
    const { data: a, path: i, errorMaps: o, issueData: c } = s, u = [...i, ...c.path || []], l = { ...c, path: u };
    if (c.message !== void 0) return { ...c, path: u, message: c.message };
    let S = "";
    const w = o.filter(((v) => !!v)).slice().reverse();
    for (const v of w) S = v(l, { data: a, defaultError: S }).message;
    return { ...c, path: u, message: S };
  })({ issueData: e, data: r.data, path: r.path, errorMaps: [r.common.contextualErrorMap, r.schemaErrorMap, t, t === ms ? void 0 : ms].filter(((s) => !!s)) });
  r.common.issues.push(n);
}
class Be {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const n = [];
    for (const s of t) {
      if (s.status === "aborted") return ie;
      s.status === "dirty" && e.dirty(), n.push(s.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const s of t) {
      const a = await s.key, i = await s.value;
      n.push({ key: a, value: i });
    }
    return Be.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const s of t) {
      const { key: a, value: i } = s;
      if (a.status === "aborted" || i.status === "aborted") return ie;
      a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), a.value === "__proto__" || i.value === void 0 && !s.alwaysSet || (n[a.value] = i.value);
    }
    return { status: e.value, value: n };
  }
}
const ie = Object.freeze({ status: "aborted" }), ps = (r) => ({ status: "dirty", value: r }), nt = (r) => ({ status: "valid", value: r }), da = (r) => r.status === "aborted", la = (r) => r.status === "dirty", nr = (r) => r.status === "valid", fn = (r) => typeof Promise < "u" && r instanceof Promise;
var re;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(re || (re = {}));
class _t {
  constructor(e, t, n, s) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = s;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const fa = (r, e) => {
  if (nr(e)) return { success: !0, data: e.value };
  if (!r.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return { success: !1, get error() {
    if (this._error) return this._error;
    const t = new Ot(r.common.issues);
    return this._error = t, this._error;
  } };
};
function le(r) {
  if (!r) return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: s } = r;
  if (e && (t || n)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (a, i) => {
    const { message: o } = r;
    return a.code === "invalid_enum_value" ? { message: o ?? i.defaultError } : i.data === void 0 ? { message: o ?? n ?? i.defaultError } : a.code !== "invalid_type" ? { message: i.defaultError } : { message: o ?? t ?? i.defaultError };
  }, description: s };
}
class ye {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Mt(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || { common: e.parent.common, data: e.data, parsedType: Mt(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent };
  }
  _processInputParams(e) {
    return { status: new Be(), ctx: { common: e.parent.common, data: e.data, parsedType: Mt(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent } };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (fn(t)) throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success) return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    const n = { common: { issues: [], async: (t == null ? void 0 : t.async) ?? !1, contextualErrorMap: t == null ? void 0 : t.errorMap }, path: (t == null ? void 0 : t.path) || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: Mt(e) }, s = this._parseSync({ data: e, path: n.path, parent: n });
    return fa(n, s);
  }
  "~validate"(e) {
    var n, s;
    const t = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: Mt(e) };
    if (!this["~standard"].async) try {
      const a = this._parseSync({ data: e, path: [], parent: t });
      return nr(a) ? { value: a.value } : { issues: t.common.issues };
    } catch (a) {
      (s = (n = a == null ? void 0 : a.message) == null ? void 0 : n.toLowerCase()) != null && s.includes("encountered") && (this["~standard"].async = !0), t.common = { issues: [], async: !0 };
    }
    return this._parseAsync({ data: e, path: [], parent: t }).then(((a) => nr(a) ? { value: a.value } : { issues: t.common.issues }));
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success) return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = { common: { issues: [], contextualErrorMap: t == null ? void 0 : t.errorMap, async: !0 }, path: (t == null ? void 0 : t.path) || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: Mt(e) }, s = this._parse({ data: e, path: n.path, parent: n }), a = await (fn(s) ? s : Promise.resolve(s));
    return fa(n, a);
  }
  refine(e, t) {
    const n = (s) => typeof t == "string" || t === void 0 ? { message: t } : typeof t == "function" ? t(s) : t;
    return this._refinement(((s, a) => {
      const i = e(s), o = () => a.addIssue({ code: q.custom, ...n(s) });
      return typeof Promise < "u" && i instanceof Promise ? i.then(((c) => !!c || (o(), !1))) : !!i || (o(), !1);
    }));
  }
  refinement(e, t) {
    return this._refinement(((n, s) => !!e(n) || (s.addIssue(typeof t == "function" ? t(n, s) : t), !1)));
  }
  _refinement(e) {
    return new Ut({ schema: this, typeName: ce.ZodEffects, effect: { type: "refinement", refinement: e } });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = { version: 1, vendor: "zod", validate: (t) => this["~validate"](t) };
  }
  optional() {
    return xt.create(this, this._def);
  }
  nullable() {
    return Bt.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return gt.create(this);
  }
  promise() {
    return yn.create(this, this._def);
  }
  or(e) {
    return mn.create([this, e], this._def);
  }
  and(e) {
    return pn.create(this, e, this._def);
  }
  transform(e) {
    return new Ut({ ...le(this._def), schema: this, typeName: ce.ZodEffects, effect: { type: "transform", transform: e } });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new _n({ ...le(this._def), innerType: this, defaultValue: t, typeName: ce.ZodDefault });
  }
  brand() {
    return new io({ typeName: ce.ZodBranded, type: this, ...le(this._def) });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new vn({ ...le(this._def), innerType: this, catchValue: t, typeName: ce.ZodCatch });
  }
  describe(e) {
    return new this.constructor({ ...this._def, description: e });
  }
  pipe(e) {
    return Fs.create(this, e);
  }
  readonly() {
    return bn.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const dc = /^c[^\s-]{8,}$/i, lc = /^[0-9a-z]+$/, fc = /^[0-9A-HJKMNP-TV-Z]{26}$/i, hc = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, mc = /^[a-z0-9_-]{21}$/i, pc = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, gc = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, yc = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
let Qn;
const _c = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, vc = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, bc = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, wc = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, $c = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, kc = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, no = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Sc = new RegExp(`^${no}$`);
function so(r) {
  let e = "[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), `([01]\\d|2[0-3]):[0-5]\\d(:${e})${r.precision ? "+" : "?"}`;
}
function Pc(r) {
  let e = `${no}T${so(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Rc(r, e) {
  if (!pc.test(r)) return !1;
  try {
    const [t] = r.split("."), n = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), s = JSON.parse(atob(n));
    return !(typeof s != "object" || s === null || "typ" in s && (s == null ? void 0 : s.typ) !== "JWT" || !s.alg || e && s.alg !== e);
  } catch {
    return !1;
  }
}
function Tc(r, e) {
  return !(e !== "v4" && e || !vc.test(r)) || !(e !== "v6" && e || !wc.test(r));
}
class Tt extends ye {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== Q.string) {
      const i = this._getOrReturnCtx(e);
      return K(i, { code: q.invalid_type, expected: Q.string, received: i.parsedType }), ie;
    }
    const t = new Be();
    let n;
    for (const i of this._def.checks) if (i.kind === "min") e.data.length < i.value && (n = this._getOrReturnCtx(e, n), K(n, { code: q.too_small, minimum: i.value, type: "string", inclusive: !0, exact: !1, message: i.message }), t.dirty());
    else if (i.kind === "max") e.data.length > i.value && (n = this._getOrReturnCtx(e, n), K(n, { code: q.too_big, maximum: i.value, type: "string", inclusive: !0, exact: !1, message: i.message }), t.dirty());
    else if (i.kind === "length") {
      const o = e.data.length > i.value, c = e.data.length < i.value;
      (o || c) && (n = this._getOrReturnCtx(e, n), o ? K(n, { code: q.too_big, maximum: i.value, type: "string", inclusive: !0, exact: !0, message: i.message }) : c && K(n, { code: q.too_small, minimum: i.value, type: "string", inclusive: !0, exact: !0, message: i.message }), t.dirty());
    } else if (i.kind === "email") yc.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "email", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "emoji") Qn || (Qn = new RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), Qn.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "emoji", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "uuid") hc.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "uuid", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "nanoid") mc.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "nanoid", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "cuid") dc.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "cuid", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "cuid2") lc.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "cuid2", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "ulid") fc.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "ulid", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "url") try {
      new URL(e.data);
    } catch {
      n = this._getOrReturnCtx(e, n), K(n, { validation: "url", code: q.invalid_string, message: i.message }), t.dirty();
    }
    else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "regex", code: q.invalid_string, message: i.message }), t.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (n = this._getOrReturnCtx(e, n), K(n, { code: q.invalid_string, validation: { includes: i.value, position: i.position }, message: i.message }), t.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (n = this._getOrReturnCtx(e, n), K(n, { code: q.invalid_string, validation: { startsWith: i.value }, message: i.message }), t.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (n = this._getOrReturnCtx(e, n), K(n, { code: q.invalid_string, validation: { endsWith: i.value }, message: i.message }), t.dirty()) : i.kind === "datetime" ? Pc(i).test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { code: q.invalid_string, validation: "datetime", message: i.message }), t.dirty()) : i.kind === "date" ? Sc.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { code: q.invalid_string, validation: "date", message: i.message }), t.dirty()) : i.kind === "time" ? new RegExp(`^${so(i)}$`).test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { code: q.invalid_string, validation: "time", message: i.message }), t.dirty()) : i.kind === "duration" ? gc.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "duration", code: q.invalid_string, message: i.message }), t.dirty()) : i.kind === "ip" ? (s = e.data, ((a = i.version) !== "v4" && a || !_c.test(s)) && (a !== "v6" && a || !bc.test(s)) && (n = this._getOrReturnCtx(e, n), K(n, { validation: "ip", code: q.invalid_string, message: i.message }), t.dirty())) : i.kind === "jwt" ? Rc(e.data, i.alg) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "jwt", code: q.invalid_string, message: i.message }), t.dirty()) : i.kind === "cidr" ? Tc(e.data, i.version) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "cidr", code: q.invalid_string, message: i.message }), t.dirty()) : i.kind === "base64" ? $c.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "base64", code: q.invalid_string, message: i.message }), t.dirty()) : i.kind === "base64url" ? kc.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, { validation: "base64url", code: q.invalid_string, message: i.message }), t.dirty()) : ve.assertNever(i);
    var s, a;
    return { status: t.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement(((s) => e.test(s)), { validation: t, code: q.invalid_string, ...re.errToObj(n) });
  }
  _addCheck(e) {
    return new Tt({ ...this._def, checks: [...this._def.checks, e] });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...re.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...re.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...re.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...re.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...re.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...re.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...re.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...re.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...re.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({ kind: "base64url", ...re.errToObj(e) });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...re.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...re.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...re.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({ kind: "datetime", precision: null, offset: !1, local: !1, message: e }) : this._addCheck({ kind: "datetime", precision: (e == null ? void 0 : e.precision) === void 0 ? null : e == null ? void 0 : e.precision, offset: (e == null ? void 0 : e.offset) ?? !1, local: (e == null ? void 0 : e.local) ?? !1, ...re.errToObj(e == null ? void 0 : e.message) });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({ kind: "time", precision: null, message: e }) : this._addCheck({ kind: "time", precision: (e == null ? void 0 : e.precision) === void 0 ? null : e == null ? void 0 : e.precision, ...re.errToObj(e == null ? void 0 : e.message) });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...re.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({ kind: "regex", regex: e, ...re.errToObj(t) });
  }
  includes(e, t) {
    return this._addCheck({ kind: "includes", value: e, position: t == null ? void 0 : t.position, ...re.errToObj(t == null ? void 0 : t.message) });
  }
  startsWith(e, t) {
    return this._addCheck({ kind: "startsWith", value: e, ...re.errToObj(t) });
  }
  endsWith(e, t) {
    return this._addCheck({ kind: "endsWith", value: e, ...re.errToObj(t) });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e, ...re.errToObj(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e, ...re.errToObj(t) });
  }
  length(e, t) {
    return this._addCheck({ kind: "length", value: e, ...re.errToObj(t) });
  }
  nonempty(e) {
    return this.min(1, re.errToObj(e));
  }
  trim() {
    return new Tt({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new Tt({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new Tt({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
  }
  get isDatetime() {
    return !!this._def.checks.find(((e) => e.kind === "datetime"));
  }
  get isDate() {
    return !!this._def.checks.find(((e) => e.kind === "date"));
  }
  get isTime() {
    return !!this._def.checks.find(((e) => e.kind === "time"));
  }
  get isDuration() {
    return !!this._def.checks.find(((e) => e.kind === "duration"));
  }
  get isEmail() {
    return !!this._def.checks.find(((e) => e.kind === "email"));
  }
  get isURL() {
    return !!this._def.checks.find(((e) => e.kind === "url"));
  }
  get isEmoji() {
    return !!this._def.checks.find(((e) => e.kind === "emoji"));
  }
  get isUUID() {
    return !!this._def.checks.find(((e) => e.kind === "uuid"));
  }
  get isNANOID() {
    return !!this._def.checks.find(((e) => e.kind === "nanoid"));
  }
  get isCUID() {
    return !!this._def.checks.find(((e) => e.kind === "cuid"));
  }
  get isCUID2() {
    return !!this._def.checks.find(((e) => e.kind === "cuid2"));
  }
  get isULID() {
    return !!this._def.checks.find(((e) => e.kind === "ulid"));
  }
  get isIP() {
    return !!this._def.checks.find(((e) => e.kind === "ip"));
  }
  get isCIDR() {
    return !!this._def.checks.find(((e) => e.kind === "cidr"));
  }
  get isBase64() {
    return !!this._def.checks.find(((e) => e.kind === "base64"));
  }
  get isBase64url() {
    return !!this._def.checks.find(((e) => e.kind === "base64url"));
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
function Ec(r, e) {
  const t = (r.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, s = t > n ? t : n;
  return Number.parseInt(r.toFixed(s).replace(".", "")) % Number.parseInt(e.toFixed(s).replace(".", "")) / 10 ** s;
}
Tt.create = (r) => new Tt({ checks: [], typeName: ce.ZodString, coerce: (r == null ? void 0 : r.coerce) ?? !1, ...le(r) });
class sr extends ye {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== Q.number) {
      const s = this._getOrReturnCtx(e);
      return K(s, { code: q.invalid_type, expected: Q.number, received: s.parsedType }), ie;
    }
    let t;
    const n = new Be();
    for (const s of this._def.checks) s.kind === "int" ? ve.isInteger(e.data) || (t = this._getOrReturnCtx(e, t), K(t, { code: q.invalid_type, expected: "integer", received: "float", message: s.message }), n.dirty()) : s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (t = this._getOrReturnCtx(e, t), K(t, { code: q.too_small, minimum: s.value, type: "number", inclusive: s.inclusive, exact: !1, message: s.message }), n.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (t = this._getOrReturnCtx(e, t), K(t, { code: q.too_big, maximum: s.value, type: "number", inclusive: s.inclusive, exact: !1, message: s.message }), n.dirty()) : s.kind === "multipleOf" ? Ec(e.data, s.value) !== 0 && (t = this._getOrReturnCtx(e, t), K(t, { code: q.not_multiple_of, multipleOf: s.value, message: s.message }), n.dirty()) : s.kind === "finite" ? Number.isFinite(e.data) || (t = this._getOrReturnCtx(e, t), K(t, { code: q.not_finite, message: s.message }), n.dirty()) : ve.assertNever(s);
    return { status: n.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, re.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, re.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, re.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, re.toString(t));
  }
  setLimit(e, t, n, s) {
    return new sr({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: n, message: re.toString(s) }] });
  }
  _addCheck(e) {
    return new sr({ ...this._def, checks: [...this._def.checks, e] });
  }
  int(e) {
    return this._addCheck({ kind: "int", message: re.toString(e) });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: !1, message: re.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: !1, message: re.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: !0, message: re.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: !0, message: re.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: re.toString(t) });
  }
  finite(e) {
    return this._addCheck({ kind: "finite", message: re.toString(e) });
  }
  safe(e) {
    return this._addCheck({ kind: "min", inclusive: !0, value: Number.MIN_SAFE_INTEGER, message: re.toString(e) })._addCheck({ kind: "max", inclusive: !0, value: Number.MAX_SAFE_INTEGER, message: re.toString(e) });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find(((e) => e.kind === "int" || e.kind === "multipleOf" && ve.isInteger(e.value)));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf") return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
sr.create = (r) => new sr({ checks: [], typeName: ce.ZodNumber, coerce: (r == null ? void 0 : r.coerce) || !1, ...le(r) });
class mr extends ye {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce) try {
      e.data = BigInt(e.data);
    } catch {
      return this._getInvalidInput(e);
    }
    if (this._getType(e) !== Q.bigint) return this._getInvalidInput(e);
    let t;
    const n = new Be();
    for (const s of this._def.checks) s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (t = this._getOrReturnCtx(e, t), K(t, { code: q.too_small, type: "bigint", minimum: s.value, inclusive: s.inclusive, message: s.message }), n.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (t = this._getOrReturnCtx(e, t), K(t, { code: q.too_big, type: "bigint", maximum: s.value, inclusive: s.inclusive, message: s.message }), n.dirty()) : s.kind === "multipleOf" ? e.data % s.value !== BigInt(0) && (t = this._getOrReturnCtx(e, t), K(t, { code: q.not_multiple_of, multipleOf: s.value, message: s.message }), n.dirty()) : ve.assertNever(s);
    return { status: n.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return K(t, { code: q.invalid_type, expected: Q.bigint, received: t.parsedType }), ie;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, re.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, re.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, re.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, re.toString(t));
  }
  setLimit(e, t, n, s) {
    return new mr({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: n, message: re.toString(s) }] });
  }
  _addCheck(e) {
    return new mr({ ...this._def, checks: [...this._def.checks, e] });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: !1, message: re.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: !1, message: re.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: !0, message: re.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: !0, message: re.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: re.toString(t) });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
mr.create = (r) => new mr({ checks: [], typeName: ce.ZodBigInt, coerce: (r == null ? void 0 : r.coerce) ?? !1, ...le(r) });
class gs extends ye {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== Q.boolean) {
      const t = this._getOrReturnCtx(e);
      return K(t, { code: q.invalid_type, expected: Q.boolean, received: t.parsedType }), ie;
    }
    return nt(e.data);
  }
}
gs.create = (r) => new gs({ typeName: ce.ZodBoolean, coerce: (r == null ? void 0 : r.coerce) || !1, ...le(r) });
class hn extends ye {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== Q.date) {
      const s = this._getOrReturnCtx(e);
      return K(s, { code: q.invalid_type, expected: Q.date, received: s.parsedType }), ie;
    }
    if (Number.isNaN(e.data.getTime())) return K(this._getOrReturnCtx(e), { code: q.invalid_date }), ie;
    const t = new Be();
    let n;
    for (const s of this._def.checks) s.kind === "min" ? e.data.getTime() < s.value && (n = this._getOrReturnCtx(e, n), K(n, { code: q.too_small, message: s.message, inclusive: !0, exact: !1, minimum: s.value, type: "date" }), t.dirty()) : s.kind === "max" ? e.data.getTime() > s.value && (n = this._getOrReturnCtx(e, n), K(n, { code: q.too_big, message: s.message, inclusive: !0, exact: !1, maximum: s.value, type: "date" }), t.dirty()) : ve.assertNever(s);
    return { status: t.value, value: new Date(e.data.getTime()) };
  }
  _addCheck(e) {
    return new hn({ ...this._def, checks: [...this._def.checks, e] });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e.getTime(), message: re.toString(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e.getTime(), message: re.toString(t) });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
hn.create = (r) => new hn({ checks: [], coerce: (r == null ? void 0 : r.coerce) || !1, typeName: ce.ZodDate, ...le(r) });
class ha extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.symbol) {
      const t = this._getOrReturnCtx(e);
      return K(t, { code: q.invalid_type, expected: Q.symbol, received: t.parsedType }), ie;
    }
    return nt(e.data);
  }
}
ha.create = (r) => new ha({ typeName: ce.ZodSymbol, ...le(r) });
class ys extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.undefined) {
      const t = this._getOrReturnCtx(e);
      return K(t, { code: q.invalid_type, expected: Q.undefined, received: t.parsedType }), ie;
    }
    return nt(e.data);
  }
}
ys.create = (r) => new ys({ typeName: ce.ZodUndefined, ...le(r) });
class _s extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.null) {
      const t = this._getOrReturnCtx(e);
      return K(t, { code: q.invalid_type, expected: Q.null, received: t.parsedType }), ie;
    }
    return nt(e.data);
  }
}
_s.create = (r) => new _s({ typeName: ce.ZodNull, ...le(r) });
class ma extends ye {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return nt(e.data);
  }
}
ma.create = (r) => new ma({ typeName: ce.ZodAny, ...le(r) });
class vs extends ye {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return nt(e.data);
  }
}
vs.create = (r) => new vs({ typeName: ce.ZodUnknown, ...le(r) });
class Dt extends ye {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return K(t, { code: q.invalid_type, expected: Q.never, received: t.parsedType }), ie;
  }
}
Dt.create = (r) => new Dt({ typeName: ce.ZodNever, ...le(r) });
class pa extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.undefined) {
      const t = this._getOrReturnCtx(e);
      return K(t, { code: q.invalid_type, expected: Q.void, received: t.parsedType }), ie;
    }
    return nt(e.data);
  }
}
pa.create = (r) => new pa({ typeName: ce.ZodVoid, ...le(r) });
class gt extends ye {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), s = this._def;
    if (t.parsedType !== Q.array) return K(t, { code: q.invalid_type, expected: Q.array, received: t.parsedType }), ie;
    if (s.exactLength !== null) {
      const i = t.data.length > s.exactLength.value, o = t.data.length < s.exactLength.value;
      (i || o) && (K(t, { code: i ? q.too_big : q.too_small, minimum: o ? s.exactLength.value : void 0, maximum: i ? s.exactLength.value : void 0, type: "array", inclusive: !0, exact: !0, message: s.exactLength.message }), n.dirty());
    }
    if (s.minLength !== null && t.data.length < s.minLength.value && (K(t, { code: q.too_small, minimum: s.minLength.value, type: "array", inclusive: !0, exact: !1, message: s.minLength.message }), n.dirty()), s.maxLength !== null && t.data.length > s.maxLength.value && (K(t, { code: q.too_big, maximum: s.maxLength.value, type: "array", inclusive: !0, exact: !1, message: s.maxLength.message }), n.dirty()), t.common.async) return Promise.all([...t.data].map(((i, o) => s.type._parseAsync(new _t(t, i, t.path, o))))).then(((i) => Be.mergeArray(n, i)));
    const a = [...t.data].map(((i, o) => s.type._parseSync(new _t(t, i, t.path, o))));
    return Be.mergeArray(n, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new gt({ ...this._def, minLength: { value: e, message: re.toString(t) } });
  }
  max(e, t) {
    return new gt({ ...this._def, maxLength: { value: e, message: re.toString(t) } });
  }
  length(e, t) {
    return new gt({ ...this._def, exactLength: { value: e, message: re.toString(t) } });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
function tr(r) {
  if (r instanceof Oe) {
    const e = {};
    for (const t in r.shape) {
      const n = r.shape[t];
      e[t] = xt.create(tr(n));
    }
    return new Oe({ ...r._def, shape: () => e });
  }
  return r instanceof gt ? new gt({ ...r._def, type: tr(r.element) }) : r instanceof xt ? xt.create(tr(r.unwrap())) : r instanceof Bt ? Bt.create(tr(r.unwrap())) : r instanceof Ht ? Ht.create(r.items.map(((e) => tr(e)))) : r;
}
gt.create = (r, e) => new gt({ type: r, minLength: null, maxLength: null, exactLength: null, typeName: ce.ZodArray, ...le(e) });
class Oe extends ye {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    const e = this._def.shape(), t = ve.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== Q.object) {
      const c = this._getOrReturnCtx(e);
      return K(c, { code: q.invalid_type, expected: Q.object, received: c.parsedType }), ie;
    }
    const { status: t, ctx: n } = this._processInputParams(e), { shape: s, keys: a } = this._getCached(), i = [];
    if (!(this._def.catchall instanceof Dt && this._def.unknownKeys === "strip")) for (const c in n.data) a.includes(c) || i.push(c);
    const o = [];
    for (const c of a) {
      const u = s[c], l = n.data[c];
      o.push({ key: { status: "valid", value: c }, value: u._parse(new _t(n, l, n.path, c)), alwaysSet: c in n.data });
    }
    if (this._def.catchall instanceof Dt) {
      const c = this._def.unknownKeys;
      if (c === "passthrough") for (const u of i) o.push({ key: { status: "valid", value: u }, value: { status: "valid", value: n.data[u] } });
      else if (c === "strict") i.length > 0 && (K(n, { code: q.unrecognized_keys, keys: i }), t.dirty());
      else if (c !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const u of i) {
        const l = n.data[u];
        o.push({ key: { status: "valid", value: u }, value: c._parse(new _t(n, l, n.path, u)), alwaysSet: u in n.data });
      }
    }
    return n.common.async ? Promise.resolve().then((async () => {
      const c = [];
      for (const u of o) {
        const l = await u.key, S = await u.value;
        c.push({ key: l, value: S, alwaysSet: u.alwaysSet });
      }
      return c;
    })).then(((c) => Be.mergeObjectSync(t, c))) : Be.mergeObjectSync(t, o);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return re.errToObj, new Oe({ ...this._def, unknownKeys: "strict", ...e !== void 0 ? { errorMap: (t, n) => {
      var a, i;
      const s = ((i = (a = this._def).errorMap) == null ? void 0 : i.call(a, t, n).message) ?? n.defaultError;
      return t.code === "unrecognized_keys" ? { message: re.errToObj(e).message ?? s } : { message: s };
    } } : {} });
  }
  strip() {
    return new Oe({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new Oe({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(e) {
    return new Oe({ ...this._def, shape: () => ({ ...this._def.shape(), ...e }) });
  }
  merge(e) {
    return new Oe({ unknownKeys: e._def.unknownKeys, catchall: e._def.catchall, shape: () => ({ ...this._def.shape(), ...e._def.shape() }), typeName: ce.ZodObject });
  }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  catchall(e) {
    return new Oe({ ...this._def, catchall: e });
  }
  pick(e) {
    const t = {};
    for (const n of ve.objectKeys(e)) e[n] && this.shape[n] && (t[n] = this.shape[n]);
    return new Oe({ ...this._def, shape: () => t });
  }
  omit(e) {
    const t = {};
    for (const n of ve.objectKeys(this.shape)) e[n] || (t[n] = this.shape[n]);
    return new Oe({ ...this._def, shape: () => t });
  }
  deepPartial() {
    return tr(this);
  }
  partial(e) {
    const t = {};
    for (const n of ve.objectKeys(this.shape)) {
      const s = this.shape[n];
      e && !e[n] ? t[n] = s : t[n] = s.optional();
    }
    return new Oe({ ...this._def, shape: () => t });
  }
  required(e) {
    const t = {};
    for (const n of ve.objectKeys(this.shape)) if (e && !e[n]) t[n] = this.shape[n];
    else {
      let s = this.shape[n];
      for (; s instanceof xt; ) s = s._def.innerType;
      t[n] = s;
    }
    return new Oe({ ...this._def, shape: () => t });
  }
  keyof() {
    return ao(ve.objectKeys(this.shape));
  }
}
Oe.create = (r, e) => new Oe({ shape: () => r, unknownKeys: "strip", catchall: Dt.create(), typeName: ce.ZodObject, ...le(e) }), Oe.strictCreate = (r, e) => new Oe({ shape: () => r, unknownKeys: "strict", catchall: Dt.create(), typeName: ce.ZodObject, ...le(e) }), Oe.lazycreate = (r, e) => new Oe({ shape: r, unknownKeys: "strip", catchall: Dt.create(), typeName: ce.ZodObject, ...le(e) });
class mn extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    if (t.common.async) return Promise.all(n.map((async (s) => {
      const a = { ...t, common: { ...t.common, issues: [] }, parent: null };
      return { result: await s._parseAsync({ data: t.data, path: t.path, parent: a }), ctx: a };
    }))).then((function(s) {
      for (const i of s) if (i.result.status === "valid") return i.result;
      for (const i of s) if (i.result.status === "dirty") return t.common.issues.push(...i.ctx.common.issues), i.result;
      const a = s.map(((i) => new Ot(i.ctx.common.issues)));
      return K(t, { code: q.invalid_union, unionErrors: a }), ie;
    }));
    {
      let s;
      const a = [];
      for (const o of n) {
        const c = { ...t, common: { ...t.common, issues: [] }, parent: null }, u = o._parseSync({ data: t.data, path: t.path, parent: c });
        if (u.status === "valid") return u;
        u.status !== "dirty" || s || (s = { result: u, ctx: c }), c.common.issues.length && a.push(c.common.issues);
      }
      if (s) return t.common.issues.push(...s.ctx.common.issues), s.result;
      const i = a.map(((o) => new Ot(o)));
      return K(t, { code: q.invalid_union, unionErrors: i }), ie;
    }
  }
  get options() {
    return this._def.options;
  }
}
mn.create = (r, e) => new mn({ options: r, typeName: ce.ZodUnion, ...le(e) });
const jt = (r) => r instanceof ws ? jt(r.schema) : r instanceof Ut ? jt(r.innerType()) : r instanceof gn ? [r.value] : r instanceof Kt ? r.options : r instanceof $s ? ve.objectValues(r.enum) : r instanceof _n ? jt(r._def.innerType) : r instanceof ys ? [void 0] : r instanceof _s ? [null] : r instanceof xt ? [void 0, ...jt(r.unwrap())] : r instanceof Bt ? [null, ...jt(r.unwrap())] : r instanceof io || r instanceof bn ? jt(r.unwrap()) : r instanceof vn ? jt(r._def.innerType) : [];
class Ls extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== Q.object) return K(t, { code: q.invalid_type, expected: Q.object, received: t.parsedType }), ie;
    const n = this.discriminator, s = t.data[n], a = this.optionsMap.get(s);
    return a ? t.common.async ? a._parseAsync({ data: t.data, path: t.path, parent: t }) : a._parseSync({ data: t.data, path: t.path, parent: t }) : (K(t, { code: q.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [n] }), ie);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(e, t, n) {
    const s = /* @__PURE__ */ new Map();
    for (const a of t) {
      const i = jt(a.shape[e]);
      if (!i.length) throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of i) {
        if (s.has(o)) throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        s.set(o, a);
      }
    }
    return new Ls({ typeName: ce.ZodDiscriminatedUnion, discriminator: e, options: t, optionsMap: s, ...le(n) });
  }
}
function bs(r, e) {
  const t = Mt(r), n = Mt(e);
  if (r === e) return { valid: !0, data: r };
  if (t === Q.object && n === Q.object) {
    const s = ve.objectKeys(e), a = ve.objectKeys(r).filter(((o) => s.indexOf(o) !== -1)), i = { ...r, ...e };
    for (const o of a) {
      const c = bs(r[o], e[o]);
      if (!c.valid) return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  }
  if (t === Q.array && n === Q.array) {
    if (r.length !== e.length) return { valid: !1 };
    const s = [];
    for (let a = 0; a < r.length; a++) {
      const i = bs(r[a], e[a]);
      if (!i.valid) return { valid: !1 };
      s.push(i.data);
    }
    return { valid: !0, data: s };
  }
  return t === Q.date && n === Q.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class pn extends ye {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), s = (a, i) => {
      if (da(a) || da(i)) return ie;
      const o = bs(a.value, i.value);
      return o.valid ? ((la(a) || la(i)) && t.dirty(), { status: t.value, value: o.data }) : (K(n, { code: q.invalid_intersection_types }), ie);
    };
    return n.common.async ? Promise.all([this._def.left._parseAsync({ data: n.data, path: n.path, parent: n }), this._def.right._parseAsync({ data: n.data, path: n.path, parent: n })]).then((([a, i]) => s(a, i))) : s(this._def.left._parseSync({ data: n.data, path: n.path, parent: n }), this._def.right._parseSync({ data: n.data, path: n.path, parent: n }));
  }
}
pn.create = (r, e, t) => new pn({ left: r, right: e, typeName: ce.ZodIntersection, ...le(t) });
class Ht extends ye {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== Q.array) return K(n, { code: q.invalid_type, expected: Q.array, received: n.parsedType }), ie;
    if (n.data.length < this._def.items.length) return K(n, { code: q.too_small, minimum: this._def.items.length, inclusive: !0, exact: !1, type: "array" }), ie;
    !this._def.rest && n.data.length > this._def.items.length && (K(n, { code: q.too_big, maximum: this._def.items.length, inclusive: !0, exact: !1, type: "array" }), t.dirty());
    const s = [...n.data].map(((a, i) => {
      const o = this._def.items[i] || this._def.rest;
      return o ? o._parse(new _t(n, a, n.path, i)) : null;
    })).filter(((a) => !!a));
    return n.common.async ? Promise.all(s).then(((a) => Be.mergeArray(t, a))) : Be.mergeArray(t, s);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Ht({ ...this._def, rest: e });
  }
}
Ht.create = (r, e) => {
  if (!Array.isArray(r)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Ht({ items: r, typeName: ce.ZodTuple, rest: null, ...le(e) });
};
class Vs extends ye {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== Q.object) return K(n, { code: q.invalid_type, expected: Q.object, received: n.parsedType }), ie;
    const s = [], a = this._def.keyType, i = this._def.valueType;
    for (const o in n.data) s.push({ key: a._parse(new _t(n, o, n.path, o)), value: i._parse(new _t(n, n.data[o], n.path, o)), alwaysSet: o in n.data });
    return n.common.async ? Be.mergeObjectAsync(t, s) : Be.mergeObjectSync(t, s);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return new Vs(t instanceof ye ? { keyType: e, valueType: t, typeName: ce.ZodRecord, ...le(n) } : { keyType: Tt.create(), valueType: e, typeName: ce.ZodRecord, ...le(t) });
  }
}
class ga extends ye {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== Q.map) return K(n, { code: q.invalid_type, expected: Q.map, received: n.parsedType }), ie;
    const s = this._def.keyType, a = this._def.valueType, i = [...n.data.entries()].map((([o, c], u) => ({ key: s._parse(new _t(n, o, n.path, [u, "key"])), value: a._parse(new _t(n, c, n.path, [u, "value"])) })));
    if (n.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then((async () => {
        for (const c of i) {
          const u = await c.key, l = await c.value;
          if (u.status === "aborted" || l.status === "aborted") return ie;
          u.status !== "dirty" && l.status !== "dirty" || t.dirty(), o.set(u.value, l.value);
        }
        return { status: t.value, value: o };
      }));
    }
    {
      const o = /* @__PURE__ */ new Map();
      for (const c of i) {
        const u = c.key, l = c.value;
        if (u.status === "aborted" || l.status === "aborted") return ie;
        u.status !== "dirty" && l.status !== "dirty" || t.dirty(), o.set(u.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
ga.create = (r, e, t) => new ga({ valueType: e, keyType: r, typeName: ce.ZodMap, ...le(t) });
class pr extends ye {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== Q.set) return K(n, { code: q.invalid_type, expected: Q.set, received: n.parsedType }), ie;
    const s = this._def;
    s.minSize !== null && n.data.size < s.minSize.value && (K(n, { code: q.too_small, minimum: s.minSize.value, type: "set", inclusive: !0, exact: !1, message: s.minSize.message }), t.dirty()), s.maxSize !== null && n.data.size > s.maxSize.value && (K(n, { code: q.too_big, maximum: s.maxSize.value, type: "set", inclusive: !0, exact: !1, message: s.maxSize.message }), t.dirty());
    const a = this._def.valueType;
    function i(c) {
      const u = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted") return ie;
        l.status === "dirty" && t.dirty(), u.add(l.value);
      }
      return { status: t.value, value: u };
    }
    const o = [...n.data.values()].map(((c, u) => a._parse(new _t(n, c, n.path, u))));
    return n.common.async ? Promise.all(o).then(((c) => i(c))) : i(o);
  }
  min(e, t) {
    return new pr({ ...this._def, minSize: { value: e, message: re.toString(t) } });
  }
  max(e, t) {
    return new pr({ ...this._def, maxSize: { value: e, message: re.toString(t) } });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
pr.create = (r, e) => new pr({ valueType: r, minSize: null, maxSize: null, typeName: ce.ZodSet, ...le(e) });
class ws extends ye {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
ws.create = (r, e) => new ws({ getter: r, typeName: ce.ZodLazy, ...le(e) });
class gn extends ye {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return K(t, { received: t.data, code: q.invalid_literal, expected: this._def.value }), ie;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
function ao(r, e) {
  return new Kt({ values: r, typeName: ce.ZodEnum, ...le(e) });
}
gn.create = (r, e) => new gn({ value: r, typeName: ce.ZodLiteral, ...le(e) });
class Kt extends ye {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return K(t, { expected: ve.joinValues(n), received: t.parsedType, code: q.invalid_type }), ie;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return K(t, { received: t.data, code: q.invalid_enum_value, options: n }), ie;
    }
    return nt(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values) e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values) e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values) e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return Kt.create(e, { ...this._def, ...t });
  }
  exclude(e, t = this._def) {
    return Kt.create(this.options.filter(((n) => !e.includes(n))), { ...this._def, ...t });
  }
}
Kt.create = ao;
class $s extends ye {
  _parse(e) {
    const t = ve.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== Q.string && n.parsedType !== Q.number) {
      const s = ve.objectValues(t);
      return K(n, { expected: ve.joinValues(s), received: n.parsedType, code: q.invalid_type }), ie;
    }
    if (this._cache || (this._cache = new Set(ve.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const s = ve.objectValues(t);
      return K(n, { received: n.data, code: q.invalid_enum_value, options: s }), ie;
    }
    return nt(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
$s.create = (r, e) => new $s({ values: r, typeName: ce.ZodNativeEnum, ...le(e) });
class yn extends ye {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== Q.promise && t.common.async === !1) return K(t, { code: q.invalid_type, expected: Q.promise, received: t.parsedType }), ie;
    const n = t.parsedType === Q.promise ? t.data : Promise.resolve(t.data);
    return nt(n.then(((s) => this._def.type.parseAsync(s, { path: t.path, errorMap: t.common.contextualErrorMap }))));
  }
}
yn.create = (r, e) => new yn({ type: r, typeName: ce.ZodPromise, ...le(e) });
class Ut extends ye {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ce.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), s = this._def.effect || null, a = { addIssue: (i) => {
      K(n, i), i.fatal ? t.abort() : t.dirty();
    }, get path() {
      return n.path;
    } };
    if (a.addIssue = a.addIssue.bind(a), s.type === "preprocess") {
      const i = s.transform(n.data, a);
      if (n.common.async) return Promise.resolve(i).then((async (o) => {
        if (t.value === "aborted") return ie;
        const c = await this._def.schema._parseAsync({ data: o, path: n.path, parent: n });
        return c.status === "aborted" ? ie : c.status === "dirty" || t.value === "dirty" ? ps(c.value) : c;
      }));
      {
        if (t.value === "aborted") return ie;
        const o = this._def.schema._parseSync({ data: i, path: n.path, parent: n });
        return o.status === "aborted" ? ie : o.status === "dirty" || t.value === "dirty" ? ps(o.value) : o;
      }
    }
    if (s.type === "refinement") {
      const i = (o) => {
        const c = s.refinement(o, a);
        if (n.common.async) return Promise.resolve(c);
        if (c instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({ data: n.data, path: n.path, parent: n });
        return o.status === "aborted" ? ie : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      }
      return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then(((o) => o.status === "aborted" ? ie : (o.status === "dirty" && t.dirty(), i(o.value).then((() => ({ status: t.value, value: o.value }))))));
    }
    if (s.type === "transform") {
      if (n.common.async === !1) {
        const i = this._def.schema._parseSync({ data: n.data, path: n.path, parent: n });
        if (!nr(i)) return ie;
        const o = s.transform(i.value, a);
        if (o instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      }
      return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then(((i) => nr(i) ? Promise.resolve(s.transform(i.value, a)).then(((o) => ({ status: t.value, value: o }))) : ie));
    }
    ve.assertNever(s);
  }
}
Ut.create = (r, e, t) => new Ut({ schema: r, typeName: ce.ZodEffects, effect: e, ...le(t) }), Ut.createWithPreprocess = (r, e, t) => new Ut({ schema: e, effect: { type: "preprocess", transform: r }, typeName: ce.ZodEffects, ...le(t) });
class xt extends ye {
  _parse(e) {
    return this._getType(e) === Q.undefined ? nt(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
xt.create = (r, e) => new xt({ innerType: r, typeName: ce.ZodOptional, ...le(e) });
class Bt extends ye {
  _parse(e) {
    return this._getType(e) === Q.null ? nt(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Bt.create = (r, e) => new Bt({ innerType: r, typeName: ce.ZodNullable, ...le(e) });
class _n extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === Q.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({ data: n, path: t.path, parent: t });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
_n.create = (r, e) => new _n({ innerType: r, typeName: ce.ZodDefault, defaultValue: typeof e.default == "function" ? e.default : () => e.default, ...le(e) });
class vn extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = { ...t, common: { ...t.common, issues: [] } }, s = this._def.innerType._parse({ data: n.data, path: n.path, parent: { ...n } });
    return fn(s) ? s.then(((a) => ({ status: "valid", value: a.status === "valid" ? a.value : this._def.catchValue({ get error() {
      return new Ot(n.common.issues);
    }, input: n.data }) }))) : { status: "valid", value: s.status === "valid" ? s.value : this._def.catchValue({ get error() {
      return new Ot(n.common.issues);
    }, input: n.data }) };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
vn.create = (r, e) => new vn({ innerType: r, typeName: ce.ZodCatch, catchValue: typeof e.catch == "function" ? e.catch : () => e.catch, ...le(e) });
class ya extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.nan) {
      const t = this._getOrReturnCtx(e);
      return K(t, { code: q.invalid_type, expected: Q.nan, received: t.parsedType }), ie;
    }
    return { status: "valid", value: e.data };
  }
}
ya.create = (r) => new ya({ typeName: ce.ZodNaN, ...le(r) });
class io extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({ data: n, path: t.path, parent: t });
  }
  unwrap() {
    return this._def.type;
  }
}
class Fs extends ye {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async) return (async () => {
      const s = await this._def.in._parseAsync({ data: n.data, path: n.path, parent: n });
      return s.status === "aborted" ? ie : s.status === "dirty" ? (t.dirty(), ps(s.value)) : this._def.out._parseAsync({ data: s.value, path: n.path, parent: n });
    })();
    {
      const s = this._def.in._parseSync({ data: n.data, path: n.path, parent: n });
      return s.status === "aborted" ? ie : s.status === "dirty" ? (t.dirty(), { status: "dirty", value: s.value }) : this._def.out._parseSync({ data: s.value, path: n.path, parent: n });
    }
  }
  static create(e, t) {
    return new Fs({ in: e, out: t, typeName: ce.ZodPipeline });
  }
}
class bn extends ye {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (s) => (nr(s) && (s.value = Object.freeze(s.value)), s);
    return fn(t) ? t.then(((s) => n(s))) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
var ce;
bn.create = (r, e) => new bn({ innerType: r, typeName: ce.ZodReadonly, ...le(e) }), (function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(ce || (ce = {}));
const G = Tt.create, He = sr.create, tt = gs.create, gr = vs.create, Ie = (Dt.create, gt.create), X = Oe.create, Ue = mn.create, xc = Ls.create, vr = (pn.create, Ht.create, Vs.create), de = gn.create, Ct = Kt.create, M = (yn.create, xt.create), Mn = (Bt.create, "2.0"), oo = Ue([G(), He().int()]), co = G(), Nc = X({ progressToken: M(oo) }).passthrough(), st = X({ _meta: M(Nc) }).passthrough(), Ye = X({ method: G(), params: M(st) }), br = X({ _meta: M(X({}).passthrough()) }).passthrough(), wt = X({ method: G(), params: M(br) }), at = X({ _meta: M(X({}).passthrough()) }).passthrough(), qn = Ue([G(), He().int()]), Oc = X({ jsonrpc: de(Mn), id: qn }).merge(Ye).strict(), Cc = X({ jsonrpc: de(Mn) }).merge(wt).strict(), Ic = X({ jsonrpc: de(Mn), id: qn, result: at }).strict();
var _a;
(function(r) {
  r[r.ConnectionClosed = -32e3] = "ConnectionClosed", r[r.RequestTimeout = -32001] = "RequestTimeout", r[r.ParseError = -32700] = "ParseError", r[r.InvalidRequest = -32600] = "InvalidRequest", r[r.MethodNotFound = -32601] = "MethodNotFound", r[r.InvalidParams = -32602] = "InvalidParams", r[r.InternalError = -32603] = "InternalError";
})(_a || (_a = {}));
const Ac = Ue([Oc, Cc, Ic, X({ jsonrpc: de(Mn), id: qn, error: X({ code: He().int(), message: G(), data: M(gr()) }) }).strict()]), va = at.strict(), ba = wt.extend({ method: de("notifications/cancelled"), params: br.extend({ requestId: qn, reason: G().optional() }) }), wr = X({ name: G(), title: M(G()) }).passthrough(), uo = wr.extend({ version: G() }), jc = X({ experimental: M(X({}).passthrough()), sampling: M(X({}).passthrough()), elicitation: M(X({}).passthrough()), roots: M(X({ listChanged: M(tt()) }).passthrough()) }).passthrough(), Mc = Ye.extend({ method: de("initialize"), params: st.extend({ protocolVersion: G(), capabilities: jc, clientInfo: uo }) }), qc = X({ experimental: M(X({}).passthrough()), logging: M(X({}).passthrough()), completions: M(X({}).passthrough()), prompts: M(X({ listChanged: M(tt()) }).passthrough()), resources: M(X({ subscribe: M(tt()), listChanged: M(tt()) }).passthrough()), tools: M(X({ listChanged: M(tt()) }).passthrough()) }).passthrough(), Dc = at.extend({ protocolVersion: G(), capabilities: qc, serverInfo: uo, instructions: M(G()) }), Zc = wt.extend({ method: de("notifications/initialized") }), wa = Ye.extend({ method: de("ping") }), zc = X({ progress: He(), total: M(He()), message: M(G()) }).passthrough(), $a = wt.extend({ method: de("notifications/progress"), params: br.merge(zc).extend({ progressToken: oo }) }), Dn = Ye.extend({ params: st.extend({ cursor: M(co) }).optional() }), Zn = at.extend({ nextCursor: M(co) }), lo = X({ uri: G(), mimeType: M(G()), _meta: M(X({}).passthrough()) }).passthrough(), fo = lo.extend({ text: G() }), ho = lo.extend({ blob: G().base64() }), mo = wr.extend({ uri: G(), description: M(G()), mimeType: M(G()), _meta: M(X({}).passthrough()) }), Lc = wr.extend({ uriTemplate: G(), description: M(G()), mimeType: M(G()), _meta: M(X({}).passthrough()) }), Vc = Dn.extend({ method: de("resources/list") }), Fc = Zn.extend({ resources: Ie(mo) }), Uc = Dn.extend({ method: de("resources/templates/list") }), Hc = Zn.extend({ resourceTemplates: Ie(Lc) }), Kc = Ye.extend({ method: de("resources/read"), params: st.extend({ uri: G() }) }), Bc = at.extend({ contents: Ie(Ue([fo, ho])) }), Gc = wt.extend({ method: de("notifications/resources/list_changed") }), Jc = Ye.extend({ method: de("resources/subscribe"), params: st.extend({ uri: G() }) }), Wc = Ye.extend({ method: de("resources/unsubscribe"), params: st.extend({ uri: G() }) }), Qc = wt.extend({ method: de("notifications/resources/updated"), params: br.extend({ uri: G() }) }), Yc = X({ name: G(), description: M(G()), required: M(tt()) }).passthrough(), Xc = wr.extend({ description: M(G()), arguments: M(Ie(Yc)), _meta: M(X({}).passthrough()) }), eu = Dn.extend({ method: de("prompts/list") }), tu = Zn.extend({ prompts: Ie(Xc) }), ru = Ye.extend({ method: de("prompts/get"), params: st.extend({ name: G(), arguments: M(vr(G())) }) }), Us = X({ type: de("text"), text: G(), _meta: M(X({}).passthrough()) }).passthrough(), Hs = X({ type: de("image"), data: G().base64(), mimeType: G(), _meta: M(X({}).passthrough()) }).passthrough(), Ks = X({ type: de("audio"), data: G().base64(), mimeType: G(), _meta: M(X({}).passthrough()) }).passthrough(), nu = X({ type: de("resource"), resource: Ue([fo, ho]), _meta: M(X({}).passthrough()) }).passthrough(), po = Ue([Us, Hs, Ks, mo.extend({ type: de("resource_link") }), nu]), su = X({ role: Ct(["user", "assistant"]), content: po }).passthrough(), au = at.extend({ description: M(G()), messages: Ie(su) }), iu = wt.extend({ method: de("notifications/prompts/list_changed") }), ou = X({ title: M(G()), readOnlyHint: M(tt()), destructiveHint: M(tt()), idempotentHint: M(tt()), openWorldHint: M(tt()) }).passthrough(), cu = wr.extend({ description: M(G()), inputSchema: X({ type: de("object"), properties: M(X({}).passthrough()), required: M(Ie(G())) }).passthrough(), outputSchema: M(X({ type: de("object"), properties: M(X({}).passthrough()), required: M(Ie(G())) }).passthrough()), annotations: M(ou), _meta: M(X({}).passthrough()) }), uu = Dn.extend({ method: de("tools/list") }), du = Zn.extend({ tools: Ie(cu) }), go = at.extend({ content: Ie(po).default([]), structuredContent: X({}).passthrough().optional(), isError: M(tt()) }), lu = (go.or(at.extend({ toolResult: gr() })), Ye.extend({ method: de("tools/call"), params: st.extend({ name: G(), arguments: M(vr(gr())) }) })), fu = wt.extend({ method: de("notifications/tools/list_changed") }), yo = Ct(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]), hu = Ye.extend({ method: de("logging/setLevel"), params: st.extend({ level: yo }) }), mu = wt.extend({ method: de("notifications/message"), params: br.extend({ level: yo, logger: M(G()), data: gr() }) }), pu = X({ name: G().optional() }).passthrough(), gu = X({ hints: M(Ie(pu)), costPriority: M(He().min(0).max(1)), speedPriority: M(He().min(0).max(1)), intelligencePriority: M(He().min(0).max(1)) }).passthrough(), yu = X({ role: Ct(["user", "assistant"]), content: Ue([Us, Hs, Ks]) }).passthrough(), _u = Ye.extend({ method: de("sampling/createMessage"), params: st.extend({ messages: Ie(yu), systemPrompt: M(G()), includeContext: M(Ct(["none", "thisServer", "allServers"])), temperature: M(He()), maxTokens: He().int(), stopSequences: M(Ie(G())), metadata: M(X({}).passthrough()), modelPreferences: M(gu) }) }), vu = at.extend({ model: G(), stopReason: M(Ct(["endTurn", "stopSequence", "maxTokens"]).or(G())), role: Ct(["user", "assistant"]), content: xc("type", [Us, Hs, Ks]) }), bu = Ue([X({ type: de("boolean"), title: M(G()), description: M(G()), default: M(tt()) }).passthrough(), X({ type: de("string"), title: M(G()), description: M(G()), minLength: M(He()), maxLength: M(He()), format: M(Ct(["email", "uri", "date", "date-time"])) }).passthrough(), X({ type: Ct(["number", "integer"]), title: M(G()), description: M(G()), minimum: M(He()), maximum: M(He()) }).passthrough(), X({ type: de("string"), title: M(G()), description: M(G()), enum: Ie(G()), enumNames: M(Ie(G())) }).passthrough()]), wu = Ye.extend({ method: de("elicitation/create"), params: st.extend({ message: G(), requestedSchema: X({ type: de("object"), properties: vr(G(), bu), required: M(Ie(G())) }).passthrough() }) }), $u = at.extend({ action: Ct(["accept", "reject", "cancel"]), content: M(vr(G(), gr())) }), ku = X({ type: de("ref/resource"), uri: G() }).passthrough(), Su = X({ type: de("ref/prompt"), name: G() }).passthrough(), Pu = Ye.extend({ method: de("completion/complete"), params: st.extend({ ref: Ue([Su, ku]), argument: X({ name: G(), value: G() }).passthrough(), context: M(X({ arguments: M(vr(G(), G())) })) }) }), Ru = at.extend({ completion: X({ values: Ie(G()).max(100), total: M(He().int()), hasMore: M(tt()) }).passthrough() }), Tu = X({ uri: G().startsWith("file://"), name: M(G()), _meta: M(X({}).passthrough()) }).passthrough(), Eu = Ye.extend({ method: de("roots/list") }), xu = at.extend({ roots: Ie(Tu) }), Nu = wt.extend({ method: de("notifications/roots/list_changed") });
Ue([wa, Mc, Pu, hu, ru, eu, Vc, Uc, Kc, Jc, Wc, lu, uu]), Ue([ba, $a, Zc, Nu]), Ue([va, vu, $u, xu]), Ue([wa, _u, wu, Eu]), Ue([ba, $a, mu, Qc, Gc, fu, iu]), Ue([va, Dc, Ru, au, tu, Fc, Hc, Bc, go, du]);
class Bs {
  constructor(e, t) {
    Me(this, "sessionId");
    Me(this, "onmessage");
    Me(this, "onerror");
    Me(this, "onclose");
    Me(this, "_port");
    Me(this, "_started", !1);
    Me(this, "_closed", !1);
    if (!e) throw new Error("MessagePort is required");
    this._port = e, this.sessionId = t || this.generateId(), this._port.onmessage = (n) => {
      var s, a;
      try {
        const i = Ac.parse(n.data);
        (s = this.onmessage) == null || s.call(this, i);
      } catch (i) {
        const o = new Error(`Failed to parse message: ${i}`);
        (a = this.onerror) == null || a.call(this, o);
      }
    }, this._port.onmessageerror = (n) => {
      var a;
      const s = new Error(`MessagePort error: ${JSON.stringify(n)}`);
      (a = this.onerror) == null || a.call(this, s);
    };
  }
  static generateSessionId() {
    return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`;
  }
  async start() {
    if (this._started) throw new Error("BrowserContextTransport already started! If using Client or Server class, note that connect() calls start() automatically.");
    if (this._closed) throw new Error("Cannot start a closed BrowserContextTransport");
    this._started = !0, this._port.start();
  }
  async send(e) {
    if (this._closed) throw new Error("Cannot send on a closed BrowserContextTransport");
    return new Promise(((t, n) => {
      var s;
      try {
        this._port.postMessage(e), t();
      } catch (a) {
        const i = a instanceof Error ? a : new Error(String(a));
        (s = this.onerror) == null || s.call(this, i), n(i);
      }
    }));
  }
  async close() {
    var e;
    this._closed || (this._closed = !0, this._port.close(), (e = this.onclose) == null || e.call(this));
  }
  generateId() {
    return Bs.generateSessionId();
  }
}
class Ou {
  constructor() {
    Me(this, "angieDetector");
    Me(this, "registrationQueue");
    Me(this, "clientManager");
    Me(this, "isInitialized", !1);
    this.angieDetector = new ic(), this.registrationQueue = new oc(), this.clientManager = new cc(), this.setupAngieReadyHandler(), this.setupServerInitHandler();
  }
  setupAngieReadyHandler() {
    this.angieDetector.waitForReady().then(((e) => {
      e.isReady ? this.handleAngieReady() : console.warn("AngieMcpSdk: Angie not detected - servers will remain queued");
    })).catch(((e) => {
      console.error("AngieMcpSdk: Error waiting for Angie:", e);
    }));
  }
  async handleAngieReady() {
    console.log("AngieMcpSdk: Angie is ready, processing queued registrations");
    try {
      await this.registrationQueue.processQueue((async (e) => {
        await this.processRegistration(e);
      })), this.isInitialized = !0, console.log("AngieMcpSdk: Initialization complete");
    } catch (e) {
      console.error("AngieMcpSdk: Error processing registration queue:", e);
    }
  }
  async processRegistration(e) {
    console.log(`AngieMcpSdk: Processing registration for server "${e.config.name}"`);
    try {
      await this.clientManager.requestClientCreation(e), console.log(`AngieMcpSdk: Successfully registered server "${e.config.name}"`);
    } catch (t) {
      throw console.error(`AngieMcpSdk: Failed to register server "${e.config.name}":`, t), t;
    }
  }
  async registerServer(e) {
    if (!e.server) throw new Error("Server instance is required");
    if (!e.name) throw new Error("Server name is required");
    if (!e.description) throw new Error("Server description is required");
    console.log(`AngieMcpSdk: Registering server "${e.name}"`);
    const t = this.registrationQueue.add(e);
    if (this.angieDetector.isReady()) try {
      await this.processRegistration(t), this.registrationQueue.updateStatus(t.id, "registered"), console.log(`AngieMcpSdk: Server "${e.name}" registered successfully`);
    } catch (n) {
      const s = n instanceof Error ? n.message : String(n);
      throw this.registrationQueue.updateStatus(t.id, "failed", s), n;
    }
    else console.log(`AngieMcpSdk: Server "${e.name}" queued until Angie is ready`);
  }
  getRegistrations() {
    return this.registrationQueue.getAll();
  }
  getPendingRegistrations() {
    return this.registrationQueue.getPending();
  }
  isAngieReady() {
    return this.angieDetector.isReady();
  }
  isReady() {
    return this.isInitialized;
  }
  async waitForReady() {
    if (!(await this.angieDetector.waitForReady()).isReady) throw new Error("Angie is not available");
    for (; !this.isInitialized; ) await new Promise(((e) => setTimeout(e, 100)));
  }
  destroy() {
    this.registrationQueue.clear(), console.log("AngieMcpSdk: SDK destroyed");
  }
  setupServerInitHandler() {
    window.addEventListener("message", ((e) => {
      var t;
      ((t = e.data) == null ? void 0 : t.type) === hr.SDK_REQUEST_INIT_SERVER && this.handleServerInitRequest(e);
    }));
  }
  handleServerInitRequest(e) {
    const { clientId: t, serverId: n } = e.data.payload || {};
    if (t && n) {
      console.log(`AngieMcpSdk: Handling server init request for clientId: ${t}, serverId: ${n}`);
      try {
        const s = this.registrationQueue.getAll().find(((c) => c.id === n));
        if (!s) return void console.error(`AngieMcpSdk: No registration found for serverId: ${n}`);
        const a = e.ports[0];
        if (!a) return void console.error("AngieMcpSdk: No port provided in server init request");
        const i = s.config.server, o = new Bs(a);
        i.connect(o), console.log(`AngieMcpSdk: Server "${s.config.name}" initialized successfully`);
      } catch (s) {
        console.error(`AngieMcpSdk: Error initializing server for clientId ${t}:`, s);
      }
    } else console.error("AngieMcpSdk: Invalid server init request - missing clientId or serverId");
  }
}
var be;
(function(r) {
  r.assertEqual = (s) => {
  };
  function e(s) {
  }
  r.assertIs = e;
  function t(s) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (s) => {
    const a = {};
    for (const i of s)
      a[i] = i;
    return a;
  }, r.getValidEnumValues = (s) => {
    const a = r.objectKeys(s).filter((o) => typeof s[s[o]] != "number"), i = {};
    for (const o of a)
      i[o] = s[o];
    return r.objectValues(i);
  }, r.objectValues = (s) => r.objectKeys(s).map(function(a) {
    return s[a];
  }), r.objectKeys = typeof Object.keys == "function" ? (s) => Object.keys(s) : (s) => {
    const a = [];
    for (const i in s)
      Object.prototype.hasOwnProperty.call(s, i) && a.push(i);
    return a;
  }, r.find = (s, a) => {
    for (const i of s)
      if (a(i))
        return i;
  }, r.isInteger = typeof Number.isInteger == "function" ? (s) => Number.isInteger(s) : (s) => typeof s == "number" && Number.isFinite(s) && Math.floor(s) === s;
  function n(s, a = " | ") {
    return s.map((i) => typeof i == "string" ? `'${i}'` : i).join(a);
  }
  r.joinValues = n, r.jsonStringifyReplacer = (s, a) => typeof a == "bigint" ? a.toString() : a;
})(be || (be = {}));
var ka;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(ka || (ka = {}));
const Y = be.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), qt = (r) => {
  switch (typeof r) {
    case "undefined":
      return Y.undefined;
    case "string":
      return Y.string;
    case "number":
      return Number.isNaN(r) ? Y.nan : Y.number;
    case "boolean":
      return Y.boolean;
    case "function":
      return Y.function;
    case "bigint":
      return Y.bigint;
    case "symbol":
      return Y.symbol;
    case "object":
      return Array.isArray(r) ? Y.array : r === null ? Y.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? Y.promise : typeof Map < "u" && r instanceof Map ? Y.map : typeof Set < "u" && r instanceof Set ? Y.set : typeof Date < "u" && r instanceof Date ? Y.date : Y.object;
    default:
      return Y.unknown;
  }
}, D = be.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class It extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, n = { _errors: [] }, s = (a) => {
      for (const i of a.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(s);
        else if (i.code === "invalid_return_type")
          s(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          s(i.argumentsError);
        else if (i.path.length === 0)
          n._errors.push(t(i));
        else {
          let o = n, c = 0;
          for (; c < i.path.length; ) {
            const u = i.path[c];
            c === i.path.length - 1 ? (o[u] = o[u] || { _errors: [] }, o[u]._errors.push(t(i))) : o[u] = o[u] || { _errors: [] }, o = o[u], c++;
          }
        }
    };
    return s(this), n;
  }
  static assert(e) {
    if (!(e instanceof It))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, be.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const s of this.issues)
      if (s.path.length > 0) {
        const a = s.path[0];
        t[a] = t[a] || [], t[a].push(e(s));
      } else
        n.push(e(s));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
It.create = (r) => new It(r);
const ks = (r, e) => {
  let t;
  switch (r.code) {
    case D.invalid_type:
      r.received === Y.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case D.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, be.jsonStringifyReplacer)}`;
      break;
    case D.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${be.joinValues(r.keys, ", ")}`;
      break;
    case D.invalid_union:
      t = "Invalid input";
      break;
    case D.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${be.joinValues(r.options)}`;
      break;
    case D.invalid_enum_value:
      t = `Invalid enum value. Expected ${be.joinValues(r.options)}, received '${r.received}'`;
      break;
    case D.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case D.invalid_return_type:
      t = "Invalid function return type";
      break;
    case D.invalid_date:
      t = "Invalid date";
      break;
    case D.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : be.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
      break;
    case D.too_small:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "bigint" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
      break;
    case D.too_big:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
      break;
    case D.custom:
      t = "Invalid input";
      break;
    case D.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case D.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case D.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, be.assertNever(r);
  }
  return { message: t };
};
let Cu = ks;
function Iu() {
  return Cu;
}
const Au = (r) => {
  const { data: e, path: t, errorMaps: n, issueData: s } = r, a = [...t, ...s.path || []], i = {
    ...s,
    path: a
  };
  if (s.message !== void 0)
    return {
      ...s,
      path: a,
      message: s.message
    };
  let o = "";
  const c = n.filter((u) => !!u).slice().reverse();
  for (const u of c)
    o = u(i, { data: e, defaultError: o }).message;
  return {
    ...s,
    path: a,
    message: o
  };
};
function B(r, e) {
  const t = Iu(), n = Au({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      // contextual error map is first priority
      r.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === ks ? void 0 : ks
      // then global default map
    ].filter((s) => !!s)
  });
  r.common.issues.push(n);
}
class Ge {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const n = [];
    for (const s of t) {
      if (s.status === "aborted")
        return oe;
      s.status === "dirty" && e.dirty(), n.push(s.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const s of t) {
      const a = await s.key, i = await s.value;
      n.push({
        key: a,
        value: i
      });
    }
    return Ge.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const s of t) {
      const { key: a, value: i } = s;
      if (a.status === "aborted" || i.status === "aborted")
        return oe;
      a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof i.value < "u" || s.alwaysSet) && (n[a.value] = i.value);
    }
    return { status: e.value, value: n };
  }
}
const oe = Object.freeze({
  status: "aborted"
}), fr = (r) => ({ status: "dirty", value: r }), it = (r) => ({ status: "valid", value: r }), Sa = (r) => r.status === "aborted", Pa = (r) => r.status === "dirty", ar = (r) => r.status === "valid", wn = (r) => typeof Promise < "u" && r instanceof Promise;
var ne;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(ne || (ne = {}));
class vt {
  constructor(e, t, n, s) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = s;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Ra = (r, e) => {
  if (ar(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new It(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function fe(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: s } = r;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (i, o) => {
    const { message: c } = r;
    return i.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? n ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? t ?? o.defaultError };
  }, description: s };
}
class ge {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return qt(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: qt(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new Ge(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: qt(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (wn(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    const n = {
      common: {
        issues: [],
        async: (t == null ? void 0 : t.async) ?? !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: qt(e)
    }, s = this._parseSync({ data: e, path: n.path, parent: n });
    return Ra(n, s);
  }
  "~validate"(e) {
    var n, s;
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: qt(e)
    };
    if (!this["~standard"].async)
      try {
        const a = this._parseSync({ data: e, path: [], parent: t });
        return ar(a) ? {
          value: a.value
        } : {
          issues: t.common.issues
        };
      } catch (a) {
        (s = (n = a == null ? void 0 : a.message) == null ? void 0 : n.toLowerCase()) != null && s.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((a) => ar(a) ? {
      value: a.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: qt(e)
    }, s = this._parse({ data: e, path: n.path, parent: n }), a = await (wn(s) ? s : Promise.resolve(s));
    return Ra(n, a);
  }
  refine(e, t) {
    const n = (s) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(s) : t;
    return this._refinement((s, a) => {
      const i = e(s), o = () => a.addIssue({
        code: D.custom,
        ...n(s)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((c) => c ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, s) => e(n) ? !0 : (s.addIssue(typeof t == "function" ? t(n, s) : t), !1));
  }
  _refinement(e) {
    return new Wt({
      schema: this,
      typeName: Z.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return Nt.create(this, this._def);
  }
  nullable() {
    return Qt.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return yt.create(this);
  }
  promise() {
    return Tn.create(this, this._def);
  }
  or(e) {
    return kn.create([this, e], this._def);
  }
  and(e) {
    return Sn.create(this, e, this._def);
  }
  transform(e) {
    return new Wt({
      ...fe(this._def),
      schema: this,
      typeName: Z.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new En({
      ...fe(this._def),
      innerType: this,
      defaultValue: t,
      typeName: Z.ZodDefault
    });
  }
  brand() {
    return new wo({
      typeName: Z.ZodBranded,
      type: this,
      ...fe(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new xn({
      ...fe(this._def),
      innerType: this,
      catchValue: t,
      typeName: Z.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Js.create(this, e);
  }
  readonly() {
    return Nn.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const ju = /^c[^\s-]{8,}$/i, Mu = /^[0-9a-z]+$/, qu = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Du = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Zu = /^[a-z0-9_-]{21}$/i, zu = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Lu = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Vu = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Fu = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Yn;
const Uu = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Hu = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Ku = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Bu = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Gu = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Ju = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, _o = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Wu = new RegExp(`^${_o}$`);
function vo(r) {
  let e = "[0-5]\\d";
  r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = r.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function Qu(r) {
  return new RegExp(`^${vo(r)}$`);
}
function Yu(r) {
  let e = `${_o}T${vo(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Xu(r, e) {
  return !!((e === "v4" || !e) && Uu.test(r) || (e === "v6" || !e) && Ku.test(r));
}
function ed(r, e) {
  if (!zu.test(r))
    return !1;
  try {
    const [t] = r.split(".");
    if (!t)
      return !1;
    const n = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), s = JSON.parse(atob(n));
    return !(typeof s != "object" || s === null || "typ" in s && (s == null ? void 0 : s.typ) !== "JWT" || !s.alg || e && s.alg !== e);
  } catch {
    return !1;
  }
}
function td(r, e) {
  return !!((e === "v4" || !e) && Hu.test(r) || (e === "v6" || !e) && Bu.test(r));
}
class Et extends ge {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== Y.string) {
      const a = this._getOrReturnCtx(e);
      return B(a, {
        code: D.invalid_type,
        expected: Y.string,
        received: a.parsedType
      }), oe;
    }
    const n = new Ge();
    let s;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (s = this._getOrReturnCtx(e, s), B(s, {
          code: D.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (s = this._getOrReturnCtx(e, s), B(s, {
          code: D.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "length") {
        const i = e.data.length > a.value, o = e.data.length < a.value;
        (i || o) && (s = this._getOrReturnCtx(e, s), i ? B(s, {
          code: D.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : o && B(s, {
          code: D.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), n.dirty());
      } else if (a.kind === "email")
        Vu.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
          validation: "email",
          code: D.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "emoji")
        Yn || (Yn = new RegExp(Fu, "u")), Yn.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
          validation: "emoji",
          code: D.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "uuid")
        Du.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
          validation: "uuid",
          code: D.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "nanoid")
        Zu.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
          validation: "nanoid",
          code: D.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid")
        ju.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
          validation: "cuid",
          code: D.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid2")
        Mu.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
          validation: "cuid2",
          code: D.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "ulid")
        qu.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
          validation: "ulid",
          code: D.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          s = this._getOrReturnCtx(e, s), B(s, {
            validation: "url",
            code: D.invalid_string,
            message: a.message
          }), n.dirty();
        }
      else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
        validation: "regex",
        code: D.invalid_string,
        message: a.message
      }), n.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (s = this._getOrReturnCtx(e, s), B(s, {
        code: D.invalid_string,
        validation: { includes: a.value, position: a.position },
        message: a.message
      }), n.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (s = this._getOrReturnCtx(e, s), B(s, {
        code: D.invalid_string,
        validation: { startsWith: a.value },
        message: a.message
      }), n.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (s = this._getOrReturnCtx(e, s), B(s, {
        code: D.invalid_string,
        validation: { endsWith: a.value },
        message: a.message
      }), n.dirty()) : a.kind === "datetime" ? Yu(a).test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
        code: D.invalid_string,
        validation: "datetime",
        message: a.message
      }), n.dirty()) : a.kind === "date" ? Wu.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
        code: D.invalid_string,
        validation: "date",
        message: a.message
      }), n.dirty()) : a.kind === "time" ? Qu(a).test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
        code: D.invalid_string,
        validation: "time",
        message: a.message
      }), n.dirty()) : a.kind === "duration" ? Lu.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
        validation: "duration",
        code: D.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "ip" ? Xu(e.data, a.version) || (s = this._getOrReturnCtx(e, s), B(s, {
        validation: "ip",
        code: D.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "jwt" ? ed(e.data, a.alg) || (s = this._getOrReturnCtx(e, s), B(s, {
        validation: "jwt",
        code: D.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "cidr" ? td(e.data, a.version) || (s = this._getOrReturnCtx(e, s), B(s, {
        validation: "cidr",
        code: D.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "base64" ? Gu.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
        validation: "base64",
        code: D.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "base64url" ? Ju.test(e.data) || (s = this._getOrReturnCtx(e, s), B(s, {
        validation: "base64url",
        code: D.invalid_string,
        message: a.message
      }), n.dirty()) : be.assertNever(a);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((s) => e.test(s), {
      validation: t,
      code: D.invalid_string,
      ...ne.errToObj(n)
    });
  }
  _addCheck(e) {
    return new Et({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...ne.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...ne.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...ne.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...ne.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...ne.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...ne.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...ne.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...ne.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...ne.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...ne.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...ne.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...ne.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...ne.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (e == null ? void 0 : e.offset) ?? !1,
      local: (e == null ? void 0 : e.local) ?? !1,
      ...ne.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...ne.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...ne.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...ne.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...ne.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...ne.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...ne.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...ne.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...ne.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...ne.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, ne.errToObj(e));
  }
  trim() {
    return new Et({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Et({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Et({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Et.create = (r) => new Et({
  checks: [],
  typeName: Z.ZodString,
  coerce: (r == null ? void 0 : r.coerce) ?? !1,
  ...fe(r)
});
function rd(r, e) {
  const t = (r.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, s = t > n ? t : n, a = Number.parseInt(r.toFixed(s).replace(".", "")), i = Number.parseInt(e.toFixed(s).replace(".", ""));
  return a % i / 10 ** s;
}
class ir extends ge {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== Y.number) {
      const a = this._getOrReturnCtx(e);
      return B(a, {
        code: D.invalid_type,
        expected: Y.number,
        received: a.parsedType
      }), oe;
    }
    let n;
    const s = new Ge();
    for (const a of this._def.checks)
      a.kind === "int" ? be.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), B(n, {
        code: D.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), s.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), B(n, {
        code: D.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), s.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), B(n, {
        code: D.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), s.dirty()) : a.kind === "multipleOf" ? rd(e.data, a.value) !== 0 && (n = this._getOrReturnCtx(e, n), B(n, {
        code: D.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), s.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), B(n, {
        code: D.not_finite,
        message: a.message
      }), s.dirty()) : be.assertNever(a);
    return { status: s.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, ne.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, ne.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, ne.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, ne.toString(t));
  }
  setLimit(e, t, n, s) {
    return new ir({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: ne.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ir({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: ne.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: ne.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: ne.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: ne.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: ne.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: ne.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: ne.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: ne.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: ne.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && be.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
ir.create = (r) => new ir({
  checks: [],
  typeName: Z.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...fe(r)
});
class yr extends ge {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== Y.bigint)
      return this._getInvalidInput(e);
    let n;
    const s = new Ge();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), B(n, {
        code: D.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), s.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), B(n, {
        code: D.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), s.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), B(n, {
        code: D.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), s.dirty()) : be.assertNever(a);
    return { status: s.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return B(t, {
      code: D.invalid_type,
      expected: Y.bigint,
      received: t.parsedType
    }), oe;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, ne.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, ne.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, ne.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, ne.toString(t));
  }
  setLimit(e, t, n, s) {
    return new yr({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: ne.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new yr({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: ne.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: ne.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: ne.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: ne.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: ne.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
yr.create = (r) => new yr({
  checks: [],
  typeName: Z.ZodBigInt,
  coerce: (r == null ? void 0 : r.coerce) ?? !1,
  ...fe(r)
});
class Ss extends ge {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== Y.boolean) {
      const n = this._getOrReturnCtx(e);
      return B(n, {
        code: D.invalid_type,
        expected: Y.boolean,
        received: n.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
Ss.create = (r) => new Ss({
  typeName: Z.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...fe(r)
});
class $n extends ge {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== Y.date) {
      const a = this._getOrReturnCtx(e);
      return B(a, {
        code: D.invalid_type,
        expected: Y.date,
        received: a.parsedType
      }), oe;
    }
    if (Number.isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return B(a, {
        code: D.invalid_date
      }), oe;
    }
    const n = new Ge();
    let s;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (s = this._getOrReturnCtx(e, s), B(s, {
        code: D.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), n.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (s = this._getOrReturnCtx(e, s), B(s, {
        code: D.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), n.dirty()) : be.assertNever(a);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new $n({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: ne.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: ne.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
$n.create = (r) => new $n({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: Z.ZodDate,
  ...fe(r)
});
class Ta extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.symbol) {
      const n = this._getOrReturnCtx(e);
      return B(n, {
        code: D.invalid_type,
        expected: Y.symbol,
        received: n.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
Ta.create = (r) => new Ta({
  typeName: Z.ZodSymbol,
  ...fe(r)
});
class Ps extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.undefined) {
      const n = this._getOrReturnCtx(e);
      return B(n, {
        code: D.invalid_type,
        expected: Y.undefined,
        received: n.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
Ps.create = (r) => new Ps({
  typeName: Z.ZodUndefined,
  ...fe(r)
});
class Rs extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.null) {
      const n = this._getOrReturnCtx(e);
      return B(n, {
        code: D.invalid_type,
        expected: Y.null,
        received: n.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
Rs.create = (r) => new Rs({
  typeName: Z.ZodNull,
  ...fe(r)
});
class Ea extends ge {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return it(e.data);
  }
}
Ea.create = (r) => new Ea({
  typeName: Z.ZodAny,
  ...fe(r)
});
class Ts extends ge {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return it(e.data);
  }
}
Ts.create = (r) => new Ts({
  typeName: Z.ZodUnknown,
  ...fe(r)
});
class Zt extends ge {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return B(t, {
      code: D.invalid_type,
      expected: Y.never,
      received: t.parsedType
    }), oe;
  }
}
Zt.create = (r) => new Zt({
  typeName: Z.ZodNever,
  ...fe(r)
});
class xa extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.undefined) {
      const n = this._getOrReturnCtx(e);
      return B(n, {
        code: D.invalid_type,
        expected: Y.void,
        received: n.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
xa.create = (r) => new xa({
  typeName: Z.ZodVoid,
  ...fe(r)
});
class yt extends ge {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), s = this._def;
    if (t.parsedType !== Y.array)
      return B(t, {
        code: D.invalid_type,
        expected: Y.array,
        received: t.parsedType
      }), oe;
    if (s.exactLength !== null) {
      const i = t.data.length > s.exactLength.value, o = t.data.length < s.exactLength.value;
      (i || o) && (B(t, {
        code: i ? D.too_big : D.too_small,
        minimum: o ? s.exactLength.value : void 0,
        maximum: i ? s.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: s.exactLength.message
      }), n.dirty());
    }
    if (s.minLength !== null && t.data.length < s.minLength.value && (B(t, {
      code: D.too_small,
      minimum: s.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.minLength.message
    }), n.dirty()), s.maxLength !== null && t.data.length > s.maxLength.value && (B(t, {
      code: D.too_big,
      maximum: s.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => s.type._parseAsync(new vt(t, i, t.path, o)))).then((i) => Ge.mergeArray(n, i));
    const a = [...t.data].map((i, o) => s.type._parseSync(new vt(t, i, t.path, o)));
    return Ge.mergeArray(n, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new yt({
      ...this._def,
      minLength: { value: e, message: ne.toString(t) }
    });
  }
  max(e, t) {
    return new yt({
      ...this._def,
      maxLength: { value: e, message: ne.toString(t) }
    });
  }
  length(e, t) {
    return new yt({
      ...this._def,
      exactLength: { value: e, message: ne.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
yt.create = (r, e) => new yt({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: Z.ZodArray,
  ...fe(e)
});
function rr(r) {
  if (r instanceof Ce) {
    const e = {};
    for (const t in r.shape) {
      const n = r.shape[t];
      e[t] = Nt.create(rr(n));
    }
    return new Ce({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof yt ? new yt({
    ...r._def,
    type: rr(r.element)
  }) : r instanceof Nt ? Nt.create(rr(r.unwrap())) : r instanceof Qt ? Qt.create(rr(r.unwrap())) : r instanceof Gt ? Gt.create(r.items.map((e) => rr(e))) : r;
}
class Ce extends ge {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = be.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== Y.object) {
      const u = this._getOrReturnCtx(e);
      return B(u, {
        code: D.invalid_type,
        expected: Y.object,
        received: u.parsedType
      }), oe;
    }
    const { status: n, ctx: s } = this._processInputParams(e), { shape: a, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof Zt && this._def.unknownKeys === "strip"))
      for (const u in s.data)
        i.includes(u) || o.push(u);
    const c = [];
    for (const u of i) {
      const l = a[u], S = s.data[u];
      c.push({
        key: { status: "valid", value: u },
        value: l._parse(new vt(s, S, s.path, u)),
        alwaysSet: u in s.data
      });
    }
    if (this._def.catchall instanceof Zt) {
      const u = this._def.unknownKeys;
      if (u === "passthrough")
        for (const l of o)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: s.data[l] }
          });
      else if (u === "strict")
        o.length > 0 && (B(s, {
          code: D.unrecognized_keys,
          keys: o
        }), n.dirty());
      else if (u !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const u = this._def.catchall;
      for (const l of o) {
        const S = s.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: u._parse(
            new vt(s, S, s.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in s.data
        });
      }
    }
    return s.common.async ? Promise.resolve().then(async () => {
      const u = [];
      for (const l of c) {
        const S = await l.key, w = await l.value;
        u.push({
          key: S,
          value: w,
          alwaysSet: l.alwaysSet
        });
      }
      return u;
    }).then((u) => Ge.mergeObjectSync(n, u)) : Ge.mergeObjectSync(n, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return ne.errToObj, new Ce({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          var a, i;
          const s = ((i = (a = this._def).errorMap) == null ? void 0 : i.call(a, t, n).message) ?? n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: ne.errToObj(e).message ?? s
          } : {
            message: s
          };
        }
      } : {}
    });
  }
  strip() {
    return new Ce({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new Ce({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new Ce({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new Ce({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: Z.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new Ce({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const n of be.objectKeys(e))
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    return new Ce({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const n of be.objectKeys(this.shape))
      e[n] || (t[n] = this.shape[n]);
    return new Ce({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return rr(this);
  }
  partial(e) {
    const t = {};
    for (const n of be.objectKeys(this.shape)) {
      const s = this.shape[n];
      e && !e[n] ? t[n] = s : t[n] = s.optional();
    }
    return new Ce({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const n of be.objectKeys(this.shape))
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let a = this.shape[n];
        for (; a instanceof Nt; )
          a = a._def.innerType;
        t[n] = a;
      }
    return new Ce({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return bo(be.objectKeys(this.shape));
  }
}
Ce.create = (r, e) => new Ce({
  shape: () => r,
  unknownKeys: "strip",
  catchall: Zt.create(),
  typeName: Z.ZodObject,
  ...fe(e)
});
Ce.strictCreate = (r, e) => new Ce({
  shape: () => r,
  unknownKeys: "strict",
  catchall: Zt.create(),
  typeName: Z.ZodObject,
  ...fe(e)
});
Ce.lazycreate = (r, e) => new Ce({
  shape: r,
  unknownKeys: "strip",
  catchall: Zt.create(),
  typeName: Z.ZodObject,
  ...fe(e)
});
class kn extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function s(a) {
      for (const o of a)
        if (o.result.status === "valid")
          return o.result;
      for (const o of a)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = a.map((o) => new It(o.ctx.common.issues));
      return B(t, {
        code: D.invalid_union,
        unionErrors: i
      }), oe;
    }
    if (t.common.async)
      return Promise.all(n.map(async (a) => {
        const i = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await a._parseAsync({
            data: t.data,
            path: t.path,
            parent: i
          }),
          ctx: i
        };
      })).then(s);
    {
      let a;
      const i = [];
      for (const c of n) {
        const u = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, l = c._parseSync({
          data: t.data,
          path: t.path,
          parent: u
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !a && (a = { result: l, ctx: u }), u.common.issues.length && i.push(u.common.issues);
      }
      if (a)
        return t.common.issues.push(...a.ctx.common.issues), a.result;
      const o = i.map((c) => new It(c));
      return B(t, {
        code: D.invalid_union,
        unionErrors: o
      }), oe;
    }
  }
  get options() {
    return this._def.options;
  }
}
kn.create = (r, e) => new kn({
  options: r,
  typeName: Z.ZodUnion,
  ...fe(e)
});
const Rt = (r) => r instanceof xs ? Rt(r.schema) : r instanceof Wt ? Rt(r.innerType()) : r instanceof Rn ? [r.value] : r instanceof Jt ? r.options : r instanceof Ns ? be.objectValues(r.enum) : r instanceof En ? Rt(r._def.innerType) : r instanceof Ps ? [void 0] : r instanceof Rs ? [null] : r instanceof Nt ? [void 0, ...Rt(r.unwrap())] : r instanceof Qt ? [null, ...Rt(r.unwrap())] : r instanceof wo || r instanceof Nn ? Rt(r.unwrap()) : r instanceof xn ? Rt(r._def.innerType) : [];
class Gs extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== Y.object)
      return B(t, {
        code: D.invalid_type,
        expected: Y.object,
        received: t.parsedType
      }), oe;
    const n = this.discriminator, s = t.data[n], a = this.optionsMap.get(s);
    return a ? t.common.async ? a._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : a._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (B(t, {
      code: D.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [n]
    }), oe);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, t, n) {
    const s = /* @__PURE__ */ new Map();
    for (const a of t) {
      const i = Rt(a.shape[e]);
      if (!i.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of i) {
        if (s.has(o))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        s.set(o, a);
      }
    }
    return new Gs({
      typeName: Z.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: s,
      ...fe(n)
    });
  }
}
function Es(r, e) {
  const t = qt(r), n = qt(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === Y.object && n === Y.object) {
    const s = be.objectKeys(e), a = be.objectKeys(r).filter((o) => s.indexOf(o) !== -1), i = { ...r, ...e };
    for (const o of a) {
      const c = Es(r[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  } else if (t === Y.array && n === Y.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const s = [];
    for (let a = 0; a < r.length; a++) {
      const i = r[a], o = e[a], c = Es(i, o);
      if (!c.valid)
        return { valid: !1 };
      s.push(c.data);
    }
    return { valid: !0, data: s };
  } else return t === Y.date && n === Y.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class Sn extends ge {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), s = (a, i) => {
      if (Sa(a) || Sa(i))
        return oe;
      const o = Es(a.value, i.value);
      return o.valid ? ((Pa(a) || Pa(i)) && t.dirty(), { status: t.value, value: o.data }) : (B(n, {
        code: D.invalid_intersection_types
      }), oe);
    };
    return n.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }),
      this._def.right._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      })
    ]).then(([a, i]) => s(a, i)) : s(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
Sn.create = (r, e, t) => new Sn({
  left: r,
  right: e,
  typeName: Z.ZodIntersection,
  ...fe(t)
});
class Gt extends ge {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== Y.array)
      return B(n, {
        code: D.invalid_type,
        expected: Y.array,
        received: n.parsedType
      }), oe;
    if (n.data.length < this._def.items.length)
      return B(n, {
        code: D.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), oe;
    !this._def.rest && n.data.length > this._def.items.length && (B(n, {
      code: D.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...n.data].map((i, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new vt(n, i, n.path, o)) : null;
    }).filter((i) => !!i);
    return n.common.async ? Promise.all(a).then((i) => Ge.mergeArray(t, i)) : Ge.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Gt({
      ...this._def,
      rest: e
    });
  }
}
Gt.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Gt({
    items: r,
    typeName: Z.ZodTuple,
    rest: null,
    ...fe(e)
  });
};
class Pn extends ge {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== Y.object)
      return B(n, {
        code: D.invalid_type,
        expected: Y.object,
        received: n.parsedType
      }), oe;
    const s = [], a = this._def.keyType, i = this._def.valueType;
    for (const o in n.data)
      s.push({
        key: a._parse(new vt(n, o, n.path, o)),
        value: i._parse(new vt(n, n.data[o], n.path, o)),
        alwaysSet: o in n.data
      });
    return n.common.async ? Ge.mergeObjectAsync(t, s) : Ge.mergeObjectSync(t, s);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof ge ? new Pn({
      keyType: e,
      valueType: t,
      typeName: Z.ZodRecord,
      ...fe(n)
    }) : new Pn({
      keyType: Et.create(),
      valueType: e,
      typeName: Z.ZodRecord,
      ...fe(t)
    });
  }
}
class Na extends ge {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== Y.map)
      return B(n, {
        code: D.invalid_type,
        expected: Y.map,
        received: n.parsedType
      }), oe;
    const s = this._def.keyType, a = this._def.valueType, i = [...n.data.entries()].map(([o, c], u) => ({
      key: s._parse(new vt(n, o, n.path, [u, "key"])),
      value: a._parse(new vt(n, c, n.path, [u, "value"]))
    }));
    if (n.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of i) {
          const u = await c.key, l = await c.value;
          if (u.status === "aborted" || l.status === "aborted")
            return oe;
          (u.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(u.value, l.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of i) {
        const u = c.key, l = c.value;
        if (u.status === "aborted" || l.status === "aborted")
          return oe;
        (u.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(u.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Na.create = (r, e, t) => new Na({
  valueType: e,
  keyType: r,
  typeName: Z.ZodMap,
  ...fe(t)
});
class _r extends ge {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== Y.set)
      return B(n, {
        code: D.invalid_type,
        expected: Y.set,
        received: n.parsedType
      }), oe;
    const s = this._def;
    s.minSize !== null && n.data.size < s.minSize.value && (B(n, {
      code: D.too_small,
      minimum: s.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.minSize.message
    }), t.dirty()), s.maxSize !== null && n.data.size > s.maxSize.value && (B(n, {
      code: D.too_big,
      maximum: s.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.maxSize.message
    }), t.dirty());
    const a = this._def.valueType;
    function i(c) {
      const u = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted")
          return oe;
        l.status === "dirty" && t.dirty(), u.add(l.value);
      }
      return { status: t.value, value: u };
    }
    const o = [...n.data.values()].map((c, u) => a._parse(new vt(n, c, n.path, u)));
    return n.common.async ? Promise.all(o).then((c) => i(c)) : i(o);
  }
  min(e, t) {
    return new _r({
      ...this._def,
      minSize: { value: e, message: ne.toString(t) }
    });
  }
  max(e, t) {
    return new _r({
      ...this._def,
      maxSize: { value: e, message: ne.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
_r.create = (r, e) => new _r({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: Z.ZodSet,
  ...fe(e)
});
class xs extends ge {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
xs.create = (r, e) => new xs({
  getter: r,
  typeName: Z.ZodLazy,
  ...fe(e)
});
class Rn extends ge {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return B(t, {
        received: t.data,
        code: D.invalid_literal,
        expected: this._def.value
      }), oe;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Rn.create = (r, e) => new Rn({
  value: r,
  typeName: Z.ZodLiteral,
  ...fe(e)
});
function bo(r, e) {
  return new Jt({
    values: r,
    typeName: Z.ZodEnum,
    ...fe(e)
  });
}
class Jt extends ge {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return B(t, {
        expected: be.joinValues(n),
        received: t.parsedType,
        code: D.invalid_type
      }), oe;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return B(t, {
        received: t.data,
        code: D.invalid_enum_value,
        options: n
      }), oe;
    }
    return it(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return Jt.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return Jt.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
Jt.create = bo;
class Ns extends ge {
  _parse(e) {
    const t = be.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== Y.string && n.parsedType !== Y.number) {
      const s = be.objectValues(t);
      return B(n, {
        expected: be.joinValues(s),
        received: n.parsedType,
        code: D.invalid_type
      }), oe;
    }
    if (this._cache || (this._cache = new Set(be.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const s = be.objectValues(t);
      return B(n, {
        received: n.data,
        code: D.invalid_enum_value,
        options: s
      }), oe;
    }
    return it(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Ns.create = (r, e) => new Ns({
  values: r,
  typeName: Z.ZodNativeEnum,
  ...fe(e)
});
class Tn extends ge {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== Y.promise && t.common.async === !1)
      return B(t, {
        code: D.invalid_type,
        expected: Y.promise,
        received: t.parsedType
      }), oe;
    const n = t.parsedType === Y.promise ? t.data : Promise.resolve(t.data);
    return it(n.then((s) => this._def.type.parseAsync(s, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
Tn.create = (r, e) => new Tn({
  type: r,
  typeName: Z.ZodPromise,
  ...fe(e)
});
class Wt extends ge {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === Z.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), s = this._def.effect || null, a = {
      addIssue: (i) => {
        B(n, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), s.type === "preprocess") {
      const i = s.transform(n.data, a);
      if (n.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return oe;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: n.path,
            parent: n
          });
          return c.status === "aborted" ? oe : c.status === "dirty" || t.value === "dirty" ? fr(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return oe;
        const o = this._def.schema._parseSync({
          data: i,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? oe : o.status === "dirty" || t.value === "dirty" ? fr(o.value) : o;
      }
    }
    if (s.type === "refinement") {
      const i = (o) => {
        const c = s.refinement(o, a);
        if (n.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? oe : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => o.status === "aborted" ? oe : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (s.type === "transform")
      if (n.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!ar(i))
          return oe;
        const o = s.transform(i.value, a);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((i) => ar(i) ? Promise.resolve(s.transform(i.value, a)).then((o) => ({
          status: t.value,
          value: o
        })) : oe);
    be.assertNever(s);
  }
}
Wt.create = (r, e, t) => new Wt({
  schema: r,
  typeName: Z.ZodEffects,
  effect: e,
  ...fe(t)
});
Wt.createWithPreprocess = (r, e, t) => new Wt({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: Z.ZodEffects,
  ...fe(t)
});
class Nt extends ge {
  _parse(e) {
    return this._getType(e) === Y.undefined ? it(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Nt.create = (r, e) => new Nt({
  innerType: r,
  typeName: Z.ZodOptional,
  ...fe(e)
});
class Qt extends ge {
  _parse(e) {
    return this._getType(e) === Y.null ? it(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Qt.create = (r, e) => new Qt({
  innerType: r,
  typeName: Z.ZodNullable,
  ...fe(e)
});
class En extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === Y.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
En.create = (r, e) => new En({
  innerType: r,
  typeName: Z.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...fe(e)
});
class xn extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, s = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return wn(s) ? s.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new It(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new It(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
xn.create = (r, e) => new xn({
  innerType: r,
  typeName: Z.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...fe(e)
});
class Oa extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.nan) {
      const n = this._getOrReturnCtx(e);
      return B(n, {
        code: D.invalid_type,
        expected: Y.nan,
        received: n.parsedType
      }), oe;
    }
    return { status: "valid", value: e.data };
  }
}
Oa.create = (r) => new Oa({
  typeName: Z.ZodNaN,
  ...fe(r)
});
class wo extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Js extends ge {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? oe : a.status === "dirty" ? (t.dirty(), fr(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const s = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return s.status === "aborted" ? oe : s.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: s.value
      }) : this._def.out._parseSync({
        data: s.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new Js({
      in: e,
      out: t,
      typeName: Z.ZodPipeline
    });
  }
}
class Nn extends ge {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (s) => (ar(s) && (s.value = Object.freeze(s.value)), s);
    return wn(t) ? t.then((s) => n(s)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Nn.create = (r, e) => new Nn({
  innerType: r,
  typeName: Z.ZodReadonly,
  ...fe(e)
});
var Z;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(Z || (Z = {}));
const F = Et.create, De = ir.create, Ke = Ss.create, pt = Ts.create;
Zt.create;
const Ee = yt.create, H = Ce.create, Ze = kn.create, nd = Gs.create;
Sn.create;
Gt.create;
const or = Pn.create, ue = Rn.create, bt = Jt.create;
Tn.create;
const j = Nt.create;
Qt.create;
const $o = "2025-06-18", sd = [$o, "2025-03-26", "2024-11-05", "2024-10-07"], zn = "2.0", ko = Ze([F(), De().int()]), So = F(), ad = H({
  /**
   * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
   */
  progressToken: j(ko)
}).passthrough(), ot = H({
  _meta: j(ad)
}).passthrough(), Xe = H({
  method: F(),
  params: j(ot)
}), $r = H({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).passthrough(), $t = H({
  method: F(),
  params: j($r)
}), ct = H({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).passthrough(), Ln = Ze([F(), De().int()]), Po = H({
  jsonrpc: ue(zn),
  id: Ln
}).merge(Xe).strict(), id = (r) => Po.safeParse(r).success, Ro = H({
  jsonrpc: ue(zn)
}).merge($t).strict(), od = (r) => Ro.safeParse(r).success, To = H({
  jsonrpc: ue(zn),
  id: Ln,
  result: ct
}).strict(), Ca = (r) => To.safeParse(r).success;
var xe;
(function(r) {
  r[r.ConnectionClosed = -32e3] = "ConnectionClosed", r[r.RequestTimeout = -32001] = "RequestTimeout", r[r.ParseError = -32700] = "ParseError", r[r.InvalidRequest = -32600] = "InvalidRequest", r[r.MethodNotFound = -32601] = "MethodNotFound", r[r.InvalidParams = -32602] = "InvalidParams", r[r.InternalError = -32603] = "InternalError";
})(xe || (xe = {}));
const Eo = H({
  jsonrpc: ue(zn),
  id: Ln,
  error: H({
    /**
     * The error type that occurred.
     */
    code: De().int(),
    /**
     * A short description of the error. The message SHOULD be limited to a concise single sentence.
     */
    message: F(),
    /**
     * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
     */
    data: j(pt())
  })
}).strict(), cd = (r) => Eo.safeParse(r).success;
Ze([Po, Ro, To, Eo]);
const Ws = ct.strict(), Qs = $t.extend({
  method: ue("notifications/cancelled"),
  params: $r.extend({
    /**
     * The ID of the request to cancel.
     *
     * This MUST correspond to the ID of a request previously issued in the same direction.
     */
    requestId: Ln,
    /**
     * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
     */
    reason: F().optional()
  })
}), ud = H({
  /**
   * URL or data URI for the icon.
   */
  src: F(),
  /**
   * Optional MIME type for the icon.
   */
  mimeType: j(F()),
  /**
   * Optional array of strings that specify sizes at which the icon can be used.
   * Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
   *
   * If not provided, the client should assume that the icon can be used at any size.
   */
  sizes: j(Ee(F()))
}).passthrough(), kr = H({
  /**
   * Optional set of sized icons that the client can display in a user interface.
   *
   * Clients that support rendering icons MUST support at least the following MIME types:
   * - `image/png` - PNG images (safe, universal compatibility)
   * - `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)
   *
   * Clients that support rendering icons SHOULD also support:
   * - `image/svg+xml` - SVG images (scalable but requires security precautions)
   * - `image/webp` - WebP images (modern, efficient format)
   */
  icons: Ee(ud).optional()
}).passthrough(), Sr = H({
  /** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
  name: F(),
  /**
   * Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
   * even by those unfamiliar with domain-specific terminology.
   *
   * If not provided, the name should be used for display (except for Tool,
   * where `annotations.title` should be given precedence over using `name`,
   * if present).
   */
  title: j(F())
}).passthrough(), xo = Sr.extend({
  version: F(),
  /**
   * An optional URL of the website for this implementation.
   */
  websiteUrl: j(F())
}).merge(kr), dd = H({
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental: j(H({}).passthrough()),
  /**
   * Present if the client supports sampling from an LLM.
   */
  sampling: j(H({}).passthrough()),
  /**
   * Present if the client supports eliciting user input.
   */
  elicitation: j(H({}).passthrough()),
  /**
   * Present if the client supports listing roots.
   */
  roots: j(H({
    /**
     * Whether the client supports issuing notifications for changes to the roots list.
     */
    listChanged: j(Ke())
  }).passthrough())
}).passthrough(), No = Xe.extend({
  method: ue("initialize"),
  params: ot.extend({
    /**
     * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
     */
    protocolVersion: F(),
    capabilities: dd,
    clientInfo: xo
  })
}), ld = H({
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental: j(H({}).passthrough()),
  /**
   * Present if the server supports sending log messages to the client.
   */
  logging: j(H({}).passthrough()),
  /**
   * Present if the server supports sending completions to the client.
   */
  completions: j(H({}).passthrough()),
  /**
   * Present if the server offers any prompt templates.
   */
  prompts: j(H({
    /**
     * Whether this server supports issuing notifications for changes to the prompt list.
     */
    listChanged: j(Ke())
  }).passthrough()),
  /**
   * Present if the server offers any resources to read.
   */
  resources: j(H({
    /**
     * Whether this server supports clients subscribing to resource updates.
     */
    subscribe: j(Ke()),
    /**
     * Whether this server supports issuing notifications for changes to the resource list.
     */
    listChanged: j(Ke())
  }).passthrough()),
  /**
   * Present if the server offers any tools to call.
   */
  tools: j(H({
    /**
     * Whether this server supports issuing notifications for changes to the tool list.
     */
    listChanged: j(Ke())
  }).passthrough())
}).passthrough(), fd = ct.extend({
  /**
   * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
   */
  protocolVersion: F(),
  capabilities: ld,
  serverInfo: xo,
  /**
   * Instructions describing how to use the server and its features.
   *
   * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
   */
  instructions: j(F())
}), Oo = $t.extend({
  method: ue("notifications/initialized")
}), Ys = Xe.extend({
  method: ue("ping")
}), hd = H({
  /**
   * The progress thus far. This should increase every time progress is made, even if the total is unknown.
   */
  progress: De(),
  /**
   * Total number of items to process (or total progress required), if known.
   */
  total: j(De()),
  /**
   * An optional message describing the current progress.
   */
  message: j(F())
}).passthrough(), Xs = $t.extend({
  method: ue("notifications/progress"),
  params: $r.merge(hd).extend({
    /**
     * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
     */
    progressToken: ko
  })
}), Vn = Xe.extend({
  params: ot.extend({
    /**
     * An opaque token representing the current pagination position.
     * If provided, the server should return results starting after this cursor.
     */
    cursor: j(So)
  }).optional()
}), Fn = ct.extend({
  /**
   * An opaque token representing the pagination position after the last returned result.
   * If present, there may be more results available.
   */
  nextCursor: j(So)
}), Co = H({
  /**
   * The URI of this resource.
   */
  uri: F(),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: j(F()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).passthrough(), Io = Co.extend({
  /**
   * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
   */
  text: F()
}), ea = F().refine((r) => {
  try {
    return atob(r), !0;
  } catch {
    return !1;
  }
}, { message: "Invalid Base64 string" }), Ao = Co.extend({
  /**
   * A base64-encoded string representing the binary data of the item.
   */
  blob: ea
}), jo = Sr.extend({
  /**
   * The URI of this resource.
   */
  uri: F(),
  /**
   * A description of what this resource represents.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: j(F()),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: j(F()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).merge(kr), md = Sr.extend({
  /**
   * A URI template (according to RFC 6570) that can be used to construct resource URIs.
   */
  uriTemplate: F(),
  /**
   * A description of what this template is for.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: j(F()),
  /**
   * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
   */
  mimeType: j(F()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).merge(kr), Os = Vn.extend({
  method: ue("resources/list")
}), pd = Fn.extend({
  resources: Ee(jo)
}), Cs = Vn.extend({
  method: ue("resources/templates/list")
}), gd = Fn.extend({
  resourceTemplates: Ee(md)
}), Is = Xe.extend({
  method: ue("resources/read"),
  params: ot.extend({
    /**
     * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: F()
  })
}), yd = ct.extend({
  contents: Ee(Ze([Io, Ao]))
}), _d = $t.extend({
  method: ue("notifications/resources/list_changed")
}), vd = Xe.extend({
  method: ue("resources/subscribe"),
  params: ot.extend({
    /**
     * The URI of the resource to subscribe to. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: F()
  })
}), bd = Xe.extend({
  method: ue("resources/unsubscribe"),
  params: ot.extend({
    /**
     * The URI of the resource to unsubscribe from.
     */
    uri: F()
  })
}), wd = $t.extend({
  method: ue("notifications/resources/updated"),
  params: $r.extend({
    /**
     * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
     */
    uri: F()
  })
}), $d = H({
  /**
   * The name of the argument.
   */
  name: F(),
  /**
   * A human-readable description of the argument.
   */
  description: j(F()),
  /**
   * Whether this argument must be provided.
   */
  required: j(Ke())
}).passthrough(), kd = Sr.extend({
  /**
   * An optional description of what this prompt provides
   */
  description: j(F()),
  /**
   * A list of arguments to use for templating the prompt.
   */
  arguments: j(Ee($d)),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).merge(kr), As = Vn.extend({
  method: ue("prompts/list")
}), Sd = Fn.extend({
  prompts: Ee(kd)
}), js = Xe.extend({
  method: ue("prompts/get"),
  params: ot.extend({
    /**
     * The name of the prompt or prompt template.
     */
    name: F(),
    /**
     * Arguments to use for templating the prompt.
     */
    arguments: j(or(F()))
  })
}), ta = H({
  type: ue("text"),
  /**
   * The text content of the message.
   */
  text: F(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).passthrough(), ra = H({
  type: ue("image"),
  /**
   * The base64-encoded image data.
   */
  data: ea,
  /**
   * The MIME type of the image. Different providers may support different image types.
   */
  mimeType: F(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).passthrough(), na = H({
  type: ue("audio"),
  /**
   * The base64-encoded audio data.
   */
  data: ea,
  /**
   * The MIME type of the audio. Different providers may support different audio types.
   */
  mimeType: F(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).passthrough(), Pd = H({
  type: ue("resource"),
  resource: Ze([Io, Ao]),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).passthrough(), Rd = jo.extend({
  type: ue("resource_link")
}), Mo = Ze([
  ta,
  ra,
  na,
  Rd,
  Pd
]), Td = H({
  role: bt(["user", "assistant"]),
  content: Mo
}).passthrough(), Ed = ct.extend({
  /**
   * An optional description for the prompt.
   */
  description: j(F()),
  messages: Ee(Td)
}), xd = $t.extend({
  method: ue("notifications/prompts/list_changed")
}), Nd = H({
  /**
   * A human-readable title for the tool.
   */
  title: j(F()),
  /**
   * If true, the tool does not modify its environment.
   *
   * Default: false
   */
  readOnlyHint: j(Ke()),
  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructiveHint: j(Ke()),
  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on the its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotentHint: j(Ke()),
  /**
   * If true, this tool may interact with an "open world" of external
   * entities. If false, the tool's domain of interaction is closed.
   * For example, the world of a web search tool is open, whereas that
   * of a memory tool is not.
   *
   * Default: true
   */
  openWorldHint: j(Ke())
}).passthrough(), Od = Sr.extend({
  /**
   * A human-readable description of the tool.
   */
  description: j(F()),
  /**
   * A JSON Schema object defining the expected parameters for the tool.
   */
  inputSchema: H({
    type: ue("object"),
    properties: j(H({}).passthrough()),
    required: j(Ee(F()))
  }).passthrough(),
  /**
   * An optional JSON Schema object defining the structure of the tool's output returned in
   * the structuredContent field of a CallToolResult.
   */
  outputSchema: j(H({
    type: ue("object"),
    properties: j(H({}).passthrough()),
    required: j(Ee(F()))
  }).passthrough()),
  /**
   * Optional additional tool information.
   */
  annotations: j(Nd),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).merge(kr), Ms = Vn.extend({
  method: ue("tools/list")
}), Cd = Fn.extend({
  tools: Ee(Od)
}), qo = ct.extend({
  /**
   * A list of content objects that represent the result of the tool call.
   *
   * If the Tool does not define an outputSchema, this field MUST be present in the result.
   * For backwards compatibility, this field is always present, but it may be empty.
   */
  content: Ee(Mo).default([]),
  /**
   * An object containing structured tool output.
   *
   * If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
   */
  structuredContent: H({}).passthrough().optional(),
  /**
   * Whether the tool call ended in an error.
   *
   * If not set, this is assumed to be false (the call was successful).
   *
   * Any errors that originate from the tool SHOULD be reported inside the result
   * object, with `isError` set to true, _not_ as an MCP protocol-level error
   * response. Otherwise, the LLM would not be able to see that an error occurred
   * and self-correct.
   *
   * However, any errors in _finding_ the tool, an error indicating that the
   * server does not support tool calls, or any other exceptional conditions,
   * should be reported as an MCP error response.
   */
  isError: j(Ke())
});
qo.or(ct.extend({
  toolResult: pt()
}));
const qs = Xe.extend({
  method: ue("tools/call"),
  params: ot.extend({
    name: F(),
    arguments: j(or(pt()))
  })
}), Id = $t.extend({
  method: ue("notifications/tools/list_changed")
}), On = bt(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]), Do = Xe.extend({
  method: ue("logging/setLevel"),
  params: ot.extend({
    /**
     * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
     */
    level: On
  })
}), Ad = $t.extend({
  method: ue("notifications/message"),
  params: $r.extend({
    /**
     * The severity of this log message.
     */
    level: On,
    /**
     * An optional name of the logger issuing this message.
     */
    logger: j(F()),
    /**
     * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
     */
    data: pt()
  })
}), jd = H({
  /**
   * A hint for a model name.
   */
  name: F().optional()
}).passthrough(), Md = H({
  /**
   * Optional hints to use for model selection.
   */
  hints: j(Ee(jd)),
  /**
   * How much to prioritize cost when selecting a model.
   */
  costPriority: j(De().min(0).max(1)),
  /**
   * How much to prioritize sampling speed (latency) when selecting a model.
   */
  speedPriority: j(De().min(0).max(1)),
  /**
   * How much to prioritize intelligence and capabilities when selecting a model.
   */
  intelligencePriority: j(De().min(0).max(1))
}).passthrough(), qd = H({
  role: bt(["user", "assistant"]),
  content: Ze([ta, ra, na])
}).passthrough(), Dd = Xe.extend({
  method: ue("sampling/createMessage"),
  params: ot.extend({
    messages: Ee(qd),
    /**
     * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
     */
    systemPrompt: j(F()),
    /**
     * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt. The client MAY ignore this request.
     */
    includeContext: j(bt(["none", "thisServer", "allServers"])),
    temperature: j(De()),
    /**
     * The maximum number of tokens to sample, as requested by the server. The client MAY choose to sample fewer tokens than requested.
     */
    maxTokens: De().int(),
    stopSequences: j(Ee(F())),
    /**
     * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
     */
    metadata: j(H({}).passthrough()),
    /**
     * The server's preferences for which model to select.
     */
    modelPreferences: j(Md)
  })
}), Zo = ct.extend({
  /**
   * The name of the model that generated the message.
   */
  model: F(),
  /**
   * The reason why sampling stopped.
   */
  stopReason: j(bt(["endTurn", "stopSequence", "maxTokens"]).or(F())),
  role: bt(["user", "assistant"]),
  content: nd("type", [ta, ra, na])
}), Zd = H({
  type: ue("boolean"),
  title: j(F()),
  description: j(F()),
  default: j(Ke())
}).passthrough(), zd = H({
  type: ue("string"),
  title: j(F()),
  description: j(F()),
  minLength: j(De()),
  maxLength: j(De()),
  format: j(bt(["email", "uri", "date", "date-time"]))
}).passthrough(), Ld = H({
  type: bt(["number", "integer"]),
  title: j(F()),
  description: j(F()),
  minimum: j(De()),
  maximum: j(De())
}).passthrough(), Vd = H({
  type: ue("string"),
  title: j(F()),
  description: j(F()),
  enum: Ee(F()),
  enumNames: j(Ee(F()))
}).passthrough(), Fd = Ze([Zd, zd, Ld, Vd]), Ud = Xe.extend({
  method: ue("elicitation/create"),
  params: ot.extend({
    /**
     * The message to present to the user.
     */
    message: F(),
    /**
     * The schema for the requested user input.
     */
    requestedSchema: H({
      type: ue("object"),
      properties: or(F(), Fd),
      required: j(Ee(F()))
    }).passthrough()
  })
}), zo = ct.extend({
  /**
   * The user's response action.
   */
  action: bt(["accept", "decline", "cancel"]),
  /**
   * The collected user input content (only present if action is "accept").
   */
  content: j(or(F(), pt()))
}), Hd = H({
  type: ue("ref/resource"),
  /**
   * The URI or URI template of the resource.
   */
  uri: F()
}).passthrough(), Kd = H({
  type: ue("ref/prompt"),
  /**
   * The name of the prompt or prompt template
   */
  name: F()
}).passthrough(), Ds = Xe.extend({
  method: ue("completion/complete"),
  params: ot.extend({
    ref: Ze([Kd, Hd]),
    /**
     * The argument's information
     */
    argument: H({
      /**
       * The name of the argument
       */
      name: F(),
      /**
       * The value of the argument to use for completion matching.
       */
      value: F()
    }).passthrough(),
    context: j(H({
      /**
       * Previously-resolved variables in a URI template or prompt.
       */
      arguments: j(or(F(), F()))
    }))
  })
}), Bd = ct.extend({
  completion: H({
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: Ee(F()).max(100),
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: j(De().int()),
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: j(Ke())
  }).passthrough()
}), Gd = H({
  /**
   * The URI identifying the root. This *must* start with file:// for now.
   */
  uri: F().startsWith("file://"),
  /**
   * An optional name for the root.
   */
  name: j(F()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(H({}).passthrough())
}).passthrough(), Jd = Xe.extend({
  method: ue("roots/list")
}), Lo = ct.extend({
  roots: Ee(Gd)
}), Wd = $t.extend({
  method: ue("notifications/roots/list_changed")
});
Ze([
  Ys,
  No,
  Ds,
  Do,
  js,
  As,
  Os,
  Cs,
  Is,
  vd,
  bd,
  qs,
  Ms
]);
Ze([
  Qs,
  Xs,
  Oo,
  Wd
]);
Ze([Ws, Zo, zo, Lo]);
Ze([Ys, Dd, Ud, Jd]);
Ze([
  Qs,
  Xs,
  Ad,
  wd,
  _d,
  Id,
  xd
]);
Ze([
  Ws,
  fd,
  Bd,
  Ed,
  Sd,
  pd,
  gd,
  yd,
  qo,
  Cd
]);
class Ne extends Error {
  constructor(e, t, n) {
    super(`MCP error ${e}: ${t}`), this.code = e, this.data = n, this.name = "McpError";
  }
}
const Qd = 6e4;
class Yd {
  constructor(e) {
    this._options = e, this._requestMessageId = 0, this._requestHandlers = /* @__PURE__ */ new Map(), this._requestHandlerAbortControllers = /* @__PURE__ */ new Map(), this._notificationHandlers = /* @__PURE__ */ new Map(), this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers = /* @__PURE__ */ new Map(), this._timeoutInfo = /* @__PURE__ */ new Map(), this._pendingDebouncedNotifications = /* @__PURE__ */ new Set(), this.setNotificationHandler(Qs, (t) => {
      const n = this._requestHandlerAbortControllers.get(t.params.requestId);
      n == null || n.abort(t.params.reason);
    }), this.setNotificationHandler(Xs, (t) => {
      this._onprogress(t);
    }), this.setRequestHandler(
      Ys,
      // Automatic pong by default.
      (t) => ({})
    );
  }
  _setupTimeout(e, t, n, s, a = !1) {
    this._timeoutInfo.set(e, {
      timeoutId: setTimeout(s, t),
      startTime: Date.now(),
      timeout: t,
      maxTotalTimeout: n,
      resetTimeoutOnProgress: a,
      onTimeout: s
    });
  }
  _resetTimeout(e) {
    const t = this._timeoutInfo.get(e);
    if (!t)
      return !1;
    const n = Date.now() - t.startTime;
    if (t.maxTotalTimeout && n >= t.maxTotalTimeout)
      throw this._timeoutInfo.delete(e), new Ne(xe.RequestTimeout, "Maximum total timeout exceeded", {
        maxTotalTimeout: t.maxTotalTimeout,
        totalElapsed: n
      });
    return clearTimeout(t.timeoutId), t.timeoutId = setTimeout(t.onTimeout, t.timeout), !0;
  }
  _cleanupTimeout(e) {
    const t = this._timeoutInfo.get(e);
    t && (clearTimeout(t.timeoutId), this._timeoutInfo.delete(e));
  }
  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
   */
  async connect(e) {
    var t, n, s;
    this._transport = e;
    const a = (t = this.transport) === null || t === void 0 ? void 0 : t.onclose;
    this._transport.onclose = () => {
      a == null || a(), this._onclose();
    };
    const i = (n = this.transport) === null || n === void 0 ? void 0 : n.onerror;
    this._transport.onerror = (c) => {
      i == null || i(c), this._onerror(c);
    };
    const o = (s = this._transport) === null || s === void 0 ? void 0 : s.onmessage;
    this._transport.onmessage = (c, u) => {
      o == null || o(c, u), Ca(c) || cd(c) ? this._onresponse(c) : id(c) ? this._onrequest(c, u) : od(c) ? this._onnotification(c) : this._onerror(new Error(`Unknown message type: ${JSON.stringify(c)}`));
    }, await this._transport.start();
  }
  _onclose() {
    var e;
    const t = this._responseHandlers;
    this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers.clear(), this._pendingDebouncedNotifications.clear(), this._transport = void 0, (e = this.onclose) === null || e === void 0 || e.call(this);
    const n = new Ne(xe.ConnectionClosed, "Connection closed");
    for (const s of t.values())
      s(n);
  }
  _onerror(e) {
    var t;
    (t = this.onerror) === null || t === void 0 || t.call(this, e);
  }
  _onnotification(e) {
    var t;
    const n = (t = this._notificationHandlers.get(e.method)) !== null && t !== void 0 ? t : this.fallbackNotificationHandler;
    n !== void 0 && Promise.resolve().then(() => n(e)).catch((s) => this._onerror(new Error(`Uncaught error in notification handler: ${s}`)));
  }
  _onrequest(e, t) {
    var n, s;
    const a = (n = this._requestHandlers.get(e.method)) !== null && n !== void 0 ? n : this.fallbackRequestHandler, i = this._transport;
    if (a === void 0) {
      i == null || i.send({
        jsonrpc: "2.0",
        id: e.id,
        error: {
          code: xe.MethodNotFound,
          message: "Method not found"
        }
      }).catch((u) => this._onerror(new Error(`Failed to send an error response: ${u}`)));
      return;
    }
    const o = new AbortController();
    this._requestHandlerAbortControllers.set(e.id, o);
    const c = {
      signal: o.signal,
      sessionId: i == null ? void 0 : i.sessionId,
      _meta: (s = e.params) === null || s === void 0 ? void 0 : s._meta,
      sendNotification: (u) => this.notification(u, { relatedRequestId: e.id }),
      sendRequest: (u, l, S) => this.request(u, l, { ...S, relatedRequestId: e.id }),
      authInfo: t == null ? void 0 : t.authInfo,
      requestId: e.id,
      requestInfo: t == null ? void 0 : t.requestInfo
    };
    Promise.resolve().then(() => a(e, c)).then((u) => {
      if (!o.signal.aborted)
        return i == null ? void 0 : i.send({
          result: u,
          jsonrpc: "2.0",
          id: e.id
        });
    }, (u) => {
      var l;
      if (!o.signal.aborted)
        return i == null ? void 0 : i.send({
          jsonrpc: "2.0",
          id: e.id,
          error: {
            code: Number.isSafeInteger(u.code) ? u.code : xe.InternalError,
            message: (l = u.message) !== null && l !== void 0 ? l : "Internal error"
          }
        });
    }).catch((u) => this._onerror(new Error(`Failed to send response: ${u}`))).finally(() => {
      this._requestHandlerAbortControllers.delete(e.id);
    });
  }
  _onprogress(e) {
    const { progressToken: t, ...n } = e.params, s = Number(t), a = this._progressHandlers.get(s);
    if (!a) {
      this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`));
      return;
    }
    const i = this._responseHandlers.get(s), o = this._timeoutInfo.get(s);
    if (o && i && o.resetTimeoutOnProgress)
      try {
        this._resetTimeout(s);
      } catch (c) {
        i(c);
        return;
      }
    a(n);
  }
  _onresponse(e) {
    const t = Number(e.id), n = this._responseHandlers.get(t);
    if (n === void 0) {
      this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`));
      return;
    }
    if (this._responseHandlers.delete(t), this._progressHandlers.delete(t), this._cleanupTimeout(t), Ca(e))
      n(e);
    else {
      const s = new Ne(e.error.code, e.error.message, e.error.data);
      n(s);
    }
  }
  get transport() {
    return this._transport;
  }
  /**
   * Closes the connection.
   */
  async close() {
    var e;
    await ((e = this._transport) === null || e === void 0 ? void 0 : e.close());
  }
  /**
   * Sends a request and wait for a response.
   *
   * Do not use this method to emit notifications! Use notification() instead.
   */
  request(e, t, n) {
    const { relatedRequestId: s, resumptionToken: a, onresumptiontoken: i } = n ?? {};
    return new Promise((o, c) => {
      var u, l, S, w, v, b;
      if (!this._transport) {
        c(new Error("Not connected"));
        return;
      }
      ((u = this._options) === null || u === void 0 ? void 0 : u.enforceStrictCapabilities) === !0 && this.assertCapabilityForMethod(e.method), (l = n == null ? void 0 : n.signal) === null || l === void 0 || l.throwIfAborted();
      const $ = this._requestMessageId++, m = {
        ...e,
        jsonrpc: "2.0",
        id: $
      };
      n != null && n.onprogress && (this._progressHandlers.set($, n.onprogress), m.params = {
        ...e.params,
        _meta: {
          ...((S = e.params) === null || S === void 0 ? void 0 : S._meta) || {},
          progressToken: $
        }
      });
      const p = (_) => {
        var f;
        this._responseHandlers.delete($), this._progressHandlers.delete($), this._cleanupTimeout($), (f = this._transport) === null || f === void 0 || f.send({
          jsonrpc: "2.0",
          method: "notifications/cancelled",
          params: {
            requestId: $,
            reason: String(_)
          }
        }, { relatedRequestId: s, resumptionToken: a, onresumptiontoken: i }).catch((y) => this._onerror(new Error(`Failed to send cancellation: ${y}`))), c(_);
      };
      this._responseHandlers.set($, (_) => {
        var f;
        if (!(!((f = n == null ? void 0 : n.signal) === null || f === void 0) && f.aborted)) {
          if (_ instanceof Error)
            return c(_);
          try {
            const y = t.parse(_.result);
            o(y);
          } catch (y) {
            c(y);
          }
        }
      }), (w = n == null ? void 0 : n.signal) === null || w === void 0 || w.addEventListener("abort", () => {
        var _;
        p((_ = n == null ? void 0 : n.signal) === null || _ === void 0 ? void 0 : _.reason);
      });
      const d = (v = n == null ? void 0 : n.timeout) !== null && v !== void 0 ? v : Qd, h = () => p(new Ne(xe.RequestTimeout, "Request timed out", { timeout: d }));
      this._setupTimeout($, d, n == null ? void 0 : n.maxTotalTimeout, h, (b = n == null ? void 0 : n.resetTimeoutOnProgress) !== null && b !== void 0 ? b : !1), this._transport.send(m, { relatedRequestId: s, resumptionToken: a, onresumptiontoken: i }).catch((_) => {
        this._cleanupTimeout($), c(_);
      });
    });
  }
  /**
   * Emits a notification, which is a one-way message that does not expect a response.
   */
  async notification(e, t) {
    var n, s;
    if (!this._transport)
      throw new Error("Not connected");
    if (this.assertNotificationCapability(e.method), ((s = (n = this._options) === null || n === void 0 ? void 0 : n.debouncedNotificationMethods) !== null && s !== void 0 ? s : []).includes(e.method) && !e.params && !(t != null && t.relatedRequestId)) {
      if (this._pendingDebouncedNotifications.has(e.method))
        return;
      this._pendingDebouncedNotifications.add(e.method), Promise.resolve().then(() => {
        var c;
        if (this._pendingDebouncedNotifications.delete(e.method), !this._transport)
          return;
        const u = {
          ...e,
          jsonrpc: "2.0"
        };
        (c = this._transport) === null || c === void 0 || c.send(u, t).catch((l) => this._onerror(l));
      });
      return;
    }
    const o = {
      ...e,
      jsonrpc: "2.0"
    };
    await this._transport.send(o, t);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a request with the given method.
   *
   * Note that this will replace any previous request handler for the same method.
   */
  setRequestHandler(e, t) {
    const n = e.shape.method.value;
    this.assertRequestHandlerCapability(n), this._requestHandlers.set(n, (s, a) => Promise.resolve(t(e.parse(s), a)));
  }
  /**
   * Removes the request handler for the given method.
   */
  removeRequestHandler(e) {
    this._requestHandlers.delete(e);
  }
  /**
   * Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
   */
  assertCanSetRequestHandler(e) {
    if (this._requestHandlers.has(e))
      throw new Error(`A request handler for ${e} already exists, which would be overridden`);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a notification with the given method.
   *
   * Note that this will replace any previous notification handler for the same method.
   */
  setNotificationHandler(e, t) {
    this._notificationHandlers.set(e.shape.method.value, (n) => Promise.resolve(t(e.parse(n))));
  }
  /**
   * Removes the notification handler for the given method.
   */
  removeNotificationHandler(e) {
    this._notificationHandlers.delete(e);
  }
}
function Xd(r, e) {
  return Object.entries(e).reduce((t, [n, s]) => (s && typeof s == "object" ? t[n] = t[n] ? { ...t[n], ...s } : s : t[n] = s, t), { ...r });
}
function el(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Pr = { exports: {} }, Xn = {}, kt = {}, Lt = {}, es = {}, ts = {}, rs = {}, Ia;
function Cn() {
  return Ia || (Ia = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.regexpCode = r.getEsmExportName = r.getProperty = r.safeStringify = r.stringify = r.strConcat = r.addCodeArg = r.str = r._ = r.nil = r._Code = r.Name = r.IDENTIFIER = r._CodeOrName = void 0;
    class e {
    }
    r._CodeOrName = e, r.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class t extends e {
      constructor(d) {
        if (super(), !r.IDENTIFIER.test(d))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = d;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    r.Name = t;
    class n extends e {
      constructor(d) {
        super(), this._items = typeof d == "string" ? [d] : d;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const d = this._items[0];
        return d === "" || d === '""';
      }
      get str() {
        var d;
        return (d = this._str) !== null && d !== void 0 ? d : this._str = this._items.reduce((h, _) => `${h}${_}`, "");
      }
      get names() {
        var d;
        return (d = this._names) !== null && d !== void 0 ? d : this._names = this._items.reduce((h, _) => (_ instanceof t && (h[_.str] = (h[_.str] || 0) + 1), h), {});
      }
    }
    r._Code = n, r.nil = new n("");
    function s(p, ...d) {
      const h = [p[0]];
      let _ = 0;
      for (; _ < d.length; )
        o(h, d[_]), h.push(p[++_]);
      return new n(h);
    }
    r._ = s;
    const a = new n("+");
    function i(p, ...d) {
      const h = [v(p[0])];
      let _ = 0;
      for (; _ < d.length; )
        h.push(a), o(h, d[_]), h.push(a, v(p[++_]));
      return c(h), new n(h);
    }
    r.str = i;
    function o(p, d) {
      d instanceof n ? p.push(...d._items) : d instanceof t ? p.push(d) : p.push(S(d));
    }
    r.addCodeArg = o;
    function c(p) {
      let d = 1;
      for (; d < p.length - 1; ) {
        if (p[d] === a) {
          const h = u(p[d - 1], p[d + 1]);
          if (h !== void 0) {
            p.splice(d - 1, 3, h);
            continue;
          }
          p[d++] = "+";
        }
        d++;
      }
    }
    function u(p, d) {
      if (d === '""')
        return p;
      if (p === '""')
        return d;
      if (typeof p == "string")
        return d instanceof t || p[p.length - 1] !== '"' ? void 0 : typeof d != "string" ? `${p.slice(0, -1)}${d}"` : d[0] === '"' ? p.slice(0, -1) + d.slice(1) : void 0;
      if (typeof d == "string" && d[0] === '"' && !(p instanceof t))
        return `"${p}${d.slice(1)}`;
    }
    function l(p, d) {
      return d.emptyStr() ? p : p.emptyStr() ? d : i`${p}${d}`;
    }
    r.strConcat = l;
    function S(p) {
      return typeof p == "number" || typeof p == "boolean" || p === null ? p : v(Array.isArray(p) ? p.join(",") : p);
    }
    function w(p) {
      return new n(v(p));
    }
    r.stringify = w;
    function v(p) {
      return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    r.safeStringify = v;
    function b(p) {
      return typeof p == "string" && r.IDENTIFIER.test(p) ? new n(`.${p}`) : s`[${p}]`;
    }
    r.getProperty = b;
    function $(p) {
      if (typeof p == "string" && r.IDENTIFIER.test(p))
        return new n(`${p}`);
      throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
    }
    r.getEsmExportName = $;
    function m(p) {
      return new n(p.toString());
    }
    r.regexpCode = m;
  })(rs)), rs;
}
var ns = {}, Aa;
function ja() {
  return Aa || (Aa = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.ValueScope = r.ValueScopeName = r.Scope = r.varKinds = r.UsedValueState = void 0;
    const e = Cn();
    class t extends Error {
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
      }
    }
    var n;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(n || (r.UsedValueState = n = {})), r.varKinds = {
      const: new e.Name("const"),
      let: new e.Name("let"),
      var: new e.Name("var")
    };
    class s {
      constructor({ prefixes: u, parent: l } = {}) {
        this._names = {}, this._prefixes = u, this._parent = l;
      }
      toName(u) {
        return u instanceof e.Name ? u : this.name(u);
      }
      name(u) {
        return new e.Name(this._newName(u));
      }
      _newName(u) {
        const l = this._names[u] || this._nameGroup(u);
        return `${u}${l.index++}`;
      }
      _nameGroup(u) {
        var l, S;
        if (!((S = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || S === void 0) && S.has(u) || this._prefixes && !this._prefixes.has(u))
          throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
        return this._names[u] = { prefix: u, index: 0 };
      }
    }
    r.Scope = s;
    class a extends e.Name {
      constructor(u, l) {
        super(l), this.prefix = u;
      }
      setValue(u, { property: l, itemIndex: S }) {
        this.value = u, this.scopePath = (0, e._)`.${new e.Name(l)}[${S}]`;
      }
    }
    r.ValueScopeName = a;
    const i = (0, e._)`\n`;
    class o extends s {
      constructor(u) {
        super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? i : e.nil };
      }
      get() {
        return this._scope;
      }
      name(u) {
        return new a(u, this._newName(u));
      }
      value(u, l) {
        var S;
        if (l.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const w = this.toName(u), { prefix: v } = w, b = (S = l.key) !== null && S !== void 0 ? S : l.ref;
        let $ = this._values[v];
        if ($) {
          const d = $.get(b);
          if (d)
            return d;
        } else
          $ = this._values[v] = /* @__PURE__ */ new Map();
        $.set(b, w);
        const m = this._scope[v] || (this._scope[v] = []), p = m.length;
        return m[p] = l.ref, w.setValue(l, { property: v, itemIndex: p }), w;
      }
      getValue(u, l) {
        const S = this._values[u];
        if (S)
          return S.get(l);
      }
      scopeRefs(u, l = this._values) {
        return this._reduceValues(l, (S) => {
          if (S.scopePath === void 0)
            throw new Error(`CodeGen: name "${S}" has no value`);
          return (0, e._)`${u}${S.scopePath}`;
        });
      }
      scopeCode(u = this._values, l, S) {
        return this._reduceValues(u, (w) => {
          if (w.value === void 0)
            throw new Error(`CodeGen: name "${w}" has no value`);
          return w.value.code;
        }, l, S);
      }
      _reduceValues(u, l, S = {}, w) {
        let v = e.nil;
        for (const b in u) {
          const $ = u[b];
          if (!$)
            continue;
          const m = S[b] = S[b] || /* @__PURE__ */ new Map();
          $.forEach((p) => {
            if (m.has(p))
              return;
            m.set(p, n.Started);
            let d = l(p);
            if (d) {
              const h = this.opts.es5 ? r.varKinds.var : r.varKinds.const;
              v = (0, e._)`${v}${h} ${p} = ${d};${this.opts._n}`;
            } else if (d = w == null ? void 0 : w(p))
              v = (0, e._)`${v}${d}${this.opts._n}`;
            else
              throw new t(p);
            m.set(p, n.Completed);
          });
        }
        return v;
      }
    }
    r.ValueScope = o;
  })(ns)), ns;
}
var Ma;
function me() {
  return Ma || (Ma = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.or = r.and = r.not = r.CodeGen = r.operators = r.varKinds = r.ValueScopeName = r.ValueScope = r.Scope = r.Name = r.regexpCode = r.stringify = r.getProperty = r.nil = r.strConcat = r.str = r._ = void 0;
    const e = Cn(), t = ja();
    var n = Cn();
    Object.defineProperty(r, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(r, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(r, "strConcat", { enumerable: !0, get: function() {
      return n.strConcat;
    } }), Object.defineProperty(r, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(r, "getProperty", { enumerable: !0, get: function() {
      return n.getProperty;
    } }), Object.defineProperty(r, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(r, "regexpCode", { enumerable: !0, get: function() {
      return n.regexpCode;
    } }), Object.defineProperty(r, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } });
    var s = ja();
    Object.defineProperty(r, "Scope", { enumerable: !0, get: function() {
      return s.Scope;
    } }), Object.defineProperty(r, "ValueScope", { enumerable: !0, get: function() {
      return s.ValueScope;
    } }), Object.defineProperty(r, "ValueScopeName", { enumerable: !0, get: function() {
      return s.ValueScopeName;
    } }), Object.defineProperty(r, "varKinds", { enumerable: !0, get: function() {
      return s.varKinds;
    } }), r.operators = {
      GT: new e._Code(">"),
      GTE: new e._Code(">="),
      LT: new e._Code("<"),
      LTE: new e._Code("<="),
      EQ: new e._Code("==="),
      NEQ: new e._Code("!=="),
      NOT: new e._Code("!"),
      OR: new e._Code("||"),
      AND: new e._Code("&&"),
      ADD: new e._Code("+")
    };
    class a {
      optimizeNodes() {
        return this;
      }
      optimizeNames(g, P) {
        return this;
      }
    }
    class i extends a {
      constructor(g, P, O) {
        super(), this.varKind = g, this.name = P, this.rhs = O;
      }
      render({ es5: g, _n: P }) {
        const O = g ? t.varKinds.var : this.varKind, te = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${O} ${this.name}${te};` + P;
      }
      optimizeNames(g, P) {
        if (g[this.name.str])
          return this.rhs && (this.rhs = ee(this.rhs, g, P)), this;
      }
      get names() {
        return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
      }
    }
    class o extends a {
      constructor(g, P, O) {
        super(), this.lhs = g, this.rhs = P, this.sideEffects = O;
      }
      render({ _n: g }) {
        return `${this.lhs} = ${this.rhs};` + g;
      }
      optimizeNames(g, P) {
        if (!(this.lhs instanceof e.Name && !g[this.lhs.str] && !this.sideEffects))
          return this.rhs = ee(this.rhs, g, P), this;
      }
      get names() {
        const g = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
        return W(g, this.rhs);
      }
    }
    class c extends o {
      constructor(g, P, O, te) {
        super(g, O, te), this.op = P;
      }
      render({ _n: g }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + g;
      }
    }
    class u extends a {
      constructor(g) {
        super(), this.label = g, this.names = {};
      }
      render({ _n: g }) {
        return `${this.label}:` + g;
      }
    }
    class l extends a {
      constructor(g) {
        super(), this.label = g, this.names = {};
      }
      render({ _n: g }) {
        return `break${this.label ? ` ${this.label}` : ""};` + g;
      }
    }
    class S extends a {
      constructor(g) {
        super(), this.error = g;
      }
      render({ _n: g }) {
        return `throw ${this.error};` + g;
      }
      get names() {
        return this.error.names;
      }
    }
    class w extends a {
      constructor(g) {
        super(), this.code = g;
      }
      render({ _n: g }) {
        return `${this.code};` + g;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(g, P) {
        return this.code = ee(this.code, g, P), this;
      }
      get names() {
        return this.code instanceof e._CodeOrName ? this.code.names : {};
      }
    }
    class v extends a {
      constructor(g = []) {
        super(), this.nodes = g;
      }
      render(g) {
        return this.nodes.reduce((P, O) => P + O.render(g), "");
      }
      optimizeNodes() {
        const { nodes: g } = this;
        let P = g.length;
        for (; P--; ) {
          const O = g[P].optimizeNodes();
          Array.isArray(O) ? g.splice(P, 1, ...O) : O ? g[P] = O : g.splice(P, 1);
        }
        return g.length > 0 ? this : void 0;
      }
      optimizeNames(g, P) {
        const { nodes: O } = this;
        let te = O.length;
        for (; te--; ) {
          const ae = O[te];
          ae.optimizeNames(g, P) || (Se(g, ae.names), O.splice(te, 1));
        }
        return O.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((g, P) => U(g, P.names), {});
      }
    }
    class b extends v {
      render(g) {
        return "{" + g._n + super.render(g) + "}" + g._n;
      }
    }
    class $ extends v {
    }
    class m extends b {
    }
    m.kind = "else";
    class p extends b {
      constructor(g, P) {
        super(P), this.condition = g;
      }
      render(g) {
        let P = `if(${this.condition})` + super.render(g);
        return this.else && (P += "else " + this.else.render(g)), P;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const g = this.condition;
        if (g === !0)
          return this.nodes;
        let P = this.else;
        if (P) {
          const O = P.optimizeNodes();
          P = this.else = Array.isArray(O) ? new m(O) : O;
        }
        if (P)
          return g === !1 ? P instanceof p ? P : P.nodes : this.nodes.length ? this : new p(ze(g), P instanceof p ? [P] : P.nodes);
        if (!(g === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(g, P) {
        var O;
        if (this.else = (O = this.else) === null || O === void 0 ? void 0 : O.optimizeNames(g, P), !!(super.optimizeNames(g, P) || this.else))
          return this.condition = ee(this.condition, g, P), this;
      }
      get names() {
        const g = super.names;
        return W(g, this.condition), this.else && U(g, this.else.names), g;
      }
    }
    p.kind = "if";
    class d extends b {
    }
    d.kind = "for";
    class h extends d {
      constructor(g) {
        super(), this.iteration = g;
      }
      render(g) {
        return `for(${this.iteration})` + super.render(g);
      }
      optimizeNames(g, P) {
        if (super.optimizeNames(g, P))
          return this.iteration = ee(this.iteration, g, P), this;
      }
      get names() {
        return U(super.names, this.iteration.names);
      }
    }
    class _ extends d {
      constructor(g, P, O, te) {
        super(), this.varKind = g, this.name = P, this.from = O, this.to = te;
      }
      render(g) {
        const P = g.es5 ? t.varKinds.var : this.varKind, { name: O, from: te, to: ae } = this;
        return `for(${P} ${O}=${te}; ${O}<${ae}; ${O}++)` + super.render(g);
      }
      get names() {
        const g = W(super.names, this.from);
        return W(g, this.to);
      }
    }
    class f extends d {
      constructor(g, P, O, te) {
        super(), this.loop = g, this.varKind = P, this.name = O, this.iterable = te;
      }
      render(g) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(g);
      }
      optimizeNames(g, P) {
        if (super.optimizeNames(g, P))
          return this.iterable = ee(this.iterable, g, P), this;
      }
      get names() {
        return U(super.names, this.iterable.names);
      }
    }
    class y extends b {
      constructor(g, P, O) {
        super(), this.name = g, this.args = P, this.async = O;
      }
      render(g) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(g);
      }
    }
    y.kind = "func";
    class k extends v {
      render(g) {
        return "return " + super.render(g);
      }
    }
    k.kind = "return";
    class N extends b {
      render(g) {
        let P = "try" + super.render(g);
        return this.catch && (P += this.catch.render(g)), this.finally && (P += this.finally.render(g)), P;
      }
      optimizeNodes() {
        var g, P;
        return super.optimizeNodes(), (g = this.catch) === null || g === void 0 || g.optimizeNodes(), (P = this.finally) === null || P === void 0 || P.optimizeNodes(), this;
      }
      optimizeNames(g, P) {
        var O, te;
        return super.optimizeNames(g, P), (O = this.catch) === null || O === void 0 || O.optimizeNames(g, P), (te = this.finally) === null || te === void 0 || te.optimizeNames(g, P), this;
      }
      get names() {
        const g = super.names;
        return this.catch && U(g, this.catch.names), this.finally && U(g, this.finally.names), g;
      }
    }
    class z extends b {
      constructor(g) {
        super(), this.error = g;
      }
      render(g) {
        return `catch(${this.error})` + super.render(g);
      }
    }
    z.kind = "catch";
    class J extends b {
      render(g) {
        return "finally" + super.render(g);
      }
    }
    J.kind = "finally";
    class C {
      constructor(g, P = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...P, _n: P.lines ? `
` : "" }, this._extScope = g, this._scope = new t.Scope({ parent: g }), this._nodes = [new $()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(g) {
        return this._scope.name(g);
      }
      // reserves unique name in the external scope
      scopeName(g) {
        return this._extScope.name(g);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(g, P) {
        const O = this._extScope.value(g, P);
        return (this._values[O.prefix] || (this._values[O.prefix] = /* @__PURE__ */ new Set())).add(O), O;
      }
      getScopeValue(g, P) {
        return this._extScope.getValue(g, P);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(g) {
        return this._extScope.scopeRefs(g, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(g, P, O, te) {
        const ae = this._scope.toName(P);
        return O !== void 0 && te && (this._constants[ae.str] = O), this._leafNode(new i(g, ae, O)), ae;
      }
      // `const` declaration (`var` in es5 mode)
      const(g, P, O) {
        return this._def(t.varKinds.const, g, P, O);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(g, P, O) {
        return this._def(t.varKinds.let, g, P, O);
      }
      // `var` declaration with optional assignment
      var(g, P, O) {
        return this._def(t.varKinds.var, g, P, O);
      }
      // assignment code
      assign(g, P, O) {
        return this._leafNode(new o(g, P, O));
      }
      // `+=` code
      add(g, P) {
        return this._leafNode(new c(g, r.operators.ADD, P));
      }
      // appends passed SafeExpr to code or executes Block
      code(g) {
        return typeof g == "function" ? g() : g !== e.nil && this._leafNode(new w(g)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...g) {
        const P = ["{"];
        for (const [O, te] of g)
          P.length > 1 && P.push(","), P.push(O), (O !== te || this.opts.es5) && (P.push(":"), (0, e.addCodeArg)(P, te));
        return P.push("}"), new e._Code(P);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(g, P, O) {
        if (this._blockNode(new p(g)), P && O)
          this.code(P).else().code(O).endIf();
        else if (P)
          this.code(P).endIf();
        else if (O)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(g) {
        return this._elseNode(new p(g));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new m());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(p, m);
      }
      _for(g, P) {
        return this._blockNode(g), P && this.code(P).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(g, P) {
        return this._for(new h(g), P);
      }
      // `for` statement for a range of values
      forRange(g, P, O, te, ae = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const $e = this._scope.toName(g);
        return this._for(new _(ae, $e, P, O), () => te($e));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(g, P, O, te = t.varKinds.const) {
        const ae = this._scope.toName(g);
        if (this.opts.es5) {
          const $e = P instanceof e.Name ? P : this.var("_arr", P);
          return this.forRange("_i", 0, (0, e._)`${$e}.length`, (_e) => {
            this.var(ae, (0, e._)`${$e}[${_e}]`), O(ae);
          });
        }
        return this._for(new f("of", te, ae, P), () => O(ae));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(g, P, O, te = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(g, (0, e._)`Object.keys(${P})`, O);
        const ae = this._scope.toName(g);
        return this._for(new f("in", te, ae, P), () => O(ae));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(d);
      }
      // `label` statement
      label(g) {
        return this._leafNode(new u(g));
      }
      // `break` statement
      break(g) {
        return this._leafNode(new l(g));
      }
      // `return` statement
      return(g) {
        const P = new k();
        if (this._blockNode(P), this.code(g), P.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(k);
      }
      // `try` statement
      try(g, P, O) {
        if (!P && !O)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const te = new N();
        if (this._blockNode(te), this.code(g), P) {
          const ae = this.name("e");
          this._currNode = te.catch = new z(ae), P(ae);
        }
        return O && (this._currNode = te.finally = new J(), this.code(O)), this._endBlockNode(z, J);
      }
      // `throw` statement
      throw(g) {
        return this._leafNode(new S(g));
      }
      // start self-balancing block
      block(g, P) {
        return this._blockStarts.push(this._nodes.length), g && this.code(g).endBlock(P), this;
      }
      // end the current self-balancing block
      endBlock(g) {
        const P = this._blockStarts.pop();
        if (P === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const O = this._nodes.length - P;
        if (O < 0 || g !== void 0 && O !== g)
          throw new Error(`CodeGen: wrong number of nodes: ${O} vs ${g} expected`);
        return this._nodes.length = P, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(g, P = e.nil, O, te) {
        return this._blockNode(new y(g, P, O)), te && this.code(te).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(y);
      }
      optimize(g = 1) {
        for (; g-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(g) {
        return this._currNode.nodes.push(g), this;
      }
      _blockNode(g) {
        this._currNode.nodes.push(g), this._nodes.push(g);
      }
      _endBlockNode(g, P) {
        const O = this._currNode;
        if (O instanceof g || P && O instanceof P)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${P ? `${g.kind}/${P.kind}` : g.kind}"`);
      }
      _elseNode(g) {
        const P = this._currNode;
        if (!(P instanceof p))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = P.else = g, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const g = this._nodes;
        return g[g.length - 1];
      }
      set _currNode(g) {
        const P = this._nodes;
        P[P.length - 1] = g;
      }
    }
    r.CodeGen = C;
    function U(x, g) {
      for (const P in g)
        x[P] = (x[P] || 0) + (g[P] || 0);
      return x;
    }
    function W(x, g) {
      return g instanceof e._CodeOrName ? U(x, g.names) : x;
    }
    function ee(x, g, P) {
      if (x instanceof e.Name)
        return O(x);
      if (!te(x))
        return x;
      return new e._Code(x._items.reduce((ae, $e) => ($e instanceof e.Name && ($e = O($e)), $e instanceof e._Code ? ae.push(...$e._items) : ae.push($e), ae), []));
      function O(ae) {
        const $e = P[ae.str];
        return $e === void 0 || g[ae.str] !== 1 ? ae : (delete g[ae.str], $e);
      }
      function te(ae) {
        return ae instanceof e._Code && ae._items.some(($e) => $e instanceof e.Name && g[$e.str] === 1 && P[$e.str] !== void 0);
      }
    }
    function Se(x, g) {
      for (const P in g)
        x[P] = (x[P] || 0) - (g[P] || 0);
    }
    function ze(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, e._)`!${A(x)}`;
    }
    r.not = ze;
    const Le = T(r.operators.AND);
    function Te(...x) {
      return x.reduce(Le);
    }
    r.and = Te;
    const ut = T(r.operators.OR);
    function L(...x) {
      return x.reduce(ut);
    }
    r.or = L;
    function T(x) {
      return (g, P) => g === e.nil ? P : P === e.nil ? g : (0, e._)`${A(g)} ${x} ${A(P)}`;
    }
    function A(x) {
      return x instanceof e.Name ? x : (0, e._)`(${x})`;
    }
  })(ts)), ts;
}
var he = {}, qa;
function we() {
  if (qa) return he;
  qa = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.checkStrictMode = he.getErrorPath = he.Type = he.useFunc = he.setEvaluated = he.evaluatedPropsToName = he.mergeEvaluated = he.eachItem = he.unescapeJsonPointer = he.escapeJsonPointer = he.escapeFragment = he.unescapeFragment = he.schemaRefOrVal = he.schemaHasRulesButRef = he.schemaHasRules = he.checkUnknownRules = he.alwaysValidSchema = he.toHash = void 0;
  const r = me(), e = Cn();
  function t(f) {
    const y = {};
    for (const k of f)
      y[k] = !0;
    return y;
  }
  he.toHash = t;
  function n(f, y) {
    return typeof y == "boolean" ? y : Object.keys(y).length === 0 ? !0 : (s(f, y), !a(y, f.self.RULES.all));
  }
  he.alwaysValidSchema = n;
  function s(f, y = f.schema) {
    const { opts: k, self: N } = f;
    if (!k.strictSchema || typeof y == "boolean")
      return;
    const z = N.RULES.keywords;
    for (const J in y)
      z[J] || _(f, `unknown keyword: "${J}"`);
  }
  he.checkUnknownRules = s;
  function a(f, y) {
    if (typeof f == "boolean")
      return !f;
    for (const k in f)
      if (y[k])
        return !0;
    return !1;
  }
  he.schemaHasRules = a;
  function i(f, y) {
    if (typeof f == "boolean")
      return !f;
    for (const k in f)
      if (k !== "$ref" && y.all[k])
        return !0;
    return !1;
  }
  he.schemaHasRulesButRef = i;
  function o({ topSchemaRef: f, schemaPath: y }, k, N, z) {
    if (!z) {
      if (typeof k == "number" || typeof k == "boolean")
        return k;
      if (typeof k == "string")
        return (0, r._)`${k}`;
    }
    return (0, r._)`${f}${y}${(0, r.getProperty)(N)}`;
  }
  he.schemaRefOrVal = o;
  function c(f) {
    return S(decodeURIComponent(f));
  }
  he.unescapeFragment = c;
  function u(f) {
    return encodeURIComponent(l(f));
  }
  he.escapeFragment = u;
  function l(f) {
    return typeof f == "number" ? `${f}` : f.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  he.escapeJsonPointer = l;
  function S(f) {
    return f.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  he.unescapeJsonPointer = S;
  function w(f, y) {
    if (Array.isArray(f))
      for (const k of f)
        y(k);
    else
      y(f);
  }
  he.eachItem = w;
  function v({ mergeNames: f, mergeToName: y, mergeValues: k, resultToName: N }) {
    return (z, J, C, U) => {
      const W = C === void 0 ? J : C instanceof r.Name ? (J instanceof r.Name ? f(z, J, C) : y(z, J, C), C) : J instanceof r.Name ? (y(z, C, J), J) : k(J, C);
      return U === r.Name && !(W instanceof r.Name) ? N(z, W) : W;
    };
  }
  he.mergeEvaluated = {
    props: v({
      mergeNames: (f, y, k) => f.if((0, r._)`${k} !== true && ${y} !== undefined`, () => {
        f.if((0, r._)`${y} === true`, () => f.assign(k, !0), () => f.assign(k, (0, r._)`${k} || {}`).code((0, r._)`Object.assign(${k}, ${y})`));
      }),
      mergeToName: (f, y, k) => f.if((0, r._)`${k} !== true`, () => {
        y === !0 ? f.assign(k, !0) : (f.assign(k, (0, r._)`${k} || {}`), $(f, k, y));
      }),
      mergeValues: (f, y) => f === !0 ? !0 : { ...f, ...y },
      resultToName: b
    }),
    items: v({
      mergeNames: (f, y, k) => f.if((0, r._)`${k} !== true && ${y} !== undefined`, () => f.assign(k, (0, r._)`${y} === true ? true : ${k} > ${y} ? ${k} : ${y}`)),
      mergeToName: (f, y, k) => f.if((0, r._)`${k} !== true`, () => f.assign(k, y === !0 ? !0 : (0, r._)`${k} > ${y} ? ${k} : ${y}`)),
      mergeValues: (f, y) => f === !0 ? !0 : Math.max(f, y),
      resultToName: (f, y) => f.var("items", y)
    })
  };
  function b(f, y) {
    if (y === !0)
      return f.var("props", !0);
    const k = f.var("props", (0, r._)`{}`);
    return y !== void 0 && $(f, k, y), k;
  }
  he.evaluatedPropsToName = b;
  function $(f, y, k) {
    Object.keys(k).forEach((N) => f.assign((0, r._)`${y}${(0, r.getProperty)(N)}`, !0));
  }
  he.setEvaluated = $;
  const m = {};
  function p(f, y) {
    return f.scopeValue("func", {
      ref: y,
      code: m[y.code] || (m[y.code] = new e._Code(y.code))
    });
  }
  he.useFunc = p;
  var d;
  (function(f) {
    f[f.Num = 0] = "Num", f[f.Str = 1] = "Str";
  })(d || (he.Type = d = {}));
  function h(f, y, k) {
    if (f instanceof r.Name) {
      const N = y === d.Num;
      return k ? N ? (0, r._)`"[" + ${f} + "]"` : (0, r._)`"['" + ${f} + "']"` : N ? (0, r._)`"/" + ${f}` : (0, r._)`"/" + ${f}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return k ? (0, r.getProperty)(f).toString() : "/" + l(f);
  }
  he.getErrorPath = h;
  function _(f, y, k = f.opts.strictSchema) {
    if (k) {
      if (y = `strict mode: ${y}`, k === !0)
        throw new Error(y);
      f.self.logger.warn(y);
    }
  }
  return he.checkStrictMode = _, he;
}
var Rr = {}, Da;
function zt() {
  if (Da) return Rr;
  Da = 1, Object.defineProperty(Rr, "__esModule", { value: !0 });
  const r = me(), e = {
    // validation function arguments
    data: new r.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new r.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new r.Name("instancePath"),
    parentData: new r.Name("parentData"),
    parentDataProperty: new r.Name("parentDataProperty"),
    rootData: new r.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new r.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new r.Name("vErrors"),
    // null or array of validation errors
    errors: new r.Name("errors"),
    // counter of validation errors
    this: new r.Name("this"),
    // "globals"
    self: new r.Name("self"),
    scope: new r.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new r.Name("json"),
    jsonPos: new r.Name("jsonPos"),
    jsonLen: new r.Name("jsonLen"),
    jsonPart: new r.Name("jsonPart")
  };
  return Rr.default = e, Rr;
}
var Za;
function Un() {
  return Za || (Za = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.extendErrors = r.resetErrorsCount = r.reportExtraError = r.reportError = r.keyword$DataError = r.keywordError = void 0;
    const e = me(), t = we(), n = zt();
    r.keywordError = {
      message: ({ keyword: m }) => (0, e.str)`must pass "${m}" keyword validation`
    }, r.keyword$DataError = {
      message: ({ keyword: m, schemaType: p }) => p ? (0, e.str)`"${m}" keyword must be ${p} ($data)` : (0, e.str)`"${m}" keyword is invalid ($data)`
    };
    function s(m, p = r.keywordError, d, h) {
      const { it: _ } = m, { gen: f, compositeRule: y, allErrors: k } = _, N = S(m, p, d);
      h ?? (y || k) ? c(f, N) : u(_, (0, e._)`[${N}]`);
    }
    r.reportError = s;
    function a(m, p = r.keywordError, d) {
      const { it: h } = m, { gen: _, compositeRule: f, allErrors: y } = h, k = S(m, p, d);
      c(_, k), f || y || u(h, n.default.vErrors);
    }
    r.reportExtraError = a;
    function i(m, p) {
      m.assign(n.default.errors, p), m.if((0, e._)`${n.default.vErrors} !== null`, () => m.if(p, () => m.assign((0, e._)`${n.default.vErrors}.length`, p), () => m.assign(n.default.vErrors, null)));
    }
    r.resetErrorsCount = i;
    function o({ gen: m, keyword: p, schemaValue: d, data: h, errsCount: _, it: f }) {
      if (_ === void 0)
        throw new Error("ajv implementation error");
      const y = m.name("err");
      m.forRange("i", _, n.default.errors, (k) => {
        m.const(y, (0, e._)`${n.default.vErrors}[${k}]`), m.if((0, e._)`${y}.instancePath === undefined`, () => m.assign((0, e._)`${y}.instancePath`, (0, e.strConcat)(n.default.instancePath, f.errorPath))), m.assign((0, e._)`${y}.schemaPath`, (0, e.str)`${f.errSchemaPath}/${p}`), f.opts.verbose && (m.assign((0, e._)`${y}.schema`, d), m.assign((0, e._)`${y}.data`, h));
      });
    }
    r.extendErrors = o;
    function c(m, p) {
      const d = m.const("err", p);
      m.if((0, e._)`${n.default.vErrors} === null`, () => m.assign(n.default.vErrors, (0, e._)`[${d}]`), (0, e._)`${n.default.vErrors}.push(${d})`), m.code((0, e._)`${n.default.errors}++`);
    }
    function u(m, p) {
      const { gen: d, validateName: h, schemaEnv: _ } = m;
      _.$async ? d.throw((0, e._)`new ${m.ValidationError}(${p})`) : (d.assign((0, e._)`${h}.errors`, p), d.return(!1));
    }
    const l = {
      keyword: new e.Name("keyword"),
      schemaPath: new e.Name("schemaPath"),
      // also used in JTD errors
      params: new e.Name("params"),
      propertyName: new e.Name("propertyName"),
      message: new e.Name("message"),
      schema: new e.Name("schema"),
      parentSchema: new e.Name("parentSchema")
    };
    function S(m, p, d) {
      const { createErrors: h } = m.it;
      return h === !1 ? (0, e._)`{}` : w(m, p, d);
    }
    function w(m, p, d = {}) {
      const { gen: h, it: _ } = m, f = [
        v(_, d),
        b(m, d)
      ];
      return $(m, p, f), h.object(...f);
    }
    function v({ errorPath: m }, { instancePath: p }) {
      const d = p ? (0, e.str)`${m}${(0, t.getErrorPath)(p, t.Type.Str)}` : m;
      return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, d)];
    }
    function b({ keyword: m, it: { errSchemaPath: p } }, { schemaPath: d, parentSchema: h }) {
      let _ = h ? p : (0, e.str)`${p}/${m}`;
      return d && (_ = (0, e.str)`${_}${(0, t.getErrorPath)(d, t.Type.Str)}`), [l.schemaPath, _];
    }
    function $(m, { params: p, message: d }, h) {
      const { keyword: _, data: f, schemaValue: y, it: k } = m, { opts: N, propertyName: z, topSchemaRef: J, schemaPath: C } = k;
      h.push([l.keyword, _], [l.params, typeof p == "function" ? p(m) : p || (0, e._)`{}`]), N.messages && h.push([l.message, typeof d == "function" ? d(m) : d]), N.verbose && h.push([l.schema, y], [l.parentSchema, (0, e._)`${J}${C}`], [n.default.data, f]), z && h.push([l.propertyName, z]);
    }
  })(es)), es;
}
var za;
function tl() {
  if (za) return Lt;
  za = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.boolOrEmptySchema = Lt.topBoolOrEmptySchema = void 0;
  const r = Un(), e = me(), t = zt(), n = {
    message: "boolean schema is false"
  };
  function s(o) {
    const { gen: c, schema: u, validateName: l } = o;
    u === !1 ? i(o, !1) : typeof u == "object" && u.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${l}.errors`, null), c.return(!0));
  }
  Lt.topBoolOrEmptySchema = s;
  function a(o, c) {
    const { gen: u, schema: l } = o;
    l === !1 ? (u.var(c, !1), i(o)) : u.var(c, !0);
  }
  Lt.boolOrEmptySchema = a;
  function i(o, c) {
    const { gen: u, data: l } = o, S = {
      gen: u,
      keyword: "false schema",
      data: l,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: o
    };
    (0, r.reportError)(S, n, void 0, c);
  }
  return Lt;
}
var qe = {}, Vt = {}, La;
function Vo() {
  if (La) return Vt;
  La = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.getRules = Vt.isJSONType = void 0;
  const r = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(r);
  function t(s) {
    return typeof s == "string" && e.has(s);
  }
  Vt.isJSONType = t;
  function n() {
    const s = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...s, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, s.number, s.string, s.array, s.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return Vt.getRules = n, Vt;
}
var St = {}, Va;
function Fo() {
  if (Va) return St;
  Va = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St.shouldUseRule = St.shouldUseGroup = St.schemaHasRulesForType = void 0;
  function r({ schema: n, self: s }, a) {
    const i = s.RULES.types[a];
    return i && i !== !0 && e(n, i);
  }
  St.schemaHasRulesForType = r;
  function e(n, s) {
    return s.rules.some((a) => t(n, a));
  }
  St.shouldUseGroup = e;
  function t(n, s) {
    var a;
    return n[s.keyword] !== void 0 || ((a = s.definition.implements) === null || a === void 0 ? void 0 : a.some((i) => n[i] !== void 0));
  }
  return St.shouldUseRule = t, St;
}
var Fa;
function In() {
  if (Fa) return qe;
  Fa = 1, Object.defineProperty(qe, "__esModule", { value: !0 }), qe.reportTypeError = qe.checkDataTypes = qe.checkDataType = qe.coerceAndCheckDataType = qe.getJSONTypes = qe.getSchemaTypes = qe.DataType = void 0;
  const r = Vo(), e = Fo(), t = Un(), n = me(), s = we();
  var a;
  (function(d) {
    d[d.Correct = 0] = "Correct", d[d.Wrong = 1] = "Wrong";
  })(a || (qe.DataType = a = {}));
  function i(d) {
    const h = o(d.type);
    if (h.includes("null")) {
      if (d.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!h.length && d.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      d.nullable === !0 && h.push("null");
    }
    return h;
  }
  qe.getSchemaTypes = i;
  function o(d) {
    const h = Array.isArray(d) ? d : d ? [d] : [];
    if (h.every(r.isJSONType))
      return h;
    throw new Error("type must be JSONType or JSONType[]: " + h.join(","));
  }
  qe.getJSONTypes = o;
  function c(d, h) {
    const { gen: _, data: f, opts: y } = d, k = l(h, y.coerceTypes), N = h.length > 0 && !(k.length === 0 && h.length === 1 && (0, e.schemaHasRulesForType)(d, h[0]));
    if (N) {
      const z = b(h, f, y.strictNumbers, a.Wrong);
      _.if(z, () => {
        k.length ? S(d, h, k) : m(d);
      });
    }
    return N;
  }
  qe.coerceAndCheckDataType = c;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function l(d, h) {
    return h ? d.filter((_) => u.has(_) || h === "array" && _ === "array") : [];
  }
  function S(d, h, _) {
    const { gen: f, data: y, opts: k } = d, N = f.let("dataType", (0, n._)`typeof ${y}`), z = f.let("coerced", (0, n._)`undefined`);
    k.coerceTypes === "array" && f.if((0, n._)`${N} == 'object' && Array.isArray(${y}) && ${y}.length == 1`, () => f.assign(y, (0, n._)`${y}[0]`).assign(N, (0, n._)`typeof ${y}`).if(b(h, y, k.strictNumbers), () => f.assign(z, y))), f.if((0, n._)`${z} !== undefined`);
    for (const C of _)
      (u.has(C) || C === "array" && k.coerceTypes === "array") && J(C);
    f.else(), m(d), f.endIf(), f.if((0, n._)`${z} !== undefined`, () => {
      f.assign(y, z), w(d, z);
    });
    function J(C) {
      switch (C) {
        case "string":
          f.elseIf((0, n._)`${N} == "number" || ${N} == "boolean"`).assign(z, (0, n._)`"" + ${y}`).elseIf((0, n._)`${y} === null`).assign(z, (0, n._)`""`);
          return;
        case "number":
          f.elseIf((0, n._)`${N} == "boolean" || ${y} === null
              || (${N} == "string" && ${y} && ${y} == +${y})`).assign(z, (0, n._)`+${y}`);
          return;
        case "integer":
          f.elseIf((0, n._)`${N} === "boolean" || ${y} === null
              || (${N} === "string" && ${y} && ${y} == +${y} && !(${y} % 1))`).assign(z, (0, n._)`+${y}`);
          return;
        case "boolean":
          f.elseIf((0, n._)`${y} === "false" || ${y} === 0 || ${y} === null`).assign(z, !1).elseIf((0, n._)`${y} === "true" || ${y} === 1`).assign(z, !0);
          return;
        case "null":
          f.elseIf((0, n._)`${y} === "" || ${y} === 0 || ${y} === false`), f.assign(z, null);
          return;
        case "array":
          f.elseIf((0, n._)`${N} === "string" || ${N} === "number"
              || ${N} === "boolean" || ${y} === null`).assign(z, (0, n._)`[${y}]`);
      }
    }
  }
  function w({ gen: d, parentData: h, parentDataProperty: _ }, f) {
    d.if((0, n._)`${h} !== undefined`, () => d.assign((0, n._)`${h}[${_}]`, f));
  }
  function v(d, h, _, f = a.Correct) {
    const y = f === a.Correct ? n.operators.EQ : n.operators.NEQ;
    let k;
    switch (d) {
      case "null":
        return (0, n._)`${h} ${y} null`;
      case "array":
        k = (0, n._)`Array.isArray(${h})`;
        break;
      case "object":
        k = (0, n._)`${h} && typeof ${h} == "object" && !Array.isArray(${h})`;
        break;
      case "integer":
        k = N((0, n._)`!(${h} % 1) && !isNaN(${h})`);
        break;
      case "number":
        k = N();
        break;
      default:
        return (0, n._)`typeof ${h} ${y} ${d}`;
    }
    return f === a.Correct ? k : (0, n.not)(k);
    function N(z = n.nil) {
      return (0, n.and)((0, n._)`typeof ${h} == "number"`, z, _ ? (0, n._)`isFinite(${h})` : n.nil);
    }
  }
  qe.checkDataType = v;
  function b(d, h, _, f) {
    if (d.length === 1)
      return v(d[0], h, _, f);
    let y;
    const k = (0, s.toHash)(d);
    if (k.array && k.object) {
      const N = (0, n._)`typeof ${h} != "object"`;
      y = k.null ? N : (0, n._)`!${h} || ${N}`, delete k.null, delete k.array, delete k.object;
    } else
      y = n.nil;
    k.number && delete k.integer;
    for (const N in k)
      y = (0, n.and)(y, v(N, h, _, f));
    return y;
  }
  qe.checkDataTypes = b;
  const $ = {
    message: ({ schema: d }) => `must be ${d}`,
    params: ({ schema: d, schemaValue: h }) => typeof d == "string" ? (0, n._)`{type: ${d}}` : (0, n._)`{type: ${h}}`
  };
  function m(d) {
    const h = p(d);
    (0, t.reportError)(h, $);
  }
  qe.reportTypeError = m;
  function p(d) {
    const { gen: h, data: _, schema: f } = d, y = (0, s.schemaRefOrVal)(d, f, "type");
    return {
      gen: h,
      keyword: "type",
      data: _,
      schema: f.type,
      schemaCode: y,
      schemaValue: y,
      parentSchema: f,
      params: {},
      it: d
    };
  }
  return qe;
}
var ur = {}, Ua;
function rl() {
  if (Ua) return ur;
  Ua = 1, Object.defineProperty(ur, "__esModule", { value: !0 }), ur.assignDefaults = void 0;
  const r = me(), e = we();
  function t(s, a) {
    const { properties: i, items: o } = s.schema;
    if (a === "object" && i)
      for (const c in i)
        n(s, c, i[c].default);
    else a === "array" && Array.isArray(o) && o.forEach((c, u) => n(s, u, c.default));
  }
  ur.assignDefaults = t;
  function n(s, a, i) {
    const { gen: o, compositeRule: c, data: u, opts: l } = s;
    if (i === void 0)
      return;
    const S = (0, r._)`${u}${(0, r.getProperty)(a)}`;
    if (c) {
      (0, e.checkStrictMode)(s, `default is ignored for: ${S}`);
      return;
    }
    let w = (0, r._)`${S} === undefined`;
    l.useDefaults === "empty" && (w = (0, r._)`${w} || ${S} === null || ${S} === ""`), o.if(w, (0, r._)`${S} = ${(0, r.stringify)(i)}`);
  }
  return ur;
}
var lt = {}, Pe = {}, Ha;
function mt() {
  if (Ha) return Pe;
  Ha = 1, Object.defineProperty(Pe, "__esModule", { value: !0 }), Pe.validateUnion = Pe.validateArray = Pe.usePattern = Pe.callValidateCode = Pe.schemaProperties = Pe.allSchemaProperties = Pe.noPropertyInData = Pe.propertyInData = Pe.isOwnProperty = Pe.hasPropFunc = Pe.reportMissingProp = Pe.checkMissingProp = Pe.checkReportMissingProp = void 0;
  const r = me(), e = we(), t = zt(), n = we();
  function s(d, h) {
    const { gen: _, data: f, it: y } = d;
    _.if(l(_, f, h, y.opts.ownProperties), () => {
      d.setParams({ missingProperty: (0, r._)`${h}` }, !0), d.error();
    });
  }
  Pe.checkReportMissingProp = s;
  function a({ gen: d, data: h, it: { opts: _ } }, f, y) {
    return (0, r.or)(...f.map((k) => (0, r.and)(l(d, h, k, _.ownProperties), (0, r._)`${y} = ${k}`)));
  }
  Pe.checkMissingProp = a;
  function i(d, h) {
    d.setParams({ missingProperty: h }, !0), d.error();
  }
  Pe.reportMissingProp = i;
  function o(d) {
    return d.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, r._)`Object.prototype.hasOwnProperty`
    });
  }
  Pe.hasPropFunc = o;
  function c(d, h, _) {
    return (0, r._)`${o(d)}.call(${h}, ${_})`;
  }
  Pe.isOwnProperty = c;
  function u(d, h, _, f) {
    const y = (0, r._)`${h}${(0, r.getProperty)(_)} !== undefined`;
    return f ? (0, r._)`${y} && ${c(d, h, _)}` : y;
  }
  Pe.propertyInData = u;
  function l(d, h, _, f) {
    const y = (0, r._)`${h}${(0, r.getProperty)(_)} === undefined`;
    return f ? (0, r.or)(y, (0, r.not)(c(d, h, _))) : y;
  }
  Pe.noPropertyInData = l;
  function S(d) {
    return d ? Object.keys(d).filter((h) => h !== "__proto__") : [];
  }
  Pe.allSchemaProperties = S;
  function w(d, h) {
    return S(h).filter((_) => !(0, e.alwaysValidSchema)(d, h[_]));
  }
  Pe.schemaProperties = w;
  function v({ schemaCode: d, data: h, it: { gen: _, topSchemaRef: f, schemaPath: y, errorPath: k }, it: N }, z, J, C) {
    const U = C ? (0, r._)`${d}, ${h}, ${f}${y}` : h, W = [
      [t.default.instancePath, (0, r.strConcat)(t.default.instancePath, k)],
      [t.default.parentData, N.parentData],
      [t.default.parentDataProperty, N.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    N.opts.dynamicRef && W.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const ee = (0, r._)`${U}, ${_.object(...W)}`;
    return J !== r.nil ? (0, r._)`${z}.call(${J}, ${ee})` : (0, r._)`${z}(${ee})`;
  }
  Pe.callValidateCode = v;
  const b = (0, r._)`new RegExp`;
  function $({ gen: d, it: { opts: h } }, _) {
    const f = h.unicodeRegExp ? "u" : "", { regExp: y } = h.code, k = y(_, f);
    return d.scopeValue("pattern", {
      key: k.toString(),
      ref: k,
      code: (0, r._)`${y.code === "new RegExp" ? b : (0, n.useFunc)(d, y)}(${_}, ${f})`
    });
  }
  Pe.usePattern = $;
  function m(d) {
    const { gen: h, data: _, keyword: f, it: y } = d, k = h.name("valid");
    if (y.allErrors) {
      const z = h.let("valid", !0);
      return N(() => h.assign(z, !1)), z;
    }
    return h.var(k, !0), N(() => h.break()), k;
    function N(z) {
      const J = h.const("len", (0, r._)`${_}.length`);
      h.forRange("i", 0, J, (C) => {
        d.subschema({
          keyword: f,
          dataProp: C,
          dataPropType: e.Type.Num
        }, k), h.if((0, r.not)(k), z);
      });
    }
  }
  Pe.validateArray = m;
  function p(d) {
    const { gen: h, schema: _, keyword: f, it: y } = d;
    if (!Array.isArray(_))
      throw new Error("ajv implementation error");
    if (_.some((J) => (0, e.alwaysValidSchema)(y, J)) && !y.opts.unevaluated)
      return;
    const N = h.let("valid", !1), z = h.name("_valid");
    h.block(() => _.forEach((J, C) => {
      const U = d.subschema({
        keyword: f,
        schemaProp: C,
        compositeRule: !0
      }, z);
      h.assign(N, (0, r._)`${N} || ${z}`), d.mergeValidEvaluated(U, z) || h.if((0, r.not)(N));
    })), d.result(N, () => d.reset(), () => d.error(!0));
  }
  return Pe.validateUnion = p, Pe;
}
var Ka;
function nl() {
  if (Ka) return lt;
  Ka = 1, Object.defineProperty(lt, "__esModule", { value: !0 }), lt.validateKeywordUsage = lt.validSchemaType = lt.funcKeywordCode = lt.macroKeywordCode = void 0;
  const r = me(), e = zt(), t = mt(), n = Un();
  function s(w, v) {
    const { gen: b, keyword: $, schema: m, parentSchema: p, it: d } = w, h = v.macro.call(d.self, m, p, d), _ = u(b, $, h);
    d.opts.validateSchema !== !1 && d.self.validateSchema(h, !0);
    const f = b.name("valid");
    w.subschema({
      schema: h,
      schemaPath: r.nil,
      errSchemaPath: `${d.errSchemaPath}/${$}`,
      topSchemaRef: _,
      compositeRule: !0
    }, f), w.pass(f, () => w.error(!0));
  }
  lt.macroKeywordCode = s;
  function a(w, v) {
    var b;
    const { gen: $, keyword: m, schema: p, parentSchema: d, $data: h, it: _ } = w;
    c(_, v);
    const f = !h && v.compile ? v.compile.call(_.self, p, d, _) : v.validate, y = u($, m, f), k = $.let("valid");
    w.block$data(k, N), w.ok((b = v.valid) !== null && b !== void 0 ? b : k);
    function N() {
      if (v.errors === !1)
        C(), v.modifying && i(w), U(() => w.error());
      else {
        const W = v.async ? z() : J();
        v.modifying && i(w), U(() => o(w, W));
      }
    }
    function z() {
      const W = $.let("ruleErrs", null);
      return $.try(() => C((0, r._)`await `), (ee) => $.assign(k, !1).if((0, r._)`${ee} instanceof ${_.ValidationError}`, () => $.assign(W, (0, r._)`${ee}.errors`), () => $.throw(ee))), W;
    }
    function J() {
      const W = (0, r._)`${y}.errors`;
      return $.assign(W, null), C(r.nil), W;
    }
    function C(W = v.async ? (0, r._)`await ` : r.nil) {
      const ee = _.opts.passContext ? e.default.this : e.default.self, Se = !("compile" in v && !h || v.schema === !1);
      $.assign(k, (0, r._)`${W}${(0, t.callValidateCode)(w, y, ee, Se)}`, v.modifying);
    }
    function U(W) {
      var ee;
      $.if((0, r.not)((ee = v.valid) !== null && ee !== void 0 ? ee : k), W);
    }
  }
  lt.funcKeywordCode = a;
  function i(w) {
    const { gen: v, data: b, it: $ } = w;
    v.if($.parentData, () => v.assign(b, (0, r._)`${$.parentData}[${$.parentDataProperty}]`));
  }
  function o(w, v) {
    const { gen: b } = w;
    b.if((0, r._)`Array.isArray(${v})`, () => {
      b.assign(e.default.vErrors, (0, r._)`${e.default.vErrors} === null ? ${v} : ${e.default.vErrors}.concat(${v})`).assign(e.default.errors, (0, r._)`${e.default.vErrors}.length`), (0, n.extendErrors)(w);
    }, () => w.error());
  }
  function c({ schemaEnv: w }, v) {
    if (v.async && !w.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(w, v, b) {
    if (b === void 0)
      throw new Error(`keyword "${v}" failed to compile`);
    return w.scopeValue("keyword", typeof b == "function" ? { ref: b } : { ref: b, code: (0, r.stringify)(b) });
  }
  function l(w, v, b = !1) {
    return !v.length || v.some(($) => $ === "array" ? Array.isArray(w) : $ === "object" ? w && typeof w == "object" && !Array.isArray(w) : typeof w == $ || b && typeof w > "u");
  }
  lt.validSchemaType = l;
  function S({ schema: w, opts: v, self: b, errSchemaPath: $ }, m, p) {
    if (Array.isArray(m.keyword) ? !m.keyword.includes(p) : m.keyword !== p)
      throw new Error("ajv implementation error");
    const d = m.dependencies;
    if (d != null && d.some((h) => !Object.prototype.hasOwnProperty.call(w, h)))
      throw new Error(`parent schema must have dependencies of ${p}: ${d.join(",")}`);
    if (m.validateSchema && !m.validateSchema(w[p])) {
      const _ = `keyword "${p}" value is invalid at path "${$}": ` + b.errorsText(m.validateSchema.errors);
      if (v.validateSchema === "log")
        b.logger.error(_);
      else
        throw new Error(_);
    }
  }
  return lt.validateKeywordUsage = S, lt;
}
var Pt = {}, Ba;
function sl() {
  if (Ba) return Pt;
  Ba = 1, Object.defineProperty(Pt, "__esModule", { value: !0 }), Pt.extendSubschemaMode = Pt.extendSubschemaData = Pt.getSubschema = void 0;
  const r = me(), e = we();
  function t(a, { keyword: i, schemaProp: o, schema: c, schemaPath: u, errSchemaPath: l, topSchemaRef: S }) {
    if (i !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (i !== void 0) {
      const w = a.schema[i];
      return o === void 0 ? {
        schema: w,
        schemaPath: (0, r._)`${a.schemaPath}${(0, r.getProperty)(i)}`,
        errSchemaPath: `${a.errSchemaPath}/${i}`
      } : {
        schema: w[o],
        schemaPath: (0, r._)`${a.schemaPath}${(0, r.getProperty)(i)}${(0, r.getProperty)(o)}`,
        errSchemaPath: `${a.errSchemaPath}/${i}/${(0, e.escapeFragment)(o)}`
      };
    }
    if (c !== void 0) {
      if (u === void 0 || l === void 0 || S === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: u,
        topSchemaRef: S,
        errSchemaPath: l
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Pt.getSubschema = t;
  function n(a, i, { dataProp: o, dataPropType: c, data: u, dataTypes: l, propertyName: S }) {
    if (u !== void 0 && o !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: w } = i;
    if (o !== void 0) {
      const { errorPath: b, dataPathArr: $, opts: m } = i, p = w.let("data", (0, r._)`${i.data}${(0, r.getProperty)(o)}`, !0);
      v(p), a.errorPath = (0, r.str)`${b}${(0, e.getErrorPath)(o, c, m.jsPropertySyntax)}`, a.parentDataProperty = (0, r._)`${o}`, a.dataPathArr = [...$, a.parentDataProperty];
    }
    if (u !== void 0) {
      const b = u instanceof r.Name ? u : w.let("data", u, !0);
      v(b), S !== void 0 && (a.propertyName = S);
    }
    l && (a.dataTypes = l);
    function v(b) {
      a.data = b, a.dataLevel = i.dataLevel + 1, a.dataTypes = [], i.definedProperties = /* @__PURE__ */ new Set(), a.parentData = i.data, a.dataNames = [...i.dataNames, b];
    }
  }
  Pt.extendSubschemaData = n;
  function s(a, { jtdDiscriminator: i, jtdMetadata: o, compositeRule: c, createErrors: u, allErrors: l }) {
    c !== void 0 && (a.compositeRule = c), u !== void 0 && (a.createErrors = u), l !== void 0 && (a.allErrors = l), a.jtdDiscriminator = i, a.jtdMetadata = o;
  }
  return Pt.extendSubschemaMode = s, Pt;
}
var Ve = {}, ss, Ga;
function Uo() {
  return Ga || (Ga = 1, ss = function r(e, t) {
    if (e === t) return !0;
    if (e && t && typeof e == "object" && typeof t == "object") {
      if (e.constructor !== t.constructor) return !1;
      var n, s, a;
      if (Array.isArray(e)) {
        if (n = e.length, n != t.length) return !1;
        for (s = n; s-- !== 0; )
          if (!r(e[s], t[s])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
      if (a = Object.keys(e), n = a.length, n !== Object.keys(t).length) return !1;
      for (s = n; s-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(t, a[s])) return !1;
      for (s = n; s-- !== 0; ) {
        var i = a[s];
        if (!r(e[i], t[i])) return !1;
      }
      return !0;
    }
    return e !== e && t !== t;
  }), ss;
}
var as = { exports: {} }, Ja;
function al() {
  if (Ja) return as.exports;
  Ja = 1;
  var r = as.exports = function(n, s, a) {
    typeof s == "function" && (a = s, s = {}), a = s.cb || a;
    var i = typeof a == "function" ? a : a.pre || function() {
    }, o = a.post || function() {
    };
    e(s, i, o, n, "", n);
  };
  r.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, r.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, r.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, r.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function e(n, s, a, i, o, c, u, l, S, w) {
    if (i && typeof i == "object" && !Array.isArray(i)) {
      s(i, o, c, u, l, S, w);
      for (var v in i) {
        var b = i[v];
        if (Array.isArray(b)) {
          if (v in r.arrayKeywords)
            for (var $ = 0; $ < b.length; $++)
              e(n, s, a, b[$], o + "/" + v + "/" + $, c, o, v, i, $);
        } else if (v in r.propsKeywords) {
          if (b && typeof b == "object")
            for (var m in b)
              e(n, s, a, b[m], o + "/" + v + "/" + t(m), c, o, v, i, m);
        } else (v in r.keywords || n.allKeys && !(v in r.skipKeywords)) && e(n, s, a, b, o + "/" + v, c, o, v, i);
      }
      a(i, o, c, u, l, S, w);
    }
  }
  function t(n) {
    return n.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return as.exports;
}
var Wa;
function Hn() {
  if (Wa) return Ve;
  Wa = 1, Object.defineProperty(Ve, "__esModule", { value: !0 }), Ve.getSchemaRefs = Ve.resolveUrl = Ve.normalizeId = Ve._getFullPath = Ve.getFullPath = Ve.inlineRef = void 0;
  const r = we(), e = Uo(), t = al(), n = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function s($, m = !0) {
    return typeof $ == "boolean" ? !0 : m === !0 ? !i($) : m ? o($) <= m : !1;
  }
  Ve.inlineRef = s;
  const a = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function i($) {
    for (const m in $) {
      if (a.has(m))
        return !0;
      const p = $[m];
      if (Array.isArray(p) && p.some(i) || typeof p == "object" && i(p))
        return !0;
    }
    return !1;
  }
  function o($) {
    let m = 0;
    for (const p in $) {
      if (p === "$ref")
        return 1 / 0;
      if (m++, !n.has(p) && (typeof $[p] == "object" && (0, r.eachItem)($[p], (d) => m += o(d)), m === 1 / 0))
        return 1 / 0;
    }
    return m;
  }
  function c($, m = "", p) {
    p !== !1 && (m = S(m));
    const d = $.parse(m);
    return u($, d);
  }
  Ve.getFullPath = c;
  function u($, m) {
    return $.serialize(m).split("#")[0] + "#";
  }
  Ve._getFullPath = u;
  const l = /#\/?$/;
  function S($) {
    return $ ? $.replace(l, "") : "";
  }
  Ve.normalizeId = S;
  function w($, m, p) {
    return p = S(p), $.resolve(m, p);
  }
  Ve.resolveUrl = w;
  const v = /^[a-z_][-a-z0-9._]*$/i;
  function b($, m) {
    if (typeof $ == "boolean")
      return {};
    const { schemaId: p, uriResolver: d } = this.opts, h = S($[p] || m), _ = { "": h }, f = c(d, h, !1), y = {}, k = /* @__PURE__ */ new Set();
    return t($, { allKeys: !0 }, (J, C, U, W) => {
      if (W === void 0)
        return;
      const ee = f + C;
      let Se = _[W];
      typeof J[p] == "string" && (Se = ze.call(this, J[p])), Le.call(this, J.$anchor), Le.call(this, J.$dynamicAnchor), _[C] = Se;
      function ze(Te) {
        const ut = this.opts.uriResolver.resolve;
        if (Te = S(Se ? ut(Se, Te) : Te), k.has(Te))
          throw z(Te);
        k.add(Te);
        let L = this.refs[Te];
        return typeof L == "string" && (L = this.refs[L]), typeof L == "object" ? N(J, L.schema, Te) : Te !== S(ee) && (Te[0] === "#" ? (N(J, y[Te], Te), y[Te] = J) : this.refs[Te] = ee), Te;
      }
      function Le(Te) {
        if (typeof Te == "string") {
          if (!v.test(Te))
            throw new Error(`invalid anchor "${Te}"`);
          ze.call(this, `#${Te}`);
        }
      }
    }), y;
    function N(J, C, U) {
      if (C !== void 0 && !e(J, C))
        throw z(U);
    }
    function z(J) {
      return new Error(`reference "${J}" resolves to more than one schema`);
    }
  }
  return Ve.getSchemaRefs = b, Ve;
}
var Qa;
function Kn() {
  if (Qa) return kt;
  Qa = 1, Object.defineProperty(kt, "__esModule", { value: !0 }), kt.getData = kt.KeywordCxt = kt.validateFunctionCode = void 0;
  const r = tl(), e = In(), t = Fo(), n = In(), s = rl(), a = nl(), i = sl(), o = me(), c = zt(), u = Hn(), l = we(), S = Un();
  function w(R) {
    if (f(R) && (k(R), _(R))) {
      m(R);
      return;
    }
    v(R, () => (0, r.topBoolOrEmptySchema)(R));
  }
  kt.validateFunctionCode = w;
  function v({ gen: R, validateName: E, schema: I, schemaEnv: V, opts: se }, pe) {
    se.code.es5 ? R.func(E, (0, o._)`${c.default.data}, ${c.default.valCxt}`, V.$async, () => {
      R.code((0, o._)`"use strict"; ${d(I, se)}`), $(R, se), R.code(pe);
    }) : R.func(E, (0, o._)`${c.default.data}, ${b(se)}`, V.$async, () => R.code(d(I, se)).code(pe));
  }
  function b(R) {
    return (0, o._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${R.dynamicRef ? (0, o._)`, ${c.default.dynamicAnchors}={}` : o.nil}}={}`;
  }
  function $(R, E) {
    R.if(c.default.valCxt, () => {
      R.var(c.default.instancePath, (0, o._)`${c.default.valCxt}.${c.default.instancePath}`), R.var(c.default.parentData, (0, o._)`${c.default.valCxt}.${c.default.parentData}`), R.var(c.default.parentDataProperty, (0, o._)`${c.default.valCxt}.${c.default.parentDataProperty}`), R.var(c.default.rootData, (0, o._)`${c.default.valCxt}.${c.default.rootData}`), E.dynamicRef && R.var(c.default.dynamicAnchors, (0, o._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      R.var(c.default.instancePath, (0, o._)`""`), R.var(c.default.parentData, (0, o._)`undefined`), R.var(c.default.parentDataProperty, (0, o._)`undefined`), R.var(c.default.rootData, c.default.data), E.dynamicRef && R.var(c.default.dynamicAnchors, (0, o._)`{}`);
    });
  }
  function m(R) {
    const { schema: E, opts: I, gen: V } = R;
    v(R, () => {
      I.$comment && E.$comment && W(R), J(R), V.let(c.default.vErrors, null), V.let(c.default.errors, 0), I.unevaluated && p(R), N(R), ee(R);
    });
  }
  function p(R) {
    const { gen: E, validateName: I } = R;
    R.evaluated = E.const("evaluated", (0, o._)`${I}.evaluated`), E.if((0, o._)`${R.evaluated}.dynamicProps`, () => E.assign((0, o._)`${R.evaluated}.props`, (0, o._)`undefined`)), E.if((0, o._)`${R.evaluated}.dynamicItems`, () => E.assign((0, o._)`${R.evaluated}.items`, (0, o._)`undefined`));
  }
  function d(R, E) {
    const I = typeof R == "object" && R[E.schemaId];
    return I && (E.code.source || E.code.process) ? (0, o._)`/*# sourceURL=${I} */` : o.nil;
  }
  function h(R, E) {
    if (f(R) && (k(R), _(R))) {
      y(R, E);
      return;
    }
    (0, r.boolOrEmptySchema)(R, E);
  }
  function _({ schema: R, self: E }) {
    if (typeof R == "boolean")
      return !R;
    for (const I in R)
      if (E.RULES.all[I])
        return !0;
    return !1;
  }
  function f(R) {
    return typeof R.schema != "boolean";
  }
  function y(R, E) {
    const { schema: I, gen: V, opts: se } = R;
    se.$comment && I.$comment && W(R), C(R), U(R);
    const pe = V.const("_errs", c.default.errors);
    N(R, pe), V.var(E, (0, o._)`${pe} === ${c.default.errors}`);
  }
  function k(R) {
    (0, l.checkUnknownRules)(R), z(R);
  }
  function N(R, E) {
    if (R.opts.jtd)
      return ze(R, [], !1, E);
    const I = (0, e.getSchemaTypes)(R.schema), V = (0, e.coerceAndCheckDataType)(R, I);
    ze(R, I, !V, E);
  }
  function z(R) {
    const { schema: E, errSchemaPath: I, opts: V, self: se } = R;
    E.$ref && V.ignoreKeywordsWithRef && (0, l.schemaHasRulesButRef)(E, se.RULES) && se.logger.warn(`$ref: keywords ignored in schema at path "${I}"`);
  }
  function J(R) {
    const { schema: E, opts: I } = R;
    E.default !== void 0 && I.useDefaults && I.strictSchema && (0, l.checkStrictMode)(R, "default is ignored in the schema root");
  }
  function C(R) {
    const E = R.schema[R.opts.schemaId];
    E && (R.baseId = (0, u.resolveUrl)(R.opts.uriResolver, R.baseId, E));
  }
  function U(R) {
    if (R.schema.$async && !R.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function W({ gen: R, schemaEnv: E, schema: I, errSchemaPath: V, opts: se }) {
    const pe = I.$comment;
    if (se.$comment === !0)
      R.code((0, o._)`${c.default.self}.logger.log(${pe})`);
    else if (typeof se.$comment == "function") {
      const Ae = (0, o.str)`${V}/$comment`, dt = R.scopeValue("root", { ref: E.root });
      R.code((0, o._)`${c.default.self}.opts.$comment(${pe}, ${Ae}, ${dt}.schema)`);
    }
  }
  function ee(R) {
    const { gen: E, schemaEnv: I, validateName: V, ValidationError: se, opts: pe } = R;
    I.$async ? E.if((0, o._)`${c.default.errors} === 0`, () => E.return(c.default.data), () => E.throw((0, o._)`new ${se}(${c.default.vErrors})`)) : (E.assign((0, o._)`${V}.errors`, c.default.vErrors), pe.unevaluated && Se(R), E.return((0, o._)`${c.default.errors} === 0`));
  }
  function Se({ gen: R, evaluated: E, props: I, items: V }) {
    I instanceof o.Name && R.assign((0, o._)`${E}.props`, I), V instanceof o.Name && R.assign((0, o._)`${E}.items`, V);
  }
  function ze(R, E, I, V) {
    const { gen: se, schema: pe, data: Ae, allErrors: dt, opts: Je, self: We } = R, { RULES: je } = We;
    if (pe.$ref && (Je.ignoreKeywordsWithRef || !(0, l.schemaHasRulesButRef)(pe, je))) {
      se.block(() => te(R, "$ref", je.all.$ref.definition));
      return;
    }
    Je.jtd || Te(R, E), se.block(() => {
      for (const rt of je.rules)
        Yt(rt);
      Yt(je.post);
    });
    function Yt(rt) {
      (0, t.shouldUseGroup)(pe, rt) && (rt.type ? (se.if((0, n.checkDataType)(rt.type, Ae, Je.strictNumbers)), Le(R, rt), E.length === 1 && E[0] === rt.type && I && (se.else(), (0, n.reportTypeError)(R)), se.endIf()) : Le(R, rt), dt || se.if((0, o._)`${c.default.errors} === ${V || 0}`));
    }
  }
  function Le(R, E) {
    const { gen: I, schema: V, opts: { useDefaults: se } } = R;
    se && (0, s.assignDefaults)(R, E.type), I.block(() => {
      for (const pe of E.rules)
        (0, t.shouldUseRule)(V, pe) && te(R, pe.keyword, pe.definition, E.type);
    });
  }
  function Te(R, E) {
    R.schemaEnv.meta || !R.opts.strictTypes || (ut(R, E), R.opts.allowUnionTypes || L(R, E), T(R, R.dataTypes));
  }
  function ut(R, E) {
    if (E.length) {
      if (!R.dataTypes.length) {
        R.dataTypes = E;
        return;
      }
      E.forEach((I) => {
        x(R.dataTypes, I) || P(R, `type "${I}" not allowed by context "${R.dataTypes.join(",")}"`);
      }), g(R, E);
    }
  }
  function L(R, E) {
    E.length > 1 && !(E.length === 2 && E.includes("null")) && P(R, "use allowUnionTypes to allow union type keyword");
  }
  function T(R, E) {
    const I = R.self.RULES.all;
    for (const V in I) {
      const se = I[V];
      if (typeof se == "object" && (0, t.shouldUseRule)(R.schema, se)) {
        const { type: pe } = se.definition;
        pe.length && !pe.some((Ae) => A(E, Ae)) && P(R, `missing type "${pe.join(",")}" for keyword "${V}"`);
      }
    }
  }
  function A(R, E) {
    return R.includes(E) || E === "number" && R.includes("integer");
  }
  function x(R, E) {
    return R.includes(E) || E === "integer" && R.includes("number");
  }
  function g(R, E) {
    const I = [];
    for (const V of R.dataTypes)
      x(E, V) ? I.push(V) : E.includes("integer") && V === "number" && I.push("integer");
    R.dataTypes = I;
  }
  function P(R, E) {
    const I = R.schemaEnv.baseId + R.errSchemaPath;
    E += ` at "${I}" (strictTypes)`, (0, l.checkStrictMode)(R, E, R.opts.strictTypes);
  }
  class O {
    constructor(E, I, V) {
      if ((0, a.validateKeywordUsage)(E, I, V), this.gen = E.gen, this.allErrors = E.allErrors, this.keyword = V, this.data = E.data, this.schema = E.schema[V], this.$data = I.$data && E.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, l.schemaRefOrVal)(E, this.schema, V, this.$data), this.schemaType = I.schemaType, this.parentSchema = E.schema, this.params = {}, this.it = E, this.def = I, this.$data)
        this.schemaCode = E.gen.const("vSchema", _e(this.$data, E));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, I.schemaType, I.allowUndefined))
        throw new Error(`${V} value must be ${JSON.stringify(I.schemaType)}`);
      ("code" in I ? I.trackErrors : I.errors !== !1) && (this.errsCount = E.gen.const("_errs", c.default.errors));
    }
    result(E, I, V) {
      this.failResult((0, o.not)(E), I, V);
    }
    failResult(E, I, V) {
      this.gen.if(E), V ? V() : this.error(), I ? (this.gen.else(), I(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(E, I) {
      this.failResult((0, o.not)(E), void 0, I);
    }
    fail(E) {
      if (E === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(E), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(E) {
      if (!this.$data)
        return this.fail(E);
      const { schemaCode: I } = this;
      this.fail((0, o._)`${I} !== undefined && (${(0, o.or)(this.invalid$data(), E)})`);
    }
    error(E, I, V) {
      if (I) {
        this.setParams(I), this._error(E, V), this.setParams({});
        return;
      }
      this._error(E, V);
    }
    _error(E, I) {
      (E ? S.reportExtraError : S.reportError)(this, this.def.error, I);
    }
    $dataError() {
      (0, S.reportError)(this, this.def.$dataError || S.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, S.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(E) {
      this.allErrors || this.gen.if(E);
    }
    setParams(E, I) {
      I ? Object.assign(this.params, E) : this.params = E;
    }
    block$data(E, I, V = o.nil) {
      this.gen.block(() => {
        this.check$data(E, V), I();
      });
    }
    check$data(E = o.nil, I = o.nil) {
      if (!this.$data)
        return;
      const { gen: V, schemaCode: se, schemaType: pe, def: Ae } = this;
      V.if((0, o.or)((0, o._)`${se} === undefined`, I)), E !== o.nil && V.assign(E, !0), (pe.length || Ae.validateSchema) && (V.elseIf(this.invalid$data()), this.$dataError(), E !== o.nil && V.assign(E, !1)), V.else();
    }
    invalid$data() {
      const { gen: E, schemaCode: I, schemaType: V, def: se, it: pe } = this;
      return (0, o.or)(Ae(), dt());
      function Ae() {
        if (V.length) {
          if (!(I instanceof o.Name))
            throw new Error("ajv implementation error");
          const Je = Array.isArray(V) ? V : [V];
          return (0, o._)`${(0, n.checkDataTypes)(Je, I, pe.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return o.nil;
      }
      function dt() {
        if (se.validateSchema) {
          const Je = E.scopeValue("validate$data", { ref: se.validateSchema });
          return (0, o._)`!${Je}(${I})`;
        }
        return o.nil;
      }
    }
    subschema(E, I) {
      const V = (0, i.getSubschema)(this.it, E);
      (0, i.extendSubschemaData)(V, this.it, E), (0, i.extendSubschemaMode)(V, E);
      const se = { ...this.it, ...V, items: void 0, props: void 0 };
      return h(se, I), se;
    }
    mergeEvaluated(E, I) {
      const { it: V, gen: se } = this;
      V.opts.unevaluated && (V.props !== !0 && E.props !== void 0 && (V.props = l.mergeEvaluated.props(se, E.props, V.props, I)), V.items !== !0 && E.items !== void 0 && (V.items = l.mergeEvaluated.items(se, E.items, V.items, I)));
    }
    mergeValidEvaluated(E, I) {
      const { it: V, gen: se } = this;
      if (V.opts.unevaluated && (V.props !== !0 || V.items !== !0))
        return se.if(I, () => this.mergeEvaluated(E, o.Name)), !0;
    }
  }
  kt.KeywordCxt = O;
  function te(R, E, I, V) {
    const se = new O(R, I, E);
    "code" in I ? I.code(se, V) : se.$data && I.validate ? (0, a.funcKeywordCode)(se, I) : "macro" in I ? (0, a.macroKeywordCode)(se, I) : (I.compile || I.validate) && (0, a.funcKeywordCode)(se, I);
  }
  const ae = /^\/(?:[^~]|~0|~1)*$/, $e = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function _e(R, { dataLevel: E, dataNames: I, dataPathArr: V }) {
    let se, pe;
    if (R === "")
      return c.default.rootData;
    if (R[0] === "/") {
      if (!ae.test(R))
        throw new Error(`Invalid JSON-pointer: ${R}`);
      se = R, pe = c.default.rootData;
    } else {
      const We = $e.exec(R);
      if (!We)
        throw new Error(`Invalid JSON-pointer: ${R}`);
      const je = +We[1];
      if (se = We[2], se === "#") {
        if (je >= E)
          throw new Error(Je("property/index", je));
        return V[E - je];
      }
      if (je > E)
        throw new Error(Je("data", je));
      if (pe = I[E - je], !se)
        return pe;
    }
    let Ae = pe;
    const dt = se.split("/");
    for (const We of dt)
      We && (pe = (0, o._)`${pe}${(0, o.getProperty)((0, l.unescapeJsonPointer)(We))}`, Ae = (0, o._)`${Ae} && ${pe}`);
    return Ae;
    function Je(We, je) {
      return `Cannot access ${We} ${je} levels up, current level is ${E}`;
    }
  }
  return kt.getData = _e, kt;
}
var Tr = {}, Ya;
function sa() {
  if (Ya) return Tr;
  Ya = 1, Object.defineProperty(Tr, "__esModule", { value: !0 });
  class r extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return Tr.default = r, Tr;
}
var Er = {}, Xa;
function Bn() {
  if (Xa) return Er;
  Xa = 1, Object.defineProperty(Er, "__esModule", { value: !0 });
  const r = Hn();
  class e extends Error {
    constructor(n, s, a, i) {
      super(i || `can't resolve reference ${a} from id ${s}`), this.missingRef = (0, r.resolveUrl)(n, s, a), this.missingSchema = (0, r.normalizeId)((0, r.getFullPath)(n, this.missingRef));
    }
  }
  return Er.default = e, Er;
}
var et = {}, ei;
function aa() {
  if (ei) return et;
  ei = 1, Object.defineProperty(et, "__esModule", { value: !0 }), et.resolveSchema = et.getCompilingSchema = et.resolveRef = et.compileSchema = et.SchemaEnv = void 0;
  const r = me(), e = sa(), t = zt(), n = Hn(), s = we(), a = Kn();
  class i {
    constructor(p) {
      var d;
      this.refs = {}, this.dynamicAnchors = {};
      let h;
      typeof p.schema == "object" && (h = p.schema), this.schema = p.schema, this.schemaId = p.schemaId, this.root = p.root || this, this.baseId = (d = p.baseId) !== null && d !== void 0 ? d : (0, n.normalizeId)(h == null ? void 0 : h[p.schemaId || "$id"]), this.schemaPath = p.schemaPath, this.localRefs = p.localRefs, this.meta = p.meta, this.$async = h == null ? void 0 : h.$async, this.refs = {};
    }
  }
  et.SchemaEnv = i;
  function o(m) {
    const p = l.call(this, m);
    if (p)
      return p;
    const d = (0, n.getFullPath)(this.opts.uriResolver, m.root.baseId), { es5: h, lines: _ } = this.opts.code, { ownProperties: f } = this.opts, y = new r.CodeGen(this.scope, { es5: h, lines: _, ownProperties: f });
    let k;
    m.$async && (k = y.scopeValue("Error", {
      ref: e.default,
      code: (0, r._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const N = y.scopeName("validate");
    m.validateName = N;
    const z = {
      gen: y,
      allErrors: this.opts.allErrors,
      data: t.default.data,
      parentData: t.default.parentData,
      parentDataProperty: t.default.parentDataProperty,
      dataNames: [t.default.data],
      dataPathArr: [r.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: y.scopeValue("schema", this.opts.code.source === !0 ? { ref: m.schema, code: (0, r.stringify)(m.schema) } : { ref: m.schema }),
      validateName: N,
      ValidationError: k,
      schema: m.schema,
      schemaEnv: m,
      rootId: d,
      baseId: m.baseId || d,
      schemaPath: r.nil,
      errSchemaPath: m.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, r._)`""`,
      opts: this.opts,
      self: this
    };
    let J;
    try {
      this._compilations.add(m), (0, a.validateFunctionCode)(z), y.optimize(this.opts.code.optimize);
      const C = y.toString();
      J = `${y.scopeRefs(t.default.scope)}return ${C}`, this.opts.code.process && (J = this.opts.code.process(J, m));
      const W = new Function(`${t.default.self}`, `${t.default.scope}`, J)(this, this.scope.get());
      if (this.scope.value(N, { ref: W }), W.errors = null, W.schema = m.schema, W.schemaEnv = m, m.$async && (W.$async = !0), this.opts.code.source === !0 && (W.source = { validateName: N, validateCode: C, scopeValues: y._values }), this.opts.unevaluated) {
        const { props: ee, items: Se } = z;
        W.evaluated = {
          props: ee instanceof r.Name ? void 0 : ee,
          items: Se instanceof r.Name ? void 0 : Se,
          dynamicProps: ee instanceof r.Name,
          dynamicItems: Se instanceof r.Name
        }, W.source && (W.source.evaluated = (0, r.stringify)(W.evaluated));
      }
      return m.validate = W, m;
    } catch (C) {
      throw delete m.validate, delete m.validateName, J && this.logger.error("Error compiling schema, function code:", J), C;
    } finally {
      this._compilations.delete(m);
    }
  }
  et.compileSchema = o;
  function c(m, p, d) {
    var h;
    d = (0, n.resolveUrl)(this.opts.uriResolver, p, d);
    const _ = m.refs[d];
    if (_)
      return _;
    let f = w.call(this, m, d);
    if (f === void 0) {
      const y = (h = m.localRefs) === null || h === void 0 ? void 0 : h[d], { schemaId: k } = this.opts;
      y && (f = new i({ schema: y, schemaId: k, root: m, baseId: p }));
    }
    if (f !== void 0)
      return m.refs[d] = u.call(this, f);
  }
  et.resolveRef = c;
  function u(m) {
    return (0, n.inlineRef)(m.schema, this.opts.inlineRefs) ? m.schema : m.validate ? m : o.call(this, m);
  }
  function l(m) {
    for (const p of this._compilations)
      if (S(p, m))
        return p;
  }
  et.getCompilingSchema = l;
  function S(m, p) {
    return m.schema === p.schema && m.root === p.root && m.baseId === p.baseId;
  }
  function w(m, p) {
    let d;
    for (; typeof (d = this.refs[p]) == "string"; )
      p = d;
    return d || this.schemas[p] || v.call(this, m, p);
  }
  function v(m, p) {
    const d = this.opts.uriResolver.parse(p), h = (0, n._getFullPath)(this.opts.uriResolver, d);
    let _ = (0, n.getFullPath)(this.opts.uriResolver, m.baseId, void 0);
    if (Object.keys(m.schema).length > 0 && h === _)
      return $.call(this, d, m);
    const f = (0, n.normalizeId)(h), y = this.refs[f] || this.schemas[f];
    if (typeof y == "string") {
      const k = v.call(this, m, y);
      return typeof (k == null ? void 0 : k.schema) != "object" ? void 0 : $.call(this, d, k);
    }
    if (typeof (y == null ? void 0 : y.schema) == "object") {
      if (y.validate || o.call(this, y), f === (0, n.normalizeId)(p)) {
        const { schema: k } = y, { schemaId: N } = this.opts, z = k[N];
        return z && (_ = (0, n.resolveUrl)(this.opts.uriResolver, _, z)), new i({ schema: k, schemaId: N, root: m, baseId: _ });
      }
      return $.call(this, d, y);
    }
  }
  et.resolveSchema = v;
  const b = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function $(m, { baseId: p, schema: d, root: h }) {
    var _;
    if (((_ = m.fragment) === null || _ === void 0 ? void 0 : _[0]) !== "/")
      return;
    for (const k of m.fragment.slice(1).split("/")) {
      if (typeof d == "boolean")
        return;
      const N = d[(0, s.unescapeFragment)(k)];
      if (N === void 0)
        return;
      d = N;
      const z = typeof d == "object" && d[this.opts.schemaId];
      !b.has(k) && z && (p = (0, n.resolveUrl)(this.opts.uriResolver, p, z));
    }
    let f;
    if (typeof d != "boolean" && d.$ref && !(0, s.schemaHasRulesButRef)(d, this.RULES)) {
      const k = (0, n.resolveUrl)(this.opts.uriResolver, p, d.$ref);
      f = v.call(this, h, k);
    }
    const { schemaId: y } = this.opts;
    if (f = f || new i({ schema: d, schemaId: y, root: h, baseId: p }), f.schema !== f.root.schema)
      return f;
  }
  return et;
}
const il = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", ol = "Meta-schema for $data reference (JSON AnySchema extension proposal)", cl = "object", ul = ["$data"], dl = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, ll = !1, fl = {
  $id: il,
  description: ol,
  type: cl,
  required: ul,
  properties: dl,
  additionalProperties: ll
};
var xr = {}, dr = { exports: {} }, is, ti;
function Ho() {
  if (ti) return is;
  ti = 1;
  const r = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), e = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
  function t(w) {
    let v = "", b = 0, $ = 0;
    for ($ = 0; $ < w.length; $++)
      if (b = w[$].charCodeAt(0), b !== 48) {
        if (!(b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102))
          return "";
        v += w[$];
        break;
      }
    for ($ += 1; $ < w.length; $++) {
      if (b = w[$].charCodeAt(0), !(b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102))
        return "";
      v += w[$];
    }
    return v;
  }
  const n = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function s(w) {
    return w.length = 0, !0;
  }
  function a(w, v, b) {
    if (w.length) {
      const $ = t(w);
      if ($ !== "")
        v.push($);
      else
        return b.error = !0, !1;
      w.length = 0;
    }
    return !0;
  }
  function i(w) {
    let v = 0;
    const b = { error: !1, address: "", zone: "" }, $ = [], m = [];
    let p = !1, d = !1, h = a;
    for (let _ = 0; _ < w.length; _++) {
      const f = w[_];
      if (!(f === "[" || f === "]"))
        if (f === ":") {
          if (p === !0 && (d = !0), !h(m, $, b))
            break;
          if (++v > 7) {
            b.error = !0;
            break;
          }
          _ > 0 && w[_ - 1] === ":" && (p = !0), $.push(":");
          continue;
        } else if (f === "%") {
          if (!h(m, $, b))
            break;
          h = s;
        } else {
          m.push(f);
          continue;
        }
    }
    return m.length && (h === s ? b.zone = m.join("") : d ? $.push(m.join("")) : $.push(t(m))), b.address = $.join(""), b;
  }
  function o(w) {
    if (c(w, ":") < 2)
      return { host: w, isIPV6: !1 };
    const v = i(w);
    if (v.error)
      return { host: w, isIPV6: !1 };
    {
      let b = v.address, $ = v.address;
      return v.zone && (b += "%" + v.zone, $ += "%25" + v.zone), { host: b, isIPV6: !0, escapedHost: $ };
    }
  }
  function c(w, v) {
    let b = 0;
    for (let $ = 0; $ < w.length; $++)
      w[$] === v && b++;
    return b;
  }
  function u(w) {
    let v = w;
    const b = [];
    let $ = -1, m = 0;
    for (; m = v.length; ) {
      if (m === 1) {
        if (v === ".")
          break;
        if (v === "/") {
          b.push("/");
          break;
        } else {
          b.push(v);
          break;
        }
      } else if (m === 2) {
        if (v[0] === ".") {
          if (v[1] === ".")
            break;
          if (v[1] === "/") {
            v = v.slice(2);
            continue;
          }
        } else if (v[0] === "/" && (v[1] === "." || v[1] === "/")) {
          b.push("/");
          break;
        }
      } else if (m === 3 && v === "/..") {
        b.length !== 0 && b.pop(), b.push("/");
        break;
      }
      if (v[0] === ".") {
        if (v[1] === ".") {
          if (v[2] === "/") {
            v = v.slice(3);
            continue;
          }
        } else if (v[1] === "/") {
          v = v.slice(2);
          continue;
        }
      } else if (v[0] === "/" && v[1] === ".") {
        if (v[2] === "/") {
          v = v.slice(2);
          continue;
        } else if (v[2] === "." && v[3] === "/") {
          v = v.slice(3), b.length !== 0 && b.pop();
          continue;
        }
      }
      if (($ = v.indexOf("/", 1)) === -1) {
        b.push(v);
        break;
      } else
        b.push(v.slice(0, $)), v = v.slice($);
    }
    return b.join("");
  }
  function l(w, v) {
    const b = v !== !0 ? escape : unescape;
    return w.scheme !== void 0 && (w.scheme = b(w.scheme)), w.userinfo !== void 0 && (w.userinfo = b(w.userinfo)), w.host !== void 0 && (w.host = b(w.host)), w.path !== void 0 && (w.path = b(w.path)), w.query !== void 0 && (w.query = b(w.query)), w.fragment !== void 0 && (w.fragment = b(w.fragment)), w;
  }
  function S(w) {
    const v = [];
    if (w.userinfo !== void 0 && (v.push(w.userinfo), v.push("@")), w.host !== void 0) {
      let b = unescape(w.host);
      if (!e(b)) {
        const $ = o(b);
        $.isIPV6 === !0 ? b = `[${$.escapedHost}]` : b = w.host;
      }
      v.push(b);
    }
    return (typeof w.port == "number" || typeof w.port == "string") && (v.push(":"), v.push(String(w.port))), v.length ? v.join("") : void 0;
  }
  return is = {
    nonSimpleDomain: n,
    recomposeAuthority: S,
    normalizeComponentEncoding: l,
    removeDotSegments: u,
    isIPv4: e,
    isUUID: r,
    normalizeIPv6: o,
    stringArrayToHexStripped: t
  }, is;
}
var os, ri;
function hl() {
  if (ri) return os;
  ri = 1;
  const { isUUID: r } = Ho(), e = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu, t = (
    /** @type {const} */
    [
      "http",
      "https",
      "ws",
      "wss",
      "urn",
      "urn:uuid"
    ]
  );
  function n(f) {
    return t.indexOf(
      /** @type {*} */
      f
    ) !== -1;
  }
  function s(f) {
    return f.secure === !0 ? !0 : f.secure === !1 ? !1 : f.scheme ? f.scheme.length === 3 && (f.scheme[0] === "w" || f.scheme[0] === "W") && (f.scheme[1] === "s" || f.scheme[1] === "S") && (f.scheme[2] === "s" || f.scheme[2] === "S") : !1;
  }
  function a(f) {
    return f.host || (f.error = f.error || "HTTP URIs must have a host."), f;
  }
  function i(f) {
    const y = String(f.scheme).toLowerCase() === "https";
    return (f.port === (y ? 443 : 80) || f.port === "") && (f.port = void 0), f.path || (f.path = "/"), f;
  }
  function o(f) {
    return f.secure = s(f), f.resourceName = (f.path || "/") + (f.query ? "?" + f.query : ""), f.path = void 0, f.query = void 0, f;
  }
  function c(f) {
    if ((f.port === (s(f) ? 443 : 80) || f.port === "") && (f.port = void 0), typeof f.secure == "boolean" && (f.scheme = f.secure ? "wss" : "ws", f.secure = void 0), f.resourceName) {
      const [y, k] = f.resourceName.split("?");
      f.path = y && y !== "/" ? y : void 0, f.query = k, f.resourceName = void 0;
    }
    return f.fragment = void 0, f;
  }
  function u(f, y) {
    if (!f.path)
      return f.error = "URN can not be parsed", f;
    const k = f.path.match(e);
    if (k) {
      const N = y.scheme || f.scheme || "urn";
      f.nid = k[1].toLowerCase(), f.nss = k[2];
      const z = `${N}:${y.nid || f.nid}`, J = _(z);
      f.path = void 0, J && (f = J.parse(f, y));
    } else
      f.error = f.error || "URN can not be parsed.";
    return f;
  }
  function l(f, y) {
    if (f.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const k = y.scheme || f.scheme || "urn", N = f.nid.toLowerCase(), z = `${k}:${y.nid || N}`, J = _(z);
    J && (f = J.serialize(f, y));
    const C = f, U = f.nss;
    return C.path = `${N || y.nid}:${U}`, y.skipEscape = !0, C;
  }
  function S(f, y) {
    const k = f;
    return k.uuid = k.nss, k.nss = void 0, !y.tolerant && (!k.uuid || !r(k.uuid)) && (k.error = k.error || "UUID is not valid."), k;
  }
  function w(f) {
    const y = f;
    return y.nss = (f.uuid || "").toLowerCase(), y;
  }
  const v = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: a,
      serialize: i
    }
  ), b = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: v.domainHost,
      parse: a,
      serialize: i
    }
  ), $ = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: o,
      serialize: c
    }
  ), m = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: $.domainHost,
      parse: $.parse,
      serialize: $.serialize
    }
  ), h = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: v,
      https: b,
      ws: $,
      wss: m,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: u,
          serialize: l,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: S,
          serialize: w,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(h, null);
  function _(f) {
    return f && (h[
      /** @type {SchemeName} */
      f
    ] || h[
      /** @type {SchemeName} */
      f.toLowerCase()
    ]) || void 0;
  }
  return os = {
    wsIsSecure: s,
    SCHEMES: h,
    isValidSchemeName: n,
    getSchemeHandler: _
  }, os;
}
var ni;
function ml() {
  if (ni) return dr.exports;
  ni = 1;
  const { normalizeIPv6: r, removeDotSegments: e, recomposeAuthority: t, normalizeComponentEncoding: n, isIPv4: s, nonSimpleDomain: a } = Ho(), { SCHEMES: i, getSchemeHandler: o } = hl();
  function c(m, p) {
    return typeof m == "string" ? m = /** @type {T} */
    w(b(m, p), p) : typeof m == "object" && (m = /** @type {T} */
    b(w(m, p), p)), m;
  }
  function u(m, p, d) {
    const h = d ? Object.assign({ scheme: "null" }, d) : { scheme: "null" }, _ = l(b(m, h), b(p, h), h, !0);
    return h.skipEscape = !0, w(_, h);
  }
  function l(m, p, d, h) {
    const _ = {};
    return h || (m = b(w(m, d), d), p = b(w(p, d), d)), d = d || {}, !d.tolerant && p.scheme ? (_.scheme = p.scheme, _.userinfo = p.userinfo, _.host = p.host, _.port = p.port, _.path = e(p.path || ""), _.query = p.query) : (p.userinfo !== void 0 || p.host !== void 0 || p.port !== void 0 ? (_.userinfo = p.userinfo, _.host = p.host, _.port = p.port, _.path = e(p.path || ""), _.query = p.query) : (p.path ? (p.path[0] === "/" ? _.path = e(p.path) : ((m.userinfo !== void 0 || m.host !== void 0 || m.port !== void 0) && !m.path ? _.path = "/" + p.path : m.path ? _.path = m.path.slice(0, m.path.lastIndexOf("/") + 1) + p.path : _.path = p.path, _.path = e(_.path)), _.query = p.query) : (_.path = m.path, p.query !== void 0 ? _.query = p.query : _.query = m.query), _.userinfo = m.userinfo, _.host = m.host, _.port = m.port), _.scheme = m.scheme), _.fragment = p.fragment, _;
  }
  function S(m, p, d) {
    return typeof m == "string" ? (m = unescape(m), m = w(n(b(m, d), !0), { ...d, skipEscape: !0 })) : typeof m == "object" && (m = w(n(m, !0), { ...d, skipEscape: !0 })), typeof p == "string" ? (p = unescape(p), p = w(n(b(p, d), !0), { ...d, skipEscape: !0 })) : typeof p == "object" && (p = w(n(p, !0), { ...d, skipEscape: !0 })), m.toLowerCase() === p.toLowerCase();
  }
  function w(m, p) {
    const d = {
      host: m.host,
      scheme: m.scheme,
      userinfo: m.userinfo,
      port: m.port,
      path: m.path,
      query: m.query,
      nid: m.nid,
      nss: m.nss,
      uuid: m.uuid,
      fragment: m.fragment,
      reference: m.reference,
      resourceName: m.resourceName,
      secure: m.secure,
      error: ""
    }, h = Object.assign({}, p), _ = [], f = o(h.scheme || d.scheme);
    f && f.serialize && f.serialize(d, h), d.path !== void 0 && (h.skipEscape ? d.path = unescape(d.path) : (d.path = escape(d.path), d.scheme !== void 0 && (d.path = d.path.split("%3A").join(":")))), h.reference !== "suffix" && d.scheme && _.push(d.scheme, ":");
    const y = t(d);
    if (y !== void 0 && (h.reference !== "suffix" && _.push("//"), _.push(y), d.path && d.path[0] !== "/" && _.push("/")), d.path !== void 0) {
      let k = d.path;
      !h.absolutePath && (!f || !f.absolutePath) && (k = e(k)), y === void 0 && k[0] === "/" && k[1] === "/" && (k = "/%2F" + k.slice(2)), _.push(k);
    }
    return d.query !== void 0 && _.push("?", d.query), d.fragment !== void 0 && _.push("#", d.fragment), _.join("");
  }
  const v = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function b(m, p) {
    const d = Object.assign({}, p), h = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let _ = !1;
    d.reference === "suffix" && (d.scheme ? m = d.scheme + ":" + m : m = "//" + m);
    const f = m.match(v);
    if (f) {
      if (h.scheme = f[1], h.userinfo = f[3], h.host = f[4], h.port = parseInt(f[5], 10), h.path = f[6] || "", h.query = f[7], h.fragment = f[8], isNaN(h.port) && (h.port = f[5]), h.host)
        if (s(h.host) === !1) {
          const N = r(h.host);
          h.host = N.host.toLowerCase(), _ = N.isIPV6;
        } else
          _ = !0;
      h.scheme === void 0 && h.userinfo === void 0 && h.host === void 0 && h.port === void 0 && h.query === void 0 && !h.path ? h.reference = "same-document" : h.scheme === void 0 ? h.reference = "relative" : h.fragment === void 0 ? h.reference = "absolute" : h.reference = "uri", d.reference && d.reference !== "suffix" && d.reference !== h.reference && (h.error = h.error || "URI is not a " + d.reference + " reference.");
      const y = o(d.scheme || h.scheme);
      if (!d.unicodeSupport && (!y || !y.unicodeSupport) && h.host && (d.domainHost || y && y.domainHost) && _ === !1 && a(h.host))
        try {
          h.host = URL.domainToASCII(h.host.toLowerCase());
        } catch (k) {
          h.error = h.error || "Host's domain name can not be converted to ASCII: " + k;
        }
      (!y || y && !y.skipNormalize) && (m.indexOf("%") !== -1 && (h.scheme !== void 0 && (h.scheme = unescape(h.scheme)), h.host !== void 0 && (h.host = unescape(h.host))), h.path && (h.path = escape(unescape(h.path))), h.fragment && (h.fragment = encodeURI(decodeURIComponent(h.fragment)))), y && y.parse && y.parse(h, d);
    } else
      h.error = h.error || "URI can not be parsed.";
    return h;
  }
  const $ = {
    SCHEMES: i,
    normalize: c,
    resolve: u,
    resolveComponent: l,
    equal: S,
    serialize: w,
    parse: b
  };
  return dr.exports = $, dr.exports.default = $, dr.exports.fastUri = $, dr.exports;
}
var si;
function pl() {
  if (si) return xr;
  si = 1, Object.defineProperty(xr, "__esModule", { value: !0 });
  const r = ml();
  return r.code = 'require("ajv/dist/runtime/uri").default', xr.default = r, xr;
}
var ai;
function gl() {
  return ai || (ai = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.CodeGen = r.Name = r.nil = r.stringify = r.str = r._ = r.KeywordCxt = void 0;
    var e = Kn();
    Object.defineProperty(r, "KeywordCxt", { enumerable: !0, get: function() {
      return e.KeywordCxt;
    } });
    var t = me();
    Object.defineProperty(r, "_", { enumerable: !0, get: function() {
      return t._;
    } }), Object.defineProperty(r, "str", { enumerable: !0, get: function() {
      return t.str;
    } }), Object.defineProperty(r, "stringify", { enumerable: !0, get: function() {
      return t.stringify;
    } }), Object.defineProperty(r, "nil", { enumerable: !0, get: function() {
      return t.nil;
    } }), Object.defineProperty(r, "Name", { enumerable: !0, get: function() {
      return t.Name;
    } }), Object.defineProperty(r, "CodeGen", { enumerable: !0, get: function() {
      return t.CodeGen;
    } });
    const n = sa(), s = Bn(), a = Vo(), i = aa(), o = me(), c = Hn(), u = In(), l = we(), S = fl, w = pl(), v = (L, T) => new RegExp(L, T);
    v.code = "new RegExp";
    const b = ["removeAdditional", "useDefaults", "coerceTypes"], $ = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), m = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, p = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, d = 200;
    function h(L) {
      var T, A, x, g, P, O, te, ae, $e, _e, R, E, I, V, se, pe, Ae, dt, Je, We, je, Yt, rt, Gn, Jn;
      const cr = L.strict, Wn = (T = L.code) === null || T === void 0 ? void 0 : T.optimize, oa = Wn === !0 || Wn === void 0 ? 1 : Wn || 0, ca = (x = (A = L.code) === null || A === void 0 ? void 0 : A.regExp) !== null && x !== void 0 ? x : v, nc = (g = L.uriResolver) !== null && g !== void 0 ? g : w.default;
      return {
        strictSchema: (O = (P = L.strictSchema) !== null && P !== void 0 ? P : cr) !== null && O !== void 0 ? O : !0,
        strictNumbers: (ae = (te = L.strictNumbers) !== null && te !== void 0 ? te : cr) !== null && ae !== void 0 ? ae : !0,
        strictTypes: (_e = ($e = L.strictTypes) !== null && $e !== void 0 ? $e : cr) !== null && _e !== void 0 ? _e : "log",
        strictTuples: (E = (R = L.strictTuples) !== null && R !== void 0 ? R : cr) !== null && E !== void 0 ? E : "log",
        strictRequired: (V = (I = L.strictRequired) !== null && I !== void 0 ? I : cr) !== null && V !== void 0 ? V : !1,
        code: L.code ? { ...L.code, optimize: oa, regExp: ca } : { optimize: oa, regExp: ca },
        loopRequired: (se = L.loopRequired) !== null && se !== void 0 ? se : d,
        loopEnum: (pe = L.loopEnum) !== null && pe !== void 0 ? pe : d,
        meta: (Ae = L.meta) !== null && Ae !== void 0 ? Ae : !0,
        messages: (dt = L.messages) !== null && dt !== void 0 ? dt : !0,
        inlineRefs: (Je = L.inlineRefs) !== null && Je !== void 0 ? Je : !0,
        schemaId: (We = L.schemaId) !== null && We !== void 0 ? We : "$id",
        addUsedSchema: (je = L.addUsedSchema) !== null && je !== void 0 ? je : !0,
        validateSchema: (Yt = L.validateSchema) !== null && Yt !== void 0 ? Yt : !0,
        validateFormats: (rt = L.validateFormats) !== null && rt !== void 0 ? rt : !0,
        unicodeRegExp: (Gn = L.unicodeRegExp) !== null && Gn !== void 0 ? Gn : !0,
        int32range: (Jn = L.int32range) !== null && Jn !== void 0 ? Jn : !0,
        uriResolver: nc
      };
    }
    class _ {
      constructor(T = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), T = this.opts = { ...T, ...h(T) };
        const { es5: A, lines: x } = this.opts.code;
        this.scope = new o.ValueScope({ scope: {}, prefixes: $, es5: A, lines: x }), this.logger = U(T.logger);
        const g = T.validateFormats;
        T.validateFormats = !1, this.RULES = (0, a.getRules)(), f.call(this, m, T, "NOT SUPPORTED"), f.call(this, p, T, "DEPRECATED", "warn"), this._metaOpts = J.call(this), T.formats && N.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), T.keywords && z.call(this, T.keywords), typeof T.meta == "object" && this.addMetaSchema(T.meta), k.call(this), T.validateFormats = g;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: T, meta: A, schemaId: x } = this.opts;
        let g = S;
        x === "id" && (g = { ...S }, g.id = g.$id, delete g.$id), A && T && this.addMetaSchema(g, g[x], !1);
      }
      defaultMeta() {
        const { meta: T, schemaId: A } = this.opts;
        return this.opts.defaultMeta = typeof T == "object" ? T[A] || T : void 0;
      }
      validate(T, A) {
        let x;
        if (typeof T == "string") {
          if (x = this.getSchema(T), !x)
            throw new Error(`no schema with key or ref "${T}"`);
        } else
          x = this.compile(T);
        const g = x(A);
        return "$async" in x || (this.errors = x.errors), g;
      }
      compile(T, A) {
        const x = this._addSchema(T, A);
        return x.validate || this._compileSchemaEnv(x);
      }
      compileAsync(T, A) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: x } = this.opts;
        return g.call(this, T, A);
        async function g(_e, R) {
          await P.call(this, _e.$schema);
          const E = this._addSchema(_e, R);
          return E.validate || O.call(this, E);
        }
        async function P(_e) {
          _e && !this.getSchema(_e) && await g.call(this, { $ref: _e }, !0);
        }
        async function O(_e) {
          try {
            return this._compileSchemaEnv(_e);
          } catch (R) {
            if (!(R instanceof s.default))
              throw R;
            return te.call(this, R), await ae.call(this, R.missingSchema), O.call(this, _e);
          }
        }
        function te({ missingSchema: _e, missingRef: R }) {
          if (this.refs[_e])
            throw new Error(`AnySchema ${_e} is loaded but ${R} cannot be resolved`);
        }
        async function ae(_e) {
          const R = await $e.call(this, _e);
          this.refs[_e] || await P.call(this, R.$schema), this.refs[_e] || this.addSchema(R, _e, A);
        }
        async function $e(_e) {
          const R = this._loading[_e];
          if (R)
            return R;
          try {
            return await (this._loading[_e] = x(_e));
          } finally {
            delete this._loading[_e];
          }
        }
      }
      // Adds schema to the instance
      addSchema(T, A, x, g = this.opts.validateSchema) {
        if (Array.isArray(T)) {
          for (const O of T)
            this.addSchema(O, void 0, x, g);
          return this;
        }
        let P;
        if (typeof T == "object") {
          const { schemaId: O } = this.opts;
          if (P = T[O], P !== void 0 && typeof P != "string")
            throw new Error(`schema ${O} must be string`);
        }
        return A = (0, c.normalizeId)(A || P), this._checkUnique(A), this.schemas[A] = this._addSchema(T, x, A, g, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(T, A, x = this.opts.validateSchema) {
        return this.addSchema(T, A, !0, x), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(T, A) {
        if (typeof T == "boolean")
          return !0;
        let x;
        if (x = T.$schema, x !== void 0 && typeof x != "string")
          throw new Error("$schema must be a string");
        if (x = x || this.opts.defaultMeta || this.defaultMeta(), !x)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const g = this.validate(x, T);
        if (!g && A) {
          const P = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(P);
          else
            throw new Error(P);
        }
        return g;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(T) {
        let A;
        for (; typeof (A = y.call(this, T)) == "string"; )
          T = A;
        if (A === void 0) {
          const { schemaId: x } = this.opts, g = new i.SchemaEnv({ schema: {}, schemaId: x });
          if (A = i.resolveSchema.call(this, g, T), !A)
            return;
          this.refs[T] = A;
        }
        return A.validate || this._compileSchemaEnv(A);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(T) {
        if (T instanceof RegExp)
          return this._removeAllSchemas(this.schemas, T), this._removeAllSchemas(this.refs, T), this;
        switch (typeof T) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const A = y.call(this, T);
            return typeof A == "object" && this._cache.delete(A.schema), delete this.schemas[T], delete this.refs[T], this;
          }
          case "object": {
            const A = T;
            this._cache.delete(A);
            let x = T[this.opts.schemaId];
            return x && (x = (0, c.normalizeId)(x), delete this.schemas[x], delete this.refs[x]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(T) {
        for (const A of T)
          this.addKeyword(A);
        return this;
      }
      addKeyword(T, A) {
        let x;
        if (typeof T == "string")
          x = T, typeof A == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), A.keyword = x);
        else if (typeof T == "object" && A === void 0) {
          if (A = T, x = A.keyword, Array.isArray(x) && !x.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (ee.call(this, x, A), !A)
          return (0, l.eachItem)(x, (P) => Se.call(this, P)), this;
        Le.call(this, A);
        const g = {
          ...A,
          type: (0, u.getJSONTypes)(A.type),
          schemaType: (0, u.getJSONTypes)(A.schemaType)
        };
        return (0, l.eachItem)(x, g.type.length === 0 ? (P) => Se.call(this, P, g) : (P) => g.type.forEach((O) => Se.call(this, P, g, O))), this;
      }
      getKeyword(T) {
        const A = this.RULES.all[T];
        return typeof A == "object" ? A.definition : !!A;
      }
      // Remove keyword
      removeKeyword(T) {
        const { RULES: A } = this;
        delete A.keywords[T], delete A.all[T];
        for (const x of A.rules) {
          const g = x.rules.findIndex((P) => P.keyword === T);
          g >= 0 && x.rules.splice(g, 1);
        }
        return this;
      }
      // Add format
      addFormat(T, A) {
        return typeof A == "string" && (A = new RegExp(A)), this.formats[T] = A, this;
      }
      errorsText(T = this.errors, { separator: A = ", ", dataVar: x = "data" } = {}) {
        return !T || T.length === 0 ? "No errors" : T.map((g) => `${x}${g.instancePath} ${g.message}`).reduce((g, P) => g + A + P);
      }
      $dataMetaSchema(T, A) {
        const x = this.RULES.all;
        T = JSON.parse(JSON.stringify(T));
        for (const g of A) {
          const P = g.split("/").slice(1);
          let O = T;
          for (const te of P)
            O = O[te];
          for (const te in x) {
            const ae = x[te];
            if (typeof ae != "object")
              continue;
            const { $data: $e } = ae.definition, _e = O[te];
            $e && _e && (O[te] = ut(_e));
          }
        }
        return T;
      }
      _removeAllSchemas(T, A) {
        for (const x in T) {
          const g = T[x];
          (!A || A.test(x)) && (typeof g == "string" ? delete T[x] : g && !g.meta && (this._cache.delete(g.schema), delete T[x]));
        }
      }
      _addSchema(T, A, x, g = this.opts.validateSchema, P = this.opts.addUsedSchema) {
        let O;
        const { schemaId: te } = this.opts;
        if (typeof T == "object")
          O = T[te];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof T != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let ae = this._cache.get(T);
        if (ae !== void 0)
          return ae;
        x = (0, c.normalizeId)(O || x);
        const $e = c.getSchemaRefs.call(this, T, x);
        return ae = new i.SchemaEnv({ schema: T, schemaId: te, meta: A, baseId: x, localRefs: $e }), this._cache.set(ae.schema, ae), P && !x.startsWith("#") && (x && this._checkUnique(x), this.refs[x] = ae), g && this.validateSchema(T, !0), ae;
      }
      _checkUnique(T) {
        if (this.schemas[T] || this.refs[T])
          throw new Error(`schema with key or id "${T}" already exists`);
      }
      _compileSchemaEnv(T) {
        if (T.meta ? this._compileMetaSchema(T) : i.compileSchema.call(this, T), !T.validate)
          throw new Error("ajv implementation error");
        return T.validate;
      }
      _compileMetaSchema(T) {
        const A = this.opts;
        this.opts = this._metaOpts;
        try {
          i.compileSchema.call(this, T);
        } finally {
          this.opts = A;
        }
      }
    }
    _.ValidationError = n.default, _.MissingRefError = s.default, r.default = _;
    function f(L, T, A, x = "error") {
      for (const g in L) {
        const P = g;
        P in T && this.logger[x](`${A}: option ${g}. ${L[P]}`);
      }
    }
    function y(L) {
      return L = (0, c.normalizeId)(L), this.schemas[L] || this.refs[L];
    }
    function k() {
      const L = this.opts.schemas;
      if (L)
        if (Array.isArray(L))
          this.addSchema(L);
        else
          for (const T in L)
            this.addSchema(L[T], T);
    }
    function N() {
      for (const L in this.opts.formats) {
        const T = this.opts.formats[L];
        T && this.addFormat(L, T);
      }
    }
    function z(L) {
      if (Array.isArray(L)) {
        this.addVocabulary(L);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const T in L) {
        const A = L[T];
        A.keyword || (A.keyword = T), this.addKeyword(A);
      }
    }
    function J() {
      const L = { ...this.opts };
      for (const T of b)
        delete L[T];
      return L;
    }
    const C = { log() {
    }, warn() {
    }, error() {
    } };
    function U(L) {
      if (L === !1)
        return C;
      if (L === void 0)
        return console;
      if (L.log && L.warn && L.error)
        return L;
      throw new Error("logger must implement log, warn and error methods");
    }
    const W = /^[a-z_$][a-z0-9_$:-]*$/i;
    function ee(L, T) {
      const { RULES: A } = this;
      if ((0, l.eachItem)(L, (x) => {
        if (A.keywords[x])
          throw new Error(`Keyword ${x} is already defined`);
        if (!W.test(x))
          throw new Error(`Keyword ${x} has invalid name`);
      }), !!T && T.$data && !("code" in T || "validate" in T))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function Se(L, T, A) {
      var x;
      const g = T == null ? void 0 : T.post;
      if (A && g)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: P } = this;
      let O = g ? P.post : P.rules.find(({ type: ae }) => ae === A);
      if (O || (O = { type: A, rules: [] }, P.rules.push(O)), P.keywords[L] = !0, !T)
        return;
      const te = {
        keyword: L,
        definition: {
          ...T,
          type: (0, u.getJSONTypes)(T.type),
          schemaType: (0, u.getJSONTypes)(T.schemaType)
        }
      };
      T.before ? ze.call(this, O, te, T.before) : O.rules.push(te), P.all[L] = te, (x = T.implements) === null || x === void 0 || x.forEach((ae) => this.addKeyword(ae));
    }
    function ze(L, T, A) {
      const x = L.rules.findIndex((g) => g.keyword === A);
      x >= 0 ? L.rules.splice(x, 0, T) : (L.rules.push(T), this.logger.warn(`rule ${A} is not defined`));
    }
    function Le(L) {
      let { metaSchema: T } = L;
      T !== void 0 && (L.$data && this.opts.$data && (T = ut(T)), L.validateSchema = this.compile(T, !0));
    }
    const Te = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ut(L) {
      return { anyOf: [L, Te] };
    }
  })(Xn)), Xn;
}
var Nr = {}, Or = {}, Cr = {}, ii;
function yl() {
  if (ii) return Cr;
  ii = 1, Object.defineProperty(Cr, "__esModule", { value: !0 });
  const r = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Cr.default = r, Cr;
}
var At = {}, oi;
function _l() {
  if (oi) return At;
  oi = 1, Object.defineProperty(At, "__esModule", { value: !0 }), At.callRef = At.getValidate = void 0;
  const r = Bn(), e = mt(), t = me(), n = zt(), s = aa(), a = we(), i = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: l, schema: S, it: w } = u, { baseId: v, schemaEnv: b, validateName: $, opts: m, self: p } = w, { root: d } = b;
      if ((S === "#" || S === "#/") && v === d.baseId)
        return _();
      const h = s.resolveRef.call(p, d, v, S);
      if (h === void 0)
        throw new r.default(w.opts.uriResolver, v, S);
      if (h instanceof s.SchemaEnv)
        return f(h);
      return y(h);
      function _() {
        if (b === d)
          return c(u, $, b, b.$async);
        const k = l.scopeValue("root", { ref: d });
        return c(u, (0, t._)`${k}.validate`, d, d.$async);
      }
      function f(k) {
        const N = o(u, k);
        c(u, N, k, k.$async);
      }
      function y(k) {
        const N = l.scopeValue("schema", m.code.source === !0 ? { ref: k, code: (0, t.stringify)(k) } : { ref: k }), z = l.name("valid"), J = u.subschema({
          schema: k,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: N,
          errSchemaPath: S
        }, z);
        u.mergeEvaluated(J), u.ok(z);
      }
    }
  };
  function o(u, l) {
    const { gen: S } = u;
    return l.validate ? S.scopeValue("validate", { ref: l.validate }) : (0, t._)`${S.scopeValue("wrapper", { ref: l })}.validate`;
  }
  At.getValidate = o;
  function c(u, l, S, w) {
    const { gen: v, it: b } = u, { allErrors: $, schemaEnv: m, opts: p } = b, d = p.passContext ? n.default.this : t.nil;
    w ? h() : _();
    function h() {
      if (!m.$async)
        throw new Error("async schema referenced by sync schema");
      const k = v.let("valid");
      v.try(() => {
        v.code((0, t._)`await ${(0, e.callValidateCode)(u, l, d)}`), y(l), $ || v.assign(k, !0);
      }, (N) => {
        v.if((0, t._)`!(${N} instanceof ${b.ValidationError})`, () => v.throw(N)), f(N), $ || v.assign(k, !1);
      }), u.ok(k);
    }
    function _() {
      u.result((0, e.callValidateCode)(u, l, d), () => y(l), () => f(l));
    }
    function f(k) {
      const N = (0, t._)`${k}.errors`;
      v.assign(n.default.vErrors, (0, t._)`${n.default.vErrors} === null ? ${N} : ${n.default.vErrors}.concat(${N})`), v.assign(n.default.errors, (0, t._)`${n.default.vErrors}.length`);
    }
    function y(k) {
      var N;
      if (!b.opts.unevaluated)
        return;
      const z = (N = S == null ? void 0 : S.validate) === null || N === void 0 ? void 0 : N.evaluated;
      if (b.props !== !0)
        if (z && !z.dynamicProps)
          z.props !== void 0 && (b.props = a.mergeEvaluated.props(v, z.props, b.props));
        else {
          const J = v.var("props", (0, t._)`${k}.evaluated.props`);
          b.props = a.mergeEvaluated.props(v, J, b.props, t.Name);
        }
      if (b.items !== !0)
        if (z && !z.dynamicItems)
          z.items !== void 0 && (b.items = a.mergeEvaluated.items(v, z.items, b.items));
        else {
          const J = v.var("items", (0, t._)`${k}.evaluated.items`);
          b.items = a.mergeEvaluated.items(v, J, b.items, t.Name);
        }
    }
  }
  return At.callRef = c, At.default = i, At;
}
var ci;
function vl() {
  if (ci) return Or;
  ci = 1, Object.defineProperty(Or, "__esModule", { value: !0 });
  const r = yl(), e = _l(), t = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    r.default,
    e.default
  ];
  return Or.default = t, Or;
}
var Ir = {}, Ar = {}, ui;
function bl() {
  if (ui) return Ar;
  ui = 1, Object.defineProperty(Ar, "__esModule", { value: !0 });
  const r = me(), e = r.operators, t = {
    maximum: { okStr: "<=", ok: e.LTE, fail: e.GT },
    minimum: { okStr: ">=", ok: e.GTE, fail: e.LT },
    exclusiveMaximum: { okStr: "<", ok: e.LT, fail: e.GTE },
    exclusiveMinimum: { okStr: ">", ok: e.GT, fail: e.LTE }
  }, n = {
    message: ({ keyword: a, schemaCode: i }) => (0, r.str)`must be ${t[a].okStr} ${i}`,
    params: ({ keyword: a, schemaCode: i }) => (0, r._)`{comparison: ${t[a].okStr}, limit: ${i}}`
  }, s = {
    keyword: Object.keys(t),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: n,
    code(a) {
      const { keyword: i, data: o, schemaCode: c } = a;
      a.fail$data((0, r._)`${o} ${t[i].fail} ${c} || isNaN(${o})`);
    }
  };
  return Ar.default = s, Ar;
}
var jr = {}, di;
function wl() {
  if (di) return jr;
  di = 1, Object.defineProperty(jr, "__esModule", { value: !0 });
  const r = me(), t = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, r.str)`must be multiple of ${n}`,
      params: ({ schemaCode: n }) => (0, r._)`{multipleOf: ${n}}`
    },
    code(n) {
      const { gen: s, data: a, schemaCode: i, it: o } = n, c = o.opts.multipleOfPrecision, u = s.let("res"), l = c ? (0, r._)`Math.abs(Math.round(${u}) - ${u}) > 1e-${c}` : (0, r._)`${u} !== parseInt(${u})`;
      n.fail$data((0, r._)`(${i} === 0 || (${u} = ${a}/${i}, ${l}))`);
    }
  };
  return jr.default = t, jr;
}
var Mr = {}, qr = {}, li;
function $l() {
  if (li) return qr;
  li = 1, Object.defineProperty(qr, "__esModule", { value: !0 });
  function r(e) {
    const t = e.length;
    let n = 0, s = 0, a;
    for (; s < t; )
      n++, a = e.charCodeAt(s++), a >= 55296 && a <= 56319 && s < t && (a = e.charCodeAt(s), (a & 64512) === 56320 && s++);
    return n;
  }
  return qr.default = r, r.code = 'require("ajv/dist/runtime/ucs2length").default', qr;
}
var fi;
function kl() {
  if (fi) return Mr;
  fi = 1, Object.defineProperty(Mr, "__esModule", { value: !0 });
  const r = me(), e = we(), t = $l(), s = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: a, schemaCode: i }) {
        const o = a === "maxLength" ? "more" : "fewer";
        return (0, r.str)`must NOT have ${o} than ${i} characters`;
      },
      params: ({ schemaCode: a }) => (0, r._)`{limit: ${a}}`
    },
    code(a) {
      const { keyword: i, data: o, schemaCode: c, it: u } = a, l = i === "maxLength" ? r.operators.GT : r.operators.LT, S = u.opts.unicode === !1 ? (0, r._)`${o}.length` : (0, r._)`${(0, e.useFunc)(a.gen, t.default)}(${o})`;
      a.fail$data((0, r._)`${S} ${l} ${c}`);
    }
  };
  return Mr.default = s, Mr;
}
var Dr = {}, hi;
function Sl() {
  if (hi) return Dr;
  hi = 1, Object.defineProperty(Dr, "__esModule", { value: !0 });
  const r = mt(), e = me(), n = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: s }) => (0, e.str)`must match pattern "${s}"`,
      params: ({ schemaCode: s }) => (0, e._)`{pattern: ${s}}`
    },
    code(s) {
      const { data: a, $data: i, schema: o, schemaCode: c, it: u } = s, l = u.opts.unicodeRegExp ? "u" : "", S = i ? (0, e._)`(new RegExp(${c}, ${l}))` : (0, r.usePattern)(s, o);
      s.fail$data((0, e._)`!${S}.test(${a})`);
    }
  };
  return Dr.default = n, Dr;
}
var Zr = {}, mi;
function Pl() {
  if (mi) return Zr;
  mi = 1, Object.defineProperty(Zr, "__esModule", { value: !0 });
  const r = me(), t = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: s }) {
        const a = n === "maxProperties" ? "more" : "fewer";
        return (0, r.str)`must NOT have ${a} than ${s} properties`;
      },
      params: ({ schemaCode: n }) => (0, r._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: s, data: a, schemaCode: i } = n, o = s === "maxProperties" ? r.operators.GT : r.operators.LT;
      n.fail$data((0, r._)`Object.keys(${a}).length ${o} ${i}`);
    }
  };
  return Zr.default = t, Zr;
}
var zr = {}, pi;
function Rl() {
  if (pi) return zr;
  pi = 1, Object.defineProperty(zr, "__esModule", { value: !0 });
  const r = mt(), e = me(), t = we(), s = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: a } }) => (0, e.str)`must have required property '${a}'`,
      params: ({ params: { missingProperty: a } }) => (0, e._)`{missingProperty: ${a}}`
    },
    code(a) {
      const { gen: i, schema: o, schemaCode: c, data: u, $data: l, it: S } = a, { opts: w } = S;
      if (!l && o.length === 0)
        return;
      const v = o.length >= w.loopRequired;
      if (S.allErrors ? b() : $(), w.strictRequired) {
        const d = a.parentSchema.properties, { definedProperties: h } = a.it;
        for (const _ of o)
          if ((d == null ? void 0 : d[_]) === void 0 && !h.has(_)) {
            const f = S.schemaEnv.baseId + S.errSchemaPath, y = `required property "${_}" is not defined at "${f}" (strictRequired)`;
            (0, t.checkStrictMode)(S, y, S.opts.strictRequired);
          }
      }
      function b() {
        if (v || l)
          a.block$data(e.nil, m);
        else
          for (const d of o)
            (0, r.checkReportMissingProp)(a, d);
      }
      function $() {
        const d = i.let("missing");
        if (v || l) {
          const h = i.let("valid", !0);
          a.block$data(h, () => p(d, h)), a.ok(h);
        } else
          i.if((0, r.checkMissingProp)(a, o, d)), (0, r.reportMissingProp)(a, d), i.else();
      }
      function m() {
        i.forOf("prop", c, (d) => {
          a.setParams({ missingProperty: d }), i.if((0, r.noPropertyInData)(i, u, d, w.ownProperties), () => a.error());
        });
      }
      function p(d, h) {
        a.setParams({ missingProperty: d }), i.forOf(d, c, () => {
          i.assign(h, (0, r.propertyInData)(i, u, d, w.ownProperties)), i.if((0, e.not)(h), () => {
            a.error(), i.break();
          });
        }, e.nil);
      }
    }
  };
  return zr.default = s, zr;
}
var Lr = {}, gi;
function Tl() {
  if (gi) return Lr;
  gi = 1, Object.defineProperty(Lr, "__esModule", { value: !0 });
  const r = me(), t = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: s }) {
        const a = n === "maxItems" ? "more" : "fewer";
        return (0, r.str)`must NOT have ${a} than ${s} items`;
      },
      params: ({ schemaCode: n }) => (0, r._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: s, data: a, schemaCode: i } = n, o = s === "maxItems" ? r.operators.GT : r.operators.LT;
      n.fail$data((0, r._)`${a}.length ${o} ${i}`);
    }
  };
  return Lr.default = t, Lr;
}
var Vr = {}, Fr = {}, yi;
function ia() {
  if (yi) return Fr;
  yi = 1, Object.defineProperty(Fr, "__esModule", { value: !0 });
  const r = Uo();
  return r.code = 'require("ajv/dist/runtime/equal").default', Fr.default = r, Fr;
}
var _i;
function El() {
  if (_i) return Vr;
  _i = 1, Object.defineProperty(Vr, "__esModule", { value: !0 });
  const r = In(), e = me(), t = we(), n = ia(), a = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i, j: o } }) => (0, e.str)`must NOT have duplicate items (items ## ${o} and ${i} are identical)`,
      params: ({ params: { i, j: o } }) => (0, e._)`{i: ${i}, j: ${o}}`
    },
    code(i) {
      const { gen: o, data: c, $data: u, schema: l, parentSchema: S, schemaCode: w, it: v } = i;
      if (!u && !l)
        return;
      const b = o.let("valid"), $ = S.items ? (0, r.getSchemaTypes)(S.items) : [];
      i.block$data(b, m, (0, e._)`${w} === false`), i.ok(b);
      function m() {
        const _ = o.let("i", (0, e._)`${c}.length`), f = o.let("j");
        i.setParams({ i: _, j: f }), o.assign(b, !0), o.if((0, e._)`${_} > 1`, () => (p() ? d : h)(_, f));
      }
      function p() {
        return $.length > 0 && !$.some((_) => _ === "object" || _ === "array");
      }
      function d(_, f) {
        const y = o.name("item"), k = (0, r.checkDataTypes)($, y, v.opts.strictNumbers, r.DataType.Wrong), N = o.const("indices", (0, e._)`{}`);
        o.for((0, e._)`;${_}--;`, () => {
          o.let(y, (0, e._)`${c}[${_}]`), o.if(k, (0, e._)`continue`), $.length > 1 && o.if((0, e._)`typeof ${y} == "string"`, (0, e._)`${y} += "_"`), o.if((0, e._)`typeof ${N}[${y}] == "number"`, () => {
            o.assign(f, (0, e._)`${N}[${y}]`), i.error(), o.assign(b, !1).break();
          }).code((0, e._)`${N}[${y}] = ${_}`);
        });
      }
      function h(_, f) {
        const y = (0, t.useFunc)(o, n.default), k = o.name("outer");
        o.label(k).for((0, e._)`;${_}--;`, () => o.for((0, e._)`${f} = ${_}; ${f}--;`, () => o.if((0, e._)`${y}(${c}[${_}], ${c}[${f}])`, () => {
          i.error(), o.assign(b, !1).break(k);
        })));
      }
    }
  };
  return Vr.default = a, Vr;
}
var Ur = {}, vi;
function xl() {
  if (vi) return Ur;
  vi = 1, Object.defineProperty(Ur, "__esModule", { value: !0 });
  const r = me(), e = we(), t = ia(), s = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: a }) => (0, r._)`{allowedValue: ${a}}`
    },
    code(a) {
      const { gen: i, data: o, $data: c, schemaCode: u, schema: l } = a;
      c || l && typeof l == "object" ? a.fail$data((0, r._)`!${(0, e.useFunc)(i, t.default)}(${o}, ${u})`) : a.fail((0, r._)`${l} !== ${o}`);
    }
  };
  return Ur.default = s, Ur;
}
var Hr = {}, bi;
function Nl() {
  if (bi) return Hr;
  bi = 1, Object.defineProperty(Hr, "__esModule", { value: !0 });
  const r = me(), e = we(), t = ia(), s = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: a }) => (0, r._)`{allowedValues: ${a}}`
    },
    code(a) {
      const { gen: i, data: o, $data: c, schema: u, schemaCode: l, it: S } = a;
      if (!c && u.length === 0)
        throw new Error("enum must have non-empty array");
      const w = u.length >= S.opts.loopEnum;
      let v;
      const b = () => v ?? (v = (0, e.useFunc)(i, t.default));
      let $;
      if (w || c)
        $ = i.let("valid"), a.block$data($, m);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const d = i.const("vSchema", l);
        $ = (0, r.or)(...u.map((h, _) => p(d, _)));
      }
      a.pass($);
      function m() {
        i.assign($, !1), i.forOf("v", l, (d) => i.if((0, r._)`${b()}(${o}, ${d})`, () => i.assign($, !0).break()));
      }
      function p(d, h) {
        const _ = u[h];
        return typeof _ == "object" && _ !== null ? (0, r._)`${b()}(${o}, ${d}[${h}])` : (0, r._)`${o} === ${_}`;
      }
    }
  };
  return Hr.default = s, Hr;
}
var wi;
function Ol() {
  if (wi) return Ir;
  wi = 1, Object.defineProperty(Ir, "__esModule", { value: !0 });
  const r = bl(), e = wl(), t = kl(), n = Sl(), s = Pl(), a = Rl(), i = Tl(), o = El(), c = xl(), u = Nl(), l = [
    // number
    r.default,
    e.default,
    // string
    t.default,
    n.default,
    // object
    s.default,
    a.default,
    // array
    i.default,
    o.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    c.default,
    u.default
  ];
  return Ir.default = l, Ir;
}
var Kr = {}, Xt = {}, $i;
function Ko() {
  if ($i) return Xt;
  $i = 1, Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.validateAdditionalItems = void 0;
  const r = me(), e = we(), n = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: a } }) => (0, r.str)`must NOT have more than ${a} items`,
      params: ({ params: { len: a } }) => (0, r._)`{limit: ${a}}`
    },
    code(a) {
      const { parentSchema: i, it: o } = a, { items: c } = i;
      if (!Array.isArray(c)) {
        (0, e.checkStrictMode)(o, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      s(a, c);
    }
  };
  function s(a, i) {
    const { gen: o, schema: c, data: u, keyword: l, it: S } = a;
    S.items = !0;
    const w = o.const("len", (0, r._)`${u}.length`);
    if (c === !1)
      a.setParams({ len: i.length }), a.pass((0, r._)`${w} <= ${i.length}`);
    else if (typeof c == "object" && !(0, e.alwaysValidSchema)(S, c)) {
      const b = o.var("valid", (0, r._)`${w} <= ${i.length}`);
      o.if((0, r.not)(b), () => v(b)), a.ok(b);
    }
    function v(b) {
      o.forRange("i", i.length, w, ($) => {
        a.subschema({ keyword: l, dataProp: $, dataPropType: e.Type.Num }, b), S.allErrors || o.if((0, r.not)(b), () => o.break());
      });
    }
  }
  return Xt.validateAdditionalItems = s, Xt.default = n, Xt;
}
var Br = {}, er = {}, ki;
function Bo() {
  if (ki) return er;
  ki = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.validateTuple = void 0;
  const r = me(), e = we(), t = mt(), n = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(a) {
      const { schema: i, it: o } = a;
      if (Array.isArray(i))
        return s(a, "additionalItems", i);
      o.items = !0, !(0, e.alwaysValidSchema)(o, i) && a.ok((0, t.validateArray)(a));
    }
  };
  function s(a, i, o = a.schema) {
    const { gen: c, parentSchema: u, data: l, keyword: S, it: w } = a;
    $(u), w.opts.unevaluated && o.length && w.items !== !0 && (w.items = e.mergeEvaluated.items(c, o.length, w.items));
    const v = c.name("valid"), b = c.const("len", (0, r._)`${l}.length`);
    o.forEach((m, p) => {
      (0, e.alwaysValidSchema)(w, m) || (c.if((0, r._)`${b} > ${p}`, () => a.subschema({
        keyword: S,
        schemaProp: p,
        dataProp: p
      }, v)), a.ok(v));
    });
    function $(m) {
      const { opts: p, errSchemaPath: d } = w, h = o.length, _ = h === m.minItems && (h === m.maxItems || m[i] === !1);
      if (p.strictTuples && !_) {
        const f = `"${S}" is ${h}-tuple, but minItems or maxItems/${i} are not specified or different at path "${d}"`;
        (0, e.checkStrictMode)(w, f, p.strictTuples);
      }
    }
  }
  return er.validateTuple = s, er.default = n, er;
}
var Si;
function Cl() {
  if (Si) return Br;
  Si = 1, Object.defineProperty(Br, "__esModule", { value: !0 });
  const r = Bo(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (t) => (0, r.validateTuple)(t, "items")
  };
  return Br.default = e, Br;
}
var Gr = {}, Pi;
function Il() {
  if (Pi) return Gr;
  Pi = 1, Object.defineProperty(Gr, "__esModule", { value: !0 });
  const r = me(), e = we(), t = mt(), n = Ko(), a = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, r.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, r._)`{limit: ${i}}`
    },
    code(i) {
      const { schema: o, parentSchema: c, it: u } = i, { prefixItems: l } = c;
      u.items = !0, !(0, e.alwaysValidSchema)(u, o) && (l ? (0, n.validateAdditionalItems)(i, l) : i.ok((0, t.validateArray)(i)));
    }
  };
  return Gr.default = a, Gr;
}
var Jr = {}, Ri;
function Al() {
  if (Ri) return Jr;
  Ri = 1, Object.defineProperty(Jr, "__esModule", { value: !0 });
  const r = me(), e = we(), n = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: s, max: a } }) => a === void 0 ? (0, r.str)`must contain at least ${s} valid item(s)` : (0, r.str)`must contain at least ${s} and no more than ${a} valid item(s)`,
      params: ({ params: { min: s, max: a } }) => a === void 0 ? (0, r._)`{minContains: ${s}}` : (0, r._)`{minContains: ${s}, maxContains: ${a}}`
    },
    code(s) {
      const { gen: a, schema: i, parentSchema: o, data: c, it: u } = s;
      let l, S;
      const { minContains: w, maxContains: v } = o;
      u.opts.next ? (l = w === void 0 ? 1 : w, S = v) : l = 1;
      const b = a.const("len", (0, r._)`${c}.length`);
      if (s.setParams({ min: l, max: S }), S === void 0 && l === 0) {
        (0, e.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (S !== void 0 && l > S) {
        (0, e.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), s.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(u, i)) {
        let h = (0, r._)`${b} >= ${l}`;
        S !== void 0 && (h = (0, r._)`${h} && ${b} <= ${S}`), s.pass(h);
        return;
      }
      u.items = !0;
      const $ = a.name("valid");
      S === void 0 && l === 1 ? p($, () => a.if($, () => a.break())) : l === 0 ? (a.let($, !0), S !== void 0 && a.if((0, r._)`${c}.length > 0`, m)) : (a.let($, !1), m()), s.result($, () => s.reset());
      function m() {
        const h = a.name("_valid"), _ = a.let("count", 0);
        p(h, () => a.if(h, () => d(_)));
      }
      function p(h, _) {
        a.forRange("i", 0, b, (f) => {
          s.subschema({
            keyword: "contains",
            dataProp: f,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, h), _();
        });
      }
      function d(h) {
        a.code((0, r._)`${h}++`), S === void 0 ? a.if((0, r._)`${h} >= ${l}`, () => a.assign($, !0).break()) : (a.if((0, r._)`${h} > ${S}`, () => a.assign($, !1).break()), l === 1 ? a.assign($, !0) : a.if((0, r._)`${h} >= ${l}`, () => a.assign($, !0)));
      }
    }
  };
  return Jr.default = n, Jr;
}
var cs = {}, Ti;
function jl() {
  return Ti || (Ti = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.validateSchemaDeps = r.validatePropertyDeps = r.error = void 0;
    const e = me(), t = we(), n = mt();
    r.error = {
      message: ({ params: { property: c, depsCount: u, deps: l } }) => {
        const S = u === 1 ? "property" : "properties";
        return (0, e.str)`must have ${S} ${l} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: u, deps: l, missingProperty: S } }) => (0, e._)`{property: ${c},
    missingProperty: ${S},
    depsCount: ${u},
    deps: ${l}}`
      // TODO change to reference
    };
    const s = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: r.error,
      code(c) {
        const [u, l] = a(c);
        i(c, u), o(c, l);
      }
    };
    function a({ schema: c }) {
      const u = {}, l = {};
      for (const S in c) {
        if (S === "__proto__")
          continue;
        const w = Array.isArray(c[S]) ? u : l;
        w[S] = c[S];
      }
      return [u, l];
    }
    function i(c, u = c.schema) {
      const { gen: l, data: S, it: w } = c;
      if (Object.keys(u).length === 0)
        return;
      const v = l.let("missing");
      for (const b in u) {
        const $ = u[b];
        if ($.length === 0)
          continue;
        const m = (0, n.propertyInData)(l, S, b, w.opts.ownProperties);
        c.setParams({
          property: b,
          depsCount: $.length,
          deps: $.join(", ")
        }), w.allErrors ? l.if(m, () => {
          for (const p of $)
            (0, n.checkReportMissingProp)(c, p);
        }) : (l.if((0, e._)`${m} && (${(0, n.checkMissingProp)(c, $, v)})`), (0, n.reportMissingProp)(c, v), l.else());
      }
    }
    r.validatePropertyDeps = i;
    function o(c, u = c.schema) {
      const { gen: l, data: S, keyword: w, it: v } = c, b = l.name("valid");
      for (const $ in u)
        (0, t.alwaysValidSchema)(v, u[$]) || (l.if(
          (0, n.propertyInData)(l, S, $, v.opts.ownProperties),
          () => {
            const m = c.subschema({ keyword: w, schemaProp: $ }, b);
            c.mergeValidEvaluated(m, b);
          },
          () => l.var(b, !0)
          // TODO var
        ), c.ok(b));
    }
    r.validateSchemaDeps = o, r.default = s;
  })(cs)), cs;
}
var Wr = {}, Ei;
function Ml() {
  if (Ei) return Wr;
  Ei = 1, Object.defineProperty(Wr, "__esModule", { value: !0 });
  const r = me(), e = we(), n = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: s }) => (0, r._)`{propertyName: ${s.propertyName}}`
    },
    code(s) {
      const { gen: a, schema: i, data: o, it: c } = s;
      if ((0, e.alwaysValidSchema)(c, i))
        return;
      const u = a.name("valid");
      a.forIn("key", o, (l) => {
        s.setParams({ propertyName: l }), s.subschema({
          keyword: "propertyNames",
          data: l,
          dataTypes: ["string"],
          propertyName: l,
          compositeRule: !0
        }, u), a.if((0, r.not)(u), () => {
          s.error(!0), c.allErrors || a.break();
        });
      }), s.ok(u);
    }
  };
  return Wr.default = n, Wr;
}
var Qr = {}, xi;
function Go() {
  if (xi) return Qr;
  xi = 1, Object.defineProperty(Qr, "__esModule", { value: !0 });
  const r = mt(), e = me(), t = zt(), n = we(), a = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: i }) => (0, e._)`{additionalProperty: ${i.additionalProperty}}`
    },
    code(i) {
      const { gen: o, schema: c, parentSchema: u, data: l, errsCount: S, it: w } = i;
      if (!S)
        throw new Error("ajv implementation error");
      const { allErrors: v, opts: b } = w;
      if (w.props = !0, b.removeAdditional !== "all" && (0, n.alwaysValidSchema)(w, c))
        return;
      const $ = (0, r.allSchemaProperties)(u.properties), m = (0, r.allSchemaProperties)(u.patternProperties);
      p(), i.ok((0, e._)`${S} === ${t.default.errors}`);
      function p() {
        o.forIn("key", l, (y) => {
          !$.length && !m.length ? _(y) : o.if(d(y), () => _(y));
        });
      }
      function d(y) {
        let k;
        if ($.length > 8) {
          const N = (0, n.schemaRefOrVal)(w, u.properties, "properties");
          k = (0, r.isOwnProperty)(o, N, y);
        } else $.length ? k = (0, e.or)(...$.map((N) => (0, e._)`${y} === ${N}`)) : k = e.nil;
        return m.length && (k = (0, e.or)(k, ...m.map((N) => (0, e._)`${(0, r.usePattern)(i, N)}.test(${y})`))), (0, e.not)(k);
      }
      function h(y) {
        o.code((0, e._)`delete ${l}[${y}]`);
      }
      function _(y) {
        if (b.removeAdditional === "all" || b.removeAdditional && c === !1) {
          h(y);
          return;
        }
        if (c === !1) {
          i.setParams({ additionalProperty: y }), i.error(), v || o.break();
          return;
        }
        if (typeof c == "object" && !(0, n.alwaysValidSchema)(w, c)) {
          const k = o.name("valid");
          b.removeAdditional === "failing" ? (f(y, k, !1), o.if((0, e.not)(k), () => {
            i.reset(), h(y);
          })) : (f(y, k), v || o.if((0, e.not)(k), () => o.break()));
        }
      }
      function f(y, k, N) {
        const z = {
          keyword: "additionalProperties",
          dataProp: y,
          dataPropType: n.Type.Str
        };
        N === !1 && Object.assign(z, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), i.subschema(z, k);
      }
    }
  };
  return Qr.default = a, Qr;
}
var Yr = {}, Ni;
function ql() {
  if (Ni) return Yr;
  Ni = 1, Object.defineProperty(Yr, "__esModule", { value: !0 });
  const r = Kn(), e = mt(), t = we(), n = Go(), s = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(a) {
      const { gen: i, schema: o, parentSchema: c, data: u, it: l } = a;
      l.opts.removeAdditional === "all" && c.additionalProperties === void 0 && n.default.code(new r.KeywordCxt(l, n.default, "additionalProperties"));
      const S = (0, e.allSchemaProperties)(o);
      for (const m of S)
        l.definedProperties.add(m);
      l.opts.unevaluated && S.length && l.props !== !0 && (l.props = t.mergeEvaluated.props(i, (0, t.toHash)(S), l.props));
      const w = S.filter((m) => !(0, t.alwaysValidSchema)(l, o[m]));
      if (w.length === 0)
        return;
      const v = i.name("valid");
      for (const m of w)
        b(m) ? $(m) : (i.if((0, e.propertyInData)(i, u, m, l.opts.ownProperties)), $(m), l.allErrors || i.else().var(v, !0), i.endIf()), a.it.definedProperties.add(m), a.ok(v);
      function b(m) {
        return l.opts.useDefaults && !l.compositeRule && o[m].default !== void 0;
      }
      function $(m) {
        a.subschema({
          keyword: "properties",
          schemaProp: m,
          dataProp: m
        }, v);
      }
    }
  };
  return Yr.default = s, Yr;
}
var Xr = {}, Oi;
function Dl() {
  if (Oi) return Xr;
  Oi = 1, Object.defineProperty(Xr, "__esModule", { value: !0 });
  const r = mt(), e = me(), t = we(), n = we(), s = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(a) {
      const { gen: i, schema: o, data: c, parentSchema: u, it: l } = a, { opts: S } = l, w = (0, r.allSchemaProperties)(o), v = w.filter((_) => (0, t.alwaysValidSchema)(l, o[_]));
      if (w.length === 0 || v.length === w.length && (!l.opts.unevaluated || l.props === !0))
        return;
      const b = S.strictSchema && !S.allowMatchingProperties && u.properties, $ = i.name("valid");
      l.props !== !0 && !(l.props instanceof e.Name) && (l.props = (0, n.evaluatedPropsToName)(i, l.props));
      const { props: m } = l;
      p();
      function p() {
        for (const _ of w)
          b && d(_), l.allErrors ? h(_) : (i.var($, !0), h(_), i.if($));
      }
      function d(_) {
        for (const f in b)
          new RegExp(_).test(f) && (0, t.checkStrictMode)(l, `property ${f} matches pattern ${_} (use allowMatchingProperties)`);
      }
      function h(_) {
        i.forIn("key", c, (f) => {
          i.if((0, e._)`${(0, r.usePattern)(a, _)}.test(${f})`, () => {
            const y = v.includes(_);
            y || a.subschema({
              keyword: "patternProperties",
              schemaProp: _,
              dataProp: f,
              dataPropType: n.Type.Str
            }, $), l.opts.unevaluated && m !== !0 ? i.assign((0, e._)`${m}[${f}]`, !0) : !y && !l.allErrors && i.if((0, e.not)($), () => i.break());
          });
        });
      }
    }
  };
  return Xr.default = s, Xr;
}
var en = {}, Ci;
function Zl() {
  if (Ci) return en;
  Ci = 1, Object.defineProperty(en, "__esModule", { value: !0 });
  const r = we(), e = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(t) {
      const { gen: n, schema: s, it: a } = t;
      if ((0, r.alwaysValidSchema)(a, s)) {
        t.fail();
        return;
      }
      const i = n.name("valid");
      t.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i), t.failResult(i, () => t.reset(), () => t.error());
    },
    error: { message: "must NOT be valid" }
  };
  return en.default = e, en;
}
var tn = {}, Ii;
function zl() {
  if (Ii) return tn;
  Ii = 1, Object.defineProperty(tn, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: mt().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return tn.default = e, tn;
}
var rn = {}, Ai;
function Ll() {
  if (Ai) return rn;
  Ai = 1, Object.defineProperty(rn, "__esModule", { value: !0 });
  const r = me(), e = we(), n = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: s }) => (0, r._)`{passingSchemas: ${s.passing}}`
    },
    code(s) {
      const { gen: a, schema: i, parentSchema: o, it: c } = s;
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && o.discriminator)
        return;
      const u = i, l = a.let("valid", !1), S = a.let("passing", null), w = a.name("_valid");
      s.setParams({ passing: S }), a.block(v), s.result(l, () => s.reset(), () => s.error(!0));
      function v() {
        u.forEach((b, $) => {
          let m;
          (0, e.alwaysValidSchema)(c, b) ? a.var(w, !0) : m = s.subschema({
            keyword: "oneOf",
            schemaProp: $,
            compositeRule: !0
          }, w), $ > 0 && a.if((0, r._)`${w} && ${l}`).assign(l, !1).assign(S, (0, r._)`[${S}, ${$}]`).else(), a.if(w, () => {
            a.assign(l, !0), a.assign(S, $), m && s.mergeEvaluated(m, r.Name);
          });
        });
      }
    }
  };
  return rn.default = n, rn;
}
var nn = {}, ji;
function Vl() {
  if (ji) return nn;
  ji = 1, Object.defineProperty(nn, "__esModule", { value: !0 });
  const r = we(), e = {
    keyword: "allOf",
    schemaType: "array",
    code(t) {
      const { gen: n, schema: s, it: a } = t;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const i = n.name("valid");
      s.forEach((o, c) => {
        if ((0, r.alwaysValidSchema)(a, o))
          return;
        const u = t.subschema({ keyword: "allOf", schemaProp: c }, i);
        t.ok(i), t.mergeEvaluated(u);
      });
    }
  };
  return nn.default = e, nn;
}
var sn = {}, Mi;
function Fl() {
  if (Mi) return sn;
  Mi = 1, Object.defineProperty(sn, "__esModule", { value: !0 });
  const r = me(), e = we(), n = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: a }) => (0, r.str)`must match "${a.ifClause}" schema`,
      params: ({ params: a }) => (0, r._)`{failingKeyword: ${a.ifClause}}`
    },
    code(a) {
      const { gen: i, parentSchema: o, it: c } = a;
      o.then === void 0 && o.else === void 0 && (0, e.checkStrictMode)(c, '"if" without "then" and "else" is ignored');
      const u = s(c, "then"), l = s(c, "else");
      if (!u && !l)
        return;
      const S = i.let("valid", !0), w = i.name("_valid");
      if (v(), a.reset(), u && l) {
        const $ = i.let("ifClause");
        a.setParams({ ifClause: $ }), i.if(w, b("then", $), b("else", $));
      } else u ? i.if(w, b("then")) : i.if((0, r.not)(w), b("else"));
      a.pass(S, () => a.error(!0));
      function v() {
        const $ = a.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, w);
        a.mergeEvaluated($);
      }
      function b($, m) {
        return () => {
          const p = a.subschema({ keyword: $ }, w);
          i.assign(S, w), a.mergeValidEvaluated(p, S), m ? i.assign(m, (0, r._)`${$}`) : a.setParams({ ifClause: $ });
        };
      }
    }
  };
  function s(a, i) {
    const o = a.schema[i];
    return o !== void 0 && !(0, e.alwaysValidSchema)(a, o);
  }
  return sn.default = n, sn;
}
var an = {}, qi;
function Ul() {
  if (qi) return an;
  qi = 1, Object.defineProperty(an, "__esModule", { value: !0 });
  const r = we(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: n, it: s }) {
      n.if === void 0 && (0, r.checkStrictMode)(s, `"${t}" without "if" is ignored`);
    }
  };
  return an.default = e, an;
}
var Di;
function Hl() {
  if (Di) return Kr;
  Di = 1, Object.defineProperty(Kr, "__esModule", { value: !0 });
  const r = Ko(), e = Cl(), t = Bo(), n = Il(), s = Al(), a = jl(), i = Ml(), o = Go(), c = ql(), u = Dl(), l = Zl(), S = zl(), w = Ll(), v = Vl(), b = Fl(), $ = Ul();
  function m(p = !1) {
    const d = [
      // any
      l.default,
      S.default,
      w.default,
      v.default,
      b.default,
      $.default,
      // object
      i.default,
      o.default,
      a.default,
      c.default,
      u.default
    ];
    return p ? d.push(e.default, n.default) : d.push(r.default, t.default), d.push(s.default), d;
  }
  return Kr.default = m, Kr;
}
var on = {}, cn = {}, Zi;
function Kl() {
  if (Zi) return cn;
  Zi = 1, Object.defineProperty(cn, "__esModule", { value: !0 });
  const r = me(), t = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, r.str)`must match format "${n}"`,
      params: ({ schemaCode: n }) => (0, r._)`{format: ${n}}`
    },
    code(n, s) {
      const { gen: a, data: i, $data: o, schema: c, schemaCode: u, it: l } = n, { opts: S, errSchemaPath: w, schemaEnv: v, self: b } = l;
      if (!S.validateFormats)
        return;
      o ? $() : m();
      function $() {
        const p = a.scopeValue("formats", {
          ref: b.formats,
          code: S.code.formats
        }), d = a.const("fDef", (0, r._)`${p}[${u}]`), h = a.let("fType"), _ = a.let("format");
        a.if((0, r._)`typeof ${d} == "object" && !(${d} instanceof RegExp)`, () => a.assign(h, (0, r._)`${d}.type || "string"`).assign(_, (0, r._)`${d}.validate`), () => a.assign(h, (0, r._)`"string"`).assign(_, d)), n.fail$data((0, r.or)(f(), y()));
        function f() {
          return S.strictSchema === !1 ? r.nil : (0, r._)`${u} && !${_}`;
        }
        function y() {
          const k = v.$async ? (0, r._)`(${d}.async ? await ${_}(${i}) : ${_}(${i}))` : (0, r._)`${_}(${i})`, N = (0, r._)`(typeof ${_} == "function" ? ${k} : ${_}.test(${i}))`;
          return (0, r._)`${_} && ${_} !== true && ${h} === ${s} && !${N}`;
        }
      }
      function m() {
        const p = b.formats[c];
        if (!p) {
          f();
          return;
        }
        if (p === !0)
          return;
        const [d, h, _] = y(p);
        d === s && n.pass(k());
        function f() {
          if (S.strictSchema === !1) {
            b.logger.warn(N());
            return;
          }
          throw new Error(N());
          function N() {
            return `unknown format "${c}" ignored in schema at path "${w}"`;
          }
        }
        function y(N) {
          const z = N instanceof RegExp ? (0, r.regexpCode)(N) : S.code.formats ? (0, r._)`${S.code.formats}${(0, r.getProperty)(c)}` : void 0, J = a.scopeValue("formats", { key: c, ref: N, code: z });
          return typeof N == "object" && !(N instanceof RegExp) ? [N.type || "string", N.validate, (0, r._)`${J}.validate`] : ["string", N, J];
        }
        function k() {
          if (typeof p == "object" && !(p instanceof RegExp) && p.async) {
            if (!v.$async)
              throw new Error("async format in sync schema");
            return (0, r._)`await ${_}(${i})`;
          }
          return typeof h == "function" ? (0, r._)`${_}(${i})` : (0, r._)`${_}.test(${i})`;
        }
      }
    }
  };
  return cn.default = t, cn;
}
var zi;
function Bl() {
  if (zi) return on;
  zi = 1, Object.defineProperty(on, "__esModule", { value: !0 });
  const e = [Kl().default];
  return on.default = e, on;
}
var Ft = {}, Li;
function Gl() {
  return Li || (Li = 1, Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.contentVocabulary = Ft.metadataVocabulary = void 0, Ft.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Ft.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Ft;
}
var Vi;
function Jl() {
  if (Vi) return Nr;
  Vi = 1, Object.defineProperty(Nr, "__esModule", { value: !0 });
  const r = vl(), e = Ol(), t = Hl(), n = Bl(), s = Gl(), a = [
    r.default,
    e.default,
    (0, t.default)(),
    n.default,
    s.metadataVocabulary,
    s.contentVocabulary
  ];
  return Nr.default = a, Nr;
}
var un = {}, lr = {}, Fi;
function Wl() {
  if (Fi) return lr;
  Fi = 1, Object.defineProperty(lr, "__esModule", { value: !0 }), lr.DiscrError = void 0;
  var r;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(r || (lr.DiscrError = r = {})), lr;
}
var Ui;
function Ql() {
  if (Ui) return un;
  Ui = 1, Object.defineProperty(un, "__esModule", { value: !0 });
  const r = me(), e = Wl(), t = aa(), n = Bn(), s = we(), i = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: o, tagName: c } }) => o === e.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: o, tag: c, tagName: u } }) => (0, r._)`{error: ${o}, tag: ${u}, tagValue: ${c}}`
    },
    code(o) {
      const { gen: c, data: u, schema: l, parentSchema: S, it: w } = o, { oneOf: v } = S;
      if (!w.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const b = l.propertyName;
      if (typeof b != "string")
        throw new Error("discriminator: requires propertyName");
      if (l.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!v)
        throw new Error("discriminator: requires oneOf keyword");
      const $ = c.let("valid", !1), m = c.const("tag", (0, r._)`${u}${(0, r.getProperty)(b)}`);
      c.if((0, r._)`typeof ${m} == "string"`, () => p(), () => o.error(!1, { discrError: e.DiscrError.Tag, tag: m, tagName: b })), o.ok($);
      function p() {
        const _ = h();
        c.if(!1);
        for (const f in _)
          c.elseIf((0, r._)`${m} === ${f}`), c.assign($, d(_[f]));
        c.else(), o.error(!1, { discrError: e.DiscrError.Mapping, tag: m, tagName: b }), c.endIf();
      }
      function d(_) {
        const f = c.name("valid"), y = o.subschema({ keyword: "oneOf", schemaProp: _ }, f);
        return o.mergeEvaluated(y, r.Name), f;
      }
      function h() {
        var _;
        const f = {}, y = N(S);
        let k = !0;
        for (let C = 0; C < v.length; C++) {
          let U = v[C];
          if (U != null && U.$ref && !(0, s.schemaHasRulesButRef)(U, w.self.RULES)) {
            const ee = U.$ref;
            if (U = t.resolveRef.call(w.self, w.schemaEnv.root, w.baseId, ee), U instanceof t.SchemaEnv && (U = U.schema), U === void 0)
              throw new n.default(w.opts.uriResolver, w.baseId, ee);
          }
          const W = (_ = U == null ? void 0 : U.properties) === null || _ === void 0 ? void 0 : _[b];
          if (typeof W != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${b}"`);
          k = k && (y || N(U)), z(W, C);
        }
        if (!k)
          throw new Error(`discriminator: "${b}" must be required`);
        return f;
        function N({ required: C }) {
          return Array.isArray(C) && C.includes(b);
        }
        function z(C, U) {
          if (C.const)
            J(C.const, U);
          else if (C.enum)
            for (const W of C.enum)
              J(W, U);
          else
            throw new Error(`discriminator: "properties/${b}" must have "const" or "enum"`);
        }
        function J(C, U) {
          if (typeof C != "string" || C in f)
            throw new Error(`discriminator: "${b}" values must be unique strings`);
          f[C] = U;
        }
      }
    }
  };
  return un.default = i, un;
}
const Yl = "http://json-schema.org/draft-07/schema#", Xl = "http://json-schema.org/draft-07/schema#", ef = "Core schema meta-schema", tf = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, rf = ["object", "boolean"], nf = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, sf = {
  $schema: Yl,
  $id: Xl,
  title: ef,
  definitions: tf,
  type: rf,
  properties: nf,
  default: !0
};
var Hi;
function Jo() {
  return Hi || (Hi = 1, (function(r, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const t = gl(), n = Jl(), s = Ql(), a = sf, i = ["/properties"], o = "http://json-schema.org/draft-07/schema";
    class c extends t.default {
      _addVocabularies() {
        super._addVocabularies(), n.default.forEach((b) => this.addVocabulary(b)), this.opts.discriminator && this.addKeyword(s.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const b = this.opts.$data ? this.$dataMetaSchema(a, i) : a;
        this.addMetaSchema(b, o, !1), this.refs["http://json-schema.org/schema"] = o;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
      }
    }
    e.Ajv = c, r.exports = e = c, r.exports.Ajv = c, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = c;
    var u = Kn();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return u.KeywordCxt;
    } });
    var l = me();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return l._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return l.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return l.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return l.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return l.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return l.CodeGen;
    } });
    var S = sa();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return S.default;
    } });
    var w = Bn();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return w.default;
    } });
  })(Pr, Pr.exports)), Pr.exports;
}
var af = Jo(), dn = { exports: {} }, us = {}, Ki;
function of() {
  return Ki || (Ki = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.formatNames = r.fastFormats = r.fullFormats = void 0;
    function e(C, U) {
      return { validate: C, compare: U };
    }
    r.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: e(a, i),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: e(c(!0), u),
      "date-time": e(w(!0), v),
      "iso-time": e(c(), l),
      "iso-date-time": e(w(), b),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri: p,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex: J,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte: h,
      // signed 32 bit integer
      int32: { type: "number", validate: y },
      // signed 64 bit integer
      int64: { type: "number", validate: k },
      // C-type float
      float: { type: "number", validate: N },
      // C-type double
      double: { type: "number", validate: N },
      // hint to the UI to hide input strings
      password: !0,
      // unchecked string payload
      binary: !0
    }, r.fastFormats = {
      ...r.fullFormats,
      date: e(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, i),
      time: e(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, u),
      "date-time": e(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, v),
      "iso-time": e(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
      "iso-date-time": e(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, b),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    }, r.formatNames = Object.keys(r.fullFormats);
    function t(C) {
      return C % 4 === 0 && (C % 100 !== 0 || C % 400 === 0);
    }
    const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function a(C) {
      const U = n.exec(C);
      if (!U)
        return !1;
      const W = +U[1], ee = +U[2], Se = +U[3];
      return ee >= 1 && ee <= 12 && Se >= 1 && Se <= (ee === 2 && t(W) ? 29 : s[ee]);
    }
    function i(C, U) {
      if (C && U)
        return C > U ? 1 : C < U ? -1 : 0;
    }
    const o = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function c(C) {
      return function(W) {
        const ee = o.exec(W);
        if (!ee)
          return !1;
        const Se = +ee[1], ze = +ee[2], Le = +ee[3], Te = ee[4], ut = ee[5] === "-" ? -1 : 1, L = +(ee[6] || 0), T = +(ee[7] || 0);
        if (L > 23 || T > 59 || C && !Te)
          return !1;
        if (Se <= 23 && ze <= 59 && Le < 60)
          return !0;
        const A = ze - T * ut, x = Se - L * ut - (A < 0 ? 1 : 0);
        return (x === 23 || x === -1) && (A === 59 || A === -1) && Le < 61;
      };
    }
    function u(C, U) {
      if (!(C && U))
        return;
      const W = (/* @__PURE__ */ new Date("2020-01-01T" + C)).valueOf(), ee = (/* @__PURE__ */ new Date("2020-01-01T" + U)).valueOf();
      if (W && ee)
        return W - ee;
    }
    function l(C, U) {
      if (!(C && U))
        return;
      const W = o.exec(C), ee = o.exec(U);
      if (W && ee)
        return C = W[1] + W[2] + W[3], U = ee[1] + ee[2] + ee[3], C > U ? 1 : C < U ? -1 : 0;
    }
    const S = /t|\s/i;
    function w(C) {
      const U = c(C);
      return function(ee) {
        const Se = ee.split(S);
        return Se.length === 2 && a(Se[0]) && U(Se[1]);
      };
    }
    function v(C, U) {
      if (!(C && U))
        return;
      const W = new Date(C).valueOf(), ee = new Date(U).valueOf();
      if (W && ee)
        return W - ee;
    }
    function b(C, U) {
      if (!(C && U))
        return;
      const [W, ee] = C.split(S), [Se, ze] = U.split(S), Le = i(W, Se);
      if (Le !== void 0)
        return Le || u(ee, ze);
    }
    const $ = /\/|:/, m = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function p(C) {
      return $.test(C) && m.test(C);
    }
    const d = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function h(C) {
      return d.lastIndex = 0, d.test(C);
    }
    const _ = -2147483648, f = 2 ** 31 - 1;
    function y(C) {
      return Number.isInteger(C) && C <= f && C >= _;
    }
    function k(C) {
      return Number.isInteger(C);
    }
    function N() {
      return !0;
    }
    const z = /[^\\]\\Z/;
    function J(C) {
      if (z.test(C))
        return !1;
      try {
        return new RegExp(C), !0;
      } catch {
        return !1;
      }
    }
  })(us)), us;
}
var ds = {}, Bi;
function cf() {
  return Bi || (Bi = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.formatLimitDefinition = void 0;
    const e = Jo(), t = me(), n = t.operators, s = {
      formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
      formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
      formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
    }, a = {
      message: ({ keyword: o, schemaCode: c }) => (0, t.str)`should be ${s[o].okStr} ${c}`,
      params: ({ keyword: o, schemaCode: c }) => (0, t._)`{comparison: ${s[o].okStr}, limit: ${c}}`
    };
    r.formatLimitDefinition = {
      keyword: Object.keys(s),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: a,
      code(o) {
        const { gen: c, data: u, schemaCode: l, keyword: S, it: w } = o, { opts: v, self: b } = w;
        if (!v.validateFormats)
          return;
        const $ = new e.KeywordCxt(w, b.RULES.all.format.definition, "format");
        $.$data ? m() : p();
        function m() {
          const h = c.scopeValue("formats", {
            ref: b.formats,
            code: v.code.formats
          }), _ = c.const("fmt", (0, t._)`${h}[${$.schemaCode}]`);
          o.fail$data((0, t.or)((0, t._)`typeof ${_} != "object"`, (0, t._)`${_} instanceof RegExp`, (0, t._)`typeof ${_}.compare != "function"`, d(_)));
        }
        function p() {
          const h = $.schema, _ = b.formats[h];
          if (!_ || _ === !0)
            return;
          if (typeof _ != "object" || _ instanceof RegExp || typeof _.compare != "function")
            throw new Error(`"${S}": format "${h}" does not define "compare" function`);
          const f = c.scopeValue("formats", {
            key: h,
            ref: _,
            code: v.code.formats ? (0, t._)`${v.code.formats}${(0, t.getProperty)(h)}` : void 0
          });
          o.fail$data(d(f));
        }
        function d(h) {
          return (0, t._)`${h}.compare(${u}, ${l}) ${s[S].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const i = (o) => (o.addKeyword(r.formatLimitDefinition), o);
    r.default = i;
  })(ds)), ds;
}
var Gi;
function uf() {
  return Gi || (Gi = 1, (function(r, e) {
    Object.defineProperty(e, "__esModule", { value: !0 });
    const t = of(), n = cf(), s = me(), a = new s.Name("fullFormats"), i = new s.Name("fastFormats"), o = (u, l = { keywords: !0 }) => {
      if (Array.isArray(l))
        return c(u, l, t.fullFormats, a), u;
      const [S, w] = l.mode === "fast" ? [t.fastFormats, i] : [t.fullFormats, a], v = l.formats || t.formatNames;
      return c(u, v, S, w), l.keywords && (0, n.default)(u), u;
    };
    o.get = (u, l = "full") => {
      const w = (l === "fast" ? t.fastFormats : t.fullFormats)[u];
      if (!w)
        throw new Error(`Unknown format "${u}"`);
      return w;
    };
    function c(u, l, S, w) {
      var v, b;
      (v = (b = u.opts.code).formats) !== null && v !== void 0 || (b.formats = (0, s._)`require("ajv-formats/dist/formats").${w}`);
      for (const $ of l)
        u.addFormat($, S[$]);
    }
    r.exports = e = o, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = o;
  })(dn, dn.exports)), dn.exports;
}
var df = uf();
const lf = /* @__PURE__ */ el(df);
function ff() {
  const r = new af.Ajv({
    strict: !1,
    validateFormats: !0,
    validateSchema: !1,
    allErrors: !0
  });
  return lf(r), r;
}
class hf {
  /**
   * Create an AJV validator
   *
   * @param ajv - Optional pre-configured AJV instance. If not provided, a default instance will be created.
   *
   * @example
   * ```typescript
   * // Use default configuration (recommended for most cases)
   * import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
   * const validator = new AjvJsonSchemaValidator();
   *
   * // Or provide custom AJV instance for advanced configuration
   * import { Ajv } from 'ajv';
   * import addFormats from 'ajv-formats';
   *
   * const ajv = new Ajv({ validateFormats: true });
   * addFormats(ajv);
   * const validator = new AjvJsonSchemaValidator(ajv);
   * ```
   */
  constructor(e) {
    this._ajv = e ?? ff();
  }
  /**
   * Create a validator for the given JSON Schema
   *
   * The validator is compiled once and can be reused multiple times.
   * If the schema has an $id, it will be cached by AJV automatically.
   *
   * @param schema - Standard JSON Schema object
   * @returns A validator function that validates input data
   */
  getValidator(e) {
    var t;
    const n = "$id" in e && typeof e.$id == "string" ? (t = this._ajv.getSchema(e.$id)) !== null && t !== void 0 ? t : this._ajv.compile(e) : this._ajv.compile(e);
    return (s) => n(s) ? {
      valid: !0,
      data: s,
      errorMessage: void 0
    } : {
      valid: !1,
      data: void 0,
      errorMessage: this._ajv.errorsText(n.errors)
    };
  }
}
class mf extends Yd {
  /**
   * Initializes this server with the given name and version information.
   */
  constructor(e, t) {
    var n, s;
    super(t), this._serverInfo = e, this._loggingLevels = /* @__PURE__ */ new Map(), this.LOG_LEVEL_SEVERITY = new Map(On.options.map((a, i) => [a, i])), this.isMessageIgnored = (a, i) => {
      const o = this._loggingLevels.get(i);
      return o ? this.LOG_LEVEL_SEVERITY.get(a) < this.LOG_LEVEL_SEVERITY.get(o) : !1;
    }, this._capabilities = (n = t == null ? void 0 : t.capabilities) !== null && n !== void 0 ? n : {}, this._instructions = t == null ? void 0 : t.instructions, this._jsonSchemaValidator = (s = t == null ? void 0 : t.jsonSchemaValidator) !== null && s !== void 0 ? s : new hf(), this.setRequestHandler(No, (a) => this._oninitialize(a)), this.setNotificationHandler(Oo, () => {
      var a;
      return (a = this.oninitialized) === null || a === void 0 ? void 0 : a.call(this);
    }), this._capabilities.logging && this.setRequestHandler(Do, async (a, i) => {
      var o;
      const c = i.sessionId || ((o = i.requestInfo) === null || o === void 0 ? void 0 : o.headers["mcp-session-id"]) || void 0, { level: u } = a.params, l = On.safeParse(u);
      return l.success && this._loggingLevels.set(c, l.data), {};
    });
  }
  /**
   * Registers new capabilities. This can only be called before connecting to a transport.
   *
   * The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
   */
  registerCapabilities(e) {
    if (this.transport)
      throw new Error("Cannot register capabilities after connecting to transport");
    this._capabilities = Xd(this._capabilities, e);
  }
  assertCapabilityForMethod(e) {
    var t, n, s;
    switch (e) {
      case "sampling/createMessage":
        if (!(!((t = this._clientCapabilities) === null || t === void 0) && t.sampling))
          throw new Error(`Client does not support sampling (required for ${e})`);
        break;
      case "elicitation/create":
        if (!(!((n = this._clientCapabilities) === null || n === void 0) && n.elicitation))
          throw new Error(`Client does not support elicitation (required for ${e})`);
        break;
      case "roots/list":
        if (!(!((s = this._clientCapabilities) === null || s === void 0) && s.roots))
          throw new Error(`Client does not support listing roots (required for ${e})`);
        break;
    }
  }
  assertNotificationCapability(e) {
    switch (e) {
      case "notifications/message":
        if (!this._capabilities.logging)
          throw new Error(`Server does not support logging (required for ${e})`);
        break;
      case "notifications/resources/updated":
      case "notifications/resources/list_changed":
        if (!this._capabilities.resources)
          throw new Error(`Server does not support notifying about resources (required for ${e})`);
        break;
      case "notifications/tools/list_changed":
        if (!this._capabilities.tools)
          throw new Error(`Server does not support notifying of tool list changes (required for ${e})`);
        break;
      case "notifications/prompts/list_changed":
        if (!this._capabilities.prompts)
          throw new Error(`Server does not support notifying of prompt list changes (required for ${e})`);
        break;
    }
  }
  assertRequestHandlerCapability(e) {
    switch (e) {
      case "sampling/createMessage":
        if (!this._capabilities.sampling)
          throw new Error(`Server does not support sampling (required for ${e})`);
        break;
      case "logging/setLevel":
        if (!this._capabilities.logging)
          throw new Error(`Server does not support logging (required for ${e})`);
        break;
      case "prompts/get":
      case "prompts/list":
        if (!this._capabilities.prompts)
          throw new Error(`Server does not support prompts (required for ${e})`);
        break;
      case "resources/list":
      case "resources/templates/list":
      case "resources/read":
        if (!this._capabilities.resources)
          throw new Error(`Server does not support resources (required for ${e})`);
        break;
      case "tools/call":
      case "tools/list":
        if (!this._capabilities.tools)
          throw new Error(`Server does not support tools (required for ${e})`);
        break;
    }
  }
  async _oninitialize(e) {
    const t = e.params.protocolVersion;
    return this._clientCapabilities = e.params.capabilities, this._clientVersion = e.params.clientInfo, {
      protocolVersion: sd.includes(t) ? t : $o,
      capabilities: this.getCapabilities(),
      serverInfo: this._serverInfo,
      ...this._instructions && { instructions: this._instructions }
    };
  }
  /**
   * After initialization has completed, this will be populated with the client's reported capabilities.
   */
  getClientCapabilities() {
    return this._clientCapabilities;
  }
  /**
   * After initialization has completed, this will be populated with information about the client's name and version.
   */
  getClientVersion() {
    return this._clientVersion;
  }
  getCapabilities() {
    return this._capabilities;
  }
  async ping() {
    return this.request({ method: "ping" }, Ws);
  }
  async createMessage(e, t) {
    return this.request({ method: "sampling/createMessage", params: e }, Zo, t);
  }
  async elicitInput(e, t) {
    const n = await this.request({ method: "elicitation/create", params: e }, zo, t);
    if (n.action === "accept" && n.content && e.requestedSchema)
      try {
        const a = this._jsonSchemaValidator.getValidator(e.requestedSchema)(n.content);
        if (!a.valid)
          throw new Ne(xe.InvalidParams, `Elicitation response content does not match requested schema: ${a.errorMessage}`);
      } catch (s) {
        throw s instanceof Ne ? s : new Ne(xe.InternalError, `Error validating elicitation response: ${s instanceof Error ? s.message : String(s)}`);
      }
    return n;
  }
  async listRoots(e, t) {
    return this.request({ method: "roots/list", params: e }, Lo, t);
  }
  /**
   * Sends a logging message to the client, if connected.
   * Note: You only need to send the parameters object, not the entire JSON RPC message
   * @see LoggingMessageNotification
   * @param params
   * @param sessionId optional for stateless and backward compatibility
   */
  async sendLoggingMessage(e, t) {
    if (this._capabilities.logging && !this.isMessageIgnored(e.level, t))
      return this.notification({ method: "notifications/message", params: e });
  }
  async sendResourceUpdated(e) {
    return this.notification({
      method: "notifications/resources/updated",
      params: e
    });
  }
  async sendResourceListChanged() {
    return this.notification({
      method: "notifications/resources/list_changed"
    });
  }
  async sendToolListChanged() {
    return this.notification({ method: "notifications/tools/list_changed" });
  }
  async sendPromptListChanged() {
    return this.notification({ method: "notifications/prompts/list_changed" });
  }
}
const pf = Symbol("Let zodToJsonSchema decide on which parser to use"), Ji = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: !0,
  rejectedAdditionalProperties: !1,
  definitionPath: "definitions",
  target: "jsonSchema7",
  strictUnions: !1,
  definitions: {},
  errorMessages: !1,
  markdownDescription: !1,
  patternStrategy: "escape",
  applyRegexFlags: !1,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref",
  openAiAnyTypeName: "OpenAiAnyType"
}, gf = (r) => typeof r == "string" ? {
  ...Ji,
  name: r
} : {
  ...Ji,
  ...r
}, yf = (r) => {
  const e = gf(r), t = e.name !== void 0 ? [...e.basePath, e.definitionPath, e.name] : e.basePath;
  return {
    ...e,
    flags: { hasReferencedOpenAiAnyType: !1 },
    currentPath: t,
    propertyPath: void 0,
    seen: new Map(Object.entries(e.definitions).map(([n, s]) => [
      s._def,
      {
        def: s._def,
        path: [...e.basePath, e.definitionPath, n],
        // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
        jsonSchema: void 0
      }
    ]))
  };
};
function Wo(r, e, t, n) {
  n != null && n.errorMessages && t && (r.errorMessage = {
    ...r.errorMessage,
    [e]: t
  });
}
function Re(r, e, t, n, s) {
  r[e] = t, Wo(r, e, n, s);
}
const Qo = (r, e) => {
  let t = 0;
  for (; t < r.length && t < e.length && r[t] === e[t]; t++)
    ;
  return [(r.length - t).toString(), ...e.slice(t)].join("/");
};
function Qe(r) {
  if (r.target !== "openAi")
    return {};
  const e = [
    ...r.basePath,
    r.definitionPath,
    r.openAiAnyTypeName
  ];
  return r.flags.hasReferencedOpenAiAnyType = !0, {
    $ref: r.$refStrategy === "relative" ? Qo(e, r.currentPath) : e.join("/")
  };
}
function _f(r, e) {
  var n, s, a;
  const t = {
    type: "array"
  };
  return (n = r.type) != null && n._def && ((a = (s = r.type) == null ? void 0 : s._def) == null ? void 0 : a.typeName) !== Z.ZodAny && (t.items = ke(r.type._def, {
    ...e,
    currentPath: [...e.currentPath, "items"]
  })), r.minLength && Re(t, "minItems", r.minLength.value, r.minLength.message, e), r.maxLength && Re(t, "maxItems", r.maxLength.value, r.maxLength.message, e), r.exactLength && (Re(t, "minItems", r.exactLength.value, r.exactLength.message, e), Re(t, "maxItems", r.exactLength.value, r.exactLength.message, e)), t;
}
function vf(r, e) {
  const t = {
    type: "integer",
    format: "int64"
  };
  if (!r.checks)
    return t;
  for (const n of r.checks)
    switch (n.kind) {
      case "min":
        e.target === "jsonSchema7" ? n.inclusive ? Re(t, "minimum", n.value, n.message, e) : Re(t, "exclusiveMinimum", n.value, n.message, e) : (n.inclusive || (t.exclusiveMinimum = !0), Re(t, "minimum", n.value, n.message, e));
        break;
      case "max":
        e.target === "jsonSchema7" ? n.inclusive ? Re(t, "maximum", n.value, n.message, e) : Re(t, "exclusiveMaximum", n.value, n.message, e) : (n.inclusive || (t.exclusiveMaximum = !0), Re(t, "maximum", n.value, n.message, e));
        break;
      case "multipleOf":
        Re(t, "multipleOf", n.value, n.message, e);
        break;
    }
  return t;
}
function bf() {
  return {
    type: "boolean"
  };
}
function Yo(r, e) {
  return ke(r.type._def, e);
}
const wf = (r, e) => ke(r.innerType._def, e);
function Xo(r, e, t) {
  const n = t ?? e.dateStrategy;
  if (Array.isArray(n))
    return {
      anyOf: n.map((s, a) => Xo(r, e, s))
    };
  switch (n) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return $f(r, e);
  }
}
const $f = (r, e) => {
  const t = {
    type: "integer",
    format: "unix-time"
  };
  if (e.target === "openApi3")
    return t;
  for (const n of r.checks)
    switch (n.kind) {
      case "min":
        Re(
          t,
          "minimum",
          n.value,
          // This is in milliseconds
          n.message,
          e
        );
        break;
      case "max":
        Re(
          t,
          "maximum",
          n.value,
          // This is in milliseconds
          n.message,
          e
        );
        break;
    }
  return t;
};
function kf(r, e) {
  return {
    ...ke(r.innerType._def, e),
    default: r.defaultValue()
  };
}
function Sf(r, e) {
  return e.effectStrategy === "input" ? ke(r.schema._def, e) : Qe(e);
}
function Pf(r) {
  return {
    type: "string",
    enum: Array.from(r.values)
  };
}
const Rf = (r) => "type" in r && r.type === "string" ? !1 : "allOf" in r;
function Tf(r, e) {
  const t = [
    ke(r.left._def, {
      ...e,
      currentPath: [...e.currentPath, "allOf", "0"]
    }),
    ke(r.right._def, {
      ...e,
      currentPath: [...e.currentPath, "allOf", "1"]
    })
  ].filter((a) => !!a);
  let n = e.target === "jsonSchema2019-09" ? { unevaluatedProperties: !1 } : void 0;
  const s = [];
  return t.forEach((a) => {
    if (Rf(a))
      s.push(...a.allOf), a.unevaluatedProperties === void 0 && (n = void 0);
    else {
      let i = a;
      if ("additionalProperties" in a && a.additionalProperties === !1) {
        const { additionalProperties: o, ...c } = a;
        i = c;
      } else
        n = void 0;
      s.push(i);
    }
  }), s.length ? {
    allOf: s,
    ...n
  } : void 0;
}
function Ef(r, e) {
  const t = typeof r.value;
  return t !== "bigint" && t !== "number" && t !== "boolean" && t !== "string" ? {
    type: Array.isArray(r.value) ? "array" : "object"
  } : e.target === "openApi3" ? {
    type: t === "bigint" ? "integer" : t,
    enum: [r.value]
  } : {
    type: t === "bigint" ? "integer" : t,
    const: r.value
  };
}
let ls;
const ft = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: () => (ls === void 0 && (ls = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), ls),
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function ec(r, e) {
  const t = {
    type: "string"
  };
  if (r.checks)
    for (const n of r.checks)
      switch (n.kind) {
        case "min":
          Re(t, "minLength", typeof t.minLength == "number" ? Math.max(t.minLength, n.value) : n.value, n.message, e);
          break;
        case "max":
          Re(t, "maxLength", typeof t.maxLength == "number" ? Math.min(t.maxLength, n.value) : n.value, n.message, e);
          break;
        case "email":
          switch (e.emailStrategy) {
            case "format:email":
              ht(t, "email", n.message, e);
              break;
            case "format:idn-email":
              ht(t, "idn-email", n.message, e);
              break;
            case "pattern:zod":
              Fe(t, ft.email, n.message, e);
              break;
          }
          break;
        case "url":
          ht(t, "uri", n.message, e);
          break;
        case "uuid":
          ht(t, "uuid", n.message, e);
          break;
        case "regex":
          Fe(t, n.regex, n.message, e);
          break;
        case "cuid":
          Fe(t, ft.cuid, n.message, e);
          break;
        case "cuid2":
          Fe(t, ft.cuid2, n.message, e);
          break;
        case "startsWith":
          Fe(t, RegExp(`^${fs(n.value, e)}`), n.message, e);
          break;
        case "endsWith":
          Fe(t, RegExp(`${fs(n.value, e)}$`), n.message, e);
          break;
        case "datetime":
          ht(t, "date-time", n.message, e);
          break;
        case "date":
          ht(t, "date", n.message, e);
          break;
        case "time":
          ht(t, "time", n.message, e);
          break;
        case "duration":
          ht(t, "duration", n.message, e);
          break;
        case "length":
          Re(t, "minLength", typeof t.minLength == "number" ? Math.max(t.minLength, n.value) : n.value, n.message, e), Re(t, "maxLength", typeof t.maxLength == "number" ? Math.min(t.maxLength, n.value) : n.value, n.message, e);
          break;
        case "includes": {
          Fe(t, RegExp(fs(n.value, e)), n.message, e);
          break;
        }
        case "ip": {
          n.version !== "v6" && ht(t, "ipv4", n.message, e), n.version !== "v4" && ht(t, "ipv6", n.message, e);
          break;
        }
        case "base64url":
          Fe(t, ft.base64url, n.message, e);
          break;
        case "jwt":
          Fe(t, ft.jwt, n.message, e);
          break;
        case "cidr": {
          n.version !== "v6" && Fe(t, ft.ipv4Cidr, n.message, e), n.version !== "v4" && Fe(t, ft.ipv6Cidr, n.message, e);
          break;
        }
        case "emoji":
          Fe(t, ft.emoji(), n.message, e);
          break;
        case "ulid": {
          Fe(t, ft.ulid, n.message, e);
          break;
        }
        case "base64": {
          switch (e.base64Strategy) {
            case "format:binary": {
              ht(t, "binary", n.message, e);
              break;
            }
            case "contentEncoding:base64": {
              Re(t, "contentEncoding", "base64", n.message, e);
              break;
            }
            case "pattern:zod": {
              Fe(t, ft.base64, n.message, e);
              break;
            }
          }
          break;
        }
        case "nanoid":
          Fe(t, ft.nanoid, n.message, e);
      }
  return t;
}
function fs(r, e) {
  return e.patternStrategy === "escape" ? Nf(r) : r;
}
const xf = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function Nf(r) {
  let e = "";
  for (let t = 0; t < r.length; t++)
    xf.has(r[t]) || (e += "\\"), e += r[t];
  return e;
}
function ht(r, e, t, n) {
  var s;
  r.format || (s = r.anyOf) != null && s.some((a) => a.format) ? (r.anyOf || (r.anyOf = []), r.format && (r.anyOf.push({
    format: r.format,
    ...r.errorMessage && n.errorMessages && {
      errorMessage: { format: r.errorMessage.format }
    }
  }), delete r.format, r.errorMessage && (delete r.errorMessage.format, Object.keys(r.errorMessage).length === 0 && delete r.errorMessage)), r.anyOf.push({
    format: e,
    ...t && n.errorMessages && { errorMessage: { format: t } }
  })) : Re(r, "format", e, t, n);
}
function Fe(r, e, t, n) {
  var s;
  r.pattern || (s = r.allOf) != null && s.some((a) => a.pattern) ? (r.allOf || (r.allOf = []), r.pattern && (r.allOf.push({
    pattern: r.pattern,
    ...r.errorMessage && n.errorMessages && {
      errorMessage: { pattern: r.errorMessage.pattern }
    }
  }), delete r.pattern, r.errorMessage && (delete r.errorMessage.pattern, Object.keys(r.errorMessage).length === 0 && delete r.errorMessage)), r.allOf.push({
    pattern: Wi(e, n),
    ...t && n.errorMessages && { errorMessage: { pattern: t } }
  })) : Re(r, "pattern", Wi(e, n), t, n);
}
function Wi(r, e) {
  var c;
  if (!e.applyRegexFlags || !r.flags)
    return r.source;
  const t = {
    i: r.flags.includes("i"),
    m: r.flags.includes("m"),
    s: r.flags.includes("s")
    // `.` matches newlines
  }, n = t.i ? r.source.toLowerCase() : r.source;
  let s = "", a = !1, i = !1, o = !1;
  for (let u = 0; u < n.length; u++) {
    if (a) {
      s += n[u], a = !1;
      continue;
    }
    if (t.i) {
      if (i) {
        if (n[u].match(/[a-z]/)) {
          o ? (s += n[u], s += `${n[u - 2]}-${n[u]}`.toUpperCase(), o = !1) : n[u + 1] === "-" && ((c = n[u + 2]) != null && c.match(/[a-z]/)) ? (s += n[u], o = !0) : s += `${n[u]}${n[u].toUpperCase()}`;
          continue;
        }
      } else if (n[u].match(/[a-z]/)) {
        s += `[${n[u]}${n[u].toUpperCase()}]`;
        continue;
      }
    }
    if (t.m) {
      if (n[u] === "^") {
        s += `(^|(?<=[\r
]))`;
        continue;
      } else if (n[u] === "$") {
        s += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (t.s && n[u] === ".") {
      s += i ? `${n[u]}\r
` : `[${n[u]}\r
]`;
      continue;
    }
    s += n[u], n[u] === "\\" ? a = !0 : i && n[u] === "]" ? i = !1 : !i && n[u] === "[" && (i = !0);
  }
  try {
    new RegExp(s);
  } catch {
    return console.warn(`Could not convert regex pattern at ${e.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), r.source;
  }
  return s;
}
function tc(r, e) {
  var n, s, a, i, o, c;
  if (e.target === "openAi" && console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead."), e.target === "openApi3" && ((n = r.keyType) == null ? void 0 : n._def.typeName) === Z.ZodEnum)
    return {
      type: "object",
      required: r.keyType._def.values,
      properties: r.keyType._def.values.reduce((u, l) => ({
        ...u,
        [l]: ke(r.valueType._def, {
          ...e,
          currentPath: [...e.currentPath, "properties", l]
        }) ?? Qe(e)
      }), {}),
      additionalProperties: e.rejectedAdditionalProperties
    };
  const t = {
    type: "object",
    additionalProperties: ke(r.valueType._def, {
      ...e,
      currentPath: [...e.currentPath, "additionalProperties"]
    }) ?? e.allowedAdditionalProperties
  };
  if (e.target === "openApi3")
    return t;
  if (((s = r.keyType) == null ? void 0 : s._def.typeName) === Z.ZodString && ((a = r.keyType._def.checks) != null && a.length)) {
    const { type: u, ...l } = ec(r.keyType._def, e);
    return {
      ...t,
      propertyNames: l
    };
  } else {
    if (((i = r.keyType) == null ? void 0 : i._def.typeName) === Z.ZodEnum)
      return {
        ...t,
        propertyNames: {
          enum: r.keyType._def.values
        }
      };
    if (((o = r.keyType) == null ? void 0 : o._def.typeName) === Z.ZodBranded && r.keyType._def.type._def.typeName === Z.ZodString && ((c = r.keyType._def.type._def.checks) != null && c.length)) {
      const { type: u, ...l } = Yo(r.keyType._def, e);
      return {
        ...t,
        propertyNames: l
      };
    }
  }
  return t;
}
function Of(r, e) {
  if (e.mapStrategy === "record")
    return tc(r, e);
  const t = ke(r.keyType._def, {
    ...e,
    currentPath: [...e.currentPath, "items", "items", "0"]
  }) || Qe(e), n = ke(r.valueType._def, {
    ...e,
    currentPath: [...e.currentPath, "items", "items", "1"]
  }) || Qe(e);
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [t, n],
      minItems: 2,
      maxItems: 2
    }
  };
}
function Cf(r) {
  const e = r.values, n = Object.keys(r.values).filter((a) => typeof e[e[a]] != "number").map((a) => e[a]), s = Array.from(new Set(n.map((a) => typeof a)));
  return {
    type: s.length === 1 ? s[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: n
  };
}
function If(r) {
  return r.target === "openAi" ? void 0 : {
    not: Qe({
      ...r,
      currentPath: [...r.currentPath, "not"]
    })
  };
}
function Af(r) {
  return r.target === "openApi3" ? {
    enum: ["null"],
    nullable: !0
  } : {
    type: "null"
  };
}
const An = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function jf(r, e) {
  if (e.target === "openApi3")
    return Qi(r, e);
  const t = r.options instanceof Map ? Array.from(r.options.values()) : r.options;
  if (t.every((n) => n._def.typeName in An && (!n._def.checks || !n._def.checks.length))) {
    const n = t.reduce((s, a) => {
      const i = An[a._def.typeName];
      return i && !s.includes(i) ? [...s, i] : s;
    }, []);
    return {
      type: n.length > 1 ? n : n[0]
    };
  } else if (t.every((n) => n._def.typeName === "ZodLiteral" && !n.description)) {
    const n = t.reduce((s, a) => {
      const i = typeof a._def.value;
      switch (i) {
        case "string":
        case "number":
        case "boolean":
          return [...s, i];
        case "bigint":
          return [...s, "integer"];
        case "object":
          if (a._def.value === null)
            return [...s, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return s;
      }
    }, []);
    if (n.length === t.length) {
      const s = n.filter((a, i, o) => o.indexOf(a) === i);
      return {
        type: s.length > 1 ? s : s[0],
        enum: t.reduce((a, i) => a.includes(i._def.value) ? a : [...a, i._def.value], [])
      };
    }
  } else if (t.every((n) => n._def.typeName === "ZodEnum"))
    return {
      type: "string",
      enum: t.reduce((n, s) => [
        ...n,
        ...s._def.values.filter((a) => !n.includes(a))
      ], [])
    };
  return Qi(r, e);
}
const Qi = (r, e) => {
  const t = (r.options instanceof Map ? Array.from(r.options.values()) : r.options).map((n, s) => ke(n._def, {
    ...e,
    currentPath: [...e.currentPath, "anyOf", `${s}`]
  })).filter((n) => !!n && (!e.strictUnions || typeof n == "object" && Object.keys(n).length > 0));
  return t.length ? { anyOf: t } : void 0;
};
function Mf(r, e) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(r.innerType._def.typeName) && (!r.innerType._def.checks || !r.innerType._def.checks.length))
    return e.target === "openApi3" ? {
      type: An[r.innerType._def.typeName],
      nullable: !0
    } : {
      type: [
        An[r.innerType._def.typeName],
        "null"
      ]
    };
  if (e.target === "openApi3") {
    const n = ke(r.innerType._def, {
      ...e,
      currentPath: [...e.currentPath]
    });
    return n && "$ref" in n ? { allOf: [n], nullable: !0 } : n && { ...n, nullable: !0 };
  }
  const t = ke(r.innerType._def, {
    ...e,
    currentPath: [...e.currentPath, "anyOf", "0"]
  });
  return t && { anyOf: [t, { type: "null" }] };
}
function qf(r, e) {
  const t = {
    type: "number"
  };
  if (!r.checks)
    return t;
  for (const n of r.checks)
    switch (n.kind) {
      case "int":
        t.type = "integer", Wo(t, "type", n.message, e);
        break;
      case "min":
        e.target === "jsonSchema7" ? n.inclusive ? Re(t, "minimum", n.value, n.message, e) : Re(t, "exclusiveMinimum", n.value, n.message, e) : (n.inclusive || (t.exclusiveMinimum = !0), Re(t, "minimum", n.value, n.message, e));
        break;
      case "max":
        e.target === "jsonSchema7" ? n.inclusive ? Re(t, "maximum", n.value, n.message, e) : Re(t, "exclusiveMaximum", n.value, n.message, e) : (n.inclusive || (t.exclusiveMaximum = !0), Re(t, "maximum", n.value, n.message, e));
        break;
      case "multipleOf":
        Re(t, "multipleOf", n.value, n.message, e);
        break;
    }
  return t;
}
function Df(r, e) {
  const t = e.target === "openAi", n = {
    type: "object",
    properties: {}
  }, s = [], a = r.shape();
  for (const o in a) {
    let c = a[o];
    if (c === void 0 || c._def === void 0)
      continue;
    let u = zf(c);
    u && t && (c._def.typeName === "ZodOptional" && (c = c._def.innerType), c.isNullable() || (c = c.nullable()), u = !1);
    const l = ke(c._def, {
      ...e,
      currentPath: [...e.currentPath, "properties", o],
      propertyPath: [...e.currentPath, "properties", o]
    });
    l !== void 0 && (n.properties[o] = l, u || s.push(o));
  }
  s.length && (n.required = s);
  const i = Zf(r, e);
  return i !== void 0 && (n.additionalProperties = i), n;
}
function Zf(r, e) {
  if (r.catchall._def.typeName !== "ZodNever")
    return ke(r.catchall._def, {
      ...e,
      currentPath: [...e.currentPath, "additionalProperties"]
    });
  switch (r.unknownKeys) {
    case "passthrough":
      return e.allowedAdditionalProperties;
    case "strict":
      return e.rejectedAdditionalProperties;
    case "strip":
      return e.removeAdditionalStrategy === "strict" ? e.allowedAdditionalProperties : e.rejectedAdditionalProperties;
  }
}
function zf(r) {
  try {
    return r.isOptional();
  } catch {
    return !0;
  }
}
const Lf = (r, e) => {
  var n;
  if (e.currentPath.toString() === ((n = e.propertyPath) == null ? void 0 : n.toString()))
    return ke(r.innerType._def, e);
  const t = ke(r.innerType._def, {
    ...e,
    currentPath: [...e.currentPath, "anyOf", "1"]
  });
  return t ? {
    anyOf: [
      {
        not: Qe(e)
      },
      t
    ]
  } : Qe(e);
}, Vf = (r, e) => {
  if (e.pipeStrategy === "input")
    return ke(r.in._def, e);
  if (e.pipeStrategy === "output")
    return ke(r.out._def, e);
  const t = ke(r.in._def, {
    ...e,
    currentPath: [...e.currentPath, "allOf", "0"]
  }), n = ke(r.out._def, {
    ...e,
    currentPath: [...e.currentPath, "allOf", t ? "1" : "0"]
  });
  return {
    allOf: [t, n].filter((s) => s !== void 0)
  };
};
function Ff(r, e) {
  return ke(r.type._def, e);
}
function Uf(r, e) {
  const n = {
    type: "array",
    uniqueItems: !0,
    items: ke(r.valueType._def, {
      ...e,
      currentPath: [...e.currentPath, "items"]
    })
  };
  return r.minSize && Re(n, "minItems", r.minSize.value, r.minSize.message, e), r.maxSize && Re(n, "maxItems", r.maxSize.value, r.maxSize.message, e), n;
}
function Hf(r, e) {
  return r.rest ? {
    type: "array",
    minItems: r.items.length,
    items: r.items.map((t, n) => ke(t._def, {
      ...e,
      currentPath: [...e.currentPath, "items", `${n}`]
    })).reduce((t, n) => n === void 0 ? t : [...t, n], []),
    additionalItems: ke(r.rest._def, {
      ...e,
      currentPath: [...e.currentPath, "additionalItems"]
    })
  } : {
    type: "array",
    minItems: r.items.length,
    maxItems: r.items.length,
    items: r.items.map((t, n) => ke(t._def, {
      ...e,
      currentPath: [...e.currentPath, "items", `${n}`]
    })).reduce((t, n) => n === void 0 ? t : [...t, n], [])
  };
}
function Kf(r) {
  return {
    not: Qe(r)
  };
}
function Bf(r) {
  return Qe(r);
}
const Gf = (r, e) => ke(r.innerType._def, e), Jf = (r, e, t) => {
  switch (e) {
    case Z.ZodString:
      return ec(r, t);
    case Z.ZodNumber:
      return qf(r, t);
    case Z.ZodObject:
      return Df(r, t);
    case Z.ZodBigInt:
      return vf(r, t);
    case Z.ZodBoolean:
      return bf();
    case Z.ZodDate:
      return Xo(r, t);
    case Z.ZodUndefined:
      return Kf(t);
    case Z.ZodNull:
      return Af(t);
    case Z.ZodArray:
      return _f(r, t);
    case Z.ZodUnion:
    case Z.ZodDiscriminatedUnion:
      return jf(r, t);
    case Z.ZodIntersection:
      return Tf(r, t);
    case Z.ZodTuple:
      return Hf(r, t);
    case Z.ZodRecord:
      return tc(r, t);
    case Z.ZodLiteral:
      return Ef(r, t);
    case Z.ZodEnum:
      return Pf(r);
    case Z.ZodNativeEnum:
      return Cf(r);
    case Z.ZodNullable:
      return Mf(r, t);
    case Z.ZodOptional:
      return Lf(r, t);
    case Z.ZodMap:
      return Of(r, t);
    case Z.ZodSet:
      return Uf(r, t);
    case Z.ZodLazy:
      return () => r.getter()._def;
    case Z.ZodPromise:
      return Ff(r, t);
    case Z.ZodNaN:
    case Z.ZodNever:
      return If(t);
    case Z.ZodEffects:
      return Sf(r, t);
    case Z.ZodAny:
      return Qe(t);
    case Z.ZodUnknown:
      return Bf(t);
    case Z.ZodDefault:
      return kf(r, t);
    case Z.ZodBranded:
      return Yo(r, t);
    case Z.ZodReadonly:
      return Gf(r, t);
    case Z.ZodCatch:
      return wf(r, t);
    case Z.ZodPipeline:
      return Vf(r, t);
    case Z.ZodFunction:
    case Z.ZodVoid:
    case Z.ZodSymbol:
      return;
    default:
      return /* @__PURE__ */ ((n) => {
      })();
  }
};
function ke(r, e, t = !1) {
  var o;
  const n = e.seen.get(r);
  if (e.override) {
    const c = (o = e.override) == null ? void 0 : o.call(e, r, e, n, t);
    if (c !== pf)
      return c;
  }
  if (n && !t) {
    const c = Wf(n, e);
    if (c !== void 0)
      return c;
  }
  const s = { def: r, path: e.currentPath, jsonSchema: void 0 };
  e.seen.set(r, s);
  const a = Jf(r, r.typeName, e), i = typeof a == "function" ? ke(a(), e) : a;
  if (i && Qf(r, e, i), e.postProcess) {
    const c = e.postProcess(i, r, e);
    return s.jsonSchema = i, c;
  }
  return s.jsonSchema = i, i;
}
const Wf = (r, e) => {
  switch (e.$refStrategy) {
    case "root":
      return { $ref: r.path.join("/") };
    case "relative":
      return { $ref: Qo(e.currentPath, r.path) };
    case "none":
    case "seen":
      return r.path.length < e.currentPath.length && r.path.every((t, n) => e.currentPath[n] === t) ? (console.warn(`Recursive reference detected at ${e.currentPath.join("/")}! Defaulting to any`), Qe(e)) : e.$refStrategy === "seen" ? Qe(e) : void 0;
  }
}, Qf = (r, e, t) => (r.description && (t.description = r.description, e.markdownDescription && (t.markdownDescription = r.description)), t), Yi = (r, e) => {
  const t = yf(e);
  let n = typeof e == "object" && e.definitions ? Object.entries(e.definitions).reduce((c, [u, l]) => ({
    ...c,
    [u]: ke(l._def, {
      ...t,
      currentPath: [...t.basePath, t.definitionPath, u]
    }, !0) ?? Qe(t)
  }), {}) : void 0;
  const s = typeof e == "string" ? e : (e == null ? void 0 : e.nameStrategy) === "title" || e == null ? void 0 : e.name, a = ke(r._def, s === void 0 ? t : {
    ...t,
    currentPath: [...t.basePath, t.definitionPath, s]
  }, !1) ?? Qe(t), i = typeof e == "object" && e.name !== void 0 && e.nameStrategy === "title" ? e.name : void 0;
  i !== void 0 && (a.title = i), t.flags.hasReferencedOpenAiAnyType && (n || (n = {}), n[t.openAiAnyTypeName] || (n[t.openAiAnyTypeName] = {
    // Skipping "object" as no properties can be defined and additionalProperties must be "false"
    type: ["string", "number", "integer", "boolean", "array", "null"],
    items: {
      $ref: t.$refStrategy === "relative" ? "1" : [
        ...t.basePath,
        t.definitionPath,
        t.openAiAnyTypeName
      ].join("/")
    }
  }));
  const o = s === void 0 ? n ? {
    ...a,
    [t.definitionPath]: n
  } : a : {
    $ref: [
      ...t.$refStrategy === "relative" ? [] : t.basePath,
      t.definitionPath,
      s
    ].join("/"),
    [t.definitionPath]: {
      ...n,
      [s]: a
    }
  };
  return t.target === "jsonSchema7" ? o.$schema = "http://json-schema.org/draft-07/schema#" : (t.target === "jsonSchema2019-09" || t.target === "openAi") && (o.$schema = "https://json-schema.org/draft/2019-09/schema#"), t.target === "openAi" && ("anyOf" in o || "oneOf" in o || "allOf" in o || "type" in o && Array.isArray(o.type)) && console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property."), o;
};
var Zs;
(function(r) {
  r.Completable = "McpCompletable";
})(Zs || (Zs = {}));
class zs extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
zs.create = (r, e) => new zs({
  type: r,
  typeName: Zs.Completable,
  complete: e.complete,
  ...Yf(e)
});
function Yf(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: s } = r;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (i, o) => {
    var c, u;
    const { message: l } = r;
    return i.code === "invalid_enum_value" ? { message: l ?? o.defaultError } : typeof o.data > "u" ? { message: (c = l ?? n) !== null && c !== void 0 ? c : o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: (u = l ?? t) !== null && u !== void 0 ? u : o.defaultError };
  }, description: s };
}
class Xf {
  constructor(e, t) {
    this._registeredResources = {}, this._registeredResourceTemplates = {}, this._registeredTools = {}, this._registeredPrompts = {}, this._toolHandlersInitialized = !1, this._completionHandlerInitialized = !1, this._resourceHandlersInitialized = !1, this._promptHandlersInitialized = !1, this.server = new mf(e, t);
  }
  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The `server` object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
   */
  async connect(e) {
    return await this.server.connect(e);
  }
  /**
   * Closes the connection.
   */
  async close() {
    await this.server.close();
  }
  setToolRequestHandlers() {
    this._toolHandlersInitialized || (this.server.assertCanSetRequestHandler(Ms.shape.method.value), this.server.assertCanSetRequestHandler(qs.shape.method.value), this.server.registerCapabilities({
      tools: {
        listChanged: !0
      }
    }), this.server.setRequestHandler(Ms, () => ({
      tools: Object.entries(this._registeredTools).filter(([, e]) => e.enabled).map(([e, t]) => {
        const n = {
          name: e,
          title: t.title,
          description: t.description,
          inputSchema: t.inputSchema ? Yi(t.inputSchema, {
            strictUnions: !0,
            pipeStrategy: "input"
          }) : eh,
          annotations: t.annotations,
          _meta: t._meta
        };
        return t.outputSchema && (n.outputSchema = Yi(t.outputSchema, {
          strictUnions: !0,
          pipeStrategy: "output"
        })), n;
      })
    })), this.server.setRequestHandler(qs, async (e, t) => {
      const n = this._registeredTools[e.params.name];
      let s;
      try {
        if (!n)
          throw new Ne(xe.InvalidParams, `Tool ${e.params.name} not found`);
        if (!n.enabled)
          throw new Ne(xe.InvalidParams, `Tool ${e.params.name} disabled`);
        if (n.inputSchema) {
          const a = n.callback, i = await n.inputSchema.safeParseAsync(e.params.arguments);
          if (!i.success)
            throw new Ne(xe.InvalidParams, `Input validation error: Invalid arguments for tool ${e.params.name}: ${i.error.message}`);
          const o = i.data;
          s = await Promise.resolve(a(o, t));
        } else {
          const a = n.callback;
          s = await Promise.resolve(a(t));
        }
        if (n.outputSchema && !s.isError) {
          if (!s.structuredContent)
            throw new Ne(xe.InvalidParams, `Output validation error: Tool ${e.params.name} has an output schema but no structured content was provided`);
          const a = await n.outputSchema.safeParseAsync(s.structuredContent);
          if (!a.success)
            throw new Ne(xe.InvalidParams, `Output validation error: Invalid structured content for tool ${e.params.name}: ${a.error.message}`);
        }
      } catch (a) {
        return this.createToolError(a instanceof Error ? a.message : String(a));
      }
      return s;
    }), this._toolHandlersInitialized = !0);
  }
  /**
   * Creates a tool error result.
   *
   * @param errorMessage - The error message.
   * @returns The tool error result.
   */
  createToolError(e) {
    return {
      content: [
        {
          type: "text",
          text: e
        }
      ],
      isError: !0
    };
  }
  setCompletionRequestHandler() {
    this._completionHandlerInitialized || (this.server.assertCanSetRequestHandler(Ds.shape.method.value), this.server.registerCapabilities({
      completions: {}
    }), this.server.setRequestHandler(Ds, async (e) => {
      switch (e.params.ref.type) {
        case "ref/prompt":
          return this.handlePromptCompletion(e, e.params.ref);
        case "ref/resource":
          return this.handleResourceCompletion(e, e.params.ref);
        default:
          throw new Ne(xe.InvalidParams, `Invalid completion reference: ${e.params.ref}`);
      }
    }), this._completionHandlerInitialized = !0);
  }
  async handlePromptCompletion(e, t) {
    const n = this._registeredPrompts[t.name];
    if (!n)
      throw new Ne(xe.InvalidParams, `Prompt ${t.name} not found`);
    if (!n.enabled)
      throw new Ne(xe.InvalidParams, `Prompt ${t.name} disabled`);
    if (!n.argsSchema)
      return ln;
    const s = n.argsSchema.shape[e.params.argument.name];
    if (!(s instanceof zs))
      return ln;
    const i = await s._def.complete(e.params.argument.value, e.params.context);
    return eo(i);
  }
  async handleResourceCompletion(e, t) {
    const n = Object.values(this._registeredResourceTemplates).find((i) => i.resourceTemplate.uriTemplate.toString() === t.uri);
    if (!n) {
      if (this._registeredResources[t.uri])
        return ln;
      throw new Ne(xe.InvalidParams, `Resource template ${e.params.ref.uri} not found`);
    }
    const s = n.resourceTemplate.completeCallback(e.params.argument.name);
    if (!s)
      return ln;
    const a = await s(e.params.argument.value, e.params.context);
    return eo(a);
  }
  setResourceRequestHandlers() {
    this._resourceHandlersInitialized || (this.server.assertCanSetRequestHandler(Os.shape.method.value), this.server.assertCanSetRequestHandler(Cs.shape.method.value), this.server.assertCanSetRequestHandler(Is.shape.method.value), this.server.registerCapabilities({
      resources: {
        listChanged: !0
      }
    }), this.server.setRequestHandler(Os, async (e, t) => {
      const n = Object.entries(this._registeredResources).filter(([a, i]) => i.enabled).map(([a, i]) => ({
        uri: a,
        name: i.name,
        ...i.metadata
      })), s = [];
      for (const a of Object.values(this._registeredResourceTemplates)) {
        if (!a.resourceTemplate.listCallback)
          continue;
        const i = await a.resourceTemplate.listCallback(t);
        for (const o of i.resources)
          s.push({
            ...a.metadata,
            // the defined resource metadata should override the template metadata if present
            ...o
          });
      }
      return { resources: [...n, ...s] };
    }), this.server.setRequestHandler(Cs, async () => ({ resourceTemplates: Object.entries(this._registeredResourceTemplates).map(([t, n]) => ({
      name: t,
      uriTemplate: n.resourceTemplate.uriTemplate.toString(),
      ...n.metadata
    })) })), this.server.setRequestHandler(Is, async (e, t) => {
      const n = new URL(e.params.uri), s = this._registeredResources[n.toString()];
      if (s) {
        if (!s.enabled)
          throw new Ne(xe.InvalidParams, `Resource ${n} disabled`);
        return s.readCallback(n, t);
      }
      for (const a of Object.values(this._registeredResourceTemplates)) {
        const i = a.resourceTemplate.uriTemplate.match(n.toString());
        if (i)
          return a.readCallback(n, i, t);
      }
      throw new Ne(xe.InvalidParams, `Resource ${n} not found`);
    }), this.setCompletionRequestHandler(), this._resourceHandlersInitialized = !0);
  }
  setPromptRequestHandlers() {
    this._promptHandlersInitialized || (this.server.assertCanSetRequestHandler(As.shape.method.value), this.server.assertCanSetRequestHandler(js.shape.method.value), this.server.registerCapabilities({
      prompts: {
        listChanged: !0
      }
    }), this.server.setRequestHandler(As, () => ({
      prompts: Object.entries(this._registeredPrompts).filter(([, e]) => e.enabled).map(([e, t]) => ({
        name: e,
        title: t.title,
        description: t.description,
        arguments: t.argsSchema ? rh(t.argsSchema) : void 0
      }))
    })), this.server.setRequestHandler(js, async (e, t) => {
      const n = this._registeredPrompts[e.params.name];
      if (!n)
        throw new Ne(xe.InvalidParams, `Prompt ${e.params.name} not found`);
      if (!n.enabled)
        throw new Ne(xe.InvalidParams, `Prompt ${e.params.name} disabled`);
      if (n.argsSchema) {
        const s = await n.argsSchema.safeParseAsync(e.params.arguments);
        if (!s.success)
          throw new Ne(xe.InvalidParams, `Invalid arguments for prompt ${e.params.name}: ${s.error.message}`);
        const a = s.data, i = n.callback;
        return await Promise.resolve(i(a, t));
      } else {
        const s = n.callback;
        return await Promise.resolve(s(t));
      }
    }), this.setCompletionRequestHandler(), this._promptHandlersInitialized = !0);
  }
  resource(e, t, ...n) {
    let s;
    typeof n[0] == "object" && (s = n.shift());
    const a = n[0];
    if (typeof t == "string") {
      if (this._registeredResources[t])
        throw new Error(`Resource ${t} is already registered`);
      const i = this._createRegisteredResource(e, void 0, t, s, a);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), i;
    } else {
      if (this._registeredResourceTemplates[e])
        throw new Error(`Resource template ${e} is already registered`);
      const i = this._createRegisteredResourceTemplate(e, void 0, t, s, a);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), i;
    }
  }
  registerResource(e, t, n, s) {
    if (typeof t == "string") {
      if (this._registeredResources[t])
        throw new Error(`Resource ${t} is already registered`);
      const a = this._createRegisteredResource(e, n.title, t, n, s);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), a;
    } else {
      if (this._registeredResourceTemplates[e])
        throw new Error(`Resource template ${e} is already registered`);
      const a = this._createRegisteredResourceTemplate(e, n.title, t, n, s);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), a;
    }
  }
  _createRegisteredResource(e, t, n, s, a) {
    const i = {
      name: e,
      title: t,
      metadata: s,
      readCallback: a,
      enabled: !0,
      disable: () => i.update({ enabled: !1 }),
      enable: () => i.update({ enabled: !0 }),
      remove: () => i.update({ uri: null }),
      update: (o) => {
        typeof o.uri < "u" && o.uri !== n && (delete this._registeredResources[n], o.uri && (this._registeredResources[o.uri] = i)), typeof o.name < "u" && (i.name = o.name), typeof o.title < "u" && (i.title = o.title), typeof o.metadata < "u" && (i.metadata = o.metadata), typeof o.callback < "u" && (i.readCallback = o.callback), typeof o.enabled < "u" && (i.enabled = o.enabled), this.sendResourceListChanged();
      }
    };
    return this._registeredResources[n] = i, i;
  }
  _createRegisteredResourceTemplate(e, t, n, s, a) {
    const i = {
      resourceTemplate: n,
      title: t,
      metadata: s,
      readCallback: a,
      enabled: !0,
      disable: () => i.update({ enabled: !1 }),
      enable: () => i.update({ enabled: !0 }),
      remove: () => i.update({ name: null }),
      update: (o) => {
        typeof o.name < "u" && o.name !== e && (delete this._registeredResourceTemplates[e], o.name && (this._registeredResourceTemplates[o.name] = i)), typeof o.title < "u" && (i.title = o.title), typeof o.template < "u" && (i.resourceTemplate = o.template), typeof o.metadata < "u" && (i.metadata = o.metadata), typeof o.callback < "u" && (i.readCallback = o.callback), typeof o.enabled < "u" && (i.enabled = o.enabled), this.sendResourceListChanged();
      }
    };
    return this._registeredResourceTemplates[e] = i, i;
  }
  _createRegisteredPrompt(e, t, n, s, a) {
    const i = {
      title: t,
      description: n,
      argsSchema: s === void 0 ? void 0 : H(s),
      callback: a,
      enabled: !0,
      disable: () => i.update({ enabled: !1 }),
      enable: () => i.update({ enabled: !0 }),
      remove: () => i.update({ name: null }),
      update: (o) => {
        typeof o.name < "u" && o.name !== e && (delete this._registeredPrompts[e], o.name && (this._registeredPrompts[o.name] = i)), typeof o.title < "u" && (i.title = o.title), typeof o.description < "u" && (i.description = o.description), typeof o.argsSchema < "u" && (i.argsSchema = H(o.argsSchema)), typeof o.callback < "u" && (i.callback = o.callback), typeof o.enabled < "u" && (i.enabled = o.enabled), this.sendPromptListChanged();
      }
    };
    return this._registeredPrompts[e] = i, i;
  }
  _createRegisteredTool(e, t, n, s, a, i, o, c) {
    const u = {
      title: t,
      description: n,
      inputSchema: s === void 0 ? void 0 : H(s),
      outputSchema: a === void 0 ? void 0 : H(a),
      annotations: i,
      _meta: o,
      callback: c,
      enabled: !0,
      disable: () => u.update({ enabled: !1 }),
      enable: () => u.update({ enabled: !0 }),
      remove: () => u.update({ name: null }),
      update: (l) => {
        typeof l.name < "u" && l.name !== e && (delete this._registeredTools[e], l.name && (this._registeredTools[l.name] = u)), typeof l.title < "u" && (u.title = l.title), typeof l.description < "u" && (u.description = l.description), typeof l.paramsSchema < "u" && (u.inputSchema = H(l.paramsSchema)), typeof l.callback < "u" && (u.callback = l.callback), typeof l.annotations < "u" && (u.annotations = l.annotations), typeof l._meta < "u" && (u._meta = l._meta), typeof l.enabled < "u" && (u.enabled = l.enabled), this.sendToolListChanged();
      }
    };
    return this._registeredTools[e] = u, this.setToolRequestHandlers(), this.sendToolListChanged(), u;
  }
  /**
   * tool() implementation. Parses arguments passed to overrides defined above.
   */
  tool(e, ...t) {
    if (this._registeredTools[e])
      throw new Error(`Tool ${e} is already registered`);
    let n, s, a, i;
    if (typeof t[0] == "string" && (n = t.shift()), t.length > 1) {
      const c = t[0];
      Xi(c) ? (s = t.shift(), t.length > 1 && typeof t[0] == "object" && t[0] !== null && !Xi(t[0]) && (i = t.shift())) : typeof c == "object" && c !== null && (i = t.shift());
    }
    const o = t[0];
    return this._createRegisteredTool(e, void 0, n, s, a, i, void 0, o);
  }
  /**
   * Registers a tool with a config object and callback.
   */
  registerTool(e, t, n) {
    if (this._registeredTools[e])
      throw new Error(`Tool ${e} is already registered`);
    const { title: s, description: a, inputSchema: i, outputSchema: o, annotations: c, _meta: u } = t;
    return this._createRegisteredTool(e, s, a, i, o, c, u, n);
  }
  prompt(e, ...t) {
    if (this._registeredPrompts[e])
      throw new Error(`Prompt ${e} is already registered`);
    let n;
    typeof t[0] == "string" && (n = t.shift());
    let s;
    t.length > 1 && (s = t.shift());
    const a = t[0], i = this._createRegisteredPrompt(e, void 0, n, s, a);
    return this.setPromptRequestHandlers(), this.sendPromptListChanged(), i;
  }
  /**
   * Registers a prompt with a config object and callback.
   */
  registerPrompt(e, t, n) {
    if (this._registeredPrompts[e])
      throw new Error(`Prompt ${e} is already registered`);
    const { title: s, description: a, argsSchema: i } = t, o = this._createRegisteredPrompt(e, s, a, i, n);
    return this.setPromptRequestHandlers(), this.sendPromptListChanged(), o;
  }
  /**
   * Checks if the server is connected to a transport.
   * @returns True if the server is connected
   */
  isConnected() {
    return this.server.transport !== void 0;
  }
  /**
   * Sends a logging message to the client, if connected.
   * Note: You only need to send the parameters object, not the entire JSON RPC message
   * @see LoggingMessageNotification
   * @param params
   * @param sessionId optional for stateless and backward compatibility
   */
  async sendLoggingMessage(e, t) {
    return this.server.sendLoggingMessage(e, t);
  }
  /**
   * Sends a resource list changed event to the client, if connected.
   */
  sendResourceListChanged() {
    this.isConnected() && this.server.sendResourceListChanged();
  }
  /**
   * Sends a tool list changed event to the client, if connected.
   */
  sendToolListChanged() {
    this.isConnected() && this.server.sendToolListChanged();
  }
  /**
   * Sends a prompt list changed event to the client, if connected.
   */
  sendPromptListChanged() {
    this.isConnected() && this.server.sendPromptListChanged();
  }
}
const eh = {
  type: "object",
  properties: {}
};
function Xi(r) {
  return typeof r != "object" || r === null ? !1 : Object.keys(r).length === 0 || Object.values(r).some(th);
}
function th(r) {
  return r !== null && typeof r == "object" && "parse" in r && typeof r.parse == "function" && "safeParse" in r && typeof r.safeParse == "function";
}
function rh(r) {
  return Object.entries(r.shape).map(([e, t]) => ({
    name: e,
    description: t.description,
    required: !t.isOptional()
  }));
}
function eo(r) {
  return {
    completion: {
      values: r.slice(0, 100),
      total: r.length,
      hasMore: r.length > 100
    }
  };
}
const ln = {
  completion: {
    values: [],
    hasMore: !1
  }
};
function to(r, e) {
  if (typeof window > "u")
    return;
  const t = (/* @__PURE__ */ new Date()).toISOString(), n = `[Progress Planner MCP ${t}] ${r}`, s = e ? { message: r, data: e } : { message: r };
  try {
    if (window.parent && window.parent !== window) {
      const i = window.parent;
      if (i.console) {
        i.console.log(n, e || ""), i.__progressPlannerDebug || (i.__progressPlannerDebug = []), i.__progressPlannerDebug.push({
          timestamp: t,
          ...s
        });
        return;
      }
    }
  } catch {
  }
  const a = window;
  a.console && a.console.log(n, e || ""), a.__progressPlannerDebug || (a.__progressPlannerDebug = []), a.__progressPlannerDebug.push({
    timestamp: t,
    ...s
  });
}
async function rc(r, e) {
  const t = progressPlannerAngie.restUrl + r, n = {
    method: e ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": progressPlannerAngie.nonce || ""
    }
  };
  e && (n.body = JSON.stringify(e));
  const s = await fetch(t, n);
  if (!s.ok)
    throw new Error(`HTTP error! status: ${s.status}`);
  return await s.json();
}
function nh(r) {
  switch (r) {
    case "string":
      return F();
    case "number":
      return De();
    case "boolean":
      return Ke();
    default:
      return pt();
  }
}
function jn(r, e = []) {
  const t = {};
  for (const [n, s] of Object.entries(r)) {
    let a;
    if (s.enum && Array.isArray(s.enum) && s.enum.length > 0)
      if (typeof s.enum[0] == "string")
        a = bt(s.enum);
      else {
        const o = s.enum.map((c) => ue(c));
        a = Ze(o);
      }
    else
      switch (s.type) {
        case "string":
          a = F();
          break;
        case "number":
          a = De();
          break;
        case "boolean":
          a = Ke();
          break;
        case "array":
          if (s.items)
            if (typeof s.items == "object" && "type" in s.items)
              if (s.items.type === "object" && s.items.properties) {
                const i = H(
                  jn(
                    s.items.properties,
                    s.items.required || []
                  )
                );
                a = Ee(i);
              } else {
                const i = nh(
                  s.items.type
                );
                a = Ee(i);
              }
            else
              a = Ee(pt());
          else
            a = Ee(pt());
          break;
        case "object":
          s.properties ? a = H(
            jn(
              s.properties,
              s.required || []
            )
          ) : a = or(pt());
          break;
        default:
          a = pt();
      }
    s.description && (a = a.describe(s.description)), s.default !== void 0 && (a = a.default(s.default)), !e.includes(n) && s.default === void 0 && (a = a.optional()), t[n] = a;
  }
  return t;
}
function sh(r, e) {
  if (!e)
    return JSON.stringify(r, null, 2);
  switch (e) {
    case "format_recommendations_list":
      return oh(r.tasks, "Tasks");
    case "format_complete_recommendation": {
      const t = r;
      let n = t.message;
      return t.new_value && (n += `

New value: "${t.new_value}"`), n;
    }
    default:
      return JSON.stringify(r, null, 2);
  }
}
function ah(r) {
  return async (e, t) => {
    const n = r.method === "POST" ? e : void 0, s = await rc(r.endpoint, n), a = sh(s, r.responseFormatter);
    return r.outputSchema ? {
      content: [
        {
          type: "text",
          text: a
        }
      ],
      structuredContent: s
    } : {
      content: [
        {
          type: "text",
          text: a
        }
      ]
    };
  };
}
async function ih() {
  var n;
  const r = new Xf(
    {
      name: "progress-planner",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  ), t = await rc("/tools");
  if (!t.success || !t.tools)
    throw new Error("Failed to fetch tool definitions from API");
  for (const s of t.tools) {
    const a = s.inputSchema.properties ? jn(
      s.inputSchema.properties,
      s.inputSchema.required || []
    ) : {}, i = (n = s.outputSchema) != null && n.properties ? jn(
      s.outputSchema.properties,
      s.outputSchema.required || []
    ) : void 0, o = ah(s);
    i ? r.tool(s.name, s.description, a, o, {
      outputSchema: i
    }) : r.tool(s.name, s.description, a, o);
  }
  return r;
}
const ro = async () => {
  try {
    const r = await ih();
    await new Ou().registerServer({
      name: "progress-planner",
      version: "1.0.0",
      description: "Manage Progress Planner recommendations, including viewing active and completed recommendations, and completing recommendations through AI assistance.",
      server: r
    }), to(
      "Progress Planner MCP Server registered with Angie successfully"
    );
  } catch (r) {
    to("Failed to register Progress Planner MCP Server with Angie", {
      error: r
    }), typeof window < "u" && window.console && window.console.error(
      "Failed to register Progress Planner MCP Server with Angie:",
      r
    );
  }
};
function oh(r, e) {
  if (!r || r.length === 0)
    return `No ${e.toLowerCase()} found.`;
  let t = `## ${e} (${r.length})

`;
  return r.forEach((n, s) => {
    t += `### ${s + 1}. ${n.title}
`, t += `- **ID**: ${n.id}
`, t += `- **Description**: ${n.description}
`, t += `- **Priority**: ${n.priority}
`, t += `- **Status**: ${n.status}
`, n.url && (t += `- **Action URL**: ${n.url}
`), t += `
`;
  }), t;
}
typeof window < "u" && progressPlannerAngie && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  ro().catch((r) => {
    console.error(
      "Failed to initialize Progress Planner MCP Server:",
      r
    );
  });
}) : ro().catch((r) => {
  console.error(
    "Failed to initialize Progress Planner MCP Server:",
    r
  );
}));
export {
  ro as initializeServer
};
