/* NightVisionCharts v0.4.2 | License: MIT
 © 2022 ChartMaster. All rights reserved */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function noop() {
}
const identity = (x) => x;
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop$1(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && /** @type {ShadowRoot} */
  root.host) {
    return (
      /** @type {ShadowRoot} */
      root
    );
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  style_element.textContent = "/* empty */";
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(
    /** @type {Document} */
    node.head || node,
    style
  );
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
class HtmlTag {
  constructor(is_svg = false) {
    /**
     * @private
     * @default false
     */
    __publicField(this, "is_svg", false);
    /** parent for creating node */
    __publicField(this, "e");
    /** html tag nodes */
    __publicField(this, "n");
    /** target */
    __publicField(this, "t");
    /** anchor */
    __publicField(this, "a");
    this.is_svg = is_svg;
    this.e = this.n = null;
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  c(html) {
    this.h(html);
  }
  /**
   * @param {string} html
   * @param {HTMLElement | SVGElement} target
   * @param {HTMLElement | SVGElement} anchor
   * @returns {void}
   */
  m(html, target, anchor = null) {
    if (!this.e) {
      if (this.is_svg)
        this.e = svg_element(
          /** @type {keyof SVGElementTagNameMap} */
          target.nodeName
        );
      else
        this.e = element(
          /** @type {keyof HTMLElementTagNameMap} */
          target.nodeType === 11 ? "TEMPLATE" : target.nodeName
        );
      this.t = target.tagName !== "TEMPLATE" ? target : (
        /** @type {HTMLTemplateElement} */
        target.content
      );
      this.c(html);
    }
    this.i(anchor);
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  h(html) {
    this.e.innerHTML = html;
    this.n = Array.from(
      this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes
    );
  }
  /**
   * @returns {void} */
  i(anchor) {
    for (let i = 0; i < this.n.length; i += 1) {
      insert(this.t, this.n[i], anchor);
    }
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  p(html) {
    this.d();
    this.h(html);
    this.i(this.a);
  }
  /**
   * @returns {void} */
  d() {
    this.n.forEach(detach);
  }
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
    // remove all Svelte animations
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode)
        detach(ownerNode);
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const null_transition = { duration: 0 };
function create_bidirectional_transition(node, fn, params, intro) {
  const options = { direction: "both" };
  let config = fn(node, params, options);
  let t = intro ? 0 : 1;
  let running_program = null;
  let pending_program = null;
  let animation_name = null;
  let original_inert_value;
  function clear_animation() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function init2(program, duration) {
    const d = (
      /** @type {Program['d']} */
      program.b - t
    );
    duration *= Math.abs(d);
    return {
      a: t,
      b: program.b,
      d,
      duration,
      start: program.start,
      end: program.start + duration,
      group: program.group
    };
  }
  function go(b) {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    const program = {
      start: now() + delay,
      b
    };
    if (!b) {
      program.group = outros;
      outros.r += 1;
    }
    if ("inert" in node) {
      if (b) {
        if (original_inert_value !== void 0) {
          node.inert = original_inert_value;
        }
      } else {
        original_inert_value = /** @type {HTMLElement} */
        node.inert;
        node.inert = true;
      }
    }
    if (running_program || pending_program) {
      pending_program = program;
    } else {
      if (css) {
        clear_animation();
        animation_name = create_rule(node, t, b, duration, delay, easing, css);
      }
      if (b)
        tick(0, 1);
      running_program = init2(program, duration);
      add_render_callback(() => dispatch(node, b, "start"));
      loop$1((now2) => {
        if (pending_program && now2 > pending_program.start) {
          running_program = init2(pending_program, duration);
          pending_program = null;
          dispatch(node, running_program.b, "start");
          if (css) {
            clear_animation();
            animation_name = create_rule(
              node,
              t,
              running_program.b,
              running_program.duration,
              0,
              easing,
              config.css
            );
          }
        }
        if (running_program) {
          if (now2 >= running_program.end) {
            tick(t = running_program.b, 1 - t);
            dispatch(node, running_program.b, "end");
            if (!pending_program) {
              if (running_program.b) {
                clear_animation();
              } else {
                if (!--running_program.group.r)
                  run_all(running_program.group.c);
              }
            }
            running_program = null;
          } else if (now2 >= running_program.start) {
            const p = now2 - running_program.start;
            t = running_program.a + running_program.d * easing(p / running_program.duration);
            tick(t, 1 - t);
          }
        }
        return !!(running_program || pending_program);
      });
    }
  }
  return {
    run(b) {
      if (is_function(config)) {
        wait().then(() => {
          const opts = { direction: b ? "in" : "out" };
          config = config(opts);
          go(b);
        });
      } else {
        go(b);
      }
    },
    end() {
      clear_animation();
      running_program = pending_program = null;
    }
  };
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles2 = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var util$1 = {};
function isArrayLike(o) {
  if (o && // o is not null, undefined, etc.
  typeof o === "object" && // o is an object
  isFinite(o.length) && // o.length is a finite number
  o.length >= 0 && // o.length is non-negative
  o.length === Math.floor(o.length) && // o.length is an integer
  o.length < 4294967296)
    return true;
  else
    return false;
}
function isSortable(o) {
  if (o && // o is not null, undefined, etc.
  typeof o === "object" && // o is an object
  typeof o.sort === "function")
    return true;
  else
    return false;
}
util$1.isSortableArrayLike = function(o) {
  return isArrayLike(o) && isSortable(o);
};
var compare = {
  /**
   * Compare two numbers.
   *
   * @param {Number} a
   * @param {Number} b
   * @returns {Number} 1 if a > b, 0 if a = b, -1 if a < b
   */
  numcmp: function(a, b) {
    return a - b;
  },
  /**
   * Compare two strings.
   *
   * @param {Number|String} a
   * @param {Number|String} b
   * @returns {Number} 1 if a > b, 0 if a = b, -1 if a < b
   */
  strcmp: function(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }
};
var binary = {};
function loop(data, min, max, index, valpos) {
  var curr = max + min >>> 1;
  var diff = this.compare(data[curr][this.index], index);
  if (!diff) {
    return valpos[index] = {
      "found": true,
      "index": curr,
      "prev": null,
      "next": null
    };
  }
  if (min >= max) {
    return valpos[index] = {
      "found": false,
      "index": null,
      "prev": diff < 0 ? max : max - 1,
      "next": diff < 0 ? max + 1 : max
    };
  }
  if (diff > 0)
    return loop.call(this, data, min, curr - 1, index, valpos);
  else
    return loop.call(this, data, curr + 1, max, index, valpos);
}
function search(index) {
  var data = this.data;
  return loop.call(this, data, 0, data.length - 1, index, this.valpos);
}
binary.search = search;
var util = util$1, cmp = compare, bin = binary;
var lib = IndexedArray;
function IndexedArray(data, index) {
  if (!util.isSortableArrayLike(data))
    throw new Error("Invalid data");
  if (!index || data.length > 0 && !(index in data[0]))
    throw new Error("Invalid index");
  this.data = data;
  this.index = index;
  this.setBoundaries();
  this.compare = typeof this.minv === "number" ? cmp.numcmp : cmp.strcmp;
  this.search = bin.search;
  this.valpos = {};
  this.cursor = null;
  this.nextlow = null;
  this.nexthigh = null;
}
IndexedArray.prototype.setCompare = function(fn) {
  if (typeof fn !== "function")
    throw new Error("Invalid argument");
  this.compare = fn;
  return this;
};
IndexedArray.prototype.setSearch = function(fn) {
  if (typeof fn !== "function")
    throw new Error("Invalid argument");
  this.search = fn;
  return this;
};
IndexedArray.prototype.sort = function() {
  var self = this, index = this.index;
  this.data.sort(function(a, b) {
    return self.compare(a[index], b[index]);
  });
  this.setBoundaries();
  return this;
};
IndexedArray.prototype.setBoundaries = function() {
  var data = this.data, index = this.index;
  this.minv = data.length && data[0][index];
  this.maxv = data.length && data[data.length - 1][index];
  return this;
};
IndexedArray.prototype.fetch = function(value) {
  if (this.data.length === 0) {
    this.cursor = null;
    this.nextlow = null;
    this.nexthigh = null;
    return this;
  }
  if (this.compare(value, this.minv) === -1) {
    this.cursor = null;
    this.nextlow = null;
    this.nexthigh = 0;
    return this;
  }
  if (this.compare(value, this.maxv) === 1) {
    this.cursor = null;
    this.nextlow = this.data.length - 1;
    this.nexthigh = null;
    return this;
  }
  var valpos = this.valpos, pos = valpos[value];
  if (pos) {
    if (pos.found) {
      this.cursor = pos.index;
      this.nextlow = null;
      this.nexthigh = null;
    } else {
      this.cursor = null;
      this.nextlow = pos.prev;
      this.nexthigh = pos.next;
    }
    return this;
  }
  var result = this.search.call(this, value);
  this.cursor = result.index;
  this.nextlow = result.prev;
  this.nexthigh = result.next;
  return this;
};
IndexedArray.prototype.get = function(value) {
  if (value)
    this.fetch(value);
  var pos = this.cursor;
  return pos !== null ? this.data[pos] : null;
};
IndexedArray.prototype.getRange = function(begin, end) {
  if (this.compare(begin, end) === 1) {
    return [];
  }
  this.fetch(begin);
  var start = this.cursor || this.nexthigh;
  this.fetch(end);
  var finish = this.cursor || this.nextlow;
  if (start === null || finish === null) {
    return [];
  }
  return this.data.slice(start, finish + 1);
};
const IndexedArray$1 = /* @__PURE__ */ getDefaultExportFromCjs(lib);
const SECOND = 1e3;
const MINUTE$2 = SECOND * 60;
const MINUTE2$1 = MINUTE$2 * 2;
const MINUTE3 = MINUTE$2 * 3;
const MINUTE5$1 = MINUTE$2 * 5;
const MINUTE15$2 = MINUTE$2 * 15;
const MINUTE30$1 = MINUTE$2 * 30;
const HOUR$3 = MINUTE$2 * 60;
const HOUR4$1 = HOUR$3 * 4;
const HOUR12$1 = HOUR$3 * 12;
const DAY$3 = HOUR$3 * 24;
const WEEK$3 = DAY$3 * 7;
const MONTH$3 = WEEK$3 * 4;
const YEAR$3 = DAY$3 * 365;
const MONTHMAP$1 = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const TIMESCALES$1 = [
  YEAR$3 * 10,
  YEAR$3 * 5,
  YEAR$3 * 3,
  YEAR$3 * 2,
  YEAR$3,
  MONTH$3 * 6,
  MONTH$3 * 4,
  MONTH$3 * 3,
  MONTH$3 * 2,
  MONTH$3,
  DAY$3 * 15,
  DAY$3 * 10,
  DAY$3 * 7,
  DAY$3 * 5,
  DAY$3 * 3,
  DAY$3 * 2,
  DAY$3,
  HOUR$3 * 12,
  HOUR$3 * 6,
  HOUR$3 * 3,
  HOUR$3 * 1.5,
  HOUR$3,
  MINUTE30$1,
  MINUTE15$2,
  MINUTE$2 * 10,
  MINUTE5$1,
  MINUTE2$1,
  MINUTE$2
];
const $SCALES$2 = [0.05, 0.1, 0.2, 0.25, 0.5, 0.8, 1, 2, 5];
const COLORS = {
  back: "#14151c",
  // Background color
  grid: "#252732",
  // Grid color
  text: "#adadad",
  // Regular text color
  textHL: "#dedddd",
  // Highlighted text color
  textLG: "#c4c4c4",
  // Legend text color
  llValue: "#818989",
  // Legend value color
  llBack: "#14151c77",
  // Legend bar background
  llSelect: "#2d7b2f",
  // Legend select border
  scale: "#606060",
  // Scale edge color
  cross: "#8091a0",
  // Crosshair color
  candleUp: "#41a376",
  // "Green" candle color
  candleDw: "#de4646",
  // "Red" candle color
  wickUp: "#23a77688",
  // "Green" wick color
  wickDw: "#e5415088",
  // "Red" wick color
  volUp: "#41a37682",
  // "Green" volume color
  volDw: "#de464682",
  // "Red" volume color
  panel: "#2a2f38",
  // Scale panel color
  tbBack: void 0,
  // Toolbar background
  tbBorder: "#8282827d"
  // Toolbar border color
};
const ChartConfig = {
  SBMIN: 60,
  // Minimal sidebar, px
  SBMAX: Infinity,
  // Max sidebar, px
  TOOLBAR: 57,
  // Toolbar width, px
  TB_ICON: 25,
  // Toolbar icon size, px
  TB_ITEM_M: 6,
  // Toolbar item margin, px
  TB_ICON_BRI: 1,
  // Toolbar icon brightness
  TB_ICON_HOLD: 420,
  // Wait to expand, ms
  TB_BORDER: 1,
  // Toolbar border, px
  TB_B_STYLE: "dotted",
  // Toolbar border style
  TOOL_COLL: 7,
  // Tool collision threshold
  PIN_RADIUS: 5.5,
  // Tool pin radius
  EXPAND: 0.15,
  // Expand y-range, %/100 of range
  CANDLEW: 0.7,
  // Candle width, %/100 of step
  GRIDX: 100,
  // Grid x-step target, px
  GRIDY: 47,
  // Grid y-step target, px
  BOTBAR: 28,
  // Bottom bar height, px
  PANHEIGHT: 22,
  // Scale panel height, px
  DEFAULT_LEN: 50,
  // Starting range, candles
  MINIMUM_LEN: 5,
  // Minimal starting range, candles
  MIN_ZOOM: 5,
  // Minimal zoom, candles
  MAX_ZOOM: 5e3,
  // Maximal zoom, candles,
  VOLSCALE: 0.15,
  // Volume bars height, %/100 of layout.height
  UX_OPACITY: 0.9,
  // Ux background opacity
  ZOOM_MODE: "tv",
  // Zoom mode, 'tv' or 'tl'
  L_BTN_SIZE: 21,
  // Legend Button size, px
  L_BTN_MARGIN: "-6px 0 -6px 0",
  // css margin
  SCROLL_WHEEL: "prevent",
  // Scroll wheel morde, 'prevent', 'pass', 'click',
  QUANTIZE_AFTER: 0,
  // Quantize cursor after, ms
  AUTO_PRE_SAMPLE: 10,
  // Sample size for auto-precision
  CANDLE_TIME: true
  // Show remaining candle time 
};
ChartConfig.FONT = `11px -apple-system,BlinkMacSystemFont,
    Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
    Fira Sans,Droid Sans,Helvetica Neue,
    sans-serif`;
const IB_TF_WARN = `When using IB mode you should specify timeframe ('tf' filed in 'chart' object),otherwise you can get an unexpected behaviour`;
const MAP_UNIT = {
  "1s": SECOND,
  "5s": SECOND * 5,
  "10s": SECOND * 10,
  "20s": SECOND * 20,
  "30s": SECOND * 30,
  "1m": MINUTE$2,
  "2m": MINUTE2$1,
  "3m": MINUTE3,
  "5m": MINUTE5$1,
  "15m": MINUTE15$2,
  "30m": MINUTE30$1,
  "1H": HOUR$3,
  "2H": HOUR$3 * 2,
  "3H": HOUR$3 * 3,
  "4H": HOUR4$1,
  "12H": HOUR12$1,
  "1D": DAY$3,
  "1W": WEEK$3,
  "1M": MONTH$3,
  "1Y": YEAR$3,
  // Lower case variants
  "1h": HOUR$3,
  "2h": HOUR$3 * 2,
  "3h": HOUR$3 * 3,
  "4h": HOUR4$1,
  "12h": HOUR12$1,
  "1d": DAY$3,
  "1w": WEEK$3,
  "1y": YEAR$3
};
const HPX$8 = -0.5;
const Const = {
  SECOND,
  MINUTE: MINUTE$2,
  MINUTE2: MINUTE2$1,
  MINUTE5: MINUTE5$1,
  MINUTE15: MINUTE15$2,
  MINUTE30: MINUTE30$1,
  HOUR: HOUR$3,
  HOUR4: HOUR4$1,
  HOUR12: HOUR12$1,
  DAY: DAY$3,
  WEEK: WEEK$3,
  MONTH: MONTH$3,
  YEAR: YEAR$3,
  MONTHMAP: MONTHMAP$1,
  TIMESCALES: TIMESCALES$1,
  $SCALES: $SCALES$2,
  ChartConfig,
  MAP_UNIT,
  IB_TF_WARN,
  COLORS,
  HPX: HPX$8
};
const {
  MINUTE: MINUTE$1,
  MINUTE2,
  MINUTE5,
  MINUTE15: MINUTE15$1,
  MINUTE30,
  HOUR: HOUR$2,
  HOUR4,
  HOUR12,
  DAY: DAY$2,
  WEEK: WEEK$2,
  MONTH: MONTH$2,
  YEAR: YEAR$2
} = Const;
const Utils = {
  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  },
  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  // Start of the day (zero millisecond)
  dayStart(t) {
    let start = new Date(t);
    return start.setUTCHours(0, 0, 0, 0);
  },
  // Start of the month
  monthStart(t) {
    let date = new Date(t);
    return Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      1
    );
  },
  // Start of the year
  yearStart(t) {
    return Date.UTC(new Date(t).getFullYear());
  },
  getYear(t) {
    if (!t)
      return void 0;
    return new Date(t).getUTCFullYear();
  },
  getMonth(t) {
    if (!t)
      return void 0;
    return new Date(t).getUTCMonth();
  },
  // Nearest in array
  nearestA(x, array) {
    let dist = Infinity;
    let val = null;
    let index = -1;
    for (var i = 0; i < array.length; i++) {
      var xi = array[i];
      if (Math.abs(xi - x) < dist) {
        dist = Math.abs(xi - x);
        val = xi;
        index = i;
      }
    }
    return [index, val];
  },
  // Nearest value by time (in timeseries)
  nearestTs(t, ts) {
    let dist = Infinity;
    let val = null;
    let index = -1;
    for (var i = 0; i < ts.length; i++) {
      var ti = ts[i][0];
      if (Math.abs(ti - t) < dist) {
        dist = Math.abs(ti - t);
        val = ts[i];
        index = i;
      }
    }
    return [index, val];
  },
  // Nearest value by index (in timeseries)
  nearestTsIb(i, ts, offset) {
    let index = Math.floor(i - offset) + 1;
    let val = ts[index] || null;
    return [index, val];
  },
  round(num, decimals = 8) {
    return parseFloat(num.toFixed(decimals));
  },
  // Strip? No, it's ugly floats in js
  strip(number) {
    return parseFloat(
      parseFloat(number).toPrecision(12)
    );
  },
  getDay(t) {
    return t ? new Date(t).getDate() : null;
  },
  // Update array keeping the same reference
  overwrite(arr, new_arr) {
    arr.splice(0, arr.length, ...new_arr);
  },
  // Get full list of overlays on all panes
  allOverlays(panes = []) {
    return panes.map((x) => x.overlays || []).flat();
  },
  // Detects a timeframe of the data
  detectTimeframe(data) {
    let len = Math.min(data.length - 1, 99);
    let min = Infinity;
    data.slice(0, len).forEach((x, i) => {
      let d = data[i + 1][0] - x[0];
      if (d === d && d < min)
        min = d;
    });
    if (min >= Const.MONTH && min <= Const.DAY * 30) {
      return Const.DAY * 31;
    }
    return min;
  },
  // Fast filter. Really fast, like 10X
  fastFilter(arr, t1, t2) {
    if (!arr.length)
      return [arr, void 0];
    try {
      let ia = new IndexedArray$1(arr, "0");
      let res = ia.getRange(t1, t2);
      let i0 = ia.valpos[t1].next;
      return [res, i0];
    } catch (e) {
      return [arr.filter(
        (x) => x[0] >= t1 && x[0] <= t2
      ), 0];
    }
  },
  // Fast filter 2 (returns indices)
  fastFilter2(arr, t1, t2) {
    if (!arr.length)
      return [arr, void 0];
    try {
      let ia = new IndexedArray$1(arr, "0");
      ia.fetch(t1);
      let start = ia.cursor || ia.nexthigh;
      ia.fetch(t2);
      let finish = ia.cursor || ia.nextlow;
      return [start, finish + 1];
    } catch (e) {
      let subset = arr.filter(
        (x) => x[0] >= t1 && x[0] <= t2
      );
      let i1 = arr.indexOf(subset[0]);
      let i2 = arr.indexOf(subset[subset.length - 1]);
      return [i1, i2];
    }
  },
  // Fast filter (index-based)
  fastFilterIB(arr, t1, t2) {
    if (!arr.length)
      return [void 0, void 0];
    let i1 = Math.floor(t1);
    if (i1 < 0)
      i1 = 0;
    let i2 = Math.floor(t2 + 1);
    return [i1, i2];
  },
  // Nearest indexes (left and right)
  fastNearest(arr, t1) {
    let ia = new IndexedArray$1(arr, "0");
    ia.fetch(t1);
    return [ia.nextlow, ia.nexthigh];
  },
  now() {
    return (/* @__PURE__ */ new Date()).getTime();
  },
  pause(delay) {
    return new Promise((rs, rj) => setTimeout(rs, delay));
  },
  // Limit crazy wheel delta values
  smartWheel(delta) {
    let abs = Math.abs(delta);
    if (abs > 500) {
      return (200 + Math.log(abs)) * Math.sign(delta);
    }
    return delta;
  },
  // Parse the original mouse event to find deltaX
  getDeltaX(event) {
    return event.originalEvent.deltaX / 12;
  },
  // Parse the original mouse event to find deltaY
  getDeltaY(event) {
    return event.originalEvent.deltaY / 12;
  },
  // Apply opacity to a hex color
  applyOpacity(c, op) {
    if (c.length === 7) {
      let n = Math.floor(op * 255);
      n = this.clamp(n, 0, 255);
      c += n.toString(16);
    }
    return c;
  },
  // Parse timeframe or return value in ms
  // TODO: add full parser
  // (https://github.com/tvjsx/trading-vue-js/
  // blob/master/src/helpers/script_utils.js#L98)
  parseTf(smth) {
    if (typeof smth === "string") {
      return Const.MAP_UNIT[smth];
    } else {
      return smth;
    }
  },
  // Detect index shift between the main data subset
  // and the overlay's subset (for IB-mode)
  indexShift(sub, data) {
    if (!data.length)
      return 0;
    let first = data[0][0];
    let second;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] !== first) {
        second = data[i][0];
        break;
      }
    }
    for (var j = 0; j < sub.length; j++) {
      if (sub[j][0] === second) {
        return j - i;
      }
    }
    return 0;
  },
  // Fallback fix for Brave browser
  // https://github.com/brave/brave-browser/issues/1738
  measureText(ctx, text2, nvId) {
    let m = ctx.measureTextOrg(text2);
    if (m.width === 0) {
      const doc = document;
      const id = "nvjs-measure-text";
      let el = doc.getElementById(id);
      if (!el) {
        let base = doc.getElementById(nvId);
        el = doc.createElement("div");
        el.id = id;
        el.style.position = "absolute";
        el.style.top = "-1000px";
        base.appendChild(el);
      }
      if (ctx.font)
        el.style.font = ctx.font;
      el.innerText = text2.replace(/ /g, ".");
      return { width: el.offsetWidth };
    } else {
      return m;
    }
  },
  uuid(temp = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx") {
    return temp.replace(/[xy]/g, (c) => {
      var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  },
  uuid2() {
    return this.uuid("xxxxxxxxxxxx");
  },
  uuid3() {
    return Math.random().toString().slice(2).replace(/^0+/, "");
  },
  // Delayed warning, f = condition lambda fn
  warn(f, text2, delay = 0) {
    setTimeout(() => {
      if (f())
        console.warn(text2);
    }, delay);
  },
  // Checks if script props updated
  // (and not style settings or something else)
  /*isScrPropsUpd(n, prev) {
          let p = prev.find(x => x.v.$uuid === n.v.$uuid)
          if (!p) return false
  
          let props = n.p.settings.$props
          if (!props) return false
  
          return props.some(x => n.v[x] !== p.v[x])
      },*/
  // Checks if it's time to make a script update
  // (based on execInterval in ms)
  delayedExec(v) {
    if (!v.script || !v.script.execInterval)
      return true;
    let t = this.now();
    let dt = v.script.execInterval;
    if (!v.settings.$last_exec || t > v.settings.$last_exec + dt) {
      v.settings.$last_exec = t;
      return true;
    }
    return false;
  },
  // Format names such 'RSI, $length', where
  // length - is one of the settings
  formatName(ov) {
    if (!ov.name)
      return void 0;
    let name = ov.name;
    for (var k in ov.settings || {}) {
      let val = ov.settings[k];
      let reg = new RegExp(`\\$${k}`, "g");
      name = name.replace(reg, val);
    }
    return name;
  },
  // Default cursor mode
  xMode() {
    return this.is_mobile ? "explore" : "default";
  },
  defaultPrevented(event) {
    if (event.original) {
      return event.original.defaultPrevented;
    }
    return event.defaultPrevented;
  },
  // Get a view from the data by the name
  /*view(data, name) {
      if (!data.views) return data
      let v = data.views.find(x => x.name === name)
      if (!v) return data
      return v.data
  },*/
  /*concatArrays(arrays) {
      var acc = []
      for (var a of arrays) {
          acc = acc.concat(a)
      }
      return acc
  },*/
  // Call
  afterAll(object, f, time) {
    clearTimeout(object.__afterAllId__);
    object.__afterAllId__ = setTimeout(() => f(), time);
  },
  // Default auto-precision sampler for a generic
  // timeseries-element: [time, x1, x2, x3, ...]
  defaultPreSampler(el) {
    if (!el)
      return [];
    let out = [];
    for (var i = 1; i < el.length; i++) {
      if (typeof el[i] === "number") {
        out.push(el[i]);
      }
    }
    return out;
  },
  // Get scales by side id (0 - left, 1 - right)
  getScalesBySide(side, layout) {
    if (!layout)
      return [];
    let template = layout.settings.scaleTemplate;
    return template[side].map((id) => layout.scales[id]).filter((x) => x);
  },
  // If scaleTemplate is changed there could be a
  // situation when user forget to reset scaleSideIdxs.
  // Here we attemp to get them in sync
  autoScaleSideId(S, sides, idxs) {
    if (sides[S].length) {
      if (!idxs[S] || !sides[S].includes(idxs[S])) {
        idxs[S] = sides[S][0];
      }
    } else {
      idxs[S] = void 0;
    }
  },
  // Debug function, shows how many times
  // this method is called per second
  callsPerSecond() {
    if (window.__counter__ === void 0) {
      window.__counter__ = 0;
    }
    window.__counter__++;
    if (window.__cpsId__)
      return;
    window.__cpsId__ = setTimeout(() => {
      console.log(window.__counter__, "upd/sec");
      window.__counter__ = 0;
      window.__cpsId__ = null;
    }, 1e3);
  },
  // Calculate an index offset for a timeseries
  // against the main ts. (for indexBased mode)
  findIndexOffset(mainTs, ts) {
    let set1 = {};
    let set2 = {};
    for (var i = 0; i < mainTs.length; i++) {
      set1[mainTs[i][0]] = i;
    }
    for (var i = 0; i < ts.length; i++) {
      set2[ts[i][0]] = i;
    }
    let deltas = [];
    for (var t in set2) {
      if (set1[t] !== void 0) {
        let d = set1[t] - set2[t];
        if (!deltas.length || deltas[0] === d) {
          deltas.unshift(d);
        }
        if (deltas.length === 3) {
          return deltas.pop();
        }
      }
    }
    return 0;
  },
  // Format cash values
  formatCash(n) {
    if (n == void 0)
      return "x";
    if (typeof n !== "number")
      return n;
    if (n < 1e3)
      return n.toFixed(0);
    if (n >= 1e3 && n < 1e6)
      return +(n / 1e3).toFixed(2) + "K";
    if (n >= 1e6 && n < 1e9)
      return +(n / 1e6).toFixed(2) + "M";
    if (n >= 1e9 && n < 1e12)
      return +(n / 1e9).toFixed(2) + "B";
    if (n >= 1e12)
      return +(n / 1e12).toFixed(2) + "T";
  },
  // Time range of a data subset (from i0 to iN-1)
  realTimeRange(data) {
    if (!data.length)
      return 0;
    return data[data.length - 1][0] - data[0][0];
  },
  // Get sizes left and right parts of a number
  // (11.22 -> ['11', '22'])
  numberLR(x) {
    var str = x != null ? x.toString() : "";
    if (x < 1e-6) {
      var [ls, rs] = str.split("e-");
      var [l, r] = ls.split(".");
      if (!r)
        r = "";
      r = { length: r.length + parseInt(rs) || 0 };
    } else {
      var [l, r] = str.split(".");
    }
    return [l.length, r ? r.length : 0];
  },
  // Get a hash of current overlay disposition:
  // pane1.uuid+ov1.type+ov2.type+...+pane2.uuid+...
  ovDispositionHash(panes) {
    let h = "";
    for (var pane of panes) {
      h += pane.uuid;
      for (var ov of pane.overlays) {
        if (ov.main)
          continue;
        h += ov.type;
      }
    }
    return h;
  },
  // Format cursor event for the '$cursor-update' hook
  // TODO: doesn't work for renko
  makeCursorEvent($cursor, cursor, layout) {
    $cursor.values = cursor.values;
    $cursor.ti = cursor.ti;
    $cursor.time = cursor.time;
    $cursor.ohlcCoord = () => {
      let ohlc = layout.main.ohlc(cursor.time);
      return ohlc ? {
        x: layout.main.time2x(cursor.ti),
        ys: ohlc.map((x) => layout.main.value2y(x))
      } : null;
    };
    return $cursor;
  },
  // Adjust mouse coords to fix the shift caused by 
  // css transforms
  adjustMouse(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const adjustedX = event.clientX - rect.left;
    const adjustedY = event.clientY - rect.top;
    return new Proxy(event, {
      get(target, prop) {
        if (prop === "layerX") {
          return adjustedX;
        } else if (prop === "layerY") {
          return adjustedY;
        }
        if (typeof target[prop] === "function") {
          return target[prop].bind(target);
        }
        return target[prop];
      }
    });
  },
  // GPT to the moon!
  getCandleTime(tf) {
    const HOUR2 = 60 * 60 * 1e3;
    const time = (/* @__PURE__ */ new Date()).getTime();
    const now2 = new Date(time), h = now2.getHours(), m = now2.getMinutes(), s = now2.getSeconds(), Mo = now2.getMonth(), D = now2.getDay(), Y = now2.getFullYear();
    let rt;
    switch (tf) {
      case MINUTE$1:
        rt = 60 - s;
        return `00:${rt < 10 ? "0" : ""}${rt}`;
      case MINUTE2:
        rt = 2 * 60 - m % 2 * 60 - s;
        return `${Math.floor(rt / 60)}:${rt % 60 < 10 ? "0" : ""}${rt % 60}`;
      case MINUTE5:
        rt = 5 * 60 - m % 5 * 60 - s;
        return `${Math.floor(rt / 60)}:${rt % 60 < 10 ? "0" : ""}${rt % 60}`;
      case MINUTE15$1:
        rt = 15 * 60 - m % 15 * 60 - s;
        return `${Math.floor(rt / 60)}:${rt % 60 < 10 ? "0" : ""}${rt % 60}`;
      case MINUTE30:
        rt = 30 * 60 - m % 30 * 60 - s;
        return `${Math.floor(rt / 60)}:${rt % 60 < 10 ? "0" : ""}${rt % 60}`;
      case HOUR2:
        rt = 60 * 60 - m * 60 - s;
        return `${(Math.floor(rt % 3600 / 60) + "").padStart(2, "0")}:${(rt % 60 + "").padStart(2, "0")}`;
      case HOUR4: {
        rt = 4 * 60 * 60 - h % 4 * 3600 - m * 60 - s;
        const hours = Math.floor(rt / 3600);
        const minutes = Math.floor(rt % 3600 / 60);
        if (hours === 0) {
          return `${minutes}:${(rt % 60 + "").padStart(2, "0")}`;
        } else {
          return `${hours}:${(minutes + "").padStart(2, "0")}:${(rt % 60 + "").padStart(2, "0")}`;
        }
      }
      case HOUR12: {
        rt = 12 * 60 * 60 - h % 12 * 3600 - m * 60 - s;
        const hours = Math.floor(rt / 3600);
        const minutes = Math.floor(rt % 3600 / 60);
        if (hours === 0) {
          return `${minutes}:${(rt % 60 + "").padStart(2, "0")}`;
        } else {
          return `${hours}:${(minutes + "").padStart(2, "0")}:${(rt % 60 + "").padStart(2, "0")}`;
        }
      }
      case DAY$2:
        rt = 24 * 60 * 60 - h * 3600 - m * 60 - s;
        return `${Math.floor(rt / 3600)}:${(Math.floor(rt % 3600 / 60) + "").padStart(2, "0")}:${(rt % 60 + "").padStart(2, "0")}`;
      case WEEK$2:
        rt = 7 * 24 * 60 * 60 - (D || 7) * 24 * 60 * 60 - h * 3600 - m * 60 - s;
        return `${Math.floor(rt / (24 * 3600))}d ${Math.floor(rt % (24 * 3600) / 3600)}h`;
      case MONTH$2:
        const endOfMonth = new Date(Date.UTC(now2.getUTCFullYear(), Mo + 1, 1));
        rt = (endOfMonth - now2) / 1e3;
        return `${Math.floor(rt / (24 * 3600))}d ${Math.floor(rt % (24 * 3600) / 3600)}h`;
      case YEAR$2:
        const startOfYear = new Date(Date.UTC(Y, 0, 1));
        const endOfYear = new Date(Date.UTC(Y + 1, 0, 1));
        const totalSecondsInYear = (endOfYear - startOfYear) / 1e3;
        rt = totalSecondsInYear - (now2 - startOfYear) / 1e3;
        return `${Math.floor(rt / (24 * 3600))}d ${Math.floor(rt % (24 * 3600) / 3600)}h`;
      default:
        return "Unk TF";
    }
  },
  // WTF with modern web development
  isMobile: ((w) => "onorientationchange" in w && (!!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints || ("ontouchstart" in w || w.DocumentTouch && document instanceof w.DocumentTouch)))(typeof window !== "undefined" ? window : {})
};
const math = {
  // Distance from point to line
  // p1 = point, (p2, p3) = line
  point2line(p1, p2, p3) {
    let { area: area2, base } = this.tri(p1, p2, p3);
    return Math.abs(this.tri_h(area2, base));
  },
  // Distance from point to segment
  // p1 = point, (p2, p3) = segment
  point2seg(p1, p2, p3) {
    let { area: area2, base } = this.tri(p1, p2, p3);
    let proj = this.dot_prod(p1, p2, p3) / base;
    let l1 = Math.max(-proj, 0);
    let l2 = Math.max(proj - base, 0);
    let h = Math.abs(this.tri_h(area2, base));
    return Math.max(h, l1, l2);
  },
  // Distance from point to ray
  // p1 = point, (p2, p3) = ray
  point2ray(p1, p2, p3) {
    let { area: area2, base } = this.tri(p1, p2, p3);
    let proj = this.dot_prod(p1, p2, p3) / base;
    let l1 = Math.max(-proj, 0);
    let h = Math.abs(this.tri_h(area2, base));
    return Math.max(h, l1);
  },
  tri(p1, p2, p3) {
    let area2 = this.area(p1, p2, p3);
    let dx = p3[0] - p2[0];
    let dy = p3[1] - p2[1];
    let base = Math.sqrt(dx * dx + dy * dy);
    return { area: area2, base };
  },
  /* Area of triangle:
          p1
        /    \
      p2  _  p3
  */
  area(p1, p2, p3) {
    return p1[0] * (p2[1] - p3[1]) + p2[0] * (p3[1] - p1[1]) + p3[0] * (p1[1] - p2[1]);
  },
  // Triangle height
  tri_h(area2, base) {
    return area2 / base;
  },
  // Dot product of (p2, p3) and (p2, p1)
  dot_prod(p1, p2, p3) {
    let v1 = [p3[0] - p2[0], p3[1] - p2[1]];
    let v2 = [p1[0] - p2[0], p1[1] - p2[1]];
    return v1[0] * v2[0] + v1[1] * v2[1];
  },
  // Symmetrical log
  log(x) {
    return Math.sign(x) * Math.log(Math.abs(x) + 1);
  },
  // Symmetrical exp
  exp(x) {
    return Math.sign(x) * (Math.exp(Math.abs(x)) - 1);
  },
  // Middle line on log scale based on range & px height
  log_mid(r, h) {
    let log_hi = this.log(r[0]);
    let log_lo = this.log(r[1]);
    let px = h / 2;
    let gx = log_hi - px * (log_hi - log_lo) / h;
    return this.exp(gx);
  },
  // Return new adjusted range, based on the previous
  // range, new $hi, target middle line
  re_range(r1, hi2, mid) {
    let log_hi1 = this.log(r1[0]);
    let log_lo1 = this.log(r1[1]);
    let log_hi2 = this.log(hi2);
    let log_$ = this.log(mid);
    let W = (log_hi2 - log_$) * (log_hi1 - log_lo1) / (log_hi1 - log_$);
    return this.exp(log_hi2 - W);
  }
  // Return new adjusted range, based on the previous
  // range, new $hi, target middle line + dy (shift)
  // WASTE
  /*range_shift(r1, hi2, mid, dy, h) {
          let log_hi1 = this.log(r1[0])
          let log_lo1 = this.log(r1[1])
          let log_hi2 = this.log(hi2)
          let log_$ = this.log(mid)
  
          let W = h * (log_hi2 - log_$) /
                  (h * (log_hi1 - log_$) / (log_hi1 - log_lo1) + dy)
  
          return this.exp(log_hi2 - W)
  
      }*/
};
class Cursor {
  constructor(meta) {
    this.meta = meta;
  }
  xSync(hub, layout, props, update2) {
    if (update2.visible === false) {
      this.hide();
      return this;
    }
    let prevT = this.ti;
    let prevV = this.vi;
    Object.assign(this, update2);
    let start = layout.main.startx;
    let step = layout.main.pxStep;
    this.yValues(layout);
    if (this.locked && !this.meta.scrollLock) {
      this.x = layout.main.time2x(prevT);
      this.y = layout.main.value2y(prevV);
      return this;
    }
    this.x = Math.round((this.x - start) / step) * step + start;
    this.x = Math.floor(this.x - 1) + 0.5;
    return this.xValues(hub, layout, props);
  }
  // Get nearest data values
  xValues(hub, layout, props) {
    if (!this.locked || this.meta.scrollLock) {
      this.ti = layout.main.x2ti(this.x);
      this.vi = layout.main.y2value(this.y);
    }
    let values = [];
    let vi;
    for (var pane of hub.panes()) {
      let arr = [];
      for (var i = 0; i < pane.overlays.length; i++) {
        let ov = pane.overlays[i];
        if (!layout.indexBased) {
          vi = Utils.nearestTs(this.ti, ov.dataSubset) || [];
        } else {
          let off = ov.indexOffset;
          vi = Utils.nearestTsIb(this.ti, ov.data, off) || [];
        }
        if (ov.main) {
          this.time = vi[1] ? vi[1][0] : void 0;
        }
        arr.push(vi[1]);
      }
      values.push(arr);
    }
    this.values = values;
    this.quantizeTime(hub, layout, props);
    return this;
  }
  // Calculate y-values for each scale
  yValues(layout) {
    let gridId = this.gridId;
    if (!layout.grids[gridId])
      return;
    this.scales = {};
    let grid = layout.grids[gridId];
    for (var scale of Object.values(grid.scales)) {
      let $ = this.y2value(this.y, scale);
      this.scales[scale.scaleSpecs.id] = $;
    }
  }
  // Quantize time (by interval)
  quantizeTime(hub, layout, props) {
    let id = hub.chart.id;
    let ovId = hub.mainOv.id;
    if (!this.values || !this.values[id])
      return;
    let v = this.values[id][ovId];
    if (!v)
      return;
    let r = Math.abs((v[0] - this.ti) / props.interval);
    if (r >= 0.5) {
      let n = Math.round(this.ti / props.interval);
      this.ti = n * props.interval;
    } else {
      this.ti = v[0];
    }
    if (!layout.indexBased) {
      this.time = this.ti;
    }
  }
  // Copy of the same function from layoutFn.js
  y2value(y, scale) {
    let ls = scale.scaleSpecs.log;
    if (ls)
      return math.exp((y - scale.B) / scale.A);
    return (y - scale.B) / scale.A;
  }
  getValue(paneId, ovId) {
    if (!this.values)
      return void 0;
    let paneValues = this.values[paneId] || [];
    return paneValues[ovId];
  }
  hide() {
    this.visible = false;
    delete this.scales;
    delete this.x;
    delete this.y;
    if (!this.locked)
      delete this.ti;
  }
}
class Events {
  // TODO: add component call priority (think)
  // TODO: build event inspector (think)
  constructor() {
    this.handlers = {};
  }
  // Immediately calls all handlers with the
  // specified type (there can be only one
  // listener of this type per each component)
  emit(type, obj) {
    let components = this.handlers[type];
    if (!components)
      return;
    for (var name in components) {
      components[name](obj);
    }
  }
  // Component-specific update
  emitSpec(comp, type, obj) {
    let components = this.handlers[type];
    if (!components)
      return;
    if (!components[comp])
      return;
    components[comp](obj);
  }
  // TODO: imlement more specific emitter, e.g.
  // emitRegex() which uses RegEx to match
  // components
  // Add event listener to a specific component:
  // '<component>:<event-type>'
  on(compAndType, f) {
    let [comp, type] = compAndType.split(":");
    if (!this.handlers[type]) {
      this.handlers[type] = {};
    }
    this.handlers[type][comp] = f;
  }
  // Remove event listeners / one listener
  off(comp, type = null) {
    if (type && this.handlers[type]) {
      delete this.handlers[type][comp];
      return;
    }
    for (var type in this.handlers) {
      delete this.handlers[type][comp];
    }
  }
}
let instances$6 = {};
function instance$j(id) {
  if (!instances$6[id]) {
    instances$6[id] = new Events(id);
  }
  return instances$6[id];
}
const Events$1 = { instance: instance$j };
class SeClient {
  constructor(id, chart) {
    this.chart = chart;
    this.ww = chart.ww;
    this.ww.onevent = this.onEvent.bind(this);
  }
  setRefs(hub, scan) {
    this.hub = hub;
    this.scan = scan;
  }
  // Listen to the events from web-worker
  onEvent(e) {
    switch (e.data.type) {
      case "overlay-data":
        this.onOverlayData(e.data.data);
      case "engine-state":
        this.onEngineState(e.data.data);
        break;
    }
  }
  // Upload initial data
  async uploadData() {
    if (!this.hub.mainOv)
      return;
    await this.ww.exec("upload-data", {
      meta: {
        range: this.chart.range,
        tf: this.scan.tf
      },
      dss: {
        // TODO: 'cv' data key for [close, vol] chart
        ohlcv: this.hub.mainOv.data
      }
    });
  }
  // Update data (when new live data arrives)
  // TODO: autoscroll
  async updateData() {
    let ohlcv = this.hub.mainOv.data;
    let data = await this.ww.exec("update-data", {
      // Send the last two candles
      ohlcv: ohlcv.slice(-2)
    });
    let unshift = false;
    for (var ov of this.hub.allOverlays()) {
      if (data[ov.uuid]) {
        let last = ov.data[ov.data.length - 1];
        let nw = data[ov.uuid];
        if (!last || nw[0] > last[0]) {
          ov.data.push(nw);
          unshift = true;
        } else if (nw[0] === last[0]) {
          ov.data[ov.data.length - 1] = nw;
        }
      }
    }
    if (unshift) {
      this.chart.update("data");
    } else {
      this.chart.update();
    }
  }
  async execScripts() {
    let list = this.hub.panes().map((x) => ({
      id: x.id,
      uuid: x.uuid,
      scripts: x.scripts
    }));
    await this.ww.exec("exec-all-scripts", list);
  }
  async uploadAndExec() {
    await this.uploadData();
    await this.execScripts();
  }
  // Remove all overlays produced by scripts & add new
  replaceOverlays(data) {
    for (var pane of this.hub.panes()) {
      pane.overlays = pane.overlays.filter((x) => !x.prod);
      let p = data.find((x) => x.uuid === pane.uuid);
      if (p && p.overlays) {
        pane.overlays.push(...p.overlays);
      }
    }
    this.chart.update();
  }
  // Opdate data of overlays produced by scripts
  updateOverlays(data) {
    for (var pane of this.hub.panes()) {
      let p = data.find((x) => x.uuid === pane.uuid);
      if (p && p.overlays) {
        let ovs = pane.overlays.filter((x) => x.prod);
        for (var i = 0; i < ovs.length; i++) {
          let dst = ovs[i];
          let src = p.overlays[i];
          if (dst && src) {
            dst.name = src.name;
            dst.data = src.data;
            dst.uuid = src.uuid;
          }
        }
      }
    }
    this.chart.update("data", { updateHash: true });
  }
  // Event handlers
  onOverlayData(data) {
    let h1 = Utils.ovDispositionHash(this.hub.panes());
    let h2 = Utils.ovDispositionHash(data);
    if (h1 === h2) {
      this.updateOverlays(data);
    } else {
      this.replaceOverlays(data);
    }
  }
  onEngineState(data) {
    this.state = Object.assign(this.state || {}, data);
  }
}
let instances$5 = {};
function instance$i(id, chart) {
  if (!instances$5[id]) {
    instances$5[id] = new SeClient(id, chart);
  }
  return instances$5[id];
}
const SeClient$1 = { instance: instance$i };
class DataView$ {
  constructor(src, i1, i2) {
    this.src = src;
    this.i1 = Math.max(0, i1 - 1);
    this.i2 = Math.min(i2, src.length - 1);
    this.length = this.i2 - this.i1 + 1;
  }
  makeSubset() {
    return this.src.slice(
      this.i1,
      this.i2 + 1
    );
  }
}
class DataHub {
  constructor(nvId) {
    let events = Events$1.instance(nvId);
    let se = SeClient$1.instance(nvId);
    this.events = events;
    this.se = se;
    se.hub = this;
    events.on("hub:set-scale-index", this.onScaleIndex.bind(this));
    events.on("hub:display-overlay", this.onDisplayOv.bind(this));
  }
  init(data) {
    var _a;
    this.data = data;
    this.indexBased = (_a = data.indexBased) != null ? _a : false;
    this.chart = null;
    this.offchart = null;
    this.mainOv = null;
    this.mainPaneId = null;
  }
  // Update data on 'range-changed'. Should apply
  // filters only (not updating the full structure)
  updateRange(range) {
    for (var pane of this.data.panes) {
      for (var ov of pane.overlays) {
        let off = ov.indexOffset;
        ov.dataView = this.filter(ov.data, range, off);
        ov.dataSubset = ov.dataView.makeSubset();
      }
    }
  }
  // Calculate visible data section
  // (& completes the main structure)
  // TODO: smarter algo of adding/removing panes. Uuids
  // should remain the same if pane still exists
  calcSubset(range) {
    var paneId = 0;
    for (var pane of this.data.panes || []) {
      pane.id = paneId++;
      pane.overlays = pane.overlays || [];
      pane.settings = pane.settings || {};
      var ovId = 0;
      for (var ov of pane.overlays) {
        ov.id = ovId++;
        ov.main = !!ov.main;
        ov.data = ov.data || [];
        ov.dataView = this.filter(
          ov.data,
          range,
          ov.indexOffset
        );
        ov.dataSubset = ov.dataView.makeSubset();
        ov.dataExt = ov.dataExt || {};
        ov.settings = ov.settings || {};
        ov.props = ov.props || {};
        ov.uuid = ov.uuid || Utils.uuid3();
      }
      pane.uuid = pane.uuid || Utils.uuid3();
    }
  }
  // Load indicator scripts
  async loadScripts(exec = false) {
    for (var pane of this.data.panes || []) {
      var scriptId = 0;
      pane.scripts = pane.scripts || [];
      for (var s of pane.scripts) {
        s.id = scriptId++;
        s.settings = s.settings || {};
        s.props = s.props || {};
        s.uuid = s.uuid || Utils.uuid3();
      }
    }
    if (exec) {
      await Utils.pause(0);
      await this.se.uploadAndExec();
    }
  }
  // Detect the main chart, define offcharts
  detectMain() {
    let all = Utils.allOverlays(this.data.panes);
    let mainOv = all.find((x) => x.main) || all[0];
    if (!all.length || !mainOv)
      return;
    mainOv.main = true;
    this.chart = this.data.panes.find(
      (x) => x.overlays.find(
        (y) => y.main
      )
    );
    this.offchart = this.data.panes.filter(
      (x) => x !== this.chart
    );
    this.mainOv = mainOv;
    this.mainPaneId = this.panes().indexOf(this.chart);
    for (var ov of all) {
      if (ov !== mainOv)
        ov.main = false;
    }
  }
  // [API] Create a subset of timeseries
  filter(data, range, offset = 0) {
    let filter = this.indexBased ? Utils.fastFilterIB : Utils.fastFilter2;
    var ix = filter(
      data,
      range[0] - offset,
      range[1] - offset
    );
    return new DataView$(data, ix[0], ix[1]);
  }
  // [API] Get all active panes (with uuid)
  panes() {
    return (this.data.panes || []).filter((x) => x.uuid);
  }
  // [API] Get overlay ref by paneId & ovId
  overlay(paneId, ovId) {
    var _a;
    return (_a = this.panes()[paneId]) == null ? void 0 : _a.overlays[ovId];
  }
  // [API] Get overlay data by paneId & ovId
  ovData(paneId, ovId) {
    var _a, _b;
    return (_b = (_a = this.panes()[paneId]) == null ? void 0 : _a.overlays[ovId]) == null ? void 0 : _b.data;
  }
  // [API] Get overlay extra data by paneId & ovId
  ovDataExt(paneId, ovId) {
    var _a, _b;
    return (_b = (_a = this.panes()[paneId]) == null ? void 0 : _a.overlays[ovId]) == null ? void 0 : _b.dataExt;
  }
  // [API] Get overlay data subset by paneId & ovId
  ovDataSubset(paneId, ovId) {
    var _a, _b;
    return (_b = (_a = this.panes()[paneId]) == null ? void 0 : _a.overlays[ovId]) == null ? void 0 : _b.dataSubset;
  }
  // [API] Get All overlays
  allOverlays(type) {
    let all = Utils.allOverlays(this.data.panes);
    return type ? all.filter((x) => x.type === type) : all;
  }
  // Event handlers
  onScaleIndex(event) {
    let pane = this.panes()[event.paneId];
    if (!pane)
      return;
    pane.settings.scaleIndex = event.index;
    pane.settings.scaleSideIdxs = event.sideIdxs;
    this.events.emitSpec("chart", "update-layout");
  }
  onDisplayOv(event) {
    let pane = this.panes()[event.paneId];
    if (!pane)
      return;
    let ov = pane.overlays[event.ovId];
    if (!ov)
      return;
    ov.settings.display = event.flag;
    let llId = `${event.paneId}-${event.ovId}`;
    this.events.emitSpec("chart", "update-layout");
    this.events.emitSpec(`ll-${llId}`, "update-ll");
  }
}
let instances$4 = {};
function instance$h(id) {
  if (!instances$4[id]) {
    instances$4[id] = new DataHub(id);
  }
  return instances$4[id];
}
const DataHub$1 = { instance: instance$h };
class MetaHub {
  constructor(nvId) {
    let events = Events$1.instance(nvId);
    this.hub = DataHub$1.instance(nvId);
    this.events = events;
    events.on("meta:sidebar-transform", this.onYTransform.bind(this));
    events.on("meta:select-overlay", this.onOverlaySelect.bind(this));
    events.on("meta:grid-mousedown", this.onGridMousedown.bind(this));
    events.on("meta:scroll-lock", this.onScrollLock.bind(this));
    this.storage = {};
  }
  init(props) {
    this.panes = 0;
    this.ready = false;
    this.legendFns = [];
    this.yTransforms = [];
    this.preSamplers = [];
    this.yRangeFns = [];
    this.autoPrecisions = [];
    this.valueTrackers = [];
    this.selectedOverlay = void 0;
    this.ohlcMap = [];
    this.ohlcFn = void 0;
    this.scrollLock = false;
  }
  // Extract meta functions from overlay
  exctractFrom(overlay) {
    var _a;
    let gridId = overlay.gridId();
    let id = overlay.id();
    var yrfs = this.yRangeFns[gridId] || [];
    yrfs[id] = overlay.yRange ? {
      exec: overlay.yRange,
      preCalc: overlay.yRangePreCalc
    } : null;
    var aps = this.preSamplers[gridId] || [];
    aps[id] = overlay.preSampler;
    var lfs = this.legendFns[gridId] || [];
    lfs[id] = {
      legend: overlay.legend,
      legendHtml: overlay.legendHtml,
      noLegend: (_a = overlay.noLegend) != null ? _a : false
    };
    var vts = this.valueTrackers[gridId] || [];
    vts[id] = overlay.valueTracker;
    let main = this.hub.overlay(gridId, id).main;
    if (main) {
      this.ohlcFn = overlay.ohlc;
    }
    this.yRangeFns[gridId] = yrfs;
    this.preSamplers[gridId] = aps;
    this.legendFns[gridId] = lfs;
    this.valueTrackers[gridId] = vts;
  }
  // Maps timestamp => ohlc, index
  // TODO: should add support for indexBased? 
  calcOhlcMap() {
    this.ohlcMap = {};
    let data = this.hub.mainOv.data;
    for (var i = 0; i < data.length; i++) {
      this.ohlcMap[data[i][0]] = {
        ref: data[i],
        index: i
      };
    }
  }
  // Store auto precision for a specific overlay
  setAutoPrec(gridId, ovId, prec) {
    let aps = this.autoPrecisions[gridId] || [];
    aps[ovId] = prec;
    this.autoPrecisions[gridId] = aps;
  }
  // Call this after all overlays are processed
  // We need to make an update to apply freshly
  // extracted functions
  // TODO: probably can do better
  finish() {
    this.panes++;
    if (this.panes < this.hub.panes().length)
      return;
    this.autoPrecisions = [];
    this.calcOhlcMap();
    this.ready = true;
    setTimeout(() => {
      this.events.emitSpec("chart", "update-layout");
      this.events.emit("update-legend");
    });
  }
  // Store some meta info such as ytransform by
  // (pane.uuid + scaleId) hash
  store() {
    this.storage = {};
    let yts = this.yTransforms || [];
    for (var paneId in yts) {
      let paneYts = yts[paneId];
      let pane = this.hub.panes()[paneId];
      if (!pane)
        continue;
      for (var scaleId in paneYts) {
        let hash2 = `yts:${pane.uuid}:${scaleId}`;
        this.storage[hash2] = paneYts[scaleId];
      }
    }
  }
  // Restore that info after an update in the
  // pane/overlay order
  restore() {
    let yts = this.yTransforms;
    for (var hash2 in this.storage) {
      let [type, uuid1, uuid2] = hash2.split(":");
      let pane = this.hub.panes().find((x) => x.uuid === uuid1);
      if (!pane)
        continue;
      switch (type) {
        case "yts":
          if (!yts[pane.id])
            yts[pane.id] = [];
          yts[pane.id][uuid2] = this.storage[hash2];
          break;
      }
    }
    this.store();
  }
  // [API] Get y-transform of a specific scale
  getYtransform(gridId, scaleId) {
    return (this.yTransforms[gridId] || [])[scaleId];
  }
  // [API] Get auto precision of a specific overlay
  getAutoPrec(gridId, ovId) {
    return (this.autoPrecisions[gridId] || [])[ovId];
  }
  // [API] Get a precision smapler of a specific overlay
  getPreSampler(gridId, ovId) {
    return (this.preSamplers[gridId] || [])[ovId];
  }
  // [API] Get legend formatter of a specific overlay
  getLegendFns(gridId, ovId) {
    return (this.legendFns[gridId] || [])[ovId];
  }
  // [API] Get OHLC values to use as "magnet" values
  ohlc(t) {
    let el = this.ohlcMap[t];
    if (!el || !this.ohlcFn)
      return;
    return this.ohlcFn(el.ref);
  }
  // EVENT HANDLERS
  // User changed y-range
  onYTransform(event) {
    let yts = this.yTransforms[event.gridId] || {};
    let tx = yts[event.scaleId] || {};
    yts[event.scaleId] = Object.assign(tx, event);
    this.yTransforms[event.gridId] = yts;
    if (event.updateLayout) {
      this.events.emitSpec("chart", "update-layout");
    }
    this.store();
  }
  // User tapped legend & selected the overlay
  onOverlaySelect(event) {
    this.selectedOverlay = event.index;
    this.events.emit("$overlay-select", {
      index: event.index,
      ov: this.hub.overlay(...event.index)
    });
  }
  // User tapped grid (& deselected all overlays)
  onGridMousedown(event) {
    this.selectedOverlay = void 0;
    this.events.emit("$overlay-select", {
      index: void 0,
      ov: void 0
    });
  }
  // Overlay/user set lock on scrolling
  onScrollLock(event) {
    this.scrollLock = event;
  }
}
let instances$3 = {};
function instance$g(id) {
  if (!instances$3[id]) {
    instances$3[id] = new MetaHub(id);
  }
  return instances$3[id];
}
const MetaHub$1 = { instance: instance$g };
class DataScanner {
  constructor() {
  }
  init(props) {
    this.props = props;
    this.hub = DataHub$1.instance(props.id);
  }
  detectInterval() {
    this.all = Utils.allOverlays(this.hub.data.panes);
    if (this.all.filter((x) => x.main).length > 1) {
      console.warn(
        `Two or more overlays with flagged as 'main'`
      );
    }
    let mainOv = this.all.find((x) => x.main) || this.all[0];
    mainOv = mainOv || {};
    this.main = mainOv.data || [];
    let userTf = (mainOv.settings || {}).timeFrame;
    if (userTf !== void 0) {
      this.tf = Utils.parseTf(userTf);
    } else {
      this.tf = Utils.detectTimeframe(this.main);
    }
    this.interval = this.hub.data.indexBased ? 1 : this.tf;
    this.ibMode = this.hub.data.indexBased;
    return this.interval;
  }
  getTimeframe() {
    return this.tf;
  }
  // [API] Range that shown on a chart startup
  defaultRange() {
    const dl = this.props.config.DEFAULT_LEN;
    const ml = this.props.config.MINIMUM_LEN + 0.5;
    const l = this.main.length - 1;
    if (this.main.length < 2)
      return [];
    if (this.main.length <= dl) {
      var s = 0, d = ml;
    } else {
      s = l - dl, d = 0.5;
    }
    if (!this.hub.data.indexBased) {
      return [
        this.main[s][0] - this.interval * d,
        this.main[l][0] + this.interval * ml
      ];
    } else {
      return [
        s - this.interval * d,
        l + this.interval * ml
      ];
    }
  }
  // Calculate index offsets to adjust non-main ovs
  calcIndexOffsets() {
    var _a, _b;
    if (!this.hub.data.indexBased)
      return;
    for (var ov of this.all) {
      if (ov.data === this.main) {
        ov.indexOffset = (_a = ov.indexOffset) != null ? _a : 0;
        continue;
      }
      let d = Utils.findIndexOffset(this.main, ov.data);
      ov.indexOffset = (_b = ov.indexOffset) != null ? _b : d;
    }
  }
  // Calculte hash of the current panes
  calcPanesHash() {
    let hash2 = "";
    for (var pane of this.hub.data.panes || []) {
      hash2 += pane.uuid;
      for (var ov of pane.overlays || []) {
        hash2 += ov.uuid;
      }
    }
    return hash2;
  }
  // Detect changes in pane order/collection
  panesChanged() {
    let hash2 = this.calcPanesHash();
    return hash2 !== this.panesHash;
  }
  updatePanesHash() {
    this.panesHash = this.calcPanesHash();
  }
}
let instances$2 = {};
function instance$f(id) {
  if (!instances$2[id]) {
    instances$2[id] = new DataScanner(id);
  }
  return instances$2[id];
}
const DataScan = { instance: instance$f };
const HPX$7 = Const.HPX;
function layoutFn(self, range, overlay = null) {
  var _a;
  const dt = range[1] - range[0];
  const r = self.spacex / dt;
  const ls = (self.scaleSpecs || {}).log || false;
  const offset = (_a = overlay ? overlay.indexOffset : 0) != null ? _a : 0;
  Object.assign(self, {
    // Time and global index to screen x-coordinate
    // (universal mapping that works both in timeBased
    // & indexBased modes):
    // Time-index switch (returns time or index depending on the mode)
    ti: (t, i) => {
      return self.indexBased ? i : t;
    },
    // Time-or-index to screen x-coordinate
    ti2x: (t, i) => {
      let src = self.indexBased ? i + offset : t;
      return Math.floor((src - range[0]) * r) + HPX$7;
    },
    // Time to screen x-coordinates
    time2x: (t) => {
      return Math.floor((t - range[0]) * r) + HPX$7;
    },
    // Price/value to screen y-coordinates
    value2y: (y) => {
      if (ls)
        y = math.log(y);
      return Math.floor(y * self.A + self.B) + HPX$7;
    },
    // Time-axis nearest step
    tMagnet: (t) => {
    },
    // Screen-Y to dollar value (or whatever)
    y2value: (y) => {
      if (ls)
        return math.exp((y - self.B) / self.A);
      return (y - self.B) / self.A;
    },
    // Screen-X to timestamp
    x2time: (x) => {
      return range[0] + x / r;
    },
    // Screen-X to time-index
    x2ti: (x) => {
      return range[0] + x / r;
    },
    // $-axis nearest step
    $magnet: (price) => {
    },
    // Nearest candlestick
    cMagnet: (t) => {
      const cn = self.candles || self.master_grid.candles;
      const arr = cn.map((x) => x.raw[0]);
      const i = Utils.nearestA(t, arr)[0];
      return cn[i];
    },
    // Nearest data points
    dataMagnet: (t) => {
    }
  });
  return self;
}
const logScale = {
  candle(self, mid, p, $p) {
    return {
      x: mid,
      w: self.pxStep * $p.config.CANDLEW,
      o: Math.floor(math.log(p[1]) * self.A + self.B),
      h: Math.floor(math.log(p[2]) * self.A + self.B),
      l: Math.floor(math.log(p[3]) * self.A + self.B),
      c: Math.floor(math.log(p[4]) * self.A + self.B),
      raw: p
    };
  },
  expand(self, height) {
    let A = -height / (math.log(self.$hi) - math.log(self.$lo));
    let B = -math.log(self.$hi) * A;
    let top = -height * 0.1;
    let bot = height * 1.1;
    self.$hi = math.exp((top - B) / A);
    self.$lo = math.exp((bot - B) / A);
  }
};
const AppleArea = `\r
// NavyJS ~ 0.2-lite\r
\r
// <ds>Area chart, like in MacOS Stocks app </ds>\r
// format: [<timestamp>, <value>]\r
\r
[OVERLAY name=AppleArea, ctx=Canvas, version=1.0.0]\r
\r
// Define new props\r
prop('colorUp', { type: 'color', def: '#57db64' })\r
prop('colorDown', { type: 'color', def: '#ff3b2f' })\r
prop('colorSelect', { type: 'color', def: '#49bef4' })\r
prop('colorSelectBack', { type: 'color', def: '#00a7f455' })\r
prop('colorSelectValue', { type: 'color', def: '#3b8fed' })\r
prop('colorBaseline', { type: 'color', def: '#555555' })\r
prop('lineWidth', { type: 'number', def: 1.5 })\r
prop('showName', { type: 'boolean', def: false })\r
\r
const HPX = - 0.5\r
const FONT = 'bold 14' + $core.props.config.FONT.slice(2)\r
let direction = 1\r
let mode = 'display'\r
\r
init() {\r
    setTimeout(() => {\r
        $events.emit('show-crosshair', false)\r
        $events.emit('show-sb-panel', false)\r
        $events.emit('show-bb-panel', false)\r
    })\r
}\r
\r
destroy() {\r
    $events.emit('show-crosshair', true)\r
    $events.emit('show-sb-panel', true)\r
    $events.emit('show-bb-panel', true)\r
}\r
\r
draw(ctx) {\r
\r
    mode = $core.cursor.visible ? 'select' : 'display'\r
\r
    const layout = $core.layout\r
    const data = $core.data // Full dataset\r
    const view = $core.view // Visible view\r
\r
    drawBaseline(ctx, layout)\r
\r
    const grd = ctx.createLinearGradient(0, 0, 0, layout.height)\r
    let color = mode === 'select' ? $props.colorSelect : (\r
        direction > 0 ? $props.colorUp : $props.colorDown\r
    )\r
    let cb = mode === 'select' ? $props.colorSelectBack : (color + '55')\r
    grd.addColorStop(0, cb)\r
    grd.addColorStop(1, color + '00')\r
\r
    // Line\r
    ctx.lineWidth = $props.lineWidth\r
    ctx.strokeStyle = color\r
    ctx.lineJoin = "round"\r
    ctx.beginPath()\r
    for (var i = view.i1, n = view.i2; i <= n; i++) {\r
        let p = data[i]\r
        let x = layout.ti2x(p[0], i)\r
        let y = layout.value2y(p[1])\r
        ctx.lineTo(x, y)\r
    }\r
    ctx.stroke()\r
\r
    // Area\r
    ctx.fillStyle = grd\r
    ctx.beginPath()\r
    let p0 = (data[0] || [])[0]\r
    let pN = (data[data.length - 1] || [])[0]\r
    ctx.lineTo(layout.ti2x(p0, 0), layout.height)\r
    for (var i = view.i1, n = view.i2; i <= n; i++) {\r
        let p = data[i]\r
        let x = layout.ti2x(p[0], i)\r
        let y = layout.value2y(p[1])\r
        ctx.lineTo(x, y)\r
    }\r
    ctx.lineTo(layout.ti2x(pN, i - 1), layout.height)\r
    ctx.fill()\r
\r
    let rightMost = $core.dataSubset.slice(-1)[0][0]\r
    if ($core.cursor.ti > rightMost) return\r
\r
    drawVertical(ctx, layout) \r
\r
    // Draw selection circle\r
    drawSelectionCircle(ctx, layout);\r
\r
}\r
\r
// Line that starts from the leftmost price value\r
drawBaseline(ctx, layout) {\r
    let v0 = $core.dataSubset[0][1]\r
    let vLast = $core.dataSubset.slice(-1)[0][1]\r
\r
    direction = Math.sign(vLast - v0)\r
\r
    let y = layout.value2y(v0)\r
    ctx.save()\r
    ctx.strokeStyle = $props.colorBaseline\r
    ctx.beginPath()\r
    ctx.setLineDash([3])\r
    ctx.moveTo(0, y + HPX)\r
    ctx.lineTo(layout.width + HPX, y + HPX)\r
    ctx.stroke()\r
    ctx.restore()\r
\r
}\r
\r
// Draw vertical line with value \r
drawVertical(ctx, layout) {\r
    if (mode === 'select' && $core.cursor.visible) {\r
        // Draw vertical line\r
        ctx.strokeStyle = $props.colorSelect\r
        ctx.lineWidth = 1\r
        ctx.beginPath()\r
        ctx.moveTo($core.cursor.x, 5)\r
        ctx.lineTo($core.cursor.x, layout.height)\r
        ctx.stroke()\r
\r
        // Display value panel\r
        const selectedValue = $core.cursor.values[0][0][1]\r
        const valueText = selectedValue.toFixed(2)\r
\r
        ctx.font = FONT\r
        ctx.fillStyle = $props.colorSelect\r
        const textWidth = ctx.measureText(valueText).width\r
\r
        // Calculate position for the value panel\r
        const panelX = $core.cursor.x - textWidth / 2\r
        const panelY = 5 // Distance from the top of the canvas\r
\r
        // Draw value panel background\r
        ctx.fillStyle = $core.colors.back\r
        const panelHeight = 20 // Height of the panel\r
        ctx.fillRect(panelX - 5, panelY, textWidth + 10, panelHeight)\r
\r
        // Draw value text\r
        ctx.fillStyle = $props.colorSelectValue\r
        const textY = panelY + panelHeight - 5 // Vertical position of the text, adjusted for padding\r
        ctx.fillText(valueText, panelX, textY)\r
    }\r
}\r
\r
// Draw a circle around the selected price point\r
drawSelectionCircle(ctx, layout) {\r
    if (mode === 'select' && $core.cursor.visible) {\r
\r
        let selectedValue = $core.cursor.values[0][0][1];\r
\r
        const circleRadius = 8; // Radius of the circle\r
        const circleStrokeWidth = 2; // Stroke width of the circle\r
        const circleX = $core.cursor.x;\r
        const circleY = layout.value2y(selectedValue);\r
\r
        // Draw circle stroke (back color)\r
        ctx.strokeStyle = $core.colors.back;\r
        ctx.lineWidth = circleStrokeWidth;\r
        ctx.beginPath();\r
        ctx.arc(circleX, circleY, circleRadius + circleStrokeWidth / 2, 0, 2 * Math.PI);\r
        ctx.stroke();\r
\r
        // Draw circle (select color)\r
        ctx.fillStyle = $props.colorSelect;\r
        ctx.beginPath();\r
        ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);\r
        ctx.fill();\r
    }\r
}\r
\r
// Precision sampling\r
preSampler(x) => [x[1]]\r
\r
// Map data item to OHLC (for candle magnets etc.)\r
// Here we simulate a candle with 0 height\r
ohlc(x) => Array(4).fill(x[$props.dataIndex])\r
\r
// Legend, defined as pairs [value, color]\r
legend(x) => $props.showName ? [] : null\r
`;
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AppleArea
}, Symbol.toStringTag, { value: "Module" }));
const ArrowTrades = "\r\n// Navy ~ 0.2-lite\r\n\r\n// <ds>Stacked arrow trades</ds>\r\n// Format: [<timestamp>, [<dir>, <?label> <?big>], ...]\r\n// <dir> :: 1 for buy -1 for sell\r\n// <?label> :: trade label (null for no label)\r\n// <?big> :: true/false, make an arrow big\r\n\r\n[OVERLAY name=ArrowTrades, ctx=Canvas, version=1.0.0]\r\n\r\nprop('buyColor', {  type: 'color', def: '#08c65e' })\r\nprop('sellColor', {  type: 'color', def: '#e42633' })\r\nprop('size', {  type: 'number', def: 7 })\r\nprop('showLabels', {  type: 'boolean', def: true })\r\nprop('markerOutline', {  type: 'boolean', def: true })\r\nprop('outlineWidth', {  type: 'number', def: 4 })\r\n\r\n// Draw function (called on each update)\r\n// Library provides a lot of useful variables to make\r\n// overlays ($core in the main collection)\r\ndraw(ctx) {\r\n    ctx.lineWidth = $props.outlineWidth\r\n    const layout = $core.layout\r\n    const data = $core.data // Full dataset\r\n    const view = $core.view // Visible view\r\n\r\n    // Fill sell trades\r\n    ctx.fillStyle = $props.buyColor\r\n    ctx.beginPath()\r\n    let lbls1 = iterTrades(ctx, view, data, layout, -1)\r\n    ctx.fill()\r\n\r\n    // Fill buy trades\r\n    ctx.fillStyle = $props.sellColor\r\n    ctx.beginPath()\r\n    let lbls2 = iterTrades(ctx, view, data, layout, 1)\r\n    ctx.fill()\r\n\r\n    // Draw labels\r\n    if ($props.showLabels) {\r\n        ctx.fillStyle = $core.colors.textHL\r\n        ctx.font = $core.props.config.FONT\r\n        let all = [...lbls1, ...lbls2]\r\n        drawLabels(ctx, view, layout, all)\r\n    }\r\n\r\n}\r\n\r\n// Iter through arcs\r\niterTrades(ctx, view, data, layout, dir) {\r\n    let lables = []\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let ohlc = layout.ohlc(p[0])\r\n        if (!ohlc) continue\r\n        let x = layout.ti2x(p[0], i)\r\n        if (dir > 0) {\r\n            var y = layout.value2y(ohlc[1])\r\n        } else {\r\n            var y = layout.value2y(ohlc[2])\r\n        }\r\n        for (var k = 1; k < p.length; k++) {\r\n            if (Math.sign(p[k][0]) === dir) continue\r\n            let size = $props.size\r\n            if (p[k][2]) size *= 1.5\r\n            let yk = y - dir * (15 * (k - 1) + 10)\r\n            let align = dir < 0 ? 'right' : 'left'\r\n            let dy = p[k][2] ? - dir * 1 : 0\r\n            if (p[k][1]) {\r\n                lables.push([ x + 10 * dir, yk + dy, p[k][1], align])\r\n            }\r\n            drawArrow(ctx, x, yk, -dir, size)\r\n        }\r\n    }\r\n    return lables\r\n}\r\n\r\ndrawArrow(ctx, x, y, dir, size) {\r\n    ctx.moveTo(x, y)\r\n    ctx.lineTo(x + size * dir * 0.63, y + size * dir)\r\n    ctx.lineTo(x - size * dir * 0.63, y + size * dir)\r\n}\r\n\r\n// Draw simple lables\r\ndrawLabels(ctx, view, layout, lables) {\r\n    for (var l of lables) {\r\n        ctx.textAlign = l[3]\r\n        let dy = l[3] === 'right' ? 7 : 0\r\n        ctx.fillText(l[2], l[0], l[1] + dy)\r\n    }\r\n}\r\n\r\n// Not affecting the y-range\r\nyRange() => null\r\n\r\n// Legend formatter, Array of [value, color] pairs\r\n// x represents one data item e.g. [<time>, <value>]\r\nlegend(x) {\r\n    let items = []\r\n    for (var i = 1; i < x.length; i++) {\r\n        items.push([\r\n            x[i][1] || (x[i][0] > 0 ? 'Buy' : 'Sell'),\r\n            x[i][0] > 0 ? $props.buyColor : $props.sellColor\r\n        ])\r\n    }\r\n    return items\r\n}\r\n";
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ArrowTrades
}, Symbol.toStringTag, { value: "Module" }));
const Band = "// Navy ~ 0.2-lite\r\n\r\n// <ds>Bands indicator, e.g. BollingerBands</ds> \r\n// format: [<timestamp>, <high>, <mid>, <low>]\r\n\r\n[OVERLAY name=Band, ctx=Canvas, verion=1.0.0]\r\n\r\n// Overlay props\r\nprop('color', { type: 'Color', def: '#b41d70' })\r\nprop('backColor', { type: 'Color', def: $props.color + '11' })\r\nprop('lineWidth', { type: 'number', def: 1 })\r\nprop('showMid', { type: 'boolean', def: true })\r\n\r\n// Draw call\r\ndraw(ctx) {\r\n     // Background\r\n    const data = $core.data\r\n    const view = $core.view\r\n    const layout = $core.layout\r\n    ctx.beginPath()\r\n    ctx.fillStyle = $props.backColor\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[1] || undefined)\r\n        ctx.lineTo(x, y)\r\n    }\r\n    for (var i = view.i2, i1 = view.i1; i >= i1; i--) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[3] || undefined)\r\n        ctx.lineTo(x, y)\r\n    }\r\n    ctx.fill()\r\n    // Lines\r\n    // TODO: can be faster by combining line\r\n    // into one path with moveTo in b/w\r\n    ctx.lineWidth = $props.lineWidth\r\n    ctx.strokeStyle = $props.color\r\n    // Top line\r\n    ctx.beginPath()\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[1] || undefined)\r\n        ctx.lineTo(x, y)\r\n    }\r\n    ctx.stroke()\r\n    // Bottom line\r\n    ctx.beginPath()\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[3] || undefined)\r\n        ctx.lineTo(x, y)\r\n    }\r\n    ctx.stroke()\r\n    // Middle line\r\n    if (!$props.showMid) return\r\n    ctx.beginPath()\r\n    for (var i = 0; i < data.length; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[2] || undefined)\r\n        ctx.lineTo(x, y)\r\n    }\r\n    ctx.stroke()\r\n}\r\n\r\n// Legend, defined as pairs [value, color]\r\nlegend(x) => $props.showMid ? [\r\n    [x[1], $props.color],\r\n    [x[2], $props.color],\r\n    [x[3], $props.color]\r\n] : [\r\n    [x[1], $props.color],\r\n    [x[3], $props.color]\r\n]\r\n";
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Band
}, Symbol.toStringTag, { value: "Module" }));
const CandlesPlus = `\r
// NavyJS ~ 0.2-lite\r
\r
// <ds>Colored Candles (Warning: coloring makes it slower)</ds>\r
// Format: [<timestamp>, <open>, <high>, <low>, <close>, <?volume>, <?color>]\r
// <?color> :: Candle body color\r
\r
[OVERLAY name=CandlesPlus, ctx=Canvas, version=1.0.0]\r
\r
// Define the props\r
prop('colorBodyUp', { type: 'color', def: $core.colors.candleUp })\r
prop('colorBodyDw', { type: 'color', def: $core.colors.candleDw })\r
prop('colorWickUp', { type: 'color', def: $core.colors.wickUp })\r
prop('colorWickDw', { type: 'color', def: $core.colors.wickDw })\r
prop('colorVolUp', { type: 'color', def: $core.colors.volUp })\r
prop('colorVolDw', { type: 'color', def: $core.colors.volDw })\r
prop('showVolume', { type: 'boolean', def: true })\r
prop('showWicks', { type: 'boolean', def: true })\r
prop('currencySymbol', { type: 'string', def: '$' })\r
prop('showAvgVolume', { type: 'boolean', def: true })\r
prop('avgVolumeSMA', { type: 'number', def: 20 })\r
prop('colorAvgVol', { type: 'color', def: '#1cccb777'})\r
prop('scaleSymbol', { type: 'string|boolean', def: false })\r
prop('priceLine', { type: 'boolean', def: true })\r
prop('showValueTracker', { type: 'boolean', def: true })\r
prop('coloringBodies', { type: 'boolean', def: true })\r
prop('coloringWicks', { type: 'boolean', def: false })\r
prop('coloringVolume', { type: 'boolean', def: false })\r
\r
// Draw call\r
draw(ctx) {\r
\r
    let cnv = $lib.layoutCnv($core, true, $props.showVolume)\r
    let bodies = cnv.upBodies.length ? cnv.upBodies : cnv.dwBodies\r
    if (!bodies.length) return\r
    let w = Math.max(bodies[0].w, 1)\r
    let sw = $props.showWicks\r
    let cb = $props.coloringBodies\r
    let cw = $props.coloringWicks\r
    let cv = $props.coloringVolume\r
\r
    if (sw) {\r
        drawCvPart(ctx, $lib.candleWick, cnv.dwWicks, 1, 'colorWickDw', cw)\r
        drawCvPart(ctx, $lib.candleWick, cnv.upWicks, 1, 'colorWickUp', cw)\r
    }\r
    drawCvPart(ctx, $lib.candleBody, cnv.dwBodies, w, 'colorBodyDw', cb)\r
    drawCvPart(ctx, $lib.candleBody, cnv.upBodies, w, 'colorBodyUp', cb)\r
    drawCvPart(ctx, $lib.volumeBar, cnv.dwVolbars, w, 'colorVolDw', cv)\r
    drawCvPart(ctx, $lib.volumeBar, cnv.upVolbars, w, 'colorVolUp', cv)\r
\r
    if ($props.showVolume && $props.showAvgVolume) {\r
        $lib.avgVolume(ctx, $core, $props, cnv)\r
    }\r
\r
}\r
\r
// Draw candle part\r
drawCvPart(ctx, f, arr, w, color, coloring = false) {\r
    let layout = $core.layout\r
    let prevColor = null\r
    ctx.lineWidth = w\r
    ctx.strokeStyle = $props[color]\r
    ctx.beginPath()\r
    for (var i = 0, n = arr.length; i < n; i++) {\r
        if (coloring) {\r
            var c = arr[i].src[6]\r
            if (c) {\r
                if (c !== prevColor) {\r
                    ctx.stroke()\r
                    ctx.beginPath()\r
                }\r
                ctx.strokeStyle = c\r
            } else if (prevColor !== $props[color]) {\r
                ctx.stroke()\r
                ctx.beginPath()\r
                ctx.strokeStyle = $props[color]\r
                prevColor = $props[color]\r
            }\r
            prevColor = c\r
        }\r
        f(ctx, arr[i], layout)\r
    }\r
    ctx.stroke()\r
}\r
\r
// Define y-range (by finding max High, min Low)\r
static yRange(data) {\r
    let len = data.length\r
    var h, l, high = -Infinity, low = Infinity\r
    for(var i = 0; i < len; i++) {\r
        let point = data[i]\r
        if (point[2] > high) high = point[2]\r
        if (point[3] < low) low = point[3]\r
    }\r
    return [high, low]\r
}\r
\r
// Use [Open, Close] for precision detection\r
static preSampler(x) => [x[1], x[4]]\r
\r
// Map data item to OHLC (for candle magnets etc.)\r
ohlc(x) => [x[1], x[2], x[3], x[4]]\r
\r
// Price label + Scale symbol + price line\r
valueTracker(x) => {\r
    show: $props.showValueTracker,\r
    symbol: $props.scaleSymbol,\r
    line: $props.priceLine,\r
    color: $lib.candleColor($props, $core.data[$core.data.length - 1]),\r
    value: x[4] // close\r
}\r
\r
// Define the OHLCV legend\r
legendHtml(x, prec, f) {\r
    let color1 = $core.colors.text\r
    let v = $core.cursor.getValue($core.paneId, $core.id)\r
    let sym = $props.currencySymbol\r
    let color2 = v[4] >= v[1] ?\r
        $props.colorBodyUp : $props.colorBodyDw\r
    if ($props.coloringBodies && x[6]) {\r
        color2 = x[6]\r
    }\r
    let fc = $lib.formatCash\r
    return \`\r
    <span style="color: \${color2}">\r
        <span style="margin-left: 3px;"></span>\r
        <span style="color: \${color1}">O</span>\r
        <span class="nvjs-ll-value">\${f(x[1])}</span>\r
        <span style="color: \${color1}">H</span>\r
        <span class="nvjs-ll-value">\${f(x[2])}</span>\r
        <span style="color: \${color1}">L</span>\r
        <span class="nvjs-ll-value">\${f(x[3])}</span>\r
        <span style="color: \${color1}">C</span>\r
        <span class="nvjs-ll-value">\${f(x[4])}</span>\r
    \`\r
    + ($props.showVolume ? \`\r
        <span style="color: \${color1}">V</span>\r
        <span class="nvjs-ll-value">\${sym+fc(x[5])}</span>\` : \`\`)\r
    + \`</span>\`\r
    }\r
`;
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CandlesPlus
}, Symbol.toStringTag, { value: "Module" }));
const Cloud = "// Navy ~ 0.2-lite\r\n\r\n// <ds>Cloud</ds>, format [<timestamp>, <line1>, <line2>]\r\n[OVERLAY name=Cloud, ctx=Canvas, verion=0.1.0]\r\n\r\n// Overlay props\r\nprop('color1', { type: 'color', def: '#55d7b0aa' })\r\nprop('color2', { type: 'color', def: '#d94d64aa' })\r\nprop('back1', { type: 'color', def: '#79ffde22' })\r\nprop('back2', { type: 'color', def: '#ff246c22' })\r\nprop('drawLines', { type: 'boolean', def: false })\r\n\r\n// Draw call\r\n// TODO: speed-up (draw segment with the same color together)\r\ndraw(ctx) {\r\n\r\n    const layout = $core.layout\r\n    const data = $core.data\r\n    const view = $core.view\r\n\r\n    ctx.lineWidth = 1\r\n\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p1 = map(layout, data[i], i)\r\n        let p2 = map(layout, data[i+1], i+1)\r\n\r\n        if (!p2) continue\r\n        if (p1.y1 !== p1.y1) continue // Fix NaN\r\n\r\n         // Background\r\n        ctx.beginPath()\r\n        ctx.fillStyle =  p1.y1 < p1.y2 ? $props.back1 : $props.back2\r\n        ctx.moveTo(p1.x, p1.y1)\r\n        ctx.lineTo(p2.x + 0.1, p2.y1)\r\n        ctx.lineTo(p2.x + 0.1, p2.y2)\r\n        ctx.lineTo(p1.x, p1.y2)\r\n        ctx.fill()\r\n        // Lines\r\n        if (!$props.drawLines) continue\r\n        ctx.beginPath()\r\n        ctx.strokeStyle = $props.color1\r\n        ctx.moveTo(p1.x, p1.y1)\r\n        ctx.lineTo(p2.x, p2.y1)\r\n        ctx.stroke()\r\n        ctx.beginPath()\r\n        ctx.strokeStyle = $props.color2\r\n        ctx.moveTo(p1.x, p1.y2)\r\n        ctx.lineTo(p2.x, p2.y2)\r\n        ctx.stroke()\r\n    }\r\n}\r\n\r\nmap(layout, p, i) {\r\n    return p && {\r\n        x:  layout.ti2x(p[0], i),\r\n        y1: layout.value2y(p[1]),\r\n        y2: layout.value2y(p[2])\r\n    }\r\n}\r\n\r\n// Legend, defined as pairs [value, color]\r\nlegend(x) => [[x[1], $props.color1], [x[2], $props.color2]]\r\n";
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cloud
}, Symbol.toStringTag, { value: "Module" }));
const Histogram = `// Navy ~ 0.2-lite\r
\r
// <ds>Colored histogram, can be used for MACD</ds>\r
// Format: [<timestamp>, <hist>, <?value>, <?signal>]\r
// <hist> :: histogram value (e.g. MACD bars)\r
// <?value> :: value of the first line (e.g. MACD value)\r
// <?signal> :: value of the second line (e.g. MACD signal)\r
\r
[OVERLAY name=Histogram, ctx=Canvas, verion=1.0.1]\r
// "#35a776", "#79e0b3", "#e54150", "#ea969e"\r
// Overlay props\r
prop('barWidth', { type: 'number', def: 4 })\r
prop('lineWidth', { type: 'number', def: 1 })\r
prop('colorUp', { type: 'Color', def: '#35a776' })\r
prop('colorDw', { type: 'Color', def: '#e54150' })\r
prop('colorSemiUp', { type: 'Color', def: '#79e0b3' })\r
prop('colorSemiDw', { type: 'Color', def: '#ea969e' })\r
prop('colorValue', { type: 'Color', def: '#3782f2' })\r
prop('colorSignal', { type: 'Color', def: '#f48709' })\r
\r
// Draw call\r
draw(ctx) {\r
\r
    const layout = $core.layout\r
    const view = $core.view\r
\r
    let groups = splitBars(view, layout, view.src)\r
\r
    ctx.lineWidth = detectBarWidth(view, layout, view.src)\r
\r
    // Semi-down\r
\r
    ctx.strokeStyle = $props.colorSemiDw\r
    drawBars(ctx, layout, groups.semiDw)\r
\r
    // Semi-up\r
    ctx.strokeStyle = $props.colorSemiUp\r
    drawBars(ctx, layout, groups.semiUp)\r
\r
    // Down\r
    ctx.strokeStyle = $props.colorDw\r
    drawBars(ctx, layout, groups.dw)\r
\r
    // Up\r
    ctx.strokeStyle = $props.colorUp\r
    drawBars(ctx, layout, groups.up)\r
\r
    // Drawing the lines\r
    ctx.lineWidth = $props.lineWidth\r
    ctx.lineJoin = "round"\r
\r
    ctx.strokeStyle = $props.colorValue\r
    drawSpline(ctx, view, layout, 2)\r
\r
    ctx.strokeStyle = $props.colorSignal\r
    drawSpline(ctx, view, layout, 3)\r
\r
}\r
\r
detectBarWidth(view, layout, data) {\r
    if (!data[view.i2 - 1]) return 0\r
    let p1 = layout.ti2x(data[view.i2 - 1][0], view.i2 - 1)\r
    let p2 = layout.ti2x(data[view.i2][0], view.i2)\r
    if ((p2 - p1) < 1) {\r
        return 1\r
    } else {\r
        return $props.barWidth\r
    }\r
}\r
\r
splitBars(view, layout, data) {\r
    const off = $props.barWidth % 2 ? 0 : 0.5\r
    let semiDw = []\r
    let semiUp = []\r
    let dw = []\r
    let up = []\r
    for (var i = view.i1, n = view.i2; i <= n; i++) {\r
        let prev = data[i - 1]\r
        let p = data[i]\r
        let x = layout.ti2x(p[0], i) - off\r
        let y = layout.value2y(p[1]) - 0.5\r
        let bar = {x, y}\r
        if (p[1] >= 0) {\r
            var color = 0\r
            if (prev && p[1] < prev[1]) color = 1\r
        } else {\r
            var color = 2\r
            if (prev && p[1] > prev[1]) color = 3\r
        }\r
        switch(color) {\r
            case 0:\r
                up.push(bar)\r
                break\r
            case 1:\r
                semiUp.push(bar)\r
                break\r
            case 2:\r
                dw.push(bar)\r
                break\r
            case 3:\r
                semiDw.push(bar)\r
                break\r
        }\r
    }\r
    return { semiDw, semiUp, dw, up }\r
}\r
\r
drawBars(ctx, layout, group) {\r
    const data = $core.data\r
    const base = layout.value2y(0) + 0.5\r
    ctx.beginPath()\r
    for (var bar of group) {\r
        ctx.moveTo(bar.x, base)\r
        ctx.lineTo(bar.x, bar.y)\r
    }\r
    ctx.stroke()\r
}\r
\r
drawSpline(ctx, view, layout, idx) {\r
    ctx.beginPath()\r
    const data = view.src\r
    for (var i = view.i1, n = view.i2; i <= n; i++) {\r
        let p = data[i]\r
        let x = layout.ti2x(p[0], i)\r
        let y = layout.value2y(p[idx])\r
        ctx.lineTo(x, y)\r
    }\r
    ctx.stroke()\r
}\r
\r
// Legend, defined as pairs [value, color]\r
// TODO: colorize the hist point\r
legend(x) => [\r
    [x[1], $props.color],\r
    [x[2], $props.colorValue],\r
    [x[3], $props.colorSignal]\r
]\r
`;
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Histogram
}, Symbol.toStringTag, { value: "Module" }));
const PriceLabels = `// Navy ~ 0.2-lite\r
\r
// <ds>Price labels that stick to candles</ds>\r
// Format: [<timestamp>, <LabelObject>]\r
// <LabelObject> {\r
//   text :: string, text of the label\r
//   dir :: direction, 1 = points up, -1 = points down\r
//   pin :: "open" | "high" | "low" | "close"\r
//   ?color :: color, text color\r
//   ?back :: color, background\r
//   ?stroke :: stroke color\r
//   ?offset, px, offest from the pin\r
// }\r
\r
[OVERLAY name=PriceLabels, ctx=Canvas, verion=1.0.0]\r
\r
// Overlay props\r
prop('color', { type: 'Color', def: $core.colors.text })\r
prop('back', { type: 'Color', def: $core.colors.back })\r
prop('stroke', { type: 'Color', def: $core.colors.scale })\r
prop('borderRadius', { type: 'number', def: 3 })\r
prop('offset', { type: 'number', def: 5 })\r
\r
const PINMAP = {\r
    open: 0,\r
    high: 1,\r
    low: 2,\r
    close: 3\r
}\r
\r
// Draw call\r
draw(ctx) {\r
    const layout = $core.layout\r
    const view = $core.view\r
    const data = $core.data\r
\r
    ctx.font = $core.props.config.FONT\r
\r
    let items = calcItems(ctx, layout, view, data)\r
\r
    // Draw items\r
    ctx.lineWidth = 1\r
    ctx.textAlign = 'center'\r
    for (var item of items) {\r
        let off = (item.o ?? $props.offset) * item.dir\r
        let dy = (item.dir > 0 ? 19 : -11)\r
        item.y += off\r
        ctx.strokeStyle = item.s || $props.stroke\r
        ctx.fillStyle = item.b || $props.back\r
        ctx.beginPath()\r
        drawBody(ctx, item)\r
        ctx.stroke()\r
        ctx.fill()\r
        ctx.fillStyle = item.c || $props.color\r
        ctx.fillText(item.text, item.x, item.y + dy)\r
    }\r
}\r
\r
calcItems(ctx, layout, view, data) {\r
\r
    let items = []\r
    for (var i = view.i1, n = view.i2; i <= n; i++) {\r
        let p = data[i]\r
        let specs = p[1]\r
        let ohlc = layout.ohlc(p[0])\r
        if (!ohlc) continue\r
        let x = layout.ti2x(p[0], i)\r
        let y = layout.value2y(ohlc[PINMAP[specs.pin]])\r
        let w = ctx.measureText(specs.text).width\r
        let h = 20\r
        let dir = specs.dir\r
        items.push({\r
            x, y, w, h, dir,\r
            c: specs.color,\r
            b: specs.back,\r
            s: specs.stroke,\r
            o: specs.offset,\r
            text: specs.text})\r
    }\r
    return items\r
}\r
\r
drawBody(ctx, item) {\r
    let r = $props.borderRadius\r
    let hw = item.w // half width\r
    let d = - item.dir\r
    let x = item.x\r
    let y = item.y\r
    ctx.moveTo(x, y)\r
    ctx.lineTo(x + 5, y - 5 * d)\r
    ctx.lineTo(x + hw - r, y - 5 * d)\r
    ctx.quadraticCurveTo(x + hw, y - 5 * d, x + hw, y - (5 + r) * d)\r
    ctx.lineTo(x + hw, y - (5 + item.h - r) * d)\r
    ctx.quadraticCurveTo(x + hw, y - (5 + item.h) * d, x + hw - r, y - (5 + item.h) * d)\r
    ctx.lineTo(x - hw + r, y - (5 + item.h) * d)\r
    ctx.quadraticCurveTo(x - hw, y - (5 + item.h) * d, x - hw, y - (5 + item.h - r) * d)\r
    ctx.lineTo(x - hw, y - (5 + r) * d)\r
    ctx.quadraticCurveTo(x - hw, y - 5 * d, x - hw + r, y - 5 * d)\r
    ctx.lineTo(x - 5, y - 5 * d)\r
    ctx.lineTo(x, y)\r
}\r
\r
// Legend, defined as pairs [value, color]\r
legend(x) => [[x[1].text, x[1].color || $props.color]]\r
`;
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PriceLabels
}, Symbol.toStringTag, { value: "Module" }));
const Range = `// Navy ~ 0.2-lite\r
\r
// <ds>Ranging indicator, e.g. RSI</ds>\r
// Format: [<timestamp>, <value>]\r
\r
[OVERLAY name=Range, ctx=Canvas, verion=1.0.1]\r
\r
// Overlay props\r
prop('color', { type: 'Color', def: '#ec206e' })\r
prop('backColor', { type: 'Color', def: '#381e9c16' })\r
prop('bandColor', { type: 'Color', def: '#535559' })\r
prop('lineWidth', { type: 'number', def: 1 })\r
prop('upperBand', { type: 'number', def: 70 })\r
prop('lowerBand', { type: 'number', def: 30 })\r
\r
// Draw call\r
draw(ctx) {\r
    const layout = $core.layout\r
    const upper = layout.value2y($props.upperBand)\r
    const lower = layout.value2y($props.lowerBand)\r
    const data = $core.data\r
    const view = $core.view\r
    // RSI values\r
    ctx.lineWidth = $props.lineWidth\r
    ctx.lineJoin = "round"\r
    ctx.strokeStyle = $props.color\r
    ctx.beginPath()\r
    for (var i = view.i1, n = view.i2; i <= n; i++) {\r
        let p = data[i]\r
        let x = layout.ti2x(p[0], i)\r
        let y = layout.value2y(p[1])\r
        ctx.lineTo(x, y)\r
    }\r
    ctx.stroke()\r
    ctx.strokeStyle = $props.bandColor\r
    ctx.setLineDash([5]) // Will be removed after draw()\r
    ctx.beginPath()\r
    // Fill the area between the bands\r
    ctx.fillStyle = $props.backColor\r
    ctx.fillRect(0, upper, layout.width, lower - upper)\r
    // Upper band\r
    ctx.moveTo(0, upper)\r
    ctx.lineTo(layout.width, upper)\r
    // Lower band\r
    ctx.moveTo(0, lower)\r
    ctx.lineTo(layout.width, lower)\r
    ctx.stroke()\r
}\r
\r
yRange(data, hi, lo) => [\r
    Math.max(hi, $props.upperBand),\r
    Math.min(lo, $props.lowerBand)\r
]\r
\r
// Legend, defined as pairs [value, color]\r
legend(x) => [[x[1], $props.color]]\r
`;
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Range
}, Symbol.toStringTag, { value: "Module" }));
const Sparse = "// Navy ~ 0.2-lite\r\n\r\n// <ds>Sparse data: points, squares, crosses, triangles</ds>\r\n// Format: [<timestamp>, <value>, <?direction>]\r\n// <value> :: Price/value\r\n// <?direction> :: Triangle direction: 1 | -1\r\n\r\n[OVERLAY name=Sparse, ctx=Canvas, verion=1.0.0]\r\n\r\n// Overlay props\r\nprop('color', { type: 'Color', def: '#898989' })\r\nprop('size', { type: 'number', def: 3 })\r\nprop('shape', {\r\n    type: 'string',\r\n    def: 'point',\r\n    options: ['point', 'square', 'cross', 'triangle']\r\n})\r\n\r\n// Draw call\r\ndraw(ctx) {\r\n    const layout = $core.layout\r\n    const view = $core.view\r\n\r\n    ctx.fillStyle = $props.color\r\n    ctx.strokeStyle = $props.color\r\n\r\n    switch($props.shape) {\r\n        case 'point':\r\n            drawArcs(ctx, view, layout)\r\n        break\r\n        case 'square':\r\n            drawSquares(ctx, view, layout)\r\n        break\r\n        case 'cross':\r\n            drawCrosses(ctx, view, layout)\r\n        break\r\n        case 'triangle':\r\n            drawTriandles(ctx, view, layout)\r\n        break\r\n    }\r\n}\r\n\r\ndrawArcs(ctx, view, layout) {\r\n    const radius = $props.size\r\n    const data = view.src\r\n    ctx.beginPath()\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[1])\r\n        ctx.moveTo(x+radius, y)\r\n        ctx.arc(x, y, radius, 0, Math.PI * 2, false)\r\n    }\r\n    ctx.fill()\r\n}\r\n\r\ndrawSquares(ctx, view, layout) {\r\n    const half = $props.size\r\n    const side = half * 2\r\n    const data = view.src\r\n    ctx.beginPath()\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[1])\r\n        ctx.moveTo(x-half, y-half)\r\n        ctx.lineTo(x+half, y-half)\r\n        ctx.lineTo(x+half, y+half)\r\n        ctx.lineTo(x-half, y+half)\r\n    }\r\n    ctx.fill()\r\n}\r\n\r\ndrawCrosses(ctx, view, layout) {\r\n    const half = $props.size\r\n    const side = half * 2\r\n    const data = view.src\r\n    ctx.lineWidth = Math.max(half - 1, 1)\r\n    ctx.beginPath()\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[1])\r\n        ctx.moveTo(x-half, y)\r\n        ctx.lineTo(x+half, y)\r\n        ctx.moveTo(x, y-half)\r\n        ctx.lineTo(x, y+half)\r\n    }\r\n    ctx.stroke()\r\n}\r\n\r\ndrawTriandles(ctx, view, layout) {\r\n    const half = $props.size\r\n    const side = half * 2\r\n    const data = view.src\r\n    ctx.beginPath()\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[1])\r\n        let dir = p[2] ?? 1\r\n        ctx.moveTo(x, y)\r\n        ctx.lineTo(x + side * dir * 0.63, y + side * dir)\r\n        ctx.lineTo(x - side * dir * 0.63, y + side * dir)\r\n    }\r\n    ctx.fill()\r\n}\r\n\r\nstatic yRange(data) {\r\n    let len = data.length\r\n    var h, l, high = -Infinity, low = Infinity\r\n    for(var i = 0; i < len; i++) {\r\n        let point = data[i][1]\r\n        if (point > high) high = point\r\n        if (point < low) low = point\r\n    }\r\n    return [high, low]\r\n}\r\n\r\nstatic preSampler(x) => [x[1]]\r\n\r\n// Legend, defined as pairs [value, color]\r\nlegend(x) => [[Math.random(), $props.color]]\r\n";
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Sparse
}, Symbol.toStringTag, { value: "Module" }));
const Splines = `\r
// NavyJS ~ 0.2-lite\r
\r
// <ds>Multiple splines</ds> \r
// Format: [<timestamp>, <line1>, <line2>, ...]\r
\r
[OVERLAY name=Splines, ctx=Canvas, version=1.0.0]\r
\r
prop('lineWidth', { type: 'number', def: 1 })\r
prop('widths', { type: 'Array', def: [] })\r
prop('colors', { type: 'Array', def: [] })\r
prop('skipNan', { type: 'boolean', def: false })\r
\r
const COLORS = $props.colors.length ? $props.colors : [\r
    '#53c153', '#d1c045', '#d37734', '#d63953', '#c43cb9',\r
    '#6c3cc4', '#444bc9', '#44c2c9', '#44c98d'\r
]\r
draw(ctx) {\r
\r
    let num = ($core.data[0] || []).length ?? 0\r
    for (var i = 0; i < num; i++) {\r
        let _i = i % COLORS.length\r
        ctx.strokeStyle = COLORS[_i]\r
        ctx.lineJoin = "round"\r
        ctx.lineWidth = $props.widths[i] || $props.lineWidth\r
        ctx.beginPath()\r
        drawSpline(ctx, i)\r
        ctx.stroke()\r
    }\r
\r
}\r
\r
drawSpline(ctx, idx) {\r
    const layout = $core.layout\r
    const data = $core.data\r
    const view = $core.view\r
    if (!this.skipNan) {\r
        for (var i = view.i1, n = view.i2; i <= n; i++) {\r
            let p = data[i]\r
            let x = layout.ti2x(p[0], i)\r
            let y = layout.value2y(p[idx + 1])\r
            ctx.lineTo(x, y)\r
        }\r
    } else {\r
        var skip = false\r
        for (var i = view.i1, n = view.i2; i <= n; i++) {\r
            let p = data[i]\r
            let x = layout.ti2x(p[0], i)\r
            let y = layout.value2y(p[idx + 1])\r
            if (p[idx + 1] == null || y !== y) {\r
                skip = true\r
            } else {\r
                if (skip) ctx.moveTo(x, y)\r
                ctx.lineTo(x, y)\r
                skip = false\r
            }\r
        }\r
    }\r
}\r
\r
// Legend, defined as pairs [value, color]\r
legend(x) => x.slice(1) // remove time\r
    .map((v, i) => [ // map value => color\r
        v, COLORS[i % COLORS.length]\r
    ])\r
`;
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Splines
}, Symbol.toStringTag, { value: "Module" }));
const SuperBands = "// Navy ~ 0.2-lite\r\n\r\n// <ds>Two bands: above and below the price (like LuxAlgo Reverse Zones)</ds>\r\n// Format: [<timestamp>, <high1>, <mid1>, <low1>, <high2>, <mid2>, <low2>]\r\n/*\r\n--- <high1> ---\r\n--- <mid1> ---\r\n--- <low1> ---\r\n~~~ price ~~~\r\n--- <high2> ---\r\n--- <mid2> ---\r\n--- <low2> ---\r\n*/\r\n\r\n[OVERLAY name=SuperBands, ctx=Canvas, verion=1.0.0]\r\n\r\n// Overlay props\r\nprop('color1', { type: 'color', def: '#d80d3848' })\r\nprop('color1dark', { type: 'color', def: '#d80d3824' })\r\nprop('color2', { type: 'color', def: '#1edbbe33' })\r\nprop('color2dark', { type: 'color', def: '#1edbbe15' })\r\n\r\n// Draw call\r\ndraw(ctx) {\r\n    const view = $core.view\r\n    const layout = $core.layout\r\n\r\n    ctx.fillStyle = $props.color1\r\n    drawBand(ctx, layout, view, 1, 2)\r\n\r\n    ctx.fillStyle = $props.color1dark\r\n    drawBand(ctx, layout, view, 2, 3)\r\n\r\n    ctx.fillStyle = $props.color2dark\r\n    drawBand(ctx, layout, view, 4, 5)\r\n\r\n    ctx.fillStyle = $props.color2\r\n    drawBand(ctx, layout, view, 5, 6)\r\n\r\n}\r\n\r\n\r\ndrawBand(ctx, layout, view, i1, i2) {\r\n    let data = $core.view.src\r\n    ctx.beginPath()\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[i1] || undefined)\r\n        ctx.lineTo(x, y)\r\n    }\r\n    for (var i = view.i2, i1 = view.i1; i >= i1; i--) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[i2] || undefined)\r\n        ctx.lineTo(x, y)\r\n    }\r\n    ctx.fill()\r\n}\r\n\r\n// Legend, defined as pairs [value, color]\r\nlegend(x) => [\r\n    [x[1], $props.color1], [x[2], $props.color1], [x[3], $props.color1],\r\n    [x[4], $props.color2], [x[5], $props.color2], [x[6], $props.color2]\r\n]\r\n";
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SuperBands
}, Symbol.toStringTag, { value: "Module" }));
const Trades = "\r\n// Navy ~ 0.2-lite\r\n\r\n// <ds>Simple trades</ds>\r\n// Format: [<timestamp>, <dir>, <price>, <?label>]\r\n// <dir> :: 1 for buy -1 for sell\r\n// <price> :: trade price\r\n// <?label> :: trade label\r\n[OVERLAY name=Trades, ctx=Canvas, version=1.0.0]\r\n\r\nprop('buyColor', {  type: 'color', def: '#08b2c6' })\r\nprop('sellColor', {  type: 'color', def: '#e42633' })\r\nprop('radius', {  type: 'number', def: 4 })\r\nprop('showLabels', {  type: 'boolean', def: true })\r\nprop('markerOutline', {  type: 'boolean', def: true })\r\nprop('outlineWidth', {  type: 'number', def: 4 })\r\n\r\n// Draw function (called on each update)\r\n// Library provides a lot of useful variables to make\r\n// overlays ($core in the main collection)\r\ndraw(ctx) {\r\n    ctx.lineWidth = $props.outlineWidth\r\n    const layout = $core.layout\r\n    const data = $core.data // Full dataset\r\n    const view = $core.view // Visible view\r\n\r\n    // Outline\r\n    if ($props.markerOutline) {\r\n        ctx.strokeStyle = $core.colors.back\r\n        ctx.beginPath()\r\n        iterArcs(ctx, view, data, layout)\r\n        ctx.stroke()\r\n    }\r\n\r\n    // Fill sell trades\r\n    ctx.fillStyle = $props.buyColor\r\n    ctx.beginPath()\r\n    iterArcs(ctx, view, data, layout, -1)\r\n    ctx.fill()\r\n\r\n    // Fill buy trades\r\n    ctx.fillStyle = $props.sellColor\r\n    ctx.beginPath()\r\n    iterArcs(ctx, view, data, layout, 1)\r\n    ctx.fill()\r\n\r\n    // Draw labels\r\n    if ($props.showLabels) {\r\n        ctx.fillStyle = $core.colors.textHL\r\n        ctx.font = $core.props.config.FONT\r\n        ctx.textAlign = 'center'\r\n        drawLabels(ctx, view, data, layout)\r\n    }\r\n\r\n}\r\n\r\n// Iter through arcs\r\niterArcs(ctx, view, data, layout, dir) {\r\n    const radius = $props.radius\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        if (Math.sign(p[1]) === dir) continue\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[2])\r\n        ctx.moveTo(x+radius, y)\r\n        ctx.arc(x, y, radius, 0, Math.PI * 2, false)\r\n    }\r\n}\r\n\r\n// Draw simple lables\r\ndrawLabels(ctx, view, data, layout) {\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[2])\r\n        ctx.fillText(p[3], x, y - 25)\r\n    }\r\n}\r\n\r\n// Sample data point with index 2\r\nstatic preSampler(x) => x[2]\r\n\r\n// Not affecting the y-range\r\nstatic yRange() => null\r\n\r\n// Legend formatter, Array of [value, color] pairs\r\n// x represents one data item e.g. [<time>, <value>]\r\nlegend(x) {\r\n    if (x[1] > 0) {\r\n        return [\r\n            ['Buy', $props.buyColor],\r\n            [x[2], $core.colors.text],\r\n            [x[3]]\r\n        ]\r\n    } else {\r\n        return [\r\n            ['Sell', $props.sellColor],\r\n            [x[2], $core.colors.text],\r\n            [x[3]]\r\n        ]\r\n    }\r\n}\r\n";
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Trades
}, Symbol.toStringTag, { value: "Module" }));
const Volume = "// Navy ~ 0.2-lite\r\n\r\n// <ds>Regular volume</ds> \r\n// Format: [<timestamp>, <volume>, <direction>]\r\n// <direction> :: 1 for green volume, - 1 for red volume\r\n\r\n[OVERLAY name=Volume, ctx=Canvas, verion=1.0.0]\r\n\r\n// Overlay props\r\nprop('colorVolUp', { type: 'color', def: '#41a37682' })\r\nprop('colorVolDw', { type: 'color', def: '#de464682' })\r\nprop('barsHeight', { type: 'number', def: 0.15, step: 0.1 })\r\nprop('currencySymbol', { type: 'string', def: '$' })\r\nprop('showAvgVolume', { type: 'boolean', def: true })\r\nprop('avgVolumeSMA', { type: 'number', def: 20 })\r\nprop('colorAvgVol', { type: 'color', def: '#17e2bb99'})\r\n\r\n// Draw call\r\ndraw(ctx) {\r\n\r\n    let height = $core.id === 0 ? 0.8 : $props.barsHeight\r\n    let cnv = $lib.layoutCnv($core, false, true, 1, 2, height)\r\n    let bars = cnv.upVolbars.length ? cnv.upVolbars : cnv.dwVolbars\r\n    if (!bars.length) return\r\n\r\n    drawCvPart(ctx, $lib.volumeBar, cnv.dwVolbars, 'colorVolDw')\r\n    drawCvPart(ctx, $lib.volumeBar, cnv.upVolbars, 'colorVolUp')\r\n\r\n    if ($props.showAvgVolume) $lib.avgVolume(ctx, $core, $props, cnv, 1)\r\n}\r\n\r\n// Draw candle part\r\ndrawCvPart(ctx, f, arr, color) {\r\n    let layout = $core.layout\r\n    ctx.strokeStyle = $props[color]\r\n    ctx.beginPath()\r\n    for (var i = 0, n = arr.length; i < n; i++) {\r\n        f(ctx, arr[i], layout)\r\n    }\r\n    ctx.stroke()\r\n}\r\n\r\n// Custom y-range\r\nyRange(data, hi, lo) {\r\n    // Remove this overlay for yRange calculation\r\n    // if it's not the main overlay of the pane\r\n    if ($core.id !== 0) {\r\n        return null\r\n    } else {\r\n        return [hi, lo, false]\r\n    }\r\n}\r\n\r\n// Legend, defined as pairs [value, color]\r\nlegend(x) {\r\n    let v = $core.cursor.getValue($core.paneId, $core.id)\r\n    let sym = $props.currencySymbol\r\n    let color = v[2] > 0 ?\r\n        $props.colorVolUp : $props.colorVolDw\r\n    let fc = $lib.formatCash\r\n    return [[sym + fc(x[1]), color.slice(0, 7)]]\r\n}\r\n";
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Volume
}, Symbol.toStringTag, { value: "Module" }));
const VolumeDelta = `// Navy ~ 0.2-lite\r
\r
// <ds>Volume bars with delta ( = buyVol - sellVol)</ds>\r
// Format: [<timestamp>, <buyVol>, <sellVol>, <total>, <delta>]\r
\r
[OVERLAY name=VolumeDelta, ctx=Canvas, verion=1.0.0]\r
\r
// Overlay props\r
prop('colorVolUp', { type: 'color', def: '#41a37682' })\r
prop('colorVolDw', { type: 'color', def: '#de464682' })\r
prop('colorVolDeltaUp', { type: 'color', def: '#41a376' })\r
prop('colorVolDeltaDw', { type: 'color', def: '#de4646' })\r
prop('barsHeight', { type: 'number', def: 0.15, step: 0.1 })\r
\r
// Draw call\r
draw(ctx) {\r
\r
    let height = $core.id === 0 ? 0.8 : $props.barsHeight\r
    let cnv = $lib.layoutCnv($core, false, true, 1, 4, height)\r
    let bars = cnv.upVolbars.length ? cnv.upVolbars : cnv.dwVolbars\r
    if (!bars.length) return\r
\r
    drawCvPart(ctx, $lib.volumeBar, cnv.dwVolbars, 'colorVolDw')\r
    drawCvPart(ctx, $lib.volumeBar, cnv.upVolbars, 'colorVolUp')\r
\r
    let dwDelta = makeDelta(cnv.dwVolbars)\r
    let upDelta = makeDelta(cnv.upVolbars)\r
\r
    drawCvPart(ctx, $lib.volumeBar, dwDelta, 'colorVolDeltaDw')\r
    drawCvPart(ctx, $lib.volumeBar, upDelta, 'colorVolDeltaUp')\r
\r
}\r
\r
// Draw candle part\r
drawCvPart(ctx, f, arr, color) {\r
    let layout = $core.layout\r
    ctx.strokeStyle = $props[color]\r
    ctx.beginPath()\r
    for (var i = 0, n = arr.length; i < n; i++) {\r
        f(ctx, arr[i], layout)\r
    }\r
    ctx.stroke()\r
}\r
\r
makeDelta(bars) {\r
    let delta = []\r
    for (var bar of bars) {\r
        let src = bar.src\r
        let k = Math.abs(src[4]) / src[3]\r
        bar.h =  bar.h * k\r
        delta.push(bar)\r
    }\r
    return delta\r
}\r
\r
// Custom y-range\r
yRange(data, hi, lo) {\r
    // Remove this overlay for yRange calculation\r
    // if it's not the main overlay of the pane\r
    if ($core.id !== 0) {\r
        return null\r
    } else {\r
        return [hi, lo, false]\r
    }\r
}\r
\r
// Legend, defined as pairs [value, color]\r
legendHtml(x) {\r
    let v = $core.cursor.getValue($core.paneId, $core.id)\r
    let sym = $props.currencySymbol\r
    let color1 = $core.colors.text\r
    let color2 = v[4] > 0 ?\r
        $props.colorVolDeltaUp : $props.colorVolDeltaDw\r
    let fc = $lib.formatCash\r
    let sign = v[4] > 0 ? '+' : ''\r
    return \`\r
    <span style="color: \${color2}">\r
        <span style="margin-left: 3px;"></span>\r
        <span style="color: \${color1}">B</span>\r
        <span class="nvjs-ll-value">\${fc(x[1])}</span>\r
        <span style="color: \${color1}">S</span>\r
        <span class="nvjs-ll-value">\${fc(x[2])}</span>\r
        <span style="color: \${color1}">Σ</span>\r
        <span class="nvjs-ll-value">\${fc(x[3])}</span>\r
        <span style="color: \${color1}">Δ</span>\r
        <span class="nvjs-ll-value">\${sign}\${fc(x[4])}</span>\r
    \`\r
    //return [[sym + fc(x[1]), color.slice(0, 7)]]\r
}\r
`;
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: VolumeDelta
}, Symbol.toStringTag, { value: "Module" }));
const area = `\r
// NavyJS ~ 0.2-lite\r
\r
// <ds>Area chart</ds>, format: [<timestamp>, <value>]\r
\r
[OVERLAY name=Area, ctx=Canvas, version=1.0.0]\r
\r
// Define new props\r
prop('color', { type: 'color', def: '#31ce31' })\r
prop('lineWidth', { type: 'number', def: 1.25 })\r
prop('back1', { type: 'color', def: $props.color + '15' })\r
prop('back2', { type: 'color', def: $props.color + '01' })\r
prop('dataIndex', { type: 'integer', def: 1 })\r
\r
draw(ctx) {\r
   \r
    const layout = $core.layout\r
    const data = $core.data // Full dataset\r
    const view = $core.view // Visible view\r
    const idx = $props.dataIndex\r
    const grd = ctx.createLinearGradient(0, 0, 0, layout.height)\r
    grd.addColorStop(0, $props.back1)\r
    grd.addColorStop(1, $props.back2)\r
\r
    // Line\r
    ctx.lineWidth = $props.lineWidth\r
    ctx.strokeStyle = $props.color\r
    ctx.lineJoin = "round"\r
    ctx.beginPath()\r
    for (var i = view.i1, n = view.i2; i <= n; i++) {\r
        let p = data[i]\r
        let x = layout.ti2x(p[0], i)\r
        let y = layout.value2y(p[idx])\r
        ctx.lineTo(x, y)\r
    }\r
    ctx.stroke()\r
\r
    // Area\r
    ctx.fillStyle = grd\r
    ctx.beginPath()\r
    let p0 = (data[0] || [])[0]\r
    let pN = (data[data.length - 1] || [])[0]\r
    ctx.lineTo(layout.ti2x(p0, 0), layout.height)\r
    for (var i = view.i1, n = view.i2; i <= n; i++) {\r
        let p = data[i]\r
        let x = layout.ti2x(p[0], i)\r
        let y = layout.value2y(p[idx])\r
        ctx.lineTo(x, y)\r
    }\r
    ctx.lineTo(layout.ti2x(pN, i - 1), layout.height)\r
    ctx.fill()\r
\r
}\r
\r
// Precision sampling\r
preSampler(x) => [x[$props.dataIndex]]\r
\r
// Map data item to OHLC (for candle magnets etc.)\r
// Here we simulate a candle with 0 height\r
ohlc(x) => Array(4).fill(x[$props.dataIndex])\r
\r
// Legend, defined as pairs [value, color]\r
yRange(data) {\r
    let di = $props.dataIndex\r
    let len = data.length\r
    var h, l, high = -Infinity, low = Infinity\r
    for(var i = 0; i < len; i++) {\r
        let point = data[i][di]\r
        if (point > high) high = point\r
        if (point < low) low = point\r
    }\r
    return [high, low]\r
}\r
\r
// Legend, defined as pairs [value, color]\r
legend(x) => [[x[$props.dataIndex], $props.color]]\r
`;
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: area
}, Symbol.toStringTag, { value: "Module" }));
const candles = `\r
// NavyJS ~ 0.2-lite\r
\r
// <ds>Standart japanese candles</ds>, format:\r
// [<timestamp>, <open>, <high>, <low>, <close>, <?volume>]\r
\r
[OVERLAY name=Candles, ctx=Canvas, version=1.0.0]\r
\r
// Define the props\r
prop('colorBodyUp', { type: 'color', def: $core.colors.candleUp })\r
prop('colorBodyDw', { type: 'color', def: $core.colors.candleDw })\r
prop('colorWickUp', { type: 'color', def: $core.colors.wickUp })\r
prop('colorWickDw', { type: 'color', def: $core.colors.wickDw })\r
prop('colorVolUp', { type: 'color', def: $core.colors.volUp })\r
prop('colorVolDw', { type: 'color', def: $core.colors.volDw })\r
prop('showVolume', { type: 'boolean', def: true })\r
prop('currencySymbol', { type: 'string', def: '$' })\r
prop('showAvgVolume', { type: 'boolean', def: true })\r
prop('avgVolumeSMA', { type: 'number', def: 20 })\r
prop('colorAvgVol', { type: 'color', def: '#1cccb777'})\r
prop('scaleSymbol', { type: 'string|boolean', def: false })\r
prop('priceLine', { type: 'boolean', def: true })\r
prop('showValueTracker', { type: 'boolean', def: true })\r
\r
\r
// Draw call\r
draw(ctx) {\r
\r
    let cnv = $lib.layoutCnv($core, true, $props.showVolume)\r
    let bodies = cnv.upBodies.length ? cnv.upBodies : cnv.dwBodies\r
    if (!bodies.length) return\r
    let w = Math.max(bodies[0].w, 1)\r
\r
    drawCvPart(ctx, $lib.candleWick, cnv.dwWicks, 1, 'colorWickDw')\r
    drawCvPart(ctx, $lib.candleWick, cnv.upWicks, 1, 'colorWickUp')\r
    drawCvPart(ctx, $lib.candleBody, cnv.dwBodies, w, 'colorBodyDw')\r
    drawCvPart(ctx, $lib.candleBody, cnv.upBodies, w, 'colorBodyUp')\r
    drawCvPart(ctx, $lib.volumeBar, cnv.dwVolbars, w, 'colorVolDw')\r
    drawCvPart(ctx, $lib.volumeBar, cnv.upVolbars, w, 'colorVolUp')\r
\r
    if ($props.showVolume && $props.showAvgVolume) {\r
        $lib.avgVolume(ctx, $core, $props, cnv)\r
    }\r
\r
}\r
\r
// Draw candle part\r
drawCvPart(ctx, f, arr, w, color) {\r
    let layout = $core.layout\r
    ctx.lineWidth = w\r
    ctx.strokeStyle = $props[color]\r
    ctx.beginPath()\r
    for (var i = 0, n = arr.length; i < n; i++) {\r
        f(ctx, arr[i], layout)\r
    }\r
    ctx.stroke()\r
}\r
\r
// Define y-range (by finding max High, min Low)\r
static yRange(data) {\r
    let len = data.length\r
    var h, l, high = -Infinity, low = Infinity\r
    for(var i = 0; i < len; i++) {\r
        let point = data[i]\r
        if (point[2] > high) high = point[2]\r
        if (point[3] < low) low = point[3]\r
    }\r
    return [high, low]\r
}\r
\r
// Use [Open, Close] for precision detection\r
static preSampler(x) => [x[1], x[4]]\r
\r
// Map data item to OHLC (for candle magnets etc.)\r
ohlc(x) => [x[1], x[2], x[3], x[4]]\r
\r
// Price label + Scale symbol + price line\r
valueTracker(x) => {\r
    show: $props.showValueTracker,\r
    symbol: $props.scaleSymbol,\r
    line: $props.priceLine,\r
    color: $lib.candleColor($props, $core.data[$core.data.length - 1]),\r
    value: x[4] // close\r
}\r
\r
// Define the OHLCV legend\r
legendHtml(x, prec, f) {\r
    let color1 = $core.colors.text\r
    let v = $core.cursor.getValue($core.paneId, $core.id)\r
    let sym = $props.currencySymbol\r
    let color2 = v[4] >= v[1] ?\r
        $props.colorBodyUp : $props.colorBodyDw\r
    let fc = $lib.formatCash\r
    return \`\r
    <span style="color: \${color2}">\r
        <span style="margin-left: 3px;"></span>\r
        <span style="color: \${color1}">O</span>\r
        <span class="nvjs-ll-value">\${f(x[1])}</span>\r
        <span style="color: \${color1}">H</span>\r
        <span class="nvjs-ll-value">\${f(x[2])}</span>\r
        <span style="color: \${color1}">L</span>\r
        <span class="nvjs-ll-value">\${f(x[3])}</span>\r
        <span style="color: \${color1}">C</span>\r
        <span class="nvjs-ll-value">\${f(x[4])}</span>\r
    \`\r
    + ($props.showVolume ? \`\r
        <span style="color: \${color1}">V</span>\r
        <span class="nvjs-ll-value">\${sym+fc(x[5])}</span>\` : \`\`)\r
    + \`</span>\`\r
    }\r
`;
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: candles
}, Symbol.toStringTag, { value: "Module" }));
const spline = `\r
// NavyJS ~ 0.2-lite\r
\r
// <ds>Single spline</ds>\r
// Format: [<timestamp>, <number>]\r
\r
[OVERLAY name=Spline, ctx=Canvas, version=1.1.0]\r
\r
// Define new props\r
prop('color', { type: 'color', def: '#31ce31' })\r
prop('lineWidth', { type: 'number', def: 1 })\r
prop('dataIndex', { type: 'integer', def: 1 })\r
\r
\r
draw(ctx) {\r
    ctx.lineWidth = $props.lineWidth\r
    ctx.lineJoin = "round"\r
    ctx.strokeStyle = $props.color\r
    ctx.beginPath()\r
    const layout = $core.layout\r
    const data = $core.data // Full dataset\r
    const view = $core.view // Visible view\r
    const idx = $props.dataIndex\r
    for (var i = view.i1, n = view.i2; i <= n; i++) {\r
        let p = data[i]\r
        let x = layout.ti2x(p[0], i)\r
        let y = layout.value2y(p[idx])\r
        ctx.lineTo(x, y)\r
    }\r
    ctx.stroke()\r
}\r
\r
// Price label + Scale symbol + price line\r
/*valueTracker(x) => {\r
    show: true,\r
    symbol: $core.src.name,\r
    line: true,\r
    color: $props.color,\r
    value: x[$props.dataIndex]\r
}*/\r
\r
preSampler(x) => [x[$props.dataIndex]]\r
\r
// Map data item to OHLC (for candle magnets etc.)\r
// Here we simulate a candle with 0 height\r
ohlc(x) => Array(4).fill(x[$props.dataIndex])\r
\r
yRange(data) {\r
    let di = $props.dataIndex\r
    let len = data.length\r
    var h, l, high = -Infinity, low = Infinity\r
    for(var i = 0; i < len; i++) {\r
        let point = data[i][di]\r
        if (point > high) high = point\r
        if (point < low) low = point\r
    }\r
    return [high, low]\r
}\r
\r
// Legend, defined as pairs [value, color]\r
legend(x) => [[x[$props.dataIndex], $props.color]]\r
`;
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: spline
}, Symbol.toStringTag, { value: "Module" }));
const LineTool = "// Navy ~ 0.2-lite\r\n// <ds>Drawing lines [Tap + Hold]</ds>\r\n\r\n[OVERLAY name=LineTool, ctx=Canvas, verion=1.0.0]\r\n\r\nlet timeId = null\r\nlet mouseX = 0\r\nlet lines = {} // Line objects stored by uuid\r\n\r\ninit() {\r\n    // Restore lines from dataExt\r\n    for (var line of $core.dataExt.lines || []) {\r\n        lines[line.uuid] = new $lib.TrendLine($core, line)\r\n        lines[line.uuid].onSelect = lineSelected\r\n    }\r\n}\r\n\r\ndraw(ctx) {\r\n    for (var line of Object.values(lines)) {\r\n        line.draw(ctx)\r\n    }\r\n}\r\n\r\nnewLine() {\r\n\r\n    if (unfinishedLines() || mouseMoved()) return\r\n\r\n    if (!$core.dataExt.lines) {\r\n        $core.dataExt.lines = []\r\n    }\r\n\r\n    let t = $core.cursor.time\r\n    let $ = $core.layout.y2value($core.cursor.y)\r\n    let uuid = $lib.Utils.uuid3()\r\n    \r\n    let line = {\r\n        type: 'segment',\r\n        p1: [t, $],\r\n        p2: [t, $],\r\n        uuid: uuid\r\n    }\r\n    $core.dataExt.lines.push(line)\r\n    lines[uuid] = new $lib.TrendLine($core, line, true)\r\n    lines[uuid].onSelect = lineSelected\r\n    lines[uuid].selected = true\r\n\r\n    $events.emit('scroll-lock', true)\r\n    $events.emit('update-layout')\r\n\r\n}\r\n\r\nlineSelected($uuid) {\r\n    for (var uuid in lines) {\r\n        lines[uuid].selected = uuid === $uuid\r\n    }\r\n    $events.emit('update-layout')\r\n}\r\n\r\nunfinishedLines() {\r\n    for (var line of Object.values(lines)) {\r\n        if (line.pins.some(x => x.state !== 'settled')) {\r\n            return true\r\n        }\r\n    }\r\n    return false\r\n}\r\n\r\nmouseMoved() {\r\n    let d = Math.abs(mouseX - $core.mouse.x)\r\n    return d > 5\r\n}\r\n\r\nremoveLine(uuid) {\r\n    delete lines[uuid]\r\n    $core.dataExt.lines.filter(x => x.uuid !== uuid)\r\n    $events.emit('update-layout')\r\n}\r\n\r\npropagate(name, data) {\r\n    // TODO: sort by z-index\r\n    for (var line of Object.values(lines)) {\r\n        line[name](data)\r\n    }\r\n} \r\n\r\nmousedown(event) {\r\n    timeId = setTimeout(newLine, 1000)\r\n    mouseX = $core.mouse.x\r\n    lineSelected(null)\r\n    $events.emit('update-layout')\r\n    propagate('mousedown', event)\r\n}\r\n\r\nmouseup(event) {\r\n    clearTimeout(timeId)\r\n    timeId = null\r\n    propagate('mouseup', event)\r\n}\r\n\r\nmousemove(event) {\r\n    propagate('mousemove', event)\r\n}\r\n\r\nkeydown(event) {\r\n    if (event.code === 'Backspace') {\r\n        let s = Object.values(lines).find(x => x.selected)\r\n        if (s) removeLine(s.data.uuid)\r\n    }\r\n}\r\n\r\nlegend() => null";
const __vite_glob_1_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LineTool
}, Symbol.toStringTag, { value: "Module" }));
const RangeTool = "// Navy ~ 0.2-lite\r\n// <ds>Time & value measurment tool [Shift+Click]</ds>\r\n\r\n[OVERLAY name=RangeTool, ctx=Canvas, verion=1.0.1, author=GPT4]\r\n\r\nlet pin1 = null \r\nlet pin2 = null \r\nlet shift = false\r\nlet state = 'idle'\r\n\r\n// TODO: fix for index-based\r\ndraw(ctx) {\r\n    const layout = $core.layout \r\n\r\n    if (pin1 && pin2) {\r\n        const x1 = layout.time2x(pin1.t) // time to x coordinate\r\n        const x2 = layout.time2x(pin2.t) // time to x coordinate\r\n        const y1 = layout.value2y(pin1.v) // value to y coordinate\r\n        const y2 = layout.value2y(pin2.v) // value to y coordinate\r\n\r\n         // change fill color based on percentage\r\n        let color = percent() >= 0 ? '#3355ff' : '#ff3333';\r\n        ctx.fillStyle = color + '33';\r\n        ctx.fillRect(x1, y1, x2 - x1, y2 - y1)\r\n\r\n        // draw arrows in the middle of rectangle\r\n        let midX = (x1 + x2) / 2;\r\n        let midY = (y1 + y2) / 2;\r\n        $lib.drawArrow(ctx, midX, y1, midX, y2, color, Math.abs(y2 - y1) > 42); \r\n        $lib.drawArrow(ctx, x1, midY, x2, midY, color, Math.abs(x2 - x1) > 42);  \r\n\r\n        // draw rounded rectangle with text\r\n        const text1 = `${deltaValue().toFixed(2)} (${percent().toFixed(2)}%)`;\r\n        const text2 = `${bars()} bars, ${timeText()}`;\r\n        const text = `${text1}\\n${text2}`;\r\n        const textWidth = ctx.measureText(text).width;\r\n        \r\n        const padding = 10;\r\n        const mainRectCenterX = (x1 + x2) / 2; // calculate center of the main rectangle\r\n        const roundRectX = mainRectCenterX - textWidth / 2 - padding; // center the text rectangle relative to the main rectangle\r\n        const roundRectWidth = textWidth + 2 * padding;\r\n        const roundRectHeight = 50;  // adjust as needed\r\n        const roundRectY = percent() > 0 ? Math.min(y1, y2) - roundRectHeight - padding : Math.max(y1, y2) + padding;\r\n        const roundRectRadius = 5;   // adjust as needed\r\n        ctx.fillStyle = color + 'cc';\r\n        $lib.roundRect(ctx, roundRectX, roundRectY, roundRectWidth, roundRectHeight, roundRectRadius);\r\n\r\n        // draw text\r\n        ctx.fillStyle = '#ffffffcc' // color;\r\n        ctx.font = $lib.rescaleFont($core.props.config.FONT, 14);\r\n        ctx.textAlign = 'center';\r\n        ctx.textBaseline = 'middle';\r\n        ctx.fillText(text1, roundRectX + roundRectWidth / 2, roundRectY + roundRectHeight / 4);\r\n        ctx.fillText(text2, roundRectX + roundRectWidth / 2, roundRectY + 3 * roundRectHeight / 4);\r\n      \r\n    }\r\n}\r\n\r\n// Calculate the percentage of the are between pins v-values\r\n// assuming that pin2 is above pin1 equals positive value\r\n// and negative otherwise\r\npercent() {\r\n    if (pin1 && pin2) {\r\n        let delta = pin2.v - pin1.v;\r\n        return (delta / pin1.v) * 100;\r\n    }\r\n    return 0;\r\n}\r\n\r\n// Calculate delta time between pins t-values\r\n// assuming that pin2 on the right of pin1 equals positive value\r\n// and negative otherwise\r\ndeltaTime() {\r\n    if (pin1 && pin2) {\r\n        return pin2.t - pin1.t\r\n    }\r\n    return 0\r\n}\r\n\r\n// Calculate delta value between pins v-values\r\n// assuming that pin2 is above pin1 equals positive value\r\n// and negative otherwise\r\ndeltaValue() {\r\n    if (pin1 && pin2) {\r\n        return pin2.v - pin1.v\r\n    }\r\n    return 0\r\n}\r\n\r\n// Delta time in bars\r\nbars() {\r\n    let data = $core.hub.mainOv.dataSubset\r\n    if (pin1 && pin2) {\r\n        const layout = $core.layout\r\n        const bars = data.filter(bar => {\r\n            return bar[0] >= Math.min(pin1.t, pin2.t) && bar[0] <= Math.max(pin1.t, pin2.t)\r\n        });\r\n        let count = bars.length - 1; // reduce the count by 1\r\n        return pin2.t < pin1.t ? -count : count; // make it negative if pin2.t < pin1.t\r\n    }\r\n    return 0\r\n}\r\n\r\n// Delta time in text format\r\ntimeText() {\r\n    let deltaTimeMs = deltaTime();  // returns delta time in milliseconds\r\n    let timeFrameMs = $core.props.timeFrame;  // returns current chart timeframe in milliseconds\r\n\r\n    let negative = deltaTimeMs < 0;\r\n    deltaTimeMs = Math.abs(deltaTimeMs);\r\n\r\n    let minutes = Math.floor((deltaTimeMs / (1000 * 60)) % 60);\r\n    let hours = Math.floor((deltaTimeMs / (1000 * 60 * 60)) % 24);\r\n    let days = Math.floor(deltaTimeMs / (1000 * 60 * 60 * 24));\r\n\r\n    let result = \"\";\r\n    if (days > 0) {\r\n        result += days + \"d \";\r\n    }\r\n    if ((hours > 0 || days > 0) && hours !== 0) {\r\n        result += hours + \"h \";\r\n    }\r\n    if (minutes > 0 && timeFrameMs < 60 * 60 * 1000 && minutes !== 0) {\r\n        result += minutes + \"m\";\r\n    }\r\n\r\n    return (negative ? '-' : '') + result.trim();\r\n}\r\n\r\n\r\n\r\nkeydown(event) {\r\n    if (event.key === 'Shift') {\r\n        shift = true\r\n    }\r\n}\r\n\r\nkeyup(event) {\r\n    if (event.key === 'Shift') {\r\n        shift = false\r\n    }\r\n}\r\n\r\nmousedown(event) {\r\n    const layout = $core.layout \r\n    if (state === 'idle' && shift) {\r\n        // Create the first pin \r\n        pin1 = {\r\n            t: $core.cursor.time,\r\n            v: layout.y2value(event.layerY)\r\n        }\r\n        pin2 = { ...pin1 }\r\n        state = 'drawing'\r\n    } else if (state === 'drawing') {\r\n        state = 'finished'\r\n    } else if (state === 'finished') {\r\n        state = 'idle'\r\n        pin1 = null \r\n        pin2 = null \r\n    }\r\n    $events.emitSpec('chart', 'update-layout')\r\n}\r\n\r\nmousemove(event) {\r\n    if (state === 'drawing') {\r\n        const layout = $core.layout \r\n        // Create the second pin \r\n        pin2 = {\r\n            t: $core.cursor.time,\r\n            v: layout.y2value(event.layerY)\r\n        }\r\n    }\r\n}\r\n\r\n// Disable legend by returning null\r\nlegend() => null\r\n";
const __vite_glob_1_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RangeTool
}, Symbol.toStringTag, { value: "Module" }));
const ALMA = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Arnaud Legoux Moving Average</ds>\r\n\r\n[INDICATOR name=ALMA, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 10 })\r\nprop('offset', { type: 'number', def: 0.9 })\r\nprop('sigma', { type: 'number', def: 5 })\r\nprop('color', { type: 'color', def: '#559de0' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nlet $ = $props\r\n\r\nthis.specs = {\r\n    name: `ALMA ${$.length} ${$.offset} ${$.sigma}`,\r\n    props: {\r\n        color: $props.color,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet length = $props.length\r\nlet offset = $props.offset\r\nlet sigma = $props.sigma\r\n\r\nSpline(alma(close, length, offset, sigma), this.specs)\r\n";
const __vite_glob_2_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ALMA
}, Symbol.toStringTag, { value: "Module" }));
const ATR = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Average True Range</ds>\r\n\r\n[INDICATOR name=ATR, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 15 })\r\nprop('color', { type: 'color', def: '#e52468' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: 'ATR ' + $props.length,\r\n    props: {\r\n        color: $props.color\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nSpline(atr($props.length), this.specs)\r\n";
const __vite_glob_2_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ATR
}, Symbol.toStringTag, { value: "Module" }));
const ATRp = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Average True Range, percentage</ds>\r\n\r\n[INDICATOR name=ATRp, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 15 })\r\nprop('color', { type: 'color', def: '#f44336' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: 'ATR% ' + $props.length,\r\n    props: {\r\n        color: $props.color\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet k = 100 / close[0]\r\nSpline(atr($props.length)[0] * k, this.specs)\r\n";
const __vite_glob_2_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ATRp
}, Symbol.toStringTag, { value: "Module" }));
const BB = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Bollinger Bands</ds>\r\n\r\n[INDICATOR name=BB, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 21 })\r\nprop('stddev', { type: 'number', def: 2 })\r\nprop('color', { type: 'color', def: '#2cc6c9ab' })\r\nprop('backColor', { type: 'color', def: '#2cc6c90a' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `BB ${$props.length} ${$props.stddev}`,\r\n    props: {\r\n        color: $props.color,\r\n        backColor: $props.backColor,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet length = $props.length\r\nlet stddev = $props.stddev\r\nlet [m, h, l] = bb(close, length, stddev)\r\nBand([h[0], m[0], l[0]], this.specs)\r\n";
const __vite_glob_2_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BB
}, Symbol.toStringTag, { value: "Module" }));
const BBW = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Bollinger Bands Width</ds>\r\n\r\n[INDICATOR name=BBW, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 21 })\r\nprop('stddev', { type: 'number', def: 2 })\r\nprop('color', { type: 'color', def: '#2cc6c9ab' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `BBW ${$props.length} ${$props.stddev}`,\r\n    props: {\r\n        color: $props.color,\r\n        backColor: $props.backColor,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet length = $props.length\r\nlet stddev = $props.stddev\r\nSpline(bbw(close, length, stddev), this.specs)\r\n";
const __vite_glob_2_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BBW
}, Symbol.toStringTag, { value: "Module" }));
const CCI = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Commodity Channel Index</ds>\r\n\r\n[INDICATOR name=CCI, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 21 })\r\nprop('upperBand', { type: 'number', def: 100 })\r\nprop('lowerBand', { type: 'number', def: -100 })\r\nprop('color', { type: 'color', def: '#e28a3dee' })\r\nprop('backColor', { type: 'color', def: '#e28a3d11' })\r\nprop('bandColor', { type: 'color', def: '#999999' })\r\nprop('prec', { type: 'integer', def: 2 })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: 'CCI ' + $props.length,\r\n    props: {\r\n        color: $props.color,\r\n        backColor: $props.backColor,\r\n        bandColor: $props.bandColor,\r\n        upperBand: $props.upperBand,\r\n        lowerBand: $props.lowerBand,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nRange(cci(close, $props.length), this.specs)\r\n";
const __vite_glob_2_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CCI
}, Symbol.toStringTag, { value: "Module" }));
const CMO = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Chande Momentum Oscillator</ds>\r\n\r\n[INDICATOR name=CMO, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 10 })\r\nprop('color', { type: 'color', def: '#559de0' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `CMO ${$props.length}`,\r\n    props: {\r\n        color: $props.color\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet length = $props.length\r\nSpline(cmo(close, length), this.specs)\r\n";
const __vite_glob_2_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CMO
}, Symbol.toStringTag, { value: "Module" }));
const COG = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Center of Gravity</ds>\r\n\r\n[INDICATOR name=COG, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 10 })\r\nprop('color', { type: 'color', def: '#559de0' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `COG ${$props.length}`,\r\n    props: {\r\n        color: $props.color\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet length = $props.length\r\nSpline(cog(close, length), this.specs)\r\n";
const __vite_glob_2_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: COG
}, Symbol.toStringTag, { value: "Module" }));
const DMI = `\r
// Navy ~ 0.2-lite\r
// <ds>Directional Movement Index</ds>\r
\r
[INDICATOR name=DMI, version=1.0.0]\r
\r
prop('length', { type: 'integer', def: 15 })\r
prop('smooth', { type: 'integer', def: 15 })\r
prop('color1', { type: 'color', def: "#ef1360" })\r
prop('color2', { type: 'color', def: "#3782f2" })\r
prop('color3', { type: 'color', def: "#f48709" })\r
prop('prec', { type: 'integer', def: 2 })\r
prop('zIndex', { type: 'integer', def: 0 })\r
\r
this.specs = {\r
    name: \`DMI \${$props.length} \${$props.smooth}\`,\r
    props: {\r
        colors: [$props.color1, $props.color2, $props.color3]\r
    },\r
    settings: {\r
        precision: $props.prec,\r
        zIndex: $props.zIndex\r
    }\r
}\r
\r
[UPDATE]\r
\r
let [adx, dp, dn] = dmi($props.length, $props.smooth)\r
Splines([adx[0], dp[0], dn[0]], this.specs)\r
`;
const __vite_glob_2_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DMI
}, Symbol.toStringTag, { value: "Module" }));
const EMA = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Exponential Moving Average</ds>\r\n\r\n[INDICATOR name=EMA, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 12 })\r\nprop('color', { type: 'color', def: '#f7890c' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `EMA ${$props.length}`,\r\n    props: {\r\n        color: $props.color,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nSpline(ema(close, $props.length), this.specs)\r\n";
const __vite_glob_2_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EMA
}, Symbol.toStringTag, { value: "Module" }));
const HMA = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Hull Moving Average</ds>\r\n\r\n[INDICATOR name=HMA, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 10 })\r\nprop('color', { type: 'color', def: '#3af475' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `HMA ${$props.length}`,\r\n    props: {\r\n        color: $props.color,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nSpline(hma(close, $props.length), this.specs)\r\n";
const __vite_glob_2_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HMA
}, Symbol.toStringTag, { value: "Module" }));
const Ichimoku = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Ichimoku Cloud</ds>\r\n\r\n[INDICATOR name=Ichimoku, version=1.0.0]\r\n\r\nprop('convLength', { type: 'integer', def: 9 })\r\nprop('baseLength', { type: 'integer', def: 26 })\r\nprop('laggingLength', { type: 'integer', def: 52 })\r\nprop('displacement', { type: 'integer', def: 26 })\r\nprop('cloudUpColor', { type: 'color', def: '#79ffde18' })\r\nprop('cloudDwColor', { type: 'color', def: '#ff246c18' })\r\nprop('convColor', { type: 'color', def: '#4eb6d8' })\r\nprop('baseColor', { type: 'color', def: '#d626a1' })\r\nprop('laggingColor', { type: 'color', def: '#66cc66' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = ({name, props}) => ({\r\n    name: name,\r\n    props: props,\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n})\r\n\r\n[UPDATE]\r\n\r\nlet $ = $props\r\nlet donchian = (len, id) => ts(\r\n    avg(lowest(low, len)[0], highest(high, len)[0]), id\r\n)\r\nlet conversionLine = donchian($.convLength, 1)\r\nlet baseLine = donchian($.baseLength, 2)\r\nlet leadLine1 = ts(avg(conversionLine[0], baseLine[0]))\r\nlet leadLine2 = donchian($.laggingLength, 3)\r\nlet lagging = ts(close[0])\r\noffset(leadLine1, $.displacement - 1)\r\noffset(leadLine2, $.displacement - 1)\r\noffset(lagging, -$.displacement + 1)\r\n\r\nCloud([leadLine1, leadLine2], this.specs({\r\n    name: `Cloud`,\r\n    props: {\r\n        back1: $props.cloudUpColor,\r\n        back2: $props.cloudDwColor\r\n    }\r\n}))\r\n\r\nSplines([conversionLine, baseLine], this.specs({\r\n    name: `Base Lines ${$.convLength} ${$.baseLength}`,\r\n    props: {\r\n        colors: [\r\n            $props.convColor,\r\n            $props.baseColor\r\n        ]\r\n    }\r\n}))\r\n\r\nSpline(lagging, this.specs({\r\n    name: `Lagging Span ${$.laggingLength}`,\r\n    props: {\r\n        color: $props.laggingColor\r\n    }\r\n}))\r\n";
const __vite_glob_2_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ichimoku
}, Symbol.toStringTag, { value: "Module" }));
const KC = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Keltner Channels</ds>\r\n\r\n[INDICATOR name=KC, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 20 })\r\nprop('mult', { type: 'number', def: 1 })\r\nprop('trueRange', { type: 'boolean', def: true })\r\nprop('color', { type: 'color', def: '#4c8dffab' })\r\nprop('backColor', { type: 'color', def: '#4c8dff0a' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `KC ${$props.length} ${$props.mult}`,\r\n    props: {\r\n        color: $props.color,\r\n        backColor: $props.backColor,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet $ = $props\r\nlet [m, h, l] = kc(close, $.length, $.mult, $.trueRange)\r\nBand([h[0], m[0], l[0]], this.specs)\r\n";
const __vite_glob_2_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: KC
}, Symbol.toStringTag, { value: "Module" }));
const KCW = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Keltner Channels Width</ds>\r\n\r\n[INDICATOR name=KCW, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 20 })\r\nprop('mult', { type: 'number', def: 1 })\r\nprop('trueRange', { type: 'boolean', def: true })\r\nprop('color', { type: 'color', def: '#4c8dffab' })\r\nprop('backColor', { type: 'color', def: '#4c8dff0a' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `KCW ${$props.length} ${$props.mult}`,\r\n    props: {\r\n        color: $props.color,\r\n        backColor: $props.backColor,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet $ = $props\r\nlet w = kcw(close, $.length, $.mult, $.trueRange)\r\nSpline(w, this.specs)\r\n";
const __vite_glob_2_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: KCW
}, Symbol.toStringTag, { value: "Module" }));
const MACD = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Moving Average Convergence/Divergence</ds>\r\n\r\n[INDICATOR name=MACD, version=1.0.0]\r\n\r\nprop('fast', { type: 'integer', def: 12 })\r\nprop('slow', { type: 'integer', def: 26 })\r\nprop('smooth', { type: 'integer', def: 9 })\r\nprop('colorMacd', { type: 'color', def: '#3782f2' })\r\nprop('colorSignal', { type: 'color', def: '#f48709' })\r\nprop('colorUp', { type: 'Color', def: '#35a776' })\r\nprop('colorDw', { type: 'Color', def: '#e54150' })\r\nprop('colorSemiUp', { type: 'Color', def: '#79e0b3' })\r\nprop('colorSemiDw', { type: 'Color', def: '#ea969e' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nlet $ = $props\r\nthis.specs = {\r\n    name: `MACD ${$.fast} ${$.slow} ${$.smooth}`,\r\n    props: {\r\n        colorValue: $.colorMacd,\r\n        colorSignal: $.colorSignal,\r\n        colorUp: $.colorUp,\r\n        colorDw: $.colorDw,\r\n        colorSemiUp: $.colorSemiUp,\r\n        colorSemiDw: $.colorSemiDw\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet $ = $props\r\nlet [m, s, h] = macd(close, $.fast, $.slow, $.smooth)\r\n\r\nHistogram([h[0], m[0], s[0]], this.specs)\r\n";
const __vite_glob_2_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MACD
}, Symbol.toStringTag, { value: "Module" }));
const MFI = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Money Flow Index	</ds>\r\n\r\n[INDICATOR name=MFI, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 14 })\r\nprop('upperBand', { type: 'number', def: 80 })\r\nprop('lowerBand', { type: 'number', def: 20 })\r\nprop('color', { type: 'color', def: '#85c427ee' })\r\nprop('backColor', { type: 'color', def: '#85c42711' })\r\nprop('bandColor', { type: 'color', def: '#999999' })\r\nprop('prec', { type: 'integer', def: 2 })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: 'MFI ' + $props.length,\r\n    props: {\r\n        color: $props.color,\r\n        backColor: $props.backColor,\r\n        bandColor: $props.bandColor,\r\n        upperBand: $props.upperBand,\r\n        lowerBand: $props.lowerBand,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet hlc3 = ts((high[0] + low[0] + close[0]) / 3)\r\nRange(mfi(hlc3, $props.length), this.specs)\r\n";
const __vite_glob_2_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MFI
}, Symbol.toStringTag, { value: "Module" }));
const MOM = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Momentum</ds>\r\n\r\n[INDICATOR name=MOM, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 11 })\r\nprop('color', { type: 'color', def: '#bcc427ee' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `MOM ${$props.length}`,\r\n    props: {\r\n        color: $props.color\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet length = $props.length\r\nSpline(mom(close, length), this.specs)\r\n";
const __vite_glob_2_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MOM
}, Symbol.toStringTag, { value: "Module" }));
const ROC = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Rate of Change</ds>\r\n\r\n[INDICATOR name=ROC, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 9 })\r\nprop('color', { type: 'color', def: '#279fc4' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `ROC ${$props.length}`,\r\n    props: {\r\n        color: $props.color\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet length = $props.length\r\nSpline(roc(close, length), this.specs)\r\n";
const __vite_glob_2_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ROC
}, Symbol.toStringTag, { value: "Module" }));
const RSI = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Relative Strength Index</ds>\r\n\r\n[INDICATOR name=RSI, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 14 })\r\nprop('color', { type: 'color', def: '#3399ff' })\r\nprop('prec', { type: 'integer', def: 2 })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: 'RSI ' + $props.length,\r\n    props: {\r\n        color: $props.color\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nRange(rsi(close, $props.length), this.specs)\r\n";
const __vite_glob_2_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RSI
}, Symbol.toStringTag, { value: "Module" }));
const Ribbon = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Exponential Moving Average Ribbon</ds>\r\n\r\n[INDICATOR name=Ribbon, version=1.0.0]\r\n\r\nprop('start', { type: 'integer', def: 10 })\r\nprop('number', { type: 'integer', def: 5 })\r\nprop('step', { type: 'integer', def: 10 })\r\nprop('colors', { type: 'array', def: [\"#3aaaf4ee\"] })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `EMA x ${$props.number}`,\r\n    props: {\r\n        colors: $props.colors,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet $ = $props\r\nlet arr = []\r\nfor (var i = 0; i < $.number; i++) {\r\n    let l = $.start + i * $.step\r\n    arr.push(ema(close, l)[0])\r\n}\r\n\r\nSplines(arr, this.specs)\r\n";
const __vite_glob_2_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ribbon
}, Symbol.toStringTag, { value: "Module" }));
const SAR = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Parabolic SAR</ds>\r\n\r\n[INDICATOR name=SAR, version=1.0.0]\r\n\r\nprop('start', { type: 'number', def: 0.02 })\r\nprop('inc', { type: 'number', def: 0.02 })\r\nprop('max', { type: 'number', def: 0.2 })\r\nprop('color', { type: 'color', def: '#35a9c6' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nlet $ = $props\r\nthis.specs = {\r\n    name: `SAR ${$.start} ${$.inc} ${$.max}`,\r\n    props: {\r\n        color: $props.color,\r\n        shape: 'cross'\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet $ = $props\r\nSparse(sar($.start, $.inc, $.max), this.specs)\r\n";
const __vite_glob_2_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SAR
}, Symbol.toStringTag, { value: "Module" }));
const SMA = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Simple Moving Average</ds>\r\n\r\n[INDICATOR name=SMA, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 12 })\r\nprop('color', { type: 'color', def: '#d1385c' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `SMA ${$props.length}`,\r\n    props: {\r\n        color: $props.color,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nSpline(sma(close, $props.length), this.specs)\r\n";
const __vite_glob_2_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SMA
}, Symbol.toStringTag, { value: "Module" }));
const SWMA = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Symmetrically Weighted Moving Average</ds>\r\n\r\n[INDICATOR name=SWMA, version=1.0.0]\r\n\r\nprop('color', { type: 'color', def: '#e57440' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `SWMA`,\r\n    props: {\r\n        color: $props.color,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nSpline(swma(close), this.specs)\r\n";
const __vite_glob_2_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SWMA
}, Symbol.toStringTag, { value: "Module" }));
const Stoch = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Stochastic</ds>, format: [<timestamp>, <kLine>, <dLine>]\r\n\r\n[OVERLAY name=Stoch, version=1.0.0]\r\n\r\nprop('kColor', { type: 'color', def: '#3782f2' })\r\nprop('dColor', { type: 'color', def: '#f48709' })\r\nprop('bandColor', { type: 'color', def: '#535559' })\r\nprop('backColor', { type: 'color', def: '#381e9c16' })\r\nprop('upperBand', { type: 'number', def: 80 })\r\nprop('lowerBand', { type: 'number', def: 20 })\r\n\r\ndraw(ctx) {\r\n    const layout = $core.layout\r\n    const upper = layout.value2y($props.upperBand)\r\n    const lower = layout.value2y($props.lowerBand)\r\n    const data = $core.data\r\n    const view = $core.view\r\n\r\n    // K\r\n    ctx.lineWidth = 1\r\n    ctx.strokeStyle = $props.kColor\r\n    ctx.beginPath()\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[1])\r\n        ctx.lineTo(x, y)\r\n    }\r\n    ctx.stroke()\r\n\r\n    // D\r\n    ctx.strokeStyle = $props.dColor\r\n    ctx.beginPath()\r\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\r\n        let p = data[i]\r\n        let x = layout.ti2x(p[0], i)\r\n        let y = layout.value2y(p[2])\r\n        ctx.lineTo(x, y)\r\n    }\r\n    ctx.stroke()\r\n\r\n    ctx.strokeStyle = $props.bandColor\r\n    ctx.setLineDash([5]) // Will be removed after draw()\r\n    ctx.beginPath()\r\n    // Fill the area between the bands\r\n    ctx.fillStyle = $props.backColor\r\n    ctx.fillRect(0, upper, layout.width, lower - upper)\r\n    // Upper band\r\n    ctx.moveTo(0, upper)\r\n    ctx.lineTo(layout.width, upper)\r\n    // Lower band\r\n    ctx.moveTo(0, lower)\r\n    ctx.lineTo(layout.width, lower)\r\n    ctx.stroke()\r\n}\r\n\r\nyRange(data, hi, lo) => [\r\n    Math.max(hi, $props.upperBand),\r\n    Math.min(lo, $props.lowerBand)\r\n]\r\n\r\n// Legend, defined as pairs [value, color]\r\nlegend(x) => [[x[1], $props.kColor], [x[1], $props.dColor]]\r\n\r\n\r\n[INDICATOR name=Stoch, version=1.0.0]\r\n\r\nprop('paramK', { def: 14 })\r\nprop('paramD', { def: 3 })\r\nprop('smooth', { def: 3 })\r\nprop('kColor', { type: 'color', def: '#3782f2' })\r\nprop('dColor', { type: 'color', def: '#f48709' })\r\nprop('prec', { type: 'integer', def: 2 })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nlet $ = $props\r\nthis.specs = {\r\n    name: `Stoch ${$.paramK} ${$.paramD} ${$.smooth}`,\r\n    props: {\r\n        kColor: $props.kColor,\r\n        dColor: $props.dColor\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet $ = $props\r\nlet k = sma(stoch(close, high, low, $.paramK), $.smooth)\r\nlet d = sma(k, $.paramD)\r\nStoch([k[0], d[0]], this.specs)\r\n";
const __vite_glob_2_23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Stoch
}, Symbol.toStringTag, { value: "Module" }));
const TSI = "\r\n// Navy ~ 0.2-lite\r\n// <ds>True Strength Index</ds>\r\n\r\n[INDICATOR name=TSI, version=1.0.0]\r\n\r\nprop('long', { type: 'integer', def: 25 })\r\nprop('short', { type: 'integer', def: 13 })\r\nprop('signal', { type: 'integer', def: 13 })\r\nprop('color1', { type: 'color', def: '#3bb3e4' })\r\nprop('color2', { type: 'color', def: '#f7046d' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nlet $ = $props\r\nthis.specs = {\r\n    name: `TSI ${$.long} ${$.short} ${$.signal}`,\r\n    props: {\r\n        colors: [$.color1, $.color2]\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nlet $ = $props\r\nlet val = tsi(close, $.short, $.long)\r\nlet sig = ema(val, $.signal)\r\nSplines([val[0] * 100, sig[0] * 100], this.specs)\r\n";
const __vite_glob_2_24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TSI
}, Symbol.toStringTag, { value: "Module" }));
const VWMA = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Volume Weighted Moving Average</ds>\r\n\r\n[INDICATOR name=VWMA, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 20 })\r\nprop('color', { type: 'color', def: '#db0670' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `VWMA ${$props.length}`,\r\n    props: {\r\n        color: $props.color,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nSpline(vwma(close, $props.length), this.specs)\r\n";
const __vite_glob_2_25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: VWMA
}, Symbol.toStringTag, { value: "Module" }));
const WilliamsR = "\r\n// Navy ~ 0.2-lite\r\n// <ds>Williams %R</ds>\r\n\r\n[INDICATOR name=WilliamsR, version=1.0.0]\r\n\r\nprop('length', { type: 'integer', def: 14 })\r\nprop('upperBand', { type: 'number', def: -20 })\r\nprop('lowerBand', { type: 'number', def: -80 })\r\nprop('color', { type: 'color', def: '#0980e8' })\r\nprop('backColor', { type: 'color', def: '#9b9ba316' })\r\nprop('bandColor', { type: 'color', def: '#535559' })\r\nprop('prec', { type: 'integer', def: autoPrec() })\r\nprop('zIndex', { type: 'integer', def: 0 })\r\n\r\nthis.specs = {\r\n    name: `%R ${$props.length}`,\r\n    props: {\r\n        color: $props.color,\r\n        backColor: $props.backColor,\r\n        bandColor: $props.bandColor,\r\n        upperBand: $props.upperBand,\r\n        lowerBand: $props.lowerBand,\r\n    },\r\n    settings: {\r\n        precision: $props.prec,\r\n        zIndex: $props.zIndex\r\n    }\r\n}\r\n\r\n[UPDATE]\r\n\r\nRange(wpr($props.length), this.specs)\r\n";
const __vite_glob_2_26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: WilliamsR
}, Symbol.toStringTag, { value: "Module" }));
var stripComments = { exports: {} };
const compile$1 = (cst, options = {}) => {
  const keepProtected = options.safe === true || options.keepProtected === true;
  let firstSeen = false;
  const walk = (node) => {
    let output = "";
    let inner;
    let lines;
    for (const child of node.nodes) {
      switch (child.type) {
        case "block":
          if (options.first && firstSeen === true) {
            output += walk(child);
            break;
          }
          if (options.preserveNewlines === true) {
            inner = walk(child);
            lines = inner.split("\n");
            output += "\n".repeat(lines.length - 1);
            break;
          }
          if (keepProtected === true && child.protected === true) {
            output += walk(child);
            break;
          }
          firstSeen = true;
          break;
        case "line":
          if (options.first && firstSeen === true) {
            output += child.value;
            break;
          }
          if (keepProtected === true && child.protected === true) {
            output += child.value;
          }
          firstSeen = true;
          break;
        case "open":
        case "close":
        case "text":
        case "newline":
        default: {
          output += child.value || "";
          break;
        }
      }
    }
    return output;
  };
  return walk(cst);
};
var compile_1 = compile$1;
let Node$1 = class Node {
  constructor(node) {
    this.type = node.type;
    if (node.value)
      this.value = node.value;
    if (node.match)
      this.match = node.match;
    this.newline = node.newline || "";
  }
  get protected() {
    return Boolean(this.match) && this.match[1] === "!";
  }
};
let Block$1 = class Block extends Node$1 {
  constructor(node) {
    super(node);
    this.nodes = node.nodes || [];
  }
  push(node) {
    this.nodes.push(node);
  }
  get protected() {
    return this.nodes.length > 0 && this.nodes[0].protected === true;
  }
};
var Node_1 = { Node: Node$1, Block: Block$1 };
var languages$1 = {};
(function(exports) {
  exports.ada = { LINE_REGEX: /^--.*/ };
  exports.apl = { LINE_REGEX: /^⍝.*/ };
  exports.applescript = {
    BLOCK_OPEN_REGEX: /^\(\*/,
    BLOCK_CLOSE_REGEX: /^\*\)/
  };
  exports.csharp = {
    LINE_REGEX: /^\/\/.*/
  };
  exports.haskell = {
    BLOCK_OPEN_REGEX: /^\{-/,
    BLOCK_CLOSE_REGEX: /^-\}/,
    LINE_REGEX: /^--.*/
  };
  exports.javascript = {
    BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/,
    BLOCK_CLOSE_REGEX: /^\*\/(\n?)/,
    LINE_REGEX: /^\/\/(!?).*/
  };
  exports.lua = {
    BLOCK_OPEN_REGEX: /^--\[\[/,
    BLOCK_CLOSE_REGEX: /^\]\]/,
    LINE_REGEX: /^--.*/
  };
  exports.matlab = {
    BLOCK_OPEN_REGEX: /^%{/,
    BLOCK_CLOSE_REGEX: /^%}/,
    LINE_REGEX: /^%.*/
  };
  exports.perl = {
    LINE_REGEX: /^#.*/
  };
  exports.php = {
    ...exports.javascript,
    LINE_REGEX: /^(#|\/\/).*?(?=\?>|\n)/
  };
  exports.python = {
    BLOCK_OPEN_REGEX: /^"""/,
    BLOCK_CLOSE_REGEX: /^"""/,
    LINE_REGEX: /^#.*/
  };
  exports.ruby = {
    BLOCK_OPEN_REGEX: /^=begin/,
    BLOCK_CLOSE_REGEX: /^=end/,
    LINE_REGEX: /^#.*/
  };
  exports.shebang = exports.hashbang = {
    LINE_REGEX: /^#!.*/
  };
  exports.c = exports.javascript;
  exports.csharp = exports.javascript;
  exports.css = exports.javascript;
  exports.java = exports.javascript;
  exports.js = exports.javascript;
  exports.less = exports.javascript;
  exports.pascal = exports.applescript;
  exports.ocaml = exports.applescript;
  exports.sass = exports.javascript;
  exports.sql = exports.ada;
  exports.swift = exports.javascript;
  exports.ts = exports.javascript;
  exports.typscript = exports.javascript;
})(languages$1);
const { Node: Node2, Block: Block2 } = Node_1;
const languages = languages$1;
const constants = {
  ESCAPED_CHAR_REGEX: /^\\./,
  QUOTED_STRING_REGEX: /^(['"`])((?:\\\1|[^\1])*?)(\1)/,
  NEWLINE_REGEX: /^\r*\n/
};
const parse$1 = (input, options = {}) => {
  if (typeof input !== "string") {
    throw new TypeError("Expected input to be a string");
  }
  const cst = new Block2({ type: "root", nodes: [] });
  const stack = [cst];
  const name = (options.language || "javascript").toLowerCase();
  const lang = languages[name];
  if (typeof lang === "undefined") {
    throw new Error(`Language "${name}" is not supported by strip-comments`);
  }
  const { LINE_REGEX, BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX } = lang;
  let block = cst;
  let remaining = input;
  let token;
  let prev;
  const source = [BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX].filter(Boolean);
  let tripleQuotes = false;
  if (source.every((regex) => regex.source === '^"""')) {
    tripleQuotes = true;
  }
  const consume = (value = remaining[0] || "") => {
    remaining = remaining.slice(value.length);
    return value;
  };
  const scan = (regex, type = "text") => {
    const match = regex.exec(remaining);
    if (match) {
      consume(match[0]);
      return { type, value: match[0], match };
    }
  };
  const push = (node) => {
    if (prev && prev.type === "text" && node.type === "text") {
      prev.value += node.value;
      return;
    }
    block.push(node);
    if (node.nodes) {
      stack.push(node);
      block = node;
    }
    prev = node;
  };
  const pop = () => {
    if (block.type === "root") {
      throw new SyntaxError("Unclosed block comment");
    }
    stack.pop();
    block = stack[stack.length - 1];
  };
  while (remaining !== "") {
    if (token = scan(constants.ESCAPED_CHAR_REGEX, "text")) {
      push(new Node2(token));
      continue;
    }
    if (block.type !== "block" && (!prev || !/\w$/.test(prev.value)) && !(tripleQuotes && remaining.startsWith('"""'))) {
      if (token = scan(constants.QUOTED_STRING_REGEX, "text")) {
        push(new Node2(token));
        continue;
      }
    }
    if (token = scan(constants.NEWLINE_REGEX, "newline")) {
      push(new Node2(token));
      continue;
    }
    if (BLOCK_OPEN_REGEX && options.block && !(tripleQuotes && block.type === "block")) {
      if (token = scan(BLOCK_OPEN_REGEX, "open")) {
        push(new Block2({ type: "block" }));
        push(new Node2(token));
        continue;
      }
    }
    if (BLOCK_CLOSE_REGEX && block.type === "block" && options.block) {
      if (token = scan(BLOCK_CLOSE_REGEX, "close")) {
        token.newline = token.match[1] || "";
        push(new Node2(token));
        pop();
        continue;
      }
    }
    if (LINE_REGEX && block.type !== "block" && options.line) {
      if (token = scan(LINE_REGEX, "line")) {
        push(new Node2(token));
        continue;
      }
    }
    if (token = scan(/^[a-zABD-Z0-9\t ]+/, "text")) {
      push(new Node2(token));
      continue;
    }
    push(new Node2({ type: "text", value: consume(remaining[0]) }));
  }
  return cst;
};
var parse_1 = parse$1;
/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */
const compile = compile_1;
const parse = parse_1;
const strip = stripComments.exports = (input, options) => {
  const opts = { ...options, block: true, line: true };
  return compile(parse(input, opts), opts);
};
strip.block = (input, options) => {
  const opts = { ...options, block: true };
  return compile(parse(input, opts), opts);
};
strip.line = (input, options) => {
  const opts = { ...options, line: true };
  return compile(parse(input, opts), opts);
};
strip.first = (input, options) => {
  const opts = { ...options, block: true, line: true, first: true };
  return compile(parse(input, opts), opts);
};
strip.parse = parse;
var stripCommentsExports = stripComments.exports;
const strip$1 = /* @__PURE__ */ getDefaultExportFromCjs(stripCommentsExports);
function decomment(src, file) {
  return strip$1(src);
}
function maskStrings(src, file) {
  let quotes = findStrings(src, file);
  for (var q of quotes) {
    let tmp = src.slice(0, q[0] + 1);
    tmp += src.slice(q[0] + 1, q[1]).replaceAll("/*", "[!C~1!]").replaceAll("//", "[!C~2!]");
    tmp += src.slice(q[1]);
    src = tmp;
  }
  return src;
}
function unmaskStrings(src, file) {
  return src.replaceAll("[!C~1!]", "/*").replaceAll("[!C~2!]", "//");
}
function findStrings(src, file) {
  let count = { "'": 0, '"': 0, "`": 0 };
  let pairs = [];
  let pair = null;
  for (var i = 0; i < src.length; i++) {
    for (var type in count) {
      if (src[i] === type && src[i - 1] !== "\\") {
        count[type]++;
        if (!pair)
          pair = [i, void 0];
      }
      if (src[i] === type && src[i - 1] !== "\\" && i > pair[0]) {
        count[type] = 0;
        if (pair && Object.values(count).every((x) => !x)) {
          pair[1] = i;
          pairs.push(pair);
          pair = null;
        }
      }
      if (count[type] < 0) {
        throw `Missing quote ${type} in ${file}`;
      }
    }
  }
  if (pair !== null) {
    throw `Missing quote in ${file}: ${JSON.stringify(count)}`;
  }
  return pairs;
}
function maskRegex(src, f = btoa) {
  let rex = /\/([^*\/]?.+)\//g;
  do {
    var m = rex.exec(src);
    if (m) {
      let length = m[0].length;
      if (m[1].slice(-1) === "*") {
        length--;
        m[1] = m[1].slice(0, -1);
      }
      let tmp = src.slice(0, m.index + 1);
      let r = f(m[1]);
      tmp += r + src.slice(m.index + length - 1);
      src = tmp;
      rex.lastIndex = m.index + r.length;
    }
  } while (m);
  return src;
}
function findClosingBracket(src, startPos, file, btype = "{}") {
  let open = btype[0];
  let close2 = btype[1];
  let count = { "'": 0, '"': 0, "`": 0 };
  let count2 = 0;
  let pair = null;
  for (var i = startPos; i < src.length; i++) {
    for (var type in count) {
      if (src[i] === type && src[i - 1] !== "\\") {
        count[type]++;
        if (!pair)
          pair = [i, void 0];
      }
      if (src[i] === type && src[i - 1] !== "\\" && i > pair[0]) {
        count[type] = 0;
        if (pair && Object.values(count).every((x) => !x)) {
          pair[1] = i;
          pair = null;
        }
      }
      if (count[type] < 0) {
        throw `Missing quote ${type} in ${file}`;
      }
    }
    let sum = count["'"] + count['"'] + count["`"];
    if (sum === 0) {
      if (src[i] === open)
        count2++;
      if (src[i] === close2)
        count2--;
      if (count2 === 0)
        break;
    }
  }
  if (count2 !== 0) {
    throw `Missing bracket in ${file}: ${btype}`;
  }
  if (pair !== null) {
    throw `Missing quote in ${file}: ${JSON.stringify(count)}`;
  }
  return i;
}
function extractStaticBlocks(script) {
  let matches = [];
  let currentIndex = 0;
  while (currentIndex < script.length) {
    let staticIndex = script.indexOf("static", currentIndex);
    if (staticIndex === -1)
      break;
    let arrowIndex = script.indexOf("=>", staticIndex);
    if (arrowIndex === -1)
      break;
    currentIndex = arrowIndex + 2;
    while ([" ", "	", "\n", "\r"].includes(script[currentIndex])) {
      currentIndex++;
    }
    let nextChar = script[currentIndex];
    if (["{", "[", "("].includes(nextChar)) {
      let closingIndex;
      try {
        closingIndex = findClosingBracket(script, currentIndex, "script", nextChar + { "{": "}", "[": "]", "(": ")" }[nextChar]);
      } catch (error2) {
        console.error(error2);
        continue;
      }
      matches.push(script.slice(staticIndex, closingIndex + 1).trim());
      currentIndex = closingIndex + 1;
    } else {
      let newLineIndex = script.indexOf("\n", currentIndex);
      matches.push(script.slice(staticIndex, newLineIndex !== -1 ? newLineIndex : void 0).trim());
    }
  }
  return matches.join("\n");
}
const tools = {
  maskStrings,
  unmaskStrings,
  findStrings,
  maskRegex,
  decomment,
  findClosingBracket,
  extractStaticBlocks
};
const FREGX1 = /(function[\s]+|)([$A-Z_][0-9A-Z_$\.]*)[\s]*?\(([^()]*?)\)[\s]*?{/gmi;
const FREGX2 = /(function[\s]+|)([$A-Z_][0-9A-Z_$\.]*)[\s]*?\(([^()]*?)\)[\s]*?=>[\s]*?{/gmi;
const FREGX3 = /(function[\s]+|)([$A-Z_][0-9A-Z_$\.]*)[\s]*?\(([^()]*?)\)[\s]*?=>/gmi;
const SREGX = /static\s+var\s+([a-zA-Z0-9_]+)\s*=/g;
const KWORDS = ["if", "for", "while", "switch", "catch", "with"];
class ParserOV {
  constructor(tagProps, src) {
    this.tagProps = this.parseTagProps(tagProps);
    this.src = src;
    this.flags = "";
    this.parseBody();
  }
  parseTagProps(src) {
    let obj = {};
    let pairs = src.split(",");
    for (var p of pairs) {
      let [key, val] = p.split("=");
      obj[key.trim()] = val.trim();
    }
    return obj;
  }
  parseBody() {
    let code = tools.decomment(this.src);
    code = this.prepFuncions1(code);
    code = this.prepFuncions2(code);
    code = this.prepFuncions3(code);
    let blocks = tools.extractStaticBlocks(code);
    this.static = this.wrapStatic(blocks);
    code = this.renameStatic(code);
    this.prefab = this.wrapTheCode(code, this.flags);
  }
  // Find all function declarations & replace them with
  // arrow functions (first category: f() {} )
  prepFuncions1(code) {
    let copy = "";
    let i = 0;
    FREGX1.lastIndex = 0;
    do {
      var m = FREGX1.exec(code);
      if (m) {
        m[1].trim();
        let fname = m[2];
        let fargs = m[3];
        let open = FREGX1.lastIndex - 1;
        let close2 = tools.findClosingBracket(code, open);
        if (!KWORDS.includes(fname)) {
          let block = code.slice(open, close2 + 1);
          copy += code.slice(i, m.index);
          copy += `var ${fname} = (${fargs}) => ${block}`;
          this.parseFlags(fname, fargs, block);
        } else {
          copy += code.slice(i, close2 + 1);
        }
        FREGX1.lastIndex = close2;
        i = close2 + 1;
      }
    } while (m);
    return copy + code.slice(i);
  }
  // Find all function declarations & replace them with
  // arrow functions (third category: f() => {})
  prepFuncions2(code) {
    let copy = "";
    let i = 0;
    FREGX2.lastIndex = 0;
    do {
      var m = FREGX2.exec(code);
      if (m) {
        m[1].trim();
        let fname = m[2];
        let fargs = m[3];
        let open = FREGX2.lastIndex - 1;
        let close2 = tools.findClosingBracket(code, open);
        if (!KWORDS.includes(fname)) {
          let block = code.slice(open, close2 + 1);
          copy += code.slice(i, m.index);
          copy += `var ${fname} = (${fargs}) => (${block})`;
          this.parseFlags(fname, fargs, block);
        } else {
          copy += code.slice(i, close2 + 1);
        }
        FREGX2.lastIndex = close2;
        i = close2 + 1;
      }
    } while (m);
    return copy + code.slice(i);
  }
  // Find all function declarations & replace them with
  // arrow functions (third category: f() => Expression)
  prepFuncions3(code) {
    let copy = "";
    let i = 0;
    FREGX3.lastIndex = 0;
    do {
      var m = FREGX3.exec(code);
      if (m) {
        m[1].trim();
        let fname = m[2];
        let fargs = m[3];
        let arrow = FREGX3.lastIndex;
        copy += code.slice(i, m.index);
        copy += `var ${fname} = (${fargs}) => `;
        let block = code.slice(arrow).split("\n")[0].trim();
        this.parseFlags(fname, fargs, block);
        i = arrow + 1;
      }
    } while (m);
    return copy + code.slice(i);
  }
  // Add some flag for the future use (e.g. in layout)
  parseFlags(name, fargs, block) {
    if (name === "yRange") {
      let x = fargs.trim().split(",").length > 1;
      this.flags += `yRangePreCalc: ${x},
`;
    } else if (name === "legend") {
      if (block === "null" || block === "undefined") {
        this.flags += `noLegend: true,
`;
      }
    }
  }
  wrapStatic(code) {
    let renamed = code.replace(SREGX, "$static.$1 =");
    const wrappedScript = `
            var $static = {}
            ${renamed}
            return $static
        `;
    try {
      const dynamicFunction = new Function(wrappedScript);
      const result = dynamicFunction();
      return result;
    } catch (error2) {
      console.error("Error parsing static functions", error2);
    }
    return {};
  }
  // Rename static functions 
  renameStatic(code) {
    return code.replace(SREGX, "$static.$1 =");
  }
  // Create a function that returns a new overlay object
  wrapTheCode(code, flags) {
    return new Function("env", `

            // Setup the environment
            let { $core, $props, $events } = env
            let prop = (...args) => env.prop(...args)
            let watchProp = (...args) => env.watchProp(...args)
            let $static = {} 

            // Add primitives
            let $lib = env.lib

            // Function stubs
            var init = () => {}
            var destroy = () => {}
            var meta = () => null
            var dataFormat = () => null
            var draw = () => {}
            var drawSidebar = null
            var drawBotbar = null
            var yRange = null
            var preSampler = null
            var legend = null
            var legendHtml = null
            var valueTracker = null
            var ohlc = null

            // Event handler stubs
            var mousemove = null
            var mouseout = null
            var mouseup = null
            var mousedown = null
            var click = null
            var keyup = null
            var keydown = null
            var keypress = null

            // Overlay code
            ${code}

            // Output overlay object
            return {
                gridId: () => $core.layout.id,
                id: () => $core.id,
                init, destroy, meta, dataFormat,
                draw, drawSidebar, drawBotbar,
                yRange, preSampler,
                legend, legendHtml,
                valueTracker, ohlc,
                mousemove, mouseout, mouseup,
                mousedown, click, keyup, keydown,
                keypress,
                // Generated flags
                ${flags}
            }
        `);
  }
}
const SPLIT = /\[[\s]*?UPDATE[\s]*?\]|\[[\s]*?POST[\s]*?\]/gm;
const UPDATE = /\[[\s]*?UPDATE[\s]*?\]([\s\S]*?)(\[POST|\[UPDATE|\[EOF)/gm;
const POST = /\[[\s]*?POST[\s]*?\]([\s\S]*?)(\[POST|\[UPDATE|\[EOF)/gm;
class ParserIND {
  constructor(tagProps, src) {
    this.tagProps = this.parseTagProps(tagProps);
    this.src = src;
    this.parseBody();
  }
  parseTagProps(src) {
    let obj = {};
    let pairs = src.split(",");
    for (var p of pairs) {
      let [key, val] = p.split("=");
      obj[key.trim()] = val.trim();
    }
    return obj;
  }
  parseBody() {
    SPLIT.lastIndex = 0;
    UPDATE.lastIndex = 0;
    POST.lastIndex = 0;
    let code = tools.decomment(this.src);
    this.init = code.split(SPLIT)[0];
    code += "\n[EOF]";
    this.update = (UPDATE.exec(code) || [])[1];
    this.post = (POST.exec(code) || [])[1];
  }
}
const VERSION = 0.2;
const TAG = "lite";
const VERS_REGX = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
const OV_REGX = /\[OVERLAY[\s]+([\s\S]*?)]([\s\S]*?)(\[OVERLAY|\[INDICATOR|\[EOF)/gm;
const IND_REGX = /\[INDICATOR[\s]+([\s\S]*?)]([\s\S]*?)(\[OVERLAY|\[INDICATOR|\[EOF)/gm;
class Parser {
  constructor(src, name = "Unknown Script") {
    name = this.extractName(src) || name;
    this.version = VERSION;
    this.src = src + "\n[EOF]";
    this.scriptName = name;
    this.scriptVers = this.navyVers()[0];
    this.scriptTag = this.navyVers()[1];
    this.overlays = [];
    this.indicators = [];
    if (this.scriptVers === 0) {
      console.warn(`${name}: There is no script version string`);
    }
    if (this.scriptVers > this.version) {
      console.warn(`${name}: Script version > parser version`);
    }
    if (this.scriptVers < 0.2 && src.includes("OVERLAY") && src.includes("yRange")) {
      console.warn(`${name}: Update yRange() function (see docs)`);
    }
    if (this.scriptTag !== TAG) {
      console.warn(
        `${name}: Script version should have 'lite' tag
Most likely are using the community version of NavyJS
with a script written for the PRO version.
If not the case just use 'lite' tag: ${VERSION}-lite`
      );
    }
    this.overlayTags();
    this.indicatorTags();
  }
  // Parse the version
  navyVers() {
    let first = (this.src.match(VERS_REGX) || [])[0];
    if (first) {
      let pair = first.split("~");
      if (pair.length < 2)
        return [0];
      let vers = parseFloat(pair[1]);
      let tag = pair[1].split("-")[1];
      return [vers === vers ? vers : 0, tag];
    }
    return [0];
  }
  extractName(script) {
    const regex = /\[.*?name=([^\s,]+)/;
    const match = script.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    } else {
      return null;
    }
  }
  // Parse [OVERLAY] tags
  overlayTags() {
    OV_REGX.lastIndex = 0;
    var match;
    while (match = OV_REGX.exec(this.src)) {
      this.overlays.push(new ParserOV(
        match[1],
        match[2]
      ));
      OV_REGX.lastIndex -= 10;
    }
  }
  // Parse [INDICATOR] tags
  indicatorTags() {
    IND_REGX.lastIndex = 0;
    var match;
    while (match = IND_REGX.exec(this.src)) {
      this.indicators.push(new ParserIND(
        match[1],
        match[2]
      ));
      IND_REGX.lastIndex -= 12;
    }
  }
}
const encodedJs = "KGZ1bmN0aW9uKCkgewogICJ1c2Ugc3RyaWN0IjsKICBmdW5jdGlvbiByZWdyZXNzaW9uKGRhdGEsIGxlbiwgb2Zmc2V0KSB7CiAgICBkYXRhID0gZGF0YS5zbGljZSgwLCBsZW4pLnJldmVyc2UoKS5tYXAoKHgsIGkyKSA9PiBbaTIsIHhdKTsKICAgIHZhciBzdW1feCA9IDAsIHN1bV95ID0gMCwgc3VtX3h5ID0gMCwgc3VtX3h4ID0gMCwgY291bnQgPSAwLCBtLCBiOwogICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHsKICAgICAgaWYgKCFkYXRhW2ldKQogICAgICAgIHJldHVybiBOYU47CiAgICAgIHZhciBwb2ludCA9IGRhdGFbaV07CiAgICAgIHN1bV94ICs9IHBvaW50WzBdOwogICAgICBzdW1feSArPSBwb2ludFsxXTsKICAgICAgc3VtX3h4ICs9IHBvaW50WzBdICogcG9pbnRbMF07CiAgICAgIHN1bV94eSArPSBwb2ludFswXSAqIHBvaW50WzFdOwogICAgICBjb3VudCsrOwogICAgfQogICAgbSA9IChjb3VudCAqIHN1bV94eSAtIHN1bV94ICogc3VtX3kpIC8gKGNvdW50ICogc3VtX3h4IC0gc3VtX3ggKiBzdW1feCk7CiAgICBiID0gc3VtX3kgLyBjb3VudCAtIG0gKiBzdW1feCAvIGNvdW50OwogICAgcmV0dXJuIG0gKiAoZGF0YS5sZW5ndGggLSAxIC0gb2Zmc2V0KSArIGI7CiAgfQogIGZ1bmN0aW9uIGdldERlZmF1bHRFeHBvcnRGcm9tQ2pzKHgpIHsKICAgIHJldHVybiB4ICYmIHguX19lc01vZHVsZSAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgImRlZmF1bHQiKSA/IHhbImRlZmF1bHQiXSA6IHg7CiAgfQogIHZhciB1dGlsJDEgPSB7fTsKICBmdW5jdGlvbiBpc0FycmF5TGlrZShvKSB7CiAgICBpZiAobyAmJiAvLyBvIGlzIG5vdCBudWxsLCB1bmRlZmluZWQsIGV0Yy4KICAgIHR5cGVvZiBvID09PSAib2JqZWN0IiAmJiAvLyBvIGlzIGFuIG9iamVjdAogICAgaXNGaW5pdGUoby5sZW5ndGgpICYmIC8vIG8ubGVuZ3RoIGlzIGEgZmluaXRlIG51bWJlcgogICAgby5sZW5ndGggPj0gMCAmJiAvLyBvLmxlbmd0aCBpcyBub24tbmVnYXRpdmUKICAgIG8ubGVuZ3RoID09PSBNYXRoLmZsb29yKG8ubGVuZ3RoKSAmJiAvLyBvLmxlbmd0aCBpcyBhbiBpbnRlZ2VyCiAgICBvLmxlbmd0aCA8IDQyOTQ5NjcyOTYpCiAgICAgIHJldHVybiB0cnVlOwogICAgZWxzZQogICAgICByZXR1cm4gZmFsc2U7CiAgfQogIGZ1bmN0aW9uIGlzU29ydGFibGUobykgewogICAgaWYgKG8gJiYgLy8gbyBpcyBub3QgbnVsbCwgdW5kZWZpbmVkLCBldGMuCiAgICB0eXBlb2YgbyA9PT0gIm9iamVjdCIgJiYgLy8gbyBpcyBhbiBvYmplY3QKICAgIHR5cGVvZiBvLnNvcnQgPT09ICJmdW5jdGlvbiIpCiAgICAgIHJldHVybiB0cnVlOwogICAgZWxzZQogICAgICByZXR1cm4gZmFsc2U7CiAgfQogIHV0aWwkMS5pc1NvcnRhYmxlQXJyYXlMaWtlID0gZnVuY3Rpb24obykgewogICAgcmV0dXJuIGlzQXJyYXlMaWtlKG8pICYmIGlzU29ydGFibGUobyk7CiAgfTsKICB2YXIgY29tcGFyZSA9IHsKICAgIC8qKgogICAgICogQ29tcGFyZSB0d28gbnVtYmVycy4KICAgICAqCiAgICAgKiBAcGFyYW0ge051bWJlcn0gYQogICAgICogQHBhcmFtIHtOdW1iZXJ9IGIKICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9IDEgaWYgYSA+IGIsIDAgaWYgYSA9IGIsIC0xIGlmIGEgPCBiCiAgICAgKi8KICAgIG51bWNtcDogZnVuY3Rpb24oYSwgYikgewogICAgICByZXR1cm4gYSAtIGI7CiAgICB9LAogICAgLyoqCiAgICAgKiBDb21wYXJlIHR3byBzdHJpbmdzLgogICAgICoKICAgICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gYQogICAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBiCiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfSAxIGlmIGEgPiBiLCAwIGlmIGEgPSBiLCAtMSBpZiBhIDwgYgogICAgICovCiAgICBzdHJjbXA6IGZ1bmN0aW9uKGEsIGIpIHsKICAgICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwOwogICAgfQogIH07CiAgdmFyIGJpbmFyeSA9IHt9OwogIGZ1bmN0aW9uIGxvb3AoZGF0YSwgbWluLCBtYXgsIGluZGV4LCB2YWxwb3MpIHsKICAgIHZhciBjdXJyID0gbWF4ICsgbWluID4+PiAxOwogICAgdmFyIGRpZmYgPSB0aGlzLmNvbXBhcmUoZGF0YVtjdXJyXVt0aGlzLmluZGV4XSwgaW5kZXgpOwogICAgaWYgKCFkaWZmKSB7CiAgICAgIHJldHVybiB2YWxwb3NbaW5kZXhdID0gewogICAgICAgICJmb3VuZCI6IHRydWUsCiAgICAgICAgImluZGV4IjogY3VyciwKICAgICAgICAicHJldiI6IG51bGwsCiAgICAgICAgIm5leHQiOiBudWxsCiAgICAgIH07CiAgICB9CiAgICBpZiAobWluID49IG1heCkgewogICAgICByZXR1cm4gdmFscG9zW2luZGV4XSA9IHsKICAgICAgICAiZm91bmQiOiBmYWxzZSwKICAgICAgICAiaW5kZXgiOiBudWxsLAogICAgICAgICJwcmV2IjogZGlmZiA8IDAgPyBtYXggOiBtYXggLSAxLAogICAgICAgICJuZXh0IjogZGlmZiA8IDAgPyBtYXggKyAxIDogbWF4CiAgICAgIH07CiAgICB9CiAgICBpZiAoZGlmZiA+IDApCiAgICAgIHJldHVybiBsb29wLmNhbGwodGhpcywgZGF0YSwgbWluLCBjdXJyIC0gMSwgaW5kZXgsIHZhbHBvcyk7CiAgICBlbHNlCiAgICAgIHJldHVybiBsb29wLmNhbGwodGhpcywgZGF0YSwgY3VyciArIDEsIG1heCwgaW5kZXgsIHZhbHBvcyk7CiAgfQogIGZ1bmN0aW9uIHNlYXJjaChpbmRleCkgewogICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7CiAgICByZXR1cm4gbG9vcC5jYWxsKHRoaXMsIGRhdGEsIDAsIGRhdGEubGVuZ3RoIC0gMSwgaW5kZXgsIHRoaXMudmFscG9zKTsKICB9CiAgYmluYXJ5LnNlYXJjaCA9IHNlYXJjaDsKICB2YXIgdXRpbCA9IHV0aWwkMSwgY21wID0gY29tcGFyZSwgYmluID0gYmluYXJ5OwogIHZhciBsaWIgPSBJbmRleGVkQXJyYXk7CiAgZnVuY3Rpb24gSW5kZXhlZEFycmF5KGRhdGEsIGluZGV4KSB7CiAgICBpZiAoIXV0aWwuaXNTb3J0YWJsZUFycmF5TGlrZShkYXRhKSkKICAgICAgdGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIGRhdGEiKTsKICAgIGlmICghaW5kZXggfHwgZGF0YS5sZW5ndGggPiAwICYmICEoaW5kZXggaW4gZGF0YVswXSkpCiAgICAgIHRocm93IG5ldyBFcnJvcigiSW52YWxpZCBpbmRleCIpOwogICAgdGhpcy5kYXRhID0gZGF0YTsKICAgIHRoaXMuaW5kZXggPSBpbmRleDsKICAgIHRoaXMuc2V0Qm91bmRhcmllcygpOwogICAgdGhpcy5jb21wYXJlID0gdHlwZW9mIHRoaXMubWludiA9PT0gIm51bWJlciIgPyBjbXAubnVtY21wIDogY21wLnN0cmNtcDsKICAgIHRoaXMuc2VhcmNoID0gYmluLnNlYXJjaDsKICAgIHRoaXMudmFscG9zID0ge307CiAgICB0aGlzLmN1cnNvciA9IG51bGw7CiAgICB0aGlzLm5leHRsb3cgPSBudWxsOwogICAgdGhpcy5uZXh0aGlnaCA9IG51bGw7CiAgfQogIEluZGV4ZWRBcnJheS5wcm90b3R5cGUuc2V0Q29tcGFyZSA9IGZ1bmN0aW9uKGZuKSB7CiAgICBpZiAodHlwZW9mIGZuICE9PSAiZnVuY3Rpb24iKQogICAgICB0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgYXJndW1lbnQiKTsKICAgIHRoaXMuY29tcGFyZSA9IGZuOwogICAgcmV0dXJuIHRoaXM7CiAgfTsKICBJbmRleGVkQXJyYXkucHJvdG90eXBlLnNldFNlYXJjaCA9IGZ1bmN0aW9uKGZuKSB7CiAgICBpZiAodHlwZW9mIGZuICE9PSAiZnVuY3Rpb24iKQogICAgICB0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgYXJndW1lbnQiKTsKICAgIHRoaXMuc2VhcmNoID0gZm47CiAgICByZXR1cm4gdGhpczsKICB9OwogIEluZGV4ZWRBcnJheS5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKCkgewogICAgdmFyIHNlbGYyID0gdGhpcywgaW5kZXggPSB0aGlzLmluZGV4OwogICAgdGhpcy5kYXRhLnNvcnQoZnVuY3Rpb24oYSwgYikgewogICAgICByZXR1cm4gc2VsZjIuY29tcGFyZShhW2luZGV4XSwgYltpbmRleF0pOwogICAgfSk7CiAgICB0aGlzLnNldEJvdW5kYXJpZXMoKTsKICAgIHJldHVybiB0aGlzOwogIH07CiAgSW5kZXhlZEFycmF5LnByb3RvdHlwZS5zZXRCb3VuZGFyaWVzID0gZnVuY3Rpb24oKSB7CiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSwgaW5kZXggPSB0aGlzLmluZGV4OwogICAgdGhpcy5taW52ID0gZGF0YS5sZW5ndGggJiYgZGF0YVswXVtpbmRleF07CiAgICB0aGlzLm1heHYgPSBkYXRhLmxlbmd0aCAmJiBkYXRhW2RhdGEubGVuZ3RoIC0gMV1baW5kZXhdOwogICAgcmV0dXJuIHRoaXM7CiAgfTsKICBJbmRleGVkQXJyYXkucHJvdG90eXBlLmZldGNoID0gZnVuY3Rpb24odmFsdWUpIHsKICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID09PSAwKSB7CiAgICAgIHRoaXMuY3Vyc29yID0gbnVsbDsKICAgICAgdGhpcy5uZXh0bG93ID0gbnVsbDsKICAgICAgdGhpcy5uZXh0aGlnaCA9IG51bGw7CiAgICAgIHJldHVybiB0aGlzOwogICAgfQogICAgaWYgKHRoaXMuY29tcGFyZSh2YWx1ZSwgdGhpcy5taW52KSA9PT0gLTEpIHsKICAgICAgdGhpcy5jdXJzb3IgPSBudWxsOwogICAgICB0aGlzLm5leHRsb3cgPSBudWxsOwogICAgICB0aGlzLm5leHRoaWdoID0gMDsKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICBpZiAodGhpcy5jb21wYXJlKHZhbHVlLCB0aGlzLm1heHYpID09PSAxKSB7CiAgICAgIHRoaXMuY3Vyc29yID0gbnVsbDsKICAgICAgdGhpcy5uZXh0bG93ID0gdGhpcy5kYXRhLmxlbmd0aCAtIDE7CiAgICAgIHRoaXMubmV4dGhpZ2ggPSBudWxsOwogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIHZhciB2YWxwb3MgPSB0aGlzLnZhbHBvcywgcG9zID0gdmFscG9zW3ZhbHVlXTsKICAgIGlmIChwb3MpIHsKICAgICAgaWYgKHBvcy5mb3VuZCkgewogICAgICAgIHRoaXMuY3Vyc29yID0gcG9zLmluZGV4OwogICAgICAgIHRoaXMubmV4dGxvdyA9IG51bGw7CiAgICAgICAgdGhpcy5uZXh0aGlnaCA9IG51bGw7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy5jdXJzb3IgPSBudWxsOwogICAgICAgIHRoaXMubmV4dGxvdyA9IHBvcy5wcmV2OwogICAgICAgIHRoaXMubmV4dGhpZ2ggPSBwb3MubmV4dDsKICAgICAgfQogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIHZhciByZXN1bHQgPSB0aGlzLnNlYXJjaC5jYWxsKHRoaXMsIHZhbHVlKTsKICAgIHRoaXMuY3Vyc29yID0gcmVzdWx0LmluZGV4OwogICAgdGhpcy5uZXh0bG93ID0gcmVzdWx0LnByZXY7CiAgICB0aGlzLm5leHRoaWdoID0gcmVzdWx0Lm5leHQ7CiAgICByZXR1cm4gdGhpczsKICB9OwogIEluZGV4ZWRBcnJheS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24odmFsdWUpIHsKICAgIGlmICh2YWx1ZSkKICAgICAgdGhpcy5mZXRjaCh2YWx1ZSk7CiAgICB2YXIgcG9zID0gdGhpcy5jdXJzb3I7CiAgICByZXR1cm4gcG9zICE9PSBudWxsID8gdGhpcy5kYXRhW3Bvc10gOiBudWxsOwogIH07CiAgSW5kZXhlZEFycmF5LnByb3RvdHlwZS5nZXRSYW5nZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHsKICAgIGlmICh0aGlzLmNvbXBhcmUoYmVnaW4sIGVuZCkgPT09IDEpIHsKICAgICAgcmV0dXJuIFtdOwogICAgfQogICAgdGhpcy5mZXRjaChiZWdpbik7CiAgICB2YXIgc3RhcnQgPSB0aGlzLmN1cnNvciB8fCB0aGlzLm5leHRoaWdoOwogICAgdGhpcy5mZXRjaChlbmQpOwogICAgdmFyIGZpbmlzaCA9IHRoaXMuY3Vyc29yIHx8IHRoaXMubmV4dGxvdzsKICAgIGlmIChzdGFydCA9PT0gbnVsbCB8fCBmaW5pc2ggPT09IG51bGwpIHsKICAgICAgcmV0dXJuIFtdOwogICAgfQogICAgcmV0dXJuIHRoaXMuZGF0YS5zbGljZShzdGFydCwgZmluaXNoICsgMSk7CiAgfTsKICB2YXIgSW5kZXhlZEFycmF5JDEgPSAvKiBAX19QVVJFX18gKi8gZ2V0RGVmYXVsdEV4cG9ydEZyb21DanMobGliKTsKICBjb25zdCBTRUNPTkQgPSAxZTM7CiAgY29uc3QgTUlOVVRFJDEgPSBTRUNPTkQgKiA2MDsKICBjb25zdCBNSU5VVEUyJDEgPSBNSU5VVEUkMSAqIDI7CiAgY29uc3QgTUlOVVRFMyA9IE1JTlVURSQxICogMzsKICBjb25zdCBNSU5VVEU1JDEgPSBNSU5VVEUkMSAqIDU7CiAgY29uc3QgTUlOVVRFMTUkMSA9IE1JTlVURSQxICogMTU7CiAgY29uc3QgTUlOVVRFMzAkMSA9IE1JTlVURSQxICogMzA7CiAgY29uc3QgSE9VUiQxID0gTUlOVVRFJDEgKiA2MDsKICBjb25zdCBIT1VSNCQxID0gSE9VUiQxICogNDsKICBjb25zdCBIT1VSMTIkMSA9IEhPVVIkMSAqIDEyOwogIGNvbnN0IERBWSQxID0gSE9VUiQxICogMjQ7CiAgY29uc3QgV0VFSyQxID0gREFZJDEgKiA3OwogIGNvbnN0IE1PTlRIJDEgPSBXRUVLJDEgKiA0OwogIGNvbnN0IFlFQVIkMSA9IERBWSQxICogMzY1OwogIGNvbnN0IE1PTlRITUFQID0gWwogICAgIkphbiIsCiAgICAiRmViIiwKICAgICJNYXIiLAogICAgIkFwciIsCiAgICAiTWF5IiwKICAgICJKdW4iLAogICAgIkp1bCIsCiAgICAiQXVnIiwKICAgICJTZXAiLAogICAgIk9jdCIsCiAgICAiTm92IiwKICAgICJEZWMiCiAgXTsKICBjb25zdCBUSU1FU0NBTEVTID0gWwogICAgWUVBUiQxICogMTAsCiAgICBZRUFSJDEgKiA1LAogICAgWUVBUiQxICogMywKICAgIFlFQVIkMSAqIDIsCiAgICBZRUFSJDEsCiAgICBNT05USCQxICogNiwKICAgIE1PTlRIJDEgKiA0LAogICAgTU9OVEgkMSAqIDMsCiAgICBNT05USCQxICogMiwKICAgIE1PTlRIJDEsCiAgICBEQVkkMSAqIDE1LAogICAgREFZJDEgKiAxMCwKICAgIERBWSQxICogNywKICAgIERBWSQxICogNSwKICAgIERBWSQxICogMywKICAgIERBWSQxICogMiwKICAgIERBWSQxLAogICAgSE9VUiQxICogMTIsCiAgICBIT1VSJDEgKiA2LAogICAgSE9VUiQxICogMywKICAgIEhPVVIkMSAqIDEuNSwKICAgIEhPVVIkMSwKICAgIE1JTlVURTMwJDEsCiAgICBNSU5VVEUxNSQxLAogICAgTUlOVVRFJDEgKiAxMCwKICAgIE1JTlVURTUkMSwKICAgIE1JTlVURTIkMSwKICAgIE1JTlVURSQxCiAgXTsKICBjb25zdCAkU0NBTEVTID0gWzAuMDUsIDAuMSwgMC4yLCAwLjI1LCAwLjUsIDAuOCwgMSwgMiwgNV07CiAgY29uc3QgQ09MT1JTID0gewogICAgYmFjazogIiMxNDE1MWMiLAogICAgLy8gQmFja2dyb3VuZCBjb2xvcgogICAgZ3JpZDogIiMyNTI3MzIiLAogICAgLy8gR3JpZCBjb2xvcgogICAgdGV4dDogIiNhZGFkYWQiLAogICAgLy8gUmVndWxhciB0ZXh0IGNvbG9yCiAgICB0ZXh0SEw6ICIjZGVkZGRkIiwKICAgIC8vIEhpZ2hsaWdodGVkIHRleHQgY29sb3IKICAgIHRleHRMRzogIiNjNGM0YzQiLAogICAgLy8gTGVnZW5kIHRleHQgY29sb3IKICAgIGxsVmFsdWU6ICIjODE4OTg5IiwKICAgIC8vIExlZ2VuZCB2YWx1ZSBjb2xvcgogICAgbGxCYWNrOiAiIzE0MTUxYzc3IiwKICAgIC8vIExlZ2VuZCBiYXIgYmFja2dyb3VuZAogICAgbGxTZWxlY3Q6ICIjMmQ3YjJmIiwKICAgIC8vIExlZ2VuZCBzZWxlY3QgYm9yZGVyCiAgICBzY2FsZTogIiM2MDYwNjAiLAogICAgLy8gU2NhbGUgZWRnZSBjb2xvcgogICAgY3Jvc3M6ICIjODA5MWEwIiwKICAgIC8vIENyb3NzaGFpciBjb2xvcgogICAgY2FuZGxlVXA6ICIjNDFhMzc2IiwKICAgIC8vICJHcmVlbiIgY2FuZGxlIGNvbG9yCiAgICBjYW5kbGVEdzogIiNkZTQ2NDYiLAogICAgLy8gIlJlZCIgY2FuZGxlIGNvbG9yCiAgICB3aWNrVXA6ICIjMjNhNzc2ODgiLAogICAgLy8gIkdyZWVuIiB3aWNrIGNvbG9yCiAgICB3aWNrRHc6ICIjZTU0MTUwODgiLAogICAgLy8gIlJlZCIgd2ljayBjb2xvcgogICAgdm9sVXA6ICIjNDFhMzc2ODIiLAogICAgLy8gIkdyZWVuIiB2b2x1bWUgY29sb3IKICAgIHZvbER3OiAiI2RlNDY0NjgyIiwKICAgIC8vICJSZWQiIHZvbHVtZSBjb2xvcgogICAgcGFuZWw6ICIjMmEyZjM4IiwKICAgIC8vIFNjYWxlIHBhbmVsIGNvbG9yCiAgICB0YkJhY2s6IHZvaWQgMCwKICAgIC8vIFRvb2xiYXIgYmFja2dyb3VuZAogICAgdGJCb3JkZXI6ICIjODI4MjgyN2QiCiAgICAvLyBUb29sYmFyIGJvcmRlciBjb2xvcgogIH07CiAgY29uc3QgQ2hhcnRDb25maWcgPSB7CiAgICBTQk1JTjogNjAsCiAgICAvLyBNaW5pbWFsIHNpZGViYXIsIHB4CiAgICBTQk1BWDogSW5maW5pdHksCiAgICAvLyBNYXggc2lkZWJhciwgcHgKICAgIFRPT0xCQVI6IDU3LAogICAgLy8gVG9vbGJhciB3aWR0aCwgcHgKICAgIFRCX0lDT046IDI1LAogICAgLy8gVG9vbGJhciBpY29uIHNpemUsIHB4CiAgICBUQl9JVEVNX006IDYsCiAgICAvLyBUb29sYmFyIGl0ZW0gbWFyZ2luLCBweAogICAgVEJfSUNPTl9CUkk6IDEsCiAgICAvLyBUb29sYmFyIGljb24gYnJpZ2h0bmVzcwogICAgVEJfSUNPTl9IT0xEOiA0MjAsCiAgICAvLyBXYWl0IHRvIGV4cGFuZCwgbXMKICAgIFRCX0JPUkRFUjogMSwKICAgIC8vIFRvb2xiYXIgYm9yZGVyLCBweAogICAgVEJfQl9TVFlMRTogImRvdHRlZCIsCiAgICAvLyBUb29sYmFyIGJvcmRlciBzdHlsZQogICAgVE9PTF9DT0xMOiA3LAogICAgLy8gVG9vbCBjb2xsaXNpb24gdGhyZXNob2xkCiAgICBQSU5fUkFESVVTOiA1LjUsCiAgICAvLyBUb29sIHBpbiByYWRpdXMKICAgIEVYUEFORDogMC4xNSwKICAgIC8vIEV4cGFuZCB5LXJhbmdlLCAlLzEwMCBvZiByYW5nZQogICAgQ0FORExFVzogMC43LAogICAgLy8gQ2FuZGxlIHdpZHRoLCAlLzEwMCBvZiBzdGVwCiAgICBHUklEWDogMTAwLAogICAgLy8gR3JpZCB4LXN0ZXAgdGFyZ2V0LCBweAogICAgR1JJRFk6IDQ3LAogICAgLy8gR3JpZCB5LXN0ZXAgdGFyZ2V0LCBweAogICAgQk9UQkFSOiAyOCwKICAgIC8vIEJvdHRvbSBiYXIgaGVpZ2h0LCBweAogICAgUEFOSEVJR0hUOiAyMiwKICAgIC8vIFNjYWxlIHBhbmVsIGhlaWdodCwgcHgKICAgIERFRkFVTFRfTEVOOiA1MCwKICAgIC8vIFN0YXJ0aW5nIHJhbmdlLCBjYW5kbGVzCiAgICBNSU5JTVVNX0xFTjogNSwKICAgIC8vIE1pbmltYWwgc3RhcnRpbmcgcmFuZ2UsIGNhbmRsZXMKICAgIE1JTl9aT09NOiA1LAogICAgLy8gTWluaW1hbCB6b29tLCBjYW5kbGVzCiAgICBNQVhfWk9PTTogNWUzLAogICAgLy8gTWF4aW1hbCB6b29tLCBjYW5kbGVzLAogICAgVk9MU0NBTEU6IDAuMTUsCiAgICAvLyBWb2x1bWUgYmFycyBoZWlnaHQsICUvMTAwIG9mIGxheW91dC5oZWlnaHQKICAgIFVYX09QQUNJVFk6IDAuOSwKICAgIC8vIFV4IGJhY2tncm91bmQgb3BhY2l0eQogICAgWk9PTV9NT0RFOiAidHYiLAogICAgLy8gWm9vbSBtb2RlLCAndHYnIG9yICd0bCcKICAgIExfQlROX1NJWkU6IDIxLAogICAgLy8gTGVnZW5kIEJ1dHRvbiBzaXplLCBweAogICAgTF9CVE5fTUFSR0lOOiAiLTZweCAwIC02cHggMCIsCiAgICAvLyBjc3MgbWFyZ2luCiAgICBTQ1JPTExfV0hFRUw6ICJwcmV2ZW50IiwKICAgIC8vIFNjcm9sbCB3aGVlbCBtb3JkZSwgJ3ByZXZlbnQnLCAncGFzcycsICdjbGljaycsCiAgICBRVUFOVElaRV9BRlRFUjogMCwKICAgIC8vIFF1YW50aXplIGN1cnNvciBhZnRlciwgbXMKICAgIEFVVE9fUFJFX1NBTVBMRTogMTAsCiAgICAvLyBTYW1wbGUgc2l6ZSBmb3IgYXV0by1wcmVjaXNpb24KICAgIENBTkRMRV9USU1FOiB0cnVlCiAgICAvLyBTaG93IHJlbWFpbmluZyBjYW5kbGUgdGltZSAKICB9OwogIENoYXJ0Q29uZmlnLkZPTlQgPSBgMTFweCAtYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCwKICAgIFNlZ29lIFVJLFJvYm90byxPeHlnZW4sVWJ1bnR1LENhbnRhcmVsbCwKICAgIEZpcmEgU2FucyxEcm9pZCBTYW5zLEhlbHZldGljYSBOZXVlLAogICAgc2Fucy1zZXJpZmA7CiAgY29uc3QgSUJfVEZfV0FSTiA9IGBXaGVuIHVzaW5nIElCIG1vZGUgeW91IHNob3VsZCBzcGVjaWZ5IHRpbWVmcmFtZSAoJ3RmJyBmaWxlZCBpbiAnY2hhcnQnIG9iamVjdCksb3RoZXJ3aXNlIHlvdSBjYW4gZ2V0IGFuIHVuZXhwZWN0ZWQgYmVoYXZpb3VyYDsKICBjb25zdCBNQVBfVU5JVCA9IHsKICAgICIxcyI6IFNFQ09ORCwKICAgICI1cyI6IFNFQ09ORCAqIDUsCiAgICAiMTBzIjogU0VDT05EICogMTAsCiAgICAiMjBzIjogU0VDT05EICogMjAsCiAgICAiMzBzIjogU0VDT05EICogMzAsCiAgICAiMW0iOiBNSU5VVEUkMSwKICAgICIybSI6IE1JTlVURTIkMSwKICAgICIzbSI6IE1JTlVURTMsCiAgICAiNW0iOiBNSU5VVEU1JDEsCiAgICAiMTVtIjogTUlOVVRFMTUkMSwKICAgICIzMG0iOiBNSU5VVEUzMCQxLAogICAgIjFIIjogSE9VUiQxLAogICAgIjJIIjogSE9VUiQxICogMiwKICAgICIzSCI6IEhPVVIkMSAqIDMsCiAgICAiNEgiOiBIT1VSNCQxLAogICAgIjEySCI6IEhPVVIxMiQxLAogICAgIjFEIjogREFZJDEsCiAgICAiMVciOiBXRUVLJDEsCiAgICAiMU0iOiBNT05USCQxLAogICAgIjFZIjogWUVBUiQxLAogICAgLy8gTG93ZXIgY2FzZSB2YXJpYW50cwogICAgIjFoIjogSE9VUiQxLAogICAgIjJoIjogSE9VUiQxICogMiwKICAgICIzaCI6IEhPVVIkMSAqIDMsCiAgICAiNGgiOiBIT1VSNCQxLAogICAgIjEyaCI6IEhPVVIxMiQxLAogICAgIjFkIjogREFZJDEsCiAgICAiMXciOiBXRUVLJDEsCiAgICAiMXkiOiBZRUFSJDEKICB9OwogIGNvbnN0IEhQWCA9IC0wLjU7CiAgdmFyIENvbnN0ID0gewogICAgU0VDT05ELAogICAgTUlOVVRFOiBNSU5VVEUkMSwKICAgIE1JTlVURTI6IE1JTlVURTIkMSwKICAgIE1JTlVURTU6IE1JTlVURTUkMSwKICAgIE1JTlVURTE1OiBNSU5VVEUxNSQxLAogICAgTUlOVVRFMzA6IE1JTlVURTMwJDEsCiAgICBIT1VSOiBIT1VSJDEsCiAgICBIT1VSNDogSE9VUjQkMSwKICAgIEhPVVIxMjogSE9VUjEyJDEsCiAgICBEQVk6IERBWSQxLAogICAgV0VFSzogV0VFSyQxLAogICAgTU9OVEg6IE1PTlRIJDEsCiAgICBZRUFSOiBZRUFSJDEsCiAgICBNT05USE1BUCwKICAgIFRJTUVTQ0FMRVMsCiAgICAkU0NBTEVTLAogICAgQ2hhcnRDb25maWcsCiAgICBNQVBfVU5JVCwKICAgIElCX1RGX1dBUk4sCiAgICBDT0xPUlMsCiAgICBIUFgKICB9OwogIGNvbnN0IHsKICAgIE1JTlVURSwKICAgIE1JTlVURTIsCiAgICBNSU5VVEU1LAogICAgTUlOVVRFMTUsCiAgICBNSU5VVEUzMCwKICAgIEhPVVIsCiAgICBIT1VSNCwKICAgIEhPVVIxMiwKICAgIERBWSwKICAgIFdFRUssCiAgICBNT05USCwKICAgIFlFQVIKICB9ID0gQ29uc3Q7CiAgdmFyIFV0aWxzID0gewogICAgY2xhbXAobnVtLCBtaW4sIG1heCkgewogICAgICByZXR1cm4gbnVtIDw9IG1pbiA/IG1pbiA6IG51bSA+PSBtYXggPyBtYXggOiBudW07CiAgICB9LAogICAgYWRkWmVybyhpKSB7CiAgICAgIGlmIChpIDwgMTApIHsKICAgICAgICBpID0gIjAiICsgaTsKICAgICAgfQogICAgICByZXR1cm4gaTsKICAgIH0sCiAgICAvLyBTdGFydCBvZiB0aGUgZGF5ICh6ZXJvIG1pbGxpc2Vjb25kKQogICAgZGF5U3RhcnQodCkgewogICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSh0KTsKICAgICAgcmV0dXJuIHN0YXJ0LnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApOwogICAgfSwKICAgIC8vIFN0YXJ0IG9mIHRoZSBtb250aAogICAgbW9udGhTdGFydCh0KSB7CiAgICAgIGxldCBkYXRlID0gbmV3IERhdGUodCk7CiAgICAgIHJldHVybiBEYXRlLlVUQygKICAgICAgICBkYXRlLmdldEZ1bGxZZWFyKCksCiAgICAgICAgZGF0ZS5nZXRNb250aCgpLAogICAgICAgIDEKICAgICAgKTsKICAgIH0sCiAgICAvLyBTdGFydCBvZiB0aGUgeWVhcgogICAgeWVhclN0YXJ0KHQpIHsKICAgICAgcmV0dXJuIERhdGUuVVRDKG5ldyBEYXRlKHQpLmdldEZ1bGxZZWFyKCkpOwogICAgfSwKICAgIGdldFllYXIodCkgewogICAgICBpZiAoIXQpCiAgICAgICAgcmV0dXJuIHZvaWQgMDsKICAgICAgcmV0dXJuIG5ldyBEYXRlKHQpLmdldFVUQ0Z1bGxZZWFyKCk7CiAgICB9LAogICAgZ2V0TW9udGgodCkgewogICAgICBpZiAoIXQpCiAgICAgICAgcmV0dXJuIHZvaWQgMDsKICAgICAgcmV0dXJuIG5ldyBEYXRlKHQpLmdldFVUQ01vbnRoKCk7CiAgICB9LAogICAgLy8gTmVhcmVzdCBpbiBhcnJheQogICAgbmVhcmVzdEEoeCwgYXJyYXkpIHsKICAgICAgbGV0IGRpc3QgPSBJbmZpbml0eTsKICAgICAgbGV0IHZhbCA9IG51bGw7CiAgICAgIGxldCBpbmRleCA9IC0xOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIHhpID0gYXJyYXlbaV07CiAgICAgICAgaWYgKE1hdGguYWJzKHhpIC0geCkgPCBkaXN0KSB7CiAgICAgICAgICBkaXN0ID0gTWF0aC5hYnMoeGkgLSB4KTsKICAgICAgICAgIHZhbCA9IHhpOwogICAgICAgICAgaW5kZXggPSBpOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gW2luZGV4LCB2YWxdOwogICAgfSwKICAgIC8vIE5lYXJlc3QgdmFsdWUgYnkgdGltZSAoaW4gdGltZXNlcmllcykKICAgIG5lYXJlc3RUcyh0LCB0cykgewogICAgICBsZXQgZGlzdCA9IEluZmluaXR5OwogICAgICBsZXQgdmFsID0gbnVsbDsKICAgICAgbGV0IGluZGV4ID0gLTE7CiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHMubGVuZ3RoOyBpKyspIHsKICAgICAgICB2YXIgdGkgPSB0c1tpXVswXTsKICAgICAgICBpZiAoTWF0aC5hYnModGkgLSB0KSA8IGRpc3QpIHsKICAgICAgICAgIGRpc3QgPSBNYXRoLmFicyh0aSAtIHQpOwogICAgICAgICAgdmFsID0gdHNbaV07CiAgICAgICAgICBpbmRleCA9IGk7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBbaW5kZXgsIHZhbF07CiAgICB9LAogICAgLy8gTmVhcmVzdCB2YWx1ZSBieSBpbmRleCAoaW4gdGltZXNlcmllcykKICAgIG5lYXJlc3RUc0liKGksIHRzLCBvZmZzZXQpIHsKICAgICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcihpIC0gb2Zmc2V0KSArIDE7CiAgICAgIGxldCB2YWwgPSB0c1tpbmRleF0gfHwgbnVsbDsKICAgICAgcmV0dXJuIFtpbmRleCwgdmFsXTsKICAgIH0sCiAgICByb3VuZChudW0sIGRlY2ltYWxzID0gOCkgewogICAgICByZXR1cm4gcGFyc2VGbG9hdChudW0udG9GaXhlZChkZWNpbWFscykpOwogICAgfSwKICAgIC8vIFN0cmlwPyBObywgaXQncyB1Z2x5IGZsb2F0cyBpbiBqcwogICAgc3RyaXAobnVtYmVyKSB7CiAgICAgIHJldHVybiBwYXJzZUZsb2F0KAogICAgICAgIHBhcnNlRmxvYXQobnVtYmVyKS50b1ByZWNpc2lvbigxMikKICAgICAgKTsKICAgIH0sCiAgICBnZXREYXkodCkgewogICAgICByZXR1cm4gdCA/IG5ldyBEYXRlKHQpLmdldERhdGUoKSA6IG51bGw7CiAgICB9LAogICAgLy8gVXBkYXRlIGFycmF5IGtlZXBpbmcgdGhlIHNhbWUgcmVmZXJlbmNlCiAgICBvdmVyd3JpdGUoYXJyLCBuZXdfYXJyKSB7CiAgICAgIGFyci5zcGxpY2UoMCwgYXJyLmxlbmd0aCwgLi4ubmV3X2Fycik7CiAgICB9LAogICAgLy8gR2V0IGZ1bGwgbGlzdCBvZiBvdmVybGF5cyBvbiBhbGwgcGFuZXMKICAgIGFsbE92ZXJsYXlzKHBhbmVzID0gW10pIHsKICAgICAgcmV0dXJuIHBhbmVzLm1hcCgoeCkgPT4geC5vdmVybGF5cyB8fCBbXSkuZmxhdCgpOwogICAgfSwKICAgIC8vIERldGVjdHMgYSB0aW1lZnJhbWUgb2YgdGhlIGRhdGEKICAgIGRldGVjdFRpbWVmcmFtZShkYXRhKSB7CiAgICAgIGxldCBsZW4gPSBNYXRoLm1pbihkYXRhLmxlbmd0aCAtIDEsIDk5KTsKICAgICAgbGV0IG1pbiA9IEluZmluaXR5OwogICAgICBkYXRhLnNsaWNlKDAsIGxlbikuZm9yRWFjaCgoeCwgaSkgPT4gewogICAgICAgIGxldCBkID0gZGF0YVtpICsgMV1bMF0gLSB4WzBdOwogICAgICAgIGlmIChkID09PSBkICYmIGQgPCBtaW4pCiAgICAgICAgICBtaW4gPSBkOwogICAgICB9KTsKICAgICAgaWYgKG1pbiA+PSBDb25zdC5NT05USCAmJiBtaW4gPD0gQ29uc3QuREFZICogMzApIHsKICAgICAgICByZXR1cm4gQ29uc3QuREFZICogMzE7CiAgICAgIH0KICAgICAgcmV0dXJuIG1pbjsKICAgIH0sCiAgICAvLyBGYXN0IGZpbHRlci4gUmVhbGx5IGZhc3QsIGxpa2UgMTBYCiAgICBmYXN0RmlsdGVyKGFyciwgdDEsIHQyKSB7CiAgICAgIGlmICghYXJyLmxlbmd0aCkKICAgICAgICByZXR1cm4gW2Fyciwgdm9pZCAwXTsKICAgICAgdHJ5IHsKICAgICAgICBsZXQgaWEgPSBuZXcgSW5kZXhlZEFycmF5JDEoYXJyLCAiMCIpOwogICAgICAgIGxldCByZXMgPSBpYS5nZXRSYW5nZSh0MSwgdDIpOwogICAgICAgIGxldCBpMCA9IGlhLnZhbHBvc1t0MV0ubmV4dDsKICAgICAgICByZXR1cm4gW3JlcywgaTBdOwogICAgICB9IGNhdGNoIChlKSB7CiAgICAgICAgcmV0dXJuIFthcnIuZmlsdGVyKAogICAgICAgICAgKHgpID0+IHhbMF0gPj0gdDEgJiYgeFswXSA8PSB0MgogICAgICAgICksIDBdOwogICAgICB9CiAgICB9LAogICAgLy8gRmFzdCBmaWx0ZXIgMiAocmV0dXJucyBpbmRpY2VzKQogICAgZmFzdEZpbHRlcjIoYXJyLCB0MSwgdDIpIHsKICAgICAgaWYgKCFhcnIubGVuZ3RoKQogICAgICAgIHJldHVybiBbYXJyLCB2b2lkIDBdOwogICAgICB0cnkgewogICAgICAgIGxldCBpYSA9IG5ldyBJbmRleGVkQXJyYXkkMShhcnIsICIwIik7CiAgICAgICAgaWEuZmV0Y2godDEpOwogICAgICAgIGxldCBzdGFydCA9IGlhLmN1cnNvciB8fCBpYS5uZXh0aGlnaDsKICAgICAgICBpYS5mZXRjaCh0Mik7CiAgICAgICAgbGV0IGZpbmlzaCA9IGlhLmN1cnNvciB8fCBpYS5uZXh0bG93OwogICAgICAgIHJldHVybiBbc3RhcnQsIGZpbmlzaCArIDFdOwogICAgICB9IGNhdGNoIChlKSB7CiAgICAgICAgbGV0IHN1YnNldCA9IGFyci5maWx0ZXIoCiAgICAgICAgICAoeCkgPT4geFswXSA+PSB0MSAmJiB4WzBdIDw9IHQyCiAgICAgICAgKTsKICAgICAgICBsZXQgaTEgPSBhcnIuaW5kZXhPZihzdWJzZXRbMF0pOwogICAgICAgIGxldCBpMiA9IGFyci5pbmRleE9mKHN1YnNldFtzdWJzZXQubGVuZ3RoIC0gMV0pOwogICAgICAgIHJldHVybiBbaTEsIGkyXTsKICAgICAgfQogICAgfSwKICAgIC8vIEZhc3QgZmlsdGVyIChpbmRleC1iYXNlZCkKICAgIGZhc3RGaWx0ZXJJQihhcnIsIHQxLCB0MikgewogICAgICBpZiAoIWFyci5sZW5ndGgpCiAgICAgICAgcmV0dXJuIFt2b2lkIDAsIHZvaWQgMF07CiAgICAgIGxldCBpMSA9IE1hdGguZmxvb3IodDEpOwogICAgICBpZiAoaTEgPCAwKQogICAgICAgIGkxID0gMDsKICAgICAgbGV0IGkyID0gTWF0aC5mbG9vcih0MiArIDEpOwogICAgICByZXR1cm4gW2kxLCBpMl07CiAgICB9LAogICAgLy8gTmVhcmVzdCBpbmRleGVzIChsZWZ0IGFuZCByaWdodCkKICAgIGZhc3ROZWFyZXN0KGFyciwgdDEpIHsKICAgICAgbGV0IGlhID0gbmV3IEluZGV4ZWRBcnJheSQxKGFyciwgIjAiKTsKICAgICAgaWEuZmV0Y2godDEpOwogICAgICByZXR1cm4gW2lhLm5leHRsb3csIGlhLm5leHRoaWdoXTsKICAgIH0sCiAgICBub3coKSB7CiAgICAgIHJldHVybiAoLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCkpLmdldFRpbWUoKTsKICAgIH0sCiAgICBwYXVzZShkZWxheSkgewogICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJzLCByaikgPT4gc2V0VGltZW91dChycywgZGVsYXkpKTsKICAgIH0sCiAgICAvLyBMaW1pdCBjcmF6eSB3aGVlbCBkZWx0YSB2YWx1ZXMKICAgIHNtYXJ0V2hlZWwoZGVsdGEpIHsKICAgICAgbGV0IGFicyA9IE1hdGguYWJzKGRlbHRhKTsKICAgICAgaWYgKGFicyA+IDUwMCkgewogICAgICAgIHJldHVybiAoMjAwICsgTWF0aC5sb2coYWJzKSkgKiBNYXRoLnNpZ24oZGVsdGEpOwogICAgICB9CiAgICAgIHJldHVybiBkZWx0YTsKICAgIH0sCiAgICAvLyBQYXJzZSB0aGUgb3JpZ2luYWwgbW91c2UgZXZlbnQgdG8gZmluZCBkZWx0YVgKICAgIGdldERlbHRhWChldmVudCkgewogICAgICByZXR1cm4gZXZlbnQub3JpZ2luYWxFdmVudC5kZWx0YVggLyAxMjsKICAgIH0sCiAgICAvLyBQYXJzZSB0aGUgb3JpZ2luYWwgbW91c2UgZXZlbnQgdG8gZmluZCBkZWx0YVkKICAgIGdldERlbHRhWShldmVudCkgewogICAgICByZXR1cm4gZXZlbnQub3JpZ2luYWxFdmVudC5kZWx0YVkgLyAxMjsKICAgIH0sCiAgICAvLyBBcHBseSBvcGFjaXR5IHRvIGEgaGV4IGNvbG9yCiAgICBhcHBseU9wYWNpdHkoYywgb3ApIHsKICAgICAgaWYgKGMubGVuZ3RoID09PSA3KSB7CiAgICAgICAgbGV0IG4gPSBNYXRoLmZsb29yKG9wICogMjU1KTsKICAgICAgICBuID0gdGhpcy5jbGFtcChuLCAwLCAyNTUpOwogICAgICAgIGMgKz0gbi50b1N0cmluZygxNik7CiAgICAgIH0KICAgICAgcmV0dXJuIGM7CiAgICB9LAogICAgLy8gUGFyc2UgdGltZWZyYW1lIG9yIHJldHVybiB2YWx1ZSBpbiBtcwogICAgLy8gVE9ETzogYWRkIGZ1bGwgcGFyc2VyCiAgICAvLyAoaHR0cHM6Ly9naXRodWIuY29tL3R2anN4L3RyYWRpbmctdnVlLWpzLwogICAgLy8gYmxvYi9tYXN0ZXIvc3JjL2hlbHBlcnMvc2NyaXB0X3V0aWxzLmpzI0w5OCkKICAgIHBhcnNlVGYoc210aCkgewogICAgICBpZiAodHlwZW9mIHNtdGggPT09ICJzdHJpbmciKSB7CiAgICAgICAgcmV0dXJuIENvbnN0Lk1BUF9VTklUW3NtdGhdOwogICAgICB9IGVsc2UgewogICAgICAgIHJldHVybiBzbXRoOwogICAgICB9CiAgICB9LAogICAgLy8gRGV0ZWN0IGluZGV4IHNoaWZ0IGJldHdlZW4gdGhlIG1haW4gZGF0YSBzdWJzZXQKICAgIC8vIGFuZCB0aGUgb3ZlcmxheSdzIHN1YnNldCAoZm9yIElCLW1vZGUpCiAgICBpbmRleFNoaWZ0KHN1YiwgZGF0YSkgewogICAgICBpZiAoIWRhdGEubGVuZ3RoKQogICAgICAgIHJldHVybiAwOwogICAgICBsZXQgZmlyc3QgPSBkYXRhWzBdWzBdOwogICAgICBsZXQgc2Vjb25kOwogICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHsKICAgICAgICBpZiAoZGF0YVtpXVswXSAhPT0gZmlyc3QpIHsKICAgICAgICAgIHNlY29uZCA9IGRhdGFbaV1bMF07CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIH0KICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdWIubGVuZ3RoOyBqKyspIHsKICAgICAgICBpZiAoc3ViW2pdWzBdID09PSBzZWNvbmQpIHsKICAgICAgICAgIHJldHVybiBqIC0gaTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgLy8gRmFsbGJhY2sgZml4IGZvciBCcmF2ZSBicm93c2VyCiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYnJhdmUvYnJhdmUtYnJvd3Nlci9pc3N1ZXMvMTczOAogICAgbWVhc3VyZVRleHQoY3R4LCB0ZXh0LCBudklkKSB7CiAgICAgIGxldCBtID0gY3R4Lm1lYXN1cmVUZXh0T3JnKHRleHQpOwogICAgICBpZiAobS53aWR0aCA9PT0gMCkgewogICAgICAgIGNvbnN0IGRvYyA9IGRvY3VtZW50OwogICAgICAgIGNvbnN0IGlkID0gIm52anMtbWVhc3VyZS10ZXh0IjsKICAgICAgICBsZXQgZWwgPSBkb2MuZ2V0RWxlbWVudEJ5SWQoaWQpOwogICAgICAgIGlmICghZWwpIHsKICAgICAgICAgIGxldCBiYXNlID0gZG9jLmdldEVsZW1lbnRCeUlkKG52SWQpOwogICAgICAgICAgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgiZGl2Iik7CiAgICAgICAgICBlbC5pZCA9IGlkOwogICAgICAgICAgZWwuc3R5bGUucG9zaXRpb24gPSAiYWJzb2x1dGUiOwogICAgICAgICAgZWwuc3R5bGUudG9wID0gIi0xMDAwcHgiOwogICAgICAgICAgYmFzZS5hcHBlbmRDaGlsZChlbCk7CiAgICAgICAgfQogICAgICAgIGlmIChjdHguZm9udCkKICAgICAgICAgIGVsLnN0eWxlLmZvbnQgPSBjdHguZm9udDsKICAgICAgICBlbC5pbm5lclRleHQgPSB0ZXh0LnJlcGxhY2UoLyAvZywgIi4iKTsKICAgICAgICByZXR1cm4geyB3aWR0aDogZWwub2Zmc2V0V2lkdGggfTsKICAgICAgfSBlbHNlIHsKICAgICAgICByZXR1cm4gbTsKICAgICAgfQogICAgfSwKICAgIHV1aWQodGVtcCA9ICJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgiKSB7CiAgICAgIHJldHVybiB0ZW1wLnJlcGxhY2UoL1t4eV0vZywgKGMpID0+IHsKICAgICAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDAsIHYgPSBjID09ICJ4IiA/IHIgOiByICYgMyB8IDg7CiAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpOwogICAgICB9KTsKICAgIH0sCiAgICB1dWlkMigpIHsKICAgICAgcmV0dXJuIHRoaXMudXVpZCgieHh4eHh4eHh4eHh4Iik7CiAgICB9LAogICAgdXVpZDMoKSB7CiAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkuc2xpY2UoMikucmVwbGFjZSgvXjArLywgIiIpOwogICAgfSwKICAgIC8vIERlbGF5ZWQgd2FybmluZywgZiA9IGNvbmRpdGlvbiBsYW1iZGEgZm4KICAgIHdhcm4oZiwgdGV4dCwgZGVsYXkgPSAwKSB7CiAgICAgIHNldFRpbWVvdXQoKCkgPT4gewogICAgICAgIGlmIChmKCkpCiAgICAgICAgICBjb25zb2xlLndhcm4odGV4dCk7CiAgICAgIH0sIGRlbGF5KTsKICAgIH0sCiAgICAvLyBDaGVja3MgaWYgc2NyaXB0IHByb3BzIHVwZGF0ZWQKICAgIC8vIChhbmQgbm90IHN0eWxlIHNldHRpbmdzIG9yIHNvbWV0aGluZyBlbHNlKQogICAgLyppc1NjclByb3BzVXBkKG4sIHByZXYpIHsKICAgICAgICAgICAgICAgIGxldCBwID0gcHJldi5maW5kKHggPT4geC52LiR1dWlkID09PSBuLnYuJHV1aWQpCiAgICAgICAgICAgICAgICBpZiAoIXApIHJldHVybiBmYWxzZQogICAgCiAgICAgICAgICAgICAgICBsZXQgcHJvcHMgPSBuLnAuc2V0dGluZ3MuJHByb3BzCiAgICAgICAgICAgICAgICBpZiAoIXByb3BzKSByZXR1cm4gZmFsc2UKICAgIAogICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzLnNvbWUoeCA9PiBuLnZbeF0gIT09IHAudlt4XSkKICAgICAgICAgICAgfSwqLwogICAgLy8gQ2hlY2tzIGlmIGl0J3MgdGltZSB0byBtYWtlIGEgc2NyaXB0IHVwZGF0ZQogICAgLy8gKGJhc2VkIG9uIGV4ZWNJbnRlcnZhbCBpbiBtcykKICAgIGRlbGF5ZWRFeGVjKHYpIHsKICAgICAgaWYgKCF2LnNjcmlwdCB8fCAhdi5zY3JpcHQuZXhlY0ludGVydmFsKQogICAgICAgIHJldHVybiB0cnVlOwogICAgICBsZXQgdCA9IHRoaXMubm93KCk7CiAgICAgIGxldCBkdCA9IHYuc2NyaXB0LmV4ZWNJbnRlcnZhbDsKICAgICAgaWYgKCF2LnNldHRpbmdzLiRsYXN0X2V4ZWMgfHwgdCA+IHYuc2V0dGluZ3MuJGxhc3RfZXhlYyArIGR0KSB7CiAgICAgICAgdi5zZXR0aW5ncy4kbGFzdF9leGVjID0gdDsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgfQogICAgICByZXR1cm4gZmFsc2U7CiAgICB9LAogICAgLy8gRm9ybWF0IG5hbWVzIHN1Y2ggJ1JTSSwgJGxlbmd0aCcsIHdoZXJlCiAgICAvLyBsZW5ndGggLSBpcyBvbmUgb2YgdGhlIHNldHRpbmdzCiAgICBmb3JtYXROYW1lKG92KSB7CiAgICAgIGlmICghb3YubmFtZSkKICAgICAgICByZXR1cm4gdm9pZCAwOwogICAgICBsZXQgbmFtZSA9IG92Lm5hbWU7CiAgICAgIGZvciAodmFyIGsgaW4gb3Yuc2V0dGluZ3MgfHwge30pIHsKICAgICAgICBsZXQgdmFsID0gb3Yuc2V0dGluZ3Nba107CiAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoYFxcJCR7a31gLCAiZyIpOwogICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UocmVnLCB2YWwpOwogICAgICB9CiAgICAgIHJldHVybiBuYW1lOwogICAgfSwKICAgIC8vIERlZmF1bHQgY3Vyc29yIG1vZGUKICAgIHhNb2RlKCkgewogICAgICByZXR1cm4gdGhpcy5pc19tb2JpbGUgPyAiZXhwbG9yZSIgOiAiZGVmYXVsdCI7CiAgICB9LAogICAgZGVmYXVsdFByZXZlbnRlZChldmVudCkgewogICAgICBpZiAoZXZlbnQub3JpZ2luYWwpIHsKICAgICAgICByZXR1cm4gZXZlbnQub3JpZ2luYWwuZGVmYXVsdFByZXZlbnRlZDsKICAgICAgfQogICAgICByZXR1cm4gZXZlbnQuZGVmYXVsdFByZXZlbnRlZDsKICAgIH0sCiAgICAvLyBHZXQgYSB2aWV3IGZyb20gdGhlIGRhdGEgYnkgdGhlIG5hbWUKICAgIC8qdmlldyhkYXRhLCBuYW1lKSB7CiAgICAgICAgaWYgKCFkYXRhLnZpZXdzKSByZXR1cm4gZGF0YQogICAgICAgIGxldCB2ID0gZGF0YS52aWV3cy5maW5kKHggPT4geC5uYW1lID09PSBuYW1lKQogICAgICAgIGlmICghdikgcmV0dXJuIGRhdGEKICAgICAgICByZXR1cm4gdi5kYXRhCiAgICB9LCovCiAgICAvKmNvbmNhdEFycmF5cyhhcnJheXMpIHsKICAgICAgICB2YXIgYWNjID0gW10KICAgICAgICBmb3IgKHZhciBhIG9mIGFycmF5cykgewogICAgICAgICAgICBhY2MgPSBhY2MuY29uY2F0KGEpCiAgICAgICAgfQogICAgICAgIHJldHVybiBhY2MKICAgIH0sKi8KICAgIC8vIENhbGwKICAgIGFmdGVyQWxsKG9iamVjdCwgZiwgdGltZSkgewogICAgICBjbGVhclRpbWVvdXQob2JqZWN0Ll9fYWZ0ZXJBbGxJZF9fKTsKICAgICAgb2JqZWN0Ll9fYWZ0ZXJBbGxJZF9fID0gc2V0VGltZW91dCgoKSA9PiBmKCksIHRpbWUpOwogICAgfSwKICAgIC8vIERlZmF1bHQgYXV0by1wcmVjaXNpb24gc2FtcGxlciBmb3IgYSBnZW5lcmljCiAgICAvLyB0aW1lc2VyaWVzLWVsZW1lbnQ6IFt0aW1lLCB4MSwgeDIsIHgzLCAuLi5dCiAgICBkZWZhdWx0UHJlU2FtcGxlcihlbCkgewogICAgICBpZiAoIWVsKQogICAgICAgIHJldHVybiBbXTsKICAgICAgbGV0IG91dCA9IFtdOwogICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGVsLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgaWYgKHR5cGVvZiBlbFtpXSA9PT0gIm51bWJlciIpIHsKICAgICAgICAgIG91dC5wdXNoKGVsW2ldKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIG91dDsKICAgIH0sCiAgICAvLyBHZXQgc2NhbGVzIGJ5IHNpZGUgaWQgKDAgLSBsZWZ0LCAxIC0gcmlnaHQpCiAgICBnZXRTY2FsZXNCeVNpZGUoc2lkZSwgbGF5b3V0KSB7CiAgICAgIGlmICghbGF5b3V0KQogICAgICAgIHJldHVybiBbXTsKICAgICAgbGV0IHRlbXBsYXRlID0gbGF5b3V0LnNldHRpbmdzLnNjYWxlVGVtcGxhdGU7CiAgICAgIHJldHVybiB0ZW1wbGF0ZVtzaWRlXS5tYXAoKGlkKSA9PiBsYXlvdXQuc2NhbGVzW2lkXSkuZmlsdGVyKCh4KSA9PiB4KTsKICAgIH0sCiAgICAvLyBJZiBzY2FsZVRlbXBsYXRlIGlzIGNoYW5nZWQgdGhlcmUgY291bGQgYmUgYQogICAgLy8gc2l0dWF0aW9uIHdoZW4gdXNlciBmb3JnZXQgdG8gcmVzZXQgc2NhbGVTaWRlSWR4cy4KICAgIC8vIEhlcmUgd2UgYXR0ZW1wIHRvIGdldCB0aGVtIGluIHN5bmMKICAgIGF1dG9TY2FsZVNpZGVJZChTLCBzaWRlcywgaWR4cykgewogICAgICBpZiAoc2lkZXNbU10ubGVuZ3RoKSB7CiAgICAgICAgaWYgKCFpZHhzW1NdIHx8ICFzaWRlc1tTXS5pbmNsdWRlcyhpZHhzW1NdKSkgewogICAgICAgICAgaWR4c1tTXSA9IHNpZGVzW1NdWzBdOwogICAgICAgIH0KICAgICAgfSBlbHNlIHsKICAgICAgICBpZHhzW1NdID0gdm9pZCAwOwogICAgICB9CiAgICB9LAogICAgLy8gRGVidWcgZnVuY3Rpb24sIHNob3dzIGhvdyBtYW55IHRpbWVzCiAgICAvLyB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgcGVyIHNlY29uZAogICAgY2FsbHNQZXJTZWNvbmQoKSB7CiAgICAgIGlmICh3aW5kb3cuX19jb3VudGVyX18gPT09IHZvaWQgMCkgewogICAgICAgIHdpbmRvdy5fX2NvdW50ZXJfXyA9IDA7CiAgICAgIH0KICAgICAgd2luZG93Ll9fY291bnRlcl9fKys7CiAgICAgIGlmICh3aW5kb3cuX19jcHNJZF9fKQogICAgICAgIHJldHVybjsKICAgICAgd2luZG93Ll9fY3BzSWRfXyA9IHNldFRpbWVvdXQoKCkgPT4gewogICAgICAgIGNvbnNvbGUubG9nKHdpbmRvdy5fX2NvdW50ZXJfXywgInVwZC9zZWMiKTsKICAgICAgICB3aW5kb3cuX19jb3VudGVyX18gPSAwOwogICAgICAgIHdpbmRvdy5fX2Nwc0lkX18gPSBudWxsOwogICAgICB9LCAxZTMpOwogICAgfSwKICAgIC8vIENhbGN1bGF0ZSBhbiBpbmRleCBvZmZzZXQgZm9yIGEgdGltZXNlcmllcwogICAgLy8gYWdhaW5zdCB0aGUgbWFpbiB0cy4gKGZvciBpbmRleEJhc2VkIG1vZGUpCiAgICBmaW5kSW5kZXhPZmZzZXQobWFpblRzLCB0cykgewogICAgICBsZXQgc2V0MSA9IHt9OwogICAgICBsZXQgc2V0MiA9IHt9OwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1haW5Ucy5sZW5ndGg7IGkrKykgewogICAgICAgIHNldDFbbWFpblRzW2ldWzBdXSA9IGk7CiAgICAgIH0KICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cy5sZW5ndGg7IGkrKykgewogICAgICAgIHNldDJbdHNbaV1bMF1dID0gaTsKICAgICAgfQogICAgICBsZXQgZGVsdGFzID0gW107CiAgICAgIGZvciAodmFyIHQgaW4gc2V0MikgewogICAgICAgIGlmIChzZXQxW3RdICE9PSB2b2lkIDApIHsKICAgICAgICAgIGxldCBkID0gc2V0MVt0XSAtIHNldDJbdF07CiAgICAgICAgICBpZiAoIWRlbHRhcy5sZW5ndGggfHwgZGVsdGFzWzBdID09PSBkKSB7CiAgICAgICAgICAgIGRlbHRhcy51bnNoaWZ0KGQpOwogICAgICAgICAgfQogICAgICAgICAgaWYgKGRlbHRhcy5sZW5ndGggPT09IDMpIHsKICAgICAgICAgICAgcmV0dXJuIGRlbHRhcy5wb3AoKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgLy8gRm9ybWF0IGNhc2ggdmFsdWVzCiAgICBmb3JtYXRDYXNoKG4pIHsKICAgICAgaWYgKG4gPT0gdm9pZCAwKQogICAgICAgIHJldHVybiAieCI7CiAgICAgIGlmICh0eXBlb2YgbiAhPT0gIm51bWJlciIpCiAgICAgICAgcmV0dXJuIG47CiAgICAgIGlmIChuIDwgMWUzKQogICAgICAgIHJldHVybiBuLnRvRml4ZWQoMCk7CiAgICAgIGlmIChuID49IDFlMyAmJiBuIDwgMWU2KQogICAgICAgIHJldHVybiArKG4gLyAxZTMpLnRvRml4ZWQoMikgKyAiSyI7CiAgICAgIGlmIChuID49IDFlNiAmJiBuIDwgMWU5KQogICAgICAgIHJldHVybiArKG4gLyAxZTYpLnRvRml4ZWQoMikgKyAiTSI7CiAgICAgIGlmIChuID49IDFlOSAmJiBuIDwgMWUxMikKICAgICAgICByZXR1cm4gKyhuIC8gMWU5KS50b0ZpeGVkKDIpICsgIkIiOwogICAgICBpZiAobiA+PSAxZTEyKQogICAgICAgIHJldHVybiArKG4gLyAxZTEyKS50b0ZpeGVkKDIpICsgIlQiOwogICAgfSwKICAgIC8vIFRpbWUgcmFuZ2Ugb2YgYSBkYXRhIHN1YnNldCAoZnJvbSBpMCB0byBpTi0xKQogICAgcmVhbFRpbWVSYW5nZShkYXRhKSB7CiAgICAgIGlmICghZGF0YS5sZW5ndGgpCiAgICAgICAgcmV0dXJuIDA7CiAgICAgIHJldHVybiBkYXRhW2RhdGEubGVuZ3RoIC0gMV1bMF0gLSBkYXRhWzBdWzBdOwogICAgfSwKICAgIC8vIEdldCBzaXplcyBsZWZ0IGFuZCByaWdodCBwYXJ0cyBvZiBhIG51bWJlcgogICAgLy8gKDExLjIyIC0+IFsnMTEnLCAnMjInXSkKICAgIG51bWJlckxSKHgpIHsKICAgICAgdmFyIHN0ciA9IHggIT0gbnVsbCA/IHgudG9TdHJpbmcoKSA6ICIiOwogICAgICBpZiAoeCA8IDFlLTYpIHsKICAgICAgICB2YXIgW2xzLCByc10gPSBzdHIuc3BsaXQoImUtIik7CiAgICAgICAgdmFyIFtsLCByXSA9IGxzLnNwbGl0KCIuIik7CiAgICAgICAgaWYgKCFyKQogICAgICAgICAgciA9ICIiOwogICAgICAgIHIgPSB7IGxlbmd0aDogci5sZW5ndGggKyBwYXJzZUludChycykgfHwgMCB9OwogICAgICB9IGVsc2UgewogICAgICAgIHZhciBbbCwgcl0gPSBzdHIuc3BsaXQoIi4iKTsKICAgICAgfQogICAgICByZXR1cm4gW2wubGVuZ3RoLCByID8gci5sZW5ndGggOiAwXTsKICAgIH0sCiAgICAvLyBHZXQgYSBoYXNoIG9mIGN1cnJlbnQgb3ZlcmxheSBkaXNwb3NpdGlvbjoKICAgIC8vIHBhbmUxLnV1aWQrb3YxLnR5cGUrb3YyLnR5cGUrLi4uK3BhbmUyLnV1aWQrLi4uCiAgICBvdkRpc3Bvc2l0aW9uSGFzaChwYW5lcykgewogICAgICBsZXQgaCA9ICIiOwogICAgICBmb3IgKHZhciBwYW5lIG9mIHBhbmVzKSB7CiAgICAgICAgaCArPSBwYW5lLnV1aWQ7CiAgICAgICAgZm9yICh2YXIgb3Ygb2YgcGFuZS5vdmVybGF5cykgewogICAgICAgICAgaWYgKG92Lm1haW4pCiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgaCArPSBvdi50eXBlOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gaDsKICAgIH0sCiAgICAvLyBGb3JtYXQgY3Vyc29yIGV2ZW50IGZvciB0aGUgJyRjdXJzb3ItdXBkYXRlJyBob29rCiAgICAvLyBUT0RPOiBkb2Vzbid0IHdvcmsgZm9yIHJlbmtvCiAgICBtYWtlQ3Vyc29yRXZlbnQoJGN1cnNvciwgY3Vyc29yLCBsYXlvdXQpIHsKICAgICAgJGN1cnNvci52YWx1ZXMgPSBjdXJzb3IudmFsdWVzOwogICAgICAkY3Vyc29yLnRpID0gY3Vyc29yLnRpOwogICAgICAkY3Vyc29yLnRpbWUgPSBjdXJzb3IudGltZTsKICAgICAgJGN1cnNvci5vaGxjQ29vcmQgPSAoKSA9PiB7CiAgICAgICAgbGV0IG9obGMgPSBsYXlvdXQubWFpbi5vaGxjKGN1cnNvci50aW1lKTsKICAgICAgICByZXR1cm4gb2hsYyA/IHsKICAgICAgICAgIHg6IGxheW91dC5tYWluLnRpbWUyeChjdXJzb3IudGkpLAogICAgICAgICAgeXM6IG9obGMubWFwKCh4KSA9PiBsYXlvdXQubWFpbi52YWx1ZTJ5KHgpKQogICAgICAgIH0gOiBudWxsOwogICAgICB9OwogICAgICByZXR1cm4gJGN1cnNvcjsKICAgIH0sCiAgICAvLyBBZGp1c3QgbW91c2UgY29vcmRzIHRvIGZpeCB0aGUgc2hpZnQgY2F1c2VkIGJ5IAogICAgLy8gY3NzIHRyYW5zZm9ybXMKICAgIGFkanVzdE1vdXNlKGV2ZW50LCBjYW52YXMpIHsKICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsKICAgICAgY29uc3QgYWRqdXN0ZWRYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDsKICAgICAgY29uc3QgYWRqdXN0ZWRZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wOwogICAgICByZXR1cm4gbmV3IFByb3h5KGV2ZW50LCB7CiAgICAgICAgZ2V0KHRhcmdldCwgcHJvcCkgewogICAgICAgICAgaWYgKHByb3AgPT09ICJsYXllclgiKSB7CiAgICAgICAgICAgIHJldHVybiBhZGp1c3RlZFg7CiAgICAgICAgICB9IGVsc2UgaWYgKHByb3AgPT09ICJsYXllclkiKSB7CiAgICAgICAgICAgIHJldHVybiBhZGp1c3RlZFk7CiAgICAgICAgICB9CiAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wXSA9PT0gImZ1bmN0aW9uIikgewogICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdLmJpbmQodGFyZ2V0KTsKICAgICAgICAgIH0KICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07CiAgICAgICAgfQogICAgICB9KTsKICAgIH0sCiAgICAvLyBHUFQgdG8gdGhlIG1vb24hCiAgICBnZXRDYW5kbGVUaW1lKHRmKSB7CiAgICAgIGNvbnN0IEhPVVIyID0gNjAgKiA2MCAqIDFlMzsKICAgICAgY29uc3QgdGltZSA9ICgvKiBAX19QVVJFX18gKi8gbmV3IERhdGUoKSkuZ2V0VGltZSgpOwogICAgICBjb25zdCBub3cyID0gbmV3IERhdGUodGltZSksIGggPSBub3cyLmdldEhvdXJzKCksIG0gPSBub3cyLmdldE1pbnV0ZXMoKSwgcyA9IG5vdzIuZ2V0U2Vjb25kcygpLCBNbyA9IG5vdzIuZ2V0TW9udGgoKSwgRCA9IG5vdzIuZ2V0RGF5KCksIFkgPSBub3cyLmdldEZ1bGxZZWFyKCk7CiAgICAgIGxldCBydDsKICAgICAgc3dpdGNoICh0ZikgewogICAgICAgIGNhc2UgTUlOVVRFOgogICAgICAgICAgcnQgPSA2MCAtIHM7CiAgICAgICAgICByZXR1cm4gYDAwOiR7cnQgPCAxMCA/ICIwIiA6ICIifSR7cnR9YDsKICAgICAgICBjYXNlIE1JTlVURTI6CiAgICAgICAgICBydCA9IDIgKiA2MCAtIG0gJSAyICogNjAgLSBzOwogICAgICAgICAgcmV0dXJuIGAke01hdGguZmxvb3IocnQgLyA2MCl9OiR7cnQgJSA2MCA8IDEwID8gIjAiIDogIiJ9JHtydCAlIDYwfWA7CiAgICAgICAgY2FzZSBNSU5VVEU1OgogICAgICAgICAgcnQgPSA1ICogNjAgLSBtICUgNSAqIDYwIC0gczsKICAgICAgICAgIHJldHVybiBgJHtNYXRoLmZsb29yKHJ0IC8gNjApfToke3J0ICUgNjAgPCAxMCA/ICIwIiA6ICIifSR7cnQgJSA2MH1gOwogICAgICAgIGNhc2UgTUlOVVRFMTU6CiAgICAgICAgICBydCA9IDE1ICogNjAgLSBtICUgMTUgKiA2MCAtIHM7CiAgICAgICAgICByZXR1cm4gYCR7TWF0aC5mbG9vcihydCAvIDYwKX06JHtydCAlIDYwIDwgMTAgPyAiMCIgOiAiIn0ke3J0ICUgNjB9YDsKICAgICAgICBjYXNlIE1JTlVURTMwOgogICAgICAgICAgcnQgPSAzMCAqIDYwIC0gbSAlIDMwICogNjAgLSBzOwogICAgICAgICAgcmV0dXJuIGAke01hdGguZmxvb3IocnQgLyA2MCl9OiR7cnQgJSA2MCA8IDEwID8gIjAiIDogIiJ9JHtydCAlIDYwfWA7CiAgICAgICAgY2FzZSBIT1VSMjoKICAgICAgICAgIHJ0ID0gNjAgKiA2MCAtIG0gKiA2MCAtIHM7CiAgICAgICAgICByZXR1cm4gYCR7KE1hdGguZmxvb3IocnQgJSAzNjAwIC8gNjApICsgIiIpLnBhZFN0YXJ0KDIsICIwIil9OiR7KHJ0ICUgNjAgKyAiIikucGFkU3RhcnQoMiwgIjAiKX1gOwogICAgICAgIGNhc2UgSE9VUjQ6IHsKICAgICAgICAgIHJ0ID0gNCAqIDYwICogNjAgLSBoICUgNCAqIDM2MDAgLSBtICogNjAgLSBzOwogICAgICAgICAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHJ0IC8gMzYwMCk7CiAgICAgICAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcihydCAlIDM2MDAgLyA2MCk7CiAgICAgICAgICBpZiAoaG91cnMgPT09IDApIHsKICAgICAgICAgICAgcmV0dXJuIGAke21pbnV0ZXN9OiR7KHJ0ICUgNjAgKyAiIikucGFkU3RhcnQoMiwgIjAiKX1gOwogICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgcmV0dXJuIGAke2hvdXJzfTokeyhtaW51dGVzICsgIiIpLnBhZFN0YXJ0KDIsICIwIil9OiR7KHJ0ICUgNjAgKyAiIikucGFkU3RhcnQoMiwgIjAiKX1gOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBjYXNlIEhPVVIxMjogewogICAgICAgICAgcnQgPSAxMiAqIDYwICogNjAgLSBoICUgMTIgKiAzNjAwIC0gbSAqIDYwIC0gczsKICAgICAgICAgIGNvbnN0IGhvdXJzID0gTWF0aC5mbG9vcihydCAvIDM2MDApOwogICAgICAgICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IocnQgJSAzNjAwIC8gNjApOwogICAgICAgICAgaWYgKGhvdXJzID09PSAwKSB7CiAgICAgICAgICAgIHJldHVybiBgJHttaW51dGVzfTokeyhydCAlIDYwICsgIiIpLnBhZFN0YXJ0KDIsICIwIil9YDsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHJldHVybiBgJHtob3Vyc306JHsobWludXRlcyArICIiKS5wYWRTdGFydCgyLCAiMCIpfTokeyhydCAlIDYwICsgIiIpLnBhZFN0YXJ0KDIsICIwIil9YDsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgY2FzZSBEQVk6CiAgICAgICAgICBydCA9IDI0ICogNjAgKiA2MCAtIGggKiAzNjAwIC0gbSAqIDYwIC0gczsKICAgICAgICAgIHJldHVybiBgJHtNYXRoLmZsb29yKHJ0IC8gMzYwMCl9OiR7KE1hdGguZmxvb3IocnQgJSAzNjAwIC8gNjApICsgIiIpLnBhZFN0YXJ0KDIsICIwIil9OiR7KHJ0ICUgNjAgKyAiIikucGFkU3RhcnQoMiwgIjAiKX1gOwogICAgICAgIGNhc2UgV0VFSzoKICAgICAgICAgIHJ0ID0gNyAqIDI0ICogNjAgKiA2MCAtIChEIHx8IDcpICogMjQgKiA2MCAqIDYwIC0gaCAqIDM2MDAgLSBtICogNjAgLSBzOwogICAgICAgICAgcmV0dXJuIGAke01hdGguZmxvb3IocnQgLyAoMjQgKiAzNjAwKSl9ZCAke01hdGguZmxvb3IocnQgJSAoMjQgKiAzNjAwKSAvIDM2MDApfWhgOwogICAgICAgIGNhc2UgTU9OVEg6CiAgICAgICAgICBjb25zdCBlbmRPZk1vbnRoID0gbmV3IERhdGUoRGF0ZS5VVEMobm93Mi5nZXRVVENGdWxsWWVhcigpLCBNbyArIDEsIDEpKTsKICAgICAgICAgIHJ0ID0gKGVuZE9mTW9udGggLSBub3cyKSAvIDFlMzsKICAgICAgICAgIHJldHVybiBgJHtNYXRoLmZsb29yKHJ0IC8gKDI0ICogMzYwMCkpfWQgJHtNYXRoLmZsb29yKHJ0ICUgKDI0ICogMzYwMCkgLyAzNjAwKX1oYDsKICAgICAgICBjYXNlIFlFQVI6CiAgICAgICAgICBjb25zdCBzdGFydE9mWWVhciA9IG5ldyBEYXRlKERhdGUuVVRDKFksIDAsIDEpKTsKICAgICAgICAgIGNvbnN0IGVuZE9mWWVhciA9IG5ldyBEYXRlKERhdGUuVVRDKFkgKyAxLCAwLCAxKSk7CiAgICAgICAgICBjb25zdCB0b3RhbFNlY29uZHNJblllYXIgPSAoZW5kT2ZZZWFyIC0gc3RhcnRPZlllYXIpIC8gMWUzOwogICAgICAgICAgcnQgPSB0b3RhbFNlY29uZHNJblllYXIgLSAobm93MiAtIHN0YXJ0T2ZZZWFyKSAvIDFlMzsKICAgICAgICAgIHJldHVybiBgJHtNYXRoLmZsb29yKHJ0IC8gKDI0ICogMzYwMCkpfWQgJHtNYXRoLmZsb29yKHJ0ICUgKDI0ICogMzYwMCkgLyAzNjAwKX1oYDsKICAgICAgICBkZWZhdWx0OgogICAgICAgICAgcmV0dXJuICJVbmsgVEYiOwogICAgICB9CiAgICB9LAogICAgLy8gV1RGIHdpdGggbW9kZXJuIHdlYiBkZXZlbG9wbWVudAogICAgaXNNb2JpbGU6ICgodykgPT4gIm9ub3JpZW50YXRpb25jaGFuZ2UiIGluIHcgJiYgKCEhbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzIHx8ICEhbmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgfHwgKCJvbnRvdWNoc3RhcnQiIGluIHcgfHwgdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2Ygdy5Eb2N1bWVudFRvdWNoKSkpKHR5cGVvZiB3aW5kb3cgIT09ICJ1bmRlZmluZWQiID8gd2luZG93IDoge30pCiAgfTsKICBjb25zdCBGREVGUyA9IC8oZnVuY3Rpb24gfCkoWyRBLVpfXVswLTlBLVpfJFwuXSopW1xzXSo/XCgoLio/KVwpL2dtaTsKICBjb25zdCBTQlJBQ0tFVFMgPSAvKFskQS1aX11bMC05QS1aXyRcLl0qKVtcc10qP1xbKFteIl5cW15cXV0rPylcXS9nbWk7CiAgY29uc3QgVEZTVFIgPSAvKFxkKykoXHcqKS9nbTsKICBjb25zdCBCVUZfSU5DJDEgPSA1OwogIHZhciB0Zl9jYWNoZSA9IHt9OwogIGZ1bmN0aW9uIGZfYXJncyhzcmMpIHsKICAgIEZERUZTLmxhc3RJbmRleCA9IDA7CiAgICB2YXIgbSA9IEZERUZTLmV4ZWMoc3JjKTsKICAgIGlmIChtKSB7CiAgICAgIG1bMV0udHJpbSgpOwogICAgICBtWzJdLnRyaW0oKTsKICAgICAgbGV0IGZhcmdzID0gbVszXS50cmltKCk7CiAgICAgIHJldHVybiBmYXJncy5zcGxpdCgiLCIpLm1hcCgoeCkgPT4geC50cmltKCkpOwogICAgfQogICAgcmV0dXJuIFtdOwogIH0KICBmdW5jdGlvbiBmX2JvZHkoc3JjKSB7CiAgICByZXR1cm4gc3JjLnNsaWNlKAogICAgICBzcmMuaW5kZXhPZigieyIpICsgMSwKICAgICAgc3JjLmxhc3RJbmRleE9mKCJ9IikKICAgICk7CiAgfQogIGZ1bmN0aW9uIHdyYXBfaWR4cyhzcmMsIHByZSA9ICIiKSB7CiAgICBTQlJBQ0tFVFMubGFzdEluZGV4ID0gMDsKICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7CiAgICBkbyB7CiAgICAgIHZhciBtID0gU0JSQUNLRVRTLmV4ZWMoc3JjKTsKICAgICAgaWYgKG0pIHsKICAgICAgICBsZXQgdm5hbWUgPSBtWzFdLnRyaW0oKTsKICAgICAgICBsZXQgdmluZGV4ID0gbVsyXS50cmltKCk7CiAgICAgICAgaWYgKHZpbmRleCA9PT0gIjAiIHx8IHBhcnNlSW50KHZpbmRleCkgPCBCVUZfSU5DJDEpIHsKICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIH0KICAgICAgICBzd2l0Y2ggKHZuYW1lKSB7CiAgICAgICAgICBjYXNlICJsZXQiOgogICAgICAgICAgY2FzZSAidmFyIjoKICAgICAgICAgIGNhc2UgInJldHVybiI6CiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIH0KICAgICAgICBsZXQgd3JhcCA9IGAke3ZuYW1lfVske3ByZX1faSgke3ZpbmRleH0sICR7dm5hbWV9KV1gOwogICAgICAgIHNyYyA9IHNyYy5yZXBsYWNlKG1bMF0sIHdyYXApOwogICAgICAgIGNoYW5nZWQgPSB0cnVlOwogICAgICB9CiAgICB9IHdoaWxlIChtKTsKICAgIHJldHVybiBjaGFuZ2VkID8gc3JjIDogc3JjOwogIH0KICBmdW5jdGlvbiB0Zl9mcm9tX3BhaXIobnVtLCBwZikgewogICAgdmFyIG11bHQgPSAxOwogICAgc3dpdGNoIChwZikgewogICAgICBjYXNlICJzIjoKICAgICAgICBtdWx0ID0gQ29uc3QuU0VDT05EOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICJtIjoKICAgICAgICBtdWx0ID0gQ29uc3QuTUlOVVRFOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICJIIjoKICAgICAgICBtdWx0ID0gQ29uc3QuSE9VUjsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAiRCI6CiAgICAgICAgbXVsdCA9IENvbnN0LkRBWTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAiVyI6CiAgICAgICAgbXVsdCA9IENvbnN0LldFRUs7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgIk0iOgogICAgICAgIG11bHQgPSBDb25zdC5NT05USDsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAiWSI6CiAgICAgICAgbXVsdCA9IENvbnN0LllFQVI7CiAgICAgICAgYnJlYWs7CiAgICB9CiAgICByZXR1cm4gcGFyc2VJbnQobnVtKSAqIG11bHQ7CiAgfQogIGZ1bmN0aW9uIHRmX2Zyb21fc3RyKHN0cikgewogICAgaWYgKHR5cGVvZiBzdHIgPT09ICJudW1iZXIiKQogICAgICByZXR1cm4gc3RyOwogICAgaWYgKHRmX2NhY2hlW3N0cl0pCiAgICAgIHJldHVybiB0Zl9jYWNoZVtzdHJdOwogICAgVEZTVFIubGFzdEluZGV4ID0gMDsKICAgIGxldCBtID0gVEZTVFIuZXhlYyhzdHIpOwogICAgaWYgKG0pIHsKICAgICAgdGZfY2FjaGVbc3RyXSA9IHRmX2Zyb21fcGFpcihtWzFdLCBtWzJdKTsKICAgICAgcmV0dXJuIHRmX2NhY2hlW3N0cl07CiAgICB9CiAgICByZXR1cm4gdm9pZCAwOwogIH0KICBmdW5jdGlvbiBnZXRfZm5faWQocHJlLCBpZCkgewogICAgcmV0dXJuIHByZSArICItIiArIGlkLnNwbGl0KCI8LSIpLnBvcCgpOwogIH0KICBmdW5jdGlvbiBuZXh0dChkYXRhLCB0LCB0aSA9IDApIHsKICAgIGxldCBpMCA9IDA7CiAgICBsZXQgaU4gPSBkYXRhLmxlbmd0aCAtIDE7CiAgICB3aGlsZSAoaTAgPD0gaU4pIHsKICAgICAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGkwICsgaU4pIC8gMik7CiAgICAgIGlmIChkYXRhW21pZF1bdGldID09PSB0KSB7CiAgICAgICAgcmV0dXJuIG1pZDsKICAgICAgfSBlbHNlIGlmIChkYXRhW21pZF1bdGldIDwgdCkgewogICAgICAgIGkwID0gbWlkICsgMTsKICAgICAgfSBlbHNlIHsKICAgICAgICBpTiA9IG1pZCAtIDE7CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0IDwgZGF0YVttaWRdW3RpXSA/IG1pZCA6IG1pZCArIDE7CiAgfQogIGZ1bmN0aW9uIHNpemVfb2ZfZHNzKGRhdGEpIHsKICAgIGxldCBieXRlcyA9IDA7CiAgICBmb3IgKHZhciBpZCBpbiBkYXRhKSB7CiAgICAgIGlmIChkYXRhW2lkXS5kYXRhICYmIGRhdGFbaWRdLmRhdGFbMF0pIHsKICAgICAgICBsZXQgczAgPSBzaXplX29mKGRhdGFbaWRdLmRhdGFbMF0pOwogICAgICAgIGJ5dGVzICs9IHMwICogZGF0YVtpZF0uZGF0YS5sZW5ndGg7CiAgICAgIH0KICAgIH0KICAgIHJldHVybiBieXRlczsKICB9CiAgZnVuY3Rpb24gc2l6ZV9vZihvYmplY3QpIHsKICAgIHZhciBsaXN0ID0gW10sIHN0YWNrID0gW29iamVjdF0sIGJ5dGVzID0gMDsKICAgIHdoaWxlIChzdGFjay5sZW5ndGgpIHsKICAgICAgdmFyIHZhbHVlID0gc3RhY2sucG9wKCk7CiAgICAgIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlOwogICAgICBpZiAodHlwZSA9PT0gImJvb2xlYW4iKSB7CiAgICAgICAgYnl0ZXMgKz0gNDsKICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAic3RyaW5nIikgewogICAgICAgIGJ5dGVzICs9IHZhbHVlLmxlbmd0aCAqIDI7CiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gIm51bWJlciIpIHsKICAgICAgICBieXRlcyArPSA4OwogICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICJvYmplY3QiICYmIGxpc3QuaW5kZXhPZih2YWx1ZSkgPT09IC0xKSB7CiAgICAgICAgbGlzdC5wdXNoKHZhbHVlKTsKICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSB7CiAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlW2ldKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIHJldHVybiBieXRlczsKICB9CiAgZnVuY3Rpb24gdXBkYXRlKGRhdGEsIHZhbCkgewogICAgY29uc3QgaSA9IGRhdGEubGVuZ3RoIC0gMTsKICAgIGNvbnN0IGxhc3QgPSBkYXRhW2ldOwogICAgaWYgKCFsYXN0IHx8IHZhbFswXSA+IGxhc3RbMF0pIHsKICAgICAgZGF0YS5wdXNoKHZhbCk7CiAgICB9IGVsc2UgewogICAgICBkYXRhW2ldID0gdmFsOwogICAgfQogIH0KICBmdW5jdGlvbiBub3coKSB7CiAgICByZXR1cm4gKC8qIEBfX1BVUkVfXyAqLyBuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7CiAgfQogIGZ1bmN0aW9uIG92ZXJyaWRlT3ZlcmxheShvdjEsIG92MikgewogICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob3YyKSkgewogICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAib2JqZWN0IiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHsKICAgICAgICBpZiAoIW92MVtrZXldKSB7CiAgICAgICAgICBvdjFba2V5XSA9IHt9OwogICAgICAgIH0KICAgICAgICBPYmplY3QuYXNzaWduKG92MVtrZXldLCB2YWx1ZSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgb3YxW2tleV0gPSB2YWx1ZTsKICAgICAgfQogICAgfQogICAgcmV0dXJuIG92MTsKICB9CiAgY29uc3QgREVGX0xJTUlUJDIgPSA1OwogIGZ1bmN0aW9uIFNhbXBsZXIoVCwgYXV0byA9IGZhbHNlKSB7CiAgICBsZXQgVGkgPSBbImhpZ2giLCAibG93IiwgImNsb3NlIiwgInZvbCJdLmluZGV4T2YoVCk7CiAgICByZXR1cm4gZnVuY3Rpb24oeCwgdCkgewogICAgICBsZXQgdGYgPSB0aGlzLl9fdGZfXzsKICAgICAgdGhpcy5fX2lkX187CiAgICAgIHQgPSB0IHx8IHNlLnQ7CiAgICAgIGxldCB2YWwgPSBhdXRvID8gc2VbVF1bMF0gOiB4OwogICAgICBpZiAoIXRoaXMuX190MF9fIHx8IHQgPj0gdGhpcy5fX3QwX18gKyB0ZikgewogICAgICAgIHRoaXMudW5zaGlmdChUaSAhPT0gMyA/IHZhbCA6IDApOwogICAgICAgIHRoaXMuX190MF9fID0gdCAtIHQgJSB0ZjsKICAgICAgfQogICAgICBzd2l0Y2ggKFRpKSB7CiAgICAgICAgY2FzZSAwOgogICAgICAgICAgaWYgKHZhbCA+IHRoaXNbMF0pCiAgICAgICAgICAgIHRoaXNbMF0gPSB2YWw7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIDE6CiAgICAgICAgICBpZiAodmFsIDwgdGhpc1swXSkKICAgICAgICAgICAgdGhpc1swXSA9IHZhbDsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgMjoKICAgICAgICAgIHRoaXNbMF0gPSB2YWw7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIDM6CiAgICAgICAgICB0aGlzWzBdICs9IHZhbDsKICAgICAgfQogICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuX19sZW5fXyB8fCBERUZfTElNSVQkMjsKICAgIH07CiAgfQogIGZ1bmN0aW9uIFRTKGlkLCBhcnIsIGxlbikgewogICAgYXJyLl9faWRfXyA9IGlkOwogICAgYXJyLl9fbGVuX18gPSBsZW47CiAgICByZXR1cm4gYXJyOwogIH0KICBjb25zdCBPSExDViA9IFsib3BlbiIsICJoaWdoIiwgImxvdyIsICJjbG9zZSIsICJ2b2wiXTsKICBjb25zdCBBUlIgPSAwOwogIGNvbnN0IFRTUyA9IDE7CiAgY29uc3QgTlVNID0gMjsKICBjbGFzcyBTeW0gewogICAgY29uc3RydWN0b3IoZGF0YSwgcGFyYW1zKSB7CiAgICAgIHRoaXMuaWQgPSBwYXJhbXMuaWQ7CiAgICAgIHRoaXMudGYgPSB0Zl9mcm9tX3N0cihwYXJhbXMudGYpOwogICAgICB0aGlzLmZvcm1hdCA9IHBhcmFtcy5mb3JtYXQ7CiAgICAgIHRoaXMuYWdndHlwZSA9IHBhcmFtcy5hZ2d0eXBlIHx8ICJvaGxjdiI7CiAgICAgIHRoaXMud2luZG93ID0gdGZfZnJvbV9zdHIocGFyYW1zLndpbmRvdyk7CiAgICAgIHRoaXMuZmlsbGdhcHMgPSBwYXJhbXMuZmlsbGdhcHM7CiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7CiAgICAgIHRoaXMuZGF0YV90eXBlID0gQVJSOwogICAgICB0aGlzLm1haW4gPSAhIXBhcmFtcy5tYWluOwogICAgICB0aGlzLmlkeCA9IHRoaXMuZGF0YV9pZHgoKTsKICAgICAgdGhpcy50bWFwID0ge307CiAgICAgIHRoaXMudGYgPSB0aGlzLnRmIHx8IHNlLnRmOwogICAgICBpZiAodGhpcy5tYWluKQogICAgICAgIHRoaXMudGYgPSBzZS50ZjsKICAgICAgaWYgKHRoaXMuYWdndHlwZSA9PT0gIm9obGN2IikgewogICAgICAgIGZvciAodmFyIGlkIG9mIE9ITENWKSB7CiAgICAgICAgICB0aGlzW2lkXSA9IFRTKGAke3RoaXMuaWR9XyR7aWR9YCwgW10pOwogICAgICAgICAgdGhpc1tpZF0uX19mbl9fID0gU2FtcGxlcihpZCkuYmluZCh0aGlzW2lkXSk7CiAgICAgICAgICB0aGlzW2lkXS5fX3RmX18gPSB0aGlzLnRmOwogICAgICAgIH0KICAgICAgfQogICAgICBpZiAodGhpcy5hZ2d0eXBlID09PSAiY29weSIpIHsKICAgICAgICBmb3IgKHZhciBpZCBvZiBPSExDVikgewogICAgICAgICAgdGhpc1tpZF0gPSBUUyhgJHt0aGlzLmlkfV8ke2lkfWAsIFtdKTsKICAgICAgICAgIHRoaXNbaWRdLl9fdGZfXyA9IHRoaXMudGY7CiAgICAgICAgfQogICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICB0aGlzLnRtYXBbdGhpcy5kYXRhW2ldWzBdXSA9IGk7CiAgICAgICAgfQogICAgICB9CiAgICAgIGlmICh0eXBlb2YgdGhpcy5hZ2d0eXBlID09PSAiZnVuY3Rpb24iKSB7CiAgICAgICAgdGhpcy5jbG9zZSA9IFRTKGAke3RoaXMuaWR9X2Nsb3NlYCwgW10pOwogICAgICAgIHRoaXMuY2xvc2UuX19mbl9fID0gdGhpcy5hZ2d0eXBlOwogICAgICAgIHRoaXMuY2xvc2UuX190Zl9fID0gdGhpcy50ZjsKICAgICAgfQogICAgICBpZiAodGhpcy5tYWluKSB7CiAgICAgICAgaWYgKCF0aGlzLnRmKQogICAgICAgICAgdGhyb3cgIk1haW4gdGYgc2hvdWxkIGJlIGRlZmluZWQiOwogICAgICAgIHNlLmN1c3RvbV9tYWluID0gdGhpczsKICAgICAgICBsZXQgdDAgPSB0aGlzLmRhdGFbMF1bMF07CiAgICAgICAgc2UudCA9IHQwIC0gdDAgJSB0aGlzLnRmOwogICAgICAgIHRoaXMudXBkYXRlKG51bGwsIHNlLnQpOwogICAgICAgIHNlLmRhdGEub2hsY3YuZGF0YS5sZW5ndGggPSAwOwogICAgICAgIHNlLmRhdGEub2hsY3YuZGF0YS5wdXNoKFsKICAgICAgICAgIHNlLnQsCiAgICAgICAgICB0aGlzLm9wZW5bMF0sCiAgICAgICAgICB0aGlzLmhpZ2hbMF0sCiAgICAgICAgICB0aGlzLmxvd1swXSwKICAgICAgICAgIHRoaXMuY2xvc2VbMF0sCiAgICAgICAgICB0aGlzLnZvbFswXQogICAgICAgIF0pOwogICAgICB9CiAgICB9CiAgICB1cGRhdGUoeCwgdCkgewogICAgICBpZiAodGhpcy5hZ2d0eXBlID09PSAib2hsY3YiKSB7CiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlX29obGN2KHgsIHQpOwogICAgICB9IGVsc2UgaWYgKHRoaXMuYWdndHlwZSA9PT0gImNvcHkiKSB7CiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlX2NvcHkoeCwgdCk7CiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuYWdndHlwZSA9PT0gImZ1bmN0aW9uIikgewogICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZV9jdXN0b20oeCwgdCk7CiAgICAgIH0KICAgIH0KICAgIHVwZGF0ZV9vaGxjdih4LCB0KSB7CiAgICAgIHQgPSB0IHx8IHNlLnQ7CiAgICAgIGxldCBpZHggPSB0aGlzLmlkeDsKICAgICAgc3dpdGNoICh0aGlzLmRhdGFfdHlwZSkgewogICAgICAgIGNhc2UgQVJSOgogICAgICAgICAgaWYgKHQgPiB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdWzBdKQogICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICBsZXQgdDAgPSB0aGlzLndpbmRvdyA/IHQgLSB0aGlzLndpbmRvdyArIHRoaXMudGYgOiB0OwogICAgICAgICAgbGV0IGR0ID0gdDAgJSB0aGlzLnRmOwogICAgICAgICAgdDAgLT0gZHQ7CiAgICAgICAgICBsZXQgaTAgPSBuZXh0dCh0aGlzLmRhdGEsIHQwKTsKICAgICAgICAgIGlmIChpMCA+PSB0aGlzLmRhdGEubGVuZ3RoKQogICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICBsZXQgdDEgPSB0ICsgc2UudGY7CiAgICAgICAgICBpZiAodCA8IHRoaXMudm9sLl9fdDBfXyArIHRoaXMudGYpCiAgICAgICAgICAgIHRoaXMudm9sWzBdID0gMDsKICAgICAgICAgIGxldCBub2V2ZW50ID0gdHJ1ZTsKICAgICAgICAgIGZvciAodmFyIGkgPSBpMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykgewogICAgICAgICAgICBub2V2ZW50ID0gZmFsc2U7CiAgICAgICAgICAgIGxldCBkcCA9IHRoaXMuZGF0YVtpXTsKICAgICAgICAgICAgaWYgKGRwW2lkeC50aW1lXSA+PSB0MSkKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgdGhpcy5vcGVuLl9fZm5fXyhkcFtpZHgub3Blbl0sIHQpOwogICAgICAgICAgICB0aGlzLmhpZ2guX19mbl9fKGRwW2lkeC5oaWdoXSwgdCk7CiAgICAgICAgICAgIHRoaXMubG93Ll9fZm5fXyhkcFtpZHgubG93XSwgdCk7CiAgICAgICAgICAgIHRoaXMuY2xvc2UuX19mbl9fKGRwW2lkeC5jbG9zZV0sIHQpOwogICAgICAgICAgICB0aGlzLnZvbC5fX2ZuX18oZHBbaWR4LnZvbF0sIHQpOwogICAgICAgICAgfQogICAgICAgICAgaWYgKG5vZXZlbnQpIHsKICAgICAgICAgICAgaWYgKHRoaXMuZmlsbGdhcHMgPT09IGZhbHNlICYmICF0aGlzLm1haW4pCiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgICAgICBsZXQgbGFzdCA9IHRoaXMuY2xvc2VbMF07CiAgICAgICAgICAgIHRoaXMub3Blbi5fX2ZuX18obGFzdCwgdCk7CiAgICAgICAgICAgIHRoaXMuaGlnaC5fX2ZuX18obGFzdCwgdCk7CiAgICAgICAgICAgIHRoaXMubG93Ll9fZm5fXyhsYXN0LCB0KTsKICAgICAgICAgICAgdGhpcy5jbG9zZS5fX2ZuX18obGFzdCwgdCk7CiAgICAgICAgICAgIHRoaXMudm9sLl9fZm5fXygwLCB0KTsKICAgICAgICAgIH0KICAgICAgICAgIGJyZWFrOwogICAgICB9CiAgICAgIHJldHVybiB0cnVlOwogICAgfQogICAgdXBkYXRlX2NvcHkoeCwgdCkgewogICAgICB0ID0gdCB8fCBzZS50OwogICAgICBsZXQgaSA9IHRoaXMudG1hcFt0XTsKICAgICAgbGV0IHMgPSB0aGlzLmRhdGFbaV07CiAgICAgIGxldCB0czAgPSB0aGlzLl9fdDBfXzsKICAgICAgaWYgKCF0czAgfHwgdCA+PSB0czAgKyB0aGlzLnRmKSB7CiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCA1OyBrKyspIHsKICAgICAgICAgIGxldCB0c24gPSBPSExDVltrXTsKICAgICAgICAgIHRoaXNbdHNuXS51bnNoaWZ0KHZvaWQgMCk7CiAgICAgICAgfQogICAgICAgIHRoaXMuX190MF9fID0gdCAtIHQgJSB0aGlzLnRmOwogICAgICAgIGxldCBsYXN0ID0gdGhpcy5kYXRhLmxlbmd0aCAtIDE7CiAgICAgICAgaWYgKHRoaXMuX190MF9fID09PSB0aGlzLmRhdGFbbGFzdF1bMF0pIHsKICAgICAgICAgIHRoaXMudG1hcFt0aGlzLl9fdDBfX10gPSBsYXN0OwogICAgICAgICAgcyA9IHRoaXMuZGF0YVtsYXN0XTsKICAgICAgICB9CiAgICAgIH0KICAgICAgaWYgKHMpIHsKICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IDU7IGsrKykgewogICAgICAgICAgbGV0IHRzbiA9IE9ITENWW2tdOwogICAgICAgICAgdGhpc1t0c25dWzBdID0gc1trICsgMV07CiAgICAgICAgfQogICAgICB9IGVsc2UgaWYgKHRoaXMuZmlsbGdhcHMpIHsKICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IDU7IGsrKykgewogICAgICAgICAgbGV0IHRzbiA9IE9ITENWW2tdOwogICAgICAgICAgdGhpc1t0c25dWzBdID0gdGhpcy5jbG9zZVsxXTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIHVwZGF0ZV9jdXN0b20oeCwgdCkgewogICAgICB0ID0gdCB8fCBzZS50OwogICAgICBsZXQgaWR4ID0gdGhpcy5pZHg7CiAgICAgIHN3aXRjaCAodGhpcy5kYXRhX3R5cGUpIHsKICAgICAgICBjYXNlIEFSUjoKICAgICAgICAgIGlmICghdGhpcy5kYXRhLmxlbmd0aCkKICAgICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgICAgaWYgKHQgPiB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdWzBdKQogICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICBsZXQgdDAgPSB0aGlzLndpbmRvdyA/IHQgLSB0aGlzLndpbmRvdyArIHRoaXMudGYgOiB0OwogICAgICAgICAgbGV0IGR0ID0gdDAgJSB0aGlzLnRmOwogICAgICAgICAgdDAgLT0gZHQ7CiAgICAgICAgICBsZXQgaTAgPSBuZXh0dCh0aGlzLmRhdGEsIHQwKTsKICAgICAgICAgIGlmIChpMCA+PSB0aGlzLmRhdGEubGVuZ3RoKQogICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICBsZXQgdDEgPSB0ICsgc2UudGY7CiAgICAgICAgICBsZXQgc3ViID0gW107CiAgICAgICAgICBmb3IgKHZhciBpID0gaTA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgbGV0IGRwID0gdGhpcy5kYXRhW2ldOwogICAgICAgICAgICBpZiAoZHBbaWR4LnRpbWVdID49IHQxKQogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICBzdWIucHVzaChkcCk7CiAgICAgICAgICB9CiAgICAgICAgICBpZiAoc3ViLmxlbmd0aCB8fCB0aGlzLmZpbGxnYXBzID09PSBmYWxzZSkgewogICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5jbG9zZS5fX2ZuX18oc3ViKTsKICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5maWxsZ2FwcyAhPT0gZmFsc2UpIHsKICAgICAgICAgICAgdmFsID0gdGhpcy5jbG9zZVswXTsKICAgICAgICAgIH0KICAgICAgICAgIGxldCB0czAgPSB0aGlzLmNsb3NlLl9fdDBfXzsKICAgICAgICAgIGlmICghdHMwIHx8IHQgPj0gdHMwICsgdGhpcy50ZikgewogICAgICAgICAgICB0aGlzLmNsb3NlLnVuc2hpZnQodmFsKTsKICAgICAgICAgICAgdGhpcy5jbG9zZS5fX3QwX18gPSB0IC0gdCAlIHRoaXMudGY7CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICB0aGlzLmNsb3NlWzBdID0gdmFsOwogICAgICAgICAgfQogICAgICAgICAgYnJlYWs7CiAgICAgIH0KICAgICAgcmV0dXJuIHRydWU7CiAgICB9CiAgICAvLyBDYWxjdWxhdGVzIGRhdGEgaW5kaWNlcyBmcm9tIHRoZSBmb3JtYXQKICAgIGRhdGFfaWR4KCkgewogICAgICBsZXQgaWR4ID0ge307CiAgICAgIHN3aXRjaCAodGhpcy5hZ2d0eXBlKSB7CiAgICAgICAgY2FzZSAib2hsY3YiOgogICAgICAgICAgaWYgKCF0aGlzLmZvcm1hdCkgewogICAgICAgICAgICBsZXQgeDAgPSB0aGlzLmRhdGFbMF07CiAgICAgICAgICAgIGlmICgheDAgfHwgeDAubGVuZ3RoID09PSA2KSB7CiAgICAgICAgICAgICAgdGhpcy5mb3JtYXQgPSAidGltZTpvcGVuOmhpZ2g6bG93OmNsb3NlOnZvbCI7CiAgICAgICAgICAgIH0gZWxzZSBpZiAoeDAubGVuZ3RoID09PSAzKSB7CiAgICAgICAgICAgICAgdGhpcy5mb3JtYXQgPSAidGltZTpvcGVuLGhpZ2gsbG93LGNsb3NlOnZvbCI7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICAgIGJyZWFrOwogICAgICAgIGRlZmF1bHQ6CiAgICAgICAgICB0aGlzLmZvcm1hdCA9ICJ0aW1lOmNsb3NlIjsKICAgICAgICAgIGJyZWFrOwogICAgICB9CiAgICAgIHRoaXMuZm9ybWF0LnNwbGl0KCI6IikuZm9yRWFjaCgoeCwgaSkgPT4gewogICAgICAgIGlmICgheC5sZW5ndGgpCiAgICAgICAgICByZXR1cm47CiAgICAgICAgbGV0IGxpc3QgPSB4LnNwbGl0KCIsIik7CiAgICAgICAgbGlzdC5mb3JFYWNoKCh5KSA9PiBpZHhbeV0gPSBpKTsKICAgICAgfSk7CiAgICAgIHJldHVybiBpZHg7CiAgICB9CiAgfQogIGNsYXNzIFZpZXcgewogICAgY29uc3RydWN0b3Ioc3RkLCBuYW1lLCBwcm9wcykgewogICAgICB0aGlzLnN0ZCA9IHN0ZDsKICAgICAgdGhpcy5uYW1lID0gbmFtZTsKICAgICAgdGhpcy5wcm9wcyA9IHByb3BzIHx8IHt9OwogICAgICB0aGlzLnByb3BzLiRzeW50aCA9IHRydWU7CiAgICAgIHRoaXMucHJvcHMudGYgPSB0Zl9mcm9tX3N0cih0aGlzLnByb3BzLnRmKTsKICAgICAgdGhpcy50ZiA9IHRoaXMucHJvcHMudGY7CiAgICAgIHRoaXMuaXRlciA9IHsKICAgICAgICBvbmNoYXJ0OiAoeCwgbiwgcykgPT4gdGhpcy5vbmNoYXJ0KHgsIG4sIHMsIHRydWUpLAogICAgICAgIG9mZmNoYXJ0OiAoeCwgbiwgcykgPT4gdGhpcy5vZmZjaGFydCh4LCBuLCBzLCB0cnVlKQogICAgICB9OwogICAgfQogICAgLy8gQWRkIGNoYXJ0IHBvaW50CiAgICBjaGFydCh4LCBzZXR0ID0ge30pIHsKICAgICAgaWYgKHRoaXMudGYgJiYgIXRoaXMuc3RkLm9uY2xvc2UodGhpcy50ZikpCiAgICAgICAgcmV0dXJuOwogICAgICBzZXR0LnZpZXcgPSB0aGlzLm5hbWU7CiAgICAgIHNldHQudnByb3BzID0gdGhpcy5wcm9wczsKICAgICAgaWYgKHggJiYgeC5hZ2d0eXBlKSB7CiAgICAgICAgbGV0IHgwID0gWwogICAgICAgICAgeC5vcGVuWzBdLAogICAgICAgICAgeC5oaWdoWzBdLAogICAgICAgICAgeC5sb3dbMF0sCiAgICAgICAgICB4LmNsb3NlWzBdLAogICAgICAgICAgeC52b2xbMF0KICAgICAgICBdOwogICAgICAgIHRoaXMuc3RkLmNoYXJ0KHgwLCBzZXR0KTsKICAgICAgfSBlbHNlIHsKICAgICAgICB0aGlzLnN0ZC5jaGFydCh4LCBzZXR0KTsKICAgICAgfQogICAgfQogICAgLy8gQWRkIG9uY2hhcnQgcG9pbnQKICAgIG9uY2hhcnQoeCwgbmFtZSwgc2V0dCA9IHt9LCBpdGVyKSB7CiAgICAgIGlmICh0aGlzLnRmICYmICF0aGlzLnN0ZC5vbmNsb3NlKHRoaXMudGYpICYmICFpdGVyKQogICAgICAgIHJldHVybjsKICAgICAgc2V0dC52aWV3ID0gdGhpcy5uYW1lOwogICAgICBzZXR0LnZwcm9wcyA9IHRoaXMucHJvcHM7CiAgICAgIG5hbWUgPSBzZXR0LnZpZXcgKyAiLyIgKyAobmFtZSB8fCAiT1YiKTsKICAgICAgdGhpcy5zdGQub25jaGFydCh4LCBuYW1lLCBzZXR0KTsKICAgIH0KICAgIC8vIEFkZCBvZmZjaGFydCBwb2ludAogICAgb2ZmY2hhcnQoeCwgbmFtZSwgc2V0dCA9IHt9LCBpdGVyKSB7CiAgICAgIGlmICh0aGlzLnRmICYmICF0aGlzLnN0ZC5vbmNsb3NlKHRoaXMudGYpICYmICFpdGVyKQogICAgICAgIHJldHVybjsKICAgICAgc2V0dC52aWV3ID0gdGhpcy5uYW1lOwogICAgICBzZXR0LnZwcm9wcyA9IHRoaXMucHJvcHM7CiAgICAgIG5hbWUgPSBzZXR0LnZpZXcgKyAiLyIgKyAobmFtZSB8fCAiT1YiKTsKICAgICAgdGhpcy5zdGQub2ZmY2hhcnQoeCwgbmFtZSwgc2V0dCk7CiAgICB9CiAgICAvLyBTZXR0ZXJzIChzZXQgdGhlIGVudGlyZSBvdmVybGF5IG9iamVjdCkKICAgICRjaGFydChkYXRhLCBzZXR0ID0ge30pIHsKICAgICAgbGV0IHR5cGUgPSBzZXR0LnR5cGU7CiAgICAgIHNldHQuJHN5bnRoID0gdHJ1ZTsKICAgICAgc2V0dC5za2lwTmFOID0gdHJ1ZTsKICAgICAgdGhpcy5zdGQuZW52LmNoYXJ0W3RoaXMubmFtZV0gPSB7CiAgICAgICAgdHlwZTogdHlwZSB8fCAiQ2FuZGxlcyIsCiAgICAgICAgZGF0YSwKICAgICAgICBzZXR0aW5nczogc2V0dCwKICAgICAgICB2aWV3OiB0aGlzLm5hbWUsCiAgICAgICAgdnByb3BzOiB0aGlzLnByb3BzLAogICAgICAgIGluZGV4QmFzZWQ6IHRoaXMucHJvcHMuaWIsCiAgICAgICAgdGY6IHRoaXMucHJvcHMudGYKICAgICAgfTsKICAgICAgZGVsZXRlIHNldHQudHlwZTsKICAgICAgZGVsZXRlIHNldHQudnByb3BzOwogICAgICBkZWxldGUgc2V0dC52aWV3OwogICAgfQogICAgJG9uY2hhcnQoZGF0YSwgbmFtZSwgc2V0dCA9IHt9KSB7CiAgICAgIGxldCB0eXBlID0gc2V0dC50eXBlOwogICAgICBuYW1lID0gdGhpcy5uYW1lICsgIi8iICsgKG5hbWUgfHwgIk9WIik7CiAgICAgIHNldHQuJHN5bnRoID0gdHJ1ZTsKICAgICAgc2V0dC5za2lwTmFOID0gdHJ1ZTsKICAgICAgdGhpcy5zdGQuZW52Lm9uY2hhcnRbbmFtZV0gPSB7CiAgICAgICAgbmFtZSwKICAgICAgICB0eXBlOiB0eXBlIHx8ICJTcGxpbmUiLAogICAgICAgIGRhdGEsCiAgICAgICAgc2V0dGluZ3M6IHNldHQsCiAgICAgICAgc2NyaXB0czogZmFsc2UsCiAgICAgICAgZ3JpZDogc2V0dC5ncmlkIHx8IHt9LAogICAgICAgIHZpZXc6IHRoaXMubmFtZSwKICAgICAgICB2cHJvcHM6IHRoaXMucHJvcHMKICAgICAgfTsKICAgICAgZGVsZXRlIHNldHQudHlwZTsKICAgICAgZGVsZXRlIHNldHQuZ3JpZDsKICAgIH0KICAgICRvZmZjaGFydChkYXRhLCBuYW1lLCBzZXR0ID0ge30pIHsKICAgICAgbGV0IHR5cGUgPSBzZXR0LnR5cGU7CiAgICAgIG5hbWUgPSB0aGlzLm5hbWUgKyAiLyIgKyAobmFtZSB8fCAiT1YiKTsKICAgICAgc2V0dC4kc3ludGggPSB0cnVlOwogICAgICBzZXR0LnNraXBOYU4gPSB0cnVlOwogICAgICB0aGlzLnN0ZC5lbnYub2ZmY2hhcnRbbmFtZV0gPSB7CiAgICAgICAgbmFtZSwKICAgICAgICB0eXBlOiB0eXBlIHx8ICJTcGxpbmUiLAogICAgICAgIGRhdGEsCiAgICAgICAgc2V0dGluZ3M6IHNldHQsCiAgICAgICAgc2NyaXB0czogZmFsc2UsCiAgICAgICAgZ3JpZDogc2V0dC5ncmlkIHx8IHt9LAogICAgICAgIHZpZXc6IHRoaXMubmFtZSwKICAgICAgICB2cHJvcHM6IHRoaXMucHJvcHMKICAgICAgfTsKICAgICAgZGVsZXRlIHNldHQudHlwZTsKICAgICAgZGVsZXRlIHNldHQuZ3JpZDsKICAgIH0KICB9CiAgY29uc3QgQlVGX0lOQyA9IDU7CiAgY2xhc3MgU2NyaXB0U3RkIHsKICAgIGNvbnN0cnVjdG9yKGVudikgewogICAgICB0aGlzLmVudiA9IGVudjsKICAgICAgdGhpcy5zZSA9IHNlOwogICAgICB0aGlzLlNXTUEgPSBbMSAvIDYsIDIgLyA2LCAyIC8gNiwgMSAvIDZdOwogICAgICB0aGlzLlNUREVWX0VQUyA9IDFlLTEwOwogICAgICB0aGlzLlNUREVWX1ogPSAxZS00OwogICAgICB0aGlzLl9pbmRleF90cmFja2luZygpOwogICAgfQogICAgLy8gV3JhcCBldmVyeSBpbmRleCB3aXRoIGluZGV4LXRyYWNraW5nIGZ1bmN0aW9uCiAgICAvLyBUaGF0IHdheSB3ZSB3aWxsIGtub3cgZXhhY3QgaW5kZXggcmFuZ2VzCiAgICBfaW5kZXhfdHJhY2tpbmcoKSB7CiAgICAgIGxldCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKTsKICAgICAgZm9yICh2YXIgayBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHsKICAgICAgICBzd2l0Y2ggKGspIHsKICAgICAgICAgIGNhc2UgImNvbnN0cnVjdG9yIjoKICAgICAgICAgIGNhc2UgInRzIjoKICAgICAgICAgIGNhc2UgInRzdGYiOgogICAgICAgICAgY2FzZSAic2FtcGxlIjoKICAgICAgICAgIGNhc2UgIl9pbmRleF90cmFja2luZyI6CiAgICAgICAgICBjYXNlICJfdHNpZCI6CiAgICAgICAgICBjYXNlICJfaSI6CiAgICAgICAgICBjYXNlICJfdiI6CiAgICAgICAgICBjYXNlICJfYWRkX2kiOgogICAgICAgICAgY2FzZSAiY2hhcnQiOgogICAgICAgICAgY2FzZSAic3ltIjoKICAgICAgICAgIGNhc2UgInZpZXciOgogICAgICAgICAgY2FzZSAicHJvcCI6CiAgICAgICAgICBjYXNlICJhdXRvUHJlYyI6CiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIH0KICAgICAgICBsZXQgZiA9IHRoaXMuX2FkZF9pKGssIHRoaXNba10udG9TdHJpbmcoKSk7CiAgICAgICAgaWYgKGYpCiAgICAgICAgICB0aGlzW2tdID0gZjsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBEZWNsYXJlIG5ldyBzY3JpcHQgcHJvcGVydHkKICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gUHJvcGVyeSBuYW1lCiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3IgLSBQcm9wZXJ5IGRlc2NyaXB0b3IKICAgICAqLwogICAgcHJvcChuYW1lLCBkZXNjcikgewogICAgICBsZXQgcHJvcHMgPSB0aGlzLmVudi5zcmMucHJvcHM7CiAgICAgIGlmICghKG5hbWUgaW4gcHJvcHMpKSB7CiAgICAgICAgcHJvcHNbbmFtZV0gPSBkZXNjci5kZWY7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogR2V0IHByZWNpc2lvbiBvZiBvaGxjIGRhdGFzZXQKICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBPaGxjIHByZWNpb3Npb24KICAgICAqLwogICAgYXV0b1ByZWMoKSB7CiAgICAgIGlmICghc2UuZGF0YS5vaGxjdikKICAgICAgICByZXR1cm4gdm9pZCAwOwogICAgICBsZXQgZGF0YSA9IHNlLmRhdGEub2hsY3YuZGF0YTsKICAgICAgbGV0IGxlbiA9IGRhdGEubGVuZ3RoOwogICAgICBsZXQgaTAgPSBNYXRoLm1heCgwLCBsZW4gLSAxMDApOwogICAgICBsZXQgbWF4ID0gMDsKICAgICAgZm9yICh2YXIgaSA9IGkwOyBpIDwgbGVuOyBpKyspIHsKICAgICAgICBsZXQgcCA9IGRhdGFbaV07CiAgICAgICAgZm9yICh2YXIgayA9IDE7IGsgPCA1OyBrKyspIHsKICAgICAgICAgIGxldCByID0gVXRpbHMubnVtYmVyTFIocFtrXSlbMV07CiAgICAgICAgICBpZiAociA+IG1heCkKICAgICAgICAgICAgbWF4ID0gcjsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIG1heDsKICAgIH0KICAgIC8vIEFkZCBpbmRleCB0cmFja2luZyB0byB0aGUgZnVuY3Rpb24KICAgIF9hZGRfaShuYW1lLCBzcmMpIHsKICAgICAgbGV0IGFyZ3MgPSBmX2FyZ3Moc3JjKTsKICAgICAgc3JjID0gZl9ib2R5KHNyYyk7CiAgICAgIGxldCBzcmMyID0gd3JhcF9pZHhzKHNyYywgInRoaXMuIik7CiAgICAgIGlmIChzcmMyICE9PSBzcmMpIHsKICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKC4uLmFyZ3MsIHNyYzIpOwogICAgICB9CiAgICAgIHJldHVybiBudWxsOwogICAgfQogICAgLy8gR2VuZXJhdGUgdGhlIG5leHQgdGltZXNlcmllcyBpZAogICAgX3RzaWQocHJldiwgbmV4dCkgewogICAgICByZXR1cm4gYCR7cHJldn08LSR7bmV4dH1gOwogICAgfQogICAgLy8gSW5kZXgtdHJhY2tlcgogICAgX2koaSwgeCkgewogICAgICBpZiAoeCAhPSB2b2lkIDAgJiYgeCA9PT0geCAmJiB4Ll9faWRfXykgewogICAgICAgIGlmICgheC5fX2xlbl9fIHx8IGkgPj0geC5fX2xlbl9fKSB7CiAgICAgICAgICB4Ll9fbGVuX18gPSBpICsgQlVGX0lOQzsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIGk7CiAgICB9CiAgICAvLyBJbmRleC10cmFja2VyIChvYmplY3QtYmFzZWQpCiAgICBfdih4LCBpKSB7CiAgICAgIGlmICh4ICE9IHZvaWQgMCAmJiB4ID09PSB4ICYmIHguX19pZF9fKSB7CiAgICAgICAgaWYgKCF4Ll9fbGVuX18gfHwgaSA+PSB4Ll9fbGVuX18pIHsKICAgICAgICAgIHguX19sZW5fXyA9IGkgKyBCVUZfSU5DOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4geDsKICAgIH0KICAgIC8qKgogICAgICogQ3JlYXRlcyBhIG5ldyB0aW1lLXNlcmllcyAmIHJlY29yZHMgZWFjaCB4LgogICAgICogUmV0dXJucyAgYW4gYXJyYXkuIElkIGlzIGF1dG8tZ2VucmF0ZWQKICAgICAqIEBwYXJhbSB7Kn0geCAtIEEgdmFyaWFibGUgdG8gc2FtcGxlIGZyb20KICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICB0cyh4LCBfaWQsIF90ZikgewogICAgICBpZiAoX3RmKQogICAgICAgIHJldHVybiB0aGlzLnRzdGYoeCwgX3RmLCBfaWQpOwogICAgICBsZXQgdHMgPSB0aGlzLmVudi50c3NbX2lkXTsKICAgICAgaWYgKCF0cykgewogICAgICAgIHRzID0gdGhpcy5lbnYudHNzW19pZF0gPSBbeF07CiAgICAgICAgdHMuX19pZF9fID0gX2lkOwogICAgICB9IGVsc2UgewogICAgICAgIHRzWzBdID0geDsKICAgICAgfQogICAgICByZXR1cm4gdHM7CiAgICB9CiAgICAvKioKICAgICAqIENyZWF0ZXMgYSBuZXcgdGltZS1zZXJpZXMgJiByZWNvcmRzIGVhY2ggeC4KICAgICAqIFVzZXMgU2FtcGxlciB0byBhZ2dyZWdhdGUgdGhlIHZhbHVlcwogICAgICogUmV0dXJuIHRoZSBhbiBhcnJheS4gSWQgaXMgYXV0by1nZW5yYXRlZAogICAgICogQHBhcmFtIHsqfSB4IC0gQSB2YXJpYWJsZSB0byBzYW1wbGUgZnJvbQogICAgICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IHRmIC0gVGltZWZyYW1lIGluIG1zIG9yIGFzIGEgc3RyaW5nCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgdHN0Zih4LCB0ZiwgX2lkKSB7CiAgICAgIGxldCB0cyA9IHRoaXMuZW52LnRzc1tfaWRdOwogICAgICBpZiAoIXRzKSB7CiAgICAgICAgdHMgPSB0aGlzLmVudi50c3NbX2lkXSA9IFt4XTsKICAgICAgICB0cy5fX2lkX18gPSBfaWQ7CiAgICAgICAgdHMuX190Zl9fID0gdGZfZnJvbV9zdHIodGYpOwogICAgICAgIHRzLl9fZm5fXyA9IFNhbXBsZXIoImNsb3NlIikuYmluZCh0cyk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdHMuX19mbl9fKHgpOwogICAgICB9CiAgICAgIHJldHVybiB0czsKICAgIH0KICAgIC8qKgogICAgICogQ3JlYXRlcyBhIG5ldyBjdXN0b20gc2FtcGxlci4KICAgICAqIFJldHVybiB0aGUgYW4gYXJyYXkuIElkIGlzIGF1dG8tZ2VucmF0ZWQKICAgICAqIEBwYXJhbSB7Kn0geCAtIEEgdmFyaWFibGUgdG8gc2FtcGxlIGZyb20KICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gU2FtcGxlciB0eXBlCiAgICAgKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gdGYgLSBUaW1lZnJhbWUgaW4gbXMgb3IgYXMgYSBzdHJpbmcKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBzYW1wbGUoeCwgdHlwZSwgdGYsIF9pZCkgewogICAgICBsZXQgdHMgPSB0aGlzLmVudi50c3NbX2lkXTsKICAgICAgaWYgKCF0cykgewogICAgICAgIHRzID0gdGhpcy5lbnYudHNzW19pZF0gPSBbeF07CiAgICAgICAgdHMuX19pZF9fID0gX2lkOwogICAgICAgIHRzLl9fdGZfXyA9IHRmX2Zyb21fc3RyKHRmKTsKICAgICAgICB0cy5fX2ZuX18gPSBTYW1wbGVyKHR5cGUpLmJpbmQodHMpOwogICAgICB9IGVsc2UgewogICAgICAgIHRzLl9fZm5fXyh4KTsKICAgICAgfQogICAgICByZXR1cm4gdHM7CiAgICB9CiAgICAvKioKICAgICAqIFJlcGxhY2VzIHRoZSB2YXJpYWJsZSBpZiBpdCdzIE5hTgogICAgICogQHBhcmFtIHsqfSB4IC0gVGhlIHZhcmlhYmxlCiAgICAgKiBAcGFyYW0geyp9IFt2XSAtIEEgdmFsdWUgdG8gcmVwbGFjZSB3aXRoCiAgICAgKiBAcmV0dXJuIHsqfSAtIE5ldyB2YWx1ZQogICAgICovCiAgICBueih4LCB2KSB7CiAgICAgIGlmICh4ID09IHZvaWQgMCB8fCB4ICE9PSB4KSB7CiAgICAgICAgcmV0dXJuIHYgfHwgMDsKICAgICAgfQogICAgICByZXR1cm4geDsKICAgIH0KICAgIC8qKgogICAgICogSXMgdGhlIHZhcmlhYmxlIE5hTiA/CiAgICAgKiBAcGFyYW0geyp9IHggLSBUaGUgdmFyaWFibGUKICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gTmV3IHZhbHVlCiAgICAgKi8KICAgIG5hKHgpIHsKICAgICAgcmV0dXJuIHggPT0gdm9pZCAwIHx8IHggIT09IHg7CiAgICB9CiAgICAvKiogUmVwbGFjZXMgdGhlIHZhciB3aXRoIE5hTiBpZiBJbmZpbml0ZQogICAgICogQHBhcmFtIHsqfSB4IC0gVGhlIHZhcmlhYmxlCiAgICAgKiBAcGFyYW0geyp9IFt2XSAtIEEgdmFsdWUgdG8gcmVwbGFjZSB3aXRoCiAgICAgKiBAcmV0dXJuIHsqfSAtIE5ldyB2YWx1ZQogICAgICovCiAgICBuZih4LCB2KSB7CiAgICAgIGlmICghaXNGaW5pdGUoeCkpIHsKICAgICAgICByZXR1cm4gdiAhPT0gdm9pZCAwID8gdiA6IE5hTjsKICAgICAgfQogICAgICByZXR1cm4geDsKICAgIH0KICAgIC8vIE1hdGggb3BlcmF0b3JzIG9uIHQtc2VyaWVzIGFuZCBudW1iZXJzCiAgICAvKiogQWRkcyB2YWx1ZXMgLyB0aW1lLXNlcmllcwogICAgICogQHBhcmFtIHsoVFN8Kil9IHggLSBGaXJzdCBpbnB1dAogICAgICogQHBhcmFtIHsoVFN8Kil9IHkgLSBTZWNvbmQgaW5wdXQKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBhZGQoeCwgeSwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgYWRkYCk7CiAgICAgIGxldCB4MCA9IHRoaXMubmEoeCkgPyBOYU4gOiB4Ll9faWRfXyA/IHhbMF0gOiB4OwogICAgICBsZXQgeTAgPSB0aGlzLm5hKHkpID8gTmFOIDogeS5fX2lkX18gPyB5WzBdIDogeTsKICAgICAgcmV0dXJuIHRoaXMudHMoeDAgKyB5MCwgaWQsIHguX190Zl9fKTsKICAgIH0KICAgIC8qKiBTdWJ0cmFjdHMgdmFsdWVzIC8gdGltZS1zZXJpZXMKICAgICAqIEBwYXJhbSB7KFRTfCopfSB4IC0gRmlyc3QgaW5wdXQKICAgICAqIEBwYXJhbSB7KFRTfCopfSB5IC0gU2Vjb25kIGlucHV0CiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgc3ViKHgsIHksIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHN1YmApOwogICAgICBsZXQgeDAgPSB0aGlzLm5hKHgpID8gTmFOIDogeC5fX2lkX18gPyB4WzBdIDogeDsKICAgICAgbGV0IHkwID0gdGhpcy5uYSh5KSA/IE5hTiA6IHkuX19pZF9fID8geVswXSA6IHk7CiAgICAgIHJldHVybiB0aGlzLnRzKHgwIC0geTAsIGlkLCB4Ll9fdGZfXyk7CiAgICB9CiAgICAvKiogTXVsdGlwbGllcyB2YWx1ZXMgLyB0aW1lLXNlcmllcwogICAgICogQHBhcmFtIHsoVFN8Kil9IHggLSBGaXJzdCBpbnB1dAogICAgICogQHBhcmFtIHsoVFN8Kil9IHkgLSBTZWNvbmQgaW5wdXQKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBtdWx0KHgsIHksIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYG11bHRgKTsKICAgICAgbGV0IHgwID0gdGhpcy5uYSh4KSA/IE5hTiA6IHguX19pZF9fID8geFswXSA6IHg7CiAgICAgIGxldCB5MCA9IHRoaXMubmEoeSkgPyBOYU4gOiB5Ll9faWRfXyA/IHlbMF0gOiB5OwogICAgICByZXR1cm4gdGhpcy50cyh4MCAqIHkwLCBpZCwgeC5fX3RmX18pOwogICAgfQogICAgLyoqIERpdmlkZXMgdmFsdWVzIC8gdGltZS1zZXJpZXMKICAgICAqIEBwYXJhbSB7KFRTfCopfSB4IC0gRmlyc3QgaW5wdXQKICAgICAqIEBwYXJhbSB7KFRTfCopfSB5IC0gU2Vjb25kIGlucHV0CiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgZGl2KHgsIHksIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGRpdmApOwogICAgICBsZXQgeDAgPSB0aGlzLm5hKHgpID8gTmFOIDogeC5fX2lkX18gPyB4WzBdIDogeDsKICAgICAgbGV0IHkwID0gdGhpcy5uYSh5KSA/IE5hTiA6IHkuX19pZF9fID8geVswXSA6IHk7CiAgICAgIHJldHVybiB0aGlzLnRzKHgwIC8geTAsIGlkLCB4Ll9fdGZfXyk7CiAgICB9CiAgICAvKiogUmV0dXJucyBhIG5lZ2F0aXZlIHZhbHVlIC8gdGltZS1zZXJpZXMKICAgICAqIEBwYXJhbSB7KFRTfCopfSB4IC0gSW5wdXQKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBuZWcoeCwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgbmVnYCk7CiAgICAgIGxldCB4MCA9IHRoaXMubmEoeCkgPyBOYU4gOiB4Ll9faWRfXyA/IHhbMF0gOiB4OwogICAgICByZXR1cm4gdGhpcy50cygteDAsIGlkLCB4Ll9fdGZfXyk7CiAgICB9CiAgICAvKiogQWJzb2x1dGUgdmFsdWUKICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gSW5wdXQKICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBBYnNvbHV0ZSB2YWx1ZQogICAgICovCiAgICBhYnMoeCkgewogICAgICByZXR1cm4gTWF0aC5hYnMoeCk7CiAgICB9CiAgICAvKiogQXJjY29zaW5lIGZ1bmN0aW9uCiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIElucHV0CiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gQXJjY29zaW5lIG9mIHgKICAgICAqLwogICAgYWNvcyh4KSB7CiAgICAgIHJldHVybiBNYXRoLmFjb3MoeCk7CiAgICB9CiAgICAvKiogRW1pdHMgYW4gZXZlbnQgdG8gRGF0YUN1YmUKICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gU2lnbmFsIHR5cGUKICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAtIFNpZ25hbCBkYXRhCiAgICAgKi8KICAgIHNpZ25hbCh0eXBlLCBkYXRhID0ge30pIHsKICAgICAgaWYgKHRoaXMuc2Uuc2hhcmVkLmV2ZW50ICE9PSAidXBkYXRlIikKICAgICAgICByZXR1cm47CiAgICAgIHRoaXMuc2Uuc2VuZCgic2NyaXB0LXNpZ25hbCIsIHsgdHlwZSwgZGF0YSB9KTsKICAgIH0KICAgIC8qKiBFbWl0cyBhbiBldmVudCBpZiBjb25kID09PSB0cnVlCiAgICAgKiBAcGFyYW0geyhib29sZWFufFRTKX0gY29uZCAtIFRoZSBjb25kaXRpb24KICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gU2lnbmFsIHR5cGUKICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAtIFNpZ25hbCBkYXRhCiAgICAgKi8KICAgIHNpZ25hbGlmKGNvbmQsIHR5cGUsIGRhdGEgPSB7fSkgewogICAgICBpZiAodGhpcy5zZS5zaGFyZWQuZXZlbnQgIT09ICJ1cGRhdGUiKQogICAgICAgIHJldHVybjsKICAgICAgaWYgKGNvbmQgJiYgY29uZC5fX2lkX18pCiAgICAgICAgY29uZCA9IGNvbmRbMF07CiAgICAgIGlmIChjb25kKSB7CiAgICAgICAgdGhpcy5zZS5zZW5kKCJzY3JpcHQtc2lnbmFsIiwgeyB0eXBlLCBkYXRhIH0pOwogICAgICB9CiAgICB9CiAgICAvKiogQXJuYXVkIExlZ291eCBNb3ZpbmcgQXZlcmFnZQogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgLSBPZmZzZXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaWdtYSAtIFNpZ21hCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgYWxtYShzcmMsIGxlbiwgb2Zmc2V0LCBzaWdtYSwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgYWxtYSgke2xlbn0sJHtvZmZzZXR9LCR7c2lnbWF9KWApOwogICAgICBsZXQgbSA9IE1hdGguZmxvb3Iob2Zmc2V0ICogKGxlbiAtIDEpKTsKICAgICAgbGV0IHMgPSBsZW4gLyBzaWdtYTsKICAgICAgbGV0IG5vcm0gPSAwOwogICAgICBsZXQgc3VtID0gMDsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgewogICAgICAgIGxldCB3ID0gTWF0aC5leHAoLTEgKiBNYXRoLnBvdyhpIC0gbSwgMikgLyAoMiAqIE1hdGgucG93KHMsIDIpKSk7CiAgICAgICAgbm9ybSA9IG5vcm0gKyB3OwogICAgICAgIHN1bSA9IHN1bSArIHNyY1tsZW4gLSBpIC0gMV0gKiB3OwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHN1bSAvIG5vcm0sIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBBcmNzaW5lIGZ1bmN0aW9uCiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIElucHV0CiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gQXJjc2luZSBvZiB4CiAgICAgKi8KICAgIGFzaW4oeCkgewogICAgICByZXR1cm4gTWF0aC5hc2luKHgpOwogICAgfQogICAgLyoqIEFyY3RhbmdlbnQgZnVuY3Rpb24KICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gSW5wdXQKICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBBcmN0YW5nZW50IG9mIHgKICAgICAqLwogICAgYXRhbih4KSB7CiAgICAgIHJldHVybiBNYXRoLmF0YW4oeCk7CiAgICB9CiAgICAvKiogQXZlcmFnZSBUcnVlIFJhbmdlCiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgYXRyKGxlbiwgX2lkLCBfdGYpIHsKICAgICAgbGV0IHRmcyA9IF90ZiB8fCAiIjsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBhdHIoJHtsZW59KWApOwogICAgICBsZXQgaGlnaCA9IHRoaXMuZW52LnNoYXJlZFtgaGlnaCR7dGZzfWBdOwogICAgICBsZXQgbG93ID0gdGhpcy5lbnYuc2hhcmVkW2Bsb3cke3Rmc31gXTsKICAgICAgbGV0IGNsb3NlID0gdGhpcy5lbnYuc2hhcmVkW2BjbG9zZSR7dGZzfWBdOwogICAgICBsZXQgdHIgPSB0aGlzLnRzKDAsIGlkLCBfdGYpOwogICAgICB0clswXSA9IHRoaXMubmEoaGlnaFsxXSkgPyBoaWdoWzBdIC0gbG93WzBdIDogTWF0aC5tYXgoCiAgICAgICAgTWF0aC5tYXgoCiAgICAgICAgICBoaWdoWzBdIC0gbG93WzBdLAogICAgICAgICAgTWF0aC5hYnMoaGlnaFswXSAtIGNsb3NlWzFdKQogICAgICAgICksCiAgICAgICAgTWF0aC5hYnMobG93WzBdIC0gY2xvc2VbMV0pCiAgICAgICk7CiAgICAgIHJldHVybiB0aGlzLnJtYSh0ciwgbGVuLCBpZCk7CiAgICB9CiAgICAvKiogQXZlcmFnZSBvZiBhcmd1bWVudHMKICAgICAqIEBwYXJhbSB7Li4ubnVtYmVyfSBhcmdzIC0gTnVtZXJpYyB2YWx1ZXMKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwogICAgYXZnKC4uLmFyZ3MpIHsKICAgICAgYXJncy5wb3AoKTsKICAgICAgbGV0IHN1bSA9IDA7CiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykgewogICAgICAgIHN1bSArPSBhcmdzW2ldOwogICAgICB9CiAgICAgIHJldHVybiBzdW0gLyBhcmdzLmxlbmd0aDsKICAgIH0KICAgIC8qKiBDYW5kbGVzIHNpbmNlIHRoZSBldmVudCBvY2N1cmVkIChjb25kID09PSB0cnVlKQogICAgICogQHBhcmFtIHsoYm9vbGVhbnxUUyl9IGNvbmQgLSB0aGUgY29uZGl0aW9uCiAgICAgKi8KICAgIHNpbmNlKGNvbmQsIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHNpbmNlKClgKTsKICAgICAgaWYgKGNvbmQgJiYgY29uZC5fX2lkX18pCiAgICAgICAgY29uZCA9IGNvbmRbMF07CiAgICAgIGxldCBzID0gdGhpcy50cyh2b2lkIDAsIGlkKTsKICAgICAgc1swXSA9IGNvbmQgPyAwIDogc1sxXSArIDE7CiAgICAgIHJldHVybiBzOwogICAgfQogICAgLyoqIEJvbGxpbmdlciBCYW5kcwogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtdWx0IC0gTXVsdGlwbGllcgogICAgICogQHJldHVybiB7VFNbXX0gLSBBcnJheSBvZiBuZXcgdGltZS1zZXJpZXMgKDMgYmFuZHMpCiAgICAgKi8KICAgIGJiKHNyYywgbGVuLCBtdWx0LCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBiYigke2xlbn0sJHttdWx0fSlgKTsKICAgICAgbGV0IGJhc2lzID0gdGhpcy5zbWEoc3JjLCBsZW4sIGlkKTsKICAgICAgbGV0IGRldiA9IHRoaXMuc3RkZXYoc3JjLCBsZW4sIGlkKVswXSAqIG11bHQ7CiAgICAgIHJldHVybiBbCiAgICAgICAgYmFzaXMsCiAgICAgICAgdGhpcy50cyhiYXNpc1swXSArIGRldiwgaWQgKyAiMSIsIHNyYy5fX3RmX18pLAogICAgICAgIHRoaXMudHMoYmFzaXNbMF0gLSBkZXYsIGlkICsgIjIiLCBzcmMuX190Zl9fKQogICAgICBdOwogICAgfQogICAgLyoqIEJvbGxpbmdlciBCYW5kcyBXaWR0aAogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtdWx0IC0gTXVsdGlwbGllcgogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIGJidyhzcmMsIGxlbiwgbXVsdCwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgYmJ3KCR7bGVufSwke211bHR9KWApOwogICAgICBsZXQgYmFzaXMgPSB0aGlzLnNtYShzcmMsIGxlbiwgaWQpWzBdOwogICAgICBsZXQgZGV2ID0gdGhpcy5zdGRldihzcmMsIGxlbiwgaWQpWzBdICogbXVsdDsKICAgICAgcmV0dXJuIHRoaXMudHMoMiAqIGRldiAvIGJhc2lzLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogQ29udmVydHMgdGhlIHZhcmlhYmxlIHRvIEJvb2xlYW4KICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICovCiAgICBib29sKHgpIHsKICAgICAgcmV0dXJuICEheDsKICAgIH0KICAgIC8qKiBDb21tb2RpdHkgQ2hhbm5lbCBJbmRleAogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBjY2koc3JjLCBsZW4sIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGNjaSgke2xlbn0pYCk7CiAgICAgIGxldCBtYSA9IHRoaXMuc21hKHNyYywgbGVuLCBpZCk7CiAgICAgIGxldCBkZXYgPSB0aGlzLmRldihzcmMsIGxlbiwgaWQpOwogICAgICBsZXQgY2NpID0gKHNyY1swXSAtIG1hWzBdKSAvICgwLjAxNSAqIGRldlswXSk7CiAgICAgIHJldHVybiB0aGlzLnRzKGNjaSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLmNlaWwoKQogICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHZhcmlhYmxlCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKi8KICAgIGNlaWwoeCkgewogICAgICByZXR1cm4gTWF0aC5jZWlsKHgpOwogICAgfQogICAgLyoqIENoYW5nZTogeFswXSAtIHhbbGVuXQogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuXSAtIExlbmd0aAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIGNoYW5nZShzcmMsIGxlbiA9IDEsIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGNoYW5nZSgke2xlbn0pYCk7CiAgICAgIHJldHVybiB0aGlzLnRzKHNyY1swXSAtIHNyY1tsZW5dLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogQ2hhbmRlIE1vbWVudHVtIE9zY2lsbGF0b3IKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgY21vKHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBjbW8oJHtsZW59KWApOwogICAgICBsZXQgbW9tID0gdGhpcy5jaGFuZ2Uoc3JjLCAxLCBpZCk7CiAgICAgIGxldCBnID0gdGhpcy50cyhtb21bMF0gPj0gMCA/IG1vbVswXSA6IDAsIGlkICsgImciLCBzcmMuX190Zl9fKTsKICAgICAgbGV0IGwgPSB0aGlzLnRzKG1vbVswXSA+PSAwID8gMCA6IC1tb21bMF0sIGlkICsgImwiLCBzcmMuX190Zl9fKTsKICAgICAgbGV0IHNtMSA9IHRoaXMuc3VtKGcsIGxlbiwgaWQgKyAiMSIpWzBdOwogICAgICBsZXQgc20yID0gdGhpcy5zdW0obCwgbGVuLCBpZCArICIyIilbMF07CiAgICAgIHJldHVybiB0aGlzLnRzKDEwMCAqIChzbTEgLSBzbTIpIC8gKHNtMSArIHNtMiksIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBDZW50ZXIgb2YgR3Jhdml0eQogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBjb2coc3JjLCBsZW4sIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGNtbygke2xlbn0pYCk7CiAgICAgIGxldCBzdW0gPSB0aGlzLnN1bShzcmMsIGxlbiwgaWQpWzBdOwogICAgICBsZXQgbnVtID0gMDsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgewogICAgICAgIG51bSArPSBzcmNbaV0gKiAoaSArIDEpOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKC1udW0gLyBzdW0sIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8vIENvcnJlbGF0aW9uCiAgICBjb3JyKCkgewogICAgfQogICAgLyoqIENvc2luZSBmdW5jdGlvbgogICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBJbnB1dAogICAgICogQHJldHVybiB7bnVtYmVyfSAtIENvc2luZSBvZiB4CiAgICAgKi8KICAgIGNvcyh4KSB7CiAgICAgIHJldHVybiBNYXRoLmNvcyh4KTsKICAgIH0KICAgIC8qKiBXaGVuIG9uZSB0aW1lLXNlcmllcyBjcm9zc2VzIGFub3RoZXIKICAgICAqIEBwYXJhbSB7VFN9IHNyYzEgLSBUUzEKICAgICAqIEBwYXJhbSB7VFN9IHNyYzIgLSBUUzIKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBjcm9zcyhzcmMxLCBzcmMyLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBjcm9zc2ApOwogICAgICBsZXQgeCA9IHNyYzFbMF0gPiBzcmMyWzBdICE9PSBzcmMxWzFdID4gc3JjMlsxXTsKICAgICAgcmV0dXJuIHRoaXMudHMoeCwgaWQsIHNyYzEuX190Zl9fKTsKICAgIH0KICAgIC8qKiBXaGVuIG9uZSB0aW1lLXNlcmllcyBnb2VzIG92ZXIgYW5vdGhlciBvbmUKICAgICAqIEBwYXJhbSB7VFN9IHNyYzEgLSBUUzEKICAgICAqIEBwYXJhbSB7VFN9IHNyYzIgLSBUUzIKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBjcm9zc292ZXIoc3JjMSwgc3JjMiwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgY3Jvc3NvdmVyYCk7CiAgICAgIGxldCB4ID0gc3JjMVswXSA+IHNyYzJbMF0gJiYgc3JjMVsxXSA8PSBzcmMyWzFdOwogICAgICByZXR1cm4gdGhpcy50cyh4LCBpZCwgc3JjMS5fX3RmX18pOwogICAgfQogICAgLyoqIFdoZW4gb25lIHRpbWUtc2VyaWVzIGdvZXMgdW5kZXIgYW5vdGhlciBvbmUKICAgICAqIEBwYXJhbSB7VFN9IHNyYzEgLSBUUzEKICAgICAqIEBwYXJhbSB7VFN9IHNyYzIgLSBUUzIKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBjcm9zc3VuZGVyKHNyYzEsIHNyYzIsIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGNyb3NzdW5kZXJgKTsKICAgICAgbGV0IHggPSBzcmMxWzBdIDwgc3JjMlswXSAmJiBzcmMxWzFdID49IHNyYzJbMV07CiAgICAgIHJldHVybiB0aGlzLnRzKHgsIGlkLCBzcmMxLl9fdGZfXyk7CiAgICB9CiAgICAvKiogU3VtIG9mIGFsbCBlbGVtZW50cyBvZiBzcmMKICAgICAqIEBwYXJhbSB7VFN9IHNyYzEgLSBJbnB1dAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIGN1bShzcmMsIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGN1bWApOwogICAgICBsZXQgcmVzID0gdGhpcy50cygwLCBpZCwgc3JjLl9fdGZfXyk7CiAgICAgIHJlc1swXSA9IHRoaXMubnooc3JjWzBdKSArIHRoaXMubnoocmVzWzFdKTsKICAgICAgcmV0dXJuIHJlczsKICAgIH0KICAgIC8qKiBEYXkgb2YgbW9udGgsIGxpdGVyYWxseQogICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lXSAtIFRpbWUgaW4gbXMgKGN1cnJlbnQgdCwgaWYgbm90IGRlZmluZWQpCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gRGF5CiAgICAgKi8KICAgIGRheW9mbW9udGgodGltZSkgewogICAgICByZXR1cm4gbmV3IERhdGUodGltZSB8fCBzZS50KS5nZXRVVENEYXRlKCk7CiAgICB9CiAgICAvKiogRGF5IG9mIHdlZWssIGxpdGVyYWxseQogICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lXSAtIFRpbWUgaW4gbXMgKGN1cnJlbnQgdCwgaWYgbm90IGRlZmluZWQpCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gRGF5CiAgICAgKi8KICAgIGRheW9md2Vlayh0aW1lKSB7CiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lIHx8IHNlLnQpLmdldFVUQ0RheSgpICsgMTsKICAgIH0KICAgIC8qKiBEZXZpYXRpb24gZnJvbSBTTUEKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgZGV2KHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBkZXYoJHtsZW59KWApOwogICAgICBsZXQgbWVhbiA9IHRoaXMuc21hKHNyYywgbGVuLCBpZClbMF07CiAgICAgIGxldCBzdW0gPSAwOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgc3VtICs9IE1hdGguYWJzKHNyY1tpXSAtIG1lYW4pOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHN1bSAvIGxlbiwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIERpcmVjdGlvbmFsIE1vdmVtZW50IEluZGV4IEFEWCwgK0RJLCAtREkKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbW9vdGggLSBTbW9vdGhuZXNzCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgZG1pKGxlbiwgc21vb3RoLCBfaWQsIF90ZikgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGRtaSgke2xlbn0sJHtzbW9vdGh9KWApOwogICAgICBsZXQgdGZzID0gX3RmIHx8ICIiOwogICAgICBsZXQgaGlnaCA9IHRoaXMuZW52LnNoYXJlZFtgaGlnaCR7dGZzfWBdOwogICAgICBsZXQgbG93ID0gdGhpcy5lbnYuc2hhcmVkW2Bsb3cke3Rmc31gXTsKICAgICAgbGV0IHVwID0gdGhpcy5jaGFuZ2UoaGlnaCwgMSwgaWQgKyAiMSIpWzBdOwogICAgICBsZXQgZG93biA9IHRoaXMubmVnKHRoaXMuY2hhbmdlKGxvdywgMSwgaWQgKyAiMiIpLCBpZClbMF07CiAgICAgIGxldCBwbHVzRE0gPSB0aGlzLnRzKAogICAgICAgIDEwMCAqICh0aGlzLm5hKHVwKSA/IE5hTiA6IHVwID4gZG93biAmJiB1cCA+IDAgPyB1cCA6IDApLAogICAgICAgIGlkICsgIjMiLAogICAgICAgIF90ZgogICAgICApOwogICAgICBsZXQgbWludXNETSA9IHRoaXMudHMoCiAgICAgICAgMTAwICogKHRoaXMubmEoZG93bikgPyBOYU4gOiBkb3duID4gdXAgJiYgZG93biA+IDAgPyBkb3duIDogMCksCiAgICAgICAgaWQgKyAiNCIsCiAgICAgICAgX3RmCiAgICAgICk7CiAgICAgIGxldCB0cnVyID0gdGhpcy5ybWEodGhpcy50cihmYWxzZSwgaWQsIF90ZiksIGxlbiwgaWQgKyAiNSIpOwogICAgICBsZXQgcGx1cyA9IHRoaXMuZGl2KAogICAgICAgIHRoaXMucm1hKHBsdXNETSwgbGVuLCBpZCArICI2IiksCiAgICAgICAgdHJ1ciwKICAgICAgICBpZCArICI4IgogICAgICApOwogICAgICBsZXQgbWludXMgPSB0aGlzLmRpdigKICAgICAgICB0aGlzLnJtYShtaW51c0RNLCBsZW4sIGlkICsgIjciKSwKICAgICAgICB0cnVyLAogICAgICAgIGlkICsgIjkiCiAgICAgICk7CiAgICAgIGxldCBzdW0gPSB0aGlzLmFkZChwbHVzLCBtaW51cywgaWQgKyAiMTAiKVswXTsKICAgICAgbGV0IGFkeCA9IHRoaXMucm1hKAogICAgICAgIHRoaXMudHMoMTAwICogTWF0aC5hYnMocGx1c1swXSAtIG1pbnVzWzBdKSAvIChzdW0gPT09IDAgPyAxIDogc3VtKSwgaWQgKyAiMTEiLCBfdGYpLAogICAgICAgIHNtb290aCwKICAgICAgICBpZCArICIxMiIKICAgICAgKTsKICAgICAgcmV0dXJuIFthZHgsIHBsdXMsIG1pbnVzXTsKICAgIH0KICAgIC8qKiBFeHBvbmVudGlhbCBNb3ZpbmcgQXZlcmFnZSB3aXRoIGFscGhhID0gMiAvICh5ICsgMSkKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgZW1hKHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBlbWEoJHtsZW59KWApOwogICAgICBsZXQgYSA9IDIgLyAobGVuICsgMSk7CiAgICAgIGxldCBlbWEgPSB0aGlzLnRzKDAsIGlkLCBzcmMuX190Zl9fKTsKICAgICAgZW1hWzBdID0gdGhpcy5uYShlbWFbMV0pID8gdGhpcy5zbWEoc3JjLCBsZW4sIGlkKVswXSA6IGEgKiBzcmNbMF0gKyAoMSAtIGEpICogdGhpcy5ueihlbWFbMV0pOwogICAgICByZXR1cm4gZW1hOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLmV4cCgpCiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgdmFyaWFibGUKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwogICAgZXhwKHgpIHsKICAgICAgcmV0dXJuIE1hdGguZXhwKHgpOwogICAgfQogICAgLyoqIFRlc3QgaWYgInNyYyIgVFMgaXMgZmFsbGluZyBmb3IgImxlbiIgY2FuZGxlcwogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBmYWxsaW5nKHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBmYWxsaW5nKCR7bGVufSlgKTsKICAgICAgbGV0IGJvdCA9IHNyY1swXTsKICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW4gKyAxOyBpKyspIHsKICAgICAgICBpZiAoYm90ID49IHNyY1tpXSkgewogICAgICAgICAgcmV0dXJuIHRoaXMudHMoZmFsc2UsIGlkLCBzcmMuX190Zl9fKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHModHJ1ZSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIEZvciBhIGdpdmVuIHNlcmllcyByZXBsYWNlcyBOYU4gdmFsdWVzIHdpdGgKICAgICAqIHByZXZpb3VzIG5lYXJlc3Qgbm9uLU5hTiB2YWx1ZQogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQgdGltZS1zZXJpZXMKICAgICAqIEByZXR1cm4ge1RTfQogICAgICovCiAgICBmaXhuYW4oc3JjKSB7CiAgICAgIGlmICh0aGlzLm5hKHNyY1swXSkpIHsKICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHNyYy5sZW5ndGg7IGkrKykgewogICAgICAgICAgaWYgKCF0aGlzLm5hKHNyY1tpXSkpIHsKICAgICAgICAgICAgc3JjWzBdID0gc3JjW2ldOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHNyYzsKICAgIH0KICAgIC8qIFRPRE86IHRoaW5rCiAgICBza2lwbmFuKHgsIF9pZCkgewogICAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgc2tpcG5hbigpYCkKICAgICAgICByZXR1cm4gdGhpcy50cyh0cnVlLCBpZCwgc3JjLl9fdGZfXykKICAgIH0qLwogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLmZsb29yKCkKICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICovCiAgICBmbG9vcih4KSB7CiAgICB9CiAgICAvKiogSGlnaGVzdCB2YWx1ZSBmb3IgYSBnaXZlbiBudW1iZXIgb2YgY2FuZGxlcyBiYWNrCiAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIGhpZ2hlc3Qoc3JjLCBsZW4sIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGhpZ2hlc3QoJHtsZW59KWApOwogICAgICBsZXQgaGlnaCA9IC1JbmZpbml0eTsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgewogICAgICAgIGlmIChzcmNbaV0gPiBoaWdoKQogICAgICAgICAgaGlnaCA9IHNyY1tpXTsKICAgICAgfQogICAgICByZXR1cm4gdGhpcy50cyhoaWdoLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogSGlnaGVzdCB2YWx1ZSBvZmZzZXQgZm9yIGEgZ2l2ZW4gbnVtYmVyIG9mIGJhcnMgYmFjawogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqLwogICAgaGlnaGVzdGJhcnMoc3JjLCBsZW4sIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGhpZ2hlc3RiYXJzKCR7bGVufSlgKTsKICAgICAgbGV0IGhpZ2ggPSAtSW5maW5pdHk7CiAgICAgIGxldCBoaSA9IDA7CiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsKICAgICAgICBpZiAoc3JjW2ldID4gaGlnaCkgewogICAgICAgICAgaGlnaCA9IHNyY1tpXSwgaGkgPSBpOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gdGhpcy50cygtaGksIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBIdWxsIE1vdmluZyBBdmVyYWdlCiAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIGhtYShzcmMsIGxlbiwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgaG1hKCR7bGVufSlgKTsKICAgICAgbGV0IGxlbjIgPSBNYXRoLmZsb29yKGxlbiAvIDIpOwogICAgICBsZXQgbGVuMyA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KGxlbikpOwogICAgICBsZXQgYSA9IHRoaXMubXVsdCh0aGlzLndtYShzcmMsIGxlbjIsIGlkICsgIjEiKSwgMiwgaWQpOwogICAgICBsZXQgYiA9IHRoaXMud21hKHNyYywgbGVuLCBpZCArICIyIik7CiAgICAgIGxldCBkZWx0ID0gdGhpcy5zdWIoYSwgYiwgaWQgKyAiMyIpOwogICAgICByZXR1cm4gdGhpcy53bWEoZGVsdCwgbGVuMywgaWQgKyAiNCIpOwogICAgfQogICAgLyoqIFJldHVybnMgaG91cnMgb2YgYSBnaXZlbiB0aW1lc3RhbXAKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZV0gLSBUaW1lIGluIG1zIChjdXJyZW50IHQsIGlmIG5vdCBkZWZpbmVkKQogICAgICogQHJldHVybiB7bnVtYmVyfSAtIEhvdXIKICAgICAqLwogICAgaG91cih0aW1lKSB7CiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lIHx8IHNlLnQpLmdldFVUQ0hvdXJzKCk7CiAgICB9CiAgICAvKiogUmV0dXJucyB4IG9yIHkgZGVwZW5kaW5nIG9uIHRoZSBjb25kaXRpb24KICAgICAqIEBwYXJhbSB7KGJvb2xlYW58VFMpfSBjb25kIC0gQ29uZGl0aW9uCiAgICAgKiBAcGFyYW0geyp9IHggLSBGcmlzdCB2YWx1ZQogICAgICogQHBhcmFtIHsqfSB5IC0gU2Vjb25kIHZhbHVlCiAgICAgKiBAcmV0dXJuIHsqfQogICAgICovCiAgICBpZmYoY29uZCwgeCwgeSkgewogICAgICBpZiAoY29uZCAmJiBjb25kLl9faWRfXykKICAgICAgICBjb25kID0gY29uZFswXTsKICAgICAgcmV0dXJuIGNvbmQgPyB4IDogeTsKICAgIH0KICAgIC8qKiBLZWx0bmVyIENoYW5uZWxzCiAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICogQHBhcmFtIHtudW1iZXJ9IG11bHQgLSBNdWx0aXBsaWVyCiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VfdHJdIC0gVXNlIHRydWUgcmFuZ2UKICAgICAqIEByZXR1cm4ge1RTW119IC0gQXJyYXkgb2YgbmV3IHRpbWUtc2VyaWVzICgzIGJhbmRzKQogICAgICovCiAgICBrYyhzcmMsIGxlbiwgbXVsdCwgdXNlX3RyID0gdHJ1ZSwgX2lkLCBfdGYpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBrYygke2xlbn0sJHttdWx0fSwke3VzZV90cn0pYCk7CiAgICAgIGxldCB0ZnMgPSBfdGYgfHwgIiI7CiAgICAgIGxldCBoaWdoID0gdGhpcy5lbnYuc2hhcmVkW2BoaWdoJHt0ZnN9YF07CiAgICAgIGxldCBsb3cgPSB0aGlzLmVudi5zaGFyZWRbYGxvdyR7dGZzfWBdOwogICAgICBsZXQgYmFzaXMgPSB0aGlzLmVtYShzcmMsIGxlbiwgaWQgKyAiMSIpOwogICAgICBsZXQgcmFuZ2UgPSB1c2VfdHIgPyB0aGlzLnRyKGZhbHNlLCBpZCArICIyIiwgX3RmKSA6IHRoaXMudHMoaGlnaFswXSAtIGxvd1swXSwgaWQgKyAiMyIsIHNyYy5fX3RmX18pOwogICAgICBsZXQgZW1hID0gdGhpcy5lbWEocmFuZ2UsIGxlbiwgaWQgKyAiNCIpOwogICAgICByZXR1cm4gWwogICAgICAgIGJhc2lzLAogICAgICAgIHRoaXMudHMoYmFzaXNbMF0gKyBlbWFbMF0gKiBtdWx0LCBpZCArICI1Iiwgc3JjLl9fdGZfXyksCiAgICAgICAgdGhpcy50cyhiYXNpc1swXSAtIGVtYVswXSAqIG11bHQsIGlkICsgIjYiLCBzcmMuX190Zl9fKQogICAgICBdOwogICAgfQogICAgLyoqIEtlbHRuZXIgQ2hhbm5lbHMgV2lkdGgKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcGFyYW0ge251bWJlcn0gbXVsdCAtIE11bHRpcGxpZXIKICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZV90cl0gLSBVc2UgdHJ1ZSByYW5nZQogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIGtjdyhzcmMsIGxlbiwgbXVsdCwgdXNlX3RyID0gdHJ1ZSwgX2lkLCBfdGYpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBrY3coJHtsZW59LCR7bXVsdH0sJHt1c2VfdHJ9KWApOwogICAgICBsZXQga2MgPSB0aGlzLmtjKHNyYywgbGVuLCBtdWx0LCB1c2VfdHIsIGBrY3dgLCBfdGYpOwogICAgICByZXR1cm4gdGhpcy50cygoa2NbMV1bMF0gLSBrY1syXVswXSkgLyBrY1swXVswXSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIExpbmVhciBSZWdyZXNzaW9uCiAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCAtIE9mZnNldAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIGxpbnJlZyhzcmMsIGxlbiwgb2Zmc2V0ID0gMCwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgbGlucmVnKCR7bGVufSlgKTsKICAgICAgc3JjLl9fbGVuX18gPSBNYXRoLm1heChzcmMuX19sZW5fXyB8fCAwLCBsZW4pOwogICAgICBsZXQgbHIgPSByZWdyZXNzaW9uKHNyYywgbGVuLCBvZmZzZXQpOwogICAgICByZXR1cm4gdGhpcy50cyhsciwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLmxvZygpCiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgdmFyaWFibGUKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwogICAgbG9nKHgpIHsKICAgICAgcmV0dXJuIE1hdGgubG9nKHgpOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLmxvZzEwKCkKICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICovCiAgICBsb2cxMCh4KSB7CiAgICAgIHJldHVybiBNYXRoLmxvZzEwKHgpOwogICAgfQogICAgLyoqIExvd2VzdCB2YWx1ZSBmb3IgYSBnaXZlbiBudW1iZXIgb2YgY2FuZGxlcyBiYWNrCiAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIGxvd2VzdChzcmMsIGxlbiwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgbG93ZXN0KCR7bGVufSlgKTsKICAgICAgbGV0IGxvdyA9IEluZmluaXR5OwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgaWYgKHNyY1tpXSA8IGxvdykKICAgICAgICAgIGxvdyA9IHNyY1tpXTsKICAgICAgfQogICAgICByZXR1cm4gdGhpcy50cyhsb3csIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBMb3dlc3QgdmFsdWUgb2Zmc2V0IGZvciBhIGdpdmVuIG51bWJlciBvZiBiYXJzIGJhY2sKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKi8KICAgIGxvd2VzdGJhcnMoc3JjLCBsZW4sIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGxvd2VzdGJhcnMoJHtsZW59KWApOwogICAgICBsZXQgbG93ID0gSW5maW5pdHk7CiAgICAgIGxldCBsaSA9IDA7CiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsKICAgICAgICBpZiAoc3JjW2ldIDwgbG93KSB7CiAgICAgICAgICBsb3cgPSBzcmNbaV0sIGxpID0gaTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHMoLWxpLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogTW92aW5nIEF2ZXJhZ2UgQ29udmVyZ2VuY2UvRGl2ZXJnZW5jZQogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmYXN0IC0gRmFzdCBFTUEKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbG93IC0gU2xvdyBFTUEKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaWcgLSBTaWduYWwKICAgICAqIEByZXR1cm4ge1RTW119IC0gW21hY2QsIHNpZ25hbCwgaGlzdF0KICAgICAqLwogICAgbWFjZChzcmMsIGZhc3QsIHNsb3csIHNpZywgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgbWFjZCgke2Zhc3R9JHtzbG93fSR7c2lnfSlgKTsKICAgICAgbGV0IGZhc3RfbWEgPSB0aGlzLmVtYShzcmMsIGZhc3QsIGlkICsgIjEiKTsKICAgICAgbGV0IHNsb3dfbWEgPSB0aGlzLmVtYShzcmMsIHNsb3csIGlkICsgIjIiKTsKICAgICAgbGV0IG1hY2QgPSB0aGlzLnN1YihmYXN0X21hLCBzbG93X21hLCBpZCArICIzIik7CiAgICAgIGxldCBzaWduYWwgPSB0aGlzLmVtYShtYWNkLCBzaWcsIGlkICsgIjQiKTsKICAgICAgbGV0IGhpc3QgPSB0aGlzLnN1YihtYWNkLCBzaWduYWwsIGlkICsgIjUiKTsKICAgICAgcmV0dXJuIFttYWNkLCBzaWduYWwsIGhpc3RdOwogICAgfQogICAgLyoqIE1heCBvZiBhcmd1bWVudHMKICAgICAqIEBwYXJhbSB7Li4ubnVtYmVyfSBhcmdzIC0gTnVtZXJpYyB2YWx1ZXMKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwogICAgbWF4KC4uLmFyZ3MpIHsKICAgICAgYXJncy5wb3AoKTsKICAgICAgcmV0dXJuIE1hdGgubWF4KC4uLmFyZ3MpOwogICAgfQogICAgLyoqIFNlbmRzIHVwZGF0ZSB0byBzb21lIG92ZXJsYXkgLyBtYWluIGNoYXJ0CiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBPdmVybGF5IGlkCiAgICAgKiBAcGFyYW0ge09iamVjdH0gZmllbGRzIC0gRmllbGRzIHRvIGJlIG92ZXJ3cml0dGVuCiAgICAgKi8KICAgIG1vZGlmeShpZCwgZmllbGRzKSB7CiAgICAgIHNlLnNlbmQoIm1vZGlmeS1vdmVybGF5IiwgeyB1dWlkOiBpZCwgZmllbGRzIH0pOwogICAgfQogICAgLyoqIFNldHMgdGhlIHJldmVyc2UgYnVmZmVyIHNpemUgZm9yIGEgZ2l2ZW4KICAgICAqIHRpbWUtc2VyaWVzIChkZWZhdWx0ID0gNSwgZ3Jvd3Mgb24gZGVtYW5kKQogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBOZXcgbGVuZ3RoCiAgICAgKi8KICAgIGJ1ZmZzaXplKHNyYywgbGVuKSB7CiAgICAgIHNyYy5fX2xlbl9fID0gbGVuOwogICAgfQogICAgLyoqIE1vbmV5IEZsb3cgSW5kZXgKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgbWZpKHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBtZmkoJHtsZW59KWApOwogICAgICBsZXQgdm9sID0gdGhpcy5lbnYuc2hhcmVkLnZvbDsKICAgICAgbGV0IGNoID0gdGhpcy5jaGFuZ2Uoc3JjLCAxLCBpZCArICIxIilbMF07CiAgICAgIGxldCB0czEgPSB0aGlzLm11bHQodm9sLCBjaCA8PSAwID8gMCA6IHNyY1swXSwgaWQgKyAiMiIpOwogICAgICBsZXQgdHMyID0gdGhpcy5tdWx0KHZvbCwgY2ggPj0gMCA/IDAgOiBzcmNbMF0sIGlkICsgIjMiKTsKICAgICAgbGV0IHVwcGVyID0gdGhpcy5zdW0odHMxLCBsZW4sIGlkICsgIjQiKTsKICAgICAgbGV0IGxvd2VyID0gdGhpcy5zdW0odHMyLCBsZW4sIGlkICsgIjUiKTsKICAgICAgbGV0IHJlcyA9IHZvaWQgMDsKICAgICAgaWYgKCF0aGlzLm5hKGxvd2VyKSkgewogICAgICAgIHJlcyA9IHRoaXMucnNpKHVwcGVyLCBsb3dlciwgaWQgKyAiNiIpWzBdOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHJlcywgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIE1pbiBvZiBhcmd1bWVudHMKICAgICAqIEBwYXJhbSB7Li4ubnVtYmVyfSBhcmdzIC0gTnVtZXJpYyB2YWx1ZXMKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwogICAgbWluKC4uLmFyZ3MpIHsKICAgICAgYXJncy5wb3AoKTsKICAgICAgcmV0dXJuIE1hdGgubWluKC4uLmFyZ3MpOwogICAgfQogICAgLyoqIFJldHVybnMgbWludXRlcyBvZiBhIGdpdmVuIHRpbWVzdGFtcAogICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lXSAtIFRpbWUgaW4gbXMgKGN1cnJlbnQgdCwgaWYgbm90IGRlZmluZWQpCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gSG91cgogICAgICovCiAgICBtaW51dGUodGltZSkgewogICAgICByZXR1cm4gbmV3IERhdGUodGltZSB8fCBzZS50KS5nZXRVVENNaW51dGVzKCk7CiAgICB9CiAgICAvKiogTW9tZW50dW0KICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgbW9tKHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBtb20oJHtsZW59KWApOwogICAgICByZXR1cm4gdGhpcy50cyhzcmNbMF0gLSBzcmNbbGVuXSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIE1vbnRoCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSBpbiBtcyAoY3VycmVudCB0LCBpZiBub3QgZGVmaW5lZCkKICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBEYXkKICAgICAqLwogICAgbW9udGgodGltZSkgewogICAgICByZXR1cm4gbmV3IERhdGUodGltZSB8fCBzZS50KS5nZXRVVENNb250aCgpOwogICAgfQogICAgLyoqIERpc3BsYXkgZGF0YSBwb2ludCBhcyB0aGUgbWFpbiBjaGFydAogICAgICogQHBhcmFtIHsoVFN8VFNbXXwqKX0geCAtIERhdGEgcG9pbnQgLyBUUyAvIGFycmF5IG9mIFRTCiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3NldHRdIC0gT2JqZWN0IHdpdGggc2V0dGluZ3MgJiBPViB0eXBlCiAgICAgKi8KICAgIGNoYXJ0KHgsIHNldHQgPSB7fSwgX2lkKSB7CiAgICAgIGxldCB2aWV3ID0gc2V0dC52aWV3IHx8ICJtYWluIjsKICAgICAgbGV0IG9mZiA9IDA7CiAgICAgIGlmICh4ICYmIHguX19pZF9fKSB7CiAgICAgICAgb2ZmID0geC5fX29mZnNldF9fIHx8IDA7CiAgICAgICAgeCA9IHhbMF07CiAgICAgIH0KICAgICAgaWYgKEFycmF5LmlzQXJyYXkoeCkgJiYgeFswXSAmJiB4WzBdLl9faWRfXykgewogICAgICAgIG9mZiA9IHhbMF0uX19vZmZzZXRfXyB8fCAwOwogICAgICAgIHggPSB4Lm1hcCgoeDIpID0+IHgyWzBdKTsKICAgICAgfQogICAgICBpZiAoIXRoaXMuZW52LmNoYXJ0W3ZpZXddKSB7CiAgICAgICAgbGV0IHR5cGUgPSBzZXR0LnR5cGU7CiAgICAgICAgc2V0dC4kc3ludGggPSB0cnVlOwogICAgICAgIHNldHQuc2tpcE5hTiA9IHRydWU7CiAgICAgICAgdGhpcy5lbnYuY2hhcnRbdmlld10gPSB7CiAgICAgICAgICB0eXBlOiB0eXBlIHx8ICJDYW5kbGVzIiwKICAgICAgICAgIGRhdGE6IFtdLAogICAgICAgICAgc2V0dGluZ3M6IHNldHQsCiAgICAgICAgICB2aWV3LAogICAgICAgICAgdnByb3BzOiBzZXR0LnZwcm9wcywKICAgICAgICAgIGluZGV4QmFzZWQ6IHNldHQudnByb3BzLmliLAogICAgICAgICAgdGY6IHNldHQudnByb3BzLnRmCiAgICAgICAgfTsKICAgICAgICBkZWxldGUgc2V0dC50eXBlOwogICAgICAgIGRlbGV0ZSBzZXR0LnZwcm9wczsKICAgICAgICBkZWxldGUgc2V0dC52aWV3OwogICAgICB9CiAgICAgIG9mZiAqPSBzZS50ZjsKICAgICAgbGV0IHYgPSBBcnJheS5pc0FycmF5KHgpID8gW3NlLnQgKyBvZmYsIC4uLnhdIDogW3NlLnQgKyBvZmYsIHhdOwogICAgICB1cGRhdGUodGhpcy5lbnYuY2hhcnRbdmlld10uZGF0YSwgdik7CiAgICB9CiAgICAvKiogUmV0dXJucyB0cnVlIHdoZW4gdGhlIGNhbmRsZSh0ZikgaXMgYmVpbmcgY2xvc2VkCiAgICAgKiAoY3JlYXRlIGEgbmV3IG92ZXJsYXkgaW4gRGF0YUN1YmUpCiAgICAgKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gdGYgLSBUaW1lZnJhbWUgaW4gbXMgb3IgYXMgYSBzdHJpbmcKICAgICAqIEByZXR1cm4ge2Jvb2xlYW59CiAgICAgKi8KICAgIG9uY2xvc2UodGYpIHsKICAgICAgaWYgKCF0aGlzLmVudi5zaGFyZWQub25jbG9zZSkKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIGlmICghdGYpCiAgICAgICAgdGYgPSBzZS50ZjsKICAgICAgcmV0dXJuIChzZS50ICsgc2UudGYpICUgdGZfZnJvbV9zdHIodGYpID09PSAwOwogICAgfQogICAgLyoqIFNlbmRzIHNldHRpbmdzIHVwZGF0ZQogICAgICogKGNhbiBiZSBjYWxsZWQgZnJvbSBpbml0KCksIHVwZGF0ZSgpIG9yIHBvc3QoKSkKICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1cGQgLSBTZXR0aW5ncyB1cGRhdGUgKG9iamVjdCB0byBtZXJnZSkKICAgICAqLwogICAgc2V0dGluZ3ModXBkKSB7CiAgICAgIHRoaXMuZW52LnNlbmRfbW9kaWZ5KHsgc2V0dGluZ3M6IHVwZCB9KTsKICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmVudi5zcmMuc2V0dCwgdXBkKTsKICAgIH0KICAgIC8qKiBTaGlmdHMgVFMgbGVmdCBvciByaWdodCBieSAibnVtIiBjYW5kbGVzCiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtIC0gT2Zmc2V0IG1lYXN1cmVkIGluIGNhbmRsZXMKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyAvIGV4aXN0aW5nIHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIG9mZnNldChzcmMsIG51bSwgX2lkKSB7CiAgICAgIGlmIChzcmMuX19pZF9fKSB7CiAgICAgICAgc3JjLl9fb2Zmc2V0X18gPSBudW07CiAgICAgICAgcmV0dXJuIHNyYzsKICAgICAgfQogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYG9mZnNldCgke251bX0pYCk7CiAgICAgIGxldCBvdXQgPSB0aGlzLnRzKHNyYywgaWQpOwogICAgICBvdXQuX19vZmZzZXRfXyA9IG51bTsKICAgICAgcmV0dXJuIG91dDsKICAgIH0KICAgIC8vIHBlcmNlbnRpbGVfbGluZWFyX2ludGVycG9sYXRpb24KICAgIGxpbmVhcmludCgpIHsKICAgIH0KICAgIC8vIHBlcmNlbnRpbGVfbmVhcmVzdF9yYW5rCiAgICBuZWFyZXN0cmFuaygpIHsKICAgIH0KICAgIC8qKiBUaGUgY3VycmVudCB0aW1lCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gdGltZXN0YW1wCiAgICAgKi8KICAgIG5vdygpIHsKICAgICAgcmV0dXJuICgvKiBAX19QVVJFX18gKi8gbmV3IERhdGUoKSkuZ2V0VGltZSgpOwogICAgfQogICAgcGVyY2VudHJhbmsoKSB7CiAgICB9CiAgICAvKiogUmV0dXJucyBwcmljZSBvZiB0aGUgcGl2b3QgaGlnaCBwb2ludAogICAgICogVGlwOiB3b3JrcyBiZXN0IHdpdGggYG9mZnNldGAgZnVuY3Rpb24KICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVmdCAtIGxlZnQgdGhyZXNob2xkLCBjYW5kbGVzCiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmlnaHQgLSByaWdodCB0aHJlc2hvbGQsIGNhbmRsZXMKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBwaXZvdGhpZ2goc3JjLCBsZWZ0LCByaWdodCwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgcGl2b3RoaWdoKCR7bGVmdH0sJHtyaWdodH0pYCk7CiAgICAgIGxldCBsZW4gPSBsZWZ0ICsgcmlnaHQgKyAxOwogICAgICBsZXQgdG9wID0gc3JjW3JpZ2h0XTsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgewogICAgICAgIGlmICh0b3AgPD0gc3JjW2ldICYmIGkgIT09IHJpZ2h0KSB7CiAgICAgICAgICByZXR1cm4gdGhpcy50cyhOYU4sIGlkLCBzcmMuX190Zl9fKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHModG9wLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogUmV0dXJucyBwcmljZSBvZiB0aGUgcGl2b3QgbG93IHBvaW50CiAgICAgKiBUaXA6IHdvcmtzIGJlc3Qgd2l0aCBgb2Zmc2V0YCBmdW5jdGlvbgogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IC0gbGVmdCB0aHJlc2hvbGQsIGNhbmRsZXMKICAgICAqIEBwYXJhbSB7bnVtYmVyfSByaWdodCAtIHJpZ2h0IHRocmVzaG9sZCwgY2FuZGxlcwogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIHBpdm90bG93KHNyYywgbGVmdCwgcmlnaHQsIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHBpdm90bG93KCR7bGVmdH0sJHtyaWdodH0pYCk7CiAgICAgIGxldCBsZW4gPSBsZWZ0ICsgcmlnaHQgKyAxOwogICAgICBsZXQgYm90ID0gc3JjW3JpZ2h0XTsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgewogICAgICAgIGlmIChib3QgPj0gc3JjW2ldICYmIGkgIT09IHJpZ2h0KSB7CiAgICAgICAgICByZXR1cm4gdGhpcy50cyhOYU4sIGlkLCBzcmMuX190Zl9fKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHMoYm90LCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogU2hvcnRjdXQgZm9yIE1hdGgucG93KCkKICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICovCiAgICBwb3coeCkgewogICAgICByZXR1cm4gTWF0aC5wb3coeCk7CiAgICB9CiAgICAvKiogVGVzdCBpZiAic3JjIiBUUyBpcyByaXNpbmcgZm9yICJsZW4iIGNhbmRsZXMKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgcmlzaW5nKHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGByaXNpbmcoJHtsZW59KWApOwogICAgICBsZXQgdG9wID0gc3JjWzBdOwogICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiArIDE7IGkrKykgewogICAgICAgIGlmICh0b3AgPD0gc3JjW2ldKSB7CiAgICAgICAgICByZXR1cm4gdGhpcy50cyhmYWxzZSwgaWQsIHNyYy5fX3RmX18pOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gdGhpcy50cyh0cnVlLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogRXhwb25lbnRpYWxseSBNQSB3aXRoIGFscGhhID0gMSAvIGxlbmd0aAogICAgICogVXNlZCBpbiBSU0kKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgcm1hKHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBybWEoJHtsZW59KWApOwogICAgICBsZXQgYSA9IGxlbjsKICAgICAgbGV0IHN1bSA9IHRoaXMudHMoMCwgaWQsIHNyYy5fX3RmX18pOwogICAgICBzdW1bMF0gPSB0aGlzLm5hKHN1bVsxXSkgPyB0aGlzLnNtYShzcmMsIGxlbiwgaWQpWzBdIDogKHNyY1swXSArIChhIC0gMSkgKiB0aGlzLm56KHN1bVsxXSkpIC8gYTsKICAgICAgcmV0dXJuIHN1bTsKICAgIH0KICAgIC8qKiBSYXRlIG9mIENoYW5nZQogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICByb2Moc3JjLCBsZW4sIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHJvYygke2xlbn0pYCk7CiAgICAgIHJldHVybiB0aGlzLnRzKAogICAgICAgIDEwMCAqIChzcmNbMF0gLSBzcmNbbGVuXSkgLyBzcmNbbGVuXSwKICAgICAgICBpZCwKICAgICAgICBzcmMuX190Zl9fCiAgICAgICk7CiAgICB9CiAgICAvKiogU2hvcnRjdXQgZm9yIE1hdGgucm91bmQoKQogICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHZhcmlhYmxlCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKi8KICAgIHJvdW5kKHgpIHsKICAgICAgcmV0dXJuIE1hdGgucm91bmQoeCk7CiAgICB9CiAgICAvKiogUmVsYXRpdmUgU3RyZW5ndGggSW5kZXgKICAgICAqIEBwYXJhbSB7VFN9IHggLSBGaXJzdCBJbnB1dAogICAgICogQHBhcmFtIHtudW1iZXJ8VFN9IHkgLSBTZWNvbmQgSW5wdXQKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICByc2koeCwgeSwgX2lkKSB7CiAgICAgIGlmICghdGhpcy5uYSh5KSAmJiB5Ll9faWRfXykgewogICAgICAgIHZhciBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgcnNpKHgseSlgKTsKICAgICAgICB2YXIgcnNpID0gMTAwIC0gMTAwIC8gKDEgKyB0aGlzLmRpdih4LCB5LCBpZClbMF0pOwogICAgICB9IGVsc2UgewogICAgICAgIHZhciBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgcnNpKCR7eX0pYCk7CiAgICAgICAgbGV0IGNoID0gdGhpcy5jaGFuZ2UoeCwgMSwgX2lkKVswXTsKICAgICAgICBsZXQgcGMgPSB0aGlzLnRzKE1hdGgubWF4KGNoLCAwKSwgaWQgKyAiMSIsIHguX190Zl9fKTsKICAgICAgICBsZXQgbmMgPSB0aGlzLnRzKC1NYXRoLm1pbihjaCwgMCksIGlkICsgIjIiLCB4Ll9fdGZfXyk7CiAgICAgICAgbGV0IHVwID0gdGhpcy5ybWEocGMsIHksIGlkICsgIjMiKVswXTsKICAgICAgICBsZXQgZG93biA9IHRoaXMucm1hKG5jLCB5LCBpZCArICI0IilbMF07CiAgICAgICAgdmFyIHJzaSA9IGRvd24gPT09IDAgPyAxMDAgOiB1cCA9PT0gMCA/IDAgOiAxMDAgLSAxMDAgLyAoMSArIHVwIC8gZG93bik7CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHMocnNpLCBpZCArICI1IiwgeC5fX3RmX18pOwogICAgfQogICAgLyoqIFBhcmFib2xpYyBTQVIKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCAtIFN0YXJ0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5jIC0gSW5jcmVtZW50CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4IC0gTWF4aW11bQogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIHNhcihzdGFydCwgaW5jLCBtYXgsIF9pZCwgX3RmKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgc2FyKCR7c3RhcnR9LCR7aW5jfSwke21heH0pYCk7CiAgICAgIGxldCB0ZnMgPSBfdGYgfHwgIiI7CiAgICAgIGxldCBoaWdoID0gdGhpcy5lbnYuc2hhcmVkW2BoaWdoJHt0ZnN9YF07CiAgICAgIGxldCBsb3cgPSB0aGlzLmVudi5zaGFyZWRbYGxvdyR7dGZzfWBdOwogICAgICBsZXQgY2xvc2UgPSB0aGlzLmVudi5zaGFyZWRbYGNsb3NlJHt0ZnN9YF07CiAgICAgIGxldCBtaW5UaWNrID0gMDsKICAgICAgbGV0IG91dCA9IHRoaXMudHModm9pZCAwLCBpZCArICIxIiwgX3RmKTsKICAgICAgbGV0IHBvcyA9IHRoaXMudHModm9pZCAwLCBpZCArICIyIiwgX3RmKTsKICAgICAgbGV0IG1heE1pbiA9IHRoaXMudHModm9pZCAwLCBpZCArICIzIiwgX3RmKTsKICAgICAgbGV0IGFjYyA9IHRoaXMudHModm9pZCAwLCBpZCArICI0IiwgX3RmKTsKICAgICAgbGV0IG4gPSBfdGYgPyBvdXQuX19sZW5fXyAtIDEgOiB0aGlzLnNlLml0ZXI7CiAgICAgIGxldCBwcmV2OwogICAgICBsZXQgb3V0U2V0ID0gZmFsc2U7CiAgICAgIGlmIChuID49IDEpIHsKICAgICAgICBwcmV2ID0gb3V0WzFdOwogICAgICAgIGlmIChuID09PSAxKSB7CiAgICAgICAgICBpZiAoY2xvc2VbMF0gPiBjbG9zZVsxXSkgewogICAgICAgICAgICBwb3NbMF0gPSAxOwogICAgICAgICAgICBtYXhNaW5bMF0gPSBNYXRoLm1heChoaWdoWzBdLCBoaWdoWzFdKTsKICAgICAgICAgICAgcHJldiA9IE1hdGgubWluKGxvd1swXSwgbG93WzFdKTsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHBvc1swXSA9IC0xOwogICAgICAgICAgICBtYXhNaW5bMF0gPSBNYXRoLm1pbihsb3dbMF0sIGxvd1sxXSk7CiAgICAgICAgICAgIHByZXYgPSBNYXRoLm1heChoaWdoWzBdLCBoaWdoWzFdKTsKICAgICAgICAgIH0KICAgICAgICAgIGFjY1swXSA9IHN0YXJ0OwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICBwb3NbMF0gPSBwb3NbMV07CiAgICAgICAgICBhY2NbMF0gPSBhY2NbMV07CiAgICAgICAgICBtYXhNaW5bMF0gPSBtYXhNaW5bMV07CiAgICAgICAgfQogICAgICAgIGlmIChwb3NbMF0gPT09IDEpIHsKICAgICAgICAgIGlmIChoaWdoWzBdID4gbWF4TWluWzBdKSB7CiAgICAgICAgICAgIG1heE1pblswXSA9IGhpZ2hbMF07CiAgICAgICAgICAgIGFjY1swXSA9IE1hdGgubWluKGFjY1swXSArIGluYywgbWF4KTsKICAgICAgICAgIH0KICAgICAgICAgIGlmIChsb3dbMF0gPD0gcHJldikgewogICAgICAgICAgICBwb3NbMF0gPSAtMTsKICAgICAgICAgICAgb3V0WzBdID0gbWF4TWluWzBdOwogICAgICAgICAgICBtYXhNaW5bMF0gPSBsb3dbMF07CiAgICAgICAgICAgIGFjY1swXSA9IHN0YXJ0OwogICAgICAgICAgICBvdXRTZXQgPSB0cnVlOwogICAgICAgICAgfQogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICBpZiAobG93WzBdIDwgbWF4TWluWzBdKSB7CiAgICAgICAgICAgIG1heE1pblswXSA9IGxvd1swXTsKICAgICAgICAgICAgYWNjWzBdID0gTWF0aC5taW4oYWNjWzBdICsgaW5jLCBtYXgpOwogICAgICAgICAgfQogICAgICAgICAgaWYgKGhpZ2hbMF0gPj0gcHJldikgewogICAgICAgICAgICBwb3NbMF0gPSAxOwogICAgICAgICAgICBvdXRbMF0gPSBtYXhNaW5bMF07CiAgICAgICAgICAgIG1heE1pblswXSA9IGhpZ2hbMF07CiAgICAgICAgICAgIGFjY1swXSA9IHN0YXJ0OwogICAgICAgICAgICBvdXRTZXQgPSB0cnVlOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBpZiAoIW91dFNldCkgewogICAgICAgICAgb3V0WzBdID0gcHJldiArIGFjY1swXSAqIChtYXhNaW5bMF0gLSBwcmV2KTsKICAgICAgICAgIGlmIChwb3NbMF0gPT09IDEpIHsKICAgICAgICAgICAgaWYgKG91dFswXSA+PSBsb3dbMF0pCiAgICAgICAgICAgICAgb3V0WzBdID0gbG93WzBdIC0gbWluVGljazsKICAgICAgICAgIH0KICAgICAgICAgIGlmIChwb3NbMF0gPT09IC0xKSB7CiAgICAgICAgICAgIGlmIChvdXRbMF0gPD0gaGlnaFswXSkKICAgICAgICAgICAgICBvdXRbMF0gPSBoaWdoWzBdICsgbWluVGljazsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIG91dDsKICAgIH0KICAgIC8qKiBSZXR1cm5zIHNlY29uZHMgb2YgYSBnaXZlbiB0aW1lc3RhbXAKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZV0gLSBUaW1lIGluIG1zIChjdXJyZW50IHQsIGlmIG5vdCBkZWZpbmVkKQogICAgICogQHJldHVybiB7bnVtYmVyfSAtIEhvdXIKICAgICAqLwogICAgc2Vjb25kKHRpbWUpIHsKICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUgfHwgc2UudCkuZ2V0VVRDU2Vjb25kcygpOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLnNpbmcoKQogICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHZhcmlhYmxlCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKi8KICAgIHNpZ24oeCkgewogICAgICByZXR1cm4gTWF0aC5zaWduKHgpOwogICAgfQogICAgLyoqIFNpbmUgZnVuY3Rpb24KICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICovCiAgICBzaW4oeCkgewogICAgICByZXR1cm4gTWF0aC5zaW4oeCk7CiAgICB9CiAgICAvKiogU2ltcGxlIE1vdmluZyBBdmVyYWdlCiAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIHNtYShzcmMsIGxlbiwgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgc21hKCR7bGVufSlgKTsKICAgICAgbGV0IHN1bSA9IDA7CiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsKICAgICAgICBzdW0gPSBzdW0gKyBzcmNbaV07CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHMoc3VtIC8gbGVuLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogU2hvcnRjdXQgZm9yIE1hdGguc3FydCgpCiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgdmFyaWFibGUKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwogICAgc3FydCh4KSB7CiAgICAgIHJldHVybiBNYXRoLnNxcnQoeCk7CiAgICB9CiAgICAvKiogU3RhbmRhcmQgZGV2aWF0aW9uCiAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIHN0ZGV2KHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IHN1bWYgPSAoeCwgeSkgPT4gewogICAgICAgIGxldCByZXMgPSB4ICsgeTsKICAgICAgICByZXR1cm4gcmVzOwogICAgICB9OwogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHN0ZGV2KCR7bGVufSlgKTsKICAgICAgbGV0IGF2ZyA9IHRoaXMuc21hKHNyYywgbGVuLCBpZCk7CiAgICAgIGxldCBzcWQgPSAwOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgbGV0IHN1bSA9IHN1bWYoc3JjW2ldLCAtYXZnWzBdKTsKICAgICAgICBzcWQgKz0gc3VtICogc3VtOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKE1hdGguc3FydChzcWQgLyBsZW4pLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogU3RvY2hhc3RpYwogICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAqIEBwYXJhbSB7VFN9IGhpZ2ggLSBUUyBvZiBoaWdoCiAgICAgKiBAcGFyYW0ge1RTfSBsb3cgLSBUUyBvZiBsb3cKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICBzdG9jaChzcmMsIGhpZ2gsIGxvdywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBzdW0oJHtsZW59KWApOwogICAgICBsZXQgeCA9IDEwMCAqIChzcmNbMF0gLSB0aGlzLmxvd2VzdChsb3csIGxlbilbMF0pOwogICAgICBsZXQgeSA9IHRoaXMuaGlnaGVzdChoaWdoLCBsZW4pWzBdIC0gdGhpcy5sb3dlc3QobG93LCBsZW4pWzBdOwogICAgICByZXR1cm4gdGhpcy50cyh4IC8geSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIFJldHVybnMgdGhlIHNsaWRpbmcgc3VtIG9mIGxhc3QgImxlbiIgdmFsdWVzIG9mIHRoZSBzb3VyY2UKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgc3VtKHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBzdW0oJHtsZW59KWApOwogICAgICBsZXQgc3VtID0gMDsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgewogICAgICAgIHN1bSA9IHN1bSArIHNyY1tpXTsKICAgICAgfQogICAgICByZXR1cm4gdGhpcy50cyhzdW0sIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBTdXBlcnRyZW5kIEluZGljYXRvcgogICAgICogQHBhcmFtIHtudW1iZXJ9IGZhY3RvciAtIEFUUiBtdWx0aXBsaWVyCiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXRybGVuIC0gTGVuZ3RoIG9mIEFUUgogICAgICogQHJldHVybiB7VFNbXX0gLSBTdXBlcnRyZW5kIGxpbmUgYW5kIGRpcmVjdGlvbiBvZiB0cmVuZAogICAgICovCiAgICBzdXBlcnRyZW5kKGZhY3RvciwgYXRybGVuLCBfaWQsIF90ZikgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHN1cGVydHJlbmQoJHtmYWN0b3J9LCR7YXRybGVufSlgKTsKICAgICAgbGV0IHRmcyA9IF90ZiB8fCAiIjsKICAgICAgbGV0IGhpZ2ggPSB0aGlzLmVudi5zaGFyZWRbYGhpZ2gke3Rmc31gXTsKICAgICAgbGV0IGxvdyA9IHRoaXMuZW52LnNoYXJlZFtgbG93JHt0ZnN9YF07CiAgICAgIGxldCBjbG9zZSA9IHRoaXMuZW52LnNoYXJlZFtgY2xvc2Uke3Rmc31gXTsKICAgICAgbGV0IGhsMiA9IChoaWdoWzBdICsgbG93WzBdKSAqIDAuNTsKICAgICAgbGV0IGF0ciA9IGZhY3RvciAqIHRoaXMuYXRyKGF0cmxlbiwgaWQgKyAiMSIsIF90ZilbMF07CiAgICAgIGxldCBscyA9IHRoaXMudHMoaGwyIC0gYXRyLCBpZCArICIyIiwgX3RmKTsKICAgICAgbGV0IGxzMSA9IHRoaXMubnoobHNbMV0sIGxzWzBdKTsKICAgICAgbHNbMF0gPSBjbG9zZVsxXSA+IGxzMSA/IE1hdGgubWF4KGxzWzBdLCBsczEpIDogbHNbMF07CiAgICAgIGxldCBzcyA9IHRoaXMudHMoaGwyICsgYXRyLCBpZCArICIzIiwgX3RmKTsKICAgICAgbGV0IHNzMSA9IHRoaXMubnooc3NbMV0sIHNzKTsKICAgICAgc3NbMF0gPSBjbG9zZVsxXSA8IHNzMSA/IE1hdGgubWluKHNzWzBdLCBzczEpIDogc3NbMF07CiAgICAgIGxldCBkaXIgPSB0aGlzLnRzKDEsIGlkICsgIjQiLCBfdGYpOwogICAgICBkaXJbMF0gPSB0aGlzLm56KGRpclsxXSwgZGlyWzBdKTsKICAgICAgZGlyWzBdID0gZGlyWzBdID09PSAtMSAmJiBjbG9zZVswXSA+IHNzMSA/IDEgOiBkaXJbMF0gPT09IDEgJiYgY2xvc2VbMF0gPCBsczEgPyAtMSA6IGRpclswXTsKICAgICAgbGV0IHBsb3QgPSB0aGlzLnRzKGRpclswXSA9PT0gMSA/IGxzWzBdIDogc3NbMF0sIGlkICsgIjUiLCBfdGYpOwogICAgICByZXR1cm4gW3Bsb3QsIHRoaXMubmVnKGRpciwgaWQgKyAiNiIpXTsKICAgIH0KICAgIC8qKiBTeW1tZXRyaWNhbGx5IFdlaWdodGVkIE1vdmluZyBBdmVyYWdlCiAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIHN3bWEoc3JjLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBzd21hYCk7CiAgICAgIGxldCBzdW0gPSBzcmNbM10gKiB0aGlzLlNXTUFbMF0gKyBzcmNbMl0gKiB0aGlzLlNXTUFbMV0gKyBzcmNbMV0gKiB0aGlzLlNXTUFbMl0gKyBzcmNbMF0gKiB0aGlzLlNXTUFbM107CiAgICAgIHJldHVybiB0aGlzLnRzKHN1bSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIENyZWF0ZXMgYSBuZXcgU3ltYm9sLgogICAgICogQHBhcmFtIHsqfSB4IC0gU29tZXRoaW5nLCBkZXBlbmRzIG9uIGFyZyB2YXJpYXRpb24KICAgICAqIEBwYXJhbSB7Kn0geSAtIFNvbWV0aGluZywgZGVwZW5kcyBvbiBhcmcgdmFyaWF0aW9uCiAgICAgKiBAcmV0dXJuIHtTeW19CiAgICAgKiBBcmd1bWVudCB2YXJpYXRpb25zOgogICAgICogZGF0YShBcnJheSksIFtwYXJhbXMoT2JqZWN0KV0KICAgICAqIHRzKFRTKSwgW3BhcmFtcyhPYmplY3QpXQogICAgICogcG9pbnQoTnVtYmVyKSwgW3BhcmFtcyhPYmplY3QpXQogICAgICogdGYoU3RyaW5nKSAxbSwgNW0sIDFILCBldGMuICh1c2VzIG1haW4gT0hMQ1YpCiAgICAgKiBQYXJhbXMgb2JqZWN0OiB7CiAgICAgKiAgaWQ6IFN0cmluZywKICAgICAqICB0ZjogU3RyaW5nfE51bWJlciwKICAgICAqICBhZ2d0eXBlOiBTdHJpbmcgKFRPRE86IFR5cGUgb2YgYWdncmVnYXRpb24pCiAgICAgKiAgZm9ybWF0OiBTdHJpbmcgKERhdGEgZm9ybWF0LCBlLmcuICJ0aW1lOnByaWNlOnZvbCIpCiAgICAgKiAgd2luZG93OiBTdHJpbmd8TnVtYmVyIChBZ2dyZWdhdGlvbiB3aW5kb3cpCiAgICAgKiAgbWFpbiB0cnVlfGZhbHNlIChVc2UgYXMgdGhlIG1haW4gY2hhcnQpCiAgICAgKiB9CiAgICAgKi8KICAgIHN5bSh4LCB5ID0ge30sIF9pZCkgewogICAgICBsZXQgaWQgPSB5LmlkIHx8IHRoaXMuX3RzaWQoX2lkLCBgc3ltYCk7CiAgICAgIHkuaWQgPSBpZDsKICAgICAgaWYgKHRoaXMuZW52LnN5bXNbaWRdKSB7CiAgICAgICAgdGhpcy5lbnYuc3ltc1tpZF0udXBkYXRlKHgpOwogICAgICAgIHJldHVybiB0aGlzLmVudi5zeW1zW2lkXTsKICAgICAgfQogICAgICBzd2l0Y2ggKHR5cGVvZiB4KSB7CiAgICAgICAgY2FzZSAib2JqZWN0IjoKICAgICAgICAgIHZhciBzeW0gPSBuZXcgU3ltKHgsIHkpOwogICAgICAgICAgdGhpcy5lbnYuc3ltc1tpZF0gPSBzeW07CiAgICAgICAgICBpZiAoeC5fX2lkX18pIHsKICAgICAgICAgICAgc3ltLmRhdGFfdHlwZSA9IFRTUzsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHN5bS5kYXRhX3R5cGUgPSBBUlI7CiAgICAgICAgICB9CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJudW1iZXIiOgogICAgICAgICAgc3ltID0gbmV3IFN5bShudWxsLCB5KTsKICAgICAgICAgIHN5bS5kYXRhX3R5cGUgPSBOVU07CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJzdHJpbmciOgogICAgICAgICAgeS50ZiA9IHg7CiAgICAgICAgICBzeW0gPSBuZXcgU3ltKHNlLmRhdGEub2hsY3YuZGF0YSwgeSk7CiAgICAgICAgICBzeW0uZGF0YV90eXBlID0gQVJSOwogICAgICAgICAgYnJlYWs7CiAgICAgIH0KICAgICAgdGhpcy5lbnYuc3ltc1tpZF0gPSBzeW07CiAgICAgIHJldHVybiBzeW07CiAgICB9CiAgICAvKiogVGFuZ2VudCBmdW5jdGlvbgogICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHZhcmlhYmxlCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKi8KICAgIHRhbih4KSB7CiAgICAgIHJldHVybiBNYXRoLnRhbih4KTsKICAgIH0KICAgIHRpbWUocmVzLCBzZXNoKSB7CiAgICB9CiAgICB0aW1lc3RhbXAoKSB7CiAgICB9CiAgICAvKiogVHJ1ZSBSYW5nZQogICAgICogQHBhcmFtIHtUU30gZml4bmFuIC0gRml4IE5hTiB2YWx1ZXMKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICB0cihmaXhuYW4gPSBmYWxzZSwgX2lkLCBfdGYpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGB0cigke2ZpeG5hbn0pYCk7CiAgICAgIGxldCB0ZnMgPSBfdGYgfHwgIiI7CiAgICAgIGxldCBoaWdoID0gdGhpcy5lbnYuc2hhcmVkW2BoaWdoJHt0ZnN9YF07CiAgICAgIGxldCBsb3cgPSB0aGlzLmVudi5zaGFyZWRbYGxvdyR7dGZzfWBdOwogICAgICBsZXQgY2xvc2UgPSB0aGlzLmVudi5zaGFyZWRbYGNsb3NlJHt0ZnN9YF07CiAgICAgIGxldCByZXMgPSAwOwogICAgICBpZiAodGhpcy5uYShjbG9zZVsxXSkgJiYgZml4bmFuKSB7CiAgICAgICAgcmVzID0gaGlnaFswXSAtIGxvd1swXTsKICAgICAgfSBlbHNlIHsKICAgICAgICByZXMgPSBNYXRoLm1heCgKICAgICAgICAgIGhpZ2hbMF0gLSBsb3dbMF0sCiAgICAgICAgICBNYXRoLmFicyhoaWdoWzBdIC0gY2xvc2VbMV0pLAogICAgICAgICAgTWF0aC5hYnMobG93WzBdIC0gY2xvc2VbMV0pCiAgICAgICAgKTsKICAgICAgfQogICAgICByZXR1cm4gdGhpcy50cyhyZXMsIGlkLCBfdGYpOwogICAgfQogICAgLyoqIFRydWUgc3RyZW5ndGggaW5kZXgKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2hvcnQgLSBTaG9ydCBsZW5ndGgKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb25nIC0gTG9uZyBsZW5ndGgKICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICovCiAgICB0c2koc3JjLCBzaG9ydCwgbG9uZywgX2lkKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgdHNpKCR7c2hvcnR9LCR7bG9uZ30pYCk7CiAgICAgIGxldCBtID0gdGhpcy5jaGFuZ2Uoc3JjLCAxLCBpZCArICIwIik7CiAgICAgIGxldCBtX2FicyA9IHRoaXMudHMoTWF0aC5hYnMobVswXSksIGlkICsgIjEiLCBzcmMuX190Zl9fKTsKICAgICAgbGV0IHRzaSA9IHRoaXMuZW1hKHRoaXMuZW1hKG0sIGxvbmcsIGlkICsgIjEiKSwgc2hvcnQsIGlkICsgIjIiKVswXSAvIHRoaXMuZW1hKHRoaXMuZW1hKG1fYWJzLCBsb25nLCBpZCArICIzIiksIHNob3J0LCBpZCArICI0IilbMF07CiAgICAgIHJldHVybiB0aGlzLnRzKHRzaSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgdmFyaWFuY2Uoc3JjLCBsZW4pIHsKICAgIH0KICAgIC8qKiBDcmVhdGUgYSBuZXcgVmlldwogICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBWaWV3IG5hbWUKICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyAtIFZpZXcgcHJvcGVydGllcwogICAgICovCiAgICB2aWV3KG5hbWUsIHByb3BzID0ge30sIF9pZCkgewogICAgICBpZiAoIXRoaXMuZW52LnZpZXdzW25hbWVdKSB7CiAgICAgICAgbGV0IHZpZXcgPSBuZXcgVmlldyh0aGlzLCBuYW1lLCBwcm9wcyk7CiAgICAgICAgdGhpcy5lbnYudmlld3NbbmFtZV0gPSB2aWV3OwogICAgICAgIHJldHVybiB2aWV3OwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLmVudi52aWV3c1tuYW1lXTsKICAgIH0KICAgIHZ3YXAoc3JjKSB7CiAgICB9CiAgICAvKiogVm9sdW1lIFdlaWdodGVkIE1vdmluZyBBdmVyYWdlCiAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIHZ3bWEoc3JjLCBsZW4sIF9pZCkgewogICAgICBsZXQgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHZ3bWEoJHtsZW59KWApOwogICAgICBsZXQgdm9sID0gdGhpcy5lbnYuc2hhcmVkLnZvbDsKICAgICAgbGV0IHN4diA9IHRoaXMudHMoc3JjWzBdICogdm9sWzBdLCBpZCArICIxIiwgc3JjLl9fdGZfXyk7CiAgICAgIGxldCByZXMgPSB0aGlzLnNtYShzeHYsIGxlbiwgaWQgKyAiMiIpWzBdIC8gdGhpcy5zbWEodm9sLCBsZW4sIGlkICsgIjMiKVswXTsKICAgICAgcmV0dXJuIHRoaXMudHMocmVzLCBpZCArICI0Iiwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogV2VlayBvZiB5ZWFyLCBsaXRlcmFsbHkKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZV0gLSBUaW1lIGluIG1zIChjdXJyZW50IHQsIGlmIG5vdCBkZWZpbmVkKQogICAgICogQHJldHVybiB7bnVtYmVyfSAtIFdlZWsKICAgICAqLwogICAgd2Vla29meWVhcih0aW1lKSB7CiAgICAgIGxldCBkYXRlID0gbmV3IERhdGUodGltZSB8fCBzZS50KTsKICAgICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTsKICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgMyAtIChkYXRlLmdldFVUQ0RheSgpICsgNikgJSA3KTsKICAgICAgbGV0IHdlZWsxID0gbmV3IERhdGUoZGF0ZS5nZXRVVENGdWxsWWVhcigpLCAwLCA0KTsKICAgICAgcmV0dXJuIDEgKyBNYXRoLnJvdW5kKAogICAgICAgICgoZGF0ZSAtIHdlZWsxKSAvIDg2NGU1IC0gMyArICh3ZWVrMS5nZXRVVENEYXkoKSArIDYpICUgNykgLyA3CiAgICAgICk7CiAgICB9CiAgICAvKiogV2VpZ2h0ZWQgbW92aW5nIGF2ZXJhZ2UKICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoCiAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAqLwogICAgd21hKHNyYywgbGVuLCBfaWQpIHsKICAgICAgbGV0IGlkID0gdGhpcy5fdHNpZChfaWQsIGB3bWEoJHtsZW59KWApOwogICAgICBsZXQgbm9ybSA9IDA7CiAgICAgIGxldCBzdW0gPSAwOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgbGV0IHcgPSAobGVuIC0gaSkgKiBsZW47CiAgICAgICAgbm9ybSArPSB3OwogICAgICAgIHN1bSArPSBzcmNbaV0gKiB3OwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHN1bSAvIG5vcm0sIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBXaWxsaWFtcyAlUgogICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aAogICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgKi8KICAgIHdwcihsZW4sIF9pZCwgX3RmKSB7CiAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgd3ByKCR7bGVufSlgKTsKICAgICAgbGV0IHRmcyA9IF90ZiB8fCAiIjsKICAgICAgbGV0IGhpZ2ggPSB0aGlzLmVudi5zaGFyZWRbYGhpZ2gke3Rmc31gXTsKICAgICAgbGV0IGxvdyA9IHRoaXMuZW52LnNoYXJlZFtgbG93JHt0ZnN9YF07CiAgICAgIGxldCBjbG9zZSA9IHRoaXMuZW52LnNoYXJlZFtgY2xvc2Uke3Rmc31gXTsKICAgICAgbGV0IGhoID0gdGhpcy5oaWdoZXN0KGhpZ2gsIGxlbiwgaWQpOwogICAgICBsZXQgbGwgPSB0aGlzLmxvd2VzdChsb3csIGxlbiwgaWQpOwogICAgICBsZXQgcmVzID0gKGhoWzBdIC0gY2xvc2VbMF0pIC8gKGhoWzBdIC0gbGxbMF0pOwogICAgICByZXR1cm4gdGhpcy50cygtcmVzICogMTAwLCBpZCwgX3RmKTsKICAgIH0KICAgIC8qKiBZZWFyCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSBpbiBtcyAoY3VycmVudCB0LCBpZiBub3QgZGVmaW5lZCkKICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBZZWFyCiAgICAgKi8KICAgIHllYXIodGltZSkgewogICAgICByZXR1cm4gbmV3IERhdGUodGltZSB8fCBzZS50KS5nZXRVVENGdWxsWWVhcigpOwogICAgfQogIH0KICBjbGFzcyBQYW5lIHsKICAgIGNvbnN0cnVjdG9yKGVudikgewogICAgICB0aGlzLnNjcmlwdElkID0gZW52LmlkOwogICAgICB0aGlzLmVudiA9IGVudjsKICAgICAgdGhpcy5zZWxmSWQgPSB0aGlzLmZpbmRTZWxmSWQoZW52LmlkKTsKICAgICAgdGhpcy5wYW5lTWFwID0gdGhpcy5jcmVhdGVNYXAoKTsKICAgICAgdGhpcy5uYW1lMm92ID0ge307CiAgICAgIHRoaXMuc2VsZiA9IHRoaXMucGFuZUxpYih0aGlzLnNlbGZJZCk7CiAgICB9CiAgICAvLyBDcmVhdGUgYSB2aXJ0dWFsIHBhbmUgd2l0aCBhbGwgb3ZlcmxheXMsIHNvCiAgICAvLyB3ZSBjYW4gY2FsbCwgZS5nLjogcGFuZS5zZWxmLjxPdmVybGF5VHlwZT4oLi4uKQogICAgcGFuZUxpYih1dWlkKSB7CiAgICAgIGxldCBsaWIyID0ge307CiAgICAgIGZvciAodmFyIGsgaW4gc2VsZi5zY3JpcHRMaWIucHJlZmFicykgewogICAgICAgIGxpYjJba10gPSAoKHR5cGUpID0+IHsKICAgICAgICAgIHJldHVybiAodiwgc3BlY3MsIF9pZCkgPT4gewogICAgICAgICAgICBsZXQgbmFtZSA9IGdldF9mbl9pZCh0eXBlLCBfaWQgIT0gbnVsbCA/IF9pZCA6IHNwZWNzKTsKICAgICAgICAgICAgaWYgKCF0aGlzLm5hbWUyb3ZbbmFtZV0pIHsKICAgICAgICAgICAgICBsZXQgcGFuZSA9IHRoaXMucGFuZU1hcFt1dWlkXTsKICAgICAgICAgICAgICBpZiAoIXBhbmUpCiAgICAgICAgICAgICAgICBwYW5lID0gdGhpcy5jcmVhdGVQYW5lKCk7CiAgICAgICAgICAgICAgdGhpcy5uYW1lMm92W25hbWVdID0gdGhpcy5uZXdPdmVybGF5KAogICAgICAgICAgICAgICAgcGFuZSwKICAgICAgICAgICAgICAgIG5hbWUsCiAgICAgICAgICAgICAgICB0eXBlLAogICAgICAgICAgICAgICAgc3BlY3MKICAgICAgICAgICAgICApOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGxldCBvdiA9IHRoaXMubmFtZTJvdltuYW1lXTsKICAgICAgICAgICAgdGhpcy5hZGROZXdWYWx1ZShvdiwgdik7CiAgICAgICAgICB9OwogICAgICAgIH0pKGspOwogICAgICB9CiAgICAgIHJldHVybiBsaWIyOwogICAgfQogICAgLy8gQ3JlYXRlIHtwYW5lLnV1aWQgPT4gcGFuZX0gbWFwCiAgICBjcmVhdGVNYXAoKSB7CiAgICAgIGxldCBtYXAgPSB7fTsKICAgICAgZm9yICh2YXIgcGFuZSBvZiBzZWxmLnBhbmVTdHJ1Y3QpIHsKICAgICAgICBtYXBbcGFuZS51dWlkXSA9IHBhbmU7CiAgICAgIH0KICAgICAgcmV0dXJuIG1hcDsKICAgIH0KICAgIC8vIEZpbmQgcGFuZS5zZWxmIGlkCiAgICBmaW5kU2VsZklkKGlkKSB7CiAgICAgIGZvciAodmFyIHBhbmUgb2Ygc2VsZi5wYW5lU3RydWN0KSB7CiAgICAgICAgZm9yICh2YXIgc2NyaXB0IG9mIHBhbmUuc2NyaXB0cykgewogICAgICAgICAgaWYgKHNjcmlwdC51dWlkID09PSBpZCkgewogICAgICAgICAgICByZXR1cm4gcGFuZS51dWlkOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQogICAgfQogICAgLy8gQWRkIGEgbmV3IG92ZXJsYXkgdG8gdGhlIHN0cnVjdAogICAgbmV3T3ZlcmxheShwYW5lLCBuYW1lLCB0eXBlLCBzcGVjcykgewogICAgICB2YXIgX2EsIF9iLCBfYzsKICAgICAgaWYgKCFwYW5lLm92ZXJsYXlzKQogICAgICAgIHBhbmUub3ZlcmxheXMgPSBbXTsKICAgICAgbGV0IG92ID0gewogICAgICAgIG5hbWU6IChfYSA9IHNwZWNzLm5hbWUpICE9IG51bGwgPyBfYSA6IG5hbWUsCiAgICAgICAgdHlwZSwKICAgICAgICBzZXR0aW5nczogKF9iID0gc3BlY3Muc2V0dGluZ3MpICE9IG51bGwgPyBfYiA6IHt9LAogICAgICAgIHByb3BzOiAoX2MgPSBzcGVjcy5wcm9wcykgIT0gbnVsbCA/IF9jIDoge30sCiAgICAgICAgdXVpZDogVXRpbHMudXVpZDMoKSwKICAgICAgICBwcm9kOiB0aGlzLnNjcmlwdElkLAogICAgICAgIGRhdGE6IFtdCiAgICAgIH07CiAgICAgIHBhbmUub3ZlcmxheXMucHVzaChvdik7CiAgICAgIHJldHVybiBvdjsKICAgIH0KICAgIC8vIEFkZCBuZXcgdmFsdWUgdG8gb3ZlcmxheSdzIGRhdGEKICAgIGFkZE5ld1ZhbHVlKG92LCB4KSB7CiAgICAgIGxldCBvZmYgPSAwOwogICAgICBpZiAoeCAmJiB4Ll9faWRfXykgewogICAgICAgIG9mZiA9IHguX19vZmZzZXRfXyB8fCAwOwogICAgICAgIHggPSB4WzBdOwogICAgICB9CiAgICAgIGlmIChBcnJheS5pc0FycmF5KHgpICYmIHhbMF0gJiYgeFswXS5fX2lkX18pIHsKICAgICAgICBvZmYgPSB4WzBdLl9fb2Zmc2V0X18gfHwgMDsKICAgICAgICB4ID0geC5tYXAoKHgyKSA9PiB4MlswXSk7CiAgICAgIH0KICAgICAgb2ZmICo9IHNlLnRmOwogICAgICBsZXQgdiA9IEFycmF5LmlzQXJyYXkoeCkgPyBbc2UudCArIG9mZiwgLi4ueF0gOiBbc2UudCArIG9mZiwgeF07CiAgICAgIHVwZGF0ZShvdi5kYXRhLCB2KTsKICAgIH0KICAgIGNyZWF0ZVBhbmUoKSB7CiAgICB9CiAgfQogIGNvbnN0IEZERUZTMSA9IC8oZnVuY3Rpb24gfCkoWyRBLVpfXVswLTlBLVpfJFwuXSopW1xzXSo/XCgoLio/XHMqKVwpL21pOwogIGNvbnN0IEZERUZTMiA9IC8oZnVuY3Rpb24gfCkoWyRBLVpfXVswLTlBLVpfJFwuXSopW1xzXSo/XCgoLipccyopXCkvZ21pczsKICBjb25zdCBERUZfTElNSVQkMSA9IDU7CiAgY2xhc3MgU2NyaXB0RW52IHsKICAgIGNvbnN0cnVjdG9yKHMsIGRhdGEpIHsKICAgICAgdGhpcy5zdGQgPSBzZS5zdGRfaW5qZWN0KG5ldyBTY3JpcHRTdGQodGhpcykpOwogICAgICB0aGlzLmlkID0gcy51dWlkOwogICAgICB0aGlzLnNyYyA9IHM7CiAgICAgIHRoaXMub3V0cHV0ID0ge307CiAgICAgIHRoaXMuZGF0YSA9IFtdOwogICAgICB0aGlzLnRzcyA9IHt9OwogICAgICB0aGlzLnN5bXMgPSB7fTsKICAgICAgdGhpcy52aWV3cyA9IHt9OwogICAgICB0aGlzLnNoYXJlZCA9IGRhdGE7CiAgICAgIHRoaXMub3V0cHV0LmJveF9tYWtlciA9IHRoaXMubWFrZV9ib3goKTsKICAgICAgdGhpcy5wYW5lID0gbmV3IFBhbmUodGhpcyk7CiAgICB9CiAgICBidWlsZCgpIHsKICAgICAgdGhpcy5vdXRwdXQuYm94X21ha2VyKHRoaXMsIHRoaXMuc2hhcmVkLCBzZSk7CiAgICAgIGRlbGV0ZSB0aGlzLm91dHB1dC5ib3hfbWFrZXI7CiAgICB9CiAgICBpbml0KCkgewogICAgICB0aGlzLm91dHB1dC5pbml0KCk7CiAgICB9CiAgICBzdGVwKHVuc2hpZnQgPSB0cnVlKSB7CiAgICAgIGlmICh1bnNoaWZ0KQogICAgICAgIHRoaXMudW5zaGlmdCgpOwogICAgICB0aGlzLm91dHB1dC51cGRhdGUoKTsKICAgICAgdGhpcy5saW1pdCgpOwogICAgfQogICAgdW5zaGlmdCgpIHsKICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy50c3MpIHsKICAgICAgICBpZiAodGhpcy50c3NbaWRdLl9fdGZfXykKICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIHRoaXMudHNzW2lkXS51bnNoaWZ0KHZvaWQgMCk7CiAgICAgIH0KICAgIH0KICAgIC8vIExpbWl0IGVudi5vdXRwdXQgbGVuZ3RoCiAgICBsaW1pdCgpIHsKICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy50c3MpIHsKICAgICAgICBsZXQgdHMgPSB0aGlzLnRzc1tpZF07CiAgICAgICAgdHMubGVuZ3RoID0gdHMuX19sZW5fXyB8fCBERUZfTElNSVQkMTsKICAgICAgfQogICAgfQogICAgLy8gQSBzbWFsbCBzYW5kYm94IGZvciBhIHBhcnRpY3VsYXIgc2NyaXB0CiAgICAvLyBUT0RPOiBhZGQgc3VwcG9ydCBvZiAnU291cmNlJyBwcm9wIHR5cGUgKG9wZW4sIGhpZ2gsIGhsMiAuLi4pCiAgICBtYWtlX2JveCgpIHsKICAgICAgbGV0IGNvZGUgPSB0aGlzLnNyYy5jb2RlOwogICAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcy5zdGQpOwogICAgICBsZXQgc3RkID0gYGA7CiAgICAgIGZvciAodmFyIGsgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pKSB7CiAgICAgICAgaWYgKGsgPT09ICJjb25zdHJ1Y3RvciIpCiAgICAgICAgICBjb250aW51ZTsKICAgICAgICBzdGQgKz0gYGNvbnN0IHN0ZF8ke2t9ID0gc2VsZi5zdGQuJHtrfS5iaW5kKHNlbGYuc3RkKQpgOwogICAgICB9CiAgICAgIGxldCB0c3MgPSBgYDsKICAgICAgZm9yICh2YXIgayBpbiB0aGlzLnNoYXJlZCkgewogICAgICAgIGlmICh0aGlzLnNoYXJlZFtrXSAmJiB0aGlzLnNoYXJlZFtrXS5fX2lkX18pIHsKICAgICAgICAgIHRzcyArPSBgY29uc3QgJHtrfSA9IHNoYXJlZC4ke2t9CmA7CiAgICAgICAgfQogICAgICB9CiAgICAgIGxldCBkc3MgPSBgYDsKICAgICAgdHJ5IHsKICAgICAgICByZXR1cm4gRnVuY3Rpb24oInNlbGYsc2hhcmVkLHNlIiwgYAogICAgICAgICAgICAgICAgJ3VzZSBzdHJpY3QnOwoKICAgICAgICAgICAgICAgIC8vIEJ1aWx0LWluIGZ1bmN0aW9ucyAoYWxpYXNlcykKICAgICAgICAgICAgICAgICR7c3RkfQoKICAgICAgICAgICAgICAgIC8vIE1vZHVsZXMgKEFQSSAvIGludGVyZmFjZXMpCiAgICAgICAgICAgICAgICAke3RoaXMubWFrZV9tb2R1bGVzKCl9CgogICAgICAgICAgICAgICAgLy8gVGltZXNlcmllcwogICAgICAgICAgICAgICAgJHt0c3N9CgogICAgICAgICAgICAgICAgLy8gRGlyZWN0IGRhdGEgdHMKICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBzZWxmLmRhdGEKICAgICAgICAgICAgICAgIGNvbnN0IG9obGN2ID0gc2hhcmVkLmRzcy5vaGxjdi5kYXRhCiAgICAgICAgICAgICAgICAke2Rzc30KCiAgICAgICAgICAgICAgICAvLyBTY3JpcHQncyBwcm9wZXJ0aWVzIChpbml0KQogICAgICAgICAgICAgICAgY29uc3QgJHByb3BzID0gc2VsZi5zcmMucHJvcHMKCiAgICAgICAgICAgICAgICAvLyBHbG9iYWxzCiAgICAgICAgICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHNlbGYuc3JjLnNldHRpbmdzCiAgICAgICAgICAgICAgICBjb25zdCB0ZiA9IHNoYXJlZC50ZgogICAgICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSBzaGFyZWQucmFuZ2UKICAgICAgICAgICAgICAgIGNvbnN0IHBhbmUgPSBzZWxmLnBhbmUKCiAgICAgICAgICAgICAgICB0aGlzLmluaXQgPSAoX2lkID0gJ3Jvb3QnKSA9PiB7CiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLnByZXAoY29kZS5pbml0KX0KICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSA9IChfaWQgPSAncm9vdCcpID0+IHsKICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gc2hhcmVkLnQoKQogICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZXIgPSBzaGFyZWQuaXRlcigpCiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLnByZXAoY29kZS51cGRhdGUpfQogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgIHRoaXMucG9zdCA9IChfaWQgPSAncm9vdCcpID0+IHsKICAgICAgICAgICAgICAgICAgICAke3RoaXMucHJlcChjb2RlLnBvc3QpfQogICAgICAgICAgICAgICAgfQogICAgICAgICAgICBgKTsKICAgICAgfSBjYXRjaCAoZSkgewogICAgICAgIGNvbnNvbGUubG9nKGUpOwogICAgICAgIHJldHVybiBGdW5jdGlvbigic2VsZixzaGFyZWQiLCBgCiAgICAgICAgICAgICAgICAndXNlIHN0cmljdCc7CiAgICAgICAgICAgICAgICB0aGlzLmluaXQgPSAoKSA9PiB7fQogICAgICAgICAgICAgICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7fQogICAgICAgICAgICAgICAgdGhpcy5wb3N0ID0gKCkgPT4ge30KICAgICAgICAgICAgYCk7CiAgICAgIH0KICAgIH0KICAgIC8vIE1ha2UgZGVmaW5pdGlvbnMgZm9yIG1vZHVsZXMKICAgIG1ha2VfbW9kdWxlcygpIHsKICAgICAgbGV0IHMgPSBgYDsKICAgICAgZm9yICh2YXIgaWQgaW4gc2UubW9kcykgewogICAgICAgIGlmICghc2UubW9kc1tpZF0uYXBpKQogICAgICAgICAgY29udGludWU7CiAgICAgICAgcyArPSBgY29uc3QgJHtpZH0gPSBzZS5tb2RzWycke2lkfSddLmFwaVtzZWxmLmlkXWA7CiAgICAgICAgcyArPSAiXG4iOwogICAgICB9CiAgICAgIHJldHVybiBzOwogICAgfQogICAgLy8gUHJlcHJvY2VzcyB0aGUgdXBkYXRlIGZ1bmN0aW9uLgogICAgLy8gUmVwbGFjZSBmdW5jdGlvbnMgd2l0aCB0aGUgZnVsbCBhcmd1bWVudHMgbGlzdCArCiAgICAvLyBnZW5lcmF0ZSAmIGFkZCB0c2lkCiAgICAvLyBUT0RPOiBpbXBsZW1lbnQgcmVjdXJzaXZlIHByZXBwaW5nICh3aXRoIGpzIHN5bnRheCBwYXJzZXIpCiAgICBwcmVwKHNyYykgewogICAgICBsZXQgaCA9IHRoaXMuc3JjLnR5cGU7CiAgICAgIHNyYyA9ICIJCSAgbGV0IF9wcmVmID0gYCR7X2lkfTwtIiArIGggKyAiPC1gXG4iICsgc3JjOwogICAgICBGREVGUzIubGFzdEluZGV4ID0gMDsKICAgICAgbGV0IGNhbGxfaWQgPSAwOwogICAgICBsZXQgcHJlZmFicyA9IHNlbGYuc2NyaXB0TGliLnByZWZhYnM7CiAgICAgIGRvIHsKICAgICAgICB2YXIgbSA9IEZERUZTMi5leGVjKHNyYyk7CiAgICAgICAgaWYgKG0pIHsKICAgICAgICAgIGxldCBma2V5d29yZCA9IG1bMV0udHJpbSgpOwogICAgICAgICAgbGV0IGZuYW1lID0gbVsyXTsKICAgICAgICAgIG1bM107CiAgICAgICAgICBpZiAoZmtleXdvcmQgPT09ICJmdW5jdGlvbiIpCiAgICAgICAgICAgIDsKICAgICAgICAgIGVsc2UgewogICAgICAgICAgICBsZXQgb2ZmID0gbS5pbmRleCArIG1bMF0uaW5kZXhPZigiKCIpOwogICAgICAgICAgICBsZXQgaTEgPSBtLmluZGV4OwogICAgICAgICAgICBsZXQgbTAgPSB0aGlzLnBhcmVudGhlc2VzKG1bMF0pOwogICAgICAgICAgICBsZXQgaTIgPSBtLmluZGV4ICsgbTAubGVuZ3RoOwogICAgICAgICAgICBsZXQgYXJnczIgPSB0aGlzLmFyZ3MyKG1bMF0pOwogICAgICAgICAgICBpZiAodGhpcy5zdGRbZm5hbWVdKSB7CiAgICAgICAgICAgICAgc3JjID0gdGhpcy5wb3N0Zml4KHNyYywgbSwgKytjYWxsX2lkKTsKICAgICAgICAgICAgICBvZmYgKz0gNDsKICAgICAgICAgICAgfSBlbHNlIGlmIChmbmFtZSBpbiBwcmVmYWJzKSB7CiAgICAgICAgICAgICAgb2ZmICs9IDEwOwogICAgICAgICAgICAgIGxldCB1dHNpZCA9IGBfcHJlZisiZiR7KytjYWxsX2lkfSJgOwogICAgICAgICAgICAgIHNyYyA9IHRoaXMucmVwbGFjZSgKICAgICAgICAgICAgICAgIHNyYywKICAgICAgICAgICAgICAgIGBwYW5lLnNlbGYuJHtmbmFtZX0oJHthcmdzMn0sICR7dXRzaWR9KWAsCiAgICAgICAgICAgICAgICBpMSwKICAgICAgICAgICAgICAgIGkyCiAgICAgICAgICAgICAgKTsKICAgICAgICAgICAgfSBlbHNlIGlmIChmbmFtZS5zbGljZSgwLCA0KSA9PT0gInBhbmUiICYmIGZuYW1lLnNwbGl0KCIuIikucG9wKCkgaW4gcHJlZmFicykgewogICAgICAgICAgICAgIGxldCB1dHNpZCA9IGBfcHJlZisiZiR7KytjYWxsX2lkfSJgOwogICAgICAgICAgICAgIHNyYyA9IHRoaXMucmVwbGFjZSgKICAgICAgICAgICAgICAgIHNyYywKICAgICAgICAgICAgICAgIGAke2ZuYW1lfSgke2FyZ3MyfSwgJHt1dHNpZH0pYCwKICAgICAgICAgICAgICAgIGkxLAogICAgICAgICAgICAgICAgaTIKICAgICAgICAgICAgICApOwogICAgICAgICAgICB9CiAgICAgICAgICAgIEZERUZTMi5sYXN0SW5kZXggPSBvZmY7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IHdoaWxlIChtKTsKICAgICAgcmV0dXJuIHdyYXBfaWR4cyhzcmMsICJzdGRfIik7CiAgICB9CiAgICAvLyBQb3N0Zml4IGZ1bmN0aW9uIGNhbGxzIHdpdGggdHMgX2lkcwogICAgcG9zdGZpeChzcmMsIG0sIGNhbGxfaWQpIHsKICAgICAgbGV0IHRhcmdldCA9IHRoaXMuZ2V0X2FyZ3ModGhpcy5mZGVmKG1bMl0pKS5sZW5ndGg7CiAgICAgIGxldCBtMCA9IHRoaXMucGFyZW50aGVzZXMobVswXSk7CiAgICAgIGxldCBhcmdzID0gdGhpcy5nZXRfYXJnc18yKG0wKTsKICAgICAgZm9yICh2YXIgaSA9IGFyZ3MubGVuZ3RoOyBpIDwgdGFyZ2V0OyBpKyspIHsKICAgICAgICBhcmdzLnB1c2goInZvaWQgMCIpOwogICAgICB9CiAgICAgIGFyZ3MucHVzaChgX3ByZWYrImYke2NhbGxfaWR9ImApOwogICAgICByZXR1cm4gc3JjLnJlcGxhY2UobTAsIGBzdGRfJHttWzJdfSgke2FyZ3Muam9pbigiLCAiKX0pYCk7CiAgICB9CiAgICAvLyBJbnNlcnQgc3RyaW5nIGludG8gdGV4dAogICAgcmVwbGFjZShzcmMsIHN0ciwgaTEsIGkyKSB7CiAgICAgIHJldHVybiBbc3JjLnNsaWNlKDAsIGkxKSwgc3RyLCBzcmMuc2xpY2UoaTIpXS5qb2luKCIiKTsKICAgIH0KICAgIHBhcmVudGhlc2VzKHN0cikgewogICAgICB2YXIgY291bnQgPSAwLCBmaXJzdCA9IGZhbHNlOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykgewogICAgICAgIGlmIChzdHJbaV0gPT09ICIoIikgewogICAgICAgICAgY291bnQrKzsKICAgICAgICAgIGZpcnN0ID0gdHJ1ZTsKICAgICAgICB9IGVsc2UgaWYgKHN0cltpXSA9PT0gIikiKSB7CiAgICAgICAgICBjb3VudC0tOwogICAgICAgIH0KICAgICAgICBpZiAoZmlyc3QgJiYgY291bnQgPT09IDApIHsKICAgICAgICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIGkgKyAxKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHN0cjsKICAgIH0KICAgIGFyZ3MyKHN0cikgewogICAgICB2YXIgY291bnQgPSAwLCBmaXJzdCA9IGZhbHNlOwogICAgICB2YXIgaTEgPSAwOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykgewogICAgICAgIGlmIChzdHJbaV0gPT09ICIoIikgewogICAgICAgICAgY291bnQrKzsKICAgICAgICAgIGlmICghZmlyc3QpCiAgICAgICAgICAgIGkxID0gaSArIDE7CiAgICAgICAgICBmaXJzdCA9IHRydWU7CiAgICAgICAgfSBlbHNlIGlmIChzdHJbaV0gPT09ICIpIikgewogICAgICAgICAgY291bnQtLTsKICAgICAgICB9CiAgICAgICAgaWYgKGZpcnN0ICYmIGNvdW50ID09PSAwKSB7CiAgICAgICAgICByZXR1cm4gc3RyLnN1YnN0cmluZyhpMSwgaSk7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBzdHI7CiAgICB9CiAgICAvLyBHZXQgdGhlIGZ1bmN0aW9uIGRlZmluaXRpb24KICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IG9mIG1vZHVsZXMKICAgIGZkZWYoZm5hbWUpIHsKICAgICAgcmV0dXJuIHRoaXMuc3RkW2ZuYW1lXS50b1N0cmluZygpOwogICAgfQogICAgLy8gR2V0IGFyZ3MgaW4gdGhlIGZ1bmN0aW9uJ3MgZGVmaW5pdGlvbgogICAgZ2V0X2FyZ3Moc3JjKSB7CiAgICAgIGxldCByZWcgPSB0aGlzLnJlZ2V4X2Nsb25lKEZERUZTMSk7CiAgICAgIHJlZy5sYXN0SW5kZXggPSAwOwogICAgICBsZXQgbSA9IHJlZy5leGVjKHNyYyk7CiAgICAgIGlmICghbVszXS50cmltKCkubGVuZ3RoKQogICAgICAgIHJldHVybiBbXTsKICAgICAgbGV0IGFyciA9IG1bM10uc3BsaXQoIiwiKS5tYXAoKHgpID0+IHgudHJpbSgpKS5maWx0ZXIoKHgpID0+IHggIT09ICJfaWQiICYmIHggIT09ICJfdGYiKTsKICAgICAgcmV0dXJuIGFycjsKICAgIH0KICAgIGdldF9hcmdzXzIoc3RyKSB7CiAgICAgIGxldCBwYXJ0cyA9IFtdOwogICAgICBsZXQgYyA9IDA7CiAgICAgIGxldCBzID0gMDsKICAgICAgdmFyIHExID0gZmFsc2UsIHEyID0gZmFsc2UsIHEzID0gZmFsc2U7CiAgICAgIGxldCBwYXJ0OwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykgewogICAgICAgIGlmIChzdHJbaV0gPT09ICIoIikgewogICAgICAgICAgYysrOwogICAgICAgICAgaWYgKCFwYXJ0KQogICAgICAgICAgICBwYXJ0ID0gW2kgKyAxXTsKICAgICAgICB9CiAgICAgICAgaWYgKHN0cltpXSA9PT0gIikiKQogICAgICAgICAgYy0tOwogICAgICAgIGlmIChzdHJbaV0gPT09ICJbIikKICAgICAgICAgIHMrKzsKICAgICAgICBpZiAoc3RyW2ldID09PSAiXSIpCiAgICAgICAgICBzLS07CiAgICAgICAgaWYgKHN0cltpXSA9PT0gIiciKQogICAgICAgICAgcTEgPSAhcTE7CiAgICAgICAgaWYgKHN0cltpXSA9PT0gJyInKQogICAgICAgICAgcTIgPSAhcTI7CiAgICAgICAgaWYgKHN0cltpXSA9PT0gImAiKQogICAgICAgICAgcTMgPSAhcTM7CiAgICAgICAgaWYgKHN0cltpXSA9PT0gIiwiICYmIGMgPT09IDEgJiYgIXMgJiYgIXExICYmICFxMiAmJiAhcTMpIHsKICAgICAgICAgIGlmIChwYXJ0KSB7CiAgICAgICAgICAgIHBhcnRbMV0gPSBpOwogICAgICAgICAgICBwYXJ0cy5wdXNoKHBhcnQpOwogICAgICAgICAgICBwYXJ0ID0gW2kgKyAxXTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgaWYgKGMgPT09IDAgJiYgcGFydCkgewogICAgICAgICAgcGFydFsxXSA9IGk7CiAgICAgICAgICBwYXJ0cy5wdXNoKHBhcnQpOwogICAgICAgICAgcGFydCA9IG51bGw7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBwYXJ0cy5tYXAoKHgpID0+IHN0ci5zbGljZSguLi54KSkuZmlsdGVyKCh4KSA9PiAvW15cc10rLy5leGVjKHgpKTsKICAgIH0KICAgIHJlZ2V4X2Nsb25lKHJleCkgewogICAgICByZXR1cm4gbmV3IFJlZ0V4cChyZXguc291cmNlLCByZXguZmxhZ3MpOwogICAgfQogICAgc2VuZF9tb2RpZnkodXBkKSB7CiAgICAgIHNlLnNlbmQoIm1vZGlmeS1vdmVybGF5IiwgewogICAgICAgIHV1aWQ6IHRoaXMuaWQsCiAgICAgICAgZmllbGRzOiB1cGQKICAgICAgfSk7CiAgICB9CiAgfQogIGNvbnN0IFNZTVRGID0gLyhvcGVufGhpZ2h8bG93fGNsb3NlfHZvbCkoXGQrKShcdyopL2dtOwogIGNvbnN0IEZOU1REID0gLyhhP3RyfGtjdz98ZG1pfHNhcnxzdXBlcnRyZW5kfHdwcikoXGQrP1x3KilccypcKC9nbTsKICBjb25zdCBTWU1TVEQgPSAvKD86aGwyfGhsYzN8b2hsYzQpL2dtOwogIHZhciBzeW1zdGQgPSB7CiAgICBwYXJzZShzKSB7CiAgICAgIGxldCBzcyA9IHMuY29kZTsKICAgICAgbGV0IGFsbCA9IGAke3NzLmluaXR9CiR7c3MudXBkYXRlfQoke3NzLnBvc3R9YDsKICAgICAgU1lNVEYubGFzdEluZGV4ID0gMDsKICAgICAgRk5TVEQubGFzdEluZGV4ID0gMDsKICAgICAgU1lNU1RELmxhc3RJbmRleCA9IDA7CiAgICAgIGRvIHsKICAgICAgICB2YXIgbSA9IFNZTVRGLmV4ZWMoYWxsKTsKICAgICAgICBpZiAobSkgewogICAgICAgICAgaWYgKG1bMF0gaW4gc2UudHNzKQogICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgIGxldCB0cyA9IHNlLnRzc1ttWzBdXSA9IFRTKG1bMF0sIFtdKTsKICAgICAgICAgIHRzLl9fdGZfXyA9IHRmX2Zyb21fcGFpcihtWzJdLCBtWzNdKTsKICAgICAgICAgIHRzLl9fZm5fXyA9IFNhbXBsZXIobVsxXSwgdHJ1ZSkuYmluZCh0cyk7CiAgICAgICAgfQogICAgICB9IHdoaWxlIChtKTsKICAgICAgZG8gewogICAgICAgIHZhciBtID0gU1lNU1RELmV4ZWMoYWxsKTsKICAgICAgICBpZiAobSkgewogICAgICAgICAgaWYgKG1bMF0gaW4gc2UudHNzKQogICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgIHRoaXMucGFyc2VfdHNfc3ltKG1bMF0pOwogICAgICAgIH0KICAgICAgfSB3aGlsZSAobSk7CiAgICAgIGRvIHsKICAgICAgICB2YXIgbSA9IEZOU1RELmV4ZWMoYWxsKTsKICAgICAgICBpZiAobSkgewogICAgICAgICAgbGV0IGZuID0gbVsxXSArIG1bMl07CiAgICAgICAgICBsZXQgdGYgPSBtWzJdOwogICAgICAgICAgaWYgKGZuIGluIHNlLnN0ZF9wbHVzKQogICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgIHN3aXRjaCAobVsxXSkgewogICAgICAgICAgICBjYXNlICJ0ciI6CiAgICAgICAgICAgICAgdGhpcy5kZXBzKFsiaGlnaCIsICJsb3ciLCAiY2xvc2UiXSwgbVsyXSk7CiAgICAgICAgICAgICAgc2Uuc3RkX3BsdXNbZm5dID0gZnVuY3Rpb24oZml4bmFuID0gZmFsc2UsIF9pZCkgewogICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHIoZml4bmFuLCBfaWQsIHRmKTsKICAgICAgICAgICAgICB9OwogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICBjYXNlICJhdHIiOgogICAgICAgICAgICAgIHRoaXMuZGVwcyhbImhpZ2giLCAibG93IiwgImNsb3NlIl0sIG1bMl0pOwogICAgICAgICAgICAgIHNlLnN0ZF9wbHVzW2ZuXSA9IGZ1bmN0aW9uKGxlbiwgX2lkKSB7CiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHIobGVuLCBfaWQsIHRmKTsKICAgICAgICAgICAgICB9OwogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICBjYXNlICJrYyI6CiAgICAgICAgICAgICAgdGhpcy5kZXBzKFsiaGlnaCIsICJsb3ciLCAiY2xvc2UiXSwgbVsyXSk7CiAgICAgICAgICAgICAgc2Uuc3RkX3BsdXNbZm5dID0gZnVuY3Rpb24oc3JjLCBsZW4sIG11bHQsIHVzZV90ciA9IHRydWUsIF9pZCkgewogICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMua2Moc3JjLCBsZW4sIG11bHQsIHVzZV90ciwgX2lkLCB0Zik7CiAgICAgICAgICAgICAgfTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgY2FzZSAia2N3IjoKICAgICAgICAgICAgICB0aGlzLmRlcHMoWyJoaWdoIiwgImxvdyIsICJjbG9zZSJdLCBtWzJdKTsKICAgICAgICAgICAgICBzZS5zdGRfcGx1c1tmbl0gPSBmdW5jdGlvbihzcmMsIGxlbiwgbXVsdCwgdXNlX3RyID0gdHJ1ZSwgX2lkKSB7CiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5rY3coc3JjLCBsZW4sIG11bHQsIHVzZV90ciwgX2lkLCB0Zik7CiAgICAgICAgICAgICAgfTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgY2FzZSAiZG1pIjoKICAgICAgICAgICAgICB0aGlzLmRlcHMoWyJoaWdoIiwgImxvdyIsICJjbG9zZSJdLCBtWzJdKTsKICAgICAgICAgICAgICBzZS5zdGRfcGx1c1tmbl0gPSBmdW5jdGlvbihsZW4sIHNtb290aCwgX2lkKSB7CiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kbWkobGVuLCBzbW9vdGgsIF9pZCwgdGYpOwogICAgICAgICAgICAgIH07CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIGNhc2UgInNhciI6CiAgICAgICAgICAgICAgdGhpcy5kZXBzKFsiaGlnaCIsICJsb3ciLCAiY2xvc2UiXSwgbVsyXSk7CiAgICAgICAgICAgICAgc2Uuc3RkX3BsdXNbZm5dID0gZnVuY3Rpb24oc3RhcnQsIGluYywgbWF4LCBfaWQpIHsKICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNhcihzdGFydCwgaW5jLCBtYXgsIF9pZCwgdGYpOwogICAgICAgICAgICAgIH07CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIGNhc2UgInN1cGVydHJlbmQiOgogICAgICAgICAgICAgIHRoaXMuZGVwcyhbImhpZ2giLCAibG93IiwgImNsb3NlIl0sIG1bMl0pOwogICAgICAgICAgICAgIHNlLnN0ZF9wbHVzW2ZuXSA9IGZ1bmN0aW9uKGZhY3RvciwgYXRybGVuLCBfaWQpIHsKICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN1cGVydHJlbmQoZmFjdG9yLCBhdHJsZW4sIF9pZCwgdGYpOwogICAgICAgICAgICAgIH07CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIGNhc2UgIndwciI6CiAgICAgICAgICAgICAgdGhpcy5kZXBzKFsiaGlnaCIsICJsb3ciLCAiY2xvc2UiXSwgbVsyXSk7CiAgICAgICAgICAgICAgc2Uuc3RkX3BsdXNbZm5dID0gZnVuY3Rpb24obGVuLCBfaWQpIHsKICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndwcihsZW4sIF9pZCwgdGYpOwogICAgICAgICAgICAgIH07CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IHdoaWxlIChtKTsKICAgIH0sCiAgICBwYXJzZV90c19zeW0oc3ltLCB0ZikgewogICAgICBzd2l0Y2ggKHN5bSkgewogICAgICAgIGNhc2UgImhsMiI6CiAgICAgICAgICBzZS50c3NbImhsMiJdID0gVFMoImhsMiIsIFtdKTsKICAgICAgICAgIHNlLnRzc1siaGwyIl0uX19mbl9fID0gKCkgPT4gewogICAgICAgICAgICByZXR1cm4gKHNlLmhpZ2hbMF0gKyBzZS5sb3dbMF0pICogMC41OwogICAgICAgICAgfTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgImhsYzMiOgogICAgICAgICAgc2UudHNzWyJobGMzIl0gPSBUUygiaGxjMyIsIFtdKTsKICAgICAgICAgIHNlLnRzc1siaGxjMyJdLl9fZm5fXyA9ICgpID0+IHsKICAgICAgICAgICAgcmV0dXJuIChzZS5oaWdoWzBdICsgc2UubG93WzBdICsgc2UuY2xvc2VbMF0pIC8gMzsKICAgICAgICAgIH07CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJvaGxjNCI6CiAgICAgICAgICBzZS50c3NbIm9obGM0Il0gPSBUUygib2hsYzQiLCBbXSk7CiAgICAgICAgICBzZS50c3NbIm9obGM0Il0uX19mbl9fID0gKCkgPT4gewogICAgICAgICAgICByZXR1cm4gKHNlLm9wZW5bMF0gKyBzZS5oaWdoWzBdICsgc2UubG93WzBdICsgc2UuY2xvc2VbMF0pICogMC4yNTsKICAgICAgICAgIH07CiAgICAgICAgICBicmVhazsKICAgICAgfQogICAgfSwKICAgIGRlcHModHlwZXMsIHRmKSB7CiAgICAgIGZvciAodmFyIHR5cGUgb2YgdHlwZXMpIHsKICAgICAgICBsZXQgc3ltID0gdHlwZSArIHRmOwogICAgICAgIGlmIChzeW0gaW4gc2UudHNzKQogICAgICAgICAgY29udGludWU7CiAgICAgICAgbGV0IHRzID0gc2UudHNzW3N5bV0gPSBUUyhzeW0sIFtdKTsKICAgICAgICB0cy5fX3RmX18gPSB0Zl9mcm9tX3N0cih0Zik7CiAgICAgICAgdHMuX19mbl9fID0gU2FtcGxlcih0eXBlLCB0cnVlKS5iaW5kKHRzKTsKICAgICAgfQogICAgfQogIH07CiAgY29uc3QgREVGX0xJTUlUID0gNTsKICBjbGFzcyBTY3JpcHRFbmdpbmUgewogICAgY29uc3RydWN0b3IoKSB7CiAgICAgIHRoaXMubWFwID0ge307CiAgICAgIHRoaXMuZGF0YSA9IHt9OwogICAgICB0aGlzLnF1ZXVlID0gW107CiAgICAgIHRoaXMuZGVsdGFfcXVldWUgPSBbXTsKICAgICAgdGhpcy51cGRhdGVfcXVldWUgPSBbXTsKICAgICAgdGhpcy5zZXR0ID0ge307CiAgICAgIHRoaXMuc3RhdGUgPSB7fTsKICAgICAgdGhpcy5tb2RzID0ge307CiAgICAgIHRoaXMuc3RkX3BsdXMgPSB7fTsKICAgICAgdGhpcy50ZiA9IHZvaWQgMDsKICAgIH0KICAgIGFzeW5jIGV4ZWNfYWxsKCkgewogICAgICBpZiAoIXRoaXMuZGF0YS5vaGxjdikKICAgICAgICByZXR1cm47CiAgICAgIHRoaXMubWFwID0gdGhpcy5zdHJ1Y3RfdG9fbWFwKHNlbGYucGFuZVN0cnVjdCk7CiAgICAgIGlmICghdGhpcy5pbml0X3N0YXRlKCkpCiAgICAgICAgcmV0dXJuOwogICAgICB0aGlzLmluaXRfbWFwKCk7CiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLm1hcCkubGVuZ3RoKSB7CiAgICAgICAgYXdhaXQgdGhpcy5ydW4oKTsKICAgICAgICB0aGlzLmRyYWluX3F1ZXVlcygpOwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMuc2VuZCgib3ZlcmxheS1kYXRhIiwgdGhpcy5mb3JtYXRfZGF0YSgpKTsKICAgICAgfQogICAgICB0aGlzLnNlbmRfc3RhdGUoKTsKICAgIH0KICAgIC8vIEV4ZWMgc2VsZWN0ZWQKICAgIGFzeW5jIGV4ZWNfc2VsKGRlbHRhKSB7CiAgICAgIGlmICghdGhpcy5kYXRhLm9obGN2KQogICAgICAgIHJldHVybjsKICAgICAgbGV0IHNlbCA9IE9iamVjdC5rZXlzKGRlbHRhKS5maWx0ZXIoKHgpID0+IHggaW4gdGhpcy5tYXApOwogICAgICBpZiAoIXRoaXMuaW5pdF9zdGF0ZShzZWwpKSB7CiAgICAgICAgdGhpcy5kZWx0YV9xdWV1ZS5wdXNoKGRlbHRhKTsKICAgICAgICByZXR1cm47CiAgICAgIH0KICAgICAgZm9yICh2YXIgaWQgaW4gZGVsdGEpIHsKICAgICAgICBpZiAoIXRoaXMubWFwW2lkXSkKICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIGxldCBwcm9wcyA9IHRoaXMubWFwW2lkXS5zcmMucHJvcHMgfHwge307CiAgICAgICAgZm9yICh2YXIgayBpbiBwcm9wcykgewogICAgICAgICAgaWYgKGsgaW4gZGVsdGFbaWRdKSB7CiAgICAgICAgICAgIHByb3BzW2tdLnZhbCA9IGRlbHRhW2lkXVtrXTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgdGhpcy5hZGRfc2NyaXB0KHRoaXMubWFwW2lkXSk7CiAgICAgIH0KICAgICAgYXdhaXQgdGhpcy5ydW4oc2VsKTsKICAgICAgdGhpcy5kcmFpbl9xdWV1ZXMoKTsKICAgICAgdGhpcy5zZW5kX3N0YXRlKCk7CiAgICB9CiAgICAvLyBBZGQgc2NyaXB0IChjcmVhdGUgYSBuZXcgU2NyaXB0RW52LCBhZGQgdG8gdGhlIG1hcCkKICAgIGFkZF9zY3JpcHQocykgewogICAgICBsZXQgc2NyaXB0ID0gc2VsZi5zY3JpcHRMaWIuaVNjcmlwdHNbcy50eXBlXTsKICAgICAgaWYgKCFzY3JpcHQpIHsKICAgICAgICBkZWxldGUgdGhpcy5tYXBbcy51dWlkXTsKICAgICAgICByZXR1cm4gY29uc29sZS5sb2coIlVua25vd24gc2NyaXB0OiAiLCBzLnR5cGUpOwogICAgICB9CiAgICAgIHMuY29kZSA9IHsKICAgICAgICBpbml0OiBzY3JpcHQuY29kZS5pbml0IHx8ICIiLAogICAgICAgIHVwZGF0ZTogc2NyaXB0LmNvZGUudXBkYXRlIHx8ICIiLAogICAgICAgIHBvc3Q6IHNjcmlwdC5jb2RlLnBvc3QgfHwgIiIKICAgICAgfTsKICAgICAgc3ltc3RkLnBhcnNlKHMpOwogICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLm1vZHMpIHsKICAgICAgICBpZiAodGhpcy5tb2RzW2lkXS5wcmVfZW52KSB7CiAgICAgICAgICB0aGlzLm1vZHNbaWRdLnByZV9lbnYocy51dWlkLCBzKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcy5lbnYgPSBuZXcgU2NyaXB0RW52KHMsIE9iamVjdC5hc3NpZ24odGhpcy5zaGFyZWQsIHsKICAgICAgICBvcGVuOiB0aGlzLm9wZW4sCiAgICAgICAgaGlnaDogdGhpcy5oaWdoLAogICAgICAgIGxvdzogdGhpcy5sb3csCiAgICAgICAgY2xvc2U6IHRoaXMuY2xvc2UsCiAgICAgICAgdm9sOiB0aGlzLnZvbCwKICAgICAgICBkc3M6IHRoaXMuZGF0YSwKICAgICAgICB0OiAoKSA9PiB0aGlzLnQsCiAgICAgICAgaXRlcjogKCkgPT4gdGhpcy5pdGVyLAogICAgICAgIHRmOiB0aGlzLnRmLAogICAgICAgIHJhbmdlOiB0aGlzLnJhbmdlLAogICAgICAgIG9uY2xvc2U6IHRydWUKICAgICAgfSwgdGhpcy50c3MpKTsKICAgICAgdGhpcy5tYXBbcy51dWlkXSA9IHM7CiAgICAgIGZvciAodmFyIGlkIGluIHRoaXMubW9kcykgewogICAgICAgIGlmICh0aGlzLm1vZHNbaWRdLm5ld19lbnYpIHsKICAgICAgICAgIHRoaXMubW9kc1tpZF0ubmV3X2VudihzLnV1aWQsIHMpOwogICAgICAgIH0KICAgICAgfQogICAgICBzLmVudi5idWlsZCgpOwogICAgfQogICAgLy8gTGl2ZSB1cGRhdGUKICAgIHVwZGF0ZShjYW5kbGVzLCBlKSB7CiAgICAgIGlmICghdGhpcy5kYXRhLm9obGN2IHx8ICF0aGlzLmRhdGEub2hsY3YuZGF0YS5sZW5ndGgpIHsKICAgICAgICByZXR1cm4gdGhpcy5zZW5kX3VwZGF0ZShlLmRhdGEuaWQpOwogICAgICB9CiAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHsKICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZS5wdXNoKFtjYW5kbGVzLCBlXSk7CiAgICAgICAgcmV0dXJuOwogICAgICB9CiAgICAgIGlmICghdGhpcy5zaGFyZWQpCiAgICAgICAgcmV0dXJuOwogICAgICBsZXQgbWZzMSA9IHRoaXMubWFrZV9tb2RzX2hvb2tzKCJwcmVfc3RlcCIpOwogICAgICBsZXQgbWZzMiA9IHRoaXMubWFrZV9tb2RzX2hvb2tzKCJwb3N0X3N0ZXAiKTsKICAgICAgbGV0IHN0ZXAgPSAoc2VsLCB1bnNoaWZ0KSA9PiB7CiAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBtZnMxLmxlbmd0aDsgbSsrKSB7CiAgICAgICAgICBtZnMxW21dKHNlbCk7CiAgICAgICAgfQogICAgICAgIGZvciAodmFyIGlkIG9mIHNlbCkgewogICAgICAgICAgdGhpcy5tYXBbaWRdLmVudi5zdGVwKHVuc2hpZnQpOwogICAgICAgIH0KICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1mczIubGVuZ3RoOyBtKyspIHsKICAgICAgICAgIG1mczJbbV0oc2VsKTsKICAgICAgICB9CiAgICAgIH07CiAgICAgIHRyeSB7CiAgICAgICAgbGV0IG9obGN2ID0gdGhpcy5kYXRhLm9obGN2LmRhdGE7CiAgICAgICAgbGV0IGkgPSBvaGxjdi5sZW5ndGggLSAxOwogICAgICAgIGxldCBsYXN0ID0gb2hsY3ZbaV07CiAgICAgICAgbGV0IHNlbCA9IE9iamVjdC5rZXlzKHRoaXMubWFwKTsKICAgICAgICBsZXQgdW5zaGlmdCA9IGZhbHNlOwogICAgICAgIHRoaXMuc2hhcmVkLmV2ZW50ID0gInVwZGF0ZSI7CiAgICAgICAgZm9yICh2YXIgY2FuZGxlIG9mIGNhbmRsZXMpIHsKICAgICAgICAgIGlmIChjYW5kbGVbMF0gPiBsYXN0WzBdKSB7CiAgICAgICAgICAgIHRoaXMuc2hhcmVkLm9uY2xvc2UgPSB0cnVlOwogICAgICAgICAgICBzdGVwKHNlbCwgZmFsc2UpOwogICAgICAgICAgICBvaGxjdi5wdXNoKGNhbmRsZSk7CiAgICAgICAgICAgIHVuc2hpZnQgPSB0cnVlOwogICAgICAgICAgICBpKys7CiAgICAgICAgICB9IGVsc2UgaWYgKGNhbmRsZVswXSA8IGxhc3RbMF0pIHsKICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBvaGxjdltpXSA9IGNhbmRsZTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgdGhpcy5pdGVyID0gaTsKICAgICAgICB0aGlzLnQgPSBvaGxjdltpXVswXTsKICAgICAgICB0aGlzLnN0ZXAob2hsY3ZbaV0sIHVuc2hpZnQpOwogICAgICAgIHRoaXMuc2hhcmVkLm9uY2xvc2UgPSBmYWxzZTsKICAgICAgICBzdGVwKHNlbCwgdW5zaGlmdCk7CiAgICAgICAgdGhpcy5saW1pdCgpOwogICAgICAgIHRoaXMuc2VuZF91cGRhdGUoZS5kYXRhLmlkKTsKICAgICAgICB0aGlzLnNlbmRfc3RhdGUoKTsKICAgICAgfSBjYXRjaCAoZXJyKSB7CiAgICAgICAgY29uc29sZS5sb2coZXJyKTsKICAgICAgfQogICAgfQogICAgaW5pdF9zdGF0ZShzZWwpIHsKICAgICAgc2VsID0gc2VsICE9IG51bGwgPyBzZWwgOiBPYmplY3Qua2V5cyh0aGlzLm1hcCk7CiAgICAgIGxldCB0YXNrID0gc2VsLmpvaW4oIiwiKTsKICAgICAgaWYgKHRoaXMucnVubmluZykgewogICAgICAgIHRoaXMuX3Jlc3RhcnQgPSB0YXNrID09PSB0aGlzLnRhc2s7CiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICB9CiAgICAgIHRoaXMub3BlbiA9IFRTKCJvcGVuIiwgW10pOwogICAgICB0aGlzLmhpZ2ggPSBUUygiaGlnaCIsIFtdKTsKICAgICAgdGhpcy5sb3cgPSBUUygibG93IiwgW10pOwogICAgICB0aGlzLmNsb3NlID0gVFMoImNsb3NlIiwgW10pOwogICAgICB0aGlzLnZvbCA9IFRTKCJ2b2wiLCBbXSk7CiAgICAgIHRoaXMudHNzID0ge307CiAgICAgIHRoaXMuc3RkX3BsdXMgPSB7fTsKICAgICAgdGhpcy5zaGFyZWQgPSB7fTsKICAgICAgdGhpcy5pdGVyID0gMDsKICAgICAgdGhpcy50ID0gMDsKICAgICAgdGhpcy5za2lwID0gZmFsc2U7CiAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlOwogICAgICB0aGlzLnRhc2sgPSB0YXNrOwogICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KICAgIC8vIENvbnZlcnQgZnVsbCBzY3JpcHQgc3RydWN0IHRvIGEgbWFwCiAgICBzdHJ1Y3RfdG9fbWFwKHN0cnVjdCkgewogICAgICB2YXIgX2E7CiAgICAgIGxldCBtYXAgPSB7fTsKICAgICAgbGV0IGxpc3QgPSBbXTsKICAgICAgZm9yICh2YXIgcGFuZSBvZiBzdHJ1Y3QpIHsKICAgICAgICBmb3IgKHZhciBzIG9mIHBhbmUuc2NyaXB0cykgewogICAgICAgICAgbGlzdC5wdXNoKFtzLnV1aWQsIHMsIChfYSA9IHMuc2V0dGluZ3MuZXhlY09yZGVyKSAhPSBudWxsID8gX2EgOiAxXSk7CiAgICAgICAgfQogICAgICB9CiAgICAgIGxpc3Quc29ydCgoYSwgYikgPT4gYVsyXSAtIGJbMl0pOwogICAgICBsaXN0LmZvckVhY2goKHgpID0+IHsKICAgICAgICBtYXBbeFswXV0gPSB4WzFdOwogICAgICB9KTsKICAgICAgcmV0dXJuIG1hcDsKICAgIH0KICAgIC8vIEluamVjdC9vdmVycmlkZSBmdW5jdGlvbnMgaW4gdGhlIHN0ZCBsaWIgb2JqZWN0CiAgICBzdGRfaW5qZWN0KHN0ZCkgewogICAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc3RkKTsKICAgICAgT2JqZWN0LmFzc2lnbihwcm90bywgdGhpcy5zdGRfcGx1cyk7CiAgICAgIHJldHVybiBzdGQ7CiAgICB9CiAgICBzZW5kX3N0YXRlKCkgewogICAgICB0aGlzLnNlbmQoImVuZ2luZS1zdGF0ZSIsIHsKICAgICAgICBzY3JpcHRzOiBPYmplY3Qua2V5cyh0aGlzLm1hcCkubGVuZ3RoLAogICAgICAgIGxhc3RfcGVyZjogdGhpcy5wZXJmLAogICAgICAgIGl0ZXI6IHRoaXMuaXRlciwKICAgICAgICBsYXN0X3Q6IHRoaXMudCwKICAgICAgICBkYXRhX3NpemU6IHRoaXMuZGF0YV9zaXplLAogICAgICAgIHJ1bm5pbmc6IGZhbHNlCiAgICAgIH0pOwogICAgfQogICAgc2VuZF91cGRhdGUodGFza0lkKSB7CiAgICAgIHRoaXMuc2VuZCgKICAgICAgICAib3ZlcmxheS11cGRhdGUiLAogICAgICAgIHRoaXMuZm9ybWF0X3VwZGF0ZSgpLAogICAgICAgIHRhc2tJZAogICAgICApOwogICAgfQogICAgaW5pdF9tYXAoKSB7CiAgICAgIGZvciAodmFyIGlkIGluIHRoaXMubWFwKSB7CiAgICAgICAgdGhpcy5hZGRfc2NyaXB0KHRoaXMubWFwW2lkXSk7CiAgICAgIH0KICAgIH0KICAgIGFzeW5jIHJ1bihzZWwpIHsKICAgICAgdGhpcy5zZW5kKCJlbmdpbmUtc3RhdGUiLCB7IHJ1bm5pbmc6IHRydWUgfSk7CiAgICAgIHZhciB0MSA9IFV0aWxzLm5vdygpOwogICAgICBzZWwgPSBzZWwgfHwgT2JqZWN0LmtleXModGhpcy5tYXApOwogICAgICB0aGlzLnByZV9ydW5fbW9kcyhzZWwpOwogICAgICBsZXQgbWZzMSA9IHRoaXMubWFrZV9tb2RzX2hvb2tzKCJwcmVfc3RlcCIpOwogICAgICBsZXQgbWZzMiA9IHRoaXMubWFrZV9tb2RzX2hvb2tzKCJwb3N0X3N0ZXAiKTsKICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTsKICAgICAgdHJ5IHsKICAgICAgICBmb3IgKHZhciBpZCBvZiBzZWwpIHsKICAgICAgICAgIHRoaXMubWFwW2lkXS5lbnYuaW5pdCgpOwogICAgICAgIH0KICAgICAgICBsZXQgb2hsY3YgPSB0aGlzLmRhdGEub2hsY3YuZGF0YTsKICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLnN0YXJ0KG9obGN2KTsKICAgICAgICB0aGlzLnNoYXJlZC5ldmVudCA9ICJzdGVwIjsKICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBvaGxjdi5sZW5ndGg7IGkrKykgewogICAgICAgICAgaWYgKGkgJSA1ZTMgPT09IDApCiAgICAgICAgICAgIGF3YWl0IFV0aWxzLnBhdXNlKDApOwogICAgICAgICAgaWYgKHRoaXMucmVzdGFydGVkKCkpCiAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgIHRoaXMuaXRlciA9IGkgLSBzdGFydDsKICAgICAgICAgIHRoaXMudCA9IG9obGN2W2ldWzBdOwogICAgICAgICAgdGhpcy5zdGVwKG9obGN2W2ldKTsKICAgICAgICAgIHRoaXMuc2hhcmVkLm9uY2xvc2UgPSBpICE9PSBvaGxjdi5sZW5ndGggLSAxOwogICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBtZnMxLmxlbmd0aDsgbSsrKSB7CiAgICAgICAgICAgIG1mczFbbV0oc2VsKTsKICAgICAgICAgIH0KICAgICAgICAgIGZvciAodmFyIGlkIG9mIHNlbCkKICAgICAgICAgICAgdGhpcy5tYXBbaWRdLmVudi5zdGVwKCk7CiAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1mczIubGVuZ3RoOyBtKyspIHsKICAgICAgICAgICAgbWZzMlttXShzZWwpOwogICAgICAgICAgfQogICAgICAgICAgdGhpcy5saW1pdCgpOwogICAgICAgIH0KICAgICAgICBmb3IgKHZhciBpZCBvZiBzZWwpIHsKICAgICAgICAgIHRoaXMubWFwW2lkXS5lbnYub3V0cHV0LnBvc3QoKTsKICAgICAgICB9CiAgICAgIH0gY2F0Y2ggKGVycikgewogICAgICAgIGNvbnNvbGUubG9nKGVycik7CiAgICAgIH0KICAgICAgdGhpcy5wb3N0X3J1bl9tb2RzKHNlbCk7CiAgICAgIHRoaXMucGVyZiA9IFV0aWxzLm5vdygpIC0gdDE7CiAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlOwogICAgICB0aGlzLnNlbmQoIm92ZXJsYXktZGF0YSIsIHRoaXMuZm9ybWF0X2RhdGEoKSk7CiAgICB9CiAgICBzdGVwKGRhdGEsIHVuc2hpZnQgPSB0cnVlKSB7CiAgICAgIGlmICh1bnNoaWZ0KSB7CiAgICAgICAgdGhpcy5vcGVuLnVuc2hpZnQoZGF0YVsxXSk7CiAgICAgICAgdGhpcy5oaWdoLnVuc2hpZnQoZGF0YVsyXSk7CiAgICAgICAgdGhpcy5sb3cudW5zaGlmdChkYXRhWzNdKTsKICAgICAgICB0aGlzLmNsb3NlLnVuc2hpZnQoZGF0YVs0XSk7CiAgICAgICAgdGhpcy52b2wudW5zaGlmdChkYXRhWzVdKTsKICAgICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLnRzcykgewogICAgICAgICAgaWYgKHRoaXMudHNzW2lkXS5fX3RmX18pCiAgICAgICAgICAgIHRoaXMudHNzW2lkXS5fX2ZuX18oKTsKICAgICAgICAgIGVsc2UKICAgICAgICAgICAgdGhpcy50c3NbaWRdLnVuc2hpZnQodGhpcy50c3NbaWRdLl9fZm5fXygpKTsKICAgICAgICB9CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy5vcGVuWzBdID0gZGF0YVsxXTsKICAgICAgICB0aGlzLmhpZ2hbMF0gPSBkYXRhWzJdOwogICAgICAgIHRoaXMubG93WzBdID0gZGF0YVszXTsKICAgICAgICB0aGlzLmNsb3NlWzBdID0gZGF0YVs0XTsKICAgICAgICB0aGlzLnZvbFswXSA9IGRhdGFbNV07CiAgICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy50c3MpIHsKICAgICAgICAgIGlmICh0aGlzLnRzc1tpZF0uX190Zl9fKQogICAgICAgICAgICB0aGlzLnRzc1tpZF0uX19mbl9fKCk7CiAgICAgICAgICBlbHNlCiAgICAgICAgICAgIHRoaXMudHNzW2lkXVswXSA9IHRoaXMudHNzW2lkXS5fX2ZuX18oKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIGxpbWl0KCkgewogICAgICB0aGlzLm9wZW4ubGVuZ3RoID0gdGhpcy5vcGVuLl9fbGVuX18gfHwgREVGX0xJTUlUOwogICAgICB0aGlzLmhpZ2gubGVuZ3RoID0gdGhpcy5oaWdoLl9fbGVuX18gfHwgREVGX0xJTUlUOwogICAgICB0aGlzLmxvdy5sZW5ndGggPSB0aGlzLmxvdy5fX2xlbl9fIHx8IERFRl9MSU1JVDsKICAgICAgdGhpcy5jbG9zZS5sZW5ndGggPSB0aGlzLmNsb3NlLl9fbGVuX18gfHwgREVGX0xJTUlUOwogICAgICB0aGlzLnZvbC5sZW5ndGggPSB0aGlzLnZvbC5fX2xlbl9fIHx8IERFRl9MSU1JVDsKICAgIH0KICAgIHN0YXJ0KG9obGN2KSB7CiAgICAgIGxldCBkZXB0aCA9IHRoaXMuc2V0dC5zY3JpcHRfZGVwdGg7CiAgICAgIHJldHVybiBkZXB0aCA/IE1hdGgubWF4KG9obGN2Lmxlbmd0aCAtIGRlcHRoLCAwKSA6IDA7CiAgICB9CiAgICBkcmFpbl9xdWV1ZXMoKSB7CiAgICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCkgewogICAgICAgIHRoaXMuZXhlY19hbGwoKTsKICAgICAgfSBlbHNlIGlmICh0aGlzLmRlbHRhX3F1ZXVlLmxlbmd0aCkgewogICAgICAgIHRoaXMuZXhlY19zZWwodGhpcy5kZWx0YV9xdWV1ZS5wb3AoKSk7CiAgICAgICAgdGhpcy5kZWx0YV9xdWV1ZSA9IFtdOwogICAgICB9IGVsc2UgewogICAgICAgIHdoaWxlICh0aGlzLnVwZGF0ZV9xdWV1ZS5sZW5ndGgpIHsKICAgICAgICAgIGxldCB1cGQgPSB0aGlzLnVwZGF0ZV9xdWV1ZS5zaGlmdCgpOwogICAgICAgICAgdGhpcy51cGRhdGUoLi4udXBkKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIGZvcm1hdF9kYXRhKCkgewogICAgICByZXR1cm4gc2VsZi5wYW5lU3RydWN0Lm1hcCgoeCkgPT4gKHsKICAgICAgICBpZDogeC5pZCwKICAgICAgICB1dWlkOiB4LnV1aWQsCiAgICAgICAgb3ZlcmxheXM6IHRoaXMub3ZlcnJpZGVfb3ZlcmxheXMoeC5vdmVybGF5cyB8fCBbXSkKICAgICAgfSkpOwogICAgfQogICAgLy8gT3ZlcnJpZGUgb3ZlcmxheSBmaWVsZHMgd2l0aCAnc2NyaXB0Lm92ZXJsYXknCiAgICBvdmVycmlkZV9vdmVybGF5cyhvdnMpIHsKICAgICAgZm9yICh2YXIgb3Ygb2Ygb3ZzKSB7CiAgICAgICAgbGV0IHMgPSB0aGlzLm1hcFtvdi5wcm9kXTsKICAgICAgICBpZiAoIXMpCiAgICAgICAgICBjb250aW51ZTsKICAgICAgICBpZiAocy5vdmVybGF5KSB7CiAgICAgICAgICBvdiA9IG92ZXJyaWRlT3ZlcmxheShvdiwgcy5vdmVybGF5KTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIG92czsKICAgIH0KICAgIGZvcm1hdF91cGRhdGUoKSB7CiAgICAgIGxldCBtYXAgPSB7fTsKICAgICAgZm9yICh2YXIgcGFuZSBvZiBzZWxmLnBhbmVTdHJ1Y3QpIHsKICAgICAgICBmb3IgKHZhciBvdiBvZiBwYW5lLm92ZXJsYXlzIHx8IFtdKSB7CiAgICAgICAgICBtYXBbb3YudXVpZF0gPSBvdi5kYXRhW292LmRhdGEubGVuZ3RoIC0gMV07CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBtYXA7CiAgICB9CiAgICByZXN0YXJ0ZWQoKSB7CiAgICAgIGlmICh0aGlzLl9yZXN0YXJ0KSB7CiAgICAgICAgdGhpcy5fcmVzdGFydCA9IGZhbHNlOwogICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlOwogICAgICAgIHRoaXMucGVyZiA9IDA7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgIH0KICAgICAgcmV0dXJuIGZhbHNlOwogICAgfQogICAgcmVtb3ZlX3NjcmlwdHMoaWRzKSB7CiAgICAgIGZvciAodmFyIGlkIG9mIGlkcykKICAgICAgICBkZWxldGUgdGhpcy5tYXBbaWRdOwogICAgICB0aGlzLnNlbmRfc3RhdGUoKTsKICAgIH0KICAgIHByZV9ydW5fbW9kcyhzZWwpIHsKICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy5tb2RzKSB7CiAgICAgICAgaWYgKHRoaXMubW9kc1tpZF0ucHJlX3J1bikgewogICAgICAgICAgdGhpcy5tb2RzW2lkXS5wcmVfcnVuKHNlbCk7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICBwb3N0X3J1bl9tb2RzKHNlbCkgewogICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLm1vZHMpIHsKICAgICAgICBpZiAodGhpcy5tb2RzW2lkXS5wb3N0X3J1bikgewogICAgICAgICAgdGhpcy5tb2RzW2lkXS5wb3N0X3J1bihzZWwpOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgbWFrZV9tb2RzX2hvb2tzKG5hbWUpIHsKICAgICAgbGV0IGFyciA9IFtdOwogICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLm1vZHMpIHsKICAgICAgICBpZiAodGhpcy5tb2RzW2lkXVtuYW1lXSkgewogICAgICAgICAgYXJyLnB1c2godGhpcy5tb2RzW2lkXVtuYW1lXS5iaW5kKHRoaXMubW9kc1tpZF0pKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIGFycjsKICAgIH0KICAgIC8vIENhbGN1bGF0ZSBkYXRhIHNpemUKICAgIHJlY2FsY19zaXplKCkgewogICAgICB3aGlsZSAodHJ1ZSkgewogICAgICAgIHZhciBzeiA9IHNpemVfb2ZfZHNzKHRoaXMuZGF0YSkgLyAoMTAyNCAqIDEwMjQpOwogICAgICAgIGxldCBsaW0gPSB0aGlzLnNldHQud3dfcmFtX2xpbWl0OwogICAgICAgIGlmIChsaW0gJiYgc3ogPiBsaW0pIHsKICAgICAgICAgIHRoaXMubGltaXRfc2l6ZSgpOwogICAgICAgIH0gZWxzZQogICAgICAgICAgYnJlYWs7CiAgICAgIH0KICAgICAgdGhpcy5kYXRhX3NpemUgPSArc3oudG9GaXhlZCgyKTsKICAgICAgdGhpcy5zZW5kX3N0YXRlKCk7CiAgICB9CiAgICAvLyBMaW1pdCBkYXRhIHNpemUgYnkgdGhyb3dpbmcgb3V0IHRoZSBsZWFzdAogICAgLy8gYWN0aXZlIGRhdGFzZXRzIChtZWFzdXJlZCBieSAnbGFzdF91cGQnKQogICAgbGltaXRfc2l6ZSgpIHsKICAgICAgbGV0IGRzcyA9IE9iamVjdC52YWx1ZXModGhpcy5kYXRhKS5tYXAoKHgpID0+ICh7CiAgICAgICAgaWQ6IHguaWQsCiAgICAgICAgdDogeC5sYXN0X3VwZAogICAgICB9KSk7CiAgICAgIGRzcy5zb3J0KChhLCBiKSA9PiBhLnQgLSBiLnQpOwogICAgICBpZiAoZHNzLmxlbmd0aCkgewogICAgICAgIGRlbGV0ZSB0aGlzLmRhdGFbZHNzWzBdLmlkXTsKICAgICAgfQogICAgfQogIH0KICB2YXIgc2UgPSBuZXcgU2NyaXB0RW5naW5lKCk7CiAgY2xhc3MgRGF0YXNldFdXIHsKICAgIGNvbnN0cnVjdG9yKGlkLCBkYXRhKSB7CiAgICAgIHRoaXMubGFzdF91cGQgPSBub3coKTsKICAgICAgdGhpcy5pZCA9IGlkOwogICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgewogICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7CiAgICAgICAgaWYgKGlkID09PSAib2hsY3YiKQogICAgICAgICAgdGhpcy50eXBlID0gIk9ITENWIjsKICAgICAgfSBlbHNlIHsKICAgICAgICB0aGlzLmRhdGEgPSBkYXRhLmRhdGE7CiAgICAgICAgdGhpcy50eXBlID0gZGF0YS50eXBlOwogICAgICB9CiAgICB9CiAgICAvLyBVcGRhdGUgZnJvbSAndXBkYXRlLWRhdGEnIGV2ZW50CiAgICAvLyBUT0RPOiBkcyBzaXplIGxpbWl0IChpbiBNQiAvIGRhdGEgcG9pbnRzKQogICAgc3RhdGljIHVwZGF0ZV9hbGwoc2UyLCBkYXRhKSB7CiAgICAgIGZvciAodmFyIGsgaW4gZGF0YSkgewogICAgICAgIGlmIChrID09PSAib2hsY3YiKQogICAgICAgICAgY29udGludWU7CiAgICAgICAgbGV0IGlkID0gay5zcGxpdCgiLiIpWzFdIHx8IGs7CiAgICAgICAgaWYgKCFzZTIuZGF0YVtpZF0pCiAgICAgICAgICBjb250aW51ZTsKICAgICAgICBsZXQgYXJyID0gc2UyLmRhdGFbaWRdLmRhdGE7CiAgICAgICAgbGV0IGlOID0gYXJyLmxlbmd0aCAtIDE7CiAgICAgICAgbGV0IGxhc3QgPSBhcnJbaU5dOwogICAgICAgIGZvciAodmFyIGRwIG9mIGRhdGFba10pIHsKICAgICAgICAgIGlmICghbGFzdCB8fCBkcFswXSA+IGxhc3RbMF0pIHsKICAgICAgICAgICAgYXJyLnB1c2goZHApOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBzZTIuZGF0YVtpZF0ubGFzdF91cGQgPSBub3coKTsKICAgICAgfQogICAgfQogICAgbWVyZ2UoZGF0YSkgewogICAgICBsZXQgbGVuID0gdGhpcy5kYXRhLmxlbmd0aDsKICAgICAgaWYgKCFsZW4pIHsKICAgICAgICB0aGlzLmRhdGEgPSBkYXRhOwogICAgICAgIHJldHVybjsKICAgICAgfQogICAgICBsZXQgdDAgPSB0aGlzLmRhdGFbMF1bMF07CiAgICAgIGxldCB0TiA9IHRoaXMuZGF0YVtsZW4gLSAxXVswXTsKICAgICAgbGV0IGwgPSBkYXRhLmZpbHRlcigoeCkgPT4geFswXSA8IHQwKTsKICAgICAgbGV0IHIgPSBkYXRhLmZpbHRlcigoeCkgPT4geFswXSA+IHROKTsKICAgICAgdGhpcy5kYXRhID0gbC5jb25jYXQodGhpcy5kYXRhLCByKTsKICAgIH0KICAgIC8vIE9uIGRhdGFzZXQgb3BlcmF0aW9uCiAgICBvcChzZTIsIG9wKSB7CiAgICAgIHRoaXMubGFzdF91cGQgPSBub3coKTsKICAgICAgc3dpdGNoIChvcC50eXBlKSB7CiAgICAgICAgY2FzZSAic2V0IjoKICAgICAgICAgIHRoaXMuZGF0YSA9IG9wLmRhdGE7CiAgICAgICAgICBzZTIucmVjYWxjX3NpemUoKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgImRlbCI6CiAgICAgICAgICBkZWxldGUgc2UyLmRhdGFbdGhpcy5pZF07CiAgICAgICAgICBzZTIucmVjYWxjX3NpemUoKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgIm1yZyI6CiAgICAgICAgICB0aGlzLm1lcmdlKG9wLmRhdGEpOwogICAgICAgICAgc2UyLnJlY2FsY19zaXplKCk7CiAgICAgICAgICBicmVhazsKICAgICAgfQogICAgfQogIH0KICBzZWxmLnNjcmlwdExpYiA9IHt9OwogIHNlbGYucGFuZVN0cnVjdCA9IHt9OwogIHNlbGYub25tZXNzYWdlID0gYXN5bmMgKGUpID0+IHsKICAgIHN3aXRjaCAoZS5kYXRhLnR5cGUpIHsKICAgICAgY2FzZSAidXBsb2FkLXNjcmlwdHMiOgogICAgICAgIHNlbGYuc2NyaXB0TGliID0gZS5kYXRhLmRhdGE7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgInNlbmQtbWV0YS1pbmZvIjoKICAgICAgICBzZS50ZiA9IHRmX2Zyb21fc3RyKGUuZGF0YS5kYXRhLnRmKTsKICAgICAgICBzZS5yYW5nZSA9IGUuZGF0YS5kYXRhLnJhbmdlOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICJ1cGxvYWQtZGF0YSI6CiAgICAgICAgc2UudGYgPSB0Zl9mcm9tX3N0cihlLmRhdGEuZGF0YS5tZXRhLnRmKTsKICAgICAgICBzZS5yYW5nZSA9IGUuZGF0YS5kYXRhLm1ldGEucmFuZ2U7CiAgICAgICAgZm9yICh2YXIgaWQgaW4gZS5kYXRhLmRhdGEuZHNzKSB7CiAgICAgICAgICBsZXQgZGF0YSA9IGUuZGF0YS5kYXRhLmRzc1tpZF07CiAgICAgICAgICBzZS5kYXRhW2lkXSA9IG5ldyBEYXRhc2V0V1coaWQsIGRhdGEpOwogICAgICAgIH0KICAgICAgICBzZS5yZWNhbGNfc2l6ZSgpOwogICAgICAgIHNlLnNlbmQoImRhdGEtdXBsb2FkZWQiLCB7fSwgZS5kYXRhLmlkKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAiZXhlYy1hbGwtc2NyaXB0cyI6CiAgICAgICAgc2VsZi5wYW5lU3RydWN0ID0gZS5kYXRhLmRhdGE7CiAgICAgICAgc2UuZXhlY19hbGwoKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAidXBkYXRlLWRhdGEiOgogICAgICAgIERhdGFzZXRXVy51cGRhdGVfYWxsKHNlLCBlLmRhdGEuZGF0YSk7CiAgICAgICAgaWYgKGUuZGF0YS5kYXRhLm9obGN2KSB7CiAgICAgICAgICBzZS51cGRhdGUoZS5kYXRhLmRhdGEub2hsY3YsIGUpOwogICAgICAgIH0KICAgICAgICBicmVhazsKICAgIH0KICB9OwogIHNlLnNlbmQgPSAodHlwZSwgZGF0YSwgaWQpID0+IHsKICAgIGlkID0gaWQgIT0gbnVsbCA/IGlkIDogVXRpbHMudXVpZCgpOwogICAgc3dpdGNoICh0eXBlKSB7CiAgICAgIGNhc2UgImRhdGEtdXBsb2FkZWQiOgogICAgICBjYXNlICJvdmVybGF5LWRhdGEiOgogICAgICBjYXNlICJvdmVybGF5LXVwZGF0ZSI6CiAgICAgIGNhc2UgImVuZ2luZS1zdGF0ZSI6CiAgICAgIGNhc2UgIm1vZGlmeS1vdmVybGF5IjoKICAgICAgY2FzZSAibW9kdWxlLWRhdGEiOgogICAgICBjYXNlICJzY3JpcHQtc2lnbmFsIjoKICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICAgIHR5cGUsCiAgICAgICAgICBkYXRhLAogICAgICAgICAgaWQKICAgICAgICB9KTsKICAgICAgICBicmVhazsKICAgIH0KICB9Owp9KSgpOwo=";
const blob = typeof window !== "undefined" && window.Blob && new Blob([atob(encodedJs)], { type: "text/javascript;charset=utf-8" });
function WorkerWrapper() {
  let objURL;
  try {
    objURL = blob && (window.URL || window.webkitURL).createObjectURL(blob);
    if (!objURL)
      throw "";
    return new Worker(objURL);
  } catch (e) {
    return new Worker("data:application/javascript;base64," + encodedJs);
  } finally {
    objURL && (window.URL || window.webkitURL).revokeObjectURL(objURL);
  }
}
class WebWork {
  constructor(id, chart) {
    this.chart = chart;
    this.tasks = {};
    this.onevent = () => {
    };
    this.start();
  }
  start() {
    if (this.worker)
      this.worker.terminate();
    this.worker = new WorkerWrapper();
    this.worker.onmessage = (e) => this.onmessage(e);
  }
  // TODO: Do we need this ???
  startSocket() {
  }
  send(msg, txKeys) {
    if (txKeys) {
      let txObjs = txKeys.map((k) => msg.data[k]);
      this.worker.postMessage(msg, txObjs);
    } else {
      this.worker.postMessage(msg);
    }
  }
  // Send to node.js via websocket
  sendToNode(msg, txKeys) {
  }
  onmessage(e) {
    if (e.data.id in this.tasks) {
      this.tasks[e.data.id](e.data.data);
      delete this.tasks[e.data.id];
    } else {
      this.onevent(e);
    }
  }
  // Execute a task
  async exec(type, data, txKeys) {
    return new Promise((rs, rj) => {
      let id = Utils.uuid();
      this.send({ type, id, data }, txKeys);
      this.tasks[id] = (res) => {
        rs(res);
      };
    });
  }
  // Execute a task, but just fucking do it,
  // do not wait for the result
  just(type, data, txKeys) {
    let id = Utils.uuid();
    this.send({ type, id, data }, txKeys);
  }
  // Relay an event from iframe postMessage
  // (for the future)
  async relay(event, just = false) {
    return new Promise((rs, rj) => {
      this.send(event, event.txKeys);
      if (!just) {
        this.tasks[event.id] = (res) => {
          rs(res);
        };
      }
    });
  }
  stop() {
    if (this.worker)
      this.worker.terminate();
  }
}
let instances$1 = {};
function instance$e(id, chart) {
  if (!instances$1[id]) {
    instances$1[id] = new WebWork(id, chart);
  }
  return instances$1[id];
}
const WebWork$1 = { instance: instance$e };
const Overlays = /* @__PURE__ */ Object.assign({
  "../scripts/AppleArea.navy": __vite_glob_0_0,
  "../scripts/ArrowTrades.navy": __vite_glob_0_1,
  "../scripts/Band.navy": __vite_glob_0_2,
  "../scripts/CandlesPlus.navy": __vite_glob_0_3,
  "../scripts/Cloud.navy": __vite_glob_0_4,
  "../scripts/Histogram.navy": __vite_glob_0_5,
  "../scripts/PriceLabels.navy": __vite_glob_0_6,
  "../scripts/Range.navy": __vite_glob_0_7,
  "../scripts/Sparse.navy": __vite_glob_0_8,
  "../scripts/Splines.navy": __vite_glob_0_9,
  "../scripts/SuperBands.navy": __vite_glob_0_10,
  "../scripts/Trades.navy": __vite_glob_0_11,
  "../scripts/Volume.navy": __vite_glob_0_12,
  "../scripts/VolumeDelta.navy": __vite_glob_0_13,
  "../scripts/area.navy": __vite_glob_0_14,
  "../scripts/candles.navy": __vite_glob_0_15,
  "../scripts/spline.navy": __vite_glob_0_16
});
const Tools = /* @__PURE__ */ Object.assign({
  "../scripts/tools/LineTool.navy": __vite_glob_1_0,
  "../scripts/tools/RangeTool.navy": __vite_glob_1_1
});
const Indicators = /* @__PURE__ */ Object.assign({
  "../scripts/indicators/ALMA.navy": __vite_glob_2_0,
  "../scripts/indicators/ATR.navy": __vite_glob_2_1,
  "../scripts/indicators/ATRp.navy": __vite_glob_2_2,
  "../scripts/indicators/BB.navy": __vite_glob_2_3,
  "../scripts/indicators/BBW.navy": __vite_glob_2_4,
  "../scripts/indicators/CCI.navy": __vite_glob_2_5,
  "../scripts/indicators/CMO.navy": __vite_glob_2_6,
  "../scripts/indicators/COG.navy": __vite_glob_2_7,
  "../scripts/indicators/DMI.navy": __vite_glob_2_8,
  "../scripts/indicators/EMA.navy": __vite_glob_2_9,
  "../scripts/indicators/HMA.navy": __vite_glob_2_10,
  "../scripts/indicators/Ichimoku.navy": __vite_glob_2_11,
  "../scripts/indicators/KC.navy": __vite_glob_2_12,
  "../scripts/indicators/KCW.navy": __vite_glob_2_13,
  "../scripts/indicators/MACD.navy": __vite_glob_2_14,
  "../scripts/indicators/MFI.navy": __vite_glob_2_15,
  "../scripts/indicators/MOM.navy": __vite_glob_2_16,
  "../scripts/indicators/ROC.navy": __vite_glob_2_17,
  "../scripts/indicators/RSI.navy": __vite_glob_2_18,
  "../scripts/indicators/Ribbon.navy": __vite_glob_2_19,
  "../scripts/indicators/SAR.navy": __vite_glob_2_20,
  "../scripts/indicators/SMA.navy": __vite_glob_2_21,
  "../scripts/indicators/SWMA.navy": __vite_glob_2_22,
  "../scripts/indicators/Stoch.navy": __vite_glob_2_23,
  "../scripts/indicators/TSI.navy": __vite_glob_2_24,
  "../scripts/indicators/VWMA.navy": __vite_glob_2_25,
  "../scripts/indicators/WilliamsR.navy": __vite_glob_2_26
});
class Scripts {
  constructor(id) {
    this.ww = WebWork$1.instance(id);
  }
  async init(srcs) {
    this.srcLib = Object.values(Overlays).map((x) => x.default);
    this.srcLib.push(...Object.values(Tools).map((x) => x.default));
    this.srcLib.push(...Object.values(Indicators).map((x) => x.default));
    this.srcLib.push(...srcs);
    this.prefabs = {};
    this.iScripts = {};
    this.parse();
    this.ww.exec("upload-scripts", {
      // Removing make() functions
      prefabs: Object.keys(this.prefabs).reduce((a, k) => {
        a[k] = {
          name: this.prefabs[k].name,
          author: this.prefabs[k].author,
          version: this.prefabs[k].version
        };
        return a;
      }, {}),
      iScripts: this.iScripts
    });
  }
  parse() {
    this.prefabs = {};
    for (var s of this.srcLib) {
      let parser = new Parser(s);
      for (var ov of parser.overlays) {
        this.prefabs[ov.tagProps.name] = {
          name: ov.tagProps.name,
          author: ov.tagProps.author,
          version: ov.tagProps.version,
          ctx: ov.tagProps.ctx || "Canvas",
          make: ov.prefab,
          static: ov.static
        };
      }
      for (var ind of parser.indicators) {
        this.iScripts[ind.tagProps.name] = {
          name: ind.tagProps.name,
          author: ind.tagProps.author,
          version: ind.tagProps.version,
          code: {
            init: ind.init,
            update: ind.update,
            post: ind.post
          }
        };
      }
    }
  }
}
let instances = {};
function instance$d(id) {
  if (!instances[id]) {
    instances[id] = new Scripts(id);
  }
  return instances[id];
}
const Scripts$1 = { instance: instance$d };
const { $SCALES: $SCALES$1 } = Const;
const MAX_INT = Number.MAX_SAFE_INTEGER;
function Scale(id, src, specs) {
  let { hub, props, settings, height } = specs;
  let { ctx } = props;
  let meta = MetaHub$1.instance(props.id);
  let prefabs = Scripts$1.instance(props.id).prefabs;
  let self = {};
  let yt = (meta.yTransforms[src.gridId] || [])[id];
  let gridId = src.gridId;
  let ovs = src.ovs;
  let ls = src.log;
  const SAMPLE = props.config.AUTO_PRE_SAMPLE;
  function calcSidebar() {
    let maxlen = Math.max(...ovs.map((x) => x.dataSubset.length));
    if (maxlen < 2) {
      self.prec = 0;
      self.sb = props.config.SBMIN;
      return;
    }
    if (src.precision !== void 0) {
      self.prec = src.precision;
    } else {
      self.prec = 0;
      for (var ov of ovs) {
        if (ov.settings.precision !== void 0) {
          var prec = ov.settings.precision;
        } else {
          var prec = calcPrecision(ov);
        }
        if (prec > self.prec)
          self.prec = prec;
      }
    }
    if (!isFinite(self.$hi) || !isFinite(self.$lo)) {
      self.sb = props.config.SBMIN;
      return;
    }
    let lens = [];
    lens.push(self.$hi.toFixed(self.prec).length);
    lens.push(self.$lo.toFixed(self.prec).length);
    let str = "0".repeat(Math.max(...lens)) + "    ";
    self.sb = ctx.measureText(str).width;
    self.sb = Math.max(Math.floor(self.sb), props.config.SBMIN);
    self.sb = Math.min(self.sb, props.config.SBMAX);
  }
  function calc$Range() {
    var hi = -Infinity, lo = Infinity;
    for (var ov of ovs) {
      if (ov.settings.display === false || ov.settings.dontScale === true)
        continue;
      let yfn = (meta.yRangeFns[gridId] || [])[ov.id];
      let yfnStatic = prefabs[ov.type].static.yRange;
      if (yfnStatic) {
        yfn = {
          exec: yfnStatic,
          preCalc: yfnStatic.length > 1
          // Do we need h & l
        };
      }
      let data = ov.dataSubset;
      var h = -Infinity, l = Infinity;
      if (!yfn || yfn && yfn.preCalc) {
        for (var i = 0; i < data.length; i++) {
          for (var j = 1; j < data[i].length; j++) {
            let v = data[i][j];
            if (v > h)
              h = v;
            if (v < l)
              l = v;
          }
        }
      }
      if (yfn) {
        var yfnResult = yfn.exec(data, h, l);
        if (yfnResult) {
          var [h, l, exp] = yfnResult;
        } else {
          var [h, l] = [hi, lo];
        }
      }
      if (h > hi)
        hi = h;
      if (l < lo)
        lo = l;
    }
    if (yt && !yt.auto && yt.range) {
      self.$hi = yt.range[0];
      self.$lo = yt.range[1];
    } else {
      if (!ls) {
        exp = exp === false ? 0 : 1;
        self.$hi = hi + (hi - lo) * props.config.EXPAND * exp;
        self.$lo = lo - (hi - lo) * props.config.EXPAND * exp;
      } else {
        self.$hi = hi;
        self.$lo = lo;
        logScale.expand(self, height);
      }
      if (self.$hi === self.$lo) {
        if (!ls) {
          self.$hi *= 1.05;
          self.$lo *= 0.95;
        } else {
          logScale.expand(self, height);
        }
      }
    }
  }
  function calcPrecision(ov) {
    let maxR = 0;
    let sample = [];
    let f = meta.getPreSampler(gridId, ov.id);
    f = f || prefabs[ov.type].static.preSampler;
    f = f || Utils.defaultPreSampler;
    for (var i = 0; i < SAMPLE; i++) {
      let n = Math.floor(Math.random() * ov.dataSubset.length);
      let x = f(ov.dataSubset[n]);
      if (typeof x === "number")
        sample.push(x);
      else
        sample = sample.concat(x);
    }
    sample.forEach((x) => {
      let right = Utils.numberLR(x)[1];
      if (right > maxR)
        maxR = right;
    });
    let aprec = meta.getAutoPrec(gridId, ov.id);
    if (aprec === void 0 || maxR > aprec) {
      meta.setAutoPrec(gridId, ov.id, maxR);
      return maxR;
    }
    return aprec;
  }
  function calcTransform() {
    if (!ls) {
      self.A = -height / (self.$hi - self.$lo);
      self.B = -self.$hi * self.A;
    } else {
      self.A = -height / (math.log(self.$hi) - math.log(self.$lo));
      self.B = -math.log(self.$hi) * self.A;
    }
  }
  function dollarStep() {
    let yrange = self.$hi - self.$lo;
    let m = yrange * (props.config.GRIDY / height);
    let p = parseInt(yrange.toExponential().split("e")[1]);
    let d = Math.pow(10, p);
    let s = $SCALES$1.map((x) => x * d);
    return Utils.strip(Utils.nearestA(m, s)[1]);
  }
  function dollarMult() {
    let mult_hi = dollarMultHi();
    let mult_lo = dollarMultLo();
    return Math.max(mult_hi, mult_lo);
  }
  function dollarMultHi() {
    let h = Math.min(self.B, height);
    if (h < props.config.GRIDY)
      return 1;
    let n = h / props.config.GRIDY;
    let yrange = self.$hi;
    if (self.$lo > 0) {
      var yratio = self.$hi / self.$lo;
    } else {
      yratio = self.$hi / 1;
    }
    yrange * (props.config.GRIDY / h);
    parseInt(yrange.toExponential().split("e")[1]);
    return Math.pow(yratio, 1 / n);
  }
  function dollarMultLo() {
    let h = Math.min(height - self.B, height);
    if (h < props.config.GRIDY)
      return 1;
    let n = h / props.config.GRIDY;
    let yrange = Math.abs(self.$lo);
    if (self.$hi < 0 && self.$lo < 0) {
      var yratio = Math.abs(self.$lo / self.$hi);
    } else {
      yratio = Math.abs(self.$lo) / 1;
    }
    yrange * (props.config.GRIDY / h);
    parseInt(yrange.toExponential().split("e")[1]);
    return Math.pow(yratio, 1 / n);
  }
  function gridY() {
    let m = Math.pow(10, -self.prec);
    self.$step = Math.max(m, dollarStep());
    self.ys = [];
    let y1 = self.$lo - self.$lo % self.$step;
    for (var y$ = y1; y$ <= self.$hi; y$ += self.$step) {
      let y = Math.floor(y$ * self.A + self.B);
      if (y > height)
        continue;
      self.ys.push([y, Utils.strip(y$)]);
    }
  }
  function gridYLog() {
    self.$_mult = dollarMult();
    self.ys = [];
    let v = (self.$hi + self.$lo) / 2;
    let y1 = searchStartPos(v);
    let y2 = searchStartNeg(-v);
    let yp = -Infinity;
    let n = height / props.config.GRIDY;
    let q = 1 + (self.$_mult - 1) / 2;
    for (var y$ = y1; y$ > 0; y$ /= self.$_mult) {
      y$ = logRounder(y$, q);
      let y = Math.floor(math.log(y$) * self.A + self.B);
      self.ys.push([y, Utils.strip(y$)]);
      if (y > height)
        break;
      if (y - yp < props.config.GRIDY * 0.7)
        break;
      if (self.ys.length > n + 1)
        break;
      yp = y;
    }
    yp = Infinity;
    for (var y$ = y2; y$ < 0; y$ /= self.$_mult) {
      y$ = logRounder(y$, q);
      let y = Math.floor(math.log(y$) * self.A + self.B);
      if (yp - y < props.config.GRIDY * 0.7)
        break;
      self.ys.push([y, Utils.strip(y$)]);
      if (y < 0)
        break;
      if (self.ys.length > n * 3 + 1)
        break;
      yp = y;
    }
  }
  function searchStartPos(value) {
    let N = height / props.config.GRIDY;
    var y = Infinity, y$ = value, count = 0;
    while (y > 0) {
      y = Math.floor(math.log(y$) * self.A + self.B);
      y$ *= self.$_mult;
      if (count++ > N * 3)
        return 0;
    }
    return y$;
  }
  function searchStartNeg(value) {
    let N = height / props.config.GRIDY;
    var y = -Infinity, y$ = value, count = 0;
    while (y < height) {
      y = Math.floor(math.log(y$) * self.A + self.B);
      y$ *= self.$_mult;
      if (count++ > N * 3)
        break;
    }
    return y$;
  }
  function logRounder(x, quality) {
    let s = Math.sign(x);
    x = Math.abs(x);
    if (x > 10) {
      for (var div = 10; div < MAX_INT; div *= 10) {
        let nice = Math.floor(x / div) * div;
        if (x / nice > quality) {
          break;
        }
      }
      div /= 10;
      return s * Math.floor(x / div) * div;
    } else if (x < 1) {
      for (var ro = 10; ro >= 1; ro--) {
        let nice = Utils.round(x, ro);
        if (x / nice > quality) {
          break;
        }
      }
      return s * Utils.round(x, ro + 1);
    } else {
      return s * Math.floor(x);
    }
  }
  calc$Range();
  calcSidebar();
  calcTransform();
  ls ? gridYLog() : gridY();
  self.scaleSpecs = {
    id,
    log: src.log,
    ovIdxs: src.ovIdxs
  };
  self.height = height;
  return self;
}
const { TIMESCALES, $SCALES, WEEK: WEEK$1, MONTH: MONTH$1, YEAR: YEAR$1, HOUR: HOUR$1, DAY: DAY$1 } = Const;
function GridMaker(id, specs, mainGrid = null) {
  let { hub, meta, props, settings, height } = specs;
  let { interval, timeFrame, range, ctx, timezone } = props;
  let ls = !!settings.logScale;
  let ovs = hub.panes()[id].overlays;
  let data = hub.mainOv.dataSubset;
  let view = hub.mainOv.dataView;
  let self = { indexBased: hub.indexBased };
  function scaleSplit() {
    let scales = unpackScales();
    for (var i = 0; i < ovs.length; i++) {
      let ov = ovs[i];
      let id2 = ov.settings.scale || "A";
      if (!scales[id2]) {
        scales[id2] = defineNewScale(id2);
      }
      scales[id2].ovs.push(ov);
      scales[id2].ovIdxs.push(i);
    }
    return Object.values(scales);
  }
  function unpackScales() {
    let out = {
      "A": defineNewScale("A")
    };
    for (var scaleId in settings.scales || {}) {
      let proto = settings.scales[scaleId];
      out[scaleId] = defineNewScale(scaleId, proto);
    }
    return out;
  }
  function defineNewScale(scaleId, proto = {}) {
    var _a;
    return {
      id: scaleId,
      gridId: id,
      ovs: [],
      ovIdxs: [],
      log: (_a = proto.log) != null ? _a : ls,
      precision: proto.precision
    };
  }
  function calcPositions() {
    if (data.length < 2)
      return;
    let dt = range[1] - range[0];
    self.spacex = props.width - self.sbMax[0] - self.sbMax[1];
    let capacity = dt / interval;
    self.pxStep = self.spacex / capacity;
    let r = self.spacex / dt;
    self.startx = (data[0][0] - range[0]) * r;
  }
  function timeStep() {
    let k = self.indexBased ? timeFrame : 1;
    let xrange = (range[1] - range[0]) * k;
    let m = xrange * (props.config.GRIDX / props.width);
    let s = TIMESCALES;
    return Utils.nearestA(m, s)[1];
  }
  function gridX() {
    if (!mainGrid) {
      calcPositions();
      self.tStep = timeStep();
      self.xs = [];
      const dt = range[1] - range[0];
      const r = self.spacex / dt;
      let realDt = Utils.realTimeRange(data);
      if (!self.indexBased)
        realDt = dt;
      if (self.indexBased && range[1] - view.src.length > 0) {
        let k = 1 - (range[1] - view.src.length) / dt;
        realDt /= k;
      }
      let fixOffset = realDt / DAY$1 > 10;
      let fixOffset2 = realDt / MONTH$1 > 10;
      let i0 = view.i1;
      if (fixOffset2) {
        i0 = findYearStart(view.i1);
      } else if (fixOffset) {
        i0 = findMonthStart(view.i1);
      }
      for (var i = i0, n = view.i2; i <= n; i++) {
        let p = view.src[i];
        let prev = view.src[i - 1] || [];
        let prev_xs = self.xs[self.xs.length - 1] || [0, []];
        let ti = self.indexBased ? i : p[0];
        let x = Math.floor((ti - range[0]) * r);
        insertLine(prev, p, x);
        let xs = self.xs[self.xs.length - 1] || [0, []];
        if (prev_xs === xs)
          continue;
        if (xs[1] - prev_xs[1] < self.tStep * 0.8) {
          if (xs[2] * xs[3] <= prev_xs[2] * prev_xs[3]) {
            self.xs.pop();
          } else {
            self.xs.splice(self.xs.length - 2, 1);
          }
        }
      }
      if (!self.indexBased && timeFrame < WEEK$1 && r > 0) {
        extendLeft(dt, r);
        extendRight(dt, r);
      }
    } else {
      self.tStep = mainGrid.tStep;
      self.pxStep = mainGrid.pxStep;
      self.startx = mainGrid.startx;
      self.spacex = mainGrid.spacex;
      self.xs = mainGrid.xs;
    }
  }
  function findMonthStart(i1) {
    let m0 = Utils.getMonth(view.src[i1][0]);
    for (var i = i1 - 1; i >= 0; i--) {
      let mi = Utils.getMonth(view.src[i][0]);
      if (mi !== m0)
        return i;
    }
    return 0;
  }
  function findYearStart(i1) {
    let y0 = Utils.getYear(view.src[i1][0]);
    for (var i = i1 - 1; i >= 0; i--) {
      let yi = Utils.getYear(view.src[i][0]);
      if (yi !== y0)
        return i;
    }
    return 0;
  }
  function insertLine(prev, p, x, m0) {
    let prevT = prev[0];
    let t = p[0];
    if (timeFrame < DAY$1) {
      prevT += timezone * HOUR$1;
      t += timezone * HOUR$1;
    }
    if ((prev[0] || timeFrame === YEAR$1) && Utils.getYear(t) !== Utils.getYear(prevT)) {
      self.xs.push([x, t, YEAR$1, 1]);
    } else if (prev[0] && Utils.getMonth(t) !== Utils.getMonth(prevT)) {
      self.xs.push([x, t, MONTH$1, 1]);
    } else if (Utils.dayStart(t) === t) {
      let r2 = Utils.getDay(t) === 13 ? 0 : 0.9;
      self.xs.push([x, t, DAY$1, r2]);
    } else if (t % self.tStep === 0) {
      self.xs.push([x, t, timeFrame, 1]);
    }
  }
  function extendLeft(dt, r) {
    if (!self.xs.length || !isFinite(r))
      return;
    let t = self.xs[0][1];
    while (true) {
      t -= self.tStep;
      let x = Math.floor((t - range[0]) * r);
      if (x < 0)
        break;
      if (t % timeFrame === 0) {
        self.xs.unshift([x, t, timeFrame, 1]);
      }
    }
  }
  function extendRight(dt, r) {
    if (!self.xs.length || !isFinite(r))
      return;
    let t = self.xs[self.xs.length - 1][1];
    while (true) {
      t += self.tStep;
      let x = Math.floor((t - range[0]) * r);
      if (x > self.spacex)
        break;
      if (t % interval === 0) {
        self.xs.push([x, t, interval, 1]);
      }
    }
  }
  function applySizes() {
    self.width = props.width - self.sbMax[0] - self.sbMax[1];
    self.height = height;
  }
  function makeScales() {
    let scales = {};
    for (var src of scaleSplit()) {
      let scale = new Scale(src.id, src, specs);
      scales[src.id] = scale;
    }
    self.scales = scales;
  }
  function selectSidebars() {
    if (!self.scales[settings.scaleIndex]) {
      settings.scaleIndex = "A";
    }
    self.scaleIndex = settings.scaleIndex;
    if (!settings.scaleTemplate) {
      settings.scaleTemplate = [[], Object.keys(self.scales)];
    }
    let sides = settings.scaleTemplate;
    if (!sides[0] || !sides[1]) {
      console.error("Define scaleTemplate as [[],[]]");
    }
    if (!settings.scaleSideIdxs) {
      settings.scaleSideIdxs = [];
    }
    let idxs = settings.scaleSideIdxs;
    Utils.autoScaleSideId(0, sides, idxs);
    Utils.autoScaleSideId(1, sides, idxs);
    self.sb = [];
    let lid = sides[0].includes(idxs[0]) ? idxs[0] : null;
    self.sb.push(self.scales[lid] ? self.scales[lid].sb : 0);
    let rid = sides[1].includes(idxs[1]) ? idxs[1] : null;
    self.sb.push(self.scales[rid] ? self.scales[rid].sb : 0);
  }
  function mergeScale() {
    let sb2 = self.sb;
    Object.assign(self, self.scales[self.scaleIndex]);
    self.sb = sb2;
    self.ys = self.ys || [];
  }
  makeScales();
  selectSidebars();
  return {
    // First we need to calculate max sidebar width
    // (among all grids). Then we can actually make
    // them
    create: () => {
      gridX();
      applySizes();
      if (mainGrid) {
        self.mainGrid = mainGrid;
      }
      self.settings = settings;
      self.main = !mainGrid;
      self.id = id;
      mergeScale();
      self.ohlc = meta.ohlc.bind(meta);
      return layoutFn(self, range);
    },
    getLayout: () => self,
    setMaxSidebar: (v) => self.sbMax = v,
    getSidebar: () => self.sb,
    id: () => id
  };
}
const minHeight$1 = 100;
function Layout(props, hub, meta, sizes) {
  let chart = hub.chart;
  let offchart = hub.offchart;
  let panes = hub.panes().filter((x) => x.settings);
  if (!chart)
    return {};
  function gridHs() {
    const height = props.height - props.config.BOTBAR;
    if (panes.find((x) => x.settings.height)) {
      return weightedHs(height);
    }
    const n = offchart.length;
    const off_h = 2 * Math.sqrt(n) / 7 / (n || 1);
    const px = Math.floor(height * off_h);
    const m = height - px * n;
    let hs2 = Array(n + 1).fill(px);
    hs2[hub.mainPaneId] = m;
    return hs2;
  }
  function weightedHs(height) {
    let hs2 = hub.panes().map((x) => {
      var _a;
      return (_a = x.settings.height) != null ? _a : 1;
    });
    let sum = hs2.reduce((a, b) => a + b, 0);
    hs2 = hs2.map((x) => Math.floor(x / sum * height));
    sum = hs2.reduce((a, b) => a + b, 0);
    for (var i2 = 0; i2 < height - sum; i2++)
      hs2[i2 % hs2.length]++;
    return hs2;
  }
  const hs = gridHs();
  let specs = (i2) => {
    let paneHeight = hs[i2];
    if (typeof sizes !== void 0 && Array.isArray(sizes)) {
      if (typeof sizes[i2] !== void 0) {
        if (hs[i2] + sizes[i2] < minHeight$1) {
          paneHeight = minHeight$1;
        } else {
          paneHeight = hs[i2] + sizes[i2];
        }
      }
    }
    console.log("aici", i2, paneHeight, sizes);
    return {
      hub,
      meta,
      props,
      settings: panes[i2].settings,
      height: paneHeight
    };
  };
  let mainGm = new GridMaker(
    hub.mainPaneId,
    specs(hub.mainPaneId)
  );
  let gms = [mainGm];
  for (var [i, pane] of panes.entries()) {
    if (i !== hub.mainPaneId) {
      gms.push(
        new GridMaker(
          i,
          specs(i),
          mainGm.getLayout()
        )
      );
    }
  }
  let sb2 = [
    Math.max(...gms.map((x) => x.getSidebar()[0])),
    Math.max(...gms.map((x) => x.getSidebar()[1]))
  ];
  let grids = [], offset = 0;
  for (var i = 0; i < gms.length; i++) {
    let id = gms[i].id();
    gms[i].setMaxSidebar(sb2);
    grids[id] = gms[i].create();
  }
  for (var i = 0; i < grids.length; i++) {
    grids[i].offset = offset;
    offset += grids[i].height;
  }
  return {
    grids,
    main: grids.find((x) => x.main),
    indexBased: hub.indexBased,
    botbar: {
      width: props.width,
      height: props.config.BOTBAR,
      offset,
      xs: grids[0] ? grids[0].xs : []
    }
  };
}
function Context($p) {
  let el = document.createElement("canvas");
  let ctx = el.getContext("2d");
  ctx.font = $p.config.FONT;
  return ctx;
}
class Mouse {
  constructor(core) {
    const l = core.layout;
    this.core = core;
    this.map = {};
    this.listeners = 0;
    this.pressed = false;
    this.x = core.cursor.x;
    this.y = core.cursor.y;
    this.t = core.cursor.t;
    this.y$ = l.y2value(core.cursor.y);
  }
  // You can choose where to place the handler
  // (beginning or end of the queue)
  on(name, handler, dir = "unshift") {
    if (!handler)
      return;
    this.map[name] = this.map[name] || [];
    this.map[name][dir](handler);
    this.listeners++;
  }
  off(name, handler) {
    if (!this.map[name])
      return;
    let i = this.map[name].indexOf(handler);
    if (i < 0)
      return;
    this.map[name].splice(i, 1);
    this.listeners--;
  }
  // Called by Grid.svelte
  emit(name, event) {
    const l = this.core.layout;
    if (name in this.map) {
      for (var f of this.map[name]) {
        f(event);
      }
    }
    if (name === "mousemove") {
      this.x = event.layerX;
      this.y = event.layerY;
      this.t = l.x2time(this.x);
      this.y$ = l.y2value(this.y);
    }
    if (name === "mousedown") {
      this.pressed = true;
    }
    if (name === "mouseup") {
      this.pressed = false;
    }
  }
}
class Keys {
  constructor(core) {
    this.core = core;
    this.map = {};
    this.listeners = 0;
    this.keymap = {};
  }
  on(name, handler) {
    if (!handler)
      return;
    this.map[name] = this.map[name] || [];
    this.map[name].push(handler);
    this.listeners++;
  }
  // Called by Grid.svelte
  emit(name, event) {
    if (name in this.map) {
      for (var f of this.map[name]) {
        f(event);
      }
    }
    if (name === "keydown") {
      if (!this.keymap[event.key]) {
        this.emit(event.key);
      }
      this.keymap[event.key] = true;
    }
    if (name === "keyup") {
      this.keymap[event.key] = false;
    }
  }
  pressed(key) {
    return !!this.keymap[key];
  }
}
Const.HPX;
class Candle {
  constructor(core, props, ctx, data) {
    this.ctx = ctx;
    this.core = core;
    this.style = data.src[6] || props;
    this.draw(data);
  }
  draw(data) {
    const green = data.src[4] >= data.src[1];
    const bodyColor = green ? this.style.colorCandleUp : this.style.colorCandleDw;
    const wickColor = green ? this.style.colorWickUp : this.style.colorWickDw;
    let w = Math.max(data.w, 1);
    let x05 = data.x - 1;
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = wickColor;
    this.ctx.beginPath();
    this.ctx.moveTo(x05, Math.floor(data.h));
    this.ctx.lineTo(x05, Math.floor(data.l));
    this.ctx.stroke();
    this.ctx.lineWidth = w;
    this.ctx.strokeStyle = bodyColor;
    this.ctx.beginPath();
    this.ctx.moveTo(
      x05,
      Math.floor(Math.min(data.o, data.c))
    );
    this.ctx.lineTo(
      x05,
      Math.floor(Math.max(data.o, data.c)) + (data.o === data.c ? 1 : 0)
    );
    this.ctx.stroke();
  }
}
function candleBody(ctx, data) {
  let x05 = data.x - 1;
  ctx.moveTo(
    x05,
    Math.floor(Math.min(data.o - 1, data.c - 1))
  );
  ctx.lineTo(
    x05,
    Math.floor(Math.max(data.o, data.c))
    //+ (data.o === data.c ? 1 : 0)
  );
}
function candleWick(ctx, data) {
  let x05 = data.x - 1;
  ctx.moveTo(x05, Math.floor(data.h));
  ctx.lineTo(x05, Math.floor(data.l));
}
const HPX$6 = Const.HPX;
function volumeBar(ctx, data, layout) {
  let y0 = layout.height;
  let w = Math.max(1, data.x2 - data.x1 + HPX$6);
  let h = data.h;
  let x05 = (data.x2 + data.x1) * 0.5;
  ctx.lineWidth = w;
  ctx.moveTo(x05, y0 - h);
  ctx.lineTo(x05, y0);
}
const HPX$5 = Const.HPX;
class VolbarExt {
  constructor(core, props, ctx, data) {
    this.ctx = ctx;
    this.style = data.src[6] || props;
    this.layout = core.layout;
    this.draw(data);
  }
  draw(data) {
    let y0 = this.layout.height;
    let w = data.x2 - data.x1;
    let h = Math.floor(data.h);
    this.ctx.fillStyle = data.green ? this.style.colorVolUp : this.style.colorVolDw;
    this.ctx.fillRect(
      Math.floor(data.x1),
      Math.floor(y0 - h + HPX$5),
      Math.floor(w),
      Math.floor(h + 1)
    );
  }
}
const HPX$4 = Const.HPX;
function layoutCnv(core, $c = true, $v = true, vIndex = 5, dirIndex, vScale) {
  let config = core.props.config;
  let interval = core.props.interval;
  let data = core.data;
  let ti2x = core.layout.ti2x;
  let layout = core.layout;
  let view = core.view;
  let ls = layout.scaleSpecs.log;
  let upBodies = [];
  let dwBodies = [];
  let upWicks = [];
  let dwWicks = [];
  let upVolbars = [];
  let dwVolbars = [];
  if ($v) {
    var volScale = vScale != null ? vScale : config.VOLSCALE;
    var maxv = maxVolume(core.dataSubset, vIndex);
    var vs = volScale * layout.height / maxv;
  }
  var x1, x2, mid, prev = void 0;
  let { A, B, pxStep } = layout;
  let w = pxStep * config.CANDLEW;
  let splitter = pxStep > 5 ? 1 : 0;
  for (var i = view.i1, n = view.i2; i <= n; i++) {
    let p = data[i];
    let green = dirIndex ? p[dirIndex] > 0 : p[4] >= p[1];
    mid = ti2x(p[0], i) + 1;
    if (data[i - 1] && p[0] - data[i - 1][0] > interval) {
      prev = null;
    }
    if ($c) {
      let candle = ls ? {
        x: mid,
        w,
        o: Math.floor(math.log(p[1]) * A + B),
        h: Math.floor(math.log(p[2]) * A + B),
        l: Math.floor(math.log(p[3]) * A + B),
        c: Math.floor(math.log(p[4]) * A + B),
        green,
        src: p
      } : {
        x: mid,
        w,
        o: Math.floor(p[1] * A + B),
        h: Math.floor(p[2] * A + B),
        l: Math.floor(p[3] * A + B),
        c: Math.floor(p[4] * A + B),
        green,
        src: p
      };
      if (green) {
        upBodies.push(candle);
        upWicks.push(candle);
      } else {
        dwBodies.push(candle);
        dwWicks.push(candle);
      }
    }
    if ($v) {
      x1 = prev || Math.floor(mid - pxStep * 0.5);
      x2 = Math.floor(mid + pxStep * 0.5) + HPX$4;
      let volbar = {
        x1,
        x2,
        h: p[vIndex] * vs,
        green,
        src: p
      };
      if (green) {
        upVolbars.push(volbar);
      } else {
        dwVolbars.push(volbar);
      }
    }
    prev = x2 + splitter;
  }
  return {
    upBodies,
    upWicks,
    dwBodies,
    dwWicks,
    upVolbars,
    dwVolbars,
    maxVolume: maxv,
    volScale: vs
  };
}
function maxVolume(data, index) {
  let max = 0;
  for (var i = 0; i < data.length; i++) {
    let val = data[i][index];
    if (val > max)
      max = val;
  }
  return max;
}
function fastSma(data, di, i0, iN, length) {
  let acc = 0;
  let out = [];
  let counter = 0;
  let mult = 1 / length;
  let start = Math.max(i0 - length, 0);
  for (var i = start; i <= iN; i++) {
    acc += data[i][di];
    counter++;
    if (counter > length) {
      acc -= data[i - length][di];
      counter--;
    }
    if (counter === length) {
      out.push([data[i][0], acc * mult]);
    }
  }
  return out;
}
function candleColor(props, candle = []) {
  if (candle[4] >= candle[1]) {
    return props.colorBodyUp;
  } else {
    return props.colorBodyDw;
  }
}
function rescaleFont(fontString, newSize) {
  let pair = fontString.split("px");
  return newSize + "px" + pair[1];
}
function avgVolume(ctx, core, props, cnv, vIndex = 5) {
  let i1 = core.view.i1;
  let i2 = core.view.i2;
  let len = props.avgVolumeSMA;
  let sma = fastSma(core.data, vIndex, i1, i2, len);
  let layout = core.layout;
  cnv.maxVolume;
  let vs = cnv.volScale;
  let h = layout.height;
  core.props.config.VOLSCALE * 0.5 * h;
  ctx.lineJoin = "round";
  ctx.lineWidth = 0.75;
  ctx.strokeStyle = props.colorAvgVol;
  ctx.beginPath();
  if (core.layout.indexBased)
    return;
  let offset = core.data.length - sma.length;
  for (var i = 0, n = sma.length; i < n; i++) {
    let x = layout.ti2x(sma[i][0], i + offset);
    let y = h - sma[i][1] * vs;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}
function roundRect$2(ctx, x, y, width, height, radius, fill = true, stroke) {
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}
function drawArrow(context, fromX, fromY, toX, toY, color, head = true) {
  const headLength = 7;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  if (head) {
    context.moveTo(toX, toY);
    context.lineTo(toX - headLength * Math.cos(angle - Math.PI / 5), toY - headLength * Math.sin(angle - Math.PI / 5));
    context.moveTo(toX, toY);
    context.lineTo(toX - headLength * Math.cos(angle + Math.PI / 5), toY - headLength * Math.sin(angle + Math.PI / 5));
  }
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.stroke();
}
class TrendLine {
  constructor(core, line, nw = false) {
    this.core = core;
    this.data = line;
    this.hover = false;
    this.selected = false;
    this.onSelect = () => {
    };
    switch (line.type) {
      case "segment":
        this.line = new core.lib.Segment(core);
        break;
    }
    this.pins = [
      new core.lib.Pin(core, this, "p1"),
      new core.lib.Pin(core, this, "p2")
    ];
    if (nw)
      this.pins[1].state = "tracking";
  }
  draw(ctx) {
    this.line.update(this.data.p1, this.data.p2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#33ff33";
    ctx.beginPath();
    this.line.draw(ctx);
    ctx.stroke();
    if (this.hover || this.selected) {
      for (var pin of this.pins) {
        pin.draw(ctx);
      }
    }
  }
  collision() {
    const mouse = this.core.mouse;
    let [x, y] = [mouse.x, mouse.y];
    return this.line.collision(x, y);
  }
  propagate(name, data) {
    for (var pin of this.pins) {
      pin[name](data);
    }
  }
  mousedown(event) {
    this.propagate("mousedown", event);
    if (this.collision()) {
      this.onSelect(this.data.uuid);
    }
  }
  mouseup(event) {
    this.propagate("mouseup", event);
  }
  mousemove(event) {
    this.hover = this.collision();
    this.propagate("mousemove", event);
  }
}
class Segment {
  // Overlay ref, canvas ctx
  constructor(core) {
    this.T = core.props.config.TOOL_COLL;
    this.core = core;
  }
  // Update line coordinates
  update(p1, p2) {
    const layout = this.core.layout;
    this.x1 = layout.time2x(p1[0]);
    this.y1 = layout.value2y(p1[1]);
    this.x2 = layout.time2x(p2[0]);
    this.y2 = layout.value2y(p2[1]);
  }
  // p1[t, $], p2[t, $] (time-price coordinates)
  // TODO: fix for index-based
  draw(ctx) {
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
  }
  // Collision function. x, y - mouse coord.
  collision(x, y) {
    return math.point2seg(
      [x, y],
      [this.x1, this.y1],
      [this.x2, this.y2]
    ) < this.T;
  }
}
class Pin {
  constructor(core, line, name, params = {}) {
    this.RADIUS = core.props.config.PIN_RADIUS;
    this.RADIUS_SQ = Math.pow(this.RADIUS + 7, 2);
    if (core.lib.Utils.isMobile) {
      this.RADIUS += 2;
      this.RADIUS_SQ *= 2.5;
    }
    this.COLOR_BACK = core.colors.back;
    this.COLOR_BR = core.colors.text;
    this.core = core;
    this.line = line;
    this.data = line.data;
    this.name = name;
    this.state = params.state || "settled";
    this.hidden = params.hidden || false;
    this.mouse = this.core.mouse;
    this.init();
  }
  // Init from data
  init() {
    if (this.data && this.data[this.name]) {
      let p = this.data[this.name];
      this.t = p[0];
      this.y$ = p[1];
    }
  }
  draw(ctx) {
    if (this.hidden)
      return;
    switch (this.state) {
      case "tracking":
        break;
      case "dragging":
        if (!this.moved)
          this.draw_circle(ctx);
        break;
      case "settled":
        this.draw_circle(ctx);
        break;
    }
  }
  draw_circle(ctx) {
    if (this.line.selected) {
      var r = this.RADIUS, lw = 1.5;
    } else {
      var r = this.RADIUS * 0.95, lw = 1;
    }
    ctx.lineWidth = lw;
    ctx.strokeStyle = this.COLOR_BR;
    ctx.fillStyle = this.COLOR_BACK;
    ctx.beginPath();
    ctx.arc(
      this.x = this.core.layout.time2x(this.t),
      this.y = this.core.layout.value2y(this.y$),
      r + 0.5,
      0,
      Math.PI * 2,
      true
    );
    ctx.fill();
    ctx.stroke();
  }
  update() {
    let y$ = this.core.layout.y2value(this.core.cursor.y);
    this.x = this.core.cursor.x;
    this.y = this.core.cursor.y;
    this.t = this.core.cursor.time;
    this.y$ = y$;
    this.data[this.name] = [this.t, this.y$];
  }
  mousemove(event) {
    switch (this.state) {
      case "tracking":
      case "dragging":
        this.moved = true;
        this.update();
        break;
    }
  }
  mousedown(event, force = false) {
    const Utils2 = this.core.lib.Utils;
    if (Utils2.defaultPrevented(event) && !force)
      return;
    switch (this.state) {
      case "tracking":
        this.state = "settled";
        if (this.onSettled)
          this.onSettled();
        this.core.events.emit("scroll-lock", false);
        break;
      case "settled":
        if (this.hidden)
          return;
        if (this.hover()) {
          this.state = "dragging";
          this.moved = false;
          this.core.events.emit("scroll-lock", true);
        }
        break;
    }
    if (this.hover()) {
      event.preventDefault();
    }
  }
  mouseup(event) {
    switch (this.state) {
      case "dragging":
        this.state = "settled";
        if (this.onSettled)
          this.onSettled();
        this.core.events.emit("scroll-lock", false);
        break;
    }
  }
  on(name, handler) {
    switch (name) {
      case "settled":
        this.onSettled = handler;
        break;
    }
  }
  hover() {
    let x = this.x;
    let y = this.y;
    return (x - this.mouse.x) * (x - this.mouse.x) + (y - this.mouse.y) * (y - this.mouse.y) < this.RADIUS_SQ;
  }
}
const formatCash = Utils.formatCash;
class OverlayEnv {
  // TODO: auto update on prop/data change
  constructor(id, ovSrc, layout, props) {
    let hub = DataHub$1.instance(props.id);
    let meta = MetaHub$1.instance(props.id);
    let events = Events$1.instance(props.id);
    let scan = DataScan.instance(props.id);
    this.ovSrc = ovSrc;
    this.overlay = null;
    this.id = id;
    this.handlers = {};
    this.$core = { hub, meta, scan, events };
    this.update(ovSrc, layout, props);
    this.$props = ovSrc.props;
    this.$events = events;
    this.$core.mouse = new Mouse(this.$core);
    this.$core.keys = new Keys(this.$core);
    this.lib = {
      Candle,
      Volbar: VolbarExt,
      layoutCnv,
      formatCash,
      candleBody,
      candleWick,
      volumeBar,
      fastSma,
      avgVolume,
      candleColor,
      roundRect: roundRect$2,
      rescaleFont,
      drawArrow,
      TrendLine,
      Segment,
      Pin,
      Utils
    };
    this.$core.lib = this.lib;
  }
  // Defines new property
  prop(name, obj = {}) {
    if (!(name in this.$props)) {
      this.$props[name] = obj.def;
    }
  }
  // Update evnironment variables
  update(overlay, layout, props) {
    if (!layout)
      return;
    let core = this.$core;
    core.layout = this.buildLayout(
      layout,
      props.range,
      overlay
    );
    core.dataSubset = overlay.dataSubset;
    core.data = overlay.data;
    core.view = overlay.dataView;
    core.dataExt = overlay.dataExt;
    core.id = overlay.id;
    core.paneId = core.layout.id;
    core.uuid = overlay.uuid;
    core.range = props.range;
    core.colors = props.colors;
    core.cursor = props.cursor;
    core.src = overlay;
    core.props = props;
    core.indexOffset = overlay.indexOffset;
  }
  // Build the final layout API by merging
  // the selected scale to the rest layout
  // variables
  buildLayout(layout, range, overlay) {
    let obj = {};
    this.scaleId = /*this.scaleId !== undefined ?
    this.scaleId :*/
    this.getScaleId(layout);
    let s = layout.scales[this.scaleId];
    return layoutFn(
      Object.assign(obj, layout, s),
      range,
      overlay
    );
  }
  // Get the scale id of this overlay
  getScaleId(layout) {
    let scales = layout.scales;
    for (var i in scales) {
      let ovIdxs = scales[i].scaleSpecs.ovIdxs;
      if (ovIdxs.includes(this.id)) {
        return i;
      }
    }
  }
  watchProp(propName, handler) {
    this.handlers[propName] = this.handlers[propName] || [];
    this.handlers[propName].push(handler);
    let oldValue = this.$props[propName];
    delete this.$props[propName];
    Object.defineProperty(this.$props, propName, {
      get: () => oldValue,
      set: (newValue) => {
        let tmp = oldValue;
        oldValue = newValue;
        for (let handler2 of this.handlers[propName]) {
          handler2(newValue, tmp);
        }
      },
      enumerable: true,
      configurable: true
    });
  }
  destroy() {
    for (let prop in this.handlers) {
      let value = this.$props[prop];
      delete this.$props[prop];
      this.$props[prop] = value;
    }
    this.handlers = {};
  }
}
class Layer {
  constructor(id, name, nvId) {
    this.id = id;
    this.nvId = nvId;
    this.name = name;
    this.zIndex = 0;
    this.overlay = null;
    this.ovSrc = null;
    this.env = null;
    this.ctxType = null;
    this.display = true;
    this.opacity = void 0;
  }
  update() {
    var _a;
    if (!this.ovSrc)
      return;
    this.display = (_a = this.ovSrc.settings.display) != null ? _a : true;
  }
}
class FrameAnimation {
  constructor(cb) {
    this.t0 = this.t = Utils.now();
    this.id = setInterval(() => {
      if (Utils.now() - this.t > 100)
        return;
      if (Utils.now() - this.t0 > 1200) {
        this.stop();
      }
      if (this.id)
        cb(this);
      this.t = Utils.now();
    }, 16);
  }
  stop() {
    clearInterval(this.id);
    this.id = null;
  }
}
let recentEventFrom = "key";
let recentFocusFrom = recentEventFrom;
let recentTouch = false;
let recentMouse = false;
let recentWindowFocus = false;
let recentTouchTimeoutId;
const setRecentEventFromTouch = (touchDelay) => {
  recentTouch = true;
  recentEventFrom = "touch";
  window.clearTimeout(recentTouchTimeoutId);
  recentTouchTimeoutId = window.setTimeout(() => {
    recentTouch = false;
  }, touchDelay);
};
let recentMouseTimeoutId;
const setRecentEventFromMouse = () => {
  recentMouse = true;
  recentEventFrom = "mouse";
  window.clearTimeout(recentMouseTimeoutId);
  recentMouseTimeoutId = window.setTimeout(() => {
    recentMouse = false;
  }, 200);
};
const handleTouchEvent = (touchDelay) => () => setRecentEventFromTouch(touchDelay);
const handlePointerEvent = (touchDelay) => (e) => {
  switch (e.pointerType) {
    case "mouse":
      setRecentEventFromMouse();
      break;
    case "pen":
    case "touch":
      setRecentEventFromTouch(touchDelay);
      break;
  }
};
const handleMouseEvent = () => {
  if (!recentTouch) {
    setRecentEventFromMouse();
  }
};
const handleKeyEvent = () => {
  recentEventFrom = "key";
};
let recentWindowFocusTimeoutId;
const handleWindowFocusEvent = (e) => {
  if (e.target === window || e.target === document) {
    recentWindowFocus = true;
    window.clearTimeout(recentWindowFocusTimeoutId);
    recentWindowFocusTimeoutId = window.setTimeout(() => {
      recentWindowFocus = false;
    }, 300);
  }
};
const handleDocumentFocusEvent = () => {
  if (!recentWindowFocus || recentMouse || recentTouch) {
    recentFocusFrom = recentEventFrom;
  }
};
const listenerOptions = { capture: true, passive: true };
const documentListeners = [
  ["touchstart", handleTouchEvent(750)],
  ["touchend", handleTouchEvent(300)],
  ["touchcancel", handleTouchEvent(300)],
  ["pointerenter", handlePointerEvent(300)],
  ["pointerover", handlePointerEvent(300)],
  ["pointerout", handlePointerEvent(300)],
  ["pointerleave", handlePointerEvent(300)],
  ["pointerdown", handlePointerEvent(750)],
  ["pointerup", handlePointerEvent(300)],
  ["pointercancel", handlePointerEvent(300)],
  ["mouseenter", handleMouseEvent],
  ["mouseover", handleMouseEvent],
  ["mouseout", handleMouseEvent],
  ["mouseleave", handleMouseEvent],
  ["mousedown", handleMouseEvent],
  ["mouseup", handleMouseEvent],
  ["keydown", handleKeyEvent],
  ["keyup", handleKeyEvent],
  ["focus", handleDocumentFocusEvent]
];
if (typeof window !== "undefined" && typeof document !== "undefined") {
  documentListeners.forEach(([eventName, eventHandler]) => {
    document.addEventListener(eventName, eventHandler, listenerOptions);
  });
  window.addEventListener("focus", handleWindowFocusEvent, listenerOptions);
}
const eventFrom = (event) => {
  switch (event.pointerType) {
    case "mouse":
      setRecentEventFromMouse();
      break;
    case "pen":
    case "touch":
      if (!recentTouch) {
        setRecentEventFromTouch(300);
      } else {
        recentEventFrom = "touch";
      }
      break;
  }
  if (/mouse/.test(event.type) && !recentTouch) {
    setRecentEventFromMouse();
  }
  if (/touch/.test(event.type)) {
    if (!recentTouch) {
      setRecentEventFromTouch(300);
    } else {
      recentEventFrom = "touch";
    }
  }
  if (/focus/.test(event.type)) {
    return recentFocusFrom;
  }
  return recentEventFrom;
};
class Input {
  async setup(comp) {
    this.MIN_ZOOM = comp.props.config.MIN_ZOOM;
    this.MAX_ZOOM = comp.props.config.MAX_ZOOM;
    if (Utils.isMobile)
      this.MIN_ZOOM *= 0.5;
    this.canvas = comp.canvas;
    this.ctx = comp.ctx;
    this.props = comp.props;
    this.layout = comp.layout;
    this.rrId = comp.rrUpdId;
    this.gridUpdId = comp.gridUpdId;
    this.gridId = comp.id;
    this.cursor = {};
    this.oldMeta = {};
    this.range = this.props.range;
    this.interval = this.props.interval;
    this.offsetX = 0;
    this.offsetY = 0;
    this.deltas = 0;
    this.wmode = this.props.config.SCROLL_WHEEL;
    this.hub = DataHub$1.instance(this.props.id);
    this.meta = MetaHub$1.instance(this.props.id);
    this.events = Events$1.instance(this.props.id);
    await this.listeners();
    this.mouseEvents("addEventListener");
  }
  mouseEvents(cmd) {
    ["mousemove", "mouseout", "mouseup", "mousedown", "click"].forEach((e) => {
      if (cmd === "addEventListener") {
        this["_" + e] = this[e].bind(this);
      }
      this.canvas[cmd](e, this["_" + e]);
    });
  }
  async listeners() {
    const Hamster = await import("./hamster-9ea565fa.js").then((n) => n.h);
    const Hammer = await import("./hammer-3fb3a109.js").then((n) => n.h);
    this.hm = Hamster.default(this.canvas);
    this.hm.wheel((event, delta) => this.mousezoom(-delta * 50, event));
    let mc = this.mc = new Hammer.Manager(this.canvas);
    let T = Utils.isMobile ? 10 : 0;
    mc.add(new Hammer.Pan({ threshold: T }));
    mc.add(new Hammer.Tap());
    mc.add(new Hammer.Pinch({ threshold: 0 }));
    mc.get("pinch").set({ enable: true });
    if (Utils.isMobile)
      mc.add(new Hammer.Press());
    mc.on("panstart", (event) => {
      if (this.cursor.scroll_lock)
        return;
      if (this.cursor.mode === "aim") {
        return this.emitCursorCoord(event);
      }
      let scaleId = this.layout.scaleIndex;
      let tfrm = this.meta.getYtransform(this.gridId, scaleId);
      this.drug = {
        x: event.center.x + this.offsetX,
        y: event.center.y + this.offsetY,
        r: this.range.slice(),
        t: this.range[1] - this.range[0],
        o: tfrm ? tfrm.offset || 0 : 0,
        y_r: tfrm && tfrm.range ? tfrm.range.slice() : void 0,
        B: this.layout.B,
        t0: Utils.now()
      };
      this.events.emit("cursor-locked", true);
      this.events.emit("cursor-changed", {
        gridId: this.gridId,
        x: event.center.x + this.offsetX,
        y: event.center.y + this.offsetY
      });
    });
    mc.on("panmove", (event) => {
      if (Utils.isMobile) {
        this.calcOffset();
        this.propagate("mousemove", this.touch2mouse(event));
      }
      if (this.drug) {
        this.mousedrag(
          this.drug.x + event.deltaX,
          this.drug.y + event.deltaY
        );
      } else if (this.cursor.mode === "aim") {
        this.emitCursorCoord(event);
      }
    });
    mc.on("panend", (event) => {
      if (Utils.isMobile && this.drug) {
        this.panFade(event);
      }
      this.drug = null;
      this.events.emit("cursor-locked", false);
    });
    mc.on("tap", (event) => {
      if (!Utils.isMobile)
        return;
      this.simMousedown(event);
      if (this.fade)
        this.fade.stop();
      this.events.emit("cursor-changed", {});
      this.events.emit("cursor-changed", {
        mode: "explore"
      });
      this.events.emitSpec(this.rrId, "update-rr");
    });
    mc.on("pinchstart", () => {
      this.drug = null;
      this.pinch = {
        t: this.range[1] - this.range[0],
        r: this.range.slice()
      };
    });
    mc.on("pinchend", () => {
      this.pinch = null;
    });
    mc.on("pinch", (event) => {
      if (this.pinch)
        this.pinchZoom(event.scale);
    });
    mc.on("press", (event) => {
      if (!Utils.isMobile)
        return;
      if (this.fade)
        this.fade.stop();
      this.calcOffset();
      this.emitCursorCoord(event, { mode: "aim" });
      setTimeout(() => this.events.emitSpec(this.rrId, "update-rr"));
      this.simMousedown(event);
    });
    let add = this.canvas.addEventListener;
    add("gesturestart", this.gesturestart);
    add("gesturechange", this.gesturechange);
    add("gestureend", this.gestureend);
  }
  gesturestart(event) {
    event.preventDefault();
  }
  gesturechange(event) {
    event.preventDefault();
  }
  gestureend(event) {
    event.preventDefault();
  }
  mousemove(event) {
    if (Utils.isMobile)
      return;
    event = Utils.adjustMouse(event, this.canvas);
    this.events.emit("cursor-changed", {
      visible: true,
      gridId: this.gridId,
      x: event.layerX,
      y: event.layerY - 1
      // Align with the crosshair
    });
    this.calcOffset();
    this.events.emit("mousemove", event);
    this.propagate("mousemove", event);
  }
  simulateMousemove(event) {
    event.from = eventFrom(event);
    if (event.from === "mouse")
      return;
    this.events.emit("mousemove", this.touch2mouse(event));
    this.propagate("mousemove", this.touch2mouse(event));
  }
  mouseout(event) {
    if (Utils.isMobile)
      return;
    event = Utils.adjustMouse(event, this.canvas);
    this.events.emit("cursor-changed", { visible: false });
    this.propagate("mouseout", event);
  }
  mouseup(event) {
    event = Utils.adjustMouse(event, this.canvas);
    this.drug = null;
    this.events.emit("cursor-locked", false);
    this.propagate("mouseup", event);
  }
  simulateMouseup(event) {
    event.from = eventFrom(event);
    if (event.from === "mouse")
      return;
    this.drug = null;
    this.events.emit("mouseup", this.touch2mouse(event));
    this.propagate("mouseup", this.touch2mouse(event));
  }
  mousedown(event) {
    event = Utils.adjustMouse(event, this.canvas);
    if (Utils.isMobile)
      return;
    this.events.emit("cursor-locked", true);
    this.propagate("mousedown", event);
    if (event.defaultPrevented)
      return;
    this.events.emit("grid-mousedown", [this.gridId, event]);
  }
  // Simulated mousedown (for mobile)
  simMousedown(event) {
    event = Utils.adjustMouse(event, this.canvas);
    if (event.srcEvent.defaultPrevented)
      return;
    this.events.emit("grid-mousedown", [this.gridId, event]);
    this.propagate("mousemove", this.touch2mouse(event));
    this.events.emitSpec(this.rrId, "update-rr");
    this.propagate("mousedown", this.touch2mouse(event));
    setTimeout(() => {
      this.propagate("click", this.touch2mouse(event));
    });
  }
  // Convert touch to "mouse" event
  touch2mouse(e) {
    this.calcOffset();
    return {
      original: e.srcEvent,
      layerX: e.center.x + this.offsetX,
      layerY: e.center.y + this.offsetY,
      preventDefault: function() {
        this.original.preventDefault();
      }
    };
  }
  click(event) {
    event.from = eventFrom(event);
    if (event.from !== "mouse")
      return;
    this.events.emit("click", event);
    this.propagate("click", event);
  }
  simulateClick(event) {
    event.from = eventFrom(event);
    if (event.from === "mouse")
      return;
    this.events.emit("click", this.touch2mouse(event));
    this.propagate("click", this.touch2mouse(event));
  }
  emitCursorCoord(event, add = {}) {
    this.events.emit("cursor-changed", Object.assign({
      gridId: this.gridId,
      x: event.center.x + this.offsetX,
      y: event.center.y + this.offsetY
      //+ this.layout.offset
    }, add));
  }
  panFade(event) {
    let dt = Utils.now() - this.drug.t0;
    let dx = this.range[1] - this.drug.r[1];
    let v = 42 * dx / dt;
    let v0 = Math.abs(v * 0.01);
    if (dt > 500)
      return;
    if (this.fade)
      this.fade.stop();
    this.fade = new FrameAnimation((self) => {
      v *= 0.85;
      if (Math.abs(v) < v0) {
        self.stop();
      }
      this.range[0] += v;
      this.range[1] += v;
      this.changeRange();
    });
  }
  calcOffset() {
    let rect = this.canvas.getBoundingClientRect();
    this.offsetX = -rect.x;
    this.offsetY = -rect.y;
  }
  mousezoom(delta, event) {
    var _a;
    if (this.meta.scrollLock)
      return;
    if (event.originalEvent.shiftKey) {
      this.mouseScroll(event);
      return;
    }
    if (this.wmode !== "pass") {
      if (this.wmode === "click" && !this.oldMeta.activated) {
        return;
      }
      event.originalEvent.preventDefault();
      event.preventDefault();
    }
    event.deltaX = event.deltaX || Utils.getDeltaX(event);
    event.deltaY = event.deltaY || Utils.getDeltaY(event);
    if (Math.abs(event.deltaX) > 0) {
      this.trackpad = true;
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        delta *= 0.1;
      }
      this.trackpadScroll(event);
    }
    if (this.trackpad)
      delta *= 0.032;
    delta = Utils.smartWheel(delta);
    const dpr2 = (_a = window.devicePixelRatio) != null ? _a : 1;
    let data = this.hub.mainOv.dataSubset;
    if (delta < 0 && data.length <= this.MIN_ZOOM)
      return;
    if (delta > 0 && data.length > this.MAX_ZOOM)
      return;
    let k = this.interval / 1e3;
    let diff = delta * k * data.length;
    let tl = this.props.config.ZOOM_MODE === "tl";
    if (event.originalEvent.ctrlKey || tl) {
      let offset = event.originalEvent.offsetX;
      let diff1 = offset / (this.canvas.width / dpr2 - 1) * diff;
      let diff2 = diff - diff1;
      this.range[0] -= diff1;
      this.range[1] += diff2;
    } else {
      this.range[0] -= diff;
    }
    if (tl) {
      let offset = event.originalEvent.offsetY;
      let diff1 = offset / (this.canvas.height / dpr2 - 1) * 2;
      let diff2 = 2 - diff1;
      let z = diff / (this.range[1] - this.range[0]);
      this.events.emit("rezoom-range", {
        gridId: this.gridId,
        z,
        diff1,
        diff2
      });
    }
    this.changeRange();
  }
  mousedrag(x, y) {
    if (this.meta.scrollLock)
      return;
    let dt = this.drug.t * (this.drug.x - x) / this.layout.width;
    let d$ = this.layout.$hi - this.layout.$lo;
    d$ *= (this.drug.y - y) / this.layout.height;
    let offset = this.drug.o + d$;
    let ls = this.layout.settings.logScale;
    if (ls && this.drug.y_r) {
      let dy = this.drug.y - y;
      var range = this.drug.y_r.slice();
      range[0] = math.exp((0 - this.drug.B + dy) / this.layout.A);
      range[1] = math.exp(
        (this.layout.height - this.drug.B + dy) / this.layout.A
      );
    }
    let scaleId = this.layout.scaleIndex;
    let yTransform = this.meta.getYtransform(this.gridId, scaleId);
    if (this.drug.y_r && yTransform && !yTransform.auto) {
      this.events.emit("sidebar-transform", {
        gridId: this.gridId,
        scaleId,
        range: ls ? range || this.drug.y_r : [
          this.drug.y_r[0] - offset,
          this.drug.y_r[1] - offset
        ]
      });
    }
    this.range[0] = this.drug.r[0] + dt;
    this.range[1] = this.drug.r[1] + dt;
    this.changeRange();
  }
  pinchZoom(scale) {
    if (this.meta.scrollLock)
      return;
    let data = this.hub.mainOv.dataSubset;
    if (scale > 1 && data.length <= this.MIN_ZOOM)
      return;
    if (scale < 1 && data.length > this.MAX_ZOOM)
      return;
    let t = this.pinch.t;
    let nt = t * 1 / scale;
    this.range[0] = this.pinch.r[0] - (nt - t) * 0.5;
    this.range[1] = this.pinch.r[1] + (nt - t) * 0.5;
    this.changeRange();
  }
  trackpadScroll(event) {
    if (this.meta.scrollLock)
      return;
    const dt = this.range[1] - this.range[0];
    this.range[0] += event.deltaX * dt * 0.1;
    this.range[1] += event.deltaX * dt * 0.1;
    this.changeRange();
  }
  mouseScroll(event) {
    if (this.meta.scrollLock || !event.deltaY)
      return;
    const dt = this.range[1] - this.range[0];
    this.range[0] += event.deltaY / 5 * dt * -0.1;
    this.range[1] += event.deltaY / 5 * dt * -0.1;
    this.changeRange();
  }
  changeRange() {
    let data = this.hub.mainOv.data;
    if (!this.range.length || data.length < 2)
      return;
    let l = data.length - 1;
    let range = this.range;
    let layout = this.layout;
    range[0] = Utils.clamp(
      range[0],
      -Infinity,
      layout.ti(data[l][0], l) - this.interval * 5.5
    );
    range[1] = Utils.clamp(
      range[1],
      layout.ti(data[0][0], 0) + this.interval * 5.5,
      Infinity
    );
    this.events.emit("range-changed", range);
  }
  // Propagate mouse event to overlays
  propagate(name, event) {
    this.events.emitSpec(this.gridUpdId, "propagate", {
      name,
      event
    });
  }
  destroy() {
    let rm = this.canvas.removeEventListener;
    rm("gesturestart", this.gesturestart);
    rm("gesturechange", this.gesturechange);
    rm("gestureend", this.gestureend);
    if (this.mc)
      this.mc.destroy();
    if (this.hm)
      this.hm.unwheel();
    this.mouseEvents("removeEventListener");
  }
}
class Keyboard {
  constructor(updId, events) {
    this._keydown = this.keydown.bind(this);
    this._keyup = this.keyup.bind(this);
    this._keypress = this.keypress.bind(this);
    window.addEventListener("keydown", this._keydown);
    window.addEventListener("keyup", this._keyup);
    window.addEventListener("keypress", this._keypress);
    this.events = events;
    this.updId = updId;
  }
  off() {
    window.removeEventListener("keydown", this._keydown);
    window.removeEventListener("keyup", this._keyup);
    window.removeEventListener("keypress", this._keypress);
  }
  keydown(event) {
    this.events.emitSpec(this.updId, "propagate", {
      name: "keydown",
      event
    });
  }
  keyup(event) {
    this.events.emitSpec(this.updId, "propagate", {
      name: "keyup",
      event
    });
  }
  keypress(event) {
    this.events.emitSpec(this.updId, "propagate", {
      name: "keypress",
      event
    });
  }
}
const HPX$3 = Const.HPX;
class Crosshair extends Layer {
  constructor(id, nvId) {
    super(id, "__$Crosshair__", nvId);
    this.events = Events$1.instance(this.nvId);
    this.events.on(`crosshair:show-crosshair`, this.onShowHide.bind(this));
    this.id = id;
    this.zIndex = 1e6;
    this.ctxType = "Canvas";
    this.show = true;
    this.overlay = {
      draw: this.draw.bind(this),
      destroy: this.destroy.bind(this)
    };
    this.env = {
      update: this.envEpdate.bind(this),
      destroy: () => {
      }
    };
  }
  draw(ctx) {
    if (!this.layout)
      return;
    const cursor = this.props.cursor;
    if (!cursor.visible || !this.show)
      return;
    ctx.save();
    ctx.strokeStyle = this.props.colors.cross;
    ctx.beginPath();
    ctx.setLineDash([5]);
    if (cursor.gridId === this.layout.id) {
      ctx.moveTo(0, cursor.y + HPX$3);
      ctx.lineTo(this.layout.width + HPX$3, cursor.y + HPX$3);
    }
    ctx.moveTo(cursor.x, 0);
    ctx.lineTo(cursor.x, this.layout.height);
    ctx.stroke();
    ctx.restore();
  }
  envEpdate(ovSrc, layout, props) {
    this.ovSrc = ovSrc;
    this.layout = layout;
    this.props = props;
  }
  onCursor(update2) {
    if (this.props)
      this.props.cursor = update2;
  }
  onShowHide(flag) {
    this.show = flag;
  }
  destroy() {
    this.events.off("crosshair");
  }
}
const HPX$2 = Const.HPX;
class Grid extends Layer {
  constructor(id, nvId) {
    super(id, "__$Grid__", nvId);
    this.events = Events$1.instance(this.nvId);
    this.events.on(`grid-layer:show-grid`, this.onShowHide.bind(this));
    this.id = id;
    this.zIndex = -1e6;
    this.ctxType = "Canvas";
    this.show = true;
    this.overlay = {
      draw: this.draw.bind(this),
      destroy: this.destroy.bind(this)
    };
    this.env = {
      update: this.envEpdate.bind(this),
      destroy: () => {
      }
    };
  }
  draw(ctx) {
    let layout = this.layout;
    if (!layout || !this.show)
      return;
    ctx.strokeStyle = this.props.colors.grid;
    ctx.beginPath();
    const ymax = layout.height;
    for (var [x, p] of layout.xs) {
      ctx.moveTo(x + HPX$2, 0);
      ctx.lineTo(x + HPX$2, ymax);
    }
    for (var [y, y$] of layout.ys) {
      ctx.moveTo(0, y + HPX$2);
      ctx.lineTo(layout.width, y + HPX$2);
    }
    ctx.stroke();
  }
  envEpdate(ovSrc, layout, props) {
    this.ovSrc = ovSrc;
    this.layout = layout;
    this.props = props;
  }
  onShowHide(flag) {
    this.show = flag;
  }
  destroy() {
    this.events.off("grid-layer");
  }
}
const HPX$1 = Const.HPX;
function body$1(props, layout, scale, side, ctx) {
  var points = scale.ys;
  ctx.font = props.config.FONT;
  var { x, y, w, h } = border(props, layout, side, ctx);
  ctx.fillStyle = props.colors.text;
  ctx.beginPath();
  for (var p of points) {
    if (p[0] > layout.height)
      continue;
    var x1 = side === "left" ? w + HPX$1 : x + HPX$1;
    var x2 = side === "left" ? x1 - 4.5 : x1 + 4.5;
    ctx.moveTo(x1, p[0] + HPX$1);
    ctx.lineTo(x2, p[0] + HPX$1);
    var offst = side === "left" ? -10 : 10;
    ctx.textAlign = side === "left" ? "end" : "start";
    let d = scale.prec;
    const font = props.config.FONT.split(" ");
    font[0] = "12px";
    ctx.font = font.join(" ");
    ctx.fillText(p[1].toFixed(d), x1 + offst, p[0] + 4);
    ctx.font = props.config.FONT;
  }
  ctx.stroke();
}
function border(props, layout, side, ctx) {
  var S = side === "right" ? 1 : 0;
  var sb2 = layout.sbMax[S];
  var x, y, w, h;
  switch (side) {
    case "left":
      x = 0;
      y = 0;
      w = Math.floor(sb2);
      h = layout.height;
      ctx.clearRect(x, y, w, h);
      ctx.strokeStyle = props.colors.scale;
      ctx.beginPath();
      ctx.moveTo(x + HPX$1 + w, 0);
      ctx.lineTo(x + HPX$1 + w, h);
      ctx.stroke();
      break;
    case "right":
      x = 0;
      y = 0;
      w = Math.floor(sb2);
      h = layout.height;
      ctx.clearRect(x, y, w, h);
      ctx.strokeStyle = props.colors.scale;
      ctx.beginPath();
      ctx.moveTo(x - HPX$1, 0);
      ctx.lineTo(x - HPX$1, h);
      ctx.stroke();
      break;
  }
  return { x, y, w, h };
}
function panel$1(props, layout, scale, side, ctx) {
  const panHeight = props.config.PANHEIGHT;
  let $ = props.cursor.scales[scale.scaleSpecs.id] || 0;
  let lbl = $.toFixed(scale.prec);
  ctx.fillStyle = props.colors.panel;
  var S = side === "right" ? 1 : 0;
  let panWidth = layout.sbMax[S] - 5;
  let x = S ? 1 : 4;
  let y = props.cursor.y - panHeight * 0.5 + HPX$1;
  let a = S ? 7 : panWidth - 3;
  roundRect$1(ctx, x, y, panWidth, panHeight, 3, S);
  ctx.fillStyle = props.colors.textHL;
  ctx.textAlign = S ? "left" : "right";
  ctx.fillText(lbl, a, y + 15);
}
function tracker(props, layout, scale, side, ctx, tracker2) {
  const panHeight = Math.floor(props.config.PANHEIGHT * 0.8);
  const ct = props.config.CANDLE_TIME && props.timeFrame >= Const.MINUTE;
  let $ = tracker2.value;
  let lbl = $.toFixed(scale.prec);
  ctx.fillStyle = tracker2.color;
  var S = side === "right" ? 1 : 0;
  let panWidth = layout.sbMax[S] - 5;
  let x = S ? 1 : 4;
  let y = tracker2.y - panHeight * 0.5 + HPX$1;
  let a = S ? 7 : panWidth - 3;
  let h = ct ? Math.floor(panHeight * 1.75) + 2 + HPX$1 : panHeight;
  roundRect$1(ctx, x, y, panWidth, h, 3, S);
  ctx.fillStyle = props.colors.back;
  ctx.textAlign = S ? "left" : "right";
  const font = props.config.FONT.split(" ");
  font.unshift("bold");
  ctx.font = font.join(" ");
  ctx.fillText(lbl, a, y + panHeight - 4);
  if (ct) {
    const rt = Utils.getCandleTime(props.timeFrame);
    ctx.textAlign = S ? "left" : "right";
    ctx.font = props.config.FONT;
    ctx.fillText(rt, a, y + panHeight + 9);
  }
  ctx.font = props.config.FONT;
}
function roundRect$1(ctx, x, y, w, h, r, s) {
  if (w < 2 * r)
    r = w / 2;
  if (h < 2 * r)
    r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r * s);
  ctx.arcTo(x + w, y + h, x, y + h, r * s);
  ctx.arcTo(x, y + h, x, y, r * (1 - s));
  ctx.arcTo(x, y, x + w, y, r * (1 - s));
  ctx.closePath();
  ctx.fill();
}
function upperBorder(props, layout, ctx) {
  ctx.strokeStyle = props.colors.scale;
  ctx.beginPath();
  ctx.moveTo(0, 0.5);
  ctx.lineTo(layout.width, 0.5);
  ctx.stroke();
}
function error(props, layout, side, ctx) {
  var S = side === "right" ? 1 : 0;
  var sb2 = layout.sbMax[S];
  ctx.font = props.config.FONT;
  border(props, layout, side, ctx);
  if (layout.id)
    upperBorder(props, layout, ctx);
  const x = Math.floor(sb2 * 0.5);
  const y = Math.floor(layout.height * 0.5);
  ctx.fillStyle = props.colors.text;
  ctx.textAlign = "center";
  ctx.fillText("Error", x, y);
}
const sb = {
  body: body$1,
  border,
  panel: panel$1,
  upperBorder,
  error,
  tracker
};
function priceLine(layout, ctx, tracker2) {
  ctx.strokeStyle = tracker2.color;
  ctx.setLineDash([1, 2]);
  ctx.beginPath();
  ctx.moveTo(0, tracker2.y);
  ctx.lineTo(layout.width, tracker2.y);
  ctx.stroke();
  ctx.setLineDash([]);
}
class Trackers extends Layer {
  constructor(id, props, gridId) {
    super(id, "__$Trackers__");
    this.id = id;
    this.zIndex = 5e5;
    this.ctxType = "Canvas";
    this.hub = DataHub$1.instance(props.id);
    this.meta = MetaHub$1.instance(props.id);
    this.gridId = gridId;
    this.props = props;
    this.overlay = {
      draw: this.draw.bind(this),
      destroy: this.destroy.bind(this),
      drawSidebar: this.drawSidebar.bind(this)
    };
    this.env = {
      update: this.envEpdate.bind(this),
      destroy: () => {
      }
    };
  }
  draw(ctx) {
    if (!this.layout)
      return;
    let trackers = this.meta.valueTrackers[this.gridId] || [];
    this.trackers = [];
    for (var i = 0; i < trackers.length; i++) {
      let vt = trackers[i];
      if (!vt)
        continue;
      let data = this.hub.ovData(this.gridId, i) || [];
      let last = data[data.length - 1] || [];
      let tracker2 = vt(last);
      tracker2.ovId = i;
      if (!tracker2.show || tracker2.value === void 0)
        continue;
      tracker2.y = this.layout.value2y(tracker2.value);
      tracker2.color = tracker2.color || this.props.colors.scale;
      if (tracker2.line) {
        priceLine(this.layout, ctx, tracker2);
      }
      this.trackers.push(tracker2);
    }
  }
  drawSidebar(ctx, side, scale) {
    if (!this.layout)
      return;
    for (var tracker2 of this.trackers || []) {
      let scaleId = this.getScaleId(tracker2.ovId);
      if (scaleId !== scale.scaleSpecs.id)
        continue;
      sb.tracker(
        this.props,
        this.layout,
        scale,
        side,
        ctx,
        tracker2
      );
    }
  }
  envEpdate(ovSrc, layout, props) {
    this.ovSrc = ovSrc;
    this.layout = layout;
    this.props = props;
    this.scaleId = this.getScaleId();
  }
  // Get the scale id of this overlay
  // TODO: more efficient method of getting ov scale
  getScaleId(ovId) {
    let scales = this.layout.scales;
    for (var i in scales) {
      let ovIdxs = scales[i].scaleSpecs.ovIdxs;
      if (ovIdxs.includes(ovId)) {
        return i;
      }
    }
  }
  destroy() {
  }
}
function setup(id, w, h) {
  let canvas = document.getElementById(id);
  let dpr2 = window.devicePixelRatio || 1;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  if (dpr2 < 1)
    dpr2 = 1;
  var rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr2;
  canvas.height = rect.height * dpr2;
  let ctx = canvas.getContext("2d", {});
  ctx.scale(dpr2, dpr2);
  if (!ctx.measureTextOrg) {
    ctx.measureTextOrg = ctx.measureText;
  }
  let nvjsId = id.split("-").shift();
  ctx.measureText = (text2) => Utils.measureText(ctx, text2, nvjsId);
  return [canvas, ctx];
}
function resize(canvas, ctx, w, h) {
  let dpr2 = window.devicePixelRatio || 1;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  if (dpr2 < 1)
    dpr2 = 1;
  var rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr2;
  canvas.height = rect.height * dpr2;
  ctx.scale(dpr2, dpr2);
}
const dpr = { setup, resize };
function create_fragment$c(ctx) {
  let div;
  let canvas_1;
  return {
    c() {
      div = element("div");
      canvas_1 = element("canvas");
      attr(
        canvas_1,
        "id",
        /*canvasId*/
        ctx[2]
      );
      attr(
        div,
        "id",
        /*rrId*/
        ctx[1]
      );
      attr(
        div,
        "style",
        /*rrStyle*/
        ctx[0]
      );
      attr(div, "class", "nvjs-canvas-rendrer");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, canvas_1);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*rrStyle*/
      1) {
        attr(
          div,
          "style",
          /*rrStyle*/
          ctx2[0]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let rrStyle;
  let width;
  let height;
  let { id } = $$props;
  let { props = {} } = $$props;
  let { rr = {} } = $$props;
  let { layout = {} } = $$props;
  let events = Events$1.instance(props.id);
  let rrUpdId = `rr-${id}-${rr.id}`;
  let gridUpdId = `grid-${id}`;
  let rrId = `${props.id}-rr-${id}-${rr.id}`;
  let canvasId = `${props.id}-canvas-${id}-${rr.id}`;
  events.on(`${rrUpdId}:update-rr`, update2);
  events.on(`${rrUpdId}:run-rr-task`, onTask);
  let canvas;
  let ctx;
  let input;
  onMount(() => {
    setup2();
  });
  onDestroy(() => {
    events.off(`${rrUpdId}`);
    if (input)
      input.destroy();
  });
  function attach($input) {
    input = $input;
    input.setup({
      id,
      canvas,
      ctx,
      props,
      layout,
      rrUpdId,
      gridUpdId
    });
  }
  function detach2() {
    if (input) {
      input.destroy();
      input = null;
    }
  }
  function getInput() {
    return input;
  }
  function setup2() {
    [canvas, ctx] = dpr.setup(canvasId, layout.width, layout.height);
  }
  function update2($layout = layout) {
    $$invalidate(3, layout = $layout);
    if (!ctx || !layout)
      return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rr.layers.forEach((l) => {
      if (!l.display)
        return;
      ctx.save();
      let r = l.overlay;
      if (l.opacity)
        ctx.globalAlpha = l.opacity;
      try {
        r.draw(ctx);
      } catch (e) {
        console.log(`Layer ${id}.${l.id}`, e);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    });
    if (id > 0)
      upperBorder2();
  }
  function onTask(event) {
    event.handler(canvas, ctx, input);
  }
  function upperBorder2() {
    ctx.strokeStyle = props.colors.scale;
    ctx.beginPath();
    ctx.moveTo(0, 0.5);
    ctx.lineTo(layout.width, 0.5);
    ctx.stroke();
  }
  function resizeWatch() {
    if (!canvas)
      return;
    dpr.resize(canvas, ctx, layout.width, layout.height);
    update2();
  }
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(4, id = $$props2.id);
    if ("props" in $$props2)
      $$invalidate(5, props = $$props2.props);
    if ("rr" in $$props2)
      $$invalidate(6, rr = $$props2.rr);
    if ("layout" in $$props2)
      $$invalidate(3, layout = $$props2.layout);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*layout*/
    8) {
      $$invalidate(0, rrStyle = `
    left: ${layout.sbMax[0]}px;
    top: ${layout.offset || 0}px;
    position: absolute;
    height: ${layout.height}px;
}`);
    }
    if ($$self.$$.dirty & /*layout*/
    8) {
      $$invalidate(11, width = layout.width);
    }
    if ($$self.$$.dirty & /*layout*/
    8) {
      $$invalidate(10, height = layout.height);
    }
    if ($$self.$$.dirty & /*width, height*/
    3072) {
      resizeWatch();
    }
  };
  return [
    rrStyle,
    rrId,
    canvasId,
    layout,
    id,
    props,
    rr,
    attach,
    detach2,
    getInput,
    height,
    width
  ];
}
class Canvas extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$c, safe_not_equal, {
      id: 4,
      props: 5,
      rr: 6,
      layout: 3,
      attach: 7,
      detach: 8,
      getInput: 9
    });
  }
  get attach() {
    return this.$$.ctx[7];
  }
  get detach() {
    return this.$$.ctx[8];
  }
  get getInput() {
    return this.$$.ctx[9];
  }
}
function get_each_context$4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[23] = list[i];
  child_ctx[24] = list;
  child_ctx[25] = i;
  return child_ctx;
}
function create_if_block$6(ctx) {
  let canvas;
  let each_value = (
    /*each_value*/
    ctx[24]
  );
  let i = (
    /*i*/
    ctx[25]
  );
  let current;
  const assign_canvas = () => (
    /*canvas_binding*/
    ctx[7](canvas, each_value, i)
  );
  const unassign_canvas = () => (
    /*canvas_binding*/
    ctx[7](null, each_value, i)
  );
  let canvas_props = {
    id: (
      /*id*/
      ctx[1]
    ),
    layout: (
      /*layout*/
      ctx[0]
    ),
    props: (
      /*props*/
      ctx[2]
    ),
    rr: (
      /*rr*/
      ctx[23]
    )
  };
  canvas = new Canvas({ props: canvas_props });
  assign_canvas();
  return {
    c() {
      create_component(canvas.$$.fragment);
    },
    m(target, anchor) {
      mount_component(canvas, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (each_value !== /*each_value*/
      ctx2[24] || i !== /*i*/
      ctx2[25]) {
        unassign_canvas();
        each_value = /*each_value*/
        ctx2[24];
        i = /*i*/
        ctx2[25];
        assign_canvas();
      }
      const canvas_changes = {};
      if (dirty & /*id*/
      2)
        canvas_changes.id = /*id*/
        ctx2[1];
      if (dirty & /*layout*/
      1)
        canvas_changes.layout = /*layout*/
        ctx2[0];
      if (dirty & /*props*/
      4)
        canvas_changes.props = /*props*/
        ctx2[2];
      if (dirty & /*renderers*/
      8)
        canvas_changes.rr = /*rr*/
        ctx2[23];
      canvas.$set(canvas_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(canvas.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(canvas.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      unassign_canvas();
      destroy_component(canvas, detaching);
    }
  };
}
function create_each_block$4(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*rr*/
    ctx[23].ctxType === "Canvas" && create_if_block$6(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*rr*/
        ctx2[23].ctxType === "Canvas"
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*renderers*/
          8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$6(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_fragment$b(ctx) {
  let div;
  let current;
  let each_value = ensure_array_like(
    /*renderers*/
    ctx[3]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "nvjs-grid");
      attr(
        div,
        "style",
        /*style*/
        ctx[4]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*id, layout, props, renderers*/
      15) {
        each_value = ensure_array_like(
          /*renderers*/
          ctx2[3]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$4(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$4(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (!current || dirty & /*style*/
      16) {
        attr(
          div,
          "style",
          /*style*/
          ctx2[4]
        );
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function instance$b($$self, $$props, $$invalidate) {
  let style;
  let { id } = $$props;
  let { props } = $$props;
  let { main } = $$props;
  let { layout } = $$props;
  function getLayers() {
    return layers;
  }
  let hub = DataHub$1.instance(props.id);
  let meta = MetaHub$1.instance(props.id);
  let events = Events$1.instance(props.id);
  let scripts = Scripts$1.instance(props.id);
  let layers = [];
  let renderers = [];
  let input = null;
  let keyboard = null;
  events.on(`grid-${id}:update-grid`, update2);
  events.on(`grid-${id}:remake-grid`, make);
  events.on(`grid-${id}:propagate`, propagate);
  events.on(`grid-${id}:run-grid-task`, onTask);
  onMount(() => {
    make();
    keyboard = new Keyboard(`grid-${id}`, events);
  });
  onDestroy(() => {
    events.off(`grid-${id}`);
    keyboard.off();
  });
  function make(event) {
    if (!hub.panes()[id])
      return;
    destroyLayers();
    layers = makeLayers();
    $$invalidate(3, renderers = mergeByCtx());
    let last = renderers[renderers.length - 1];
    if (last)
      setTimeout(() => {
        if (last.ref) {
          detachInputs();
          last.ref.attach(input = new Input());
        }
      });
  }
  function detachInputs() {
    for (var rr of renderers) {
      rr.ref.detach();
    }
  }
  function destroyLayers() {
    for (var layer of layers) {
      layer.overlay.destroy();
      layer.env.destroy();
    }
  }
  function makeLayers() {
    let list = hub.panes()[id].overlays || [];
    let layers2 = [];
    for (var i = 0; i < list.length; i++) {
      let ov = list[i];
      let prefab = scripts.prefabs[ov.type];
      if (!prefab)
        continue;
      let l = new Layer(i, ov.name, props.id);
      let z = ov.settings.zIndex;
      l.zIndex = z != null ? z : ov.main ? 0 : -1;
      let env = new OverlayEnv(i, ov, layout, props);
      l.overlay = prefab.make(env);
      l.env = env;
      l.ovSrc = ov;
      l.ctxType = prefab.ctx;
      env.overlay = l.overlay;
      meta.exctractFrom(l.overlay);
      layers2.push(l);
      l.overlay.init();
    }
    layers2.push(new Crosshair(i++, props.id));
    layers2.push(new Grid(i++, props.id));
    layers2.push(new Trackers(i++, props, id));
    layers2.sort((l1, l2) => l1.zIndex - l2.zIndex);
    meta.finish();
    return layers2;
  }
  function mergeByCtx() {
    let rrs = [];
    let lastCtx = null;
    for (var l of layers) {
      if (l.ctxType !== lastCtx) {
        var last = {
          ctxType: l.ctxType,
          layers: [],
          id: rrs.length,
          ref: null
          // Renderer reference
        };
        rrs.push(last);
        lastCtx = l.ctxType;
      }
      last.layers.push(l);
    }
    return rrs;
  }
  function update2($layout = layout) {
    $$invalidate(0, layout = $layout);
    if (input)
      input.layout = layout;
    for (var l of layers) {
      l.env.update(l.ovSrc, layout, props);
      l.update();
    }
    for (var rr of renderers) {
      events.emitSpec(`rr-${id}-${rr.id}`, "update-rr", layout);
    }
  }
  function propagate(e) {
    let { name, event } = e;
    for (var layer of layers) {
      if (layer.overlay[name]) {
        layer.overlay[name](event);
      }
      if (layer.env.$core) {
        const mouse = layer.env.$core.mouse;
        const keys = layer.env.$core.keys;
        mouse.emit(name, event);
        keys.emit(name, event);
      }
    }
  }
  function onTask(event) {
    event.handler(layers, renderers, { update: update2 });
  }
  function canvas_binding($$value, each_value, i) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      each_value[i].ref = $$value;
      $$invalidate(3, renderers);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(1, id = $$props2.id);
    if ("props" in $$props2)
      $$invalidate(2, props = $$props2.props);
    if ("main" in $$props2)
      $$invalidate(5, main = $$props2.main);
    if ("layout" in $$props2)
      $$invalidate(0, layout = $$props2.layout);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*layout, props*/
    5) {
      $$invalidate(4, style = `
    width: ${layout.width}px;
    height: ${layout.height}px;
    background: ${props.colors.back};
    margin-left: ${layout.sbMax[0]}px;
`);
    }
  };
  return [layout, id, props, renderers, style, main, getLayers, canvas_binding];
}
class Grid_1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, {
      id: 1,
      props: 2,
      main: 5,
      layout: 0,
      getLayers: 6
    });
  }
  get getLayers() {
    return this.$$.ctx[6];
  }
}
function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`
  };
}
function add_css$5(target) {
  append_styles(target, "svelte-16w6gr6", ".scale-selector.svelte-16w6gr6{position:absolute;bottom:5px;display:grid;justify-content:center;align-content:center}.scale-button.svelte-16w6gr6{border-radius:3px;text-align:center;user-select:none;margin:auto;margin-top:1px}.scale-button.svelte-16w6gr6:hover{filter:brightness(1.2)}");
}
function get_each_context$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[13] = list[i];
  child_ctx[15] = i;
  const constants_0 = (
    /*scale*/
    child_ctx[13].scaleSpecs.id
  );
  child_ctx[1] = constants_0;
  return child_ctx;
}
function create_each_block$3(ctx) {
  let div;
  let t0_value = (
    /*id*/
    ctx[1] + ""
  );
  let t0;
  let t1;
  let div_style_value;
  let mounted;
  let dispose;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[10](
        /*id*/
        ctx[1]
      )
    );
  }
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = space();
      attr(div, "class", "scale-button svelte-16w6gr6");
      attr(div, "style", div_style_value = /*sbStyle*/
      ctx[2](
        /*id*/
        ctx[1]
      ));
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      append(div, t1);
      if (!mounted) {
        dispose = listen(div, "click", stop_propagation(click_handler));
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*scales*/
      1 && t0_value !== (t0_value = /*id*/
      ctx[1] + ""))
        set_data(t0, t0_value);
      if (dirty & /*sbStyle, scales*/
      5 && div_style_value !== (div_style_value = /*sbStyle*/
      ctx[2](
        /*id*/
        ctx[1]
      ))) {
        attr(div, "style", div_style_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$a(ctx) {
  let div;
  let div_transition;
  let current;
  let each_value = ensure_array_like(
    /*scales*/
    ctx[0]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "scale-selector svelte-16w6gr6");
      attr(
        div,
        "id",
        /*ssId*/
        ctx[4]
      );
      attr(
        div,
        "style",
        /*ssStyle*/
        ctx[3]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*sbStyle, scales, onClick*/
      37) {
        each_value = ensure_array_like(
          /*scales*/
          ctx2[0]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$3(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$3(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (!current || dirty & /*ssStyle*/
      8) {
        attr(
          div,
          "style",
          /*ssStyle*/
          ctx2[3]
        );
      }
    },
    i(local) {
      if (current)
        return;
      if (local) {
        add_render_callback(() => {
          if (!current)
            return;
          if (!div_transition)
            div_transition = create_bidirectional_transition(div, fade, { duration: 150 }, true);
          div_transition.run(1);
        });
      }
      current = true;
    },
    o(local) {
      if (local) {
        if (!div_transition)
          div_transition = create_bidirectional_transition(div, fade, { duration: 150 }, false);
        div_transition.run(0);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_each(each_blocks, detaching);
      if (detaching && div_transition)
        div_transition.end();
    }
  };
}
function instance$a($$self, $$props, $$invalidate) {
  let specs;
  let ssStyle;
  let sbStyle;
  let { id } = $$props;
  let { props } = $$props;
  let { layout } = $$props;
  let { scales } = $$props;
  let { side } = $$props;
  let events = Events$1.instance(props.id);
  let S = side === "right" ? 1 : 0;
  let ssId = `${props.id}-ss-${id}-${side}`;
  function onClick(index) {
    scales[index];
    let idxs = layout.settings.scaleSideIdxs;
    idxs[S] = index;
    events.emitSpec("hub", "set-scale-index", { paneId: id, index, sideIdxs: idxs });
  }
  const click_handler = (id2) => onClick(id2);
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(1, id = $$props2.id);
    if ("props" in $$props2)
      $$invalidate(6, props = $$props2.props);
    if ("layout" in $$props2)
      $$invalidate(7, layout = $$props2.layout);
    if ("scales" in $$props2)
      $$invalidate(0, scales = $$props2.scales);
    if ("side" in $$props2)
      $$invalidate(8, side = $$props2.side);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*layout, scales*/
    129) {
      $$invalidate(9, specs = function ssWidth() {
        let obj = {};
        let sb2 = layout.sbMax[S];
        switch (scales.length) {
          case 2:
          case 4:
          default:
            obj.ssw = 46;
            obj.ssm = (sb2 - obj.ssw) / 2;
            obj.bw = 18;
            obj.bh = 18;
            obj.tmp = `50% 50%`;
            break;
          case 3:
            obj.ssw = 54;
            obj.ssm = (sb2 - obj.ssw) / 3;
            obj.bw = 15;
            obj.bh = 15;
            obj.tmp = `33% 33% 33%`;
            break;
        }
        return obj;
      }());
    }
    if ($$self.$$.dirty & /*specs, props*/
    576) {
      $$invalidate(3, ssStyle = `
    grid-template-columns: ${specs.tmp};
    font: ${props.config.FONT};
    width: ${specs.ssw}px;
    margin-left: ${specs.ssm}px;
`);
    }
    if ($$self.$$.dirty & /*layout, props, specs*/
    704) {
      $$invalidate(2, sbStyle = (i) => {
        let sel = i === layout.settings.scaleSideIdxs[S];
        let color = sel ? props.colors.text : props.colors.scale;
        return `
    background: ${props.colors.back};
    line-height: ${specs.bh}px;
    width: ${specs.bw}px;
    height: ${specs.bh}px;
    box-shadow: 0 0 0 1px ${props.colors.back};
    border: 1px solid ${color};
    color: ${color};
`;
      });
    }
  };
  return [
    scales,
    id,
    sbStyle,
    ssStyle,
    ssId,
    onClick,
    props,
    layout,
    side,
    specs,
    click_handler
  ];
}
class ScaleSelector extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$a,
      create_fragment$a,
      safe_not_equal,
      {
        id: 1,
        props: 6,
        layout: 7,
        scales: 0,
        side: 8
      },
      add_css$5
    );
  }
}
function create_if_block$5(ctx) {
  let scaleselector;
  let current;
  scaleselector = new ScaleSelector({
    props: {
      id: (
        /*id*/
        ctx[1]
      ),
      props: (
        /*props*/
        ctx[2]
      ),
      layout: (
        /*layout*/
        ctx[0]
      ),
      scales: (
        /*scales*/
        ctx[4]
      ),
      side: (
        /*side*/
        ctx[3]
      )
    }
  });
  return {
    c() {
      create_component(scaleselector.$$.fragment);
    },
    m(target, anchor) {
      mount_component(scaleselector, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const scaleselector_changes = {};
      if (dirty[0] & /*id*/
      2)
        scaleselector_changes.id = /*id*/
        ctx2[1];
      if (dirty[0] & /*props*/
      4)
        scaleselector_changes.props = /*props*/
        ctx2[2];
      if (dirty[0] & /*layout*/
      1)
        scaleselector_changes.layout = /*layout*/
        ctx2[0];
      if (dirty[0] & /*scales*/
      16)
        scaleselector_changes.scales = /*scales*/
        ctx2[4];
      if (dirty[0] & /*side*/
      8)
        scaleselector_changes.side = /*side*/
        ctx2[3];
      scaleselector.$set(scaleselector_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(scaleselector.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(scaleselector.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(scaleselector, detaching);
    }
  };
}
function create_fragment$9(ctx) {
  let div;
  let canvas_1;
  let t;
  let current;
  let mounted;
  let dispose;
  let if_block = (
    /*scales*/
    ctx[4].length > 1 && /*showSwitch*/
    ctx[5] && create_if_block$5(ctx)
  );
  return {
    c() {
      div = element("div");
      canvas_1 = element("canvas");
      t = space();
      if (if_block)
        if_block.c();
      attr(
        canvas_1,
        "id",
        /*canvasId*/
        ctx[8]
      );
      attr(
        div,
        "id",
        /*sbId*/
        ctx[7]
      );
      attr(
        div,
        "style",
        /*sbStyle*/
        ctx[6]
      );
      attr(div, "class", "nvjs-sidebar svelte-gpuvhh");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, canvas_1);
      append(div, t);
      if (if_block)
        if_block.m(div, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            div,
            "click",
            /*onClick*/
            ctx[9]
          ),
          listen(
            div,
            "mouseover",
            /*onMouseOver*/
            ctx[10]
          ),
          listen(
            div,
            "mouseleave",
            /*onMouseLeave*/
            ctx[11]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (
        /*scales*/
        ctx2[4].length > 1 && /*showSwitch*/
        ctx2[5]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*scales, showSwitch*/
          48) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$5(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (!current || dirty[0] & /*sbStyle*/
      64) {
        attr(
          div,
          "style",
          /*sbStyle*/
          ctx2[6]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block)
        if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let sbStyle;
  let scale;
  let width;
  let height;
  let { id } = $$props;
  let { props = {} } = $$props;
  let { layout = {} } = $$props;
  let { side } = $$props;
  let { scales = [] } = $$props;
  let layers = [];
  function setLayers($layers) {
    layers = $layers;
  }
  let meta = MetaHub$1.instance(props.id);
  let events = Events$1.instance(props.id);
  let S = side === "right" ? 1 : 0;
  let sbUpdId = `sb-${id}-${side}`;
  let sbId = `${props.id}-sb-${id}-${side}`;
  let canvasId = `${props.id}-sb-canvas-${id}-${side}`;
  let showSwitch = false;
  let showPanel = true;
  events.on(`${sbUpdId}:update-sb`, update2);
  events.on(`${sbUpdId}:show-sb-panel`, (f) => showPanel = f);
  let canvas;
  let ctx;
  let mc;
  let zoom = 1;
  let yRange;
  let drug;
  let updId;
  onMount(async () => {
    await setup2();
  });
  onDestroy(() => {
    events.off(`${sbUpdId}`);
    if (mc)
      mc.destroy();
    clearInterval(updId);
  });
  async function setup2() {
    [canvas, ctx] = dpr.setup(canvasId, layout.sbMax[S], layout.height);
    update2();
    if (scale)
      await listeners();
    if (props.config.CANDLE_TIME && props.timeFrame >= Const.MINUTE) {
      let dt = Const.SECOND / 5;
      updId = setInterval(update2, dt);
    }
  }
  async function listeners() {
    const Hammer = await import("./hammer-3fb3a109.js").then((n) => n.h);
    mc = new Hammer.Manager(canvas);
    mc.add(new Hammer.Pan({
      direction: Hammer.DIRECTION_VERTICAL,
      threshold: 0
    }));
    mc.add(new Hammer.Tap({
      event: "doubletap",
      taps: 2,
      posThreshold: 50
    }));
    mc.on("panstart", (event) => {
      if (!scale)
        return;
      let yTransform = getYtransform();
      if (yTransform) {
        zoom = yTransform.zoom;
      } else {
        zoom = 1;
      }
      yRange = [scale.$hi, scale.$lo];
      drug = {
        y: event.center.y,
        z: zoom,
        mid: math.log_mid(yRange, layout.height),
        A: scale.A,
        B: scale.B
      };
    });
    mc.on("panmove", (event) => {
      if (drug) {
        zoom = calcZoom(event);
        events.emit("sidebar-transform", {
          gridId: id,
          scaleId: scale.scaleSpecs.id,
          zoom,
          auto: false,
          range: calcRange(),
          drugging: true,
          updateLayout: true
        });
        update2();
      }
    });
    mc.on("panend", () => {
      drug = null;
      if (!scale)
        return;
      events.emit("sidebar-transform", {
        gridId: id,
        scaleId: scale.scaleSpecs.id,
        drugging: false,
        updateLayout: true
      });
    });
    mc.on("doubletap", () => {
      events.emit("sidebar-transform", {
        gridId: id,
        scaleId: scale.scaleSpecs.id,
        zoom: 1,
        auto: true,
        updateLayout: true
      });
      zoom = 1;
      update2();
    });
  }
  function update2($layout = layout) {
    if (!$layout)
      return;
    $$invalidate(0, layout = $layout);
    scale = getCurrentScale();
    if (!scale) {
      return sb.error(props, layout, side, ctx);
    }
    sb.body(props, layout, scale, side, ctx);
    ovDrawCalls();
    if (id)
      sb.upperBorder(props, layout, ctx);
    if (props.cursor.y && props.cursor.scales && showPanel) {
      if (props.cursor.gridId === layout.id) {
        sb.panel(props, layout, scale, side, ctx);
      }
    }
  }
  function ovDrawCalls() {
    for (var l of layers) {
      let ov = l.overlay;
      if (ov.drawSidebar) {
        ov.drawSidebar(ctx, side, scale);
      }
    }
  }
  function resizeWatch() {
    if (!canvas)
      return;
    dpr.resize(canvas, ctx, layout.sbMax[S], layout.height);
    update2();
  }
  function calcZoom(event) {
    let d = drug.y - event.center.y;
    let speed = d > 0 ? 3 : 1;
    let k = 1 + speed * d / layout.height;
    return Utils.clamp(drug.z * k, 5e-3, 100);
  }
  function calcRange(diff1 = 1, diff2 = 1) {
    let z = zoom / drug.z;
    let zk = (1 / z - 1) / 2;
    let range = yRange.slice();
    let delta = range[0] - range[1];
    if (!scale.log) {
      range[0] = range[0] + delta * zk * diff1;
      range[1] = range[1] - delta * zk * diff2;
    } else {
      let px_mid = layout.height / 2;
      let new_hi = px_mid - px_mid * (1 / z);
      let new_lo = px_mid + px_mid * (1 / z);
      let f = (y) => math.exp((y - drug.B) / drug.A);
      range.slice();
      range[0] = f(new_hi);
      range[1] = f(new_lo);
    }
    return range;
  }
  function getCurrentScale() {
    let scales2 = layout.scales;
    let template = layout.settings.scaleTemplate[S];
    let s = scales2[layout.settings.scaleSideIdxs[S]];
    if (s && template.includes(s.scaleSpecs.id)) {
      return s;
    }
    return null;
  }
  function getYtransform() {
    if (!meta.yTransforms[id])
      return;
    let scaleId = scale.scaleSpecs.id;
    return meta.yTransforms[id][scaleId];
  }
  function onClick(e) {
    if (!scale)
      return;
    events.emitSpec("hub", "set-scale-index", {
      paneId: id,
      index: scale.scaleSpecs.id,
      sideIdxs: layout.settings.scaleSideIdxs
    });
  }
  function onMouseOver() {
    $$invalidate(5, showSwitch = true);
  }
  function onMouseLeave() {
    $$invalidate(5, showSwitch = false);
  }
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(1, id = $$props2.id);
    if ("props" in $$props2)
      $$invalidate(2, props = $$props2.props);
    if ("layout" in $$props2)
      $$invalidate(0, layout = $$props2.layout);
    if ("side" in $$props2)
      $$invalidate(3, side = $$props2.side);
    if ("scales" in $$props2)
      $$invalidate(4, scales = $$props2.scales);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*layout, props*/
    5) {
      $$invalidate(6, sbStyle = `
    left: ${S * (layout.width + layout.sbMax[0])}px;
    top: ${layout.offset || 0}px;
    position: absolute;
    background: ${props.colors.back};
    height: ${layout.height}px;
`);
    }
    if ($$self.$$.dirty[0] & /*layout*/
    1) {
      scale = getCurrentScale();
    }
    if ($$self.$$.dirty[0] & /*layout*/
    1) {
      $$invalidate(14, width = layout.width);
    }
    if ($$self.$$.dirty[0] & /*layout*/
    1) {
      $$invalidate(13, height = layout.height);
    }
    if ($$self.$$.dirty[0] & /*width, height*/
    24576) {
      resizeWatch();
    }
  };
  return [
    layout,
    id,
    props,
    side,
    scales,
    showSwitch,
    sbStyle,
    sbId,
    canvasId,
    onClick,
    onMouseOver,
    onMouseLeave,
    setLayers,
    height,
    width
  ];
}
class Sidebar extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$9,
      create_fragment$9,
      safe_not_equal,
      {
        id: 1,
        props: 2,
        layout: 0,
        side: 3,
        scales: 4,
        setLayers: 12
      },
      null,
      [-1, -1]
    );
  }
  get setLayers() {
    return this.$$.ctx[12];
  }
}
function create_if_block$4(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(
        div,
        "id",
        /*stubId*/
        ctx[3]
      );
      attr(
        div,
        "style",
        /*stubStyle*/
        ctx[1]
      );
      attr(div, "class", "nvjs-sidebar-stub svelte-yr5ja6");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*stubStyle*/
      2) {
        attr(
          div,
          "style",
          /*stubStyle*/
          ctx2[1]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_fragment$8(ctx) {
  let if_block_anchor;
  let if_block = (
    /*layout*/
    ctx[0].sbMax[
      /*S*/
      ctx[2]
    ] && create_if_block$4(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (
        /*layout*/
        ctx2[0].sbMax[
          /*S*/
          ctx2[2]
        ]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$4(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let stubStyle;
  let { id } = $$props;
  let { props = {} } = $$props;
  let { layout = {} } = $$props;
  let { side } = $$props;
  let S = side === "right" ? 1 : 0;
  let stubId = `${props.id}-stub-${id}-${side}`;
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(4, id = $$props2.id);
    if ("props" in $$props2)
      $$invalidate(5, props = $$props2.props);
    if ("layout" in $$props2)
      $$invalidate(0, layout = $$props2.layout);
    if ("side" in $$props2)
      $$invalidate(6, side = $$props2.side);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*layout, id, side, props*/
    113) {
      $$invalidate(1, stubStyle = `
    left: ${S * (layout.width + layout.sbMax[0])}px;
    top: ${layout.offset || 0}px;
    width: ${layout.sbMax[S] - 1}px;
    height: ${layout.height - (id ? 1 : 0)}px;
    position: absolute;
    border: 1px solid;
    border-${side}: none;
    border-bottom: none;
    /* TODO: remove to-boder, it's in the pane now */
    border-top: ${id ? "auto" : "none"};
    border-color: ${props.colors.scale};
    background: ${props.colors.back}
`);
    }
  };
  return [layout, stubStyle, S, stubId, id, props, side];
}
class SidebarStub extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, { id: 4, props: 5, layout: 0, side: 6 });
  }
}
const king = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAlJQTFRFAAAA7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIoTJ5QQQAAAMZ0Uk5TAAiA1fv+35cTG9b/6jUH0+4caZ0M7Lyi/SZztQGHmAMaz/czEuU2ePqsfZ4EHfUtD+LoPCdihoRgKH+ldaMFVoltCnDkbg0i1/Le60JVzfGOFQKhmwuSX7IGd8ov4e9T84zE7fmTirgJSNkjMWE0EPRZPulDGakpmWfmQFB5w2TdKr3cP03LW3xXwERH1HZS9lrwEbP4Xfw9ZtqITIXCsY8ukaCBNzDIqItUHiuCxxa2a0Y5MpXnLGO/ciVvyachGH6wxh8ghaUgOQAAA1FJREFUeJxjYBgFo2AUjATAyMTMwsrGzkGufk4ubjDg4SVPPx8/NxQICJJlgBA3HAiTo19EFKRVTJwVSEpIkmGAFEi/tAyDLIiWkydZv4IiUJ+SMgODiiqQoapGsgHqGkB9miCWFsgJ2jok6tcFRYGePohpYAhkGhnjUy1jYmpmbmGJ7E8rFqAuawjbBuQEWzsk9YL2TA6OynARJ2cXkBI2Vze4EncPoICnCYQj4gXkePvAJe18/SSAIv4BgRB+UDArJLZZQkJhVgSAhMJgOsJBshGRUJ5OlB40eUSLgAV8JWDphSUMGlQxsUBeXCDMAB1QgHjGQw13TIAnsESwSBKIKZoMIlNcweEgkwpyQBrC0/YgfnoGWC4zDqTSXxWsCywLclBWdg7YHKXcIKBIHihMRPMRBsj7AQUKCkHMomJweJWUloFosCyIYcXAUA5SxF3gG8QgU8EKdx4UVIJExIDBzgsO76pqGYYaFANqgbRlHYjlWR8k6Q2kGxqRDQhsAjkvk8EHlCa4m1uA7mzFMIAhpg3ETG5nB1EdqKm/E5QuurqbQVKGPSB/YjFARq0XxI4DB4oJin4GjnRQGBuB5I1qwGZjMYAhqMgbFkF96NmvPwUqM2EiJK6xGcAQFD8Jooo5G00/w+QpEJmpNtAEhdUABvlpkFTiHIRuAEOrEkhCg4mRAZ8BQKdOAKXRUgz9DE62QInpHTIMBAxgsJjKzRqOqZ+BYYYet0QaImhwGsAwcxZ7PgMWEGnjNRspT+M2gEgw8AbModSA6lEDBp0Bc0k3oAduACgD85PcDmLUhhswD8SaX45ZAuADggtA5XQymN0+HWTCrNqFTsTqjpQUigaXO4vAXJnFkMKqwG/J0kCC7pCZvEyqDlrwLYda6bQCVjumxNatXLVwdT7W1oS8m+Ca1rVNDUqwgnfdepgUnzMPNwKk8DQrbghZsrFz02blLfr6Ocp5m1bN7Nga0ZZlpISkzDPAAMn01Qu2sXJjAawpKRLYxLmTrbejOVB3x85i7GoxTU1evmu3DAMG0NGt3rN4rwB+zf6K+/p69vPhDGO7A2u6TQ9WHEriqkpA1jfBKOvwFOEllT36nIw4NSNAkEjgEUl9ZSSw0PLoejfSG5t0AQDCD8LOo5GzAgAAAABJRU5ErkJggg==";
const king2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAlJQTFRFAAAA7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIoTJ5QQQAAAMZ0Uk5TAAiA1fv+35cTG9b/6jUH0+4caZ0M7Lyi/SZztQGHmAMaz/czEuU2ePqsfZ4EHfUtD+LoPCdihoRgKH+ldaMFVoltCnDkbg0i1/Le60JVzfGOFQKhmwuSX7IGd8ov4e9T84zE7fmTirgJSNkjMWE0EPRZPulDGakpmWfmQFB5w2TdKr3cP03LW3xXwERH1HZS9lrwEbP4Xfw9ZtqITIXCsY8ukaCBNzDIqItUHiuCxxa2a0Y5MpXnLGO/ciVvyachGH6wxh8ghaUgOQAAA1JJREFUeJxjYBgFo2AUDAHAyMTMwsrGzkGufk4ubjDg4SVPPx8/NxQICJJlgBA3HAiTo19EFKRVTJwVSEpIkmGAFEi/tAyDLIiWkydZv4IiUJ+SMgODiiqQoapGsgHqGkB9miCWFsgJ2jok6tcFRYGePohpYAhkGhnjUy1jYmpmbmGJ7E8rFqAuawjbBuQEWzsk9YL2TA6OynARJ2cXkBI2Vze4EncPoICnCYQj4gXkePvAJe18/SSAIv4BgRB+UDArJLZZQkJhVgSAhMJgOsJBshGRUJ5OlB40eUSLgAV8JWDphSUMGlQxsUBeXCDMAB1QgHjGQw13TIAnsESwSBKIKZoMIlNcweEgkwpyQBrC0/YgfnoGWC4zDqTSXxWsCywLclBWdg7YHKXcIKBIHihMRPMRBsj7AQUKCkHMomJweJWUloFosCyIYcXAUA5SxF3gG8QgU8EKdx4UVIJExIDBzgsO76pqGYYaFANqgbRlHYjlWR8k6Q2kGxqRDQhsAjkvk8EHlCa4m1uA7mzFMIAhpg3ETG5nB1EdqKm/E5QuurqbQVKGPSB/YjFARq0XxI4DB4oJin4GjnRQGBuB5I1qwGZjMYAhqMgbFkF96NmvPwUqM2EiJK6xGcAQFD8Jooo5G00/w+QpEJmpNtAEhdUABvlpkFTiHIRuAEOrEkhCg4mRAZ8BQKdOAKXRUgz9DE62QInpHTIMBAxgsJjKzRqOqZ+BYYYet0QaImhwGsAwcxZ7PgMWEGnjNRspT+M2gEgw8AbModSA6lEDBp0Bc0k3oAduACgD85PcDmLUhhswD8SaX45ZAuADggtA5XQymN0+HWTCrNqFTsTqjpQUigaXO4vAXJnFkMKqwG/J0kCC7pCZvEyqDlrwLYda6bQCVjumxNatXLVwdT7W1oS8m+Ca1rVNDUqwgnfdepgUnzMPNwKk8DQrbghZsrFz02blLfr6Ocp5m1bN7Nga0ZZlpISkzDPAAMn01Qu2sXJjAawpKRLYxLmTrbejOVB3x85i7GoxTU1evmu3DAMG0NGt3rN4rwB+zf6K+/p69vPhDGO7A2u6TQ9WHEriqkpA1jfBKOvwFOEllT36nIw4NSNAkEjgEUl9ZSSw0PLoejfSG5tDAwAAOwrCzjMUsXkAAAAASUVORK5CYII=";
const king3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAABVxJREFUeJztmlmoVlUUx/30XjVLnFC0bJTsWlmZQwRlYlE+FIR2jQzRBpSISooGobKi0aLoRlSEUolU0EMDRQ9JUdFgiA9NFA0oDTfLVTaZZdb/39oXD/tb55x9vnvOPUp7wQ/u/c4e1lpnT2et3a9flChRokSJEiVKlChRokSJEiVKxSJdHYPBTeBD8BfYBb4ED4FRdetXqcDAA8BH4J8UtoDpdetZicCwQeD9DON7EDC+bn1LFxh1SYDxPayqW99SBQbtB34wDH0FPOHWgeTvf4OJdetdmsCYqwzjXwQN9/wO4/nDYEDduvdaYMT+YKNn3HYwNVFmJPjaK8P/Z9SpeykCI64Df3rGPWOUu8EYBatBWx16lyJQ/kBj5f8NTDbKDgObvbLd4KS+VroBjgAXgtvBrWAx6Cg6J1F+hTvsJI1am1H+amMUrAHtBfUfD+aLHrjuApdxyuW2gwJDwDLwlaEIT2uXg6GBihwGPvba+JnOzajD3eILr873YHZgn+2gE2xwO0mynW3gXjA6rXJ/8LixJSXh23wU7JujSMN15rfVFWDEIqPf58HAnHpt4Fo3xbLOGOvpaKuBTsNraU7oylqc8OxYsMmr92Oq95sN8dcNjpx5GXUabpj/EqA/ucdq5E2jIA8vW43fd7jp0LQmOGUeMN7+yjzjE23MN+q/DPZJ6W+Oc7CvJ4e9v73+Z5fVqT90PgETwJQU53AvvwD099qZJs1rCB05vIADBojO42Qbv4LzjLIzwXeGflyzTgXjwNP+c6tTv4EViWeTDIV6lOrscYJ7G48Yb695yOU7YanRDo/O7Yky0w1nk2/ALNl90jy7FQcs955zG3zDKMf5ebHoIjpRdNVOPv8cHNmCA0aDdcaom+Oez5bmcwP5DJySHJn4+6xeO8CV4eL2nlGW68T5okEN/9n10uKZHvXOleZzxGvgNGeo3xcdcoY0T8vSHMAhPgN8YJTnImStI6n7foADRokufv4C3G303+2GurUwl+MAV45DfaYx1C2uafXtJ/qb64zO6ud3sEBStuZSHZBwwjzwU4ZSjPlN6I3xrq8R4IWMfv4QPUKnHpRKd4Arz61qoaQfPpb5c7FVcQZsN/rgVybP+4MD6pfrgES9uW4IJuvyuDmuRXutPviNssbrY6foAtsIqF+dA1zdxW4osh737kUFbQzp42TZvcjyyL4ydH2p3AGu/hLwqehWGHzqK9D+QDfX+bV4pxT7RK7eAXuyRAdEB3Sc+X93wKzogOiA6IDogOiA6IBiDritBl0rEdEoUa4D/M9axub3+js7oneSVoc44HVjFDwnGhEu5bu+r0U0R3ifNEeXt1qFGdTcaTiBX3jLwTFgSA12FBLRr0ZGp3klZ71hD7nfqsiA52MpFQhzAMwN3AxOEA1b1z4ynN4Mmx0nehOFofusUN07qS9SNPLylOTnCBmk3OQ6uxuc40bIQWC4VHCpQTQEN9QN66NEv/BuEc0dMPdghcx83gZj8jridTbG87YENOg7hXUYr+eVmJdEM8kcMZeKxvhPByeK5uqPB5MdU9xv01wZOpQBFoa8HhTNDjMfwTB7d6CxSZi8YbZ6WBGP821yAflWslPmrbLLOW1HwIhrFSZs1oKjezP0eM3lIvCqaBKyKmXLciqN5jy/EhwuAUHTUEe0OWfwVHWF6IL5rujNzroMZvqb0+1J0SQMDzyHgkGlGJ3jEF5HGSu6IDFXxztFN4pmh58VTanzXjAztaEXF5Iw1M75znn/lmhyZJXomrLUGcv1g/ePM/MCfSqiWSPe9eE2ebDonkxFpxaEuwoz0oeAMaI7wN5/cXJPk38Bz1zMtWby+i0AAAAASUVORK5CYII=";
const close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGiGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4wLWMwMDEgNzkuYzAyMDRiMiwgMjAyMy8wMi8wOS0wNjoyNjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0wMS0wNVQxMDowOToxOSswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDEtMDZUMjA6NDI6MjUrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDEtMDZUMjA6NDI6MjUrMDI6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmI2ZWFiOGI3LTdjMDAtZDY0ZC04MzgxLTZjYTFlYzRlYmY3NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowOWM3N2UwYS0xNzM5LTk0NDgtYTdkZC05MmJkYjRiZjQzZWQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowOWM3N2UwYS0xNzM5LTk0NDgtYTdkZC05MmJkYjRiZjQzZWQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA5Yzc3ZTBhLTE3MzktOTQ0OC1hN2RkLTkyYmRiNGJmNDNlZCIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0wNVQxMDowOToxOSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjQgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MGFmOWM4Mi02OTZlLTUxNDItODM5NC00NGJiMjRiMWY1MTgiIHN0RXZ0OndoZW49IjIwMjQtMDEtMDVUMTA6MjQ6NDkrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNC40IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjZlYWI4YjctN2MwMC1kNjRkLTgzODEtNmNhMWVjNGViZjc3IiBzdEV2dDp3aGVuPSIyMDI0LTAxLTA2VDIwOjQyOjI1KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjQuNCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+kPOAIAAAAXNJREFUeJztm1kOgzAQQ03Vm3Iuzkp/aVWxjRekjP8b7CcI8aBO67piZL3SBtJqAGkDaTWAtIG0GkDaQFoNIG0grQaQNpBWA0gbSGt4AO/Kj5dlAYBtn55Kbs7r65rzPN9eqHoH/A4THMMF6jUVj4ASAn1t1R6ggCABWwWw98wzDe+tVdp3GHeAGoIsPMB7BFQQpOEB7h7AhiAPD/A3QRYES3hA8xaoQrCFB3SvwbsQrOEBbRe4CsEeHtCXobMQIuEBTxs8ghALD/jq8J0glmbpnAdcCeSq1faByJlgtvBAT4TsAKoHIbqcAFhHYapcANhliCYHgKP3vGuo8ldqAGcPOTEISgBXT3gRCImh6F5QOwT3WLx6EHr8WJxVbGwQmADYrc4CgQVAVWnlEBgA1H1eCoH9cXQrZquTQUgMRZ+0pn0s/ri12R9HHcMM6jWn/sPE4GoAaQNpNYC0gbQaQNpAWg0gbSCtBpA2kFYDSBtIa3gAH6SMQXt+EF7/AAAAAElFTkSuQmCC";
const edit = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFu2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4wLWMwMDEgNzkuYzAyMDRiMiwgMjAyMy8wMi8wOS0wNjoyNjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0wMS0wNlQyMDo0NDo0MyswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDEtMDZUMjA6NDY6MzErMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDEtMDZUMjA6NDY6MzErMDI6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk4NGVhZGIyLWE1MGItMTg0My1hYjM2LWU3M2ExMTk4ZTYyNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDplYjEzNDJjMy0xNmNkLTkwNDgtOTUzYy0yOTE1MWYxMjYxZjUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplYjEzNDJjMy0xNmNkLTkwNDgtOTUzYy0yOTE1MWYxMjYxZjUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmViMTM0MmMzLTE2Y2QtOTA0OC05NTNjLTI5MTUxZjEyNjFmNSIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0wNlQyMDo0NDo0MyswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjQgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ODRlYWRiMi1hNTBiLTE4NDMtYWIzNi1lNzNhMTE5OGU2MjUiIHN0RXZ0OndoZW49IjIwMjQtMDEtMDZUMjA6NDY6MzErMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNC40IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5/vP0WAAABfklEQVR4nO2bUW7DIBAFh6o3tY/lu9IvV20aUgMLbzfmfRFFjnbGawO2knLO3Dkf6gLUWQLUBaizBKgLUGcJUBegzhKgLkCd2wv4bDkopWRdRzHHcfz8+N+6PQFs23b59yN1wJVNS/XGJoqAGrAqCREEDN2uRhAwNBEEDL3jRhAAAyU0TYMPU5N1zmv+ETox4H7grQNyYXzGvBO8CZgeTwKenfFSF7zqhKou8SLg1bVd+u4ZaPUl4kFAzxI3FcaX0zQLGKZ2ifsNue/7OfwDHmUz1DKlvc002AOSO4//FYUAV+/iZt8DLOBNF0MzO8AdPMwT4BIe5ghwCw/jBbiGh7EC3MPDOAEh4MF+GrSa46e9eLDsgHDwYCcgJDzYCAgLD/0CQsNDn4Dw8NAu4C3gQftARA4POgEu4EEjwA08+HgqLM1sAa7OPswV4A4e5glwCQ9zBLiFh/ECXMMDpPWXmZtnCVAXoM4SoC5AnSVAXYA6S4C6AHWWAHUB6txewBfVLTOr1mhzGAAAAABJRU5ErkJggg==";
const icons = {
  "open-eye": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAelQTFRFAAAAmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYMxdw0QAAAKN0Uk5TAB1Pq7bV/v/5xZFHCw6h6NOCOQMRbNGwTgdo7PPOlIAlJDOSoNr7w0FL1+ubRRgCIVqz/CIKkPbpexsBPOFcJ/WDCBm5mULqye/BYocVtyxQDDIFjCpyslXi8j70d17PH5cEU+54V4anWUmeUmuatBS4c6ac58cgW/1Gsc0PE+Znn+S1Ott9LfAaEmlRFi+kxiNUNEhtK7p6nUzWcWEu2aKt90TEJrgAAALFSURBVHic7VZrWxJBFF5pdbxkRWkKSolGRYmhZBkYoWSIRaFkXjIx7GIWXSktzS6opVlJZvf7L+3MLpszuzvL9jz1bd8vMO8579mZMzPnDMcZMGDgPyPPtI7PL0CosIgvLln/l+JS04aNiMIm8+YtuuVl5VuRCioqLbrkFmuV4F9t27a9xg6ordvh2ClQu3br0Dv3YNe99a4GgtznbmzCtIffn0PefOAg+LUc8iosvtZ6PI3Dfk39ERv4BNra1a3Bo3gWHc1s/bEQOHS62Q7OMDh0NbDMxwPw+ROaU4ychAiOU+pGK9jCUTnb3RMkh7HTkIlAr5r+TCFC+cokt3dW97mIsa8f5jlQq9T3DIJeLfJZhIbOxQhiGCLEu+VuvZCe0IjazDh8As4nCGIUCF6+F7B/FyKqem4Yb95FkrkExGXaaQwyc0Vdz43jAAHqaF0F5hpJmIBIMvRiAHSdpCw3IGTZ2vgmJOBWTC6UcFsIEKY4Lxy5O2vDFEJ3R1h67p54mycocvI+QqPS4AFcICtT78+Wg3GankJo+mH2vyugEWCmhRkgLgXAS3hEL+HxkxnhN+F8KhUkegl+cgmcF5KYppI4i+bmn9nt/WMFkv45pV+AJFYQ4yh4lFMeVfKK2EFaLWnYxkWSwQdpkiReyPTKg7REfZCLw1F+SRJddIBcR5l7BTsRIi/DxACpf01eJnw0lxWFTXGdI00eSa7nOmcLSoYgYkmbsAdDdEF5gwvKilKvWtIyb1eTK3pLWraoypNDI5LGRfUdy1yJy3pao/k4Hbis17AdxMZiZjTR4HuckpRGY4HWVoxbW+jDgtLU+tGTu7UBPn0WmmuKaq4+d2Of0FzTGabwDyzz4j0YXP7yFXd3+7dV83exvU8v5ZZjLKo/MKZ0PjAwSk0/FE+c2URuHYW86E8ePzZ+FfF1JZqZN2DAwL/Ab6ixeYt2jKORAAAAAElFTkSuQmCC",
  "closed-eye": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAblQTFRFAAAAmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYZNB/+AAAAJN0Uk5TAB1Pq7bV/v/5xZFHCw6h6NOCOQMRbNGwTgdo7PPOlIAlJDOSoNr7w0FL1+ubRRgCIVqz/CIKkPbpexsBPOFcJ/WDCBm5mULqye/BYocVtyxQBYwqclXiMvLkrF7PDB/9U+5XhqdZnlJrtBS4ppznW0axzQ/mtRoSURYvScYjMFQ0K7p6nUzWsn1xYS5t2aI6BK33FoqWFQAAAl5JREFUeJxjYBgFo2AU0BgwMjGzsLKxs3NwsnBx85ComZeJj58dBQgICgkTrV1EVIwdCxCXkCRKu6SUNFi9jKycvIIiECgpq6iqgYXUNYjQr6kFUqqto6uHJKhvYGgEEjZmMSGg3dTMHKjOwtIKQ8baRgfkDFs7vPrtZYFqHBydsMs6u4Bc4WqKW7+bO1CBhwFuBZqeQAVeerikvR2A1vvgdaKvH9AEVX/sklJAOc8AvPoZGAKDgCHhEIxNKoSDnZ2VUCADAzMU6M4wJUyJ8AigfgyTmSOjrNHFooEmxMSiiwYDg8c9DsPYeHZ2DAMYEoB+ZUGPC2D8JfpiugurAQxJQBOSUYVSgCGTiqkShwEMaUAT0pEFmIACGVgU4jJAMhNooQiCnwUMgOxAEgxgsAImuRwEN5edPQ8zAPEZwJAPlEmAcQqAGUgKqzLcBjAUsrMXFUPZug7kGRADMwDkhRISvWCH7AUGK2AglpIUiGXAQBRH4gcAo1GUBAMkS4HRWI4sAkpI+cQbAEpIFahCMcCkXEmsAViSMkMVMCbcMTMDVgOqgfprMAo27NkZmwHYszO0QKlFE3Suc0YTsa4HFSgNmPopL9KghSp64KAC31JQodqIS1oCVKyX4ikXNVVBxboCbgWQikUQRyXq3ASqWHLxVCzAqo0LVLW5N5dhStm0GBOu2oCgtQ1cueaiVK7WBobt4Mq1FD2asADJDkj1HlHT2QWq3RW7ewR7IdV7UQVh7SBQjr2BUUhkAwMEeJn6MJo4/ROI1g4BjAETWUCNjUmcLMrceEN+FIyCUUANAAAY0GNbcYUV2AAAAABJRU5ErkJggg==",
  king,
  king2,
  king3,
  close,
  edit
};
function add_css$4(target) {
  append_styles(target, "svelte-49cck0", ".nvjs-eye.svelte-49cck0{width:20px;height:20px;float:right;margin-right:2px;margin-left:7px}.nvjs-eye.svelte-49cck0:hover{filter:brightness(1.25)}");
}
function create_fragment$7(ctx) {
  let div0;
  let t0;
  let div1;
  let t1;
  let div2;
  let mounted;
  let dispose;
  return {
    c() {
      div0 = element("div");
      t0 = space();
      div1 = element("div");
      t1 = space();
      div2 = element("div");
      attr(div0, "class", "nvjs-eye svelte-49cck0");
      attr(
        div0,
        "style",
        /*eyeStyle*/
        ctx[2]
      );
      attr(div1, "class", "nvjs-eye svelte-49cck0");
      attr(
        div1,
        "style",
        /*editStyle*/
        ctx[0]
      );
      attr(div2, "class", "nvjs-eye svelte-49cck0");
      attr(
        div2,
        "style",
        /*closeStyle*/
        ctx[1]
      );
    },
    m(target, anchor) {
      insert(target, div0, anchor);
      insert(target, t0, anchor);
      insert(target, div1, anchor);
      insert(target, t1, anchor);
      insert(target, div2, anchor);
      if (!mounted) {
        dispose = [
          listen(div0, "click", stop_propagation(
            /*onDisplayClick*/
            ctx[3]
          )),
          listen(div1, "click", stop_propagation(
            /*onEdit*/
            ctx[5]
          )),
          listen(div2, "click", stop_propagation(
            /*onRemove*/
            ctx[4]
          ))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*eyeStyle*/
      4) {
        attr(
          div0,
          "style",
          /*eyeStyle*/
          ctx2[2]
        );
      }
      if (dirty & /*editStyle*/
      1) {
        attr(
          div1,
          "style",
          /*editStyle*/
          ctx2[0]
        );
      }
      if (dirty & /*closeStyle*/
      2) {
        attr(
          div2,
          "style",
          /*closeStyle*/
          ctx2[1]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div0);
        detach(t0);
        detach(div1);
        detach(t1);
        detach(div2);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let display;
  let state;
  let eyeStyle;
  let closeStyle;
  let editStyle;
  let { gridId } = $$props;
  let { ov } = $$props;
  let { props } = $$props;
  let { height } = $$props;
  let events = Events$1.instance(props.id);
  function update2() {
    $$invalidate(11, display = ov.settings.display !== false);
  }
  function onDisplayClick() {
    events.emitSpec("hub", "display-overlay", {
      paneId: gridId,
      ovId: ov.id,
      flag: ov.settings.display === void 0 ? false : !ov.settings.display
    });
  }
  function onRemove() {
    events.emitSpec("indicator", "remove", { name: ov.name });
  }
  function onEdit() {
    events.emitSpec("indicator", "edit", { name: ov.name });
  }
  $$self.$$set = ($$props2) => {
    if ("gridId" in $$props2)
      $$invalidate(6, gridId = $$props2.gridId);
    if ("ov" in $$props2)
      $$invalidate(7, ov = $$props2.ov);
    if ("props" in $$props2)
      $$invalidate(8, props = $$props2.props);
    if ("height" in $$props2)
      $$invalidate(9, height = $$props2.height);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*ov*/
    128) {
      $$invalidate(11, display = ov.settings.display !== false);
    }
    if ($$self.$$.dirty & /*display*/
    2048) {
      $$invalidate(12, state = display ? "open" : "closed");
    }
    if ($$self.$$.dirty & /*state, height*/
    4608) {
      $$invalidate(2, eyeStyle = `
    background-image: url(${icons[state + "-eye"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    margin-bottom: -2px;
    margin-right: 2px;
`);
    }
    if ($$self.$$.dirty & /*height*/
    512) {
      $$invalidate(1, closeStyle = `
    background-image: url(${icons["close"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    margin-bottom: -2px;
    margin-right: 2px;
    color: white;
`);
    }
    if ($$self.$$.dirty & /*height*/
    512) {
      $$invalidate(0, editStyle = `
    background-image: url(${icons["edit"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    margin-bottom: -2px;
    margin-right: 2px;
    color: white;
`);
    }
  };
  return [
    editStyle,
    closeStyle,
    eyeStyle,
    onDisplayClick,
    onRemove,
    onEdit,
    gridId,
    ov,
    props,
    height,
    update2,
    display,
    state
  ];
}
class LegendControls extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$7,
      create_fragment$7,
      safe_not_equal,
      {
        gridId: 6,
        ov: 7,
        props: 8,
        height: 9,
        update: 10
      },
      add_css$4
    );
  }
  get update() {
    return this.$$.ctx[10];
  }
}
const logo = [
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAAC0CAMAAAD8fySxAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAvpQTFRFAAAA///////////////+/////////////////////////////v/////////////////////////////////////////////////////////////////////////////////+//////////7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7////////+///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+///////////+//////////////////////////////////7////+////poUcigAAAP50Uk5TAD1AGUAtKyYkC/+5/5qTrNlmOjU5b2nMT+EDZMFjRT//7MT/aI+NGhUIM+YFusm38+0srmrkTcVMH/7Ql2yZa1RwbYwU+dcBYEODjlyKG+7dArTj3sbl6+KbWHE4MtLnB0ZHQnOGHbgKsCV0e9qi8A78nJ/7doIudWL0EksM8ngcIO/3F+p6ktbHi2Gdqzdyy/xVTsB9oX/9IanTyCemlYE2fBAPUUhSHii2pYTgz9TfRJ6qI4BJVoh39hO1U9gFW/lfSloqMMrcXaCykTQYeV69iaeUlpCYszs8r+jpBIUphyKxV6TRzTGovNvOo60b+sIwL1lQu7/VQRaEK34VtNnHAAAOsUlEQVR4nO2debxVVRWATxIqVwiNUAEzyKEgUEJTccoJUBwCsnBIRVNBFIGcQRMjE8kpzACnUFMTFedUUiMnHFIUCi0snzln2qCVTb9f77x3731nWHuvb+97zn39sb8/FPTstdfaZ9+z1jl77bWjKBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCDQCB9Zy0aXAqV9tP1fXZPXr23tvYN1/IxbV1JAoKsuyoVuFSvrOUrrbhcX0yPZ4GP69W309LNufSh+Az/xJj6udNfLSdongAG9kw02hFZv5GXcxlB6n75e4o30U/rbxEnaJ4EFmyYbfMp0Vf/0Xwd4GfdpoxKbpf62uZd0M1s4jYHGlpq0Vj6TbPBZYHIbAz1sGwS0ifncYA/hNoZkOuiftWgrF2lb6xYMTbf4PDR8mIdt20DZ23rItvIFtcvtHKT10S3YPt1iE2j4Du6mDd+RiS58oirOP2anQqWlnX8U7Zz4X8Kvvs4u7rbtmmje8YjOxydfdBdth7jr3bC0XpqoVot2TzfZAygQs6ezaXuNYJILn6iq848ZOYpK2xtIyzi+fZjlHoHqaCh5D2fJGvtWctFLnv2otP1zTdt+0alf3AHpJl2g6c6B6sAvWaQlTC5+okbrEYPGjIXSxumyhmbbDCUaeASq0nNFemj31kW58mVkUT8o7UBd1FeybbZHGjgHqqO+mmlv+D2OL36imt11SoeDWM+DwdgcnG10MGgU4xioHkJktj6XDnUTS/gatIhFHYcBSTkjDtVaVH+zjoHq4cyw8T5vagrkXT3miAlE2n5A0pHZRkdBFdwC1a/XmvVP/FPgaCepjH2hRazzY4CgA7KNjoUauAWqlvflpLcqY6JGE6FFlQGTgLTjdDk554/dv1OgOhmadbyLUApz/jEnAGlTKmrQm3P+UbQVU8ApUD2RySxlopJ39SpTp6nSBk/XxXwj3+wkpoBLoNrlZCbzFAeZmNj5q+9TVU5VpZ0GpAgRzOlQAYdZtSeTWMpEjc6w9pn+njNjpiaNhIZH5Zudmb9KvNE8UD3rm0CTVs52GiwK+VBfZ39N2qlAyKx8s3Ng/2dis05hAr/VzWWsMOBDfQezv61I66nLEJx/FMFPdPizZ99zmcDvOI0V5iDWe5XzFGlzdBHnS+02Yt3PpVZ9N9PQ4DVKmqjdtH7TjLBP1bHA+V8gNazHP7Yv/5XKhdQsbbG/aiwJEj24SB+FFLtapa0NJFwsNTyb9X4JtKru+Oz3qKSJqjj/PN+bZZM2D0gQnH8UXcp6Hw+t+j4Td5nraEHs4Zxwo39gkzYfWHKs1HBdNgowUB3EhJU1UZPOn70CLFhokXa53l50/or774iW10ZGXYgsqcx3Hy4GWKXPcLlF2hWpK8UH2pVyy51Y5yhQHb4AyRpa1kR1ePOvc5VRmrfzj6KrWd8oUP0hk7XIZ8AI17D+UxxnlHYVaG34Kntt7kJxnpNA9Tr2JjH0R35DppMNkjXaLD3NJO16IOEGuemNrH8SqBJv2cpozyHTmcsUSDPRJO2EjmuMXu/HctObWNcgUB2cXuw3RarlTdRoMbMlgykL+Ga9qcH5S49j6b6AQHVbY98pgbf4DpnOrfowZIjDG1MW8BK9uTEr8zbWvRqojro9viw/PzP/pcSJ6uP8Y+6QxQEPcadJlbtYz2qguhuTc4z/oGnYUvRs7wLyfLsbGGNcZruHDYYaqF6CxJQ4UVGKHrdtO9DwJyZV7mUda4GqcQNBmvsaGjY7c5kKecQs4PsrUj5tGoPzj6JhrGMtUAX5ca0s/WlDw2bnAWaJwIOCNLAobHL+7G2sogaqk1k6uros1Ajuzr+GlAUcf763f8C0bcl4KHGZ+XmuBKp3IuVLnag/QyrILMuL+7ne6iSzMmwfyblWg/ZKLvab7y9elfFBcv40ByCfBWxeEu3YQ2TJsbmF9WsNVO/LXy885EudqNHDzA6ZM7LSHgGNHjEr8yjr9jGLPXCxf8sChs5MPj/fgVwW8PGg0XCzMo+zbi23JToaSSh3osL4w0R2kxxwEmbnz3KwhV4T9M2mo8tsUcTQmbmd2WEgmwV8pd5kuU2bJ1CvlmjoSSRgRLkTFc4NI5nFZpBk+pRNnadRp3eZBbCd/b8oYujMPIOUiJFDggETktJmATmn29QRXLeAebLfgNqPeLaYwTPRkPOPWZGUdqT10vaYyuZloudQn+ZA9Xlr1zW0xKVGWZnoC9ToyDM1mbC+O2hwjk0d+MMxBars40HZE7VB5x+zKCGtB7DIqg58xJsC1VXV/2+fHr8savBMgM15CjMSCevmuhp1lBd39iXC8Ajpghb7S5+ojTr/mJUd4kTnn542VucvLJiJ/tEQqJ4n6peV8Kvihk9mEBi0DLlvFLPrCevPgubKpgWWpi8HqtctJW1Ln6jQ2yqsrkkjm/aVtZBqBqIwP5MTXg5U88kYEi8UOoAStbhQ+QRqp54FbCovkRwiW25bRHfJioHqYJSOfrKYcVgoLyIbTNQmT+3m72y9ug2786dru2KgugFq2kNqWixjUoOT/bOAOKWnz2qXBkr2qBv29LJDMVKgir5iNGGiFuH8Y6ouHRSXsuYLx6QLZJlusRCokiQuoc5A8QxCiui0ZwHLZdDSqDsWV8dXqUsPQqCKFvubMFHRzvy9F4GLVsXSyHq7WgOBPRnzgeqvUTtDZmyhkI9C10yaCq6Ks4BJaUnF+UfRb4AQKVAF++GbM1HR58tJie2IZi+2JkJFUDXnT91/Lj+eLfZbFnKLY4yuR58omvAS0Pc083e3BGC3/hGgs3zuAKprs6AZE5U4/8Wt1+0CrtsaDceJulLg1lQqv800YrXn1NCjCEhZnjjp4HekckUv8sO9X1eKVVLOBKovgybdF9xdyihmIM7/4fhCsi1gyQvgIlAAiVVSbkm1GYgW+8HPpABeAZq0paGPMj18XRcLfq8rJQdm2Y7S6Zi9Sd/NmajRq0CV9tWS14jWOrrzN75CZEZ1w2STXO05kdfLGMI8YJX91uqlbxC1Vd4kWsUvu+or1cpkC5Qt1KSJSpz/A9VrdyB6q6CnGqqknApUUe25qwsfP5G3gCr1V5flRPEUwvMWlYABHxDTgeodpEGTJmrN+Vs/UD9cu5i9PiqgYuGoknIyUEXFX98ufPhkSE2+Z+pX/4GoroBmC6uk3BGoosX+HVsKHz4Z4vw7ciV5gpAR4vxpJeWW+vWvk8st6VfF8o6uy4GJy1nymI0/Mr1QKcV6oIpqzzVtohLnPy5xPdl0buddphiqpFwPVFGZUlwiqFGqacs1P5Vz1nGsmAoHV2WvcGWFSZU04henrHo1zc5aWtHD2qZN1GgZGIbnkg0Wsm1OZi5liqmVlGNqgWqm8FJ/8c/vFTx0ZsiXnUGpFhcQay2syxRDlZSrgSpa7G/eREULEOmNEn/6MzHXCHP+sJJyNVBF1bTXFDtwNqbo2ozJNJEzwChLqGbI/bcHqigdvaXAUbNDnP+LmTYzZxsvBYlD+DMRqqTcEl9JNm1XXi1y2OyQPUu53dssJ98AdP6wknJbdZu/kCsfL3LY7JDvZU9mG02bQawwsDFVzVxJOeHc4wP5BpFuny502OwQ539YrtVlxAwD0PmLlZTzxL+i98iFfy1y1BTWAH3yZ6VMGkDsEKHOvzUgJuLehrXnxun9FQdw/k8IzS4mBotg588qKV8Jv7w28YmKqvFLTyOUWVEn+YJzM1fuTVXwZpWXUO25/osLGzHA+1XdbLwiNdxct0TGoaD2u+L4JP/SvTVQJZlzTZ2o0QeSqhnE8+fGgswKceX6b1w5VEn5fLLYv3VR44UgRSDeEluyjcp5JnPl6OHRNczpBxcVNFwMUq5EPiht1EhHk9sZQU8IjPjpPDHWJ9iQgkYLAl6a3zE0fdDB5A4cDrONxsKDFOpkH2K1qdvciUqcv/Gd2SuzwsH5F5W7Ufl74wPlAjmKx1hgkO2qz+B0SEHDiwztNHei1p2/QP2ntMzYenn+YhUH59/Y23AHzzc6So6MBjqZQzyfzIp1XNRrf2ynfBC/fXWaPFEbcP5tTBTMtFvt4vyjqMV9BPP8o9FBcqVeVc88FFMszbs6W/iGk3qwlKKdtRobImeI87eu7LCqfAkck+4+hGItWcfi+UxlQmbayzYBV+W+uinrKde6KQhP6bDxz0YGyIfaOXy29PJHrRLEbx4WrndTEH0ssdL0iYrO4XvfKsE1s8J8MIiIlg+vrzPu08Dw+AHWIRYoR6Tvygazipvz9/GEGZo/UVMldQ2sr4j4l1NmhZvzL8D9b+o7NN4QlbfRhOBTwWNWuaqYu+1uwX8nTFTy41LPwJjpslzt6Pw9YrY04oF35UK2RX2gSvm3g5E3uqoIKynnaXNhML24UIjzNx6OVGcaKQRQxdH553M93OoRGc9nKBFwCK/m/GNWWCXUYuD4YTjd0fnjSsoynTFRo3hBRLn1DwExE3BmxeHOKjZUM8daTrQkiPNHyce9qVP22MXEKimLdMpEJTuP0EltqBBAjMeRrw1shgEb4IsnPk1H21R+CJLUD5opHbOi4J+12SkTFX2t6IokjQVVWGJuclfSv7Yj3K9RMOC72gLhsBkJdoaEu/NP7zB0qtXQORM1mqNrNpLKQpkVV3go6e3+nVYYC4M4/55UGMrQ8drCXK+k7PbW/6FPX43zH6DaqVhashCAyfz/+qi52Gks6zh+DS8KcpTea1gaKWHg4fxpJeUsnTRRxUMfs3NsGBcHdoi0+Kh5RkoEfff3un8FYHL+iYGlzj9GLwTg4/ytlZTNI9xZE5Us/85xkacevXibl5pep+TO8+qqcYjzd9ofr37yztWQZLBKyik6baI+BpS7x0midtzxfD9Fh+QlaW8B3L8WzDwwqPc6SVxo3M/UPgi7+Sm6GiiaxpSmXD7zgXbqGdppnrJLsx10aIFVUk6iLwGVBTib3MX5xxxgfUz7OX+PhM13HNUOBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQOD/kv8BDVonljy6Jq4AAAAASUVORK5CYII="
];
function add_css$3(target) {
  append_styles(target, "svelte-ccr182", ".nvjs-legend-line.svelte-ccr182{pointer-events:all;position:relative;user-select:none;border-radius:3px;padding:2px 5px;margin-bottom:2px;width:fit-content}.nvjs-logo.svelte-ccr182{width:35px;height:20px;float:left;margin-left:-5px;margin-right:2px;opacity:0.85}.nvjs-ll-data.svelte-ccr182{font-variant-numeric:tabular-nums}.nvjs-ll-value{margin-left:3px}.nvjs-ll-x{margin-left:3px}.nvjs-eye.svelte-ccr182{width:20px;height:20px;float:right;margin-right:2px;margin-left:7px}.nvjs-eye.svelte-ccr182:hover{filter:brightness(1.25)}.king-icon.svelte-ccr182{padding-left:8px;padding-right:8px;margin-right:4px;filter:grayscale()}");
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[45] = list[i];
  child_ctx[47] = i;
  return child_ctx;
}
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[45] = list[i];
  child_ctx[47] = i;
  return child_ctx;
}
function create_if_block$3(ctx) {
  let div;
  let t0;
  let span;
  let html_tag;
  let t1;
  let t2;
  let t3;
  let t4;
  let current;
  let mounted;
  let dispose;
  let if_block0 = (
    /*ov*/
    ctx[1].main && /*props*/
    ctx[2].showLogo && create_if_block_11(ctx)
  );
  let if_block1 = (
    /*ov*/
    ctx[1].main && create_if_block_10(ctx)
  );
  let if_block2 = (
    /*display*/
    ctx[8] && !/*hover*/
    ctx[3] && create_if_block_3(ctx)
  );
  let if_block3 = !/*display*/
  ctx[8] && !/*hover*/
  ctx[3] && create_if_block_2$1(ctx);
  let if_block4 = (
    /*hover*/
    ctx[3] && create_if_block_1$2(ctx)
  );
  return {
    c() {
      div = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      span = element("span");
      html_tag = new HtmlTag(false);
      t1 = space();
      if (if_block1)
        if_block1.c();
      t2 = space();
      if (if_block2)
        if_block2.c();
      t3 = space();
      if (if_block3)
        if_block3.c();
      t4 = space();
      if (if_block4)
        if_block4.c();
      html_tag.a = t1;
      attr(span, "class", "nvjs-ll-name");
      attr(div, "class", "nvjs-legend-line svelte-ccr182");
      attr(
        div,
        "style",
        /*style*/
        ctx[15]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t0);
      append(div, span);
      html_tag.m(
        /*name*/
        ctx[20],
        span
      );
      append(span, t1);
      if (if_block1)
        if_block1.m(span, null);
      ctx[33](span);
      append(div, t2);
      if (if_block2)
        if_block2.m(div, null);
      append(div, t3);
      if (if_block3)
        if_block3.m(div, null);
      append(div, t4);
      if (if_block4)
        if_block4.m(div, null);
      ctx[35](div);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            div,
            "mousemove",
            /*onMouseMove*/
            ctx[21]
          ),
          listen(
            div,
            "mouseleave",
            /*onMouseLeave*/
            ctx[22]
          ),
          listen(
            div,
            "click",
            /*onClick*/
            ctx[23]
          ),
          listen(div, "keypress", null)
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (
        /*ov*/
        ctx2[1].main && /*props*/
        ctx2[2].showLogo
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_11(ctx2);
          if_block0.c();
          if_block0.m(div, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (!current || dirty[0] & /*name*/
      1048576)
        html_tag.p(
          /*name*/
          ctx2[20]
        );
      if (
        /*ov*/
        ctx2[1].main
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_10(ctx2);
          if_block1.c();
          if_block1.m(span, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (
        /*display*/
        ctx2[8] && !/*hover*/
        ctx2[3]
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_3(ctx2);
          if_block2.c();
          if_block2.m(div, t3);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (!/*display*/
      ctx2[8] && !/*hover*/
      ctx2[3]) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
        } else {
          if_block3 = create_if_block_2$1(ctx2);
          if_block3.c();
          if_block3.m(div, t4);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
      if (
        /*hover*/
        ctx2[3]
      ) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
          if (dirty[0] & /*hover*/
          8) {
            transition_in(if_block4, 1);
          }
        } else {
          if_block4 = create_if_block_1$2(ctx2);
          if_block4.c();
          transition_in(if_block4, 1);
          if_block4.m(div, null);
        }
      } else if (if_block4) {
        group_outros();
        transition_out(if_block4, 1, 1, () => {
          if_block4 = null;
        });
        check_outros();
      }
      if (!current || dirty[0] & /*style*/
      32768) {
        attr(
          div,
          "style",
          /*style*/
          ctx2[15]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block4);
      current = true;
    },
    o(local) {
      transition_out(if_block4);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      ctx[33](null);
      if (if_block2)
        if_block2.d();
      if (if_block3)
        if_block3.d();
      if (if_block4)
        if_block4.d();
      ctx[35](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_11(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "nvjs-logo svelte-ccr182");
      attr(
        div,
        "style",
        /*logoStyle*/
        ctx[18]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*logoStyle*/
      262144) {
        attr(
          div,
          "style",
          /*logoStyle*/
          ctx2[18]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_10(ctx) {
  let span;
  return {
    c() {
      span = element("span");
      attr(span, "class", "king-icon svelte-ccr182");
      attr(
        span,
        "style",
        /*kingStyle*/
        ctx[16]
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*kingStyle*/
      65536) {
        attr(
          span,
          "style",
          /*kingStyle*/
          ctx2[16]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_3(ctx) {
  let span;
  function select_block_type(ctx2, dirty) {
    if (
      /*ov*/
      ctx2[1].settings.legendHtml
    )
      return create_if_block_4;
    if (!/*legend*/
    ctx2[10] && !/*legendHtml*/
    ctx2[14])
      return create_if_block_5;
    if (
      /*legendHtml*/
      ctx2[14] && /*data*/
      ctx2[9].length
    )
      return create_if_block_8;
    if (
      /*data*/
      ctx2[9].length
    )
      return create_if_block_9;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type && current_block_type(ctx);
  return {
    c() {
      span = element("span");
      if (if_block)
        if_block.c();
      attr(span, "class", "nvjs-ll-data svelte-ccr182");
      attr(
        span,
        "style",
        /*dataStyle*/
        ctx[19]
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (if_block)
        if_block.m(span, null);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if (if_block)
          if_block.d(1);
        if_block = current_block_type && current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(span, null);
        }
      }
      if (dirty[0] & /*dataStyle*/
      524288) {
        attr(
          span,
          "style",
          /*dataStyle*/
          ctx2[19]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      if (if_block) {
        if_block.d();
      }
    }
  };
}
function create_if_block_9(ctx) {
  let each_1_anchor;
  let each_value_1 = ensure_array_like(
    /*legend*/
    ctx[10](
      /*data*/
      ctx[9],
      /*prec*/
      ctx[7]
    ) || []
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*legend, data, prec, formatter*/
      16778880) {
        each_value_1 = ensure_array_like(
          /*legend*/
          ctx2[10](
            /*data*/
            ctx2[9],
            /*prec*/
            ctx2[7]
          ) || []
        );
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_1.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block_8(ctx) {
  let html_tag;
  let raw_value = (
    /*legendHtml*/
    ctx[14](
      /*data*/
      ctx[9],
      /*prec*/
      ctx[7],
      /*formatter*/
      ctx[24]
    ) + ""
  );
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(raw_value, target, anchor);
      insert(target, html_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*legendHtml, data, prec*/
      17024 && raw_value !== (raw_value = /*legendHtml*/
      ctx2[14](
        /*data*/
        ctx2[9],
        /*prec*/
        ctx2[7],
        /*formatter*/
        ctx2[24]
      ) + ""))
        html_tag.p(raw_value);
    },
    d(detaching) {
      if (detaching) {
        detach(html_anchor);
        html_tag.d();
      }
    }
  };
}
function create_if_block_5(ctx) {
  let each_1_anchor;
  let each_value = ensure_array_like(
    /*data*/
    ctx[9]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*formatter, data*/
      16777728) {
        each_value = ensure_array_like(
          /*data*/
          ctx2[9]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block_4(ctx) {
  let html_tag;
  let raw_value = (
    /*ov*/
    ctx[1].settings.legendHtml + ""
  );
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(raw_value, target, anchor);
      insert(target, html_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*ov*/
      2 && raw_value !== (raw_value = /*ov*/
      ctx2[1].settings.legendHtml + ""))
        html_tag.p(raw_value);
    },
    d(detaching) {
      if (detaching) {
        detach(html_anchor);
        html_tag.d();
      }
    }
  };
}
function create_each_block_1(ctx) {
  let span;
  let t0_value = (
    /*formatter*/
    ctx[24](
      /*v*/
      ctx[45][0]
    ) + ""
  );
  let t0;
  let t1;
  let span_style_value;
  return {
    c() {
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      attr(span, "class", "nvjs-ll-value");
      attr(span, "style", span_style_value = `color: ${/*v*/
      ctx[45][1]}`);
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      append(span, t1);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*legend, data, prec*/
      1664 && t0_value !== (t0_value = /*formatter*/
      ctx2[24](
        /*v*/
        ctx2[45][0]
      ) + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*legend, data, prec*/
      1664 && span_style_value !== (span_style_value = `color: ${/*v*/
      ctx2[45][1]}`)) {
        attr(span, "style", span_style_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_6(ctx) {
  let if_block_anchor;
  function select_block_type_1(ctx2, dirty) {
    if (
      /*v*/
      ctx2[45] != null
    )
      return create_if_block_7;
    return create_else_block$2;
  }
  let current_block_type = select_block_type_1(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_block.d(detaching);
    }
  };
}
function create_else_block$2(ctx) {
  let span;
  return {
    c() {
      span = element("span");
      span.textContent = "x";
      attr(span, "class", "nvjs-ll-x");
    },
    m(target, anchor) {
      insert(target, span, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_7(ctx) {
  let span;
  let t0_value = (
    /*formatter*/
    ctx[24](
      /*v*/
      ctx[45]
    ) + ""
  );
  let t0;
  let t1;
  return {
    c() {
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      attr(span, "class", "nvjs-ll-value");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      append(span, t1);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*data*/
      512 && t0_value !== (t0_value = /*formatter*/
      ctx2[24](
        /*v*/
        ctx2[45]
      ) + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_each_block$2(ctx) {
  let if_block_anchor;
  let if_block = (
    /*i*/
    ctx[47] > 0 && create_if_block_6(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (
        /*i*/
        ctx2[47] > 0
      )
        if_block.p(ctx2, dirty);
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_2$1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "nvjs-eye svelte-ccr182");
      attr(
        div,
        "style",
        /*eyeStyle*/
        ctx[17]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*eyeStyle*/
      131072) {
        attr(
          div,
          "style",
          /*eyeStyle*/
          ctx2[17]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_1$2(ctx) {
  let legendcontrols;
  let current;
  let legendcontrols_props = {
    gridId: (
      /*gridId*/
      ctx[0]
    ),
    ov: (
      /*ov*/
      ctx[1]
    ),
    props: (
      /*props*/
      ctx[2]
    ),
    height: (
      /*boundary*/
      ctx[6].height
    )
  };
  legendcontrols = new LegendControls({ props: legendcontrols_props });
  ctx[34](legendcontrols);
  return {
    c() {
      create_component(legendcontrols.$$.fragment);
    },
    m(target, anchor) {
      mount_component(legendcontrols, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const legendcontrols_changes = {};
      if (dirty[0] & /*gridId*/
      1)
        legendcontrols_changes.gridId = /*gridId*/
        ctx2[0];
      if (dirty[0] & /*ov*/
      2)
        legendcontrols_changes.ov = /*ov*/
        ctx2[1];
      if (dirty[0] & /*props*/
      4)
        legendcontrols_changes.props = /*props*/
        ctx2[2];
      if (dirty[0] & /*boundary*/
      64)
        legendcontrols_changes.height = /*boundary*/
        ctx2[6].height;
      legendcontrols.$set(legendcontrols_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(legendcontrols.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(legendcontrols.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[34](null);
      destroy_component(legendcontrols, detaching);
    }
  };
}
function create_fragment$6(ctx) {
  let if_block_anchor;
  let current;
  let if_block = !/*legendFns*/
  ctx[11].noLegend && /*ov*/
  ctx[1].settings.showLegend !== false && /*show*/
  ctx[13] && create_if_block$3(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (!/*legendFns*/
      ctx2[11].noLegend && /*ov*/
      ctx2[1].settings.showLegend !== false && /*show*/
      ctx2[13]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*legendFns, ov, show*/
          10242) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$3(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function instance$6($$self, $$props, $$invalidate) {
  let updId;
  let name;
  let fontSz;
  let styleBase;
  let styleHover;
  let dataStyle;
  let logoStyle;
  let eyeStyle;
  let kingStyle;
  let boundary;
  let nBoundary;
  let style;
  let legendFns;
  let legend;
  let legendHtml;
  let values;
  let data;
  let scale;
  let prec;
  let display;
  let state;
  let { gridId } = $$props;
  let { ov } = $$props;
  let { props } = $$props;
  let { layout } = $$props;
  let meta = MetaHub$1.instance(props.id);
  let events = Events$1.instance(props.id);
  let hover = false;
  let ref;
  let nRef;
  let ctrlRef;
  let selected = false;
  let show = true;
  onMount(() => {
    events.on(`${updId}:update-ll`, update2);
    events.on(`${updId}:grid-mousedown`, onDeselect);
    events.on(`${updId}:select-overlay`, onDeselect);
  });
  onDestroy(() => {
    events.off(updId);
  });
  function update2() {
    $$invalidate(8, display = ov.settings.display !== false);
    if (ctrlRef)
      ctrlRef.update();
  }
  function onMouseMove(e) {
    if (e.clientX < nBoundary.x + nBoundary.width + 35 && !hover) {
      setTimeout(() => {
        updateBoundaries();
        $$invalidate(3, hover = true);
      });
    }
  }
  function onMouseLeave(e) {
    setTimeout(() => {
      updateBoundaries();
      $$invalidate(3, hover = false);
    });
  }
  function onClick() {
    events.emit("select-overlay", { index: [gridId, ov.id] });
    $$invalidate(26, selected = true);
  }
  function onDeselect(event) {
    $$invalidate(26, selected = false);
  }
  function formatter(x, $prec = prec) {
    if (x == void 0)
      return "x";
    if (typeof x !== "number")
      return x;
    return x.toFixed($prec);
  }
  function findOverlayScale(scales) {
    return Object.values(scales).find((x) => x.scaleSpecs.ovIdxs.includes(ov.id)) || scales[layout.scaleIndex];
  }
  function updateBoundaries() {
    if (!ref)
      return;
    $$invalidate(6, boundary = ref.getBoundingClientRect());
  }
  function span_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      nRef = $$value;
      $$invalidate(5, nRef);
    });
  }
  function legendcontrols_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      ctrlRef = $$value;
      $$invalidate(12, ctrlRef);
    });
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      ref = $$value;
      $$invalidate(4, ref);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("gridId" in $$props2)
      $$invalidate(0, gridId = $$props2.gridId);
    if ("ov" in $$props2)
      $$invalidate(1, ov = $$props2.ov);
    if ("props" in $$props2)
      $$invalidate(2, props = $$props2.props);
    if ("layout" in $$props2)
      $$invalidate(25, layout = $$props2.layout);
  };
  $$self.$$.update = () => {
    var _a;
    if ($$self.$$.dirty[0] & /*gridId, ov*/
    3) {
      updId = `ll-${gridId}-${ov.id}`;
    }
    if ($$self.$$.dirty[0] & /*ov*/
    2) {
      $$invalidate(20, name = (_a = ov.name) != null ? _a : `${ov.type || "Overlay"}-${ov.id}`);
    }
    if ($$self.$$.dirty[0] & /*props*/
    4) {
      $$invalidate(32, fontSz = parseInt(props.config.FONT.split("px").shift()));
    }
    if ($$self.$$.dirty[0] & /*props, ov, selected, layout*/
    100663302 | $$self.$$.dirty[1] & /*fontSz*/
    2) {
      $$invalidate(31, styleBase = `
    font: ${props.config.FONT};
    font-size: ${fontSz + (ov.main ? 5 : 3)}px;
    font-weight: 300;
    color: ${props.colors.textLG};
    background: ${selected ? props.colors.back : props.colors.llBack};
    border: 1px solid transparent;
    margin-right: 30px;
    max-width: ${layout.width - 20}px;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-color: ${selected ? props.colors.llSelect : "auto"} !important;
`);
    }
    if ($$self.$$.dirty[0] & /*props*/
    4) {
      $$invalidate(30, styleHover = `
    background: ${props.colors.back};
    border: 1px solid ${props.colors.grid};

`);
    }
    if ($$self.$$.dirty[0] & /*ov, props*/
    6 | $$self.$$.dirty[1] & /*fontSz*/
    2) {
      $$invalidate(19, dataStyle = `
    font-size: ${fontSz + (ov.main ? 3 : 2)}px;
    color: ${props.colors.llValue}
`);
    }
    if ($$self.$$.dirty[0] & /*ov*/
    2) {
      $$invalidate(8, display = ov.settings.display !== false);
    }
    if ($$self.$$.dirty[0] & /*display*/
    256) {
      $$invalidate(27, state = display ? "open" : "closed");
    }
    if ($$self.$$.dirty[0] & /*ref*/
    16) {
      $$invalidate(6, boundary = ref ? ref.getBoundingClientRect() : {});
    }
    if ($$self.$$.dirty[0] & /*state, boundary*/
    134217792) {
      $$invalidate(17, eyeStyle = `
    background-image: url(${icons[state + "-eye"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(boundary.height - 20) * 0.5 - 3}px;
    margin-bottom: -2px;
`);
    }
    if ($$self.$$.dirty[0] & /*boundary*/
    64) {
      `
    width: ${boundary.width}px;
    height: ${boundary.height}px;
    background: #55f9;
    top: -1px;
    left: -2px;
`;
    }
    if ($$self.$$.dirty[0] & /*props*/
    4) {
      $$invalidate(29, values = props.cursor.values || []);
    }
    if ($$self.$$.dirty[0] & /*values, gridId, ov*/
    536870915) {
      $$invalidate(9, data = (values[gridId] || [])[ov.id] || []);
    }
    if ($$self.$$.dirty[0] & /*hover, display, data*/
    776) {
      $$invalidate(16, kingStyle = `
    background-image: url(${icons["king3"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: ${hover || !display || !data.length ? 7 : 3}px;
`);
    }
    if ($$self.$$.dirty[0] & /*nRef*/
    32) {
      nBoundary = nRef ? nRef.getBoundingClientRect() : {};
    }
    if ($$self.$$.dirty[0] & /*hover, styleHover*/
    1073741832 | $$self.$$.dirty[1] & /*styleBase*/
    1) {
      $$invalidate(15, style = styleBase + (hover ? styleHover : ""));
    }
    if ($$self.$$.dirty[0] & /*gridId, ov*/
    3) {
      $$invalidate(11, legendFns = meta.getLegendFns(gridId, ov.id) || {});
    }
    if ($$self.$$.dirty[0] & /*legendFns*/
    2048) {
      $$invalidate(10, legend = legendFns.legend);
    }
    if ($$self.$$.dirty[0] & /*legendFns*/
    2048) {
      $$invalidate(14, legendHtml = legendFns.legendHtml);
    }
    if ($$self.$$.dirty[0] & /*layout*/
    33554432) {
      $$invalidate(28, scale = findOverlayScale(layout.scales));
    }
    if ($$self.$$.dirty[0] & /*scale*/
    268435456) {
      $$invalidate(7, prec = scale.prec);
    }
    if ($$self.$$.dirty[0] & /*legend, data, prec*/
    1664) {
      if (legend && data && !legend(data, prec))
        $$invalidate(13, show = false);
    }
  };
  $$invalidate(18, logoStyle = `
    background-image: url(${logo[0]});
    background-size: contain;
    background-repeat: no-repeat;
`);
  return [
    gridId,
    ov,
    props,
    hover,
    ref,
    nRef,
    boundary,
    prec,
    display,
    data,
    legend,
    legendFns,
    ctrlRef,
    show,
    legendHtml,
    style,
    kingStyle,
    eyeStyle,
    logoStyle,
    dataStyle,
    name,
    onMouseMove,
    onMouseLeave,
    onClick,
    formatter,
    layout,
    selected,
    state,
    scale,
    values,
    styleHover,
    styleBase,
    fontSz,
    span_binding,
    legendcontrols_binding,
    div_binding
  ];
}
class LegendLine extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, { gridId: 0, ov: 1, props: 2, layout: 25 }, add_css$3, [-1, -1]);
  }
}
function add_css$2(target) {
  append_styles(target, "svelte-16ib1si", ".nvjs-legend.svelte-16ib1si{pointer-events:none}");
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  child_ctx[11] = i;
  return child_ctx;
}
function create_if_block$2(ctx) {
  let div;
  let current;
  let each_value = ensure_array_like(
    /*hub*/
    ctx[5].panes()[
      /*id*/
      ctx[0]
    ].overlays
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "nvjs-legend svelte-16ib1si");
      attr(
        div,
        "style",
        /*style*/
        ctx[4]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*id, props, layout, hub*/
      39) {
        each_value = ensure_array_like(
          /*hub*/
          ctx2[5].panes()[
            /*id*/
            ctx2[0]
          ].overlays
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (!current || dirty & /*style*/
      16) {
        attr(
          div,
          "style",
          /*style*/
          ctx2[4]
        );
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block$1(ctx) {
  let legendline;
  let current;
  legendline = new LegendLine({
    props: {
      gridId: (
        /*id*/
        ctx[0]
      ),
      props: (
        /*props*/
        ctx[1]
      ),
      layout: (
        /*layout*/
        ctx[2]
      ),
      ov: (
        /*ov*/
        ctx[9]
      )
    }
  });
  return {
    c() {
      create_component(legendline.$$.fragment);
    },
    m(target, anchor) {
      mount_component(legendline, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const legendline_changes = {};
      if (dirty & /*id*/
      1)
        legendline_changes.gridId = /*id*/
        ctx2[0];
      if (dirty & /*props*/
      2)
        legendline_changes.props = /*props*/
        ctx2[1];
      if (dirty & /*layout*/
      4)
        legendline_changes.layout = /*layout*/
        ctx2[2];
      if (dirty & /*id*/
      1)
        legendline_changes.ov = /*ov*/
        ctx2[9];
      legendline.$set(legendline_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(legendline.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(legendline.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(legendline, detaching);
    }
  };
}
function create_key_block(ctx) {
  let show_if = (
    /*hub*/
    ctx[5].panes()[
      /*id*/
      ctx[0]
    ]
  );
  let if_block_anchor;
  let current;
  let if_block = show_if && create_if_block$2(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*id*/
      1)
        show_if = /*hub*/
        ctx2[5].panes()[
          /*id*/
          ctx2[0]
        ];
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*id*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_fragment$5(ctx) {
  let previous_key = (
    /*legendRR*/
    ctx[3]
  );
  let key_block_anchor;
  let current;
  let key_block = create_key_block(ctx);
  return {
    c() {
      key_block.c();
      key_block_anchor = empty();
    },
    m(target, anchor) {
      key_block.m(target, anchor);
      insert(target, key_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*legendRR*/
      8 && safe_not_equal(previous_key, previous_key = /*legendRR*/
      ctx2[3])) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(key_block_anchor.parentNode, key_block_anchor);
      } else {
        key_block.p(ctx2, dirty);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(key_block);
      current = true;
    },
    o(local) {
      transition_out(key_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(key_block_anchor);
      }
      key_block.d(detaching);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let style;
  let { id } = $$props;
  let { props } = $$props;
  let { main } = $$props;
  let { layout } = $$props;
  let hub = DataHub$1.instance(props.id);
  let events = Events$1.instance(props.id);
  let legendRR = 0;
  events.on(`legend-${id}:update-legend`, update2);
  onDestroy(() => {
    events.off(`legend-${id}`);
  });
  function update2() {
    $$invalidate(3, legendRR++, legendRR);
  }
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(0, id = $$props2.id);
    if ("props" in $$props2)
      $$invalidate(1, props = $$props2.props);
    if ("main" in $$props2)
      $$invalidate(6, main = $$props2.main);
    if ("layout" in $$props2)
      $$invalidate(2, layout = $$props2.layout);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*layout*/
    4) {
      $$invalidate(4, style = `
    left: ${layout.sbMax[0] + 5}px;
    top: ${(layout.offset || 0) + 5}px;
    position: absolute;
`);
    }
  };
  return [id, props, layout, legendRR, style, hub, main];
}
class Legend extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, { id: 0, props: 1, main: 6, layout: 2 }, add_css$2);
  }
}
function create_if_block$1(ctx) {
  let div;
  let grid_1;
  let t0;
  let legend;
  let t1;
  let current_block_type_index;
  let if_block0;
  let t2;
  let current_block_type_index_1;
  let if_block1;
  let current;
  let grid_1_props = {
    id: (
      /*id*/
      ctx[1]
    ),
    props: (
      /*props*/
      ctx[2]
    ),
    layout: (
      /*layout*/
      ctx[0]
    ),
    main: (
      /*main*/
      ctx[3]
    )
  };
  grid_1 = new Grid_1({ props: grid_1_props });
  ctx[10](grid_1);
  legend = new Legend({
    props: {
      id: (
        /*id*/
        ctx[1]
      ),
      props: (
        /*props*/
        ctx[2]
      ),
      layout: (
        /*layout*/
        ctx[0]
      ),
      main: (
        /*main*/
        ctx[3]
      )
    }
  });
  const if_block_creators = [create_if_block_2, create_else_block_1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*leftSb*/
      ctx2[9].length
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const if_block_creators_1 = [create_if_block_1$1, create_else_block$1];
  const if_blocks_1 = [];
  function select_block_type_1(ctx2, dirty) {
    if (
      /*rightSb*/
      ctx2[8].length
    )
      return 0;
    return 1;
  }
  current_block_type_index_1 = select_block_type_1(ctx);
  if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
  return {
    c() {
      div = element("div");
      create_component(grid_1.$$.fragment);
      t0 = space();
      create_component(legend.$$.fragment);
      t1 = space();
      if_block0.c();
      t2 = space();
      if_block1.c();
      attr(div, "class", "nvjs-pane");
      attr(
        div,
        "style",
        /*style*/
        ctx[7]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(grid_1, div, null);
      append(div, t0);
      mount_component(legend, div, null);
      append(div, t1);
      if_blocks[current_block_type_index].m(div, null);
      append(div, t2);
      if_blocks_1[current_block_type_index_1].m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const grid_1_changes = {};
      if (dirty & /*id*/
      2)
        grid_1_changes.id = /*id*/
        ctx2[1];
      if (dirty & /*props*/
      4)
        grid_1_changes.props = /*props*/
        ctx2[2];
      if (dirty & /*layout*/
      1)
        grid_1_changes.layout = /*layout*/
        ctx2[0];
      if (dirty & /*main*/
      8)
        grid_1_changes.main = /*main*/
        ctx2[3];
      grid_1.$set(grid_1_changes);
      const legend_changes = {};
      if (dirty & /*id*/
      2)
        legend_changes.id = /*id*/
        ctx2[1];
      if (dirty & /*props*/
      4)
        legend_changes.props = /*props*/
        ctx2[2];
      if (dirty & /*layout*/
      1)
        legend_changes.layout = /*layout*/
        ctx2[0];
      if (dirty & /*main*/
      8)
        legend_changes.main = /*main*/
        ctx2[3];
      legend.$set(legend_changes);
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block0 = if_blocks[current_block_type_index];
        if (!if_block0) {
          if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block0.c();
        } else {
          if_block0.p(ctx2, dirty);
        }
        transition_in(if_block0, 1);
        if_block0.m(div, t2);
      }
      let previous_block_index_1 = current_block_type_index_1;
      current_block_type_index_1 = select_block_type_1(ctx2);
      if (current_block_type_index_1 === previous_block_index_1) {
        if_blocks_1[current_block_type_index_1].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
          if_blocks_1[previous_block_index_1] = null;
        });
        check_outros();
        if_block1 = if_blocks_1[current_block_type_index_1];
        if (!if_block1) {
          if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx2);
          if_block1.c();
        } else {
          if_block1.p(ctx2, dirty);
        }
        transition_in(if_block1, 1);
        if_block1.m(div, null);
      }
      if (!current || dirty & /*style*/
      128) {
        attr(
          div,
          "style",
          /*style*/
          ctx2[7]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(grid_1.$$.fragment, local);
      transition_in(legend.$$.fragment, local);
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(grid_1.$$.fragment, local);
      transition_out(legend.$$.fragment, local);
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      ctx[10](null);
      destroy_component(grid_1);
      destroy_component(legend);
      if_blocks[current_block_type_index].d();
      if_blocks_1[current_block_type_index_1].d();
    }
  };
}
function create_else_block_1(ctx) {
  let sidebarstub;
  let current;
  sidebarstub = new SidebarStub({
    props: {
      id: (
        /*id*/
        ctx[1]
      ),
      props: (
        /*props*/
        ctx[2]
      ),
      layout: (
        /*layout*/
        ctx[0]
      ),
      side: "left"
    }
  });
  return {
    c() {
      create_component(sidebarstub.$$.fragment);
    },
    m(target, anchor) {
      mount_component(sidebarstub, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const sidebarstub_changes = {};
      if (dirty & /*id*/
      2)
        sidebarstub_changes.id = /*id*/
        ctx2[1];
      if (dirty & /*props*/
      4)
        sidebarstub_changes.props = /*props*/
        ctx2[2];
      if (dirty & /*layout*/
      1)
        sidebarstub_changes.layout = /*layout*/
        ctx2[0];
      sidebarstub.$set(sidebarstub_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(sidebarstub.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(sidebarstub.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(sidebarstub, detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let sidebar;
  let current;
  let sidebar_props = {
    id: (
      /*id*/
      ctx[1]
    ),
    props: (
      /*props*/
      ctx[2]
    ),
    layout: (
      /*layout*/
      ctx[0]
    ),
    side: "left",
    scales: (
      /*leftSb*/
      ctx[9]
    )
  };
  sidebar = new Sidebar({ props: sidebar_props });
  ctx[11](sidebar);
  return {
    c() {
      create_component(sidebar.$$.fragment);
    },
    m(target, anchor) {
      mount_component(sidebar, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const sidebar_changes = {};
      if (dirty & /*id*/
      2)
        sidebar_changes.id = /*id*/
        ctx2[1];
      if (dirty & /*props*/
      4)
        sidebar_changes.props = /*props*/
        ctx2[2];
      if (dirty & /*layout*/
      1)
        sidebar_changes.layout = /*layout*/
        ctx2[0];
      if (dirty & /*leftSb*/
      512)
        sidebar_changes.scales = /*leftSb*/
        ctx2[9];
      sidebar.$set(sidebar_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(sidebar.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(sidebar.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[11](null);
      destroy_component(sidebar, detaching);
    }
  };
}
function create_else_block$1(ctx) {
  let sidebarstub;
  let current;
  sidebarstub = new SidebarStub({
    props: {
      id: (
        /*id*/
        ctx[1]
      ),
      props: (
        /*props*/
        ctx[2]
      ),
      layout: (
        /*layout*/
        ctx[0]
      ),
      side: "right"
    }
  });
  return {
    c() {
      create_component(sidebarstub.$$.fragment);
    },
    m(target, anchor) {
      mount_component(sidebarstub, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const sidebarstub_changes = {};
      if (dirty & /*id*/
      2)
        sidebarstub_changes.id = /*id*/
        ctx2[1];
      if (dirty & /*props*/
      4)
        sidebarstub_changes.props = /*props*/
        ctx2[2];
      if (dirty & /*layout*/
      1)
        sidebarstub_changes.layout = /*layout*/
        ctx2[0];
      sidebarstub.$set(sidebarstub_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(sidebarstub.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(sidebarstub.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(sidebarstub, detaching);
    }
  };
}
function create_if_block_1$1(ctx) {
  let sidebar;
  let current;
  let sidebar_props = {
    id: (
      /*id*/
      ctx[1]
    ),
    props: (
      /*props*/
      ctx[2]
    ),
    layout: (
      /*layout*/
      ctx[0]
    ),
    side: "right",
    scales: (
      /*rightSb*/
      ctx[8]
    )
  };
  sidebar = new Sidebar({ props: sidebar_props });
  ctx[12](sidebar);
  return {
    c() {
      create_component(sidebar.$$.fragment);
    },
    m(target, anchor) {
      mount_component(sidebar, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const sidebar_changes = {};
      if (dirty & /*id*/
      2)
        sidebar_changes.id = /*id*/
        ctx2[1];
      if (dirty & /*props*/
      4)
        sidebar_changes.props = /*props*/
        ctx2[2];
      if (dirty & /*layout*/
      1)
        sidebar_changes.layout = /*layout*/
        ctx2[0];
      if (dirty & /*rightSb*/
      256)
        sidebar_changes.scales = /*rightSb*/
        ctx2[8];
      sidebar.$set(sidebar_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(sidebar.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(sidebar.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[12](null);
      destroy_component(sidebar, detaching);
    }
  };
}
function create_fragment$4(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*layout*/
    ctx[0] && create_if_block$1(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*layout*/
        ctx2[0]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*layout*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let leftSb;
  let rightSb;
  let style;
  let { id } = $$props;
  let { props } = $$props;
  let { main } = $$props;
  let { layout } = $$props;
  let events = Events$1.instance(props.id);
  let lsb;
  let rsb;
  let grid;
  events.on(`pane-${id}:update-pane`, update2);
  onMount(() => {
  });
  onDestroy(() => {
    events.off(`pane-${id}`);
  });
  function update2($layout) {
    if (!$layout.grids)
      return;
    $$invalidate(0, layout = $layout.grids[id]);
    events.emitSpec(`grid-${id}`, "update-grid", layout);
    let layers = grid && grid.getLayers ? grid.getLayers() : [];
    if (lsb)
      lsb.setLayers(layers);
    if (rsb)
      rsb.setLayers(layers);
    events.emitSpec(`sb-${id}-left`, "update-sb", layout);
    events.emitSpec(`sb-${id}-right`, "update-sb", layout);
  }
  function grid_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      grid = $$value;
      $$invalidate(6, grid);
    });
  }
  function sidebar_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      lsb = $$value;
      $$invalidate(4, lsb);
    });
  }
  function sidebar_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      rsb = $$value;
      $$invalidate(5, rsb);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(1, id = $$props2.id);
    if ("props" in $$props2)
      $$invalidate(2, props = $$props2.props);
    if ("main" in $$props2)
      $$invalidate(3, main = $$props2.main);
    if ("layout" in $$props2)
      $$invalidate(0, layout = $$props2.layout);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*layout*/
    1) {
      $$invalidate(9, leftSb = Utils.getScalesBySide(0, layout));
    }
    if ($$self.$$.dirty & /*layout*/
    1) {
      $$invalidate(8, rightSb = Utils.getScalesBySide(1, layout));
    }
    if ($$self.$$.dirty & /*props, layout, id*/
    7) {
      $$invalidate(7, style = `
    width: ${props.width}px;
    height: ${(layout || {}).height}px;
    /* didn't work, coz canvas draws through the border
    border-top: ${id ? "1px solid" : "none"};
    border-color: ${props.colors.scale};
    box-sizing: border-box;*/
`);
    }
  };
  return [
    layout,
    id,
    props,
    main,
    lsb,
    rsb,
    grid,
    style,
    rightSb,
    leftSb,
    grid_1_binding,
    sidebar_binding,
    sidebar_binding_1
  ];
}
class Pane extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, { id: 1, props: 2, main: 3, layout: 0 });
  }
}
const {
  MINUTE15,
  MINUTE,
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
  MONTHMAP,
  HPX
} = Const;
function body(props, layout, ctx) {
  const width = layout.botbar.width;
  const height = layout.botbar.height;
  const sb0 = layout.main.sbMax[0];
  layout.main.sbMax[1];
  ctx.font = props.config.FONT;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = props.colors.scale;
  ctx.beginPath();
  ctx.moveTo(0, 0.5);
  ctx.lineTo(Math.floor(width + 1), 0.5);
  ctx.stroke();
  ctx.fillStyle = props.colors.text;
  ctx.beginPath();
  for (var p of layout.botbar.xs) {
    let lbl = formatDate(props, p);
    let x = p[0] + sb0;
    ctx.moveTo(x + HPX, 0);
    ctx.lineTo(x + HPX, 4.5);
    if (!lblHighlight(props, p[1][0])) {
      ctx.globalAlpha = 0.85;
    }
    ctx.textAlign = "center";
    ctx.fillText(lbl, x, 18);
    ctx.globalAlpha = 1;
  }
  ctx.stroke();
}
function panel(props, layout, ctx) {
  let lbl = formatCursorX(props);
  ctx.fillStyle = props.colors.panel;
  let measure = ctx.measureText(lbl + "    ");
  let panwidth = Math.floor(measure.width + 10);
  let cursor = props.cursor.x + layout.main.sbMax[0];
  let x = Math.floor(cursor - panwidth * 0.5);
  let y = 1;
  let panheight = props.config.PANHEIGHT;
  roundRect(ctx, x, y, panwidth, panheight + 0.5, 3);
  ctx.fillStyle = props.colors.textHL;
  ctx.textAlign = "center";
  ctx.fillText(lbl, cursor, y + 16);
}
function formatDate(props, p) {
  let t = p[1];
  props.timeFrame;
  let d = new Date(t);
  if (p[2] === YEAR || Utils.yearStart(t) === t) {
    return d.getFullYear();
  }
  if (p[2] === MONTH || Utils.monthStart(t) === t) {
    return MONTHMAP[d.getMonth()];
  }
  if (Utils.dayStart(t) === t)
    return d.getDate();
  const h = Utils.addZero(d.getHours());
  const m = Utils.addZero(d.getMinutes());
  return h + ":" + m;
}
function formatCursorX(props) {
  let t = props.cursor.time;
  if (t === void 0 || isNaN(t))
    return `Out of range`;
  let tf = props.timeFrame;
  let d = new Date(t);
  if (tf === YEAR) {
    return d.getFullYear();
  }
  if (tf < YEAR) {
    var yr = "'" + `${d.getFullYear()}`.slice(-2);
    var mo = MONTHMAP[d.getMonth()];
    var dd = "01";
  }
  if (tf <= WEEK)
    dd = d.getDate();
  let date = `${dd} ${mo} ${yr}`;
  let time = "";
  if (tf < DAY) {
    const h = Utils.addZero(d.getHours());
    const m = Utils.addZero(d.getMinutes());
    time = h + ":" + m;
  }
  return `${date} ${time}`;
}
function lblHighlight(props, t) {
  let tf = props.timeFrame;
  if (t === 0)
    return true;
  if (Utils.monthStart(t) === t)
    return true;
  if (Utils.dayStart(t) === t)
    return true;
  if (tf <= MINUTE15 && t % HOUR === 0)
    return true;
  return false;
}
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r)
    r = w / 2;
  if (h < 2 * r)
    r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, 0);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, 0);
  ctx.closePath();
  ctx.fill();
}
const bb = {
  body,
  panel
};
function create_fragment$3(ctx) {
  let div;
  let canvas_1;
  return {
    c() {
      div = element("div");
      canvas_1 = element("canvas");
      attr(
        canvas_1,
        "id",
        /*canvasId*/
        ctx[2]
      );
      attr(div, "class", "nvjs-botbar svelte-8gplax");
      attr(
        div,
        "id",
        /*bbId*/
        ctx[1]
      );
      attr(
        div,
        "style",
        /*bbStyle*/
        ctx[0]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, canvas_1);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*bbStyle*/
      1) {
        attr(
          div,
          "style",
          /*bbStyle*/
          ctx2[0]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let bbStyle;
  let width;
  let { props = {} } = $$props;
  let { layout = {} } = $$props;
  let bbUpdId = `botbar`;
  let bbId = `${props.id}-botbar`;
  let canvasId = `${props.id}-botbar-canvas`;
  let events = Events$1.instance(props.id);
  events.on(`${bbUpdId}:update-bb`, update2);
  events.on(`${bbUpdId}:show-bb-panel`, (f) => showPanel = f);
  let canvas;
  let ctx;
  let showPanel = true;
  onMount(() => {
    setup2();
  });
  onDestroy(() => {
    events.off(`${bbUpdId}`);
  });
  function setup2() {
    let botbar = layout.botbar;
    [canvas, ctx] = dpr.setup(canvasId, botbar.width, botbar.height);
    update2();
  }
  function update2($layout = layout) {
    $$invalidate(3, layout = $layout);
    if (!layout.botbar)
      return;
    bb.body(props, layout, ctx);
    if (props.cursor.x && props.cursor.ti !== void 0 && showPanel) {
      bb.panel(props, layout, ctx);
    }
  }
  function resizeWatch() {
    let botbar = layout.botbar;
    if (!canvas || !botbar)
      return;
    dpr.resize(canvas, ctx, botbar.width, botbar.height);
    update2();
  }
  $$self.$$set = ($$props2) => {
    if ("props" in $$props2)
      $$invalidate(4, props = $$props2.props);
    if ("layout" in $$props2)
      $$invalidate(3, layout = $$props2.layout);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*props, layout*/
    24) {
      $$invalidate(0, bbStyle = `
    background: ${props.colors.back};
    width: ${(layout.botbar || {}).width}px;
    height: ${(layout.botbar || {}).height}px;
`);
    }
    if ($$self.$$.dirty & /*layout*/
    8) {
      $$invalidate(5, width = (layout.botbar || {}).width);
    }
    if ($$self.$$.dirty & /*width*/
    32) {
      resizeWatch();
    }
  };
  return [bbStyle, bbId, canvasId, layout, props, width];
}
class Botbar extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, { props: 4, layout: 3 });
  }
}
function create_fragment$2(ctx) {
  let div;
  let t;
  return {
    c() {
      div = element("div");
      t = text("No data ¯\\_( °﹏°)_/¯");
      attr(div, "class", "nvjs-no-data-stub svelte-172ri4o");
      attr(
        div,
        "style",
        /*style*/
        ctx[0]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*style*/
      1) {
        attr(
          div,
          "style",
          /*style*/
          ctx2[0]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let style;
  let { props } = $$props;
  $$self.$$set = ($$props2) => {
    if ("props" in $$props2)
      $$invalidate(1, props = $$props2.props);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*props*/
    2) {
      $$invalidate(0, style = `
    display: flex;
    width: ${props.width}px;
    height: ${props.height}px;
    background: ${props.colors.back};
    color: ${props.colors.scale};
    font: ${props.config.FONT};
    font-size: 18px;
    font-style: italic;
    user-select: none;
    align-items:center;
    justify-content:center;
`);
    }
  };
  return [style, props];
}
class NoDataStub extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, { props: 1 });
  }
}
function add_css$1(target) {
  append_styles(target, "svelte-s3aopo", ".pane-separator.svelte-s3aopo{height:3px !important;width:100% !important;background-color:rgb(80, 80, 80);display:block;position:absolute;z-index:100;cursor:n-resize;transition:0.1s}.pane-separator.svelte-s3aopo:hover{background-color:rgb(148, 148, 148);transition:0.1s}.separator-active.svelte-s3aopo{background-color:rgb(223, 223, 223) !important}.nvjs-chart.svelte-s3aopo{height:100% !important}");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[34] = list[i];
  child_ctx[36] = i;
  return child_ctx;
}
function create_else_block(ctx) {
  let nodatastub;
  let current;
  nodatastub = new NoDataStub({ props: { props: (
    /*props*/
    ctx[0]
  ) } });
  return {
    c() {
      create_component(nodatastub.$$.fragment);
    },
    m(target, anchor) {
      mount_component(nodatastub, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const nodatastub_changes = {};
      if (dirty[0] & /*props*/
      1)
        nodatastub_changes.props = /*props*/
        ctx2[0];
      nodatastub.$set(nodatastub_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(nodatastub.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(nodatastub.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(nodatastub, detaching);
    }
  };
}
function create_if_block(ctx) {
  let t;
  let botbar;
  let current;
  let each_value = ensure_array_like(
    /*hub*/
    ctx[4].panes()
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  botbar = new Botbar({
    props: {
      props: (
        /*chartProps*/
        ctx[3]
      ),
      layout: (
        /*layout*/
        ctx[1]
      )
    }
  });
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t = space();
      create_component(botbar.$$.fragment);
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, t, anchor);
      mount_component(botbar, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*activeSeparator, selectSeparator, hub, layout, chartProps*/
      62) {
        each_value = ensure_array_like(
          /*hub*/
          ctx2[4].panes()
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(t.parentNode, t);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      const botbar_changes = {};
      if (dirty[0] & /*chartProps*/
      8)
        botbar_changes.props = /*chartProps*/
        ctx2[3];
      if (dirty[0] & /*layout*/
      2)
        botbar_changes.layout = /*layout*/
        ctx2[1];
      botbar.$set(botbar_changes);
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      transition_in(botbar.$$.fragment, local);
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      transition_out(botbar.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
      destroy_each(each_blocks, detaching);
      destroy_component(botbar, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let span;
  let mounted;
  let dispose;
  function mousedown_handler(...args) {
    return (
      /*mousedown_handler*/
      ctx[17](
        /*i*/
        ctx[36],
        ...args
      )
    );
  }
  return {
    c() {
      span = element("span");
      attr(span, "class", "pane-separator svelte-s3aopo");
      toggle_class(
        span,
        "separator-active",
        /*activeSeparator*/
        ctx[2] === /*i*/
        ctx[36]
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (!mounted) {
        dispose = listen(span, "mousedown", mousedown_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*activeSeparator*/
      4) {
        toggle_class(
          span,
          "separator-active",
          /*activeSeparator*/
          ctx[2] === /*i*/
          ctx[36]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block(ctx) {
  let pane_1;
  let t;
  let show_if = (
    /*i*/
    ctx[36] < /*hub*/
    ctx[4].panes().length - 1
  );
  let if_block_anchor;
  let current;
  pane_1 = new Pane({
    props: {
      id: (
        /*i*/
        ctx[36]
      ),
      layout: (
        /*layout*/
        ctx[1].grids[
          /*i*/
          ctx[36]
        ]
      ),
      props: (
        /*chartProps*/
        ctx[3]
      ),
      main: (
        /*pane*/
        ctx[34] === /*hub*/
        ctx[4].chart
      )
    }
  });
  let if_block = show_if && create_if_block_1(ctx);
  return {
    c() {
      create_component(pane_1.$$.fragment);
      t = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      mount_component(pane_1, target, anchor);
      insert(target, t, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const pane_1_changes = {};
      if (dirty[0] & /*layout*/
      2)
        pane_1_changes.layout = /*layout*/
        ctx2[1].grids[
          /*i*/
          ctx2[36]
        ];
      if (dirty[0] & /*chartProps*/
      8)
        pane_1_changes.props = /*chartProps*/
        ctx2[3];
      pane_1.$set(pane_1_changes);
      if (show_if)
        if_block.p(ctx2, dirty);
    },
    i(local) {
      if (current)
        return;
      transition_in(pane_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(pane_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t);
        detach(if_block_anchor);
      }
      destroy_component(pane_1, detaching);
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_fragment$1(ctx) {
  let div;
  let current_block_type_index;
  let if_block;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*layout*/
      ctx2[1] && /*layout*/
      ctx2[1].main
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div = element("div");
      if_block.c();
      attr(div, "class", "nvjs-chart svelte-s3aopo");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            div,
            "mousemove",
            /*dragSeparator*/
            ctx[6]
          ),
          listen(
            div,
            "mouseup",
            /*diselectSeparator*/
            ctx[7]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if_blocks[current_block_type_index].d();
      mounted = false;
      run_all(dispose);
    }
  };
}
const minHeight = 100;
function instance$1($$self, $$props, $$invalidate) {
  let chartProps;
  let { props = {} } = $$props;
  function getLayout() {
    return layout;
  }
  function getRange() {
    return range;
  }
  function getCursor() {
    return cursor;
  }
  function setRange(val) {
    var _a;
    let emit = !((_a = val.preventDefault) != null ? _a : true);
    delete val.preventDefault;
    Object.assign(range, val);
    onRangeChanged(range, emit);
  }
  function setCursor(val) {
    var _a;
    let emit = !((_a = val.preventDefault) != null ? _a : true);
    delete val.preventDefault;
    Object.assign(cursor, val);
    onCursorChanged(cursor, emit);
  }
  let hub = DataHub$1.instance(props.id);
  let meta = MetaHub$1.instance(props.id);
  let events = Events$1.instance(props.id);
  let scan = DataScan.instance(props.id);
  scan.init(props);
  let interval = scan.detectInterval();
  let timeFrame = scan.getTimeframe();
  let range = scan.defaultRange();
  let cursor = new Cursor(meta);
  let storage = {};
  let ctx = new Context(props);
  let layout = null;
  scan.calcIndexOffsets();
  events.on("chart:cursor-changed", onCursorChanged);
  events.on("chart:cursor-locked", onCursorLocked);
  events.on("chart:range-changed", onRangeChanged);
  events.on("chart:update-layout", update2);
  events.on("chart:full-update", fullUpdate);
  let sizes = [];
  let paneHeights = [];
  onMount(() => {
    hub.calcSubset(range);
    hub.detectMain();
    hub.loadScripts(range, scan.tf, true);
    meta.init(props);
    scan.updatePanesHash();
    $$invalidate(1, layout = new Layout(chartProps, hub, meta));
    if (Array.isArray(layout.grids)) {
      paneHeights = layout.grids.map((e) => e.height);
      sizes = [];
      for (let i = 0; i < layout.grids.length; i++) {
        sizes.push(0);
      }
    }
  });
  onDestroy(() => {
    events.off("chart");
  });
  function onCursorChanged($cursor, emit = true) {
    if ($cursor.mode)
      $$invalidate(16, cursor.mode = $cursor.mode, cursor);
    if (cursor.mode !== "explore") {
      cursor.xSync(hub, layout, chartProps, $cursor);
      if ($cursor.visible === false) {
        setTimeout(() => update2());
      }
    }
    if (emit)
      events.emit("$cursor-update", Utils.makeCursorEvent($cursor, cursor, layout));
    update2();
  }
  function onCursorLocked(state) {
    if (cursor.scrollLock && state)
      return;
    $$invalidate(16, cursor.locked = state, cursor);
  }
  function onRangeChanged($range, emit = true) {
    if (emit)
      events.emit("$range-update", $range);
    rangeUpdate($range);
    hub.updateRange(range);
    if (cursor.locked)
      return;
    cursor.xValues(hub, layout, chartProps);
    cursor.yValues(layout);
    update2();
    let Q = props.config.QUANTIZE_AFTER;
    if (Q)
      Utils.afterAll(storage, quantizeCursor, Q);
  }
  function quantizeCursor() {
    cursor.xSync(hub, layout, chartProps, cursor);
    update2();
  }
  function update2(opt = {}, emit = true) {
    if (emit)
      events.emit("$chart-pre-update");
    if (opt.updateHash)
      scan.updatePanesHash();
    if (scan.panesChanged())
      return fullUpdate(opt);
    $$invalidate(16, cursor);
    $$invalidate(1, layout = new Layout(chartProps, hub, meta, sizes));
    if (Array.isArray(layout.grids))
      paneHeights = layout.grids.map((e) => e.height);
    events.emit("update-pane", layout);
    events.emitSpec("botbar", "update-bb", layout);
    if (emit)
      events.emit("$chart-update");
  }
  function fullUpdate(opt = {}) {
    let prevIbMode = scan.ibMode;
    $$invalidate(13, interval = scan.detectInterval());
    $$invalidate(14, timeFrame = scan.getTimeframe());
    let ibc = scan.ibMode !== prevIbMode;
    if (!range.length || opt.resetRange || ibc) {
      rangeUpdate(scan.defaultRange());
    }
    scan.calcIndexOffsets();
    hub.calcSubset(range);
    hub.init(hub.data);
    hub.detectMain();
    hub.loadScripts();
    meta.init(props);
    meta.restore();
    scan.updatePanesHash();
    update2();
    events.emit("remake-grid");
  }
  function rangeUpdate($range) {
    $$invalidate(15, range = $range);
    $$invalidate(
      3,
      chartProps.range = range,
      // Instant update
      chartProps
    );
  }
  let activeSeparator = null;
  let selectedPaneIndex = null;
  let yMouseCords = 0;
  const selectSeparator = (event, index) => {
    selectedPaneIndex = index;
    yMouseCords = event.y;
    $$invalidate(2, activeSeparator = index);
  };
  const dragSeparator = (event) => {
    if (selectedPaneIndex === null)
      return;
    if (event.y > yMouseCords) {
      if (paneHeights[selectedPaneIndex + 1] !== minHeight)
        sizes[selectedPaneIndex] += event.y - yMouseCords;
      if (paneHeights[selectedPaneIndex + 1] > minHeight)
        sizes[selectedPaneIndex + 1] += -(event.y - yMouseCords);
    }
    if (event.y < yMouseCords) {
      if (paneHeights[selectedPaneIndex] > minHeight)
        sizes[selectedPaneIndex] += -(yMouseCords - event.y);
      if (paneHeights[selectedPaneIndex] !== minHeight)
        sizes[selectedPaneIndex + 1] += yMouseCords - event.y;
    }
    yMouseCords = event.y;
    sizes = sizes;
    $$invalidate(1, layout = new Layout(chartProps, hub, meta, sizes));
    if (Array.isArray(layout.grids))
      paneHeights = layout.grids.map((e) => e.height);
  };
  const diselectSeparator = () => {
    selectedPaneIndex = null;
    $$invalidate(2, activeSeparator = null);
    yMouseCords = 0;
  };
  const mousedown_handler = (i, event) => selectSeparator(event, i);
  $$self.$$set = ($$props2) => {
    if ("props" in $$props2)
      $$invalidate(0, props = $$props2.props);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*interval, timeFrame, range, cursor, props*/
    122881) {
      $$invalidate(3, chartProps = Object.assign({ interval, timeFrame, range, ctx, cursor }, props));
    }
  };
  return [
    props,
    layout,
    activeSeparator,
    chartProps,
    hub,
    selectSeparator,
    dragSeparator,
    diselectSeparator,
    getLayout,
    getRange,
    getCursor,
    setRange,
    setCursor,
    interval,
    timeFrame,
    range,
    cursor,
    mousedown_handler
  ];
}
class Chart extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$1,
      create_fragment$1,
      safe_not_equal,
      {
        props: 0,
        getLayout: 8,
        getRange: 9,
        getCursor: 10,
        setRange: 11,
        setCursor: 12
      },
      add_css$1,
      [-1, -1]
    );
  }
  get getLayout() {
    return this.$$.ctx[8];
  }
  get getRange() {
    return this.$$.ctx[9];
  }
  get getCursor() {
    return this.$$.ctx[10];
  }
  get setRange() {
    return this.$$.ctx[11];
  }
  get setCursor() {
    return this.$$.ctx[12];
  }
}
function add_css(target) {
  append_styles(target, "svelte-7z7hqo", ".svelte-7z7hqo::after,.svelte-7z7hqo::before{box-sizing:content-box}.night-vision.svelte-7z7hqo{position:relative;direction:ltr}");
}
function create_fragment(ctx) {
  let div;
  let chart_1;
  let current;
  let chart_1_props = { props: (
    /*props*/
    ctx[1]
  ) };
  chart_1 = new Chart({ props: chart_1_props });
  ctx[19](chart_1);
  return {
    c() {
      div = element("div");
      create_component(chart_1.$$.fragment);
      attr(div, "class", "night-vision svelte-7z7hqo");
      attr(
        div,
        "id",
        /*id*/
        ctx[0]
      );
      attr(
        div,
        "style",
        /*style*/
        ctx[3]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(chart_1, div, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      const chart_1_changes = {};
      if (dirty & /*props*/
      2)
        chart_1_changes.props = /*props*/
        ctx2[1];
      chart_1.$set(chart_1_changes);
      if (!current || dirty & /*id*/
      1) {
        attr(
          div,
          "id",
          /*id*/
          ctx2[0]
        );
      }
      if (!current || dirty & /*style*/
      8) {
        attr(
          div,
          "style",
          /*style*/
          ctx2[3]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(chart_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(chart_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      ctx[19](null);
      destroy_component(chart_1);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let configMerge;
  let offset;
  let colorsUser;
  let props;
  let style;
  let chart;
  function getChart() {
    return chart;
  }
  let { showLogo = false } = $$props;
  let { id = "nvjs" } = $$props;
  let { width = 750 } = $$props;
  let { height = 420 } = $$props;
  let { colors = {} } = $$props;
  let { toolbar = false } = $$props;
  let { scripts = [] } = $$props;
  let { config = {} } = $$props;
  let { indexBased = false } = $$props;
  let { timezone = 0 } = $$props;
  let { data = {} } = $$props;
  let { autoResize = false } = $$props;
  function chart_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      chart = $$value;
      $$invalidate(2, chart);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("showLogo" in $$props2)
      $$invalidate(5, showLogo = $$props2.showLogo);
    if ("id" in $$props2)
      $$invalidate(0, id = $$props2.id);
    if ("width" in $$props2)
      $$invalidate(6, width = $$props2.width);
    if ("height" in $$props2)
      $$invalidate(7, height = $$props2.height);
    if ("colors" in $$props2)
      $$invalidate(8, colors = $$props2.colors);
    if ("toolbar" in $$props2)
      $$invalidate(9, toolbar = $$props2.toolbar);
    if ("scripts" in $$props2)
      $$invalidate(10, scripts = $$props2.scripts);
    if ("config" in $$props2)
      $$invalidate(11, config = $$props2.config);
    if ("indexBased" in $$props2)
      $$invalidate(12, indexBased = $$props2.indexBased);
    if ("timezone" in $$props2)
      $$invalidate(13, timezone = $$props2.timezone);
    if ("data" in $$props2)
      $$invalidate(14, data = $$props2.data);
    if ("autoResize" in $$props2)
      $$invalidate(15, autoResize = $$props2.autoResize);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*config*/
    2048) {
      $$invalidate(16, configMerge = Object.assign(Const.ChartConfig, config));
    }
    if ($$self.$$.dirty & /*toolbar, config*/
    2560) {
      $$invalidate(18, offset = toolbar ? config.TOOLBAR : 0);
    }
    if ($$self.$$.dirty & /*colors*/
    256) {
      $$invalidate(17, colorsUser = Object.assign(Const.COLORS, colors));
    }
    if ($$self.$$.dirty & /*showLogo, id, width, offset, height, colorsUser, scripts, configMerge, timezone*/
    468193) {
      $$invalidate(1, props = {
        showLogo,
        id,
        width: width - offset,
        height,
        colors: colorsUser,
        //toolbar,
        scripts,
        config: configMerge,
        //legendButtons,
        //indexBased,
        //extensions,
        //xSettings,
        //skin,
        timezone
      });
    }
    if ($$self.$$.dirty & /*props*/
    2) {
      $$invalidate(3, style = `
    width: ${props.width}px;
    height: ${props.height}px;
`);
    }
  };
  return [
    id,
    props,
    chart,
    style,
    getChart,
    showLogo,
    width,
    height,
    colors,
    toolbar,
    scripts,
    config,
    indexBased,
    timezone,
    data,
    autoResize,
    configMerge,
    colorsUser,
    offset,
    chart_1_binding
  ];
}
let NightVision$1 = class NightVision extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance,
      create_fragment,
      safe_not_equal,
      {
        getChart: 4,
        showLogo: 5,
        id: 0,
        width: 6,
        height: 7,
        colors: 8,
        toolbar: 9,
        scripts: 10,
        config: 11,
        indexBased: 12,
        timezone: 13,
        data: 14,
        autoResize: 15
      },
      add_css
    );
  }
  get getChart() {
    return this.$$.ctx[4];
  }
  get showLogo() {
    return this.$$.ctx[5];
  }
  set showLogo(showLogo) {
    this.$$set({ showLogo });
    flush();
  }
  get id() {
    return this.$$.ctx[0];
  }
  set id(id) {
    this.$$set({ id });
    flush();
  }
  get width() {
    return this.$$.ctx[6];
  }
  set width(width) {
    this.$$set({ width });
    flush();
  }
  get height() {
    return this.$$.ctx[7];
  }
  set height(height) {
    this.$$set({ height });
    flush();
  }
  get colors() {
    return this.$$.ctx[8];
  }
  set colors(colors) {
    this.$$set({ colors });
    flush();
  }
  get toolbar() {
    return this.$$.ctx[9];
  }
  set toolbar(toolbar) {
    this.$$set({ toolbar });
    flush();
  }
  get scripts() {
    return this.$$.ctx[10];
  }
  set scripts(scripts) {
    this.$$set({ scripts });
    flush();
  }
  get config() {
    return this.$$.ctx[11];
  }
  set config(config) {
    this.$$set({ config });
    flush();
  }
  get indexBased() {
    return this.$$.ctx[12];
  }
  set indexBased(indexBased) {
    this.$$set({ indexBased });
    flush();
  }
  get timezone() {
    return this.$$.ctx[13];
  }
  set timezone(timezone) {
    this.$$set({ timezone });
    flush();
  }
  get data() {
    return this.$$.ctx[14];
  }
  set data(data) {
    this.$$set({ data });
    flush();
  }
  get autoResize() {
    return this.$$.ctx[15];
  }
  set autoResize(autoResize) {
    this.$$set({ autoResize });
    flush();
  }
};
function resizeTracker(chart) {
  const resizeObserver = new ResizeObserver((entries) => {
    let rect = chart.root.getBoundingClientRect();
    chart.width = rect.width;
    chart.height = rect.height;
  });
  resizeObserver.observe(chart.root);
}
class NightVision2 {
  constructor(target, props = {}) {
    this._data = props.data || {};
    this._scripts = props.scripts || [];
    let id = props.id || "nvjs";
    this.ww = WebWork$1.instance(id, this);
    this.se = SeClient$1.instance(id, this);
    this.hub = DataHub$1.instance(id);
    this.meta = MetaHub$1.instance(id);
    this.scan = DataScan.instance(id);
    this.events = Events$1.instance(id);
    this.scriptHub = Scripts$1.instance(id);
    this.hub.init(this._data);
    this.scriptHub.init(this._scripts);
    this.root = document.getElementById(target);
    this.comp = new NightVision$1({
      target: this.root,
      props
    });
    if (props.autoResize) {
      resizeTracker(this);
    }
    this.se.setRefs(this.hub, this.scan);
  }
  // *** PROPS ***
  // (see the default values in NightVision.svelte)
  // Chart container id (should be unique)
  get id() {
    return this.comp.id;
  }
  set id(val) {
    this.comp.$set({ id: val });
  }
  // Width of the chart
  get width() {
    return this.comp.width;
  }
  set width(val) {
    this.comp.$set({ width: val });
    setTimeout(() => this.update());
  }
  // Height of the chart
  get height() {
    return this.comp.height;
  }
  set height(val) {
    this.comp.$set({ height: val });
    setTimeout(() => this.update());
  }
  // Colors (modify specific colors)
  // TODO: not reactive enough
  get colors() {
    return this.comp.colors;
  }
  set colors(val) {
    this.comp.$set({ colors: val });
  }
  // Show NV logo or not
  get showLogo() {
    return this.comp.showLogo;
  }
  set showLogo(val) {
    this.comp.$set({ id: val });
  }
  // User-defined scripts (overlays & indicators)
  get scripts() {
    return this._scripts;
  }
  set scripts(val) {
    this._scripts = val;
    this.scriptHub.init(this._scripts);
    this.update("full");
  }
  // The data (auto-updated on reset)
  get data() {
    return this._data;
  }
  set data(val) {
    this._data = val;
    this.update("full");
  }
  // Overwrites the default config values
  get config() {
    return this.comp.config;
  }
  set config(val) {
    this.comp.$set({ config: val });
  }
  // Index-based mode of rendering
  get indexBased() {
    return this.comp.indexBased;
  }
  set indexBased(val) {
    this.comp.$set({ indexBased: val });
  }
  // Timezone (Shift from UTC, hours)
  get timezone() {
    return this.comp.timezone;
  }
  set timezone(val) {
    this.comp.$set({ timezone: val });
    setTimeout(() => this.update());
  }
  // *** Internal variables ***
  get layout() {
    let chart = this.comp.getChart();
    if (!chart)
      return null;
    return chart.getLayout();
  }
  get range() {
    let chart = this.comp.getChart();
    if (!chart)
      return null;
    return chart.getRange();
  }
  set range(val) {
    let chart = this.comp.getChart();
    if (!chart)
      return;
    chart.setRange(val);
  }
  get cursor() {
    let chart = this.comp.getChart();
    if (!chart)
      return null;
    return chart.getCursor();
  }
  set cursor(val) {
    let chart = this.comp.getChart();
    if (!chart)
      return;
    chart.setCursor(val);
  }
  // *** METHODS ***
  // Various updates of the chart
  update(type = "layout", opt = {}) {
    var [type, id] = type.split("-");
    const ev = this.events;
    switch (type) {
      case "layout":
        ev.emitSpec("chart", "update-layout", opt);
        break;
      case "data":
        this.hub.updateRange(this.range);
        this.meta.calcOhlcMap();
        ev.emitSpec("chart", "update-layout", opt);
        break;
      case "full":
        this.hub.init(this._data);
        ev.emitSpec("chart", "full-update", opt);
        break;
      case "grid":
        if (id === void 0) {
          ev.emit("remake-grid");
        } else {
          let gridId = `grid-${id}`;
          ev.emitSpec(gridId, "remake-grid", opt);
        }
        break;
      case "legend":
        if (id === void 0) {
          ev.emit("update-legend");
        } else {
          let gridId = `legend-${id}`;
          ev.emitSpec(gridId, "update-legend", opt);
        }
        break;
    }
  }
  // Reset everything
  fullReset() {
    this.update("full", { resetRange: true });
  }
  // Go to time/index
  goto(ti) {
    let range = this.range;
    let dti = range[1] - range[0];
    this.range = [ti - dti, ti];
  }
  // Scroll on interval forward
  // TODO: keep legend updated, when the cursor is outside
  scroll() {
    if (this.cursor.locked)
      return;
    let main = this.hub.mainOv.data;
    let last = main[main.length - 1];
    let ib = this.hub.indexBased;
    if (!last)
      return;
    let tl = ib ? main.length - 1 : last[0];
    let d = this.range[1] - tl;
    let int = this.scan.interval;
    if (d > 0)
      this.goto(this.range[1] + int);
  }
  // Should call this to clean-up memory / events
  destroy() {
    this.comp.$destroy();
  }
}
export {
  Const as C,
  DataHub$1 as D,
  Events$1 as E,
  MetaHub$1 as M,
  NightVision2 as N,
  Scripts$1 as S,
  Utils as U,
  DataScan as a,
  getDefaultExportFromCjs as g
};
