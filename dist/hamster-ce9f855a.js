/* NightVisionCharts v0.4.2 | License: MIT
 © 2022 ChartMaster. All rights reserved */
import { g as getDefaultExportFromCjs } from "./index-50b03d26.js";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var hamster$2 = { exports: {} };
(function(module, exports) {
  (function(window2, document) {
    var Hamster = function(element) {
      return new Hamster.Instance(element);
    };
    Hamster.SUPPORT = "wheel";
    Hamster.ADD_EVENT = "addEventListener";
    Hamster.REMOVE_EVENT = "removeEventListener";
    Hamster.PREFIX = "";
    Hamster.READY = false;
    Hamster.Instance = function(element) {
      if (!Hamster.READY) {
        Hamster.normalise.browser();
        Hamster.READY = true;
      }
      this.element = element;
      this.handlers = [];
      return this;
    };
    Hamster.Instance.prototype = {
      /**
       * bind events to the instance
       * @param   {Function}    handler
       * @param   {Boolean}     useCapture
       * @returns {Hamster.Instance}
       */
      wheel: function onEvent(handler, useCapture) {
        Hamster.event.add(this, Hamster.SUPPORT, handler, useCapture);
        if (Hamster.SUPPORT === "DOMMouseScroll") {
          Hamster.event.add(this, "MozMousePixelScroll", handler, useCapture);
        }
        return this;
      },
      /**
       * unbind events to the instance
       * @param   {Function}    handler
       * @param   {Boolean}     useCapture
       * @returns {Hamster.Instance}
       */
      unwheel: function offEvent(handler, useCapture) {
        if (handler === void 0 && (handler = this.handlers.slice(-1)[0])) {
          handler = handler.original;
        }
        Hamster.event.remove(this, Hamster.SUPPORT, handler, useCapture);
        if (Hamster.SUPPORT === "DOMMouseScroll") {
          Hamster.event.remove(this, "MozMousePixelScroll", handler, useCapture);
        }
        return this;
      }
    };
    Hamster.event = {
      /**
       * cross-browser 'addWheelListener'
       * @param   {Instance}    hamster
       * @param   {String}      eventName
       * @param   {Function}    handler
       * @param   {Boolean}     useCapture
       */
      add: function add(hamster2, eventName, handler, useCapture) {
        var originalHandler = handler;
        handler = function(originalEvent) {
          if (!originalEvent) {
            originalEvent = window2.event;
          }
          var event = Hamster.normalise.event(originalEvent), delta = Hamster.normalise.delta(originalEvent);
          return originalHandler(event, delta[0], delta[1], delta[2]);
        };
        hamster2.element[Hamster.ADD_EVENT](Hamster.PREFIX + eventName, handler, useCapture || false);
        hamster2.handlers.push({
          original: originalHandler,
          normalised: handler
        });
      },
      /**
       * removeWheelListener
       * @param   {Instance}    hamster
       * @param   {String}      eventName
       * @param   {Function}    handler
       * @param   {Boolean}     useCapture
       */
      remove: function remove(hamster2, eventName, handler, useCapture) {
        var originalHandler = handler, lookup = {}, handlers;
        for (var i = 0, len = hamster2.handlers.length; i < len; ++i) {
          lookup[hamster2.handlers[i].original] = hamster2.handlers[i];
        }
        handlers = lookup[originalHandler];
        handler = handlers.normalised;
        hamster2.element[Hamster.REMOVE_EVENT](Hamster.PREFIX + eventName, handler, useCapture || false);
        for (var h in hamster2.handlers) {
          if (hamster2.handlers[h] == handlers) {
            hamster2.handlers.splice(h, 1);
            break;
          }
        }
      }
    };
    var lowestDelta, lowestDeltaXY;
    Hamster.normalise = {
      /**
       * fix browser inconsistencies
       */
      browser: function normaliseBrowser() {
        if (!("onwheel" in document || document.documentMode >= 9)) {
          Hamster.SUPPORT = document.onmousewheel !== void 0 ? "mousewheel" : (
            // webkit and IE < 9 support at least "mousewheel"
            "DOMMouseScroll"
          );
        }
        if (!window2.addEventListener) {
          Hamster.ADD_EVENT = "attachEvent";
          Hamster.REMOVE_EVENT = "detachEvent";
          Hamster.PREFIX = "on";
        }
      },
      /**
       * create a normalised event object
       * @param   {Function}    originalEvent
       * @returns {Object}      event
       */
      event: function normaliseEvent(originalEvent) {
        var event = {
          // keep a reference to the original event object
          originalEvent,
          target: originalEvent.target || originalEvent.srcElement,
          type: "wheel",
          deltaMode: originalEvent.type === "MozMousePixelScroll" ? 0 : 1,
          deltaX: 0,
          deltaZ: 0,
          preventDefault: function() {
            if (originalEvent.preventDefault) {
              originalEvent.preventDefault();
            } else {
              originalEvent.returnValue = false;
            }
          },
          stopPropagation: function() {
            if (originalEvent.stopPropagation) {
              originalEvent.stopPropagation();
            } else {
              originalEvent.cancelBubble = false;
            }
          }
        };
        if (originalEvent.wheelDelta) {
          event.deltaY = -1 / 40 * originalEvent.wheelDelta;
        }
        if (originalEvent.wheelDeltaX) {
          event.deltaX = -1 / 40 * originalEvent.wheelDeltaX;
        }
        if (originalEvent.detail) {
          event.deltaY = originalEvent.detail;
        }
        return event;
      },
      /**
       * normalise 'deltas' of the mouse wheel
       * @param   {Function}    originalEvent
       * @returns {Array}       deltas
       */
      delta: function normaliseDelta(originalEvent) {
        var delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, absDeltaXY = 0, fn;
        if (originalEvent.deltaY) {
          deltaY = originalEvent.deltaY * -1;
          delta = deltaY;
        }
        if (originalEvent.deltaX) {
          deltaX = originalEvent.deltaX;
          delta = deltaX * -1;
        }
        if (originalEvent.wheelDelta) {
          delta = originalEvent.wheelDelta;
        }
        if (originalEvent.wheelDeltaY) {
          deltaY = originalEvent.wheelDeltaY;
        }
        if (originalEvent.wheelDeltaX) {
          deltaX = originalEvent.wheelDeltaX * -1;
        }
        if (originalEvent.detail) {
          delta = originalEvent.detail * -1;
        }
        if (delta === 0) {
          return [0, 0, 0];
        }
        absDelta = Math.abs(delta);
        if (!lowestDelta || absDelta < lowestDelta) {
          lowestDelta = absDelta;
        }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
          lowestDeltaXY = absDeltaXY;
        }
        fn = delta > 0 ? "floor" : "ceil";
        delta = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);
        return [delta, deltaX, deltaY];
      }
    };
    if (typeof window2.define === "function" && window2.define.amd) {
      window2.define("hamster", [], function() {
        return Hamster;
      });
    } else {
      module.exports = Hamster;
    }
  })(window, window.document);
})(hamster$2);
var hamsterExports = hamster$2.exports;
const hamster = /* @__PURE__ */ getDefaultExportFromCjs(hamsterExports);
const hamster$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: hamster
}, [hamsterExports]);
export {
  hamster$1 as h
};
