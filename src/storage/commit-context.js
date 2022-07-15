import axios from "axios";
import React, { useState, useCallback, useEffect } from "react";
import showToastMessage from "../utils/toastMessage";

const CommitContext = React.createContext({
  commits: "",
  commitsUrl: "",
  isLoading: false,
  errorFetch: null,
  setCommitUrl: () => {},
  // fetchCommitsFirstReleaseHandle: (firstReleaseCommitUrl, repoOwnerStr) => {},
});

export const CommitContextProvider = (props) => {
  const [commits, setCommits] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [errorFetch, setErrorFetch] = useState(null);
  const [commitsUrl, setCommitUrl] = useState("");
  // const [firstReleaseCommits, setFirstReleaseCommits] = useState([]);

  // const fetchCommitsFirstReleaseHandle = async (
  //   firstReleaseCommitUrl,
  //   repoOwnerStr
  // ) => {
  //   setIsloading(true);
  //   try {
  //     const result = await axios.get(firstReleaseCommitUrl, {
  //       per_page: 50,
  //     });
  //     console.log(firstReleaseCommitUrl);
  //     console.log(result.data.length);
  //   } catch (err) {
  //     setCommits([]);
  //     setIsloading(false);
  //     if (err.response) {
  //       showToastMessage(err.response.data.message, "error");
  //     } else {
  //       showToastMessage(err.message, "error");
  //     }
  //     throw err;
  //   }
  // };

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
        setCommitUrl: setCommitUrl,
        // fetchCommitsFirstReleaseHandle: fetchCommitsFirstReleaseHandle,
      }}
    >
      {props.children}
    </CommitContext.Provider>
  );
};

export default CommitContext;
