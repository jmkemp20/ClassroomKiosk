import { Link as RouterLink } from "react-router-dom";
import { AppBar, Box, IconButton, Toolbar, Tooltip } from "@material-ui/core";
import InputIcon from "@material-ui/icons/Input";
import Logo from "./Logo";

const DashboardNavbar = (rest) => (
  <AppBar elevation={0} {...rest}>
    <Toolbar>
      <RouterLink to="/">
        <Logo />
      </RouterLink>
      <Box sx={{ flexGrow: 1 }} />
      <Tooltip title="Logout">
        <IconButton color="inherit">
          <InputIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  </AppBar>
);

export default DashboardNavbar;
