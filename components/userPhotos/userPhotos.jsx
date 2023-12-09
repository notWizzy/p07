import React from "react";
import {
  Button,
  TextField,
  ImageList,
  ImageListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
  Typography,
} from "@mui/material";
import "./userPhotos.css";
import axios from "axios";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: undefined,
      photos: undefined,
      new_comment: undefined,
      add_comment: false,
      current_photo_id: undefined,
    };
    this.handleCancelAddComment = this.handleCancelAddComment.bind(this);
    this.handleSubmitAddComment = this.handleSubmitAddComment.bind(this);
  }

  componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
  }

  componentDidUpdate() {
    const new_user_id = this.props.match.params.userId;
    const current_user_id = this.state.user_id;
    if (current_user_id !== new_user_id) {
      this.handleUserChange(new_user_id);
    }
  }

  handleUserChange(user_id) {
    axios
      .get("/photosOfUser/" + user_id)
      .then((response) => {
        console.log("then");
        this.setState({
          user_id: user_id,
          photos: response.data,
        });
      })
      .catch((err) => {
        console.log("catch");
      });

    axios
      .get("/user/" + user_id)
      .then((response) => {
        const new_user = response.data;
        const main_content =
          "User Photos for " + new_user.first_name + " " + new_user.last_name;
        this.props.changeMainContent(main_content);
      })
      .catch((err) => {
        console.log("catch2");
      });
  }

  handleNewCommentChange = (event) => {
    this.setState({
      new_comment: event.target.value,
    });
  };

  handleShowAddComment = (event) => {
    const photo_id = event.target.attributes.photo_id.value;
    this.setState({
      add_comment: true,
      current_photo_id: photo_id,
    });
  };

  handleCancelAddComment = () => {
    this.setState({
      add_comment: false,
      new_comment: undefined,
      current_photo_id: undefined,
    });
  };

  handleSubmitAddComment = () => {
    const currentState = JSON.stringify({ comment: this.state.new_comment });
    const photo_id = this.state.current_photo_id;
    const user_id = this.state.user_id;
    axios
      .post("/commentsOfPhoto/" + photo_id, currentState, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.setState({
          add_comment: false,
          new_comment: undefined,
          current_photo_id: undefined,
        });
        axios.get("/photosOfUser/" + user_id).then((response) => {
          this.setState({
            photos: response.data,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return this.state.user_id ? (
      <div>
        <ImageList variant="masonry" cols={1} gap={8}>
          {this.state.photos ? (
            this.state.photos.map((item) => (
              <div key={item._id}>
                <TextField
                  label="Photo Date"
                  variant="outlined"
                  disabled
                  fullWidth
                  margin="normal"
                  value={item.date_time}
                />
                {/* Check if the user has permission to view the photo */}
                {this.canViewPhoto(item) && (
                  <img
                    src={"/images/" + item.file_name}
                    alt={item.file_name}
                    style={{ maxWidth: "100%" }}
                  />
                )}
                <div>
                  {item.comments ? (
                    item.comments.map((comment) => (
                      <div key={comment._id}>
                        {/* Existing code for comments */}
                      </div>
                    ))
                  ) : (
                    <div>
                      <Typography>No Comments</Typography>
                    </div>
                  )}
                  {this.canAddComment(item) && (
                    <Button
                      photo_id={item._id}
                      variant="contained"
                      onClick={this.handleShowAddComment}
                    >
                      Add Comment
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>
              <Typography>No Photos</Typography>
            </div>
          )}
        </ImageList>
      </div>
    ) : (
      <div />
    );
  }

  canViewPhoto(item) {
    const { user } = this.props;
    return (
      user._id === item.user_id ||
      (item.sharing_list && item.sharing_list.includes(user._id)) ||
      item.permissions === "public"
    );
  }
}

export default UserPhotos;
