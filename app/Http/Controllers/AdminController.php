<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    /**
     * Get all students
     */
    public function getStudents(Request $request)
    {
        // Check if user is admin
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $students = User::select('id', 'name', 'email', 'student_id', 'batch', 'program', 'phone', 'address', 'is_admin', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['students' => $students]);
    }

    /**
     * Create a new student
     */
    public function createStudent(Request $request)
    {
        // Check if user is admin
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'student_id' => 'required|string|unique:users,student_id',
            'password' => 'required|string|min:6',
            'batch' => 'nullable|string',
            'program' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'is_admin' => 'boolean'
        ]);

        $student = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'student_id' => $request->student_id,
            'password' => Hash::make($request->password),
            'batch' => $request->batch,
            'program' => $request->program,
            'phone' => $request->phone,
            'address' => $request->address,
            'is_admin' => $request->is_admin ?? false,
        ]);

        return response()->json([
            'message' => 'Student created successfully',
            'student' => $student
        ], 201);
    }

    /**
     * Update a student
     */
    public function updateStudent(Request $request, $id)
    {
        // Check if user is admin
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'student_id' => 'sometimes|required|string|unique:users,student_id,' . $id,
            'password' => 'nullable|string|min:6',
            'batch' => 'nullable|string',
            'program' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'is_admin' => 'boolean'
        ]);

        $updateData = $request->only(['name', 'email', 'student_id', 'batch', 'program', 'phone', 'address', 'is_admin']);
        
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $student->update($updateData);

        return response()->json([
            'message' => 'Student updated successfully',
            'student' => $student
        ]);
    }

    /**
     * Delete a student
     */
    public function deleteStudent(Request $request, $id)
    {
        // Check if user is admin
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = User::findOrFail($id);
        
        // Prevent deleting self
        if ($student->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete yourself'], 403);
        }

        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully'
        ]);
    }
}
