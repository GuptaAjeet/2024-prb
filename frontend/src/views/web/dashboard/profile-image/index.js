import React, { useEffect, useRef, useState } from "react";
import { API, Helper, Hook } from "../../../../apps";
import { useDispatch } from "react-redux";
import Features from "../../../../redux/features";
import ProfileImage from "../../../../public/web/images/user-profile.jpg";

const Index = () => {
  const dispatch = useDispatch();
  const profileImage = useRef();
  const [image, setImage] = useState(ProfileImage);
  const user = Helper.auth.user;
  const profile = Hook.usePost({
    url: "api/users/fetch-user-profile-picture",
    data: null,
  });

  useEffect(() => {
    if (profile !== null && profile.status) {
      setImage(profile.file);
    }
  }, [profile]);

  const fileUploadHanddler = () => {
    profileImage.current.click();
  };

  const fileHandler = () => {
    const file = profileImage.current.files[0];
    const size = Math.floor(file.size / 1000);
    if (size > 100) {
      dispatch(
        Features.showToast({
          message: "Maximum allowed file size 100KB",
          flag: "danger",
        })
      );
      return false;
    } else {
      setImage(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("id", user.id);
      formData.append("profile", file);
      dispatch(Features.showLoader({ show: "show", display: "block" }));
      API.file("api/users/update-user-profile-picture", formData, (result) => {
        dispatch(Features.hideLoader({ show: "", display: "none" }));
        if (result.status) {
          dispatch(
            Features.showToast({ message: result.message, flag: "success" })
          );
        } else {
          dispatch(
            Features.showToast({ message: result.message, flag: "danger" })
          );
        }
      });
    }
  };

  return (
    <div className="edit-upload">
      <img className="" src={image} alt="" style={{ width: "100%" }} />
      <i className="fa-solid fa-pen" onClick={fileUploadHanddler}></i>
      <input
        ref={profileImage}
        type="file"
        accept=".png,.jpg,.jpeg"
        className="file d-none"
        id="file"
        name="file"
        onChange={fileHandler}
      />
    </div>
  );
};

export default Index;
