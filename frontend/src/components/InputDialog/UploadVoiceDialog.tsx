import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Input,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Stack,
  styled,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { BaseDialogProps } from "@/types";
import { BlobReader, Entry, ZipReader } from "@zip.js/zip.js";
import { TableComponents, TableVirtuoso } from "react-virtuoso";

interface EntryWithAlias extends Entry {
  alias: string | null;
}

interface TableRowData {
  file: string;
  alias: string | JSX.Element;
  operations: JSX.Element;
}

interface TableColumnData {
  dataKey: keyof TableRowData;
  label: string;
}

const FileUpload = styled("input")({
  // display: "none",
});

export default function UploadVoiceDialog({
  isOpen,
  setIsOpen,
}: BaseDialogProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [voiceName, setVoiceName] = useState<string>();
  const [wavEntries, setWavEntries] = useState<EntryWithAlias[] | null>(null);
  const [editingAlias, setEditingAlias] = useState<string | null>(null); // which file's alias is being editing
  const [newAlias, setNewAlias] = useState<string>();

  const handleSubmit = () => {
    const data = {
      voiceName,
      wavEntries,
    };
    console.log("==data==>", data)
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setFiles(null);
    setVoiceName("");
    setWavEntries(null);
  };

  const readZip = async (zipFileBlob: Blob) => {
    try {
      // Creates a BlobReader object used to read `zipFileBlob`.
      const zipFileReader = new BlobReader(zipFileBlob);
      // Creates a ZipReader object reading the zip content via `zipFileReader`
      const zipReader = new ZipReader(zipFileReader);
      const entries = await zipReader.getEntries();
      if (!entries) return;
      console.log("entries==>", entries);
      const wavEntries = entries
        .filter(
          (e) => e.filename.substring(e.filename.lastIndexOf(".")) === ".wav"
        )
        .map((e) => ({
          ...e,
          alias: e.filename.substring(
            e.filename.lastIndexOf("/") + 1,
            e.filename.lastIndexOf(".")
          ),
        }));
      console.log("wavEntries==>", wavEntries);
      console.log(typeof wavEntries[0].getData);
      setWavEntries(wavEntries as EntryWithAlias[]);
      await zipReader.close();
    } catch (err) {
      setFiles(null);
      setVoiceName("");
      setWavEntries(null);
      alert("Failed to read zip file"); // TODO alert
      console.error(err);
    }
  };

  useEffect(() => {
    if (!files) return;
    readZip(files[0]);
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setFiles(e.target.files);
    if (!e.target.files) return;
    setVoiceName(e.target.files[0].name.split(".")[0]);
  };

  const renderVoiceTable = () => {
    const renderOperationButtons = (entry: EntryWithAlias) => {
      return (
        <Stack direction="row" spacing={1}>
          {editingAlias === entry.filename ? (
            <>
              <IconButton
                onClick={() => {
                  if (!newAlias) return; // TODO throw
                  setWavEntries(
                    (prev) =>
                      prev?.map((i) =>
                        i.filename === entry.filename
                          ? { ...i, alias: newAlias }
                          : i
                      ) || null
                  );
                  setEditingAlias(null);
                  setNewAlias("");
                }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setEditingAlias(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <IconButton
              onClick={() => {
                setEditingAlias(entry.filename);
                setNewAlias(entry.alias || "");
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            onClick={() =>
              setWavEntries((prev) =>
                prev!.filter((e) => e.filename !== entry.filename)
              )
            }
          >
            <DeleteForeverIcon fontSize="small" />
          </IconButton>
        </Stack>
      );
    };

    const columns: TableColumnData[] = [
      {
        label: "File",
        dataKey: "file",
      },
      {
        label: "Alias",
        dataKey: "alias",
      },
      {
        label: "Operations",
        dataKey: "operations",
      },
    ];

    const rows: TableRowData[] | undefined = wavEntries?.map((entry) => ({
      file: entry.filename,
      alias:
        editingAlias === entry.filename ? (
          <input
            autoFocus
            value={newAlias}
            onChange={(e) => setNewAlias(e.target.value)}
          />
        ) : (
          entry.alias || ""
        ),
      operations: renderOperationButtons(entry),
    }));

    const VirtuosoTableComponents: TableComponents<TableRowData> = {
      Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
      )),
      Table: (props) => (
        <Table
          {...props}
          sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
        />
      ),
      TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} />
      )),
      TableRow,
      TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
      )),
    };

    const fixedHeaderContent = () => {
      return (
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.dataKey}
              variant="head"
              sx={{
                backgroundColor: "background.paper",
              }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      );
    };

    const rowContent = (_index: number, row: TableRowData) => {
      return (
        <>
          {columns.map((column) => (
            <TableCell key={column.dataKey}>
              {row && row[column.dataKey]}
            </TableCell>
          ))}
        </>
      );
    };

    return (
      wavEntries && (
        <>
          <Typography sx={{ mt: 2 }}>
            {wavEntries.length > 0 && `Total wav files: ${wavEntries.length}`}
          </Typography>
          <Paper style={{ height: "60vh", minWidth: "60vw" }}>
            <TableVirtuoso
              data={rows}
              components={VirtuosoTableComponents}
              fixedHeaderContent={fixedHeaderContent}
              itemContent={rowContent}
            />
          </Paper>
        </>
      )
    );
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>{`Upload Voice`}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          // onSubmit={handleSubmit}
        >
          <Typography variant="subtitle2">{`Please upload .zip file`}</Typography>
          <FileUpload
            type="file"
            onChange={(e) => (console.log(e), handleFileChange(e))}
            multiple={false}
          />
          {files && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mt: 2 }}
            >
              <Typography>{`Voice name: `}</Typography>
              <TextField
                value={voiceName}
                size="small"
                onChange={(e) => setVoiceName(e.target.value)}
              />
            </Stack>
          )}
          {renderVoiceTable()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
