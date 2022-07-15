import React, { useContext } from "react";
import { Accordion } from "react-bootstrap";
import "./AccordionBodyCus.css";
import Changelog from "../Changelog";
import CommitItem from "../CommitItem";
import CommitContext from "../../storage/commit-context";

function AccordionBodyCus(props) {
  const commitCtx = useContext(CommitContext);
  return (
    <Accordion.Body>
      <div className="accor-body-container">
        <div className="accor-body-left">
          {!commitCtx.isLoading &&
            commitCtx.commits.map((val) => {
              return (
                <CommitItem
                  key={val.sha}
                  message={val.message}
                  commitedDate={val.commitedDate}
                  committer={val.committer}
                  commitUrl={val.htmlUrl}
                />
              );
            })}
          {commitCtx.isLoading && (
            <div className="accor-commit-loading">
              <h3>Loading...</h3>
            </div>
          )}
        </div>
        <div className="accor-body-right">
          <Changelog data={props.changelog} />
        </div>
      </div>
    </Accordion.Body>
  );
}

export default AccordionBodyCus;
