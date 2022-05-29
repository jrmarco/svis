<template>
  <div
    :id="`svis-${this.id}`"
    ref="wrapper"
    class="svis-wrapper"
  >
    <h1
      v-if="title"
      ref="titleElement">
      {{ title }}
    </h1>
    <div
      ref="mainContainer"
      class="svis-main-container"
    >
      <div
        v-if="paginated.length"
        ref="slider"
        class="svis-slider"
      >
        <div
          ref="previousBtn"
          @click="goPevious()"
          class="svis-page svis-left svis-pointer"
          :aria-label="translation.previous"
          :title="translation.previous"
        ></div>
        <div
          v-for="image in paginated" v-bind:key="image.index"
          :id="`thumb-id-${image.index}`"
          :class="`svis-slide`"
        >
          <img
            :src="image.src"
            class='svis-slider-image svis-pointer'
            :title="image.title ?? `${this.translation.image}-${image.index}`"
            @click="showImage(image.index)"
          />
        </div>
        <div
          ref="nextButton"
          @click="goNext()"
          class="svis-page svis-right svis-pointer"
          :aria-label="translation.next"
          :title="translation.next"
        ></div>
      </div>
      <div v-else>{{ translation.noImage }}</div>
    </div>
    <div
      v-show="isFullscreen()"
      class="svis-fullscreen svis-pointer"
    >
      <div
        @click="toggleImage()"
        class="svis-closeBtn svis-pointer"
      />
      <div
        @click="rotate()"
        class="svis-rotate svis-pointer"
        :aria-label="translation.close"
        :title="translation.close"
      />
      <div
        class="svis-fullscreen-box"
        @click="toggleImage()"
      >
        <img
          ref="image"
          class="svis-image svis-centered svis-pointer"
          title="no-image"
        />
        <div
          ref="imageParagraph"
          class="svis-paragraph"
        >
          <p class="svis-title"></p>
          <p class="svis-description"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * v-sshow
 * Simple image slide show made in Vue3
 * Ready for mobile, not optimized yet
 * @version 1.0
 * @author jrmarco <develper@bigm.it>
 * @license GPL-3.0-or-later
 */
import translations from './languages/index';

