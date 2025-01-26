import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';

const authSchema: mongoose.Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    braintreeID: { type: String },
  },
  {
    virtuals: {
      fullName: {
        get() {
          return this.firstName + ' ' + this.lastName;
        },
      },
    },
  }
);

export const adminModel = mongoose.model('Admins', authSchema);
export const customerModel = mongoose.model('Users', authSchema);
