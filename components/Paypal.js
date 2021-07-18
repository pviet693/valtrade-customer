import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default class Paypal extends React.Component {
    render() {
        const onSuccess = (payment) => {
            console.log("The payment was succeeded!", payment);
            this.props.onSuccess(payment);
        }
 
        const onCancel = (data) => {
            console.log('The payment was cancelled!', data);
            
        }
 
        const onError = (err) => {
            console.log("Error!", err);
        }
 
        let env = 'sandbox'; 
        let currency = 'USD'; 
        let total = this.props.toPay; 

        const client = {
            sandbox:    'AQHBZh9C9n2QKRFjtuxsWRnaCXqkKtGddwbUdjl12LNlR0gjlqeQWZOksF9RiqjDI-Gg0pvy4Vc--799',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        return (
            <PaypalExpressBtn env={env} client={client} currency={currency} total={total} onError={onError} onSuccess={onSuccess} onCancel={onCancel}
             style={{size: 'large', color: 'blue', shape: 'rect', label: 'checkout'}}
            />
        );
    }
}