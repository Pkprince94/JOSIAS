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
if (!isset($input['utilisateur_id'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "utilisateur_id manquant"
    ]);
    exit;
}

if (!isset($input['adresse'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "adresse manquante"
    ]);
    exit;
}

if (!isset($input['cart']) || !is_array($input['cart']) || empty($input['cart'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Panier vide"
    ]);
    exit;
}

$utilisateur_id = intval($input['utilisateur_id']);
$nom_client = $input['nom_client'] ?? 'Client';
$adresse = trim($input['adresse']);
$cart = $input['cart'];

// Validation de l'utilisateur_id
if ($utilisateur_id <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "utilisateur_id invalide"
    ]);
    exit;
}

// Validation de l'adresse
if (empty($adresse)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "L'adresse ne peut pas être vide"
    ]);
    exit;
}

// Inclure la connexion à la base
require_once 'Database.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();

    // Vérifier que l'utilisateur existe
    $checkSql = "SELECT id FROM utilisateurs WHERE id = :id";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->bindParam(':id', $utilisateur_id, PDO::PARAM_INT);
    $checkStmt->execute();

    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Utilisateur non trouvé"
        ]);
        exit;
    }

    // Enregistrer chaque produit du panier dans la table commandes
    $commandesInserted = 0;
    $sql = "INSERT INTO commandes (user_id, produit_id, nom_client, adresse, quantite, date_commande) 
            VALUES (:user_id, :produit_id, :nom_client, :adresse, :quantite, NOW())";
    $stmt = $pdo->prepare($sql);

    foreach ($cart as $produit) {
        // Vérifier que le produit a les infos nécessaires
        if (!isset($produit['id']) || !isset($produit['quantite'])) {
            continue;
        }

        $stmt->bindParam(':user_id', $utilisateur_id, PDO::PARAM_INT);
        $stmt->bindParam(':produit_id', $produit['id'], PDO::PARAM_INT);
        $stmt->bindParam(':nom_client', $nom_client, PDO::PARAM_STR);
        $stmt->bindParam(':adresse', $adresse, PDO::PARAM_STR);
        $stmt->bindParam(':quantite', $produit['quantite'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            $commandesInserted++;
        }
    }

    if ($commandesInserted > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Commandes enregistrées avec succès",
            "nombre_commandes" => $commandesInserted
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Impossible d'enregistrer les commandes"
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
