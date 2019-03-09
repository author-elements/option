class AuthorOptionElement extends AuthorBaseElement(HTMLElement) {
  constructor () {
    super(`{{TEMPLATE-STRING}}`)

    this.UTIL.defineAttributes({
      disabled: false,
      hover: false,
      id: '',
      label: '',
      selected: false,
      value: ''
    })

    this.UTIL.defineProperties({
      defaultSelected: false,

      form: {
        readonly: true,
        private: true
      },

      index: {
        readonly: true,
        get: () => this.parentNode.options.findIndex(option => option.displayElement === this)
      }
    })

    this.UTIL.definePrivateMethods({
      mouseButtonIsDown: evt => {
        let code = evt.buttons !== undefined ? evt.buttons : evt.nativeEvent.which
        return code >= 1
      },

      mousemoveHandler: evt => this.emit('option.hovered', this.index),

      mouseoutHandler: evt => this.hover = false,

      mouseoverHandler: evt => {
        let mousedown = this.PRIVATE.mouseButtonIsDown(evt)

        if (!(this.parentNode.multiple && mousedown)) {
          this.hover = true
          return
        }

        let { shiftKey, metaKey, ctrlKey } = evt
        this.PRIVATE.select(true, metaKey, ctrlKey, mousedown)
      },

      parentStateChangeHandler: evt => {
        let { name, value } = evt.detail

        switch (name) {
          case 'multiple':
            return this.PRIVATE.setMode(value ? 'select-multiple' : 'select-one')

          default: return
        }
      },

      setMode: mode => {
        switch (mode) {
          case 'select-multiple':
            this.off('mouseup', this.PRIVATE.selectionHandler)
            this.on('mousedown', this.PRIVATE.selectionHandler)
            break

          case 'select-one':
            this.on('mouseup', this.PRIVATE.selectionHandler)
            this.off('mousedown', this.PRIVATE.selectionHandler)
            break

          default: return
        }
      },

      select: (shiftKey = false, metaKey = false, ctrlKey = false, mousedown = false) => {
        let { index } = this
        this.emit('option.selected', {index, shiftKey, metaKey, ctrlKey, mousedown}, this.parentNode)
      },

      selectionHandler: evt => {
        let { shiftKey, metaKey, ctrlKey } = evt
        this.PRIVATE.select(shiftKey, metaKey, ctrlKey)
      }
    })

    this.UTIL.registerListeners(this, {
      connected: () => {
        this.parentNode.on('state.change', this.PRIVATE.parentStateChangeHandler)
        this.parentNode.multiple && this.PRIVATE.setMode('select-multiple')
      },

      disconnected: () => {
        this.off('mousedown', this.PRIVATE.selectionHandler)
        this.parentNode.off('state.change', this.PRIVATE.parentStateChangeHandler)
      },

      mouseover: this.PRIVATE.mouseoverHandler,
      mousemove: this.PRIVATE.mousemoveHandler,
      mouseout: this.PRIVATE.mouseoutHandler,
      mouseup: this.PRIVATE.selectionHandler
    })
  }

  static get observedAttributes () {
    return ['disabled', 'hover', 'label', 'selected', 'value']
  }

  get text () {
    return this.innerHTML
  }

  set text (content) {
    this.innerHTML = content
  }

  /**
   * @method remove
   * Remove this option from the DOM.
   * @override
   */
  remove () {
    this.parentNode.options.splice(this.index, 1)
    super.remove()
  }
}

customElements.define('author-option', AuthorOptionElement)

export default AuthorOptionElement
