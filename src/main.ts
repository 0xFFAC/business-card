import "./style.css";
import "./bodoni-moda.css"
import svgTemplate from "./svgTemplate";
import { FormField } from "./types";
import { Canvg } from "canvg";

const SVG_WIDTH = 334
const SVG_HEIGHT = 192

const cardFields: { [key: string]: FormField } = {
  phone: {
    value: "212 555 6342",
  },
  "first-name": {
    value: "Patrick",
  },
  "last-name": {
    value: "Bateman",
    get svgValue(){
      return this.value!.toUpperCase()
    }
  },
  title: {
    value: "Vice President",
  },
  "company-name": {
    value: "Pierce &Pierce",
    get svgValue() {
      return this.value!.replaceAll(
        "&",
        `<tspan font-size="2.6458px">&amp;</tspan>`,
      );
    },
  },
  "company-subtitle": {
    value: "Mergers and Aquisitions",
  },
  address: {
    value:
      "358 Exchange Place New  York,  N.Y.  10099 fax 212 555 6390 telex 10 4534",
  },
};

function generateSVG() {
  const vals = cardFields
  const svg = svgTemplate({
    firstName: vals["first-name"].value,
    lastName: vals["last-name"].svgValue!,
    title: vals.title.value,
    phoneNumber: vals.phone.value,
    companyName: vals["company-name"].svgValue!,
    companySubtitle: vals["company-subtitle"].value,
    address: vals.address.value
  })
  return svg
}

async function updatePngDownloadButton() {
  const element: HTMLLinkElement = document.querySelector("#png-download")!
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
  const svg = generateSVG()

  const scale = 3
  const v = await Canvg.fromString(ctx, svg)
  v.resize(SVG_WIDTH * scale, SVG_HEIGHT * scale)
  v.start()
  element.href = canvas.toDataURL("image/png")
}

function updateSvgDownloadButton() {
  const element: HTMLLinkElement = document.querySelector("#svg-download")!
  const svg = generateSVG()
  const blob = new Blob([svg], { type: "image/svg+xml" })
  element.href = URL.createObjectURL(blob)
}

function updateCardElement() {
  const cardImage: HTMLDivElement = document.querySelector("#card-image")!
  cardImage.innerHTML = generateSVG()
  updateSvgDownloadButton();
  updatePngDownloadButton()
}

function updateCard(ev: Event) {
  const { id, value } = ev.target as HTMLInputElement;
  cardFields[id].value = value;
  updateCardElement();
}

function computeScale(entries: ResizeObserverEntry[]) {
  const { clientWidth: width } = entries[0].target
  const rootElement = document.documentElement
  const scale = width / SVG_WIDTH
  rootElement.style.setProperty("--scale", scale.toString())
}

function main() {
  const cardContainer: HTMLDivElement = document.querySelector("#card-container")!

  new ResizeObserver(computeScale).observe(cardContainer)

  Object.keys(cardFields).forEach((id) => {
    const element: HTMLInputElement = document.querySelector(`#${id}`)!;
    const { value } = cardFields[id];
    element.placeholder = value;

    if (element.value) {
      cardFields[id].value = element.value;
    }
  });

  const svg = generateSVG()
  document.querySelector<HTMLDivElement>("#card-image")!.innerHTML = svg;
  updateCardElement();

  addEventListener("input", updateCard);

}

if (document.readyState === "loading") {
  addEventListener("DOMContentLoaded", () => {
    main();
  });
} else {
  main();
}
