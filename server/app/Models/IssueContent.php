<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IssueContent extends Model
{
    use HasFactory;
    public function issues()
    {
        return $this->belongsTo(Issue::class,"issue_id","id");
    }
    public function users()
    {
        return $this->belongsTo(User::class,"user_id","id");
    }
}
