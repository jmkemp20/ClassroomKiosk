import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Modal,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Typography
} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import EditIcon from "@material-ui/icons/Edit";
import Logo from "./Logo";
import linkUserId from "../utils/linkUserId";

const DashboardNavbar = (rest) => {
  const [openInfo, setOpenInfo] = useState(false);
  
  const handleCloseModal = () => {
    setOpenInfo(false);
  };

  const handleOpenModal = () => {
    setOpenInfo(true);
  };

  return (
    <>
      <AppBar elevation={0} {...rest}>
        <Toolbar>
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Info">
            <IconButton color="inherit" onClick={handleOpenModal}>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Modal
        open={openInfo}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableAutoFocus={true}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Card>
            <CardHeader
              avatar={<Logo />}
              action={
                <IconButton aria-label="settings" disabled={true}>
                  <EditIcon />
                </IconButton>
              }
              title="ClassroomLibKiosk"
              subheader={`ClassroomLib - Joshua Kemp © ${new Date().getFullYear()}`}
            />
            <Divider />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Typography variant="h5">
                  {`ClassroomLibDashboard Link: ${linkUserId}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Typography color="secondary">
                  Make sure this matches with your dashboard
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  );
      };

export default DashboardNavbar;
