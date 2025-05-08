export const BookmarkReducer = (state, action) => {
    switch(action.type) {
        case 'ADD_BOOKMARK':
            return [...state, {
                id: action.series.id,
                name: action.series.name,
                thumb_url: action.series.thumb_url,
                slug: action.series.slug,
                date: action.series.date_time
            }];
        case 'REMOVE_BOOKMARK':
            return state.filter(series => series.id !== action.id);
        default:
            return state;
    }
}