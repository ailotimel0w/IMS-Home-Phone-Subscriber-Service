*
1. For the DATABASE, please run this query:
CREATE TABLE `subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `domain` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `callForwardNoReply_provisioned` tinyint(1) DEFAULT NULL,
  `callForwardNoReply_destination` varchar(50) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phoneNumber` (`phoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
**
2. Open terminal, Run `npm i`
***
3. Run `npx tailwindcss -i ./css/style-input.css -o ./css/style-output.css --watch` to watch tailwind css
****
4. Run `php -S localhost:8000` to start the app