// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";
import "@lrnwebcomponents/video-player/video-player.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.defaultVideo = 'https://www.youtube.com/watch?v=9MT-BNuUCpM';
    this.activeItem = {
      title: null,
      id: null,
      description: null,
      presenter: null,
      timecode: null,
    };
    this.nextItem = {
      title: null,
      id: null,
      description: null,
      presenter: null,
      timecode: null,
    };
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object },
      nextItem: { type: Object }
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      .listing-container {
        justify-self: center;
        max-width: 1344px;
        justify-items: left;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: auto;
        padding-left: 4px;
        padding-right: 4px;
        text-rendering: optimizeLegibility;
        width: 100%;
        margin: 0 auto;
        position: relative;
        animation-delay: 1s;
        animation-duration: 1s;
        line-height: 1;
        font-size: 1em;
        cursor: pointer;
      }
      .middle-page{
        display: inline-flex;
      }
      .main-content {
          display: flex;
          flex-direction: row;
          margin: 8px;
      }
      .player-container {
          border-radius: 8px;
          padding: 8px;
          display: flex;
          width: 66%;
          height: auto;
          
      }
      .player {
        width: 100%;
        aspect-ratio: 16/9;
        border-radius: 8px;
        height: auto;
        
      }
      .discord {
        width: 33%;
        padding: 8px;
        display: inline-flex;
      }
      .discord widgetbot {
        display: inline-block;
        overflow: hidden;
        border-radius: 8px;
        vertical-align: top;
        width: 100%;
        height: 100%;
      }
      .discord iframe {
        border: none;
        width: 100%;
        height: 100%;
      }
      .description {
        border-radius: 8px;
        padding: 8px;
        display: flex;
        width: 100%;
        margin: 4px;
      }
      .dialog {
        border-radius: 8px;
        padding: 8px;
        display: flex;

      }
      
    @media screen and (max-width: 768px) {
      .main-content {
      flex-direction: column; 
      }
      .player-container, .description, .discord {
        width: 100%; 
        height: 100%;
      }
    }
      `,
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
       <h1>${this.name}</h1>
      <div class="listing-container">
      ${this.listings.map(
      (item) => html`
            <tv-channel
              title="${item.title}"
              presenter="${item.metadata.author}"
              description="${item.description}"
              @click="${this.itemClick}"
              video="${item.metadata.source}"
              timecode="${item.metadata.timecode}"
            >
            </tv-channel>
          `
    )
      }
      </div>
    <div class="main-content">
    <div class="player-container">
    <!-- video -->
      <video-player 
          class="player"
          source="${this.createSource()}" 
          accent-color="orange" 
          dark track="https://haxtheweb.org/files/HAXshort.vtt">
      </video-player>
    </div>
    
    <!-- discord  -->
    <div class="discord">
        <widgetbot server="954008116800938044" channel="1106691466274803723" width="100%" height="100%"><iframe title="WidgetBot Discord chat embed" allow="clipboard-write; fullscreen" src="https://e.widgetbot.io/channels/954008116800938044/1106691466274803723?api=a45a80a7-e7cf-4a79-8414-49ca31324752"></iframe></widgetbot>
        <script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed"></script>
      </div>
    </div>
    
  <!-- description -->
  <div>
    <tv-channel class="description">
    <p>${this.activeItem.timecode}</p>
    <h2>${this.activeItem.title}</h2>
    <h3>${this.activeItem.presenter}</h3>
    <p>${this.activeItem.description}</p>
  </tv-channel>
  </div>
    
  <!-- dialog -->
  <sl-dialog class="dialog">
    <p>${this.nextItem.timecode}</p>
    <h2>${this.nextItem.title}</h2>
    <h3>${this.nextItem.presenter}</h3>
    <p>${this.nextItem.description}</p>
    <sl-button slot="footer" variant="primary" @click="${this.watchVideo}">WATCH</sl-button>
  </sl-dialog>
    `;
  }

  changeVideo() {
    const videoPlayer = this.shadowRoot.querySelector('video-player');
    videoPlayer.source = this.createSource();
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play()
  }
  
  extractVideoId(link) {
    try {
      const url = new URL(link);
      const searchParams = new URLSearchParams(url.search);
      return searchParams.get("v");
    } catch (error) {
      console.error("Invalid URL:", link);
      return null;
    }
  }

  createSource() {
    return this.activeItem.video
      ? `https://www.youtube.com/embed/${this.extractVideoId(this.activeItem.video)}`
      : this.defaultVideo;
  }

  watchVideo(e)
  {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
    this.activeItem = this.nextItem;
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
  }

  itemClick(e) {
    console.log(e.target);
    this.nextItem = {
      title: e.target.title,
      id: e.target.id,
      description: e.target.description,
      video: e.target.video,
      presenter: e.target.presenter,
      timecode: e.target.timecode,
    };
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
        console.log(this.listings);
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);