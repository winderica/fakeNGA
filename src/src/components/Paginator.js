import React from 'react';
import { Redirect } from "react-router-dom";

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import styles from '../styles/index';

class Paginator extends React.Component {
    handleRoute(i) {
        this.setState({ redirect: true, toPage: i })
    }

    render() {
        const { total, tid, classes } = this.props;
        return (
            <React.Fragment>
                {this.state && this.state.redirect ? <Redirect push to={`/topic/${tid}/${this.state.toPage}`}/> : null}
                {(total > 16 ? [...Array(15).keys(), '...', total - 1] : [...Array(total).keys()]).map(i =>
                    <Button size='small'
                            key={i}
                            disabled={typeof i !== "number"}
                            classes={{
                                sizeSmall: classes.miniButton
                            }}
                            onClick={() => this.handleRoute(i + 1)}
                    >
                        {typeof i === "number" ? (i + 1) : i}
                    </Button>
                )}
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Paginator);