import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext, useRef } from 'react';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import Cookie from 'js-cookie';
import api from './../utils/backend-api.utils';
import * as common from './../utils/common';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import cookie from "cookie";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useForm } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import classNames from 'classnames';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const refLoadingBar = useRef(null);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { state, dispatch } = useContext(DataContext);

    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        const userRegisterBody = {
            name: data.name,
            email: data.email,
            password: data.password
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
                            setLoading(false);
                            common.ToastPrime('Thành công', 'Đăng kí thành công.', 'success', toast);
                            router.push('/');
                        } else {
                            setLoading(false);
                            const message = profileRes.data.message || "Error when get profile.";
                            common.ToastPrime('Lỗi', message, 'error', toast);
                        }
                    }
                } else {
                    setLoading(false);
                    const message = res.data.error || "Đăng kí thất bại.";
                    common.ToastPrime('Lỗi', message, 'error', toast);
                }
            }
        } catch (error) {
            setLoading(false);
            common.ToastPrime('Lỗi', error.message || error, 'error', toast);
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
        } catch (err) {
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
                <Toast ref={toast} />
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
                                <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit(onSubmit)}>

                                    <div className="form-group">
                                        <label htmlFor="name">Họ và tên</label>
                                        <input type="text"
                                            className={classNames("form-control", { "is-invalid": errors && errors.name })}
                                            id="name" placeholder="Vui lòng nhập tên"
                                            name="name"
                                            {...register('name', {
                                                required: "Tên không được trống.",
                                            })}
                                        />
                                        {errors && errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Địa chỉ email</label>
                                        <input type="email"
                                            className={classNames("form-control", { "is-invalid": errors && errors.email })}
                                            id="exampleInputEmail1" aria-describedby="emailHelp"
                                            placeholder="Vui lòng nhập địa chỉ email"
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
                                        <input type="password"
                                            className={classNames("form-control", { "is-invalid": errors && errors.password })}
                                            {...register('password', {
                                                required: "Mật khẩu không được trống.",
                                                minLength: { value: 8, message: "Mật khẩu ít nhất 8 kí tự." }
                                            })}
                                            id="exampleInputPassword1" placeholder="Vui lòng nhập mật khẩu"
                                            name="password"
                                        />
                                        {errors && errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword2">Xác nhận mật khẩu</label>
                                        <input type="password"
                                            className={classNames("form-control", { 'is-invalid': errors && errors.confirm })}
                                            id="exampleInputPassword2"
                                            placeholder="Vui lòng nhập lại mật khẩu"
                                            name="confirm"
                                            {...register('confirm', {
                                                required: "Mật khẩu không được trống.", minLength: { value: 8, message: "Mật khẩu ít nhất 8 kí tự." },
                                                validate: value => {
                                                    if (value === getValues('password')) { return true } else { return "Mật khẩu không khớp." }
                                                },
                                            })}
                                        />
                                        {errors && errors.confirm && <div className="invalid-feedback">{errors.confirm.message}</div>}
                                    </div>

                                    <div className="button-wrapper">
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            className="btn btn-register"
                                            disabled={loading}
                                        >
                                            Đăng kí
                                        </Button>
                                        {loading && <CircularProgress size={24} className='loading' />}
                                    </div>
                                </form>
                            </div>

                            <div className="col-lg-6 px-3">
                                <div className="mx-auto my-4">
                                    <div className="mb-2">Hoặc đăng kí bằng</div>
                                    <GoogleLogin
                                        className="btn btn-register-google w-100 mb-4"
                                        clientId="472816343412-ur81bi98s6dit0oo2h1bjqv56qonrsfc.apps.googleusercontent.com"
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