// Immediate auth check - prevent page load without token or admin access
const authToken = localStorage.getItem('auth_token');
const userData = localStorage.getItem('user');

if (!authToken) {
    window.location.href = '/login';
    throw new Error('Unauthorized - redirecting to login');
}

// Check if user is admin from stored data
if (userData) {
    try {
        const user = JSON.parse(userData);
        if (!user.is_admin) {
            // Not an admin, redirect immediately
            window.location.href = '/login';
            throw new Error('Access denied - not an admin');
        }
    } catch (e) {
        // Invalid user data, redirect
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Invalid user data');
    }
} else {
    // No user data, redirect
    window.location.href = '/login';
    throw new Error('No user data found');
}

// Configuration - using direct routes, no API prefix

// Get CSRF token from meta tag
function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}

// State (authToken already declared above)
let currentUser = null;
let allStudents = [];
let deleteStudentId = null;

// DOM Elements
const studentsTableBody = document.getElementById('studentsTableBody');
const searchInput = document.getElementById('searchInput');
const addStudentBtn = document.getElementById('addStudentBtn');
const studentModal = document.getElementById('studentModal');
const deleteModal = document.getElementById('deleteModal');
const studentForm = document.getElementById('studentForm');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!authToken) {
        window.location.href = '/login';
        return;
    }

    checkAuth();
    setupEventListeners();
});

// Check Authentication
async function checkAuth() {
    try {
        const response = await fetch('/user', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        currentUser = data.user;

        // Check if user is admin
        if (!currentUser.is_admin) {
            alert('Access denied. Admin privileges required.');
            window.location.href = '/index';
            return;
        }

        document.getElementById('adminName').textContent = currentUser.name;
        
        // Hide loading overlay after successful auth
        const overlay = document.getElementById('authLoadingOverlay');
        if (overlay) overlay.style.display = 'none';
        
        loadStudents();
    } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
    }
}

// Load Students
async function loadStudents() {
    try {
        const response = await fetch('/admin/students', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error('Failed to load students');
        }

        const data = await response.json();
        allStudents = data.students;
        updateStats();
        renderStudents(allStudents);
    } catch (error) {
        console.error('Error loading students:', error);
        showError('Failed to load students');
    }
}

// Update Statistics
function updateStats() {
    const totalStudents = allStudents.length;
    const activeStudents = allStudents.filter(s => !s.is_admin).length;
    const adminCount = allStudents.filter(s => s.is_admin).length;
    
    // Calculate new this month (created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newThisMonth = allStudents.filter(s => {
        const createdDate = new Date(s.created_at);
        return createdDate >= thirtyDaysAgo;
    }).length;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('activeStudents').textContent = activeStudents;
    document.getElementById('newThisMonth').textContent = newThisMonth;
    document.getElementById('adminCount').textContent = adminCount;
}

