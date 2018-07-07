import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '../containers/AppBar';
import Drawer from '../containers/Drawer';
import ProgressBar from '../components/ProgressBar';

import styles from '../styles/index';

const mapStateToProps = state => state;

/**
 * Main frame
 */
class Main extends React.Component {
    render() {
        const { classes, children, content } = this.props;
        const { isLoading } = content;
        return (
            <div className={classes.root}>
                {isLoading ? <ProgressBar/> : null}
                <AppBar/>
                <Drawer/>
                <main className={classes.content}>
                    <div className={classes.spaceTaker}/>
                    {children}
                </main>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Main)));
