<?php
// Inicia a sessão
session_start();

// Verifica se o usuário está logado, senão redireciona para a página de login
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.php');
    exit;
}

// Lógica para buscar os dados do banco
$host = "srv1438.hstgr.io";
$db_name = "u849382461_lead";
$username = "u849382461_carlos";
$password = '$r0ot_PHP';
$leads = [];

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES 'utf8'");
    
    // 👇 ATUALIZAÇÃO AQUI: Adicionamos "l.id" à consulta
    $query = "SELECT l.id, l.name, l.email, l.phone, l.instagram, l.field, b.budget_details, b.created_at AS budget_date FROM leads l LEFT JOIN budgets b ON l.email = b.user_email COLLATE utf8mb4_unicode_ci ORDER BY l.id DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Erro ao conectar ou consultar o banco de dados: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Dashboard de Leads</title>
    <style>
        /* Cole todo o seu CSS anterior aqui */
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #111827; color: #e5e7eb; margin: 0; padding: 2rem; }
        .header { display: flex; justify-content: space-between; align-items: center; }
        .container { max-width: 1200px; margin: auto; }
        h1 { color: #ffffff; border-bottom: 2px solid #374151; padding-bottom: 1rem; }
        a#logout-btn { background-color: #991b1b; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .lead-card { background-color: #1f2937; border: 1px solid #374151; border-radius: 8px; margin-bottom: 1.5rem; padding: 1.5rem; }
        .lead-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #374151; padding-bottom: 1rem; margin-bottom: 1rem; }
        .lead-header h2 { margin: 0; color: #ffffff; font-size: 1.25rem; }
        .lead-info p { margin: 0.5rem 0; line-height: 1.6; }
        .lead-info strong { color: #9ca3af; display: inline-block; width: 100px; }
        .budget-container { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed #4b5563; }
        .budget-container h3 { color: #60a5fa; margin-top: 0; }
        .budget-details { background-color: #111827; padding: 1rem; border-radius: 6px; white-space: pre-wrap; font-family: monospace; font-size: 0.9rem; }
        .no-budget { color: #6b7280; font-style: italic; }
        .empty-state { text-align: center; padding: 3rem; background-color: #1f2937; border-radius: 8px; }
        /* 👇 NOVOS ESTILOS PARA OS BOTÕES 👇 */
        .card-actions { margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: flex-end; }
        .action-btn { padding: 0.5rem 1rem; text-decoration: none; color: white; border-radius: 6px; font-weight: bold; font-size: 0.9rem; }
        .edit-btn { background-color: #2563eb; }
        .delete-btn { background-color: #dc2626; }
    </style>
</head>
<body>

    <div class="container">
        <div class="header"><h1>Dashboard de Leads</h1><a href="logout.php" id="logout-btn">Sair</a></div>

        <?php if (empty($leads)): ?>
            <div class="empty-state"><p>Nenhum lead encontrado.</p></div>
        <?php else: ?>
            <?php foreach ($leads as $lead): ?>
                <div class="lead-card">
                    <div class="lead-header"><h2><?= htmlspecialchars($lead['name']) ?></h2><span><?= htmlspecialchars($lead['email']) ?></span></div>
                    <div class="lead-info">
                        <p><strong>Telefone:</strong> <?= htmlspecialchars($lead['phone']) ?></p>
                        <p><strong>Instagram:</strong> <?= htmlspecialchars($lead['instagram']) ?></p>
                        <p><strong>Área:</strong> <?= htmlspecialchars($lead['field']) ?></p>
                    </div>
                    <div class="budget-container">
                        <h3>Detalhes do Orçamento</h3>
                        <?php if (!empty($lead['budget_details'])): ?>
                            <div class="budget-details"><?= nl2br(htmlspecialchars($lead['budget_details'])) ?></div>
                        <?php else: ?>
                            <p class="no-budget">Este lead ainda não finalizou um orçamento.</p>
                        <?php endif; ?>
                    </div>
                    
                    <div class="card-actions">
                        <a href="edit-lead.php?id=<?= $lead['id'] ?>" class="action-btn edit-btn">Editar</a>
                        <a href="delete-lead.php?id=<?= $lead['id'] ?>" class="action-btn delete-btn" onclick="return confirm('Tem certeza que deseja excluir este lead? Isso também removerá o orçamento associado.');">Excluir</a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    
    </body>
</html>