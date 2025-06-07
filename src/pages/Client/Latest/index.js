import useFetch from '~/useFetch';
import SeriesList from '~/components/SeriesList';
import { useParams } from 'react-router-dom';
import Pagination from '~/components/Pagination';
import SkeletonList from '~/components/skeleton/skeletonList';
import { Helmet } from 'react-helmet';
import NotFoundPages from '~/components/Notfound/notFoundPages';

const Latest = () => {
    const { pages } = useParams();
    const { data: series, isLoading, error } = useFetch('http://localhost:8080/stories/all/page?page=' + pages);
    console.log('series', series);
    return (
        <div className="all-list">
            {!error && !isLoading && series && series.error === undefined && (
                <Helmet>
                    <title>Cập nhật mới nhất - Trang {pages} - thế giới truyện tranh</title>
                    <meta
                        name="description"
                        content="Truyện tranh Manga, Manhwa và Manhua mới nhất trên thế giới truyện tranh"
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
                    <SeriesList series={series} title1="Cập nhật" title2="mới nhất" />
                )}
                {!error && !isLoading && series && series.error === undefined && (
                    <Pagination series={series} url="/latest/" />
                )}
            </div>
        </div>
    );
};

export default Latest;
