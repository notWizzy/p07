import React from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import './userList.css';
import axios from 'axios';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: undefined,
            user_id: undefined,
            activities: undefined // Add a state property for activities
        };
    }

    componentDidMount() {
        this.handleUserListChange();
        this.fetchActivities(); // Fetch activities when the component mounts
        this.activitiesInterval = setInterval(() => this.fetchActivities(), 3000);
    }

    componentDidUpdate() {
        const new_user_id = this.props.match?.params.userId;
        const current_user_id = this.state.user_id;
        if (current_user_id !== new_user_id) {
            this.handleUserChange(new_user_id);
        }
    }

    handleUserChange(user_id) {
        this.setState({
            user_id: user_id
        });
    }

    handleUserListChange() {
        axios.get("/user/list")
            .then((response) => {
                this.setState({
                    users: response.data
                });
            });
    }

    fetchActivities() {
        axios.get("/recent-activities")
            .then(response => {
                this.setState({ activities: response.data });
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
            });
    }

    render() {
        return (
            <div>
                {this.state.users && (
                    <List component="nav">
                        {this.state.users.map(user => (
                            <ListItemButton
                                selected={this.state.user_id === user._id}
                                key={user._id}
                                divider={true}
                                component="a"
                                href={"#/users/" + user._id}>
                                <ListItemText primary={user.first_name + " " + user.last_name} />
                            </ListItemButton>
                        ))}
                    </List>
                )}

                {this.state.activities && (
                    <div>
                        <h3>Recent Activities</h3>
                        <List component="nav">
                            {this.state.activities.map(activity => (
                                <ListItem key={activity._id}>
                                    <ListItemText
                                        primary={`${activity.type} by ${activity.user_id ? `${activity.user_id.first_name} ${activity.user_id.last_name}` : 'Unknown User'}`}
                                        secondary={new Date(activity.date_time).toLocaleString()}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                )}
            </div>
        );
    }

}

export default UserList;
