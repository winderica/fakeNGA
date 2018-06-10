import React from "react";

import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles/index";

import styles from '../styles/index';

class EnlargeableImage extends React.Component {
    constructor(props) {
        super();
        this.state = {
            open: false,
            src: props.src.replace(/\.medium\.[a-z]+$/, ''),
        };
    }

    handleImageClick = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        const classes = this.props.classes;

        return (
            <div className={classes.imageBox}>
                <img src={this.props.src} onClick={this.handleImageClick} className={classes.image}/>
                <Dialog open={this.state.open} onClose={this.handleClose} maxWidth={false}
                        classes={{paper: classes.imageLayer}}>
                    <img src={this.state.src} onClick={this.handleClose} className={classes.image}/>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(EnlargeableImage);