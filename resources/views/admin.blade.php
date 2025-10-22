<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>SEIJ UMS - Admin Dashboard</title>
    <link rel="stylesheet" href="{{ asset('admin.css') }}">
</head>
<body>
    <!-- Auth Loading Overlay -->
    <div id="authLoadingOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0f1419; z-index: 9999; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center;">
            <div style="width: 40px; height: 40px; border: 3px solid #667eea; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
            <p style="color: #8b92a8; font-size: 14px;">Verifying access...</p>
        </div>
    </div>
    <style>
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>

    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="logo">
            <div class="logo-icon">🎓</div>
            <span class="logo-text">SEU UMS</span>
        </div>

        <nav class="nav-menu">
            <div class="nav-item active">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <span class="nav-text">Students</span>
            </div>

            <div class="nav-section-title">ADMIN TOOLS</div>
            
            <div class="nav-item">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <span class="nav-text">Dashboard</span>
            </div>

            <div class="nav-item">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <span class="nav-text">Reports</span>
            </div>

            <div class="nav-item">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
                <span class="nav-text">Settings</span>
            </div>
            
            <div class="nav-section-title">ACCOUNT</div>
            
            <div class="nav-item" id="logoutBtn">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span class="nav-text">Logout</span>
            </div>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Header -->
        <header class="header">
            <div class="header-left">
                <h1 class="page-title">Student Management</h1>
            </div>
            <div class="header-actions">
                <button class="icon-btn" title="Notifications">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                    </svg>
                </button>
                <div class="user-info" id="userInfoToggle">
                    <div class="user-avatar">
                        <img src="https://i.pravatar.cc/80" alt="Admin">
                    </div>
                    <div class="user-details">
                        <span class="user-name" id="adminName">Admin User</span>
                        <span class="user-role">Administrator</span>
                    </div>
                    <div class="user-dropdown" id="userDropdown">
                        <button class="dropdown-item" id="logoutDropdownBtn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Dashboard Content -->
        <div class="dashboard-container">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">👥</div>
                    <div class="stat-content">
                        <div class="stat-number" id="totalStudents">0</div>
                        <div class="stat-label">Total Students</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-content">
                        <div class="stat-number" id="activeStudents">0</div>
                        <div class="stat-label">Active Students</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">🎓</div>
                    <div class="stat-content">
                        <div class="stat-number" id="newThisMonth">0</div>
                        <div class="stat-label">New This Month</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">👨‍💼</div>
                    <div class="stat-content">
                        <div class="stat-number" id="adminCount">0</div>
                        <div class="stat-label">Administrators</div>
                    </div>
                </div>
            </div>

            <!-- Students Table -->
            <div class="table-container">
                <div class="table-header">
                    <h2>All Students</h2>
                    <div class="table-actions">
                        <div class="search-box">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                            <input type="text" id="searchInput" placeholder="Search students...">
                        </div>
                        <button class="btn btn-primary" id="addStudentBtn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            Add Student
                        </button>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table class="students-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Batch</th>
                                <th>Program</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="studentsTableBody">
                            <tr class="loading-row">
                                <td colspan="8">
                                    <div class="loading-spinner"></div>
                                    Loading students...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <!-- Add/Edit Student Modal -->
    <div id="studentModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Add New Student</h2>
                <button class="close-btn" id="closeModal">&times;</button>
            </div>
            <form id="studentForm">
                <input type="hidden" id="studentId">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="studentName">Full Name *</label>
                        <input type="text" id="studentName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="studentEmail">Email *</label>
                        <input type="email" id="studentEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="studentStudentId">Student ID *</label>
                        <input type="text" id="studentStudentId" name="student_id" required>
                    </div>
                    <div class="form-group">
                        <label for="studentPassword">Password *</label>
                        <input type="password" id="studentPassword" name="password" placeholder="Leave empty to keep current">
                    </div>
                    <div class="form-group">
                        <label for="studentBatch">Batch</label>
                        <input type="text" id="studentBatch" name="batch">
                    </div>
                    <div class="form-group">
                        <label for="studentProgram">Program</label>
                        <input type="text" id="studentProgram" name="program">
                    </div>
                    <div class="form-group">
                        <label for="studentPhone">Phone</label>
                        <input type="tel" id="studentPhone" name="phone">
                    </div>
                    <div class="form-group">
                        <label for="studentAddress">Address</label>
                        <input type="text" id="studentAddress" name="address">
                    </div>
                </div>
                <div class="form-group checkbox-group">
                    <label>
                        <input type="checkbox" id="studentIsAdmin" name="is_admin">
                        <span>Administrator</span>
                    </label>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="submitBtn">Save Student</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="modal">
        <div class="modal-content small">
            <div class="modal-header">
                <h2>Confirm Delete</h2>
                <button class="close-btn" id="closeDeleteModal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this student?</p>
                <p><strong id="deleteStudentName"></strong></p>
                <p class="warning-text">⚠️ This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="cancelDeleteBtn">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('admin.js') }}"></script>
</body>
</html>
