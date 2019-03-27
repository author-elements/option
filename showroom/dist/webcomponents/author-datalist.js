// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-datalist v1.0.0 available at github.com/author-elements/datalist
// Last Build: 3/25/2019, 10:12:27 PM
(function () {
  'use strict';

  if (!window.hasOwnProperty('AuthorBaseElement')) {
              console.error('[ERROR] <chassis-datalist> Required dependency "AuthorBaseElement" not found.');
              console.info('AuthorBaseElement is available at https://github.com/author-elements/datalist');
            }
          (function () {
            let missingDependencies = Array.from(new Set(['author-selected-options','author-options','author-option'])).filter(dep => !customElements.get(dep));
            if (missingDependencies.length > 0) {
              console.error(`[ERROR] <chassis-datalist> Required dependenc${missingDependencies.length !== 1 ? 'ies' : 'y'} not found: ${missingDependencies.map(d => `<${d}>`).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])}`);
              missingDependencies.forEach((dep, i) => console.info(`${i+1}. <${dep}> is available at ${'https://github.com/author-elements/datalist'.replace('chassis-datalist', dep.replace('author-', ''))}`));
            }
          })();
          class AuthorDatalistElement extends AuthorElement(HTMLElement) {
    constructor () {
      super(`<template><style>@charset "UTF-8"; :host{display:inline-flex;max-width:100%}:host *,:host :after,:host :before{box-sizing:border-box}:host ::slotted(author-options){height:0;overflow:hidden}:host([open]) ::slotted(author-options){height:auto}chassis-datalist{display:inline-flex;max-width:100%}chassis-datalist *,chassis-datalist :after,chassis-datalist :before{box-sizing:border-box}chassis-datalist author-options{height:0;overflow:hidden}chassis-datalist[open] author-options{height:auto}</style><slot name="afterbegin"></slot><slot name="beforeinput"></slot><slot name="input"></slot><slot name="afterinput"></slot><slot name="beforeselectedoptions"></slot><slot name="selectedoptions"></slot><slot name="afterselectedoptions"></slot><slot name="beforeoptions"></slot><slot name="options"></slot><slot name="afteroptions"></slot><slot name="beforeend"></slot></template>`);

      this.clickCount = 0;

      this.PRIVATE.addReadOnlyProperty('options');

      this.PRIVATE.options = [];

      this.PRIVATE.find = query => {
        return this.PRIVATE.options.filter(option => {
          let value = this.hasAttribute('case-sensitive') ? option.sourceElement.value : option.sourceElement.value.toLowerCase();
          let text = this.hasAttribute('case-sensitive') ? option.sourceElement.text : option.sourceElement.text.toLowerCase();
          query = this.hasAttribute('case-sensitive') ? query : query.toLowerCase();

          return value.indexOf(query) >= 0 || text.indexOf(query) >= 0
        })
      };

      this.PRIVATE.clear = () => {
        this.PRIVATE.options.forEach(option => option.displayElement.style.display = 'none');
      };

      this.PRIVATE.showAllOptions = () => {
        this.PRIVATE.options.forEach(option => option.displayElement.style.display = '');
      };

      this.PRIVATE.clickHandler = evt => {
        this.clickCount++;

        if (this.clickCount === 2) {
          this.PRIVATE.showAllOptions();
          this.open();
        }
      };

      this.PRIVATE.keydownHandler = evt => {
        if (!this.isOpen) {
          this.PRIVATE.showAllOptions();
          return this.open()
        }

        switch (evt[this.keySource]) {
          case 27:
          case 'Escape':
            this.PRIVATE.clear();
            this.close();
            break

          case 38:
          case 'ArrowUp':
            evt.preventDefault();
            console.log('select previous option');
            break

          case 40:
          case 'ArrowDown':
            evt.preventDefault();
            console.log('select next option');
            break

          default:
            return
        }
      };

      this.PRIVATE.inputHandler = evt => {
        this.PRIVATE.clear();
        let query = this.PRIVATE.inputEl.value;

        if (!query) {
          return
        }

        let results = this.PRIVATE.find(query);

        if (results.length) {
          results.forEach(result => result.displayElement.style.display = '');
          this.setAttribute('open', '');
          return
        }

        if (this.hasAttribute('open')) {
          this.removeAttribute('open');
        }

        this.PRIVATE.clear();
      };

      this.PRIVATE.bodyClickHandler = evt => {
        if (evt.target === this || this.contains(evt.target)) {
          return
        }

        this.removeAttribute('open');
      };

      this.PRIVATE.getOptionById = (id) => {
        let options = this.PRIVATE.options;
        let option;

        for (let i = 0; i < options.length; i++) {
          if (options[i].id === id) {
            option = options[i];
            break
          }
        }

        return option
      };

      this.PRIVATE.generateOptionObject = optionEl => {
        if (!customElements.get('chassis-option')) {
          console.error(`chassis-datalist requires chassis-option. Please include it in this document's <head> element.`);
          return
        }

        let obj = {
          id: this.PRIVATE.generateGuid('option'),
          attributes: {},
          sourceElement: optionEl
        };

        for (let attr of optionEl.attributes) {
          obj.attributes[attr.name] = attr.value;
        }

        return obj
      };
    }

    static get observedAttributes () {
      return ['autofocus', 'case-sensitive', 'disabled', 'name', 'open', 'tabindex']
    }

    get isOpen () {
      return this.hasAttribute('open')
    }

    set isOpen (bool) {
      bool ? this.setAttribute('open', '') : this.removeAttribute('open');
    }

    get value () {
      return this.PRIVATE.inputEl.value
    }

    connectedCallback () {
      this.PRIVATE.inputEl.addEventListener('focus', evt => {
        this.addEventListener('keydown', this.PRIVATE.keydownHandler);
      });

      this.PRIVATE.inputEl.addEventListener('input', this.PRIVATE.inputHandler);

      this.PRIVATE.inputEl.addEventListener('click', this.PRIVATE.clickHandler);

      this.PRIVATE.inputEl.addEventListener('blur', evt => {
        this.clickCount = 0;
        this.removeEventListener('keydown', this.PRIVATE.keydownHandler);
      });

      setTimeout(() => {
        if (!this.hasAttribute('tabindex')) {
          this.setAttribute('tabindex', 0);
        }

        if (this.autofocus) {
          this.focus();
        }
      }, 0);
    }

    addChildren (children) {
      for (let child of children) {
        this.addOption(child instanceof HTMLElement ? this.PRIVATE.generateOptionObject(child) : child);
      }
    }

    addOption (option, index, dest = this.PRIVATE.optionsEl) {
      if (!customElements.get('chassis-option')) {
        console.error(`chassis-datalist requires chassis-option. Please include it in this document's <head> element.`);
        return
      }

      if (!option.hasOwnProperty('id')) {
        option.id = this.PRIVATE.generateGuid('option');
      }

      if (!option.hasOwnProperty('sourceElement') || !(option.sourceElement instanceof HTMLElement)) {
        let sourceEl = document.createElement('option');

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

      let label = option.sourceElement.getAttribute('label') || option.sourceElement.textContent.trim();
      let value = option.sourceElement.getAttribute('value');
      let disabled = option.sourceElement.disabled;
      let chassisOption = document.createElement('chassis-option');

      chassisOption.style.display = 'none';
      chassisOption.key = option.id;
      chassisOption.innerHTML = option.sourceElement.innerHTML;

      dest.appendChild(chassisOption);
      chassisOption.addEventListener('click', evt => this.select(chassisOption.key));

      option = {
        attributes: { disabled, label, value },
        id: option.id,
        displayElement: chassisOption,
        sourceElement: option.sourceElement
      };

      if (index) {
        this[`${index}`] = option.sourceElement;
        this.PRIVATE.options.splice(index, 0, option);
        return
      }

      this[`${this.PRIVATE.options.length}`] = option.sourceElement;
      this.PRIVATE.options.push(option);
    }

    attributeChangedCallback (attr, oldValue, newValue) {
      attr = attr.toLowerCase();

      if (newValue === oldValue) {
        return
      }

      switch (attr) {
        case 'autofocus':
        case 'disabled':
          console.log(attr);
          // this.PRIVATE.setBooleanAttributeValue(attr, newValue)
          break

        case 'name':
          console.log(attr);
          // this.PRIVATE.setAttributeValue(attr, newValue)
          break

        case 'open':
          this.isOpen ? this.open() : this.close();
          break
      }
    }

    close () {
      document.body.removeEventListener('click', this.PRIVATE.bodyClickHandler);
      document.body.removeEventListener('touchcancel', this.PRIVATE.bodyClickHandler);
      document.body.removeEventListener('touchend', this.PRIVATE.bodyClickHandler);

      if (this.isOpen) {
        this.isOpen = false;
      }
    }

    open () {
      document.body.addEventListener('click', this.PRIVATE.bodyClickHandler);
      document.body.addEventListener('touchcancel', this.PRIVATE.bodyClickHandler);
      document.body.addEventListener('touchend', this.PRIVATE.bodyClickHandler);

      if (!this.isOpen) {
        this.isOpen = true;
      }
    }

    inject (input, datalist, guid) {
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

    select (id) {
      let option = this.PRIVATE.getOptionById(id);

      if (option) {
        option.sourceElement.selected = true;
        this.PRIVATE.inputEl.value = option.displayElement.innerHTML;
        this.PRIVATE.selectedOption = option;

        this.PRIVATE.options.forEach(option => option.displayElement.removeAttribute('selected'));
        option.displayElement.setAttribute('selected', '');

        this.dispatchEvent(new Event('input', {
          bubbles: true
        }));

        this.close();
      }
    }
  }

  customElements.define('chassis-datalist', AuthorDatalistElement);

}());
//# sourceMappingURL=author-datalist.js.map
