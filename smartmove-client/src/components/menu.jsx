import {useState} from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Portal from "@mui/material/Portal";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

const MenuInPortal = ({setActiveSite, navBtnRef}) => {
  const [_, setAnchorElNav] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const handleFavoriteListClick = () => {
    setActiveSite({id: "favorites", __typename: "FavoritesList"});
    setAnchorElMenu(null);
  };

  const handleOpenMenu = event => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  return (
    <Portal container={navBtnRef.current}>
      <Box sx={{flexGrow: 0}}>
        <Tooltip title="Avaa valikko">
          <IconButton onClick={handleOpenMenu} sx={{p: 0}}>
            <MenuIcon sx={{color: "#fff"}} />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{mt: "45px"}}
          id="menu-appbar"
          anchorEl={anchorElMenu}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElMenu)}
          onClose={handleCloseMenu}
        >
          <MenuItem key="favorites" onClick={handleFavoriteListClick}>
            <Typography textAlign="center">Suositut kohteet</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Portal>
  );
};

export default MenuInPortal;
