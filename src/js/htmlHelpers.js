import * as youtubeApi from './youtubeApi';

const searchInput = document.createElement('input');
const spinner = document.createElement('span');
export const wrapperForListOfVideos = document.createElement('main');
export const swipeContainerForVideos = document.createElement('ul');
const swipeContainerForPages = document.createElement('ul');

const maxValueLengthInMessage = 38;
let lastSearchInputValue = '';

let currentAmountOfVideoLinks = 0;
let lastWidthOfWrapperForListOfVideos;
let currentActivePage;
let lastTranslateValueForVideoList = 0;
let lastTranslateValueForPagination = 0;

export function moveActiveButtonToCenter() {
  console.log(`html helpers translate ${lastTranslateValueForVideoList}`);
  const paginationWidth = swipeContainerForPages.getBoundingClientRect()
        .width;
  const leftOffsetActivePage = currentActivePage.getBoundingClientRect()
        .left;
  console.log(`htmlHelpers id ${currentActivePage.id}`);
  if (leftOffsetActivePage >= 0) {
    if (leftOffsetActivePage <= paginationWidth / 2) {
      lastTranslateValueForPagination += (paginationWidth / 2) - leftOffsetActivePage - 15;
    } else {
      lastTranslateValueForPagination -= ((leftOffsetActivePage - (paginationWidth / 2)) + 15);
    }
  } else {
    lastTranslateValueForPagination += ((paginationWidth / 2) + Math.abs(leftOffsetActivePage)) - 15;
  }
  swipeContainerForPages.style.transform = `translateX(${lastTranslateValueForPagination}px)`;
}

//* ************************************************************************************************
// SWIPE LOGIC START
let quickSwipeCanBeMade = false;
let mouseDownNow = false;
let itIsSwipe = false;
let quickSwipeTimeout;
let previousMousePointerLeftOffset;
let videoListStartTransformState;
let disabledLinkToVideo;

function disableQuickSwipe() {
  quickSwipeCanBeMade = false;
}

function mouseDownEventHandler(event) {
  console.log(event);
  if (event.type == 'touchstart' || event.buttons === 1) {
    console.log('mouseDownEventHandler');
    previousMousePointerLeftOffset = -1;
    mouseDownNow = true;
    if (event.type == 'touchstart') {
      event.touches[0].target.setAttribute('draggable', false);
      event.touches[0].target.parentElement.setAttribute('draggable', false);
    } else {
      event.target.setAttribute('draggable', false);
      event.target.parentElement.setAttribute('draggable', false);
    }
  }
}

function mouseMoveEventHandler(event) {
  if (mouseDownNow) {
    if (previousMousePointerLeftOffset == -1) {
      if (event.type == 'touchmove') {
        console.log(event);
        previousMousePointerLeftOffset = event.touches[0].clientX;
      } else {
        previousMousePointerLeftOffset = event.clientX;
      }
      swipeContainerForVideos.style.transitionDuration = '0s';
      videoListStartTransformState = lastTranslateValueForVideoList;
      itIsSwipe = true;
      quickSwipeCanBeMade = true;
      quickSwipeTimeout = setTimeout(disableQuickSwipe, 1000);

      if (event.type == 'touchmove') {
        if (event.touches[0].target.parentElement.nodeName == 'A') {
          disabledLinkToVideo = event.touches[0].target.parentElement;
          event.touches[0].target.parentElement.classList.add('disabled');
        }
      } else if (event.target.parentElement.nodeName == 'A') {
        disabledLinkToVideo = event.target.parentElement;
        event.target.parentElement.classList.add('disabled');
      }
    }
    if (event.type == 'touchmove') {
      if (previousMousePointerLeftOffset < event.touches[0].clientX) {
        lastTranslateValueForVideoList += (event.touches[0].clientX - previousMousePointerLeftOffset);
      } else {
        lastTranslateValueForVideoList -= (previousMousePointerLeftOffset - event.touches[0].clientX);
      }
    } else if (previousMousePointerLeftOffset < event.clientX) {
      lastTranslateValueForVideoList += (event.clientX - previousMousePointerLeftOffset);
    } else {
      lastTranslateValueForVideoList -= (previousMousePointerLeftOffset - event.clientX);
    }

    swipeContainerForVideos.style.transform = `translateX(${lastTranslateValueForVideoList}px)`;
    if (event.type == 'touchmove') {
      previousMousePointerLeftOffset = event.touches[0].clientX;
    } else {
      previousMousePointerLeftOffset = event.clientX;
    }
  }
}

