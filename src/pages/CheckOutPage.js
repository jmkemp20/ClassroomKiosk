import { Helmet } from "react-helmet";
import {
  Container,
  Card,
  Typography,
  Divider,
  CardContent,
  Box,
  Button,
} from "@material-ui/core";

const CheckOutPage = () => (
  <>
    <Helmet>
      <title>CheckOut | ClassroomLib</title>
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
        <CardContent>Check Out Page</CardContent>
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
            Check Out
          </Button>
        </Box>
      </Card>
    </Container>
  </>
);

export default CheckOutPage;
