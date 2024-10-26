import React, { useEffect, useState } from "react";
import { Table, Button, Select, message, Tag, Pagination } from "antd";
import axios from "axios";
import { IUser } from "../../Interfaces/IUser";
import { useAppSelector } from "../../Redux/hooks";

const Users: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  // const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [totalCount, setTotalCount] = useState<number>(0); // Total number of users
  const pageSize = 10; // Number of users per page
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const { user } = useAppSelector((state) => state.user);

  const fetchUsers = (page: number, size: number) => {
    axios
      .get<IUser[]>("http://localhost:5197/api/account/users", {
        params: {
          role: filter || null, // Include the role filter if set
          pageNumber: page,
          pageSize: size,
        },
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      .then((response) => {
        //@ts-ignore
        setUsers(response.data.users);        
        //@ts-ignore
        setTotalCount(response.data.totalCount);
        // setFilteredUsers(response.data.users);
      })
      .catch((error) => {
        message.error("Failed to fetch users.");
        console.error(error);
      });
  };

  // const handleFilterChange = (value: string | undefined) => {
  //   setFilter(value);
  //   if (value) {
  //     // setFilteredUsers(users.filter((user) => user.roles.includes(value))); // Assuming the IUser interface has a 'role' property
  //   } else {
  //     setFilteredUsers(users);
  //   }
  // };

  const handleFilterChange = (value: string | undefined) => {
    setFilter(value);
    fetchUsers(1, pageSize); // Reset to first page on filter change
  };

  useEffect(() => {
    fetchUsers(currentPage, pageSize); // Fetch users on component mount
  }, [currentPage,filter]);

  const roleColorMap = {
    Student: "orange",
    Instructor: "red",
    Admin: "blue",
    default: "grey",
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "role",
      render: (role: string) => {
        return (
          <Tag
            color={roleColorMap[role as keyof typeof roleColorMap] || "default"}
          >
            {role}
          </Tag> // Map role to color
        );
      },
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
        dataSource={users}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          onChange: (page) => {
            setCurrentPage(page); // Update current page on pagination change
            fetchUsers(page, pageSize); // Fetch users for the selected page
          },
        }}
      />
    </div>
  );
};

export default Users;
