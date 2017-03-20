-- *Using utf8 as the default connection charset:
set names 'utf8';
drop schema if exists `nano_bank_schema`;
create schema if not exists `nano_bank_schema` default character set utf8 default collate utf8_general_ci;
use `nano_bank_schema`;



drop table if exists `transaction`;
drop table if exists `account`;
drop table if exists `client`;
-- drop table if exists `user`;



/*
create table if not exists `user`(
	`id` 	BIGINT unsigned not null auto_increment unique primary key,
	`name` 	TEXT not null,
	`date` 	DATETIME not null default now()
);
*/



create table if not exists `client`(
	`id` 			BIGINT unsigned not null auto_increment unique primary key,
	`name` 			TEXT not null,
	`created_at` 	DATETIME not null default now()
);



create table if not exists `account`(
	`id` 			BIGINT unsigned not null auto_increment unique primary key,
	`description` 	TEXT not null,
	`created_at` 	DATETIME not null default now(),
    `client_fk` 	BIGINT unsigned not null,
    
     foreign key(`client_fk`) references `client`(`id`)
);



create table if not exists `transaction`(
	`id` 			BIGINT unsigned not null auto_increment unique primary key,
	`notes` 		TEXT,
    `ammount` 		DECIMAL(11, 2),
	`date` 			DATETIME not null,
    `created_at` 	DATETIME not null default now(),
    `account_fk` 	BIGINT unsigned not null,
    
     foreign key(`account_fk`) references `account`(`id`)
);
