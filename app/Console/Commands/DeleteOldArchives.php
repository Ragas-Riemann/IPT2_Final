<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Student;
use App\Models\Faculty;
use Carbon\Carbon;

class DeleteOldArchives extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'archive:delete-old';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Permanently delete archived students and faculty that have been archived for more than 1 year';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $oneYearAgo = Carbon::now()->subYear();

        // Delete old archived students
        $oldStudents = Student::onlyTrashed()
            ->where('deleted_at', '<', $oneYearAgo)
            ->get();

        $studentsDeleted = 0;
        foreach ($oldStudents as $student) {
            $student->forceDelete(); // Permanently delete
            $studentsDeleted++;
        }

        // Delete old archived faculty
        $oldFaculty = Faculty::onlyTrashed()
            ->where('deleted_at', '<', $oneYearAgo)
            ->get();

        $facultyDeleted = 0;
        foreach ($oldFaculty as $faculty) {
            $faculty->forceDelete(); // Permanently delete
            $facultyDeleted++;
        }

        $this->info("Deleted {$studentsDeleted} archived student(s) and {$facultyDeleted} archived faculty member(s) that were archived more than 1 year ago.");

        return Command::SUCCESS;
    }
}
