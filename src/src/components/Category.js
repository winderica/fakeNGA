import React from 'react';
import { Redirect } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import { withStyles } from "@material-ui/core/styles/index";

import styles from '../styles/index';


class Category extends React.Component {
    handleRoute(i) {
        this.setState({ redirect: true, toForum: i })
    }

    render() {
        const { classes, children } = this.props;
        const card = forum => (
            !forum['info'] || forum['info'].search('个人版面') < 0 ?
                <Card classes={{ root: classes.smallCard }}>
                    <CardHeader
                        avatar={
                            <Avatar src={`http://img4.ngacn.cc/ngabbs/nga_classic/f/${forum['icon']}.png`}/>
                        }
                        title={forum['name'] || forum['fid']}
                        subheader={forum['info'] || forum['fid']}
                        onClick={() => this.handleRoute(forum['fid'])}
                        classes={{
                            title: classes.forumCardTitle,
                            subheader: classes.forumCardInfo,
                            root: classes.forumCard,
                        }}
                    />
                </Card> : null
        );
        return (
            <React.Fragment>
                {this.state && this.state.redirect ? <Redirect push to={`/forum/${this.state.toForum}/1`}/> : null}
                <Paper classes={{ root: classes.category }}>
                    {children['forums'].map(i => i.map(j => card(j)))}
                </Paper>
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Category);