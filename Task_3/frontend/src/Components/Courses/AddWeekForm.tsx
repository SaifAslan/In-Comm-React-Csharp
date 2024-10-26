// Importing Ant Design components
import { Form, Input, Button, message, Card } from "antd"; 
import TextArea from "antd/es/input/TextArea"; 

// Importing React and hooks
import React, { useState } from "react"; 

// Importing interfaces
import { IWeek } from "../../Interfaces/IWeek"; 
import { ICourse } from "../../Interfaces/ICourse"; 

// Importing custom components and hooks
import FileUpload from "./FileUpload"; 
import { useAppSelector } from "../../Redux/hooks"; 

// Importing Axios for making API requests
import axios from "axios"; 

// Defining props for AddWeekForm component
interface AddWeekFormProps {
  courseDetails: ICourse | null; // Details of the course
  weekNum: number; // Week number for display
}

// AddWeekForm component definition
const AddWeekForm: React.FC<AddWeekFormProps> = ({ courseDetails, weekNum }) => {
  const [form] = Form.useForm(); // Creating form instance
  const [week, setWeek] = useState<IWeek | null>(null); // State for the created week
  const { user } = useAppSelector((state) => state.user); // Getting user from Redux store

  const onFinishWeek = async (values: { title: string; description: string }) => {
    if (!courseDetails) return; // Guard clause

    try {
      const response = await axios.post<IWeek>(
        `http://localhost:5197/api/course/${courseDetails.id}/week`, // API endpoint
        values,
        { headers: { Authorization: `Bearer ${user?.token}` } } // Authorization header
      );
      setWeek(response.data); // Update weeks state with the new week
      message.success("Week has been created!"); // Show success message
    } catch (error) {
      message.error("An unexpected error occurred."); // Show error message
      console.error(error);
    }
  };

  return (
    <Card title={"Week " + (weekNum + 1)} style={{ marginBottom: "1rem" }}>
      <Form layout={"horizontal"} form={form} onFinish={onFinishWeek}>
        <Form.Item label="Title" required name="title">
          <Input placeholder="Enter week title" /> {/* Title input */}
        </Form.Item>
        <Form.Item label="Description" required name="description">
          <TextArea
            placeholder="Enter week description"
            autoSize={{ minRows: 3, maxRows: 5 }} // Adjustable text area
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Create Week
          </Button> {/* Submit button */}
        </Form.Item>
        {week && <FileUpload weekId={week?.id} user={user} />} {/* File upload component */}
      </Form>
    </Card>
  );
};

export default AddWeekForm; 
