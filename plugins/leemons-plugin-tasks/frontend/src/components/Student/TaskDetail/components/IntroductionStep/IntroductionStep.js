import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ContextContainer,
  HtmlText,
  ImageLoader,
  Button,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  Alert,
} from '@bubbles-ui/components';
import useAssets from '@leebrary/request/hooks/queries/useAssets';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import dayjs from 'dayjs';
import useIntroductionStepStyles from './IntroductionStep.styles';
import CurriculumRender from './components/CurriculumRender/CurriculumRender';

export default function IntroductionStep({ stepName, instance, onNextStep, scrollRef }) {
  const [t] = useTranslateLoader(prefixPN('task_realization.introduction_step'));
  const [buttonsT] = useTranslateLoader(prefixPN('task_realization.buttons'));

  const { assignable } = instance ?? {};
  /*
    === Preview Image ===
  */
  const previewImage = assignable?.metadata?.leebrary?.statementImage?.[0];
  const { data: previewAsset } = useAssets({
    ids: [previewImage],
    filters: {
      indexable: false,
      showPublic: true,
    },
    enabled: !!previewImage,
    select: (response) => response?.[0] ?? undefined,
  });

  /*
    === Resources ===
  */
  const resources = assignable?.resources;
  const { data: resourcesAssets } = useAssets({
    ids: resources,
    filters: {
      indexable: false,
      showPublic: true,
    },
    enabled: !!resources,
  });

  /*
    === Handle activity dates ===
  */
  const activityIsInVisualizationMode =
    !instance?.alwaysAvailable && dayjs(instance?.dates?.start ?? null).isAfter(dayjs());

  const { classes } = useIntroductionStepStyles();

  return (
    <TotalLayoutStepContainer
      stepName={stepName}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          rightZone={
            <Button
              variant="outline"
              rightIcon={<ChevRightIcon />}
              onClick={onNextStep}
              disabled={activityIsInVisualizationMode}
            >
              {buttonsT('next')}
            </Button>
          }
        />
      }
    >
      <Box className={classes.root}>
        {!!activityIsInVisualizationMode && (
          <Alert type="info" closeable={false} title={t('not_opened.title')}>
            {t('not_opened.description', {
              date: dayjs(instance?.dates?.start).format('DD/mm/YYYY'),
              time: dayjs(instance?.dates?.start).format('HH:mm'),
            })}
          </Alert>
        )}
        {!!assignable?.statement && (
          <Box className={classes.statementContainer}>
            <ContextContainer title={t('statement')}>
              <HtmlText>{assignable?.statement}</HtmlText>
            </ContextContainer>

            {!!previewAsset && <ImageLoader src={previewAsset.url} width={300} height={150} />}
          </Box>
        )}

        {!assignable?.statement && !!previewAsset && (
          <ContextContainer title={t('statement')}>
            <ImageLoader src={previewAsset.url} width={300} height={150} />
          </ContextContainer>
        )}

        {!!resourcesAssets?.length && (
          <Box>
            <ContextContainer title={t('resources')}>
              TODO: Add new component
              <ul>
                {resourcesAssets.map((asset) => (
                  <li key={asset.id}>
                    <a href={asset.url} target="_blank" rel="noopener noreferrer">
                      {asset.name}
                    </a>
                  </li>
                ))}
              </ul>
            </ContextContainer>
          </Box>
        )}

        <CurriculumRender instance={instance} showCurriculum={instance?.curriculum ?? {}} />
      </Box>
    </TotalLayoutStepContainer>
  );
}

IntroductionStep.propTypes = {
  stepName: PropTypes.string,
  instance: PropTypes.object,

  onNextStep: PropTypes.func,
  scrollRef: PropTypes.object,
};
