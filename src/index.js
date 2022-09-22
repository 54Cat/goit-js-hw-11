import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { imagesApiService, PER_PAGE } from './js/fetch';

const searchForm = document.querySelector('#search-form');
const btnLoadMore = document.querySelector('#load-more');
const galleryEl = document.querySelector('.gallery-list');
let page = 1;
let searchQuery = '';

const lightbox = new SimpleLightbox('.gallery-link', { captions: true, captionSelector: 'img', captionsData: 'alt', captionPosition: 'bottom', captionDelay: 250 });

searchForm.addEventListener('submit', onSearchQuery);
btnLoadMore.addEventListener('click', onLoadMore);
hidenBtn();

function onSearchQuery(e) {
    e.preventDefault();
    searchQuery = e.currentTarget.elements.searchQuery.value.trim();

    if (searchQuery === '') {
        return;
    }

    removeData();
    hidenBtn();
    resetPage();
    responseData();
}

function onLoadMore() {
    incrementPage();
    responseData();
}

async function responseData() {
    try {
        const response = await imagesApiService(searchQuery, page);
        handleResponse(response);
    } catch (error) {
        console.log(error);
        unknownError();
    }
}

function handleResponse(query) {

    const totalPage = Math.ceil(query.totalHits / PER_PAGE);
    if (query.totalHits === 0) {
        hidenBtn();
        notFound();
    } else if (page >= totalPage) {
        hidenBtn();
        insertGalleryList(query);
        notifyEndFind();
    } else if (page === 1) {
        foundImages(query.totalHits);
        visibleBtn();
        insertGalleryList(query);
        scrollToBottom();
        lightbox.refresh();
    } else {
        insertGalleryList(query);
        scrollToBottom();
        lightbox.refresh();
    }
}

function insertGalleryList(query) {
    const markup = query.hits.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
        return `<li class="photo-card">
            <div class="photo-thumb">
                <a class="gallery-link" href="${largeImageURL}">
                    <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                </a>
            </div>
            <ul class="info-list">
                <li class="info-item">
                <span>Likes</span> ${likes}
                </li>

                <li class="info-item">
                <span>Views</span> ${views}
                </li>

                <li class="info-item">
                <span>Comments</span> ${comments}
                </li>

                <li class="info-item">
                <span>Downloads</span> ${downloads}
                </li>
            </ul>
        </li>`;
    }).join("");
    galleryEl.insertAdjacentHTML("beforeend", markup);
};

function removeData() {
    galleryEl.innerHTML = '';
}

function hidenBtn() {
    btnLoadMore.classList.add("visually-hidden");
}

function visibleBtn() {
    btnLoadMore.classList.remove("visually-hidden");
}

function foundImages(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function notifyEndFind() {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}

function notFound() {
    Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
}

function unknownError() {
    Notiflix.Notify.warning('Unknown error has occurred. Please try again.');
}

function incrementPage() {
    page += 1;
}

function resetPage() {
    page = 1;
}

function scrollToBottom() {
    const galleryCard = galleryEl.getBoundingClientRect();
    window.scrollBy({
        top: galleryCard.height,
        behavior: 'smooth',
    })
}