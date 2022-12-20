import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHiking} from "@fortawesome/free-solid-svg-icons";

import {useLoader} from "../hooks/loader";

import styles from "../../styles/Header.module.css";

const ResponsiveAppBar = ({navBtnRef}) => {
  const {loader} = useLoader();

  const Loader = ({loader}) => {
    return loader ? (
      <LinearProgress className={styles.loader} />
    ) : (
      <div className={styles.loaderPlaceholder}></div>
    );
  };

  return (
    <AppBar position="static">
      <Loader loader={loader} />
      <Container
        style={{
          padding: 0,
          minWidth: "100vw",
          maxWidth: "100vw",
          position: "static",
        }}
      >
        <AppBar sx={{pl: 2, pr: 2, position: "static"}}>
          <Toolbar disableGutters>
            <Box sx={{flexGrow: 1}}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  gap: 2,
                  lineHeight: 1,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon icon={faHiking} />
                SMARTMOVE
              </Typography>
            </Box>
            <Box ref={navBtnRef}></Box>
          </Toolbar>
        </AppBar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
