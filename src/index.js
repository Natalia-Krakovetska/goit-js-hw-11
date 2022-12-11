import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const form = document.querySelector('#search-form');
const boxGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMore);
loadMoreBtn.style.display = 'none';
let page = 0;
let total = 0;
let searchQuery = '';
const simpleligthbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
function onSubmitForm(evt) {
  evt.preventDefault();
  loadMoreBtn.style.display = 'none';
  page = 1;

  clearGalleryList();
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    loadMoreBtn.style.display = 'none';
    clearGalleryList();
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    clearGalleryList();
    return;
  }

  getUser(searchQuery, page).then(response => {
    loadMoreBtn.style.display = 'none';
    console.log(response);
    total += response.data.hits.length;
    if (!response.data.hits.length) {
      loadMoreBtn.style.display = 'none';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    createmarkUp(response.data.hits);
    loadMoreBtn.style.display = 'block';
    if (total === Number(response.data.total)) {
      loadMoreBtn.style.display = 'none';
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

async function getUser() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=31910031-2af744f88dbcdc5739401f7e8&page=${page}&per_page=40&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

function createmarkUp(arr) {
  const markUp = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="gallery__item">
  <a class="gallery__link" href="${largeImageURL}">
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="250" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
 
</div>`
    )
    .join('');
  boxGallery.insertAdjacentHTML('beforeend', markUp);
}

function onLoadMore() {
  loadMoreBtn.style.display = 'none';
  page += 1;
  getUser(searchQuery, page)
    .then(response => {
      total += response.data.hits.length;
      if (total === response.data.totalHits) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.style.display = 'none';
        return;
      }
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      loadMoreBtn.style.display = 'block';
      createmarkUp(response.data.hits);
    })
    .then(() => simpleligthbox.refresh())
    .catch(err => {
      console.log(err);
      Notiflix.Notify.success('Sol lucet omnibus');
      boxGallery.innerHTML = '';
    });
}

function clearGalleryList() {
  boxGallery.innerHTML = '';
}
