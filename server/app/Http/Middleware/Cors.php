<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        
        // header('Access-Control-Allow-Origin:  http://localhost:3000');
        // header('Access-Control-Allow-Headers:  Content-Type, X-Auth-Token, Authorization, Origin');
        // header('Access-Control-Allow-Methods:  POST, PUT, DELETE, GET, OPTIONS');
        return $next($request);
        // ->header('Access-Control-Allow-Origin', '*');
    }
}
