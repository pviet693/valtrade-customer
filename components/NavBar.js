import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Cookie from 'js-cookie';
import SearchIcon from '@material-ui/icons/Search';

function NavBar() {
    const router = useRouter();
    const isActive = (path) => path === router.pathname;
    const { state, dispatch } = useContext(DataContext);
    const { auth, cart, searchQuery } = state;

    const logout = async () => {
        if (window.gapi) {
            const auth2 = gapi.auth2.getAuthInstance();
            if (auth2) {
                auth2.signOut().then(
                    auth2.disconnect()
                )
            }
        }
        Cookie.remove('access_token', { path: '/' });
        Cookie.remove();
        dispatch({
            type: 'AUTH', payload: {}
        });
        dispatch({ type: 'ADD_CART', payload: [] });
    }

    const search = async (e) => {
        e.preventDefault();

        router.push({
            pathname: '/product',
            query: { search: searchQuery },
        }, null, { shallow: true });
    }

    return (
        <div className="top-navbar">
            <div className="top-navbar-content container">
                <div className="navbar-link">
                    <div className="navbar-link-item">
                        <a href="https://valtrade-seller.me/" className="link-seller" >Trang người bán</a>
                    </div>
                    <div className="navbar-link-item">
                        <a href="https://valtrade.me/article" className="link-article" >Bảng tin</a>
                    </div>
                    <div className="navbar-link-item" onClick={() => router.push("/notification", null, { shallow: true })}>
                        <i className="pi pi-bell" aria-hidden></i>
                        <div>
                            Thông báo
                        </div>
                    </div>
                    <div className="navbar-link-item">
                        <i className="pi pi-question-circle" aria-hidden></i>
                        <div>
                            Trợ giúp
                        </div>
                    </div>
                </div>
                <div className="navbar-body">
                    <div className="navbar-logo">
                        <Link href="/">
                            <a>
                                <img alt="image-logo" width="200px" height="68px" src="/static/logo.png" />
                            </a>
                        </Link>
                    </div>

                    <div className="navbar-search-box">
                        <form onSubmit={search}>
                            <div className="search-box">
                                <input className="search-box-input" placeholder="Tìm kiếm..." onChange={(e) => dispatch({ type: 'SEARCH', payload: e.target.value })} value={searchQuery} />
                                <button className="search-box-button" type="submit"><SearchIcon /></button>
                            </div>
                        </form>
                        {/* <div className="search-suggestion">
                            <div className="suggestion-item">
                                Đồng hồ
                            </div>
                            <div className="suggestion-item">
                                Laptop
                            </div>
                            <div className="suggestion-item">
                                Điện thoại
                            </div>
                            <div className="suggestion-item">
                                Xe máy
                            </div>
                            <div className="suggestion-item">
                                Máy tính bảng
                            </div>
                        </div> */}
                    </div>
                    <div className="navbar-info">
                        <div className="navbar-info-item">
                            <Link href="/cart">
                                <a>
                                    <i className="pi pi-shopping-cart" aria-hidden></i>
                                    <div>Giỏ hàng</div>
                                    <div className="cart-quantity">{cart.length}</div>
                                </a>
                            </Link>
                        </div>
                        {
                            (Object.keys(auth).length === 0) &&
                            <div className="navbar-info-item">
                                <i className="pi pi-user-plus" aria-hidden></i>
                                <Link href="/register">
                                    <a>
                                        Đăng kí
                                    </a>
                                </Link>
                            </div>
                        }
                        {
                            (Object.keys(auth).length === 0) &&
                            <div className="navbar-info-item">
                                <i className="pi pi-user" aria-hidden></i>
                                <Link href="/signin">
                                    <a>
                                        Đăng nhập
                                    </a>
                                </Link>
                            </div>
                        }
                        {
                            (Object.keys(auth).length > 0) &&
                            <div className="navbar-profile d-flex align-items-center ml-2">
                                <div className="navbar-account">
                                    {
                                        (Object.keys(auth.user).length > 0)
                                            ?
                                            <div className="img-box">
                                                <img alt="image-profile" src={Object.keys(auth.user.imageUrl).length > 0 ? auth.user.imageUrl.url : '/static/avatar2.png'} />
                                            </div>
                                            :
                                            <div className="img-box">
                                                <img alt="image-profile" src="/static/avatar2.png" />
                                            </div>
                                    }
                                    <div className="name-profile">
                                        {auth.user.name}
                                    </div>
                                </div>

                                <div className="hover-profile">
                                    <div className="connect" />
                                    <Link href="/profile">
                                        <a>
                                            Hồ sơ của tôi
                                        </a>
                                    </Link>
                                    <Link href="/my-order">
                                        <a>
                                            Đơn hàng của tôi
                                        </a>
                                    </Link>
                                    <Link href="/">
                                        <a onClick={logout}>
                                            <div>Đăng xuất</div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar;