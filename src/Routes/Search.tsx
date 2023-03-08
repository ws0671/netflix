import { useLocation } from "react-router";
import { getSearchThings, IGetMoviesResult } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import Slider from "../Components/Slider";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
  padding-top: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
function Search() {
  // const [keyword, setKeyword] = useState();
  const location = useLocation();
  // setKeyword(new URLSearchParams(location.search).get("keyword"));
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["things", keyword],
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
