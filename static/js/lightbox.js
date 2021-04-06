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

        console.log('open:', img.src, idx);

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
    }

    deactivateLightbox() {
        if (!this.lightbox) {
            return;
        }

        this.lightbox.classList.add('is-inactive');
        this.lightbox.classList.remove('is-active');
    }

    addEventHandlers(lightbox) {
        // Ensure lightbox can focus:
        lightbox.setAttribute('tabindex', '0');

        this.addEventListener(lightbox, 'keyup', event => {
            console.log('keyup:', event.key);
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

        // TODO: touch swipe to move images...

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
        console.log('displayPrevious:', this.index);
        if (this.index > 0) {
            this.displayImage(this.index - 1);
        }
    }

    displayNext() {
        console.log('displayNext:', this.index);
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
