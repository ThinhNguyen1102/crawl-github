import React from "react";
import classes from "./Changelog.module.css";
import showdown from "showdown";
const HtmlToReactParser = require("html-to-react").Parser;

function Changelog(props) {
  const converter = new showdown.Converter();
  const changelog = props.data;
  const changelogHtml = converter.makeHtml(changelog);

  const htmlToReactParser = new HtmlToReactParser();
  const reactElement = htmlToReactParser.parse(changelogHtml);

  return (
    <div className={classes["changelog-container"]}>
      <div className={classes["changelog-content"]}>{reactElement}</div>
    </div>
  );
}

export default Changelog;
