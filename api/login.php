<?php
// Inicia a sessão
session_start();

// Se o usuário já estiver logado, redireciona para o dashboard
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    header('Location: dashboard.php');
    exit;
}

// Credenciais corretas (substitua pelas suas)
$correct_username = 'admin';
$correct_password = '$r0ot_PHP/h0m3'; // Troque por uma senha forte

$error_message = '';

// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Verifica as credenciais
    if ($username === $correct_username && $password === $correct_password) {
        // Sucesso! Armazena dados na sessão
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username;
        $_SESSION['last_activity'] = time(); // Armazena o tempo da última atividade

        // Redireciona para o dashboard
        header('Location: dashboard.php');
        exit;
    } else {
        // Falha no login
        $error_message = 'Nome de usuário ou senha incorretos.';
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Login - Dashboard</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #111827; color: #e5e7eb; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .login-container { background-color: #1f2937; padding: 2rem 3rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-align: center; }
        h1 { color: #fff; margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1rem; text-align: left; }
        label { display: block; margin-bottom: 0.5rem; color: #9ca3af; }
        input { width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid #4b5563; background-color: #374151; color: #e5e7eb; font-size: 1rem; }
        button { width: 100%; padding: 0.75rem; border: none; border-radius: 6px; background-color: #2563eb; color: #fff; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background-color 0.2s; }
        button:hover { background-color: #1d4ed8; }
        .error { color: #f87171; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>Acesso ao Dashboard</h1>
        <form action="login.php" method="post">
            <div class="form-group">
                <label for="username">Nome de Usuário:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Fazer Login</button>
        </form>
        <?php if (!empty($error_message)): ?>
            <p class="error"><?= $error_message ?></p>
        <?php endif; ?>
    </div>
</body>
</html>