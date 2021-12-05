function email_test(input) {
  return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  }, BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  }, iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }, Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  }, Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  }, any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

function isIE() {
  ua = navigator.userAgent;
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  return is_ie;
}

if (isIE()) {
  document.querySelector('html').classList.add('ie');
}
if (isMobile.any()) {
  document.querySelector('html').classList.add('_touch');
}

// Получить цифры из строки
//parseInt(itemContactpagePhone.replace(/[^\d]/g, ''))

function testWebP(callback) {
  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  if (support === true) {
    document.querySelector('html').classList.add('_webp');
  } else {
    document.querySelector('html').classList.add('_no-webp');
  }
});

window.addEventListener("load", function () {
  if (document.querySelector('.wrapper')) {
    setTimeout(function () {
      document.querySelector('.wrapper').classList.add('_loaded');
    }, 0);
  }
});

let unlock = true;

//========================================
//Wrap
function _wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

//========================================
//RemoveClasses
function _removeClasses(el, class_name) {
  for (var i = 0; i < el.length; i++) {
    el[i].classList.remove(class_name);
  }
}

//========================================
//IsHidden
function _is_hidden(el) {
  return (el.offsetParent === null)
}

//Полифилы
(function () {
  // проверяем поддержку
  if (!Element.prototype.closest) {
    // реализуем
    Element.prototype.closest = function (css) {
      var node = this;
      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }
})();
(function () {
  // проверяем поддержку
  if (!Element.prototype.matches) {
    // определяем свойство
    Element.prototype.matches = Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }
})();

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
let fixBtn = document.querySelector(".opening__btn");
let fixBox = document.querySelector(".header");
let boxBtn = document.querySelector(".opening__content");

window.onscroll = function showHeader() {
  let clientHeight = document.querySelector('.opening').clientHeight;
  if (window.pageYOffset > clientHeight) {
    fixBox.classList.add("_fixed");
  } else {
    fixBox.classList.remove("_fixed");
  }
}

//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
  for (let index = 0; index < forms.length; index++) {
    const el = forms[index];
    el.addEventListener('submit', form_submit);
  }
}

async function form_submit(e) {
  let btn = e.target;
  let form = btn.closest('form');
  let error = form_validate(form);
  if (error == 0) {
    let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
    let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
    const message = form.getAttribute('data-message');
    const ajax = form.getAttribute('data-ajax');

    //SendForm
    if (ajax) {
      e.preventDefault();
      let formData = new FormData(form);
      form.classList.add('_sending');
      let response = await fetch(formAction, {
        method: formMethod,
        body: formData
      });
      if (response.ok) {
        let result = await response.json();
        form.classList.remove('_sending');
        if (message) {
          popup_open(message + '-message');
        }
        form_clean(form);
      } else {
        alert("Ошибка");
        form.classList.remove('_sending');
      }
    }
    // If test
    if (form.hasAttribute('data-test')) {
      e.preventDefault();
      if (message) {
        popup_open(message + '-message');
      }
      form_clean(form);
    }
  } else {
    let form_error = form.querySelectorAll('._error');
    if (form_error && form.classList.contains('_goto-error')) {
      _goto(form_error[0], 1000, 50);
    }
    e.preventDefault();
  }
}

function form_validate(form) {
  let error = 0;
  let form_req = form.querySelectorAll('._req');
  if (form_req.length > 0) {
    for (let index = 0; index < form_req.length; index++) {
      const el = form_req[index];
      if (!_is_hidden(el)) {
        error += form_validate_input(el);
      }
    }
  }
  return error;
}

function form_validate_input(input) {
  let error = 0;
  let input_g_value = input.getAttribute('data-value');

  if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
    if (input.value != input_g_value) {
      let em = input.value.replace(" ", "");
      input.value = em;
    }
    if (email_test(input) || input.value == input_g_value) {
      form_add_error(input);
      error++;
    } else {
      form_remove_error(input);
    }
  } else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
    form_add_error(input);
    error++;
  } else {
    if (input.value == '' || input.value == input_g_value) {
      form_add_error(input);
      error++;
    } else {
      form_remove_error(input);
    }
  }
  return error;
}

function form_add_error(input) {
  input.classList.add('_error');
  input.parentElement.classList.add('_error');

  let input_error = input.parentElement.querySelector('.form__error');
  if (input_error) {
    input.parentElement.removeChild(input_error);
  }
  let input_error_text = input.getAttribute('data-error');
  if (input_error_text && input_error_text != '') {
    input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
  }
}

function form_remove_error(input) {
  input.classList.remove('_error');
  input.parentElement.classList.remove('_error');

  let input_error = input.parentElement.querySelector('.form__error');
  if (input_error) {
    input.parentElement.removeChild(input_error);
  }
}

function form_clean(form) {
  let inputs = form.querySelectorAll('input,textarea');
  for (let index = 0; index < inputs.length; index++) {
    const el = inputs[index];
    el.parentElement.classList.remove('_focus');
    el.classList.remove('_focus');
    el.value = el.getAttribute('data-value');
  }
  let checkboxes = form.querySelectorAll('.checkbox__input');
  if (checkboxes.length > 0) {
    for (let index = 0; index < checkboxes.length; index++) {
      const checkbox = checkboxes[index];
      checkbox.checked = false;
    }
  }
  let selects = form.querySelectorAll('select');
  if (selects.length > 0) {
    for (let index = 0; index < selects.length; index++) {
      const select = selects[index];
      const select_default_value = select.getAttribute('data-default');
      select.value = select_default_value;
      select_item(select);
    }
  }
}

//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
  if (inputs.length > 0) {
    for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index];
      const input_g_value = input.getAttribute('data-value');
      input_placeholder_add(input);
      if (input.value != '' && input.value != input_g_value) {
        input_focus_add(input);
      }
      input.addEventListener('focus', function (e) {
        if (input.value == input_g_value) {
          input_focus_add(input);
          input.value = '';
        }
        if (input.getAttribute('data-type') === "pass") {
          if (input.parentElement.querySelector('._viewpass')) {
            if (!input.parentElement.querySelector('._viewpass').classList.contains('_active')) {
              input.setAttribute('type', 'password');
            }
          } else {
            input.setAttribute('type', 'password');
          }
        }
        if (input.classList.contains('_date')) {
          /*
          input.classList.add('_mask');
          Inputmask("99.99.9999", {
            //"placeholder": '',
            clearIncomplete: true,
            clearMaskOnLostFocus: true,
            onincomplete: function () {
              input_clear_mask(input, input_g_value);
            }
          }).mask(input);
          */
        }
        if (input.classList.contains('_phone')) {
          //'+7(999) 999 9999'
          //'+38(999) 999 9999'
          //'+375(99)999-99-99'
          input.classList.add('_mask');
          Inputmask("+375 (99) 9999999", {
            //"placeholder": '',
            clearIncomplete: true,
            clearMaskOnLostFocus: true,
            onincomplete: function () {
              input_clear_mask(input, input_g_value);
            }
          }).mask(input);
        }
        if (input.classList.contains('_digital')) {
          input.classList.add('_mask');
          Inputmask("9{1,}", {
            "placeholder": '',
            clearIncomplete: true,
            clearMaskOnLostFocus: true,
            onincomplete: function () {
              input_clear_mask(input, input_g_value);
            }
          }).mask(input);
        }
        form_remove_error(input);
      });
      input.addEventListener('blur', function (e) {
        if (input.value == '') {
          input.value = input_g_value;
          input_focus_remove(input);
          if (input.classList.contains('_mask')) {
            input_clear_mask(input, input_g_value);
          }
          if (input.getAttribute('data-type') === "pass") {
            input.setAttribute('type', 'text');
          }
        }
      });
      if (input.classList.contains('_date')) {
        const calendarItem = datepicker(input, {
          customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
          customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
          overlayButton: 'Применить',
          overlayPlaceholder: 'Год (4 цифры)',
          startDay: 1,
          formatter: (input, date, instance) => {
            const value = date.toLocaleDateString()
            input.value = value
          },
          onSelect: function (input, instance, date) {
            input_focus_add(input.el);
          }
        });
        const dataFrom = input.getAttribute('data-from');
        const dataTo = input.getAttribute('data-to');
        if (dataFrom) {
          calendarItem.setMin(new Date(dataFrom));
        }
        if (dataTo) {
          calendarItem.setMax(new Date(dataTo));
        }
      }
    }
  }
}

