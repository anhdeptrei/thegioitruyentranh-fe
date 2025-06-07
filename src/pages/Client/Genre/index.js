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
    } = useFetch('http://localhost:8080/categories/detail/' + genre + '?page=' + pages);
    console.log('series', series);
    return (
        <div className="all-list">
            {!error && !isLoading && series && series.error === undefined && (
                <Helmet>
                    <title>
                        {series.category_description} - Trang {pages} - Thế giới truyện tranh
                    </title>
                    <meta
                        name="description"
                        content="Truyện tranh, Manga, Manhwa và Manhua mới nhất trên thế giới truyện tranh"
                    />
                </Helmet>
            )}
            {pages === undefined && <Navigate to={`/genre/${genre}/0/`} replace />} {/* Use Navigate here */}
            {error && (
                <div className="container">
                    <div className="text-message">{error}</div>
                </div>
            )}
            {isLoading && <SkeletonList />}
            <div className="container">
                {!error && !isLoading && series && series.error && <NotFoundPages />}
                {!error && !isLoading && series && series.error === undefined && (
                    <SeriesList
                        series={series.stories}
                        title1="Thể loại"
                        title2={series.category_name}
                        description={series.category_description}
                    />
                )}
                {!error && !isLoading && series && series.error === undefined && (
                    <Pagination series={series.stories} url={`/genre/${genre}/`} />
                )}
            </div>
        </div>
    );
};

export default Genre;
