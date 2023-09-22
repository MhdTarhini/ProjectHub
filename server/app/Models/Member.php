<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;
    protected $appends = ['users'];
        public function team()
    {
        return $this->belongsTo(Team::class);
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
