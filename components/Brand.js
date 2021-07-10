const Brand = ({name,image}) => {
    return (
        <div className="brand-card">
            <div className="img-brand-box">
                <img alt="image-brand" src={image} />
            </div>
            <div className="brand-name">{name}</div>
        </div>
    )
}

export default Brand;