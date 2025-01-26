class ProdcutValidator {
  static validateCreateProduct = {
    productName: {
      isLength: {
        options: {
          min: 3,
        },
        errorMessage: "Porduct name can't be less than 3 letters",
      },
      notEmpty: { errorMessage: "Porduct name Can't be empty" },
      isString: { errorMessage: "Porduct name should to be string" },
      matches: {
        options: /^[a-zA-Z0-9\s\-_&.,]+$/,
        errorMessage:
          "Porduct name must contain only letters (uppercase and lowercase), numbers, hyphens, and pipes'",
      },
    },
    price: {
      notEmpty: { errorMessage: "price Can't be empty" },
      isNumeric: { errorMessage: "price should be number" },
    },
    inventory: {
      notEmpty: { errorMessage: "inventory Can't be empty" },
      isNumeric: { errorMessage: "inventory should be number" },
    },
    category: {
      notEmpty: { errorMessage: "category Can't be empty" },
      isString: { errorMessage: "category should be string" },
    },
  };

  static validateModifyProduct = {
    newValue: {
      notEmpty: { errorMessage: "newValue Can't be empty" },
    },
    fieldName: {
      notEmpty: { errorMessage: "fieldName Can't be empty" },
      isString: { errorMessage: "fieldName should be number" },
      matches: {
        options: /^[a-zA-Z\s]+$/,
        errorMessage: "fieldName should to contain letters only",
      },
    },
  };
}

export default ProdcutValidator;
