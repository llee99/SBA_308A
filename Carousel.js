import * as bootstrap from "bootstrap";
import { favourite } from "./app.js";

console.log("Carousel.js is loaded");

export function createCarouselItem(imgSrc, imgAlt, imgId, isFavourite) {
    const template = document.querySelector("#carouselItemTemplate");
    const clone = template.content.firstElementChild.cloneNode(true);

    const img = clone.querySelector("img");
    img.src = imgSrc;
    img.alt = imgAlt;

    const favBtn = clone.querySelector(".favourite-button");

    favBtn.dataset.imgId = imgId; // Set image ID as a data attribute
    favBtn.classList.toggle("favourited", isFavourite); // Toggle the "favourited" class based on current status

    favBtn.addEventListener("click", async () => {
        const isCurrentlyFavourited = favBtn.classList.contains("favourited");
        await favourite(imgId, isCurrentlyFavourited);
        favBtn.classList.toggle("favourited");
    });

return clone;
}

export function clear() {
    const carousel = document.querySelector("#carouselInner");
    while (carousel.firstChild) {
        carousel.removeChild(carousel.firstChild);
    }
}

export function appendCarousel(element) {
    const carousel = document.querySelector("#carouselInner");

    const activeItem = document.querySelector(".carousel-item.active");
    if (!activeItem) element.classList.add("active");

    carousel.appendChild(element);
}

export function start() {
    const multipleCardCarousel = document.querySelector("#carouselExampleControls");
    if (window.matchMedia("(min-width: 768px)").matches) {
        const carousel = new bootstrap.Carousel(multipleCardCarousel, {
            interval: false
        });
    const carouselWidth = $(".carousel-inner")[0].scrollWidth;
    const cardWidth = $(".carousel-item").width();
    let scrollPosition = 0;
    $("#carouselExampleControls .carousel-control-next").unbind();
    $("#carouselExampleControls .carousel-control-next").on("click",
        function () {
            if (scrollPosition < carouselWidth - cardWidth * 4) {
            scrollPosition += cardWidth;
            $("#carouselExampleControls .carousel-inner").animate({ scrollLeft: scrollPosition }, 600);
            }
        }
    );
    $("#carouselExampleControls .carousel-control-prev").unbind();
    $("#carouselExampleControls .carousel-control-prev").on(
    "click",
        function () {
            if (scrollPosition > 0) {
            scrollPosition -= cardWidth;
            $("#carouselExampleControls .carousel-inner").animate({ scrollLeft: scrollPosition }, 600);
            }
        }
    );
    } else {
        $(multipleCardCarousel).addClass("slide");
    }
}