function disableSwipe(event) {
  if (itIsSwipe) {
    if (disabledLinkToVideo) {
      disabledLinkToVideo.classList.remove('disabled');
    }
    disabledLinkToVideo = undefined;
    itIsSwipe = false;
    mouseDownNow = false;
    previousMousePointerLeftOffset = undefined;

    swipeContainerForVideos.style.transitionDuration = '500ms';
    const differenceBetweenTransitions = Math.abs(Math.abs(videoListStartTransformState) - Math.abs(lastTranslateValueForVideoList));
    if (differenceBetweenTransitions >= (wrapperForListOfVideos.getBoundingClientRect()
                .width) / 2) {
      let newActivePage;
      const currentActivePageNumber = Number(currentActivePage.id.split('_')[1]);
      console.log('new active page value:');
      if (videoListStartTransformState > lastTranslateValueForVideoList) {
        lastTranslateValueForVideoList -= ((wrapperForListOfVideos.getBoundingClientRect()
                    .width + 20) - differenceBetweenTransitions);
        newActivePage = document.querySelector(`#page_${currentActivePageNumber + 1}`);
        console.log(newActivePage);
      } else if (videoListStartTransformState != 0) {
        lastTranslateValueForVideoList += ((wrapperForListOfVideos.getBoundingClientRect()
                    .width + 20) - differenceBetweenTransitions);
        newActivePage = document.querySelector(`#page_${currentActivePageNumber - 1}`);
        console.log(newActivePage);
      } else {
        lastTranslateValueForVideoList = videoListStartTransformState;
      }
      if (newActivePage) {
        newActivePage.classList.add('active');
        currentActivePage.classList.remove('active');
        console.log(`old id ${currentActivePage.id}`);
        currentActivePage = newActivePage;
        console.log(`new id ${currentActivePage.id}`);
        moveActiveButtonToCenter();

        const fullAmountOfPages = Math.ceil(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect()
                    .width + 20) / 340));

        if (Number(currentActivePage.id.split('_')[1]) >= fullAmountOfPages - 1) {
          youtubeApi.getInfoAboutVideosByTitle(encodeURIComponent(lastSearchInputValue))
                        .then(youtubeApi.getStatisticsOnVideos)
                        .then(addNewVideosToSlider)
                        .then(createNewPages)
                        .catch(handleApiRequestFailure);
        }
      }
    } else {
      lastTranslateValueForVideoList = videoListStartTransformState;
    }
    console.log(`swipe helpers translate ${lastTranslateValueForVideoList}`);
    swipeContainerForVideos.style.transform = `translateX(${lastTranslateValueForVideoList}px)`;
  } else if (event.target.parentElement.nodeName == 'A') {
    mouseDownNow = false;
  }
}

