const Notification = ({content, time, id}) => {
    return (
        <div className="notification-item__container">
            <div className="notification-item__content">
                <div className="notification-item__row">
                    <img src="/static/adidas-3-la.jpg" width="60" height="60" />
                    <div className="notification-content">
                        <div className="content">
                            {content}
                        </div>
                        <div className="time">
                            {time}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification
