import Head from 'next/head';
import SlideNav from '../components/SlideNav';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

function ChangePassword() {

    const handleSubmit = () => {

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

                            <form onSubmit={handleSubmit}>
                                <div className="form-group row my-3">
                                    <label htmlFor="current-password" className="col-sm-3 col-form-label">Mật khẩu hiện tại</label>
                                    <div className="col-sm-9">
                                        <input type="password" name="currentPassword" className="form-control" id="current-password" value={""} onChange={() => { }} placeholder="Mật khẩu hiện tại" />
                                    </div>
                                </div>

                                <div className="form-group row my-3">
                                    <label htmlFor="new-password" className="col-sm-3 col-form-label">Mật khẩu mới</label>
                                    <div className="col-sm-9">
                                        <input type="password" name="newPassword" className="form-control" id="new-password" value={""} onChange={() => { }} placeholder="Mật khẩu mới" />
                                    </div>
                                </div>

                                <div className="form-group row my-3">
                                    <label htmlFor="confirm-password" className="col-sm-3 col-form-label">Xác nhận mật khẩu</label>
                                    <div className="col-sm-9">
                                        <input type="password" name="confirmPassword" className="form-control" id="confirm-password" value={""} onChange={() => { }} placeholder="Xác nhận mật khẩu" />
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