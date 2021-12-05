// popup
var buttonModal = document.querySelectorAll('._popup-link');
var bodyModal = document.getElementById('body-modal');
var wrapperModal = document.getElementById('wrapper-modal');

buttonModal.forEach(function (item) {
  item.addEventListener('click', function () {
    bodyModal.style.display = 'block';
    wrapperModal.style.display = 'flex';
  });
});

wrapperModal.addEventListener('click', function () {
  bodyModal.style.display = 'none';
  wrapperModal.style.display = 'none';
});

// fixed button
let fixBox = document.querySelector(".header");

window.onscroll = function showHeader() {
  let clientHeight = document.querySelector('.opening').clientHeight;
  if (window.pageYOffset > clientHeight) {
    fixBox.classList.add("_fixed");
  } else {
    fixBox.classList.remove("_fixed");
  }
}
