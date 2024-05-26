import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Header2 from "../Components/Header2";
import Post from "../Components/Post";
import { PROFILE_IMAGE } from "../contants/images/links";
import data from "../data";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../contants/credentials/Api";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

function ProfileScreen() {
  const [fileInputState, setFileInputState] = useState("");
  const [fileCoverState, setFileCoverState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [userDetails, setUserDetails] = useState("");
  const [caption, setCaption] = useState("");
  const [about, setAbout] = useState("");
  const [post, setPost] = useState([]);
  const [sameProfile, setSameProfile] = useState(false);
  const [sameUser, setSameUser] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [isFollowing, setFollowing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [user, setUser] = useState("");

  const [followersArr, setFollowersArr] = useState([]);
  const [followingArr, setFollowingArr] = useState([]);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
      if (userDetails?._id == id) {
        setSameUser(true);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/details/${id}`);
      const userDetails = JSON.parse(localStorage.getItem("user"));
      if (res && res.data.status == 200) {
        let followingArray = res.data.data.followers;
        const exists = followingArray.some(
          (obj) => obj._id === userDetails?._id
        );
        if (exists) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
        setUserDetails(res.data.data);
        let followData = res.data.data.followers;
        let followingData = res.data.data.following;
        for (let i = 0; i < followData.length; i++) {
          const obj1 = followData[i];

          const obj2 = followingData.find((obj) => obj._id === obj1._id);

          if (obj2) {
            obj1.following = true;
          }
        }
        setFollowersArr(followData);

        for (let i = 0; i < followingData.length; i++) {
          const obj1 = followingData[i];

          const obj2 = followData.find((obj) => obj._id === obj1._id);

          if (obj2) {
            obj2.following = true;
          }
        }
        setFollowingArr(followingData);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const data = setInterval(() => {
      axios
        .get(`${BACKEND_URL}/api/v1/user/my-post/${id}`)
        .then((res) => {
          setPost(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);
    return () => clearInterval(data);
  }, [post]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/my-post/${id}`);
      if (res && res.data.status == 200) {
        setPost(res.data.data);
      }
    };
    fetchData();
  }, []);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileCoverState(e.target.value);
  };

  const handleSubmitCover = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      uploadCoverImage(reader.result);
    };
    reader.onerror = () => {
      console.log("Error");
    };
  };

  const uploadCoverImage = async (base64EncodedImage) => {
    let dataToSend = {
      userId: user._id,
      data: base64EncodedImage,
      imageType: "feed",
      caption,
      about,
    };
    try {
      setLoading(true);
      await fetch(`${BACKEND_URL}/api/v1/user/upload-cover`, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        setLoading(false);
        Swal.fire({
          title: "Success!",
          text: "Post added successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/profile/${user._id}`);
          window.location.reload();
        });
        // }
      });
      setFileInputState("");
      setPreviewSource("");
    } catch (error) {
      setError(true);
      console.error(error);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
    reader.onerror = () => {
      console.log("Error");
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    let dataToSend = {
      userId: user._id,
      data: base64EncodedImage,
      imageType: "feed",
      caption,
      about,
    };
    try {
      setLoading(true);
      await fetch(`${BACKEND_URL}/api/v1/user/add-post`, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        setLoading(false);
        Swal.fire({
          title: "Success!",
          text: "Post added successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/profile/${user._id}`);
          // window.location.reload();
        });
        // }
      });
      setFileInputState("");
      setPreviewSource("");
    } catch (error) {
      setError(true);
      console.error(error);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const sendFollow = async () => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    let res = await axios
      .post(`${BACKEND_URL}/api/v1/user/follow`, {
        fromId: userDetails?._id,
        toId: id,
      })
      .then((res) => {
        if (res && res.status == 200) {
          toast.success("You are following", {
            className: "green-toast",
          });
          window.location.reload();
        }
      });
  };

  const unFollow = async (targetId) => {
    let res = await axios.post(`${BACKEND_URL}/api/v1/user/unfollow`, {
      userId: id,
      targetId,
    });
    if (res && res.status == 200) {
      toast.success("Unfollowed", {
        className: "red-toast",
      });
      window.location.reload();
    }
  };

  const gotoEdit = () => {
    navigate(`/editProfile/${id}`);
  };

  return (
    <div>
      <header>
        <Header2 />
      </header>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div className="">
                <div className="profileHeader">
                  <div className="cover">
                    <img src={userDetails?.coverImage} className="w-100" />
                    <CameraAltIcon
                      style={{
                        left: "5px",
                        position: "relative",
                        color: "white",
                      }}
                      data-toggle="modal"
                      data-target="#exampleModalCenter4"
                    />
                    {sameUser && (
                      <>
                        <EditIcon
                          style={{ color: "white" }}
                          onClick={() => navigate(`/editProfile/${id}`)}
                          className="edit-icon mt-4"
                        />
                        {/* <a href="/ji">dsddsds</a> */}
                      </>
                    )}
                  </div>
                  <div className="profileImage ">
                    <img src={userDetails?.profileImage} className="profile" />
                  </div>

                  <div className="profile-details text-center">
                    <h4 className="text-white">{userDetails?.username}</h4>
                    <p className="text-white">{userDetails?.bio}</p>
                  </div>
                  {sameUser ? (
                    <>
                      <button
                        type="button"
                        class="plusbtn"
                        data-toggle="modal"
                        data-target="#exampleModalCenter3"
                      >
                        +
                      </button>
                    </>
                  ) : isFollowing ? (
                    <>
                      <button className="followingBtn">
                        <CheckCircleIcon /> Following
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="followBtn"
                        onClick={() => sendFollow()}
                        style={{
                          float: "right",
                          top: "-47px",
                          left: "-20px",
                          position: "relative",
                        }}
                      >
                        follow+
                      </button>
                      <ToastContainer />
                    </>
                  )}
                  <hr />
                  <div className="followSection" style={{ marginLeft: "6px" }}>
                    <ul className="nav justify-content-center">
                      <li className="nav-item">
                        <a className="nav-link active text-white" href="#">
                          {post?.length} Post
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link text-white"
                          data-toggle="modal"
                          data-target="#followerModalCenter"
                        >
                          {userDetails?.followers?.length} Followers
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link text-white"
                          data-toggle="modal"
                          data-target="#followingModalCenter"
                        >
                          {userDetails?.following?.length} Following
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="modal fade"
                    id="followerModalCenter"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="exampleModalLongTitle"
                          >
                            Followers
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          {followersArr.length > 0 ? (
                            followersArr.map((c) => (
                              <a href={`/profile/${c?._id}`}>
                                <div className="row p-1">
                                  <img
                                    src={c?.profileImage}
                                    className="thumb-sm m-2"
                                  />
                                  <p
                                    className="m-2"
                                    style={{
                                      fontWeight: "bold",
                                      color: "black",
                                    }}
                                  >
                                    {c?.username}
                                  </p>
                                  {c?.following == false && (
                                    <a
                                      onClick={() => sendFollow()}
                                      className="mt-2"
                                      style={{ color: "blue", float: "right" }}
                                    >
                                      Follow+
                                    </a>
                                  )}
                                </div>
                              </a>
                            ))
                          ) : (
                            <>
                              <p>No Followers yet</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="modal fade"
                    id="followingModalCenter"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="exampleModalLongTitle"
                          >
                            Following
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          {followingArr.length > 0 ? (
                            followingArr.map((c) => (
                              <div className="row p-1">
                                <a href={`/profile/${c?._id}`}>
                                  <img
                                    src={c?.profileImage}
                                    className="thumb-sm m-2"
                                  />
                                </a>
                                <p
                                  className="m-2"
                                  style={{ fontWeight: "bold" }}
                                >
                                  {c?.username}
                                </p>
                                {c?.following == false && (
                                  <a
                                    onClick={() => unFollow(c?._id)}
                                    className="mt-2"
                                    style={{ color: "blue", float: "right" }}
                                  >
                                    {/* Unfollow */}
                                  </a>
                                )}
                              </div>
                            ))
                          ) : (
                            <>
                              <p>No Following yet</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="modal fade"
                    id="exampleModalCenter3"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                  >
                    <div
                      class="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLongTitle">
                            Add Post
                          </h5>
                          <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <form onSubmit={handleSubmitFile}>
                            <div className="form-group">
                              <label htmlFor="formGroupExampleInput">
                                Caption
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                placeholder="Caption"
                                onChange={(e) => setCaption(e.target.value)}
                              />
                            </div>

                            <input
                              id="fileInput"
                              type="file"
                              name="image"
                              onChange={handleFileInputChange}
                              value={fileInputState}
                              className="form-input"
                            />
                            <button
                              className="btn authenticationBtn mt-2"
                              type="submit"
                            >
                              {loading ? (
                                <>
                                  <CircularProgress
                                    disableShrink
                                    style={{ fontSize: "15px" }}
                                  />
                                </>
                              ) : (
                                <span className="btn btn-success">Submit</span>
                              )}
                            </button>
                          </form>
                          {previewSource && (
                            <img
                              src={previewSource}
                              alt="chosen"
                              style={{ height: "300px" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="modal fade"
                    id="exampleModalCenter4"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                  >
                    <div
                      class="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLongTitle">
                            Add Cover Image
                          </h5>
                          <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <form onSubmit={handleSubmitCover}>
                            <input
                              id="fileInput"
                              type="file"
                              name="image"
                              onChange={handleCoverImageChange}
                              value={fileCoverState}
                              className="form-input"
                            />
                            <button
                              className="btn authenticationBtn mt-2"
                              type="submit"
                            >
                              {loading ? (
                                <>
                                  <CircularProgress
                                    disableShrink
                                    style={{ fontSize: "15px" }}
                                  />
                                </>
                              ) : (
                                <span className="btn btn-success">Submit</span>
                              )}
                            </button>
                          </form>
                          {previewSource && (
                            <img
                              src={previewSource}
                              alt="chosen"
                              style={{ height: "300px" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4"></div>
          </div>
        </div>
        <Post
          style={{ top: "40px", position: "relative" }}
          post={post}
          sameUser={sameUser}
        />
      </main>
    </div>
  );
}

export default ProfileScreen;