function mouseUpEventHandler(event) {
  if (quickSwipeCanBeMade) {
    const differenceBetweenTransitions = Math.abs(Math.abs(videoListStartTransformState) - Math.abs(lastTranslateValueForVideoList));
    if (differenceBetweenTransitions >= 50) {
      if (disabledLinkToVideo) {
        disabledLinkToVideo.classList.remove('disabled');
      }
      disabledLinkToVideo = undefined;
      itIsSwipe = false;
      mouseDownNow = false;
      previousMousePointerLeftOffset = undefined;
      quickSwipeCanBeMade = false;
      clearTimeout(quickSwipeTimeout);

      swipeContainerForVideos.style.transitionDuration = '500ms';

      let newActivePage;
      const currentActivePageNumber = Number(currentActivePage.id.split('_')[1]);
      console.log('new active page value:');
      if (videoListStartTransformState > lastTranslateValueForVideoList) {
        lastTranslateValueForVideoList -= ((wrapperForListOfVideos.getBoundingClientRect()
                    .width + 20) - differenceBetweenTransitions);
        newActivePage = document.querySelector(`#page_${currentActivePageNumber + 1}`);
        console.log(newActivePage);
      } else if (videoListStartTransformState != 0) {
        lastTranslateValueForVideoList += ((wrapperForListOfVideos.getBoundingClientRect()
                    .width + 20) - differenceBetweenTransitions);
        newActivePage = document.querySelector(`#page_${currentActivePageNumber - 1}`);
        console.log(newActivePage);
      } else {
        lastTranslateValueForVideoList = videoListStartTransformState;
      }
      if (newActivePage) {
        newActivePage.classList.add('active');
        currentActivePage.classList.remove('active');
        console.log(`old id ${currentActivePage.id}`);
        currentActivePage = newActivePage;
        console.log(`new id ${currentActivePage.id}`);
        moveActiveButtonToCenter();

        const fullAmountOfPages = Math.ceil(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect()
                    .width + 20) / 340));

        if (Number(currentActivePage.id.split('_')[1]) >= fullAmountOfPages - 1) {
          youtubeApi.getInfoAboutVideosByTitle(encodeURIComponent(lastSearchInputValue))
                        .then(youtubeApi.getStatisticsOnVideos)
                        .then(addNewVideosToSlider)
                        .then(createNewPages)
                        .catch(handleApiRequestFailure);
        }
      }
      swipeContainerForVideos.style.transform = `translateX(${lastTranslateValueForVideoList}px)`;
    } else {
      disableSwipe(event);
    }
  } else {
    disableSwipe(event);
  }
}

function mouseLeaveEventHandler(event) {
  disableSwipe(event);
}
// SWIPE LOGIC END
//* ************************************************************************************************

function createMessageBlockNoVideosFound() {
  const messageBlock = document.createElement('div');
  messageBlock.classList.add('info-message');

  const infoParagraph = document.createElement('p');
  infoParagraph.innerHTML = 'No results for ';

  const requestValueText = document.createElement('b');

  requestValueText.innerHTML = lastSearchInputValue.slice(0, maxValueLengthInMessage + 1);
  if (lastSearchInputValue.length > maxValueLengthInMessage) {
    requestValueText.innerHTML += '...';
  }

  infoParagraph.appendChild(requestValueText);
  messageBlock.appendChild(infoParagraph);
  wrapperForListOfVideos.appendChild(messageBlock);
}

function createErrorMessageBlock(responseStatusInfo) {
  const messageBlock = document.createElement('div');
  messageBlock.classList.add('error-message');

  const errorParagraph = document.createElement('p');
  errorParagraph.innerHTML = 'Failed to get a list of videos from youtube!';

  const statusInfoParagraph = document.createElement('p');
  statusInfoParagraph.innerHTML = 'Response: ';

  const statusInfo = document.createElement('b');
  statusInfo.innerHTML = `${responseStatusInfo.status} ${responseStatusInfo.statusText}`;

  statusInfoParagraph.appendChild(statusInfo);
  messageBlock.appendChild(errorParagraph);
  messageBlock.appendChild(statusInfoParagraph);
  wrapperForListOfVideos.appendChild(messageBlock);
}

function handleApiRequestFailure(responseStatusInfo) {
  if (responseStatusInfo.status >= 200 && responseStatusInfo.status < 300) {
    createMessageBlockNoVideosFound();
  } else {
    createErrorMessageBlock(responseStatusInfo);
  }
}

function onDragStartEventHandler() {
  return false;
}

