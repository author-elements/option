// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-cycle v1.0.2 available at github.com/author-elements/cycle
// Last Build: 3/10/2019, 2:11:55 AM
var AuthorCycleElement = (function () {
  'use strict';

  if (!window.hasOwnProperty('AuthorBaseElement')) {
              console.error('[ERROR] <author-cycle> Required dependency "AuthorBaseElement" not found.');
              console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
            }
          class AuthorCycleElement extends AuthorBaseElement(HTMLElement) {
    constructor () {
      super(`<template><style>@charset "UTF-8"; :host{display:block}:host *,:host :after,:host :before{box-sizing:border-box}:host(:not([mode=custom]))>::slotted(:not([selected])){display:none!important}author-cycle{display:block}author-cycle *,author-cycle :after,author-cycle :before{box-sizing:border-box}author-cycle:not([mode=custom])>:not([selected]){display:none!important}</style><slot></slot></template>`);

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
          get: () => ({
            element: this.selectedElement,
            index: this.selectedIndex
          })
        },

        /**
         * @property selectedElement
         * The currently selected element.
         * @return {HTMLElement}
         */
        selectedElement: {
          readonly: true,
          get: () => this.selectedIndex === null ? null : this.children.item(this.selectedIndex)
        },

        /**
         * @property selectedIndex
         * The zero-based index of the currently selected element.
         * @return {Number}
         */
        selectedIndex: {
          readonly: true,
          get: () => {
            for (let index in this.children) {
              if (!this.children.hasOwnProperty(index)) {
                continue
              }

              let child = this.children.item(index);

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
        getChildIndex: child => [...this.children].indexOf(child),

        getNextSelectedChild: child => {
          let nextIndex = this.PRIVATE.getChildIndex(child);

          return {
            element: child,
            index: nextIndex
          }
        },

        hideChild: child => child.removeAttribute('selected', ''),

        handleChange: (child, previousSelection) => {
          if (this.selectedIndex >= 0) {
            this.PRIVATE.hideChild(this.children.item(this.selectedIndex || 0));
          }

          child.setAttribute('selected', '');

          this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            cancelable: true,
            composed: true,

            detail: {
              previousSelection,
              currentSelection: this.selected
            }
          }));
        },

        showChild: child => {
          let {
            handleChange,
            getNextSelectedChild,
            hideChild
          } = this.PRIVATE;

          let previousSelection = this.selected;
          let nextSelection = getNextSelectedChild(child);

          let beforechange = {
            event: new CustomEvent('beforechange', {
              bubbles: true,
              cancelable: true,
              composed: true,

              detail: {
                currentSelection: this.selected,
                nextSelection
              }
            }),

            handler: evt => {
              this.off('beforechange', beforechange.handler);

              if (evt.defaultPrevented) {
                return
              }

              handleChange(child, previousSelection);
            }
          };

          this.on('beforechange', beforechange.handler);

          beforechange.event.detail.next = (function () {
            if (!this.defaultPrevented) {
              return this.UTIL.printToConsole(`Calling "next()" in "beforechange" event handler will have no effect unless the event's default behavior is canceled. (use Event.preventDefault())`, 'warning')
            }

            handleChange(child, previousSelection);
          }).bind(beforechange.event);

          this.dispatchEvent(beforechange.event);
        },

        showChildByIndex: index => {
          if (this.selectedIndex === index || index >= this.children.length || index < 0) {
            return
          }

          this.PRIVATE.showChild(this.children.item(index));
        },

        showChildBySelector: query => {
          let nodes = this.querySelectorAll(query);

          if (!nodes.length) {
            return this.UTIL.printToConsole(`Node matching query "${query}" not found. Aborting...`, 'warning')
          }

          if (nodes.length > 1) {
            this.UTIL.printToConsole(`Found multiple nodes matching "${query}". Displaying first result...`, 'warning');
          }

          this.PRIVATE.showChild(nodes.item(0));
        }
      });

      this.UTIL.registerListeners(this, {
        connected: () => {
          this.UTIL.monitorChildren(mutations => {
            mutations.forEach(mutation => {
              let { addedNodes, removedNodes, type } = mutation;

              switch (type) {
                case 'childList':
                  if (removedNodes.length > 0 && !this.selectedElement) {
                    return this.previous()
                  }

                  break
              }
            });
          });
        },

        rendered: () => {
          for (let index in this.children) {
            if (!this.children.hasOwnProperty(index)) {
              continue
            }

            let child = this.children.item(index);

            if (typeof child !== 'object') {
              continue
            }

            if (child !== this.selectedElement) {
              this.PRIVATE.hideChild(child);
            }
          }
        }
      });
    }

    static get observedAttributes () {
      return ['mode']
    }

    /**
     * @method hideAll
     * Deactivate all pages.
     */
    hideAll () {
      for (let index in this.children) {
        if (!this.children.hasOwnProperty(index)) {
          continue
        }

        let child = this.children.item(index);

        if (typeof child !== 'object') {
          continue
        }

        this.PRIVATE.hideChild(child);
      }
    }

    indexOf (child) {
      return this.PRIVATE.getChildIndex(child)
    }

    /**
     * @method insertAdjacentHTML
     * Override this.prototype.insertAdjacentHTML and replace with
     * appendChild() or insertBefore()
     * This is done because of bugs with insertAdjacentHTML() on web components
     * in Firefox and IE11.
     * @override
     */
    insertAdjacentHTML (position, text) {
      switch (position) {
        case 'beforebegin':
        case 'afterend':
          return HTMLElement.prototype.insertAdjacentHTML.call(this, position, text)

        default:
          let { dummyEl } = this.PRIVATE;

          dummyEl.insertAdjacentHTML(position, text);
          let node = dummyEl.children.item(0);

          while (dummyEl.firstChild) {
            dummyEl.removeChild(dummyEl.firstChild);
          }

          return position === 'beforeend' ? this.appendChild(node) : this.insertBefore(node, this.firstElementChild)
      }
    }

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
    insertAdjacentElement (position, node) {
      switch (position) {
        case 'beforeend': return this.appendChild(node)
        case 'afterbegin': return this.insertBefore(node, this.firstElementChild)
        default: return HTMLElement.prototype.insertAdjacentElement.call(this, position, node)
      }
    }

    /**
     * @method first
     * A helper method to display the first child element.
     */
    first () {
      this.show(0);
    }

    /**
     * @method last
     * A helper method to display the last child element.
     */
    last () {
      this.show(this.children.length - 1);
    }

    /**
     * @method next
     * Deactivate the currently selected child element and activate the one
     * immediately adjacent to it.
     * @param {function} callback
     * Executed when the operation is complete.
     */
    next (callback) {
      this.show(this.selectedIndex === this.children.length - 1 ? 0 : this.selectedIndex + 1);
      callback && callback(this.selectedElement);
    }

    /**
     * @method previous
     * Deactivate the currently selected child element and activate the one
     * immediately preceding it.
     * @param {function} callback
     * Executed when the operation is complete.
     */
    previous (callback) {
      this.show(this.selectedIndex === 0 ? this.children.length - 1 : this.selectedIndex - 1);
      callback && callback(this.selectedElement);
    }

    /**
     * @method show
     * Deselect the currently selected element and select a different one.
     * @param {number | string | HTMLElement} query
     * 1-based index,
     * Element selector string, or
     * HTMLElement to select
     */
    show (query) {
      if (query === null) {
        if (!this.selectedIndex) {
          this.PRIVATE.showChildByIndex(0);
        }

        return
      }

      switch ((typeof query).toLowerCase()) {
        case 'number': return this.PRIVATE.showChildByIndex(query)

        case 'string':
          let int = parseInt(query);

          return isNaN(int)
            ? this.PRIVATE.showChildBySelector(query)
            : this.PRIVATE.showChildByIndex(int)

        default: return query instanceof HTMLElement
          ? this.PRIVATE.showChild(query)
          : this.UTIL.throwError({
            type: 'reference',
            message: `Invalid query "${query}"`
          })
      }
    }
  }

  customElements.define('author-cycle', AuthorCycleElement);

  return AuthorCycleElement;

}());
//# sourceMappingURL=author-cycle.js.map
