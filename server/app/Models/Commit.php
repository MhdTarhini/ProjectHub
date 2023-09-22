<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commit extends Model
{
    use HasFactory;
    //  protected $appends = ['user','file'];
        public function user()
    {
        return $this->belongsTo(User::class);
    }
        public function file()
    {
        return $this->belongsTo(File::class);
    }

}
