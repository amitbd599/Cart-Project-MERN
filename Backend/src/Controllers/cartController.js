const JWT = require("jsonwebtoken");
const cartModel = require("../Models/cartModel");
const mongoose = require("mongoose");


//! create-cart
exports.createCart = async (req, res) => {
  try {
    let reqBody = req.body;
    let data = await cartModel.create(reqBody);
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(500).json({ status: "error", error: e });
  }
};

//! Get Cart List
exports.getAllCartList = async (req, res) => {
  try {
    let Token = req.headers["token"];
    let dataToken = await JWT.verify(
      Token,
      `${process.env.JWT_AUTH_SECRET_KEY}`
    );

    let email = dataToken["data"];
    console.log(email);
    let data = await cartModel.aggregate([
      { $match: { user_email: email } },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "cartList",
        },
      },
      {
        $project: {
          "_id": 0,
          "user_email": 1,
          "product_id": 1,
          "cartList": 1,
        },
      },
      {
        $unwind: "$cartList",
      },
    ]);
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e });
  }
};


//! Delete Cart Product

exports.deleteCart = async (req, res) => {
  try {
    let id = mongoose.Types.ObjectId(req.params.id);
    let query = { _id: id };
    let data = await cartModel.remove(query);
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e });
  }
};