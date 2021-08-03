import api from '../utils/backend-api.utils';
import * as common from './../utils/common';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useContext, useRef, useState } from 'react';
import { DataContext } from '../store/GlobalState';
import { Image } from 'cloudinary-react';
import Router from "next/router";

const ProductCard = ({ id, name, price, brand, sku, oldPrice, image, imageId, warrantyStatus, onClick, countProduct }) => {
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
                    if (countProduct === 0 || countProduct === sameProduct[0].quantity) {
                        common.ToastPrime('Lỗi', 'Sản phẩm không đủ số lượng.', 'error', toast);
                        return false;
                    } else {
                        sameProduct[0].quantity++;
                        let body = {
                            cartItems: [
                                {
                                    inforProduct: sameProduct[0].productId,
                                    quantity: sameProduct[0].quantity,
                                    onProduct: "Product"
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
                                return true;
                            } else {
                                let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                                common.ToastPrime('Lỗi', message, 'error', toast);
                                return false;
                            }
                        }
                    }
                } else {
                    if (countProduct === 0) {
                        common.ToastPrime('Lỗi', 'Sản phẩm không đủ số lượng.', 'error', toast);
                        setLoading(false);
                        return false;
                    }
                    let body = {
                        cartItems: [
                            {
                                inforProduct: id,
                                quantity: 1,
                                onProduct: "Product"
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
                            return true;
                        } else {
                            let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                            common.ToastPrime('Lỗi', message, 'error', toast);
                            return false;
                        }
                    }
                }
            } else {
                if (countProduct === 0) {
                    common.ToastPrime('Lỗi', 'Sản phẩm không đủ số lượng.', 'error', toast);
                    setLoading(false);
                    return false;
                }
                let body = {
                    cartItems: [
                        {
                            inforProduct: id,
                            quantity: 1,
                            onProduct: "Product"
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
                        return true;
                    } else {
                        let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                        common.ToastPrime('Lỗi', message, 'error', toast);
                        return false;
                    }
                }
            }
        } catch (e) {
            setLoading(false);
            common.ToastPrime('Lỗi', e.message || e, 'error', toast);
            return false;
        }
    }

    const getVersionImage = (linkImage) => {
        const arr = linkImage.split("/");
        return arr[6].replace("v", "");
    }

    const buyNow = async () => {
        const response = await addToCart();
        if (response) {
            const cartCheckout = [id];
            Router.push({
                pathname: '/checkout',
                query: { productCheckouts: cartCheckout }
            }, null, { shallow: true })
        }
    }

    return (
        <div className="product-card">
            <div className="img-product-box">
                {/* <img alt={`image-product-${id}`} src={image} width="180px" height="180px"/> */}
                <Image
                    publicId={imageId}
                    version={getVersionImage(image)}
                    cloud_name="ktant"
                    secure="true"
                    alt="Image Product"
                    height="180"
                    width="180"
                    crop="fill"
                    loading="lazy"
                >
                </Image>
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
                    onClick={buyNow}
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
