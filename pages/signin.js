import Cookies from 'js-cookie';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext, useRef } from 'react';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import Cookie from 'js-cookie';
import api from './../utils/backend-api.utils';
import * as common from './../utils/common';

const SigIn = () => {
    const initialState = { email: '', password: ''};
    const refLoadingBar = useRef(null);
    const [userData, setUserData] = useState(initialState);
    const { email, password } = userData;
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;

    const router = useRouter();

    const handleChangeInput = event => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    }

    const handleSubmit = async e => {
        e.preventDefault();

        refLoadingBar.current.continuousStart();
        try {
            const loginRes = await api.buyer.login(userData);
            if (loginRes.status === 200) {
                const data = loginRes.data;
                console.log(data);
                if (data.code === 200) {
                    const token = loginRes.data.token;
                    Cookie.set('access_token', token, {
                        path: '/',
                        expires: 30
                    })

                    const profileRes = await api.buyer.getProfile();
                    refLoadingBar.current.complete();
                    if (profileRes.status === 200) {
                        if (profileRes.data.code === 200) {
                            dispatch({
                                type: 'AUTH', payload: {
                                    user: profileRes.data.information
                                }
                            });
                            router.push('/');
                        }
                    }
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }

    const responseFacebook = async (response) => {
        refLoadingBar.current.continuousStart();

        try {
            const res = await api.buyer.authFacebook(response);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    Cookie.set('access_token', res.data.token, {
                        path: '/',
                        expires: 30
                    })
                    const profileRes = await api.buyer.getProfile();
                    refLoadingBar.current.complete();
                    if (profileRes.status === 200) {
                        if (profileRes.data.code === 200) {
                            dispatch({
                                type: 'AUTH', payload: {
                                    user: profileRes.data.information
                                }
                            });
                            router.push('/');
                        }
                    }
                }
            }
        } catch (err) {
            comm.Toast(error, 'error');
        }
    }

    const responseGoogle = async (response) => {
        refLoadingBar.current.continuousStart();

        try {
            const res = await api.buyer.authGoogle(response.profileObj);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    Cookie.set('access_token', res.data.token, {
                        path: '/',
                        expires: 30
                    })
                    const profileRes = await api.buyer.getProfile();
                    refLoadingBar.current.complete();

                    if (profileRes.status === 200) {
                        if (profileRes.data.code === 200) {
                            dispatch({
                                type: 'AUTH', payload: {
                                    user: profileRes.data.information
                                }
                            });
                            router.push('/');
                        }
                    }
                }
            }
        } catch (err) {
            comm.Toast(error, 'error');
        }
    }

    return (
        <div>
            <Head>
                <title>Đăng nhập</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="signin">
                <div className="container">
                    <div className="signin-title">
                        <div>
                            Tạo tài khoản
                            </div>
                        <div>
                            <span>Bạn chưa có tài khoản?
                                    <Link href="/register">
                                    <a>
                                        Đăng kí
                                        </a>
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className="signin-content">
                        <div className="row mx-0">
                            <div className="col-lg-6 px-4">
                                <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Địa chỉ email/Số điện thoại</label>
                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                            placeholder="Vui lòng nhập email hoặc số điện thoại"
                                            name="email" value={email} onChange={handleChangeInput} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Mật khẩu</label>
                                        <input type="password" className="form-control" id="exampleInputPassword1"
                                            placeholder="Vui lòng nhập mật khẩu"
                                            name="password" value={password} onChange={handleChangeInput} />
                                    </div>
                                    <div className="d-flex my-2 justify-content-end">
                                        <Link href="/reset-password">
                                            <a>
                                                Quên mật khẩu ?
                                            </a>
                                        </Link>
                                    </div>
                                    <button type="submit" className="btn btn-signin w-100">Đăng nhập</button>
                                </form>
                            </div>
                            <div className="col-lg-6 px-4">
                                <div className="mx-auto my-4">
                                    <div className="mb-2">Hoặc đăng nhập bằng</div>
                                    {/* <button type="submit" className="btn btn-signin-google w-100 mb-4">Đăng nhập bằng tài khoản google</button>
                                    <button type="submit" className="btn btn-signin-facebook w-100">Đăng nhập bằng tài khoản facebook</button> */}
                                    <GoogleLogin
                                        className="btn btn-signin-google w-100 mb-4"
                                        clientId="752599971421-j7m6fl75uersjpre9jh4q1rjgcr6f912.apps.googleusercontent.com"
                                        buttonText="Đăng kí bằng tài khoản Google"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                    />
                                    <FacebookLogin
                                        cssClass="btn btn-signin-facebook w-100"
                                        appId="350501502927602" //APP ID NOT CREATED YET
                                        textButton="Đăng kí bằng tài khoản Facebook"
                                        fields="name,email,picture"
                                        callback={responseFacebook}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="signin-footer">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SigIn;