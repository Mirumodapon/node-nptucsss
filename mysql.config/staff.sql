USE `auth`;

CREATE TABLE `staff` (
  `uuid` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(254) NOT NULL,
  `tags` TEXT,
  `skill` TEXT,
  `description` TEXT,
  `join` TIMESTAMP NOT NULL,
  `last_login` TIMESTAMP NOT NULL,
  `password` varchar(100) NOT NULL,
  `authority` int(1) NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE OR REPLACE VIEW staff_introd AS
SELECT uuid, name, email, tags, skill, description, `join`
FROM auth.staff;

INSERT INTO staff VALUES (
	'5a3260b9-da0e-4637-8ea3-6b7c8bd7e66d',
    'Root User',
    'root@nptucsss.org',
    '',
    '',
    '',
    ('2021-05-16 00:00:00'),
    ('2021-05-16 00:00:00'),
    '$2a$10$ED8AvyybdSfifIqEYA.M3uAn2Cto.v5dwnDKBTZOakYMim5UEBfPi', -- 7r01tNsuKCO4hnlmpW8J --
    255
);