/*
SQLyog Community Edition- MySQL GUI v8.05 
MySQL - 5.1.73 : Database - srportalnew
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`srportalnew` /*!40100 DEFAULT CHARACTER SET latin1 */;

/*Table structure for table `t_acl_list_mas` */

DROP TABLE IF EXISTS `t_acl_list_mas`;

CREATE TABLE `t_acl_list_mas` (
  `acl_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `acl_name` varchar(45) DEFAULT NULL,
  `acl_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`acl_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `t_acl_list_mas` */

insert  into `t_acl_list_mas`(`acl_id_pk`,`acl_name`,`acl_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'No Access',NULL,NULL,NULL,NULL,NULL,1),(2,'Read',NULL,NULL,NULL,NULL,NULL,1),(3,'Edit (Read & Update)',NULL,NULL,NULL,NULL,NULL,1),(4,'Create (Change & Add)',NULL,NULL,NULL,NULL,NULL,1);

/*Table structure for table `t_assessment_ctgy_mas` */

DROP TABLE IF EXISTS `t_assessment_ctgy_mas`;

CREATE TABLE `t_assessment_ctgy_mas` (
  `assessment_ctgy_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `assessment_ctgy_name` varchar(45) DEFAULT NULL,
  `assessment_ctgy_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`assessment_ctgy_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `t_assessment_ctgy_mas` */

insert  into `t_assessment_ctgy_mas`(`assessment_ctgy_id_pk`,`assessment_ctgy_name`,`assessment_ctgy_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'Technical','Technical',1,1,NULL,NULL,1),(2,'Communication','Communication',1,1,NULL,NULL,1);

/*Table structure for table `t_assessment_subctgy_mas` */

DROP TABLE IF EXISTS `t_assessment_subctgy_mas`;

