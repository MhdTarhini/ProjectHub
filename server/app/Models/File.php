<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;
    protected $appends = ['user','project'];
        public function user()
    {
        return $this->belongsTo(User::class);
    }
        public function project()
    {
        return $this->belongsTo(Project::class);
    }
        public function branche()
    {
        return $this->belongsTo(Branch::class,"branche_id");
    }
        public function getUserAttribute()
    {
        return $this->belongsTo(User::class)->first();
    }
         public function getProjectAttribute()
    {
        return $this->belongsTo(Project::class)->first();
    }
        public function commits()
    {
        return $this->hasMany(Commit::class, 'file_id', 'id');
    }
    
}