export default {
  name: 'SvisComponent',
  data() {
    return {
      id: null,
      lang: 'en',
      title: false,
      page: 0,
      totalPages: 0,
      imagesPerPage: 5,
      activeImage: false,
      imageSet: [],
      fullScreen: false,
      translation: {},
    };
  },
  props: {
    componentId: {
      type: String,
      required: false,
    },
    images: {
      type: [Array, String],
      required: true,
    },
    settings: {
      type: Object,
      required: false,
    },
  },
  mounted() {
    // Assign component id or generate random one
    this.id = this.componentId && this.componentId !== ''
      ? this.componentId : (Math.random() + 1).toString(36).substring(3);
    // Prepare dataset into images list
    this.loadImagesFromList();
    this.loadCustomConfig();
    // Load translation
    this.translation = translations[this.lang] ?? translations.en;
  },
  created() {
    // Bind keyboard keys
    this.bindKeys();
  },
  methods: {
    /**
     * Load custom configurations
     * @return {void}
     */
    loadCustomConfig() {
      if (this.settings) {
        // Set variables if exist in settings
        this.lang = this.settings.lang ?? this.lang;
        this.title = this.settings.title ?? this.title;
        this.imagesPerPage = this.settings.imagesPerPage ?? this.imagesPerPage;
        // Calculate total pages
        this.totalPages = Math.floor(this.imageSet.length / this.imagesPerPage);
        if (this.imageSet.length % this.imagesPerPage) {
          this.totalPages += 1;
        }
      }
    },
    /**
     * Bind keyboard keys to slider/image action
     * @return {Void}
     */
    bindKeys() {
      window.addEventListener('keydown', (e) => {
        if (this.fullScreen) {
          switch (e.key) {
            case 'ArrowLeft':
              return this.previousImage();
            case 'ArrowRight':
              return this.nextImage();
            case 'r':
              return this.rotate();
            default: return false;
          }
        }
        switch (e.key) {
          case 'ArrowLeft':
            return this.prevPage();
          case 'ArrowRight':
            return this.nextPage();
          default: return false;
        }
      });
    },
    /**
     * Read dataset and init images list
     * @return {Bool}
     */
    loadImagesFromList() {
      let list = this.images;
      if (typeof this.images === 'string') {
        try {
          list = JSON.parse(this.images);
        } catch (error) {
          list = [];
        }
      }
      this.prepareDataset(list);
      return true;
    },
    /**
     * Prepare images list with required info per image
     * @param {Array}
     * @return {Void}
     */
    prepareDataset(list) {
      for (let i = 0; i < list.length; i += 1) {
        const image = list[i];
        // If object, load it directly as element of the list
        if (typeof image === 'object') {
          image.index = i;
          this.imageSet.push(image);
        } else {
          // Create a container with image source and index
          const imageData = { src: list[i], index: i };
          this.imageSet.push(imageData);
        }
      }
      // Pick first image and set it as active
      [this.activeImage] = this.imageSet;
    },
    /**
     * Load previous image
     * @return {Void}
     */
    previousImage() {
      let position = this.activeImage.index - 1;
      position = position < 0 ? 0 : position;
      this.activeImage = this.imageSet[position];
      this.$refs.image.src = this.imageSet[position].src;
      // If position is outside current pagination, move page and load
      if (position % this.imagesPerPage === this.imagesPerPage - 1) {
        this.prevPage();
      }
      this.imageAttributes(position);
    },
    /**
     * Load next image
     * @return {Void}
     */
    nextImage() {
      let position = this.activeImage.index + 1;
      position = position > this.imageSet.length - 1 ? this.imageSet.length - 1 : position;
      this.activeImage = this.imageSet[position];
      this.$refs.image.src = this.imageSet[position].src;
      // If position is outside current pagination, move page and load
      if (position % this.imagesPerPage === 0) {
        this.nextPage();
      }
      this.imageAttributes(position);
    },
    /**
     * Load previous page set
     * @return {Void}
     */
    prevPage() {
      const page = this.page - 1;
      this.page = page < 0 ? 0 : page;
    },
    /**
     * Load next page set
     * @return {Void}
     */
    nextPage() {
      const page = this.page + 1;
      this.page = page >= this.totalPages ? this.totalPages - 1 : page;
    },
    /**
     * Action previous
     * @return {Void}
     */
    goPevious() {
      if (this.fullScreen) {
        return this.previousImage();
      }
      return this.prevPage();
    },
    /**
     * Action next
     * @return {Void}
     */
    goNext() {
      if (this.fullScreen) {
        return this.nextImage();
      }
      return this.nextPage();
    },
    /**
     * Action rotate image
     * @return {Void}
     */
    rotate() {
      const { image } = this.$refs;
      let angle = image.hasAttribute('data-angle') ? image.getAttribute('data-angle') : 0;
      if (!image.hasAttribute('data-transform')) {
        image.setAttribute('data-transform', image.style.transform);
      }
      angle = (parseInt(angle, 10) + 90) % 360;
      image.setAttribute('data-angle', angle);
      image.style.transform = `rotate(${angle}deg)`;
    },
    /**
     * Action display selected image
     * Works only with fullscreen mode enabled
     * @return {Bool}
     */
    toggleImage() {
      if (this.fullScreen && this.activeImage.url && this.activeImage.url !== '') {
        this.openLinkTab();
      }
      this.fullScreen = !this.fullScreen;
      if (!this.fullScreen) {
        this.resetImageAngle();
        this.resetButtons();
      }
      return true;
    },
    /**
     * Reset fullscreen image angle
     * @return {Void}
     */
    resetImageAngle() {
      const { image } = this.$refs;
      image.setAttribute('data-angle', 0);
      image.style.transform = 'rotate(0deg)';
    },
    /**
     * Move action button from side to top
     * @return {Void}
     */
    bringToFrontButtons() {
      const prev = this.$refs.previousBtn;
      const next = this.$refs.nextButton;
      prev.classList.add('svis-leftside');
      next.classList.add('svis-rightside');
    },
    /**
     * Reset action buttons
     * @return {Void}
     */
    resetButtons() {
      const prev = this.$refs.previousBtn;
      const next = this.$refs.nextButton;
      prev.classList.remove('svis-leftside');
      next.classList.remove('svis-rightside');
    },
    /**
     * Display selected image in fullscreen mode
     * @param {Number} index Index of the image
     * @return {Bool}
     */
    showImage(index) {
      this.activeImage = this.imageSet[index];
      if (this.activeImage.url && this.activeImage.url !== '') {
        this.openLinkTab();
        return true;
      }
      this.fullScreen = true;
      this.$refs.image.src = this.imageSet[index].src;
      this.$refs.image.setAttribute('title', this.activeImage.title ?? `${this.translation.image}-${index}`);
      this.bringToFrontButtons();
      this.imageAttributes(index);
      return true;
    },
    /**
     * Prepare image attribute
     * @param {Number} index Index of the image
     * @return {Void}
     */
    imageAttributes(index) {
      const paragraph = this.$refs.imageParagraph;
      const titleDom = paragraph.querySelector('.svis-title');
      const descriptionDom = paragraph.querySelector('.svis-description');
      paragraph.style.display = 'block';
      titleDom.style.display = 'block';
      descriptionDom.style.display = 'block';
      const title = this.imageSet[index].title !== undefined ? this.imageSet[index].title : '';
      const description = this.imageSet[index].description !== undefined ? this.imageSet[index].description : '';
      titleDom.innerHTML = title;
      descriptionDom.innerHTML = description;
      if (title === '') {
        titleDom.style.display = 'none';
      }
      if (description === '') {
        descriptionDom.style.display = 'none';
      }
      if (title === '' && description === '') {
        paragraph.style.display = 'none';
      }
    },
    /**
     * Return fullscreen flag
     * @return {Bool}
     */
    isFullscreen() {
      return this.fullScreen;
    },
    /**
     * Open image link in a new tab
     * @return {Void}
     */
    openLinkTab() {
      const curedUrl = /^[http|https]:\/\//.test(this.activeImage.url)
        ? this.activeImage.url : `https://${this.activeImage.url}`;
      window.open(curedUrl, '_blank').focus();
    },
  },
  computed: {
    /**
     * Calculate paginated slice of image list
     * @return {Array}
     */
    paginated() {
      const start = this.page * this.imagesPerPage;
      const end = start + this.imagesPerPage;
      return this.imageSet.slice(start, end);
    },
  },
};
</script>
