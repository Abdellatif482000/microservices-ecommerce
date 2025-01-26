// import ProductModel from "./product.model.js";
// import { validateReqData } from "./validate.utils.js";
import { validationResult } from "express-validator";
import type { Request, Response } from "express"; // Import only the types

// --------------------------------
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: ProductModel } = await import(`./product.model${EXT}`);
const { validateReqData } = await import(`./validate.utils${EXT}`);
// --------------------------------

class ProductController {
  static async createProduct(req: Request, res: Response) {
    try {
      // check vaildity
      const dataValidation = await validateReqData(req);
      // -----------------------------------
      if (dataValidation.message === "not valid")
        res.status(400).json(dataValidation);
      // -----------------------------------
      if (dataValidation.message === "valid") {
        const newProduct = new ProductModel(req.body);

        const savedProduct = await newProduct.save();
        res
          .status(200)
          .json({ message: "Product Created", product: savedProduct });
      }
    } catch (error: any) {
      console.log(error);

      res.status(400).send(error.errorResponse);
    }
  }

  static async getProductsByCategory(req: Request, res: Response) {
    try {
      const getAllProducts = await ProductModel.find();
      let founedProducts: any[] = [];
      getAllProducts.forEach((product: any) => {
        if (product.category === req.params.category) {
          founedProducts.push(product);
          console.log(founedProducts);
        }
      });
      if (founedProducts.length === 0) {
        res.status(200).json({ message: "no Products found" });
      } else {
        res
          .status(200)
          .json({ message: "Products found", category: founedProducts });
      }
    } catch (error: any) {
      console.log(error);

      res
        .status(400)
        .json({ message: "Products not found", error: error.errorResponse });
    }
  }
  static async getSingleProduct(req: Request, res: Response) {
    const getProduct = await ProductModel.findOne({ _id: req.params.prodID });
    if (getProduct) {
      res.status(200).json({ message: "Product found", product: getProduct });
    } else {
      res.status(200).json({ message: "no Product found" });
    }
  }

  static async modifyProduct(req: Request, res: Response) {
    try {
      const vaildatorRes: any = validationResult(req);
      if (vaildatorRes.isEmpty()) {
        // check vaildity
        const { prodID, newValue, fieldName } = req.body;

        if (!ProductModel.schema.paths[fieldName]) {
          res.status(200).json({
            massege: `Field name ${fieldName} doesn't exist`,
          });
        } else {
          const updatedProdcut = await ProductModel.findOneAndUpdate(
            { _id: prodID },
            { $set: { [fieldName]: newValue } },
            { new: true }
          );
          console.log(updatedProdcut);
          res.status(200).json({
            massege: "Product Updated",
            updatedProdcut: updatedProdcut,
          });
        }
      } else {
        //unvaild data
        console.log({ errors: vaildatorRes.array() });

        res
          .status(400)
          .json({ message: "Data not vaild", Error: vaildatorRes });
      }
    } catch {
      res.status(400).json({ error: Error });
    }
  }
  static async deleteProduct(req: Request, res: Response) {
    const { prodID } = req.body;
    const deletedPoduct = await ProductModel.findOneAndDelete({ _id: prodID });
    deletedPoduct
      ? res.status(200).json({ message: "Product deleted" })
      : res.status(400).json({ message: "Product not exist" });
  }
}
export default ProductController;
