import Head from 'next/head';
import { useContext, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import cookie from 'cookie';
import * as common from './../utils/common';
import api from '../utils/backend-api.utils';
import { v4 as uuidv4 } from "uuid";
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import dynamic from "next/dynamic";
import { DataContext } from '../store/GlobalState';
import axios from 'axios';

const PaypalBtn = dynamic(() => import("../components/Paypal"), {
    ssr: false,
});

const Checkout = ({ groupCartBySeller, listAddress, productCheckouts, sumCheckout, user }) => {
    const { toast, swal } = useContext(DataContext);
    const [editAddress, setEditAddress] = useState(false);
    const [deliveryAddresses, setDeliveryAddresses] = useState(listAddress);
    const [deliveryAddress, setDeliveryAddress] = useState(() => deliveryAddresses.find(address => address.isDefault === true));
    const [cartCheckouts, setCartCheckouts] = useState(groupCartBySeller);
    const [totalCheckout, setTotalCheckout] = useState(sumCheckout);
    const [paymentMethod, setPaymentMethod] = useState(common.PaymentMethods[0].value);
    const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
    const router = useRouter();
    
    console.log(deliveryAddress);

    const onChangeShippingMethod = async (event, id) => {
        const { value } = event;
        const type = Object.keys(value)[0];
        let body = {};

        if (type === "ghn") {
            body = {
                from_district_id: value.ghn.district.district_id,
                service_id: null,
                service_type_id: 2,
                to_district_id: deliveryAddress.address.district.district_id,
                to_ward_code: deliveryAddress.address.ward.ward_code,
                height: Math.ceil(cartCheckouts[id].height),
                length: Math.ceil(cartCheckouts[id].length),
                weight: Math.ceil(cartCheckouts[id].weight),
                width: Math.ceil(cartCheckouts[id].width),
                insurance_fee: cartCheckouts[id].totalPrice,
                coupon: null
            }
            const res = await api.ghn.calculateShippingFee(body);
            if (res.data.code === 200) {
                const listCartCheckout = { ...cartCheckouts };
                const checkoutTotal = { ...totalCheckout };
                checkoutTotal.shippingFee = 0;
                checkoutTotal.total = 0;

                listCartCheckout[id].shippingMethod = value;
                listCartCheckout[id].shippingFee = res.data.data.total;

                Object.keys(listCartCheckout).forEach(id => {
                    checkoutTotal.shippingFee += listCartCheckout[id].shippingFee;
                    listCartCheckout[id].total = listCartCheckout[id].totalPrice + listCartCheckout[id].shippingFee;
                });
                checkoutTotal.total = checkoutTotal.shippingFee + checkoutTotal.totalPrice;

                setCartCheckouts(listCartCheckout);
                setTotalCheckout(checkoutTotal);
            }
        } else {
            body = {
                pick_province: value.ghtk.pick_province,
                pick_district: value.ghtk.pick_district,
                province: deliveryAddress.address.province.name,
                district: deliveryAddress.address.district.name,
                address: deliveryAddress.address.full_address,
                weight: Math.ceil(cartCheckouts[id].weight),
                value: cartCheckouts[id].totalPrice,
                transport: "road",
                deliver_option: "none"
            }

            const res = await api.ghtk.calculateShippingFee(body);
            if (res.data.code === 200) {
                const listCartCheckout = { ...cartCheckouts };
                const checkoutTotal = { ...totalCheckout };
                checkoutTotal.shippingFee = 0;
                checkoutTotal.total = 0;

                listCartCheckout[id].shippingMethod = value;
                listCartCheckout[id].shippingFee = res.data.result.fee.fee;

                Object.keys(listCartCheckout).forEach(id => {
                    checkoutTotal.shippingFee += listCartCheckout[id].shippingFee;
                    listCartCheckout[id].total = listCartCheckout[id].totalPrice + listCartCheckout[id].shippingFee;
                });
                checkoutTotal.total = checkoutTotal.shippingFee + checkoutTotal.totalPrice;

                setCartCheckouts(listCartCheckout);
                setTotalCheckout(checkoutTotal);
            }
        }
    }

    const createOrder = async () => {
        const { address } = deliveryAddress;
        swal.fire({
            willOpen: () => {
                swal.showLoading();
            },
        })
        const arrayOrder = [];
        Object.keys(cartCheckouts).forEach(id => {
            const { arrayCart, shippingMethod } = cartCheckouts[id];
            const shippingMethodName = Object.keys(shippingMethod)[0];
            let order = {
                addressOrder: deliveryAddress.address.full_address,
                arrayProductShop: [],
                price: cartCheckouts[id].totalPrice,
                shippingFee: cartCheckouts[id].shippingFee,
                total: cartCheckouts[id].total,
                shipType: { [shippingMethodName]: address },
                payment: paymentMethod,
                sellerId: cartCheckouts[id].seller._id,
                nameRecei: deliveryAddress.name,
                contact: deliveryAddress.phone,
                note: ""
            }

            arrayCart.forEach(cart => {
                order.arrayProductShop.push({
                    inforProduct: cart._id,
                    quantity: cart.quantity,
                    onProduct: cart.typeProduct
                })
            });

            arrayOrder.push(order);
        });



        const res = await api.order.createOrder({ arrayOrder });
        if (res.data.code === 200) {
            let body = { listProductId: productCheckouts };
            const resDeleteCart = await api.cart.deleteCart(body);
            swal.close();
            if (resDeleteCart.status === 200) {
                if (resDeleteCart.data.code === 200) {
                    if (paymentMethod === "local") {
                        common.ToastPrime('Thành công', 'Đặt thành công.', 'success', toast);
                        router.push('/checkout-done', null, { shallow: true });
                    } else if (paymentMethod === "vnpay") {
                        let arr = [];
                        let arrProduct = [];
                        Object.keys(cartCheckouts).forEach(key => {
                            arr = arr.concat(cartCheckouts[key].arrayCart);
                            arr.forEach(x => {
                                let objProduct = {
                                    onPro: x.typeProduct,
                                    inforProduct: x._id
                                }
                                arrProduct.push(objProduct);
                            })
                        });
                        const arrayProduct = JSON.stringify(arrProduct)
                        let returnUrl = `https://www.valtrade.me/checkout-done?arrayProduct=${arrayProduct}&balance=${totalCheckout.total}`;
                        const checkoutPayload = {
                            amount: totalCheckout.total,
                            locale: 'vn',
                            orderType: '120000',
                            returnUrl,
                            bankCode: "NCB",
                            orderDescription: "test",
                            language: "vn"
                        };

                        const redirectUrl = await axios.post("/api/create_payment_url", checkoutPayload);
                        if (redirectUrl.data.code === 200) {
                            const { data } = redirectUrl.data;
                            window.location.href = data;
                        }
                    }
                } else {
                    let message = res.resDeleteCart.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.ToastPrime('Lỗi', message, 'error', toast);
                }
            }
        }
        else if (res.data.code === 300){
            swal.close()
            let message = "Sản phẩm không đủ số lượng";
            common.ToastPrime('Lỗi', message, 'error', toast);
            let body = { listProductId: [res.data.result] };
            const res2 = await api.cart.deleteCart(body);
            if (res2.status === 200) {
                router.push('/cart', null, { shallow: true });
            }
        }
    }

    const onChangeAddress = (id) => {
        setDeliveryAddress(() => deliveryAddresses.find(address => address.id === id));
    }

    const transactionSuccess = async () => {
        try {
            let arr = [];
            let arrProduct = [];
            Object.keys(cartCheckouts).forEach(key => {
                arr = arr.concat(cartCheckouts[key].arrayCart);
                arr.forEach(x => {
                    let objProduct = {
                        onPro: x.typeProduct,
                        inforProduct: x._id
                    }
                    arrProduct.push(objProduct);
                })
            });
            let transaction = {
                onUser: user.id,
                onModel: 'Buyer',
                typePay: 'paypal',
                arrayProduct: arrProduct,
                isPay: true,
                balance: totalCheckout.total
            }
            const res = await api.transfer.postTransfer(transaction);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Thanh toán thành công", 'success');
                    const arrayOrder = [];
                    const { address } = deliveryAddress;
                    Object.keys(cartCheckouts).forEach(id => {
                        const { arrayCart, shippingMethod } = cartCheckouts[id];
                        const shippingMethodName = Object.keys(shippingMethod)[0];
                        let order = {
                            addressOrder: deliveryAddress.address.full_address,
                            arrayProductShop: [],
                            price: cartCheckouts[id].totalPrice,
                            shippingFee: cartCheckouts[id].shippingFee,
                            total: cartCheckouts[id].total,
                            shipType: { [shippingMethodName]: address },
                            payment: "paypal",
                            sellerId: cartCheckouts[id].seller._id,
                            nameRecei: deliveryAddress.name,
                            contact: deliveryAddress.phone,
                            note: ""
                        }

                        arrayCart.forEach(cart => {
                            order.arrayProductShop.push({
                                inforProduct: cart._id,
                                quantity: cart.quantity,
                                onProduct: cart.typeProduct
                            })
                        });

                        arrayOrder.push(order);
                    })
                    console.log(arrayOrder);

                    const res1 = await api.order.createOrder({ arrayOrder });
                    if (res1.data.code === 200) {
                        let body = { listProductId: productCheckouts };
                        const res2 = await api.cart.deleteCart(body);
                        if (res2.status === 200) {
                            router.push('/checkout-done', null, { shallow: true });
                        }
                    }
                } else {
                    const message = res.data.message || "Thanh toán thất bại.";
                    common.Toast(message, 'error');
                }
            }

        } catch (err) {
            common.ToastPrime("Lỗi",
                error.response ? error.response.data.message : error.message,
                "error",
                toast
            );
        }
    };

    const transactionError = () => {
        console.log('Paypal error');
    }

    const transactionCanceled = () => {
        console.log('Transaction Canceled');
    }
    let currency_total = Math.round(totalCheckout.total / 23000);

    return (
        <>
            <Head>
                <title>
                    Thanh toán
                </title>
            </Head>
            <div className="checkout-container">
                <div className="container">
                    <div className="checkout-content">
                        <div className="address-delivery-container">
                            <div className="title">
                                Địa chỉ nhận hàng
                            </div>
                            {
                                !editAddress && (
                                    <div className="address-delivery__content">
                                        <div className="address-delivery__content-info">
                                            <div className="address-delivery__content-row">
                                                Tên người nhận: <span>{deliveryAddress?.name}</span>
                                            </div>
                                            <div className="address-delivery__content-row">
                                                Số điện thoại: <span>{deliveryAddress?.phone}</span>
                                            </div>
                                            <div className="address-delivery__content-row">
                                                Địa chỉ: <span>{deliveryAddress?.address.full_address}</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-change-address" onClick={() => setEditAddress(true)}>Thay đổi địa chỉ</button>
                                    </div>
                                )
                            }
                            {
                                editAddress && (
                                    deliveryAddresses.map((address) => {
                                        return (
                                            <div key={address.id} className="address-card">
                                                <RadioButton inputId={address.id} name="category" value={deliveryAddress} onChange={() => onChangeAddress(address.id)} checked={deliveryAddress.id === address.id} />
                                                <div className="address-card__info" htmlFor={address.id}>
                                                    <div>{`Tên người nhận: ${address.name}`}</div>
                                                    <div>{`Số điện thoại: ${address.phone}`}</div>
                                                    <div>{address.address.full_address}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )
                            }
                        </div>
                        <div className="checkout-item__container">
                            {
                                Object.keys(cartCheckouts).map(id => (
                                    <div className="checkout-item__row" key={uuidv4()}>
                                        <div className="checkout-item__shop-info">
                                            <div className="cart-item__shop-name">
                                                {cartCheckouts[id].seller.nameShop}
                                            </div>
                                            <div className="cart-item__shop-contact" href="tel:">
                                                Liên hệ: <a className="cart-item__shop-contact" href="tel:">{common.formatPhone(cartCheckouts[id].seller.phone)}</a>
                                            </div>
                                            <button className="btn btn-view-shop">Xem shop</button>
                                        </div>
                                        {
                                            groupCartBySeller[id].arrayCart.map(cart => (
                                                <div className="checkout-item__product-info" key={uuidv4()}>
                                                    <div className="checkout-item__product-container">
                                                        <img src={cart.img.url} alt="Image" />
                                                        <div className="checkout-item__product-detail">
                                                            <div className="checkout-item__product-name">
                                                                {cart.name}
                                                            </div>
                                                            <div className="checkout-item__product-sku">
                                                                SKU: <span>{cart.sku}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="checkout-item__price-container">
                                                        <div>Đơn giá</div>
                                                        <div>{common.numberWithCommas(cart.price)} VND</div>
                                                    </div>
                                                    <div className="checkout-item__quantity">
                                                        <div>Số lượng</div>
                                                        <div>x {cart.quantity}</div>
                                                    </div>
                                                    <div className="checkout-item__total-container">
                                                        <div>Thành tiền</div>
                                                        <div>{common.numberWithCommas(cart.total)} VND</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <div className="checkout-item__delivery-container">
                                            <div className="checkout-item__delivery-note">
                                                <label htmlFor="note1">Lời nhắn: </label>
                                                <input id="note1" name="note1" className="form-control" placeholder="Lời nhắn cho người bán..." />
                                            </div>
                                            <div className="checkout-item__delivery-setting">
                                                <div className="checkout-item__delivery-setting__method">
                                                    <div>Đơn vị vận chuyển: </div>
                                                    <Dropdown
                                                        value={cartCheckouts[id].shippingMethod}
                                                        options={cartCheckouts[id].shipMethods}
                                                        onChange={(e) => onChangeShippingMethod(e, id)}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        filter={true}
                                                        filterBy="label"
                                                        placeholder="Chọn phương thức giao hàng" />
                                                </div>
                                                <div className="checkout-item__delivery-setting__shipping-fee">{common.numberWithCommas(cartCheckouts[id].shippingFee)} VND</div>
                                            </div>
                                        </div>
                                        <div className="checkout-item__total">
                                            Tổng tiền: {common.numberWithCommas(cartCheckouts[id].total)} VND
                                        </div>
                                    </div>
                                ))
                            }
                            <div className="sum-checkout">
                                <div className="sum-checkout__payment-method">
                                    <div>
                                        Phương thức thanh toán:
                                        <span className="ml-2">
                                            {common.PaymentMethods.find((item) => item.value === paymentMethod).label}
                                        </span>
                                    </div>
                                    <button
                                        className="btn sum-checkout__payment-method__change-method"
                                        onClick={() => setOpenPaymentMethod(true)}
                                    >
                                        Thay dổi
                                    </button>
                                </div>
                                <div className="sum-checkout__sum-payment">
                                    <div className="sum-checkout__sum-payment__row">
                                        <div>Tổng tiền hàng:</div>
                                        <div>{common.numberWithCommas(totalCheckout.totalPrice)} VND</div>
                                    </div>
                                    <div className="sum-checkout__sum-payment__row">
                                        <div>Phí vận chuyển:</div>
                                        <div>{common.numberWithCommas(totalCheckout.shippingFee)} VND</div>
                                    </div>
                                    <div className="sum-checkout__sum-payment__row">
                                        <div>Tổng thanh toán:</div>
                                        <div>{common.numberWithCommas(totalCheckout.total)} VND</div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    {
                                        paymentMethod === "paypal"
                                            ? (
                                                <div style={{
                                                    marginTop: 10
                                                }}
                                                >
                                                    <PaypalBtn
                                                        toPay={currency_total}
                                                        transactionSuccess={transactionSuccess}
                                                        transactionError={transactionError}
                                                        transactionCanceled={transactionCanceled}
                                                    />
                                                </div>
                                            ) : (
                                                <button
                                                    className="btn sum-checkout__btn-checkout"
                                                    onClick={createOrder}>
                                                    Đặt hàng
                                                </button>
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                maxWidth="xs"
                aria-labelledby="confirmation-dialog-title"
                open={openPaymentMethod}
                onClose={() => setOpenPaymentMethod(false)}
            >
                <DialogTitle id="confirmation-dialog-title">Phương thức thanh toán</DialogTitle>
                <DialogContent dividers>
                    <RadioGroup
                        aria-label="ringtone"
                        name="ringtone"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        {common.PaymentMethods.map((option) => (
                            <FormControlLabel value={option.value} key={option.value} control={<Radio />} label={option.label} />
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPaymentMethod(false)} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const { query } = ctx;
    const { productCheckouts } = query;

    let carts = [];
    let sumCheckout = {
        shippingFee: 0,
        totalPrice: 0,
        total: 0
    };
    let listAddress = [];
    let groupCartBySeller = {};
    let user = { id: "", phone: "", name: "" };

    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).access_token;
        if (token) {
            try {
                const res = await api.cart.getCart(token);
                if (res.data.code === 200) {
                    const cartItems = res.data.result;
                    Object.keys(cartItems).forEach(id => {
                        if (productCheckouts.includes(id)) {
                            cartItems[id].total = cartItems[id].price * cartItems[id].quantity;
                            carts.push(cartItems[id]);
                        }
                    });

                    for (const cart of carts) {
                        let nameDeliveryMethods = [];
                        let key = "";
                        const { seller, deliverArray, total, weight, height, width, length } = cart;
                        key = seller._id + deliverArray.length;
                        deliverArray.forEach(item => {
                            if (Object.keys(item)[0] === "ghn") nameDeliveryMethods.push("ghn");
                            if (Object.keys(item)[0] === "ghtk") nameDeliveryMethods.push("ghtk");
                            if (Object.keys(item)[0] === "local") nameDeliveryMethods.push("local");
                        });
                        if (nameDeliveryMethods.indexOf("ghn") !== -1) key += "ghn";
                        if (nameDeliveryMethods.indexOf("ghtk") !== -1) key += "ghtk";
                        if (nameDeliveryMethods.indexOf("local") !== -1) key += "local";
                        if (!groupCartBySeller[key]) {
                            groupCartBySeller[key] = {};
                            groupCartBySeller[key].nameRecei = "";
                            groupCartBySeller[key].contact = "";
                            groupCartBySeller[key].note = "";
                            groupCartBySeller[key].shippingMethod = null;
                            groupCartBySeller[key].seller = seller;
                            groupCartBySeller[key].shippingFee = 0;
                            groupCartBySeller[key].total = 0;
                            groupCartBySeller[key].totalPrice = 0;
                            groupCartBySeller[key].note = "";
                            groupCartBySeller[key].arrayCart = [];
                            groupCartBySeller[key].shipMethods = deliverArray;
                            groupCartBySeller[key].weight = 0;
                            groupCartBySeller[key].height = 0;
                            groupCartBySeller[key].width = 0;
                            groupCartBySeller[key].length = 0;
                        }
                        groupCartBySeller[key].total += total;
                        groupCartBySeller[key].totalPrice += total;
                        groupCartBySeller[key].weight += weight;
                        groupCartBySeller[key].height += height;
                        groupCartBySeller[key].width += width;
                        groupCartBySeller[key].length += length;
                        groupCartBySeller[key].arrayCart.push(cart);
                    }
                    Object.keys(groupCartBySeller).forEach(key => {
                        const { shipMethods, shippingFee, total } = groupCartBySeller[key];
                        sumCheckout.shippingFee += shippingFee;
                        sumCheckout.totalPrice += total;
                        let shippingMethods = [];
                        shipMethods.forEach(item => {
                            let shippingMethod = {};
                            if (Object.keys(item)[0] === "ghn") {
                                shippingMethod.label = "Giao hàng nhanh";
                                shippingMethod.value = item;
                            }
                            if (Object.keys(item)[0] === "ghtk") {
                                shippingMethod.label = "Giao hàng tiết kiệm";
                                shippingMethod.value = item;
                            }
                            if (Object.keys(item)[0] === "local") {
                                shippingMethod.label = "Nhận hàng tại shop";
                                shippingMethod.value = item;
                            }
                            shippingMethods.push(shippingMethod);
                        });

                        groupCartBySeller[key].shipMethods = shippingMethods;
                    });

                    sumCheckout.total = sumCheckout.shippingFee + sumCheckout.totalPrice;
                }

                const getListAddress = await api.address.getListAddress(token);
                if (getListAddress.data.code === 200) {
                    getListAddress.data.result.forEach(element => {
                        let address = {
                            id: "",
                            name: "",
                            phone: "",
                            address: {},
                            isDefault: false
                        }
                        address.id = element._id || "";
                        address.name = element.name || "";
                        address.phone = element.phone || "";
                        address.address = element.address || {};
                        address.isDefault = element.isDefault;

                        listAddress.push(address);
                    });
                }

                const infoBuyer = await api.buyer.getProfile(token);
                if (infoBuyer.status === 200) {
                    if (infoBuyer.data.code === 200) {
                        user.id = infoBuyer.data.information.userId;
                        user.phone = infoBuyer.data.information.phone || "";
                        user.name = infoBuyer.data.information.name;
                    }
                }
            } catch (error) {
                console.log(error);
            }

            return {
                props: {
                    groupCartBySeller,
                    listAddress,
                    productCheckouts,
                    sumCheckout,
                    user
                }
            }
        } else {
            return {
                redirect: {
                    destination: '/signin',
                    permanent: false,
                },
            }
        }
    }
}

export default Checkout;