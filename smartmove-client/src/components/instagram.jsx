import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import {useIgImagesByHashTag} from "../hooks/instagram";
import Gallery from "./gallery";

export default function InstagramImages({location, hashtag}) {
  const {feed, loading, error} = useIgImagesByHashTag(hashtag);
  const replaceIgCdnRegex = /http(.*\/v\/)/;

  if (loading) return <LoadingSkeleton />;
  if (error) return <div>error...</div>;

  const images = feed?.map(item => item?.node?.thumbnail_resources?.at(2));
  const proxifiedImages = images?.map(image => ({
    ...image,
    src: image.src.replace(
      replaceIgCdnRegex,
      process.env.NEXT_PUBLIC_IG_PROXY_URL
    ),
  }));

  return (
    <Box>
      <Gallery images={proxifiedImages} />
    </Box>
  );
}

const LoadingSkeleton = () => (
  <Box
    sx={{
      width: "100%",
      height: 260,
      minHeight: 260,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);
