import { log } from "console";
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { braintreeGateway } = await import(`./conf${EXT}`);
const { PaymentModel } = await import(`./payment.model${EXT}`);

class PaymentServices {
  userData: any;

  constructor(userData = null) {
    this.userData = userData;
  }

  async initPaymentList() {
    const newUser: any = {
      userID: this.userData.ID,
      transactions: [],
    };

    const newPaymentList = new PaymentModel(newUser);
    return newPaymentList;
  }

  async createCustomerBraintree() {
    const newCustomer = await braintreeGateway.customer.create({
      id: this.userData.id,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      phone: this.userData.phone,
    });
    // log("newCustomer", newCustomer.customer);
    return newCustomer.customer;
  }

  async transactionWithCardData(amount: number, cardData: any) {
    try {
      const transaction = await braintreeGateway.transaction.sale({
        amount: amount,
        creditCard: {
          number: cardData.number,
          expirationDate: cardData.expirationDate,
          cvv: cardData.cvv,
        },
        customer: {
          firstName: this.userData.firstName,
          email: this.userData.email,
        },
        options: {
          submitForSettlement: true, // Automatically settle the transaction
        },
      });
      if (transaction.success) {
        const targetPaymentList = await PaymentModel.findOne({
          userID: this.userData.ID,
        });
        const transactionList = await targetPaymentList.transactions;
        transactionList.push({
          transactionID: transaction.transaction.id,
          transctionData: transaction.transaction.createdAt,
          transctionAmount: amount,
          paymentTool: "braintree",
        });
        log(transaction.transaction.id);
        return {
          msg: "Transaction Successed",
          transactionBeraintree: transaction,
          targetPaymentList: targetPaymentList,
        };
      }
    } catch (error) {
      log(error);
      // throw new Error("Faild to save transaction");
    }
  }
}

export default PaymentServices;
