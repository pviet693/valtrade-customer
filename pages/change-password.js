import Head from 'next/head';
import SlideNav from '../components/SlideNav';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import * as common from './../utils/common';
import api from '../utils/backend-api.utils';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';

function ChangePassword() {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let body = {
                password: data.currentPassword,
                newPassword: data.newPassword
            }
            const res = await api.buyer.changePassword(body);
            setLoading(false);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.ToastPrime('Thành công', 'Thay đổi mật khẩu thành công.', 'success', toast);
                } else {
                    const message = res.data.message || "Thay đổi mật khẩu thất bại.";
                    common.ToastPrime('Lỗi', message, 'error', toast);
                }
            }
        } catch (e) {
            setLoading(false);
            common.ToastPrime('Lỗi', e.message || e, 'error', toast);
        }
    }

    return (
        <>
            <Head>
                <title>
                    Thay đổi mật khẩu
                </title>
            </Head>
            <div className="change-password-container">
                <Toast ref={toast} />
                <div className="container">
                    <div className="d-flex pb-3">
                        <SlideNav />
                        <div className="change-password-content">
                            <div className="content-title">Cập nhật mật khẩu</div>
                            <hr />

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group row my-3">
                                    <label htmlFor="current-password" className="col-sm-3 col-form-label">Mật khẩu hiện tại</label>
                                    <div className="col-sm-9">
                                        <input type="password"
                                            {...register('currentPassword', {
                                                required: "Mật khẩu hiện tại không được trống.",
                                                minLength: { value: 8, message: "Mật khẩu ít nhất 8 kí tự." }
                                            })}
                                            name="currentPassword"
                                            className={classNames("form-control", { 'is-invalid': errors && errors.currentPassword })}
                                            id="current-password" placeholder="Mật khẩu hiện tại" />
                                        {errors && errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword.message}</div>}
                                    </div>
                                </div>

                                <div className="form-group row my-3">
                                    <label htmlFor="new-password" className="col-sm-3 col-form-label">Mật khẩu mới</label>
                                    <div className="col-sm-9">
                                        <input type="password"
                                            {...register('newPassword', {
                                                required: "Mật khẩu mới không được trống.",
                                                minLength: { value: 8, message: "Mật khẩu ít nhất 8 kí tự." }
                                            })}
                                            name="newPassword"
                                            className={classNames("form-control", { 'is-invalid': errors && errors.newPassword })}
                                            id="new-password" placeholder="Mật khẩu mới" />
                                        {errors && errors.newPassword && <div className="invalid-feedback">{errors.newPassword.message}</div>}
                                    </div>
                                </div>

                                <div className="form-group row my-3">
                                    <label htmlFor="confirm-password" className="col-sm-3 col-form-label">Xác nhận mật khẩu</label>
                                    <div className="col-sm-9">
                                        <input type="password"
                                            {...register('confirmPassword', {
                                                required: "Mật khẩu không được trống.", minLength: { value: 8, message: "Mật khẩu ít nhất 8 kí tự." },
                                                validate: value => {
                                                    if (value === getValues('newPassword')) { return true } else { return "Mật khẩu không khớp." }
                                                },
                                            })}
                                            name="confirmPassword"
                                            className={classNames("form-control", { 'is-invalid': errors && errors.confirmPassword })}
                                            id="confirm-password" placeholder="Xác nhận khẩu mới" />
                                        {errors && errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                                    </div>
                                </div>

                                <div className="button-wrapper">
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        className="button-save"
                                        disabled={loading}
                                        startIcon={<SaveIcon />}
                                    >
                                        Lưu lại
                                    </Button>
                                    {loading && <CircularProgress size={24} className='loading' />}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;