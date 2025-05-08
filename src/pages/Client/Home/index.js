import useFetch from '~/useFetch';
import SeriesList from '~/components/SeriesList';
import { Link } from 'react-router-dom';
import SkeletonList from '~/components/skeleton/skeletonList';

const Home = () => {
    const {
        data: series,
        isLoading,
        error,
    } = useFetch('http://localhost:8080/stories/status/dang-cap-nhat/page?page=0');
    console.log(series);
    return (
        <div className="latest">
            <div className="container">
                <div className="notif">Welcome to ReadComic</div>
            </div>
            {error && (
                <div className="container">
                    <div className="text-message">{error}</div>
                </div>
            )}
            {isLoading && <SkeletonList />}
            <div className="container">
                {!error && !isLoading && series && series.error && (
                    <div className="text-message">No Series Found...</div>
                )}
                {!error && !isLoading && series && series.error === undefined && (
                    <SeriesList series={series} title1="Latest" title2="Updated" />
                )}
                {!error && !isLoading && series && series.error === undefined && (
                    <div className="view-latest">
                        <Link to={'/latest/0'}>View all updated list</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
