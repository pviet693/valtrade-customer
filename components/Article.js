const ArticleCard = ({image, title, content, timeCreate}) => {
    return (
        <div className="article-card row"> 
            <div className="article-card-img col-md-4">
                <img src={image} alt="banner" style={{width: '300px', height: '200px'}}/>
            </div>
            <div className="article-card-infor col-md-8">
                <div className="article-card-title">
                    {title}
                </div>
                <div className="article-card-content">
                    {content}
                </div>
                <div className="article-card-time">
                    Ngày đăng: {timeCreate}
                </div>
            </div>

        </div>
    )
}

export default ArticleCard
