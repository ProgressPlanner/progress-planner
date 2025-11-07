var rc = Object.defineProperty;
var sc = (r, e, t) => e in r ? rc(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var Me = (r, e, t) => sc(r, typeof e != "symbol" ? e + "" : e, t);
var fn, hr, ve, ca;
(function(r) {
  r.POST_MESSAGE = "postMessage";
})(fn || (fn = {})), (function(r) {
  r.SDK_ANGIE_READY_PING = "sdk-angie-ready-ping", r.SDK_REQUEST_CLIENT_CREATION = "sdk-request-client-creation", r.SDK_REQUEST_INIT_SERVER = "sdk-request-init-server";
})(hr || (hr = {}));
class nc {
  constructor() {
    Me(this, "isAngieReady", !1);
    Me(this, "readyPromise");
    Me(this, "readyResolve");
    if (this.readyPromise = new Promise(((s) => {
      this.readyResolve = s;
    })), typeof window > "u") return;
    let e = 0;
    const t = () => {
      if (this.isAngieReady || e >= 500) return void (!this.isAngieReady && e >= 500 && this.handleDetectionTimeout());
      const s = new MessageChannel();
      s.port1.onmessage = (a) => {
        this.handleAngieReady(a.data), s.port1.close(), s.port2.close();
      };
      const n = { type: hr.SDK_ANGIE_READY_PING, timestamp: Date.now() };
      window.postMessage(n, window.location.origin, [s.port2]), e++, setTimeout(t, 500);
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
class ac {
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
  updateStatus(e, t, s) {
    const n = this.queue.find(((a) => a.id === e));
    n && (n.status = t, s && (n.error = s), console.log(`RegistrationQueue: Updated server ${e} status to ${t}`));
  }
  async processQueue(e) {
    if (this.isProcessing) return void console.log("RegistrationQueue: Already processing queue");
    this.isProcessing = !0;
    const t = this.getPending();
    console.log(`RegistrationQueue: Processing ${t.length} pending registrations`);
    try {
      for (const s of t) try {
        await e(s), this.updateStatus(s.id, "registered");
      } catch (n) {
        const a = n instanceof Error ? n.message : String(n);
        this.updateStatus(s.id, "failed", a), console.error(`RegistrationQueue: Failed to process registration ${s.id}:`, a);
      }
    } finally {
      this.isProcessing = !1;
    }
  }
  clear() {
    this.queue = [], console.log("RegistrationQueue: Cleared all registrations");
  }
  remove(e) {
    const t = this.queue.findIndex(((s) => s.id === e));
    return t !== -1 && (this.queue.splice(t, 1), console.log(`RegistrationQueue: Removed registration ${e}`), !0);
  }
  generateId(e) {
    return `reg_${e.name}_${e.version}_${Date.now()}`;
  }
}
class ic {
  async requestClientCreation(e) {
    const { config: t } = e, s = { serverId: e.id, serverName: t.name, serverVersion: t.version, description: t.description, transport: fn.POST_MESSAGE, capabilities: t.capabilities };
    return new Promise(((n, a) => {
      const i = new MessageChannel(), o = setTimeout((() => {
        a(new Error("Client creation request timed out after 10000ms"));
      }), 1e4);
      i.port1.onmessage = (u) => {
        clearTimeout(o), n(u.data);
      };
      const c = { type: hr.SDK_REQUEST_CLIENT_CREATION, payload: s, timestamp: Date.now() };
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
    for (const s of e) t[s] = s;
    return t;
  }, r.getValidEnumValues = (e) => {
    const t = r.objectKeys(e).filter(((n) => typeof e[e[n]] != "number")), s = {};
    for (const n of t) s[n] = e[n];
    return r.objectValues(s);
  }, r.objectValues = (e) => r.objectKeys(e).map((function(t) {
    return e[t];
  })), r.objectKeys = typeof Object.keys == "function" ? (e) => Object.keys(e) : (e) => {
    const t = [];
    for (const s in e) Object.prototype.hasOwnProperty.call(e, s) && t.push(s);
    return t;
  }, r.find = (e, t) => {
    for (const s of e) if (t(s)) return s;
  }, r.isInteger = typeof Number.isInteger == "function" ? (e) => Number.isInteger(e) : (e) => typeof e == "number" && Number.isFinite(e) && Math.floor(e) === e, r.joinValues = function(e, t = " | ") {
    return e.map(((s) => typeof s == "string" ? `'${s}'` : s)).join(t);
  }, r.jsonStringifyReplacer = (e, t) => typeof t == "bigint" ? t.toString() : t;
})(ve || (ve = {})), (function(r) {
  r.mergeShapes = (e, t) => ({ ...e, ...t });
})(ca || (ca = {}));
const Q = ve.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]), jt = (r) => {
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
class xt extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, s = { _errors: [] }, n = (a) => {
      for (const i of a.issues) if (i.code === "invalid_union") i.unionErrors.map(n);
      else if (i.code === "invalid_return_type") n(i.returnTypeError);
      else if (i.code === "invalid_arguments") n(i.argumentsError);
      else if (i.path.length === 0) s._errors.push(t(i));
      else {
        let o = s, c = 0;
        for (; c < i.path.length; ) {
          const u = i.path[c];
          c === i.path.length - 1 ? (o[u] = o[u] || { _errors: [] }, o[u]._errors.push(t(i))) : o[u] = o[u] || { _errors: [] }, o = o[u], c++;
        }
      }
    };
    return n(this), s;
  }
  static assert(e) {
    if (!(e instanceof xt)) throw new Error(`Not a ZodError: ${e}`);
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
    const t = {}, s = [];
    for (const n of this.issues) n.path.length > 0 ? (t[n.path[0]] = t[n.path[0]] || [], t[n.path[0]].push(e(n))) : s.push(e(n));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
xt.create = (r) => new xt(r);
const hn = (r, e) => {
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
let oc = hn;
function H(r, e) {
  const t = oc, s = ((n) => {
    const { data: a, path: i, errorMaps: o, issueData: c } = n, u = [...i, ...c.path || []], l = { ...c, path: u };
    if (c.message !== void 0) return { ...c, path: u, message: c.message };
    let S = "";
    const w = o.filter(((v) => !!v)).slice().reverse();
    for (const v of w) S = v(l, { data: a, defaultError: S }).message;
    return { ...c, path: u, message: S };
  })({ issueData: e, data: r.data, path: r.path, errorMaps: [r.common.contextualErrorMap, r.schemaErrorMap, t, t === hn ? void 0 : hn].filter(((n) => !!n)) });
  r.common.issues.push(s);
}
class He {
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
    const s = [];
    for (const n of t) {
      if (n.status === "aborted") return ie;
      n.status === "dirty" && e.dirty(), s.push(n.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const n of t) {
      const a = await n.key, i = await n.value;
      s.push({ key: a, value: i });
    }
    return He.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const n of t) {
      const { key: a, value: i } = n;
      if (a.status === "aborted" || i.status === "aborted") return ie;
      a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), a.value === "__proto__" || i.value === void 0 && !n.alwaysSet || (s[a.value] = i.value);
    }
    return { status: e.value, value: s };
  }
}
const ie = Object.freeze({ status: "aborted" }), mn = (r) => ({ status: "dirty", value: r }), st = (r) => ({ status: "valid", value: r }), ua = (r) => r.status === "aborted", da = (r) => r.status === "dirty", sr = (r) => r.status === "valid", ls = (r) => typeof Promise < "u" && r instanceof Promise;
var re;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(re || (re = {}));
class yt {
  constructor(e, t, s, n) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const la = (r, e) => {
  if (sr(e)) return { success: !0, data: e.value };
  if (!r.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return { success: !1, get error() {
    if (this._error) return this._error;
    const t = new xt(r.common.issues);
    return this._error = t, this._error;
  } };
};
function le(r) {
  if (!r) return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: n } = r;
  if (e && (t || s)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (a, i) => {
    const { message: o } = r;
    return a.code === "invalid_enum_value" ? { message: o ?? i.defaultError } : i.data === void 0 ? { message: o ?? s ?? i.defaultError } : a.code !== "invalid_type" ? { message: i.defaultError } : { message: o ?? t ?? i.defaultError };
  }, description: n };
}
class ye {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return jt(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || { common: e.parent.common, data: e.data, parsedType: jt(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent };
  }
  _processInputParams(e) {
    return { status: new He(), ctx: { common: e.parent.common, data: e.data, parsedType: jt(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent } };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (ls(t)) throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success) return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    const s = { common: { issues: [], async: (t == null ? void 0 : t.async) ?? !1, contextualErrorMap: t == null ? void 0 : t.errorMap }, path: (t == null ? void 0 : t.path) || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: jt(e) }, n = this._parseSync({ data: e, path: s.path, parent: s });
    return la(s, n);
  }
  "~validate"(e) {
    var s, n;
    const t = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: jt(e) };
    if (!this["~standard"].async) try {
      const a = this._parseSync({ data: e, path: [], parent: t });
      return sr(a) ? { value: a.value } : { issues: t.common.issues };
    } catch (a) {
      (n = (s = a == null ? void 0 : a.message) == null ? void 0 : s.toLowerCase()) != null && n.includes("encountered") && (this["~standard"].async = !0), t.common = { issues: [], async: !0 };
    }
    return this._parseAsync({ data: e, path: [], parent: t }).then(((a) => sr(a) ? { value: a.value } : { issues: t.common.issues }));
  }
  async parseAsync(e, t) {
    const s = await this.safeParseAsync(e, t);
    if (s.success) return s.data;
    throw s.error;
  }
  async safeParseAsync(e, t) {
    const s = { common: { issues: [], contextualErrorMap: t == null ? void 0 : t.errorMap, async: !0 }, path: (t == null ? void 0 : t.path) || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: jt(e) }, n = this._parse({ data: e, path: s.path, parent: s }), a = await (ls(n) ? n : Promise.resolve(n));
    return la(s, a);
  }
  refine(e, t) {
    const s = (n) => typeof t == "string" || t === void 0 ? { message: t } : typeof t == "function" ? t(n) : t;
    return this._refinement(((n, a) => {
      const i = e(n), o = () => a.addIssue({ code: q.custom, ...s(n) });
      return typeof Promise < "u" && i instanceof Promise ? i.then(((c) => !!c || (o(), !1))) : !!i || (o(), !1);
    }));
  }
  refinement(e, t) {
    return this._refinement(((s, n) => !!e(s) || (n.addIssue(typeof t == "function" ? t(s, n) : t), !1)));
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
    return Tt.create(this, this._def);
  }
  nullable() {
    return Bt.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return pt.create(this);
  }
  promise() {
    return gs.create(this, this._def);
  }
  or(e) {
    return hs.create([this, e], this._def);
  }
  and(e) {
    return ms.create(this, e, this._def);
  }
  transform(e) {
    return new Ut({ ...le(this._def), schema: this, typeName: ce.ZodEffects, effect: { type: "transform", transform: e } });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ys({ ...le(this._def), innerType: this, defaultValue: t, typeName: ce.ZodDefault });
  }
  brand() {
    return new no({ typeName: ce.ZodBranded, type: this, ...le(this._def) });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new _s({ ...le(this._def), innerType: this, catchValue: t, typeName: ce.ZodCatch });
  }
  describe(e) {
    return new this.constructor({ ...this._def, description: e });
  }
  pipe(e) {
    return Vn.create(this, e);
  }
  readonly() {
    return vs.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const cc = /^c[^\s-]{8,}$/i, uc = /^[0-9a-z]+$/, dc = /^[0-9A-HJKMNP-TV-Z]{26}$/i, lc = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, fc = /^[a-z0-9_-]{21}$/i, hc = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, mc = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, pc = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
let Js;
const gc = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, yc = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, _c = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, vc = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, bc = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, wc = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, to = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", $c = new RegExp(`^${to}$`);
function ro(r) {
  let e = "[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), `([01]\\d|2[0-3]):[0-5]\\d(:${e})${r.precision ? "+" : "?"}`;
}
function kc(r) {
  let e = `${to}T${ro(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Sc(r, e) {
  if (!hc.test(r)) return !1;
  try {
    const [t] = r.split("."), s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), n = JSON.parse(atob(s));
    return !(typeof n != "object" || n === null || "typ" in n && (n == null ? void 0 : n.typ) !== "JWT" || !n.alg || e && n.alg !== e);
  } catch {
    return !1;
  }
}
function Pc(r, e) {
  return !(e !== "v4" && e || !yc.test(r)) || !(e !== "v6" && e || !vc.test(r));
}
class Pt extends ye {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== Q.string) {
      const i = this._getOrReturnCtx(e);
      return H(i, { code: q.invalid_type, expected: Q.string, received: i.parsedType }), ie;
    }
    const t = new He();
    let s;
    for (const i of this._def.checks) if (i.kind === "min") e.data.length < i.value && (s = this._getOrReturnCtx(e, s), H(s, { code: q.too_small, minimum: i.value, type: "string", inclusive: !0, exact: !1, message: i.message }), t.dirty());
    else if (i.kind === "max") e.data.length > i.value && (s = this._getOrReturnCtx(e, s), H(s, { code: q.too_big, maximum: i.value, type: "string", inclusive: !0, exact: !1, message: i.message }), t.dirty());
    else if (i.kind === "length") {
      const o = e.data.length > i.value, c = e.data.length < i.value;
      (o || c) && (s = this._getOrReturnCtx(e, s), o ? H(s, { code: q.too_big, maximum: i.value, type: "string", inclusive: !0, exact: !0, message: i.message }) : c && H(s, { code: q.too_small, minimum: i.value, type: "string", inclusive: !0, exact: !0, message: i.message }), t.dirty());
    } else if (i.kind === "email") pc.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "email", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "emoji") Js || (Js = new RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), Js.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "emoji", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "uuid") lc.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "uuid", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "nanoid") fc.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "nanoid", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "cuid") cc.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "cuid", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "cuid2") uc.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "cuid2", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "ulid") dc.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "ulid", code: q.invalid_string, message: i.message }), t.dirty());
    else if (i.kind === "url") try {
      new URL(e.data);
    } catch {
      s = this._getOrReturnCtx(e, s), H(s, { validation: "url", code: q.invalid_string, message: i.message }), t.dirty();
    }
    else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "regex", code: q.invalid_string, message: i.message }), t.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (s = this._getOrReturnCtx(e, s), H(s, { code: q.invalid_string, validation: { includes: i.value, position: i.position }, message: i.message }), t.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (s = this._getOrReturnCtx(e, s), H(s, { code: q.invalid_string, validation: { startsWith: i.value }, message: i.message }), t.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (s = this._getOrReturnCtx(e, s), H(s, { code: q.invalid_string, validation: { endsWith: i.value }, message: i.message }), t.dirty()) : i.kind === "datetime" ? kc(i).test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { code: q.invalid_string, validation: "datetime", message: i.message }), t.dirty()) : i.kind === "date" ? $c.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { code: q.invalid_string, validation: "date", message: i.message }), t.dirty()) : i.kind === "time" ? new RegExp(`^${ro(i)}$`).test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { code: q.invalid_string, validation: "time", message: i.message }), t.dirty()) : i.kind === "duration" ? mc.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "duration", code: q.invalid_string, message: i.message }), t.dirty()) : i.kind === "ip" ? (n = e.data, ((a = i.version) !== "v4" && a || !gc.test(n)) && (a !== "v6" && a || !_c.test(n)) && (s = this._getOrReturnCtx(e, s), H(s, { validation: "ip", code: q.invalid_string, message: i.message }), t.dirty())) : i.kind === "jwt" ? Sc(e.data, i.alg) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "jwt", code: q.invalid_string, message: i.message }), t.dirty()) : i.kind === "cidr" ? Pc(e.data, i.version) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "cidr", code: q.invalid_string, message: i.message }), t.dirty()) : i.kind === "base64" ? bc.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "base64", code: q.invalid_string, message: i.message }), t.dirty()) : i.kind === "base64url" ? wc.test(e.data) || (s = this._getOrReturnCtx(e, s), H(s, { validation: "base64url", code: q.invalid_string, message: i.message }), t.dirty()) : ve.assertNever(i);
    var n, a;
    return { status: t.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement(((n) => e.test(n)), { validation: t, code: q.invalid_string, ...re.errToObj(s) });
  }
  _addCheck(e) {
    return new Pt({ ...this._def, checks: [...this._def.checks, e] });
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
    return new Pt({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new Pt({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new Pt({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
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
function Rc(r, e) {
  const t = (r.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, n = t > s ? t : s;
  return Number.parseInt(r.toFixed(n).replace(".", "")) % Number.parseInt(e.toFixed(n).replace(".", "")) / 10 ** n;
}
Pt.create = (r) => new Pt({ checks: [], typeName: ce.ZodString, coerce: (r == null ? void 0 : r.coerce) ?? !1, ...le(r) });
class nr extends ye {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== Q.number) {
      const n = this._getOrReturnCtx(e);
      return H(n, { code: q.invalid_type, expected: Q.number, received: n.parsedType }), ie;
    }
    let t;
    const s = new He();
    for (const n of this._def.checks) n.kind === "int" ? ve.isInteger(e.data) || (t = this._getOrReturnCtx(e, t), H(t, { code: q.invalid_type, expected: "integer", received: "float", message: n.message }), s.dirty()) : n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (t = this._getOrReturnCtx(e, t), H(t, { code: q.too_small, minimum: n.value, type: "number", inclusive: n.inclusive, exact: !1, message: n.message }), s.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (t = this._getOrReturnCtx(e, t), H(t, { code: q.too_big, maximum: n.value, type: "number", inclusive: n.inclusive, exact: !1, message: n.message }), s.dirty()) : n.kind === "multipleOf" ? Rc(e.data, n.value) !== 0 && (t = this._getOrReturnCtx(e, t), H(t, { code: q.not_multiple_of, multipleOf: n.value, message: n.message }), s.dirty()) : n.kind === "finite" ? Number.isFinite(e.data) || (t = this._getOrReturnCtx(e, t), H(t, { code: q.not_finite, message: n.message }), s.dirty()) : ve.assertNever(n);
    return { status: s.value, value: e.data };
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
  setLimit(e, t, s, n) {
    return new nr({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s, message: re.toString(n) }] });
  }
  _addCheck(e) {
    return new nr({ ...this._def, checks: [...this._def.checks, e] });
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
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf") return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
nr.create = (r) => new nr({ checks: [], typeName: ce.ZodNumber, coerce: (r == null ? void 0 : r.coerce) || !1, ...le(r) });
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
    const s = new He();
    for (const n of this._def.checks) n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (t = this._getOrReturnCtx(e, t), H(t, { code: q.too_small, type: "bigint", minimum: n.value, inclusive: n.inclusive, message: n.message }), s.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (t = this._getOrReturnCtx(e, t), H(t, { code: q.too_big, type: "bigint", maximum: n.value, inclusive: n.inclusive, message: n.message }), s.dirty()) : n.kind === "multipleOf" ? e.data % n.value !== BigInt(0) && (t = this._getOrReturnCtx(e, t), H(t, { code: q.not_multiple_of, multipleOf: n.value, message: n.message }), s.dirty()) : ve.assertNever(n);
    return { status: s.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return H(t, { code: q.invalid_type, expected: Q.bigint, received: t.parsedType }), ie;
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
  setLimit(e, t, s, n) {
    return new mr({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s, message: re.toString(n) }] });
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
class pn extends ye {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== Q.boolean) {
      const t = this._getOrReturnCtx(e);
      return H(t, { code: q.invalid_type, expected: Q.boolean, received: t.parsedType }), ie;
    }
    return st(e.data);
  }
}
pn.create = (r) => new pn({ typeName: ce.ZodBoolean, coerce: (r == null ? void 0 : r.coerce) || !1, ...le(r) });
class fs extends ye {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== Q.date) {
      const n = this._getOrReturnCtx(e);
      return H(n, { code: q.invalid_type, expected: Q.date, received: n.parsedType }), ie;
    }
    if (Number.isNaN(e.data.getTime())) return H(this._getOrReturnCtx(e), { code: q.invalid_date }), ie;
    const t = new He();
    let s;
    for (const n of this._def.checks) n.kind === "min" ? e.data.getTime() < n.value && (s = this._getOrReturnCtx(e, s), H(s, { code: q.too_small, message: n.message, inclusive: !0, exact: !1, minimum: n.value, type: "date" }), t.dirty()) : n.kind === "max" ? e.data.getTime() > n.value && (s = this._getOrReturnCtx(e, s), H(s, { code: q.too_big, message: n.message, inclusive: !0, exact: !1, maximum: n.value, type: "date" }), t.dirty()) : ve.assertNever(n);
    return { status: t.value, value: new Date(e.data.getTime()) };
  }
  _addCheck(e) {
    return new fs({ ...this._def, checks: [...this._def.checks, e] });
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
fs.create = (r) => new fs({ checks: [], coerce: (r == null ? void 0 : r.coerce) || !1, typeName: ce.ZodDate, ...le(r) });
class fa extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.symbol) {
      const t = this._getOrReturnCtx(e);
      return H(t, { code: q.invalid_type, expected: Q.symbol, received: t.parsedType }), ie;
    }
    return st(e.data);
  }
}
fa.create = (r) => new fa({ typeName: ce.ZodSymbol, ...le(r) });
class gn extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.undefined) {
      const t = this._getOrReturnCtx(e);
      return H(t, { code: q.invalid_type, expected: Q.undefined, received: t.parsedType }), ie;
    }
    return st(e.data);
  }
}
gn.create = (r) => new gn({ typeName: ce.ZodUndefined, ...le(r) });
class yn extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.null) {
      const t = this._getOrReturnCtx(e);
      return H(t, { code: q.invalid_type, expected: Q.null, received: t.parsedType }), ie;
    }
    return st(e.data);
  }
}
yn.create = (r) => new yn({ typeName: ce.ZodNull, ...le(r) });
class ha extends ye {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return st(e.data);
  }
}
ha.create = (r) => new ha({ typeName: ce.ZodAny, ...le(r) });
class _n extends ye {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return st(e.data);
  }
}
_n.create = (r) => new _n({ typeName: ce.ZodUnknown, ...le(r) });
class qt extends ye {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return H(t, { code: q.invalid_type, expected: Q.never, received: t.parsedType }), ie;
  }
}
qt.create = (r) => new qt({ typeName: ce.ZodNever, ...le(r) });
class ma extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.undefined) {
      const t = this._getOrReturnCtx(e);
      return H(t, { code: q.invalid_type, expected: Q.void, received: t.parsedType }), ie;
    }
    return st(e.data);
  }
}
ma.create = (r) => new ma({ typeName: ce.ZodVoid, ...le(r) });
class pt extends ye {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), n = this._def;
    if (t.parsedType !== Q.array) return H(t, { code: q.invalid_type, expected: Q.array, received: t.parsedType }), ie;
    if (n.exactLength !== null) {
      const i = t.data.length > n.exactLength.value, o = t.data.length < n.exactLength.value;
      (i || o) && (H(t, { code: i ? q.too_big : q.too_small, minimum: o ? n.exactLength.value : void 0, maximum: i ? n.exactLength.value : void 0, type: "array", inclusive: !0, exact: !0, message: n.exactLength.message }), s.dirty());
    }
    if (n.minLength !== null && t.data.length < n.minLength.value && (H(t, { code: q.too_small, minimum: n.minLength.value, type: "array", inclusive: !0, exact: !1, message: n.minLength.message }), s.dirty()), n.maxLength !== null && t.data.length > n.maxLength.value && (H(t, { code: q.too_big, maximum: n.maxLength.value, type: "array", inclusive: !0, exact: !1, message: n.maxLength.message }), s.dirty()), t.common.async) return Promise.all([...t.data].map(((i, o) => n.type._parseAsync(new yt(t, i, t.path, o))))).then(((i) => He.mergeArray(s, i)));
    const a = [...t.data].map(((i, o) => n.type._parseSync(new yt(t, i, t.path, o))));
    return He.mergeArray(s, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new pt({ ...this._def, minLength: { value: e, message: re.toString(t) } });
  }
  max(e, t) {
    return new pt({ ...this._def, maxLength: { value: e, message: re.toString(t) } });
  }
  length(e, t) {
    return new pt({ ...this._def, exactLength: { value: e, message: re.toString(t) } });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
function tr(r) {
  if (r instanceof Oe) {
    const e = {};
    for (const t in r.shape) {
      const s = r.shape[t];
      e[t] = Tt.create(tr(s));
    }
    return new Oe({ ...r._def, shape: () => e });
  }
  return r instanceof pt ? new pt({ ...r._def, type: tr(r.element) }) : r instanceof Tt ? Tt.create(tr(r.unwrap())) : r instanceof Bt ? Bt.create(tr(r.unwrap())) : r instanceof Ht ? Ht.create(r.items.map(((e) => tr(e)))) : r;
}
pt.create = (r, e) => new pt({ type: r, minLength: null, maxLength: null, exactLength: null, typeName: ce.ZodArray, ...le(e) });
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
      return H(c, { code: q.invalid_type, expected: Q.object, received: c.parsedType }), ie;
    }
    const { status: t, ctx: s } = this._processInputParams(e), { shape: n, keys: a } = this._getCached(), i = [];
    if (!(this._def.catchall instanceof qt && this._def.unknownKeys === "strip")) for (const c in s.data) a.includes(c) || i.push(c);
    const o = [];
    for (const c of a) {
      const u = n[c], l = s.data[c];
      o.push({ key: { status: "valid", value: c }, value: u._parse(new yt(s, l, s.path, c)), alwaysSet: c in s.data });
    }
    if (this._def.catchall instanceof qt) {
      const c = this._def.unknownKeys;
      if (c === "passthrough") for (const u of i) o.push({ key: { status: "valid", value: u }, value: { status: "valid", value: s.data[u] } });
      else if (c === "strict") i.length > 0 && (H(s, { code: q.unrecognized_keys, keys: i }), t.dirty());
      else if (c !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const u of i) {
        const l = s.data[u];
        o.push({ key: { status: "valid", value: u }, value: c._parse(new yt(s, l, s.path, u)), alwaysSet: u in s.data });
      }
    }
    return s.common.async ? Promise.resolve().then((async () => {
      const c = [];
      for (const u of o) {
        const l = await u.key, S = await u.value;
        c.push({ key: l, value: S, alwaysSet: u.alwaysSet });
      }
      return c;
    })).then(((c) => He.mergeObjectSync(t, c))) : He.mergeObjectSync(t, o);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return re.errToObj, new Oe({ ...this._def, unknownKeys: "strict", ...e !== void 0 ? { errorMap: (t, s) => {
      var a, i;
      const n = ((i = (a = this._def).errorMap) == null ? void 0 : i.call(a, t, s).message) ?? s.defaultError;
      return t.code === "unrecognized_keys" ? { message: re.errToObj(e).message ?? n } : { message: n };
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
    for (const s of ve.objectKeys(e)) e[s] && this.shape[s] && (t[s] = this.shape[s]);
    return new Oe({ ...this._def, shape: () => t });
  }
  omit(e) {
    const t = {};
    for (const s of ve.objectKeys(this.shape)) e[s] || (t[s] = this.shape[s]);
    return new Oe({ ...this._def, shape: () => t });
  }
  deepPartial() {
    return tr(this);
  }
  partial(e) {
    const t = {};
    for (const s of ve.objectKeys(this.shape)) {
      const n = this.shape[s];
      e && !e[s] ? t[s] = n : t[s] = n.optional();
    }
    return new Oe({ ...this._def, shape: () => t });
  }
  required(e) {
    const t = {};
    for (const s of ve.objectKeys(this.shape)) if (e && !e[s]) t[s] = this.shape[s];
    else {
      let n = this.shape[s];
      for (; n instanceof Tt; ) n = n._def.innerType;
      t[s] = n;
    }
    return new Oe({ ...this._def, shape: () => t });
  }
  keyof() {
    return so(ve.objectKeys(this.shape));
  }
}
Oe.create = (r, e) => new Oe({ shape: () => r, unknownKeys: "strip", catchall: qt.create(), typeName: ce.ZodObject, ...le(e) }), Oe.strictCreate = (r, e) => new Oe({ shape: () => r, unknownKeys: "strict", catchall: qt.create(), typeName: ce.ZodObject, ...le(e) }), Oe.lazycreate = (r, e) => new Oe({ shape: r, unknownKeys: "strip", catchall: qt.create(), typeName: ce.ZodObject, ...le(e) });
class hs extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    if (t.common.async) return Promise.all(s.map((async (n) => {
      const a = { ...t, common: { ...t.common, issues: [] }, parent: null };
      return { result: await n._parseAsync({ data: t.data, path: t.path, parent: a }), ctx: a };
    }))).then((function(n) {
      for (const i of n) if (i.result.status === "valid") return i.result;
      for (const i of n) if (i.result.status === "dirty") return t.common.issues.push(...i.ctx.common.issues), i.result;
      const a = n.map(((i) => new xt(i.ctx.common.issues)));
      return H(t, { code: q.invalid_union, unionErrors: a }), ie;
    }));
    {
      let n;
      const a = [];
      for (const o of s) {
        const c = { ...t, common: { ...t.common, issues: [] }, parent: null }, u = o._parseSync({ data: t.data, path: t.path, parent: c });
        if (u.status === "valid") return u;
        u.status !== "dirty" || n || (n = { result: u, ctx: c }), c.common.issues.length && a.push(c.common.issues);
      }
      if (n) return t.common.issues.push(...n.ctx.common.issues), n.result;
      const i = a.map(((o) => new xt(o)));
      return H(t, { code: q.invalid_union, unionErrors: i }), ie;
    }
  }
  get options() {
    return this._def.options;
  }
}
hs.create = (r, e) => new hs({ options: r, typeName: ce.ZodUnion, ...le(e) });
const At = (r) => r instanceof bn ? At(r.schema) : r instanceof Ut ? At(r.innerType()) : r instanceof ps ? [r.value] : r instanceof Kt ? r.options : r instanceof wn ? ve.objectValues(r.enum) : r instanceof ys ? At(r._def.innerType) : r instanceof gn ? [void 0] : r instanceof yn ? [null] : r instanceof Tt ? [void 0, ...At(r.unwrap())] : r instanceof Bt ? [null, ...At(r.unwrap())] : r instanceof no || r instanceof vs ? At(r.unwrap()) : r instanceof _s ? At(r._def.innerType) : [];
class zn extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== Q.object) return H(t, { code: q.invalid_type, expected: Q.object, received: t.parsedType }), ie;
    const s = this.discriminator, n = t.data[s], a = this.optionsMap.get(n);
    return a ? t.common.async ? a._parseAsync({ data: t.data, path: t.path, parent: t }) : a._parseSync({ data: t.data, path: t.path, parent: t }) : (H(t, { code: q.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [s] }), ie);
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
  static create(e, t, s) {
    const n = /* @__PURE__ */ new Map();
    for (const a of t) {
      const i = At(a.shape[e]);
      if (!i.length) throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of i) {
        if (n.has(o)) throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        n.set(o, a);
      }
    }
    return new zn({ typeName: ce.ZodDiscriminatedUnion, discriminator: e, options: t, optionsMap: n, ...le(s) });
  }
}
function vn(r, e) {
  const t = jt(r), s = jt(e);
  if (r === e) return { valid: !0, data: r };
  if (t === Q.object && s === Q.object) {
    const n = ve.objectKeys(e), a = ve.objectKeys(r).filter(((o) => n.indexOf(o) !== -1)), i = { ...r, ...e };
    for (const o of a) {
      const c = vn(r[o], e[o]);
      if (!c.valid) return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  }
  if (t === Q.array && s === Q.array) {
    if (r.length !== e.length) return { valid: !1 };
    const n = [];
    for (let a = 0; a < r.length; a++) {
      const i = vn(r[a], e[a]);
      if (!i.valid) return { valid: !1 };
      n.push(i.data);
    }
    return { valid: !0, data: n };
  }
  return t === Q.date && s === Q.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class ms extends ye {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = (a, i) => {
      if (ua(a) || ua(i)) return ie;
      const o = vn(a.value, i.value);
      return o.valid ? ((da(a) || da(i)) && t.dirty(), { status: t.value, value: o.data }) : (H(s, { code: q.invalid_intersection_types }), ie);
    };
    return s.common.async ? Promise.all([this._def.left._parseAsync({ data: s.data, path: s.path, parent: s }), this._def.right._parseAsync({ data: s.data, path: s.path, parent: s })]).then((([a, i]) => n(a, i))) : n(this._def.left._parseSync({ data: s.data, path: s.path, parent: s }), this._def.right._parseSync({ data: s.data, path: s.path, parent: s }));
  }
}
ms.create = (r, e, t) => new ms({ left: r, right: e, typeName: ce.ZodIntersection, ...le(t) });
class Ht extends ye {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== Q.array) return H(s, { code: q.invalid_type, expected: Q.array, received: s.parsedType }), ie;
    if (s.data.length < this._def.items.length) return H(s, { code: q.too_small, minimum: this._def.items.length, inclusive: !0, exact: !1, type: "array" }), ie;
    !this._def.rest && s.data.length > this._def.items.length && (H(s, { code: q.too_big, maximum: this._def.items.length, inclusive: !0, exact: !1, type: "array" }), t.dirty());
    const n = [...s.data].map(((a, i) => {
      const o = this._def.items[i] || this._def.rest;
      return o ? o._parse(new yt(s, a, s.path, i)) : null;
    })).filter(((a) => !!a));
    return s.common.async ? Promise.all(n).then(((a) => He.mergeArray(t, a))) : He.mergeArray(t, n);
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
class Ln extends ye {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== Q.object) return H(s, { code: q.invalid_type, expected: Q.object, received: s.parsedType }), ie;
    const n = [], a = this._def.keyType, i = this._def.valueType;
    for (const o in s.data) n.push({ key: a._parse(new yt(s, o, s.path, o)), value: i._parse(new yt(s, s.data[o], s.path, o)), alwaysSet: o in s.data });
    return s.common.async ? He.mergeObjectAsync(t, n) : He.mergeObjectSync(t, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return new Ln(t instanceof ye ? { keyType: e, valueType: t, typeName: ce.ZodRecord, ...le(s) } : { keyType: Pt.create(), valueType: e, typeName: ce.ZodRecord, ...le(t) });
  }
}
class pa extends ye {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== Q.map) return H(s, { code: q.invalid_type, expected: Q.map, received: s.parsedType }), ie;
    const n = this._def.keyType, a = this._def.valueType, i = [...s.data.entries()].map((([o, c], u) => ({ key: n._parse(new yt(s, o, s.path, [u, "key"])), value: a._parse(new yt(s, c, s.path, [u, "value"])) })));
    if (s.common.async) {
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
pa.create = (r, e, t) => new pa({ valueType: e, keyType: r, typeName: ce.ZodMap, ...le(t) });
class pr extends ye {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== Q.set) return H(s, { code: q.invalid_type, expected: Q.set, received: s.parsedType }), ie;
    const n = this._def;
    n.minSize !== null && s.data.size < n.minSize.value && (H(s, { code: q.too_small, minimum: n.minSize.value, type: "set", inclusive: !0, exact: !1, message: n.minSize.message }), t.dirty()), n.maxSize !== null && s.data.size > n.maxSize.value && (H(s, { code: q.too_big, maximum: n.maxSize.value, type: "set", inclusive: !0, exact: !1, message: n.maxSize.message }), t.dirty());
    const a = this._def.valueType;
    function i(c) {
      const u = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted") return ie;
        l.status === "dirty" && t.dirty(), u.add(l.value);
      }
      return { status: t.value, value: u };
    }
    const o = [...s.data.values()].map(((c, u) => a._parse(new yt(s, c, s.path, u))));
    return s.common.async ? Promise.all(o).then(((c) => i(c))) : i(o);
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
class bn extends ye {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
bn.create = (r, e) => new bn({ getter: r, typeName: ce.ZodLazy, ...le(e) });
class ps extends ye {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return H(t, { received: t.data, code: q.invalid_literal, expected: this._def.value }), ie;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
function so(r, e) {
  return new Kt({ values: r, typeName: ce.ZodEnum, ...le(e) });
}
ps.create = (r, e) => new ps({ value: r, typeName: ce.ZodLiteral, ...le(e) });
class Kt extends ye {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return H(t, { expected: ve.joinValues(s), received: t.parsedType, code: q.invalid_type }), ie;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return H(t, { received: t.data, code: q.invalid_enum_value, options: s }), ie;
    }
    return st(e.data);
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
    return Kt.create(this.options.filter(((s) => !e.includes(s))), { ...this._def, ...t });
  }
}
Kt.create = so;
class wn extends ye {
  _parse(e) {
    const t = ve.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== Q.string && s.parsedType !== Q.number) {
      const n = ve.objectValues(t);
      return H(s, { expected: ve.joinValues(n), received: s.parsedType, code: q.invalid_type }), ie;
    }
    if (this._cache || (this._cache = new Set(ve.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const n = ve.objectValues(t);
      return H(s, { received: s.data, code: q.invalid_enum_value, options: n }), ie;
    }
    return st(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
wn.create = (r, e) => new wn({ values: r, typeName: ce.ZodNativeEnum, ...le(e) });
class gs extends ye {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== Q.promise && t.common.async === !1) return H(t, { code: q.invalid_type, expected: Q.promise, received: t.parsedType }), ie;
    const s = t.parsedType === Q.promise ? t.data : Promise.resolve(t.data);
    return st(s.then(((n) => this._def.type.parseAsync(n, { path: t.path, errorMap: t.common.contextualErrorMap }))));
  }
}
gs.create = (r, e) => new gs({ type: r, typeName: ce.ZodPromise, ...le(e) });
class Ut extends ye {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ce.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = this._def.effect || null, a = { addIssue: (i) => {
      H(s, i), i.fatal ? t.abort() : t.dirty();
    }, get path() {
      return s.path;
    } };
    if (a.addIssue = a.addIssue.bind(a), n.type === "preprocess") {
      const i = n.transform(s.data, a);
      if (s.common.async) return Promise.resolve(i).then((async (o) => {
        if (t.value === "aborted") return ie;
        const c = await this._def.schema._parseAsync({ data: o, path: s.path, parent: s });
        return c.status === "aborted" ? ie : c.status === "dirty" || t.value === "dirty" ? mn(c.value) : c;
      }));
      {
        if (t.value === "aborted") return ie;
        const o = this._def.schema._parseSync({ data: i, path: s.path, parent: s });
        return o.status === "aborted" ? ie : o.status === "dirty" || t.value === "dirty" ? mn(o.value) : o;
      }
    }
    if (n.type === "refinement") {
      const i = (o) => {
        const c = n.refinement(o, a);
        if (s.common.async) return Promise.resolve(c);
        if (c instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({ data: s.data, path: s.path, parent: s });
        return o.status === "aborted" ? ie : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      }
      return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then(((o) => o.status === "aborted" ? ie : (o.status === "dirty" && t.dirty(), i(o.value).then((() => ({ status: t.value, value: o.value }))))));
    }
    if (n.type === "transform") {
      if (s.common.async === !1) {
        const i = this._def.schema._parseSync({ data: s.data, path: s.path, parent: s });
        if (!sr(i)) return ie;
        const o = n.transform(i.value, a);
        if (o instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      }
      return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then(((i) => sr(i) ? Promise.resolve(n.transform(i.value, a)).then(((o) => ({ status: t.value, value: o }))) : ie));
    }
    ve.assertNever(n);
  }
}
Ut.create = (r, e, t) => new Ut({ schema: r, typeName: ce.ZodEffects, effect: e, ...le(t) }), Ut.createWithPreprocess = (r, e, t) => new Ut({ schema: e, effect: { type: "preprocess", transform: r }, typeName: ce.ZodEffects, ...le(t) });
class Tt extends ye {
  _parse(e) {
    return this._getType(e) === Q.undefined ? st(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Tt.create = (r, e) => new Tt({ innerType: r, typeName: ce.ZodOptional, ...le(e) });
class Bt extends ye {
  _parse(e) {
    return this._getType(e) === Q.null ? st(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Bt.create = (r, e) => new Bt({ innerType: r, typeName: ce.ZodNullable, ...le(e) });
class ys extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === Q.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({ data: s, path: t.path, parent: t });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ys.create = (r, e) => new ys({ innerType: r, typeName: ce.ZodDefault, defaultValue: typeof e.default == "function" ? e.default : () => e.default, ...le(e) });
class _s extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = { ...t, common: { ...t.common, issues: [] } }, n = this._def.innerType._parse({ data: s.data, path: s.path, parent: { ...s } });
    return ls(n) ? n.then(((a) => ({ status: "valid", value: a.status === "valid" ? a.value : this._def.catchValue({ get error() {
      return new xt(s.common.issues);
    }, input: s.data }) }))) : { status: "valid", value: n.status === "valid" ? n.value : this._def.catchValue({ get error() {
      return new xt(s.common.issues);
    }, input: s.data }) };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
_s.create = (r, e) => new _s({ innerType: r, typeName: ce.ZodCatch, catchValue: typeof e.catch == "function" ? e.catch : () => e.catch, ...le(e) });
class ga extends ye {
  _parse(e) {
    if (this._getType(e) !== Q.nan) {
      const t = this._getOrReturnCtx(e);
      return H(t, { code: q.invalid_type, expected: Q.nan, received: t.parsedType }), ie;
    }
    return { status: "valid", value: e.data };
  }
}
ga.create = (r) => new ga({ typeName: ce.ZodNaN, ...le(r) });
class no extends ye {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({ data: s, path: t.path, parent: t });
  }
  unwrap() {
    return this._def.type;
  }
}
class Vn extends ye {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async) return (async () => {
      const n = await this._def.in._parseAsync({ data: s.data, path: s.path, parent: s });
      return n.status === "aborted" ? ie : n.status === "dirty" ? (t.dirty(), mn(n.value)) : this._def.out._parseAsync({ data: n.value, path: s.path, parent: s });
    })();
    {
      const n = this._def.in._parseSync({ data: s.data, path: s.path, parent: s });
      return n.status === "aborted" ? ie : n.status === "dirty" ? (t.dirty(), { status: "dirty", value: n.value }) : this._def.out._parseSync({ data: n.value, path: s.path, parent: s });
    }
  }
  static create(e, t) {
    return new Vn({ in: e, out: t, typeName: ce.ZodPipeline });
  }
}
class vs extends ye {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (n) => (sr(n) && (n.value = Object.freeze(n.value)), n);
    return ls(t) ? t.then(((n) => s(n))) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
var ce;
vs.create = (r, e) => new vs({ innerType: r, typeName: ce.ZodReadonly, ...le(e) }), (function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(ce || (ce = {}));
const B = Pt.create, Ue = nr.create, tt = pn.create, gr = _n.create, Ie = (qt.create, pt.create), X = Oe.create, Fe = hs.create, Tc = zn.create, vr = (ms.create, Ht.create, Ln.create), ue = ps.create, Nt = Kt.create, M = (gs.create, Tt.create), As = (Bt.create, "2.0"), ao = Fe([B(), Ue().int()]), io = B(), Ec = X({ progressToken: M(ao) }).passthrough(), nt = X({ _meta: M(Ec) }).passthrough(), Ye = X({ method: B(), params: M(nt) }), br = X({ _meta: M(X({}).passthrough()) }).passthrough(), vt = X({ method: B(), params: M(br) }), at = X({ _meta: M(X({}).passthrough()) }).passthrough(), js = Fe([B(), Ue().int()]), xc = X({ jsonrpc: ue(As), id: js }).merge(Ye).strict(), Nc = X({ jsonrpc: ue(As) }).merge(vt).strict(), Oc = X({ jsonrpc: ue(As), id: js, result: at }).strict();
var ya;
(function(r) {
  r[r.ConnectionClosed = -32e3] = "ConnectionClosed", r[r.RequestTimeout = -32001] = "RequestTimeout", r[r.ParseError = -32700] = "ParseError", r[r.InvalidRequest = -32600] = "InvalidRequest", r[r.MethodNotFound = -32601] = "MethodNotFound", r[r.InvalidParams = -32602] = "InvalidParams", r[r.InternalError = -32603] = "InternalError";
})(ya || (ya = {}));
const Cc = Fe([xc, Nc, Oc, X({ jsonrpc: ue(As), id: js, error: X({ code: Ue().int(), message: B(), data: M(gr()) }) }).strict()]), _a = at.strict(), va = vt.extend({ method: ue("notifications/cancelled"), params: br.extend({ requestId: js, reason: B().optional() }) }), wr = X({ name: B(), title: M(B()) }).passthrough(), oo = wr.extend({ version: B() }), Ic = X({ experimental: M(X({}).passthrough()), sampling: M(X({}).passthrough()), elicitation: M(X({}).passthrough()), roots: M(X({ listChanged: M(tt()) }).passthrough()) }).passthrough(), Ac = Ye.extend({ method: ue("initialize"), params: nt.extend({ protocolVersion: B(), capabilities: Ic, clientInfo: oo }) }), jc = X({ experimental: M(X({}).passthrough()), logging: M(X({}).passthrough()), completions: M(X({}).passthrough()), prompts: M(X({ listChanged: M(tt()) }).passthrough()), resources: M(X({ subscribe: M(tt()), listChanged: M(tt()) }).passthrough()), tools: M(X({ listChanged: M(tt()) }).passthrough()) }).passthrough(), Mc = at.extend({ protocolVersion: B(), capabilities: jc, serverInfo: oo, instructions: M(B()) }), qc = vt.extend({ method: ue("notifications/initialized") }), ba = Ye.extend({ method: ue("ping") }), Dc = X({ progress: Ue(), total: M(Ue()), message: M(B()) }).passthrough(), wa = vt.extend({ method: ue("notifications/progress"), params: br.merge(Dc).extend({ progressToken: ao }) }), Ms = Ye.extend({ params: nt.extend({ cursor: M(io) }).optional() }), qs = at.extend({ nextCursor: M(io) }), co = X({ uri: B(), mimeType: M(B()), _meta: M(X({}).passthrough()) }).passthrough(), uo = co.extend({ text: B() }), lo = co.extend({ blob: B().base64() }), fo = wr.extend({ uri: B(), description: M(B()), mimeType: M(B()), _meta: M(X({}).passthrough()) }), Zc = wr.extend({ uriTemplate: B(), description: M(B()), mimeType: M(B()), _meta: M(X({}).passthrough()) }), zc = Ms.extend({ method: ue("resources/list") }), Lc = qs.extend({ resources: Ie(fo) }), Vc = Ms.extend({ method: ue("resources/templates/list") }), Fc = qs.extend({ resourceTemplates: Ie(Zc) }), Uc = Ye.extend({ method: ue("resources/read"), params: nt.extend({ uri: B() }) }), Hc = at.extend({ contents: Ie(Fe([uo, lo])) }), Kc = vt.extend({ method: ue("notifications/resources/list_changed") }), Bc = Ye.extend({ method: ue("resources/subscribe"), params: nt.extend({ uri: B() }) }), Gc = Ye.extend({ method: ue("resources/unsubscribe"), params: nt.extend({ uri: B() }) }), Jc = vt.extend({ method: ue("notifications/resources/updated"), params: br.extend({ uri: B() }) }), Wc = X({ name: B(), description: M(B()), required: M(tt()) }).passthrough(), Qc = wr.extend({ description: M(B()), arguments: M(Ie(Wc)), _meta: M(X({}).passthrough()) }), Yc = Ms.extend({ method: ue("prompts/list") }), Xc = qs.extend({ prompts: Ie(Qc) }), eu = Ye.extend({ method: ue("prompts/get"), params: nt.extend({ name: B(), arguments: M(vr(B())) }) }), Fn = X({ type: ue("text"), text: B(), _meta: M(X({}).passthrough()) }).passthrough(), Un = X({ type: ue("image"), data: B().base64(), mimeType: B(), _meta: M(X({}).passthrough()) }).passthrough(), Hn = X({ type: ue("audio"), data: B().base64(), mimeType: B(), _meta: M(X({}).passthrough()) }).passthrough(), tu = X({ type: ue("resource"), resource: Fe([uo, lo]), _meta: M(X({}).passthrough()) }).passthrough(), ho = Fe([Fn, Un, Hn, fo.extend({ type: ue("resource_link") }), tu]), ru = X({ role: Nt(["user", "assistant"]), content: ho }).passthrough(), su = at.extend({ description: M(B()), messages: Ie(ru) }), nu = vt.extend({ method: ue("notifications/prompts/list_changed") }), au = X({ title: M(B()), readOnlyHint: M(tt()), destructiveHint: M(tt()), idempotentHint: M(tt()), openWorldHint: M(tt()) }).passthrough(), iu = wr.extend({ description: M(B()), inputSchema: X({ type: ue("object"), properties: M(X({}).passthrough()), required: M(Ie(B())) }).passthrough(), outputSchema: M(X({ type: ue("object"), properties: M(X({}).passthrough()), required: M(Ie(B())) }).passthrough()), annotations: M(au), _meta: M(X({}).passthrough()) }), ou = Ms.extend({ method: ue("tools/list") }), cu = qs.extend({ tools: Ie(iu) }), mo = at.extend({ content: Ie(ho).default([]), structuredContent: X({}).passthrough().optional(), isError: M(tt()) }), uu = (mo.or(at.extend({ toolResult: gr() })), Ye.extend({ method: ue("tools/call"), params: nt.extend({ name: B(), arguments: M(vr(gr())) }) })), du = vt.extend({ method: ue("notifications/tools/list_changed") }), po = Nt(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]), lu = Ye.extend({ method: ue("logging/setLevel"), params: nt.extend({ level: po }) }), fu = vt.extend({ method: ue("notifications/message"), params: br.extend({ level: po, logger: M(B()), data: gr() }) }), hu = X({ name: B().optional() }).passthrough(), mu = X({ hints: M(Ie(hu)), costPriority: M(Ue().min(0).max(1)), speedPriority: M(Ue().min(0).max(1)), intelligencePriority: M(Ue().min(0).max(1)) }).passthrough(), pu = X({ role: Nt(["user", "assistant"]), content: Fe([Fn, Un, Hn]) }).passthrough(), gu = Ye.extend({ method: ue("sampling/createMessage"), params: nt.extend({ messages: Ie(pu), systemPrompt: M(B()), includeContext: M(Nt(["none", "thisServer", "allServers"])), temperature: M(Ue()), maxTokens: Ue().int(), stopSequences: M(Ie(B())), metadata: M(X({}).passthrough()), modelPreferences: M(mu) }) }), yu = at.extend({ model: B(), stopReason: M(Nt(["endTurn", "stopSequence", "maxTokens"]).or(B())), role: Nt(["user", "assistant"]), content: Tc("type", [Fn, Un, Hn]) }), _u = Fe([X({ type: ue("boolean"), title: M(B()), description: M(B()), default: M(tt()) }).passthrough(), X({ type: ue("string"), title: M(B()), description: M(B()), minLength: M(Ue()), maxLength: M(Ue()), format: M(Nt(["email", "uri", "date", "date-time"])) }).passthrough(), X({ type: Nt(["number", "integer"]), title: M(B()), description: M(B()), minimum: M(Ue()), maximum: M(Ue()) }).passthrough(), X({ type: ue("string"), title: M(B()), description: M(B()), enum: Ie(B()), enumNames: M(Ie(B())) }).passthrough()]), vu = Ye.extend({ method: ue("elicitation/create"), params: nt.extend({ message: B(), requestedSchema: X({ type: ue("object"), properties: vr(B(), _u), required: M(Ie(B())) }).passthrough() }) }), bu = at.extend({ action: Nt(["accept", "reject", "cancel"]), content: M(vr(B(), gr())) }), wu = X({ type: ue("ref/resource"), uri: B() }).passthrough(), $u = X({ type: ue("ref/prompt"), name: B() }).passthrough(), ku = Ye.extend({ method: ue("completion/complete"), params: nt.extend({ ref: Fe([$u, wu]), argument: X({ name: B(), value: B() }).passthrough(), context: M(X({ arguments: M(vr(B(), B())) })) }) }), Su = at.extend({ completion: X({ values: Ie(B()).max(100), total: M(Ue().int()), hasMore: M(tt()) }).passthrough() }), Pu = X({ uri: B().startsWith("file://"), name: M(B()), _meta: M(X({}).passthrough()) }).passthrough(), Ru = Ye.extend({ method: ue("roots/list") }), Tu = at.extend({ roots: Ie(Pu) }), Eu = vt.extend({ method: ue("notifications/roots/list_changed") });
Fe([ba, Ac, ku, lu, eu, Yc, zc, Vc, Uc, Bc, Gc, uu, ou]), Fe([va, wa, qc, Eu]), Fe([_a, yu, bu, Tu]), Fe([ba, gu, vu, Ru]), Fe([va, wa, fu, Jc, Kc, du, nu]), Fe([_a, Mc, Su, su, Xc, Lc, Fc, Hc, mo, cu]);
class Kn {
  constructor(e, t) {
    Me(this, "sessionId");
    Me(this, "onmessage");
    Me(this, "onerror");
    Me(this, "onclose");
    Me(this, "_port");
    Me(this, "_started", !1);
    Me(this, "_closed", !1);
    if (!e) throw new Error("MessagePort is required");
    this._port = e, this.sessionId = t || this.generateId(), this._port.onmessage = (s) => {
      var n, a;
      try {
        const i = Cc.parse(s.data);
        (n = this.onmessage) == null || n.call(this, i);
      } catch (i) {
        const o = new Error(`Failed to parse message: ${i}`);
        (a = this.onerror) == null || a.call(this, o);
      }
    }, this._port.onmessageerror = (s) => {
      var a;
      const n = new Error(`MessagePort error: ${JSON.stringify(s)}`);
      (a = this.onerror) == null || a.call(this, n);
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
    return new Promise(((t, s) => {
      var n;
      try {
        this._port.postMessage(e), t();
      } catch (a) {
        const i = a instanceof Error ? a : new Error(String(a));
        (n = this.onerror) == null || n.call(this, i), s(i);
      }
    }));
  }
  async close() {
    var e;
    this._closed || (this._closed = !0, this._port.close(), (e = this.onclose) == null || e.call(this));
  }
  generateId() {
    return Kn.generateSessionId();
  }
}
class xu {
  constructor() {
    Me(this, "angieDetector");
    Me(this, "registrationQueue");
    Me(this, "clientManager");
    Me(this, "isInitialized", !1);
    this.angieDetector = new nc(), this.registrationQueue = new ac(), this.clientManager = new ic(), this.setupAngieReadyHandler(), this.setupServerInitHandler();
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
    } catch (s) {
      const n = s instanceof Error ? s.message : String(s);
      throw this.registrationQueue.updateStatus(t.id, "failed", n), s;
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
    const { clientId: t, serverId: s } = e.data.payload || {};
    if (t && s) {
      console.log(`AngieMcpSdk: Handling server init request for clientId: ${t}, serverId: ${s}`);
      try {
        const n = this.registrationQueue.getAll().find(((c) => c.id === s));
        if (!n) return void console.error(`AngieMcpSdk: No registration found for serverId: ${s}`);
        const a = e.ports[0];
        if (!a) return void console.error("AngieMcpSdk: No port provided in server init request");
        const i = n.config.server, o = new Kn(a);
        i.connect(o), console.log(`AngieMcpSdk: Server "${n.config.name}" initialized successfully`);
      } catch (n) {
        console.error(`AngieMcpSdk: Error initializing server for clientId ${t}:`, n);
      }
    } else console.error("AngieMcpSdk: Invalid server init request - missing clientId or serverId");
  }
}
var be;
(function(r) {
  r.assertEqual = (n) => {
  };
  function e(n) {
  }
  r.assertIs = e;
  function t(n) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (n) => {
    const a = {};
    for (const i of n)
      a[i] = i;
    return a;
  }, r.getValidEnumValues = (n) => {
    const a = r.objectKeys(n).filter((o) => typeof n[n[o]] != "number"), i = {};
    for (const o of a)
      i[o] = n[o];
    return r.objectValues(i);
  }, r.objectValues = (n) => r.objectKeys(n).map(function(a) {
    return n[a];
  }), r.objectKeys = typeof Object.keys == "function" ? (n) => Object.keys(n) : (n) => {
    const a = [];
    for (const i in n)
      Object.prototype.hasOwnProperty.call(n, i) && a.push(i);
    return a;
  }, r.find = (n, a) => {
    for (const i of n)
      if (a(i))
        return i;
  }, r.isInteger = typeof Number.isInteger == "function" ? (n) => Number.isInteger(n) : (n) => typeof n == "number" && Number.isFinite(n) && Math.floor(n) === n;
  function s(n, a = " | ") {
    return n.map((i) => typeof i == "string" ? `'${i}'` : i).join(a);
  }
  r.joinValues = s, r.jsonStringifyReplacer = (n, a) => typeof a == "bigint" ? a.toString() : a;
})(be || (be = {}));
var $a;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})($a || ($a = {}));
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
]), Mt = (r) => {
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
class Ot extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, s = { _errors: [] }, n = (a) => {
      for (const i of a.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(n);
        else if (i.code === "invalid_return_type")
          n(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          n(i.argumentsError);
        else if (i.path.length === 0)
          s._errors.push(t(i));
        else {
          let o = s, c = 0;
          for (; c < i.path.length; ) {
            const u = i.path[c];
            c === i.path.length - 1 ? (o[u] = o[u] || { _errors: [] }, o[u]._errors.push(t(i))) : o[u] = o[u] || { _errors: [] }, o = o[u], c++;
          }
        }
    };
    return n(this), s;
  }
  static assert(e) {
    if (!(e instanceof Ot))
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
    const t = {}, s = [];
    for (const n of this.issues)
      if (n.path.length > 0) {
        const a = n.path[0];
        t[a] = t[a] || [], t[a].push(e(n));
      } else
        s.push(e(n));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
Ot.create = (r) => new Ot(r);
const $n = (r, e) => {
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
let Nu = $n;
function Ou() {
  return Nu;
}
const Cu = (r) => {
  const { data: e, path: t, errorMaps: s, issueData: n } = r, a = [...t, ...n.path || []], i = {
    ...n,
    path: a
  };
  if (n.message !== void 0)
    return {
      ...n,
      path: a,
      message: n.message
    };
  let o = "";
  const c = s.filter((u) => !!u).slice().reverse();
  for (const u of c)
    o = u(i, { data: e, defaultError: o }).message;
  return {
    ...n,
    path: a,
    message: o
  };
};
function K(r, e) {
  const t = Ou(), s = Cu({
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
      t === $n ? void 0 : $n
      // then global default map
    ].filter((n) => !!n)
  });
  r.common.issues.push(s);
}
class Ke {
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
    const s = [];
    for (const n of t) {
      if (n.status === "aborted")
        return oe;
      n.status === "dirty" && e.dirty(), s.push(n.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const n of t) {
      const a = await n.key, i = await n.value;
      s.push({
        key: a,
        value: i
      });
    }
    return Ke.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const n of t) {
      const { key: a, value: i } = n;
      if (a.status === "aborted" || i.status === "aborted")
        return oe;
      a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof i.value < "u" || n.alwaysSet) && (s[a.value] = i.value);
    }
    return { status: e.value, value: s };
  }
}
const oe = Object.freeze({
  status: "aborted"
}), fr = (r) => ({ status: "dirty", value: r }), it = (r) => ({ status: "valid", value: r }), ka = (r) => r.status === "aborted", Sa = (r) => r.status === "dirty", ar = (r) => r.status === "valid", bs = (r) => typeof Promise < "u" && r instanceof Promise;
var se;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(se || (se = {}));
class _t {
  constructor(e, t, s, n) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Pa = (r, e) => {
  if (ar(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new Ot(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function fe(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: n } = r;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (i, o) => {
    const { message: c } = r;
    return i.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? s ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? t ?? o.defaultError };
  }, description: n };
}
class ge {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Mt(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: Mt(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new Ke(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: Mt(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (bs(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    const s = {
      common: {
        issues: [],
        async: (t == null ? void 0 : t.async) ?? !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Mt(e)
    }, n = this._parseSync({ data: e, path: s.path, parent: s });
    return Pa(s, n);
  }
  "~validate"(e) {
    var s, n;
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Mt(e)
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
        (n = (s = a == null ? void 0 : a.message) == null ? void 0 : s.toLowerCase()) != null && n.includes("encountered") && (this["~standard"].async = !0), t.common = {
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
    const s = await this.safeParseAsync(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  async safeParseAsync(e, t) {
    const s = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Mt(e)
    }, n = this._parse({ data: e, path: s.path, parent: s }), a = await (bs(n) ? n : Promise.resolve(n));
    return Pa(s, a);
  }
  refine(e, t) {
    const s = (n) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(n) : t;
    return this._refinement((n, a) => {
      const i = e(n), o = () => a.addIssue({
        code: D.custom,
        ...s(n)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((c) => c ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, n) => e(s) ? !0 : (n.addIssue(typeof t == "function" ? t(s, n) : t), !1));
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
    return Et.create(this, this._def);
  }
  nullable() {
    return Qt.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return gt.create(this);
  }
  promise() {
    return Rs.create(this, this._def);
  }
  or(e) {
    return $s.create([this, e], this._def);
  }
  and(e) {
    return ks.create(this, e, this._def);
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
    return new Ts({
      ...fe(this._def),
      innerType: this,
      defaultValue: t,
      typeName: Z.ZodDefault
    });
  }
  brand() {
    return new vo({
      typeName: Z.ZodBranded,
      type: this,
      ...fe(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Es({
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
    return Gn.create(this, e);
  }
  readonly() {
    return xs.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Iu = /^c[^\s-]{8,}$/i, Au = /^[0-9a-z]+$/, ju = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Mu = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, qu = /^[a-z0-9_-]{21}$/i, Du = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Zu = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, zu = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Lu = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Ws;
const Vu = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Fu = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Uu = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Hu = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Ku = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Bu = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, go = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Gu = new RegExp(`^${go}$`);
function yo(r) {
  let e = "[0-5]\\d";
  r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = r.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function Ju(r) {
  return new RegExp(`^${yo(r)}$`);
}
function Wu(r) {
  let e = `${go}T${yo(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Qu(r, e) {
  return !!((e === "v4" || !e) && Vu.test(r) || (e === "v6" || !e) && Uu.test(r));
}
function Yu(r, e) {
  if (!Du.test(r))
    return !1;
  try {
    const [t] = r.split(".");
    if (!t)
      return !1;
    const s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), n = JSON.parse(atob(s));
    return !(typeof n != "object" || n === null || "typ" in n && (n == null ? void 0 : n.typ) !== "JWT" || !n.alg || e && n.alg !== e);
  } catch {
    return !1;
  }
}
function Xu(r, e) {
  return !!((e === "v4" || !e) && Fu.test(r) || (e === "v6" || !e) && Hu.test(r));
}
class Rt extends ge {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== Y.string) {
      const a = this._getOrReturnCtx(e);
      return K(a, {
        code: D.invalid_type,
        expected: Y.string,
        received: a.parsedType
      }), oe;
    }
    const s = new Ke();
    let n;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (n = this._getOrReturnCtx(e, n), K(n, {
          code: D.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), s.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (n = this._getOrReturnCtx(e, n), K(n, {
          code: D.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), s.dirty());
      else if (a.kind === "length") {
        const i = e.data.length > a.value, o = e.data.length < a.value;
        (i || o) && (n = this._getOrReturnCtx(e, n), i ? K(n, {
          code: D.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : o && K(n, {
          code: D.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), s.dirty());
      } else if (a.kind === "email")
        zu.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
          validation: "email",
          code: D.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "emoji")
        Ws || (Ws = new RegExp(Lu, "u")), Ws.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
          validation: "emoji",
          code: D.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "uuid")
        Mu.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
          validation: "uuid",
          code: D.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "nanoid")
        qu.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
          validation: "nanoid",
          code: D.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "cuid")
        Iu.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
          validation: "cuid",
          code: D.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "cuid2")
        Au.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
          validation: "cuid2",
          code: D.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "ulid")
        ju.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
          validation: "ulid",
          code: D.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          n = this._getOrReturnCtx(e, n), K(n, {
            validation: "url",
            code: D.invalid_string,
            message: a.message
          }), s.dirty();
        }
      else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
        validation: "regex",
        code: D.invalid_string,
        message: a.message
      }), s.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (n = this._getOrReturnCtx(e, n), K(n, {
        code: D.invalid_string,
        validation: { includes: a.value, position: a.position },
        message: a.message
      }), s.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (n = this._getOrReturnCtx(e, n), K(n, {
        code: D.invalid_string,
        validation: { startsWith: a.value },
        message: a.message
      }), s.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (n = this._getOrReturnCtx(e, n), K(n, {
        code: D.invalid_string,
        validation: { endsWith: a.value },
        message: a.message
      }), s.dirty()) : a.kind === "datetime" ? Wu(a).test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
        code: D.invalid_string,
        validation: "datetime",
        message: a.message
      }), s.dirty()) : a.kind === "date" ? Gu.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
        code: D.invalid_string,
        validation: "date",
        message: a.message
      }), s.dirty()) : a.kind === "time" ? Ju(a).test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
        code: D.invalid_string,
        validation: "time",
        message: a.message
      }), s.dirty()) : a.kind === "duration" ? Zu.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
        validation: "duration",
        code: D.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "ip" ? Qu(e.data, a.version) || (n = this._getOrReturnCtx(e, n), K(n, {
        validation: "ip",
        code: D.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "jwt" ? Yu(e.data, a.alg) || (n = this._getOrReturnCtx(e, n), K(n, {
        validation: "jwt",
        code: D.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "cidr" ? Xu(e.data, a.version) || (n = this._getOrReturnCtx(e, n), K(n, {
        validation: "cidr",
        code: D.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "base64" ? Ku.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
        validation: "base64",
        code: D.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "base64url" ? Bu.test(e.data) || (n = this._getOrReturnCtx(e, n), K(n, {
        validation: "base64url",
        code: D.invalid_string,
        message: a.message
      }), s.dirty()) : be.assertNever(a);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((n) => e.test(n), {
      validation: t,
      code: D.invalid_string,
      ...se.errToObj(s)
    });
  }
  _addCheck(e) {
    return new Rt({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...se.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...se.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...se.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...se.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...se.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...se.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...se.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...se.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...se.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...se.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...se.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...se.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...se.errToObj(e) });
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
      ...se.errToObj(e == null ? void 0 : e.message)
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
      ...se.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...se.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...se.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...se.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...se.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...se.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...se.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...se.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...se.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, se.errToObj(e));
  }
  trim() {
    return new Rt({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Rt({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Rt({
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
Rt.create = (r) => new Rt({
  checks: [],
  typeName: Z.ZodString,
  coerce: (r == null ? void 0 : r.coerce) ?? !1,
  ...fe(r)
});
function ed(r, e) {
  const t = (r.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, n = t > s ? t : s, a = Number.parseInt(r.toFixed(n).replace(".", "")), i = Number.parseInt(e.toFixed(n).replace(".", ""));
  return a % i / 10 ** n;
}
class ir extends ge {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== Y.number) {
      const a = this._getOrReturnCtx(e);
      return K(a, {
        code: D.invalid_type,
        expected: Y.number,
        received: a.parsedType
      }), oe;
    }
    let s;
    const n = new Ke();
    for (const a of this._def.checks)
      a.kind === "int" ? be.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), K(s, {
        code: D.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), n.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), K(s, {
        code: D.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), K(s, {
        code: D.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), n.dirty()) : a.kind === "multipleOf" ? ed(e.data, a.value) !== 0 && (s = this._getOrReturnCtx(e, s), K(s, {
        code: D.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), n.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), K(s, {
        code: D.not_finite,
        message: a.message
      }), n.dirty()) : be.assertNever(a);
    return { status: n.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, se.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, se.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, se.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, se.toString(t));
  }
  setLimit(e, t, s, n) {
    return new ir({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: se.toString(n)
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
      message: se.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: se.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: se.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: se.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: se.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: se.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: se.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: se.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: se.toString(e)
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
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf")
        return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
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
    let s;
    const n = new Ke();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), K(s, {
        code: D.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), K(s, {
        code: D.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), n.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), K(s, {
        code: D.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), n.dirty()) : be.assertNever(a);
    return { status: n.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return K(t, {
      code: D.invalid_type,
      expected: Y.bigint,
      received: t.parsedType
    }), oe;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, se.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, se.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, se.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, se.toString(t));
  }
  setLimit(e, t, s, n) {
    return new yr({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: se.toString(n)
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
      message: se.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: se.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: se.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: se.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: se.toString(t)
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
class kn extends ge {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== Y.boolean) {
      const s = this._getOrReturnCtx(e);
      return K(s, {
        code: D.invalid_type,
        expected: Y.boolean,
        received: s.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
kn.create = (r) => new kn({
  typeName: Z.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...fe(r)
});
class ws extends ge {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== Y.date) {
      const a = this._getOrReturnCtx(e);
      return K(a, {
        code: D.invalid_type,
        expected: Y.date,
        received: a.parsedType
      }), oe;
    }
    if (Number.isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return K(a, {
        code: D.invalid_date
      }), oe;
    }
    const s = new Ke();
    let n;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (n = this._getOrReturnCtx(e, n), K(n, {
        code: D.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), s.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (n = this._getOrReturnCtx(e, n), K(n, {
        code: D.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), s.dirty()) : be.assertNever(a);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new ws({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: se.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: se.toString(t)
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
ws.create = (r) => new ws({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: Z.ZodDate,
  ...fe(r)
});
class Ra extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.symbol) {
      const s = this._getOrReturnCtx(e);
      return K(s, {
        code: D.invalid_type,
        expected: Y.symbol,
        received: s.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
Ra.create = (r) => new Ra({
  typeName: Z.ZodSymbol,
  ...fe(r)
});
class Sn extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.undefined) {
      const s = this._getOrReturnCtx(e);
      return K(s, {
        code: D.invalid_type,
        expected: Y.undefined,
        received: s.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
Sn.create = (r) => new Sn({
  typeName: Z.ZodUndefined,
  ...fe(r)
});
class Pn extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.null) {
      const s = this._getOrReturnCtx(e);
      return K(s, {
        code: D.invalid_type,
        expected: Y.null,
        received: s.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
Pn.create = (r) => new Pn({
  typeName: Z.ZodNull,
  ...fe(r)
});
class Ta extends ge {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return it(e.data);
  }
}
Ta.create = (r) => new Ta({
  typeName: Z.ZodAny,
  ...fe(r)
});
class Rn extends ge {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return it(e.data);
  }
}
Rn.create = (r) => new Rn({
  typeName: Z.ZodUnknown,
  ...fe(r)
});
class Zt extends ge {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return K(t, {
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
class Ea extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.undefined) {
      const s = this._getOrReturnCtx(e);
      return K(s, {
        code: D.invalid_type,
        expected: Y.void,
        received: s.parsedType
      }), oe;
    }
    return it(e.data);
  }
}
Ea.create = (r) => new Ea({
  typeName: Z.ZodVoid,
  ...fe(r)
});
class gt extends ge {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), n = this._def;
    if (t.parsedType !== Y.array)
      return K(t, {
        code: D.invalid_type,
        expected: Y.array,
        received: t.parsedType
      }), oe;
    if (n.exactLength !== null) {
      const i = t.data.length > n.exactLength.value, o = t.data.length < n.exactLength.value;
      (i || o) && (K(t, {
        code: i ? D.too_big : D.too_small,
        minimum: o ? n.exactLength.value : void 0,
        maximum: i ? n.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: n.exactLength.message
      }), s.dirty());
    }
    if (n.minLength !== null && t.data.length < n.minLength.value && (K(t, {
      code: D.too_small,
      minimum: n.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.minLength.message
    }), s.dirty()), n.maxLength !== null && t.data.length > n.maxLength.value && (K(t, {
      code: D.too_big,
      maximum: n.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => n.type._parseAsync(new _t(t, i, t.path, o)))).then((i) => Ke.mergeArray(s, i));
    const a = [...t.data].map((i, o) => n.type._parseSync(new _t(t, i, t.path, o)));
    return Ke.mergeArray(s, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new gt({
      ...this._def,
      minLength: { value: e, message: se.toString(t) }
    });
  }
  max(e, t) {
    return new gt({
      ...this._def,
      maxLength: { value: e, message: se.toString(t) }
    });
  }
  length(e, t) {
    return new gt({
      ...this._def,
      exactLength: { value: e, message: se.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
gt.create = (r, e) => new gt({
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
      const s = r.shape[t];
      e[t] = Et.create(rr(s));
    }
    return new Ce({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof gt ? new gt({
    ...r._def,
    type: rr(r.element)
  }) : r instanceof Et ? Et.create(rr(r.unwrap())) : r instanceof Qt ? Qt.create(rr(r.unwrap())) : r instanceof Gt ? Gt.create(r.items.map((e) => rr(e))) : r;
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
      return K(u, {
        code: D.invalid_type,
        expected: Y.object,
        received: u.parsedType
      }), oe;
    }
    const { status: s, ctx: n } = this._processInputParams(e), { shape: a, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof Zt && this._def.unknownKeys === "strip"))
      for (const u in n.data)
        i.includes(u) || o.push(u);
    const c = [];
    for (const u of i) {
      const l = a[u], S = n.data[u];
      c.push({
        key: { status: "valid", value: u },
        value: l._parse(new _t(n, S, n.path, u)),
        alwaysSet: u in n.data
      });
    }
    if (this._def.catchall instanceof Zt) {
      const u = this._def.unknownKeys;
      if (u === "passthrough")
        for (const l of o)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: n.data[l] }
          });
      else if (u === "strict")
        o.length > 0 && (K(n, {
          code: D.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (u !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const u = this._def.catchall;
      for (const l of o) {
        const S = n.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: u._parse(
            new _t(n, S, n.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in n.data
        });
      }
    }
    return n.common.async ? Promise.resolve().then(async () => {
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
    }).then((u) => Ke.mergeObjectSync(s, u)) : Ke.mergeObjectSync(s, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return se.errToObj, new Ce({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          var a, i;
          const n = ((i = (a = this._def).errorMap) == null ? void 0 : i.call(a, t, s).message) ?? s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: se.errToObj(e).message ?? n
          } : {
            message: n
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
    for (const s of be.objectKeys(e))
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    return new Ce({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const s of be.objectKeys(this.shape))
      e[s] || (t[s] = this.shape[s]);
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
    for (const s of be.objectKeys(this.shape)) {
      const n = this.shape[s];
      e && !e[s] ? t[s] = n : t[s] = n.optional();
    }
    return new Ce({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const s of be.objectKeys(this.shape))
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let a = this.shape[s];
        for (; a instanceof Et; )
          a = a._def.innerType;
        t[s] = a;
      }
    return new Ce({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return _o(be.objectKeys(this.shape));
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
class $s extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function n(a) {
      for (const o of a)
        if (o.result.status === "valid")
          return o.result;
      for (const o of a)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = a.map((o) => new Ot(o.ctx.common.issues));
      return K(t, {
        code: D.invalid_union,
        unionErrors: i
      }), oe;
    }
    if (t.common.async)
      return Promise.all(s.map(async (a) => {
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
      })).then(n);
    {
      let a;
      const i = [];
      for (const c of s) {
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
      const o = i.map((c) => new Ot(c));
      return K(t, {
        code: D.invalid_union,
        unionErrors: o
      }), oe;
    }
  }
  get options() {
    return this._def.options;
  }
}
$s.create = (r, e) => new $s({
  options: r,
  typeName: Z.ZodUnion,
  ...fe(e)
});
const St = (r) => r instanceof En ? St(r.schema) : r instanceof Wt ? St(r.innerType()) : r instanceof Ps ? [r.value] : r instanceof Jt ? r.options : r instanceof xn ? be.objectValues(r.enum) : r instanceof Ts ? St(r._def.innerType) : r instanceof Sn ? [void 0] : r instanceof Pn ? [null] : r instanceof Et ? [void 0, ...St(r.unwrap())] : r instanceof Qt ? [null, ...St(r.unwrap())] : r instanceof vo || r instanceof xs ? St(r.unwrap()) : r instanceof Es ? St(r._def.innerType) : [];
class Bn extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== Y.object)
      return K(t, {
        code: D.invalid_type,
        expected: Y.object,
        received: t.parsedType
      }), oe;
    const s = this.discriminator, n = t.data[s], a = this.optionsMap.get(n);
    return a ? t.common.async ? a._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : a._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (K(t, {
      code: D.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [s]
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
  static create(e, t, s) {
    const n = /* @__PURE__ */ new Map();
    for (const a of t) {
      const i = St(a.shape[e]);
      if (!i.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of i) {
        if (n.has(o))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        n.set(o, a);
      }
    }
    return new Bn({
      typeName: Z.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: n,
      ...fe(s)
    });
  }
}
function Tn(r, e) {
  const t = Mt(r), s = Mt(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === Y.object && s === Y.object) {
    const n = be.objectKeys(e), a = be.objectKeys(r).filter((o) => n.indexOf(o) !== -1), i = { ...r, ...e };
    for (const o of a) {
      const c = Tn(r[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  } else if (t === Y.array && s === Y.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const n = [];
    for (let a = 0; a < r.length; a++) {
      const i = r[a], o = e[a], c = Tn(i, o);
      if (!c.valid)
        return { valid: !1 };
      n.push(c.data);
    }
    return { valid: !0, data: n };
  } else return t === Y.date && s === Y.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class ks extends ge {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = (a, i) => {
      if (ka(a) || ka(i))
        return oe;
      const o = Tn(a.value, i.value);
      return o.valid ? ((Sa(a) || Sa(i)) && t.dirty(), { status: t.value, value: o.data }) : (K(s, {
        code: D.invalid_intersection_types
      }), oe);
    };
    return s.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      }),
      this._def.right._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      })
    ]).then(([a, i]) => n(a, i)) : n(this._def.left._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }), this._def.right._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }));
  }
}
ks.create = (r, e, t) => new ks({
  left: r,
  right: e,
  typeName: Z.ZodIntersection,
  ...fe(t)
});
class Gt extends ge {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== Y.array)
      return K(s, {
        code: D.invalid_type,
        expected: Y.array,
        received: s.parsedType
      }), oe;
    if (s.data.length < this._def.items.length)
      return K(s, {
        code: D.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), oe;
    !this._def.rest && s.data.length > this._def.items.length && (K(s, {
      code: D.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...s.data].map((i, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new _t(s, i, s.path, o)) : null;
    }).filter((i) => !!i);
    return s.common.async ? Promise.all(a).then((i) => Ke.mergeArray(t, i)) : Ke.mergeArray(t, a);
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
class Ss extends ge {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== Y.object)
      return K(s, {
        code: D.invalid_type,
        expected: Y.object,
        received: s.parsedType
      }), oe;
    const n = [], a = this._def.keyType, i = this._def.valueType;
    for (const o in s.data)
      n.push({
        key: a._parse(new _t(s, o, s.path, o)),
        value: i._parse(new _t(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? Ke.mergeObjectAsync(t, n) : Ke.mergeObjectSync(t, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof ge ? new Ss({
      keyType: e,
      valueType: t,
      typeName: Z.ZodRecord,
      ...fe(s)
    }) : new Ss({
      keyType: Rt.create(),
      valueType: e,
      typeName: Z.ZodRecord,
      ...fe(t)
    });
  }
}
class xa extends ge {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== Y.map)
      return K(s, {
        code: D.invalid_type,
        expected: Y.map,
        received: s.parsedType
      }), oe;
    const n = this._def.keyType, a = this._def.valueType, i = [...s.data.entries()].map(([o, c], u) => ({
      key: n._parse(new _t(s, o, s.path, [u, "key"])),
      value: a._parse(new _t(s, c, s.path, [u, "value"]))
    }));
    if (s.common.async) {
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
xa.create = (r, e, t) => new xa({
  valueType: e,
  keyType: r,
  typeName: Z.ZodMap,
  ...fe(t)
});
class _r extends ge {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== Y.set)
      return K(s, {
        code: D.invalid_type,
        expected: Y.set,
        received: s.parsedType
      }), oe;
    const n = this._def;
    n.minSize !== null && s.data.size < n.minSize.value && (K(s, {
      code: D.too_small,
      minimum: n.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.minSize.message
    }), t.dirty()), n.maxSize !== null && s.data.size > n.maxSize.value && (K(s, {
      code: D.too_big,
      maximum: n.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.maxSize.message
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
    const o = [...s.data.values()].map((c, u) => a._parse(new _t(s, c, s.path, u)));
    return s.common.async ? Promise.all(o).then((c) => i(c)) : i(o);
  }
  min(e, t) {
    return new _r({
      ...this._def,
      minSize: { value: e, message: se.toString(t) }
    });
  }
  max(e, t) {
    return new _r({
      ...this._def,
      maxSize: { value: e, message: se.toString(t) }
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
class En extends ge {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
En.create = (r, e) => new En({
  getter: r,
  typeName: Z.ZodLazy,
  ...fe(e)
});
class Ps extends ge {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return K(t, {
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
Ps.create = (r, e) => new Ps({
  value: r,
  typeName: Z.ZodLiteral,
  ...fe(e)
});
function _o(r, e) {
  return new Jt({
    values: r,
    typeName: Z.ZodEnum,
    ...fe(e)
  });
}
class Jt extends ge {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return K(t, {
        expected: be.joinValues(s),
        received: t.parsedType,
        code: D.invalid_type
      }), oe;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return K(t, {
        received: t.data,
        code: D.invalid_enum_value,
        options: s
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
    return Jt.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
Jt.create = _o;
class xn extends ge {
  _parse(e) {
    const t = be.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== Y.string && s.parsedType !== Y.number) {
      const n = be.objectValues(t);
      return K(s, {
        expected: be.joinValues(n),
        received: s.parsedType,
        code: D.invalid_type
      }), oe;
    }
    if (this._cache || (this._cache = new Set(be.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const n = be.objectValues(t);
      return K(s, {
        received: s.data,
        code: D.invalid_enum_value,
        options: n
      }), oe;
    }
    return it(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
xn.create = (r, e) => new xn({
  values: r,
  typeName: Z.ZodNativeEnum,
  ...fe(e)
});
class Rs extends ge {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== Y.promise && t.common.async === !1)
      return K(t, {
        code: D.invalid_type,
        expected: Y.promise,
        received: t.parsedType
      }), oe;
    const s = t.parsedType === Y.promise ? t.data : Promise.resolve(t.data);
    return it(s.then((n) => this._def.type.parseAsync(n, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
Rs.create = (r, e) => new Rs({
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
    const { status: t, ctx: s } = this._processInputParams(e), n = this._def.effect || null, a = {
      addIssue: (i) => {
        K(s, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), n.type === "preprocess") {
      const i = n.transform(s.data, a);
      if (s.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return oe;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return c.status === "aborted" ? oe : c.status === "dirty" || t.value === "dirty" ? fr(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return oe;
        const o = this._def.schema._parseSync({
          data: i,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? oe : o.status === "dirty" || t.value === "dirty" ? fr(o.value) : o;
      }
    }
    if (n.type === "refinement") {
      const i = (o) => {
        const c = n.refinement(o, a);
        if (s.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? oe : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? oe : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (n.type === "transform")
      if (s.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!ar(i))
          return oe;
        const o = n.transform(i.value, a);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((i) => ar(i) ? Promise.resolve(n.transform(i.value, a)).then((o) => ({
          status: t.value,
          value: o
        })) : oe);
    be.assertNever(n);
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
class Et extends ge {
  _parse(e) {
    return this._getType(e) === Y.undefined ? it(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Et.create = (r, e) => new Et({
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
class Ts extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === Y.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Ts.create = (r, e) => new Ts({
  innerType: r,
  typeName: Z.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...fe(e)
});
class Es extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, n = this._def.innerType._parse({
      data: s.data,
      path: s.path,
      parent: {
        ...s
      }
    });
    return bs(n) ? n.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new Ot(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new Ot(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Es.create = (r, e) => new Es({
  innerType: r,
  typeName: Z.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...fe(e)
});
class Na extends ge {
  _parse(e) {
    if (this._getType(e) !== Y.nan) {
      const s = this._getOrReturnCtx(e);
      return K(s, {
        code: D.invalid_type,
        expected: Y.nan,
        received: s.parsedType
      }), oe;
    }
    return { status: "valid", value: e.data };
  }
}
Na.create = (r) => new Na({
  typeName: Z.ZodNaN,
  ...fe(r)
});
class vo extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Gn extends ge {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return a.status === "aborted" ? oe : a.status === "dirty" ? (t.dirty(), fr(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: s.path,
          parent: s
        });
      })();
    {
      const n = this._def.in._parseSync({
        data: s.data,
        path: s.path,
        parent: s
      });
      return n.status === "aborted" ? oe : n.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: n.value
      }) : this._def.out._parseSync({
        data: n.value,
        path: s.path,
        parent: s
      });
    }
  }
  static create(e, t) {
    return new Gn({
      in: e,
      out: t,
      typeName: Z.ZodPipeline
    });
  }
}
class xs extends ge {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (n) => (ar(n) && (n.value = Object.freeze(n.value)), n);
    return bs(t) ? t.then((n) => s(n)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
xs.create = (r, e) => new xs({
  innerType: r,
  typeName: Z.ZodReadonly,
  ...fe(e)
});
var Z;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(Z || (Z = {}));
const U = Rt.create, De = ir.create, We = kn.create, Dt = Rn.create;
Zt.create;
const Ne = gt.create, J = Ce.create, Be = $s.create, td = Bn.create;
ks.create;
Gt.create;
const or = Ss.create, de = Ps.create, Ct = Jt.create;
Rs.create;
const j = Et.create;
Qt.create;
const bo = "2025-06-18", rd = [bo, "2025-03-26", "2024-11-05", "2024-10-07"], Ds = "2.0", wo = Be([U(), De().int()]), $o = U(), sd = J({
  /**
   * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
   */
  progressToken: j(wo)
}).passthrough(), ot = J({
  _meta: j(sd)
}).passthrough(), Xe = J({
  method: U(),
  params: j(ot)
}), $r = J({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).passthrough(), bt = J({
  method: U(),
  params: j($r)
}), ct = J({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).passthrough(), Zs = Be([U(), De().int()]), ko = J({
  jsonrpc: de(Ds),
  id: Zs
}).merge(Xe).strict(), nd = (r) => ko.safeParse(r).success, So = J({
  jsonrpc: de(Ds)
}).merge(bt).strict(), ad = (r) => So.safeParse(r).success, Po = J({
  jsonrpc: de(Ds),
  id: Zs,
  result: ct
}).strict(), Oa = (r) => Po.safeParse(r).success;
var Ee;
(function(r) {
  r[r.ConnectionClosed = -32e3] = "ConnectionClosed", r[r.RequestTimeout = -32001] = "RequestTimeout", r[r.ParseError = -32700] = "ParseError", r[r.InvalidRequest = -32600] = "InvalidRequest", r[r.MethodNotFound = -32601] = "MethodNotFound", r[r.InvalidParams = -32602] = "InvalidParams", r[r.InternalError = -32603] = "InternalError";
})(Ee || (Ee = {}));
const Ro = J({
  jsonrpc: de(Ds),
  id: Zs,
  error: J({
    /**
     * The error type that occurred.
     */
    code: De().int(),
    /**
     * A short description of the error. The message SHOULD be limited to a concise single sentence.
     */
    message: U(),
    /**
     * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
     */
    data: j(Dt())
  })
}).strict(), id = (r) => Ro.safeParse(r).success;
Be([ko, So, Po, Ro]);
const Jn = ct.strict(), Wn = bt.extend({
  method: de("notifications/cancelled"),
  params: $r.extend({
    /**
     * The ID of the request to cancel.
     *
     * This MUST correspond to the ID of a request previously issued in the same direction.
     */
    requestId: Zs,
    /**
     * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
     */
    reason: U().optional()
  })
}), od = J({
  /**
   * URL or data URI for the icon.
   */
  src: U(),
  /**
   * Optional MIME type for the icon.
   */
  mimeType: j(U()),
  /**
   * Optional array of strings that specify sizes at which the icon can be used.
   * Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
   *
   * If not provided, the client should assume that the icon can be used at any size.
   */
  sizes: j(Ne(U()))
}).passthrough(), kr = J({
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
  icons: Ne(od).optional()
}).passthrough(), Sr = J({
  /** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
  name: U(),
  /**
   * Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
   * even by those unfamiliar with domain-specific terminology.
   *
   * If not provided, the name should be used for display (except for Tool,
   * where `annotations.title` should be given precedence over using `name`,
   * if present).
   */
  title: j(U())
}).passthrough(), To = Sr.extend({
  version: U(),
  /**
   * An optional URL of the website for this implementation.
   */
  websiteUrl: j(U())
}).merge(kr), cd = J({
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental: j(J({}).passthrough()),
  /**
   * Present if the client supports sampling from an LLM.
   */
  sampling: j(J({}).passthrough()),
  /**
   * Present if the client supports eliciting user input.
   */
  elicitation: j(J({}).passthrough()),
  /**
   * Present if the client supports listing roots.
   */
  roots: j(J({
    /**
     * Whether the client supports issuing notifications for changes to the roots list.
     */
    listChanged: j(We())
  }).passthrough())
}).passthrough(), Eo = Xe.extend({
  method: de("initialize"),
  params: ot.extend({
    /**
     * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
     */
    protocolVersion: U(),
    capabilities: cd,
    clientInfo: To
  })
}), ud = J({
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental: j(J({}).passthrough()),
  /**
   * Present if the server supports sending log messages to the client.
   */
  logging: j(J({}).passthrough()),
  /**
   * Present if the server supports sending completions to the client.
   */
  completions: j(J({}).passthrough()),
  /**
   * Present if the server offers any prompt templates.
   */
  prompts: j(J({
    /**
     * Whether this server supports issuing notifications for changes to the prompt list.
     */
    listChanged: j(We())
  }).passthrough()),
  /**
   * Present if the server offers any resources to read.
   */
  resources: j(J({
    /**
     * Whether this server supports clients subscribing to resource updates.
     */
    subscribe: j(We()),
    /**
     * Whether this server supports issuing notifications for changes to the resource list.
     */
    listChanged: j(We())
  }).passthrough()),
  /**
   * Present if the server offers any tools to call.
   */
  tools: j(J({
    /**
     * Whether this server supports issuing notifications for changes to the tool list.
     */
    listChanged: j(We())
  }).passthrough())
}).passthrough(), dd = ct.extend({
  /**
   * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
   */
  protocolVersion: U(),
  capabilities: ud,
  serverInfo: To,
  /**
   * Instructions describing how to use the server and its features.
   *
   * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
   */
  instructions: j(U())
}), xo = bt.extend({
  method: de("notifications/initialized")
}), Qn = Xe.extend({
  method: de("ping")
}), ld = J({
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
  message: j(U())
}).passthrough(), Yn = bt.extend({
  method: de("notifications/progress"),
  params: $r.merge(ld).extend({
    /**
     * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
     */
    progressToken: wo
  })
}), zs = Xe.extend({
  params: ot.extend({
    /**
     * An opaque token representing the current pagination position.
     * If provided, the server should return results starting after this cursor.
     */
    cursor: j($o)
  }).optional()
}), Ls = ct.extend({
  /**
   * An opaque token representing the pagination position after the last returned result.
   * If present, there may be more results available.
   */
  nextCursor: j($o)
}), No = J({
  /**
   * The URI of this resource.
   */
  uri: U(),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: j(U()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).passthrough(), Oo = No.extend({
  /**
   * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
   */
  text: U()
}), Xn = U().refine((r) => {
  try {
    return atob(r), !0;
  } catch {
    return !1;
  }
}, { message: "Invalid Base64 string" }), Co = No.extend({
  /**
   * A base64-encoded string representing the binary data of the item.
   */
  blob: Xn
}), Io = Sr.extend({
  /**
   * The URI of this resource.
   */
  uri: U(),
  /**
   * A description of what this resource represents.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: j(U()),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: j(U()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).merge(kr), fd = Sr.extend({
  /**
   * A URI template (according to RFC 6570) that can be used to construct resource URIs.
   */
  uriTemplate: U(),
  /**
   * A description of what this template is for.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: j(U()),
  /**
   * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
   */
  mimeType: j(U()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).merge(kr), Nn = zs.extend({
  method: de("resources/list")
}), hd = Ls.extend({
  resources: Ne(Io)
}), On = zs.extend({
  method: de("resources/templates/list")
}), md = Ls.extend({
  resourceTemplates: Ne(fd)
}), Cn = Xe.extend({
  method: de("resources/read"),
  params: ot.extend({
    /**
     * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: U()
  })
}), pd = ct.extend({
  contents: Ne(Be([Oo, Co]))
}), gd = bt.extend({
  method: de("notifications/resources/list_changed")
}), yd = Xe.extend({
  method: de("resources/subscribe"),
  params: ot.extend({
    /**
     * The URI of the resource to subscribe to. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: U()
  })
}), _d = Xe.extend({
  method: de("resources/unsubscribe"),
  params: ot.extend({
    /**
     * The URI of the resource to unsubscribe from.
     */
    uri: U()
  })
}), vd = bt.extend({
  method: de("notifications/resources/updated"),
  params: $r.extend({
    /**
     * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
     */
    uri: U()
  })
}), bd = J({
  /**
   * The name of the argument.
   */
  name: U(),
  /**
   * A human-readable description of the argument.
   */
  description: j(U()),
  /**
   * Whether this argument must be provided.
   */
  required: j(We())
}).passthrough(), wd = Sr.extend({
  /**
   * An optional description of what this prompt provides
   */
  description: j(U()),
  /**
   * A list of arguments to use for templating the prompt.
   */
  arguments: j(Ne(bd)),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).merge(kr), In = zs.extend({
  method: de("prompts/list")
}), $d = Ls.extend({
  prompts: Ne(wd)
}), An = Xe.extend({
  method: de("prompts/get"),
  params: ot.extend({
    /**
     * The name of the prompt or prompt template.
     */
    name: U(),
    /**
     * Arguments to use for templating the prompt.
     */
    arguments: j(or(U()))
  })
}), ea = J({
  type: de("text"),
  /**
   * The text content of the message.
   */
  text: U(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).passthrough(), ta = J({
  type: de("image"),
  /**
   * The base64-encoded image data.
   */
  data: Xn,
  /**
   * The MIME type of the image. Different providers may support different image types.
   */
  mimeType: U(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).passthrough(), ra = J({
  type: de("audio"),
  /**
   * The base64-encoded audio data.
   */
  data: Xn,
  /**
   * The MIME type of the audio. Different providers may support different audio types.
   */
  mimeType: U(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).passthrough(), kd = J({
  type: de("resource"),
  resource: Be([Oo, Co]),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).passthrough(), Sd = Io.extend({
  type: de("resource_link")
}), Ao = Be([
  ea,
  ta,
  ra,
  Sd,
  kd
]), Pd = J({
  role: Ct(["user", "assistant"]),
  content: Ao
}).passthrough(), Rd = ct.extend({
  /**
   * An optional description for the prompt.
   */
  description: j(U()),
  messages: Ne(Pd)
}), Td = bt.extend({
  method: de("notifications/prompts/list_changed")
}), Ed = J({
  /**
   * A human-readable title for the tool.
   */
  title: j(U()),
  /**
   * If true, the tool does not modify its environment.
   *
   * Default: false
   */
  readOnlyHint: j(We()),
  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructiveHint: j(We()),
  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on the its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotentHint: j(We()),
  /**
   * If true, this tool may interact with an "open world" of external
   * entities. If false, the tool's domain of interaction is closed.
   * For example, the world of a web search tool is open, whereas that
   * of a memory tool is not.
   *
   * Default: true
   */
  openWorldHint: j(We())
}).passthrough(), xd = Sr.extend({
  /**
   * A human-readable description of the tool.
   */
  description: j(U()),
  /**
   * A JSON Schema object defining the expected parameters for the tool.
   */
  inputSchema: J({
    type: de("object"),
    properties: j(J({}).passthrough()),
    required: j(Ne(U()))
  }).passthrough(),
  /**
   * An optional JSON Schema object defining the structure of the tool's output returned in
   * the structuredContent field of a CallToolResult.
   */
  outputSchema: j(J({
    type: de("object"),
    properties: j(J({}).passthrough()),
    required: j(Ne(U()))
  }).passthrough()),
  /**
   * Optional additional tool information.
   */
  annotations: j(Ed),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).merge(kr), jn = zs.extend({
  method: de("tools/list")
}), Nd = Ls.extend({
  tools: Ne(xd)
}), jo = ct.extend({
  /**
   * A list of content objects that represent the result of the tool call.
   *
   * If the Tool does not define an outputSchema, this field MUST be present in the result.
   * For backwards compatibility, this field is always present, but it may be empty.
   */
  content: Ne(Ao).default([]),
  /**
   * An object containing structured tool output.
   *
   * If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
   */
  structuredContent: J({}).passthrough().optional(),
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
  isError: j(We())
});
jo.or(ct.extend({
  toolResult: Dt()
}));
const Mn = Xe.extend({
  method: de("tools/call"),
  params: ot.extend({
    name: U(),
    arguments: j(or(Dt()))
  })
}), Od = bt.extend({
  method: de("notifications/tools/list_changed")
}), Ns = Ct(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]), Mo = Xe.extend({
  method: de("logging/setLevel"),
  params: ot.extend({
    /**
     * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
     */
    level: Ns
  })
}), Cd = bt.extend({
  method: de("notifications/message"),
  params: $r.extend({
    /**
     * The severity of this log message.
     */
    level: Ns,
    /**
     * An optional name of the logger issuing this message.
     */
    logger: j(U()),
    /**
     * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
     */
    data: Dt()
  })
}), Id = J({
  /**
   * A hint for a model name.
   */
  name: U().optional()
}).passthrough(), Ad = J({
  /**
   * Optional hints to use for model selection.
   */
  hints: j(Ne(Id)),
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
}).passthrough(), jd = J({
  role: Ct(["user", "assistant"]),
  content: Be([ea, ta, ra])
}).passthrough(), Md = Xe.extend({
  method: de("sampling/createMessage"),
  params: ot.extend({
    messages: Ne(jd),
    /**
     * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
     */
    systemPrompt: j(U()),
    /**
     * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt. The client MAY ignore this request.
     */
    includeContext: j(Ct(["none", "thisServer", "allServers"])),
    temperature: j(De()),
    /**
     * The maximum number of tokens to sample, as requested by the server. The client MAY choose to sample fewer tokens than requested.
     */
    maxTokens: De().int(),
    stopSequences: j(Ne(U())),
    /**
     * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
     */
    metadata: j(J({}).passthrough()),
    /**
     * The server's preferences for which model to select.
     */
    modelPreferences: j(Ad)
  })
}), qo = ct.extend({
  /**
   * The name of the model that generated the message.
   */
  model: U(),
  /**
   * The reason why sampling stopped.
   */
  stopReason: j(Ct(["endTurn", "stopSequence", "maxTokens"]).or(U())),
  role: Ct(["user", "assistant"]),
  content: td("type", [ea, ta, ra])
}), qd = J({
  type: de("boolean"),
  title: j(U()),
  description: j(U()),
  default: j(We())
}).passthrough(), Dd = J({
  type: de("string"),
  title: j(U()),
  description: j(U()),
  minLength: j(De()),
  maxLength: j(De()),
  format: j(Ct(["email", "uri", "date", "date-time"]))
}).passthrough(), Zd = J({
  type: Ct(["number", "integer"]),
  title: j(U()),
  description: j(U()),
  minimum: j(De()),
  maximum: j(De())
}).passthrough(), zd = J({
  type: de("string"),
  title: j(U()),
  description: j(U()),
  enum: Ne(U()),
  enumNames: j(Ne(U()))
}).passthrough(), Ld = Be([qd, Dd, Zd, zd]), Vd = Xe.extend({
  method: de("elicitation/create"),
  params: ot.extend({
    /**
     * The message to present to the user.
     */
    message: U(),
    /**
     * The schema for the requested user input.
     */
    requestedSchema: J({
      type: de("object"),
      properties: or(U(), Ld),
      required: j(Ne(U()))
    }).passthrough()
  })
}), Do = ct.extend({
  /**
   * The user's response action.
   */
  action: Ct(["accept", "decline", "cancel"]),
  /**
   * The collected user input content (only present if action is "accept").
   */
  content: j(or(U(), Dt()))
}), Fd = J({
  type: de("ref/resource"),
  /**
   * The URI or URI template of the resource.
   */
  uri: U()
}).passthrough(), Ud = J({
  type: de("ref/prompt"),
  /**
   * The name of the prompt or prompt template
   */
  name: U()
}).passthrough(), qn = Xe.extend({
  method: de("completion/complete"),
  params: ot.extend({
    ref: Be([Ud, Fd]),
    /**
     * The argument's information
     */
    argument: J({
      /**
       * The name of the argument
       */
      name: U(),
      /**
       * The value of the argument to use for completion matching.
       */
      value: U()
    }).passthrough(),
    context: j(J({
      /**
       * Previously-resolved variables in a URI template or prompt.
       */
      arguments: j(or(U(), U()))
    }))
  })
}), Hd = ct.extend({
  completion: J({
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: Ne(U()).max(100),
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: j(De().int()),
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: j(We())
  }).passthrough()
}), Kd = J({
  /**
   * The URI identifying the root. This *must* start with file:// for now.
   */
  uri: U().startsWith("file://"),
  /**
   * An optional name for the root.
   */
  name: j(U()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: j(J({}).passthrough())
}).passthrough(), Bd = Xe.extend({
  method: de("roots/list")
}), Zo = ct.extend({
  roots: Ne(Kd)
}), Gd = bt.extend({
  method: de("notifications/roots/list_changed")
});
Be([
  Qn,
  Eo,
  qn,
  Mo,
  An,
  In,
  Nn,
  On,
  Cn,
  yd,
  _d,
  Mn,
  jn
]);
Be([
  Wn,
  Yn,
  xo,
  Gd
]);
Be([Jn, qo, Do, Zo]);
Be([Qn, Md, Vd, Bd]);
Be([
  Wn,
  Yn,
  Cd,
  vd,
  gd,
  Od,
  Td
]);
Be([
  Jn,
  dd,
  Hd,
  Rd,
  $d,
  hd,
  md,
  pd,
  jo,
  Nd
]);
class xe extends Error {
  constructor(e, t, s) {
    super(`MCP error ${e}: ${t}`), this.code = e, this.data = s, this.name = "McpError";
  }
}
const Jd = 6e4;
class Wd {
  constructor(e) {
    this._options = e, this._requestMessageId = 0, this._requestHandlers = /* @__PURE__ */ new Map(), this._requestHandlerAbortControllers = /* @__PURE__ */ new Map(), this._notificationHandlers = /* @__PURE__ */ new Map(), this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers = /* @__PURE__ */ new Map(), this._timeoutInfo = /* @__PURE__ */ new Map(), this._pendingDebouncedNotifications = /* @__PURE__ */ new Set(), this.setNotificationHandler(Wn, (t) => {
      const s = this._requestHandlerAbortControllers.get(t.params.requestId);
      s == null || s.abort(t.params.reason);
    }), this.setNotificationHandler(Yn, (t) => {
      this._onprogress(t);
    }), this.setRequestHandler(
      Qn,
      // Automatic pong by default.
      (t) => ({})
    );
  }
  _setupTimeout(e, t, s, n, a = !1) {
    this._timeoutInfo.set(e, {
      timeoutId: setTimeout(n, t),
      startTime: Date.now(),
      timeout: t,
      maxTotalTimeout: s,
      resetTimeoutOnProgress: a,
      onTimeout: n
    });
  }
  _resetTimeout(e) {
    const t = this._timeoutInfo.get(e);
    if (!t)
      return !1;
    const s = Date.now() - t.startTime;
    if (t.maxTotalTimeout && s >= t.maxTotalTimeout)
      throw this._timeoutInfo.delete(e), new xe(Ee.RequestTimeout, "Maximum total timeout exceeded", {
        maxTotalTimeout: t.maxTotalTimeout,
        totalElapsed: s
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
    var t, s, n;
    this._transport = e;
    const a = (t = this.transport) === null || t === void 0 ? void 0 : t.onclose;
    this._transport.onclose = () => {
      a == null || a(), this._onclose();
    };
    const i = (s = this.transport) === null || s === void 0 ? void 0 : s.onerror;
    this._transport.onerror = (c) => {
      i == null || i(c), this._onerror(c);
    };
    const o = (n = this._transport) === null || n === void 0 ? void 0 : n.onmessage;
    this._transport.onmessage = (c, u) => {
      o == null || o(c, u), Oa(c) || id(c) ? this._onresponse(c) : nd(c) ? this._onrequest(c, u) : ad(c) ? this._onnotification(c) : this._onerror(new Error(`Unknown message type: ${JSON.stringify(c)}`));
    }, await this._transport.start();
  }
  _onclose() {
    var e;
    const t = this._responseHandlers;
    this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers.clear(), this._pendingDebouncedNotifications.clear(), this._transport = void 0, (e = this.onclose) === null || e === void 0 || e.call(this);
    const s = new xe(Ee.ConnectionClosed, "Connection closed");
    for (const n of t.values())
      n(s);
  }
  _onerror(e) {
    var t;
    (t = this.onerror) === null || t === void 0 || t.call(this, e);
  }
  _onnotification(e) {
    var t;
    const s = (t = this._notificationHandlers.get(e.method)) !== null && t !== void 0 ? t : this.fallbackNotificationHandler;
    s !== void 0 && Promise.resolve().then(() => s(e)).catch((n) => this._onerror(new Error(`Uncaught error in notification handler: ${n}`)));
  }
  _onrequest(e, t) {
    var s, n;
    const a = (s = this._requestHandlers.get(e.method)) !== null && s !== void 0 ? s : this.fallbackRequestHandler, i = this._transport;
    if (a === void 0) {
      i == null || i.send({
        jsonrpc: "2.0",
        id: e.id,
        error: {
          code: Ee.MethodNotFound,
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
      _meta: (n = e.params) === null || n === void 0 ? void 0 : n._meta,
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
            code: Number.isSafeInteger(u.code) ? u.code : Ee.InternalError,
            message: (l = u.message) !== null && l !== void 0 ? l : "Internal error"
          }
        });
    }).catch((u) => this._onerror(new Error(`Failed to send response: ${u}`))).finally(() => {
      this._requestHandlerAbortControllers.delete(e.id);
    });
  }
  _onprogress(e) {
    const { progressToken: t, ...s } = e.params, n = Number(t), a = this._progressHandlers.get(n);
    if (!a) {
      this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`));
      return;
    }
    const i = this._responseHandlers.get(n), o = this._timeoutInfo.get(n);
    if (o && i && o.resetTimeoutOnProgress)
      try {
        this._resetTimeout(n);
      } catch (c) {
        i(c);
        return;
      }
    a(s);
  }
  _onresponse(e) {
    const t = Number(e.id), s = this._responseHandlers.get(t);
    if (s === void 0) {
      this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`));
      return;
    }
    if (this._responseHandlers.delete(t), this._progressHandlers.delete(t), this._cleanupTimeout(t), Oa(e))
      s(e);
    else {
      const n = new xe(e.error.code, e.error.message, e.error.data);
      s(n);
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
  request(e, t, s) {
    const { relatedRequestId: n, resumptionToken: a, onresumptiontoken: i } = s ?? {};
    return new Promise((o, c) => {
      var u, l, S, w, v, b;
      if (!this._transport) {
        c(new Error("Not connected"));
        return;
      }
      ((u = this._options) === null || u === void 0 ? void 0 : u.enforceStrictCapabilities) === !0 && this.assertCapabilityForMethod(e.method), (l = s == null ? void 0 : s.signal) === null || l === void 0 || l.throwIfAborted();
      const $ = this._requestMessageId++, m = {
        ...e,
        jsonrpc: "2.0",
        id: $
      };
      s != null && s.onprogress && (this._progressHandlers.set($, s.onprogress), m.params = {
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
        }, { relatedRequestId: n, resumptionToken: a, onresumptiontoken: i }).catch((y) => this._onerror(new Error(`Failed to send cancellation: ${y}`))), c(_);
      };
      this._responseHandlers.set($, (_) => {
        var f;
        if (!(!((f = s == null ? void 0 : s.signal) === null || f === void 0) && f.aborted)) {
          if (_ instanceof Error)
            return c(_);
          try {
            const y = t.parse(_.result);
            o(y);
          } catch (y) {
            c(y);
          }
        }
      }), (w = s == null ? void 0 : s.signal) === null || w === void 0 || w.addEventListener("abort", () => {
        var _;
        p((_ = s == null ? void 0 : s.signal) === null || _ === void 0 ? void 0 : _.reason);
      });
      const d = (v = s == null ? void 0 : s.timeout) !== null && v !== void 0 ? v : Jd, h = () => p(new xe(Ee.RequestTimeout, "Request timed out", { timeout: d }));
      this._setupTimeout($, d, s == null ? void 0 : s.maxTotalTimeout, h, (b = s == null ? void 0 : s.resetTimeoutOnProgress) !== null && b !== void 0 ? b : !1), this._transport.send(m, { relatedRequestId: n, resumptionToken: a, onresumptiontoken: i }).catch((_) => {
        this._cleanupTimeout($), c(_);
      });
    });
  }
  /**
   * Emits a notification, which is a one-way message that does not expect a response.
   */
  async notification(e, t) {
    var s, n;
    if (!this._transport)
      throw new Error("Not connected");
    if (this.assertNotificationCapability(e.method), ((n = (s = this._options) === null || s === void 0 ? void 0 : s.debouncedNotificationMethods) !== null && n !== void 0 ? n : []).includes(e.method) && !e.params && !(t != null && t.relatedRequestId)) {
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
    const s = e.shape.method.value;
    this.assertRequestHandlerCapability(s), this._requestHandlers.set(s, (n, a) => Promise.resolve(t(e.parse(n), a)));
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
    this._notificationHandlers.set(e.shape.method.value, (s) => Promise.resolve(t(e.parse(s))));
  }
  /**
   * Removes the notification handler for the given method.
   */
  removeNotificationHandler(e) {
    this._notificationHandlers.delete(e);
  }
}
function Qd(r, e) {
  return Object.entries(e).reduce((t, [s, n]) => (n && typeof n == "object" ? t[s] = t[s] ? { ...t[s], ...n } : n : t[s] = n, t), { ...r });
}
function Yd(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Pr = { exports: {} }, Qs = {}, wt = {}, Lt = {}, Ys = {}, Xs = {}, en = {}, Ca;
function Os() {
  return Ca || (Ca = 1, (function(r) {
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
    class s extends e {
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
    r._Code = s, r.nil = new s("");
    function n(p, ...d) {
      const h = [p[0]];
      let _ = 0;
      for (; _ < d.length; )
        o(h, d[_]), h.push(p[++_]);
      return new s(h);
    }
    r._ = n;
    const a = new s("+");
    function i(p, ...d) {
      const h = [v(p[0])];
      let _ = 0;
      for (; _ < d.length; )
        h.push(a), o(h, d[_]), h.push(a, v(p[++_]));
      return c(h), new s(h);
    }
    r.str = i;
    function o(p, d) {
      d instanceof s ? p.push(...d._items) : d instanceof t ? p.push(d) : p.push(S(d));
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
      return new s(v(p));
    }
    r.stringify = w;
    function v(p) {
      return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    r.safeStringify = v;
    function b(p) {
      return typeof p == "string" && r.IDENTIFIER.test(p) ? new s(`.${p}`) : n`[${p}]`;
    }
    r.getProperty = b;
    function $(p) {
      if (typeof p == "string" && r.IDENTIFIER.test(p))
        return new s(`${p}`);
      throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
    }
    r.getEsmExportName = $;
    function m(p) {
      return new s(p.toString());
    }
    r.regexpCode = m;
  })(en)), en;
}
var tn = {}, Ia;
function Aa() {
  return Ia || (Ia = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.ValueScope = r.ValueScopeName = r.Scope = r.varKinds = r.UsedValueState = void 0;
    const e = Os();
    class t extends Error {
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
      }
    }
    var s;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(s || (r.UsedValueState = s = {})), r.varKinds = {
      const: new e.Name("const"),
      let: new e.Name("let"),
      var: new e.Name("var")
    };
    class n {
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
    r.Scope = n;
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
    class o extends n {
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
            m.set(p, s.Started);
            let d = l(p);
            if (d) {
              const h = this.opts.es5 ? r.varKinds.var : r.varKinds.const;
              v = (0, e._)`${v}${h} ${p} = ${d};${this.opts._n}`;
            } else if (d = w == null ? void 0 : w(p))
              v = (0, e._)`${v}${d}${this.opts._n}`;
            else
              throw new t(p);
            m.set(p, s.Completed);
          });
        }
        return v;
      }
    }
    r.ValueScope = o;
  })(tn)), tn;
}
var ja;
function me() {
  return ja || (ja = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.or = r.and = r.not = r.CodeGen = r.operators = r.varKinds = r.ValueScopeName = r.ValueScope = r.Scope = r.Name = r.regexpCode = r.stringify = r.getProperty = r.nil = r.strConcat = r.str = r._ = void 0;
    const e = Os(), t = Aa();
    var s = Os();
    Object.defineProperty(r, "_", { enumerable: !0, get: function() {
      return s._;
    } }), Object.defineProperty(r, "str", { enumerable: !0, get: function() {
      return s.str;
    } }), Object.defineProperty(r, "strConcat", { enumerable: !0, get: function() {
      return s.strConcat;
    } }), Object.defineProperty(r, "nil", { enumerable: !0, get: function() {
      return s.nil;
    } }), Object.defineProperty(r, "getProperty", { enumerable: !0, get: function() {
      return s.getProperty;
    } }), Object.defineProperty(r, "stringify", { enumerable: !0, get: function() {
      return s.stringify;
    } }), Object.defineProperty(r, "regexpCode", { enumerable: !0, get: function() {
      return s.regexpCode;
    } }), Object.defineProperty(r, "Name", { enumerable: !0, get: function() {
      return s.Name;
    } });
    var n = Aa();
    Object.defineProperty(r, "Scope", { enumerable: !0, get: function() {
      return n.Scope;
    } }), Object.defineProperty(r, "ValueScope", { enumerable: !0, get: function() {
      return n.ValueScope;
    } }), Object.defineProperty(r, "ValueScopeName", { enumerable: !0, get: function() {
      return n.ValueScopeName;
    } }), Object.defineProperty(r, "varKinds", { enumerable: !0, get: function() {
      return n.varKinds;
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
        return this.nodes.reduce((g, P) => F(g, P.names), {});
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
          return g === !1 ? P instanceof p ? P : P.nodes : this.nodes.length ? this : new p(Ze(g), P instanceof p ? [P] : P.nodes);
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
        return W(g, this.condition), this.else && F(g, this.else.names), g;
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
        return F(super.names, this.iteration.names);
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
        return F(super.names, this.iterable.names);
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
        return this.catch && F(g, this.catch.names), this.finally && F(g, this.finally.names), g;
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
    class G extends b {
      render(g) {
        return "finally" + super.render(g);
      }
    }
    G.kind = "finally";
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
        return O && (this._currNode = te.finally = new G(), this.code(O)), this._endBlockNode(z, G);
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
    function F(x, g) {
      for (const P in g)
        x[P] = (x[P] || 0) + (g[P] || 0);
      return x;
    }
    function W(x, g) {
      return g instanceof e._CodeOrName ? F(x, g.names) : x;
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
    function Ze(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, e._)`!${A(x)}`;
    }
    r.not = Ze;
    const ze = T(r.operators.AND);
    function Te(...x) {
      return x.reduce(ze);
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
  })(Xs)), Xs;
}
var he = {}, Ma;
function we() {
  if (Ma) return he;
  Ma = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.checkStrictMode = he.getErrorPath = he.Type = he.useFunc = he.setEvaluated = he.evaluatedPropsToName = he.mergeEvaluated = he.eachItem = he.unescapeJsonPointer = he.escapeJsonPointer = he.escapeFragment = he.unescapeFragment = he.schemaRefOrVal = he.schemaHasRulesButRef = he.schemaHasRules = he.checkUnknownRules = he.alwaysValidSchema = he.toHash = void 0;
  const r = me(), e = Os();
  function t(f) {
    const y = {};
    for (const k of f)
      y[k] = !0;
    return y;
  }
  he.toHash = t;
  function s(f, y) {
    return typeof y == "boolean" ? y : Object.keys(y).length === 0 ? !0 : (n(f, y), !a(y, f.self.RULES.all));
  }
  he.alwaysValidSchema = s;
  function n(f, y = f.schema) {
    const { opts: k, self: N } = f;
    if (!k.strictSchema || typeof y == "boolean")
      return;
    const z = N.RULES.keywords;
    for (const G in y)
      z[G] || _(f, `unknown keyword: "${G}"`);
  }
  he.checkUnknownRules = n;
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
    return (z, G, C, F) => {
      const W = C === void 0 ? G : C instanceof r.Name ? (G instanceof r.Name ? f(z, G, C) : y(z, G, C), C) : G instanceof r.Name ? (y(z, C, G), G) : k(G, C);
      return F === r.Name && !(W instanceof r.Name) ? N(z, W) : W;
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
var Rr = {}, qa;
function zt() {
  if (qa) return Rr;
  qa = 1, Object.defineProperty(Rr, "__esModule", { value: !0 });
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
var Da;
function Vs() {
  return Da || (Da = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.extendErrors = r.resetErrorsCount = r.reportExtraError = r.reportError = r.keyword$DataError = r.keywordError = void 0;
    const e = me(), t = we(), s = zt();
    r.keywordError = {
      message: ({ keyword: m }) => (0, e.str)`must pass "${m}" keyword validation`
    }, r.keyword$DataError = {
      message: ({ keyword: m, schemaType: p }) => p ? (0, e.str)`"${m}" keyword must be ${p} ($data)` : (0, e.str)`"${m}" keyword is invalid ($data)`
    };
    function n(m, p = r.keywordError, d, h) {
      const { it: _ } = m, { gen: f, compositeRule: y, allErrors: k } = _, N = S(m, p, d);
      h ?? (y || k) ? c(f, N) : u(_, (0, e._)`[${N}]`);
    }
    r.reportError = n;
    function a(m, p = r.keywordError, d) {
      const { it: h } = m, { gen: _, compositeRule: f, allErrors: y } = h, k = S(m, p, d);
      c(_, k), f || y || u(h, s.default.vErrors);
    }
    r.reportExtraError = a;
    function i(m, p) {
      m.assign(s.default.errors, p), m.if((0, e._)`${s.default.vErrors} !== null`, () => m.if(p, () => m.assign((0, e._)`${s.default.vErrors}.length`, p), () => m.assign(s.default.vErrors, null)));
    }
    r.resetErrorsCount = i;
    function o({ gen: m, keyword: p, schemaValue: d, data: h, errsCount: _, it: f }) {
      if (_ === void 0)
        throw new Error("ajv implementation error");
      const y = m.name("err");
      m.forRange("i", _, s.default.errors, (k) => {
        m.const(y, (0, e._)`${s.default.vErrors}[${k}]`), m.if((0, e._)`${y}.instancePath === undefined`, () => m.assign((0, e._)`${y}.instancePath`, (0, e.strConcat)(s.default.instancePath, f.errorPath))), m.assign((0, e._)`${y}.schemaPath`, (0, e.str)`${f.errSchemaPath}/${p}`), f.opts.verbose && (m.assign((0, e._)`${y}.schema`, d), m.assign((0, e._)`${y}.data`, h));
      });
    }
    r.extendErrors = o;
    function c(m, p) {
      const d = m.const("err", p);
      m.if((0, e._)`${s.default.vErrors} === null`, () => m.assign(s.default.vErrors, (0, e._)`[${d}]`), (0, e._)`${s.default.vErrors}.push(${d})`), m.code((0, e._)`${s.default.errors}++`);
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
      return [s.default.instancePath, (0, e.strConcat)(s.default.instancePath, d)];
    }
    function b({ keyword: m, it: { errSchemaPath: p } }, { schemaPath: d, parentSchema: h }) {
      let _ = h ? p : (0, e.str)`${p}/${m}`;
      return d && (_ = (0, e.str)`${_}${(0, t.getErrorPath)(d, t.Type.Str)}`), [l.schemaPath, _];
    }
    function $(m, { params: p, message: d }, h) {
      const { keyword: _, data: f, schemaValue: y, it: k } = m, { opts: N, propertyName: z, topSchemaRef: G, schemaPath: C } = k;
      h.push([l.keyword, _], [l.params, typeof p == "function" ? p(m) : p || (0, e._)`{}`]), N.messages && h.push([l.message, typeof d == "function" ? d(m) : d]), N.verbose && h.push([l.schema, y], [l.parentSchema, (0, e._)`${G}${C}`], [s.default.data, f]), z && h.push([l.propertyName, z]);
    }
  })(Ys)), Ys;
}
var Za;
function Xd() {
  if (Za) return Lt;
  Za = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.boolOrEmptySchema = Lt.topBoolOrEmptySchema = void 0;
  const r = Vs(), e = me(), t = zt(), s = {
    message: "boolean schema is false"
  };
  function n(o) {
    const { gen: c, schema: u, validateName: l } = o;
    u === !1 ? i(o, !1) : typeof u == "object" && u.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${l}.errors`, null), c.return(!0));
  }
  Lt.topBoolOrEmptySchema = n;
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
    (0, r.reportError)(S, s, void 0, c);
  }
  return Lt;
}
var qe = {}, Vt = {}, za;
function zo() {
  if (za) return Vt;
  za = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.getRules = Vt.isJSONType = void 0;
  const r = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(r);
  function t(n) {
    return typeof n == "string" && e.has(n);
  }
  Vt.isJSONType = t;
  function s() {
    const n = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...n, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, n.number, n.string, n.array, n.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return Vt.getRules = s, Vt;
}
var $t = {}, La;
function Lo() {
  if (La) return $t;
  La = 1, Object.defineProperty($t, "__esModule", { value: !0 }), $t.shouldUseRule = $t.shouldUseGroup = $t.schemaHasRulesForType = void 0;
  function r({ schema: s, self: n }, a) {
    const i = n.RULES.types[a];
    return i && i !== !0 && e(s, i);
  }
  $t.schemaHasRulesForType = r;
  function e(s, n) {
    return n.rules.some((a) => t(s, a));
  }
  $t.shouldUseGroup = e;
  function t(s, n) {
    var a;
    return s[n.keyword] !== void 0 || ((a = n.definition.implements) === null || a === void 0 ? void 0 : a.some((i) => s[i] !== void 0));
  }
  return $t.shouldUseRule = t, $t;
}
var Va;
function Cs() {
  if (Va) return qe;
  Va = 1, Object.defineProperty(qe, "__esModule", { value: !0 }), qe.reportTypeError = qe.checkDataTypes = qe.checkDataType = qe.coerceAndCheckDataType = qe.getJSONTypes = qe.getSchemaTypes = qe.DataType = void 0;
  const r = zo(), e = Lo(), t = Vs(), s = me(), n = we();
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
    const { gen: f, data: y, opts: k } = d, N = f.let("dataType", (0, s._)`typeof ${y}`), z = f.let("coerced", (0, s._)`undefined`);
    k.coerceTypes === "array" && f.if((0, s._)`${N} == 'object' && Array.isArray(${y}) && ${y}.length == 1`, () => f.assign(y, (0, s._)`${y}[0]`).assign(N, (0, s._)`typeof ${y}`).if(b(h, y, k.strictNumbers), () => f.assign(z, y))), f.if((0, s._)`${z} !== undefined`);
    for (const C of _)
      (u.has(C) || C === "array" && k.coerceTypes === "array") && G(C);
    f.else(), m(d), f.endIf(), f.if((0, s._)`${z} !== undefined`, () => {
      f.assign(y, z), w(d, z);
    });
    function G(C) {
      switch (C) {
        case "string":
          f.elseIf((0, s._)`${N} == "number" || ${N} == "boolean"`).assign(z, (0, s._)`"" + ${y}`).elseIf((0, s._)`${y} === null`).assign(z, (0, s._)`""`);
          return;
        case "number":
          f.elseIf((0, s._)`${N} == "boolean" || ${y} === null
              || (${N} == "string" && ${y} && ${y} == +${y})`).assign(z, (0, s._)`+${y}`);
          return;
        case "integer":
          f.elseIf((0, s._)`${N} === "boolean" || ${y} === null
              || (${N} === "string" && ${y} && ${y} == +${y} && !(${y} % 1))`).assign(z, (0, s._)`+${y}`);
          return;
        case "boolean":
          f.elseIf((0, s._)`${y} === "false" || ${y} === 0 || ${y} === null`).assign(z, !1).elseIf((0, s._)`${y} === "true" || ${y} === 1`).assign(z, !0);
          return;
        case "null":
          f.elseIf((0, s._)`${y} === "" || ${y} === 0 || ${y} === false`), f.assign(z, null);
          return;
        case "array":
          f.elseIf((0, s._)`${N} === "string" || ${N} === "number"
              || ${N} === "boolean" || ${y} === null`).assign(z, (0, s._)`[${y}]`);
      }
    }
  }
  function w({ gen: d, parentData: h, parentDataProperty: _ }, f) {
    d.if((0, s._)`${h} !== undefined`, () => d.assign((0, s._)`${h}[${_}]`, f));
  }
  function v(d, h, _, f = a.Correct) {
    const y = f === a.Correct ? s.operators.EQ : s.operators.NEQ;
    let k;
    switch (d) {
      case "null":
        return (0, s._)`${h} ${y} null`;
      case "array":
        k = (0, s._)`Array.isArray(${h})`;
        break;
      case "object":
        k = (0, s._)`${h} && typeof ${h} == "object" && !Array.isArray(${h})`;
        break;
      case "integer":
        k = N((0, s._)`!(${h} % 1) && !isNaN(${h})`);
        break;
      case "number":
        k = N();
        break;
      default:
        return (0, s._)`typeof ${h} ${y} ${d}`;
    }
    return f === a.Correct ? k : (0, s.not)(k);
    function N(z = s.nil) {
      return (0, s.and)((0, s._)`typeof ${h} == "number"`, z, _ ? (0, s._)`isFinite(${h})` : s.nil);
    }
  }
  qe.checkDataType = v;
  function b(d, h, _, f) {
    if (d.length === 1)
      return v(d[0], h, _, f);
    let y;
    const k = (0, n.toHash)(d);
    if (k.array && k.object) {
      const N = (0, s._)`typeof ${h} != "object"`;
      y = k.null ? N : (0, s._)`!${h} || ${N}`, delete k.null, delete k.array, delete k.object;
    } else
      y = s.nil;
    k.number && delete k.integer;
    for (const N in k)
      y = (0, s.and)(y, v(N, h, _, f));
    return y;
  }
  qe.checkDataTypes = b;
  const $ = {
    message: ({ schema: d }) => `must be ${d}`,
    params: ({ schema: d, schemaValue: h }) => typeof d == "string" ? (0, s._)`{type: ${d}}` : (0, s._)`{type: ${h}}`
  };
  function m(d) {
    const h = p(d);
    (0, t.reportError)(h, $);
  }
  qe.reportTypeError = m;
  function p(d) {
    const { gen: h, data: _, schema: f } = d, y = (0, n.schemaRefOrVal)(d, f, "type");
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
var ur = {}, Fa;
function el() {
  if (Fa) return ur;
  Fa = 1, Object.defineProperty(ur, "__esModule", { value: !0 }), ur.assignDefaults = void 0;
  const r = me(), e = we();
  function t(n, a) {
    const { properties: i, items: o } = n.schema;
    if (a === "object" && i)
      for (const c in i)
        s(n, c, i[c].default);
    else a === "array" && Array.isArray(o) && o.forEach((c, u) => s(n, u, c.default));
  }
  ur.assignDefaults = t;
  function s(n, a, i) {
    const { gen: o, compositeRule: c, data: u, opts: l } = n;
    if (i === void 0)
      return;
    const S = (0, r._)`${u}${(0, r.getProperty)(a)}`;
    if (c) {
      (0, e.checkStrictMode)(n, `default is ignored for: ${S}`);
      return;
    }
    let w = (0, r._)`${S} === undefined`;
    l.useDefaults === "empty" && (w = (0, r._)`${w} || ${S} === null || ${S} === ""`), o.if(w, (0, r._)`${S} = ${(0, r.stringify)(i)}`);
  }
  return ur;
}
var lt = {}, Pe = {}, Ua;
function mt() {
  if (Ua) return Pe;
  Ua = 1, Object.defineProperty(Pe, "__esModule", { value: !0 }), Pe.validateUnion = Pe.validateArray = Pe.usePattern = Pe.callValidateCode = Pe.schemaProperties = Pe.allSchemaProperties = Pe.noPropertyInData = Pe.propertyInData = Pe.isOwnProperty = Pe.hasPropFunc = Pe.reportMissingProp = Pe.checkMissingProp = Pe.checkReportMissingProp = void 0;
  const r = me(), e = we(), t = zt(), s = we();
  function n(d, h) {
    const { gen: _, data: f, it: y } = d;
    _.if(l(_, f, h, y.opts.ownProperties), () => {
      d.setParams({ missingProperty: (0, r._)`${h}` }, !0), d.error();
    });
  }
  Pe.checkReportMissingProp = n;
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
  function v({ schemaCode: d, data: h, it: { gen: _, topSchemaRef: f, schemaPath: y, errorPath: k }, it: N }, z, G, C) {
    const F = C ? (0, r._)`${d}, ${h}, ${f}${y}` : h, W = [
      [t.default.instancePath, (0, r.strConcat)(t.default.instancePath, k)],
      [t.default.parentData, N.parentData],
      [t.default.parentDataProperty, N.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    N.opts.dynamicRef && W.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const ee = (0, r._)`${F}, ${_.object(...W)}`;
    return G !== r.nil ? (0, r._)`${z}.call(${G}, ${ee})` : (0, r._)`${z}(${ee})`;
  }
  Pe.callValidateCode = v;
  const b = (0, r._)`new RegExp`;
  function $({ gen: d, it: { opts: h } }, _) {
    const f = h.unicodeRegExp ? "u" : "", { regExp: y } = h.code, k = y(_, f);
    return d.scopeValue("pattern", {
      key: k.toString(),
      ref: k,
      code: (0, r._)`${y.code === "new RegExp" ? b : (0, s.useFunc)(d, y)}(${_}, ${f})`
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
      const G = h.const("len", (0, r._)`${_}.length`);
      h.forRange("i", 0, G, (C) => {
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
    if (_.some((G) => (0, e.alwaysValidSchema)(y, G)) && !y.opts.unevaluated)
      return;
    const N = h.let("valid", !1), z = h.name("_valid");
    h.block(() => _.forEach((G, C) => {
      const F = d.subschema({
        keyword: f,
        schemaProp: C,
        compositeRule: !0
      }, z);
      h.assign(N, (0, r._)`${N} || ${z}`), d.mergeValidEvaluated(F, z) || h.if((0, r.not)(N));
    })), d.result(N, () => d.reset(), () => d.error(!0));
  }
  return Pe.validateUnion = p, Pe;
}
var Ha;
function tl() {
  if (Ha) return lt;
  Ha = 1, Object.defineProperty(lt, "__esModule", { value: !0 }), lt.validateKeywordUsage = lt.validSchemaType = lt.funcKeywordCode = lt.macroKeywordCode = void 0;
  const r = me(), e = zt(), t = mt(), s = Vs();
  function n(w, v) {
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
  lt.macroKeywordCode = n;
  function a(w, v) {
    var b;
    const { gen: $, keyword: m, schema: p, parentSchema: d, $data: h, it: _ } = w;
    c(_, v);
    const f = !h && v.compile ? v.compile.call(_.self, p, d, _) : v.validate, y = u($, m, f), k = $.let("valid");
    w.block$data(k, N), w.ok((b = v.valid) !== null && b !== void 0 ? b : k);
    function N() {
      if (v.errors === !1)
        C(), v.modifying && i(w), F(() => w.error());
      else {
        const W = v.async ? z() : G();
        v.modifying && i(w), F(() => o(w, W));
      }
    }
    function z() {
      const W = $.let("ruleErrs", null);
      return $.try(() => C((0, r._)`await `), (ee) => $.assign(k, !1).if((0, r._)`${ee} instanceof ${_.ValidationError}`, () => $.assign(W, (0, r._)`${ee}.errors`), () => $.throw(ee))), W;
    }
    function G() {
      const W = (0, r._)`${y}.errors`;
      return $.assign(W, null), C(r.nil), W;
    }
    function C(W = v.async ? (0, r._)`await ` : r.nil) {
      const ee = _.opts.passContext ? e.default.this : e.default.self, Se = !("compile" in v && !h || v.schema === !1);
      $.assign(k, (0, r._)`${W}${(0, t.callValidateCode)(w, y, ee, Se)}`, v.modifying);
    }
    function F(W) {
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
      b.assign(e.default.vErrors, (0, r._)`${e.default.vErrors} === null ? ${v} : ${e.default.vErrors}.concat(${v})`).assign(e.default.errors, (0, r._)`${e.default.vErrors}.length`), (0, s.extendErrors)(w);
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
var kt = {}, Ka;
function rl() {
  if (Ka) return kt;
  Ka = 1, Object.defineProperty(kt, "__esModule", { value: !0 }), kt.extendSubschemaMode = kt.extendSubschemaData = kt.getSubschema = void 0;
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
  kt.getSubschema = t;
  function s(a, i, { dataProp: o, dataPropType: c, data: u, dataTypes: l, propertyName: S }) {
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
  kt.extendSubschemaData = s;
  function n(a, { jtdDiscriminator: i, jtdMetadata: o, compositeRule: c, createErrors: u, allErrors: l }) {
    c !== void 0 && (a.compositeRule = c), u !== void 0 && (a.createErrors = u), l !== void 0 && (a.allErrors = l), a.jtdDiscriminator = i, a.jtdMetadata = o;
  }
  return kt.extendSubschemaMode = n, kt;
}
var Le = {}, rn, Ba;
function Vo() {
  return Ba || (Ba = 1, rn = function r(e, t) {
    if (e === t) return !0;
    if (e && t && typeof e == "object" && typeof t == "object") {
      if (e.constructor !== t.constructor) return !1;
      var s, n, a;
      if (Array.isArray(e)) {
        if (s = e.length, s != t.length) return !1;
        for (n = s; n-- !== 0; )
          if (!r(e[n], t[n])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
      if (a = Object.keys(e), s = a.length, s !== Object.keys(t).length) return !1;
      for (n = s; n-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(t, a[n])) return !1;
      for (n = s; n-- !== 0; ) {
        var i = a[n];
        if (!r(e[i], t[i])) return !1;
      }
      return !0;
    }
    return e !== e && t !== t;
  }), rn;
}
var sn = { exports: {} }, Ga;
function sl() {
  if (Ga) return sn.exports;
  Ga = 1;
  var r = sn.exports = function(s, n, a) {
    typeof n == "function" && (a = n, n = {}), a = n.cb || a;
    var i = typeof a == "function" ? a : a.pre || function() {
    }, o = a.post || function() {
    };
    e(n, i, o, s, "", s);
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
  function e(s, n, a, i, o, c, u, l, S, w) {
    if (i && typeof i == "object" && !Array.isArray(i)) {
      n(i, o, c, u, l, S, w);
      for (var v in i) {
        var b = i[v];
        if (Array.isArray(b)) {
          if (v in r.arrayKeywords)
            for (var $ = 0; $ < b.length; $++)
              e(s, n, a, b[$], o + "/" + v + "/" + $, c, o, v, i, $);
        } else if (v in r.propsKeywords) {
          if (b && typeof b == "object")
            for (var m in b)
              e(s, n, a, b[m], o + "/" + v + "/" + t(m), c, o, v, i, m);
        } else (v in r.keywords || s.allKeys && !(v in r.skipKeywords)) && e(s, n, a, b, o + "/" + v, c, o, v, i);
      }
      a(i, o, c, u, l, S, w);
    }
  }
  function t(s) {
    return s.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return sn.exports;
}
var Ja;
function Fs() {
  if (Ja) return Le;
  Ja = 1, Object.defineProperty(Le, "__esModule", { value: !0 }), Le.getSchemaRefs = Le.resolveUrl = Le.normalizeId = Le._getFullPath = Le.getFullPath = Le.inlineRef = void 0;
  const r = we(), e = Vo(), t = sl(), s = /* @__PURE__ */ new Set([
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
  function n($, m = !0) {
    return typeof $ == "boolean" ? !0 : m === !0 ? !i($) : m ? o($) <= m : !1;
  }
  Le.inlineRef = n;
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
      if (m++, !s.has(p) && (typeof $[p] == "object" && (0, r.eachItem)($[p], (d) => m += o(d)), m === 1 / 0))
        return 1 / 0;
    }
    return m;
  }
  function c($, m = "", p) {
    p !== !1 && (m = S(m));
    const d = $.parse(m);
    return u($, d);
  }
  Le.getFullPath = c;
  function u($, m) {
    return $.serialize(m).split("#")[0] + "#";
  }
  Le._getFullPath = u;
  const l = /#\/?$/;
  function S($) {
    return $ ? $.replace(l, "") : "";
  }
  Le.normalizeId = S;
  function w($, m, p) {
    return p = S(p), $.resolve(m, p);
  }
  Le.resolveUrl = w;
  const v = /^[a-z_][-a-z0-9._]*$/i;
  function b($, m) {
    if (typeof $ == "boolean")
      return {};
    const { schemaId: p, uriResolver: d } = this.opts, h = S($[p] || m), _ = { "": h }, f = c(d, h, !1), y = {}, k = /* @__PURE__ */ new Set();
    return t($, { allKeys: !0 }, (G, C, F, W) => {
      if (W === void 0)
        return;
      const ee = f + C;
      let Se = _[W];
      typeof G[p] == "string" && (Se = Ze.call(this, G[p])), ze.call(this, G.$anchor), ze.call(this, G.$dynamicAnchor), _[C] = Se;
      function Ze(Te) {
        const ut = this.opts.uriResolver.resolve;
        if (Te = S(Se ? ut(Se, Te) : Te), k.has(Te))
          throw z(Te);
        k.add(Te);
        let L = this.refs[Te];
        return typeof L == "string" && (L = this.refs[L]), typeof L == "object" ? N(G, L.schema, Te) : Te !== S(ee) && (Te[0] === "#" ? (N(G, y[Te], Te), y[Te] = G) : this.refs[Te] = ee), Te;
      }
      function ze(Te) {
        if (typeof Te == "string") {
          if (!v.test(Te))
            throw new Error(`invalid anchor "${Te}"`);
          Ze.call(this, `#${Te}`);
        }
      }
    }), y;
    function N(G, C, F) {
      if (C !== void 0 && !e(G, C))
        throw z(F);
    }
    function z(G) {
      return new Error(`reference "${G}" resolves to more than one schema`);
    }
  }
  return Le.getSchemaRefs = b, Le;
}
var Wa;
function Us() {
  if (Wa) return wt;
  Wa = 1, Object.defineProperty(wt, "__esModule", { value: !0 }), wt.getData = wt.KeywordCxt = wt.validateFunctionCode = void 0;
  const r = Xd(), e = Cs(), t = Lo(), s = Cs(), n = el(), a = tl(), i = rl(), o = me(), c = zt(), u = Fs(), l = we(), S = Vs();
  function w(R) {
    if (f(R) && (k(R), _(R))) {
      m(R);
      return;
    }
    v(R, () => (0, r.topBoolOrEmptySchema)(R));
  }
  wt.validateFunctionCode = w;
  function v({ gen: R, validateName: E, schema: I, schemaEnv: V, opts: ne }, pe) {
    ne.code.es5 ? R.func(E, (0, o._)`${c.default.data}, ${c.default.valCxt}`, V.$async, () => {
      R.code((0, o._)`"use strict"; ${d(I, ne)}`), $(R, ne), R.code(pe);
    }) : R.func(E, (0, o._)`${c.default.data}, ${b(ne)}`, V.$async, () => R.code(d(I, ne)).code(pe));
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
      I.$comment && E.$comment && W(R), G(R), V.let(c.default.vErrors, null), V.let(c.default.errors, 0), I.unevaluated && p(R), N(R), ee(R);
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
    const { schema: I, gen: V, opts: ne } = R;
    ne.$comment && I.$comment && W(R), C(R), F(R);
    const pe = V.const("_errs", c.default.errors);
    N(R, pe), V.var(E, (0, o._)`${pe} === ${c.default.errors}`);
  }
  function k(R) {
    (0, l.checkUnknownRules)(R), z(R);
  }
  function N(R, E) {
    if (R.opts.jtd)
      return Ze(R, [], !1, E);
    const I = (0, e.getSchemaTypes)(R.schema), V = (0, e.coerceAndCheckDataType)(R, I);
    Ze(R, I, !V, E);
  }
  function z(R) {
    const { schema: E, errSchemaPath: I, opts: V, self: ne } = R;
    E.$ref && V.ignoreKeywordsWithRef && (0, l.schemaHasRulesButRef)(E, ne.RULES) && ne.logger.warn(`$ref: keywords ignored in schema at path "${I}"`);
  }
  function G(R) {
    const { schema: E, opts: I } = R;
    E.default !== void 0 && I.useDefaults && I.strictSchema && (0, l.checkStrictMode)(R, "default is ignored in the schema root");
  }
  function C(R) {
    const E = R.schema[R.opts.schemaId];
    E && (R.baseId = (0, u.resolveUrl)(R.opts.uriResolver, R.baseId, E));
  }
  function F(R) {
    if (R.schema.$async && !R.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function W({ gen: R, schemaEnv: E, schema: I, errSchemaPath: V, opts: ne }) {
    const pe = I.$comment;
    if (ne.$comment === !0)
      R.code((0, o._)`${c.default.self}.logger.log(${pe})`);
    else if (typeof ne.$comment == "function") {
      const Ae = (0, o.str)`${V}/$comment`, dt = R.scopeValue("root", { ref: E.root });
      R.code((0, o._)`${c.default.self}.opts.$comment(${pe}, ${Ae}, ${dt}.schema)`);
    }
  }
  function ee(R) {
    const { gen: E, schemaEnv: I, validateName: V, ValidationError: ne, opts: pe } = R;
    I.$async ? E.if((0, o._)`${c.default.errors} === 0`, () => E.return(c.default.data), () => E.throw((0, o._)`new ${ne}(${c.default.vErrors})`)) : (E.assign((0, o._)`${V}.errors`, c.default.vErrors), pe.unevaluated && Se(R), E.return((0, o._)`${c.default.errors} === 0`));
  }
  function Se({ gen: R, evaluated: E, props: I, items: V }) {
    I instanceof o.Name && R.assign((0, o._)`${E}.props`, I), V instanceof o.Name && R.assign((0, o._)`${E}.items`, V);
  }
  function Ze(R, E, I, V) {
    const { gen: ne, schema: pe, data: Ae, allErrors: dt, opts: Ge, self: Je } = R, { RULES: je } = Je;
    if (pe.$ref && (Ge.ignoreKeywordsWithRef || !(0, l.schemaHasRulesButRef)(pe, je))) {
      ne.block(() => te(R, "$ref", je.all.$ref.definition));
      return;
    }
    Ge.jtd || Te(R, E), ne.block(() => {
      for (const rt of je.rules)
        Yt(rt);
      Yt(je.post);
    });
    function Yt(rt) {
      (0, t.shouldUseGroup)(pe, rt) && (rt.type ? (ne.if((0, s.checkDataType)(rt.type, Ae, Ge.strictNumbers)), ze(R, rt), E.length === 1 && E[0] === rt.type && I && (ne.else(), (0, s.reportTypeError)(R)), ne.endIf()) : ze(R, rt), dt || ne.if((0, o._)`${c.default.errors} === ${V || 0}`));
    }
  }
  function ze(R, E) {
    const { gen: I, schema: V, opts: { useDefaults: ne } } = R;
    ne && (0, n.assignDefaults)(R, E.type), I.block(() => {
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
      const ne = I[V];
      if (typeof ne == "object" && (0, t.shouldUseRule)(R.schema, ne)) {
        const { type: pe } = ne.definition;
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
      const { gen: V, schemaCode: ne, schemaType: pe, def: Ae } = this;
      V.if((0, o.or)((0, o._)`${ne} === undefined`, I)), E !== o.nil && V.assign(E, !0), (pe.length || Ae.validateSchema) && (V.elseIf(this.invalid$data()), this.$dataError(), E !== o.nil && V.assign(E, !1)), V.else();
    }
    invalid$data() {
      const { gen: E, schemaCode: I, schemaType: V, def: ne, it: pe } = this;
      return (0, o.or)(Ae(), dt());
      function Ae() {
        if (V.length) {
          if (!(I instanceof o.Name))
            throw new Error("ajv implementation error");
          const Ge = Array.isArray(V) ? V : [V];
          return (0, o._)`${(0, s.checkDataTypes)(Ge, I, pe.opts.strictNumbers, s.DataType.Wrong)}`;
        }
        return o.nil;
      }
      function dt() {
        if (ne.validateSchema) {
          const Ge = E.scopeValue("validate$data", { ref: ne.validateSchema });
          return (0, o._)`!${Ge}(${I})`;
        }
        return o.nil;
      }
    }
    subschema(E, I) {
      const V = (0, i.getSubschema)(this.it, E);
      (0, i.extendSubschemaData)(V, this.it, E), (0, i.extendSubschemaMode)(V, E);
      const ne = { ...this.it, ...V, items: void 0, props: void 0 };
      return h(ne, I), ne;
    }
    mergeEvaluated(E, I) {
      const { it: V, gen: ne } = this;
      V.opts.unevaluated && (V.props !== !0 && E.props !== void 0 && (V.props = l.mergeEvaluated.props(ne, E.props, V.props, I)), V.items !== !0 && E.items !== void 0 && (V.items = l.mergeEvaluated.items(ne, E.items, V.items, I)));
    }
    mergeValidEvaluated(E, I) {
      const { it: V, gen: ne } = this;
      if (V.opts.unevaluated && (V.props !== !0 || V.items !== !0))
        return ne.if(I, () => this.mergeEvaluated(E, o.Name)), !0;
    }
  }
  wt.KeywordCxt = O;
  function te(R, E, I, V) {
    const ne = new O(R, I, E);
    "code" in I ? I.code(ne, V) : ne.$data && I.validate ? (0, a.funcKeywordCode)(ne, I) : "macro" in I ? (0, a.macroKeywordCode)(ne, I) : (I.compile || I.validate) && (0, a.funcKeywordCode)(ne, I);
  }
  const ae = /^\/(?:[^~]|~0|~1)*$/, $e = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function _e(R, { dataLevel: E, dataNames: I, dataPathArr: V }) {
    let ne, pe;
    if (R === "")
      return c.default.rootData;
    if (R[0] === "/") {
      if (!ae.test(R))
        throw new Error(`Invalid JSON-pointer: ${R}`);
      ne = R, pe = c.default.rootData;
    } else {
      const Je = $e.exec(R);
      if (!Je)
        throw new Error(`Invalid JSON-pointer: ${R}`);
      const je = +Je[1];
      if (ne = Je[2], ne === "#") {
        if (je >= E)
          throw new Error(Ge("property/index", je));
        return V[E - je];
      }
      if (je > E)
        throw new Error(Ge("data", je));
      if (pe = I[E - je], !ne)
        return pe;
    }
    let Ae = pe;
    const dt = ne.split("/");
    for (const Je of dt)
      Je && (pe = (0, o._)`${pe}${(0, o.getProperty)((0, l.unescapeJsonPointer)(Je))}`, Ae = (0, o._)`${Ae} && ${pe}`);
    return Ae;
    function Ge(Je, je) {
      return `Cannot access ${Je} ${je} levels up, current level is ${E}`;
    }
  }
  return wt.getData = _e, wt;
}
var Tr = {}, Qa;
function sa() {
  if (Qa) return Tr;
  Qa = 1, Object.defineProperty(Tr, "__esModule", { value: !0 });
  class r extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return Tr.default = r, Tr;
}
var Er = {}, Ya;
function Hs() {
  if (Ya) return Er;
  Ya = 1, Object.defineProperty(Er, "__esModule", { value: !0 });
  const r = Fs();
  class e extends Error {
    constructor(s, n, a, i) {
      super(i || `can't resolve reference ${a} from id ${n}`), this.missingRef = (0, r.resolveUrl)(s, n, a), this.missingSchema = (0, r.normalizeId)((0, r.getFullPath)(s, this.missingRef));
    }
  }
  return Er.default = e, Er;
}
var et = {}, Xa;
function na() {
  if (Xa) return et;
  Xa = 1, Object.defineProperty(et, "__esModule", { value: !0 }), et.resolveSchema = et.getCompilingSchema = et.resolveRef = et.compileSchema = et.SchemaEnv = void 0;
  const r = me(), e = sa(), t = zt(), s = Fs(), n = we(), a = Us();
  class i {
    constructor(p) {
      var d;
      this.refs = {}, this.dynamicAnchors = {};
      let h;
      typeof p.schema == "object" && (h = p.schema), this.schema = p.schema, this.schemaId = p.schemaId, this.root = p.root || this, this.baseId = (d = p.baseId) !== null && d !== void 0 ? d : (0, s.normalizeId)(h == null ? void 0 : h[p.schemaId || "$id"]), this.schemaPath = p.schemaPath, this.localRefs = p.localRefs, this.meta = p.meta, this.$async = h == null ? void 0 : h.$async, this.refs = {};
    }
  }
  et.SchemaEnv = i;
  function o(m) {
    const p = l.call(this, m);
    if (p)
      return p;
    const d = (0, s.getFullPath)(this.opts.uriResolver, m.root.baseId), { es5: h, lines: _ } = this.opts.code, { ownProperties: f } = this.opts, y = new r.CodeGen(this.scope, { es5: h, lines: _, ownProperties: f });
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
    let G;
    try {
      this._compilations.add(m), (0, a.validateFunctionCode)(z), y.optimize(this.opts.code.optimize);
      const C = y.toString();
      G = `${y.scopeRefs(t.default.scope)}return ${C}`, this.opts.code.process && (G = this.opts.code.process(G, m));
      const W = new Function(`${t.default.self}`, `${t.default.scope}`, G)(this, this.scope.get());
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
      throw delete m.validate, delete m.validateName, G && this.logger.error("Error compiling schema, function code:", G), C;
    } finally {
      this._compilations.delete(m);
    }
  }
  et.compileSchema = o;
  function c(m, p, d) {
    var h;
    d = (0, s.resolveUrl)(this.opts.uriResolver, p, d);
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
    return (0, s.inlineRef)(m.schema, this.opts.inlineRefs) ? m.schema : m.validate ? m : o.call(this, m);
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
    const d = this.opts.uriResolver.parse(p), h = (0, s._getFullPath)(this.opts.uriResolver, d);
    let _ = (0, s.getFullPath)(this.opts.uriResolver, m.baseId, void 0);
    if (Object.keys(m.schema).length > 0 && h === _)
      return $.call(this, d, m);
    const f = (0, s.normalizeId)(h), y = this.refs[f] || this.schemas[f];
    if (typeof y == "string") {
      const k = v.call(this, m, y);
      return typeof (k == null ? void 0 : k.schema) != "object" ? void 0 : $.call(this, d, k);
    }
    if (typeof (y == null ? void 0 : y.schema) == "object") {
      if (y.validate || o.call(this, y), f === (0, s.normalizeId)(p)) {
        const { schema: k } = y, { schemaId: N } = this.opts, z = k[N];
        return z && (_ = (0, s.resolveUrl)(this.opts.uriResolver, _, z)), new i({ schema: k, schemaId: N, root: m, baseId: _ });
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
      const N = d[(0, n.unescapeFragment)(k)];
      if (N === void 0)
        return;
      d = N;
      const z = typeof d == "object" && d[this.opts.schemaId];
      !b.has(k) && z && (p = (0, s.resolveUrl)(this.opts.uriResolver, p, z));
    }
    let f;
    if (typeof d != "boolean" && d.$ref && !(0, n.schemaHasRulesButRef)(d, this.RULES)) {
      const k = (0, s.resolveUrl)(this.opts.uriResolver, p, d.$ref);
      f = v.call(this, h, k);
    }
    const { schemaId: y } = this.opts;
    if (f = f || new i({ schema: d, schemaId: y, root: h, baseId: p }), f.schema !== f.root.schema)
      return f;
  }
  return et;
}
const nl = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", al = "Meta-schema for $data reference (JSON AnySchema extension proposal)", il = "object", ol = ["$data"], cl = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, ul = !1, dl = {
  $id: nl,
  description: al,
  type: il,
  required: ol,
  properties: cl,
  additionalProperties: ul
};
var xr = {}, dr = { exports: {} }, nn, ei;
function Fo() {
  if (ei) return nn;
  ei = 1;
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
  const s = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function n(w) {
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
          h = n;
        } else {
          m.push(f);
          continue;
        }
    }
    return m.length && (h === n ? b.zone = m.join("") : d ? $.push(m.join("")) : $.push(t(m))), b.address = $.join(""), b;
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
  return nn = {
    nonSimpleDomain: s,
    recomposeAuthority: S,
    normalizeComponentEncoding: l,
    removeDotSegments: u,
    isIPv4: e,
    isUUID: r,
    normalizeIPv6: o,
    stringArrayToHexStripped: t
  }, nn;
}
var an, ti;
function ll() {
  if (ti) return an;
  ti = 1;
  const { isUUID: r } = Fo(), e = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu, t = (
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
  function s(f) {
    return t.indexOf(
      /** @type {*} */
      f
    ) !== -1;
  }
  function n(f) {
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
    return f.secure = n(f), f.resourceName = (f.path || "/") + (f.query ? "?" + f.query : ""), f.path = void 0, f.query = void 0, f;
  }
  function c(f) {
    if ((f.port === (n(f) ? 443 : 80) || f.port === "") && (f.port = void 0), typeof f.secure == "boolean" && (f.scheme = f.secure ? "wss" : "ws", f.secure = void 0), f.resourceName) {
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
      const z = `${N}:${y.nid || f.nid}`, G = _(z);
      f.path = void 0, G && (f = G.parse(f, y));
    } else
      f.error = f.error || "URN can not be parsed.";
    return f;
  }
  function l(f, y) {
    if (f.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const k = y.scheme || f.scheme || "urn", N = f.nid.toLowerCase(), z = `${k}:${y.nid || N}`, G = _(z);
    G && (f = G.serialize(f, y));
    const C = f, F = f.nss;
    return C.path = `${N || y.nid}:${F}`, y.skipEscape = !0, C;
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
  return an = {
    wsIsSecure: n,
    SCHEMES: h,
    isValidSchemeName: s,
    getSchemeHandler: _
  }, an;
}
var ri;
function fl() {
  if (ri) return dr.exports;
  ri = 1;
  const { normalizeIPv6: r, removeDotSegments: e, recomposeAuthority: t, normalizeComponentEncoding: s, isIPv4: n, nonSimpleDomain: a } = Fo(), { SCHEMES: i, getSchemeHandler: o } = ll();
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
    return typeof m == "string" ? (m = unescape(m), m = w(s(b(m, d), !0), { ...d, skipEscape: !0 })) : typeof m == "object" && (m = w(s(m, !0), { ...d, skipEscape: !0 })), typeof p == "string" ? (p = unescape(p), p = w(s(b(p, d), !0), { ...d, skipEscape: !0 })) : typeof p == "object" && (p = w(s(p, !0), { ...d, skipEscape: !0 })), m.toLowerCase() === p.toLowerCase();
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
        if (n(h.host) === !1) {
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
function hl() {
  if (si) return xr;
  si = 1, Object.defineProperty(xr, "__esModule", { value: !0 });
  const r = fl();
  return r.code = 'require("ajv/dist/runtime/uri").default', xr.default = r, xr;
}
var ni;
function ml() {
  return ni || (ni = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.CodeGen = r.Name = r.nil = r.stringify = r.str = r._ = r.KeywordCxt = void 0;
    var e = Us();
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
    const s = sa(), n = Hs(), a = zo(), i = na(), o = me(), c = Fs(), u = Cs(), l = we(), S = dl, w = hl(), v = (L, T) => new RegExp(L, T);
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
      var T, A, x, g, P, O, te, ae, $e, _e, R, E, I, V, ne, pe, Ae, dt, Ge, Je, je, Yt, rt, Ks, Bs;
      const cr = L.strict, Gs = (T = L.code) === null || T === void 0 ? void 0 : T.optimize, ia = Gs === !0 || Gs === void 0 ? 1 : Gs || 0, oa = (x = (A = L.code) === null || A === void 0 ? void 0 : A.regExp) !== null && x !== void 0 ? x : v, tc = (g = L.uriResolver) !== null && g !== void 0 ? g : w.default;
      return {
        strictSchema: (O = (P = L.strictSchema) !== null && P !== void 0 ? P : cr) !== null && O !== void 0 ? O : !0,
        strictNumbers: (ae = (te = L.strictNumbers) !== null && te !== void 0 ? te : cr) !== null && ae !== void 0 ? ae : !0,
        strictTypes: (_e = ($e = L.strictTypes) !== null && $e !== void 0 ? $e : cr) !== null && _e !== void 0 ? _e : "log",
        strictTuples: (E = (R = L.strictTuples) !== null && R !== void 0 ? R : cr) !== null && E !== void 0 ? E : "log",
        strictRequired: (V = (I = L.strictRequired) !== null && I !== void 0 ? I : cr) !== null && V !== void 0 ? V : !1,
        code: L.code ? { ...L.code, optimize: ia, regExp: oa } : { optimize: ia, regExp: oa },
        loopRequired: (ne = L.loopRequired) !== null && ne !== void 0 ? ne : d,
        loopEnum: (pe = L.loopEnum) !== null && pe !== void 0 ? pe : d,
        meta: (Ae = L.meta) !== null && Ae !== void 0 ? Ae : !0,
        messages: (dt = L.messages) !== null && dt !== void 0 ? dt : !0,
        inlineRefs: (Ge = L.inlineRefs) !== null && Ge !== void 0 ? Ge : !0,
        schemaId: (Je = L.schemaId) !== null && Je !== void 0 ? Je : "$id",
        addUsedSchema: (je = L.addUsedSchema) !== null && je !== void 0 ? je : !0,
        validateSchema: (Yt = L.validateSchema) !== null && Yt !== void 0 ? Yt : !0,
        validateFormats: (rt = L.validateFormats) !== null && rt !== void 0 ? rt : !0,
        unicodeRegExp: (Ks = L.unicodeRegExp) !== null && Ks !== void 0 ? Ks : !0,
        int32range: (Bs = L.int32range) !== null && Bs !== void 0 ? Bs : !0,
        uriResolver: tc
      };
    }
    class _ {
      constructor(T = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), T = this.opts = { ...T, ...h(T) };
        const { es5: A, lines: x } = this.opts.code;
        this.scope = new o.ValueScope({ scope: {}, prefixes: $, es5: A, lines: x }), this.logger = F(T.logger);
        const g = T.validateFormats;
        T.validateFormats = !1, this.RULES = (0, a.getRules)(), f.call(this, m, T, "NOT SUPPORTED"), f.call(this, p, T, "DEPRECATED", "warn"), this._metaOpts = G.call(this), T.formats && N.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), T.keywords && z.call(this, T.keywords), typeof T.meta == "object" && this.addMetaSchema(T.meta), k.call(this), T.validateFormats = g;
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
            if (!(R instanceof n.default))
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
        ze.call(this, A);
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
    _.ValidationError = s.default, _.MissingRefError = n.default, r.default = _;
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
    function G() {
      const L = { ...this.opts };
      for (const T of b)
        delete L[T];
      return L;
    }
    const C = { log() {
    }, warn() {
    }, error() {
    } };
    function F(L) {
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
      T.before ? Ze.call(this, O, te, T.before) : O.rules.push(te), P.all[L] = te, (x = T.implements) === null || x === void 0 || x.forEach((ae) => this.addKeyword(ae));
    }
    function Ze(L, T, A) {
      const x = L.rules.findIndex((g) => g.keyword === A);
      x >= 0 ? L.rules.splice(x, 0, T) : (L.rules.push(T), this.logger.warn(`rule ${A} is not defined`));
    }
    function ze(L) {
      let { metaSchema: T } = L;
      T !== void 0 && (L.$data && this.opts.$data && (T = ut(T)), L.validateSchema = this.compile(T, !0));
    }
    const Te = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ut(L) {
      return { anyOf: [L, Te] };
    }
  })(Qs)), Qs;
}
var Nr = {}, Or = {}, Cr = {}, ai;
function pl() {
  if (ai) return Cr;
  ai = 1, Object.defineProperty(Cr, "__esModule", { value: !0 });
  const r = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Cr.default = r, Cr;
}
var It = {}, ii;
function gl() {
  if (ii) return It;
  ii = 1, Object.defineProperty(It, "__esModule", { value: !0 }), It.callRef = It.getValidate = void 0;
  const r = Hs(), e = mt(), t = me(), s = zt(), n = na(), a = we(), i = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: l, schema: S, it: w } = u, { baseId: v, schemaEnv: b, validateName: $, opts: m, self: p } = w, { root: d } = b;
      if ((S === "#" || S === "#/") && v === d.baseId)
        return _();
      const h = n.resolveRef.call(p, d, v, S);
      if (h === void 0)
        throw new r.default(w.opts.uriResolver, v, S);
      if (h instanceof n.SchemaEnv)
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
        const N = l.scopeValue("schema", m.code.source === !0 ? { ref: k, code: (0, t.stringify)(k) } : { ref: k }), z = l.name("valid"), G = u.subschema({
          schema: k,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: N,
          errSchemaPath: S
        }, z);
        u.mergeEvaluated(G), u.ok(z);
      }
    }
  };
  function o(u, l) {
    const { gen: S } = u;
    return l.validate ? S.scopeValue("validate", { ref: l.validate }) : (0, t._)`${S.scopeValue("wrapper", { ref: l })}.validate`;
  }
  It.getValidate = o;
  function c(u, l, S, w) {
    const { gen: v, it: b } = u, { allErrors: $, schemaEnv: m, opts: p } = b, d = p.passContext ? s.default.this : t.nil;
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
      v.assign(s.default.vErrors, (0, t._)`${s.default.vErrors} === null ? ${N} : ${s.default.vErrors}.concat(${N})`), v.assign(s.default.errors, (0, t._)`${s.default.vErrors}.length`);
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
          const G = v.var("props", (0, t._)`${k}.evaluated.props`);
          b.props = a.mergeEvaluated.props(v, G, b.props, t.Name);
        }
      if (b.items !== !0)
        if (z && !z.dynamicItems)
          z.items !== void 0 && (b.items = a.mergeEvaluated.items(v, z.items, b.items));
        else {
          const G = v.var("items", (0, t._)`${k}.evaluated.items`);
          b.items = a.mergeEvaluated.items(v, G, b.items, t.Name);
        }
    }
  }
  return It.callRef = c, It.default = i, It;
}
var oi;
function yl() {
  if (oi) return Or;
  oi = 1, Object.defineProperty(Or, "__esModule", { value: !0 });
  const r = pl(), e = gl(), t = [
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
var Ir = {}, Ar = {}, ci;
function _l() {
  if (ci) return Ar;
  ci = 1, Object.defineProperty(Ar, "__esModule", { value: !0 });
  const r = me(), e = r.operators, t = {
    maximum: { okStr: "<=", ok: e.LTE, fail: e.GT },
    minimum: { okStr: ">=", ok: e.GTE, fail: e.LT },
    exclusiveMaximum: { okStr: "<", ok: e.LT, fail: e.GTE },
    exclusiveMinimum: { okStr: ">", ok: e.GT, fail: e.LTE }
  }, s = {
    message: ({ keyword: a, schemaCode: i }) => (0, r.str)`must be ${t[a].okStr} ${i}`,
    params: ({ keyword: a, schemaCode: i }) => (0, r._)`{comparison: ${t[a].okStr}, limit: ${i}}`
  }, n = {
    keyword: Object.keys(t),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: s,
    code(a) {
      const { keyword: i, data: o, schemaCode: c } = a;
      a.fail$data((0, r._)`${o} ${t[i].fail} ${c} || isNaN(${o})`);
    }
  };
  return Ar.default = n, Ar;
}
var jr = {}, ui;
function vl() {
  if (ui) return jr;
  ui = 1, Object.defineProperty(jr, "__esModule", { value: !0 });
  const r = me(), t = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: s }) => (0, r.str)`must be multiple of ${s}`,
      params: ({ schemaCode: s }) => (0, r._)`{multipleOf: ${s}}`
    },
    code(s) {
      const { gen: n, data: a, schemaCode: i, it: o } = s, c = o.opts.multipleOfPrecision, u = n.let("res"), l = c ? (0, r._)`Math.abs(Math.round(${u}) - ${u}) > 1e-${c}` : (0, r._)`${u} !== parseInt(${u})`;
      s.fail$data((0, r._)`(${i} === 0 || (${u} = ${a}/${i}, ${l}))`);
    }
  };
  return jr.default = t, jr;
}
var Mr = {}, qr = {}, di;
function bl() {
  if (di) return qr;
  di = 1, Object.defineProperty(qr, "__esModule", { value: !0 });
  function r(e) {
    const t = e.length;
    let s = 0, n = 0, a;
    for (; n < t; )
      s++, a = e.charCodeAt(n++), a >= 55296 && a <= 56319 && n < t && (a = e.charCodeAt(n), (a & 64512) === 56320 && n++);
    return s;
  }
  return qr.default = r, r.code = 'require("ajv/dist/runtime/ucs2length").default', qr;
}
var li;
function wl() {
  if (li) return Mr;
  li = 1, Object.defineProperty(Mr, "__esModule", { value: !0 });
  const r = me(), e = we(), t = bl(), n = {
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
  return Mr.default = n, Mr;
}
var Dr = {}, fi;
function $l() {
  if (fi) return Dr;
  fi = 1, Object.defineProperty(Dr, "__esModule", { value: !0 });
  const r = mt(), e = me(), s = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match pattern "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{pattern: ${n}}`
    },
    code(n) {
      const { data: a, $data: i, schema: o, schemaCode: c, it: u } = n, l = u.opts.unicodeRegExp ? "u" : "", S = i ? (0, e._)`(new RegExp(${c}, ${l}))` : (0, r.usePattern)(n, o);
      n.fail$data((0, e._)`!${S}.test(${a})`);
    }
  };
  return Dr.default = s, Dr;
}
var Zr = {}, hi;
function kl() {
  if (hi) return Zr;
  hi = 1, Object.defineProperty(Zr, "__esModule", { value: !0 });
  const r = me(), t = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: s, schemaCode: n }) {
        const a = s === "maxProperties" ? "more" : "fewer";
        return (0, r.str)`must NOT have ${a} than ${n} properties`;
      },
      params: ({ schemaCode: s }) => (0, r._)`{limit: ${s}}`
    },
    code(s) {
      const { keyword: n, data: a, schemaCode: i } = s, o = n === "maxProperties" ? r.operators.GT : r.operators.LT;
      s.fail$data((0, r._)`Object.keys(${a}).length ${o} ${i}`);
    }
  };
  return Zr.default = t, Zr;
}
var zr = {}, mi;
function Sl() {
  if (mi) return zr;
  mi = 1, Object.defineProperty(zr, "__esModule", { value: !0 });
  const r = mt(), e = me(), t = we(), n = {
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
  return zr.default = n, zr;
}
var Lr = {}, pi;
function Pl() {
  if (pi) return Lr;
  pi = 1, Object.defineProperty(Lr, "__esModule", { value: !0 });
  const r = me(), t = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: s, schemaCode: n }) {
        const a = s === "maxItems" ? "more" : "fewer";
        return (0, r.str)`must NOT have ${a} than ${n} items`;
      },
      params: ({ schemaCode: s }) => (0, r._)`{limit: ${s}}`
    },
    code(s) {
      const { keyword: n, data: a, schemaCode: i } = s, o = n === "maxItems" ? r.operators.GT : r.operators.LT;
      s.fail$data((0, r._)`${a}.length ${o} ${i}`);
    }
  };
  return Lr.default = t, Lr;
}
var Vr = {}, Fr = {}, gi;
function aa() {
  if (gi) return Fr;
  gi = 1, Object.defineProperty(Fr, "__esModule", { value: !0 });
  const r = Vo();
  return r.code = 'require("ajv/dist/runtime/equal").default', Fr.default = r, Fr;
}
var yi;
function Rl() {
  if (yi) return Vr;
  yi = 1, Object.defineProperty(Vr, "__esModule", { value: !0 });
  const r = Cs(), e = me(), t = we(), s = aa(), a = {
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
        const y = (0, t.useFunc)(o, s.default), k = o.name("outer");
        o.label(k).for((0, e._)`;${_}--;`, () => o.for((0, e._)`${f} = ${_}; ${f}--;`, () => o.if((0, e._)`${y}(${c}[${_}], ${c}[${f}])`, () => {
          i.error(), o.assign(b, !1).break(k);
        })));
      }
    }
  };
  return Vr.default = a, Vr;
}
var Ur = {}, _i;
function Tl() {
  if (_i) return Ur;
  _i = 1, Object.defineProperty(Ur, "__esModule", { value: !0 });
  const r = me(), e = we(), t = aa(), n = {
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
  return Ur.default = n, Ur;
}
var Hr = {}, vi;
function El() {
  if (vi) return Hr;
  vi = 1, Object.defineProperty(Hr, "__esModule", { value: !0 });
  const r = me(), e = we(), t = aa(), n = {
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
  return Hr.default = n, Hr;
}
var bi;
function xl() {
  if (bi) return Ir;
  bi = 1, Object.defineProperty(Ir, "__esModule", { value: !0 });
  const r = _l(), e = vl(), t = wl(), s = $l(), n = kl(), a = Sl(), i = Pl(), o = Rl(), c = Tl(), u = El(), l = [
    // number
    r.default,
    e.default,
    // string
    t.default,
    s.default,
    // object
    n.default,
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
var Kr = {}, Xt = {}, wi;
function Uo() {
  if (wi) return Xt;
  wi = 1, Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.validateAdditionalItems = void 0;
  const r = me(), e = we(), s = {
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
      n(a, c);
    }
  };
  function n(a, i) {
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
  return Xt.validateAdditionalItems = n, Xt.default = s, Xt;
}
var Br = {}, er = {}, $i;
function Ho() {
  if ($i) return er;
  $i = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.validateTuple = void 0;
  const r = me(), e = we(), t = mt(), s = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(a) {
      const { schema: i, it: o } = a;
      if (Array.isArray(i))
        return n(a, "additionalItems", i);
      o.items = !0, !(0, e.alwaysValidSchema)(o, i) && a.ok((0, t.validateArray)(a));
    }
  };
  function n(a, i, o = a.schema) {
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
  return er.validateTuple = n, er.default = s, er;
}
var ki;
function Nl() {
  if (ki) return Br;
  ki = 1, Object.defineProperty(Br, "__esModule", { value: !0 });
  const r = Ho(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (t) => (0, r.validateTuple)(t, "items")
  };
  return Br.default = e, Br;
}
var Gr = {}, Si;
function Ol() {
  if (Si) return Gr;
  Si = 1, Object.defineProperty(Gr, "__esModule", { value: !0 });
  const r = me(), e = we(), t = mt(), s = Uo(), a = {
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
      u.items = !0, !(0, e.alwaysValidSchema)(u, o) && (l ? (0, s.validateAdditionalItems)(i, l) : i.ok((0, t.validateArray)(i)));
    }
  };
  return Gr.default = a, Gr;
}
var Jr = {}, Pi;
function Cl() {
  if (Pi) return Jr;
  Pi = 1, Object.defineProperty(Jr, "__esModule", { value: !0 });
  const r = me(), e = we(), s = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: n, max: a } }) => a === void 0 ? (0, r.str)`must contain at least ${n} valid item(s)` : (0, r.str)`must contain at least ${n} and no more than ${a} valid item(s)`,
      params: ({ params: { min: n, max: a } }) => a === void 0 ? (0, r._)`{minContains: ${n}}` : (0, r._)`{minContains: ${n}, maxContains: ${a}}`
    },
    code(n) {
      const { gen: a, schema: i, parentSchema: o, data: c, it: u } = n;
      let l, S;
      const { minContains: w, maxContains: v } = o;
      u.opts.next ? (l = w === void 0 ? 1 : w, S = v) : l = 1;
      const b = a.const("len", (0, r._)`${c}.length`);
      if (n.setParams({ min: l, max: S }), S === void 0 && l === 0) {
        (0, e.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (S !== void 0 && l > S) {
        (0, e.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), n.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(u, i)) {
        let h = (0, r._)`${b} >= ${l}`;
        S !== void 0 && (h = (0, r._)`${h} && ${b} <= ${S}`), n.pass(h);
        return;
      }
      u.items = !0;
      const $ = a.name("valid");
      S === void 0 && l === 1 ? p($, () => a.if($, () => a.break())) : l === 0 ? (a.let($, !0), S !== void 0 && a.if((0, r._)`${c}.length > 0`, m)) : (a.let($, !1), m()), n.result($, () => n.reset());
      function m() {
        const h = a.name("_valid"), _ = a.let("count", 0);
        p(h, () => a.if(h, () => d(_)));
      }
      function p(h, _) {
        a.forRange("i", 0, b, (f) => {
          n.subschema({
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
  return Jr.default = s, Jr;
}
var on = {}, Ri;
function Il() {
  return Ri || (Ri = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.validateSchemaDeps = r.validatePropertyDeps = r.error = void 0;
    const e = me(), t = we(), s = mt();
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
    const n = {
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
        const m = (0, s.propertyInData)(l, S, b, w.opts.ownProperties);
        c.setParams({
          property: b,
          depsCount: $.length,
          deps: $.join(", ")
        }), w.allErrors ? l.if(m, () => {
          for (const p of $)
            (0, s.checkReportMissingProp)(c, p);
        }) : (l.if((0, e._)`${m} && (${(0, s.checkMissingProp)(c, $, v)})`), (0, s.reportMissingProp)(c, v), l.else());
      }
    }
    r.validatePropertyDeps = i;
    function o(c, u = c.schema) {
      const { gen: l, data: S, keyword: w, it: v } = c, b = l.name("valid");
      for (const $ in u)
        (0, t.alwaysValidSchema)(v, u[$]) || (l.if(
          (0, s.propertyInData)(l, S, $, v.opts.ownProperties),
          () => {
            const m = c.subschema({ keyword: w, schemaProp: $ }, b);
            c.mergeValidEvaluated(m, b);
          },
          () => l.var(b, !0)
          // TODO var
        ), c.ok(b));
    }
    r.validateSchemaDeps = o, r.default = n;
  })(on)), on;
}
var Wr = {}, Ti;
function Al() {
  if (Ti) return Wr;
  Ti = 1, Object.defineProperty(Wr, "__esModule", { value: !0 });
  const r = me(), e = we(), s = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: n }) => (0, r._)`{propertyName: ${n.propertyName}}`
    },
    code(n) {
      const { gen: a, schema: i, data: o, it: c } = n;
      if ((0, e.alwaysValidSchema)(c, i))
        return;
      const u = a.name("valid");
      a.forIn("key", o, (l) => {
        n.setParams({ propertyName: l }), n.subschema({
          keyword: "propertyNames",
          data: l,
          dataTypes: ["string"],
          propertyName: l,
          compositeRule: !0
        }, u), a.if((0, r.not)(u), () => {
          n.error(!0), c.allErrors || a.break();
        });
      }), n.ok(u);
    }
  };
  return Wr.default = s, Wr;
}
var Qr = {}, Ei;
function Ko() {
  if (Ei) return Qr;
  Ei = 1, Object.defineProperty(Qr, "__esModule", { value: !0 });
  const r = mt(), e = me(), t = zt(), s = we(), a = {
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
      if (w.props = !0, b.removeAdditional !== "all" && (0, s.alwaysValidSchema)(w, c))
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
          const N = (0, s.schemaRefOrVal)(w, u.properties, "properties");
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
        if (typeof c == "object" && !(0, s.alwaysValidSchema)(w, c)) {
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
          dataPropType: s.Type.Str
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
var Yr = {}, xi;
function jl() {
  if (xi) return Yr;
  xi = 1, Object.defineProperty(Yr, "__esModule", { value: !0 });
  const r = Us(), e = mt(), t = we(), s = Ko(), n = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(a) {
      const { gen: i, schema: o, parentSchema: c, data: u, it: l } = a;
      l.opts.removeAdditional === "all" && c.additionalProperties === void 0 && s.default.code(new r.KeywordCxt(l, s.default, "additionalProperties"));
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
  return Yr.default = n, Yr;
}
var Xr = {}, Ni;
function Ml() {
  if (Ni) return Xr;
  Ni = 1, Object.defineProperty(Xr, "__esModule", { value: !0 });
  const r = mt(), e = me(), t = we(), s = we(), n = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(a) {
      const { gen: i, schema: o, data: c, parentSchema: u, it: l } = a, { opts: S } = l, w = (0, r.allSchemaProperties)(o), v = w.filter((_) => (0, t.alwaysValidSchema)(l, o[_]));
      if (w.length === 0 || v.length === w.length && (!l.opts.unevaluated || l.props === !0))
        return;
      const b = S.strictSchema && !S.allowMatchingProperties && u.properties, $ = i.name("valid");
      l.props !== !0 && !(l.props instanceof e.Name) && (l.props = (0, s.evaluatedPropsToName)(i, l.props));
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
              dataPropType: s.Type.Str
            }, $), l.opts.unevaluated && m !== !0 ? i.assign((0, e._)`${m}[${f}]`, !0) : !y && !l.allErrors && i.if((0, e.not)($), () => i.break());
          });
        });
      }
    }
  };
  return Xr.default = n, Xr;
}
var es = {}, Oi;
function ql() {
  if (Oi) return es;
  Oi = 1, Object.defineProperty(es, "__esModule", { value: !0 });
  const r = we(), e = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(t) {
      const { gen: s, schema: n, it: a } = t;
      if ((0, r.alwaysValidSchema)(a, n)) {
        t.fail();
        return;
      }
      const i = s.name("valid");
      t.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i), t.failResult(i, () => t.reset(), () => t.error());
    },
    error: { message: "must NOT be valid" }
  };
  return es.default = e, es;
}
var ts = {}, Ci;
function Dl() {
  if (Ci) return ts;
  Ci = 1, Object.defineProperty(ts, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: mt().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return ts.default = e, ts;
}
var rs = {}, Ii;
function Zl() {
  if (Ii) return rs;
  Ii = 1, Object.defineProperty(rs, "__esModule", { value: !0 });
  const r = me(), e = we(), s = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: n }) => (0, r._)`{passingSchemas: ${n.passing}}`
    },
    code(n) {
      const { gen: a, schema: i, parentSchema: o, it: c } = n;
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && o.discriminator)
        return;
      const u = i, l = a.let("valid", !1), S = a.let("passing", null), w = a.name("_valid");
      n.setParams({ passing: S }), a.block(v), n.result(l, () => n.reset(), () => n.error(!0));
      function v() {
        u.forEach((b, $) => {
          let m;
          (0, e.alwaysValidSchema)(c, b) ? a.var(w, !0) : m = n.subschema({
            keyword: "oneOf",
            schemaProp: $,
            compositeRule: !0
          }, w), $ > 0 && a.if((0, r._)`${w} && ${l}`).assign(l, !1).assign(S, (0, r._)`[${S}, ${$}]`).else(), a.if(w, () => {
            a.assign(l, !0), a.assign(S, $), m && n.mergeEvaluated(m, r.Name);
          });
        });
      }
    }
  };
  return rs.default = s, rs;
}
var ss = {}, Ai;
function zl() {
  if (Ai) return ss;
  Ai = 1, Object.defineProperty(ss, "__esModule", { value: !0 });
  const r = we(), e = {
    keyword: "allOf",
    schemaType: "array",
    code(t) {
      const { gen: s, schema: n, it: a } = t;
      if (!Array.isArray(n))
        throw new Error("ajv implementation error");
      const i = s.name("valid");
      n.forEach((o, c) => {
        if ((0, r.alwaysValidSchema)(a, o))
          return;
        const u = t.subschema({ keyword: "allOf", schemaProp: c }, i);
        t.ok(i), t.mergeEvaluated(u);
      });
    }
  };
  return ss.default = e, ss;
}
var ns = {}, ji;
function Ll() {
  if (ji) return ns;
  ji = 1, Object.defineProperty(ns, "__esModule", { value: !0 });
  const r = me(), e = we(), s = {
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
      const u = n(c, "then"), l = n(c, "else");
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
  function n(a, i) {
    const o = a.schema[i];
    return o !== void 0 && !(0, e.alwaysValidSchema)(a, o);
  }
  return ns.default = s, ns;
}
var as = {}, Mi;
function Vl() {
  if (Mi) return as;
  Mi = 1, Object.defineProperty(as, "__esModule", { value: !0 });
  const r = we(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: s, it: n }) {
      s.if === void 0 && (0, r.checkStrictMode)(n, `"${t}" without "if" is ignored`);
    }
  };
  return as.default = e, as;
}
var qi;
function Fl() {
  if (qi) return Kr;
  qi = 1, Object.defineProperty(Kr, "__esModule", { value: !0 });
  const r = Uo(), e = Nl(), t = Ho(), s = Ol(), n = Cl(), a = Il(), i = Al(), o = Ko(), c = jl(), u = Ml(), l = ql(), S = Dl(), w = Zl(), v = zl(), b = Ll(), $ = Vl();
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
    return p ? d.push(e.default, s.default) : d.push(r.default, t.default), d.push(n.default), d;
  }
  return Kr.default = m, Kr;
}
var is = {}, os = {}, Di;
function Ul() {
  if (Di) return os;
  Di = 1, Object.defineProperty(os, "__esModule", { value: !0 });
  const r = me(), t = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: s }) => (0, r.str)`must match format "${s}"`,
      params: ({ schemaCode: s }) => (0, r._)`{format: ${s}}`
    },
    code(s, n) {
      const { gen: a, data: i, $data: o, schema: c, schemaCode: u, it: l } = s, { opts: S, errSchemaPath: w, schemaEnv: v, self: b } = l;
      if (!S.validateFormats)
        return;
      o ? $() : m();
      function $() {
        const p = a.scopeValue("formats", {
          ref: b.formats,
          code: S.code.formats
        }), d = a.const("fDef", (0, r._)`${p}[${u}]`), h = a.let("fType"), _ = a.let("format");
        a.if((0, r._)`typeof ${d} == "object" && !(${d} instanceof RegExp)`, () => a.assign(h, (0, r._)`${d}.type || "string"`).assign(_, (0, r._)`${d}.validate`), () => a.assign(h, (0, r._)`"string"`).assign(_, d)), s.fail$data((0, r.or)(f(), y()));
        function f() {
          return S.strictSchema === !1 ? r.nil : (0, r._)`${u} && !${_}`;
        }
        function y() {
          const k = v.$async ? (0, r._)`(${d}.async ? await ${_}(${i}) : ${_}(${i}))` : (0, r._)`${_}(${i})`, N = (0, r._)`(typeof ${_} == "function" ? ${k} : ${_}.test(${i}))`;
          return (0, r._)`${_} && ${_} !== true && ${h} === ${n} && !${N}`;
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
        d === n && s.pass(k());
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
          const z = N instanceof RegExp ? (0, r.regexpCode)(N) : S.code.formats ? (0, r._)`${S.code.formats}${(0, r.getProperty)(c)}` : void 0, G = a.scopeValue("formats", { key: c, ref: N, code: z });
          return typeof N == "object" && !(N instanceof RegExp) ? [N.type || "string", N.validate, (0, r._)`${G}.validate`] : ["string", N, G];
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
  return os.default = t, os;
}
var Zi;
function Hl() {
  if (Zi) return is;
  Zi = 1, Object.defineProperty(is, "__esModule", { value: !0 });
  const e = [Ul().default];
  return is.default = e, is;
}
var Ft = {}, zi;
function Kl() {
  return zi || (zi = 1, Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.contentVocabulary = Ft.metadataVocabulary = void 0, Ft.metadataVocabulary = [
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
var Li;
function Bl() {
  if (Li) return Nr;
  Li = 1, Object.defineProperty(Nr, "__esModule", { value: !0 });
  const r = yl(), e = xl(), t = Fl(), s = Hl(), n = Kl(), a = [
    r.default,
    e.default,
    (0, t.default)(),
    s.default,
    n.metadataVocabulary,
    n.contentVocabulary
  ];
  return Nr.default = a, Nr;
}
var cs = {}, lr = {}, Vi;
function Gl() {
  if (Vi) return lr;
  Vi = 1, Object.defineProperty(lr, "__esModule", { value: !0 }), lr.DiscrError = void 0;
  var r;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(r || (lr.DiscrError = r = {})), lr;
}
var Fi;
function Jl() {
  if (Fi) return cs;
  Fi = 1, Object.defineProperty(cs, "__esModule", { value: !0 });
  const r = me(), e = Gl(), t = na(), s = Hs(), n = we(), i = {
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
          let F = v[C];
          if (F != null && F.$ref && !(0, n.schemaHasRulesButRef)(F, w.self.RULES)) {
            const ee = F.$ref;
            if (F = t.resolveRef.call(w.self, w.schemaEnv.root, w.baseId, ee), F instanceof t.SchemaEnv && (F = F.schema), F === void 0)
              throw new s.default(w.opts.uriResolver, w.baseId, ee);
          }
          const W = (_ = F == null ? void 0 : F.properties) === null || _ === void 0 ? void 0 : _[b];
          if (typeof W != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${b}"`);
          k = k && (y || N(F)), z(W, C);
        }
        if (!k)
          throw new Error(`discriminator: "${b}" must be required`);
        return f;
        function N({ required: C }) {
          return Array.isArray(C) && C.includes(b);
        }
        function z(C, F) {
          if (C.const)
            G(C.const, F);
          else if (C.enum)
            for (const W of C.enum)
              G(W, F);
          else
            throw new Error(`discriminator: "properties/${b}" must have "const" or "enum"`);
        }
        function G(C, F) {
          if (typeof C != "string" || C in f)
            throw new Error(`discriminator: "${b}" values must be unique strings`);
          f[C] = F;
        }
      }
    }
  };
  return cs.default = i, cs;
}
const Wl = "http://json-schema.org/draft-07/schema#", Ql = "http://json-schema.org/draft-07/schema#", Yl = "Core schema meta-schema", Xl = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, ef = ["object", "boolean"], tf = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, rf = {
  $schema: Wl,
  $id: Ql,
  title: Yl,
  definitions: Xl,
  type: ef,
  properties: tf,
  default: !0
};
var Ui;
function Bo() {
  return Ui || (Ui = 1, (function(r, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const t = ml(), s = Bl(), n = Jl(), a = rf, i = ["/properties"], o = "http://json-schema.org/draft-07/schema";
    class c extends t.default {
      _addVocabularies() {
        super._addVocabularies(), s.default.forEach((b) => this.addVocabulary(b)), this.opts.discriminator && this.addKeyword(n.default);
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
    var u = Us();
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
    var w = Hs();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return w.default;
    } });
  })(Pr, Pr.exports)), Pr.exports;
}
var sf = Bo(), us = { exports: {} }, cn = {}, Hi;
function nf() {
  return Hi || (Hi = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.formatNames = r.fastFormats = r.fullFormats = void 0;
    function e(C, F) {
      return { validate: C, compare: F };
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
      regex: G,
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
    const s = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, n = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function a(C) {
      const F = s.exec(C);
      if (!F)
        return !1;
      const W = +F[1], ee = +F[2], Se = +F[3];
      return ee >= 1 && ee <= 12 && Se >= 1 && Se <= (ee === 2 && t(W) ? 29 : n[ee]);
    }
    function i(C, F) {
      if (C && F)
        return C > F ? 1 : C < F ? -1 : 0;
    }
    const o = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function c(C) {
      return function(W) {
        const ee = o.exec(W);
        if (!ee)
          return !1;
        const Se = +ee[1], Ze = +ee[2], ze = +ee[3], Te = ee[4], ut = ee[5] === "-" ? -1 : 1, L = +(ee[6] || 0), T = +(ee[7] || 0);
        if (L > 23 || T > 59 || C && !Te)
          return !1;
        if (Se <= 23 && Ze <= 59 && ze < 60)
          return !0;
        const A = Ze - T * ut, x = Se - L * ut - (A < 0 ? 1 : 0);
        return (x === 23 || x === -1) && (A === 59 || A === -1) && ze < 61;
      };
    }
    function u(C, F) {
      if (!(C && F))
        return;
      const W = (/* @__PURE__ */ new Date("2020-01-01T" + C)).valueOf(), ee = (/* @__PURE__ */ new Date("2020-01-01T" + F)).valueOf();
      if (W && ee)
        return W - ee;
    }
    function l(C, F) {
      if (!(C && F))
        return;
      const W = o.exec(C), ee = o.exec(F);
      if (W && ee)
        return C = W[1] + W[2] + W[3], F = ee[1] + ee[2] + ee[3], C > F ? 1 : C < F ? -1 : 0;
    }
    const S = /t|\s/i;
    function w(C) {
      const F = c(C);
      return function(ee) {
        const Se = ee.split(S);
        return Se.length === 2 && a(Se[0]) && F(Se[1]);
      };
    }
    function v(C, F) {
      if (!(C && F))
        return;
      const W = new Date(C).valueOf(), ee = new Date(F).valueOf();
      if (W && ee)
        return W - ee;
    }
    function b(C, F) {
      if (!(C && F))
        return;
      const [W, ee] = C.split(S), [Se, Ze] = F.split(S), ze = i(W, Se);
      if (ze !== void 0)
        return ze || u(ee, Ze);
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
    function G(C) {
      if (z.test(C))
        return !1;
      try {
        return new RegExp(C), !0;
      } catch {
        return !1;
      }
    }
  })(cn)), cn;
}
var un = {}, Ki;
function af() {
  return Ki || (Ki = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.formatLimitDefinition = void 0;
    const e = Bo(), t = me(), s = t.operators, n = {
      formatMaximum: { okStr: "<=", ok: s.LTE, fail: s.GT },
      formatMinimum: { okStr: ">=", ok: s.GTE, fail: s.LT },
      formatExclusiveMaximum: { okStr: "<", ok: s.LT, fail: s.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: s.GT, fail: s.LTE }
    }, a = {
      message: ({ keyword: o, schemaCode: c }) => (0, t.str)`should be ${n[o].okStr} ${c}`,
      params: ({ keyword: o, schemaCode: c }) => (0, t._)`{comparison: ${n[o].okStr}, limit: ${c}}`
    };
    r.formatLimitDefinition = {
      keyword: Object.keys(n),
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
          return (0, t._)`${h}.compare(${u}, ${l}) ${n[S].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const i = (o) => (o.addKeyword(r.formatLimitDefinition), o);
    r.default = i;
  })(un)), un;
}
var Bi;
function of() {
  return Bi || (Bi = 1, (function(r, e) {
    Object.defineProperty(e, "__esModule", { value: !0 });
    const t = nf(), s = af(), n = me(), a = new n.Name("fullFormats"), i = new n.Name("fastFormats"), o = (u, l = { keywords: !0 }) => {
      if (Array.isArray(l))
        return c(u, l, t.fullFormats, a), u;
      const [S, w] = l.mode === "fast" ? [t.fastFormats, i] : [t.fullFormats, a], v = l.formats || t.formatNames;
      return c(u, v, S, w), l.keywords && (0, s.default)(u), u;
    };
    o.get = (u, l = "full") => {
      const w = (l === "fast" ? t.fastFormats : t.fullFormats)[u];
      if (!w)
        throw new Error(`Unknown format "${u}"`);
      return w;
    };
    function c(u, l, S, w) {
      var v, b;
      (v = (b = u.opts.code).formats) !== null && v !== void 0 || (b.formats = (0, n._)`require("ajv-formats/dist/formats").${w}`);
      for (const $ of l)
        u.addFormat($, S[$]);
    }
    r.exports = e = o, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = o;
  })(us, us.exports)), us.exports;
}
var cf = of();
const uf = /* @__PURE__ */ Yd(cf);
function df() {
  const r = new sf.Ajv({
    strict: !1,
    validateFormats: !0,
    validateSchema: !1,
    allErrors: !0
  });
  return uf(r), r;
}
class lf {
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
    this._ajv = e ?? df();
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
    const s = "$id" in e && typeof e.$id == "string" ? (t = this._ajv.getSchema(e.$id)) !== null && t !== void 0 ? t : this._ajv.compile(e) : this._ajv.compile(e);
    return (n) => s(n) ? {
      valid: !0,
      data: n,
      errorMessage: void 0
    } : {
      valid: !1,
      data: void 0,
      errorMessage: this._ajv.errorsText(s.errors)
    };
  }
}
class ff extends Wd {
  /**
   * Initializes this server with the given name and version information.
   */
  constructor(e, t) {
    var s, n;
    super(t), this._serverInfo = e, this._loggingLevels = /* @__PURE__ */ new Map(), this.LOG_LEVEL_SEVERITY = new Map(Ns.options.map((a, i) => [a, i])), this.isMessageIgnored = (a, i) => {
      const o = this._loggingLevels.get(i);
      return o ? this.LOG_LEVEL_SEVERITY.get(a) < this.LOG_LEVEL_SEVERITY.get(o) : !1;
    }, this._capabilities = (s = t == null ? void 0 : t.capabilities) !== null && s !== void 0 ? s : {}, this._instructions = t == null ? void 0 : t.instructions, this._jsonSchemaValidator = (n = t == null ? void 0 : t.jsonSchemaValidator) !== null && n !== void 0 ? n : new lf(), this.setRequestHandler(Eo, (a) => this._oninitialize(a)), this.setNotificationHandler(xo, () => {
      var a;
      return (a = this.oninitialized) === null || a === void 0 ? void 0 : a.call(this);
    }), this._capabilities.logging && this.setRequestHandler(Mo, async (a, i) => {
      var o;
      const c = i.sessionId || ((o = i.requestInfo) === null || o === void 0 ? void 0 : o.headers["mcp-session-id"]) || void 0, { level: u } = a.params, l = Ns.safeParse(u);
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
    this._capabilities = Qd(this._capabilities, e);
  }
  assertCapabilityForMethod(e) {
    var t, s, n;
    switch (e) {
      case "sampling/createMessage":
        if (!(!((t = this._clientCapabilities) === null || t === void 0) && t.sampling))
          throw new Error(`Client does not support sampling (required for ${e})`);
        break;
      case "elicitation/create":
        if (!(!((s = this._clientCapabilities) === null || s === void 0) && s.elicitation))
          throw new Error(`Client does not support elicitation (required for ${e})`);
        break;
      case "roots/list":
        if (!(!((n = this._clientCapabilities) === null || n === void 0) && n.roots))
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
      protocolVersion: rd.includes(t) ? t : bo,
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
    return this.request({ method: "ping" }, Jn);
  }
  async createMessage(e, t) {
    return this.request({ method: "sampling/createMessage", params: e }, qo, t);
  }
  async elicitInput(e, t) {
    const s = await this.request({ method: "elicitation/create", params: e }, Do, t);
    if (s.action === "accept" && s.content && e.requestedSchema)
      try {
        const a = this._jsonSchemaValidator.getValidator(e.requestedSchema)(s.content);
        if (!a.valid)
          throw new xe(Ee.InvalidParams, `Elicitation response content does not match requested schema: ${a.errorMessage}`);
      } catch (n) {
        throw n instanceof xe ? n : new xe(Ee.InternalError, `Error validating elicitation response: ${n instanceof Error ? n.message : String(n)}`);
      }
    return s;
  }
  async listRoots(e, t) {
    return this.request({ method: "roots/list", params: e }, Zo, t);
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
const hf = Symbol("Let zodToJsonSchema decide on which parser to use"), Gi = {
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
}, mf = (r) => typeof r == "string" ? {
  ...Gi,
  name: r
} : {
  ...Gi,
  ...r
}, pf = (r) => {
  const e = mf(r), t = e.name !== void 0 ? [...e.basePath, e.definitionPath, e.name] : e.basePath;
  return {
    ...e,
    flags: { hasReferencedOpenAiAnyType: !1 },
    currentPath: t,
    propertyPath: void 0,
    seen: new Map(Object.entries(e.definitions).map(([s, n]) => [
      n._def,
      {
        def: n._def,
        path: [...e.basePath, e.definitionPath, s],
        // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
        jsonSchema: void 0
      }
    ]))
  };
};
function Go(r, e, t, s) {
  s != null && s.errorMessages && t && (r.errorMessage = {
    ...r.errorMessage,
    [e]: t
  });
}
function Re(r, e, t, s, n) {
  r[e] = t, Go(r, e, s, n);
}
const Jo = (r, e) => {
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
    $ref: r.$refStrategy === "relative" ? Jo(e, r.currentPath) : e.join("/")
  };
}
function gf(r, e) {
  var s, n, a;
  const t = {
    type: "array"
  };
  return (s = r.type) != null && s._def && ((a = (n = r.type) == null ? void 0 : n._def) == null ? void 0 : a.typeName) !== Z.ZodAny && (t.items = ke(r.type._def, {
    ...e,
    currentPath: [...e.currentPath, "items"]
  })), r.minLength && Re(t, "minItems", r.minLength.value, r.minLength.message, e), r.maxLength && Re(t, "maxItems", r.maxLength.value, r.maxLength.message, e), r.exactLength && (Re(t, "minItems", r.exactLength.value, r.exactLength.message, e), Re(t, "maxItems", r.exactLength.value, r.exactLength.message, e)), t;
}
function yf(r, e) {
  const t = {
    type: "integer",
    format: "int64"
  };
  if (!r.checks)
    return t;
  for (const s of r.checks)
    switch (s.kind) {
      case "min":
        e.target === "jsonSchema7" ? s.inclusive ? Re(t, "minimum", s.value, s.message, e) : Re(t, "exclusiveMinimum", s.value, s.message, e) : (s.inclusive || (t.exclusiveMinimum = !0), Re(t, "minimum", s.value, s.message, e));
        break;
      case "max":
        e.target === "jsonSchema7" ? s.inclusive ? Re(t, "maximum", s.value, s.message, e) : Re(t, "exclusiveMaximum", s.value, s.message, e) : (s.inclusive || (t.exclusiveMaximum = !0), Re(t, "maximum", s.value, s.message, e));
        break;
      case "multipleOf":
        Re(t, "multipleOf", s.value, s.message, e);
        break;
    }
  return t;
}
function _f() {
  return {
    type: "boolean"
  };
}
function Wo(r, e) {
  return ke(r.type._def, e);
}
const vf = (r, e) => ke(r.innerType._def, e);
function Qo(r, e, t) {
  const s = t ?? e.dateStrategy;
  if (Array.isArray(s))
    return {
      anyOf: s.map((n, a) => Qo(r, e, n))
    };
  switch (s) {
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
      return bf(r, e);
  }
}
const bf = (r, e) => {
  const t = {
    type: "integer",
    format: "unix-time"
  };
  if (e.target === "openApi3")
    return t;
  for (const s of r.checks)
    switch (s.kind) {
      case "min":
        Re(
          t,
          "minimum",
          s.value,
          // This is in milliseconds
          s.message,
          e
        );
        break;
      case "max":
        Re(
          t,
          "maximum",
          s.value,
          // This is in milliseconds
          s.message,
          e
        );
        break;
    }
  return t;
};
function wf(r, e) {
  return {
    ...ke(r.innerType._def, e),
    default: r.defaultValue()
  };
}
function $f(r, e) {
  return e.effectStrategy === "input" ? ke(r.schema._def, e) : Qe(e);
}
function kf(r) {
  return {
    type: "string",
    enum: Array.from(r.values)
  };
}
const Sf = (r) => "type" in r && r.type === "string" ? !1 : "allOf" in r;
function Pf(r, e) {
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
  let s = e.target === "jsonSchema2019-09" ? { unevaluatedProperties: !1 } : void 0;
  const n = [];
  return t.forEach((a) => {
    if (Sf(a))
      n.push(...a.allOf), a.unevaluatedProperties === void 0 && (s = void 0);
    else {
      let i = a;
      if ("additionalProperties" in a && a.additionalProperties === !1) {
        const { additionalProperties: o, ...c } = a;
        i = c;
      } else
        s = void 0;
      n.push(i);
    }
  }), n.length ? {
    allOf: n,
    ...s
  } : void 0;
}
function Rf(r, e) {
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
let dn;
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
  emoji: () => (dn === void 0 && (dn = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), dn),
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
function Yo(r, e) {
  const t = {
    type: "string"
  };
  if (r.checks)
    for (const s of r.checks)
      switch (s.kind) {
        case "min":
          Re(t, "minLength", typeof t.minLength == "number" ? Math.max(t.minLength, s.value) : s.value, s.message, e);
          break;
        case "max":
          Re(t, "maxLength", typeof t.maxLength == "number" ? Math.min(t.maxLength, s.value) : s.value, s.message, e);
          break;
        case "email":
          switch (e.emailStrategy) {
            case "format:email":
              ht(t, "email", s.message, e);
              break;
            case "format:idn-email":
              ht(t, "idn-email", s.message, e);
              break;
            case "pattern:zod":
              Ve(t, ft.email, s.message, e);
              break;
          }
          break;
        case "url":
          ht(t, "uri", s.message, e);
          break;
        case "uuid":
          ht(t, "uuid", s.message, e);
          break;
        case "regex":
          Ve(t, s.regex, s.message, e);
          break;
        case "cuid":
          Ve(t, ft.cuid, s.message, e);
          break;
        case "cuid2":
          Ve(t, ft.cuid2, s.message, e);
          break;
        case "startsWith":
          Ve(t, RegExp(`^${ln(s.value, e)}`), s.message, e);
          break;
        case "endsWith":
          Ve(t, RegExp(`${ln(s.value, e)}$`), s.message, e);
          break;
        case "datetime":
          ht(t, "date-time", s.message, e);
          break;
        case "date":
          ht(t, "date", s.message, e);
          break;
        case "time":
          ht(t, "time", s.message, e);
          break;
        case "duration":
          ht(t, "duration", s.message, e);
          break;
        case "length":
          Re(t, "minLength", typeof t.minLength == "number" ? Math.max(t.minLength, s.value) : s.value, s.message, e), Re(t, "maxLength", typeof t.maxLength == "number" ? Math.min(t.maxLength, s.value) : s.value, s.message, e);
          break;
        case "includes": {
          Ve(t, RegExp(ln(s.value, e)), s.message, e);
          break;
        }
        case "ip": {
          s.version !== "v6" && ht(t, "ipv4", s.message, e), s.version !== "v4" && ht(t, "ipv6", s.message, e);
          break;
        }
        case "base64url":
          Ve(t, ft.base64url, s.message, e);
          break;
        case "jwt":
          Ve(t, ft.jwt, s.message, e);
          break;
        case "cidr": {
          s.version !== "v6" && Ve(t, ft.ipv4Cidr, s.message, e), s.version !== "v4" && Ve(t, ft.ipv6Cidr, s.message, e);
          break;
        }
        case "emoji":
          Ve(t, ft.emoji(), s.message, e);
          break;
        case "ulid": {
          Ve(t, ft.ulid, s.message, e);
          break;
        }
        case "base64": {
          switch (e.base64Strategy) {
            case "format:binary": {
              ht(t, "binary", s.message, e);
              break;
            }
            case "contentEncoding:base64": {
              Re(t, "contentEncoding", "base64", s.message, e);
              break;
            }
            case "pattern:zod": {
              Ve(t, ft.base64, s.message, e);
              break;
            }
          }
          break;
        }
        case "nanoid":
          Ve(t, ft.nanoid, s.message, e);
      }
  return t;
}
function ln(r, e) {
  return e.patternStrategy === "escape" ? Ef(r) : r;
}
const Tf = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function Ef(r) {
  let e = "";
  for (let t = 0; t < r.length; t++)
    Tf.has(r[t]) || (e += "\\"), e += r[t];
  return e;
}
function ht(r, e, t, s) {
  var n;
  r.format || (n = r.anyOf) != null && n.some((a) => a.format) ? (r.anyOf || (r.anyOf = []), r.format && (r.anyOf.push({
    format: r.format,
    ...r.errorMessage && s.errorMessages && {
      errorMessage: { format: r.errorMessage.format }
    }
  }), delete r.format, r.errorMessage && (delete r.errorMessage.format, Object.keys(r.errorMessage).length === 0 && delete r.errorMessage)), r.anyOf.push({
    format: e,
    ...t && s.errorMessages && { errorMessage: { format: t } }
  })) : Re(r, "format", e, t, s);
}
function Ve(r, e, t, s) {
  var n;
  r.pattern || (n = r.allOf) != null && n.some((a) => a.pattern) ? (r.allOf || (r.allOf = []), r.pattern && (r.allOf.push({
    pattern: r.pattern,
    ...r.errorMessage && s.errorMessages && {
      errorMessage: { pattern: r.errorMessage.pattern }
    }
  }), delete r.pattern, r.errorMessage && (delete r.errorMessage.pattern, Object.keys(r.errorMessage).length === 0 && delete r.errorMessage)), r.allOf.push({
    pattern: Ji(e, s),
    ...t && s.errorMessages && { errorMessage: { pattern: t } }
  })) : Re(r, "pattern", Ji(e, s), t, s);
}
function Ji(r, e) {
  var c;
  if (!e.applyRegexFlags || !r.flags)
    return r.source;
  const t = {
    i: r.flags.includes("i"),
    m: r.flags.includes("m"),
    s: r.flags.includes("s")
    // `.` matches newlines
  }, s = t.i ? r.source.toLowerCase() : r.source;
  let n = "", a = !1, i = !1, o = !1;
  for (let u = 0; u < s.length; u++) {
    if (a) {
      n += s[u], a = !1;
      continue;
    }
    if (t.i) {
      if (i) {
        if (s[u].match(/[a-z]/)) {
          o ? (n += s[u], n += `${s[u - 2]}-${s[u]}`.toUpperCase(), o = !1) : s[u + 1] === "-" && ((c = s[u + 2]) != null && c.match(/[a-z]/)) ? (n += s[u], o = !0) : n += `${s[u]}${s[u].toUpperCase()}`;
          continue;
        }
      } else if (s[u].match(/[a-z]/)) {
        n += `[${s[u]}${s[u].toUpperCase()}]`;
        continue;
      }
    }
    if (t.m) {
      if (s[u] === "^") {
        n += `(^|(?<=[\r
]))`;
        continue;
      } else if (s[u] === "$") {
        n += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (t.s && s[u] === ".") {
      n += i ? `${s[u]}\r
` : `[${s[u]}\r
]`;
      continue;
    }
    n += s[u], s[u] === "\\" ? a = !0 : i && s[u] === "]" ? i = !1 : !i && s[u] === "[" && (i = !0);
  }
  try {
    new RegExp(n);
  } catch {
    return console.warn(`Could not convert regex pattern at ${e.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), r.source;
  }
  return n;
}
function Xo(r, e) {
  var s, n, a, i, o, c;
  if (e.target === "openAi" && console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead."), e.target === "openApi3" && ((s = r.keyType) == null ? void 0 : s._def.typeName) === Z.ZodEnum)
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
  if (((n = r.keyType) == null ? void 0 : n._def.typeName) === Z.ZodString && ((a = r.keyType._def.checks) != null && a.length)) {
    const { type: u, ...l } = Yo(r.keyType._def, e);
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
      const { type: u, ...l } = Wo(r.keyType._def, e);
      return {
        ...t,
        propertyNames: l
      };
    }
  }
  return t;
}
function xf(r, e) {
  if (e.mapStrategy === "record")
    return Xo(r, e);
  const t = ke(r.keyType._def, {
    ...e,
    currentPath: [...e.currentPath, "items", "items", "0"]
  }) || Qe(e), s = ke(r.valueType._def, {
    ...e,
    currentPath: [...e.currentPath, "items", "items", "1"]
  }) || Qe(e);
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [t, s],
      minItems: 2,
      maxItems: 2
    }
  };
}
function Nf(r) {
  const e = r.values, s = Object.keys(r.values).filter((a) => typeof e[e[a]] != "number").map((a) => e[a]), n = Array.from(new Set(s.map((a) => typeof a)));
  return {
    type: n.length === 1 ? n[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: s
  };
}
function Of(r) {
  return r.target === "openAi" ? void 0 : {
    not: Qe({
      ...r,
      currentPath: [...r.currentPath, "not"]
    })
  };
}
function Cf(r) {
  return r.target === "openApi3" ? {
    enum: ["null"],
    nullable: !0
  } : {
    type: "null"
  };
}
const Is = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function If(r, e) {
  if (e.target === "openApi3")
    return Wi(r, e);
  const t = r.options instanceof Map ? Array.from(r.options.values()) : r.options;
  if (t.every((s) => s._def.typeName in Is && (!s._def.checks || !s._def.checks.length))) {
    const s = t.reduce((n, a) => {
      const i = Is[a._def.typeName];
      return i && !n.includes(i) ? [...n, i] : n;
    }, []);
    return {
      type: s.length > 1 ? s : s[0]
    };
  } else if (t.every((s) => s._def.typeName === "ZodLiteral" && !s.description)) {
    const s = t.reduce((n, a) => {
      const i = typeof a._def.value;
      switch (i) {
        case "string":
        case "number":
        case "boolean":
          return [...n, i];
        case "bigint":
          return [...n, "integer"];
        case "object":
          if (a._def.value === null)
            return [...n, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return n;
      }
    }, []);
    if (s.length === t.length) {
      const n = s.filter((a, i, o) => o.indexOf(a) === i);
      return {
        type: n.length > 1 ? n : n[0],
        enum: t.reduce((a, i) => a.includes(i._def.value) ? a : [...a, i._def.value], [])
      };
    }
  } else if (t.every((s) => s._def.typeName === "ZodEnum"))
    return {
      type: "string",
      enum: t.reduce((s, n) => [
        ...s,
        ...n._def.values.filter((a) => !s.includes(a))
      ], [])
    };
  return Wi(r, e);
}
const Wi = (r, e) => {
  const t = (r.options instanceof Map ? Array.from(r.options.values()) : r.options).map((s, n) => ke(s._def, {
    ...e,
    currentPath: [...e.currentPath, "anyOf", `${n}`]
  })).filter((s) => !!s && (!e.strictUnions || typeof s == "object" && Object.keys(s).length > 0));
  return t.length ? { anyOf: t } : void 0;
};
function Af(r, e) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(r.innerType._def.typeName) && (!r.innerType._def.checks || !r.innerType._def.checks.length))
    return e.target === "openApi3" ? {
      type: Is[r.innerType._def.typeName],
      nullable: !0
    } : {
      type: [
        Is[r.innerType._def.typeName],
        "null"
      ]
    };
  if (e.target === "openApi3") {
    const s = ke(r.innerType._def, {
      ...e,
      currentPath: [...e.currentPath]
    });
    return s && "$ref" in s ? { allOf: [s], nullable: !0 } : s && { ...s, nullable: !0 };
  }
  const t = ke(r.innerType._def, {
    ...e,
    currentPath: [...e.currentPath, "anyOf", "0"]
  });
  return t && { anyOf: [t, { type: "null" }] };
}
function jf(r, e) {
  const t = {
    type: "number"
  };
  if (!r.checks)
    return t;
  for (const s of r.checks)
    switch (s.kind) {
      case "int":
        t.type = "integer", Go(t, "type", s.message, e);
        break;
      case "min":
        e.target === "jsonSchema7" ? s.inclusive ? Re(t, "minimum", s.value, s.message, e) : Re(t, "exclusiveMinimum", s.value, s.message, e) : (s.inclusive || (t.exclusiveMinimum = !0), Re(t, "minimum", s.value, s.message, e));
        break;
      case "max":
        e.target === "jsonSchema7" ? s.inclusive ? Re(t, "maximum", s.value, s.message, e) : Re(t, "exclusiveMaximum", s.value, s.message, e) : (s.inclusive || (t.exclusiveMaximum = !0), Re(t, "maximum", s.value, s.message, e));
        break;
      case "multipleOf":
        Re(t, "multipleOf", s.value, s.message, e);
        break;
    }
  return t;
}
function Mf(r, e) {
  const t = e.target === "openAi", s = {
    type: "object",
    properties: {}
  }, n = [], a = r.shape();
  for (const o in a) {
    let c = a[o];
    if (c === void 0 || c._def === void 0)
      continue;
    let u = Df(c);
    u && t && (c._def.typeName === "ZodOptional" && (c = c._def.innerType), c.isNullable() || (c = c.nullable()), u = !1);
    const l = ke(c._def, {
      ...e,
      currentPath: [...e.currentPath, "properties", o],
      propertyPath: [...e.currentPath, "properties", o]
    });
    l !== void 0 && (s.properties[o] = l, u || n.push(o));
  }
  n.length && (s.required = n);
  const i = qf(r, e);
  return i !== void 0 && (s.additionalProperties = i), s;
}
function qf(r, e) {
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
function Df(r) {
  try {
    return r.isOptional();
  } catch {
    return !0;
  }
}
const Zf = (r, e) => {
  var s;
  if (e.currentPath.toString() === ((s = e.propertyPath) == null ? void 0 : s.toString()))
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
}, zf = (r, e) => {
  if (e.pipeStrategy === "input")
    return ke(r.in._def, e);
  if (e.pipeStrategy === "output")
    return ke(r.out._def, e);
  const t = ke(r.in._def, {
    ...e,
    currentPath: [...e.currentPath, "allOf", "0"]
  }), s = ke(r.out._def, {
    ...e,
    currentPath: [...e.currentPath, "allOf", t ? "1" : "0"]
  });
  return {
    allOf: [t, s].filter((n) => n !== void 0)
  };
};
function Lf(r, e) {
  return ke(r.type._def, e);
}
function Vf(r, e) {
  const s = {
    type: "array",
    uniqueItems: !0,
    items: ke(r.valueType._def, {
      ...e,
      currentPath: [...e.currentPath, "items"]
    })
  };
  return r.minSize && Re(s, "minItems", r.minSize.value, r.minSize.message, e), r.maxSize && Re(s, "maxItems", r.maxSize.value, r.maxSize.message, e), s;
}
function Ff(r, e) {
  return r.rest ? {
    type: "array",
    minItems: r.items.length,
    items: r.items.map((t, s) => ke(t._def, {
      ...e,
      currentPath: [...e.currentPath, "items", `${s}`]
    })).reduce((t, s) => s === void 0 ? t : [...t, s], []),
    additionalItems: ke(r.rest._def, {
      ...e,
      currentPath: [...e.currentPath, "additionalItems"]
    })
  } : {
    type: "array",
    minItems: r.items.length,
    maxItems: r.items.length,
    items: r.items.map((t, s) => ke(t._def, {
      ...e,
      currentPath: [...e.currentPath, "items", `${s}`]
    })).reduce((t, s) => s === void 0 ? t : [...t, s], [])
  };
}
function Uf(r) {
  return {
    not: Qe(r)
  };
}
function Hf(r) {
  return Qe(r);
}
const Kf = (r, e) => ke(r.innerType._def, e), Bf = (r, e, t) => {
  switch (e) {
    case Z.ZodString:
      return Yo(r, t);
    case Z.ZodNumber:
      return jf(r, t);
    case Z.ZodObject:
      return Mf(r, t);
    case Z.ZodBigInt:
      return yf(r, t);
    case Z.ZodBoolean:
      return _f();
    case Z.ZodDate:
      return Qo(r, t);
    case Z.ZodUndefined:
      return Uf(t);
    case Z.ZodNull:
      return Cf(t);
    case Z.ZodArray:
      return gf(r, t);
    case Z.ZodUnion:
    case Z.ZodDiscriminatedUnion:
      return If(r, t);
    case Z.ZodIntersection:
      return Pf(r, t);
    case Z.ZodTuple:
      return Ff(r, t);
    case Z.ZodRecord:
      return Xo(r, t);
    case Z.ZodLiteral:
      return Rf(r, t);
    case Z.ZodEnum:
      return kf(r);
    case Z.ZodNativeEnum:
      return Nf(r);
    case Z.ZodNullable:
      return Af(r, t);
    case Z.ZodOptional:
      return Zf(r, t);
    case Z.ZodMap:
      return xf(r, t);
    case Z.ZodSet:
      return Vf(r, t);
    case Z.ZodLazy:
      return () => r.getter()._def;
    case Z.ZodPromise:
      return Lf(r, t);
    case Z.ZodNaN:
    case Z.ZodNever:
      return Of(t);
    case Z.ZodEffects:
      return $f(r, t);
    case Z.ZodAny:
      return Qe(t);
    case Z.ZodUnknown:
      return Hf(t);
    case Z.ZodDefault:
      return wf(r, t);
    case Z.ZodBranded:
      return Wo(r, t);
    case Z.ZodReadonly:
      return Kf(r, t);
    case Z.ZodCatch:
      return vf(r, t);
    case Z.ZodPipeline:
      return zf(r, t);
    case Z.ZodFunction:
    case Z.ZodVoid:
    case Z.ZodSymbol:
      return;
    default:
      return /* @__PURE__ */ ((s) => {
      })();
  }
};
function ke(r, e, t = !1) {
  var o;
  const s = e.seen.get(r);
  if (e.override) {
    const c = (o = e.override) == null ? void 0 : o.call(e, r, e, s, t);
    if (c !== hf)
      return c;
  }
  if (s && !t) {
    const c = Gf(s, e);
    if (c !== void 0)
      return c;
  }
  const n = { def: r, path: e.currentPath, jsonSchema: void 0 };
  e.seen.set(r, n);
  const a = Bf(r, r.typeName, e), i = typeof a == "function" ? ke(a(), e) : a;
  if (i && Jf(r, e, i), e.postProcess) {
    const c = e.postProcess(i, r, e);
    return n.jsonSchema = i, c;
  }
  return n.jsonSchema = i, i;
}
const Gf = (r, e) => {
  switch (e.$refStrategy) {
    case "root":
      return { $ref: r.path.join("/") };
    case "relative":
      return { $ref: Jo(e.currentPath, r.path) };
    case "none":
    case "seen":
      return r.path.length < e.currentPath.length && r.path.every((t, s) => e.currentPath[s] === t) ? (console.warn(`Recursive reference detected at ${e.currentPath.join("/")}! Defaulting to any`), Qe(e)) : e.$refStrategy === "seen" ? Qe(e) : void 0;
  }
}, Jf = (r, e, t) => (r.description && (t.description = r.description, e.markdownDescription && (t.markdownDescription = r.description)), t), Qi = (r, e) => {
  const t = pf(e);
  let s = typeof e == "object" && e.definitions ? Object.entries(e.definitions).reduce((c, [u, l]) => ({
    ...c,
    [u]: ke(l._def, {
      ...t,
      currentPath: [...t.basePath, t.definitionPath, u]
    }, !0) ?? Qe(t)
  }), {}) : void 0;
  const n = typeof e == "string" ? e : (e == null ? void 0 : e.nameStrategy) === "title" || e == null ? void 0 : e.name, a = ke(r._def, n === void 0 ? t : {
    ...t,
    currentPath: [...t.basePath, t.definitionPath, n]
  }, !1) ?? Qe(t), i = typeof e == "object" && e.name !== void 0 && e.nameStrategy === "title" ? e.name : void 0;
  i !== void 0 && (a.title = i), t.flags.hasReferencedOpenAiAnyType && (s || (s = {}), s[t.openAiAnyTypeName] || (s[t.openAiAnyTypeName] = {
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
  const o = n === void 0 ? s ? {
    ...a,
    [t.definitionPath]: s
  } : a : {
    $ref: [
      ...t.$refStrategy === "relative" ? [] : t.basePath,
      t.definitionPath,
      n
    ].join("/"),
    [t.definitionPath]: {
      ...s,
      [n]: a
    }
  };
  return t.target === "jsonSchema7" ? o.$schema = "http://json-schema.org/draft-07/schema#" : (t.target === "jsonSchema2019-09" || t.target === "openAi") && (o.$schema = "https://json-schema.org/draft/2019-09/schema#"), t.target === "openAi" && ("anyOf" in o || "oneOf" in o || "allOf" in o || "type" in o && Array.isArray(o.type)) && console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property."), o;
};
var Dn;
(function(r) {
  r.Completable = "McpCompletable";
})(Dn || (Dn = {}));
class Zn extends ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
Zn.create = (r, e) => new Zn({
  type: r,
  typeName: Dn.Completable,
  complete: e.complete,
  ...Wf(e)
});
function Wf(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: n } = r;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (i, o) => {
    var c, u;
    const { message: l } = r;
    return i.code === "invalid_enum_value" ? { message: l ?? o.defaultError } : typeof o.data > "u" ? { message: (c = l ?? s) !== null && c !== void 0 ? c : o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: (u = l ?? t) !== null && u !== void 0 ? u : o.defaultError };
  }, description: n };
}
class Qf {
  constructor(e, t) {
    this._registeredResources = {}, this._registeredResourceTemplates = {}, this._registeredTools = {}, this._registeredPrompts = {}, this._toolHandlersInitialized = !1, this._completionHandlerInitialized = !1, this._resourceHandlersInitialized = !1, this._promptHandlersInitialized = !1, this.server = new ff(e, t);
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
    this._toolHandlersInitialized || (this.server.assertCanSetRequestHandler(jn.shape.method.value), this.server.assertCanSetRequestHandler(Mn.shape.method.value), this.server.registerCapabilities({
      tools: {
        listChanged: !0
      }
    }), this.server.setRequestHandler(jn, () => ({
      tools: Object.entries(this._registeredTools).filter(([, e]) => e.enabled).map(([e, t]) => {
        const s = {
          name: e,
          title: t.title,
          description: t.description,
          inputSchema: t.inputSchema ? Qi(t.inputSchema, {
            strictUnions: !0,
            pipeStrategy: "input"
          }) : Yf,
          annotations: t.annotations,
          _meta: t._meta
        };
        return t.outputSchema && (s.outputSchema = Qi(t.outputSchema, {
          strictUnions: !0,
          pipeStrategy: "output"
        })), s;
      })
    })), this.server.setRequestHandler(Mn, async (e, t) => {
      const s = this._registeredTools[e.params.name];
      let n;
      try {
        if (!s)
          throw new xe(Ee.InvalidParams, `Tool ${e.params.name} not found`);
        if (!s.enabled)
          throw new xe(Ee.InvalidParams, `Tool ${e.params.name} disabled`);
        if (s.inputSchema) {
          const a = s.callback, i = await s.inputSchema.safeParseAsync(e.params.arguments);
          if (!i.success)
            throw new xe(Ee.InvalidParams, `Input validation error: Invalid arguments for tool ${e.params.name}: ${i.error.message}`);
          const o = i.data;
          n = await Promise.resolve(a(o, t));
        } else {
          const a = s.callback;
          n = await Promise.resolve(a(t));
        }
        if (s.outputSchema && !n.isError) {
          if (!n.structuredContent)
            throw new xe(Ee.InvalidParams, `Output validation error: Tool ${e.params.name} has an output schema but no structured content was provided`);
          const a = await s.outputSchema.safeParseAsync(n.structuredContent);
          if (!a.success)
            throw new xe(Ee.InvalidParams, `Output validation error: Invalid structured content for tool ${e.params.name}: ${a.error.message}`);
        }
      } catch (a) {
        return this.createToolError(a instanceof Error ? a.message : String(a));
      }
      return n;
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
    this._completionHandlerInitialized || (this.server.assertCanSetRequestHandler(qn.shape.method.value), this.server.registerCapabilities({
      completions: {}
    }), this.server.setRequestHandler(qn, async (e) => {
      switch (e.params.ref.type) {
        case "ref/prompt":
          return this.handlePromptCompletion(e, e.params.ref);
        case "ref/resource":
          return this.handleResourceCompletion(e, e.params.ref);
        default:
          throw new xe(Ee.InvalidParams, `Invalid completion reference: ${e.params.ref}`);
      }
    }), this._completionHandlerInitialized = !0);
  }
  async handlePromptCompletion(e, t) {
    const s = this._registeredPrompts[t.name];
    if (!s)
      throw new xe(Ee.InvalidParams, `Prompt ${t.name} not found`);
    if (!s.enabled)
      throw new xe(Ee.InvalidParams, `Prompt ${t.name} disabled`);
    if (!s.argsSchema)
      return ds;
    const n = s.argsSchema.shape[e.params.argument.name];
    if (!(n instanceof Zn))
      return ds;
    const i = await n._def.complete(e.params.argument.value, e.params.context);
    return Xi(i);
  }
  async handleResourceCompletion(e, t) {
    const s = Object.values(this._registeredResourceTemplates).find((i) => i.resourceTemplate.uriTemplate.toString() === t.uri);
    if (!s) {
      if (this._registeredResources[t.uri])
        return ds;
      throw new xe(Ee.InvalidParams, `Resource template ${e.params.ref.uri} not found`);
    }
    const n = s.resourceTemplate.completeCallback(e.params.argument.name);
    if (!n)
      return ds;
    const a = await n(e.params.argument.value, e.params.context);
    return Xi(a);
  }
  setResourceRequestHandlers() {
    this._resourceHandlersInitialized || (this.server.assertCanSetRequestHandler(Nn.shape.method.value), this.server.assertCanSetRequestHandler(On.shape.method.value), this.server.assertCanSetRequestHandler(Cn.shape.method.value), this.server.registerCapabilities({
      resources: {
        listChanged: !0
      }
    }), this.server.setRequestHandler(Nn, async (e, t) => {
      const s = Object.entries(this._registeredResources).filter(([a, i]) => i.enabled).map(([a, i]) => ({
        uri: a,
        name: i.name,
        ...i.metadata
      })), n = [];
      for (const a of Object.values(this._registeredResourceTemplates)) {
        if (!a.resourceTemplate.listCallback)
          continue;
        const i = await a.resourceTemplate.listCallback(t);
        for (const o of i.resources)
          n.push({
            ...a.metadata,
            // the defined resource metadata should override the template metadata if present
            ...o
          });
      }
      return { resources: [...s, ...n] };
    }), this.server.setRequestHandler(On, async () => ({ resourceTemplates: Object.entries(this._registeredResourceTemplates).map(([t, s]) => ({
      name: t,
      uriTemplate: s.resourceTemplate.uriTemplate.toString(),
      ...s.metadata
    })) })), this.server.setRequestHandler(Cn, async (e, t) => {
      const s = new URL(e.params.uri), n = this._registeredResources[s.toString()];
      if (n) {
        if (!n.enabled)
          throw new xe(Ee.InvalidParams, `Resource ${s} disabled`);
        return n.readCallback(s, t);
      }
      for (const a of Object.values(this._registeredResourceTemplates)) {
        const i = a.resourceTemplate.uriTemplate.match(s.toString());
        if (i)
          return a.readCallback(s, i, t);
      }
      throw new xe(Ee.InvalidParams, `Resource ${s} not found`);
    }), this.setCompletionRequestHandler(), this._resourceHandlersInitialized = !0);
  }
  setPromptRequestHandlers() {
    this._promptHandlersInitialized || (this.server.assertCanSetRequestHandler(In.shape.method.value), this.server.assertCanSetRequestHandler(An.shape.method.value), this.server.registerCapabilities({
      prompts: {
        listChanged: !0
      }
    }), this.server.setRequestHandler(In, () => ({
      prompts: Object.entries(this._registeredPrompts).filter(([, e]) => e.enabled).map(([e, t]) => ({
        name: e,
        title: t.title,
        description: t.description,
        arguments: t.argsSchema ? eh(t.argsSchema) : void 0
      }))
    })), this.server.setRequestHandler(An, async (e, t) => {
      const s = this._registeredPrompts[e.params.name];
      if (!s)
        throw new xe(Ee.InvalidParams, `Prompt ${e.params.name} not found`);
      if (!s.enabled)
        throw new xe(Ee.InvalidParams, `Prompt ${e.params.name} disabled`);
      if (s.argsSchema) {
        const n = await s.argsSchema.safeParseAsync(e.params.arguments);
        if (!n.success)
          throw new xe(Ee.InvalidParams, `Invalid arguments for prompt ${e.params.name}: ${n.error.message}`);
        const a = n.data, i = s.callback;
        return await Promise.resolve(i(a, t));
      } else {
        const n = s.callback;
        return await Promise.resolve(n(t));
      }
    }), this.setCompletionRequestHandler(), this._promptHandlersInitialized = !0);
  }
  resource(e, t, ...s) {
    let n;
    typeof s[0] == "object" && (n = s.shift());
    const a = s[0];
    if (typeof t == "string") {
      if (this._registeredResources[t])
        throw new Error(`Resource ${t} is already registered`);
      const i = this._createRegisteredResource(e, void 0, t, n, a);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), i;
    } else {
      if (this._registeredResourceTemplates[e])
        throw new Error(`Resource template ${e} is already registered`);
      const i = this._createRegisteredResourceTemplate(e, void 0, t, n, a);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), i;
    }
  }
  registerResource(e, t, s, n) {
    if (typeof t == "string") {
      if (this._registeredResources[t])
        throw new Error(`Resource ${t} is already registered`);
      const a = this._createRegisteredResource(e, s.title, t, s, n);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), a;
    } else {
      if (this._registeredResourceTemplates[e])
        throw new Error(`Resource template ${e} is already registered`);
      const a = this._createRegisteredResourceTemplate(e, s.title, t, s, n);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), a;
    }
  }
  _createRegisteredResource(e, t, s, n, a) {
    const i = {
      name: e,
      title: t,
      metadata: n,
      readCallback: a,
      enabled: !0,
      disable: () => i.update({ enabled: !1 }),
      enable: () => i.update({ enabled: !0 }),
      remove: () => i.update({ uri: null }),
      update: (o) => {
        typeof o.uri < "u" && o.uri !== s && (delete this._registeredResources[s], o.uri && (this._registeredResources[o.uri] = i)), typeof o.name < "u" && (i.name = o.name), typeof o.title < "u" && (i.title = o.title), typeof o.metadata < "u" && (i.metadata = o.metadata), typeof o.callback < "u" && (i.readCallback = o.callback), typeof o.enabled < "u" && (i.enabled = o.enabled), this.sendResourceListChanged();
      }
    };
    return this._registeredResources[s] = i, i;
  }
  _createRegisteredResourceTemplate(e, t, s, n, a) {
    const i = {
      resourceTemplate: s,
      title: t,
      metadata: n,
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
  _createRegisteredPrompt(e, t, s, n, a) {
    const i = {
      title: t,
      description: s,
      argsSchema: n === void 0 ? void 0 : J(n),
      callback: a,
      enabled: !0,
      disable: () => i.update({ enabled: !1 }),
      enable: () => i.update({ enabled: !0 }),
      remove: () => i.update({ name: null }),
      update: (o) => {
        typeof o.name < "u" && o.name !== e && (delete this._registeredPrompts[e], o.name && (this._registeredPrompts[o.name] = i)), typeof o.title < "u" && (i.title = o.title), typeof o.description < "u" && (i.description = o.description), typeof o.argsSchema < "u" && (i.argsSchema = J(o.argsSchema)), typeof o.callback < "u" && (i.callback = o.callback), typeof o.enabled < "u" && (i.enabled = o.enabled), this.sendPromptListChanged();
      }
    };
    return this._registeredPrompts[e] = i, i;
  }
  _createRegisteredTool(e, t, s, n, a, i, o, c) {
    const u = {
      title: t,
      description: s,
      inputSchema: n === void 0 ? void 0 : J(n),
      outputSchema: a === void 0 ? void 0 : J(a),
      annotations: i,
      _meta: o,
      callback: c,
      enabled: !0,
      disable: () => u.update({ enabled: !1 }),
      enable: () => u.update({ enabled: !0 }),
      remove: () => u.update({ name: null }),
      update: (l) => {
        typeof l.name < "u" && l.name !== e && (delete this._registeredTools[e], l.name && (this._registeredTools[l.name] = u)), typeof l.title < "u" && (u.title = l.title), typeof l.description < "u" && (u.description = l.description), typeof l.paramsSchema < "u" && (u.inputSchema = J(l.paramsSchema)), typeof l.callback < "u" && (u.callback = l.callback), typeof l.annotations < "u" && (u.annotations = l.annotations), typeof l._meta < "u" && (u._meta = l._meta), typeof l.enabled < "u" && (u.enabled = l.enabled), this.sendToolListChanged();
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
    let s, n, a, i;
    if (typeof t[0] == "string" && (s = t.shift()), t.length > 1) {
      const c = t[0];
      Yi(c) ? (n = t.shift(), t.length > 1 && typeof t[0] == "object" && t[0] !== null && !Yi(t[0]) && (i = t.shift())) : typeof c == "object" && c !== null && (i = t.shift());
    }
    const o = t[0];
    return this._createRegisteredTool(e, void 0, s, n, a, i, void 0, o);
  }
  /**
   * Registers a tool with a config object and callback.
   */
  registerTool(e, t, s) {
    if (this._registeredTools[e])
      throw new Error(`Tool ${e} is already registered`);
    const { title: n, description: a, inputSchema: i, outputSchema: o, annotations: c, _meta: u } = t;
    return this._createRegisteredTool(e, n, a, i, o, c, u, s);
  }
  prompt(e, ...t) {
    if (this._registeredPrompts[e])
      throw new Error(`Prompt ${e} is already registered`);
    let s;
    typeof t[0] == "string" && (s = t.shift());
    let n;
    t.length > 1 && (n = t.shift());
    const a = t[0], i = this._createRegisteredPrompt(e, void 0, s, n, a);
    return this.setPromptRequestHandlers(), this.sendPromptListChanged(), i;
  }
  /**
   * Registers a prompt with a config object and callback.
   */
  registerPrompt(e, t, s) {
    if (this._registeredPrompts[e])
      throw new Error(`Prompt ${e} is already registered`);
    const { title: n, description: a, argsSchema: i } = t, o = this._createRegisteredPrompt(e, n, a, i, s);
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
const Yf = {
  type: "object",
  properties: {}
};
function Yi(r) {
  return typeof r != "object" || r === null ? !1 : Object.keys(r).length === 0 || Object.values(r).some(Xf);
}
function Xf(r) {
  return r !== null && typeof r == "object" && "parse" in r && typeof r.parse == "function" && "safeParse" in r && typeof r.safeParse == "function";
}
function eh(r) {
  return Object.entries(r.shape).map(([e, t]) => ({
    name: e,
    description: t.description,
    required: !t.isOptional()
  }));
}
function Xi(r) {
  return {
    completion: {
      values: r.slice(0, 100),
      total: r.length,
      hasMore: r.length > 100
    }
  };
}
const ds = {
  completion: {
    values: [],
    hasMore: !1
  }
};
async function ec(r, e) {
  const t = progressPlannerAngie.restUrl + r, s = {
    method: e ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": progressPlannerAngie.nonce || ""
    }
  };
  e && (s.body = JSON.stringify(e));
  const n = await fetch(t, s);
  if (!n.ok)
    throw new Error(`HTTP error! status: ${n.status}`);
  return await n.json();
}
function th(r, e = []) {
  const t = {};
  for (const [s, n] of Object.entries(r)) {
    let a;
    switch (n.type) {
      case "string":
        a = U();
        break;
      case "number":
        a = De();
        break;
      case "boolean":
        a = We();
        break;
      case "array":
        a = Ne(Dt());
        break;
      case "object":
        a = or(Dt());
        break;
      default:
        a = Dt();
    }
    n.description && (a = a.describe(n.description)), e.includes(s) || (a = a.optional()), t[s] = a;
  }
  return t;
}
function rh(r, e) {
  if (!e)
    return JSON.stringify(r, null, 2);
  switch (e) {
    case "format_recommendations_list":
      return ah(r.tasks, "Tasks");
    case "format_complete_recommendation": {
      const t = r;
      let s = t.message;
      return t.new_value && (s += `

New value: "${t.new_value}"`), s;
    }
    default:
      return JSON.stringify(r, null, 2);
  }
}
function sh(r) {
  return async (e, t) => {
    const s = r.method === "POST" ? e : void 0, n = await ec(r.endpoint, s);
    return {
      content: [
        {
          type: "text",
          text: rh(n, r.responseFormatter)
        }
      ]
    };
  };
}
async function nh() {
  const r = new Qf(
    {
      name: "progress-planner",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  ), t = await ec("/tools");
  if (!t.success || !t.tools)
    throw new Error("Failed to fetch tool definitions from API");
  for (const s of t.tools) {
    const n = s.inputSchema.properties ? th(
      s.inputSchema.properties,
      s.inputSchema.required || []
    ) : {}, a = sh(s);
    r.tool(s.name, s.description, n, a);
  }
  return r;
}
const eo = async () => {
  try {
    const r = await nh();
    await new xu().registerServer({
      name: "progress-planner",
      version: "1.0.0",
      description: "Manage Progress Planner recommendations, including viewing active and completed recommendations, and completing recommendations through AI assistance.",
      server: r
    }), console.log(
      "Progress Planner MCP Server registered with Angie successfully"
    );
  } catch (r) {
    console.error(
      "Failed to register Progress Planner MCP Server with Angie:",
      r
    );
  }
};
function ah(r, e) {
  if (!r || r.length === 0)
    return `No ${e.toLowerCase()} found.`;
  let t = `## ${e} (${r.length})

`;
  return r.forEach((s, n) => {
    t += `### ${n + 1}. ${s.title}
`, t += `- **ID**: ${s.id}
`, t += `- **Description**: ${s.description}
`, t += `- **Priority**: ${s.priority}
`, t += `- **Status**: ${s.status}
`, s.url && (t += `- **Action URL**: ${s.url}
`), t += `
`;
  }), t;
}
typeof window < "u" && progressPlannerAngie && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  eo().catch((r) => {
    console.error(
      "Failed to initialize Progress Planner MCP Server:",
      r
    );
  });
}) : eo().catch((r) => {
  console.error(
    "Failed to initialize Progress Planner MCP Server:",
    r
  );
}));
export {
  eo as initializeServer
};
