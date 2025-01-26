const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: ProductModel } = await import(
  `../../productService/src/product.model${EXT}`
);

// ----------------------------

class ProductService {
  prodID: string;
  constructor(prodID = "") {
    this.prodID = prodID;
  }

  async getSingleProduct() {
    const getProduct = await ProductModel.findOne({ _id: this.prodID });
    return getProduct;
  }
}

export default ProductService;
