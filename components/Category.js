import { Image } from 'cloudinary-react';

const Category = ({ image, imageId, name, id }) => {
    
    const getVersionImage = (linkImage) => {
        const arr = linkImage.split("/");
        return arr[6].replace("v", "");
    }

    return (
        <div className="col-md-3 d-flex align-items-center flex-column">
            <div className="category-card">
                <div className="img-category-box">
                    {/* <img alt="image-category" src={image} /> */}
                    <Image
                        publicId={imageId}
                        version={getVersionImage(image)}
                        cloud_name="ktant"
                        secure="true"
                        alt="Image Product"
                        height="160"
                        width="160"
                        crop="fill"
                        loading="lazy"
                    >
                    </Image>
                </div>
                <div className="category-name">{name}</div>
            </div>
        </div>
    )
}

export default Category;
