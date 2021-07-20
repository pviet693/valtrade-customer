import AccessTimeIcon from '@material-ui/icons/AccessTime';
import * as common from './../utils/common';
import { Image } from 'cloudinary-react';

const AuctionCard = ({ name, time, image, currentPrice, winner, participantsNumber, onClick, imageId }) => {

    const getVersionImage = (linkImage) => {
        const arr = linkImage.split("/");
        return arr[6].replace("v", "");
    }

    return (
        <div className="auction-card" onClick={onClick}>
            <div className="img-auction-box">
                {/* <img alt="image-auction" src={image} /> */}
                <Image
                    publicId={imageId}
                    version={getVersionImage(image)}
                    cloud_name="ktant"
                    secure="true"
                    alt="Image Auction"
                    height="180"
                    width="180"
                    crop="fill"
                    loading="lazy"
                >
                </Image>
            </div>
            <div className="auction-info">
                <div className="auction-name" title={name}>{name}</div>
                <div className="auction-time"><AccessTimeIcon /> {time}</div>
                <div className="auction-price"><img src="/static/hammer.svg" alt="icon-hammer" />{common.numberWithCommas(currentPrice)} VND</div>
                <div className="auction-winner">Người thắng hiện tại: <span>Tin123</span></div>
                <div className="auction-participant-number">Số người tham gia: <span>20 người</span></div>
            </div>
        </div>
    )
}

export default AuctionCard;