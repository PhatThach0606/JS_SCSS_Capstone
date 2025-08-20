class Service {
  fetchData() {
    const promise = axios({
      url: "https://688b65ac2a52cabb9f5195c6.mockapi.io/api/products",
      method: "GET",
    });
    return promise;
  }
  getIdData(id) {
    const promise = axios({
      url: `https://688b65ac2a52cabb9f5195c6.mockapi.io/api/products/${id}`,
      method: "GET",
    });
    return promise;
  }
  deleteData(id) {
    const promise = axios({
      url: `https://688b65ac2a52cabb9f5195c6.mockapi.io/api/products/${id}`,
      method: "DELETE",
    });
    return promise;
  }
}
export default new Service();
