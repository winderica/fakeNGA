import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

import { withStyles } from "@material-ui/core/styles/index";

import styles from '../styles/index';

class Bar extends React.Component {
    render() {
        const { classes, onClick, title } = this.props;
        const unescape = (s) => {
            return s.replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&#39;/g, "'")
                .replace(/&quot;/g, '"');
        };
        return (
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={onClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="title" color="inherit" noWrap>
                        {unescape(title)}
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Bar);