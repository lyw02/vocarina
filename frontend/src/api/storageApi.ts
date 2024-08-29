import { SortBy, StorageError } from "@supabase/storage-js";
import { supabase } from "./utils";
import * as tus from "tus-js-client";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";

const BUCKET_NAME = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET_NAME;
const PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

interface UploadOptions {
  metadata?: object;
  upsert?: boolean;
}

interface ListFileOptions {
  limit?: number;
  offset?: number;
  sortBy?: SortBy;
}

export const listFiles = async (
  bucket: string,
  path: string,
  options?: ListFileOptions
) => {
  return await supabase.storage.from(bucket).list(path, options);
};

export const uploadFile = async (
  filepath: string,
  file: any,
  options?: UploadOptions
) => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filepath, file, options);
  if (error) {
    // Handle error
    console.error("==upload==> error", error);
  } else {
    // Handle success
    console.log("==upload==> data", data);
  }
  return { data, error };
};


// TODO
export const uploadFileResumable = async (
  filepath: string,
  file: any,
  options?: UploadOptions
): Promise<{
  data: {
    id: string;
    path: string;
    fullPath: string;
  } | null;
  error: StorageError | null;
}> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  //   return new Promise((resolve) => {
  //     const upload = new tus.Upload(file, {
  //       endpoint: `https://${PROJECT_URL}/storage/v1/upload/resumable`,
  //       retryDelays: [0, 3000, 5000, 10000, 20000],
  //       headers: {
  //         authorization: `Bearer ${session!.access_token}`,
  //         "x-upsert": options?.upsert ? "true" : "false", // optionally set upsert to true to overwrite existing files
  //       },
  //       uploadDataDuringCreation: true,
  //       removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
  //       metadata: {
  //         bucketName: BUCKET_NAME,
  //         objectName: filepath,
  //         contentType: "application/zip",
  //         cacheControl: "3600",
  //       },
  //       chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
  //       onError: (error) => {
  //         console.log("Failed because: " + error);
  //         resolve({ data: null, error: new StorageError(error.message) });
  //       },
  //       onProgress: (bytesUploaded, bytesTotal) => {
  //         const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
  //         console.log(bytesUploaded, bytesTotal, percentage + "%");
  //       },
  //       onSuccess: () => {
  //         console.log("Download from %s", upload.url);
  //         resolve({
  //             data: {
  //                 id: upload.url || '',
  //                 path: filepath,
  //                 fullPath: `${BUCKET_NAME}/${filepath}`,
  //             },
  //             error: null
  //         });
  //       },
  //     });

  //     // Check if there are any previous uploads to continue.
  //     return upload.findPreviousUploads().then((previousUploads) => {
  //       // Found previous uploads so we select the first one.
  //       if (previousUploads.length) {
  //         upload.resumeFromPreviousUpload(previousUploads[0]);
  //       }

  //       // Start the upload
  //       upload.start();
  //     });
  //   });

  return new Promise((resolve) => {
    const uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 1,
      },
    });

    uppy.use(Tus, {
      endpoint: `${PROJECT_URL}/v1/s3/upload/resumable`,
      headers: {
        authorization: `Bearer ${session?.access_token}`,
        apikey: SUPABASE_KEY,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
      chunkSize: 6 * 1024 * 1024,
      allowedMetaFields: [
        "bucketName",
        "objectName",
        "contentType",
        "cacheControl",
      ],

    //   metadata: {
    //     filename: filepath,
    //     ...options?.metadata,
    //   },
    });

    // uppy.on('file-added', (file) => {
    //     file.meta = {
    //       ...file.meta,
    //       bucketName: BUCKET_NAME,
    //       objectName: filepath,
    //       contentType: "application/zip",
    //     }
    //   })
      
    //   uppy.on('complete', (result) => {
    //     console.log('Upload complete! We’ve uploaded these files:', result.successful)
    //     resolve({
    //             data: {
    //               id: response.uploadURL, // URL of the uploaded file
    //               path: filepath,
    //               fullPath: fullPath,
    //             },
    //             error: null,
    //           });
    //   })

    uppy.on("upload-success", (file, response) => {
      resolve({
        data: {
          id: response.uploadURL!, // URL of the uploaded file
          path: filepath,
          fullPath: `${BUCKET_NAME}/${filepath}`,
        },
        error: null,
      });
    });

    uppy.on("upload-error", (file, error) => {
      resolve({
        data: null,
        error: new StorageError(error.message),
      });
    });

    // 添加文件并开始上传
    uppy.addFile({
      name: file.name,
      type: file.type,
      data: file,
    //   source: "Local",
    });

    uppy.upload();
  });
};
