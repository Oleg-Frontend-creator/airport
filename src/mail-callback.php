<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Обрабатываем только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    echo 'Данный метод запроса не поддерживается сервером';
    exit;
}

// Данные
$name  = isset($_POST['name'])  ? trim($_POST['name'])  : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';

// На всякий случай — если вообще ничего не пришло
if ($name === '' && $phone === '' && $email === '') {
    http_response_code(400);
    echo 'Пустой запрос';
    exit;
}

// Текст письма
$content =
    "{$name} оставил заявку на звонок по поводу трудоустройства на должность контролера ПК.\r\n" .
    "Телефон: {$phone}\r\n" .
    "E-mail: {$email}";

// Тема
$subject = "Заявка на обратный звонок";
$subjectEnc = "=?UTF-8?B?" . base64_encode($subject) . "?=";

// Имя отправителя
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