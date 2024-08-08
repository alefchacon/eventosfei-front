import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import { ListItemButton } from "@mui/material";
import { useIsLoading } from "../providers/LoadingProvider";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../providers/AuthProvider";

export default function Topbar({
  noticeAmount = 0,

  onLogOutClick,
  onMenuIconClick,
}) {
  const { user } = useAuth();
  const { isLoading } = useIsLoading();
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNavigateToProfile = () => {
    handleMenuClose();
    navigate("/usuario");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id="primary-search-account-menu"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem divider onClick={handleNavigateToProfile}>
        Perfil
      </MenuItem>
      <MenuItem
        id={"log-out"}
        onClick={() => {
          handleMenuClose();
          onLogOutClick();
        }}
      >
        Cerrar sesión
      </MenuItem>
    </Menu>
  );

  return (
    <Stack direction={"column"} width={"100%"} padding={0}>
      <AppBar
        position="relative"
        variant="outlined"
        elevation={0}
        sx={{
          width: "100%",
          bgcolor: "white",
          display: "flex",
          flexDirection: "row",
          color: "black",
          flex: "0 0 40px",
        }}
      >
        <Toolbar sx={{ width: "100%" }}>
          <Stack
            direction={"row"}
            display={"flex"}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={onMenuIconClick}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>

              <Typography variant="h6" noWrap component="div">
                hey man
              </Typography>
            </Stack>

            {user !== null && (
              <Stack direction={"row"} alignItems={"center"}>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={() => navigate("/avisos")}
                >
                  <Badge badgeContent={noticeAmount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <ListItemButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                  <Stack spacing={-0.7} alignItems={"start"}>
                    <Typography variant="caption">{user.names}</Typography>
                    <Typography variant="caption" color={"text.secondary"}>
                      {user.email}
                    </Typography>
                  </Stack>
                </ListItemButton>
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      {isLoading ? (
        <LinearProgress sx={{ height: "5px" }}></LinearProgress>
      ) : (
        <Stack sx={{ height: "5px", bgcolor: "white", width: "100%" }}>f</Stack>
      )}

      {renderMenu}
    </Stack>
  );
}
