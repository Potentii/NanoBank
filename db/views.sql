-- *Using utf8 as the default connection charset:
set names 'utf8';
use `nano_bank_schema`;

-- Client's accounts
create view `client_accounts` as
	select 
		`client`.`id` 			as `client_id`,
		`account`.`id` 			as `account_id`, 
		`account`.`description` as `account_description`, 
		`account`.`created_at` 	as `account_created_at`, 
		`account`.`client_fk` 	as `account_client_fk`
		from `account` 
		inner join `client`
			on `account`.`client_fk` = `client`.`id`;



-- Client's transactions
create view `client_transactions` as
	select 
		`client`.`id` 				as `client_id`, 
        `transaction`.`id` 			as `transaction_id`, 
        `transaction`.`notes` 		as `transaction_notes`, 
        `transaction`.`ammount` 	as `transaction_ammount`, 
        `transaction`.`date` 		as `transaction_date`, 
        `transaction`.`created_at` 	as `transaction_created_at`, 
        `transaction`.`account_fk` 	as `transaction_account_fk`
        from `client` 
		inner join `account` 
			on `account`.`client_fk` = `client`.`id` 
		inner join `transaction` 
			on `transaction`.`account_fk` = `account`.`id`;



-- Client's balance
create view `client_balance` as
	select 
		`client`.`id` 					as `client_id`, 
        `client`.`name` 				as `client_name`, 
        `client`.`created_at` 			as `client_created_at`, 
        sum(`transaction`.`ammount`) 	as `_balance` 
        from `client` 
		inner join `account` 
			on `account`.`client_fk` = `client`.`id` 
		inner join `transaction` 
			on `transaction`.`account_fk` = `account`.`id` 
		group by `client`.`id`;



-- Transaction's client
create view `transaction_client` as
	select 
		`transaction`.`id` 		as `transaction_id`,
		`client`.`id` 			as `client_id`, 
        `client`.`name` 		as `client_name`, 
        `client`.`created_at` 	as `client_created_at`
        from `client` 
		inner join `account` 
			on `account`.`client_fk` = `client`.`id`
		inner join `transaction` 
			on `transaction`.`account_fk` = `account`.`id`;



-- Account's client
create view `account_client` as
	select 
		`account`.`id` 			as `account_id`,
		`client`.`id` 			as `client_id`, 
        `client`.`name` 		as `client_name`, 
        `client`.`created_at` 	as `client_created_at`
        from `client` 
		inner join `account` 
			on `account`.`client_fk` = `client`.`id`;


-- Account's transactions
create view `account_transactions` as
	select 
		`account`.`id` 				as `account_id`, 
        `transaction`.`id` 			as `transaction_id`, 
        `transaction`.`notes` 		as `transaction_notes`, 
        `transaction`.`ammount` 	as `transaction_ammount`, 
        `transaction`.`date` 		as `transaction_date`, 
        `transaction`.`created_at` 	as `transaction_created_at`, 
        `transaction`.`account_fk` 	as `transaction_account_fk`
        from `account` 
		inner join `transaction` 
			on `transaction`.`account_fk` = `account`.`id`;


-- Account's balance
create view `account_balance` as
	select 
		`account`.`id` 					as `account_id`, 
		`account`.`description` 		as `account_description`, 
		`account`.`created_at` 			as `account_created_at`, 
		`account`.`client_fk` 			as `account_client_fk`,
        sum(`transaction`.`ammount`) 	as `_balance` 
        from `account` 
		inner join `transaction` 
			on `transaction`.`account_fk` = `account`.`id` 
		group by `account`.`id`;