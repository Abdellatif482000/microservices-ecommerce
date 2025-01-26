class AuthValidator {
  static signupVaildator = {
    email: {
      notEmpty: { errorMessage: "Porduct name Can't be empty" },
      isString: { errorMessage: "Porduct name should to be string" },
      matches: {
        options:
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.(com|net|org|edu|gov|mil|co|info|io|biz|me|app|tv)$/,
        errorMessage:
          "email should contain letters and numbers @ and (com|net|org|edu|gov|mil|co|info|io|biz|me|app|tv)",
      },
    },
    firstName: {
      notEmpty: { errorMessage: "firstName Can't be empty" },
      isString: { errorMessage: "firstName should be string" },
    },
    lastName: {
      notEmpty: { errorMessage: "lastName Can't be empty" },
      isString: { errorMessage: "lastName should be string" },
    },
    password: {
      notEmpty: { errorMessage: "inventory Can't be empty" },
      isString: { errorMessage: "inventory should be number" },
      matches: {
        options:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
        errorMessage: `
        At least 8 characters long ,
        At least one uppercase letter , At least one lowercase letter
        At least one digit
        At least one special character (e.g., !@#$%^&*()),
          `,
      },
    },
  };

  static signinValidator = {
    email: {
      notEmpty: { errorMessage: "Porduct name Can't be empty" },
      isString: { errorMessage: "Porduct name should to be string" },
      matches: {
        options:
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.(com|net|org|edu|gov|mil|co|info|io|biz|me|app|tv)$/,
        errorMessage:
          "email should contain letters and numbers @ and (com|net|org|edu|gov|mil|co|info|io|biz|me|app|tv)",
      },
    },
    password: {
      notEmpty: { errorMessage: "inventory Can't be empty" },
      isString: { errorMessage: "inventory should be number" },
      matches: {
        options:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
        errorMessage: `
        At least 8 characters long ,
        At least one uppercase letter , At least one lowercase letter
        At least one digit
        At least one special character (e.g., !@#$%^&*()),
          `,
      },
    },
  };
}

export default AuthValidator;
