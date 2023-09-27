<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;
use OpenAI\Laravel\Facades\OpenAI as FacadesOpenAI;

class OpenAIController extends Controller
{
        function prompt(Request $request){

       $prompt = "Given the following construction data:\n";
       $prompt .= "$request->data\n";
       $prompt .= "format the data as a list of point describing the floor base on plan include:\n";
       $prompt .= "the main object name as a subtitle";
       $prompt .= "meantion the parent key only one time and don't be repeative ";
       $prompt .= "then list the props data L*W m2 or L m (only numbers), then Area and qunatity (Only If the quantity is greater than 1)\n";
       $prompt .= "Do not return the original data or add any extra notes or explanations.";

        $result = FacadesOpenAI::completions()->create([
            'max_tokens'=>1024,
            'model' => 'text-davinci-003',
            'prompt' => $prompt,
        ]);

        return response()->json([
            "status"=>"success",
            'data'=>$result['choices'][0]['text']
        ]);
    

}
}
