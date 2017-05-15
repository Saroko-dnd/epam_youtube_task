function isAndroid() {
  const userAgentList = navigator.userAgent.toLowerCase();
  if (userAgentList.indexOf('android') > -1) {
    return true;
  }
  return false;
}

export const itIsAndroid = isAndroid();
