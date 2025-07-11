<?php
// Inicia a sessão
session_start();

// Verifica se o usuário está logado, senão redireciona para a página de login
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.php');
    exit;
}

// Configurações do banco de dados
$host = "srv1438.hstgr.io";
$db_name = "u849382461_lead";
$username = "u849382461_carlos";
$password = '$r0ot_PHP';
$leads = [];

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES 'utf8'");

    // Consulta SQL com GROUP_CONCAT para agrupar os orçamentos
    $query = "
        SELECT 
            l.id, l.name, l.email, l.phone, l.instagram, l.field,
            GROUP_CONCAT(b.budget_details ORDER BY b.created_at DESC SEPARATOR '|||') as all_budgets,
            GROUP_CONCAT(b.created_at ORDER BY b.created_at DESC SEPARATOR '|||') as all_dates
        FROM 
            leads l
        LEFT JOIN 
            budgets b ON l.email = b.user_email
        GROUP BY
            l.email
        ORDER BY 
            MAX(l.id) DESC
    ";
    
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
        /* Seus estilos CSS, com adições para o <details> e <summary> */
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
        
        /* Estilos para o collapse */
        .budget-container { margin-top: 1.5rem; }
        .budget-container summary {
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            color: #60a5fa;
            padding: 0.5rem 0;
            border-top: 1px dashed #4b5563;
            padding-top: 1.5rem;
            outline: none; /* Remove o contorno ao clicar */
        }
        .budget-container summary::marker, 
        .budget-container summary::-webkit-details-marker {
            display: none; /* Esconde a seta padrão */
        }
        .budget-container summary:before {
            content: '▶ '; /* Adiciona uma seta personalizada */
            font-size: 0.8em;
            margin-right: 8px;
        }
        .budget-container[open] summary:before {
            content: '▼ '; /* Muda a seta quando aberto */
        }
        .budgets-list {
            padding-top: 1rem;
        }
        .budget-item { border: 1px solid #374151; border-radius: 6px; margin-bottom: 1rem; overflow: hidden; }
        .budget-item:last-child { margin-bottom: 0; }
        .budget-date { font-size: 0.8rem; color: #9ca3af; background-color: #374151; padding: 0.5rem 1rem; }
        .budget-details { background-color: #111827; padding: 1rem; white-space: pre-wrap; font-family: monospace; font-size: 0.9rem; }
        .no-budget { color: #6b7280; font-style: italic; border-top: 1px dashed #4b5563; padding-top: 1.5rem; }
        .empty-state { text-align: center; padding: 3rem; background-color: #1f2937; border-radius: 8px; }
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
                    <div class="lead-header">
                        <h2><?= htmlspecialchars($lead['name']) ?></h2>
                        <span><?= htmlspecialchars($lead['email']) ?></span>
                    </div>
                    <div class="lead-info">
                        <p><strong>Telefone:</strong> <?= htmlspecialchars($lead['phone']) ?></p>
                        <p><strong>Instagram:</strong> <?= htmlspecialchars($lead['instagram']) ?></p>
                        <p><strong>Área:</strong> <?= htmlspecialchars($lead['field']) ?></p>
                    </div>
                    
                    <?php
                        $budgets = $lead['all_budgets'] ? explode('|||', $lead['all_budgets']) : [];
                        $dates = $lead['all_dates'] ? explode('|||', $lead['all_dates']) : [];
                    ?>

                    <?php if (!empty($budgets)): ?>
                        <details class="budget-container">
                            <summary>Ver Histórico de Orçamentos (<?= count($budgets) ?>)</summary>
                            <div class="budgets-list">
                                <?php foreach ($budgets as $index => $budget_detail): ?>
                                    <div class="budget-item">
                                        <p class="budget-date">Enviado em: <?= htmlspecialchars(date('d/m/Y H:i', strtotime($dates[$index]))) ?></p>
                                        <div class="budget-details"><?= nl2br(htmlspecialchars($budget_detail)) ?></div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </details>
                    <?php else: ?>
                        <p class="no-budget">Este lead ainda não finalizou um orçamento.</p>
                    <?php endif; ?>
                    
                    <div class="card-actions">
                        <a href="edit-lead.php?id=<?= $lead['id'] ?>" class="action-btn edit-btn">Editar</a>
                        <a href="delete-lead.php?id=<?= $lead['id'] ?>" class="action-btn delete-btn" onclick="return confirm('Tem certeza que deseja excluir este lead? Isso também removerá TODOS os orçamentos associados a este e-mail.');">Excluir</a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    
</body>
</html>