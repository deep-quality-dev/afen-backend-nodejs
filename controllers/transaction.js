const _ = require('lodash');

const Transaction = require('../models/transaction');
const Query = require('../utils/query');

exports.create = async (req, res, next) => {
  try {
    const transaction = new Transaction({
      type: req.body.type,
      price: req.body.price,
      user: req.body.userId,
      nft: req.body.nftId,
    });

    const { _id } = await transaction.save();

    const newTransaction = await Transaction.find({ _id })
      .populate({
        path: 'user',
        model: 'User',
        select:
          '_id name email portfolio instagram twitter discription avatar banner wallet',
      })
      .populate({
        path: 'nft',
        model: 'Nft',
        select:
          '_id nftId fileHash path title royalty description isAuction afenPrice bnbPrice minimumBid height width depth wallet isVerified',
      });

    res.json({ transaction: newTransaction });
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { pageNo, numPerPage, filter, sort } = req.body;

    let query = {};

    if (filter.type) {
      query = {
        ...query,
        type: Query.getQueryByField(Query.OPERATORS.EQ, filter.type),
      };
    }
    if (filter.userId) {
      query = {
        ...query,
        user: Query.getQueryByField(Query.OPERATORS.EQ, filter.userId),
      };
    }
    if (filter.nftId) {
      query = {
        ...query,
        nft: Query.getQueryByField(Query.OPERATORS.EQ, filter.nftId),
      };
    }
    if (filter.price) {
      query = {
        ...query,
        price: Query.getQueryByField(Query.OPERATORS.EQ, filter.price),
      };
    }

    const transactionList = await Transaction.find(query)
      .populate({
        path: 'user',
        model: 'User',
        select:
          '_id name email portfolio instagram twitter discription avatar banner wallet createdAt updatedAt',
      })
      .populate({
        path: 'nft',
        model: 'Nft',
        select:
          '_id nftId fileHash path title royalty description isAuction afenPrice bnbPrice minimumBid height width depth wallet isVerified createAt updatedAt',
      })
      .sort(_.isEmpty(sort) ? { createdAt: -1 } : sort)
      .limit(numPerPage)
      .skip((pageNo - 1) * numPerPage)
      .exec();

    const total = await Transaction.count(query);

    res.json({
      total,
      numPerPage,
      pageNo,
      list: transactionList,
    });
  } catch (e) {
    next(e);
  }
};
