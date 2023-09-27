<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;

class OpenAIController extends Controller
{
        function prompt(){

            $data="{'Slab': [{'prop': {'L,W': (55.4, 68.3), 'Area': 2457.283}, 'quantity': 1}], 'Opening': [{'prop': {'L,W': (3.0, 4.9), 'Area': 14.7}, 'quantity': 1}, {'prop': {'L,W': (4.6, 2.2), 'Area': 10.12}, 'quantity': 1}, {'prop': {'L,W': (2.8, 2.8), 'Area': 7.84}, 'quantity': 1}], 'Columns': [{'prop': {'L,W': (0.6, 0.2), 'Area': 0.12}, 'quantity': 69}, {'prop': {'L,W': (0.2, 0.6), 'Area': 0.12}, 'quantity': 2}], 'Shear wall': [{'prop': {'length': 2.8}, 'quantity': 1}, {'prop': {'length': 5.5}, 'quantity': 1}, {'prop': {'length': 3.0}, 'quantity': 1}, {'prop': {'length': 5.0}, 'quantity': 1}, {'prop': {'length': 0.25}, 'quantity': 1}, {'prop': {'length': 3.2}, 'quantity': 3}, {'prop': {'length': 5.1}, 'quantity': 1}, {'prop': {'length': 2.4}, 'quantity': 1}, {'prop': {'length': 4.8}, 'quantity': 1}, {'prop': {'length': 3.5}, 'quantity': 1}, {'prop': {'length': 7.0}, 'quantity': 4}, {'prop': {'length': 1.6}, 'quantity': 1}, {'prop': {'length': 1.0}, 'quantity': 2}]}";

        $prompt = 'Analyze and summarize the following construction data';
        $prompt .= ".\n $data";
        $prompt .= "\nI provide you the data include the key as the objects name and inside it each object with length and width or just length plus the area of it , where you meantion the quatity only if bigger then 1";
        $prompt .= "\nI want to stucture this data by key then the object as the only the parent key on bold then \n the object props";
        $prompt .= "\ndo not return any text or explanation or notes before or after.";

        $result = OpenAI::completions()->create([
            'max_tokens'=>1024,
            'model' => 'text-davinci-003',
            'prompt' => $prompt,
        ]);
    
        echo $result['choices'][0]['text'];;

}
}
