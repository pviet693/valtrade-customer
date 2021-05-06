import Head from 'next/head';
import { useState } from 'react';
import url from '../utils/backend-api.utils';

const ResetPassword = () => {

    const [email, setEmail] = useState('');

    const handleChangeInput = event => {
        const { name, value } = event.target;
        setEmail(value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await url.buyer.resetLink({ email: email });
        if (res.status === 200) {
            console.log(res.data);
        }
    }

    return (
        <div>
            <Head>
                <title>Quên mật khẩu</title>
            </Head>
            <div className="reset-password">
                <div className="reset-password-content">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center mb-4">Quên mật khẩu</h2>
                        <div className="form-group">
                            <input className="form-control" type="email" name="email" placeholder="Vui lòng nhập địa chỉ email" value={email} onChange={handleChangeInput} />
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

export default ResetPassword;