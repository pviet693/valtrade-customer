import React from 'react';
import Link from 'next/link';

function Footer() {
    return (
        <div className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="row mx-0">
                        <div className="col-lg-3 px-0">
                            <Link href="/">
                                <a>
                                    <div className="footer-logo-content">
                                        <div className="footer-logo">
                                            <img alt="image-footer" src="/static/logo-footer.png" />
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        </div>
                        <div className="col-lg-4 px-0">
                            <div className="title">
                                GIỚI THIỆU VALTRADE
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Về chúng tôi</div>
                                    </a>
                                </Link>
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Chính sách giao dịch chung</div>
                                    </a>
                                </Link>
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Chính sách bảo mật</div>
                                    </a>
                                </Link>
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Chính sách giao hàng và thanh toán</div>
                                    </a>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-3 px-0">
                            <div className="title">
                                THÔNG TIN &#38; HƯỚNG DẪN
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Hướng dẫn sử dụng</div>
                                    </a>
                                </Link>
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Câu hỏi thường gặp</div>
                                    </a>
                                </Link>
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Thông tin hỗ trợ</div>
                                    </a>
                                </Link>
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Bảng tin</div>
                                    </a>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-2 px-0">
                            <div className="title">
                                LIÊN HỆ
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Hotline: 0968 250 823</div>
                                    </a>
                                </Link>
                            </div>
                            <div className="content">
                                <Link href="/">
                                    <a>
                                        <div>Email: cskh@valtrade.com</div>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;