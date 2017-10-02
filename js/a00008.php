<?php
    header("Content-Type:text/html;charset=utf-8");
    $SearchKey=$_GET['SearchKey'];

    $db_host ="localhost";
    $db_name = "travel";
    $db_username = "root";
    $db_password = "";
    $link = mysqli_connect($db_host, $db_username, $db_password) 
       or die("無法建立連接" . mysqli_connect_error() 
      . ":" . mysqli_connect_error() . "<br>");
    mysqli_set_charset($link,"utf8");
    mysqli_select_db($link, $db_name)
        or die ("無法開啟 資料庫: " . mysqli_error($link));

    $sql = "SELECT * "
        . "FROM store "
      // . "WHERE label = '" . $SearchKey . "'";
        . "WHERE label LIKE '%" . $SearchKey . "%'";
    $result = mysqli_query($link, $sql);

    while ($row = mysqli_fetch_assoc($result)){
        echo $row['stoName'] . ", 店家!<br>";
    }
  ?>