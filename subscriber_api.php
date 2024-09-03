<?php
header("Content-Type: application/json");

$host = '127.0.0.1'; // Your database host
$db = 'subscriber_db'; // Your database name
$user = 'root'; // Your database user
$pass = 'admin'; // Your database password
$charset = 'utf8mb4';

// Set up the DSN and options
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Create a PDO instance (connect to the database)
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // Handle connection errors
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}

// Determine the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Retrieve the request data
$requestData = json_decode(file_get_contents('php://input'), true);
$phoneNumber = isset($_GET['phoneNumber']) ? $_GET['phoneNumber'] : null;

switch ($method) {
    case 'GET':
        if ($phoneNumber) {
            getSubscriberByPhoneNumber($pdo, $phoneNumber);
        } else {
            getAllSubscribers($pdo); // Fetch all subscribers if no phoneNumber is provided
        }
        break;
    case 'DELETE':
        if ($phoneNumber) {
            deleteSubscriber($pdo, $phoneNumber);
        } else {
            echo json_encode(['error' => 'Phone number is required']);
        }
        break;
    case 'PUT':
        if ($requestData) {
            addOrUpdateSubscriber($pdo, $requestData);
        } else {
            echo json_encode(['error' => 'Phone number and data are required']);
        }
        break;
    default:
        echo json_encode(['error' => 'Invalid request method']);
        break;
}

// Retrieve a subscriber by phone number
function getSubscriberByPhoneNumber($pdo, $phoneNumber)
{
    $stmt = $pdo->prepare("SELECT * FROM subscribers WHERE phoneNumber = ?");
    $stmt->execute([$phoneNumber]);
    $subscriber = $stmt->fetch();
    if ($subscriber) {
        echo json_encode($subscriber);
    } else {
        echo json_encode(['error' => 'Subscriber not found']);
    }
}

// Retrieve all subscribers
function getAllSubscribers($pdo)
{
    $stmt = $pdo->query("SELECT * FROM subscribers");
    $subscribers = $stmt->fetchAll();
    echo json_encode($subscribers);
}

// Delete a subscriber by phone number
function deleteSubscriber($pdo, $phoneNumber)
{
    $stmt = $pdo->prepare("DELETE FROM subscribers WHERE phoneNumber = ?");
    if ($stmt->execute([$phoneNumber])) {
        echo json_encode(['message' => 'Subscriber deleted successfully']);
    } else {
        echo json_encode(['error' => 'Failed to delete subscriber']);
    }
}

// Add or update a subscriber by phone number
function addOrUpdateSubscriber($pdo, $data)
{
    // var_dump($data['features']['callForwardNoReply']['provisioned']) ;
    $stmt = $pdo->prepare("INSERT INTO subscribers (phoneNumber, username, password, domain, status, callForwardNoReply_provisioned, callForwardNoReply_destination)
                           VALUES (:phoneNumber, :username, :passw, :domain, :stat, :callForwardNoReply_provisioned, :callForwardNoReply_destination)
                           ON DUPLICATE KEY UPDATE
                           username = :username2, password = :passw2, domain = :domain2, status = :stat2, callForwardNoReply_provisioned = :callForwardNoReply_provisioned2, callForwardNoReply_destination = :callForwardNoReply_destination2");

    $stmt->bindParam(':phoneNumber', $data['phoneNumber']);
    $stmt->bindParam(':username', $data['username']);
    $stmt->bindParam(':passw', $data['password']);
    $stmt->bindParam(':domain', $data['domain']);
    $stmt->bindParam(':stat', $data['status']);
    $stmt->bindParam(':callForwardNoReply_provisioned', $data['features']['callForwardNoReply']['provisioned']);
    $stmt->bindParam(':callForwardNoReply_destination', $data['features']['callForwardNoReply']['destination']);
    $stmt->bindParam(':username2', $data['username']);
    $stmt->bindParam(':passw2', $data['password']);
    $stmt->bindParam(':domain2', $data['domain']);
    $stmt->bindParam(':stat2', $data['status']);
    $stmt->bindParam(':callForwardNoReply_provisioned2', $data['features']['callForwardNoReply']['provisioned']);
    $stmt->bindParam(':callForwardNoReply_destination2', $data['features']['callForwardNoReply']['destination']);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Subscriber added/updated successfully']);
    } else {
        echo json_encode(['error' => 'Failed to add/update subscriber']);
    }
}
?>
