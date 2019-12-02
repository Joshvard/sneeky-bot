CREATE TABLE IF NOT EXISTS users(
	users_id INT AUTO_INCREMENT,
    users_name VARCHAR(32),
    users_discord_id VARCHAR(32),
    role_group_id INT,
    PRIMARY KEY (users_id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS role_group(
	role_group_id INT AUTO_INCREMENT,
    role_group_name VARCHAR(50),
    PRIMARY KEY (role_group_id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS casino(
	casino_id INT AUTO_INCREMENT,
    users_discord_id VARCHAR(32),
    casino_credits BIGINT,
    PRIMARY KEY (casino_id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS gear(
    gear_id INT AUTO_INCREMENT,
    users_discord_id VARCHAR(32),
    gear_screenshot VARCHAR(255),
    gear_score INT,
    gear_creation_date DATE,
    gear_codename VARCHAR(64),
    PRIMARY KEY (gear_id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS attendance(
    attendance_id INT AUTO_INCREMENT,
    users_discord_id VARCHAR(32),
    attendance_last_signup DATE,
    attendance_late_info VARCHAR(255),
    attendance_is_signed_up TINYINT(1),
    attendance_is_vacation TINYINT(1),
    attendance_vacation_start_date DATE,
    attendance_vacation_end_date DATE,
    attendance_proof VARCHAR(255),
    attendance_last_mod_editor INT(32),
    PRIMARY KEY (attendance_id)
) ENGINE=INNODB;