function addVideoInfoToSlider(foundVideo) {
  const newListElement = document.createElement('li');
  const newVideoSlide = document.createElement('article');
  const slideHeader = document.createElement('header');
  const imageLink = document.createElement('a');
  const preview = document.createElement('img');
  preview.addEventListener('dragstart', onDragStartEventHandler);
  imageLink.addEventListener('dragstart', onDragStartEventHandler);

  const thumbnailCaption = document.createElement('p');
  const description = document.createElement('p');

  const wrapperForAuthor = document.createElement('div');
  const authorIcon = document.createElement('span');
  const authorName = document.createElement('p');

  const wrapperForDate = document.createElement('div');
  const dateIcon = document.createElement('span');
  const date = document.createElement('time');

  const wrapperForViews = document.createElement('div');
  const viewsIcon = document.createElement('span');
  const views = document.createElement('time');

  wrapperForViews.classList.add('slide-content-wrapper');
  viewsIcon.classList.add('slide-icon-block', 'fa', 'fa-eye');
  views.classList.add('slide-content-for-icon');
  views.appendChild(document.createTextNode(foundVideo.statistics.viewCount));

  wrapperForAuthor.classList.add('slide-content-wrapper');
  authorIcon.classList.add('slide-icon-block', 'fa', 'fa-user');
  authorName.classList.add('slide-content-for-icon');
  authorName.appendChild(document.createTextNode(foundVideo.snippet.channelTitle));

  wrapperForDate.classList.add('slide-content-wrapper');
  dateIcon.classList.add('slide-icon-block', 'fa', 'fa-calendar');
  date.classList.add('slide-content-for-icon');
  date.appendChild(document.createTextNode(foundVideo.snippet.publishedAt.split('T')[0]));

  if (foundVideo.snippet.description.length > 200) {
    description.appendChild(document.createTextNode(`${foundVideo.snippet.description.slice(0, 200)
            }...`));
  } else {
    description.appendChild(document.createTextNode(foundVideo.snippet.description));
  }
  description.classList.add('video-description', 'slide-content-wrapper');

  newVideoSlide.classList.add('slide');

  imageLink.classList.add('thumbnail');

  thumbnailCaption.appendChild(document.createTextNode(foundVideo.snippet.title));
  thumbnailCaption.classList.add('caption');

  preview.setAttribute('src', foundVideo.snippet.thumbnails.medium.url);
  imageLink.setAttribute('href', `https://www.youtube.com/watch?v=${foundVideo.id}`);
  imageLink.setAttribute('target', 'blank');

  imageLink.appendChild(preview);
  imageLink.appendChild(thumbnailCaption);
  slideHeader.appendChild(imageLink);
  newVideoSlide.appendChild(slideHeader);

  wrapperForAuthor.appendChild(authorIcon);
  wrapperForAuthor.appendChild(authorName);

  wrapperForDate.appendChild(dateIcon);
  wrapperForDate.appendChild(date);

  wrapperForViews.appendChild(viewsIcon);
  wrapperForViews.appendChild(views);

  newVideoSlide.appendChild(wrapperForAuthor);
  newVideoSlide.appendChild(wrapperForDate);
  newVideoSlide.appendChild(wrapperForViews);
  newVideoSlide.appendChild(description);

  newListElement.appendChild(newVideoSlide);

  swipeContainerForVideos.appendChild(newListElement);
}

function addNewVideosToSlider(newVideoList) {
  newVideoList.items.forEach(addVideoInfoToSlider);
  return newVideoList.items.length;
}

function pageClickEventHandler() {
  if (currentActivePage.id !== this.id) {
    this.classList.add('active');
    currentActivePage.classList.remove('active');

    console.log(this.id.split('_')[1]);
    console.log(currentActivePage.id.split('_')[1]);
    console.log(wrapperForListOfVideos.getBoundingClientRect()
            .width);
    const pressedPageId = this.id.split('_')[1];
    const lastActivePageId = currentActivePage.id.split('_')[1];

    if (pressedPageId > lastActivePageId) {
      lastTranslateValueForVideoList -= ((wrapperForListOfVideos.getBoundingClientRect()
                .width + 20) * (pressedPageId - lastActivePageId));
    } else {
      lastTranslateValueForVideoList += ((wrapperForListOfVideos.getBoundingClientRect()
                .width + 20) * (lastActivePageId - pressedPageId));
    }
    swipeContainerForVideos.style.transform = `translateX(${lastTranslateValueForVideoList}px)`;
    console.log(swipeContainerForVideos.style);

    currentActivePage = this;
    moveActiveButtonToCenter();

    const fullAmountOfPages = Math.ceil(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect()
            .width + 20) / 340));

    if (Number(pressedPageId) >= fullAmountOfPages - 1) {
      youtubeApi.getInfoAboutVideosByTitle(encodeURIComponent(lastSearchInputValue))
                .then(youtubeApi.getStatisticsOnVideos)
                .then(addNewVideosToSlider)
                .then(createNewPages)
                .catch(handleApiRequestFailure);
    }
  }
}

