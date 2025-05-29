export const HistoryReducer = (state, action) => {
    switch (action.type) {
        // case 'ADD_HISTORY':
        //     return [
        //         ...state,
        //         {
        //             id: action.chapter.id,
        //             title: action.chapter.ch_title,
        //             manga_title: action.chapter.chapters_name,
        //             id_chapters: action.chapter.id_chapters,
        //             date: action.chapter.date_time,
        //         },
        //     ];
        // case 'ADD_HISTORY':
        //     // Check if the chapter already exists in the history
        //     const existingChapter = state.find((chapter) => chapter.id === action.chapter.id);
        //     if (existingChapter) {
        //         // If it exists, update the date to the latest one
        //         return state.map((chapter) =>
        //             chapter.id === action.chapter.id ? { ...chapter, date: action.chapter.date_time } : chapter,
        //         );
        //     }
        //     // If it doesn't exist, add it to the history
        //     return [
        //         ...state,
        //         {
        //             id: action.chapter.id,
        //             title: action.chapter.ch_title,
        //             manga_title: action.chapter.chapters_name,
        //             id_chapters: action.chapter.id_chapters,
        //             date: action.chapter.date_time,
        //         },
        //     ];

        case 'ADD_HISTORY':
            // Action payload should include:
            // action.chapter.storyId (id_chapters)
            // action.chapter.chapterId (id)
            // action.chapter.storyTitle (chapters_name)
            // action.chapter.chapterTitle (ch_title)
            // action.chapter.date (date_time)

            const { storyId, chapterId, storyTitle, chapterTitle, date } = action.chapter;

            // Find if an entry for this story already exists
            const existingEntryIndex = state.findIndex((item) => item.storyId === storyId);

            if (existingEntryIndex > -1) {
                // If entry exists, update it
                const newState = [...state];
                newState[existingEntryIndex] = {
                    ...newState[existingEntryIndex], // Keep existing fields
                    lastReadChapterId: chapterId, // Update last read chapter ID
                    lastReadChapterTitle: chapterTitle, // Update last read chapter title
                    readDate: date, // Update read date
                    // You might want to update storyTitle here too if it can change
                    storyTitle: storyTitle, // Update story title
                };
                // Optional: Move the updated entry to the beginning of the list (most recent)
                const [updatedEntry] = newState.splice(existingEntryIndex, 1);
                return [updatedEntry, ...newState];
            } else {
                // If entry does not exist, add a new one for this story
                return [
                    {
                        storyId: storyId,
                        lastReadChapterId: chapterId,
                        storyTitle: storyTitle,
                        lastReadChapterTitle: chapterTitle,
                        readDate: date,
                        // Add other relevant fields from the chapter object if needed for display
                        // e.g., storyCoverImage: action.chapter.cover_image
                    },
                    ...state, // Add new entry to the beginning
                ];
            }
        case 'REMOVE_HISTORY':
            return state.filter((chapter) => chapter.id !== action.id);
        case 'REMOVE_ALL_HISTORIES':
            return []; // Return an empty array to clear all local history
        default:
            return state;
    }
};
