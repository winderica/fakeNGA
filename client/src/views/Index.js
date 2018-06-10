import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles/index';

import { fetchIfNeeded } from '../actions/index';

import Tab from '../components/Tab';

import styles from '../styles/index';

const mapStateToProps = state => state;

class Index extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchIfNeeded({ kind: 'index' }));
    }

    render() {
        const { content } = this.props;
        const { items, kind, isLoading } = content;

        return (
            (kind === 'index' && !isLoading) ? <Tab>
                {items.filter(i => i['forums'].length)}
            </Tab> : null
        )
    }
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Index));