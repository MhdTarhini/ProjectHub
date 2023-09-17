<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branche extends Model
{
    use HasFactory;
    protected $appends = ['members','project'];

       public function getMembersAttribute()
    {
        return $this->hasMany(BrancheMember::class, 'branche_id');
    }
       public function members()
    {
        return $this->hasMany(BrancheMember::class, 'branche_id');
    }
       public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
       public function getProjectAttribute()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
