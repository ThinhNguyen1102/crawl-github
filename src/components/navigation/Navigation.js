import React, { useContext, useState } from "react";
import CommitContext from "../../storage/commit-context";
import ReleaseContext from "../../storage/release-context";
import showToastMessage from "../../utils/toastMessage";
import classes from "./Navigation.module.css";

function Navigation() {
  const [releaseUrl, setReleaseUrl] = useState("");
  const releaseCtx = useContext(ReleaseContext);
  const commitCtx = useContext(CommitContext);

  const onClickGetButtonHandle = () => {
    let repoOwnerStr;
    if (releaseUrl.includes("/github.com/")) {
      repoOwnerStr = releaseUrl.split("/github.com/")[1];
    } else {
      showToastMessage("Please enter valid value!", "error");
      return;
    }
    const releaseApiUrl = `https://api.github.com/repos/${repoOwnerStr}/releases?per_page=100`;
    releaseCtx.setReleaseUrl(releaseApiUrl);
    releaseCtx.setRepoOwnerStr(repoOwnerStr);
    commitCtx.setRepoOwnerStr(repoOwnerStr);
  };

  const onChangeInputHandle = (event) => {
    setReleaseUrl(event.target.value.trim());
  };

  const onKeyDownEnterhandle = (event) => {
    if (event.key === "Enter") {
      onClickGetButtonHandle();
    }
  };

  return (
    <div className={classes["nav-container"]}>
      <div className={classes["nav-wrapper"]}>
        <i className="fa-brands fa-github logo"></i>
        <div className={classes["nav-url-input-box"]}>
          <input
            type="text"
            placeholder="Enter release url ..."
            value={releaseUrl}
            onChange={onChangeInputHandle}
            onKeyDown={onKeyDownEnterhandle}
          />
        </div>
        <button
          className={classes["nav-get-button"]}
          onClick={onClickGetButtonHandle}
        >
          GET
        </button>
      </div>
    </div>
  );
}

export default Navigation;
