import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { CartItem } from './../components/CartItem';
import { Checkbox } from 'primereact/checkbox';
import * as common from './../utils/common';
import api from '../utils/backend-api.utils';

const Cart = ({ listCards, recommendProducts }) => {
    
    const [cards, setCards] = useState(listCards);
    const [selectAll, setSelectAll] = useState(false);


    const increase = (cardId) => {
        let cardsTemp = cards;
        let index = cardsTemp.findIndex(x => x.id === cardId);
        cardsTemp[index].productQuantity += 1;
        cardsTemp[index].total = cardsTemp[index].productQuantity * cardsTemp[index].price;
        setCards([...cardsTemp]);
    }

    const decrease = (cardId) => {
        let cardsTemp = cards;
        let index = cardsTemp.findIndex(x => x.id === cardId);
        if (cardsTemp[index].productQuantity === 1) return;
        cardsTemp[index].productQuantity -= 1;
        cardsTemp[index].total = cardsTemp[index].productQuantity * cardsTemp[index].price;
        setCards([...cardsTemp]);
    }

    const selectCard = (cardId) => {
        let cardsTemp = cards;
        let index = cardsTemp.findIndex(x => x.id === cardId);
        cardsTemp[index].isChoose = !cardsTemp[index].isChoose;
        setCards([...cardsTemp]);

        let arrSelect = cardsTemp.filter(x => x.isChoose === true);
        setSelectAll(arrSelect.length === cardsTemp.length ? true : false);
    }

    const viewDetail = (productId) => {
        Router.push({
            pathname: '/product-detail',
            query: { id: '609ab7b22aeed90180d45c63' },
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
            try{
                const res = await api.buyer.postCart(listCards);
                if (res.status === 200){
                    if (res.data.code === 200) {
                        common.Notification("Thông báo", 'Bạn sẽ được chuyển sang trang thanh toán' ,'success');
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
                                            key={card.id}
                                            cardId={card.id} productId={card.productId}
                                            shopId={'231'} shopName={'Shop ABC'} isChoose={card.isChoose} contact={'0968250823'}
                                            productName={card.productName}
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
                                    <img src="/static/empty_cart.svg" alt="Empty cart"/>
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

    try {
        let card = {
            id: 123,
            productName: 'Apple Macbook Pro 2020 M1 - 13 Inchs (Apple M1/ 8GB/ 256GB) - Hàng Chính Hãng',
            productId: 'acd213',
            productQuantity: 1,
            price: 90000,
            isChoose: false,
            total: 90000
        }
        cards.push(card);

        let card2 = {
            id: 124,
            productName: 'Apple Macbook Pro 2020 M1 - 13 Inchs (Apple M1/ 8GB/ 256GB) - Hàng Chính Hãng',
            productId: 'acd213',
            productQuantity: 1,
            price: 90000,
            isChoose: false,
            total: 90000
        }
        cards.push(card2);

        let card3 = {
            id: 125,
            productName: 'Apple Macbook Pro 2020 M1 - 13 Inchs (Apple M1/ 8GB/ 256GB) - Hàng Chính Hãng',
            productId: 'acd213',
            productQuantity: 1,
            price: 90000,
            isChoose: false,
            total: 90000
        }
        cards.push(card3);
    } catch(error) {
        console.log(error);
    }

    return {
        props: {
            listCards: cards,
            recommendProducts: recommendProducts
        }
    }
}

export default Cart;