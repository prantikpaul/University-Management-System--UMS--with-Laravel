<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@seu.edu',
            'student_id' => 'ADMIN001',
            'password' => Hash::make('admin123'),
            'batch' => '2024',
            'program' => 'Administration',
            'is_admin' => true,
        ]);

        // Create sample student user
        User::create([
            'name' => 'John Doe',
            'email' => 'john@seu.edu',
            'student_id' => '2024001',
            'password' => Hash::make('student123'),
            'batch' => '2024',
            'program' => 'BSc in Computer Science',
            'is_admin' => false,
        ]);
    }
}
