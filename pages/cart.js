import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { CartItem } from './../components/CartItem';
import { Checkbox } from 'primereact/checkbox';
import * as common from './../utils/common';
import api from '../utils/backend-api.utils';
import cookie from 'cookie';

const Cart = ({ listCards, recommendProducts }) => {
    const [cards, setCards] = useState(listCards);
    const [selectAll, setSelectAll] = useState(false);


    const increase = (productId) => {
        let cardsTemp = cards;
        let index = cardsTemp.findIndex(x => x.productId === productId);
        console.log(cardsTemp[index]);
        if (cardsTemp[index].productQuantity === cardsTemp[index].quantity) {
            common.Notification("Thông báo", 'Sản phẩm không đủ số lượng', 'error');
            return;
        }
        cardsTemp[index].productQuantity += 1;
        cardsTemp[index].total = cardsTemp[index].productQuantity * cardsTemp[index].price;
        setCards([...cardsTemp]);
    }

    const decrease = (productId) => {
        let cardsTemp = cards;
        let index = cardsTemp.findIndex(x => x.productId === productId);
        if (cardsTemp[index].productQuantity === 1) return;
        cardsTemp[index].productQuantity -= 1;
        cardsTemp[index].total = cardsTemp[index].productQuantity * cardsTemp[index].price;
        setCards([...cardsTemp]);
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

    const remove = (cardId) => {
        let cardsTemp = cards;
        cardsTemp = cardsTemp.filter(x => x.id !== cardId);
        setCards([...cardsTemp]);
    }

    const selectAllCard = () => {
        setSelectAll(!selectAll);
        let cardsTemp = cards;
        cardsTemp.forEach((element, index) => {
            cardsTemp[index].isChoose = !cardsTemp[index].isChoose;
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
        if (totalQuantity() > 0) {
            let cardsTemp = cards;
            cardsTemp = cardsTemp.filter(x => x.isChoose !== true);
            setCards([...cardsTemp]);
        }
    }

    const checkout = async () => {
        if (totalQuantity() > 0) {
            try {
                const res = await api.buyer.postCart(listCards);
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        common.Notification("Thông báo", 'Bạn sẽ được chuyển sang trang thanh toán', 'success');
                        Router.push({
                            pathname: '/checkout',
                            query: { id: '13579' }
                        })
                    } else {
                        common.Toast("Cập nhật thất bại.", 'error');
                    }
                }
            } catch (e) {
                console.log(e);
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
                                            shopId={'231'} shopName={'Shop ABC'} isChoose={card.isChoose} contact={'0968250823'}
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
                                    <button className="btn btn-danger" onClick={removeAll}>Xóa</button>
                                </div>
                                <div className="sum-cart__right">
                                    <div className="sum-cart__right-total">
                                        Tổng tiền hàng ({totalQuantity()} sản phẩm): <span>{common.numberWithCommas(cartTotal())} VND</span>
                                    </div>
                                    <button className="btn btn-primary" onClick={checkout}>Mua hàng</button>
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
                    const cartItems = res.data.cartItems;
                    Object.keys(cartItems).forEach(id => {
                        console.log(cartItems[id]);
                        let card = {
                            productName: cartItems[id].name || "",
                            productId: id || "",
                            productImage: cartItems[id].img.url || "",
                            productQuantity: cartItems[id].quantity || 0,
                            price: cartItems[id].price || 0,
                            isChoose: false,
                            total: cartItems[id].quantity * cartItems[id].price,
                            quantity: cartItems[id].quantity || 1
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