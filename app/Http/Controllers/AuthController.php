<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Handle user login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'studentId' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Try to authenticate with email or student_id
        $credentials = [
            'password' => $request->password
        ];

        // Check if studentId is an email
        if (filter_var($request->studentId, FILTER_VALIDATE_EMAIL)) {
            $credentials['email'] = $request->studentId;
        } else {
            $credentials['student_id'] = $request->studentId;
        }

        // Attempt to find user
        $user = null;
        if (isset($credentials['email'])) {
            $user = User::where('email', $credentials['email'])->first();
        } else {
            $user = User::where('student_id', $credentials['student_id'])->first();
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Log the user in
        Auth::login($user, $request->rememberMe ?? false);

        // Create token for API authentication
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->student_id,
                'batch' => $user->batch,
                'program' => $user->program,
                'is_admin' => $user->is_admin,
            ],
            'token' => $token
        ]);
    }

    /**
     * Handle user registration
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'student_id' => 'required|string|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'batch' => 'nullable|string',
            'program' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'student_id' => $request->student_id,
            'password' => Hash::make($request->password),
            'batch' => $request->batch,
            'program' => $request->program,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->student_id,
                'batch' => $user->batch,
                'program' => $user->program,
            ],
            'token' => $token
        ], 201);
    }

    /**
     * Handle user logout
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        Auth::logout();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }

    /**
     * Password reset request
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Here you would typically send a password reset email
        // For now, we'll just return a success message

        return response()->json([
            'success' => true,
            'message' => 'Password reset link sent to your email'
        ]);
    }
}
