import View from './View';
import searchView from './searchView';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _data;
  _error;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      if (btn.disabled) return;

      const currentPage = parseInt(btn.dataset.currPage);
      const action = btn.dataset.goto;
      handler(currentPage, action === 'true' ? true : false);
    });
  }

  _getMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    return `
      <button data-curr-page="${
        this._data.page
      }" data-goto="false" class="btn--inline pagination__btn--prev" ${
      currentPage === 1 ? 'disabled' : ''
    }>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page (${currentPage - 1})</span>
      </button>
      <button data-curr-page="${
        this._data.page
      }" data-goto="true" class="btn--inline pagination__btn--next" ${
      currentPage === numPages ? 'disabled' : ''
    }>
        <span>Page (${currentPage + 1})</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>`;

    // if (currentPage === 1 && numPages > 1) return 'Page 1, and Others';

    // if (currentPage === numPages) return 'Last page';

    // if (currentPage < numPages) return 'Other Page';
  }
}

export default new PaginationView();
