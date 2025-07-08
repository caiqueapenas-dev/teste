<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.php');
    exit;
}

// Verifica se o ID foi passado
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header('Location: dashboard.php');
    exit;
}

$id = $_GET['id'];

// Conexão com o banco
$host = "srv1438.hstgr.io";
$db_name = "u849382461_lead";
$username = "u849382461_carlos";
$password = '$r0ot_PHP';

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Primeiro, pegue o email do lead antes de deletá-lo
    $stmt = $conn->prepare("SELECT email FROM leads WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $lead = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($lead) {
        $email = $lead['email'];

        // Deleta o lead da tabela 'leads'
        $stmt_delete_lead = $conn->prepare("DELETE FROM leads WHERE id = :id");
        $stmt_delete_lead->bindParam(':id', $id);
        $stmt_delete_lead->execute();

        // Deleta o orçamento associado da tabela 'budgets'
        $stmt_delete_budget = $conn->prepare("DELETE FROM budgets WHERE user_email = :email");
        $stmt_delete_budget->bindParam(':email', $email);
        $stmt_delete_budget->execute();
    }

} catch(PDOException $e) {
    die("Erro ao deletar o lead: " . $e->getMessage());
}

// Redireciona de volta para o dashboard
header('Location: dashboard.php');
exit;
?>