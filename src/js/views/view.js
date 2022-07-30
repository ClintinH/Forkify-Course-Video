import icons from 'url:../../img/icons.svg'; // parcel 2

export default class View {
  _data;

  /**
   * Render the received object to Dom
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] if false, create markup string isntead of renderin to Dom
   * @returns {undefined | string} A markup sting is return if render=false
   * @this {Object} View instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // generates new markup
    const newDom = document.createRange().createContextualFragment(newMarkup); // create new fake dom
    const newElements = Array.from(newDom.querySelectorAll('*')); // selecting all the elements on the fake dom
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // selecting all the elements on the current dom

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      console.log(`first child ${newEl.firstChild}`, curEl);

      // Update changed text - Using isEqualNode method to compare newEl with curEl
      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
             <svg>
                <use href="${icons}#icon-alert-triangle"></use>
            </svg>
        </div>
        <p>${message}</p>
     </div>
     `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
        <div>
             <svg>
                <use href="${icons}##icon-smile"></use>
            </svg>
        </div>
        <p>${message}</p>
     </div>
     `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
