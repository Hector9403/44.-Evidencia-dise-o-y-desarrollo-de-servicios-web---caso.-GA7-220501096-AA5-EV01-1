CREATE DATABASE IF NOT EXISTS `logindb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `logindb`;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `usuarios` (`id`, `usuario`, `password`, `email`) VALUES (1, 'test', 'test', 'test@test.com');