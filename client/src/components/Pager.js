import React from 'react';
import { Redirect } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { withStyles } from "@material-ui/core/styles/index";

import styles from '../styles/index';

class Pager extends React.Component {
    handleRoute(i) {
        this.setState({redirect: true, toPage: i})
    }

    render() {
        const { page, total, kind, id } = this.props;
        return (
            <React.Fragment>
                {this.state && this.state.redirect ? <Redirect push to={`/${kind}/${id}/${this.state.toPage}`}/> : null}
                {total ?
                    <Button disabled={page === 1} onClick={() => this.handleRoute(1)}>
                        首页
                    </Button> : null
                }
                <Button disabled={page === 1} onClick={() => this.handleRoute(page - 1)}>
                    上一页
                </Button>
                <Chip label={'第' + page + '页' + (total ? ('　共' + total + '页') : '')}/>
                <Button disabled={page === total} onClick={() => this.handleRoute(page + 1)}>
                    下一页
                </Button>
                {total ?
                    <Button disabled={page === total} onClick={() => this.handleRoute(total)}>
                        末页
                    </Button> : null
                }
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Pager);