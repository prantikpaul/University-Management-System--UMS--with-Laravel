<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test student user
        User::create([
            'name' => 'Prantik Paul',
            'email' => 'prantik@seijums.edu',
            'student_id' => '2024000010072',
            'password' => Hash::make('password'),
            'batch' => '19',
            'program' => 'BSc in CSE (Diploma Students)',
        ]);

        // Create another test user
        User::create([
            'name' => 'John Doe',
            'email' => 'john@seijums.edu',
            'student_id' => '2024000010073',
            'password' => Hash::make('password'),
            'batch' => '20',
            'program' => 'BSc in CSE',
        ]);
    }
}
