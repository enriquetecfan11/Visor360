<?php
if ($_FILES['imagen']) {
  $carpeta = 'assets/';
  $archivo = basename($_FILES['imagen']['name']);
  $ruta = $carpeta . $archivo;
  move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta);
}
?>
