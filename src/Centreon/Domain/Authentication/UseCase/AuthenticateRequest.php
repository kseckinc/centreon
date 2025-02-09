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

namespace Centreon\Domain\Authentication\UseCase;

use Centreon\Domain\Authentication\Model\Credentials;

class AuthenticateRequest
{
    /**
     * @var string
     */
    private $login;

    /**
     * @var string
     */
    private $password;

    /**
     * @var string
     */
    private $providerConfigurationName;

    /**
     * @var string
     */
    private $centreonBaseUri;

    /**
     * @var string|null
     */
    private $refererQueryParameters;

    /**
     * @var string
     */
    private $clientIp;

    /**
     * @param Credentials $credentials
     * @param string $providerConfigurationName
     * @param string $centreonBaseUri
     * @param string|null $referer
     */
    public function __construct(
        Credentials $credentials,
        string $providerConfigurationName,
        string $centreonBaseUri,
        ?string $referer,
        string $clientIp
    ) {
        $this->login = $credentials->getLogin();
        $this->password = $credentials->getPassword();
        $this->providerConfigurationName = $providerConfigurationName;
        $this->centreonBaseUri = $centreonBaseUri;
        if ($referer !== null) {
            $this->refererQueryParameters = parse_url($referer, PHP_URL_QUERY) ?: null;
        }
        $this->clientIp = $clientIp;
    }

    /**
     * Get user login.
     *
     * @return string
     */
    public function getLogin(): string
    {
        return $this->login;
    }

    /**
     * Get user password.
     *
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * Get provider configuration name.
     *
     * @return string
     */
    public function getProviderConfigurationName(): string
    {
        return $this->providerConfigurationName;
    }

    /**
     * Get redirection uri.
     *
     * @return string
     */
    public function getCentreonBaseUri(): string
    {
        return $this->centreonBaseUri;
    }

    /**
     * Get the GET parameters of a query.
     *
     * @return string|null
     */
    public function getRefererQueryParameters(): ?string
    {
        return $this->refererQueryParameters;
    }

    /**
     * Get the Client IP.
     *
     * @return string
     */
    public function getClientIp(): string
    {
        return $this->clientIp;
    }
}
