((paymentService, paypal, mongoService) => {
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
                details:{
                    tax: tax,
                    shipping: shipping
                }
            },
            description: description,
            item_list: {items: itemList}
        }
        return transactionObj;
    }
})
    (
        module.exports,
        require('paypal-rest-sdk'),
        require('./mongoService')
    )