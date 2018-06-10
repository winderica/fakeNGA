import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { withStyles } from "@material-ui/core/styles/index";

import styles from '../styles/index';

class ResponsiveDrawer extends React.Component {
    render() {
        const { classes, theme, onClose, open } = this.props;
        const { row, avatarBig, toolbar, drawerPaper } = classes;
        const drawer = (
            <React.Fragment>
                <List className={row}>
                    <Avatar src='http://via.placeholder.com/150x150' className={avatarBig}/>
                </List>
                <Divider/>
                <Toolbar className={toolbar}/>
                <List className={row}>
                    <Typography variant="title">
                        用户名
                    </Typography>
                </List>
            </React.Fragment>
        );
        return (
            <Hidden>
                <Drawer variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        onClose={onClose}
                        open={open}
                        classes={{ paper: drawerPaper }}
                        ModalProps={{ keepMounted: true }}>
                    {drawer}
                </Drawer>
            </Hidden>
        )
    }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);