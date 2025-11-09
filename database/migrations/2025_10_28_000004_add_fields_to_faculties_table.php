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
        Schema::table('faculties', function (Blueprint $table) {
            if (!Schema::hasColumn('faculties', 'age')) {
                $table->unsignedTinyInteger('age')->nullable()->after('department');
            }
            if (!Schema::hasColumn('faculties', 'gender')) {
                $table->enum('gender', ['Male', 'Female'])->nullable()->after('age');
            }
            if (!Schema::hasColumn('faculties', 'email')) {
                $table->string('email')->nullable()->after('gender');
            }
            if (!Schema::hasColumn('faculties', 'department_id')) {
                $table->foreignId('department_id')->nullable()->after('email')->constrained('departments')->nullOnDelete();
            }
            if (!Schema::hasColumn('faculties', 'course_id')) {
                $table->foreignId('course_id')->nullable()->after('department_id')->constrained('courses')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faculties', function (Blueprint $table) {
            if (Schema::hasColumn('faculties', 'course_id')) {
                $table->dropForeign(['course_id']);
                $table->dropColumn('course_id');
            }
            if (Schema::hasColumn('faculties', 'department_id')) {
                $table->dropForeign(['department_id']);
                $table->dropColumn('department_id');
            }
            if (Schema::hasColumn('faculties', 'email')) {
                $table->dropColumn('email');
            }
            if (Schema::hasColumn('faculties', 'gender')) {
                $table->dropColumn('gender');
            }
            if (Schema::hasColumn('faculties', 'age')) {
                $table->dropColumn('age');
            }
        });
    }
};
