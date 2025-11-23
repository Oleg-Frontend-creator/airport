<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Обрабатываем только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    echo 'Данный метод запроса не поддерживается сервером';
    exit;
}

// Принимаем параметры
$email = isset($_POST['email']) ? trim($_POST['email']) : '';

if ($email === '') {
    http_response_code(400);
    echo 'E-mail не передан';
    exit;
}

// Текст письма
$content = "E-mail для получения документа с условиями на почту: {$email}";

// Тема
$subject = "Заявка на получение документа";
$subjectEnc = "=?UTF-8?B?" . base64_encode($subject) . "?=";

// Отправитель
$fromName = "Сайт Passport Control";
$fromNameEnc = "=?UTF-8?B?" . base64_encode($fromName) . "?=";

// Заголовки
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "From: {$fromNameEnc} <no-reply@dmdpassport.ru>\r\n";

// Отправка
$success = mail("dmd_passport_control@mail.ru", $subjectEnc, $content, $headers);

if ($success) {
    http_response_code(200);
    echo "Письмо отправлено";
} else {
    http_response_code(500);
    echo "Письмо не отправлено";
}