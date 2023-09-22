<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Mailables\Content;

class Issue extends Model
{
    use HasFactory;
    public function contents()
    {
        return $this->hasMany(IssueContent::class , "issues_id");
    }
    public function members()
    {
        return $this->hasMany(IssueMembers::class , "issues_id");
    }
    public function comments()
    {
        return $this->hasMany(Comment::class , "issue_id");
    }
}
