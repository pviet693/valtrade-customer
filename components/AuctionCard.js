import AccessTimeIcon from '@material-ui/icons/AccessTime';

const AuctionCard = ({ name, time, image, currentPrice, winner, participantsNumber, onClick }) => {
    return (
        <div className="auction-card" onClick={onClick}>
            <div className="img-auction-box">
                <img src={image} />
            </div>
            <div className="auction-info">
                <div className="auction-name">{name}</div>
                <div className="auction-time"><AccessTimeIcon/> {'00:21:57'}</div>
                <div className="auction-price"><img src="/static/hammer.svg"/>{new Intl.NumberFormat().format(currentPrice)} VND</div>
                <div className="auction-winner">Người thắng hiện tại: <span>Viet pro</span></div>
                <div className="auction-participant-number">Số người tham gia: <span>20 người</span></div>
            </div>
        </div>
    )
}

export default AuctionCard;