// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-cycle v1.0.2 available at github.com/author-elements/cycle
// Last Build: 3/10/2019, 2:11:55 AM
var AuthorCycleElement = (function () {
  'use strict';

  if (!window.hasOwnProperty('AuthorBaseElement')) {
              console.error('[ERROR] <author-cycle> Required dependency "AuthorBaseElement" not found.');
              console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
            }
          var AuthorCycleElement = /*@__PURE__*/(function (superclass) {
              function AuthorCycleElement () {
      var this$1 = this;

      superclass.call(this, "<template><style>@charset \"UTF-8\"; :host{display:block}:host *,:host :after,:host :before{box-sizing:border-box}:host(:not([mode=custom]))>::slotted(:not([selected])){display:none!important}author-cycle{display:block}author-cycle *,author-cycle :after,author-cycle :before{box-sizing:border-box}author-cycle:not([mode=custom])>:not([selected]){display:none!important}</style><slot></slot></template>");

      this.UTIL.defineProperties({
        dummyEl: {
          private: true,
          readonly: true,
          default: document.createElement('div')
        },

        /**
         * @typedef {Object} SelectedElementProperties
         * @property {HTMLElement} element The currently selected page.
         * @property {Number} index The zero-based index of the currently selected page.
         */

        /**
         * @property selected
         * Get information about the currently selected element.
         * @return {SelectedElementProperties}
         */
        selected: {
          readonly: true,
          get: function () { return ({
            element: this$1.selectedElement,
            index: this$1.selectedIndex
          }); }
        },

        /**
         * @property selectedElement
         * The currently selected element.
         * @return {HTMLElement}
         */
        selectedElement: {
          readonly: true,
          get: function () { return this$1.selectedIndex === null ? null : this$1.children.item(this$1.selectedIndex); }
        },

        /**
         * @property selectedIndex
         * The zero-based index of the currently selected element.
         * @return {Number}
         */
        selectedIndex: {
          readonly: true,
          get: function () {
            for (var index in this$1.children) {
              if (!this$1.children.hasOwnProperty(index)) {
                continue
              }

              var child = this$1.children.item(index);

              if (typeof child !== 'object') {
                continue
              }

              if (child.hasAttribute('selected')) {
                return parseInt(index)
              }
            }

            return null
          }
        }
      });

      this.UTIL.definePrivateMethods({
        getChildIndex: function (child) { return [].concat( this$1.children ).indexOf(child); },

        getNextSelectedChild: function (child) {
          var nextIndex = this$1.PRIVATE.getChildIndex(child);

          return {
            element: child,
            index: nextIndex
          }
        },

        hideChild: function (child) { return child.removeAttribute('selected', ''); },

        handleChange: function (child, previousSelection) {
          if (this$1.selectedIndex >= 0) {
            this$1.PRIVATE.hideChild(this$1.children.item(this$1.selectedIndex || 0));
          }

          child.setAttribute('selected', '');

          this$1.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            cancelable: true,
            composed: true,

            detail: {
              previousSelection: previousSelection,
              currentSelection: this$1.selected
            }
          }));
        },

        showChild: function (child) {
          var ref = this$1.PRIVATE;
          var handleChange = ref.handleChange;
          var getNextSelectedChild = ref.getNextSelectedChild;
          var hideChild = ref.hideChild;

          var previousSelection = this$1.selected;
          var nextSelection = getNextSelectedChild(child);

          var beforechange = {
            event: new CustomEvent('beforechange', {
              bubbles: true,
              cancelable: true,
              composed: true,

              detail: {
                currentSelection: this$1.selected,
                nextSelection: nextSelection
              }
            }),

            handler: function (evt) {
              this$1.off('beforechange', beforechange.handler);

              if (evt.defaultPrevented) {
                return
              }

              handleChange(child, previousSelection);
            }
          };

          this$1.on('beforechange', beforechange.handler);

          beforechange.event.detail.next = (function () {
            if (!this.defaultPrevented) {
              return this.UTIL.printToConsole("Calling \"next()\" in \"beforechange\" event handler will have no effect unless the event's default behavior is canceled. (use Event.preventDefault())", 'warning')
            }

            handleChange(child, previousSelection);
          }).bind(beforechange.event);

          this$1.dispatchEvent(beforechange.event);
        },

        showChildByIndex: function (index) {
          if (this$1.selectedIndex === index || index >= this$1.children.length || index < 0) {
            return
          }

          this$1.PRIVATE.showChild(this$1.children.item(index));
        },

        showChildBySelector: function (query) {
          var nodes = this$1.querySelectorAll(query);

          if (!nodes.length) {
            return this$1.UTIL.printToConsole(("Node matching query \"" + query + "\" not found. Aborting..."), 'warning')
          }

          if (nodes.length > 1) {
            this$1.UTIL.printToConsole(("Found multiple nodes matching \"" + query + "\". Displaying first result..."), 'warning');
          }

          this$1.PRIVATE.showChild(nodes.item(0));
        }
      });

      this.UTIL.registerListeners(this, {
        connected: function () {
          this$1.UTIL.monitorChildren(function (mutations) {
            mutations.forEach(function (mutation) {
              var addedNodes = mutation.addedNodes;
              var removedNodes = mutation.removedNodes;
              var type = mutation.type;

              switch (type) {
                case 'childList':
                  if (removedNodes.length > 0 && !this$1.selectedElement) {
                    return this$1.previous()
                  }

                  break
              }
            });
          });
        },

        rendered: function () {
          for (var index in this$1.children) {
            if (!this$1.children.hasOwnProperty(index)) {
              continue
            }

            var child = this$1.children.item(index);

            if (typeof child !== 'object') {
              continue
            }

            if (child !== this$1.selectedElement) {
              this$1.PRIVATE.hideChild(child);
            }
          }
        }
      });
    }

              if ( superclass ) AuthorCycleElement.__proto__ = superclass;
              AuthorCycleElement.prototype = Object.create( superclass && superclass.prototype );
              AuthorCycleElement.prototype.constructor = AuthorCycleElement;

              var staticAccessors = { observedAttributes: { configurable: true } };

    staticAccessors.observedAttributes.get = function () {
      return ['mode']
    };

    /**
     * @method hideAll
     * Deactivate all pages.
     */
    AuthorCycleElement.prototype.hideAll = function hideAll () {
      for (var index in this.children) {
        if (!this.children.hasOwnProperty(index)) {
          continue
        }

        var child = this.children.item(index);

        if (typeof child !== 'object') {
          continue
        }

        this.PRIVATE.hideChild(child);
      }
    };

    AuthorCycleElement.prototype.indexOf = function indexOf (child) {
      return this.PRIVATE.getChildIndex(child)
    };

    /**
     * @method insertAdjacentHTML
     * Override this.prototype.insertAdjacentHTML and replace with
     * appendChild() or insertBefore()
     * This is done because of bugs with insertAdjacentHTML() on web components
     * in Firefox and IE11.
     * @override
     */
    AuthorCycleElement.prototype.insertAdjacentHTML = function insertAdjacentHTML (position, text) {
      switch (position) {
        case 'beforebegin':
        case 'afterend':
          return HTMLElement.prototype.insertAdjacentHTML.call(this, position, text)

        default:
          var ref = this.PRIVATE;
      var dummyEl = ref.dummyEl;

          dummyEl.insertAdjacentHTML(position, text);
          var node = dummyEl.children.item(0);

          while (dummyEl.firstChild) {
            dummyEl.removeChild(dummyEl.firstChild);
          }

          return position === 'beforeend' ? this.appendChild(node) : this.insertBefore(node, this.firstElementChild)
      }
    };

    /**
     * @method insertAdjacentElement
     * Override this.prototype.insertAdjacentElement and replace with
     * appendChild() or insertBefore()
     * This is done because of bugs with insertAdjacentElement() on web components
     * in Firefox and IE11.
     * @param {string} position (beforebegin, afterbegin, beforeend, afterend)
     * @param {HTMLElement} node
     * Node to which to insert adjacent HTML
     * @override
     */
    AuthorCycleElement.prototype.insertAdjacentElement = function insertAdjacentElement (position, node) {
      switch (position) {
        case 'beforeend': return this.appendChild(node)
        case 'afterbegin': return this.insertBefore(node, this.firstElementChild)
        default: return HTMLElement.prototype.insertAdjacentElement.call(this, position, node)
      }
    };

    /**
     * @method first
     * A helper method to display the first child element.
     */
    AuthorCycleElement.prototype.first = function first () {
      this.show(0);
    };

    /**
     * @method last
     * A helper method to display the last child element.
     */
    AuthorCycleElement.prototype.last = function last () {
      this.show(this.children.length - 1);
    };

    /**
     * @method next
     * Deactivate the currently selected child element and activate the one
     * immediately adjacent to it.
     * @param {function} callback
     * Executed when the operation is complete.
     */
    AuthorCycleElement.prototype.next = function next (callback) {
      this.show(this.selectedIndex === this.children.length - 1 ? 0 : this.selectedIndex + 1);
      callback && callback(this.selectedElement);
    };

    /**
     * @method previous
     * Deactivate the currently selected child element and activate the one
     * immediately preceding it.
     * @param {function} callback
     * Executed when the operation is complete.
     */
    AuthorCycleElement.prototype.previous = function previous (callback) {
      this.show(this.selectedIndex === 0 ? this.children.length - 1 : this.selectedIndex - 1);
      callback && callback(this.selectedElement);
    };

    /**
     * @method show
     * Deselect the currently selected element and select a different one.
     * @param {number | string | HTMLElement} query
     * 1-based index,
     * Element selector string, or
     * HTMLElement to select
     */
    AuthorCycleElement.prototype.show = function show (query) {
      if (query === null) {
        if (!this.selectedIndex) {
          this.PRIVATE.showChildByIndex(0);
        }

        return
      }

      switch ((typeof query).toLowerCase()) {
        case 'number': return this.PRIVATE.showChildByIndex(query)

        case 'string':
          var int = parseInt(query);

          return isNaN(int)
            ? this.PRIVATE.showChildBySelector(query)
            : this.PRIVATE.showChildByIndex(int)

        default: return query instanceof HTMLElement
          ? this.PRIVATE.showChild(query)
          : this.UTIL.throwError({
            type: 'reference',
            message: ("Invalid query \"" + query + "\"")
          })
      }
    };

              Object.defineProperties( AuthorCycleElement, staticAccessors );

              return AuthorCycleElement;
            }(AuthorBaseElement(HTMLElement)));

  customElements.define('author-cycle', AuthorCycleElement);

  return AuthorCycleElement;

}());
//# sourceMappingURL=author-cycle.es5.js.map
