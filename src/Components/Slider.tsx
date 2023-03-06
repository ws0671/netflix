import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useNavigate, useMatch, PathMatch } from "react-router-dom";
import { IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const SliderBox = styled.div`
  position: relative;

  &:hover .arrow {
    opacity: 1;
  }
`;

const SliderMain = styled.div`
  position: relative;
  height: 300px;
`;
const SliderTitle = styled.h1`
  /* position: relative;
  top: -105px; */
  font-size: 30px;
  font-weight: 600;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  font-size: 66px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)<{ scrolly: number }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: ${(props) => props.scrolly + 100}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 99;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigVote = styled.div`
  position: absolute;
  right: 10px;
  top: 400px;
  font-size: 20px;
  font-weight: 600;
`;
const ArrowButton = styled.div`
  position: absolute;
  font-size: 2rem;
  z-index: 99;
  top: 40%;
  transform: translateY(-50%);
  opacity: 0;
  background-color: black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background-color: #fff;
    color: black;
  }
`;
const LeftButton = styled(ArrowButton)`
  left: 0;
`;
const RightButton = styled(ArrowButton)`
  right: 0;
`;

const rowVariants = {
  hidden: (direction: number) => {
    return { x: direction === 1 ? window.outerWidth : -window.outerWidth };
  },
  visible: {
    x: 0,
    y: 0,
  },
  exit: (direction: number) => {
    return { x: direction === 1 ? -window.outerWidth : window.outerWidth };
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

interface ISlider {
  data: IGetMoviesResult;
  title: string;
  type: string;
  listType: string;
}

function Slider({ title, data, type, listType }: ISlider) {
  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch(
    `/${type}/${listType}/:movieId`
  );

  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(1); // left = -1, right: 1
  const increaseIndex = (direction: number) => {
    if (data) {
      if (leaving) return;
      toggleLeaving(true);
      setDirection(direction);
      const totalMovies = data?.results.length - 1; //banner로 사용되는 영화 포함 안함.
      const maxIndex = Math.ceil(totalMovies / offset) - 1; // index는 0부터 시작하므로

      direction === 1
        ? setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
        : setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = (value: boolean) => setLeaving(value);
  const onBoxClicked = (movieId: number) => {
    navigate(`/${type}/${listType}/${movieId}`);
  };
  const onOverlayClick = () => navigate(-1);

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  return (
    <>
      <SliderBox>
        <LeftButton className="arrow" onClick={() => increaseIndex(-1)}>
          <AiOutlineLeft />
        </LeftButton>
        <RightButton className="arrow" onClick={() => increaseIndex(1)}>
          <AiOutlineRight />
        </RightButton>
        <SliderTitle>{title}</SliderTitle>
        <SliderMain>
          <AnimatePresence
            initial={false}
            onExitComplete={() => toggleLeaving(false)}
            custom={direction}
          >
            <Row
              custom={direction}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {data?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    layoutId={movie.id + "" + listType}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    key={movie.id}
                    onClick={() => onBoxClicked(movie.id)}
                    bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title ?? movie.name}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </SliderMain>
      </SliderBox>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              layoutId={bigMovieMatch.params.movieId + "" + listType}
              scrolly={scrollY.get()}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top,black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title ?? clickedMovie.name}</BigTitle>
                  <BigVote>Rating: {clickedMovie.vote_average}</BigVote>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Slider;
