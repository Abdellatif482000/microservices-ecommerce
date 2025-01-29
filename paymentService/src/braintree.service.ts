import { log } from "console";
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { braintreeGateway } = await import(`./conf${EXT}`);

class BraintreeServices {
  userData: any;

  constructor(userData = null) {
    this.userData = userData;
  }

  async createCustomer() {
    const newCustomer = await braintreeGateway.customer.create({
      firstName: "asdJen",
      lastName: "Smith",
      company: "Braintree",
      email: "jen@example.com",
      phone: "312.555.1234",
      fax: "614.555.5678",
      website: "www.example.com",
    });
    // log("newCustomer", newCustomer.customer);
    return newCustomer.customer;
  }
}

export default BraintreeServices;
