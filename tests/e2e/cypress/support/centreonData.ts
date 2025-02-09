import { refreshButton } from '../integration/Resources-status/common';

import { apiActionV1, apiLoginV2, apiFilterResources } from './model';

interface Criteria {
  name: string;
  object_type: string | null;
  type: string;
  value: Array<{ id: string; name: string }>;
}
interface Filter {
  criterias: Array<Criteria>;
  name: string;
}

interface ActionClapi {
  action: string;
  object?: string;
  values: string;
}

interface Status {
  name: string;
  severity_code: number;
}
interface Resource {
  acknowledged: boolean;
  in_downtime: boolean;
  name: string;
  status: Status;
  type: 'host' | 'service';
}

const refreshListing = (): Cypress.Chainable => {
  return cy.get(refreshButton).click();
};

const executeActionViaClapi = (
  bodyContent: ActionClapi,
  method?: string,
): Cypress.Chainable => {
  return cy.request({
    body: bodyContent,
    headers: {
      'Content-Type': 'application/json',
      'centreon-auth-token': window.localStorage.getItem('userTokenApiV1'),
    },
    method: method || 'POST',
    url: `${apiActionV1}?action=action&object=centreon_clapi`,
  });
};

const setUserTokenApiV1 = (): Cypress.Chainable => {
  return cy.fixture('users/admin.json').then((userAdmin) => {
    return cy
      .request({
        body: {
          password: userAdmin.password,
          username: userAdmin.login,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: `${apiActionV1}?action=authenticate`,
      })
      .then(({ body }) =>
        window.localStorage.setItem('userTokenApiV1', body.authToken),
      );
  });
};

const setUserTokenApiV2 = (): Cypress.Chainable => {
  return cy.fixture('users/admin.json').then((userAdmin) => {
    return cy
      .request({
        body: {
          security: {
            credentials: {
              login: userAdmin.login,
              password: userAdmin.password,
            },
          },
        },
        method: 'POST',
        url: apiLoginV2,
      })
      .then(({ body }) =>
        window.localStorage.setItem('userTokenApiV2', body.security.token),
      );
  });
};

const setUserFilter = (body: Filter): Cypress.Chainable => {
  return cy
    .request({
      body,
      headers: {
        'X-Auth-Token': window.localStorage.getItem('userTokenApiV2'),
      },
      method: 'POST',
      url: apiFilterResources,
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      window.localStorage.setItem('filterUserId', response.body.id);
    });
};

const deleteUserFilter = (): Cypress.Chainable => {
  return cy
    .request({
      headers: {
        'X-Auth-Token': window.localStorage.getItem('userTokenApiV2'),
      },
      method: 'DELETE',
      url: `${apiFilterResources}/${window.localStorage.getItem(
        'filterUserId',
      )}`,
    })
    .then((response) => expect(response.status).to.eq(204));
};

const updateFixturesResult = (): Cypress.Chainable => {
  return cy
    .fixture('resources/clapi/submit-results.json')
    .then(({ results }) => {
      const timestampNow = Math.floor(Date.now() / 1000) - 15;

      const submitResults = results.map((submittedResult) => {
        return { ...submittedResult, updatetime: timestampNow.toString() };
      });

      return submitResults;
    });
};

const submitResultsViaClapi = (): Cypress.Chainable => {
  return updateFixturesResult().then((submitResults) => {
    return cy.request({
      body: { results: submitResults },
      headers: {
        'Content-Type': 'application/json',
        'centreon-auth-token': window.localStorage.getItem('userTokenApiV1'),
      },
      method: 'POST',
      url: `${apiActionV1}?action=submit&object=centreon_submit_results`,
    });
  });
};

const insertFixture = (file: string): Cypress.Chainable => {
  return cy.fixture(file).then(executeActionViaClapi);
};

const initializeResourceData = (): Cypress.Chainable => {
  const files = [
    'resources/clapi/host1/01-add.json',
    'resources/clapi/service1/01-add.json',
    'resources/clapi/service1/02-set-max-check.json',
    'resources/clapi/service1/03-disable-active-check.json',
    'resources/clapi/service1/04-enable-passive-check.json',
    'resources/clapi/service2/01-add.json',
    'resources/clapi/service2/02-set-max-check.json',
    'resources/clapi/service2/03-disable-active-check.json',
    'resources/clapi/service2/04-enable-passive-check.json',
    'resources/clapi/service3/01-add.json',
    'resources/clapi/service3/02-set-max-check.json',
    'resources/clapi/service3/03-disable-active-check.json',
    'resources/clapi/service3/04-enable-passive-check.json',
  ];

  return cy.wrap(Promise.all(files.map(insertFixture)));
};

const removeResourceData = (): Cypress.Chainable => {
  return executeActionViaClapi({
    action: 'DEL',
    object: 'HOST',
    values: 'test_host',
  });
};

const applyConfigurationViaClapi = (): Cypress.Chainable => {
  return executeActionViaClapi({
    action: 'APPLYCFG',
    values: '1',
  });
};

export {
  setUserTokenApiV1,
  setUserTokenApiV2,
  executeActionViaClapi,
  setUserFilter,
  deleteUserFilter,
  submitResultsViaClapi,
  initializeResourceData,
  removeResourceData,
  applyConfigurationViaClapi,
  refreshListing,
};
