import { connect } from 'react-redux';

import { toggleDrawerOpen } from '../actions/index';

import AppBar from '../components/AppBar';

const mapStateToProps = state => {
    return {
        title: state.content.title
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: () => {
            dispatch(toggleDrawerOpen());
        }
    }
};

const AppBarContainer = connect(mapStateToProps, mapDispatchToProps)(AppBar);

export default AppBarContainer;