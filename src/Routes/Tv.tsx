import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  getLatestTv,
  getAiringTodayTv,
  getPopularTv,
  getTopRatedTv,
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

function Tv() {
  const { data: latestData } = useQuery("lastestTv", getLatestTv);
  const { data: airingTodayData } = useQuery<IGetMoviesResult>(
    "airingTodayTv",
    getAiringTodayTv
  );

  const { data: popularData, isLoading } = useQuery<IGetMoviesResult>(
    "popularTv",
    getPopularTv
  );
  const { data: topRatedData } = useQuery<IGetMoviesResult>(
    "topRatedTv",
    getTopRatedTv
  );
  console.log(latestData);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              topRatedData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{topRatedData?.results[0].name}</Title>
            <Overview>{topRatedData?.results[0].overview}</Overview>
          </Banner>
          <Latest>
            <RowTitle>Latest Movies</RowTitle>
            <div>{latestData?.name}</div>
          </Latest>
          <Slider
            title="Airing Today TV"
            data={airingTodayData as IGetMoviesResult}
            type="tv"
          />
          <Slider
            title="Popular TV"
            data={popularData as IGetMoviesResult}
            type="tv"
          />
          <Slider
            title="Top Rated TV"
            data={topRatedData as IGetMoviesResult}
            type="tv"
          />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
