<?php
// --- INFORMAÇÕES DO BANCO DE DADOS (Use os mesmos dados dos outros scripts) ---
$host = "srv1438.hstgr.io";
$db_name = "u849382461_lead";
$username = "u849382461_carlos";
$password = '$r0ot_PHP';

$leads = []; // Inicializa a variável para evitar erros

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES 'utf8'");

    // Query SQL para juntar as tabelas 'leads' e 'budgets'
    // Ela pega todos os leads e, se houver um orçamento correspondente, o anexa.
    $query = "
        SELECT
            l.name,
            l.email,
            l.phone,
            l.instagram,
            l.field,
            b.budget_details,
            b.created_at AS budget_date
        FROM
            leads l
        LEFT JOIN
            budgets b ON l.email = b.user_email COLLATE utf8mb4_unicode_ci
        ORDER BY
            l.id DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch(PDOException $e) {
    // Em caso de erro, exibe uma mensagem simples na página
    die("Erro ao conectar ou consultar o banco de dados: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Leads</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #111827; /* Fundo escuro */
            color: #e5e7eb; /* Texto claro */
            margin: 0;
            padding: 2rem;
        }
        .container {
            max-width: 1200px;
            margin: auto;
        }
        h1 {
            color: #ffffff;
            border-bottom: 2px solid #374151;
            padding-bottom: 1rem;
        }
        .lead-card {
            background-color: #1f2937; /* Cor do card */
            border: 1px solid #374151; /* Borda do card */
            border-radius: 8px;
            margin-bottom: 1.5rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .lead-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #374151;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
        }
        .lead-header h2 {
            margin: 0;
            color: #ffffff;
            font-size: 1.25rem;
        }
        .lead-info p, .budget-details {
            margin: 0.5rem 0;
            line-height: 1.6;
        }
        .lead-info strong {
            color: #9ca3af; /* Cinza mais claro para os títulos */
            display: inline-block;
            width: 100px;
        }
        .budget-container {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px dashed #4b5563;
        }
        .budget-container h3 {
            color: #60a5fa; /* Azul para o título do orçamento */
            margin-top: 0;
        }
        .budget-details {
            background-color: #111827;
            padding: 1rem;
            border-radius: 6px;
            white-space: pre-wrap; /* Essencial para manter as quebras de linha */
            font-family: monospace;
            font-size: 0.9rem;
        }
        .no-budget {
            color: #6b7280; /* Cor para texto "sem orçamento" */
            font-style: italic;
        }
        .empty-state {
            text-align: center;
            padding: 3rem;
            background-color: #1f2937;
            border-radius: 8px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Dashboard de Leads e Orçamentos</h1>

        <?php if (empty($leads)): ?>
            <div class="empty-state">
                <p>Nenhum lead encontrado no banco de dados ainda.</p>
            </div>
        <?php else: ?>
            <?php foreach ($leads as $lead): ?>
                <div class="lead-card">
                    <div class="lead-header">
                        <h2><?= htmlspecialchars($lead['name']) ?></h2>
                        <span class="email"><?= htmlspecialchars($lead['email']) ?></span>
                    </div>
                    <div class="lead-info">
                        <p><strong>Telefone:</strong> <?= htmlspecialchars($lead['phone']) ?></p>
                        <p><strong>Instagram:</strong> <?= htmlspecialchars($lead['instagram']) ?></p>
                        <p><strong>Área:</strong> <?= htmlspecialchars($lead['field']) ?></p>
                    </div>

                    <div class="budget-container">
                        <h3>Detalhes do Orçamento</h3>
                        <?php if (!empty($lead['budget_details'])): ?>
                            <div class="budget-details">
                                <?= nl2br(htmlspecialchars($lead['budget_details'])) ?>
                            </div>
                            <p style="font-size: 0.8rem; color: #6b7280; text-align: right; margin-top: 0.5rem;">
                                Salvo em: <?= date('d/m/Y H:i', strtotime($lead['budget_date'])) ?>
                            </p>
                        <?php else: ?>
                            <p class="no-budget">Este lead ainda não finalizou um orçamento.</p>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>

    </div>

</body>
</html>