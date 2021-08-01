import Head from 'next/head';
import { useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import url from './../utils/backend-api.utils';
import { validatePassword } from './../utils/validate.utils';

const NewPassword = () => {
    const router = useRouter()
    const { token, id } = router.query;

    const [password, setPassword] = useState({
        new_password: '',
        confirm_password: ''
    });

    const [errorPassword, setErrorPassword] = useState(false);
    const [errorNotMatch, setErrorNotMatch] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleChangeInput = event => {
        const { name, value } = event.target;
        setPassword({
            ...password,
            [name]: value
        });

        if (name === 'new_password') {
            setErrorPassword(!validatePassword(value));
        }
        if (name === 'confirm_password') {
            setErrorNotMatch(password.new_password !== value);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowError(true);
        if (!validatePassword(password.new_password) || password.new_password !== password.confirm_password) {
            if (!validatePassword(password.new_password)) {
                setErrorPassword(true);
            }
            if (password.new_password !== password.confirm_password) {
                setErrorNotMatch(true);
            }
            return;
        }

        try {
            const body = {
                password: password.new_password,
                userId: id,
                token: token
            }
            const res = await url.buyer.resetPassword(body)
            // if (res.status === 200) {
            //     console.log(res.data);
            // }
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <Head>
                <title>Mật khẩu mới</title>
            </Head>
            <div className="new-password">
                <div className="new-password-content">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center mb-4">Mật khẩu mới</h2>
                        <div className="form-group">
                            <label htmlFor="new_password">Mật khẩu</label>
                            <input className={classNames("form-control", { 'is-invalid': errorPassword && showError })} type="password" name="new_password" placeholder="Vui lòng nhập mật khẩu" value={password.new_password} onChange={handleChangeInput} />
                            {
                                errorPassword && showError &&
                                <div className="invalid-feedback">
                                    Mật khẩu không hợp lệ (ít nhất 8 kí tự).
                                </div>
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm_password">Xác nhận mật khẩu</label>
                            <input className={classNames("form-control", { 'is-invalid': errorNotMatch && showError })} type="password" name="confirm_password" placeholder="Vui lòng nhập lại mật khẩu" value={password.confirm_password} onChange={handleChangeInput} />
                            {
                                errorNotMatch && showError &&
                                <div className="invalid-feedback">
                                    Mật khẩu không trùng.
                                </div>
                            }
                        </div>
                        <div className="form-group">
                            <input className="form-control btn btn-success" type="submit" name="check-email" value="Tiếp tục" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewPassword;