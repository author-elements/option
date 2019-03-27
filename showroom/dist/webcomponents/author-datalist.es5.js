// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-datalist v1.0.0 available at github.com/author-elements/datalist
// Last Build: 3/25/2019, 10:12:27 PM
(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  if (!window.hasOwnProperty('AuthorBaseElement')) {
    console.error('[ERROR] <chassis-datalist> Required dependency "AuthorBaseElement" not found.');
    console.info('AuthorBaseElement is available at https://github.com/author-elements/datalist');
  }

  (function () {
    var missingDependencies = Array.from(new Set(['author-selected-options', 'author-options', 'author-option'])).filter(function (dep) {
      return !customElements.get(dep);
    });

    if (missingDependencies.length > 0) {
      console.error("[ERROR] <chassis-datalist> Required dependenc".concat(missingDependencies.length !== 1 ? 'ies' : 'y', " not found: ").concat(missingDependencies.map(function (d) {
        return "<".concat(d, ">");
      }).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])));
      missingDependencies.forEach(function (dep, i) {
        return console.info("".concat(i + 1, ". <").concat(dep, "> is available at ").concat('https://github.com/author-elements/datalist'.replace('chassis-datalist', dep.replace('author-', ''))));
      });
    }
  })();

  var AuthorDatalistElement =
  /*#__PURE__*/
  function (_AuthorElement) {
    _inherits(AuthorDatalistElement, _AuthorElement);

    function AuthorDatalistElement() {
      var _this;

      _classCallCheck(this, AuthorDatalistElement);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AuthorDatalistElement).call(this, "<template><style>@charset \"UTF-8\"; :host{display:inline-flex;max-width:100%}:host *,:host :after,:host :before{box-sizing:border-box}:host ::slotted(author-options){height:0;overflow:hidden}:host([open]) ::slotted(author-options){height:auto}chassis-datalist{display:inline-flex;max-width:100%}chassis-datalist *,chassis-datalist :after,chassis-datalist :before{box-sizing:border-box}chassis-datalist author-options{height:0;overflow:hidden}chassis-datalist[open] author-options{height:auto}</style><slot name=\"afterbegin\"></slot><slot name=\"beforeinput\"></slot><slot name=\"input\"></slot><slot name=\"afterinput\"></slot><slot name=\"beforeselectedoptions\"></slot><slot name=\"selectedoptions\"></slot><slot name=\"afterselectedoptions\"></slot><slot name=\"beforeoptions\"></slot><slot name=\"options\"></slot><slot name=\"afteroptions\"></slot><slot name=\"beforeend\"></slot></template>"));
      _this.clickCount = 0;

      _this.PRIVATE.addReadOnlyProperty('options');

      _this.PRIVATE.options = [];

      _this.PRIVATE.find = function (query) {
        return _this.PRIVATE.options.filter(function (option) {
          var value = _this.hasAttribute('case-sensitive') ? option.sourceElement.value : option.sourceElement.value.toLowerCase();
          var text = _this.hasAttribute('case-sensitive') ? option.sourceElement.text : option.sourceElement.text.toLowerCase();
          query = _this.hasAttribute('case-sensitive') ? query : query.toLowerCase();
          return value.indexOf(query) >= 0 || text.indexOf(query) >= 0;
        });
      };

      _this.PRIVATE.clear = function () {
        _this.PRIVATE.options.forEach(function (option) {
          return option.displayElement.style.display = 'none';
        });
      };

      _this.PRIVATE.showAllOptions = function () {
        _this.PRIVATE.options.forEach(function (option) {
          return option.displayElement.style.display = '';
        });
      };

      _this.PRIVATE.clickHandler = function (evt) {
        _this.clickCount++;

        if (_this.clickCount === 2) {
          _this.PRIVATE.showAllOptions();

          _this.open();
        }
      };

      _this.PRIVATE.keydownHandler = function (evt) {
        if (!_this.isOpen) {
          _this.PRIVATE.showAllOptions();

          return _this.open();
        }

        switch (evt[_this.keySource]) {
          case 27:
          case 'Escape':
            _this.PRIVATE.clear();

            _this.close();

            break;

          case 38:
          case 'ArrowUp':
            evt.preventDefault();
            console.log('select previous option');
            break;

          case 40:
          case 'ArrowDown':
            evt.preventDefault();
            console.log('select next option');
            break;

          default:
            return;
        }
      };

      _this.PRIVATE.inputHandler = function (evt) {
        _this.PRIVATE.clear();

        var query = _this.PRIVATE.inputEl.value;

        if (!query) {
          return;
        }

        var results = _this.PRIVATE.find(query);

        if (results.length) {
          results.forEach(function (result) {
            return result.displayElement.style.display = '';
          });

          _this.setAttribute('open', '');

          return;
        }

        if (_this.hasAttribute('open')) {
          _this.removeAttribute('open');
        }

        _this.PRIVATE.clear();
      };

      _this.PRIVATE.bodyClickHandler = function (evt) {
        if (evt.target === _assertThisInitialized(_this) || _this.contains(evt.target)) {
          return;
        }

        _this.removeAttribute('open');
      };

      _this.PRIVATE.getOptionById = function (id) {
        var options = _this.PRIVATE.options;
        var option;

        for (var i = 0; i < options.length; i++) {
          if (options[i].id === id) {
            option = options[i];
            break;
          }
        }

        return option;
      };

      _this.PRIVATE.generateOptionObject = function (optionEl) {
        if (!customElements.get('chassis-option')) {
          console.error("chassis-datalist requires chassis-option. Please include it in this document's <head> element.");
          return;
        }

        var obj = {
          id: _this.PRIVATE.generateGuid('option'),
          attributes: {},
          sourceElement: optionEl
        };
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = optionEl.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var attr = _step.value;
            obj.attributes[attr.name] = attr.value;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return obj;
      };

      return _this;
    }

    _createClass(AuthorDatalistElement, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        this.PRIVATE.inputEl.addEventListener('focus', function (evt) {
          _this2.addEventListener('keydown', _this2.PRIVATE.keydownHandler);
        });
        this.PRIVATE.inputEl.addEventListener('input', this.PRIVATE.inputHandler);
        this.PRIVATE.inputEl.addEventListener('click', this.PRIVATE.clickHandler);
        this.PRIVATE.inputEl.addEventListener('blur', function (evt) {
          _this2.clickCount = 0;

          _this2.removeEventListener('keydown', _this2.PRIVATE.keydownHandler);
        });
        setTimeout(function () {
          if (!_this2.hasAttribute('tabindex')) {
            _this2.setAttribute('tabindex', 0);
          }

          if (_this2.autofocus) {
            _this2.focus();
          }
        }, 0);
      }
    }, {
      key: "addChildren",
      value: function addChildren(children) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var child = _step2.value;
            this.addOption(child instanceof HTMLElement ? this.PRIVATE.generateOptionObject(child) : child);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }, {
      key: "addOption",
      value: function addOption(option, index) {
        var _this3 = this;

        var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.PRIVATE.optionsEl;

        if (!customElements.get('chassis-option')) {
          console.error("chassis-datalist requires chassis-option. Please include it in this document's <head> element.");
          return;
        }

        if (!option.hasOwnProperty('id')) {
          option.id = this.PRIVATE.generateGuid('option');
        }

        if (!option.hasOwnProperty('sourceElement') || !(option.sourceElement instanceof HTMLElement)) {
          var sourceEl = document.createElement('option');

          if (option.hasOwnProperty('innerHTML')) {
            sourceEl.innerHTML = option.innerHTML;
          }

          if (option.hasOwnProperty('label')) {
            sourceEl.innerHTML = option.label;
          }

          if (option.hasOwnProperty('value')) {
            sourceEl.value = option.value;
          }

          if (option.hasOwnProperty('disabled')) {
            sourceEl.disabled = typeof option.disabled === 'boolean' && option.disabled;
          }

          option.sourceElement = sourceEl;
        }

        var label = option.sourceElement.getAttribute('label') || option.sourceElement.textContent.trim();
        var value = option.sourceElement.getAttribute('value');
        var disabled = option.sourceElement.disabled;
        var chassisOption = document.createElement('chassis-option');
        chassisOption.style.display = 'none';
        chassisOption.key = option.id;
        chassisOption.innerHTML = option.sourceElement.innerHTML;
        dest.appendChild(chassisOption);
        chassisOption.addEventListener('click', function (evt) {
          return _this3.select(chassisOption.key);
        });
        option = {
          attributes: {
            disabled: disabled,
            label: label,
            value: value
          },
          id: option.id,
          displayElement: chassisOption,
          sourceElement: option.sourceElement
        };

        if (index) {
          this["".concat(index)] = option.sourceElement;
          this.PRIVATE.options.splice(index, 0, option);
          return;
        }

        this["".concat(this.PRIVATE.options.length)] = option.sourceElement;
        this.PRIVATE.options.push(option);
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(attr, oldValue, newValue) {
        attr = attr.toLowerCase();

        if (newValue === oldValue) {
          return;
        }

        switch (attr) {
          case 'autofocus':
          case 'disabled':
            console.log(attr); // this.PRIVATE.setBooleanAttributeValue(attr, newValue)

            break;

          case 'name':
            console.log(attr); // this.PRIVATE.setAttributeValue(attr, newValue)

            break;

          case 'open':
            this.isOpen ? this.open() : this.close();
            break;
        }
      }
    }, {
      key: "close",
      value: function close() {
        document.body.removeEventListener('click', this.PRIVATE.bodyClickHandler);
        document.body.removeEventListener('touchcancel', this.PRIVATE.bodyClickHandler);
        document.body.removeEventListener('touchend', this.PRIVATE.bodyClickHandler);

        if (this.isOpen) {
          this.isOpen = false;
        }
      }
    }, {
      key: "open",
      value: function open() {
        document.body.addEventListener('click', this.PRIVATE.bodyClickHandler);
        document.body.addEventListener('touchcancel', this.PRIVATE.bodyClickHandler);
        document.body.addEventListener('touchend', this.PRIVATE.bodyClickHandler);

        if (!this.isOpen) {
          this.isOpen = true;
        }
      }
    }, {
      key: "inject",
      value: function inject(input, datalist, guid) {
        this.PRIVATE.sourceEl = datalist;
        this.PRIVATE.inputEl = input;
        this.PRIVATE.inputEl.slot = 'input';
        this.PRIVATE.inputEl.id = guid;
        this.appendChild(this.PRIVATE.inputEl);
        this.PRIVATE.optionsEl = document.createElement('chassis-options');
        this.PRIVATE.optionsEl.slot = 'options';
        this.appendChild(this.PRIVATE.optionsEl);
        this.addChildren(datalist.options);
      }
    }, {
      key: "select",
      value: function select(id) {
        var option = this.PRIVATE.getOptionById(id);

        if (option) {
          option.sourceElement.selected = true;
          this.PRIVATE.inputEl.value = option.displayElement.innerHTML;
          this.PRIVATE.selectedOption = option;
          this.PRIVATE.options.forEach(function (option) {
            return option.displayElement.removeAttribute('selected');
          });
          option.displayElement.setAttribute('selected', '');
          this.dispatchEvent(new Event('input', {
            bubbles: true
          }));
          this.close();
        }
      }
    }, {
      key: "isOpen",
      get: function get() {
        return this.hasAttribute('open');
      },
      set: function set(bool) {
        bool ? this.setAttribute('open', '') : this.removeAttribute('open');
      }
    }, {
      key: "value",
      get: function get() {
        return this.PRIVATE.inputEl.value;
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['autofocus', 'case-sensitive', 'disabled', 'name', 'open', 'tabindex'];
      }
    }]);

    return AuthorDatalistElement;
  }(AuthorElement(HTMLElement));

  customElements.define('chassis-datalist', AuthorDatalistElement);

}());
//# sourceMappingURL=author-datalist.es5.js.map
