<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BranchMember extends Model
{
    use HasFactory;
    protected $appends = ['users','branch'];
        public function getBranchAttribute()
    {
        return $this->belongsTo(Branch::class, 'branche_id');
    }
        public function getUsersAttribute()
    {
        return $this->belongsTo(User::class , "user_id");
    }
        public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
