import icons from 'url:../../img/icons.svg';

export default class View {
  render(data, render = true) {
    if (!data.length) this.renderError();
    this._data = data;

    const markup = this._getMarkup();

    if (!render) return markup;

    this._clear();
    this._attach(markup);
  }

  update(data) {
    // if (!data.length) this.renderError();

    this._data = data;
    const newMarkup = this._getMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // console.log(newElements.filter((el, i) => !el.isEqualNode(curElements[i])));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update Changed Text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update Changed Attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderError(message = this._error) {
    const markup = ` 
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._clear();
    this._attach(markup);
  }

  _clear() {
    if (this._parentElement) this._parentElement.innerHTML = '';
  }

  _attach(markup) {
    if (this._parentElement)
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
    `;

    this._parentElement.innerHTML = '';
    this._attach(markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._attach(markup);
  }
}
