import * as React from 'react';

import { useTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import WizardFormInstallingStatus from '../../components/wizardFormInstallingStatus';
import ProgressBar from '../../components/progressBar';
import BaseWizard from '../../components/forms/baseWizard';

const links = [
  {
    active: true,
    number: 1,
    prevActive: true,
  },
  { active: true, number: 2, prevActive: true },
  { active: true, number: 3, prevActive: true },
  { active: true, number: 4 },
];

interface Props {
  pollerData;
}

const PollerStepThreeRoute = ({ pollerData }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <BaseWizard>
      <ProgressBar links={links} />
      <WizardFormInstallingStatus
        formTitle={`${t('Finalizing Setup')}`}
        statusCreating={pollerData.submitStatus}
        statusGenerating={null}
      />
    </BaseWizard>
  );
};

const mapStateToProps = ({ pollerForm }): Props => ({
  pollerData: pollerForm,
});

const mapDispatchToProps = {};

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(PollerStepThreeRoute),
);
