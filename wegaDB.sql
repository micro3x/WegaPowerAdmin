CREATE DATABASE  IF NOT EXISTS `wegaDB` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `wegaDB`;
-- MySQL dump 10.13  Distrib 5.7.17, for Linux (x86_64)
--
-- Host: localhost    Database: wegaDB
-- ------------------------------------------------------
-- Server version	5.7.17-0ubuntu0.16.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `readingsData`
--

DROP TABLE IF EXISTS `readingsData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `readingsData` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utc_time` int(11) NOT NULL,
  `batv` int(11) DEFAULT NULL,
  `out1` int(11) DEFAULT NULL,
  `solv` int(11) DEFAULT NULL,
  `out2` int(11) DEFAULT NULL,
  `windv` int(11) DEFAULT NULL,
  `mppt` int(11) DEFAULT NULL,
  `windA` int(11) DEFAULT NULL,
  `outA` int(11) DEFAULT NULL,
  `rpm` int(11) DEFAULT NULL,
  `solA` int(11) DEFAULT NULL,
  `dumpA` int(11) DEFAULT NULL,
  `batCapacity` int(11) DEFAULT NULL,
  `batState` int(11) DEFAULT NULL,
  `dayOrNight` int(11) DEFAULT NULL,
  `nc` int(11) DEFAULT NULL,
  `head` int(11) DEFAULT NULL,
  `func` int(11) DEFAULT NULL,
  `address` int(11) DEFAULT NULL,
  `len` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `utc_time_UNIQUE` (`utc_time`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `idsettings` int(11) NOT NULL AUTO_INCREMENT,
  `setting_name` varchar(50) NOT NULL,
  `setting_val` varchar(500) NOT NULL,
  PRIMARY KEY (`idsettings`),
  UNIQUE KEY `idsettings_UNIQUE` (`idsettings`),
  UNIQUE KEY `settings_name_UNIQUE` (`setting_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-24 13:27:55