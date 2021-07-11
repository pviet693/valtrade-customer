import { Image } from 'cloudinary-react';

const Brand = ({ name, image, imageId }) => {

    const getVersionImage = (linkImage) => {
        const arr = linkImage.split("/");
        return arr[6].replace("v", "");
    }

    return (
        <div className="brand-card">
            <div className="img-brand-box">
                {/* <img alt="image-brand" src={image} /> */}
                <Image
                    publicId={imageId}
                    version={getVersionImage(image)}
                    cloud_name="ktant"
                    secure="true"
                    alt="Image Brand"
                    height="140"
                    width="140"
                    crop="fill"
                    loading="lazy"
                >
                </Image>
            </div>
            <div className="brand-name">{name}</div>
        </div>
    )
}

export default Brand;