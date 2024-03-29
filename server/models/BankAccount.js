const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    typeAccount: {
      type: String,
    },
    bank: {
      type: String,
    },
    active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('BankAccount', schema);
