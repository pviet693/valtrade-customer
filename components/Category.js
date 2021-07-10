const Category = ({image, name, id}) => {
    return (
        <div className="col-md-3 d-flex align-items-center flex-column">
            <div className="category-card">
                <div className="img-category-box">
                    <img alt="image-category" src={image} />
                </div>
                <div className="category-name">{name}</div>
            </div>
        </div>
    )
}

export default Category;
