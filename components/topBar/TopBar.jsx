import React from 'react';
import {
    AppBar, Toolbar, Typography
} from '@mui/material';
import './TopBar.css';
import axios from 'axios';

/**
 * Define TopBar, a React component of project #5
 */
class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app_info: undefined
        };
    }

    componentDidMount() {
        this.handleAppInfoChange();
    }

    handleAppInfoChange(){
        const app_info = this.state.app_info;
        if (app_info === undefined){
            axios.get("/test/info")
                .then((response) =>
                {
                    this.setState({
                        app_info: response.data
                    });
                });
        }
    }

    render() {
        return this.state.app_info ? (
            <AppBar className="topbar-appBar" position="absolute">
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>Ka$hApp</Typography>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} color="inherit">{this.props.main_content}</Typography>
                    <Typography variant="h5" component="div" color="inherit">Version: {this.state.app_info.version}</Typography>
                </Toolbar>
            </AppBar>
        ) : (
            <div/>
        );
    }
}

export default TopBar;
