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
import _ from "lodash";

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
  const [duplicateAliasPairs, setDuplicateAliasPairs] = useState<
    EntryWithAlias[][]
  >([]);
  const [isDupAlertDialogOpen, setIsDupAlertDialogOpen] =
    useState<boolean>(false);

  const handleSubmit = () => {
    const data = {
      voiceName,
      wavEntries,
    };
    console.log("==data==>", data);
    if (duplicateAliasPairs.length > 0) {
      setIsDupAlertDialogOpen(true);
      return;
    }
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
      const _tempEntries = _.cloneDeep(wavEntries);
      for (let i = 0; i < wavEntries.length; i++) {
        const temp: EntryWithAlias[] = [wavEntries[i]];
        for (let j = i + 1; j < wavEntries.length; j++) {
          if (wavEntries[j].alias === wavEntries[i].alias) {
            temp.push(wavEntries[j]);
          }
        }
        _tempEntries.filter((item) => !temp.includes(item));
        if (temp.length > 1) setDuplicateAliasPairs((prev) => [...prev, temp]);
      }
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
      const handleSetNewAlias = () => {
        if (!newAlias) return; // TODO throw

        const editDup = duplicateAliasPairs
          .flat()
          .find((e) => e.filename === entry.filename);
        if (editDup && editDup.alias !== newAlias) {
          setDuplicateAliasPairs((prev) =>
            prev.filter((p) => !p.find((i) => i.filename === editDup.filename))
          );
        }

        // Cannot have multiple entries with same aliases
        const dup = wavEntries?.filter((e) => e.alias === newAlias);
        if (dup && dup.length > 0) {
          setDuplicateAliasPairs((prev) => [...prev, [...dup, entry]]);
        }

        setWavEntries(
          (prev) =>
            prev?.map((i) =>
              i.filename === entry.filename ? { ...i, alias: newAlias } : i
            ) || null
        );
        setEditingAlias(null);
        setNewAlias("");
      };
      return (
        <Stack direction="row" spacing={1}>
          {editingAlias === entry.filename ? (
            <>
              <IconButton onClick={handleSetNewAlias}>
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
          <Typography
            sx={{
              color: duplicateAliasPairs
                .flat()
                .find((i) => i.filename === entry.filename) //includes(entry)
                ? "red"
                : "black",
            }}
          >
            {entry.alias || ""}
          </Typography>
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
        <Dialog open={isDupAlertDialogOpen} maxWidth="md" fullWidth>
          <DialogTitle>{`Cannot upload voice`}</DialogTitle>
          <DialogContent>
            <Typography sx={{mb: 1}}>{`Have following duplicate alisaes: `}</Typography>
            {duplicateAliasPairs.map((pair) => {
              return (
                <Typography sx={{mb: 1}}>
                  {pair.map((item) => {
                    return (
                      <Typography>{`File: ${item.filename}, alias: ${item.alias}`}</Typography>
                    );
                  })}
                </Typography>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDupAlertDialogOpen(false)}>OK</Button>
          </DialogActions>
        </Dialog>
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
