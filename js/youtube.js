/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.swipeContainerForVideos = exports.wrapperForListOfVideos = undefined;
exports.moveActiveButtonToCenter = moveActiveButtonToCenter;
exports.checkAmountOfButtons = checkAmountOfButtons;
exports.createHtmlTags = createHtmlTags;

var _youtubeApi = __webpack_require__(3);

var youtubeApi = _interopRequireWildcard(_youtubeApi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var searchInput = document.createElement('input');
var spinner = document.createElement('span');
var wrapperForListOfVideos = exports.wrapperForListOfVideos = document.createElement('main');
var swipeContainerForVideos = exports.swipeContainerForVideos = document.createElement('ul');
var swipeContainerForPages = document.createElement('ul');

var maxValueLengthInMessage = 38;
var lastSearchInputValue = '';

var currentAmountOfVideoLinks = 0;
var lastWidthOfWrapperForListOfVideos = void 0;
var currentActivePage = void 0;
var lastTranslateValueForVideoList = 0;
var lastTranslateValueForPagination = 0;

function moveActiveButtonToCenter() {
  console.log('html helpers translate ' + lastTranslateValueForVideoList);
  var paginationWidth = swipeContainerForPages.getBoundingClientRect().width;
  var leftOffsetActivePage = currentActivePage.getBoundingClientRect().left;
  console.log('htmlHelpers id ' + currentActivePage.id);
  if (leftOffsetActivePage >= 0) {
    if (leftOffsetActivePage <= paginationWidth / 2) {
      lastTranslateValueForPagination += paginationWidth / 2 - leftOffsetActivePage - 15;
    } else {
      lastTranslateValueForPagination -= leftOffsetActivePage - paginationWidth / 2 + 15;
    }
  } else {
    lastTranslateValueForPagination += paginationWidth / 2 + Math.abs(leftOffsetActivePage) - 15;
  }
  swipeContainerForPages.style.transform = 'translateX(' + lastTranslateValueForPagination + 'px)';
}

//* ************************************************************************************************
// SWIPE LOGIC START
var quickSwipeCanBeMade = false;
var mouseDownNow = false;
var itIsSwipe = false;
var quickSwipeTimeout = void 0;
var previousMousePointerLeftOffset = void 0;
var videoListStartTransformState = void 0;
var disabledLinkToVideo = void 0;

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
        lastTranslateValueForVideoList += event.touches[0].clientX - previousMousePointerLeftOffset;
      } else {
        lastTranslateValueForVideoList -= previousMousePointerLeftOffset - event.touches[0].clientX;
      }
    } else if (previousMousePointerLeftOffset < event.clientX) {
      lastTranslateValueForVideoList += event.clientX - previousMousePointerLeftOffset;
    } else {
      lastTranslateValueForVideoList -= previousMousePointerLeftOffset - event.clientX;
    }

    swipeContainerForVideos.style.transform = 'translateX(' + lastTranslateValueForVideoList + 'px)';
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
    var differenceBetweenTransitions = Math.abs(Math.abs(videoListStartTransformState) - Math.abs(lastTranslateValueForVideoList));
    if (differenceBetweenTransitions >= wrapperForListOfVideos.getBoundingClientRect().width / 2) {
      var newActivePage = void 0;
      var currentActivePageNumber = Number(currentActivePage.id.split('_')[1]);
      console.log('new active page value:');
      if (videoListStartTransformState > lastTranslateValueForVideoList) {
        lastTranslateValueForVideoList -= wrapperForListOfVideos.getBoundingClientRect().width + 20 - differenceBetweenTransitions;
        newActivePage = document.querySelector('#page_' + (currentActivePageNumber + 1));
        console.log(newActivePage);
      } else if (videoListStartTransformState != 0) {
        lastTranslateValueForVideoList += wrapperForListOfVideos.getBoundingClientRect().width + 20 - differenceBetweenTransitions;
        newActivePage = document.querySelector('#page_' + (currentActivePageNumber - 1));
        console.log(newActivePage);
      } else {
        lastTranslateValueForVideoList = videoListStartTransformState;
      }
      if (newActivePage) {
        newActivePage.classList.add('active');
        currentActivePage.classList.remove('active');
        console.log('old id ' + currentActivePage.id);
        currentActivePage = newActivePage;
        console.log('new id ' + currentActivePage.id);
        moveActiveButtonToCenter();

        var fullAmountOfPages = Math.ceil(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect().width + 20) / 340));

        if (Number(currentActivePage.id.split('_')[1]) >= fullAmountOfPages - 1) {
          youtubeApi.getInfoAboutVideosByTitle(encodeURIComponent(lastSearchInputValue)).then(youtubeApi.getStatisticsOnVideos).then(addNewVideosToSlider).then(createNewPages).catch(handleApiRequestFailure);
        }
      }
    } else {
      lastTranslateValueForVideoList = videoListStartTransformState;
    }
    console.log('swipe helpers translate ' + lastTranslateValueForVideoList);
    swipeContainerForVideos.style.transform = 'translateX(' + lastTranslateValueForVideoList + 'px)';
  } else if (event.target.parentElement.nodeName == 'A') {
    mouseDownNow = false;
  }
}

