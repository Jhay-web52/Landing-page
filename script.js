// Mobile menu toggle
document.getElementById("mobile-menu").addEventListener("click", function () {
  document.querySelector(".nav-links").classList.toggle("active");
});

// Close menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("active");
  });
});
