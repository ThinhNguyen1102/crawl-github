import React from "react";
import TooltipPositioned from "../utils/tooltip";
import classes from "./CommitItem.module.css";

function CommitItem(props) {
  let message = props.message;
  if (message.length > 70) {
    message = message.slice(0, 70) + "...";
  }

  return (
    <div className={classes["commit-container"]}>
      <div className={classes["commit-message"]}>
        {props.message.length > 70 && (
          <TooltipPositioned placement={props.message}>
            <a
              href={props.commitUrl}
              target="__blank"
              className={classes["commit-url"]}
            >
              {message}
            </a>
          </TooltipPositioned>
        )}
        {props.message.length <= 70 && (
          <a
            href={props.commitUrl}
            target="__blank"
            className={classes["commit-url"]}
          >
            {message}
          </a>
        )}
      </div>
      <div className={classes["commit-info"]}>
        <i className="fa-solid fa-circle-user"></i>
        <div className={classes["commit-author"]}>{props.committer}</div>
        <div className={classes["commit-date"]}>
          {new Date(props.commitedDate).toDateString()}
        </div>
      </div>
    </div>
  );
}

export default CommitItem;
