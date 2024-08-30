import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
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
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HeadsetIcon from "@mui/icons-material/Headset";
import { BaseDialogProps, RootState } from "@/types";
import {
  BlobReader,
  Entry,
  ZipReader,
  BlobWriter,
  ZipWriter,
} from "@zip.js/zip.js";
import { TableComponents, TableVirtuoso } from "react-virtuoso";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { listFiles, uploadFile, uploadFileResumable } from "@/api/storageApi";
import { useSelector } from "react-redux";
import { raiseAlert } from "../Alert/AutoDismissAlert";
import { showDialog } from "../Dialog";

interface EntryWithAlias extends Entry {
  alias: string | null;
}

interface TableRowData {
  file: string;
  alias: string | JSX.Element;
  audio: JSX.Element;
  operations: JSX.Element;
}

interface TableColumnData {
  dataKey: keyof TableRowData;
  label: string;
}

interface WavEntryData {
  filename: string;
  alias: string | null;
  blob: Blob | null;
}

const FileUpload = styled("input")({
  // display: "none",
});

const DECODER = "utf-8";
const BUCKET_NAME = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET_NAME;

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
  const [isVoiceLoading, setIsVoiceLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const handleSubmit = async () => {
    try {
      if (!wavEntries || !voiceName) return;

      // Check whether duplicate aliases exist
      if (duplicateAliasPairs.length > 0) {
        setIsDupAlertDialogOpen(true);
        return;
      }
      setIsUploading(true);

      const upload = async (upsert = false) => {
        const getWavEntriesData = async (): Promise<
          WavEntryData[] | undefined
        > => {
          const res = [];
          for (const entry of wavEntries) {
            const getBlob = async (entry: EntryWithAlias) => {
              console.log("getWavUrl");
              if (!entry.getData) return null;
              return await entry.getData(new BlobWriter());
            };
            res.push({
              filename: entry.filename,
              alias: entry.alias,
              blob: await getBlob(entry),
            });
          }
          return res;
        };

        const data: {
          voiceName: string | undefined;
          wavEntriesData?: WavEntryData[];
        } = { voiceName: voiceName };
        console.log("==data==>", data);

        const processEntries = async () => {
          const wavEntriesData = await getWavEntriesData();
          if (!wavEntriesData) return;
          data.wavEntriesData = wavEntriesData;
        };
        await processEntries();
        console.log("==processed=data==>", data);

        if (!data.wavEntriesData) return;
        // Upload wav files separately, slow
        // for (const item of data.wavEntryData) {
        //   await uploadFile(
        //     `voice/${currentUser?.id}/${data.voiceName}/${item.filename}`,
        //     item.blob,
        //     {
        //       metadata: { filename: item.filename, alias: item.alias },
        //       upsert: true,
        //     }
        //   );
        // }

        // Create new zip file and upload
        // Creates a BlobWriter object where the zip content will be written.
        const zipFileWriter = new BlobWriter();
        // Creates a ZipWriter object writing data via `zipFileWriter`
        const zipWriter = new ZipWriter(zipFileWriter);
        for (const item of data.wavEntriesData) {
          if (!item.blob) continue;
          await zipWriter.add(item.filename, new BlobReader(item.blob));
        }

        const aliasMapper: { [key: string]: string } = {};
        const filenameMapper: { [key: string]: string } = {};
        data.wavEntriesData.forEach((entry) => {
          entry.alias && (aliasMapper[entry.alias] = entry.filename);
          entry.alias && entry.filename && (filenameMapper[entry.filename] = entry.alias);
        });

        const aliasMapperJsonString = JSON.stringify(aliasMapper);
        const aliasMapperBlob = new Blob([aliasMapperJsonString], { type: "application/json" });
        const filenameMapperJsonString = JSON.stringify(filenameMapper);
        const filenameMapperBlob = new Blob([filenameMapperJsonString], { type: "application/json" });

        await zipWriter.add("aliasMapper.json", new BlobReader(aliasMapperBlob));
        await zipWriter.add("filenameMapper.json", new BlobReader(filenameMapperBlob));

        await zipWriter.close();
        // Retrieves the Blob object containing the zip content into `zipFileBlob`. It
        // is also returned by zipWriter.close() for more convenience.
        const zipFileBlob = await zipFileWriter.getData();

        if (zipFileBlob.size / 1024 / 1024 > 50) {
          raiseAlert(
            "error",
            `The file is too large. Maximum allowed size: 50MB`
          );
          console.error(`The file is too large. Maximum allowed size: 50MB`)
          setIsUploading(false);
          return;
        }

        const res = await uploadFile(
          `voices/${currentUser?.id}/${data.voiceName}`,
          zipFileBlob,
          {
            // metadata: { aliasMapper, filenameMapper, testMetadata: "testMetadata" },
            upsert: upsert,
            contentType: "application/zip"
          }
        );

        if (!res.error) {
          raiseAlert("success", `Voice \`${data.voiceName}\` uploaded`);
          setIsUploading(false);
          handleClose();
        } else {
          console.error("res.error===>", res.error);
          raiseAlert("error", `Error: ${res.error.message}`);
          setIsUploading(false);
        }
      };

      // Check whether the file exists in storage
      const listRes = await listFiles(
        BUCKET_NAME,
        `voices/${currentUser?.id}/`
      );
      if (listRes.error) {
        raiseAlert("error", `Error: ${listRes.error.message}`);
        console.error(listRes.error);
        setIsUploading(false);
        return;
      }
      const existingFilenames = listRes.data.map((f) => f.name);
      if (existingFilenames.includes(voiceName)) {
        showDialog({
          title: `Voice name \`${voiceName}\` already exists`,
          message: "Do you want to replace it with this voice?",
          confirmCallback: async () => {
            await upload(true);
            // setIsUploading(false);
            // handleClose();
          },
          cancelCallback: () => setIsUploading(false),
        });
        return;
      }
      console.log(listRes);

      // Normal upload
      await upload();
      // setIsUploading(false);
      // handleClose();
    } catch (err) {
      // TODO remove/change
      console.error(err);
      raiseAlert("error", `Error: ${err}`);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFiles(null);
    setVoiceName("");
    setWavEntries(null);
  };

  const readZip = async (zipFileBlob: Blob) => {
    try {
      setIsVoiceLoading(true);
      // Creates a BlobReader object used to read `zipFileBlob`.
      const zipFileReader = new BlobReader(zipFileBlob);
      // Creates a ZipReader object reading the zip content via `zipFileReader`
      const zipReader = new ZipReader(zipFileReader);
      const entries = await zipReader.getEntries();
      const decodedEntries = entries.map((entry) => ({
        ...entry,
        filename: new TextDecoder(DECODER).decode(
          new TextEncoder().encode(entry.filename)
        ),
      }));
      if (!decodedEntries) return;
      console.log("decodedEntries==>", decodedEntries);
      const wavEntries = decodedEntries
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

      // Avoid duplicate aliases
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
      setIsVoiceLoading(false);
      await zipReader.close();
    } catch (err) {
      setFiles(null);
      setVoiceName("");
      setWavEntries(null);
      alert("Failed to read zip file"); // TODO alert
      console.error("err===>", err);
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

        // When a duplicate alias is edited, check whether the new value is valid
        const editDup = duplicateAliasPairs
          .flat()
          .find((e) => e.filename === entry.filename);
        if (editDup && editDup.alias !== newAlias) {
          const _newPairs = _.cloneDeep(duplicateAliasPairs)
            .filter((pair) =>
              pair.find((item) => item.filename === editDup.filename)
            )
            .map((pair) => {
              if (pair.length === 2) {
                return null;
              } else {
                return pair.filter(
                  (item) => item.filename !== editDup.filename
                );
              }
            })
            .filter((pair): pair is EntryWithAlias[] => pair !== null);
          setDuplicateAliasPairs(_newPairs);
        }

        // Cannot have multiple entries with same aliases
        const dup = wavEntries?.filter(
          (e) => e.filename !== entry.filename && e.alias === newAlias
        );
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
        label: "Audio",
        dataKey: "audio",
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
      audio: <Audio entry={entry} />,
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
              key={uuidv4()}
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
            <TableCell key={uuidv4()}>{row && row[column.dataKey]}</TableCell>
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
            <Typography
              sx={{ mb: 1 }}
            >{`Have following duplicate alisaes: `}</Typography>
            {duplicateAliasPairs.map((pair) => {
              return (
                <Typography key={uuidv4()} sx={{ mb: 1 }}>
                  {pair.map((item) => {
                    return (
                      <Typography
                        key={uuidv4()}
                        component="span"
                        display="block"
                      >{`File: ${item.filename}, alias: ${item.alias}`}</Typography>
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
          {isVoiceLoading ? (
            <CircularProgress size="3rem" sx={{ m: "auto" }} />
          ) : (
            renderVoiceTable()
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isVoiceLoading || isUploading}>
          {isUploading ? <CircularProgress size="1rem" /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Audio = ({ entry }: { entry: EntryWithAlias }) => {
  const [url, setUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const getWavUrl = async (entry: EntryWithAlias) => {
    if (!entry.getData) return "";
    const blob = await entry.getData(new BlobWriter());
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    let res: string;
    (async () => {
      res = await getWavUrl(entry);
      setUrl(res);
    })();
    return () => URL.revokeObjectURL(res);
  }, []);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio src={url} controls ref={audioRef} style={{ display: "none" }} />
      <IconButton aria-label="play-voice" onClick={handlePlay}>
        <HeadsetIcon />
      </IconButton>
    </>
  );
};
