((paymentService, paypal, mongoService, orderId) => {
    require('./config.js').SetConfig(paypal);

    paymentService.CreateItemObj = (name, quantity, price) => {
        const itemObj = {
            name: name,
            price: price,
            currency: 'USD',
            quantity: quantity
        }
        return itemObj;
    }

    paymentService.CreateTransactionObj = (tax, shipping, description, itemList) => {
        let total = 0.0;
        for (let i = 0; i < itemList.length; i++) {
            let newQuantity = itemList[i].quantity;
            if (newQuantity > 1) {
                total += itemList[i].price * newQuantity;
            } else {
                total = itemList[i].price;
            }
        }

        let transactionObj = {
            amount: {
                total: total,
                currency: 'USD',
                details: {
                    tax: tax,
                    shipping: shipping
                }
            },
            description: description,
            item_list: { items: itemList }
        }
        return transactionObj;
    };
    paymentService.CreateWithPaypal = (transactionsArray, returnUrl, cancelUrl, cb) => {
        let dbObj = {
            orderId: "",
            createtime: "",
            transactions: ""
        }

        mongoService.Create('paypal_orders', dbObj, (err, results) => {
            let paymentObj = {
                intent: "sale",
                payer: {
                    payment_method: "paypal"
                },
                redirect_urls: {
                    return_url: returnUrl + '/' + results.insertedIds[0],
                    cancel_url: cancelUrl + '/' + results.insertedIds[0]
                },
                transactions: transactionsArray
            };

            paypal.payment.create(paymentObj, (err, response) => {
                if (err) {
                    return cb(err);
                } else {
                    dbObj = {
                        orderId: response.id,
                        createtime: response.create_time,
                        transactions: response.transactions
                    };

                    mongoService.Update('paypal_orders', { _id: results.insertedIds[0] }, dbObj, (err, result) => {
                        for (let i = 0; i < response.links.length; i++) {
                            if (response.links[i].rel == "approve_url") {
                                return cb(null, response.links[i].href)
                            }

                        }
                    })
                }
            })
        });
    }
    paymentService.GetPayment = (paymentId, cb) => {
        paypal.payment.get(paymentId, (err, payment) => {
            if (err) {
                return cb(err);
            } else {
                return cb(null, payment);
            }
        });
    };

    paymentService.ExecutePayment = (payerId, orderId, cb) => {
        let payerObj = { payer_id: payerId };
        mongoService.Read('paypal_orders', { _id: new ObjectId(orderId) }, (err, order) => {
            if (!order) {
                return cb("No Order found with this ID!")
            }
            paypal.payment.execute(results[0].orderId, payerObj, {}, (err, results) => {
                if (err) {
                    return cb(err);
                }
                let updateObj = {
                    orderDetails: response
                }
                mongoService.Update('paypal_orders', { _id: new ObjectId(orderId) }, updateObj, (err, update_results) => {
                    return cb(null, orderId)
                })
            })
        })
    }

    paymentService.RefundPayment = (sellId, amount, cb) => {
        let data = {
            amount: {
                currency: "USD",
                total: amount
            }
        }

        paypal.sale.refund(saleId, data, (err, refund)=>{
            if(err){
                return cb(err);
            }
            return cb(null, refund);
        });
    }
})
    (
        module.exports,
        require('paypal-rest-sdk'),
        require('./mongoService'),
        require('mongodb').ObjectID
    )