<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\StudentController;

Route::apiResource('students', StudentController::class);
