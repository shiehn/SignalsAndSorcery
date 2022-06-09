(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define("VueToast", ["vue"], factory);
	else if(typeof exports === 'object')
		exports["VueToast"] = factory(require("vue"));
	else
		root["VueToast"] = factory(root["Vue"]);
})(this, (__WEBPACK_EXTERNAL_MODULE__976__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 831:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// runtime helper for setting properties on components
// in a tree-shakable way
exports["default"] = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
        target[key] = val;
    }
    return target;
};


/***/ }),

/***/ 976:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__976__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ToastComponent": () => (/* reexport */ Component),
  "ToastPlugin": () => (/* binding */ ToastPlugin),
  "ToastPositions": () => (/* reexport */ positions),
  "default": () => (/* binding */ src),
  "useToast": () => (/* reexport */ useToast)
});

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","amd":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_ = __webpack_require__(976);
;// CONCATENATED MODULE: ./node_modules/.pnpm/babel-loader@8.2.5_rb5fcebzp6kx3hqg3ucus54t3m/node_modules/babel-loader/lib/index.js!./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.72.0/node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.72.0/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./src/js/Component.vue?vue&type=template&id=f73c8b4e


const _hoisted_1 = /*#__PURE__*/(0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.createElementVNode)("div", {
  class: "v-toast__icon"
}, null, -1);

const _hoisted_2 = ["innerHTML"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.createBlock)(external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.Transition, {
    "enter-active-class": _ctx.transition.enter,
    "leave-active-class": _ctx.transition.leave
  }, {
    default: (0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.withCtx)(() => [(0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.withDirectives)((0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.createElementVNode)("div", {
      ref: "root",
      role: "alert",
      class: (0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.normalizeClass)(["v-toast__item", ["v-toast__item--".concat(_ctx.type), "v-toast__item--".concat(_ctx.position)]]),
      onMouseover: _cache[0] || (_cache[0] = $event => _ctx.toggleTimer(true)),
      onMouseleave: _cache[1] || (_cache[1] = $event => _ctx.toggleTimer(false)),
      onClick: _cache[2] || (_cache[2] = function () {
        return _ctx.whenClicked && _ctx.whenClicked(...arguments);
      })
    }, [_hoisted_1, (0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.createElementVNode)("p", {
      class: "v-toast__text",
      innerHTML: _ctx.message
    }, null, 8, _hoisted_2)], 34), [[external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.vShow, _ctx.isActive]])]),
    _: 1
  }, 8, ["enter-active-class", "leave-active-class"]);
}
;// CONCATENATED MODULE: ./src/js/Component.vue?vue&type=template&id=f73c8b4e

;// CONCATENATED MODULE: ./src/js/helpers.js

function removeElement(el) {
  if (typeof el.remove !== 'undefined') {
    el.remove();
  } else {
    var _el$parentNode;

    (_el$parentNode = el.parentNode) === null || _el$parentNode === void 0 ? void 0 : _el$parentNode.removeChild(el);
  }
}
function createComponent(component, props, parentContainer) {
  let slots = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const vNode = (0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.h)(component, props, slots);
  const container = document.createElement('div');
  container.classList.add('v-toast--pending');
  parentContainer.appendChild(container);
  (0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.render)(vNode, container);
  return vNode.component;
}
;// CONCATENATED MODULE: ./src/js/timer.js
// https://stackoverflow.com/a/3969760
class Timer {
  constructor(callback, delay) {
    this.startedAt = Date.now();
    this.callback = callback;
    this.delay = delay;
    this.timer = setTimeout(callback, delay);
  }

  pause() {
    this.stop();
    this.delay -= Date.now() - this.startedAt;
  }

  resume() {
    this.stop();
    this.startedAt = Date.now();
    this.timer = setTimeout(this.callback, this.delay);
  }

  stop() {
    clearTimeout(this.timer);
  }

}
;// CONCATENATED MODULE: ./src/js/positions.js
/* harmony default export */ const positions = (Object.freeze({
  TOP_RIGHT: 'top-right',
  TOP: 'top',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM: 'bottom',
  BOTTOM_LEFT: 'bottom-left'
}));
;// CONCATENATED MODULE: ./node_modules/.pnpm/mitt@3.0.0/node_modules/mitt/dist/mitt.mjs
/* harmony default export */ function mitt(n){return{all:n=n||new Map,on:function(t,e){var i=n.get(t);i?i.push(e):n.set(t,[e])},off:function(t,e){var i=n.get(t);i&&(e?i.splice(i.indexOf(e)>>>0,1):n.set(t,[]))},emit:function(t,e){var i=n.get(t);i&&i.slice().map(function(n){n(e)}),(i=n.get("*"))&&i.slice().map(function(n){n(t,e)})}}}
//# sourceMappingURL=mitt.mjs.map

;// CONCATENATED MODULE: ./src/js/bus.js

const eventBus = mitt();
/* harmony default export */ const bus = (eventBus);
;// CONCATENATED MODULE: ./node_modules/.pnpm/babel-loader@8.2.5_rb5fcebzp6kx3hqg3ucus54t3m/node_modules/babel-loader/lib/index.js!./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.72.0/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./src/js/Component.vue?vue&type=script&lang=js





