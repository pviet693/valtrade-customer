import SimpleSchema from 'simpl-schema';
import { URL } from 'url';
import * as common from '../utils/common';

class VNPay {
    constructor(config) {
        this.config = Object.assign({}, config);
        VNPay.configSchema.validate(this.config);
    }

    buildCheckoutUrl(payload) {
        return new Promise((resolve, reject) => {
            const data = Object.assign({}, this.checkoutPayloadDefaults, payload);
            const config = this.config;

            data.vnpSecretKey = config.secureSecret;
            data.vnpMerchant = config.merchant;

            try {
                this.validateCheckoutPayload(data);
            } catch (error) {
                reject(error.message);
            }

            data.amount = Math.floor(data.amount * 100);

            const arrParam = {
                vnp_Version: data.vnpVersion,
                vnp_Command: data.vnpCommand,
                vnp_TmnCode: data.vnpMerchant,
                vnp_Locale: data.locale,
                vnp_BankCode: data.bankCode,
                vnp_CurrCode: data.currency,
                vnp_TxnRef: data.orderId,
                vnp_OrderInfo: data.orderInfo,
                vnp_OrderType: data.orderType,
                vnp_Amount: String(data.amount),
                vnp_ReturnUrl: data.returnUrl,
                vnp_IpAddr: data.clientIp,
                vnp_CreateDate: data.createdDate || common.vnPayDateFormat(new Date()),
            };

            const redirectUrl = new URLSearchParams(config.paymentGateway);
            const secureCode = [];

            Object.keys(arrParam)
                .sort()
                .forEach(key => {
                    const value = arrParam[key];

                    if (value == null || value.length === 0) {
                        return;
                    }

                    redirectUrl.searchParams.append(key, value);

                    if (value.length > 0 && (key.substr(0, 4) === 'vnp_' || key.substr(0, 5) === 'user_')) {
                        secureCode.push(`${key}=${value}`);
                    }
                });

            if (secureCode.length > 0) {
                redirectUrl.searchParams.append('vnp_SecureHashType', 'MD5');
                redirectUrl.searchParams.append('vnp_SecureHash', common.createMd5Hash(data.vnpSecretKey + secureCode.join('&')));
            }

            resolve(redirectUrl);
        });
    }

    validateCheckoutPayload(payload) {
        VNPay.checkoutSchema.validate(payload);
    }

    get checkoutPayloadDefaults() {
        return {
            currency: VNPay.CURRENCY_VND,
            locale: VNPay.LOCALE_VN,
            vnpVersion: VNPay.VERSION,
            vnpCommand: VNPay.COMMAND,
        };
    }

    verifyReturnUrl(query) {
        return new Promise(resolve => {
            const returnObject = this._mapQueryToObject(query);

            const data = Object.assign({}, query);
            const config = this.config;
            const vnpTxnSecureHash = data.vnp_SecureHash;
            const verifyResults = {};
            delete data.vnp_SecureHashType;
            delete data.vnp_SecureHash;

            if (config.secureSecret.length > 0) {
                const secureCode = [];

                Object.keys(data)
                    .sort()
                    .forEach(key => {
                        const value = data[key];

                        if (value.length > 0 && (key.substr(0, 4) === 'vnp_' || key.substr(0, 5) === 'user_')) {
                            secureCode.push(`${key}=${value}`);
                        }
                    });

                if (common.toUpperCase(vnpTxnSecureHash) === common.toUpperCase(common.createMd5Hash(config.secureSecret + secureCode.join('&')))) {
                    verifyResults.isSuccess = returnObject.responseCode === '00';
                } else {
                    verifyResults.isSuccess = false;
                    verifyResults.message = 'Wrong checksum';
                }
            }

            resolve(Object.assign(returnObject, query, verifyResults));
        });
    }

    _mapQueryToObject(query) {
        const returnObject = {
            merchant: query.vnp_TmnCode,
            transactionId: query.vnp_TxnRef,
            amount: parseInt(query.vnp_Amount, 10) / 100,
            orderInfo: query.vnp_OrderInfo,
            responseCode: query.vnp_ResponseCode,
            bankCode: query.vnp_BankCode,
            bankTranNo: query.vnp_BankTranNo,
            cardType: query.vnp_CardType,
            payDate: query.vnp_PayDate,
            gatewayTransactionNo: query.vnp_TransactionNo,
            secureHash: query.vnp_SecureHash,
            message: VNPay.getReturnUrlStatus(query.vnp_ResponseCode),
        };

        return returnObject;
    }

