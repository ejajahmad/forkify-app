class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    return this._parentEl.querySelector('.search__field').value;
  }

  addHandlerSearch(handle) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handle();
    });
  }

  clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