function mouseUpEventHandler(event) {
  if (quickSwipeCanBeMade) {
    var differenceBetweenTransitions = Math.abs(Math.abs(videoListStartTransformState) - Math.abs(lastTranslateValueForVideoList));
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

      var newActivePage = void 0;
      var currentActivePageNumber = Number(currentActivePage.id.split('_')[1]);
      console.log('new active page value:');
      if (videoListStartTransformState > lastTranslateValueForVideoList) {
        lastTranslateValueForVideoList -= wrapperForListOfVideos.getBoundingClientRect().width + 20 - differenceBetweenTransitions;
        newActivePage = document.querySelector('#page_' + (currentActivePageNumber + 1));
        console.log(newActivePage);
      } else if (videoListStartTransformState != 0) {
        lastTranslateValueForVideoList += wrapperForListOfVideos.getBoundingClientRect().width + 20 - differenceBetweenTransitions;
        newActivePage = document.querySelector('#page_' + (currentActivePageNumber - 1));
        console.log(newActivePage);
      } else {
        lastTranslateValueForVideoList = videoListStartTransformState;
      }
      if (newActivePage) {
        newActivePage.classList.add('active');
        currentActivePage.classList.remove('active');
        console.log('old id ' + currentActivePage.id);
        currentActivePage = newActivePage;
        console.log('new id ' + currentActivePage.id);
        moveActiveButtonToCenter();

        var fullAmountOfPages = Math.ceil(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect().width + 20) / 340));

        if (Number(currentActivePage.id.split('_')[1]) >= fullAmountOfPages - 1) {
          youtubeApi.getInfoAboutVideosByTitle(encodeURIComponent(lastSearchInputValue)).then(youtubeApi.getStatisticsOnVideos).then(addNewVideosToSlider).then(createNewPages).catch(handleApiRequestFailure);
        }
      }
      swipeContainerForVideos.style.transform = 'translateX(' + lastTranslateValueForVideoList + 'px)';
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
  var messageBlock = document.createElement('div');
  messageBlock.classList.add('info-message');

  var infoParagraph = document.createElement('p');
  infoParagraph.innerHTML = 'No results for ';

  var requestValueText = document.createElement('b');

  requestValueText.innerHTML = lastSearchInputValue.slice(0, maxValueLengthInMessage + 1);
  if (lastSearchInputValue.length > maxValueLengthInMessage) {
    requestValueText.innerHTML += '...';
  }

  infoParagraph.appendChild(requestValueText);
  messageBlock.appendChild(infoParagraph);
  wrapperForListOfVideos.appendChild(messageBlock);
}

