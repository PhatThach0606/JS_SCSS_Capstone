import service from "./services/api.js"
import Product from "../models/product.js";
import Validation from "../models/validation.js";

let listProduct = [];
const valid = new Validation();
// const productList = new ProductList;
export function getId(id) {
    return document.getElementById(id);
}
function getInfoProduct(isAdd) {
    const name = getId("nameSP").value;
    const img = getId("imgSP").value;
    const price = getId("priceSP").value;
    const type = getId("typeSP").value;
    const description = getId("motaSP").value;

    let isValid = true;
    if (isAdd) {

    }
    // Validation 
    isValid &= valid.checkEmpty(name, "validName", "(*) Vui lòng nhập tên sản phẩm");
    isValid &= valid.checkEmpty(img, "validImg", "(*) Vui lòng nhập hình sản phẩm");
    isValid &= valid.checkEmpty(price, "validPrice", "(*) Vui lòng nhập giá sản phẩm");
    isValid &= valid.checkSelectOption("typeSP", "validType", "(*) Vui lòng chọn loại sản phẩm");
    isValid &= valid.checkEmpty(description, "validDescrip", "(*) Vui lòng nhập mô tả sản phẩm");

    if (!isValid) return;

    const product = new Product("", name, img, price, type, description);

    return product;
}
function getListProduct() {
    const promise = service.fetchListData();
    // pending => show loader
    getId("loader").style.display = "block";

    promise
        .then(function (result) {
            console.log(result.data);
            listProduct = result.data;
            renderHTML(result.data);
            // hidden loader
            getId("loader").style.display = "none";
        })
        .catch(function (error) {
            console.log(error);
            // hidden loader
            getId("loader").style.display = "none";
        })

}
getListProduct();
function openModal() {
    const modalEl = document.getElementById("crud-modal");
    const modal = new Modal(modalEl); // Flowbite Modal
    modal.show();
}
function closeModal() {
    const modalEl = document.getElementById("crud-modal");
    const modal = new Modal(modalEl); // Flowbite Modal
    modal.hide();
}

function renderHTML(data) {
    let contentHTML = "";
    for (let i = 0; i < data.length; i++) {
        const product = data[i];
        contentHTML += `
           <tr
                      class="bg-white  border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        ${product.name}
                      </th>
                      <td class="px-6 py-4">
                        <img src="./../../asset/image/${product.img}" alt="" width="50">
                      </td>
                      <td class="px-6 py-4">
                        ${product.type}
                      </td>
                      <td class="px-6 py-4">
                        ${product.price} $
                      </td>
                      <td class="sm:flex-row md:flex lg:flex items-center space-x-2 px-6 py-4 gap-1 align-middle">
                        <button  class="font-medium text-blue-600 dark:text-blue-500 cursor-pointer hover:underline" 
                        data-modal-target="edit-modal" data-modal-toggle="edit-modal" 
                        onclick="onEdit(${product.id})">Sửa</button>
                        <button  class="font-medium text-red-600 dark:text-red-500 cursor-pointer hover:underline" onclick="onDelete(${product.id})">Xóa</button>
                      </td>
            </tr>
        `;
    };
    getId("tlbDanhSachSP").innerHTML = contentHTML;
}


// click btn them san pham 
getId("btnThemSP").addEventListener("click", function () {
    // Open Modal
    openModal()

    // Update Title Modal 
    getId("titleSP").innerHTML = "Them Moi San Pham";

    // Create button "Add Product"
    const btnAddProduct = `    <button  data-modal-toggle="crud-modal"
                              class="block cursor-pointer text-white bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                               onclick="onAddProduct()"
                              type="button">
                              <i class="fa-solid fa-cart-plus"></i>
                              Them moi
                            </button>`
    document.getElementsByClassName("classSubmit")[0].innerHTML = btnAddProduct;
    // reset form 
    resetForm();
})
// btn Close modal 
getId("close-Modal").addEventListener("click", function () {
    closeModal();
})
// Delete Product
function onDelete(id) {
    const promise = service.deleteProductApi(id);
    // pending => show loader
    getId("loader").style.display = "block";

    promise
        .then(function (result) {
            console.log(result);
            getId("loader").style.display = "none";
            getListProduct();
            // loader hidden 
        })
        .catch(function (error) {
            console.log(error);
            getId("loader").style.display = "none";
        })
}
window.onDelete = onDelete;

