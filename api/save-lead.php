<?php
// PERMITE QUE O SEU SITE REACT ACESSE ESTE SCRIPT
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// --- INFORMAÇÕES DO BANCO DE DADOS (Substitua pelos seus dados reais) ---
$host = "srv1438.hstgr.io";
$db_name = "u849382461_lead"; // ex: u849382461_leadfinal
$username = "u849382461_carlos";      // ex: u849382461_userfinal
$password = '$r0ot_PHP';        // ex: testefinal123

// --- CONEXÃO COM O BANCO ---
try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Se a conexão falhar, envia uma resposta de erro
    echo json_encode(array("message" => "Erro de conexão: " . $e->getMessage()));
    exit();
}

// --- CAPTURA E SALVAMENTO DOS DADOS ---

// Pega os dados JSON que o formulário enviou
$data = json_decode(file_get_contents("php://input"));

// Validação simples (verifica se os dados essenciais existem)
if (!isset($data->name) || !isset($data->email)) {
    http_response_code(400); // Código de erro "Bad Request"
    echo json_encode(array("message" => "Dados incompletos. Nome e e-mail são obrigatórios."));
    exit();
}

// Prepara o comando SQL para evitar injeção de SQL
$query = "INSERT INTO leads (name, email, phone, instagram, field, lgpd_accepted) 
          VALUES (:name, :email, :phone, :instagram, :field, :lgpd_accepted)";

$stmt = $conn->prepare($query);

// Limpa e associa os dados recebidos às variáveis do comando SQL
$stmt->bindParam(':name', $data->name);
$stmt->bindParam(':email', $data->email);
$stmt->bindParam(':phone', $data->phone);
$stmt->bindParam(':instagram', $data->instagram);
$stmt->bindParam(':field', $data->field);
$stmt->bindParam(':lgpd_accepted', $data->lgpdAccepted, PDO::PARAM_BOOL);

// Executa o comando e envia uma resposta de sucesso ou erro
if($stmt->execute()){
    http_response_code(200); // Código de sucesso "OK"
    echo json_encode(array("message" => "Lead salvo com sucesso via PHP!"));
} else{
    http_response_code(503); // Código de erro "Service Unavailable"
    echo json_encode(array("message" => "Não foi possível salvar o lead."));
}
?>