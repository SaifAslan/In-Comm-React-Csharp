import React, { useEffect, useState } from "react";
import { Table, Button, Select, message } from "antd";
import axios from "axios";
import { IUser } from "../../Interfaces/IUser"; 
import { useAppSelector } from "../../Redux/hooks";

const Users: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const { user } = useAppSelector((state) => state.user); 

  const fetchUsers = () => {
    axios
      .get<IUser[]>("http://localhost:5197/api/user",{headers:{Authorization: `Bearer ${user?.token}`   }  })
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => {
        message.error("Failed to fetch users.");
        console.error(error);
      });
  };

  const handleFilterChange = (value: string | undefined) => {
    setFilter(value);
    if (value) {
      // setFilteredUsers(users.filter((user) => user.roles.includes(value))); // Assuming the IUser interface has a 'role' property
    } else {
      setFilteredUsers(users);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name", // Adjust this based on your IUser interface
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email", // Adjust this based on your IUser interface
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role", // Adjust this based on your IUser interface
      key: "role",
    },
  ];

  return (
    <div>
      <h2>User Management</h2>
      <Select
        placeholder="Filter by role"
        style={{ width: 200, marginBottom: 16 }}
        onChange={handleFilterChange}
        allowClear
      >
        <Select.Option value="Student">Student</Select.Option>
        <Select.Option value="Instructor">Instructor</Select.Option>
        <Select.Option value="Admin">Admin</Select.Option>
      </Select>
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id" // Adjust this based on your IUser interface
      />
    </div>
  );
};

export default Users;
