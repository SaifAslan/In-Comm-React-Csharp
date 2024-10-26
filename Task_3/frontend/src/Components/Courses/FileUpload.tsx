// Importing Ant Design components and icons
import { Upload, Button, message, Row, Col } from "antd"; 
import { FileOutlined, UploadOutlined } from "@ant-design/icons"; 

// Importing React and hooks
import React, { useState } from "react"; 

// Importing Axios for making API requests
import axios from "axios"; 

// Importing interfaces
import { IUser } from "../../Interfaces/IUser"; 
import { IweekFile } from "../../Interfaces/IWeekFile"; 


interface FileUploadProps {
  weekId: number; // Assume weekId is a number
  user: IUser | null; // Define the user structure
}

const FileUpload: React.FC<FileUploadProps> = ({ weekId, user }) => {
  const [fileList, setFileList] = useState<any[]>([]); // State to manage the file list for upload
  const [weekFiles, setWeekFiles] = useState<IweekFile[] | []>([]); // State to manage the uploaded files
  const handleChange = (info: any) => {
    if (info.fileList.length > 0) {
      const selectedFile = info.fileList[0].originFileObj as File; // Get the selected file
      setFileList(info.fileList); // Set the file for upload
    }
  };

  const handleOnRemove = (e: any) => {
    setFileList([]);
  };

  const handleUpload = async () => {
    if (!fileList[0].originFileObj) {
      message.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj as File);

    await axios
      .post(`http://localhost:5197/api/week/${weekId}/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((response) => {
        setFileList([]);// Clear the selected file after successful upload
        message.success("File upload successfull.");
        setTimeout(fetchWeekFiles, 2000);
      })
      .catch((error) => {
        message.error("File upload failed.");
        console.error(error);
      });
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
      .catch((error) => {
        message.error("Failed to fetch week files.");
        console.error(error);
      });
  };
  

  return (
    <div>
      <Upload
        beforeUpload={() => false} // Prevent automatic upload
        onChange={handleChange}
        listType="picture"
        showUploadList={true} // Hide the default upload list
        maxCount={1}
        onRemove={handleOnRemove}
        fileList={fileList}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>

      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length>0 && false} // Disable button if no file is selected
        style={{ marginTop: "10px" }}
      >
        Upload File
      </Button>
      <Row gutter={16} style={{ marginTop: "20px" }}>
        {weekFiles.map((uploadedFile, index) => (
          <Col
            span={8}
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            {uploadedFile.url.includes(".png") || uploadedFile.url.includes(".jpg") || uploadedFile.url.includes(".jpeg")? (
              // Display image preview if it's an image
              <img
                src={uploadedFile.url}
                alt={uploadedFile.fileName}
                style={{ width: 50, height: 50, marginRight: 10 }} // Adjust size as needed
              />
            ) : (
              // Display file icon and name for other file types
              <FileOutlined style={{ fontSize: 24, marginRight: 5 }} />
            )}
            <span>{uploadedFile.fileName}</span>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FileUpload;
// {file && (
//    <div style={{ marginTop: "10px" }}>
//     <span>{file.name}</span> {/* Display only the file name */}
//     </div>
//   )}
