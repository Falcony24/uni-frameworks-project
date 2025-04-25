const mongoose = require("mongoose");
const { compare, hash } = require("bcrypt");

exports.isAdmin = (user) => user?.role === "ADMIN";

exports.validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.findUserById = async (Users, id, projection = "") => {
    return await Users.findById(id).select(projection);
};

exports.updateDocument = async (Model, query, data) => {
    return await Model.findOneAndUpdate(query, { $set: data }, { returnDocument: 'after' });
};

exports.replaceOrUpsert = async (Model, query, data) => {
    return await Model.findOneAndReplace(query, data, { new: true, upsert: true });
};

exports.verifyPasswordChange = async (userId, UsersModel, oldPass, newPass) => {
    const user = await UsersModel.findById(userId).select("password");
    if (!user || !(await compare(oldPass, user.password))) return null;
    return await hash(newPass, 12);
};
