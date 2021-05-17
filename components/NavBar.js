import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Cookie from 'js-cookie'; 

function NavBar() {
    const router = useRouter();
    const isActive = (path) => path === router.pathname;
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;

    const logout = async () => {
        Cookie.remove('access_token', { path: '/' });
        Cookie.remove();
        dispatch({
            type: 'AUTH', payload: {}
        });
    }

    return (
        <div className="top-navbar">
            <div className="top-navbar-content container">
                <div className="navbar-link">
                    <div className="navbar-link-item">
                        Trang người bán
                    </div>
                    <div className="navbar-link-item">
                        Bảng tin
                    </div>
                    <div className="navbar-link-item">
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
                                <img src="/static/logo.png" alt="logo" />
                            </a>
                        </Link>
                    </div>
                
                    <div className="navbar-search-box">
                        <div className="search-box">
                            <input className="search-box-input" placeholder="Tìm kiếm..." />
                            <button className="search-box-button" type="submit"><i className="fa fa-search" aria-hidden></i></button>
                        </div>
                        <div className="search-suggestion">
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
                        </div>
                    </div>
                    <div className="navbar-info">
                        <div className="navbar-info-item">
                            <i className="pi pi-shopping-cart" aria-hidden></i>
                            <Link href="/cart">
                                <a>
                                    Giỏ hàng
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
                                                <img src={Object.keys(auth.user.imageUrl).length > 0 ? auth.user.imageUrl.url : '/static/avatar2.png'} alt="avatar" />
                                            </div>
                                        :
                                            <div className="img-box">
                                                <img src="/static/avatar2.png" alt="avatar" />
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
                                    <Link href="/order">
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