document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
    summary.setAttribute('role', 'button');
    summary.setAttribute('aria-expanded', summary.parentNode.hasAttribute('open'));
  
    if(summary.nextElementSibling.getAttribute('id')) {
      summary.setAttribute('aria-controls', summary.nextElementSibling.id);
    }
  
    summary.addEventListener('click', (event) => {
      let isSubMenu = event.currentTarget.closest('details').classList.contains('mega-submenu');
      if (!isSubMenu) {
        var current_value = !event.currentTarget.closest('details').hasAttribute('open');
        event.currentTarget.setAttribute('aria-expanded', current_value);
    
        //document.querySelectorAll('.mega-menu:not(.mega-submenu)').forEach( (menu) => { menu.removeAttribute('open') });
        document.querySelectorAll('.has-mega-menu').forEach( (hasMenu) => {
           hasMenu.querySelector('.mega-menu').removeAttribute('open')
          }
        );
        //event.currentTarget.parents('details').setAttribute('open', '');
        //event.currentTarget.closest('li').setAttribute('open', '');
      } else {
        document.body.classList.toggle("mega-submenu-open");
      }
  
  
    });
  
    if (summary.closest('header-drawer')) return;
    summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});
  
    /* Animation */
const scrollElements = document.querySelectorAll(".js-scroll");

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

const elementOutofView = (el) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop > (window.innerHeight || document.documentElement.clientHeight)
  );
};

const displayScrollElement = (element) => {
  element.classList.add("scrolled");
};

const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else if (elementOutofView(el)) {
      hideScrollElement(el)
    }
  })
}

window.addEventListener("scroll", () => { 
  handleScrollAnimation();
});

if ( document.body.clientWidth <= 750 ) {
    document.querySelectorAll('.footer-block.accordion details').forEach( detail =>  {detail.removeAttribute("open")} );
}

class EA_SlideshowComponent extends SlideshowComponent {
  constructor() {
    super();
    this.enableSliderLooping = false;
    if (this.slider.getAttribute('data-enableSliderLooping') === 'true') {
      this.enableSliderLooping = true;
    }
  }

  update() {
    super.update();
    if (this.enableSliderLooping) return;

    if (this.isSlideVisible(this.sliderItemsToShow[0]) && this.slider.scrollLeft === 0) {
      this.prevButton.setAttribute('disabled', 'disabled');
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1])) {
      this.nextButton.setAttribute('disabled', 'disabled');
    } else {
      this.nextButton.removeAttribute('disabled');
    }
  }
}

customElements.define('ea-slideshow-component', EA_SlideshowComponent);

if (document.querySelector('[data-flavor-select]')) {
  document.querySelector('[data-flavor-select]').addEventListener('change', function () {
    window.location.href = this.value;
  });
}
