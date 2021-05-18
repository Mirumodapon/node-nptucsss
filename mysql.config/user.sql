USE `auth`;

CREATE TABLE `user` (
  `uuid` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(254) NOT NULL,
  `join` TIMESTAMP NOT NULL,
  `last_login` TIMESTAMP NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE OR REPLACE VIEW user_info AS
SELECT uuid, name, email, `join`, `last_login`
FROM auth.user;

INSERT INTO user VALUES (
	'3b891daa-e661-4cfc-80cc-5a05c55cce77',
    'Testing User',
    'example@nptucsss.org',
    ('2021-05-16 00:00:00'),
    ('2021-05-16 00:00:00'),
    'password'
);