/* harmony default export */ const Componentvue_type_script_lang_js = ((0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.defineComponent)({
  name: 'Toast',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success'
    },
    position: {
      type: String,
      default: positions.BOTTOM_RIGHT,

      validator(value) {
        return Object.values(positions).includes(value);
      }

    },
    duration: {
      type: Number,
      default: 3000
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    onDismiss: {
      type: Function,
      default: () => {}
    },
    onClick: {
      type: Function,
      default: () => {}
    },
    queue: Boolean,
    pauseOnHover: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isActive: false,
      parentTop: null,
      parentBottom: null,
      isHovered: false
    };
  },

  beforeMount() {
    this.setupContainer();
  },

  mounted() {
    this.showNotice();
    bus.on('toast-clear', this.dismiss);
  },

  methods: {
    setupContainer() {
      this.parentTop = document.querySelector('.v-toast.v-toast--top');
      this.parentBottom = document.querySelector('.v-toast.v-toast--bottom'); // No need to create them, they already exists

      if (this.parentTop && this.parentBottom) return;

      if (!this.parentTop) {
        this.parentTop = document.createElement('div');
        this.parentTop.className = 'v-toast v-toast--top';
      }

      if (!this.parentBottom) {
        this.parentBottom = document.createElement('div');
        this.parentBottom.className = 'v-toast v-toast--bottom';
      }

      const container = document.body;
      container.appendChild(this.parentTop);
      container.appendChild(this.parentBottom);
    },

    shouldQueue() {
      if (!this.queue) return false;
      return this.parentTop.childElementCount > 0 || this.parentBottom.childElementCount > 0;
    },

    dismiss() {
      if (this.timer) this.timer.stop();
      clearTimeout(this.queueTimer);
      this.isActive = false; // Timeout for the animation complete before destroying

      setTimeout(() => {
        this.onDismiss.apply(null, arguments);
        const wrapper = this.$refs.root; // unmount the component

        (0,external_commonjs_vue_commonjs2_vue_amd_vue_root_Vue_.render)(null, wrapper);
        removeElement(wrapper);
      }, 150);
    },

    showNotice() {
      if (this.shouldQueue()) {
        // Call recursively if it should queue
        this.queueTimer = setTimeout(this.showNotice, 250);
        return;
      }

      const wrapper = this.$refs.root.parentElement;
      this.correctParent.insertAdjacentElement('afterbegin', this.$refs.root);
      removeElement(wrapper);
      this.isActive = true;

      if (this.duration) {
        this.timer = new Timer(this.dismiss, this.duration);
      }
    },

    whenClicked() {
      if (!this.dismissible) return;
      this.onClick.apply(null, arguments);
      this.dismiss();
    },

    toggleTimer(newVal) {
      if (!this.pauseOnHover || !this.timer) return;
      newVal ? this.timer.pause() : this.timer.resume();
    }

  },
  computed: {
    correctParent() {
      switch (this.position) {
        case positions.TOP:
        case positions.TOP_RIGHT:
        case positions.TOP_LEFT:
          return this.parentTop;

        case positions.BOTTOM:
        case positions.BOTTOM_RIGHT:
        case positions.BOTTOM_LEFT:
          return this.parentBottom;
      }
    },

    transition() {
      switch (this.position) {
        case positions.TOP:
        case positions.TOP_RIGHT:
        case positions.TOP_LEFT:
          return {
            enter: 'v-toast--fade-in-down',
            leave: 'v-toast--fade-out'
          };

        case positions.BOTTOM:
        case positions.BOTTOM_RIGHT:
        case positions.BOTTOM_LEFT:
          return {
            enter: 'v-toast--fade-in-up',
            leave: 'v-toast--fade-out'
          };
      }
    }

  },

  beforeUnmount() {
    bus.off('toast-clear', this.dismiss);
  }

}));
;// CONCATENATED MODULE: ./src/js/Component.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.72.0/node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(831);
;// CONCATENATED MODULE: ./src/js/Component.vue




;
const __exports__ = /*#__PURE__*/(0,exportHelper["default"])(Componentvue_type_script_lang_js, [['render',render]])

/* harmony default export */ const Component = (__exports__);
;// CONCATENATED MODULE: ./src/js/api.js



const useToast = function () {
  let globalProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    open(options) {
      let message = null;
      if (typeof options === 'string') message = options;
      const defaultProps = {
        message
      };
      const propsData = Object.assign({}, defaultProps, globalProps, options);
      const instance = createComponent(Component, propsData, document.body);
      return {
        dismiss: instance.ctx.dismiss
      };
    },

    clear() {
      bus.emit('toast-clear');
    },

    success(message) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.open(Object.assign({}, {
        message,
        type: 'success'
      }, options));
    },

    error(message) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.open(Object.assign({}, {
        message,
        type: 'error'
      }, options));
    },

    info(message) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.open(Object.assign({}, {
        message,
        type: 'info'
      }, options));
    },

    warning(message) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.open(Object.assign({}, {
        message,
        type: 'warning'
      }, options));
    },

    default(message) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.open(Object.assign({}, {
        message,
        type: 'default'
      }, options));
    }

  };
};
;// CONCATENATED MODULE: ./src/index.js



const ToastPlugin = {
  install: function (app) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let instance = useToast(options);
    app.config.globalProperties.$toast = instance;
    app.provide('$toast', instance);
  }
};
/* harmony default export */ const src = (ToastPlugin);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});