// Add Product 
function onAddProduct() {
    const product = getInfoProduct();
    // pending => show loader
    if (!product) return;
    getId("loader").style.display = "block";

    // request API 
    service.addProductApi(product)
        .then(function (result) {
            getId("loader").style.display = "none";
            const data = result.data;
            alert(`Add product ${data.name}`);
            // close modal 
            getId("close-Modal").click();
            getListProduct();
        })
        .catch(function (error) {
            getId("loader").style.display = "none";
            console.log(error);
        })

};
window.onAddProduct = onAddProduct;
// Edit Product
function onEdit(id) {
    // Open Modal 
    openModal();
    // Update Title Modal 
    getId("titleSP").innerHTML = "Cap Nhat San Pham";
    // Create button "Update Product"
    const btnUpdateProduct = `<button  data-modal-toggle="crud-modal"
                              class="block cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"           
                              onclick="onUpdateProduct(${id})"                
                              type="button">
                              <i class="fa-solid fa-cart-plus"></i>
                              Cap Nhat
                            </button>`
    document.getElementsByClassName("classSubmit")[0].innerHTML = btnUpdateProduct;
    // pending => show loader
    getId("loader").style.display = "block";

    service.getProductByIdApi(id)
        .then(function (result) {
            getId("loader").style.display = "none";
            const data = result.data;
            getId("nameSP").value = data.name;
            getId("imgSP").value = data.img;
            getId("priceSP").value = data.price;
            getId("typeSP").value = data.type;
            getId("motaSP").value = data.description;
        })
        .catch(function (error) {
            console.log(error);
            getId("loader").style.display = "none";

        })

}
window.onEdit = onEdit;

// Update Product
function onUpdateProduct(id) {
    const name = getId("nameSP").value;
    const img = getId("imgSP").value;
    const price = getId("priceSP").value;
    const type = getId("typeSP").value;
    const description = getId("motaSP").value;


    const product = new Product(id, name, img, price, type, description);

    if (!product) return;
    // pending => show loader
    getId("loader").style.display = "block";

    console.log(product);
    service.updateProductApi(product)
        .then(function (result) {
            getId("loader").style.display = "none";
            const data = result.data;
            // alert(`Update ${data.name} success`);

            // close modal 
            getId("close-Modal").click();

            // re-render listProduct 
            getListProduct();

        })
        .catch(function (error) {
            getId("loader").style.display = "none";
            console.log(error);
        })
}
window.onUpdateProduct = onUpdateProduct;

function getListProductToFilter() {
    const promise = service.fetchListData();
    // pending => show loader
    promise
        .then(function (result) {
            listProduct = result.data;
        })
        .catch(function (error) {
            console.log(error);
            // hidden loader
            getId("loader").style.display = "none";
        })

    return listProduct;
}

// Filter Price Product Function
function filterProduct(listProduct, type) {
    let productFilter = listProduct;
    if (type === "allPrice") return listProduct;
    if (type === "higherPrice") {
        productFilter.sort((a, b) => b.price - a.price)
    }
    else {
        productFilter.sort((a, b) => a.price - b.price);
    };
    return productFilter;
}
// Filter Price Product Event
getId("sortPrice").addEventListener("change", function () {
    const type = getId("sortPrice").value;
    const listProduct = getListProductToFilter();
    const productFiltered = filterProduct(listProduct, type);
    renderHTML(productFiltered);
})
// Search Product Function 
function searchProduct(listProduct, keyword) {
    let productSearch = [];
    for (let i = 0; i < listProduct.length; i++) {
        const product = listProduct[i];
        const keyWordToLowerCase = keyword.toLowerCase();
        const nameProductToLowerCase = product.name.toLowerCase();
        if (nameProductToLowerCase.includes(keyWordToLowerCase)) {
            productSearch.push(product);
        }
    }
    return productSearch;
};
// Search Product Event 
getId("table-search").addEventListener("keyup", function () {
    const keyword = getId("table-search").value;
    const listProduct = getListProductToFilter();
    const productSearch = searchProduct(listProduct, keyword);
    renderHTML(productSearch);
});

// reset form 
function resetForm() {
    getId("product-form").reset();
}



