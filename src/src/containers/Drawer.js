import { connect } from 'react-redux';

import { toggleDrawerOpen } from '../actions/index';

import Drawer from '../components/Drawer';

const mapStateToProps = state => {
    return {
        open: state.content.drawerOpen
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => {
            dispatch(toggleDrawerOpen());
        }
    }
};

const DrawerContainer = connect(mapStateToProps, mapDispatchToProps)(Drawer);

export default DrawerContainer;