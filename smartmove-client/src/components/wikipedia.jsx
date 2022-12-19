import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import {useWikipediaPageParsedContent} from "../hooks/wikipedia";

export default function WikipediaPageParsedContent({pageid}) {
  const {text, loading, error} = useWikipediaPageParsedContent(pageid);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div>error...</div>;

  return (
    <Box>
      <div dangerouslySetInnerHTML={{__html: text}} />
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
