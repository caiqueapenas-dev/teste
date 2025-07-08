<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.php');
    exit;
}

// Conexão com o banco
$host = "srv1438.hstgr.io";
$db_name = "u849382461_lead";
$username = "u849382461_carlos";
$password = '$r0ot_PHP';

$lead = null;
$id = $_GET['id'] ?? null;

if (!$id) {
    header('Location: dashboard.php');
    exit;
}

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES 'utf8'");

    // Se o formulário foi enviado (método POST)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $sql = "UPDATE leads SET name = :name, email = :email, phone = :phone, instagram = :instagram, field = :field WHERE id = :id";
        $stmt = $conn->prepare($sql);
        
        $stmt->bindParam(':name', $_POST['name']);
        $stmt->bindParam(':email', $_POST['email']);
        $stmt->bindParam(':phone', $_POST['phone']);
        $stmt->bindParam(':instagram', $_POST['instagram']);
        $stmt->bindParam(':field', $_POST['field']);
        $stmt->bindParam(':id', $id);
        
        $stmt->execute();
        
        // Redireciona para o dashboard após salvar
        header('Location: dashboard.php');
        exit;
    }

    // Se não for POST, busca os dados para preencher o formulário
    $stmt = $conn->prepare("SELECT * FROM leads WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $lead = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lead) {
        header('Location: dashboard.php');
        exit;
    }

} catch(PDOException $e) {
    die("Erro: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Editar Lead</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #111827; color: #e5e7eb; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 2rem; }
        .edit-container { width: 100%; max-width: 600px; background-color: #1f2937; padding: 2rem 3rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        h1 { color: #fff; margin-bottom: 1.5rem; text-align: center; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; color: #9ca3af; }
        input { width: 100%; box-sizing: border-box; padding: 0.75rem; border-radius: 6px; border: 1px solid #4b5563; background-color: #374151; color: #e5e7eb; font-size: 1rem; }
        .form-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        button, a { flex-grow: 1; text-align: center; padding: 0.75rem; border: none; border-radius: 6px; font-size: 1rem; font-weight: bold; cursor: pointer; text-decoration: none; }
        button { background-color: #2563eb; color: #fff; }
        a { background-color: #4b5563; color: #fff; }
    </style>
</head>
<body>
    <div class="edit-container">
        <h1>Editar Lead</h1>
        <form action="edit-lead.php?id=<?= htmlspecialchars($id) ?>" method="post">
            <div class="form-group">
                <label for="name">Nome:</label>
                <input type="text" id="name" name="name" value="<?= htmlspecialchars($lead['name']) ?>" required>
            </div>
            <div class="form-group">
                <label for="email">E-mail:</label>
                <input type="email" id="email" name="email" value="<?= htmlspecialchars($lead['email']) ?>" required>
            </div>
            <div class="form-group">
                <label for="phone">Telefone:</label>
                <input type="text" id="phone" name="phone" value="<?= htmlspecialchars($lead['phone']) ?>">
            </div>
            <div class="form-group">
                <label for="instagram">Instagram:</label>
                <input type="text" id="instagram" name="instagram" value="<?= htmlspecialchars($lead['instagram']) ?>">
            </div>
            <div class="form-group">
                <label for="field">Área de Atuação:</label>
                <input type="text" id="field" name="field" value="<?= htmlspecialchars($lead['field']) ?>">
            </div>
            <div class="form-actions">
                <a href="dashboard.php">Cancelar</a>
                <button type="submit">Salvar Alterações</button>
            </div>
        </form>
    </div>
</body>
</html>