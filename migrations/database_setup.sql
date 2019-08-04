CREATE TABLE users(
	id INT AUTO_INCREMENT,
    users_name VARCHAR(32),
    users_discord_id VARCHAR(32),
    users_role_group INT,
    PRIMARY KEY (id)
) ENGINE=INNODB;