import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

import styles from '../styles/index';

class ProgressBar extends React.Component {
    render() {
        return <LinearProgress className={this.props.classes.progress} color='secondary'/>;
    }
}

export default withStyles(styles, { withTheme: true })(ProgressBar);