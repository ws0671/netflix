import { useLocation } from "react-router";
import { getSearchThings, IGetMoviesResult } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
  margin-top: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["things", "nowPlaying"],
    () => getSearchThings(keyword)
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider
          title="Searched Things"
          data={data as IGetMoviesResult}
          type="search"
          listType="things"
        />
      )}
    </Wrapper>
  );
}

export default Search;
