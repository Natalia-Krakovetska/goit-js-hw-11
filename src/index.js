import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const form = document.querySelector('#search-form');
const boxGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// form.addEventListener("submit", onSubmitForm);
loadMoreBtn.addEventListener("click", onLoadMore)

let instance = "";
let page = 0;



// function onSubmitForm(evt){
//     const evtTarget = evt.target.value;

// }

// fetch(`https://pixabay.com/api/?key=31910031-2af744f88dbcdc5739401f7e8&q=cats&image_type&orientation&safesearch`).then(resp => {  
//     if(!resp.ok){
//     throw new Error('Not ok')
// }
// return resp.json()})
// .then(data => console.log(data))


async function getUser(page = 1) {
    try {
      const response = await axios.get(`https://pixabay.com/api/?key=31910031-2af744f88dbcdc5739401f7e8&${page}&q=dog&image_type&orientation&safesearch`);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  getUser().then(response =>{ 
    console.log(response);
    createmarkUp(response.data.hits)})

function createmarkUp(arr){
    const markUp = arr.map(item =>        
`<div class="photo-card">
<a class="gallery__item" href="${item.webformatURL}">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="300" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${item.downloads}</b>
    </p>
  </div>
  </a>
</div>`
 ).join('');
 boxGallery.insertAdjacentHTML('beforeend', markUp) ;
}


// function onClickImage(evt){
//     evt.preventDefault();
//     instance.show();
//     }
// new SimpleLightbox('.gallery a', {captionsData: "alt",captionDelay: 250});




function onLoadMore(){
    page+=1;
    loadMoreBtn.hidden = true;
    getUser(page).then(response => {
     createmarkUp(response.data.hits)})        
}