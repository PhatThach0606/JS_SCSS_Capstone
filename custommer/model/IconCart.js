function getId(id) {
  return document.getElementById(id);
}
const openCartBtn = getId("openCart");
const closeCartBtn = getId("closeCart");
const cart = getId("cartShopping");

openCartBtn.addEventListener("click", function () {
  cart.classList.remove("translate-x-full");
  cart.classList.add("translate-x-0");
});

closeCartBtn.addEventListener("click", function () {
  cart.classList.remove("translate-x-0");
  cart.classList.add("translate-x-full");
});
// Thanh toán
const closeThanhToan = getId("thanhtoan");
closeThanhToan.addEventListener("click", function () {
  cart.classList.remove("translate-x-0");
  cart.classList.add("translate-x-full");
});
