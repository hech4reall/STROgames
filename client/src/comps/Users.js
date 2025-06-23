import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllUsers, updateUserRole, deleteUser, getCurrentUser } from '../redux/slices/authSlice';
import './AdminDashboard.css'; 

function Users() {
    const users = useSelector((state) => state.auth.users);
    const currentUser = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetAllUsers());
        dispatch(getCurrentUser());
    }, [dispatch]);

    const handleRoleChange = (userId, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        dispatch(updateUserRole({ userId, role: newRole }));
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId));
        }
    };

    if (loading && !users.length) {
        return <div className="loading-message">Loading users...</div>;
    }

    if (error) {
        return <div className="admin-error">Error: {error}</div>;
    }

    return (
        <div className="admin-dashboard-container">
            {/* <div className="dashboard-header">
                <h1 style={{color: 'white'}}>User Management</h1>
            </div> */}

            <div className="dashboard-section">
                <h3>All Registered Users</h3>
                {users && users.length > 0 ? (
                    <div className="table-responsive">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Numero</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.email}</td>
                                        <td>{user.numero}</td>
                                        <td>
                                            <span className={`status-badge ${user.role === 'admin' ? 'status-approved' : 'status-pending'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-group-inline">
                                                <button
                                                    className={`action-button ${user.role === 'admin' ? 'reject' : 'approve'}`}
                                                    onClick={() => handleRoleChange(user._id, user.role)}
                                                    disabled={currentUser && currentUser._id === user._id}
                                                >
                                                    {user.role === "admin" ? "Turn to User" : "Turn to Admin"}
                                                </button>
                                                <button
                                                    className="action-button delete"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    disabled={currentUser && currentUser._id === user._id}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">No users found.</div>
                )}
            </div>
        </div>
    );
}

export default Users;