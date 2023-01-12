<?php  
function Sequence($number){
      
        return ($number*($number+1))/2+1;
}
  
echo "Selamat Datang di program The Lazy Carterer's Sequence\n
Masukkan Angka: ";
// echo "Masukkan angka deret: ";
$number = trim(fgets(STDIN));

for ($counter = 0; $counter<$number; $counter++){  
    echo Sequence($counter),'-';
}

echo "\n\n------Terima Kasih------";
?>

