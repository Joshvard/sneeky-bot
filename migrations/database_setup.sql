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

CREATE TABLE IF NOT EXISTS gear(
    id INT AUTO_INCREMENT,
    users_discord_id VARCHAR(32),
    gear_screenshot VARCHAR(255),
    gear_score INT,
    gear_creation_date DATE,
    gear_codename VARCHAR(64),
    PRIMARY KEY (id)
) ENGINE=INNODB;