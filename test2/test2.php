<?php

echo "Masukkan Jumlah Player: ";
$jumlahPemain = trim(fgets(STDIN));


for($i=1; $i<=$jumlahPemain; $i++){
    echo "Masukkan Score Masing-Masing: ";
    $playersScores[] = trim(fgets(STDIN));

}

echo "Masukkan Jumlah Permainan yang dimainkan GITS: ";
$jumlahGits = trim(fgets(STDIN));

for($j=1; $j<=$jumlahGits; $j++){
    echo "Masukkan Poin GITS: ";
    $gitsScores[] = trim(fgets(STDIN));
    
}
$tests = array(
    'playersScores' => $playersScores,
    'gitsScores' => $gitsScores
);


function getRankedBoard(array $playersScores, array $gitsScores) {
    $result = [];
    $processedPlayersScores = [];
    $prevScore = null;

    // process players scores
    foreach($playersScores as $score) {
        $score = (int) $score;

        if ($prevScore === $score) {
            continue;
        }
        
        $processedPlayersScores[] = $score;
        $prevScore = $score;
    }

    $rightBorder = count($processedPlayersScores) - 1;
    $gitsPlace = count($processedPlayersScores)  + 1;
    $addPlaceToResult = false;

    for ($i = 0; $i < count($gitsScores); $i++) {
        for ($j = $rightBorder; $j >= 0; $j--) {
            if ($processedPlayersScores[$j] > (int) $gitsScores[$i]) {
                $result[] = $gitsPlace;
                $addPlaceToResult = false;

                break;
            }

            $gitsPlace--;
            $addPlaceToResult = true;
            $rightBorder = $j - 1;
        }

        if ($addPlaceToResult) {
            $result[] = $gitsPlace;
        }
    }

    return $result;
}

// $baru = getRankedBoard($tests['playersScores'], $tests['gitsScores']);
$result = implode(' ', getRankedBoard($tests['playersScores'], $tests['gitsScores']));

echo "Berikut Rankingnya cuy\n";

echo $result;

 



?>