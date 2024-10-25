import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import axios from "axios";
import { IUser } from "../../Interfaces/IUser";
import { IweekFile } from "../../Interfaces/IWeekFile";

interface FileUploadProps {
  weekId: number; // Assume weekId is a number
  user: IUser | null; // Define the user structure
}

const FileUpload: React.FC<FileUploadProps> = ({ weekId, user }) => {
  const [file, setFile] = useState<File | null>(null); // State to manage the selected file
  const [weekFiles, setWeekFiles] = useState<IweekFile | []>([]); // State to manage the uploaded files
  const handleChange = (info: any) => {
    if (info.fileList.length > 0) {
      const selectedFile = info.fileList[0].originFileObj as File; // Get the selected file
      setFile(selectedFile); // Set the file for upload
    }
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.get(
        `http://localhost:5197/api/week/${weekId}/files`, // Adjust the endpoint as needed
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setFile(null); // Clear the selected file after successful upload
      fetchWeekFiles();
    } catch (error) {
      message.error("File upload failed.");
      console.error(error);
    }
  };

  const fetchWeekFiles = () => {
    axios
      .get(
        `http://localhost:5197/api/week/${weekId}/files`, // Adjust the endpoint as needed
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((response) => {
        setWeekFiles(response.data); // Update the state with the fetched files
      })
      .then((error ) => {
        message.error("Failed to fetch week files.");
        console.error(error);
      });
    // Process the response to display the uploaded files
  };

  return (
    <div>
      <Upload
        beforeUpload={() => false} // Prevent automatic upload
        onChange={handleChange}
        showUploadList={false} // Hide the default upload list
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      {file && (
        <div style={{ marginTop: "10px" }}>
          <span>{file.name}</span> {/* Display only the file name */}
        </div>
      )}
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={!file} // Disable button if no file is selected
        style={{ marginTop: "10px" }}
      >
        Upload File
      </Button>
    </div>
  );
};

export default FileUpload;
