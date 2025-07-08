<?php
// Habilita a exibição de erros para depuração (remova em produção)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// PERMITE QUE O SEU SITE REACT ACESSE ESTE SCRIPT
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Trata a requisição OPTIONS (pre-flight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

// --- INFORMAÇÕES DO BANCO DE DADOS (Confira se estão corretas) ---
$host = "srv1438.hstgr.io";
$db_name = "u849382461_lead";
$username = "u849382461_carlos";
$password = '$r0ot_PHP';
$table_name = "budgets"; // Nome da tabela

// --- CONEXÃO COM O BANCO ---
try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES 'utf8'");
} catch(PDOException $e) {
    http_response_code(500);
    // Nunca exponha a senha ou detalhes sensíveis no erro em produção
    echo json_encode(array("message" => "Erro de Conexão com o Banco de Dados.", "error" => $e->getMessage()));
    exit();
}

// --- LÓGICA PRINCIPAL ---
try {
    // Captura os dados da requisição
    $data = json_decode(file_get_contents("php://input"));

    // Validação básica dos dados
    if (!isset($data->email) || empty($data->email) || !isset($data->budgetDetails) || empty($data->budgetDetails)) {
        http_response_code(400); // Bad Request
        echo json_encode(array("message" => "Dados incompletos. E-mail e detalhes do orçamento são obrigatórios."));
        exit();
    }

    // Query para inserir no banco de dados.
    // A tabela deve ter as colunas: id (INT, AUTO_INCREMENT, PRIMARY KEY), user_email (VARCHAR), budget_details (TEXT), created_at (TIMESTAMP)
    $query = "INSERT INTO " . $table_name . " (user_email, budget_details) VALUES (:email, :budgetDetails)";

    $stmt = $conn->prepare($query);

    // Limpa e associa os dados para evitar SQL Injection
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':budgetDetails', $data->budgetDetails);

    if($stmt->execute()){
        http_response_code(200); // OK
        echo json_encode(array("message" => "Orçamento salvo com sucesso no banco de dados!"));
    } else{
        http_response_code(500); // Internal Server Error
        echo json_encode(array("message" => "Não foi possível executar a query de inserção."));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Ocorreu um erro no servidor ao tentar salvar o orçamento.",
        "error" => $e->getMessage()
    ));
}
?>