    static getReturnUrlStatus(responseCode, locale = 'vn') {
        const responseCodeTable = {
            '00': {
                vn: 'Giao dịch thành công',
                en: 'Approved',
            },
            '01': {
                vn: 'Giao dịch đã tồn tại',
                en: 'Transaction is already exist',
            },
            '02': {
                vn: 'Merchant không hợp lệ (kiểm tra lại vnp_TmnCode)',
                en: 'Invalid merchant (check vnp_TmnCode value)',
            },
            '03': {
                vn: 'Dữ liệu gửi sang không đúng định dạng',
                en: 'Sent data is not in the right format',
            },
            '04': {
                vn: 'Khởi tạo GD không thành công do Website đang bị tạm khóa',
                en: 'Payment website is not available',
            },
            '05': {
                vn:
                    'Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
                en: 'Transaction failed: Too many wrong password input',
            },
            '06': {
                vn:
                    'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
                en: 'Transaction failed: Wrong OTP input',
            },
            '07': {
                vn:
                    'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường). Đối với giao dịch này cần merchant xác nhận thông qua merchant admin: Từ chối/Đồng ý giao dịch',
                en: 'This transaction is suspicious',
            },
            '08': {
                vn:
                    'Giao dịch không thành công do: Hệ thống Ngân hàng đang bảo trì. Xin quý khách tạm thời không thực hiện giao dịch bằng thẻ/tài khoản của Ngân hàng này.',
                en:
                    'Transaction failed: The banking system is under maintenance. Please do not temporarily make transactions by card / account of this Bank.',
            },
            '09': {
                vn:
                    'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
                en: 'Transaction failed: Cards / accounts of customer who has not yet registered for Internet Banking service.',
            },
            10: {
                vn: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
                en: 'Transaction failed: Customer incorrectly validate the card / account information more than 3 times',
            },
            11: {
                vn: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
                en: 'Transaction failed: Pending payment is expired. Please try again.',
            },
            24: {
                vn: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
                en: 'Transaction canceled',
            },
            51: {
                vn: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
                en: 'Transaction failed: Your account is not enough balance to make the transaction.',
            },
            65: {
                vn: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
                en: 'Transaction failed: Your account has exceeded the daily limit.',
            },
            75: {
                vn: 'Ngân hàng thanh toán đang bảo trì',
                en: 'Banking system is under maintenance',
            },
            default: {
                vn: 'Giao dịch thất bại',
                en: 'Failured',
            },
        };

        const respondText = responseCodeTable[responseCode];

        return respondText ? respondText[locale] : responseCodeTable.default[locale];
    }
}

VNPay.checkoutSchema = new SimpleSchema({
    createdDate: { type: String, optional: true },
    amount: { type: SimpleSchema.Integer, max: 9999999999 },
    clientIp: { type: String, max: 16 },
    currency: { type: String, allowedValues: ['VND'] },
    billingCity: { type: String, optional: true, max: 255 },
    billingCountry: { type: String, optional: true, max: 255 },
    billingPostCode: { type: String, optional: true, max: 255 },
    billingStateProvince: { type: String, optional: true, max: 255 },
    billingStreet: { type: String, optional: true, max: 255 },
    customerEmail: { type: String, optional: true, max: 255, regEx: SimpleSchema.RegEx.Email },
    customerId: { type: String, optional: true, max: 255 },
    customerPhone: { type: String, optional: true, max: 255 },
    deliveryAddress: { type: String, optional: true, max: 255 },
    deliveryCity: { type: String, optional: true, max: 255 },
    deliveryCountry: { type: String, optional: true, max: 255 },
    deliveryProvince: { type: String, optional: true, max: 255 },
    bankCode: { type: String, optional: true, max: 50 },
    locale: { type: String, allowedValues: ['vn', 'en'] },
    orderId: { type: String, max: 34 },
    orderInfo: { type: String, max: 255 },
    orderType: { type: String, max: 40 },
    returnUrl: { type: String, max: 255 },
    transactionId: { type: String, max: 40 },
    vnpSecretKey: { type: String, max: 32 },
    vnpMerchant: { type: String, max: 16 },
    vnpCommand: { type: String, max: 16 },
    vnpVersion: { type: String, max: 2 },
});

VNPay.configSchema = new SimpleSchema({
    paymentGateway: { type: String, regEx: SimpleSchema.RegEx.Url },
    merchant: { type: String },
    secureSecret: { type: String },
});

VNPay.VERSION = '2';
VNPay.COMMAND = 'pay';

VNPay.CURRENCY_VND = 'VND';
VNPay.LOCALE_EN = 'en';
VNPay.LOCALE_VN = 'vn';

VNPay.TEST_CONFIG = {
    paymentGateway: 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    merchant: 'COCOSIN',
    secureSecret: 'RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ',
};

export { VNPay };