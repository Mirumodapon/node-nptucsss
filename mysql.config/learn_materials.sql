USE `learn_materials`;

CREATE TABLE `exam_record` (
  `uuid` varchar(36) NOT NULL,
  `department` varchar(5) NOT NULL,
  `semester` varchar(5) NOT NULL,
  `subject` TEXT NOT NULL,
  `professor` TEXT NOT NULL,
  `link` TEXT NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `note_record` (
  `uuid` varchar(36) NOT NULL,
  `department` varchar(5) NOT NULL,
  `semester` varchar(5) NOT NULL,
  `subject` TEXT NOT NULL,
  `editor` TEXT NOT NULL,
  `link` TEXT NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
