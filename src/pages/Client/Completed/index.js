import useFetch from '~/useFetch';
import SeriesList from '~/components/SeriesList';
import { useParams } from 'react-router-dom';
import Pagination from '~/components/Pagination';
import SkeletonList from '~/components/skeleton/skeletonList';
import { Helmet } from 'react-helmet';
import NotFoundPages from '~/components/Notfound/notFoundPages';

const Completed = () => {
    const { pages } = useParams();
    const {
        data: series,
        isLoading,
        error,
    } = useFetch('http://localhost:8080/stories/status/hoan-thanh/page?page=' + pages);

    return (
        <div className="all-list">
            {!error && !isLoading && series && series.error === undefined && (
                <Helmet>
                    <title>Truyện đã hoàn thành - Trang {pages} - Thế giới truyện tranh</title>
                    <meta
                        name="description"
                        content="Danh sách tất cả các bộ truyện tranh đã hoàn thành trên thế giới truyện tranh"
                    />
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
                    <SeriesList series={series} title1="Truyện" title2="đã hoàn thành" />
                )}
                {!error && !isLoading && series && series.error === undefined && (
                    <Pagination series={series} url="/completed/" />
                )}
            </div>
        </div>
    );
};

export default Completed;
