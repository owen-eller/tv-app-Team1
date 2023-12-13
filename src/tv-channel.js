// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.presenter = '';
    this.description = '';
    this.video= '';
    this.timecode = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      description: {type: String},
      presenter: { type: String },
      video: {type: String},
      timecode: {type: String},
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        text-rendering: optimizeLegibility;
        box-sizing: inherit;
        display: inline-block;
        line-height: 1;
        font-size: 1em;
        font-weight: 400;
        min-width: 300px;
        margin: 0;
        padding: 0;
        transition: all 0.25s ease-in-out;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .wrapper {
        margin: 8px;
        padding: 8px;
        padding-left: 4px;
        padding-right: 4px;
        border-radius: 8px;
        border-color: #4a4a4a;
        box-shadow: 0px 0px 0px 1px #dbdbdb;
        background-color: #ffffff;
      }
      p {
        font-size: 10px;
      }
    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
        <div>${this.timecode}</div>
        <h3>${this.title}</h3>
        <p>${this.description}</p>
        <slot></slot>
      </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);