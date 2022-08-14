import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/fetchImages';
import { fadeEffect } from './js/preloader';

//html el
const searchQuery = document.querySelector('input[name="searchQuery"]');
const closeBtn = document.querySelector('.close-btn');
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('.search-btn');

let perPage = 40;
let page = 0;
let name = searchQuery.value;

loadBtn.style.display = 'none';
closeBtn.style.display = 'none';

async function eventHandler(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  loadBtn.style.display = 'none';

  page = 1;
  name = searchQuery.value;

  fetchImages(name, page, perPage)
    .then(name => {
      let totalPages = name.totalHits / perPage;

      if (name.hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
        renderGallery(name);
        new SimpleLightbox('.gallery a');
        closeBtn.style.display = 'flex';
        closeBtn.addEventListener('click', () => {
          gallery.innerHTML = '';
          closeBtn.style.display = 'none';
        });

        if (page < totalPages) {
          loadBtn.style.display = 'flex';
        } else {
          loadBtn.style.display = 'none';
          Notiflix.Notify.info(
            `We're sorry, but you've reached the end of search results.`
          );
        }
      } else {
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        gallery.innerHTML = '';
      }
    })
    .catch(error => console.log('ERROR: ' + error));
}
searchForm.addEventListener(`submit`, eventHandler);

function renderGallery(name) {
  const markup = name.hits
    .map(hit => {
      return `<div class="photo-card">
    <a class="galleryLink" href="${hit.largeImageURL}">
    <img 
    class="galleryImg"
    src="${hit.webformatURL}" 
    alt="${hit.tags}" 
    loading="lazy" />
</a>
    <div class="info">
<div class="info__cont">
      <p class="info-item">
        <b class="inform-materials">Likes</b>
      </p>
      <p class="info-counter">${hit.likes.toLocaleString()}</p>
</div>

<div class="info__cont">
      <p class="info-item">
        <b class="inform-materials">Views</b>
      </p>
      <p class="info-counter">${hit.views.toLocaleString()}</p>
</div>

<div class="info__cont">
      <p class="info-item">
        <b class="inform-materials">Comments</b>
      </p>
      <p class="info-counter">${hit.comments.toLocaleString()}</p>
</div>

<div class="info__cont">
      <p class="info-item">
        <b class="inform-materials">Downloads</b>
      </p>
      <p class="info-counter">${hit.downloads.toLocaleString()}</p>
</div>

    </div>
  </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

//function more load

loadBtn.addEventListener(
  'click',
  () => {
    name = searchQuery.value;
    page += 1;
    fetchImages(name, page, perPage).then(name => {
      let totalPages = name.totalHits / perPage;
      renderGallery(name);
      new SimpleLightbox('.gallery a');
      if (page >= totalPages) {
        loadBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
  },
  true
);

// preloader

window.addEventListener('load', fadeEffect);
