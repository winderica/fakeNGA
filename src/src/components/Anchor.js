import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import styles from '../styles/index';

class Anchor extends React.Component {
    render() {
        const children = this.props.children;
        const href = this.props.href;
        const classes = this.props.classes;
        return <a className={classes.anchor} href={href}>[{children}]</a>;
    }
}

export default withStyles(styles, { withTheme: true })(Anchor);