import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { api } from "../utils/api";

export default function Feed() {
  const [apiData, setapiData] = useState({ loading: true });
  useEffect(() => {
    async function fetchFeed() {
      let apiResponse = await api.get("/post");
      apiResponse.loading = false;
      setapiData(apiResponse);
    }
    fetchFeed();
  }, []);
  if (apiData.loading) {
    return <Loading />;
  }
  return <div>Feed</div>;
}
