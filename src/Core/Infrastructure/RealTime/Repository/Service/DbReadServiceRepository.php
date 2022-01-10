<?php

/*
 * Copyright 2005 - 2021 Centreon (https://www.centreon.com/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * For more information : contact@centreon.com
 *
 */
declare(strict_types=1);

namespace Core\Infrastructure\RealTime\Repository\Service;

use Core\Domain\RealTime\Model\Service;
use Centreon\Infrastructure\DatabaseConnection;
use Centreon\Infrastructure\Repository\AbstractRepositoryDRB;
use Core\Application\RealTime\Repository\ReadServiceRepositoryInterface;

class DbReadServiceRepository extends AbstractRepositoryDRB implements ReadServiceRepositoryInterface
{
    /**
     * @param DatabaseConnection $db
     */
    public function __construct(DatabaseConnection $db)
    {
        $this->db = $db;
    }

    /**
     * @inheritDoc
     */
    public function findServiceById(int $serviceId): ?Service
    {
        return $this->findServiceRequest($serviceId);
    }

    /**
     * @inheritDoc
     */
    public function findServiceByIdAndAccessGroupIds(int $serviceId, array $accessGroupIds): ?Service
    {
        if (empty($accessGroupIds)) {
            return null;
        }

        $accessGroupRequest = ' INNER JOIN `:dbstg`.`centreon_acl` AS service_acl
            ON service_acl.service_id = s.service_id
            AND service_acl.group_id IN (' . implode(',', $accessGroupIds) . ') ';

        return $this->findServiceRequest($serviceId, $accessGroupRequest);
    }

    /**
     * @param int $serviceId
     * @param string|null $accessGroupRequest
     * @return Service|null
     */
    private function findServiceRequest(int $serviceId, ?string $accessGroupRequest = null): ?Service
    {
        $request = "SELECT
                s.service_id,
                s.host_id,
                s.description,
                s.output,
                s.flapping,
                s.scheduled_downtime_depth AS `in_downtime`,
                s.acknowledged,
                s.state AS `status_code`,
                s.perfData AS `performance_data`,
                s.output,
                s.command_line,
                s.notification_number,
                s.last_state_change AS `last_status_change`,
                s.last_notification,
                s.latency,
                s.execution_time,
                s.percent_state_change AS `status_change_percentage`,
                s.next_check,
                s.last_check,
                s.passive_checks,
                s.active_checks,
                s.last_time_ok,
                service_cvl.value AS `severity_level`,
                s.icon_image_alt AS `icon_name`,
                s.icon_image AS `icon_url`,
                s.check_attempt,
                s.max_check_attempts,
                s.state_type
            FROM `:dbstg`.`services` AS s
            LEFT JOIN `:dbstg`.`customvariables` AS service_cvl ON service_cvl.service_id = s.service_id
                AND service_cvl.name = 'CRITICALITY_LEVEL'" .
            ($accessGroupRequest !== null ? $accessGroupRequest : '') .
            "WHERE  s.service_id = :service_id AND s.enabled = '1'";

        $statement = $this->db->prepare($this->translateDbName($request));

        $statement->bindValue(':service_id', $serviceId, \PDO::PARAM_INT);

        $statement->execute();

        if ($row = $statement->fetch(\PDO::FETCH_ASSOC)) {
            return DbServiceFactory::createFromRecord($row);
        }

        return null;
    }
}
