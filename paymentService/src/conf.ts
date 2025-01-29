import braintree from "braintree";
export const braintreeGateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "vds2xxzx6cp7m3hq",
  publicKey: "3vgz4xgv4jt3nf32",
  privateKey: "0bd8b3930e1be5b10096e23597c3de92",
});
