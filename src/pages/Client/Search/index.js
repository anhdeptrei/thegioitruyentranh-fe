import useFetch from '~/useFetch';
import SeriesList from '~/components/SeriesList';
import { Navigate, useParams } from 'react-router-dom'; // Replace Redirect with Navigate
import Pagination from '~/components/Pagination';
import SkeletonList from '~/components/skeleton/skeletonList';
import { Helmet } from 'react-helmet';
import NotFoundPages from '~/components/Notfound/notFoundPages';

const Search = () => {
    const { search, pages } = useParams();
    const {
        data: series,
        isLoading,
        error,
    } = useFetch('http://localhost:8080/stories/search?page=' + pages + '&keyword=' + search);
    console.log(series);
    return (
        <div className="all-list">
            {pages === undefined && <Navigate to={`/search/${search}/1/`} replace />} {/* Use Navigate here */}
            {!error && !isLoading && series && series.error === undefined && (
                <Helmet>
                    <title>Search Result - Page {pages} - ReadComic</title>
                    <meta
                        name="description"
                        content="Search Result for Comic, Manga, Manhwa, and Manhua on ReadComic"
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
                    <SeriesList series={series} title1="Search" title2={series.p_title} />
                )}
                {!error && !isLoading && series && series.error === undefined && series.length !== 0 && (
                    <Pagination series={series} url={`/search/${search}/`} />
                )}
            </div>
        </div>
    );
};

export default Search;
