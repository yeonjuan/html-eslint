document.querySelectorAll("[data-nav]").forEach((elem) => {
  if (window.location.pathname.indexOf(elem.dataset.nav) === 0) {
    elem.dataset.navActive.split(" ").forEach((cls) => {
      elem.classList.add(cls);
    });
  }
});

const $overlay = document.getElementById("overlay");
const $menu = document.getElementById("menu");

function openOverlay() {
  $overlay.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeOverlay() {
  $overlay.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

$menu.addEventListener("change", (event) => {
  if (event.target.checked) {
    openOverlay();
  } else {
    closeOverlay();
  }
});

$overlay.addEventListener("click", (event) => {
  $menu.checked = false;
  closeOverlay();
});

const $navButton = document.getElementById("nav-button");

function toggleMenu() {
  const $nav = document.getElementById("nav");
  $nav.classList.toggle("hidden");
}

if ($navButton) {
  $navButton.addEventListener("click", toggleMenu);
}
