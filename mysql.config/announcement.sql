USE `announcement`;

CREATE TABLE `announcement` (
  `uuid` varchar(36) NOT NULL,
  `title` TEXT NOT NULL,
  `content` TEXT,
  `release_time` TIMESTAMP NOT NULL,
  `update_time` TIMESTAMP NOT NULL,
  `type` char(5) NOT NULL DEFAULT 'NOR',
  `expire` TIMESTAMP NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `edit_history` (
  `uuid` varchar(36) NOT NULL,
  `update_time` TIMESTAMP NOT NULL,
  `detail` TEXT,
  `editor` varchar(50) NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

