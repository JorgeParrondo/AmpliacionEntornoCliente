<?php
 
 include_once __DIR__ . 'config.php';
//Conexion y acceso a la base de datos mediante Patrón Singleton 
 class AccesoDatos{
    private static $modelo = null;
    private $dbh = null;

    public static function getModelo(){
        if (self::$modelo == null){
            self::$modelo = new AccesoDatos();
        }
        return self::$modelo;
    }

    public static function closeModelo(){
        if (self::$modelo != null){
            $obj = self::$modelo;
            $obj->dbh = null;
            self::$modelo = null;
        }
    }

    //Configuración de la base de datos
     public function __construct() {
        try {
            $dns = 'mysql:host='.SERVER_DB.';dbname='.DATABASE_NAME;
            $this->dbh = new PDO($dns, DB_USER, '');
            $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Error de conexión con la base de datos: ".$e->getMessage();
            exit();
        }
    }

    //evitar clonar objetos(PATRON SINGLETON)
     public function __clone()
    { 
        trigger_error('La clonación no permitida', E_USER_ERROR); 
    }
 }
?>