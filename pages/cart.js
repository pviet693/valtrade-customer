import Head from 'next/head';
import Router from 'next/router';
import { useContext, useState } from 'react';
import { CartItem } from './../components/CartItem';
import { Checkbox } from 'primereact/checkbox';
import * as common from './../utils/common';
import api from '../utils/backend-api.utils';
import cookie from 'cookie';
import Button from '@material-ui/core/Button';
import { DataContext } from '../store/GlobalState';

const Cart = ({ listCards, recommendProducts }) => {
    const [cards, setCards] = useState(listCards);
    const [selectAll, setSelectAll] = useState(false);
    const { state, dispatch, toast, swal } = useContext(DataContext);
    const { auth, cart } = state;

    const increase = async (productId) => {

        let cardsTemp = cards;
        let index = cardsTemp.findIndex(x => x.productId === productId);
        if (cardsTemp[index].productQuantity === cardsTemp[index].quantity) {
            common.ToastPrime('Lỗi', 'Sản phẩm không đủ số lượng.', 'error', toast);
            return;
        }

        swal.fire({
            willOpen: () => {
                swal.showLoading();
            },
        })

        cardsTemp[index].productQuantity += 1;
        cardsTemp[index].total = cardsTemp[index].productQuantity * cardsTemp[index].price;
        setCards([...cardsTemp]);

        let cartTemp = cart;
        cartTemp.forEach((item, idx) => {
            if (item.productId === productId) {
                cartTemp[idx].quantity++;
            }
        })
        dispatch({
            type: 'ADD_CART', payload: cartTemp
        });

        try {
            let body = { cartItems: [] };
            body.cartItems = cartTemp.map(x => { return { inforProduct: x.productId, quantity: x.quantity } });
            const res = await api.cart.postCart(body);
            if (res.status === 200) {
                swal.close();
                if (res.data.code === 200) {
                    common.ToastPrime('Thành công', 'Cập nhật giỏ hàng thành công.', 'success', toast);
                } else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.ToastPrime('Lỗi', message, 'error', toast);
                }
            }
        } catch (error) {
            swal.close();
            common.ToastPrime('Lỗi', error, 'error', toast);
        }
    }

    const decrease = async (productId) => {
        let cardsTemp = cards;
        let index = cardsTemp.findIndex(x => x.productId === productId);
        if (cardsTemp[index].productQuantity === 1) return;

        swal.fire({
            willOpen: () => {
                swal.showLoading();
            },
        })

        cardsTemp[index].productQuantity -= 1;
        cardsTemp[index].total = cardsTemp[index].productQuantity * cardsTemp[index].price;
        setCards([...cardsTemp]);

        let cartTemp = cart;
        cartTemp.forEach((item, idx) => {
            if (item.productId === productId) {
                cartTemp[idx].quantity--;
            }
        })
        dispatch({
            type: 'ADD_CART', payload: cartTemp
        });

        try {
            let body = { cartItems: [] };
            body.cartItems = cartTemp.map(x => { return { inforProduct: x.productId, quantity: x.quantity } });
            const res = await api.cart.postCart(body);
            if (res.status === 200) {
                swal.close();
                if (res.data.code === 200) {
                    common.ToastPrime('Thành công', 'Cập nhật giỏ hàng thành công.', 'success', toast);
                } else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.ToastPrime('Lỗi', message, 'error', toast);
                }
            }
        } catch (error) {
            swal.close();
            common.ToastPrime('Lỗi', error, 'error', toast);
        }
    }

    const selectCard = (productId) => {
        let cardsTemp = cards;
        let index = cardsTemp.findIndex(x => x.productId === productId);
        cardsTemp[index].isChoose = !cardsTemp[index].isChoose;
        setCards([...cardsTemp]);

        let arrSelect = cardsTemp.filter(x => x.isChoose === true);
        setSelectAll(arrSelect.length === cardsTemp.length ? true : false);
    }

    const viewDetail = (productId) => {
        Router.push({
            pathname: '/product-detail',
            query: { id: productId },
        })
    }

    const remove = async (productId) => {
        let cardsTemp = cards;
        cardsTemp = cardsTemp.filter(x => x.productId !== productId);
        setCards([...cardsTemp]);

        swal.fire({
            willOpen: () => {
                swal.showLoading();
            },
        })

        let cartTemp = cart.filter(x => x.productId !== productId);

        dispatch({
            type: 'ADD_CART', payload: cartTemp
        });

        try {
            const res = await api.cart.deleteCart(productId);
            if (res.status === 200) {
                swal.close();
                if (res.data.code === 200) {
                    common.ToastPrime('Thành công', 'Xóa giỏ hàng thành công.', 'success', toast);
                } else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.ToastPrime('Lỗi', message, 'error', toast);
                }
            }
        } catch (error) {
            swal.close();
            common.ToastPrime('Lỗi', error, 'error', toast);
        }
    }

    const selectAllCard = () => {
        setSelectAll(!selectAll);
        let cardsTemp = cards;
        cardsTemp.forEach((element, index) => {
            cardsTemp[index].isChoose = cardsTemp[index].isChoose || !cardsTemp[index].isChoose;
        });
        setCards([...cardsTemp]);
    }

    const cartTotal = () => {
        let totalPrice = 0;
        cards.forEach(element => {
            if (element.isChoose) totalPrice += element.total;
        })
        return totalPrice;
    }

    const totalQuantity = () => {
        let quantity = 0;
        cards.forEach(element => {
            if (element.isChoose) quantity += 1;
        })
        return quantity;
    }

    const removeAll = () => {
        console.log(cards);
        console.log(cart);
        // if (numCartSelect() > 0) {
        //     let cardsTemp = cards;
        //     cardsTemp = cardsTemp.filter(x => x.isChoose !== true);
        //     setCards([...cardsTemp]);
        // }

        // dispatch({
        //     type: 'ADD_CART', payload: cartTemp
        // });

        // try {
        //     const res = await api.cart.deleteCart(productId);
        //     if (res.status === 200) {
        //         swal.close();
        //         if (res.data.code === 200) {
        //             common.ToastPrime('Thành công', 'Xóa giỏ hàng thành công.', 'success', toast);
        //         } else {
        //             let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
        //             common.ToastPrime('Lỗi', message, 'error', toast);
        //         }
        //     }
        // } catch (error) {
        //     swal.close();
        //     common.ToastPrime('Lỗi', error, 'error', toast);
        // }
    }

    const numCartSelect = () => {
        const cartSelectArr = cards.filter(x => x.isChoose === true);
        return cartSelectArr.length;
    }

    const checkout = async () => {
        if (totalQuantity() > 0) {
            try {
                // const res = await api.buyer.postCart(listCards);
                // if (res.status === 200) {
                //     if (res.data.code === 200) {
                //         common.Notification("Thông báo", 'Bạn sẽ được chuyển sang trang thanh toán', 'success');
                //         Router.push({
                //             pathname: '/checkout',
                //         })
                //     } else {
                //         common.ToastPrime("Lỗi")
                //     }
                // }
            } catch (e) {
                common.ToastPrime('Lỗi', e, 'error', toast);
            }
        }
    }

    return (
        <>
            <Head>
                <title>
                    Giỏ hàng
                </title>
            </Head>
            <div className="cart-container">
                <div className="container">
                    <div className="cart-content">
                        <div className="cart-header-container">
                            <div className="header_product">
                                Sản phẩm
                            </div>
                            <div className="header_item">
                                Đơn giá
                            </div>
                            <div className="header_item">
                                Số lượng
                            </div>
                            <div className="header_item">
                                Số tiền
                            </div>
                            <div className="header_item">
                                Thao tác
                            </div>
                        </div>
                        <div className="cart-item-container">
                            {
                                cards.length > 0 && cards.map(card => {
                                    return (
                                        <CartItem
                                            key={card.productId}
                                            cardId={card.productId} productId={card.productId}
                                            shopId={card.shopId} shopName={card.shopName} isChoose={card.isChoose} contact={card.contact}
                                            productName={card.productName}
                                            productImage={card.productImage}
                                            productPrice={card.price} productQuantity={card.productQuantity} total={card.total}
                                            increase={increase}
                                            decrease={decrease}
                                            selectCard={selectCard}
                                            viewDetail={viewDetail}
                                            remove={remove}
                                        />
                                    )
                                })
                            }
                            {
                                cards.length === 0 &&
                                <div className="empty-cart">
                                    <img src="/static/empty_cart.svg" alt="Empty cart" />
                                    <div>Giỏ hàng rỗng</div>
                                </div>
                            }

                            <div className="sum-cart">
                                <div className="sum-cart__left">
                                    <Checkbox inputId="234" checked={selectAll} onChange={selectAllCard} />
                                    <div className="sum-cart__left-all">Chọn tất cả ({totalQuantity()})</div>
                                    {/* <Button
                                        variant="contained"
                                        type="submit"
                                        className="btn btn-danger"
                                        onClick={removeAll}
                                    >
                                        Xóa
                                    </Button> */}
                                </div>
                                <div className="sum-cart__right">
                                    <div className="sum-cart__right-total">
                                        Tổng tiền hàng ({totalQuantity()} sản phẩm): <span>{common.numberWithCommas(cartTotal())} VND</span>
                                    </div>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        onClick={checkout}
                                        className="btn btn-primary"
                                    >
                                        Mua hàng
                                    </Button>
                                </div>
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
    const { id } = query;

    let cards = [];
    let recommendProducts = [];

    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).access_token;
        if (token) {
            try {
                const res = await api.cart.getCart(token);
                if (res.data.code === 200) {
                    const cartItems = res.data.result;
                    Object.keys(cartItems).forEach(id => {
                        let card = {
                            productName: cartItems[id].name || "",
                            productId: id || "",
                            productImage: cartItems[id].img.url || "",
                            productQuantity: cartItems[id].quantity || 0,
                            price: cartItems[id].price || 0,
                            isChoose: false,
                            total: cartItems[id].quantity * cartItems[id].price,
                            quantity: cartItems[id].countProduct || 1,
                            shopId: cartItems[id].seller ? cartItems[id].seller._id || "" : "",
                            shopName: cartItems[id].seller ? cartItems[id].seller.nameShop || "" : "",
                            contact: cartItems[id].seller ? cartItems[id].seller.phone || "" : "",
                        }
                        cards.push(card);
                    })
                }
            } catch (error) {
                console.log(error);
            }

            return {
                props: {
                    listCards: cards,
                    recommendProducts: recommendProducts
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

export default Cart;