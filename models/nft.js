const mongoose = require('mongoose');

const { Schema } = mongoose;
const NftSchema = new Schema(
  {
    nftId: {
      type: String,
    },
    fileHash: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    royalty: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isAuction: {
      type: Boolean,
      default: false,
    },
    afenPrice: {
      type: Number,
    },
    bnbPrice: {
      type: Number,
    },
    minimunBid: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    depth: {
      type: Number,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
    },
    canSell: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Nft', NftSchema);
