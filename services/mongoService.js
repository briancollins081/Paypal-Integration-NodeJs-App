((mongoService, mongodb) => {
    const connectionString = process.env.MongoConnectionString || "mongodb://localhost:27017/paypaltesting";
    const Connect = (cb) => {
        mongodb.connect(connectionString, (err, db) => {
            return cb(err, db, () => {
                db.close();
            });
        })
    };
    mongoService.Create = (collectionName, createObj, cb) => {
        Connect((err, db, close) => {
            db.collection(collectionName).insert(createObj, (err, results) => {
                cb(err, results);
                return close();
            });
        })
    };

    mongoService.Read = (collectionName, readObject, cb) => {
        Connect((err, db, close) => {
            db.collection(collectionName).find(readObject).toArray((err, results) => {
                cb(err, results);
                return close();
            });
        })
    };

    mongoService.Update = (collectionName, findObj, updateObj, cb) => {
        Connect((err, db, close) => {
            db.collection(collectionName).update(findObj, { $set: updateObj }, (err, results) => {
                cb(err, results);
                return close();
            })
        });
    };

    mongoService.Delete = (collectionName, findObj, cb) => {
        Connect((err, db, close) => {
            db.collection(collectionName).remove(findObj, (err, results) => {
                cb(err, results);
                return close();
            });
        })
    }
})
    (
        module.exports,
        require('mongodb')
    )