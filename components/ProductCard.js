import api from '../utils/backend-api.utils';
import * as common from './../utils/common';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useContext, useRef, useState } from 'react';
import { DataContext } from '../store/GlobalState';

const ProductCard = ({ id, name, price, brand, sku, oldPrice, image, warrantyStatus, onClick, countProduct }) => {
    const [loading, setLoading] = useState(false);
    const { state, dispatch, toast } = useContext(DataContext);
    const { auth, cart } = state;

    const addToCart = async () => {
        setLoading(true);
        try {
            let cartTemp = cart;
            if (cart.length > 0) {
                let sameProduct = cartTemp.filter(x => x.productId === id);
                if (sameProduct.length === 1) {
                    setLoading(false);
                    if (countProduct === sameProduct[0].quantity) {
                        common.ToastPrime('Lỗi', 'Sản phẩm không đủ số lượng.', 'error', toast);
                        return;
                    } else {
                        sameProduct[0].quantity++;
                        let body = {
                            cartItems: [
                                {
                                    inforProduct: sameProduct[0].productId,
                                    quantity: sameProduct[0].quantity
                                }
                            ]
                        }
                        const res = await api.cart.postCart(body);
                        setLoading(false);
                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.ToastPrime('Thành công', 'Thêm vào giỏ hàng thành công.', 'success', toast);
                                dispatch({
                                    type: 'ADD_CART', payload: cartTemp
                                });
                            } else {
                                let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                                common.ToastPrime('Lỗi', message, 'error', toast);
                            }
                        }
                    }
                } else {
                    let body = {
                        cartItems: [
                            {
                                inforProduct: id,
                                quantity: 1
                            }
                        ]
                    }
                    const res = await api.cart.postCart(body);
                    setLoading(false);
                    if (res.status === 200) {
                        if (res.data.code === 200) {
                            common.ToastPrime('Thành công', 'Thêm vào giỏ hàng thành công.', 'success', toast);
                            cartTemp.push({
                                productName: name,
                                productId: id,
                                productImage: image,
                                price: price,
                                quantity: 1
                            })
                            dispatch({
                                type: 'ADD_CART', payload: cartTemp
                            });
                        } else {
                            let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                            common.ToastPrime('Lỗi', message, 'error', toast);
                        }
                    }
                }
            } else {
                let body = {
                    cartItems: [
                        {
                            inforProduct: id,
                            quantity: 1
                        }
                    ]
                }
                const res = await api.cart.postCart(body);
                setLoading(false);
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        common.ToastPrime('Thành công', 'Thêm vào giỏ hàng thành công.', 'success', toast);
                        cartTemp.push({
                            productName: name,
                            productId: id,
                            productImage: image,
                            price: price,
                            quantity: 1
                        })
                        dispatch({
                            type: 'ADD_CART', payload: cartTemp
                        });
                    } else {
                        let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                        common.ToastPrime('Lỗi', message, 'error', toast);
                    }
                }
            }
        } catch (e) {
            setLoading(false);
            common.ToastPrime('Lỗi', e.message || e, 'error', toast);
        }
    }

    return (
        <div className="product-card">
            <div className="img-product-box">
                <img alt={`image-product-${id}`} src={image} width="180px" height="180px"/>
            </div>
            <div className="product-info">
                <div className="product-name" title={name}>{name}</div>
                <div className="product-price">Giá bán: {common.numberWithCommas(price)} VND</div>
                <div className="product-brand">Thương hiệu: {brand}</div>
                <div className="product-warranty">Tình trạng bảo hành: <span>{warrantyStatus ? 'Vẫn còn' : 'Hết hạn'}</span></div>
                <div className="product-sku">SKU: <span>{sku}</span></div>
                <div className="product-primary-price">Giá gốc: <span>{common.numberWithCommas(oldPrice)} VND</span></div>
            </div>
            <div className="product-action">
                <div className="button-wrapper">
                    <Button
                        variant="contained"
                        type="button"
                        className="btn button-add-to-cart"
                        disabled={loading}
                        onClick={addToCart}
                    >
                        Thêm vào giỏ
                    </Button>
                    {loading && <CircularProgress size={24} className='loading' />}
                </div>

                <Button
                    variant="contained"
                    type="button"
                    className="btn button-buy-now"
                >
                    Mua ngay
                </Button>

                <Button
                    variant="contained"
                    type="button"
                    className="btn button-detail"
                    onClick={onClick}
                >
                    Chi tiết
                </Button>
            </div>
        </div>
    )
}

export default ProductCard;
