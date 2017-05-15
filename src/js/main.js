// import _ from 'lodash';
import * as htmlHelpers from './htmlHelpers';

/* function testLodash() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Message', 'joined', 'by', 'lodash'], ' ');

  return element;
}*/

window.onload = htmlHelpers.createHtmlTags;
window.addEventListener('resize', htmlHelpers.checkAmountOfButtons, true);
