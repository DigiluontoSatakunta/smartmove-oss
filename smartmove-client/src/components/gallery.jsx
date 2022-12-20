/* eslint-disable @next/next/no-img-element */
import Box from "@mui/material/Box";

import {Splide, SplideSlide} from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

export default function Gallery({images}) {
  return (
    <Box>
      <Splide
        options={{
          gap: 0,
          rewind: true,
          arrows: true,
          width: "100%",
          heightRatio: 1,
          autoWidth: true,
          focus: "center",
          lazyLoad: "nearby",
          classes: {
            pagination: "splide__pagination splide-dots",
            page: "splide__pagination__page splide-single-dot",
          },
        }}
      >
        {images?.map((image, i) => (
          <SplideSlide key={i}>
            <Box sx={{overflow: "hidden", aspectRatio: "1/1"}}>
              <img
                alt="Kuvagallerian kuva, joka on ladattu Instagramista"
                src={image.src}
                width={image.config_width}
                height={image.config_height}
              />
            </Box>
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  );
}
