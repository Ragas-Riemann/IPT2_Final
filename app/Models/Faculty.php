<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'age',
        'gender',
        'email',
        'profile_image',
        'date_of_birth',
        'department_id',
    ];
}
