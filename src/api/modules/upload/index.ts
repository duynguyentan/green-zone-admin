import axios from '../../axios';
import { appSettings } from '../../axios/config';

export const uploadFileApi = (
  file: File
): Promise<{
  url: string;
}> => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${appSettings.BASE_API_URL}/file/image/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadMultipleFilesApi = (
  files: File[]
): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return axios.post(
    `${appSettings.BASE_API_URL}/file/images/multiple-upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const deleteFileApi = (fileName: string) =>
  axios.delete(`/file/${fileName}`);
