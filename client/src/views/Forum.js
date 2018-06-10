import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import { fetchIfNeeded } from '../actions/index';

import Pager from '../containers/Pager';
import Topic from '../components/TopicCard';

import styles from '../styles/index';

const mapStateToProps = state => state;

class Forum extends React.Component {
    componentDidMount() {
        const { id, page } = this.props.match.params;
        this.props.dispatch(fetchIfNeeded({ kind: 'forum', page: +page, id: +id }))
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { id, page } = nextProps.match.params;
        if ((+page !== this.props.content.page || +id !== this.props.content.id) && !nextProps.content.isLoading) {
            this.props.dispatch(fetchIfNeeded({ kind: 'forum', page: +page, id: +id }))
        }
    }

    render() {
        const { isFirstLoad, items, kind } = this.props.content;
        const unescape = s => {
            return s.replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&#39;/g, "'")
                .replace(/&quot;/g, '"');
        };
        return (
            (kind === 'forum' && !isFirstLoad) ?
                <React.Fragment>
                    <Pager/>
                    {items.map(i =>
                        <Topic
                            time={(new Date(i['postdate'] * 1000)).toLocaleString()}
                            title={unescape(i['subject'])}
                            author={i['author']}
                            replies={i['replies'] + ' 回复'}
                            last={(new Date(i['lastpost'] * 1000)).toLocaleString()}
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