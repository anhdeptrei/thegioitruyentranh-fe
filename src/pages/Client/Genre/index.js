import useFetch from '~/useFetch';
import SeriesList from '~/components/SeriesList';
import { Navigate, useParams } from 'react-router-dom'; // Replace Redirect with Navigate
import Pagination from '~/components/Pagination';
import SkeletonList from '~/components/skeleton/skeletonList';
import { Helmet } from 'react-helmet';
import NotFoundPages from '~/components/Notfound/notFoundPages';

const Genre = () => {
    const { genre, pages } = useParams();
    const {
        data: series,
        isLoading,
        error,
    } = useFetch('https://otruyenapi.com/v1/api/the-loai/' + genre + '?page=' + pages);
    console.log('series', series);
    return (
        <div className="all-list">
            {!error && !isLoading && series && series.error === undefined && (
                <Helmet>
                    <title>
                        {series.data.titlePage} - Page {pages} - ReadComic
                    </title>
                    <meta name="description" content="Latest Updated Comic, Manga, Manhwa, and Manhua on ReadComic" />
                </Helmet>
            )}
            {pages === undefined && <Navigate to={`/genre/${genre}/1/`} replace />} {/* Use Navigate here */}
            {error && (
                <div className="container">
                    <div className="text-message">{error}</div>
                </div>
            )}
            {isLoading && <SkeletonList />}
            <div className="container">
                {!error && !isLoading && series && series.error && <NotFoundPages />}
                {!error && !isLoading && series && series.error === undefined && (
                    <SeriesList series={series} title1="Genre" title2={series.data.titlePage} />
                )}
                {!error && !isLoading && series && series.error === undefined && (
                    <Pagination series={series} url={`/genre/${genre}/`} />
                )}
            </div>
        </div>
    );
};

export default Genre;
