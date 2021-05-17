import '../styles/globals.css';
import '../styles/navbar.scss';
import '../styles/footer.scss';
import '../styles/home.scss';
import '../styles/register.scss';
import '../styles/signin.scss';
import '../styles/profile.scss';
import '../styles/slidenav.scss';
import '../styles/reset-password.scss';
import '../styles/new-password.scss';
import '../styles/product.scss';
import '../styles/product-detail.scss';
import '../styles/product-card.scss';
import '../styles/auction.scss';
import '../styles/auction-detail.scss';
import '../styles/auction-card.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import Layout from '../components/Layout';
import { DataProvider } from '../store/GlobalState';
import Head from 'next/head';

import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
    return (
        <DataProvider>
            <Head>
                <link rel="shortcut icon" type="image/x-icon" href="/static/logo-title.png" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </DataProvider>
    )
}

export default MyApp;
