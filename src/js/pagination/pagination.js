import Pagination from 'tui-pagination';
import { renderGallery } from '../gallery';
import { scrollToTop } from '../scroll-to-top/scroll-to-top';
import { movieApi } from '../utils';
import { loader } from '../header';

const PER_PAGE = 20;

const containerEl = document.getElementById('pagination');
const options = {
  totalItems: 10000,
  itemsPerPage: PER_PAGE,
  visiblePages: 5,
  page: 1,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
};

export function startPagination(response) {
  const responseOption = {
    totalItems: response.total_results < 10000 ? response.total_results : 10000,
  };

  const pagination = new Pagination(containerEl, {
    ...options,
    ...responseOption,
  });
  pagination.reset();
  pagination.on('beforeMove', eventData => {
    movieApi.setPage(eventData.page);
    loader.classList.toggle('loader-hidden');
    movieApi
      .lastRequest()
      .then(({ results }) => renderGallery(results))
      .catch(console.log)
      .then(() => loader.classList.toggle('loader-hidden'));
  });

  pagination.on('afterMove', scrollToTop);
}
