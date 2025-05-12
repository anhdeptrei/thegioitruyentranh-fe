export const HistoryReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_HISTORY':
            return [
                ...state,
                {
                    id: action.chapter.id,
                    title: action.chapter.ch_title,
                    manga_title: action.chapter.chapters_name,
                    id_chapters: action.chapter.id_chapters,
                    date: action.chapter.date_time,
                },
            ];
        case 'REMOVE_HISTORY':
            return state.filter((chapter) => chapter.id !== action.id);
        default:
            return state;
    }
};
