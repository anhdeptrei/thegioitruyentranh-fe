export const BookmarkReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_BOOKMARK':
            return [
                ...state,
                {
                    id: action.series.id,
                    title: action.series.title,
                    cover_image: action.series.cover_image,
                    date: action.series.date_time,
                },
            ];
        case 'REMOVE_BOOKMARK':
            return state.filter((series) => series.id !== action.id);
        case 'REMOVE_ALL_BOOKMARKS':
            return []; // Return an empty array to clear all bookmarks
        default:
            return state;
    }
};
