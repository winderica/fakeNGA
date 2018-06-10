import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Link from './Link';
import Paginator from './Paginator';

import styles from '../styles/index';

class TopicCard extends React.Component {
    render() {
        const { classes, time, title, author, replies, last, pages, tid } = this.props;

        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="subheading" color="textSecondary">
                        {time}
                    </Typography>
                    <Typography variant="headline" className={classes.title}>
                        <Link to={`/topic/${tid}/1`}>{title}</Link>
                    </Typography>
                    <Typography variant="body2">
                        {author}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {replies}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {last}
                    </Typography>
                    <Paginator total={pages} tid={tid}/>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles, { withTheme: true })(TopicCard);

