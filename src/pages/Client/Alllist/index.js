import useFetch from '~/useFetch';
import SeriesList from '~/components/SeriesList';
import { useParams } from 'react-router-dom';
import Pagination from '~/components/Pagination';
import SkeletonList from '~/components/skeleton/skeletonList';
import { Helmet } from 'react-helmet';
import NotFoundPages from '~/components/Notfound/notFoundPages';

const AllList = () => {
    const { pages } = useParams();
    const {
        data: series,
        isLoading,
        error,
    } = useFetch('http://localhost:8080/stories/status/dang-cap-nhat/page?page=' + pages);

    return (
        <div className="all-list">
            {!error && !isLoading && series && series.error === undefined && (
                <Helmet>
                    <title>Releasing Series - Page {pages} - ReadComic</title>
                    <meta name="description" content="All Series List Comic, Manga, Manhwa, and Manhua on ReadComic" />
                </Helmet>
            )}
            {error && (
                <div className="container">
                    <div className="text-message">{error}</div>
                </div>
            )}
            {isLoading && <SkeletonList />}
            <div className="container">
                {!error && !isLoading && series && series.error && <NotFoundPages />}
                {!error && !isLoading && series && series.error === undefined && (
                    <SeriesList series={series} title1="Series" title2="List" />
                )}
                {!error && !isLoading && series && series.error === undefined && (
                    <Pagination series={series} url="/series-list/" />
                )}
            </div>
        </div>
    );
};

export default AllList;
