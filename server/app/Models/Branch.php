<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'project_id'];
    protected $appends = ['members','project'];

       public function getMembersAttribute()
    {
        return $this->hasMany(BranchMember::class, 'branche_id');
    }
       public function members()
    {
        return $this->hasMany(BranchMember::class, 'branche_id');
    }
       public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
       public function getProjectAttribute()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
        public function usermembers()
    {
        return $this->belongsToMany(User::class, 'branch_members', 'branche_id', 'user_id')
            ->withTimestamps();
    }
}
