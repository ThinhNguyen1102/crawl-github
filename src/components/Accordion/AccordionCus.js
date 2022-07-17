import React, { useContext } from "react";
import { Accordion } from "react-bootstrap";
import CommitContext from "../../storage/commit-context";
import ReleaseContext from "../../storage/release-context";
import AccordionBodyCus from "./AccordionBodyCus";
import "./AccordionCus.css";

function AccordionCus() {
  const releaseCtx = useContext(ReleaseContext);
  const commitCtx = useContext(CommitContext);

  const onClickAccordionHandle = (event) => {
    if (
      event.target.className === "" ||
      event.target.className === "fa-solid fa-arrow-up-right-from-square" ||
      event.target.className === "accor-header-right"
    ) {
      return;
    }
    const release = releaseCtx.releases.find((val) => {
      return val.tagName === event.target.firstChild.firstChild.innerText;
    });

    if (release.prevReleaseTagName) {
      const commitsUrl = `https://api.github.com/repos/${releaseCtx.repoOwnerStr}/compare/${release.prevReleaseTagName}...${release.tagName}?per_page=100`;
      commitCtx.setCommitUrl(commitsUrl);
    } else {
      const firstReleaseCommitUrl = `https://api.github.com/repos/${releaseCtx.repoOwnerStr}/commits/${release.tagName}`;
      commitCtx.fetchCommitsFirstRelease(firstReleaseCommitUrl);
    }
  };
  return (
    <div className="accordion-fixed-nav">
      {!releaseCtx.isLoading && (
        <Accordion flush>
          {releaseCtx.releases.map((item) => {
            return (
              <Accordion.Item eventKey={item.id} key={item.id}>
                <Accordion.Header onClick={onClickAccordionHandle}>
                  <div className="accor-header-wrapper">
                    <div className="accor-header-left">
                      <h6>{item.tagName}</h6>
                    </div>
                    <div className="accor-header-right">
                      <a href={item.author.url} target="__blank">
                        <p>{item.author.name}</p>
                      </a>
                      <div>{new Date(item.createdAt).toDateString()}</div>
                      <a href={item.htmlUrl} target="__blank">
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </a>
                    </div>
                  </div>
                </Accordion.Header>
                <AccordionBodyCus
                  tagNameRelease={item.tagName}
                  changelog={item.changelog}
                />
              </Accordion.Item>
            );
          })}
        </Accordion>
      )}
      {releaseCtx.isLoading && (
        <div className="accor-release-loading">
          <h3>Loading...</h3>
        </div>
      )}
    </div>
  );
}

export default AccordionCus;
