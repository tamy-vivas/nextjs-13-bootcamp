import axios from "axios";
import { useState } from "react";

interface Params {
  slug: string;
  partySize: string;
  day: string;
  time: string;
}

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<
    { time: string; available: boolean }[] | null
  >(null);

  const fetchAvailabilities = async ({
    slug,
    partySize,
    day,
    time,
  }: Params) => {
    setLoading(true);

    console.log(slug, partySize, day, time);
    try {
      const url = `http://localhost:3000/api/restaurant/${slug}/availability`;
      const response = await axios.get(url, {
        params: { day, time, partySize },
      });

      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return {
    loading,
    error,
    data,
    fetchAvailabilities,
  };
}
