(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("spa", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.spa = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Screen = void 0;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  //// Build for Knockout SPA ////

  /**
   * Tests whether or not a value is defined. Identical to (typeof value !== 'undefined').
   * @param {*} value - The value to evaluate.
   * @returns {Boolean} Whether or not the value is defined.
   */
  function defined(value) {
    return typeof value !== 'undefined'; // eslint-disable-line gxrules/no-typeof
  }
  /**
   * Returns the specified object key after traversal, or undefined.
   * This function will also unwrap any observables and call all functions along the way, but not the final result.
   * @param {Object} object - The object to traverse.
   * @param {...(String|Number)} keys - The keys to search for.
   * @param {Boolean} [create] - Whether or not to create the keys if they don't exist. Must be strictly boolean. Last key
   *   will be created as observable.
   * @returns {*} The value of the key.
   * @example
   * let ob1 = {a: {b: {c: 5}}};
   * let ob2 = objectTraverse(ob1, 'a', 'b', 'c'); // 5
   * let ob3 = objectTraverse(ob1, 'd', 'b', 'c'); // undefined
   * let ob4 = ob1.d.b.c; // TypeError: Cannot read property 'b' of undefined.
   * @example
   * let obj = {a: ko.observable(5)};
   * let obs = objectTraverse(obj, 'a'); // observable.
   * let val = obs(); // 5.
   */


  function objectTraverse(object, keys, create) {
    // eslint-disable-line no-unused-vars
    objectTraverse.prevobject = null;
    var creating = arguments[arguments.length - 1] === true; // If last argument is strictly true then it is not a key.

    var numkeys = arguments.length - (creating ? 1 : 0);
    var notifyChange;
    var lastobs;

    for (var i = 1; i < numkeys; i++) {
      // if (creating && ko.isWritableObservable(object) && !defined(object())) {
      //     object({});
      // }
      lastobs = ko.isObservable(object) ? object : lastobs;
      /* eslint-disable gxrules/no-typeof */

      object = typeof object === 'function' ? object.call(objectTraverse.prevobject) : object;

      if (object === null || _typeof(object) !== 'object' && typeof object !== 'function') {
        return;
      }
      /* eslint-enable gxrules/no-typeof */


      if (!(arguments[i] in object)) {
        if (!creating) {
          return;
        }

        notifyChange = notifyChange || lastobs;
        object[arguments[i]] = i + 1 === numkeys ? ko.observable() : {};
      }

      objectTraverse.prevobject = object;
      object = object[arguments[i]];
    }

    if (notifyChange) {
      notifyChange.valueHasMutated(notifyChange());
    }

    return object;
  }
  /**
   * Similar to a call to objectTraverse with the result unwrapped.
   * @see {module:util.objectTraverse}
   * @param {Object} object - The object to traverse.
   * @param {...(String|Number)} keys - The keys to search for.
   * @returns {*} The value of the key.
   */


  function unwrap(object, keys) {
    // eslint-disable-line no-unused-vars
    var result = objectTraverse.apply(this, arguments); // eslint-disable-next-line gxrules/no-typeof

    return typeof result === 'function' ? result.call(objectTraverse.prevobject) : result;
  }

  function registerInheritance(parent, sub) {
    parent._registerInheritance(sub);

    parent._subclasses.push(sub);
  }

  var SUPERCLASS =
  /*#__PURE__*/
  function () {
    function SUPERCLASS() {
      _classCallCheck(this, SUPERCLASS);

      this.constructor._registerInheritance();
    }

    _createClass(SUPERCLASS, null, [{
      key: "_registerInheritance",
      value: function _registerInheritance(subclass) {
        if (this !== SUPERCLASS) {
          var parentclass = Object.getPrototypeOf(this);

          if (!parentclass.hasOwnProperty('_subclasses')) {
            parentclass._subclasses = [];
          }

          if (this._parentclass !== parentclass) {
            registerInheritance(parentclass, this);
            this._parentclass = parentclass;
          }

          if (subclass) {
            registerInheritance(parentclass, subclass);
          }
        }

        return this;
      }
    }]);

    return SUPERCLASS;
  }();

  ;

  var ScreenManager =
  /*#__PURE__*/
  function () {
    function ScreenManager() {
      _classCallCheck(this, ScreenManager);

      this.screens = ko.observableArray();
    }

    _createClass(ScreenManager, [{
      key: "open",
      value: function open(screen) {
        if (this.screens().find(function (s) {
          return s.screen === screen;
        })) {
          alert("Screen already open.");
        }

        var $screen = $('<div><div></div></div>');

        var onopen = function onopen() {
          var $parent = $screen.parent();
          $parent.removeClass('ui-widget ui-widget-content');
          $parent.css('background', '#eee');
          $parent.css('width', screen.settings().fullscreen() ? '100vw' : '50vw');
          $parent.css('height', screen.settings().fullscreen() ? '100vh' : '70vh');
          $parent.css('max-height', screen.settings().fullscreen() ? '' : '90vh');
          $parent.css('top', screen.settings().fullscreen() ? '0' : '5%');
          $screen.css('padding', '0');
          $screen.children().height('auto');
          $screen.css('display', '');

          if (screen.settings().fullscreen()) {
            $('.ui-dialog-titlebar').remove();
          } else {
            $parent.css('min-height', '20vh');
          }
        };

        var options = {
          title: screen.constructor.name,
          width: screen.settings().fullscreen() ? '100vw' : '50vw',
          modal: true,
          open: onopen,
          closeOnEscape: false,
          resizable: false,
          dialogClass: screen.settings().fullscreen() ? 'fullscreen' : ''
        };
        $screen.dialog(options);

        var close = function close() {
          return $screen.dialog('destroy');
        };

        ko.applyBindingsToNode($screen.children()[0], {
          screen: screen
        });
        this.screens.push({
          screen: screen,
          close: close
        });
        return this;
      }
    }, {
      key: "close",
      value: function close(screen) {
        var s = this.screens().find(function (s) {
          return s.screen === screen;
        });

        if (!s) {
          alert('Screen is not open. This is obviously an error.');
        }

        this.screens.remove(s);
        s.close();
        return this;
      }
    }]);

    return ScreenManager;
  }();

  var screen_manager = new ScreenManager();

  var Screen =
  /*#__PURE__*/
  function (_SUPERCLASS) {
    _inherits(Screen, _SUPERCLASS);

    function Screen(settings) {
      var _this;

      _classCallCheck(this, Screen);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Screen).call(this));
      _this.settings = ko.observable(ko.mapping.fromJS(_this.defaultSettings(settings)));
      return _this;
    }

    _createClass(Screen, [{
      key: "open",
      value: function open() {
        screen_manager.open(this);
      }
    }, {
      key: "close",
      value: function close() {
        screen_manager.close(this);
      }
    }, {
      key: "defaultSettings",
      value: function defaultSettings() {
        var _$;

        for (var _len = arguments.length, settings = new Array(_len), _key = 0; _key < _len; _key++) {
          settings[_key] = arguments[_key];
        }

        settings = (_$ = $).extend.apply(_$, [true, {}].concat(_toConsumableArray(settings)));
        return $.extend(true, {
          height: 'auto',
          width: '100%',
          max_height: '',
          fullscreen: true
        }, settings);
      }
    }]);

    return Screen;
  }(SUPERCLASS);

  _exports.Screen = Screen;
  ;
  var screencontext = Symbol('screencontext');

  function screencontexts(context) {
    if (context) {
      var ppctx = unwrap(context.$parentContext, '$parentContext');

      if (ppctx && !defined(ppctx.$parentContext)) {
        return [context].concat(context.$parentContext[screencontext]);
      } else {
        return screencontexts(context.$parentContext);
      }
    }

    return [];
  }

  var contextdataname = '_gx_screen_context';
  ko.bindingHandlers.screen = {
    init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var screen = ko.unwrap(valueAccessor());
      $(element).addClass("screen " + screen.constructor.name);
      console.log(screen.constructor.name + ' opened.'); // Since the template binding cannot bind with an html string directly, we need to first create a template for
      // it to bind with. The template must also be cleaned up when the screen closes.
      // $('head').append($('<script type="text/html">' + screen.html() + '</script>').attr('id', 'lllscreen'));

      var template = 'template_' + screen.constructor.name; // let screenctx = screencontexts(bindingContext);
      // Remove all parent contexts except the root context. This is primarily to prevent subscreens from accessing
      // their containing screens, because screens should be completely self-contained. If a subscreen is required to
      // react to something on the parent screen, give it an observable in the settings.

      while (bindingContext.$parentContext) {
        bindingContext = bindingContext.$parentContext; // Will eventually reset to $root.
      }

      var childBindingContext = bindingContext.createChildContext(bindingContext.$rawData, null, function (context) {
        return Object.assign(context, {
          $data: screen,
          $screen: screen
        });
      });
      var bindings = {
        template: {
          name: template,
          data: ko.unwrap(screen),
          as: '$screen'
        }
      }; // Two levels are added to the binding context: the screen, and then the model.

      ko.applyBindingsToNode(element, bindings);
      return {
        controlsDescendantBindings: true
      };
    }
  };
  ko.bindingHandlers.screencontext = {
    init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var value = ko.unwrap(valueAccessor());
      var context = screencontexts(bindingContext).find(function (ctx) {
        return ctx.$parentContext.$data instanceof KScreen && ctx.$parentContext.$data.constructor.name === value;
      });

      if (!context) {
        throw Error('Cannot find requested screencontext: ' + value);
      }

      ko.applyBindingsToDescendants(context, element);
      return {
        controlsDescendantBindings: true
      };
    },
    preprocess: function preprocess(val) {
      val = val.trim();
      return val.length > 2 && val[0] === '{' && val[val.length - 1] === '}' ? val.substr(1, val.length - 2) : JSON.stringify(val);
    }
  };
  ko.virtualElements.allowedBindings.screencontext = true;
});
//# sourceMappingURL=spa.js.map
