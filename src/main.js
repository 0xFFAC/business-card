import "./style.css";
import "./bodoni-moda.css";
import svgTemplate from "./svgTemplate";
import { Canvg } from "canvg";

// CONSTANTS
const SVG_WIDTH = 334;
const SVG_HEIGHT = 192;

// STATE
const state = {};
state.cardFields = {
  phoneNumber: "212 555 6342",
  firstName: "Patrick",
  lastName: "Bateman",
  title: "Vice President",
  companyName: "Pierce &Pierce",
  companySubtitle: "Mergers and Aquisitions",
  address:
    "358 Exchange Place New  York,  N.Y.  10099 fax 212 555 6390 telex 10 4534",
};
state.svg = svgTemplate(state.cardFields);

// ELEMENTS
const pngLinkEl = document.getElementById("png-download");
const svgLinkEl = document.getElementById("svg-download");
const cardImageEl = document.getElementById("card-image");

// EVENT HANDLERS ETC.
function pngDownloadLinkHandler() {
  // not using offscreenCanvas because it's less supported
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const scale = 3;
  const v = Canvg.fromString(ctx, state.svg);
  v.resize(SVG_WIDTH * scale, SVG_HEIGHT * scale);
  v.start();
  pngLinkEl.href = canvas.toDataURL("image/png");
}

function svgDownloadLinkHandler() {
  const blob = new Blob([state.svg], { type: "image/svg+xml" });
  svgLinkEl.href = URL.createObjectURL(blob);
}

function syncCardElement() {
  state.svg = svgTemplate(state.cardFields);
  cardImageEl.src = `data:image/svg+xml;charset=utf-8,${state.svg}`;
}

function updateCard(ev) {
  const { id, value } = ev.target;
  state.cardFields[id] = value;
  syncCardElement();
}

// EVENT LISTENERS
svgLinkEl.addEventListener("click", svgDownloadLinkHandler);
pngLinkEl.addEventListener("click", pngDownloadLinkHandler);

// INITIALIZATION
for (const id in state.cardFields) {
  const { cardFields } = state;
  const element = document.getElementById(id);
  element.placeholder = cardFields[id];

  if (element.value) {
    cardFields[id] = element.value;
  }

  element.addEventListener("input", updateCard);
}

syncCardElement();
