import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import pageGenerator from './reducers/index';

import Main from './views/Main';
import Topic from './views/Topic';
import Forum from './views/Forum';
import Index from './views/Index';

const history = createHistory();

const middleware = [ routerMiddleware(history), thunk ];

const store = createStore(
    combineReducers({
        routerReducer,
        content: pageGenerator
    }),
    applyMiddleware(...middleware)
);

store.subscribe(() => {
    console.log('State now:');
    console.log(store.getState());
});

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Main>
                        <Route path='/' exact component={Index}/>
                        <Route path='/topic/:id/:page' component={Topic}/>
                        <Route path='/forum/:id/:page' component={Forum}/>
                    </Main>
                </ConnectedRouter>
            </Provider>
        )
    }
}

export default App;
