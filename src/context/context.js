import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [githubRepos, setGithubRepos] = useState(mockRepos);
  const [githubFollowers, setGithubFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) => {
      console.log(error);
    });
    console.log(response);

    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      //repos
      axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) => {
        setGithubRepos(response.data);
      });

      //followers
      axios(`${followers_url}?per_page=100`).then((response) => {
        setGithubFollowers(response.data);
      });

      //more logic here

      //repos
      //https://api.github.com/users/john-smilga/repos?per_page=100

      //followers
      //https://api.github.com/users/john-smilga/followers
    } else {
      toggleError(true, "there is no user with that username");
    }

    checkRequests();

    setLoading(false);
  };

  // const checkRequest = () => {
  //   axios(`${rootUrl}/rate_limit`)
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const checkRequests = async () => {
    const response = await fetch(`${rootUrl}/rate_limit`);
    const data = await response.json();

    let {
      rate: { remaining },
    } = data;

    setRequests(remaining);

    if (remaining === 0) {
      toggleError(true, "sorry,you have exceeded your hourly rate limit!");
    }
  };

  const toggleError = (show = false, msg = "") => {
    setError({ show: show, msg: msg });
  };

  useEffect(() => {
    checkRequests();
  }, []);

  return (
    <AppContext.Provider
      value={{
        githubUser,
        githubRepos,
        githubFollowers,
        requests,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
