import React from 'react';

import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Category from "./Category";

class ScrollableTabsButtonAuto extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    render() {
        const { children } = this.props;
        const { value } = this.state;

        return (
            <React.Fragment>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        scrollable
                        scrollButtons="on"
                    >
                        {children.map(i => (<Tab key={i['name']} label={i['name']}/>))}
                    </Tabs>
                </AppBar>
                {children.map((i, j) => (value === j && <Category>{i}</Category>))}
            </React.Fragment>
        );
    }
}

export default ScrollableTabsButtonAuto;
