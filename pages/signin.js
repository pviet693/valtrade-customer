import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext, useRef } from 'react';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import Cookie from 'js-cookie';
import api from './../utils/backend-api.utils';
import * as common from './../utils/common';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useForm } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import classNames from 'classnames';

const SigIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;

    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const loginRes = await api.buyer.login(data);
            if (loginRes.status === 200) {
                const data = loginRes.data;
                if (data.code === 200) {
                    const token = loginRes.data.token;
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
                            setLoading(false);
                            common.ToastPrime('Thành công', 'Đăng nhật thành công.', 'success', toast);
                            router.push('/');
                        } else {
                            setLoading(false);
                            const message = profileRes.data.message || "Error when get profile.";
                            common.ToastPrime('Lỗi', message, 'error', toast);
                        }
                    }
                } else {
                    setLoading(false);
                    const message = loginRes.data.message || "Đăng nhập thất bại.";
                    common.ToastPrime('Lỗi', message, 'error', toast);
                }
            }
        } catch (error) {
            setLoading(false);
            common.ToastPrime('Lỗi', error.message || error, 'error', toast);
        }
    }

    const responseFacebook = async (response) => {

        try {
            const res = await api.buyer.authFacebook(response);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    Cookie.set('access_token', res.data.token, {
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
        } catch (err) {
            comm.Toast(error, 'error');
        }
    }

    const responseGoogle = async (response) => {
        try {
            const res = await api.buyer.authGoogle(response.profileObj);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    Cookie.set('access_token', res.data.token, {
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
        } catch (err) {
            common.Toast(error, 'error');
        }
    }

    return (
        <div>
            <Head>
                <title>Đăng nhập</title>
            </Head>
            <div className="signin">
                <Toast ref={toast} />
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
                                <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Địa chỉ email/Số điện thoại</label>
                                        <input
                                            type="email"
                                            className={classNames("form-control", { 'is-invalid': errors && errors.email })}
                                            id="exampleInputEmail1" aria-describedby="emailHelp"
                                            placeholder="Vui lòng nhập email"
                                            name="email"
                                            {...register('email', {
                                                required: "Email không được trống.",
                                                pattern: {
                                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                    message: 'Email không hợp lệ.'
                                                }
                                            })}
                                        />
                                        {errors && errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Mật khẩu</label>
                                        <input
                                            type="password"
                                            className={classNames("form-control", { 'is-invalid': errors && errors.password })}
                                            id="exampleInputPassword1" placeholder="Vui lòng nhập mật khẩu"
                                            name="password"
                                            {...register('password', {
                                                required: "Mật khẩu không được trống.",
                                                minLength: { value: 8, message: "Mật khẩu ít nhất 8 kí tự." }
                                            })}
                                        />
                                        {errors && errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                    </div>
                                    <div className="d-flex my-2 justify-content-end">
                                        <Link href="/reset-password">
                                            <a>
                                                Quên mật khẩu ?
                                            </a>
                                        </Link>
                                    </div>
                                    <div className="button-wrapper">
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            className="btn btn-signin"
                                            disabled={loading}
                                        >
                                            Đăng nhập
                                        </Button>
                                        {loading && <CircularProgress size={24} className='loading' />}
                                    </div>
                                </form>
                            </div>
                            <div className="col-lg-6 px-4">
                                <div className="mx-auto my-4">
                                    <div className="mb-2">Hoặc đăng nhập bằng</div>
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