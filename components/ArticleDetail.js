const ArticleDetail = ({title, content, image }) => {
    return (
        <div className="article-detail">
            <div className="article-detail-title">
                {title}
            </div>
            <div className="article-detail-content">
                {content}
            </div>
        </div>
    )
}

export default ArticleDetail