CREATE TABLE `t_assessment_subctgy_mas` (
  `assessment_subctgy_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `assessment_subctgy_name` varchar(45) DEFAULT NULL,
  `assessment_subctgy_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `assessment_ctgy_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`assessment_subctgy_id_pk`),
  KEY `fk_t_assessment_subctgy_mas_t_assessment_ctgy_mas1_idx` (`assessment_ctgy_id_fk`),
  CONSTRAINT `fk_t_assessment_subctgy_mas_t_assessment_ctgy_mas1` FOREIGN KEY (`assessment_ctgy_id_fk`) REFERENCES `t_assessment_ctgy_mas` (`assessment_ctgy_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `t_assessment_subctgy_mas` */

insert  into `t_assessment_subctgy_mas`(`assessment_subctgy_id_pk`,`assessment_subctgy_name`,`assessment_subctgy_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`,`assessment_ctgy_id_fk`) values (1,'Thershold','Thershold',1,1,NULL,NULL,1,1),(2,'Initial Assessment','Initial Assessment',1,1,NULL,NULL,1,1),(3,'Mid Assessment','Mid Assessment',1,1,NULL,NULL,1,1),(4,'Final Assessment','Final Assessment',1,1,NULL,NULL,1,1),(5,'Thershold','Thershold',1,1,NULL,NULL,1,2),(6,'Initial Assessment','Initial Assessment',1,1,NULL,NULL,1,2),(7,'Mid Assessment','Mid Assessment',1,1,NULL,NULL,1,2),(8,'Final Assessment','Final Assessment',1,1,NULL,NULL,1,2);

/*Table structure for table `t_attendance_options_mas` */

DROP TABLE IF EXISTS `t_attendance_options_mas`;

CREATE TABLE `t_attendance_options_mas` (
  `option_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `option_name` varchar(45) DEFAULT NULL,
  `option_desc` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`option_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `t_attendance_options_mas` */

insert  into `t_attendance_options_mas`(`option_id_pk`,`option_name`,`option_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'P','Present',NULL,NULL,NULL,NULL,1),(2,'AB','Absent',NULL,NULL,NULL,NULL,1),(3,'HD',NULL,NULL,NULL,NULL,NULL,1),(4,'ABSC',NULL,NULL,NULL,NULL,NULL,1),(5,'TERM','Termination',NULL,NULL,NULL,NULL,1);

/*Table structure for table `t_billing_cycle_mas` */

DROP TABLE IF EXISTS `t_billing_cycle_mas`;

CREATE TABLE `t_billing_cycle_mas` (
  `cycle_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `cycle_name` varchar(45) DEFAULT NULL,
  `cycle_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`cycle_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `t_billing_cycle_mas` */

insert  into `t_billing_cycle_mas`(`cycle_id_pk`,`cycle_name`,`cycle_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'3 Months',NULL,NULL,NULL,NULL,NULL,1),(2,'6 Months',NULL,NULL,NULL,NULL,NULL,1),(3,'12 Months',NULL,NULL,NULL,NULL,NULL,1);

/*Table structure for table `t_bu_mas` */

DROP TABLE IF EXISTS `t_bu_mas`;

CREATE TABLE `t_bu_mas` (
  `bu_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `bu_name` varchar(45) DEFAULT NULL,
  `bu_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`bu_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `t_bu_mas` */

insert  into `t_bu_mas`(`bu_id_pk`,`bu_name`,`bu_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'Voice',NULL,NULL,NULL,NULL,NULL,1),(2,'Email',NULL,NULL,NULL,NULL,NULL,1),(3,'Chat',NULL,NULL,NULL,NULL,NULL,1),(4,'Social Media',NULL,NULL,NULL,NULL,NULL,1);

/*Table structure for table `t_bucket_mas` */

DROP TABLE IF EXISTS `t_bucket_mas`;

CREATE TABLE `t_bucket_mas` (
  `bucket_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `bucket_name` varchar(45) DEFAULT NULL,
  `bucket_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `icon` varchar(128) NOT NULL,
  PRIMARY KEY (`bucket_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `t_bucket_mas` */

insert  into `t_bucket_mas`(`bucket_id_pk`,`bucket_name`,`bucket_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`,`icon`) values (1,'Overview',NULL,NULL,NULL,NULL,NULL,1,'fa fa-eye'),(2,'Planner',NULL,NULL,NULL,NULL,NULL,1,'fa fa-calendar-plus-o'),(3,'Confidential',NULL,NULL,NULL,NULL,NULL,1,'fa fa-lock'),(4,'Admin',NULL,NULL,NULL,NULL,NULL,1,'fa fa-pie-chart'),(5,'Cost to Transition',NULL,NULL,NULL,NULL,NULL,0,'fa fa-line-chart'),(6,'Infrastructure',NULL,NULL,NULL,NULL,NULL,1,'fa fa-building-o'),(7,'Resource Management',NULL,NULL,NULL,NULL,NULL,1,'fa fa-users'),(8,'Training',NULL,NULL,NULL,NULL,NULL,1,'fa fa-ticket'),(9,'Reports',NULL,NULL,NULL,NULL,NULL,1,'fa fa-file-text-o'),(10,'Go live',NULL,NULL,NULL,NULL,NULL,1,'fa fa-file-text-o');

/*Table structure for table `t_calender_loc_holidays_trans` */

DROP TABLE IF EXISTS `t_calender_loc_holidays_trans`;

CREATE TABLE `t_calender_loc_holidays_trans` (
  `holidays_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `cal_loc_id_fk` int(11) NOT NULL,
  `holiday_name` varchar(45) DEFAULT NULL,
  `holiday_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `holiday_date` date DEFAULT NULL,
  PRIMARY KEY (`holidays_id_pk`),
  KEY `fk_t_calender_loc_holidays_mas_t_calender_loc_mas1_idx` (`cal_loc_id_fk`),
  CONSTRAINT `fk_t_calender_loc_holidays_mas_t_calender_loc_mas1` FOREIGN KEY (`cal_loc_id_fk`) REFERENCES `t_calender_loc_mas` (`cal_loc_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

/*Data for the table `t_calender_loc_holidays_trans` */

insert  into `t_calender_loc_holidays_trans`(`holidays_id_pk`,`cal_loc_id_fk`,`holiday_name`,`holiday_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`,`holiday_date`) values (2,2,'National Holiday',NULL,1,1,'2016-07-15 00:00:00','2016-07-15 00:00:00',1,'2016-07-26'),(9,3,'test',NULL,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,'2016-10-14'),(13,4,'independence day',NULL,1,1,'2016-08-17 00:00:00','2016-08-17 00:00:00',1,'2016-08-15'),(14,1,'Holiday',NULL,1,1,'2016-08-29 00:00:00','2016-08-29 00:00:00',1,'2016-04-13');

/*Table structure for table `t_calender_loc_mas` */

DROP TABLE IF EXISTS `t_calender_loc_mas`;

CREATE TABLE `t_calender_loc_mas` (
  `cal_loc_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `location_id_fk` int(11) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `weekoff_days` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`cal_loc_id_pk`),
  KEY `fk_t_calender_loc_mas_t_location_mas1_idx` (`location_id_fk`),
  CONSTRAINT `fk_t_calender_loc_mas_t_location_mas1` FOREIGN KEY (`location_id_fk`) REFERENCES `t_location_mas` (`location_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `t_calender_loc_mas` */

insert  into `t_calender_loc_mas`(`cal_loc_id_pk`,`location_id_fk`,`year`,`weekoff_days`) values (1,1,2016,'[0,6]'),(2,6,2016,'[0,6]'),(3,4,2016,'[0,6]'),(4,7,2016,'[0,6]');

/*Table structure for table `t_calender_loc_project_map` */

DROP TABLE IF EXISTS `t_calender_loc_project_map`;

CREATE TABLE `t_calender_loc_project_map` (
  `cal_loc_id_fk` int(11) NOT NULL,
  `project_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`cal_loc_id_fk`,`project_id_fk`),
  KEY `fk_t_calender_loc_mas_has_t_project_mas_t_project_mas1_idx` (`project_id_fk`),
  KEY `fk_t_calender_loc_mas_has_t_project_mas_t_calender_loc_mas1_idx` (`cal_loc_id_fk`),
  CONSTRAINT `fk_t_calender_loc_mas_has_t_project_mas_t_calender_loc_mas1` FOREIGN KEY (`cal_loc_id_fk`) REFERENCES `t_calender_loc_mas` (`cal_loc_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_calender_loc_mas_has_t_project_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_calender_loc_project_map` */

insert  into `t_calender_loc_project_map`(`cal_loc_id_fk`,`project_id_fk`) values (1,1),(2,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(4,9),(1,10);

/*Table structure for table `t_capex_opex_trans` */

DROP TABLE IF EXISTS `t_capex_opex_trans`;

CREATE TABLE `t_capex_opex_trans` (
  `t_co_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `t_co_trans_mas_id_fk` int(11) NOT NULL,
  `t_co_serial_no` varchar(45) DEFAULT NULL,
  `item_desc` text,
  `item_qty` int(11) DEFAULT NULL,
  `unit_cost` double(10,2) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `comments` text,
  `seat_cost` int(11) DEFAULT NULL,
  `filename` varchar(200) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `itstatus` int(11) NOT NULL DEFAULT '0',
  `status_comments` text NOT NULL,
  `ctype` varchar(45) NOT NULL,
  PRIMARY KEY (`t_co_trans_id_pk`),
  KEY `fk_t_capex_opex_trans_t_capex_opex_trans_mas1_idx` (`t_co_trans_mas_id_fk`),
  CONSTRAINT `fk_t_capex_opex_trans_t_capex_opex_trans_mas1` FOREIGN KEY (`t_co_trans_mas_id_fk`) REFERENCES `t_capex_opex_trans_mas` (`t_co_trans_mas_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_capex_opex_trans` */

/*Table structure for table `t_capex_opex_trans_mas` */

DROP TABLE IF EXISTS `t_capex_opex_trans_mas`;

CREATE TABLE `t_capex_opex_trans_mas` (
  `t_co_trans_mas_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `t_capex_total` double(10,2) DEFAULT NULL,
  `t_opex_total` double(10,2) DEFAULT NULL,
  `t_capex_opex_total` double(10,2) DEFAULT NULL,
  `project_id_fk` int(11) NOT NULL,
  `bucket_from` int(11) NOT NULL DEFAULT '0',
  `bucket_to` int(11) NOT NULL DEFAULT '0',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`t_co_trans_mas_id_pk`),
  KEY `fk_t_capex_opex_trans_mas_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_capex_opex_trans_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `t_capex_opex_trans_mas` */

insert  into `t_capex_opex_trans_mas`(`t_co_trans_mas_id_pk`,`t_capex_total`,`t_opex_total`,`t_capex_opex_total`,`project_id_fk`,`bucket_from`,`bucket_to`,`created_by`,`updated_by`,`created_date`,`updated_date`) values (1,0.00,0.00,0.00,5,0,0,1,1,'2016-08-11 20:05:38','2016-08-11 20:05:38'),(2,0.00,0.00,0.00,9,0,0,1,1,'2016-08-24 20:24:43','2016-08-24 20:24:43'),(3,0.00,0.00,0.00,1,0,0,1,1,'2016-08-24 20:25:43','2016-08-24 20:25:43'),(4,0.00,0.00,0.00,10,0,0,1,1,'2016-08-29 17:32:36','2016-08-29 17:32:36');

/*Table structure for table `t_client_mas` */

DROP TABLE IF EXISTS `t_client_mas`;

CREATE TABLE `t_client_mas` (
  `client_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(45) DEFAULT NULL,
  `client_location` varchar(45) DEFAULT NULL,
  `client_street` varchar(45) DEFAULT NULL,
  `client_city` varchar(45) DEFAULT NULL,
  `client_state` varchar(45) DEFAULT NULL,
  `client_country` varchar(45) DEFAULT NULL,
  `client_phone` varchar(45) DEFAULT NULL,
  `client_fax` varchar(45) DEFAULT NULL,
  `client_emailid` varchar(45) DEFAULT NULL,
  `client_contact_person` varchar(45) DEFAULT NULL,
  `client_contact_person_designation` varchar(45) DEFAULT NULL,
  `client_remarks` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`client_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `t_client_mas` */

insert  into `t_client_mas`(`client_id_pk`,`client_name`,`client_location`,`client_street`,`client_city`,`client_state`,`client_country`,`client_phone`,`client_fax`,`client_emailid`,`client_contact_person`,`client_contact_person_designation`,`client_remarks`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'Marketo,Inc','United States','901, Mariers Island Blvd, Suite 500','San Mateo','California','US, 94404','6503852200','6503852200','Roger@Marketo.com','Roger','Project manager','SPOC for SR',1,1,'2016-07-11 23:03:34','2016-07-11 23:03:34',1),(2,'ViewSonic','Location','ViewSonic','Milipitas','California','US','8979878687','2432445345','ViewSonic@viewsonic.com','Michelle Toda','Project manager','Project Manager',1,1,'2016-07-15 19:03:21','2016-07-15 19:03:21',1),(3,'VeloCloud Networks, Inc.','Ambit Chennai','295 N. Bernardo Ave, Suite 200 ,','Mountain View','California','United States','6502094180','6502094180','contact@velocloud.com','Ajit','Ajit kumar','Ajit Kumar',1,1,'2016-07-25 20:00:45','2016-07-27 20:13:12',1),(4,'Facebook','California','Facebook','sfsdfsd','US','US','6503852200','7663244','facebook@facebook.com','Mark Zukerberg','CEO','bad fellow',1,1,'2016-07-27 20:14:57','2016-07-27 20:23:07',1),(5,'Trion Worlds, Inc.','United States','1200 Bridge Pkwy, Suite 201','Redwood City','California','United States','8015545434','8015548788','Trion@trionwrlds.com','Michael Johnson','Project manager','Gaming Site',1,1,'2016-08-11 18:18:45','2016-08-11 18:18:45',1),(6,'Alcatel - GNoC','World','I dont have that information','I dont have that too','I guess its some where in europe','A country in europe','numbers0-9','numbers0-9','emailid@fromclientdomain.com','CEO of Alcatel- No not really, a SPOC from Al','Srini','Very good man!',1,1,'2016-08-11 21:42:15','2016-08-11 21:42:15',1),(7,'MicroSoft','Utah','Albuquerque,','New Mexico,','New Mexico','United States','8965634488','987987897','Micro.Shoft@Microshoft.com','Satya Madella','CEO','Good guy',1,1,'2016-08-17 19:20:17','2016-08-17 20:02:50',1),(8,'Google,Inc','Ambit','221, Bakers Street','New York','New York','United States','6503852200','6503852200','Google@Google.com','Sundar Pichai','CEO','CEO',1,1,'2016-08-29 16:05:58','2016-09-16 01:31:46',1);

/*Table structure for table `t_comm_matrix_mas` */

DROP TABLE IF EXISTS `t_comm_matrix_mas`;

CREATE TABLE `t_comm_matrix_mas` (
  `comm_matrix_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_id_fk` int(11) NOT NULL,
  `comm_matrix_title` varchar(45) DEFAULT NULL,
  `client_emailid` varchar(45) DEFAULT NULL,
  `email_status` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `internal` int(11) NOT NULL,
  PRIMARY KEY (`comm_matrix_id_pk`),
  KEY `fk_t_comm_matrix_mas_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_comm_matrix_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

/*Data for the table `t_comm_matrix_mas` */

insert  into `t_comm_matrix_mas`(`comm_matrix_id_pk`,`project_id_fk`,`comm_matrix_title`,`client_emailid`,`email_status`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`,`internal`) values (1,1,'Marketo, Inc','',0,1,1,'2016-07-12 01:31:24','2016-07-12 01:31:24',1,2),(2,1,'CSS Users View','',0,1,1,'2016-07-12 01:31:24','2016-07-12 01:31:24',1,1),(3,4,'Client View','',0,1,1,'2016-07-26 22:18:30','2016-07-26 22:18:30',1,2),(4,4,'CSS Users View','',0,1,1,'2016-07-26 22:18:30','2016-07-26 22:18:30',1,1),(5,3,'Client View','',0,1,1,'2016-07-27 20:47:55','2016-07-27 20:47:55',1,2),(6,3,'CSS Users View','',0,1,1,'2016-07-27 20:47:55','2016-07-27 20:47:55',1,1),(7,6,'Client View','',0,1,1,'2016-07-27 20:50:50','2016-07-27 20:50:50',1,2),(8,6,'CSS Users View','',0,1,1,'2016-07-27 20:50:50','2016-07-27 20:50:50',1,1),(9,5,'Client View','',0,1,1,'2016-08-04 13:49:07','2016-08-04 13:49:07',1,2),(10,5,'CSS Users View','',0,1,1,'2016-08-04 13:49:07','2016-08-04 13:49:07',1,1),(11,7,'Client View','',0,1,1,'2016-08-11 23:32:09','2016-08-11 23:32:09',1,2),(12,7,'CSS Users View','',0,1,1,'2016-08-11 23:32:09','2016-08-11 23:32:09',1,1),(13,8,'Client View','',0,1,1,'2016-08-26 23:39:19','2016-08-26 23:39:19',1,2),(14,8,'CSS Users View','',0,1,1,'2016-08-26 23:39:19','2016-08-26 23:39:19',1,1),(15,10,'Client View','',0,1,1,'2016-09-08 19:33:10','2016-09-08 19:33:10',1,2),(16,10,'CSS Users View','',0,1,1,'2016-09-08 19:33:10','2016-09-08 19:33:10',1,1),(17,9,'Client View','',0,1,1,'2016-09-08 20:00:46','2016-09-08 20:00:46',1,2),(18,9,'CSS Users View','',0,1,1,'2016-09-08 20:00:46','2016-09-08 20:00:46',1,1);

/*Table structure for table `t_comm_matrix_trans` */

DROP TABLE IF EXISTS `t_comm_matrix_trans`;

CREATE TABLE `t_comm_matrix_trans` (
  `comm_matrix_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `comm_matrix_id_fk` int(11) NOT NULL,
  `comm_matrix_stkname` varchar(45) DEFAULT NULL,
  `comm_matrix_role` varchar(45) DEFAULT NULL,
  `comm_matrix_email` varchar(45) DEFAULT NULL,
  `comm_matrix_telephone` varchar(45) DEFAULT NULL,
  `comm_matrix_mobile` varchar(45) DEFAULT NULL,
  `comm_matrix_subcomm` varchar(45) DEFAULT NULL,
  `timezone_id_fk` varchar(50) NOT NULL,
  PRIMARY KEY (`comm_matrix_trans_id_pk`),
  KEY `fk_t_comm_matrix_trans_t_comm_matrix_mas1_idx` (`comm_matrix_id_fk`),
  CONSTRAINT `fk_t_comm_matrix_trans_t_comm_matrix_mas1` FOREIGN KEY (`comm_matrix_id_fk`) REFERENCES `t_comm_matrix_mas` (`comm_matrix_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `t_comm_matrix_trans` */

insert  into `t_comm_matrix_trans`(`comm_matrix_trans_id_pk`,`comm_matrix_id_fk`,`comm_matrix_stkname`,`comm_matrix_role`,`comm_matrix_email`,`comm_matrix_telephone`,`comm_matrix_mobile`,`comm_matrix_subcomm`,`timezone_id_fk`) values (1,1,'Roger','Project Manager','naga.saggi@gmail.com','897987987','87987987987987','All','Australia'),(2,1,'Mohan Archer','Director','Mohan@Marketo.com','87987988979879877897','87987987987','IT & Training','United states of America'),(3,1,'Patricia','Vice President','Patricia@Marketo.com','234234234234','234234234','Management','US'),(4,2,'Nagalingam','DPM','Nagalingam.ramanpillai@csscorp.com','876875676','8798778675','All','IST'),(5,16,'Ashish Mohanty','Senior Vice President, Global CTAS','Ashish.Mohanty@csscorp.com','8056155998','6503852200','Yes','IST'),(6,16,'Matt Anderson','Vice President - Account Management','Matt.Anderson@csscorp.com','8056155998','6503852200','Yes','EST');

/*Table structure for table `t_dashboard_mas` */

DROP TABLE IF EXISTS `t_dashboard_mas`;

CREATE TABLE `t_dashboard_mas` (
  `db_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `db_name` varchar(45) DEFAULT NULL,
  `db_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`db_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `t_dashboard_mas` */

insert  into `t_dashboard_mas`(`db_id_pk`,`db_name`,`db_desc`,`created_by`,`updated_by`,`created_date`,`update_date`,`status`) values (1,'Status Bar Map','Status Bar Map',3,3,'2016-03-29 20:14:25','2016-03-29 20:14:25',1),(2,'Upcoming Action Items','Upcoming Action Items',3,3,'2016-03-29 20:16:10','2016-03-29 20:16:10',1),(3,'High Level Implementation','High Level Implementation',3,3,'2016-03-29 20:16:33','2016-03-29 20:16:33',1),(4,'Burn Down Chart','Burn Down Chart',3,3,'2016-03-29 20:17:04','2016-03-29 20:17:04',1),(5,'Status Report Chart','Status Report Chart',3,3,'2016-03-29 20:17:25','2016-03-29 20:17:25',1);

/*Table structure for table `t_delivery_unit_mas` */

DROP TABLE IF EXISTS `t_delivery_unit_mas`;

CREATE TABLE `t_delivery_unit_mas` (
  `dunit_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `dunit_name` varchar(45) DEFAULT NULL,
  `dunit_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`dunit_id_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_delivery_unit_mas` */

/*Table structure for table `t_division_mas` */

DROP TABLE IF EXISTS `t_division_mas`;

CREATE TABLE `t_division_mas` (
  `division_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `division_name` varchar(45) DEFAULT NULL,
  `division_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`division_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `t_division_mas` */

insert  into `t_division_mas`(`division_id_pk`,`division_name`,`division_desc`,`created_by`,`updated_by`,`status`,`created_date`,`updated_date`) values (1,'CTAS',NULL,NULL,NULL,1,NULL,NULL),(2,'ETAS',NULL,NULL,NULL,1,NULL,NULL),(3,'MI',NULL,NULL,NULL,1,NULL,NULL),(4,'RIMS',NULL,NULL,NULL,1,NULL,NULL),(5,'AS',NULL,NULL,NULL,1,NULL,NULL);

/*Table structure for table `t_division_user_map` */

DROP TABLE IF EXISTS `t_division_user_map`;

CREATE TABLE `t_division_user_map` (
  `user_id_fk` int(11) NOT NULL,
  `division_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`user_id_fk`,`division_id_fk`),
  KEY `fk_t_user_mas_has_t_division_mas_t_division_mas1_idx` (`division_id_fk`),
  KEY `fk_t_user_mas_has_t_division_mas_t_user_mas1_idx` (`user_id_fk`),
  CONSTRAINT `fk_t_user_mas_has_t_division_mas_t_division_mas1` FOREIGN KEY (`division_id_fk`) REFERENCES `t_division_mas` (`division_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_mas_has_t_division_mas_t_user_mas1` FOREIGN KEY (`user_id_fk`) REFERENCES `t_user_mas` (`user_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_division_user_map` */

insert  into `t_division_user_map`(`user_id_fk`,`division_id_fk`) values (1,1),(2,1),(3,1),(4,1),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2);

/*Table structure for table `t_golive_mas` */

DROP TABLE IF EXISTS `t_golive_mas`;

CREATE TABLE `t_golive_mas` (
  `golive_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_id_fk` int(11) NOT NULL,
  `email_status` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`golive_id_pk`),
  KEY `project_id_fk` (`project_id_fk`),
  CONSTRAINT `t_golive_mas_ibfk_1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_golive_mas` */

/*Table structure for table `t_golive_mod_details` */

DROP TABLE IF EXISTS `t_golive_mod_details`;

CREATE TABLE `t_golive_mod_details` (
  `golive_mod_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `golive_mod_name` varchar(100) NOT NULL,
  `golive_mod_desc` varchar(100) NOT NULL,
  `golive_mod_status` int(11) DEFAULT '0',
  `fail_resolve_hrs` int(11) DEFAULT '1',
  `golive_id_fk` int(11) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`golive_mod_id_pk`),
  KEY `golive_id_fk` (`golive_id_fk`),
  CONSTRAINT `t_golive_mod_details_ibfk_1` FOREIGN KEY (`golive_id_fk`) REFERENCES `t_golive_mas` (`golive_id_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_golive_mod_details` */

/*Table structure for table `t_golive_user_map` */

DROP TABLE IF EXISTS `t_golive_user_map`;

CREATE TABLE `t_golive_user_map` (
  `golive_user_map_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `golive_id_fk` int(11) NOT NULL,
  `user_id_fk` int(11) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`golive_user_map_id_pk`),
  KEY `user_id_fk` (`user_id_fk`),
  KEY `golive_id_fk` (`golive_id_fk`),
  CONSTRAINT `t_golive_user_map_ibfk_1` FOREIGN KEY (`user_id_fk`) REFERENCES `t_user_mas` (`user_id_pk`),
  CONSTRAINT `t_golive_user_map_ibfk_2` FOREIGN KEY (`golive_id_fk`) REFERENCES `t_golive_mas` (`golive_id_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_golive_user_map` */

/*Table structure for table `t_invoice_trans` */

DROP TABLE IF EXISTS `t_invoice_trans`;

CREATE TABLE `t_invoice_trans` (
  `invoice_id_pk` int(11) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `project_id_fk` int(11) NOT NULL,
  `sales_incharge` varchar(45) DEFAULT NULL,
  `sbu_incharge` varchar(45) DEFAULT NULL,
  `du` varchar(45) DEFAULT NULL,
  `account_incharge` varchar(45) DEFAULT NULL,
  `region` varchar(45) DEFAULT NULL,
  `billing_location` varchar(45) DEFAULT NULL,
  `delivery_location` varchar(45) DEFAULT NULL,
  `clien_name` varchar(45) DEFAULT NULL,
  `delivery_head` varchar(45) DEFAULT NULL,
  `address` text,
  `delivery_incharge` varchar(45) DEFAULT NULL,
  `contact_person` varchar(45) DEFAULT NULL,
  `billing_cycle_id_fk` int(11) NOT NULL,
  `po_no` varchar(45) DEFAULT NULL,
  `date_of_msa_sow` date DEFAULT NULL,
  `invoice_date` datetime DEFAULT NULL,
  `instructions` text,
  `email_distribution` text,
  PRIMARY KEY (`invoice_id_pk`),
  KEY `fk_t_invoice_trans_t_project_mas1_idx` (`project_id_fk`),
  KEY `fk_t_invoice_trans_t_billing_cycle_mas1_idx` (`billing_cycle_id_fk`),
  CONSTRAINT `fk_t_invoice_trans_t_billing_cycle_mas1` FOREIGN KEY (`billing_cycle_id_fk`) REFERENCES `t_billing_cycle_mas` (`cycle_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_invoice_trans_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_invoice_trans` */

/*Table structure for table `t_itrrf_ctgy_mas` */

DROP TABLE IF EXISTS `t_itrrf_ctgy_mas`;

CREATE TABLE `t_itrrf_ctgy_mas` (
  `itrrf_ctgy_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `itrrf_ctgy_name` varchar(45) DEFAULT NULL,
  `itrrf_ctgy_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`itrrf_ctgy_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `t_itrrf_ctgy_mas` */

insert  into `t_itrrf_ctgy_mas`(`itrrf_ctgy_id_pk`,`itrrf_ctgy_name`,`itrrf_ctgy_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'Desktop Configuration','Desktop Configuration',1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(2,'Laptop Configuration','Laptop Configuration',1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(3,'Other Configurations','Other Configurations',1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1);

/*Table structure for table `t_itrrf_subctgy_mas` */

DROP TABLE IF EXISTS `t_itrrf_subctgy_mas`;

CREATE TABLE `t_itrrf_subctgy_mas` (
  `itrrf_subctgy_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `itrrf_ctgy_id_fk` int(11) NOT NULL,
  `itrrf_subctgy_name` varchar(45) DEFAULT NULL,
  `itrrf_subctgy_desc` text,
  `soundex` varchar(45) DEFAULT NULL,
  `defined_fields` int(11) DEFAULT '0' COMMENT '1 - Predefined\n0 - User defined',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`itrrf_subctgy_id_pk`),
  UNIQUE KEY `uni_group` (`itrrf_ctgy_id_fk`,`itrrf_subctgy_name`),
  KEY `fk_t_itrrf_subctgy_mas_t_itrrf_ctgy_mas1_idx` (`itrrf_ctgy_id_fk`),
  CONSTRAINT `fk_t_itrrf_subctgy_mas_t_itrrf_ctgy_mas1` FOREIGN KEY (`itrrf_ctgy_id_fk`) REFERENCES `t_itrrf_ctgy_mas` (`itrrf_ctgy_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

/*Data for the table `t_itrrf_subctgy_mas` */

insert  into `t_itrrf_subctgy_mas`(`itrrf_subctgy_id_pk`,`itrrf_ctgy_id_fk`,`itrrf_subctgy_name`,`itrrf_subctgy_desc`,`soundex`,`defined_fields`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,1,'Configuration Required ( Including OS )','Configuration Required ( Including OS )','C5126356263524352',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(2,1,'Memory Required','Memory Required','M6263',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(3,1,'HDD','HDD','H300',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(4,2,'Configuration Required ( Including OS )','Configuration Required ( Including OS )','C5126356263524352',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(5,2,'Memory Required','Memory Required','M6263',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(6,2,'HDD','HDD','H300',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(7,3,'Other Software Required','Other Software Required','O362136263',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(8,3,'Email / Chat Requirements','Email / Chat Requirements','E5423626532',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(9,1,'Software',NULL,NULL,0,NULL,NULL,NULL,NULL,NULL),(10,1,'Tester','Tester','Tester',0,1,1,'2016-01-24 15:08:22','2016-01-24 15:08:22',1),(11,1,'Tester11','Tester11','Tester11',0,1,1,'2016-01-24 15:28:49','2016-01-24 15:28:49',1),(12,1,'New','New','New',0,1,1,'2016-01-24 15:30:56','2016-01-24 15:30:56',1),(13,1,'Check','Check','Check',0,1,1,'2016-01-24 15:48:45','2016-01-24 15:48:45',1),(14,1,'Tester22','Tester22','Tester22',0,1,1,'2016-01-24 16:04:47','2016-01-24 16:04:47',1),(15,1,'Sowtware','Sowtware','Sowtware',0,1,1,'2016-01-24 16:26:58','2016-01-24 16:26:58',1),(16,2,'Tester','Tester','Tester',0,1,1,'2016-01-24 16:31:46','2016-01-24 16:31:46',1),(17,1,NULL,NULL,NULL,0,1,1,'2016-01-27 19:48:46','2016-01-27 19:48:46',1),(18,1,NULL,NULL,NULL,0,1,1,'2016-01-27 19:48:51','2016-01-27 19:48:51',1),(19,1,'Monitor','Monitor','Monitor',0,1,1,'2016-01-27 19:51:09','2016-01-27 19:51:09',1),(20,1,'HDD1','HDD1','HDD1',0,1,1,'2016-01-27 19:52:14','2016-01-27 19:52:14',1),(21,2,'test@33','test@33','test@33',0,1,1,'2016-01-27 19:53:08','2016-01-27 19:53:08',1),(22,2,'test@1','test@1','test@1',0,1,1,'2016-01-27 19:53:10','2016-01-27 19:53:10',1),(23,2,'test','test','test',0,1,1,'2016-01-27 19:53:11','2016-01-27 19:53:11',1),(24,3,'test','test','test',0,1,1,'2016-01-27 19:53:38','2016-01-27 19:53:38',1),(25,3,'test@45678','test@45678','test@45678',0,1,1,'2016-01-27 19:53:39','2016-01-27 19:53:39',1),(26,3,'test@1324568','test@1324568','test@1324568',0,1,1,'2016-01-27 19:53:39','2016-01-27 19:53:39',1),(27,3,NULL,NULL,NULL,0,1,1,'2016-01-27 19:53:43','2016-01-27 19:53:43',1),(28,3,NULL,NULL,NULL,0,1,1,'2016-01-27 19:53:45','2016-01-27 19:53:45',1),(29,1,NULL,NULL,NULL,0,1,1,'2016-01-28 17:35:25','2016-01-28 17:35:25',1),(30,1,NULL,NULL,NULL,0,1,1,'2016-01-28 19:29:54','2016-01-28 19:29:54',1),(31,1,'ghfConfiguration Required ( Including OS )','ghfConfiguration Required ( Including OS )','ghfConfiguration Required ( Including OS )',0,1,1,'2016-01-29 17:18:09','2016-01-29 17:18:09',1),(32,1,'gfhfg','gfhfg','gfhfg',0,1,1,'2016-01-29 17:18:18','2016-01-29 17:18:18',1),(33,1,'dfgMemory Required','dfgMemory Required','dfgMemory Required',0,1,1,'2016-01-29 18:25:41','2016-01-29 18:25:41',1),(34,1,NULL,NULL,NULL,0,1,1,'2016-02-03 17:01:46','2016-02-03 17:01:46',1),(35,1,NULL,NULL,NULL,0,1,1,'2016-02-03 17:01:55','2016-02-03 17:01:55',1),(36,1,NULL,NULL,NULL,0,1,1,'2016-02-03 17:03:37','2016-02-03 17:03:37',1),(37,1,NULL,NULL,NULL,0,1,1,'2016-02-03 17:12:24','2016-02-03 17:12:24',1),(38,1,'Floppy','Floppy','Floppy',0,1,1,'2016-02-19 18:34:59','2016-02-19 18:34:59',1);

/*Table structure for table `t_itrrf_trans` */

DROP TABLE IF EXISTS `t_itrrf_trans`;

CREATE TABLE `t_itrrf_trans` (
  `itrrf_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `itrrf_ctgy_id_fk` int(11) NOT NULL,
  `itrrf_subctgy_id_fk` int(11) NOT NULL,
  `itrrf_trans_mas_id_fk` int(11) NOT NULL,
  `itrrf_trans_desc` text,
  `itrrf_trans_remarks` text,
  `project_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`itrrf_trans_id_pk`),
  KEY `fk_t_itrrf_trans_t_itrrf_trans_mas1_idx` (`itrrf_trans_mas_id_fk`),
  KEY `fk_t_itrrf_trans_t_itrrf_ctgy_mas1_idx` (`itrrf_ctgy_id_fk`),
  KEY `fk_t_itrrf_trans_t_itrrf_subctgy_mas1_idx` (`itrrf_subctgy_id_fk`),
  KEY `fk_t_itrrf_trans_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_itrrf_trans_t_itrrf_ctgy_mas1` FOREIGN KEY (`itrrf_ctgy_id_fk`) REFERENCES `t_itrrf_ctgy_mas` (`itrrf_ctgy_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_itrrf_trans_t_itrrf_subctgy_mas1` FOREIGN KEY (`itrrf_subctgy_id_fk`) REFERENCES `t_itrrf_subctgy_mas` (`itrrf_subctgy_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_itrrf_trans_t_itrrf_trans_mas1` FOREIGN KEY (`itrrf_trans_mas_id_fk`) REFERENCES `t_itrrf_trans_mas` (`idt_itrrf_trans_mas_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_itrrf_trans_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

/*Data for the table `t_itrrf_trans` */

insert  into `t_itrrf_trans`(`itrrf_trans_id_pk`,`itrrf_ctgy_id_fk`,`itrrf_subctgy_id_fk`,`itrrf_trans_mas_id_fk`,`itrrf_trans_desc`,`itrrf_trans_remarks`,`project_id_fk`) values (1,1,1,1,NULL,NULL,1),(2,1,2,1,NULL,NULL,1),(3,1,3,1,NULL,NULL,1),(4,2,4,1,NULL,NULL,1),(5,2,5,1,NULL,NULL,1),(6,2,6,1,NULL,NULL,1),(7,3,7,1,NULL,NULL,1),(8,3,8,1,NULL,NULL,1),(16,1,1,2,NULL,NULL,5),(17,1,2,2,NULL,NULL,5),(18,1,3,2,NULL,NULL,5),(19,2,4,2,NULL,NULL,5),(20,2,5,2,NULL,NULL,5),(21,2,6,2,NULL,NULL,5),(22,3,7,2,NULL,NULL,5),(23,3,8,2,NULL,NULL,5),(24,1,1,3,NULL,NULL,9),(25,1,2,3,NULL,NULL,9),(26,1,3,3,NULL,NULL,9),(27,2,4,3,NULL,NULL,9),(28,2,5,3,NULL,NULL,9),(29,2,6,3,NULL,NULL,9),(30,3,7,3,NULL,NULL,9),(31,3,8,3,NULL,NULL,9),(39,1,1,4,NULL,NULL,10),(40,1,2,4,NULL,NULL,10),(41,1,3,4,NULL,NULL,10),(42,2,4,4,NULL,NULL,10),(43,2,5,4,NULL,NULL,10),(44,2,6,4,NULL,NULL,10),(45,3,7,4,NULL,NULL,10),(46,3,8,4,NULL,NULL,10);

/*Table structure for table `t_itrrf_trans_mas` */

DROP TABLE IF EXISTS `t_itrrf_trans_mas`;

CREATE TABLE `t_itrrf_trans_mas` (
  `idt_itrrf_trans_mas_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_id_fk` int(11) NOT NULL,
  `account_manager` varchar(45) DEFAULT NULL,
  `final_version` varchar(45) DEFAULT NULL,
  `timezone_id_fk` int(11) NOT NULL,
  `roll_out_date` date DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `no_of_postion` int(11) DEFAULT NULL,
  `emp_details` text COMMENT 'Emp Name/ID/Email/Seat\n',
  `hs_no_of_seat` int(11) DEFAULT NULL,
  `hs_no_of_systems` int(11) DEFAULT NULL,
  PRIMARY KEY (`idt_itrrf_trans_mas_id_pk`),
  KEY `fk_t_itrrf_trans_mas_t_timezone_mas1_idx` (`timezone_id_fk`),
  KEY `fk_t_itrrf_trans_mas_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_itrrf_trans_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_itrrf_trans_mas_t_timezone_mas1` FOREIGN KEY (`timezone_id_fk`) REFERENCES `t_timezone_mas` (`timezone_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `t_itrrf_trans_mas` */

insert  into `t_itrrf_trans_mas`(`idt_itrrf_trans_mas_id_pk`,`project_id_fk`,`account_manager`,`final_version`,`timezone_id_fk`,`roll_out_date`,`location`,`no_of_postion`,`emp_details`,`hs_no_of_seat`,`hs_no_of_systems`) values (1,1,'','',1,'0000-00-00','',0,'',0,0),(2,5,'','',1,'0000-00-00','',0,'',0,0),(3,9,'','',1,'0000-00-00','',0,'',0,0),(4,10,'','',1,'0000-00-00','',0,'',0,0);

/*Table structure for table `t_labrrf_ctgy_mas` */

DROP TABLE IF EXISTS `t_labrrf_ctgy_mas`;

CREATE TABLE `t_labrrf_ctgy_mas` (
  `labrrf_ctgy_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `labrrf_ctgy_name` varchar(45) DEFAULT NULL,
  `labrrf_ctgy_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`labrrf_ctgy_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `t_labrrf_ctgy_mas` */

insert  into `t_labrrf_ctgy_mas`(`labrrf_ctgy_id_pk`,`labrrf_ctgy_name`,`labrrf_ctgy_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'Desktop Configuration','Desktop Configuration',1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(2,'Laptop Configuration','Laptop Configuration',1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(3,'Other Configurations','Other Configurations',1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1);

/*Table structure for table `t_labrrf_subctgy_mas` */

DROP TABLE IF EXISTS `t_labrrf_subctgy_mas`;

CREATE TABLE `t_labrrf_subctgy_mas` (
  `labrrf_subctgy_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `labrrf_ctgy_id_fk` int(11) NOT NULL,
  `labrrf_subctgy_name` varchar(45) DEFAULT NULL,
  `labrrf_subctgy_desc` text,
  `soundex` varchar(45) DEFAULT NULL,
  `defined_fields` int(11) DEFAULT '0' COMMENT '1 - Predefined\n0 - User defined',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`labrrf_subctgy_id_pk`),
  UNIQUE KEY `uni_group` (`labrrf_ctgy_id_fk`,`labrrf_subctgy_name`),
  KEY `fk_t_labrrf_subctgy_mas_t_labrrf_ctgy_mas1_idx` (`labrrf_ctgy_id_fk`),
  CONSTRAINT `fk_t_labrrf_subctgy_mas_t_labrrf_ctgy_mas1` FOREIGN KEY (`labrrf_ctgy_id_fk`) REFERENCES `t_labrrf_ctgy_mas` (`labrrf_ctgy_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

/*Data for the table `t_labrrf_subctgy_mas` */

insert  into `t_labrrf_subctgy_mas`(`labrrf_subctgy_id_pk`,`labrrf_ctgy_id_fk`,`labrrf_subctgy_name`,`labrrf_subctgy_desc`,`soundex`,`defined_fields`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,1,'Configuration Required ( Including OS )','Configuration Required ( Including OS )','C5126356263524352',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(2,1,'Memory Required','Memory Required','M6263',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(3,1,'HDD','HDD','H300',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(4,2,'Configuration Required ( Including OS )','Configuration Required ( Including OS )','C5126356263524352',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(5,2,'Memory Required','Memory Required','M6263',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(6,2,'HDD','HDD','H300',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(7,3,'Other Software Required','Other Software Required','O362136263',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(8,3,'Email / Chat Requirements','Email / Chat Requirements','E5423626532',1,1,1,'2016-01-22 00:00:00','2016-01-22 00:00:00',1),(9,1,'test@4555555555555','test@4555555555555','test@4555555555555',0,1,1,'2016-01-27 21:21:34','2016-01-27 21:21:34',1),(10,2,'test@4555555555555','test@4555555555555','test@4555555555555',0,1,1,'2016-01-27 21:21:44','2016-01-27 21:21:44',1),(11,3,'test@4555555555555','test@4555555555555','test@4555555555555',0,1,1,'2016-01-27 21:21:49','2016-01-27 21:21:49',1),(12,3,'test@11111111111111','test@11111111111111','test@11111111111111',0,1,1,'2016-01-27 21:25:58','2016-01-27 21:25:58',1),(13,1,'hdd22345678','hdd22345678','hdd22345678',0,1,1,'2016-01-28 13:51:03','2016-01-28 13:51:03',1),(14,1,'hdd22345678@34567890','hdd22345678@34567890','hdd22345678@34567890',0,1,1,'2016-01-28 13:51:16','2016-01-28 13:51:16',1),(15,3,'TEST','TEST','TEST',0,1,1,'2016-01-28 13:52:04','2016-01-28 13:52:04',1),(16,1,NULL,NULL,NULL,0,1,1,'2016-01-29 19:07:27','2016-01-29 19:07:27',1),(17,3,'gfh','gfh','gfh',0,1,1,'2016-03-10 18:47:26','2016-03-10 18:47:26',1),(18,2,'fghfg','fghfg','fghfg',0,1,1,'2016-03-10 19:55:10','2016-03-10 19:55:10',1),(19,1,'ghj','ghj','ghj',0,1,1,'2016-03-10 19:55:22','2016-03-10 19:55:22',1),(20,1,'fgf','fgf','fgf',0,1,1,'2016-03-10 19:56:31','2016-03-10 19:56:31',1),(21,1,'asdf','asdf','asdf',0,1,1,'2016-06-04 18:34:17','2016-06-04 18:34:17',1);

/*Table structure for table `t_labrrf_trans` */

DROP TABLE IF EXISTS `t_labrrf_trans`;

CREATE TABLE `t_labrrf_trans` (
  `labrrf_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `labrrf_ctgy_id_fk` int(11) NOT NULL,
  `labrrf_subctgy_id_fk` int(11) NOT NULL,
  `labrrf_trans_mas_id_fk` int(11) NOT NULL,
  `labrrf_trans_desc` text,
  `labrrf_trans_remarks` text,
  `project_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`labrrf_trans_id_pk`),
  KEY `fk_t_labrrf_trans_t_labrrf_trans_mas1_idx` (`labrrf_trans_mas_id_fk`),
  KEY `fk_t_labrrf_trans_t_labrrf_ctgy_mas1_idx` (`labrrf_ctgy_id_fk`),
  KEY `fk_t_labrrf_trans_t_labrrf_subctgy_mas1_idx` (`labrrf_subctgy_id_fk`),
  KEY `fk_t_labrrf_trans_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_labrrf_trans_t_labrrf_ctgy_mas1` FOREIGN KEY (`labrrf_ctgy_id_fk`) REFERENCES `t_labrrf_ctgy_mas` (`labrrf_ctgy_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_labrrf_trans_t_labrrf_subctgy_mas1` FOREIGN KEY (`labrrf_subctgy_id_fk`) REFERENCES `t_labrrf_subctgy_mas` (`labrrf_subctgy_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_labrrf_trans_t_labrrf_trans_mas1` FOREIGN KEY (`labrrf_trans_mas_id_fk`) REFERENCES `t_labrrf_trans_mas` (`idt_labrrf_trans_mas_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_labrrf_trans_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

/*Data for the table `t_labrrf_trans` */

insert  into `t_labrrf_trans`(`labrrf_trans_id_pk`,`labrrf_ctgy_id_fk`,`labrrf_subctgy_id_fk`,`labrrf_trans_mas_id_fk`,`labrrf_trans_desc`,`labrrf_trans_remarks`,`project_id_fk`) values (1,1,1,1,NULL,NULL,5),(2,1,2,1,NULL,NULL,5),(3,1,3,1,NULL,NULL,5),(4,2,4,1,NULL,NULL,5),(5,2,5,1,NULL,NULL,5),(6,2,6,1,NULL,NULL,5),(7,3,7,1,NULL,NULL,5),(8,3,8,1,NULL,NULL,5),(9,1,1,2,NULL,NULL,9),(10,1,2,2,NULL,NULL,9),(11,1,3,2,NULL,NULL,9),(12,2,4,2,NULL,NULL,9),(13,2,5,2,NULL,NULL,9),(14,2,6,2,NULL,NULL,9),(15,3,7,2,NULL,NULL,9),(16,3,8,2,NULL,NULL,9),(24,1,1,3,NULL,NULL,10),(25,1,2,3,NULL,NULL,10),(26,1,3,3,NULL,NULL,10),(27,2,4,3,NULL,NULL,10),(28,2,5,3,NULL,NULL,10),(29,2,6,3,NULL,NULL,10),(30,3,7,3,NULL,NULL,10),(31,3,8,3,NULL,NULL,10);

/*Table structure for table `t_labrrf_trans_mas` */

DROP TABLE IF EXISTS `t_labrrf_trans_mas`;

CREATE TABLE `t_labrrf_trans_mas` (
  `idt_labrrf_trans_mas_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_id_fk` int(11) NOT NULL,
  `account_manager` varchar(45) DEFAULT NULL,
  `final_version` varchar(45) DEFAULT NULL,
  `timezone_id_fk` int(11) NOT NULL,
  `roll_out_date` date DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `no_of_postion` int(11) DEFAULT NULL,
  `emp_details` text COMMENT 'Emp Name/ID/Email/Seat\n',
  `hs_no_of_seat` int(11) DEFAULT NULL,
  `hs_no_of_systems` int(11) DEFAULT NULL,
  PRIMARY KEY (`idt_labrrf_trans_mas_id_pk`),
  KEY `fk_t_labrrf_trans_mas_t_timezone_mas1_idx` (`timezone_id_fk`),
  KEY `fk_t_labrrf_trans_mas_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_labrrf_trans_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_labrrf_trans_mas_t_timezone_mas1` FOREIGN KEY (`timezone_id_fk`) REFERENCES `t_timezone_mas` (`timezone_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `t_labrrf_trans_mas` */

insert  into `t_labrrf_trans_mas`(`idt_labrrf_trans_mas_id_pk`,`project_id_fk`,`account_manager`,`final_version`,`timezone_id_fk`,`roll_out_date`,`location`,`no_of_postion`,`emp_details`,`hs_no_of_seat`,`hs_no_of_systems`) values (1,5,'','',1,'0000-00-00','',0,'',0,0),(2,9,'','',1,'0000-00-00','',0,'',0,0),(3,10,'','',1,'0000-00-00','',0,'',0,0);

/*Table structure for table `t_location_mas` */

DROP TABLE IF EXISTS `t_location_mas`;

CREATE TABLE `t_location_mas` (
  `location_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `location_name` varchar(45) DEFAULT NULL,
  `location_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`location_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `t_location_mas` */

insert  into `t_location_mas`(`location_id_pk`,`location_name`,`location_desc`,`created_by`,`updated_by`,`status`,`created_date`,`updated_date`) values (1,'AMBIT IT Park','AMBIT',1,1,1,'2016-01-18 00:00:00','2016-07-11 23:04:41'),(4,'Shriram Gateway','8th Floor, Block A6, Shriram Gateway # 16 GST Road, Perungalathur, Chennai – 600 063',1,1,1,'2016-01-21 19:59:24','2016-01-21 20:05:20'),(5,'Dalian Hi-tech Industrial Zone','Dalian Ascendas IT Park',1,1,1,'2016-05-17 22:44:29','2016-05-17 22:44:29'),(6,'Costa Rica','sdfsdf',1,1,1,'2016-06-22 20:11:28','2016-06-22 20:11:28'),(7,'Utah','sdfsdf',1,1,1,'2016-06-22 20:11:48','2016-06-22 20:11:48'),(8,'Poland','sdfsdf',1,1,1,'2016-06-22 20:12:01','2016-06-22 20:12:01'),(9,'test','test',1,1,1,'2016-06-24 19:25:37','2016-06-24 19:25:37'),(10,'test1','remark',1,1,1,'2016-06-27 14:02:25','2016-06-27 14:02:25');

/*Table structure for table `t_mailtpl_mas` */

DROP TABLE IF EXISTS `t_mailtpl_mas`;

CREATE TABLE `t_mailtpl_mas` (
  `mailtpl_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `mailtpl_name` varchar(256) NOT NULL,
  `mailtpl_subject` text NOT NULL,
  `mailtpl_content` text NOT NULL,
  `mailtpl_key` varchar(45) NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  PRIMARY KEY (`mailtpl_id_pk`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

/*Data for the table `t_mailtpl_mas` */

insert  into `t_mailtpl_mas`(`mailtpl_id_pk`,`mailtpl_name`,`mailtpl_subject`,`mailtpl_content`,`mailtpl_key`,`created_by`,`updated_by`,`created_date`,`updated_date`) values (1,'Mom Meeting Invite','Meeting Invite On #START_DATE#','<p>&nbsp;</p>\n\n<p style=\"color: rgb(51, 51, 51);\">Hi,&nbsp;</p>\n\n<p style=\"color: rgb(51, 51, 51);\"><strong>MOM Meeting Invitation Details</strong></p>\n\n<p style=\"color: rgb(51, 51, 51);\">Title: #TITLE#</p>\n\n<p style=\"color: rgb(51, 51, 51);\">Location: #LOCATION#</p>\n\n<p style=\"color: rgb(51, 51, 51);\">Date : #START_DATE# #START_TIME# to #END_DATE# #END_TIME#</p>\n\n<p style=\"color: rgb(51, 51, 51);\">Agenda: #AGENDA#</p>\n\n<p style=\"color: rgb(51, 51, 51);\">TimeZone: #TIME_ZONE#</p>\n\n<p style=\"color: rgb(51, 51, 51);\">Invitee: #INVITEE#</p>\n\n<p style=\"color: rgb(51, 51, 51);\"><br />\nregards</p>\n\n<p style=\"color: rgb(51, 51, 51);\">#CREATOR#</p>\n<!--EndFragment-->','invitetpl',3,3,'2016-02-09 19:19:13','2016-02-19 16:17:53'),(2,'Attendance Template','Attendance','<p>Hi Team,</p>\n\n<p>The agent <strong>#AgentName#(#EmpID#)</strong> marked the attendance as <strong>#AttendanceDesc#</strong> for the date<strong>(#AtteDate#)</strong>.</p>\n\n<p>Thanks<br />\n<strong>SR Admin.</strong></p>\n','attendancetpl',3,3,'2016-02-17 16:34:30','2016-02-17 16:54:05'),(3,'AgentScore Temp','Agent Score','<p>Hi Team ,<br />\nThe agent <strong>#AgentName#</strong>(<strong>#EmpID#</strong>) scores in <strong>#CateName#</strong> .</p>\n\n<p>&nbsp;</p>\n\n<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\">\n	<tbody>\n		<tr>\n			<td><strong>Thershold</strong></td>\n			<td><strong>Initial Assessment</strong></td>\n			<td><strong>Mid Assessment</strong></td>\n			<td><strong>Final Assessment</strong></td>\n		</tr>\n		<tr>\n			<td>#Thresholdscore#</td>\n			<td>#InitAssess#</td>\n			<td>#midAsses#</td>\n			<td>#finalAsses#</td>\n		</tr>\n	</tbody>\n</table>\n\n<p>&nbsp;</p>\n\n<p>Thanks&nbsp;</p>\n\n<p>SR Team</p>\n','agntscrtpl',3,3,'2016-02-17 17:46:22','2016-02-17 18:52:06'),(4,'Employee Selection','New Experts','<p>Hi Team,<br />\nThe new expert has been added to the division&nbsp;<strong>#DivName#</strong>.</p>\n\n<p>Name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; : <strong>#AgentName#</strong><br />\nID &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; : <strong>#EmpID#</strong><br />\nEmail &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;: <strong>#EmpEmail#</strong><br />\nProject &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;: <strong>#Mapproj#</strong><br />\nDOJ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;: <strong>#DOJ#</strong><br />\nDesignation &nbsp;:<strong> #Desig#</strong></p>\n\n<p>&nbsp;</p>\n\n<p>Thanks</p>\n\n<p>SR Team</p>\n','newagentseltpl',3,3,'2016-02-17 20:39:32','2016-02-17 20:44:49'),(5,'Project Plan','Project Plan Approval','<p>Hi #ProjectName# Team,</p>\n\n<p>Project Plan is waiting for your sign off .</p>\n\n<p>Kindly review and update .</p>\n\n<p>Project Name &nbsp;: &nbsp;<strong><span style=\"background-color: rgb(255, 255, 255);\">#ProjectName#</span></strong><br />\nPlan Phase &nbsp; &nbsp; : &nbsp;<strong><span style=\"background-color: rgb(255, 255, 255);\">#PlanPhase#</span></strong></p>\n\n<p>&nbsp;</p>\n\n<p><span style=\"background-color: rgb(255, 255, 255);\">Thanks</span></p>\n\n<p><span style=\"background-color: rgb(255, 255, 255);\">SR Team</span></p>\n','projectplantpl',3,3,'2016-02-18 15:25:54','2016-02-24 00:13:12'),(6,'Capex Singoff Template','Capex Signoff for #PROJECT_NAME#','<p>Hi,</p>\n\n<p>The project <strong>#PROJECT_NAME#</strong>&nbsp;signoff to your bucket (<strong>#ROLE_NAME#</strong>)</p>\n\n<p>Thanks</p>\n\n<p>SR Admin</p>\n','capextpl',3,3,'2016-02-19 11:59:28','2016-02-19 12:17:07'),(7,'Project Plan Reject','Project plan Status','<p>Hi Team,<br />\nThe project plan for the <strong>#ProjectName#</strong> has been <strong>#ApproveStatus#</strong>&nbsp;.</p>\n\n<p>Due to<strong> #ClientComments#</strong>.</p>\n\n<p>Thanks<br />\n<strong>#ClientName#</strong></p>\n','clientrejecttpl',3,3,'2016-02-19 13:10:10','2016-02-19 13:10:10'),(8,'Project Plan Approve','Project plan Status','<p>Hi Team,<br />\nThe project plan for the&nbsp;<strong>#ProjectName#</strong>&nbsp;has been&nbsp;<strong>#ApproveStatus#</strong>&nbsp;.</p>\n\n<p>&nbsp;</p>\n\n<p><span style=\"line-height: 1.42857;\">Thanks</span></p>\n\n<p><strong>#ClientName#</strong></p>\n','clientapprovetpl',3,3,'2016-02-19 13:11:08','2016-02-19 13:11:08'),(9,'Action Item Template','#TYPE# Action Item Assigned to #USERNAME#','<p>Hi&nbsp;#USERNAME#,</p>\n\n<p>This action item assigned to <span style=\"background-color: rgb(255, 255, 255);\">#USERNAME#,</span></p>\n\n<p>Due Date: #DUE_DATE#</p>\n\n<p>Remainder: #REMAINDER#</p>\n\n<p>Status: #STATUS#</p>\n\n<p><span style=\"background-color: rgb(255, 255, 255);\">Agenda: #AGENDA#</span></p>\n\n<p>Regards,</p>\n\n<p>SR Portal</p>\n','actionitemtpl',3,3,'2016-02-19 13:32:35','2016-02-19 15:22:33'),(10,'Action Item Template','#TYPE# Action Item to #USERNAME#','<p>Hi&nbsp;#USERNAME#,</p>\n\n<p>This action item assigned to <span style=\"background-color: rgb(255, 255, 255);\">#USERNAME#,</span></p>\n\n<p>Due Date: #DUE_DATE#</p>\n\n<p>Remainder: #REMAINDER#</p>\n\n<p>Status: #STATUS#</p>\n\n<p>Regards,</p>\n\n<p>SR Portal</p>\n','actiontpl',3,3,'2016-02-19 13:32:39','2016-02-19 13:32:39'),(11,'Communication Matrix Client Mail','Communication Matrix Update in #PROJECT_NAME#','<p>Hi,</p>\n\n<p>Communication Matrix Update in <strong>#PROJECT_NAME#</strong> in section <strong>#SECTION_NAME#</strong></p>\n\n<p>regards,</p>\n\n<p>#LOG_USERNAME#</p>\n','commatrix_cemail',3,3,'2016-02-22 12:49:15','2016-02-22 12:49:15'),(12,'Communication Matrix Mail Row Wise','Communication Matrix #TYPE# in #PROJECT_NAME#','<p>Hi Team ,<br />\nThe Communication Matrix has been #TYPE# the following section <strong>#PROJECT_NAME#</strong>(<strong>#SECTION_NAME#</strong>).</p>\n\n<p>&nbsp;</p>\n\n<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\">\n	<tbody>\n		<tr>\n            <td><strong>Project</strong></td>\n			<td><strong>Stake holder Name</strong></td>\n			<td><strong>Role</strong></td>\n			<td><strong>Official Mail</strong></td>\n			<td><strong>Office Telephone</strong></td>\n			<td><strong>Mobile</strong></td>\n			<td><strong>SubComm</strong></td>\n			<td><strong>Time Zone</strong></td>\n		</tr>\n		<tr>\n			<td>#PROJECT_NAME#</td>\n			<td>#STACKHOLDER_NAME#</td>\n			<td>#ROLE#</td>\n			<td>#OFFICIAL_MAIL#</td>\n			<td>#OFFICIAL_PHONE#</td>\n			<td>#MOBILE#</td>\n			<td>#SUBCOMM#</td>\n			<td>#TIMEZONE#</td>\n		</tr>\n	</tbody>\n</table>\n\n<p>&nbsp;</p>\n\n<p>Thanks&nbsp;</p>\n\n<p>SR Team</p>\n','commatrix_rowtpl',3,3,'2016-02-22 18:00:33','2016-02-22 18:00:33'),(13,'Go Live Heads Up Mail','Go Live Heads Up Meeting','<p style=\"margin-bottom: 0in\">Dear All,</p>\n\n<p style=\"margin-bottom: 0in\">We are currently at the final phase of completing transitioning of services <span style=\"line-height: 18.5714px; background-color: rgb(255, 255, 255);\">for the project&nbsp;</span><strong style=\"line-height: 18.5714px; background-color: rgb(255, 255, 255);\">#ProjectName#</strong>, and are 5 days away from commencing operations at our location.</p>\n\n<p style=\"margin-bottom: 0in\">In lieu of the same, a meeting will be hosted 48 hours ahead of the go-live so as to test accessibility of all services required for Go-Live.</p>\n\n<p style=\"margin-bottom: 0in\">We thank each of you for your relentless support and request continuance of the same as we come closer to the day of realization of all our efforts.</p>\n\n<p style=\"margin-bottom: 0in\">Regards,</p>\n\n<p style=\"margin-bottom: 0in\">The Service Readiness Team.</p>\n','goliveheadsuptpl',3,3,'2016-03-16 13:36:26','2016-03-16 15:43:39'),(14,'Project Paln','Overdue Task Item','<p>Dear All, &nbsp;</p>\n\n<p>The Project #ProjName# with #taskName# is overdue.</p>\n\n<p>&nbsp;</p>\n\n<p>Thanks</p>\n\n<p>SR Team</p>\n','projectplanalerttpl',3,3,'2016-03-22 15:40:27','2016-03-22 15:40:27'),(15,'sample','sample','<p>sample</p>\n','sample',3,3,'2016-06-22 18:27:27','2016-06-22 18:27:27');

/*Table structure for table `t_man_hours_calc_mas` */

DROP TABLE IF EXISTS `t_man_hours_calc_mas`;

CREATE TABLE `t_man_hours_calc_mas` (
  `man_hours_calc_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_id_fk` int(11) NOT NULL,
  `cost_per_hour_effort` double DEFAULT NULL,
  `tot_man_hour` double DEFAULT NULL,
  `overall_effort` double DEFAULT NULL,
  PRIMARY KEY (`man_hours_calc_id_pk`),
  KEY `fk_t_man_hours_calc_mas_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_man_hours_calc_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `t_man_hours_calc_mas` */

insert  into `t_man_hours_calc_mas`(`man_hours_calc_id_pk`,`project_id_fk`,`cost_per_hour_effort`,`tot_man_hour`,`overall_effort`) values (1,3,0,0,0),(2,1,0,0,0),(3,5,0,0,0),(4,7,0,5,50),(5,10,0,0,0),(6,8,0,0,0);

/*Table structure for table `t_man_hours_calc_trans` */

DROP TABLE IF EXISTS `t_man_hours_calc_trans`;

CREATE TABLE `t_man_hours_calc_trans` (
  `man_hours_calc_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `man_hours_calc_id_fk` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `recurrence` int(11) DEFAULT NULL,
  `minutes` int(11) DEFAULT NULL,
  `overall_minutes` int(11) DEFAULT NULL,
  `manhours` double(10,2) DEFAULT NULL,
  `effort_cost` double(10,2) DEFAULT NULL,
  `costperhour` float(10,2) DEFAULT NULL,
  PRIMARY KEY (`man_hours_calc_trans_id_pk`),
  KEY `fk_t_man_hours_calc_trans_t_man_hours_calc_mas1_idx` (`man_hours_calc_id_fk`),
  CONSTRAINT `fk_t_man_hours_calc_trans_t_man_hours_calc_mas1` FOREIGN KEY (`man_hours_calc_id_fk`) REFERENCES `t_man_hours_calc_mas` (`man_hours_calc_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `t_man_hours_calc_trans` */

insert  into `t_man_hours_calc_trans`(`man_hours_calc_trans_id_pk`,`man_hours_calc_id_fk`,`name`,`recurrence`,`minutes`,`overall_minutes`,`manhours`,`effort_cost`,`costperhour`) values (1,4,'Naga',2,120,240,4.00,40.00,10.00),(2,4,'Mithran',1,60,60,1.00,10.00,10.00),(3,6,'Flex Clement',40,60,2400,40.00,600.00,15.00);

/*Table structure for table `t_meeting_action_items_trans` */

DROP TABLE IF EXISTS `t_meeting_action_items_trans`;

CREATE TABLE `t_meeting_action_items_trans` (
  `action_items_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `ai_notes` text NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `reminder_days` int(11) DEFAULT NULL,
  `email_id` varchar(100) DEFAULT NULL,
  `user_id_fk` int(11) NOT NULL,
  `meeting_mas_id_fk` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  PRIMARY KEY (`action_items_trans_id_pk`),
  KEY `fk_t_meeting_action_items_trans_t_user_mas1_idx` (`user_id_fk`),
  KEY `fk_t_meeting_action_items_trans_t_meeting_mas1_idx` (`meeting_mas_id_fk`),
  CONSTRAINT `fk_t_meeting_action_items_trans_t_meeting_mas1` FOREIGN KEY (`meeting_mas_id_fk`) REFERENCES `t_meeting_mas` (`meeting_mas_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

/*Data for the table `t_meeting_action_items_trans` */

insert  into `t_meeting_action_items_trans`(`action_items_trans_id_pk`,`ai_notes`,`due_date`,`status`,`reminder_days`,`email_id`,`user_id_fk`,`meeting_mas_id_fk`,`created_by`,`updated_by`,`created_date`,`updated_date`) values (1,'Marketo to Share the Training Curriculum','2016-07-12',2,2,NULL,2,1,1,1,'2016-07-12 02:22:21','2016-07-12 02:22:21'),(2,'Marketo to Share the Training Curriculum','2016-07-12',2,2,NULL,2,1,1,1,'2016-07-12 02:22:24','2016-07-12 02:22:24'),(3,'Marketo to Share the Training Curriculum','2016-07-12',2,2,NULL,2,1,1,1,'2016-07-12 02:22:25','2016-07-12 02:22:25'),(4,'Marketo to Share the Training Curriculum','2016-07-12',2,2,NULL,2,1,1,1,'2016-07-12 02:22:25','2016-07-12 02:22:25'),(5,'Marketo to Share the Training Curriculum','2016-07-12',2,2,NULL,2,1,1,1,'2016-07-12 02:22:25','2016-07-12 02:22:25'),(6,'Marketo to Share the Training Curriculum','2016-07-12',2,2,NULL,2,1,1,1,'2016-07-12 02:22:28','2016-07-12 02:22:28'),(7,'Completed','2016-07-13',3,1,NULL,1,1,2,2,'2016-07-12 22:58:33','2016-07-12 22:58:33'),(8,'Completed','2016-07-13',3,1,NULL,1,1,2,2,'2016-07-12 22:58:37','2016-07-12 22:58:37'),(9,'Followup on the Training Curriculum','2016-07-13',2,0,NULL,2,1,1,1,'2016-07-12 23:00:53','2016-07-12 23:00:53'),(10,'Completed','2016-07-13',3,1,NULL,1,1,2,2,'2016-07-12 23:07:18','2016-07-12 23:07:18'),(11,'Completed','2016-07-13',3,0,NULL,2,1,1,1,'2016-07-12 23:08:11','2016-07-12 23:08:11'),(42,'test','2016-07-29',1,3,'test@email.com',0,9,5,5,'2016-07-28 16:05:29','2016-07-28 16:05:29'),(43,'test1','2016-07-29',2,2,'test@email.com',0,8,5,5,'2016-07-29 14:29:23','2016-07-29 14:29:23'),(44,'newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest newtest','0000-00-00',3,3,'test@email.com',0,9,5,5,'2016-07-29 14:30:49','2016-07-29 14:33:24');

/*Table structure for table `t_meeting_attachment_trans` */

DROP TABLE IF EXISTS `t_meeting_attachment_trans`;

CREATE TABLE `t_meeting_attachment_trans` (
  `meeting_attach_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `meeting_mas_id_fk` int(11) NOT NULL,
  `file_name` text,
  `file_path` text,
  `uploaded_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`meeting_attach_id_pk`),
  KEY `fk_t_meeting_joinee_t_meeting_mas1_idx` (`meeting_mas_id_fk`),
  CONSTRAINT `fk_t_meeting_joinee_t_meeting_mas10` FOREIGN KEY (`meeting_mas_id_fk`) REFERENCES `t_meeting_mas` (`meeting_mas_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_meeting_attachment_trans` */

/*Table structure for table `t_meeting_comments_trans` */

DROP TABLE IF EXISTS `t_meeting_comments_trans`;

CREATE TABLE `t_meeting_comments_trans` (
  `comments_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `comments` text,
  `comments_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`comments_trans_id_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_meeting_comments_trans` */

/*Table structure for table `t_meeting_joinee_trans` */

DROP TABLE IF EXISTS `t_meeting_joinee_trans`;

CREATE TABLE `t_meeting_joinee_trans` (
  `meeting_joinee_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `meeting_mas_id_fk` int(11) NOT NULL,
  `accepted` int(11) DEFAULT NULL,
  `user_id_fk` int(11) NOT NULL,
  `email_id` varchar(45) DEFAULT NULL,
  `present` int(11) DEFAULT NULL,
  PRIMARY KEY (`meeting_joinee_id_pk`),
  KEY `fk_t_meeting_joinee_t_meeting_mas1_idx` (`meeting_mas_id_fk`),
  KEY `fk_t_meeting_joinee_t_user_mas1_idx` (`user_id_fk`),
  CONSTRAINT `fk_t_meeting_joinee_t_meeting_mas1` FOREIGN KEY (`meeting_mas_id_fk`) REFERENCES `t_meeting_mas` (`meeting_mas_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_meeting_joinee_t_user_mas1` FOREIGN KEY (`user_id_fk`) REFERENCES `t_user_mas` (`user_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_meeting_joinee_trans` */

/*Table structure for table `t_meeting_mas` */

DROP TABLE IF EXISTS `t_meeting_mas`;

CREATE TABLE `t_meeting_mas` (
  `meeting_mas_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `meeting_title` varchar(45) DEFAULT NULL,
  `meeting_location` varchar(45) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `start_date_time` datetime NOT NULL,
  `end_date_time` datetime NOT NULL,
  `timezone` varchar(128) NOT NULL,
  `comments` text,
  `meeting_discussion` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`meeting_mas_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `t_meeting_mas` */

insert  into `t_meeting_mas`(`meeting_mas_id_pk`,`meeting_title`,`meeting_location`,`start_date`,`end_date`,`start_time`,`end_time`,`start_date_time`,`end_date_time`,`timezone`,`comments`,`meeting_discussion`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'Marketo Service Readiness Status update meeti','CSS Bridge','2016-07-11','2016-07-11','11:30:00','12:30:00','2016-07-11 11:30:00','2016-07-11 12:30:00','Asia/Kolkata','Recruitment\n•	CSS Recruitment process has been completed and the agents will be on-boarded on July 15th \n•	3 Internal agents and 5 external candidates has been shortlisted\n•	Number of agents (6 or 8) to enter the production floor will be decided by Marketo trainers before moving in to Nesting phase\n\nTraining:\n•	The first Marketo trainer, Robert will be in Chennai on Aug 3rd \n•	Foundation training course starts on Aug 2nd and 3rd 9AM – 4PM PST. It will be a virtual online training session\n•	Online Training session requirements: Marketo trainer will be projecting the training content remotely through free software and the agents does not need any user credentials to login\n•	Onsite Training start and end time will be decided later\n•	Overall 3 trainers will be travelling to Chennai each will be handling 2 weeks of training\n•	1st trainer Robert is from US, 2nd trainer is from Dublin and 3rd trainer cum Manager is from US\n•	End of Aug or first week of September, Roger and Mohan will be travelling to Chennai\n•	Project Go-live will be split in to 2 phases: Phase 1 – first 2 weeks agents will be handling North America support from 9AM – 6PM PST. All agents will be doing 9 Hours shift\n•	Phase 2 – APAC and Europe will move in to 24 hours support from 2nd week\n•	Initially agent’s shifts will be equally split, 2 agents in a shift starting from 12th Sept’16\n•	Based on the case arrival pattern later agents will be scheduled accordingly',NULL,1,1,'2016-07-12 02:21:20','2016-07-12 02:21:20',1),(2,'Marketo Service Readiness Status update meeti','CSS Bridge','2016-07-11','2016-07-11','11:30:00','12:30:00','2016-07-11 11:30:00','2016-07-11 12:30:00','Asia/Kolkata','Recruitment\n•	CSS Recruitment process has been completed and the agents will be on-boarded on July 15th \n•	3 Internal agents and 5 external candidates has been shortlisted\n•	Number of agents (6 or 8) to enter the production floor will be decided by Marketo trainers before moving in to Nesting phase\n\nTraining:\n•	The first Marketo trainer, Robert will be in Chennai on Aug 3rd \n•	Foundation training course starts on Aug 2nd and 3rd 9AM – 4PM PST. It will be a virtual online training session\n•	Online Training session requirements: Marketo trainer will be projecting the training content remotely through free software and the agents does not need any user credentials to login\n•	Onsite Training start and end time will be decided later\n•	Overall 3 trainers will be travelling to Chennai each will be handling 2 weeks of training\n•	1st trainer Robert is from US, 2nd trainer is from Dublin and 3rd trainer cum Manager is from US\n•	End of Aug or first week of September, Roger and Mohan will be travelling to Chennai\n•	Project Go-live will be split in to 2 phases: Phase 1 – first 2 weeks agents will be handling North America support from 9AM – 6PM PST. All agents will be doing 9 Hours shift\n•	Phase 2 – APAC and Europe will move in to 24 hours support from 2nd week\n•	Initially agent’s shifts will be equally split, 2 agents in a shift starting from 12th Sept’16\n•	Based on the case arrival pattern later agents will be scheduled accordingly',NULL,1,1,'2016-07-12 02:21:25','2016-07-12 02:21:25',1),(3,'Marketo Service Readiness Status update meeti','CSS Bridge','2016-07-11','2016-07-11','11:30:00','12:30:00','2016-07-11 11:30:00','2016-07-11 12:30:00','Asia/Kolkata','Recruitment\n•	CSS Recruitment process has been completed and the agents will be on-boarded on July 15th \n•	3 Internal agents and 5 external candidates has been shortlisted\n•	Number of agents (6 or 8) to enter the production floor will be decided by Marketo trainers before moving in to Nesting phase\n\nTraining:\n•	The first Marketo trainer, Robert will be in Chennai on Aug 3rd \n•	Foundation training course starts on Aug 2nd and 3rd 9AM – 4PM PST. It will be a virtual online training session\n•	Online Training session requirements: Marketo trainer will be projecting the training content remotely through free software and the agents does not need any user credentials to login\n•	Onsite Training start and end time will be decided later\n•	Overall 3 trainers will be travelling to Chennai each will be handling 2 weeks of training\n•	1st trainer Robert is from US, 2nd trainer is from Dublin and 3rd trainer cum Manager is from US\n•	End of Aug or first week of September, Roger and Mohan will be travelling to Chennai\n•	Project Go-live will be split in to 2 phases: Phase 1 – first 2 weeks agents will be handling North America support from 9AM – 6PM PST. All agents will be doing 9 Hours shift\n•	Phase 2 – APAC and Europe will move in to 24 hours support from 2nd week\n•	Initially agent’s shifts will be equally split, 2 agents in a shift starting from 12th Sept’16\n•	Based on the case arrival pattern later agents will be scheduled accordingly',NULL,1,1,'2016-07-12 02:23:20','2016-07-12 02:23:20',1),(4,'Marketo Service Readiness Status update meeti','CSS Bridge','2016-07-11','2016-07-11','11:30:00','12:30:00','2016-07-11 11:30:00','2016-07-11 12:30:00','Asia/Kolkata','Recruitment\n•	CSS Recruitment process has been completed and the agents will be on-boarded on July 15th \n•	3 Internal agents and 5 external candidates has been shortlisted\n•	Number of agents (6 or 8) to enter the production floor will be decided by Marketo trainers before moving in to Nesting phase\n\nTraining:\n•	The first Marketo trainer, Robert will be in Chennai on Aug 3rd \n•	Foundation training course starts on Aug 2nd and 3rd 9AM – 4PM PST. It will be a virtual online training session\n•	Online Training session requirements: Marketo trainer will be projecting the training content remotely through free software and the agents does not need any user credentials to login\n•	Onsite Training start and end time will be decided later\n•	Overall 3 trainers will be travelling to Chennai each will be handling 2 weeks of training\n•	1st trainer Robert is from US, 2nd trainer is from Dublin and 3rd trainer cum Manager is from US\n•	End of Aug or first week of September, Roger and Mohan will be travelling to Chennai\n•	Project Go-live will be split in to 2 phases: Phase 1 – first 2 weeks agents will be handling North America support from 9AM – 6PM PST. All agents will be doing 9 Hours shift\n•	Phase 2 – APAC and Europe will move in to 24 hours support from 2nd week\n•	Initially agent’s shifts will be equally split, 2 agents in a shift starting from 12th Sept’16\n•	Based on the case arrival pattern later agents will be scheduled accordingly',NULL,1,1,'2016-07-12 02:23:25','2016-07-12 02:23:25',1),(5,'Marketo Service Readiness Status update meeti','CSS Bridge','2016-07-11','2016-07-11','11:30:00','12:30:00','2016-07-11 11:30:00','2016-07-11 12:30:00','Asia/Kolkata','Recruitment\n•	CSS Recruitment process has been completed and the agents will be on-boarded on July 15th \n•	3 Internal agents and 5 external candidates has been shortlisted\n•	Number of agents (6 or 8) to enter the production floor will be decided by Marketo trainers before moving in to Nesting phase\n\nTraining:\n•	The first Marketo trainer, Robert will be in Chennai on Aug 3rd \n•	Foundation training course starts on Aug 2nd and 3rd 9AM – 4PM PST. It will be a virtual online training session\n•	Online Training session requirements: Marketo trainer will be projecting the training content remotely through free software and the agents does not need any user credentials to login\n•	Onsite Training start and end time will be decided later\n•	Overall 3 trainers will be travelling to Chennai each will be handling 2 weeks of training\n•	1st trainer Robert is from US, 2nd trainer is from Dublin and 3rd trainer cum Manager is from US\n•	End of Aug or first week of September, Roger and Mohan will be travelling to Chennai\n•	Project Go-live will be split in to 2 phases: Phase 1 – first 2 weeks agents will be handling North America support from 9AM – 6PM PST. All agents will be doing 9 Hours shift\n•	Phase 2 – APAC and Europe will move in to 24 hours support from 2nd week\n•	Initially agent’s shifts will be equally split, 2 agents in a shift starting from 12th Sept’16\n•	Based on the case arrival pattern later agents will be scheduled accordingly',NULL,1,1,'2016-07-12 02:25:20','2016-07-12 02:25:20',1),(6,'Marketo Service Readiness Status update meeti','CSS Bridge','2016-07-11','2016-07-11','11:30:00','12:30:00','2016-07-11 11:30:00','2016-07-11 12:30:00','Asia/Kolkata','Recruitment\n•	CSS Recruitment process has been completed and the agents will be on-boarded on July 15th \n•	3 Internal agents and 5 external candidates has been shortlisted\n•	Number of agents (6 or 8) to enter the production floor will be decided by Marketo trainers before moving in to Nesting phase\n\nTraining:\n•	The first Marketo trainer, Robert will be in Chennai on Aug 3rd \n•	Foundation training course starts on Aug 2nd and 3rd 9AM – 4PM PST. It will be a virtual online training session\n•	Online Training session requirements: Marketo trainer will be projecting the training content remotely through free software and the agents does not need any user credentials to login\n•	Onsite Training start and end time will be decided later\n•	Overall 3 trainers will be travelling to Chennai each will be handling 2 weeks of training\n•	1st trainer Robert is from US, 2nd trainer is from Dublin and 3rd trainer cum Manager is from US\n•	End of Aug or first week of September, Roger and Mohan will be travelling to Chennai\n•	Project Go-live will be split in to 2 phases: Phase 1 – first 2 weeks agents will be handling North America support from 9AM – 6PM PST. All agents will be doing 9 Hours shift\n•	Phase 2 – APAC and Europe will move in to 24 hours support from 2nd week\n•	Initially agent’s shifts will be equally split, 2 agents in a shift starting from 12th Sept’16\n•	Based on the case arrival pattern later agents will be scheduled accordingly',NULL,1,1,'2016-07-12 02:25:25','2016-07-12 02:25:25',1),(7,'Marketo Service Readiness Status update meeti','CSS Bridge','2016-07-11','2016-07-11','11:30:00','12:30:00','2016-07-30 11:30:00','2016-07-30 12:30:00','Asia/Kolkata','<p>Recruitment &bull; CSS Recruitment process has been completed and the agents will be on-boarded on July 15th &bull; 3 Internal agents and 5 external candidates has been shortlisted &bull; Number of agents (6 or 8) to enter the production floor will be decided by Marketo trainers before moving in to Nesting phase Training: &bull; The first Marketo trainer, Robert will be in Chennai on Aug 3rd &bull; Foundation training course starts on Aug 2nd and 3rd 9AM &ndash; 4PM PST. It will be a virtual online training session &bull; Online Training session requirements: Marketo trainer will be projecting the training content remotely through free software and the agents does not need any user credentials to login &bull; Onsite Training start and end time will be decided later &bull; Overall 3 trainers will be travelling to Chennai each will be handling 2 weeks of training &bull; 1st trainer Robert is from US, 2nd trainer is from Dublin and 3rd trainer cum Manager is from US &bull; End of Aug or first week of September, Roger and Mohan will be travelling to Chennai &bull; Project Go-live will be split in to 2 phases: Phase 1 &ndash; first 2 weeks agents will be handling North America support from 9AM &ndash; 6PM PST. All agents will be doing 9 Hours shift &bull; Phase 2 &ndash; APAC and Europe will move in to 24 hours support from 2nd week &bull; Initially agent&rsquo;s shifts will be equally split, 2 agents in a shift starting from 12th Sept&rsquo;16 &bull; Based on the case arrival pattern later agents will be scheduled accordingly</p>\n',NULL,1,5,'2016-07-12 02:27:20','2016-07-27 22:52:38',1),(8,'Marketo Service Readiness Status update meeti','CSS Bridge','2016-07-11','2016-07-11','11:30:00','12:30:00','2016-07-11 11:30:00','2016-07-30 12:30:00','Asia/Kolkata','<p>Recruitment &bull; CSS Recruitment process has been completed and the agents will be on-boarded on July 15th &bull; 3 Internal agents and 5 external candidates has been shortlisted &bull; Number of agents (6 or 8) to enter the production floor will be decided by Marketo trainers before moving in to Nesting phase Training: &bull; The first Marketo trainer, Robert will be in Chennai on Aug 3rd &bull; Foundation training course starts on Aug 2nd and 3rd 9AM &ndash; 4PM PST. It will be a virtual online training session &bull; Online Training session requirements: Marketo trainer will be projecting the training content remotely through free software and the agents does not need any user credentials to login &bull; Onsite Training start and end time will be decided later &bull; Overall 3 trainers will be travelling to Chennai each will be handling 2 weeks of training &bull; 1st trainer Robert is from US, 2nd trainer is from Dublin and 3rd trainer cum Manager is from US &bull; End of Aug or first week of September, Roger and Mohan will be travelling to Chennai &bull; Project Go-live will be split in to 2 phases: Phase 1 &ndash; first 2 weeks agents will be handling North America support from 9AM &ndash; 6PM PST. All agents will be doing 9 Hours shift &bull; Phase 2 &ndash; APAC and Europe will move in to 24 hours support from 2nd week &bull; Initially agent&rsquo;s shifts will be equally split, 2 agents in a shift starting from 12th Sept&rsquo;16 &bull; Based on the case arrival pattern later agents will be scheduled accordingly</p>\n',NULL,1,5,'2016-07-12 02:27:25','2016-07-27 22:58:39',1),(9,'Test','Ambit','2016-07-30','2016-07-30','06:00:00','09:00:00','2016-07-30 06:00:00','2016-07-30 09:00:00','America/Tijuana','<p>Test</p>\n',NULL,5,5,'2016-07-27 22:49:48','2016-07-27 22:49:48',1);

/*Table structure for table `t_module_mas` */

DROP TABLE IF EXISTS `t_module_mas`;

CREATE TABLE `t_module_mas` (
  `module_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `bucket_id_fk` int(11) NOT NULL,
  `module_name` varchar(45) DEFAULT NULL,
  `module_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `actual_name` varchar(45) DEFAULT NULL,
  `routing_path` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`module_id_pk`),
  KEY `fk_t_module_mas_t_bucket_mas1_idx` (`bucket_id_fk`),
  CONSTRAINT `fk_t_module_mas_t_bucket_mas1` FOREIGN KEY (`bucket_id_fk`) REFERENCES `t_bucket_mas` (`bucket_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

/*Data for the table `t_module_mas` */

insert  into `t_module_mas`(`module_id_pk`,`bucket_id_fk`,`module_name`,`module_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`,`actual_name`,`routing_path`) values (1,1,'Project Plan',NULL,NULL,NULL,NULL,NULL,1,'Project Plan','projectplan'),(2,1,'Dashboard',NULL,NULL,NULL,NULL,NULL,1,'Dashboard','dashboard'),(3,1,'Communication Matrix',NULL,NULL,NULL,NULL,NULL,1,'Communication Matrics','communicationMatrix'),(4,4,'Client',NULL,NULL,NULL,NULL,NULL,1,'Client','client'),(5,4,'New Project',NULL,NULL,NULL,NULL,NULL,1,'Create Project','newproject'),(6,4,'User Creation/Mapping',NULL,NULL,NULL,NULL,NULL,1,'User Creation/Mapping','userCreate'),(7,3,'Project Chart',NULL,NULL,NULL,NULL,NULL,1,'Sow Summary','sowsummary'),(8,3,'Invoice',NULL,NULL,NULL,NULL,NULL,1,'Invoice','invoice'),(9,6,'IT RRF',NULL,NULL,NULL,NULL,NULL,1,'IT RRF','itModule'),(10,6,'Lab RRF',NULL,NULL,NULL,NULL,NULL,1,'Lab RRF','labModule'),(11,6,'Capex/Opex',NULL,NULL,NULL,NULL,NULL,1,'Capex/Opex','Capex'),(12,7,'Create Resource',NULL,NULL,NULL,NULL,NULL,0,'Create Resource','create-resource'),(13,7,'Form A',NULL,NULL,NULL,NULL,NULL,1,'Form A','recruit-forma'),(14,7,'Client Form',NULL,NULL,NULL,NULL,NULL,1,'Client Form','recruit-client'),(15,7,'Form B',NULL,NULL,NULL,NULL,NULL,1,'Form B','recruit-formb'),(16,7,'Form C',NULL,NULL,NULL,NULL,NULL,1,'Form C','recruit-formc'),(17,7,'Form D',NULL,NULL,NULL,NULL,NULL,1,'Form D','recruit-formd'),(18,1,'Organizational Chart',NULL,NULL,NULL,NULL,NULL,1,'Org Chart','orgchart'),(19,2,'Meeting & MOM',NULL,NULL,NULL,NULL,NULL,1,'Meeting & Mom','meetingMom'),(20,1,'File Repository',NULL,NULL,NULL,NULL,NULL,1,'File Repository','filerepository'),(21,5,'Man Hours',NULL,NULL,NULL,NULL,NULL,1,'Man Hours Calculation','manHours'),(23,9,'Attendance',NULL,NULL,NULL,NULL,NULL,1,'Attendance','reportAttandance'),(24,9,'Assessment',NULL,NULL,NULL,NULL,NULL,1,'Assessment','reportAssessment'),(25,4,'Delivery Unit',NULL,NULL,NULL,NULL,NULL,1,'Delivery Unit','deliveryUnit'),(26,4,'Location',NULL,NULL,NULL,NULL,NULL,1,'Location','location'),(27,4,'Email Template',NULL,NULL,NULL,NULL,NULL,1,'Email Template','mailTemplate'),(28,2,'Action Item',NULL,NULL,NULL,NULL,NULL,1,'Action Item','actionItem'),(29,4,'Calendar',NULL,1,NULL,NULL,NULL,1,'Calendar','calendar'),(30,1,'Project Calendar',NULL,NULL,NULL,NULL,NULL,1,'Project Calendar','projectcalendar'),(31,10,'Service Delivery',NULL,3,NULL,NULL,NULL,1,'Service Delivery','servicedelivery'),(32,10,'Go Live',NULL,3,NULL,NULL,NULL,1,'Go Live','golive');

/*Table structure for table `t_notifications` */

DROP TABLE IF EXISTS `t_notifications`;

CREATE TABLE `t_notifications` (
  `notificatoin_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `notification_name` varchar(50) DEFAULT NULL,
  `notification_type` varchar(50) DEFAULT NULL,
  `notification_desc` varchar(1000) DEFAULT NULL,
  `user_id_fk` int(11) NOT NULL,
  `is_read` tinyint(4) DEFAULT '0',
  `created_date` datetime DEFAULT NULL,
  `unique_id` int(11) NOT NULL,
  PRIMARY KEY (`notificatoin_id_pk`),
  KEY `user_id_fk` (`user_id_fk`),
  CONSTRAINT `t_notifications_ibfk_1` FOREIGN KEY (`user_id_fk`) REFERENCES `t_user_mas` (`user_id_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_notifications` */

/*Table structure for table `t_org_chart_tpl_mas` */

DROP TABLE IF EXISTS `t_org_chart_tpl_mas`;

CREATE TABLE `t_org_chart_tpl_mas` (
  `tpl_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `tpl_name` varchar(45) DEFAULT NULL,
  `tpl_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`tpl_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `t_org_chart_tpl_mas` */

insert  into `t_org_chart_tpl_mas`(`tpl_id_pk`,`tpl_name`,`tpl_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'Marketo Template','Marketo Template',NULL,NULL,NULL,NULL,1),(2,'Google Org. Chart','Google Org. Chart',NULL,NULL,NULL,NULL,1),(3,'TrionWorlds','TrionWorlds',NULL,NULL,NULL,NULL,1),(4,'Google','Google',NULL,NULL,NULL,NULL,1),(5,'Microsoft','Microsoft',NULL,NULL,NULL,NULL,1);

/*Table structure for table `t_org_chart_tpl_trans` */

DROP TABLE IF EXISTS `t_org_chart_tpl_trans`;

CREATE TABLE `t_org_chart_tpl_trans` (
  `org_chart_tpl_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `designation` varchar(45) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `tpl_id_fk` int(11) NOT NULL,
  `org_chart_id_fk` int(11) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `profileurl` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`org_chart_tpl_trans_id_pk`),
  KEY `fk_t_org_chart_tpl_trans_t_org_chart_tpl_mas1_idx` (`tpl_id_fk`),
  CONSTRAINT `fk_t_org_chart_tpl_trans_t_org_chart_tpl_mas1` FOREIGN KEY (`tpl_id_fk`) REFERENCES `t_org_chart_tpl_mas` (`tpl_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

/*Data for the table `t_org_chart_tpl_trans` */

insert  into `t_org_chart_tpl_trans`(`org_chart_tpl_trans_id_pk`,`parent_id`,`name`,`designation`,`level`,`tpl_id_fk`,`org_chart_id_fk`,`email`,`profileurl`) values (1,0,'Ashish Mohanty','Senior Vice President',0,1,1,'Ashish@csscorp.com','download/orgprofile/PMO jpeg.jpg'),(2,1,'Arogya Sekar','Director',0,1,1,'Arogya@csscorp.com','download/orgprofile/user.jpg'),(3,2,'Salahudin Ajmal','Associate Director',0,1,3,'Salahudin@csscorp.com','download/orgprofile/user.jpg'),(4,3,'Someone New','Team Lead',0,1,4,'Someone@Csscorp.com','download/orgprofile/user.jpg'),(5,4,'Agent 2','TSE',0,1,6,'TSE2@csscorp.com','download/orgprofile/user.jpg'),(6,4,'Agent 3','TSE',0,1,1,'Agent3@csscorp.com','download/orgprofile/user.jpg'),(7,4,'Agent 1','TSE',0,1,8,'Agent1@csscorp.com','download/orgprofile/user.jpg'),(8,4,'Agent 4','TSE',0,1,9,'Agent4@csscorp.com','download/orgprofile/user.jpg'),(9,4,'Agent 5','TSE',0,1,10,'Agent5@csscorp.com','download/orgprofile/user.jpg'),(10,0,'Sundar Pichai','CEO',0,2,1,'Sundar.P@google.com','download/orgprofile/user.jpg'),(11,1,'New','CFO',0,2,51,'New1@google.com','download/orgprofile/user.jpg'),(12,51,'New2','COO',0,2,52,'New2@google.com','download/orgprofile/user.jpg'),(13,0,'Craig','Director',0,3,1,'Craig@Trionworlds.com','download/orgprofile/user.jpg'),(14,56,'Paul','Director CS',0,3,57,'Paul@Trionworld.com','download/orgprofile/user.jpg'),(15,56,'Jay','Director TS',0,3,58,'Jay@trionworld.com','download/orgprofile/user.jpg'),(16,0,'Sundar Pichai','CEO',0,4,1,'Sundar.P@google.com','download/orgprofile/user.jpg'),(17,1,'New','CFO',0,4,51,'New1@google.com','download/orgprofile/user.jpg'),(18,51,'New2','COO',0,4,52,'New2@google.com','download/orgprofile/user.jpg'),(19,52,'Test','Testq',0,4,1,'test@one.com','download/orgprofile/user.jpg'),(20,0,'Sundar Pichai','CEO',0,5,1,'Sundar.P@google.com','download/orgprofile/user.jpg'),(21,50,'New','CFO',0,5,51,'New1@google.com','download/orgprofile/user.jpg'),(22,50,'New2','COO',0,5,52,'New2@google.com','download/orgprofile/user.jpg'),(23,1,'test1','test1',0,5,1,'test@email.com','download/orgprofile/user.jpg'),(24,63,'test2','test2',0,5,64,'test2@gmail.com','download/orgprofile/user.jpg');

/*Table structure for table `t_org_chart_trans` */

DROP TABLE IF EXISTS `t_org_chart_trans`;

CREATE TABLE `t_org_chart_trans` (
  `org_chart_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `org_chart_id_pk_tmp` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `designation` varchar(45) DEFAULT NULL,
  `project_id_fk` int(11) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `org_chart_flag` int(11) DEFAULT '1',
  `email` varchar(50) NOT NULL,
  `profileurl` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`org_chart_id_pk`),
  KEY `fk_t_org_chart_trans_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_org_chart_trans_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;

/*Data for the table `t_org_chart_trans` */

insert  into `t_org_chart_trans`(`org_chart_id_pk`,`org_chart_id_pk_tmp`,`parent_id`,`name`,`designation`,`project_id_fk`,`level`,`org_chart_flag`,`email`,`profileurl`) values (1,1,0,'Ashish Mohanty','Senior Vice President',1,0,1,'Ashish@csscorp.com','download/orgprofile/PMO jpeg.jpg'),(2,2,1,'Arogya Sekar','Director',1,0,1,'Arogya@csscorp.com','download/orgprofile/user.jpg'),(3,3,2,'Salahudin Ajmal','Associate Director',1,0,1,'Salahudin@csscorp.com','download/orgprofile/user.jpg'),(4,4,3,'Someone New','Team Lead',1,0,1,'Someone@Csscorp.com','download/orgprofile/user.jpg'),(6,6,4,'Agent 2','TSE',1,0,1,'TSE2@csscorp.com','download/orgprofile/user.jpg'),(7,5,4,'Agent 3','TSE',1,0,1,'Agent3@csscorp.com','download/orgprofile/user.jpg'),(8,8,4,'Agent 1','TSE',1,0,1,'Agent1@csscorp.com','download/orgprofile/user.jpg'),(9,9,4,'Agent 4','TSE',1,0,1,'Agent4@csscorp.com','download/orgprofile/user.jpg'),(10,10,4,'Agent 5','TSE',1,0,1,'Agent5@csscorp.com','download/orgprofile/user.jpg'),(11,1,0,'Ashish Mohanty','Senior Vice President',2,0,0,'Ashish@csscorp.com','download/orgprofile/PMO jpeg.jpg'),(12,2,1,'Arogya Sekar','Director',2,0,0,'Arogya@csscorp.com','download/orgprofile/user.jpg'),(13,5,4,'Agent 3','TSE',2,0,0,'Agent3@csscorp.com','download/orgprofile/user.jpg'),(14,3,2,'Salahudin Ajmal','Associate Director',2,0,0,'Salahudin@csscorp.com','download/orgprofile/user.jpg'),(15,4,3,'Someone New','Team Lead',2,0,0,'Someone@Csscorp.com','download/orgprofile/user.jpg'),(16,6,4,'Agent 2','TSE',2,0,0,'TSE2@csscorp.com','download/orgprofile/user.jpg'),(17,8,4,'Agent 1','TSE',2,0,0,'Agent1@csscorp.com','download/orgprofile/user.jpg'),(18,9,4,'Agent 4','TSE',2,0,0,'Agent4@csscorp.com','download/orgprofile/user.jpg'),(19,10,4,'Agent 5','TSE',2,0,0,'Agent5@csscorp.com','download/orgprofile/user.jpg'),(29,8,0,'Ashish','Sr. VP',6,0,1,'Ashish@csscorp.com','download/orgprofile/user.jpg'),(30,30,29,'Arogya','Director',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(31,31,30,'Salah','Asso. Director',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(32,32,30,'Flex','Depty. manager',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(33,33,32,'Naga','Depty. Manager',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(34,1,31,'Opes','Depty',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(35,35,33,'Mubi','Depty Mar',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(36,36,35,'Mohan','dsdffsd',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(37,37,35,'Hari','sdfs',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(38,38,35,'Flex','skdfjlkdj',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(39,39,38,'Mohan','sdfsf',6,0,1,'1@1.com','download/orgprofile/user.jpg'),(40,1,0,'Ashish Mohanty','Senior Vice President',4,0,0,'Ashish@csscorp.com','download/orgprofile/PMO jpeg.jpg'),(41,1,1,'Arogya Sekar','Director',4,0,0,'Arogya@csscorp.com','download/orgprofile/user.jpg'),(42,1,4,'Agent 3','TSE',4,0,0,'Agent3@csscorp.com','download/orgprofile/user.jpg'),(43,3,2,'Salahudin Ajmal','Associate Director',4,0,0,'Salahudin@csscorp.com','download/orgprofile/user.jpg'),(44,4,3,'Someone New','Team Lead',4,0,0,'Someone@Csscorp.com','download/orgprofile/user.jpg'),(45,6,4,'Agent 2','TSE',4,0,0,'TSE2@csscorp.com','download/orgprofile/user.jpg'),(46,8,4,'Agent 1','TSE',4,0,0,'Agent1@csscorp.com','download/orgprofile/user.jpg'),(47,9,4,'Agent 4','TSE',4,0,0,'Agent4@csscorp.com','download/orgprofile/user.jpg'),(48,10,4,'Agent 5','TSE',4,0,0,'Agent5@csscorp.com','download/orgprofile/user.jpg'),(49,1,3,'Tester','I don\'t know',2,0,1,'1@1.com','download/orgprofile/user.jpg'),(50,1,0,'Sundar Pichai','CEO',10,0,1,'Sundar.P@google.com','download/orgprofile/user.jpg'),(51,51,50,'New','CFO',10,0,1,'New1@google.com','download/orgprofile/user.jpg'),(52,52,50,'New2','COO',10,0,1,'New2@google.com','download/orgprofile/user.jpg'),(53,1,0,'Sundar Pichai','CEO',9,0,0,'Sundar.P@google.com','download/orgprofile/user.jpg'),(54,51,50,'New','CFO',9,0,0,'New1@google.com','download/orgprofile/user.jpg'),(55,52,50,'New2','COO',9,0,0,'New2@google.com','download/orgprofile/user.jpg'),(56,1,0,'Craig','Director',7,0,1,'Craig@Trionworlds.com','download/orgprofile/user.jpg'),(57,57,56,'Paul','Director CS',7,0,1,'Paul@Trionworld.com','download/orgprofile/user.jpg'),(58,58,56,'Jay','Director TS',7,0,1,'Jay@trionworld.com','download/orgprofile/user.jpg'),(59,1,0,'Craig','Director',5,0,0,'Craig@Trionworlds.com','download/orgprofile/user.jpg'),(60,57,56,'Paul','Director CS',5,0,0,'Paul@Trionworld.com','download/orgprofile/user.jpg'),(61,58,56,'Jay','Director TS',5,0,0,'Jay@trionworld.com','download/orgprofile/user.jpg'),(62,1,1,'Test','Testq',10,0,1,'test@one.com','download/orgprofile/user.jpg'),(63,1,1,'test1','test1',9,0,1,'test@email.com','download/orgprofile/user.jpg'),(64,64,63,'test2','test2',9,0,1,'test2@gmail.com','download/orgprofile/user.jpg');

/*Table structure for table `t_phase_mas` */

DROP TABLE IF EXISTS `t_phase_mas`;

CREATE TABLE `t_phase_mas` (
  `phase_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `phase_name` varchar(45) DEFAULT NULL,
  `phase_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`phase_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `t_phase_mas` */

insert  into `t_phase_mas`(`phase_id_pk`,`phase_name`,`phase_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'Proposal Phase',NULL,NULL,NULL,NULL,NULL,NULL),(2,'Execution Phase',NULL,NULL,NULL,NULL,NULL,NULL),(3,'OnHold',NULL,NULL,NULL,NULL,NULL,NULL),(4,'Termination',NULL,NULL,NULL,NULL,NULL,NULL),(5,'Completed',NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `t_position_mas` */

DROP TABLE IF EXISTS `t_position_mas`;

CREATE TABLE `t_position_mas` (
  `position_mas_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `position_name` varchar(45) DEFAULT NULL,
  `position_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `updated_date` date DEFAULT NULL,
  PRIMARY KEY (`position_mas_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `t_position_mas` */

insert  into `t_position_mas`(`position_mas_id_pk`,`position_name`,`position_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`) values (1,'System Analyst','System Analyst',1,1,NULL,NULL),(2,'Junior Programmer','Junior Programmer',1,1,NULL,NULL);

/*Table structure for table `t_project_bu_map` */

DROP TABLE IF EXISTS `t_project_bu_map`;

CREATE TABLE `t_project_bu_map` (
  `project_id_fk` int(11) NOT NULL,
  `bu_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`project_id_fk`,`bu_id_fk`),
  KEY `fk_t_project_mas_has_t_bu_mas_t_bu_mas1_idx` (`bu_id_fk`),
  KEY `fk_t_project_mas_has_t_bu_mas_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_project_mas_has_t_bu_mas_t_bu_mas1` FOREIGN KEY (`bu_id_fk`) REFERENCES `t_bu_mas` (`bu_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_project_mas_has_t_bu_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_project_bu_map` */

insert  into `t_project_bu_map`(`project_id_fk`,`bu_id_fk`) values (2,1),(3,1),(4,1),(5,1),(6,1),(8,1),(10,1),(4,2),(6,2),(7,2),(8,2),(1,3),(6,3),(7,3),(9,3);

/*Table structure for table `t_project_mas` */

DROP TABLE IF EXISTS `t_project_mas`;

CREATE TABLE `t_project_mas` (
  `project_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_name` varchar(45) DEFAULT NULL,
  `project_desc` text,
  `start_date` date DEFAULT NULL,
  `logo_path` varchar(150) DEFAULT NULL,
  `go_live_date` date DEFAULT NULL,
  `location_id_fk` int(11) NOT NULL,
  `client_id_fk` int(11) NOT NULL,
  `division_id_fk` int(11) NOT NULL,
  `template_id_fk` int(11) DEFAULT NULL,
  `lob` int(11) DEFAULT NULL,
  `prj_loc_timezone_id` int(11) NOT NULL,
  `prj_golive_timezone_id` int(11) NOT NULL,
  PRIMARY KEY (`project_id_pk`),
  KEY `fk_t_project_mas_t_location_mas_idx` (`location_id_fk`),
  KEY `fk_t_project_mas_t_client_mas1_idx` (`client_id_fk`),
  KEY `fk_t_project_mas_t_division_mas1_idx` (`division_id_fk`),
  CONSTRAINT `fk_t_project_mas_t_client_mas1` FOREIGN KEY (`client_id_fk`) REFERENCES `t_client_mas` (`client_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_project_mas_t_division_mas1` FOREIGN KEY (`division_id_fk`) REFERENCES `t_division_mas` (`division_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_project_mas_t_location_mas` FOREIGN KEY (`location_id_fk`) REFERENCES `t_location_mas` (`location_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_mas` */

insert  into `t_project_mas`(`project_id_pk`,`project_name`,`project_desc`,`start_date`,`logo_path`,`go_live_date`,`location_id_fk`,`client_id_fk`,`division_id_fk`,`template_id_fk`,`lob`,`prj_loc_timezone_id`,`prj_golive_timezone_id`) values (1,'Marketo','Marketo Chat Support','2016-06-03','download/projlogo/Marketo.png','2016-06-15',1,1,1,NULL,1,1,2),(2,'ViewSonic','Voice, Chat, Email','2016-07-18','download/projlogo/viewsonic-logo.png','2016-07-18',6,2,1,NULL,1,1,7),(3,'CSSCorp_Velo','VeloCloud (1 Tech Lead + 7(2 Buffer))','2016-06-06',NULL,'2016-06-27',1,3,2,NULL,1,3,2),(4,'CSSCorp_VeloCloud','VeloCloud - AMBIT 1TL + 7(2 Buffer)','2016-06-06','download/projlogo/wan.png','2016-09-09',1,3,2,NULL,1,3,2),(5,'Demo test','Demo test -2','2015-10-13','download/projlogo/noimage.jpg','2016-12-20',1,3,2,1,1,3,2),(6,'Facebook','Facebook','2016-08-01',NULL,'2016-09-30',1,4,1,NULL,2,3,2),(7,'Trion Worlds','Gaming Support','2016-06-03',NULL,'2016-06-09',1,5,1,NULL,1,231,49),(8,'Alcatel-GNoC','6 member team and to grow up in different location and different languages','2016-06-21','download/projlogo/ALE_GNoC.png','2016-10-10',1,6,2,NULL,3,231,103),(9,'MicroSoft','Tech. Support','2016-06-03','download/projlogo/Microsoft-Logo.jpg','2016-09-26',7,7,1,NULL,1,231,231),(10,'Google','Experimental project','2016-09-05','download/projlogo/Googl.png','2016-09-22',1,8,1,NULL,1,231,103);

/*Table structure for table `t_project_plan_attachment_trans` */

DROP TABLE IF EXISTS `t_project_plan_attachment_trans`;

CREATE TABLE `t_project_plan_attachment_trans` (
  `attachment_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_plan_trans_id_fk` int(11) NOT NULL,
  `attachment_original_file_name` varchar(200) DEFAULT NULL,
  `attachment_temp_file_name` varchar(200) DEFAULT NULL,
  `attachment_file_path` varchar(64) DEFAULT NULL,
  `attachment_file_size` varchar(45) DEFAULT NULL,
  `attachment_uploaded_date` datetime DEFAULT NULL,
  `attachment_uploaded_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`attachment_id_pk`),
  KEY `fk_t_project_plan_attachment_trans_t_project_plan_trans1_idx` (`project_plan_trans_id_fk`),
  CONSTRAINT `fk_t_project_plan_attachment_trans_t_project_plan_trans1` FOREIGN KEY (`project_plan_trans_id_fk`) REFERENCES `t_project_plan_trans` (`project_plan_trans_id_pk`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=261900 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_plan_attachment_trans` */

insert  into `t_project_plan_attachment_trans`(`attachment_id_pk`,`project_plan_trans_id_fk`,`attachment_original_file_name`,`attachment_temp_file_name`,`attachment_file_path`,`attachment_file_size`,`attachment_uploaded_date`,`attachment_uploaded_by`) values (260378,18341,'Marketo High Level Implementation plan V1.0.xlsx','Marketo High Level Implementation plan V1.0.xlsx','download/taskattachments/','15 KB','2016-07-12 01:08:53',1),(260379,18349,'Marketo (India) Communication Matrix V 1.0.xlsx','Marketo (India) Communication Matrix V 1.0.xlsx','download/taskattachments/','35 KB','2016-07-12 01:09:59',1),(260380,18351,'CSS_SR_Plan_Template_V 1.0.xlsx','CSS_SR_Plan_Template_V 1.0.xlsx','download/taskattachments/','314 KB','2016-07-12 22:46:16',1),(260381,18352,'Parallels (China) - Communication Matrix - Testing.xls','Parallels (China) - Communication Matrix - Testing.xls','download/taskattachments/','76 KB','2016-07-15 18:50:06',1),(260394,22109,'FW CSSCorp-VeloCloud IT Set Up Discussion.(1).msg','FW CSSCorp-VeloCloud IT Set Up Discussion.(1).msg','download/taskattachments/','62 KB','2016-07-27 18:04:12',5),(260575,188974,'View Sonic DOR (2).xlsx','View Sonic DOR (2).xlsx','download/taskattachments/','32 KB','2016-09-08 20:18:52',1),(260576,188974,'View Sonic DOR (1).xlsx','View Sonic DOR (1).xlsx','download/taskattachments/','36 KB','2016-09-08 20:18:38',1),(261899,255078,'Dashboard.png','Dashboard.png','download/taskattachments/','135 KB','2016-08-11 22:48:34',5);

/*Table structure for table `t_project_plan_comments_trans` */

DROP TABLE IF EXISTS `t_project_plan_comments_trans`;

CREATE TABLE `t_project_plan_comments_trans` (
  `comments_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_plan_trans_id_fk` int(11) NOT NULL,
  `comments_desc` text,
  `comments_date` datetime DEFAULT NULL,
  `comments_uploaded_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`comments_id_pk`),
  KEY `fk_t_project_plan_comments_trans_t_project_plan_trans1_idx` (`project_plan_trans_id_fk`),
  CONSTRAINT `fk_t_project_plan_comments_trans_t_project_plan_trans1` FOREIGN KEY (`project_plan_trans_id_fk`) REFERENCES `t_project_plan_trans` (`project_plan_trans_id_pk`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=138659 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_plan_comments_trans` */

insert  into `t_project_plan_comments_trans`(`comments_id_pk`,`project_plan_trans_id_fk`,`comments_desc`,`comments_date`,`comments_uploaded_by`) values (134154,18341,'Service Readiness High level implementation plan uploaded','2016-07-12 01:09:34',1),(134155,18349,'Roger, kindly update the Communication Matrix from your side\n','2016-07-12 01:10:45',1),(134159,22160,'Test Comment to check on Save option!','2016-07-29 15:21:56',5),(134688,188973,'Client is yet to sign off the plan','2016-09-08 20:19:20',1),(134689,188975,'Toll gate review need to be signed off by Mithran','2016-09-08 20:19:56',1),(138656,255078,'testing comments without saving','2016-08-11 22:49:34',5),(138657,255078,'testing comment time zone - LIFO','2016-08-11 22:43:41',5),(138658,255078,'Completed ','2016-08-11 22:42:08',5);

/*Table structure for table `t_project_plan_mas` */

DROP TABLE IF EXISTS `t_project_plan_mas`;

CREATE TABLE `t_project_plan_mas` (
  `project_plan_mas_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_id_fk` int(11) NOT NULL,
  `version` float DEFAULT NULL,
  `phase_id_fk` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `hideoptions` varchar(1000) DEFAULT NULL,
  `isExecutionPlan` tinyint(1) NOT NULL DEFAULT '0',
  `isapprovalmail` tinyint(1) DEFAULT '0',
  `isclientapproved` tinyint(1) DEFAULT '0',
  `clientcomments` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`project_plan_mas_id_pk`),
  KEY `fk_t_project_plan_mas_t_project_mas1_idx` (`project_id_fk`),
  KEY `fk_t_project_plan_mas_t_phase_mas1_idx` (`phase_id_fk`),
  CONSTRAINT `fk_t_project_plan_mas_t_phase_mas1` FOREIGN KEY (`phase_id_fk`) REFERENCES `t_phase_mas` (`phase_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_project_plan_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_plan_mas` */

insert  into `t_project_plan_mas`(`project_plan_mas_id_pk`,`project_id_fk`,`version`,`phase_id_fk`,`status`,`hideoptions`,`isExecutionPlan`,`isapprovalmail`,`isclientapproved`,`clientcomments`) values (1,1,1,2,1,'[\"Task Description\",\"Primary Owner\",\"Secondary Owner\",\"Duration\",\"Start Date\",\"End Date\",\"Predecessors\",\"Files\",\"Comments\"]',1,0,0,NULL),(2,3,1,2,1,'[\"Task Description\",\"Primary Owner\",\"Secondary Owner\",\"Duration\",\"Start Date\",\"End Date\",\"Predecessors\",\"Start Day\",\"End Day\",\"Progress\",\"Progress Bar\",\"Files\",\"Comments\"]',1,0,0,NULL),(3,4,1,2,1,'[\"Task Description\",\"Primary Owner\",\"End Date\",\"Start Date\",\"Comments\",\"Secondary Owner\"]',1,0,0,NULL),(4,5,1,2,1,'[\"Task Description\",\"Primary Owner\",\"Secondary Owner\",\"Duration\",\"Start Date\",\"End Date\",\"Predecessors\",\"Start Day\",\"End Day\",\"Progress\",\"Progress Bar\",\"Files\",\"Comments\"]',1,0,0,NULL),(5,7,1,1,1,'[\"Task Description\",\"Primary Owner\",\"Secondary Owner\",\"Duration\",\"Start Date\",\"End Date\",\"Predecessors\",\"Files\",\"Comments\"]',0,0,0,NULL),(6,8,1,2,1,'[\"Task Description\",\"Primary Owner\",\"Duration\",\"Progress\",\"Progress Bar\",\"Files\",\"End Date\",\"Start Date\",\"Secondary Owner\",\"Predecessors\",\"Comments\"]',1,0,0,NULL),(7,9,1,1,1,'[\"Task Description\",\"Primary Owner\",\"Secondary Owner\",\"Duration\",\"Start Date\",\"End Date\",\"Predecessors\",\"Files\",\"Comments\"]',0,0,0,NULL),(8,2,1,1,1,'[\"Task Description\",\"Primary Owner\",\"Secondary Owner\",\"Duration\",\"Start Date\",\"End Date\",\"Predecessors\",\"Start Day\",\"End Day\",\"Progress\",\"Progress Bar\",\"Files\",\"Comments\"]',0,0,0,NULL),(9,10,1,1,1,'[\"Task Description\",\"Duration\",\"Start Date\",\"End Date\",\"Predecessors\",\"Files\",\"Primary Owner\",\"Secondary Owner\"]',0,0,0,NULL);

/*Table structure for table `t_project_plan_tpl_mas` */

DROP TABLE IF EXISTS `t_project_plan_tpl_mas`;

CREATE TABLE `t_project_plan_tpl_mas` (
  `tpl_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `tpl_name` varchar(45) DEFAULT NULL,
  `tpl_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`tpl_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_plan_tpl_mas` */

insert  into `t_project_plan_tpl_mas`(`tpl_id_pk`,`tpl_name`,`tpl_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'TAC - Template for 3 Batch','',5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1),(2,'TAC - 3 Project plan','',5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1),(3,'Standard Template without duration','',5,5,'2016-08-11 00:00:00','2016-08-11 00:00:00',1);

/*Table structure for table `t_project_plan_tpl_trans` */

DROP TABLE IF EXISTS `t_project_plan_tpl_trans`;

CREATE TABLE `t_project_plan_tpl_trans` (
  `project_plan_tpl_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `task_name` text,
  `start_day` int(11) DEFAULT NULL,
  `end_day` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `precedence` varchar(45) DEFAULT NULL,
  `haschild` tinyint(1) DEFAULT NULL,
  `project_plan_tpl_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`project_plan_tpl_trans_id_pk`),
  KEY `fk_t_project_plan_tpl_trans_t_project_plan_tpl_mas1_idx` (`project_plan_tpl_id_fk`),
  CONSTRAINT `fk_t_project_plan_tpl_trans_t_project_plan_tpl_mas1` FOREIGN KEY (`project_plan_tpl_id_fk`) REFERENCES `t_project_plan_tpl_mas` (`tpl_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_plan_tpl_trans` */

insert  into `t_project_plan_tpl_trans`(`project_plan_tpl_trans_id_pk`,`parent_id`,`task_name`,`start_day`,`end_day`,`duration`,`precedence`,`haschild`,`project_plan_tpl_id_fk`) values (1,0,'CSSCorp_VeloCloud',1,70,69,'',1,1),(2,1,'Phase 1: Proposal & Identification Stage',7,20,14,'',1,1),(3,2,'Service Readiness team to send across Project Initiation email',10,13,4,'',0,1),(4,2,'Share Contract Agreement (LOI/SOW/MSA)',15,19,5,'',0,1),(5,2,'Initiate Project Creation to Finance Team',7,8,2,'',0,1),(6,1,'Phase 2: Requirement Gathering & Define Project Objectives',10,33,23,'',1,1),(7,2,'Internal Project Kick-off Meeting',20,20,1,'',0,1),(8,2,'Internal - Recruitment Meeting',20,20,1,'',1,1),(9,3,'Profile Calibration / Job Analysis',20,20,1,'',0,1),(10,3,'Sourcing/ Existing pool/ Internal & External resources',20,20,1,'',0,1),(11,3,'Screening and Selection Process',20,20,1,'',0,1),(12,3,'Initate RRF',20,20,1,'',0,1),(13,2,'Internal - Training Meeting',10,24,14,'',1,1),(14,3,'Discuss on the Training Plan (Modules/Content to be covered for Technology and Foundation Training).',22,24,3,'',0,1),(15,3,'Share draft training plan',22,24,3,'',0,1),(16,3,'Identify Trainer, Training room, Training IT Requirements (Software, Hardware, etc.)',22,24,3,'',0,1),(17,2,'Internal Meeting - IT INFRA Readiness',10,33,23,'',1,1),(18,3,'Seat allocation (ODC/Lab Space allocation)',22,26,5,'',0,1),(19,3,'Review Contract requirements( Data/Voice)',22,23,2,'',0,1),(20,3,'Create Group ID',22,33,12,'',0,1),(21,3,'Discuss on Lab  Setup - Product shipping process/challenges and ETA From Proforma to delivery.',22,23,2,'',0,1),(22,3,'Raise RRF / Create PR in SAP',22,23,2,'',0,1),(23,2,'Create draft project plan for review',24,24,1,'22',0,1),(24,2,'Project kick-off',10,15,6,'',1,1),(25,3,'Finalize Weekly Recurring Meeting',10,10,1,'',0,1),(26,3,'Introduce key Participants',10,15,6,'',0,1),(27,3,'Discuss on Subcommittee meetings for respective Domain',10,10,1,'',0,1),(28,2,'CSS Corp - VeloCloud Recruitment Subcommittee Meeting',10,10,1,'',0,1),(29,2,'CSS Corp - VeloCloud Training Subcommittee Meeting',10,10,1,'',1,1),(30,3,'Discuss on training approach/refresher training and training modules.',10,10,1,'',0,1),(31,2,'CSS Corp - VeloCloud IT Infra subcommittee Meeting',10,14,5,'',1,1),(32,3,'Discuss on the Data Connectivity (SalesForce, PagerDuty, External Lab access -VPN requirement).',10,14,5,'',0,1),(33,3,'Discuss on Voice Connectivity (RingCentral - Call routing)',10,14,5,'',0,1),(34,3,'Finalize Lab Readiness, Voice & Data Requirement, review and Sign-off for Implementation',10,14,5,'',0,1),(35,2,'Share updated - draft Project plan',10,15,6,'',0,1),(36,2,'Share finalized project plan with Timeliness for VeloCloud review and Sign-off',10,15,6,'',0,1),(37,1,'Phase 3: Solution Design',5,59,54,'',1,1),(38,2,'Project Structure to be created (Billing/Rechargeable/Penalty/Cost Project/Procurement)',5,5,1,'',0,1),(39,2,'Recruitment & On-boarding',5,59,54,'',1,1),(40,3,'Batch 1  ( 2 Engineers)',5,37,32,'',0,1),(41,3,'Batch 2 ( 1 Tech Lead & 3 Engineers)',5,49,44,'',0,1),(42,3,'Batch 3  ( 2 Engineers)',5,59,54,'',0,1),(43,2,'INFRA Procure & Deploy',5,35,30,'',1,1),(44,3,'Training Readiness - All IT requirements for Training (Lab, Data, etc.)',5,35,30,'',0,1),(45,3,'Procure Laptop, Phone, Headset, software licenses, Toll free/Toll Number, etc',5,35,30,'',0,1),(46,3,'Training room readiness - System (laptops/desktops), required bandwidth as per the training requirements.',5,9,5,'',0,1),(47,3,'Training Material - (Hard copy/Soft copy), access to external Lab/Internal lab access.',5,9,5,'',0,1),(48,3,'Floor /Bandwidth Requirements - Data Connectivity, Voice connectivity, Lab access, etc.',5,9,5,'',0,1),(49,3,'Lab Requirements (External Lab Access)',5,9,5,'',0,1),(50,1,'Phase:4 Project Execution',22,69,48,'',1,1),(51,2,'Training (On-site Training & Case Handling)',22,69,48,'',1,1),(52,3,'Batch 1  ( 2 Engineers)',38,47,10,'40',0,1),(53,3,'Batch 2 ( 1 Tech Lead & 3 Engineers)',50,59,10,'41',0,1),(54,3,'Batch 3  ( 2 Engineers)',60,69,10,'42',0,1),(55,2,'IT Setup & Lab Setup',22,26,5,'',1,1),(56,3,'Floor Readiness  ',22,23,2,'',0,1),(57,3,'Data & Voice Connectivity',22,23,2,'',0,1),(58,3,'Lab Connectivity',22,25,4,'',0,1),(59,2,'PROJECT DOCUMENTS FOR OPERATIONAL',22,44,23,'',1,1),(60,3,'Creating a detailed SIP / SOP for the Project',22,44,23,'',0,1),(61,3,'Creating a detailed Quality Assurance for the Project capturing how to monitor and measure the performance parameters',22,34,13,'',0,1),(62,3,'Define all the performance parameters that are to be tracked for Weekly / Monthly / Quarterly reviews & reports',22,34,13,'',0,1),(63,3,'Release all Process documents created to the team and maintain version control',22,26,5,'',0,1),(64,1,'Phase:5 UAT & Go-live',42,70,29,'',1,1),(65,2,'User Acceptance Testing',42,45,4,'',0,1),(66,2,'ShareUser Acceptance Checklist',42,45,4,'',0,1),(67,2,'User acceptance testing - share status and feedback',42,44,3,'',0,1),(68,2,'Parallel Run/Go-live',42,70,29,'',1,1),(69,3,'Batch 1  ( 2 Engineers)',48,48,1,'52',0,1),(70,3,'Batch 2 ( 1 Tech Lead & 3 Engineers)',60,60,1,'53',0,1),(71,3,'Batch 3  ( 2 Engineers)',70,70,1,'54',1,1),(72,4,'Go-live Announcement ',70,70,1,'',0,1),(73,1,'Phase:6 Service Delivery',45,60,16,'',1,1),(74,2,'Setup Weekly Operations Call',45,60,16,'',0,1),(75,2,'Initiate ISO Service Readiness Process',45,54,10,'',0,1),(76,2,'PIR - Post-Implementation Review',45,54,10,'',1,1),(77,3,'Trigger CSAT Form for feedback',45,49,5,'',0,1),(78,0,'CSSCorp_VeloCloud',1,69,69,'',1,2),(79,1,'Phase 1: Proposal & Identification Stage',7,20,14,'',1,2),(80,2,'Service Readiness team to send across Project Initiation email',10,13,4,'',0,2),(81,2,'Share Contract Agreement (LOI/SOW/MSA)',15,19,5,'',0,2),(82,2,'Initiate Project Creation to Finance Team',7,8,2,'',0,2),(83,1,'Phase 2: Requirement Gathering & Define Project Objectives',5,37,33,'',1,2),(84,2,'Internal Project Kick-off Meeting',14,14,1,'3',0,2),(85,2,'Internal - Recruitment Meeting',15,20,6,'7',1,2),(86,3,'Profile Calibration / Job Analysis',15,15,1,'',0,2),(87,3,'Sourcing/ Existing pool/ Internal & External resources',16,16,1,'9',0,2),(88,3,'Screening and Selection Process',17,17,1,'10',0,2),(89,3,'Initate RRF',18,20,3,'11',0,2),(90,2,'Internal - Training Meeting',21,30,10,'8',1,2),(91,3,'Discuss on the Training Plan (Modules/Content to be covered for Technology and Foundation Training).',21,24,4,'12',0,2),(92,3,'Share draft training plan',25,27,3,'14',0,2),(93,3,'Identify Trainer, Training room, Training IT Requirements (Software, Hardware, etc.)',28,30,3,'15',0,2),(94,2,'Internal Meeting - IT INFRA Readiness',15,28,14,'',1,2),(95,3,'Seat allocation (ODC/Lab Space allocation)',15,19,5,'7',0,2),(96,3,'Review Contract requirements( Data/Voice)',20,21,2,'18',0,2),(97,3,'Create Group ID',15,26,12,'7',0,2),(98,3,'Discuss on Lab  Setup - Product shipping process/challenges and ETA From Proforma to delivery.',22,23,2,'19',0,2),(99,3,'Raise RRF / Create PR in SAP',24,25,2,'21',0,2),(100,2,'Create draft project plan for review',26,26,1,'22',0,2),(101,2,'Project kick-off',10,15,6,'',1,2),(102,3,'Finalize Weekly Recurring Meeting',10,10,1,'',0,2),(103,3,'Introduce key Participants',10,15,6,'',0,2),(104,3,'Discuss on Subcommittee meetings for respective Domain',10,10,1,'',0,2),(105,2,'CSS Corp - VeloCloud Recruitment Subcommittee Meeting',16,16,1,'24',0,2),(106,2,'CSS Corp - VeloCloud Training Subcommittee Meeting',16,16,1,'24',1,2),(107,3,'Discuss on training approach/refresher training and training modules.',16,16,1,'',0,2),(108,2,'CSS Corp - VeloCloud IT Infra subcommittee Meeting',16,20,5,'24',1,2),(109,3,'Discuss on the Data Connectivity (SalesForce, PagerDuty, External Lab access -VPN requirement).',16,20,5,'',0,2),(110,3,'Discuss on Voice Connectivity (RingCentral - Call routing)',16,20,5,'',0,2),(111,3,'Finalize Lab Readiness, Voice & Data Requirement, review and Sign-off for Implementation',16,20,5,'',0,2),(112,2,'Share updated - draft Project plan',10,15,6,'',0,2),(113,2,'Share finalized project plan with Timeliness for VeloCloud review and Sign-off',10,15,6,'',0,2),(114,1,'Phase 3: Solution Design',5,58,54,'',1,2),(115,2,'Project Structure to be created (Billing/Rechargeable/Penalty/Cost Project/Procurement)',5,5,1,'',0,2),(116,2,'Share knowledge details with the client for approval',38,38,1,'',0,2),(117,2,'Recruitment & On-boarding',5,58,54,'',1,2),(118,3,'Recruitment - Batch 1  ( 2 Engineers)',5,36,32,'',0,2),(119,3,'Recruitment - Batch 2 ( 1 Tech Lead & 3 Engineers)',5,48,44,'',0,2),(120,3,'Recruitment - Batch 3  ( 2 Engineers)',5,58,54,'',0,2),(121,2,'INFRA Procure & Deploy',5,34,30,'',1,2),(122,3,'Training Readiness - All IT requirements for Training (Lab, Data, etc.)',5,34,30,'',0,2),(123,3,'Procure Laptop, Phone, Headset, software licenses, Toll free/Toll Number, etc',5,34,30,'',0,2),(124,3,'Training room readiness - System (laptops/desktops), required bandwidth as per the training requirements.',5,9,5,'',0,2),(125,3,'Training Material - (Hard copy/Soft copy), access to external Lab/Internal lab access.',5,9,5,'',0,2),(126,3,'Floor /Bandwidth Requirements - Data Connectivity, Voice connectivity, Lab access, etc.',5,9,5,'',0,2),(127,3,'Lab Requirements (External Lab Access)',5,9,5,'',0,2),(128,1,'Phase:4 Project Execution',22,69,48,'',1,2),(129,2,'Training (On-site Training & Case Handling)',22,69,48,'',1,2),(130,3,'Training - Batch 1  ( 2 Engineers)',37,46,10,'41',0,2),(131,3,'Training - Batch 2 ( 1 Tech Lead & 3 Engineers)',49,58,10,'42',0,2),(132,3,'Training -  Batch 3  ( 2 Engineers)',59,68,10,'43',0,2),(133,2,'IT Setup & Lab Setup',22,26,5,'',1,2),(134,3,'Floor Readiness  ',22,23,2,'',0,2),(135,3,'Data & Voice Connectivity',22,23,2,'',0,2),(136,3,'testing',22,22,1,'',0,2),(137,3,'Lab Connectivity',22,25,4,'',0,2),(138,2,'PROJECT DOCUMENTS FOR OPERATIONAL',22,44,23,'',1,2),(139,3,'Creating a detailed SIP / SOP for the Project',22,44,23,'',0,2),(140,3,'Creating a detailed Quality Assurance for the Project capturing how to monitor and measure the performance parameters',22,34,13,'',0,2),(141,3,'Define all the performance parameters that are to be tracked for Weekly / Monthly / Quarterly reviews & reports',22,34,13,'',0,2),(142,3,'Release all Process documents created to the team and maintain version control',22,26,5,'',0,2),(143,1,'Phase:5 UAT & Go-live',42,70,29,'',1,2),(144,2,'User Acceptance Testing',42,45,4,'',0,2),(145,2,'ShareUser Acceptance Checklist',42,45,4,'',0,2),(146,2,'User acceptance testing - share status and feedback',42,44,3,'',0,2),(147,2,'Parallel Run/Go-live',42,70,29,'',1,2),(148,3,'Launch - Batch 1  ( 2 Engineers)',47,47,1,'53',0,2),(149,3,'Launch - Batch 2 ( 1 Tech Lead & 3 Engineers)',59,59,1,'54',0,2),(150,3,'Launch - Batch 3  ( 2 Engineers)',69,69,1,'55',1,2),(151,4,'Go-live Announcement ',69,69,1,'',0,2),(152,1,'Phase:6 Service Delivery',45,60,16,'',1,2),(153,2,'Setup Weekly Operations Call',45,60,16,'',0,2),(154,2,'Initiate ISO Service Readiness Process',45,54,10,'',0,2),(155,2,'PIR - Post-Implementation Review',45,54,10,'',1,2),(156,3,'Trigger CSAT Form for feedback',45,49,5,'',0,2),(157,0,'Alcatel-GNoC',1,1,1,'',1,3),(158,1,'Phase 1: Proposal & Identification Stage',1,1,1,'',1,3),(159,2,'Project Identification and Implementation ',1,1,1,'',0,3),(160,2,'Share Contract Agreement (LOI/SOW/MSA)',1,1,1,'',0,3),(161,2,'Discuss on Headcount requirement, Location, Type of Services provided, etc.',1,1,1,'',0,3),(162,1,'Phase 2: Requirement Gathering & Define Project Objectives',1,1,1,'',1,3),(163,2,'Internal Project Kick-off Meeting',1,1,1,'',0,3),(164,2,'Internal - Recruitment Meeting',1,1,1,'',0,3),(165,2,'Profile Calibration / Job Analysis',1,1,1,'',0,3),(166,2,'Sourcing/ Existing pool/ Internal & External resources',1,1,1,'',0,3),(167,2,'Screening and Selection Process',1,1,1,'',0,3),(168,2,'Initate RRF for approval',1,1,1,'',0,3),(169,2,'Internal - Training Meeting',1,1,1,'',0,3),(170,2,'Discuss on the Training Plan (Modules/Content to be covered for Technology and Foundation Training).',1,1,1,'',0,3),(171,2,'Share draft training plan',1,1,1,'',0,3),(172,2,'Identify Trainer, Training room, Training IT requirements ( Software, Hardware, etc.)',1,1,1,'',0,3),(173,2,'Internal Meeting - IT INFRA Readiness',1,1,1,'',0,3),(174,2,'Seat Allocation ( ODC/Lab Space allocation)',1,1,1,'',0,3),(175,2,'Review Contract requirements( Data/Voice)',1,1,1,'',0,3),(176,2,'Create Group ID',1,1,1,'',0,3),(177,2,'Procurement approval - CapEX & OpEX',1,1,1,'',0,3),(178,2,'Raise RRF / Create PR in SAP',1,1,1,'',0,3),(179,2,'Discuss on Voice Connectivity ( TFN/Vanity Number/DID for call routing, etc.).',1,1,1,'',0,3),(180,2,'Discuss on Subcommittee meetings for respective Domain',1,1,1,'',0,3),(181,2,'Discuss on Lab Setup for Training and Floor readiness, Hardware shipment.',1,1,1,'',0,3),(182,2,'Finalize Lab Readiness, Voice & Data Requirement, review and Sign-off for Implementation',1,1,1,'',0,3),(183,2,'Create draft Project plan',1,1,1,'',0,3),(184,2,'Share finalized project plan with Timeliness for Sam review and Sign-off',1,1,1,'',0,3),(185,1,'Phase 3: Solution Design',1,1,1,'',1,3),(186,2,'Recruitment ',1,1,1,'',1,3),(187,3,'On-boarding Selected Candidates',1,1,1,'',0,3),(188,2,'INFRA Procure & Deploy',1,1,1,'',1,3),(189,3,'Training Readiness - All IT requirements for Training',1,1,1,'',0,3),(190,3,'Training room readiness - system (laptops/desktops), required bandwidth as per the training requirements.',1,1,1,'',0,3),(191,3,'Training Material - (Hard copy/Soft copy)',1,1,1,'',0,3),(192,3,'Floor /Bandwidth Requirements - Data Connectivity, Voice connectivity, Lab access, etc.',1,1,1,'',0,3),(193,1,'Phase 4: Project Execution',1,1,1,'',1,3),(194,2,'Training',1,1,1,'',1,3),(195,3,'SWAY Training',1,1,1,'',0,3),(196,3,'ALE_GNOC - Product and Process Training',1,1,1,'',0,3),(197,2,'IT Setup & Lab Setup',1,1,1,'',1,3),(198,3,'Floor Readiness  ',1,1,1,'',0,3),(199,3,'Data & Voice Connectivity',1,1,1,'',0,3),(200,1,'Phase 5: UAT & Go-live',1,1,1,'',1,3),(201,2,'User Acceptance Testing',1,1,1,'',0,3),(202,2,'User acceptance testing - share status and feedback',1,1,1,'',0,3),(203,2,'Go-live',1,1,1,'',0,3),(204,1,'Phase 6: Service Delivery',1,1,1,'',1,3),(205,2,'Initiate ISO Service Readiness Process',1,1,1,'',0,3),(206,2,'PIR - Post-Implementation Review',1,1,1,'',0,3),(207,2,'Feedback form to be triggered',1,1,1,'',0,3);

/*Table structure for table `t_project_plan_trans` */

DROP TABLE IF EXISTS `t_project_plan_trans`;

CREATE TABLE `t_project_plan_trans` (
  `project_plan_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `plan_mas_id_fk` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `materialized_path` text,
  `status` varchar(50) DEFAULT NULL,
  `task_name` text,
  `primary_owner` varchar(45) DEFAULT NULL,
  `secondary_owner` varchar(45) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_day` int(11) DEFAULT NULL,
  `end_day` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `precedence` varchar(45) DEFAULT NULL,
  `progress_percent` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  `version` float DEFAULT NULL,
  `haschild` tinyint(1) NOT NULL,
  `ishighLevelPlan` tinyint(1) NOT NULL DEFAULT '0',
  `treeID` int(11) NOT NULL,
  `rootID` int(11) NOT NULL,
  `actual_startdate` date DEFAULT NULL,
  `actual_enddate` date DEFAULT NULL,
  PRIMARY KEY (`project_plan_trans_id_pk`),
  KEY `fk_t_project_plan_trans_t_project_plan_mas1_idx` (`plan_mas_id_fk`),
  CONSTRAINT `fk_t_project_plan_trans_t_project_plan_mas1` FOREIGN KEY (`plan_mas_id_fk`) REFERENCES `t_project_plan_mas` (`project_plan_mas_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=255506 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_plan_trans` */

insert  into `t_project_plan_trans`(`project_plan_trans_id_pk`,`plan_mas_id_fk`,`parent_id`,`materialized_path`,`status`,`task_name`,`primary_owner`,`secondary_owner`,`start_date`,`end_date`,`start_day`,`end_day`,`duration`,`precedence`,`progress_percent`,`created_by`,`updated_by`,`created_date`,`update_date`,`version`,`haschild`,`ishighLevelPlan`,`treeID`,`rootID`,`actual_startdate`,`actual_enddate`) values (18337,1,0,NULL,'STATUS_UNDEFINED','Marketo','','','2016-06-03','2016-06-15',1,9,9,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,1,0,1,0,NULL,NULL),(18338,1,1,NULL,'STATUS_UNDEFINED','Business Opportunity Identification','1','1','2016-06-03','2016-06-09',1,5,5,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,1,1,2,1,NULL,NULL),(18339,1,2,NULL,'STATUS_UNDEFINED','CSS submits proposal to Marketo','1','1','2016-06-03','2016-06-03',1,1,1,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,3,2,NULL,NULL),(18340,1,2,NULL,'STATUS_UNDEFINED','CSS and Marketo sign SOW/MSA','2','1','2016-06-06','2016-06-06',2,2,1,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,1,4,2,NULL,NULL),(18341,1,2,NULL,'STATUS_UNDEFINED','Submit Draft version 2.0 of the proposed implementation project plan to Marketo','1','1','2016-06-07','2016-06-07',3,3,1,'4',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,5,2,NULL,NULL),(18342,1,2,NULL,'STATUS_UNDEFINED','Implementation Plan Sign off','2','1','2016-06-08','2016-06-08',4,4,1,'5',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,1,6,2,NULL,NULL),(18343,1,2,NULL,'STATUS_UNDEFINED','Toll Gate Review','1','1','2016-06-09','2016-06-09',5,5,1,'6',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,7,2,NULL,NULL),(18344,1,1,NULL,'STATUS_UNDEFINED','Solution Design','1','1','2016-06-07','2016-06-09',3,5,3,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,1,1,8,1,NULL,NULL),(18345,1,2,NULL,'STATUS_UNDEFINED','Internal Project Kick-off meeting ','1','1','2016-06-07','2016-06-07',3,3,1,'4',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,9,8,NULL,NULL),(18346,1,2,NULL,'STATUS_UNDEFINED','Decide on recurring internal meeting schedule with SR Consultants Prepare Information required document (IRD)','1','1','2016-06-07','2016-06-07',3,3,1,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,10,8,NULL,NULL),(18347,1,2,NULL,'STATUS_UNDEFINED','Project Kick-Off meeting with Marketo','2','1','2016-06-09','2016-06-09',5,5,1,'6',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,11,8,NULL,NULL),(18348,1,2,NULL,'STATUS_UNDEFINED','Fix a schedule for all upcoming meetings','1','1','2016-06-09','2016-06-09',5,5,1,'6',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,12,8,NULL,NULL),(18349,1,2,NULL,'STATUS_UNDEFINED','Share Communication Matrix','2','1','2016-06-09','2016-06-09',5,5,1,'6',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,1,13,8,NULL,NULL),(18350,1,2,NULL,'STATUS_UNDEFINED','Requirement Gathering','1','1','2016-06-09','2016-06-09',5,5,1,'6',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,1,14,8,NULL,NULL),(18351,1,1,NULL,'STATUS_UNDEFINED','Analyze Client Requirements','1','1','2016-06-06','2016-06-08',2,4,3,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,1,1,15,1,NULL,NULL),(18352,1,2,NULL,'STATUS_UNDEFINED','Analyze human resource requirement (skills, knowledge, profile and number of FTEs)','1','1','2016-06-08','2016-06-08',4,4,1,'10',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,16,15,NULL,NULL),(18353,1,2,NULL,'STATUS_UNDEFINED','Get Client sign-off on JD','2','1','2016-06-08','2016-06-08',4,4,1,'10',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,1,17,15,NULL,NULL),(18354,1,2,NULL,'STATUS_UNDEFINED','Determine Capacity - Seats & Location','1','1','2016-06-06','2016-06-08',2,4,3,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,18,15,NULL,NULL),(18355,1,2,NULL,'STATUS_UNDEFINED','Determine Training requirements -Trainer, Number of days, Classroom, etc','1','1','2016-06-06','2016-06-07',2,3,2,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,19,15,NULL,NULL),(18356,1,2,NULL,'STATUS_UNDEFINED','Determine MIS reporting','1','1','2016-06-08','2016-06-08',4,4,1,'9',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,20,15,NULL,NULL),(18357,1,2,NULL,'STATUS_UNDEFINED','Determine IT Infrastructure  - Bandwidth (E1s, Switches, IP Phones, Servers, Desktops & Software\'s)','1','1','2016-06-08','2016-06-08',4,4,1,'19',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,21,15,NULL,NULL),(18358,1,2,NULL,'STATUS_UNDEFINED','HR Subcommittee Meeting','1','1','2016-06-06','2016-06-06',2,2,1,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,22,15,NULL,NULL),(18359,1,2,NULL,'STATUS_UNDEFINED','Training Subcommittee Meeting','1','1','2016-06-06','2016-06-06',2,2,1,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,1,23,15,NULL,NULL),(18360,1,2,NULL,'STATUS_UNDEFINED','IT Subcommittee Meeting','1','1','2016-06-06','2016-06-06',2,2,1,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,24,15,NULL,NULL),(18361,1,2,NULL,'STATUS_UNDEFINED','Toll Gate Review','1','1','2016-06-06','2016-06-06',2,2,1,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,25,15,NULL,NULL),(18362,1,1,NULL,'STATUS_UNDEFINED','Planning & Resourcing','1','1','2016-06-03','2016-06-09',1,5,5,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,1,1,26,1,NULL,NULL),(18363,1,2,NULL,'STATUS_UNDEFINED','Devise organizational structure, Roles & Responsibilities','1','1','2016-06-09','2016-06-09',5,5,1,'6',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,0,27,26,NULL,NULL),(18364,1,2,NULL,'STATUS_UNDEFINED','Share Job Description to recruitment','1','2','2016-06-03','2016-06-03',1,1,1,'',0,2,2,'2016-07-25 00:00:00','2016-07-25 00:00:00',1,0,1,28,26,NULL,NULL),(18378,2,0,NULL,'STATUS_UNDEFINED','CSSCorp_VeloCloud','','','2016-06-06','2016-06-27',1,16,16,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,1,0,1,0,NULL,NULL),(18379,2,1,NULL,'STATUS_UNDEFINED','Phase 1: Proposal & Identification Stage','','','2016-06-06','2016-06-27',1,16,16,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,1,0,2,1,NULL,NULL),(18380,2,2,NULL,'STATUS_UNDEFINED','Service Readiness team to send across Project Initiation email','','','2016-06-14','2016-06-17',7,10,4,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,0,0,3,2,NULL,NULL),(18381,2,2,NULL,'STATUS_UNDEFINED','Share Contract Agreement (LOI/SOW/MSA)','','','2016-06-22','2016-06-27',13,16,4,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,1,0,4,2,NULL,NULL),(18382,2,3,NULL,'STATUS_UNDEFINED','Initiate Project Creation to Finance Team','','','2016-06-22','2016-06-22',13,13,1,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,0,0,5,4,NULL,NULL),(18383,2,1,NULL,'STATUS_UNDEFINED','Phase 2: Requirement Gathering & Define Project Objectives','','','2016-06-06','2016-06-20',1,11,11,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,1,0,6,1,NULL,NULL),(18384,2,2,NULL,'STATUS_UNDEFINED','Internal Project Kick-off Meeting','','','2016-06-20','2016-06-20',11,11,1,'3',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,0,0,7,6,NULL,NULL),(18385,2,2,NULL,'STATUS_UNDEFINED','Internal - Recruitment Meeting','','','2016-06-20','2016-06-20',11,11,1,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,1,0,8,6,NULL,NULL),(18386,2,3,NULL,'STATUS_UNDEFINED','Profile Calibration / Job Analysis','','','2016-06-20','2016-06-20',11,11,1,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,0,0,9,8,NULL,NULL),(18387,2,3,NULL,'STATUS_UNDEFINED','Sourcing/ Existing pool/ Internal & External resources','','','2016-06-20','2016-06-20',11,11,1,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,0,0,10,8,NULL,NULL),(18388,2,3,NULL,'STATUS_UNDEFINED','Screening and Selection Process','','','2016-06-20','2016-06-20',11,11,1,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,0,0,11,8,NULL,NULL),(18389,2,3,NULL,'STATUS_UNDEFINED','Initate RRF','','','2016-06-20','2016-06-20',11,11,1,'',0,5,5,'2016-07-26 00:00:00','2016-07-26 00:00:00',1,0,0,12,8,NULL,NULL),(22086,3,0,NULL,'STATUS_ACTIVE','CSSCorp_VeloCloud','','','2016-06-06','2016-09-08',1,69,69,'',57,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,1,0,NULL,NULL),(22087,3,1,NULL,'STATUS_ACTIVE','Phase 1: Proposal & Identification Stage','','','2016-06-14','2016-07-01',7,20,14,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,2,1,'2016-07-26',NULL),(22088,3,2,NULL,'STATUS_DONE','Service Readiness team to send across Project Initiation email','','','2016-06-17','2016-06-22',10,13,4,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,3,2,NULL,'2016-07-26'),(22089,3,2,NULL,'STATUS_ACTIVE','Share Contract Agreement (LOI/SOW/MSA)','','','2016-06-24','2016-06-30',15,19,5,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,4,2,'2016-07-27',NULL),(22090,3,2,NULL,'STATUS_DONE','Initiate Project Creation to Finance Team','','','2016-06-14','2016-06-15',7,8,2,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,5,2,'2016-07-26','2016-07-27'),(22091,3,1,NULL,'STATUS_DONE','Phase 2: Requirement Gathering & Define Project Objectives','','','2016-06-10','2016-07-26',5,37,33,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,6,1,'2016-07-26','2016-07-27'),(22092,3,2,NULL,'STATUS_DONE','Internal Project Kick-off Meeting','','','2016-06-23','2016-06-23',14,14,1,'3',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,7,6,'2016-07-27','2016-07-27'),(22093,3,2,NULL,'STATUS_DONE','Internal - Recruitment Meeting','','','2016-06-24','2016-07-01',15,20,6,'7',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,8,6,NULL,'2016-07-26'),(22094,3,3,NULL,'STATUS_DONE','Profile Calibration / Job Analysis','','','2016-06-24','2016-06-24',15,15,1,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,9,8,NULL,'2016-07-26'),(22095,3,3,NULL,'STATUS_DONE','Sourcing/ Existing pool/ Internal & External resources','','','2016-06-27','2016-06-27',16,16,1,'9',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,10,8,NULL,'2016-07-26'),(22096,3,3,NULL,'STATUS_DONE','Screening and Selection Process','','','2016-06-28','2016-06-28',17,17,1,'10',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,11,8,NULL,'2016-07-26'),(22097,3,3,NULL,'STATUS_DONE','Initate RRF','','','2016-06-29','2016-07-01',18,20,3,'11',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,12,8,NULL,'2016-07-26'),(22098,3,2,NULL,'STATUS_DONE','Internal - Training Meeting','','','2016-07-04','2016-07-15',21,30,10,'8',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,13,6,NULL,'2016-07-26'),(22099,3,3,NULL,'STATUS_DONE','Discuss on the Training Plan (Modules/Content to be covered for Technology and Foundation Training).','','','2016-07-04','2016-07-07',21,24,4,'12',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,14,13,NULL,'2016-07-26'),(22100,3,3,NULL,'STATUS_DONE','Share draft training plan','','','2016-07-08','2016-07-12',25,27,3,'14',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,15,13,NULL,'2016-07-26'),(22101,3,3,NULL,'STATUS_DONE','Identify Trainer, Training room, Training IT Requirements (Software, Hardware, etc.)','','','2016-07-13','2016-07-15',28,30,3,'15',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,16,13,NULL,'2016-07-26'),(22102,3,2,NULL,'STATUS_DONE','Internal Meeting - IT INFRA Readiness','','','2016-06-24','2016-07-13',15,28,14,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,17,6,'2016-07-27','2016-07-27'),(22103,3,3,NULL,'STATUS_DONE','Seat allocation (ODC/Lab Space allocation)','','','2016-06-24','2016-06-30',15,19,5,'7',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,18,17,NULL,'2016-07-26'),(22104,3,3,NULL,'STATUS_DONE','Review Contract requirements( Data/Voice)','','','2016-07-01','2016-07-04',20,21,2,'18',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,19,17,NULL,'2016-07-26'),(22105,3,3,NULL,'STATUS_DONE','Create Group ID','','','2016-06-24','2016-07-11',15,26,12,'7',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,20,17,NULL,'2016-07-26'),(22106,3,3,NULL,'STATUS_DONE','Discuss on Lab  Setup - Product shipping process/challenges and ETA From Proforma to delivery.','','','2016-07-05','2016-07-06',22,23,2,'19',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,21,17,NULL,'2016-07-26'),(22107,3,3,NULL,'STATUS_DONE','Raise RRF / Create PR in SAP','','','2016-07-07','2016-07-08',24,25,2,'21',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,22,17,NULL,'2016-07-26'),(22108,3,2,NULL,'STATUS_DONE','Create draft project plan for review','','','2016-07-11','2016-07-11',26,26,1,'22',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,23,6,NULL,'2016-07-26'),(22109,3,2,NULL,'STATUS_DONE','Project kick-off','','','2016-06-17','2016-06-24',10,15,6,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,24,6,NULL,'2016-07-26'),(22110,3,3,NULL,'STATUS_DONE','Finalize Weekly Recurring Meeting','','','2016-06-17','2016-06-17',10,10,1,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,25,24,NULL,'2016-07-26'),(22111,3,3,NULL,'STATUS_DONE','Introduce key Participants','','','2016-06-17','2016-06-24',10,15,6,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,26,24,NULL,'2016-07-26'),(22112,3,3,NULL,'STATUS_DONE','Discuss on Subcommittee meetings for respective Domain','','','2016-06-17','2016-06-17',10,10,1,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,27,24,NULL,'2016-07-26'),(22113,3,2,NULL,'STATUS_DONE','CSS Corp - VeloCloud Recruitment Subcommittee Meeting','','','2016-06-27','2016-06-27',16,16,1,'24',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,28,6,'2016-07-27','2016-07-27'),(22114,3,2,NULL,'STATUS_DONE','CSS Corp - VeloCloud Training Subcommittee Meeting','','','2016-06-27','2016-06-27',16,16,1,'24',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,29,6,'2016-07-27','2016-07-27'),(22115,3,3,NULL,'STATUS_DONE','Discuss on training approach/refresher training and training modules.','','','2016-06-27','2016-06-27',16,16,1,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,30,29,NULL,'2016-07-26'),(22116,3,2,NULL,'STATUS_DONE','CSS Corp - VeloCloud IT Infra subcommittee Meeting','','','2016-06-27','2016-07-01',16,20,5,'24',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,31,6,'2016-07-27','2016-07-27'),(22117,3,3,NULL,'STATUS_DONE','Discuss on the Data Connectivity (SalesForce, PagerDuty, External Lab access -VPN requirement).','','','2016-06-27','2016-07-01',16,20,5,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,32,31,NULL,'2016-07-26'),(22118,3,3,NULL,'STATUS_DONE','Discuss on Voice Connectivity (RingCentral - Call routing)','','','2016-06-27','2016-07-01',16,20,5,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,33,31,NULL,'2016-07-26'),(22119,3,3,NULL,'STATUS_DONE','Finalize Lab Readiness, Voice & Data Requirement, review and Sign-off for Implementation','','','2016-06-27','2016-07-01',16,20,5,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,34,31,NULL,'2016-07-26'),(22120,3,2,NULL,'STATUS_DONE','Share updated - draft Project plan','','','2016-06-17','2016-06-24',10,15,6,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,35,6,NULL,'2016-07-26'),(22121,3,2,NULL,'STATUS_DONE','Share finalized project plan with Timeliness for VeloCloud review and Sign-off','','','2016-06-17','2016-06-24',10,15,6,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,36,6,NULL,'2016-07-26'),(22122,3,1,NULL,'STATUS_ACTIVE','Phase 3: Solution Design','','','2016-06-10','2016-08-24',5,58,54,'',65,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,37,1,'2016-07-26',NULL),(22123,3,2,NULL,'STATUS_DONE','Project Structure to be created (Billing/Rechargeable/Penalty/Cost Project/Procurement)','','','2016-06-10','2016-06-10',5,5,1,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,38,37,'2016-07-26','2016-07-27'),(22124,3,2,NULL,'STATUS_DONE','Share knowledge details with the client for approval','','','2016-07-27','2016-07-27',38,38,1,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,39,37,'2016-07-27','2016-07-27'),(22125,3,2,NULL,'STATUS_ACTIVE','Recruitment & On-boarding','','','2016-06-10','2016-08-24',5,58,54,'',65,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,1,40,37,'2016-07-26',NULL),(22126,3,3,NULL,'STATUS_ACTIVE','Recruitment - Batch 1  ( 2 Engineers)','','','2016-06-10','2016-07-25',5,36,32,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,41,40,'2016-07-26',NULL),(22127,3,3,NULL,'STATUS_ACTIVE','Recruitment - Batch 2 ( 1 Tech Lead & 3 Engineers)','','','2016-06-10','2016-08-10',5,48,44,'',80,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,42,40,'2016-07-26',NULL),(22128,3,3,NULL,'STATUS_ACTIVE','Recruitment - Batch 3  ( 2 Engineers)','','','2016-06-10','2016-08-24',5,58,54,'',65,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,43,40,'2016-07-26',NULL),(22129,3,2,NULL,'STATUS_DONE','INFRA Procure & Deploy','','','2016-06-10','2016-07-21',5,34,30,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,44,37,'2016-07-26','2016-07-26'),(22130,3,3,NULL,'STATUS_DONE','Training Readiness - All IT requirements for Training (Lab, Data, etc.)','','','2016-06-10','2016-07-21',5,34,30,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,45,44,'2016-07-26','2016-07-26'),(22131,3,3,NULL,'STATUS_DONE','Procure Laptop, Phone, Headset, software licenses, Toll free/Toll Number, etc','','','2016-06-10','2016-07-21',5,34,30,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,46,44,'2016-07-26','2016-07-26'),(22132,3,3,NULL,'STATUS_DONE','Training room readiness - System (laptops/desktops), required bandwidth as per the training requirements.','','','2016-06-10','2016-06-16',5,9,5,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,47,44,'2016-07-26','2016-07-26'),(22133,3,3,NULL,'STATUS_DONE','Training Material - (Hard copy/Soft copy), access to external Lab/Internal lab access.','','','2016-06-10','2016-06-16',5,9,5,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,48,44,'2016-07-26','2016-07-26'),(22134,3,3,NULL,'STATUS_DONE','Floor /Bandwidth Requirements - Data Connectivity, Voice connectivity, Lab access, etc.','','','2016-06-10','2016-06-16',5,9,5,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,49,44,'2016-07-26','2016-07-26'),(22135,3,3,NULL,'STATUS_DONE','Lab Requirements (External Lab Access)','','','2016-06-10','2016-06-16',5,9,5,'',100,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,50,44,'2016-07-26','2016-07-26'),(22136,3,1,NULL,'STATUS_UNDEFINED','Phase:4 Project Execution','','','2016-07-05','2016-09-08',22,69,48,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,51,1,'2016-07-26',NULL),(22137,3,2,NULL,'STATUS_UNDEFINED','Training (On-site Training & Case Handling)','','','2016-07-05','2016-09-08',22,69,48,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,52,51,'2016-07-26',NULL),(22138,3,3,NULL,'STATUS_UNDEFINED','Training - Batch 1  ( 2 Engineers)','','','2016-07-26','2016-08-08',37,46,10,'41',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,1,53,52,NULL,NULL),(22139,3,3,NULL,'STATUS_UNDEFINED','Training - Batch 2 ( 1 Tech Lead & 3 Engineers)','','','2016-08-11','2016-08-24',49,58,10,'42',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,1,54,52,NULL,NULL),(22140,3,3,NULL,'STATUS_UNDEFINED','Training -  Batch 3  ( 2 Engineers)','','','2016-08-25','2016-09-07',59,68,10,'43',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,1,55,52,NULL,NULL),(22141,3,2,NULL,'STATUS_UNDEFINED','IT Setup & Lab Setup','','','2016-07-05','2016-07-11',22,26,5,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,56,51,'2016-07-26',NULL),(22142,3,3,NULL,'STATUS_UNDEFINED','Floor Readiness  ','','','2016-07-05','2016-07-06',22,23,2,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,57,56,'2016-07-26',NULL),(22143,3,3,NULL,'STATUS_UNDEFINED','Data & Voice Connectivity','','','2016-07-05','2016-07-06',22,23,2,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,58,56,'2016-07-26',NULL),(22144,3,3,NULL,'STATUS_UNDEFINED','testing','','','2016-07-05','2016-07-05',22,22,1,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,59,56,NULL,NULL),(22145,3,3,NULL,'STATUS_UNDEFINED','Lab Connectivity','','','2016-07-05','2016-07-08',22,25,4,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,60,56,'2016-07-26',NULL),(22146,3,2,NULL,'STATUS_UNDEFINED','PROJECT DOCUMENTS FOR OPERATIONAL','','','2016-07-05','2016-08-04',22,44,23,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,61,51,'2016-07-26',NULL),(22147,3,3,NULL,'STATUS_UNDEFINED','Creating a detailed SIP / SOP for the Project','','','2016-07-05','2016-08-04',22,44,23,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,62,61,'2016-07-26',NULL),(22148,3,3,NULL,'STATUS_UNDEFINED','Creating a detailed Quality Assurance for the Project capturing how to monitor and measure the performance parameters','','','2016-07-05','2016-07-21',22,34,13,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,63,61,'2016-07-26',NULL),(22149,3,3,NULL,'STATUS_UNDEFINED','Define all the performance parameters that are to be tracked for Weekly / Monthly / Quarterly reviews & reports','','','2016-07-05','2016-07-21',22,34,13,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,64,61,'2016-07-26',NULL),(22150,3,3,NULL,'STATUS_UNDEFINED','Release all Process documents created to the team and maintain version control','','','2016-07-05','2016-07-11',22,26,5,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,65,61,'2016-07-26',NULL),(22151,3,1,NULL,'STATUS_UNDEFINED','Phase:5 UAT & Go-live','','','2016-08-02','2016-09-09',42,70,29,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,66,1,'2016-07-26',NULL),(22152,3,2,NULL,'STATUS_UNDEFINED','User Acceptance Testing','','','2016-08-02','2016-08-05',42,45,4,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,67,66,'2016-07-26',NULL),(22153,3,2,NULL,'STATUS_UNDEFINED','ShareUser Acceptance Checklist','','','2016-08-02','2016-08-05',42,45,4,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,68,66,'2016-07-26',NULL),(22154,3,2,NULL,'STATUS_UNDEFINED','User acceptance testing - share status and feedback','','','2016-08-02','2016-08-04',42,44,3,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,69,66,'2016-07-26',NULL),(22155,3,2,NULL,'STATUS_UNDEFINED','Parallel Run/Go-live','','','2016-08-02','2016-09-09',42,70,29,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,70,66,'2016-07-26',NULL),(22156,3,3,NULL,'STATUS_UNDEFINED','Launch - Batch 1  ( 2 Engineers)','','','2016-08-09','2016-08-09',47,47,1,'53',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,1,71,70,NULL,NULL),(22157,3,3,NULL,'STATUS_UNDEFINED','Launch - Batch 2 ( 1 Tech Lead & 3 Engineers)','','','2016-08-25','2016-08-25',59,59,1,'54',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,1,72,70,NULL,NULL),(22158,3,3,NULL,'STATUS_UNDEFINED','Launch - Batch 3  ( 2 Engineers)','','','2016-09-08','2016-09-08',69,69,1,'55',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,1,73,70,NULL,NULL),(22159,3,4,NULL,'STATUS_UNDEFINED','Go-live Announcement ','','','2016-09-08','2016-09-08',69,69,1,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,74,73,NULL,NULL),(22160,3,1,NULL,'STATUS_UNDEFINED','Phase:6 Service Delivery','','','2016-08-05','2016-08-26',45,60,16,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,75,1,'2016-07-26',NULL),(22161,3,2,NULL,'STATUS_UNDEFINED','Setup Weekly Operations Call','','','2016-08-05','2016-08-26',45,60,16,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,76,75,'2016-07-26',NULL),(22162,3,2,NULL,'STATUS_UNDEFINED','Initiate ISO Service Readiness Process','','','2016-08-05','2016-08-18',45,54,10,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,77,75,'2016-07-26',NULL),(22163,3,2,NULL,'STATUS_UNDEFINED','PIR - Post-Implementation Review','','','2016-08-05','2016-08-18',45,54,10,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,1,0,78,75,'2016-07-26',NULL),(22164,3,3,NULL,'STATUS_UNDEFINED','Trigger CSAT Form for feedback','','','2016-08-05','2016-08-11',45,49,5,'',0,5,5,'2016-07-29 00:00:00','2016-07-29 00:00:00',1,0,0,79,78,'2016-07-26',NULL),(22165,4,0,NULL,NULL,'Demo test','','','2015-10-13','2017-12-13',1,567,566,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,1,0,NULL,NULL),(22166,4,1,NULL,NULL,'Phase 1: Proposal & Identification Stage','8','13','2016-08-01','2016-08-01',210,210,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,2,1,NULL,NULL),(22167,4,2,NULL,NULL,'Service Readiness team to send across Project Initiation email','10','9','2016-08-01','2016-08-01',210,210,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,3,2,NULL,NULL),(22168,4,2,NULL,NULL,'Share Contract Agreement (LOI/SOW/MSA)','10','5','2016-08-01','2016-08-01',210,210,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,4,2,NULL,NULL),(22169,4,2,NULL,NULL,'Initiate Project Creation to Finance Team','8','11','2016-08-01','2016-08-01',210,210,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,5,2,NULL,NULL),(22170,4,1,NULL,NULL,'Phase 2: Requirement Gathering & Define Project Objectives','9','10','2016-08-02','2016-08-03',211,212,2,'2',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,6,1,NULL,NULL),(22171,4,2,NULL,NULL,'Internal Project Kick-off Meeting','5','9','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,7,6,NULL,NULL),(22172,4,2,NULL,NULL,'Internal - Recruitment Meeting','11','10','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,8,6,NULL,NULL),(22173,4,3,NULL,NULL,'Profile Calibration / Job Analysis','8','13','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,9,8,NULL,NULL),(22174,4,3,NULL,NULL,'Sourcing/ Existing pool/ Internal & External resources','12','11','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,10,8,NULL,NULL),(22175,4,3,NULL,NULL,'Screening and Selection Process','12','11','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,11,8,NULL,NULL),(22176,4,3,NULL,NULL,'Initate RRF','10','10','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,12,8,NULL,NULL),(22177,4,2,NULL,NULL,'Internal - Training Meeting','10','11','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,13,6,NULL,NULL),(22178,4,3,NULL,NULL,'Discuss on the Training Plan (Modules/Content to be covered for Technology and Foundation Training).','10','11','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,14,13,NULL,NULL),(22179,4,3,NULL,NULL,'Share draft training plan','10','11','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,15,13,NULL,NULL),(22180,4,3,NULL,NULL,'Identify Trainer, Training room, Training IT Requirements (Software, Hardware, etc.)','11','8','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,16,13,NULL,NULL),(22181,4,2,NULL,NULL,'Internal Meeting - IT INFRA Readiness','11','12','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,17,6,NULL,NULL),(22182,4,3,NULL,NULL,'Seat allocation (ODC/Lab Space allocation)','11','12','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,18,17,NULL,NULL),(22183,4,3,NULL,NULL,'Review Contract requirements( Data/Voice)','11','10','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,19,17,NULL,NULL),(22184,4,3,NULL,NULL,'Create Group ID','12','12','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,20,17,NULL,NULL),(22185,4,3,NULL,NULL,'Discuss on Lab  Setup - Product shipping process/challenges and ETA From Proforma to delivery.','11','11','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,21,17,NULL,NULL),(22186,4,3,NULL,NULL,'Raise RRF / Create PR in SAP','11','12','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,22,17,NULL,NULL),(22187,4,2,NULL,NULL,'Create draft project plan for review','11','12','2016-08-03','2016-08-03',212,212,1,'22',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,23,6,NULL,NULL),(22188,4,2,NULL,NULL,'Project kick-off','11','12','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,24,6,NULL,NULL),(22189,4,3,NULL,NULL,'Finalize Weekly Recurring Meeting','10','11','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,25,24,NULL,NULL),(22190,4,3,NULL,NULL,'Introduce key Participants','11','11','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,26,24,NULL,NULL),(22191,4,3,NULL,NULL,'Discuss on Subcommittee meetings for respective Domain','12','12','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,27,24,NULL,NULL),(22192,4,2,NULL,NULL,'CSS Corp - VeloCloud Recruitment Subcommittee Meeting','12','11','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,28,6,NULL,NULL),(22193,4,2,NULL,NULL,'CSS Corp - VeloCloud Training Subcommittee Meeting','10','12','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,29,6,NULL,NULL),(22194,4,3,NULL,NULL,'Discuss on training approach/refresher training and training modules.','11','12','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,30,29,NULL,NULL),(22195,4,2,NULL,NULL,'CSS Corp - VeloCloud IT Infra subcommittee Meeting','13','10','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,31,6,NULL,NULL),(22196,4,3,NULL,NULL,'Discuss on the Data Connectivity (SalesForce, PagerDuty, External Lab access -VPN requirement).','8','5','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,32,31,NULL,NULL),(22197,4,3,NULL,NULL,'Discuss on Voice Connectivity (RingCentral - Call routing)','9','10','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,33,31,NULL,NULL),(22198,4,3,NULL,NULL,'Finalize Lab Readiness, Voice & Data Requirement, review and Sign-off for Implementation','11','10','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,34,31,NULL,NULL),(22199,4,2,NULL,NULL,'Share updated - draft Project plan','12','12','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,35,6,NULL,NULL),(22200,4,2,NULL,NULL,'Share finalized project plan with Timeliness for VeloCloud review and Sign-off','11','13','2016-08-02','2016-08-02',211,211,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,36,6,NULL,NULL),(22201,4,1,NULL,NULL,'Phase 3: Solution Design','13','10','2016-08-04','2016-08-29',213,230,18,'6',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,37,1,NULL,NULL),(22202,4,2,NULL,NULL,'Project Structure to be created (Billing/Rechargeable/Penalty/Cost Project/Procurement)','9','11','2016-08-29','2016-08-29',230,230,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,38,37,NULL,NULL),(22203,4,2,NULL,NULL,'Recruitment & On-boarding','10','11','2016-08-01','2017-11-20',210,550,341,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,39,37,NULL,NULL),(22204,4,3,NULL,NULL,'Batch 1  ( 2 Engineers)','11','5','2016-10-24','2016-10-24',270,270,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,40,39,NULL,NULL),(22205,4,3,NULL,NULL,'Batch 2 ( 1 Tech Lead & 3 Engineers)','11','10','2017-01-09','2017-01-09',325,325,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,41,39,NULL,NULL),(22206,4,3,NULL,NULL,'Batch 3  ( 2 Engineers)','11','10','2017-08-10','2017-08-10',478,478,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,42,39,NULL,NULL),(22207,4,2,NULL,NULL,'INFRA Procure & Deploy','9','11','2017-07-31','2017-07-31',470,470,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,43,37,NULL,NULL),(22208,4,3,NULL,NULL,'Training Readiness - All IT requirements for Training (Lab, Data, etc.)','13','8','2017-07-31','2017-07-31',470,470,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,44,43,NULL,NULL),(22209,4,3,NULL,NULL,'Procure Laptop, Phone, Headset, software licenses, Toll free/Toll Number, etc','11','12','2017-07-31','2017-07-31',470,470,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,45,43,NULL,NULL),(22210,4,3,NULL,NULL,'Training room readiness - System (laptops/desktops), required bandwidth as per the training requirements.','10','10','2017-07-31','2017-07-31',470,470,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,46,43,NULL,NULL),(22211,4,3,NULL,NULL,'Training Material - (Hard copy/Soft copy), access to external Lab/Internal lab access.','13','10','2017-07-31','2017-07-31',470,470,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,47,43,NULL,NULL),(22212,4,3,NULL,NULL,'Floor /Bandwidth Requirements - Data Connectivity, Voice connectivity, Lab access, etc.','11','11','2017-07-31','2017-07-31',470,470,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,48,43,NULL,NULL),(22213,4,3,NULL,NULL,'Lab Requirements (External Lab Access)','11','12','2017-07-31','2017-07-31',470,470,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,49,43,NULL,NULL),(22214,4,1,NULL,NULL,'Phase:4 Project Execution','12','10','2015-10-13','2017-11-24',1,554,553,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,50,1,NULL,NULL),(22215,4,2,NULL,NULL,'Training (On-site Training & Case Handling)','12','11','2016-08-05','2017-11-24',214,554,341,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,51,50,NULL,NULL),(22216,4,3,NULL,NULL,'Batch 1  ( 2 Engineers)','9','11','2016-10-25','2016-10-25',271,271,1,'40',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,52,51,NULL,NULL),(22217,4,3,NULL,NULL,'Batch 2 ( 1 Tech Lead & 3 Engineers)','11','10','2017-01-10','2017-01-10',326,326,1,'41',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,53,51,NULL,NULL),(22218,4,3,NULL,NULL,'Batch 3  ( 2 Engineers)','11','10','2017-08-11','2017-08-11',479,479,1,'42',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,54,51,NULL,NULL),(22219,4,2,NULL,NULL,'IT Setup & Lab Setup','10','12','2016-08-30','2016-08-30',231,231,1,'37',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,55,50,NULL,NULL),(22220,4,3,NULL,NULL,'Floor Readiness  ','11','12','2016-08-30','2016-08-30',231,231,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,56,55,NULL,NULL),(22221,4,3,NULL,NULL,'Data & Voice Connectivity','11','11','2016-08-30','2016-08-30',231,231,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,57,55,NULL,NULL),(22222,4,3,NULL,NULL,'Lab Connectivity','9','10','2016-08-30','2016-08-30',231,231,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,58,55,NULL,NULL),(22223,4,2,NULL,NULL,'PROJECT DOCUMENTS FOR OPERATIONAL','12','11','2016-08-30','2016-08-30',231,231,1,'37',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,59,50,NULL,NULL),(22224,4,3,NULL,NULL,'Creating a detailed SIP / SOP for the Project','10','12','2016-08-30','2016-08-30',231,231,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,60,59,NULL,NULL),(22225,4,3,NULL,NULL,'Creating a detailed Quality Assurance for the Project capturing how to monitor and measure the performance parameters','10','12','2016-08-30','2016-08-30',231,231,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,61,59,NULL,NULL),(22226,4,3,NULL,NULL,'Define all the performance parameters that are to be tracked for Weekly / Monthly / Quarterly reviews & reports','12','13','2016-08-30','2016-08-30',231,231,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,62,59,NULL,NULL),(22227,4,3,NULL,NULL,'Release all Process documents created to the team and maintain version control','12','12','2016-08-30','2016-08-30',231,231,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,63,59,NULL,NULL),(22228,4,2,NULL,NULL,'User Acceptance Testing','12','9','2016-08-31','2016-08-31',232,232,1,'59',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,64,50,NULL,NULL),(22229,4,2,NULL,NULL,'ShareUser Acceptance Checklist','12','11','2016-08-31','2016-08-31',232,232,1,'59',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,65,50,NULL,NULL),(22230,4,2,NULL,NULL,'User acceptance testing - share status and feedback','10','11','2016-08-31','2016-08-31',232,232,1,'59',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,66,50,NULL,NULL),(22231,4,2,NULL,NULL,'Parallel Run/Go-live','11','11','2015-10-13','2017-08-14',1,480,479,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,67,50,NULL,NULL),(22232,4,3,NULL,NULL,'Batch 1  ( 2 Engineers)','11','12','2016-10-26','2016-10-26',272,272,1,'52',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,68,67,NULL,NULL),(22233,4,3,NULL,NULL,'Batch 2 ( 1 Tech Lead & 3 Engineers)','11','9','2017-01-11','2017-01-11',327,327,1,'53',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,69,67,NULL,NULL),(22234,4,3,NULL,NULL,'Batch 3  ( 2 Engineers)','11','12','2017-08-14','2017-08-14',480,480,1,'54',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,70,67,NULL,NULL),(22235,4,4,NULL,NULL,'Go-live Announcement ','10','13','2017-08-14','2017-08-14',480,480,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,71,70,NULL,NULL),(22236,4,1,NULL,NULL,'Phase:6 Service Delivery','12','8','2017-12-13','2017-12-13',567,567,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,72,1,NULL,NULL),(22237,4,2,NULL,NULL,'Setup Weekly Operations Call','11','9','2017-12-13','2017-12-13',567,567,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,73,72,NULL,NULL),(22238,4,2,NULL,NULL,'Initiate ISO Service Readiness Process','11','9','2017-12-13','2017-12-13',567,567,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,74,72,NULL,NULL),(22239,4,2,NULL,NULL,'PIR - Post-Implementation Review','11','12','2017-12-13','2017-12-13',567,567,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,1,0,75,72,NULL,NULL),(22240,4,3,NULL,NULL,'Trigger CSAT Form for feedback','5','10','2017-12-13','2017-12-13',567,567,1,'',0,1,1,'2016-08-03 00:00:00','2016-08-03 00:00:00',1,0,0,76,75,NULL,NULL),(37679,5,0,NULL,'STATUS_UNDEFINED','Trion Worlds','','','2016-06-03','2016-06-09',1,5,5,'',0,1,1,'2016-08-17 00:00:00','2016-08-17 00:00:00',1,1,0,1,0,NULL,NULL),(37680,5,1,NULL,'STATUS_UNDEFINED','CSS submits proposal to Trion Worldn','Executive sponsor','SR','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-08-17 00:00:00','2016-08-17 00:00:00',1,0,0,2,1,NULL,NULL),(37681,5,1,NULL,'STATUS_UNDEFINED','CSS and Trion World sign SOW/ MSA','Executive Sponsor','SR','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-08-17 00:00:00','2016-08-17 00:00:00',1,0,0,3,1,NULL,NULL),(37682,5,1,NULL,'STATUS_UNDEFINED','Submit Draft version 1.0 of the proposed plan to Trion World','Executive Sponsor','Client','2016-06-06','2016-06-06',2,2,1,'',0,1,1,'2016-08-17 00:00:00','2016-08-17 00:00:00',1,0,0,4,1,NULL,NULL),(37683,5,1,NULL,'STATUS_UNDEFINED','Implementation Plan Sign off','Client','SR','2016-06-08','2016-06-08',4,4,1,'',0,1,1,'2016-08-17 00:00:00','2016-08-17 00:00:00',1,0,0,5,1,NULL,NULL),(37684,5,1,NULL,'STATUS_UNDEFINED','Toll Gate Review','ServiceReadiness','SR','2016-06-09','2016-06-09',5,5,1,'',0,1,1,'2016-08-17 00:00:00','2016-08-17 00:00:00',1,0,0,6,1,NULL,NULL),(37685,5,1,NULL,'STATUS_UNDEFINED','Solution Design','Client','SR','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-08-17 00:00:00','2016-08-17 00:00:00',1,1,0,7,1,NULL,NULL),(37686,5,2,NULL,'STATUS_UNDEFINED','Internal Project Kick-off meeting ','Executive Sponsor','SR','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-08-17 00:00:00','2016-08-17 00:00:00',1,0,0,8,7,NULL,NULL),(38248,8,0,NULL,'STATUS_UNDEFINED','ViewSonic','','','2016-07-18','2016-07-18',1,1,1,'',0,1,1,'2016-08-26 00:00:00','2016-08-26 00:00:00',1,0,0,1,0,NULL,NULL),(188970,7,0,NULL,'STATUS_UNDEFINED','Business Opportunity Identification','','','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-09-08 00:00:00','2016-09-08 00:00:00',1,1,0,1,0,NULL,NULL),(188971,7,1,NULL,'STATUS_UNDEFINED','CSS submits proposal to Client','Exe Sponsor','Client','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-09-08 00:00:00','2016-09-08 00:00:00',1,0,0,2,1,NULL,NULL),(188972,7,1,NULL,'STATUS_UNDEFINED','CSS and Client sign SOW/ MSA','Exe Sponsor','Client','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-09-08 00:00:00','2016-09-08 00:00:00',1,0,0,3,1,NULL,NULL),(188973,7,1,NULL,'STATUS_UNDEFINED','Submit Draft version 3.0 of the proposed implementation','Exe Sponsor','Client','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-09-08 00:00:00','2016-09-08 00:00:00',1,0,0,4,1,NULL,NULL),(188974,7,1,NULL,'STATUS_UNDEFINED','Implementation Plan Sign off','Client','Client','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-09-08 00:00:00','2016-09-08 00:00:00',1,0,0,5,1,NULL,NULL),(188975,7,1,NULL,'STATUS_UNDEFINED','Toll Gate Review','Exe Sponsor','Client','2016-06-03','2016-06-03',1,1,1,'',0,1,1,'2016-09-08 00:00:00','2016-09-08 00:00:00',1,0,0,6,1,NULL,NULL),(255076,6,0,NULL,'STATUS_ACTIVE','Alcatel-GNoC','','','2016-06-21','2016-10-10',1,80,80,'',79,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,0,1,0,NULL,NULL),(255077,6,1,NULL,'STATUS_DONE','Phase 1: Proposal & Identification Stage','8','9','2016-06-21','2016-08-08',1,35,35,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,0,2,1,'2016-08-11','2016-08-26'),(255078,6,2,NULL,'STATUS_DONE','Project Identification and Implementation ','5','9','2016-07-19','2016-08-05',21,34,14,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,3,2,NULL,'2016-08-11'),(255079,6,2,NULL,'STATUS_DONE','Share Contract Agreement (LOI/SOW/MSA)','12','10','2016-06-21','2016-08-03',1,32,32,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,1,4,2,'2016-08-11','2016-08-26'),(255080,6,2,NULL,'STATUS_DONE','Discuss on Headcount requirement, Location, Type of Services provided, etc.','9','10','2016-06-21','2016-07-29',1,29,29,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,5,2,NULL,'2016-08-11'),(255081,6,1,NULL,'STATUS_DONE','Phase 2: Requirement Gathering & Define Project Objectives','11','12','2016-07-29','2016-08-29',29,50,22,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,0,6,1,'2016-08-11','2016-08-31'),(255082,6,2,NULL,'STATUS_DONE','Internal Project Kick-off Meeting','12','12','2016-07-29','2016-07-29',29,29,1,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,7,6,NULL,'2016-08-11'),(255083,6,2,NULL,'STATUS_DONE','Internal - Recruitment Meeting','11','11','2016-08-03','2016-08-03',32,32,1,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,8,6,NULL,'2016-08-11'),(255084,6,2,NULL,'STATUS_DONE','Profile Calibration / Job Analysis','11','12','2016-08-03','2016-08-03',32,32,1,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,9,6,NULL,'2016-08-11'),(255085,6,2,NULL,'STATUS_DONE','Sourcing/ Existing pool/ Internal & External resources','10','11','2016-08-03','2016-08-03',32,32,1,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,10,6,NULL,'2016-08-11'),(255086,6,2,NULL,'STATUS_DONE','Screening and Selection Process','10','12','2016-08-03','2016-08-03',32,32,1,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,11,6,NULL,'2016-08-11'),(255087,6,2,NULL,'STATUS_DONE','Initate RRF for approval','11','11','2016-08-03','2016-08-03',32,32,1,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,12,6,NULL,'2016-08-11'),(255088,6,2,NULL,'STATUS_DONE','Internal - Training Meeting','11','13','2016-08-03','2016-08-03',32,32,1,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,13,6,NULL,'2016-08-11'),(255089,6,2,NULL,'STATUS_DONE','Discuss on the Training Plan (Modules/Content to be covered for Technology and Foundation Training).','11','12','2016-08-03','2016-08-03',32,32,1,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,14,6,NULL,'2016-08-11'),(255090,6,2,NULL,'STATUS_DONE','Share draft training plan','11','11','2016-08-03','2016-08-29',32,50,19,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,15,6,'2016-08-11','2016-08-31'),(255091,6,2,NULL,'STATUS_DONE','Identify Trainer, Training room, Training IT requirements ( Software, Hardware, etc.)','10','10','2016-08-03','2016-08-03',32,32,1,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,16,6,'2016-08-11','2016-08-31'),(255092,6,2,NULL,'STATUS_DONE','Internal Meeting - IT INFRA Readiness','12','11','2016-08-03','2016-08-08',32,35,4,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,17,6,NULL,'2016-08-11'),(255093,6,2,NULL,'STATUS_DONE','Seat Allocation ( ODC/Lab Space allocation)','10','10','2016-08-03','2016-08-05',32,34,3,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,18,6,NULL,'2016-08-11'),(255094,6,2,NULL,'STATUS_DONE','Review Contract requirements( Data/Voice)','11','10','2016-08-03','2016-08-08',32,35,4,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,19,6,NULL,'2016-08-11'),(255095,6,2,NULL,'STATUS_DONE','Create Group ID','12','10','2016-08-03','2016-08-08',32,35,4,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,20,6,NULL,'2016-08-11'),(255096,6,2,NULL,'STATUS_DONE','Procurement approval - CapEX & OpEX','9','10','2016-08-03','2016-08-09',32,36,5,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,21,6,NULL,'2016-08-11'),(255097,6,2,NULL,'STATUS_DONE','Raise RRF / Create PR in SAP','13','11','2016-08-03','2016-08-10',32,37,6,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,22,6,NULL,'2016-08-11'),(255098,6,2,NULL,'STATUS_DONE','Discuss on Voice Connectivity ( TFN/Vanity Number/DID for call routing, etc.).','12','11','2016-08-03','2016-08-05',32,34,3,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,23,6,NULL,'2016-08-11'),(255099,6,2,NULL,'STATUS_DONE','Discuss on Lab Setup for Training and Floor readiness, Hardware shipment.','9','11','2016-08-03','2016-08-05',32,34,3,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,24,6,NULL,'2016-08-11'),(255100,6,2,NULL,'STATUS_DONE','Finalize Lab Readiness, Voice & Data Requirement, review and Sign-off for Implementation','10','8','2016-08-03','2016-08-12',32,39,8,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,25,6,NULL,'2016-08-11'),(255101,6,2,NULL,'STATUS_DONE','Create draft Project plan','10','9','2016-08-03','2016-08-08',32,35,4,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,26,6,NULL,'2016-08-11'),(255102,6,2,NULL,'STATUS_DONE','Share finalized project plan with Timeliness for Sam review and Sign-off','10','8','2016-08-03','2016-08-08',32,35,4,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,27,6,NULL,'2016-08-11'),(255103,6,1,NULL,'STATUS_ACTIVE','Phase 3: Solution Design','10','11','2016-08-03','2016-09-07',32,57,26,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,0,28,1,'2016-08-11',NULL),(255104,6,2,NULL,'STATUS_DONE','Recruitment ','9','13','2016-08-03','2016-08-22',32,45,14,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,1,29,28,'2016-08-11','2016-08-31'),(255105,6,3,NULL,'STATUS_DONE','On-boarding Selected Candidates','9','11','2016-08-08','2016-08-19',35,44,10,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,30,29,'2016-08-11','2016-08-31'),(255106,6,2,NULL,'STATUS_ACTIVE','INFRA Procure & Deploy','11','12','2016-08-11','2016-09-07',38,57,20,'22',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,0,31,28,'2016-08-11',NULL),(255107,6,3,NULL,'STATUS_DONE','Training Readiness - All IT requirements for Training','12','8','2016-08-11','2016-08-19',38,44,7,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,32,31,NULL,'2016-08-11'),(255108,6,3,NULL,'STATUS_DONE','Training room readiness - system (laptops/desktops), required bandwidth as per the training requirements.','9','11','2016-08-11','2016-08-19',38,44,7,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,33,31,NULL,'2016-08-11'),(255109,6,3,NULL,'STATUS_DONE','Training Material - (Hard copy/Soft copy)','12','8','2016-08-11','2016-08-29',38,50,13,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,34,31,NULL,'2016-08-11'),(255110,6,3,NULL,'STATUS_ACTIVE','Floor /Bandwidth Requirements - Data Connectivity, Voice connectivity, Lab access, etc.','9','8','2016-08-11','2016-09-07',38,57,20,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,35,31,'2016-08-11',NULL),(255111,6,1,NULL,'STATUS_ACTIVE','Phase 4: Project Execution','12','10','2016-08-03','2016-09-21',32,67,36,'',89,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,0,36,1,'2016-08-11',NULL),(255112,6,2,NULL,'STATUS_ACTIVE','Training','10','8','2016-08-22','2016-09-02',45,54,10,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,1,37,36,'2016-08-11',NULL),(255113,6,3,NULL,'STATUS_ACTIVE','SWAY Training','11','13','2016-08-22','2016-08-26',45,49,5,'30',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,38,37,'2016-08-31',NULL),(255114,6,3,NULL,'STATUS_SUSPENDED','ALE_GNOC - Product and Process Training','9','8','2016-08-29','2016-09-02',50,54,5,'38',0,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,39,37,NULL,NULL),(255115,6,2,NULL,'STATUS_SUSPENDED','IT Setup & Lab Setup','13','9','2016-09-08','2016-09-21',58,67,10,'35',70,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,0,40,36,NULL,NULL),(255116,6,3,NULL,'STATUS_SUSPENDED','Floor Readiness  ','13','9','2016-09-08','2016-09-21',58,67,10,'',70,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,41,40,NULL,NULL),(255117,6,3,NULL,'STATUS_SUSPENDED','Data & Voice Connectivity','11','11','2016-09-08','2016-09-21',58,67,10,'',70,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,42,40,NULL,NULL),(255118,6,1,NULL,'STATUS_ACTIVE','Phase 5: UAT & Go-live','11','12','2016-08-03','2016-09-05',32,55,24,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,0,43,1,'2016-08-11',NULL),(255119,6,2,NULL,'STATUS_ACTIVE','User Acceptance Testing','12','12','2016-08-29','2016-08-31',50,52,3,'',100,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,44,43,'2016-08-11',NULL),(255120,6,2,NULL,'STATUS_SUSPENDED','User acceptance testing - share status and feedback','9','9','2016-09-01','2016-09-02',53,54,2,'44',0,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,45,43,'2016-08-11',NULL),(255121,6,2,NULL,'STATUS_SUSPENDED','Go-live','11','11','2016-09-05','2016-09-05',55,55,1,'44,39',0,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,1,46,43,NULL,NULL),(255122,6,1,NULL,'STATUS_SUSPENDED','Phase 6: Service Delivery','9','10','2016-09-06','2016-10-10',56,80,25,'46',0,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,1,0,47,1,NULL,NULL),(255123,6,2,NULL,'STATUS_SUSPENDED','Initiate ISO Service Readiness Process','9','10','2016-09-06','2016-09-06',56,56,1,'',0,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,48,47,NULL,NULL),(255124,6,2,NULL,'STATUS_SUSPENDED','PIR - Post-Implementation Review','10','13','2016-09-06','2016-09-12',56,60,5,'',0,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,49,47,NULL,NULL),(255125,6,2,NULL,'STATUS_SUSPENDED','Feedback form to be triggered','9','10','2016-09-06','2016-09-12',56,60,5,'',0,5,5,'2016-09-15 00:00:00','2016-09-15 00:00:00',1,0,0,50,47,NULL,NULL),(255411,9,0,NULL,'STATUS_UNDEFINED','Google','','','2016-09-05','2016-09-22',1,14,14,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,1,0,NULL,NULL),(255412,9,1,NULL,'STATUS_UNDEFINED','Business Opportunity Identification','Executive Sponsor','Client','2016-09-05','2016-09-19',1,11,11,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,2,1,NULL,NULL),(255413,9,2,NULL,'STATUS_UNDEFINED','CSS submits proposal to Google','Exe Sponsor','Client','2016-09-06','2016-09-06',2,2,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,3,2,NULL,NULL),(255414,9,2,NULL,'STATUS_UNDEFINED','CSS and Google sign SOW/ MSA','Service Readiness','Client','2016-09-07','2016-09-13',3,7,5,'3',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,4,2,NULL,NULL),(255415,9,2,NULL,'STATUS_UNDEFINED','Submit Draft version 1.0 of the proposed implementation','SR Consultant','SR Consultant','2016-09-14','2016-09-15',8,9,2,'4',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,5,2,NULL,NULL),(255416,9,2,NULL,'STATUS_UNDEFINED','Implementation Plan Sign off','Client','SR','2016-09-16','2016-09-16',10,10,1,'5',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,6,2,NULL,NULL),(255417,9,2,NULL,'STATUS_UNDEFINED','Toll Gate Review','SR','Client','2016-09-19','2016-09-19',11,11,1,'6',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,7,2,NULL,NULL),(255418,9,1,NULL,'STATUS_UNDEFINED','Solution Design','SR','SR','2016-09-05','2016-09-21',1,13,13,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,8,1,NULL,NULL),(255419,9,2,NULL,'STATUS_UNDEFINED','Internal Project Kick-off meeting ','Exe Sponsor','SR','2016-09-19','2016-09-19',11,11,1,'6',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,9,8,NULL,NULL),(255420,9,2,NULL,'STATUS_UNDEFINED','Decide on recurring internal meeting schedule with SR Consultants','SR','SR','2016-09-19','2016-09-19',11,11,1,'6',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,10,8,NULL,NULL),(255421,9,2,NULL,'STATUS_UNDEFINED','Project kick- off meeting with Google','SR','SR','2016-09-20','2016-09-20',12,12,1,'10',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,11,8,NULL,NULL),(255422,9,2,NULL,'STATUS_UNDEFINED','Fix a schedule for all upcoming meetings','SR','SR','2016-09-19','2016-09-19',11,11,1,'6',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,12,8,NULL,NULL),(255423,9,2,NULL,'STATUS_UNDEFINED','Share Communication matrix','SR','SR','2016-09-19','2016-09-19',11,11,1,'6',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,13,8,NULL,NULL),(255424,9,2,NULL,'STATUS_UNDEFINED','Requirement Gathering','SR','SR','2016-09-19','2016-09-19',11,11,1,'6',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,14,8,NULL,NULL),(255425,9,2,NULL,'STATUS_UNDEFINED','Analyze Client Requirements','SR','SR','2016-09-19','2016-09-19',11,11,1,'6',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,15,8,NULL,NULL),(255426,9,1,NULL,'STATUS_UNDEFINED','Analyze human resource requirement (skills, knowledge, profile and number of FTEs)','SR','SR','2016-09-05','2016-09-22',1,14,14,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,16,1,NULL,NULL),(255427,9,2,NULL,'STATUS_UNDEFINED','Get Client sign-off on JD','Recruitment','SR','2016-09-21','2016-09-22',13,14,2,'11',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,17,16,NULL,NULL),(255428,9,2,NULL,'STATUS_UNDEFINED','Determine Capacity - Seats & Location','Client','SR','2016-09-20','2016-09-20',12,12,1,'9',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,18,16,NULL,NULL),(255429,9,2,NULL,'STATUS_UNDEFINED','Determine Training requirements -Trainer, Number of days, Classroom, etc','Project','SR','2016-09-21','2016-09-21',13,13,1,'18',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,19,16,NULL,NULL),(255430,9,2,NULL,'STATUS_UNDEFINED','Determine MIS reporting ','Training','SR','2016-09-21','2016-09-21',13,13,1,'11',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,20,16,NULL,NULL),(255431,9,2,NULL,'STATUS_UNDEFINED','Determine IT Infrastructure  - Bandwidth (E1s, Switches, IP Phones, Servers, Desktops & Software\'s)','MIS Consultant','SR','2016-09-21','2016-09-21',13,13,1,'11',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,21,16,NULL,NULL),(255432,9,1,NULL,'STATUS_UNDEFINED','HR Subcommittee Meeting','IT Service','SR','2016-09-21','2016-09-21',13,13,1,'11',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,22,1,NULL,NULL),(255433,9,1,NULL,'STATUS_UNDEFINED','Training Subcommittee Meeting','Training','SR','2016-09-21','2016-09-21',13,13,1,'11',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,23,1,NULL,NULL),(255434,9,1,NULL,'STATUS_UNDEFINED','IT Subcommittee Meeting ','IT Service','SR','2016-09-21','2016-09-21',13,13,1,'11',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,24,1,NULL,NULL),(255435,9,1,NULL,'STATUS_UNDEFINED','Toll Gate Review','SR','SR','2016-09-21','2016-09-21',13,13,1,'11',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,25,1,NULL,NULL),(255436,9,1,NULL,'STATUS_UNDEFINED','Planning & Resourcing','SR','SR','2016-09-05','2016-09-20',1,12,12,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,26,1,NULL,NULL),(255437,9,2,NULL,'STATUS_UNDEFINED','Devise organizational structure, Roles & Responsibilities','SR','Recruitment','2016-09-20','2016-09-20',12,12,1,'2',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,27,26,NULL,NULL),(255438,9,2,NULL,'STATUS_UNDEFINED','Share Job Description to recruitment','SR','Client','2016-09-20','2016-09-20',12,12,1,'2',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,28,26,NULL,NULL),(255439,9,2,NULL,'STATUS_UNDEFINED','Define team composition (by skill set, knowledge and tenure)','Project','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,29,26,NULL,NULL),(255440,9,1,NULL,'STATUS_UNDEFINED','CSS - Recruitment Phases ','Recruitment','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,30,1,NULL,NULL),(255441,9,2,NULL,'STATUS_UNDEFINED',' Tier I - English (Voice)','Recruitment','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,31,30,NULL,NULL),(255442,9,1,NULL,'STATUS_UNDEFINED','Finalize Training Requirements','Training','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,32,1,NULL,NULL),(255443,9,2,NULL,'STATUS_UNDEFINED','Check on connectivity and whether all Client tools are working in the training room.','Training','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,33,32,NULL,NULL),(255444,9,2,NULL,'STATUS_UNDEFINED','Check all hardware (PC\'s, Projectors,etc) are all working and available.','Training','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,34,32,NULL,NULL),(255445,9,2,NULL,'STATUS_UNDEFINED','Distribute training schedule to the stakeholders with trainer information.','Training','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,35,32,NULL,NULL),(255446,9,1,NULL,'STATUS_UNDEFINED','Finalize IT Requirements','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,36,1,NULL,NULL),(255447,9,2,NULL,'STATUS_UNDEFINED','Confirm Seating Plan','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,37,36,NULL,NULL),(255448,9,2,NULL,'STATUS_UNDEFINED','Check on all hardware requirements (PCs, tools etc)','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,38,36,NULL,NULL),(255449,9,2,NULL,'STATUS_UNDEFINED','Check on VLAN, and the required bandwidth.','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,39,36,NULL,NULL),(255450,9,2,NULL,'STATUS_UNDEFINED','Whitelist to be provided and prelimanary access to be checked.','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,40,36,NULL,NULL),(255451,9,2,NULL,'STATUS_UNDEFINED','Any Special/Additional requirements','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,41,36,NULL,NULL),(255452,9,2,NULL,'STATUS_UNDEFINED','RRF\'s to be raised','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,42,36,NULL,NULL),(255453,9,1,NULL,'STATUS_UNDEFINED','Implementation (Development, Integration,  Training)','SR','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,43,1,NULL,NULL),(255454,9,2,NULL,'STATUS_UNDEFINED','Train the Trainer/Trainer Travel','Client','Training','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,44,43,NULL,NULL),(255455,9,1,NULL,'STATUS_UNDEFINED','Training Implementation','Training','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,45,1,NULL,NULL),(255456,9,2,NULL,'STATUS_UNDEFINED','CSS Communication Training','Training','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,46,45,NULL,NULL),(255457,9,2,NULL,'STATUS_UNDEFINED','CSS Technical Foundation Training','Training','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,47,45,NULL,NULL),(255458,9,2,NULL,'STATUS_UNDEFINED','Google Product & Process Training ','Training','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,48,45,NULL,NULL),(255459,9,1,NULL,'STATUS_UNDEFINED','IT Infrastructure Implementation','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,49,1,NULL,NULL),(255460,9,2,NULL,'STATUS_UNDEFINED','Procure PCs (Production Seat)','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,50,49,NULL,NULL),(255461,9,2,NULL,'STATUS_UNDEFINED','Install software and tools for Production Machines & supervisor machines','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,51,49,NULL,NULL),(255462,9,2,NULL,'STATUS_UNDEFINED','Provide CRM access &  login credentials for agents','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,52,49,NULL,NULL),(255463,9,2,NULL,'STATUS_UNDEFINED','IT Infrastructure Implementation sign - off','IT Service','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,53,49,NULL,NULL),(255464,9,1,NULL,'STATUS_UNDEFINED','QA Process - Defining Quality Assurance process','QA Consultant','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,54,1,NULL,NULL),(255465,9,2,NULL,'STATUS_UNDEFINED','Create/Share QA Forms & Methodology for different silo','QA','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,55,54,NULL,NULL),(255466,9,2,NULL,'STATUS_UNDEFINED','Agree on the methodology for analysis and reporting content and frequency.','QA','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,56,54,NULL,NULL),(255467,9,2,NULL,'STATUS_UNDEFINED','Upload QA form into QA Portal','QA','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,57,54,NULL,NULL),(255468,9,2,NULL,'STATUS_UNDEFINED','Discuss and Confirm on QA Calibration Process','QA','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,58,54,NULL,NULL),(255469,9,2,NULL,'STATUS_UNDEFINED','Client to sign-off QA process','QA','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,59,54,NULL,NULL),(255470,9,1,NULL,'STATUS_UNDEFINED','CSAT Survey Process','Operations','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,60,1,NULL,NULL),(255471,9,2,NULL,'STATUS_UNDEFINED','Client to Share existing CSAT Form, scoring methodology','Client','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,61,60,NULL,NULL),(255472,9,2,NULL,'STATUS_UNDEFINED','Define CSAT Survey mechanism','Client','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,62,60,NULL,NULL),(255473,9,2,NULL,'STATUS_UNDEFINED','Agree on methodology for analysis and reporting content and frequency.','Operations','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,63,60,NULL,NULL),(255474,9,2,NULL,'STATUS_UNDEFINED','Client to Sign-off Csat Process','Client','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,64,60,NULL,NULL),(255475,9,1,NULL,'STATUS_UNDEFINED','Workforce Management & MIS','WFM Consultant','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,65,1,NULL,NULL),(255476,9,2,NULL,'STATUS_UNDEFINED','CSS to Provide staffing and scheduling','WFM','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,66,65,NULL,NULL),(255477,9,2,NULL,'STATUS_UNDEFINED','Client to Share the reporting requirement (Format, Frequency & Distro)','WFM','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,67,65,NULL,NULL),(255478,9,2,NULL,'STATUS_UNDEFINED','Share existing reporting formats & template','WFM','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,68,65,NULL,NULL),(255479,9,2,NULL,'STATUS_UNDEFINED','WFM & MIS Sign-off ','WFM','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,69,65,NULL,NULL),(255480,9,1,NULL,'STATUS_UNDEFINED','Billing Process','MIS ','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,70,1,NULL,NULL),(255481,9,2,NULL,'STATUS_UNDEFINED','PO Number ','MIS','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,71,70,NULL,NULL),(255482,9,2,NULL,'STATUS_UNDEFINED','Billing Method - Hard copy to local address or e-mail','MIS','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,72,70,NULL,NULL),(255483,9,2,NULL,'STATUS_UNDEFINED','Billing Cycle','MIS','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,73,70,NULL,NULL),(255484,9,2,NULL,'STATUS_UNDEFINED','Address - Address to which invoice to be sent','MIS','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,74,70,NULL,NULL),(255485,9,2,NULL,'STATUS_UNDEFINED','E-mail address for billing recipients ','MIS','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,75,70,NULL,NULL),(255486,9,2,NULL,'STATUS_UNDEFINED','Billing Process, LOI/MSA sent to Finance Consultant','MIS','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,76,70,NULL,NULL),(255487,9,2,NULL,'STATUS_UNDEFINED','Toll Gate Review','MIS','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,77,70,NULL,NULL),(255488,9,1,NULL,'STATUS_UNDEFINED','Go-Live & Nesting','Operations and IT','IT','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,78,1,NULL,NULL),(255489,9,2,NULL,'STATUS_UNDEFINED','User Acceptance Test - Devices/Systems/Application Testing ','Operations','IT','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,79,78,NULL,NULL),(255490,9,2,NULL,'STATUS_UNDEFINED','Test and Confirm the functionality of deployed IT Infra structure','Operations','IT','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,80,78,NULL,NULL),(255491,9,2,NULL,'STATUS_UNDEFINED','CRM Tools and applications testing','Operations','IT','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,81,78,NULL,NULL),(255492,9,2,NULL,'STATUS_UNDEFINED','Check the Application and Tools, required for Client','Operations','IT','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,82,78,NULL,NULL),(255493,9,2,NULL,'STATUS_UNDEFINED','Confirm the accessibility ClientURLs & Websites','Operations','IT','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,83,78,NULL,NULL),(255494,9,2,NULL,'STATUS_UNDEFINED','UAT signoff ','Operations','IT','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,84,78,NULL,NULL),(255495,9,1,NULL,'STATUS_UNDEFINED','Go-live','All and SR','IT','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,85,1,NULL,NULL),(255496,9,2,NULL,'STATUS_UNDEFINED','Nesting','Operations','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,86,85,NULL,NULL),(255497,9,1,NULL,'STATUS_UNDEFINED','Service Delivery','Operations','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,1,0,87,1,NULL,NULL),(255498,9,2,NULL,'STATUS_UNDEFINED','Establish Service Delivery & Service Assurance communication matrix','SR','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,88,87,NULL,NULL),(255499,9,2,NULL,'STATUS_UNDEFINED','Set-up an internal Weekly Operations Meeting to review the teams performance.','Operations','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,89,87,NULL,NULL),(255500,9,2,NULL,'STATUS_UNDEFINED','Set-up a Weekly Call Calibration Meeting to assure our quality monitoring is at goal.','Operations','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,90,87,NULL,NULL),(255501,9,2,NULL,'STATUS_UNDEFINED','Final version of the SIP (Service Implementation Plan) is completed and reviewed. ','Operations','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,91,87,NULL,NULL),(255502,9,2,NULL,'STATUS_UNDEFINED','Set-up a Weekly ClientOperations review meeting to review the teams performance.','Operations','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,92,87,NULL,NULL),(255503,9,2,NULL,'STATUS_UNDEFINED','Project handover to Service Delivery','SR','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,93,87,NULL,NULL),(255504,9,2,NULL,'STATUS_UNDEFINED','Trigger CSAT survey form to Client','SR','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,94,87,NULL,NULL),(255505,9,2,NULL,'STATUS_UNDEFINED','Have a business review with Client to discuss the first 60 days of the program.','SR','SR','2016-09-05','2016-09-05',1,1,1,'',0,1,1,'2016-09-21 00:00:00','2016-09-21 00:00:00',1,0,0,95,87,NULL,NULL);

/*Table structure for table `t_resource_details` */

DROP TABLE IF EXISTS `t_resource_details`;

CREATE TABLE `t_resource_details` (
  `resource_details_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `contact_no` int(30) DEFAULT NULL,
  `work_exp` tinyint(1) DEFAULT NULL,
  `exp_month` int(11) DEFAULT NULL,
  `project_id_fk` int(11) NOT NULL,
  `emp_id` varchar(45) DEFAULT NULL,
  `work_email_id` varchar(45) DEFAULT NULL,
  `designation` varchar(45) DEFAULT NULL,
  `salary` int(11) DEFAULT NULL,
  `doj` date DEFAULT NULL,
  `required_transport` int(11) DEFAULT '0' COMMENT '0 - no\n1 -yes\n',
  `client_interview` int(11) DEFAULT NULL,
  `client_interview_date` datetime DEFAULT NULL,
  `division_id_fk` int(11) NOT NULL,
  `location_id_fk` int(11) NOT NULL,
  `client_interview_status` int(11) DEFAULT '0' COMMENT '0- pending 1- Not Selected, 2- Direct Select, 3- Client Selected',
  `client_comments` text NOT NULL,
  `mailsend` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`resource_details_id_pk`,`project_id_fk`),
  KEY `fk_t_resource_details_has_t_project_mas_t_project_mas1_idx` (`project_id_fk`),
  KEY `fk_t_resource_details_has_t_project_mas_t_resource_details1_idx` (`resource_details_id_pk`),
  KEY `fk_t_resource_project_map_t_division_mas1_idx` (`division_id_fk`),
  KEY `fk_t_resource_project_map_t_location_mas1_idx` (`location_id_fk`),
  CONSTRAINT `fk_t_resource_details_has_t_project_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_resource_project_map_t_division_mas1` FOREIGN KEY (`division_id_fk`) REFERENCES `t_division_mas` (`division_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_resource_project_map_t_location_mas1` FOREIGN KEY (`location_id_fk`) REFERENCES `t_location_mas` (`location_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `t_resource_details` */

insert  into `t_resource_details`(`resource_details_id_pk`,`first_name`,`last_name`,`contact_no`,`work_exp`,`exp_month`,`project_id_fk`,`emp_id`,`work_email_id`,`designation`,`salary`,`doj`,`required_transport`,`client_interview`,`client_interview_date`,`division_id_fk`,`location_id_fk`,`client_interview_status`,`client_comments`,`mailsend`) values (1,'Tester','test',1234567899,1,6,1,'1000','test@email.com','Tester',10000,'2016-09-30',0,0,'0000-00-00 00:00:00',1,1,2,'',0),(2,'Mithran','Amarendran',2147483647,1,24,10,NULL,NULL,'Senior Manager',2147483647,'2016-11-02',0,1,'0000-00-00 00:00:00',1,1,0,'',0),(3,'Mithran','Amarendran',2147483647,0,36,10,'1538','mithran.amarendran@csscorp.com','Senior Manager',2147483647,'2016-09-05',0,1,'2016-08-24 00:00:00',1,4,3,'Selected',0),(4,'Nagalingam','Ramanpillai',995297714,1,4,10,NULL,NULL,'CSR',10000,'2016-09-05',0,1,'2016-09-06 00:00:00',1,1,0,'',0);

/*Table structure for table `t_resource_details_edu_trans` */

DROP TABLE IF EXISTS `t_resource_details_edu_trans`;

CREATE TABLE `t_resource_details_edu_trans` (
  `resource_edu_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `resource_edu_trans_degree` varchar(45) DEFAULT NULL,
  `resource_edu_trans_university` varchar(45) DEFAULT NULL,
  `resource_edu_trans_grade` varchar(45) DEFAULT NULL,
  `resource_details_id_fk` int(11) NOT NULL,
  `resource_edu_trans_period_from` int(11) DEFAULT NULL,
  `resource_edu_trans_period_till` int(11) DEFAULT NULL,
  PRIMARY KEY (`resource_edu_trans_id_pk`),
  KEY `fk_t_resource_details_edu_trans_t_resource_details1_idx` (`resource_details_id_fk`),
  CONSTRAINT `FK_t_resource_details_edu_trans` FOREIGN KEY (`resource_details_id_fk`) REFERENCES `t_resource_details` (`resource_details_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_resource_details_edu_trans` */

/*Table structure for table `t_resource_details_emp_trans` */

DROP TABLE IF EXISTS `t_resource_details_emp_trans`;

CREATE TABLE `t_resource_details_emp_trans` (
  `resource_emp_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `resource_emp_trans_company` varchar(45) DEFAULT NULL,
  `resource_emp_trans_exp` int(11) DEFAULT NULL,
  `resource_emp_trans_period_from` int(11) DEFAULT NULL,
  `resource_emp_trans_period_till` int(11) DEFAULT NULL,
  `resource_details_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`resource_emp_trans_id_pk`),
  KEY `fk_t_resource_details_edu_trans_t_resource_details1_idx` (`resource_details_id_fk`),
  CONSTRAINT `FK_t_resource_details_emp_trans` FOREIGN KEY (`resource_details_id_fk`) REFERENCES `t_resource_details` (`resource_details_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_resource_details_emp_trans` */

/*Table structure for table `t_resource_project_assessment_trans` */

DROP TABLE IF EXISTS `t_resource_project_assessment_trans`;

CREATE TABLE `t_resource_project_assessment_trans` (
  `resource_details_id_fk` int(11) NOT NULL,
  `project_id_fk` int(11) NOT NULL,
  `assessment_ctgy_id_fk` int(11) NOT NULL,
  `assessment_subctgy_id_fk` int(11) NOT NULL,
  `score_percentage` int(11) DEFAULT NULL,
  PRIMARY KEY (`resource_details_id_fk`,`project_id_fk`,`assessment_subctgy_id_fk`),
  KEY `fk_t_resource_project_map_has_t_assessment_subctgy_mas_t_as_idx` (`assessment_subctgy_id_fk`),
  KEY `fk_t_resource_project_map_has_t_assessment_subctgy_mas_t_re_idx` (`resource_details_id_fk`,`project_id_fk`),
  KEY `fk_t_resource_project_assessment_trans_t_assessment_ctgy_ma_idx` (`assessment_ctgy_id_fk`),
  CONSTRAINT `fk_t_resource_project_assessment_trans_t_assessment_ctgy_mas1` FOREIGN KEY (`assessment_ctgy_id_fk`) REFERENCES `t_assessment_ctgy_mas` (`assessment_ctgy_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_resource_project_map_has_t_assessment_subctgy_mas_t_asse1` FOREIGN KEY (`assessment_subctgy_id_fk`) REFERENCES `t_assessment_subctgy_mas` (`assessment_subctgy_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_resource_project_assessment_trans` */

insert  into `t_resource_project_assessment_trans`(`resource_details_id_fk`,`project_id_fk`,`assessment_ctgy_id_fk`,`assessment_subctgy_id_fk`,`score_percentage`) values (1,1,1,1,90),(1,1,1,2,80),(1,1,1,3,70),(1,1,1,4,90),(1,1,2,5,90),(1,1,2,6,85),(1,1,2,7,75),(1,1,2,8,95),(3,10,1,1,100),(3,10,1,2,90),(3,10,1,3,80),(3,10,1,4,90),(3,10,2,5,90),(3,10,2,6,100),(3,10,2,7,80),(3,10,2,8,80);

/*Table structure for table `t_resource_project_attendance_trans` */

DROP TABLE IF EXISTS `t_resource_project_attendance_trans`;

CREATE TABLE `t_resource_project_attendance_trans` (
  `attandance_trans_pk` int(11) NOT NULL AUTO_INCREMENT,
  `resource_details_id_fk` int(11) NOT NULL,
  `project_id_fk` int(11) NOT NULL,
  `date` date NOT NULL,
  `option_id_fk` int(11) NOT NULL,
  `comments` text,
  PRIMARY KEY (`attandance_trans_pk`),
  KEY `fk_t_resource_project_map_has_t_assessment_subctgy_mas_t_re_idx` (`resource_details_id_fk`,`project_id_fk`),
  KEY `fk_t_resource_project_attendance_trans_t_attendance_options_idx` (`option_id_fk`),
  CONSTRAINT `fk_t_resource_project_attendance_trans_t_attendance_options_m1` FOREIGN KEY (`option_id_fk`) REFERENCES `t_attendance_options_mas` (`option_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `t_resource_project_attendance_trans` */

insert  into `t_resource_project_attendance_trans`(`attandance_trans_pk`,`resource_details_id_fk`,`project_id_fk`,`date`,`option_id_fk`,`comments`) values (1,1,1,'2016-08-26',1,'good');

/*Table structure for table `t_service_del_default` */

DROP TABLE IF EXISTS `t_service_del_default`;

CREATE TABLE `t_service_del_default` (
  `service_default_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `metrics_name` varchar(50) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`service_default_id_pk`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `t_service_del_default` */

insert  into `t_service_del_default`(`service_default_id_pk`,`metrics_name`,`created_by`,`created_date`) values (1,'CSAT',3,NULL),(2,'AHT',3,NULL);

/*Table structure for table `t_service_delivery_mas` */

DROP TABLE IF EXISTS `t_service_delivery_mas`;

CREATE TABLE `t_service_delivery_mas` (
  `service_delivery_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `metrics_name` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `metrics_threshold` varchar(50) DEFAULT NULL,
  `projict_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`service_delivery_id_pk`),
  KEY `FK_project_id` (`projict_id_fk`),
  CONSTRAINT `FK_project_id` FOREIGN KEY (`projict_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `t_service_delivery_mas` */

insert  into `t_service_delivery_mas`(`service_delivery_id_pk`,`metrics_name`,`created_by`,`created_date`,`metrics_threshold`,`projict_id_fk`) values (1,'CSAT',2,'2016-07-12 22:54:00','60',1),(2,'AHT',2,'2016-07-12 22:54:00','60',1),(3,'CSAT',1,'2016-08-24 20:35:41','60',7),(4,'AHT',1,'2016-08-24 20:35:41','60',7),(5,'SL%',1,'2016-08-24 20:36:05','60',7),(6,'CSAT',1,'2016-09-08 19:42:42','60',9),(7,'AHT',1,'2016-09-08 19:42:42','60',9);

/*Table structure for table `t_service_delivery_trans` */

DROP TABLE IF EXISTS `t_service_delivery_trans`;

CREATE TABLE `t_service_delivery_trans` (
  `service_delivery_trans_id` int(11) NOT NULL AUTO_INCREMENT,
  `service_delivery_id_fk` int(11) DEFAULT NULL,
  `project_id_fk` int(11) DEFAULT NULL,
  `service_date` datetime DEFAULT NULL,
  `comments` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `service_evaluation` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`service_delivery_trans_id`),
  KEY `project_id_fk` (`project_id_fk`),
  KEY `t_service_delivery_trans_ibfk_1` (`service_delivery_id_fk`),
  CONSTRAINT `t_service_delivery_trans_ibfk_1` FOREIGN KEY (`service_delivery_id_fk`) REFERENCES `t_service_delivery_mas` (`service_delivery_id_pk`) ON DELETE CASCADE,
  CONSTRAINT `t_service_delivery_trans_ibfk_2` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_service_delivery_trans` */

/*Table structure for table `t_sow_trans` */

DROP TABLE IF EXISTS `t_sow_trans`;

CREATE TABLE `t_sow_trans` (
  `sow_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_id_fk` int(11) NOT NULL,
  `sla` text,
  `parameter` text,
  `matrix` text,
  `desc` text,
  PRIMARY KEY (`sow_id_pk`),
  KEY `fk_t_sow_trans_t_project_mas1_idx` (`project_id_fk`),
  CONSTRAINT `fk_t_sow_trans_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `t_sow_trans` */

insert  into `t_sow_trans`(`sow_id_pk`,`project_id_fk`,`sla`,`parameter`,`matrix`,`desc`) values (1,4,'24 Hour Closure','45% to 50%',NULL,NULL),(2,10,NULL,NULL,NULL,'<p><strong><span style=\"font-size:14px\">Test</span></strong></p>\n');

/*Table structure for table `t_special_workingday_mas` */

DROP TABLE IF EXISTS `t_special_workingday_mas`;

CREATE TABLE `t_special_workingday_mas` (
  `splworking_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `project_id_fk` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`splworking_id_pk`),
  KEY `project_id_fk` (`project_id_fk`),
  CONSTRAINT `t_special_workingday_mas_ibfk_1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `t_special_workingday_mas` */

insert  into `t_special_workingday_mas`(`splworking_id_pk`,`project_id_fk`,`created_by`,`created_date`,`updated_by`,`updated_date`) values (1,1,1,'2016-07-15 00:00:00',1,'2016-07-15 00:00:00'),(2,4,5,'2016-07-27 00:00:00',5,'2016-07-27 00:00:00'),(3,3,6,'2016-07-27 00:00:00',6,'2016-07-27 00:00:00');

/*Table structure for table `t_special_workingday_trans` */

DROP TABLE IF EXISTS `t_special_workingday_trans`;

CREATE TABLE `t_special_workingday_trans` (
  `splworking_trans_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `splworking_id_fk` int(11) DEFAULT NULL,
  `special_date` date DEFAULT NULL,
  `comments` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`splworking_trans_id_pk`),
  KEY `splworking_id_fk` (`splworking_id_fk`),
  CONSTRAINT `t_special_workingday_trans_ibfk_1` FOREIGN KEY (`splworking_id_fk`) REFERENCES `t_special_workingday_mas` (`splworking_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `t_special_workingday_trans` */

insert  into `t_special_workingday_trans`(`splworking_trans_id_pk`,`splworking_id_fk`,`special_date`,`comments`,`created_by`,`created_date`) values (1,1,'2016-08-17','Holiday Required',1,'2016-07-15 00:00:00'),(2,2,'2016-08-08','Naga h',5,'2016-07-27 00:00:00'),(3,2,'2016-08-23','sdfsdf',5,'2016-07-27 00:00:00'),(4,2,'2016-08-16','sdfsdf',5,'2016-07-27 00:00:00'),(5,2,'2016-08-15','sdfsdf',5,'2016-07-27 00:00:00'),(6,2,'2016-09-02','sdfsdf',5,'2016-07-27 00:00:00'),(7,3,'2016-08-24','Holiday',6,'2016-07-27 00:00:00');

/*Table structure for table `t_timezone_mas` */

DROP TABLE IF EXISTS `t_timezone_mas`;

CREATE TABLE `t_timezone_mas` (
  `timezone_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `timezone_name` varchar(45) DEFAULT NULL,
  `timezone_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`timezone_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `t_timezone_mas` */

insert  into `t_timezone_mas`(`timezone_id_pk`,`timezone_name`,`timezone_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`) values (1,'IST','test',1,1,'2016-01-20 00:00:00','2016-01-20 00:00:00'),(2,'GMT','GMT',1,1,'2016-01-20 00:00:00','2016-01-20 00:00:00');

/*Table structure for table `t_timezonedet_mas` */

DROP TABLE IF EXISTS `t_timezonedet_mas`;

CREATE TABLE `t_timezonedet_mas` (
  `timezone_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `country_name` varchar(50) NOT NULL,
  `timezone` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`timezone_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8;

/*Data for the table `t_timezonedet_mas` */

insert  into `t_timezonedet_mas`(`timezone_id_pk`,`country_name`,`timezone`,`created_by`,`created_date`,`status`) values (1,'Andorra','Europe/Andorra',3,'2016-03-24 14:00:34',1),(2,'United Arab Emirates','Asia/Dubai',3,'2016-03-24 14:00:34',1),(3,'Afghanistan','Asia/Kabul',3,'2016-03-24 14:00:34',1),(4,'Antigua and Barbuda','America/Antigua',3,'2016-03-24 14:00:34',1),(5,'Anguilla','America/Anguilla',3,'2016-03-24 14:00:34',1),(6,'Albania','Europe/Tirane',3,'2016-03-24 14:00:34',1),(7,'Armenia','Asia/Yerevan',3,'2016-03-24 14:00:34',1),(8,'Angola','Africa/Luanda',3,'2016-03-24 14:00:34',1),(9,'Antarctica','Antarctica/McMurdo',3,'2016-03-24 14:00:34',1),(10,'Argentina','America/Argentina/Buenos_Aires',3,'2016-03-24 14:00:34',1),(11,'American Samoa','Pacific/Pago_Pago',3,'2016-03-24 14:00:34',1),(12,'Austria','Europe/Vienna',3,'2016-03-24 14:00:34',1),(13,'Australia','Australia/Lord_Howe',3,'2016-03-24 14:00:34',1),(14,'Aruba','America/Aruba',3,'2016-03-24 14:00:34',1),(15,'Aland Islands','Europe/Mariehamn',3,'2016-03-24 14:00:34',1),(16,'Azerbaijan','Asia/Baku',3,'2016-03-24 14:00:34',1),(17,'Bosnia and Herzegovina','Europe/Sarajevo',3,'2016-03-24 14:00:34',1),(18,'Barbados','America/Barbados',3,'2016-03-24 14:00:34',1),(19,'Bangladesh','Asia/Dhaka',3,'2016-03-24 14:00:34',1),(20,'Belgium','Europe/Brussels',3,'2016-03-24 14:00:34',1),(21,'Burkina Faso','Africa/Ouagadougou',3,'2016-03-24 14:00:34',1),(22,'Bulgaria','Europe/Sofia',3,'2016-03-24 14:00:34',1),(23,'Bahrain','Asia/Bahrain',3,'2016-03-24 14:00:34',1),(24,'Burundi','Africa/Bujumbura',3,'2016-03-24 14:00:34',1),(25,'Benin','Africa/Porto-Novo',3,'2016-03-24 14:00:34',1),(26,'Saint Barthélemy','America/St_Barthelemy',3,'2016-03-24 14:00:34',1),(27,'Bermuda','Atlantic/Bermuda',3,'2016-03-24 14:00:34',1),(28,'Brunei','Asia/Brunei',3,'2016-03-24 14:00:34',1),(29,'Bolivia','America/La_Paz',3,'2016-03-24 14:00:34',1),(30,'Bonaire, Saint Eustatius and Saba ','America/Kralendijk',3,'2016-03-24 14:00:34',1),(31,'Brazil','America/Noronha',3,'2016-03-24 14:00:34',1),(32,'Bahamas','America/Nassau',3,'2016-03-24 14:00:34',1),(33,'Bhutan','Asia/Thimphu',3,'2016-03-24 14:00:34',1),(34,'Botswana','Africa/Gaborone',3,'2016-03-24 14:00:34',1),(35,'Belarus','Europe/Minsk',3,'2016-03-24 14:00:34',1),(36,'Belize','America/Belize',3,'2016-03-24 14:00:34',1),(37,'Canada','America/St_Johns',3,'2016-03-24 14:00:34',1),(38,'Cocos Islands','Indian/Cocos',3,'2016-03-24 14:00:34',1),(39,'Democratic Republic of the Congo','Africa/Kinshasa',3,'2016-03-24 14:00:34',1),(40,'Central African Republic','Africa/Bangui',3,'2016-03-24 14:00:34',1),(41,'Republic of the Congo','Africa/Brazzaville',3,'2016-03-24 14:00:34',1),(42,'Switzerland','Europe/Zurich',3,'2016-03-24 14:00:34',1),(43,'Ivory Coast','Africa/Abidjan',3,'2016-03-24 14:00:34',1),(44,'Cook Islands','Pacific/Rarotonga',3,'2016-03-24 14:00:34',1),(45,'Chile','America/Santiago',3,'2016-03-24 14:00:34',1),(46,'Cameroon','Africa/Douala',3,'2016-03-24 14:00:34',1),(47,'China','Asia/Shanghai',3,'2016-03-24 14:00:34',1),(48,'Colombia','America/Bogota',3,'2016-03-24 14:00:34',1),(49,'Costa Rica','America/Costa_Rica',3,'2016-03-24 14:00:34',1),(50,'Cuba','America/Havana',3,'2016-03-24 14:00:34',1),(51,'Cape Verde','Atlantic/Cape_Verde',3,'2016-03-24 14:00:34',1),(52,'Curaçao','America/Curacao',3,'2016-03-24 14:00:34',1),(53,'Christmas Island','Indian/Christmas',3,'2016-03-24 14:00:34',1),(54,'Cyprus','Asia/Nicosia',3,'2016-03-24 14:00:34',1),(55,'Czech Republic','Europe/Prague',3,'2016-03-24 14:00:34',1),(56,'Germany','Europe/Berlin',3,'2016-03-24 14:00:34',1),(57,'Djibouti','Africa/Djibouti',3,'2016-03-24 14:00:34',1),(58,'Denmark','Europe/Copenhagen',3,'2016-03-24 14:00:34',1),(59,'Dominica','America/Dominica',3,'2016-03-24 14:00:34',1),(60,'Dominican Republic','America/Santo_Domingo',3,'2016-03-24 14:00:34',1),(61,'Algeria','Africa/Algiers',3,'2016-03-24 14:00:34',1),(62,'Ecuador','America/Guayaquil',3,'2016-03-24 14:00:34',1),(63,'Estonia','Europe/Tallinn',3,'2016-03-24 14:00:34',1),(64,'Egypt','Africa/Cairo',3,'2016-03-24 14:00:34',1),(65,'Western Sahara','Africa/El_Aaiun',3,'2016-03-24 14:00:34',1),(66,'Eritrea','Africa/Asmara',3,'2016-03-24 14:00:34',1),(67,'Spain','Europe/Madrid',3,'2016-03-24 14:00:34',1),(68,'Ethiopia','Africa/Addis_Ababa',3,'2016-03-24 14:00:34',1),(69,'Finland','Europe/Helsinki',3,'2016-03-24 14:00:34',1),(70,'Fiji','Pacific/Fiji',3,'2016-03-24 14:00:34',1),(71,'Falkland Islands','Atlantic/Stanley',3,'2016-03-24 14:00:34',1),(72,'Micronesia','Pacific/Chuuk',3,'2016-03-24 14:00:34',1),(73,'Faroe Islands','Atlantic/Faroe',3,'2016-03-24 14:00:34',1),(74,'France','Europe/Paris',3,'2016-03-24 14:00:34',1),(75,'Gabon','Africa/Libreville',3,'2016-03-24 14:00:34',1),(76,'United Kingdom','Europe/London',3,'2016-03-24 14:00:34',1),(77,'Grenada','America/Grenada',3,'2016-03-24 14:00:34',1),(78,'Georgia','Asia/Tbilisi',3,'2016-03-24 14:00:34',1),(79,'French Guiana','America/Cayenne',3,'2016-03-24 14:00:34',1),(80,'Guernsey','Europe/Guernsey',3,'2016-03-24 14:00:34',1),(81,'Ghana','Africa/Accra',3,'2016-03-24 14:00:34',1),(82,'Gibraltar','Europe/Gibraltar',3,'2016-03-24 14:00:34',1),(83,'Greenland','America/Godthab',3,'2016-03-24 14:00:34',1),(84,'Gambia','Africa/Banjul',3,'2016-03-24 14:00:34',1),(85,'Guinea','Africa/Conakry',3,'2016-03-24 14:00:34',1),(86,'Guadeloupe','America/Guadeloupe',3,'2016-03-24 14:00:34',1),(87,'Equatorial Guinea','Africa/Malabo',3,'2016-03-24 14:00:34',1),(88,'Greece','Europe/Athens',3,'2016-03-24 14:00:34',1),(89,'South Georgia and the South Sandwich Islands','Atlantic/South_Georgia',3,'2016-03-24 14:00:34',1),(90,'Guatemala','America/Guatemala',3,'2016-03-24 14:00:34',1),(91,'Guam','Pacific/Guam',3,'2016-03-24 14:00:34',1),(92,'Guinea-Bissau','Africa/Bissau',3,'2016-03-24 14:00:34',1),(93,'Guyana','America/Guyana',3,'2016-03-24 14:00:34',1),(94,'Hong Kong','Asia/Hong_Kong',3,'2016-03-24 14:00:34',1),(95,'Honduras','America/Tegucigalpa',3,'2016-03-24 14:00:34',1),(96,'Croatia','Europe/Zagreb',3,'2016-03-24 14:00:34',1),(97,'Haiti','America/Port-au-Prince',3,'2016-03-24 14:00:34',1),(98,'Hungary','Europe/Budapest',3,'2016-03-24 14:00:34',1),(99,'Indonesia','Asia/Jakarta',3,'2016-03-24 14:00:34',1),(100,'Ireland','Europe/Dublin',3,'2016-03-24 14:00:34',1),(101,'Israel','Asia/Jerusalem',3,'2016-03-24 14:00:34',1),(102,'Isle of Man','Europe/Isle_of_Man',3,'2016-03-24 14:00:34',1),(103,'India','Asia/Kolkata',3,'2016-03-24 14:00:34',1),(104,'British Indian Ocean Territory','Indian/Chagos',3,'2016-03-24 14:00:34',1),(105,'Iraq','Asia/Baghdad',3,'2016-03-24 14:00:34',1),(106,'Iran','Asia/Tehran',3,'2016-03-24 14:00:34',1),(107,'Iceland','Atlantic/Reykjavik',3,'2016-03-24 14:00:34',1),(108,'Italy','Europe/Rome',3,'2016-03-24 14:00:34',1),(109,'Jersey','Europe/Jersey',3,'2016-03-24 14:00:34',1),(110,'Jamaica','America/Jamaica',3,'2016-03-24 14:00:34',1),(111,'Jordan','Asia/Amman',3,'2016-03-24 14:00:34',1),(112,'Japan','Asia/Tokyo',3,'2016-03-24 14:00:34',1),(113,'Kenya','Africa/Nairobi',3,'2016-03-24 14:00:34',1),(114,'Kyrgyzstan','Asia/Bishkek',3,'2016-03-24 14:00:34',1),(115,'Cambodia','Asia/Phnom_Penh',3,'2016-03-24 14:00:34',1),(116,'Kiribati','Pacific/Tarawa',3,'2016-03-24 14:00:34',1),(117,'Comoros','Indian/Comoro',3,'2016-03-24 14:00:34',1),(118,'Saint Kitts and Nevis','America/St_Kitts',3,'2016-03-24 14:00:34',1),(119,'North Korea','Asia/Pyongyang',3,'2016-03-24 14:00:34',1),(120,'South Korea','Asia/Seoul',3,'2016-03-24 14:00:34',1),(121,'Kuwait','Asia/Kuwait',3,'2016-03-24 14:00:34',1),(122,'Cayman Islands','America/Cayman',3,'2016-03-24 14:00:34',1),(123,'Kazakhstan','Asia/Almaty',3,'2016-03-24 14:00:34',1),(124,'Laos','Asia/Vientiane',3,'2016-03-24 14:00:34',1),(125,'Lebanon','Asia/Beirut',3,'2016-03-24 14:00:34',1),(126,'Saint Lucia','America/St_Lucia',3,'2016-03-24 14:00:34',1),(127,'Liechtenstein','Europe/Vaduz',3,'2016-03-24 14:00:34',1),(128,'Sri Lanka','Asia/Colombo',3,'2016-03-24 14:00:34',1),(129,'Liberia','Africa/Monrovia',3,'2016-03-24 14:00:34',1),(130,'Lesotho','Africa/Maseru',3,'2016-03-24 14:00:34',1),(131,'Lithuania','Europe/Vilnius',3,'2016-03-24 14:00:34',1),(132,'Luxembourg','Europe/Luxembourg',3,'2016-03-24 14:00:34',1),(133,'Latvia','Europe/Riga',3,'2016-03-24 14:00:34',1),(134,'Libya','Africa/Tripoli',3,'2016-03-24 14:00:34',1),(135,'Morocco','Africa/Casablanca',3,'2016-03-24 14:00:34',1),(136,'Monaco','Europe/Monaco',3,'2016-03-24 14:00:34',1),(137,'Moldova','Europe/Chisinau',3,'2016-03-24 14:00:34',1),(138,'Montenegro','Europe/Podgorica',3,'2016-03-24 14:00:34',1),(139,'Saint Martin','America/Marigot',3,'2016-03-24 14:00:34',1),(140,'Madagascar','Indian/Antananarivo',3,'2016-03-24 14:00:34',1),(141,'Marshall Islands','Pacific/Majuro',3,'2016-03-24 14:00:34',1),(142,'Macedonia','Europe/Skopje',3,'2016-03-24 14:00:34',1),(143,'Mali','Africa/Bamako',3,'2016-03-24 14:00:34',1),(144,'Myanmar','Asia/Rangoon',3,'2016-03-24 14:00:34',1),(145,'Mongolia','Asia/Ulaanbaatar',3,'2016-03-24 14:00:34',1),(146,'Macao','Asia/Macau',3,'2016-03-24 14:00:34',1),(147,'Northern Mariana Islands','Pacific/Saipan',3,'2016-03-24 14:00:34',1),(148,'Martinique','America/Martinique',3,'2016-03-24 14:00:34',1),(149,'Mauritania','Africa/Nouakchott',3,'2016-03-24 14:00:34',1),(150,'Montserrat','America/Montserrat',3,'2016-03-24 14:00:34',1),(151,'Malta','Europe/Malta',3,'2016-03-24 14:00:34',1),(152,'Mauritius','Indian/Mauritius',3,'2016-03-24 14:00:34',1),(153,'Maldives','Indian/Maldives',3,'2016-03-24 14:00:34',1),(154,'Malawi','Africa/Blantyre',3,'2016-03-24 14:00:34',1),(155,'Mexico','America/Mexico_City',3,'2016-03-24 14:00:34',1),(156,'Malaysia','Asia/Kuala_Lumpur',3,'2016-03-24 14:00:34',1),(157,'Mozambique','Africa/Maputo',3,'2016-03-24 14:00:34',1),(158,'Namibia','Africa/Windhoek',3,'2016-03-24 14:00:34',1),(159,'New Caledonia','Pacific/Noumea',3,'2016-03-24 14:00:34',1),(160,'Niger','Africa/Niamey',3,'2016-03-24 14:00:34',1),(161,'Norfolk Island','Pacific/Norfolk',3,'2016-03-24 14:00:34',1),(162,'Nigeria','Africa/Lagos',3,'2016-03-24 14:00:34',1),(163,'Nicaragua','America/Managua',3,'2016-03-24 14:00:34',1),(164,'Netherlands','Europe/Amsterdam',3,'2016-03-24 14:00:34',1),(165,'Norway','Europe/Oslo',3,'2016-03-24 14:00:34',1),(166,'Nepal','Asia/Kathmandu',3,'2016-03-24 14:00:34',1),(167,'Nauru','Pacific/Nauru',3,'2016-03-24 14:00:34',1),(168,'Niue','Pacific/Niue',3,'2016-03-24 14:00:34',1),(169,'New Zealand','Pacific/Auckland',3,'2016-03-24 14:00:34',1),(170,'Oman','Asia/Muscat',3,'2016-03-24 14:00:34',1),(171,'Panama','America/Panama',3,'2016-03-24 14:00:34',1),(172,'Peru','America/Lima',3,'2016-03-24 14:00:34',1),(173,'French Polynesia','Pacific/Tahiti',3,'2016-03-24 14:00:34',1),(174,'Papua New Guinea','Pacific/Port_Moresby',3,'2016-03-24 14:00:34',1),(175,'Philippines','Asia/Manila',3,'2016-03-24 14:00:34',1),(176,'Pakistan','Asia/Karachi',3,'2016-03-24 14:00:34',1),(177,'Poland','Europe/Warsaw',3,'2016-03-24 14:00:34',1),(178,'Saint Pierre and Miquelon','America/Miquelon',3,'2016-03-24 14:00:34',1),(179,'Pitcairn','Pacific/Pitcairn',3,'2016-03-24 14:00:34',1),(180,'Puerto Rico','America/Puerto_Rico',3,'2016-03-24 14:00:34',1),(181,'Palestinian Territory','Asia/Gaza',3,'2016-03-24 14:00:34',1),(182,'Portugal','Europe/Lisbon',3,'2016-03-24 14:00:34',1),(183,'Palau','Pacific/Palau',3,'2016-03-24 14:00:34',1),(184,'Paraguay','America/Asuncion',3,'2016-03-24 14:00:34',1),(185,'Qatar','Asia/Qatar',3,'2016-03-24 14:00:34',1),(186,'Reunion','Indian/Reunion',3,'2016-03-24 14:00:34',1),(187,'Romania','Europe/Bucharest',3,'2016-03-24 14:00:34',1),(188,'Serbia','Europe/Belgrade',3,'2016-03-24 14:00:34',1),(189,'Russia','Europe/Kaliningrad',3,'2016-03-24 14:00:34',1),(190,'Rwanda','Africa/Kigali',3,'2016-03-24 14:00:34',1),(191,'Saudi Arabia','Asia/Riyadh',3,'2016-03-24 14:00:34',1),(192,'Solomon Islands','Pacific/Guadalcanal',3,'2016-03-24 14:00:34',1),(193,'Seychelles','Indian/Mahe',3,'2016-03-24 14:00:34',1),(194,'Sudan','Africa/Khartoum',3,'2016-03-24 14:00:34',1),(195,'Sweden','Europe/Stockholm',3,'2016-03-24 14:00:34',1),(196,'Singapore','Asia/Singapore',3,'2016-03-24 14:00:34',1),(197,'Saint Helena','Atlantic/St_Helena',3,'2016-03-24 14:00:34',1),(198,'Slovenia','Europe/Ljubljana',3,'2016-03-24 14:00:34',1),(199,'Svalbard and Jan Mayen','Arctic/Longyearbyen',3,'2016-03-24 14:00:34',1),(200,'Slovakia','Europe/Bratislava',3,'2016-03-24 14:00:34',1),(201,'Sierra Leone','Africa/Freetown',3,'2016-03-24 14:00:34',1),(202,'San Marino','Europe/San_Marino',3,'2016-03-24 14:00:34',1),(203,'Senegal','Africa/Dakar',3,'2016-03-24 14:00:34',1),(204,'Somalia','Africa/Mogadishu',3,'2016-03-24 14:00:34',1),(205,'Suriname','America/Paramaribo',3,'2016-03-24 14:00:34',1),(206,'South Sudan','Africa/Juba',3,'2016-03-24 14:00:34',1),(207,'Sao Tome and Principe','Africa/Sao_Tome',3,'2016-03-24 14:00:34',1),(208,'El Salvador','America/El_Salvador',3,'2016-03-24 14:00:34',1),(209,'Sint Maarten','America/Lower_Princes',3,'2016-03-24 14:00:34',1),(210,'Syria','Asia/Damascus',3,'2016-03-24 14:00:34',1),(211,'Swaziland','Africa/Mbabane',3,'2016-03-24 14:00:34',1),(212,'Turks and Caicos Islands','America/Grand_Turk',3,'2016-03-24 14:00:34',1),(213,'Chad','Africa/Ndjamena',3,'2016-03-24 14:00:34',1),(214,'French Southern Territories','Indian/Kerguelen',3,'2016-03-24 14:00:34',1),(215,'Togo','Africa/Lome',3,'2016-03-24 14:00:34',1),(216,'Thailand','Asia/Bangkok',3,'2016-03-24 14:00:34',1),(217,'Tajikistan','Asia/Dushanbe',3,'2016-03-24 14:00:34',1),(218,'Tokelau','Pacific/Fakaofo',3,'2016-03-24 14:00:34',1),(219,'East Timor','Asia/Dili',3,'2016-03-24 14:00:34',1),(220,'Turkmenistan','Asia/Ashgabat',3,'2016-03-24 14:00:34',1),(221,'Tunisia','Africa/Tunis',3,'2016-03-24 14:00:34',1),(222,'Tonga','Pacific/Tongatapu',3,'2016-03-24 14:00:34',1),(223,'Turkey','Europe/Istanbul',3,'2016-03-24 14:00:34',1),(224,'Trinidad and Tobago','America/Port_of_Spain',3,'2016-03-24 14:00:34',1),(225,'Tuvalu','Pacific/Funafuti',3,'2016-03-24 14:00:34',1),(226,'Taiwan','Asia/Taipei',3,'2016-03-24 14:00:34',1),(227,'Tanzania','Africa/Dar_es_Salaam',3,'2016-03-24 14:00:34',1),(228,'Ukraine','Europe/Kiev',3,'2016-03-24 14:00:34',1),(229,'Uganda','Africa/Kampala',3,'2016-03-24 14:00:34',1),(230,'United States Minor Outlying Islands','Pacific/Johnston',3,'2016-03-24 14:00:34',1),(231,'United States','America/New_York',3,'2016-03-24 14:00:34',1),(232,'Uruguay','America/Montevideo',3,'2016-03-24 14:00:34',1),(233,'Uzbekistan','Asia/Samarkand',3,'2016-03-24 14:00:34',1),(234,'Vatican','Europe/Vatican',3,'2016-03-24 14:00:34',1),(235,'Saint Vincent and the Grenadines','America/St_Vincent',3,'2016-03-24 14:00:34',1),(236,'Venezuela','America/Caracas',3,'2016-03-24 14:00:34',1),(237,'British Virgin Islands','America/Tortola',3,'2016-03-24 14:00:34',1),(238,'U.S. Virgin Islands','America/St_Thomas',3,'2016-03-24 14:00:34',1),(239,'Vietnam','Asia/Ho_Chi_Minh',3,'2016-03-24 14:00:34',1),(240,'Vanuatu','Pacific/Efate',3,'2016-03-24 14:00:34',1),(241,'Wallis and Futuna','Pacific/Wallis',3,'2016-03-24 14:00:34',1),(242,'Samoa','Pacific/Apia',3,'2016-03-24 14:00:34',1),(243,'Yemen','Asia/Aden',3,'2016-03-24 14:00:34',1),(244,'Mayotte','Indian/Mayotte',3,'2016-03-24 14:00:34',1),(245,'South Africa','Africa/Johannesburg',3,'2016-03-24 14:00:34',1),(246,'Zambia','Africa/Lusaka',3,'2016-03-24 14:00:34',1),(247,'Zimbabwe','Africa/Harare',3,'2016-03-24 14:00:34',1);

/*Table structure for table `t_user_acl_trans` */

DROP TABLE IF EXISTS `t_user_acl_trans`;

CREATE TABLE `t_user_acl_trans` (
  `division_id_fk` int(11) DEFAULT NULL,
  `project_id_fk` int(11) DEFAULT NULL,
  `user_id_pk` int(11) NOT NULL,
  `module_id_pk` int(11) NOT NULL,
  `acl_id_pk` int(11) NOT NULL,
  KEY `fk_t_user_acl_trans_t_division_mas1_idx` (`division_id_fk`),
  KEY `fk_t_user_acl_trans_t_project_mas1_idx` (`project_id_fk`),
  KEY `fk_t_user_acl_trans_t_user_mas1_idx` (`user_id_pk`),
  KEY `fk_t_user_acl_trans_t_module_mas1_idx` (`module_id_pk`),
  KEY `fk_t_user_acl_trans_t_acl_list_mas1_idx` (`acl_id_pk`),
  CONSTRAINT `fk_t_user_acl_trans_t_acl_list_mas1` FOREIGN KEY (`acl_id_pk`) REFERENCES `t_acl_list_mas` (`acl_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_acl_trans_t_division_mas1` FOREIGN KEY (`division_id_fk`) REFERENCES `t_division_mas` (`division_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_acl_trans_t_module_mas1` FOREIGN KEY (`module_id_pk`) REFERENCES `t_module_mas` (`module_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_acl_trans_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_acl_trans_t_user_mas1` FOREIGN KEY (`user_id_pk`) REFERENCES `t_user_mas` (`user_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_user_acl_trans` */

insert  into `t_user_acl_trans`(`division_id_fk`,`project_id_fk`,`user_id_pk`,`module_id_pk`,`acl_id_pk`) values (NULL,NULL,1,4,4),(NULL,NULL,1,5,4),(NULL,NULL,1,6,4),(NULL,NULL,1,25,4),(NULL,NULL,1,26,4),(NULL,NULL,1,27,4),(NULL,NULL,1,29,4),(1,1,1,1,4),(1,1,1,2,4),(1,1,1,3,4),(1,1,1,18,4),(1,1,1,20,4),(1,1,1,30,4),(1,1,1,19,4),(1,1,1,28,4),(1,1,1,7,4),(1,1,1,8,4),(1,1,1,21,4),(1,1,1,9,4),(1,1,1,10,4),(1,1,1,11,4),(1,1,1,12,4),(1,1,1,13,4),(1,1,1,14,4),(1,1,1,15,4),(1,1,1,16,4),(1,1,1,17,4),(1,1,1,23,4),(1,1,1,24,4),(1,1,1,31,4),(1,1,1,32,4),(NULL,NULL,2,4,1),(NULL,NULL,2,5,1),(NULL,NULL,2,6,1),(NULL,NULL,2,25,1),(NULL,NULL,2,26,1),(NULL,NULL,2,29,2),(1,1,2,1,2),(1,1,2,2,2),(1,1,2,3,4),(1,1,2,18,2),(1,1,2,20,1),(1,1,2,30,2),(1,1,2,19,1),(1,1,2,28,4),(1,1,2,7,1),(1,1,2,8,1),(1,1,2,21,1),(1,1,2,9,1),(1,1,2,10,1),(1,1,2,11,1),(1,1,2,12,1),(1,1,2,13,1),(1,1,2,14,1),(1,1,2,15,1),(1,1,2,16,1),(1,1,2,17,1),(1,1,2,23,1),(1,1,2,24,1),(1,1,2,31,2),(1,1,2,32,2),(1,2,1,1,4),(1,2,1,2,4),(1,2,1,3,4),(1,2,1,18,4),(1,2,1,20,4),(1,2,1,30,4),(1,2,1,19,4),(1,2,1,28,4),(1,2,1,7,4),(1,2,1,8,4),(1,2,1,21,4),(1,2,1,9,4),(1,2,1,10,4),(1,2,1,11,4),(1,2,1,12,4),(1,2,1,13,4),(1,2,1,14,4),(1,2,1,15,4),(1,2,1,16,4),(1,2,1,17,4),(1,2,1,23,4),(1,2,1,24,4),(1,2,1,31,4),(1,2,1,32,4),(NULL,NULL,3,4,1),(NULL,NULL,3,5,1),(NULL,NULL,3,6,1),(NULL,NULL,3,25,1),(NULL,NULL,3,26,1),(NULL,NULL,3,29,2),(NULL,NULL,4,4,1),(NULL,NULL,4,5,1),(NULL,NULL,4,6,1),(NULL,NULL,4,25,1),(NULL,NULL,4,26,1),(NULL,NULL,4,29,2),(NULL,NULL,5,4,4),(NULL,NULL,5,5,4),(NULL,NULL,5,6,4),(NULL,NULL,5,25,4),(NULL,NULL,5,26,4),(NULL,NULL,5,29,4),(2,3,5,1,4),(2,3,5,2,4),(2,3,5,3,4),(2,3,5,18,4),(2,3,5,20,4),(2,3,5,30,4),(2,3,5,19,4),(2,3,5,28,4),(2,3,5,7,4),(2,3,5,8,4),(2,3,5,21,4),(2,3,5,9,4),(2,3,5,10,4),(2,3,5,11,4),(2,3,5,12,4),(2,3,5,13,4),(2,3,5,14,4),(2,3,5,15,4),(2,3,5,16,4),(2,3,5,17,4),(2,3,5,23,4),(2,3,5,24,4),(2,3,5,31,4),(2,3,5,32,4),(NULL,NULL,6,4,1),(NULL,NULL,6,5,1),(NULL,NULL,6,6,1),(NULL,NULL,6,25,1),(NULL,NULL,6,26,1),(NULL,NULL,6,29,2),(NULL,NULL,7,4,1),(NULL,NULL,7,5,1),(NULL,NULL,7,6,1),(NULL,NULL,7,25,1),(NULL,NULL,7,26,1),(NULL,NULL,7,29,2),(2,3,7,1,2),(2,3,7,2,2),(2,3,7,3,2),(2,3,7,18,1),(2,3,7,20,1),(2,3,7,30,2),(2,3,7,19,1),(2,3,7,28,4),(2,3,7,7,1),(2,3,7,8,1),(2,3,7,21,1),(2,3,7,9,1),(2,3,7,10,1),(2,3,7,11,1),(2,3,7,12,1),(2,3,7,13,1),(2,3,7,14,1),(2,3,7,15,1),(2,3,7,16,1),(2,3,7,17,1),(2,3,7,23,1),(2,3,7,24,1),(2,3,7,31,2),(2,3,7,32,2),(2,3,6,1,2),(2,3,6,2,2),(2,3,6,3,2),(2,3,6,18,1),(2,3,6,20,1),(2,3,6,30,2),(2,3,6,19,1),(2,3,6,28,4),(2,3,6,7,1),(2,3,6,8,1),(2,3,6,21,1),(2,3,6,9,1),(2,3,6,10,1),(2,3,6,11,1),(2,3,6,12,1),(2,3,6,13,1),(2,3,6,14,1),(2,3,6,15,1),(2,3,6,16,1),(2,3,6,17,1),(2,3,6,23,1),(2,3,6,24,1),(2,3,6,31,2),(2,3,6,32,2),(2,4,5,1,4),(2,4,5,2,4),(2,4,5,3,4),(2,4,5,18,4),(2,4,5,20,4),(2,4,5,30,4),(2,4,5,19,4),(2,4,5,28,4),(2,4,5,7,4),(2,4,5,8,4),(2,4,5,21,4),(2,4,5,9,4),(2,4,5,10,4),(2,4,5,11,4),(2,4,5,12,4),(2,4,5,13,4),(2,4,5,14,4),(2,4,5,15,4),(2,4,5,16,4),(2,4,5,17,4),(2,4,5,23,4),(2,4,5,24,4),(2,4,5,31,4),(2,4,5,32,4),(NULL,NULL,8,4,4),(NULL,NULL,8,5,4),(NULL,NULL,8,6,4),(NULL,NULL,8,25,4),(NULL,NULL,8,26,4),(NULL,NULL,8,27,4),(NULL,NULL,8,29,4),(2,4,8,1,4),(2,4,8,2,4),(2,4,8,3,4),(2,4,8,18,4),(2,4,8,20,4),(2,4,8,30,4),(2,4,8,19,4),(2,4,8,28,4),(2,4,8,7,4),(2,4,8,8,4),(2,4,8,21,4),(2,4,8,9,4),(2,4,8,10,4),(2,4,8,11,4),(2,4,8,12,4),(2,4,8,13,4),(2,4,8,14,4),(2,4,8,15,4),(2,4,8,16,4),(2,4,8,17,4),(2,4,8,23,4),(2,4,8,24,4),(2,4,8,31,4),(2,4,8,32,4),(NULL,NULL,9,4,4),(NULL,NULL,9,5,4),(NULL,NULL,9,6,4),(NULL,NULL,9,25,4),(NULL,NULL,9,26,4),(NULL,NULL,9,29,4),(NULL,NULL,10,4,1),(NULL,NULL,10,5,1),(NULL,NULL,10,6,1),(NULL,NULL,10,25,1),(NULL,NULL,10,26,1),(NULL,NULL,10,29,2),(NULL,NULL,11,4,2),(NULL,NULL,11,5,1),(NULL,NULL,11,6,1),(NULL,NULL,11,25,1),(NULL,NULL,11,26,1),(NULL,NULL,11,29,2),(NULL,NULL,12,4,1),(NULL,NULL,12,5,1),(NULL,NULL,12,6,1),(NULL,NULL,12,25,1),(NULL,NULL,12,26,1),(NULL,NULL,12,29,2),(NULL,NULL,13,4,1),(NULL,NULL,13,5,1),(NULL,NULL,13,6,1),(NULL,NULL,13,25,1),(NULL,NULL,13,26,1),(NULL,NULL,13,29,2),(2,5,1,1,4),(2,5,1,2,4),(2,5,1,3,4),(2,5,1,18,4),(2,5,1,20,4),(2,5,1,30,4),(2,5,1,19,4),(2,5,1,28,4),(2,5,1,7,4),(2,5,1,8,4),(2,5,1,21,4),(2,5,1,9,4),(2,5,1,10,4),(2,5,1,11,4),(2,5,1,12,4),(2,5,1,13,4),(2,5,1,14,4),(2,5,1,15,4),(2,5,1,16,4),(2,5,1,17,4),(2,5,1,23,4),(2,5,1,24,4),(2,5,1,31,4),(2,5,1,32,4),(1,6,5,1,4),(1,6,5,2,4),(1,6,5,3,4),(1,6,5,18,4),(1,6,5,20,4),(1,6,5,30,4),(1,6,5,19,4),(1,6,5,28,4),(1,6,5,7,4),(1,6,5,8,4),(1,6,5,21,4),(1,6,5,9,4),(1,6,5,10,4),(1,6,5,11,4),(1,6,5,12,4),(1,6,5,13,4),(1,6,5,14,4),(1,6,5,15,4),(1,6,5,16,4),(1,6,5,17,4),(1,6,5,23,4),(1,6,5,24,4),(1,6,5,31,4),(1,6,5,32,4),(2,4,12,1,2),(2,4,12,2,2),(2,4,12,3,2),(2,4,12,18,2),(2,4,12,20,2),(2,4,12,30,2),(2,4,12,19,1),(2,4,12,28,4),(2,4,12,7,2),(2,4,12,8,2),(2,4,12,21,2),(2,4,12,9,1),(2,4,12,10,1),(2,4,12,11,1),(2,4,12,12,2),(2,4,12,13,2),(2,4,12,14,2),(2,4,12,15,2),(2,4,12,16,2),(2,4,12,17,2),(2,4,12,23,1),(2,4,12,24,1),(2,4,12,31,2),(2,4,12,32,2),(1,7,1,1,4),(1,7,1,2,4),(1,7,1,3,4),(1,7,1,18,4),(1,7,1,20,4),(1,7,1,30,4),(1,7,1,19,4),(1,7,1,28,4),(1,7,1,7,4),(1,7,1,8,4),(1,7,1,21,4),(1,7,1,9,4),(1,7,1,10,4),(1,7,1,11,4),(1,7,1,12,4),(1,7,1,13,4),(1,7,1,14,4),(1,7,1,15,4),(1,7,1,16,4),(1,7,1,17,4),(1,7,1,23,4),(1,7,1,24,4),(1,7,1,31,4),(1,7,1,32,4),(2,8,5,1,4),(2,8,5,2,4),(2,8,5,3,4),(2,8,5,18,4),(2,8,5,20,4),(2,8,5,30,4),(2,8,5,19,4),(2,8,5,28,4),(2,8,5,7,4),(2,8,5,8,4),(2,8,5,21,4),(2,8,5,9,4),(2,8,5,10,4),(2,8,5,11,4),(2,8,5,12,4),(2,8,5,13,4),(2,8,5,14,4),(2,8,5,15,4),(2,8,5,16,4),(2,8,5,17,4),(2,8,5,23,4),(2,8,5,24,4),(2,8,5,31,4),(2,8,5,32,4),(2,8,13,1,2),(2,8,13,2,2),(2,8,13,3,2),(2,8,13,18,2),(2,8,13,20,2),(2,8,13,30,2),(2,8,13,19,1),(2,8,13,28,4),(2,8,13,7,2),(2,8,13,8,2),(2,8,13,21,2),(2,8,13,9,1),(2,8,13,10,1),(2,8,13,11,1),(2,8,13,12,2),(2,8,13,13,2),(2,8,13,14,2),(2,8,13,15,2),(2,8,13,16,2),(2,8,13,17,2),(2,8,13,23,1),(2,8,13,24,1),(2,8,13,31,2),(2,8,13,32,2),(2,8,12,1,2),(2,8,12,2,2),(2,8,12,3,2),(2,8,12,18,2),(2,8,12,20,2),(2,8,12,30,2),(2,8,12,19,1),(2,8,12,28,4),(2,8,12,7,2),(2,8,12,8,2),(2,8,12,21,2),(2,8,12,9,1),(2,8,12,10,1),(2,8,12,11,1),(2,8,12,12,2),(2,8,12,13,2),(2,8,12,14,2),(2,8,12,15,2),(2,8,12,16,2),(2,8,12,17,2),(2,8,12,23,1),(2,8,12,24,1),(2,8,12,31,2),(2,8,12,32,2),(2,8,11,1,2),(2,8,11,2,2),(2,8,11,3,2),(2,8,11,18,2),(2,8,11,20,2),(2,8,11,30,2),(2,8,11,19,1),(2,8,11,28,4),(2,8,11,7,2),(2,8,11,8,2),(2,8,11,21,2),(2,8,11,9,1),(2,8,11,10,1),(2,8,11,11,1),(2,8,11,12,2),(2,8,11,13,2),(2,8,11,14,2),(2,8,11,15,2),(2,8,11,16,2),(2,8,11,17,2),(2,8,11,23,1),(2,8,11,24,1),(2,8,11,31,2),(2,8,11,32,2),(2,8,10,1,2),(2,8,10,2,2),(2,8,10,3,2),(2,8,10,18,2),(2,8,10,20,2),(2,8,10,30,2),(2,8,10,19,1),(2,8,10,28,4),(2,8,10,7,2),(2,8,10,8,2),(2,8,10,21,2),(2,8,10,9,1),(2,8,10,10,1),(2,8,10,11,1),(2,8,10,12,2),(2,8,10,13,2),(2,8,10,14,2),(2,8,10,15,2),(2,8,10,16,2),(2,8,10,17,2),(2,8,10,23,1),(2,8,10,24,1),(2,8,10,31,2),(2,8,10,32,2),(2,8,9,1,4),(2,8,9,2,4),(2,8,9,3,4),(2,8,9,18,4),(2,8,9,20,4),(2,8,9,30,4),(2,8,9,19,4),(2,8,9,28,4),(2,8,9,7,4),(2,8,9,8,4),(2,8,9,21,4),(2,8,9,9,4),(2,8,9,10,4),(2,8,9,11,4),(2,8,9,12,4),(2,8,9,13,4),(2,8,9,14,4),(2,8,9,15,4),(2,8,9,16,4),(2,8,9,17,4),(2,8,9,23,4),(2,8,9,24,4),(2,8,9,31,4),(2,8,9,32,4),(2,8,8,1,4),(2,8,8,2,4),(2,8,8,3,4),(2,8,8,18,4),(2,8,8,20,4),(2,8,8,30,4),(2,8,8,19,4),(2,8,8,28,4),(2,8,8,7,4),(2,8,8,8,4),(2,8,8,21,4),(2,8,8,9,4),(2,8,8,10,4),(2,8,8,11,4),(2,8,8,12,4),(2,8,8,13,4),(2,8,8,14,4),(2,8,8,15,4),(2,8,8,16,4),(2,8,8,17,4),(2,8,8,23,4),(2,8,8,24,4),(2,8,8,31,4),(2,8,8,32,4),(1,9,1,1,4),(1,9,1,2,4),(1,9,1,3,4),(1,9,1,18,4),(1,9,1,20,4),(1,9,1,30,4),(1,9,1,19,4),(1,9,1,28,4),(1,9,1,7,4),(1,9,1,8,4),(1,9,1,21,4),(1,9,1,9,4),(1,9,1,10,4),(1,9,1,11,4),(1,9,1,12,4),(1,9,1,13,4),(1,9,1,14,4),(1,9,1,15,4),(1,9,1,16,4),(1,9,1,17,4),(1,9,1,23,4),(1,9,1,24,4),(1,9,1,31,4),(1,9,1,32,4),(1,10,1,1,4),(1,10,1,2,4),(1,10,1,3,4),(1,10,1,18,4),(1,10,1,20,4),(1,10,1,30,4),(1,10,1,19,4),(1,10,1,28,4),(1,10,1,7,4),(1,10,1,8,4),(1,10,1,21,4),(1,10,1,9,4),(1,10,1,10,4),(1,10,1,11,4),(1,10,1,12,4),(1,10,1,13,4),(1,10,1,14,4),(1,10,1,15,4),(1,10,1,16,4),(1,10,1,17,4),(1,10,1,23,4),(1,10,1,24,4),(1,10,1,31,4),(1,10,1,32,4);

/*Table structure for table `t_user_dashboard_map` */

DROP TABLE IF EXISTS `t_user_dashboard_map`;

CREATE TABLE `t_user_dashboard_map` (
  `user_id_fk` int(11) NOT NULL,
  `db_id_fk` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id_fk`,`db_id_fk`),
  KEY `fk_t_user_mas_has_t_dashboard_mas_t_dashboard_mas1_idx` (`db_id_fk`),
  KEY `fk_t_user_mas_has_t_dashboard_mas_t_user_mas1_idx` (`user_id_fk`),
  CONSTRAINT `fk_t_user_mas_has_t_dashboard_mas_t_dashboard_mas1` FOREIGN KEY (`db_id_fk`) REFERENCES `t_dashboard_mas` (`db_id_pk`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_mas_has_t_dashboard_mas_t_user_mas1` FOREIGN KEY (`user_id_fk`) REFERENCES `t_user_mas` (`user_id_pk`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_user_dashboard_map` */

insert  into `t_user_dashboard_map`(`user_id_fk`,`db_id_fk`,`status`) values (1,1,1),(1,2,1),(1,3,1),(1,4,1),(1,5,1),(2,1,1),(2,2,1),(2,3,1),(2,4,1),(2,5,1),(3,1,1),(3,2,1),(3,3,1),(3,4,1),(3,5,1),(4,1,1),(4,2,1),(4,3,1),(4,4,1),(4,5,1),(5,1,0),(5,2,0),(5,3,1),(5,4,1),(5,5,0),(6,1,1),(6,2,1),(6,3,1),(6,4,1),(6,5,1),(7,1,1),(7,2,1),(7,3,1),(7,4,1),(7,5,1),(8,1,1),(8,2,1),(8,3,1),(8,4,1),(8,5,1),(9,1,1),(9,2,1),(9,3,1),(9,4,1),(9,5,1),(10,1,1),(10,2,1),(10,3,1),(10,4,1),(10,5,1),(11,1,1),(11,2,1),(11,3,1),(11,4,1),(11,5,1),(12,1,1),(12,2,1),(12,3,1),(12,4,1),(12,5,1),(13,1,1),(13,2,1),(13,3,1),(13,4,1),(13,5,1);

/*Table structure for table `t_user_mas` */

DROP TABLE IF EXISTS `t_user_mas`;

CREATE TABLE `t_user_mas` (
  `user_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `mobile_no` varchar(45) DEFAULT NULL,
  `telephone` varchar(45) DEFAULT NULL,
  `user_type_id_fk` int(11) NOT NULL,
  `user_role_id_fk` int(11) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `profilepicurl` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id_pk`),
  KEY `fk_t_user_mas_t_user_type_mas1_idx` (`user_type_id_fk`),
  KEY `fk_t_user_mas_t_user_role_mas1_idx` (`user_role_id_fk`),
  CONSTRAINT `fk_t_user_mas_t_user_role_mas1` FOREIGN KEY (`user_role_id_fk`) REFERENCES `t_user_role_mas` (`user_role_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_mas_t_user_type_mas1` FOREIGN KEY (`user_type_id_fk`) REFERENCES `t_user_type_mas` (`user_type_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

/*Data for the table `t_user_mas` */

insert  into `t_user_mas`(`user_id_pk`,`first_name`,`last_name`,`email`,`password`,`mobile_no`,`telephone`,`user_type_id_fk`,`user_role_id_fk`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`,`profilepicurl`) values (1,'admin','admin','admin@csscorp.com','password','1234567899',NULL,1,5,NULL,NULL,NULL,NULL,1,'download/userprofile/user.jpg'),(2,'Roger','Waaijer','naga.saggi@gmail.com','password','9999444444',NULL,2,2,1,1,'2016-07-12 01:17:01','2016-07-12 01:17:01',1,NULL),(3,'Michelle','Toda','Michelle@ViewSonic.com','password','9876875765',NULL,2,2,1,1,'2016-07-15 19:15:31','2016-07-15 19:15:31',0,NULL),(4,'Rose','Yang','Rose@viewSonic.com','password','7867576576',NULL,2,2,1,1,'2016-07-15 19:16:07','2016-07-15 19:16:07',0,NULL),(5,'Flex','Clement','flex.clement@csscorp.com','password','9790919117',NULL,1,1,1,1,'2016-07-25 19:15:30','2016-07-25 19:15:30',1,NULL),(6,'Ajit','Mayya','ajit@velocloud.net','password','0',NULL,2,2,1,1,'2016-07-26 19:05:08','2016-07-26 19:05:08',1,NULL),(7,'Arun','Subash Manickam','arunsub@velocloud.net','password','0',NULL,2,2,1,1,'2016-07-26 19:05:54','2016-07-26 19:05:54',1,NULL),(8,'Suman Gokul',NULL,'Suman.Gokul@csscorp.com','password','9940162030',NULL,3,5,1,1,'2016-07-26 22:11:26','2016-07-26 22:11:26',1,NULL),(9,'Rathnasabapathy Namasivayam',NULL,'Rathnasabapathy.N@csscorp.com','password','9840030603',NULL,3,1,1,1,'2016-07-26 22:13:33','2016-07-26 22:13:33',1,NULL),(10,'Sankara Narayanan',NULL,'Sankara.Narayanan@csscorp.com','password','9444258356',NULL,3,6,1,1,'2016-07-26 22:13:56','2016-07-26 22:13:56',1,NULL),(11,'Rahul Barua',NULL,'Rahul.Barua@csscorp.com','password','8754444540',NULL,3,3,1,1,'2016-07-26 22:14:28','2016-07-26 22:14:28',1,NULL),(12,'Anuroop Krishna Pillai',NULL,'Anuroop.K@csscorp.com','password','0',NULL,3,6,1,1,'2016-07-26 22:15:27','2016-07-26 22:15:27',1,NULL),(13,'Dinesh Merrill M J',NULL,'Dinesh.Merrill@csscorp.com','password','9840463883',NULL,3,3,1,1,'2016-07-26 22:37:52','2016-07-26 22:37:52',1,NULL);

/*Table structure for table `t_user_project_map` */

DROP TABLE IF EXISTS `t_user_project_map`;

CREATE TABLE `t_user_project_map` (
  `user_id_fk` int(11) NOT NULL,
  `project_id_fk` int(11) NOT NULL,
  `division_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`user_id_fk`,`project_id_fk`),
  KEY `fk_t_project_mas_has_t_user_mas_t_user_mas1_idx` (`user_id_fk`),
  KEY `fk_t_project_mas_has_t_user_mas_t_project_mas1_idx` (`project_id_fk`),
  KEY `fk_t_user_project_map_t_division_mas1_idx` (`division_id_fk`),
  CONSTRAINT `fk_t_project_mas_has_t_user_mas_t_project_mas1` FOREIGN KEY (`project_id_fk`) REFERENCES `t_project_mas` (`project_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_project_mas_has_t_user_mas_t_user_mas1` FOREIGN KEY (`user_id_fk`) REFERENCES `t_user_mas` (`user_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_project_map_t_division_mas1` FOREIGN KEY (`division_id_fk`) REFERENCES `t_division_mas` (`division_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_user_project_map` */

insert  into `t_user_project_map`(`user_id_fk`,`project_id_fk`,`division_id_fk`) values (1,1,1),(1,2,1),(1,7,1),(1,9,1),(1,10,1),(2,1,1),(5,6,1),(1,5,2),(5,3,2),(5,4,2),(5,8,2),(6,3,2),(7,3,2),(8,4,2),(8,8,2),(9,8,2),(10,8,2),(11,8,2),(12,4,2),(12,8,2),(13,8,2);

/*Table structure for table `t_user_role_mas` */

DROP TABLE IF EXISTS `t_user_role_mas`;

CREATE TABLE `t_user_role_mas` (
  `user_role_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `user_role_name` varchar(45) DEFAULT NULL,
  `user_role_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_role_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `t_user_role_mas` */

insert  into `t_user_role_mas`(`user_role_id_pk`,`user_role_name`,`user_role_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'SR Manager','Admin',NULL,NULL,NULL,NULL,1),(2,'Client',NULL,NULL,NULL,NULL,NULL,1),(3,'Internal Operations',NULL,NULL,NULL,NULL,NULL,1),(4,'Ops Direct',NULL,NULL,NULL,NULL,NULL,1),(5,'Admin',NULL,NULL,NULL,NULL,NULL,1),(6,'IT Manager',NULL,NULL,NULL,NULL,NULL,1),(7,'Finance',NULL,NULL,NULL,NULL,NULL,1),(8,'HR',NULL,NULL,NULL,NULL,NULL,1),(9,'MIS',NULL,NULL,NULL,NULL,NULL,1);

/*Table structure for table `t_user_role_module_map` */

DROP TABLE IF EXISTS `t_user_role_module_map`;

CREATE TABLE `t_user_role_module_map` (
  `user_role_id_fk` int(11) NOT NULL,
  `module_id_fk` int(11) NOT NULL,
  `acl_id_fk` int(11) NOT NULL,
  PRIMARY KEY (`user_role_id_fk`,`module_id_fk`,`acl_id_fk`),
  KEY `fk_t_user_role_mas_has_t_module_mas_t_module_mas1_idx` (`module_id_fk`),
  KEY `fk_t_user_role_mas_has_t_module_mas_t_user_role_mas1_idx` (`user_role_id_fk`),
  KEY `fk_t_user_role_module_map_t_acl_list_mas1_idx` (`acl_id_fk`),
  CONSTRAINT `fk_t_user_role_mas_has_t_module_mas_t_module_mas1` FOREIGN KEY (`module_id_fk`) REFERENCES `t_module_mas` (`module_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_role_mas_has_t_module_mas_t_user_role_mas1` FOREIGN KEY (`user_role_id_fk`) REFERENCES `t_user_role_mas` (`user_role_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_user_role_module_map_t_acl_list_mas1` FOREIGN KEY (`acl_id_fk`) REFERENCES `t_acl_list_mas` (`acl_id_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_user_role_module_map` */

insert  into `t_user_role_module_map`(`user_role_id_fk`,`module_id_fk`,`acl_id_fk`) values (1,1,4),(2,1,2),(3,1,2),(4,1,2),(5,1,4),(6,1,2),(7,1,2),(8,1,2),(9,1,2),(1,2,4),(2,2,2),(3,2,2),(4,2,2),(5,2,4),(6,2,2),(7,2,2),(8,2,2),(9,2,2),(1,3,4),(2,3,2),(3,3,2),(4,3,2),(5,3,4),(6,3,2),(7,3,2),(8,3,2),(9,3,2),(1,4,4),(2,4,1),(3,4,1),(4,4,1),(5,4,4),(6,4,1),(7,4,1),(8,4,1),(9,4,1),(1,5,4),(2,5,1),(3,5,1),(4,5,1),(5,5,4),(6,5,1),(7,5,1),(8,5,1),(9,5,1),(1,6,4),(2,6,1),(3,6,1),(4,6,1),(5,6,4),(6,6,1),(7,6,1),(8,6,1),(9,6,1),(1,7,4),(2,7,1),(3,7,2),(4,7,2),(5,7,4),(6,7,2),(7,7,2),(8,7,2),(9,7,2),(1,8,4),(2,8,1),(3,8,2),(4,8,2),(5,8,4),(6,8,2),(7,8,2),(8,8,2),(9,8,2),(1,9,4),(2,9,1),(3,9,1),(4,9,1),(5,9,4),(6,9,1),(7,9,1),(8,9,1),(9,9,1),(1,10,4),(2,10,1),(3,10,1),(4,10,1),(5,10,4),(6,10,1),(7,10,1),(8,10,1),(9,10,1),(1,11,4),(2,11,1),(3,11,1),(4,11,1),(5,11,4),(6,11,1),(7,11,1),(8,11,1),(9,11,1),(1,12,4),(2,12,1),(3,12,2),(4,12,2),(5,12,4),(6,12,2),(7,12,2),(8,12,2),(9,12,2),(1,13,4),(2,13,1),(3,13,2),(4,13,2),(5,13,4),(6,13,2),(7,13,2),(8,13,2),(9,13,2),(1,14,4),(2,14,1),(3,14,2),(4,14,2),(5,14,4),(6,14,2),(7,14,2),(8,14,2),(9,14,2),(1,15,4),(2,15,1),(3,15,2),(4,15,2),(5,15,4),(6,15,2),(7,15,2),(8,15,2),(9,15,2),(1,16,4),(2,16,1),(3,16,2),(4,16,2),(5,16,4),(6,16,2),(7,16,2),(8,16,2),(9,16,2),(1,17,4),(2,17,1),(3,17,2),(4,17,2),(5,17,4),(6,17,2),(7,17,2),(8,17,2),(9,17,2),(1,18,4),(2,18,1),(3,18,2),(4,18,2),(5,18,4),(6,18,2),(7,18,2),(8,18,2),(9,18,2),(1,19,4),(2,19,1),(3,19,1),(4,19,1),(5,19,4),(6,19,1),(7,19,1),(8,19,1),(9,19,1),(1,20,4),(2,20,1),(3,20,2),(4,20,2),(5,20,4),(6,20,2),(7,20,2),(8,20,2),(9,20,2),(1,21,4),(2,21,1),(3,21,2),(4,21,2),(5,21,4),(6,21,2),(7,21,2),(8,21,2),(9,21,2),(1,23,4),(2,23,1),(3,23,1),(4,23,1),(5,23,4),(6,23,1),(7,23,1),(8,23,1),(9,23,1),(1,24,4),(2,24,1),(3,24,1),(4,24,1),(5,24,4),(6,24,1),(7,24,1),(8,24,1),(9,24,1),(1,25,4),(2,25,1),(3,25,1),(4,25,1),(5,25,4),(6,25,1),(7,25,1),(8,25,1),(9,25,1),(1,26,4),(2,26,1),(3,26,1),(4,26,1),(5,26,4),(6,26,1),(7,26,1),(8,26,1),(9,26,1),(5,27,4),(1,28,4),(2,28,4),(3,28,4),(4,28,4),(5,28,4),(6,28,4),(7,28,4),(8,28,4),(9,28,4),(1,29,4),(2,29,2),(3,29,2),(4,29,2),(5,29,4),(6,29,2),(7,29,2),(8,29,2),(9,29,2),(1,30,4),(2,30,2),(3,30,2),(4,30,2),(5,30,4),(6,30,2),(7,30,2),(8,30,2),(9,30,2),(1,31,4),(2,31,2),(3,31,2),(4,31,2),(5,31,4),(6,31,2),(7,31,2),(8,31,2),(9,31,2),(1,32,4),(2,32,2),(3,32,2),(4,32,2),(5,32,4),(6,32,2),(7,32,2),(8,32,2),(9,32,2);

/*Table structure for table `t_user_type_mas` */

DROP TABLE IF EXISTS `t_user_type_mas`;

CREATE TABLE `t_user_type_mas` (
  `user_type_id_pk` int(11) NOT NULL AUTO_INCREMENT,
  `user_type_name` varchar(45) DEFAULT NULL,
  `user_type_desc` text,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_type_id_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `t_user_type_mas` */

insert  into `t_user_type_mas`(`user_type_id_pk`,`user_type_name`,`user_type_desc`,`created_by`,`updated_by`,`created_date`,`updated_date`,`status`) values (1,'Admin','Admin',NULL,NULL,NULL,NULL,1),(2,'Client',NULL,NULL,NULL,NULL,NULL,1),(3,'Employee',NULL,NULL,NULL,NULL,NULL,1);

/* Trigger structure for table `t_calender_loc_mas` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `insert_cal_loc_project_map` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'isteam'@'%' */ /*!50003 TRIGGER `insert_cal_loc_project_map` AFTER INSERT ON `t_calender_loc_mas` FOR EACH ROW BEGIN
	INSERT INTO t_calender_loc_project_map(cal_loc_id_fk,project_id_fk)	
	SELECT CM.cal_loc_id_pk,PM.project_id_pk FROM t_project_mas AS PM
	LEFT JOIN  t_calender_loc_mas AS CM ON CM.location_id_fk =PM.location_id_fk
	WHERE CM.location_id_fk =new.location_id_fk;
    END */$$


DELIMITER ;

/* Trigger structure for table `t_dashboard_mas` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `insert_new_dashboard_map` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'isteam'@'%' */ /*!50003 TRIGGER `insert_new_dashboard_map` AFTER INSERT ON `t_dashboard_mas` FOR EACH ROW BEGIN
	INSERT INTO t_user_dashboard_map(user_id_fk,db_id_fk,STATUS)
			SELECT user_id_pk,new.db_id_pk,1 FROM t_user_mas;
    END */$$


DELIMITER ;

/* Trigger structure for table `t_module_mas` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `insert_default_newmenu_to_role` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'isteam'@'%' */ /*!50003 TRIGGER `insert_default_newmenu_to_role` AFTER INSERT ON `t_module_mas` FOR EACH ROW BEGIN
	
	INSERT INTO t_user_role_module_map (module_id_fk,user_role_id_fk,acl_id_fk) 
	SELECT new.module_id_pk, 
		urm.user_role_id_pk, 
		CASE WHEN (urm.user_role_id_pk = 5 OR urm.user_role_id_pk = 1) THEN 4 ELSE 2 END AS acl 
	FROM t_user_role_mas urm WHERE urm.status=1; 
	
	
    END */$$


DELIMITER ;

/* Trigger structure for table `t_org_chart_trans` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `org_id_update` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'isteam'@'%' */ /*!50003 TRIGGER `org_id_update` BEFORE INSERT ON `t_org_chart_trans` FOR EACH ROW BEGIN
	if (NEW.org_chart_flag > 0) then
		SET NEW.org_chart_id_pk_tmp =LAST_INSERT_ID()+1;
	end if;	
    END */$$


DELIMITER ;

/* Trigger structure for table `t_user_mas` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `insert_default_admin_module` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'isteam'@'%' */ /*!50003 TRIGGER `insert_default_admin_module` AFTER INSERT ON `t_user_mas` FOR EACH ROW BEGIN
	INSERT INTO t_user_acl_trans(user_id_pk,module_id_pk,acl_id_pk) 
	SELECT new.user_id_pk,urm.module_id_fk,urm.acl_id_fk FROM t_user_role_module_map urm LEFT JOIN
	t_module_mas mm ON mm.module_id_pk=urm.module_id_fk WHERE urm.user_role_id_fk = new.user_role_id_fk AND mm.bucket_id_fk=4;
	
	INSERT INTO t_user_dashboard_map(user_id_fk,db_id_fk,STATUS)
				SELECT new.user_id_pk,db_id_pk,1 FROM t_dashboard_mas;
    END */$$


DELIMITER ;

/* Trigger structure for table `t_user_project_map` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `insert_default_project_module` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'isteam'@'%' */ /*!50003 TRIGGER `insert_default_project_module` AFTER INSERT ON `t_user_project_map` FOR EACH ROW BEGIN
	INSERT INTO t_user_acl_trans(division_id_fk,project_id_fk,user_id_pk,module_id_pk,acl_id_pk)
	SELECT new.division_id_fk,new.project_id_fk,new.user_id_fk,urm.module_id_fk,urm.acl_id_fk 
	FROM t_user_role_module_map urm
	LEFT JOIN t_module_mas mm ON mm.module_id_pk=urm.module_id_fk 
	INNER JOIN t_user_mas UM ON UM.user_role_id_fk =urm.user_role_id_fk AND UM.user_id_pk =new.user_id_fk
	WHERE mm.bucket_id_fk != 4;
    END */$$


DELIMITER ;

/* Procedure structure for procedure `burndownchart` */

/*!50003 DROP PROCEDURE IF EXISTS  `burndownchart` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`isteam`@`%` PROCEDURE `burndownchart`(in projectID int)
BEGIN
    	Declare phaseid int;
    	DECLARE projectplanmasID INT;
	Declare planedStartDate date;
	Declare planedEndDate date;
	DECLARE intFlag INT;
	Declare startDate date;
	Declare endDate date;
	Declare Planedcount int;
	Declare Actualcount int;
	Declare compcount int;
	Declare isHoliday int;
	#DROP TABLE tableburndownchart;
	DROP TABLE IF EXISTS `tableburndownchart`;
	CREATE TEMPORARY TABLE tableburndownchart (
	     Day int,
	     PlannedCount int,
	     ActualCount int,
	     CompletedCount int,
	    Date date
	);
		
	SELECT project_plan_mas_id_pk INTO  projectplanmasID FROM t_project_plan_mas WHERE project_id_fk=projectID; 
	select start_date,end_date into planedStartDate,planedEndDate from t_project_plan_trans where plan_mas_id_fk=projectplanmasID and parent_id=0;
	
	
	SET intFlag = 1;
	set isHoliday=0;
	SELECT planedStartDate into startDate;
	SELECT planedEndDate INTO endDate;	
	
	WHILE startDate <= endDate Do
		CALL get_isholiday(projectID,startDate,@holiday);
		SELECT @holiday into isHoliday;
		#drop table my_splits;
		if isHoliday=0 THEN
			select COUNT(project_plan_trans_id_pk) into Planedcount from t_project_plan_trans where plan_mas_id_fk=projectplanmasID AND parent_id!=0 
						and (start_date between startDate and endDate or end_date between startDate and endDate);
			select COUNT(project_plan_trans_id_pk) into Actualcount from t_project_plan_trans where plan_mas_id_fk=projectplanmasID AND parent_id!=0 
					and ((iFnull(actual_startdate,start_date)) between startDate and endDate or (iFnull(actual_enddate,end_date)) between startDate and endDate);
			select COUNT(project_plan_trans_id_pk) into compcount from t_project_plan_trans where plan_mas_id_fk=projectplanmasID and parent_id!=0 and iFnull(actual_enddate,end_date)=startDate;
			insert into tableburndownchart values(intFlag,Planedcount,Actualcount,compcount,startDate);
			SET intFlag = intFlag + 1;
					
		end if;
		SET startDate=(SELECT DATE_ADD(startDate, INTERVAL 1 DAY));
		
		IF startDate > endDate THEN
			SELECT MAX(actual_enddate) INTO endDate FROM t_project_plan_trans where plan_mas_id_fk=projectplanmasID AND parent_id!=0;
			 WHILE startDate <= endDate DO
				CALL get_isholiday(projectID,startDate,@holiday);
				SELECT @holiday INTO isHoliday;
				#DROP TABLE my_splits;
				IF isHoliday=0 THEN
					SELECT COUNT(project_plan_trans_id_pk) INTO Planedcount FROM t_project_plan_trans WHERE plan_mas_id_fk=projectplanmasID AND parent_id!=0 
						AND (start_date BETWEEN startDate AND endDate OR end_date BETWEEN startDate AND endDate);
					SELECT COUNT(project_plan_trans_id_pk) INTO Actualcount FROM t_project_plan_trans WHERE plan_mas_id_fk=projectplanmasID AND parent_id!=0 
							AND ((IFNULL(actual_startdate,start_date)) BETWEEN startDate AND endDate OR (IFNULL(actual_enddate,end_date)) BETWEEN startDate AND endDate);
					SELECT COUNT(project_plan_trans_id_pk) INTO compcount FROM t_project_plan_trans WHERE plan_mas_id_fk=projectplanmasID AND parent_id!=0 AND IFNULL(actual_enddate,end_date)=startDate;
					INSERT INTO tableburndownchart VALUES(intFlag,Planedcount,Actualcount,compcount,startDate);
					SET intFlag = intFlag + 1;
				
				END IF;
				SET startDate=(SELECT DATE_ADD(startDate, INTERVAL 1 DAY));
			 
			 END WHILE;
		END IF;	
		
	END WHILE;
	SELECT * FROM tableburndownchart;
	
    END */$$
DELIMITER ;

/* Procedure structure for procedure `get_isholiday` */

/*!50003 DROP PROCEDURE IF EXISTS  `get_isholiday` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`isteam`@`%` PROCEDURE `get_isholiday`(in projectID int,in selDate date,out isHoliday int)
BEGIN
    
	declare dateYear int;
	declare isExists int;
	declare dayweek int;
	DECLARE isSpecialWorking INT;
	SELECT EXTRACT(YEAR FROM selDate) into dateYear;
	SELECT (DAYOFWEEK(selDate)-1) into dayweek;
	set isHoliday = 0;
	set isExists = 0;
	SET isSpecialWorking = 0;
	#CALL split_string(4,2016);
	CALL split_string(projectID,dateYear);
	
	#special working days
	SELECT 1 INTO isSpecialWorking FROM t_special_workingday_trans AS SWT
	LEFT JOIN t_special_workingday_mas AS SWM ON SWM.splworking_id_pk=SWT.splworking_id_fk
	WHERE SWM.project_id_fk =3 and SWT.special_date=selDate;
	
	if isSpecialWorking=1 then
	  SET isHoliday=0;
	ELSE
		SELECT 1 INTO isExists FROM t_calender_loc_holidays_trans AS HT
		LEFT JOIN t_calender_loc_mas AS CM ON CM.cal_loc_id_pk = HT.cal_loc_id_fk
		LEFT JOIN t_calender_loc_project_map CPM ON CPM.cal_loc_id_fk = CM.cal_loc_id_pk
		WHERE CM.YEAR =dateYear AND CPM.project_id_fk=projectID AND holiday_date=selDate;
		
		IF isExists=1 THEN
			SET isHoliday=1;
		END IF;	
		
		SELECT 1 INTO isExists FROM my_splits WHERE splitted_column IN(dayweek);
		DROP TABLE my_splits;
		IF isExists=1 THEN
			SET isHoliday=1;
		END IF;	
	End if;
	
	
    END */$$
DELIMITER ;

/* Procedure structure for procedure `split_string` */

/*!50003 DROP PROCEDURE IF EXISTS  `split_string` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `split_string`(in projectID int,in selectedYear int)
BEGIN
DECLARE my_delimiter CHAR(1);
DECLARE split_string varchar(255);
DECLARE done INT;
DECLARE occurance INT;
DECLARE i INT;
DECLARE split_id INT;
DECLARE ins_query VARCHAR(500);
DECLARE splitter_cur CURSOR FOR
SELECT CM.cal_loc_id_pk AS ID,SUBSTRING(SUBSTRING(CM.weekoff_days, 2, (LENGTH(CM.weekoff_days))),1,(LENGTH(SUBSTRING(CM.weekoff_days, 2, (LENGTH(CM.weekoff_days))))-1)) AS wekkoffs FROM t_calender_loc_mas CM
INNER JOIN  t_calender_loc_project_map AS CPM ON CPM.cal_loc_id_fk = CM.cal_loc_id_pk
WHERE CPM.project_id_fk=projectID AND CM.YEAR =selectedYear;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done=1;
DROP TEMPORARY TABLE IF EXISTS `my_splits`;
CREATE TEMPORARY TABLE `my_splits` (
  `splitted_column` varchar(45) NOT NULL,
  `id` int(10) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
OPEN splitter_cur;
splitter_loop:LOOP
      FETCH splitter_cur INTO split_id,split_string;
SET occurance=length(split_string)-length(replace(split_string,',',''))+1;
SET my_delimiter=',';
  IF done=1 THEN
    LEAVE splitter_loop;
  END IF;
#  select occurance;
  IF occurance > 0 then
    #select occurance;
    set i=1;
    while i <= occurance do
#        select concat("SUBSTRING_INDEX(SUBSTRING_INDEX( '",split_string ,"', '",my_delimiter,"', ",i, "),'",my_delimiter,"',-1);");
        SET ins_query=concat("insert into my_splits(splitted_column,id) values(", concat("SUBSTRING_INDEX(SUBSTRING_INDEX( '",split_string ,"', '",my_delimiter,"', ",i, "),'",my_delimiter,"',-1),",split_id,");"));
#    select ins_query;
        set @ins_query=ins_query;
        PREPARE ins_query from @ins_query;
        EXECUTE ins_query;
      set i=i+1;
    end while;
  ELSE
        set ins_query=concat("insert into my_splits(splitted_column,id) values(",split_string,"',",split_id,");");
        set @ins_query=ins_query;
        PREPARE ins_query from @ins_query;
        EXECUTE ins_query;
  END IF;
  set occurance=0;
END LOOP;
CLOSE splitter_cur;
END */$$
DELIMITER ;

/* Procedure structure for procedure `statusreportchart` */

/*!50003 DROP PROCEDURE IF EXISTS  `statusreportchart` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`isteam`@`%` PROCEDURE `statusreportchart`(IN projectID INT)
BEGIN
	DECLARE phaseid INT;
    	DECLARE projectplanmasID INT;
	DECLARE planedStartDate DATE;
	DECLARE planedEndDate DATE;
	DECLARE intFlag INT;
	DECLARE startDate DATE;
	DECLARE endDate DATE;
	DECLARE openstatuscnt INT;
	DECLARE inprogresscnt INT;
	DECLARE pendingcnt INT;
	DECLARE closedcnt INT;
	DECLARE overduecnt INT;
	DECLARE isHoliday INT;
	#DROP TABLE tableburndownchart;
	DROP TABLE IF EXISTS `tablestatusreportchart`;
	CREATE TEMPORARY TABLE tablestatusreportchart (
	     DAY INT,
	     opencnt INT,
	     inprogresscnt INT,
	     pendingcnt INT,
	     closedcnt INT,
	     overduecnt INT,
	    DATE DATE
	);
	
	SELECT project_plan_mas_id_pk INTO  projectplanmasID FROM t_project_plan_mas WHERE project_id_fk=projectID; 
	SELECT start_date,end_date INTO planedStartDate,planedEndDate FROM t_project_plan_trans WHERE plan_mas_id_fk=projectplanmasID AND parent_id=0;
	
	SET intFlag = 1;
	SET isHoliday=0;
	SELECT planedStartDate INTO startDate;
	SELECT planedEndDate INTO endDate;
	
	WHILE startDate <= endDate DO
		CALL get_isholiday(projectID,startDate,@holiday);
		SELECT @holiday INTO isHoliday;
		#drop table my_splits;
		IF isHoliday=0 THEN
		SELECT COUNT(project_plan_trans_id_pk) INTO openstatuscnt FROM t_project_plan_trans WHERE plan_mas_id_fk=projectplanmasID AND parent_id!=0 
						AND start_date BETWEEN startDate AND endDate AND STATUS='STATUS_UNDEFINED'; #for openstatus
		SELECT COUNT(project_plan_trans_id_pk) INTO inprogresscnt FROM t_project_plan_trans WHERE plan_mas_id_fk=projectplanmasID AND parent_id!=0 
						AND start_date BETWEEN startDate AND endDate AND STATUS='STATUS_ACTIVE'; #for inprogress
		SELECT COUNT(project_plan_trans_id_pk) INTO pendingcnt FROM t_project_plan_trans WHERE plan_mas_id_fk=projectplanmasID AND parent_id!=0 
						AND start_date BETWEEN startDate AND endDate AND STATUS='STATUS_SUSPENDED'; #for pending
		SELECT COUNT(project_plan_trans_id_pk) INTO closedcnt FROM t_project_plan_trans WHERE plan_mas_id_fk=projectplanmasID AND parent_id!=0 
						AND start_date BETWEEN startDate AND endDate AND STATUS='STATUS_DONE'; #for closed
		SELECT COUNT(project_plan_trans_id_pk) INTO overduecnt FROM t_project_plan_trans WHERE plan_mas_id_fk=projectplanmasID AND parent_id!=0 
						AND start_date BETWEEN startDate AND endDate AND STATUS='STATUS_FAILED'; #for overdue
		INSERT INTO tablestatusreportchart VALUES(intFlag,openstatuscnt,inprogresscnt,pendingcnt,closedcnt,overduecnt,startDate);
		SET intFlag = intFlag + 1;
		End if;
		SET startDate=(SELECT DATE_ADD(startDate, INTERVAL 1 DAY));
	End while;
	SELECT * FROM tablestatusreportchart;
    END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;