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
                            <div className="checkout-item__shop-info">
                                <div className="cart-item__shop-name">
                                    Shop ABC
                                </div>
                                <div className="cart-item__shop-contact" href="tel:">
                                    Liên hệ: <a className="cart-item__shop-contact" href="tel:">{common.formatPhone('0968250823')}</a>
                                </div>
                                <button className="btn btn-view-shop">Xem shop</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout;