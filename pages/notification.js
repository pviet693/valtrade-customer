import Head from "next/head";
import SlideNav from "./../components/SlideNav";

function Notification(params) {
    return (
        <>
            <Head>
                <title>Thông báo</title>
            </Head>
            <div className="notification__container">
                <div className="container">
                    <div className="d-flex pb-3">
                        <SlideNav />
                        <div className="notification__content">
                            <div className="notification__content__title">Thông báo</div>
                            <hr />

                            <div className="notification-item__container">
                                <div className="notification-item__content">
                                    <div className="notification-item__row">
                                        <img src="/static/adidas-3-la.jpg" width="60" height="60" />
                                        <div className="notification-content">
                                            <div className="title">
                                                Title thông báo
                                            </div>
                                            <div className="content">
                                                Nội dung thông báo
                                            </div>
                                            <div className="time">
                                                22/07/2021 11:12:21 AM
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="notification-item__container">
                                <div className="notification-item__content">
                                    <div className="notification-item__row">
                                        <img src="/static/adidas-3-la.jpg" width="60" height="60" />
                                        <div className="notification-content">
                                            <div className="title">
                                                Title thông báo
                                            </div>
                                            <div className="content">
                                                Nội dung thông báo
                                            </div>
                                            <div className="time">
                                                22/07/2021 11:12:21 AM
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Notification;
