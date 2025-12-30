<?php
// Sécuriser la session pour l'accès cross-site (depuis Vercel)
session_start();

// CORS sécurisé vers ton frontend
$allowedOrigin = 'https://josias-azpx.vercel.app';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin === $allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Gestion requête pré-vol (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Récupérer les données JSON envoyées
$input = json_decode(file_get_contents('php://input'), true);

// Vérifications de base
if (!isset($input['utilisateur_id']) || !isset($input['adresse'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Données manquantes (utilisateur_id ou adresse)"
    ]);
    exit;
}

$utilisateur_id = intval($input['utilisateur_id']);
$adresse = trim($input['adresse']);

// Validation de l'adresse
if (empty($adresse) || strlen($adresse) < 5) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "L'adresse doit contenir au moins 5 caractères"
    ]);
    exit;
}

// Inclure la connexion à la base
require_once 'Database.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();

    // Mettre à jour l'adresse de l'utilisateur dans la table utilisateurs
    $sql = "UPDATE utilisateurs SET adresse = :adresse WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':adresse', $adresse, PDO::PARAM_STR);
    $stmt->bindParam(':id', $utilisateur_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Adresse sauvegardée avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la sauvegarde de l'adresse"
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur base de données : " . $e->getMessage()
    ]);
}
?>
