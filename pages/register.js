import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext, useEffect, useRef } from 'react';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import Cookie from 'js-cookie';
import api from './../utils/backend-api.utils';
import * as common from './../utils/common';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import cookie from "cookie";

const Register = () => {
    const refLoadingBar = useRef(null);
    const initialState = { name: '', email: '', password: '', cf_password: '' };
    const [userData, setUserData] = useState(initialState);
    const { name, email, password, cf_password } = userData;

    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;

    const router = useRouter();

    const handleChangeInput = event => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userRegisterBody = {
            name: name,
            email: email,
            password: password
        };

        try {
            const res = await api.buyer.register(userRegisterBody);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    const token = res.data.token;
                    Cookie.set('access_token', token, {
                        path: '/',
                        expires: 30
                    })
                    const profileRes = await api.buyer.getProfile();
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
        ref.current.continuousStart();
        try {
            const res = await api.buyer.authFacebook(response);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    Cookie.set('access_token', res.data.token, {
                        path: '/',
                        expires: 30
                    })
                    const profileRes = await api.buyer.getProfile();
                    ref.current.complete();
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
            ref.current.complete();
            comm.Toast(error, 'error');
        }
    }

    const responseGoogle = async (response) => {
        ref.current.continuousStart();
        try {
            const res = await api.buyer.authGoogle(response.profileObj);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    Cookie.set('access_token', res.data.token, {
                        path: '/',
                        expires: 30
                    })
                    const profileRes = await api.buyer.getProfile();
                    ref.current.complete();
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
        } catch(err) {
            ref.current.complete();
            comm.Toast(error, 'error');
        }
    }

    return (
        <div>
            <Head>
                <title>Đăng kí</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="register">
                <div className="container">
                    <div className="register-title">
                        <div>
                            Tạo tài khoản
                        </div>
                        <div>
                            <span>Bạn đã có tài khoản?
                                <Link href="/signin">
                                    <a>
                                        Đăng nhập
                                    </a>
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className="register-content">
                        <div className="row mx-0">
                            <div className="col-lg-6 px-3">
                                <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>

                                    <div className="form-group">
                                        <label htmlFor="name">Họ và tên</label>
                                        <input type="text" className="form-control" id="name"
                                            placeholder="Vui lòng nhập tên"
                                            name="name" value={name} onChange={handleChangeInput} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Địa chỉ email</label>
                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                            placeholder="Vui lòng nhập địa chỉ email"
                                            name="email" value={email} onChange={handleChangeInput} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Mật khẩu</label>
                                        <input type="password" className="form-control" id="exampleInputPassword1"
                                            placeholder="Vui lòng nhập mật khẩu"
                                            name="password" value={password} onChange={handleChangeInput} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword2">Xác nhận mật khẩu</label>
                                        <input type="password" className="form-control" id="exampleInputPassword2"
                                            placeholder="Vui lòng nhập lại mật khẩu"
                                            name="cf_password" value={cf_password} onChange={handleChangeInput} />
                                    </div>

                                    <button type="submit" className="btn btn-register w-100">Đăng kí</button>
                                </form>
                            </div>

                            <div className="col-lg-6 px-3">
                                <div className="mx-auto my-4">
                                    <div className="mb-2">Hoặc đăng kí bằng</div>
                                    <GoogleLogin
                                        className="btn btn-register-google w-100 mb-4"
                                        clientId="752599971421-j7m6fl75uersjpre9jh4q1rjgcr6f912.apps.googleusercontent.com"
                                        buttonText="Đăng kí bằng tài khoản Google"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                    />
                                    <FacebookLogin
                                        cssClass="btn btn-register-facebook w-100"
                                        appId="350501502927602" //APP ID NOT CREATED YET
                                        textButton="Đăng kí bằng tài khoản Facebook"
                                        fields="name,email,picture"
                                        callback={responseFacebook}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="register-footer">
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const tokens = cookie.parse(ctx.req.headers.cookie);
        if (tokens.access_token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
    }

    return {
        props: {},
    }
}

export default Register;