// Render Students Table
function renderStudents(students) {
    if (students.length === 0) {
        studentsTableBody.innerHTML = `
            <tr class="no-data">
                <td colspan="8">No students found</td>
            </tr>
        `;
        return;
    }

    studentsTableBody.innerHTML = students.map(student => `
        <tr>
            <td>${student.student_id || '-'}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.batch || '-'}</td>
            <td>${student.program || '-'}</td>
            <td>${student.phone || '-'}</td>
            <td>
                <span class="badge ${student.is_admin ? 'admin' : 'student'}">
                    ${student.is_admin ? 'Admin' : 'Student'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editStudent(${student.id})">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                        Edit
                    </button>
                    <button class="btn btn-delete" onclick="confirmDelete(${student.id}, '${student.name}')">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Search Students
function searchStudents(query) {
    const filtered = allStudents.filter(student => {
        const searchStr = query.toLowerCase();
        return (
            student.name.toLowerCase().includes(searchStr) ||
            student.email.toLowerCase().includes(searchStr) ||
            (student.student_id && student.student_id.toLowerCase().includes(searchStr)) ||
            (student.batch && student.batch.toLowerCase().includes(searchStr)) ||
            (student.program && student.program.toLowerCase().includes(searchStr))
        );
    });
    renderStudents(filtered);
}

// Open Add Student Modal
function openAddStudentModal() {
    document.getElementById('modalTitle').textContent = 'Add New Student';
    document.getElementById('studentId').value = '';
    studentForm.reset();
    document.getElementById('studentPassword').required = true;
    studentModal.classList.add('active');
}

// Edit Student
function editStudent(id) {
    const student = allStudents.find(s => s.id === id);
    if (!student) return;

    document.getElementById('modalTitle').textContent = 'Edit Student';
    document.getElementById('studentId').value = student.id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentStudentId').value = student.student_id || '';
    document.getElementById('studentPassword').value = '';
    document.getElementById('studentPassword').required = false;
    document.getElementById('studentBatch').value = student.batch || '';
    document.getElementById('studentProgram').value = student.program || '';
    document.getElementById('studentPhone').value = student.phone || '';
    document.getElementById('studentAddress').value = student.address || '';
    document.getElementById('studentIsAdmin').checked = student.is_admin;

    studentModal.classList.add('active');
}

// Save Student
async function saveStudent(e) {
    e.preventDefault();

    const studentId = document.getElementById('studentId').value;
    const isEdit = !!studentId;

    const formData = {
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        student_id: document.getElementById('studentStudentId').value,
        batch: document.getElementById('studentBatch').value,
        program: document.getElementById('studentProgram').value,
        phone: document.getElementById('studentPhone').value,
        address: document.getElementById('studentAddress').value,
        is_admin: document.getElementById('studentIsAdmin').checked
    };

    const password = document.getElementById('studentPassword').value;
    if (password) {
        formData.password = password;
    }

    try {
        const url = isEdit 
            ? `/admin/students/${studentId}` 
            : `/admin/students`;
        
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            credentials: 'same-origin',
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to save student');
        }

        showSuccess(isEdit ? 'Student updated successfully' : 'Student created successfully');
        closeStudentModal();
        loadStudents();
    } catch (error) {
        console.error('Error saving student:', error);
        showError(error.message);
    }
}

// Confirm Delete
function confirmDelete(id, name) {
    deleteStudentId = id;
    document.getElementById('deleteStudentName').textContent = name;
    deleteModal.classList.add('active');
}

// Delete Student
async function deleteStudent() {
    if (!deleteStudentId) return;

    try {
        const response = await fetch(`/admin/students/${deleteStudentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            credentials: 'same-origin'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete student');
        }

        showSuccess('Student deleted successfully');
        closeDeleteModal();
        loadStudents();
    } catch (error) {
        console.error('Error deleting student:', error);
        showError(error.message);
    }
}

// Close Modals
function closeStudentModal() {
    studentModal.classList.remove('active');
    studentForm.reset();
    deleteStudentId = null;
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    deleteStudentId = null;
}

// Logout
async function logout() {
    try {
        await fetch('/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            credentials: 'same-origin'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}

// Show Messages
function showSuccess(message) {
    alert(message); // You can replace with a toast notification
}

function showError(message) {
    alert('Error: ' + message); // You can replace with a toast notification
}

// Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        searchStudents(e.target.value);
    });

    // Add Student
    addStudentBtn.addEventListener('click', openAddStudentModal);

    // Form Submit
    studentForm.addEventListener('submit', saveStudent);

    // Close Modals
    closeModalBtn.addEventListener('click', closeStudentModal);
    cancelBtn.addEventListener('click', closeStudentModal);
    closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    
    // Confirm Delete
    confirmDeleteBtn.addEventListener('click', deleteStudent);

    // Logout - sidebar button
    logoutBtn.addEventListener('click', logout);

    // User dropdown toggle
    const userInfoToggle = document.getElementById('userInfoToggle');
    const userDropdown = document.getElementById('userDropdown');
    const logoutDropdownBtn = document.getElementById('logoutDropdownBtn');

    userInfoToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Logout from dropdown
    logoutDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        logout();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        userDropdown.classList.remove('show');
    });

    // Close modal when clicking outside
    studentModal.addEventListener('click', (e) => {
        if (e.target === studentModal) {
            closeStudentModal();
        }
    });

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// Make functions globally accessible
window.editStudent = editStudent;
window.confirmDelete = confirmDelete;
