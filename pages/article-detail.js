import api from "../utils/backend-api.utils";
import parse from 'html-react-parser';
import ArticleDetail from '../components/ArticleDetail';

const articleDetail = ({article}) => {
    return (
        <ArticleDetail title={article.title} content={parse(article.content, "text/xml")} timeCreate={article.timeCreate} id={article.id}/>
    )
}

export async function getServerSideProps(ctx) {
    const { query } = ctx;
    const { id } = query;
    let articleDetail = {
        id: "",
        title: "",
        content: "",
        timeCreate: ""
    }
    try {
        const res = await api.article.getDetail(id);
        if (res.status === 200) {
            if (res.data.code === 200) {
                const data = res.data.result;
                articleDetail.id = id;
                articleDetail.title = data.title || "";
                articleDetail.content = data.content || "";
                articleDetail.timeCreate = Moment(x.timeCreate).format("DD/MM/yyyy");
            }
        }
    } catch (err) {
        console.log(err);
    }
    return {
        props: {
            article: articleDetail,
        }
    }
}

export default articleDetail
