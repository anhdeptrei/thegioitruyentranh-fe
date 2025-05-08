import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Switch } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BookmarkContextProvider from '~/contexts/bookmarkContext';
import HistoryContextProvider from '~/contexts/historyContext';
import ScrollToTop from '~/components/ScrollToTop';
import ScrollButton from '~/components/ScrollButton';

const DefaultLayout = ({ children }) => {
    const getDark = () => {
        return JSON.parse(localStorage.getItem('dark')) || false;
    };
    const [dark, setDark] = useState(getDark());
    useEffect(() => {
        localStorage.setItem('dark', JSON.stringify(dark));
    }, [dark]);
    const darkMode = () => {
        setDark(!dark);
    };
    return (
        <>
            <Helmet>
                <title>ReadComic - Read Comic, Manga, Manhwa, Manhua, Online</title>
                <meta name="description" content="ReadComic - Free Read English Comic, Manga, Manhwa, Manhua Online" />
                <meta name="keyword" content="Read Comic, Read Manga, Read Manhwa, Read Manhua" />
            </Helmet>
            <ScrollToTop />
            {dark ? <style>{`body{background:#2f303e}`}</style> : ''}
            <div className={dark ? 'theme-dark' : ''}>
                <BookmarkContextProvider>
                    <HistoryContextProvider>
                        <Header dark={dark} darkMode={darkMode} />
                        <ScrollButton />
                        <div className="content">{children}</div>
                        <Footer />
                    </HistoryContextProvider>
                </BookmarkContextProvider>
            </div>
        </>
    );
};

export default DefaultLayout;
