document.addEventListener("DOMContentLoaded", initApplication);

const offerAPI =
  "https://rekrutacja.webdeveloper.rtbhouse.net/files/banner.json";

const _SUCCESS = 200;

async function initApplication() {
  const jsonOffers = await loadOffers();
  offers = generateRandomOffers(jsonOffers);

  Dom.mountOffers(offers);
}

async function loadOffers() {
  const response = await fetch(offerAPI);

  if (response.status !== _SUCCESS) return [];

  const data = await response.json();
  return data.offers;
}

function startJumpingAnimation() {
  JumpingAnimation.start();
}

function stopJumpingAnimation() {
  JumpingAnimation.stop();
}

function generateRandomOffers(offersArray) {
  let randomTimes = 4;
  let offersRange = [...offersArray];

  randomOffers = [];

  const loop = [...Array(randomTimes).keys()];

  loop.forEach(() => {
    const random = Math.floor(Math.random() * offersRange.length);
    const offer = offersRange.splice(random, 1);
    randomOffers.push(offer[0]);
  });

  return randomOffers;
}

function formatPrice(price, currency) {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: currency,
  }).format(price);
}

class Dom {
  static mountOffers(offers) {
    offers.forEach((offer) => {
      Dom.mountOffer(offer);
    });

    JumpingAnimation.start();
  }

  static async mountOffer(offer) {
    const offerElement = document.createElement("article");
    offerElement.classList.add("offer");
    offerElement.classList.add("border-grey");

    const pictureElement = document.createElement("picture");
    pictureElement.classList.add("offer-picture");

    const imgElement = document.createElement("img");
    imgElement.classList.add("max-w-100");
    imgElement.classList.add("max-h-100");
    imgElement.setAttribute("alt", offer.name);
    imgElement.setAttribute("data-src", offer.imgURL);

    pictureElement.appendChild(imgElement);
    offerElement.appendChild(pictureElement);

    const priceElement = document.createElement("span");
    priceElement.textContent = formatPrice(offer.price, offer.currency);
    offerElement.appendChild(priceElement);

    const offersSection = document.querySelector(".offers");
    offersSection.appendChild(offerElement);

    const img = document.querySelector(`[data-src="${offer.imgURL}"]`);
    img.setAttribute("src", offer.imgURL);
  }
}

class JumpingAnimation {
  jumpingAnimation;

  static start() {
    JumpingAnimation.jumpingAnimation = setInterval(
      JumpingAnimation.jumpingOffer,
      2000
    );
  }

  static stop() {
    clearInterval(JumpingAnimation.jumpingAnimation);
  }

  static jumpingOffer() {
    const offersElement = document.querySelector(".offers");
    const lastOffer = offersElement.lastChild;
    offersElement.removeChild(lastOffer);
    offersElement.prepend(lastOffer);
  }
}
