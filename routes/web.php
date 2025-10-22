<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return view('welcome');
});

// View routes
Route::get('/login', function () {
    return view('login');
});

Route::get('/index', function () {
    return view('index');
});

Route::get('/admin', function () {
    return view('admin');
});

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
