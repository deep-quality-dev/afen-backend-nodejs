const mongoose = require('mongoose');

const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nft: {
      type: Schema.Types.ObjectId,
      ref: 'Nft',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Transaction', TransactionSchema);
