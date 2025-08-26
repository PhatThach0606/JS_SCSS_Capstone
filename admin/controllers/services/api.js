class Service {
    fetchListData() {
        const promise = axios({
            url: "https://688b65ac2a52cabb9f5195c6.mockapi.io/api/products",
            method: "GET",
        });
        return promise;
    };
    deleteProductApi(id) {
        const promise = axios({
            url: `https://688b65ac2a52cabb9f5195c6.mockapi.io/api/products/${id}`,
            method: "DELETE",
        });
        return promise;
    };
    addProductApi(product) {
        const promise = axios({
            url: `https://688b65ac2a52cabb9f5195c6.mockapi.io/api/products`,
            method: "POST",
            data: product,
        });
        return promise;
    };
    getProductByIdApi(id) {
        const promise = axios({
            url: `https://688b65ac2a52cabb9f5195c6.mockapi.io/api/products/${id}`,
            method: "GET",
        });
        return promise;
    };
    updateProductApi(product) {
        const promise = axios({
            url: `https://688b65ac2a52cabb9f5195c6.mockapi.io/api/products/${product.id}`,
            method: "PUT",
            data: product,
        });
        return promise;
    }
};

export default new Service();