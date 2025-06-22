import { useParams } from 'react-router-dom';
import SeriesDetail from '~/components/SeriesDetail';
import useFetch from '~/useFetch';
import SkeletonSeries from '~/components/skeleton/skeletonSeries';
import { Helmet } from 'react-helmet';

const Series = () => {
    const { id } = useParams();
    const { data: series, error, isLoading } = useFetch('http://localhost:8080/stories/' + id);
    console.log('Dữ liệu của series:', series);
    return (
        <div className="series">
            {!error && !isLoading && series && series.error === undefined && (
                <Helmet>
                    <title>{series.title} - thế giới truyện tranh</title>
                    <meta name="description" content={`Đọc ` + series.title + ` trên thế giới truyện tranh`} />
                    <meta property="og:title" content={series.title} />
                    <meta
                        property="og:description"
                        content={series.description?.replace(/<[^>]+>/g, '').slice(0, 150) || series.title}
                    />
                    <meta property="og:image" content={series.cover_image} />
                    <meta property="og:url" content={window.location.href} />
                </Helmet>
            )}
            {error && (
                <div className="container">
                    <div className="text-message">{error}</div>
                </div>
            )}
            {isLoading && <SkeletonSeries />}
            {!error && !isLoading && series && <SeriesDetail series={series}></SeriesDetail>}
        </div>
    );
};

export default Series;
