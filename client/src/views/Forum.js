import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import { fetchIfNeeded } from '../actions/index';

import Pager from '../containers/Pager';
import Topic from '../components/TopicCard';

import styles from '../styles/index';

import unescape from '../lib/unescape';

import moment from "moment";

const mapStateToProps = state => state;

/**
 * Forum component, rendered when access '/forum'
 */
class Forum extends React.Component {
    componentDidMount() {
        const { id, page } = this.props.match.params;
        this.props.dispatch(fetchIfNeeded({ kind: 'forum', page: +page, id: +id }))
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { id, page } = nextProps.match.params;
        /**
         * Should dispatch?
         */
        if ((+page !== this.props.content.page || +id !== this.props.content.id) && !nextProps.content.isLoading) {
            this.props.dispatch(fetchIfNeeded({ kind: 'forum', page: +page, id: +id }))
        }
    }

    render() {
        const { isFirstLoad, items, kind } = this.props.content;

        return (
            (kind === 'forum' && !isFirstLoad) ?
                <React.Fragment>
                    <Pager/>
                    /**
                     * the element of `items` is the data of `Topic`
                     */
                    {items.map(i =>
                        <Topic
                            time={moment(i['postdate'] * 1000).fromNow()}
                            title={unescape(i['subject'])}
                            author={i['author']}
                            replies={i['replies'] + ' 回复'}
                            last={moment(i['lastpost'] * 1000).fromNow()}
                            pages={Math.ceil((1 + i['replies']) / 20)}
                            tid={i['tid']}
                        />
                    )}
                    <Pager/>
                </React.Fragment> : null
        )
    }
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Forum));