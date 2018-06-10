import { connect } from 'react-redux';

import Pager from '../components/Pager';

const mapStateToProps = state => {
    state = state.content;
    return {
        page: state.page,
        kind: state.kind,
        id: state.id,
        total: state.totalPages
    }
};

const PagerContainer = connect(mapStateToProps)(Pager);

export default PagerContainer;