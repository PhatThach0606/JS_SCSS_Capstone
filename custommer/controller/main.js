import service from "../services/api.js";
import product from "../services/product.js";
function getId(id) {
  return document.getElementById(id);
}
// Hidden quantity cart
getId("quantity").style.display = "none";
// Render Product
function renderProduct(data) {
  let contenHTML = "";
  for (let i = 0; i < data.length; i++) {
    let product = data[i];
    contenHTML += `
    <div class="w-full max-w-sm rounded-2xl shadow-md ring-1 ring-gray-200 overflow-hidden">
  <div class="flex flex-col items-center">
    <!-- Chỉ đặt aspect ratio cho ảnh -->
    <div class="w-full aspect-[] overflow-hidden">
      <img src="./../../asset/image/${product.img}" alt="${
      product.name
    }" class="w-full h-full object-cover" loading="lazy"/>
    </div>
    <div class="w-full px-6 pt-4 pb-6">
      <h2 class="text-lg font-semibold">${product.name}</h2>
      <h5 class=""> ${product.type}</h5>
      <p class="mt-1 font-medium text-rose-600">
        ${(product.price * 1000).toLocaleString("vi-VN")} ₫
      </p>
      <div class="text-sm text-gray-600 line-clamp-3">${product.desc}</div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-5">
        <button
          type="button"
          onclick="addToCart(${product.id})"
          class="cursor-pointer rounded-xl px-2  py-2 bg-amber-300 w-full sm:w-auto">
          Thêm vào 🛒
        </button>

        <button
          type="button"
          class="hidden md:block cursor-pointer rounded-xl px-4 py-2 bg-blue-400 w-full sm:w-auto">
          Mua
        </button>
      </div>
    </div>
  </div>
</div>
    `;
    getId("render").innerHTML = contenHTML;
  }
}
let allProducts = []; // lưu tất cả sản phẩm khi load
// load product
function getListProduct() {
  service
    .fetchData()
    .then((result) => {
      allProducts = result.data; // lưu sản phẩm gốc
      renderProduct(allProducts);
    })
    .catch((error) => {
      console.log(error);
    });
}
getListProduct();
// add product
// giỏ hàng
let cartShoping = [];
getLocalStorange();
function addToCart(id) {
  const promise = service.getIdData(id);
  promise
    .then((result) => {
      const prodcut = result.data;
      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const itemInCart = cartShoping.find(
        (item, index) => item.id === prodcut.id
      );

      if (itemInCart) {
        itemInCart.quantity += 1;
      } else {
        cartShoping.push({ ...prodcut, quantity: 1 });
      }
      quantityCart();
      renderCart();
      setLocoStorange();
    })
    .catch((error) => {
      console.log(error);
    });
}
window.addToCart = addToCart;
// quantity Cart
function quantityCart() {
  let quantity = cartShoping.length;
  if (quantity >= 1) {
    getId("quantity").style.display = "block";
    getId("quantity").innerHTML = quantity;
  } else {
    getId("quantity").style.display = "none";
  }
}
// set local storange
function setLocoStorange() {
  const dataString = JSON.stringify(cartShoping);
  localStorage.setItem("PRODUCT", dataString);
}
// get local storange
function getLocalStorange() {
  const dataString = localStorage.getItem("PRODUCT");
  if (!dataString) return;
  const dataJson = JSON.parse(dataString);
  cartShoping = dataJson;
  quantityCart();
  renderCart();
}
// render ra giỏ hàng
function renderCart() {
  let product = "";
  cartShoping.forEach((item, index) => {
    product += `
    <div class="cart-list max-w-3xl mx-auto p-4 bg-gray-50 rounded-xl shadow-md">
  <!-- Danh sách sản phẩm có scroll -->
  <div class="cart-items space-y-4 max-h-96 overflow-y-auto pr-2">
    
    <!-- Một sản phẩm -->
    <div class="cart-item flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
      
      <!-- Ảnh sản phẩm -->
      <img src="./../../asset/image/${item.img}" alt="${item.name}" class="cart-img w-32 h-32 object-cover rounded-xl border"/>

      <!-- Thông tin sản phẩm -->
      <div class="cart-infor flex flex-col flex-1 text-center sm:text-left">
        <h3 class="text-lg font-semibold text-gray-800">Tên sản phẩm: ${item.name}</h3>
        <p class="text-gray-600">Giá: ${item.price}</p>
        <p class="text-gray-600">Số lượng: ${item.quantity}</p>

        <!-- Các nút thao tác -->
        <div class="flex justify-center sm:justify-start gap-2 mt-3">
          <button onclick="increaseSP(${item.id})"
            class="font-bold text-xl px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer">+</button>
          <button onclick="decreaseSP(${item.id})"
            class="font-bold text-xl px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer">-</button>
          <button onclick="deleteSP(${item.id})"
            class="font-semibold  px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer">Xóa</button>
        </div>
      </div>
    </div>

  </div>
</div>
    `;
  });
  getId("cartItem").innerHTML = product;
  const total = cartShoping.reduce((sum, item) => {
    const result = sum + item.price * item.quantity;
    return result;
  }, 0);
  getId("cartTotal").innerHTML = `Tổng tiền: ${total}`;
}
// handle add quantity
window.increaseSP = increaseSP;
function increaseSP(id) {
  const product = cartShoping.find((item) => item.id == id);
  if (product) {
    product.quantity++;
  }
  setLocoStorange();
  renderCart();
}
// handle subtract
function decreaseSP(id) {
  const product = cartShoping.find((item) => item.id == id);
  if (product) {
    product.quantity--;
    if (product.quantity == 0) {
      deleteSP(id);
    }
  }
  setLocoStorange();
  renderCart();
}
window.decreaseSP = decreaseSP;
// handel delete
// Chỗ này đang bị lỗi, cần lưu dưới localstorange trước rồi khi delete thì xóa khỏi localstorange rồi render lại
function findIndex(id) {
  let index = -1;
  for (let i = 0; i < cartShoping.length; i++) {
    const product = cartShoping[i];
    if (product.id === id) {
      index = i;
    }
  }
}

function deleteSP(id) {
  let index = findIndex(id);
  if (index !== -1) {
    cartShoping.splice(index, 1);
    setLocoStorange();
    renderCart();
    quantityCart();
  }
}
window.deleteSP = deleteSP;
// Lọc sản phẩm
const filterProduct = (type) => {
  if (type === "all") return allProducts;
  return allProducts.filter((product) => product.type === type);
};
getId("rating").addEventListener("change", function () {
  const type = getId("rating").value;
  const productType = filterProduct(type);
  renderProduct(productType);
});
// Tìm kiếm sản phẩm
function searchProduct(keyword) {
  let ListSearchProduct = [];
  for (let i = 0; i < allProducts.length; i++) {
    const Product = allProducts[i];
    let nameProduct = Product.name;
    let nameProductLowerCase = nameProduct.toLowerCase();
    let nameKeyWordLowerCase = keyword.toLowerCase();
    if (nameProductLowerCase.indexOf(nameKeyWordLowerCase) > -1) {
      ListSearchProduct.push(Product);
    }
  }
  return ListSearchProduct;
}
getId("searchProduct").addEventListener("keyup", function () {
  const keyword = getId("searchProduct").value;
  const ProductSearch = searchProduct(keyword);
  renderProduct(ProductSearch);
});
// Clear Cart
getId("thanhtoan").addEventListener("click", function () {
  cartShoping.splice(0, cartShoping.length);
  console.log(cartShoping.length);
  getId("quantity").style.display = "none";
  setLocoStorange();
  renderCart(cartShoping);
});
