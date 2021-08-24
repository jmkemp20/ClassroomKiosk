import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@material-ui/data-grid";
import {
  Card,
  Box,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Snackbar,
} from "@material-ui/core";
import bookColumnNames from "../utils/bookColumnNames";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const CheckInPage = () => {
  const navigate = useNavigate();
  const [studentBooks, setStudentBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [open, setOpen] = useState(false);
  const confirmationISBN = useRef("");
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const selectedStudent = JSON.parse(
      sessionStorage.getItem("selectedStudent")
    );
    fetch("/studentsBooks", {
      method: "POST",
      body: JSON.stringify({
        parentId: selectedStudent.parent_id,
        studentId: selectedStudent._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const studentBookList = [];
        for (let i = 0; i < data.length; i++) {
          const tempDate = new Date(parseInt(data[i].checkout_time) * 1000);
          const calDate = `${tempDate.getMonth()}/${tempDate.getDay()}/${tempDate.getFullYear()}`;
          const tempTime = `${
            tempDate.getHours() > 12
              ? `${tempDate.getHours() - 12}:${tempDate.getMinutes()} PM`
              : `${tempDate.getHours()}:${tempDate.getMinutes()} AM`
          }`;
          const temp = {
            id: i,
            ...data[i].book,
            checkout_time: `${tempTime} - ${calDate}`,
          };
          studentBookList.push(temp);
        }
        const sortedStudentBookList = studentBookList.sort((a, b) =>
          a.title < b.title ? -1 : 1
        );
        setStudentBooks(sortedStudentBookList);
        setIsLoading(false);
      });
  }, []);

  const handleRowSelection = (row) => {
    console.log(row.row);
    setSelectedRow(row.row);
  };

  const checkInHandler = () => {
    if (selectedRow !== undefined) setOpen(true);
  };

  const finalCheckIn = () => {
    if (
      confirmationISBN.current.value === selectedRow.isbn13 ||
      confirmationISBN.current.value === selectedRow.isbn10
    ) {
      setOpenLoading(true);
      const selectedStudent = JSON.parse(
        sessionStorage.getItem("selectedStudent")
      );
      fetch("/checkin", {
        method: "POST",
        body: JSON.stringify({
          userId: selectedStudent.parent_id,
          studentId: selectedStudent._id,
          bookId: selectedRow._id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            if (studentBooks.includes(selectedRow)) {
              setOpen(false);
              const removalIndex = studentBooks.indexOf(selectedRow);
              const tempStudentBooks = [...studentBooks];
              tempStudentBooks.splice(removalIndex, 1);
              setStudentBooks(tempStudentBooks);
              setOpenLoading(false);
              setSnackBarText(data.message);
              setOpenSnackBar(true);
              if (tempStudentBooks.length === 0) {
                navigate("/app/dashboard", { replace: true });
              }
            } else {
              setOpen(false);
              setOpenLoading(false);
              navigate("/app/dashboard", { replace: true });
            }
          });
        } else {
          setOpenLoading(false);
          setSnackBarText("Unable to Checkin");
          setOpenSnackBar(true);
          confirmationISBN.current?.focus();
          confirmationISBN.current.value = "";
        }
      });
    } else {
      setSnackBarText("Incorrect Book or Barcode");
      setOpenSnackBar(true);
      confirmationISBN.current?.focus();
      confirmationISBN.current.value = "";
    }
  };

  return (
    <>
      <Helmet>
        <title>CheckIn | ClassroomLib</title>
      </Helmet>

      <Card>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box style={{ height: 370, width: "100%" }}>
            <DataGrid
              rows={studentBooks}
              columns={bookColumnNames}
              rowHeight={studentBooks.length > 5 ? 40 : 55}
              hideFooterPagination
              hideFooter
              headerHeight={40}
              onRowClick={(selectedRow) => handleRowSelection(selectedRow)}
            />
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            color="primary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={checkInHandler}
          >
            Check In
          </Button>
        </Box>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{`Check In: ${
          selectedRow !== undefined ? selectedRow.title : ""
        }`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please scan the barcode to complete check in...
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="isbn"
            label="ISBN"
            fullWidth
            inputRef={confirmationISBN}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={finalCheckIn} color="primary">
            Check In
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={openLoading}
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
            justifyContent: "center",
            pt: 3,
          }}
        >
          <CircularProgress />
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message={snackBarText}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackBar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default CheckInPage;
