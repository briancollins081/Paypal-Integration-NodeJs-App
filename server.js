((express, server, bodyParser, fs) => {
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(express.static('public'));

    server.get('/', (req, res) => {
        fs.readFile('./templates/home.html', (err, results) => {
            if (!err) {
                res.send(results.toString());
            }
        });

    })

    server.get('/success/:orderId', (req, res) => {
        const orderId = req.params.orderId;
    })

    server.get('/cancel/:orderId', (req, res) => {
        const orderId = req.params.orderId;
    })

    server.get('/orderDetails/:orderId', (req, res) => {
        const orderId = req.params.orderId;

    })

    server.get('/refund/:orderId', (req, res) => {
        const orderId = req.params.orderId;
    })

    server.get('/recurring_success/:planId', (req, res) => {

    })

    server.get('/recurring_cancel/:planId', (req, res) => {

    })

    server.get('/recurring_orderdetails/:agreementId', (req, res) => {

    })

    server.get('/buysingle', (req, res) => {

    })

    server.get('/buyrecurring', (req, res) => {

    })

    server.listen(8080, 'localhost', (err) => {
        console.log(err || "Server started successfully...");
    })
})
    (
        require('express'),
        require('express')(),
        require('body-parser'),
        require('fs')
    );