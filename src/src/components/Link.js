import React from 'react';
import { NavLink } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import styles from '../styles/index';

class Link extends React.Component {
    render() {
        const { children, to, classes } = this.props;
        return (
            <NavLink to={to} className={classes.anchor}>{children}</NavLink>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Link);