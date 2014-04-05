CREATE TABLE IF NOT EXISTS `questrcode_players` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'the unused user id',
  `name` varchar(32) NOT NULL COMMENT 'The user name',
  `teamId` int(9) unsigned NOT NULL COMMENT 'The id of the team the user belongs to',
  PRIMARY KEY (`id`),
  KEY `teamId` (`teamId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='List of users and teams' AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `questrcode_actions` (
  `id` int(32) NOT NULL AUTO_INCREMENT COMMENT 'id for repeated actions',
  `teamId` int(9) NOT NULL,
  `gameId` int(9) NOT NULL,
  `riddleId` varchar(32) NOT NULL,
  `clueId` varchar(32) NOT NULL,
  `serverTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `clientTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `teamId` (`teamId`),
  KEY `gameId` (`gameId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='A table storing all actions' AUTO_INCREMENT=1 ;
