CREATE TABLE IF NOT EXISTS users(
	id INT AUTO_INCREMENT,
    users_name VARCHAR(32),
    users_discord_id VARCHAR(32),
    users_role_group INT,
    PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS casino(
	id INT AUTO_INCREMENT,
    casino_users_discord_id INT,
    casino_credits INT,
    PRIMARY KEY (id)
) ENGINE=INNODB;