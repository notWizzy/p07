/* jshint node: true */

// We use Mongoose to define the schema stored in MongoDB.
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Get the models we used in the previous projects.
var models = require("./modelData/photoApp.js").models;

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require("./schema/user.js");
var Photo = require("./schema/photo.js");
var SchemaInfo = require("./schema/schemaInfo.js");

var versionString = "1.0";

// Start by removing anything existing in the collections.
var removePromises = [
    User.deleteMany({}),
    Photo.deleteMany({}),
    SchemaInfo.deleteMany({}),
];

Promise.all(removePromises)
    .then(function () {
        var userModels = models.userListModel();
        var mapFakeId2RealId = {};
        var userPromises = userModels.map(function (user) {
            return User.create({
                first_name: user.first_name,
                last_name: user.last_name,
                location: user.location,
                description: user.description,
                occupation: user.occupation,
                login_name: user.last_name.toLowerCase(),
                password: "weak",
            })
                .then(function (userObj) {
                    mapFakeId2RealId[user._id] = userObj._id;
                    user.objectID = userObj._id;
                    console.log(
                        "Adding user:",
                        user.first_name + " " + user.last_name,
                        " with ID ",
                        user.objectID
                    );
                })
                .catch(function (err) {
                    console.error("Error create user", err);
                });
        });

        var allPromises = Promise.all(userPromises).then(function () {
            var photoModels = [];
            var userIDs = Object.keys(mapFakeId2RealId);
            for (var i = 0; i < userIDs.length; i++) {
                photoModels = photoModels.concat(
                    models.photoOfUserModel(userIDs[i])
                );
            }
            var photoPromises = photoModels.map(function (photo) {
                return Photo.create({
                    file_name: photo.file_name,
                    date_time: photo.date_time,
                    user_id: mapFakeId2RealId[photo.user_id],
                })
                    .then(function (photoObj) {
                        photo.objectID = photoObj._id;
                        if (photo.comments) {
                            photo.comments.forEach(function (comment) {
                                photoObj.comments = photoObj.comments.concat([
                                    {
                                        comment: comment.comment,
                                        date_time: comment.date_time,
                                        user_id: comment.user.objectID,
                                    },
                                ]);
                                console.log(
                                    "Adding comment of length %d by user %s to photo %s",
                                    comment.comment.length,
                                    comment.user.objectID,
                                    photo.file_name
                                );
                            });
                        }
                        console.log(
                            "Adding photo:",
                            photo.file_name,
                            " of user ID ",
                            photoObj.user_id
                        );
                    })
                    .catch(function (err) {
                        console.error("Error create photo", err);
                    });
            });
            return Promise.all(photoPromises).then(function () {
                return SchemaInfo.create({
                    version: versionString,
                })
                    .then(function (schemaInfo) {
                        console.log(
                            "SchemaInfo object created with version ",
                            schemaInfo.version
                        );
                    })
                    .catch(function (err) {
                        console.error("Error create schemaInfo", err);
                    });
            });
        });

        allPromises.then(function () {
            mongoose.disconnect();
        });
    })
    .catch(function (err) {
        console.error("Error creating schemaInfo", err);
    });
