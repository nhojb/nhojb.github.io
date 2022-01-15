//
//  lightbox.js
//
//  Copyright John Buckley <nhoj.buckley at gmail.com>
//  26/03/2021
//

class Lightbox {
  index = 0;
  isOpen = false;

  constructor(gallery, options) {
    // Find all figures in the gallery:
    this.images = Array.from(gallery.querySelectorAll('figure img'));

    // Add a click handler to each image:
    for (let img of this.images) {
      this.addEventListener(img, ['click', 'touchup'], event => {
        this.open(event);
      });
    }

    this.lightbox = document.querySelector('.lightbox');
    if (this.lightbox && this.images.length > 0) {
      this.prevButton = this.lightbox.querySelector('.button-prev');
      this.nextButton = this.lightbox.querySelector('.button-next');
      this.addEventHandlers(this.lightbox);
    }
  }

  open(event) {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;

    let img = event.target;
    let idx = this.images.indexOf(img);
    if (idx == -1) {
      return;
    }

    this.index = idx;
    this.activateLightbox(img);
    this.displayImage(idx);
  }

  close(event) {
    this.isOpen = false;
    this.index = -1;
    this.deactivateLightbox();
  }

  activateLightbox(img) {
    if (!this.lightbox) {
      return;
    }

    this.lightbox.classList.add('is-active');
    this.lightbox.classList.remove('is-inactive');
    this.lightbox.focus();

    this.activateTimeout = setTimeout(() => {
      // Prevent scrolling while lightbox is active.
      // See https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
      document.body.style.top = `-${window.scrollY}px`;
      document.body.classList.add('lightbox-open')
    }, 1000);
  }

  deactivateLightbox() {
    if (!this.lightbox) {
      return;
    }

    this.lightbox.classList.add('is-inactive');
    this.lightbox.classList.remove('is-active');

    document.body.classList.remove('lightbox-open')

    // Restore body scroll position
    const scrollY = document.body.style.top;
    document.body.style.top = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY) * -1);
    }

    clearTimeout(this.activateTimeout);
    this.activateTimeout = 0;
  }

  addEventHandlers(lightbox) {
    // Ensure lightbox can focus:
    lightbox.setAttribute('tabindex', '0');

    this.addEventListener(lightbox, 'keyup', event => {
      if (event.key === 'Escape') {
        this.close();
      } else if (event.key === 'ArrowLeft') {
        this.displayPrevious();
      } else if (event.key === 'ArrowRight') {
        this.displayNext();
      }
    });

    this.addEventListener(this.prevButton, ['click', 'touchup'], event => {
      this.displayPrevious();
    });

    this.addEventListener(this.nextButton, ['click', 'touchup'], event => {
      this.displayNext();
    });

    this.addEventListener(lightbox, ['click', 'touchup'], event => {
      const gap = 50;
      const midX = window.innerWidth / 2;
      if (event.clientX > (midX + gap)) {
        this.displayNext();
      } else if (event.clientX < (midX - gap)) {
        this.displayPrevious();
      }
    });

    this.onHorizontalSwipe(lightbox, event => {
      if (event == 'left') {
        this.displayNext();
      } else {
        this.displayPrevious();
      }
    });

    let close = lightbox.querySelector('.modal-close');
    if (close) {
      this.addEventListener(close, ['click', 'touchup'], event => {
        this.close();
      });
    }
  }

  addEventListener(target, events, callback) {
    if (typeof events === 'string') {
      events = [events];
    } else {
      events = Array.from(events);
    }

    for (let event of events) {
      target.addEventListener(event, callback);
    }
  }

  displayImage(idx) {
    if (idx > this.images.length - 1) {
      return;
    }

    this.index = idx;
    let img = this.images[idx];

    let lb_img = this.lightbox.querySelector('img');
    lb_img.src = img.src;
    lb_img.alt = img.src.split('/').pop();

    this.updateButtons()
  }

  displayPrevious() {
    if (this.index > 0) {
      this.displayImage(this.index - 1);
    }
  }

  displayNext() {
    if (this.index < this.images.length - 1) {
      this.displayImage(this.index + 1);
    }
  }

  updateButtons() {
    if (this.index > 0) {
      this.prevButton.classList.remove('is-invisible');
    } else {
      this.prevButton.classList.add('is-invisible');
    }

    if (this.index < this.images.length - 1) {
      this.nextButton.classList.remove('is-invisible');
    } else {
      this.nextButton.classList.add('is-invisible');
    }
  }

  // Adapted from https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d
  onHorizontalSwipe(element, handler) {
    let touchStartX = 0;
    let touchEndX = 0;
    const threshold = 100;

    element.addEventListener('touchstart', function(event) {
      touchStartX = event.changedTouches[0].screenX;
    }, false);

    element.addEventListener('touchend', function(event) {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      if (Math.abs(touchEndX - touchStartX) < threshold) { return }

      if (touchEndX > touchStartX) {
        handler('right');
      } else {
        handler('left');
      }
    }
  }

  /*
    createElement(tag, parent, classes) {
    let element = document.createElement(tag);

    if (typeof classes === 'string') {
    element.classList.add(classes);
    } else if (classes) {
    for (let cls of classes) {
    element.classList.add(cls);
    }
    }
    if (parent) {
    parent.appendChild(element)
    }
    return element;
    }

    createLightbox(parent) {
    let lightbox = createElement('div', null,  ['lightbox', 'modal', 'is-active']);
    lightbox.setAttribute('tabindex', '0');

    createElement('div', lightbox, 'modal-background');
    let modal_content = createElement('div', lightbox, 'modal-content');
    let modal_p = createElement('p', modal_content, 'image');
    createElement('img', modal_p).src = img.src;

    createElement('button', lightbox, ['modal-close', 'is-large']).setAttribute('aria-label', 'close');

    parent.appendChild(lightbox);
    }
  */
}
