<?php

namespace App\Transformers;

class HistoryTransformer
{
    public function transform($row)
    {
        return [
            'uid' => $row[0],
            'type' => $row[1],
            'client' => $row[2],
            'account' => $row[3],
            'via' => $row[4],
            'start' => $row[5],
            'wait' => $row[6],
            'duration' => $row[7],
            'record' => $row[8]
        ];
    }

}