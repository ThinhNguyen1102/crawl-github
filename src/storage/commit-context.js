import axios from "axios";
import React, { useState, useCallback, useEffect } from "react";
import showToastMessage from "../utils/toastMessage";

const CommitContext = React.createContext({
  commits: "",
  commitsUrl: "",
  isLoading: false,
  errorFetch: null,
  repoOwnerStr: "",
  repoCommits: [],
  setRepoOwnerStr: () => {},
  setCommitUrl: () => {},
  fetchCommitsFirstRelease: () => {},
});

export const CommitContextProvider = (props) => {
  const [commits, setCommits] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [errorFetch, setErrorFetch] = useState(null);
  const [commitsUrl, setCommitUrl] = useState("");
  const [repoOwnerStr, setRepoOwnerStr] = useState("");
  const [repoCommits, setRepoCommits] = useState([]);

  const fetchCommitsFirstRelease = async (commitUrl) => {
    let commitIndex;
    let commits = [];
    try {
      const { data } = await axios.get(commitUrl);
      if (data.sha) {
        commitIndex = repoCommits.findIndex((val) => {
          return val.sha === data.sha;
        });

        commits = repoCommits.slice(commitIndex, repoCommits.length - 1);

        setCommits(commits);
      }
    } catch (err) {
      if (err.response) {
        showToastMessage(err.response.data.message, "error");
      } else {
        showToastMessage(err.message, "error");
      }
      throw err;
    }
  };

  useEffect(() => {
    if (repoOwnerStr) {
      const repoUrl = `https://api.github.com/repos/${repoOwnerStr}/commits?per_page=100`;

      const fetchAllCommitsRepo = async (repoUrl) => {
        let commits = [];
        for (let x = 1; ; x++) {
          const result = await axios.get(repoUrl + `&page=${x}`);

          if (result.data.length === 0) {
            return commits;
          }

          const data = result.data.map((val) => {
            return {
              sha: val.sha,
              url: val.url,
              htmlUrl: val.html_url,
              committer: val.commit.committer.name,
              commitedDate: val.commit.committer.date,
              message: val.commit.message,
            };
          });

          commits = [...commits, ...data];
        }
      };

      setIsloading(true);

      fetchAllCommitsRepo(repoUrl)
        .then((result) => {
          setIsloading(false);
          setRepoCommits(result);
        })
        .catch((err) => {
          setIsloading(false);
          if (err.response) {
            showToastMessage(err.response.data.message, "error");
          } else {
            showToastMessage(err.message, "error");
          }
          throw err;
        });
    }
  }, [repoOwnerStr]);

  const fetchCommitsHandle = useCallback(async () => {
    setIsloading(true);
    setErrorFetch(null);

    if (commitsUrl) {
      try {
        const result = await axios.get(commitsUrl);

        const commitsRaw = result.data.commits;

        const commitsFetch = commitsRaw.map((val) => {
          return {
            sha: val.sha,
            url: val.url,
            htmlUrl: val.html_url,
            committer: val.commit.committer.name,
            commitedDate: val.commit.committer.date,
            message: val.commit.message,
          };
        });

        setCommits(commitsFetch);
      } catch (err) {
        setErrorFetch(err.message);
        setCommits([]);
        setIsloading(false);
        if (err.response) {
          showToastMessage(err.response.data.message, "error");
        } else {
          showToastMessage(err.message, "error");
        }
        throw err;
      }
    }

    setIsloading(false);
  }, [commitsUrl]);

  useEffect(() => {
    fetchCommitsHandle();
  }, [fetchCommitsHandle]);

  return (
    <CommitContext.Provider
      value={{
        commits: commits,
        commitsUrl: commitsUrl,
        isLoading: isLoading,
        errorFetch: errorFetch,
        repoOwnerStr: repoOwnerStr,
        repoCommits: repoCommits,
        setRepoOwnerStr: setRepoOwnerStr,
        setCommitUrl: setCommitUrl,
        fetchCommitsFirstRelease: fetchCommitsFirstRelease,
      }}
    >
      {props.children}
    </CommitContext.Provider>
  );
};

export default CommitContext;
