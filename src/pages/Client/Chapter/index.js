import { useParams } from 'react-router-dom';
import ChapterViewer from '~/components/ChapterViewer';
import SkeletonChapter from '~/components/skeleton/skeletonChapter';
import useFetch from '~/useFetch';
import { Helmet } from 'react-helmet';

const Chapter = () => {
    const { chapterid, id } = useParams();
    // const { chapters } = useContext(ChapterContext); // Lấy danh sách chapters từ Context

    const { data: chapter, error, isLoading } = useFetch('http://localhost:8080/chapters/' + chapterid);

    const { data: story, errorstory, isLoadingstory } = useFetch('http://localhost:8080/stories/ ' + id);

    console.log('chapter', chapter);
    console.log('chapters list', story); // Kiểm tra danh sách chapters

    return (
        <div className="chapter-view">
            {!error && !isLoading && chapter && chapter.data && (
                <Helmet>
                    <title>{chapter.data.item.comic_name} - ReadComic</title>
                    <meta name="description" content={`Read ` + chapter.data.item.comic_name + ` on ReadComic`} />
                </Helmet>
            )}
            {error && (
                <div className="container">
                    <div className="text-message">{error}</div>
                </div>
            )}
            {isLoading && <SkeletonChapter />}
            {!error && !isLoading && chapter && !errorstory && !isLoadingstory && story && (
                <ChapterViewer chapter={chapter} chapters={story}></ChapterViewer>
            )}
        </div>
    );
};

export default Chapter;