function input_placeholder_add(input) {
  const input_g_value = input.getAttribute('data-value');
  if (input.value == '' && input_g_value != '') {
    input.value = input_g_value;
  }
}

function input_focus_add(input) {
  input.classList.add('_focus');
  input.parentElement.classList.add('_focus');
}

function input_focus_remove(input) {
  input.classList.remove('_focus');
  input.parentElement.classList.remove('_focus');
}

function input_clear_mask(input, input_g_value) {
  input.inputmask.remove();
  input.value = input_g_value;
  input_focus_remove(input);
}

//BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
  for (let index = 0; index < sliders.length; index++) {
    let slider = sliders[index];
    if (!slider.classList.contains('swiper-bild')) {
      let slider_items = slider.children;
      if (slider_items) {
        for (let index = 0; index < slider_items.length; index++) {
          let el = slider_items[index];
          el.classList.add('swiper-slide');
        }
      }
      let slider_content = slider.innerHTML;
      let slider_wrapper = document.createElement('div');
      slider_wrapper.classList.add('swiper-wrapper');
      slider_wrapper.innerHTML = slider_content;
      slider.innerHTML = '';
      slider.appendChild(slider_wrapper);
      slider.classList.add('swiper-bild');

      if (slider.classList.contains('_swiper_scroll')) {
        let sliderScroll = document.createElement('div');
        sliderScroll.classList.add('swiper-scrollbar');
        slider.appendChild(sliderScroll);
      }
    }
    if (slider.classList.contains('_gallery')) {
      //slider.data('lightGallery').destroy(true);
    }
  }
  sliders_bild_callback();
}

function sliders_bild_callback(params) {
}

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollItems.length > 0) {
  for (let index = 0; index < sliderScrollItems.length; index++) {
    const sliderScrollItem = sliderScrollItems[index];
    const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
    const sliderScroll = new Swiper(sliderScrollItem, {
      observer: true,
      observeParents: true,
      direction: 'vertical',
      slidesPerView: 'auto',
      freeMode: true,
      scrollbar: {
        el: sliderScrollBar,
        draggable: true,
        snapOnRelease: false
      },
      mousewheel: {
        releaseOnEdges: true
      }
    });
    sliderScroll.scrollbar.updateSize();
  }
}


function sliders_bild_callback(params) {
}

// child-adventure__slider
let slider_child = new Swiper('.child-adventure__slider', {
  observer: true,
  observeParents: true,
  slidesPerView: 1,
  spaceBetween: 0,
  autoHeight: true,
  speed: 800,
  // Dotts
  pagination: {
    el: '.child-adventure__pagging',
    clickable: true
  },
  // Arrows
  navigation: {
    nextEl: '.child-adventure__btn-next',
    prevEl: '.child-adventure__btn-prev'
  }
});

// parent-adventure__slider
let slider_parent = new Swiper('.parent-adventure__slider', {
  observer: true,
  observeParents: true,
  slidesPerView: 1,
  spaceBetween: 0,
  autoHeight: true,
  speed: 800,
  // Dotts
  pagination: {
    el: '.parent-adventure__pagging',
    clickable: true
  },
  // Arrows
  navigation: {
    nextEl: '.parent-adventure__btn-next',
    prevEl: '.parent-adventure__btn-prev'
  }
});
