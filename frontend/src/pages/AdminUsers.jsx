import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/admin/users/");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <h1
        style={{
          color: "white",
          marginBottom: "30px",
        }}
      >
        Users
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#111827",
          color: "white",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#1E293B",
            }}
          >
            <th style={{ padding: "15px" }}>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              style={{
                borderBottom: "1px solid #374151",
              }}
            >
              <td style={{ padding: "15px" }}>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default AdminUsers;