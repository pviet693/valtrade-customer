import Head from 'next/head';
import SlideNav from '../components/SlideNav';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import {useForm} from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useRef } from 'react';
import api from '../utils/backend-api.utils';
import * as common from './../utils/common';

function ChangePassword() {
    const {register, handleSubmit, formState: {errors}, watch } = useForm();
    const newPassword = useRef({});
    newPassword.current = watch("newPassword", "");
    const onSubmit = async () => {
        try{
            const res = await api.buyer.changePassword(newPassword.current);
            if (res.status === 200){
                if (res.data.code === 200){
                    common.Toast('Thay đổi mật khẩu thành công', 'success');
                } else {
                    const message = res.data.message || "Thay đổi mật khẩu thất bại.";
                    common.Toast(message, 'error');
                }
            }
        } catch(e){
            console.log(e);
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
                <div className="container">
                    <div className="d-flex pb-3">
                        <SlideNav />
                        <div className="change-password-content">
                            <div className="profile-edit-title">Cập nhật mật khẩu</div>
                            <hr />

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group row my-3">
                                    <label htmlFor="current-password" className="col-sm-3 col-form-label">Mật khẩu hiện tại</label>
                                    <div className="col-sm-9">
                                        <input type="password" {...register("currentPassword", { required: true, minLength: 8 })}  name="currentPassword" className="form-control" id="current-password"  onChange={() => { }} placeholder="Mật khẩu hiện tại" />
                                        {errors?.currentPassword?.type === "required" && <p className="text-dangerous">This field is required</p>}
                                        {errors?.currentPassword?.type === "minLength" && (
                                            <p className="text-dangerous">Current password must have at least 8 characters</p>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group row my-3">
                                    <label htmlFor="new-password" className="col-sm-3 col-form-label">Mật khẩu mới</label>
                                    <div className="col-sm-9">
                                        <input type="password" name="newPassword" {...register("newPassword", { required: true, minLength: 8 })} className="form-control" id="new-password" onChange={() => { }} placeholder="Mật khẩu mới" />
                                        {errors?.newPassword?.type === "required" && <p className="text-dangerous">This field is required</p>}
                                        {errors?.newPassword?.type === "minLength" && (
                                            <p className="text-dangerous">New password must have at least 8 characters</p>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group row my-3">
                                    <label htmlFor="confirm-password" className="col-sm-3 col-form-label">Xác nhận mật khẩu</label>
                                    <div className="col-sm-9">
                                        <input type="password" name="confirmPassword" {...register("confirmPassword", { required: true, minLength: 8 , validate: value => value === newPassword.current || "The passwords do not match"})} className="form-control" id="confirm-password" onChange={() => { }} placeholder="Xác nhận mật khẩu" />
                                        {errors?.confirmPassword?.type === "required" && <p className="text-dangerous">This field is required</p>}
                                        {errors?.confirmPassword?.type === "minLength" && (
                                            <p className="text-dangerous">Current password must have at least 8 characters</p>
                                        )}
                                        {errors.confirmPassword && <p className="text-dangerous">{errors.confirmPassword.message}</p>}
                                    </div>
                                </div>

                                <Button
                                    variant="contained"
                                    type="submit"
                                    className="button-save"
                                    startIcon={<SaveIcon />}
                                >
                                    Lưu lại
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;