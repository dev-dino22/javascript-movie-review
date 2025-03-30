(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function Input({ placeholder, eventName, id }) {
  return `
        <input type="text" id="${id}" name="${id}" placeholder="${placeholder}"></input>
    `;
}
function SearchForm() {
  return `
    <form class="search-input-box" id="searchForm">
        ${Input({ placeholder: "검색어를 입력하세요", id: "searchInput" })}
        <button type="submit">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 14L10 10M11.3333 6.66667C11.3333 9.244 9.244 11.3333 6.66667 11.3333C4.08934 11.3333 2 9.244 2 6.66667C2 4.08934 4.08934 2 6.66667 2C9.244 2 11.3333 4.08934 11.3333 6.66667Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </form>
    `;
}
function Header() {
  function template() {
    return `
        <div class="header-container">
        <a href="/javascript-movie-review/" class="header-logo">
            <img src="./images/logo.png" alt="MovieList" />
        </a>
            ${SearchForm()}
            <img src="./images/logo.png" alt="MovieList" class="header-transparent-logo" />
        </div>
        <div id="headerBackground" class="header-background">
        </div>
    `;
  }
  function render() {
    document.querySelector("#headerSection").innerHTML = template();
  }
  render();
}
const getHTML = (id) => document.getElementById(id);
const createElement = ({ tag, id, className }) => {
  const element = document.createElement(tag);
  if (id) element.id = id;
  if (className) element.className = className;
  return element;
};
function roundRating(value) {
  return Math.round(value * 10) / 10;
}
function StarIcon({ isFilled, type, rating }) {
  const starSvg = `
    <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5514 23.0789L21.8558 27.0731C22.6617 27.5837 23.6622 26.8243 23.4231 25.8836L21.6016 18.7183C21.5503 18.5188 21.5564 18.3088 21.6191 18.1125C21.6819 17.9162 21.7987 17.7417 21.9563 17.6089L27.6097 12.9034C28.3525 12.2851 27.9691 11.0523 27.0147 10.9904L19.6318 10.5112C19.4329 10.497 19.2422 10.4266 19.0818 10.3082C18.9214 10.1898 18.7979 10.0283 18.7258 9.8424L15.9722 2.90828C15.8974 2.71101 15.7643 2.54117 15.5906 2.42133C15.417 2.30149 15.211 2.2373 15 2.2373C14.789 2.2373 14.583 2.30149 14.4094 2.42133C14.2357 2.54117 14.1026 2.71101 14.0278 2.90828L11.2742 9.8424C11.2021 10.0283 11.0786 10.1898 10.9182 10.3082C10.7578 10.4266 10.5671 10.497 10.3682 10.5112L2.98525 10.9904C2.03087 11.0523 1.64746 12.2851 2.3903 12.9034L8.04371 17.6089C8.20126 17.7417 8.31813 17.9162 8.38088 18.1125C8.44362 18.3088 8.4497 18.5188 8.39841 18.7183L6.70918 25.3634C6.42222 26.4922 7.62287 27.4034 8.58991 26.7907L14.4486 23.0789C14.6134 22.974 14.8047 22.9183 15 22.9183C15.1953 22.9183 15.3866 22.974 15.5514 23.0789V23.0789Z" fill=${isFilled ? "#FFC700" : "none"} stroke="#FFC700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;
  const smStarSvg = `
  <div class="sm-star-box">
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.38173 15.0059L13.7463 17.8818C14.3042 18.2494 14.9969 17.7027 14.8314 17.0254L13.5703 11.8663C13.5348 11.7227 13.539 11.5715 13.5825 11.4301C13.6259 11.2888 13.7068 11.1631 13.8159 11.0675L17.7298 7.6796C18.2441 7.23445 17.9786 6.34682 17.3179 6.30222L12.2066 5.95723C12.0689 5.947 11.9369 5.8963 11.8258 5.81105C11.7148 5.72579 11.6293 5.60949 11.5794 5.47567L9.67308 0.4831C9.62126 0.341066 9.52913 0.218787 9.40891 0.132499C9.28869 0.046212 9.14607 0 9 0C8.85393 0 8.71132 0.046212 8.5911 0.132499C8.47088 0.218787 8.37874 0.341066 8.32692 0.4831L6.42062 5.47567C6.37068 5.60949 6.2852 5.72579 6.17416 5.81105C6.06312 5.8963 5.93107 5.947 5.7934 5.95723L0.682099 6.30222C0.0213715 6.34682 -0.244064 7.23445 0.270206 7.6796L4.18411 11.0675C4.29318 11.1631 4.37409 11.2888 4.41753 11.4301C4.46097 11.5715 4.46517 11.7227 4.42966 11.8663L3.2602 16.6508C3.06154 17.4635 3.89275 18.1196 4.56224 17.6785L8.61828 15.0059C8.73235 14.9304 8.86477 14.8903 9 14.8903C9.13523 14.8903 9.26765 14.9304 9.38173 15.0059V15.0059Z" fill="#FFC700"/>
</svg>
${rating ? `<p> ${roundRating(rating)}</p>` : ""}
</div>

`;
  return type === "small" ? smStarSvg : starSvg;
}
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
function MovieItem({ id, img, rating, title }) {
  const movieId = id;
  function template() {
    const li = createElement({ tag: "li" });
    const imgSrc = img ? `${BASE_IMAGE_URL}${img}` : "./images/nullImage.png";
    li.innerHTML = `<div class="item">
      <div class="skeleton-loading">
        <div class="skeleton-image"></div>
        <img
          class="thumbnail"
          src="${imgSrc}"
          alt="${title}"
        />
        </div>


        <div class="item-desc">
        
        <div class="skeleton-loading">
          <div class="skeleton-image"></div>
          <p class="rate">
            ${StarIcon({ type: "small", rating })}
          </p>
          </div>
          <div class="skeleton-loading">
            <div class="skeleton-image"></div>
            <strong>${title}</strong>
          </div>
        </div>
       
      </div>`;
    return li;
  }
  return { template, getId: () => movieId };
}
const BASE_URL = "https://api.themoviedb.org/3";
async function fetchPopularMovies(pageIndex) {
  const popularMovieUrl = `${BASE_URL}/movie/popular?language=ko-Kr&page=${pageIndex}`;
  return await fetchUtil(popularMovieUrl);
}
async function fetchSearchMovies(pageIndex, searchKeyword) {
  const searchMovieUrl = `${BASE_URL}/search/movie?query=${searchKeyword}&include_adult=false&language=ko-KR&page=${pageIndex}`;
  return await fetchUtil(searchMovieUrl);
}
async function fetchMovieDetail(movieId) {
  const movieDetailUrl = `${BASE_URL}/movie/${movieId}?language=ko-KR`;
  return await fetchUtilDetail(movieDetailUrl);
}
async function fetchUtil(url) {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZjI0NmQ4NjBkMzVhYzU4Y2JiZWJmYmI5YWYzMzI5NyIsIm5iZiI6MTc0MjI3MzI2OS41MDU5OTk4LCJzdWIiOiI2N2Q4ZmFmNTU2MmU4MzJjOTczNjU2M2IiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.1Za7XiZLt45UFW6Er46E0FGESgxaxjmrk1U5x0FIrAo"}`
    }
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    alert("서버와의 연결이 끊어졌습니다");
    return;
  }
  const { results, total_pages } = await response.json();
  return { results, total_pages };
}
async function fetchUtilDetail(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZjI0NmQ4NjBkMzVhYzU4Y2JiZWJmYmI5YWYzMzI5NyIsIm5iZiI6MTc0MjI3MzI2OS41MDU5OTk4LCJzdWIiOiI2N2Q4ZmFmNTU2MmU4MzJjOTczNjU2M2IiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.1Za7XiZLt45UFW6Er46E0FGESgxaxjmrk1U5x0FIrAo"}`
    }
  });
  if (!response.ok) {
    alert("서버와의 연결이 끊어졌습니다");
    throw new Error("Failed to fetch detail");
  }
  return await response.json();
}
function createStorage(key, storage = window.localStorage) {
  function getStorage() {
    const item = storage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return [];
  }
  function setStorage(value) {
    storage.setItem(key, JSON.stringify(value));
  }
  function setTargetStorage(targetId, newItem) {
    const items = getStorage();
    const index = items.findIndex((item) => item.id === targetId);
    const updatedItem = { ...newItem, id: targetId };
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem };
    } else {
      items.push(updatedItem);
    }
    setStorage(items);
  }
  function removeStorage() {
    storage.removeItem(key);
  }
  function clearStorage() {
    storage.clear();
  }
  function findItem(id) {
    const items = getStorage();
    return items.find((item) => item.id === id) || null;
  }
  return {
    get: getStorage,
    set: setStorage,
    remove: removeStorage,
    clear: clearStorage,
    find: findItem,
    setTarget: setTargetStorage
  };
}
const userReviewStorage = createStorage("userReview");
function StarRatingForm(id, savedRating) {
  const state = {
    movieId: id,
    selectedRating: savedRating,
    ratingTexts: ["최악이예요", "별로예요", "보통이에요", "재미있어요", "명작이에요"]
  };
  function template() {
    return `
      <div class="my-rating-section">
        <h3 class="my-rating-title">내 별점</h3>
        <div class="stars-container" id="starsContainer">
          <div class="star-box" id="starBox">
            ${[1, 2, 3, 4, 5].map(
      (value) => `
              <div class="star" data-value="${value}">
                <div class="star-bg">${StarIcon({ isFilled: false })}</div>
                <div class="star-fill" style="width: ${value <= state.selectedRating / 2 ? "100%" : "0%"}">${StarIcon({ isFilled: true })}</div>
              </div>`
    ).join("")}
          </div>
          <div class="rating-text" id="ratingText">
            ${state.selectedRating > 0 ? `${state.ratingTexts[state.selectedRating / 2 - 1]} <span class="rating-score">(${state.selectedRating}/10)</span>` : "별점을 등록해주세요."}
          </div>
        </div>
      </div>
    `;
  }
  function setEvent() {
    document.getElementById("starsContainer").removeEventListener("click", setStarRating);
    document.getElementById("starsContainer").addEventListener("click", setStarRating);
  }
  function setStarRating(e) {
    const targetStar = e.target.closest(".star");
    if (!targetStar) return;
    const ratingText = document.getElementById("ratingText");
    const value = parseInt(targetStar.dataset.value, 10);
    state.selectedRating = value;
    fillStars(targetStar);
    ratingText.innerHTML = `${state.ratingTexts[value - 1]} <span class="rating-score">(${value * 2}/10)</span>`;
    userReviewStorage.setTarget(state.movieId, { vote_average: value * 2 });
  }
  function fillStars(targetStar) {
    let current = targetStar;
    while (current) {
      const fill = current.querySelector(".star-fill");
      if (fill) fill.style.width = "100%";
      current = current.previousElementSibling;
    }
    current = targetStar.nextElementSibling;
    while (current) {
      const fill = current.querySelector(".star-fill");
      if (fill) fill.style.width = "0";
      current = current.nextElementSibling;
    }
  }
  function setStarFn() {
    document.getElementById("starsContainer");
    setEvent();
  }
  function render(targetElementId) {
    const target = document.getElementById(targetElementId);
    if (!target) return;
    target.innerHTML = template();
    setEvent();
  }
  return { template, setStarFn, render };
}
function ModalLayout() {
  render();
  function replaceContent({
    id,
    title,
    release_date,
    genres,
    poster_path,
    vote_average,
    overview
  }) {
    const movieTitle = document.getElementById("movieTitle");
    if (movieTitle) movieTitle.textContent = title;
    const releaseDataElement = getHTML("releaseDate");
    if (releaseDataElement) releaseDataElement.textContent = release_date;
    const genresElement = getHTML("genres");
    const genreText = genres.map((genre) => genre.name).join(", ");
    if (genresElement) genresElement.textContent = genreText;
    const ratingNumber = document.querySelector(".rating-number");
    if (ratingNumber) ratingNumber.textContent = roundRating(vote_average).toString();
    const synopsisContent = document.querySelector(".synopsis-content");
    if (synopsisContent) synopsisContent.textContent = overview;
    const BASE_IMAGE_URL2 = "https://image.tmdb.org/t/p/w500";
    const imgSrc = BASE_IMAGE_URL2 + poster_path;
    const posterImageElement = getHTML("posterImage");
    if (posterImageElement) {
      posterImageElement.src = imgSrc;
      posterImageElement.alt = title;
    }
    const starRatingFormBox = getHTML("starRatingFormBox");
    const savedRatingData = userReviewStorage.find(id);
    const rating = savedRatingData ? roundRating(savedRatingData.vote_average) : 0;
    if (starRatingFormBox) {
      StarRatingForm(id, rating).render("starRatingFormBox");
    }
  }
  function template() {
    return `
        <div class="modal-container">
          <div class="modal-close" id="closeModal">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L19 19" stroke="#95A1B2" stroke-width="4.5" stroke-linecap="round"/>
              <path d="M3 19.0005L19 3.00051" stroke="#95A1B2" stroke-width="4.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="modal-image">
            <img id="posterImage" class="poster-image" src="" alt="" />
          </div>
          
          <div class="modal-content">

          <div class="movie-content-title-box">

            <h2 id="movieTitle" class="movie-title">-</h2>
            <p class="movie-info">
            <span id="releaseDate">2024</span>
            · 
            <span id="genres"></span>
            </p>
            
            <div id="movieRating" class="movie-rating">
              <span class="rating-label">평균</span>
              <div class="rating-value">
                <span class="rating-star">${StarIcon({ type: "small" })}</span>
                <span class="rating-number">0</span>
              </div>
            </div>

          </div>
            <div id="starRatingFormBox">
           
            </div>
            <div class="synopsis-section">
              <h3 class="synopsis-title">줄거리</h3>
              <div class="synopsis-content">
                -
              </div>
            </div>
          </div>
          </div>
      `;
  }
  function render() {
    const modalHTML = template();
    const dialog = document.getElementById("dialogID");
    if (dialog) {
      dialog.innerHTML = "";
      dialog.innerHTML = modalHTML;
    }
    setEvent();
  }
  function setEvent() {
    const closeModal = document.getElementById("closeModal");
    const dialog = document.getElementById("dialogID");
    if (closeModal && dialog) {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog || event.target.closest("#closeModal") === closeModal) {
          dialog.close();
        }
      });
    }
  }
  return { render, replaceContent };
}
function MovieList() {
  const ul = createElement({ tag: "ul", id: "thumbnailList", className: "thumbnail-list" });
  const itemMap = /* @__PURE__ */ new Map();
  const modalLayout = ModalLayout();
  async function fetchMoreMovieItemInfo(e) {
    const li = e.target.closest("li");
    if (!li) return;
    const movieId = itemMap.get(li);
    if (!movieId) return;
    const { id, title, release_date, genres, poster_path, vote_average, overview } = await fetchMovieDetail(movieId);
    document.getElementById("dialogID").showModal();
    modalLayout.replaceContent({
      id,
      title,
      release_date,
      genres,
      poster_path,
      vote_average,
      overview
    });
  }
  function setEvent() {
    getHTML("thumbnailList").removeEventListener("click", fetchMoreMovieItemInfo);
    getHTML("thumbnailList").addEventListener("click", fetchMoreMovieItemInfo);
  }
  function render(dataList) {
    getHTML("movieListContainer").appendChild(ul);
    const movieList = createMovieList(dataList);
    ul.replaceChildren(movieList);
    setEvent();
  }
  function moreMovieListRender(dataList) {
    const movieList = createMovieList(dataList);
    ul.appendChild(movieList);
  }
  function createMovieList(dataList) {
    const movieList = dataList.map((data) => {
      const movieItem = MovieItem({
        id: data.id,
        img: data.poster_path,
        rating: roundRating(data.vote_average),
        title: data.title
      }).template();
      itemMap.set(movieItem, data.id);
      return movieItem;
    });
    const docfrag = new DocumentFragment();
    movieList.forEach((li) => docfrag.appendChild(li));
    return docfrag;
  }
  return { render, moreMovieListRender, setEvent };
}
function hideskeleton() {
  const skeletonItem = document.querySelectorAll(".skeleton-image");
  skeletonItem.forEach((element) => {
    setTimeout(() => {
      element.style.opacity = "0";
      element.style.display = "none";
    }, 300);
  });
}
function ScrollObserver() {
  let observer = null;
  let container = null;
  function render(targetId, onIntersect) {
    container = getHTML(targetId);
    const observerTrigger = createElement({
      tag: "div",
      id: "observerTrigger",
      className: "observer-trigger"
    });
    if (observer) observer.disconnect();
    container.appendChild(observerTrigger);
    setFunction(onIntersect);
  }
  function hideTrigger() {
    const observerTrigger = container.querySelector("#observerTrigger");
    if (observerTrigger) observerTrigger.style.display = "none";
  }
  function setFunction(onIntersect) {
    const observerTrigger = container.querySelector("#observerTrigger");
    if (!observerTrigger) return;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        root: null,
        threshold: 1
      }
    );
    observer.observe(observerTrigger);
  }
  return { render, hideTrigger };
}
function MovieLayout(movieData) {
  let state = {
    title: "지금 인기 있는 영화",
    movieData,
    currentPage: 1,
    searchKeyword: "",
    totalPages: 0
  };
  const scrollTrigger = ScrollObserver();
  const movieList = MovieList();
  render();
  function incrementCurrentPage() {
    state.currentPage = (state.currentPage ?? 1) + 1;
  }
  function replaceChildren(newState) {
    state = { currentPage: 1, ...newState };
    render();
  }
  function template() {
    var _a;
    if (((_a = state.movieData) == null ? void 0 : _a.length) === 0) {
      return `
            <div class="flex-center gap-16">
                <img src="./images/hangsung.png" />
                <div class="text-xl">검색 결과가 없습니다.</div>
            </div>
            `;
    }
    return `
            <h2 id="movieListTitle" class="text-xl my-36 ml-48">${state.title}</h2>
            <div id="movieListContainer">
                
            </div>

            <div id="scrollObserverContainer">
  
            </div>
        `;
  }
  function render() {
    const movieSectionEl = document.getElementById("movieSection");
    if (movieSectionEl) movieSectionEl.innerHTML = template();
    movieList.render(state.movieData);
    scrollTrigger.render("scrollObserverContainer", newMovieListRender);
    if (state.totalPages === state.currentPage && scrollTrigger) scrollTrigger.hideTrigger();
    hideskeleton();
  }
  async function newMovieListRender() {
    setTimeout(hideskeleton, 500);
    incrementCurrentPage();
    const fetchFn = state.searchKeyword ? fetchSearchMovies : fetchPopularMovies;
    const { results } = await fetchFn(state.currentPage ?? 1, state.searchKeyword ?? "");
    movieList.moreMovieListRender(results);
    hideskeleton();
    if (state.totalPages === state.currentPage && scrollTrigger) scrollTrigger.hideTrigger();
  }
  return { render, replaceChildren };
}
async function submitEvent(movieLayout) {
  document.addEventListener("submit", onSubmit.bind(this));
  async function getSearchData(event, form) {
    event.preventDefault();
    const formData = new FormData(form);
    const searchKeyword = String(formData.get("searchInput"));
    const { results: searchData, total_pages } = await fetchSearchMovies(1, searchKeyword);
    movieLayout.replaceChildren({
      title: `"${searchKeyword}" 검색 결과`,
      movieData: searchData,
      isPossibleMore: searchData.length === 20,
      searchKeyword,
      totalPages: total_pages
    });
  }
  async function onSubmit(event) {
    var _a;
    event.preventDefault();
    const form = event.target;
    if (!form) return;
    if (form.id === "searchForm") {
      await getSearchData(event, form);
    }
    (_a = document.getElementById("bannerSection")) == null ? void 0 : _a.setAttribute("style", "display: none");
    window.scrollTo({ top: 0, behavior: "smooth" });
    form.reset();
  }
}
function Button({ content, ...rest }) {
  const attributes = Object.entries(rest).map(([key, value]) => `${key}="${value}"`).join(" ");
  return `
        <button class="primary detail" ${attributes}>${content}</button>
    `;
}
function Banner(data) {
  return `
    <div class="background-container" style="background-image: url('./images/banner_poster_insideout2.jpg');">
        <div class="overlay" aria-hidden="true"></div>
          <div class="top-rated-movie">
            <div class="banner-logo-box">
              <img src="./images/banner_logo_insideout2.png" />
            </div>
            <div class="rate">
              <img src="./images/star_empty.png" class="star" />
              <span class="rate-value">7.6</span>
            </div>
            <div class="title">인사이드 아웃2</div>

            ${Button({ content: "자세히 보기", class: "primary detail", style: "width: 120px;" })}
            
          </div>
        </div>
      </div>
    `;
}
(async () => {
  history.scrollRestoration = "manual";
  const movieData = await fetchPopularMovies(1);
  const movieLayout = MovieLayout(movieData.results);
  const bannerElement = document.getElementById("bannerSection");
  if (bannerElement) bannerElement.innerHTML = Banner(movieData.results[0]);
  await submitEvent(movieLayout);
  Header();
  window.addEventListener("scroll", () => {
    const headerBack = document.querySelector("#headerBackground");
    if (!headerBack) return;
    if (window.scrollY > 400) {
      headerBack.classList.add("scrolled");
    } else {
      headerBack.classList.remove("scrolled");
    }
  });
})();
