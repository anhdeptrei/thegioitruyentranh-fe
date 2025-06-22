import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChapterList = ({ chapters, id }) => {
    console.log('chapters', chapters);
    return (
        <div className="chapter-list">
            <h4>Danh sách chương</h4>
            <div className="chapter-wrapper">
                {chapters.length > 0 &&
                    chapters.map((chapter, index) => (
                        <Link
                            to={{
                                pathname: `/chapter/${chapter.chapterId}/${id}`,
                            }}
                            key={index}
                        >
                            <div className="chapter">
                                <span className="ch-title">
                                    Chapter {chapter.chapterNumber} {chapter.title && `: ${chapter.title}`}
                                </span>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default ChapterList;
