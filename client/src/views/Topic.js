import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import { fetchIfNeeded } from '../actions/index';

import Pager from '../containers/Pager';
import Reply from '../components/ReplyCard';

import styles from '../styles/index';

const mapStateToProps = state => state;

/**
 * Topic component, rendered when access '/topic'
 */
class Topic extends React.Component {
    componentDidMount() {
        const { id, page } = this.props.match.params;
        this.props.dispatch(fetchIfNeeded({ kind: 'topic', page: +page, id: +id }))
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { id, page } = nextProps.match.params;
        /**
         * Should dispatch?
         */
        if ((+page !== this.props.content.page || +id !== this.props.content.id) && !nextProps.content.isLoading) {
            this.props.dispatch(fetchIfNeeded({ kind: 'topic', page: +page, id: +id }))
        }
    }

    render() {
        const { isFirstLoad, items, kind } = this.props.content;
        return (
            (kind === 'topic' && !isFirstLoad) ?
                <React.Fragment>
                    <Pager/>
                    /**
                     * the element of `items` is the data of `Reply` now
                     */
                    {items.map(i =>
                        <Reply
                            content={i['content']}
                            postdate={i['postdate']}
                            floor={i['lou']}
                            username={i['username']}
                            avatar={i['avatar']}
                            key={i['content']}
                        />
                    )}
                    <Pager/>
                </React.Fragment> : null
        )
    }
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Topic));