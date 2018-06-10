import {
    SET_KIND,
    SET_TITLE,
    REQUEST,
    RECEIVE,
    SET_TOTAL_PAGES,
    SET_PAGE,
    SET_ID,
    SET_FIRST_LOAD,
    TOGGLE_LOADING,
    SET_ITEMS,
    TOGGLE_DRAWER_OPEN,
} from '../actions/index';

const initialState = {
    kind: 'index',
    drawerOpen: false,
    id: 0,
    page: 0,
    items: [],
    totalPages: 0,
    isLoading: true,
    title: 'fakeNGA',
    isFirstLoad: true,
};

function pageGenerator(state = initialState, action) {
    switch (action.type) {
        case SET_KIND:
            return { ...state, kind: action.kind };
        case TOGGLE_DRAWER_OPEN:
            return { ...state, drawerOpen: !state.drawerOpen };
        case SET_TITLE:
            return { ...state, title: action.title };
        case SET_ID:
            return { ...state, id: action.id };
        case SET_PAGE:
            return { ...state, page: action.page };
        case SET_ITEMS:
            return { ...state, items: action.items };
        case REQUEST:
            return {
                ...state,
                isLoading: true,
                id: action.id,
                page: action.page,
                kind: action.kind,
                isFirstLoad: action.kind !== state.kind
            };
        case RECEIVE:
            return {
                ...state,
                isLoading: false,
                items: action.items,
                title: action.title,
                totalPages: action.totalPages,
                isFirstLoad: false,
            };
        case SET_TOTAL_PAGES:
            return { ...state, totalPages: action.totalPages };
        case TOGGLE_LOADING:
            return { ...state, isLoading: !state.isLoading };
        case SET_FIRST_LOAD:
            return { ...state, isFirstLoad: action.isFirstLoad };
        default:
            return state;
    }
}

export default pageGenerator;