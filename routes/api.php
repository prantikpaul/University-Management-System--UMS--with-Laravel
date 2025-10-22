<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/students', [AdminController::class, 'getStudents']);
        Route::post('/students', [AdminController::class, 'createStudent']);
        Route::put('/students/{id}', [AdminController::class, 'updateStudent']);
        Route::delete('/students/{id}', [AdminController::class, 'deleteStudent']);
    });
});
