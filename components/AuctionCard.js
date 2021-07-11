import AccessTimeIcon from '@material-ui/icons/AccessTime';
import * as common from './../utils/common';

const AuctionCard = ({ name, time, image, currentPrice, winner, participantsNumber, onClick }) => {
    return (
        <div className="auction-card" onClick={onClick}>
            <div className="img-auction-box">
                <img alt="image-auction" src={image} />
            </div>
            <div className="auction-info">
                <div className="auction-name" title={name}>{name}</div>
                <div className="auction-time"><AccessTimeIcon /> {'00:21:57'}</div>
                <div className="auction-price"><img src="/static/hammer.svg" alt="icon-hammer" />{common.numberWithCommas(currentPrice)} VND</div>
                <div className="auction-winner">Người thắng hiện tại: <span>Tin123</span></div>
                <div className="auction-participant-number">Số người tham gia: <span>20 người</span></div>
            </div>
        </div>
    )
}

export default AuctionCard;