import Link from "next/link";
import { useContext } from "react";
import { DataContext } from "../store/GlobalState";

const SlideNav = () => {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;

    return (
        <div className="slide-nav">
            <ul>
                <li className="slide-nav-avatar d-flex align-items-center justify-content-start">
                    {
                        auth.user && Object.keys(auth.user).length > 0 && Object.keys(auth.user.imageUrl).length > 0
                        ?
                            <img src={auth.user.imageUrl.url} alt="avatar" />
                        :
                            <img src={'/static/avatar2.png'} alt="avatar" />
                    }
                    <div>
                        <div>Tài khoản của</div>
                        <div>{auth.user ? auth.user.name : 'Error'}</div>
                    </div>
                </li>
                <hr/>
                <li>
                    <Link href="/profile">
                        <a className="d-flex align-items-center">
                            <i className="fas fa-user-edit" aria-hidden />
                            <div>Thông tin cá nhân</div>
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/profile">
                        <a className="d-flex align-items-center">
                            <i className="fa fa-bell" aria-hidden />
                            <div>Thông báo</div>
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/profile">
                        <a className="d-flex align-items-center">
                            <i className="fa fa-book" aria-hidden />
                            <div>Quản lí đơn hàng</div>
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/profile">
                        <a className="d-flex align-items-center">
                            <i className="fa fa-address-card" aria-hidden />
                            <div>Sổ địa chỉ</div>
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/profile">
                        <a className="d-flex align-items-center">
                            <i className="fa fa-key" aria-hidden />
                            <div>Thay đổi mật khẩu</div>
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/profile">
                        <a className="d-flex align-items-center">
                            <i className="fa fa-comment" aria-hidden />
                            <div>Chat</div>
                        </a>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default SlideNav;