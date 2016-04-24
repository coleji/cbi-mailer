-- MySQL dump 10.13  Distrib 5.5.49, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: email_spool
-- ------------------------------------------------------
-- Server version	5.5.49-0ubuntu0.14.04.1

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
-- Table structure for table `emails_pending`
--

DROP TABLE IF EXISTS `emails_pending`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emails_pending` (
  `trackingId` int(11) NOT NULL,
  `toAddr` varchar(4000) DEFAULT NULL,
  `rcptTo` varchar(4000) DEFAULT NULL,
  `fromAddr` varchar(200) DEFAULT NULL,
  `replyToAddr` varchar(200) DEFAULT NULL,
  `subject` varchar(1000) DEFAULT NULL,
  `plainBody` text,
  `checksum` varchar(50) DEFAULT NULL,
  `htmlBody` text,
  `miscHeaders` varchar(4000) DEFAULT NULL,
  `ccAddr` varchar(4000) DEFAULT NULL,
  `bccAddr` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`trackingId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emails_pending`
--

LOCK TABLES `emails_pending` WRITE;
/*!40000 ALTER TABLE `emails_pending` DISABLE KEYS */;
/*!40000 ALTER TABLE `emails_pending` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emails_sent`
--

DROP TABLE IF EXISTS `emails_sent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emails_sent` (
  `trackingId` int(11) NOT NULL,
  PRIMARY KEY (`trackingId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emails_sent`
--

LOCK TABLES `emails_sent` WRITE;
/*!40000 ALTER TABLE `emails_sent` DISABLE KEYS */;
/*!40000 ALTER TABLE `emails_sent` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-24 12:52:25