function createNewPages(amountOfVideos) {
  const amountOfPagesCreatedAlready = Math.ceil(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect()
        .width + 20) / 340));
  const fullPagesAmount = Math.floor(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect()
        .width + 20) / 340));
  const emptySpaceLeft = (((wrapperForListOfVideos.getBoundingClientRect()
        .width + 20) / 340) * (fullPagesAmount + 1)) - currentAmountOfVideoLinks;

  currentAmountOfVideoLinks += amountOfVideos;
  if (emptySpaceLeft < (wrapperForListOfVideos.getBoundingClientRect()
            .width + 20) / 340) {
    amountOfVideos -= emptySpaceLeft;
  }

  const amountOfPages = Math.ceil(amountOfVideos / ((wrapperForListOfVideos.getBoundingClientRect()
        .width + 20) / 340));

  let newPage;
  for (let counter = amountOfPagesCreatedAlready + 1; counter <= amountOfPagesCreatedAlready + amountOfPages; ++counter) {
    newPage = document.createElement('li');
    newPage.classList.add('page');
    newPage.setAttribute('id', `page_${counter}`);
    newPage.appendChild(document.createTextNode(counter));
    newPage.addEventListener('click', pageClickEventHandler);
    swipeContainerForPages.appendChild(newPage);
  }
  if (!currentActivePage) {
    currentActivePage = document.querySelector('#page_1');
    currentActivePage.classList.add('active');
  }
  moveActiveButtonToCenter();
}

function searchButtonClickEventHandler() {
  if (!lastWidthOfWrapperForListOfVideos) {
    lastWidthOfWrapperForListOfVideos = wrapperForListOfVideos.getBoundingClientRect()
            .width;
  }

  currentActivePage = undefined;
  lastTranslateValueForVideoList = 0;
  currentAmountOfVideoLinks = 0;
  swipeContainerForVideos.style.transform = `translateX(${lastTranslateValueForVideoList}px)`;

  while (swipeContainerForVideos.firstChild) {
    swipeContainerForVideos.removeChild(swipeContainerForVideos.firstChild);
  }

  while (swipeContainerForPages.firstChild) {
    swipeContainerForPages.removeChild(swipeContainerForPages.firstChild);
  }

  const lastMessage = document.querySelector('.info-message, .error-message');
  if (lastMessage) {
    lastMessage.remove();
  }

  lastSearchInputValue = searchInput.value;
  spinner.style.display = 'block';

  youtubeApi.getInfoAboutVideosByTitle(encodeURIComponent(searchInput.value))
        .then(youtubeApi.getStatisticsOnVideos)
        .then(addNewVideosToSlider)
        .then(createNewPages)
        .catch(handleApiRequestFailure)
        .then(() => {
          spinner.style.display = 'none';
        });
}

function searchFormSubmitEventHandler(event) {
  event.preventDefault();
  searchButtonClickEventHandler();
  return false;
}

function createSearchForm() {
  searchInput.setAttribute('type', 'search');
  searchInput.setAttribute('placeholder', 'Search youtube video');
  searchInput.setAttribute('id', 'videoTitleInput');

  const searchForm = document.createElement('form');
  searchForm.classList.add('search-form');
  searchForm.addEventListener('submit', searchFormSubmitEventHandler);

  const searchButton = document.createElement('button');
  searchButton.setAttribute('type', 'button');
  searchButton.setAttribute('id', 'searchVideosButton');
  searchButton.addEventListener('click', searchButtonClickEventHandler);
  searchButton.classList.add('search-button');

  const searchIcon = document.createElement('span');
  searchIcon.classList.add('fa', 'fa-search');

  searchButton.appendChild(searchIcon);

  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchButton);

  document.body.appendChild(searchForm);
}