function createErrorMessageBlock(responseStatusInfo) {
  var messageBlock = document.createElement('div');
  messageBlock.classList.add('error-message');

  var errorParagraph = document.createElement('p');
  errorParagraph.innerHTML = 'Failed to get a list of videos from youtube!';

  var statusInfoParagraph = document.createElement('p');
  statusInfoParagraph.innerHTML = 'Response: ';

  var statusInfo = document.createElement('b');
  statusInfo.innerHTML = responseStatusInfo.status + ' ' + responseStatusInfo.statusText;

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
  var newListElement = document.createElement('li');
  var newVideoSlide = document.createElement('article');
  var slideHeader = document.createElement('header');
  var imageLink = document.createElement('a');
  var preview = document.createElement('img');
  preview.addEventListener('dragstart', onDragStartEventHandler);
  imageLink.addEventListener('dragstart', onDragStartEventHandler);

  var thumbnailCaption = document.createElement('p');
  var description = document.createElement('p');

  var wrapperForAuthor = document.createElement('div');
  var authorIcon = document.createElement('span');
  var authorName = document.createElement('p');

  var wrapperForDate = document.createElement('div');
  var dateIcon = document.createElement('span');
  var date = document.createElement('time');

  var wrapperForViews = document.createElement('div');
  var viewsIcon = document.createElement('span');
  var views = document.createElement('time');

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
    description.appendChild(document.createTextNode(foundVideo.snippet.description.slice(0, 200) + '...'));
  } else {
    description.appendChild(document.createTextNode(foundVideo.snippet.description));
  }
  description.classList.add('video-description', 'slide-content-wrapper');

  newVideoSlide.classList.add('slide');

  imageLink.classList.add('thumbnail');

  thumbnailCaption.appendChild(document.createTextNode(foundVideo.snippet.title));
  thumbnailCaption.classList.add('caption');

  preview.setAttribute('src', foundVideo.snippet.thumbnails.medium.url);
  imageLink.setAttribute('href', 'https://www.youtube.com/watch?v=' + foundVideo.id);
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
    console.log(wrapperForListOfVideos.getBoundingClientRect().width);
    var pressedPageId = this.id.split('_')[1];
    var lastActivePageId = currentActivePage.id.split('_')[1];

    if (pressedPageId > lastActivePageId) {
      lastTranslateValueForVideoList -= (wrapperForListOfVideos.getBoundingClientRect().width + 20) * (pressedPageId - lastActivePageId);
    } else {
      lastTranslateValueForVideoList += (wrapperForListOfVideos.getBoundingClientRect().width + 20) * (lastActivePageId - pressedPageId);
    }
    swipeContainerForVideos.style.transform = 'translateX(' + lastTranslateValueForVideoList + 'px)';
    console.log(swipeContainerForVideos.style);

    currentActivePage = this;
    moveActiveButtonToCenter();

    var fullAmountOfPages = Math.ceil(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect().width + 20) / 340));

    if (Number(pressedPageId) >= fullAmountOfPages - 1) {
      youtubeApi.getInfoAboutVideosByTitle(encodeURIComponent(lastSearchInputValue)).then(youtubeApi.getStatisticsOnVideos).then(addNewVideosToSlider).then(createNewPages).catch(handleApiRequestFailure);
    }
  }
}

function createNewPages(amountOfVideos) {
  var amountOfPagesCreatedAlready = Math.ceil(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect().width + 20) / 340));
  var fullPagesAmount = Math.floor(currentAmountOfVideoLinks / ((wrapperForListOfVideos.getBoundingClientRect().width + 20) / 340));
  var emptySpaceLeft = (wrapperForListOfVideos.getBoundingClientRect().width + 20) / 340 * (fullPagesAmount + 1) - currentAmountOfVideoLinks;

  currentAmountOfVideoLinks += amountOfVideos;
  if (emptySpaceLeft < (wrapperForListOfVideos.getBoundingClientRect().width + 20) / 340) {
    amountOfVideos -= emptySpaceLeft;
  }

  var amountOfPages = Math.ceil(amountOfVideos / ((wrapperForListOfVideos.getBoundingClientRect().width + 20) / 340));

  var newPage = void 0;
  for (var counter = amountOfPagesCreatedAlready + 1; counter <= amountOfPagesCreatedAlready + amountOfPages; ++counter) {
    newPage = document.createElement('li');
    newPage.classList.add('page');
    newPage.setAttribute('id', 'page_' + counter);
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
    lastWidthOfWrapperForListOfVideos = wrapperForListOfVideos.getBoundingClientRect().width;
  }

  currentActivePage = undefined;
  lastTranslateValueForVideoList = 0;
  currentAmountOfVideoLinks = 0;
  swipeContainerForVideos.style.transform = 'translateX(' + lastTranslateValueForVideoList + 'px)';

  while (swipeContainerForVideos.firstChild) {
    swipeContainerForVideos.removeChild(swipeContainerForVideos.firstChild);
  }

  while (swipeContainerForPages.firstChild) {
    swipeContainerForPages.removeChild(swipeContainerForPages.firstChild);
  }

  var lastMessage = document.querySelector('.info-message, .error-message');
  if (lastMessage) {
    lastMessage.remove();
  }

  lastSearchInputValue = searchInput.value;
  spinner.style.display = 'block';

  youtubeApi.getInfoAboutVideosByTitle(encodeURIComponent(searchInput.value)).then(youtubeApi.getStatisticsOnVideos).then(addNewVideosToSlider).then(createNewPages).catch(handleApiRequestFailure).then(function () {
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

  var searchForm = document.createElement('form');
  searchForm.classList.add('search-form');
  searchForm.addEventListener('submit', searchFormSubmitEventHandler);

  var searchButton = document.createElement('button');
  searchButton.setAttribute('type', 'button');
  searchButton.setAttribute('id', 'searchVideosButton');
  searchButton.addEventListener('click', searchButtonClickEventHandler);
  searchButton.classList.add('search-button');

  var searchIcon = document.createElement('span');
  searchIcon.classList.add('fa', 'fa-search');

  searchButton.appendChild(searchIcon);

  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchButton);

  document.body.appendChild(searchForm);
}

