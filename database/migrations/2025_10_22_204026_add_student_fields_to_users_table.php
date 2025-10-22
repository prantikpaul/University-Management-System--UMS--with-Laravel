<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'student_id')) {
                $table->string('student_id')->unique()->after('email');
            }
            if (!Schema::hasColumn('users', 'batch')) {
                $table->string('batch')->nullable()->after('student_id');
            }
            if (!Schema::hasColumn('users', 'program')) {
                $table->string('program')->nullable()->after('batch');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('program');
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('phone');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['student_id', 'batch', 'program', 'phone', 'address']);
        });
    }
};
