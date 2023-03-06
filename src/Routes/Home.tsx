import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  getMovies,
  getLatestMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
} from "../api";
import Slider from "../Components/Slider";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center top;
`;

const Title = styled.h2`
  font-size: 4vw;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 1.2vw;
  width: 50%;
`;
const Latest = styled.div`
  margin-bottom: 50px;
`;
const RowTitle = styled.h1`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 20px;
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: latestData } = useQuery("lastestMovies", getLatestMovies);
  const { data: topRatedData } = useQuery<IGetMoviesResult>(
    "topRatedMovies",
    getTopRatedMovies
  );
  const { data: upcomingData } = useQuery<IGetMoviesResult>(
    "upcomingMovies",
    getUpcomingMovies
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider
            title="Now Playing"
            data={data as IGetMoviesResult}
            type="movies"
            listType="nowPlay"
          />
          <Latest>
            <RowTitle>Latest Movies</RowTitle>
            <div>{latestData?.title}</div>
          </Latest>
          <Slider
            title="Top Lated Movies"
            data={topRatedData as IGetMoviesResult}
            type="movies"
            listType="topLated"
          />
          <Slider
            title="Upcoming Movies"
            data={upcomingData as IGetMoviesResult}
            type="movies"
            listType="upcoming"
          />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
