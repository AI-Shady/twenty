import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsApiKeysTable } from '@/settings/developers/components/SettingsApiKeysTable';
import { SettingsReadDocumentationButton } from '@/settings/developers/components/SettingsReadDocumentationButton';
import { SettingsWebhooksTable } from '@/settings/developers/components/SettingsWebhooksTable';
import { getSettingsPagePath } from '@/settings/utils/getSettingsPagePath';
import { SettingsPath } from '@/types/SettingsPath';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { Button, H2Title, IconPlus, MOBILE_VIEWPORT, Section } from 'twenty-ui';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing(2)};
  @media (max-width: ${MOBILE_VIEWPORT}px) {
    padding-top: ${({ theme }) => theme.spacing(5)};
  }
`;

const StyledContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const SettingsDevelopers = () => {
  const isMobile = useIsMobile();
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={t`Developers`}
      actionButton={<SettingsReadDocumentationButton />}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPagePath(SettingsPath.Workspace),
        },
        { children: t`Developers` },
      ]}
    >
      <SettingsPageContainer>
        <StyledContainer isMobile={isMobile}>
          <Section>
            <H2Title
              title={t`API keys`}
              description={t`Active APIs keys created by you or your team.`}
            />
            <SettingsApiKeysTable />
            <StyledButtonContainer>
              <Button
                Icon={IconPlus}
                title={t`Create API key`}
                size="small"
                variant="secondary"
                to={'/settings/developers/api-keys/new'}
              />
            </StyledButtonContainer>
          </Section>
          <Section>
            <H2Title
              title={t`Webhooks`}
              description={t`Establish Webhook endpoints for notifications on asynchronous events.`}
            />
            <SettingsWebhooksTable />
            <StyledButtonContainer>
              <Button
                Icon={IconPlus}
                title={t`Create Webhook`}
                size="small"
                variant="secondary"
                to={'/settings/developers/webhooks/new'}
              />
            </StyledButtonContainer>
          </Section>
        </StyledContainer>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
