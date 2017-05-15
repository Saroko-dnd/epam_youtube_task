import * as androidDetection from './androidDetection';

let currentNexPageToken = null;
let lastTitle;

export function getInfoAboutVideosByTitle(videoTitle) {
  return new Promise((onSuccess, onFailure) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function onLoadActions() {
      if (this.status >= 200 && this.status < 300) {
        const videoListResponse = JSON.parse(this.responseText);
        if (videoListResponse.items.length === 0) {
          onFailure({
            status: this.status,
            statusText: this.statusText,
          });
        } else {
          currentNexPageToken = videoListResponse.nextPageToken;
          onSuccess(videoListResponse);
        }
      } else {
        onFailure({
          status: this.status,
          statusText: this.statusText,
        });
      }
    };
    xhttp.onerror = function onErrorActions() {
      onFailure({
        status: this.status,
        statusText: this.statusText,
      });
    };
    if (androidDetection.itIsAndroid) {
      if (lastTitle != videoTitle) {
        lastTitle = videoTitle;
        xhttp.open('GET', `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAG65NBgtBm36CLYvhXtzoyU_aAdiI44Zk&type=video&part=snippet&maxResults=15&q=${
                  videoTitle}`, true);
      } else if (currentNexPageToken) {
        xhttp.open('GET', `https://www.googleapis.com/youtube/v3/search?pageToken=${currentNexPageToken
                    }&key=AIzaSyAG65NBgtBm36CLYvhXtzoyU_aAdiI44Zk&type=video&part=snippet&maxResults=15&q=${
                    videoTitle}`, true);
      }
    } else if (lastTitle != videoTitle) {
      lastTitle = videoTitle;
      xhttp.open('GET', `https://www.googleapis.com/youtube/v3/search?key=AIzaSyA06IwAD5daLrNX8nlaZiIQE_RMwMF-sCA&type=video&part=snippet&maxResults=15&q=${
                  videoTitle}`, true);
    } else if (currentNexPageToken) {
      xhttp.open('GET', `https://www.googleapis.com/youtube/v3/search?pageToken=${currentNexPageToken
                    }&key=AIzaSyA06IwAD5daLrNX8nlaZiIQE_RMwMF-sCA&type=video&part=snippet&maxResults=15&q=${
                    videoTitle}`, true);
    }
    xhttp.send();
  });
}

export function getStatisticsOnVideos(videoList) {
  const arrayOfVideoIds = videoList.items.map(foundVideoInfo => foundVideoInfo.id.videoId);
  return new Promise((onSuccess, onFailure) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function onLoadActions() {
      if (this.status >= 200 && this.status < 300) {
        const videoListResponse = JSON.parse(this.responseText);
        console.log(this.status);
        console.log(this.statusText);
        console.log(videoListResponse);
        videoListResponse.items.forEach((videoInfo) => {
          console.log(videoInfo.snippet.title);
          console.log(`views${videoInfo.statistics.viewCount}`);
        });
        onSuccess(videoListResponse);
      } else {
        onFailure({
          status: this.status,
          statusText: this.statusText,
        });
      }
    };
    xhttp.onerror = function onErrorActions() {
      onFailure({
        status: this.status,
        statusText: this.statusText,
      });
    };
    if (androidDetection.itIsAndroid) {
      xhttp.open('GET', `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAG65NBgtBm36CLYvhXtzoyU_aAdiI44Zk&id=${
                arrayOfVideoIds.join(',')}&part=snippet,statistics`, true);
    } else {
      xhttp.open('GET', `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyA06IwAD5daLrNX8nlaZiIQE_RMwMF-sCA&id=${
                arrayOfVideoIds.join(',')}&part=snippet,statistics`, true);
    }
    xhttp.send();
  });
}
