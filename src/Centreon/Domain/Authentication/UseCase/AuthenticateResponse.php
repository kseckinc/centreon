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

class AuthenticateResponse
{
    public const REDIRECT_URI_KEY = 'redirect_uri';

    /**
     * @var string
     */
    private $redirectionUri;

    /**
     * Return the redirection URI.
     *
     * @return string
     */
    public function getRedirectionUri(): string
    {
        return $this->redirectionUri;
    }

    /**
     * @param string $redirectionUri
     */
    public function setRedirectionUri(string $redirectionUri): void
    {
        $this->redirectionUri = $redirectionUri;
    }

    /**
     * Return an array with redirection URI formatted to an API Response.
     *
     * @return array<string,string>
     */
    public function getRedirectionUriApi(): array
    {
        return [self::REDIRECT_URI_KEY => $this->redirectionUri];
    }
}
