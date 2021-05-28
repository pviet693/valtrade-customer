import Head from 'next/head';
import * as common from './../utils/common';
import EditIcon from '@material-ui/icons/Edit';

const Checkout = () => {
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
                                Địa chỉ giao hàng
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
                            <div className="checkout-item__row">
                                <div className="checkout-item__shop-info">
                                    <div className="cart-item__shop-name">
                                        Shop ABC
                                    </div>
                                    <div className="cart-item__shop-contact" href="tel:">
                                        Liên hệ: <a className="cart-item__shop-contact" href="tel:">{common.formatPhone('0968250823')}</a>
                                    </div>
                                    <button className="btn btn-view-shop">Xem shop</button>
                                </div>
                                <div className="checkout-item__product-info">
                                    <div className="checkout-item__product-container">
                                        <img src="/static/adidas-3-la.jpg" alt="Image" />
                                        <div className="checkout-item__product-detail">
                                            <div className="checkout-item__product-name">
                                                Apple Macbook Pro 2020 M1 - 13 Inchs (Apple M1/ 8GB/ 256GB) - Hàng Chính Hãng
                                            </div>
                                            <div className="checkout-item__product-sku">
                                                SKU: <span>SKU123456789</span>
                                            </div>
                                            <div className="checkout-item__product-brand">
                                                Thương hiệu: <span>Apple</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="checkout-item__price-container">
                                        <div>Đơn giá</div>
                                        <div>90.000 VND</div>
                                    </div>
                                    <div className="checkout-item__quantity">
                                        <div>Số lượng</div>
                                        <div>x 1</div>
                                    </div>
                                    <div className="checkout-item__total-container">
                                        <div>Thành tiền</div>
                                        <div>90.000 VND</div>
                                    </div>
                                </div>
                                <div className="checkout-item__delivery-container">
                                    <div className="checkout-item__delivery-note">
                                        <label htmlFor="note1">Lời nhắn: </label>
                                        <input id="note1" name="note1" className="form-control" placeholder="Lời nhắn cho người bán..." />
                                    </div>
                                    <div className="checkout-item__delivery-setting">
                                        <div className="checkout-item__delivery-setting__method">
                                            <div>Đơn vị vận chuyển: <span>Giao hàng nhanh</span></div>
                                            <button className="btn btn--change-delivery">Thay đổi</button>
                                        </div>
                                        <div className="checkout-item__delivery-setting__shipping-fee">15.000 VND</div>
                                    </div>
                                </div>
                                <div className="checkout-item__total">
                                    Tổng tiền: 105.000 VND
                                </div>
                            </div>
                            <div className="sum-checkout">
                                <div className="sum-checkout__payment-method">
                                    <div>Phương thức thanh toán: <span>Thanh toán khi nhận hàng</span></div>
                                    <button className="btn sum-checkout__payment-method__change-method">Thay dổi</button>
                                </div>
                                <div className="sum-checkout__sum-payment">
                                    <div className="sum-checkout__sum-payment__row">
                                        <div>Tổng tiền hàng:</div>
                                        <div>90.000 VND</div>
                                    </div>
                                    <div className="sum-checkout__sum-payment__row">
                                        <div>Phí vận chuyển:</div>
                                        <div>15.000 VND</div>
                                    </div>
                                    <div className="sum-checkout__sum-payment__row">
                                        <div>Tổng thanh toán:</div>
                                        <div>115.000 VND</div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button className="btn sum-checkout__btn-checkout">Đặt hàng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout;