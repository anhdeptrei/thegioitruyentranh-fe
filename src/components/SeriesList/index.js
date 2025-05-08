import { Link } from 'react-router-dom';
import NotFoundSeries from '../Notfound/notFoundSeries';

const SeriesList = ({ series, title1, title2 }) => {
    console.log('Dữ liệu của series:', series.content);
    const listseries = series.content;
    return (
        <div className="serieslist">
            {listseries.length !== 0 && (
                <h2>
                    <span>{title1}</span> {title2}
                </h2>
            )}
            {!listseries.length && <NotFoundSeries />}
            {!series.error && listseries.length !== 0 && (
                <div className="series-list">
                    {listseries.map((seri) => (
                        <div className="series-item" key={seri.story_id}>
                            <div className="series-content">
                                <div className="thumb">
                                    <a href={'http://localhost:3000/series/' + seri.story_id} rel="noopener noreferrer">
                                        <img src={seri.cover_image} alt={seri.slug} />
                                    </a>
                                </div>
                                <div className="series-preview">
                                    <a href={'http://localhost:3000/series/' + seri.story_id} rel="noopener noreferrer">
                                        <h3 className="title">{seri.title}</h3>
                                    </a>
                                    <ul>
                                        {Array.isArray(seri.chapters) && seri.chapters.length > 0 && (
                                            // seri.chapter.map((chapter, index) => (
                                            //     <li key={index}>
                                            //         {/* <Link to={chapter.c_slug}>Chapter {chapter.chapter_name}</Link> */}
                                            //         Chapter {chapter.chapter_name}
                                            //         {/* {chapter.c_date && <span className="date">{chapter.c_date}</span>}{chapter.status && <span className="date">{chapter.status}</span>}{!chapter.c_date && !chapter.status && <span className="date-new">New</span>}*/}
                                            //     </li>
                                            // ))}
                                            <li>
                                                {/* <Link to={chapter.c_slug}>Chapter {chapter.chapter_name}</Link> */}
                                                Chapter{' ' + seri.highestChapterNumber}
                                                {/* {chapter.c_date && <span className="date">{chapter.c_date}</span>}{chapter.status && <span className="date">{chapter.status}</span>}{!chapter.c_date && !chapter.status && <span className="date-new">New</span>}*/}
                                            </li>
                                        )}
                                        {seri.chapters.length === 0 && <li>Truyện đang được cập nhật</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SeriesList;
