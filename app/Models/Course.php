<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'status', // Open/Closed
        'enrolled_count',
        'department_id',
    ];

    /**
     * Get the department that owns the course
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
