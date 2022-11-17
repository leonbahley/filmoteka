import { API } from '../utils/api';
import card from '../../templates/card.hbs';
import { showMovieDetails } from '../modal/modal';
import cardForLibrary from '../../templates/card-for-library.hbs';

const galleryEl = document.querySelector('.gallery');
const movieApi = new API();

galleryEl.addEventListener('click', onCardClick);

function onCardClick(event) {
  if (event.target.nodeName === 'BUTTON') {
    return;
  }

  if (event.currentTarget === event.target) {
    return;
  }
  const galleryItemEl = event.target.closest('.templates-film');
  const movieId = galleryItemEl.dataset.id;

  showMovieDetails(movieId);
}

export async function renderGallery(array) {
  await prepareToRender(array);
  galleryEl.innerHTML = card(array);
}

function nameGenres(id, genresArray) {
  for (let genre of genresArray) {
    if (genre.id === id) {
      return genre.name;
    }
  }
}

async function prepareToRender(array) {
  const genresArray = await movieApi.getGenreList();
  for (let movie of array) {
    for (let i = 0; i < movie.genre_ids.length; i += 1) {
      movie.genre_ids[i] = nameGenres(movie.genre_ids[i], genresArray);
    }
    movie.genre_ids = movie.genre_ids.join(', ');
    const releaseDade = movie.release_date.split('-');
    movie.release_date = releaseDade[0];
  }
}

export function renderLibraryGallery(array) {
  galleryEl.innerHTML = cardForLibrary(array);
}
