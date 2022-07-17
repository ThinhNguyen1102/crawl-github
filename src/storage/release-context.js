import axios from "axios";
import React, { useState, useCallback, useEffect } from "react";
import showToastMessage from "../utils/toastMessage";

const ReleaseContext = React.createContext({
  releases: [],
  releaseUrl: "",
  errorFetch: null,
  isLoading: false,
  repoOwnerStr: "",
  setReleaseUrl: () => {},
  setRepoOwnerStr: () => {},
});

export const ReleaseContextProvider = (props) => {
  const [releases, setReleases] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [errorFetch, setErrorFetch] = useState(null);
  const [releaseUrl, setReleaseUrl] = useState("");
  const [repoOwnerStr, setRepoOwnerStr] = useState("");

  const fetchReleasesHandle = useCallback(async () => {
    setIsloading(true);
    setErrorFetch(null);

    if (releaseUrl) {
      try {
        const result = await axios.get(releaseUrl);

        const releasesFetch = result.data.map((val, index) => {
          const release = {
            url: val.url,
            htmlUrl: val.html_url,
            author: {
              name: val.author.login,
              url: val.author.html_url,
            },
            tagName: val.tag_name,
            name: val.name,
            createdAt: val.created_at,
            publishedAt: val.published_at,
            changelog: val.body,
            id: val.id,
          };
          if (index < result.data.length - 1) {
            return {
              ...release,
              prevReleaseTagName: result.data[index + 1].tag_name,
            };
          } else {
            return { ...release, prevReleaseTagName: null };
          }
        });

        setReleases(releasesFetch);
      } catch (err) {
        setErrorFetch(err.message);
        setReleases([]);
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
  }, [releaseUrl]);

  useEffect(() => {
    fetchReleasesHandle();
  }, [fetchReleasesHandle]);

  return (
    <ReleaseContext.Provider
      value={{
        releases: releases,
        releaseUrl: releaseUrl,
        setReleaseUrl: setReleaseUrl,
        errorFetch: errorFetch,
        isLoading: isLoading,
        repoOwnerStr: repoOwnerStr,
        setRepoOwnerStr: setRepoOwnerStr,
      }}
    >
      {props.children}
    </ReleaseContext.Provider>
  );
};

export default ReleaseContext;
