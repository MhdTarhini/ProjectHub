<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;

class FileController extends Controller
{
        public function uploadFile(Request $request)
    {
        $file = new File();
        return response()->json([
            'status' => 'success',
            'comment' => '',
        ]);
    }
}
