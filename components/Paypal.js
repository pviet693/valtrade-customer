import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

const Paypal = ({ toPay, transactionSuccess, transactionError, transactionCanceled }) => {
    const onSuccess = (payment) => {
        console.log("The payment was succeeded!", payment);
        transactionSuccess(payment);
    }

    const onCancel = (data) => {
        console.log('The payment was cancelled!', data);
        transactionCanceled(data);
    }

    const onError = (err) => {
        console.log("Error!", err);
        transactionError(err);
    }

    let env = 'sandbox';
    let currency = 'USD';
    let total = toPay;

    const client = {
        sandbox: 'AbazM8i7jIC1oOqSC70G5SqvPZb7VBz9_9mnNhySJzcIdTPpoaAo6ZV-2TzLiNJ22SPzWEVqq13cjMv7',
        production: 'YOUR-PRODUCTION-APP-ID',
    }

    return (
        <PaypalExpressBtn env={env} client={client} currency={currency} total={total} onError={onError} onSuccess={onSuccess} onCancel={onCancel}
            style={{
                color: 'blue',
                shape: 'rect',
                label: 'paypal',
                size: 'small',
                height: 40,
                tagline: false
            }}
        />
    );
}

export default Paypal;