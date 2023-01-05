import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { githubRepos } = useGlobalContext();

  //reduce method ,pass caalback func and the 2nd thing is what we`re trying to return from the reduce,in this case I want to return an object

  //with reduce we have 2 parameters-(1 total-what we`re returning(the object in this case) , 2 is the exact itteration, and we can name them however we want)

  //when working with reduce we must make sure that we`re returning the total

  let languages = githubRepos.reduce((total, item) => {
    const { language } = item;

    if (!language) {
      return total;
    }

    if (!total[language]) {
      total[language] = { label: language, value: 1 };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
      };
    }

    return total;
  }, {});

  //transfrom the object into an array of objects
  languages = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 10);

  const chartData = [
    {
      label: "HTML",
      value: "13",
    },
    {
      label: "CSS",
      value: "23",
    },
    {
      label: "Javascript",
      value: "80",
    },
  ];

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={languages} />
        <div></div>
        <Doughnut2D data={chartData} />
        {/* <ExampleChart data={chartData} />; */}
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
