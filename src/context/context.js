import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [githubRepos, setGithubREpos] = useState(mockRepos);
  const [githubFollowers, setGithubFollowers] = useState(mockFollowers);

  //request, loading
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);

  // const checkRequest = () => {
  //   axios(`${rootUrl}/rate_limit`)
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const getData = async () => {
    const response = await fetch(`${rootUrl}/rate_limit`);
    const data = await response.json();

    let {
      rate: { remaining },
    } = data;
    setRequests(remaining);

    if (remaining === 0) {
      //throw an error
    }
  };

  useEffect(() => {
    // checkRequest();
    getData();
  }, []);

  return (
    <AppContext.Provider
      value={{ githubUser, githubRepos, githubFollowers, requests }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