function createWrappersForListOfVideos() {
  swipeContainerForPages.classList.add('swipe-container');
  const pagingWrapper = document.createElement('div');
  pagingWrapper.classList.add('wrapper-for-pages');
  pagingWrapper.appendChild(swipeContainerForPages);

  spinner.classList.add('loader');
  spinner.style.display = 'none';

  wrapperForListOfVideos.classList.add('swipe-container-wrapper');
  wrapperForListOfVideos.appendChild(spinner);

  swipeContainerForVideos.classList.add('swipe-container');

  wrapperForListOfVideos.appendChild(swipeContainerForVideos);

  document.body.appendChild(wrapperForListOfVideos);
  document.body.appendChild(pagingWrapper);
}

export function checkAmountOfButtons() {
  if (currentActivePage) {
    console.log(`active button relative x position${currentActivePage.getBoundingClientRect()
            .left}`);
  }
  if (currentAmountOfVideoLinks > 0) {
    const currentWidthOfWrapperForListOfVideos = wrapperForListOfVideos.getBoundingClientRect()
            .width;
    if (lastWidthOfWrapperForListOfVideos != currentWidthOfWrapperForListOfVideos) {
      const newAmountOfPages = Math.ceil(currentAmountOfVideoLinks / ((currentWidthOfWrapperForListOfVideos + 20) / 340));
      while (swipeContainerForPages.firstChild) {
        swipeContainerForPages.removeChild(swipeContainerForPages.firstChild);
      }

      let newPage;
      for (let counter = 1; counter <= newAmountOfPages; ++counter) {
        newPage = document.createElement('li');
        newPage.classList.add('page');
        newPage.setAttribute('id', `page_${counter}`);
        newPage.appendChild(document.createTextNode(counter));
        newPage.addEventListener('click', pageClickEventHandler);
        swipeContainerForPages.appendChild(newPage);
      }

      const lastActivePageNumber = currentActivePage.id.split('_')[1];
      const leftVideoLinkNumber = (((lastWidthOfWrapperForListOfVideos + 20) / 340) * (lastActivePageNumber - 1)) + 1;
      const newActivePageNumber = Math.ceil(Math.round((leftVideoLinkNumber / ((currentWidthOfWrapperForListOfVideos + 20) / 340)) * 100) / 100);

      console.log(newActivePageNumber);
      currentActivePage = document.querySelector(`#page_${newActivePageNumber}`);
      currentActivePage.classList.add('active');
      console.log(currentActivePage);

      const expectedLeftLinkNumber = (((currentWidthOfWrapperForListOfVideos + 20) / 340) * (newActivePageNumber - 1)) + 1;
      if (expectedLeftLinkNumber > leftVideoLinkNumber) {
        lastTranslateValueForVideoList -= (340 * (expectedLeftLinkNumber - leftVideoLinkNumber));
      } else if (expectedLeftLinkNumber < leftVideoLinkNumber) {
        lastTranslateValueForVideoList += (340 * (leftVideoLinkNumber - expectedLeftLinkNumber));
      }
      swipeContainerForVideos.style.transform = `translateX(${lastTranslateValueForVideoList}px)`;

      lastWidthOfWrapperForListOfVideos = currentWidthOfWrapperForListOfVideos;
    }

    moveActiveButtonToCenter();
  }
}

export function createHtmlTags() {
  createSearchForm();
  createWrappersForListOfVideos();

  wrapperForListOfVideos.addEventListener('mousedown', mouseDownEventHandler);
  wrapperForListOfVideos.addEventListener('mouseleave', mouseLeaveEventHandler);
  wrapperForListOfVideos.addEventListener('mousemove', mouseMoveEventHandler);
  wrapperForListOfVideos.addEventListener('mouseup', mouseUpEventHandler);

  wrapperForListOfVideos.addEventListener('touchstart', mouseDownEventHandler);
  wrapperForListOfVideos.addEventListener('touchmove', mouseMoveEventHandler);
  wrapperForListOfVideos.addEventListener('touchend', mouseUpEventHandler);
  wrapperForListOfVideos.addEventListener('touchcancel', mouseUpEventHandler);
}
