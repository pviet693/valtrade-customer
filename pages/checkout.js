import Head from 'next/head';
import EditIcon from '@material-ui/icons/Edit';
import { useEffect, useState } from 'react';
import cookie from 'cookie';
import * as common from './../utils/common';
import api from '../utils/backend-api.utils';
import { v4 as uuidv4 } from "uuid";
import { Dropdown } from 'primereact/dropdown';
import dynamic from "next/dynamic";

const Paypal = dynamic(() => import("../components/Paypal"), {
  ssr: false,
});

const Checkout = ({ groupCartBySeller, listAddress, productCheckouts, sumCheckout }) => {

    // console.log(groupCartBySeller);
    // console.log(listAddress);
    // console.log(productCheckouts);
    const [deliveryAddresses, setDeliveryAddresses] = useState(listAddress);
    const [deliveryAddress, setDeliveryAddress] = useState(() => deliveryAddresses.find(address => address.isDefault === true));
    const [cartCheckouts, setCartCheckouts] = useState(groupCartBySeller);
    const [totalCheckout, setTotalCheckout] = useState(sumCheckout);

    const onChangeShippingMethod = async (event, id) => {
        const { value } = event;
        let params = {
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

        const res = await api.ghn.calculateShippingFee(params);
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
    }

    const createOrder = async () => {
        const arrayOrder = [];
        console.log(deliveryAddress);
        console.log(cartCheckouts)
        Object.keys(cartCheckouts).forEach(id => {
            const { arrayCart } = cartCheckouts[id];
            let order = {
                addressOrder: deliveryAddress.address.full_address,
                arrayProductShop: [],
                price: cartCheckouts[id].totalPrice,
                shippingFee: cartCheckouts[id].shippingFee,
                total: cartCheckouts[id].total,
                shipType: cartCheckouts[id].shippingMethod,
                payment: "local",
                contact: cartCheckouts[id].seller.phone,
                sellerId: cartCheckouts[id].seller._id
            }

            arrayCart.forEach(cart => {
                order.arrayProductShop.push({
                    inforProduct: cart._id,
                    quantity: cart.quantity
                })
            });

            arrayOrder.push(order);
        })

        const res = await api.order.createOrder({ arrayOrder });
        if (res.data.code === 200) {
            let body = { listProductId: productCheckouts };
            const res = await api.cart.deleteCart(body);
            if (res.status === 200) {
                swal.close();
                if (res.data.code === 200) {
                    common.ToastPrime('Thành công', 'Xóa giỏ hàng thành công.', 'success', toast);
                } else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.ToastPrime('Lỗi', message, 'error', toast);
                }
            }
        }
    }

    const transactionSuccess = async () => {
        try{
            // let transaction = {
            //     cartDetail: 
            // }
            const res = await api.buyer.successBuy(transaction);

        }catch(err){
            console.log(err);
        }
    };

    const transactionError = () => {
        console.log('Paypal error');
    }

    const transactionCanceled = () => {
        console.log('Transaction Canceled');
    }

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
                            <div className="address-delivery__content">
                                <div className="address-delivery__content-info">
                                    <div className="address-delivery__content-row">
                                        Tên người nhận: <span>Phạm Văn Việt</span>
                                    </div>
                                    <div className="address-delivery__content-row">
                                        Số điện thoại: <span>{common.formatPhone('0968250823')}</span>
                                    </div>
                                    <div className="address-delivery__content-row">
                                        Địa chỉ: <span>KTX khu A, phường Linh Trung, quận Thủ Đức, TP.HCM</span>
                                    </div>
                                </div>
                                <button className="btn btn-change-address"><EditIcon /></button>
                            </div>
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
                                                    {/* <button className="btn btn--change-delivery">Thay đổi</button> */}
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
                                    <div>Phương thức thanh toán: <span>Thanh toán khi nhận hàng</span></div>
                                    <button className="btn sum-checkout__payment-method__change-method">Thay dổi</button>
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
                                    <button className="btn sum-checkout__btn-checkout" onClick={createOrder}>Đặt hàng</button>
                                </div>

                                <Paypal 
                                    toPay={totalCheckout}
                                    onSuccess={transactionSuccess}
                                    transactionError={transactionError}
                                    transactionCanceled={transactionCanceled}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
            } catch (error) {
                console.log(error);
            }

            return {
                props: {
                    groupCartBySeller,
                    listAddress,
                    productCheckouts,
                    sumCheckout
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