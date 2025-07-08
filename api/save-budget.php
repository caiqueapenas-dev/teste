<?php
// PERMITE QUE O SEU SITE REACT ACESSE ESTE SCRIPT
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// --- INFORMAÇÕES DO BANCO DE DADOS (Substitua pelos seus dados reais) ---
$host = "srv1438.hstgr.io";
$db_name = "u849382461_lead";
$username = "u849382461_carlos";
$password = '$r0ot_PHP';

// --- CONEXÃO COM O BANCO ---
try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(array("message" => "Erro de conexão: " . $e->getMessage()));
    exit();
}

// --- CAPTURA E SALVAMENTO DOS DADOS ---
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->budgetDetails)) {
    http_response_code(400);
    echo json_encode(array("message" => "Dados incompletos. E-mail e detalhes do orçamento são obrigatórios."));
    exit();
}

// Query para inserir no banco de dados.
// Crie uma tabela chamada 'budgets' com as colunas: id, user_email, budget_details
$query = "INSERT INTO budgets (user_email, budget_details) VALUES (:email, :budgetDetails)";

$stmt = $conn->prepare($query);

// Limpa e associa os dados
$stmt->bindParam(':email', $data->email);
$stmt->bindParam(':budgetDetails', $data->budgetDetails);

if($stmt->execute()){
    http_response_code(200);
    echo json_encode(array("message" => "Orçamento salvo com sucesso!"));
} else{
    http_response_code(503);
    echo json_encode(array("message" => "Não foi possível salvar o orçamento."));
}
?>