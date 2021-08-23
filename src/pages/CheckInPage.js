import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Typography,
  Divider,
  CardContent,
  Box,
  Button,
} from "@material-ui/core";
import PropTypes from "prop-types";

const CheckInPage = (props) => {
  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <>
      <Helmet>
        <title>CheckIn | ClassroomLib</title>
      </Helmet>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Card>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">
              Please choose your name, followed by check in or check out...
            </Typography>
          </Box>
          <Divider />
          <CardContent>{`Check In Page`}</CardContent>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            <Button
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Check In
            </Button>
          </Box>
        </Card>
      </Container>
    </>
  );
};

CheckInPage.propTypes = {
  selectedRow: PropTypes.object.isRequired,
};

export default CheckInPage;
