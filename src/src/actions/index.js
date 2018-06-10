export const TOGGLE_DRAWER_OPEN = 'TOGGLE_DRAWER_OPEN';
export const SET_KIND = 'SET_KIND';
export const SET_ID = 'SET_ID';
export const SET_PAGE = 'SET_PAGE';
export const SET_TOTAL_PAGES = 'SET_TOTAL_PAGES';
export const SET_ITEMS = 'SET_ITEMS';
export const REQUEST = 'REQUEST';
export const RECEIVE = 'RECEIVE';
export const SET_TITLE = 'SET_TITLE';
export const TOGGLE_LOADING = 'TOGGLE_LOADING';
export const SET_FIRST_LOAD = 'SET_FIRST_LOAD';
const URL = 'http://localhost:5000';

export const toggleDrawerOpen = () => ({
    type: TOGGLE_DRAWER_OPEN,
});

export const request = req => ({
    type: REQUEST,
    id: req.id,
    page: req.page,
    kind: req.kind,
});

export const receive = res => ({
    type: RECEIVE,
    items: res.items,
    title: res.title,
    totalPages: res.totalPages,
});

/*
export const setKind = kind => ({
    type: SET_KIND,
    kind
});

export const setId = id => ({
    type: SET_ID,
    id
});


export const setPage = page => ({
    type: SET_PAGE,
    page
});

export const setTotalPages = totalPages => ({
    type: SET_TOTAL_PAGES,
    totalPages
});

export const setItems = items => ({
    type: SET_ITEMS,
    items
});

export const setTitle = title => ({
    type: SET_TITLE,
    title
});

export const toggleLoading = () => ({
    type: TOGGLE_LOADING,
});

export const setFirstLoad = (isFirstLoad) => ({
    type: SET_FIRST_LOAD,
    isFirstLoad
});
*/

const responseHandlers = {
    'topic': res => {
        let userInfo = {};
        for (const i of res['users']['item']) {
            if (/\/\*\$js\$\*\//.test(i['avatar'])) {
                const t = JSON.parse(i['avatar'].replace(/\/\*\$js\$\*\//, ''));
                i['avatar'] = t['' + Math.floor(t.l * Math.random())];
            }
            userInfo[i['uid']] = {
                username: i['username'],
                avatar: i['avatar']
            };
        }
        for (const i of res['replies']['item']) {
            i['username'] = userInfo[i['authorid']]['username'];
            i['avatar'] = userInfo[i['authorid']]['avatar'];
        }
        return {
            items: res['replies']['item'],
            totalPages: Math.ceil((+res['topic']['replies'] + 1) / 20),
            title: res['topic']['subject'],
        };
    },
    'forum': res => ({
        items: Object.values(res['topics']),
        title: res['name'],
    }),
    'index': res => ({
        items: res,
        title: 'fakeNGA'
    })
};

const doFetch = path => dispatch => {
    dispatch(request({
        kind: path.kind,
        id: path.id,
        page: path.page,
    }));
    return fetch(`${URL}/${path.kind}/${(path.id ? (path.id + '/') : '') + (path.page ? (path.page + '/') : '')}`)
        .then(res => res.json())
        .then(json => {
            dispatch(receive({
                ...responseHandlers[path.kind](json),
            }));
        });
};

const shouldFetch = (state, prev) => {
    return state.id !== prev.id || state.page !== prev.page || state.kind !== prev.kind || state.isLoading;
};

export const fetchIfNeeded = path => (dispatch, getState) => {
    const s = getState().content;
    if (shouldFetch(s, path)) {
        return dispatch(doFetch({ page: path.page, id: path.id, kind: path.kind }));
    }
};