function createWrappersForListOfVideos() {
  swipeContainerForPages.classList.add('swipe-container');
  var pagingWrapper = document.createElement('div');
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

function checkAmountOfButtons() {
  if (currentActivePage) {
    console.log('active button relative x position' + currentActivePage.getBoundingClientRect().left);
  }
  if (currentAmountOfVideoLinks > 0) {
    var currentWidthOfWrapperForListOfVideos = wrapperForListOfVideos.getBoundingClientRect().width;
    if (lastWidthOfWrapperForListOfVideos != currentWidthOfWrapperForListOfVideos) {
      var newAmountOfPages = Math.ceil(currentAmountOfVideoLinks / ((currentWidthOfWrapperForListOfVideos + 20) / 340));
      while (swipeContainerForPages.firstChild) {
        swipeContainerForPages.removeChild(swipeContainerForPages.firstChild);
      }

      var newPage = void 0;
      for (var counter = 1; counter <= newAmountOfPages; ++counter) {
        newPage = document.createElement('li');
        newPage.classList.add('page');
        newPage.setAttribute('id', 'page_' + counter);
        newPage.appendChild(document.createTextNode(counter));
        newPage.addEventListener('click', pageClickEventHandler);
        swipeContainerForPages.appendChild(newPage);
      }

      var lastActivePageNumber = currentActivePage.id.split('_')[1];
      var leftVideoLinkNumber = (lastWidthOfWrapperForListOfVideos + 20) / 340 * (lastActivePageNumber - 1) + 1;
      var newActivePageNumber = Math.ceil(Math.round(leftVideoLinkNumber / ((currentWidthOfWrapperForListOfVideos + 20) / 340) * 100) / 100);

      console.log(newActivePageNumber);
      currentActivePage = document.querySelector('#page_' + newActivePageNumber);
      currentActivePage.classList.add('active');
      console.log(currentActivePage);

      var expectedLeftLinkNumber = (currentWidthOfWrapperForListOfVideos + 20) / 340 * (newActivePageNumber - 1) + 1;
      if (expectedLeftLinkNumber > leftVideoLinkNumber) {
        lastTranslateValueForVideoList -= 340 * (expectedLeftLinkNumber - leftVideoLinkNumber);
      } else if (expectedLeftLinkNumber < leftVideoLinkNumber) {
        lastTranslateValueForVideoList += 340 * (leftVideoLinkNumber - expectedLeftLinkNumber);
      }
      swipeContainerForVideos.style.transform = 'translateX(' + lastTranslateValueForVideoList + 'px)';

      lastWidthOfWrapperForListOfVideos = currentWidthOfWrapperForListOfVideos;
    }

    moveActiveButtonToCenter();
  }
}

function createHtmlTags() {
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function isAndroid() {
  var userAgentList = navigator.userAgent.toLowerCase();
  if (userAgentList.indexOf('android') > -1) {
    return true;
  }
  return false;
}

var itIsAndroid = exports.itIsAndroid = isAndroid();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _htmlHelpers = __webpack_require__(0);

var htmlHelpers = _interopRequireWildcard(_htmlHelpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* function testLodash() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Message', 'joined', 'by', 'lodash'], ' ');

  return element;
}*/

window.onload = htmlHelpers.createHtmlTags; // import _ from 'lodash';

window.addEventListener('resize', htmlHelpers.checkAmountOfButtons, true);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInfoAboutVideosByTitle = getInfoAboutVideosByTitle;
exports.getStatisticsOnVideos = getStatisticsOnVideos;

var _androidDetection = __webpack_require__(1);

var androidDetection = _interopRequireWildcard(_androidDetection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var currentNexPageToken = null;
var lastTitle = void 0;

function getInfoAboutVideosByTitle(videoTitle) {
  return new Promise(function (onSuccess, onFailure) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function onLoadActions() {
      if (this.status >= 200 && this.status < 300) {
        var videoListResponse = JSON.parse(this.responseText);
        if (videoListResponse.items.length === 0) {
          onFailure({
            status: this.status,
            statusText: this.statusText
          });
        } else {
          currentNexPageToken = videoListResponse.nextPageToken;
          onSuccess(videoListResponse);
        }
      } else {
        onFailure({
          status: this.status,
          statusText: this.statusText
        });
      }
    };
    xhttp.onerror = function onErrorActions() {
      onFailure({
        status: this.status,
        statusText: this.statusText
      });
    };
    if (androidDetection.itIsAndroid) {
      if (lastTitle != videoTitle) {
        lastTitle = videoTitle;
        xhttp.open('GET', 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyAG65NBgtBm36CLYvhXtzoyU_aAdiI44Zk&type=video&part=snippet&maxResults=15&q=' + videoTitle, true);
      } else if (currentNexPageToken) {
        xhttp.open('GET', 'https://www.googleapis.com/youtube/v3/search?pageToken=' + currentNexPageToken + '&key=AIzaSyAG65NBgtBm36CLYvhXtzoyU_aAdiI44Zk&type=video&part=snippet&maxResults=15&q=' + videoTitle, true);
      }
    } else if (lastTitle != videoTitle) {
      lastTitle = videoTitle;
      xhttp.open('GET', 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyA06IwAD5daLrNX8nlaZiIQE_RMwMF-sCA&type=video&part=snippet&maxResults=15&q=' + videoTitle, true);
    } else if (currentNexPageToken) {
      xhttp.open('GET', 'https://www.googleapis.com/youtube/v3/search?pageToken=' + currentNexPageToken + '&key=AIzaSyA06IwAD5daLrNX8nlaZiIQE_RMwMF-sCA&type=video&part=snippet&maxResults=15&q=' + videoTitle, true);
    }
    xhttp.send();
  });
}

function getStatisticsOnVideos(videoList) {
  var arrayOfVideoIds = videoList.items.map(function (foundVideoInfo) {
    return foundVideoInfo.id.videoId;
  });
  return new Promise(function (onSuccess, onFailure) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function onLoadActions() {
      if (this.status >= 200 && this.status < 300) {
        var videoListResponse = JSON.parse(this.responseText);
        console.log(this.status);
        console.log(this.statusText);
        console.log(videoListResponse);
        videoListResponse.items.forEach(function (videoInfo) {
          console.log(videoInfo.snippet.title);
          console.log('views' + videoInfo.statistics.viewCount);
        });
        onSuccess(videoListResponse);
      } else {
        onFailure({
          status: this.status,
          statusText: this.statusText
        });
      }
    };
    xhttp.onerror = function onErrorActions() {
      onFailure({
        status: this.status,
        statusText: this.statusText
      });
    };
    if (androidDetection.itIsAndroid) {
      xhttp.open('GET', 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAG65NBgtBm36CLYvhXtzoyU_aAdiI44Zk&id=' + arrayOfVideoIds.join(',') + '&part=snippet,statistics', true);
    } else {
      xhttp.open('GET', 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyA06IwAD5daLrNX8nlaZiIQE_RMwMF-sCA&id=' + arrayOfVideoIds.join(',') + '&part=snippet,statistics', true);
    }
    xhttp.send();
  });
}

/***/ })
/******/ ]);